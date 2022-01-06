// remove error color in create recipe / chef
function removeColorInput() {
    const items = document.querySelectorAll('.item input, .item select, .item textarea')
    const label = document.querySelector('.item label') || ''
    const inputimg = document.querySelector('.image-preview') || ''

    for (let item of items) {
        item.addEventListener('click', () => {
            if (item.classList == 'color-error') {
                item.classList.remove('color-error')
            }
        })
    }
    if (label != '') {
        if (label.children[0]) {
            label.addEventListener('click', () => {
                label.children[0].classList.remove('color-error')
            })
        } else {
            label.addEventListener('mouseover', () => { 
                label.classList.remove('backerror', 'color-error')
                inputimg.children[0].classList.remove('color-error')
            })
        }
    }
}
removeColorInput()