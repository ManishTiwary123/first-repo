import { Activity, Cloud, Cpu, Info, Link2, Server, ShieldAlert, Timer, Wrench, Check, X } from "lucide-react";
import { DigitalTwinDemo } from "../DigitalTwinDemo";
import { PlatformShell } from "../PlatformShell";
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
  StatusBoard,
  type FaqItem,
  type PlatformContext,
} from "../parts";
import styles from "../Platform.module.css";

/**
 * /industrial-iot-digital-twins
 *
 * A product category backed by working capability (founder-confirmed; see
 * lib/platform/capabilities.ts). The page explains the architecture and lets
 * a visitor handle a simulated twin. It states no protocol, controller or
 * performance figure as supported fact: latency, buffering and the signal
 * list are presented as what gets settled per machine, because they are.
 */

export const IOT_FAQ: readonly FaqItem[] = [
  {
    q: "Which machines and controllers can you connect?",
    a: "It depends on the machine, and we check each one. What matters is the controller model, which data options are enabled on it, and how it can be reached on your network. Modern CNC controllers usually expose state, program and part-count data; older machines often do not, and can be instrumented with external sensors instead. We give you a machine-by-machine answer during discovery rather than a blanket claim.",
  },
  {
    q: "Is the digital twin on this page connected to real machines?",
    a: "No. The cell on this page is simulated in your browser and labelled as simulated data. It is there so you can see the behaviour: state from signals, a machine tied to its work order, an exception becoming a drafted task. The working machine connectivity and digital twins are shown in a live demonstration on request.",
  },
  {
    q: "Can the system stop, start or adjust a machine?",
    a: "No. Machine connections are read-only. The twin describes equipment; it does not control it. When something needs doing, a task is drafted for the supervisor or maintenance lead, who decides. No CNC command is issued, no PLC logic is changed and no safety control is bypassed.",
  },
  {
    q: "Do we need an MES first?",
    a: "No. If you have an MES, machine state feeds it so downtime does not have to be typed in. If you do not, the twin can relate machine state directly to work orders from your ERP. Either way your existing systems keep their roles.",
  },
  {
    q: "How much of our data leaves the plant?",
    a: "As much as you approve, and no more. Signals are collected at an edge gateway inside your network. You decide which of them are forwarded, at what resolution, and whether anything leaves the site at all. A fully on-premise deployment is an option.",
  },
  {
    q: "How current is the data?",
    a: "It depends on the source and we state it per machine. State changes from a controller's data interface are typically available within seconds; a signal polled over a slow link or taken from a periodic export is older. Every view says how fresh its data is, so nobody mistakes a ten-minute-old number for a live one.",
  },
  {
    q: "What happens when the network drops?",
    a: "That is a design decision made with you for each site: hold readings at the gateway and forward them when the link returns, or keep everything local. We specify the behaviour, how long data is retained and how a gap is shown, before commissioning.",
  },
];

const ARCHITECTURE = [
  ["Machine and controller", "CNC controllers, PLCs and sensors already produce signals. Nothing is installed in the control path."],
  ["Edge gateway", "Inside your network. Reads the signals, normalises them and filters what may be forwarded."],
  ["Signal model", "Raw tags become named, typed signals with units: spindle load, program in use, part count, alarm."],
  ["Digital twin", "Signals become a state per asset, with its history and its relationships."],
  ["Business context", "The state is tied to the work order, the operator booking, the part and the customer order."],
] as const;

const REPRESENTS = [
  { Icon: Activity, title: "Live signals and historical trends", body: "The current reading, and how it has moved: spindle load, feed, temperature, cycle time, whatever the equipment exposes." },
  { Icon: Cpu, title: "Equipment state", body: "Running, idle, in setup, in alarm, stopped. Defined by rules you approve, so the word means the same on every machine." },
  { Icon: Link2, title: "Machine to work order", body: "Which job is on which machine, which operation, and how many parts are done against the quantity." },
  { Icon: Timer, title: "Downtime and production events", body: "Each stop, start and part completed is recorded when it happens, against the job it happened on." },
  { Icon: ShieldAlert, title: "Alerts with context", body: "A sustained change in behaviour raises an alert that names the machine, the job and the order at risk, not a bare alarm code." },
  { Icon: Wrench, title: "Approved maintenance workflows", body: "The alert becomes a drafted task with its evidence. A supervisor approves, schedules or dismisses it, and the decision is kept." },
] as const;

