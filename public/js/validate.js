const validate = {
    apply(input, func) {
        validate.clearErrors(input)

        let results = validate[func](input.value)
        input.value = results.value

        if (results.error) {
            validate.displayError(input, results.error)
        }
    },

    displayError(input, error) {
        const divError = document.createElement('div')
        divError.classList.add('error')
        divError.innerHTML = error
        input.parentNode.appendChild(divError)

        input.focus()
    },

    clearErrors(input) {
        const divClear = input.parentNode.querySelector('.error')
        if (divClear) {
            divClear.remove()
        }
    },

    validEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) {
            error = 'email inválido!'
        }
        
        return { error, value }
    }
}