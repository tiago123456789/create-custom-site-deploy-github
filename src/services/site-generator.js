const templateEngine = require("../util/template-engine")
const { translate } = require("../util/i18n");
const Github = require("../services/github")

class SiteGenerator {

    constructor() {
        this.github = new Github();
    }

    async deploy(custom_data_pt, custom_data_en, accessToken) {
        let data = {};
        let languageOption = ""
        let user;

        if (custom_data_en && custom_data_pt) {
            data["pt"] = JSON.parse(custom_data_pt)
            data["en"] = JSON.parse(custom_data_en)
        } else {
            const dataSpecificLanguage = custom_data_pt.trim().length > 0
                ? { pt: JSON.parse(custom_data_pt) }
                : { en: JSON.parse(custom_data_en) }
            data = dataSpecificLanguage
        }


        user = await this.github.getUser(accessToken)
        const isExistRepository = await this.github.isExistRepository(
            user, `${user.login}.github.io`, accessToken
        )

        let isSettedIndex = false
        const hasManyLanguages = Object.keys(data).length > 1
        if (hasManyLanguages) {
            languageOption = Object.keys(data).map(language => {
                if (!isSettedIndex) {
                    isSettedIndex = true;
                    return `
                        <li>
                            <a class="scrollto" href="${`./index.html`}">${language.toUpperCase()}</a>
                        </li>
                    `
                }
                return `
                        <li>
                            <a class="scrollto" href="${`./index-${language}.html`}">${language.toUpperCase()}</a>
                        </li>
                    `
            }).join("")
        }

        isSettedIndex = false;
        await Object.keys(data).map(async language => {
            const customDataOfLanguage = data[language]
            const html = await templateEngine.render(`./template/index.html`, { language, translate, ...customDataOfLanguage, languageOption })

            const filename = !isSettedIndex ? "index.html" : `index-${language}.html`
            if (!isSettedIndex) {
                isSettedIndex = true;
            }

            if (!isExistRepository) {
                await this.github.newRepository(`${user.login}.github.io`, accessToken)
            }

            const fileExist = await this.github.getFileOfRepository(
                user, `${user.login}.github.io`,
                filename, accessToken
            )
            if (fileExist) {
                await this.github.uploadNewVersionFile(
                    user, `${user.login}.github.io`, filename,
                    fileExist.sha, html, accessToken
                )
            } else {
                await this.github.uploadNewFile(
                    user, `${user.login}.github.io`, filename,
                    html, accessToken
                )
            }

        })

        return `https://${user.login}.github.io`;
    }   

    preview(token) {
        let content = Buffer.from(token, "base64").toString("utf-8")
        content = JSON.parse(content)
        return templateEngine.render("./template/index.html", { ...content, languageOption: "", translate });
    }
}

const siteGenerator = new SiteGenerator();

module.exports = siteGenerator