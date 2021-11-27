const Chef = require('../models/chef')

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
        Chef.find(req.params.id, ( chef ) => {
            if ( !chef ) {
                return res.send('chef not found')
            }

            return res.render('admin/chefs/show', { chef })
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
        Chef.delete(req.body.id, () => {
            return res.redirect(`/admin/chefs/index`)
        })
    },
}