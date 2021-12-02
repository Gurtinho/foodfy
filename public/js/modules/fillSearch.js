// confirm
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


