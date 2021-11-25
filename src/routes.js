//servindo as rotas
const express = require('express')
const home = require('./app/controllers/home')
const recipes = require('./app/controllers/recipes')
const routes = express.Router()

// home
routes.get("/", home.home)
routes.get("/about", home.about)
routes.get("/recipes", home.recipes)
routes.get("/food/:id", home.id)

// recipes
routes.get('/admin/recipes/index', recipes.index)
routes.get('/admin/recipes/create', recipes.create)
routes.get('/admin/recipes/:id', recipes.show)
routes.get('/admin/recipes/:id/edit', recipes.edit)
routes.post('/admin/recipes', recipes.post)
routes.put('/admin/recipes', recipes.put)
routes.delete('/admin/recipes', recipes.delete)

//server error
routes.use((req, res) => {
    res.status(404).render("error/not-found")
})

module.exports = routes