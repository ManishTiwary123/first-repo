import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Cloud,
  Cpu,
  DraftingCompass,
  Info,
  KeyRound,
  Network,
  Radio,
  Server,
  X,
} from "lucide-react";
import { FactoryGraphExplorer } from "../FactoryGraphExplorer";
import { MissionDemo } from "../MissionDemo";
import { PlatformShell } from "../PlatformShell";
import {
  Band,
  Closing,
  DataLabel,
  EnquirySection,
  Faq,
  HubFigure,
  LegalNote,
  PlatformHero,
  RelatedPages,
  StatusBoard,
  type FaqItem,
  type PlatformContext,
} from "../parts";
import styles from "../Platform.module.css";

/**
 * /factory-graph: the flagship page.
 *
 * Reading order follows the questions a plant or IT leader asks, in the order
 * they ask them: what is wrong today, what is this, show me, will it work
 * with what I have, what does it actually do, who stays in control, is it
 * real, how do I start.
 *
 * Every capability statement on this page is either in
 * lib/platform/capabilities.ts with its status and basis, or is a description
 * of an approach ("connects through the system's API") rather than a claim
 * about a finished connector.
 */

export const FACTORY_GRAPH_FAQ: readonly FaqItem[] = [
  {
    q: "Do we have to replace our ERP, CAD/CAM tools or machines?",
    a: "No. Factory Graph is a layer around what you run, not a replacement for it. Your ERP stays the system of record for orders and stock, your CAD and CAM tools keep the design and the programs, and your controllers keep running the machines. We connect to each where it allows, and relate what they already know.",
  },
  {
    q: "Does “single node” mean all our data moves into one database?",
    a: "No. The single node is one place to see and coordinate the operation, not one place to store it. Records stay in the systems that own them. Factory Graph holds identities, relationships and events, and reads the detail from the source when it is needed. If you need everything to stay inside your network, the layer can be deployed there.",
  },
  {
    q: "Which systems can you connect?",
    a: "Whatever exposes a way in: an API, an approved database view, a file export, or for equipment a controller data interface or an edge gateway. We confirm each system against your versions, licences and access during discovery, and tell you plainly where a connection is not practical. A product named on this page is an integration target, not a promise that a ready-made connector exists.",
  },
  {
    q: "Can Factory Graph control our machines?",
    a: "No. Machine connections are read-only. Factory Graph does not send CNC commands, change PLC logic, alter machine settings or bypass a safety control, and it does not release engineering changes. It can prepare a task or a recommendation for the person responsible, who decides.",
  },
  {
    q: "What can an AI agent do without asking a person?",
    a: "Only what you permit. Each agent has a role, a set of tools it may call and a set of records it may see. Reading and preparing are usually allowed; anything that changes a business record or reaches a customer or supplier is proposed and waits for the approval rule you set. Every read, draft and approval is recorded.",
  },
  {
    q: "Is the explorer on this page showing live data?",
    a: "No. The explorer and the mission demonstration on this page run on illustrative and example data, and are labelled that way. Nothing on the public website is connected to an operational system. The working machine connectivity, digital twins and agents are shown in a live demonstration on request.",
  },
  {
    q: "What does a first implementation look like?",
    a: "It starts with one constraint, not the whole factory. A typical first step connects one or two systems read-only, so a single question can be answered that could not be answered before, for example which work order a stopped machine was running. Governed actions and further systems are added once that first connection has proved useful. Scope, timeline and measures are agreed in writing before any build.",
  },
  {
    q: "How do you handle security and data boundaries?",
    a: "Access goes through a backend service with its own least-privilege identity for each system. Customers are isolated from each other. Secrets stay on the server. The public website and its enquiry form are separate from any industrial network. Deployment can be cloud, on your premises, or split, with an edge gateway in the plant and only approved data leaving it.",
  },
];

