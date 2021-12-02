function fillSearch() {
    const input = document.querySelector('.search form div input')
    const formSearch = document.querySelector('.search form')
    function fill(item) {
        if (input.value == '') {
            input.classList.add('fill')
            item.preventDefault()
            setTimeout(() => {
                input.classList.remove('fill')
            }, 1000)
        } 
    }

    formSearch.addEventListener('submit', fill)
}
fillSearch()