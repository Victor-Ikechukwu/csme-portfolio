const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const appreciationForm = document.querySelector('[data-appreciation-form]');
const mediaPreview = document.querySelector('[data-media-preview]');
const formStatus = document.querySelector('[data-form-status]');
const memoryGrid = document.querySelector('[data-memory-grid]');
const memoryLoading = document.querySelector('[data-memory-loading]');
const memoryEmpty = document.querySelector('[data-memory-empty]');
const memoryError = document.querySelector('[data-memory-error]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxMedia = document.querySelector('[data-lightbox-media]');
const lightboxTitle = document.querySelector('[data-lightbox-title]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
const mediaInputs = appreciationForm ? appreciationForm.querySelectorAll('[data-media-input]') : [];

const previewUrls = new Set();

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  links.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  });
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => activeObserver.observe(section));

const setFormStatus = (message = '', state = '') => {
  if (!formStatus) return;
  formStatus.textContent = message;
  if (state) {
    formStatus.dataset.state = state;
  } else {
    delete formStatus.dataset.state;
  }
};

const clearPreviewUrls = () => {
  previewUrls.forEach(url => URL.revokeObjectURL(url));
  previewUrls.clear();
};

const renderMediaPreview = () => {
  if (!mediaPreview) return;

  clearPreviewUrls();
  mediaPreview.innerHTML = '';

  const files = [];
  mediaInputs.forEach(input => {
    if (input.files && input.files[0]) {
      files.push(input.files[0]);
    }
  });

  files.forEach(file => {
    const previewCard = document.createElement('div');
    previewCard.className = 'preview-card';

    const objectUrl = URL.createObjectURL(file);
    previewUrls.add(objectUrl);

    if (file.type.startsWith('video/')) {
      const previewVideo = document.createElement('video');
      previewVideo.src = objectUrl;
      previewVideo.muted = true;
      previewVideo.playsInline = true;
      previewVideo.preload = 'metadata';
      previewCard.append(previewVideo);
    } else {
      const previewImage = document.createElement('img');
      previewImage.src = objectUrl;
      previewImage.alt = file.name;
      previewCard.append(previewImage);
    }

    const label = document.createElement('span');
    label.textContent = file.name;
    previewCard.append(label);

    mediaPreview.append(previewCard);
  });
};

mediaInputs.forEach(input => {
  input.addEventListener('change', renderMediaPreview);
});

const formatDate = isoDate => {
  if (!isoDate) return '';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const escapeText = value => (value || '').trim();

const setMemoryState = ({ loading = false, empty = false, error = '' } = {}) => {
  if (memoryLoading) memoryLoading.classList.toggle('hidden', !loading);
  if (memoryEmpty) memoryEmpty.classList.toggle('hidden', !empty);
  if (memoryError) {
    memoryError.textContent = error;
    memoryError.classList.toggle('hidden', !error);
  }
};

const createMediaButton = (item, title, author) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'memory-media-button';
  button.dataset.mediaKind = item.kind;

  if (item.kind === 'video') {
    const video = document.createElement('video');
    video.src = item.url;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    button.append(video);
  } else {
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = title || `Memory shared by ${author}`;
    button.append(image);
  }

  button.addEventListener('click', () => {
    openLightbox({
      ...item,
      title,
      caption: author
    });
  });

  return button;
};

const renderMemories = entries => {
  if (!memoryGrid) return;
  memoryGrid.innerHTML = '';

  if (!entries.length) {
    setMemoryState({ empty: true });
    return;
  }

  setMemoryState();

  entries.forEach(entry => {
    const card = document.createElement('article');
    card.className = 'memory-card';

    const header = document.createElement('div');
    header.className = 'memory-card-header';

    const headingWrap = document.createElement('div');
    const heading = document.createElement('h4');
    heading.textContent = escapeText(entry.headline) || 'Untitled appreciation';
    headingWrap.append(heading);

    const meta = document.createElement('div');
    meta.className = 'memory-meta';

    if (entry.relationship) {
      const relationship = document.createElement('span');
      relationship.className = 'memory-chip';
      relationship.textContent = entry.relationship;
      meta.append(relationship);
    }

    if (entry.batch) {
      const batch = document.createElement('span');
      batch.className = 'memory-chip';
      batch.textContent = entry.batch;
      meta.append(batch);
    }

    if (entry.memoryPlace) {
      const place = document.createElement('span');
      place.className = 'memory-chip';
      place.textContent = entry.memoryPlace;
      meta.append(place);
    }

    headingWrap.append(meta);

    const date = document.createElement('div');
    date.className = 'memory-date';
    date.textContent = formatDate(entry.createdAt);

    header.append(headingWrap, date);

    const author = document.createElement('div');
    author.className = 'memory-author';
    const authorName = document.createElement('strong');
    authorName.textContent = escapeText(entry.name) || 'Anonymous';
    author.append(authorName);

    const authorSubline = [entry.relationship, entry.batch].filter(Boolean).join(' • ');
    if (authorSubline) {
      const authorMeta = document.createElement('span');
      authorMeta.textContent = authorSubline;
      author.append(authorMeta);
    }

    const message = document.createElement('p');
    message.textContent = escapeText(entry.message) || 'No message provided.';

    card.append(header, author, message);

    if (entry.media.length) {
      const mediaGridEl = document.createElement('div');
      mediaGridEl.className = 'memory-media-grid';
      entry.media.forEach(item => {
        mediaGridEl.append(createMediaButton(item, entry.headline, entry.name));
      });
      card.append(mediaGridEl);
    } else {
      const emptyMedia = document.createElement('div');
      emptyMedia.className = 'memory-empty-media';
      emptyMedia.textContent = 'This memory was shared as a written testimony.';
      card.append(emptyMedia);
    }

    memoryGrid.append(card);
  });
};

const loadAppreciations = async () => {
  if (!memoryGrid) return;

  setMemoryState({ loading: true });

  try {
    const response = await fetch('/api/appreciations', {
      headers: {
        Accept: 'application/json'
      }
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || 'Unable to load appreciations right now.');
    }

    renderMemories(Array.isArray(payload.entries) ? payload.entries : []);
  } catch (error) {
    setMemoryState({
      error: error.message || 'The memory wall could not be loaded right now.'
    });
  }
};

const openLightbox = media => {
  if (!lightbox || !lightboxMedia || !lightboxTitle || !lightboxCaption) return;

  lightboxMedia.innerHTML = '';
  lightboxTitle.textContent = media.title || 'Memory media';
  lightboxCaption.textContent = media.caption || '';

  if (media.kind === 'video') {
    const video = document.createElement('video');
    video.src = media.url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    lightboxMedia.append(video);
  } else {
    const image = document.createElement('img');
    image.src = media.url;
    image.alt = media.title || 'Memory media';
    lightboxMedia.append(image);
  }

  lightbox.classList.remove('hidden');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox || !lightboxMedia) return;
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxMedia.innerHTML = '';
  document.body.style.overflow = '';
};

if (lightbox && lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}

if (appreciationForm) {
  appreciationForm.addEventListener('submit', async event => {
    event.preventDefault();
    setFormStatus('Publishing your appreciation...', '');

    const submitButton = appreciationForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: new FormData(appreciationForm)
      });

      if (!response.ok) {
        throw new Error('Submission failed. Please try again in a moment.');
      }

      appreciationForm.reset();
      renderMediaPreview();
      setFormStatus('Thank you. Your appreciation has been received and will appear in the wall once verified.', 'success');
      await loadAppreciations();
    } catch (error) {
      setFormStatus(error.message || 'Something went wrong while sending your appreciation.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

loadAppreciations();
