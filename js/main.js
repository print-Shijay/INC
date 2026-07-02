/* ============================================
   Iglesia ni Chancellor — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- AOS Init ----------
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic',
    offset: 60
  });

  // ---------- DOM References ----------
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = mobileNav.querySelectorAll('a');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  // ---------- Sticky Navbar on Scroll ----------
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 80;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  // Run once on load in case page is already scrolled
  handleNavScroll();

  // ---------- Active Nav Link Highlight ----------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a, .mobile-nav a');

  function highlightActiveSection() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navAnchors.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });
  highlightActiveSection();

  // ---------- Mobile Menu Toggle ----------
  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    mobileOverlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus first link for accessibility
    setTimeout(function () {
      mobileNavLinks[0].focus();
    }, 300);
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileNav.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close on overlay click
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close on mobile nav link click
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileMenu();
      hamburger.focus();
    }
  });

  // ---------- Focus Trap in Mobile Nav ----------
  mobileNav.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;

    const focusableElements = mobileNav.querySelectorAll('a');
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      history.pushState(null, null, targetId);
    });
  });

  // ---------- Contact Form Validation ----------
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors() {
    contactForm.querySelectorAll('.form-group').forEach(function (group) {
      group.classList.remove('error');
    });
  }

  function showError(inputId, errorId) {
    var group = document.getElementById(inputId).closest('.form-group');
    group.classList.add('error');
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var name = document.getElementById('form-name');
    var email = document.getElementById('form-email');
    var message = document.getElementById('form-message');
    var hasError = false;

    // Validate name
    if (!name.value.trim()) {
      showError('form-name', 'name-error');
      hasError = true;
    }

    // Validate email
    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      showError('form-email', 'email-error');
      hasError = true;
    }

    // Validate message
    if (!message.value.trim()) {
      showError('form-message', 'message-error');
      hasError = true;
    }

    if (hasError) {
      // Focus first error field
      var firstError = contactForm.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Success — hide form, show confirmation
    contactForm.style.display = 'none';
    formSuccess.classList.add('active');

    // Reset form for if they revisit
    contactForm.reset();
  });

  // ---------- Clear individual field errors on input ----------
  contactForm.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      this.closest('.form-group').classList.remove('error');
    });
  });

});
