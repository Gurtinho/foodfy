const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async files(id) {
        try {
            const query = `
                SELECT * FROM files
                WHERE id = $1
            `
            return db.query(query, [id])
            
        } catch (err) {
            console.error(err)
        }
    },

    async find(id) {
        try {
            const select = `
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs 
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id`
            
            return db.query(select, [id])
            
        } catch (err) {
            console.error(err)
        }
    },

    async paginate(params) {
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
}