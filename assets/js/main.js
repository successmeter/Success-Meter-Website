// Success Meter — shared behaviors (nav toggle only)
// Content, booking-link injection, and accordion bindings are handled by
// content.js, since content is now loaded dynamically from content/*.json
// (editable via the /admin CMS).
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
});
