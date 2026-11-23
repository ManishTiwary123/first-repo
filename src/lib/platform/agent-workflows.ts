// lib/platform/agent-workflows.ts
//
// The agent team and the worked workflows on the Agentic ERP & CRM page.
//
// Each workflow is written out in the same eight parts, in the same order:
//
//   Trigger → Context → Agent → Authorised tools → Proposed action →
//   Approval → Result → Audit trail
//
// That order is the point of the page: a visitor should be able to see, for
// any piece of work, what started it, what the agent was allowed to touch,
// where a person decided, and what was recorded.
//
// These are descriptions of how a workflow is designed, illustrated with
// examples. They name no customer and quote no measured result. The tool
// lists are capabilities granted to a role, not a catalogue of connectors to
// particular products.
//
// Pure: no imports. scripts/platform.test.mjs checks every workflow is complete.

export interface AgentProfile {
  id: string;
  name: string;
  does: string;
  /** What this agent may read or call. */
  works: string;
  /** What it must ask a person for. */
  asks: string;
}

export const ORCHESTRATOR = {
  name: "Orchestrator",
  does: "Takes a request, decides which agent handles which part of it, passes context between them and assembles one result. It holds the approval rules, so no agent can route around them.",
} as const;

export const AGENTS: readonly AgentProfile[] = [
  {
    id: "sales",
    name: "Sales Executive",
    does: "Qualifies inquiries, prepares quotes and drafts follow-ups.",
    works: "CRM accounts and opportunities; quote templates.",
    asks: "Anything that will be sent to a customer.",
  },
  {
    id: "operations",
    name: "Operations",
    does: "Tracks orders, stock and production; drafts requisitions and tasks.",
    works: "ERP orders and stock; MES status; digital twin state.",
    asks: "Releasing a requisition; any change to a schedule.",
  },
  {
    id: "finance",
    name: "Finance",
    does: "Estimates, reconciles and prepares reports from the books.",
    works: "Read-only access to ledgers, invoices and costs.",
    asks: "Everything it produces is reviewed. It never posts an entry.",
  },
  {
    id: "analyst",
    name: "Business Analyst",
    does: "Answers management questions with figures and their sources.",
    works: "Read access across the systems its role permits.",
    asks: "Nothing to read. Its conclusions are labelled as analysis.",
  },
  {
    id: "steward",
    name: "CRM Data Steward",
    does: "Keeps accounts and contacts clean: duplicates, gaps, stale records.",
    works: "CRM records and their change history.",
    asks: "Merging or deleting a record.",
  },
];

export interface ChainStep {
  text: string;
  /** True where a person decides. */
  human?: boolean;
}

export interface AgentWorkflow {
  id: string;
  label: string;
  chain: ChainStep[];
  trigger: string;
  context: string;
  agent: string;
  tools: string;
  action: string;
  approval: string;
  result: string;
  audit: string;
}

/** The eight parts, in the order every workflow is presented. */
export const ANATOMY = [
  ["trigger", "Trigger"],
  ["context", "Context"],
  ["agent", "Agent"],
  ["tools", "Authorised tools"],
  ["action", "Proposed action"],
  ["approval", "Approval"],
  ["result", "Result"],
  ["audit", "Audit trail"],
] as const satisfies ReadonlyArray<readonly [keyof AgentWorkflow, string]>;

