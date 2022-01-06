function fillSearch() {
    const input = document.querySelector('.search form div input')
    const formSearch = document.querySelector('.search form')
    const fill = function(item) {
        if (input.value == '') {
            input.classList.add('fill')
            item.preventDefault()
            setTimeout(() => {
                input.classList.remove('fill')
            }, 2000)
        }
    }
    formSearch.addEventListener('submit', fill)
}
fillSearch()