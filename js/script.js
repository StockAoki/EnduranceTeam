// ===== GALERÍA: CARRUSEL INFINITO =====
// Corre antes que todo lo demás para que, cuando GSAP y GLightbox lean el DOM
// más abajo, los clones ya existan (tilt-hover y lightbox los detectan solos).
(function () {
  var carousel = document.getElementById('gallery-carousel');
  var track = document.getElementById('gallery-track');
  if (!carousel || !track) return;

  var originalItems = Array.prototype.slice.call(track.querySelectorAll('.gallery-item'));
  if (!originalItems.length) return;

  // Duplicar una vez: con translateX(-50%) el loop no muestra costura.
  originalItems.forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });

  var SECONDS_PER_ITEM = 3.5;

  function updateDuration() {
    var visibleCount = originalItems.filter(function (item) {
      return !item.classList.contains('hidden');
    }).length;
    var duration = Math.max(visibleCount, 1) * SECONDS_PER_ITEM;
    carousel.style.setProperty('--gallery-duration', duration + 's');
  }

  updateDuration();

  // Pausa al pasar el mouse o al tocar (para poder abrir una foto sin que se mueva)
  carousel.addEventListener('mouseenter', function () { carousel.classList.add('paused'); });
  carousel.addEventListener('mouseleave', function () { carousel.classList.remove('paused'); });
  carousel.addEventListener('touchstart', function () { carousel.classList.add('paused'); }, { passive: true });
  carousel.addEventListener('touchend', function () { carousel.classList.remove('paused'); });

  // Filtros: togglean .hidden en ambas copias (original + clon) y recalculan el ritmo
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      track.querySelectorAll('.gallery-item').forEach(function (item) {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      updateDuration();
    });
  });
})();

// ===== PRODUCTOS: CARRUSEL INFINITO (mismo mecanismo que la galería) =====
(function () {
  var carousel = document.getElementById('productos-carousel');
  var track = document.getElementById('productos-track');
  if (!carousel || !track) return;

  var originalItems = Array.prototype.slice.call(track.querySelectorAll('.product-card'));
  if (!originalItems.length) return;

  // Duplicar una vez: con translateX(-50%) el loop no muestra costura.
  originalItems.forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });

  var SECONDS_PER_ITEM = 3.5;
  var duration = originalItems.length * SECONDS_PER_ITEM;
  carousel.style.setProperty('--productos-duration', duration + 's');

  // Pausa al pasar el mouse o al tocar (igual que la galería)
  carousel.addEventListener('mouseenter', function () { carousel.classList.add('paused'); });
  carousel.addEventListener('mouseleave', function () { carousel.classList.remove('paused'); });
  carousel.addEventListener('touchstart', function () { carousel.classList.add('paused'); }, { passive: true });
  carousel.addEventListener('touchend', function () { carousel.classList.remove('paused'); });
})();

// ===== GSAP: SCROLLSMOOTHER + ANIMACIONES DE SCROLL =====
var _smoother = null;
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof ScrollSmoother === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    _smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1
    });
  }

  // Links internos (#ancla): que respeten el scroll suave de ScrollSmoother
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId.length < 2) return;
      var target;
      try {
        target = document.querySelector(targetId);
      } catch (err) {
        return;
      }
      if (!target) return;
      e.preventDefault();
      if (_smoother) {
        _smoother.scrollTo(target, true, 'top top');
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (prefersReducedMotion) return;

  // ===== Stagger de entrada: Beneficios, Equipo, Programas =====
  // clearProps al terminar: estas cards usan .active (mobile) que controla
  // opacity/transform por CSS — un estilo inline de GSAP lo taparía para siempre.
  [
    { selector: '.benefit-slide', y: 30 },
    { selector: '.team-card', y: 30 },
    { selector: '.program-card', y: 30 }
  ].forEach(function (cfg) {
    var els = gsap.utils.toArray(cfg.selector);
    if (!els.length) return;

    ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.from(batch, {
          opacity: 0,
          y: cfg.y,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        });
      }
    });
  });

  // ===== Galería: tilt sutil en hover =====
  // El carrusel ya aporta movimiento propio (ver arriba), así que acá no
  // sumamos otra animación de entrada — solo el tilt al pasar el mouse.
  var galleryItems = gsap.utils.toArray('.gallery-item');
  if (galleryItems.length) {
    galleryItems.forEach(function (item) {
      item.addEventListener('mousemove', function (e) {
        var rect = item.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        gsap.to(item, {
          rotateX: (py - 0.5) * -8,
          rotateY: (px - 0.5) * 8,
          transformPerspective: 600,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      item.addEventListener('mouseleave', function () {
        gsap.to(item, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
      });
    });
  }
})();

// ===== MENÚ MÓVIL FULL-SCREEN =====
const menuToggle = document.getElementById('menu-toggle');
const menu = document.querySelector('.navbar nav');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link, .menu-cta');
const hamburgerIcon = document.querySelector('.hamburger-icon');
const closeIcon = document.querySelector('.close-icon');

// Abrir/Cerrar menú
menuToggle.addEventListener('click', function () {
  menu.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
  
  // Cambiar ícono
  if (menu.classList.contains('active')) {
    hamburgerIcon.style.display = 'none';
    closeIcon.style.display = 'block';
  } else {
    hamburgerIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }
});

// Cerrar menú al hacer click en overlay
menuOverlay.addEventListener('click', function() {
  menu.classList.remove('active');
  menuOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
  hamburgerIcon.style.display = 'block';
  closeIcon.style.display = 'none';
});

// Cerrar menú al hacer click en un enlace
menuLinks.forEach(link => {
  link.addEventListener('click', function() {
    menu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    hamburgerIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  });
});

// Cerrar con tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && menu.classList.contains('active')) {
    menu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    hamburgerIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }
});



