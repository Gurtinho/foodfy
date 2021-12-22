const express = require('express')
const routes = express.Router()

const SessionValidator = require('../app/validators/Session')
const SessionController = require('../app/controllers/SessionController')

// login / logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// password forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/reset-password', SessionController.resetForm)
routes.put('/reset-password', SessionValidator.reset, SessionController.reset)

module.exports = routes
