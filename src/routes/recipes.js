const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/RecipeController')

const { onlyUsers, onlyAdminUsers } = require('../app/middlewares/session')

// recipes
routes.get('/', onlyUsers, recipes.indexUsersRecipes)
routes.get('/all', onlyUsers, onlyAdminUsers, recipes.index)

routes.get('/create', onlyUsers, recipes.create)
routes.get('/:id', onlyUsers, recipes.show)
routes.get('/:id/edit', onlyUsers, recipes.edit)
routes.post('/', onlyUsers, multer.array('image', 5), recipes.post)
routes.put('/', onlyUsers, multer.array('image', 5), recipes.put)
routes.delete('/', onlyUsers, recipes.delete)

module.exports = routes