const Recipe = require('../models/Recipe')

const { paramsPagination } = require('../../libs/utils')
const LoadService = require('../services/LoadRecipeService')

module.exports = {
    async search(req, res) {
        try {
            let { search } = req.query
            let pagination = paramsPagination(req.query, 6)
            pagination = { ...pagination, search }
            const recipes = await LoadService.load('recipes', pagination)
            recipes.length != 0
            ? pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('home/search', { search, recipes, pagination })
            
        } catch (err) {
            console.error(err)
            return res.render('home/search', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    }
}