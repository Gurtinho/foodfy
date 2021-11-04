const express = require('express')
const nunjucks = require('nunjucks')
const foods = require('./data')
const routes = require('./routes')
const port = 3333

const server = express()

//middlewares
server.use(express.static('public'))

server.use(routes)

//setar html como nunjucks
server.set("view engine", "njk")
nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

//server run
server.listen(port, (req, res) => {})