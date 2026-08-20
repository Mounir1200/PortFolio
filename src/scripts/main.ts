import { initHeroReveal } from "./heroReveal";
import { initLanguage } from "./i18n/initLanguage";
import { initSectionNavigation } from "./sectionNavigation";

type Cleanup = () => void;

let activeCleanup: Cleanup | null = null;

export function initPortfolio(): Cleanup {
  activeCleanup?.();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanups = [
    initLanguage(),
    initHeroReveal(reducedMotion),
    initSectionNavigation(reducedMotion),
  ];

  const cleanup = (): void => {
    cleanups.forEach((dispose) => dispose());
    if (activeCleanup === cleanup) activeCleanup = null;
  };

  activeCleanup = cleanup;
  return cleanup;
}

// Astro emits this bundle as a deferred module after the complete page markup.
// Initialising immediately preserves the timing of the former deferred app.js.
initPortfolio();
