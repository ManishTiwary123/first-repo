import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  FlaskConical,
  Globe2,
  Mail,
  MessageCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { AFTER_ENQUIRY, AUDIT, DISCOVERY } from "@/lib/offer";
import { LEAD_INDUSTRIES, type LeadServiceId } from "@/lib/leads/schema";
import {
  CAPABILITIES,
  DATA_LABEL,
  STATUS_LABEL,
  STATUS_NOTE,
  type CapabilityStatus,
  type DataKind,
} from "@/lib/platform/capabilities";
import { PLATFORM_PAGES, type PlatformPageKey } from "@/lib/platform/pages";
import { LeadForm } from "../leads/LeadForm";
import { getLeadFormCopy } from "../leads/lead-form-copy";
import home from "../home/IndustrialHome.module.css";
import styles from "./Platform.module.css";

/**
 * Shared building blocks of the Factory Graph pages. All of them are server
 * components: the page text, headings, FAQ and links are in the HTML a
 * crawler receives. Only the interactive examples and the form hydrate.
 */

/** What a page component needs to build links and read site-wide copy. */
export interface PlatformContext {
  /** `/{country}/{locale}` */
  base: string;
  country: string;
  locale: string;
  /** English name of the market in the URL, to prefill the form. */
  countryName: string;
  t: Messages;
  /** Set on non-English URLs: the page body is English there. */
  notice?: string;
}

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");

/* -------------------------------------------------------------------------- */
/*                                    Hero                                    */
/* -------------------------------------------------------------------------- */

export interface HeroAction {
  label: string;
  href: string;
  /** Names the click in analytics. */
  track: string;
}