const PATTERNS = [
  ["Work order context, read from the ERP", "The twin reads released work orders, routings and quantities so it knows what each machine should be doing. The ERP stays the system of record."],
  ["Machine state, offered to the MES", "Stops and starts are supplied to the MES as pre-filled entries. The operator confirms the reason instead of typing the times."],
  ["Part counts, proposed to production booking", "Completed quantities are proposed against the operation. Booking them follows the confirmation step your process already has."],
  ["Exceptions, drafted as maintenance tasks", "A task is created as a draft in the maintenance or ERP system, with the readings attached, for the person who owns the machine."],
] as const;

const DEPLOY = [
  { Icon: Cpu, title: "At the edge", body: "A gateway in the plant, on the machine network or a segregated one. Collects, normalises and filters. Sits between the equipment and everything else." },
  { Icon: Server, title: "On your premises", body: "The twin and its history run on your infrastructure. Nothing leaves the site. Suits operations with strict data rules." },
  { Icon: Cloud, title: "In the cloud", body: "The twin runs in a managed environment and receives only the signals you approve. Suits multi-plant views and remote teams." },
] as const;

const CONSIDERATIONS = [
  ["Data latency", "Stated per signal. A controller data interface is typically seconds behind; a polled or exported source is slower. Views show the age of what they display."],
  ["Availability", "What happens when a link drops is specified per site: buffer at the gateway and forward later, or stay local."],
  ["Time and ordering", "Machines, gateways and servers keep different clocks. Events are stamped at the edge and ordered there, so a late delivery does not rewrite history."],
  ["Network segregation", "The gateway is the only thing that talks to the machine network. Office systems and the cloud never reach a controller directly."],
  ["Direction of travel", "Data flows from the equipment outward. There is no path by which the platform writes to a controller or a PLC."],
  ["Data minimisation", "Forward the signals that answer a question, at the resolution it needs. Raw high-frequency data stays at the edge unless there is a reason to move it."],
  ["Sensitive detail", "Machine addresses, credentials and customer identifiers stay inside the deployment. None appears in a public demonstration."],
] as const;

const DOES = [
  "Reads state, counts, alarms and process signals.",
  "Relates each machine to its job, part and order.",
  "Raises an alert when behaviour leaves its pattern.",
  "Drafts a maintenance task for a person to decide on.",
];
const DOES_NOT = [
  "Send a command to a CNC controller.",
  "Change PLC logic, offsets, feeds or speeds.",
  "Override an interlock or a safety function.",
  "Stop or start a machine on its own decision.",
];

