const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')
const fs = require('fs')
const { paramsPagination } = require('../../libs/utils')
const LoadService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            const recipes = await LoadService.load('recipes', pagination)

            if (recipes.length != 0) {
                pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            } else {
                pagination.total = 1
            }

            return res.render('admin/recipes/index', { recipes, pagination })

        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/index', {
                error: 'Ocorreu um erro na listagem de receitas'
            })
        } 
    },

    async indexUsersRecipes(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            pagination.id = req.session.userId
            const recipes = await LoadService.load('userRecipes', pagination)

            if (recipes.length != 0) {
                pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            } else {
                pagination.total = 1
            }
            return res.render('admin/recipes/index', { recipes, pagination })

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
            const recipe = await LoadService.load('recipe', req.params.id)

            return res.render('admin/recipes/show', { recipe })
            
        } catch (err) {
            console.error(err)
            return res.render('admin/recipes/show', {
                error: 'Ocorreu um erro ao localizar a receita'
            })
        } 
    },

    async edit(req, res) {
        try {
            const recipe = await LoadService.load('recipe', req.params.id)

            if (!recipe) {
                return res.render('admin/admins/myrecipes', {
                    error: 'Ocorreu um erro'
                })
            }

            results = await Recipe.chefFindOption()
            const chefsOptions = results.rows

            return res.render(`admin/recipes/edit`, { recipe, chefsOptions })
            
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


