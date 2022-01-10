// confirm delete
function confirmation() { 
    const buttons = document.querySelectorAll('#button-delete') || ''

    if (buttons) {
        buttons.forEach((item) => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('formaction')
  
                const confirm = document.createElement('form')
                confirm.setAttribute('action', action)
                confirm.setAttribute('method', 'POST')
                confirm.setAttribute('id', 'form-delete')
                confirm.classList.add('confirm')

                const input = document.createElement('input')
                input.setAttribute('value', item.parentNode.lastElementChild.value)
                input.setAttribute('type', 'hidden')
                input.setAttribute('name', 'id')

                const p = document.createElement('p')
                p.classList.add('p-title')
                p.innerHTML = 'Deseja deletar?'
            
                const delet = document.createElement('button')
                delet.classList.add('button-submit')
                delet.setAttribute('type', 'submit')
                delet.innerHTML = 'Deletar'

                const cancel = document.createElement('button')
                cancel.classList.add('button-cancel')
                cancel.setAttribute('type', 'button')
                cancel.innerHTML = 'Cancelar'

                const divbutton = document.createElement('div')
                divbutton.classList.add('divbutton')
                divbutton.append(cancel, delet)

                confirm.append(p, divbutton, input)

                const wallpaper = document.createElement('div')
                wallpaper.classList.add('wallpaper')
                wallpaper.append(confirm)

                document.querySelector('body').append(wallpaper)

                cancel.addEventListener('click', () => {
                    wallpaper.remove()
                })
                delet.addEventListener('click', () => {
                    setTimeout(() => {
                        wallpaper.remove()
                    }, 1)
                })
            })
        })
    }
}
confirmation()