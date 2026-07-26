const hero = document.querySelector("[data-hero]");
const siteHeader = document.querySelector(".site-header");
const scrollValue = document.querySelector("[data-scroll-value]");
const collagePieces = [...document.querySelectorAll("[data-piece]")];
const fragmentLinks = [...document.querySelectorAll(".fragment-link")];
const sectionLinks = [...document.querySelectorAll('.top-nav a[href^="#"]')];
const cvLinks = [...document.querySelectorAll("[data-cv-action]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const translations = {
  "Aller au contenu": "Skip to content",
  Formations: "Education",
  Projets: "Projects",
  Expériences: "Experience",
  Compétences: "Skills",
  "Portfolio de Mounir DABIRE — développeur IA": "Mounir DABIRE’s portfolio — AI developer",
  "Un portrait-collage de Mounir dont les scènes se retirent au défilement pour révéler son portrait sur fond de papier.": "A collage portrait of Mounir whose scenes peel away while scrolling to reveal his portrait on paper.",
  "Défiler pour révéler": "Scroll to reveal",
  "Le fil conducteur": "The common thread",
  "Observer. Comprendre.": "Observe. Understand.",
  "Donner forme.": "Bring to life.",
  "Je suis Mounir. J’aime partir d’une idée, la comprendre, puis lui donner forme avec soin, méthode et simplicité.": "I’m Mounir. I like to start with an idea, understand it, then bring it to life with care, method and simplicity.",
  "Apprendre / approfondir": "Learn / deepen",
  "Un parcours d’ingénieur construit entre le Burkina Faso, la France, la Lituanie et l’Allemagne.": "An engineering journey shaped across Burkina Faso, France, Lithuania and Germany.",
  "Diplôme d’ingénieur": "Engineering degree",
  Ingénierie: "Engineering",
  "Sept. 2024 — Fév. 2025": "Sep. 2024 — Feb. 2025",
  "Programme d’échange Erasmus": "Erasmus exchange programme",
  "RWU, Hochschule Ravensburg-Weingarten · Ravensburg, Allemagne": "RWU, Ravensburg-Weingarten University of Applied Sciences · Ravensburg, Germany",
  "Janv. — Juin 2023": "Jan. — Jun. 2023",
  "KTU, Kaunas University of Technology · Kaunas, Lituanie": "KTU, Kaunas University of Technology · Kaunas, Lithuania",
  "Classes préparatoires aux grandes écoles": "Preparatory programme for French engineering schools",
  Fondations: "Foundations",
  "Concevoir / éprouver": "Design / test",
  "Sept produits personnels et académiques, du besoin initial jusqu’à l’implémentation.": "Seven personal and academic products, from the initial need through implementation.",
  "Projet personnel · Produit IA": "Personal project · AI product",
  "Application web et mobile d’aide à la décision pour le trading — Forex, Bourse et Crypto — utilisant Mistral AI pour accompagner l’analyse technique.": "A web and mobile decision-support app for Forex, stock and crypto trading, using Mistral AI to assist with technical analysis.",
  Technos: "Tech",
  "Conception produit": "Product design",
  "Projet personnel · Hackathon": "Personal project · Hackathon",
  "Agent Slack pour rechercher des subventions fédérales américaines, présélectionner les opportunités, programmer des rappels et générer des brouillons sans quitter Slack.": "A Slack agent that searches US federal grants, shortlists opportunities, schedules reminders and generates drafts without leaving Slack.",
  "Voir le dépôt": "View repository",
  "Projet personnel · Open source": "Personal project · Open source",
  "Serveur MCP de mémoire à long terme pour agents de code. J’en ai conçu l’architecture et la persistance afin de restituer un contexte utile entre les sessions.": "A long-term memory MCP server for coding agents. I designed its architecture and persistence layer to restore useful context between sessions.",
  "Agents IA": "AI agents",
  "Projet personnel · Auto-hébergé": "Personal project · Self-hosted",
  "Outil qui extrait le profil d’un CV PDF, collecte les offres sur les pages carrières et les classe localement par pertinence sémantique dans une interface de consultation.": "A tool that extracts a profile from a PDF résumé, gathers roles from career pages and ranks them locally by semantic relevance in a browsing interface.",
  "NLP local": "Local NLP",
  "Projet académique · Vision": "Academic project · Computer vision",
  "Détection de visages synthétiques": "Synthetic face detection",
  "Préparation des données, entraînement et évaluation d’un modèle capable de distinguer les visages réels de ceux modifiés par logiciel ou intelligence artificielle.": "Data preparation, training and evaluation of a model able to distinguish real faces from those altered by software or artificial intelligence.",
  "Classification d’images": "Image classification",
  "Projet académique · Outil métier": "Academic project · Business tool",
  "Pour le client TIT, conception du parcours de saisie d’un outil estimant les coûts de fabrication et de service liés à la pose de réseaux de chauffage urbain.": "For TIT, design of the input journey for a tool estimating manufacturing and service costs related to district heating network installation.",
  "Application web": "Web application",
  "Calcul métier": "Business calculations",
  "Projet académique · Numérique responsable": "Academic project · Sustainable digital design",
  "Développement d’une expérience web écoresponsable pour évaluer des sites selon le RGAA, à la croisée de l’accessibilité et de l’écoconception numérique.": "Development of an eco-conscious web experience for assessing sites against RGAA standards, combining accessibility and sustainable digital design.",
  Écoconception: "Eco-design",
  "Faire / transmettre": "Build / share",
  professionnelles: "Professional",
  "Des missions qui relient intelligence artificielle, interfaces produit, données et mise en production.": "Roles connecting artificial intelligence, product interfaces, data and production delivery.",
  "Avril 2026 — Présent": "Apr. 2026 — Present",
  "Développeur IA": "AI Developer",
  "Concevoir et maintenir des agents conversationnels et des systèmes RAG.": "Design and maintain conversational agents and RAG systems.",
  "Sélectionner les modèles et réaliser le prompt engineering avec OpenAI et Claude.": "Select models and perform prompt engineering with OpenAI and Claude.",
  "Créer des interfaces React et des outils IA internes.": "Build React interfaces and internal AI tools.",
  "Déployer les solutions de manière sécurisée sur Azure.": "Deploy solutions securely on Azure.",
  "Sept. 2025 — Fév. 2026": "Sep. 2025 — Feb. 2026",
  "Projet de fin d’études · Développeur IA": "Final-year project · AI Developer",
  "Développer un écosystème d’agents conversationnels RAG.": "Develop an ecosystem of RAG conversational agents.",
  "Transformer les maquettes Figma en interface React.": "Turn Figma designs into a React interface.",
  "Intégrer la solution à l’infrastructure Azure.": "Integrate the solution into the Azure infrastructure.",
  "Avril — Juin 2025": "Apr. — Jun. 2025",
  "Stagiaire développeur": "Software Developer Intern",
  "Mettre à jour et déployer un agent conversationnel.": "Update and deploy a conversational agent.",
  "Développer un annuaire RH sous IA.": "Develop an AI-powered employee directory.",
  "Permettre la recherche d’informations en langage naturel.": "Enable natural-language information search.",
  "Juin — Août 2024": "Jun. — Aug. 2024",
  "Stagiaire Data Engineer": "Data Engineer Intern",
  "Étudier les systèmes de stockage de données à grande échelle.": "Study large-scale data storage systems.",
  "Simuler l’architecture d’un data lakehouse.": "Model a data lakehouse architecture.",
  "Intégrer des données CDR en flux continu.": "Ingest streaming CDR data.",
  "Juillet — Août 2023": "Jul. — Aug. 2023",
  "Opérateur de ligne de production": "Production Line Operator",
  "Contrôler les formeuses et les operculeuses.": "Operate forming and sealing machines.",
  "Assurer le contrôle qualité de la production.": "Perform production quality control.",
  "Respecter le cahier des charges et les règles d’hygiène.": "Follow specifications and hygiene rules.",
  "Construire / relier / déployer": "Build / connect / deploy",
  "Un inventaire de technologies réellement mobilisées dans mes projets et mes expériences.": "An inventory of technologies I have actually used across my projects and experience.",
  "Du prototype à la production, je relie développement, IA, données et infrastructure.": "From prototype to production, I connect development, AI, data and infrastructure.",
  "Simple · Curieux · Attentif": "Simple · Curious · Thoughtful",
  Développement: "Development",
  "Intelligence artificielle": "Artificial intelligence",
  "Prompt Engineering": "Prompt Engineering",
  "Intégration LLM par API": "LLM API Integration",
  Outils: "Tools",
  Atouts: "Strengths",
  Langues: "Languages",
  Autonomie: "Independence",
  Adaptabilité: "Adaptability",
  Curiosité: "Curiosity",
  "Pack Office": "Microsoft Office Suite",
  "Français (natif)": "French (native)",
  "Anglais (courant)": "English (fluent)",
  "Mooré (natif)": "Mooré (native)",
  "Allemand (débutant)": "German (beginner)",
  "Contact / collaboration": "Contact / collaboration",
  "Parlons-en.": "Let’s talk.",
  "Voir mon CV": "View my résumé",
  "Revenir à l’image": "Back to the image",
  "© 2026 Mounir DABIRE · Développeur IA": "© 2026 Mounir DABIRE · AI Developer",
};

const translatedAttributes = {
  "Portfolio de Mounir DABIRE — développement IA, projets, parcours, expériences et compétences techniques.": "Mounir DABIRE’s portfolio — AI development, projects, education, experience and technical skills.",
  "En-tête du portfolio": "Portfolio header",
  "Retour à l’accueil": "Back to home",
  "Navigation principale": "Main navigation",
  "Voir les formations": "View education",
  "Voir les projets": "View projects",
  "Voir les expériences professionnelles": "View professional experience",
  "Rubriques du portfolio": "Portfolio sections",
  "Parcours académique de Mounir DABIRE": "Mounir DABIRE’s academic background",
  "Stack et pratiques utilisées pour ChartMind": "Technology stack and practices used for ChartMind",
  "Stack utilisée pour Grant Copilot": "Technology stack used for Grant Copilot",
  "Stack utilisée pour UrdWell": "Technology stack used for UrdWell",
  "Stack utilisée pour ADQUA": "Technology stack used for ADQUA",
  "Stack utilisée pour la détection de visages synthétiques": "Technology stack used for synthetic face detection",
  "Stack et pratiques utilisées pour Activ’ESAIP": "Technology stack and practices used for Activ’ESAIP",
  "Stack et pratiques utilisées pour Design4Green": "Technology stack and practices used for Design4Green",
  "Registre des compétences": "Skills register",
  "Liens de contact et CV": "Contact and résumé links",
  "Voir mon CV en français dans un nouvel onglet": "View my English résumé in a new tab",
  "Choisir la langue": "Choose language",
};

const cvFiles = {
  fr: {
    path: "./CV/DABIRE_Mounir_CV_FR.pdf",
  },
  en: {
    path: "./CV/DABIRE_Mounir_CV_EN.pdf",
  },
};

const normaliseText = (value) => value.replace(/\s+/g, " ").trim();
const textNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode(node) {
    if (!normaliseText(node.nodeValue) || node.parentElement?.closest("script, style")) {
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  },
});

