const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const routes = require('./routes')
const port = 3333

const server = express()

//middlewares
server.use(express.urlencoded({ extended: true })) // enviar dados do req.body
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

// html nunjucks
server.set("view engine", "njk")
nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

// listening
server.listen(port)