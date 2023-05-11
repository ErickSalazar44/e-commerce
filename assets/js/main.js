
// Consumiendo la API 
async function obtenerProductos() {
    try {
        const data = await fetch ("https://ecommercebackend.fundamentos-29.repl.co/");
        const res = await data.json();

        window.localStorage.setItem('productos', JSON.stringify(res))
        return res; 
    } catch (error) {
        console.error(error)
    }
}

// Printproducts
const dibujarProductos = (datos) => {
    const productosHTML = document.querySelector('.productos') // accedemos a la clase productos de HTML
    
    let html = "";

    for (const {image,name,price,quantity,id,category} of datos.productos){

        // Validacion de compra 
        const mostrarBtnAgregar = quantity ? `<i class='bx bx-plus ' id="${id}"></i>` : "<div></div>";
        const stockText = quantity ? `Stock: ${quantity}` : "Sold out";
        const stockid = quantity ? "" : "sinStock";
        const agregarBanerSinstock = quantity ? "producto_img" : " productoSinStock producto_img "

        html += `
        <div class="producto ${category}" id="${id}">
            <div class=${agregarBanerSinstock} id="${id}">
                <img class="imgHover activarModal" id="${id}"src="${image}" alt="${name}">
            </div>
            <div class="producto_inf">
            <h3>$${price}.00 <span id=${stockid}>${stockText}</span></h3>
            ${mostrarBtnAgregar}
                <p class="activarModal" id="${id}">${name}</p>
            </div>
        </div>
        `
    }

    productosHTML.innerHTML = html;
    // actualizamos los datos en localeStorage
    window.localStorage.setItem("productos",JSON.stringify(datos.productos));
}

// Libreria De filtrado de productos
function handleMixtup() {
    mixer = mixitup('.productos', {
        selectors: {
            target: '.producto'
        },
        "animation": {
            "duration": 320,
            "nudge": false,
            "reverseOut": false,
            "effects": "fade scale(0.45) translateY(69%)",
            "queue": false,
        }
    });
}

// Aumentar productos alcarrito
function aumentarProductosAlCarrito(datos) {
    const productosHTML = document.querySelector(".productos");


    productosHTML.addEventListener("click",(e) => {
        const btnAumento = e.target.closest(".bx-plus");        

        if (btnAumento) {
            // obtenemos id del btn seleccionado
            const idUser = Number(e.target.id);

            // obtenemos el elemento con el mismo id 
            const filtroDeId = datos.productos.find(producto => producto.id === idUser);

            if (datos.card[idUser]) {

                if (filtroDeId.quantity === datos.card[idUser].cantidad) {
                    // Animacion de alerta 
                    return Swal.fire({
                        icon: 'info',
                        title: 'Lo sentimos, este producto está agotado en este momento.',
                        showConfirmButton: false,
                        timer: 2000 
                    });
                }
                datos.card[idUser].cantidad++;
                animacionCart();
            } else {
                datos.card[idUser] = {...filtroDeId, cantidad: 1 };
            }
            // actualizamos los datos en localeStorage
            window.localStorage.setItem("card", JSON.stringify(datos.card));
            printProductCard(datos);
            precioTotalDeProdcutos(datos);
        }
    })
}

// Dibujar el carrito en el menu 

function printProductCard(datos) {
    const contentCardProductHTML = document.querySelector(".contentCard_product");

    let html = ``;

    for (const producto in datos.card) {

        //Destructuracion
        const {image, name, price, quantity, id, cantidad} = datos.card[producto];

        html += `
        <div class="card_product">
            <div class="card_product_img">
                <img src=${image} alt="">
            </div>
            <div class="card_product_body">
                <h4>${name}</h4>
                <p>Stock : ${quantity} | <span> $${price}.00</span></p>
                <p>Subtotal:$${price * cantidad}.00</p>
                <div>
                    <div class="card_product_icon">
                        <i class="bx bx-minus" id="${id}"></i>
                        <span>${cantidad} units</span>
                        <i class="bx bx-plus" id="${id}"></i>
                    </div>
                    <i class="bx bx-trash-alt" id="${id}"></i>
                </div>
            </div>
        </div>
        `
    }
    contentCardProductHTML.innerHTML = html;
}

