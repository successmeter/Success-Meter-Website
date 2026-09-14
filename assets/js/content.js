// Success Meter — CMS content loader
// Fetches JSON files edited via the Decap CMS (/admin) and injects them into the page.

async function fetchJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('Could not load', path, e);
    return null;
  }
}

function applySettings(settings) {
  if (!settings) return;

  document.querySelectorAll('[data-field="logo"]').forEach((el) => {
    el.src = settings.logo;
  });
  document.querySelectorAll('[data-field="site_name"]').forEach((el) => {
    el.textContent = settings.site_name;
  });
  document.querySelectorAll('[data-field="email"]').forEach((el) => {
    el.textContent = settings.email;
  });
  document.querySelectorAll('[data-field="phone"]').forEach((el) => {
    el.textContent = settings.phone;
  });
  document.querySelectorAll('[data-field="footer_copyright"]').forEach((el) => {
    el.textContent = settings.footer_copyright;
  });

  if (settings.booking_url) {
    document.querySelectorAll('.js-book-demo').forEach((link) => {
      link.setAttribute('href', settings.booking_url);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });
  }
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') node.className = value;
    else if (key === 'html') node.innerHTML = value;
    else node.setAttribute(key, value);
  });
  children.forEach((child) => node.appendChild(child));
  return node;
}

// Turns text like "DATA is KNOWLEDGE/POWER" into a looping typewriter effect:
// types "DATA is KNOWLEDGE", deletes just the last word, types "DATA is POWER", loops forever.
function applyTypewriter(node, text) {
  if (!text) return;

  // Split on "/" to find the alternating words (e.g. "KNOWLEDGE" / "POWER").
  const segments = text.split('/').map((s) => s.trim()).filter(Boolean);
  if (segments.length < 2) {
    node.textContent = text;
    return;
  }

  const firstWords = segments[0].split(' ');
  const loopWords = [firstWords[firstWords.length - 1], ...segments.slice(1)];
  const prefix = firstWords.slice(0, -1).join(' ') + (firstWords.length > 1 ? ' ' : '');

  node.textContent = '';
  const prefixSpan = document.createTextNode(prefix);
  const wordSpan = document.createElement('span');
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriter-cursor';
  cursorSpan.textContent = '|';
  node.appendChild(prefixSpan);
  node.appendChild(wordSpan);
  node.appendChild(cursorSpan);

  const TYPE_SPEED = 110;
  const DELETE_SPEED = 60;
  const HOLD_TIME = 1400;
  const PAUSE_BEFORE_TYPE = 300;

  let wordIndex = 0;

  function typeWord() {
    const word = loopWords[wordIndex];
    let charIndex = 0;
    (function typeChar() {
      charIndex++;
      wordSpan.textContent = word.slice(0, charIndex);
      if (charIndex < word.length) {
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        setTimeout(deleteWord, HOLD_TIME);
      }
    })();
  }

  function deleteWord() {
    const word = wordSpan.textContent;
    let charIndex = word.length;
    (function deleteChar() {
      charIndex--;
      wordSpan.textContent = word.slice(0, charIndex);
      if (charIndex > 0) {
        setTimeout(deleteChar, DELETE_SPEED);
      } else {
        wordIndex = (wordIndex + 1) % loopWords.length;
        setTimeout(typeWord, PAUSE_BEFORE_TYPE);
      }
    })();
  }

  typeWord();
}

function renderHome(data) {
  if (!data) return;
  const heading = document.querySelector('[data-field="hero_heading"]');
  const subtitle = document.querySelector('[data-field="hero_subtitle"]');
  const heroImg = document.querySelector('[data-field="hero_image"]');
  const stats1 = document.querySelector('[data-field="stats_line1"]');
  const stats2 = document.querySelector('[data-field="stats_line2"]');
  const stats3 = document.querySelector('[data-field="stats_line3"]');
  const featureGrid = document.querySelector('[data-field="features"]');

  if (heading) heading.textContent = data.hero_heading;
  if (subtitle) applyTypewriter(subtitle, data.hero_subtitle);
  if (heroImg) heroImg.src = data.hero_image;
  if (stats1) {
    stats1.innerHTML = '';
    stats1.appendChild(el('strong', {}, [document.createTextNode(data.stats_line1_bold)]));
    stats1.appendChild(document.createTextNode(' ' + data.stats_line1_rest));
  }
  if (stats2) stats2.textContent = data.stats_line2;
  if (stats3) stats3.textContent = data.stats_line3;

  if (featureGrid && Array.isArray(data.features)) {
    featureGrid.innerHTML = '';
    data.features.forEach((f) => {
      featureGrid.appendChild(
        el('div', { class: 'feature-card' }, [
          el('h3', {}, [document.createTextNode(f.title)]),
          el('p', {}, [document.createTextNode(f.description)]),
        ])
      );
    });
  }
}

