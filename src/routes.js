const express = require('express')
const home = require('./app/controllers/home')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

const routes = express.Router()

// home
routes.get("/", home.home)
routes.get("/about", home.about)
routes.get("/recipes", home.recipes)
routes.get('/chefs', home.chefs)
routes.get("/chefs/:id", home.show)
routes.get("/recipes/food/:id", home.id)
routes.get('/search', home.search)

// recipes
routes.get('/admin/recipes', recipes.index)
routes.get('/admin/recipes/create', recipes.create)
routes.get('/admin/recipes/:id', recipes.show)
routes.get('/admin/recipes/:id/edit', recipes.edit)
routes.post('/admin/recipes', recipes.post)
routes.put('/admin/recipes', recipes.put)
routes.delete('/admin/recipes', recipes.delete)

// chefs
routes.get('/admin/chefs', chefs.index)
routes.get('/admin/chefs/create', chefs.create)
routes.get('/admin/chefs/:id', chefs.show)
routes.get('/admin/chefs/:id/edit', chefs.edit)
routes.post('/admin/chefs', chefs.post)
routes.put('/admin/chefs', chefs.put)
routes.delete('/admin/chefs', chefs.delete)


//server error
routes.use((req, res) => {
    res.status(404).render("error/not-found")
})

module.exports = routes