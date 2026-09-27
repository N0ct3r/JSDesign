/* ============================================================================
   FILE: script.js  |  WEBSITE INTERACTIONS
   ============================================================================ */

/* Navigation */
const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.menu');
const primaryNavigation = document.querySelector('#site-navigation');

/* Mobile navigation: a compact, keyboard-accessible menu on small screens. */
function setMobileNavigation(open) {
  if (!menuButton || !primaryNavigation) return;

  nav.classList.toggle('is-menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute(
    'aria-label',
    open
      ? document.documentElement.lang === 'cs' ? 'Zavřít navigaci' : 'Close navigation'
      : document.documentElement.lang === 'cs' ? 'Otevřít navigaci' : 'Open navigation',
  );
}

menuButton?.addEventListener('click', () => {
  setMobileNavigation(!nav.classList.contains('is-menu-open'));
});

primaryNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileNavigation(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileNavigation(false);
});

document.addEventListener('pointerdown', (event) => {
  if (nav.classList.contains('is-menu-open') && !nav.contains(event.target)) {
    setMobileNavigation(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 800) setMobileNavigation(false);
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 18);
});

/* Reveal sections when they enter the viewport */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});
/* Replay title motion each time a title block comes back into view */
const titleReplayObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('title-in-view', entry.isIntersecting);
    });
  },
  { threshold: 0.3 },
);

document
  .querySelectorAll('.hero-copy.reveal, .heading.reveal, .process-copy.reveal, .contact-inner.reveal')
  .forEach((element) => titleReplayObserver.observe(element));
/* Replay the personal About section as it enters the viewport. */
const aboutReplayObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      document
        .querySelectorAll('#about .about-copy, #about .about-photos')
        .forEach((element) => element.classList.toggle('about-in-view', entry.isIntersecting));
    });
  },
  { threshold: 0.24 },
);

const aboutSection = document.querySelector('#about');
if (aboutSection) aboutReplayObserver.observe(aboutSection);

/* Replay the Section 03 service cards whenever the section is in focus. */
const servicesReplayObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('services-in-view', entry.isIntersecting);
    });
  },
  { threshold: 0.42 },
);

const servicesSection = document.querySelector('#services');
if (servicesSection) servicesReplayObserver.observe(servicesSection);

/* Interactive template-card tilt */
document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

/* 3D motion for the hero browser mock-up */
const heroVisual = document.querySelector('.hero-visual');
const browserPreview = document.querySelector('.browser');

