const crypto = require('crypto')
const User = require('../models/User')

const mailer = require('../../libs/mailer')
const { hash } = require('bcryptjs')
const { emailTemplate } = require('../../libs/utils')

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },

    login(req, res) {
        req.session.userId = req.user.id
        req.session.isAdmin = req.user.is_admin

        return res.redirect('/') 
    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },

    // password
    forgotForm(req, res) {
        return res.render('admin/session/forgot-password')
    },

    async forgot(req, res) {
        try {
            const user = req.user
            const token = crypto.randomBytes(20).toString('hex')
            let now = new Date()
            now = now.setMinutes(now.getMinutes() + 10)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now,
            })

            const sendingEmail = `
                <h2 style=" padding-left: 20px; padding-bottom: 20px; font-size: 24px; font-weight: normal; border-bottom: 2px solid #ccc;">Olá <strong>${user.name}</strong></h2>
                <br>

                <h2>Perdeu a senha?</h2>
                <p>Clique no link abaixo para recuperar.</p>
                <br>
                <p>
                <a href="http://localhost:3000/admin/session/reset-password?token=${token}" target="_blank" style="text-align: center; font-weight: bold; padding: 16px; color: #fff; background-color: #6558C3; text-decoration: none; border: none; border-radius: 4px; cursor: pointer;">
                Criar Nova Senha</a>
                </p>
                <br>
                <p>O link irá expirar em 10 minutos.</p>
                <p>Caso não recupere a tempo, solicite o link novamente.</p>
                `

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Recuperação de senha.',
                html: emailTemplate( sendingEmail )
            })

            return res.render('admin/session/forgot-password', {
                success: 'Verifique seu email pra recuperar a senha'
            })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/session/forgot-password', {
                error: 'Erro inesperado, tente novamente'
            })
        }
    },

    resetForm(req, res) {
        return res.render('admin/session/reset-password', { token: req.query.token })
    },

    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            const newPassword = await hash(password, 8)
            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: '',
            })

            return res.render('admin/session/login', {
                user: req.body,
                success: 'Senha atualizada com sucesso! faça seu login'
            })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente'
            })
        }
    }
}