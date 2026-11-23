// lib/research/markdown.ts
//
// A report as Markdown, for /llms-full.txt. Pure: the caller supplies how a
// site path becomes an absolute URL and which site links may be kept (a link
// to a blog post that is not published yet is printed as plain text, so the
// file never points an assistant at a 404).

import type { ResearchBlock, ResearchReport } from "./types";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export interface MarkdownOptions {
  /** Site path ("/factory-graph") → absolute URL. */
  absolute: (path: string) => string;
  /** False drops the link and keeps its text. Called for site paths only. */
  keepSiteLink?: (path: string) => boolean;
}

function inline(text: string, { absolute, keepSiteLink = () => true }: MarkdownOptions): string {
  return text.replace(LINK, (_, anchor: string, href: string) => {
    if (!href.startsWith("/")) return `[${anchor}](${href})`;
    return keepSiteLink(href.split("#")[0]) ? `[${anchor}](${absolute(href)})` : anchor;
  });
}

const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n+/g, " ");

function block(b: ResearchBlock, o: MarkdownOptions): string[] {
  switch (b.type) {
    case "p":
      return [inline(b.text, o), ""];
    case "h3":
      return [`##### ${b.text}`, ""];
    case "list":
      return [...b.items.map((item, i) => `${b.ordered ? `${i + 1}.` : "-"} ${inline(item, o)}`), ""];
    case "table":
      return [
        `**${b.caption}**`,
        "",
        `| ${b.columns.map(cell).join(" | ")} |`,
        `| ${b.columns.map(() => "---").join(" | ")} |`,
        ...b.rows.map((row) => `| ${row.map((c) => cell(inline(c, o))).join(" | ")} |`),
        "",
        ...(b.note ? [`_${inline(b.note, o)}_`, ""] : []),
      ];
    case "callout": {
      const label = b.tone === "view" ? "Our reading" : b.tone === "caution" ? "Caution" : "Finding";
      return [`> **${label}: ${b.title}** ${inline(b.text, o)}`, ""];
    }
    case "stats":
      return [...b.items.map((s) => `- **${s.value}** — ${s.label} ([${s.source.label}](${s.source.url}))`), ""];
    case "quote":
      return [`> “${b.text}” — ${b.url ? `[${b.cite}](${b.url})` : b.cite}`, ""];
  }
}

export function reportMarkdown(report: ResearchReport, url: string, o: MarkdownOptions): string[] {
  return [
    `### ${report.title}`,
    "",
    `URL: ${url} · Published ${report.publishedAt} · Updated ${report.updatedAt} · Facts checked ${report.dataAsOf} · Savin Group Research`,
    "",
    inline(report.lead, o),
    "",
    "**Key findings:**",
    "",
    ...report.keyFindings.map((s) => `- **${s.value}** — ${s.label} ([${s.source.label}](${s.source.url}))`),
    "",
    "**Summary:**",
    "",
    ...report.summary.map((point) => `- ${inline(point, o)}`),
    "",
    ...report.sections.flatMap((section) => [
      `#### ${section.title}`,
      "",
      `**Short answer:** ${inline(section.answer, o)}`,
      "",
      ...section.blocks.flatMap((b) => block(b, o)),
    ]),
    "#### How this report was researched",
    "",
    ...report.method.map((line) => `- ${inline(line, o)}`),
    "",
    `#### ${report.shortTitle}: questions and answers`,
    "",
    ...report.faq.flatMap((f) => [`##### ${f.q}`, "", f.a, ""]),
  ];
}
