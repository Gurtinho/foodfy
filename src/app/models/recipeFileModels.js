const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(data) {
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
    }
}