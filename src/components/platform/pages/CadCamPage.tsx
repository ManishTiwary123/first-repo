import { Check, FileStack, Info, X } from "lucide-react";
import { PlatformShell } from "../PlatformShell";
import { Tabs } from "../Tabs";
import {
  Band,
  Closing,
  DataLabel,
  EnquirySection,
  Faq,
  HubFigure,
  ImplementationRail,
  LegalNote,
  PlatformHero,
  RelatedPages,
  StatusBoard,
  type FaqItem,
  type PlatformContext,
} from "../parts";
import styles from "../Platform.module.css";

/**
 * /cad-cam-cnc-integration
 *
 * For precision engineering and manufacturing companies. The page is about
 * connecting engineering KNOWLEDGE (which revision, which BOM, which program
 * version, which machine) to commercial and operational systems.
 *
 * It is explicit about the boundary: integration is not generating CNC
 * instructions, and nothing here executes them. No CAD, CAM or controller
 * product is claimed as a supported integration; they are named as targets.
 */

export const CAD_CAM_FAQ: readonly FaqItem[] = [
  {
    q: "Do you integrate with SOLIDWORKS, Mastercam or our controller?",
    a: "We do not claim a ready-made connector for any CAD, CAM or controller product. What we do is establish, for the tools you run, what they expose and what your licences allow: a PDM vault's API, an export, a program repository, a controller's data interface. Then we tell you what can be connected and how. You get a tool-by-tool answer before any commitment.",
  },
  {
    q: "Will this generate or change our CNC programs?",
    a: "No. Factory Graph references programs: which program number and version belongs to which part revision, and which is on which machine. It does not generate toolpaths, edit G-code, post-process, or send a program to a controller. Programming stays with your programmers and your approval process.",
  },
  {
    q: "Can it release an engineering change?",
    a: "No. A revision is released by engineering, in your CAD or PDM system, under your procedure. Once it is released, Factory Graph shows everyone affected what it touches: open purchase orders, work orders, program references, inspection plans, customer orders. Each owner then acts on their part.",
  },
  {
    q: "We keep drawings on a shared drive, not in a PDM system. Does that rule this out?",
    a: "No. Many shops work that way. File naming conventions, a revision register in a spreadsheet and export folders are all workable starting points. The first step is often simply making “which revision is current” a fact the ERP and planning can see.",
  },
  {
    q: "What is the first useful thing this gives us?",
    a: "Usually one of two. Either a mismatch check: is the program on the machine the one approved for the released revision of this part? Or an impact view: when a revision changes, which open orders, purchases and jobs are still on the old one?",
  },
  {
    q: "How does this help with customer audits and traceability?",
    a: "When the links exist, a shipped lot can be traced to its sales order, part revision, material lot, machine, program version and inspection results in one step, instead of being reconstructed from folders and memory. How complete the trace is depends on which of those records you already keep.",
  },
];

const CONNECTS = [
  ["CAD drawings and revisions", "Which revision of a drawing is released, and which it superseded."],
  ["Product and part identity", "One part, recognised under its drawing number, its ERP item code and its customer part number."],
  ["Bills of materials", "The engineering BOM and the manufacturing BOM, and where they differ."],
  ["Engineering change orders", "What changed, why, from which revision, and who approved it."],
  ["CAM program references and versions", "Which program and version belongs to which revision. By reference: the program itself is not touched."],
  ["Tool and machine information", "Which machines are qualified for the part, and which tools the setup calls for."],
  ["Production planning", "Work orders, operations and their sequence, against the revision they were planned on."],
  ["Inspection results", "What was measured, against which characteristic of which revision, with what result."],
  ["Traceability to sales orders", "The customer order behind each job, and the revision the customer ordered."],
  ["Approved engineering handoffs", "A recorded handoff from design to programming to production, each with its sign-off."],
] as const;

const TRACE = [
  ["Sales order", "What the customer asked for"],
  ["Part", "One identity across systems"],
  ["Revision", "The released definition"],
  ["BOM", "What it is made from"],
  ["Program", "Version, by reference"],
  ["Machine", "Where it ran"],
  ["Work order", "The job and its lot"],
  ["Inspection", "What was measured"],
  ["Shipment", "What left, and when"],
] as const;

interface Impact {
  id: string;
  label: string;
  affected: string[];
  proposed: string[];
  approval: string[];
}

