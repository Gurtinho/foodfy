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
        input.classList.add('color-error')
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
            error = 'Insira um email válido'
        }
        return { error, value }
    },

    items: document.querySelectorAll('.item input, .item select, .item textarea'),

    label: document.querySelector('.item label'),

    inputimg: document.querySelector('.image-preview'),

    removedfiles: document.querySelector('.removed_files'),

    runError(params, event, error) {
        for (let item of params) {
            if (item.value == '' && item.classList != 'removed_files' && item.classList != 'input-file') {
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error-messages')
                message.style.position = 'fixed'
                message.innerHTML = error
                document.querySelector('body').append(message)
                item.classList.add('color-error')
                event.preventDefault()
            }
        }
    },

    validateFields(event) {
        if (validate.inputimg) {
            if (validate.inputimg.children.length == 0 || validate.inputimg.children[0] == validate.removedfiles) {
                validate.label.children[0].classList.add('color-error')
                event.preventDefault()         
            }
            if (validate.inputimg.children[0]) {
                if (validate.inputimg.children[0].value == '') {
                    validate.label.classList.add('color-error', 'backerror')
                    event.preventDefault()
                }
            }
        }
        validate.runError(validate.items, event, 'Preencha todos os campos')
    }
}