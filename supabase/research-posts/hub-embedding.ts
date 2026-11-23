/**
 * Research-desk posts written from the report "How to Embed, Stream or
 * Integrate Desktop Apps in a Web Hub"
 * (src/lib/research/reports/hub-embedding.ts).
 */
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

export const HUB_EMBEDDING_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "solidworks-in-browser-streaming-licences",
    title: "Can You Run SolidWorks in a Browser? Streaming, Licences and Cost",
    subtitle:
      "You can stream it, universities do, and it will cost you a GPU by the hour. But Dassault does not certify any VDI platform, and the better answer for most teams is a hub built around the workstation.",
    excerpt:
      "SolidWorks does not run natively in a browser. What streaming costs, what Dassault and resellers say about VDI, and the setup that works for small engineering teams.",
    category: "ops",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "auditLens",
    tags: ["cad", "solidworks", "remote-access", "manufacturing"],
    keywords: {
      primary: "solidworks in browser",
      secondary: ["solidworks vdi", "stream cad to browser", "solidworks cloud streaming cost", "browser based cad"],
      searchVolume: 0,
      difficulty: "medium",
      intent: "commercial",
    },
    featured: false,
    popularityScore: 72,
    relatedSlugs: ["text-to-cad-benchmarks-2026", "mcp-apps-generative-ui-a2ui", "open-source-licence-risk-agpl-bsl-sspl"],
    crossPageLinks: [
      { href: "/research/embed-stream-integrate-specialist-software", label: "The full research report", note: "embedding, streaming and driving every kind of tool from one hub" },
      { href: "/cad-cam-cnc-integration", label: "CAD/CAM & CNC integration", note: "revisions, BOMs and programs linked to orders" },
      { href: "/industrial-systems-audit", label: "Book a systems audit", note: "map your CAD seats and the handoffs around them" },
    ],
    takeaways: [
      "SolidWorks is a Windows desktop application; it reaches a browser only by streaming from a Windows machine.",
      "A reseller states that Dassault does not test or certify any VDI platform and that remote sessions can fall back to software OpenGL.",
      "GPU cloud desktops list at roughly $0.99 to $2.27 an hour (Vagon) or $310 to $1,029 a month (one Windows 365 GPU listing), before the CAD licence.",
      "Onshape, Zoo and Figma got CAD and design into the browser by building for it, not by porting a desktop app.",
      "For most small teams the practical setup is the licensed workstation plus a web hub that manages files, revisions and approvals around it.",
    ],
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "No, not natively. SolidWorks is a Windows desktop application, and the only way to use it from a browser tab is to stream the screen of a Windows machine that runs it. That works technically: NC State, for example, delivers SOLIDWORKS Education “through Azure Virtual Desktop and Amazon AppStream” ([NC State Engineering IT](https://it.engr.ncsu.edu/software/?p=764)). Whether it is supported, licensed and pleasant to use for daily commercial design work is a different question, and the answer is mostly no.",
          "This post sets out what the vendor's channel says, what streaming costs, how browser-native CAD products solved the problem instead, and the setup we would recommend to a small engineering team that wants its CAD work visible from a central web hub.",
        ],
      },
      {
        heading: "What Dassault and its resellers say about VDI",
        paragraphs: [
          "A reseller article dated 12 November 2026 is direct: “Dassault Systèmes only supports the use of Windows OS and Windows installed on Mac Parallels”, it “does not test or certify any VDI platforms”, and the reseller's own support “cannot provide any assistance with the setup and configuration of VDIs”. The problems it lists are practical ones: virtual GPU driver failures, licences not returned properly, file corruption, and remote desktop sessions that fall back to a software OpenGL mode that “essentially bypasses your graphics card altogether” ([GoEngineer](https://www.goengineer.com/blog/unconventional-solidworks-environments-risks-and-consequences)).",
          "Hosting providers are more optimistic and say SolidWorks licences “may be used in hosted environments, depending on the license agreement”, which is marketing from a company selling hosting ([Ace Cloud Hosting](https://www.acecloudhosting.com/blog/right-way-to-run-solidworks-remotely/)). We could not read the SolidWorks licence agreement itself, so we cannot quote its virtualisation clauses. Read your own agreement before streaming a commercial seat.",
        ],
        callout: {
          title: "Adobe is more permissive, with a catch",
          body: "Adobe says named-user licences “can be deployed in a virtualized environment, whereas Shared Device License (SDL) is not permissible”, in an as-is model with best-effort support. Streaming Photoshop from a named-user VM is allowed; being supported is not promised.",
        },
      },
      {
        heading: "How streaming works, and what a seat costs",
        paragraphs: [
          "There are two routes. You can rent a GPU desktop in the cloud and install your licensed CAD on it, or you can stream a machine you already own. For Linux desktop apps there are mature open stacks (Selkies, KasmVNC, Xpra); for Windows apps on your own machine, Apache Guacamole is a clientless HTML5 gateway to RDP, VNC and SSH, Apache-2.0 licensed ([Apache Guacamole](https://guacamole.apache.org/releases/1.6.0/)).",
          "Streaming a Linux tool is easier and riskier than it looks. LinuxServer publishes ready images that stream a single application, FreeCAD among them, to a browser tab; a GPU is optional because “the CPU pipeline is fast enough for smooth sessions on modest hardware”. The same page warns that “by default there is no authentication” and that anyone who reaches the interface can get root inside the container ([linuxserver/docker-freecad](https://github.com/linuxserver/docker-freecad)). Kasm Workspaces Community is free for up to five concurrent sessions, which is enough for a pilot. None of these stacks publishes a measured latency figure; every vendor describes it only in words.",
          "List prices for the cloud route, read on 22 November 2026, are below. The monthly figures are our arithmetic for a seat used 160 hours a month, not quotes. For comparison, a non-GPU streamed Windows seat on Amazon WorkSpaces Applications starts at $0.10 an hour plus a $4.19 monthly Microsoft user fee, which suits office tools, not CAD.",
        ],
        bullets: [
          "Vagon “Planet”, NVIDIA T4 16 GB: $0.99 an hour plus a $7.99 monthly plan; “Spark” and “Flame”, NVIDIA A10G 24 GB: $1.67 and $2.27 an hour ([Vagon](https://vagon.io/pricing)). Roughly $160 to $360 a month at 160 hours.",
          "Windows 365 GPU Cloud PCs: $310, $537 or $1,029 per user per month on one Microsoft listing, while other regional pages show “Variable” ([Microsoft](https://www.microsoft.com/en-us/windows-365/all-pricing?rtc=1)).",
          "Parsec Teams or Enterprise on your own hardware: $35 or $45 per user per month; the free plans are personal and non-commercial only ([Parsec](https://parsec.app/pricing)).",
          "Self-hosted NVIDIA vGPU: an RTX Virtual Workstation licence at $250 per concurrent user per year, on top of the servers ([NVIDIA](https://docs.nvidia.com/vgpu/packaging-pricing-licensing-guide/latest)).",
          "Add the CAD licence itself to every one of these.",
        ],
      },
      {
        heading: "What browser-native CAD did instead",
        paragraphs: [
          "The products that put CAD and design in the browser did not port a desktop program. Onshape runs its geometry kernels (Parasolid and D-Cubed) on servers and sends triangles to the browser, rendered with WebGL; it does not stream pixels ([Onshape](https://www.onshape.com/en/blog/how-does-onshape-really-work)). Zoo Design Studio does the opposite: “The 3D view in Design Studio is just a video stream from our hosted geometry engine” ([Zoo](https://github.com/KittyCAD/modeling-app)). Figma compiled its own C++ renderer to WebAssembly and moved it to WebGPU, with a fallback to WebGL ([Figma](https://www.figma.com/blog/figma-rendering-powered-by-webgpu/)).",
          "Ports of existing desktop CAD to WebAssembly appeared in 2026: a community FreeCAD build ran in Chrome but failed in Firefox 155 and 156 and is not an official build ([Qt forum](https://forum.qt.io/post/840221)), and LibreCAD-Web needs a recent Chromium browser. They are impressive demonstrations, and useful as viewers, but not a place to do a day's design work.",
        ],
      },
      {
        heading: "The agent route: vendor MCP servers, not screen control",
        paragraphs: [
          "If the goal is to let an AI agent work with your CAD data, screen control is the weakest option. On Windows Agent Arena, reported scores for computer-use agents run from 50.6% to 63.5%, and on multi-application Windows tasks every agent tested scored under 21% ([WindowsWorld](https://aclanthology.org/2026.findings-acl.750.pdf)).",
          "Vendors are building a better door. Autodesk ships a local Fusion MCP server that turns a running Fusion session into an endpoint for agents, a cloud Fusion Data MCP server that needs no install, and a Fusion Compute MCP in public beta ([Autodesk](https://www.autodesk.com/products/fusion-360/blog/introducing-the-fusion-mcp/)). Autodesk's Automation API already runs AutoCAD, Inventor, Revit and Fusion headless in the cloud ([Autodesk Platform Services](https://aps.autodesk.com/en/docs/design-automation/v3/developers_guide/overview/)). Adobe announced local MCP integrations for Photoshop and Illustrator with a private beta in early 2027. We found no official SolidWorks MCP server.",
        ],
      },
      {
        heading: "A practical setup for a small engineering team",
        paragraphs: [
          "An illustrative setup, not a customer case. A twelve-person machine shop has three SolidWorks seats. Instead of streaming them, it keeps SolidWorks on the three licensed workstations and makes the web hub the place where everything around the CAD file lives: the released revision, the BOM that came from it, the work orders that used it, the CAM program reference and the inspection result. People outside engineering see a viewer and a status, not a CAD seat. When the design lead works from home, a remote-desktop connection to their own workstation, through Guacamole or Parsec, is a choice they make, not the architecture.",
          "That is the pattern we describe on our [CAD/CAM and CNC integration page](/cad-cam-cnc-integration): link drawings, revisions and BOMs to orders and production without replacing the CAD tool. The full comparison of embedding, streaming and driving every kind of tool is in the [research report](/research/embed-stream-integrate-specialist-software).",
        ],
        bullets: [
          "Keep CAD on licensed workstations; do not promise “SolidWorks in a tab”.",
          "Export a neutral file (STEP, PDF drawing) on release and attach it to the revision in the hub.",
          "Give non-engineers a browser viewer, not a seat.",
          "If you stream, use the vendor's licence terms in writing and a machine you control.",
          "Watch for vendor MCP servers; they are a safer path for agents than screen control.",
        ],
      },
    ],
    faq: [
      {
        question: "Can SolidWorks run in a web browser?",
        answer:
          "Not natively. It can be streamed from a Windows machine to a browser tab, and some universities do this under education licences, but a reseller states that Dassault does not test or certify any VDI platform.",
      },
      {
        question: "Does SolidWorks work on a virtual desktop (VDI)?",
        answer:
          "It can, but it is not certified. Reported problems include virtual GPU driver failures, licences not returned properly, file corruption and remote sessions falling back to software OpenGL. Check your licence agreement before relying on it.",
      },
      {
        question: "How much does a cloud GPU workstation for CAD cost?",
        answer:
          "List prices in November 2026 ran from $0.99 to $2.27 an hour on Vagon and $310 to $1,029 per user per month on one Windows 365 GPU listing, before the CAD licence. At 160 hours a month that is roughly $160 to over $1,000 a seat.",
      },
      {
        question: "What is the best browser-based CAD?",
        answer:
          "Products built for the browser, such as Onshape (server-side geometry, rendered with WebGL) and Zoo Design Studio (a video stream from a hosted engine), work better than desktop CAD ported or streamed into a tab. Which suits you depends on your parts and your existing files.",
      },
      {
        question: "Can AI agents operate SolidWorks?",
        answer:
          "Only through screen control or the desktop API today; we found no official SolidWorks MCP server. Screen-control agents score under 21% on multi-application Windows tasks, so keep a person in the loop and prefer vendor APIs where they exist.",
      },
    ],
  },

  // ------------------------------------------------------------------------
  {
    slug: "mcp-apps-generative-ui-a2ui",
    title: "MCP Apps vs A2UI vs AG-UI: Generative UI Protocols Explained",
    subtitle:
      "Agents now return interfaces, not just text. Three open protocols decide who draws that interface, where its code runs, and what your product can check before showing it.",
    excerpt:
      "MCP Apps, Google's A2UI and AG-UI let AI agents show interactive UI. How each works, what a host must check for security, and which to choose for your product.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "layerStack",
    tags: ["ai-agents", "mcp", "generative-ui", "architecture"],
    keywords: {
      primary: "mcp apps",
      secondary: ["a2ui", "ag-ui protocol", "generative ui", "mcp apps vs a2ui"],
      searchVolume: 0,
      difficulty: "low",
      intent: "informational",
    },
    featured: false,
    popularityScore: 66,
    relatedSlugs: ["mcp-for-erp-crm-agents", "solidworks-in-browser-streaming-licences", "prompt-injection-crm-ai-agents"],
    crossPageLinks: [
      { href: "/research/embed-stream-integrate-specialist-software", label: "The full research report", note: "the complete tool-adapter contract and its hard limits" },
      { href: "/agentic-erp-crm", label: "Agentic ERP & CRM", note: "agents that act through approved tools" },
      { href: "/factory-graph", label: "Factory Graph", note: "one governed layer over the systems you already run" },
    ],
    takeaways: [
      "MCP Apps (stable since 26 January 2026) lets a tool return its own HTML view, rendered in a sandboxed iframe and talking to the host over JSON-RPC.",
      "A2UI 1.0 (Google, November 2026) lets the agent describe UI that your app draws with its own registered components.",
      "AG-UI is an event protocol between an agent backend and a frontend; it can carry A2UI payloads.",
      "MCP Apps requires servers to declare every domain a view may reach, and hosts must not allow undeclared ones.",
      "Use declarative UI where your design, permissions and audit must apply; use MCP Apps for third-party tools that bring their own interface.",
    ],
    sections: [
      {
        heading: "Why agent interfaces needed a standard",
        paragraphs: [
          "For two years, an AI agent's answer was text. That is fine for a summary and poor for a task: approving a purchase order, choosing between three quotes or editing a schedule needs buttons, tables and forms. Each chat product invented its own way to show them, which meant every tool vendor built the same widget several times.",
          "The plumbing underneath changed at the same time. The Model Context Protocol revision of 28 July 2026 made the core stateless: no session ids and no initialise handshake, with every request carrying its protocol version and client capabilities, and long-running work moved into a tasks extension ([MCP changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). Agent-to-agent hand-off got its own stable standard, A2A v1.0, in March 2026 ([AAIF](https://aaif.io/blog/a2a-joins-aaif)). That left one gap: how an agent shows a person something they can act on.",
          "By late 2026 three open protocols had settled the question from different directions. MCP Apps standardises a tool returning its own interface. A2UI standardises an agent describing an interface that your application draws. AG-UI standardises the live event stream between an agent and a frontend. They overlap, and they can be combined, but they make different choices about who controls the pixels.",
        ],
      },
      {
        heading: "MCP Apps: a tool's own view, in a sandbox",
        paragraphs: [
          "MCP Apps was proposed on 21 November 2025 ([MCP blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)) and its specification is marked stable as of 26 January 2026. A tool links to a UI resource with a ui:// address and the MIME type text/html;profile=mcp-app. The host renders it inside a sandbox; web hosts must use a sandbox proxy on a different origin. The view talks to the host with JSON-RPC 2.0 over postMessage, calling tools, reading resources, opening links or asking for fullscreen, and the host pushes the tool's input and result to it. A visibility setting decides whether the model, the view or both may call each tool ([MCP Apps specification](https://raw.githubusercontent.com/modelcontextprotocol/ext-apps/main/specification/2026-01-26/apps.mdx)).",
          "Adoption came quickly: “ChatGPT implements the open MCP Apps standard for UI returned by an MCP server”, keeping its older template field as an alias and its own window.openai object for things the shared standard lacks, such as checkout and file upload. Its advice to developers is worth repeating: “Keep tools useful without UI” ([OpenAI Apps SDK](https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt)). Early-2026 forum threads report that some OpenAI extensions were still needed for CSP and widget state; those are unverified user reports.",
          "A view can ask to be shown inline in the conversation, fullscreen or as a picture-in-picture panel, and the host decides. The SDK repository reached v2.1.0 on 10 November 2026 ([ext-apps](https://github.com/modelcontextprotocol/ext-apps)), and the community project it grew from, mcp-ui, remains available under Apache-2.0 ([mcp-ui](https://github.com/MCP-UI-Org/mcp-ui)). Because the view is ordinary HTML, a tool vendor can reuse the interface it already has, which is the main reason to choose this route.",
        ],
      },
      {
        heading: "A2UI: the agent describes, your app draws",
        paragraphs: [
          "Google's A2UI 1.0, announced on 11 November 2026, is “the first stable version of our open protocol for generative UI”. The agent describes what to show and the application draws it “with its own native components”, limited to “the components you register”. Renderers exist for React, Angular, Lit, Flutter, SwiftUI and Jetpack Compose; version 1.0 adds two-way function calls and accessibility; and “the web and Flutter renderers also work inside MCP Apps”. Google names Atlassian (Jira), Alation, ByteDance and its own Gemini products as users ([Google Developers Blog](https://developers.googleblog.com/en/a2ui-10-build-delightful-fast-reliable-agentic-experiences/)). It is Apache-2.0 ([google/A2UI](https://github.com/google/A2UI)).",
          "The design choice matters. With A2UI no third-party code runs in your page: the agent can only ask for components you have already built, styled and permissioned. You lose flexibility and gain control.",
        ],
        pullQuote: "The agent can only ask for components you have already built.",
      },
      {
        heading: "AG-UI and the AI SDK: the transport and the React route",
        paragraphs: [
          "AG-UI (MIT) is “an open, lightweight, event-based protocol” between an agent backend and a frontend: streaming chat, typed shared state with event-sourced diffs, frontend tool calls, and interrupts to “pause, approve, edit, retry, or escalate mid flow without losing state”. It positions itself beside the others: MCP connects agents to tools, A2A connects agents to agents, AG-UI connects agents to users ([AG-UI docs](https://docs.ag-ui.com/introduction)). A2UI defines no transport of its own, and Google's guide with CopilotKit carries A2UI payloads as AG-UI events ([Google Developers Blog](https://developers.googleblog.com/build-generative-ui-apps-with-a2ui-copilotkit-agents/)).",
          "The Vercel AI SDK takes the simplest route for teams already on React: “Generative UI is the process of connecting the results of a tool call to a React component”. The model returns tool data and your code chooses the component ([AI SDK docs](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces)).",
        ],
      },
      {
        heading: "What a host must check before rendering anything",
        paragraphs: [
          "Any interface an agent returns is content from outside your product, and it should be treated that way. MCP Apps writes the rules into the specification: servers declare the domains a view may connect to, load resources from, frame or use as a base URL, and any device permissions it needs (camera, microphone, geolocation, clipboard write). When nothing is declared the default is default-src 'none'. Hosts “may restrict further but must not allow undeclared domains”, and should “validate, log, and reject malformed view messages” ([MCP Apps specification](https://raw.githubusercontent.com/modelcontextprotocol/ext-apps/main/specification/2026-01-26/apps.mdx)). A2UI reaches the same goal by a different road: because only registered components can be drawn, there is no foreign code to contain, only data to validate against the components you allow.",
        ],
        bullets: [
          "Render third-party views on a separate origin, never in your own page's context.",
          "Allow only the domains the server declared, and fewer if you can.",
          "Log every message a view sends, and reject anything malformed.",
          "Keep consequential actions (approving, paying, sending) behind your own approval step, not a button inside a third-party view.",
          "Prefer tools that work headless, so an agent can act without the view and a person can audit what it did.",
        ],
        callout: {
          title: "Not yet in the standard",
          body: "MCP Apps explicitly defers embedding an external URL, persisting view state and view-to-view communication. Plan around those gaps rather than assuming them.",
        },
      },
      {
        heading: "Which to use when",
        paragraphs: [
          "An illustrative example, not a customer case: a manufacturer's operations hub wants an agent to propose next week's machine schedule. The schedule view must use the hub's own styles, show only the work orders the user may see, and send any change through the hub's approval rule. That is a job for declarative UI (A2UI, or tool results mapped to your own React components with the AI SDK), because the hub stays in control of design, permissions and audit. The same hub might also show a third-party design tool's preview, which arrives as an MCP Apps view inside a sandbox, because that vendor owns its interface.",
          "Our rule of thumb: build the tools first, headless, and add UI as an optional surface on the same tools. That keeps people and agents acting through the same server-side actions, which is how we approach agents on our [agentic ERP and CRM page](/agentic-erp-crm). The full adapter contract, from identity to sandboxing, is in our [research report on embedding and integration](/research/embed-stream-integrate-specialist-software).",
        ],
        bullets: [
          "Your own product's screens, built from your design system: A2UI or AI SDK tool-to-component mapping.",
          "A third-party tool's interface inside your product or a chat client: MCP Apps.",
          "Streaming chat, shared state and pause-for-approval between agent and frontend: AG-UI as the transport.",
          "Agent-to-agent hand-off: A2A, not a UI protocol.",
        ],
      },
    ],
    faq: [
      {
        question: "What is MCP Apps?",
        answer:
          "An extension of the Model Context Protocol, stable since 26 January 2026, that lets a tool return an interactive HTML view. The host renders it in a sandboxed iframe and the view talks to the host by JSON-RPC over postMessage. ChatGPT implements it.",
      },
      {
        question: "What is A2UI?",
        answer:
          "Google's open, Apache-2.0 protocol for generative UI. Version 1.0 was announced on 11 November 2026. The agent describes the interface and the application draws it with its own registered components, with renderers for React, Angular, Lit, Flutter, SwiftUI and Jetpack Compose.",
      },
      {
        question: "What is the difference between AG-UI and MCP?",
        answer:
          "MCP connects agents to tools and data. AG-UI is an event protocol between an agent backend and a user-facing frontend, covering streaming chat, shared state, frontend tool calls and interrupts. They are complementary, and AG-UI can carry A2UI payloads.",
      },
      {
        question: "Is MCP Apps secure?",
        answer:
          "The specification is designed for it: views run on a separate origin, servers must declare every domain the view may reach, and hosts must not allow undeclared ones. The host still has to enforce those rules and keep consequential actions behind its own approvals.",
      },
      {
        question: "Should I use MCP Apps or A2UI in my product?",
        answer:
          "Use A2UI-style declarative UI, or your own components through the AI SDK, where your design, permissions and audit must apply. Use MCP Apps when a third-party tool brings its own interface that you are willing to run in a sandbox.",
      },
    ],
  },
];
