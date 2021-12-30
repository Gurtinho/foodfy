const Chef = require('../models/Chef')
const File = require('../models/File')

const { getImages } = require('../../libs/utils')

const LoadService = {

    load(service, filter) {
        this.filter = filter
        return this[service]()
    },

    async chef() {
        try {
            const id = this.filter
            const chef = await Chef.find(id)
            chef.file = await File.findOne({ where: { id: chef.file_id } })
            chef.file.src = `${chef.file.path.replace('public', '')}`

            const recipes = await Chef.findRecipes(chef.id)
            const recipesPromise = recipes.map(async recipe => {
                const files = await getImages(recipe.id)
                if (files.length != 0) {
                    recipe.src = files[0].src
                } else {
                    recipe.src = `http://placehold.it/940x280?text=${recipe.title}`
                }
                console.log(recipe)
                return recipe
            })
            chef.recipes = await Promise.all(recipesPromise)
            return chef

        } catch (error) {
            console.error(error)
        }
    },

    async chefs() {
        try {
            const id = this.filter
            const chef = await Chef.paginate(id)
            const chefsPromise = chef.rows.map( async chef => {
                const file = await File.findOne({ where: { id: chef.file_id } })
                chef.image = `${file.path.replace('public', '')}`
                return chef
            })
            const chefs = await Promise.all(chefsPromise)
            return chefs

        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = LoadService