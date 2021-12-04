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
        Chef.find(req.params.id, ( chef ) => {
            if ( !chef ) {
                return res.send('chef not found')
            }
            Recipe.recipeFind(req.params.id, ( recipe ) => {
                return res.render('home/show', { chef, recipes: recipe })
            })
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
        const { search, page, limit } = req.query
        if (search) {
            // page = page || 1
            // limit = limit || 6
            // let offset = limit * (page - 1)

            // const params = {
            //     page,
            //     limit,
            //     offset,
            //     callback(recipes) {
            //         const pagination = {
            //             total: Math.ceil(recipes[0].total / limit),
            //             page,
            //         }
            //         return res.render('admin/recipes/index', { recipes, pagination })
            //     }
            // }
            // Recipe.paginate(params)
            Search.findRecipe(search, ( recipes ) => {
                Search.findChef(search, (chefs) => {
                    if (chefs && recipes == '') {
                        return res.render('home/search', { search })
                    }
                    return res.render('home/search', { search, chefs, recipes })
                })
            })
        } else {
            return
        }
    }
}
