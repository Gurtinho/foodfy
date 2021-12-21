const express = require('express')
const routes = express.Router()

const UserAdminController = require('../app/controllers/UserAdminController')

const { onlyUsers, onlyAdminUsers } = require('../app/middlewares/session')

// users
routes.get('/index', onlyUsers, UserAdminController.index)
// routes.get('/create', onlyUsers, onlyAdminUsers, UserAdminController.create)
// routes.post('/', onlyUsers, onlyAdminUsers, UserAdminController.post)
// routes.get('/edit', onlyUsers, onlyAdminUsers, UserAdminController.edit)
// routes.post('/put', onlyUsers, onlyAdminUsers, UserAdminController.put)
// routes.post('/delete', onlyUsers, onlyAdminUsers, UserAdminController.delete)

module.exports = routes