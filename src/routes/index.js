const express = require('express')
const routes = express.Router()

const home = require('./home')
const chefs = require('./chefs')
const recipes = require('./recipes')
const users = require('./users')

routes.use(home)
routes.use('/admin/chefs', chefs)
routes.use('/admin/recipes', recipes)
routes.use('/users', users)

routes.get('/accounts', (req, res) => res.redirect('users/register'))
routes.use((req, res) => res.status(404).render("error/not-found"))

module.exports = routes