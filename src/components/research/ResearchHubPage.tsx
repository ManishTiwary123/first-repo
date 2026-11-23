import Link from "next/link";
import { ArrowUpRight, ChevronRight, Globe2 } from "lucide-react";
import home from "@/components/home/IndustrialHome.module.css";
import platform from "@/components/platform/Platform.module.css";
import { Band, Closing, Faq, LegalNote, TrackedLink, type FaqItem, type PlatformContext } from "@/components/platform/parts";
import { RESEARCH_REPORTS, researchHref, researchHubLastmod } from "@/lib/research";
import { reportSources, wordCount } from "@/lib/research/text";
import { formatResearchDate } from "./ResearchReportPage";
import { StatSource } from "./ResearchBlocks";
import styles from "./Research.module.css";

/** The question each report answers, in a reader's words. Order follows RESEARCH_REPORTS. */
const QUESTIONS: Record<string, string> = {
  "manufacturing-software-stack-cad-cam-plm-mes":
    "What CAD, CAM, PLM, MES, IIoT, quality and maintenance software does a factory run, what does it cost, and what are the open-source options?",
  "manufacturing-knowledge-graph-ontology":
    "How do Palantir, Microsoft and the standards bodies model a manufacturer as one connected graph, and how would you build one on PostgreSQL?",
  "future-of-erp-crm-agentic-ai":
    "What have SAP, Salesforce, Microsoft, Oracle, Workday, Zoho and Odoo actually shipped for AI agents, and what still fails?",
  "ai-agent-orchestration-platforms":
    "How do you run, supervise and pay for many AI agents at once, and what does the evidence say about when that helps?",
  "embed-stream-integrate-specialist-software":
    "How can one web platform embed, stream or drive specialist tools like CAD, office editors and machine HMIs, and where are the hard limits?",
  "back-office-software-open-source-alternatives":
    "What does each back-office department use, what does SaaS sprawl cost, and which open-source options are safe to build on?",
  "d2c-marketing-tool-stack-agentic-commerce":
    "What does a D2C brand's design-to-order tool stack look like, which tools can agents drive, and what became of agentic commerce?",
};

