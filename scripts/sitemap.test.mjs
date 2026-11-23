/**
 * Offline tests for the sitemap inventory, URL normalization and XML output.
 *
 *   node --test scripts/sitemap.test.mjs
 *
 * Loads the real modules from src/ through Node's TypeScript type stripping
 * (Node >= 22.18). Database content is replaced by fixtures, so these run
 * without DATABASE_URL.
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

const { SITE_ORIGIN, localizedPath, normalizePublicUrl } = await import("../src/lib/public-url.ts");
const xml = await import("../src/lib/sitemap-xml.ts");
const sitemap = await import("../src/lib/sitemap.ts");
const { ALL_COUNTRIES, HREFLANG_COUNTRIES, INDEXABLE_COUNTRIES, INDEXABLE_LOCALES, isIndexable } = await import("../src/lib/constants.ts");
const { INDIA_CITIES, getCityBySlug } = await import("../src/lib/cities.ts");
const { buildAlternates, buildCityAlternates } = await import("../src/lib/seo.ts");
const { buildPlatformAlternates } = await import("../src/lib/platform/seo.ts");
const { PLATFORM_PAGES, PLATFORM_LOCALES } = await import("../src/lib/platform/pages.ts");
const { checkXml, extractEntries, urlProblems } = await import("./validate-sitemaps.mjs");

const SITE = new URL(SITE_ORIGIN);

const post = (slug, category, publishedAt, updatedAt) => ({ slug, category, publishedAt, updatedAt });
const story = (slug, category, publishedAt, updatedAt) => ({ slug, category, publishedAt, updatedAt });

const CONTENT = {
  blogPosts: [
    post("alpha", "seo", "2026-05-01"),
    post("beta", "seo", "2026-06-01", "2026-07-01"),
    post("r&d-ü", "growth", "2026-04-01"),
  ],
  newsPosts: [story("story-1", "ai", "2026-09-20T10:00:00Z")],
};

test("normalizePublicUrl produces exactly one form per page", () => {
  const about = `${SITE_ORIGIN}/in/en/about`;
  for (const pathname of ["about", "/about", "about/", "//about//", "/in/en/about", "in/en/about/", "about?utm=1#top", "./about"]) {
    assert.equal(normalizePublicUrl({ country: "in", locale: "en", pathname }), about, pathname);
  }
  assert.equal(normalizePublicUrl({ country: "IN", locale: "En", pathname: "about" }), about);
  assert.equal(normalizePublicUrl({ country: "in", locale: "en" }), `${SITE_ORIGIN}/in/en`);
  assert.equal(normalizePublicUrl({ country: "in", locale: "en", pathname: "/" }), `${SITE_ORIGIN}/in/en`);
  assert.equal(localizedPath({ country: "de", locale: "de", pathname: "blogs/café-ü" }), "/de/de/blogs/caf%C3%A9-%C3%BC");
  assert.equal(localizedPath({ country: "de", locale: "de", pathname: "blogs/caf%C3%A9" }), "/de/de/blogs/caf%C3%A9");
  assert.equal(localizedPath({ country: "in", locale: "en", pathname: "blogs/r&d" }), "/in/en/blogs/r%26d");
  assert.equal(localizedPath({ country: "in", locale: "en", pathname: "blogs/100%" }), "/in/en/blogs/100%25");
  assert.equal(SITE.protocol, "https:");
  assert.equal(SITE.host, "www.savingroup.in");
});

test("XML output escapes, validates dates and enforces protocol limits", () => {
  const raw = `${SITE_ORIGIN}/in/en/a&b<c>`;
  const out = xml.renderUrlset([
    { loc: raw, lastmod: "2026-07-01" },
    { loc: `${SITE_ORIGIN}/in/en/x`, lastmod: "2026-07-01 10:00:00+00" },
    { loc: `${SITE_ORIGIN}/in/en/y` },
  ]);
  assert.deepEqual(checkXml(out).errors, []);
  assert.match(out, /a&amp;b&lt;c&gt;/);
  assert.equal(checkXml(out).root.attrs.xmlns, xml.SITEMAP_NS);
  const entries = extractEntries(out, "url");
  assert.equal(entries[0].loc, raw);
  assert.equal(entries[0].lastmod, "2026-07-01");
  assert.equal(entries[1].lastmod, undefined, "malformed lastmod is omitted, not emitted");
  assert.equal(entries[2].lastmod, undefined);
  assert.doesNotMatch(out, /changefreq|priority/);

  assert.ok(checkXml("<urlset><url><loc>a&b</loc></url></urlset>").errors.some((e) => e.includes("unescaped")));
  assert.ok(checkXml("<urlset><url></urlset>").errors.length > 0);
  assert.ok(checkXml("<!DOCTYPE html><html></html>").errors.length > 0);

  const tooMany = Array.from({ length: xml.MAX_URLS_PER_SITEMAP + 1 }, (_, i) => ({ loc: `${SITE_ORIGIN}/in/en/p${i}` }));
  assert.throws(() => xml.renderUrlset(tooMany), /protocol limit/);
  assert.equal(checkXml(xml.renderSitemapIndex([{ loc: `${SITE_ORIGIN}/in/sitemap.xml` }])).root.name, "sitemapindex");
});

test("each country sitemap lists only that country's indexable URLs", () => {
  for (const country of INDEXABLE_COUNTRIES) {
    const urls = sitemap.buildCountrySitemap(country, CONTENT);
    const out = xml.renderUrlset(urls);
    assert.deepEqual(checkXml(out).errors, [], country);
    assert.equal(new Set(urls.map((u) => u.loc)).size, urls.length, `${country}: duplicates`);
    for (const { loc, lastmod } of urls) {
      assert.deepEqual(urlProblems(loc, SITE, country), [], loc);
      assert.ok(lastmod === undefined || xml.isW3cDatetime(lastmod), `${loc}: ${lastmod}`);
    }
    const expected = sitemap
      .getIndexableRoutes(CONTENT)
      .reduce((n, r) => n + (r.locales ?? INDEXABLE_LOCALES).filter((l) => isIndexable(country, l)).length, 0);
    assert.equal(urls.length, expected, country);
  }
});

test("dynamic content drives the inventory", () => {
  const byLoc = new Map(sitemap.buildCountrySitemap("in", CONTENT).map((u) => [u.loc, u.lastmod]));
  const at = (path, locale = "en") => `${SITE_ORIGIN}/in/${locale}/${path}`;

  for (const locale of INDEXABLE_LOCALES) assert.ok(byLoc.has(at("blogs/alpha", locale)), locale);
  assert.equal(byLoc.get(at("blogs/beta")), "2026-07-01", "updatedAt wins over publishedAt");
  assert.ok(!byLoc.has(at("blogs/r%26d-%C3%BC")), "a slug the blog route cannot serve is left out");
  assert.equal(byLoc.get(at("blogs/category/growth")), "2026-04-01", "…but still counts for the category page that lists it");
  assert.equal(byLoc.get(at("blogs/category/seo")), "2026-07-01", "category lastmod is its newest post");
  assert.ok(!byLoc.has(at("blogs/category/ops")), "empty category is left out");
  assert.equal(byLoc.get(at("newsroom/category/ai")), "2026-09-20");
  assert.ok(!byLoc.has(at("newsroom/category/policy")), "empty desk is left out");
  assert.equal(byLoc.get(at("newsroom/story-1")), "2026-09-20");
  assert.equal(byLoc.get(at("newsroom")), "2026-09-26", "newsroom hub never older than its floor date");
  assert.equal(byLoc.get(at("blogs")), "2026-07-01", "blog hub follows its newest post");
  assert.ok(byLoc.has(at("cities/jaipur/blog/block-print-export-website-playbook")));
  assert.ok(!byLoc.has(at("cities/mumbai/services")), "templated city sub-pages stay out");
  assert.ok(!byLoc.has(at("ind-figures-preview")));

  const withoutAlpha = { ...CONTENT, blogPosts: CONTENT.blogPosts.filter((p) => p.slug !== "alpha") };
  const after = sitemap.buildCountrySitemap("in", withoutAlpha).map((u) => u.loc);
  assert.ok(!after.includes(at("blogs/alpha")), "a deleted post disappears");

  const first = xml.renderUrlset(sitemap.buildCountrySitemap("in", CONTENT));
  const second = xml.renderUrlset(sitemap.buildCountrySitemap("in", CONTENT));
  assert.equal(first, second, "output is deterministic (no clock-based lastmod)");
});

test("Factory Graph pages are listed exactly where they are their own canonical", () => {
  // The invariant, whatever the current set of canonical editions is: a
  // sitemap lists a URL if and only if the page at that URL declares itself
  // canonical. (buildCountrySitemap returns nothing for a non-edition country.)
  let listed = 0;
  for (const country of ["in", "us", "cv"]) {
    const locs = new Set(sitemap.buildCountrySitemap(country, CONTENT).map((u) => u.loc));
    for (const page of PLATFORM_PAGES) {
      for (const locale of ["en", "hi", "de", "ar"]) {
        const url = `${SITE_ORIGIN}/${country}/${locale}/${page.path}`;
        const canonical = SITE_ORIGIN + buildPlatformAlternates({ country, locale, subPath: page.path }).canonical;
        assert.equal(locs.has(url), canonical === url, `${url}: listed=${locs.has(url)} but its canonical is ${canonical}`);
        if (locs.has(url)) listed++;
        if (!PLATFORM_LOCALES.includes(locale)) assert.equal(locs.has(url), false, `${url}: an untranslated locale is never listed`);
      }
    }
  }
  assert.ok(listed >= PLATFORM_PAGES.length, "every page is listed at least once");
  const byLoc = new Map(sitemap.buildCountrySitemap("in", CONTENT).map((u) => [u.loc, u.lastmod]));
  for (const page of PLATFORM_PAGES) {
    assert.equal(byLoc.get(`${SITE_ORIGIN}/in/en/${page.path}`), page.lastmod, page.path);
  }
});

test("index lists one sitemap per indexable country and nothing else", () => {
  const index = sitemap.buildSitemapIndex(CONTENT);
  assert.deepEqual(index.map((s) => s.loc), INDEXABLE_COUNTRIES.map((c) => `${SITE_ORIGIN}/${c}/sitemap.xml`));
  for (const entry of index) {
    const cc = new URL(entry.loc).pathname.split("/")[1];
    const newest = sitemap.buildCountrySitemap(cc, CONTENT).map((u) => u.lastmod).filter(Boolean).sort().pop();
    assert.equal(entry.lastmod, newest, cc);
  }
  assert.equal(index[0].loc, `${SITE_ORIGIN}/in/sitemap.xml`, "India leads the index");
  assert.equal(sitemap.isSitemapCountry("in"), true);
  assert.equal(sitemap.isSitemapCountry("cv"), false, "non-edition countries get no sitemap");
  assert.deepEqual(sitemap.buildCountrySitemap("us", CONTENT), [], "…and list nothing if asked");

  // Regression guard. With every ISO country x 8 locales listed, the sitemaps
  // held ~93,000 URLs and Search Console left 72,660 of them "Discovered –
  // currently not indexed" (2026-11). Widening INDEXABLE_COUNTRIES or
  // INDEXABLE_LOCALES must be a deliberate, content-backed decision.
  const total = index.reduce((n, e) => n + sitemap.buildCountrySitemap(new URL(e.loc).pathname.split("/")[1], CONTENT).length, 0);
  assert.ok(total < 500, `the sitemaps list ${total} URLs`);
  assert.equal(sitemap.isSitemapCountry("IN"), false, "uppercase variants are not served");
  assert.equal(sitemap.isSitemapCountry("zz"), false, "unknown codes get no sitemap");
  assert.equal(sitemap.SITEMAP_INDEX_URL, `${SITE_ORIGIN}/sitemap-index.xml`);
});

test("every sitemap URL is the canonical its page declares, inside its hreflang cluster", () => {
  let checked = 0;
  for (const country of INDEXABLE_COUNTRIES) {
    const inCluster = HREFLANG_COUNTRIES.includes(country);
    const locs = new Set(sitemap.buildCountrySitemap(country, CONTENT).map((u) => u.loc));
    for (const route of sitemap.getIndexableRoutes(CONTENT)) {
      for (const locale of route.locales ?? INDEXABLE_LOCALES) {
        const segs = route.path.split("/");
        const alt = segs[0] === "cities" && segs.length > 1
          ? buildCityAlternates({ country, locale, city: getCityBySlug(segs[1]), cityPath: segs.slice(1).join("/") })
          : route.section === "platform"
            ? buildPlatformAlternates({ country, locale, subPath: route.path })
            : buildAlternates({ country, locale, subPath: route.path });
        const canonical = SITE_ORIGIN + alt.canonical;
        assert.ok(locs.has(canonical), `${canonical} missing from /${country}/sitemap.xml`);
        if (inCluster) {
          assert.equal(alt.languages?.[`${locale}-${country.toUpperCase()}`], canonical, `${canonical} not in its own hreflang cluster`);
          assert.ok(alt.languages?.["x-default"]?.startsWith(`${SITE_ORIGIN}/in/en`));
        } else {
          assert.equal(alt.languages, undefined, `${canonical} is outside the cluster and must not declare one`);
        }
        checked++;
      }
    }
  }
  assert.ok(checked > 40, `checked ${checked}`);

  const cluster = buildAlternates({ country: "in", locale: "en", subPath: "services" }).languages;
  assert.equal(Object.keys(cluster).length, HREFLANG_COUNTRIES.length * INDEXABLE_LOCALES.length + 1, "cluster size stays bounded");
  assert.ok(!Object.keys(cluster).includes("en-CV"), "non-target countries stay out of the cluster");
  const noindex = buildAlternates({ country: "zz", locale: "en", subPath: "services" });
  assert.deepEqual(noindex, { canonical: "/zz/en/services" }, "noindex pages declare no cluster");
});

test("country and language copies point their canonical at the /in/ edition (Search Console, 2026-11)", () => {
  // URLs taken from the "Discovered – currently not indexed" and "Duplicate,
  // Google chose different canonical than user" exports. Each one called
  // itself canonical; each must now name the one copy Google should keep.
  const city = (country, locale, cityPath) =>
    buildCityAlternates({ country, locale, city: getCityBySlug(cityPath.split("/")[0]), cityPath });
  const cases = [
    [buildAlternates({ country: "ae", locale: "en", subPath: "about" }), "/in/en/about"],
    [buildAlternates({ country: "us", locale: "en", subPath: "pricing" }), "/in/en/pricing"],
    [buildAlternates({ country: "in", locale: "ar", subPath: "services" }), "/in/en/services"],
    [buildAlternates({ country: "in", locale: "hi", subPath: "blogs/schema-markup-that-moves-ctr" }), "/in/en/blogs/schema-markup-that-moves-ctr"],
    [buildAlternates({ country: "ai", locale: "ar", subPath: "industries/manufacturing" }), "/in/en/industries/manufacturing"],
    [city("mo", "hi", "pune"), "/in/en/cities/pune"],
    [city("gb", "zh", "bengaluru"), "/in/en/cities/bengaluru"],
    [city("ad", "es", "delhi/blog/5-minute-real-estate-routing"), "/in/en/cities/delhi/blog/5-minute-real-estate-routing"],
    [buildPlatformAlternates({ country: "cv", locale: "de", subPath: "factory-graph" }), "/in/en/factory-graph"],
  ];
  for (const [alt, expected] of cases) {
    assert.deepEqual(alt, { canonical: expected }, `${expected}: a copy declares the edition, and no cluster`);
  }
  for (const [country, locale] of [["us", "en"], ["mo", "hi"], ["in", "gu"]]) {
    assert.equal(isIndexable(country, locale), true, `/${country}/${locale}/ stays index,follow; the canonical does the work`);
  }

  // A city with a hand-written Hindi body keeps its Hindi page as its own
  // canonical, in a cluster with English — and its English-only posts do not.
  const hiCity = INDIA_CITIES.find((c) => c.bodyLocales?.includes("hi") && c.translations?.hi);
  assert.ok(hiCity, "one city has a Hindi body");
  const hi = city("in", "hi", hiCity.slug);
  assert.equal(hi.canonical, `/in/hi/cities/${hiCity.slug}`);
  assert.deepEqual(Object.keys(hi.languages).sort(), ["en-IN", "hi-IN", "x-default"]);
  assert.equal(city("us", "hi", hiCity.slug).canonical, `/in/hi/cities/${hiCity.slug}`);
  assert.equal(city("in", "hi", `${hiCity.slug}/about`).canonical, `/in/en/cities/${hiCity.slug}/about`);
  const locs = sitemap.buildCountrySitemap("in", CONTENT).map((u) => u.loc);
  assert.deepEqual(locs.filter((l) => !l.includes("/in/en")), [`${SITE_ORIGIN}/in/hi/cities/${hiCity.slug}`],
    "the only non-English URL listed is the one page actually written in Hindi");
});
