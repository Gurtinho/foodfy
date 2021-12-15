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
                limit,
                offset
            }

            let results = await Recipe.paginate(params)
            let recipes_results = results.rows
            
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
            let results = await Recipe.find(req.params.id)
            let recipe = results.rows[0]

            results = await Recipe.recipeFiles(recipe.id)
            let recipe_files = results.rows

            recipe_files = recipe_files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/show', { recipe, recipe_files })
            
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

            // table files
            results = await Recipe.recipeFiles(recipe.id)
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
            const {
                id,
                removed_files,
                chef: chef_id,
                title,
                ingredients,
                preparation,
                information
            } = req.body

            await Recipe.update(id, {
                chef_id,
                title,
                ingredients,
                preparation,
                information
            })

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => {
                    const file_id_results = await File.create({
                        name: file.filename,
                        path: file.path
                    })
                    const file_id = file_id_results.rows[0].id
                    await RecipeFile.create({
                        recipe_id: id,
                        file_id
                    })
                })
                await Promise.all(newFilesPromise)
            }

            if (removed_files) {
                const removedFiles = removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(async id => {
                    let results = await RecipeFile.delete(id)
                    const file_id = results.file_id
                    await File.delete(file_id)
                })
                await Promise.all(removedFilesPromise)
            }
            
            return res.redirect(`/admin/recipes/${id}`)
            
        } catch (err) {
            console.error(err)
        }
    },

    async delete(req, res) {
        try {
            const recipe_file_results = await Recipe.recipeFiles(req.body.id)
            const recipe_file = recipe_file_results.rows[0].file_id

            Recipe.recipeFilesDelete(req.body.id)

            await File.delete(recipe_file)

            await Recipe.delete(req.body.id)
            
            return res.redirect(`/admin/recipes`)
            
        } catch (err) {
            console.error(err)
        }
    },
}


