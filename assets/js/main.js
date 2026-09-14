// Success Meter — shared behaviors

// TODO: Replace with your zcal (or Calendly) scheduling link once you have it,
// e.g. 'https://zcal.co/your-name/demo'. Every "Schedule a demo" / "Book a demo" /
// "Book a Meeting" button (class="js-book-demo") will automatically use this link.
const BOOKING_URL = null;

document.addEventListener('DOMContentLoaded', () => {
  if (BOOKING_URL) {
    document.querySelectorAll('.js-book-demo').forEach((link) => {
      link.setAttribute('href', BOOKING_URL);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });
});
