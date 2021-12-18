const express = require('express')
const routes = express.Router()

const SessionValidator = require('../app/validators/Session')
const SessionController = require('../app/controllers/SessionController')

// login / logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// password forgot
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/password-reset', SessionController.reset)

module.exports = routes
