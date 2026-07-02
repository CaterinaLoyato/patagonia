// Setear src de la imagen de gear (Corregido el ":" por ";")
if (document.getElementById('gearImg')) {
  document.getElementById('gearImg').src = "fotos/fondoequipo.png";
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { 
      e.target.classList.add('visible'); 
      observer.unobserve(e.target); 
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

// Blog dots
document.querySelectorAll('.dot').forEach((dot, i, dots) => {
  dot.addEventListener('click', () => {
    dots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
  });
});

// Boot overlay — se superpone sobre la imagen al hover del hotspot
const bootHotspot = document.getElementById('bootHotspot');
const bootOverlay = document.getElementById('bootOverlay');
if (bootHotspot && bootOverlay) {
  bootHotspot.addEventListener('mouseenter', () => {
    bootOverlay.classList.add('visible');
  });
  bootHotspot.addEventListener('mouseleave', () => {
    bootOverlay.classList.remove('visible');
  });
}

// ==========================================
// NUEVO: Reproducción de videos on hover
// ==========================================
const celdasVideo = document.querySelectorAll('.video-cell');

celdasVideo.forEach(celda => {
  const video = celda.querySelector('video');

  if (video) {
    // Play al pasar el mouse
    celda.addEventListener('mouseenter', () => {
      video.play().catch(error => {
        console.log("Reproducción prevenida por el navegador:", error);
      });
    });

    // Pause al sacar el mouse
    celda.addEventListener('mouseleave', () => {
      video.pause();
    });
  }
});
// ========================================================================
// ACTIVACIÓN INTERACTIVA DEL CARRUSEL DE PROTOCOLOS
// ========================================================================

const sliderProtocolos = document.querySelector('.protocolos-slider');
const listaPuntos = document.querySelectorAll('.dot');

if (sliderProtocolos && listaPuntos.length > 0) {
  
  // 1. ESCUCHAR EL SCROLL: Enciende el punto correcto automáticamente al deslizar
  sliderProtocolos.addEventListener('scroll', () => {
    // Medimos el ancho real de la pantalla en píxeles (100vw)
    const anchoPantalla = window.innerWidth;
    
    // Calculamos qué slide está viendo el usuario actualmente
    const indiceActivo = Math.round(sliderProtocolos.scrollLeft / anchoPantalla);
    
    // Recorremos los tres puntos y le ponemos la clase 'active' solo al correcto
    listaPuntos.forEach((dot, indice) => {
      if (indice === indiceActivo) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });
}

// 2. HACER CLIC EN UN PUNTO: Te desplaza suavemente al slide seleccionado
function irASlide(indice) {
  const slider = document.querySelector('.protocolos-slider');
  const anchoPantalla = window.innerWidth;
  
  if (slider) {
    slider.scrollTo({
      left: anchoPantalla * indice,
      behavior: 'smooth' // Movimiento premium desacelerado
    });
  }
} 
// ========================================================================
// LOGICA DE DESPLAZAMIENTO: CARRUSEL MULTITARJETA (PROGRAMAS)
// ========================================================================

const contenedorSlider = document.querySelector('.cards-slider');
const coleccionPuntos = document.querySelectorAll('.card-dot');

if (contenedorSlider && coleccionPuntos.length > 0) {
  
  // 1. ESCUCHADOR DE SCROLL MANUAL (Mouse, trackpad o swipe tactil)
  contenedorSlider.addEventListener('scroll', () => {
    const primerTarjeta = document.querySelector('.card-item');
    const gapDiferencial = 20; // Sintonizado con el gap de 20px fijado en CSS
    
    // Calculamos el ancho exacto de paso (ancho de tarjeta + su respectiva separación)
    const pasoExacto = primerTarjeta.offsetWidth + gapDiferencial;
    
    // Obtenemos cuántas tarjetas se desplazó el eje horizontal de forma matemática
    const indiceActual = Math.round(contenedorSlider.scrollLeft / pasoExacto);
    
    // Recorremos los tres botones e iluminamos el indicador activo
    coleccionPuntos.forEach((dot, indice) => {
      if (indice === indiceActual) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });
}

// 2. DISPARADOR DE CLIC EN PUNTOS (Salta proporcionalmente de tarjeta en tarjeta)
function irACard(indice) {
  const slider = document.querySelector('.cards-slider');
  const tarjeta = document.querySelector('.card-item');
  const gapDiferencial = 20;
  
  if (slider && tarjeta) {
    const pasoExacto = tarjeta.offsetWidth + gapDiferencial;
    
    slider.scrollTo({
      left: pasoExacto * indice,
      behavior: 'smooth' // Curva de animación nativa suave
    });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const celdasStaff = document.querySelectorAll('.staff-cell');
  const modal = document.getElementById('staff-modal');
  const modalImg = document.getElementById('modal-img');
  const botonCerrar = document.querySelector('.staff-modal-close');

  // 1. ESCUCHAR EL CLIC EN CADA GUÍA
  celdasStaff.forEach(celda => {
    celda.addEventListener('click', () => {
      // Lee la ruta de la foto grande que pusiste en el 'data-popup'
      const rutaImagenGrande = celda.getAttribute('data-popup');
      
      if (rutaImagenGrande) {
        modalImg.src = rutaImagenGrande; // Inyecta la foto correcta en el pop-up
        modal.classList.add('active');   // Activa el CSS para que aparezca
        document.body.style.overflow = 'hidden'; // Traba el scroll de la web de fondo
      }
    });
  });

  // 2. FUNCIÓN GENERAL PARA CERRAR EL POP-UP
  const cerrarPopUp = () => {
    modal.classList.remove('active'); // Quita la clase y activa la transición de salida
    document.body.style.overflow = '';   // Devuelve el scroll normal a la página
    
    // Esperamos a que termine la animación de cierre para limpiar la imagen
    setTimeout(() => {
      modalImg.src = '';
    }, 350);
  };

  // Cierra si tocás la "X"
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarPopUp);
  }

  // Cierra si tocás cualquier parte oscura del fondo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarPopUp();
    }
  });

  // Cierra si presionás la tecla Escape (Esc) en el teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      cerrarPopUp();
    }
  });
});