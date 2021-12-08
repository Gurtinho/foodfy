const { off } = require('../../config/db')
const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(id) {
        const select = `
            SELECT recipes.*,
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
            ORDER BY id DESC`
        return db.query(select, [id])
    },

    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ( $1, $2, $3, $4, $5, $6 )
            RETURNING id`
        
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    
    find(id) {
        const select = `
            SELECT * FROM recipes WHERE id = $1`
        
        return db.query(select, [id])
    },

    update(data) {
        const query = `
            UPDATE recipes SET
                chef_id = ($1),
                title = ($2),
                ingredients = ($3),
                preparation = ($4),
                information = ($5)
            WHERE id = $6
        `
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]
        return db.query(query, values)
    },

    delete(id) {
        const query = `DELETE FROM recipes WHERE id = $1`
        return db.query(query, [id])
    },

    chefFindOption() {
        const chef = `SELECT name, id FROM chefs`
        return db.query(chef)
    },

    recipeFind(params) {
        let { id, limit, offset } = params

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
        
        return db.query(query, [limit, offset])
    },

    paginate(params) {
        let { limit, offset } = params

        let total = `(SELECT count(*) FROM recipes) AS total`
        
        let query = `
            SELECT recipes.*, ${total},
            chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `

        return db.query(query, [limit, offset])
    }
}