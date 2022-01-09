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
            recipes.length != 0
            ? pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('admin/recipes/index', { recipes, pagination })

        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro na listagem de receitas',
                link: '/admin/recipes/all'
            })
        } 
    },

    async indexUsersRecipes(req, res) {
        try {
            const pagination = paramsPagination(req.query, 6)
            pagination.id = req.session.userId
            const recipes = await LoadService.load('userRecipes', pagination)
            recipes.length != 0
            ? pagination.total = Math.ceil(recipes[0].total / pagination.limit)
            : pagination.total = 1
            return res.render('admin/recipes/index', { recipes, pagination })

        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro na listagem de receitas',
                link: '/admin/recipes/myrecipes'
            })
        }
    },

    async create(req, res) {
        try {
            const chefs = await Recipe.chefFindOption()
            return res.render('admin/recipes/create', { chefs })

        } catch (error) {
            console.error(error)
            return res.render('admin/admins/index', {
                error: 'Não foi possível localizar a pagina de criação de receitas'
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

            return res.render(`cards/success`, {
                card_success: 'Receita criada com sucesso',
                link: `/admin/recipes/${recipe_id}`
            })

        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro ao criar a receita',
                link: '/admin/admins/create'
            })
        }
    },
    
    async show(req, res) {
        try {
            const recipe = await LoadService.load('recipe', req.params.id)
            return res.render('admin/recipes/show', { recipe })
            
        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                error: 'Ocorreu um erro ao localizar a receita',
                link: '/admin/recipes/myrecipes'
            })
        } 
    },

    async edit(req, res) {
        try {
            const recipe = await LoadService.load('recipe', req.params.id)
            if (!recipe) {
                return res.render('cards/error', {
                    card_error: 'Ocorreu um erro',
                    link: '/admin/recipes/myrecipes'
                })
            }
            const chefs = await Recipe.chefFindOption()
            return res.render(`admin/recipes/edit`, { recipe, chefs })
            
        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro. Tente novamente',
                link: '/admin/recipes/myrecipes'
            })
        }
    },

    async put(req, res) {
        try {
            const {
                id,
                removed_files,
                chef: chef_id,
                title,
                ingredients,
                preparation,
                information
            } = req.body

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
                    await RecipeFile.delete({ file_id: id })
                    const file = await File.findOne({ where: { id } })
                    await File.delete({ id })

                    if (file.path != 'public/images/recipe_placeholder.png') {
                        fs.unlinkSync(file.path)
                    }
                })
                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(id, {
                chef_id,
                title,
                ingredients,
                preparation,
                information
            })
            
            return res.render(`cards/success`, {
                card_success: `Receita atualizada com sucesso`,
                link: `/admin/recipes/${id}`
            })
            
        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro. Tente novamente',
                link: '/admin/recipes/myrecipes'
            })
        }
    },

    async delete(req, res) {
        try { 
            const recipe_file = await Recipe.recipeFiles(req.body.id)
            if (recipe_file.rows.length != 0) {
                const recipeDeletePromise = recipe_file.rows.map( async file => {
                    await File.delete({ id: file.file_id })
                    if (file.path != 'public/images/recipe_placeholder.png') {
                        fs.unlinkSync(file.path)
                    }
                })
                await Promise.all(recipeDeletePromise)
            }
            await Recipe.delete({ id: req.body.id })
            return res.render(`cards/success`, {
                card_success: 'Receita deletada com sucesso',
                link: '/admin/recipes/myrecipes'
            })
    
        } catch (error) {
            console.error(error)
            return res.render('cards/error', {
                card_error: 'Ocorreu um erro. Tente novamente',
                link: `/admin/recipes/${ req.body.id }`
            })
        }
    },
}