// Animación de números contador
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 segundos
  const increment = target / (duration / 16); // 60 FPS
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// Intersection Observer para activar la animación cuando sea visible
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (!counter.classList.contains('animated')) {
          counter.classList.add('animated');
          animateCounter(counter);
        }
      });
    }
  });
}, observerOptions);

// Observar la sección de estadísticas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Lazy loading imágenes galería
  document.querySelectorAll('.gallery-grid img').forEach(function(img) {
    img.setAttribute('loading', 'lazy');
  });
});
// ===== SCROLL REVEAL =====
(function() {
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });
})();

// ===== MODALES DE ENTRENADORES =====
let _modalTrigger = null; // guarda la card que abrió el modal

function openModal(modalId) {
  _modalTrigger = document.activeElement;
  const modal = document.getElementById(modalId);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Mover foco al botón de cierre
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  // Devolver foco a la card que abrió el modal
  if (_modalTrigger) {
    _modalTrigger.focus();
    _modalTrigger = null;
  }
}

// Cerrar al hacer clic en el backdrop
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('trainer-modal')) {
    closeModal(event.target.id);
  }
});

// ESC cierra el modal + trampa de foco con Tab
document.addEventListener('keydown', function(event) {
  const activeModal = document.querySelector('.trainer-modal.active');
  if (!activeModal) return;

  if (event.key === 'Escape') {
    closeModal(activeModal.id);
    return;
  }

  if (event.key === 'Tab') {
    const focusable = Array.from(activeModal.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null); // solo elementos visibles

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) { event.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { event.preventDefault(); first.focus(); }
    }
  }
});


// ===== WHATSAPP: QR EN DESKTOP, APP DIRECTO EN MOBILE =====
(function() {
  const qrContainer = document.getElementById('whatsapp-qr-code');
  const webLink = document.getElementById('whatsapp-web-link');

  if (!qrContainer || !webLink || typeof QRCode === 'undefined') return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function buildWebUrl(waUrl) {
    const url = new URL(waUrl);
    const phone = url.pathname.replace(/^\//, '');
    const text = url.searchParams.get('text') || '';
    return 'https://web.whatsapp.com/send?phone=' + phone + '&text=' + encodeURIComponent(text);
  }

  document.addEventListener('click', function(event) {
    const link = event.target.closest('a[href*="wa.me"]');
    if (!link) return;
    if (isMobile()) return; // en móvil, comportamiento normal (abre la app)

    event.preventDefault();

    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
      text: link.href,
      width: 180,
      height: 180,
      colorDark: '#0a1919',
      colorLight: '#ffffff'
    });

    webLink.href = buildWebUrl(link.href);
    openModal('whatsapp-qr-modal');
  });
})();

