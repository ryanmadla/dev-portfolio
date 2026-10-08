const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

function applyTheme(theme) {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('class', 'button-icon');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.6');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');
  const label = document.createElement('span');
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    icon.innerHTML = '<circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />';
    label.textContent = 'LIGHT';
    toggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    root.removeAttribute('data-theme');
    icon.innerHTML = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />';
    label.textContent = 'DARK';
    toggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  toggle.replaceChildren(icon, label);
}

applyTheme(initialTheme);

toggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  applyTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalSummary = document.getElementById('modalSummary');
const modalTech = document.getElementById('modalTech');
const modalContributions = document.getElementById('modalContributions');
const modalOutcome = document.getElementById('modalOutcome');
const galleryCaption = document.getElementById('galleryCaption');
const grid = document.getElementById('portfolioGrid');
const status = document.getElementById('projectStatus');
const gallery = document.getElementById('modalGallery');
const galleryNavigation = document.getElementById('galleryNavigation');
const galleryCounter = document.getElementById('galleryCounter');
const galleryPrevious = document.getElementById('galleryPrevious');
const galleryNext = document.getElementById('galleryNext');
const closeTargets = document.querySelectorAll('[data-close-modal]');

let lastFocusedCard = null;
let activeMedia = [];
let activeMediaIndex = 0;

function showMedia(index) {
  gallery.querySelectorAll('video').forEach(video => video.pause());
  if (!activeMedia.length) {
    gallery.replaceChildren();
    galleryCounter.textContent = '';
    galleryCaption.textContent = '';
    galleryNavigation.hidden = true;
    return;
  }
  activeMediaIndex = (index + activeMedia.length) % activeMedia.length;
  const media = createMedia(activeMedia[activeMediaIndex], 'gallery-media');
  if (media.tagName === 'IMG') media.loading = 'eager';
  gallery.replaceChildren(media);
  galleryCaption.textContent = activeMedia[activeMediaIndex].caption || activeMedia[activeMediaIndex].alt;
  galleryCounter.textContent = `${activeMediaIndex + 1} / ${activeMedia.length}`;
  galleryNavigation.hidden = activeMedia.length < 2;
}

galleryPrevious.addEventListener('click', () => showMedia(activeMediaIndex - 1));
galleryNext.addEventListener('click', () => showMedia(activeMediaIndex + 1));

function openModal(card, project) {
  lastFocusedCard = card;
  modalTitle.textContent = project.title;
  modalSummary.textContent = project.summary;
  modalTech.replaceChildren(...createTags(project.tech));
  modalContributions.replaceChildren(...(project.contributions || []).map(contribution => {
    const item = document.createElement('li');
    item.textContent = contribution;
    return item;
  }));
  modalContributions.parentElement.hidden = !project.contributions?.length;
  modalOutcome.textContent = project.outcome || '';
  modalOutcome.parentElement.hidden = !project.outcome;
  activeMedia = project.media;
  showMedia(0);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  gallery.querySelectorAll('video').forEach(video => video.pause());
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
}

function createMedia(media, className) {
  const element = document.createElement(media.type === 'video' ? 'video' : 'img');
  element.className = className;
  element.src = media.src;
  if (media.type === 'video') {
    element.controls = true;
    element.playsInline = true;
    element.preload = 'metadata';
    element.setAttribute('aria-label', media.alt);
    if (media.poster) element.poster = media.poster;
    const fallback = document.createElement('a');
    fallback.href = media.src;
    fallback.textContent = 'Download demo video';
    element.append(fallback);
  } else {
    element.alt = media.alt;
    element.loading = 'lazy';
    element.decoding = 'async';
  }
  return element;
}

function createTags(technologies) {
  return technologies.map(technology => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = technology;
    return tag;
  });
}

function createCard(project, index) {
  const card = document.createElement('article');
  card.className = 'project-card';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'project-open';
  button.setAttribute('aria-label', `View ${project.title} project details`);
  button.setAttribute('aria-haspopup', 'dialog');
  const title = document.createElement('h3');
  title.textContent = project.title;
  const cover = createMedia(project.cover, 'project-cover');
  if (index < 3) cover.loading = 'eager';
  button.append(cover, title);
  button.addEventListener('click', () => openModal(button, project));
  const summary = document.createElement('p');
  summary.textContent = project.summary;
  const tags = document.createElement('div');
  tags.className = 'tags';
  tags.append(...createTags(project.tech));
  card.append(button, summary, tags);
  return card;
}

async function readProjectData() {
  if (window.location.protocol === 'file:') {
    // Local files cannot fetch JSON. Use the generated copy for this preview.
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'projects-data.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Unable to load local project data'));
      document.head.append(script);
    });
    return window.portfolioProjectData;
  }
  const response = await fetch('projects.json');
  if (!response.ok) throw new Error(`Projects request failed: ${response.status}`);
  return response.json();
}

async function loadProjects() {
  try {
    const data = await readProjectData();
    if (!Array.isArray(data.projects)) throw new Error('Invalid projects data');
    grid.replaceChildren(...data.projects.map(createCard));
    status.textContent = data.projects.length ? '' : 'No projects to display yet.';
    status.hidden = data.projects.length > 0;
  } catch (error) {
    status.textContent = 'Projects could not be loaded. Please refresh to try again.';
    console.error('Unable to load portfolio projects:', error);
  } finally {
    grid.setAttribute('aria-busy', 'false');
  }
}

loadProjects();

closeTargets.forEach(target => {
  target.addEventListener('click', closeModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
  if (modal.classList.contains('is-open') && activeMedia.length > 1 &&
      !(event.target instanceof Element &&
        event.target.closest('video, input, textarea, select, [contenteditable]'))) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showMedia(activeMediaIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  }
  if (event.key === 'Tab' && modal.classList.contains('is-open')) {
    const controls = [...modal.querySelectorAll('button:not([disabled]), video[controls], a[href]')]
      .filter(control => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
