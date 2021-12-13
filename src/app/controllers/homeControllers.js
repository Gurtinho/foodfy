const Recipe = require('../models/recipeModels')
const Chef = require('../models/chefModels')
const Search = require('../models/searchModels')

module.exports = {
    async about(req, res) {
        try {
            return res.render("home/about")
            
        } catch (err) {
            console.error(err)
        }
    },

    async home(req, res) {
        try {
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
            
        } catch (err) {
            console.error(err)
        }
    },

    async recipes(req, res) {
        try {
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
            
        } catch (err) {
            console.error(err)
        }
    },

    async chefs(req, res) {
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

        } catch (err) {
            console.error(err)
        }
    },

    async chefShow(req, res) {
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
            
        } catch (err) {
            console.error(err)
        }
    },

    async recipeShow(req, res) {
        try {
            const recipeResults = await Recipe.find(req.params.id)
            const recipe = recipeResults.rows[0]
            if (!recipe) return res.send('recipe not found')
            
            return res.render('home/recipe-show', { recipe })
            
        } catch (err) {
            console.error(err)
        }
    },

    async search(req, res) {
        try {
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
            
        } catch (err) {
            console.error(err)
        }
    }
}
