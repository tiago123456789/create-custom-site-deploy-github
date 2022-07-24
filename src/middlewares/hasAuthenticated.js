const hasAuthenticated = (request, response, next) => {
    if (request.session.accessToken != null) {
        return next();
    }
    return response.redirect("/login")
}

module.exports = hasAuthenticated;