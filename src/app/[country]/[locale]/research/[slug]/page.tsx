import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResearchReportPage, type ResearchSpoke } from "@/components/research/ResearchReportPage";
import { getPlatformContext } from "@/components/platform/context";
import { getAllBlogPosts } from "@/lib/blogs";
import { buildFaqJsonLd } from "@/lib/seo";
import { jsonLd } from "@/lib/platform/seo";
import { RESEARCH_REPORTS, getResearchReport, isResearchLocale } from "@/lib/research";
import { buildResearchArticleJsonLd, buildResearchBreadcrumbJsonLd, buildResearchReportMetadata } from "@/lib/research/seo";

type Params = Promise<{ country: string; locale: string; slug: string }>;

// The report text is in the repo; only the list of published spoke posts
// comes from the database, so re-check it every five minutes like the blog.
export const revalidate = 300;

export function generateStaticParams() {
  return RESEARCH_REPORTS.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { country, locale, slug } = await params;
  const report = getResearchReport(slug);
  if (!report) return { title: "Report not found" };
  return buildResearchReportMetadata({ report, country, locale });
}

/**
 * The spoke posts that are published. A report must never fail because the
 * blog database is unreachable, so a failed read renders the report without
 * them (and is logged) instead of erroring the page.
 */
async function publishedSpokes(slugs: readonly string[]): Promise<ResearchSpoke[]> {
  try {
    const posts = await getAllBlogPosts();
    return slugs.flatMap((slug) => {
      const post = posts.find((p) => p.slug === slug);
      return post ? [{ slug: post.slug, title: post.title, excerpt: post.excerpt, readTime: post.readTime }] : [];
    });
  } catch (error) {
    console.warn("[research] Spoke posts unavailable:", (error as Error).message);
    return [];
  }
}

export default async function Page({ params }: { params: Params }) {
  const { country, locale, slug } = await params;
  const report = getResearchReport(slug);
  if (!report) notFound();
  const ctx = getPlatformContext(country, locale);
  const research = { ...ctx, notice: isResearchLocale(ctx.locale) ? undefined : ctx.notice };
  const spokes = await publishedSpokes(report.blogSlugs);
  const structured = [
    buildResearchBreadcrumbJsonLd(country, report),
    buildResearchArticleJsonLd(report, country),
    // Built from the array the page renders, so markup and content cannot differ.
    buildFaqJsonLd(report.faq),
  ];
  return (
    <>
      {structured.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <ResearchReportPage report={report} ctx={research} spokes={spokes} />
    </>
  );
}
