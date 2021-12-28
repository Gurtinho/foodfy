const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,

    async paginate(params) {
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
    }
}