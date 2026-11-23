// lib/research/types.ts
//
// The content model of the Research library (/research): long, cited reports
// on the software a manufacturer or a brand runs, department by department,
// and on where AI agents fit into it.
//
// Pure types, no imports beyond the platform page keys. The reports are data
// files (./reports/*.ts) so the page, the sitemap, /llms-full.txt and the
// tests all read the same text, and a claim cannot appear in one and not in
// the others.
//
// Writing rules every report follows (checked by scripts/research.test.mjs
// where a machine can check them):
//
//   - Every figure, date and quotation comes from a cited, linked source.
//     Vendor-reported numbers say so ("vendor-reported", "the company says").
//   - A section opens with `answer`: two or three sentences that answer the
//     section's question on their own. That is the text a search engine or an
//     AI assistant quotes, so it must stand without the rest of the page.
//   - Inline links use `[anchor](href)`. `href` is either an absolute https URL
//     (a source) or a site path starting with "/" (another page here).
//   - Opinion and synthesis are labelled as such ("Our reading", "In our
//     view"), never presented as a finding.

import type { PlatformPageKey } from "@/lib/platform/pages";

export interface ResearchSource {
  label: string;
  url: string;
}

/** A headline number with the source it came from. */
export interface ResearchStat {
  value: string;
  label: string;
  source: ResearchSource;
}

export type ResearchBlock =
  /** A paragraph. Inline `[anchor](href)` links allowed. */
  | { type: "p"; text: string }
  /** A short sub-heading inside a section (rendered as h3). */
  | { type: "h3"; text: string }
  /** A list. Items allow inline links. */
  | { type: "list"; items: string[]; ordered?: boolean }
  /**
   * A table. Every row has exactly `columns.length` cells. Cells allow inline
   * links. `note` is printed under the table (method, caveats, as-of date).
   */
  | { type: "table"; caption: string; columns: string[]; rows: string[][]; note?: string }
  /**
   * A boxed aside. `finding` = a sourced fact worth stopping on; `caution` =
   * a limit, risk or conflicting evidence; `view` = our reading (opinion).
   */
  | { type: "callout"; tone: "finding" | "caution" | "view"; title: string; text: string }
  /** A row of two to four headline numbers. */
  | { type: "stats"; items: ResearchStat[] }
  /** A quotation from a named person or document. */
  | { type: "quote"; text: string; cite: string; url?: string };

export interface ResearchSection {
  /** Anchor id, kebab-case, unique within the report. */
  id: string;
  /** Two to four words for the table of contents. */
  kicker: string;
  /** The h2: phrased as the question a reader searches for, or its answer. */
  title: string;
  /** Answer-first summary: two or three sentences that stand alone. */
  answer: string;
  blocks: ResearchBlock[];
}

export interface ResearchFaq {
  q: string;
  a: string;
}

export interface ResearchReport {
  /** URL segment under /research/. Lowercase, hyphenated, ASCII. */
  slug: string;
  /** Short name for cards, navigation and breadcrumbs (≤ 40 chars). */
  shortTitle: string;
  /** <title>. 45–65 characters; the layout appends " · Savin Group". */
  title: string;
  /** Visible h1 in two parts; the second takes the accent colour. */
  h1: [string, string];
  /** Meta description, 120–165 characters. */
  description: string;
  /** Mono label above the h1, e.g. "Research · Manufacturing software". */
  eyebrow: string;
  /** The opening paragraph under the h1. */
  lead: string;
  /** The search phrase the page is written to rank for. */
  primaryKeyword: string;
  /** Secondary phrases (5–10). */
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  /** The date the underlying facts were checked, as an ISO date. */
  dataAsOf: string;
  readMinutes: number;
  /** Four headline numbers for the top of the page. */
  keyFindings: ResearchStat[];
  /** Five to eight bullet points: the whole report in one screen. */
  summary: string[];
  sections: ResearchSection[];
  /** How the facts were gathered and what could not be checked. */
  method: string[];
  faq: ResearchFaq[];
  /** Factory Graph pages this report supports, most relevant first. */
  platformLinks: PlatformPageKey[];
  /** Slugs of other reports to recommend. */
  relatedReports: string[];
  /** Blog post slugs written as spokes of this report (rendered if published). */
  blogSlugs: string[];
}
