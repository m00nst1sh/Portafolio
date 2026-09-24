/* ==========================================================================
   PORTAFOLIO WEB — JESHUA USECHE
   Archivo: js/script.js
   Commit 5: Animaciones + JavaScript Interactivo (Vanilla JS Puro)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. NAVBAR: ESTADO STICKY / SCROLLED
     Cambia el fondo y la sombra del navbar al hacer scroll hacia abajo.
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    const scrollThreshold = 40;
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('navbar-scrolled', 'scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled', 'scrolled');
    }
  }

  // Listener pasivo para optimizar el rendimiento de scroll
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Ejecutar en carga inicial

  /* --------------------------------------------------------------------------
     2. NAVBAR: MENÚ HAMBURGUESA MOBILE
     Maneja el toggle del menú responsive (3 líneas → X y slide-in).
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    if (!hamburgerBtn || !mobileMenu) return;
    hamburgerBtn.classList.add('open', 'is-active');
    mobileMenu.classList.add('open', 'is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    if (!hamburgerBtn || !mobileMenu) return;
    hamburgerBtn.classList.remove('open', 'is-active');
    mobileMenu.classList.remove('open', 'is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  function toggleMobileMenu() {
    if (!hamburgerBtn || !mobileMenu) return;
    const isCurrentlyOpen = hamburgerBtn.classList.contains('open');
    if (isCurrentlyOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Cerrar menú mobile al hacer click fuera
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Cerrar menú mobile con tecla Escape por accesibilidad
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      hamburgerBtn.focus();
    }
  });

  /* --------------------------------------------------------------------------
     3. SMOOTH SCROLL CON OFFSET DE NAVBAR
     Navegación fluida al hacer click en links ancla (#), respetando la altura
     del navbar fijo superior.
     -------------------------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      // Ignorar anclas vacías o que sean solo '#'
      if (!targetId || targetId === '#' || targetId.length <= 1) return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      // Cerrar menú mobile si estuviera abierto
      closeMobileMenu();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - navHeight);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. HERO SECTION: PARALLAX SUAVE Y EFECTOS
     Mueve el contenido del hero ligeramente más lento que el scroll
     usando transform y requestAnimationFrame para máxima fluidez.
     -------------------------------------------------------------------------- */
  const heroSection = document.getElementById('inicio');
  const heroContent = document.querySelector('.hero-content');

  if (heroSection && heroContent) {
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;

            if (scrolled <= heroHeight) {
              const translateY = scrolled * 0.22;
              const opacity = Math.max(0, 1 - scrolled / (heroHeight * 0.9));
              heroContent.style.transform = `translate3d(0, ${translateY}px, 0)`;
              heroContent.style.opacity = opacity;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
     5. INTERSECTION OBSERVER: ANIMACIONES AL SCROLL
     Detecta cuando los elementos marcados con [data-animate] entran en el
     viewport y les asigna la clase 'animate-in' con fade-in y slide-up.
     -------------------------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Respetar delay personalizado si está presente
        if (el.dataset.delay) {
          el.style.transitionDelay = el.dataset.delay;
        }

        el.classList.add('animate-in');
        observer.unobserve(el); // Animar una sola vez
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach((el) => {
    animationObserver.observe(el);
  });

  /* --------------------------------------------------------------------------
     6. CONTADOR ANIMADO DE ESTADÍSTICAS (STATS)
     Cuenta suavemente de 0 al valor final con requestAnimationFrame y easing
     cuando la sección de estadísticas entra en el viewport.
     -------------------------------------------------------------------------- */
  let statsTriggered = false;
  const statsContainer = document.querySelector('.about-stats');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function runStatsCounter() {
    const duration = 2000; // 2 segundos según especificación

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      let startTime = null;

      // Iniciar en 0
      stat.textContent = '0';

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Curva de aceleración/desaceleración suave (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = currentVal;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          stat.textContent = target;
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  if (statsContainer && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsTriggered) {
            statsTriggered = true;
            runStatsCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    statsObserver.observe(statsContainer);
  }

  /* --------------------------------------------------------------------------
     7. HOVER EFFECTS EN TARJETAS DE PROYECTO
     Interacción JavaScript que añade clase activa al cursor sobre la card.
     -------------------------------------------------------------------------- */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('card-hovered');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('card-hovered');
    });
  });

  /* --------------------------------------------------------------------------
     8. FORMULARIO DE CONTACTO: VALIDACIÓN Y FEEDBACK
     Valida campos en tiempo real y al enviar, muestra feedback visual y
     simula envío con animación de loading.
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit');
  const formFeedback = document.getElementById('form-feedback');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Regex estándar para validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName() {
    if (!nameInput) return true;
    const value = nameInput.value.trim();
    const isValid = value.length >= 2;

    if (!isValid) {
      nameInput.classList.add('is-invalid');
      if (nameError) nameError.classList.add('visible');
    } else {
      nameInput.classList.remove('is-invalid');
      if (nameError) nameError.classList.remove('visible');
    }
    return isValid;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const value = emailInput.value.trim();
    const isValid = emailRegex.test(value);

    if (!isValid) {
      emailInput.classList.add('is-invalid');
      if (emailError) emailError.classList.add('visible');
    } else {
      emailInput.classList.remove('is-invalid');
      if (emailError) emailError.classList.remove('visible');
    }
    return isValid;
  }

  function validateSubject() {
    if (!subjectInput) return true;
    const value = subjectInput.value.trim();
    const isValid = value.length >= 2;

    if (!isValid) {
      subjectInput.classList.add('is-invalid');
      if (subjectError) subjectError.classList.add('visible');
    } else {
      subjectInput.classList.remove('is-invalid');
      if (subjectError) subjectError.classList.remove('visible');
    }
    return isValid;
  }

  function validateMessage() {
    if (!messageInput) return true;
    const value = messageInput.value.trim();
    const isValid = value.length >= 5;

    if (!isValid) {
      messageInput.classList.add('is-invalid');
      if (messageError) messageError.classList.add('visible');
    } else {
      messageInput.classList.remove('is-invalid');
      if (messageError) messageError.classList.remove('visible');
    }
    return isValid;
  }

  // Validación interactiva al perder el foco (blur) y escribir (input)
  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('is-invalid')) validateName();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) validateEmail();
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', validateSubject);
    subjectInput.addEventListener('input', () => {
      if (subjectInput.classList.contains('is-invalid')) validateSubject();
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('is-invalid')) validateMessage();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Ocultar mensajes previos de feedback
      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';
      }

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isSubjectValid = validateSubject();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Por favor completa todos los campos requeridos correctamente.';
        }
        return;
      }

      // Estado de carga en el botón de submit
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        const submitText = submitBtn.querySelector('.submit-text');
        if (submitText) submitText.textContent = 'Enviando...';
      }

      // Simular respuesta asíncrona de envío (1.2 segundos)
      setTimeout(() => {
        // Restaurar botón
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          const submitText = submitBtn.querySelector('.submit-text');
          if (submitText) submitText.textContent = 'Enviar mensaje';
        }

        // Mostrar mensaje de éxito
        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.textContent =
            '¡Mensaje enviado con éxito! Gracias por contactarme, te responderé a la brevedad.';
        }

        // Limpiar los campos del formulario
        contactForm.reset();
        nameInput.classList.remove('is-invalid');
        emailInput.classList.remove('is-invalid');
        if (subjectInput) subjectInput.classList.remove('is-invalid');
        messageInput.classList.remove('is-invalid');
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     9. FOOTER: AÑO DINÁMICO
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
