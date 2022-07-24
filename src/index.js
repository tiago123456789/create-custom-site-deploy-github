require("dotenv").config()
const express = require("express");
const app = express();
const session = require('express-session');
const routesApp = require("./routes/index")

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }
}))

app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.session.accessToken != null;
    next();
});

routesApp(app);

app.listen(process.env.PORT || 3000, () => console.log("Server is running at http://localhost:3000"))


