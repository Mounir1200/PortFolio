import {
  cvFiles,
  LANGUAGE_STORAGE_KEY,
  pageTitles,
  translatedAttributes,
  translations,
  type Language,
} from "./translations";

type Cleanup = () => void;
type TranslatedAttribute = "aria-label" | "content";

interface CapturedTextNode {
  readonly node: Text;
  readonly french: string;
  readonly key: string;
}

interface CapturedAttributeNode {
  readonly element: Element;
  readonly attribute: TranslatedAttribute;
  readonly french: string;
}

const normaliseText = (value: string): string => value.replace(/\s+/g, " ").trim();

const getTextTranslation = (key: string): string | undefined =>
  translations[key as keyof typeof translations] as string | undefined;

const getAttributeTranslation = (key: string): string | undefined =>
  translatedAttributes[key as keyof typeof translatedAttributes] as string | undefined;

const experienceHeadingTranslations: Readonly<Record<string, string>> = {
  "experiences-title:Expériences": "Professional",
  "experiences-title:professionnelles": "Experience",
};

export function initLanguage(): Cleanup {
  const cvLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-cv-action]")];
  const languageButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-lang]")];
  const textNodes: CapturedTextNode[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!normaliseText(node.nodeValue ?? "") || node.parentElement?.closest("script, style")) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const french = node.nodeValue ?? "";
    textNodes.push({ node, french, key: normaliseText(french) });
  }

  const attributeNodes: CapturedAttributeNode[] = [
    ...document.querySelectorAll<Element>("[aria-label], meta[name='description']"),
  ].map((element) => {
    const attribute: TranslatedAttribute = element.matches("meta") ? "content" : "aria-label";
    return { element, attribute, french: element.getAttribute(attribute) ?? "" };
  });

  function applyLanguage(language: string | null | undefined, persist = false): void {
    const lang: Language = language === "en" ? "en" : "fr";
    document.documentElement.lang = lang;
    document.title = pageTitles[lang];

    textNodes.forEach(({ node, french, key }) => {
      const translation = getTextTranslation(key);
      if (lang === "fr" || !translation) {
        node.nodeValue = french;
        return;
      }

      const headingKey = node.parentElement?.id === "experiences-title" ? `experiences-title:${key}` : key;
      const translatedText = experienceHeadingTranslations[headingKey] ?? translation;
      const leading = french.match(/^\s*/)?.[0] ?? "";
      const trailing = french.match(/\s*$/)?.[0] ?? "";
      node.nodeValue = `${leading}${translatedText}${trailing}`;
    });

    attributeNodes.forEach(({ element, attribute, french }) => {
      element.setAttribute(attribute, lang === "en" ? getAttributeTranslation(french) ?? french : french);
    });

    document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });

    cvLinks.forEach((link) => {
      link.href = cvFiles[lang].path;
    });

    if (persist) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        // Storage can be unavailable.
      }
    }
  }

  let preferredLanguage: string | null | undefined;
  try {
    preferredLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    // Use browser language.
  }

  const browserLanguage = navigator.languages?.[0] ?? navigator.language ?? "fr";
  applyLanguage(preferredLanguage || (browserLanguage.toLowerCase().startsWith("fr") ? "fr" : "en"));

  const cleanups: Cleanup[] = [];
  languageButtons.forEach((button) => {
    const handleClick = (): void => applyLanguage(button.dataset.lang, true);
    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      applyLanguage(button.dataset.lang, true);
    };

    button.addEventListener("click", handleClick);
    button.addEventListener("keydown", handleKeydown);
    cleanups.push(() => {
      button.removeEventListener("click", handleClick);
      button.removeEventListener("keydown", handleKeydown);
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
