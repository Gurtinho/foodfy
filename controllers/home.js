const data = require('../data.json')

exports.about = (req, res) => {
    return res.render("home/about")
}

exports.home =  (req, res) => {
    return res.render("home/home", { recipes: data.recipes })
}

exports.recipes = (req, res) => {
    return res.render("home/recipes", { recipes: data.recipes })
}

exports.id = (req, res) => {
    const id = req.params.id
    const foundRecipe = data.recipes.find((recipe) => {
        return recipe.id == id
    })
    if (!foundRecipe) {
        return res.send('Receita não encontrada')
    }
    const recipe = {
        ...foundRecipe
    }
    return res.render("home/food", { recipe })
}