const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(callback) {
        const select = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY total_recipes DESC`
        db.query(select, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows)
        })
    },

    create(data) {
        let id = 1
        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
            ) VALUES ( $1, $2, $3 )
            RETURNING id`
        
        const values = [
            data.name,
            id,
            date(Date.now()).iso
        ]

        db.query(query, values)
    },
    
    find(id, callback) {
        const select = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`
        db.query(select, [id], ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows[0])
        })
    },

    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name = ($1),
                avatar_url = ($2)
            WHERE id = $3
        `
        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]
        
        db.query(query, values, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            return callback()
        })
    },

    delete(id, callback) {
        const query = `DELETE FROM chefs WHERE id = $1`
        db.query(query, [id], ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            return callback()
        })
    },

    paginate(params) {
        const { limit, offset, callback } = params

        // contar os registros
        let total = `(SELECT count(*) FROM chefs) AS total`
        
        const query = `
            SELECT chefs.*, ${total},
            count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], ( err, results ) => {
            if (err) {
                throw `database error ${err}`
            }
            callback(results.rows)
        })
    }
}