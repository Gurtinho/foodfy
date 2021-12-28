const db = require('../../config/db')

const Base = {
    init({ table }) {
        if (!table) throw new Error('Invalid Params!')
        this.table = table

        return this
    },

    async findOne(filters) {
        let query = `SELECT * FROM ${this.table}`

        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },

    async create(fields) {
        try {
            let keys = []
            let values = []

            Object.keys(fields).map( key => {
                keys.push(key)

                if (Array.isArray(fields[key])) {
                    values.push(`'{"${fields[key].join('","')}"}'`)
                } else {
                    values.push(`'${fields[key]}'`)
                }
            })

            const query = `
                INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id`
            
            const results = await db.query(query)
            return results.rows[0].id
            
        } catch (error) {
            console.error(error)
        }
    },

    async update(id, fields) {
        try {
            let update = []

            Object.keys(fields).map( key => {
                let where
                if (Array.isArray(fields[key])) {
                    where = `${ key } = '{"${fields[key].join('","')}"}'`
                } else {
                    where = `${ key } = '${fields[key]}'`
                }
                update.push(where)
            })

            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}`
            return await db.query(query)

        } catch (error) {
            console.error(error)
        }
    },
     
    async delete(fields) {
        try {
            let del
            Object.keys(fields).map(key => {
                del = `${key} = ${fields[key]}`
            })

            const query = `DELETE FROM ${this.table} WHERE ${del}`
            await db.query(query)
            
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Base