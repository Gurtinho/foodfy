const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const Search = require('../models/search')

module.exports = {
    about(req, res) {
        return res.render("home/about")
    },

    home(req, res) {
        Recipe.all(( recipes ) => {
            return res.render('home/home', { recipes })
        })
    },

    recipes(req, res) {
        Recipe.all(( recipes ) => {
            return res.render('home/recipes', { recipes })
        })
    },

    chefs(req, res) {
        Chef.all(( chefs ) => {
            return res.render('home/chefs', { chefs })
        })
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
        // pesquisa as receitas e os chefs
        const { search } = req.query
        if ( search ) {
            Search.findRecipe(search, ( recipes ) => {
                Search.findChef(search, (chefs) => {
                    if (chefs && recipes == '') {
                        return res.render('home/search', { search, chefs, recipes })
                    }
                    return res.render('home/search', { search, chefs, recipes })
                })
            })
        } else {
            return res.redirect('/')
        }
    }
}
