/**
 * Pinnacle Law House - Main JavaScript
 * Vanilla JS for navigation, form validation, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== Mobile Navigation Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // ===== Active Navigation Link =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // ===== Contact Form Validation =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Validate Name
      const name = document.getElementById('name');
      if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
      } else {
        clearError(name);
      }
      
      // Validate Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value)) {
        showError(email, 'Valid email is required');
        isValid = false;
      } else {
        clearError(email);
      }
      
      // Validate Phone (optional but format if provided)
      const phone = document.getElementById('phone');
      if (phone.value.trim() && !/^[0-9+\-\s()]{10,}$/.test(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearError(phone);
      }
      
      // Validate Message
      const message = document.getElementById('message');
      if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
      } else {
        clearError(message);
      }
      
      // If valid, show success (in production: submit to backend)
      if (isValid) {
        showSuccess('Thank you! Your message has been received. We will contact you within 24 hours.');
        contactForm.reset();
        
        // Reset after 5 seconds
        setTimeout(() => {
          const successMsg = contactForm.querySelector('.success-message');
          if (successMsg) successMsg.remove();
        }, 5000);
      }
    });
  }
  
  // ===== Scroll Animations (Intersection Observer) =====
  const animateElements = document.querySelectorAll('.card, .value-item, .contact-grid > div');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    
    animateElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.transitionDelay = `${index * 0.08}s`;
      observer.observe(el);
    });
  }
  
  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // ===== Helper Functions =====
  function showError(field, message) {
    const error = field.parentElement.querySelector('.error');
    if (error) {
      error.textContent = message;
      error.classList.add('show');
    }
    field.style.borderColor = 'var(--black)';
    field.setAttribute('aria-invalid', 'true');
  }
  
  function clearError(field) {
    const error = field.parentElement.querySelector('.error');
    if (error) {
      error.classList.remove('show');
    }
    field.style.borderColor = 'var(--gray-border)';
    field.removeAttribute('aria-invalid');
  }
  
  function showSuccess(message) {
    // Remove existing success messages
    const existing = contactForm.querySelector('.success-message');
    if (existing) existing.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
      background: var(--black);
      color: var(--white);
      padding: 1rem 1.5rem;
      border-radius: var(--radius);
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
    `;
    successDiv.textContent = message;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Scroll to top of form
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // ===== Dynamic Year in Footer =====
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  // ===== Prevent Form Submission on Enter in Textarea =====
  const textarea = document.getElementById('message');
  if (textarea) {
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        contactForm.requestSubmit();
      }
    });
  }
});