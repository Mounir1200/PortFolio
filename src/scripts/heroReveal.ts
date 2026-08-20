type Cleanup = () => void;

type PieceName =
  | "middle-left"
  | "middle-right"
  | "top-center"
  | "bottom-center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface PieceMotion {
  readonly start: number;
  readonly end: number;
  readonly x: number;
  readonly y: number;
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
} as const satisfies Readonly<Record<PieceName, PieceMotion>>;

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

const smoothstep = (value: number): number => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function initHeroReveal(reducedMotion: MediaQueryList): Cleanup {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const siteHeader = document.querySelector<HTMLElement>(".site-header");
  const scrollValue = document.querySelector<HTMLElement>("[data-scroll-value]");
  const collagePieces = [...document.querySelectorAll<HTMLElement>("[data-piece]")];
  const fragmentLinks = [...document.querySelectorAll<HTMLAnchorElement>(".fragment-link")];
  const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('.top-nav a[href^="#"]')];

  let frameRequested = false;
  let animationFrame: number | null = null;
  let collageInteractive = true;
  let headerVisible: boolean | null = null;

  function setHeaderVisibility(visible: boolean): void {
    if (!siteHeader || headerVisible === visible) return;

    headerVisible = visible;
    siteHeader.classList.toggle("is-visible", visible);
    siteHeader.toggleAttribute("inert", !visible);

    if (visible) siteHeader.removeAttribute("aria-hidden");
    else siteHeader.setAttribute("aria-hidden", "true");
  }

  function updateHero(): void {
    frameRequested = false;
    animationFrame = null;

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
      const motion = pieceMotion[name as PieceName] as PieceMotion | undefined;
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

  function requestHeroUpdate(): void {
    if (frameRequested) return;
    frameRequested = true;
    animationFrame = window.requestAnimationFrame(updateHero);
  }

  function syncMotionPreference(): void {
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

  if (!hero) return () => undefined;

  syncMotionPreference();
  window.addEventListener("scroll", requestHeroUpdate, { passive: true });
  window.addEventListener("resize", requestHeroUpdate, { passive: true });
  hero.addEventListener("focusin", requestHeroUpdate);
  hero.addEventListener("focusout", requestHeroUpdate);
  reducedMotion.addEventListener("change", syncMotionPreference);

  return () => {
    window.removeEventListener("scroll", requestHeroUpdate);
    window.removeEventListener("resize", requestHeroUpdate);
    hero.removeEventListener("focusin", requestHeroUpdate);
    hero.removeEventListener("focusout", requestHeroUpdate);
    reducedMotion.removeEventListener("change", syncMotionPreference);
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
    frameRequested = false;
  };
}
