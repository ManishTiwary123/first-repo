/**
 * Offline tests for the Research library (/research) and its blog spokes.
 *
 *   node --test scripts/research.test.mjs
 *
 * Loads the real modules through Node's TypeScript type stripping
 * (Node >= 22.18). Nothing renders React or touches the network.
 *
 * Most checks are about the text, because the text is the product here:
 * SEO lengths, a stand-alone answer per section, tables that line up, every
 * link going to a source over https or to a page this site really serves,
 * and no internal working notes leaking onto a public page.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

const SRC = new URL("../src/", import.meta.url).href;
register(
  "data:text/javascript," +
    encodeURIComponent(`
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const SRC = ${JSON.stringify(SRC)};
function withExtension(href) {
  if (/\\.(ts|tsx|mjs|js|json)$/.test(href)) return href;
  for (const ext of [".ts", ".tsx", "/index.ts"]) {
    if (existsSync(fileURLToPath(href + ext))) return href + ext;
  }
  return href;
}
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) return next(withExtension(new URL(specifier.slice(2), SRC).href), context);
  if (specifier.startsWith(".") && context.parentURL?.startsWith(SRC)) {
    return next(withExtension(new URL(specifier, context.parentURL).href), context);
  }
  try {
    return await next(specifier, context);
  } catch (err) {
    if (err?.code === "ERR_MODULE_NOT_FOUND" && /^[@\\w]/.test(specifier) && !/\\.\\w+$/.test(specifier)) {
      return next(specifier + ".js", context);
    }
    throw err;
  }
}
export async function load(url, context, next) {
  if (url.startsWith(SRC) && url.endsWith(".json")) {
    return { format: "module", source: "export default " + (await readFile(new URL(url), "utf8")) + ";", shortCircuit: true };
  }
  return next(url, context);
}
`),
);

const research = await import("../src/lib/research/index.ts");
const text = await import("../src/lib/research/text.ts");
const { PLATFORM_PAGES } = await import("../src/lib/platform/pages.ts");
const { STATIC_PAGES } = await import("../src/lib/constants.ts");
const { INDUSTRY_SLUGS } = await import("../src/lib/industry-data.ts");
const { RESEARCH_POSTS } = await import("../supabase/research-posts.seed.ts");
const { BLOG_POSTS } = await import("../supabase/blog-posts.seed.ts");

const { RESEARCH_REPORTS } = research;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CATEGORIES = ["growth", "automation", "seo", "case-study", "ops"];
const SKETCHES = ["auditLens", "leakyFunnel", "whatsappFlow", "layerStack", "seoPeakGraph", "procurementFlow"];

/** Phrases from internal research notes that must never reach a public page. */
const LEAKS = [
  /\brequester\b/i,
  /\[S\]/,
  /\[bg\]/,
  /\b(TODO|TBD|FIXME|lorem ipsum)\b/i,
  /ErpDoctypeMeta|erp\.doc\.|bot_processes|run_learnings|spawnKey|ACTION_PERMISSIONS/,
  /\bno Docker\b|Node 24\.\d|development PC/i,
  /\bSTUB\b/,
];

/** Every site path a report or post may link to (without the /{country}/{locale} prefix). */
const SITE_PATHS = new Set([
  "/",
  ...STATIC_PAGES.filter(Boolean).map((p) => `/${p}`),
  "/blogs",
  "/newsroom",
  "/cities",
  ...PLATFORM_PAGES.map((p) => `/${p.path}`),
  research.researchHref(),
  ...RESEARCH_REPORTS.map((r) => research.researchHref(r.slug)),
  ...INDUSTRY_SLUGS.map((s) => `/industries/${s}`),
  ...BLOG_POSTS.map((p) => `/blogs/${p.slug}`),
  ...RESEARCH_POSTS.map((p) => `/blogs/${p.slug}`),
]);

function checkHref(href, where) {
  if (href.startsWith("https://")) {
    assert.doesNotThrow(() => new URL(href), `${where}: malformed URL ${href}`);
    return;
  }
  assert.ok(href.startsWith("/"), `${where}: link must be https:// or a site path, got ${href}`);
  const path = href.split("#")[0] || "/";
  assert.ok(SITE_PATHS.has(path), `${where}: ${href} is not a page this site serves`);
}