heroVisual.addEventListener('pointermove', (event) => {
  const bounds = heroVisual.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  browserPreview.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -8}deg)`;
});

heroVisual.addEventListener('pointerleave', () => {
  browserPreview.style.transform = 'rotateY(-7deg) rotateX(4deg)';
});

/* Gentle pull toward the pointer for key links and buttons */
document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
  element.addEventListener('pointerleave', () => {
    element.style.transform = '';
  });
});

/* Contact form: submit through Web3Forms without opening an email app */
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const sendButton = contactForm.querySelector('.send-button');
const defaultButtonContent = sendButton.innerHTML;
const isCzechPage = document.documentElement.lang === 'cs';
const formCopy = isCzechPage
  ? {
      subject: 'Nová poptávka na web od',
      sendingButton: 'Odesílám…',
      sendingStatus: 'Odesílám vaši poptávku…',
      sentButton: 'Zpráva odeslána <b>✓</b>',
      sentStatus: 'Děkuji — vaše poptávka byla odeslána.',
      errorStatus: 'Něco se nepovedlo. Zkuste to prosím znovu nebo mi napište přímo e-mail.',
    }
  : {
      subject: 'New website enquiry from',
      sendingButton: 'Sending…',
      sendingStatus: 'Sending your enquiry…',
      sentButton: 'Message sent <b>✓</b>',
      sentStatus: 'Thank you — your enquiry has been sent.',
      errorStatus: 'Something went wrong. Please try again or email me directly.',
    };

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  formData.append('access_key', 'cee61aaa-47d2-49f0-b31b-de470c3f7518');
  formData.append('subject', `${formCopy.subject} ${formData.get('name')}`);
  formData.append('from_name', 'Your Web Studio');

  sendButton.disabled = true;
  sendButton.innerHTML = formCopy.sendingButton;
  formStatus.textContent = formCopy.sendingStatus;
  formStatus.classList.remove('is-error');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send the enquiry.');
    }

    contactForm.reset();
    sendButton.innerHTML = formCopy.sentButton;
    formStatus.textContent = formCopy.sentStatus;
  } catch (error) {
    sendButton.innerHTML = defaultButtonContent;
    formStatus.textContent = formCopy.errorStatus;
    formStatus.classList.add('is-error');
  } finally {
    sendButton.disabled = false;
  }
});
/* ============================================================================
   SECTION SCROLL SETTLING
   A slower, gentle glide after desktop scrolling pauses.
============================================================================ */
const sectionScrollTargets = Array.from(
  document.querySelectorAll('.hero, .section, .contact'),
);
const sectionScrollMedia = window.matchMedia(
  '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
);
let sectionSettleTimer;
let sectionSettleFrame;
let isSectionSettling = false;
let pendingSectionTarget;
let sectionScrollOrigin;
let scrollDirection = 0;
let lastWheelScrollTime = 0;
let sectionScrollPauseUntil = 0;

function getActiveSectionTargets() {
  const openPricingDetails = document.querySelector('.pricing-explorer[open]');

  if (!openPricingDetails) return sectionScrollTargets;

  return [...sectionScrollTargets, openPricingDetails]
    .sort((first, second) => first.offsetTop - second.offsetTop);
}

function getClosestSectionTarget() {
  const scrollPosition = window.scrollY + 82;
  const targets = getActiveSectionTargets();

  return targets.reduce((closest, section) => {
    const closestDistance = Math.abs(closest.offsetTop - scrollPosition);
    const sectionDistance = Math.abs(section.offsetTop - scrollPosition);
    return sectionDistance < closestDistance ? section : closest;
  });
}

function getAdjacentSectionTarget(originSection, direction) {
  const targets = getActiveSectionTargets();
  const currentIndex = targets.indexOf(originSection);
  const nextIndex = Math.max(
    0,
    Math.min(targets.length - 1, currentIndex + direction),
  );

  return targets[nextIndex];
}

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2;
}

function getSectionSettlePosition(targetSection) {
  const sectionTopPadding = targetSection.id === 'about'
    ? 195
    : targetSection.id === 'templates'
      ? 42
      : 82;

  // getBoundingClientRect accounts for nested, positioned elements such as the
  // expandable pricing guide. offsetTop alone would incorrectly point near 0.
  const documentTop = targetSection.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, documentTop - sectionTopPadding);
}
function smoothlySettleOnSection(targetSection, onComplete) {
  if (!sectionScrollMedia.matches || isSectionSettling || !targetSection) return;
  const targetPosition = getSectionSettlePosition(targetSection);
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;

  if (Math.abs(distance) < 24) {
    onComplete?.();
    return;
  }

  const duration = 500;
  const startTime = performance.now();
  isSectionSettling = true;
  document.documentElement.classList.add('is-section-settling');

  function moveToSection(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

    if (progress < 1) {
      sectionSettleFrame = requestAnimationFrame(moveToSection);
      return;
    }

    isSectionSettling = false;
    scrollDirection = 0;
    document.documentElement.classList.remove('is-section-settling');
    onComplete?.();
  }

  sectionSettleFrame = requestAnimationFrame(moveToSection);
}

function scheduleSectionSettle() {
  if (
    !sectionScrollMedia.matches
    || isSectionSettling
    || performance.now() < sectionScrollPauseUntil
  ) return;

  window.clearTimeout(sectionSettleTimer);

  sectionSettleTimer = window.setTimeout(() => {
    // Pick the nearest destination only after the visitor has finished scrolling.
    // This lets a longer wheel, trackpad or scrollbar movement pass multiple sections.
    smoothlySettleOnSection(getClosestSectionTarget());
    pendingSectionTarget = undefined;
    sectionScrollOrigin = undefined;
    sectionSettleTimer = undefined;
    scrollDirection = 0;
  }, 300);
}

function stopSectionSettling() {
  if (!isSectionSettling) return;

  cancelAnimationFrame(sectionSettleFrame);
  isSectionSettling = false;
  document.documentElement.classList.remove('is-section-settling');
}

function registerScrollDirection(event) {
  stopSectionSettling();

  if (sectionScrollMedia.matches && Math.abs(event.deltaY) > 2) {
    scrollDirection = Math.sign(event.deltaY);
    lastWheelScrollTime = performance.now();
  }
}

window.addEventListener('scroll', scheduleSectionSettle, { passive: true });
window.addEventListener('wheel', registerScrollDirection, { passive: true });
window.addEventListener('touchstart', stopSectionSettling, { passive: true });
window.addEventListener('keydown', (event) => {
  const sectionKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];

  if (sectionKeys.includes(event.key)) {
    scrollDirection = 0;
    lastWheelScrollTime = 0;
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetSection = document.querySelector(link.getAttribute('href'));

    window.clearTimeout(sectionSettleTimer);
    pendingSectionTarget = undefined;
    sectionScrollOrigin = undefined;
    sectionSettleTimer = undefined;
    scrollDirection = 0;

    if (sectionScrollMedia.matches && targetSection) {
      event.preventDefault();
      sectionScrollPauseUntil = performance.now() + 700;
      smoothlySettleOnSection(targetSection);
      window.history.pushState(null, '', link.getAttribute('href'));
      return;
    }

    sectionScrollPauseUntil = performance.now() + 1200;
  });
});
/* ============================================================================
   PRICING PACKAGE DETAILS
   Keep the expanded price guide readable without section auto-settling.
============================================================================ */
const pricingDetails = document.querySelector('.pricing-explorer');
const pricingSection = document.querySelector('#pricing');

if (pricingDetails && pricingSection) {
  const pricingDetailsSummary = pricingDetails.querySelector('summary');

  pricingDetails.addEventListener('toggle', () => {
    window.clearTimeout(sectionSettleTimer);

    if (!pricingDetails.open || !sectionScrollMedia.matches) {
      sectionScrollPauseUntil = performance.now() + 700;
      return;
    }

    sectionScrollPauseUntil = performance.now() + 700;
    window.requestAnimationFrame(() => {
      smoothlySettleOnSection(pricingDetails);
    });
  });

  pricingDetailsSummary?.addEventListener('click', (event) => {
    if (!pricingDetails.open || !sectionScrollMedia.matches) return;

    event.preventDefault();
    stopSectionSettling();
    window.clearTimeout(sectionSettleTimer);
    sectionScrollPauseUntil = performance.now() + 900;
    pricingDetails.classList.add('is-closing');

    window.setTimeout(() => {
      smoothlySettleOnSection(pricingSection, () => {
        pricingDetails.open = false;
        pricingDetails.classList.remove('is-closing');
      });
    }, 180);
  });
}
