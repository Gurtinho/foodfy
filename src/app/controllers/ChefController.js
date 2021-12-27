const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')
const fs = require('fs')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 12
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                offset
            }

            results = await Chef.paginate(params)
            let chefs = results.rows

            chefs = chefs.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            if (chefs[0] != null) {
                    const pagination = {
                        total: Math.ceil(chefs[0].total / limit),
                        page,
                    }
                    return res.render('admin/chefs/index', { chefs, pagination })
                }
            return res.render('admin/chefs/index', { chefs })

        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    create(req, res) {
        return res.render('admin/chefs/create')
    },
    
    async post(req, res) {
        try {
            const { filename, path } = req.files[0]
            const file_id = await File.create({ name: filename, path })
        
            const { name } = req.body
            let results = await Chef.create({ name, file_id })
        
            results = await Chef.find(results)
            const chef = results.rows[0]

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
            const id = req.params.id

            const chef_id = await Chef.find(id)
            const chef = chef_id.rows[0]
                
            if (!chef) return res.render('admin/admins/index', {
                error: 'Chef não encontrado'
            })

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                id,
                limit,
                offset
            }

            // files chefs
            let results = await Recipe.recipeFind(params)
            let recipes_results = results.rows

            results = await Chef.files(chef.file_id)

            let files_chefs = results.rows[0]
            files_chefs = {
                ...files_chefs,
                src: `${req.protocol}://${req.headers.host}${files_chefs.path.replace('public', '')}`
            }

            // files receitas
            let files = recipes_results.map(async item => ({
                ...item,
                path: (await Recipe.recipeFiles(item.id)).rows[0].path
            }))

            let recipes = await Promise.all(files)

            recipes = recipes.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            if (recipes[0] != null) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
                return res.render('admin/chefs/show', { chef, recipes, files, pagination, files_chefs })
            }
            return res.render('admin/chefs/show', { chef, recipes, files, files_chefs })
        
        } catch (err) {
            console.error(err)
            return res.render('admin/chefs/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async edit(req, res) {
        try {
            const chef_id = await Chef.find(req.params.id)
            const chef = chef_id.rows[0]

            if (!chef) return res.render('admin/admins/index', {
                error: 'Chef não encontrado'
            })

            let chef_files = await Chef.files(chef.file_id)
            let files = chef_files.rows[0]
            
            return res.render('admin/chefs/edit', { chef, files })
                
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
            const findChef = await Chef.find(id)
            const chef = findChef.rows[0]

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
            fs.unlinkSync(chef_id.path)

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