const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const Search = require('../models/search')

module.exports = {
    about(req, res) {
        return res.render("home/about")
    },

    home(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
                return res.render('home/home', { recipes, pagination })
            }
        }
        Recipe.paginate(params)
    },

    recipes(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
                return res.render('home/recipes', { recipes, pagination })
            }
        }
        Recipe.paginate(params)
    },

    chefs(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 12
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset,
            callback(chefs) {
                const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page,
                }
                return res.render('home/chefs', { chefs, pagination })
            }
        }
        Chef.paginate(params)
    },

    show(req, res) {
        const id = req.params.id

        Chef.find(id, ( chef ) => {
            if ( !chef ) {
                return res.send('chef not found')
            }

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)
            

            const params = {
                id,
                page,
                limit,
                offset,
                callback(recipes) {
                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page,
                    }
                    return res.render('home/show', { chef, recipes, pagination })
                }
            }
            Recipe.recipeFind(params)
        })
    },

    id(req, res) {
        Recipe.find(req.params.id, ( recipe ) => {
            if ( !recipe ) {
                return res.send('recipe not found')
            }
            return res.render('home/food', { recipe })
        })
    },

    search(req, res) {
        let { search, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            search,
            page,
            limit,
            offset,
            callback(recipes) {
                if (recipes == '') {
                    return res.render('home/search', { search })
                }
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                }
                console.log(recipes[0].total / limit)
                return res.render('home/search', { search, recipes, pagination })
            },
        }
        Search.paginate(params)
    }
}
