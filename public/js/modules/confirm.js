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