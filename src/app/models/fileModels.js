const db = require('../../config/db')

module.exports = {
    create(data) {
        const { name, path } = data
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ( $1, $2 )
            RETURNING id`
        
        const values = [
            name,
            path
        ]

        return db.query(query, values)
    },
}