// ===== PRODUCTOS: MODAL DE DETALLE =====
(function () {
  var modal = document.getElementById('product-modal');
  var track = document.getElementById('productos-track');
  if (!modal || !track) return;

  var slideTrack = document.getElementById('product-modal-track');
  var dotsWrap = document.getElementById('product-modal-dots');
  var prevBtn = document.getElementById('product-modal-prev');
  var nextBtn = document.getElementById('product-modal-next');
  var titleEl = document.getElementById('product-modal-title');
  var priceEl = document.getElementById('product-modal-price');
  var descEl = document.getElementById('product-modal-desc');
  var ctaEl = document.getElementById('product-modal-cta');
  var slideIndex = 0;
  var slideCount = 1;

  var ACCENTS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[áéíóúñü]/g, function (c) { return ACCENTS[c]; })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function updateSlide() {
    slideTrack.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
    Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
      d.className = i === slideIndex ? 'active' : '';
    });
  }

  function openProductModal(card) {
    var title = card.getAttribute('data-title');
    var price = card.getAttribute('data-price');
    var desc = card.getAttribute('data-desc');
    var photos = card.querySelectorAll('.product-photos img');

    titleEl.textContent = title;
    priceEl.textContent = price;
    descEl.textContent = desc;

    slideTrack.innerHTML = '';
    dotsWrap.innerHTML = '';
    slideIndex = 0;
    slideCount = photos.length || 1;

    photos.forEach(function (photo, i) {
      var slide = document.createElement('div');
      slide.className = 'product-modal-slide';
      var img = document.createElement('img');
      img.src = photo.getAttribute('src');
      img.alt = photo.getAttribute('alt') || title;
      slide.appendChild(img);
      slideTrack.appendChild(slide);

      var dot = document.createElement('span');
      if (i === 0) dot.className = 'active';
      dot.addEventListener('click', function () { slideIndex = i; updateSlide(); });
      dotsWrap.appendChild(dot);
    });

    var multi = photos.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
    dotsWrap.style.display = multi ? 'flex' : 'none';

    var waText = 'Hola! Quiero reservar: ' + title + ' (' + price + ')';
    ctaEl.href = 'https://wa.me/50672786445?text=' + encodeURIComponent(waText);
    ctaEl.setAttribute('data-producto', slugify(title));

    updateSlide();
    openModal('product-modal');
  }

  // Los clones del carrusel infinito ya existen (ver script arriba): se
  // delega en el track para capturar clics en original y clon por igual.
  track.addEventListener('click', function (e) {
    var card = e.target.closest('.product-card');
    if (card) openProductModal(card);
  });

  prevBtn.addEventListener('click', function () {
    slideIndex = (slideIndex - 1 + slideCount) % slideCount;
    updateSlide();
  });
  nextBtn.addEventListener('click', function () {
    slideIndex = (slideIndex + 1) % slideCount;
    updateSlide();
  });

  // Pausa el carrusel de productos mientras el modal está abierto,
  // sin importar cómo se cierre (botón, ESC o clic en el fondo).
  var productosCarousel = document.getElementById('productos-carousel');
  if (productosCarousel) {
    new MutationObserver(function () {
      productosCarousel.classList.toggle('paused', modal.classList.contains('active'));
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
})();

// ===== NAV ACTIVO POR SECCIÓN =====
(function() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = document.querySelectorAll('.navbar a.menu-link, .navbar a.menu-cta');

  const tealSections = ['sobre-nosotros', 'equipo', 'programas', 'contacto'];
  const navbar = document.querySelector('.navbar');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120; // offset navbar fijo
    let current = '';

    sections.forEach(function(section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= scrollY) {
        current = section.id;
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    if (navbar) {
      if (tealSections.includes(current)) {
        navbar.classList.add('on-teal');
      } else {
        navbar.classList.remove('on-teal');
      }
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();

// Agregar fondo al navbar al hacer scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== BARRA DE PROGRESO DE SCROLL + BOTÓN VOLVER ARRIBA =====
(function() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const heroSection = document.getElementById('inicio');
  if (!progressBar || !backToTop) return;

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    const threshold = heroSection ? heroSection.offsetHeight * 0.6 : 400;
    backToTop.classList.toggle('visible', scrollTop > threshold);
  }

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener('click', function() {
    if (_smoother) {
      _smoother.scrollTo(0, true);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
function switchTab(tabName) {
  // Ocultar todos los formularios
  const forms = document.querySelectorAll('.form-content');
  forms.forEach(form => form.classList.remove('active'));

  // Desactivar todos los botones
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Activar el formulario y botón seleccionado
  if (tabName === 'athletes') {
    document.getElementById('athletes-form').classList.add('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else if (tabName === 'business') {
    document.getElementById('business-form').classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
}

  // ===== FORMULARIO ATLETAS =====
  document.getElementById('enviar').addEventListener('click', function (e) {
    e.preventDefault();

    const nombreEl = document.getElementById('nombre');
    const nivelEl  = document.getElementById('nivel');

    // Limpiar errores previos
    [nombreEl, nivelEl].forEach(el => el.closest('.form-group').classList.remove('has-error'));

    let valid = true;
    if (!nombreEl.value.trim()) { nombreEl.closest('.form-group').classList.add('has-error'); valid = false; }
    if (!nivelEl.value)         { nivelEl.closest('.form-group').classList.add('has-error');  valid = false; }
    if (!valid) return;

    const nombre    = nombreEl.value.trim();
    const nivel     = nivelEl.value;
    const comentario = document.getElementById('comentario').value.trim();

    const mensaje =
      "Hola! Estoy interesado en iniciar en el Running.\n" +
      "Mi nombre es *" + nombre + "*\n" +
      "Mi nivel de experiencia es: *" + nivel + "*" +
      (comentario ? "\nComentarios adicionales: " + comentario : "");

    const url = "https://wa.me/50672786445?text=" + encodeURIComponent(mensaje);
    this.href = url;
    window.open(url, '_blank', 'noopener');

    // Limpiar campos
    nombreEl.value = '';
    nivelEl.value  = '';
    document.getElementById('comentario').value = '';
  });

  // ===== FORMULARIO COLABORACIONES =====
  document.getElementById('enviarColaboracion').addEventListener('click', function (e) {
    e.preventDefault();

    const empresaEl   = document.getElementById('empresa');
    const contactoEl  = document.getElementById('contacto-nombre');
    const emailEl     = document.getElementById('email');
    const telefonoEl  = document.getElementById('telefono');
    const tipoEl      = document.getElementById('tipo');
    const mensajeEl   = document.getElementById('mensaje');

    // Limpiar errores previos
    [empresaEl, contactoEl, emailEl, telefonoEl, tipoEl, mensajeEl]
      .forEach(el => el.closest('.form-group').classList.remove('has-error'));

    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!empresaEl.value.trim())              { empresaEl.closest('.form-group').classList.add('has-error');  valid = false; }
    if (!contactoEl.value.trim())             { contactoEl.closest('.form-group').classList.add('has-error'); valid = false; }
    if (!emailRegex.test(emailEl.value.trim())){ emailEl.closest('.form-group').classList.add('has-error');   valid = false; }
    if (!telefonoEl.value.trim())             { telefonoEl.closest('.form-group').classList.add('has-error'); valid = false; }
    if (!tipoEl.value)                        { tipoEl.closest('.form-group').classList.add('has-error');     valid = false; }
    if (!mensajeEl.value.trim())              { mensajeEl.closest('.form-group').classList.add('has-error');  valid = false; }
    if (!valid) return;

    const mensaje =
      "Hola! Estoy interesado en una colaboración empresarial.\n" +
      "Nombre de la Empresa: *" + empresaEl.value.trim() + "*\n" +
      "Persona de Contacto: *"  + contactoEl.value.trim() + "*\n" +
      "Email Corporativo: *"    + emailEl.value.trim() + "*\n" +
      "Teléfono: *"             + telefonoEl.value.trim() + "*\n" +
      "Tipo de Colaboración: *" + tipoEl.value + "*\n" +
      "Mensaje adicional: *"    + mensajeEl.value.trim() + "*";

    const url = "https://wa.me/50672786445?text=" + encodeURIComponent(mensaje);
    this.href = url;
    window.open(url, '_blank', 'noopener');

    // Limpiar campos
    [empresaEl, contactoEl, emailEl, telefonoEl, mensajeEl].forEach(el => el.value = '');
    tipoEl.value = '';
  });

    // Inicializar GLightbox (corre después del carrusel, así detecta también los clones)
document.addEventListener('DOMContentLoaded', function() {
  GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
  });
});

// ===== PAGINACIÓN PARA BENEFICIOS (MÓVIL) =====
document.addEventListener('DOMContentLoaded', function() {
  const benefitsTrack = document.getElementById('benefits-track');
  const benefitsPagination = document.getElementById('benefits-pagination');
  const benefitsHint = document.getElementById('benefits-hint');
  const dots = document.querySelectorAll('.benefits-pagination-dot');

  if (!benefitsTrack || !benefitsPagination) return;

  let hasScrolled = false;

  // Función para actualizar el dot activo
  function updateActiveDot() {
    const scrollLeft = benefitsTrack.scrollLeft;
    const slideWidth = benefitsTrack.querySelector('.benefit-slide').offsetWidth;
    const gap = 19.2; // 1.2rem en px (aproximado)
    const activeIndex = Math.round(scrollLeft / (slideWidth + gap));

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    const slides = document.querySelectorAll('.benefit-slide');
    slides.forEach((slide, index) => {
      if (index === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Ocultar hint después del primer scroll
    if (!hasScrolled && scrollLeft > 10) {
      hasScrolled = true;
      if (benefitsHint) {
        benefitsHint.classList.add('hidden');
      }
    }

    // Detectar si llegó al final para ocultar gradiente
    const isAtEnd = scrollLeft + benefitsTrack.clientWidth >= benefitsTrack.scrollWidth - 10;
    if (isAtEnd) {
      benefitsTrack.classList.add('at-end');
    } else {
      benefitsTrack.classList.remove('at-end');
    }
  }

  // Escuchar scroll
  benefitsTrack.addEventListener('scroll', updateActiveDot);

  // Click en dots para navegar
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const slideWidth = benefitsTrack.querySelector('.benefit-slide').offsetWidth;
      const gap = 19.2; // 1.2rem en px
      const scrollTo = index * (slideWidth + gap);

      benefitsTrack.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    });
  });

  // Inicializar
  updateActiveDot();
  document.querySelector('.benefit-slide').classList.add('active');
});

// ===== HORIZONTAL SCROLL CON DOTS PARA ENTRENADORES (MÓVIL) =====
document.addEventListener('DOMContentLoaded', function() {
  const teamScroll = document.getElementById('team-scroll');
  const scrollIndicators = document.getElementById('team-scroll-indicators');
  const scrollHint = document.getElementById('team-scroll-hint');
  const dots = document.querySelectorAll('.team-scroll-dot');

  // Verificar que los elementos existan
  if (!teamScroll || !scrollIndicators) {
    console.log('Elementos de team scroll no encontrados');
    return;
  }

  let hasScrolled = false;

  // Función para actualizar el dot activo
  function updateActiveDot() {
    const scrollLeft = teamScroll.scrollLeft;
    const cardWidth = teamScroll.querySelector('.team-card').offsetWidth;
    const gap = 19.2; // 1.2rem en px (aproximado)
    const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Ocultar hint después del primer scroll
    if (!hasScrolled && scrollLeft > 10) {
      hasScrolled = true;
      if (scrollHint) {
        scrollHint.classList.add('hidden');
      }
    }

    // Detectar si llegó al final para ocultar gradiente
    const isAtEnd = scrollLeft + teamScroll.clientWidth >= teamScroll.scrollWidth - 10;
    if (isAtEnd) {
      teamScroll.classList.add('at-end');
    } else {
      teamScroll.classList.remove('at-end');
    }
  }

  // Escuchar scroll
  teamScroll.addEventListener('scroll', updateActiveDot);

  // Click en dots para navegar
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const cardWidth = teamScroll.querySelector('.team-card').offsetWidth;
      const gap = 19.2; // 1.2rem en px
      const scrollTo = index * (cardWidth + gap);

      teamScroll.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    });
  });

  // Inicializar
  updateActiveDot();
});


// ===== FUNCIÓN PARA ACORDEONES EN MODALES =====
function toggleCollapse(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.collapsible-icon');
  
  // Toggle active class
  header.classList.toggle('active');
  content.classList.toggle('active');
  
  // Animar icono
  if (content.classList.contains('active')) {
    icon.style.transform = 'rotate(180deg)';
  } else {
    icon.style.transform = 'rotate(0deg)';
  }
}

// ===== DOTS DE NAVEGACIÓN PARA PROGRAMAS (MÓVIL) =====
document.addEventListener('DOMContentLoaded', function() {
  const programsScroll = document.querySelector('.programs-grid');
  const scrollHint = document.getElementById('programs-scroll-hint');
  const dots = document.querySelectorAll('.programs-scroll-dot');

  if (!programsScroll || !dots.length) return;

  let hasScrolled = false;

  // Función para actualizar el dot activo
  function updateActiveDot() {
    const scrollLeft = programsScroll.scrollLeft;
    const cardWidth = programsScroll.querySelector('.program-card').offsetWidth;
    const gap = 16; // 1rem en px
    const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
// ✨ Actualizar cards
  const cards = document.querySelectorAll('.program-card');
  cards.forEach((card, index) => {
    if (index === activeIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
    // Ocultar hint después del primer scroll
    if (!hasScrolled && scrollLeft > 10) {
      hasScrolled = true;
      if (scrollHint) {
        scrollHint.classList.add('hidden');
      }
    }

    // Detectar si llegó al final para ocultar gradiente
    const isAtEnd = scrollLeft + programsScroll.clientWidth >= programsScroll.scrollWidth - 10;
    if (isAtEnd) {
      programsScroll.classList.add('at-end');
    } else {
      programsScroll.classList.remove('at-end');
    }
  }

  // Escuchar scroll
  programsScroll.addEventListener('scroll', updateActiveDot);

  // Click en dots para navegar
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const cardWidth = programsScroll.querySelector('.program-card').offsetWidth;
      const gap = 16;
      const scrollTo = index * (cardWidth + gap);

      programsScroll.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    });
  });

  // Inicializar
  updateActiveDot();
  document.querySelector('.program-card').classList.add('active');
});

// ===== PRICING TABS FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.pricing-tab-btn');
  const tabContents = document.querySelectorAll('.pricing-tab-content');

  if (!tabButtons.length || !tabContents.length) return;

  // Función para inicializar los dots del tab activo
  function initializePricingDots() {
    // Encontrar el tab activo
    const activeTab = document.querySelector('.pricing-tab-content.active');
    if (!activeTab) return;

    const pricingScroll = activeTab.querySelector('.pricing-grid');
    const scrollHint = document.getElementById('pricing-scroll-hint');
    const allDots = document.querySelectorAll('.pricing-scroll-dot');

    if (!pricingScroll || !allDots.length) return;

    // Contar cuántas cards tiene el tab activo
    const cards = pricingScroll.querySelectorAll('.pricing-card');
    const cardCount = cards.length;

    // Mostrar/ocultar dots según la cantidad de cards
    allDots.forEach((dot, index) => {
      if (index < cardCount) {
        dot.style.display = 'inline-block';
      } else {
        dot.style.display = 'none';
      }
    });

    let hasScrolled = false;

    // Función para actualizar el dot activo
    function updateActiveDot() {
      const scrollLeft = pricingScroll.scrollLeft;
      const cardWidth = pricingScroll.querySelector('.pricing-card').offsetWidth;
      const gap = 16; // 1rem en px
      const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

      allDots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Ocultar hint después del primer scroll
      if (!hasScrolled && scrollLeft > 10) {
        hasScrolled = true;
        if (scrollHint) {
          scrollHint.classList.add('hidden');
        }
      }

      // Detectar si llegó al final para ocultar gradiente
      const isAtEnd = scrollLeft + pricingScroll.clientWidth >= pricingScroll.scrollWidth - 10;
      if (isAtEnd) {
        pricingScroll.classList.add('at-end');
      } else {
        pricingScroll.classList.remove('at-end');
      }
    }

    // Remover listeners anteriores (si existen)
    const oldScroll = document.querySelector('.pricing-grid-with-listener');
    if (oldScroll) {
      oldScroll.classList.remove('pricing-grid-with-listener');
    }

    // Marcar este grid como el que tiene el listener
    pricingScroll.classList.add('pricing-grid-with-listener');

    // Escuchar scroll
    pricingScroll.addEventListener('scroll', updateActiveDot);

    // Click en dots para navegar
    allDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        if (index >= cardCount) return; // No hacer nada si el dot está oculto

        const cardWidth = pricingScroll.querySelector('.pricing-card').offsetWidth;
        const gap = 16;
        const scrollTo = index * (cardWidth + gap);

        pricingScroll.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
      });
    });

    // Inicializar
    updateActiveDot();
  }

  // Inicializar dots al cargar la página
  initializePricingDots();

  // Reinicializar dots al cambiar de tab
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      const targetContent = document.getElementById('tab-' + targetTab);
      if (targetContent) {
        targetContent.classList.add('active');

        // Reinicializar los dots para el nuevo tab
        setTimeout(() => {
          initializePricingDots();
        }, 50); // Pequeño delay para asegurar que el DOM se haya actualizado
      }
    });
  });
});

