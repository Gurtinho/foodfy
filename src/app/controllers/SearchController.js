const Recipe = require('../models/recipeModels')
const Search = require('../models/searchModels')

module.exports = {
    async search(req, res) {
        try {
            let { search, page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                search,
                page,
                limit,
                offset
            }

            let recipes_results = await Search.search(params)
            let recipes_files = recipes_results.rows

            let files = recipes_files.map(async item => ({
                ...item,
                path: (await Recipe.recipeFiles(item.id)).rows[0].path
            }))

            let recipes = await Promise.all(files)

            recipes = recipes.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            if (recipes[0] != null) {
                const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page,
                    }
                return res.render('search/search', { search, recipes, pagination })
            }
            return res.render('search/search', { search, recipes })
            
        } catch (err) {
            console.error(err)
        }
    }
}