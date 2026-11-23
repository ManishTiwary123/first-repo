/**
 * Research-desk posts written from the report
 * src/lib/research/reports/manufacturing-software.ts
 * (/research/manufacturing-software-stack-cad-cam-plm-mes).
 */
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

const REPORT = "/research/manufacturing-software-stack-cad-cam-plm-mes";

export const MANUFACTURING_SOFTWARE_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "text-to-cad-benchmarks-2026",
    title: "Text-to-CAD in 2026: What AI Can and Can't Model, by the Benchmarks",
    subtitle:
      "Four benchmarks published in 2025 and 2026 tested whether language models can turn a description into a usable CAD part. They agree on where it works, where it breaks, and why.",
    excerpt:
      "Four 2025–2026 benchmarks show AI handles simple parts and edits to parametric code, struggles with sweeps, lofts and exact dimensions, and does best when it runs the kernel.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "auditLens",
    tags: ["cad", "ai-agents", "manufacturing", "benchmarks"],
    keywords: {
      primary: "text to CAD",
      secondary: ["AI CAD generation", "CadQuery LLM", "text to CAD benchmark", "Fusion MCP server", "AI for mechanical design"],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    relatedSlugs: ["indian-msme-software-adoption-2026", "mcp-for-erp-crm-agents", "solidworks-in-browser-streaming-licences"],
    crossPageLinks: [
      { href: REPORT, label: "The manufacturing software stack", note: "the full research report this article comes from" },
      { href: "/cad-cam-cnc-integration", label: "CAD/CAM and CNC integration", note: "linking drawings, revisions and programs to production" },
      { href: "/industrial-systems-audit", label: "Industrial systems audit", note: "a free first conversation about your systems" },
    ],
    popularityScore: 74,
    featured: false,
    takeaways: [
      "Language models are reliable at simple prismatic parts and at editing existing parametric code, and unreliable at sweeps, lofts, shells, threads and exact dimensions.",
      "Writing CadQuery code beat emitting CAD command sequences, and specialist fine-tuned text-to-CAD models scored near zero on geometric match in a 2026 benchmark.",
      "Letting the agent run the CAD kernel and read test results lifted pass rates; feeding it rendered images did not, and cost more tokens.",
      "Official agent interfaces are still rare: in the sources found, only Autodesk (Fusion MCP) and PTC (Onshape FeatureScript MCP) offered them.",
      "Use it today for edits and simple fixtures, with a person checking every dimension, not for complex surfacing or standard parts.",
    ],
    sections: [
      {
        heading: "Why text-to-CAD became a practical question this year",
        paragraphs: [
          "For most of the last decade, “describe a part and get a model” was a research demo. In 2026 it became a product category. Zoo launched Zookeeper on 5 February 2026, a conversational CAD agent that builds and edits models written in its KCL language, inspects its own result through snapshots and searches the web for datasheets; it costs $0.50 a minute after a $10 free credit, or $20 and $99 a month on its plans ([Zoo](https://zoo.dev/blog/announcing-zookeeper)). Autodesk shipped two official MCP servers for Fusion, one local and one remote ([Engineering.com](https://www.engineering.com/autodesk-announces-fusion-mcp-servers-and-more-ai-updates/)), and PTC put a FeatureScript MCP Server for Onshape into Onshape Labs on 13 August 2026 so Claude, ChatGPT or Gemini can write and test custom parametric features ([PTC](https://www.nasdaq.com/press-release/ptc-advances-leadership-ai-driven-design-launch-onshape-featurescript-mcp-server-2026)).",
          "Open source moved too. Adam's CADAM is a GPL-3.0 browser tool that turns text into OpenSCAD code and runs OpenSCAD as WebAssembly, so the whole loop happens in a browser tab ([CADAM on GitHub](https://github.com/Adam-CAD/CADAM)). And the money followed: Leo AI raised a $9.7 million seed in September 2025 for an engineering copilot ([Pulse 2.0](https://pulse2.com/leo-ai-9-7-million-raised-for-transforming-mechanical-engineering)), unrelated to Dassault's SOLIDWORKS companion that happens to share the name LEO.",
          "With that much shipping, the useful question is no longer whether AI can make a CAD part. It is which parts, how often, and how you would know when it got one wrong. Four benchmarks published between May 2025 and May 2026 answer that more clearly than any vendor demo. The full tool landscape is in our [manufacturing software research](/research/manufacturing-software-stack-cad-cam-plm-mes); this article focuses on what the measurements say.",
        ],
      },
      {
        heading: "What the four benchmarks measured",
        paragraphs: [
          "The benchmarks differ in set-up, but all of them ask a model to produce parametric CAD code and then check the geometry that code produces. That last step matters: a model that writes plausible-looking code is not the same as a model that writes a correct part.",
        ],
        bullets: [
          "Text-to-CadQuery (May 2025) built about 170,000 pairs of descriptions and CadQuery programs and fine-tuned six models from 124 million to 7 billion parameters. The best, Qwen2.5-3B, cut median Chamfer distance by about 48% against the Text2CAD baseline with a 6.5% invalid rate ([arXiv 2505.06507](https://arxiv.org/html/2505.06507v1)).",
          "Text2CAD-Bench (May 2026) used 600 human-curated tasks in four tiers. General models writing CadQuery executed 88.9% of tier 1 and 80.0% of tier 2 tasks (GPT-5.2), but on tier 3, which needs sweeps, lofts and shells, Claude 4.5 Sonnet and GPT-5.2 managed only 30 to 32% with an IoU of about 0.25. On real-world tier 4 designs no model led on executability, geometric similarity and feature fidelity together ([arXiv 2605.18430](https://arxiv.org/html/2605.18430v1)).",
          "CADTestBench (May 2026) attached 5,937 executable geometric and topological tests to 200 prompts. Pass rates on detailed and abstract prompts were 2.5% and 8.5% for Text2CAD, 48% and 69.5% for a GPT-5.2 agent, 58% and 71.5% for a Claude 4.6 Sonnet agent, and 62.5% and 81% for Claude 4.6 Sonnet given the tests and geometry logs as feedback ([arXiv 2605.07807](https://arxiv.org/html/2605.07807v1)).",
          "BenchCAD (May 2026) assembled 17,900 verified CadQuery programs across 106 industrial part families, about half tied to ISO, DIN or ASME tables. Turning an image into CAD code was weak (Gemini 3.1 Pro scored about 0.32 to 0.40), while editing existing code was strong: 0.865 for GPT-5.3 thinking and 0.853 for Claude Opus 4.7 thinking ([arXiv 2605.10865](https://arxiv.org/html/2605.10865)).",
        ],
      },
      {
        heading: "Where the models break",
        paragraphs: [
          "The failures cluster in the same places across all four papers, and they are exactly the places a manufacturing engineer would worry about. Complex surfacing is the first: the drop from about 80% executable on tier 2 to about 30% on tier 3 in Text2CAD-Bench is the clearest single number in the set. When a part needs a sweep along a path, a loft between profiles or a shelled body, today's general models mostly fail.",
          "The second cluster is precision. CADTestBench found that dimensional, topological and spatial-arrangement requirements were the hardest to satisfy. BenchCAD found that models recover the outer shape of a part but miss threads and chamfers, misread parameters that come from a standard (a bolt-hole pattern from a DIN table, for example) and quietly substitute a simple extrude where the design called for a sweep or a loft. A part that looks right in a viewer and is 0.5 mm off on a mating face is worse than no part, because someone might machine it.",
          "The third finding is about what does not help. In CADTestBench, giving the agent rendered images of its own output as feedback did not improve results and cost many more tokens. Looking at a picture of a part is not how you check a part.",
        ],
        callout: {
          title: "A naming trap worth knowing",
          body: "Specialist models trained only for text-to-CAD did badly. In Text2CAD-Bench the fine-tuned Text2CAD and CADFusion models scored near-zero IoU, well behind general models writing CadQuery. Bigger and more general beat narrow and specialised here.",
        },
      },
      {
        heading: "Why code-CAD plus an execute-and-check loop wins",
        paragraphs: [
          "Two design choices separate the better results from the worse ones. The first is the output format. Text-to-CadQuery argues that CadQuery is the right target because it is plain Python that pretrained models already write well, and because it can be “executed directly without any external software dependencies”. Text2CAD-Bench confirmed it from the other side: emitting CadQuery code beat emitting command sequences.",
          "The second is feedback from the kernel itself. The biggest single jump in CADTestBench came from letting the model see the results of executable tests and geometry logs, taking Claude 4.6 Sonnet from 71.5% to 81% on abstract prompts. That is the loop a careful engineer runs anyway: change the model, regenerate, measure, fix. An agent with access to the same loop behaves more like that engineer.",
          "This has a practical consequence for how you set agents up. An agent that writes parametric code in CadQuery, build123d, OpenSCAD, KCL or FeatureScript, runs it in a sandbox and checks the result against explicit tests is a better bet than one that drives a desktop CAD application through screenshots. Open-source code-CAD tools are well suited to the first approach: CadQuery (Apache-2.0, v2.8.0) is a pure Python library that runs server-side with no GUI ([CadQuery](https://github.com/CadQuery/cadquery)), build123d (Apache-2.0, v0.13.0) is the other main Python code-CAD library, and FreeCAD has a headless console with a full Python API.",
        ],
      },
      {
        heading: "A worked example: editing a fixture plate (illustrative)",
        paragraphs: [
          "The following is an illustration of the pattern the benchmarks favour, not a customer case. A tooling engineer has a parametric CadQuery model of a 10 mm aluminium fixture plate. A new job needs four extra clearance holes on a 60 mm pitch and a 1 mm chamfer on the top edges.",
          "The engineer writes the change request with explicit numbers and asks the agent to produce a diff of the model code, not a new model. Before running anything, the request is turned into tests the kernel can check: plate thickness still 10 mm, hole count up by four, hole diameter as specified, pitch 60 mm within tolerance, chamfer present on the top edges only. The agent edits the code, the sandbox runs it, the tests run, and any failure goes back to the agent as text. When everything passes, the engineer opens the result in their normal CAD tool, checks it and releases a new revision.",
          "Every step that matters stays checkable. The agent never decides the dimensions; it implements them. The tests are written from the request, not by the model that is being tested. And the release is a human decision on a new revision, which is what lets the change flow on to the CAM program, the work order and the inspection plan without anyone guessing which version was meant.",
        ],
      },
      {
        heading: "What to use it for on a factory floor today",
        paragraphs: [
          "On the 2026 evidence, the safe uses are narrow but real. Elsewhere, wait for the next round of benchmarks.",
        ],
        bullets: [
          "Good fit: edits to existing parametric parts, where models scored around 0.85 in BenchCAD.",
          "Good fit: simple prismatic parts such as fixture plates, spacers and brackets, where tier 1 and 2 executable rates were 80 to 89%.",
          "Good fit: concept geometry at the quote stage, clearly marked as not for manufacture.",
          "Poor fit: complex surfacing, sweeps, lofts and shells, where executable rates fell to about 30%.",
          "Poor fit: threads, chamfers and standard-driven features, which models were seen to drop or misread.",
          "Poor fit: anything released without a person checking dimensions against the drawing.",
        ],
        callout: {
          title: "Where your existing CAD seat fits",
          body: "Desktop seats such as SOLIDWORKS now carry in-product assistants (Dassault's LEO can add parametric features to STEP files and run simulation studies in a Labs tab), but in the sources found they had no external agent interface. The realistic pattern is to keep the licensed seat, exchange neutral files such as STEP AP242, and let agents work on code-CAD and on the records around the drawing.",
        },
      },
      {
        heading: "Where the drawing meets the rest of the factory",
        paragraphs: [
          "A generated or edited model is only useful if it reaches the right work order. The harder problem in most plants is not making geometry but knowing which revision a job was cut from, which CAM program goes with it, and which inspection result belongs to which revision. That is the linking work described on our [CAD/CAM and CNC integration page](/cad-cam-cnc-integration): drawings, revisions, BOMs and program references tied to orders and production, without replacing the CAD and CAM tools engineers already use.",
          "If you want the wider picture (which engineering tools an agent can drive, which formats outlive a vendor, and where open source is ready), the [full research report](/research/manufacturing-software-stack-cad-cam-plm-mes) covers each function with sources. And if you are weighing where AI fits in your own engineering office, an [industrial systems audit](/industrial-systems-audit) is a free first conversation.",
        ],
      },
    ],
    faq: [
      {
        question: "Can ChatGPT or Claude make a CAD model from a description?",
        answer:
          "They can write parametric CAD code, such as CadQuery, that produces a model. In Text2CAD-Bench (May 2026) the best general models executed about 80 to 89% of simple tasks but only 30 to 32% of complex ones involving sweeps, lofts and shells, so results need checking.",
      },
      {
        question: "Which language works best for AI-generated CAD?",
        answer:
          "In the 2025–2026 benchmarks, CadQuery, a Python library on the Open CASCADE kernel, was the most studied target and outperformed emitting CAD command sequences. Its advantage is that models already write Python well and the code runs directly to produce geometry that can be tested.",
      },
      {
        question: "Does SOLIDWORKS have AI that can create parts?",
        answer:
          "Dassault's virtual companion LEO, in a Labs (beta) tab of SOLIDWORKS 2026, can generate assembly structures, convert images to mesh, add parametric features to STEP files and run simulation studies. It needs a 3DEXPERIENCE connection, and no external agent interface was found in the sources reviewed.",
      },
      {
        question: "Is text-to-CAD accurate enough for production parts?",
        answer:
          "Not without a person checking. Benchmarks found models miss threads and chamfers, misread standard-driven dimensions and replace sweeps with simple extrudes. It is suitable for edits to existing parametric parts and simple fixtures when every dimension is verified before release.",
      },
      {
        question: "Which CAD tools have an MCP server for AI agents?",
        answer:
          "In the sources found, Autodesk offers official Fusion MCP and Fusion Data MCP servers, and PTC offers a FeatureScript MCP Server for Onshape in Onshape Labs. Community MCP servers exist for FreeCAD, KiCad, Blender and Onshape.",
      },
    ],
  },
  // ------------------------------------------------------------------------
  {
    slug: "indian-msme-software-adoption-2026",
    title: "What Indian MSMEs Actually Run in 2026: ERP, Tally, WhatsApp and Excel",
    subtitle:
      "Two 2026 surveys, one neutral and one from a vendor, describe the software Indian small businesses and factories really use, and why so many ERP projects stall.",
    excerpt:
      "Surveys of 2,882 MSMEs and 500 manufacturers show 12% on ERP overall, a third of established factories fully on it, and 44% placing purchase orders over WhatsApp.",
    category: "ops",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "whatsappFlow",
    tags: ["msme", "india", "erp", "manufacturing"],
    keywords: {
      primary: "ERP adoption in Indian MSMEs",
      secondary: ["MSME digitalisation India", "Tally vs ERP", "manufacturing software India", "MSME software survey 2026"],
      searchVolume: 0,
      difficulty: "low",
      intent: "informational",
    },
    relatedSlugs: ["text-to-cad-benchmarks-2026", "mcp-for-erp-crm-agents", "whatsapp-as-crm"],
    crossPageLinks: [
      { href: REPORT, label: "The manufacturing software stack", note: "the full research report, with every tool and survey" },
      { href: "/manufacturing-solutions", label: "Manufacturing solutions", note: "connected-systems approaches by type of plant" },
      { href: "/industrial-systems-audit", label: "Industrial systems audit", note: "start with what you already run" },
    ],
    popularityScore: 72,
    featured: false,
    takeaways: [
      "About one in eight Indian MSMEs uses ERP (12% in a 2,882-firm survey), rising to a third or more among established manufacturers with 10 to 500 employees.",
      "Before ERP, 71% of surveyed manufacturers had inaccurate inventory, 63% had no real-time view of production and 44% placed purchase orders over WhatsApp or phone.",
      "ERP projects stall on people and time more than money: 42% cite resistance, 38% of those who abandoned say it took too long, and failed projects averaged 9.4 months.",
      "Buyers now ask for a supervisor mobile app (79%), local language and an India-based team (67% in the top three) and coexistence with Tally (34%).",
      "No survey measures CAD, CAM or MES use among Indian MSMEs, so claims about engineering software adoption there are guesses.",
    ],
    sections: [
      {
        heading: "Two surveys, two very different numbers",
        paragraphs: [
          "Ask how many Indian small businesses use ERP and you can get an answer anywhere from one in eight to one in two. Both ends are right, because they measure different businesses.",
          "The neutral survey is “MSME Digitalisation in India: Current Status and Challenges” by Pankaj Vashisht of RIS, run with Kantar and published in 2026 with funding from the Mastercard Center for Inclusive Growth. It covered 2,882 enterprises in clusters across fourteen states; half are manufacturers in auto components, food products and wearing apparel, the rest retail and food service, and most are micro enterprises. It found ERP at 12%, CRM at 13%, cloud at 14% and AI at 7%, against near-universal smartphones, 94% internet use and 87% digital payments ([RIS report](https://ris.org.in/sites/default/files/Publication/MSME_Digitalisation_Report.pdf)).",
          "The second is the “Indian Manufacturing ERP Adoption Report 2026” from B-Square, an ERP vendor. It surveyed 500 decision-makers at manufacturers with 10 to 500 employees and ₹1 crore to ₹500 crore turnover in 12 states between January and April 2026, with a margin of ±4.4%. It found 34% with ERP fully deployed and another 19% using it for under half its modules ([B-Square report](https://www.bsquare.in/images/BSquare_ERP_Adoption_Report_2026_FINAL_updated%20.pdf)). Because the publisher sells ERP, treat it as indicative, but the sample explains most of the gap: these are established factories, not micro units.",
        ],
        callout: {
          title: "The fair one-line summary",
          body: "About one in eight MSMEs overall uses ERP, rising to a third to a half among established small and mid-sized manufacturers. Auto-component makers in the RIS sample were the least digitised of five sectors, at 9.5% ERP.",
        },
      },
      {
        heading: "What a typical small factory actually runs",
        paragraphs: [
          "Put the surveys together and a picture emerges of a phone-first business. Payments are digital (87% in the RIS sample), customers and suppliers are on WhatsApp, and the books run on an accounting package. FICCI's October 2023 survey of over 600 manufacturing SMEs in 14 cities found accounting software such as Tally, Vyapar and Busy, and ERP or CRM, to be the most used digital tools, with 37% using cloud business applications ([ThePrint/ANI](https://theprint.in/economy/indian-smes-embrace-digitalisation-sustainability-ficci/1811443/)). Tally says more than 2.7 million businesses use TallyPrime and claims about 70% share among MSMEs; those are company claims ([Tally](https://tallysolutions.com/business-guides/why-businesses-trust-tallyprime/)).",
          "In the B-Square sample, 15% of manufacturers ran only Tally or other accounting software and 9% ran Excel, manual records or nothing. Planning and stock live in spreadsheets. And 44% of manufacturers said purchase orders went through WhatsApp or phone before they adopted ERP, which matches what anyone who has worked in an Indian job shop has seen. We have written before about [using WhatsApp as a CRM](/blogs/whatsapp-as-crm); purchasing is the same habit on the supply side.",
          "The RIS data adds texture to the connectivity side. Some 56% of connected firms rely on mobile data rather than a fixed line. Only 29% use social media for marketing, 19% have a website and 18% sell through e-commerce, and more than 8% tried e-commerce and then abandoned it, citing platform fees first ([RIS report](https://ris.org.in/sites/default/files/Publication/MSME_Digitalisation_Report.pdf)). Press coverage of SIDBI's 2025 figures, which we could not check at source, put digital-payment acceptance above 90% but digital lending at about a fifth of MSMEs ([DQ India, reported](https://dqindia.com/features/how-indias-msmes-are-embracing-tech-and-whats-holding-them-back-9648759)). The money moves digitally; the operational records mostly do not.",
        ],
      },
      {
        heading: "The pains that push factories towards ERP",
        paragraphs: [
          "B-Square asked manufacturers what hurt before they adopted ERP. The list reads like a shop-floor manager's week.",
        ],
        bullets: [
          "Inventory inaccuracy: 71%.",
          "No real-time view of production: 63%.",
          "Slow month-end close: 58%.",
          "GST errors: 54%.",
          "Defects that cannot be traced to a root cause: 47%.",
          "Purchase orders going through WhatsApp or phone: 44%.",
          "Duplicate data entry: 36%.",
        ],
        callout: {
          title: "Compliance is the trigger",
          body: "GST complexity triggered 58% of ERP adoptions after 2017 in the B-Square sample. The median payback reported was 22 months, and 91% of ERP users planned to add a module, such as IoT and MES, CRM or predictive maintenance, within a year.",
        },
      },
      {
        heading: "Why ERP projects stall",
        paragraphs: [
          "The same survey is candid about failure. Nine per cent of manufacturers had ERP and rolled it back, and another 19% used fewer than half the modules they bought. Among firms not yet on ERP or only partly on it, 42% cited resistance from staff and management and 31% cited software cost. Among those who abandoned ERP, 38% said implementation took too long; the average failed project ran 9.4 months.",
          "A separate study by CyberMedia Research in June 2025, covering over 400 MSMEs and tied to a Vi Business programme, found 43% reporting proficiency in core tools such as ERP, CRM and cloud and 23% having adopted AI, IoT or analytics. Its barriers were limited perceived value (84%), data-security concerns (81%) and skills (56%) ([CMR](https://cmrindia.com/67-of-msmes-demonstrate-digital-readiness-across-core-and-advanced-technologies-finds-cmr-study/)). FICCI's respondents named a lack of skilled people in about 40% of cases.",
          "In our view the pattern is clear: projects fail on adoption and time, not on features. A system that takes nine months to show value in a 40-person plant will lose to WhatsApp, which shows value in nine seconds.",
        ],
      },
      {
        heading: "The engineering-software question nobody surveys",
        paragraphs: [
          "None of these surveys asks about CAD, CAM, PLM, MES, SCADA or maintenance software, so any statement about how many Indian MSMEs use SOLIDWORKS or Mastercam is a guess. The only related evidence is about licensing. BSA measured 58% of software installed in India as unlicensed in 2015, down from 60% in 2013 ([BSA](https://www.bsa.org/news-events/news/use-of-unlicensed-software-at-58-percent-in-india-new-bsa-survey-finds)), and 56% in 2017, worth US$2.47 billion. That figure is not sector-specific and is nine years old.",
          "Enforcement is real. A December 2025 law-firm note calls India the third-most affected market for unauthorised software use after China and Russia ([Lakshmikumaran & Sridharan](https://lakshmisri.com/insights/articles/unauthorised-software-navigating-the-spectrum-of-software-piracy-and-compliance-action)), and Dassault Systèmes has won Indian court relief against companies running unlicensed SOLIDWORKS, in one Delhi High Court matter on at least six computers ([Conventus Law](https://conventuslaw.com/report/india-dassaults-landmark-victory-against-software-infringement/)).",
          "The price gap explains the temptation. A SOLIDWORKS subscription through an Indian reseller offer lists at ₹171,240 a year before tax ([Dassault store](https://www.3ds.com/store/solidworks-cloud-offer-x-rvmcad.md)). Autodesk Fusion is about $680 a year, and FreeCAD and the code-CAD libraries are free. There are legal options at every price point; the full comparison is in our [manufacturing software report](/research/manufacturing-software-stack-cad-cam-plm-mes).",
        ],
      },
      {
        heading: "What this means if you are choosing software (with an illustrative example)",
        paragraphs: [
          "The buying criteria in the B-Square data have shifted towards the shop floor. A mobile app for supervisors was a requirement for 79% of manufacturers, up from 41% in 2022. Local-language support and an India-based team were in the top three for 67%. IoT, machine data or MES integration mattered to 38%, and Tally integration or coexistence to 34%.",
          "Take a hypothetical 40-person CNC job shop that runs Tally for books, Excel for planning and WhatsApp for purchasing. On the evidence above, a full ERP replacement is the riskiest path: it fights the accounting system everyone trusts, takes months, and fails most often on adoption. A lower-risk sequence is to keep Tally, capture purchase requests and approvals where people already send them, fix inventory accuracy first, and add simple production tracking on supervisors' phones. Each step should show value within weeks, and each record it creates should link to the next: requisition to purchase order to goods receipt to job.",
          "That is the approach on our [manufacturing solutions page](/manufacturing-solutions): connect what a plant already runs rather than replace it. If you want to map your own systems and the handoffs between them before buying anything, start with a free [industrial systems audit](/industrial-systems-audit).",
        ],
        bullets: [
          "Mobile-first screens for supervisors, not desktop forms.",
          "Local-language support and a team that answers in your time zone.",
          "Coexist with Tally on day one; replace it later, if ever.",
          "Treat WhatsApp as an input channel for orders and approvals.",
          "Pick a first step that shows value in weeks, not quarters.",
        ],
      },
    ],
    faq: [
      {
        question: "What percentage of Indian MSMEs use ERP?",
        answer:
          "About 12% in the RIS and Kantar survey of 2,882 MSMEs published in 2026, most of them micro enterprises. Among established manufacturers with 10 to 500 employees, the vendor B-Square found 34% fully on ERP and 19% using it partially.",
      },
      {
        question: "Do I need to replace Tally to use an ERP?",
        answer:
          "No. Tally integration or coexistence was a buying criterion for 34% of manufacturers in the B-Square survey, and many ERP projects that try to replace the accounting system first stall. Keeping Tally for books while adding inventory and production records alongside is a common lower-risk path.",
      },
      {
        question: "Why do ERP implementations fail in Indian SMEs?",
        answer:
          "In the B-Square survey, 42% of non-adopters cited resistance from staff and management and 31% cost, while 38% of those who abandoned ERP said implementation took too long. Failed projects averaged 9.4 months, and 9% of respondents had rolled ERP back.",
      },
      {
        question: "What do Indian manufacturers look for when choosing ERP?",
        answer:
          "A mobile app for shop-floor supervisors (79%), local-language support and an India-based team (in the top three for 67%), IoT or MES integration (38%) and coexistence with Tally (34%), according to B-Square's 2026 survey of 500 manufacturers.",
      },
      {
        question: "Is unlicensed CAD software common in India?",
        answer:
          "No survey measures it for CAD specifically. BSA estimated 56% of all software installed in India was unlicensed in 2017, and Dassault Systèmes has won Indian court relief against companies running unlicensed SOLIDWORKS, so the legal risk is real.",
      },
    ],
  },
];
