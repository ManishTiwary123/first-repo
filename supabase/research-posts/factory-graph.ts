// Spoke posts of the research report "Manufacturing Knowledge Graph and
// Ontology" (src/lib/research/reports/factory-graph.ts). Facts checked on
// 22 November 2026; every figure links to its source.
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

const REPORT = "/research/manufacturing-knowledge-graph-ontology";

export const FACTORY_GRAPH_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "palantir-ontology-explained",
    title: "Palantir Ontology Explained: Objects, Links and Governed Actions",
    subtitle:
      "What Palantir's Ontology actually is, why Palantir says it is not a semantic layer, how AI agents act through it, and the small part of it a manufacturer can copy without Foundry.",
    excerpt:
      "Palantir's Ontology is an operational layer, not a database: typed objects, links and governed actions that people and AI agents share. Here is how it works.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "layerStack",
    tags: ["knowledge-graph", "ai-agents", "ontology", "manufacturing"],
    keywords: {
      primary: "palantir ontology",
      secondary: ["palantir foundry ontology", "ontology action types", "palantir warp speed", "open source ontology platform"],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    popularityScore: 74,
    relatedSlugs: ["context-graphs-decision-traces", "mcp-for-erp-crm-agents", "prompt-injection-crm-ai-agents"],
    crossPageLinks: [
      { href: REPORT, label: "The factory knowledge graph", note: "the full research report this article comes from" },
      { href: "/factory-graph", label: "Factory Graph", note: "how we connect the systems a manufacturer already runs" },
      { href: "/agentic-erp-crm", label: "Agentic ERP & CRM", note: "agents that act through approved tools" },
    ],
    takeaways: [
      "Palantir describes its Ontology as an operational layer over existing data, and explicitly says it is not a semantic layer.",
      "It has two halves: a semantic half (objects, properties, links) and a kinetic half (actions, functions, security).",
      "AI agents act through the same action types people use, which is the design choice worth copying.",
      "The one detailed Warp Speed customer account says the system did not replace the ERP, MES or PLM underneath.",
      "No open-source project reproduces the whole thing; a self-built version is a graph store, an action layer and permissions you assemble.",
    ],
    sections: [
      {
        heading: "What the Ontology is, in Palantir's own words",
        paragraphs: [
          "Most explanations of Palantir start with the word “graph” and stop there. Palantir's documentation starts somewhere else: “The Palantir Ontology is an operational layer for the organization”, and “in many settings, the Ontology serves as a digital twin of the organization” ([Palantir docs](https://www.palantir.com/docs/foundry/ontology/overview/)). It sits on top of datasets, virtual tables and models that already exist, and connects them to the real-world things they describe.",
          "The same page splits it into two halves. The semantic half is objects, properties and links: the nouns of the business and how they relate. The kinetic half is actions, functions and dynamic security: the verbs, and who may use them. That second half is what most “enterprise knowledge graph” products leave out.",
          "Palantir goes further in its platform summary and says plainly that “the Ontology is not a semantic layer”. It is built from four integrated parts (data, logic, action and security) and three components: a language for modelling objects and actions, an engine for reading and writing at scale, and a toolchain, the Ontology SDK ([Palantir platform summary](https://www.palantir.com/docs/foundry/getting-started/foundry-platform-summary-llm/)).",
        ],
        callout: {
          title: "Why the distinction matters",
          body: "A semantic layer describes data so people and tools can query it consistently. An operational layer also decides how the data may change. If your goal is AI agents that do work, not just answer questions, the second definition is the one you need.",
        },
      },
      {
        heading: "The five building blocks, with a factory example",
        paragraphs: [
          "Palantir's documentation defines five element types. The examples after each one are ours, written for a manufacturer, not Palantir's.",
        ],
        bullets: [
          "Object type: the schema for an entity or event, with properties, a primary key and a backing data source; one row is one object. Example: Work order, Machine, Inspection lot.",
          "Link type: a relationship between object types, with cardinality; links can carry their own data. Example: a work order runs on a machine.",
          "Action type: a set of changes to objects, properties and links, defined by parameters, rules, submission criteria and side effects such as notifications and webhooks. Example: “Release work order”, allowed only when the BOM revision is approved.",
          "Function: server-side TypeScript or Python that reads the ontology and makes edits. Example: recalculate a quote from current rates and routing.",
          "Interface: a shared property shape that several object types implement. Example: “has location” for machines, bins and sites.",
        ],
        pullQuote: "The kinetic half (actions, functions, security) is what most enterprise knowledge graphs leave out.",
      },
      {
        heading: "Why the actions are the important half",
        paragraphs: [
          "The interesting design decision is that AI agents act through the Ontology rather than around it. Palantir's AIP Chatbot Studio gives a chatbot tools that are actions, object queries, functions and commands. AIP Logic is a no-code LLM function that can query objects and make ontology edits, and Automate triggers actions or functions on a schedule or a data condition ([Palantir platform summary](https://www.palantir.com/docs/foundry/getting-started/foundry-platform-summary-llm/)).",
          "The same rule extends to outside agents. Palantir's Ontology MCP is documented as exposing an application's object types, action types and query functions as MCP tools under OAuth 2.0, so an external assistant reads objects and changes them only through predefined actions ([Palantir docs, reported](https://palantir.com/docs/foundry/ontology-mcp/sample-architecture/)). A separate Palantir MCP for builders is reported to be able to modify ontology types but not write ontology data ([Palantir docs, reported](https://palantir.com/docs/foundry/palantir-mcp/)).",
          "Security is part of the model rather than bolted on: projects and organisations as boundaries, roles, markings for sensitive data, row- and column-level security, submission criteria checked before an action runs, justifications on sensitive actions, and audit logging. Put together, an agent has exactly the powers its actions give it, and every change it makes is a logged, permissioned event.",
          "In our view this is the part of Palantir most worth studying, and it is also the part that does not need Palantir. It is a design rule: no change to a business record except through a named action with its own permission, limits and approval step, for people and agents alike.",
        ],
      },
      {
        heading: "Warp Speed: the manufacturing pitch, and what a customer actually says",
        paragraphs: [
          "Palantir introduced Warp Speed on its Q2 2024 earnings call on 5 August 2024. CTO Shyam Sankar called it “the modern American manufacturing operating system that reimagines how to bend atoms better with bits”, argued that ERP was designed in the 1970s for the CFO, and cited “$1 of license for $9 of implementation” ([Constellation Research](https://www.constellationr.com/blog-news/insights/palantir-q2-shines-us-enterprise-growth-accelerates-eyes-manufacturing-erp-warp)).",
          "The most concrete customer account comes from Ursa Major, which describes building an “AI-native, Ontology-driven manufacturing execution system” linking engineering data, shop-floor execution, MRP logic and SCADA. It says the work was deployed in a few months and is “projected to save 10,000 to 15,000 hours of engineering time annually”, which is a projection rather than a measurement. Its most quotable line is the least dramatic: “This isn't about replacing the systems we've relied on” ([Ursa Major](https://ursamajor.com/?p=1759)).",
          "Independent analysis is more cautious. LNS Research (April 2026) finds Palantir mostly “wraps and extends” existing systems, names the forward-deployed-engineer model as the biggest success factor, and calls that model expensive and liable to deepen dependency, a poor fit for budget-conscious mid-size manufacturers ([LNS Research](https://blog.lnsresearch.com/where-palantir-won-c3-didnt-a-tale-of-two-industrial-ai-platforms)).",
        ],
        callout: {
          title: "Read the marketing carefully",
          body: "“Not ERP” is a pitch. The customer evidence describes a layer over ERP, MES and PLM, not a replacement for them. That is good news for anyone who cannot rip out their ERP: the valuable part works on top of it.",
        },
      },
      {
        heading: "Can you build an ontology like this without Foundry?",
        paragraphs: [
          "Not as a single download. Our research found no open-source project that reproduces both halves. The closest projects each cover part of it: TrustGraph (Apache-2.0) calls itself “the open-source ontology runtime for AI agents” and is built on RDF, OWL and SHACL, but is aimed at knowledge extracted from documents ([TrustGraph](https://github.com/trustgraph-ai/trustgraph)). BKN Foundry models a business as objects, actions, rules and constraints with risk checks before actions, but was at version 0.2 with a mixed licence when we read it ([BKN Foundry](https://github.com/openbkn-ai/bkn-foundry)). A project called “OpenFoundry” that aggregator sites list as a clone returned 404 on GitHub.",
          "The large vendors have also converged on a lighter version of the idea. Microsoft's Fabric IQ ontology, still labelled preview in October 2026, “stores and serves ontology definitions and bindings” while “source data remains in the system that owns it”, and treats graph execution as optional ([Microsoft Learn](https://learn.microsoft.com/en-us/fabric/iq/ontology/overview)).",
          "For a manufacturer already on PostgreSQL, the practical path is to keep type definitions as metadata, read existing records in place, store only the links no table holds, and put every change behind a named action. Graph databases are optional at the start; the research report compares them, licence by licence, including why the SQL-standard graph feature will not ship in PostgreSQL 19 ([pgsql-committers](https://www.postgresql.org/message-id/E1x3f62-00000003sxF-0zQO@gemulon.postgresql.org)).",
        ],
      },
      {
        heading: "What to copy: a five-rule checklist",
        paragraphs: [
          "If you strip away the platform, five rules carry most of the value. They work whether you build on Foundry, on an open-source stack, or on top of an ERP you already run.",
        ],
        bullets: [
          "Types are metadata. Define what a Work order, a Machine or a Drawing revision is once, in one place.",
          "Objects are bound to rows in systems that already exist. Do not copy the ERP into a second database; read it.",
          "Every change goes through a named action with parameters, submission criteria and side effects. Nothing edits a record directly.",
          "Agents get exactly those actions as their tools, nothing more, and consequential ones wait for a person.",
          "Permissions sit on objects and actions, so an agent never sees or changes more than the role it acts for.",
        ],
        callout: {
          title: "Where to go next",
          body: "The full research report covers what SAP, Microsoft, Salesforce, Celonis and Glean have shipped, the ISA-95 and Asset Administration Shell standards, and a proposed node-and-edge schema for a factory. Our Factory Graph pages show how we apply the same rules to the systems a manufacturer already runs.",
        },
      },
    ],
    faq: [
      {
        question: "Is the Palantir Ontology a graph database?",
        answer:
          "No. Palantir describes it as an operational layer over existing data sources: object and link types bound to datasets, plus action types and functions that govern how data changes. Its graph view of the business, Vertex, is a separate tool.",
      },
      {
        question: "What is an action type in Palantir Foundry?",
        answer:
          "A defined set of changes to objects, properties and links, with parameters, rules, submission criteria checked before it runs, and side effects such as notifications or webhooks. People and AI agents both change data through action types.",
      },
      {
        question: "What is Palantir Warp Speed?",
        answer:
          "Palantir's manufacturing offering, introduced in August 2024 and built on its AI platform and the Ontology. Customer accounts describe it as a layer that links engineering, production and control-system data on top of existing ERP, MES and PLM.",
      },
      {
        question: "Is there an open-source alternative to the Palantir Ontology?",
        answer:
          "Not a complete one. Projects such as TrustGraph, BKN Foundry and HASH cover parts of it, each with limits in maturity, scope or licence. Most teams combine a graph or relational store, an action layer with permissions, and an agent interface such as MCP.",
      },
      {
        question: "Does a manufacturer need Palantir to get these benefits?",
        answer:
          "Not necessarily. The design rules (types as metadata, records read in place, every change through a governed action, agents limited to those actions) can be applied on top of an existing ERP and database. The trade-off is engineering effort instead of platform licence and forward-deployed engineers.",
      },
    ],
  },

  // ------------------------------------------------------------------------
  {
    slug: "context-graphs-decision-traces",
    title: "Context Graphs and Decision Traces: A System of Record for Decisions",
    subtitle:
      "Foundation Capital calls it AI's trillion-dollar opportunity; Forrester calls it a convergence, not an invention. What a context graph records, what the critics say, and how to build one without inventing anything.",
    excerpt:
      "A context graph records how decisions were made: who approved what, under which rule, with which exception. What it is, the critiques, and how to build one.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "auditLens",
    tags: ["context-graph", "ai-agents", "governance", "knowledge-graph"],
    keywords: {
      primary: "context graph",
      secondary: ["decision traces", "system of record for decisions", "ai agent memory", "temporal knowledge graph"],
      searchVolume: 0,
      difficulty: "low",
      intent: "informational",
    },
    popularityScore: 70,
    relatedSlugs: ["palantir-ontology-explained", "multi-agent-systems-evidence", "prompt-injection-crm-ai-agents"],
    crossPageLinks: [
      { href: `${REPORT}#context-graphs`, label: "The factory knowledge graph", note: "the research report, section on context graphs" },
      { href: "/agentic-erp-crm", label: "Agentic ERP & CRM", note: "agents with approvals and an audit trail" },
      { href: "/industrial-systems-audit", label: "Industrial systems audit", note: "find where decisions get lost between systems" },
    ],
    takeaways: [
      "A context graph links each decision to the records, rules, evidence and people involved, so similar past cases can be found.",
      "Its promoters say the reasoning behind decisions was never stored as data; its critics say the pieces exist but are fragmented.",
      "The hard part is accuracy: traces without an accurate graph of the underlying records “float without grounding”.",
      "For an AI agent, decision traces are episodic memory; it still needs facts (semantic) and procedures (procedural).",
      "Build it from what systems already log, link it by keys, and be honest that it records what was done, not what was thought.",
    ],
    sections: [
      {
        heading: "The idea in one sentence",
        paragraphs: [
          "The phrase comes from an essay by Jaya Gupta and Ashu Garg of Foundation Capital, which InfoWorld describes as a December 2025 paper. Their definition: a context graph is “a living record of decision traces stitched across entities and time so precedent becomes searchable” ([Foundation Capital](https://foundationcapital.com/context-graphs-ais-trillion-dollar-opportunity/); [InfoWorld](https://www.infoworld.com/article/4156909/contexts-graphs-ai-memory-and-enterprise-knowledge-are-decision-traces-enough.html)).",
          "The argument is that business software stores objects (a customer, an order, a ledger line) but not the reasoning that connected data to action: “the reasoning connecting data to action was never treated as data in the first place”. Exception logic lives in people's heads, precedent lives in memory, and approvals are given in chat or on calls. A rule says what is generally intended; a decision trace records how the rule was applied in one case, with the policy version, the exceptions, the precedent and the approvals.",
          "The essay's question is whether “systems of record for decisions, not just objects” will emerge, and it argues that whoever sits in the path where decisions are executed, such as an agent orchestration layer, is best placed to capture them.",
        ],
      },
      {
        heading: "What a decision trace contains, in a factory",
        paragraphs: [
          "The essay is written for software and finance teams. Here is an illustrative example of our own, for a manufacturer: a sales order would take a customer past its credit limit, and the finance head approves it anyway because the customer has paid early for three years.",
          "In most systems today that leaves an order, a changed status and perhaps an email. A decision trace for the same event would hold the parts below, each as a link to something that already exists rather than as free text.",
        ],
        bullets: [
          "The decision itself: an approval of a credit-limit override, with its time and outcome.",
          "Who decided, and in which role, with the limit that role carries.",
          "The rule that applied (the credit limit) and its value at that moment, not today's value.",
          "The exception and the reason typed at the time: “three years of early payment”.",
          "The evidence looked at: the customer's payment history and open invoices.",
          "Earlier similar decisions, so the next approver can see the precedent.",
        ],
        callout: {
          title: "Why this matters for AI agents",
          body: "An agent asked to draft the next order for the same customer can read the precedent instead of either refusing or quietly overriding a limit. And a reviewer can see why the last exception was made, by whom, and whether the reason still holds.",
        },
      },
      {
        heading: "The critics: convergence, fidelity and half-lives",
        paragraphs: [
          "The most useful critique comes from Forrester's Charles Betz, in a post titled “Context Graphs Are A Convergence, Not An Invention” (10 April 2026). He lists the disciplines that have been building pieces of this graph for decades, such as CMDBs, application traces, process mining, incident records and architecture decision records, and concludes: “The decision trace layer isn't missing. It's fragmented.” His sharpest line is about quality: “persistence is never the hard part — fidelity is”, and traces that cannot connect to an accurate model of the enterprise “float without grounding” ([Forrester](https://www.forrester.com/blogs/context-graphs-are-a-convergence-not-an-invention/)).",
          "The authors' own follow-up concedes a related limit. Intent cannot be observed, so “you capture the how” and infer the why from patterns. It quotes PlayerZero's Animesh Koratana, “The schema isn't the starting point. It's the output”, and lists open questions about who owns traces, how long they are kept, and how they age: “Decisions have a half-life” ([Foundation Capital, one month in](https://foundationcapital.com/context-graphs-one-month-in/)).",
          "A further critique, reported from a Substack essay by Chris Fenster, is that the agents whose activity would generate the traces are still barely deployed at scale ([Chris Fenster, reported](https://chrisfenster.substack.com/p/the-context-graph-opportunity-everyones)).",
        ],
        pullQuote: "Persistence is never the hard part — fidelity is.",
      },
      {
        heading: "Context graphs and agent memory",
        paragraphs: [
          "Writing in InfoWorld, Memgraph's CEO Dominik Tomicevic frames decision traces as only one of three kinds of memory an agent needs: episodic (decisions and outcomes), semantic (facts and meanings) and procedural (skills and how work is done). In his view a context graph should hold “entities, relationships, provenance, time, permissions, policies”, and should complement ERPs and CRMs, which remain the systems of record, as “a kind of operational memory” ([InfoWorld](https://www.infoworld.com/article/4156909/contexts-graphs-ai-memory-and-enterprise-knowledge-are-decision-traces-enough.html)).",
          "The closest open-source implementation is Graphiti from Zep, Apache-2.0 with about 33,000 GitHub stars, which defines a context graph as “a temporal graph of entities, relationships, and facts” in which “each fact in a context graph has a validity window” ([Graphiti](https://github.com/getzep/graphiti)). The Zep paper behind it keeps two timelines, when something happened and when the system learned it, and marks superseded facts invalid instead of deleting them ([arXiv 2501.13956](https://arxiv.org/abs/2501.13956)). That second idea matters for audits: you can always answer “what did we believe on the day we decided?”.",
        ],
      },
      {
        heading: "Who is selling one",
        paragraphs: [
          "“Context” is now in product names across the data market. DataHub calls itself “The Context Platform for your Data and AI Stack”, OpenMetadata “The Open Context Layer for Data and AI”, and Atlan “the missing context layer for enterprise AI”; ServiceNow launched a Context Engine at Knowledge 2026 according to its press release ([DataHub](https://github.com/datahub-project/datahub); [OpenMetadata](https://github.com/open-metadata/OpenMetadata); [Atlan](https://atlan.com/)). Most of these are metadata graphs about data assets, not records of business decisions.",
          "The Foundation Capital essay names three startup routes instead: replace the system of record (Regie), replace modules while syncing back to it (Maximor, which leaves the general ledger in place), or start as an orchestration layer and persist traces (PlayerZero). It also names Arize for observing the quality of agent decisions. We found no published schema for decision traces from any of them.",
        ],
      },
      {
        heading: "How to build one without inventing anything",
        paragraphs: [
          "If people and agents already change records through governed actions, most of a decision is already being logged: an edit log with old and new values, approvals bound to the approver's role and limit, overrides with a stated reason, and each agent run's tool calls. What is usually missing is the linking. That suggests a build order that respects Forrester's warning about fidelity.",
          "There is a useful precedent for keeping a model's guesses separate from confirmed facts. In Microsoft's Fabric IQ ontology, an “ontology agent” proposes changes to the model and a person reviews them before they apply ([Microsoft Learn](https://learn.microsoft.com/en-us/fabric/iq/ontology/overview)). The same rule works for decision links: a model may suggest that an email explains an override, but the link becomes part of the record only when someone confirms it.",
        ],
        bullets: [
          "Start from the records' own keys. The link from an approval to the order it approved is exact; never let a model guess it.",
          "Create a Decision node for each approval, rejection, override or paused agent run, linked to the record, the person, the rule and its value at that moment.",
          "Store both timelines: when the decision happened and when the system recorded it.",
          "Treat links a model proposes from emails or documents as suggestions until a person confirms them.",
          "Say plainly what is not captured: the system records what was done and the reason someone typed, not what they were thinking, and a decision made on a phone call exists only if someone logs it.",
        ],
        callout: {
          title: "The honest version is the useful version",
          body: "A context graph that claims to know why people decided things will be wrong in ways nobody can check. One that links what was decided, by whom, under which rule and with what evidence is checkable, and that is what makes precedent safe to reuse, for people and for agents.",
        },
      },
    ],
    faq: [
      {
        question: "What is a context graph?",
        answer:
          "A record of how decisions were actually made (who approved what, under which rule, with which exception and evidence) linked to the records involved and kept over time, so that precedent can be searched. The term was popularised by Foundation Capital in late 2025.",
      },
      {
        question: "What is a decision trace?",
        answer:
          "The record of one decision: the outcome, who made it and in which role, the rule that applied and its value at that moment, any exception and its stated reason, the evidence considered, and links to similar earlier decisions.",
      },
      {
        question: "Is a context graph the same as a knowledge graph?",
        answer:
          "It is a kind of knowledge graph focused on decisions over time. A general knowledge graph describes entities and relationships; a context graph adds who decided what, when, under which rule, and keeps superseded facts with their validity windows.",
      },
      {
        question: "How do context graphs relate to AI agent memory?",
        answer:
          "Decision traces are the episodic part of an agent's memory. An agent also needs semantic memory (the facts in the records) and procedural memory (how a task is done). Products such as Graphiti store facts with validity windows to support this.",
      },
      {
        question: "What is the main risk in building a context graph?",
        answer:
          "Accuracy. If the links between decisions and records are guessed rather than derived from the records' keys, the graph will look complete and be wrong. Forrester's point is that fidelity, not storage, is the hard part.",
      },
    ],
  },
];
