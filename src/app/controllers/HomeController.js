const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    async about(req, res) {
        try {
            return res.render("home/about")
            
        } catch (err) {
            console.error(err)
        }
    },

    async home(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                offset
            }
            let recipe_results = await Recipe.paginate(params)
            let recipes_files = recipe_results.rows

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
                return res.render('home/home', { recipes, pagination })
            }

            return res.render('home/home', { recipes })
            
        } catch (err) {
            console.error(err)
        }
    },

    async recipes(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                offset
            }

            let recipes_results = await Recipe.paginate(params)
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
                return res.render('home/recipes', { recipes, pagination })
            }
            return res.render('home/recipes', { recipes })
            
        } catch (err) {
            console.error(err)
        }
    },

    async recipeShow(req, res) {
        try {
            let recipeResults = await Recipe.find(req.params.id)
            let recipe = recipeResults.rows[0]

            results = await Recipe.recipeFiles(recipe.id)
            let recipe_files = results.rows

            recipe_files = recipe_files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            if (!recipe) return res.send('recipe not found')
            
            return res.render('home/recipe-show', { recipe, recipe_files })
            
        } catch (err) {
            console.error(err)
        }
    },

    async chefs(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 12
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                offset
            }

            results = await File.allFiles(params)
            let chefs = results.rows

            chefs = chefs.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            if (chefs[0] != null) {
                const pagination = {
                        total: Math.ceil(chefs[0].total / limit),
                        page,
                    }
                return res.render('home/chefs', { chefs, pagination })
            }
            return res.render('home/chefs', { chefs })

        } catch (err) {
            console.error(err)
        }
    },

    async chefShow(req, res) {
        try {
            const id = req.params.id

            const chefResults = await Chef.find(id)
            const chef = chefResults.rows[0]

            if ( !chef ) return res.send('chef not found')

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                id,
                page,
                limit,
                offset
            }

            // files chefs
            let results = await Recipe.recipeFind(params)
            let recipes_results = results.rows

            results = await Chef.files(chef.file_id)

            let files_chefs = results.rows[0]
            files_chefs = {
                ...files_chefs,
                src: `${req.protocol}://${req.headers.host}${files_chefs.path.replace('public', '')}`
            }

            // files receitas
            let files = recipes_results.map(async item => ({
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
                return res.render('home/chef-show', { chef, recipes, pagination, files_chefs })
            }
            return res.render('home/chef-show', { chef, recipes, files_chefs })
            
        } catch (err) {
            console.error(err)
        }
    }
}
