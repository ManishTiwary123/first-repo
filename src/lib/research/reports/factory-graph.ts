import type { ResearchReport } from "../types";

/**
 * Research report: running a manufacturer as a graph.
 * Facts checked on 2026-11-22. Section 8 (the schema) is our synthesis and is
 * labelled as such on the page.
 */
export const FACTORY_GRAPH_REPORT: ResearchReport = {
  slug: "manufacturing-knowledge-graph-ontology",
  shortTitle: "The factory knowledge graph",
  title: "Manufacturing Knowledge Graph and Ontology: 2026 Guide",
  h1: ["Run the factory as a graph,", "not as a pile of tables."],
  description:
    "How Palantir's Ontology, Fabric IQ, Celonis, ISA-95 and AAS model a manufacturer as a graph, plus an open schema you can build on PostgreSQL.",
  eyebrow: "Research · Knowledge graphs",
  lead:
    "ERP and CRM store a company as separate tables. The products that now sell “a digital twin of the organisation” store it as typed objects, links and governed actions, so one order can be followed from the quote to the machine to the inspection result. This report reads what Palantir, Microsoft, SAP, Salesforce, Celonis and the standards bodies have actually shipped, checks which open-source pieces are safe to build on, and ends with a proposed schema for a factory graph.",
  primaryKeyword: "manufacturing knowledge graph",
  keywords: [
    "palantir ontology",
    "enterprise ontology",
    "digital thread manufacturing",
    "ISA-95 data model",
    "asset administration shell",
    "context graph",
    "object-centric process mining OCEL 2.0",
    "graph database postgresql",
    "apache age",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 24,
  keyFindings: [
    {
      value: "Reverted",
      label: "SQL/PGQ graph queries were pulled from PostgreSQL 19 on 7 September 2026. The earliest return is PostgreSQL 20.",
      source: { label: "pgsql-committers", url: "https://www.postgresql.org/message-id/E1x3f62-00000003sxF-0zQO@gemulon.postgresql.org" },
    },
    {
      value: "Preview",
      label: "Microsoft's Fabric IQ ontology item was still labelled preview on its documentation page of 16 October 2026.",
      source: { label: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/fabric/iq/ontology/overview" },
    },
    {
      value: "10–15k h",
      label: "Engineering hours a year Ursa Major projects its Ontology-driven MES will save. A projection, not a measurement.",
      source: { label: "Ursa Major", url: "https://ursamajor.com/?p=1759" },
    },
    {
      value: "Archived",
      label: "Kuzu, an MIT-licensed graph database, was archived on 10 October 2025. Two of its three forks went quiet within a year.",
      source: { label: "The Register", url: "https://www.theregister.com/2025/10/14/kuzudb_abandoned/" },
    },
  ],
  summary: [
    "Palantir's Ontology is an operational layer over existing systems, not a replacement database. Its defining feature is that every change, by a person or an AI agent, goes through a named, governed action.",
    "The one detailed Warp Speed customer account (Ursa Major) says the Ontology-driven MES did not replace the systems it already relied on. A graph layered over existing records is the route anyone has actually shipped.",
    "SAP, Microsoft, Salesforce, ServiceNow, Celonis and Glean all now sell a “graph of the business for agents”. Each is a context layer over its own data, reached through MCP, and mostly read-only.",
    "No single standard covers a whole company, but W3C ORG, APQC, SCOR, BPMN, ISA-95, ISA-88, the Asset Administration Shell, PROV-O and OCEL 2.0 between them name almost every node and edge a factory needs.",
    "For a product already on PostgreSQL, the safest graph store in November 2026 is PostgreSQL itself: node and edge tables with recursive queries, with Apache AGE added if Cypher is needed.",
    "“Context graphs” (records of how decisions were made) are a real idea and a contested one. The hard part is keeping them accurate, which argues for deriving links from transactional keys instead of guessing them with a model.",
    "No published reference model joins office departments and the shop floor in one graph. Section 8 proposes one, mapped to the standards, and labels it as our synthesis.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "palantir-ontology",
      kicker: "Palantir's Ontology",
      title: "How does Palantir's Ontology work, and what is Warp Speed?",
      answer:
        "Palantir's Ontology is an operational layer over the systems a company already runs: typed objects and links describe the business, and governed action types are the only way anything changes, for people and AI agents alike. Warp Speed packages the same idea for manufacturing, and its one detailed customer account says it sits on top of ERP, MES and PLM rather than replacing them.",
      blocks: [
        {
          type: "p",
          text: "Palantir's own documentation defines it plainly: “The Palantir Ontology is an operational layer for the organization”, and “in many settings, the Ontology serves as a digital twin of the organization”. It sits on top of datasets, virtual tables and models and connects them to their real-world counterparts ([Palantir docs](https://www.palantir.com/docs/foundry/ontology/overview/)). It has two halves: a semantic half (objects, properties and links) and a kinetic half (actions, functions and dynamic security).",
        },
        {
          type: "p",
          text: "Palantir is explicit that “the Ontology is not a semantic layer”. It is built around four integrated parts (data, logic, action and security) and three components: a language for modelling objects and actions, an engine for reading and writing at scale, and a toolchain, the Ontology SDK ([Palantir platform summary](https://www.palantir.com/docs/foundry/getting-started/foundry-platform-summary-llm/)).",
        },
        {
          type: "table",
          caption: "The building blocks of Palantir's Ontology",
          columns: ["Element", "What it is (Palantir's definition)", "A factory example (ours)"],
          rows: [
            ["Object type", "Schema for an entity or event: properties, a primary key, a title and a backing data source. One row is one object.", "Work order, Machine, Inspection lot"],
            ["Link type", "A relationship between object types, with cardinality. Links can carry their own data.", "Work order → runs on → Machine"],
            ["Action type", "A set of changes to objects, properties and links, with parameters, rules, submission criteria and side effects such as notifications and webhooks.", "“Release work order”, allowed only if the BOM revision is approved"],
            ["Function", "Server-side TypeScript or Python that reads the ontology and makes edits.", "Recalculate a quote from current rates and routing"],
            ["Interface", "A shared property shape several object types implement (polymorphism).", "“Has location” for machines, bins and sites"],
          ],
          note: "Definitions from Palantir's platform summary and core-concepts pages. The right-hand column is our illustration, not Palantir's.",
        },
        {
          type: "p",
          text: "The design choice that matters most for AI is that agents act through the Ontology, not around it. AIP Chatbot Studio gives a chatbot tools that are actions, object queries, functions and commands. AIP Logic is a no-code LLM function that queries objects and can make ontology edits, and Automate triggers actions on time or data conditions ([Palantir platform summary](https://www.palantir.com/docs/foundry/getting-started/foundry-platform-summary-llm/)). Palantir's Ontology MCP is documented as exposing an application's object types, action types and query functions as MCP tools under OAuth 2.0, so an outside agent reads objects and writes only through predefined actions ([Palantir docs, reported](https://palantir.com/docs/foundry/ontology-mcp/sample-architecture/)).",
        },
        {
          type: "p",
          text: "Security is part of the model rather than an add-on: projects and organisations as boundaries, roles, markings for sensitive data, row- and column-level security, submission criteria checked before an action runs, justifications on sensitive actions, and audit logging. The graph view of the company is a separate tool, Vertex, which lets users “visualize and quantify cause and effect across the digital twin of your real-world organization” and simulate changes ([Palantir Vertex](https://www.palantir.com/docs/foundry/vertex/overview/)).",
        },
        { type: "h3", text: "Warp Speed: the manufacturing pitch" },
        {
          type: "p",
          text: "Warp Speed was introduced on Palantir's Q2 2024 earnings call on 5 August 2024. CTO Shyam Sankar called it “the modern American manufacturing operating system that reimagines how to bend atoms better with bits”, said ERP was designed in the 1970s for the CFO, and cited “$1 of license for $9 of implementation” ([Constellation Research](https://www.constellationr.com/blog-news/insights/palantir-q2-shines-us-enterprise-growth-accelerates-eyes-manufacturing-erp-warp)). The first cohort, announced in December 2024, was reported as Anduril Industries, L3Harris, Panasonic Energy of North America and Shield AI ([Business Wire, reported](https://www.businesswire.com/news/home/20241211204864/en/Palantirs-Inaugural-Warp-Speed-Cohort-to-Power-Manufacturing-and-Production-Capabilities-Through-Advanced-AI-Technology)).",
        },
        {
          type: "quote",
          text: "This isn't about replacing the systems we've relied on.",
          cite: "Ursa Major, on its AI-native, Ontology-driven MES (3 October 2025)",
          url: "https://ursamajor.com/?p=1759",
        },
        {
          type: "p",
          text: "Ursa Major's account is the most concrete one available. It describes an “AI-native, Ontology-driven manufacturing execution system” that links engineering data, shop-floor execution, MRP logic and SCADA, where “every disposition and root cause analysis feeds back into the Ontology, creating a closed-loop learning system”. It was deployed “in just a few months” and is “projected to save 10,000 to 15,000 hours of engineering time annually”, a projection rather than a measured result ([Ursa Major](https://ursamajor.com/?p=1759)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "The analyst view: powerful, and expensive to staff",
          text: "LNS Research (7 April 2026) finds that Palantir mostly “wraps and extends” existing systems, while building workflows that can circumvent the limits of traditional ERP, MES and historians. It calls the forward-deployed-engineer model “the single biggest success factor”, and also “expensive” and liable to “deepen dependency”: a poor fit for budget-conscious mid-size manufacturers. Palantir's latest annual revenue was $4.475 billion, up 56% ([LNS Research](https://blog.lnsresearch.com/where-palantir-won-c3-didnt-a-tale-of-two-industrial-ai-platforms)).",
        },
        { type: "h3", text: "Other “manufacturing operating systems”" },
        {
          type: "list",
          items: [
            "First Resonance calls ION a “Factory Operating System” and “a flexible, future-proof alternative to traditional MES”, with AI agents working alongside teams and an as-built BOM described as a living digital thread. Customers shown include Varda, Epirus, Astra and Machina Labs ([First Resonance](https://www.firstresonance.io/)).",
            "Cognite sells an Industrial Knowledge Graph in Cognite Data Fusion that links sensor data, maintenance records, equipment specifications and asset history. Its September 2026 release reportedly added an Industrial MCP in public preview so third-party agents can use the same governed graph ([Cognite, reported](https://www.cognite.com/en/resources/blog/cognite-september-2026-release)).",
            "Factories already run on graphs in research settings. Bosch's semantic-integration work over surface-mount production lines reports that roughly 70 to 80% of effort goes to data integration and only 20 to 30% to analysis ([Bosch, arXiv 2309.10550, reported](https://arxiv.org/pdf/2309.10550)), and Siemens has described an Industrial Knowledge Graph integrating each valve and control unit into one model ([Siemens, CEUR, reported](https://ceur-ws.org/Vol-2180/paper-86.pdf)).",
          ],
        },
        {
          type: "table",
          caption: "Open-source projects that resemble an ontology layer (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "What it is, and the catch"],
          rows: [
            ["[TrustGraph](https://github.com/trustgraph-ai/trustgraph)", "Apache-2.0", "≈3.2k", "v3.0.0-rc4 (21 Nov 2026)", "“The open-source ontology runtime for AI agents” on RDF, OWL, SHACL and PROV-O. Rejects extracted triples that break the ontology. Aimed at document-derived knowledge."],
            ["[BKN Foundry](https://github.com/openbkn-ai/bkn-foundry)", "Mixed (Apache-2.0 upstream files, “multi-licensed”)", "≈1.6k", "v0.2.1 (5 Nov 2026)", "Models the business as Object → Action → Rule → Constraint, with risk checks before actions. Back end only, young, licence needs reading."],
            ["[HASH](https://github.com/hashintel/hash)", "Mixed (MIT/Apache-2.0, AGPL-3.0, source-available parts)", "≈1.7k", "—", "Self-building knowledge graphs with a type system on PostgreSQL."],
            ["[HelixDB](https://github.com/HelixDB/helix-db)", "Apache-2.0", "≈6.3k", "v3.7.0 (11 Nov 2026)", "Graph database with vector and BM25 search, pitched at internal knowledge graphs of documents, people, tools and decisions."],
            ["[Cognite NEAT](https://github.com/cognitedata/neat)", "Apache-2.0", "21", "v1.1.0 (9 Sep 2026)", "A modelling helper between semantic-web models and Cognite Data Fusion, not a platform."],
          ],
          note: "A project named “OpenFoundry”, listed by aggregator sites as an open-source Foundry clone, returned 404 on GitHub on 22 November 2026 and is not included.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the part worth copying is small",
          text: "Five rules carry most of the value. Types are metadata. Objects are bound to rows in systems that already exist. Every change goes through a named action with parameters, submission criteria and side effects. Agents get exactly those actions as their tools. Permissions sit on objects and actions. None of this requires replacing an ERP, and none of it requires Palantir.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "vendor-graphs",
      kicker: "What vendors shipped",
      title: "What SAP, Microsoft, Salesforce, ServiceNow, Celonis and Glean have shipped",
      answer:
        "Every large vendor now sells a “graph of the business for agents”. Each is a context layer over its own data (definitions, relationships and bindings) that agents reach through MCP, and none replaces the transactional tables underneath. Microsoft's ontology was still in preview in October 2026; Celonis has the most developed model of events that touch many object types at once.",
      blocks: [
        {
          type: "table",
          caption: "Enterprise graph products, as documented in November 2026",
          columns: ["Vendor and product", "What it is", "Status and source"],
          rows: [
            ["Microsoft Fabric IQ ontology", "Entity types, relationships, metrics taken from Power BI measures, natural-language rules and bindings to live sources. Graph execution is optional.", "Titled “ontology (preview)” on the page dated 16 Oct 2026; the old experience retires 31 Jan 2027 ([Microsoft Learn](https://learn.microsoft.com/en-us/fabric/iq/ontology/overview))"],
            ["SAP Knowledge Graph", "Powers the Joule assistant alongside governed data products in SAP Business Data Cloud.", "Named in SAP's Sapphire post of 13 May 2026, with no availability label or figures ([SAP News](https://news.sap.com/2026/05/sap-bdc-accelerate-autonomous-enterprise/))"],
            ["Salesforce Data 360 data graphs", "A denormalised JSON object derived from lakehouse tables, optionally real-time.", "Summer '26 notes describe role-level security for agents and a Data 360 MCP server ([Salesforce Architects](https://architect.salesforce.com/fundamentals/data-360-architecture); [Trailhead, reported](https://trailhead.salesforce.com/content/learn/modules/summer-26-update-26213-release-highlights/see-whats-new-data-360-and-tableau))"],
            ["ServiceNow Context Engine and CMDB", "A Context Engine and Workflow Data Fabric with a data catalogue; CSDM 5.0 structures the CMDB.", "Launched at Knowledge 2026 per ServiceNow's release ([ServiceNow, reported](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-launches-the-real-time-data-foundation-that-puts-autonomous-AI-to-work-across-the-enterprise/default.aspx))"],
            ["Celonis Process Intelligence Graph", "An object-centric data model of object types, event types and their relationships, plus a process knowledge layer of KPIs.", "Announced at Celosphere 2023; called a “system-agnostic, digital twin” ([Celonis](https://www.celonis.com/blog/celonis-process-intelligence-graph-provides-a-common-language-for-enterprise-process-performance))"],
            ["Glean Enterprise Graph", "Relationships across people, projects, teams and processes, built “entirely using machine learning” from 275+ connectors, per customer tenant.", "Announced 25 Sep 2025 ([Glean](https://www.glean.com/product/enterprise-graph))"],
            ["Atlan, DataHub, OpenMetadata", "Metadata graphs of data assets, lineage, owners and glossaries, now sold as a “context layer” for AI with MCP servers.", "DataHub and OpenMetadata are Apache-2.0 ([DataHub](https://github.com/datahub-project/datahub); [OpenMetadata](https://github.com/open-metadata/OpenMetadata); [Atlan](https://atlan.com/))"],
          ],
        },
        {
          type: "p",
          text: "Microsoft's documentation is the clearest statement of the shared architecture. The ontology “stores and serves ontology definitions and bindings (it isn't itself a general-purpose data-query engine)”, and “source data remains in the system that owns it”. Graph is “an optional execution layer” for multi-hop traversal, dependency analysis and shortest paths, and Microsoft says this replaces its earlier framing in which every ontology had an automatically materialised instance graph ([Microsoft Learn](https://learn.microsoft.com/en-us/fabric/iq/ontology/overview)). It imports RDF, Turtle and OWL, and an “ontology agent” proposes changes that a person reviews before they apply.",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Conflicting reports on Fabric IQ's status",
          text: "The New Stack reported Fabric IQ as generally available at Build 2026 ([The New Stack, reported](https://thenewstack.io/microsoft-build-2026-data-fabric-horizondb-ai-agents/)). Directions on Microsoft (August 2026) and Atlan (October 2026) say the ontology item itself stayed in preview, and Microsoft Learn agrees with them. We treat the ontology as preview.",
        },
        { type: "h3", text: "Celonis and OCEL 2.0: work as many objects sharing events" },
        {
          type: "p",
          text: "Celonis's object-centric data model is “an extensible data representation of an entire business” holding object types, event types and their object-to-object and event-to-object relationships ([Celonis](https://www.celonis.com/blog/celonis-process-intelligence-graph-provides-a-common-language-for-enterprise-process-performance)). The open exchange format for this kind of data is OCEL 2.0, maintained by the Chair of Process and Data Science at RWTH Aachen: “Every event is associated with at least one object through an event-to-object relationship”, objects can relate to each other without sharing an event, and “both types of relationships can now be qualified” ([ocel-standard.org](https://www.ocel-standard.org/)). It is published in SQLite, XML and JSON forms ([OCEL 2.0 specification, arXiv 2403.01975](https://arxiv.org/pdf/2403.01975)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: read-mostly, and that is the gap",
          text: "These are context layers that agents read. Only Palantir puts writes behind the same model, through actions. For a factory that is the differentiator worth keeping: the graph should not only describe the order, it should be the only door through which the order changes. Glean infers its graph from activity with machine learning; Palantir and Microsoft have people declare it. A system that must never show invented data should declare its types and derive its links.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "digital-thread",
      kicker: "Digital thread vs twin",
      title: "Digital thread vs digital twin: how CAD, BOM, routing, machines and quality link up",
      answer:
        "The digital thread is the linked, versioned record of a product from requirement to service; the digital twin is a live model of a thing or a plant. In shipped products the thread lives inside a PLM vendor's own platform and the twin is increasingly a 3D scene fed by MES, quality and PLC data; the vendor-neutral way to carry the same links is the Asset Administration Shell with STEP AP242 for engineering data.",
      blocks: [
        {
          type: "p",
          text: "A September 2026 explainer defines the thread as the connected record of a product's data across its life: requirements, CAD, BOM, revisions, test results, service history. “A CAD BOM is a data structure, not a picture” ([Unity, reported](https://unity.com/kr/resources/digital-thread)). Siemens describes Teamcenter as connecting product structures, processes and decisions in a managed digital thread, which a model-based enterprise needs to carry its authoritative product definition across the lifecycle ([Siemens, reported](https://blogs.sw.siemens.com/teamcenter/model-based-enterprise/)).",
        },
        {
          type: "p",
          text: "The twin side moved in January 2026, when Siemens announced Digital Twin Composer at CES: it combines 2D and 3D twin data with real-time data from manufacturing execution, quality management, PLC code and industrial IoT in a scene built on NVIDIA Omniverse libraries. It was in early access with select customers. Siemens reported PepsiCo's early results as a 20% increase in throughput, capital expenditure down 10 to 15%, and up to 90% of potential issues found before physical changes ([Siemens](https://news.siemens.com/en-us/digital-twin-composer-ces-2026/)). These are vendor-reported figures.",
        },
        {
          type: "p",
          text: "The 3D format underneath is OpenUSD, governed by the Alliance for OpenUSD. Its founding members are Pixar, Adobe, Apple, Autodesk and NVIDIA, and its general members include Siemens, Hexagon, Foxconn, Microsoft, Bright Machines and IKEA ([aousd.org](https://aousd.org/)).",
        },
        { type: "h3", text: "The vendor-neutral thread: Asset Administration Shell submodels" },
        {
          type: "p",
          text: "The Asset Administration Shell publishes one standard submodel per aspect of an asset, so a machine or a product can carry its own structured record between companies ([IDTA submodel hub](https://industrialdigitaltwin.org/en/content-hub/submodels)).",
        },
        {
          type: "table",
          caption: "Published AAS submodel templates that carry a factory's thread",
          columns: ["IDTA number", "Template", "What it carries"],
          rows: [
            ["02006", "Digital Nameplate", "Manufacturer, model, serial and identity of the asset"],
            ["02003", "Technical Data", "Specifications in a standard structure"],
            ["02011-1", "Hierarchical Structures enabling Bills of Material", "The BOM as a structure other systems can read"],
            ["02004", "Handover Documentation", "Manuals, certificates and drawings delivered with the asset"],
            ["02017", "Asset Interfaces Description", "How to talk to it: Modbus, HTTP, MQTT, OPC UA, BACnet"],
            ["02067", "Production Calendar", "When the asset is planned to run"],
            ["02066", "Process Variables", "Manufacturing KPIs"],
            ["02023", "Carbon Footprint", "Product carbon data, relevant to EU product passports"],
          ],
          note: "Source: IDTA content hub, read 22 November 2026. The hub listed 29 published templates and 33 in development or review on that date (the page was truncated, so counts may be low).",
        },
        {
          type: "p",
          text: "For engineering geometry the neutral format is STEP AP242, “managed model-based 3D engineering”, which replaced AP203 and AP214. Edition 1 (December 2014) added dimensioning and tolerancing, kinematics and tessellation; edition 2 (April 2020) added wire harnesses, a SysML-based extension and additive manufacturing ([Wikipedia, ISO 10303](https://en.wikipedia.org/wiki/ISO_10303)). ISO lists an edition 4 published in 2025 ([ISO](https://www.iso.org/standard/84300.html)).",
        },
        { type: "h3", text: "The chain every vendor is linking" },
        {
          type: "list",
          ordered: true,
          items: [
            "Requirement",
            "CAD model, versioned",
            "Engineering BOM, then manufacturing BOM",
            "Routing or process plan",
            "Work order",
            "Operation on a machine, by a person",
            "Inspection result",
            "Lot or serial number",
            "Shipment, then service event",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the first thread is not 3D",
          text: "In graph terms the chain above is one path of “derived from”, “realises”, “runs on” and “inspected by” edges, which is why a graph suits it better than module-by-module tables. For a small or mid-sized manufacturer, the realistic first thread is the link from a drawing's revision to the BOM and work orders that used it, and from a quality finding back to that revision. A photoreal twin is a presentation layer over those links and needs them first. Our [CAD/CAM and CNC integration page](/cad-cam-cnc-integration) describes that first thread in practice.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "standards",
      kicker: "Standards and models",
      title: "Which standards define the nodes: ISA-95, ISA-88, AAS, OPC UA, APQC, SCOR, PROV-O",
      answer:
        "No single standard covers a whole company, but together they name almost every node and edge a factory graph needs: W3C ORG and schema.org for the organisation, APQC and SCOR for what departments do, BPMN and ArchiMate for processes and tools, ISA-95, ISA-88 and the Asset Administration Shell for the plant, PROV-O for who made what from what, and OCEL 2.0 or EPCIS for events.",
      blocks: [
        {
          type: "table",
          caption: "The standards, read by the question each one answers",
          columns: ["Question", "Standard", "Key terms", "Status"],
          rows: [
            ["Who is in the company?", "[W3C ORG](https://www.w3.org/TR/vocab-org/); [schema.org Organization](https://schema.org/Organization)", "Organization, OrganizationalUnit, Membership, Role, Post, Site; department, subOrganization, taxID, leiCode", "ORG: W3C Recommendation, 16 Jan 2014. schema.org V30.1, 16 Sep 2026"],
            ["What work exists?", "[APQC Process Classification Framework](https://resources.rework.com/libraries/process-management/apqc-process-classification-framework); [SCOR DS](https://en.wikipedia.org/wiki/Supply_chain_operations_reference)", "13 level-1 categories, five levels deep; Orchestrate, Plan, Order, Source, Transform, Fulfill, Return", "PCF 7.4 (Aug 2024), free with attribution; a version 8.0 is reported but unconfirmed"],
            ["How does a piece of work flow?", "[BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/About-BPMN); [ISA-88](https://en.wikipedia.org/wiki/ISA-88)", "Process, task, sequence flow; procedure, unit procedure, operation, phase", "BPMN 2.0.2: OMG, Jan 2014"],
            ["With what tools and machines?", "[ArchiMate 3.2](https://en.wikipedia.org/wiki/ArchiMate); [ISA-95](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard); [AAS](https://industrialdigitaltwin.org/en/content-hub/aasspecifications); [OPC UA companion specs](https://opcfoundation.org/about/opc-technologies/opc-ua/ua-companion-specifications/)", "Application component, equipment; Equipment Class and Equipment; submodels", "ArchiMate 3.2: Oct 2022. ISA-95 Part 1: 2025 edition"],
            ["On what material?", "[ISA-95 resource models](https://reference.opcfoundation.org/specs/OPC-10030/4.2.4); GS1 identifiers", "Material Class, Material Definition, Material Lot, Sublot; GTIN, GLN", "OPC 10030 maps ISA-95 to OPC UA"],
            ["What happened?", "[OCEL 2.0](https://www.ocel-standard.org/); [EPCIS](https://en.wikipedia.org/wiki/EPCIS)", "Events linked to many objects, with qualifiers", "EPCIS 2.0 ratified June 2022; 2.1 planned for the end of 2026"],
            ["Who made what from what?", "[W3C PROV-O](https://www.w3.org/TR/prov-o/)", "Entity, Activity, Agent; wasGeneratedBy, used, wasDerivedFrom, actedOnBehalfOf, wasRevisionOf", "W3C Recommendation, 30 Apr 2013"],
          ],
        },
        { type: "h3", text: "ISA-95 in one paragraph" },
        {
          type: "p",
          text: "ISA-95 (IEC 62264) builds on the Purdue model: Level 0 is the physical process, Level 1 sensing, Level 2 control (PLC, DCS), Level 3 manufacturing operations management (MES) and Level 4 business planning and logistics (ERP). The standard mainly addresses the interface between Levels 3 and 4 ([ISA](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard)). Its resource models separate class from instance throughout: “Each instance of the Personnel Class defines a role that a person can perform”, and the same pattern holds for equipment, physical assets and material, each with test specifications and results ([OPC 10030](https://reference.opcfoundation.org/specs/OPC-10030/4.2.4)).",
        },
        { type: "h3", text: "From the plant floor: Unified Namespace and Sparkplug" },
        {
          type: "p",
          text: "“The Unified Namespace is the structure and events of your business”: a hub, usually an MQTT broker, that every industrial component publishes to and reads from, with the ISA-95 hierarchy laid onto the topic tree as enterprise, site, area, line and cell ([HiveMQ](https://www.hivemq.com/unified-namespace-uns-essentials-iiot-industry-40/)). Sparkplug, from the Eclipse Sparkplug Working Group, adds a fixed topic format, payload format and state management on top of MQTT; its current specification is 3.0.0 ([sparkplug.eclipse.org](https://sparkplug.eclipse.org/)). MQTT itself is ISO/IEC 20922:2016.",
        },
        { type: "h3", text: "Between companies: data spaces and ontologies" },
        {
          type: "list",
          items: [
            "Catena-X, the automotive data space under Manufacturing-X, reportedly grew to 1,069 active participants in September 2026 from 182 in December 2025 ([Automotive Logistics, reported](https://www.automotivelogistics.media/supply-chain/more-thannbsp1000-oems-and-suppliers-now-exchanging-data-through-catena-x-network/2746686)). Its connector, Tractus-X EDC, is Apache-2.0 ([GitHub](https://github.com/eclipse-tractusx/tractusx-edc)).",
            "The Industrial Ontologies Foundry published release 202603 (tagged 9 October 2026): a core ontology extending BFO 2020, plus maintenance, supply chain, production planning and other domain ontologies ([IOF](https://spec.industrialontologies.org/portal/release/202603/)).",
            "FIBO, hosted by the EDM Council and standardised by the OMG, covers the financial side in OWL ([FIBO](https://spec.edmcouncil.org/fibo/)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: three ideas repeat across unrelated standards",
          text: "Type versus instance (ISA-95 class and equipment, AAS type and instance assets, OCEL object type and object). The role a participant plays sits on the relationship, not the participant (W3C ORG Membership, OCEL qualifiers, PROV roles). Hierarchy by containment (ISA-95, ISA-88, ORG). Build all three into the model from day one. And tag every department and automation with an APQC category: it gives every company the same top-level map under a free licence.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "building-blocks",
      kicker: "Open-source blocks",
      title: "Open-source graph building blocks, and which fit a product on PostgreSQL",
      answer:
        "For a product already on PostgreSQL, the safest path in November 2026 is to keep the graph in PostgreSQL: plain node and edge tables with recursive queries, adding Apache AGE if Cypher is needed. The SQL-standard graph feature was pulled from PostgreSQL 19, one popular embedded graph database was archived, and several others are licensed in ways that restrict embedding them in a product sold to customers.",
      blocks: [
        {
          type: "p",
          text: "SQL/PGQ (CREATE PROPERTY GRAPH and GRAPH_TABLE) was committed for PostgreSQL 19 on 16 March 2026 and reverted on the REL_19_STABLE branch on 7 September 2026: 125 files, 15,857 deletions, with no reason in the commit message beyond a link to a mailing-list thread ([pgsql-committers](https://www.postgresql.org/message-id/E1x3f62-00000003sxF-0zQO@gemulon.postgresql.org)). Neon's guide says the feature “will not ship in PostgreSQL 19”, that the earliest return is PostgreSQL 20 (expected September 2027), and that even the beta supported only fixed-depth patterns, so variable-length traversals need recursive queries anyway ([Neon](https://neon.com/postgresql/postgresql-19/sql-pgq-graph-queries)).",
        },
        {
          type: "p",
          text: "Apache AGE is the in-database alternative today: Apache-2.0, about 5,000 stars, release v1.8.0 on 19 September 2026, “an extension for PostgreSQL that enables users to leverage a graph database on top of the existing relational databases”, with openCypher and hybrid SQL-plus-Cypher queries ([apache/age](https://github.com/apache/age)).",
        },
        {
          type: "table",
          caption: "Graph databases: licence and activity (GitHub, read 22 November 2026)",
          columns: ["Database", "Licence", "Stars", "Latest release", "Note"],
          rows: [
            ["[Neo4j](https://github.com/neo4j/neo4j)", "GPL-3.0 (community repository)", "17.5k", "5.26.33 (4 Nov 2026)", "A separate server beside PostgreSQL"],
            ["[Memgraph](https://github.com/memgraph/memgraph)", "BSL 1.1 + enterprise licence", "4.7k", "v3.14.0 (21 Oct 2026)", "Internal use allowed; not embedding for third parties"],
            ["[Kuzu](https://github.com/kuzudb/kuzu)", "MIT", "4.0k", "v0.11.3 (10 Oct 2025)", "Archived, read-only since 10 Oct 2025"],
            ["[LadybugDB](https://github.com/LadybugDB/ladybug)", "MIT", "1.9k", "0.22.3 (7 Nov 2026)", "Active Kuzu fork; embedded, columnar, Cypher"],
            ["[ArangoDB](https://github.com/arangodb/arangodb)", "BSL 1.1 (Apache-2.0 after four years)", "14.3k", "v3.12.14 (19 Nov 2026)", "Not for third-party database offerings"],
            ["[JanusGraph](https://github.com/JanusGraph/janusgraph)", "Apache-2.0", "5.9k", "1.2.0 (28 Oct 2026)", "Distributed"],
            ["[TypeDB](https://github.com/typedb/typedb)", "MPL-2.0", "4.5k", "3.15.0 (16 Nov 2026)", "Relations with named roles; inheritance"],
            ["[TerminusDB](https://github.com/terminusdb/terminusdb)", "Apache-2.0", "3.5k", "v12.1.0-rc4 (21 Nov 2026)", "Git-like branch, merge and diff for graphs"],
            ["[SurrealDB](https://github.com/surrealdb/surrealdb)", "BSL 1.1", "33.3k", "4.0.1 (9 Nov 2026)", "May not be offered as a database service"],
            ["[FalkorDB](https://github.com/FalkorDB/FalkorDB)", "SSPL v1", "10.5k", "v6.2.0 (22 Nov 2026)", "SSPL is not OSI open source"],
            ["[Dgraph](https://github.com/dgraph-io/dgraph)", "Apache-2.0", "21.8k", "v25.5.1 (22 Oct 2026)", "Real-time graph database"],
            ["[Oxigraph](https://github.com/oxigraph/oxigraph)", "Apache-2.0", "2.1k", "v0.5.13 (22 Oct 2026)", "RDF store with SPARQL"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Single-sponsor risk: the Kuzu lesson",
          text: "Kuzu's repository was archived on 10 October 2025 with the note “Kuzu is working on something new”, leaving an MIT project “abandoned by its creator and sponsor” ([The Register](https://www.theregister.com/2025/10/14/kuzudb_abandoned/)). Of three forks, Bighorn was archived and RyuGraph had not been pushed since January 2026; LadybugDB is the active one. One vendor blog reports Apple agreed to acquire Kùzu Inc, a single secondary source ([PuppyGraph](https://www.puppygraph.com/blog/what-is-kuzudb)). Prefer foundation-governed projects, or the database you already run.",
        },
        {
          type: "table",
          caption: "Knowledge-graph, GraphRAG and agent-memory frameworks (GitHub, read 22 November 2026)",
          columns: ["Framework", "Licence", "Stars", "Latest release", "Note"],
          rows: [
            ["[Microsoft GraphRAG](https://github.com/microsoft/graphrag)", "MIT", "36.7k", "v3.3.0 (8 Oct 2026)", "“Not an officially supported Microsoft offering”; indexing “can be an expensive operation”"],
            ["[LightRAG](https://github.com/HKUDS/LightRAG)", "MIT", "40.8k", "v1.5.8rc2 (21 Nov 2026)", "PostgreSQL as an all-in-one storage option"],
            ["[Graphiti](https://github.com/getzep/graphiti)", "Apache-2.0", "33.0k", "v0.31.2 (20 Oct 2026)", "Temporal context graphs; every fact has a validity window"],
            ["[Cognee](https://github.com/topoteretes/cognee)", "Apache-2.0", "33.5k", "v1.6.10 (18 Nov 2026)", "Postgres as a graph store is a demo; production version is licensed"],
            ["[LlamaIndex](https://github.com/run-llama/llama_index)", "MIT", "53.0k", "v0.14.26 (13 Nov 2026)", "Property-graph index with schema-guided extraction"],
            ["[mem0](https://github.com/mem0ai/mem0)", "Apache-2.0", "69.3k", "v2.2.1 (25 Sep 2026)", "“The Memory Layer for AI Agents”"],
          ],
        },
        {
          type: "table",
          caption: "Ontology, process-mining and lineage tools",
          columns: ["Tool", "Licence", "Latest release", "Use"],
          rows: [
            ["[LinkML](https://github.com/linkml/linkml)", "Apache-2.0", "v1.12.1 (13 Oct 2026)", "Models written in YAML, converted to JSON or RDF schema forms"],
            ["[Protégé](https://github.com/protegeproject/protege)", "BSD-style", "6.0.0-alpha-1 (28 Sep 2026)", "Desktop OWL editor"],
            ["[pm4py](https://github.com/process-intelligence-solutions/pm4py)", "AGPL-3.0 (commercial licence offered)", "2.7.23.13 (20 Nov 2026)", "Process mining in Python, with OCEL support"],
            ["[OpenMetadata](https://github.com/open-metadata/OpenMetadata)", "Apache-2.0", "2.1.0 (20 Nov 2026)", "Metadata knowledge graph, lineage, glossary, MCP"],
            ["[DataHub](https://github.com/datahub-project/datahub)", "Apache-2.0", "v1.9.1 (19 Nov 2026)", "Metadata graph, column-level lineage, MCP"],
            ["[OpenLineage](https://github.com/OpenLineage/OpenLineage)", "Apache-2.0", "1.55.0 (30 Oct 2026)", "Open standard for lineage collection"],
          ],
        },
        { type: "h3", text: "Fit for a PostgreSQL product, in order of least risk" },
        {
          type: "list",
          ordered: true,
          items: [
            "Node and edge tables with indexes on both ends, and recursive queries with a hop limit. No new dependency, same transactions, same backups. If SQL/PGQ returns in PostgreSQL 20, these are exactly the tables CREATE PROPERTY GRAPH maps over.",
            "Apache AGE over the same database when multi-hop pattern queries become awkward in SQL.",
            "An embedded analytical engine such as LadybugDB only for heavy graph analytics, fed from the tables above.",
            "A separate graph server (Neo4j, Memgraph, FalkorDB) last: it creates a second source of truth and a sync problem, which is the very thing Microsoft moved away from by making graph execution optional.",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: GraphRAG is for documents, keys are for records",
          text: "GraphRAG-style frameworks build a graph by having a model read text. That suits drawings' notes, emails and chat history. It does not suit transactional records, where the links are already known exactly from keys: this invoice was made from this order. Derive those links from the keys. Store any link a model extracts from text with a “suggested by AI, not confirmed” status until a person accepts it.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "context-graphs",
      kicker: "Context graphs",
      title: "What is a context graph, and how does it relate to agent memory?",
      answer:
        "A context graph is a record of how decisions were actually made (who approved what, under which rule, with which exception and evidence) linked to the records involved and kept over time so precedent can be searched. Its promoters call it the next system of record; Forrester calls it a convergence of things enterprises half-have already, and warns that accuracy is the hard part. For an agent it is episodic memory, which still needs facts and procedures beside it.",
      blocks: [
        {
          type: "quote",
          text: "A living record of decision traces stitched across entities and time so precedent becomes searchable.",
          cite: "Jaya Gupta and Ashu Garg, Foundation Capital, “AI's trillion-dollar opportunity: Context graphs”",
          url: "https://foundationcapital.com/context-graphs-ais-trillion-dollar-opportunity/",
        },
        {
          type: "p",
          text: "The essay, described by InfoWorld as a December 2025 paper, argues that “the reasoning connecting data to action was never treated as data in the first place”: exception logic held in people's heads, precedent, approvals given in chat or on calls. Rules state intent; a decision trace records how a rule was applied in one case, with the policy version, exceptions, precedent and approvals. It names three routes for startups: replace the system of record, replace modules while syncing back, or start as an orchestration layer that persists traces ([Foundation Capital](https://foundationcapital.com/context-graphs-ais-trillion-dollar-opportunity/); [InfoWorld](https://www.infoworld.com/article/4156909/contexts-graphs-ai-memory-and-enterprise-knowledge-are-decision-traces-enough.html)).",
        },
        {
          type: "p",
          text: "The authors' own follow-up concedes the limit: intent cannot be observed, so “you capture the how” and infer the why from patterns. It quotes PlayerZero's Animesh Koratana, “The schema isn't the starting point. It's the output”, and lists open questions about ownership, retention and ageing: “Decisions have a half-life” ([Foundation Capital, one month in](https://foundationcapital.com/context-graphs-one-month-in/)).",
        },
        {
          type: "quote",
          text: "The decision trace layer isn't missing. It's fragmented … persistence is never the hard part — fidelity is.",
          cite: "Charles Betz, Forrester, “Context Graphs Are A Convergence, Not An Invention” (10 April 2026)",
          url: "https://www.forrester.com/blogs/context-graphs-are-a-convergence-not-an-invention/",
        },
        {
          type: "p",
          text: "Forrester points out that CMDBs, application traces, process mining, incident records and architecture decision records have each been building pieces of this graph for decades, and that traces without an accurate entity graph underneath “float without grounding”. Writing in InfoWorld, Memgraph's CEO Dominik Tomicevic argues decision traces cover only the episodic layer, and that “serious AI requires all three types of reasoning”: episodic, semantic and procedural. In his framing the ERP and CRM stay the systems of record and the context graph is “a kind of operational memory” ([InfoWorld](https://www.infoworld.com/article/4156909/contexts-graphs-ai-memory-and-enterprise-knowledge-are-decision-traces-enough.html)).",
        },
        {
          type: "p",
          text: "The closest working implementation is Graphiti, which defines a context graph as “a temporal graph of entities, relationships, and facts” where “each fact in a context graph has a validity window” ([Graphiti](https://github.com/getzep/graphiti)). The Zep paper behind it keeps two timelines, when an event happened and when the system learned of it, and invalidates superseded facts instead of deleting them ([arXiv 2501.13956](https://arxiv.org/abs/2501.13956)).",
        },
        {
          type: "table",
          caption: "Three kinds of memory, in a factory (examples are ours)",
          columns: ["Memory", "What it holds", "Factory example"],
          rows: [
            ["Episodic", "Decisions and their outcomes, in time", "A credit-limit override approved by the finance head, with the reason typed at the time"],
            ["Semantic", "Facts and meanings", "The customer, its open orders, the part's current revision"],
            ["Procedural", "How work is done", "The steps for releasing a work order, and the rule that a BOM must be approved first"],
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the traces exist, the links do not",
          text: "A system where people and agents act through the same governed actions already records most of a decision: an edit log with old and new values, approvals bound to the approver's role and limit, overrides with a stated reason, each agent run's tool calls. What turns those logs into a context graph is linking: a Decision node per approval, rejection or override, with edges to the record decided, the person deciding, the rule that applied and its value at that moment, the evidence looked at, and earlier similar decisions. State the limits honestly: the system records what was done and the reason a person typed, not what they were thinking, and a decision made on a phone call is not captured unless someone records it.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "visualisation",
      kicker: "Visualising the graph",
      title: "How to visualise a company-sized graph without drawing all of it",
      answer:
        "No product draws a whole company at once: they show a curated map at each level and let the user expand or drill in. DOM-based canvases such as React Flow suit hundreds of rich, editable nodes; WebGL libraries such as Sigma.js, cosmos.gl or Cytoscape's WebGL mode are for thousands to hundreds of thousands of simple dots in an overview.",
      blocks: [
        {
          type: "table",
          caption: "Graph visualisation libraries (GitHub, read 22 November 2026)",
          columns: ["Library", "Licence", "Renderer", "Best for"],
          rows: [
            ["[React Flow / xyflow](https://github.com/xyflow/xyflow)", "MIT", "DOM and SVG", "Rich, editable cards; collapse trees by hiding nodes ([performance guide](https://reactflow.dev/learn/advanced-use/performance))"],
            ["[Cytoscape.js](https://github.com/cytoscape/cytoscape.js)", "MIT", "Canvas; WebGL preview since 3.31", "Analysis-style graphs up to a few thousand nodes"],
            ["[Sigma.js](https://github.com/jacomyal/sigma.js)", "MIT", "WebGL", "“Graphs of thousands of nodes and edges”"],
            ["[cosmos.gl](https://github.com/cosmosgl/graph)", "MIT", "WebGL 2, layout on the GPU", "Very large overviews; not on Android devices lacking a float-texture extension"],
            ["[AntV G6](https://github.com/antvis/G6)", "MIT", "Canvas, SVG, WebGL", "Many layouts, some GPU- and Rust-accelerated"],
            ["[3d-force-graph](https://github.com/vasturiano/3d-force-graph)", "MIT", "Three.js / WebGL", "Demos and exploration in 3D"],
          ],
        },
        {
          type: "p",
          text: "Cytoscape's own preliminary tests of its WebGL renderer on an M1 MacBook Pro show the gain and its ceiling: about 1,200 nodes and 16,000 edges went from about 20 to over 100 frames per second, while about 3,200 nodes and 68,000 edges went only from about 3 to about 10 ([Cytoscape.js blog](https://blog.js.cytoscape.org/2025/01/13/webgl-preview/)). Reviews caution that most performance claims for these libraries are unverified, so benchmark on your own graph.",
        },
        { type: "h3", text: "Patterns from shipped products" },
        {
          type: "list",
          items: [
            "Curated system graphs with drill-in: Palantir Vertex shows graphs the organisation has “curated and published”, with related time series and simulation ([Palantir](https://www.palantir.com/docs/foundry/vertex/overview/)).",
            "Graph only where the path matters: Microsoft keeps lookups and totals on source systems and uses graph execution for multi-hop, reachability and shortest-path questions ([Microsoft Learn](https://learn.microsoft.com/en-us/fabric/iq/ontology/overview)).",
            "Lineage views: DataHub's column-level lineage traces data from source to consumption, and its root-cause lineage serves incidents ([DataHub](https://github.com/datahub-project/datahub)).",
            "A live 3D plant: Siemens overlays MES, quality, PLC and IoT data on a 3D scene ([Siemens](https://news.siemens.com/en-us/digital-twin-composer-ces-2026/)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: three views over one graph",
          text: "A company map of departments, people, agents and tools (tens to low hundreds of nodes) as rich cards. A thread view for one thing, such as an order, a part revision or a machine, as a left-to-right layered graph of what it came from and what it led to: small by construction, and the view that explains the idea to a buyer. An optional whole-graph overview in WebGL for orientation and search. The server should always return a bounded neighbourhood (hops, type filter, row limit) with a “more” count per node, which is also where each person's permissions are applied. You can try a simulated version on our [Factory Graph page](/factory-graph).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "schema",
      kicker: "A proposed schema",
      title: "A proposed factory graph schema: node and edge types mapped to the standards",
      answer:
        "This schema is our synthesis, not a published standard: about thirty node types in seven groups and about thirty-five edge types, each mapped to the nearest term in ISA-95, AAS, W3C ORG, PROV-O, OCEL 2.0, BPMN or ArchiMate. It rests on five rules borrowed from the products and standards above.",
      blocks: [
        {
          type: "callout",
          tone: "caution",
          title: "What this section is, and is not",
          text: "We found no published reference model that joins office departments (design, marketing, software, finance, HR) and the factory floor in one graph. The nearest are Palantir's ontology (proprietary and per customer), ArchiMate (architecture description, not operations) and the IOF (manufacturing ontologies). The model below has not been tested against a real customer's data, and several standard terms in the mapping column should be checked against the specifications before anyone claims conformance.",
        },
        { type: "h3", text: "Five design rules" },
        {
          type: "list",
          ordered: true,
          items: [
            "Type and instance are different nodes: Product and Lot, Process and Run, Tool and Connection, Role and the person holding it.",
            "Every edge has a type, an optional qualifier (the role played), the dates it was true, the date the system learned it, and an origin: derived from a key, declared by a person, or suggested by an AI agent and not yet confirmed. Suggested edges are never shown as fact.",
            "Events are their own layer: one event, many linked objects, each link qualified (actor, subject, input, output, location), as in OCEL 2.0.",
            "Nothing changes except through an action type that states who may perform it, under which limit, and whether it waits for approval. People and agents use the same actions.",
            "Nodes for business records are read through from the existing tables (same id), not copied. Only links that no table holds, such as a design file to a BOM, are stored as new rows.",
          ],
        },
        {
          type: "table",
          caption: "Node types (synthesis)",
          columns: ["Group", "Node types", "Nearest standard terms"],
          rows: [
            ["Organisation", "Organization, Site, Department, Role, Position, Person, Agent", "W3C ORG; schema.org; ISA-95 Personnel Class and Person; PROV SoftwareAgent"],
            ["Tools", "Tool, Connection (the company's account or installation), Workspace, Action type", "ArchiMate application component; AAS Asset Interfaces Description; MCP tool"],
            ["Artifacts", "Artifact (CAD model, drawing, BOM, routing, repository, creative), Artifact version", "PROV Entity and wasRevisionOf; STEP AP242; AAS Handover Documentation"],
            ["Records", "Record (lead, quote, order, invoice, work order, inspection, ticket), Customer, Supplier, Product, Lot or Serial", "OCEL object; ISA-95 Material Definition, Lot and Sublot; GS1 GTIN"],
            ["Process", "Process, Step, Run, Event", "APQC process; BPMN process and task; ISA-95 operations definition and segment; ISA-88 procedure; OCEL event"],
            ["Physical", "Workcenter, Machine, Storage location, Signal", "ISA-95 work center, equipment and storage unit; AAS; OPC UA; Sparkplug metric"],
            ["Governance", "Rule, Decision, Approval, Metric, Goal", "Fabric IQ rule and metric; Palantir submission criteria; decision trace; SCOR metrics"],
          ],
        },
        {
          type: "table",
          caption: "Edge types (synthesis)",
          columns: ["Group", "Edges", "Nearest standard terms"],
          rows: [
            ["Structure", "PART_OF, LOCATED_AT, MEMBER_OF, HOLDS (with qualifier), REPORTS_TO, ACTS_FOR", "ORG unitOf, basedAt, memberOf, Membership, reportsTo; PROV actedOnBehalfOf"],
            ["Tools", "USES, OFFERS, MAY_PERFORM (with limit and approval), CONTAINS, SYNCS_WITH", "ArchiMate serving, access and flow; Palantir action permissions; OpenLineage"],
            ["Work", "PRODUCES, CONSUMES, DERIVED_FROM, REVISION_OF, DEPENDS_ON, NEXT, TRIGGERS, INSTANCE_OF, ASSIGNED_TO, OWNS, PERFORMED_BY, INVOLVES, RELATED_TO", "PROV wasGeneratedBy, used, wasDerivedFrom; BPMN sequence flow; OCEL event-to-object and object-to-object"],
            ["Manufacturing", "HAS_COMPONENT (quantity, unit), DEFINED_BY, MADE_BY, RUNS_ON, NEEDS_SKILL, INSPECTS, STORED_AT, SUPPLIES, ORDERED", "AAS BOM structure; AP242; ISA-95 equipment, personnel and test results; EPCIS “where”; SCOR Source and Order"],
            ["Governance", "GOVERNED_BY, DECIDED, ABOUT, APPLIED, EXCEPTION_TO, EVIDENCED_BY, PRECEDENT, MEASURES", "Decision traces; Fabric IQ rule links; SCOR metrics"],
          ],
        },
        { type: "h3", text: "A storage shape that fits PostgreSQL" },
        {
          type: "list",
          items: [
            "Two metadata tables for node types and edge types: allowed source and target types, qualifiers, and the standard term each maps to.",
            "Existing records exposed as views over the existing tables; a small nodes table only for types with no table today (tool, connection, workspace, artifact, artifact version, rule, decision).",
            "One edges table: type, source and target (type and id), qualifier, properties, valid-from, valid-to, recorded-at and origin, indexed on both ends.",
            "An events table plus an event-objects table in the OCEL 2.0 shape, so the log can be exported to OCEL for process mining without a redesign.",
            "Traversal by recursive query with a hop limit and each person's permissions applied per node type; Apache AGE can be added over the same tables later.",
          ],
        },
        {
          type: "p",
          text: "This is the model behind our [Factory Graph](/factory-graph) work: connect the systems a manufacturer already runs, relate their records, and put changes behind approved actions. If you want to see where your own systems would sit on it, an [industrial systems audit](/industrial-systems-audit) is the starting point.",
        },
      ],
    },
  ],
  method: [
    "Repository figures (stars, licence, latest release) were read from GitHub on 22 November 2026. Vendor product status comes from each vendor's own documentation or release notes, linked in place.",
    "Some sources could only be read through a search-result summary because the page was blocked or behind a sign-in. Those are marked “reported” in the text.",
    "Palantir's Warp Speed page returned no readable text, SAP's product page and some PTC and Dassault pages returned errors, and Collibra was not researched, so nothing is asserted about them beyond what is cited.",
    "Section 8 is our own synthesis. It has not been validated against a customer data set, and node and edge counts and query times at company scale remain to be measured.",
  ],
  faq: [
    {
      q: "What is a manufacturing knowledge graph?",
      a: "A model of a manufacturer as typed things (orders, parts, revisions, machines, people) and the relationships between them, kept up to date from the systems that hold the records. Its value is following one thing across departments: from a quote to the drawing revision, the work order, the machine that ran it and the inspection result.",
    },
    {
      q: "Is Palantir's Ontology a graph database?",
      a: "No. Palantir describes it as an operational layer over existing data: object and link types bound to data sources, plus action types that are the governed way to change anything. Palantir explicitly says the Ontology “is not a semantic layer”, and its graph view, Vertex, is a separate tool.",
    },
    {
      q: "Do I need Neo4j or another graph database to build one?",
      a: "Not to start. If your systems already run on PostgreSQL, node and edge tables with recursive queries cover the bounded, few-hop questions most factory views ask, and Apache AGE adds Cypher inside the same database. A separate graph server adds a second source of truth to keep in sync. Check licences carefully: several popular graph databases use BSL or SSPL terms that restrict embedding them in a product.",
    },
    {
      q: "What is the difference between a digital twin and a digital thread?",
      a: "The digital thread is the linked, versioned record of a product across its life, from requirement and CAD revision through BOM, routing, production, inspection and service. A digital twin is a live model of a specific asset or plant, often a 3D scene fed with machine and MES data. A twin needs the thread's links to explain what it shows.",
    },
    {
      q: "Which standards should a factory data model follow?",
      a: "ISA-95 for the plant and its interface to ERP, ISA-88 for batch processes, the Asset Administration Shell for asset records you may need to share, STEP AP242 for engineering geometry, OPC UA and MQTT with Sparkplug for machine data, and W3C PROV-O or OCEL 2.0 for events and provenance. APQC's Process Classification Framework is a free way to give every department a common top-level map.",
    },
    {
      q: "What is a context graph?",
      a: "A record of how decisions were made, linked to the records and rules involved and kept over time so similar past cases can be found. The idea was popularised by Foundation Capital; Forrester argues the pieces already exist across CMDBs, logs and process-mining tools, and that keeping the underlying entity graph accurate is the real difficulty.",
    },
    {
      q: "Does a knowledge graph replace the ERP?",
      a: "Not in any product we found. Palantir's own customer account says its system did not replace existing ones, Microsoft's ontology leaves source data where it is, and SAP calls the ERP the trusted system of record. The graph is a layer that relates records across systems and, at its best, governs how they change.",
    },
    {
      q: "Can AI build the graph automatically?",
      a: "Partly, and only where the links are not already known. Links between transactional records should come from their keys, which is exact. A model can propose links from documents, emails or drawings, but those should be stored as suggestions until a person confirms them, because a wrong link in a factory graph sends the wrong revision to the shop floor.",
    },
  ],
  platformLinks: ["factoryGraph", "cadCam", "iot", "agentic", "audit"],
  relatedReports: [
    "manufacturing-software-stack-cad-cam-plm-mes",
    "future-of-erp-crm-agentic-ai",
    "embed-stream-integrate-specialist-software",
  ],
  blogSlugs: ["palantir-ontology-explained", "context-graphs-decision-traces"],
};
