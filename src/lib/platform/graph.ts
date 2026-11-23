// lib/platform/graph.ts
//
// The data behind the Factory Graph explorer: the systems around the hub and
// three stories told across them. The component
// (components/platform/FactoryGraphExplorer.tsx) only draws what is here.
//
// TRUTHFULNESS RULES FOR THIS FILE
//   - Every story is an illustration. None describes a named customer, and no
//     figure in it is a measurement.
//   - `targets` lists the kinds of product a node usually stands for. They are
//     integration targets to be confirmed per project, not a list of connectors
//     that already exist. The panel says so next to them.
//   - Access is described as it is designed: read by default, writes proposed
//     and approved. Nothing here says Factory Graph commands a machine,
//     because it does not.
//
// Pure: no imports. scripts/platform.test.mjs checks its integrity.

export type GraphDomain = "engineering" | "intelligence" | "commercial" | "business" | "shopfloor";

export const DOMAIN_LABEL: Record<GraphDomain, string> = {
  engineering: "Engineering",
  intelligence: "Intelligence",
  commercial: "Commercial",
  business: "Business systems",
  shopfloor: "Shop floor",
};

/** Order the domains are listed in on small screens and read by a screen reader. */
export const DOMAIN_ORDER: readonly GraphDomain[] = ["shopfloor", "engineering", "business", "commercial", "intelligence"];

export type NodeId =
  | "cad" | "cam" | "agents" | "crm" | "sales" | "marketing"
  | "finance" | "erp" | "procurement"
  | "suppliers" | "inventory" | "delivery" | "quality" | "mes"
  | "cnc" | "iot" | "twin";

export type PlatformLink = "factoryGraph" | "iot" | "agentic" | "cadCam" | "manufacturing";

export interface GraphNode {
  id: NodeId;
  label: string;
  domain: GraphDomain;
  /** Centre of the node on the 1000 x 600 canvas. */
  x: number;
  y: number;
  /** Which way the hover label opens, away from the canvas edge. */
  tip: "top" | "bottom" | "left" | "right";
  /** One line: what this system is for. Shown on hover and focus. */
  purpose: string;
  records: string[];
  events: string[];
  /** How Factory Graph reaches it, and what it may do there. */
  connects: string;
  /** Kinds of product this node usually stands for. Targets, not claims. */
  targets: string;
  link: PlatformLink;
}

export const GRAPH_CANVAS = { width: 1000, height: 600, hub: { x: 500, y: 300 } } as const;

export const GRAPH_HUB = {
  label: "Factory Graph",
  sub: "Enterprise intelligence",
  purpose:
    "Recognises the same customer, part, order and machine across your systems, and coordinates governed work between them. Each system stays the owner of its own records.",
} as const;

