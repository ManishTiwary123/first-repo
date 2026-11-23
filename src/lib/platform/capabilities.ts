// lib/platform/capabilities.ts
//
// What exists, what is being built, and what is not there yet. This is the
// one list every Factory Graph page reads its status labels from, so a
// capability cannot be "available" on one page and "planned" on another.
//
// HOW EACH LINE GOT ITS STATUS
//
//   basis: "founder"     Confirmed by Savin Group's founder as working today.
//                        The implementation is NOT in this repository (this
//                        repo is the marketing website), so the site says
//                        "available now" and offers to show it in a
//                        demonstration. It publishes no screenshot, metric or
//                        customer name for it, because none has been supplied.
//   basis: "repository"  Verifiable in this codebase.
//   basis: "positioning" Part of the Factory Graph product layer that this
//                        site introduces. Classified conservatively: nothing
//                        here is called available unless the founder said so.
//
// BEFORE LAUNCH the founder should read this file top to bottom and move any
// line that is in the wrong column. Moving a line is the only edit needed;
// the pages follow.
//
// NEVER ADD: a connected-machine count, a downtime or ROI figure, a customer
// name or logo, or a named third-party connector (a CAD/CAM product, an ERP,
// a controller family) as "available" without written evidence for it.
//
// Pure: no imports.

export type CapabilityStatus = "available" | "development" | "planned";
export type CapabilityBasis = "founder" | "repository" | "positioning";

export interface Capability {
  id: string;
  status: CapabilityStatus;
  basis: CapabilityBasis;
  title: string;
  body: string;
  /** How a buyer can see it for themselves. */
  proof: string;
}

export const STATUS_LABEL: Record<CapabilityStatus, string> = {
  available: "Available now",
  development: "In development",
  planned: "Planned capability",
};

export const STATUS_NOTE: Record<CapabilityStatus, string> = {
  available: "Working today. Shown in a live demonstration on request.",
  development: "Being built now. Not sold as finished; early access is scoped with the customer.",
  planned: "Not available today. Described here so you know where the product is heading, not as a commitment to a date.",
};

const DEMO = "Shown in a live demonstration.";

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "machine-connectivity",
    status: "available",
    basis: "founder",
    title: "Real-time machine connectivity",
    body: "Signals from connected equipment are read into software as they happen.",
    proof: DEMO,
  },
  {
    id: "digital-twin",
    status: "available",
    basis: "founder",
    title: "Working digital twins",
    body: "A live representation of connected equipment: current state, history and the relationships around it.",
    proof: DEMO,
  },
  {
    id: "crm-agents",
    status: "available",
    basis: "founder",
    title: "CRM and sales-intelligence agents",
    body: "Agents that work with CRM records to qualify, prepare and follow up, inside the permissions set for them.",
    proof: DEMO,
  },
  {
    id: "erp-operations",
    status: "available",
    basis: "founder",
    title: "ERP and manufacturing operations",
    body: "Orders, inventory, purchasing and production workflows running on real company databases.",
    proof: DEMO,
  },
  {
    id: "finance-analytics-agents",
    status: "available",
    basis: "founder",
    title: "Finance, reporting and analytics agents",
    body: "Agents that assemble reports and answer business questions from the underlying records.",
    proof: DEMO,
  },
  {
    id: "orchestration",
    status: "available",
    basis: "founder",
    title: "Multi-agent orchestration and team maps",
    body: "A central orchestrator routes work between specialised agents and shows who does what.",
    proof: DEMO,
  },
  {
    id: "automation-builders",
    status: "available",
    basis: "founder",
    title: "Automation builders",
    body: "Business workflows assembled from triggers, rules and approval steps.",
    proof: DEMO,
  },
  {
    id: "api-integrations",
    status: "available",
    basis: "founder",
    title: "API-based integrations",
    body: "Connections between business systems through their APIs, with mapping and exception handling.",
    proof: "Scoped against your systems' APIs during discovery.",
  },
  {
    id: "custom-software",
    status: "available",
    basis: "founder",
    title: "Custom industrial and business software",
    body: "Applications built around a specific operation where off-the-shelf tools stop fitting.",
    proof: "See the case studies on this site.",
  },
  {
    id: "site-operator",
    status: "available",
    basis: "repository",
    title: "A tool-using agent you can try on this site",
    body: "The Savin Operator chat panel on this website runs an agent loop with a fixed set of scoped tools, input validation and rate limits.",
    proof: "Open the Operator panel on any page.",
  },
  {
    id: "unified-graph",
    status: "development",
    basis: "positioning",
    title: "One cross-system enterprise graph",
    body: "Resolving the same customer, part, order and machine across CRM, ERP, engineering and shop-floor systems into one navigable model.",
    proof: "Walked through as an architecture today; delivered per engagement.",
  },
  {
    id: "command-center",
    status: "development",
    basis: "positioning",
    title: "The Factory Graph command center",
    body: "A single view to explore the connected operation and follow a workflow across systems. The explorer on this site illustrates it with simulated data.",
    proof: "The interactive explorer on the Factory Graph page.",
  },
  {
    id: "objective-planning",
    status: "development",
    basis: "positioning",
    title: "Objective-to-plan missions",
    body: "Giving the operation an objective and receiving a checked plan with the approvals it needs. The mission demonstration on this site runs on example data.",
    proof: "The mission demonstration on the Factory Graph page.",
  },
  {
    id: "connector-catalogue",
    status: "planned",
    basis: "positioning",
    title: "A catalogue of pre-built connectors",
    body: "Today each connection to a named ERP, CAD/CAM product or machine controller is confirmed and built for the project. A reusable catalogue comes later.",
    proof: "Ask which of your systems have been connected before.",
  },
  {
    id: "public-live-demo",
    status: "planned",
    basis: "positioning",
    title: "A public, read-only live demonstration",
    body: "The demonstrations on this site are simulated and say so. A public view onto sanitised live data needs an isolated, read-only endpoint that does not exist yet.",
    proof: "Until then, the working system is shown in a call.",
  },
];

export function capabilitiesByStatus(status: CapabilityStatus): Capability[] {
  return CAPABILITIES.filter((c) => c.status === status);
}

/* -------------------------------------------------------------------------- */
/*                       Labels for anything interactive                      */
/* -------------------------------------------------------------------------- */

/**
 * Every interactive example on the site carries one of these, in words, next
 * to the example. There is no "live" entry on purpose: nothing on the public
 * site is connected to an operational system.
 */
export type DataKind = "simulated" | "illustrative" | "example";

export const DATA_LABEL: Record<DataKind, { short: string; long: string }> = {
  simulated: {
    short: "Simulated data",
    long: "Simulated data, generated in your browser. Not connected to any machine or customer system.",
  },
  illustrative: {
    short: "Illustrative example",
    long: "An illustrative example of how systems relate. It shows no live, historical or customer data.",
  },
  example: {
    short: "Example data",
    long: "Worked on an example dataset shown on this page. The figures are not from a real plant.",
  },
};
