const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(callback) {
        const select = `SELECT recipes.*, chefs.name AS chefs_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY id DESC`
        db.query(select, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows)
        })
    },

    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
            RETURNING id`
        
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows[0])
        })
    },
    
    find(id, callback) {
        const select = `SELECT recipes.*, chefs.name AS chefs_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            WHERE recipes.id = $1`
        db.query(select, [id], ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows[0])
        })
    },

    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id = ($1),
                image = ($2),
                title = ($3),
                ingredients = ($4),
                preparation = ($5),
                information = ($6)
            WHERE id = $7
        `
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
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
        const query = `DELETE FROM recipes WHERE id = $1`
        db.query(query, [id], ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            return callback()
        })
    },

    chefFindOption(callback) {
        const chef = `SELECT name, id FROM chefs`
        db.query(chef, (err, results) => {
            if (err) {
                throw `database error ${err}`
            }
            callback(results.rows)
        })
    },

    recipeFind(params) {
        let { id, limit, offset, callback } = params

        let total = `(SELECT count(*) FROM recipes WHERE recipes.chef_id = ${id}) AS total`
        
        let query = `
            SELECT recipes.*, ${total}, 
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = ${id} 
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `
        db.query(query, [limit, offset], ( err, results ) => {
            if (err) {
                throw `database error ${err}`
            }
            callback(results.rows)
        })

    },

    paginate(params) {
        let { limit, offset, callback } = params

        let total = `(SELECT count(*) FROM recipes) AS total`
        
        let query = `
            SELECT recipes.*, ${total},
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], ( err, results ) => {
            if (err) {
                throw `database error ${err}`
            }
            callback(results.rows)
        })
    }
}