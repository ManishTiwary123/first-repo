// lib/platform/seo.ts
//
// Metadata and structured data for the Factory Graph pages.
//
// These pages differ from the rest of the site in one way: their body exists
// in English only (PLATFORM_LOCALES in ./pages.ts). So:
//
//   /in/en/factory-graph   indexable, self-canonical, member of an hreflang
//                          cluster that spans the hreflang markets in English
//   /in/hi/factory-graph   renders (the navigation links to it), but declares
//                          /in/en/factory-graph as canonical and joins no
//                          cluster, so it is consolidated instead of competing
//
// The sitemap lists exactly the URLs that are their own canonical here; a test
// in scripts/sitemap.test.mjs holds the two together.
//
// Titles and descriptions are not rewritten per country. The page says the
// same thing in every market, and a title that only swaps a place name is the
// doorway-page pattern this site should not add to.

import type { Metadata } from "next";
import { BASE_URL, ORGANIZATION_ID, isIndexable } from "@/lib/constants";
import { normalizePublicUrl } from "@/lib/public-url";
import { resolveAlternates } from "@/lib/seo";
import { PLATFORM_LOCALES, getPlatformPage, type PlatformPageKey } from "./pages";

export interface PlatformAlternates {
  canonical: string;
  languages?: Record<string, string>;
}

export function buildPlatformAlternates({
  country,
  locale,
  subPath,
}: {
  country: string;
  locale: string;
  subPath: string;
}): PlatformAlternates {
  // The site-wide rule (lib/seo.ts), with the languages these pages are
  // written in: other locales and other countries point at /in/en/.
  return resolveAlternates({ country, locale, subPath, locales: PLATFORM_LOCALES });
}

export function buildPlatformMetadata({
  page,
  country,
  locale,
}: {
  page: PlatformPageKey;
  country: string;
  locale: string;
}): Metadata {
  const entry = getPlatformPage(page);
  const alternates = buildPlatformAlternates({ country, locale, subPath: entry.path });
  const url = `${BASE_URL}${alternates.canonical}`;
  const socialTitle = `${entry.title} · Savin Group`;
  const indexable = isIndexable(country, locale);

  return {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    metadataBase: new URL(BASE_URL),
    alternates,
    openGraph: {
      title: socialTitle,
      description: entry.description,
      url,
      siteName: "Savin Group",
      // The content language, which is English whatever the URL's locale.
      locale: `en_${country.toUpperCase()}`,
      type: "website",
      images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630, alt: "Savin Group" }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: entry.description,
      images: [`${BASE_URL}/og.png`],
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
        }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    authors: [{ name: "Savin Group" }],
    creator: "Savin Group",
    publisher: "Savin Group",
  };
}

/* -------------------------------------------------------------------------- */
/*                               Structured data                              */
/* -------------------------------------------------------------------------- */

const absolute = (country: string, pathname: string) => normalizePublicUrl({ country, locale: "en", pathname });

/** Home › Factory Graph › (this page). The flagship page is its own second level. */
export function buildPlatformBreadcrumbJsonLd(page: PlatformPageKey, country: string) {
  const entry = getPlatformPage(page);
  const items = [
    { name: "Home", url: absolute(country, "") },
    { name: "Factory Graph", url: absolute(country, getPlatformPage("factoryGraph").path) },
  ];
  if (page !== "factoryGraph") items.push({ name: entry.nav, url: absolute(country, entry.path) });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * `Service`, not `SoftwareApplication` or `Product`: those invite an offer
 * price and an aggregate rating, and the site has neither to state honestly
 * (see the note on AggregateRating in the locale layout).
 */
export function buildPlatformServiceJsonLd(page: PlatformPageKey, country: string, serviceType: string) {
  const entry = getPlatformPage(page);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: entry.nav,
    serviceType,
    description: entry.description,
    url: absolute(country, entry.path),
    provider: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Savin Group", url: BASE_URL },
  };
}

/** Serialises JSON-LD for a <script> tag; `<` is escaped so no value can close the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
