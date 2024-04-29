
let productosGlobales = [];

function cargarProductos() {
    fetch("/productos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            productosGlobales.push(...data);
            const divProductos = document.getElementById('productos');
            data.forEach((producto) => {
                const productoDiv = document.createElement('div');
                productoDiv.classList.add('producto');
                productoDiv.innerHTML = `
                    <h3>${producto.modelo}</h3>
                    <img src="${producto.imagen}" alt="${producto.modelo}">
                    <p>Marca: ${producto.marca}</p>
                    <p>Precio: ${producto.precio}</p>
                `;
                const botonAgregar = document.createElement('button');
                botonAgregar.setAttribute('data-id', producto.id)
                botonAgregar.textContent = 'Lo quiero!';
                botonAgregar.classList.add('boton-agregarCarrito');
                botonAgregar.addEventListener('click', () => agregarAlCarrito(producto.id));
                productoDiv.appendChild(botonAgregar);
                divProductos.appendChild(productoDiv);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    mostrarCarrito();
    actualizarContadorCarrito();

});

function mostrarCarrito() {
    const carrito = cargarCarrito();
    const divCarrito = document.getElementById('carrito');
    divCarrito.innerHTML = '';

    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.id = 'cerrarCarrito';
    btnCerrar.addEventListener('click', function () {
        divCarrito.classList.remove('visible-cart');
        divCarrito.classList.add('hidden-cart');
    });

    divCarrito.appendChild(btnCerrar);

    const tablaCarrito = document.createElement('table');
    tablaCarrito.className = 'tabla-carrito';
    const encabezado = tablaCarrito.createTHead();
    const filaEncabezado = encabezado.insertRow();
    const columnas = ["Modelo", "Marca", "Precio", "Acción"];
    columnas.forEach(texto => {
        const celda = filaEncabezado.insertCell();
        celda.textContent = texto;
    });



    const tbody = document.createElement('tbody');

    carrito.forEach((producto, index) => {
        const fila = tbody.insertRow();
        fila.insertCell().textContent = producto.modelo;
        fila.insertCell().textContent = producto.marca;
        fila.insertCell().textContent = producto.precio;
        const celdaAcciones = fila.insertCell();
        const botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Quitar';
        botonBorrar.addEventListener('click', () => borrarProducto(index));
        celdaAcciones.appendChild(botonBorrar);
    });

    tablaCarrito.appendChild(tbody);
    divCarrito.appendChild(tablaCarrito);

    let total = carrito.reduce((acc, producto) => acc + parseFloat(producto.precio), 0);
    const divTotal = document.createElement('div');
    divTotal.textContent = `Total: $${total.toFixed(2)}`;
    divTotal.className = 'total-carrito'; 
    divCarrito.appendChild(divTotal);

    const botonFinalizarCompra = document.createElement('button');
    botonFinalizarCompra.textContent = 'Finalizar Compra';
    botonFinalizarCompra.className = 'boton-finalizar'; 
    botonFinalizarCompra.addEventListener('click', function() {
        alert('Serás redirigido a otra página para finalizar tu compra :)');
        window.location.href = '/PAGO/pago.html'
    });
    divCarrito.appendChild(botonFinalizarCompra);

    divCarrito.classList.add('visible-cart');


    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contadorProductos = document.getElementById('contador-productos');
    const carrito = cargarCarrito(); // Asegúrate de cargar el estado actual del carrito
    contadorProductos.textContent = carrito.length; // Actualiza el texto del contador
}

console.log("Esta todo ok")

function borrarProducto(indice) {
    Swal.fire({
        title: "¿Estás seguro/a?",
        text: "Vas a quitar el producto de tu carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then((result) => {
        if (result.isConfirmed) {
            let carrito = cargarCarrito();
            carrito.splice(indice, 1);
            guardarCarrito(carrito);
            mostrarCarrito();
            actualizarContadorCarrito();
            Swal.fire("Borrado!", "Tu producto fue quitado del carrito", "success");
        }
      });
}

function agregarAlCarrito(productId) {
    const producto = productosGlobales.find(p => p.id === productId);
    if (!producto) {
        console.error('Producto no encontrado:', productId);
        return;
    }

    let carrito = cargarCarrito();
    console.log('Producto encontrado:',producto)
    carrito.push(producto);
    guardarCarrito(carrito);
    mostrarCarrito();
    actualizarContadorCarrito();

    Swal.fire({
        position: 'top-end', // Ubicación donde se mostrará el alerta
        icon: 'success',     // Tipo de ícono
        title: 'Producto agregado al carrito', // Título del mensaje
        showConfirmButton: false, // No mostrar el botón de confirmar
        timer: 1500            // Tiempo antes de que el alerta se cierre automáticamente
    });
}

function guardarCarrito(carrito) {
    localStorage.setItem("shopCarrito", JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoData = JSON.parse(localStorage.getItem("shopCarrito"));
    if (Array.isArray(carritoData)) {
        return carritoData;
    } else {
        return []; // Retorna un array vacío si los datos no son un array
    }
}



function toggleCart() {
    var cart = document.getElementById('carrito');
    var overlay = document.getElementById('page-overlay');
    

    if (cart.style.transform === "translateX(0px)") {
  
        cart.style.transform = "translateX(100%)";
        overlay.style.display = "none";
    } else {
        cart.style.transform = "translateX(0px)";
        overlay.style.display = "block";
    }
}

document.querySelector('.container-icon').addEventListener('click', toggleCart);

function cerrarCarrito() {
    var cart = document.getElementById('carrito');
    var overlay = document.getElementById('page-overlay');
    cart.style.transform = "translateX(100%)";
    overlay.style.display = "none";
}