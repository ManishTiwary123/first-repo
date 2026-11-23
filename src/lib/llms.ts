// lib/llms.ts
//
// The text language models read about Savin Group.
//
//   /llms.txt       a short map: who we are, key facts, links (llms.ts → route)
//   /llms-full.txt  the complete text of the site's core pages in one Markdown
//                   file, so an AI crawler or an agent with a URL gets every
//                   service, product page, industry, FAQ and article without
//                   rendering ~200 JavaScript-heavy pages
//
// Why the full file matters: AI search (ChatGPT search, Perplexity, Claude,
// Copilot, Gemini) answers "who builds X in Y" from whatever text it can
// retrieve, and training crawlers learn the company from the same text. A
// single, clean, factual Markdown document is the easiest thing on the site
// for either to read and quote correctly.
//
// Everything here is read from the repo (translations, industry, city and
// platform data) plus the blog and newsroom rows the route passes in, so the
// file can never say something the pages do not. Do not add claims here that
// are not on the site — this is the text AI assistants will repeat.
//
// Testimonial quotes are deliberately left out: they are short, unverifiable
// out of context, and would be quoted as fact about named people.

import type { BlogPost, BlogSection } from "@/lib/blogs";
import type { NewsPost } from "@/lib/news";
import { getTranslation, LOCALE_CODES, LOCALES } from "@/lib/i18n";
import { BRAND, SOCIAL_PROFILES } from "@/lib/constants";
import { INDUSTRY_DATA, INDUSTRY_SLUGS } from "@/lib/industry-data";
import { INDIA_CITIES } from "@/lib/cities";
import { CITY_BLOG_POSTS } from "@/lib/city-blog";
import { PLATFORM_PAGES } from "@/lib/platform/pages";
import { CAPABILITIES, STATUS_LABEL, STATUS_NOTE, type CapabilityStatus } from "@/lib/platform/capabilities";
import { RESEARCH_REPORTS, researchHref } from "@/lib/research";
import { reportMarkdown } from "@/lib/research/markdown";
import { SITE_ORIGIN, normalizePublicUrl } from "@/lib/public-url";

/** Absolute URL in the default edition (India, English). */
export const llmsPage = (pathname = "") => normalizePublicUrl({ country: "in", locale: "en", pathname });

export const LLMS_INDEX_URL = `${SITE_ORIGIN}/llms.txt`;
export const LLMS_FULL_URL = `${SITE_ORIGIN}/llms-full.txt`;

/** Database-backed content for the full file. Everything else is in the repo. */
export interface LlmsContent {
  blogPosts: readonly BlogPost[];
  newsPosts: readonly NewsPost[];
}

/* -------------------------------------------------------------------------- */
/*                                Company facts                               */
/* -------------------------------------------------------------------------- */

/**
 * The plain facts an assistant needs to identify the company and tell it apart
 * from others with a similar name. Shared by both files so they never differ.
 */