function renderSolutions(data) {
  if (!data) return;
  const heading = document.querySelector('[data-field="hero_heading"]');
  const lead1 = document.querySelector('[data-field="hero_lead1"]');
  const lead2 = document.querySelector('[data-field="hero_lead2"]');
  const list = document.querySelector('[data-field="solutions"]');
  const consultingIntro = document.querySelector('[data-field="consulting_intro"]');
  const consultingExperience = document.querySelector('[data-field="consulting_experience"]');
  const consultingOfferIntro = document.querySelector('[data-field="consulting_offer_intro"]');
  const consultingOffers = document.querySelector('[data-field="consulting_offers"]');

  if (heading) heading.textContent = data.hero_heading;
  if (lead1) lead1.textContent = data.hero_lead1;
  if (lead2) {
    lead2.innerHTML = '';
    lead2.appendChild(el('strong', {}, [document.createTextNode(data.hero_lead2_bold)]));
    lead2.appendChild(document.createTextNode(' ' + data.hero_lead2_rest));
  }

  if (list && Array.isArray(data.solutions)) {
    list.innerHTML = '';
    data.solutions.forEach((s) => {
      list.appendChild(
        el('div', { class: 'solution-block' }, [
          el('div', {}, [
            el('h3', {}, [document.createTextNode(s.title)]),
            el('p', {}, [document.createTextNode(s.description)]),
          ]),
          el('div', {}, [
            el('a', { href: 'pricing.html#demo', class: 'btn btn-primary js-book-demo' }, [
              document.createTextNode(s.cta_label || 'Schedule a demo'),
            ]),
          ]),
        ])
      );
    });
  }

  if (consultingIntro) consultingIntro.textContent = data.consulting_intro;
  if (consultingExperience && Array.isArray(data.consulting_experience)) {
    consultingExperience.innerHTML = '';
    data.consulting_experience.forEach((item) => {
      consultingExperience.appendChild(el('li', {}, [document.createTextNode(item)]));
    });
  }
  if (consultingOfferIntro) consultingOfferIntro.textContent = data.consulting_offer_intro;
  if (consultingOffers && Array.isArray(data.consulting_offers)) {
    consultingOffers.innerHTML = '';
    data.consulting_offers.forEach((item) => {
      consultingOffers.appendChild(el('li', {}, [document.createTextNode(item)]));
    });
  }
}

function renderSecurity(data) {
  if (!data) return;
  const heading = document.querySelector('[data-field="hero_heading"]');
  const lead = document.querySelector('[data-field="hero_lead"]');
  const featureGrid = document.querySelector('[data-field="feature_cards"]');
  const privacyText = document.querySelector('[data-field="privacy_text"]');
  const networkGrid = document.querySelector('[data-field="network_cards"]');

  if (heading) heading.textContent = data.hero_heading;
  if (lead) lead.textContent = data.hero_lead;

  if (featureGrid && Array.isArray(data.feature_cards)) {
    featureGrid.innerHTML = '';
    data.feature_cards.forEach((c) => {
      featureGrid.appendChild(
        el('div', { class: 'feature-card' }, [
          el('img', { src: c.icon, alt: '' }),
          el('h3', {}, [document.createTextNode(c.title)]),
          el('p', {}, [document.createTextNode(c.description)]),
        ])
      );
    });
  }

  if (privacyText) privacyText.textContent = data.privacy_text;

  if (networkGrid && Array.isArray(data.network_cards)) {
    networkGrid.innerHTML = '';
    data.network_cards.forEach((c) => {
      networkGrid.appendChild(
        el('div', { class: 'feature-card' }, [
          el('img', { src: c.icon, alt: '' }),
          el('h3', {}, [document.createTextNode(c.title)]),
          el('p', {}, [document.createTextNode(c.description)]),
        ])
      );
    });
  }
}

function renderPricing(data) {
  if (!data) return;
  const introHeading = document.querySelector('[data-field="intro_heading"]');
  const introText = document.querySelector('[data-field="intro_text"]');
  const stepsHeading = document.querySelector('[data-field="steps_heading"]');
  const noteText = document.querySelector('[data-field="note_text"]');
  const grid = document.querySelector('[data-field="plans"]');

  if (introHeading) introHeading.textContent = data.intro_heading;
  if (introText) introText.textContent = data.intro_text;
  if (stepsHeading) stepsHeading.textContent = data.steps_heading;
  if (noteText) noteText.textContent = data.note_text;

  if (grid && Array.isArray(data.plans)) {
    grid.innerHTML = '';
    data.plans.forEach((plan) => {
      const priceTagChildren = [el('span', { class: 'dollar' }, [document.createTextNode('$')])];
      if (plan.price !== null && plan.price !== undefined) {
        priceTagChildren.push(el('span', { class: 'amount' }, [document.createTextNode(String(plan.price))]));
      }
      priceTagChildren.push(el('span', { class: 'period' }, [document.createTextNode(plan.period)]));

      const ul = el('ul', {}, (plan.features || []).map((f) => el('li', {}, [document.createTextNode(f)])));
      if (plan.total_value) {
        ul.appendChild(el('li', { class: 'total' }, [document.createTextNode(plan.total_value)]));
      }

      const cardChildren = [
        el('h3', {}, [document.createTextNode(plan.title)]),
        el('div', { class: 'price-tag' }, priceTagChildren),
        ul,
        el('a', { href: 'pricing.html#demo', class: 'btn btn-primary js-book-demo' }, [
          document.createTextNode(plan.cta_label || 'Book a demo'),
        ]),
      ];
      if (plan.disclaimer) {
        cardChildren.push(el('p', { class: 'disclaimer' }, [document.createTextNode(plan.disclaimer)]));
      }

      grid.appendChild(el('div', { class: 'price-card' }, cardChildren));
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await fetchJSON('content/settings.json');
  applySettings(settings);

  const page = document.body.getAttribute('data-page');
  if (page === 'home') renderHome(await fetchJSON('content/home.json'));
  if (page === 'solutions') renderSolutions(await fetchJSON('content/solutions.json'));
  if (page === 'security') renderSecurity(await fetchJSON('content/security.json'));
  if (page === 'pricing') renderPricing(await fetchJSON('content/pricing.json'));

  // Re-apply booking URL / accordion bindings after dynamic content is injected
  document.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', () => {
      header.closest('.accordion-item').classList.toggle('open');
    });
  });
});
