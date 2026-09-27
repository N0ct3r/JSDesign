/* ============================================================================
   FILE: script.js  |  WEBSITE INTERACTIONS
   ============================================================================ */

/* Reveal content as it reaches the viewport. */
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }),
  { threshold: 0.12 },
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

/* Add a subtle pointer pull to booking actions. */
document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
  element.addEventListener('pointerleave', () => { element.style.transform = ''; });
});

/* Duplicate ticker content before animation for a seamless loop. */
const tickerTrack = document.querySelector('.ticker div');
tickerTrack.innerHTML += tickerTrack.innerHTML;

/* Open work images in an accessible lightbox. */
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const closeLightbox = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); };

document.querySelectorAll('.shot[data-image]').forEach((shot) => {
  const openLightbox = () => { lightboxImage.src = shot.dataset.image; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); };
  shot.addEventListener('click', openLightbox);
  shot.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(); } });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });