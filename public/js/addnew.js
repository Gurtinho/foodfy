function addInfo() {
    const ingredients = document.querySelector('.ingredients')
    const preparation = document.querySelector('.preparation')

    const buttonIngredient = document.querySelector('.add-ingredient')
    const buttonPreparation = document.querySelector('.add-preparation')

    const buttonRemoveIngredient = document.querySelector('.remove-ingredient')
    const buttonRemovePreparation = document.querySelector('.remove-preparation')


    function addNewFields(field) {
        const fChild = field.lastElementChild
        if (fChild.lastElementChild.value == '') {
                fChild.lastElementChild.classList.add('active')
                setTimeout(() => {
                    fChild.lastElementChild.classList.remove('active')
                }, 1000)
                return false
        }
        const fieldClone = fChild.cloneNode(true)
        field.appendChild(fieldClone)
        fieldClone.lastElementChild.value = ''
    }
 

    // REMOVE FIELDS
    function removeNewFields(field) {
        if (field.children.length > 1) {
            for (let fChild of field.children) {
                if (fChild.children[0].value == '') {
                    fChild.remove()
                }
            }
        } else if (field.children.length == 1) {
            for (let fChild of field.children) {
                fChild.children[0].classList.add('active')
                setTimeout(() => {
                    fChild.children[0].classList.remove('active')
                }, 1000)
            }
        }
    }

    buttonIngredient.addEventListener('click', () => {addNewFields(ingredients)})
    buttonPreparation.addEventListener('click', () => { addNewFields(preparation)})

    buttonRemoveIngredient.addEventListener('click', () => {removeNewFields(ingredients)})
    buttonRemovePreparation.addEventListener('click', () => {removeNewFields(preparation)})
}
addInfo()