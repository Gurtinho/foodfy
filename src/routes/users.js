const express = require('express')
const routes = express.Router()

const UserValidator = require('../app/validators/User')
const UserController = require('../app/controllers/UserController')

// user register
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

module.exports = routes