const db = require('../../config/db')
const { hash } = require('bcryptjs')

module.exports = {
    async findOne(filters) {
        try {
            let query = `SELECT * FROM users`

            Object.keys(filters).map(key => {
                query = `${query}
                ${key}`

                Object.keys(filters[key]).map(field => {
                    query = `${query}
                    ${field} = '${filters[key][field]}'`
                })
            })

            const results = await db.query(query)
            return results.rows[0]

        } catch (err) {
            console.error(err)
        } 
    },

    async findAll(params) {
        try {
            let { limit, offset } = params

            let total = `(SELECT count(*) FROM users) AS total`

            let query = `
                SELECT users.*, ${total}
                FROM users
                ORDER BY updated_at DESC
                LIMIT $1 OFFSET $2
            `
            return await db.query(query, [limit, offset])
           
        } catch (err) {
            console.error(err)
        }
    },

    async create(data) {
        try {
            let { name, email, password, is_admin } = data
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password, 
                    is_admin
                ) VALUES ( $1, $2, $3, $4 )
                RETURNING id`
           
            const values = [
                name,
                email,
                password, 
                is_admin
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
            
        } catch (err) {
            console.error(err)
        }
    },

    async update(id, fields) {
        try {
            let query = `UPDATE users SET`

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                    ${key} = '${fields[key]}',`
                } else {
                    query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}`
                }
            })
            await db.query(query)
            return

        } catch (err) {
            console.error(err)
        }
    },

    async delete(data) {

    }
}