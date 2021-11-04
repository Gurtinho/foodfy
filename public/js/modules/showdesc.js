//mostrar/esconder descrição dos itens
export default function showDesc() {
    const li = document.querySelectorAll('.li')
    const mostrar = document.querySelectorAll(".mostrar")

    function showContentFull() {
        this.nextElementSibling.classList.toggle('ativo')
    }

    li.forEach((i) => {
        if(i.innerHTML != '') {
            mostrar.forEach((item) => {
                item.addEventListener('click', showContentFull)
            })
        } 
        else if (i.innerHTML == '') {
            i.innerHTML = 'Sem informações adicionais.'
        }
    })
}
