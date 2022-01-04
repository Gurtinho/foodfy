const Recipe = require('../models/Recipe')

const { getImages } = require('../../libs/utils')

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },

    async recipe() {
        try {
            let files = []
            const recipe = await Recipe.find(this.filter)
            files = await getImages(recipe.id)
            if (files.length != 0) {
                recipe.files = files
            } else {
                recipe.files = [{ src: `http://placehold.it/940x280?text=${recipe.title}` }]
            }
            return recipe

        } catch (error) {
            console.error(error)
        }
    },

    async recipes() {
        try {
            const recipes = await Recipe.paginate(this.filter)
            const recipesPromise = recipes.rows.map(async recipe => {
                const files = await getImages(recipe.id)
                if (files.length != 0) {
                    recipe.src = files[0].src
                } else {
                    recipe.src = `http://placehold.it/940x280?text=${recipe.title}`
                }
                return recipe
            })
            const recipesResults = Promise.all(recipesPromise)
            return recipesResults
            
        } catch (error) {
            console.error(error)
        }
    },

    async userRecipes() {
        try {
            const recipes = await Recipe.findRecipesId(this.filter)
            const recipesPromise = recipes.rows.map(async recipe => {
                const files = await getImages(recipe.id)
                if (files.length != 0) {
                    recipe.src = files[0].src
                } else {
                    recipe.src = `http://placehold.it/940x280?text=${recipe.title}`
                }
                return recipe
            })
            const recipesResults = Promise.all(recipesPromise)
            return recipesResults
            
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = LoadService