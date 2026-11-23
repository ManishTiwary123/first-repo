/**
 * Spoke posts of the research report
 * /research/d2c-marketing-tool-stack-agentic-commerce.
 * Facts checked on 2026-11-22; every figure links to its source.
 */
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

const REPORT = "/research/d2c-marketing-tool-stack-agentic-commerce";

export const COMMERCE_MARKETING_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "agentic-commerce-ucp-acp-explained",
    title: "Agentic Commerce Explained: UCP, ACP, AP2 and What Your Store Needs",
    subtitle:
      "In-chat checkout stalled in 2026, but the standards it produced did not. What the Universal Commerce Protocol, the Agentic Commerce Protocol and AP2 ask of a brand's catalogue, checkout and orders, and a readiness checklist.",
    excerpt:
      "ChatGPT scaled back Instant Checkout, yet UCP, ACP and AP2 are now the rules AI shopping agents follow. What they ask your store to expose, and how to get ready.",
    category: "growth",
    readTime: 10,
    publishedAt: RESEARCH_PUBLISHED,
    featured: false,
    popularityScore: 76,
    author: RESEARCH_AUTHOR,
    heroSketch: "layerStack",
    tags: ["agentic commerce", "ecommerce", "ai agents", "research"],
    keywords: {
      primary: "agentic commerce",
      secondary: [
        "universal commerce protocol",
        "agentic commerce protocol",
        "AP2 agent payments protocol",
        "ChatGPT instant checkout",
        "AI shopping agents for ecommerce",
      ],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    relatedSlugs: [
      "ai-support-agent-pricing-per-resolution",
      "d2c-catalog-conversion",
      "generative-engine-optimization-for-smes",
    ],
    crossPageLinks: [
      { href: REPORT, label: "D2C tool stack research", note: "the full report on the brand stack, MCP and agentic commerce" },
      { href: "/blogs/d2c-catalog-conversion", label: "D2C catalogue conversion", note: "fixing the catalogue humans and agents both read" },
      { href: "/contact", label: "Talk to us", note: "a free first conversation about your stack" },
    ],
    faq: [
      {
        question: "What is agentic commerce?",
        answer:
          "Shopping where an AI assistant searches products, builds a cart and sometimes pays for the shopper. In 2026 it settled into discovery and referral: assistants read brands' product feeds and send shoppers to the merchant's own checkout.",
      },
      {
        question: "What is the difference between UCP and ACP?",
        answer:
          "The Agentic Commerce Protocol, from OpenAI and Stripe, centres on checkout sessions with signed requests and order webhooks. The Universal Commerce Protocol, announced by Google with Shopify and others, covers catalogue, cart, checkout, identity linking and orders, and builds in AP2 for payment mandates. Both are Apache-2.0.",
      },
      {
        question: "Is ChatGPT Instant Checkout still available?",
        answer:
          "It was scaled back. In March 2026 OpenAI confirmed that Instant Checkout was moving to apps and that merchants would use their own checkout while ChatGPT focuses on discovery. Shopify says ChatGPT purchases now complete on the merchant's own checkout in an in-app browser.",
      },
      {
        question: "How will AI agents pay in India?",
        answer:
          "The live pilot runs on UPI. Razorpay, NPCI and OpenAI launched Agentic Payments on ChatGPT in October 2025 on UPI Reserve Pay and UPI Circle, with BigBasket as an early merchant. Mastercard showed an agent card payment in India only as a controlled demonstration in February 2026.",
      },
      {
        question: "Should a brand block AI shopping agents?",
        answer:
          "It is harder than it looked. A US district judge blocked Perplexity's Comet agent from shopping on Amazon in March 2026, but an appeals court later vacated the injunction, reasoning that the user who directs the assistant is the one accessing the site. Most brands are better served by giving agents an official, controlled way in.",
      },
    ],
    takeaways: [
      "In-chat checkout under-delivered: Walmart saw conversion three times lower inside the chatbot than when shoppers clicked out.",
      "AI assistants are now a discovery channel fed by product feeds; the purchase completes on the merchant's own checkout.",
      "UCP, ACP and AP2 converge on the same requirements: a clean feed, live price and stock, checkout sessions, order webhooks, signed requests and scoped payment tokens.",
      "In India the agent payment track is UPI, not card tokens.",
      "The brand that owns catalogue, price, stock and orders in one place is the easiest one for an agent to buy from correctly.",
    ],
    sections: [
      {
        heading: "What happened to buying inside the chat",
        paragraphs: [
          "The idea was simple: the shopper asks an assistant for a product, the assistant finds it and pays, and the shopper never visits a website. OpenAI and Stripe announced the Agentic Commerce Protocol in September 2025, with Etsy among the first merchants on ChatGPT Instant Checkout ([Stripe](https://stripe.com/blog/agentic-commerce-suite)). Shopify launched Agentic Storefronts on 10 December 2025, and Google announced the Universal Commerce Protocol at NRF on 11 January 2026 with Shopify, Etsy, Wayfair, Target and Walmart ([TechCrunch](https://www.techcrunch.com/2026/01/11/google-announces-a-new-protocol-to-facilitate-commerce-using-ai-agents/)).",
          "By March 2026 it had stalled. OpenAI confirmed that “Instant Checkout is moving to Apps”, and on 24 March said merchants would use their own checkout while ChatGPT focuses on discovery ([Digital Commerce 360](https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/)). Retailers explained why: Walmart's Daniel Danker said conversion was three times lower for items sold inside the chatbot than for those that clicked out; Etsy did not see large volume; Instacart said only a very small share of orders start with agents; and retailers wanted live inventory, coupons, loyalty and store pickup without giving up the customer relationship ([Modern Retail](https://www.modernretail.co/technology/what-went-wrong-with-chatgpts-instant-checkout/)).",
          "Shoppers do use assistants to look. In Forrester's December 2025 survey, 23% of Gen X, 32% of Millennials and 35% of Gen Z had used ChatGPT to search for products in the past month, but completing a purchase inside an answer engine was the least-adopted use ([Forrester](https://www.forrester.com/blogs/what-it-means-that-the-leader-in-agentic-commerce-just-pulled-back/)). The practical conclusion: AI assistants are a discovery channel, and the checkout stays with the brand.",
        ],
        pullQuote: "Assistants became the place to discover products. The checkout stayed with the brand.",
      },
      {
        heading: "ACP, UCP and AP2 in plain terms",
        paragraphs: [
          "Three open standards came out of this period, and they overlap more than their names suggest.",
        ],
        bullets: [
          "The Agentic Commerce Protocol (ACP), from OpenAI and Stripe, is Apache-2.0; its repository was last pushed on 18 July 2026 ([ACP](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)). It defines how an agent creates, updates, retrieves and completes a checkout session with a merchant.",
          "The Universal Commerce Protocol (UCP), from Google with Shopify and other retailers, is also Apache-2.0, with its latest release tagged v2026-08-25 ([UCP](https://github.com/Universal-Commerce-Protocol/ucp)). Its capabilities are Catalog, Cart, Checkout, Identity Linking (OAuth 2.0) and Order (confirmation, fulfilment, webhooks, returns), over REST or JSON-RPC, with AP2, A2A and MCP built in. Businesses remain merchant of record ([ucp.dev](https://ucp.dev/)).",
          "The Agent Payments Protocol (AP2) is Apache-2.0, at v0.2.0 since 28 April 2026 ([AP2](https://github.com/google-agentic-commerce/AP2)). UCP uses it for payment mandates backed by cryptographic proof of user consent.",
          "Shopify serves UCP over MCP on every store at /api/ucp/mcp, with Catalog, Cart, Checkout, Ask (policies and FAQs) and Order servers; the older Storefront MCP tools were removed ([Shopify](https://shopify.dev/docs/apps/build/storefront-mcp)).",
        ],
        callout: {
          title: "Who has signed up",
          body:
            "UCP's site lists Flipkart, Visa, Mastercard, PayPal, Stripe, Adyen, Salesforce, SAP, Zalando and Shopee as endorsers. Visa's Intelligent Commerce Connect, in pilot, supports ACP, UCP and two further agent protocols. Whether Flipkart, Meesho or ONDC expose agent-facing catalogues today was not verified.",
        },
      },
      {
        heading: "The product feed: the fields an assistant reads",
        paragraphs: [
          "Discovery runs on feeds. OpenAI's commerce documentation lists the required fields for a ChatGPT product feed: item_id, title, description, url, image_url, brand, seller_name, availability, price with an ISO currency code, target_countries and store_country. Each variant gets its own row, tied together by a shared group_id. Feeds are accepted as JSONL, CSV or TSV by upload, HTTPS URL or SFTP once the business is claimed and verified, and the feed currently represents the US, Canada and Mexico ([OpenAI](https://developers.openai.com/commerce/llms-full.txt)).",
          "None of these fields is exotic, but each one is a place where a brand's systems tend to disagree. The title in the PIM differs from the title on the storefront; availability is updated hourly in the warehouse system and daily in the feed; the price on the marketplace includes a promotion the feed does not know about. An assistant that reads a stale price will quote it to the shopper, and the shopper will hold the brand to it.",
          "Medusa's agentic commerce guide refreshes the product feed every 15 minutes ([Medusa](https://docs.medusajs.com/resources/how-to-tutorials/tutorials/agentic-commerce)). If your stock moves faster than that, the feed needs to come from the same record the checkout reads, not from a nightly export.",
        ],
      },
      {
        heading: "Checkout sessions, signed requests and scoped payment tokens",
        paragraphs: [
          "Medusa's implementation of ACP shows the shape of the checkout side: endpoints to create a checkout session, update and retrieve it by id, and complete it; a Bearer key plus an HMAC signature on requests; and signed order webhooks. The guide notes that “ChatGPT currently supports only Stripe as a payment provider” ([Medusa](https://docs.medusajs.com/resources/how-to-tutorials/tutorials/agentic-commerce)).",
          "Payment no longer arrives as a card number. Stripe's Agentic Commerce Suite issues Shared Payment Tokens scoped to a seller, a time and an amount ([Stripe](https://stripe.com/blog/agentic-commerce-suite)), and ChatGPT's own checkout uses a network token per transaction. On Shopify, every agent request must carry an agent profile, each cart update replaces the whole cart, checkout requests must be authenticated or signed, and an agent using Shop MCP completes checkout only after the buyer confirms the total and payment method ([Shopify agents docs](https://shopify.dev/docs/agents)).",
        ],
        callout: {
          title: "Why this matters for operations, not just IT",
          body:
            "Every agent order still has to be picked, packed, invoiced, shipped and possibly returned. UCP's Order capability includes fulfilment and returns webhooks for that reason. An order that arrives with the AI channel recorded (Shopify records it in the admin) is also the only way to measure whether the channel is worth the effort.",
        },
      },
      {
        heading: "India: UPI, not card tokens",
        paragraphs: [
          "India is on its own payment track. On 9 October 2025 Razorpay, NPCI and OpenAI launched an “Agentic Payments” pilot on ChatGPT built on UPI Reserve Pay and UPI Circle, with BigBasket as a first merchant and Axis Bank and Airtel Payments Bank as banking partners ([Razorpay](https://razorpay.com/newsroom/razorpay-npci-and-openai-come-together-to-launch-agentic-payments-ushering-in-ai-driven-commerce-at-national-scale/)). Card networks have only demonstrated agent payments here: Mastercard completed an Agent Pay purchase at the India AI Impact Summit in February 2026 in a “controlled environment”, with no partners or launch date given ([PaymentsJournal](https://www.paymentsjournal.com/mastercard-advances-agentic-ai-commerce-in-india/)).",
          "No 2026 status update on the UPI pilot was found, and no independent figure exists for the share of Indian e-commerce orders that start in an AI assistant. In our view an Indian brand should plan for UPI mandates rather than card tokens for agent purchases, and should not rebuild its checkout around a channel whose volume nobody can yet measure.",
        ],
      },
      {
        heading: "A readiness checklist for a brand",
        paragraphs: [
          "This checklist is ours. It follows the requirements common to ACP, UCP and Shopify's implementation, ordered so the early steps pay off even if agent traffic stays small, because the same fixes help search engines and human shoppers.",
        ],
        bullets: [
          "One product record: SKU, title, description, images, brand, variants, price with currency and availability held in one place that the storefront, the marketplaces and the feed all read.",
          "Stable ids and GTIN or MPN where you have them, one row per variant with a shared group id.",
          "Live price and stock exposed through a catalogue search or lookup, not only a nightly file.",
          "A policy and FAQ answer source (shipping, returns, warranty) that an agent can quote accurately.",
          "Checkout sessions you control, able to accept a scoped payment token, with signed requests and order webhooks.",
          "Order status, fulfilment and returns events that an agent can read back to the shopper.",
          "Identity linking, so loyalty prices and saved addresses apply when a known customer arrives through an agent.",
          "The channel recorded on every order, so you can see what agent traffic is worth.",
        ],
        callout: {
          title: "Where to start",
          body:
            "If your product record is copied across a storefront, an order-management tool, marketplaces and a spreadsheet, fix that first. Our D2C research report shows how many tools typically touch it, and our post on catalogue conversion covers what human shoppers need from the same data.",
        },
      },
    ],
  },
  // ------------------------------------------------------------------------
  {
    slug: "ai-support-agent-pricing-per-resolution",
    title: "AI Support Agent Pricing 2026: Fin, Zendesk, Agentforce Compared",
    subtitle:
      "Support is the one place AI agents work end to end at scale, and they are priced per result. What Intercom, Zendesk, Salesforce, Freshdesk, Gorgias, Meta and Interakt charge, what each one counts as a “resolution”, and a worked cost example.",
    excerpt:
      "AI support agents cost $0.85 to $2.00 per resolution in 2026, but every vendor defines a resolution differently. Prices compared, Klarna's reversal, and what to measure.",
    category: "automation",
    readTime: 10,
    publishedAt: RESEARCH_PUBLISHED,
    featured: false,
    popularityScore: 78,
    author: RESEARCH_AUTHOR,
    heroSketch: "whatsappFlow",
    tags: ["ai agents", "customer support", "pricing", "research"],
    keywords: {
      primary: "AI customer support agent pricing",
      secondary: [
        "Intercom Fin price per resolution",
        "Zendesk AI agent pricing",
        "Agentforce pricing",
        "outcome based pricing AI",
        "WhatsApp AI agent cost India",
      ],
      searchVolume: 0,
      difficulty: "medium",
      intent: "commercial",
    },
    relatedSlugs: [
      "agentic-commerce-ucp-acp-explained",
      "whatsapp-as-crm",
      "saas-sprawl-statistics-2026",
    ],
    crossPageLinks: [
      { href: REPORT, label: "D2C tool stack research", note: "support, sales, ads and creative agents with their numbers" },
      { href: "/agentic-erp-crm", label: "Agentic ERP & CRM", note: "agents with approved tools and human approval" },
      { href: "/blogs/whatsapp-as-crm", label: "WhatsApp as CRM", note: "the channel most Indian support already runs on" },
    ],
    faq: [
      {
        question: "How much does an AI customer support agent cost per resolution?",
        answer:
          "Published prices in November 2026 range from about $0.85 to $2.00: Intercom Fin $0.99 per outcome, Gorgias $0.85 to $1.00 per automated interaction (reported), Zendesk $2.00 per automated resolution pay-as-you-go, and Salesforce Agentforce $2 per conversation or Flex Credits at about 10 US cents an action.",
      },
      {
        question: "What counts as a resolution for AI support billing?",
        answer:
          "Each vendor decides. Zendesk bills requests the AI resolves without escalation to a human. Gorgias counts an interaction as automated when no human was needed within 72 hours. Intercom changed its billing unit from “resolution” to “outcome” in March 2026, which also counts configured hand-offs.",
      },
      {
        question: "What resolution rate can an AI support agent reach?",
        answer:
          "Vendors report 70% or more. Intercom shows a 76% average resolution rate for Fin in a chart labelled June 2026, and analyst estimates put Sierra's enterprise containment at about 70%. None of these figures has been independently audited, and they use different definitions.",
      },
      {
        question: "Why did Klarna bring back human support agents?",
        answer:
          "In May 2025 Klarna's CEO said cost had been too predominant an evaluation factor and that this lowered quality, and that customers would always be able to reach a person. Klarna had earlier said its assistant handled about two-thirds of chats, the work of 700 agents.",
      },
      {
        question: "How much does a WhatsApp AI agent cost in India?",
        answer:
          "Meta's own Business Agent message category costs $2.00 per million tokens, about 4 to 5 US cents a message, since 1 July 2026. Providers price on top: Interakt's WhatsApp AI Agents cost ₹2,499 a month with 100 AI messages included, then ₹0.50 per AI message.",
      },
    ],
    takeaways: [
      "Support agents are the clearest case of outcome pricing: roughly $0.85 to $2.00 per resolved conversation in 2026.",
      "“Resolution” and “outcome” are defined by the vendor that bills for them, so headline rates are not comparable.",
      "Reported resolution rates of 70% or more are vendor figures; none has been independently audited.",
      "Klarna's reversal shows the cost of optimising for deflection over quality.",
      "Compare vendors on your own traffic: billable units, hand-off quality, reopen rate and cost per truly resolved issue.",
    ],
    sections: [
      {
        heading: "The price list, side by side",
        paragraphs: [
          "Customer support is the one function where AI agents work end to end at scale and are priced by result. These are the published prices as read on 22 November 2026.",
        ],
        bullets: [
          "Intercom Fin AI Agent: $0.99 per outcome, on any Intercom plan or beside another helpdesk; Copilot for human agents $29 per agent a month ([Intercom](https://www.intercom.com/pricing)).",
          "Zendesk: $2.00 per automated resolution pay-as-you-go, lower when committed, with 5 to 10 included per agent a month; Copilot $50 per agent ([Zendesk](https://www.zendesk.com/pricing/)).",
          "Salesforce Agentforce: $2 per conversation, or Flex Credits at $500 per 100,000 with 20 credits per action, which works out at 10 US cents an action ([Agentforce](https://www.salesforce.com/agentforce/pricing/)).",
          "Freshdesk Freddy AI Agent: 500 sessions included once, then $49 per 100 sessions; a session is one end-user interaction and email sessions last 72 hours ([Freshdesk](https://www.freshworks.com/freshdesk/pricing/)).",
          "Gorgias AI Agent: $1.00, $0.90 or $0.85 per automated interaction depending on plan, as shown on its pricing page in a search summary ([Gorgias](https://gorgias.com/pricing)).",
          "Chatwoot Captain: 300 to 800 credits a month in paid plans, $20 per extra 1,000 ([Chatwoot](https://www.chatwoot.com/pricing)).",
          "Meta Business Agent on WhatsApp: $2.00 per million tokens, about 4 to 5 US cents a message, since 1 July 2026 ([Meta](https://developers.facebook.com/docs/whatsapp/pricing)).",
          "Interakt WhatsApp AI Agents: ₹2,499 a month with 100 AI messages, then ₹0.50 per AI message ([Interakt](https://www.interakt.shop/pricing/)).",
        ],
      },
      {
        heading: "What counts as a resolution depends on who is billing",
        paragraphs: [
          "The unit is where the real price hides. Zendesk bills only requests “the AI agent resolves without escalation to a human agent”. Gorgias counts an interaction as automated when no human was needed within 72 hours, and a fully automated ticket can also count as a ticket. Freshdesk bills sessions, not outcomes. Salesforce offers both a per-conversation price and per-action credits.",
          "Intercom made the most consequential change. In March 2026 it moved its billing unit from “resolution” to “outcome”, and an outcome also counts configured hand-offs to a person ([Intercom](https://www.intercom.com/blog/fin-ai-agent-resolution-rates)). That is a defensible product decision, since a clean hand-off with the context attached is useful work. But it means Intercom's $0.99 and Zendesk's $2.00 are not prices for the same thing.",
          "The newer enterprise vendors are less transparent still. Sierra prices by volume or by outcome, blended per client, and Decagon more commonly per conversation, with a higher rate per resolution as the alternative ([Sacra](https://sacra.com/c/decagon/)). Neither publishes a list price. And per-result pricing sits on top of the seats your human agents still need: Zendesk's Suite Team plan is $55 per agent a month on annual billing, and Intercom's seats run from $29 list to $132 a month before any AI is added ([Zendesk](https://www.zendesk.com/pricing/); [Intercom](https://www.intercom.com/pricing)). A vendor comparison that looks only at the AI line understates the bill.",
        ],
        callout: {
          title: "Read the definition before the price",
          body:
            "Before comparing vendors, write down for each one what triggers a charge: a conversation, a session, an action, a resolution with no human, or an outcome that may include a hand-off. Then price your own last month of tickets under each definition.",
        },
      },
      {
        heading: "Reported resolution rates, and how far to trust them",
        paragraphs: [
          "Intercom reports a 76% average resolution rate for Fin across more than 12,000 teams, in a chart labelled June 2026; a search summary quoted 67% for March 2026 ([Intercom](https://www.intercom.com/blog/fin-ai-agent-resolution-rates)). Analyst firm Sacra estimates about 70% containment for Sierra's enterprise clients and $400M ARR in October 2026, after Sierra was valued at $15.8 billion in May 2026 ([Sacra](https://www.sacra.com/c/sierra)). For Decagon, valued at $4.5 billion in January 2026, one client reported 90% resolution without a person and another cut its support team by 80% ([Sacra](https://sacra.com/c/decagon/)).",
          "These are vendor-reported figures or analyst estimates, not audits, and no independent audit of any support agent's resolution rate was found in our research. Rates also depend heavily on the mix of questions: a brand whose tickets are mostly “where is my order” will see higher numbers than one handling warranty claims.",
        ],
      },
      {
        heading: "The Klarna lesson",
        paragraphs: [
          "Klarna made the most prominent bet. In February 2024 it said its AI assistant handled about two-thirds of chats, 2.3 million in the first month, and did the work of 700 agents. In May 2025 its CEO said that “cost unfortunately seems to have been a too predominant evaluation factor”, that this lowered quality, and that customers would always be able to reach a person; Klarna began recruiting human agents again ([Customer Experience Dive](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-ai-customer-service-buy-now-pay-later/747586/)).",
          "The pattern repeats across functions. The cases that hold up keep a person approving or supervising; in a December 2025 survey of martech leaders, 80.6% kept their AI agents in assist-only, human-in-the-loop mode ([chiefmartec, reported](https://newsletter.chiefmartec.com/p/here-s-your-ungated-copy-of-the-state-of-martech-2026-report)). Our [D2C research report](/research/d2c-marketing-tool-stack-agentic-commerce) shows the same pattern in AI sales outreach and in-chat checkout.",
        ],
        pullQuote: "Deflection is easy to measure and easy to overvalue. A customer who gives up is also a deflected ticket.",
      },
      {
        heading: "An illustrative cost comparison",
        paragraphs: [
          "This worked example is ours and uses made-up volumes, not any customer's data. Assume a brand receives 10,000 support conversations a month, the AI fully resolves 6,000 of them, and each conversation averages six AI messages. Applying only the published AI-agent prices above, before seats, platform fees and taxes:",
        ],
        bullets: [
          "Intercom Fin: 6,000 outcomes at $0.99 is about $5,940, more if configured hand-offs also count as outcomes.",
          "Zendesk pay-as-you-go: 6,000 resolutions at $2.00 is about $12,000, less with a commitment.",
          "Gorgias: 6,000 automated interactions at $0.85 to $1.00 is about $5,100 to $6,000.",
          "Salesforce Agentforce: at $2 per conversation for all 10,000 conversations, about $20,000; on Flex Credits at three actions per conversation, about $3,000.",
          "Freshdesk: 10,000 sessions at $49 per 100 is about $4,900 a month once the one-time 500 are used.",
          "Meta Business Agent: 60,000 messages at 4 to 5 US cents is about $2,400 to $3,000, plus any provider fee.",
          "Interakt: ₹2,499 plus 59,900 AI messages at ₹0.50 is about ₹32,449 a month.",
        ],
        callout: {
          title: "What the example does not show",
          body:
            "The spread is wide because the units differ, not only the prices. The cheapest line is not the cheapest system if its resolutions get reopened, if its hand-offs lose context, or if it runs on a channel your customers do not use. Seats for human agents, Copilot add-ons and the helpdesk itself are extra in every case.",
        },
      },
      {
        heading: "What to measure before you sign",
        paragraphs: [
          "The questions below are our checklist for a support-agent trial. They are designed to make vendors comparable on your own traffic rather than on their headline rate.",
        ],
        bullets: [
          "Billable unit: exactly what triggers a charge, and whether hand-offs, reopened tickets or abandoned chats are billed.",
          "Resolution quality: the share of “resolved” conversations that come back within seven days.",
          "Hand-off quality: whether the human agent receives the full conversation, the order and the customer record, or starts from zero.",
          "Actions: which tools the agent may call (refunds, address changes, cancellations) and which need a person's approval first.",
          "Data access: which customer and order fields the agent can read, and where those conversations are processed.",
          "Channel: whether the agent works where your customers write, which in India is often WhatsApp.",
          "Cost per truly resolved issue: total monthly cost divided by resolutions that stayed resolved.",
        ],
        callout: {
          title: "Agents that act on orders need the order",
          body:
            "A support agent that can only answer questions is a FAQ with better grammar. One that can check an order, raise a return or correct an address needs governed access to those records, with a person approving the consequential steps. That is the design behind our agentic ERP and CRM work.",
        },
      },
    ],
  },
];
