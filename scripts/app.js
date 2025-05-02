import { renderizarMenu } from "../data/menu.js";
import { mostrarTotal, mostrarCarrito } from "./carrito.js";

window.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "./components/navbar.html");
  loadComponent("footer", "./components/footer.html");

  if (window.location.pathname.includes("menu.html")) {
    renderizarMenu();
  }

  if (window.location.pathname.includes("pedir.html")) {
    mostrarCarrito();
    mostrarTotal();
  }
});

function loadComponent(id, file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    })
    .catch((error) => {
      console.error(`Error al cargar ${file}:`, error);
    });
}
