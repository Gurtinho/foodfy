const User = require('../models/User')

async function post(req, res, next) {
    try {
        const keys = Object.keys(req.body)
        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.render('admin/users/register', {
                    error: 'Preencha todos os campos!'
                })
            }
        }

        const { email, password, passwordrepeat } = req.body
        const user = await User.findOne({ where: { email } })
        
        if (user) return res.render('admin/users/register', {
            error: 'Esse email já existe, tente outro!'
        })

        if (password != passwordrepeat) return res.render('admin/users/register', {
            error: 'As senhas devem ser iguais'
        })

        next()

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    post
}