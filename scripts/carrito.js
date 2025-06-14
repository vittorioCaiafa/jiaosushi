import { menuItems } from "../data/menu.js";

export function calcularTotal() {
  let carrito = JSON.parse(localStorage.getItem("sushiCart")) || [];
  let total = 0;

  carrito.forEach(item => {
    const producto = menuItems.find(p => String(p.id) === String(item.id));
    if (producto) {
      total += producto.precio * item.amount;
    }
  });

  return total;
}

export function mostrarTotal() {
  const total = calcularTotal();
  const totalElemento = document.getElementById("valor-total");
  if (totalElemento) {
    totalElemento.textContent = `$${total}`;
  }
}

export function actualizarCarrito(id, operacion) {
  let carrito = JSON.parse(localStorage.getItem("sushiCart")) || [];
  const index = carrito.findIndex((item) => item.id === id);

  if (operacion === "sumar") {
    if (index !== -1) carrito[index].amount++;
    else carrito.push({ id, amount: 1 });
  } else if (operacion === "restar") {
    if (index !== -1) {
      carrito[index].amount--;
      if (carrito[index].amount <= 0) carrito.splice(index, 1);
    }
  }

  localStorage.setItem("sushiCart", JSON.stringify(carrito));
}

export function mostrarCarrito() {
  const listaPedido = document.getElementById("lista-pedido");
  if (!listaPedido) {
    console.error("No se encontró el elemento lista-pedido");
    return;
  }

  listaPedido.innerHTML = "";
  const carrito = JSON.parse(localStorage.getItem("sushiCart")) || [];
  console.log("Carrito actual:", carrito);

  if (carrito.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay items en el carrito";
    listaPedido.appendChild(li);
    return;
  }

  carrito.forEach(item => {
    const producto = menuItems.find(p => String(p.id) === String(item.id));
    if (producto) {
      const li = document.createElement("li");
      const subtotal = producto.precio * item.amount;
      li.textContent = `${producto.nombre} x${item.amount} - $${subtotal}`;
      listaPedido.appendChild(li);
    } else {
      console.error(`No se encontró el producto con ID ${item.id}`);
    }
  });

  mostrarTotal();
}
