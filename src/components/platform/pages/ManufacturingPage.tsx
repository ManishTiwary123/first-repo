import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { PlatformShell } from "../PlatformShell";
import { Tabs } from "../Tabs";
import {
  Band,
  Closing,
  EnquirySection,
  Faq,
  HubFigure,
  ImplementationRail,
  LegalNote,
  PlatformHero,
  RelatedPages,
  type FaqItem,
  type PlatformContext,
} from "../parts";
import home from "../../home/IndustrialHome.module.css";
import styles from "../Platform.module.css";

/**
 * /manufacturing-solutions
 *
 * Seven kinds of manufacturing, each told the same way:
 *
 *   current operational problem → connected solution → example workflow →
 *   measurable outcomes to evaluate → relevant integration → CTA
 *
 * "Outcomes to evaluate" is deliberate wording. The page lists what a plant
 * should measure before and after, and promises no figure for any of it: no
 * savings, no downtime reduction, no implementation time. Those depend on the
 * plant and are agreed, with a baseline, in the scope.
 */

export const MANUFACTURING_FAQ: readonly FaqItem[] = [
  {
    q: "Why does this page list outcomes to evaluate instead of results?",
    a: "Because a percentage that is true for one plant is a guess for the next. For each kind of manufacturing we list what is worth measuring, so you can take a baseline before any work starts and judge the result against your own numbers. The case studies on this site describe individual engagements, not a forecast for yours.",
  },
  {
    q: "We are a small shop. Is this meant for us?",
    a: "The approach scales down. A ten-machine shop does not need a platform programme; it may need the ERP to know which job is on which machine, or a quote that reflects real capacity. The first step is sized to the constraint, not to the size of the catalogue.",
  },
  {
    q: "Our industry is not listed. Does that matter?",
    a: "No. The seven here are where the pattern is most common. The underlying problem, systems that each hold part of the picture, is the same in most discrete and process manufacturing. Describe your operation in the audit form and we will tell you whether we can help.",
  },
  {
    q: "How long does an implementation take, and what does it cost?",
    a: "Both depend on what is being connected and how your systems allow it, so neither is quoted before scoping. The first conversation is free. If a build makes sense, scope, timeline, price and the measures of success are agreed in writing before any work starts.",
  },
];

interface Segment {
  id: string;
  label: string;
  title: string;
  problem: string;
  solution: string;
  workflow: string[];
  outcomes: string[];
  integration: string;
  page: { label: string; path: string };
}

