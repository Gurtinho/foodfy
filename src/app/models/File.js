const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,

    async findFiles(id) {
        try {
            const query = `
                SELECT * FROM files
                LEFT JOIN chefs ON (chefs.file_id = files.id)
                WHERE chefs.id = $1
            `
            return db.query(query, [id])
           
        } catch (err) {
            console.error(err)
       }
    },

    async updateFile(chefs_id, data) {
        try {
            const { name, path } = data

            const query_results = `
                    SELECT * FROM files
                    WHERE files.id = $1
                `
                const results = await db.query(query_results, [chefs_id])
                const file = results.rows[0]

                fs.unlinkSync(file.path)

            const query = `
                UPDATE files SET
                    name = ($1),
                    path = ($2)
                WHERE files.id = ${chefs_id}
                `
            
            const values = [
                name,
                path
            ]

            return db.query(query, values)

        } catch (err) {
            console.error(err)
        }
    },
}