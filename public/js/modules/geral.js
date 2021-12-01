//mostrar/esconder descrição dos itens
export function showDesc() {
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

// current Links 
export function current() {
    const currentPage = location.pathname
    const menuItems = document.querySelectorAll('.links a')

    for (let item of menuItems) {
        if (currentPage.includes(item.getAttribute('href'))) {
            item.classList.add('active')
        }
    }
}

// confirm
export function confirmation() {
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

export function fillSearch() {
    const input = document.querySelector('.search form div input')
    const formSearch = document.querySelector('.search form')
    formSearch.addEventListener('submit', (event) => {
        if (input.value == '') {
            input.classList.add('fill')
            event.preventDefault()
            setTimeout(() => {
                input.classList.remove('fill')
            }, 1000)
        } 
    })

}


