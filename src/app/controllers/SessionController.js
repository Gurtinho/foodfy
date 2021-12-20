const crypto = require('crypto')
const User = require('../models/userModels')
const mailer = require('../../libs/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },

    login(req, res) {
        req.session.userId = req.user.id

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
        
            // criar token
            const token = crypto.randomBytes(20).toString('hex')

            // expirar token
            let now = new Date()
            now = now.setMinutes(now.getMinutes() + 600)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now,
            })

            // enviar email com link
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Recuperação de senha.',
                html: `
                    <h2>Perdeu a senha?</h2>
                    <p>Clique no link abaixo para recuperar.</p>
                    <p>
                        <a href="http://localhost:3000/admin/session/reset-password?token=${token}" target="_blank">
                            recuperar senha
                        </a>
                    </p>
                    <p>O link é válido por 10 minutos para recuperar a senha.</p>
                    <p>Caso não recupere a tempo, solicite uma nova recuperação.</p>

                `
            })

            // avisar usuário q enviamos o email
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
            // criar um novo hash de senha
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