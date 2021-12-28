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
}