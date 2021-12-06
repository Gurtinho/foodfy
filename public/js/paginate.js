function paginate(selectedPage, totalPage) {
    // paginate
    let pages = []
    let oldPage

    for (let currentPage = 1; currentPage <= totalPage; currentPage++) {

        const firstAndLastPages = currentPage == 1 || currentPage == totalPage
        const currentPageAfter = currentPage <= selectedPage + 2
        const currentPageBefore = currentPage >= selectedPage - 2

        if (firstAndLastPages || currentPageAfter && currentPageBefore) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push('...')
            }
            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }
            pages.push(currentPage)

            oldPage = currentPage
        }
    }
    return pages
}
paginate()

function createPagination(pagination) {
    const search = pagination.dataset.search
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ''

    for (let page of pages) {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`
        } else {
            if ( search ) {
                elements += `<a href="?search=${search}&page=${page}">${page}</a>`
                console.log('tem search')
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if (pagination) {
    createPagination(pagination)
}