function addInfo() {
    const ingredients = document.querySelector('.ingredients')
    const preparation = document.querySelector('.preparation')

    const buttonIngredient = document.querySelector('.add-ingredient')
    const buttonPreparation = document.querySelector('.add-preparation')

    const buttonRemoveIngredient = document.querySelector('.remove-ingredient')
    const buttonRemovePreparation = document.querySelector('.remove-preparation')

    // ADD NEW FIELDS
    function addNewFields (field) {
        const newField = field.lastElementChild
        if (newField.lastElementChild.value == '') {
            newField.lastElementChild.style.color = '#e61f4a'
            newField.lastElementChild.style.borderColor = '#e61f4a'
            setTimeout(() => {
                newField.lastElementChild.style.borderColor = '#ddd'
                newField.lastElementChild.style.color = '#ddd'
            }, 1000)
            return false
        }
        const fieldClone = newField.cloneNode(true)
        field.appendChild(fieldClone)
        fieldClone.lastElementChild.value = ''
        buttonRemoveIngredient.style.visibility = 'visible'
    }

    // REMOVE FIELDS
    function removeNewFields (field) {
        const lastField = field.lastElementChild
        const firstField = field.firstElementChild
        if (lastField.lastElementChild.value == '' && firstField.firstElementChild.value != '') {
            lastField.remove()
            field.nextElementSibling.classList.remove('ativo')
        }
        if (lastField.lastElementChild.value != '') {
            field.nextElementSibling.classList.add('ativo')
            lastField.lastElementChild.style.borderColor = '#e61f4a'
        }
        // auto remove warnings
        setTimeout(() => {
            field.nextElementSibling.classList.remove('ativo')
            lastField.lastElementChild.style.borderColor = '#ddd'
        }, 1000)
    }

    buttonIngredient.addEventListener('click', () => {addNewFields(ingredients)})
    buttonPreparation.addEventListener('click', () => {addNewFields(preparation)})
    
    buttonRemoveIngredient.addEventListener('click', () => {removeNewFields(ingredients)})
    buttonRemovePreparation.addEventListener('click', () => {removeNewFields(preparation)})
}
addInfo()