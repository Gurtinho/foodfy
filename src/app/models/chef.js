const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(callback) {
        const select = `SELECT * FROM chefs`
        db.query(select, ( err, results ) => {
            if (err) {
                throw `Database Error ${err}`
            }
            callback(results.rows)
        })
    },

    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ( $1, $2, $3 )
            RETURNING id`
        
        const values = [
            data.name,
            data.avatar_url,
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
        const select = `SELECT * FROM chefs WHERE id = $1`
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
    }
}