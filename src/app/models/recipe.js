const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(callback) {
        const select = `SELECT * FROM recipes`
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
            0,
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
        const select = `SELECT * FROM recipes WHERE id = $1`
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
            0,
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
    }
}