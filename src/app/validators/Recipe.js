async function post(req, res, next) {
    try {
        const keys = Object.keys(req.body)
        for (let key of keys) {
            if (req.body[key] == '') {
                return res.send('Preencha todos os campos')
            }
        }
        if (!req.files || req.files.length == 0) {
           return res.send('Adicione uma imagem')
        }
        next()
        
    } catch (err) {
        console.error(err)
    }
}

async function put(req, res, next) {
    try {
        const keys = Object.keys(req.body)
        for ( let key of keys ) {
            if (req.body[key] == '' && key != 'removed_files') {
                return res.render(`admin/recipes/${keys.id}/edit`)
            }
        }
        next()
        
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    post,
    put
}