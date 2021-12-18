const express = require('express')
const routes = express.Router()

const UserValidator = require('../app/validators/userValidator')
const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/admin/users', UserController.list)
// routes.post('/admin/users', UserController.post)
// routes.get('/admin/users/create', UserController.create)
// routes.put('/admin/users/:id', UserController.put)
// routes.get('/admin/users/:id/edit', UserController.edit)
// routes.delete('/admin/users/:id', UserController.delete)