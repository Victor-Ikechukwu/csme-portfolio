const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const statNumbers = document.querySelectorAll("[data-count]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxMedia = document.querySelector("[data-lightbox-media]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const mediaButtons = document.querySelectorAll("[data-media-url]");

document.documentElement.classList.add("js");

const storageKey = "portfolio-theme";

const getPreferredTheme = () => {
  const urlTheme = new URLSearchParams(window.location.search).get("theme");
  if (urlTheme === "light" || urlTheme === "dark") {
    return urlTheme;
  }

  const savedTheme = window.localStorage.getItem(storageKey);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = theme => {
  document.body.dataset.theme = theme;

  const nextLabel = theme === "dark" ? "Light mode" : "Dark mode";
  themeToggles.forEach(toggle => {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()}`);

    const label = toggle.querySelector(".theme-toggle-label");
    if (label) {
      label.textContent = nextLabel;
    }
  });
};

applyTheme(getPreferredTheme());

themeToggles.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  links.forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });
}

const yearEl = document.getElementById("year");
if (yearEl && !yearEl.textContent.trim()) {
  yearEl.textContent = new Date().getFullYear();
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.remove("active"));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

sections.forEach(section => activeObserver.observe(section));

const animateCount = element => {
  const target = Number.parseInt(element.dataset.count || "", 10);
  const originalText = element.textContent.trim();

  if (Number.isNaN(target) || !/\d/.test(originalText)) {
    return;
  }

  if (reducedMotion) {
    element.textContent = originalText;
    return;
  }

  const numberMatch = originalText.match(/^(.*?)(\d+)(.*)$/);
  if (!numberMatch) {
    return;
  }

  const [, prefix, , suffix] = numberMatch;
  const duration = 1200;
  const start = performance.now();

  const step = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = `${prefix}${value}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = originalText;
    }
  };

  window.requestAnimationFrame(step);
};

if (statNumbers.length) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });

  statNumbers.forEach(stat => statObserver.observe(stat));
}

const openLightbox = media => {
  if (!lightbox || !lightboxMedia || !lightboxTitle || !lightboxCaption) return;

  lightboxMedia.innerHTML = "";
  lightboxTitle.textContent = media.title || "Memory media";
  lightboxCaption.textContent = media.caption || "";

  if (media.kind === "video") {
    const video = document.createElement("video");
    video.src = media.url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata";
    lightboxMedia.append(video);
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }
  } else {
    const image = document.createElement("img");
    image.src = media.url;
    image.alt = media.title || "Memory media";
    lightboxMedia.append(image);
  }

  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox || !lightboxMedia) return;
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxMedia.innerHTML = "";
  document.body.style.overflow = "";
};

mediaButtons.forEach(button => {
  button.addEventListener("click", () => {
    openLightbox({
      kind: button.dataset.mediaKind || "image",
      url: button.dataset.mediaUrl,
      title: button.dataset.mediaTitle || "Memory media",
      caption: button.dataset.mediaCaption || ""
    });
  });
});

if (lightbox && lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", event => {
    if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });
}
