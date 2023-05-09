
// Abrir carrito compras
const cardProductHTML = document.querySelector("#card_product");
const contentCardHTML = document.querySelector(".content_card");
const btnCompra = document.querySelector("#btnCompra");
cardProductHTML.addEventListener("click", () => {
    contentCardHTML.classList.toggle("active_contentCard");
})

// cerrar carrito compras 
const iconCloseCartHTML = document.querySelector("#iconCloseCart")

iconCloseCartHTML.addEventListener("click", () => {
    contentCardHTML.classList.toggle("active_contentCard")
})

btnCompra.addEventListener("click", () => {
    contentCardHTML.classList.toggle("active_contentCard");
})

