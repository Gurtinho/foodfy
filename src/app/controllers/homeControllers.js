const Recipe = require('../models/recipeModels')
const Chef = require('../models/chefModels')
const Search = require('../models/searchModels')

module.exports = {
    async about(req, res) {
        return res.render("home/about")
    },

    async home(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }
        const recipeResults = await Recipe.paginate(params)
        const recipes = recipeResults.rows

        if (recipes[0] != null) {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            }
            return res.render('home/home', { recipes, pagination })
        }

        return res.render('home/home', { recipes })
    },

    async recipes(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }
        const recipeResults = await Recipe.paginate(params)
        const recipes = recipeResults.rows

        if (recipes[0] != null) {
            const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
            return res.render('home/recipes', { recipes, pagination })
        }
        return res.render('home/recipes', { recipes })
    },

    async chefs(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 12
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }
        const chefResults = await Chef.paginate(params)
        const chefs = chefResults.rows

        if (chefs[0] != null) {
            const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page,
                }
            return res.render('home/chefs', { chefs, pagination })
        }
        return res.render('home/chefs', { chefs })
    },

    async chefShow(req, res) {
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
            page,
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
            return res.render('home/chef-show', { chef, recipes, pagination })
        }
        return res.render('home/chef-show', { chef, recipes })
    },

    async recipeShow(req, res) {
        const recipeResults = await Recipe.find(req.params.id)
        const recipe = recipeResults.rows[0]
        if (!recipe) return res.send('recipe not found')
        
        return res.render('home/recipe-show', { recipe })
    },

    async search(req, res) {
        let { search, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            search,
            page,
            limit,
            offset
        }
        const recipesResults = await Search.paginate(params)
        const recipes = recipesResults.rows

        if (recipes[0] != null) {
            const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
            return res.render('home/search', { search, recipes, pagination })
        }
        return res.render('home/search', { search })
    }
}
