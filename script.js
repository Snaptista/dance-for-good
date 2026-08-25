/* =====================================================
   DANCE FOR QOOD – Main JavaScript
   ===================================================== */

// ======================== NAVBAR ========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ======================== MOBILE NAV ========================
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ======================== COUNTDOWN ========================
const EVENT_DATE = new Date('2026-09-19T19:00:00');
function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) { document.getElementById('countdown')?.remove(); return; }
  const days  = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const mins  = Math.floor((diff % 36e5)  / 6e4);
  const secs  = Math.floor((diff % 6e4)   / 1e3);
  document.getElementById('cd-days').textContent  = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}
tick();
setInterval(tick, 1000);

// ======================== WAVE CANVAS ========================
(function initWaves() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N = 20;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const t       = i / N;
      const baseY   = H * (0.15 + t * 0.8);
      const amp     = 10 + i * 2.8;
      const freq    = 0.0045 - i * 0.00006;
      const phase   = t * Math.PI * 2.6;
      const opacity = 0.72 - t * 0.56;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(201,168,76,${opacity.toFixed(2)})`;
      ctx.lineWidth   = 0.8;
      for (let x = 0; x <= W; x += 3) {
        const y = baseY + amp * Math.sin(x * freq + phase);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  window.addEventListener('resize', () => { resize(); draw(); }, { passive: true });
  resize(); draw();
})();

// ======================== FOOTER WAVES ========================
(function initFooterWaves() {
  const container = document.getElementById('footerWaves');
  if (!container) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1440 200');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.cssText = 'width:100%;height:100%;';
  for (let i = 0; i < 18; i++) {
    const path  = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const baseY = 30 + i * 10;
    const amp   = 18 + i * 1.8;
    const freq  = 0.0038 - i * 0.00005;
    const phase = (i / 18) * Math.PI * 2;
    let d = '';
    for (let x = 0; x <= 1440; x += 8) {
      const y = baseY + amp * Math.sin(x * freq + phase);
      d += (x === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }
    path.setAttribute('d', d);
    path.setAttribute('stroke', `rgba(201,168,76,${(0.55 - i * 0.025).toFixed(2)})`);
    path.setAttribute('stroke-width', '0.8');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
  }
  container.appendChild(svg);
})();

// ======================== EVENT (CAFÉ FRANÇAIS) SLIDER ========================
(function initEventSlider() {
  const slider  = document.getElementById('eventSlider');
  if (!slider) return;
  const slides  = slider.querySelectorAll('.event-slide');
  const prevBtn = document.getElementById('evPrev');
  const nextBtn = document.getElementById('evNext');
  const dotEls  = document.querySelectorAll('#evDots .ev-dot');
  const total   = slides.length;
  let current   = 0;

  function goTo(idx) {
    current = (idx + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dotEls.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.i)));

  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1);
  });

  goTo(0);
})();

// ======================== LOCATION SLIDER ========================
(function initLocationSlider() {
  const slider = document.getElementById('locationSlider');
  if (!slider) return;

  const slides    = slider.querySelectorAll('.location-slide');
  const dots      = document.querySelectorAll('#locDots .dot');
  const prevBtn   = document.getElementById('locPrev');
  const nextBtn   = document.getElementById('locNext');
  const total     = slides.length;
  let current     = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  prevBtn?.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn?.addEventListener('click', () => { next(); startAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.i); startAuto(); });
  });

  // Swipe support
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAuto(); }
  });

  goTo(0);
  startAuto();
})();

// ======================== SCROLL REVEAL ========================
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
    const delay    = siblings.indexOf(entry.target) * 80;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ======================== SMOOTH SCROLL ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target && href !== '#') {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ======================== GALLERY PAUSE ON HOVER ========================
document.querySelectorAll('.gallery-strip').forEach(strip => {
  strip.addEventListener('mouseenter', () => strip.style.animationPlayState = 'paused');
  strip.addEventListener('mouseleave', () => strip.style.animationPlayState = 'running');
});

// ======================== MODALS ========================
function openModal(id) {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
  if (id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') openModal(null);
});

// ======================== I18N ========================
const TRANSLATIONS = {
  de: {
    'nav.event':             'Event',
    'nav.last-event':        'Letztes Event',
    'nav.tickets':           'Tickets',
    'hero.label':            'CHARITY MUSIC EVENT · WIEN',
    'hero.cd.days':          'TAGE',
    'hero.cd.hours':         'STD',
    'hero.cd.mins':          'MIN',
    'hero.cd.secs':          'SEK',
    'hero.cta.lineup':       'Line-Up entdecken',
    'hero.cta.tickets':      'Tickets sichern',
    'hero.cta.download':     'Flyer herunterladen',
    'hero.scroll':           'Scroll',
    'about.label':           'ÜBER DAS EVENT',
    'about.p1':              'Dance for Good ist mehr als ein Musik-Event – es ist eine Nacht, die verbindet, bewegt und Gutes bewirkt. Im Herzen Wiens, hoch über den Dächern der Stadt, bringen wir Musik, Gemeinschaft und einen guten Zweck zusammen.',
    'about.p2':              'Am <strong>19. September 2026</strong> öffnet die <strong>Altia Skybar</strong> im 58. Stock des Meliã Vienna ihre Türen für einen unvergesslichen Abend mit außergewöhnlichem Line-Up und einer klaren Mission.',
    'about.detail.date':     '19. September 2026',
    'about.detail.time':     '19:00 – 03:00 Uhr',
    'about.charity.h3':      'Österreichische<br>Kinderkrebshilfe',
    'about.charity.p':       'Der Reinerlös dieses Abends fließt direkt in die Unterstützung krebskranker Kinder und ihrer Familien in Österreich.',
    'about.charity.badge1':  'DER REINERLÖS GEHT AN THE',
    'lineup.h2':             'Die Artists',
    'lineup.headliner':      'Headliner',
    'dj.mahoo.bio':          'Bitte durch die echte Biografie von MAHOO (CH) ersetzen.',
    'dj.vinorate.bio':       'Bitte durch die echte Biografie von VINORATE ersetzen.',
    'dj.khealo.bio':         'Bitte durch die echte Biografie von KHEALO ersetzen.',
    'dj.ardmos.bio':         'Bitte durch die echte Biografie von ARDMOS ersetzen.',
    'dj.fylo.bio':           'Bitte durch die echte Biografie von FYLO ersetzen.',
    'dj.tba.bio':            'Weitere Artists werden in Kürze bekannt gegeben.',
    'location.h2':           'Die Location',
    'location.sub':          'Altia by Urrechu · Meliã Vienna, 58. Stock',
    'location.tagline':      'Restaurant & Skybar · 58. Stock',
    'location.p':            'Im Herzen Wiens, hoch oben im <strong>DC Tower</strong> – thront die Altia Skybar im 58. Stock des Meliã Vienna. Als <strong>höchste Rooftop Bar auf dem europäischen Festland</strong> bietet sie einen unvergleichlichen 360°-Panoramablick über die Donaustadt und die perfekte Bühne für Dance For Good.',
    'location.fact1':        'Stockwerke',
    'location.fact2':        'Höhe',
    'location.fact3':        'Panorama',
    'sponsors.h2':           'Unsere Partner',
    'sponsors.tier.main':    'HAUPTSPONSOREN',
    'sponsors.tier.gold':    'GOLD SPONSOREN',
    'sponsors.tier.logo':    'LOGO SPONSOREN',
    'last-event.label':      'LETZTES EVENT',
    'last-event.sub':        'Powered by Dance For Good · Wien',
    'last-event.btn':        'Zum Event auf Resident Advisor',
    'footer.kkh.text':       'DER REINERLÖS GEHT AN THE',
    'footer.kkh.sub':        'Österreichische Kinderkrebshilfe',
    'footer.kkh.btn':        'Zur Organisation',
    'footer.nav.contact':    'Kontakt',
    'footer.nav.impressum':  'Impressum',
    'footer.nav.privacy':    'Datenschutz',
    'footer.copy':           '© 2026 Dance For Good. Alle Rechte vorbehalten.',
  },
  en: {
    'nav.event':             'Event',
    'nav.last-event':        'Last Event',
    'nav.tickets':           'Tickets',
    'hero.label':            'CHARITY MUSIC EVENT · VIENNA',
    'hero.cd.days':          'DAYS',
    'hero.cd.hours':         'HRS',
    'hero.cd.mins':          'MIN',
    'hero.cd.secs':          'SEC',
    'hero.cta.lineup':       'Explore Line-Up',
    'hero.cta.tickets':      'Get Tickets',
    'hero.cta.download':     'Download Flyer',
    'hero.scroll':           'Scroll',
    'about.label':           'ABOUT THE EVENT',
    'about.p1':              'Dance for Good is more than a music event – it is a night that connects, moves, and makes a difference. In the heart of Vienna, high above the city\'s rooftops, we bring together music, community, and a great cause.',
    'about.p2':              'On <strong>19 September 2026</strong>, the <strong>Altia Skybar</strong> on the 58th floor of Meliã Vienna opens its doors for an unforgettable evening with an extraordinary line-up and a clear mission.',
    'about.detail.date':     '19 September 2026',
    'about.detail.time':     '7PM – 3AM',
    'about.charity.h3':      'Austrian Children\'s<br>Cancer Aid',
    'about.charity.p':       'All proceeds from this evening flow directly into supporting children with cancer and their families in Austria.',
    'about.charity.badge1':  'ALL PROCEEDS GO TO THE',
    'lineup.h2':             'The Artists',
    'lineup.headliner':      'Headliner',
    'dj.mahoo.bio':          'Please replace with the real biography of MAHOO (CH).',
    'dj.vinorate.bio':       'Please replace with the real biography of VINORATE.',
    'dj.khealo.bio':         'Please replace with the real biography of KHEALO.',
    'dj.ardmos.bio':         'Please replace with the real biography of ARDMOS.',
    'dj.fylo.bio':           'Please replace with the real biography of FYLO.',
    'dj.tba.bio':            'More artists will be announced soon.',
    'location.h2':           'The Venue',
    'location.sub':          'Altia by Urrechu · Meliã Vienna, 58th Floor',
    'location.tagline':      'Restaurant & Skybar · 58th Floor',
    'location.p':            'In the heart of Vienna, high above the city inside the <strong>DC Tower</strong> – the Altia Skybar sits on the 58th floor of Meliã Vienna. As <strong>the highest rooftop bar on the European mainland</strong>, it offers a breathtaking 360° panoramic view over the Danube city and the perfect stage for Dance For Good.',
    'location.fact1':        'Floors',
    'location.fact2':        'Height',
    'location.fact3':        'Panorama',
    'sponsors.h2':           'Our Partners',
    'sponsors.tier.main':    'MAIN SPONSORS',
    'sponsors.tier.gold':    'GOLD SPONSORS',
    'sponsors.tier.logo':    'LOGO SPONSORS',
    'last-event.label':      'LAST EVENT',
    'last-event.sub':        'Powered by Dance For Good · Vienna',
    'last-event.btn':        'View Event on Resident Advisor',
    'footer.kkh.text':       'ALL PROCEEDS GO TO THE',
    'footer.kkh.sub':        'Austrian Children\'s Cancer Aid',
    'footer.kkh.btn':        'Visit Organisation',
    'footer.nav.contact':    'Contact',
    'footer.nav.impressum':  'Imprint',
    'footer.nav.privacy':    'Privacy',
    'footer.copy':           '© 2026 Dance For Good. All rights reserved.',
  }
};

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (TRANSLATIONS[lang][key] !== undefined) el.textContent = TRANSLATIONS[lang][key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (TRANSLATIONS[lang][key] !== undefined) el.innerHTML = TRANSLATIONS[lang][key];
  });
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.getElementById('langCurrent').textContent = lang.toUpperCase();
  localStorage.setItem('dfq-lang', lang);
}

// Language switcher toggle
const langBtn  = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');

langBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = langMenu.classList.toggle('open');
  langBtn.setAttribute('aria-expanded', open);
});

document.addEventListener('click', () => {
  langMenu?.classList.remove('open');
  langBtn?.setAttribute('aria-expanded', 'false');
});

langMenu?.addEventListener('click', e => {
  const btn = e.target.closest('.lang-option');
  if (btn) { setLang(btn.dataset.lang); langMenu.classList.remove('open'); langBtn.setAttribute('aria-expanded', 'false'); }
});

// Init language from localStorage or browser default
setLang(localStorage.getItem('dfq-lang') || (navigator.language.startsWith('en') ? 'en' : 'de'));
