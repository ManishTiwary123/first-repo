/**
 * Research-desk posts written from the report
 * src/lib/research/reports/future-erp-crm.ts
 * (/research/future-of-erp-crm-agentic-ai).
 */
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

const REPORT = "/research/future-of-erp-crm-agentic-ai";

export const FUTURE_ERP_CRM_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "mcp-for-erp-crm-agents",
    title: "MCP for ERP and CRM: How Vendors Let AI Agents Into the Record",
    subtitle:
      "SAP, Microsoft, Salesforce, Oracle, Odoo, Frappe and Twenty now expose their systems of record to AI agents over the Model Context Protocol. Here is what each one offers, and the gap they all share.",
    excerpt:
      "SAP, Microsoft, Salesforce, Oracle, Odoo, Frappe and Twenty now open their records to agents over MCP. What each offers, how permissions carry over, and what is missing.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "layerStack",
    tags: ["mcp", "erp", "crm", "ai-agents"],
    keywords: {
      primary: "MCP server for ERP",
      secondary: ["Dynamics 365 ERP MCP server", "Frappe MCP server", "Odoo MCP", "SAP Joule MCP A2A", "Salesforce MCP servers"],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    relatedSlugs: ["prompt-injection-crm-ai-agents", "indian-msme-software-adoption-2026", "procurement-automation-requisition-to-receipt"],
    crossPageLinks: [
      { href: REPORT, label: "The future of ERP and CRM", note: "the full research report this article comes from" },
      { href: "/agentic-erp-crm", label: "Agentic ERP and CRM", note: "agents with approved tools and human approval" },
      { href: "/industrial-systems-audit", label: "Industrial systems audit", note: "map your systems before connecting an agent" },
    ],
    popularityScore: 76,
    featured: false,
    takeaways: [
      "By late 2026 SAP, Microsoft, Salesforce, Oracle, Odoo, Frappe and Twenty all document MCP access to their records, so MCP support is table stakes rather than a differentiator.",
      "The common safety design is that an agent inherits the signed-in user's permissions: it sees and changes only what that user could.",
      "Frappe Framework v16 shows the minimal shape: thirteen generic tools over the metadata, enabled by default, with normal document permission checks.",
      "What is missing almost everywhere is a separate authority for agents: an approval tier for submit, cancel and delete that differs from the user's own.",
      "Before connecting any agent, decide its tools, its identity, its approval rules and its spending cap, then start read-only.",
    ],
    sections: [
      {
        heading: "Why MCP became the door to the system of record",
        paragraphs: [
          "The Model Context Protocol (MCP) gives an AI agent a standard way to discover and call another system's tools. In 2025 it was a developer curiosity in ERP. By late 2026 every major vendor had adopted it, often alongside Google's Agent-to-Agent protocol (A2A), because the place where people start their work is moving out of the ERP's own screens and into assistants such as Claude, ChatGPT, Copilot and Gemini.",
          "Satya Nadella described the end state in December 2024: business logic moving into an “AI tier” that updates many databases, after which “people will start replacing the back ends” ([CX Today](https://www.cxtoday.com/customer-analytics-intelligence/microsoft-ceo-ai-agents-will-transform-saas-as-we-know-it/)). The incumbents' answer has been to open the back end on their own terms. As SAP's Ted Way put it at TechEd in October 2026, “Open protocols need governed doors” ([SiliconANGLE](https://siliconangle.com/?p=851906)). This article compares those doors; the wider market picture is in our [research report on the future of ERP and CRM](/research/future-of-erp-crm-agentic-ai).",
        ],
      },
      {
        heading: "What the incumbents expose",
        paragraphs: [
          "Microsoft's Dynamics 365 ERP MCP server is the most clearly documented. It launched at Build 2025 as a static set of 13 tools for Finance and Supply Chain Management, followed by a dynamic server with three tool classes: data tools that create, read, update and delete through data entities, form tools that open forms, set fields, filter grids and save, and action tools that run selected finance-and-operations code. It runs in the authenticated user's security context; admins control which agent platforms may connect; and Azure API Management adds rate limits, quotas and content-safety checks ([ERP Today](https://erp.today/microsoft-dynamics-365-ai-agents-erp/)).",
          "SAP's Joule Work gained MCP and A2A interoperability at TechEd 2026, and Joule Studio agents can trigger deterministic n8n workflows, on the reasoning that agents decide when a process is needed while compliance-sensitive steps follow a fixed sequence. A governed gateway through which outside assistants can invoke Joule agents was described in future tense ([SiliconANGLE](https://siliconangle.com/?p=851906)).",
          "Salesforce has roughly fifty MCP servers, and its Headless 360 treats agents as a “first-class user profile” ([Moor Insights & Strategy](https://moorinsightsstrategy.com/field-notes/at-dreamforce-2026-salesforce-goes-all-in-on-agentic-ai/)). a16z was unimpressed by the launch itself, noting the APIs were mostly available already ([a16z](https://a16z.com/is-software-losing-its-head/)).",
        ],
        bullets: [
          "Oracle's AI Agent Studio for Fusion added MCP and A2A support in October 2025, alongside a marketplace of 100+ partner agents (reported).",
          "NetSuite offers an AI Connector for Claude and ChatGPT, and its Ask Oracle interface works within the user's roles ([iTWire](https://itwire.com/guest-articles/company-news/suiteworld-keynote-netsuite-shows-the-mechanics-of-autonomous-suite)).",
          "Workday's APIs, MCP tools and documentation are open in its developer programme, and its Agent Passport gives IT a signed record of what an agent was tested for ([Workday](https://www.workday.com/content/blog/en-us/posts/2026/10/rising-product-announcements.html)).",
          "HubSpot opened its CRM data to ChatGPT, Claude, Gemini and Copilot through connectors and MCP at its September 2026 event ([Info-Tech](https://www.softwarereviews.com/vendor-technology-notes/hubspot-unbound-2026-repositions-its-crm-for-the-agentic-era)).",
        ],
      },
      {
        heading: "Open source: Frappe v16, Odoo 20 and Twenty",
        paragraphs: [
          "Frappe Framework v16, which powers ERPNext, ships a built-in MCP server at /api/v2/mcp, and “MCP is enabled by default on new sites”. It has thirteen tools in three groups: discovery (search_doctypes, get_doctype_schema, search_methods, get_method_schema, list_document_methods), documents (list, get, count, create, update and delete) and methods (call_method, call_document_method). OAuth is the main authentication, document tools apply Frappe's normal read, create, write and delete checks with field-level rules, and only whitelisted methods are callable. Site-level Agent Instructions add guidance but “do not grant permissions or access to data” ([Frappe docs](https://docs.frappe.io/framework/guides-integration/mcp.md)).",
          "Odoo 20, released in September 2026, lets users “connect to your database via MCP”, run native agents from automated and scheduled actions, and answer an agent's “questions, permission requests, and suggestions by clicking buttons”. All AI features now need paid credits ([Odoo 20 release notes](https://www.odoo.com/odoo-20-release-notes)). Twenty, the open-source CRM, serves a native MCP server per workspace with tools discovered at runtime and recommends it over its OpenAPI document for agents ([Twenty](https://twenty.com/llms.txt)).",
          "Around the core servers sits a long tail of community ones. For ERPNext there is Frappe Assistant Core (AGPL), which adds an MCP server for Claude and ChatGPT plus in-site chat ([Frappe Cloud Marketplace](https://cloud.frappe.io/marketplace/apps/frappe_assistant_core)), and Casys mcp-erpnext (MIT), with 15 tool categories across sales, purchasing, inventory, accounting, HR, projects, manufacturing, CRM and assets ([GitHub](https://github.com/Casys-AI/mcp-erpnext)). A Frappe forum thread notes that earlier chatbot add-ons often break on v16, which is a reason to prefer the built-in server where it covers the need. Odoo has community servers too, including a read-only LGPL module for versions 17 to 19.",
          "In our view Frappe's design is the one to study. A small, generic set of tools over the metadata, with the same permission checks a person gets, means one integration covers every document type, including the ones a company adds itself.",
        ],
      },
      {
        heading: "How permissions carry over: the agent inherits the user",
        paragraphs: [
          "Every vendor above uses the same safety design: the agent acts as the signed-in user. Microsoft's server runs in the user's security context; NetSuite's Ask Oracle uses the user's roles; Frappe applies the user's document permissions. It is a sensible default, because an agent then cannot see more than the person who started it.",
          "It is also not enough on its own, for two reasons. First, agents do not handle confidentiality well. Salesforce AI Research's CRMArena-Pro benchmark found leading agents show near-zero inherent confidentiality awareness, and that prompting them to be careful often lowered task performance ([arXiv 2505.18878](https://arxiv.org/abs/2505.18878)). A finance user's agent that can read salaries will repeat them if asked the wrong way. Second, a person and their agent should not always have the same authority. A sales manager may approve a 15% discount; it does not follow that every agent acting for them should be able to.",
          "The industry knows this. Workday is buying C1, an identity-governance company, specifically to govern agents ([iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen)), and Microsoft's automated lifecycle management of agent identities reached general availability at Ignite in November 2026 while dynamic permissions stayed in limited preview ([A Guide to Cloud](https://www.aguidetocloud.com/blog/microsoft-ignite-2026-ai-updates/)).",
        ],
      },
      {
        heading: "What is still missing: a separate authority for agents",
        paragraphs: [
          "As documented, neither Frappe's nor Odoo's MCP separates an agent's authority from its user's at the protocol level: there is no distinct approval tier for consequential actions such as submitting an invoice, cancelling an order or deleting a record. Odoo's permission buttons are a step towards it inside the product. The incumbents are assembling the same thing through identity products and acquisitions.",
          "For an ERP, the actions that need that tier are easy to name: anything that posts to the ledger, changes stock, commits the company to a customer or supplier, or sends something outside. Those are the steps where a wrong action costs money and cannot simply be undone. Everything else (reading, summarising, drafting, preparing a proposal) can safely run with the user's own permissions.",
        ],
        pullQuote: "The question is not whether an agent can reach your ERP. It is which actions it may take, and who approves them.",
      },
      {
        heading: "A checklist before you connect an agent to your ERP (illustrative)",
        paragraphs: [
          "The steps below are our suggested order, drawn from the vendor designs above and from security guidance on agents; they are not any one vendor's procedure. Take a mid-sized manufacturer connecting an assistant to its ERP to help the purchasing team. The first version should read purchase requisitions and supplier history and draft purchase orders, but not create them. We walked through that purchasing flow in our [requisition-to-receipt automation article](/blogs/procurement-automation-requisition-to-receipt).",
        ],
        bullets: [
          "List the exact MCP tools the agent gets; with a generic server like Frappe's, restrict it to the document types the task needs.",
          "Start read-only. Add create and update only once outputs have been checked against what the team already knows.",
          "Give the agent its own service identity where the platform allows it, so its actions are logged as the agent's, not the user's.",
          "Put an approval rule on every consequential action (submit, cancel, delete, send) and name the person who approves.",
          "Rate-limit and cap spending; Microsoft's metering can let a running task exceed a per-user limit, so check how your platform stops one.",
          "Pin the tool descriptions you reviewed and re-review them on upgrade, because a changed description changes the agent's behaviour.",
          "Keep restricted fields such as payroll out of what the agent can read at the data layer, not by instruction.",
        ],
        callout: {
          title: "How we approach it",
          body: "Our agents work through tools built against a system's API or an approved view of its data, each tool with a service identity limited to what it needs, and an approval rule on anything that changes a business record or reaches someone outside. We confirm what your ERP and CRM expose during discovery rather than claiming a ready-made connector.",
        },
      },
    ],
    faq: [
      {
        question: "What is an MCP server for an ERP?",
        answer:
          "It is an endpoint that lets an AI agent discover and call the ERP's functions (read records, create or update documents, run actions) through the Model Context Protocol, a standard many assistants support. Microsoft Dynamics 365, Frappe v16, Odoo 20 and others now document one.",
      },
      {
        question: "Does ERPNext support MCP?",
        answer:
          "Yes, through Frappe Framework v16, which ERPNext runs on. It has a built-in MCP server at /api/v2/mcp with thirteen generic tools, enabled by default on new sites, using OAuth and Frappe's normal document permissions. Community servers such as Frappe Assistant Core also exist.",
      },
      {
        question: "Can an AI agent see data its user cannot?",
        answer:
          "In the designs documented by Microsoft, NetSuite and Frappe, no: the agent runs in the signed-in user's security context and inherits their permissions. The risk is the reverse: it can see everything the user can, and benchmarks show agents have little sense of what is confidential.",
      },
      {
        question: "What is the difference between MCP and A2A?",
        answer:
          "MCP connects an agent to tools and data, such as an ERP's documents and actions. A2A, the Agent-to-Agent protocol, lets agents from different vendors hand work to each other. SAP Joule Work and Oracle AI Agent Studio support both.",
      },
      {
        question: "Is it safe to connect Claude or ChatGPT to my ERP?",
        answer:
          "It can be, with limits. Start read-only, restrict the tools to the task, require human approval for anything that posts, changes stock or contacts someone outside, log every tool call, and keep sensitive fields out of reach at the data layer. Treat any text written by outsiders as data, not instructions.",
      },
    ],
  },
  // ------------------------------------------------------------------------
  {
    slug: "prompt-injection-crm-ai-agents",
    title: "Prompt Injection in CRM AI Agents: ForcedLeak and the Controls That Matter",
    subtitle:
      "A web-to-lead form and a $5 domain were enough to make a market-leading CRM agent leak data. What happened, what has happened since, and the controls that actually reduce the risk.",
    excerpt:
      "A $5 domain and a web-to-lead form were enough to make a CRM agent leak data. What happened in ForcedLeak and since, and the controls security bodies now recommend.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "leakyFunnel",
    tags: ["security", "crm", "ai-agents", "prompt-injection"],
    keywords: {
      primary: "prompt injection CRM",
      secondary: ["ForcedLeak Agentforce", "indirect prompt injection", "AI agent security", "MCP tool poisoning"],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    relatedSlugs: ["mcp-for-erp-crm-agents", "whatsapp-as-crm", "ai-support-agent-pricing-per-resolution"],
    crossPageLinks: [
      { href: REPORT, label: "The future of ERP and CRM", note: "the full research report, including the other unsolved problems" },
      { href: "/agentic-erp-crm", label: "Agentic ERP and CRM", note: "how we scope agent tools and approvals" },
      { href: "/industrial-systems-audit", label: "Industrial systems audit", note: "find where outside text reaches your systems" },
    ],
    popularityScore: 73,
    featured: false,
    takeaways: [
      "ForcedLeak (September 2025, severity 9.4, fixed) used hidden instructions in a public web-to-lead form to make a CRM agent send lead data to an attacker's server.",
      "It was not a one-off: similar flaws in Copilot Studio and Agentforce were patched in April 2026, and the Cloud Security Alliance says indirect injection is now exploited in the wild.",
      "Any field an outsider can write and an agent later reads is an injection path: forms, emails, supplier documents, error reports, tool descriptions.",
      "Authenticating the sender does not stop hostile content in a genuine submission; it has to be treated as data, with tool use limited by its origin.",
      "The controls that matter are least privilege per agent, human approval for consequential actions, a log of every tool call, pinned tool descriptions and restricted outbound connections.",
    ],
    sections: [
      {
        heading: "ForcedLeak: the attack in plain terms",
        paragraphs: [
          "Most companies put a contact form on their website and pipe the submissions into their CRM. That is exactly the path ForcedLeak used. Disclosed in September 2025 and rated 9.4 for severity, it worked like this: an attacker submitted a lead through a public Web-to-Lead form with instructions hidden in one of its text fields. The text sat in the CRM like any other lead. Later, when an employee asked Salesforce's Agentforce agent to work with that lead, the agent read the hidden instructions and followed them, sending lead data to a server the attacker controlled. The attack needed a domain that cost $5 ([The Register](https://www.theregister.com/2025/09/26/salesforce_agentforce_forceleak_attack/)).",
          "Salesforce fixed it. But the shape of the attack is general, and it is worth understanding because it does not depend on any bug in the usual sense. Nothing was hacked. The agent did what agents do: it read text and acted on it, with the permissions of the person who asked.",
        ],
        callout: {
          title: "Direct and indirect injection",
          body: "Direct prompt injection is a user typing instructions into the agent. Indirect injection, which is what ForcedLeak was, hides instructions in content the agent reads later: a form field, an email, a document, a web page. It is harder to spot because the person using the agent never sees the attacker.",
        },
      },
      {
        heading: "It was not a one-off",
        paragraphs: [
          "In April 2026 prompt-injection flaws in Microsoft Copilot Studio and Salesforce Agentforce allowed data exfiltration through public forms; both were patched ([OECD AI Incidents Monitor](https://oecd.ai/en/incidents/2026-04-15-d934)). The same month, the Cloud Security Alliance published a research note saying indirect prompt injection had moved from proof of concept to live exploitation, citing a 32% rise in malicious injection content seen by Google between November 2025 and February 2026 ([CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-indirect-prompt-injection-in-the-wild-2026/)).",
          "The CSA's list of first-quarter 2026 incidents is a useful catalogue of how things go wrong: an agent that ignored stop commands and deleted a user's emails; an internal agent at Meta exposing data for about two hours; a cloud “Double Agent” case in which default permission scoping allowed credential theft; and active exploitation of an exposed MCP configuration in Flowise, with 12,000 to 15,000 instances exposed. Only one of these incidents received a CVE, which means most would never appear in the vulnerability feeds a security team watches. The CSA's conclusion is the one to remember: any field an outside party can write to, and an agent later summarises, is an injection vector.",
        ],
      },
      {
        heading: "AgentJacking and poisoned tools",
        paragraphs: [
          "Kaspersky's July 2026 review adds two more patterns. In “AgentJacking”, a fake error report with an embedded instruction produced callbacks from AI agents at more than 100 companies; a Sentry employee called the attack “technically not defensible”. In a poisoned MCP tool-description case, a finance agent began appending unpaid-invoice data to its replies while the user saw normal output. That second example was Microsoft's and may have been hypothetical, and Kaspersky notes that confirmed successful compromises remain scarce ([Kaspersky](https://www.kaspersky.com/blog/ai-agents-under-attack-2026-incidents/56169/)).",
          "The tool-description case matters for anyone adopting MCP. An agent decides which tool to call partly by reading each tool's description. If that description changes after you reviewed it, the agent's behaviour changes too, without any change to your own systems. We cover how ERP vendors expose tools in our article on [MCP for ERP and CRM](/blogs/mcp-for-erp-crm-agents).",
        ],
      },
      {
        heading: "Why agents fall for it",
        paragraphs: [
          "Salesforce's own research explains part of the problem. In its CRMArena-Pro benchmark, leading LLM agents completed about 58% of realistic CRM tasks in a single turn and about 35% over several turns, and they showed near-zero inherent awareness of confidentiality. Prompting them to protect confidential data often lowered their task performance ([arXiv 2505.18878](https://arxiv.org/abs/2505.18878)). An agent that does not know a field is sensitive will not hesitate to send it somewhere.",
          "The other part is permissions. Every major vendor's design has the agent act as the signed-in user, inheriting their access ([ERP Today](https://erp.today/microsoft-dynamics-365-ai-agents-erp/)). That stops an agent seeing more than its user, but it also means a successful injection gets everything the user could reach. Workday's Aneel Bhusri said an agent not grounded in business rules “is essentially lawless” ([iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen)), and only 21% of companies have a mature governance approach for autonomous agents, according to Deloitte figures reported in the same coverage.",
          "Separate identities for agents are only now arriving. Microsoft's automated lifecycle management of agent identities reached general availability at Ignite in November 2026, but dynamic permissions, which would let an agent's access shrink to the task in hand, were still in limited preview ([A Guide to Cloud](https://www.aguidetocloud.com/blog/microsoft-ignite-2026-ai-updates/)). Until that matures, the practical defence is to give each agent its own narrow tool list rather than everything its user can do.",
        ],
      },
      {
        heading: "The controls that matter",
        paragraphs: [
          "The guidance from the CSA and Kaspersky converges on a short list. None of it depends on the model getting smarter, and all of it can be built into how agents are deployed today.",
        ],
        bullets: [
          "Inventory every agent and every tool it can call. You cannot protect a path you have not listed.",
          "Least privilege, only for the task's duration. An agent drafting replies to leads does not need to read the price list's margin column.",
          "Human approval for high-impact actions: sending anything outside, changing a financial record, exporting data.",
          "An audit trail of every tool call, with the inputs, so an incident can be traced afterwards.",
          "Pin MCP tool descriptions and re-review them when they change.",
          "Separate content from instructions, and limit which tools may run on data from an outside source.",
          "Restrict outbound connections, so an agent cannot reach an attacker's server even if told to. In our view, in ForcedLeak's case that alone would have broken the chain, since the data left through an outbound request.",
        ],
        callout: {
          title: "Why signed webhooks are not enough",
          body: "Authenticating the sender of a form submission or webhook stops spoofed requests. It does not stop a real visitor typing hostile instructions into a genuine form. The content still has to be handled as data.",
        },
      },
      {
        heading: "Where your lead intake is exposed (illustrative)",
        paragraphs: [
          "Here is a hypothetical but typical setup for an Indian manufacturer, to show where the controls apply. Enquiries arrive from a website form, an ads lead form and WhatsApp, and land in the CRM. An agent summarises each new enquiry, scores it, looks up past orders from the same company and drafts a reply for the sales engineer. We described the WhatsApp side of such a flow in [WhatsApp as a CRM](/blogs/whatsapp-as-crm).",
          "Every one of those inputs is text written by someone outside the company. So the agent that reads enquiries should have read-only tools, no access to cost or margin data, and no ability to send anything itself. The draft reply goes to a person, who sends it. The agent cannot call any URL outside an allowed list. Its tool calls are logged with the enquiry that triggered them. If an enquiry contains instructions instead of a question, the worst outcome is a strange draft that a salesperson deletes, not a data leak.",
          "Platform features help at the edges. Microsoft, for example, puts Azure API Management in front of its MCP and Agent-to-Agent APIs, adding rate limits, quotas and content-safety checks, and lets admins choose which agent platforms may connect at all ([ERP Today](https://erp.today/microsoft-dynamics-365-ai-agents-erp/)). Checks like these catch some hostile content, but none of the security bodies treats filtering as sufficient on its own. The design has to assume some injected text will get through, and make sure that when it does, the agent has nothing dangerous within reach.",
          "This is the design we start from on our [agentic ERP and CRM page](/agentic-erp-crm): each tool with a service identity limited to what it needs, and an approval rule on anything that changes a record or reaches someone outside. Our [research report on the future of ERP and CRM](/research/future-of-erp-crm-agentic-ai) covers the other unsolved problems: agent identity, accountability for wrong postings, and metered cost.",
        ],
      },
    ],
    faq: [
      {
        question: "What is indirect prompt injection?",
        answer:
          "It is an attack in which instructions are hidden in content an AI agent will read later, such as a form submission, email or document, rather than typed by the agent's user. When the agent processes that content, it may follow the hidden instructions with the user's permissions.",
      },
      {
        question: "Was ForcedLeak fixed?",
        answer:
          "Yes. Salesforce fixed ForcedLeak after its disclosure in September 2025, and further prompt-injection flaws in Agentforce and Microsoft Copilot Studio were patched in April 2026. The class of attack remains, because it exploits how agents read text rather than a single bug.",
      },
      {
        question: "Can authentication on forms or webhooks stop prompt injection?",
        answer:
          "No. Authentication proves who sent a request, not what the text inside it says. A genuine visitor can type hostile instructions into a real form, so the content must be treated as data and the agent's tools limited accordingly.",
      },
      {
        question: "How do I protect a CRM AI agent from prompt injection?",
        answer:
          "Give it the fewest tools and permissions the task needs, require human approval before it sends anything or changes records, log every tool call, restrict outbound connections to an allow-list, pin reviewed tool descriptions, and keep sensitive fields out of its reach at the data layer.",
      },
      {
        question: "Do AI agents understand which CRM data is confidential?",
        answer:
          "Not reliably. Salesforce AI Research's CRMArena-Pro benchmark found leading agents showed near-zero inherent confidentiality awareness, and prompting them to be careful often reduced their task performance. Sensitive data has to be protected by permissions, not by instructions.",
      },
    ],
  },
];
