const express = require('express')
const routes = express.Router()

const home = require('../app/controllers/HomeController')
const search = require('../app/controllers/SearchController')

// search recipes && chefs
routes.get('/search', search.search)

// home
routes.get("/", home.home)
routes.get("/about", home.about)
routes.get("/recipes", home.recipes)
routes.get('/chefs', home.chefs)
routes.get("/chefs/:id", home.chefShow)
routes.get("/recipes/food/:id", home.recipeShow)

module.exports = routes