const PROBLEMS = [
  {
    before: "The ERP says the order is in production.",
    beforeBody: "It cannot say which machine has the job, whether that machine is cutting, or how many parts are done.",
    after: "The order knows its machine.",
    afterBody: "The work order is related to the asset running it and to that asset's live state.",
  },
  {
    before: "Engineering released revision D.",
    beforeBody: "Purchasing is still buying for C, planning has two jobs open on C, and the program on the machine is for C.",
    after: "A revision change reaches everyone it affects.",
    afterBody: "The change is traced to open purchase orders, work orders, program references and inspection plans, for their owners to act on.",
  },
  {
    before: "A machine stopped for forty minutes.",
    beforeBody: "It was written on a sheet, typed in the next morning, and never connected to the order that slipped.",
    after: "Downtime has a job, a cause and a consequence.",
    afterBody: "The stop is recorded as it happens, against the work order, with the delivery promise it puts at risk.",
  },
  {
    before: "A customer asks, “Can you deliver by Friday?”",
    beforeBody: "Answering takes three people, two spreadsheets and a walk to the shop floor.",
    after: "One question, checked against the sources.",
    afterBody: "Revision, stock, capacity and cost are read from the systems that hold them, and the answer lists what it depends on.",
  },
];

const PRINCIPLES = [
  ["Federated access", "Each system is reached where it lives. Detail is read from the source when it is needed, not copied wholesale."],
  ["Identity and entity resolution", "The customer in the CRM, the customer in the ERP and the name on the drawing are recognised as one."],
  ["Shared enterprise graph", "Customers, parts, revisions, orders, machines, lots and shipments, and how each relates to the others."],
  ["Operational events", "Order released, lot received, cycle started, inspection failed: the things that happen, as they happen."],
  ["Digital twin context", "What each asset is doing now, what it has been doing, and which job it is doing it for."],
  ["Governed agent orchestration", "Specialised agents prepare work with approved tools, inside role-based permissions."],
  ["Workflow execution and observability", "Each workflow can be followed step by step: what ran, on which data, with what result."],
  ["Authorisation, approvals and audit", "Who may see what, which actions need a person, and a record of every decision."],
] as const;

const PATTERNS = [
  ["Application APIs", "The first choice where a system offers one. A service identity is scoped to the objects in use."],
  ["Approved database views", "For systems without a usable API. Read-only views, agreed with the system's owner."],
  ["File and export exchange", "Scheduled exports and drop folders still run a great deal of manufacturing. They are a valid way in."],
  ["Events and webhooks", "Where a system can announce a change, it is taken as it happens instead of being polled for."],
  ["Edge gateway for equipment", "Machine and sensor signals are collected inside the plant network. Only approved data leaves it."],
] as const;

const PILLARS = [
  {
    Icon: Radio,
    tag: "Machines",
    title: "From machine signals to business decisions",
    body: "Your ERP knows the records. Your digital twin knows the equipment. Relating the two is where a stopped spindle becomes a delivery risk someone can act on.",
    link: "industrial-iot-digital-twins",
    label: "Industrial IoT & Digital Twins",
  },
  {
    Icon: Bot,
    tag: "Agents",
    title: "Agents that do the preparation",
    body: "Sales, operations, finance and analysis agents read real business data and use approved tools. A central orchestrator routes the work; people approve what matters.",
    link: "agentic-erp-crm",
    label: "Agentic ERP & CRM",
  },
  {
    Icon: DraftingCompass,
    tag: "Engineering",
    title: "From the drawing to the dispatched part",
    body: "Revisions, BOMs and program references are tied to orders, plans, machines and inspection results, so a change is seen by everyone it touches.",
    link: "cad-cam-cnc-integration",
    label: "CAD/CAM & CNC Integration",
  },
] as const;

