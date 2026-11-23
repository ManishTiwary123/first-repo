import { loadSitemapContent } from "@/lib/sitemap";
import { llmsTextResponse, renderLlmsFull } from "@/lib/llms";

// /llms-full.txt: the complete text of the site's core pages as one Markdown
// file, for AI crawlers and agents (see lib/llms.ts for what goes in and why).
//
// Same caching contract as the sitemaps: prerendered at build, regenerated in
// the background, and refreshed at once by /api/revalidate/blog through the
// blog/news cache tags. A failed database read throws instead of serving a
// file with the articles silently missing; Next keeps the last good copy.
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return llmsTextResponse(renderLlmsFull(await loadSitemapContent()));
}
