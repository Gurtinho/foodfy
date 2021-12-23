const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const chefs = require('../app/controllers/ChefController')

const ChefValidator = require('../app/validators/Chef')
const { onlyUsers, onlyAdminUsers } = require('../app/middlewares/session')

routes.get('/', onlyUsers, chefs.index)
routes.get('/create', onlyUsers, onlyAdminUsers, chefs.create)
routes.get('/:id', onlyUsers, chefs.show)
routes.get('/:id/edit', onlyUsers, onlyAdminUsers, chefs.edit)
routes.post('/', onlyUsers, onlyAdminUsers, multer.array('file_id', 1), ChefValidator.post, chefs.post)
routes.put('/', onlyUsers, onlyAdminUsers, multer.array('file_id', 1), ChefValidator.put, chefs.put)
routes.delete('/', onlyUsers, onlyAdminUsers, chefs.delete)

module.exports = routes