const DATA_ARCHITECTURE = [
  ["Source of truth", "Unchanged. The ERP owns orders and stock, the CRM owns accounts, the PDM owns revisions, the controller owns the machine. Factory Graph relates them; it does not overrule them."],
  ["What the graph stores", "Identifiers, relationships, events and the state history of assets. Enough to answer “what is related to what, and what happened”, without a second copy of your business."],
  ["Entity resolution", "Matching rules you can inspect, with ambiguous matches queued for a person rather than guessed."],
  ["Freshness", "Stated per source. A machine state is seconds old; a nightly export is a day old. An answer says which it used."],
  ["Customer boundaries", "Each customer's data is isolated. Nothing from one deployment is visible to, or used for, another."],
  ["Where it runs", "Cloud, on your premises, or split. On-premise requirements are a deployment choice, not an exception."],
] as const;

const INTEGRATIONS = [
  { title: "ERP and finance", targets: "SAP, Odoo, Microsoft Dynamics, Tally, a custom ERP", how: "API, approved database view or export." },
  { title: "CRM and sales", targets: "Zoho, Salesforce, HubSpot, a custom CRM", how: "API with a scoped service identity." },
  { title: "CAD, PDM and PLM", targets: "SOLIDWORKS, Autodesk Inventor, Siemens NX, a PDM or PLM vault", how: "Revision status and document references. Design files stay in place." },
  { title: "CAM and program storage", targets: "Mastercam, Autodesk Fusion, hyperMILL, a program repository", how: "Program numbers and versions by reference. No toolpath is generated or changed." },
  { title: "CNC controllers", targets: "FANUC, Siemens, Haas, Mitsubishi", how: "Read-only machine state through the controller's data interface or a gateway." },
  { title: "PLCs, SCADA and sensors", targets: "Sources that speak OPC UA, MQTT, Modbus or MTConnect", how: "Signals collected at an edge gateway inside your network." },
  { title: "MES, WMS and QMS", targets: "Execution, warehouse and quality systems, including in-house ones", how: "Job status, stock movements and inspection results." },
  { title: "Communication", targets: "Email, telephony, messaging and marketing platforms", how: "Drafts and notifications. Outbound messages follow recorded consent and your approval rule." },
] as const;

const USE_CASES = [
  ["CNC and precision engineering", "Know which job each machine is running, and which revision and program it is running it with."],
  ["Automotive components", "Trace a shipped lot back to its machine, program, material and inspection, when a customer asks."],
  ["Metal fabrication", "Quote from the routing, the stock and the real capacity, instead of from memory."],
  ["Multi-plant operations", "One view of orders, capacity and exceptions across sites that run different systems."],
] as const;

const DEPLOYMENT = [
  { Icon: Cloud, title: "Cloud", body: "The layer runs in a managed cloud environment and reaches your systems through their APIs and a secured gateway." },
  { Icon: Server, title: "On your premises", body: "The layer runs inside your network, for operations where data must not leave the site." },
  { Icon: Cpu, title: "Edge and cloud together", body: "A gateway in the plant collects and filters machine data. Only what you approve is sent on." },
] as const;

const SECURITY = [
  "Backend-mediated access: no system credential ever reaches a browser.",
  "A separate least-privilege identity for each connected system.",
  "Read-only by default. A write is a named, approved capability, not an accident.",
  "Each customer's data isolated from every other's.",
  "Secrets held server-side and rotated without a redeploy of your systems.",
  "The public website and its enquiry form are not connected to any industrial network.",
];

const HUMAN_YES = [
  "Reads records and signals from the systems you connect.",
  "Relates them: this order, this part, this revision, this machine.",
  "Prepares drafts: a quote, a requisition, a maintenance task, a report.",
  "Routes each proposal to the person whose decision it is.",
  "Records what it read, what it proposed and who approved it.",
];

const HUMAN_NO = [
  "Issue CNC commands or change a machine's settings.",
  "Modify PLC logic or bypass a safety control.",
  "Release an engineering change or approve a program.",
  "Release a purchase order, post to the ledger or commit a delivery date without the approval you require.",
  "Send a message to a customer or supplier that a person has not approved, unless you have set a rule that allows it.",
];

