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

// Función para cargar el menú
async function loadMenu() {
  try {
    console.log("loadMenu function called");
    const menuGrid = document.getElementById("menuGrid");
    if (!menuGrid) {
      console.error("Menu grid container not found");
      return;
    }

    console.log("Importing menu data...");
    const { menuItems } = await import("./data/menu.js");
    console.log("Menu data received:", menuItems);

    menuGrid.innerHTML = menuItems
      .map(
        (item) => `
        <div class="menu-card">
          <img src="./jiaosushi/${item.imagen}" alt="${item.nombre}" />
          <div class="menu-card-content">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <span class="price">$${item.precio}</span>
          </div>
        </div>
      `
      )
      .join("");

    // Agregar el botón de pedir después del grid
    const pedirButton = document.createElement("a");
    pedirButton.href = "pedir.html";
    pedirButton.className = "black-btn";
    pedirButton.style.marginTop = "50px";
    pedirButton.style.marginBottom = "100px";
    pedirButton.textContent = "Pedir";
    menuGrid.parentElement.appendChild(pedirButton);
  } catch (error) {
    console.error("Error loading menu:", error);
  }
}

async function initializeChat() {
  try {
    // Cargar el componente del chat modal
    const chatModalContainer = document.getElementById('chat-modal');
    if (chatModalContainer) {
      const response = await fetch('./components/chat-modal.html');
      const html = await response.text();
      chatModalContainer.innerHTML = html;

      // Inicializar la funcionalidad del chat
      const openChatBtn = document.getElementById('openChat');
      const chatModal = document.getElementById('chatModal');
      const closeChatBtn = document.getElementById('closeChat');
      const sendMessageBtn = document.getElementById('sendMessage');
      const messageInput = document.getElementById('messageInput');
      const messagesContainer = document.getElementById('messages');

      if (openChatBtn && chatModal && closeChatBtn && sendMessageBtn && messageInput && messagesContainer) {
        // Función para abrir el chat
        openChatBtn.addEventListener('click', () => {
          chatModal.classList.add('active');
          messageInput.focus();
        });

        // Función para cerrar el chat
        closeChatBtn.addEventListener('click', () => {
          chatModal.classList.remove('active');
        });

        // Función para enviar mensaje
        const sendMessage = () => {
          const message = messageInput.value.trim();
          if (message) {
            // Agregar mensaje del usuario al chat
            addMessage(message, 'user');
            messageInput.value = '';

            // Preparar el mensaje para WhatsApp
            const whatsappMessage = `Nuevo mensaje de la web:\n\n${message}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/59899123456?text=${encodedMessage}`; // Reemplaza con tu número

            // Abrir WhatsApp en una nueva pestaña
            window.open(whatsappUrl, '_blank');

            // Mostrar mensaje de confirmación
            setTimeout(() => {
              addMessage('Tu mensaje ha sido enviado. Te responderemos por WhatsApp.', 'bot');
            }, 1000);
          }
        };

        // Event listeners para enviar mensaje
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });

        // Función para agregar mensajes al chat
        function addMessage(text, type) {
          const messageDiv = document.createElement('div');
          messageDiv.className = `message ${type}-message`;
          messageDiv.textContent = text;
          messagesContainer.appendChild(messageDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    }
  } catch (error) {
    console.error('Error initializing chat:', error);
  }
}

async function loadComponents() {
  try {
    // Cargar navbar
    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
      const response = await fetch('./components/navbar.html');
      const html = await response.text();
      navbarContainer.innerHTML = html;
    }

    // Cargar footer
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
      const response = await fetch('./components/footer.html');
      const html = await response.text();
      footerContainer.innerHTML = html;
    }

    // Cargar botón de mensaje
    const messageButtonContainer = document.getElementById('message-button');
    if (messageButtonContainer) {
      const response = await fetch('./components/message-button.html');
      const html = await response.text();
      messageButtonContainer.innerHTML = html;
    }

    // Inicializar el chat
    initializeChat();
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

// Cargar todos los componentes cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Cargar la navbar
    await loadComponent("navbar", "components/navbar.html");

    // Cargar el footer
    await loadComponent("footer", "components/footer.html");

    // Cargar el botón de mensaje y el modal de chat
    await loadComponent("message-button", "components/message-button.html");
    await loadComponent("chat-modal", "components/chat-modal.html");
    initializeChat();

    // Cargar el hero y otros componentes si estamos en la página principal
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
      await loadComponent("hero", "components/hero.html");
      await loadComponent("characteristics", "components/characteristics.html");
      await loadComponent("comments", "components/comments.html");
    }

    // Cargar el menú si estamos en la página de menú
    if (window.location.pathname.includes("menu.html")) {
      console.log("Loading menu page...");
      await loadMenu();
    }
  } catch (error) {
    console.error("Error loading components:", error);
  }
});
