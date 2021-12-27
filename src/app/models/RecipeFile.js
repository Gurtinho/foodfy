const db = require('../../config/db')
const fs = require('fs')

const Base = require('./Base')

Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    
    async create(data) {
        try {
            const { recipe_id, file_id } = data
            const query = `
                INSERT INTO recipe_files (
                    recipe_id,
                    file_id
                ) VALUES ( $1, $2 )
                RETURNING id`
            
            const values = [
                recipe_id,
                file_id
            ]

            return db.query(query, values)
            
        } catch (err) {
            console.error(err)
       }
    },

    async delete(id) {
        try {
            const returnFile_id = `
                SELECT recipe_files.* FROM recipe_files
                LEFT JOIN files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.id = $1
            `
            let returnId = await db.query(returnFile_id, [id])
            const file_id = returnId.rows[0]

            const query = `
                DELETE FROM recipe_files
                WHERE recipe_files.id = $1
            `
            await db.query(query, [id])

            return file_id

        } catch (err) {
            console.error(err)
        }
    },

    async allFiles(params) {
        try {    
            let { limit, offset } = params

            let total = `(SELECT count(*) FROM recipes) AS total`

            let files = `(SELECT count(path) FROM files) AS path`

            let query = `
                SELECT recipes.*, ${total}, ${files},
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
}