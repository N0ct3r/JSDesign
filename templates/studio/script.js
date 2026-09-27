/* ============================================================================
   FILE: script.js  |  WEBSITE INTERACTIONS
   ============================================================================ */

/* Open project photos in a simple lightbox. */
const lightbox = document.querySelector('#lightbox');
const largeImage = document.querySelector('#largeImage');

document.querySelectorAll('.project[data-image]').forEach((project) => {
  project.addEventListener('click', () => {
    largeImage.src = project.dataset.image;
    lightbox.classList.add('open');
  });
});

if (lightbox) {
  const closeLightbox = () => lightbox.classList.remove('open');
  document.querySelector('#close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}

/* Send a pre-filled email enquiry from the contact page. */
const form = document.querySelector('#contactForm');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(data.project);
    const body = encodeURIComponent(`${data.name}\n${data.email}\n\n${data.message}`);
    window.location.href = `mailto:hello@northlinebuild.cz?subject=${subject}&body=${body}`;
    document.querySelector('#status').textContent = 'Your email app is opening with the enquiry ready to send.';
  });
}