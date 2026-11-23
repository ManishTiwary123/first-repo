// lib/research/seo.ts
//
// Metadata and structured data for the Research library.
//
// Canonical rules are the site's one rule, `resolveAlternates` in lib/seo.ts,
// with the reports' written languages (RESEARCH_LOCALES, English only):
//
//   /in/en/research/{slug}   the edition: self-canonical, in the hreflang cluster
//   /in/hi/research/{slug}   renders, declares /in/en/… canonical, no cluster
//   /us/en/research/{slug}   renders, declares /in/en/… canonical, no cluster
//
// The sitemap lists exactly the self-canonical URLs (lib/sitemap.ts).

import type { Metadata } from "next";
import { BASE_URL, ORGANIZATION_ID, isIndexable } from "@/lib/constants";
import { resolveAlternates } from "@/lib/seo";
import { RESEARCH_HUB, RESEARCH_LOCALES, RESEARCH_PATH, RESEARCH_REPORTS, researchHref } from "./index";
import { plainText, reportSources, wordCount } from "./text";
import type { ResearchReport } from "./types";

export function buildResearchAlternates({ country, locale, subPath }: { country: string; locale: string; subPath: string }) {
  return resolveAlternates({ country, locale, subPath, locales: RESEARCH_LOCALES });
}

function robots(country: string, locale: string): Metadata["robots"] {
  return isIndexable(country, locale)
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
      }
    : { index: false, follow: true, googleBot: { index: false, follow: true } };
}

const OG_IMAGE = { url: `${BASE_URL}/og.png`, width: 1200, height: 630, alt: "Savin Group Research" };

export function buildResearchHubMetadata({ country, locale }: { country: string; locale: string }): Metadata {
  const alternates = buildResearchAlternates({ country, locale, subPath: RESEARCH_PATH });
  const title = `${RESEARCH_HUB.title} · Savin Group`;
  return {
    title: RESEARCH_HUB.title,
    description: RESEARCH_HUB.description,
    keywords: [...RESEARCH_HUB.keywords],
    metadataBase: new URL(BASE_URL),
    alternates,
    openGraph: {
      title,
      description: RESEARCH_HUB.description,
      url: `${BASE_URL}${alternates.canonical}`,
      siteName: "Savin Group",
      locale: `en_${country.toUpperCase()}`,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description: RESEARCH_HUB.description, images: [OG_IMAGE.url] },
    robots: robots(country, locale),
  };
}

export function buildResearchReportMetadata({
  report,
  country,
  locale,
}: {
  report: ResearchReport;
  country: string;
  locale: string;
}): Metadata {
  const alternates = buildResearchAlternates({ country, locale, subPath: researchHref(report.slug).slice(1) });
  const title = `${report.title} · Savin Group`;
  return {
    title: report.title,
    description: report.description,
    keywords: [report.primaryKeyword, ...report.keywords],
    metadataBase: new URL(BASE_URL),
    alternates,
    authors: [{ name: "Savin Group Research", url: `${BASE_URL}/${country}/en/${RESEARCH_PATH}` }],
    creator: "Savin Group",
    publisher: "Savin Group",
    openGraph: {
      title,
      description: report.description,
      url: `${BASE_URL}${alternates.canonical}`,
      siteName: "Savin Group",
      locale: `en_${country.toUpperCase()}`,
      type: "article",
      publishedTime: report.publishedAt,
      modifiedTime: report.updatedAt,
      authors: ["Savin Group Research"],
      section: "Research",
      tags: [report.primaryKeyword, ...report.keywords],
      images: [{ ...OG_IMAGE, alt: report.title }],
    },
    twitter: { card: "summary_large_image", title, description: report.description, images: [OG_IMAGE.url] },
    robots: robots(country, locale),
    other: {
      "article:published_time": report.publishedAt,
      "article:modified_time": report.updatedAt,
      "article:section": "Research",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                               Structured data                              */
/* -------------------------------------------------------------------------- */

/**
 * Absolute URL of the canonical copy, so structured data on a non-edition URL
 * (/us/en/research/…) names the page Google is told to keep.
 */
const url = (country: string, pathname: string) =>
  `${BASE_URL}${buildResearchAlternates({ country, locale: "en", subPath: pathname.replace(/^\//, "") }).canonical}`;

const PUBLISHER = { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Savin Group", url: BASE_URL };

export function buildResearchBreadcrumbJsonLd(country: string, report?: ResearchReport) {
  const items = [
    { name: "Home", item: url(country, "") },
    { name: "Research", item: url(country, RESEARCH_PATH) },
    ...(report ? [{ name: report.shortTitle, item: url(country, researchHref(report.slug)) }] : []),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, ...it })),
  };
}

/**
 * `Article` (Google's supported type) describing a research report. Sources
 * go in `citation`, which is what the page actually cites, link for link.
 */
export function buildResearchArticleJsonLd(report: ResearchReport, country: string) {
  const pageUrl = url(country, researchHref(report.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: report.title,
    alternativeHeadline: `${report.h1[0]} ${report.h1[1]}`,
    description: report.description,
    genre: "Research report",
    inLanguage: "en",
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    image: OG_IMAGE.url,
    datePublished: report.publishedAt,
    dateModified: report.updatedAt,
    author: { "@type": "Organization", name: "Savin Group Research", url: url(country, RESEARCH_PATH), parentOrganization: { "@id": ORGANIZATION_ID } },
    publisher: PUBLISHER,
    keywords: [report.primaryKeyword, ...report.keywords].join(", "),
    about: report.primaryKeyword,
    articleSection: report.sections.map((s) => s.title),
    abstract: report.summary.map(plainText).join(" "),
    wordCount: wordCount(report),
    isPartOf: { "@type": "CollectionPage", "@id": `${url(country, RESEARCH_PATH)}#collection` },
    citation: reportSources(report).map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
  };
}

export function buildResearchHubJsonLd(country: string) {
  const hubUrl = url(country, RESEARCH_PATH);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#collection`,
    name: RESEARCH_HUB.title,
    description: RESEARCH_HUB.description,
    url: hubUrl,
    inLanguage: "en",
    publisher: PUBLISHER,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: RESEARCH_REPORTS.map((report, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: url(country, researchHref(report.slug)),
        name: report.title,
      })),
    },
  };
}
