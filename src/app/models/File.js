const db = require('../../config/db')
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
            return await db.query(query, [id])
           
        } catch (err) {
            console.error(err)
       }
    },

    async updateFile(files_id, data) {
        try {
            const { name, path } = data

            const query = `
                UPDATE files SET
                    name = ($1),
                    path = ($2)
                WHERE files.id = ${files_id}
                `
            
            const values = [
                name,
                path
            ]

            const results = await db.query(query, values)
            return results.rows[0]

        } catch (err) {
            console.error(err)
        }
    },
}