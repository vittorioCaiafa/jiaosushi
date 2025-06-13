import { renderizarMenu } from "../data/menu.js";
import { mostrarTotal, mostrarCarrito } from "./carrito.js";

// Función para cargar componentes
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    } else {
      console.error(`Element with id ${elementId} not found`);
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

// Cargar todos los componentes cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", async () => {
  // Cargar componentes comunes
  await Promise.all([
    loadComponent("navbar", "./components/navbar.html"),
    loadComponent("hero", "./components/hero.html"),
    loadComponent("characteristics", "./components/characteristics.html"),
    loadComponent("comments", "./components/comments.html"),
    loadComponent("footer", "./components/footer.html")
  ]);

  // Inicializar carrusel
  const track = document.getElementById("carouselTrack");
  if (track) {
    track.innerHTML += track.innerHTML; // Duplica los elementos para scroll infinito
  }

  // Cargar componentes específicos de página
  if (window.location.pathname.includes("menu.html")) {
    renderizarMenu();
  }

  if (window.location.pathname.includes("pedir.html")) {
    mostrarCarrito();
    mostrarTotal();
  }
});
