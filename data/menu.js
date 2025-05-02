// menu.js
import { SalmonMaki } from "../models/salmon-maki.js";
import { California } from "../models/california.js";
import { SalmonNigiri } from "../models/salmon-nigiri.js";
import { actualizarCarrito, mostrarTotal } from "../scripts/carrito.js";

export const menuList = [SalmonMaki, California, SalmonNigiri];
export const menuItems = menuList.map((Cls) => new Cls());

export function renderizarMenu() {
  fetch("./components/counter-input.html")
    .then((response) => response.text())
    .then((counterHtml) => {
      for (let i = 0; i < menuList.length; i++) {
        const producto = menuItems[i];
        const fila = document.createElement("tr");
        const counterHTMLConID = counterHtml.replace(
          'data-id=""',
          `data-id="${producto.id}"`
        );

        fila.innerHTML = `
          <td><img src="/jiaosushi/${producto.imagen}" class="menu-img" type="png"/></td>
          <td><p><b>${producto.nombre}</b> (${producto.unidades}u)</p><p class="menu-item-descrip">${producto.descripcion}</p></td>
          <td>$${producto.precio}</td>
          <td>${counterHTMLConID}</td>
        `;

        document.getElementById("menu-body").appendChild(fila);
      }

      inicializarContadores();
    });
}

function inicializarContadores() {
  const counters = document.querySelectorAll("[data-counter]");
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
