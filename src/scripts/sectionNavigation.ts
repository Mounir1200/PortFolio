type Cleanup = () => void;

const observedSectionIds = ["formations", "projets", "experiences", "competences", "recommandations"] as const;

export function initSectionNavigation(reducedMotion: MediaQueryList): Cleanup {
  const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('.top-nav a[href^="#"]')];
  const observedSections = observedSectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);

  let sectionObserver: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window && observedSections.length) {
    sectionObserver = new IntersectionObserver(
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

    observedSections.forEach((section) => sectionObserver?.observe(section));
  }

  const pendingFocusTimers = new Set<number>();
  const anchorCleanups: Cleanup[] = [];
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    const handleClick = (): void => {
      const href = link.getAttribute("href");
      if (!href) return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target || !target.matches("[tabindex='-1']")) return;

      const timer = window.setTimeout(() => {
        pendingFocusTimers.delete(timer);
        target.focus({ preventScroll: true });
      }, reducedMotion.matches ? 0 : 450);
      pendingFocusTimers.add(timer);
    };

    link.addEventListener("click", handleClick);
    anchorCleanups.push(() => link.removeEventListener("click", handleClick));
  });

  return () => {
    sectionObserver?.disconnect();
    anchorCleanups.forEach((cleanup) => cleanup());
    pendingFocusTimers.forEach((timer) => window.clearTimeout(timer));
    pendingFocusTimers.clear();
  };
}
