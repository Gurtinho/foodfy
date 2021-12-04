const Recipe = require('../models/recipe')

module.exports = {
    index(req, res) {
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
                return res.render('admin/recipes/index', { recipes, pagination })
            }
        }
        Recipe.paginate(params)
    },

    create(req, res) {
        Recipe.chefFindOption(( options ) => {
            return res.render('admin/recipes/create', { chefOptions: options })
        })
    },

    post(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        Recipe.create(req.body, ( recipe ) => {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
        
    },
    
    show(req, res) {
        Recipe.find(req.params.id, ( recipe ) => {
            if ( !recipe ) {
                return res.send('recipe not found')
            }

            return res.render('admin/recipes/show', { recipe })
        })
    },

    edit(req, res) {
        Recipe.find(req.params.id, ( recipe ) => {
            if ( !recipe ) {
                return res.send('recipe not found')
            }
            Recipe.chefFindOption(( options ) => {
                return res.render('admin/recipes/edit', { recipe, chefOptions: options })
            })
        })
    },

    put(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        Recipe.update(req.body, () => {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },

    delete(req, res) {
        Recipe.delete(req.body.id, () => {
            return res.redirect(`/admin/recipes`)
        })
    },
}