export function IotPage({ ctx }: { ctx: PlatformContext }) {
  return (
    <PlatformShell contentLang={ctx.notice ? "en" : undefined}>
      <PlatformHero
        ctx={ctx}
        crumb="Industrial IoT & Digital Twins"
        eyebrow="Industrial IoT & Digital Twins"
        eyebrowNote="From machine signals to business decisions"
        title={["Your machines already know what happened.", "Let the business know too."]}
        lead="Connect equipment to a real-time digital twin, then tie each machine's state to the work order it is running, the downtime it causes and the maintenance it needs."
        primary={{ label: "Discuss Your Machine Integration", href: "#enquiry", track: "Discuss Your Machine Integration" }}
        secondary={{ label: "Try the simulated twin", href: "#twin", track: "Try the simulated twin" }}
        note="Read-only by design. The twin describes your equipment; it does not control it."
        figure={
          <HubFigure
            core={["Digital twin", "State · history · context"]}
            nodes={["CNC machines", "PLCs", "Sensors", "Edge gateway", "MES", "ERP", "Maintenance", "Alerts"]}
          />
        }
        figureCaption={["FIG. 01", "Physical equipment, given operational context"]}
        facts={[
          { title: "Working capability", body: "Real-time machine connectivity and digital twins run today, and are shown in a live demonstration." },
          { title: "Read-only connections", body: "Signals flow outward from the equipment. Nothing is written to a controller." },
          { title: "Context, not just charts", body: "Every state is tied to a work order, a part and a customer commitment." },
          { title: "Your network, your rules", body: "An edge gateway in the plant. You decide what leaves it." },
        ]}
      />

      <Band
        id="problem"
        number="01"
        kicker="The problem"
        title={["The machine knew at 10:14.", "Planning found out the next morning."]}
        intro="Equipment produces a continuous account of what it is doing. In most plants that account stops at the machine, and the business runs on what people remembered to write down."
        tone="surface"
      >
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Downtime on paper</h3>
            <p>Stops are logged by hand, hours later, with rounded times and a guessed reason. The order they delayed is never linked to them.</p>
          </div>
          <div className={styles.card}>
            <h3>A dashboard nobody acts on</h3>
            <p>A screen shows a machine is red. It does not say which job is on it, which customer is waiting, or who should do what.</p>
          </div>
          <div className={styles.card}>
            <h3>Two versions of production</h3>
            <p>The ERP holds what was booked. The floor holds what happened. Reconciling the two is somebody&apos;s daily job.</p>
          </div>
        </div>
      </Band>

      <Band
        id="architecture"
        number="02"
        kicker="Machine connection architecture"
        title={["Five layers.", "Each one adds meaning."]}
        intro="A signal is only useful once it has a name, a state and a job attached to it. This is the path from the controller to the business."
      >
        <ol className={styles.rail} style={{ ["--rail-count" as string]: ARCHITECTURE.length }}>
          {ARCHITECTURE.map(([title, body], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>Illustrative architecture.</strong> Which signals are available, and by which route, depends on
            each machine&apos;s controller, the options enabled on it and your network. We establish that per machine
            before quoting a connection.
          </span>
        </p>
      </Band>

      <Band
        id="twin"
        number="03"
        kicker="Interactive demonstration"
        title={["A digital twin you can handle.", "On data we made up, and say so."]}
        intro="Four example machines on example work orders. Select one, watch its state, then simulate an exception and decide what happens to the task it produces."
        tone="surface"
        scene
      >
        <DigitalTwinDemo />
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>This is a simulation.</strong> Every reading is generated in your browser. It is not connected to
            any machine, and it shows no customer&apos;s telemetry. To see the working twin on real equipment, ask for
            a live demonstration.
          </span>
        </p>
      </Band>

      <Band
        id="represents"
        number="04"
        kicker="Digital twin representation"
        title={["What the twin holds.", "And what each part is for."]}
        intro="Your ERP knows the records. Your digital twin knows the equipment. These six things are how the second is made useful to the first."
      >
        <div className={styles.cards}>
          {REPRESENTS.map(({ Icon, title, body }) => (
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
        id="erp-mes"
        number="05"
        kicker="ERP and MES integration patterns"
        title={["Four ways the twin meets", "your business systems."]}
        intro="None of them replaces a system you have. Each one removes a place where a person carries information from the floor to a screen."
        tone="surface"
      >
        <dl className={styles.kv}>
          {PATTERNS.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band
        id="control"
        number="06"
        kicker="What stays under human control"
        title={["It observes.", "People decide."]}
        intro="A platform that can see a machine must be clear about what it will never do to one."
        tone="dark"
      >
        <div className={styles.split}>
          <div>
            <h3 className={styles.listTitle}>
              <Check size={18} aria-hidden="true" />
              What the twin does
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
              What it never does
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
      </Band>

      <Band
        id="deployment"
        number="07"
        kicker="Edge, cloud and on-premise"
        title={["Close to the machine.", "As far from it as you allow."]}
      >
        <div className={styles.cards}>
          {DEPLOY.map(({ Icon, title, body }) => (
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
        id="considerations"
        number="08"
        kicker="Latency, availability and security"
        title={["The engineering questions.", "Settled before commissioning."]}
        intro="These are not features to list. They are decisions that have to be made for your site, written down, and tested."
        tone="surface"
      >
        <dl className={styles.kv}>
          {CONSIDERATIONS.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band id="status" number="09" kicker="Capability status" title={["What you can see today.", "What is still ahead."]}>
        <StatusBoard only={["machine-connectivity", "digital-twin", "api-integrations", "command-center", "connector-catalogue", "public-live-demo"]} />
      </Band>

      <Band
        id="implementation"
        number="10"
        kicker="What an implementation looks like"
        title={["Start with one machine", "and one question."]}
        intro="Usually: which job was this machine running when it stopped, and what did that cost the order?"
        tone="surface"
      >
        <ImplementationRail />
      </Band>

      <Band id="faq" number="11" kicker="Questions" title={["Asked by plant", "and maintenance leads."]}>
        <Faq items={IOT_FAQ} />
      </Band>

      <EnquirySection
        ctx={ctx}
        number="12"
        formId="iiot-machine-integration"
        service="iiot-digital-twin"
        title={["Tell us about your machines.", "We will tell you what is possible."]}
        intro="Makes, controllers and rough counts are enough to start. You do not need to know protocols or part numbers; that is what the first conversation is for."
        formTitle="Discuss your machine integration"
      />

      <RelatedPages ctx={ctx} current="iot" number="13" />

      <Closing
        number="14"
        title={["From machine signals", "to business decisions."]}
        body="Bring one machine and one question. We will show you what it takes to connect the first and answer the second."
        primary={{ label: "Discuss Your Machine Integration", href: "#enquiry", track: "Discuss Your Machine Integration" }}
        secondary={{ label: "See the Factory Graph", href: `${ctx.base}/factory-graph`, track: "Factory Graph" }}
      />
      <LegalNote />
    </PlatformShell>
  );
}
