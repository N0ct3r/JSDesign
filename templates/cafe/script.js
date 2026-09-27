/* ============================================================================
   FILE: script.js  |  WEBSITE INTERACTIONS
   ============================================================================ */

/* Reveal elements as they enter the viewport */ const revealObserver = new IntersectionObserver(   (entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  revealObserver.unobserve(entry.target);
}
),   {
  threshold: 0.12
}
, );
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
/* Switch the displayed menu category */ const menuButtons = document.querySelectorAll('[data-menu]');
const menuPanels = document.querySelectorAll('[data-panel]');
menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    menuButtons.forEach((item) => item.classList.toggle('active', item === button));
    menuPanels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.panel !== button.dataset.menu));
  }
  );
}
);
/* Subtle magnetic movement for primary actions */ document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
    element.style.transform = `translate(${x}px, ${y}px)`;
  }
  );
  element.addEventListener('pointerleave', () => {
    element.style.transform = '';
  }
  );
}
);
