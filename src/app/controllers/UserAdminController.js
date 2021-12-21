const User = require('../models/userModels')

module.exports = {
    index(req, res) {
        return res.render('admin/admins/index')
    },
    
    async put(req, res) {
        try {
            const userId = await User.create(req.body)
            req.session.userId = userId

            return res.redirect('/')
            
        } catch (err) {
            console.error(err)
        }
    },
}