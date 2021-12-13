const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(data) {
        const { name, path } = data
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ( $1, $2 )
            RETURNING id`
        
        const values = [
            name,
            path
        ]

        return db.query(query, values)
    },

    async delete(id) {
        try {
            const query_results = `
                SELECT * FROM files
                WHERE id = $1
            `
            const results = await db.query(query_results, [id])
            const file = results.rows[0]

            fs.unlinkSync(file.path)

            const query = `
                DELETE FROM files
                WHERE files.id = $1
            `
            return db.query(query, [id])

        } catch (err) {
            console.error(err)
        }
    }
}