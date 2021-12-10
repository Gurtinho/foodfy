const Chef = require('../models/chefModels')
const Recipe = require('../models/recipeModels')
const File = require('../models/fileModels')

module.exports = {
    async index(req, res) {
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
    },

    async create(req, res) {
        return res.render('admin/chefs/create')
    },
    
    async post(req, res) {
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
    },

    async show(req, res) {
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
    },

    async edit(req, res) {
        const chefFind = await Chef.find(req.params.id)
        const chef = chefFind.rows[0]

        if (!chef) return res.send('chef not found')
        
        return res.render('admin/chefs/edit', { chef })
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') return res.send('Preencha todos os campos')
        }

        await Chef.update(req.body)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },

    async delete(req, res) {
        const id = req.body.id
        const findChef = await Chef.find(id)
        const chef = findChef.rows[0]

            if (chef.total_recipes == 0) {
                Chef.delete(id)
                return res.redirect(`/admin/chefs`)
            } else {
                return res.redirect(`/admin/chefs/${id}/edit`)
            }
    },
}