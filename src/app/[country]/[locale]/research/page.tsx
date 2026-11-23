import type { Metadata } from "next";
import { RESEARCH_HUB_FAQ, ResearchHubPage } from "@/components/research/ResearchHubPage";
import { getPlatformContext } from "@/components/platform/context";
import { buildFaqJsonLd } from "@/lib/seo";
import { jsonLd } from "@/lib/platform/seo";
import { isResearchLocale } from "@/lib/research";
import { buildResearchBreadcrumbJsonLd, buildResearchHubJsonLd, buildResearchHubMetadata } from "@/lib/research/seo";

type Params = Promise<{ country: string; locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { country, locale } = await params;
  return buildResearchHubMetadata({ country, locale });
}

export default async function Page({ params }: { params: Params }) {
  const { country, locale } = await params;
  const ctx = getPlatformContext(country, locale);
  // The reports are English-only (lib/research/index.ts), the same rule as the
  // Factory Graph pages, so the "English only" notice comes from there too.
  const research = { ...ctx, notice: isResearchLocale(ctx.locale) ? undefined : ctx.notice };
  const structured = [
    buildResearchBreadcrumbJsonLd(country),
    buildResearchHubJsonLd(country),
    buildFaqJsonLd([...RESEARCH_HUB_FAQ]),
  ];
  return (
    <>
      {structured.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <ResearchHubPage ctx={research} />
    </>
  );
}
