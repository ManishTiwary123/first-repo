// lib/research/text.ts
//
// Pure helpers over the report text: the inline `[anchor](href)` syntax, the
// plain-text form used in JSON-LD and /llms-full.txt, and the list of sources
// a report cites. No imports, so tests and client code can load it.

import type { ResearchBlock, ResearchReport } from "./types";

export type InlineToken =
  | { kind: "text"; value: string }
  | { kind: "link"; value: string; href: string };

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Splits text into plain runs and `[anchor](href)` links. */
export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ kind: "text", value: text.slice(last, index) });
    tokens.push({ kind: "link", value: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length) tokens.push({ kind: "text", value: text.slice(last) });
  return tokens;
}

/** The text with link syntax removed: "[Gartner](https://…)" → "Gartner". */
export function plainText(text: string): string {
  return text.replace(LINK, "$1");
}

/** Markdown form for /llms-full.txt: site paths become absolute URLs. */
export function markdownText(text: string, absolute: (path: string) => string): string {
  return text.replace(LINK, (_, anchor: string, href: string) =>
    `[${anchor}](${href.startsWith("/") ? absolute(href) : href})`,
  );
}

export const isExternal = (href: string) => /^https:\/\//.test(href);

/** Every piece of text in a block, in reading order. */
export function blockTexts(block: ResearchBlock): string[] {
  switch (block.type) {
    case "p":
    case "h3":
      return [block.text];
    case "list":
      return block.items;
    case "table":
      return [block.caption, ...block.columns, ...block.rows.flat(), ...(block.note ? [block.note] : [])];
    case "callout":
      return [block.title, block.text];
    case "stats":
      return block.items.flatMap((item) => [item.value, item.label]);
    case "quote":
      return [block.text, block.cite];
  }
}

/** Every piece of text in a report, for word counts and link checks. */
export function reportTexts(report: ResearchReport): string[] {
  return [
    report.lead,
    ...report.summary,
    ...report.keyFindings.flatMap((s) => [s.value, s.label]),
    ...report.sections.flatMap((section) => [section.title, section.answer, ...section.blocks.flatMap(blockTexts)]),
    ...report.method,
    ...report.faq.flatMap((f) => [f.q, f.a]),
  ];
}

/** Every link href written in a report's text (sources and site paths). */
export function reportLinks(report: ResearchReport): string[] {
  const hrefs: string[] = [];
  for (const text of reportTexts(report)) {
    for (const match of text.matchAll(LINK)) hrefs.push(match[2]);
  }
  for (const stat of report.keyFindings) hrefs.push(stat.source.url);
  for (const section of report.sections) {
    for (const block of section.blocks) {
      if (block.type === "stats") for (const item of block.items) hrefs.push(item.source.url);
      if (block.type === "quote" && block.url) hrefs.push(block.url);
    }
  }
  return hrefs;
}

/**
 * The distinct external sources a report cites, in first-cited order, each
 * with the first anchor text it was cited under. Fragments are ignored when
 * comparing, so two links into one page count once.
 */
export function reportSources(report: ResearchReport): Array<{ label: string; url: string }> {
  const seen = new Map<string, { label: string; url: string }>();
  const add = (label: string, url: string) => {
    if (!isExternal(url)) return;
    const key = url.split("#")[0];
    if (!seen.has(key)) seen.set(key, { label, url });
  };
  for (const stat of report.keyFindings) add(stat.source.label, stat.source.url);
  for (const text of reportTexts(report)) {
    for (const match of text.matchAll(LINK)) add(match[1], match[2]);
  }
  for (const section of report.sections) {
    for (const block of section.blocks) {
      if (block.type === "stats") for (const item of block.items) add(item.source.label, item.source.url);
      if (block.type === "quote" && block.url) add(block.cite, block.url);
    }
  }
  return [...seen.values()];
}

export function wordCount(report: ResearchReport): number {
  return reportTexts(report)
    .map((t) => plainText(t).split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);
}
