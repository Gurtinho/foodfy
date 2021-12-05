const db = require('../../config/db')

module.exports = {
    findRecipe(search, callback) {
        const recipes = `
            SELECT recipes.*,
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${search}%'
            OR chefs.name ILIKE '%${search}%'
            `
        db.query(recipes, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows)
        })
    },

    findChef(search, callback) {
        const chefs = `
            SELECT chefs.*,
            count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.name ILIKE '%${search}%'
            GROUP BY chefs.id
            `
        db.query(chefs, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows)
        })
    },

    paginate(params) {
        const { search, limit, offset, callback } = params

        // contar os registros
        let query = ''
        let searchQuery = ''
        let total = `(SELECT count(*) FROM recipes) AS total`
        
        if (search) {

            searchQuery = `
                WHERE recipes.title ILIKE '%${search}%'
                WHERE chefs.name ILIKE '%${search}%'
            `
            total = `(SELECT count(*) FROM recipes
            ${searchQuery}
            ) AS total
            `
        }

        query = `
            SELECT recipes.*, ${total},
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${searchQuery}
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], ( err, results ) => {
            if (err) {
                throw `database error ${err}`
            }
            callback(results.rows)
        })
    }
}