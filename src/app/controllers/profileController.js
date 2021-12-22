const { captureRejectionSymbol } = require('nodemailer/lib/xoauth2')
const User = require('../models/userModels')

module.exports = {
    async index(req, res) {
        try {
            const { userId: id } = req.session
            const user = await User.findOne({ where: { id } })

            return res.render('admin/profile/index', { user })
            
        } catch (err) {
            console.error(err)
        }
    },

    async update(req, res) {
        try {
            const user = req.user
            const { name } = req.body

            await User.update(user.id, { name })

            return res.render('admin/profile/index', {
                user: req.body,
                success: 'Nome atualizado com sucesso!'
            })
            
        } catch (err) {
            console.error(err)
        }
    },
}