/** The example change: BRK-204 revision C → D. Invented for this page. */
const IMPACTS: readonly Impact[] = [
  {
    id: "procurement",
    label: "Procurement",
    affected: ["BOM line: 6 mm plate becomes 8 mm plate", "One open purchase order for 6 mm plate", "6 mm stock reserved for this part"],
    proposed: ["Draft requisition for 8 mm plate", "Flag the open order for the buyer to amend or keep", "List reserved 6 mm stock that is now free"],
    approval: ["The buyer decides on the open order", "The buyer releases the new requisition"],
  },
  {
    id: "planning",
    label: "Planning",
    affected: ["Two open work orders planned on revision C", "One of them already started", "Promised dates on both"],
    proposed: ["Show which job can finish on C and which must wait for D", "Estimate the effect on each promised date"],
    approval: ["The planner decides: complete, hold or re-plan", "Nothing is rescheduled automatically"],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    affected: ["Program O2041 is approved for revision C only", "Fixture and tool list for C", "The machine currently set up for this part"],
    proposed: ["Raise a request for a revision D program", "Mark O2041 as not valid for D", "Flag any machine holding the C program"],
    approval: ["A programmer writes and proves the new program", "Engineering approves it. No program is generated or sent by the platform"],
  },
  {
    id: "quality",
    label: "Quality",
    affected: ["Inspection plan: hole position and thickness characteristics", "First-article status, valid for C only"],
    proposed: ["Draft the changed characteristics for the inspection plan", "Request a first-article inspection for D"],
    approval: ["The quality lead approves the plan", "First-article sign-off stays with quality"],
  },
  {
    id: "sales",
    label: "Sales",
    affected: ["One open customer order referencing revision C", "A quote sent last week on C"],
    proposed: ["Draft a note for the account owner: which orders are affected and how", "List the quote that needs revising"],
    approval: ["The account owner decides what the customer is told", "Any price change is approved commercially"],
  },
];

const APPROACH = [
  ["CAD, PDM and PLM", "Revision status and document references, read from a vault's API where one is licensed, or from exports and a revision register where it is not. Design files are not copied out."],
  ["CAM", "Program numbers, versions and the revision each was written for. Recorded as references. Toolpaths and post-processors are not involved."],
  ["Program storage and DNC", "Which program version is held where, read from the repository. Transferring a program to a machine remains your DNC process."],
  ["ERP", "Items, BOMs, routings, work orders and purchase orders, through the ERP's API or an approved view."],
  ["Quality", "Inspection plans and results from a QMS, CMM reports or the spreadsheets in use today."],
] as const;

const DOES = [
  "Record which revision is released and what it superseded.",
  "Relate a part to its BOM, program reference, machines and orders.",
  "Show what a change affects, for each owner to act on.",
  "Check a program reference against the released revision, and flag a mismatch.",
  "Keep the handoff record: who approved what, and when.",
];
const DOES_NOT = [
  "Generate, edit or post-process a CNC program.",
  "Send a program or a command to a machine controller.",
  "Release a revision or approve an engineering change.",
  "Approve a program, a first article or an inspection plan.",
  "Change tool offsets, feeds, speeds or any machine setting.",
];

