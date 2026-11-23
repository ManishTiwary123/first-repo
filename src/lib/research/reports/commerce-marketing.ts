import type { ResearchReport } from "../types";

/**
 * Research report: the commerce, creative and go-to-market tool stack of a
 * D2C or e-commerce brand, agentic commerce, and AI agents for brands.
 * Facts checked on 2026-11-22. List prices read from vendor pages that day
 * unless another date is given in the text.
 */
export const COMMERCE_MARKETING_REPORT: ResearchReport = {
  slug: "d2c-marketing-tool-stack-agentic-commerce",
  shortTitle: "D2C stack and agentic commerce",
  title: "D2C Tool Stack 2026: MCP, Agentic Commerce and Open Source",
  h1: ["The D2C tool stack,", "and what AI agents changed in it."],
  description:
    "The tools a D2C brand runs from design to support, their 2026 prices, which expose MCP, what agentic commerce asks of a store, and where open source is ready.",
  eyebrow: "Research · Commerce and marketing",
  lead:
    "A direct-to-consumer brand runs a dozen or more products per department: design, content, storefront, catalogue, marketing automation, ads, SEO, CRM, support and analytics. The same product record is retyped or synced at nearly every step. This report lists what those tools cost on 22 November 2026, which ones an outside system or AI agent can now drive, what “agentic commerce” turned into after in-chat checkout stalled, what AI agents already do for brands with real numbers and failures, and where open source is good enough to run in production.",
  primaryKeyword: "D2C tech stack",
  keywords: [
    "ecommerce tool stack India",
    "agentic commerce",
    "Universal Commerce Protocol UCP",
    "Agentic Commerce Protocol ACP",
    "AI customer support agent pricing",
    "Shopify MCP",
    "open source ecommerce platform",
    "marketing SaaS stack",
    "WhatsApp Business API pricing India",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 25,
  keyFindings: [
    {
      value: "305",
      label: "SaaS apps managed by the average organisation in Zylo's 2026 index; marketing alone averages about 103 apps.",
      source: { label: "Zylo 2026 SaaS Management Index", url: "https://zylo.com/reports/2026-smi/" },
    },
    {
      value: "3× lower",
      label: "Conversion for items Walmart sold inside the chatbot than for those that clicked out to its own site.",
      source: { label: "Modern Retail", url: "https://www.modernretail.co/technology/what-went-wrong-with-chatgpts-instant-checkout/" },
    },
    {
      value: "$0.99",
      label: "Intercom's price per Fin AI Agent “outcome”, the clearest example of support agents priced by result.",
      source: { label: "Intercom pricing", url: "https://www.intercom.com/pricing" },
    },
    {
      value: "58%",
      label: "Lower click-through for the top-ranking page where an AI Overview appears (Ahrefs, 300,000 keywords). A correlation.",
      source: { label: "Ahrefs", url: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/" },
    },
  ],
  summary: [
    "Survey data puts the average organisation at about 305 SaaS apps and marketing at about 103, but those numbers come from large companies. A small Indian D2C brand typically runs around ten paid tools: Shopify, a payment gateway, an order-management layer, Shiprocket, a WhatsApp provider, email and accounts.",
    "By late 2026 almost every major vendor in this area exposes an MCP server, so an outside system can drive Figma, Canva, Shopify, HubSpot, Salesforce, Klaviyo, Ahrefs and Mixpanel without embedding their screens. MCP access is metered and can become paid.",
    "Buying inside the chat did not take off. OpenAI scaled back Instant Checkout in March 2026 and now sends shoppers to the merchant's own checkout; AI assistants became a discovery channel fed by product feeds.",
    "The lasting result is a set of open standards (UCP, ACP, AP2) that expect a brand to publish a clean catalogue, live price and stock, a checkout agents can call, and order status, while staying the merchant of record.",
    "Customer support is the one function where agents work end to end at scale, priced at roughly $0.85 to $2.00 per resolved conversation. AI sales outreach and fully automatic advertising are weaker, and Klarna, 11x and in-chat checkout all show what happens when the person is removed entirely.",
    "Open source is production-grade for design collaboration, headless commerce, CMS, email, social scheduling, CRM, helpdesk, payments orchestration and analytics, and thin for browser photo editing, packaging dielines, ad buying, SEO data, loyalty and India marketplace order management.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "d2c-stack",
      kicker: "The D2C stack",
      title: "What does a D2C brand's tool stack look like, and how many SaaS tools do companies run?",
      answer:
        "Surveys put the average organisation at about 305 SaaS applications and marketing alone at about 103, though those figures come from large companies. In India the common D2C chain is Shopify, an Indian payment gateway, an order-management layer (Unicommerce, EasyEcom or Vinculum), Shiprocket for shipping and a WhatsApp provider, with work moving between them through connectors, feeds and, increasingly in 2026, MCP servers.",
      blocks: [
        {
          type: "p",
          text: "Zylo's 2026 index finds an average of 305 SaaS applications per organisation (median 240), average annual SaaS spend of $55.7M and a count that was flat year on year ([Zylo](https://zylo.com/reports/2026-smi/)). Licence utilisation rose from 47% to 54%, and generative AI now averages 7 redundant apps per company. Marketing organisations average 103 marketing apps, and 64% of marketing leaders struggle to track all the tools in their stack ([Zylo statistics](https://zylo.com/blog/saas-statistics)).",
        },
        {
          type: "p",
          text: "The 2026 marketing technology landscape counts 15,505 products, up just 0.79% from 15,384: the flattest year on record, with 1,488 added and 1,367 removed. E-commerce platforms and carts grew 19.9% and CMS and web experience management 21.4%, and the author describes AI agents as a “third audience” for websites beside humans and search crawlers ([chiefmartec](https://chiefmartec.com/2026-marketing-technology-landscape/)). In a December 2025 survey, 90.3% of marketing and martech leaders said they use AI agents somewhere in their stack and 80.6% keep them in assist-only, human-in-the-loop mode ([chiefmartec, reported](https://newsletter.chiefmartec.com/p/here-s-your-ungated-copy-of-the-state-of-martech-2026-report)).",
        },
        { type: "h3", text: "The Indian market the stack serves" },
        {
          type: "p",
          text: "IBEF puts India at nearly 290 to 300 million online shoppers in 2025, e-commerce at US$125 billion in 2024 projected to US$345 billion by 2030, quick commerce at US$7 to 8 billion in FY25, and Tier-2 and smaller cities at about 65% of new online shoppers ([IBEF](https://www.ibef.org/industry/ecommerce)). ONDC had over 344.5 million recorded orders and 7.7 lakh+ sellers and service providers as of November 2025. A trade report says it passed 500 million cumulative transactions in July 2026 ([Cross-Border Magazine, reported](https://cross-border-magazine.com/ondc-500-million-transactions-india/)), while 2025 reporting described retail orders contracting after incentive caps were cut ([Business Standard, reported](https://www.business-standard.com/companies/news/ondc-ecommerce-failure-struggles-india-125050501101_1.html)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Do not quote IBEF's D2C market size",
          text: "The same IBEF page gives two D2C figures that contradict each other: about US$100 billion in 2025, and US$60 billion by 2030. We do not repeat either as the size of the Indian D2C market.",
        },
        {
          type: "table",
          caption: "An Indian D2C stack, layer by layer",
          columns: ["Layer", "Common choices", "What the vendor states"],
          rows: [
            ["Storefront", "Shopify", "Basic ₹1,994, Grow ₹7,447, Advanced ₹30,164 a month; Plus from ₹1,75,000 ([Shopify India](https://www.shopify.com/in/pricing))"],
            ["Orders, warehouse, inventory", "Unicommerce, EasyEcom, Vinculum", "Unicommerce: 290+ integrations, 8,000+ live clients ([Unicommerce](https://unicommerce.com/)); EasyEcom: 455+ connectors, 1,800+ brands and 3PLs ([EasyEcom](https://www.easyecom.io/)); Vinculum: 150+ channels, 20M+ orders a month ([Vinculum](https://www.vinculumgroup.com/))"],
            ["Shipping", "Shiprocket with BlueDart, Delhivery and others behind it", "4 lakh+ sellers, 42+ courier partners, 5 lakh+ transactions a day; now also checkout, WhatsApp marketing and ONDC listing ([Shiprocket](https://www.shiprocket.in/))"],
            ["WhatsApp", "Interakt, WATI", "Interakt ₹2,799 or ₹3,799 a month plus per-template charges ([Interakt](https://www.interakt.shop/pricing/)); WATI ₹2,699 to ₹16,799 a month, quarterly ([WATI](https://www.wati.io/pricing/))"],
            ["Marketing automation", "Klaviyo, WebEngage", "Klaviyo free to 250 profiles; Email from $20 a month ([Klaviyo](https://www.klaviyo.com/pricing))"],
            ["Payments, reporting, accounts", "Razorpay, PayU or Cashfree; Looker Studio; Tally or Odoo", "Named in one services firm's survey of 50 brands ([Braincuber](https://www.braincuber.com/blog/indian-d2c-tech-stack-2026-what-50-brands-actually-use))"],
          ],
          note: "The Braincuber description comes from an Odoo and Shopify services firm and should be read as its opinion. It puts cash on delivery at 40 to 60% of orders, estimates the tools at $660 to $1,320 a month for a brand at $120K monthly revenue, and cites a 4-hour Zapier outage that left $9,960 of orders unsynced.",
        },
        { type: "h3", text: "WhatsApp costs changed four times in 2026" },
        {
          type: "list",
          items: [
            "WhatsApp is priced per delivered message since 1 July 2025, and India marketing rates rose on 1 January 2026 ([Meta](https://developers.facebook.com/docs/whatsapp/pricing)).",
            "A “Meta Business Agent” message category was added on 1 July 2026 at $2.00 per million tokens, about 4 to 5 US cents a message.",
            "From 1 October 2026 each number gets 1,000 free service messages a month; service messages beyond that, and utility messages inside an open service window, became chargeable.",
            "Indian accounts must bill in INR by 31 December 2026 or delivery stops on 1 January 2027.",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the survey numbers show direction, not a small brand's starting point",
          text: "The 305-app average comes from Zylo's large customers; a small Indian D2C brand runs closer to ten paid tools. The pain is not the count but the joins. Unicommerce lists 290+ connectors and EasyEcom 455+, because every pair of tools needs one, and Zapier-style glue fails silently when it fails. Our [SaaS sprawl post](/blogs/saas-sprawl-statistics-2026) looks at what those counts cost.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "prices-by-department",
      kicker: "Prices by department",
      title: "Dominant commercial tools and list prices, department by department",
      answer:
        "List prices read on 22 November 2026 range from free tiers (Affinity, Buffer, Klaviyo to 250 profiles, Mixpanel to 1M events) to enterprise tiers in the thousands of dollars a month (HubSpot Marketing Enterprise at $3,600). The pattern across every department is the same: each vendor now bundles an AI assistant or agent, and prices it by credits, outcomes or seats on top of the base plan.",
      blocks: [
        {
          type: "table",
          caption: "Commercial tools and list prices, 22 November 2026",
          columns: ["Department", "Tool", "Position and price as published"],
          rows: [
            ["Design", "[Adobe Creative Cloud (India)](https://www.adobe.com/in/creativecloud/plans.html)", "Creative Cloud Pro ₹2,714 a month regular for individuals incl. GST; Photoshop or Illustrator alone ₹733.96; Firefly Standard ₹797.68 for 2,000 credits"],
            ["Design", "[Figma](https://www.figma.com/pricing/)", "Professional Full seat $16, Dev $12, Collab $3 a month; Organization Full $55; Enterprise Full $90; Full seats get 3,000 to 4,250 AI credits a month"],
            ["Design", "[Affinity (Canva)](https://www.affinity.studio/)", "“Free for individuals”; Canva AI tools inside need a Canva premium plan"],
            ["Design", "[Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs)", "Research preview since 17 April 2026, in Claude Pro, Max, Team and Enterprise plans"],
            ["Image and video", "[Runway](https://runway.com/pricing)", "Standard $12, Pro $28, Max $76 a month (yearly); 625 credits buys about 52 seconds of Gen-4.5 video"],
            ["Image and video", "[DaVinci Resolve 21](https://www.blackmagicdesign.com/products/davinciresolve)", "Free to Ultra HD 60fps; Studio a one-time $236"],
            ["3D and packaging", "[KeyShot](https://www.keyshot.com/pricing/)", "Professional $1,299, Business $1,599 a year; AI Agent in beta, paid by credits"],
            ["3D and packaging", "[Pacdora](https://www.pacdora.com/pricing); [Esko ArtiosCAD](https://www.esko.com/en/products/artioscad)", "Pacdora: 5,000+ 3D mockups, 3,000+ dieline templates, no public API on the pricing page. ArtiosCAD: desktop structural packaging CAD, no price shown"],
            ["PIM and DAM", "[Plytix](https://www.plytix.com/pricing)", "Priced by SKU count; 500 AI credits a month; Shopify and BigCommerce connections are add-ons"],
            ["CMS", "[WordPress](https://w3techs.com/technologies/details/cm-wordpress); [Sanity](https://www.sanity.io/pricing); [Framer](https://www.framer.com/pricing/)", "WordPress runs 38.5% of all websites; Sanity free to 20 seats, Growth $15 a seat; Framer Basic $10, Pro $30 a site a month"],
            ["Marketing automation", "[HubSpot Marketing Hub](https://www.hubspot.com/pricing/marketing)", "Professional $800 to $890 a month (3 seats); Enterprise $3,600 a month (5 seats); agents on credits at $0.010 each"],
            ["Social", "[Buffer](https://buffer.com/pricing)", "Free for 3 channels; Essentials $5, Team $10 per channel a month"],
            ["SEO", "[Ahrefs](https://ahrefs.com/pricing); [Semrush](https://www.semrush.com/pricing/)", "Ahrefs Lite $129 to Advanced $449 a month, Brand Radar AI from $199, MCP from Lite; Semrush $139, $199, $299 a month"],
            ["CRM and sales", "[Salesforce Sales Cloud](https://www.salesforce.com/sales/pricing/); [Clay](https://www.clay.com/pricing)", "Salesforce Starter $25, Pro $100 per user a month, higher tiers to $550; Clay Launch $185, Growth $495 a month"],
            ["Support", "[Zendesk](https://www.zendesk.com/pricing/); [Intercom](https://www.intercom.com/pricing); [Freshdesk](https://www.freshworks.com/freshdesk/pricing/)", "Zendesk Suite Team $55 per agent a month; Intercom Essential $29 list; Freshdesk Growth $19, Pro $55, Enterprise $89"],
            ["Analytics", "[Mixpanel](https://mixpanel.com/pricing/)", "Free to 1M events a month; Growth volume-priced; MCP on every plan"],
          ],
        },
        { type: "h3", text: "How work is handed from one tool to the next" },
        {
          type: "list",
          items: [
            "Design to code and decks: Claude Design imports prompts, images, office files, a codebase or a web capture, builds a design system and exports to Canva, PDF, PPTX, HTML or a hand-off bundle for Claude Code ([Anthropic](https://www.anthropic.com/news/claude-design-anthropic-labs)).",
            "Design to channel formats: the Canva MCP server lets an assistant generate and edit designs, read brand kits, resize for channels and export to PDF, PNG, JPG, PPTX and MP4 ([Canva MCP](https://www.canva.dev/docs/mcp/)).",
            "Product data to AI shopping surfaces: Shopify Catalog syndicates products to AI chats with current price and stock, and orders arrive in the admin with the AI channel recorded ([Shopify](https://www.shopify.com/news/winter-26-edition-agentic-storefronts)). Stripe's Agentic Commerce Suite takes catalogues directly or through syndicators such as Akeneo, Mirakl, Pipe17 and Rithum ([Stripe](https://stripe.com/blog/agentic-commerce-suite)).",
            "Order to support: Klaviyo now ships a helpdesk and a customer agent beside its marketing data, and Chatwoot, Zendesk, Intercom and Freshdesk each sell an AI agent on the same ticket queue ([Klaviyo](https://www.klaviyo.com/pricing); [Chatwoot](https://www.chatwoot.com/pricing)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: one product record, many copies",
          text: "In our view, the same product record (SKU, title, images, price, stock) is retyped or synced at almost every step from the design file to the listing, the ad, the order and the ticket. Vendors are widening from one department into the next (Klaviyo into support, Shiprocket into checkout and WhatsApp marketing, Shopify into AI channels): the same consolidation a connected system offers, but locked to each vendor.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "embeddable-mcp",
      kicker: "Embed, drive or exchange",
      title: "Which marketing and creative tools can an outside system embed or drive over MCP?",
      answer:
        "By late 2026 almost every major vendor exposes an MCP server, so an outside system's agents can drive Figma, Canva, Shopify, HubSpot, Salesforce, Klaviyo, Ahrefs and Mixpanel without embedding their screens. Embedding the editor itself is practical mainly with open-source browser tools (Penpot, Excalidraw, GrapesJS) and a few closed ones (Photopea by iframe, Figma view-only embeds), while Adobe has tightened its embed SDK and tldraw, Polotno and Remotion need paid licences.",
      blocks: [
        {
          type: "table",
          caption: "Design and creative tools: how they can be reached",
          columns: ["Tool", "How an outside system can use it", "Limits"],
          rows: [
            ["Figma", "Remote MCP server reads design context and writes to the canvas; Embed Kit shows files and prototypes in another app ([Figma MCP](https://developers.figma.com/docs/figma-mcp-server/))", "Canvas writes are free in beta and will become usage-priced; tool calls capped: Starter 20 a month, Professional and Organization 200 a day, Enterprise 600 a day; embeds are view and navigate"],
            ["Canva", "Remote MCP server; Connect REST APIs to create designs and export results ([Canva Connect](https://www.canva.dev/docs/connect/))", "Editing happens in Canva; no iframe-embedded editor found"],
            ["Adobe", "Photoshop, Express and Acrobat inside ChatGPT since December 2025 ([Adobe](https://news.adobe.com/news/2025/12/adobe-photoshop-express-acrobat-chatgpt?PID=101409527)); a local MCP announced at MAX on 10 November 2026 ([TechCrunch](https://techcrunch.com/2026/11/10/adobe-adds-more-ai-to-its-products-and-launches-an-mcp/))", "Adobe has not decided what the MCP exposes; the Express Embed SDK now needs business approval, existing integrations active until December 2027 ([Adobe Embed SDK](https://developer.adobe.com/express/embed-sdk/docs/guides/))"],
            ["Photopea", "Loads in an iframe configured by URL; saves back to the host's server ([Photopea API](https://www.photopea.com/api/))", "Closed product; hiding ads and branding needs a paid Distributor account"],
            ["Penpot", "Open source (MPL-2.0), self-hostable, with an MCP server that reads and edits designs ([Penpot MCP](https://penpot.app/ai/mcp-server))", "MCP labelled “New”, no GA statement"],
            ["Excalidraw; GrapesJS", "MIT npm package for React ([Excalidraw](https://github.com/excalidraw/excalidraw)); BSD web builder with a commercial Studio SDK ([GrapesJS](https://grapesjs.com/))", "Whiteboard, not brand design; Studio SDK paid tiers"],
            ["tldraw", "Infinite-canvas SDK with multiplayer", "Not open source: production needs a licence key ([tldraw pricing](https://tldraw.dev/pricing))"],
            ["Polotno; Remotion", "Canva-style editor SDK ([Polotno](https://polotno.com/sdk/pricing)); video from React code ([Remotion](https://github.com/remotion-dev/remotion))", "Polotno is commercial; Remotion is free only for individuals and companies of up to 3 employees"],
            ["ComfyUI", "GPL-3.0 self-hosted pipelines plus a hosted MCP server on cloud GPUs ([ComfyUI docs](https://docs.comfy.org/))", "Cloud pricing not stated on the docs page"],
          ],
        },
        {
          type: "table",
          caption: "Commerce, marketing, sales, support and analytics: MCP or headless interfaces",
          columns: ["Tool", "Interface", "Source"],
          rows: [
            ["Shopify", "Every store serves UCP over MCP at /api/ucp/mcp (Catalog, Cart, Checkout, Ask, Order); also Shop MCP and a Global Catalog MCP", "[Shopify](https://shopify.dev/docs/apps/build/storefront-mcp)"],
            ["WooCommerce", "Products and orders as WordPress Abilities via the MCP Adapter plugin; “developer preview”", "[WooCommerce](https://developer.woocommerce.com/docs/features/mcp/)"],
            ["Medusa; Saleor", "Medusa (MIT) ships an Agent Harness with MCP; Saleor (BSD-3-Clause) has ACP live since February 2026", "[Medusa](https://medusajs.com/); [Saleor](https://saleor.io/blog/end-to-end-agentic-commerce)"],
            ["HubSpot", "Remote MCP server generally available 13 April 2026", "[HubSpot](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)"],
            ["Salesforce", "Hosted MCP servers generally available 29 April 2026 for Enterprise Edition and above (reported)", "[Salesforce Developers](https://developer.salesforce.com/blogs/2026/04/salesforce-hosted-mcp-servers-are-now-generally-available)"],
            ["Klaviyo", "Remote or local MCP server for campaigns, flows and reporting", "[Klaviyo](https://developers.klaviyo.com/en/docs/klaviyo_mcp_server)"],
            ["Twenty; Postiz", "Twenty CRM has a native MCP server per cloud workspace; Postiz (AGPL) has API, webhooks and a hosted MCP", "[Twenty](https://twenty.com/); [Postiz](https://postiz.com/)"],
            ["PostHog; Mixpanel", "Free hosted MCP; MCP on every plan", "[PostHog](https://posthog.com/docs/model-context-protocol); [Mixpanel](https://mixpanel.com/pricing/)"],
            ["Hyperswitch", "Open-source payments orchestration with 300+ processor integrations", "[Hyperswitch](https://hyperswitch.io/)"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Embed rights can be withdrawn, and MCP is not settled",
          text: "Adobe moving its Embed SDK behind business approval and tldraw moving to licence keys show that embed rights can be taken back; open-source licences are the only ones that cannot. MCP access is metered (Figma already caps tool calls by plan). Figma co-founder Dylan Field said in October 2026 that “MCP is not a perfect standard and benefits frontier labs more” ([TechCrunch](https://techcrunch.com/2026/11/10/adobe-adds-more-ai-to-its-products-and-launches-an-mcp/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: three ways to bring a tool in",
          text: "In falling order of control: host the open-source tool and embed its screen (Penpot, Excalidraw, GrapesJS, Chatwoot, Twenty, Medusa, Postiz); leave the tool where it is and let agents drive it over MCP (Figma, Canva, Shopify, HubSpot, Klaviyo); or exchange files (ArtiosCAD, KeyShot, desktop Adobe apps until their MCP ships). Our [hub embedding report](/research/embed-stream-integrate-specialist-software) goes deeper into each pattern.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "agentic-commerce",
      kicker: "Agentic commerce",
      title: "What has agentic commerce become by late 2026?",
      answer:
        "Buying inside the chat has not taken off: OpenAI scaled back Instant Checkout in March 2026 and now sends shoppers to the merchant's own checkout, so AI assistants became a discovery and referral channel fed by structured product feeds. What lasted is a set of open standards (UCP from Google and Shopify, ACP from OpenAI and Stripe, AP2 for payment mandates) and a settled principle: the brand stays the merchant of record and keeps the checkout and the customer data.",
      blocks: [
        {
          type: "table",
          caption: "Agentic commerce timeline",
          columns: ["Date", "Event", "Source"],
          rows: [
            ["April 2025", "Amazon tests “Buy for Me”, an agent that fills in shopper details on third-party brand sites", "[TechCrunch](https://techcrunch.com/2025/04/03/amazons-new-ai-agent-will-shop-third-party-stores-for-you/)"],
            ["September 2025", "OpenAI and Stripe announce the Agentic Commerce Protocol; Etsy among the first on ChatGPT Instant Checkout", "[Stripe](https://stripe.com/blog/agentic-commerce-suite)"],
            ["9 October 2025", "Razorpay, NPCI and OpenAI launch an Agentic Payments pilot on UPI Reserve Pay and UPI Circle, with BigBasket", "[Razorpay](https://razorpay.com/newsroom/razorpay-npci-and-openai-come-together-to-launch-agentic-payments-ushering-in-ai-driven-commerce-at-national-scale/)"],
            ["25 November 2025", "Perplexity makes shopping free for US users with PayPal checkout; retailers stay merchant of record", "[Perplexity](https://www.perplexity.ai/hub/blog/shopping-that-puts-you-first)"],
            ["10–11 December 2025", "Shopify Agentic Storefronts and Catalog; Stripe Agentic Commerce Suite with Shared Payment Tokens", "[Shopify](https://www.shopify.com/news/winter-26-edition-agentic-storefronts); [Stripe](https://stripe.com/blog/agentic-commerce-suite)"],
            ["11 January 2026", "Google announces the Universal Commerce Protocol with Shopify, Etsy, Wayfair, Target and Walmart", "[TechCrunch](https://www.techcrunch.com/2026/01/11/google-announces-a-new-protocol-to-facilitate-commerce-using-ai-agents/)"],
            ["February 2026", "Mastercard demonstrates an Agent Pay purchase in India in a “controlled environment”; no partners or date", "[PaymentsJournal](https://www.paymentsjournal.com/mastercard-advances-agentic-ai-commerce-in-india/)"],
            ["March 2026", "OpenAI confirms “Instant Checkout is moving to Apps”; merchants use their own checkout", "[Digital Commerce 360](https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/)"],
            ["19 March 2026", "UCP adds Cart, Catalog and Identity Linking; Salesforce and Stripe say they will implement it", "[Google](https://blog.google/products-and-platforms/products/shopping/ucp-updates/)"],
            ["24 March 2026", "Shopify Agentic Storefronts cover ChatGPT, Copilot, AI Mode and Gemini; purchase completes on the merchant's checkout", "[Shopify](https://shopify.com/news/agentic-commerce-momentum)"],
          ],
        },
        { type: "h3", text: "Why in-chat checkout stalled" },
        {
          type: "p",
          text: "Walmart's Daniel Danker said conversion was three times lower for items sold inside the chatbot than for those that clicked out; Etsy did not see large sales volume; Instacart said only a very small share of orders start with AI agents; and retailers wanted real-time inventory, coupons, loyalty and store pickup without giving up the customer relationship ([Modern Retail](https://www.modernretail.co/technology/what-went-wrong-with-chatgpts-instant-checkout/)). Shopify's president put it simply: checkout is more than payment; it includes subscriptions, inventory, shipping and taxes ([Digital Commerce 360](https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/)).",
        },
        {
          type: "p",
          text: "Forrester notes that, per The Information, only about a dozen merchants were live on Shopify's catalogue service for non-Shopify merchants. In its December 2025 survey 23% of Gen X, 32% of Millennials and 35% of Gen Z had used ChatGPT to search for products in the past month, but completing a purchase inside an answer engine was the least-adopted use; it advises treating answer engines as one channel and keeping checkout and its data ([Forrester](https://www.forrester.com/blogs/what-it-means-that-the-leader-in-agentic-commerce-just-pulled-back/)).",
        },
        {
          type: "callout",
          tone: "finding",
          title: "The legal position of shopping agents moved",
          text: "Amazon sued Perplexity in November 2025 over the Comet browser agent; a district judge granted a preliminary injunction on 10 March 2026 ([GeekWire](https://www.geekwire.com/2026/03/10/judge-blocks-perplexitys-ai-bot-from-shopping-on-amazon-in-early-test-of-agentic-commerce/)). The Ninth Circuit later vacated it, reasoning that when a user directs the assistant, the user is accessing Amazon's computers; the case continues ([Engadget, reported](https://engadget.com/2230471/perplexity-has-successfully-overturned-amazon-injunction-on-its-ai-shopping-bot)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "India is on a separate payment track",
          text: "Card-network agent payments in India were shown only as a demonstration (Mastercard, February 2026); the live pilot ran on UPI through NPCI and Razorpay. No 2026 status of that pilot was found, nor any independent figure for the share of e-commerce orders that start in an AI assistant.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "merchant-requirements",
      kicker: "What stores must expose",
      title: "What UCP, ACP and Shopify ask a brand's systems to expose",
      answer:
        "Across ACP, UCP and Shopify's implementation the requirement list is fairly stable: a product feed with stable ids, variants, price with currency, availability and target countries; catalogue search with live price and stock; cart and checkout-session endpoints the brand controls; order status and return webhooks; identity linking for loyalty prices; and authenticated, signed requests with payment arriving as a scoped token rather than a card number.",
      blocks: [
        {
          type: "table",
          caption: "The standards, side by side",
          columns: ["Standard", "Licence and status", "What it defines"],
          rows: [
            ["ChatGPT product feed", "OpenAI commerce docs; feed currently covers the US, Canada and Mexico", "Required: item_id, title, description, url, image_url, brand, seller_name, availability, price with ISO currency, target_countries, store_country; one row per variant with a shared group_id ([OpenAI](https://developers.openai.com/commerce/llms-full.txt))"],
            ["Agentic Commerce Protocol (ACP)", "Apache-2.0; repository last pushed 18 July 2026 ([ACP](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol))", "Checkout sessions: create, update, retrieve and complete, with a Bearer key plus HMAC signature and signed order webhooks ([Medusa guide](https://docs.medusajs.com/resources/how-to-tutorials/tutorials/agentic-commerce))"],
            ["Universal Commerce Protocol (UCP)", "Apache-2.0; latest release tagged v2026-08-25 ([UCP repo](https://github.com/Universal-Commerce-Protocol/ucp))", "Catalog, Cart, Checkout, Identity Linking (OAuth 2.0) and Order (fulfilment, webhooks, returns); REST and JSON-RPC; built-in AP2, A2A and MCP ([ucp.dev](https://ucp.dev/))"],
            ["Agent Payments Protocol (AP2)", "Apache-2.0; v0.2.0 on 28 April 2026 ([AP2](https://github.com/google-agentic-commerce/AP2))", "Payment mandates backed by cryptographic proof of user consent"],
            ["Shopify UCP endpoint", "Live on every store at /api/ucp/mcp ([Shopify](https://shopify.dev/docs/apps/build/storefront-mcp))", "Every request carries an agent profile; each cart update replaces the whole cart; Checkout requests must be authenticated or signed"],
          ],
        },
        {
          type: "p",
          text: "Medusa's guide notes that ChatGPT “currently supports only Stripe as a payment provider” and refreshes the product feed every 15 minutes ([Medusa](https://docs.medusajs.com/resources/how-to-tutorials/tutorials/agentic-commerce)). Stripe's suite issues Shared Payment Tokens scoped to a seller, a time and an amount ([Stripe](https://stripe.com/blog/agentic-commerce-suite)). On Shopify, an agent using Shop MCP completes checkout only after the buyer confirms total and payment method, and completing checkout inside an agent directly over UCP “requires Shopify's permission” ([Shopify agents docs](https://shopify.dev/docs/agents)). Visa's Intelligent Commerce Connect, in pilot, supports the Trusted Agent Protocol, the Machine Payments Protocol, ACP and UCP ([Visa](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-intelligent-commerce-connect-ai-shopping-for-businesses.html?utm_id=ICC)). Adobe Commerce has reportedly committed to UCP and ACP ([Adobe](https://business.adobe.com/blog/adobe-commerce-commits-to-agentic-commerce-standards)).",
        },
        {
          type: "p",
          text: "UCP's site lists Flipkart, Visa, Mastercard, PayPal, Stripe, Adyen, Salesforce, SAP, Zalando and Shopee among its endorsers, and Google, Shopify, Etsy, Wayfair, Target, Walmart, Amazon, Microsoft, Meta and Stripe among co-developers ([ucp.dev](https://ucp.dev/)). Whether Flipkart, Meesho or ONDC expose agent-facing catalogues was not verified.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: whoever owns catalogue, price, stock and orders is the system agents talk to",
          text: "Keeping the merchant of record, the customer data and the checkout on the brand's side is the direction every player moved to in 2026. A brand whose catalogue, pricing, stock and orders already live in one governed system is well placed to answer agents; one whose product record is copied across five tools will publish five slightly different answers. Our post on [agentic commerce, UCP and ACP](/blogs/agentic-commerce-ucp-acp-explained) turns this into a readiness checklist.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "ai-agents-for-brands",
      kicker: "AI agents for brands",
      title: "What AI agents already do end to end for brands: support, sales, ads and creative",
      answer:
        "Customer support is the one function where agents work end to end at scale and are priced by result, at roughly $0.85 to $2.00 per resolved conversation, with vendors reporting 70% or more handled without a person. AI sales outreach and fully automatic advertising are weaker: the best-documented AI SDR case needed 15 to 20 hours of human work a week, one leading vendor was found to have overstated customers, and Klarna and OpenAI both reversed prominent automation bets.",
      blocks: [
        {
          type: "table",
          caption: "Support agents: price and reported result",
          columns: ["Vendor", "Price for the AI agent", "Reported result"],
          rows: [
            ["[Intercom Fin](https://www.intercom.com/pricing)", "$0.99 per outcome, with or without Intercom's helpdesk", "76% average resolution rate (chart labelled June 2026); billing unit changed from “resolution” to “outcome” in March 2026 ([Intercom](https://www.intercom.com/blog/fin-ai-agent-resolution-rates))"],
            ["[Zendesk](https://www.zendesk.com/pricing/)", "$2.00 per automated resolution pay-as-you-go, less when committed", "Bills only requests resolved “without escalation to a human agent”"],
            ["[Salesforce Agentforce](https://www.salesforce.com/agentforce/pricing/)", "$2 per conversation, or Flex Credits at $500 per 100,000 (10 US cents an action)", "None on the page"],
            ["[Freshdesk Freddy](https://www.freshworks.com/freshdesk/pricing/)", "$49 per 100 sessions after 500 included", "A session is one end-user interaction"],
            ["[Gorgias](https://gorgias.com/pricing)", "$0.85 to $1.00 per automated interaction (reported)", "“Automated” means no human needed within 72 hours"],
            ["[Meta Business Agent](https://developers.facebook.com/docs/whatsapp/pricing)", "$2.00 per million tokens, about 4 to 5 US cents a message", "None on the page"],
            ["[Interakt](https://www.interakt.shop/pricing/)", "₹2,499 a month plus ₹0.50 per AI message after 100", "Sales, lead-qualification and support agents"],
            ["[Sierra](https://www.sacra.com/c/sierra); [Decagon](https://sacra.com/c/decagon/)", "Outcome- or conversation-based", "Analyst estimates: Sierra about 70% containment; Decagon clients report up to 90% resolution (not audited)"],
          ],
        },
        {
          type: "quote",
          text: "Cost unfortunately seems to have been a too predominant evaluation factor.",
          cite: "Klarna's CEO, May 2025, as Klarna began recruiting human agents again",
          url: "https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-ai-customer-service-buy-now-pay-later/747586/",
        },
        { type: "h3", text: "AI SDRs: measured, and mixed" },
        {
          type: "p",
          text: "SaaStr ran AI SDR agents for six months: the outbound agent sent 19,847 messages with a 6.7% response rate and 4% positive; the inbound agent booked about 100 meetings from 697,000 site sessions and was credited with $1M+ closed revenue in 90 days. It took 15 to 20 hours of human time a week, cost $50K to $100K+ per platform a year, and results fell 10 to 20% in weeks with less attention; the figures are self-reported ([SaaStr](https://www.saastr.com/6-months-of-ai-sdrs)). A March 2025 investigation found 11x listed ZoomInfo and Airtable as customers after short trials; ZoomInfo said the product “performed significantly worse than our SDR employees”, and 11x said its retention was 79% ([TechCrunch](https://techcrunch.com/2025/03/24/a16z-and-benchmark-backed-11x-has-been-claiming-customers-it-doesnt-have/)).",
        },
        { type: "h3", text: "Ads, creative and search" },
        {
          type: "list",
          items: [
            "Meta planned to let a brand supply a product image or URL and a budget and have AI produce, target and budget the whole ad by the end of 2026, per the Wall Street Journal ([Marketing Dive](https://www.marketingdive.com/news/meta-plans-to-enable-fully-ai-automated-ads-by-2026/749613/)). Whether it met that target was not confirmed.",
            "Google says advertisers who turn on AI Max for Search typically see 14% more conversions at similar cost, from its internal figures ([Google](https://blog.google/products/ads-commerce/google-ai-max-for-search-campaigns/)).",
            "Adobe at MAX (10 November 2026) announced a Firefly “Builder” in private beta and an always-on agent; Firefly offers models from Google, Runway, OpenAI, Kling and ByteDance among others ([TechCrunch](https://techcrunch.com/2026/11/10/adobe-adds-more-ai-to-its-products-and-launches-an-mcp/)).",
            "OpenAI announced on 24 March 2026 that it was shutting down Sora; a developer post gives 24 September 2026 as the API end date ([Analytics India Magazine](https://analyticsindiamag.com/ai-trends/sora-is-gone-heres-what-creators-are-using-instead-in-2026/); [dev.to, reported](https://dev.to/mr_manushukla/sora-2-and-the-videos-api-shut-down-on-24-september-2026-the-migration-and-the-real-cost-per-second-bek)).",
            "Ahrefs found AI Overviews associated with a 58% lower click-through rate for the top-ranking page, up from 34.5% in its earlier study ([Ahrefs](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/)). Adobe agreed in November 2025 to buy Semrush for about $1.9 billion, citing generative engine optimisation ([Adobe](https://news.adobe.com/news/2025/11/adobe-to-acquire-semrush)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: keep a person in the loop, and keep models replaceable",
          text: "The repeated failure pattern is removing the person entirely (Klarna, 11x, in-chat checkout); the cases that hold up keep a person approving or supervising, which matches the 80.6% assist-only figure in the martech survey. “Resolution” is defined by the vendor that bills for it, so vendor rates are not comparable. And hosted models can vanish (Sora) or be repriced within months, so call image and video models through a replaceable layer. We compare the support pricing in [AI support agent pricing per resolution](/blogs/ai-support-agent-pricing-per-resolution); our own [agentic ERP and CRM](/agentic-erp-crm) work holds customer-facing actions for approval.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "open-source-brands",
      kicker: "Open source for brands",
      title: "Where open source is production-grade for brands, and where the gaps are",
      answer:
        "Open source is strong enough for production in design collaboration, desktop image and 3D work, generative image pipelines, headless commerce, CMS, email and notifications, social scheduling, CRM, helpdesk, payments orchestration and analytics. It is thin or absent for browser-based professional photo editing and page layout, packaging dielines, ad buying, SEO data, reviews, loyalty and returns, and Indian marketplace and ONDC order management.",
      blocks: [
        {
          type: "table",
          caption: "Production-grade open source by area (GitHub, read 22 November 2026)",
          columns: ["Area", "Projects", "Licence", "Signal"],
          rows: [
            ["Design collaboration", "[Penpot](https://github.com/penpot/penpot); [Excalidraw](https://github.com/excalidraw/excalidraw)", "MPL-2.0; MIT", "62,600 and 136,100 stars; Penpot 2.19.3 (18 Nov 2026)"],
            ["Generative image", "[ComfyUI](https://github.com/Comfy-Org/ComfyUI); [InvokeAI](https://github.com/invoke-ai/InvokeAI)", "GPL-3.0; Apache-2.0", "148,000 and 29,100 stars; both released Nov 2026"],
            ["Headless commerce", "[Medusa](https://github.com/medusajs/medusa); [Saleor](https://github.com/saleor/saleor); [Vendure](https://github.com/vendurehq/vendure)", "MIT; BSD-3-Clause; GPLv3 or commercial", "Medusa v2.23.0 and Saleor 3.23.50 in Nov 2026"],
            ["Commerce (India-built)", "[Bagisto](https://github.com/bagisto/bagisto) (Webkul, Noida); [Hyperswitch](https://github.com/juspay/hyperswitch) (Juspay)", "MIT; Apache-2.0", "28,400 and 45,900 stars"],
            ["CMS", "[Payload](https://github.com/payloadcms/payload); [Strapi](https://github.com/strapi/strapi); [Ghost](https://github.com/TryGhost/Ghost)", "MIT (Strapi open core)", "46,000; 73,500; 55,900 stars"],
            ["Email and messaging", "[listmonk](https://github.com/knadh/listmonk); [Mautic](https://github.com/mautic/mautic); [Novu](https://github.com/novuhq/novu)", "AGPL-3.0; GPL; MIT core", "All released Oct–Nov 2026"],
            ["Social scheduling", "[Postiz](https://github.com/gitroomhq/postiz-app)", "AGPL-3.0", "42,100 stars; about 30 networks"],
            ["CRM", "[Twenty](https://github.com/twentyhq/twenty); [Krayin](https://github.com/krayin/laravel-crm); [Frappe CRM](https://github.com/frappe/crm)", "AGPL-3.0; MIT; AGPL-3.0", "61,300; 24,200; 4,000 stars"],
            ["Support", "[Chatwoot](https://github.com/chatwoot/chatwoot); [FreeScout](https://github.com/freescout-help-desk/freescout)", "MIT open core; AGPL-3.0", "Chatwoot Community lacks Captain AI, roles, SSO and SLA"],
            ["Analytics", "[PostHog](https://github.com/PostHog/posthog); [Umami](https://github.com/umami-software/umami); [Plausible](https://github.com/plausible/analytics); [Matomo](https://github.com/matomo-org/matomo)", "MIT core; MIT; AGPL-3.0; GPL-3.0", "41,000; 40,300; 29,900; 22,000 stars"],
            ["Product search", "[Meilisearch](https://github.com/meilisearch/meilisearch); [Typesense](https://github.com/typesense/typesense)", "MIT (enterprise parts BSL); GPL-3.0", "60,000 and 27,200 stars"],
          ],
        },
        {
          type: "table",
          caption: "Gaps a brand would have to build or buy",
          columns: ["Gap", "Evidence"],
          rows: [
            ["Professional photo editor and page layout in the browser", "miniPaint is small, Graphite has no tagged release, Scribus is desktop only, Photopea is closed ([Graphite](https://github.com/GraphiteEditor/Graphite); [miniPaint](https://github.com/viliusle/miniPaint))"],
            ["Canva-style brand template editor", "Only commercial SDKs such as Polotno"],
            ["Structural packaging and dielines", "Nothing found; Esko and Pacdora are closed"],
            ["Browser video editor", "OpenCut is at v0.3.0 ([OpenCut](https://github.com/OpenCut-app/OpenCut)); Remotion needs a company licence"],
            ["Ad buying, SEO crawl and backlink data", "None; only rank trackers and site auditors"],
            ["Reviews, loyalty and returns", "No open-source product of note; the Open Loyalty repository could not be resolved"],
            ["India marketplace, quick commerce and ONDC order management", "Commercial only (Unicommerce, EasyEcom, Vinculum); the Beckn specification carries a non-commercial licence ([Beckn](https://github.com/beckn/protocol-specifications))"],
            ["Official WhatsApp messaging", "Meta's paid API; open tools are front-ends to it or unofficial libraries such as Baileys ([Baileys](https://github.com/WhiskeySockets/Baileys))"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Licence drift, and model weights with their own terms",
          text: "Pimcore moved to its own Open Core License from Platform 2025.1 ([Pimcore](https://pimcore.com/en/resources/blog/breaking-free-pimcore-says-goodbye-to-gpl-and-enters-a-new-era-with-pocl)); Directus is under a licence that bars “Competing Use” ([Directus](https://github.com/directus/directus)); Typebot is under the Functional Source License; RudderStack and Airbyte are Elastic License 2.0. FLUX.2 dev and klein 9B weights are non-commercial ([FLUX.2](https://github.com/black-forest-labs/flux2)), and Tencent's Hunyuan models exclude the EU, UK and South Korea ([HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo)). Conversational frameworks from the last cycle have stalled: Rasa's last release was January 2025 and Botpress's last tagged release is from 2023 ([Rasa](https://github.com/RasaHQ/rasa); [Botpress](https://github.com/botpress/botpress)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: run AGPL beside you, embed permissive",
          text: "Many of the strongest projects are AGPL (Twenty, listmonk, Postiz, Plausible, FreeScout, Frappe CRM). Running them unmodified beside your own systems is straightforward; modifying them and offering the result to other companies as a service brings source-sharing duties and needs a legal check. MIT, BSD, Apache and MPL projects (Penpot, Excalidraw, Medusa, Saleor, Bagisto, Payload, Chatwoot core, Umami, Hyperswitch) are the easiest to embed. Our [licence risk guide](/blogs/open-source-licence-risk-agpl-bsl-sspl) explains the tiers; this is not legal advice.",
        },
      ],
    },
  ],
  method: [
    "List prices were read from vendor pages on 22 November 2026 unless another date is given. Repository stars, licences and releases were read from each project's public repository the same day, with licence text from the repository's licence file.",
    "Facts that came from a search-result summary, without the page being opened, are marked “reported”. Vendor and analyst figures (Sierra, Decagon, Sacra, Meta, Google) are self-reported and not audited.",
    "The web-search budget ran out part-way. Not verified: prices for Canva, Midjourney, CapCut, BigCommerce, Adobe Commerce, Akeneo, Salsify, Webflow, Contentful, Mailchimp, Braze, MoEngage, CleverTap, WebEngage, Gupshup, Zoho CRM, Pipedrive, LeadSquared, Freshsales, Apollo, Amplitude, Segment and GA4; Amazon, Flipkart and Meesho seller APIs and fees.",
    "No independent survey of how many tools a D2C brand runs was found, and no independent audit of any support agent's resolution rate.",
  ],
  faq: [
    {
      q: "What tools does a D2C brand in India typically use?",
      a: "A common stack is Shopify for the storefront, Razorpay, PayU or Cashfree for payments, Unicommerce, EasyEcom or Vinculum for orders and inventory, Shiprocket for shipping, Interakt or WATI for WhatsApp, Klaviyo or WebEngage for marketing automation, and Tally or Odoo for accounts. That description comes from a services firm's survey of brands and is best read as indicative.",
    },
    {
      q: "What is agentic commerce?",
      a: "Shopping in which an AI assistant finds products, builds a cart and, in some cases, pays on the shopper's behalf. In 2026 it settled into discovery and referral: assistants read brands' product feeds and send shoppers to the merchant's own checkout, after OpenAI scaled back in-chat checkout in March 2026.",
    },
    {
      q: "What is the difference between UCP and ACP?",
      a: "Both are Apache-2.0 protocols for agents to buy from merchants. The Agentic Commerce Protocol, from OpenAI and Stripe, centres on checkout sessions with signed requests and webhooks. The Universal Commerce Protocol, from Google with Shopify and others, covers catalogue, cart, checkout, identity linking and orders, and builds in AP2 for payment mandates plus A2A and MCP transports.",
    },
    {
      q: "Did ChatGPT Instant Checkout fail?",
      a: "It was scaled back. In March 2026 OpenAI confirmed Instant Checkout was moving to apps and that merchants would use their own checkout while ChatGPT focuses on discovery. Retailers reported low conversion inside the chat (Walmart saw three times lower) and wanted to keep coupons, loyalty, live inventory and the customer relationship.",
    },
    {
      q: "How much do AI customer support agents cost per resolution?",
      a: "Published prices in November 2026: Intercom Fin $0.99 per outcome, Zendesk $2.00 per automated resolution pay-as-you-go, Gorgias $0.85 to $1.00 per automated interaction, Salesforce Agentforce $2 per conversation or Flex Credits, and Freshdesk $49 per 100 sessions. Each vendor defines “resolution” differently, so rates are not directly comparable.",
    },
    {
      q: "Which marketing tools have an MCP server?",
      a: "As documented by November 2026: Figma, Canva, Shopify (UCP over MCP on every store), WooCommerce (developer preview), HubSpot, Salesforce, Klaviyo, Ahrefs, Clay, Mixpanel, PostHog, Sanity, Framer (preview), Twenty and Postiz. Adobe announced a local MCP at MAX in November 2026 but has not said what it will expose.",
    },
    {
      q: "Is there an open-source alternative to Shopify?",
      a: "Several are production-grade: Medusa (MIT), Saleor (BSD-3-Clause), Vendure (GPLv3 or commercial), Sylius, Shopware, Bagisto and Spree, plus WooCommerce on WordPress. Medusa and Saleor already support agentic commerce protocols. What open source lacks is Indian marketplace, quick-commerce and ONDC order management, which remains commercial.",
    },
    {
      q: "How much does the WhatsApp Business API cost in India in 2026?",
      a: "Meta charges per delivered message, and India marketing rates rose on 1 January 2026. Since 1 October 2026 each number gets 1,000 free service messages a month, and Indian accounts must bill in INR by 31 December 2026. Providers add a platform fee: Interakt charges ₹2,799 or ₹3,799 a month plus about ₹0.95 to ₹0.97 per marketing template.",
    },
  ],
  platformLinks: ["agentic", "factoryGraph", "audit"],
  relatedReports: [
    "back-office-software-open-source-alternatives",
    "embed-stream-integrate-specialist-software",
    "future-of-erp-crm-agentic-ai",
  ],
  blogSlugs: ["agentic-commerce-ucp-acp-explained", "ai-support-agent-pricing-per-resolution"],
};