// Manejo de productos en el card
function logicaDelcarrito(datos) {
    const contentCardProductHTML = document.querySelector(".contentCard_product");

    contentCardProductHTML.addEventListener("click",(e)=> {
        const id = Number(e.target.id)
        const agregar = e.target.closest(".bx-plus");
        const quitar = e.target.closest(".bx-minus");
        const borrar = e.target.closest(".bx-trash-alt");
        if (agregar || borrar || quitar) {
            if (agregar) {
                if (datos.card[id].quantity <= datos.card[id].cantidad) {
                    return alert('Lo sentimos, este producto está agotado en este momento.');
                }
                datos.card[id].cantidad++;
            }
            if (quitar) {
                datos.card[id].cantidad--; // Quitamos un valor 
                // si el producto es 0 
                if (datos.card[id].cantidad <= 0) {
                    const confirmacionDeUser = confirm("¿Seguro que quieres eliminar?")
                    if (confirmacionDeUser) delete datos.card[id]
                }
            }
            if (borrar) {
                // preguntar al usuario si quiere eliminar el articulo
                const confirmacionDeUser = confirm("¿Seguro que quieres eliminar?")
                if (confirmacionDeUser) delete datos.card[id]
            }
            printProductCard(datos);
            precioTotalDeProdcutos(datos);
            // actualizamos los datos en localeStorage
            window.localStorage.setItem("card", JSON.stringify(datos.card));
        }
    })
}

function precioTotalDeProdcutos(datos) {
    const cantidadProductosSeleccionados = document.querySelector(".total_productos");
    const contentCardTotalHTML = document.querySelector(".compraTotal_contentCard");

    let contadorProductos = 0;
    let priceTotal = 0

    // convertimos el obj a un array
    Object.values(datos.card).forEach((item) => {
        contadorProductos += item.cantidad;
        priceTotal += item.cantidad * item.price
    })

    let html = `
        <p>${contadorProductos} items</p>
        <p>$${priceTotal}.00</p>
    `

    contentCardTotalHTML.innerHTML = html;
    cantidadProductosSeleccionados.textContent = contadorProductos;
}

function comprarProductos(datos){
    const btnCompraProducto = document.querySelector("#btnCompra");

    btnCompraProducto.addEventListener("click",() => {

        if (!Object.values(datos.card).length)
            return alert("El carrito esta vacio - debes seleccionar al menos un producto");

        
        const newProducts = [];


        for (const producto of datos.productos) {

            const productoCard = datos.card[producto.id];

            if (producto.id === productoCard?.id) {
                newProducts.push({
                    ...producto,
                    quantity: producto.quantity - datos.card[producto.id].cantidad,
                });

            } else {
                newProducts.push(producto);
            }
        }
        // Actualizamos datos
        datos.productos = newProducts;
        datos.card = {};

        // actualizamos los datos en localeStorage
        window.localStorage.setItem("productos",JSON.stringify(datos.productos));
        window.localStorage.setItem("card", JSON.stringify(datos.card));

        // pintamos nuevos datos
        printProductCard(datos);
        precioTotalDeProdcutos(datos);
        dibujarProductos(datos);

        // si no hago esto, tendria un bug al hacer las compras
        mixer.destroy();
        handleMixtup();

        // Animacion de alerta "Compra"

        Swal.fire({
            icon: 'success',
            title: '"¡Compra exitosa! Disfruta de tu nuevo producto."',
            showConfirmButton: false,
            timer: 2500 
        });
    })
}

function printModal(datos) {
    const modalHTML = document.querySelector(".modal");
    const productosHTML = document.querySelector(".productos");
    // Activar Modal
    productosHTML.addEventListener("click", (e) => {
        const activeModal = e.target.closest(".activarModal");

        let idUser;
        let html;

        if (activeModal) {
            modalHTML.classList.toggle("desactivarModal");
            idUser = activeModal.id;

            const {description, id, image, name, price, quantity} = datos.productos[idUser - 1];

            // Validacion de compra 
            const mostrarBtnAgregar = quantity ? `<span><i class="bx bx-plus"></i></span>` : `<span></span>`;
            const stockText = quantity ? `stock: ${quantity}` : "Sold out";
            const stockId = quantity ? "" : "sinStock"
            html += `
            <div class="modalContainer" id="${id}">

                <div class="contentProduct_img">
                    <i class='bx bx-x closed-modal' ></i>
                    <img class="img_modal" src="${image}" alt="${name}">
                    <div class="contentProduct_inf" id="${id}">
                        <p>$${price}.00 ${mostrarBtnAgregar}</p>
                        <p id="${stockId}">${stockText}</p>
                    </div>
                </div>


                <div class="contentProduct_body">
                    <p>${name}</p>
                    <p class="contentProduct_description">${description}</p>
                </div>

            </div>
            `
            modalHTML.innerHTML = html;
            // Desactivar Modal
            cerrarModal(modalHTML);
            // Agregar productos
            modalAgregarProductos(datos);
        }
        return;
    })
}

