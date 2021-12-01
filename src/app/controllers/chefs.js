const Chef = require('../models/chef')
const Recipe = require('../models/recipe')

module.exports = {
    index(req, res) {
        Chef.all(( chefs ) => {
            return res.render('admin/chefs/index', { chefs })
        })
    },

    create(req, res) {
        return res.render('admin/chefs/create')
    },
    
    post(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        Chef.create(req.body, ( chef ) => {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },

    show(req, res) {
        const id = req.params.id
        Chef.find(id, ( chef ) => {
            if ( !chef ) {
                return res.send('chef not found')
            }
            Recipe.recipeFind(id, ( recipes ) => {
                return res.render('admin/chefs/show', { chef, recipes })
            })
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
                    return res.redirect(`/admin/chefs/index`)
                })
            } else {
                return res.redirect(`/admin/chefs/${id}/edit`)
            }
        })
    },
}