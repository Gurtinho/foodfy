const inputView = document.querySelector('.input-view')
const imageUploadChef = (event) => {
    const { files } = event.target
    inputView.value = files[0].name
    inputView.style.display = 'block'
}