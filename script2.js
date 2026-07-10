// ========================================================================
// CÚSPIDES — SCRIPT INTERACTIVO GENERAL UNIFICADO (script.js)
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. ANIMACIÓN REVEAL (Hace aparecer las secciones al hacer scroll) ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); 
        revealObserver.unobserve(entry.target); 
      }
    });
  }, { 
    threshold: 0.08 
  });

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
          if (otraRespuesta) {
            otraRespuesta.style.maxHeight = null;
          }
        });

        if (!yaActivo) {
          item.classList.add('active');
          respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
        }
      });
    }
  });


  // ── 3. MOTOR MAESTRO PARA CARRUSELES EN LOOP INFINITO (ANTI-BLOQUEO SNAP) ──
  
  const inicializarSliderInfinito = (config) => {
    const slider = document.querySelector(config.sliderSelector);
    if (!slider) return;

    // Aislamos los elementos originales reales (ignorando clones)
    const celdasOriginales = Array.from(slider.children).filter(el => !el.classList.contains('is-clone'));
    const totalOriginales = celdasOriginales.length;
    if (totalOriginales === 0) return;

    const numVisibles = config.numVisibles || 3;
    const gap = config.gap !== undefined ? config.gap : 20;

    // Evitamos duplicaciones accidentales de clones
    if (slider.querySelector('.is-clone')) return;

    // Rulo óptico de clones para simular infinito continuo
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

    // Usamos medidas decimales puras para evitar rebotes por redondeo de píxeles
    const obtenerAnchoCelda = () => celdasOriginales[0].getBoundingClientRect().width + gap;

    // Calibración inicial para pararse sobre las tarjetas verdaderas
    const calibrarPosicion = () => {
      slider.scrollLeft = obtenerAnchoCelda() * numVisibles;
    };

    setTimeout(calibrarPosicion, 50);
    window.addEventListener('resize', calibrarPosicion);

    let estaTeletransportando = false;

    // Escucha activa del desplazamiento manual (Trackpad, mouse o touch)
    slider.addEventListener('scroll', () => {
      if (estaTeletransportando) return;

      const celdaWidth = obtenerAnchoCelda();
      const scrollActual = slider.scrollLeft;
      
      const limiteIzquierdo = celdaWidth * (numVisibles - 1);
      const limiteDerecho = celdaWidth * (totalOriginales + numVisibles);

      // Teletransporte imperceptible en los extremos exteriores
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

      // Sincronización matemática de los indicadores inferiores (Dots)
      const scrollRelativo = slider.scrollLeft - (celdaWidth * numVisibles);
      let indiceReal = Math.round(scrollRelativo / celdaWidth);
      
      if (indiceReal < 0) indiceReal = totalOriginales + indiceReal;
      indiceReal = indiceReal % totalOriginales;

      const dots = document.querySelectorAll(config.dotSelector);
      if (dots.length > 0) {
        let dotIndex = indiceReal;
        if (config.isCursos) {
          const indexCentrado = indiceReal + 1;
          dotIndex = Math.max(0, Math.min(2, indexCentrado - 1));
        } else {
          dotIndex = Math.max(0, Math.min(dots.length - 1, indiceReal));
        }
        dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
      }

      // Escalador dinámico de centro (Exclusivo para tus Cursos)
      if (config.escalarCentro) {
        const todasLasCards = slider.children;
        const sliderRect = slider.getBoundingClientRect();
        const centroSlider = sliderRect.left + (sliderRect.width / 2);

        Array.from(todasLasCards).forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const centroCard = cardRect.left + (cardRect.width / 2);
          const estaCentrada = Math.abs(centroSlider - centroCard) < (celdaWidth / 2);
          card.classList.toggle('card-item--selected', estaCentrada);
        });
      }
    });

    // ── 🎯 ARREGLO MAESTRO: DISPARADOR SEGURO POR CLIC DE DOT O FLECHA ──
    window[config.nombreFuncionGlobal] = (index) => {
      const celdaWidth = obtenerAnchoCelda();
      
      // 1. Apagamos por completo el snap usando máxima jerarquía en línea
      slider.style.setProperty('scroll-snap-type', 'none', 'important');
      
      // 2. Ejecutamos el viaje suave hacia la coordenada exacta
      slider.scrollTo({
        left: celdaWidth * (index + numVisibles),
        behavior: 'smooth'
      });

      // 3. Creamos el escuchador inteligente del fin del viaje
      const restaurarSnap = () => {
        slider.style.setProperty('scroll-snap-type', 'x mandatory', 'important');
        slider.removeEventListener('scrollend', restaurarSnap);
        clearTimeout(slider.timeoutSnap);
      };

      // Limpiamos referencias colgadas previas para evitar duplicación de eventos
      slider.removeEventListener('scrollend', slider._cleanupSnap);
      slider._cleanupSnap = restaurarSnap;
      
      // Escuchamos de forma activa el fin real de la animación
      slider.addEventListener('scrollend', restaurarSnap);

      // Guardián absoluto de respaldo (Por si el navegador interrumpe el foco)
      clearTimeout(slider.timeoutSnap);
      slider.timeoutSnap = setTimeout(restaurarSnap, 1200); 
    };
  };

  // ── LANZAMIENTO INTEGRAL DE TUS TRES COMPONENTES ──

  // Carrusel 01: Programas de Entrenamiento
  inicializarSliderInfinito({
    sliderSelector: '.cards-slider',
    dotSelector: '.cards-wrapper .card-dot',
    nombreFuncionGlobal: 'irACard',
    escalarCentro: true,
    isCursos: true,
    numVisibles: 3,
    gap: 20
  });

  // Carrusel 02: Testimonios Oscuros Rectangulares
  inicializarSliderInfinito({
    sliderSelector: '.testimonios-slider',
    dotSelector: '.testimonios-wrapper .testimonio-dot',
    nombreFuncionGlobal: 'irATestimonio',
    escalarCentro: false,
    isCursos: false,
    numVisibles: 3,
    gap: 20
  });

  // Carrusel 03: Protocolos de Seguridad (¡Mapeo Inicial!)
  inicializarSliderInfinito({
    sliderSelector: '.protocolos-slider',
    dotSelector: '.protocolos-seccion .dot',
    nombreFuncionGlobal: 'irASlide', 
    escalarCentro: false,
    isCursos: false,
    numVisibles: 1, 
    gap: 0          
  });

  // ── ⌨️ 4. ACOPLE EXCLUSIVO PARA ENLAZAR LAS FLECHAS DEL TECLADO EN PROTOCOLOS ──
  const protocolosSlider = document.querySelector('.protocolos-slider');
  if (protocolosSlider) {
    let seccionProtocolosVisible = false;

    // Detectamos si el usuario tiene la sección de protocolos en pantalla
    const observerFoco = new IntersectionObserver((entries) => {
      seccionProtocolosVisible = entries[0].isIntersecting;
    }, { threshold: 0.25 });
    
    observerFoco.observe(protocolosSlider);

    // Escuchamos el evento de teclado
    document.addEventListener('keydown', (e) => {
      if (!seccionProtocolosVisible) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); // Detiene el tironeo nativo de Windows/Mac sobre el ancho entero
        
        const celdaWidth = protocolosSlider.children[0].getBoundingClientRect().width;
        const scrollRelativo = protocolosSlider.scrollLeft - celdaWidth; // numVisibles es 1
        const indiceReal = Math.round(scrollRelativo / celdaWidth);

        if (e.key === 'ArrowRight') {
          window.irASlide(indiceReal + 1);
        } else if (e.key === 'ArrowLeft') {
          window.irASlide(indiceReal - 1);
        }
      }
    });
  }

});