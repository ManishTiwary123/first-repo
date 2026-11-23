/**
 * Spoke posts of the research report
 * /research/back-office-software-open-source-alternatives.
 * Facts checked on 2026-11-22; every figure links to its source.
 */
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

const REPORT = "/research/back-office-software-open-source-alternatives";

export const BACK_OFFICE_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "saas-sprawl-statistics-2026",
    title: "SaaS Sprawl Statistics 2026: How Many Apps Companies Really Run",
    subtitle:
      "Okta says 72, BetterCloud says 164, Zylo says 305. All three are right about different things. Here is what each number measures, what sprawl costs, and a one-afternoon audit you can run this week.",
    excerpt:
      "Three respected sources count company SaaS apps at 72, 164 and 305. Why they differ, what sprawl really costs in licences, renewals and security, and how to audit yours.",
    category: "ops",
    readTime: 9,
    publishedAt: RESEARCH_PUBLISHED,
    featured: false,
    popularityScore: 74,
    author: RESEARCH_AUTHOR,
    heroSketch: "auditLens",
    tags: ["saas", "it operations", "cost control", "research"],
    keywords: {
      primary: "SaaS sprawl statistics",
      secondary: [
        "how many SaaS apps does a company use",
        "SaaS licence waste",
        "SaaS management 2026",
        "shadow IT AI apps",
      ],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    relatedSlugs: [
      "open-source-licence-risk-agpl-bsl-sspl",
      "ai-support-agent-pricing-per-resolution",
      "procurement-automation-requisition-to-receipt",
    ],
    crossPageLinks: [
      { href: REPORT, label: "Back-office software map", note: "the full research report, department by department" },
      { href: "/factory-graph", label: "Factory Graph", note: "one governed layer over the systems you already run" },
      { href: "/industrial-systems-audit", label: "Industrial systems audit", note: "map your systems and the hand-offs between them" },
    ],
    faq: [
      {
        question: "How many SaaS apps does the average company use in 2026?",
        answer:
          "It depends on the source. Okta counts 98 apps behind single sign-on on average, 72 at companies under 2,000 employees. BetterCloud's survey puts mid-market organisations at 164. Zylo, which finds apps from spend data at mostly large customers, reports an average of 305 and a median of 240.",
      },
      {
        question: "What percentage of SaaS licences go unused?",
        answer:
          "Zylo measured licence utilisation at 54% in 2025, up from 47% in 2024, which means roughly 46% of licences were not in use. Its news release states it differently, as 36% unused against industry-recommended utilisation levels.",
      },
      {
        question: "Why is SaaS sprawl growing again?",
        answer:
          "Mostly AI tools. BetterCloud's 2026 survey found an average of 27 AI-powered apps per organisation, 22% of the portfolio, and Zylo reports AI-native app spend up 108% in a year. Its mid-market count jumped 41% in one year after several years of consolidation.",
      },
      {
        question: "Are Zylo's dollar figures relevant to a small business?",
        answer:
          "Not directly. Zylo's averages, such as $55.7M of annual SaaS spend and $19.8M of licence waste, come from large enterprises. The safer number to compare against is its median of $9,455 per employee a year, and even that should be checked against your own spend.",
      },
      {
        question: "What is the biggest hidden cost of SaaS sprawl?",
        answer:
          "Usually not the licences. Renewal overhead, security exposure from unsanctioned apps and slow offboarding, and the manual work of moving data between apps that do not talk to each other tend to cost more. BetterCloud found 90% of organisations lack true cross-app orchestration.",
      },
    ],
    takeaways: [
      "The three headline counts (72, 164, 305) measure different things: single sign-on, a survey of IT staff, and spend discovery at large companies.",
      "Consolidation is over. App counts are rising again, driven by AI tools, and fastest in the mid-market.",
      "Licences are the visible cost; renewals, offboarding gaps and manual hand-offs between apps are the larger ones.",
      "Zylo's dollar averages are enterprise numbers. Use its per-employee median and your own card statements instead.",
      "A one-afternoon audit (sources, owners, utilisation, renewals, offboarding, AI features) finds most of the waste.",
    ],
    sections: [
      {
        heading: "Three numbers that disagree, and why all three are right",
        paragraphs: [
          "Ask how many SaaS apps a company runs and you will get three very different answers from three serious sources. Okta's Businesses at Work 2026, based on its customers' data from 1 November 2024 to 31 October 2025, counts a global average of 98 apps per company, down 3% from 101. Companies under 2,000 employees average 72, companies above that average 259, and tech startups 46 ([Okta](https://www.okta.com/ja-jp/newsroom/press-releases/okta-businesses-at-work2026/)).",
          "BetterCloud's 2026 State of SaaS, a survey of 525 IT and security professionals published on 15 July 2026, says app counts rose 11% overall and 41% in the mid-market, from 116 to 164 ([BetterCloud](https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/)). Zylo's 2026 SaaS Management Index, built from more than 40 million licences and $75B of spend under management, puts the average portfolio at 305 apps and the median at 240, flat year on year ([Zylo](https://zylo.com/news/2026-saas-management-index)). Torii lists BetterCloud's 2026 average as 118, up from 106 ([Torii](https://www.toriihq.com/saas-statistics)).",
          "The gap is method, not error. Okta can only see apps that are wired to single sign-on, so its number is a floor: anything a team signs up for with a card and a password is invisible to it. BetterCloud asks IT people, who report what they know about. Zylo discovers apps from spend and expense data at mostly large customers, so it catches shadow purchases and skews high.",
        ],
        callout: {
          title: "The defensible SME range",
          body:
            "For a small or mid-sized company, Okta's startup and sub-2,000 figures (roughly 45 to 75 managed apps) are the most defensible starting point, with more unmanaged apps on top. No source found in our research gives app counts or SaaS spend for Indian SMEs specifically.",
        },
      },
      {
        heading: "Consolidation ended in 2025, and AI apps are why",
        paragraphs: [
          "For a few years the count fell. BetterCloud's own series peaked at 130 apps in 2022, dropped to 112 in 2023 and 106 in the 2025 report (as summarised from BetterCloud's pages) ([BetterCloud 2025](https://www.bettercloud.com/monitor/2025-state-of-saas-trends/)). The 2026 survey reverses that, and the reason is visible in the detail: an average of 27 AI-powered apps per organisation, 22% of the portfolio, and only 56% of apps in use with IT approval.",
          "Zylo's numbers say the same thing in money. AI-native app spend rose 108% overall and 393% at organisations above 10,000 employees; the average organisation spends $1.2M a year on AI-native apps and holds 7 generative-AI apps; 78% of IT leaders had unexpected consumption or AI charges; 61% cut projects because of unplanned SaaS cost increases; and 77% found AI features or apps running without IT's knowledge ([Zylo](https://zylo.com/blog/saas-statistics)).",
          "Two other Zylo figures explain why IT cannot simply say no. Business units control 81% of SaaS spend, while IT directly manages 15%, and expensed SaaS rose from 1% to 3.7% of spend. Large enterprises add 21 applications a month ([Zylo](https://zylo.com/news/2026-saas-management-index)).",
        ],
      },
      {
        heading: "What sprawl actually costs: four bills, not one",
        paragraphs: [
          "Licence waste is the bill everyone talks about. Zylo measured utilisation at 54% in 2025, up from 47%, and puts waste at $19.8M a year for the average organisation it tracks, down from $20.9M ([Zylo](https://zylo.com/blog/saas-statistics)). It is real, but in our view it is the smallest of four costs.",
        ],
        bullets: [
          "Unused seats: roughly 46% of licences not in use by Zylo's utilisation figure, or 36% against “industry-recommended utilization levels” in its own release.",
          "Renewal overhead: 211 renewals a year at the average Zylo customer, and 79% of IT leaders saw a price increase at renewal.",
          "Security exposure: only one in four organisations automates offboarding, and 18% had a breach caused by an offboarded user who still had access ([BetterCloud](https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/)). Security and governance is now the top SaaS challenge for 47% of respondents, up from 28%.",
          "Missing orchestration: 90% lack true cross-app orchestration, and 62% of IT leaders say manual work blocks strategic projects. That is people retyping the same customer, order or employee between apps.",
        ],
        callout: {
          title: "Pricing is moving to metering",
          body:
            "On top of seats, agent features are increasingly metered: Asana caps AI Teammates at 5 requests per user a month before charging per request, and Mattermost's free commercial mode caps agent queries at 250 a month. A tool count that holds steady can still produce a rising, less predictable bill.",
        },
      },
      {
        heading: "Why the enterprise averages do not fit an SME",
        paragraphs: [
          "Zylo's average organisation spends $55.7M a year on SaaS (median $20.6M). Those are large-enterprise figures and should not be quoted to a 60-person manufacturer. The more portable number is Zylo's median spend per employee, $9,455 a year ([Zylo benchmarks](https://zylo.com/benchmarks)), and even that should be checked against your own statements.",
          "In India the list prices are lower and the shape is different. Google Workspace Starter is ₹270 per user a month and Slack Pro ₹245.25 on yearly billing ([Google Workspace India](https://workspace.google.com/intl/en_in/pricing.html); [Slack India](https://slack.com/intl/en-in/pricing)). As an illustration only: a 50-person company on just those two tools pays about ₹25,762 a month before GST, before it has bought any accounting, HR, CRM or design software. Each additional tool adds its own login, its own copy of the employee list and its own renewal date.",
          "The point for an SME is not that it runs 300 apps. It is that each app it adds creates another place where the same customer, order or person is stored, and another hand-off someone has to do by hand. Our [back-office software map](/research/back-office-software-open-source-alternatives) lays out which department each tool belongs to.",
        ],
      },
      {
        heading: "A one-afternoon SaaS audit checklist",
        paragraphs: [
          "This checklist is ours, not from any of the reports above. It is designed so one person with access to the card statements and the admin consoles can finish it in an afternoon.",
        ],
        bullets: [
          "List every app from three sources, not one: the single sign-on console, company card and expense statements, and a short message to each team lead asking what they use. Okta-style lists miss card purchases; card statements miss free tools.",
          "Name one owner per app, and the department it serves. An app with no owner is the first candidate to cancel.",
          "Record seats bought against seats used in the last 30 days. Anything below roughly half is worth a conversation before the next renewal.",
          "Put every renewal date in one calendar with a reminder 60 days ahead, because price increases are announced at renewal.",
          "Check offboarding: pick the last three people who left and confirm their access is gone from every app on the list.",
          "Mark every app that has switched on AI features or agents, what data they can read, and whether usage is metered.",
          "Find duplicates by function: two chat tools, three places that store customer records, two ways to sign documents.",
          "For each duplicate, decide which one is the record and which one only reads from it.",
        ],
      },
      {
        heading: "Where consolidation actually helps",
        paragraphs: [
          "Cutting apps is not the goal in itself. The sprawl costs that matter most (renewals, offboarding and hand-offs) are addressed by three things: one login, one directory of people, and shared records that several departments read from instead of copying. Germany's openDesk and France's La Suite show the first two can be built from open-source parts, and also that sharing data between apps is the slow, hard part ([openDesk architecture](https://docs.opendesk.eu/operations/architecture)).",
          "For a manufacturer, the shared records are the ones that cross departments: the order, the part revision, the work order, the inspection lot, the invoice. That is the starting point of our [Factory Graph](/factory-graph) work: relate those records across the systems you already run, without replacing them. If you want to see where your own stack stands, an [industrial systems audit](/industrial-systems-audit) maps the systems and the hand-offs between them. And before you swap a paid tool for an open-source one, read our guide to [open-source licence risk](/blogs/open-source-licence-risk-agpl-bsl-sspl): several popular “open” tools restrict exactly the use you have in mind.",
        ],
        pullQuote:
          "Sprawl is not a count. It is the number of places the same customer is stored, and the number of people retyping it.",
      },
    ],
  },
  // ------------------------------------------------------------------------
  {
    slug: "open-source-licence-risk-agpl-bsl-sspl",
    title: "AGPL, BSL, SSPL and Fair-Code: Open-Source Licence Risk Explained",
    subtitle:
      "Some “open source” tools cannot be embedded in a product, some cannot be hosted for others, and some changed their licence last year. A plain guide to the four tiers, with the 2024–2026 cases that matter.",
    excerpt:
      "Permissive, copyleft, AGPL and source-available licences carry very different obligations. What each tier allows, which popular tools changed terms, and how to hold each one.",
    category: "ops",
    readTime: 10,
    publishedAt: RESEARCH_PUBLISHED,
    featured: false,
    popularityScore: 70,
    author: RESEARCH_AUTHOR,
    heroSketch: "layerStack",
    tags: ["open source", "licensing", "software risk", "research"],
    keywords: {
      primary: "AGPL vs BSL licence risk",
      secondary: [
        "is n8n open source",
        "SSPL open source",
        "fair-code licence",
        "AGPL commercial use",
        "business source license explained",
      ],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    relatedSlugs: [
      "saas-sprawl-statistics-2026",
      "agentic-commerce-ucp-acp-explained",
      "ai-support-agent-pricing-per-resolution",
    ],
    crossPageLinks: [
      { href: REPORT, label: "Back-office software map", note: "the most credible open-source option per function, with its licence" },
      { href: "/research/d2c-marketing-tool-stack-agentic-commerce", label: "D2C tool stack research", note: "open source for commerce and marketing, and its gaps" },
      { href: "/services", label: "Our services", note: "custom software built around the tools you choose" },
    ],
    faq: [
      {
        question: "Can I use AGPL software in a commercial product?",
        answer:
          "Often, but with care. If you modify AGPL software and let users interact with it over a network, you must offer them the modified source. Running an unmodified AGPL application as a separate service beside your own code is the common way to use it. Some companies, Google among them, ban AGPL code entirely. Get legal advice for your situation.",
      },
      {
        question: "Is n8n open source?",
        answer:
          "Not under the OSI definition. n8n uses the Sustainable Use License, which allows use only for your own internal business purposes or for non-commercial or personal use, and its .ee files need an n8n Enterprise License. Embedding it in a product where customers connect their own credentials needs a paid agreement.",
      },
      {
        question: "Is the SSPL an open-source licence?",
        answer:
          "No. The Open Source Initiative said on 19 January 2021 that the SSPL is not an open source licence, because it restricts the field of endeavour (offering the software as a service), which the Open Source Definition does not allow.",
      },
      {
        question: "What is a Business Source License (BSL)?",
        answer:
          "A source-available licence that limits production use for a period and then converts to an open-source licence. Akaunting's version caps production use at two users, one company or 1,000 invoices and converts each release to GPLv3 after four years; EMQX and ThingsBoard adopted BSL 1.1 in 2025 and 2026.",
      },
      {
        question: "How do I protect a product from licence changes upstream?",
        answer:
          "Record each dependency's licence pinned to the version you use, recheck it at every upgrade, prefer foundation-governed or permissively licensed projects for anything you embed, and check whether the features you need sit in a separately licensed enterprise directory. This is a practical policy, not legal advice.",
      },
    ],
    takeaways: [
      "There are four practical tiers: permissive, weak copyleft, GPL/AGPL, and source-available or fair-code.",
      "AGPL is usually safe as an unmodified, separate service and risky once modified and offered to others over a network.",
      "Source-available licences (Sustainable Use, Elastic, BSL, vendor agreements) forbid specific commercial uses, often the exact one a product needs.",
      "Licences move: tldraw, Zitadel, NocoDB, NocoBase, Camunda, Cal.com, EMQX and ThingsBoard all changed terms between 2024 and 2026.",
      "Open-core projects keep SSO, audit logs and fine-grained roles in an enterprise directory under a separate licence.",
    ],
    sections: [
      {
        heading: "One question decides the tier: what are you going to do with it?",
        paragraphs: [
          "Licence risk depends less on the licence's name than on what you plan to do: use the software internally, run it as a separate service beside your product, link it into your own code, modify it, or host it for other companies. The same licence can be harmless for one of these and a serious problem for another.",
          "Across the projects in our [back-office software map](/research/back-office-software-open-source-alternatives), licences fall into four practical tiers. Permissive licences (MIT, Apache-2.0, BSD) let you embed, modify and white-label. Weak copyleft (LGPL, MPL, EPL) lets you link or call freely but asks you to publish changes to the library itself. Strong copyleft (GPL, AGPL) is best kept at arm's length as a separate, unmodified program. Source-available and fair-code licences forbid specific commercial uses outright. What follows is a plain reading of public licence texts and policies, not legal advice.",
        ],
      },
      {
        heading: "Permissive and weak copyleft: the easy tiers",
        paragraphs: [
          "Most of the shared infrastructure a business needs exists under permissive terms: Keycloak for identity, Zulip for chat, Jitsi and LiveKit for video, Grist for spreadsheet-databases, Superset for BI, Temporal for durable workflows and Docling for document parsing ([Keycloak](https://github.com/keycloak/keycloak); [Temporal](https://github.com/temporalio/temporal); [Docling](https://github.com/docling-project/docling)). These can be built into a product and branded as part of it, with attribution.",
          "Weak copyleft adds one obligation: share changes to the library itself. Odoo Community is LGPL-3.0, Collabora Online and Penpot are MPL-2.0, and OpenBoxes is EPL-1.0. Germany's openDesk shows how far this tier stretches: openDesk's own code is Apache-2.0 while its components keep their own AGPL, GPL, LGPL, MPL or MIT licences, run side by side ([openDesk](https://docs.opendesk.eu/operations/introduction)).",
          "Even the easy tiers hide two traps. The first is the edition split: Odoo Community is LGPL, but Odoo Enterprise “can only be used (executed, modified, executed after modifications) with a valid Odoo Enterprise Subscription” for the right number of users, so a feature that exists only in Enterprise is commercial software whatever the repository says ([Odoo licences](https://www.odoo.com/documentation/19.0/legal/licenses.html)). The second is a free tier with the useful parts removed. Mattermost's Team Edition is MIT, but for fewer than 250 users and without single sign-on, and its free commercial mode caps viewable history at 10,000 messages and agent queries at 250 a month ([Mattermost](https://docs.mattermost.com/product-overview/editions-and-offerings.html)). A permissive licence on a stripped edition is still a stripped edition.",
        ],
      },
      {
        heading: "GPL and AGPL: run it beside you, not inside you",
        paragraphs: [
          "Many of the strongest business applications are GPL or AGPL: ERPNext, Frappe HR and OpenProject are GPL-3.0; Plane, Nextcloud, Documenso, DocuSeal, Lago, Zammad and Metabase's core are AGPL. The Free Software Foundation's reasoning on what counts as one program is the key. It treats “pipes, sockets and command-line arguments” as communication mechanisms normally used between two separate programs, while programs designed to run linked together in a shared address space are almost surely one program, and it says the analysis “is unchanged by the involvement of containers” ([GNU GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html)).",
          "AGPL adds a network clause: a modified version must offer all users interacting with it over a network an opportunity to receive the source. That is why some buyers refuse it entirely. Google's policy says AGPL code “MUST NOT be used at Google”, because a product depending on it may have to release its complete source and the obligation is triggered if the product “can be accessed over a remote network interface” ([Google](https://opensource.google/documentation/reference/using/agpl-policy)).",
        ],
        bullets: [
          "Using an AGPL tool internally, unmodified: generally low risk. The network clause bites when you modify the software and other people use it over a network.",
          "Running it unmodified as a separate service beside your product: the common pattern, consistent with the FSF's view of separate programs talking over sockets.",
          "Modifying it and offering the result to customers: the modified source must be offered to those users.",
          "Selling to an enterprise whose policy bans AGPL: the licence analysis no longer matters; you need a different component.",
        ],
        callout: {
          title: "The common safe pattern",
          body:
            "Run the AGPL application unmodified, as its own service, behind your login, and talk to it over its API. If you must change it, publish those changes. If an enterprise customer bans AGPL, you need a different component, whatever the legal analysis says.",
        },
      },
      {
        heading: "Source-available and fair-code: the tier that looks open",
        paragraphs: [
          "This is where most surprises happen, because the code is on GitHub and the project calls itself open. The licence says otherwise.",
        ],
        bullets: [
          "n8n's Sustainable Use License allows use “only for your own internal business purposes or for non-commercial or personal use”, and files with .ee need an enterprise licence ([n8n](https://github.com/n8n-io/n8n)). NocoDB adopted the same licence; its licence file is dated 29 January 2026 ([NocoDB](https://github.com/nocodb/nocodb)).",
          "Akaunting's Business Source License limits production use to two users, one company or 1,000 invoices, bans white-labelling and bans offering it as an “Accounting Service”; each release converts to GPLv3 after four years ([Akaunting](https://github.com/akaunting/akaunting)).",
          "Outline's Business Source License 1.1 bans using it for a “Document Service” offered to third parties ([Outline](https://github.com/outline/outline)). Invoice Ninja and Airbyte are under the Elastic License 2.0.",
          "Camunda 8, from version 8.6 (8 October 2024), is free for development and testing only; production needs a licence ([Camunda](https://camunda.com/blog/2024/04/licensing-update-camunda-8-self-managed/)). Operaton is the community-owned Apache-2.0 engine built on Camunda 7.",
          "Pimcore moved to its own Pimcore Open Core License from Platform 2025.1, and Directus uses a licence that allows any purpose except a “Competing Use” ([Pimcore](https://pimcore.com/en/resources/blog/breaking-free-pimcore-says-goodbye-to-gpl-and-enters-a-new-era-with-pocl); [Directus](https://github.com/directus/directus)).",
          "The SSPL “is not an open source license”, according to the Open Source Initiative, because it restricts the field of endeavour (offering the software as a service) ([OSI](https://opensource.org/blog/the-sspl-is-not-an-open-source-license)).",
        ],
      },
      {
        heading: "Licences move: the drift of 2024 to 2026",
        paragraphs: [
          "Choosing a licence once is not enough, because projects change them. Since SDK 4.0 in September 2025, tldraw “requires a license key to work in production”; without one it stops rendering after five seconds, and “internal products at companies is considered commercial use”; earlier versions were Apache-2.0 ([tldraw](https://tldraw.dev/sdk-features/license-key)). Zitadel moved from Apache-2.0 to AGPL-3.0 with version 3, effective 31 March 2025 ([Zitadel](https://zitadel.com/blog/apache-to-agpl)). Cal.com's open repository is now Cal.diy, MIT-licensed but with teams, organisations, workflows and SSO removed ([Cal.diy](https://github.com/calcom/cal.diy)). NocoBase put version 3 onward under its own licence agreement, updated 16 November 2026 ([NocoBase](https://github.com/nocobase/nocobase)).",
          "Industrial software moved the same way. EMQX adopted the Business Source License 1.1 from version 5.9.0, with free production use limited to a single node and excluding hosted or embedded offerings, and ThingsBoard followed from version 4.4.0; both convert to Apache-2.0 four years after each release ([EMQX licence](https://raw.githubusercontent.com/emqx/emqx/HEAD/LICENSE); [ThingsBoard licence](https://raw.githubusercontent.com/thingsboard/thingsboard/HEAD/LICENSE)). The United Manufacturing Hub went the other way, relicensing from AGPL-3.0 to Apache-2.0 and citing exactly this trend ([UMH](https://www.umh.app/insight/united-manufacturing-hub-relicensed-to-apache-2-0)).",
        ],
        pullQuote: "The licence you checked at adoption is not the licence you will upgrade to.",
      },
      {
        heading: "How to hold each tier: a practical policy",
        paragraphs: [
          "The policy below is our suggested practice, not a legal opinion. It is written for a company that builds or buys software around open-source components, and it is meant to make licence changes visible before they become a problem.",
        ],
        bullets: [
          "Keep a register: every dependency, its licence and the exact version you run. Recheck it at every upgrade, not once a year.",
          "Embed only permissive or weak-copyleft components into your own code. Publish any changes you make to weak-copyleft libraries.",
          "Run GPL and AGPL applications as separate, unmodified services that you call over their APIs. Decide in advance what you will do if a customer bans AGPL.",
          "Treat source-available and fair-code tools as commercial software: read the licence, and buy the commercial licence before hosting or embedding them for anyone else.",
          "Check the enterprise directory. In authentik, Fleet, Infisical, Rocket.Chat, Metabase, Windmill and Twenty, an ee/ or enterprise directory is under a separate licence, and the features a business needs (SSO, audit logs, fine-grained roles) are often in it.",
          "Prefer foundation-governed or community-owned projects, such as Apache projects or Operaton, for anything that would be costly to replace.",
        ],
        callout: {
          title: "Where to go next",
          body:
            "Our back-office report lists the most credible open-source option for each department with its licence, and our D2C research does the same for commerce and marketing. If you are choosing components for a custom build, that choice is part of how we scope work with you.",
        },
      },
    ],
  },
];
