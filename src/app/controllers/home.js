const db = require('../../config/db')

module.exports = {
    about(req, res) {
        return res.render("home/about")
    },

    home(req, res) {
        return res.render("home/home")
    },

    recipes(req, res) {
        return res.render("home/recipes")
    },

    id(req, res) {
        return
    },
}
