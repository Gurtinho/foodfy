const User = require('../models/User')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../libs/mailer')

const { emailTemplate } = require('../../libs/utils')
const { paramsPagination } = require('../../libs/utils')

module.exports = {
    async list(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            let results = await User.paginate(pagination)
            let users = results.rows
            users.length != 0
            ? pagination.total = Math.ceil(users[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('admin/admins/list', { users, pagination })

        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro. Tente novamente'
            })
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
                <p style="color: #6558C3;"><strong>Login:</strong> ${email}</p>
                <p style="color: #6558C3;"><strong>Senha:</strong> ${user_password}</p>
                <br>
                <p>Se não gostou da sua senha, não se preocupe.</p> 
                <p>Basta clicar em esqueci a senha quando efetuar o <strong>login.</strong></p>
                <br>
                <h3 style="margin-bottom: 20px;">Clique no botão para ir a página de login do Foodfy</h3>
                <br>
                <p>
                <a
                    style="text-align: center; margin-bottom: 20px; padding: 16px; color: #fff;
                    background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                    href="http://localhost:3000/admin/session/login" target="_blank">
                    Acessar Conta
                </a>
                </p>
                <br>
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
            
            return res.render(`cards/success`, {
                card_success: 'Usuário cadastrado com sucesso',
                link: '/admin/admins/list'
            })
            
        } catch (error) {
            console.log(error)
            return res.render('cards/error', {
                card_error: 'Não foi possível cadastrar esse usuário',
                link: '/admin/admins/list'
            })
        }
    },

    async edit(req, res) {
        try {
            const id = req.params.id
            const user = await User.findOne({ where: { id } })
            return res.render(`admin/admins/edit`, { user })
            
        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Não foi possível achar esse usuário'
            })
        }
    },
    
    async put(req, res) {
        try {
            let { id, name, email, is_admin } = req.body
            is_admin = Boolean(is_admin) || false
            if (req.session.userId == id && req.session.isAdmin) {
                is_admin = true
            }
            const user_password = crypto.randomBytes(4).toString('hex')

            const sendingEmail = `
                <h2 style=" padding-left: 20px; padding-bottom: 20px; font-size: 24px; font-weight: normal; border-bottom: 2px solid #ccc;">Olá <strong>${name}</strong></h2>
                <p>Seu perfil no <strong>Foodfy</strong> foi atualizado com sucesso!</p>
                <br>
                <h3>Informações de acesso a conta:</h3>
                <p style="color: #6558C3;"><strong>Login:</strong> ${email}</p>
                <p style="color: #6558C3;"><strong>Senha:</strong> ${user_password}</p>
                <br>
                <p>Se não gostou da sua senha, não se preocupe.</p> 
                <p>Basta clicar em esqueci a senha quando efetuar o <strong>login.</strong></p>
                <br>
                <h3 style="margin-bottom: 20px;">Clique no botão para ir a página de login do Foodfy</h3>
                <br>
                <p>
                <a
                    style="text-align: center; padding: 16px; color: #fff;
                    background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                    href="http://localhost:3000/admin/session/login" target="_blank">
                    Acessar Conta
                </a>
                </p>
                <br>`

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
            const user = await User.findOne({ where: { id } })
   
            return res.render(`cards/success`, {
                card_success: 'Usuário atualizado com sucesso. <p>Um link com a nova senha foi enviado no email cadastrado</p>',
                link: `/admin/admins/${id}/edit`
            })
            
        } catch (error) {
            console.error(error)
            return res.render(`cards/error`, {
                card_error: 'Ocorreu um erro ao atualizar perfil'
            })
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body
            const user = await User.findOne({ where: { id } })
            if (user.id == req.session.userId) {
                return res.render(`admin/admins/edit`, {
                    user,
                    error: 'Você não pode deletar sua própria conta'
                })
            }
            
            await User.delete({ id })

            return res.render('cards/success', {
                card_success: 'Conta deletada com sucesso',
                link: `/admin/admins/list`
            })

        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro ao deletar essa conta'
            })
        }
    }
}