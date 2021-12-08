const Chef = require('../models/chef')
const Recipe = require('../models/recipe')

module.exports = {
    async index(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }
        const resultsRecipes = await Recipe.paginate(params)
        const recipes = resultsRecipes.rows

        if (recipes[0] != undefined) {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            }
            return res.render('admin/recipes/index', { recipes, pagination })
        }
        return res.render('admin/recipes/index', { recipes })
    },

    async create(req, res) {
        let findChef = await Recipe.chefFindOption()
        const chefsOptions = findChef.rows

        return res.render('admin/recipes/create', { chefsOptions })
    },

    async post(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        let results = await Recipe.create(req.body)
        const recipes = results.rows[0]

        return res.redirect(`/admin/recipes/${recipes.id}`)
    },
    
    async show(req, res) {
        let results = await Recipe.all(req.params.id)
        const recipe = results.rows[0]

        return res.render('admin/recipes/show', { recipe })
    },

    async edit(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) {
            return res.send('recipes not found!')
        }
        
        results = await Recipe.chefFindOption()
        const chefsOptions = results.rows

        return res.render('admin/recipes/edit', { recipe, chefsOptions })
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        await Recipe.update(req.body)
        
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },

    async delete(req, res) {
        await Recipe.delete(req.body.id)

        return res.redirect(`/admin/recipes`)
    },
}