const SEGMENTS: readonly Segment[] = [
  {
    id: "cnc",
    label: "CNC & precision engineering",
    title: "Know which job, which revision and which program is on every machine.",
    problem:
      "High mix, short runs and frequent drawing changes. The schedule lives in a planner's head, machine status is a walk to the floor, and the wrong revision occasionally gets cut.",
    solution:
      "Machine state is tied to the work order, and the work order to the released revision and its program reference, so planning, engineering and the floor look at the same job.",
    workflow: [
      "A work order is released against revision C.",
      "The machine's state and part count are read as it runs.",
      "The program reference in use is checked against the released revision.",
      "A stop is recorded against the job, with its reason confirmed by the operator.",
      "The planner sees what is late, and why, without asking.",
    ],
    outcomes: [
      "Machine utilisation by state: cutting, idle, in setup, stopped",
      "Setup time per job",
      "Jobs made on a superseded revision",
      "On-time delivery against the promised date",
    ],
    integration: "CNC controllers through an edge gateway, ERP work orders, CAD/PDM revision status, CAM program references.",
    page: { label: "CAD/CAM & CNC Integration", path: "cad-cam-cnc-integration" },
  },
  {
    id: "automotive",
    label: "Automotive components",
    title: "Trace any shipped lot back to its machine, material and measurements.",
    problem:
      "Customers expect schedule adherence and full traceability. Records exist, but across the ERP, inspection sheets and machine logbooks, so answering a customer query or an audit takes days.",
    solution:
      "Each lot is linked as it is made to its sales order, part revision, material lot, machine, program version and inspection results. The trace is a lookup, not a reconstruction.",
    workflow: [
      "Material is received and its lot recorded against the purchase order.",
      "A work order consumes that lot on a named machine.",
      "Inspection results are recorded against the lot and the revision.",
      "The shipment is linked to the lot and the customer order.",
      "A customer query is answered from the chain, in either direction.",
    ],
    outcomes: [
      "Time to produce a full trace for a given lot",
      "Delivery schedule adherence",
      "Internal rejection rate by part and machine",
      "Completeness of lot records at dispatch",
    ],
    integration: "ERP, quality records or a QMS, machine connectivity, and the customer's schedule where it arrives electronically.",
    page: { label: "CAD/CAM & CNC Integration", path: "cad-cam-cnc-integration" },
  },
  {
    id: "fabrication",
    label: "Metal fabrication",
    title: "Quote from the real routing, the real stock and the real load.",
    problem:
      "Every job is a little different. Quotes depend on one experienced estimator, material utilisation is hard to see, and jobs queue between cutting, bending, welding and finishing with no shared status.",
    solution:
      "The quote is built from the routing, current material and actual capacity. Once the job is won, each stage reports progress to one status that sales, planning and the floor all read.",
    workflow: [
      "An inquiry arrives with drawings.",
      "Routing, material and capacity are read to prepare an estimate.",
      "The estimator reviews and approves the quote.",
      "The job moves through cutting, forming, welding and finishing, each stage booked as it completes.",
      "The customer's delivery date is checked against where the job actually is.",
    ],
    outcomes: [
      "Time from inquiry to quote",
      "Quoted hours against actual hours per job",
      "Material utilisation and remnant stock",
      "Work in progress waiting between stages",
    ],
    integration: "ERP or job-costing system, nesting or CAD exports, shop-floor booking, CRM for the inquiry.",
    page: { label: "Agentic ERP & CRM", path: "agentic-erp-crm" },
  },
  {
    id: "machinery",
    label: "Industrial machinery",
    title: "Keep the engineering BOM, the purchase list and the build in step.",
    problem:
      "Engineer-to-order builds with long lead items and changes during the build. The engineering BOM and what purchasing is actually buying drift apart, and a late part is discovered at assembly.",
    solution:
      "A change to the design is traced to the purchase orders and assembly steps it affects. Long-lead items are tracked against the build plan, so a slip is visible weeks before it stops the line.",
    workflow: [
      "Engineering releases a revised assembly.",
      "Affected BOM lines and open purchase orders are identified.",
      "The buyer decides what to amend, cancel or keep.",
      "Supplier dates are compared with the assembly sequence.",
      "The project lead sees the items that threaten the delivery date.",
    ],
    outcomes: [
      "Engineering changes that reached purchasing after the order was placed",
      "Parts missing at the start of assembly",
      "Supplier on-time delivery for long-lead items",
      "Project milestone adherence",
    ],
    integration: "CAD/PDM or PLM, ERP purchasing and projects, supplier communication, after-sales service records.",
    page: { label: "CAD/CAM & CNC Integration", path: "cad-cam-cnc-integration" },
  },
  {
    id: "electronics",
    label: "Electronics assembly",
    title: "Tie every board to its components, its line and its test result.",
    problem:
      "Many components per product, frequent engineering changes and strict lot control. A shortage of one part stops a line, and a field failure means finding every board that used a given reel.",
    solution:
      "Component lots are linked to the boards built from them, alongside line events and test results. Shortages are seen against the build plan before the line is set up, not after.",
    workflow: [
      "A build is planned against the current BOM revision.",
      "Component availability is checked for the whole build.",
      "A shortage is flagged and a requisition drafted for the buyer.",
      "Boards are built, with component lots and test results recorded per serial or batch.",
      "A suspect component lot is traced to every board that used it.",
    ],
    outcomes: [
      "Line stoppages caused by component shortages",
      "First-pass yield at test",
      "Time to identify all units affected by a component lot",
      "Builds started on a superseded BOM revision",
    ],
    integration: "ERP and stores, the manufacturing execution or line-tracking system, test equipment output, PLM for BOM revisions.",
    page: { label: "Industrial IoT & Digital Twins", path: "industrial-iot-digital-twins" },
  },
  {
    id: "process",
    label: "Process manufacturing",
    title: "Connect the batch record to the process that produced it.",
    problem:
      "Batches, recipes and continuous parameters rather than discrete parts. Process data sits in the control system, the batch record in the ERP or on paper, and a quality deviation is investigated by lining the two up by hand.",
    solution:
      "Process signals are related to the batch they belong to, so a batch's record includes the conditions it was made under, and a deviation points at the readings that explain it.",
    workflow: [
      "A batch is started against a recipe version.",
      "Process parameters are read through the plant's control system.",
      "A parameter leaves its range and is recorded against the batch.",
      "Quality is notified with the readings attached.",
      "The quality lead decides on the batch's disposition.",
    ],
    outcomes: [
      "Batches with a complete electronic record",
      "Time to investigate a quality deviation",
      "Yield by product and line",
      "Deviations found at the process rather than at final test",
    ],
    integration: "PLCs and SCADA through an edge gateway (read-only), ERP batch and recipe records, laboratory or quality results.",
    page: { label: "Industrial IoT & Digital Twins", path: "industrial-iot-digital-twins" },
  },
  {
    id: "multi-plant",
    label: "Multi-plant operations",
    title: "One view across sites that run different systems.",
    problem:
      "Each plant grew its own way: a different ERP instance, different part numbers, different reports. Group management compares spreadsheets that do not agree, and moving work between sites is slow.",
    solution:
      "The same customer, part and order are recognised across sites. Each plant keeps its systems; the group gets one comparable view of orders, capacity and exceptions.",
    workflow: [
      "Each site's systems are connected where they are.",
      "Parts and customers are matched across sites, with unclear matches reviewed by a person.",
      "Orders and capacity are shown on one basis.",
      "An order that one site cannot meet is flagged with the sites that could.",
      "The group planner decides where the work goes.",
    ],
    outcomes: [
      "Time to produce a consolidated operations report",
      "Parts and customers held under more than one identity",
      "Capacity utilisation compared across sites",
      "Orders transferred between sites, and how long that takes",
    ],
    integration: "Several ERP instances or products, plant-level machine data, and group reporting. On-premise at each site where required.",
    page: { label: "Factory Graph", path: "factory-graph" },
  },
];

