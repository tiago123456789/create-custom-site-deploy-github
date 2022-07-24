const ejs = require("ejs")

class TemplateEngine {

    render(path, data) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(path, data, (error, html) => {
                if (error) {
                    return reject(error)
                }
                resolve(html);
            })
        })
    }
}

const templateEngine = new TemplateEngine();
module.exports = templateEngine;