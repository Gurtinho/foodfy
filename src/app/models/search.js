const db = require('../../config/db')

module.exports = {
    findRecipe(search) {
        const recipes = `
            SELECT recipes.*,
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${search}%'
            OR chefs.name ILIKE '%${search}%'
            `
        return db.query(recipes)
    },

    findChef(search) {
        const chefs = `
            SELECT chefs.*,
            count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.name ILIKE '%${search}%'
            GROUP BY chefs.id
            `
        return db.query(chefs)
    },

    paginate(params) {
        const { search, limit, offset } = params
        
        let searchQuery = `
            WHERE recipes.title ILIKE '%${search}%'
            `

        let total = `(SELECT count(*) FROM recipes ${searchQuery}) AS total`

        let query = `
            SELECT recipes.*,
            ${total},
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${searchQuery}
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
            `

        return db.query(query, [limit, offset])
    }
}