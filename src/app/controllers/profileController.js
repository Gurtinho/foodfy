const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const { userId: id } = req.session
            const user = await User.findOne({ where: { id } })
            return res.render('admin/admins/index', { user })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/admins/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async update(req, res) {
        try {
            const user = req.user
            const { name } = req.body

            await User.update(user.id, { name })

            return res.render('admin/admins/index', {
                user: req.body,
                success: 'Perfil atualizado com sucesso'
            })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/admins/index', {
                error: 'Ocorreu um erro ao atualizar. Tente novamente'
            })
        }
    },
}