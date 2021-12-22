const User = require('../models/userModels')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../libs/mailer')

module.exports = {
    async list(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                limit,
                offset
            }

            let results = await User.findAll(params)
            let users = results.rows

            if (users[0] != null) {
                const pagination = {
                    total: Math.ceil(users[0].total / limit),
                    page,
                }
                return res.render('admin/admins/list', { users, pagination })
            }
            return res.render('admin/admins/list', { users })

        } catch (err) {
            console.error(err)
        }
    },

    async create(req, res) {
        return res.render('admin/admins/create')
    },

    async post(req, res) {
        try {
            let { name, email, is_admin } = req.body

            is_admin = Boolean(is_admin) || false

            const user_password = crypto.randomBytes(4).toString('hex')

            const sendingEmail = `
                <h2 style="font-size: 24px; font-weight: normal;">Olá <strong>${name}</strong>,</h2>
                <p>Seja muito bem-vindo(a) ao <strong>Foodfy</strong></p>
                <p>Seu cadastro foi realizado com sucesso!</p>
                <br>
                <p>Login: ${email}</p>
                <p>Senha: ${user_password}</p>
                <br>
                <p>Para alterar sua senha depois, basta clicar em esqueci a senha quando efetuar o login</p>
                <br>
                <h3>Link de acesso a conta</h3>
				<p>
                    <a
                        style="display: block; margin: 32px auto; padding: 16px; width:150px; color: #fff;
                        background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                        href="http://localhost:3000/admin/session/login" target="_blank">Acessar Conta
                    </a> 
				</p>
                <p style="padding-top:16px; border-top: 2px solid #ccc; text-align: center;">Equipe Foodfy</p>
            `

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com',
                subject: 'Bem-vindo ao Foodfy',
                html: sendingEmail
            })

            const password = await hash(user_password, 8)

            const userId = await User.create({
                name,
                email,
                password,
                is_admin
            })

            req.session.success = 'Usuário cadastrado com sucesso!'

            return res.redirect(`/admin/admins/list`)
            
        } catch (err) {
            console.log(err)
        }
    },

    async edit(req, res) {
        try {
            const id = req.params.id

            const user = await User.findOne({ where: { id } })

            console.log(user.id)
            console.log(req.session.userId)

            return res.render(`admin/admins/edit`, { user })
            
        } catch (err) {
            console.error(err)
        }
    },
    
    async put(req, res) {
        try {
            const userId = await User.update(req.body)
            req.session.userId = userId

            return res.redirect('/')
            
        } catch (err) {
            console.error(err)
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id
            const user = await User.findOne({ where: { id } })
            console.log(user.id)
            console.log(req.session.userId)
            
        } catch (err) {
            console.error(err)
        }
    }
}