const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async create(data) {
        try {
            const { chef_id, user_id, title, ingredients, preparation, information } = data
            const query = `
                INSERT INTO recipes (
                    chef_id,
                    user_id,
                    title,
                    ingredients,
                    preparation,
                    information
                ) VALUES ( $1, $2, $3, $4, $5, $6 )
                RETURNING id`
            
            const values = [
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information
            ]

            return db.query(query, values)
            
        } catch (err) {
            console.error(err)
        }
    },
    
    async find(id) {
        try {
            const select = `
                SELECT recipes.*,
                chefs.name AS chefs_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
                WHERE recipes.id = $1
                ORDER BY id DESC`
            
            return db.query(select, [id])
            
        } catch (err) {
            console.error(err)
        }
    },

    async update(id, data) {
        try {
            const { chef_id, user_id, title, ingredients, preparation, information } = data
            const query = `
                UPDATE recipes SET
                    chef_id = ($1),
                    user_id = ($2),
                    title = ($3),
                    ingredients = ($4),
                    preparation = ($5),
                    information = ($6)
                WHERE id = ${id}
            `
            const values = [
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information
            ]
            return db.query(query, values)
            
        } catch (err) {
            console.error(err)
        }
    },

    async delete(id) {
        try {
            const query = `
                DELETE FROM recipes
                WHERE recipes.id = $1
            `
            await db.query(query, [id])

        } catch (err) {
            console.error(err)
        }
    },

    async chefFindOption() {
        try {
            const chef = `SELECT name, id FROM chefs`
            return db.query(chef)

        } catch (err) {
            console.error(err)
        }
    },

    async recipeFind(params) {
        try {
            let { id, limit, offset } = params

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
            let { limit, offset } = params

            let total = `(SELECT count(*) FROM recipes) AS total`

            let query = `
                SELECT recipes.*, ${total},
                chefs.name AS chefs_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY id DESC
                LIMIT $1 OFFSET $2
            `
            return await db.query(query, [limit, offset])
           
        } catch (err) {
            console.error(err)
       }
    },

    async recipeFiles(id) {
        try {
            const query = `
                SELECT recipe_files.*,
                files.name AS name, files.path AS path, files.id AS file_id
                FROM recipe_files
                LEFT JOIN files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
            `
            return db.query(query, [id])

        } catch (err) {
           console.error(err)
        }
    },

    async recipeFilesDelete(id) {
        try {
            const query = `
                DELETE FROM recipe_files
                WHERE recipe_files.recipe_id = $1
            `
            await db.query(query, [id])

        } catch (err) {
            console.error(err)
        }
    }
}