// lib/research/nav.ts
//
// The Research library's entries for the header and footer. Pure and tiny on
// purpose: the navigation is a client component, and importing the report
// registry would ship every report's full text to every visitor. The slugs
// and order are held to RESEARCH_REPORTS by scripts/research.test.mjs.

export const RESEARCH_NAV_HREF = "/research";

export const RESEARCH_NAV: ReadonlyArray<{ slug: string; label: string; detail: string }> = [
  { slug: "manufacturing-software-stack-cad-cam-plm-mes", label: "Manufacturing software stack", detail: "CAD, CAM, PLM, MES, IIoT and open source" },
  { slug: "manufacturing-knowledge-graph-ontology", label: "The factory knowledge graph", detail: "Ontologies, the digital thread, standards" },
  { slug: "future-of-erp-crm-agentic-ai", label: "The future of ERP and CRM", detail: "What agentic AI has actually shipped" },
  { slug: "ai-agent-orchestration-platforms", label: "AI agent orchestration", detail: "Running and supervising many agents" },
  { slug: "embed-stream-integrate-specialist-software", label: "One hub for every tool", detail: "Embed, stream or drive specialist software" },
  { slug: "back-office-software-open-source-alternatives", label: "Back-office software map", detail: "Every department, its tools, open source" },
  { slug: "d2c-marketing-tool-stack-agentic-commerce", label: "D2C and marketing stack", detail: "Creative tools, agentic commerce, AI support" },
];
