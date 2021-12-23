const { compare } = require('bcryptjs')
const User = require('../models/userModels')


async function update(req, res, next) {
    try {
        const keys = Object.keys(body)

        for ( let key of keys ) {
            if (body[key] == '') {
                return {
                    user: body,
                    error: 'Preencha todos os campos!'
                }
            }
        }
        
        const { userId: id } = req.session
        const user = await User.findOne({ where: { id } })
        const { email, password } = req.body

        if (email != user.email) return res.render('admin/profile/index', {
            user: req.body,
            error: 'O email por algum motivo está errado!'
        })

        if (!password) return res.render('admin/profile/index', {
            user: req.body,
            error: 'Insira sua senha'
        })

        const passed = await compare(password, user.password)
        if (!passed) return res.render('admin/profile/index', {
            user: req.body,
            error: 'A senha está incorreta!'
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