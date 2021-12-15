const db = require('../../config/db')

module.exports = {
    async paginate(params) {
        try {
            const { search, limit, offset } = params
        
            let searchQuery = `
                WHERE recipes.title ILIKE '%${search}%'
                OR  chefs.name ILIKE '%${search}%'
                `

            let total = `(SELECT count(*) FROM recipes ${searchQuery}) AS total`

            let query = `
                SELECT recipes.*,
                ${total},
                chefs.name AS chefs_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ${searchQuery}
                ORDER BY updated_at DESC
                LIMIT $1 OFFSET $2
                `

            return db.query(query, [limit, offset])
            
        } catch (err) {
            console.error(err)
        }
    }
}