function modalAgregarProductos(datos) {
    const contentProductInfHTML = document.querySelector(".contentProduct_inf");
    contentProductInfHTML.addEventListener("click",(e) => {
        const btnAgregarProducto = e.target.closest(".bx-plus");
            if (btnAgregarProducto) {
                const idUser = Number(contentProductInfHTML.id);

                // obtenemos el elemento con el mismo id 
                const filtroDeId = datos.productos.find(producto => producto.id === idUser);
                if (datos.card[idUser]) {
                    if (filtroDeId.quantity === datos.card[idUser].cantidad) {
                        // Animacion de alerta 
                        return alert("Lo sentimos, este producto está agotado.");
                    }
                    datos.card[idUser].cantidad++;
                    animacionCart();
                } else {
                    datos.card[idUser] = {...filtroDeId, cantidad: 1 };
                }
            // actualizamos los datos en localeStorage
            window.localStorage.setItem("card", JSON.stringify(datos.card));
            printProductCard(datos);
            precioTotalDeProdcutos(datos);
            }
            return;
    })
}
// Cerrar modal
function cerrarModal(modalHTML) {
    const cerrarModalHTML = document.querySelector(".closed-modal");
    cerrarModalHTML.addEventListener("click", () => {
        modalHTML.classList.toggle("desactivarModal");
    })
}

// Animacion del cart
function animacionCart() {
    const cartHTML = document.querySelector('#card_product');

    cartHTML.classList.add("animate_cart");
    setTimeout(() => {
        cartHTML.classList.remove("animate_cart");
    }, 1000);
}

// DarckMode
function darkMode() {
    // Dark Mode
    const bxmoonHtml = document.querySelector(".bx-moon");
    const bxsunHtml = document.querySelector(".bx-sun");
    const bodyHtml = document.querySelector("body");

    function toggleModoNoche() {
        if (bodyHtml.classList.contains("modoNoche")) {
            bodyHtml.classList.remove("modoNoche");
            bxmoonHtml.style.display = 'block';
            bxsunHtml.style.display = 'none';
            localStorage.setItem('modoNoche', 'desactivado');
        } else {
            bodyHtml.classList.add("modoNoche");
            bxsunHtml.style.display = 'block';
            bxmoonHtml.style.display = 'none';
            localStorage.setItem('modoNoche', 'activado');
        }
    }

    bxmoonHtml.addEventListener("click", toggleModoNoche); // Activar 
    bxsunHtml.addEventListener("click", toggleModoNoche); // Desactivar 

    const modoNoche = localStorage.getItem("modoNoche");

    if (modoNoche === 'activado') {
        toggleModoNoche();
    }
}

async function main() {

    const datos = {
        // Para que solo se cargue una vez en caso de que ya entro a la pagina 
        productos: JSON.parse(window.localStorage.getItem("productos")) || (await obtenerProductos()), // extraemos todos los elementos 
        card:JSON.parse(window.localStorage.getItem("card")) || {}, // preguntamos si tiene datos almacenados
    }

    dibujarProductos(datos); // print de los productos

    handleMixtup(); // libreria para ordenar productos

    aumentarProductosAlCarrito(datos); // logica de contador de carrito

    printProductCard(datos); // Dibujamos el producto en la section del carrito

    logicaDelcarrito(datos); // Agregar quitar y eliminar productos 

    precioTotalDeProdcutos(datos); // Actualizar Valor de productos 

    comprarProductos(datos); // Comprar Productos y actualizar datos

    printModal(datos)   // Print Products Modal
    



}


function loading() {
    const contentLoading = document.querySelector(".contentLoading")
    setTimeout(() => {
        contentLoading.classList.add("contentLoading_none")
    },1000);
}

window.addEventListener("load", () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    loading(); 
    darkMode();
    main();
})
