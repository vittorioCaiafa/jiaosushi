import { menuItems } from "../data/menu.js";
import { calcularTotal } from "./carrito.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-enviar");
  if (btn) btn.addEventListener("click", enviarWpp);
});

export function enviarWpp() {
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const nombreDeLaCasa = document.getElementById("nombreDeLaCasa").value;

  console.log(nombre, direccion, nombreDeLaCasa);

  // Validar campos
  if (!nombre || !direccion || !nombreDeLaCasa) {
    marcarCampos(nombre, direccion, nombreDeLaCasa);
    return;
  }

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const mensaje = document.getElementById("mensaje").value;

  let mensajeWpp = `Buenas, queria hacer un pedido! ⚓\n\n`;
  mensajeWpp += `*Nombre*: ${nombre}\n`;
  mensajeWpp += `*Dirección*: ${direccion}\n`;
  mensajeWpp += `*Casa/apto*: ${nombreDeLaCasa}\n`;
  if (mensaje) mensajeWpp += `*Mensaje*: ${mensaje}\n\n`;

  let pedido = "*Pedido*:\n";
  carrito.forEach(({ id, cantidad }) => {
    const producto = menuItems.find((p) => String(p.id) === String(id)); // Convertir a string para la comparación
    if (producto) {
      const subtotal = producto.precio * cantidad;
      pedido += `* ${producto.nombre} x${cantidad} - $${subtotal}\n`;
    }
  });

  mensajeWpp += `${pedido}\n`;

  let total = calcularTotal();

  mensajeWpp += `*Total*: $${total}`;

  // Crear el enlace para abrir WhatsApp
  const numeroWpp = "59899187886"; // Reemplaza con tu número de WhatsApp
  const enlaceWpp = `https://wa.me/${numeroWpp}?text=${encodeURIComponent(
    mensajeWpp
  )}`;

  // Redirigir a WhatsApp
  window.open(enlaceWpp, "_blank");
}

function marcarCampos(nombre, direccion, casa) {
  const campos = [
    { valor: nombre, elemento: document.getElementById("nombre") },
    { valor: direccion, elemento: document.getElementById("direccion") },
    { valor: casa, elemento: document.getElementById("nombreDeLaCasa") },
  ];

  campos.forEach(({ valor, elemento }) => {
    if (!valor) {
      elemento.style.border = "1px solid red";
      elemento.focus();
    } else {
      elemento.style.border = "#ddd";
    }
  });
}
