import type { ResearchReport } from "../types";

/**
 * Research report: how one web hub can host, embed, stream or drive
 * specialist applications. Facts checked on 2026-11-22. The tool-class matrix
 * and the adapter manifest are our synthesis and are labelled as such.
 */
export const HUB_EMBEDDING_REPORT: ResearchReport = {
  slug: "embed-stream-integrate-specialist-software",
  shortTitle: "Embedding and streaming tools",
  title: "How to Embed, Stream or Integrate Desktop Apps in a Web Hub",
  h1: ["One hub for every tool:", "embed what you can, stream what you must."],
  description:
    "Which tools can be embedded by iframe, edited over WOPI, streamed from a container or driven over MCP, and the licence, browser and cost limits in 2026.",
  eyebrow: "Research · Integration architecture",
  lead:
    "A hub that serves every department has to reach tools it did not build: a cloud CAD system, an office editor, an open-source desktop app, SolidWorks on a licensed workstation, a CNC controller on the shop floor. There is no single way to do that. This report sets out which integration pattern is realistic for each kind of tool in late 2026, what the platforms that became “the hub” have in common, the minimum contract a tool adapter needs, and the hard limits that no amount of engineering removes.",
  primaryKeyword: "embed third-party apps in a web platform",
  keywords: [
    "run desktop apps in browser",
    "stream desktop application to browser",
    "iframe embedding limits",
    "WOPI integration",
    "MCP Apps",
    "A2UI generative UI",
    "SolidWorks VDI",
    "Selkies KasmVNC Guacamole",
    "open source licence bundling",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 25,
  keyFindings: [
    {
      value: "<21%",
      label: "Success rate of every computer-use agent tested on multi-application Windows tasks in the WindowsWorld benchmark.",
      source: { label: "WindowsWorld, ACL 2026 Findings", url: "https://aclanthology.org/2026.findings-acl.750.pdf" },
    },
    {
      value: "Not certified",
      label: "Dassault Systèmes does not test or certify any VDI platform for SolidWorks, according to a reseller article of 12 November 2026.",
      source: { label: "GoEngineer", url: "https://www.goengineer.com/blog/unconventional-solidworks-environments-risks-and-consequences" },
    },
    {
      value: "$0.99–2.27/h",
      label: "List price per hour of a Vagon GPU cloud computer (NVIDIA T4 to A10G), before the CAD licence itself.",
      source: { label: "Vagon pricing", url: "https://vagon.io/pricing" },
    },
    {
      value: "Stable",
      label: "MCP Apps, the standard for interactive UI returned by agent tools, was marked stable on 26 January 2026 and is implemented by ChatGPT.",
      source: { label: "MCP Apps specification", url: "https://raw.githubusercontent.com/modelcontextprotocol/ext-apps/main/specification/2026-01-26/apps.mdx" },
    },
  ],
  summary: [
    "Web apps are embedded in sandboxed iframes with a small postMessage protocol and single sign-on; office documents use the WOPI host-and-editor split; open-source Linux desktop apps are streamed one app per container into a browser tab.",
    "Closed Windows desktop apps such as SolidWorks and Photoshop stay on a licensed workstation and are reached through the vendor's API, add-in or, new in 2026, the vendor's own MCP server. Pixel streaming and computer-use agents are fallbacks.",
    "Machines are integrated as data (MQTT, OPC UA, MTConnect), not as screens. The MTConnect reference agent is read-only by design.",
    "WebAssembly ports of heavy desktop apps (FreeCAD, LibreCAD, LibreOffice, OpenSCAD) exist in late 2026 but are demos or viewers; production CAD in a browser was built browser-first.",
    "The hubs that worked owned identity, navigation and files or records, and gave other apps a narrow contract: a manifest, a sandboxed UI surface and scoped APIs. openDesk's own documentation shows provisioning and cross-app features are the hard part.",
    "The adapter contract now exists as open standards: OIDC, an iframe with a JSON-RPC bridge (MCP Apps), MCP for tools, A2A for agent hand-off and WOPI-style token-scoped files.",
    "The firmest limits are legal and policy limits: sites that refuse framing, Dassault's position on VDI, Microsoft's partner-only WOPI and Marketplace terms, and component licences that block commercial bundling.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "tool-classes",
      kicker: "Pattern per tool",
      title: "Which integration pattern fits which kind of tool?",
      answer:
        "There is no single pattern. Browser-native SaaS is reached by deep link, vendor embed and API or MCP; open-source web apps are self-hosted and embedded by iframe; open-source desktop apps are streamed one per Linux container into a tab; closed desktop apps stay on the licensed workstation and are driven through the vendor's own API or MCP server; and machines are integrated as data. The matrix below is our synthesis of the findings in the rest of this report.",
      blocks: [
        {
          type: "table",
          caption: "Integration pattern by tool class (our synthesis)",
          columns: ["Tool class", "Realistic primary pattern", "Fallback", "What the user experiences", "What an AI agent gets"],
          rows: [
            ["Browser-native SaaS (Onshape, Figma, Metabase cloud)", "Deep link or vendor embed, plus the vendor's REST API or MCP server; iframe only where the vendor allows framing", "An agent-driven browser tab", "A record in the hub opens the vendor app in a tab or panel", "Typed tools over REST or MCP"],
            ["Open-source web app (Penpot, draw.io, code-server, Collabora)", "Self-host and embed by iframe with a postMessage or WOPI contract and shared OIDC", "Micro-frontends for the hub's own modules", "Feels part of the hub: opens in the page and saves back to the hub's file store", "The app's API or MCP server, plus files in and out"],
            ["Open-source desktop app (FreeCAD, KiCad, Blender)", "One app per Linux container, streamed to a tab, with files mounted from the hub", "A WebAssembly port where one exists, mostly viewers", "A full desktop window in a tab, with some lag", "Python or command-line automation inside the container, or community MCP bridges"],
            ["Closed desktop app (SolidWorks, Photoshop, AutoCAD)", "The app stays on the licensed workstation; the hub manages files and talks to a vendor add-in, API or MCP server", "Remote desktop to that machine; cloud VDI where the licence allows; computer use last", "The user works in the real app; the hub shows status, versions and approvals around it", "Vendor MCP or cloud automation APIs, otherwise UI automation with low reliability on Windows"],
            ["Hardware-bound tool (CNC, PLC)", "Data integration: MTConnect, OPC UA or MQTT into a namespace the hub subscribes to", "The vendor HMI, linked or streamed", "Live machine state, alarms and counts on hub screens; control stays at the machine", "Read-only telemetry tools; writes stay with people"],
          ],
          note: "Synthesis of the sourced findings in sections 2 to 5. The “experience” column is judgement, not measurement.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: one contract, five surfaces",
          text: "The successful platforms share a three-part contract: a sandboxed iframe, a small postMessage or JSON-RPC bridge, and tokens instead of cookies. MCP Apps now standardises exactly that for UI returned by agents, so one host implementation can serve hand-built embeds and agent-generated views. This is also how we approach a factory: the specialist tools stay where they are, and the hub relates their records ([Factory Graph](/factory-graph); [CAD/CAM and CNC integration](/cad-cam-cnc-integration)).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "browser-embedding",
      kicker: "Browser embedding",
      title: "How browser-native tools are embedded: iframes, embed SDKs, postMessage and WOPI",
      answer:
        "Almost every large platform hosts third-party UI in an iframe and passes identity as a token through a small message bridge rather than relying on cookies: Microsoft Teams, Shopify, Atlassian Forge and Onshape all do this. Office documents follow a separate pattern, WOPI, in which the storage system hosts the page and the editor calls back for the file; Collabora and ONLYOFFICE implement it, while Microsoft 365 is open only to cloud-storage partners.",
      blocks: [
        {
          type: "table",
          caption: "How large platforms host other people's UI",
          columns: ["Platform", "Mechanism", "Notable rule"],
          rows: [
            ["Microsoft Teams", "Tabs are web pages in an iframe", "Pages must send a frame-ancestors policy including *.cloud.microsoft; login pages cannot load inside the tab, so Teams SSO is required ([Microsoft Learn](https://learn.microsoft.com/en-za/MicrosoftTeams/platform/tabs/how-to/tab-requirements))"],
            ["Shopify", "“Your app renders its UI in an iframe using web components”", "The app gets a session token with shopify.idToken() and sends it to its backend as a Bearer token, with no cookie dependence ([Shopify](https://shopify.dev/docs/api/app-home))"],
            ["Atlassian Forge", "“Custom UI runs within an iframe”, hosted by Atlassian", "Every app is served with a CSP; external egress must be declared; backend calls go through a bridge ([Atlassian](https://developer.atlassian.com/platform/forge/custom-ui/))"],
            ["Onshape", "“The embedded UI is an HTTPS page displayed in an iFrame”", "Onshape passes document ids as query parameters; the app must validate message origin, and OAuth2 is mandatory for store apps ([Onshape](https://onshape-public.github.io/docs/app-dev/extensions/))"],
            ["draw.io", "embed=1&proto=json: the editor sends init, the host replies load", "The editor stores nothing; “the host decides where to persist” ([draw.io](https://www.drawio.com/doc/faq/embed-mode))"],
            ["Photopea", "An iframe configured by a JSON object after # in the URL", "The host sends a script or file with postMessage and gets the edited PSD back; a GitHub issue calls the documentation “very minimal” ([Photopea](https://www.photopea.com/api/))"],
            ["Metabase", "Guest embeds (signed JWT, all plans including OSS), modular and full-app embedding", "SSO embedding, the embedded query builder and AI chat need Pro or Enterprise ([Metabase](https://www.metabase.com/docs/latest/embedding/introduction))"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Embedding is a licence question as well as a technical one",
          text: "n8n's Sustainable Use License prohibits embedding n8n in a product where users connect their own credentials; that needs the paid “n8n Embed” agreement ([n8n](https://docs.n8n.io/n8n-community-license/sustainable-use-license)). Since SDK 4.0 (September 2025) tldraw “requires a license key to work in production”, stops rendering after five seconds without one, and counts internal company products as commercial use ([tldraw](https://tldraw.dev/sdk-features/license-key)). The open Cal.com repository is now Cal.diy, MIT but “strictly recommended for personal, non-production use” ([Cal.diy](https://github.com/calcom/cal.com)).",
        },
        {
          type: "table",
          caption: "Embeddable open-source and source-available apps (GitHub, read 22 November 2026)",
          columns: ["App", "Licence", "Newest release", "Embed route and catch"],
          rows: [
            ["[code-server](https://github.com/coder/code-server)", "MIT", "v4.146.0 (20 Nov 2026)", "Iframe behind a proxy or sub-path; Open VSX extensions only"],
            ["[Penpot](https://github.com/penpot/penpot)", "MPL-2.0", "2.19.3 (18 Nov 2026)", "Web app with an official MCP server; iframe embedding not checked"],
            ["[draw.io](https://github.com/jgraph/drawio)", "Apache-2.0", "v32.7.4 (17 Nov 2026)", "Iframe plus a JSON postMessage protocol"],
            ["[ONLYOFFICE Docs](https://github.com/ONLYOFFICE/DocumentServer)", "AGPL-3.0", "10.0.0 (22 Oct 2026)", "Iframe plus the Docs API or WOPI"],
            ["[Collabora Online](https://github.com/CollaboraOnline/online)", "MPL-2.0", "Active (Nov 2026)", "Iframe plus a WOPI-like protocol"],
            ["[Univer](https://github.com/dream-num/univer)", "Apache-2.0", "v1.6.0 (21 Nov 2026)", "Spreadsheet and document SDK; embed route not checked"],
            ["[Metabase](https://github.com/metabase/metabase)", "AGPL core plus commercial enterprise directory", "v0.65.6.3 (20 Nov 2026)", "Guest embeds free; SSO embeds paid"],
            ["[Grafana](https://github.com/grafana/grafana)", "AGPL-3.0", "13.3.1 (11 Nov 2026)", "Embedding details not checked"],
            ["[KiCanvas](https://www.github.com/theacodes/kicanvas)", "MIT", "No tagged release", "A web component for KiCad schematics and boards; view only"],
          ],
        },
        { type: "h3", text: "Office documents: WOPI" },
        {
          type: "p",
          text: "WOPI is Microsoft's protocol in which the storage system (the WOPI host) exposes endpoints about a file and serves the page that contains the editor's iframe; the editor reads its capabilities from a discovery document and calls back with an access token. Using Microsoft 365 for the web this way requires the Cloud Storage Partner Program, which “is for independent software vendors whose business is cloud storage. It's not open to Microsoft 365 customers directly” ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/)). Collabora needs only three operations (CheckFileInfo, GetFile, PutFile), omits WOPI locking and detects conflicting edits by timestamp ([Collabora SDK](https://sdk.collaboraonline.com/docs/advanced_integration.html)); ONLYOFFICE offers a WOPI REST API beside its own Docs API ([ONLYOFFICE](https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/)).",
        },
        {
          type: "p",
          text: "The office layer changed hands in 2026. Nextcloud's admin manual now says the default “Nextcloud Office” is “powered by Euro-Office”, with Collabora as “a fully supported alternative” ([Nextcloud](https://docs.nextcloud.com/server/latest/admin_manual/office/index.html)). Euro-Office is a fork of ONLYOFFICE's AGPL code backed by IONOS, Nextcloud, Open-Xchange, OpenProject, Proton and XWiki, made because, in the fork's words, open collaboration with ONLYOFFICE was not possible ([Euro-Office](https://github.com/Euro-Office)). For single users, ZetaOffice runs LibreOffice compiled to WebAssembly in the browser; its team calls it “orthogonal” to Collabora's server-rendered, multi-user editing ([The Register](https://www.theregister.com/2025/02/13/libreoffice_wasm_zetaoffice/)).",
        },
        { type: "h3", text: "Micro-frontends and web IDEs" },
        {
          type: "p",
          text: "For a hub's own modules, Module Federation 2.0 describes itself as “an architectural pattern for the decentralization of JavaScript applications”, MIT, v2.9.3 on 3 November 2026 ([Module Federation](https://module-federation.io/guide/start/index.html)). Web IDEs are a special case: VS Code forks cannot use Microsoft's extension marketplace, whose offerings “are intended for use only with Visual Studio Products and Services”, so code-server uses Open VSX and loses Live Share and the Remote extensions ([code-server FAQ](https://coder.com/docs/code-server/FAQ)).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "webassembly-ports",
      kicker: "WebAssembly ports",
      title: "Can heavy desktop software run in the browser through WebAssembly?",
      answer:
        "Partly. In 2026 there are WebAssembly ports of FreeCAD, LibreCAD, LibreOffice and OpenSCAD, but they are demos, viewers or single-user tools with browser-specific breakage, not production replacements. The heavy native software that does run well in browsers, such as Figma's renderer and Onshape, was built browser-first with a custom WebAssembly engine or server-side geometry, not ported from a desktop interface.",
      blocks: [
        {
          type: "table",
          caption: "WebAssembly ports and in-browser runtimes (status as of November 2026)",
          columns: ["Software", "Port", "Licence", "Status"],
          rows: [
            ["OpenCascade kernel", "[opencascade.js](https://github.com/donalffons/opencascade.js)", "LGPL-2.1", "Newest GitHub release a v2.0.0 beta dated 23 Mar 2023; looks stale"],
            ["Browser CAD on OCCT", "[Chili3D](https://www.github.com/xiangechen/chili3d)", "AGPL-3.0, commercial licence offered", "v0.8.0 (30 Oct 2026); active alpha"],
            ["FreeCAD", "Community “freecad-web” port (FreeCAD 1.1.3, Qt 6.11.2)", "LGPL", "Posted 21 Sep 2026; runs in Chrome, Firefox 155/156 throws errors; not official ([Qt forum](https://forum.qt.io/post/840221))"],
            ["LibreCAD (2D)", "LibreCAD-Web", "GPL", "Full desktop app in a tab; needs a recent Chromium browser ([OSArch](https://osarch.org/2026/07/06/librecad-webassembly-browser-port/))"],
            ["OpenSCAD", "[openscad-wasm](https://github.com/openscad/openscad-wasm), [playground](https://github.com/openscad/openscad-playground)", "GPL-2.0", "The wasm repository's newest release is 2022.03.20"],
            ["LibreOffice", "ZetaOffice / [zetajs](https://github.com/allotropia/zetajs)", "MIT wrapper", "Client-side, single user"],
            ["DuckDB", "[duckdb-wasm](https://github.com/duckdb/duckdb-wasm)", "MIT", "v1.33.0 (16 Dec 2025)"],
            ["CPython", "[Pyodide](https://github.com/pyodide/pyodide)", "MPL-2.0", "314.0.8 (13 Nov 2026)"],
            ["Node.js runtime", "[WebContainers](https://webcontainers.io/enterprise)", "Proprietary API", "Licence required for for-profit production use; Node.js and WASM only"],
            ["x86 Linux VM", "[WebVM on CheerpX](https://github.com/leaningtech/webvm)", "WebVM Apache-2.0; CheerpX proprietary", "CheerpX is free for individuals and testing; organisational use needs a licence"],
          ],
        },
        {
          type: "p",
          text: "The production examples were built for the browser from the start. Figma's renderer is C++ compiled to WebAssembly, first on WebGL and now on WebGPU with a fallback to WebGL mid-session; the move gave “a performance improvement when using WebGPU on some classes of devices” and was neutral on others ([Figma](https://www.figma.com/blog/figma-rendering-powered-by-webgpu/)). Onshape does not stream pixels: Parasolid and D-Cubed run on geometry servers and the browser receives triangles rendered with WebGL ([Onshape](https://www.onshape.com/en/blog/how-does-onshape-really-work)). Zoo Design Studio takes the opposite route: “The 3D view in Design Studio is just a video stream from our hosted geometry engine” ([Zoo](https://github.com/KittyCAD/modeling-app)).",
        },
        {
          type: "p",
          text: "WebGPU reached all major browsers by late 2025: Chrome and Edge, Firefox 141 on Windows and 145 on Apple-silicon Macs, and Safari 26, with Firefox on Linux, Android and Intel Macs still in progress at the time ([web.dev](https://web.dev/blog/webgpu-supported-major-browsers)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Authorship and effort claims for the FreeCAD port are unverified",
          text: "An aggregator reported that the FreeCAD port took “four days” with an AI coding agent and attributes it to a different developer name than the forum post does ([zeli.app](https://zeli.app/en/story/48867264)); the forum topic later showed a “deleted” notice. Treat the port as a promising demonstration, not a supported build.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: viewers yes, main seat no",
          text: "Porting a Qt desktop CAD to WebAssembly is now feasible as a demo, but it brings browser-specific breakage. Treat ports as a viewer or light-edit option (KiCanvas for boards, an OpenSCAD playground for parametric parts) and keep the engineer's main seat on the application built for the job.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "desktop-streaming",
      kicker: "Streaming desktop apps",
      title: "How desktop applications are streamed into a browser tab, and what it costs",
      answer:
        "Open-source Linux desktop apps can be streamed one per container into a browser tab with Selkies-based images, KasmVNC or Xpra, and Windows apps on an existing licensed machine can be reached through Apache Guacamole over RDP. Commercial services rent GPU desktops by the hour or month. No independent latency benchmark exists for any of them, and every vendor describes latency only in words.",
      blocks: [
        {
          type: "table",
          caption: "Desktop streaming stacks (GitHub and vendor pages, read 22 November 2026)",
          columns: ["Stack", "Licence", "Newest release", "How it works"],
          rows: [
            ["[Apache Guacamole](https://guacamole.apache.org/releases/1.6.0/)", "Apache-2.0", "1.6.0 (22 Jun 2025)", "Clientless HTML5 gateway to RDP, VNC and SSH; no plugins"],
            ["[noVNC](https://github.com/novnc/noVNC)", "MPL-2.0 (core)", "1.7.0 (28 Apr 2026)", "Browser VNC client, intended for easy integration into web sites"],
            ["[KasmVNC](https://github.com/kasmtech/KasmVNC)", "GPL-2.0", "1.5.2 (24 Oct 2026)", "Web-based VNC server and client with WebRTC UDP transit"],
            ["Kasm Workspaces", "Proprietary, free Community edition", "—", "Built on KasmVNC; Community is “free for up to 5 concurrent sessions” ([Kasm](https://trust.kasmweb.com/resources/features-matrix))"],
            ["[Selkies](https://github.com/selkies-project/selkies)", "MPL-2.0", "Rolling (21 Nov 2026)", "WebSockets by default, WebRTC opt-in; targets “at least 60 frames per second on Full HD”; works without a GPU"],
            ["[LinuxServer images](https://github.com/linuxserver/docker-webtop)", "GPL-3.0 (image repositories)", "Rolling (22 Nov 2026)", "Stream a desktop or a single application to the browser; “HTTPS is required”"],
            ["[neko](https://github.com/m1k1o/neko)", "Apache-2.0", "v3.2.0 (15 Oct 2026)", "WebRTC, multi-user shared browser or desktop"],
            ["[Xpra](https://github.com/Xpra-org/xpra)", "GPL-2.0+", "v7.0 (16 Nov 2026)", "“Screen for X”; seamless mode streams individual applications"],
            ["[Amazon WorkSpaces Applications](https://aws.amazon.com/workspaces/applications/pricing/)", "Commercial", "G7 GPU instances announced 3 Sep 2026", "Per instance-hour"],
            ["[Windows 365](https://www.microsoft.com/en-us/windows-365/all-pricing?rtc=1)", "Commercial", "GPU tiers Select, Standard, Super, Max", "Per user per month"],
          ],
        },
        {
          type: "p",
          text: "The LinuxServer FreeCAD image is a concrete “one application per tab” example. A GPU is optional (“The CPU pipeline is fast enough for smooth sessions on modest hardware”); Intel and AMD need the host's render device and NVIDIA needs host driver 580 or newer. It also comes with warnings: “By default there is no authentication”, “This container provides privileged access to the host system”, and anyone who reaches the interface can get root inside the container through its web terminal ([linuxserver/docker-freecad](https://github.com/linuxserver/docker-freecad)).",
        },
        {
          type: "p",
          text: "Streaming SolidWorks does happen in practice under academic licences: NC State delivers SOLIDWORKS Education “through Azure Virtual Desktop and Amazon AppStream” ([NC State](https://it.engr.ncsu.edu/software/?p=764)). Commercial terms are a different matter, covered under hard limits below.",
        },
        {
          type: "table",
          caption: "Cost per streamed seat: list prices found (USD)",
          columns: ["Item", "Price", "Notes"],
          rows: [
            ["Amazon WorkSpaces Applications, standard medium Windows", "$0.10 per hour", "Non-GPU; plus a Microsoft RDS user fee of $4.19 per user per month single-session ([AWS](https://aws.amazon.com/workspaces/applications/pricing/))"],
            ["Windows 365 GPU Cloud PC", "$310, $537 or $1,029 per user per month on one listing", "Other regional pages show “Variable”; confirm in the purchase flow ([Microsoft](https://www.microsoft.com/en-us/windows-365/all-pricing?rtc=1))"],
            ["Vagon Planet (NVIDIA T4 16 GB)", "$0.99 per hour", "Plus a $7.99 monthly plan with 75 GB disk ([Vagon](https://vagon.io/pricing))"],
            ["Vagon Spark / Flame (NVIDIA A10G 24 GB)", "$1.67 / $2.27 per hour", "Rates vary by region"],
            ["Parsec Teams / Enterprise", "$35 / $45 per user per month", "Software only, on your own hardware ([Parsec](https://parsec.app/pricing))"],
            ["NVIDIA RTX Virtual Workstation licence", "$250 per concurrent user per year", "Required per concurrent user on self-hosted vGPU ([NVIDIA](https://docs.nvidia.com/vgpu/packaging-pricing-licensing-guide/latest))"],
            ["Kasm Workspaces Community", "Free up to 5 concurrent sessions", "Paid tiers by quote; published tier names conflict between sources"],
          ],
          note: "Arithmetic on these list prices, not quotes: a GPU CAD seat used 160 hours a month is roughly $160 to $360 on the Vagon rates and $310 to over $1,000 on Windows 365 GPU tiers, before the CAD licence. A non-GPU streamed office seat on AWS is about $16 of compute plus the $4.19 user fee.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: a good pilot stack, if you have Linux hosts",
          text: "For one tab per application with open-source parts, the best-supported combination in late 2026 is LinuxServer's Selkies-based single-application images behind the hub's reverse proxy and OIDC login, with Kasm Workspaces Community (five concurrent sessions) as a ready-made orchestrator for a pilot. Both are Linux-container stacks. For Windows-only closed apps, the open route is Guacamole to RDP on a machine that already holds the licence.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "desktop-apis-agents",
      kicker: "Vendor APIs and agents",
      title: "How AI agents reach closed desktop apps and machines: vendor MCP servers, computer use and telemetry",
      answer:
        "The realistic agent path to a closed desktop app is becoming the vendor's own MCP server on the user's PC: Autodesk ships Fusion MCP servers, Adobe announced local MCP integrations for a 2027 beta, and Penpot has an official server. Computer-use agents score around 85% on Linux desktop benchmarks but 50 to 64% on single-app Windows tasks and under 21% on multi-application Windows tasks. Machines are integrated as read-only data.",
      blocks: [
        {
          type: "table",
          caption: "Vendor agent interfaces for design and engineering tools",
          columns: ["Vendor", "Interface", "Status"],
          rows: [
            ["Autodesk Fusion", "Local Fusion MCP Server (turns a running desktop session into an MCP endpoint); cloud Fusion Data MCP Server for hubs, projects and items; cloud Fusion Compute MCP running sessions in Autodesk's infrastructure", "Compute MCP in public beta ([Autodesk](https://www.autodesk.com/products/fusion-360/blog/introducing-the-fusion-mcp/); [Fusion MCP overview](https://help.autodesk.com/cloudhelp/ENU/Fusion-MCP/files/FMCP-OVERVIEW.htm)); read via search excerpts"],
            ["Autodesk Platform Services", "Automation API runs CAD engines in the cloud without a desktop install: AutoCAD, 3ds Max, Inventor, Revit and Fusion", "Available ([APS](https://aps.autodesk.com/en/docs/design-automation/v3/developers_guide/overview/))"],
            ["Onshape", "FeatureScript MCP Server from Onshape Labs (opt-in); no general-purpose Onshape MCP server found", "Labs ([Onshape](https://www.onshape.com/ja/blog/what-is-model-context-protocol-mcp-server-related-cad))"],
            ["Adobe", "Local MCP integrations to let outside agents edit native Photoshop, Illustrator, Premiere and After Effects files on the user's computer", "Announced at MAX; private beta in early 2027 ([The Next Web](https://thenextweb.com/news/adobe-mcp-integrations-photoshop-premiere-ai-agents))"],
            ["Penpot", "Official MCP server talking to a Penpot plugin over WebSocket; can run code in the plugin environment", "Merged into the main Penpot repository ([penpot-mcp](https://github.com/penpot/penpot-mcp))"],
            ["Blender", "No official server found; the community blender-mcp bridge is MIT", "Community ([blender-mcp](https://github.com/ahujasid/blender-mcp))"],
          ],
        },
        {
          type: "p",
          text: "Figma's plugin system is the reference design for running untrusted code beside a document. A plain iframe was rejected because everything became asynchronous and serialising a very large document took 14 seconds; a Realms shim was replaced after a disclosed vulnerability by “compiling a JavaScript VM written in C to WebAssembly”, and plugin UI runs in a separate null-origin iframe with message passing ([Figma](https://www.figma.com/blog/how-we-built-the-figma-plugin-system/)).",
        },
        { type: "h3", text: "Computer use: the last resort, measured" },
        {
          type: "stats",
          items: [
            {
              value: "≈85–86%",
              label: "Frontier models on OSWorld-Verified (Linux desktop tasks), autumn 2026, against a human baseline of 72.36%",
              source: { label: "BenchLM", url: "https://www.benchlm.ai/benchmarks/osworld-verified" },
            },
            {
              value: "50.6–63.5%",
              label: "Reported results on Windows Agent Arena (single-app Windows tasks)",
              source: { label: "WAA leaderboard tracker", url: "https://www.wizwand.com/sota/operating-system-agent-control-on-windowsagentarena" },
            },
            {
              value: "<21%",
              label: "Every agent tested on multi-application Windows tasks",
              source: { label: "WindowsWorld", url: "https://aclanthology.org/2026.findings-acl.750.pdf" },
            },
          ],
        },
        {
          type: "p",
          text: "Anthropic's current computer-use toolset has 17 actions and its documentation recommends “a dedicated virtual machine or container with minimal privileges”, a domain allowlist and human confirmation of consequential actions. It warns that “Claude sometimes acts as if its actions succeeded without explicitly checking their results”, that dropdowns and scrollbars “might be tricky”, and that the model may follow instructions found on screen ([Claude docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)). On Windows Agent Arena, UI-TARS-2 reports 50.6% and EvoCUA-32B 56.48% (vendor-reported), against a 2024 baseline of 19.5% for the Navi agent and 74.5% for an unassisted person ([UI-TARS-2](https://arxiv.org/abs/2509.02544); [Microsoft Research](https://www.microsoft.com/en-us/research/publication/windows-agent-arena-evaluating-multi-modal-os-agents-at-scale/)). Microsoft's open UFO (MIT) mixes Windows UI automation with API calls and claims “51% fewer LLM calls”, without a task success rate ([microsoft/UFO](https://github.com/microsoft/UFO)).",
        },
        { type: "h3", text: "Hardware: integrate as data, not as a screen" },
        {
          type: "p",
          text: "The Unified Namespace pattern maps the ISA-95 hierarchy (enterprise, site, area, line, cell) onto MQTT topics, so PLCs “become data producers, publishing their real-time data to a shared namespace”, with edge gateways translating Modbus, EtherNet/IP, OPC UA and Siemens S7 ([HiveMQ](https://hivemq.com/resources/smart-manufacturing-using-isa95-mqtt-sparkplug-and-uns)). The MTConnect reference agent (Apache-2.0) collects from machine adapters, serves probe, current and sample endpoints over HTTP and publishes to MQTT, and it “follows a one-way, read-only information model, meaning it never sends instructions back to machines” ([mtconnect/cppagent](https://github.com/mtconnect/cppagent)). HiveMQ, a vendor, now points readers to its own post arguing Sparkplug is “not ideal as the central UNS solution” ([HiveMQ](https://www.hivemq.com/webinars/how-to-achieve-data-driven-manufacturing-with-uns/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the closed-desktop case has changed",
          text: "The vendor MCP wave of 2026 means the agent path to a closed desktop app is becoming “the app's own MCP server on the user's PC”, brokered by a small local companion, rather than screen-driving. On the shop floor, writes should stay with people: our machine connections are read-only for the same reason MTConnect is ([industrial IoT and digital twins](/industrial-iot-digital-twins)).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "hubs-that-worked",
      kicker: "Hubs that worked",
      title: "Which products became “the hub”, and what made them work?",
      answer:
        "Hubs that worked did not rebuild every tool: they owned identity, navigation and files or records, and gave other apps a narrow contract, either declarative components the host draws or a sandboxed iframe with a bridge. Germany's openDesk and France's La Suite show this can be done with separate open apps joined by single sign-on and shared navigation, while openDesk's own documentation shows the weak spots are provisioning and shallow cross-app integration.",
      blocks: [
        {
          type: "table",
          caption: "How existing platforms host other people's apps",
          columns: ["Platform", "UI surface", "Isolation and packaging", "Source"],
          rows: [
            ["Nextcloud (AGPL-3.0, v35.0.3)", "PHP apps in-process; External Apps for other languages", "Each ExApp is “a microservice (Docker container) that runs separately”, behind a recommended reverse proxy", "[Nextcloud docs](https://docs.nextcloud.com/server/stable/developer_manual/exapp_development/development_overview/ExAppOverview.html)"],
            ["openDesk (ZenDiS, Germany)", "Separate apps with a shared navigation menu", "Separate Kubernetes workloads; Helm charts orchestrated by Helmfile", "[openDesk](https://docs.opendesk.eu/operations/architecture/)"],
            ["La Suite numérique (France)", "Separate apps: Docs, Visio, Tchap, Fichiers, Messagerie, Grist", "Separate services behind ProConnect sign-in; Docs and Meet are MIT", "[Docs](https://github.com/suitenumerique/docs)"],
            ["Odoo (LGPLv3)", "Modules load into the same server", "A manifest lists name, version, dependencies, data, assets and licence", "[Odoo](https://www.odoo.com/documentation/19.0/developer/reference/backend/module.html)"],
            ["Frappe (MIT, v16.60.2)", "Metadata-defined DocTypes", "Creating a DocType creates a table, list view and form view", "[Frappe](https://docs.frappe.io/framework/user/en/basics/doctypes)"],
            ["Backstage (Apache-2.0, v1.57.1)", "Plugins contribute extensions to an app tree", "A catalogue graph: entities are nodes, kinds group them, relations link them", "[Backstage](https://backstage.io/docs/features/software-catalog/creating-the-catalog-graph)"],
            ["Slack", "Block Kit, a JSON UI framework", "Slack renders the JSON; up to 50 blocks per message", "[Slack](https://docs.slack.dev/block-kit/)"],
            ["VS Code", "Extensions cannot modify the UI directly", "Extension hosts in Node.js, a web worker or a remote machine", "[VS Code](https://code.visualstudio.com/api/advanced-topics/extension-host)"],
            ["WeChat mini programs", "WXML views in WebViews", "Dual thread: rendering in a WebView, logic in a separate JS engine, both through the native host", "[WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/framework/quickstart/framework.html)"],
            ["Lark / Feishu", "Mini programs, web pages, bots and widgets", "Custom apps (one tenant, admin-approved) versus reviewed store apps", "[Lark](https://open.larksuite.com/document/home/app-types-introduction/overview)"],
            ["Home Assistant", "Add-on UIs in an iframe under an ingress path", "Add-ons are containers; Home Assistant handles authentication", "[Home Assistant](https://www.home-assistant.io/blog/2019/04/15/hassio-ingress/)"],
            ["Cloudron", "Each app on its own domain", "A manifest declares port, health check, memory limit and add-ons such as oidc, ldap, scim and postgresql", "[Cloudron](https://docs.cloudron.io/packaging/manifest/)"],
          ],
        },
        { type: "h3", text: "openDesk: one login is quick, one data model is not" },
        {
          type: "p",
          text: "openDesk joins unmodified apps with Keycloak as the OIDC provider over OpenLDAP (“All components have a client configured in Keycloak”), a portal navigation API that each app uses to draw a central menu, and an Intercom Service for silent login and browser-side cross-app calls, which only OX App Suite and Element use. Cross-app features are few and specific: a file picker from OX to Nextcloud, shared contacts, a portal newsfeed from an XWiki blog, and OpenProject storing files in Nextcloud. Its documentation lists the limits: most apps read users straight from LDAP, OX App Suite is the only actively provisioned app, SCIM is planned but “not yet available”, no application supports nested LDAP groups, and bundled databases are for evaluation only ([openDesk architecture](https://docs.opendesk.eu/operations/architecture/)).",
        },
        {
          type: "p",
          text: "La Suite reuses open components instead of writing everything: Tchap is built on Matrix, Visio on LiveKit, Docs on BlockNote and Yjs. Docs is a joint French and German initiative with the Netherlands onboarding, and a March 2026 DINUM presentation cites 400,000 monthly active users on Tchap and 100,000 on Visio ([DINUM presentation](https://indico.math.cnrs.fr/event/15889/contributions/15215/attachments/6380/11212/2026-03-11-journees-mathrice-la-suite-DINUM.pdf)). Even an MIT project can hide copyleft parts: Docs' PDF export relies on BlockNote packages “licensed under GPL”, so a build flag strips them for an MIT build ([Docs README](https://github.com/suitenumerique/docs)).",
        },
        {
          type: "list",
          items: [
            "Zoho One bundles “45+ unified business apps” under all-employee pricing and cites “80,000+ Businesses worldwide” ([Zoho One](https://www.zoho.com/one/)).",
            "Platform risk cuts both ways: ByteDance said WeChat would not approve Feishu's cloud-documents mini program and that WeChat “can block the product for no reason” ([SCMP](https://www.scmp.com/tech/big-tech/article/3116834/bytedance-accuses-tencent-blocking-its-work-home-tool-feishu-wechat)).",
            "One-click app catalogues differ sharply in licence: YunoHost is AGPL-3.0, Coolify Apache-2.0, CasaOS Apache-2.0 (newest release April 2025), and Umbrel uses the PolyForm Noncommercial licence ([Umbrel](https://github.com/getumbrel/umbrel)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: three hub architectures, used together",
          text: "Same-process module frameworks (Odoo, Frappe) give the deepest integration but every tool must be written for them. Federated suites (openDesk, La Suite, Nextcloud with external apps) are fast to assemble but integrate shallowly. Contract platforms (Slack, Teams, Shopify, Forge, WeChat, Lark) give outside developers a strict surface. A factory hub covering CAD, design, code and the ledger needs the federated pattern for big third-party tools and the contract pattern for everything else. Backstage's typed catalogue of kinds and relations is the closest precedent for linking records across those tools, the same idea behind our [Factory Graph](/factory-graph).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "adapter-contract",
      kicker: "The adapter contract",
      title: "What is the minimum contract a tool adapter needs?",
      answer:
        "Identity through OIDC, a launch surface (embed, stream, deep link, local companion or generated UI), data in and out through token-scoped files, records and events, agent tools over MCP, declared permissions and egress, and an audit trail. Each part now exists as an open standard: the MCP 2026-07-28 revision, MCP Apps for UI, A2UI and AG-UI for generative UI, A2A for agent hand-off and WOPI for files. An adapter is mostly a manifest that binds them per tool.",
      blocks: [
        { type: "h3", text: "Agent tools: MCP in 2026" },
        {
          type: "list",
          items: [
            "The 2026-07-28 revision made MCP stateless: no protocol-level sessions or session ids, no initialise handshake; every request carries the protocol version and client capabilities, and servers must implement a discovery call ([MCP changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)).",
            "Server-initiated requests were replaced by multi-round-trip requests, long-running work moved to an official tasks extension, and Roots, Sampling and Logging were deprecated with at least twelve months' notice.",
            "OAuth Dynamic Client Registration is deprecated in favour of Client ID Metadata Documents, and clients must validate the issuer parameter (RFC 9207).",
            "OpenTelemetry trace context travels in request metadata, and list and read results can carry cache hints.",
            "The official MCP Registry is “currently in preview”, stores only metadata, verifies namespaces through GitHub, DNS or HTTP challenges, does not support private servers, and publishes an OpenAPI spec so private registries can offer the same interface ([MCP Registry](https://modelcontextprotocol.io/registry/about)).",
          ],
        },
        { type: "h3", text: "Interactive UI returned by tools" },
        {
          type: "p",
          text: "MCP Apps was proposed on 21 November 2025 and its specification is marked stable as of 26 January 2026. A tool links to a UI resource (scheme ui://, MIME type text/html;profile=mcp-app); a visibility setting controls whether the model, the UI or both may call a tool; web hosts must render through a sandbox proxy on a different origin; and the view talks JSON-RPC over postMessage. Servers must declare the domains the view may connect to, load resources from or frame (the default is “default-src 'none'”) and any device permissions; hosts “may restrict further but must not allow undeclared domains” ([MCP Apps spec](https://raw.githubusercontent.com/modelcontextprotocol/ext-apps/main/specification/2026-01-26/apps.mdx)). ChatGPT implements MCP Apps for UI returned by an MCP server and advises “Keep tools useful without UI” ([OpenAI Apps SDK](https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt)).",
        },
        {
          type: "table",
          caption: "Generative UI protocols, November 2026",
          columns: ["Protocol", "Who", "How it works", "Licence and status"],
          rows: [
            ["MCP Apps", "MCP project", "The tool returns an HTML view rendered in a sandboxed iframe; JSON-RPC over postMessage", "Stable since 26 Jan 2026; SDK v2.1.0 ([ext-apps](https://github.com/modelcontextprotocol/ext-apps))"],
            ["A2UI 1.0", "Google", "The agent describes what to show; the app draws it with its own registered components; renderers for React, Angular, Lit, Flutter, SwiftUI and Jetpack Compose", "Apache-2.0; 1.0 announced 11 Nov 2026 ([Google](https://developers.googleblog.com/en/a2ui-10-build-delightful-fast-reliable-agentic-experiences/))"],
            ["AG-UI", "CopilotKit with LangChain and CrewAI", "An event-based agent-to-user protocol: streaming chat, shared state, frontend tool calls and interrupts", "MIT ([AG-UI docs](https://docs.ag-ui.com/introduction))"],
            ["Vercel AI SDK", "Vercel", "The model returns tool data and the app's React code chooses the component", "Apache-2.0 ([AI SDK](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces))"],
          ],
        },
        {
          type: "p",
          text: "Agent-to-agent hand-off has its own standard: A2A v1.0, “the first stable specification”, shipped in March 2026 with signed agent cards and multi-tenancy, and became a hosted project of the Agentic AI Foundation in August 2026 ([AAIF](https://aaif.io/blog/a2a-joins-aaif)).",
        },
        { type: "h3", text: "Data, identity and sandboxing" },
        {
          type: "list",
          items: [
            "Unified-API vendors solve breadth of SaaS connectors, not specialist desktop tools: Nango (Elastic License 2.0) advertises 900+ APIs and Merge normalises 240+ integrations into common schemas, per one vendor's comparison ([WorkOS](https://workos.com/blog/pipes-vs-nango-composio-arcade-paragon-and-merge)).",
            "Open iPaaS licences vary: Activepieces is MIT outside its enterprise directories, Windmill AGPLv3 with proprietary features, n8n Sustainable Use ([Activepieces](https://github.com/activepieces/activepieces)). For events, Debezium, NATS and Kafka are Apache-2.0, while Redpanda's BSL forbids offering it as a streaming service ([Redpanda](https://github.com/redpanda-data/redpanda)).",
            "Identity: Keycloak is Apache-2.0, authentik's core is MIT with an enterprise directory, and Zitadel moved from Apache-2.0 to AGPL-3.0 with v3 ([Zitadel](https://zitadel.com/blog/apache-to-agpl)). SCIM support is uneven across providers and still missing in openDesk.",
            "Docker Sandboxes run coding agents in microVMs, route all outbound traffic through a host-side proxy and swap a placeholder for the real credential so “the real credential stays outside the sandbox” ([Docker](https://docs.docker.com/ai/sandboxes/architecture/)).",
            "On Windows, Microsoft Execution Containers, “a policy-driven execution layer for untrusted code”, were announced generally available on 7 October 2026, with process, session, WSL and experimental microVM backends and policies on file system, network and UI access ([Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/)). Secondary analyses say WSL2 “is not a security sandbox” ([agentpatterns.ai](https://agentpatterns.ai/security/windows-sandbox-primitives-coding-agents/)).",
          ],
        },
        {
          type: "table",
          caption: "A minimum adapter manifest (our synthesis; each field has a precedent)",
          columns: ["Section", "Minimum fields", "Precedent"],
          rows: [
            ["Identity", "Adapter id, version, publisher, the wrapped tool's licence, sign-in method, provisioning method", "MCP server.json; Cloudron add-ons; Odoo licence field"],
            ["Launch surface", "One or more of: embed (URL, framing policy, message protocol), stream (image, GPU need), deep link, local companion, generated UI", "Onshape action URLs; Teams tabs; LinuxServer images; MCP Apps display modes"],
            ["Data in and out", "File contract (info, get, put, lock; token-scoped), record types mapped to hub entities, events emitted and consumed", "WOPI; Backstage kinds and relations; UNS topics"],
            ["Agent tools", "MCP server location, tool list with visibility, which tools are consequential and need approval, long-running task support", "MCP tasks extension; MCP Apps visibility"],
            ["Permissions", "Scopes, mapping to hub roles, network egress and CSP declarations, device permissions", "Forge egress; MCP Apps CSP; Execution Containers policy"],
            ["Audit", "Actions logged with the actor (person or agent), trace propagation, session recording for streamed apps", "MCP trace context; MCP Apps “validate, log”"],
            ["Runtime", "Health check, resource limits, sandbox class (iframe, container, microVM, user's PC)", "Cloudron health check and memory limit; Nextcloud ExApp GPU fallback"],
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: headless first, UI second",
          text: "MCP's statelessness and the advice to keep tools useful without UI imply that the adapter's tool layer should work headless first, with UI as an optional surface on the same tools. That matches a hub where people and agents act through the same server-side actions. For departments with no module, the lowest-risk generative UI is declarative (the agent chooses from components the hub registered), so the hub's design, permissions and audit still apply.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "hard-limits",
      kicker: "Hard limits",
      title: "The hard limits: framing, cookies, vendor licence terms, cost and licence drift",
      answer:
        "The firmest limits are legal and policy limits, not technical ones. A site that forbids framing cannot be embedded by any client-side trick; Dassault does not test or certify any VDI platform for SolidWorks; Microsoft restricts both its WOPI programme and its extension marketplace; and several “open” components carry terms that block bundling into a commercial hub. Streamed GPU seats cost roughly one to several US dollars per hour.",
      blocks: [
        { type: "h3", text: "Framing and cookies" },
        {
          type: "p",
          text: "The frame-ancestors directive “specifies valid parents that may embed a page”, checks every ancestor, works only as an HTTP header and with 'none' behaves like X-Frame-Options: deny ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)). Identity pages typically refuse framing, which is why Microsoft's login page cannot load inside a Teams tab ([Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/654921/login-microsoftonline-com-failing-to-embed-in-ms-t)).",
        },
        {
          type: "table",
          caption: "Third-party cookies in embedded apps, by browser",
          columns: ["Browser", "Default behaviour", "What works"],
          rows: [
            ["Firefox", "Total Cookie Protection gives third-party cookies “a separate cookie jar per site”", "Partitioned (CHIPS) cookies for 1:1 use; the Storage Access API with a per-frame prompt"],
            ["Safari", "Intelligent Tracking Prevention applies similar protections", "The Storage Access API is the only route"],
            ["Chrome", "Does not block third-party cookies by default, only in Incognito", "Google kept the existing choice in April 2025 and retired several Privacy Sandbox APIs in October 2025"],
            ["Edge", "Blocks trackers from unvisited sites", "SameSite=None; Secure cookies, or tokens"],
          ],
          note: "Sources: [MDN, third-party cookies](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies); [Privacy Sandbox](https://privacysandbox.google.com/blog/update-on-plans-for-privacy-sandbox-technologies). Platforms sidestep cookies with bearer tokens from the bridge (Shopify), signed JWTs (Metabase) or URL access tokens (Collabora).",
        },
        { type: "h3", text: "Vendor terms on hosting closed desktop software" },
        {
          type: "list",
          items: [
            "SolidWorks: a reseller article dated 12 November 2026 states that “Dassault Systèmes only supports the use of Windows OS and Windows installed on Mac Parallels”, that it “does not test or certify any VDI platforms”, and that reseller support “cannot provide any assistance” with VDI set-up. Reported problems include virtual GPU driver failures, licences not returned properly, file corruption, and remote desktop forcing a software OpenGL mode that “essentially bypasses your graphics card altogether” ([GoEngineer](https://www.goengineer.com/blog/unconventional-solidworks-environments-risks-and-consequences)).",
            "Hosting providers say SolidWorks licences “may be used in hosted environments, depending on the license agreement”, which is provider marketing ([Ace Cloud Hosting](https://www.acecloudhosting.com/blog/right-way-to-run-solidworks-remotely/)).",
            "Adobe: named-user licensing “can be deployed in a virtualized environment, whereas Shared Device License (SDL) is not permissible”, in an as-is model with best-effort support ([Adobe](https://helpx.adobe.com/enterprise/using/creative-cloud-deployment-on-vdi.html)).",
            "Microsoft 365 for the web cannot be embedded by an ordinary customer hub, because WOPI is limited to Cloud Storage Partner Program members; Parsec's free and Individuals plans are personal and non-commercial only ([Parsec](https://parsec.app/pricing)).",
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "The SolidWorks licence itself could not be read",
          text: "The official SolidWorks EULA page timed out and Dassault's offering-specific terms could not be parsed, so there is no primary-source quotation on hosting or virtualisation clauses here. The findings above rest on a reseller article and vendor pages. Check your own licence agreement before streaming any commercial CAD seat.",
        },
        { type: "h3", text: "Licence families when bundling open source" },
        {
          type: "table",
          caption: "What each licence family means for a hub that ships or hosts components",
          columns: ["Family", "Examples found", "Practical effect"],
          rows: [
            ["Permissive (MIT, Apache-2.0, BSD)", "code-server, draw.io, Univer, Guacamole, neko, Backstage, Keycloak, Firecracker, A2UI, AG-UI, La Suite Docs", "Embed or modify freely with notices"],
            ["Weak copyleft (MPL-2.0, LGPL, EPL-2.0)", "Penpot, Collabora, Selkies, noVNC core, Pyodide, FreeCAD, Odoo, Theia, Open VSX", "Changes to their own files must be shared; linking from separate code allowed"],
            ["Strong copyleft (GPL)", "KasmVNC, Xpra, LinuxServer images, OpenSCAD, LibreCAD", "Fine as separate programs or services; do not link into proprietary code"],
            ["Network copyleft (AGPL-3.0)", "Nextcloud, ONLYOFFICE, Euro-Office, Grafana, Metabase core, Chili3D, Coder, Zitadel, Windmill", "If modified and offered over a network, the modified source must be offered to users"],
            ["Source-available or fair-code", "n8n, Nango, Airbyte, Redpanda, Umbrel, tldraw, CheerpX, WebContainers", "Each forbids a specific commercial use: embedding with user credentials, managed-service resale, streaming service, any commercial use, production without a key"],
          ],
          note: "Based on the FSF's position that separate programs communicating through pipes, sockets or command-line arguments form an aggregate, an analysis it says “is unchanged by the involvement of containers” ([GNU GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html)); OSI states that the SSPL “is not an open source license” ([OSI](https://opensource.org/blog/the-sspl-is-not-an-open-source-license)). Not legal advice.",
        },
        {
          type: "p",
          text: "Licence drift is a live risk: tldraw left Apache-2.0 in September 2025 ([tldraw](https://tldraw.dev/blog/license-update-for-the-tldraw-sdk)), Zitadel moved to AGPL in March 2025, and the open Cal.com repository became a non-production Cal.diy. Streamed-app containers are also a security surface: the LinuxServer images have no authentication by default and give root inside the container to anyone who reaches the interface.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: what a hub should and should not promise",
          text: "Do not promise “SolidWorks in a tab”: the defensible position is that the engineer's licensed workstation runs it, and the hub manages files, revisions, approvals and agent tasks around it. Do not promise “any SaaS in an iframe” either: classify each adapter as embeddable by vendor contract or deep link plus API, and never strip framing headers through a proxy. Pin component versions and record each adapter's licence, so an upstream relicensing shows up as a reviewable change. If you want this mapped for your own tools, an [industrial systems audit](/industrial-systems-audit) is where we start.",
        },
      ],
    },
  ],
  method: [
    "Versions, release dates and licences were read from each project's licence file and release feed on GitHub on 22 November 2026. Some vendor pages (Autodesk, Adobe, Collabora) blocked direct fetching and were read through search excerpts; those are noted in place.",
    "Pricing comes from vendor list prices on the day; per-seat monthly figures are our arithmetic on those prices, not quotes. Windows 365 GPU prices and Kasm's paid tiers conflict between sources.",
    "No independent, measured latency figures for any streaming stack were found, and no data on how many concurrent CAD sessions one GPU supports. The SolidWorks EULA and Adobe's current product-specific terms could not be read in full.",
    "The tool-class matrix and the adapter manifest are our synthesis of the sourced findings. Nothing here is legal advice on licences.",
  ],
  faq: [
    {
      q: "Can you embed any website in an iframe?",
      a: "No. Framing is the embedded site's decision: a frame-ancestors policy or X-Frame-Options header blocks it, sign-in pages almost always refuse it, and Safari and Firefox partition third-party cookies inside frames. Embed only tools whose vendors offer an embed contract, and use a deep link plus the API for the rest.",
    },
    {
      q: "Can SolidWorks run in a web browser?",
      a: "Not natively. It can be streamed from a remote Windows machine, and universities do this under academic licences, but a reseller states that Dassault does not test or certify any VDI platform and that streaming can force software OpenGL. The realistic pattern is SolidWorks on a licensed workstation with a web hub managing files, revisions and approvals around it.",
    },
    {
      q: "What is WOPI and who can use it?",
      a: "WOPI is Microsoft's protocol for web office editing: the storage system hosts the page and the editor calls back for the file with an access token. Collabora Online and ONLYOFFICE implement it and can be self-hosted; Microsoft 365 for the web is available through WOPI only to members of its Cloud Storage Partner Program.",
    },
    {
      q: "How much does a streamed GPU workstation cost per user?",
      a: "List prices in November 2026 run from about $0.99 to $2.27 per hour on Vagon's NVIDIA T4 and A10G machines, and from $310 to $1,029 per user per month on one Windows 365 GPU listing. At 160 hours a month that is roughly $160 to over $1,000, before the CAD licence. Self-hosted NVIDIA vGPU adds $250 per concurrent user per year.",
    },
    {
      q: "What is MCP Apps?",
      a: "An extension of the Model Context Protocol, stable since 26 January 2026, that lets a tool return an interactive HTML view. The host renders it in a sandboxed iframe on a separate origin, the view talks to the host by JSON-RPC over postMessage, and the server must declare every domain the view connects to. ChatGPT implements it.",
    },
    {
      q: "What is the difference between MCP Apps, A2UI and AG-UI?",
      a: "MCP Apps carries a tool's own HTML view in a sandbox. A2UI lets an agent describe UI that the application draws with its own registered components. AG-UI is an event protocol between an agent backend and a frontend that can carry either. Use A2UI-style declarative UI where your design and permissions must apply, and MCP Apps for third-party tools that bring their own interface.",
    },
    {
      q: "Is it safe to bundle AGPL software in a commercial product?",
      a: "Running AGPL software unmodified as a separate service beside your product is the common approach. If you modify it and offer it to users over a network, you must offer them the modified source. Source-available licences such as the Sustainable Use License, Elastic License or BSL can forbid specific commercial uses outright. Get legal advice for your case.",
    },
    {
      q: "How reliable are computer-use agents at operating desktop software?",
      a: "Reliable enough on Linux benchmarks, where frontier models score around 85% on OSWorld-Verified, but much weaker on Windows: 50 to 64% on single-app Windows Agent Arena tasks and under 21% on multi-application Windows tasks. Treat screen control as a last resort, run it in an isolated machine and require a person to confirm consequential actions.",
    },
  ],
  platformLinks: ["factoryGraph", "cadCam", "iot", "audit"],
  relatedReports: [
    "ai-agent-orchestration-platforms",
    "manufacturing-software-stack-cad-cam-plm-mes",
    "back-office-software-open-source-alternatives",
  ],
  blogSlugs: ["solidworks-in-browser-streaming-licences", "mcp-apps-generative-ui-a2ui"],
};