export const GRAPH_NODES: readonly GraphNode[] = [
  {
    id: "cad", label: "CAD", domain: "engineering", x: 105, y: 58, tip: "bottom",
    purpose: "Where a part is defined: models, drawings and their revisions.",
    records: ["Part", "Drawing", "Revision", "Engineering BOM"],
    events: ["Revision released", "Drawing superseded"],
    connects: "Reads revision status and document references from a PDM vault, a shared folder or an export. Design files stay where they are.",
    targets: "SOLIDWORKS, Autodesk Inventor, Siemens NX, a PDM or PLM vault",
    link: "cadCam",
  },
  {
    id: "cam", label: "CAM", domain: "engineering", x: 263, y: 58, tip: "bottom",
    purpose: "Where a released design becomes a machining strategy: programs, setups and tool lists.",
    records: ["Program reference", "Program version", "Setup sheet", "Tool list"],
    events: ["Program version approved", "Tool list changed"],
    connects: "References program numbers and versions against the part revision. It does not generate, edit or post toolpaths.",
    targets: "Mastercam, Autodesk Fusion, hyperMILL, a program repository",
    link: "cadCam",
  },
  {
    id: "agents", label: "AI agents", domain: "intelligence", x: 421, y: 58, tip: "bottom",
    purpose: "Specialised agents that prepare work inside the permissions you set.",
    records: ["Task", "Proposed action", "Approval request", "Audit entry"],
    events: ["Action proposed", "Approval requested", "Action completed"],
    connects: "Agents call approved tools only. A change to a business record is proposed first and waits for the approval rule you define.",
    targets: "Sales Executive, Operations, Finance, Business Analyst and CRM Data Steward agents",
    link: "agentic",
  },
  {
    id: "crm", label: "CRM", domain: "commercial", x: 579, y: 58, tip: "bottom",
    purpose: "The customer record: accounts, contacts, inquiries and opportunities.",
    records: ["Account", "Contact", "Inquiry", "Opportunity"],
    events: ["Inquiry received", "Stage changed"],
    connects: "Reads and updates through the CRM's API, with a service identity limited to the objects in use.",
    targets: "Zoho CRM, Salesforce, HubSpot, a custom CRM",
    link: "agentic",
  },
  {
    id: "sales", label: "Sales", domain: "commercial", x: 737, y: 58, tip: "bottom",
    purpose: "Quotes, orders and the commitments made to customers.",
    records: ["Quote", "Sales order", "Delivery promise"],
    events: ["Quote requested", "Order confirmed"],
    connects: "Prepares quote drafts and order summaries from CRM and ERP data. A person approves anything a customer will see.",
    targets: "The quoting and order-entry parts of your CRM or ERP",
    link: "agentic",
  },
  {
    id: "marketing", label: "Marketing", domain: "commercial", x: 895, y: 58, tip: "bottom",
    purpose: "Campaigns and the audiences they reach.",
    records: ["Campaign", "Segment", "Consent record"],
    events: ["Campaign prepared", "Lead captured"],
    connects: "Prepares segments and drafts from CRM data. Messages go only to contacts with recorded consent.",
    targets: "Email, telephony and messaging platforms",
    link: "agentic",
  },
  {
    id: "finance", label: "Finance", domain: "business", x: 905, y: 190, tip: "left",
    purpose: "Invoices, receivables, costs and the reporting built on them.",
    records: ["Invoice", "Payment", "Cost centre", "Ledger entry"],
    events: ["Invoice raised", "Payment overdue"],
    connects: "Read-only by default. Reports are assembled from the ledger; postings stay with your accounting system and your accountants.",
    targets: "Tally, the finance module of your ERP, an accounting package",
    link: "agentic",
  },
  {
    id: "erp", label: "ERP", domain: "business", x: 905, y: 300, tip: "left",
    purpose: "The system of record for orders, items, BOMs, routings and stock.",
    records: ["Item", "BOM", "Routing", "Work order", "Purchase order"],
    events: ["Order released", "Stock adjusted"],
    connects: "Connects through the ERP's API or an approved database view. The ERP keeps ownership of its records.",
    targets: "SAP, Odoo, Microsoft Dynamics, Tally, a custom ERP",
    link: "factoryGraph",
  },
  {
    id: "procurement", label: "Procurement", domain: "business", x: 905, y: 410, tip: "left",
    purpose: "What is bought, from whom, and when it is due.",
    records: ["Requisition", "Purchase order", "Supplier quote"],
    events: ["Requisition raised", "Purchase order acknowledged"],
    connects: "Drafts requisitions from shortages it can see. Releasing a purchase order needs the approval your policy requires.",
    targets: "The purchasing module of your ERP",
    link: "agentic",
  },
  {
    id: "suppliers", label: "Suppliers", domain: "business", x: 820, y: 542, tip: "top",
    purpose: "The companies that supply materials, parts and services.",
    records: ["Supplier", "Lead time", "Delivery performance"],
    events: ["Delivery delayed", "Certificate received"],
    connects: "Reads supplier master data and delivery history. Outbound messages to a supplier are drafted for a buyer to send.",
    targets: "Supplier records in your ERP, a supplier portal, email",
    link: "agentic",
  },
  {
    id: "inventory", label: "Inventory", domain: "business", x: 660, y: 542, tip: "top",
    purpose: "What is on hand, reserved and in transit.",
    records: ["Stock balance", "Lot or batch", "Reservation"],
    events: ["Below reorder point", "Lot received"],
    connects: "Reads balances and movements. Adjustments are proposed against a count or a receipt, never made silently.",
    targets: "The stores module of your ERP, a WMS",
    link: "factoryGraph",
  },
  {
    id: "delivery", label: "Delivery", domain: "business", x: 500, y: 542, tip: "top",
    purpose: "Dispatch, shipping documents and proof of delivery.",
    records: ["Shipment", "Packing list", "Delivery note"],
    events: ["Shipment dispatched", "Delivery confirmed"],
    connects: "Reads dispatch status so a delivery promise can be checked against what has actually left.",
    targets: "Dispatch records in your ERP, a transporter's tracking feed",
    link: "factoryGraph",
  },
  {
    id: "quality", label: "Quality", domain: "shopfloor", x: 340, y: 542, tip: "top",
    purpose: "Inspection plans, measurements and non-conformances.",
    records: ["Inspection plan", "Measurement", "Non-conformance report"],
    events: ["Inspection failed", "Lot placed on hold"],
    connects: "Reads inspection results against the lot, the work order and the part revision. A hold is proposed to the quality lead.",
    targets: "A QMS, inspection spreadsheets, CMM reports",
    link: "cadCam",
  },
  {
    id: "mes", label: "MES", domain: "shopfloor", x: 180, y: 542, tip: "top",
    purpose: "Execution on the floor: what is running where, and how far along it is.",
    records: ["Operation", "Job status", "Operator booking", "Downtime entry"],
    events: ["Operation started", "Job completed"],
    connects: "Reads job and downtime status, and supplies machine state so an entry does not have to be typed twice.",
    targets: "An MES, production-booking screens, shop-floor terminals",
    link: "iot",
  },
  {
    id: "cnc", label: "CNC", domain: "shopfloor", x: 95, y: 410, tip: "right",
    purpose: "The machines that cut the parts, and the controllers that run them.",
    records: ["Machine", "Program in use", "Part count"],
    events: ["Cycle started", "Alarm raised", "Feed hold"],
    connects: "Reads machine state through the controller's data interface or an edge gateway. Factory Graph does not send commands to a controller.",
    targets: "FANUC, Siemens, Haas and Mitsubishi controllers",
    link: "iot",
  },
  {
    id: "iot", label: "Industrial IoT", domain: "shopfloor", x: 95, y: 300, tip: "right",
    purpose: "PLCs, sensors and gateways that turn equipment behaviour into data.",
    records: ["Signal", "Tag", "Reading"],
    events: ["Threshold crossed", "Signal lost"],
    connects: "Collects signals at an edge gateway inside your network. Only the data you approve leaves the plant.",
    targets: "PLCs, SCADA systems and sources that speak OPC UA, MQTT, Modbus or MTConnect",
    link: "iot",
  },
  {
    id: "twin", label: "Digital twin", domain: "shopfloor", x: 95, y: 190, tip: "right",
    purpose: "A live model of each asset: its state, its history and what it relates to.",
    records: ["Asset", "State", "State history", "Relationship"],
    events: ["State changed", "Behaviour out of pattern"],
    connects: "Built from the signals above and the context around them. It describes the equipment; it does not control it.",
    targets: "The digital twin layer, alongside your MES and maintenance records",
    link: "iot",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Stories                                  */
/* -------------------------------------------------------------------------- */

export type StoryId = "understand" | "objective" | "exception";

export interface StoryStep {
  title: string;
  body: string;
  /** Systems taking part in this step. */
  nodes: NodeId[];
  /** Where information comes from in this step, if it has a direction. */
  from?: NodeId;
  /** Where it goes. */
  to?: NodeId[];
  record: string;
  event: string;
  /** What an agent decides or prepares here. */
  decision: string;
  /** What stays with a person. */
  control: string;
}

export interface Story {
  id: StoryId;
  mode: string;
  title: string;
  summary: string;
  steps: StoryStep[];
}

export const STORIES: readonly Story[] = [
  {
    id: "understand",
    mode: "Mode 1",
    title: "Understand my factory",
    summary: "How machines, people, applications and data relate, built up one layer at a time.",
    steps: [
      {
        title: "Start with the equipment",
        body: "Machines and the sensors around them already produce signals. The first connection only listens.",
        nodes: ["cnc", "iot"], from: "cnc", to: ["iot"],
        record: "Machine, Signal",
        event: "Cycle started. Alarm raised. Part counted.",
        decision: "None. Signals are read, not written.",
        control: "A read-only connection through an edge gateway inside your network.",
      },
      {
        title: "Give each asset a twin",
        body: "Raw signals become a state a person recognises: running, idle, in setup, in alarm.",
        nodes: ["iot", "twin"], from: "iot", to: ["twin"],
        record: "Asset, State history",
        event: "State changed: running to idle.",
        decision: "State is classified from signals by rules you approve.",
        control: "You define what counts as running, idle and down for each machine.",
      },
      {
        title: "Attach the production context",
        body: "A machine state means more once it is tied to the job on the machine.",
        nodes: ["twin", "mes", "erp"], from: "twin", to: ["mes", "erp"],
        record: "Work order, Operation",
        event: "Operation started on a named machine.",
        decision: "Links the machine's current state to the work order it is running.",
        control: "The ERP remains the system of record for the order.",
      },
      {
        title: "Trace back to the design",
        body: "The job belongs to a part, the part to a revision, and the revision to a program.",
        nodes: ["cad", "cam", "cnc"], from: "cad", to: ["cam", "cnc"],
        record: "Part, Revision, Program reference",
        event: "Revision released.",
        decision: "Checks that the program reference in use matches the released revision.",
        control: "A mismatch is flagged to engineering. Nothing is sent to the machine.",
      },
      {
        title: "Follow the material",
        body: "Every job consumes stock that was bought from someone and received on a date.",
        nodes: ["inventory", "procurement", "suppliers"], from: "suppliers", to: ["procurement", "inventory"],
        record: "Lot, Purchase order, Supplier",
        event: "Lot received.",
        decision: "Relates each lot to the purchase order and the work orders that used it.",
        control: "Stock adjustments are proposed, then posted by stores.",
      },
      {
        title: "Connect the customer",
        body: "The work order exists because a customer asked for something by a date.",
        nodes: ["crm", "sales", "marketing"], from: "crm", to: ["sales"],
        record: "Account, Sales order, Delivery promise",
        event: "Order confirmed.",
        decision: "Resolves the customer in the CRM and the customer in the ERP to one entity.",
        control: "Ambiguous matches are queued for a person to confirm.",
      },
      {
        title: "Close the loop",
        body: "Inspection, dispatch and invoicing complete the chain from signal to revenue.",
        nodes: ["quality", "delivery", "finance"], from: "quality", to: ["delivery", "finance"],
        record: "Inspection result, Shipment, Invoice",
        event: "Lot passed. Shipment dispatched.",
        decision: "Builds the trace from a shipped lot back to its machine, program and material.",
        control: "Quality release and invoicing stay with their owners.",
      },
      {
        title: "Add the people and their agents",
        body: "With the relationships in place, agents can prepare work for the people responsible for it.",
        nodes: ["agents"], to: ["agents"],
        record: "Role, Approval rule, Audit entry",
        event: "Action proposed.",
        decision: "Each agent sees only what its role is permitted to see.",
        control: "Approval rules decide what an agent may do alone, and what it must ask for.",
      },
    ],
  },
  {
    id: "objective",
    mode: "Mode 2",
    title: "Execute a business objective",
    summary: "A customer request travels from the CRM through engineering, the ERP, planning and approval.",
    steps: [
      {
        title: "A request arrives",
        body: "A customer asks whether a batch of brackets can be delivered by Friday.",
        nodes: ["crm"], to: ["crm"],
        record: "Inquiry",
        event: "Inquiry received.",
        decision: "The CRM Data Steward agent matches the sender to an existing account and notes a missing drawing revision.",
        control: "Nothing is changed yet. The inquiry is only read.",
      },
      {
        title: "Qualify it",
        body: "What exactly is being asked for, how many, and by when?",
        nodes: ["crm", "sales"], from: "crm", to: ["sales"],
        record: "Opportunity",
        event: "Quote requested.",
        decision: "The Sales Executive agent structures the request: part, quantity, date, commercial terms on file.",
        control: "The account owner sees the summary and can correct it.",
      },
      {
        title: "Check engineering",
        body: "Is there a released revision, and a program that matches it?",
        nodes: ["sales", "cad", "cam"], from: "sales", to: ["cad", "cam"],
        record: "Part, Revision, Program reference",
        event: "Revision status checked.",
        decision: "The Operations agent confirms the released revision and that an approved program exists for it.",
        control: "Engineering confirms manufacturability. The agent cannot release a revision.",
      },
      {
        title: "Estimate in the ERP",
        body: "The routing and the BOM say what the job needs in time and material.",
        nodes: ["cad", "erp"], from: "cad", to: ["erp"],
        record: "BOM, Routing, Standard cost",
        event: "Estimate prepared.",
        decision: "The Finance agent calculates an estimate from the routing, rates and material cost on record.",
        control: "Rates and margins come from your records, not from the model.",
      },
      {
        title: "Check the material",
        body: "Is there stock, and if not, how quickly can it arrive?",
        nodes: ["erp", "inventory", "procurement", "suppliers"], from: "erp", to: ["inventory", "procurement"],
        record: "Stock balance, Open purchase orders",
        event: "Shortfall identified.",
        decision: "The Operations agent drafts a requisition for the shortfall.",
        control: "The requisition is a draft. A buyer releases it.",
      },
      {
        title: "Check the capacity",
        body: "Can the capable machines fit the hours before the date?",
        nodes: ["erp", "mes", "twin"], from: "erp", to: ["mes", "twin"],
        record: "Schedule, Machine availability",
        event: "Capacity compared with demand.",
        decision: "The Business Analyst agent compares required hours with available hours, using recorded machine availability.",
        control: "Overtime or rescheduling is a recommendation for the planner.",
      },
      {
        title: "Draft the quote",
        body: "The findings become a quote draft with the conditions attached to it.",
        nodes: ["agents", "sales"], from: "agents", to: ["sales"],
        record: "Quote draft",
        event: "Approval requested.",
        decision: "The orchestrator assembles the draft and lists what each number depends on.",
        control: "The draft cannot be sent. It waits for commercial approval.",
      },
      {
        title: "A person approves",
        body: "The person accountable reads the draft, the assumptions and the open risks.",
        nodes: ["agents", "sales", "finance"], from: "sales", to: ["finance"],
        record: "Approval",
        event: "Quote approved, or returned with changes.",
        decision: "None. This step belongs to a person.",
        control: "Approve, edit or reject. The decision and the approver are recorded.",
      },
      {
        title: "Follow up",
        body: "The customer hears back, and the record shows how the answer was reached.",
        nodes: ["sales", "crm", "delivery"], from: "sales", to: ["crm"],
        record: "Quote sent, Follow-up task",
        event: "Stage changed.",
        decision: "The Sales Executive agent prepares the follow-up task and its due date.",
        control: "The audit trail lists every read, every draft and the approval.",
      },
    ],
  },
  {
    id: "exception",
    mode: "Mode 3",
    title: "Detect an operational exception",
    summary: "A machine signal changes the production picture, an investigation is prepared, and the right people are told.",
    steps: [
      {
        title: "A signal leaves its pattern",
        body: "Spindle load on one machine sits above the band expected for the program it is running.",
        nodes: ["cnc", "iot"], from: "cnc", to: ["iot"],
        record: "Reading",
        event: "Threshold crossed.",
        decision: "None yet. The reading is recorded.",
        control: "The connection is read-only. The machine carries on as its operator runs it.",
      },
      {
        title: "The twin registers it",
        body: "One high reading is noise. A sustained change in behaviour is a state worth naming.",
        nodes: ["iot", "twin"], from: "iot", to: ["twin"],
        record: "State change",
        event: "Behaviour out of pattern.",
        decision: "The twin applies the rule you set: how far, and for how long, before it counts.",
        control: "Thresholds are yours. They are versioned like any other setting.",
      },
      {
        title: "Find the job",
        body: "Which work order and which operation is on that machine right now?",
        nodes: ["twin", "mes"], from: "twin", to: ["mes"],
        record: "Work order, Operation",
        event: "Affected operation identified.",
        decision: "Links the exception to the job in progress.",
        control: "Read-only.",
      },
      {
        title: "See the business impact",
        body: "The job belongs to an order with a promised date.",
        nodes: ["mes", "erp", "sales"], from: "mes", to: ["erp", "sales"],
        record: "Sales order, Delivery promise",
        event: "Order flagged as at risk.",
        decision: "Estimates whether the promised date is exposed if the machine has to stop.",
        control: "A flag for the planner, not a change to the order.",
      },
      {
        title: "Investigate",
        body: "What changed? Tool life, the last tool change, the material lot, recent measurements.",
        nodes: ["agents", "twin", "inventory"], from: "twin", to: ["agents"],
        record: "Investigation note",
        event: "Likely causes listed.",
        decision: "The Operations agent gathers the related records and ranks the likely causes with its reasons.",
        control: "It presents evidence. It does not diagnose on its own authority.",
      },
      {
        title: "Check quality",
        body: "Parts made since the change may need a second look.",
        nodes: ["agents", "quality"], from: "agents", to: ["quality"],
        record: "Inspection request",
        event: "Hold proposed.",
        decision: "Recommends inspecting the parts produced since the behaviour changed.",
        control: "The quality lead decides whether to hold the lot.",
      },
      {
        title: "Prepare a maintenance task",
        body: "A task is drafted with the evidence attached, ready for the person who owns the machine.",
        nodes: ["agents", "mes", "erp"], from: "agents", to: ["mes", "erp"],
        record: "Maintenance task (draft)",
        event: "Task prepared.",
        decision: "Drafts the task: machine, symptom, evidence, suggested check.",
        control: "A draft only. It is not scheduled until it is approved.",
      },
      {
        title: "Tell the right people",
        body: "The supervisor and maintenance get one message with the context, not a bare alarm.",
        nodes: ["agents"], to: ["agents"],
        record: "Notification, Approval request",
        event: "Approval requested.",
        decision: "Routes the request to the people on shift who are responsible for that cell.",
        control: "The supervisor decides: carry on, stop at the next safe point, or schedule. Factory Graph never stops, starts or adjusts a machine.",
      },
      {
        title: "Keep the customer promise honest",
        body: "If the decision costs time, the account owner knows before the customer does.",
        nodes: ["erp", "delivery", "crm"], from: "erp", to: ["delivery", "crm"],
        record: "Delivery promise, Account note",
        event: "Account owner notified.",
        decision: "Prepares a note for the account owner with the revised outlook.",
        control: "What the customer is told, and when, is the account owner's call.",
      },
    ],
  },
];

export function getNode(id: NodeId): GraphNode {
  const node = GRAPH_NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown graph node: ${id}`);
  return node;
}

/** Every system that takes part anywhere in a story. */
export function storyParticipants(story: Story): NodeId[] {
  return [...new Set(story.steps.flatMap((step) => [...step.nodes, ...(step.from ? [step.from] : []), ...(step.to ?? [])]))];
}