export function FactoryGraphPage({ ctx }: { ctx: PlatformContext }) {
  const { base } = ctx;
  return (
    <PlatformShell contentLang={ctx.notice ? "en" : undefined}>
      <PlatformHero
        ctx={ctx}
        crumb="Factory Graph"
        eyebrow="Factory Graph"
        eyebrowNote="The intelligence layer for the connected enterprise"
        title={["Your factory already has the systems.", "Now give them one intelligence."]}
        lead="Connect your machines, digital twins, engineering software, ERP, CRM and business workflows through an intelligent orchestration layer built around your existing operation."
        primary={{ label: "Book a Factory Graph Demo", href: "#enquiry", track: "Book a Factory Graph Demo" }}
        secondary={{ label: "Explore the Architecture", href: "#architecture", track: "Explore the Architecture" }}
        note="Your systems shouldn't need replacing to start working together. Each one keeps its data and its job."
        figure={
          <HubFigure
            core={["Factory Graph", "Enterprise intelligence"]}
            nodes={["Machines", "Digital twin", "CAD / CAM", "ERP", "CRM", "Quality", "Inventory", "AI agents"]}
          />
        }
        figureCaption={["FIG. 01", "One layer around what you already run"]}
        facts={[
          { title: "Connects, does not replace", body: "ERP, CAD/CAM, machines and custom applications stay where they are." },
          { title: "Read-only by default", body: "Equipment is observed, never commanded. Writes are proposed and approved." },
          { title: "People decide", body: "Agents prepare the work. Approvals and the audit trail are part of the design." },
          { title: "Your data boundaries", body: "Source systems keep ownership. Cloud, on-premise or split deployment." },
        ]}
      />

      <Band
        id="problem"
        number="01"
        kicker="The problem"
        title={["Every system is right.", "None of them has the whole picture."]}
        intro="A manufacturer rarely lacks systems. What is missing is the relationship between them, so people carry the context from one screen to the next."
        tone="surface"
      >
        <div className={styles.pairs}>
          {PROBLEMS.map((item, index) => (
            <div key={item.before} className={styles.pair}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <span className={styles.pairLabel}>Disconnected</span>
                <h3>{item.before}</h3>
                <p>{item.beforeBody}</p>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
              <div>
                <span className={styles.pairLabel}>With the context connected</span>
                <h3>{item.after}</h3>
                <p>{item.afterBody}</p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      <Band
        id="concept"
        number="02"
        kicker="The Factory Graph concept"
        title={["The single node principle.", "One view. Many sources."]}
        intro="Factory Graph gives the enterprise one place to understand and coordinate its operation, built from eight parts. From isolated applications to one connected enterprise."
      >
        <ol className={styles.cards} data-cols="4">
          {PRINCIPLES.map(([title, body], index) => (
            <li key={title} className={styles.card}>
              <div className={styles.cardTop}>
                <Network size={20} strokeWidth={1.3} aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>“Single node” is not “single database”.</strong> It never means forcing your data into one physical
            store. Source-of-truth ownership, customer data boundaries and on-premise requirements are preserved by
            design.
          </span>
        </p>
      </Band>

      <Band
        id="architecture"
        number="03"
        kicker="Interactive enterprise architecture"
        title={["Explore the graph.", "Follow a workflow through it."]}
        intro="Seventeen kinds of system around one hub. Pick a story and step through it, or select any system to see what it holds and how it connects."
        tone="surface"
        scene
      >
        <FactoryGraphExplorer base={base} />
      </Band>

      <Band
        id="integration"
        number="04"
        kicker="Existing software integration"
        title={["Built around what you run.", "Connected the way each system allows."]}
        intro="There is no one connector that fits a factory. Each system is reached by the most direct route it offers, and the route is agreed with whoever owns that system."
      >
        <div className={`${styles.split} ${styles.splitWide}`}>
          <div>
            <p className={styles.prose}>
              A manufacturer may run SAP, Odoo, Microsoft Dynamics, Tally or an in-house ERP; Zoho, Salesforce or a
              custom CRM; SOLIDWORKS and Mastercam; machines on FANUC or Siemens controllers; PLCs, a SCADA system, an
              MES, and several applications written for that one company.
            </p>
            <p className={styles.prose}>
              <strong>These are integration targets, not a list of finished connectors.</strong> For each one we
              establish what it exposes, what your licence permits and who must approve access, before promising
              anything about it.
            </p>
            <p className={styles.callout}>
              <KeyRound size={17} aria-hidden="true" />
              <span>
                <strong>Authorised and technically feasible.</strong> We connect a system only with its owner&apos;s
                permission and through a supported way in. Where that is not possible, we say so during discovery.
              </span>
            </p>
          </div>
          <dl className={styles.kv}>
            {PATTERNS.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      <Band
        id="capabilities-in-depth"
        number="05"
        kicker="Machines, agents, engineering"
        title={["Three places the graph earns its keep.", "Each has its own page."]}
        tone="surface"
      >
        <div className={styles.cards}>
          {PILLARS.map(({ Icon, tag, title, body, link, label }) => (
            <div key={link} className={styles.card}>
              <div className={styles.cardTop}>
                <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
                <span>{tag}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <p>
                <Link
                  href={`${base}/${link}`}
                  className={styles.panelLink}
                  data-track="cta_click"
                  data-track-label={label}
                  data-track-location="factory-graph-pillars"
                >
                  {label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </p>
            </div>
          ))}
        </div>
      </Band>

      <Band
        id="mission"
        number="06"
        kicker="Give your enterprise an objective"
        title={["Ask the operation a question.", "Get a checked plan, not a guess."]}
        intro="Give your operation an objective and let intelligent workflows coordinate the next steps. Below is that idea worked through on an example dataset you can change."
      >
        <MissionDemo />
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>What this demonstration is.</strong> A calculation on example data, running in your browser. It is
            not connected to an ERP or a machine, and it is not an agent with access to anything. It shows the shape of
            the answer: sources read, feasibility calculated, constraints named, approvals listed.
          </span>
        </p>
      </Band>

      <Band
        id="data-architecture"
        number="07"
        kicker="Enterprise data architecture"
        title={["Your data stays yours.", "And stays where it belongs."]}
        intro="The questions an IT or data lead asks first, answered directly."
        tone="surface"
      >
        <dl className={styles.kv}>
          {DATA_ARCHITECTURE.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band
        id="governance"
        number="08"
        kicker="Role-based permissions and approvals"
        title={["Governed coordination.", "Not unrestricted control."]}
        intro="Enterprise autonomy means agents and workflows doing the preparation inside clear limits, with people deciding what happens. This is where the line is drawn."
        tone="dark"
      >
        <div className={styles.split}>
          <div>
            <h3 className={styles.listTitle}>
              <Check size={18} aria-hidden="true" />
              What Factory Graph does
            </h3>
            <ul className={styles.checks}>
              {HUMAN_YES.map((item) => (
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
              {HUMAN_NO.map((item) => (
                <li key={item}>
                  <X size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ol className={styles.rail} style={{ ["--rail-count" as string]: 4, marginTop: 34 }}>
          <li>
            <span>01</span>
            <strong>Roles</strong>
            <p>Each person and each agent has a role. A role decides which records are visible.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Scoped tools</strong>
            <p>An agent can call only the tools its role lists, with the service identity for that system.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Approval rules</strong>
            <p>You define which actions need a person, which person, and above what value.</p>
          </li>
          <li>
            <span>04</span>
            <strong>Audit history</strong>
            <p>Every read, proposal, approval and result is recorded with its time, actor and source.</p>
          </li>
        </ol>
      </Band>

      <Band
        id="integrations"
        number="09"
        kicker="Supported and potential integrations"
        title={["The systems manufacturers run.", "Confirmed one by one."]}
        intro="Grouped by what they do. The names are examples of what a group contains, and each connection is confirmed for your versions and licences before it is promised."
      >
        <div className={styles.cards} data-cols="4">
          {INTEGRATIONS.map((item) => (
            <div key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.targets}</p>
              <ul>
                <li>{item.how}</li>
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>How to read this list.</strong> It describes where Factory Graph is designed to connect and how. It
            does not claim a certified or pre-built connector for any named product. Ask us which of your systems we
            have connected before; we will answer for each one.
          </span>
        </p>
      </Band>

      <Band
        id="proof"
        number="10"
        kicker="Demonstrable product capabilities"
        title={["What is real today.", "What is being built. What is not there yet."]}
        intro="We would rather show a working system than describe one. This is the state of each capability, without rounding up."
        tone="surface"
      >
        <StatusBoard />
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>Why there are no screenshots, logos or percentages here.</strong> Published proof has to be
            something a customer has approved. Until sanitised screenshots and approved project results are available
            for these capabilities, this page shows none, and the working system is demonstrated in a call. The{" "}
            <Link href={`${base}/case-studies`}>case studies</Link> describe individual engagements, not a forecast.
          </span>
        </p>
        <div className={styles.bandFoot}>
          <span>
            Interactive examples on this site are labelled: <DataLabel kind="simulated" /> <DataLabel kind="example" />{" "}
            <DataLabel kind="illustrative" />
          </span>
        </div>
      </Band>

      <Band
        id="use-cases"
        number="11"
        kicker="Industry use cases"
        title={["Different plants.", "The same missing context."]}
      >
        <div className={styles.cards} data-cols="4">
          {USE_CASES.map(([title, body]) => (
            <div key={title} className={styles.card}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <div className={styles.bandFoot}>
          <span>Seven kinds of manufacturing, each with its problem, an example workflow and what to measure.</span>
          <Link
            href={`${base}/manufacturing-solutions`}
            data-track="cta_click"
            data-track-label="Manufacturing Solutions"
            data-track-location="factory-graph-use-cases"
          >
            Manufacturing solutions
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </Band>

      <Band
        id="deployment"
        number="12"
        kicker="Deployment and security"
        title={["Where it runs is your decision.", "How it is secured is not optional."]}
        tone="surface"
      >
        <div className={styles.cards}>
          {DEPLOYMENT.map(({ Icon, title, body }) => (
            <div key={title} className={styles.card}>
              <div className={styles.cardTop}>
                <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <ul className={styles.checks} style={{ marginTop: 30 }}>
          {SECURITY.map((item) => (
            <li key={item}>
              <Check size={16} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Band>

      <Band id="faq" number="13" kicker="Questions" title={["Asked before a first call.", "Answered here."]}>
        <Faq items={FACTORY_GRAPH_FAQ} />
      </Band>

      <EnquirySection
        ctx={ctx}
        number="14"
        formId="factory-graph-demo"
        service="factory-graph"
        kicker="Enterprise discovery"
        title={["See it working.", "On a call, with your questions."]}
        intro="Tell us what you run and where the handoffs hurt. A demonstration is most useful when it starts from your operation, so the form asks about it."
        formTitle="Book a Factory Graph demo"
      />

      <RelatedPages ctx={ctx} current="factoryGraph" number="15" />

      <Closing
        number="16"
        title={["Connect what you already have.", "Coordinate it with one intelligence."]}
        body="We connect the software, machines and people you already have, and give your enterprise a new level of coordinated intelligence. Start with one question your systems cannot answer together today."
        primary={{ label: "Book a Factory Graph Demo", href: "#enquiry", track: "Book a Factory Graph Demo" }}
        secondary={{ label: "Book an industrial systems audit", href: `${base}/industrial-systems-audit`, track: "Industrial Systems Audit" }}
      />
      <LegalNote />
    </PlatformShell>
  );
}
