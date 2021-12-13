const db = require('../../config/db')

module.exports = {
    async all() {
        try {
            const select = `
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs 
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id
                ORDER BY total_recipes DESC`
            return db.query(select)

        } catch (err) {
            console.error(err)
        }
    },

    async create(data) {
        try {
            const { name, file_id } = data
            const query = `
                INSERT INTO chefs (
                    name,
                    file_id
                ) VALUES ( $1, $2 )
                RETURNING id`
            
            const values = [
                name,
                file_id
            ]

            return db.query(query, values)
            
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

    async update(data) {
        try {
            const query = `
                UPDATE chefs SET
                    name = ($1),
                    file_id = ($2)
                WHERE id = $3
            `
            const values = [
                data.name,
                data.file_id,
                data.id
            ]
            
            return db.query(query, values)
        } catch (err) {
            console.error(err)
        }
    },

    async delete(id) {
        try {
            const query = `DELETE FROM chefs WHERE id = $1`
            return db.query(query, [id])

        } catch (err) {
            console.error(err)
        }
    },

    async paginate(params) {
        try {
            const { limit, offset } = params

            // contar os registros
            let total = `(SELECT count(*) FROM chefs) AS total`
            
            const query = `
                SELECT chefs.*, ${total},
                count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                GROUP BY chefs.id LIMIT $1 OFFSET $2
            `

            return db.query(query, [limit, offset])
            
        } catch (err) {
            console.error(err)
        }
    },

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
    }
}