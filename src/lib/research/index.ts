// lib/research/index.ts
//
// The registry of the Research library. One list, read by the pages, the
// sitemap, /llms.txt, /llms-full.txt, the navigation and the tests.
//
// Like the Factory Graph pages, the reports are written in English only.
// Every locale RESOLVES (navigation links there from all eight), but a
// non-English URL declares the English page canonical and stays out of the
// sitemap; see RESEARCH_LOCALES and lib/platform/seo.ts.

import type { ResearchReport } from "./types";
import { MANUFACTURING_SOFTWARE_REPORT } from "./reports/manufacturing-software";
import { FACTORY_GRAPH_REPORT } from "./reports/factory-graph";
import { FUTURE_ERP_CRM_REPORT } from "./reports/future-erp-crm";
import { AGENT_ORCHESTRATION_REPORT } from "./reports/agent-orchestration";
import { HUB_EMBEDDING_REPORT } from "./reports/hub-embedding";
import { BACK_OFFICE_REPORT } from "./reports/back-office";
import { COMMERCE_MARKETING_REPORT } from "./reports/commerce-marketing";

export type { ResearchReport, ResearchSection, ResearchBlock, ResearchStat, ResearchSource, ResearchFaq } from "./types";

/** Path of the library after `/{country}/{locale}/`. */
export const RESEARCH_PATH = "research";

/** Display order on the hub: the factory first, then outward. */
export const RESEARCH_REPORTS: readonly ResearchReport[] = [
  MANUFACTURING_SOFTWARE_REPORT,
  FACTORY_GRAPH_REPORT,
  FUTURE_ERP_CRM_REPORT,
  AGENT_ORCHESTRATION_REPORT,
  HUB_EMBEDDING_REPORT,
  BACK_OFFICE_REPORT,
  COMMERCE_MARKETING_REPORT,
];

export function getResearchReport(slug: string): ResearchReport | undefined {
  return RESEARCH_REPORTS.find((report) => report.slug === slug);
}

/** Site-relative href, for LocalizedLink and in-text links. */
export const researchHref = (slug?: string) => (slug ? `/${RESEARCH_PATH}/${slug}` : `/${RESEARCH_PATH}`);

/** Locales the reports are written in. See the note at the top. */
export const RESEARCH_LOCALES: readonly string[] = ["en"];

export const isResearchLocale = (locale: string) => RESEARCH_LOCALES.includes(locale);

/** The hub page's own metadata. */
export const RESEARCH_HUB = {
  title: "Industrial Software Research 2026 — Tools, AI Agents, Open Source",
  description:
    "Seven cited research reports on the software every department runs, open-source alternatives, licence risk and what AI agents really do in ERP, CRM and factories.",
  keywords: [
    "manufacturing software research",
    "open source alternatives to SaaS",
    "AI agents ERP CRM research",
    "factory software stack",
    "industrial software report 2026",
    "SaaS sprawl research",
  ],
} as const;

/** The hub changes whenever a report does. */
export function researchHubLastmod(): string {
  return RESEARCH_REPORTS.map((r) => r.updatedAt).sort().pop() ?? "2026-11-23";
}