export function PlatformHero({
  ctx,
  crumb,
  eyebrow,
  eyebrowNote,
  title,
  lead,
  primary,
  secondary,
  note,
  figure,
  figureCaption,
  facts,
}: {
  ctx: PlatformContext;
  crumb: string;
  eyebrow: string;
  eyebrowNote: string;
  /** Two lines; the second takes the accent colour. */
  title: [string, string];
  lead: string;
  primary: HeroAction;
  secondary?: HeroAction;
  note?: string;
  figure: ReactNode;
  figureCaption: [string, string];
  facts: Array<{ title: string; body: string }>;
}) {
  return (
    <section className={styles.hero} aria-labelledby="page-title" data-scene>
      <div className={home.container}>
        {ctx.notice && (
          <p className={styles.notice} lang={ctx.locale} dir="auto">
            <Globe2 size={14} aria-hidden="true" />
            {ctx.notice}
          </p>
        )}
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href={ctx.base}>Home</Link>
          <ChevronRight size={11} aria-hidden="true" />
          {crumb === "Factory Graph" ? (
            <span aria-current="page">Factory Graph</span>
          ) : (
            <>
              <Link href={`${ctx.base}/factory-graph`}>Factory Graph</Link>
              <ChevronRight size={11} aria-hidden="true" />
              <span aria-current="page">{crumb}</span>
            </>
          )}
        </nav>
        <div className={styles.eyebrow}>
          <span className={home.signal} />
          <span>{eyebrow}</span>
          <span>{eyebrowNote}</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 id="page-title">
              {title[0]} <em>{title[1]}</em>
            </h1>
            <p className={styles.heroLead}>{lead}</p>
            <div className={styles.heroActions}>
              <TrackedLink action={primary} className={home.primaryButton} location="hero">
                {primary.label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </TrackedLink>
              {secondary && (
                <TrackedLink action={secondary} className={home.textButton} location="hero">
                  {secondary.label}
                  {secondary.href.startsWith("#") ? (
                    <ArrowDown size={16} aria-hidden="true" />
                  ) : (
                    <ArrowUpRight size={16} aria-hidden="true" />
                  )}
                </TrackedLink>
              )}
            </div>
            {note && (
              <p className={styles.heroNote}>
                <ShieldCheck size={15} aria-hidden="true" />
                {note}
              </p>
            )}
          </div>
          <figure className={styles.heroFigure}>
            <figcaption>
              <span>{figureCaption[0]}</span>
              <span>{figureCaption[1]}</span>
              <span>Illustrative</span>
            </figcaption>
            {figure}
          </figure>
        </div>
        <ul className={styles.heroFacts}>
          {facts.map((fact) => (
            <li key={fact.title}>
              <strong>{fact.title}</strong>
              <span>{fact.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A link that reports its click (see components/common/Analytics.tsx). */
export function TrackedLink({
  action,
  className,
  location,
  children,
}: {
  action: HeroAction;
  className?: string;
  location: string;
  children: ReactNode;
}) {
  const props = {
    className,
    "data-track": "cta_click",
    "data-track-label": action.track,
    "data-track-location": location,
  };
  // In-page anchors stay plain <a>: next/link would treat them as navigations.
  return action.href.startsWith("#") ? (
    <a href={action.href} {...props}>
      {children}
    </a>
  ) : (
    <Link href={action.href} {...props}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Hub figure                                 */
/* -------------------------------------------------------------------------- */

const HUB = { width: 560, height: 400, cx: 280, cy: 200, rx: 204, ry: 152 };

/**
 * The hero drawing: one core and eight things around it. The same figure
 * serves every page with different labels, so the six pages read as one
 * product. Decorative: the labels repeat what the page says in text.
 */
export function HubFigure({ core, nodes }: { core: [string, string?]; nodes: string[] }) {
  const points = nodes.slice(0, 8).map((label, index) => {
    const angle = (-90 + index * 45) * (Math.PI / 180);
    return { label, x: HUB.cx + HUB.rx * Math.cos(angle), y: HUB.cy + HUB.ry * Math.sin(angle) };
  });
  return (
    <svg className={styles.hubFigure} viewBox={`0 0 ${HUB.width} ${HUB.height}`} fill="none" aria-hidden="true" focusable="false">
      {points.map((p) => (
        <path key={`s-${p.label}`} className={styles.hubSpoke} d={`M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${HUB.cx} ${HUB.cy}`} />
      ))}
      {points.map((p, index) =>
        index % 3 === 0 ? (
          <path
            key={`p-${p.label}`}
            className={styles.hubPulse}
            d={`M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${HUB.cx} ${HUB.cy}`}
            style={{ animationDelay: `${index * -0.9}s` }}
          />
        ) : null,
      )}
      <rect className={styles.hubCoreRing} x={HUB.cx - 96} y={HUB.cy - 46} width="192" height="92" />
      <rect className={styles.hubCoreBox} x={HUB.cx - 84} y={HUB.cy - 34} width="168" height="68" />
      <text className={styles.hubCoreText} x={HUB.cx} y={core[1] ? HUB.cy - 3 : HUB.cy + 4} textAnchor="middle">
        {core[0]}
      </text>
      {core[1] && (
        <text className={styles.hubText} x={HUB.cx} y={HUB.cy + 15} textAnchor="middle" opacity=".7">
          {core[1]}
        </text>
      )}
      {points.map((p) => (
        <g key={`n-${p.label}`}>
          <rect className={styles.hubNodeBox} x={p.x - 66} y={p.y - 17} width="132" height="34" />
          <circle className={styles.hubDot} cx={p.x - 54} cy={p.y} r="3" />
          <text className={styles.hubText} x={p.x + 6} y={p.y + 3.5} textAnchor="middle">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Band                                    */
/* -------------------------------------------------------------------------- */

export function Band({
  id,
  number,
  kicker,
  title,
  intro,
  tone = "paper",
  scene = false,
  children,
}: {
  id: string;
  number: string;
  kicker: string;
  title: [string, string];
  intro?: string;
  tone?: "paper" | "surface" | "dark";
  /** True when the band holds a looping animation that should stop off screen. */
  scene?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(styles.band, tone === "surface" && styles.bandSurface, tone === "dark" && styles.bandDark)}
      aria-labelledby={`${id}-title`}
      data-scene={scene ? "" : undefined}
    >
      <div className={home.container}>
        <div className={styles.bandHead}>
          <div>
            <div className={home.chapter}>
              <span>{number}</span>
              <span>{kicker}</span>
            </div>
            <h2 id={`${id}-title`}>
              {title[0]}
              <br />
              <em>{title[1]}</em>
            </h2>
          </div>
          {intro && <p>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Labels and status                             */
/* -------------------------------------------------------------------------- */

/** Says, in words and next to the example, what kind of data the example shows. */
export function DataLabel({ kind, note = false }: { kind: DataKind; note?: boolean }) {
  return (
    <>
      <span className={styles.dataLabel}>
        <FlaskConical size={12} aria-hidden="true" />
        {DATA_LABEL[kind].short}
      </span>
      {note && <p className={styles.dataNote}>{DATA_LABEL[kind].long}</p>}
    </>
  );
}

export function StatusBadge({ status }: { status: CapabilityStatus }) {
  return (
    <span className={styles.status} data-status={status}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Available now / In development / Planned, read from lib/platform/capabilities.ts. */
export function StatusBoard({ only }: { only?: readonly string[] }) {
  const columns: CapabilityStatus[] = ["available", "development", "planned"];
  return (
    <div className={styles.statusCols}>
      {columns.map((status) => {
        const items = CAPABILITIES.filter((c) => c.status === status && (!only || only.includes(c.id)));
        if (items.length === 0) return null;
        return (
          <div key={status} className={styles.statusCol} data-wide={status === "available" && items.length > 4 ? "" : undefined}>
            <StatusBadge status={status} />
            <p>{STATUS_NOTE[status]}</p>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                  <em>{item.proof}</em>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                     FAQ                                    */
/* -------------------------------------------------------------------------- */

export interface FaqItem {
  q: string;
  a: string;
}

/** The same array feeds the FAQPage JSON-LD on the page, so markup and content cannot differ. */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <Plus size={18} aria-hidden="true" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Enquiry form                                */
/* -------------------------------------------------------------------------- */

/**
 * The lead form with what a visitor wants to know before sending it: what
 * happens next, what the first conversation costs, and how to reach a person
 * without the form. The offer wording comes from lib/offer.ts, the one place
 * the site's commercial terms are written down.
 */
export function EnquirySection({
  ctx,
  number,
  formId,
  service,
  kicker = "Start the conversation",
  title,
  intro,
  formTitle,
  systems = "open",
}: {
  ctx: PlatformContext;
  number: string;
  formId: string;
  service: LeadServiceId;
  kicker?: string;
  title: [string, string];
  intro: string;
  formTitle: string;
  systems?: "open" | "collapsed";
}) {
  const details = ctx.t.contact.details;
  const digits = details.phone.replace(/\D/g, "");
  return (
    <Band id="enquiry" number={number} kicker={kicker} title={title} intro={intro} tone="surface">
      <div className={styles.formGrid}>
        <LeadForm
          locale={ctx.locale}
          market={ctx.country}
          formId={formId}
          // The page body is English on every locale, and so is its form.
          copy={getLeadFormCopy("en")}
          industries={LEAD_INDUSTRIES}
          defaultCountry={ctx.countryName}
          defaultService={service}
          systems={systems}
          contact={{ email: details.email, phone: details.phone }}
          nextSteps={AFTER_ENQUIRY}
          tone="platform"
          eyebrow="Enterprise discovery"
          title={formTitle}
        />
        <aside className={styles.formSide} aria-label="What to expect">
          <div className={styles.sideCard}>
            <h3>What happens next</h3>
            <ol>
              <li>A person reads what you sent and replies within one business day.</li>
              <li>
                The first conversation is the free {AUDIT.duration} audit: your systems, the handoffs between them and
                where the friction is.
              </li>
              <li>You get a written summary of what we found and a suggested first connection.</li>
            </ol>
          </div>
          <div className={styles.sideCard}>
            <h3>If you want it scoped</h3>
            <p>
              A build is scoped in a {DISCOVERY.name}: a paid {DISCOVERY.duration} working session ({DISCOVERY.price}).{" "}
              {DISCOVERY.note} Nothing is quoted before that.
            </p>
          </div>
          <div className={styles.sideCard}>
            <h3>Prefer to talk to a person?</h3>
            <p>
              {details.hours}. NDA available on request.
            </p>
            <div className={styles.direct}>
              <a
                href={`https://wa.me/${digits}`}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_click"
                data-track-label="WhatsApp"
                data-track-location={`${formId}-side`}
              >
                <MessageCircle size={16} aria-hidden="true" />
                <span dir="ltr">{details.phone}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a
                href={`mailto:${details.email}`}
                data-track="cta_click"
                data-track-label="Email"
                data-track-location={`${formId}-side`}
              >
                <Mail size={16} aria-hidden="true" />
                <span dir="ltr">{details.email}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Related pages and closing                         */
/* -------------------------------------------------------------------------- */

export function RelatedPages({ ctx, current, number }: { ctx: PlatformContext; current: PlatformPageKey; number: string }) {
  const pages = PLATFORM_PAGES.filter((page) => page.key !== current);
  return (
    <Band id="related" number={number} kicker="Keep exploring" title={["One platform.", "Several ways in."]}>
      <div className={styles.related}>
        {pages.map((page, index) => (
          <Link
            key={page.key}
            href={`${ctx.base}/${page.path}`}
            data-track="cta_click"
            data-track-label={page.nav}
            data-track-location="related"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
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
  );
}

export function Closing({
  number,
  title,
  body,
  primary,
  secondary,
}: {
  number: string;
  title: [string, string];
  body: string;
  primary: HeroAction;
  secondary?: HeroAction;
}) {
  return (
    <section className={styles.closing} aria-labelledby="closing-title">
      <div className={home.container}>
        <div className={home.chapter}>
          <span>{number}</span>
          <span>The next step</span>
        </div>
        <div className={styles.closingGrid}>
          <div>
            <h2 id="closing-title">
              {title[0]}
              <br />
              <em>{title[1]}</em>
            </h2>
            <p>{body}</p>
          </div>
          <div className={styles.closingActions}>
            <TrackedLink action={primary} className={home.primaryButton} location="closing">
              {primary.label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </TrackedLink>
            {secondary && (
              <TrackedLink action={secondary} className={home.textButton} location="closing">
                {secondary.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </TrackedLink>
            )}
            <small>
              Free {AUDIT.duration} first conversation. A person replies within one business day.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Third-party product names appear on these pages as examples of what
 * customers run. This line says what that does and does not mean.
 */
export function LegalNote() {
  return (
    <div className={styles.legal}>
      <div className={home.container}>
        Product and company names on this page (including ERP, CRM, CAD, CAM and machine-controller brands) are
        trademarks of their respective owners. They are named as examples of systems manufacturers commonly run and as
        possible integration targets. No partnership, certification or endorsement is implied, and a named product is
        not a statement that a pre-built connector for it exists.
      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/*                             Implementation path                            */
/* -------------------------------------------------------------------------- */

const IMPLEMENTATION = [
  ["Audit", "Map the systems, the handoffs between them, and the one constraint worth solving first."],
  ["Agree the scope", "What connects, what question it must answer, and how success will be measured. In writing."],
  ["Connect read-only", "One or two systems first, so the result can be checked against what you already know."],
  ["Add the context", "Relate the records: this order, this part, this revision, this machine."],
  ["Introduce governed actions", "Drafts and proposals, each with the approval rule you set for it."],
  ["Extend", "The next system or workflow, once the first has proved useful in daily work."],
] as const;

/**
 * What a real implementation looks like, in the order it happens. The same on
 * every page because it is the same engagement whichever door a visitor came
 * in through. It names no duration: timelines are agreed per scope.
 */
export function ImplementationRail() {
  return (
    <ol className={styles.rail} style={{ ["--rail-count" as string]: IMPLEMENTATION.length }}>
      {IMPLEMENTATION.map(([title, body], index) => (
        <li key={title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{title}</strong>
          <p>{body}</p>
        </li>
      ))}
    </ol>
  );
}

export { cx };
