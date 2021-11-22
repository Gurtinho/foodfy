//mostrar/esconder descrição dos itens
export function showDesc() {
    const li = document.querySelectorAll('.li')
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
