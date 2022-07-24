const Github = require("../services/github")
const hasAuthenticated = require("../middlewares/hasAuthenticated");
const siteGenerator = require("../services/site-generator");
const CONSTANTS = require("../constants/app")

module.exports = (app) => {

    app.get("/", hasAuthenticated, (request, response) => {
        return response.render("index", { structure_custom_data_site: JSON.stringify(CONSTANTS.STRUCTURE_CUSTOM_DATA_SITE, null, 2) })
    })
    
    app.post("/deploy", hasAuthenticated, async (request, response) => {
        try {
            const { custom_data_pt, custom_data_en } = request.body
            const link = await siteGenerator.deploy(
                custom_data_pt, 
                custom_data_en,
                request.session.accessToken
            )
            return response.render("deploySuccess", { link });
        } catch (error) {
            console.log(error);
            response.sendStatus(500)
        }
    })
    
    app.get("/oauth-callback", async (request, response) => {
        const { code } = request.query;
        const accessToken = await new Github().authenticate(code);
        request.session.accessToken = accessToken;
        return response.redirect("/")
    
    })
    
    app.get("/preview", hasAuthenticated, async (request, response) => {
        const html = await siteGenerator.preview(request.query.token);
        return response.send(html)
    })
    
    app.get("/login", (request, response) => {
        return response.render("login")
    })
    
}