const User = require('../models/userModels')

module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },
    
    async post(req, res) {
        try {
            const userId = await User.create(req.body)
            req.session.userId = userId

            return res.redirect('/')
            
        } catch (err) {
            console.error(err)
        }
    }
}