export const RESEARCH_HUB_FAQ: readonly FaqItem[] = [
  {
    q: "Who writes these reports?",
    a: "Savin Group's research desk. Each report is built from vendor documentation, release notes, standards, public repositories, analyst notes and academic benchmarks, and figures on the page link to the sources they came from. Where we give an opinion it is boxed and labelled “Our reading”, so it cannot be mistaken for a finding.",
  },
  {
    q: "How current is the information?",
    a: "Each report shows the date its facts were checked; the current set was checked on 22 November 2026. Prices, licences and release status in this field change month to month, so confirm anything you plan to rely on with the vendor before you act on it.",
  },
  {
    q: "Why do the reports flag vendor claims and conflicting sources?",
    a: "Because much of what is published about AI agents and enterprise software is self-reported. A resolution rate on a vendor's pricing page and a benchmark run by an independent lab are different kinds of evidence, so the reports say which is which, and show both sides where sources disagree.",
  },
  {
    q: "Is anything here legal advice?",
    a: "No. The reports describe open-source and commercial licence terms as written in each project's licence file or terms page, and explain how they are commonly read. Before bundling or hosting a licensed component in a product, get a legal review.",
  },
  {
    q: "How does this research relate to Factory Graph?",
    a: "It is the reading behind it. Factory Graph connects the machines, digital twins, CAD/CAM, ERP and CRM a manufacturer already runs into one governed layer, and these reports are how we keep track of what those systems can and cannot expose, and what AI agents can safely do with them.",
  },
  {
    q: "Can I quote or share the findings?",
    a: "Yes. Link to the report page, and for any figure you reuse, cite the original source linked beside it, which is where the number actually comes from.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * /research
 *
 * The library page: what each report answers, one sourced number from each,
 * and how the research is done. Report text lives in lib/research/reports.
 */
export function ResearchHubPage({ ctx }: { ctx: PlatformContext }) {
  const totalSources = new Set(RESEARCH_REPORTS.flatMap((r) => reportSources(r).map((s) => s.url.split("#")[0]))).size;
  const totalWords = RESEARCH_REPORTS.reduce((sum, r) => sum + wordCount(r), 0);
  const totalSections = RESEARCH_REPORTS.reduce((sum, r) => sum + r.sections.length, 0);
  const totalFaqs = RESEARCH_REPORTS.reduce((sum, r) => sum + r.faq.length, 0);
  const asOf = RESEARCH_REPORTS.map((r) => r.dataAsOf).sort().pop() ?? researchHubLastmod();

  return (
    <div className={`${home.root} ${platform.root} ${styles.root}`} lang={ctx.notice ? "en" : undefined} dir={ctx.notice ? "ltr" : undefined}>
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
            <span aria-current="page">Research</span>
          </nav>
          <div className={platform.eyebrow}>
            <span className={home.signal} />
            <span>Savin Group Research</span>
            <span>Data as of {formatResearchDate(asOf)}</span>
          </div>
          <div className={styles.heroHead}>
            <div>
              <h1 id="page-title">
                Industrial software research, <em>checked against its sources.</em>
              </h1>
              <p className={styles.lead}>
                Seven long-form reports on the software every department of a manufacturer or a brand runs: what it costs,
                which open-source alternatives are safe to build on, what AI agents actually do inside ERP, CRM and the
                factory, and where the limits are. Figures link to the sources they came from, and every opinion is
                labelled as one.
              </p>
              <div className={styles.heroActions}>
                <TrackedLink
                  action={{ label: "Browse the reports", href: "#reports", track: "research-hub-reports" }}
                  className={home.primaryButton}
                  location="research-hub"
                >
                  Browse the reports
                  <ArrowUpRight size={18} aria-hidden="true" />
                </TrackedLink>
                <TrackedLink
                  action={{ label: "Read the articles", href: `${ctx.base}/blogs`, track: "Blog" }}
                  className={home.textButton}
                  location="research-hub"
                >
                  Read the articles
                  <ArrowUpRight size={16} aria-hidden="true" />
                </TrackedLink>
              </div>
            </div>
            <dl className={styles.meta}>
              <div>
                <dt>Reports</dt>
                <dd>{RESEARCH_REPORTS.length}</dd>
              </div>
              <div>
                <dt>Sections</dt>
                <dd>{totalSections}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>English</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatResearchDate(researchHubLastmod())}</dd>
              </div>
            </dl>
          </div>
          <ul className={styles.hubStats} aria-label="The library in numbers">
            <li>
              <strong>{RESEARCH_REPORTS.length}</strong>
              <span>reports, one per part of the business</span>
            </li>
            <li>
              <strong>{totalSources.toLocaleString("en-GB")}</strong>
              <span>distinct sources, each linked where it is used</span>
            </li>
            <li>
              <strong>{Math.round(totalWords / 1000)}k</strong>
              <span>words of findings, tables and answers</span>
            </li>
            <li>
              <strong>{totalFaqs}</strong>
              <span>common questions answered in plain language</span>
            </li>
          </ul>
        </div>
      </section>

      <Band
        id="reports"
        number="01"
        kicker="The reports"
        title={["Seven reports.", "One map of the business."]}
        intro="Start with the question closest to yours. Each report opens with four sourced numbers and a one-screen summary, then answers each question first and shows the evidence under it."
        tone="surface"
      >
        <ol className={styles.reports}>
          {RESEARCH_REPORTS.map((report, index) => {
            const stat = report.keyFindings[0];
            const href = `${ctx.base}${researchHref(report.slug)}`;
            return (
              <li key={report.slug} className={styles.report}>
                <span className={styles.reportNumber}>{pad(index + 1)}</span>
                <div className={styles.reportBody}>
                  <small>
                    {report.eyebrow} · {report.readMinutes} min read
                  </small>
                  <h3>
                    <Link href={href} data-track="cta_click" data-track-label={report.shortTitle} data-track-location="research-hub-list">
                      {report.title}
                    </Link>
                  </h3>
                  <p>{QUESTIONS[report.slug] ?? report.description}</p>
                  <div className={styles.reportLinks}>
                    <Link href={href}>
                      Read the report
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                    {report.sections.slice(0, 3).map((section) => (
                      <Link key={section.id} href={`${href}#${section.id}`}>
                        {section.kicker}
                      </Link>
                    ))}
                  </div>
                </div>
                {stat && (
                  <div className={styles.reportStat}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                    <small>
                      <StatSource stat={stat} />
                    </small>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </Band>

      <Band
        id="method"
        number="02"
        kicker="How we research"
        title={["Sourced, dated,", "and honest about gaps."]}
        intro="The same rules apply to every report, and they are checked automatically before a page is published."
      >
        <div className={platform.cards} data-cols="4">
          {[
            ["Figures are linked", "Numbers carry a link to the page they came from: a vendor's pricing page, a release note, a licence file, a standard or a study."],
            ["Claims are labelled", "Vendor-reported results, projections and figures we could only read second-hand are marked as such, and conflicting sources are shown side by side."],
            ["Opinion is boxed", "Our reading of the evidence sits in labelled boxes, so a reader can always tell what a source says from what we think it means."],
            ["Gaps are stated", "Each report ends with what could not be checked. An absent product or figure means we could not verify it, not that it does not exist."],
          ].map(([title, body], index) => (
            <div key={title} className={platform.card}>
              <div className={platform.cardTop}>
                <span>{pad(index + 1)}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band id="faq" number="03" kicker="Questions" title={["About this", "research."]} tone="surface">
        <Faq items={RESEARCH_HUB_FAQ} />
      </Band>

      <Closing
        number="04"
        title={["Turn the research", "into a first step."]}
        body="Tell us which systems you run and where work gets retyped between them. A person replies within one business day, and the first conversation is a free audit."
        primary={{ label: "Book an industrial systems audit", href: `${ctx.base}/industrial-systems-audit`, track: "Industrial systems audit" }}
        secondary={{ label: "Explore Factory Graph", href: `${ctx.base}/factory-graph`, track: "Factory Graph" }}
      />
      <LegalNote />
    </div>
  );
}
