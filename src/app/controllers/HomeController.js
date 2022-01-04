const { paramsPagination } = require('../../libs/utils')
const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')


module.exports = {
    about(req, res) {
        try {
            return res.render("home/about")
            
        } catch (err) {
            console.error(err)
        }
    },

    async home(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            const recipes = await LoadRecipeService.load('recipes', pagination)
            recipes.length != 0
            ? pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('home/home', { recipes, pagination })
            
        } catch (err) {
            console.error(err)
        }
    },

    async recipes(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            const recipes = await LoadRecipeService.load('recipes', pagination)
            recipes.length != 0
            ? pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('home/recipes', { recipes, pagination })
            
        } catch (err) {
            console.error(err)
        }
    },

    async recipeShow(req, res) {
        try {
            const recipe = await LoadRecipeService.load('recipe', req.params.id)
            if (!recipe) return res.render('home/recipes', { error: 'Receita não encontrada' })
            return res.render('home/recipe-show', { recipe })

        } catch (err) {
            console.error(err)
        }
    },

    async chefs(req, res) {
        try {
            const pagination = paramsPagination(req.query, 12)
            const chefs = await LoadChefService.load('chefs', pagination)
            chefs.length != 0
            ? pagination.total = Math.ceil(chefs[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('home/chefs', { chefs, pagination })

        } catch (err) {
            console.error(err)
        }
    },

    async chefShow(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            const chef = await LoadChefService.load('chef', { id: req.params.id, pagination })
            if (!chef) return res.render('home/chef-show', { error: 'Chef não encontrado' })
            chef.recipes.length != 0
            ? pagination.total = Math.ceil(chef.recipes[0].total / pagination.limit)
            : pagination.total = null
            return res.render('home/chef-show', { chef, pagination })
            
        } catch (err) {
            console.error(err)
        }
    }
}
