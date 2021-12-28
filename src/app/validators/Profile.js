const { compare } = require('bcryptjs')
const User = require('../models/User')


async function update(req, res, next) {
    try {  
        const { userId: id } = req.session
        const user = await User.findOne({ where: { id } })
        
        const { email, password } = req.body

        if (email != user.email) return res.render('admin/admins/index', {
            user: req.body,
            error: 'Ocorreu um erro com o seu email'
        })

        if (!password) return res.render('admin/admins/index', {
            user: req.body,
            error: 'Insira sua senha'
        })

        const passed = await compare(password, user.password)
        if (!passed) return res.render('admin/admins/index', {
            user: req.body,
            error: 'A senha está incorreta'
        })

        req.user = user

        next()

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    update
}