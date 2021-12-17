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
            const { name, email, password } = data
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password
                ) VALUES ( $1, $2, $3 )
                RETURNING id`
            
            // criptografia
            const passwordHash = await hash(password, 8)

            const values = [
                name,
                email,
                passwordHash
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
            
        } catch (err) {
            console.error(err)
        }
    }
}