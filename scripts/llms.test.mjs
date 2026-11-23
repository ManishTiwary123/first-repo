/**
 * Offline tests for the text language models read: /llms.txt and
 * /llms-full.txt (src/lib/llms.ts), and the Organization JSON-LD every page
 * carries.
 *
 *   node --test scripts/llms.test.mjs
 *
 * Loads the real modules from src/ through Node's TypeScript type stripping
 * (Node >= 22.18). Blog and news rows are fixtures, so no DATABASE_URL needed.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

// Resolve the `@/` alias and extensionless imports inside src/, and load the
// locale JSON files as modules (they are imported without import attributes).
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
    // Package subpaths without an exports map (next/cache) need the extension under ESM.
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


const { SITE_ORIGIN } = await import("../src/lib/public-url.ts");
const { renderLlmsFull, LLMS_FULL_URL } = await import("../src/lib/llms.ts");
const sitemap = await import("../src/lib/sitemap.ts");
const { getTranslation } = await import("../src/lib/i18n.ts");
const { INDUSTRY_SLUGS } = await import("../src/lib/industry-data.ts");
const { INDIA_CITIES } = await import("../src/lib/cities.ts");
const { PLATFORM_PAGES } = await import("../src/lib/platform/pages.ts");
const { CAPABILITIES } = await import("../src/lib/platform/capabilities.ts");
const { ORGANIZATION_ID } = await import("../src/lib/constants.ts");
const { buildOrganizationJsonLd, buildWebsiteJsonLd } = await import("../src/lib/seo.ts");
const llmsIndexRoute = await import("../src/app/llms.txt/route.ts");

const post = (slug, extra = {}) => ({
  slug,
  title: `Post ${slug}`,
  subtitle: "A subtitle",
  excerpt: "An excerpt",
  category: "seo",
  readTime: 5,
  publishedAt: "2026-05-01",
  author: { name: "Savin Group Editorial", role: "" },
  heroSketch: "auditLens",
  keywords: { primary: "x", secondary: [], searchVolume: 0, difficulty: "low", intent: "informational" },
  takeaways: ["First takeaway"],
  sections: [
    {
      heading: `Section of ${slug}`,
      paragraphs: ["Paragraph one."],
      bullets: ["Bullet one"],
      callout: { title: "Note", body: "Callout body." },
    },
  ],
  tags: [],
  relatedSlugs: [],
  faq: [{ question: `Question about ${slug}?`, answer: "An answer." }],
  ...extra,
});

const CONTENT = {
  blogPosts: [post("alpha"), post("beta", { updatedAt: "2026-07-01" }), post("r&d-ü")],
  newsPosts: [
    {
      slug: "story-1",
      title: "Story one",
      dek: "",
      excerpt: "Story excerpt",
      category: "ai",
      publishedAt: "2026-09-20T10:00:00Z",
    },
  ],
};

const full = renderLlmsFull(CONTENT);
const t = getTranslation("en");

test("llms-full.txt is well-formed Markdown with the company facts first", () => {
  assert.match(full, /^# Savin Group/);
  assert.ok(full.indexOf("## Company facts") < full.indexOf("## About"), "facts lead the file");
  assert.ok(full.includes(t.contact.details.email));
  assert.ok(full.includes(t.brand.oneLiner));
  assert.doesNotMatch(full, /undefined|\[object Object\]|NaN/);
  assert.doesNotMatch(full, /\n{3,}/, "no runs of blank lines");
});

test("llms-full.txt carries every service, product page, industry and city", () => {
  for (const s of t.services.items) assert.ok(full.includes(`### ${s.name}`), s.name);
  for (const p of PLATFORM_PAGES) assert.ok(full.includes(`${SITE_ORIGIN}/in/en/${p.path}`), p.path);
  for (const c of CAPABILITIES) assert.ok(full.includes(c.title), c.id);
  for (const slug of INDUSTRY_SLUGS) assert.ok(full.includes(`${SITE_ORIGIN}/in/en/industries/${slug}`), slug);
  for (const city of INDIA_CITIES) assert.ok(full.includes(`${SITE_ORIGIN}/in/en/cities/${city.slug}`), city.slug);
  for (const q of t.faq.items) assert.ok(full.includes(q.q), q.q);
});

test("llms-full.txt includes article bodies and leaves out unservable slugs", () => {
  assert.ok(full.includes("### Post alpha"));
  assert.ok(full.includes("#### Section of alpha"));
  assert.ok(full.includes("Question about alpha?"));
  assert.ok(full.includes("2026-07-01"), "updatedAt wins over publishedAt");
  assert.ok(!full.includes("Post r&d-ü"), "a slug the route cannot serve is not linked");
  assert.ok(full.includes(`[Story one](${SITE_ORIGIN}/in/en/newsroom/story-1)`));
});

test("every site link in llms-full.txt is a URL the /in/ sitemap lists", () => {
  const listed = new Set(sitemap.buildCountrySitemap("in", CONTENT).map((u) => u.loc));
  const linked = [...full.matchAll(/https:\/\/www\.savingroup\.in\/in\/[^\s)]+/g)].map((m) => m[0].replace(/[.,]$/, ""));
  assert.ok(linked.length > 30, `found ${linked.length} links`);
  for (const url of linked) assert.ok(listed.has(url), `not in sitemap: ${url}`);
});

test("llms.txt links the full file and states the company facts", async () => {
  const res = llmsIndexRoute.GET();
  assert.equal(res.headers.get("content-type"), "text/plain; charset=utf-8");
  const body = await res.text();
  assert.match(body, /^# Savin Group/);
  assert.ok(body.includes(`(${LLMS_FULL_URL})`));
  assert.ok(body.includes("## Company facts"));
});

test("Organization JSON-LD is one entity that every node can reference", () => {
  const org = buildOrganizationJsonLd(t);
  assert.equal(org["@id"], ORGANIZATION_ID);
  assert.equal(org.alternateName, "savingroup.in");
  assert.ok(org.knowsAbout.length >= 10);
  assert.equal(buildWebsiteJsonLd(t, "en", "in").publisher["@id"], ORGANIZATION_ID);
});
