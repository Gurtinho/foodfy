// is users
function onlyUsers(req, res, next) {
    try {
        if (!req.session.userId) {
            return res.render('admin/session/login', {
                error: 'Somente usuários tem essa permissão!'
            })
        }
        next()
        
    } catch (err) {
        console.error(err)
    }
}

// is users admin
function onlyAdminUsers(req, res, next) {

}

module.exports = {
    onlyUsers
}