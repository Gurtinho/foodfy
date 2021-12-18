const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/RecipeController')

// recipes
routes.get('/', recipes.index)
routes.get('/create', recipes.create)
routes.get('/:id', recipes.show)
routes.get('/:id/edit', recipes.edit)
routes.post('/', multer.array('image', 5), recipes.post)
routes.put('/', multer.array('image', 5), recipes.put)
routes.delete('/', recipes.delete)

module.exports = routes