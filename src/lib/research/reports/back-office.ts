import type { ResearchReport } from "../types";

/**
 * Research report: back-office departments, their tools, the open-source
 * alternatives and what AI agents actually do there.
 * Facts checked on 2026-11-22 (repositories and vendor pricing pages read that
 * day). Commercial prices are list prices as published on that date.
 */
export const BACK_OFFICE_REPORT: ResearchReport = {
  slug: "back-office-software-open-source-alternatives",
  shortTitle: "Back-office software map",
  title: "Back-Office Software Map 2026: Tools and Open-Source Options",
  h1: ["Every department, its tools,", "and the open-source way out."],
  description:
    "A 28-department map of the back office: the SaaS each function runs, list prices, open-source alternatives, licence risk, SaaS sprawl and what AI agents really do.",
  eyebrow: "Research · Back-office software",
  lead:
    "A manufacturer, a D2C brand and a software company run broadly the same back office: finance, HR, procurement, IT, legal, documents and data. Each function has a set of paid tools, a set of open-source alternatives and, since 2025, a set of AI agents. This report maps the departments against four public frameworks, lists the tools with the prices and licences read on 22 November 2026, measures how much SaaS companies actually run, and separates the AI results that were measured from the ones that were only announced.",
  primaryKeyword: "open source alternatives to SaaS",
  keywords: [
    "back office software",
    "open source ERP alternatives",
    "SaaS sprawl statistics",
    "AGPL licence risk",
    "open source HR payroll software",
    "AI agents accounts payable",
    "APQC process classification framework",
    "openDesk La Suite",
    "Tally alternatives India",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 26,
  keyFindings: [
    {
      value: "72",
      label: "Apps behind single sign-on at the average company under 2,000 employees, per Okta's 2026 report. A floor, not a total.",
      source: { label: "Okta Businesses at Work 2026", url: "https://www.okta.com/ja-jp/newsroom/press-releases/okta-businesses-at-work2026/" },
    },
    {
      value: "164",
      label: "Apps at the average mid-market organisation in BetterCloud's 2026 survey, up 41% from 116 in one year.",
      source: { label: "BetterCloud 2026", url: "https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/" },
    },
    {
      value: "54%",
      label: "Share of SaaS licences actually in use across Zylo's customers in 2025, up from 47% the year before.",
      source: { label: "Zylo", url: "https://zylo.com/blog/saas-statistics" },
    },
    {
      value: "85%",
      label: "Accounting fields Ramp says its payables agents coded correctly on the first try. Vendor-reported, field-level, not invoices end to end.",
      source: { label: "Ramp", url: "https://ramp.com/blog/ramp-ap-agents-announcement" },
    },
  ],
  summary: [
    "Four public frameworks (APQC's 13 categories, Porter's value chain, SCOR DS and ISA-95) map to about 28 departments. A manufacturer runs all of them; a D2C brand drops the plant and adds e-commerce operations; a software company swaps the physical supply chain for service delivery and engineering.",
    "Every back-office function has at least one actively released open-source option, but licences split three ways: permissive (Keycloak, Zulip, Superset, Temporal, Grist, Docling), copyleft (ERPNext, Plane, Nextcloud, Documenso, Lago) and source-available or open-core (n8n, NocoDB, Outline, Invoice Ninja, Airbyte, Akaunting, Camunda 8).",
    "Open source is deep in documents, chat, identity and data, and thin in HR, procurement, planning and logistics. No credible standalone open-source procurement product turned up.",
    "SaaS counts depend on how they are measured: 72 apps behind single sign-on (Okta), 164 at mid-market firms (BetterCloud survey), 305 at larger organisations (Zylo spend discovery). Only 54% of licences are used.",
    "Indian SMEs anchor on a GST-ready accounting package (Tally, BUSY, Vyapar, Zoho Books) and buy HR, logistics and e-signature as separate services at prices far below global list prices.",
    "AI agents show measured gains in narrow document work (invoice coding, close, IT tickets, contract questions) and fail at open-ended autonomy: the best agents finish about 30% of simulated office tasks and 2.5% of real freelance projects.",
    "Germany's openDesk and France's La Suite show how to put many open-source apps behind one login and one navigation, and also how shallow the integration stays after two years.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "department-taxonomy",
      kicker: "The department map",
      title: "What departments does a company run? A master taxonomy from APQC, Porter, SCOR and ISA-95",
      answer:
        "Four public frameworks give a defensible skeleton: APQC's 13 process categories (6 operating, 7 management and support), Porter's 5 primary and 4 support activities, SCOR DS's 7 supply-chain processes and ISA-95's numbered functions around the plant. Mapped together they yield about 28 departments. A discrete manufacturer runs all of them, a D2C brand drops production and plant functions and adds e-commerce operations, and a software or services company swaps the physical supply chain for service delivery and engineering.",
      blocks: [
        {
          type: "p",
          text: "APQC's cross-industry Process Classification Framework, version 7.4, was published on 21 August 2024 and organises more than 1,000 processes under 13 enterprise-level categories ([APQC](https://www.apqc.org/resource-library/resource-listing/apqc-process-classification-framework-pcf-cross-industry-pdf-12)). Six are operating processes (strategy; products and services; market and sell; supply chain for physical products; deliver services; customer service) and seven are management and support services (human capital; IT; financial resources; assets; risk and compliance; external relationships; business capabilities). The hierarchy runs five levels deep: category, process group, process, activity, task ([Rework guide to the APQC PCF](https://resources.rework.com/libraries/process-management/apqc-process-classification-framework)).",
        },
        {
          type: "p",
          text: "Porter's value chain from Competitive Advantage (1985) splits work into primary activities (inbound logistics, operations, outbound logistics, marketing and sales, service) and support activities (firm infrastructure, technology development, human resources, procurement) ([Wikipedia: Value chain](https://en.wikipedia.org/wiki/Value_chain)). The SCOR Digital Standard has seven processes, Orchestrate, Plan, Order, Source, Transform, Fulfill and Return, with Orchestrate linking strategy to the rest ([ASCM](https://www.ascm.org/corporate-solutions/standards-tools/scor-ds/)). Its 2022 update split Deliver into Order and Fulfill and renamed Make to Transform ([MH&L](https://mhlnews.com/global-supply-chain/article/21251037/ascm-releases-new-scor-digital-standard)). ISA-95 numbers the enterprise functions around the plant, from order processing (1.0) to product shipping administration (9.0), with a dashed line marking the border between ERP and control systems ([Frontiers in Energy Research](https://www.frontiersin.org/articles/10.3389/fenrg.2014.00044/pdf)); ISA published a 2025 edition of Part 1 ([ISA](https://www.isa.org/getmedia/edc62878-e354-4b76-803b-55d7efec9935/Isa-95-00-01-2025-toc.pdf)).",
        },
        {
          type: "table",
          caption: "Twenty-eight departments, their framework anchors, and who runs them",
          columns: ["Department or function", "Framework anchors", "Core work", "Mfg", "D2C", "SW"],
          rows: [
            ["Leadership, strategy and planning", "APQC 1.0; SCOR Orchestrate", "Plan, budget, targets, reviews", "Yes", "Yes", "Yes"],
            ["Product management, R&D, design engineering", "APQC 2.0; ISA-95 R&D", "Design, BOMs, routings, new product introduction", "Yes", "Yes (sourcing)", "Yes"],
            ["Marketing", "APQC 3.0", "Brand, campaigns, content, lead generation", "Yes", "Yes (largest team)", "Yes"],
            ["Sales and key accounts", "APQC 3.0; ISA-95 1.0; SCOR Order", "Enquiry, quotation, order booking", "Yes", "Yes (wholesale, B2B)", "Yes"],
            ["E-commerce and marketplace operations", "APQC 3.0; SCOR Order", "Storefront, listings, settlements", "Rare", "Yes (core)", "Self-serve billing"],
            ["Supply chain planning", "APQC 4.0; SCOR Plan; ISA-95 2.0", "Forecast, S&OP, MRP, capacity", "Yes", "Yes (inventory)", "No"],
            ["Procurement and vendor management", "APQC 4.0; SCOR Source; ISA-95 5.0", "RFQ, purchase orders, vendor scorecards", "Yes", "Yes", "Yes (software, services)"],
            ["Stores, warehouse and inventory", "ISA-95 4.0 and 7.0; SCOR Source, Fulfill", "Receiving, put-away, issues, counts, batches", "Yes", "Yes (own or 3PL)", "No"],
            ["Production operations", "APQC 4.0; SCOR Transform", "Work orders, job cards, WIP, scrap", "Yes", "Usually outsourced", "No"],
            ["Production and process engineering", "ISA-95; APQC 2.0, 4.0", "Routings, tooling, trials", "Yes", "No", "No"],
            ["Quality (QA/QC)", "ISA-95 6.0", "Inspection, NCRs, CAPA, calibration", "Yes", "Yes (product QC)", "Yes (software QA)"],
            ["Maintenance and utilities", "ISA-95; APQC 10.0", "Preventive and breakdown maintenance, spares", "Yes", "No", "Facilities only"],
            ["Logistics, dispatch and fleet", "ISA-95 9.0; SCOR Fulfill, Return", "Pick, pack, ship, e-way bill, returns", "Yes", "Yes (core)", "No"],
            ["Service delivery and projects", "APQC 5.0", "Scoping, staffing, timesheets, milestones", "Installation", "No", "Yes (core)"],
            ["Software engineering and DevOps", "APQC 2.0, 8.0", "Build, test, release, incidents", "Internal and embedded", "Storefront tech", "Yes (core)"],
            ["Customer service and after-sales", "APQC 6.0; SCOR Return", "Tickets, warranty, returns, field visits", "Yes", "Yes", "Yes"],
            ["Customer success", "APQC 6.0", "Onboarding, renewals, expansion", "Key accounts", "Retention marketing", "Yes"],
            ["Finance and accounting", "APQC 9.0", "Payables, receivables, reconciliation, close", "Yes", "Yes", "Yes"],
            ["Tax and statutory compliance", "APQC 9.0, 11.0", "GST returns, e-invoice, TDS, filings", "Yes", "Yes", "Yes"],
            ["Treasury, banking and payments", "APQC 9.0", "Cash position, payment runs, borrowings", "Yes", "Yes (gateway settlements)", "Yes"],
            ["FP&A, costing and MIS", "APQC 9.0; ISA-95 8.0", "Budgets, product costing, variances", "Yes", "Yes (unit economics)", "Yes"],
            ["Human resources and payroll", "APQC 7.0", "Hiring, attendance, payroll, appraisals", "Yes", "Yes", "Yes"],
            ["IT, security and data", "APQC 8.0", "Access, devices, helpdesk, backups", "Yes", "Yes", "Yes"],
            ["Legal, secretarial, risk and audit", "APQC 11.0", "Contracts, e-signature, filings, policies", "Yes", "Yes", "Yes"],
            ["Environment, health and safety", "APQC 11.0", "Permits, incidents, training records", "Yes", "Packaging and waste rules", "No"],
            ["Administration, facilities and assets", "APQC 10.0", "Premises, fixed assets, travel", "Yes", "Yes", "Yes"],
            ["External relations", "APQC 12.0", "Investor, lender, government, PR", "Yes", "Yes", "Yes"],
            ["Business capabilities: PMO, knowledge, BI", "APQC 13.0", "Projects, SOPs, wikis, dashboards", "Yes", "Yes", "Yes"],
          ],
          note: "Our synthesis of the cited frameworks, anchored at APQC category level only (level-2 process groups were not verified). Mfg = discrete manufacturer; D2C = direct-to-consumer or e-commerce brand; SW = software or services company.",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Two caveats on the frameworks",
          text: "APQC's own PDF sits behind a registration form, so the category names were read from a guide that reproduces them. The same guide says a version 8.0 was published in February 2026; no APQC page confirming that was found, so 7.4 is the last version verified. No published framework lists the departments of a D2C brand or a software company; those columns are a mapping of the cross-industry frameworks.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the hand-offs matter more than the boxes",
          text: "Nearly every department hands work to finance, and the documents that cross departments (purchase requisition, goods receipt, inspection lot, delivery note, invoice, ticket) are the natural shared records. Procurement, logistics, IT, legal and e-signature, EHS, external relations and most of internal communication and BI are where companies most often have no system of their own, which is where the “embed, connect or replace” decision matters most. Our [Factory Graph](/factory-graph) work starts from those shared records rather than from any one department's tool.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "finance-accounting",
      kicker: "Finance and accounting",
      title: "Finance and accounting software: list prices, India's rails and open-source options",
      answer:
        "Finance is where commercial prices vary most: QuickBooks Advanced lists at $340 a month in the US while BUSY starts at ₹5,000 a year in India. Open-source ledgers are mature (ERPNext, Odoo Community, Dolibarr, plain-text tools), but several popular “open” invoicing tools are source-available or abandoned, and India's GST e-invoicing and Account Aggregator rails decide what an Indian finance stack must support.",
      blocks: [
        {
          type: "table",
          caption: "Commercial accounting tools, as published on 22 November 2026",
          columns: ["Tool", "Position and list price", "Source"],
          rows: [
            ["QuickBooks Online (US)", "Simple Start $38, Essentials $85, Plus $140, Advanced $340 a month; AI features named, some in beta, no accuracy figures", "[Intuit](https://quickbooks.intuit.com/pricing/)"],
            ["Xero (US)", "Early $27, Growing $59, Established $97 a month; “JAX, your AI finance partner”", "[Xero](https://www.xero.com/us/pricing-plans/)"],
            ["Zoho Books (India)", "Free up to ₹25 lakh revenue; Standard ₹749 to Ultimate ₹7,999 per organisation a month, billed annually; e-invoicing from Standard", "[Zoho](https://www.zoho.com/in/books/pricing/)"],
            ["TallyPrime", "Page titled “Why 2.7M+ Businesses Still Trust TallyPrime”; FY23 revenue ₹578 crore", "[Tally](https://tallysolutions.com/business-guides/why-businesses-trust-tallyprime/); [Wikipedia](https://en.wikipedia.org/wiki/Tally_Solutions)"],
            ["BUSY", "Start ₹5,000, Smart ₹8,000, Power ₹12,000 a year plus GST; “over 6,00,000 businesses”", "[BUSY](https://busy.in/)"],
            ["Vyapar", "“Trusted by 1.5 Cr+ Indian businesses”; free mobile plan; Tally import and export", "[Vyapar](https://vyaparapp.in/)"],
            ["Odoo (India price list)", "Standard ₹580 per user a month on yearly billing (list ₹725); Custom ₹1,080 adds Studio, “Agentic AI”, multi-company and External API", "[Odoo](https://www.odoo.com/pricing)"],
          ],
        },
        {
          type: "p",
          text: "AI-native finance vendors raised large rounds in this period, though the figures come from aggregators rather than company releases: Rillet a reported $100M Series C at a $1B valuation in August 2026 ([Sacra](https://sacra.com/c/rillet/)), Numeric $51M in November 2025 and Basis $100M at $1.15B in February 2026 ([CB Insights](https://www.cbinsights.com/compare/basis-10-vs-numeric-2); [Rework](https://resources.rework.com/tools/ai-agents/best-ai-agents-for-accounting-2026)). Ramp launched agents for accounts payable on 7 October 2025 and an accounting agent in February 2026 ([Ramp](https://ramp.com/blog/ramp-ap-agents-announcement); [CPA Practice Advisor](https://www.cpapracticeadvisor.com/2026/02/12/ramp-unveils-accounting-agent-to-streamline-bookkeeping/)).",
        },
        { type: "h3", text: "India's rails: e-invoicing and Account Aggregator" },
        {
          type: "list",
          items: [
            "From 1 April 2025, taxpayers with aggregate turnover of ₹10 crore or more must report e-invoices within 30 days, after which IRN generation is blocked; multi-factor authentication became mandatory on 10 July 2025, and e-way bills are blocked for documents older than 180 days ([IRIS IRP](https://einvoice6.gst.gov.in/content/)).",
            "Account Aggregator had fulfilled 595.11 million consents and linked 352.19 million accounts, cumulatively, by 30 September 2026 ([Sahamati](https://sahamati.org.in/aa-dashboard/)).",
            "India Compliance, a GPL-3.0 add-on for ERPNext, prepares GSTR-1, reconciles purchases against GSTR-2A/2B and generates e-invoices and e-way bills; the GST API features need a paid India Compliance account ([resilient-tech/india-compliance](https://github.com/resilient-tech/india-compliance)).",
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Check the e-invoicing threshold before relying on it",
          text: "The IRIS IRP page still refers to a ₹10 crore figure for its 30-day reporting rule. The general e-invoicing applicability threshold has been reported elsewhere as lower, and the pages that would settle it were unavailable when this research was done. Confirm the current threshold with the GST portal or your tax adviser before publishing or acting on it.",
        },
        {
          type: "table",
          caption: "Open-source finance and billing software (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "Flag"],
          rows: [
            ["[ERPNext](https://github.com/frappe/erpnext)", "GPL-3.0", "41,534", "v15.126.0 (22 Nov 2026)", "Full ERP on the MIT Frappe framework"],
            ["[Odoo Community](https://github.com/odoo/odoo)", "LGPL-3.0", "56,020", "Branch-based (docs at 19.0)", "Enterprise edition needs a subscription"],
            ["[Dolibarr](https://github.com/Dolibarr/dolibarr)", "GPL-3.0", "7,887", "24.0.3 (11 Nov 2026)", "ERP/CRM for small firms"],
            ["[Akaunting](https://github.com/akaunting/akaunting)", "Business Source License 1.1", "10,327", "3.3.2 (20 Nov 2026)", "Production use capped at 2 users, 1 company, 1,000 invoices"],
            ["[hledger](https://github.com/hledgerorg/hledger)", "GPL-3.0", "4,832", "1.99.6 (1 Nov 2026)", "Plain-text ledger"],
            ["[Bigcapital](https://github.com/bigcapitalhq/bigcapital)", "AGPL-3.0", "4,236", "v0.25.48 (21 Nov 2026)", "Still 0.x"],
            ["[Midday](https://github.com/midday-ai/midday)", "AGPL-3.0", "15,134", "v0.5.0 (15 Feb 2026)", "No push since 13 Jun 2026"],
            ["[Invoice Ninja](https://github.com/invoiceninja/invoiceninja)", "Elastic License 2.0", "10,613", "v5.13.56 (20 Nov 2026)", "Source-available, not open source"],
            ["[Crater](https://github.com/crater-invoice-inc/crater)", "AGPL-3.0", "8,362", "6.0.6 (6 Mar 2022)", "Abandoned"],
            ["[InvoiceShelf](https://github.com/InvoiceShelf/InvoiceShelf)", "AGPL-3.0", "2,077", "2.4.8 (22 Nov 2026)", "Active Crater successor"],
            ["[Kill Bill](https://github.com/killbill/killbill)", "Apache-2.0", "5,862", "0.25.7 (19 Nov 2026)", "Subscription billing"],
            ["[Lago](https://github.com/getlago/lago)", "AGPL-3.0", "10,909", "v1.57.0 (5 Nov 2026)", "Usage-based billing"],
            ["[Frappe Books](https://github.com/frappe/books)", "AGPL-3.0", "5,013", "0.36.0 (6 Nov 2025)", "Repository archived"],
          ],
        },
        {
          type: "p",
          text: "Agents now reach the incumbents through MCP. Xero publishes an MIT-licensed MCP server ([XeroAPI/xero-mcp-server](https://github.com/XeroAPI/xero-mcp-server)), Intuit an Apache-2.0 one for QuickBooks Online ([intuit/quickbooks-online-mcp-server](https://github.com/intuit/quickbooks-online-mcp-server)), and Zoho MCP exposes Books, Expense, Billing, CRM, People, Projects and Desk to outside agents ([Zoho MCP](https://www.zoho.com/mcp/)). Ramp's public MCP repository is archived ([ramp-public/ramp_mcp](https://github.com/ramp-public/ramp_mcp)), a reminder that these servers are not all maintained.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "hr-procurement-logistics",
      kicker: "HR, buying and logistics",
      title: "HR, payroll, procurement and logistics: commercial tools and open-source alternatives",
      answer:
        "HR and payroll are a second purchase for most firms, priced in India at roughly ₹45 to ₹150 per employee a month (greytHR, RazorpayX), with Frappe HR and OrangeHRM as the main open-source options. Procurement has no credible standalone open-source product: purchasing lives inside ERPNext and Odoo. Logistics open source is useful but narrow (frePPLe for planning, Karrio for carrier APIs, Traccar for GPS).",
      blocks: [
        {
          type: "table",
          caption: "HR and payroll: commercial list prices",
          columns: ["Tool", "Position and price", "Source"],
          rows: [
            ["greytHR (India)", "Essential ₹2,495 a month for 50 employees then ₹45 each; Growth ₹4,495 then ₹85; “more than 34,000 companies”", "[greytHR](https://www.greythr.com/pricing/)"],
            ["Keka (India)", "No public prices; setup fee; “chosen by 12500+ companies”; API and webhooks only on the top Growth plan", "[Keka](https://www.keka.com/pricing)"],
            ["RazorpayX Payroll (India)", "Prime ₹3,499 a month up to 20 employees; Elite ₹6,499 for 50; ₹150 per extra employee", "[Razorpay](https://razorpay.com/payroll/pricing/)"],
            ["Rippling", "From $8 per employee a month plus a base fee", "[Rippling](https://www.rippling.com/pricing)"],
            ["Workday", "Acquired HiredScore, Paradox, Sana and Flowise; reported over one billion AI actions and 75% of new sales including AI (Feb 2026)", "[Wikipedia: Workday](https://en.wikipedia.org/wiki/Workday,_Inc.)"],
          ],
        },
        {
          type: "table",
          caption: "Open-source HR, recruiting and time tools (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "Note"],
          rows: [
            ["[Frappe HR](https://github.com/frappe/hrms)", "GPL-3.0", "9,092", "v16.60.0 (18 Nov 2026)", "HR and payroll on Frappe/ERPNext"],
            ["[OrangeHRM](https://github.com/orangehrm/orangehrm)", "GPL-3.0", "1,161", "5.9.1 (20 Nov 2026)", "Open-source starter edition"],
            ["[Horilla](https://github.com/horilla/horilla-hr)", "LGPL-2.1", "1,524", "2.4.0 (10 Nov 2026)", "Repository moved to horilla/horilla-hr"],
            ["[OpenCATS](https://github.com/opencats/OpenCATS)", "MPL-2.0 + CATS Public License", "790", "v0.12.0 (22 Oct 2026)", "Applicant tracking, small community"],
            ["[Kimai](https://github.com/kimai/kimai)", "AGPL-3.0", "5,173", "2.72.1 (20 Nov 2026)", "Time tracking"],
            ["[Cal.diy](https://github.com/calcom/cal.diy)", "MIT", "50,309", "v6.2.0 (1 Mar 2026)", "Fork of Cal.com with teams, workflows and SSO removed"],
            ["[Ever Gauzy](https://github.com/ever-co/ever-gauzy)", "AGPL-3.0", "8,882", "v111.263.1 (20 Nov 2026)", "HR, time and project platform"],
          ],
        },
        {
          type: "p",
          text: "AI in hiring carries legal risk. In Mobley v. Workday, filed in 2023, a US district judge in May 2025 let age-discrimination claims over Workday's AI screening proceed as a collective action, and Workday was later ordered to disclose which clients used the features ([Wikipedia: Workday](https://en.wikipedia.org/wiki/Workday,_Inc.)). Keka's hiring plans list AI job descriptions, résumé parsing and CV-to-JD match scoring ([Keka](https://www.keka.com/pricing)).",
        },
        { type: "h3", text: "Procurement: claims are large, evidence is vendor-made" },
        {
          type: "p",
          text: "Zip describes itself as an AI platform “orchestrating every request from intake to pay” and reports $1T of spend processed and $400M of “AI savings”; a Forrester study Zip commissioned reports 386% ROI and 70% shorter cycle time ([Zip](https://zip.com/)). Pactum's chatbot at Walmart closed deals with 68% of suppliers approached at an average 3% saving, but only on smaller contracts for equipment Walmart uses, not goods it resells ([Business Wire](https://www.businesswire.com/news/home/20230111005148/en); [Bloomberg](https://brp-prod-bcc.bloomberg.com/news/articles/2023-04-26/walmart-uses-pactum-ai-tools-to-handle-vendor-negotiations)). In open source, purchasing exists only inside the suites, ERPNext and Odoo Community; Odoo's India list puts External API access in the Custom plan, which matters if Odoo Online is to be connected rather than embedded ([Odoo](https://www.odoo.com/pricing)).",
        },
        { type: "h3", text: "Supply chain, shipping and fleet" },
        {
          type: "p",
          text: "Shiprocket reports 4 lakh+ sellers, 19,000+ pin codes, 42+ courier partners and 5 lakh+ transactions a day ([Shiprocket](https://www.shiprocket.in/)).",
        },
        {
          type: "table",
          caption: "Open-source planning, logistics and fleet tools",
          columns: ["Project", "Licence", "Latest release", "What it does"],
          rows: [
            ["[frePPLe](https://github.com/frePPLe/frepple)", "MIT community edition (paid edition adds features)", "9.19.0 (9 Oct 2026)", "Production planning and scheduling"],
            ["[Fleetbase](https://github.com/fleetbase/fleetbase)", "AGPL-3.0", "v0.8.1 (18 Nov 2026)", "Logistics and fleet operations"],
            ["[Karrio](https://github.com/karrioapi/karrio)", "LGPL-3.0 outside the ee/ directory", "2026.1.33 (20 Nov 2026)", "Multi-carrier shipping API"],
            ["[OpenBoxes](https://github.com/openboxes/openboxes)", "EPL-1.0", "v0.9.9-hotfix1 (21 Nov 2026)", "Inventory and supply chain"],
            ["[openTCS](https://github.com/openTCS/opentcs)", "No licence file at the usual names", "7.5 (17 Aug 2026)", "Control of automated guided vehicles"],
            ["[Traccar](https://github.com/traccar/traccar)", "Apache-2.0", "v6.17.0 (1 Nov 2026)", "GPS fleet tracking"],
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: build purchasing on the ledger you already have",
          text: "Where a company already runs stock, accounting and quality in one system, building purchasing against those same ledgers is likely less work than embedding a second ERP's buying module. Requisition, purchase order, goods receipt and three-way match all touch records that already exist; see our [procurement walkthrough](/blogs/procurement-automation-requisition-to-receipt) for what that flow looks like.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "it-legal-collaboration",
      kicker: "IT, legal and collaboration",
      title: "IT, identity, legal, projects, documents and data: where open source is deepest",
      answer:
        "Open source is strongest in the horizontal tools every department shares: identity (Keycloak, authentik, Zitadel), chat and video (Zulip, Matrix, Jitsi, LiveKit), files and office editing (Nextcloud, Collabora, ONLYOFFICE), wikis and documents (La Suite Docs, Docmost, XWiki), e-signature (Documenso, DocuSeal) and data (Superset, DuckDB, ClickHouse, dbt, Temporal). The catch is licence and open-core boundaries, not maturity.",
      blocks: [
        {
          type: "table",
          caption: "Commercial anchors for the shared functions",
          columns: ["Tool", "Price or position", "Source"],
          rows: [
            ["Okta Workforce Identity", "Starter $6, Essentials $17 per user a month, $1,500 annual minimum", "[Okta](https://www.okta.com/pricing/)"],
            ["Asana", "Starter $10.99, Advanced $24.99 per user a month (annual); AI Teammates capped at 5 requests per user a month", "[Asana](https://asana.com/pricing)"],
            ["Google Workspace (India)", "Base ₹99, Starter ₹270, Standard ₹1,080 per user a month; Gemini from Starter", "[Google](https://workspace.google.com/intl/en_in/pricing.html)"],
            ["Slack (India)", "Free keeps 90 days of history; Pro ₹245.25 and Business+ ₹557.10 per user a month (yearly)", "[Slack](https://slack.com/intl/en-in/pricing)"],
            ["Power BI", "Pro $14, Premium Per User $24 per user a month; Copilot only with Fabric capacity", "[Microsoft](https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing)"],
            ["Leegality (India)", "Aadhaar eSign ₹25 per signatory, other eSign ₹15; 5,000+ companies, 30 million documents", "[Leegality](https://www.leegality.com/pricing)"],
          ],
        },
        {
          type: "table",
          caption: "The strongest open-source options in the shared functions (GitHub, read 22 November 2026)",
          columns: ["Function", "Project", "Licence", "Stars", "Note"],
          rows: [
            ["Identity", "[Keycloak](https://github.com/keycloak/keycloak)", "Apache-2.0", "38,001", "Used inside openDesk"],
            ["Identity", "[authentik](https://github.com/goauthentik/authentik)", "MIT outside authentik/enterprise/", "26,416", "Open core"],
            ["Identity", "[Zitadel](https://github.com/zitadel/zitadel)", "AGPL-3.0", "15,633", "Identity platform"],
            ["IT assets and service desk", "[Snipe-IT](https://github.com/grokability/snipe-it); [GLPI](https://github.com/glpi-project/glpi)", "AGPL-3.0; GPL-3.0", "15,227; 6,644", "Asset register; assets plus service desk"],
            ["Helpdesk", "[Zammad](https://github.com/zammad/zammad)", "AGPL-3.0", "6,134", "7.2.3 (11 Nov 2026)"],
            ["Secrets and VPN", "[Infisical](https://github.com/Infisical/infisical); [Headscale](https://github.com/juanfont/headscale)", "MIT core + ee/; BSD-3-Clause", "30,680; 45,981", "Secrets; self-hosted Tailscale control server"],
            ["E-signature", "[Documenso](https://github.com/documenso/documenso); [DocuSeal](https://github.com/docusealco/docuseal)", "AGPL-3.0", "15,868; 19,121", "Both active in November 2026"],
            ["Compliance and GRC", "[Probo](https://github.com/getprobo/probo); [Comp AI](https://github.com/trycompai/comp)", "MIT; AGPL-3.0", "1,539; 2,111", "SOC 2 / ISO 27001 automation, early"],
            ["Projects", "[Plane](https://github.com/makeplane/plane); [OpenProject](https://github.com/opf/openproject)", "AGPL-3.0; GPL-3.0", "62,969; 17,632", "Plane ships an MIT MCP server"],
            ["Tables", "[Grist](https://github.com/gristlabs/grist-core)", "Apache-2.0", "12,127", "Spreadsheet-database, part of France's La Suite"],
            ["Chat and video", "[Zulip](https://github.com/zulip/zulip); [Jitsi Meet](https://github.com/jitsi/jitsi-meet); [LiveKit](https://github.com/livekit/livekit)", "Apache-2.0", "26,289; 30,278; 22,337", "Permissive throughout"],
            ["Files and office", "[Nextcloud](https://github.com/nextcloud/server); [Collabora Online](https://github.com/CollaboraOnline/online)", "AGPL-3.0; MPL-2.0", "37,603; 3,405", "Run as separate services"],
            ["Wiki and documents", "[La Suite Docs](https://github.com/suitenumerique/docs); [Docmost](https://github.com/docmost/docmost)", "MIT; AGPL-3.0", "17,003; 22,397", "Docs ships in openDesk as “Notes”"],
            ["Document intake", "[Docling](https://github.com/docling-project/docling); [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx)", "MIT; GPL-3.0", "70,876; 48,486", "Parsing; archive with OCR"],
            ["BI", "[Apache Superset](https://github.com/apache/superset); [Metabase](https://github.com/metabase/metabase)", "Apache-2.0; AGPL + commercial", "75,621; 50,477", "Metabase embedding features sit in the commercial part"],
            ["Data and orchestration", "[DuckDB](https://github.com/duckdb/duckdb); [ClickHouse](https://github.com/ClickHouse/ClickHouse); [Temporal](https://github.com/temporalio/temporal); [Kestra](https://github.com/kestra-io/kestra)", "MIT; Apache-2.0; MIT; Apache-2.0", "43,238; 51,062; 24,544; 30,314", "Embeddable without a commercial licence"],
          ],
        },
        {
          type: "p",
          text: "Popularity and depth are inversely related. The most-starred projects are horizontal tools: n8n with about 212,000 stars, Stirling-PDF about 97,000, AppFlowy about 79,000, AFFiNE about 77,000 and Superset about 76,000 ([n8n](https://github.com/n8n-io/n8n); [Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF); [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy); [AFFiNE](https://github.com/toeverything/AFFiNE)). Vertical back-office systems are far smaller: ERPNext about 42,000, Frappe HR about 9,000, OrangeHRM about 1,200, frePPLe about 800.",
        },
        {
          type: "p",
          text: "Vendors are converging on MCP as the agent interface. Okta ([okta/okta-mcp-server](https://github.com/okta/okta-mcp-server)), dbt, ClickHouse, Plane and Docling all ship servers alongside the finance vendors above. Agent pricing is moving to metering at the same time: Asana charges per AI request beyond the cap, and Mattermost's free commercial mode caps viewable messages at 10,000 and agent queries at 250 a month ([Mattermost editions](https://docs.mattermost.com/product-overview/editions-and-offerings.html)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Projects that look open but restrict use",
          text: "NocoDB moved to the Sustainable Use License, with its licence file dated 29 January 2026, and is now limited to internal business use ([NocoDB](https://github.com/nocodb/nocodb)). Outline's Business Source License bans offering it as a “Document Service” to third parties ([Outline](https://github.com/outline/outline)). Airbyte is under the Elastic License 2.0 ([Airbyte](https://github.com/airbytehq/airbyte)). Focalboard has had no release for 29 months ([Focalboard](https://github.com/mattermost-community/focalboard)).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "saas-sprawl",
      kicker: "SaaS sprawl",
      title: "How many SaaS tools does a company run, and what does the sprawl cost?",
      answer:
        "The count depends on how it is measured: Okta sees 72 apps behind single sign-on at companies under 2,000 employees, BetterCloud's survey puts mid-market firms at 164 after a 41% jump in one year, and Zylo's spend-based discovery finds 305 at larger organisations. On cost, Zylo reports a median of $9,455 per employee a year, only 54% of licences in use and an average of $19.8 million a year wasted at the organisations it tracks.",
      blocks: [
        {
          type: "table",
          caption: "Three sources, three methods",
          columns: ["Source", "What it measures", "Headline count", "Bias"],
          rows: [
            ["[Okta, Businesses at Work 2026](https://www.okta.com/ja-jp/newsroom/press-releases/okta-businesses-at-work2026/)", "Apps wired to single sign-on, 1 Nov 2024 to 31 Oct 2025", "98 global average (down 3%); 72 under 2,000 employees; 259 at 2,000+; 46 at tech startups", "A floor: unmanaged apps are invisible"],
            ["[BetterCloud, 2026 State of SaaS](https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/)", "Survey of 525 IT and security professionals, 15 July 2026", "Apps up 11%; mid-market up 41% from 116 to 164", "Self-reported by IT staff"],
            ["[Zylo, 2026 SaaS Management Index](https://zylo.com/news/2026-saas-management-index)", "Apps discovered from spend and expense data, 40 million+ licences", "305 average, 240 median, flat year on year", "Skews to large enterprises; catches shadow purchases"],
          ],
        },
        {
          type: "stats",
          items: [
            { value: "$9,455", label: "Median SaaS spend per employee a year (Zylo)", source: { label: "Zylo benchmarks", url: "https://zylo.com/benchmarks" } },
            { value: "211", label: "Renewals the average Zylo customer handles a year", source: { label: "Zylo", url: "https://zylo.com/blog/saas-statistics" } },
            { value: "90%", label: "Of organisations lack true cross-app orchestration (BetterCloud)", source: { label: "BetterCloud 2026", url: "https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/" } },
          ],
        },
        {
          type: "p",
          text: "Zylo's other figures sketch the cost: licence waste of $19.8 million a year, down from $20.9 million; 79% of IT leaders saw a price increase at renewal; business units control 81% of SaaS spend while IT directly manages 15% ([Zylo](https://zylo.com/blog/saas-statistics)). Its own news release states waste differently, as 36% of licences unused “measured against industry-recommended utilization levels” ([Zylo news](https://zylo.com/news/2026-saas-management-index)). On AI, AI-native app spend rose 108% overall, the average portfolio holds 7 generative-AI apps, 78% of IT leaders had unexpected consumption or AI charges and 77% found AI features running without IT's knowledge.",
        },
        {
          type: "p",
          text: "BetterCloud adds the security and operations side: only 56% of apps in use have IT approval, an average of 27 AI-powered apps make up 22% of the portfolio, only one in four organisations automates offboarding, and 18% had a breach caused by an offboarded user who still had access ([BetterCloud 2026](https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/)). Its historical series peaked at 130 apps in 2022, fell to 106 in the 2025 report, and is rising again ([BetterCloud 2025, reported](https://www.bettercloud.com/monitor/2025-state-of-saas-trends/)); Torii lists the 2026 BetterCloud average as 118 ([Torii](https://www.toriihq.com/saas-statistics)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: sprawl costs four things, and licences are the smallest",
          text: "Unused seats, renewal overhead, security exposure from unsanctioned apps and slow offboarding, and missing orchestration between apps. One login, one people directory and shared records address the last three directly. For an SME, Okta's startup and sub-2,000 figures (roughly 45 to 75 managed apps) are the defensible range; Zylo's dollar averages come from large enterprises and should not be quoted as SME figures. We go further in [SaaS sprawl statistics 2026](/blogs/saas-sprawl-statistics-2026).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "india-smes",
      kicker: "What Indian SMEs run",
      title: "What do small and mid-sized Indian companies actually use across these functions?",
      answer:
        "The verifiable picture is vendor-claimed installed bases: Tally 2.7 million businesses, BUSY 6 lakh, Vyapar 1.5 crore, greytHR 34,000 companies, Keka 12,500, Shiprocket 4 lakh sellers and Leegality 5,000 companies, with government rails (GST e-invoicing, Account Aggregator) underneath. No independent survey of Excel or WhatsApp use as business tools was found, so those remain unquantified.",
      blocks: [
        {
          type: "table",
          caption: "Installed bases claimed by the vendors themselves",
          columns: ["Vendor", "Claim", "Price anchor", "Source"],
          rows: [
            ["TallyPrime", "2.7 million+ businesses", "Not retrievable (pricing page returned 403)", "[Tally](https://tallysolutions.com/business-guides/why-businesses-trust-tallyprime/)"],
            ["BUSY", "Over 6,00,000 businesses, 30+ years", "From ₹5,000 a year", "[BUSY](https://busy.in/)"],
            ["Vyapar", "1.5 Cr+ businesses, 1 crore+ downloads", "Free mobile plan", "[Vyapar](https://vyaparapp.in/)"],
            ["Zoho", "100 million+ users worldwide (its own timeline also shows 90 million)", "Zoho Books from ₹749 a month", "[Zoho](https://www.zoho.com/aboutus.html)"],
            ["greytHR", "More than 34,000 companies", "₹2,495 a month for 50 employees", "[greytHR](https://www.greythr.com/pricing/)"],
            ["Keka", "12,500+ companies", "On request", "[Keka](https://www.keka.com/pricing)"],
            ["RazorpayX Payroll", "Razorpay cites 50,00,000+ businesses on payments", "₹3,499 a month for 20 employees", "[Razorpay](https://razorpay.com/payroll/pricing/)"],
            ["Shiprocket", "4 lakh+ sellers, 19,000+ pin codes", "Per shipment", "[Shiprocket](https://www.shiprocket.in/)"],
            ["Leegality", "5,000+ companies, 30 million documents", "Aadhaar eSign ₹25", "[Leegality](https://www.leegality.com/pricing)"],
          ],
          note: "All figures are vendor claims and are not comparable: Vyapar's counts free mobile users, Tally's counts licences.",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Tally's market share figures do not reconcile",
          text: "Tally has claimed about 70% of the MSME segment while saying only 25 to 30% of MSMEs use digital tools ([YourStory](https://yourstory.com/smbstory/tallys-nupur-goenka-charts-a-new-digital-course-for-msmes)). Other reports put it at nearly 75% of SME business software ([Analytics India Magazine](https://analyticsindiamag.com/ai-features/the-timeless-legacy-of-tally-solutions)) and at one in every four MSMEs ([Mint via Magzter](https://www.magzter.com/en/stories/newspaper/Mint-Hyderabad/MEET-THE-BOOKKEEPER-TO-INDIAS-MSMES)). One measures share of software users, the other share of all MSMEs.",
        },
        { type: "h3", text: "An illustrative 50-person stack" },
        {
          type: "p",
          text: "Using the list prices above for a 50-person firm: Google Workspace Starter (₹13,500) plus Slack Pro (₹12,262) plus greytHR Essential (₹2,495) plus Zoho Books Professional (₹1,499) is about ₹29,756 a month, close to ₹3.6 lakh a year before GST, for four tools. Odoo Standard for the same 50 users is ₹29,000 a month ([Odoo](https://www.odoo.com/pricing)). This is arithmetic on published list prices, not a quote.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: compliance is the entry ticket, price is not the differentiator",
          text: "The Indian SME stack is anchored on a desktop or mobile accounting package chosen for GST compliance, not on an ERP. HR is a second purchase; logistics, e-signature and banking are per-transaction services. A year of BUSY costs less than one month of QuickBooks Advanced, and an all-in-one priced near the four-tool total already exists, so a connected system has to win on the hand-offs between departments rather than on price. Our [Indian MSME software adoption](/blogs/indian-msme-software-adoption-2026) post looks at the survey data behind this.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "licence-risk",
      kicker: "Licence risk per function",
      title: "The most credible open-source option per function, and its licence risk",
      answer:
        "Permissive options exist for identity, chat, video, spreadsheets, document parsing, BI, orchestration and subscription billing, and can be embedded freely. The strongest business applications (ERPNext, Plane, Nextcloud, Documenso, Metabase, Lago) are GPL or AGPL and are safer run as separate, unmodified services. Several popular “open” tools (n8n, NocoDB, Outline, Invoice Ninja, Airbyte, Akaunting, Camunda 8) forbid exactly the commercial hosting or embedding a product would need.",
      blocks: [
        {
          type: "quote",
          text: "… MUST NOT be used at Google.",
          cite: "Google's open source policy, on AGPL-licensed code",
          url: "https://opensource.google/documentation/reference/using/agpl-policy",
        },
        {
          type: "p",
          text: "Google's policy explains why: a product depending on AGPL code may have to release its complete source, and the obligation “is triggered if the product or service can be accessed over a remote network interface” ([Google](https://opensource.google/documentation/reference/using/agpl-policy)). n8n's Sustainable Use License allows use “only for your own internal business purposes or for non-commercial or personal use” ([n8n](https://github.com/n8n-io/n8n)). Camunda 8, from version 8.6, is free for development and testing only, with production needing a licence ([Camunda](https://camunda.com/blog/2024/04/licensing-update-camunda-8-self-managed/)); Operaton is the community-owned Apache-2.0 engine built on Camunda 7 ([Operaton](https://operaton.org/)). Odoo Enterprise “can only be used … with a valid Odoo Enterprise Subscription” ([Odoo licences](https://www.odoo.com/documentation/19.0/legal/licenses.html)).",
        },
        {
          type: "table",
          caption: "Most credible open-source option per function, and how to hold it",
          columns: ["Function", "Option", "Licence", "Safer way to use it (our reading)"],
          rows: [
            ["Accounting and GST", "ERPNext with India Compliance", "GPL-3.0", "Run alongside and exchange data over its API; do not merge code"],
            ["Subscription billing", "Kill Bill; Lago", "Apache-2.0; AGPL-3.0", "Embed Kill Bill; run Lago unmodified as a service"],
            ["Invoicing only", "InvoiceShelf", "AGPL-3.0", "Avoid Crater (abandoned), Akaunting (BSL), Invoice Ninja (ELv2)"],
            ["HR and payroll", "Frappe HR; Horilla", "GPL-3.0; LGPL-2.1", "Reference for behaviour; payroll rules are country-specific"],
            ["Scheduling and time", "Cal.diy; Kimai", "MIT; AGPL-3.0", "Embed Cal.diy (team features removed); run Kimai separately"],
            ["Procurement", "ERPNext Buying, Odoo Purchase", "GPL-3.0; LGPL-3.0", "No standalone product; build on the existing stock and ledger"],
            ["Planning", "frePPLe community", "MIT", "Call as a planning engine; advanced features are paid"],
            ["Shipping and fleet", "Karrio; Traccar", "LGPL-3.0 (ee/ carve-out); Apache-2.0", "Call carrier APIs as a service; Indian carriers may not be covered"],
            ["E-signature", "Documenso or DocuSeal", "AGPL-3.0", "Run unmodified; Aadhaar eSign needs a licensed provider anyway"],
            ["Identity and SSO", "Keycloak", "Apache-2.0", "Embed: it is the login, as in openDesk"],
            ["Chat and video", "Zulip; Jitsi; LiveKit", "Apache-2.0", "Embed"],
            ["Files and office editing", "Nextcloud with Collabora", "AGPL-3.0; MPL-2.0", "Separate services behind one login"],
            ["Wiki and documents", "La Suite Docs", "MIT", "Embed; avoid Outline (BSL) for a hosted product"],
            ["BI and data", "Superset; DuckDB; ClickHouse; dbt", "Apache-2.0 / MIT", "Embed; avoid Airbyte (ELv2) for a hosted product"],
            ["Workflow", "Temporal; Kestra; Activepieces; Flowable or Operaton", "MIT; Apache-2.0; MIT core; Apache-2.0", "Embed permissive engines; n8n and Camunda 8 need commercial terms"],
          ],
          note: "Licences as read from each repository on 22 November 2026. The handling column is our reading, not legal advice.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Permissive (MIT, Apache-2.0, BSD): embed, modify and white-label.",
            "Weak copyleft (LGPL, MPL, EPL): link or call freely; publish changes to the library itself.",
            "GPL and AGPL: keep at arm's length as an unmodified separate service; AGPL also requires offering source to network users, and some enterprise buyers ban it outright.",
            "Source-available and fair-code (Sustainable Use, Elastic, BSL, vendor agreements): commercial hosting or embedding needs a paid licence.",
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Licences move, and the enterprise features sit in ee/",
          text: "Four projects in this sample changed terms recently: NocoDB (January 2026), NocoBase (a new agreement for version 3 onward, updated 16 November 2026, [NocoBase](https://github.com/nocobase/nocobase)), Cal.com (its open repository is now a stripped fork) and Camunda (production licence since 8.6). Open-core projects such as authentik, Fleet, Infisical, Rocket.Chat, Metabase, Windmill and Twenty carve enterprise directories out under separate licences, and the features a business needs (SSO, audit logs, fine-grained roles) are often the ones inside them. Pin each dependency's licence by version and recheck it at upgrade. Our [licence risk guide](/blogs/open-source-licence-risk-agpl-bsl-sspl) explains each tier in more depth.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "ai-agents-back-office",
      kicker: "AI agents: results",
      title: "What AI agents have actually achieved in the back office, and what failed",
      answer:
        "Narrow, document-heavy tasks show measured gains: 85% first-try invoice coding (vendor-reported), month-end close shortened by a third, 73 to 88% of IT tickets resolved without a person, and AI ahead of lawyers on document questions. Open-ended autonomy still fails: the best agents finish about 30% of simulated office tasks and 2.5% of real freelance projects, MIT found most enterprise pilots showed no profit impact, and Gartner expects over 40% of agentic projects to be cancelled by the end of 2027.",
      blocks: [
        {
          type: "table",
          caption: "What worked (mostly vendor-reported)",
          columns: ["Function", "Result", "Source"],
          rows: [
            ["Accounts payable", "85% of accounting fields coded correctly first try; 90% of 90,000 approval recommendations accepted; $1M+ of suspect bills flagged (Ramp's own data, September 2025)", "[Ramp](https://ramp.com/blog/ramp-ap-agents-announcement)"],
            ["Payables benchmark", "Best-in-class teams process 49.2% of invoices touchlessly at $2.78 each, against a 32.6% and $9.40 average (Ardent Partners 2025)", "[Tungsten Automation](https://www.tungstenautomation.com/learn/blog/ai-in-accounts-payable-metrics-that-matter)"],
            ["Month-end close", "Brex from 6 to 4 days; Betterment 22% shorter; at DailyPay 80% of flux-analysis first drafts written by AI (customer results)", "[Numeric](https://www.numeric.io/)"],
            ["Tax and client accounting", "A return that took more than 100 hours now takes “maybe 15 or 20” (customer statement)", "[Basis](https://www.getbasis.ai/)"],
            ["Procurement negotiation", "68% of approached suppliers closed at a 3% average saving, long-tail contracts only", "[Pactum](https://www.businesswire.com/news/home/20230111005148/en)"],
            ["IT helpdesk", "Broadcom 88% autonomous resolution; Mercari about 75%; Databricks 73% deflection and $1.5M saved", "[Moveworks](https://www.moveworks.com/us/en/customers)"],
            ["Legal", "Harvey 94.8% on document Q&A against a 70.1% lawyer baseline", "[Vals AI](https://www.vals.ai/vlair)"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Benchmarks that disagree",
          text: "APQC's median is $6.00 per invoice and 15 days from receipt to payment, and the Hackett Group's 2025 average touchless rate is 60% ([Corpay citing APQC and Hackett](https://www.corpay.com/en-LU/resources/blog/ap-team-productivity-benchmarks)), against Ardent's 32.6%. The samples most likely differ. On close, APQC's median is 6.4 calendar days and a survey of 624 US finance professionals put the average at 6.2 business days ([Rework](https://resources.rework.com/tools/ai-agents/best-ai-agents-for-accounting-2026); [HackerNoon](https://hackernoon.com/rillet-opens-in-london-to-help-uk-finance-teams-close-the-books-in-real-time)).",
        },
        { type: "h3", text: "What failed or fell short" },
        {
          type: "list",
          items: [
            "MIT NANDA's “The GenAI Divide” (August 2025; 150 interviews, 350 employees surveyed, 300 deployments): about 5% of pilots produced rapid revenue gains; more than half of budgets went to sales and marketing although the largest returns were in back-office automation; buying from specialist vendors succeeded about 67% of the time and internal builds about a third as often ([Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)).",
            "Gartner (25 June 2025): over 40% of agentic AI projects will be cancelled by the end of 2027 because of cost, unclear value or weak risk controls ([Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)).",
            "TheAgentCompany benchmark (September 2025): the best agent completed about 30% of tasks in a simulated software company ([arXiv 2412.14161](https://arxiv.org/abs/2412.14161)). The Remote Labor Index (October 2025): the best agent automated 2.5% of real paid freelance projects ([arXiv 2510.26787](https://arxiv.org/abs/2510.26787)).",
            "Project Vend (Anthropic, June 2025): an agent ran a small office shop for about a month and lost money, sold below cost, gave discounts under pressure and invented a payment account; Anthropic said better scaffolding would fix much of it ([Anthropic](https://www.anthropic.com/research/project-vend-1)).",
            "Lawyers still beat AI at redlining (79.7% against 65.0% for the best tool) and EDGAR research (70.1% against 55.2%) ([Vals AI](https://www.vals.ai/vlair)).",
            "Klarna said in February 2024 that its assistant handled two-thirds of service chats, the work of 700 agents; its workforce fell from 5,527 to 2,907 by 2025 ([Wikipedia: Klarna](https://en.wikipedia.org/wiki/Klarna)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: bounded work, a ledger to check against, a person approving",
          text: "The successes share a shape: a bounded document or ticket, a system of record to check the result against, a person approving it, and a vendor product rather than an internal build. The failures share the opposite: long horizons, no ledger to reconcile against, and money committed without a gate. “Touchless” is still a minority even at the best payables teams, and Ramp's 85% is field-level accuracy, not invoices processed end to end. That is why our [agentic ERP and CRM](/agentic-erp-crm) work keeps figures in code, gives agents approved tools only, and holds anything that changes a record until a named person approves it.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "sovereign-hubs",
      kicker: "openDesk and La Suite",
      title: "openDesk and La Suite: one login and one navigation for many open-source apps",
      answer:
        "Germany's openDesk and France's La Suite are the two working examples of a government “one hub” built from open source, and they chose opposite designs. openDesk bundles about ten existing third-party apps behind Keycloak with a shared navigation feed; La Suite builds its own MIT-licensed apps on shared libraries with one login. openDesk reached about 100,000 workplaces and La Suite more than 500,000 monthly users in 2026, and neither covers accounting, HR or any operational department.",
      blocks: [
        {
          type: "table",
          caption: "Two sovereign suites compared",
          columns: ["Aspect", "openDesk (ZenDiS, Germany)", "La Suite numérique (DINUM, France)"],
          rows: [
            ["Design", "Bundles existing apps: Element, Notes (France's Docs), CryptPad, Nextcloud, OX App Suite, XWiki, OpenProject, Jitsi, Collabora", "Builds its own apps on open libraries: Matrix for Tchap, LiveKit for Visio, BlockNote for Docs"],
            ["Login", "Keycloak with LDAP federation; apps are OpenID Connect clients; SCIM still “planned”", "ProConnect single sign-on across all products"],
            ["Navigation", "Each app fetches a shared navigation.json from the portal", "A shared “La Gaufre” services button, as an npm package"],
            ["Licence", "openDesk code Apache-2.0; components keep AGPL, GPL, LGPL, MPL or MIT", "MIT"],
            ["Scale", "About 100,000 workplaces since October 2024 (ZenDiS, July 2026)", "500,000+ agents a month across 15 ministries; Tchap used by 600,000"],
          ],
          note: "Sources: [openDesk docs](https://docs.opendesk.eu/operations/introduction); [openDesk architecture](https://docs.opendesk.eu/operations/architecture); [Deutsche Rentenversicherung](https://www.deutsche-rentenversicherung.de/Bund/DE/Presse/Pressemitteilungen/pressemitteilungen_aktuell/2026/2026-07-21-ckki-zendis-opendesk.html); [La Suite](https://lasuite.numerique.gouv.fr/en); [La Suite integration guide](https://integration.lasuite.numerique.gouv.fr/guides/getting-started).",
        },
        {
          type: "p",
          text: "openDesk's documentation is candid about its limits. Its browser-side Intercom Service lets one app call another's API after a silent login, but “currently, only OX AppSuite and Element are using the frontend-based integration”. Group sync is uneven: no app supports nested groups, Nextcloud syncs twice a day, XWiki nightly and OpenProject hourly. Integrations built so far are a file picker, shared contacts, a portal newsfeed and OpenProject storing files in Nextcloud ([openDesk architecture](https://docs.opendesk.eu/operations/architecture)). Licences for more than 200,000 workplaces have reportedly been sold, demand outran what ZenDiS could serve, and it launched a partner programme in September 2026 ([Borncity](https://borncity.com/news/opendesk-mehr-als-200-000-verkaufte-lizenzen-zwingen-zendis-zum-umbau/)). It releases a minor version monthly; version 1.18 (19 August 2026) added shared mailboxes ([Never Code Alone](https://nevercodealone.de/glossare/nca-glossar-open-source-projekte/opendesk-souveraene-office-suite-2026)).",
        },
        {
          type: "p",
          text: "La Suite runs with a team of about 80, including 25 developers, and 2026 funding of €8M from DINUM plus €3M from co-funding ministries, according to a March 2026 conference talk; its stated 2026 priority is “more interoperability between the products”, including Docs and Fichiers as tools for the state's AI assistant ([Journées Mathrice talk](https://indico.math.cnrs.fr/event/15889/contributions/15215/attachments/6380/11212/2026-03-11-journees-mathrice-la-suite-DINUM.pdf)). Its Docs editor has 17,003 stars and was reused by Germany inside openDesk ([suitenumerique/docs](https://github.com/suitenumerique/docs); [suitenumerique/meet](https://github.com/suitenumerique/meet)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: one login is quick, one data model is not",
          text: "Both projects converged on the same minimum contract: one identity provider speaking OpenID Connect, one navigation source every app renders, and a thin way for apps to call each other as the signed-in user. After two years, openDesk still has only two apps on its front-end integration and SCIM pending. That supports native modules on shared records for the core departments, with bundled apps reserved for commodity functions such as files, office editing, chat and video. Our [hub embedding report](/research/embed-stream-integrate-specialist-software) covers the integration patterns in detail.",
        },
      ],
    },
  ],
  method: [
    "Repository facts (stars, licence identifier, last push, latest release and date) were read from the GitHub API, release feeds and raw licence files on 22 November 2026; prices were read from vendor pricing pages the same day.",
    "Funding figures for AI-native finance vendors come from aggregators, not company releases. Items read only through a search summary are marked “reported”.",
    "Not verified this session: pricing for SAP, Oracle NetSuite, Brex, ClearTax, BambooHR, Deel, Darwinbox, Zoho People, SAP Ariba, Coupa, DocuSign, Ironclad, Vanta, Drata, Jamf, Intune, ServiceNow, Jira, Monday, ClickUp, Notion and Microsoft 365 India; Tally's own price list; licences GitHub could not classify (GnuCash, LedgerSMB, Tryton, OpenSign, CISO Assistant, Wazuh, Axelor, iDempiere, Budibase, openTCS).",
    "No independent survey of Excel or WhatsApp use as business tools in India, and no Indian SME app-count or SaaS-spend data, was found.",
  ],
  faq: [
    {
      q: "What are the best open-source alternatives to SaaS for a small company?",
      a: "It depends on the function. Identity (Keycloak), chat and video (Zulip, Jitsi, LiveKit), documents (La Suite Docs, Nextcloud with Collabora), BI (Superset, Metabase) and workflow engines (Temporal, Kestra) are mature. Accounting and HR are best served by ERPNext and Frappe HR or Odoo Community. Procurement has no credible standalone open-source product; it lives inside those ERPs.",
    },
    {
      q: "Is ERPNext or Odoo Community free to use commercially?",
      a: "Yes, under their licences: ERPNext is GPL-3.0 and Odoo Community is LGPL-3.0. Odoo's Enterprise edition is a separate licence that needs a paid subscription for every user, and some apps exist only there. GPL obligations matter if you modify and distribute ERPNext's code; running it unmodified alongside your own software is the simpler route. This is not legal advice.",
    },
    {
      q: "How many SaaS apps does an average company use in 2026?",
      a: "Okta counts 98 apps behind single sign-on globally, 72 at companies under 2,000 employees and 46 at tech startups. BetterCloud's survey puts mid-market firms at 164. Zylo, which discovers apps from spend data at mostly large customers, finds an average of 305. The differences come from what each one can see.",
    },
    {
      q: "Why is AGPL a problem for commercial products?",
      a: "AGPL requires that if you modify the software and let users interact with it over a network, you offer them the modified source. Some companies, Google among them, ban AGPL code outright because a product depending on it may have to release its complete source. Running an unmodified AGPL application as a separate service is the common way to use it safely; get legal advice for your case.",
    },
    {
      q: "Is n8n open source?",
      a: "Not in the OSI sense. n8n uses the Sustainable Use License, which allows use for your own internal business purposes or for non-commercial or personal use, and its .ee files need an enterprise licence. Embedding it in a product where customers connect their own credentials needs a commercial agreement.",
    },
    {
      q: "Can AI agents run accounts payable on their own?",
      a: "Not end to end yet. The best-measured payables teams process about 49% of invoices touchlessly, and Ramp's reported 85% is accuracy on individual accounting fields, not invoices completed without a person. Agents work well for coding, matching and flagging suspect bills with a person approving the result.",
    },
    {
      q: "What accounting software do Indian SMEs use?",
      a: "Mostly GST-ready packages: TallyPrime (which claims 2.7 million+ businesses), BUSY (over 6 lakh), Vyapar (1.5 crore, including free mobile users) and Zoho Books. HR and payroll are usually a second purchase from tools such as greytHR, Keka or RazorpayX Payroll. All these figures are the vendors' own claims.",
    },
    {
      q: "What are openDesk and La Suite?",
      a: "Government-backed open-source workplace suites. Germany's openDesk bundles existing apps such as Nextcloud, Collabora, OpenProject and Jitsi behind one Keycloak login and shared navigation. France's La Suite builds its own MIT-licensed apps (Docs, Visio, Tchap, Grist and others) with one sign-in. Neither includes accounting, HR or procurement.",
    },
  ],
  platformLinks: ["factoryGraph", "agentic", "audit"],
  relatedReports: [
    "future-of-erp-crm-agentic-ai",
    "embed-stream-integrate-specialist-software",
    "d2c-marketing-tool-stack-agentic-commerce",
  ],
  blogSlugs: ["saas-sprawl-statistics-2026", "open-source-licence-risk-agpl-bsl-sspl"],
};
