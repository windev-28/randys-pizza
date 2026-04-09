// ============================================================
//  script.js — Randy's Pizza Artesanal
//  3 funcionalidades: 1) Botón volver arriba
//                     2) Validación del formulario
//                     3) Animación de tarjetas al hacer scroll
// ============================================================


// ─────────────────────────────────────────────
// 1. BOTÓN "VOLVER ARRIBA"
// ─────────────────────────────────────────────
// Primero creamos el botón desde JavaScript y lo agregamos a la página.
// Así aprendes que puedes crear elementos HTML desde JS, no solo modificarlos.

const botonArriba = document.createElement("button"); // crea un <button>
botonArriba.textContent = "⬆ Arriba";                 // le pone el texto
botonArriba.id = "btn-arriba";                         // le asigna un id para darle estilo desde CSS

// Le damos estilos directamente desde JS (también se puede hacer en CSS)
botonArriba.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #8b0000;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  display: none;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  z-index: 999;
`;

// Agregamos el botón al <body> de la página
document.body.appendChild(botonArriba);

// "window" es el objeto que representa la ventana del navegador.
// "scroll" es el evento que se dispara cada vez que el usuario hace scroll.
window.addEventListener("scroll", function () {
  // scrollY nos dice cuántos píxeles se ha bajado en la página
  if (window.scrollY > 300) {
    botonArriba.style.display = "block"; // muestra el botón
  } else {
    botonArriba.style.display = "none";  // lo oculta
  }
});

// Cuando el usuario haga clic en el botón, volvemos al inicio suavemente
botonArriba.addEventListener("click", function () {
  window.scrollTo({
    top: 0,          // posición destino: la cima de la página
    behavior: "smooth" // el movimiento es suave, no brusco
  });
});


// ─────────────────────────────────────────────
// 2. VALIDACIÓN DEL FORMULARIO
// ─────────────────────────────────────────────
// En lugar de enviar el correo (que con mailto: no siempre funciona),
// mostramos un mensaje de confirmación al usuario.

// querySelector busca el primer elemento que coincida con el selector CSS
const formulario = document.querySelector("#comentarios form");

formulario.addEventListener("submit", async function (evento) {
  
 
  // evento.preventDefault() CANCELA el comportamiento por defecto del formulario
  // (que sería abrir el cliente de correo). Así tomamos el control con JS.
  evento.preventDefault();

  // Obtenemos los valores que escribió el usuario
  const contacto = document.getElementById("contacto").value.trim(); // .trim() elimina espacios extra
  const mensaje  = document.getElementById("mensaje").value.trim();

  // Validación simple: verificamos que los campos no estén vacíos
  if (contacto === "" || mensaje === "") {
    mostrarMensaje("⚠️ Por favor llena todos los campos.", "error");
    return; // "return" detiene la ejecución aquí, no sigue adelante
  }

  // Enviamos los datos a Formspree manualmente
  const respuesta = await fetch("https://formspree.io/f/mreojkev", {
    method: "post",
    body: new FormData(formulario),
    headers: {Accept: "application/json"}
  });

  if (respuesta.ok) {
  
  
  mostrarMensaje("✅ ¡Gracias por tu comentario! Te contactaremos pronto 🍕", "exito");
  formulario.reset(); // limpia todos los campos del formulario
    } else { 
      mostrarMensaje(" Hubo un error al enviar. Intenta de nuevo.", "error");
       }
});

// Esta es una FUNCIÓN — un bloque de código reutilizable que puedes llamar
// desde cualquier parte. Recibe dos parámetros: el texto y el tipo de mensaje.
function mostrarMensaje(texto, tipo) {
  // Verificamos si ya existe un mensaje previo para no duplicarlo
  const mensajeAnterior = document.getElementById("mensaje-form");
  if (mensajeAnterior) mensajeAnterior.remove();

  // Creamos un <p> nuevo para mostrar el mensaje
  const parrafo = document.createElement("p");
  parrafo.id = "mensaje-form";
  parrafo.textContent = texto;

  // Cambiamos el color según si es error o éxito
  parrafo.style.cssText = `
    text-align: center;
    font-size: 1rem;
    padding: 10px;
    border-radius: 10px;
    background: ${tipo === "exito" ? "#2ecc71" : "#e74c3c"};
    color: white;
    margin-top: 10px;
  `;

  // Insertamos el mensaje después del formulario
  formulario.insertAdjacentElement("afterend", parrafo);

  // Después de 4 segundos (4000 milisegundos) el mensaje desaparece solo
  setTimeout(function () {
    parrafo.remove();
  }, 4000);
}


// ─────────────────────────────────────────────
// 3. ANIMACIÓN DE TARJETAS AL HACER SCROLL
// ─────────────────────────────────────────────
// Las tarjetas del menú aparecen con una animación suave
// cuando el usuario llega a esa sección.

// querySelectorAll devuelve TODAS las tarjetas (una lista, no solo la primera)
const tarjetas = document.querySelectorAll(".card");

// Primero ocultamos todas las tarjetas con CSS inline
tarjetas.forEach(function (tarjeta) {
  tarjeta.style.opacity    = "0";
  tarjeta.style.transform  = "translateY(30px)";
  tarjeta.style.transition = "opacity 0.5s ease, transform 0.5s ease";
});

// IntersectionObserver es una herramienta moderna del navegador
// que detecta cuando un elemento entra en la pantalla
const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      // El elemento ya es visible: lo mostramos
      entrada.target.style.opacity   = "1";
      entrada.target.style.transform = "translateY(0)";
      // Dejamos de observarlo para que la animación solo ocurra una vez
      observador.unobserve(entrada.target);
    }
  });
}, {
  threshold: 0.1 // se activa cuando el 10% del elemento es visible
});

// Le decimos al observador que vigile cada tarjeta
tarjetas.forEach(function (tarjeta) {
  observador.observe(tarjeta);
});