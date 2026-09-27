/* ============================================================================
   FILE: script.js  |  WEBSITE INTERACTIONS
   ============================================================================ */

/* Reveal sections as they enter the viewport. */
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }),
  { threshold: 0.12 },
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

/* Open training photos at a larger size. */
const lightbox = document.querySelector('#lightbox');
const largeImage = document.querySelector('#largeImage');
document.querySelectorAll('.photo[data-image]').forEach((photo) => {
  photo.addEventListener('click', () => {
    largeImage.src = photo.dataset.image;
    lightbox.classList.add('open');
  });
});
document.querySelector('#close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.classList.remove('open'); });

/* Price buttons preselect the relevant coaching option in the form. */
const contactSection = document.querySelector('#contact');
const goalSelect = document.querySelector('select[name="goal"]');
document.querySelectorAll('[data-plan]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    goalSelect.value = button.dataset.plan;
    document.querySelectorAll('[data-plan]').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    contactSection.classList.remove('flash');
    requestAnimationFrame(() => contactSection.classList.add('flash'));
  });
});

/* Contact form opens a completed email enquiry. */
const form = document.querySelector('#contactForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  window.location.href = `mailto:hello@movebetter.co?subject=${encodeURIComponent(data.goal)}&body=${encodeURIComponent(`${data.name}\n${data.email}`)}`;
  document.querySelector('#status').textContent = 'Your email app is opening with your enquiry ready to send.';
});