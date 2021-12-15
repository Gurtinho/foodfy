const imageGallery = {
    highlight: document.querySelector('.food-img-recipe'),

    previews: document.querySelectorAll('.image_preview img'),

    setImage(e) {
        const { target } = e

        imageGallery.previews.forEach(image => {
            image.classList.remove('first')
        })

        target.classList.add('first')

        imageGallery.highlight.src = target.src
        lightbox.image.src = target.src
    },
}

const lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    close: document.querySelector('.lightbox-target a.lightbox-close'),

    open() {
        lightbox.target.style.display = 'block'
        lightbox.target.style.opacity = 1
    },

    close() {
        lightbox.target.style.display = 'none'
        lightbox.target.style.opacity = 0
    }
}