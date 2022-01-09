const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } } )
        if (!user) return res.render('admin/session/login', {
            user: req.body,
            error: 'Esse email não foi cadastrado'
        })

        const passed = await compare(password, user.password)
        if (!passed) return res.render('admin/session/login', {
            user: req.body,
            error: 'Senha incorreta'
        })

        req.user = user

        next()
        
    } catch (err) {
        console.error(err)
    }
}

async function forgot(req, res, next) {
    try {
        const { email } = req.body    
        let user = await User.findOne({ where: { email } })
        if (!user) return res.render('admin/session/forgot-password', {
            user: req.body,
            error: 'Esse email não foi cadastrado'
        })

        req.user = user

        next()

    } catch (err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    try {
        const { email, password, passwordrepeat, token } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: 'Esse email não foi cadastrado'
        })

        if (password != passwordrepeat) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: 'As senhas devem ser iguais'
        })

        if(token != user.reset_token) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: 'Token inválido. Solicite uma nova recuperação de senha'
        })

        let now = new Date()
        now = now.setMinutes(now.getMinutes())

        if(now > user.reset_token_expires) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: 'Tempo para recuperar a senha expirou. tente solicitar uma nova recuperação'
        })

        req.user = user
        
        next()
        
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    login,
    forgot,
    reset
}