// ========================================================================
// CÚSPIDES — JS PROPIO DE LA SUB-PÁGINA: curso-escalada.html
// ========================================================================

// ── REVEAL ON SCROLL (mecanismo dinámico de visibilidad tipo persiana) ──
if (!window.__cuspidesRevealObserverActive) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));
  window.__cuspidesRevealObserverActive = true;
}

// ── ACORDEÓN DE MÓDULOS ──
// // ── ACORDEÓN DE MÓDULOS (VERSIÓN BULLETPROOF) ──
const iniciarAcordeon = () => {
  const modulos = document.querySelectorAll('.curso-modulos-lista .faq-item');
  
  // Si no encuentra módulos en esta página, frena la ejecución para no tirar error
  if (modulos.length === 0) return; 

  modulos.forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    const respuesta = item.querySelector('.faq-respuesta');

    if (!pregunta || !respuesta) return;

    // Estado inicial: si viene con "active" en el HTML, se abre calculando su alto real
    if (item.classList.contains('active')) {
      respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
    }

    pregunta.addEventListener('click', (e) => {
      e.preventDefault(); // Previene cualquier recarga o salto de página del botón
      
      const yaActivo = item.classList.contains('active');

      // 1. Cierra todos los módulos abiertos y resetea sus alturas inline
      modulos.forEach(otro => {
        otro.classList.remove('active');
        const otraRespuesta = otro.querySelector('.faq-respuesta');
        if (otraRespuesta) {
          otraRespuesta.style.maxHeight = null;
        }
      });

      // 2. Si el que se clickeó estaba cerrado, ahora lo abre calculando su espacio real
      if (!yaActivo) {
        item.classList.add('active');
        respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
      }
    });
  });
};

// COMPROBACIÓN DE SEGURIDAD: Si el DOM ya cargó, ejecuta; si no, espera a que cargue.
if (document.readyState !== 'loading') {
  iniciarAcordeon();
} else {
  document.addEventListener('DOMContentLoaded', iniciarAcordeon);
}
  // ── SUB-NAV: resalta el link activo según la sección visible en viewport ──
  const subnavLinks = document.querySelectorAll('.curso-subnav-link');
  const secciones = Array.from(subnavLinks).map(link =>
    document.querySelector(link.getAttribute('href'))
  ).filter(Boolean);

  const marcarActivo = () => {
    let indiceActual = 0;
    const offset = 140; // compensa perfectamente el header fijo + la sub-nav pegajosa

    secciones.forEach((seccion, indice) => {
      if (seccion.getBoundingClientRect().top - offset <= 0) {
        indiceActual = indice;
      }
    });

    subnavLinks.forEach((link, indice) => {
      link.classList.toggle('active', indice === indiceActual);
    });
  };

  window.addEventListener('scroll', marcarActivo, { passive: true });
  marcarActivo();

  // Scroll suave al hacer clic compensando la barra superior y el menú pegajoso
  subnavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const destino = document.querySelector(link.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      const y = destino.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
});