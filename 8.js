//utilizo elementos del dom utilizando su id
const shopContent = document.getElementById("shopContent");
const verCarro = document.getElementById("verCarro");
const modalContainer = document.getElementById("modal-container");

//array con mis productos
const productos = [
    { id: 1, nombre: "Lapicera", precio: 350, img: "img/lapicera.jpg" },
    { id: 2, nombre: "MarcaPaginas", precio: 200, img: "img/marcapaginas.jpg" },
    { id: 3, nombre: "Lapicera Y Marca Paginas", precio: 500, img: "img/lapiceraymarca.jpg" },
    { id: 4, nombre: "LLavero Patita", precio: 200, img: "img/llavero.jpg" },
    { id: 5, nombre: "Cenicero naranjas", precio: 500, img: "img/cenicero naranja.jpg" },
    { id: 6, nombre: "Cenicero Patita", precio: 500, img: "img/cenicero patita.jpg" },
    { id: 7, nombre: "Cenicero Beer", precio: 500, img: "img/cenicero Beer.jpg" },
    
];

//guarda los productos del carrito para recuperarlo desde localstorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//renderizar productos
function renderizarProductos() {
    productos.forEach((product) => {
        let content = document.createElement("div");
        content.innerHTML = `
            <h3>${product.nombre}</h3>
            <p>${product.precio}$</p>
            <img src="${product.img}" alt="${product.nombre}" style="width: 200px; height: 150px; object-fit: cover;">
        `;

        //boton comprar en cada producto del array
        let comprar = document.createElement("button");
        comprar.innerText = "comprar";

        content.append(comprar);

        //evento para el botón
        comprar.addEventListener("click", () => {
            //a;ade el producto al carrito y se actualiza en el localStorage
            carrito.push({
                id: product.id,
                img: product.img,
                nombre: product.nombre,
                precio: product.precio,
            });

            localStorage.setItem("carrito", JSON.stringify(carrito));
        });

        shopContent.append(content);
    });
}

//renderizar el carrito
function renderizarCarrito() {
    modalContainer.innerHTML = "";

    //creo elementos HTML para mostrar el contenido del carrito
    const modalWrapper = document.createElement("div");
    modalWrapper.className = "modal-wrapper";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1>Carrito.</h1>
        <button class="modal-button" id="cerrarModal">X</button>
    `;

    modalContent.appendChild(modalHeader);

    //agrupa los productos dentro del carrito para que no se repitan
    const groupedProducts = carrito.reduce((acc, product) => {
        const existingProduct = acc.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.cantidad++;
        } else {
            acc.push({ ...product, cantidad: 1 });
        }
        return acc;
    }, []);

    groupedProducts.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "carrito-item";
        carritoContent.innerHTML = `
            <img src="${product.img}" alt="${product.nombre}" class="carrito-img">
            <div class="carrito-info">
                <h3>${product.nombre}</h3>
                <p>${product.precio}$ - Cantidad: ${product.cantidad}</p>
            </div>
        `;

        const eliminarBoton = document.createElement("button");
        eliminarBoton.innerText = "Eliminar";
        eliminarBoton.className = "eliminar-producto";
        eliminarBoton.setAttribute("data-producto-id", product.id);
        carritoContent.appendChild(eliminarBoton);

        eliminarBoton.addEventListener("click", () => {
            eliminarProducto(product.id);
        });

        modalContent.appendChild(carritoContent);
    });

    //calcula el total
    const total = carrito.reduce((acc, el) => acc + el.precio, 0);

    //elemento total a pagar
    const totalCompra = document.createElement("div");
    totalCompra.className = "total-content";
    totalCompra.innerHTML = `Total a pagar: ${total} $`;
    modalContent.appendChild(totalCompra);

    //boton de checkout 
    const checkoutButton = document.createElement("button");
    checkoutButton.innerText = "Checkout";
    checkoutButton.className = "checkout-button";
    checkoutButton.disabled = carrito.length === 0; 
    modalContent.appendChild(checkoutButton);

    modalWrapper.appendChild(modalContent);
    modalContainer.appendChild(modalWrapper);
    modalContainer.style.display = "flex";

//cierre de modal
    const cerrarModal = document.getElementById("cerrarModal");
    cerrarModal.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    checkoutButton.addEventListener("click", () => {
        const mensajeCompra = document.createElement("p");
        mensajeCompra.innerText = "¡Gracias por tu compra!";

        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));

        modalContent.innerHTML = "";
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(mensajeCompra);
        modalContainer.style.display = "flex";
    });
}

//funcion para eliminar productos desde el carrito
function eliminarProducto(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

renderizarProductos();
verCarro.addEventListener("click", renderizarCarrito);





