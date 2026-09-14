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

  // Netlify Identity invite/recovery links land on the homepage (or whichever
  // page the email points at) with a #invite_token=... or #recovery_token=...
  // fragment. This catches that token, opens the "set your password" popup,
  // and sends the user to /admin once they're logged in.
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', (user) => {
      if (!user) {
        window.netlifyIdentity.on('login', () => {
          window.location.href = '/admin/';
        });
      }
    });

    const hash = window.location.hash || '';
    if (hash.includes('confirmation_token') || hash.includes('invite_token') || hash.includes('recovery_token') || hash.includes('access_token')) {
      window.netlifyIdentity.open();
    }
  }
});
