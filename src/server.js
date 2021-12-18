const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const session = require('./config/session')
const routes = require('./routes')
const port = 3333

const server = express()

//middlewares
server.use(session)
server.use((req, res, next) => {
    // global session
    res.locals.session = req.session
    next()
})

server.use(express.urlencoded({ extended: true })) // req.body
server.use(methodOverride('_method'))
server.use(express.static('public'))
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