export const AGENT_WORKFLOWS: readonly AgentWorkflow[] = [
  {
    id: "inquiry-to-quote",
    label: "Inquiry to quote",
    chain: [
      { text: "Sales inquiry" },
      { text: "CRM qualification" },
      { text: "Engineering review" },
      { text: "ERP estimate" },
      { text: "Quote draft" },
      { text: "Human approval", human: true },
      { text: "Customer follow-up" },
    ],
    trigger: "A new inquiry arrives by email or through a web form.",
    context: "The account's history, the part's released revision, its routing, stock on hand and current load.",
    agent: "Sales Executive leads. CRM Data Steward tidies the record; Operations and Finance supply feasibility and cost.",
    tools: "CRM read and update. ERP read: items, BOM, routing, stock. Document lookup. Quote template.",
    action: "A quote draft with price and lead time, and the assumption behind each figure.",
    approval: "The account owner approves, edits or rejects. Above the value you set, a second approver.",
    result: "The approved quote goes out under the account owner's name and the opportunity moves to the next stage.",
    audit: "Sources read, figures calculated, each draft version, the approver and the time.",
  },
  {
    id: "purchase-reconciliation",
    label: "Purchase and inventory reconciliation",
    chain: [
      { text: "Goods receipt" },
      { text: "Match to purchase order" },
      { text: "Compare with stock" },
      { text: "Flag the variance" },
      { text: "Human review", human: true },
      { text: "Adjustment posted" },
    ],
    trigger: "A goods receipt is booked, or a scheduled daily run starts.",
    context: "Open purchase orders, receipts, supplier invoices and stock balances.",
    agent: "Operations, with Finance for the invoice match.",
    tools: "ERP read: purchase orders, receipts, stock ledger. Invoice lookup. Variance report.",
    action: "A list of mismatches in quantity, price or missing receipts, each with the documents that disagree.",
    approval: "Stores or accounts confirm each adjustment. Nothing is posted automatically.",
    result: "Approved adjustments are posted by their owner. The rest are raised with the supplier.",
    audit: "Every mismatch, its evidence, the decision taken and who took it.",
  },
  {
    id: "order-tracking",
    label: "Production order tracking",
    chain: [
      { text: "Order released" },
      { text: "Operation progress" },
      { text: "Machine state" },
      { text: "Delay detected" },
      { text: "Planner decides", human: true },
      { text: "Customer date reviewed" },
    ],
    trigger: "A work order is released, then each status change that follows.",
    context: "Routing, operation status, machine state from the digital twin and material availability.",
    agent: "Operations, with Business Analyst for the delivery outlook.",
    tools: "ERP and MES read. Digital twin state. Schedule lookup. Notification.",
    action: "A status summary and, when a date is at risk, the reason and the options.",
    approval: "The planner decides on rescheduling. The account owner decides what the customer is told.",
    result: "Everyone who needs the status sees one current version instead of asking for it.",
    audit: "Status changes, the signals behind them and the notifications sent.",
  },
  {
    id: "financial-reporting",
    label: "Financial reporting",
    chain: [
      { text: "Period end" },
      { text: "Ledger read" },
      { text: "Reconcile" },
      { text: "Draft pack" },
      { text: "Finance review", human: true },
      { text: "Report issued" },
    ],
    trigger: "A scheduled period end, or a request from management.",
    context: "The ledger, receivables, payables, inventory valuation and the previous period.",
    agent: "Finance, with Business Analyst for the commentary.",
    tools: "Read-only accounting access. Report templates. Variance analysis.",
    action: "A draft management pack: figures, variances and the questions that still need an answer.",
    approval: "The finance lead reviews and signs off. The agent cannot post or change an entry.",
    result: "An issued report in which each number can be traced to its ledger source.",
    audit: "Queries run, figures used, edits made in review and the sign-off.",
  },
  {
    id: "operational-exception",
    label: "Operational exception handling",
    chain: [
      { text: "Machine exception" },
      { text: "Find the job" },
      { text: "Assess the impact" },
      { text: "Draft a task" },
      { text: "Supervisor decides", human: true },
      { text: "Outcome recorded" },
    ],
    trigger: "The digital twin reports a sustained change in a machine's behaviour.",
    context: "The work order on the machine, tool life, recent inspection results and the order's due date.",
    agent: "Operations, with the orchestrator routing to quality and maintenance.",
    tools: "Digital twin read. MES and ERP read. Maintenance task draft. Notification.",
    action: "A drafted maintenance task with the evidence attached, and a note on the delivery risk.",
    approval: "The shift supervisor decides: carry on, stop at a safe point, or schedule. The system does not touch the machine.",
    result: "A decision on record, a scheduled task if approved, and an updated outlook for the order.",
    audit: "The readings, the rule that fired, the draft, the decision and its time.",
  },
];

/** Further examples the same pattern covers, listed on the page without a full walk-through. */
export const MORE_WORKFLOWS = [
  ["Customer follow-up preparation", "Before a call, the account's open quotes, orders, deliveries and last conversation, on one page."],
  ["Supplier communication", "A drafted chaser for a late delivery, with the purchase order and the dates attached, for a buyer to send."],
  ["Marketing campaign preparation", "A segment built from CRM data and a draft message. It is sent only to contacts with recorded consent."],
  ["Management intelligence", "A plain-language question answered with the figures, the period and the sources they came from."],
] as const;
