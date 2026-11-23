import { BarChart3, Bot, Check, Database, Handshake, Info, Landmark, Settings2, Workflow, X } from "lucide-react";
import { AGENTS, AGENT_WORKFLOWS, ANATOMY, MORE_WORKFLOWS, ORCHESTRATOR } from "@/lib/platform/agent-workflows";
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
  StatusBadge,
  StatusBoard,
  type FaqItem,
  type PlatformContext,
} from "../parts";
import styles from "../Platform.module.css";

/**
 * /agentic-erp-crm
 *
 * Shows agents working with approved tools and real business data rather than
 * answering questions. The five agent roles are Savin Group's own
 * (founder-confirmed as working; lib/platform/capabilities.ts). The workflows
 * are written out part by part so a reader can see where a person decides.
 *
 * The page separates three things and labels each:
 *   available now   the agent capabilities, shown in a live demonstration
 *   simulated here  the walk-throughs on this page
 *   scoped per project / planned   connections to a particular ERP or CRM
 */

export const AGENTIC_FAQ: readonly FaqItem[] = [
  {
    q: "How is this different from a chatbot on top of our ERP?",
    a: "A chatbot answers. An agent does part of a job: it reads the records the task needs, calls the tools it has been given, prepares a result and hands it to the right person. The difference shows in the tools and the approvals, not in the conversation.",
  },
  {
    q: "What stops an agent doing something it should not?",
    a: "Three things, in this order. Its role limits what it can see. Its tool list limits what it can call, and each tool uses a service identity with only the permissions that tool needs. And an approval rule holds anything that changes a business record or reaches someone outside until the named person approves it.",
  },
  {
    q: "Which ERP and CRM systems do the agents work with?",
    a: "Agents work through tools, and a tool is built against a system's API or an approved view of its data. We confirm what your ERP and CRM expose during discovery and tell you which tools are possible. We do not claim a ready-made connector for a product until we have built one against it.",
  },
  {
    q: "Are the workflows on this page real?",
    a: "They describe how each workflow is designed, with examples. The walk-throughs on this page are simulated and marked as such. The agents themselves are working capability, shown on real data in a live demonstration.",
  },
  {
    q: "Which AI models do you use, and where does our data go?",
    a: "Models are chosen for the task, and the choice is yours to constrain. Before anything is built we agree which data an agent may send to a model, which provider processes it, and what must stay inside your environment. An agent sees only the records its role permits, so a model never receives more than that.",
  },
  {
    q: "Can an agent make a mistake with our numbers?",
    a: "Any system can be wrong, which is why the design keeps figures out of the model's hands. Workflows are built so that numbers are read from your systems and calculated by code: a quote's price from your rates and routing, a report's totals from the ledger. The model's part is to understand the request, choose the tools and write the explanation, and each figure in it is shown with its source so a reviewer can check it before approving.",
  },
  {
    q: "Where do we start?",
    a: "With one workflow that costs someone hours every week and has a clear approval point, such as preparing a quote or reconciling receipts. One agent, a few read-only tools, one approval. More is added once that is trusted.",
  },
];

const DIFFERENCE = [
  { title: "It uses your data", body: "An agent reads the actual order, the actual stock balance and the actual account history, through a tool scoped to exactly that." },
  { title: "It uses approved tools", body: "Each agent has a list of things it may call. Nothing outside the list exists for it." },
  { title: "It prepares, then asks", body: "The output is a draft or a proposal with its evidence. A person approves what changes a record or leaves the building." },
] as const;

const AGENT_ICONS = [Handshake, Settings2, Landmark, BarChart3, Database] as const;

const CONTROL_YES = [
  "Read the records its role permits.",
  "Call the tools on its list.",
  "Prepare drafts, summaries and proposals.",
  "Ask the right person, with the evidence attached.",
  "Record every step it took.",
];
const CONTROL_NO = [
  "See records outside its role.",
  "Send anything to a customer or supplier unapproved, unless you set a rule allowing it.",
  "Release a purchase order, post a ledger entry or commit a date on its own.",
  "Change its own permissions or approval rules.",
  "Act on a machine. Agents have no tool that writes to equipment.",
];

const FIT = [
  ["How agents reach your systems", "Through tools built on each system's API or an approved data view. One service identity per system, with the least privilege that tool needs."],
  ["What an agent sees", "Only the records its role permits, fetched for the task in hand. There is no bulk copy of your ERP inside an agent."],
  ["Where figures come from", "By design, from your records and from calculation in code, shown with their source. The model explains a number; it is not asked to produce one."],
  ["Which models", "Selected for the task, within the constraints you set on providers and on what data may be processed where."],
  ["Where it runs", "Alongside your systems in the cloud, or inside your network where data must not leave it."],
] as const;

