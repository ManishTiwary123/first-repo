import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronDown, ChevronRight, Globe2, Plus } from "lucide-react";
import home from "@/components/home/IndustrialHome.module.css";
import platform from "@/components/platform/Platform.module.css";
import { Band, Closing, Faq, LegalNote, TrackedLink, type PlatformContext } from "@/components/platform/parts";
import { PLATFORM_PAGES } from "@/lib/platform/pages";
import { getResearchReport, researchHref } from "@/lib/research";
import { reportSources, wordCount } from "@/lib/research/text";
import type { ResearchReport } from "@/lib/research/types";
import { Block, RichText, StatSource } from "./ResearchBlocks";
import styles from "./Research.module.css";

/** A published blog post written as a spoke of this report. */
export interface ResearchSpoke {
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const formatResearchDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

/**
 * /research/{slug}
 *
 * A long, cited report. The order is the order a busy reader needs: the four
 * numbers that matter, the whole report on one screen, then each question
 * with its answer first and the evidence under it, then how the facts were
 * gathered and every source. Opinion is boxed and labelled "Our reading".
 */
export function ResearchReportPage({
  report,
  ctx,
  spokes,
}: {
  report: ResearchReport;
  ctx: PlatformContext;
  spokes: ResearchSpoke[];
}) {
  const sources = reportSources(report);
  const words = wordCount(report);
  const related = report.relatedReports.map(getResearchReport).filter((r): r is ResearchReport => !!r);
  const products = report.platformLinks.map((key) => PLATFORM_PAGES.find((p) => p.key === key)).filter((p) => !!p);
  const toc = report.sections.map((section, index) => ({ id: section.id, number: pad(index + 1), label: section.kicker }));
  let n = 0;
  const nextNumber = () => pad(++n);

  return (
    <div className={`${home.root} ${platform.root} ${styles.root}`} lang={ctx.notice ? "en" : undefined} dir={ctx.notice ? "ltr" : undefined}>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className={styles.hero} aria-labelledby="page-title">
        <div className={home.container}>
          {ctx.notice && (
            <p className={platform.notice} lang={ctx.locale} dir="auto">
              <Globe2 size={14} aria-hidden="true" />
              {ctx.notice}
            </p>
          )}
          <nav className={platform.crumbs} aria-label="Breadcrumb">
            <Link href={ctx.base}>Home</Link>
            <ChevronRight size={11} aria-hidden="true" />
            <Link href={`${ctx.base}${researchHref()}`}>Research</Link>
            <ChevronRight size={11} aria-hidden="true" />
            <span aria-current="page">{report.shortTitle}</span>
          </nav>
          <div className={platform.eyebrow}>
            <span className={home.signal} />
            <span>{report.eyebrow}</span>
            <span>Data as of {formatResearchDate(report.dataAsOf)}</span>
          </div>
          <div className={styles.heroHead}>
            <div>
              <h1 id="page-title">
                {report.h1[0]} <em>{report.h1[1]}</em>
              </h1>
              <p className={styles.lead}>{report.lead}</p>
              <div className={styles.heroActions}>
                <TrackedLink
                  action={{ label: "Read the summary", href: "#summary", track: `research-${report.slug}-summary` }}
                  className={home.primaryButton}
                  location="research-hero"
                >
                  Read the summary
                  <ArrowDown size={18} aria-hidden="true" />
                </TrackedLink>
                <TrackedLink
                  action={{ label: "Book a systems audit", href: `${ctx.base}/industrial-systems-audit`, track: "Industrial systems audit" }}
                  className={home.textButton}
                  location="research-hero"
                >
                  Book a systems audit
                  <ArrowUpRight size={16} aria-hidden="true" />
                </TrackedLink>
              </div>
            </div>
            <dl className={styles.meta}>
              <div>
                <dt>Published</dt>
                <dd>
                  <time dateTime={report.publishedAt}>{formatResearchDate(report.publishedAt)}</time>
                </dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>
                  <time dateTime={report.updatedAt}>{formatResearchDate(report.updatedAt)}</time>
                </dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>{report.readMinutes} min · {words.toLocaleString("en-GB")} words</dd>
              </div>
              <div>
                <dt>Sources cited</dt>
                <dd>
                  <a href="#sources">{sources.length} linked sources</a>
                </dd>
              </div>
              <div>
                <dt>By</dt>
                <dd>Savin Group Research</dd>
              </div>
            </dl>
          </div>
          <ul className={styles.findings} aria-label="Key findings">
            {report.keyFindings.map((stat) => (
              <li key={stat.label}>
                <span className={styles.findingValue}>{stat.value}</span>
                <span className={styles.findingLabel}>{stat.label}</span>
                <span className={styles.findingSource}>
                  <StatSource stat={stat} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------- Summary ---------------------------- */}
      <Band id="summary" number={nextNumber()} kicker="The report in one screen" title={["What we found,", "in brief."]} tone="surface">
        <ol className={styles.summary}>
          {report.summary.map((point, index) => (
            <li key={index}>
              <RichText text={point} base={ctx.base} />
            </li>
          ))}
        </ol>
      </Band>

      {/* ------------------------------ Body ------------------------------ */}
      <section className={styles.body} aria-label="Report">
        <div className={home.container}>
          <div className={styles.layout}>
            <nav className={styles.toc} aria-label="Contents">
              <span className={styles.tocLabel}>Contents</span>
              <ol>
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>
                      <span>{item.number}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#method">
                    <span>{pad(toc.length + 1)}</span>
                    Method and sources
                  </a>
                </li>
                <li>
                  <a href="#faq">
                    <span>{pad(toc.length + 2)}</span>
                    Questions
                  </a>
                </li>
              </ol>
            </nav>

            <article className={styles.article}>
              <details className={styles.tocMobile}>
                <summary>
                  Contents · {report.sections.length} sections
                  <ChevronDown size={14} aria-hidden="true" />
                </summary>
                <ol>
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>
                        <span>{item.number}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              {report.sections.map((section, index) => (
                <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
                  <div className={home.chapter}>
                    <span>{pad(index + 1)}</span>
                    <span>{section.kicker}</span>
                  </div>
                  <h2 id={`${section.id}-title`}>{section.title}</h2>
                  <div className={styles.answer}>
                    <span>Short answer</span>
                    <p>
                      <RichText text={section.answer} base={ctx.base} />
                    </p>
                  </div>
                  {section.blocks.map((block, b) => (
                    <Block key={b} block={block} base={ctx.base} id={`${section.id}-${b}`} />
                  ))}
                </section>
              ))}

              <section id="method" className={styles.method} aria-labelledby="method-title">
                <h2 id="method-title">How this report was researched</h2>
                <ul className={styles.list}>
                  {report.method.map((line, index) => (
                    <li key={index}>
                      <RichText text={line} base={ctx.base} />
                    </li>
                  ))}
                  <li>
                    Facts were checked on {formatResearchDate(report.dataAsOf)}. Software moves quickly: confirm prices,
                    licences and release status with each vendor before relying on them. Nothing here is legal advice.
                  </li>
                </ul>
                <details id="sources" className={styles.sources}>
                  <summary>
                    All {sources.length} sources cited in this report
                    <Plus size={18} aria-hidden="true" />
                  </summary>
                  <ol>
                    {sources.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              </section>
            </article>
          </div>
        </div>
      </section>

      {/* ------------------------------- FAQ ------------------------------ */}
      <Band id="faq" number={nextNumber()} kicker="Questions" title={["Questions people ask", "about this topic."]} tone="surface">
        <Faq items={report.faq} />
      </Band>

      {/* --------------------------- Keep reading ------------------------- */}
      <Band
        id="related"
        number={nextNumber()}
        kicker="Keep reading"
        title={["Go deeper,", "or see it applied."]}
        intro="Shorter articles written from this report, the related reports, and the Factory Graph pages where the same questions meet a real system."
      >
        {spokes.length > 0 && (
          <>
            <p className={styles.subhead}>Articles from this report</p>
            <div className={styles.spokes}>
              {spokes.map((post) => (
                <Link
                  key={post.slug}
                  href={`${ctx.base}/blogs/${post.slug}`}
                  data-track="cta_click"
                  data-track-label={post.title}
                  data-track-location="research-spokes"
                >
                  <small>Article · {post.readTime} min read</small>
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                  <span>
                    Read the article
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
        {related.length > 0 && (
          <>
            <p className={styles.subhead}>Related research</p>
            <div className={styles.spokes}>
              {related.map((other) => (
                <Link
                  key={other.slug}
                  href={`${ctx.base}${researchHref(other.slug)}`}
                  data-track="cta_click"
                  data-track-label={other.shortTitle}
                  data-track-location="research-related"
                >
                  <small>{other.eyebrow}</small>
                  <strong>{other.shortTitle}</strong>
                  <p>{other.description}</p>
                  <span>
                    Read the report
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
        <p className={styles.subhead}>Where this meets Factory Graph</p>
        <div className={platform.related}>
          {products.map((page, index) => (
            <Link
              key={page.key}
              href={`${ctx.base}/${page.path}`}
              data-track="cta_click"
              data-track-label={page.nav}
              data-track-location="research-platform"
            >
              <span>{pad(index + 1)}</span>
              <strong>{page.nav}</strong>
              <small>{page.navDetail}</small>
              <span>
                Open
                <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Band>

      <Closing
        number={nextNumber()}
        title={["See where your systems", "sit on this map."]}
        body="Describe your machines, software and the handoffs between them. A person reads it, replies within one business day, and the first conversation is a free audit of where the friction is."
        primary={{ label: "Book an industrial systems audit", href: `${ctx.base}/industrial-systems-audit`, track: "Industrial systems audit" }}
        secondary={{ label: "All research", href: `${ctx.base}${researchHref()}`, track: "Research hub" }}
      />
      <LegalNote />
    </div>
  );
}
