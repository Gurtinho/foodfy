const Chef = require('../models/Chef')
const File = require('../models/File')
const fs = require('fs')

const { paramsPagination } = require('../../libs/utils')
const LoadService = require('../services/LoadChefService')

module.exports = {
    async index(req, res) {
        try {
            const pagination = paramsPagination(req.query, 12)
            const chefs = await LoadService.load('chefs', pagination)
            chefs.length != 0
            ? pagination.total = Math.ceil(chefs[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('admin/chefs/index', { chefs, pagination })

        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async create(req, res) {
        return res.render('admin/chefs/create')
    },
    
    async post(req, res) {
        try {
            const { filename, path } = req.files[0]
            const file_id = await File.create({ name: filename, path })
            const { name } = req.body
            let results = await Chef.create({ name, file_id })
            const chef = await Chef.find(results)
            return res.render(`admin/chefs/index`, {
                chef,
                success: 'Chef criado com sucesso'
            })

        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async show(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            const chef = await LoadService.load('chef', { id: req.params.id, pagination })
            if (!chef) return res.render('admin/chefs/index', {error: 'Chef não encontrado'})
            chef.recipes.length != 0
            ? pagination.total = Math.ceil(chef.recipes[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('admin/chefs/show', { chef, pagination })
        
        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async edit(req, res) {
        try {
            const chef = await LoadService.load('chef', {id: req.params.id})
            if (!chef) return res.render('admin/admins/index', { error: 'Chef não encontrado' })
            return res.render('admin/chefs/edit', { chef })
                
        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async put(req, res) {
        try {
            const { id, name } = req.body
            const chef_results = await File.findFiles(req.body.id)
            const chefs_id = chef_results.rows[0]

            if (req.files.length != 0) {
                const { filename: name, path } = req.files[0]
                console.log(chefs_id.file_id)
                fs.unlinkSync(chefs_id.path)
                if (chefs_id.path != 'public/images/chef_placeholder.png') {
                    fs.unlinkSync(chefs_id.path)
                }
                await File.update( chefs_id.file_id, { name, path })
            }
            await Chef.update(id, {
                name,
            })
            return res.render(`admin/chefs/edit`, {
                chef: req.body.id,
                success: 'Chef atualizado com sucesso'
            })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
       }
    },

    async delete(req, res) {
        try {
            const id = req.body.id
            const chef = await Chef.find(id)

            if (chef.total_recipes != 0) {
                return res.render(`admin/chefs/edit`, {
                    chef,
                    error: 'Esse chef possui receitas e não pode ser deletado'
                })
            }

            const results = await File.findFiles(chef.id)
            const chef_id = results.rows[0]
            await Chef.delete({ id: id })
            await File.delete({ id: chef.file_id })
            if (chef_id.path != 'public/images/chef_placeholder.png') {
                fs.unlinkSync(chef_id.path)
            }
            return res.render(`admin/chefs/index`, {
                success: 'Chef deletado com sucesso'
            })
           
        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
       }
    },
}