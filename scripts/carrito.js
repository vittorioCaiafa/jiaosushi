import { menuItems } from "../data/menu.js";

export function calcularTotal() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let total = 0;

  for (let i = 0; i < carrito.length; i++) {
    const amount = Number(carrito[i].cantidad);
    const producto = menuItems.find(
      (p) => String(p.id) === String(carrito[i].id)
    );

    const price = producto.precio;
    total += amount * price;
  }

  return total;
}

export function mostrarTotal() {
  const total = calcularTotal();
  document.getElementById("valor-total").textContent = total;
}

export function actualizarCarrito(id, operacion) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex((item) => item.id === id);

  if (operacion === "sumar") {
    if (index !== -1) carrito[index].cantidad++;
    else carrito.push({ id, cantidad: 1 });
  } else if (operacion === "restar") {
    if (index !== -1) {
      carrito[index].cantidad--;
      if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function mostrarCarrito() {
  const listaPedido = document.getElementById("lista-pedido");
  const totalElemento = document.getElementById("valor-total");
  if (!listaPedido || !totalElemento) return;

  listaPedido.innerHTML = "";

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let total = 0;

  carrito.forEach(({ id, cantidad }) => {
    const producto = menuItems.find((p) => String(p.id) === String(id)); // Convertir a string para la comparación
    if (producto) {
      const subtotal = producto.precio * cantidad;
      total += subtotal;
      const li = document.createElement("li");
      li.textContent = `${producto.nombre} x${cantidad} - $${subtotal}`;
      listaPedido.appendChild(li);
    }
  });

  totalElemento.textContent = total;
}
