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
            
            // criptografia
            const passwordHash = await hash(password, 8)

            if (is_admin != true) {
                is_admin = false
            }
            
            const values = [
                name,
                email,
                passwordHash, 
                is_admin
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
            
        } catch (err) {
            console.error(err)
        }
    },

    async update(id, fields) {
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
    }
}