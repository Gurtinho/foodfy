const express = require('express')
const routes = express.Router()

const ProfileValidator = require('../app/validators/Profile')
const ProfileController = require('../app/controllers/ProfileController')

const { onlyUsers } = require('../app/middlewares/session')

routes.get('/index', onlyUsers, ProfileController.index)
routes.post('/index', onlyUsers, ProfileValidator.update, ProfileController.update)

module.exports = routes