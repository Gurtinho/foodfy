const express = require('express')
const routes = express.Router()

const home = require('./home')
const chefs = require('./chefs')
const recipes = require('./recipes')
const users = require('./users')
const session = require('./session')
const profile = require('./profile')
const admins = require('./usersAdmin')

routes.use(home)
routes.use('/admin/chefs', chefs)
routes.use('/admin/recipes', recipes)
routes.use('/admin/users', users)
routes.use('/admin/session', session)
routes.use('/admin/profile', profile)
routes.use('/admin/admins', admins)

routes.use((req, res) => res.status(404).render("error/not-found"))

module.exports = routes