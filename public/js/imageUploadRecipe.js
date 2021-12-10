const imageUpload = {
    input: '',

    imageLimit: 5,

    preview: document.querySelector('.image-preview'),

    files: [],

    createContainer(image) {
        const container = document.createElement('div')
        container.classList.add('input-image')

        container.onclick = imageUpload.removeImage

        container.appendChild(image)

        container.appendChild(imageUpload.buttonRemove())

        return container
    },

    limitator(event) {
        const { imageLimit, input, preview } = imageUpload
        const { files: fileList } = input

        if (fileList.length > imageLimit) {
            alert('Envie no máximo 5 imagens')
            event.preventDefault()
            return true
        }

        const divImages = []
        preview.childNodes.forEach((item) => {
            if (item.classList && item.classList.value == 'input-image') {
                divImages.push(item)
            }
        })

        const totalImage = fileList.length + divImages.length
        if (totalImage > imageLimit) {
            alert('Limite máximo é 5')
            event.preventDefault()
            return true
        }

        return false
    },

    allFiles() {
        const data = new DataTransfer() //chrome
        const clip = new ClipboardEvent('').clipboardData // firefox

        const datatransfer = clip || data 

        imageUpload.files.forEach(file => datatransfer.items.add(file))
        
        return datatransfer.files
    },
    
    handleFileInput(event) {
        const { files: fileList } = event.target
        imageUpload.input = event.target

        if(imageUpload.limitator(event)) return

        Array.from(fileList).forEach((file) => {

            imageUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {

                const image = new Image()
                image.src = String(reader.result)

                const container = imageUpload.createContainer(image)

                imageUpload.preview.appendChild(container)
            }
            
            reader.readAsDataURL(file)
        })

        imageUpload.input.files =  imageUpload.allFiles()
    },

    buttonRemove() {
        const button = document.createElement('span')
        button.classList.add('material-icons')
        button.innerHTML = 'close'

        return button
    },

    removeImage(event) {
        const contImage = event.target.parentNode
        const arrayImage = Array.from(imageUpload.preview.children)
        const index = arrayImage.indexOf(contImage)

        imageUpload.files.splice(index, 1)
        imageUpload.input.files = imageUpload.allFiles()

        contImage.remove()
    }
}