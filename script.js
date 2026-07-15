const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const modal = document.querySelector('[data-modal]');
const modalTitle = document.querySelector('[data-modal-title]');
const cursorGlow = document.querySelector('.cursor-glow');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item) => {
  const delay = item.dataset.delay || 0;
  item.style.setProperty('--delay', `${delay}ms`);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const openModal = (title = 'Cairos Showreel') => {
  if (!modal) return;
  modalTitle.textContent = title;
  modal.showModal();
  document.body.classList.add('modal-open');
};

const closeModal = () => {
  if (!modal) return;
  modal.close();
  document.body.classList.remove('modal-open');
};

document.querySelector('[data-showreel]')?.addEventListener('click', () => openModal('Cairos Media Showreel'));
document.querySelectorAll('[data-project]').forEach((project) => {
  project.addEventListener('click', () => openModal(project.dataset.project));
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(project.dataset.project);
    }
  });
});

document.querySelector('[data-modal-close]')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  const rect = modal.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) closeModal();
});

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const success = contactForm.querySelector('.form-success');
  const submit = contactForm.querySelector('.form-submit');
  if (!contactForm.reportValidity()) return;
  submit.textContent = 'Inquiry prepared ✦';
  submit.disabled = true;
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
  window.addEventListener('mousemove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = '1';
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
}
