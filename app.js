const hero = document.querySelector("[data-hero]");
const siteHeader = document.querySelector(".site-header");
const scrollValue = document.querySelector("[data-scroll-value]");
const collagePieces = [...document.querySelectorAll("[data-piece]")];
const fragmentLinks = [...document.querySelectorAll(".fragment-link")];
const sectionLinks = [...document.querySelectorAll('.top-nav a[href^="#"]')];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

let frameRequested = false;
let collageInteractive = true;
let headerVisible = null;

function setHeaderVisibility(visible) {
  if (!siteHeader || headerVisible === visible) return;

  headerVisible = visible;
  siteHeader.classList.toggle("is-visible", visible);
  siteHeader.toggleAttribute("inert", !visible);

  if (visible) siteHeader.removeAttribute("aria-hidden");
  else siteHeader.setAttribute("aria-hidden", "true");
}

const pieceMotion = {
  "middle-left": { start: 0.07, end: 0.34, x: -1, y: -0.04 },
  "middle-right": { start: 0.07, end: 0.34, x: 1, y: -0.04 },
  "top-center": { start: 0.1, end: 0.4, x: 0, y: -0.95 },
  "bottom-center": { start: 0.13, end: 0.43, x: 0, y: 0.95 },
  "top-left": { start: 0.16, end: 0.5, x: -0.62, y: -0.78 },
  "top-right": { start: 0.16, end: 0.5, x: 0.62, y: -0.78 },
  "bottom-left": { start: 0.19, end: 0.56, x: -0.62, y: 0.78 },
  "bottom-right": { start: 0.19, end: 0.56, x: 0.62, y: 0.78 },
};

function updateHero() {
  frameRequested = false;

  if (!hero) {
    setHeaderVisibility(true);
    return;
  }

  if (reducedMotion.matches) {
    setHeaderVisibility(window.scrollY >= window.innerHeight * 0.9);
    return;
  }

  const rect = hero.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  const rawProgress = clamp(-rect.top / travel);
  const reveal = smoothstep((rawProgress - 0.025) / 0.56);
  const posterOpacity = 1 - smoothstep((rawProgress - 0.055) / 0.04);
  const labels = 1 - smoothstep((rawProgress - 0.012) / 0.05);
  const viewportUnit = Math.min(window.innerWidth, window.innerHeight);
  const horizontalDistance = clamp(viewportUnit * 0.062, 24, 74);
  const verticalDistance = clamp(viewportUnit * 0.058, 22, 68);

  hero.style.setProperty("--reveal-progress", reveal.toFixed(4));
  hero.style.setProperty("--poster-opacity", posterOpacity.toFixed(3));
  hero.style.setProperty("--labels-opacity", labels.toFixed(3));

  const shouldShowHeader = headerVisible ? rawProgress >= 0.52 : rawProgress >= 0.57;
  setHeaderVisibility(shouldShowHeader);

  if (rawProgress < 0.99) {
    sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
  }

  collagePieces.forEach((piece) => {
    const name = piece.dataset.piece;
    const motion = pieceMotion[name];
    if (!motion) return;

    const localProgress = smoothstep((rawProgress - motion.start) / (motion.end - motion.start));
    const drift = smoothstep((localProgress - 0.22) / 0.78);
    const alpha = 1 - smoothstep((localProgress - 0.48) / 0.52);
    const wipe = -6 + localProgress * 122;

    piece.style.setProperty("--piece-x", `${(motion.x * horizontalDistance * drift).toFixed(2)}px`);
    piece.style.setProperty("--piece-y", `${(motion.y * verticalDistance * drift).toFixed(2)}px`);
    piece.style.setProperty("--piece-scale", (1 + drift * 0.004).toFixed(4));
    piece.style.setProperty("--piece-opacity", alpha.toFixed(3));
    piece.style.setProperty("--piece-wipe", `${wipe.toFixed(2)}%`);
  });

  const wasInteractive = collageInteractive;
  if (rawProgress > 0.055) collageInteractive = false;
  if (rawProgress < 0.018) collageInteractive = true;

  if (wasInteractive && !collageInteractive) {
    const focusedFragment = fragmentLinks.find((link) => link === document.activeElement);
    if (focusedFragment) {
      const matchingNav = sectionLinks.find(
        (link) => link.getAttribute("href") === focusedFragment.getAttribute("href"),
      );
      matchingNav?.focus({ preventScroll: true });
    }
  }

  hero.classList.toggle("is-collage-active", collageInteractive);
  hero.classList.toggle("is-portrait-revealed", rawProgress >= 0.59);
  fragmentLinks.forEach((link) => link.setAttribute("tabindex", collageInteractive ? "0" : "-1"));

  if (scrollValue) {
    scrollValue.textContent = String(Math.round(reveal * 100)).padStart(2, "0");
  }
}

function requestHeroUpdate() {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(updateHero);
}

function syncMotionPreference() {
  if (!hero) return;

  hero.classList.toggle("is-scroll-ready", !reducedMotion.matches);
  if (reducedMotion.matches) {
    hero.removeAttribute("style");
    hero.classList.remove("is-collage-active", "is-portrait-revealed");
    collagePieces.forEach((piece) => piece.removeAttribute("style"));
    fragmentLinks.forEach((link) => link.setAttribute("tabindex", "-1"));
    if (scrollValue) scrollValue.textContent = "100";
    setHeaderVisibility(window.scrollY >= window.innerHeight * 0.9);
  } else {
    collageInteractive = true;
    requestHeroUpdate();
  }
}

if (hero) {
  syncMotionPreference();
  window.addEventListener("scroll", requestHeroUpdate, { passive: true });
  window.addEventListener("resize", requestHeroUpdate, { passive: true });
  hero.addEventListener("focusin", requestHeroUpdate);
  hero.addEventListener("focusout", requestHeroUpdate);
  reducedMotion.addEventListener("change", syncMotionPreference);
}

const observedSections = ["formations", "projets", "experiences", "competences"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      sectionLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-30% 0px -55%", threshold: [0, 0.1, 0.4] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target || !target.matches("[tabindex='-1']")) return;

    window.setTimeout(() => target.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 450);
  });
});