export function CadCamPage({ ctx }: { ctx: PlatformContext }) {
  return (
    <PlatformShell contentLang={ctx.notice ? "en" : undefined}>
      <PlatformHero
        ctx={ctx}
        crumb="CAD/CAM & CNC Integration"
        eyebrow="Engineering, CAD/CAM & CNC integration"
        eyebrowNote="Engineering knowledge, connected to the business"
        title={["The drawing changed.", "Did everyone who needed to know find out?"]}
        lead="Connect revisions, bills of materials, program references, machines and inspection results to the orders, purchases and plans that depend on them, without replacing your CAD or CAM tools."
        primary={{ label: "Discuss CAD/CAM Integration", href: "#enquiry", track: "Discuss CAD/CAM Integration" }}
        secondary={{ label: "See a revision change ripple", href: "#impact", track: "See a revision change ripple" }}
        note="Integration, not automation of the machine: no program is generated or executed by the platform."
        figure={
          <HubFigure
            core={["Part + revision", "One identity, many systems"]}
            nodes={["CAD", "BOM", "CAM", "Tooling", "Machine", "Planning", "Inspection", "Sales order"]}
          />
        }
        figureCaption={["FIG. 01", "Everything that hangs off a part and its revision"]}
        facts={[
          { title: "Your tools stay", body: "CAD, CAM and PDM keep doing their jobs. Nothing is migrated." },
          { title: "References, not files", body: "Revisions and program versions are linked. Design data is not copied out." },
          { title: "Engineering decides", body: "Releases, programs and first articles are approved by people, as now." },
          { title: "Traceable end to end", body: "From a shipped lot back to its revision, machine and inspection." },
        ]}
      />

      <Band
        id="problem"
        number="01"
        kicker="The problem"
        title={["Engineering knows.", "The rest of the business finds out late."]}
        intro="A part's definition lives in files, vaults and people's heads. The systems that buy for it, plan it and inspect it each hold their own copy of what they think it is."
        tone="surface"
      >
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>The wrong revision gets made</h3>
            <p>The released drawing is D. The traveller says C, and so does the program on the machine. Nobody is told until inspection.</p>
          </div>
          <div className={styles.card}>
            <h3>A change costs more than it should</h3>
            <p>Purchasing keeps buying for the old BOM, because the change reached them as an email two days later.</p>
          </div>
          <div className={styles.card}>
            <h3>Traceability is an excavation</h3>
            <p>A customer asks which program and material made a lot. Answering takes a day in folders and logbooks.</p>
          </div>
        </div>
      </Band>

      <Band
        id="connects"
        number="02"
        kicker="What connects"
        title={["Ten kinds of engineering knowledge.", "One part to hang them on."]}
        intro="Factory Graph relates these to each other and to your commercial and operational systems. Each stays in the tool that owns it."
      >
        <dl className={styles.kv}>
          {CONNECTS.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band
        id="trace"
        number="03"
        kicker="Traceability"
        title={["From the customer's order", "to the part on the truck."]}
        intro="When each link is recorded as the work happens, the chain can be read in either direction."
        tone="surface"
      >
        <ol className={styles.trace}>
          {TRACE.map(([title, detail], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </li>
          ))}
        </ol>
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>The chain is as complete as your records.</strong> If program versions or material lots are not
            recorded today, the first job is to start recording them, and we say so in the audit rather than promising
            a trace that the data cannot support.
          </span>
        </p>
      </Band>

      <Band
        id="impact"
        number="04"
        kicker="A design revision, followed through"
        title={["One revision changes.", "Five teams are affected."]}
        intro="An example: a mounting bracket moves from revision C to D. The hole pattern shifts and the plate goes from 6 mm to 8 mm. Choose a team to see what it touches for them."
      >
        <div className={styles.impactHead}>
          <h3>
            <FileStack size={18} aria-hidden="true" style={{ verticalAlign: "-3px", marginInlineEnd: 8 }} />
            BRK-204 · revision C → D
          </h3>
          <DataLabel kind="example" />
        </div>
        <Tabs
          name="revision-impact"
          label="Team affected by the revision"
          items={IMPACTS.map((impact) => ({
            id: impact.id,
            label: impact.label,
            panel: (
              <div className={styles.impactGrid}>
                <div>
                  <h4>What is affected</h4>
                  <ul>
                    {impact.affected.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>What is prepared</h4>
                  <ul>
                    {impact.proposed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div data-human="">
                  <h4>Who decides</h4>
                  <ul>
                    {impact.approval.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ),
          }))}
        />
        <p className={styles.dataNote}>
          The part, the revision and every record named above are invented for this example. They are not a
          customer&apos;s data.
        </p>
      </Band>

      <Band
        id="boundary"
        number="05"
        kicker="An important distinction"
        title={["Engineering integration.", "Not machine automation."]}
        intro="Connecting what engineering knows to the rest of the business is a different thing from generating or executing CNC instructions. This platform does the first and not the second."
        tone="dark"
      >
        <div className={styles.split}>
          <div>
            <h3 className={styles.listTitle}>
              <Check size={18} aria-hidden="true" />
              What it does
            </h3>
            <ul className={styles.checks}>
              {DOES.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={styles.listTitle}>
              <X size={18} aria-hidden="true" />
              What it does not do
            </h3>
            <ul className={styles.crosses}>
              {DOES_NOT.map((item) => (
                <li key={item}>
                  <X size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>Why the line is here.</strong> Anything that operates industrial equipment needs authorisation,
            engineering validation and safety controls that belong to your organisation. A platform that links
            records should not hold that authority, and this one does not.
          </span>
        </p>
      </Band>

      <Band
        id="approach"
        number="06"
        kicker="How each tool is reached"
        title={["Different tools.", "Different ways in."]}
        intro="Engineering software varies more than business software in what it exposes. The approach is chosen per tool, and stated before it is promised."
        tone="surface"
      >
        <dl className={styles.kv}>
          {APPROACH.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band id="status" number="07" kicker="Capability status" title={["What exists.", "What is scoped with you."]}>
        <StatusBoard only={["api-integrations", "custom-software", "erp-operations", "unified-graph", "connector-catalogue"]} />
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>No CAD, CAM or controller connector is listed as available,</strong> because none is claimed.
            Engineering integrations are built for the tools and versions you run, after we have confirmed what they
            allow.
          </span>
        </p>
      </Band>

      <Band
        id="implementation"
        number="08"
        kicker="What an implementation looks like"
        title={["Start with “which revision is current?”", "Make it a fact everyone can see."]}
        tone="surface"
      >
        <ImplementationRail />
      </Band>

      <Band id="faq" number="09" kicker="Questions" title={["Asked by engineering", "and quality leads."]}>
        <Faq items={CAD_CAM_FAQ} />
      </Band>

      <EnquirySection
        ctx={ctx}
        number="10"
        formId="cad-cam-integration"
        service="cad-cam-cnc"
        title={["Tell us what you design and program with.", "We will tell you what can connect."]}
        intro="Name the tools and how revisions are handled today, in your own words. A shared drive and a spreadsheet register is a perfectly good answer."
        formTitle="Discuss CAD/CAM integration"
      />

      <RelatedPages ctx={ctx} current="cadCam" number="11" />

      <Closing
        number="12"
        title={["From the drawing", "to the dispatched part."]}
        body="Bring one part family and the last change that went wrong. We will show you where the link was missing."
        primary={{ label: "Discuss CAD/CAM Integration", href: "#enquiry", track: "Discuss CAD/CAM Integration" }}
        secondary={{ label: "See the Factory Graph", href: `${ctx.base}/factory-graph`, track: "Factory Graph" }}
      />
      <LegalNote />
    </PlatformShell>
  );
}