function checkText(value, where) {
  assert.equal(typeof value, "string", `${where}: expected text`);
  assert.ok(value.trim().length > 0, `${where}: empty text`);
  for (const pattern of LEAKS) assert.doesNotMatch(value, pattern, `${where}: internal note leaked (${pattern})`);
  assert.doesNotMatch(value, /\]\(http:\/\//, `${where}: insecure http link`);
  // An unbalanced bracket usually means a broken [anchor](href).
  for (const match of value.matchAll(/\[([^\]]*)\]\(([^)]*)\)/g)) {
    assert.ok(match[1].trim(), `${where}: empty link text`);
    checkHref(match[2], where);
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Reports                                  */
/* -------------------------------------------------------------------------- */

test("the registry holds seven reports with unique, servable slugs", () => {
  assert.equal(RESEARCH_REPORTS.length, 7);
  const slugs = RESEARCH_REPORTS.map((r) => r.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, SLUG);
  assert.equal(research.getResearchReport(slugs[0]), RESEARCH_REPORTS[0]);
  assert.equal(research.getResearchReport("nope"), undefined);
  assert.deepEqual([...research.RESEARCH_LOCALES], ["en"]);
});

for (const report of RESEARCH_REPORTS) {
  test(`report ${report.slug}: metadata fits search results`, () => {
    assert.ok(report.title.length >= 40 && report.title.length <= 66, `title is ${report.title.length} chars`);
    assert.ok(
      report.description.length >= 120 && report.description.length <= 165,
      `description is ${report.description.length} chars`,
    );
    assert.ok(report.shortTitle.length > 0 && report.shortTitle.length <= 40, "shortTitle ≤ 40 chars");
    assert.ok(report.h1[0] && report.h1[1], "h1 has two parts");
    assert.ok(report.primaryKeyword.length > 0);
    assert.ok(report.keywords.length >= 5 && report.keywords.length <= 12, "5–12 keywords");
    for (const d of [report.publishedAt, report.updatedAt, report.dataAsOf]) assert.match(d, ISO_DATE);
    assert.ok(report.updatedAt >= report.publishedAt);
    assert.ok(report.readMinutes >= 8);
  });

  test(`report ${report.slug}: structure is complete`, () => {
    assert.equal(report.keyFindings.length, 4, "four key findings");
    assert.ok(report.summary.length >= 5 && report.summary.length <= 8, "5–8 summary points");
    assert.ok(report.sections.length >= 5, "at least five sections");
    assert.ok(report.faq.length >= 5, "at least five FAQs");
    assert.ok(report.method.length >= 2, "a method note");
    assert.ok(report.platformLinks.length >= 1);
    assert.ok(report.blogSlugs.length >= 2, "at least two spoke posts");

    const ids = report.sections.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, "section ids are unique");
    for (const section of report.sections) {
      assert.match(section.id, SLUG, `section id ${section.id}`);
      assert.ok(section.kicker.split(/\s+/).length <= 5, `${section.id}: kicker is short`);
      assert.ok(
        section.answer.length >= 150 && section.answer.length <= 750,
        `${section.id}: answer is ${section.answer.length} chars (150–750)`,
      );
      assert.ok(section.blocks.length >= 2, `${section.id}: at least two blocks`);
      for (const block of section.blocks) {
        if (block.type === "table") {
          assert.ok(block.columns.length >= 2, `${section.id}: table has columns`);
          assert.ok(block.rows.length >= 1, `${section.id}: table has rows`);
          for (const row of block.rows) {
            assert.equal(row.length, block.columns.length, `${section.id}: "${block.caption}" row has ${row.length} cells`);
          }
        }
        if (block.type === "stats") assert.ok(block.items.length >= 2 && block.items.length <= 4);
        if (block.type === "list") assert.ok(block.items.length >= 2, `${section.id}: list has items`);
      }
    }
  });

  test(`report ${report.slug}: every text is clean and every link resolves`, () => {
    for (const [i, value] of text.reportTexts(report).entries()) checkText(value, `${report.slug} text #${i}`);
    for (const href of text.reportLinks(report)) checkHref(href, report.slug);
    for (const finding of report.keyFindings) assert.match(finding.source.url, /^https:\/\//, "key findings cite a source");
    assert.ok(text.reportSources(report).length >= 15, "cites at least fifteen sources");
    assert.ok(text.wordCount(report) >= 2500, `only ${text.wordCount(report)} words`);
  });

  test(`report ${report.slug}: cross-links point at real things`, () => {
    const keys = new Set(PLATFORM_PAGES.map((p) => p.key));
    for (const key of report.platformLinks) assert.ok(keys.has(key), `unknown platform page ${key}`);
    for (const slug of report.relatedReports) {
      assert.notEqual(slug, report.slug, "a report does not recommend itself");
      assert.ok(research.getResearchReport(slug), `unknown related report ${slug}`);
    }
    const posts = new Set(RESEARCH_POSTS.map((p) => p.slug));
    for (const slug of report.blogSlugs) assert.ok(posts.has(slug), `spoke post ${slug} is not in research-posts.seed.ts`);
  });
}

test("the plain-text and source helpers behave", () => {
  assert.equal(text.plainText("See [Gartner](https://g.com/x) now"), "See Gartner now");
  assert.deepEqual(text.parseInline("a [b](/c) d").map((t) => t.kind), ["text", "link", "text"]);
  assert.equal(
    text.markdownText("[here](/research)", (p) => `https://x.test${p}`),
    "[here](https://x.test/research)",
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Blog spokes                                */
/* -------------------------------------------------------------------------- */

test("research posts have unique slugs that do not collide with the original posts", () => {
  assert.ok(RESEARCH_POSTS.length >= 14, `only ${RESEARCH_POSTS.length} research posts`);
  const slugs = RESEARCH_POSTS.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate research post slug");
  const original = new Set(BLOG_POSTS.map((p) => p.slug));
  for (const slug of slugs) {
    assert.match(slug, SLUG);
    assert.ok(!original.has(slug), `${slug} collides with an original post`);
  }
  // Every post belongs to exactly one report.
  const owned = RESEARCH_REPORTS.flatMap((r) => r.blogSlugs);
  assert.equal(new Set(owned).size, owned.length, "a post is claimed by two reports");
  for (const slug of slugs) assert.ok(owned.includes(slug), `${slug} is not listed by any report`);
});

for (const post of RESEARCH_POSTS) {
  test(`post ${post.slug}: renders and reads well`, () => {
    assert.ok(post.title.length >= 30 && post.title.length <= 75, `title is ${post.title.length} chars`);
    assert.ok(post.excerpt.length >= 110 && post.excerpt.length <= 175, `excerpt is ${post.excerpt.length} chars`);
    assert.ok(post.subtitle.length > 0);
    assert.ok(CATEGORIES.includes(post.category), `category ${post.category}`);
    assert.ok(SKETCHES.includes(post.heroSketch), `heroSketch ${post.heroSketch}`);
    assert.match(post.publishedAt, ISO_DATE);
    if (post.updatedAt) assert.match(post.updatedAt, ISO_DATE);
    assert.ok(post.readTime >= 5 && post.readTime <= 20);
    assert.ok(post.author?.name, "author.name");
    assert.ok(post.keywords?.primary, "keywords.primary");
    assert.ok(post.keywords.secondary.length >= 3);
    assert.ok(["low", "medium", "high"].includes(post.keywords.difficulty));
    assert.ok(["informational", "commercial", "transactional"].includes(post.keywords.intent));
    assert.ok(post.takeaways.length >= 4, "at least four takeaways");
    assert.ok(post.sections.length >= 5, "at least five sections");
    assert.ok((post.faq ?? []).length >= 4, "at least four FAQs");
    assert.ok(post.tags.length >= 3);
    assert.ok((post.crossPageLinks ?? []).some((l) => l.href.startsWith("/research/")), "links up to its report");

    const words = post.sections
      .flatMap((s) => [...s.paragraphs, ...(s.bullets ?? []), ...(s.callout ? [s.callout.body] : [])])
      .map((t) => text.plainText(t).split(/\s+/).filter(Boolean).length)
      .reduce((a, b) => a + b, 0);
    assert.ok(words >= 1100, `only ${words} words of body`);

    const texts = [
      post.title, post.subtitle, post.excerpt, ...post.takeaways,
      ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? []), ...(s.callout ? [s.callout.title, s.callout.body] : []), ...(s.pullQuote ? [s.pullQuote] : [])]),
      ...(post.faq ?? []).flatMap((f) => [f.question, f.answer]),
    ];
    for (const [i, value] of texts.entries()) checkText(value, `${post.slug} text #${i}`);
    for (const link of post.crossPageLinks ?? []) checkHref(link.href, `${post.slug} crossPageLinks`);
    const all = new Set([...BLOG_POSTS, ...RESEARCH_POSTS].map((p) => p.slug));
    for (const slug of post.relatedSlugs) {
      assert.notEqual(slug, post.slug);
      assert.ok(all.has(slug), `${post.slug}: unknown related post ${slug}`);
    }
    const sourced = texts.join(" ").match(/\]\(https:\/\//g)?.length ?? 0;
    assert.ok(sourced >= 6, `${post.slug}: only ${sourced} linked sources`);
  });
}

/* -------------------------------------------------------------------------- */
/*                     Navigation, sitemap, canonical, llms                   */
/* -------------------------------------------------------------------------- */

const { RESEARCH_NAV, RESEARCH_NAV_HREF } = await import("../src/lib/research/nav.ts");
const sitemap = await import("../src/lib/sitemap.ts");
const { buildResearchAlternates } = await import("../src/lib/research/seo.ts");
const { renderLlmsFull } = await import("../src/lib/llms.ts");
const { SITE_ORIGIN } = await import("../src/lib/public-url.ts");

test("the navigation list mirrors the registry, slug for slug and in order", () => {
  assert.equal(RESEARCH_NAV_HREF, research.researchHref());
  assert.deepEqual(RESEARCH_NAV.map((n) => n.slug), RESEARCH_REPORTS.map((r) => r.slug));
  for (const item of RESEARCH_NAV) assert.ok(item.label && item.detail, item.slug);
});

test("the /in/ sitemap lists the hub and every report, in English only", () => {
  const urls = new Set(sitemap.buildCountrySitemap("in", { blogPosts: [], newsPosts: [] }).map((u) => u.loc));
  assert.ok(urls.has(`${SITE_ORIGIN}/in/en/research`));
  for (const report of RESEARCH_REPORTS) {
    assert.ok(urls.has(`${SITE_ORIGIN}/in/en/research/${report.slug}`), report.slug);
    assert.ok(!urls.has(`${SITE_ORIGIN}/in/hi/research/${report.slug}`), "unwritten locales stay out");
  }
});

test("a report's canonical is the English /in/ edition", () => {
  const slug = RESEARCH_REPORTS[0].slug;
  const self = buildResearchAlternates({ country: "in", locale: "en", subPath: `research/${slug}` });
  assert.equal(self.canonical, `/in/en/research/${slug}`);
  const hindi = buildResearchAlternates({ country: "in", locale: "hi", subPath: `research/${slug}` });
  assert.equal(hindi.canonical, `/in/en/research/${slug}`);
  assert.equal(hindi.languages, undefined, "a non-canonical copy joins no hreflang cluster");
});

test("llms-full.txt carries every report and never links an unpublished post", () => {
  const published = RESEARCH_POSTS[0];
  const full = renderLlmsFull({ blogPosts: published ? [published] : [], newsPosts: [] });
  assert.ok(full.includes("## Research library"));
  for (const report of RESEARCH_REPORTS) {
    assert.ok(full.includes(`${SITE_ORIGIN}/in/en/research/${report.slug}`), report.slug);
    assert.ok(full.includes(`### ${report.title}`), report.title);
  }
  for (const post of RESEARCH_POSTS.slice(1)) {
    assert.ok(!full.includes(`/in/en/blogs/${post.slug})`), `links unpublished ${post.slug}`);
  }
  assert.doesNotMatch(full, /undefined|\[object Object\]/);
});
