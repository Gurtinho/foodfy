const User = require('../models/userModels')

async function post(req, res, next) {
    try {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.render('users/register', {
                    error: 'Preencha todos os campos!'
                })
            }
        }

        // checar se o email já existe
        const { email, password, passwordrepeat } = req.body
        const user = await User.findOne({ where: { email } })
        
        if (user) return res.render('users/register', {
            error: 'Esse email já existe, tente outro!'
        })

        // checar se as senhas são iguais
        if (password != passwordrepeat) return res.render('users/register', {
            error: 'As senhas devem ser iguais!'
        })
            
        next()

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    post
}