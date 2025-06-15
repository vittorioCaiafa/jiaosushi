import { renderizarMenu } from "../data/menu.js";
import { mostrarTotal, mostrarCarrito } from "./carrito.js";
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth.js';

// Función para obtener la ruta base
function getBasePath() {
  // Si estamos en GitHub Pages, usamos /jiaosushi/
  if (window.location.hostname === 'vittoriocaiafa.github.io') {
    return '/jiaosushi/';
  }
  return './';
}

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

// Function to get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('sushiCart');
  return cart ? JSON.parse(cart) : [];
}

// Function to save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('sushiCart', JSON.stringify(cart));
}

function updateCartItem(id, amount) {
  let cart = getCart();
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    if (amount === 0) {
      // Remove item if amount is 0
      cart = cart.filter(item => item.id !== id);
    } else {
      // Update existing item
      existingItem.amount = amount;
    }
  } else if (amount > 0) {
    // Add new item
    cart.push({ id, amount });
  }
  
  saveCart(cart);
}

// Function to get item amount from cart
function getItemAmount(id) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  return item ? item.amount : 0;
}

// Función para cargar el menú
async function loadMenu() {
  try {
    const menuGrid = document.getElementById("menuGrid");
    if (!menuGrid) {
      console.error("Menu grid container not found");
      return;
    }

    console.log("Importing menu data...");
    const { menuItems } = await import("../data/menu.js");
    console.log("Menu data received:", menuItems);

    // Add search functionality
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = menuItems.filter(item => 
          item.nombre.toLowerCase().includes(searchTerm)
        );
        renderMenuItems(filteredItems);
      });
    }

    renderMenuItems(menuItems);

    // Add order button after the grid
    const orderButton = document.createElement("a");
    orderButton.href = `${getBasePath()}order.html`;
    orderButton.className = "black-btn";
    orderButton.style.marginTop = "50px";
    orderButton.style.marginBottom = "100px";
    orderButton.textContent = "Order";
    menuGrid.parentElement.appendChild(orderButton);
  } catch (error) {
    console.error("Error loading menu:", error);
  }
}

function renderMenuItems(items) {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  menuGrid.innerHTML = items
    .map(
      (item) => `
      <div class="menu-card">
        <div class="menu-card-image">
          <img src="${getBasePath()}${item.imagen}" alt="${item.nombre}" />
        </div>
        <div class="menu-card-content">
          <h3>${item.nombre}</h3>
          <p class="menu-item-descrip">${item.descripcion}</p>
          <span class="price">$${item.precio}</span>
          <div class="menu-card-footer">
            <div class="counter">
              <button class="counter-btn minus" data-id="${item.id}">-</button>
              <span class="counter-value" data-id="${item.id}">${getItemAmount(item.id)}</span>
              <button class="counter-btn plus" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  // Add event listeners for counter buttons
  const minusButtons = document.querySelectorAll('.counter-btn.minus');
  const plusButtons = document.querySelectorAll('.counter-btn.plus');

  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const valueElement = document.querySelector(`.counter-value[data-id="${id}"]`);
      let value = parseInt(valueElement.textContent);
      if (value > 0) {
        value--;
        valueElement.textContent = value;
        updateCartItem(id, value);
      }
    });
  });

  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const valueElement = document.querySelector(`.counter-value[data-id="${id}"]`);
      let value = parseInt(valueElement.textContent);
      value++;
      valueElement.textContent = value;
      updateCartItem(id, value);
    });
  });
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

    // Show cart if we're on the order page
    if (window.location.pathname.includes("order.html")) {
      console.log("Loading order page...");
      const { mostrarCarrito, mostrarTotal } = await import("./carrito.js");
      // Esperar a que el DOM esté completamente cargado
      setTimeout(() => {
        mostrarCarrito();
        mostrarTotal();
      }, 100);
    }

    // Inicializar el formulario de pedido
    initializeOrderForm();

    // Update navbar based on auth state
    updateNavbar();
  } catch (error) {
    console.error("Error loading components:", error);
  }
});

// Inicializar el formulario de pedido
function initializeOrderForm() {
  const orderForm = document.getElementById("order-form");
  const sendButton = document.getElementById("btn-enviar");

  if (!orderForm || !sendButton) return;

  sendButton.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    const formData = new FormData(orderForm);
    const orderData = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      direccion: formData.get("direccion"),
      comentarios: formData.get("comentarios"),
      items: JSON.parse(localStorage.getItem("sushiCart")) || [],
      total: calcularTotal()
    };

    // Aquí puedes agregar la lógica para enviar el pedido
    console.log("Pedido enviado:", orderData);

    // Limpiar el carrito
    localStorage.removeItem("sushiCart");
    
    // Redirigir a la página de inicio
    window.location.href = "index.html";
  });
}

// Update navbar based on auth state
function updateNavbar() {
  const authButtons = document.getElementById('auth-buttons');
  const userProfile = document.getElementById('user-profile');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');

  if (isAuthenticated()) {
    const user = getCurrentUser();
    authButtons.style.display = 'none';
    userProfile.style.display = 'block';
    userAvatar.src = user.picture;
    userName.textContent = user.name;
    
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  } else {
    authButtons.style.display = 'block';
    userProfile.style.display = 'none';
  }
}