export function AgenticPage({ ctx }: { ctx: PlatformContext }) {
  return (
    <PlatformShell contentLang={ctx.notice ? "en" : undefined}>
      <PlatformHero
        ctx={ctx}
        crumb="Agentic ERP & CRM"
        eyebrow="Agentic ERP & CRM"
        eyebrowNote="Agents that work, with people in control"
        title={["Not another assistant that answers.", "A team of agents that prepares the work."]}
        lead="Specialised agents for sales, operations, finance and analysis use approved tools and your real business data, coordinate through a central orchestrator, and stop for a person wherever it matters."
        primary={{ label: "See an Agentic Workflow", href: "#workflows", track: "See an Agentic Workflow" }}
        secondary={{ label: "Request a live demonstration", href: "#enquiry", track: "Request a live demonstration" }}
        note="Every workflow on this page shows its trigger, its tools, its approval point and its audit trail."
        figure={
          <HubFigure
            core={["Orchestrator", "Routes · approves · records"]}
            nodes={["Sales Executive", "Operations", "Finance", "Business Analyst", "Data Steward", "Approvals", "Tools", "Audit trail"]}
          />
        }
        figureCaption={["FIG. 01", "Specialised agents, one orchestrator"]}
        facts={[
          { title: "Five specialised agents", body: "Sales Executive, Operations, Finance, Business Analyst and CRM Data Steward." },
          { title: "Approved tools only", body: "Each agent has a fixed list of what it may read and call." },
          { title: "Approval where it matters", body: "Changes and outbound messages wait for the person accountable." },
          { title: "A record of every step", body: "What was read, what was proposed, who approved, what happened." },
        ]}
      />

      <Band
        id="difference"
        number="01"
        kicker="Beyond answers"
        title={["An answer is the easy part.", "The work is what comes after."]}
        intro="Asking a model a question about your business is useful. It is also where most “AI in the ERP” stops. An agent goes on to do the part of the job that follows."
        tone="surface"
      >
        <div className={styles.cards}>
          {DIFFERENCE.map((item, index) => (
            <div key={item.title} className={styles.card}>
              <div className={styles.cardTop}>
                <Bot size={22} strokeWidth={1.3} aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band
        id="team"
        number="02"
        kicker="The agent team"
        title={["Each agent has a job.", "The orchestrator runs the team."]}
        intro="A single general-purpose agent with access to everything is hard to trust. Narrow roles with narrow permissions are easier to reason about, and easier to audit."
      >
        <div className={styles.roster}>
          <div className={styles.rosterCore}>
            <div>
              <span className={styles.mono}>Central</span>
              <h3>{ORCHESTRATOR.name}</h3>
            </div>
            <p>{ORCHESTRATOR.does}</p>
          </div>
          {AGENTS.map((agent, index) => {
            const Icon = AGENT_ICONS[index] ?? Bot;
            return (
              <div key={agent.id} className={styles.agent}>
                <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
                <h3>{agent.name}</h3>
                <p>{agent.does}</p>
                <small>
                  <b>Works with</b>
                  {agent.works}
                </small>
                <small>
                  <b>Asks a person for</b>
                  {agent.asks}
                </small>
              </div>
            );
          })}
        </div>
      </Band>

      <Band
        id="workflows"
        number="03"
        kicker="Agentic workflows"
        title={["Five workflows.", "Each in the same eight parts."]}
        intro="Trigger, context, agent, authorised tools, proposed action, approval, result, audit trail. Choose a workflow and read it across."
        tone="surface"
      >
        <Tabs
          name="agentic-workflows"
          label="Workflow"
          items={AGENT_WORKFLOWS.map((workflow) => ({
            id: workflow.id,
            label: workflow.label,
            panel: (
              <>
                <ol className={styles.chain} aria-label={`${workflow.label}: sequence`}>
                  {workflow.chain.map((step) => (
                    <li key={step.text} data-human={step.human ? "" : undefined}>
                      <span>{step.text}</span>
                    </li>
                  ))}
                </ol>
                <dl className={styles.anatomy}>
                  {ANATOMY.map(([key, label], index) => (
                    <div key={key} data-human={key === "approval" ? "" : undefined}>
                      <dt>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {label}
                      </dt>
                      <dd>{workflow[key] as string}</dd>
                    </div>
                  ))}
                </dl>
                <div className={styles.flowMeta}>
                  <DataLabel kind="simulated" />
                  <span className={styles.dataNote} style={{ margin: 0 }}>
                    A walk-through of the design, not a recording of a customer&apos;s workflow.
                  </span>
                </div>
              </>
            ),
          }))}
        />
      </Band>

      <Band
        id="more"
        number="04"
        kicker="The same pattern, elsewhere"
        title={["Wherever work waits", "on someone gathering the facts."]}
      >
        <div className={styles.cards} data-cols="4">
          {MORE_WORKFLOWS.map(([title, body]) => (
            <div key={title} className={styles.card}>
              <div className={styles.cardTop}>
                <Workflow size={20} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band
        id="control"
        number="05"
        kicker="What stays under human control"
        title={["Autonomy with a boundary.", "Drawn by you."]}
        intro="The useful question is not how autonomous an agent is. It is what it is allowed to do without asking, and who decided that."
        tone="dark"
      >
        <div className={styles.split}>
          <div>
            <h3 className={styles.listTitle}>
              <Check size={18} aria-hidden="true" />
              An agent can
            </h3>
            <ul className={styles.checks}>
              {CONTROL_YES.map((item) => (
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
              An agent cannot
            </h3>
            <ul className={styles.crosses}>
              {CONTROL_NO.map((item) => (
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
        id="status"
        number="06"
        kicker="Available, simulated, planned"
        title={["Three different things.", "Labelled as what they are."]}
        intro="It is easy to blur a working capability, a demonstration and a roadmap. This page keeps them apart."
      >
        <div className={styles.cards}>
          <div className={styles.card}>
            <StatusBadge status="available" />
            <h3 style={{ marginTop: 14 }}>Shown in a live demonstration</h3>
            <p>The agent roles, the orchestration between them and the automation builders work today, and are demonstrated on real data in a call.</p>
          </div>
          <div className={styles.card}>
            <DataLabel kind="simulated" />
            <h3 style={{ marginTop: 14 }}>Simulated on this page</h3>
            <p>The workflow walk-throughs above describe the design with examples. They are not a customer&apos;s workflow and show no customer data.</p>
          </div>
          <div className={styles.card}>
            <StatusBadge status="planned" />
            <h3 style={{ marginTop: 14 }}>Scoped per project</h3>
            <p>A tool for your particular ERP or CRM is confirmed and built against it. A catalogue of ready-made connectors is planned, not available.</p>
          </div>
        </div>
        <div style={{ marginTop: 28 }}>
          <StatusBoard
            only={["crm-agents", "erp-operations", "finance-analytics-agents", "orchestration", "automation-builders", "site-operator", "objective-planning", "connector-catalogue"]}
          />
        </div>
        <p className={styles.callout}>
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>One agent you can try now.</strong> The Savin Operator panel on this website is a tool-using agent
            with a fixed set of scoped tools. It knows this site, not your business, but it is the same pattern at a
            small scale.
          </span>
        </p>
      </Band>

      <Band
        id="fit"
        number="07"
        kicker="How it fits your infrastructure"
        title={["Around your ERP and CRM.", "Not instead of them."]}
        tone="surface"
      >
        <dl className={styles.kv}>
          {FIT.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band
        id="implementation"
        number="08"
        kicker="What an implementation looks like"
        title={["One workflow.", "One approval. Then the next."]}
      >
        <ImplementationRail />
      </Band>

      <Band id="faq" number="09" kicker="Questions" title={["Asked by operations", "and IT leads."]} tone="surface">
        <Faq items={AGENTIC_FAQ} />
      </Band>

      <EnquirySection
        ctx={ctx}
        number="10"
        formId="agentic-workflow-demo"
        service="crm-ai-agents"
        title={["See an agent do the work.", "On a call, on real data."]}
        intro="Tell us which workflow costs your team the most time. The demonstration is more useful when it is close to yours."
        formTitle="See an agentic workflow"
        systems="collapsed"
      />

      <RelatedPages ctx={ctx} current="agentic" number="11" />

      <Closing
        number="12"
        title={["Give your operation an objective.", "Let the workflow coordinate the next steps."]}
        body="Bring one workflow with a clear approval point. We will show you the agent, the tools it would need and where your people stay in charge."
        primary={{ label: "See an Agentic Workflow", href: "#enquiry", track: "See an Agentic Workflow" }}
        secondary={{ label: "See the Factory Graph", href: `${ctx.base}/factory-graph`, track: "Factory Graph" }}
      />
      <LegalNote />
    </PlatformShell>
  );
}
