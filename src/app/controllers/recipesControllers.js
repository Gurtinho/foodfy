const Recipe = require('../models/recipeModels')
const File = require('../models/fileModels')
const RecipeFile = require('../models/recipeFileModels')

module.exports = {
    async index(req, res) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }
        const resultsRecipes = await Recipe.paginate(params)
        const recipes = resultsRecipes.rows

        if (recipes[0] != null) {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            }
            return res.render('admin/recipes/index', { recipes, pagination })
        }
        return res.render('admin/recipes/index', { recipes })
    },

    async create(req, res) {
        let findChef = await Recipe.chefFindOption()
        const chefsOptions = findChef.rows

        return res.render('admin/recipes/create', { chefsOptions })
    },

    async post(req, res) {
        const keys = Object.keys(req.body)
        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        const { chef: chef_id, title, ingredients, preparation, information } = req.body

        if (req.files.length == 0) {
            return res.send('Adicione ao menos uma imagem')
        }

        const recipe_idResults = await Recipe.create({
            chef_id,
            title,
            ingredients,
            preparation,
            information
        })

        const recipe_id = recipe_idResults.rows[0].id

        const filePromise = req.files.map(async file => {
            const file_idResults = File.create({
                name: file.filename,
                path: file.path
            })

            const file_id = (await file_idResults).rows[0].id

            await RecipeFile.create({
                recipe_id,
                file_id
            })
        })

        await Promise.all(filePromise)

        return res.redirect(`/admin/recipes/${recipe_id}`)
    },
    
    async show(req, res) {
        let results = await Recipe.recipe(req.params.id)
        const recipe = results.rows[0]

        return res.render('admin/recipes/show', { recipe })
    },

    async edit(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) {
            return res.send('recipes not found!')
        }
        
        // chefs
        results = await Recipe.chefFindOption()
        const chefsOptions = results.rows

        // images 
        // results = await Recipe.files(recipe.id)

        return res.render('admin/recipes/edit', { recipe, chefsOptions })
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for ( let key of keys ) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }

        await Recipe.update(req.body)
        
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },

    async delete(req, res) {
        await Recipe.delete(req.body.id)

        return res.redirect(`/admin/recipes`)
    },
}



