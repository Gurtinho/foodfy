const Recipe = require('../models/recipeModels')
const File = require('../models/fileModels')
const RecipeFile = require('../models/recipeFileModels')

module.exports = {
    async index(req, res) {
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

        } catch (err) {
            console.error(err)
        }
        
    },

    async create(req, res) {
        try {
            let findChef = await Recipe.chefFindOption()
            const chefsOptions = findChef.rows

            return res.render('admin/recipes/create', { chefsOptions })

        } catch (err) {
            console.error(err)
        }
    },

    async post(req, res) {
        try {
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
                const file_id_results = File.create({
                    name: file.filename,
                    path: file.path
                })

                const file_id = (await file_id_results).rows[0].id

                await RecipeFile.create({
                    recipe_id,
                    file_id
                })
            })

            await Promise.all(filePromise)

            return res.redirect(`/admin/recipes/${recipe_id}`)

        } catch (err) {
            console.error(err)
        }
    },
    
    async show(req, res) {
        try {
            let results = await Recipe.recipe(req.params.id)
            const recipe = results.rows[0]

            return res.render('admin/recipes/show', { recipe })
            
        } catch (err) {
            console.error(err)
        } 
    },

    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            if (!recipe) {
                return res.send('recipes not found!')
            }
            
            // chefs list
            results = await Recipe.chefFindOption()
            const chefsOptions = results.rows

            // table recipe_files
            results = await Recipe.recipe_files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render(`admin/recipes/edit`, { recipe, chefsOptions, files })
            
        } catch (err) {
            console.error(err)
        }
    },

    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for ( let key of keys ) {
                if (req.body[key] == '' && key != 'removed_files') {
                    return res.send('Preencha todos os campos')
                }
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => {
                    File.delete(id)
                })

                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(req.body)
            
            return res.redirect(`/admin/recipes/${req.body.id}`)
            
        } catch (err) {
            console.error(err)
        }
    },

    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id)
            return res.redirect(`/admin/recipes`)
            
        } catch (err) {
            console.error(err)
        }
    },
}