const SHARED = [
  ["The systems are already there", "Almost every plant has an ERP, some engineering software and machines with controllers. The gap is between them."],
  ["People are the integration", "Someone carries information from one screen to another, by retyping, by spreadsheet or by walking."],
  ["The first connection is small", "One relationship that was missing: this machine to this job, this revision to this order."],
] as const;

export function ManufacturingPage({ ctx }: { ctx: PlatformContext }) {
  const { base } = ctx;
  return (
    <PlatformShell contentLang={ctx.notice ? "en" : undefined}>
      <PlatformHero
        ctx={ctx}
        crumb="Manufacturing Solutions"
        eyebrow="Manufacturing solutions"
        eyebrowNote="Connected systems, by type of manufacturing"
        title={["Every kind of plant is different.", "The missing context is the same."]}
        lead="How connecting the systems you already run plays out in seven kinds of manufacturing: the problem, the connected solution, an example workflow and what to measure."
        primary={{ label: "Book an Industrial Systems Audit", href: `${base}/industrial-systems-audit`, track: "Book an Industrial Systems Audit" }}
        secondary={{ label: "Find your kind of plant", href: "#segments", track: "Find your kind of plant" }}
        note="No promised percentages on this page. Each section lists what to measure, so you can judge by your own numbers."
        figure={
          <HubFigure
            core={["Your plant", "As it runs today"]}
            nodes={["Orders", "Engineering", "Planning", "Machines", "Quality", "Stores", "Dispatch", "Finance"]}
          />
        }
        figureCaption={["FIG. 01", "The functions every plant has to keep in step"]}
        facts={[
          { title: "Seven kinds of manufacturing", body: "From a precision CNC shop to a multi-plant group." },
          { title: "One structure for each", body: "Problem, solution, workflow, outcomes to evaluate, integration." },
          { title: "Outcomes you measure", body: "Metrics to baseline, not savings we promise." },
          { title: "Built on what you run", body: "Your ERP, engineering tools and machines stay in place." },
        ]}
      />

      <Band
        id="shared"
        number="01"
        kicker="What plants have in common"
        title={["Different products.", "The same three facts."]}
        tone="surface"
      >
        <div className={styles.cards}>
          {SHARED.map(([title, body], index) => (
            <div key={title} className={styles.card}>
              <div className={styles.cardTop}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band
        id="segments"
        number="02"
        kicker="By type of manufacturing"
        title={["Find the one closest to yours.", "Read it across."]}
        intro="Each tab follows the same order: the operational problem, the connected solution, an example workflow, the outcomes worth measuring and the integration involved."
      >
        <Tabs
          name="manufacturing-segments"
          label="Type of manufacturing"
          numbered={false}
          items={SEGMENTS.map((segment) => ({
            id: segment.id,
            label: segment.label,
            panel: (
              <div className={styles.segment}>
                <div>
                  <span className={styles.mono}>{segment.label}</span>
                  <h3>{segment.title}</h3>
                  <h4>Current operational problem</h4>
                  <p>{segment.problem}</p>
                  <h4>Connected solution</h4>
                  <p>{segment.solution}</p>
                  <h4>Relevant integration</h4>
                  <p>{segment.integration}</p>
                  <div className={styles.segmentCta}>
                    <Link
                      href={`${base}/industrial-systems-audit`}
                      className={home.primaryButton}
                      data-track="cta_click"
                      data-track-label="Book an Industrial Systems Audit"
                      data-track-location={`manufacturing-${segment.id}`}
                    >
                      Book a systems audit
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                    <Link
                      href={`${base}/${segment.page.path}`}
                      className={home.textButton}
                      data-track="cta_click"
                      data-track-label={segment.page.label}
                      data-track-location={`manufacturing-${segment.id}`}
                    >
                      {segment.page.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginTop: 0 }}>Example workflow</h4>
                  <ol>
                    {segment.workflow.map((step) => (
                      <li key={step}>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <h4>Measurable outcomes to evaluate</h4>
                  <ul>
                    {segment.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ),
          }))}
        />
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>Example workflows, not customer stories.</strong> Each workflow above illustrates the pattern for
            that kind of plant. None describes a named customer, and the outcomes are things to measure, not results
            we are claiming.
          </span>
        </p>
      </Band>

      <Band
        id="measure"
        number="03"
        kicker="How to judge the result"
        title={["Take a baseline first.", "Then measure the same thing again."]}
        intro="An honest evaluation needs a number from before the work started."
        tone="surface"
      >
        <ol className={styles.rail} style={{ ["--rail-count" as string]: 4 }}>
          <li>
            <span>01</span>
            <strong>Pick the measure</strong>
            <p>One or two that the constraint actually affects, from the lists above or your own.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Record the baseline</strong>
            <p>From the data you already have, however rough, over a period long enough to be typical.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Agree the target</strong>
            <p>What would make the work worth having done. Written into the scope.</p>
          </li>
          <li>
            <span>04</span>
            <strong>Measure again</strong>
            <p>The same measure, the same way, after rollout. Report it whichever way it went.</p>
          </li>
        </ol>
        <div className={styles.bandFoot}>
          <span>Individual engagements, with their own numbers and context, are in the case studies.</span>
          <Link href={`${base}/case-studies`} data-track="cta_click" data-track-label="Case studies" data-track-location="manufacturing-measure">
            Case studies
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </Band>

      <Band
        id="implementation"
        number="04"
        kicker="What an implementation looks like"
        title={["The same six steps.", "Whatever you make."]}
      >
        <ImplementationRail />
      </Band>

      <Band id="faq" number="05" kicker="Questions" title={["Asked by owners", "and plant heads."]} tone="surface">
        <Faq items={MANUFACTURING_FAQ} />
      </Band>

      <EnquirySection
        ctx={ctx}
        number="06"
        formId="manufacturing-solutions"
        service="systems-audit"
        title={["Describe your plant.", "We will find the first connection."]}
        intro="What you make, roughly how many machines, what software you run and where the day gets stuck. Plain words are enough."
        formTitle="Tell us about your plant"
      />

      <RelatedPages ctx={ctx} current="manufacturing" number="07" />

      <Closing
        number="08"
        title={["Your systems shouldn't need replacing", "to start working together."]}
        body="Tell us what you make and where the handoffs hurt. The first conversation is about your operation, not our product."
        primary={{ label: "Book an Industrial Systems Audit", href: `${base}/industrial-systems-audit`, track: "Book an Industrial Systems Audit" }}
        secondary={{ label: "See the Factory Graph", href: `${base}/factory-graph`, track: "Factory Graph" }}
      />
      <LegalNote />
    </PlatformShell>
  );
}
