// display description on show home page
function showDesc() {
    const show = document.querySelectorAll(".show")

    function showContentFull() {
        this.nextElementSibling.classList.toggle('active-desc')
        if (this.innerText == 'Mostrar') {
            this.innerText = 'Esconder'
        } else {
            this.innerText = 'Mostrar'
        }
    }
    show.forEach((item) => {
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