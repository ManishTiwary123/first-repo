// lib/platform/pages.ts
//
// The registry of the Factory Graph product pages. One list, read by the
// header and footer navigation, the page metadata, the sitemap, /llms.txt and
// the tests, so a page cannot be linked from one place and forgotten in
// another.
//
// Pure: no imports. Client components import it, so keep it small.

export type PlatformPageKey = "factoryGraph" | "iot" | "agentic" | "cadCam" | "manufacturing" | "audit";

export interface PlatformPage {
  key: PlatformPageKey;
  /** Path after `/{country}/{locale}/`. Changing one needs a redirect in next.config.ts. */
  path: string;
  /** Navigation label. Product names; not translated. */
  nav: string;
  /** One line under the label in the navigation panel. */
  navDetail: string;
  /** <title>. The layout appends " · Savin Group". */
  title: string;
  description: string;
  keywords: string[];
  /** ISO date for the sitemap. Bump by hand when the page's content changes. */
  lastmod: string;
}

export const PLATFORM_PAGES: readonly PlatformPage[] = [
  {
    key: "factoryGraph",
    path: "factory-graph",
    nav: "Factory Graph",
    navDetail: "The intelligence layer for the connected enterprise",
    title: "Factory Graph — Connected Factory Intelligence Platform",
    description:
      "Factory Graph connects the machines, digital twins, CAD/CAM, ERP and CRM you already run into one governed intelligence layer. Explore the architecture.",
    keywords: [
      "factory intelligence platform",
      "connected factory software",
      "smart manufacturing system integration",
      "manufacturing ERP integration",
      "manufacturing automation software",
      "enterprise knowledge graph manufacturing",
    ],
    lastmod: "2026-11-22",
  },
  {
    key: "iot",
    path: "industrial-iot-digital-twins",
    nav: "Industrial IoT & Digital Twins",
    navDetail: "Machine signals, live equipment state, production context",
    title: "Industrial IoT & Real-Time Digital Twins for Manufacturing",
    description:
      "Connect CNC machines, PLCs and sensors to a real-time digital twin, and link machine state to work orders, downtime and maintenance in your ERP and MES.",
    keywords: [
      "industrial IoT solutions India",
      "real-time digital twin for manufacturing",
      "CNC machine monitoring integration",
      "machine downtime tracking",
      "edge gateway manufacturing",
      "IoT ERP MES integration",
    ],
    lastmod: "2026-11-22",
  },
  {
    key: "agentic",
    path: "agentic-erp-crm",
    nav: "Agentic ERP & CRM",
    navDetail: "Specialised agents, approved tools, human approval",
    title: "Agentic ERP & CRM — AI Agents for Manufacturing Operations",
    description:
      "Specialised AI agents for sales, operations, finance and analysis that use approved tools and your ERP and CRM data, with human approval and an audit trail.",
    keywords: [
      "AI agents for manufacturing ERP",
      "agentic ERP",
      "AI CRM agents",
      "multi-agent orchestration",
      "ERP workflow automation",
      "human in the loop AI",
    ],
    lastmod: "2026-11-22",
  },
  {
    key: "cadCam",
    path: "cad-cam-cnc-integration",
    nav: "CAD/CAM & CNC Integration",
    navDetail: "Revisions, BOMs and programs linked to orders and production",
    title: "CAD/CAM, CNC & ERP Integration for Precision Manufacturing",
    description:
      "Link drawings, revisions, BOMs, CAM program references, machines and inspection results to sales orders and planning, without replacing your CAD/CAM tools.",
    keywords: [
      "CAD CAM ERP integration",
      "engineering change management manufacturing",
      "CNC program version control",
      "BOM ERP integration",
      "part traceability software",
      "precision engineering software integration",
    ],
    lastmod: "2026-11-22",
  },
  {
    key: "manufacturing",
    path: "manufacturing-solutions",
    nav: "Manufacturing Solutions",
    navDetail: "Connected systems by type of manufacturing",
    title: "Manufacturing Solutions — Connected Systems by Industry",
    description:
      "Connected-systems approaches for CNC shops, automotive components, fabrication, machinery, electronics, process and multi-plant manufacturing.",
    keywords: [
      "manufacturing automation software",
      "CNC shop software integration",
      "automotive component manufacturing software",
      "metal fabrication ERP integration",
      "multi-plant manufacturing systems",
      "smart manufacturing India",
    ],
    lastmod: "2026-11-22",
  },
  {
    key: "audit",
    path: "industrial-systems-audit",
    nav: "Industrial Systems Audit",
    navDetail: "Describe your factory. Get a clear starting point.",
    title: "Book an Industrial Systems Audit",
    description:
      "Describe your machines, software and the handoffs between them in plain words. We reply within one business day and start with a free conversation.",
    keywords: [
      "industrial systems audit",
      "factory systems assessment",
      "manufacturing digital transformation audit",
      "ERP integration assessment",
      "machine connectivity assessment",
    ],
    lastmod: "2026-11-22",
  },
];

export function getPlatformPage(key: PlatformPageKey): PlatformPage {
  const page = PLATFORM_PAGES.find((p) => p.key === key);
  if (!page) throw new Error(`Unknown platform page: ${key}`);
  return page;
}

/** Site-relative href, for LocalizedLink and the navigation. */
export function platformHref(key: PlatformPageKey): string {
  return `/${getPlatformPage(key).path}`;
}

/**
 * Locales in which these pages are written. Every locale still RESOLVES (the
 * navigation links to them from all eight), but the body is English, so a
 * non-English URL declares the English page as its canonical and stays out of
 * the sitemap and the hreflang cluster. That is the lesson recorded against
 * INDEXABLE_LOCALES in lib/constants.ts: an English body under /hi/ reads to a
 * search engine as a duplicate or a poor translation. Add a locale here only
 * when the page content exists in that language.
 */
export const PLATFORM_LOCALES: readonly string[] = ["en"];

export function isPlatformLocale(locale: string): boolean {
  return PLATFORM_LOCALES.includes(locale);
}

/**
 * Shown at the top of these pages on a non-English URL, in the visitor's own
 * language, so an English page under /hi/ or /de/ explains itself.
 */
export const PLATFORM_LOCALE_NOTICE: Readonly<Record<string, string>> = {
  hi: "यह पृष्ठ अभी केवल अंग्रेज़ी में उपलब्ध है।",
  gu: "આ પૃષ્ઠ હાલમાં ફક્ત અંગ્રેજીમાં ઉપલબ્ધ છે.",
  es: "Esta página está disponible por ahora solo en inglés.",
  fr: "Cette page n’est pour l’instant disponible qu’en anglais.",
  de: "Diese Seite ist derzeit nur auf Englisch verfügbar.",
  ar: "هذه الصفحة متاحة حاليًا باللغة الإنجليزية فقط.",
  zh: "此页面目前仅提供英文版本。",
};
