const Chef = require('../models/chef')
const Recipe = require('../models/recipe')

module.exports = {
    index(req, res) {
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
                    // total: Math.ceil(chefs[0].total / limit),
                    page,
                }
                return res.render('admin/chefs/index', { chefs, pagination })
            }
        }
        Chef.paginate(params)
    },

    create(req, res) {
        return res.render('admin/chefs/create')
    },
    
    async post(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        const results = await Chef.create(req.body)
        const chefs = results.rows[0]

        return res.redirect(`/admin/chefs/${chefs.id}`)
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
                        // total: Math.ceil(recipes[0].total / limit),
                        page,
                    }
                    return res.render('admin/chefs/show', { chef, recipes, pagination })
                }
            }
            Recipe.recipeFind(params)
        })
    },

    edit(req, res) {
        Chef.find(req.params.id, ( chef ) => {
            if ( !chef ) {
                return res.send('chef not found')
            }

            return res.render('admin/chefs/edit', { chef })
        })
    },

    put(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        Chef.update(req.body, () => {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },

    delete(req, res) {
        const id = req.body.id
        Chef.find(id, ( recipes ) => {
            if (recipes.total_recipes == 0) {
                Chef.delete(id, () => {
                    return res.redirect(`/admin/chefs`)
                })
            } else {
                return res.redirect(`/admin/chefs/${id}/edit`)
            }
        })
    },
}