// ===== MODAL PROMOCIONAL DE BIENVENIDA =====
window.addEventListener('DOMContentLoaded', function() {
  const welcomeModal = document.getElementById('welcome-modal');
  const closeModalBtn = document.getElementById('close-welcome-modal');
  const modalOverlay = document.querySelector('.welcome-modal-overlay');
  const modalImage = document.querySelector('.welcome-modal-image');

  // Mostrar el modal después de un pequeño delay para mejor experiencia
  setTimeout(function() {
    if (welcomeModal) {
      welcomeModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }, 1500);

  // Cerrar modal al hacer clic en el botón X
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      closeWelcomeModal();
    });
  }

  // Cerrar modal al hacer clic en el overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function() {
      closeWelcomeModal();
    });
  }

  // Cerrar modal al hacer clic en la imagen (opcional)
  // Si quieres que la imagen sea un enlace, descomenta esto y ajusta el enlace en el HTML
  if (modalImage) {
    modalImage.addEventListener('click', function() {
      // Aquí puedes redirigir a una sección específica
      // window.location.href = '#ofertas';
      closeWelcomeModal();
    });
  }

//   // Cerrar modal con tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && welcomeModal && welcomeModal.classList.contains('show')) {
      closeWelcomeModal();
    }
  });

//   // Función para cerrar el modal
  function closeWelcomeModal() {
    if (welcomeModal) {
      welcomeModal.classList.remove('show');
      document.body.style.overflow = 'auto';

      // Remover el modal del DOM después de la animación
      setTimeout(function() {
        welcomeModal.style.display = 'none';
      }, 300);
    }
  }
});

