const express = require('express')
const routes = express.Router()

const multer = require('./app/middlewares/multer')

const home = require('./app/controllers/homeControllers')
const recipes = require('./app/controllers/recipesControllers')
const chefs = require('./app/controllers/chefsControllers')


// home
routes.get("/", home.home)
routes.get("/about", home.about)
routes.get("/recipes", home.recipes)
routes.get('/chefs', home.chefs)
routes.get("/chefs/:id", home.chefShow)
routes.get("/recipes/food/:id", home.recipeShow)
routes.get('/search', home.search)

// recipes
routes.get('/admin/recipes', recipes.index)
routes.get('/admin/recipes/create', recipes.create)
routes.get('/admin/recipes/:id', recipes.show)
routes.get('/admin/recipes/:id/edit', recipes.edit)
routes.post('/admin/recipes', multer.array('image', 5), recipes.post)
routes.put('/admin/recipes', multer.array('image', 5), recipes.put)
routes.delete('/admin/recipes', recipes.delete)

// chefs
routes.get('/admin/chefs', chefs.index)
routes.get('/admin/chefs/create', chefs.create)
routes.get('/admin/chefs/:id', chefs.show)
routes.get('/admin/chefs/:id/edit', chefs.edit)
routes.post('/admin/chefs', multer.array('file_id', 1), chefs.post)
routes.put('/admin/chefs', multer.array('file_id', 1), chefs.put)
routes.delete('/admin/chefs', chefs.delete)

//server error
routes.use((req, res) => {
    res.status(404).render("error/not-found")
})

module.exports = routes