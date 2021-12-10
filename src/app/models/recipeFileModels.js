const db = require('../../config/db')

module.exports = {
    create(data) {
        const { recipe_id, file_id } = data
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ( $1, $2 )
            RETURNING id`
        
        const values = [
            recipe_id,
            file_id
        ]

        return db.query(query, values)
    },
}