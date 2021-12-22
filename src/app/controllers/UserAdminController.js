const User = require('../models/userModels')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../libs/mailer')
const { emailTemplate } = require('../../libs/utils')

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
                <h2 style=" padding-left: 20px; padding-bottom: 20px; font-size: 24px; font-weight: normal; border-bottom: 2px solid #ccc;">Olá <strong>${name}</strong></h2>
                <p>Seu cadastro no <strong>Foodfy</strong> foi realizado com sucesso!</p>
                <br>
                <h3>Informações de acesso a conta:</h3>
                <p><strong>Login:</strong> ${email}</p>
                <p><strong>Senha:</strong> ${user_password}</p>
                <br>
                <p>Se não gostou da sua senha, não se preocupe.</p> 
                <p>Basta clicar em esqueci a senha quando efetuar o <strong>login.</strong></p>
                <br>
                <h3 style="margin-bottom: 20px;">Clique no botão para ir a página de login do Foodfy</h3>
                <br>
                <a
                    style="text-align: center; margin-bottom: 20px; padding: 16px; color: #fff;
                    background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                    href="http://localhost:3000/admin/session/login" target="_blank">
                    Acessar Conta
                </a>
            `

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com',
                subject: 'Bem-vindo ao Foodfy',
                html: emailTemplate( sendingEmail )
            })

            const password = await hash(user_password, 8)

            await User.create({
                name,
                email,
                password,
                is_admin
            })

            return res.render(`/admin/admins/list`, {
                success: 'Usuário cadastrado com sucesso'
            })
            
        } catch (err) {
            console.log(err)
            return res.render('admin/admins/list', {
                error: 'Não foi possível cadastrar esse usuário'
            })
        }
    },

    async edit(req, res) {
        try {
            const id = req.params.id
            const user = await User.findOne({ where: { id } })

            return res.render(`admin/admins/edit`, { user })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/admins/edit', {
                error: 'Não foi possível achar esse usuário'
            })
        }
    },
    
    async put(req, res) {
        try {
            let { id, name, email, is_admin } = req.body

            is_admin = Boolean(is_admin) || false

            const user_password = crypto.randomBytes(4).toString('hex')

            const sendingEmail = `
                <h2 style=" padding-left: 20px; padding-bottom: 20px; font-size: 24px; font-weight: normal; border-bottom: 2px solid #ccc;">Olá <strong>${name}</strong></h2>
                <p>Seu perfil no <strong>Foodfy</strong> foi atualizado com sucesso!</p>
                <br>
                <h3>Informações de acesso a conta:</h3>
                <p><strong>Login:</strong> ${email}</p>
                <p><strong>Senha:</strong> ${user_password}</p>
                <br>
                <p>Se não gostou da sua senha, não se preocupe.</p> 
                <p>Basta clicar em esqueci a senha quando efetuar o <strong>login.</strong></p>
                <br>
                <h3 style="margin-bottom: 20px;">Clique no botão para ir a página de login do Foodfy</h3>
                <br>
                <a
                    style="text-align: center; margin-bottom: 20px; padding: 16px; color: #fff;
                    background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                    href="http://localhost:3000/admin/session/login" target="_blank">
                    Acessar Conta
                </a>`

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com',
                subject: 'Bem-vindo ao Foodfy',
                html: emailTemplate( sendingEmail )
            })

            const password = await hash(user_password, 8)

            await User.update(id, {
                name,
                email,
                password,
                is_admin
            })
            
            return res.render(`admin/admins/${id}/edit`, {
                success: 'Perfil atualizado com sucesso'
            })
            
        } catch (err) {
            console.error(err)
            return res.render(`admin/admins/${id}/edit`, {
                error: 'Ocorreu um erro ao atualizar perfil'
            })
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id
            const user = await User.findOne({ where: { id } })
            // console.log(user.id)
            // console.log(req.session.userId)
            
        } catch (err) {
            console.error(err)
            return res.render('admin/admins/list', {
                error: 'Ocorreu um erro ao deletar essa conta'
            })
        }
    }
}