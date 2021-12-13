const Chef = require('../models/chefModels')
const Recipe = require('../models/recipeModels')
const File = require('../models/fileModels')

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
            const chefPaginate = await Chef.paginate(params)
            const chefs = chefPaginate.rows

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
        }
    },

    async create(req, res) {
        try {
            return res.render('admin/chefs/create')
            
        } catch (err) {
            console.error(err)
        }
    },
    
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for ( let key of keys ) {
                if (req.body[key] == '') {
                    return res.send('Preencha todos os campos')
                }
            }

            if (req.files.length == 0) {
                return res.send('por favor, adicione uma imagem')
            }

            const { filename, path } = req.files[0]
            const file_idResults = await File.create({ name: filename, path })
            
            const file_id = file_idResults.rows[0].id
            const { name } = req.body
            const results = await Chef.create({ name, file_id })

            return res.redirect(`/admin/chefs/${results.rows[0].id}`)

        } catch (err) {
            console.error(err)
        }
    },

    async show(req, res) {
        try {
            const id = req.params.id

            const chefResults = await Chef.find(id)
            const chef = chefResults.rows[0]
                
            if ( !chef ) return res.send('chef not found')

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                id,
                limit,
                offset
            }
            const recipesResults = await Recipe.recipeFind(params)
            const recipes = recipesResults.rows

            if (recipes[0] != null) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
                return res.render('admin/chefs/show', { chef, recipes, pagination })
            }
            return res.render('admin/chefs/show', { chef, recipes })
        
        } catch (err) {
            console.error(err)
        }
    },

    async edit(req, res) {
        try {
            let chefFind = await Chef.find(req.params.id)
            const chef = chefFind.rows[0]

            if (!chef) return res.send('chef not found')

            chefFind = await Chef.files(chef.file_id)
            let files = chefFind.rows[0]
            
            return res.render('admin/chefs/edit', { chef, files })
                
        } catch (err) {
            console.error(err)
        }
    },

    async put(req, res) {
        try {
             const keys = Object.keys(req.body)

            for ( let key of keys ) {
                if (req.body[key] == '') return res.send('Preencha todos os campos')
            }

            const chef_results = await File.findFiles(req.body.id)
            const chefs_id = chef_results.rows[0].file_id

            if (req.files.length != 0) {
                const { filename, path } = req.files[0]
                await File.updateFile(chefs_id, { name: filename, path })
            }

            const { name, id } = req.body
            await Chef.update({ name, file_id: chefs_id || req.body.file_id, id })

            return res.redirect(`/admin/chefs/${req.body.id}`)

            
        } catch (err) {
            console.error(err)
       }
    },

    async delete(req, res) {
        try {
            const id = req.body.id
            const findChef = await Chef.find(id)
            const chef = findChef.rows[0]

            if (chef.total_recipes == 0) {
                Chef.delete(id)

                await File.delete(chef.file_id)

                return res.redirect(`/admin/chefs`)
            } else {
                return res.redirect(`/admin/chefs/${id}/edit`)
            }
           
        } catch (err) {
            console.error(err)
       }
    },
}