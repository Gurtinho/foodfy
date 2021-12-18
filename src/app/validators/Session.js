const User = require('../models/userModels')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        // user registered
        const user = await User.findOne({ where: { email } })

        if (!user) return res.render('admin/session/login', {
            user: req.body,
            error: 'Esse e-mail não foi cadastrado!'
        })

        // password match
        const passed = await compare(password, user.password)

        if (!passed) return res.render('admin/session/login', {
            user: req.body,
            error: 'Senha incorreta!'
        })

        //req.session
        req.user = user

        next()
        
    } catch (err) {
        console.error(err)
    }
}


module.exports = {
    login
}