const fs = require('fs')
const data = require('../data.json')

// index
exports.index = (req, res) => {
    return res.render('admin/recipes/index', { recipes: data.recipes })
}

// create
exports.create = (req, res) => {
    return res.render('admin/recipes/create')
}

// post 
exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for ( let key of keys ) {
        if (req.body[key] == '') {
            return res.send('Preencha todos os campos')
        }
    }

    let id = 1
    const lastRecipe = data.recipes[data.recipes.length - 1]
    if (lastRecipe) {
        id = lastRecipe.id + 1
    }

    let { image, title, ingredients, preparation, information } = req.body
    let author = ''
    
    data.recipes.push({
        id,
        image,
        title,
        author,
        ingredients,
        preparation,
        information
    })
    
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send('Write File Error')
        }
        return res.redirect('/admin/recipes/index')
    })
}

// show
exports.show = (req, res) => {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => {
        return recipe.id == id
    })
    if (!foundRecipe) {
        return res.send('Receita não encontrada')
    }

    const recipe = {
        ...foundRecipe
    }

    return res.render('admin/recipes/show', { recipe })
}

// edit
exports.edit = (req, res) => {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => {
        return recipe.id == id
    })
    if (!foundRecipe) {
        return res.send('Receita não encontrada')
    }

    const recipe = {
        ...foundRecipe
    }

    return res.render('admin/recipes/edit', { recipe })
}

// put 
exports.put = (req, res) => {
    const { id } = req.body

    let index = 0
    const foundRecipe = data.recipes.find((recipe, foundIndex) => {
        if (id == recipe.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundRecipe) {
        return res.send('Não foi possivel editar a receita')
    }

    const recipe = {
        ...foundRecipe,
        ...req.body,
        id: Number(req.body.id)
    }

    data.recipes[index] = recipe

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send('Write File Error')
        }
        res.redirect('/admin/recipes/index')
    })
}

// delete
exports.delete = (req, res) => {
    const { id } = req.body

    const filteredRecipe = data.recipes.filter((recipe) => {
        return recipe.id != id
    })

    data.recipes = filteredRecipe

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send('Write File Error')
        }
        return res.redirect('/admin/recipes/index')
    })
}


