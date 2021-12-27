const db = require('../../config/db')

const Base = {
    init({ table }) {
        if (!table) throw new Error('Invalid Params!')
        this.table = table

        return this
    },

    async findOne(filters) {
        try {
            let query = `SELECT * FROM ${this.table}`

            Object.keys(filters).map(key => {
                query += `${key}`

                Object.keys(filters[key]).map(field => {
                    query += `${field} = '${filters[key][field]}'`
                })
            })

            const results = await db.query(query)
            return results.rows[0]

        } catch (error) {
            console.error(error)
        } 
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
                let line
                if (Array.isArray(fields[key])) {
                    line = `${ key } = '{"${fields[key].join('","')}"}'`
                } else {
                    line = `${ key } = '${fields[key]}'`
                }
                update.push(line)
            })

            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}`

            await db.query(query)
            return

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

            console.log(del)
            // const query = `DELETE FROM ${this.table} WHERE ${del}`

            // return db.query(query)
            
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Base