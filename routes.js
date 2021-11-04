//servindo as rotas
const express = require('express')
const foods = require('./data')
const routes = express.Router()

//routes
routes.get("/", (req, res) => {
    return res.render("home", { items: foods })
})

routes.get("/about", (req, res) => {
    return res.render("about")
})

routes.get("/recipes", (req, res) => {
    return res.render("recipes", { items: foods })
})

//rota - pagina de receitas
routes.get("/food/:index", function(req, res){
    const food = [ ...foods ]
    const foodIndex = req.params.index
    const foodall = (food[ foodIndex ])
    return res.render("food", { item:foodall })
})

//server error
routes.use(function(req, res) {
    res.status(404).render("not-found")
})

module.exports = routes