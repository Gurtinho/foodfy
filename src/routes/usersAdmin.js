const express = require('express')
const routes = express.Router()

const UserAdminController = require('../app/controllers/UserAdminController')

const { onlyUsers, onlyAdminUsers } = require('../app/middlewares/session')

// admins
routes.get('/list', onlyUsers, onlyAdminUsers, UserAdminController.list)
routes.get('/create', onlyUsers, onlyAdminUsers, UserAdminController.create)
routes.post('/create', onlyUsers, onlyAdminUsers, UserAdminController.post)
routes.get('/:id/edit', onlyUsers, onlyAdminUsers, UserAdminController.edit)
routes.post('/', onlyUsers, onlyAdminUsers, UserAdminController.put)
routes.post('/', onlyUsers, onlyAdminUsers, UserAdminController.delete)

module.exports = routes