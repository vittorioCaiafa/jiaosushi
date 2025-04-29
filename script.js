function loadComponent(id, file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    });
}

window.onload = () => {
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");
};

function agregarAlPedido() {
  const sushiSelect = document.getElementById("sushi");
  const valor = sushiSelect.value;

  const lista = document.getElementById("lista-pedido");
  const item = document.createElement("li");
  item.innerHTML = `${valor} <button onclick="this.parentElement.remove()">x</button>`;
  lista.appendChild(item);
}

function enviarWpp() {
  const nombre = document.getElementById("nombre").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const casa = document.getElementById("nombreDeLaCasa").value.trim();
  const mensajeExtra =
    document.getElementById("mensaje").value.trim() ||
    "_Sin mensaje adicional_";

  if (!nombre || !direccion || !casa) {
    if (!nombre)
      Swal.fire({
        title: "Ingrese su nombre",
        text: "Campo obligatorio",
        icon: "warning",
      });
    else if (!direccion)
      Swal.fire({
        title: "Ingrese su dirección",
        text: "Campo obligatorio",
        icon: "warning",
      });
    else if (!casa)
      Swal.fire({
        title: "Ingrese su nombre / número de su residencia",
        text: "Campo obligatorio",
        icon: "warning",
      });
    return;
  }

  const mensaje =
    `Hola! Quiero hacer un pedido.%0A%0A` +
    `*Nombre:* ${nombre}%0A` +
    `*Dirección:* ${direccion}%0A` +
    `*Casa/Apto:* ${casa}%0A` +
    `*Mensaje:* ${mensajeExtra}%0A%0A` +
    `*Pedido:* _en proceso de desarrollo_`;
  const numero = "59899187886";
  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, "_blank");
}
