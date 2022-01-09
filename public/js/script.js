// display description on show home page
function showDesc() {
    const mostrar = document.querySelectorAll(".mostrar")

    function showContentFull() {
        this.nextElementSibling.classList.toggle('ativo')
        if (this.innerText == 'Mostrar') {
            this.innerText = 'Esconder'
        } else {
            this.innerText = 'Mostrar'
        }
    }
    mostrar.forEach((item) => {
        item.addEventListener('click', showContentFull)
    })
}
showDesc()


// link colors
function current() {
    const currentPage = location.pathname
    const menuItems = document.querySelectorAll('.links ul li a')

    for (let item of menuItems) {
        if (currentPage.includes(item.getAttribute('href'))) {
            item.classList.add('active')
        }
    }
}
current()


// confirm delete
function confirmation() {
    const form = document.querySelectorAll('#form-delete') || ''
    if (form) {
        form.forEach((item) => {
            item.addEventListener('submit', (event) => {
                const confirm = window.confirm('Deseja deletar?')
                if (!confirm) {
                    event.preventDefault()
                }
            })
        })
    }
}
confirmation()