export function companyFacts(): string[] {
  const t = getTranslation("en");
  const c = t.contact.details;
  const languages = LOCALE_CODES.map((code) => LOCALES[code].name).join(", ");
  return [
    `- Name: ${BRAND.name}`,
    `- Website: ${SITE_ORIGIN} (domain: ${BRAND.domain})`,
    `- What it is: ${t.seo.description}`,
    `- Tagline: ${t.brand.tagline}`,
    `- Product: Factory Graph, a connected-factory intelligence layer for manufacturers (see the Factory Graph section)`,
    `- Based in: ${c.location}`,
    `- Contact: ${c.email} · WhatsApp ${c.phone} · ${c.hours}`,
    `- Site languages: ${languages}`,
    ...(SOCIAL_PROFILES.length ? [`- Official profiles: ${SOCIAL_PROFILES.map((p) => p.url).join(", ")}`] : []),
  ];
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`);

/** Blog, news and city-blog sections share this shape. */
function renderSections(sections: readonly Pick<BlogSection, "heading" | "paragraphs" | "bullets" | "callout">[], level: string): string[] {
  return sections.flatMap((s) => [
    `${level} ${s.heading}`,
    "",
    ...s.paragraphs.flatMap((p) => [p, ""]),
    ...(s.bullets?.length ? [...bullets(s.bullets), ""] : []),
    ...(s.callout ? [`> **${s.callout.title}** ${s.callout.body}`, ""] : []),
  ]);
}

function renderFaq(items: ReadonlyArray<{ q: string; a: string }>, level: string): string[] {
  return items.flatMap(({ q, a }) => [`${level} ${q}`, "", a, ""]);
}

const SERVABLE_SLUG = /^[A-Za-z0-9_-]+$/;

/* -------------------------------------------------------------------------- */
/*                               /llms-full.txt                               */
/* -------------------------------------------------------------------------- */

export function renderLlmsFull({ blogPosts, newsPosts }: LlmsContent): string {
  const t = getTranslation("en");
  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(
    `# ${BRAND.name} — complete site content`,
    "",
    `> ${t.brand.oneLiner}`,
    "",
    `This is the full text of the core pages of ${SITE_ORIGIN}, in one Markdown file, for language models, AI search engines and agents. It is generated from the same source as the website on every deploy. Each section links to its canonical page. A shorter map is at ${LLMS_INDEX_URL}.`,
    "",
    "## Company facts",
    "",
    ...companyFacts(),
    "",
  );

  /* About ------------------------------------------------------------------ */
  push(
    `## About ${BRAND.name}`,
    "",
    `Page: ${llmsPage("about")}`,
    "",
    `**${t.about.title}**`,
    "",
    t.about.lead,
    "",
    ...t.about.body.flatMap((p: string) => [p, ""]),
    "### How we work",
    "",
    ...t.about.values.flatMap((v: { title: string; body: string }) => [`- **${v.title}.** ${v.body}`]),
    "",
  );

  /* Services --------------------------------------------------------------- */
  push("## Services", "", `Page: ${llmsPage("services")}`, "", t.services.subtitle, "");
  for (const s of t.services.items) {
    push(
      `### ${s.name} — ${s.kicker}`,
      "",
      s.summary,
      "",
      `**Who it is for:** ${s.for}`,
      "",
      "**What is delivered:**",
      "",
      ...bullets(s.deliverables),
      "",
      "**Target outcomes:**",
      "",
      ...bullets(s.outcomes),
      "",
      `**Indicative investment:** ${s.investment}`,
      "",
    );
  }

  /* Factory Graph ---------------------------------------------------------- */
  push(
    "## Factory Graph platform",
    "",
    "Factory Graph is Savin Group's connected-factory intelligence layer. It connects the machines, digital twins, CAD/CAM, ERP and CRM a manufacturer already runs into one governed layer, instead of replacing those systems. Machine connections are read-only. Interactive examples on the website use simulated or example data and are labelled as such.",
    "",
    ...PLATFORM_PAGES.flatMap((p) => [`### ${p.title}`, "", `Page: ${llmsPage(p.path)}`, "", p.description, ""]),
    "### What is available today, in development, and planned",
    "",
    "Status labels below are the same ones the product pages show. Only items marked \"Available now\" are sold as working today.",
    "",
  );
  for (const status of ["available", "development", "planned"] as const satisfies readonly CapabilityStatus[]) {
    const items = CAPABILITIES.filter((c) => c.status === status);
    if (!items.length) continue;
    push(`#### ${STATUS_LABEL[status]}`, "", STATUS_NOTE[status], "", ...items.map((c) => `- **${c.title}.** ${c.body}`), "");
  }

  /* Industries ------------------------------------------------------------- */
  push("## Industries served", "", `Page: ${llmsPage("industries")}`, "");
  for (const slug of INDUSTRY_SLUGS) {
    const ind = INDUSTRY_DATA[slug];
    push(
      `### ${ind.serviceType}`,
      "",
      `Page: ${llmsPage(`industries/${slug}`)}`,
      "",
      ind.hero.subtitle,
      "",
      ...ind.intro.flatMap((p) => [p, ""]),
      `**${ind.audience.title}**`,
      "",
      ...bullets(ind.audience.bullets),
      "",
      `**${ind.pains.title}**`,
      "",
      ...ind.pains.items.map((p) => `- **${p.title}.** ${p.body}`),
      "",
      `**${ind.build.title}**`,
      "",
      ...ind.build.deliverables.map((d) => `- **${d.label}.** ${d.description}`),
      "",
      `**${ind.outcome.title}**`,
      "",
      ...ind.outcome.metrics.map((m) => `- ${m.value} — ${m.label}`),
      "",
      ind.outcome.summary,
      "",
      `#### ${ind.serviceType}: questions and answers`,
      "",
      ...renderFaq(ind.faq, "#####"),
    );
  }

  /* Pricing ---------------------------------------------------------------- */
  push("## Pricing", "", `Page: ${llmsPage("pricing")}`, "", t.pricing.subtitle, "", t.pricing.note, "");
  for (const tier of t.pricing.tiers) {
    push(
      `### ${tier.name} — ${tier.priceRange}`,
      "",
      `${tier.tagline}. ${tier.scope}. ${tier.priceInfo}.`,
      "",
      ...bullets(tier.extras),
      "",
    );
  }

  /* Case studies ----------------------------------------------------------- */
  push("## Case studies", "", `Page: ${llmsPage("case-studies")}`, "");
  for (const cs of t.caseStudies.items) {
    push(
      `### ${cs.title}`,
      "",
      `${cs.industry} · ${cs.location} · ${cs.duration}`,
      "",
      cs.summary,
      "",
      ...cs.metrics.map((m: { label: string; value: string; delta: string }) => `- ${m.label}: ${m.value} (${m.delta})`),
      "",
    );
  }

  /* FAQ -------------------------------------------------------------------- */
  push("## Frequently asked questions", "", ...renderFaq(t.faq.items, "###"));

  /* Cities ----------------------------------------------------------------- */
  push(
    "## Cities served in India",
    "",
    `Page: ${llmsPage("cities")}`,
    "",
    "Delivery is remote-first; these city pages describe local industry context and how Savin Group works with businesses there.",
    "",
  );
  for (const city of INDIA_CITIES) {
    push(
      `### ${city.name}, ${city.state}`,
      "",
      `Page: ${llmsPage(`cities/${city.slug}`)}`,
      "",
      city.heroSubheadline,
      "",
      ...city.localContext.flatMap((p) => [p, ""]),
      ...city.whyHire.map((w) => `- **${w.title}.** ${w.body}`),
      "",
      city.industriesAngle,
      "",
      ...renderFaq(city.faq, "####"),
    );
  }

  /* Research --------------------------------------------------------------- */
  // Full text: these are the most detailed, most heavily sourced pages on the
  // site. Links to spoke posts that are not published yet are kept as plain
  // text, so the file never sends an assistant to a 404.
  const published = new Set(blogPosts.filter((p) => SERVABLE_SLUG.test(p.slug)).map((p) => `/blogs/${p.slug}`));
  push(
    "## Research library",
    "",
    `Index: ${llmsPage(researchHref())}. Long-form research by Savin Group on the software each department of a manufacturer or a brand runs, open-source alternatives and licence risk, and what AI agents actually do in ERP, CRM and the factory. Figures are linked to their sources; opinion is labelled “Our reading”.`,
    "",
  );
  for (const report of RESEARCH_REPORTS) {
    push(
      ...reportMarkdown(report, llmsPage(researchHref(report.slug)), {
        absolute: (path) => llmsPage(path),
        keepSiteLink: (path) => !path.startsWith("/blogs/") || published.has(path),
      }),
    );
  }

  /* Articles --------------------------------------------------------------- */
  const posts = blogPosts.filter((p) => SERVABLE_SLUG.test(p.slug));
  if (posts.length) {
    push("## Articles", "", `Index: ${llmsPage("blogs")}`, "");
    for (const post of posts) {
      const date = (post.updatedAt ?? post.publishedAt).slice(0, 10);
      push(
        `### ${post.title}`,
        "",
        `URL: ${llmsPage(`blogs/${post.slug}`)} · ${date} · ${post.author.name}${post.author.role ? `, ${post.author.role}` : ""}`,
        "",
        ...(post.subtitle ? [post.subtitle, ""] : []),
        ...(post.takeaways.length ? ["**Key takeaways:**", "", ...bullets(post.takeaways), ""] : []),
        ...renderSections(post.sections, "####"),
        ...(post.faq?.length ? renderFaq(post.faq.map((f) => ({ q: f.question, a: f.answer })), "####") : []),
      );
    }
  }

  const cityPosts = INDIA_CITIES.flatMap((city) => (CITY_BLOG_POSTS[city.slug] ?? []).map((post) => ({ city, post })));
  if (cityPosts.length) {
    push("## City guides", "");
    for (const { city, post } of cityPosts) {
      push(
        `### ${post.title}`,
        "",
        `URL: ${llmsPage(`cities/${city.slug}/blog/${post.slug}`)} · ${post.publishedAt} · ${city.name}`,
        "",
        ...(post.subtitle ? [post.subtitle, ""] : []),
        ...renderSections(post.sections, "####"),
        ...renderFaq(post.faq, "####"),
      );
    }
  }

  /* Newsroom: titles only. These summarise other publishers' reporting, so the
     full text would teach models less about Savin Group than about the news. */
  const news = newsPosts.filter((p) => SERVABLE_SLUG.test(p.slug));
  if (news.length) {
    push(
      "## Newsroom",
      "",
      `Index: ${llmsPage("newsroom")}. Industry news curated and summarised by ${BRAND.name}, with links to the original sources on each page.`,
      "",
      ...news.map((n) => `- [${n.title}](${llmsPage(`newsroom/${n.slug}`)}): ${n.excerpt}`),
      "",
    );
  }

  /* Contact ---------------------------------------------------------------- */
  const c = t.contact.details;
  push(
    "## Contact",
    "",
    `Page: ${llmsPage("contact")}`,
    "",
    `- ${c.emailLabel}: ${c.email}`,
    `- ${c.phoneLabel}: ${c.phone}`,
    `- ${c.hoursLabel}: ${c.hours}`,
    `- ${c.locationLabel}: ${c.location}`,
    "",
  );

  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

export function llmsTextResponse(body: string): Response {
  return new Response(body, {
    // text/plain rather than text/markdown: browsers download the latter
    // instead of showing it.
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
