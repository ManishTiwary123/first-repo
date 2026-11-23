import { ClipboardList, FileText, Map, Network, Search, ShieldCheck } from "lucide-react";
import { AUDIT, DISCOVERY } from "@/lib/offer";
import { PlatformShell } from "../PlatformShell";
import {
  Band,
  Closing,
  EnquirySection,
  Faq,
  HubFigure,
  LegalNote,
  PlatformHero,
  RelatedPages,
  type FaqItem,
  type PlatformContext,
} from "../parts";
import styles from "../Platform.module.css";

/**
 * /industrial-systems-audit: the enterprise conversion page.
 *
 * The form comes straight after the hero. A visitor should be able to
 * describe their factory and their software in ordinary words, without
 * knowing any AI or integration vocabulary; the explanation of what the audit
 * covers sits below for anyone who wants it first.
 *
 * The commercial terms are the site's existing ones, read from lib/offer.ts:
 * the first conversation is the free audit, and a build is scoped in the paid
 * Discovery Sprint. Nothing new is invented here.
 */

export const AUDIT_FAQ: readonly FaqItem[] = [
  {
    q: "Is the audit free?",
    a: `The first conversation is: ${AUDIT.durationLong}, at no cost, with a written summary afterwards. If you then want a build scoped in detail, that is the ${DISCOVERY.name}, a paid ${DISCOVERY.duration} working session (${DISCOVERY.price}). ${DISCOVERY.note}`,
  },
  {
    q: "What do you need from us beforehand?",
    a: "Only what the form asks, and most of that is optional. A rough list of the software you run, the kinds of machine you have and the problem that prompted you to get in touch is enough. We do not need access to any system for the first conversation.",
  },
  {
    q: "Do we need to understand AI or integration to fill this in?",
    a: "No. Describe the problem the way you would to a colleague: “downtime is logged on paper”, “quotes take three days”, “stock never matches”. Working out which technology, if any, helps is our job.",
  },
  {
    q: "Who should be on the call?",
    a: "Whoever feels the problem and whoever knows the systems. In a smaller company that is often one person. An owner or plant head with someone from IT, planning or engineering is a good mix.",
  },
  {
    q: "What happens to the information we send?",
    a: "It is used to prepare for and follow up on your enquiry. It is not sold or shared for marketing. You only receive product updates if you tick that box. An NDA is available before any detailed conversation.",
  },
  {
    q: "Will you tell us if this is not worth doing?",
    a: "Yes. Some constraints are better solved by a process change, or by a feature your ERP already has. If that is what we find, the written summary will say so.",
  },
];

const LOOKS_AT = [
  { Icon: Map, title: "Your systems landscape", body: "ERP, CRM, engineering tools, shop-floor systems and the applications built just for you. What each one owns." },
  { Icon: Network, title: "The handoffs between them", body: "Where information is retyped, exported, emailed or carried. That is usually where the time goes." },
  { Icon: Search, title: "Your machines and their data", body: "Makes, controllers and whether anything reads them today. What each could tell you if it were connected." },
  { Icon: ClipboardList, title: "The constraint worth solving first", body: "One problem with a clear owner and a measurable effect, rather than a programme of everything." },
  { Icon: ShieldCheck, title: "Boundaries and risks", body: "What must stay on your premises, who approves access to each system, and what should not be automated." },
  { Icon: FileText, title: "A practical starting point", body: "What a first connection would involve, what it would need from you, and how you would know it worked." },
] as const;

const YOU_GET = [
  "A written summary of what we heard and what we found.",
  "A plain map of your systems and the handoffs between them.",
  "The first connection we would make, and why that one.",
  "What it would need: access, people, decisions.",
  "An honest note on anything we would not recommend doing.",
];

export function AuditPage({ ctx }: { ctx: PlatformContext }) {
  return (
    <PlatformShell contentLang={ctx.notice ? "en" : undefined}>
      <PlatformHero
        ctx={ctx}
        crumb="Industrial Systems Audit"
        eyebrow="Industrial systems audit"
        eyebrowNote="Describe your factory. Get a clear starting point."
        title={["Tell us how your factory runs.", "We will show you where to connect first."]}
        lead="Describe your machines, your software and where the day gets stuck, in your own words. A person replies within one business day."
        primary={{ label: "Start the audit request", href: "#enquiry", track: "Start the audit request" }}
        secondary={{ label: "What the audit covers", href: "#covers", track: "What the audit covers" }}
        note={`The first conversation is free: ${AUDIT.durationLong}, and you leave with a written summary.`}
        figure={
          <HubFigure
            core={["Systems audit", "Where to connect first"]}
            nodes={["Machines", "Software", "Data", "People", "Handoffs", "Risks", "Priorities", "First step"]}
          />
        }
        figureCaption={["FIG. 01", "What the audit looks at"]}
        facts={[
          { title: "No jargon needed", body: "Describe the problem the way you would to a colleague." },
          { title: `Free ${AUDIT.duration} conversation`, body: "No access to your systems is needed for it." },
          { title: "A written summary", body: "What we found and the first connection we would make." },
          { title: "Confidential", body: "An NDA is available before any detailed discussion." },
        ]}
      />

      <EnquirySection
        ctx={ctx}
        number="01"
        formId="industrial-systems-audit"
        service="systems-audit"
        kicker="Request the audit"
        title={["Start here.", "It takes a few minutes."]}
        intro="Only the first block is required. The questions about your systems are optional: answer what you know and skip the rest."
        formTitle="Book an industrial systems audit"
      />

      <Band
        id="covers"
        number="02"
        kicker="What the audit covers"
        title={["Six things we look at.", "In the order they matter."]}
      >
        <div className={styles.cards}>
          {LOOKS_AT.map(({ Icon, title, body }) => (
            <div key={title} className={styles.card}>
              <div className={styles.cardTop}>
                <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band
        id="result"
        number="03"
        kicker="What you leave with"
        title={["Something written down.", "Useful whether or not you hire us."]}
        tone="surface"
      >
        <div className={styles.split}>
          <ul className={styles.checks}>
            {YOU_GET.map((item) => (
              <li key={item}>
                <ShieldCheck size={16} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div>
            <p className={styles.prose}>
              <strong>The first conversation is the free {AUDIT.duration} audit.</strong> It has no next step attached.
              You can take the summary and act on it yourselves.
            </p>
            <p className={styles.prose}>
              <strong>If you want a build scoped,</strong> that happens in a {DISCOVERY.name}: a paid{" "}
              {DISCOVERY.duration} working session ({DISCOVERY.price}). {DISCOVERY.note} Scope, timeline, price and the
              measures of success are agreed in writing before any build begins.
            </p>
          </div>
        </div>
      </Band>

      <Band id="faq" number="04" kicker="Questions" title={["Before you send it.", "The usual questions."]}>
        <Faq items={AUDIT_FAQ} />
      </Band>

      <RelatedPages ctx={ctx} current="audit" number="05" />

      <Closing
        number="06"
        title={["One conversation.", "A clearer view of what comes next."]}
        body="You do not need a plan before you get in touch. Describing the problem is enough to start."
        primary={{ label: "Start the audit request", href: "#enquiry", track: "Start the audit request" }}
        secondary={{ label: "See the Factory Graph", href: `${ctx.base}/factory-graph`, track: "Factory Graph" }}
      />
      <LegalNote />
    </PlatformShell>
  );
}
