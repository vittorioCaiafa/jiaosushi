// menu.js
import { SalmonMaki } from "../models/salmon-maki.js";
import { California } from "../models/california.js";
import { SalmonNigiri } from "../models/salmon-nigiri.js";
import { actualizarCarrito, mostrarTotal } from "../scripts/carrito.js";

export const menuList = [SalmonMaki, California, SalmonNigiri];
export const menuItems = menuList.map((Cls) => new Cls());

export function renderizarMenu() {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) {
    console.error("Menu grid container not found");
    return;
  }

  // Clear the grid before adding new elements
  menuGrid.innerHTML = '';

  menuItems.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "menu-card";
    
    card.innerHTML = `
      <div class="menu-card-image">
        <img src="${producto.imagen}" alt="${producto.nombre}" />
      </div>
      <div class="menu-card-content">
        <h3>${producto.nombre}</h3>
        <p class="menu-item-descrip">${producto.descripcion}</p>
        <p class="menu-item-units">${producto.unidades} unidades</p>
        <div class="menu-card-footer">
          <span class="price">$${producto.precio}</span>
          <div class="counter" data-id="${producto.id}">
            <button class="counter-btn" data-decrement>-</button>
            <span class="counter-value" data-value>0</span>
            <button class="counter-btn" data-increment>+</button>
          </div>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });

  inicializarContadores();
}

function inicializarContadores() {
  const counters = document.querySelectorAll(".counter");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  counters.forEach((counter) => {
    const valueEl = counter.querySelector("[data-value]");
    const id = counter.dataset.id;
    const itemGuardado = carrito.find((item) => item.id === id);
    let count = itemGuardado ? itemGuardado.cantidad : 0;

    valueEl.textContent = count;

    counter.querySelector("[data-increment]").addEventListener("click", () => {
      count++;
      valueEl.textContent = count;
      actualizarCarrito(id, "sumar");
      mostrarTotal();
    });

    counter.querySelector("[data-decrement]").addEventListener("click", () => {
      if (count > 0) count--;
      valueEl.textContent = count;
      actualizarCarrito(id, "restar");
      mostrarTotal();
    });
  });
}
