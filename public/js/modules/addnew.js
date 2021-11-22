export function addInfo() {
    // INPUTS
    const ingredients = document.querySelector('.ingredients')
    const preparation = document.querySelector('.preparation')
    // BUTTONS ADD INPUTS
    const buttonPreparation = document.querySelector('.add-preparation')
    const buttonIngredient = document.querySelector('.add-ingredient')
    // BUTTONS REMOVE INPUTS
    const buttonRemoveIngredient = document.querySelector('.remove-ingredient')
    const buttonRemovePreparation = document.querySelector('.remove-preparation')


    // ADD NEW FIELDS
    // mais funcional
    const addNewFields = container => {
        const newField = container.lastElementChild
        if (newField.lastElementChild.value == '') {
            return false
        }
        const fieldClone = newField.cloneNode(true)
        container.appendChild(fieldClone)
        fieldClone.lastElementChild.value = ''
        container.nextElementSibling.classList.remove('ativo')
        newField.lastElementChild.style.borderColor = '#ddd'
        fieldClone.lastElementChild.style.borderColor = '#ddd'
    }
    buttonIngredient.addEventListener('click', () => { addNewFields( ingredients ) })
    buttonPreparation.addEventListener('click', () => { addNewFields( preparation ) })


    // REMOVE FIELDS
    const removeNewFields = field => {
        const lastField = field.lastElementChild
        const firstField = field.firstElementChild
        if (lastField.lastElementChild.value == '' && firstField.firstElementChild.value != '') {
            lastField.remove()
            field.nextElementSibling.classList.remove('ativo')
        }
        if (lastField.lastElementChild.value != '') {
            field.nextElementSibling.classList.add('ativo')
            lastField.lastElementChild.style.borderColor = 'red'
        }
    }
    buttonRemoveIngredient.addEventListener('click', () => { removeNewFields( ingredients ) })
    buttonRemovePreparation.addEventListener('click', () => { removeNewFields( preparation ) })
}