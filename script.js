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