import { renderizarMenu } from "../data/menu.js";
import { mostrarTotal, mostrarCarrito } from "./carrito.js";

// Función para cargar componentes
async function loadComponent(elementId, componentPath) {
  try {
    console.log(`Loading component: ${componentPath}`);
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
      console.log(`Successfully loaded component: ${componentPath}`);
      
      // Inicializar carrusel después de cargar el componente characteristics
      if (elementId === 'characteristics') {
        const track = document.getElementById("carouselTrack");
        if (track) {
          console.log("Initializing carousel");
          track.innerHTML += track.innerHTML; // Duplica los elementos para scroll infinito
        }
      }
    } else {
      console.error(`Element with id ${elementId} not found`);
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

// Cargar todos los componentes cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded - Starting component loading");
  
  // Cargar componentes comunes
  try {
    await Promise.all([
      loadComponent("navbar", "./components/navbar.html"),
      loadComponent("hero", "./components/hero.html"),
      loadComponent("characteristics", "./components/characteristics.html"),
      loadComponent("comments", "./components/comments.html"),
      loadComponent("footer", "./components/footer.html")
    ]);
    console.log("All components loaded successfully");
  } catch (error) {
    console.error("Error loading components:", error);
  }

  // Cargar componentes específicos de página
  if (window.location.pathname.includes("menu.html")) {
    console.log("Loading menu page components");
    renderizarMenu();
  }

  if (window.location.pathname.includes("pedir.html")) {
    console.log("Loading pedir page components");
    mostrarCarrito();
    mostrarTotal();
  }
});
