const User = require('../models/userModels')
const { hash } = require('bcryptjs')

module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },
    
    async post(req, res) {
        try {
            let { name, email, password, is_admin } = req.body

            is_admin = is_admin || false

            password = await hash(password, 8)
            
            const userId = await User.create({
                name,
                email,
                password,
                is_admin
            })

            req.session.userId = userId

            return res.redirect('/')
            
        } catch (err) {
            console.error(err)
            return res.render('admin/session/login', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    }
}