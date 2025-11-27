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
});
// Funciones para abrir y cerrar modales
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Previene scroll del body
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Restaura scroll del body
}

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('trainer-modal')) {
    event.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const activeModal = document.querySelector('.trainer-modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
});


// Agregar fondo al navbar al hacer scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
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

    document.getElementById('enviar').addEventListener('click', function () {
      const nombre = document.getElementById('nombre').value || '*[sin nombre]*';
      const nivel = document.getElementById('nivel').value || '*[sin nivel]*';
      const comentario = "Comentarios adicionales: " +document.getElementById('comentario').value || '';

      // Mantengo los asteriscos alrededor para que WhatsApp muestre texto en negrita si lo desea.
      const mensaje =
        "Hola! Estoy interesado en iniciar en el Running.\n" +
        "Mi nombre es *" + nombre + "*\n" +
        "Mi nivel de experiencia es: *" + nivel + "*\n" +
        comentario ;

       const url = "https://wa.me/" + 50660787111 + "?text=" + encodeURIComponent(mensaje);
 this.href = url;
      window.open(url, '_blank', 'noopener');
// 🔄 Limpiar los campos después de abrir WhatsApp
      document.getElementById('nombre').value = "";
      document.getElementById('nivel').value = "";
      document.getElementById('comentario').value = "";
    });

      document.getElementById('enviarColaboracion').addEventListener('click', function (e) {
      e.preventDefault();

      const telefono = "506TU_NUMERO_AQUI"; // ← Cambiar aquí

      const empresa = document.getElementById('empresa').value || '*[sin empresa]*';
      const contacto = document.getElementById('contacto').value || '*[sin contacto]*';
      const email = document.getElementById('email').value || '*[sin email]*';
      const tel = document.getElementById('telefono').value || '*[sin teléfono]*';
      const tipo = document.getElementById('tipo').value || '*[sin tipo]*';
      const mensajeAdicional = document.getElementById('mensaje').value || '*[sin mensaje]*';

      const mensaje =
        "Hola! Estoy interesado en una colaboración empresarial.\n" +
        "Nombre de la Empresa: *" + empresa + "*\n" +
        "Persona de Contacto: *" + contacto + "*\n" +
        "Email Corporativo: *" + email + "*\n" +
        "Teléfono: *" + tel + "*\n" +
        "Tipo de Colaboración: *" + tipo + "*\n" +
        "Mensaje adicional: *" + mensajeAdicional + "*";

      const url = "https://wa.me/" + 50660787111 + "?text=" + encodeURIComponent(mensaje);

      this.href = url;
      window.open(url, '_blank', 'noopener');

      // Limpiar después de enviar
      document.getElementById('empresa').value = "";
      document.getElementById('contacto').value = "";
      document.getElementById('email').value = "";
      document.getElementById('telefono').value = "";
      document.getElementById('tipo').value = "";
      document.getElementById('mensaje').value = "";
    });

    // Inicializar GLightbox
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
  });

  // Sistema de filtros de galería
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remover active de todos los botones
      filterBtns.forEach(b => b.classList.remove('active'));
      // Agregar active al botón clickeado
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          if (item.classList.contains(filter)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });
  });
});

// ===== INDICADORES DE SCROLL PARA BENEFICIOS (MÓVIL) =====
document.addEventListener('DOMContentLoaded', function() {
  const benefitsScroll = document.getElementById('benefits-scroll');
  const scrollIndicators = document.getElementById('scroll-indicators');
  const scrollHint = document.getElementById('scroll-hint');
  const dots = document.querySelectorAll('.scroll-dot');

  if (!benefitsScroll || !scrollIndicators) return;

  let hasScrolled = false;

  // Función para actualizar el dot activo
  function updateActiveDot() {
    const scrollLeft = benefitsScroll.scrollLeft;
    const cardWidth = benefitsScroll.querySelector('.benefit-card').offsetWidth;
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
    const isAtEnd = scrollLeft + benefitsScroll.clientWidth >= benefitsScroll.scrollWidth - 10;
    if (isAtEnd) {
      benefitsScroll.classList.add('at-end');
    } else {
      benefitsScroll.classList.remove('at-end');
    }
  }

  // Escuchar scroll
  benefitsScroll.addEventListener('scroll', updateActiveDot);

  // Click en dots para navegar
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const cardWidth = benefitsScroll.querySelector('.benefit-card').offsetWidth;
      const gap = 19.2; // 1.2rem en px
      const scrollTo = index * (cardWidth + gap);

      benefitsScroll.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    });
  });

  // Inicializar
  updateActiveDot();
});