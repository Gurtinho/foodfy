export default function openFood() {
    const foods = document.querySelectorAll(".comida")

    for (let i = 0; i < foods.length; i++) {
        const recipes = foods[i]
        recipes.addEventListener("click", () => {
            window.location.href = `/food/${i}`
        })
    }
}