while (walker.nextNode()) {
  const node = walker.currentNode;
  textNodes.push({ node, french: node.nodeValue, key: normaliseText(node.nodeValue) });
}

const attributeNodes = [...document.querySelectorAll("[aria-label], meta[name='description']")].map((element) => {
  const attribute = element.matches("meta") ? "content" : "aria-label";
  return { element, attribute, french: element.getAttribute(attribute) };
});

const pageTitles = {
  fr: "Mounir DABIRE — Développeur IA",
  en: "Mounir DABIRE — AI Developer",
};

function applyLanguage(language, persist = false) {
  const lang = language === "en" ? "en" : "fr";
  document.documentElement.lang = lang;
  document.title = pageTitles[lang];

  textNodes.forEach(({ node, french, key }) => {
    if (lang === "fr" || !translations[key]) {
      node.nodeValue = french;
      return;
    }

    const headingKey = node.parentElement?.id === "experiences-title" ? `experiences-title:${key}` : key;
    const translatedText = {
      "experiences-title:Expériences": "Professional",
      "experiences-title:professionnelles": "Experience",
    }[headingKey] ?? translations[key];
    const leading = french.match(/^\s*/)?.[0] ?? "";
    const trailing = french.match(/\s*$/)?.[0] ?? "";
    node.nodeValue = `${leading}${translatedText}${trailing}`;
  });

  attributeNodes.forEach(({ element, attribute, french }) => {
    element.setAttribute(attribute, lang === "en" ? translatedAttributes[french] ?? french : french);
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });

  cvLinks.forEach((link) => {
    link.href = cvFiles[lang].path;
  });

  if (persist) {
    try { localStorage.setItem("portfolio-language", lang); } catch { /* Storage can be unavailable. */ }
  }
}

let preferredLanguage;
try { preferredLanguage = localStorage.getItem("portfolio-language"); } catch { /* Use browser language. */ }
const browserLanguage = navigator.languages?.[0] ?? navigator.language ?? "fr";
applyLanguage(preferredLanguage || (browserLanguage.toLowerCase().startsWith("fr") ? "fr" : "en"));

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang, true));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    applyLanguage(button.dataset.lang, true);
  });
});

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