// ===== GOOGLE ANALYTICS 4: TRACKING DE CLICKS EN LINKS =====
(function() {
  if (typeof gtag !== 'function') return;

  // Hosts que se consideran contacto por WhatsApp (incluye el flujo de QR/WhatsApp Web en desktop)
  var WHATSAPP_HOSTS = ['wa.me', 'web.whatsapp.com', 'api.whatsapp.com'];

  // Mapeo de hosts externos conocidos a un nombre de destino legible
  var EXTERNAL_DESTINOS = {
    'instagram.com': 'instagram',
    'www.instagram.com': 'instagram',
    'facebook.com': 'facebook',
    'www.facebook.com': 'facebook',
    'strava.com': 'strava',
    'www.strava.com': 'strava'
  };

  // Hosts con evento propio en vez de caer en el genérico click_externo
  var ALTERNATIVO_STUDIO_HOSTS = ['alternativostudio.com', 'www.alternativostudio.com'];

  // Recorre los ancestros del elemento para identificar la sección de la página (nav, hero, footer, modales, etc.)
  function getLinkLocation(el) {
    var node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      if (node.tagName === 'HEADER' && node.classList.contains('navbar')) return 'nav';
      if (node.tagName === 'FOOTER') return 'footer';
      if (node.classList.contains('trainer-modal')) return node.id || 'modal';
      if (node.tagName === 'SECTION' && node.id) return node.id;
      node = node.parentElement;
    }
    return 'otro';
  }

  document.addEventListener('click', function(event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (e) {
      return;
    }

    var linkLocation = getLinkLocation(link);

    // Links de WhatsApp
    if (WHATSAPP_HOSTS.indexOf(url.hostname) !== -1) {
      var params = { link_location: linkLocation };
      var productoEl = link.closest('[data-producto]');
      var servicioEl = link.closest('[data-servicio]');
      if (productoEl) params.producto = productoEl.dataset.producto;
      if (servicioEl) params.servicio = servicioEl.dataset.servicio;
      gtag('event', 'click_whatsapp', params);
      return;
    }

    // Link al footer de Alternativo Studio (lead de desarrollo web, evento propio)
    if (ALTERNATIVO_STUDIO_HOSTS.indexOf(url.hostname) !== -1) {
      gtag('event', 'click_alternativo_studio', { link_location: linkLocation });
      return;
    }

    // Otros links externos relevantes (redes sociales, Strava, etc.)
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.hostname !== window.location.hostname) {
      var destinoEl = link.closest('[data-destino]');
      var destino = destinoEl ? destinoEl.dataset.destino : (EXTERNAL_DESTINOS[url.hostname] || url.hostname);
      gtag('event', 'click_externo', {
        link_location: linkLocation,
        destino: destino
      });
    }
  });
})();