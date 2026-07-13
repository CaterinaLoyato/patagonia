// ========================================================================
// CÚSPIDES — JS PROPIO DE LA SUB-PÁGINA: curso-escalada.html
// ========================================================================

// ── REVEAL ON SCROLL (mecanismo dinámico de visibilidad tipo persiana) ──
// ========================================================================
// CÚSPIDES — JS PROPIO DE LA SUB-PÁGINA
// ========================================================================

// ── REVEAL ON SCROLL ──
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
const iniciarAcordeon = () => {
  const modulos = document.querySelectorAll('.curso-modulos-lista .faq-item');
  
  if (modulos.length === 0) return; 

  modulos.forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    const respuesta = item.querySelector('.faq-respuesta');

    if (!pregunta || !respuesta) return;

    if (item.classList.contains('active')) {
      respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
    }

    pregunta.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      const yaActivo = item.classList.contains('active');

      modulos.forEach(otro => {
        otro.classList.remove('active');
        const otraRespuesta = otro.querySelector('.faq-respuesta');
        if (otraRespuesta) {
          otraRespuesta.style.maxHeight = null;
        }
      });

      if (!yaActivo) {
        item.classList.add('active');
        respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
      }
    });
  });
};

if (document.readyState !== 'loading') {
  iniciarAcordeon();
} else {
  document.addEventListener('DOMContentLoaded', iniciarAcordeon);
}

// ── SUB-NAV ──
const subnavLinks = document.querySelectorAll('.curso-subnav-link');
const secciones = Array.from(subnavLinks).map(link =>
  document.querySelector(link.getAttribute('href'))
).filter(Boolean);

const marcarActivo = () => {
  let indiceActual = 0;
  const offset = 140; 

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

subnavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const destino = document.querySelector(link.getAttribute('href'));
    if (!destino) return;
    e.preventDefault();
    const y = destino.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
}); 


// ── MENÚ HAMBURGUESA FULLSCREEN (CORREGIDO) ──
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    // Abrir/Cerrar menú al tocar las rayitas
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Cerrar el menú si se toca un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});


// ── HOTSPOTS DE EQUIPAMIENTO (TOUCH PARA MOBILE) ──
document.addEventListener('DOMContentLoaded', () => {
  const hotspots = document.querySelectorAll('.hotspot');

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      e.stopPropagation(); 
      
      const tooltip = hotspot.querySelector('.gear-tooltip');
      const isActive = hotspot.classList.contains('active');

      // 1. Cerramos todos y limpiamos estilos
      hotspots.forEach(h => {
        h.classList.remove('active');
        const t = h.querySelector('.gear-tooltip');
        if (t) t.style.cssText = ""; // Esto mata cualquier estilo inline
      });

      // 2. Si el que tocamos no estaba activo, lo abrimos
      if (!isActive) {
        hotspot.classList.add('active');
      }
    });
  });

  // Cierra al tocar fuera
  document.addEventListener('click', () => {
    hotspots.forEach(h => {
      h.classList.remove('active');
      const t = h.querySelector('.gear-tooltip');
      if (t) t.style.cssText = "";
    });
  });
});
// ── CARRUSEL AUTOMÁTICO INFINITO (CON FAKE CARDS Y PAUSA) ──

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.categories-grid');

  // AGREGAMOS ESTA CONDICIÓN: 
  // Solo ejecutar si existe el carousel Y si el ancho es menor o igual a 768px
  if (carousel && window.innerWidth <= 768) {
    
    // 1. Crear las "Fake Cards" (clonamos las originales y las pegamos al final)
    const itemsOriginales = Array.from(carousel.children);
    itemsOriginales.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true'); 
      carousel.appendChild(clone);
    });

    let autoScrollInterval;
    const tiempoEspera = 2500; 

    const iniciarAutoScroll = () => {
      clearInterval(autoScrollInterval); 
      autoScrollInterval = setInterval(() => {
        const itemWidth = carousel.firstElementChild.offsetWidth;
        const style = window.getComputedStyle(carousel);
        const gap = parseFloat(style.gap) || 0;
        const scrollAmount = itemWidth + gap;
        
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        setTimeout(() => {
          const anchoOriginal = carousel.scrollWidth / 2;
          if (carousel.scrollLeft >= anchoOriginal) {
            carousel.scrollBy({ left: -anchoOriginal, behavior: 'auto' });
          }
        }, 600); 
      }, tiempoEspera);
    };

    const pausarAutoScroll = () => clearInterval(autoScrollInterval);

    // 4. Interacciones táctiles
    carousel.addEventListener('touchstart', pausarAutoScroll, { passive: true });
    carousel.addEventListener('touchend', iniciarAutoScroll, { passive: true });
    carousel.addEventListener('mouseenter', pausarAutoScroll);
    carousel.addEventListener('mouseleave', iniciarAutoScroll);

    iniciarAutoScroll();
  }
});