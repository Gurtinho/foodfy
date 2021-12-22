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


function confirmation() {
    const confirmDelete = document.querySelectorAll('.form-delete')
    confirmDelete.forEach((item) => {
        item.addEventListener('submit', (event) => {
            const confirmation = confirm('Deseja deletar?')
            if (!confirmation) {
                event.preventDefault()
            }
        })
    })
}
confirmation()


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





