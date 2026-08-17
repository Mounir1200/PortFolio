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
  "Portfolio de Mounir DABIRE — ingénieur IA": "Mounir DABIRE’s portfolio — AI engineer",
  "Un portrait-collage de Mounir dont les scènes se retirent au défilement pour révéler son portrait sur fond de papier.": "A collage portrait of Mounir whose scenes peel away while scrolling to reveal his portrait on paper.",
  "Défiler pour révéler": "Scroll to reveal",
  "Le fil conducteur": "The common thread",
  "Observer. Comprendre.": "Observe. Understand.",
  "Donner forme.": "Bring to life.",
  "Ingénieur IA spécialisé dans les agents IA en production, le RAG et le cloud Azure, je conçois des systèmes utiles, de l’expression du besoin à leur exploitation. Disponible le 10 octobre 2026, je suis mobile dans toute la France.": "I’m an AI engineer specialising in production AI agents, RAG and Azure Cloud. I design useful systems from requirements gathering through production operations. Available from 10 October 2026, I’m open to opportunities in the Paris region.",
  "Apprendre / approfondir": "Learn / deepen",
  "Un parcours d’ingénieur construit entre le Burkina Faso, la France, la Lituanie et l’Allemagne.": "An engineering journey shaped across Burkina Faso, France, Lithuania and Germany.",
  "Diplôme d’ingénieur · Spécialisation Big Data": "Engineering degree · Big Data specialisation",
  "ESAIP · Angers, France · Parcours anglophone": "ESAIP · Angers, France · English-taught programme",
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
  "Agent Slack conçu pour le Slack Agent Builder Challenge (Agent for Good) : recherche en direct sur Grants.gov via un serveur FastMCP sur mesure, présélection par filtres déterministes hors du contrôle du modèle, suivi des candidatures et brouillons soumis à relecture. Chaque résultat cite sa fiche officielle.": "A Slack agent built for the Slack Agent Builder Challenge (Agent for Good): it searches live Grants.gov data through a custom FastMCP server, pre-screens opportunities with deterministic filters kept outside the model’s control, tracks applications and produces drafts for human review. Every result links to its official record.",
  "Voir le dépôt": "View repository",
  "Projet personnel · Open source": "Personal project · Open source",
  "Serveur MCP open source (Apache-2.0) qui donne à Claude Code, Claude Desktop, Codex et Gemini CLI une mémoire persistante entre les sessions. Protocole LongMemEval retenu après un état de l’art (MemGPT, Mem0, A-Mem, Zep) : en complément de la recherche vectorielle, BM25 avec fusion RRF porte le rappel top-1 de 0,55 à 0,60 sur 419 questions ; la réutilisation des index ramène l’évaluation complète de 60 h à 8,8 h. Un installeur en une ligne détecte chaque agent installé et le câble.": "An open-source (Apache-2.0) MCP server that gives Claude Code, Claude Desktop, Codex and Gemini CLI persistent memory across sessions. LongMemEval was adopted as the evaluation protocol after a review of the field (MemGPT, Mem0, A-Mem, Zep): complementing vector search with BM25 and RRF raises top-1 recall from 0.55 to 0.60 across 419 questions; index reuse cuts the full evaluation from 60 hours to 8.8. A one-line installer detects each installed agent and wires it in.",
  "Tests E2E": "E2E testing",
  "Projet personnel · Auto-hébergé": "Personal project · Self-hosted",
  "Outil auto-hébergé qui extrait les compétences d’un CV PDF, collecte des offres sur les sites carrières et les classe localement par pertinence sémantique.": "A self-hosted tool that extracts skills from a PDF résumé, collects job postings from career websites and ranks them locally by semantic relevance.",
  "Embeddings locales": "Local embeddings",
  "Recherche sémantique": "Semantic search",
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
  "Des missions qui relient agents IA, RAG, interfaces produit, données et exploitation sur Microsoft Azure.": "Roles connecting AI agents, RAG, product interfaces, data and operations on Microsoft Azure.",
  "Avril 2026 — Présent": "Apr. 2026 — Present",
  "Développeur IA": "AI Developer",
  "Maintenir et faire évoluer en production ESSCABOT, l’assistant pédagogique IA de l’établissement, et son outil d’administration : un moteur unique dessert plusieurs cours, chaque agent disposant de son corpus, de son prompt et de son modèle.": "Maintain and evolve ESSCABOT in production — the school’s AI teaching assistant — together with its administration tool: a single engine serves multiple courses, each agent having its own corpus, prompt and model.",
  "Orchestrer la chaîne RAG sur Azure AI Search : indexation par cours des sources institutionnelles (plateformes LMS), recherche vectorielle et réponses citées vers leur source ; modèles propriétaires et open source interchangeables par configuration pour maîtriser leur coût d’usage.": "Orchestrate the RAG chain on Azure AI Search: per-course indexing of institutional sources (LMS platforms), vector search and answers cited back to their source; proprietary and open-source models are interchangeable by configuration to keep usage costs under control.",
  "Contrôler l’accès aux agents : profils enseignants, étudiants et collaborateurs différenciés via Microsoft Graph et Azure AD (MSAL, Easy Auth), avec des droits distincts.": "Control access to the agents: faculty, student and staff profiles differentiated through Microsoft Graph and Azure AD (MSAL, Easy Auth), with distinct permissions.",
  "Accompagner les directions métiers du recueil du besoin à la mise en production, et conduire des utilisateurs non experts de l’IA jusqu’à leur autonomie.": "Support business units from requirements gathering through production and guide users with no prior AI expertise to independent use.",
  "Industrialiser et sécuriser l’exploitation sur Microsoft Azure : chaîne dev/recette/production sur Azure Pipelines, monitoring, traitement des incidents, migrations versionnées et tests de charge.": "Industrialise and secure operations on Microsoft Azure: a dev/staging/production pipeline on Azure Pipelines, monitoring, incident management, versioned migrations and load testing.",
  "Sept. 2025 — Fév. 2026": "Sep. 2025 — Feb. 2026",
  "Projet de fin d’études · Développeur FullStack IA": "Full-Stack AI Developer · Final-year project",
  "Concevoir et livrer en production la version actuelle d’ESSCABOT : architecture multi-bots pilotée par base de données, où chaque agent reçoit son corpus, son prompt, son modèle et ses fonctionnalités.": "Design and deliver the current version of ESSCABOT to production: a database-driven multi-bot architecture in which each agent receives its own corpus, prompt, model and features.",
  "Développer la chaîne complète : back Python (FastAPI, API REST), application d’accès aux agents, interface React en TypeScript d’après maquettes Figma et chat vocal temps réel (LiveKit, Deepgram, ElevenLabs, avatar).": "Develop the complete stack: Python backend (FastAPI, REST API), an application providing access to the agents, a React interface in TypeScript based on Figma mock-ups and real-time voice chat (LiveKit, Deepgram, ElevenLabs, avatar).",
  "Déployer de façon sécurisée sur Microsoft Azure, avec un protocole de consentement éclairé révocable pour les utilisateurs.": "Deploy securely on Microsoft Azure with a revocable informed-consent protocol for users.",
  "Avril — Juillet 2025": "Apr. — Jul. 2025",
  "Stagiaire développeur fullstack": "Full-Stack Developer Intern",
  "Développer et déployer un outil RH interne reposant sur le RAG : informations sur les collaborateurs récupérées via l’API Microsoft Graph, recherche en langage naturel sans requête technique.": "Develop and deploy an internal RAG-based HR tool: employee information retrieved through the Microsoft Graph API, searchable in natural language without technical queries.",
  "Reprendre, mettre à jour et redéployer la version précédente d’ESSCABOT.": "Take over, update and redeploy the previous version of ESSCABOT.",
  "Juin — Août 2024": "Jun. — Aug. 2024",
  "Stagiaire Data Engineer · Data Lakehouse & données CDR": "Data Engineer Intern · Data Lakehouse & CDR Data",
  "Moov Africa Burkina · Ouagadougou": "Moov Africa Burkina · Ouagadougou",
  "Évaluer l’architecture Data Lakehouse pour l’exploitation des données CDR (Call Detail Records) : fonctionnement, intérêt et conditions de mise en œuvre, par étude comparative et simulations sur données ouvertes.": "Evaluate the Data Lakehouse architecture for processing CDR (Call Detail Records) data, including its operation, benefits and implementation requirements, through a comparative study and simulations using open data.",
  "Intégrer les données CDR et simuler le stockage en flux continu, jusqu’à trois flux en parallèle (streaming).": "Integrate CDR data and simulate continuous-stream storage with up to three parallel streams.",
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
  "Agents IA": "AI agents",
  "Systèmes multi-agents": "Multi-agent systems",
  "Architecture multi-bots pilotée par configuration": "Configuration-driven multi-bot architecture",
  Vectorisation: "Vectorization",
  "Bases vectorielles (Qdrant)": "Vector databases (Qdrant)",
  "Prompt Engineering": "Prompt Engineering",
  "Pipelines batch & streaming": "Batch & streaming pipelines",
  "Chaîne dev / recette / production": "Dev / staging / production pipeline",
  "Mise en production": "Production deployment",
  "Migrations de base versionnées": "Versioned database migrations",
  "Tests unitaires / intégration / charge / E2E": "Unit / integration / load / E2E testing",
  Outils: "Tools",
  Atouts: "Strengths",
  Langues: "Languages",
  Autonomie: "Independence",
  Adaptabilité: "Adaptability",
  Curiosité: "Curiosity",
  "Pack Office": "Microsoft Office Suite",
  "Français (natif)": "French (native)",
  "Anglais (courant · TOEIC 910/990)": "English (fluent · TOEIC 910/990)",
  "Mooré (natif)": "Mooré (native)",
  "Allemand (débutant)": "German (beginner)",
  "Confiance / collaboration": "Trust / collaboration",
  "Recommandé par": "Recommended by",
  "Trois personnes qui recommandent mon travail et mon parcours.": "Three people who recommend my work and professional journey.",
  "Profil LinkedIn": "LinkedIn profile",
  "Contact / collaboration": "Contact / collaboration",
  "Parlons-en.": "Let’s talk.",
  "Voir mon CV": "View my résumé",
  "Revenir à l’image": "Back to the image",
  "© 2026 Mounir DABIRE · Ingénieur IA · Angers": "© 2026 Mounir DABIRE · AI Engineer · Angers",
};

const translatedAttributes = {
  "Portfolio de Mounir DABIRE — ingénieur IA spécialisé dans les agents IA en production, le RAG, MCP, les LLM et Microsoft Azure.": "Mounir DABIRE’s portfolio — AI engineer specialising in production AI agents, RAG, MCP, LLMs and Microsoft Azure.",
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
  "Profils LinkedIn des personnes qui recommandent Mounir DABIRE": "LinkedIn profiles of people who recommend Mounir DABIRE",
  "Voir le profil LinkedIn de Kassoum Sanogo dans un nouvel onglet": "View Kassoum Sanogo’s LinkedIn profile in a new tab",
  "Voir le profil LinkedIn de Mickaël Geslin dans un nouvel onglet": "View Mickaël Geslin’s LinkedIn profile in a new tab",
  "Voir le profil LinkedIn de Junior Moughiama dans un nouvel onglet": "View Junior Moughiama’s LinkedIn profile in a new tab",
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
  fr: "Mounir DABIRE — Ingénieur IA",
  en: "Mounir DABIRE — AI Engineer",
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

const observedSections = ["formations", "projets", "experiences", "competences", "recommandations"]
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
