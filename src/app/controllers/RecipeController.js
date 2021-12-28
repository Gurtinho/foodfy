const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')
const fs = require('fs')

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
            return res.render('admin/recipes/index', {
                error: 'Ocorreu um erro na listagem de receitas'
            })
        } 
    },

    async indexUsersRecipes(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const { userId: id } = req.session

            const params = {
                id,
                limit,
                offset
            }

            let results = await Recipe.findRecipesId(params)
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
            return res.render('admin/recipes/index', {
                error: 'Ocorreu um erro na listagem de receitas'
            })
        }
    },

    async create(req, res) {
        try {
            let findChef = await Recipe.chefFindOption()
            const chefsOptions = findChef.rows

            return res.render('admin/recipes/create', { chefsOptions })

        } catch (err) {
            console.error(err)
            return res.render('admin/admins/index', {
                error: 'Não consegui localizar a pagina de criação de receitas'
            })
        }
    },

    async post(req, res) {
        try {
            const { userId: user_id } = req.session
            
            const {
                chef: chef_id,
                title,
                ingredients,
                preparation,
                information
            } = req.body

            const recipe_id = await Recipe.create({
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information
            })

            const filePromise = req.files.map(async file => {
                const file_id = await File.create({
                    name: file.filename,
                    path: file.path
                })

                await RecipeFile.create({
                    recipe_id,
                    file_id
                })
            })

            await Promise.all(filePromise)

            return res.render(`admin/recipes/create`, {
                success: 'Receita criada com sucesso'
            })

        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/create', {
                error: 'Ocorreu um erro ao criar a receita'
            })
        }
    },
    
    async show(req, res) {
        try {
            const recipe_id = await Recipe.find(req.params.id)
            const recipe = recipe_id.rows[0]

            let results = await Recipe.recipeFiles(recipe.id)
            let recipe_files = results.rows

            recipe_files = recipe_files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/show', { recipe, recipe_files })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/show', {
                error: 'Ocorreu um erro ao localizar a receita'
            })
        } 
    },

    async edit(req, res) {
        try {
            const recipe_id = await Recipe.find(req.params.id)
            const recipe = recipe_id.rows[0]

            if (!recipe) {
                return res.render('admin/admins/myrecipes', {
                    error: 'Ocorreu um erro'
                })
            }

            results = await Recipe.chefFindOption()
            const chefsOptions = results.rows

            results = await Recipe.recipeFiles(recipe.id)
            let files = results.rows

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render(`admin/recipes/edit`, { recipe, chefsOptions, files })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async put(req, res) {
        try {
            const { userId: user_id } = req.session

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
                user_id,
                title,
                ingredients,
                preparation,
                information
            })

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => {
                    const file_id = await File.create({
                        name: file.filename,
                        path: file.path
                    })
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
                    let results = await RecipeFile.delete({ id })
                    const file_id = results.file_id
                    await File.delete({ file_id })
                })
                await Promise.all(removedFilesPromise)
            }
            
            return res.redirect(`/admin/recipes/${id}`)
            
        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },

    async delete(req, res) {
        try { 
            const recipe_file_results = await Recipe.recipeFiles(req.body.id)
            const recipe_file = recipe_file_results.rows

            const recipeDeletePromise = recipe_file.map( async file => {
                await File.delete({ id: file.file_id })
                fs.unlinkSync(file.path)
            })
            await Promise.all(recipeDeletePromise)
            await Recipe.delete({ id: req.body.id })

            return res.redirect(`/admin/recipes/myrecipes`)
    
        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/index', {
                error: 'Ocorreu um erro. Tente novamente'
            })
        }
    },
}


