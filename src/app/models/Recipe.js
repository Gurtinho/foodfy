const db = require('../../config/db')
const fs = require('fs')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,

    async find(id) {
        try {
            const select = `
                SELECT recipes.*,
                chefs.name AS chefs_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
                WHERE recipes.id = $1
                ORDER BY id DESC`
            
            const results = await db.query(select, [id])
            return results.rows[0]
            
        } catch (err) {
            console.error(err)
        }
    },

    async chefFindOption() {
        try {
            const chef = `SELECT name, id FROM chefs`
            const results = await db.query(chef)
            return results.rows

        } catch (err) {
            console.error(err)
        }
    },

    async recipeFind(id, params) {
        try {
            let { limit, offset } = params

            let total = `(SELECT count(*) FROM recipes WHERE recipes.chef_id = ${id}) AS total`

            let query = `
                    SELECT recipes.*, ${total}, 
                    chefs.name AS chefs_name
                    FROM recipes
                    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                    WHERE chefs.id = ${id}
                    ORDER BY id DESC
                    LIMIT $1 OFFSET $2
                `
            
            return db.query(query, [limit, offset])
            
        } catch (err) {
            console.error(err)
        }
    },

    async paginate(params) {
        try {
            let { search, limit, offset } = params

            let total = `(SELECT count(*) FROM recipes) AS total`

            let query = `
                SELECT recipes.*, ${total},
                chefs.name AS chefs_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY updated_at DESC
                LIMIT $1 OFFSET $2
            `

            if (search) {
                const searchQuery = `
                    WHERE recipes.title ILIKE '%${search}%'
                    OR chefs.name ILIKE '%${search}%'
                `
                const total = `(SELECT count(*) FROM recipes ${searchQuery}) AS total`

                query = `
                    SELECT recipes.*, ${total},
                    chefs.name AS chefs_name
                    FROM recipes
                    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                    ${searchQuery}
                    ORDER BY updated_at DESC
                    LIMIT $1 OFFSET $2
                `
            }

            return await db.query(query, [limit, offset])
           
        } catch (err) {
            console.error(err)
       }
    },

    async recipeFiles(id) {
        try {
            const query = `
                SELECT files.*,
                files.name AS name, files.path AS path, files.id AS file_id
                FROM files
                LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
            `
            return await db.query(query, [id])

        } catch (err) {
           console.error(err)
        }
    },

    async findRecipesId(params) {
        try {
            let { id, limit, offset } = params

            const total = `(SELECT count(*) FROM recipes WHERE recipes.user_id = users.id) AS total`

            const chefs = `(SELECT name FROM chefs WHERE recipes.chef_id = chefs.id) AS chefs_name`
            
            const query = `
                SELECT recipes.*, ${total}, ${chefs}
                FROM recipes
                LEFT JOIN users ON (recipes.user_id = users.id)
                WHERE user_id = ${id}
                LIMIT $1 OFFSET $2
            `
            return await db.query(query, [limit, offset])
            
        } catch (err) {
            console.error(err)
        }
    }
}