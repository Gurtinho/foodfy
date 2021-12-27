const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,

    // async create(data) {
    //     try {
    //         const { name, path } = data
    //         const query = `
    //             INSERT INTO files (
    //                 name,
    //                 path
    //             ) VALUES ( $1, $2 )
    //             RETURNING id`
            
    //         const values = [
    //             name,
    //             path
    //         ]

    //         return db.query(query, values)
            
    //     } catch (err) {
    //         console.error(err)
    //     }
    // },

    async allFiles(params) {
        try {
            const { limit, offset } = params

            const total = `(SELECT count(*) FROM chefs) AS total`
            
            const total_recipes = `
                (SELECT count(*) 
                FROM recipes 
                WHERE chefs.id = recipes.chef_id)
                AS total_recipes`

            const select = `
                SELECT chefs.*, ${total}, ${total_recipes},
                files.path AS path
                FROM chefs 
                LEFT JOIN files ON (chefs.file_id = files.id)
                LIMIT $1 OFFSET $2
                `
            
            return db.query(select, [limit, offset])

        } catch (err) {
            console.error(err)
        }
    },

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

    // async delete(id) {
    //     try {
    //         const query_results = `
    //             SELECT * FROM files
    //             WHERE id = $1
    //         `
    //         const results = await db.query(query_results, [id])
    //         const file = results.rows[0]

    //         fs.unlinkSync(file.path)

    //         const query = `
    //             DELETE FROM files
    //             WHERE id = $1
    //         `
    //         return db.query(query, [id])

    //     } catch (err) {
    //         console.error(err)
    //     }
    // }
}