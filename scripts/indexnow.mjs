/**
 * Submit the site's URLs to IndexNow (https://www.indexnow.org).
 *
 *   node scripts/indexnow.mjs                       # /in/ sitemap + llms files
 *   node scripts/indexnow.mjs --countries in,us,gb  # several country sitemaps
 *   node scripts/indexnow.mjs --dry-run             # list, do not submit
 *
 * One POST reaches Bing, Yandex, Naver, Seznam and Yep. Bing matters most
 * here: its index is what ChatGPT search and Microsoft Copilot retrieve from,
 * so a page Bing has not crawled cannot be cited by them.
 *
 * Run it AFTER a deploy that adds or changes pages. It reads the LIVE
 * sitemaps, so it submits exactly what production serves. The key file
 * (public/<32 hex>.txt) must already be live; the script checks that first.
 *
 * Do not submit unchanged URLs on every run as a ranking trick: IndexNow is
 * for "this changed", and engines throttle hosts that spam it.
 */

import { readdirSync, readFileSync } from "node:fs";

const SITE = "https://www.savingroup.in";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10_000;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const countriesArg = args[args.indexOf("--countries") + 1];
const countries = args.includes("--countries") && countriesArg
  ? countriesArg.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean)
  : ["in"];

function readKey() {
  const dir = new URL("../public/", import.meta.url);
  const file = readdirSync(dir).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (!file) throw new Error("No IndexNow key file (public/<32 hex chars>.txt) found.");
  const key = readFileSync(new URL(file, dir), "utf8").trim();
  if (`${key}.txt` !== file) throw new Error(`public/${file} must contain exactly its own name without .txt.`);
  return key;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "indexnow-submit/1.0" } });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.text();
}

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));

async function main() {
  const key = readKey();
  const keyLocation = `${SITE}/${key}.txt`;

  const live = (await fetchText(keyLocation).catch(() => "")).trim();
  if (live !== key) {
    console.error(`The key file is not live at ${keyLocation}. Deploy first, then run this again.`);
    process.exit(1);
  }

  const urls = new Set([`${SITE}/llms.txt`, `${SITE}/llms-full.txt`]);
  for (const country of countries) {
    for (const loc of locs(await fetchText(`${SITE}/${country}/sitemap.xml`))) urls.add(loc);
  }
  const list = [...urls];
  console.log(`${list.length} URLs from ${countries.join(", ")} (+ llms files).`);

  if (dryRun) {
    console.log(list.slice(0, 20).join("\n") + (list.length > 20 ? `\n… and ${list.length - 20} more` : ""));
    return;
  }

  const host = new URL(SITE).host;
  for (let i = 0; i < list.length; i += MAX_URLS_PER_REQUEST) {
    const urlList = list.slice(i, i + MAX_URLS_PER_REQUEST);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    // 200 = accepted, 202 = accepted, key validation pending.
    const note = res.status === 200 || res.status === 202 ? "accepted" : await res.text();
    console.log(`Batch ${i / MAX_URLS_PER_REQUEST + 1}: ${urlList.length} URLs → HTTP ${res.status} ${note}`);
    if (res.status >= 400) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
