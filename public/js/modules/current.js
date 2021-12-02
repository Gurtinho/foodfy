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