
module.exports = {
    index(req, res) {
        return res.render('admin/recipes/index')
    },

    create(req, res) {
        return res.render('admin/recipes/create')
    },

    post(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        // let id = 1
        // const lastRecipe = data.recipes[data.recipes.length - 1]
        // if (lastRecipe) {
        //     id = lastRecipe.id + 1
        // }
    },
    
    show(req, res) {
        return
    },

    edit(req, res) {
        return
    },

    put(req, res) {
        return
    },

    delete(req, res) {
        return
    },
}



