const User = require('../models/userModels')

module.exports = {
    registerForm(req, res) {
        return res.render('users/register')
    },

    async post(req, res) {
        try {
            
            const userId = await User.create(req.body)
            console.log(userId)

            return res.redirect('/users', {
                success: 'Conta criada com sucesso!'
            })
            
        } catch (err) {
            console.error(err)
        }
    }
}