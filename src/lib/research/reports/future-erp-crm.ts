import type { ResearchReport } from "../types";

/**
 * Research report: what agentic AI has actually changed in ERP and CRM.
 * Facts checked on 2026-11-22. Status labels (shipped, preview, announced,
 * vendor claim, forecast) follow the underlying research; items read only in
 * search summaries are marked "reported".
 */
export const FUTURE_ERP_CRM_REPORT: ResearchReport = {
  slug: "future-of-erp-crm-agentic-ai",
  shortTitle: "The future of ERP and CRM",
  title: "Future of ERP and CRM: What Agentic AI Really Shipped (2026)",
  h1: ["Agentic ERP and CRM:", "what shipped, what is hype."],
  description:
    "What SAP, Salesforce, Microsoft, Oracle, Workday, Zoho and Odoo shipped for AI agents by late 2026, the AI-native startups, the sceptical data and the open risks.",
  eyebrow: "Research · ERP and CRM",
  lead:
    "Every ERP and CRM vendor now says its software runs on agents. This report separates what is generally available from what is in preview or only announced, sets the AI-native startups and their funding beside the incumbents, traces the phrases (system of action, system of intelligence, headless, service as software) to the people who coined them, and puts the forecasts next to the measured results. It ends with what this means for Indian SMEs and the problems nobody has solved yet.",
  primaryKeyword: "future of ERP and CRM",
  keywords: [
    "agentic ERP",
    "AI agents CRM",
    "SAP Joule agents",
    "Salesforce Agentforce pricing",
    "Dynamics 365 ERP MCP server",
    "AI-native ERP startups",
    "system of intelligence",
    "Frappe MCP server",
    "prompt injection CRM agents",
    "ERP for Indian SMEs",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 26,
  keyFindings: [
    {
      value: "35%",
      label: "Success rate of leading LLM agents on multi-turn CRM tasks in Salesforce AI Research's CRMArena-Pro, down from about 58% single-turn.",
      source: { label: "arXiv 2505.18878", url: "https://arxiv.org/abs/2505.18878" },
    },
    {
      value: "40%+",
      label: "Agentic AI projects Gartner forecasts will be cancelled by the end of 2027, for cost, unclear value or weak risk controls (reported).",
      source: { label: "Gartner, reported", url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027" },
    },
    {
      value: "21%",
      label: "Share of 2,919 surveyed Indian MSMEs using ERP or customised business software, while 65.8% use AI tools (CII-ISB, reported October 2026).",
      source: { label: "Policy Circle", url: "https://www.policycircle.org/?p=51184" },
    },
    {
      value: "13",
      label: "Tools in Frappe Framework v16's built-in MCP server, enabled by default on new sites and bound by normal document permissions.",
      source: { label: "Frappe docs", url: "https://docs.frappe.io/framework/guides-integration/mcp.md" },
    },
  ],
  summary: [
    "Every major incumbent has shipped the same four things: a conversational front door, a catalogue of named agents, an agent builder, and MCP (often with A2A) access to the system of record. None of that differentiates any more.",
    "What is actually autonomous is narrow: service tickets, lead qualification, invoice matching, reconciliations, leave requests. SAP's finance and manufacturing agents were still beta in January 2026, and Workday's autopilot payroll and accounting agents are 2027 items.",
    "“Agents inherit the user's permissions” is the universal safety design. A separate identity and authority model for agents is the current frontier, which is why Workday is buying an identity-governance company.",
    "AI-native money is concentrated in finance-first ledgers (Rillet at a reported $1 billion valuation) and self-writing CRMs (Lightfield, Attio, Day AI). Only Doss goes after inventory and production, and no well-funded startup sells a full manufacturing suite.",
    "Forecasts are large and measured results are small: Gartner forecasts $72 billion of agentic ERP spend by 2030, while McKinsey reports EBIT impact essentially unchanged from 2025 and leading agents succeed on about 35% of multi-turn CRM tasks.",
    "Open-source ERP moved fast: Odoo 20 and Frappe v16 ship MCP in the core, with Frappe enforcing the same document permissions for agents as for people.",
    "In India, records come before agents: 21% of surveyed MSMEs use ERP, and Tally shipped its first AI feature only in mid-2026.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "incumbents",
      kicker: "What incumbents shipped",
      title: "What SAP, Salesforce, Microsoft, Oracle and the other incumbents actually shipped",
      answer:
        "By late 2026 every major ERP and CRM incumbent has shipped a conversational front door, a catalogue of named agents, an agent builder, and MCP (often with A2A) access to the system of record, all running inside the existing permission model. Many headline agents are still in beta or early access, finance and manufacturing agents lag service and sales ones, and analysts keep flagging unproven integration, governance and pricing.",
      blocks: [
        {
          type: "table",
          caption: "Agentic ERP and CRM releases by vendor, with status as the sources state it",
          columns: ["Vendor", "What shipped or was announced", "Status", "Source"],
          rows: [
            ["SAP (Q4 2025)", "Joule Studio agent builder, Joule inside Microsoft 365 Copilot, tabular model SAP-RPT-1; 350 AI features and 2,400+ Joule skills in use. Four named agents GA; Accounting Accruals, Cash Management and Production Planning agents in beta", "Shipped (GA) / beta", "[SAP News](https://news.sap.com/?p=239691)"],
            ["SAP (Sapphire, May 2026)", "50 domain assistants coordinating 224 agents; SAP Knowledge Graph in Joule; Joule Work workspace; Joule Studio 2.0 open to external LLMs; Anthropic's Claude across Business AI", "Announced; rolling out through year-end", "[TechTarget](https://www.techtarget.com/enterprise-software/news/366642871/SAP-unveils-agentic-AI-tools-to-partially-automate-ERP-suite)"],
            ["SAP (TechEd, Oct 2026)", "Joule Work interoperability through MCP and A2A; Joule agents can trigger deterministic n8n workflows; Reltio and Dremio acquisitions announced", "Shipped and announced mix", "[SiliconANGLE](https://siliconangle.com/?p=851906)"],
            ["Salesforce (Dreamforce, Sep 2026)", "Four layers: AIforce (including Headless 360, exposing Salesforce as APIs, MCP tools and CLIs), Agentforce, Customer 360, Data 360. Claudeforce packages 37 sales skills inside Claude", "Announced; GA not stated by analysts", "[Forrester](https://www.forrester.com/blogs/from-crm-to-the-agentic-enterprise-salesforces-biggest-dreamforce-2026-reveals/)"],
            ["Microsoft Dynamics 365", "ERP MCP server: static 13-tool version at Build 2025, then a dynamic server with data, form and action tools; analytics MCP server", "Shipped / public preview", "[ERP Today](https://erp.today/microsoft-dynamics-365-ai-agents-erp/)"],
            ["Microsoft (Ignite, Nov 2026)", "Agent 365 agent and tools registries; Dynamics 365 Sales, Customer Service and ERP plugins for Copilot; automated lifecycle management of agent identities. Work IQ ERP grounding and Copilotforce in preview", "GA / preview (third-party live blog)", "[A Guide to Cloud](https://www.aguidetocloud.com/blog/microsoft-ignite-2026-ai-updates/)"],
            ["Oracle Fusion", "AI Agent Marketplace with 100+ partner agents beside about 400 Fusion agents; AI Agent Studio added MCP and A2A (October 2025); 22 teams of agents (April 2026)", "Shipped per vendor (reported)", "[Oracle, reported](https://www.oracle.com/news/announcement/ai-world-oracle-expands-ai-agent-studio-for-fusion-applications-with-new-marketplace-llms-and-vast-partner-network-2025-10-15/)"],
            ["Oracle NetSuite (SuiteWorld, Oct 2026)", "Industry SuiteAgents: Software, Product and Construction available in NetSuite Next; Healthcare, Services and Nonprofit planned", "Shipped / announced", "[CPA Practice Advisor](https://www.cpapracticeadvisor.com/2026/10/26/oracle-netsuite-debuts-industry-specific-ai-agents/192565/)"],
            ["Workday (Rising, Oct 2026)", "Sana self-service inside Gemini Enterprise, Copilot, Teams and Slack; Trusted Agent Platform. Autopilot Talent Acquisition, Payroll and Accounting agents in early access, GA in 2027", "GA / early access", "[iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen)"],
            ["Infor", "Industry AI “agentic architecture” (6 Oct 2026); Anthropic partnership so manufacturers can take approved actions from Claude (12 Nov 2026)", "Headlines only; availability not stated", "[Infor newsroom](https://www.infor.com/news)"],
            ["Zoho", "Zoho ERP launched in India on 23 January 2026; Zia Chat across all Zoho apps announced September 2026 with early access to follow", "Shipped (India) / announced", "[ERP Today](https://erp.today/zoho-launches-ai-native-erp-platform-targeting-indian-enterprises/)"],
            ["Odoo 20 (Sep 2026)", "Native agents that create records, run from scheduled actions and ask permission through buttons; MCP connection; all AI features paid in credits", "Shipped", "[Odoo 20 release notes](https://www.odoo.com/odoo-20-release-notes)"],
            ["HubSpot", "Outcome pricing from 14 April 2026: $0.50 per resolved conversation (Customer Agent), $1 per recommended lead (Prospecting Agent). Agent Hub and Agent Builder in public beta", "Shipped / public beta", "[HubSpot](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete)"],
          ],
          note: "“GA” means generally available per the source. Revenue, adoption and customer counts quoted elsewhere in this report are the vendors' own unless stated.",
        },
        {
          type: "quote",
          text: "The ERP is still the trusted system of record running your company.",
          cite: "Christian Klein, CEO of SAP, at Sapphire (May 2026)",
          url: "https://www.techtarget.com/enterprise-software/news/366642871/SAP-unveils-agentic-AI-tools-to-partially-automate-ERP-suite",
        },
        {
          type: "p",
          text: "Microsoft's ERP MCP server is the clearest example of the shared design. Its dynamic version has three tool classes: data tools that create, read, update and delete through data entities; form tools that open forms, set fields, filter grids and save; and action tools that call selected finance-and-operations code. It runs in the signed-in user's security context, so an agent sees only what that role allows; admins choose which agent platforms may connect, and Azure API Management adds rate limits, quotas and content-safety checks ([ERP Today](https://erp.today/microsoft-dynamics-365-ai-agents-erp/)). The static 13-tool server retires in calendar 2026 ([Microsoft Learn, reported](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/copilot-mcp)).",
        },
        {
          type: "p",
          text: "The commercial numbers are vendor-reported. Salesforce put Agentforce annual recurring revenue at $1.5 billion in Q2 FY27, about 240% year on year, while warning that deferred monetisation and free upgrades may hold back near-term growth ([InsiderFinance](https://www.insiderfinance.io/news/salesforce-fy2030-revenue-target-fuels-ai-strategy)). Workday says 5,500+ customers use at least one of its agents and that AI is more than 25% of new annual contract value, with 17 of its own agents live, down from about 50 once in development ([iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen)). HubSpot says 8,000+ customers have activated its Customer Agent, with resolution rates in the mid-60s per cent ([Constellation Research](https://www.constellationr.com/insights/news/hubspot-price-breeze-customer-agent-breeze-prospecting-agent-outcomes)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "The analysts' reservations",
          text: "Forrester calls Salesforce's new architecture coherent but unproven, at risk of becoming a collection of loosely integrated products, and tells buyers to negotiate explicit definitions of billable actions ([Forrester](https://www.forrester.com/blogs/from-crm-to-the-agentic-enterprise-salesforces-biggest-dreamforce-2026-reveals/)). Info-Tech says governance for Microsoft's Foundry IQ “remains unclear” ([Info-Tech](https://www.softwarereviews.com/vendor-technology-notes/microsoft-ignite-signals-transformation-for-dynamics-365-and-front-office-workers)) and that HubSpot's Agent Hub should not yet be treated as a mature enterprise control plane ([Info-Tech](https://www.softwarereviews.com/vendor-technology-notes/hubspot-unbound-2026-repositions-its-crm-for-the-agentic-era)). On Oracle's finance agents, analyst Brian Sommer said of customers working out where the human belongs in the loop: “I'm just not sure they're all there yet” ([TechTarget](https://www.techtarget.com/news/Oracle-shifts-focus-of-Fusion-Cloud-Applications-to-AI-agents/848790/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: agent counts are marketing units",
          text: "SAP spoke of 50 domain assistants in May and 40 in a TechEd brief in October ([VZ brief of SAP release](https://www.vermoegenszentrum.ch/en/stock-exchange-and-markets/news/sap-unveils-business-ai-platform-teched-2026-berlin)); Workday went from about 50 planned agents to 17 live. Counting agents says little about capability. The useful questions are which records an agent can change, through which actions, and who approves the change.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "ai-native-startups",
      kicker: "AI-native startups",
      title: "Which AI-native ERP and CRM startups matter, and how much they have raised",
      answer:
        "On the ERP side, money is concentrated in finance-first ledgers (Rillet, Campfire, DualEntry, Light, Everest), with Doss the only one going after inventory and production. On the CRM side the bet is a record that writes itself from email, calls and meetings (Lightfield, Attio, Day AI), increasingly priced per agent or per unit of work. Their shared design is that AI proposes and deterministic code and a person post, and none yet matches incumbent breadth.",
      blocks: [
        {
          type: "table",
          caption: "AI-native ERP startups",
          columns: ["Company", "Focus", "Funding (as reported)", "Source"],
          rows: [
            ["Rillet", "“Agent-first” general ledger; 600+ customers, about 40% outside tech; EY alliance", "$100M Series C at a $1B valuation led by ICONIQ (Aug 2026); total above $200M", "[Fortune](https://www.fortune.com/2026/08/18/rillet-unicorn-1-billion-valuation-series-c-nicolas-kopp-accounting-ai/)"],
            ["Campfire", "GL, revenue, close, billing, treasury; customers include Replit and PostHog", "$35M Series A (Jun 2025), $65M Series B (Oct 2025)", "[ERP Research](https://erpresearch.com/en-us/ai-native-erp)"],
            ["DualEntry", "Pitches a 24-hour AI migration off the old ledger", "$90M Series A at a $415M valuation (Oct 2025)", "[ERP Research](https://erpresearch.com/en-us/ai-native-erp)"],
            ["Light", "Multi-entity global accounting", "$30M Series A (Sep 2025), $43M total", "[ERP Research](https://erpresearch.com/en-us/ai-native-erp)"],
            ["Everest Systems", "Broader “business OS” for software companies; few named customers", "$140M announced Nov 2024", "[ERP Research](https://erpresearch.com/en-us/ai-native-erp)"],
            ["Doss", "The one operations entrant: inventory, orders, procurement, warehousing, production planning, paired with a GL", "$55M Series B co-led by Madrona and Premji Invest (Mar 2026), $73M total", "[ERP Research](https://erpresearch.com/en-us/ai-native-erp)"],
            ["Numeric", "Automates the close on top of an existing ERP, not a replacement", "$51M Series B led by IVP (Nov 2025)", "[ERP Research, reported](https://erpresearch.com/en-gb/ai-native-erp)"],
          ],
        },
        {
          type: "table",
          caption: "AI-native CRM startups",
          columns: ["Company", "Design", "Funding (as reported)", "Source"],
          rows: [
            ["Lightfield", "No configuration; builds its data model from email and calls; a temporal context graph of each deal; agents and people share one API; priced on work completed", "$47M Series A led by a16z (Sep 2026)", "[a16z](https://a16z.com/announcement/investing-in-lightfield/)"],
            ["Attio", "Flexible data model with AI attributes, a research agent and an MCP server; records still largely human-entered", "$52M Series B led by GV (Aug 2025)", "[Balderton](https://www.balderton.com/news/attio-raises-52m-to-scale-the-first-ai-native-crm-for-go-to-market-builders/)"],
            ["Day AI", "An LLM creates and updates records from email, calendar, Zoom and Slack; human corrections outrank machine inferences; priced per AI assistant", "$20M Series A led by Sequoia (Feb 2026)", "[We The Flywheel](https://wetheflywheel.com/en/guides/best-ai-native-crm-2026)"],
            ["Reevo", "CRM, sequences, dialer and meeting intelligence in one platform", "$80M at a $500M post-money valuation (Nov 2025)", "[We The Flywheel](https://wetheflywheel.com/en/guides/best-ai-native-crm-2026)"],
            ["Monaco", "CRM plus prospect database run with forward-deployed human operators", "$35M across seed and Series A, led by Founders Fund", "[We The Flywheel](https://wetheflywheel.com/en/guides/best-ai-native-crm-2026)"],
            ["Dreamteam", "Four AI “teammates” whose proposed actions people approve; a memory built from email and meetings; API and MCP server", "$53M across seed and Series A led by Accel", "[HackerNoon](https://hackernoon.com/dreamteam-raises-$53m-led-by-accel-to-rebuild-the-$100b-crm-market-around-ai-teammates)"],
          ],
          note: "Funding totals conflict between sources for Attio ($116M against $140M) and Reevo ($80M against $90M). Customer counts and retention figures throughout are company-supplied.",
        },
        {
          type: "p",
          text: "An independent guide describes the common architecture: the language model drafts journal entries, reconciliation matches and coding suggestions, while posting runs through deterministic, rule-validated paths with human approval gates and an immutable audit trail. The same guide warns that no AI-native vendor matches incumbent operational breadth, that venture-funded vendors may be acquired, repriced or shut down, and that three-day closes and 90% automation are company-supplied claims ([ERP Research](https://erpresearch.com/en-us/ai-native-erp)). A diligence finding it cites is telling: 53% of Attio's customers would have stayed with their previous CRM at AI-feature parity ([We The Flywheel](https://wetheflywheel.com/en/guides/best-ai-native-crm-2026)).",
        },
        {
          type: "list",
          items: [
            "The record writes itself from unstructured activity, and human corrections outrank machine inferences (Day AI, Lightfield).",
            "Agents and people use the same API and permission surface (Lightfield, Dreamteam).",
            "A probabilistic drafting layer sits in front of a deterministic, audited posting layer (the AI-native ledgers).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the manufacturing gap",
          text: "No well-funded AI-native player sells a full manufacturing suite. Doss stops at inventory and production planning and pairs with someone else's ledger; the finance-first startups mostly serve software companies. A product that relates GL, stock, production and CRM records under one governed layer is ahead of this cohort on breadth for factories. The human-in-the-loop services being sold as product (Monaco's operators) also suggest agents alone do not yet run a sales motion.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "named-shifts",
      kicker: "The named shifts",
      title: "System of record, system of action, system of intelligence: who said what, and when",
      answer:
        "The vocabulary moved from “system of record” through “system of action” (Bessemer, May 2025) to “system of intelligence” and “headless” software (a16z, May 2026), while vendors brand the same idea as autonomous (SAP, NetSuite), the agentic enterprise (Salesforce) or resource execution (Infor). By September 2026 even a16z was arguing that incumbents' records may become more valuable, not less, and the live question is who owns the layer above the record.",
      blocks: [
        {
          type: "table",
          caption: "Who coined the phrases",
          columns: ["Phrase", "Who", "When", "The claim"],
          rows: [
            ["Business applications “collapse”", "Satya Nadella, BG2 podcast", "December 2024", "Logic moves to an “AI tier” that updates many databases, after which “people will start replacing the back ends” ([CX Today](https://www.cxtoday.com/customer-analytics-intelligence/microsoft-ceo-ai-agents-will-transform-saas-as-we-know-it/))"],
            ["Systems of record to systems of action", "Bessemer (Mike Droesch, Darsh Patel)", "29 May 2025", "Systems of record will be “completely reimagined” within five to ten years; about $400B a year is spent on them ([Bessemer](https://www.bvp.com/atlas/roadmap-ai-systems-of-action))"],
            ["Service as software", "Foundation Capital", "Undated essay", "Software becomes “the worker itself”; a $4.6 trillion opportunity from salaries and outsourced services ([Foundation Capital](https://foundationcapital.com/system-of-agents))"],
            ["Headless software", "a16z (Seema Amble)", "13 May 2026", "“The defensible layers shift downward into data models, permissions, workflow logic, and compliance” ([a16z](https://a16z.com/is-software-losing-its-head/))"],
            ["System of intelligence", "a16z Growth (Ahern, Zhang, Immerman)", "14 May 2026", "Own the layer that pulls from the system of record; “gravity will come from orchestration” ([a16z](https://a16z.com/from-system-of-record-to-system-of-intelligence/))"],
            ["The incumbents are coming", "a16z (Seema Amble)", "3 Sep 2026", "Systems of record may “get more important, not less” ([a16z](https://a16z.com/the-incumbents-are-coming/))"],
            ["Autonomous Enterprise; autonomous suite; Enterprise Resource Execution; Agentic Enterprise", "SAP; NetSuite; Infor; Salesforce", "May–Oct 2026", "Vendor brand names for the same shift"],
          ],
        },
        {
          type: "quote",
          text: "In the SaaS era, the system of record was defensible because humans lived in the interface.",
          cite: "Seema Amble, a16z, “Is Software Losing Its Head?” (13 May 2026)",
          url: "https://a16z.com/is-software-losing-its-head/",
        },
        {
          type: "p",
          text: "The same a16z essay notes that “AI lowers the cost of recreating the first 80% of a system of record”, but that in compliance-heavy sectors “going headless may be farther away”. It called Salesforce's Headless 360 launch “a classic Salesforce marketing launch”, since the APIs were mostly available already ([a16z](https://a16z.com/is-software-losing-its-head/)). Four months later the firm's counter-argument read: “Claude can become the front door to the job while Salesforce still controls the underlying CRM data and actions”, and startups win by owning a whole job that “crosses applications, teams, and even companies” ([a16z](https://a16z.com/the-incumbents-are-coming/)).",
        },
        { type: "h3", text: "Outcome pricing, and why bills do not fall" },
        {
          type: "p",
          text: "Outcome pricing is shipping: HubSpot charges $0.50 per resolved conversation ([CMSWire](https://www.cmswire.com/customer-experience/hubspot-shifts-breeze-ai-agents-to-pay-per-result-pricing)), Intercom's Fin $0.99 per successful resolution ([Foundation Capital](https://foundationcapital.com/system-of-agents)), and Salesforce lists per-user, per-agent, consumption, transaction and outcome-based pricing side by side ([Quartr summary](https://quartr.com/events/salesforce-inc-crm-dreamforce-2026-investor-analyst-session_3YM54u40)). But fewer seats do not mean smaller bills: Jason Lemkin cut his Salesforce seats from ten or more to two human seats and one API seat, and his bill rose from $12,000 to $22,000 a year ([a16z](https://a16z.com/from-system-of-record-to-system-of-intelligence/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the durable part is not the screen",
          text: "By the investors' own account, what lasts in an ERP or CRM is the data model, the permissions, the workflow logic and compliance. Vendors pairing agents with fixed workflows (SAP with n8n, the AI-native ledgers) amounts to an admission that agents decide and deterministic code executes. For an SME, a single hub that holds all the records removes much of the cross-system orchestration problem the “system of intelligence” essays are about.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "analysts-and-data",
      kicker: "Forecasts and evidence",
      title: "What analysts and the data say about agentic ERP, including the sceptical numbers",
      answer:
        "The forecasts are large: Gartner expects $72 billion of agentic ERP spending by 2030 (reported). The measured results are small: McKinsey's 2026 survey finds about one in five organisations scaling agents and EBIT impact essentially unchanged from 2025 (reported), and leading agents complete about 35% of multi-turn CRM tasks in Salesforce's own benchmark. Gartner also forecasts that over 40% of agentic projects will be cancelled by the end of 2027.",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "$72B", label: "Agentic ERP spend by 2030, 74.6% five-year growth (Gartner forecast, reported)", source: { label: "Gartner, reported", url: "https://www.gartner.com/en/documents/7408830" } },
            { value: "37%", label: "Say AI contributed positively to EBIT, essentially unchanged from 2025 (McKinsey, reported)", source: { label: "McKinsey, reported", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" } },
            { value: "≈130", label: "Real agentic vendors among thousands claiming the label, per Gartner (reported)", source: { label: "Gartner, reported", url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027" } },
            { value: "21%", label: "Of companies with a mature governance approach for autonomous agents (Deloitte, second-hand)", source: { label: "iTWire", url: "https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen" } },
          ],
        },
        {
          type: "p",
          text: "Gartner's June 2025 forecast says “over 40% of agentic AI projects will be canceled by the end of 2027, due to escalating costs, unclear business value or inadequate risk controls”. Analyst Anushree Verma: “Most agentic AI projects right now are early stage experiments or proof of concepts.” Gartner also expects 33% of enterprise software applications to include agentic AI by 2028, up from under 1% ([Gartner, reported](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)).",
        },
        {
          type: "p",
          text: "McKinsey's “The state of AI in 2026” (August 2026) reports that 40% of respondents at organisations with revenue above $1 billion are scaling AI agents, up from 27%, while smaller organisations are flat at 22%. Eighty per cent report better individual productivity, but those gains “have yet to translate into broad financial impact”; high performers (at least 5% of EBIT from AI) stay at about 6%, and about 20% say AI operating costs, including tokens, constrained their use ([McKinsey, reported](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "The contested 95%",
          text: "MIT NANDA's August 2025 finding that 95% of generative-AI pilots stalled without measurable P&L impact ([Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)) is disputed: critics say it covered only custom projects and used a narrow definition of failure ([HPCwire](https://www.hpcwire.com/bigdatawire/2025/09/04/mit-report-flags-95-genai-failure-rate-but-critics-say-it-oversimplifies/)), while vendor-sourced G2 data claims fewer than 2% of deployed agents fail ([VentureBeat](https://venturebeat.com/ai/what-mit-got-wrong-about-ai-agents-new-g2-data-shows-theyre-already-driving)). Neither figure should be quoted alone.",
        },
        {
          type: "p",
          text: "The most useful benchmark comes from a vendor's own research team. Salesforce AI Research's CRMArena-Pro (May 2025) found leading LLM agents achieve “around 58% single-turn success”, dropping to about 35% in multi-turn settings; workflow execution was the most tractable skill (over 83% single-turn); and agents showed near-zero inherent awareness of confidentiality, with prompting for it often lowering task performance ([arXiv 2505.18878](https://arxiv.org/abs/2505.18878)). These results come from mid-2025 models; no 2026 re-run was found.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the value is in cross-department workflows",
          text: "The gap between individual productivity (80%) and company results (EBIT impact flat) suggests the value lies in redesigned workflows that cross departments, not in per-person assistants. And agents scale at large firms (40%) while stalling at smaller ones (22%), which leaves SMEs underserved by agent platforms that assume an IT team and a governance function. With multi-turn success around 35%, short agent steps with deterministic execution and approval gates are the defensible design through at least 2027.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "open-source-erp-agents",
      kicker: "Open-source ERP and CRM",
      title: "What open-source ERP and CRM projects are doing about AI agents: Frappe, Odoo, Twenty",
      answer:
        "The two leading open-source ERPs now ship MCP in the core: Odoo 20 (September 2026) with native agents sold through credits, and Frappe Framework v16 with a built-in MCP server of thirteen generic tools that enforces normal document permissions. Twenty CRM also has a native MCP server. Around them is a long tail of community MCP servers of uneven quality, and ERPNext itself still has no first-party agent product.",
      blocks: [
        {
          type: "table",
          caption: "Frappe Framework v16 built-in MCP server: the thirteen tools",
          columns: ["Group", "Tools"],
          rows: [
            ["Discovery", "search_doctypes, get_doctype_schema, search_methods, get_method_schema, list_document_methods"],
            ["Documents", "list_documents, get_document, count_documents, create_document, update_document, delete_document"],
            ["Methods", "call_method, call_document_method"],
          ],
          note: "Source: Frappe documentation, “Connecting Agents using MCP or CLI”, updated 4 November 2026.",
        },
        {
          type: "p",
          text: "Frappe's server lives at /api/v2/mcp over Streamable HTTP and “is enabled by default on new sites”. OAuth is the main authentication; document tools apply Frappe's read, create, write and delete checks with field-level and document rules; only whitelisted methods are callable; and site-level Agent Instructions add guidance but “do not grant permissions or access to data” ([Frappe docs](https://docs.frappe.io/framework/guides-integration/mcp.md)). ERPNext is GPLv3 with no paid edition; Frappe says 30,000+ companies use it, and its AI capabilities come mainly from third-party tools ([ERP Today](https://erp.today/open-source-erp-ai-shortlist-erpnext-odoo/)).",
        },
        {
          type: "p",
          text: "Odoo 20's release notes read: “Ask an AI agent to create anything for you, including by uploading a file of instructions like a PDF”; “Agents can be summoned by automated and scheduled actions”; “Respond to AI Agents' questions, permission requests, and suggestions by clicking buttons”; “Connect to your database via MCP”; and “All AI features now need credits” ([Odoo 20 release notes](https://www.odoo.com/odoo-20-release-notes)). Odoo reports 16 million+ users and was valued at EUR 7 billion in a January 2026 General Atlantic follow-on ([ERP Today](https://erp.today/open-source-erp-ai-shortlist-erpnext-odoo/)). Whether the agents are in Community or only Enterprise was not confirmed.",
        },
        {
          type: "list",
          items: [
            "Twenty CRM serves a native MCP server per workspace (streamable HTTP, OAuth 2.1 or API key, tools discovered at runtime), and its terms let agents create accounts on behalf of an identified person, who remains responsible for the agent's actions ([twenty.com/llms.txt](https://twenty.com/llms.txt)).",
            "Community ERPNext servers: [Frappe Assistant Core](https://cloud.frappe.io/marketplace/apps/frappe_assistant_core) (AGPL), [Casys mcp-erpnext](https://github.com/Casys-AI/mcp-erpnext) (MIT, 15 tool categories) and the changAI query agent; a forum thread notes earlier chatbot add-ons often break on v16 ([Frappe forum](https://discuss.frappe.io/t/need-advice-to-use-existing-ai-chatbot-assistants-on-erpnext-v16/159944)).",
            "Krayin CRM (MIT, 24.2k stars) and erxes (AGPLv3 core) describe no AI or MCP product features in their READMEs ([Krayin](https://github.com/krayin/laravel-crm); [erxes](https://github.com/erxes/erxes)).",
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Open source is on shortlists again, with conditions",
          text: "ERP Today notes that inspectable code and API access make open-source ERP easier for agents to work with, but that this “does not automatically make open-source ERP more mature in AI”, that “services, not software, often become the long-term cost center”, and that AI raises governance demands around permissions, audit trails and human review. Mordor Intelligence sizes the open-source ERP market at $5.31 billion in 2026 ([ERP Today](https://erp.today/open-source-erp-ai-shortlist-erpnext-odoo/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: generic tools, missing approval tier",
          text: "Frappe's design is a good reference: a small, generic tool set over the metadata, with the normal permission checks, instead of one tool per document type. What neither Frappe's nor Odoo's documentation describes is a separate authority for agents: an approval tier for consequential actions such as submit, cancel and delete that differs from the user's own. Agent-specific roles, approval limits and gated actions remain a differentiator, and they are how we design [agentic ERP and CRM workflows](/agentic-erp-crm).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "indian-smes",
      kicker: "Indian SMEs",
      title: "What agentic ERP means for Indian SMEs and manufacturers",
      answer:
        "India's SME base is mostly at the stage before agents: in a 2026 survey of 2,919 MSMEs, 65.8% used AI tools, mainly for communication and content, but only 21% used ERP or customised business software, and Tally shipped its first AI feature only in mid-2026. The opening is a trusted, affordable system that fixes records and cash flow first, plugged into public rails such as GST e-invoicing and Account Aggregator that already run at scale.",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "65.8%", label: "Of 2,919 MSMEs use AI tools, mostly for business communication (34.9%)", source: { label: "Policy Circle", url: "https://www.policycircle.org/?p=51184" } },
            { value: "₹8.1 lakh crore", label: "Locked in delayed payments to MSMEs (Economic Survey 2025-26)", source: { label: "Policy Circle", url: "https://www.policycircle.org/?p=51184" } },
            { value: "9.77 crore", label: "Udyam and Udyam Assist registrations as of 6 October 2026", source: { label: "Policy Circle", url: "https://www.policycircle.org/?p=51184" } },
          ],
        },
        {
          type: "p",
          text: "The CII-ISB study's sample was voluntary and is not representative, but its finding is pointed: AI use is widespread and shallow while records stay thin. As the report on it puts it, “A chatbot cannot produce a useful demand forecast from incomplete sales records” ([Policy Circle](https://www.policycircle.org/?p=51184)). A Vi Business study found over 57% of MSMEs see AI as vital to scaling and 25% already deploy AI tools ([CXOToday](https://cxotoday.com/startups-smes/over-57-of-msmes-view-ai-as-a-vital-scale-driver-25-already-deploy-ai-tools/)).",
        },
        {
          type: "p",
          text: "Tally's first AI release, TallyPrime 7.1 with TallyIra, appeared in mid-2026. Its “Docs by Ira” turns documents uploaded from desktop, mobile or WhatsApp into accounting entries, with up to 80% less manual effort claimed by Tally, and Connected Banking shows balances, makes payments and reconciles. Lifetime licences cost ₹22,500 to ₹67,500. Managing director Tejas Goenka: “The solution has to be trusted. Seems obvious, but it is not so when it comes to AI.” He says SMEs fear leaks of customer names and prices and price software more like consumers than enterprises; QuickBooks' 2023 exit from India affected 30,000 businesses ([Analytics India Magazine](https://analyticsindiamag.com/ai-features/selling-ai-tools-to-sceptic-smes-is-tricky-but-tally-solutions-knows-a-way/)).",
        },
        {
          type: "list",
          items: [
            "Zoho ERP launched on 23 January 2026 as “India's first AI-native enterprise resource planning system”, aimed at manufacturing, distribution, retail and non-profits that have outgrown Tally ([ERP Today](https://erp.today/zoho-launches-ai-native-erp-platform-targeting-indian-enterprises/)). Zoho's India revenue grew 45 to 47% in 2025 ([Entrepreneur India](https://india.entrepreneur.com/business-news/zoho-launches-zia-chat-enters-vertical-saas)).",
            "Odoo 20's India localisation adds GST for composition taxpayers, quarterly GSTR-1 under QRMP, TDS options and a count of invoices pending e-invoicing ([Odoo 20 release notes](https://www.odoo.com/odoo-20-release-notes)).",
            "GST e-invoicing is reported to remain mandatory from ₹5 crore of aggregate turnover, with a 30-day reporting deadline for businesses above ₹10 crore ([Tally, reported](https://tallysolutions.com/gst/e-invoicing-threshold/)).",
            "Account Aggregator counted 2,880 million+ accounts enabled, 493 million+ consent requests fulfilled and 295 million+ monthly data shares as of June 2026 ([Sahamati](https://sahamati.org.in/)).",
            "NASSCOM's chairperson Srikanth Velamakanni (September 2026): “we still have five to ten years to implement the best AI right now”, and AI is arriving “as an opex, rather than capex for most organisations” ([Business Today](https://www.businesstoday.in/technology/artificial-intelligence/story/india-inc-has-5-10-years-of-ai-implementation-runway-even-if-innovation-stops-today-nasscom-chief-557693-2026-09-24)).",
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Projections, not results",
          text: "The widely quoted figures of over $500 billion (BCGX-FICCI) and over $490 billion (Google and India SME Forum) of value from MSME AI adoption are economy-wide projections reported by the press, not measured outcomes ([Outlook Business](https://www.outlookbusiness.com/deeptech/tech/ai-adoption-in-msmes-can-unlock-over-usd-500-bn-economic-value-bcgx-ficci-report); [exchange4media](https://www.exchange4media.com/digital-news/ai-adoption-by-msmes-likely-to-unlock-over-490-bn-google-india-sme-forum-report-156151.html)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: records first, then receivables",
          text: "With ERP penetration around one in five, an agent's first job in an Indian SME is to create clean records from what the business already produces: invoices, WhatsApp messages, bank statements. Trust and price beat capability in this segment, so visible approval gates and predictable pricing are selling points; per-action credits may sit badly with buyers used to a one-time licence. With ₹8.1 lakh crore stuck in delayed payments, receivables follow-up is a more defensible first agent use case than generic sales AI.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "unsolved-problems",
      kicker: "Unsolved problems",
      title: "The unsolved problems: prompt injection, agent identity, accountability and cost",
      answer:
        "The hard problems are no longer model quality alone. They are untrusted input reaching an agent that holds real permissions, the absence of a separate identity and authority model for agents, accountability when an autonomous posting is wrong, and unpredictable metered cost. Prompt injection through ordinary business inputs such as web-to-lead forms was demonstrated against the market leader, and one vendor called a related attack “technically not defensible”.",
      blocks: [
        {
          type: "p",
          text: "ForcedLeak, disclosed in September 2025 with a severity of 9.4 and since fixed, used hidden instructions submitted through a public Web-to-Lead form: stored in the CRM, they later led Agentforce to send lead data to an attacker's server, and the attack needed a $5 domain ([The Register](https://www.theregister.com/2025/09/26/salesforce_agentforce_forceleak_attack/)). In April 2026 prompt-injection flaws in Microsoft Copilot Studio and Salesforce Agentforce allowed data exfiltration through public forms; both were patched ([OECD AI Incidents Monitor](https://oecd.ai/en/incidents/2026-04-15-d934)).",
        },
        {
          type: "p",
          text: "The Cloud Security Alliance reported in April 2026 that indirect prompt injection had moved from proof of concept to live exploitation, citing a 32% rise in malicious injection content seen by Google between November 2025 and February 2026, and Q1 2026 incidents including an agent that ignored stop commands and deleted a user's emails. Only one of those incidents received a CVE ([CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-indirect-prompt-injection-in-the-wild-2026/)). Kaspersky described “AgentJacking”, in which a fake error report with an embedded instruction produced callbacks from AI agents at more than 100 companies; a Sentry employee called it “technically not defensible”. Confirmed successful compromises remain scarce ([Kaspersky](https://www.kaspersky.com/blog/ai-agents-under-attack-2026-incidents/56169/)).",
        },
        { type: "h3", text: "The controls the security bodies converge on" },
        {
          type: "list",
          items: [
            "Inventory every agent and every tool it can call.",
            "Least privilege, granted only for the task's duration.",
            "Human approval for high-impact actions.",
            "An audit trail of every tool call.",
            "Pin and re-review MCP tool descriptions.",
            "Separate content from instructions, and limit tool use by where the data came from.",
            "Restrict outbound connections.",
          ],
        },
        {
          type: "p",
          text: "Identity is the other open front. Workday is buying the identity-governance company C1 specifically to govern agents, and Aneel Bhusri said an agent not grounded in business rules “is essentially lawless”; he also said payroll cannot run on probabilities and “90 percent accurate” is not enough ([iTWire](https://itwire.com/business-it-news/data/workday-rising-2026-bhusri-buys-c1-ai-to-govern-ai-agents-as-sana-takes-over-the-home-screen)). Microsoft's automated lifecycle management of agent identities reached GA at Ignite in November 2026, while dynamic permissions stayed in limited preview ([A Guide to Cloud](https://www.aguidetocloud.com/blog/microsoft-ignite-2026-ai-updates/)). Who is accountable when an autopilot posts a wrong journal entry was raised as an open question at Workday Rising.",
        },
        {
          type: "p",
          text: "Cost is the third. With Microsoft's Copilot Credits a running task can exceed a per-user limit and dashboard figures are estimates ([A Guide to Cloud](https://www.aguidetocloud.com/blog/microsoft-ignite-2026-ai-updates/)); Workday demonstrated a budget alert that can pause an agent over its limit; and outcome definitions can favour the vendor, as with a recommended lead billed as an outcome ([Info-Tech](https://www.softwarereviews.com/vendor-technology-notes/hubspot-unbound-2026-repositions-its-crm-for-the-agentic-era)). Even vendors struggle to monetise: Salesforce warned of deferred monetisation and HubSpot lowered its outlook.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: governance is the product",
          text: "Lead intake is the canonical attack path for a CRM agent: text an outsider writes is later read by an agent holding CRM permissions. Authenticating the sender does not stop hostile content inside a genuine submission, so that content has to be treated as data, with tool use limited by its origin. Because agents lack confidentiality awareness, restricted fields such as payroll must be withheld at the data layer, not by instruction. The controls the security bodies ask for (per-agent least privilege, approval for consequential actions, a log of every tool call) are the design we start from on our [agentic ERP and CRM page](/agentic-erp-crm), and the first step is an [industrial systems audit](/industrial-systems-audit).",
        },
      ],
    },
  ],
  method: [
    "Vendor statements come from each vendor's newsroom, release notes or documentation, or from trade press covering a named event; status labels (shipped, preview, early access, announced) follow those sources.",
    "Gartner, McKinsey, some Oracle and SAP pages, and Microsoft Learn's MCP page could not be opened directly (errors or timeouts); figures from them come from search summaries and are marked “reported”.",
    "The session's web-search budget ran out part-way through. Forrester and IDC 2027 predictions, Rox, and most open-source ERP and CRM projects beyond Frappe, Odoo, Twenty, Krayin and erxes were not researched and are not covered.",
    "Funding totals, customer counts and accuracy claims are company-supplied unless stated; no independent measurement of incumbent agent accuracy in production was found.",
  ],
  faq: [
    {
      q: "What is agentic ERP?",
      a: "An ERP in which AI agents carry out parts of business processes, such as matching invoices, preparing reconciliations or qualifying leads, by calling the system's own actions rather than only answering questions. In 2026 products from SAP, Microsoft, Oracle, Workday, Odoo and others, agents run inside the existing permission model and consequential steps are usually approved by a person.",
    },
    {
      q: "Will AI agents replace ERP and CRM systems?",
      a: "Not on the evidence so far. SAP calls the ERP the trusted system of record, a16z's latest essay argues incumbents' records may become more valuable, and AI-native startups pair agents with deterministic posting and audit trails. What is changing is the interface: chat front doors and outside assistants such as Claude or Copilot are becoming the way people reach the records.",
    },
    {
      q: "What has SAP shipped for AI agents?",
      a: "By early 2026 SAP had made the Joule Studio agent builder, Joule inside Microsoft 365 Copilot and the SAP-RPT-1 model generally available, with only four named agents GA and its finance and manufacturing agents in beta. At Sapphire in May 2026 it announced 50 domain assistants coordinating 224 agents and Joule Work, and at TechEd in October 2026 it added MCP and A2A interoperability.",
    },
    {
      q: "How is Salesforce Agentforce priced?",
      a: "Salesforce offers Flex Credits alongside per-user bundles that include a preset credit amount, and lists per-user, per-agent, consumption, transaction and outcome-based pricing. Dreamforce 2026 coverage reported that service agents are billed only when an issue is resolved, and an AI-generated summary of the investor session quoted the AIforce Max edition at $550 per user per month; verify both with Salesforce.",
    },
    {
      q: "Which ERP systems support MCP for AI agents?",
      a: "Microsoft Dynamics 365 Finance and Supply Chain (a dynamic ERP MCP server), SAP Joule Work (MCP and A2A), Oracle AI Agent Studio (MCP and A2A), Odoo 20 and Frappe Framework v16, which powers ERPNext, all document MCP access. Frappe's server is enabled by default on new sites and applies the normal document permissions.",
    },
    {
      q: "Are AI agents in a CRM vulnerable to prompt injection?",
      a: "Yes. ForcedLeak (September 2025) showed hidden instructions in a public web-to-lead form making Agentforce send lead data to an attacker, and similar flaws in Copilot Studio and Agentforce were patched in April 2026. Both were fixed, but the class of attack remains: any field an outsider can write and an agent later reads is an injection path.",
    },
    {
      q: "Why do agentic AI projects fail?",
      a: "Gartner forecasts that over 40% will be cancelled by the end of 2027 because of escalating costs, unclear business value or inadequate risk controls. Benchmarks add a reliability reason: leading agents completed about 35% of multi-turn CRM tasks in CRMArena-Pro. Short, approved steps on clean records fare better than long autonomous chains.",
    },
    {
      q: "Are Indian SMEs ready for AI agents in ERP?",
      a: "Most are at an earlier stage. A 2026 CII-ISB survey of 2,919 MSMEs found 65.8% using AI tools but only 21% using ERP or customised business software. The practical first step is clean records from invoices, WhatsApp and bank data, with GST e-invoicing and Account Aggregator as rails to build on.",
    },
  ],
  platformLinks: ["agentic", "factoryGraph", "audit"],
  relatedReports: [
    "ai-agent-orchestration-platforms",
    "manufacturing-knowledge-graph-ontology",
    "back-office-software-open-source-alternatives",
  ],
  blogSlugs: ["mcp-for-erp-crm-agents", "prompt-injection-crm-ai-agents"],
};
