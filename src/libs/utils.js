const Recipe = require('../app/models/Recipe')

module.exports = {
    date(timeStamp) {
        const date = new Date(timeStamp)
        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2) // 0 a 11
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year}`
        }
    },

    paramsPagination(query, limit){
        let { page } = query

        page = page || 1
        let offset = limit * (page - 1)

        const params = {
            limit,
            offset,
            page
        }
        return params
    },

    emailTemplate(field) {
        return `
        <body style="margin:0; padding:0; font-family:helvetica; color:#444;">
            <section style="width:100%; cellpadding:0; cellspacing:0; max-width:600px;">
                <header style="width: 100%; text-align: center; background-color:#111;">
                    <div style="padding:20px 0; align-items: center; text-align: center;">
                        <p style="color: #fff; font-size: 18px;">Foodfy</p>
                    </div>
                </header>
                <section style="width: 100%; cellpadding: 0; cellspacing: 0;">
                    <div style="padding: 20px;">
                        <div style="padding:30px 0;">
                            ${field}
                        </div>
                    </div>
                </section>
                <footer style="width: 100%; background-color: #eee; text-align: center;">
                    <div style="padding:20px 0; text-align: center; align-items: center;">
                        <p style="color:#aaa;">
                            <strong>Foodfy</strong>
                        </p>
                    </div>
                </footer>
            </section>
        </body>
        `
    },

    async getImages(recipeId) {
        let files = await Recipe.recipeFiles(recipeId)
        files = files.rows.map(file => ({
            ...file,
            src: `${file.path.replace('public', '')}`
        }))
        return files
    },
}