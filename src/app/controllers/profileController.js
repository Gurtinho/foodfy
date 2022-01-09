const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const { userId: id } = req.session
            const user = await User.findOne({ where: { id } })
            return res.render('admin/admins/index', { user })
            
        } catch (error) {
            console.error(error)
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

            return res.render('cards/success', {
                card_success: 'Perfil atualizado com sucesso',
                link: `/admin/admins/index`
            })
            
        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro ao atualizar. Tente novamente',
                link: `/admin/admins/index`
            })
        }
    },
}