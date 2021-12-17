const express = require('express')
const routes = express.Router()

const session = require('../app/controllers/SessionController')
const user = require('../app/controllers/UserController')

const validator = require('../app/validators/userValidator')

// // login / logout
// routes.get('/login', session.loginForm)
// routes.post('/login', session.login)
// routes.post('/login', session.logout)

// // password forgot
// routes.get('/forgot-password', session.forgotForm)
// routes.get('/password-reset', session.resetForm)
// routes.post('/forgot-password', session.forgot)
// routes.post('/password-reset', session.reset)

// // user register
routes.get('/register', user.registerForm)
routes.post('/register', validator.post, user.post)

// routes.get('/', user.show)
// routes.get('/', user.put)
// routes.get('/', user.delete)

module.exports = routes