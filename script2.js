// ========================================================================
// CÚSPIDES — SCRIPT INTERACTIVO GENERAL UNIFICADO (script.js)
// ========================================================================
document.addEventListener('DOMContentLoaded', () => {

  // ── 1. ANIMACIÓN REVEAL ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); 
        revealObserver.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(seccion => {
    revealObserver.observe(seccion);
  });

  // ── 2. ACORDEÓN INTERACTIVO DE PREGUNTAS FRECUENTES (FAQ) ──
  const faqs = document.querySelectorAll('.faq-lista .faq-item');
  faqs.forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    const respuesta = item.querySelector('.faq-respuesta');
    if (item.classList.contains('active') && respuesta) {
      respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
    }
    if (pregunta && respuesta) {
      pregunta.addEventListener('click', (e) => {
        e.preventDefault();
        const yaActivo = item.classList.contains('active');
        faqs.forEach(otro => {
          otro.classList.remove('active');
          const otraRespuesta = otro.querySelector('.faq-respuesta');
          if (otraRespuesta) otraRespuesta.style.maxHeight = null;
        });
        if (!yaActivo) {
          item.classList.add('active');
          respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
        }
      });
    }
  });

  // ── 3. MOTOR MAESTRO PARA CARRUSELES ──
  const inicializarSliderInfinito = (config) => {
    const slider = document.querySelector(config.sliderSelector);
    if (!slider) return;
    const celdasOriginales = Array.from(slider.children).filter(el => !el.classList.contains('is-clone'));
    const totalOriginales = celdasOriginales.length;
    if (totalOriginales === 0) return;
    const numVisibles = config.numVisibles || 3;
    const gap = config.gap !== undefined ? config.gap : 20;
    if (slider.querySelector('.is-clone')) return;
    for (let i = 0; i < numVisibles; i++) {
      const clon = celdasOriginales[i].cloneNode(true);
      clon.classList.add('is-clone');
      clon.classList.remove('card-item--selected');
      slider.appendChild(clon);
    }
    for (let i = totalOriginales - numVisibles; i < totalOriginales; i++) {
      const clon = celdasOriginales[i].cloneNode(true);
      clon.classList.add('is-clone');
      clon.classList.remove('card-item--selected');
      slider.insertBefore(clon, slider.firstChild);
    }
    const obtenerAnchoCelda = () => celdasOriginales[0].getBoundingClientRect().width + gap;
    const calibrarPosicion = () => {
      slider.scrollLeft = obtenerAnchoCelda() * numVisibles;
      slider.dispatchEvent(new Event('scroll'));
    };
    setTimeout(calibrarPosicion, 50);
    window.addEventListener('resize', calibrarPosicion);
    let estaTeletransportando = false;
    slider.addEventListener('scroll', () => {
      if (estaTeletransportando) return;
      const celdaWidth = obtenerAnchoCelda();
      const scrollActual = slider.scrollLeft;
      const limiteIzquierdo = celdaWidth * (numVisibles - 1);
      const limiteDerecho = celdaWidth * (totalOriginales + numVisibles);
      if (scrollActual <= limiteIzquierdo + 2) {
        estaTeletransportando = true;
        slider.scrollLeft = scrollActual + (celdaWidth * totalOriginales);
        setTimeout(() => { estaTeletransportando = false; }, 30);
        return;
      }
      if (scrollActual >= limiteDerecho - 2) {
        estaTeletransportando = true;
        slider.scrollLeft = scrollActual - (celdaWidth * totalOriginales);
        setTimeout(() => { estaTeletransportando = false; }, 30);
        return;
      }
      if (config.escalarCentro) {
        const sliderRect = slider.getBoundingClientRect();
        const centroSlider = sliderRect.left + (sliderRect.width / 2);
        let distanciaMinima = Infinity;
        let cardGanadora = null;
        Array.from(slider.children).forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const centroCard = cardRect.left + (cardRect.width / 2);
          const distancia = Math.abs(centroSlider - centroCard);
          if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            cardGanadora = card;
          }
          card.classList.remove('card-item--selected');
        });
        if (cardGanadora) {
          cardGanadora.classList.add('card-item--selected');
          const dotValue = cardGanadora.getAttribute('data-dot');
          if (dotValue !== null) {
            const dotAActivar = parseInt(dotValue, 10);
            const dots = document.querySelectorAll(config.dotSelector);
            dots.forEach((dot, index) => { dot.classList.toggle('active', index === dotAActivar); });
          }
        }
      } else {
        const scrollRelativo = slider.scrollLeft - (celdaWidth * numVisibles);
        let indiceReal = Math.round(scrollRelativo / celdaWidth);
        if (indiceReal < 0) indiceReal = totalOriginales + indiceReal;
        indiceReal = indiceReal % totalOriginales;
        const dots = document.querySelectorAll(config.dotSelector);
        if (dots.length > 0) {
          const dotIndex = Math.max(0, Math.min(dots.length - 1, indiceReal));
          dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
        }
      }
    });
    window[config.nombreFuncionGlobal] = (index) => {
      const celdaWidth = obtenerAnchoCelda();
      slider.style.setProperty('scroll-snap-type', 'none', 'important');
      slider.scrollTo({ left: celdaWidth * (index + numVisibles), behavior: 'smooth' });
      const restaurarSnap = () => {
        slider.style.setProperty('scroll-snap-type', 'x mandatory', 'important');
        slider.removeEventListener('scrollend', restaurarSnap);
        clearTimeout(slider.timeoutSnap);
      };
      slider.removeEventListener('scrollend', slider._cleanupSnap);
      slider._cleanupSnap = restaurarSnap;
      slider.addEventListener('scrollend', restaurarSnap);
      slider.timeoutSnap = setTimeout(restaurarSnap, 1200); 
    };
  };

  inicializarSliderInfinito({ sliderSelector: '.cards-slider', dotSelector: '.cards-wrapper .card-dot', nombreFuncionGlobal: 'irACard', escalarCentro: true, isCursos: true, numVisibles: 3, gap: 20 });
  inicializarSliderInfinito({ sliderSelector: '.testimonios-slider', dotSelector: '.testimonios-wrapper .testimonio-dot', nombreFuncionGlobal: 'irATestimonio', escalarCentro: false, isCursos: false, numVisibles: 3, gap: 20 });
  inicializarSliderInfinito({ sliderSelector: '.protocolos-slider', dotSelector: '.protocolos-seccion .dot', nombreFuncionGlobal: 'irASlide', escalarCentro: false, isCursos: false, numVisibles: 1, gap: 0 });

  // ── 4. TECLADO PROTOCOLOS ──
  const protocolosSlider = document.querySelector('.protocolos-slider');
  if (protocolosSlider) {
    let seccionProtocolosVisible = false;
    const observerFoco = new IntersectionObserver((entries) => { seccionProtocolosVisible = entries[0].isIntersecting; }, { threshold: 0.25 });
    observerFoco.observe(protocolosSlider);
    document.addEventListener('keydown', (e) => {
      if (!seccionProtocolosVisible) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const celdaWidth = protocolosSlider.children[0].getBoundingClientRect().width;
        const scrollRelativo = protocolosSlider.scrollLeft - celdaWidth; 
        const indiceReal = Math.round(scrollRelativo / celdaWidth);
        if (e.key === 'ArrowRight') window.irASlide(indiceReal + 1);
        else if (e.key === 'ArrowLeft') window.irASlide(indiceReal - 1);
      }
    });
  }

  // ── 5. CONTADORES DE STATS (RESTAURADOS) ──
  const contadores = document.querySelectorAll('.cat-num');
  const velocidad = 100;
  const animarContador = (contador) => {
    const actualizarConteo = () => {
      const objetivo = +contador.getAttribute('data-target');
      const valorActual = +contador.innerText;
      const incremento = objetivo / velocidad;
      if (valorActual < objetivo) {
        contador.innerText = Math.ceil(valorActual + incremento);
        contador.timeoutID = setTimeout(actualizarConteo, 15); 
      } else {
        contador.innerText = objetivo;
      }
    };
    actualizarConteo();
  };
  const observerStats = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
      } else {
        clearTimeout(entrada.target.timeoutID);
        entrada.target.innerText = '0';
      }
    });
  }, { threshold: 0.5 });
  contadores.forEach(contador => { observerStats.observe(contador); });

  // ── 6. MENÚ HAMBURGUESA ──
  const hamburger = document.querySelector('#hamburger');
  const navMenu = document.querySelector('#nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('activo');
      navMenu.classList.toggle('activo');
    });
  }

});// <--- ESTA ES LA LLAVE QUE FALTABA PARA CERRAR EL DOMContentLoaded