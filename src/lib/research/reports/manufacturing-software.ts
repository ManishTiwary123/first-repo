import type { ResearchReport } from "../types";

/**
 * Research report: the engineering and factory-floor software stack.
 * Facts checked on 2026-11-22. Anything the underlying research could not
 * verify is left out or labelled "reported".
 */
export const MANUFACTURING_SOFTWARE_REPORT: ResearchReport = {
  slug: "manufacturing-software-stack-cad-cam-plm-mes",
  shortTitle: "The manufacturing software stack",
  title: "Manufacturing Software Stack 2026: CAD, CAM, PLM, MES, IIoT",
  h1: ["Every tool on the factory floor,", "priced, licensed and tested for AI."],
  description:
    "Every engineering and shop-floor function, its commercial tools and prices, the open-source alternatives, what AI agents can drive and what Indian MSMEs run.",
  eyebrow: "Research · Manufacturing software",
  lead:
    "A manufacturer's engineering and shop-floor work runs on a dozen kinds of software: CAD, electronics design, simulation, CAM, PDM and PLM, MES, SCADA and IIoT, quality, maintenance and warehouse tools. This report goes through each function in turn: the commercial suites and what they cost, the open-source projects with their licences and release activity, what AI and agent interfaces actually shipped in 2025 and 2026, which neutral formats let data outlive any one vendor, and what small and mid-sized Indian manufacturers really run today.",
  primaryKeyword: "manufacturing software stack",
  keywords: [
    "open source CAD software",
    "open source MES",
    "text to CAD AI",
    "CAD MCP server",
    "SolidWorks price India",
    "KiCad CLI automation",
    "industrial IoT open source",
    "ERP adoption Indian MSMEs",
    "STEP AP242 QIF MTConnect",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 27,
  keyFindings: [
    {
      value: "12%",
      label: "Share of 2,882 surveyed Indian MSMEs using ERP. CRM was 13%, cloud 14% and AI 7% (RIS with Kantar, 2026).",
      source: { label: "RIS report", url: "https://ris.org.in/sites/default/files/Publication/MSME_Digitalisation_Report.pdf" },
    },
    {
      value: "30–32%",
      label: "Executable rate of Claude 4.5 Sonnet and GPT-5.2 on complex CAD tasks (sweeps, lofts, shells) in Text2CAD-Bench, May 2026.",
      source: { label: "arXiv 2605.18430", url: "https://arxiv.org/html/2605.18430v1" },
    },
    {
      value: "$12,000",
      label: "Yearly floor for Tulip's Essentials plan: $100 per interface per month with a ten-interface minimum.",
      source: { label: "Tulip plans", url: "https://tulip.co/plans" },
    },
    {
      value: "BSL 1.1",
      label: "EMQX (from v5.9.0) and ThingsBoard (from v4.4.0) moved from open-source licences to the Business Source License.",
      source: { label: "EMQX licence", url: "https://raw.githubusercontent.com/emqx/emqx/HEAD/LICENSE" },
    },
  ],
  summary: [
    "The commercial stack is consolidating: Synopsys completed its purchase of Ansys in July 2025, Siemens bought Altair, Renesas agreed to buy Altium, and Schneider Electric agreed in October 2026 to buy PTC, according to reports. A factory that depends on one vendor's API should expect ownership and price changes.",
    "List prices span two orders of magnitude: about $680 a year for Autodesk Fusion, $1,500 to $2,500 for Onshape, $2,820 to $4,716 for SOLIDWORKS in the US, and about ₹1.7 lakh a year for a SOLIDWORKS subscription through an Indian reseller offer.",
    "Open source is production-grade for geometry kernels and code-CAD, board design (KiCad 10), command-line solvers, machine control and slicing, integration plumbing and ERP-level inventory. PLM with change control, a mature MES and an integrated QMS remain gaps.",
    "Every major CAD vendor shipped an in-product AI assistant, but in the sources found only Autodesk and PTC had official MCP servers an outside agent can call.",
    "Four 2025–2026 benchmarks agree: language models handle simple prismatic parts and editing existing parametric code well, fail on sweeps, lofts, shells and exact dimensions, and improve most when they can run the CAD kernel and read test results.",
    "Among Indian MSMEs, a neutral survey finds 12% on ERP; a vendor survey of established manufacturers finds 34% fully on ERP, 15% on Tally-type accounting only, and 44% placing purchase orders over WhatsApp or phone before ERP.",
    "Licence drift is a planning risk: two of the most popular IIoT projects left open-source licensing within eighteen months, while one went the other way.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "design-engineering-tools",
      kicker: "Design and engineering",
      title: "CAD, electronics, simulation and CAM: the tools, prices and open-source alternatives",
      answer:
        "Design and engineering software is held by a few suites that consolidated further in 2025 and 2026. List prices run from about $680 a year for Autodesk Fusion to $4,716 a year for SOLIDWORKS Premium in the US. Open source is strongest in geometry kernels and code-CAD libraries, board design (KiCad 10, released March 2026) and command-line solvers such as OpenFOAM; interactive desktop CAD (FreeCAD 1.1) is active and improving.",
      blocks: [
        {
          type: "p",
          text: "CIMdata puts the whole PLM market (CAD, CAE, PDM, EDA and AEC software) at US$88.3 billion in 2025, up 9.9% on 2024 ([CIMdata](https://www.cimdata.com/en/news/item/30183-cimdata-publishes-executive-plm-market-report)). Vendor-level shares sit in the paid report only. ABI Research's mechanical-CAD SaaS ranking of December 2023 named Siemens, PTC, Autodesk and Dassault Systèmes as the leaders; it is a supplier ranking, not a revenue share ([ABI Research](https://abiresearch.com/press/siemens-ptc-autodesk-and-dassault-systemes-named-market-leaders-in-abi-researchs-mcad-saas-solution-supplier-competitive-ranking)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Two CIMdata figures that do not match",
          text: "CIMdata's CEO is separately reported as quoting US$87.25 billion and 8.7% growth for the same market, slightly below a 9.3% forecast ([CIMdata forum release, reported](https://www.cimdata.com/de/news/item/29894-cimdata-concludes-successful-2026-plm-market-industry-forum-series)). The sources do not reconcile the two numbers.",
        },
        { type: "h3", text: "Mechanical CAD: what a seat costs" },
        {
          type: "table",
          caption: "Mechanical CAD list prices found in November 2026",
          columns: ["Product", "Price", "Notes and source"],
          rows: [
            ["SOLIDWORKS Design (US)", "$2,820 Standard, $3,456 Professional, $4,716 Premium per year, before tax", "Subscription ([Dassault store](https://www.3ds.com/store/solidworks-design); [SOLIDWORKS pricing](https://www.solidworks.com/how-to-buy/solidworks-design-plans-pricing.md))"],
            ["SOLIDWORKS (India, reseller offer)", "₹171,240 per year (₹136,992 with a 20% promotion), before tax", "Single-user subscription through an Indian reseller on the Dassault store ([Dassault store offer](https://www.3ds.com/store/solidworks-cloud-offer-x-rvmcad.md))"],
            ["SOLIDWORKS (India, dealer listings)", "About ₹3,00,000 to ₹3,50,000 per seat, described as lifetime", "IndiaMART dealer listings, not official prices ([IndiaMART](https://m.indiamart.com/city/chennai/solidworks-software.html))"],
            ["Onshape (PTC)", "$1,500 Standard, $2,500 Professional per user per year; Enterprise quoted; free plan", "Browser-native CAD with built-in PDM ([Onshape pricing](https://www.onshape.com/en/pricing))"],
            ["Autodesk Fusion", "About $680 per user per year ($85 a month)", "A separate “Fusion Professional” tier at $2,040 appears on one Autodesk page; its terms were not confirmed ([Autodesk](https://www.autodesk.com/campaigns/fusion-360/multi-seat-offer))"],
            ["progeCAD 2026 Professional", "₹20,000 perpetual", "DWG-compatible 2D/3D; one IndiaMART listing, reported ([IndiaMART](https://m.indiamart.com/impcat/cad-software.html))"],
          ],
          note: "Prices come from separate sources, dates and currencies, so they show the order of magnitude, not a like-for-like comparison.",
        },
        {
          type: "p",
          text: "Ownership is moving under these products. PTC bought Onshape in October 2019 (reported at $470 million), had FY2025 revenue of US$2.74 billion, and in October 2026 Schneider Electric agreed to buy PTC in an all-cash deal valuing it at US$22.6 billion; that is an agreement, single-sourced to Wikipedia, not a completion ([Wikipedia: PTC](https://en.wikipedia.org/wiki/PTC_(software_company)); [Wikipedia: Schneider Electric](https://en.wikipedia.org/wiki/Schneider_Electric)). Synopsys completed its acquisition of Ansys on 17 July 2025 ([Synopsys](https://news.synopsys.com/2025-07-17-Synopsys-Completes-Acquisition-of-Ansys)). Siemens announced the purchase of Altair for US$10.6 billion in October 2024 and completed it in March 2025 ([Wikipedia: Altair](https://en.wikipedia.org/wiki/Altair_Engineering)). Cadence announced in September 2025 that it would buy Hexagon's design and engineering business, including MSC Software, for €2.7 billion ([Wikipedia: Hexagon](https://en.wikipedia.org/wiki/Hexagon_AB)).",
        },
        {
          type: "table",
          caption: "Open-source mechanical CAD and code-CAD (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "How it runs"],
          rows: [
            ["[FreeCAD](https://github.com/FreeCAD/FreeCAD)", "LGPL-2.1", "35,688", "v1.1.4 (Sep 2026); 1.1 shipped 24 Mar 2026", "Desktop; headless through FreeCADCmd with a full Python API"],
            ["[OpenSCAD](https://github.com/openscad/openscad)", "GPL with CGAL exception", "10,716", "Last tagged 2021.01; active development snapshots", "Code-CAD; a headless WebAssembly build exists"],
            ["[CadQuery](https://github.com/CadQuery/cadquery)", "Apache-2.0", "6,151", "v2.8.0 (Jun 2026)", "Pure Python library on OCCT; runs server-side with no GUI"],
            ["[build123d](https://github.com/gumyr/build123d)", "Apache-2.0", "3,818", "v0.13.0 (Sep 2026)", "Python code-CAD library"],
            ["[Open CASCADE (OCCT)](https://github.com/Open-Cascade-SAS/OCCT)", "LGPL-2.1", "3,202", "V8_0_2 (Nov 2026)", "C++ B-rep kernel"],
            ["[LibreCAD](https://github.com/LibreCAD/LibreCAD)", "GPL-2.0", "6,628", "v2.2.1.6 (Oct 2026)", "2D CAD"],
            ["[Chili3D](https://github.com/xiangechen/chili3d)", "AGPL-3.0, commercial licence offered", "5,014", "v0.8.0 (Oct 2026)", "Browser CAD: OCCT in WebAssembly plus Three.js; STEP and IGES in and out"],
            ["[Zoo Design Studio](https://github.com/KittyCAD/modeling-app)", "MIT app; geometry engine proprietary", "1.3k", "v1.5.6 (Nov 2026)", "Code-CAD in KCL on a cloud geometry engine"],
            ["[Manifold](https://github.com/elalish/manifold)", "Apache-2.0", "2.4k", "v3.5.5 (Nov 2026)", "Mesh boolean kernel; the OpenSCAD Playground's default"],
          ],
          note: "Dormant or dead projects not listed as options: opencascade.js (last commit March 2023), CADmium (Elastic License, dormant since September 2025) and Ondsel's FreeCAD fork (last commit December 2024).",
        },
        {
          type: "p",
          text: "FreeCAD 1.1, released on 24 March 2026, reworked the transform tool, added Part Design previews, “insert new part” and joint simulation in assemblies, a new CAM tool-library system and FEM result animation; the team says it prioritised stability ([FreeCAD blog](https://blog.freecad.org/2026/03/25/freecad-version-1-1-released/)). Run headless, FreeCAD has no view providers and no GUI document, though its GUI module can still be set up without a window ([FreeCAD documentation](https://raw.githubusercontent.com/FreeCAD/FreeCAD-documentation/HEAD/wiki/Headless_FreeCAD.md)).",
        },
        { type: "h3", text: "Electronics design (ECAD)" },
        {
          type: "p",
          text: "Renesas agreed to buy Altium for A$68.50 a share, about A$9.1 billion of equity value ([Altium](https://www.altium.com/company/newsroom/press-releases/renesas-acquire-pcb-design-software-leader-altium-make-electronics)). On the open side, KiCad 10 shipped in March 2026 with importers for Allegro, PADS and gEDA boards, design variants and a graphical DRC rule editor, and had reached 10.0.8 by November ([KiCad](https://www.kicad.org/blog/2026/03/Version-10.0.0-Released/)). Its command-line tool runs DRC and ERC with JSON output and exports Gerber, drill, position files, IPC-2581, ODB++, STEP and BOMs headless ([KiCad CLI manual](https://docs.kicad.org/10.0/en/cli/cli.html)). The newer IPC API, however, still needs a running KiCad window in versions 9 and 10, covers only the PCB editor and cannot plot or export; headless use arrives in KiCad 11, expected around February 2027 ([KiCad developer docs](https://dev-docs.kicad.org/en/apis-and-binding/ipc-api/for-addon-developers/)).",
        },
        {
          type: "list",
          items: [
            "Other open ECAD: [LibrePCB](https://github.com/LibrePCB/LibrePCB) (GPL-3.0, v2.1.1, June 2026), [Horizon EDA](https://github.com/horizon-eda/horizon) (GPL-3.0, v2.7.2) and circuits-as-code projects [tscircuit](https://github.com/tscircuit/tscircuit) (MIT) and [atopile](https://github.com/atopile/atopile) (MIT; last commit March 2026, so check activity before relying on it).",
            "AI layout money: Quilter, which does physics-driven autonomous PCB layout, raised a $25 million Series B led by Index Ventures in October 2025 ([Business Wire](https://www.businesswire.com/news/home/20251007165399/en)). Flux, a browser ECAD with an AI agent, disclosed $37 million across two rounds in February 2026 ([SiliconANGLE](https://siliconangle.com/2026/02/27/flux-nabs-37m-automate-printed-circuit-board-development-ai/)).",
          ],
        },
        { type: "h3", text: "Simulation (CAE)" },
        {
          type: "table",
          caption: "Simulation: commercial and open-source options",
          columns: ["Tool", "Licence or price", "Latest release", "Note"],
          rows: [
            ["[SimScale](https://www.simscale.com/pricing/)", "Free Community plan (10 simulations, up to 2,000 core hours); paid plans quote-only", "SaaS", "API support listed under Enterprise; lists a “Virtual Engineer” copilot and Physics AI"],
            ["[OpenFOAM](https://openfoam.org/download/)", "GPL-3.0", "v14 (14 Jul 2026)", "Linux command line, maintained by CFD Direct; Windows through WSL"],
            ["[Elmer FEM](https://github.com/ElmerCSC/elmerfem)", "GPL-2.0", "release-26.2 (Apr 2026)", "Multiphysics solver"],
            ["[SU2](https://github.com/su2code/SU2)", "LGPL-2.1", "v8.6.0 (Oct 2026)", "CFD and adjoint optimisation"],
            ["[FEniCSx (dolfinx)](https://github.com/FEniCS/dolfinx)", "LGPL-3.0", "v0.11.0.post0 (Jun 2026)", "Python and C++ PDE library"],
            ["[CalculiX](https://github.com/Dhondtguido/CalculiX)", "GPL-2.0", "No GitHub releases", "FEA solver"],
          ],
        },
        {
          type: "p",
          text: "Siemens' Simcenter PhysicsAI 2026.1 trains surrogate models on a company's past simulations, which Siemens says can run up to 1,000 times faster than solvers, and adds a diffusion-based mode that generates design concepts ([Siemens blog](https://blogs.sw.siemens.com/simcenter/whats-new-in-simcenter-physicsai-2026-1/)). That speed figure is vendor-reported.",
        },
        { type: "h3", text: "CAM, CNC and 3D-printing slicers" },
        {
          type: "p",
          text: "CNCCookbook's 2024 CAM survey (over 300 responses, skewed to hobby and job shops) found Fusion 360 still the overall leader but losing share, while Mastercam rose significantly; exact percentages are published only as chart images ([CNCCookbook 2024](https://www.cnccookbook.com/cnccookbook-2024-cam-software-survey-which-is-best)). In the 2021 edition Mastercam led the high-end segment with 28.9% and Fusion 360 had 45% overall ([CNCCookbook 2021](https://cnccookbook.com/cnccookbook-2021-cam-survey-whats-the-best-cam)).",
        },
        {
          type: "table",
          caption: "Open-source CAM, machine control and 3D printing (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "Role"],
          rows: [
            ["FreeCAD CAM workbench", "LGPL-2.1", "—", "New tool-library system in 1.1 (Mar 2026)", "2.5D and 3-axis toolpaths, scriptable in Python"],
            ["[LinuxCNC](https://github.com/LinuxCNC/linuxcnc)", "GPL-2.0", "2.5k", "v2.10.0-pre2 (Sep 2026)", "Machine control"],
            ["[grblHAL](https://github.com/grblHAL/core)", "GPL", "530", "Build 20250518; commits Nov 2026", "Firmware for 32-bit motion controllers"],
            ["[Kiri:Moto](https://github.com/GridSpace/grid-apps)", "MIT", "938", "v4.7.3 (Aug 2026)", "Browser slicer and CAM"],
            ["[OrcaSlicer](https://github.com/OrcaSlicer/OrcaSlicer)", "AGPL-3.0", "17k", "v2.5.2 (Nov 2026)", "Desktop slicer"],
            ["[PrusaSlicer](https://github.com/prusa3d/PrusaSlicer)", "AGPL-3.0", "9.5k", "2.9.7 (Nov 2026)", "Slicer"],
            ["[Cura](https://github.com/Ultimaker/Cura)", "LGPL-3.0", "7.1k", "v5.14.0 (Nov 2026)", "Desktop slicer"],
            ["[Klipper](https://github.com/Klipper3d/klipper)", "GPL-3.0", "12k", "Rolling", "3D-printer machine control"],
            ["[OctoPrint](https://github.com/OctoPrint/OctoPrint)", "AGPL-3.0", "9.2k", "v2.0.1 (Nov 2026)", "Web print server"],
          ],
        },
        {
          type: "p",
          text: "AI is arriving in CAM as plug-ins rather than replacements. CloudNC raised a $20 million Series B extension in September 2026, taking its total to $128 million; its CAM Assist handles 3-axis and 3+2-axis parts inside Autodesk Fusion, Mastercam, Siemens NX CAM, GibbsCAM and SolidCAM, is used by over 1,000 machine shops (80% in the US), and a “Quote Agent” for estimating is due later in 2026 ([TechCrunch](https://techcrunch.com/2026/09/08/cloudnc-raises-20m-to-automate-manufacturings-most-pressing-bottlenecks/)). Autodesk made a strategic investment in Toolpath on 21 August 2025, aiming at closed-loop automated CAM in Fusion ([Autodesk News](https://adsknews.autodesk.com/en/news/strategic-investment-toolpath/)).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "shop-floor-tools",
      kicker: "Shop floor and operations",
      title: "PLM, MES, IIoT, quality, maintenance and warehouse software: what exists and what it costs",
      answer:
        "On the operations side the commercial floor is high for a small plant: Tulip's cheapest plan works out to about $12,000 a year and Ignition's suites cost thousands of dollars per server. Open source covers BOMs and work orders inside ERPs (ERPNext, Odoo Community, InvenTree), integration plumbing (Node-RED, Mosquitto, PLC4X) and basic maintenance, but PLM with change control, a mature community MES and an integrated quality system remain gaps.",
      blocks: [
        { type: "h3", text: "PDM, PLM and BOM management" },
        {
          type: "table",
          caption: "BOM, PDM and PLM options",
          columns: ["Product", "Licence or price", "What it covers", "Source"],
          rows: [
            ["OpenBOM", "SaaS: $30 per seat per month (Professional Team), $90 (Company), billed yearly; CAD add-ins $25 per seat per CAD system", "BOM, catalogue, inventory, RFQ and PO, REST API; the Company plan adds CAD file management, revisions and change orders", "[OpenBOM pricing](https://www.openbom.com/pricing)"],
            ["Aras Innovator", "Distributed free since 2007; paid subscriptions for support and upgrades", "Enterprise PLM; licence text not checked, so “open source” is unverified", "[Wikipedia: Aras](https://en.wikipedia.org/wiki/Aras_Corp)"],
            ["Onshape", "Included in the CAD subscription", "Versions, branching and release management", "[Onshape pricing](https://www.onshape.com/en/pricing)"],
            ["InvenTree", "MIT; 7.9k stars; v1.7.3 (Nov 2026)", "Parts, stock and BOMs on Django; REST API, plugins, mobile apps", "[GitHub](https://github.com/inventree/InvenTree)"],
            ["Carbon", "AGPL-3.0, with a commercially licensed enterprise package; 2.9k stars", "ERP, MRP, MES and QMS on one Postgres database with versioned BOMs and routings; API keys and MCP need a commercial licence when self-hosted", "[GitHub](https://github.com/crbnos/carbon)"],
            ["ERPNext", "GPL-3.0; 42k stars; v16 line from January 2026", "BOMs, work orders and item revisions inside the ERP", "[GitHub](https://github.com/frappe/erpnext)"],
            ["DocDokuPLM; PartKeepr", "AGPL-3.0; GPL-3.0", "Abandoned: last commits May 2021 and January 2023", "[DocDokuPLM](https://github.com/docdoku/docdoku-plm); [PartKeepr](https://github.com/partkeepr/PartKeepr)"],
          ],
        },
        {
          type: "p",
          text: "Versioning CAD is its own problem. Git cannot merge binary CAD files, so the usual workaround is Git LFS with file locking, or SVN, according to vendor-written guides ([Anchorpoint](https://www.anchorpoint.app/blog/git-with-solidworks)). A CHI 2026 paper finds CAD version control is traditionally centralised and file-based (download, edit, re-upload) and that open-source hardware communities often use little or none ([arXiv 2602.09236](https://arxiv.org/html/2602.09236v1)). Siemens, at the top of the market, describes a “BOM-aware” AI agent in Teamcenter covering engineering change through BOM execution ([Siemens Teamcenter blog](https://blogs.sw.siemens.com/teamcenter/tag/teamcenter-copilot/)).",
        },
        { type: "h3", text: "MES, production planning and scheduling" },
        {
          type: "p",
          text: "Gartner has not published an MES Magic Quadrant since 2023 in the sources found; it issued Market Guides on 5 May 2025 and 23 March 2026. The 2026 guide says “MES vendors have started to deliver on their roadmap, offering end users an opportunity to bring AI to the shop floor” ([Gartner](https://www.gartner.com/en/documents/7617465); [Siemens blog](https://blogs.sw.siemens.com/opcenter/2026-gartner-market-guide-for-manufacturing-execution-systems-how-ai-is-shaping-mes-and-where-opcenter-adds-customer-value/)). Tulip, a no-code frontline operations platform sold only as SaaS, charges $100 (Essentials) or $250 (Professional) per interface per month billed annually with a ten-interface minimum, so $12,000 or $30,000 a year at the floor; its API and HTTP and SQL connectors start at Professional, and AI is metered as 250 to 1,000 “AI Actions” a month ([Tulip plans](https://tulip.co/plans)). MachineMetrics prices by connected machine and publishes no rates ([MachineMetrics](https://www.machinemetrics.com/pricing)).",
        },
        {
          type: "table",
          caption: "Open-source MES and planning (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "What it is, and the catch"],
          rows: [
            ["ERPNext Manufacturing", "GPL-3.0", "42k", "v16 (Jan 2026)", "BOMs, work orders and job cards; v16 added an MRP workflow and inward subcontracting ([Frappe forum](https://discuss.frappe.io/t/erpnext-hrms-frappe-framework-v16-release-dates/156349))"],
            ["[frePPLe](https://github.com/frePPLe/frepple)", "MIT community; paid Enterprise and Cloud", "784", "v9.19.0 (Oct 2026)", "Forecasting plus advanced planning and scheduling"],
            ["[qcadoo MES](https://github.com/qcadoo/mes)", "AGPL-3.0", "953", "v3.1.23 (Oct 2026)", "Java web MES for SMEs; REST API, ERP and SCADA integrations and Gantt planning are commercial-only"],
            ["[OpenMES](https://github.com/Mes-Open/OpenMes)", "AGPL-3.0 core; commercial licences offered", "204", "v0.29.3 (Nov 2026)", "Gantt scheduling, tablet work-order tracking, Andon, OEE; MQTT, Modbus TCP, OPC UA, REST; one named maintainer"],
            ["Carbon", "AGPL-3.0 + commercial enterprise package", "2.9k", "Rolling", "Digital travellers, shop-floor terminals, barcode and labour capture"],
            ["FactorySemantics MES", "Apache-2.0 (per forum post)", "Not checked", "New in 2026", "OPC UA in, REST and MCP out, with an ERPNext connector ([Frappe forum](https://discuss.frappe.io/t/an-open-source-mes-with-an-erpnext-connector-work-orders-in-manufacture-stock-entries-back-is-th/164655))"],
          ],
        },
        { type: "h3", text: "Industrial IoT, SCADA and machine connectivity" },
        {
          type: "p",
          text: "Ignition 8.3 was released on 16 September 2025 ([Inductive Automation](https://inductiveautomation.com/news/inductive-automation-releases-ignition-83)). It is sold per server as a perpetual licence; published suite prices include Application Building at $13,500, Industrial Historian at $3,500, Alarm Management at $3,200, DataOps at $5,500 and Enterprise Integration at $4,100, with support at 16% to 24% of retail a year ([Ignition pricing](https://inductiveautomation.com/pricing/ignition)). Its free Maker Edition is strictly non-commercial ([Ignition docs](https://docs.inductiveautomation.com/docs/8.3/other-editions/ignition-maker-edition)). Schneider Electric has owned AVEVA outright since January 2023 ([Wikipedia](https://en.wikipedia.org/wiki/Schneider_Electric)).",
        },
        {
          type: "table",
          caption: "Open-source and source-available IIoT building blocks (GitHub, read 22 November 2026)",
          columns: ["Project", "Licence", "Stars", "Latest release", "Role"],
          rows: [
            ["[Node-RED](https://github.com/node-red/node-red)", "Apache-2.0", "24k", "v5.0.10 (Nov 2026)", "Flow-based integration"],
            ["[ThingsBoard](https://github.com/thingsboard/thingsboard)", "BSL 1.1 from v4.4.0; earlier versions Apache-2.0", "22.7k", "v4.4.0.2 (Oct 2026)", "IoT platform with dashboards and a rule engine"],
            ["[FUXA](https://github.com/frangoteam/FUXA)", "MIT", "5.3k", "v1.3.6 (Nov 2026)", "Web SCADA and HMI"],
            ["[OpenPLC runtime](https://github.com/Autonomy-Logic/openplc-runtime)", "GPL-3.0", "450", "v4.3.2 (Nov 2026)", "IEC 61131-3 soft PLC"],
            ["[Apache PLC4X](https://github.com/apache/plc4x)", "Apache-2.0", "1.8k", "v1.0.0 (Sep 2026)", "Libraries to read PLCs over native protocols"],
            ["[United Manufacturing Hub](https://github.com/united-manufacturing-hub/united-manufacturing-hub)", "Apache-2.0 (from AGPL-3.0 in March 2023)", "411", "v0.45.3 (Nov 2026)", "One container: agent, pipelines and a Kafka-compatible buffer for a unified namespace"],
            ["[EMQX](https://github.com/emqx/emqx)", "BSL 1.1 from v5.9.0", "17k", "v6.3.3 (Nov 2026)", "MQTT broker; free production use of a single node only, not hosted or embedded"],
            ["[Eclipse Mosquitto](https://github.com/eclipse-mosquitto/mosquitto)", "EPL-2.0 or EDL-1.0", "11k", "Rolling", "MQTT broker"],
            ["[HiveMQ Community Edition](https://github.com/hivemq/hivemq-community-edition)", "Apache-2.0", "1.2k", "2026.5 (May 2026)", "MQTT broker"],
            ["[TimescaleDB](https://github.com/timescale/timescaledb)", "Apache-2.0 outside `tsl`; Timescale License inside", "24k", "v2.32.1 (Nov 2026)", "Time series on PostgreSQL"],
            ["[Grafana](https://github.com/grafana/grafana)", "AGPL-3.0", "78k", "v13.3.1 (Nov 2026)", "Dashboards"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Licence drift in IIoT",
          text: "EMQX moved to the Business Source License from v5.9.0 in 2025 and ThingsBoard from v4.4.0 in 2026. Both convert each release to Apache-2.0 after four years, and EMQX's free production grant covers a single node and excludes hosted or embedded offerings ([EMQX licence](https://raw.githubusercontent.com/emqx/emqx/HEAD/LICENSE); [ThingsBoard licence](https://raw.githubusercontent.com/thingsboard/thingsboard/HEAD/LICENSE)). United Manufacturing Hub went the other way, from AGPL-3.0 to Apache-2.0, citing exactly this trend ([UMH](https://www.umh.app/insight/united-manufacturing-hub-relicensed-to-apache-2-0)). Pin versions and record each component's licence.",
        },
        { type: "h3", text: "Quality, maintenance, warehouse and robotics" },
        {
          type: "list",
          items: [
            "Quality: Hexagon assembled its manufacturing-intelligence business from Vero Software, Q-DAS, MSC Software and ETQ ([Wikipedia: Hexagon](https://en.wikipedia.org/wiki/Hexagon_AB)); Minitab publishes no prices ([Minitab](https://www.minitab.com/en-us/products/minitab/pricing/)). A search for an open-source QMS covering ISO 9001 document control, FMEA and SPC together surfaced only commercial products. SPC exists as libraries such as [pyspc](https://github.com/carlosqsilva/pyspc), and Carbon includes a QMS module (inspections, first-article inspection, non-conformance, CAPA, calibration) under AGPL-3.0.",
            "Maintenance (CMMS): aggregator figures put IBM Maximo Application Suite from about $3,150 a month and Fiix from $45 per user per month, with UpKeep at $24 and $55 on its first two tiers ([Capterra](https://www.capterra.com/resources/cmms-software-pricing-models/)). Open options are [Atlas CMMS](https://github.com/Grashjs/cmms) (AGPL-3.0 in the repository, dual-licensed with licence-key features; software directories call it GPLv3) and [openMAINT](https://www.openmaint.org/en/), built on CMDBuild, whose 4.3 release came on 14 October 2026.",
            "Warehouse and inventory: InvenTree (MIT), [GreaterWMS](https://github.com/GreaterWMS/GreaterWMS) (Apache-2.0, V2.1.54), [OpenBoxes](https://github.com/openboxes/openboxes) (EPL-1.0) and ERPNext Stock.",
            "Robotics and vision: ROS 2 “Lyrical Luth” reached general availability on 22 May 2026 and is supported until May 2031 ([ROS docs](https://docs.ros.org/en/lyrical/Releases/Release-Lyrical-Luth.html)); NVIDIA's Isaac ROS 5.0 (22 September 2026) supports it and adds “agent skills” for AI coding assistants ([NVIDIA](https://blogs.nvidia.com/blog/isaac-ros-5-0/)); [OpenCV](https://github.com/opencv/opencv) is Apache-2.0 at v5.1.0.",
          ],
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "ai-for-engineering",
      kicker: "AI and text-to-CAD",
      title: "What AI does for engineering in 2026: assistants, MCP servers and text-to-CAD benchmarks",
      answer:
        "Every major CAD vendor now ships an in-product assistant, but in the sources found only Autodesk (Fusion MCP and Fusion Data MCP) and PTC (the Onshape FeatureScript MCP Server in Labs) offered official MCP servers an outside agent can call. Four benchmarks published in 2025 and 2026 agree that language models are reliable at simple prismatic parts and at editing existing parametric code, unreliable at sweeps, lofts, shells and exact dimensions, and improve most when they can run the CAD kernel and read test results.",
      blocks: [
        {
          type: "table",
          caption: "What the CAD vendors shipped for AI",
          columns: ["Vendor", "What shipped", "When", "Source"],
          rows: [
            ["Autodesk", "Autodesk Assistant in Fusion, Inventor, Moldflow and Vault; in Fusion it can execute tasks on the model. Two official MCP servers: Fusion MCP (local, Fusion must be running) and Fusion Data MCP (remote, no Fusion needed)", "Reported 22 Apr 2026", "[Engineering.com](https://www.engineering.com/autodesk-announces-fusion-mcp-servers-and-more-ai-updates/)"],
            ["Autodesk", "“Fusion Compute MCP”, cloud-hosted Fusion capabilities with no local install. Single vendor source; page could not be fetched", "2026", "[Autodesk blog](https://www.autodesk.com/products/fusion-360/blog/fusion-compute-mcp/)"],
            ["Dassault (SOLIDWORKS)", "Virtual companions AURA and LEO: LEO generates assembly structures, adds parametric features to STEP files, runs simulation studies. In a Labs (beta) tab; needs a 3DEXPERIENCE connection", "2026 FD01 to FD03 (Jun–Aug 2026)", "[SOLIDWORKS](https://www.solidworks.com/product/solidworks-design/ai-virtual-companions.md)"],
            ["Siemens", "Design Copilot NX; Designcenter X NX Copilot that “turns natural language into action”; an AI BOM agent in Teamcenter", "2025–2026", "[Siemens blog](https://blogs.sw.siemens.com/designcenter/ai-enabled-design-whats-new-in-designcenter-nx-december-2025-release/)"],
            ["PTC (Onshape)", "AI Advisor; FeatureScript MCP Server in Onshape Labs, so Claude, ChatGPT or Gemini can write, test and refine custom parametric features", "13 Aug 2026", "[PTC press release](https://www.nasdaq.com/press-release/ptc-advances-leadership-ai-driven-design-launch-onshape-featurescript-mcp-server-2026)"],
            ["Zoo (KittyCAD)", "Zookeeper, a conversational CAD agent that edits KCL models, inspects its own result and searches datasheets. Free tier with $10 credit, then $0.50 a minute; Plus $20, Pro $99 a month", "5 Feb 2026", "[Zoo](https://zoo.dev/blog/announcing-zookeeper)"],
            ["Adam", "CADAM: open-source (GPL-3.0) browser text-to-CAD that writes OpenSCAD and runs it as WebAssembly", "v0.3.0, Jun 2026", "[GitHub](https://github.com/Adam-CAD/CADAM)"],
          ],
          note: "Naming trap: Dassault's SOLIDWORKS companion “LEO” and the start-up Leo AI ($9.7 million seed, September 2025) are unrelated.",
        },
        {
          type: "table",
          caption: "Community MCP servers for engineering tools (GitHub, read 22 November 2026)",
          columns: ["Server", "Licence", "Stars", "How it works"],
          rows: [
            ["[neka-nat/freecad-mcp](https://github.com/neka-nat/freecad-mcp)", "MIT", "3.4k", "An addon inside FreeCAD runs an RPC server; creates and edits models, runs Python and FEM. FreeCAD must stay open"],
            ["[mixelpixx/KiCAD-MCP-Server](https://github.com/mixelpixx/KiCAD-MCP-Server)", "MIT", "3.5k", "KiCad 9 and 10: project setup, schematic editing, placement, routing through Freerouting, DRC and ERC, export"],
            ["[ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)", "MIT", "35.4k", "Blender addon socket on localhost:9876 with no authentication; can execute arbitrary Blender code. Not made by Blender"],
            ["[hedless/onshape-mcp](https://github.com/hedless/onshape-mcp)", "None stated", "170", "Community Onshape server, v0.4.0"],
          ],
        },
        { type: "h3", text: "What the benchmarks measured" },
        {
          type: "table",
          caption: "Text-to-CAD benchmarks, 2025–2026",
          columns: ["Benchmark", "Set-up", "Headline result"],
          rows: [
            ["[Text-to-CadQuery](https://arxiv.org/html/2505.06507v1) (May 2025)", "About 170,000 text-to-CadQuery pairs; six fine-tuned models from 124M to 7B parameters", "Best model (Qwen2.5-3B) cut median Chamfer distance about 48% against the Text2CAD baseline, with a 6.5% invalid rate"],
            ["[Text2CAD-Bench](https://arxiv.org/html/2605.18430v1) (May 2026)", "600 human-curated tasks in four tiers, general LLMs writing CadQuery", "88.9% executable on tier 1 and 80.0% on tier 2 (GPT-5.2); on tier 3 (sweeps, lofts, shells) 30–32% for Claude 4.5 Sonnet and GPT-5.2, IoU about 0.25. No model led on real-world tier 4 across all measures"],
            ["[CADTestBench](https://arxiv.org/html/2605.07807v1) (May 2026)", "200 prompts with 5,937 executable geometric and topological tests", "Pass rates (detailed / abstract prompts): Text2CAD 2.5% / 8.5%; GPT-5.2 agent 48% / 69.5%; Claude 4.6 Sonnet agent 58% / 71.5%; Claude 4.6 Sonnet with test and geometry feedback 62.5% / 81%"],
            ["[BenchCAD](https://arxiv.org/html/2605.10865) (May 2026)", "17,900 verified CadQuery programs across 106 industrial part families, about half tied to ISO, DIN or ASME tables", "Image-to-code weak (Gemini 3.1 Pro about 0.32–0.40); editing existing code strong (GPT-5.3 thinking 0.865, Claude Opus 4.7 thinking 0.853)"],
          ],
        },
        {
          type: "list",
          items: [
            "Emitting CadQuery code beat emitting command sequences, and specialist fine-tuned text-to-CAD models (Text2CAD, CADFusion) scored near-zero IoU in Text2CAD-Bench ([arXiv 2605.18430](https://arxiv.org/html/2605.18430v1)).",
            "Feedback from running the kernel helped; rendered-image feedback did not, and cost many more tokens. Dimensional, topological and spatial-arrangement requirements were the hardest ([arXiv 2605.07807](https://arxiv.org/html/2605.07807v1)).",
            "Models recovered outer shape but missed threads and chamfers, misread standard-driven parameters and replaced sweeps and lofts with simple extrudes ([arXiv 2605.10865](https://arxiv.org/html/2605.10865)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: give agents a kernel, not a mouse",
          text: "Every benchmark points the same way. An agent that writes parametric code (CadQuery, build123d, OpenSCAD, KCL or FeatureScript), runs it, and checks the result against executable tests does better than one that draws or looks at renders. For a factory the practical uses today are editing existing parametric parts and generating simple prismatic ones, with a person checking dimensions. Our [CAD/CAM and CNC integration page](/cad-cam-cnc-integration) describes how we link those files to orders and production rather than generate them.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "agent-drivable",
      kicker: "What agents can drive",
      title: "Which engineering tools can an AI agent drive, and which are closed desktops?",
      answer:
        "Tools an agent can drive today fall into three groups: browser-native or API-first systems it can call directly (Onshape, Zoo, SimScale at Enterprise, InvenTree, Carbon, OpenBOM, Tulip from Professional); headless open-source engines it can run on a server (CadQuery, FreeCADCmd, the OpenSCAD CLI, kicad-cli, OpenFOAM); and closed desktop seats (SOLIDWORKS, NX, Mastercam, Altium Designer) whose AI lives inside the seat and which a hub reaches only through neutral files or a local bridge on the engineer's PC.",
      blocks: [
        {
          type: "table",
          caption: "How each tool can be reached by an agent or a web hub",
          columns: ["Tool", "Where it runs", "Automation surface found", "What an agent can do today"],
          rows: [
            ["Onshape", "Browser-native SaaS", "Official FeatureScript MCP Server (Labs); community MCP server", "Generate and test custom parametric features"],
            ["Autodesk Fusion", "Desktop client with cloud data", "Fusion MCP (local), Fusion Data MCP (remote)", "Model through a running local seat; query and manage design data remotely"],
            ["SOLIDWORKS", "Windows desktop", "AURA and LEO inside the seat", "Not callable from outside in the sources found; exchange by STEP and other neutral files"],
            ["Siemens NX", "Desktop", "NX Copilot inside the seat", "No external agent interface found"],
            ["FreeCAD", "Desktop; headless console", "FreeCADCmd Python shell; community MCP servers", "Server-side scripted modelling and export"],
            ["CadQuery, build123d", "Python library", "Python code", "The best-studied LLM target; run in a sandbox"],
            ["KiCad", "Desktop; headless CLI", "kicad-cli; IPC API (needs the GUI until KiCad 11); MCP servers", "Checks and fabrication outputs on a server now"],
            ["OpenFOAM, CalculiX, SU2", "Linux command line", "Text case files and scripts", "Batch simulation on a server"],
            ["CloudNC CAM Assist", "Plug-in inside a CAM seat", "Runs in the host CAM application", "No standalone API found"],
            ["InvenTree, Carbon, OpenBOM", "Web apps", "REST APIs; Carbon also MCP (commercial when self-hosted)", "Fully drivable"],
            ["Tulip", "SaaS", "API and connectors from Professional", "Drivable at $250 per interface per month and up"],
            ["qcadoo MES", "Java web app", "REST API only in the commercial edition", "Open edition hard to integrate"],
          ],
          note: "Sources as cited in the sections above; summarised from each project's documentation or repository.",
        },
        {
          type: "p",
          text: "The “local bridge” is now a standard shape rather than a workaround. Autodesk's Fusion MCP, and the community servers for FreeCAD, Blender and KiCad, all run a small server beside a running desktop application ([Engineering.com](https://www.engineering.com/autodesk-announces-fusion-mcp-servers-and-more-ai-updates/); [freecad-mcp](https://github.com/neka-nat/freecad-mcp)). Blender's community bridge listens on a local socket with no authentication and can execute arbitrary code, which is a reminder that a bridge inherits the full power of the application it controls ([blender-mcp](https://github.com/ahujasid/blender-mcp)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Licences decide what can be embedded",
          text: "Chili3D, CADAM, OpenMES, qcadoo, Atlas CMMS, Grafana and the Prusa and Orca slicers are copyleft (AGPL-3.0 or GPL-3.0): modifying them and serving them to users brings source-sharing duties. CadQuery, build123d and OCP (Apache-2.0), OCCT and FreeCAD (LGPL-2.1), InvenTree, FUXA, Online3DViewer, three.js and tscircuit (MIT), and Node-RED, PLC4X, UMH, GreaterWMS and HiveMQ CE (Apache-2.0) are straightforward to bundle or link. This is a reading of the licences, not legal advice.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: three tiers, one hub",
          text: "Call browser-native and API-first tools directly. Run headless open-source engines on your own servers as agent tools. Leave licensed desktop seats where they are and wrap them: the hub manages files, revisions, approvals and tasks around the seat, and reaches the seat through the vendor's own add-in or MCP server where one exists. That is the approach our [Factory Graph](/factory-graph) takes: it connects the systems a manufacturer already runs rather than replacing them, and a named product is a possible integration target, not a pre-built connector.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "neutral-formats",
      kicker: "Formats and viewers",
      title: "Neutral formats and open web viewers: holding engineering data without owning the CAD tool",
      answer:
        "A hub can hold engineering data without owning the CAD tool by keeping native files as attachments and deriving a neutral set per revision: STEP AP242 for exact geometry and product manufacturing information, JT or glTF for lightweight viewing, IPC-2581 or ODB++ for boards, and QIF for inspection results, with machine data arriving through MTConnect, OPC UA and MQTT in an ISA-95 structure. MIT-licensed browser viewers can show STEP files without a server.",
      blocks: [
        {
          type: "table",
          caption: "Neutral formats and standards a factory can rely on",
          columns: ["Standard", "What it carries", "Status", "Source"],
          rows: [
            ["STEP AP242", "Exact geometry with PMI; deployed by all major CAD vendors per NIST", "ISO 10303-242:2025, edition 4 (August 2025)", "[ISO](https://www.iso.org/standard/84300.html); [NIST](https://www.nist.gov/node/1653821)"],
            ["JT", "Lightweight tessellated data, B-rep, PMI and metadata", "ISO 14306:2012 and 2017; royalty-free specification", "[Wikipedia: JT](https://en.wikipedia.org/wiki/JT_(visualization_format))"],
            ["QIF 3.0", "Measurement plans, results, part geometry, PMI and statistics in XML", "ANSI QIF 3.0, also ISO 23952:2020; free to implement", "[QIF standards](https://qifstandards.org/)"],
            ["MTConnect", "Machine-tool data; a companion specification maps it onto OPC UA", "Reference C++ agent is Apache-2.0", "[OPC Foundation](https://opcfoundation.org/markets-collaboration/mtconnect/); [cppagent](https://github.com/mtconnect/cppagent)"],
            ["ISA-95 / B2MML", "The functional model between MES and ERP; B2MML is its open XML form", "An OPC UA companion specification exposes a subset of ISA-95 objects", "[OPC 10030](https://reference.opcfoundation.org/specs/OPC-10030/4)"],
            ["MQTT with Sparkplug B, unified namespace", "A publish-subscribe hub with an ISA-95-shaped topic tree", "Common in IIoT; edge gateways translate Modbus and similar", "[HiveMQ](https://hivemq.com/resources/smart-manufacturing-using-isa95-mqtt-sparkplug-and-uns)"],
            ["IPC-2581, ODB++", "PCB fabrication data", "Exported headless by kicad-cli", "[KiCad CLI](https://docs.kicad.org/10.0/en/cli/cli.html)"],
            ["OpenUSD", "3D scenes", "v26.11.1 (Oct 2026) under a modified Apache-2.0 licence", "[OpenUSD](https://github.com/PixarAnimationStudios/OpenUSD)"],
            ["Asset Administration Shell", "Standard submodels per asset", "Eclipse BaSyx Java SDK (MIT) still on 2.0.0 milestones", "[BaSyx](https://github.com/eclipse-basyx/basyx-java-server-sdk)"],
          ],
        },
        {
          type: "table",
          caption: "Open-source web viewers for engineering files",
          columns: ["Viewer", "Licence", "Latest release", "What it does"],
          rows: [
            ["[Online3DViewer](https://github.com/kovacsv/Online3DViewer)", "MIT", "v0.18.0 (Dec 2025)", "Opens STEP, IGES and many 3D formats entirely in the browser; nothing is uploaded"],
            ["[three.js](https://github.com/mrdoob/three.js)", "MIT", "r187 (Oct 2026)", "WebGL and WebGPU rendering"],
            ["[three-cad-viewer](https://github.com/bernhard-42/three-cad-viewer)", "MIT", "v5.2.1 (Nov 2026)", "Viewer used for code-CAD output"],
            ["[xeokit SDK](https://github.com/xeokit/xeokit-sdk)", "AGPL-3.0 (commercial licences sold)", "v2.6.114 (Sep 2026)", "High-performance BIM and IFC viewer after conversion"],
            ["[Chili3D](https://github.com/xiangechen/chili3d)", "AGPL-3.0", "v0.8.0 (Oct 2026)", "Full browser CAD that also opens STEP, IGES and BREP"],
            ["[opencascade.js](https://github.com/donalffons/opencascade.js)", "LGPL-2.1", "v1.1.1 (2020)", "OCCT in WebAssembly; stale since March 2023"],
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: a derived neutral set per revision",
          text: "Keep the native file as an opaque attachment and derive, for every released revision, STEP AP242 for geometry, a GLB for fast viewing, a PDF drawing, the BOM as structured rows, IPC-2581 for boards and QIF for inspection. All of these can be produced by headless open-source tools listed above. Because opencascade.js is stale, new in-browser work is better built on occt-import-js (as Online3DViewer does) or done server-side and shipped to the browser as glTF.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "indian-msme-adoption",
      kicker: "Indian MSME adoption",
      title: "What Indian MSMEs and small manufacturers actually run: the survey data",
      answer:
        "The best neutral survey (RIS with Kantar, 2,882 MSMEs, published 2026) finds near-universal smartphones, internet and digital payments but only 12% using ERP, 13% CRM, 14% cloud and 7% AI. A vendor survey of 500 established SME manufacturers finds 34% fully on ERP, 15% on Tally-type accounting only and 9% on Excel or paper. No survey measures CAD, CAM, PLM or MES use among Indian MSMEs.",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "12%", label: "of 2,882 MSMEs use ERP (RIS with Kantar)", source: { label: "RIS", url: "https://ris.org.in/sites/default/files/Publication/MSME_Digitalisation_Report.pdf" } },
            { value: "9.5%", label: "of auto-component makers use ERP, the lowest of five sectors", source: { label: "RIS", url: "https://ris.org.in/sites/default/files/Publication/MSME_Digitalisation_Report.pdf" } },
            { value: "34%", label: "of 500 SME manufacturers fully on ERP (vendor survey)", source: { label: "B-Square", url: "https://www.bsquare.in/images/BSquare_ERP_Adoption_Report_2026_FINAL_updated%20.pdf" } },
            { value: "56%", label: "of software installed in India unlicensed in 2017 (BSA)", source: { label: "FactorDaily", url: "https://archive.factordaily.com/the-big-muscle-anti-piracy-tactics-of-microsoft-adobe-autodesk-in-india/" } },
          ],
        },
        {
          type: "p",
          text: "The RIS report (“MSME Digitalisation in India: Current Status and Challenges”, by Pankaj Vashisht, funded by the Mastercard Center for Inclusive Growth) surveyed enterprises in clusters across fourteen states. Half are manufacturers in auto components, food products and wearing apparel; most are micro enterprises. More than 8% tried and then abandoned e-commerce, citing platform fees first ([RIS report](https://ris.org.in/sites/default/files/Publication/MSME_Digitalisation_Report.pdf)).",
        },
        {
          type: "table",
          caption: "Digital adoption among 2,882 Indian MSMEs (RIS with Kantar, 2026)",
          columns: ["Technology", "All MSMEs", "Auto-component manufacturers"],
          rows: [
            ["Any digital product", "Over 95%", "—"],
            ["Internet", "94%", "—"],
            ["Digital payments", "87%", "—"],
            ["Website", "19%", "15.8%"],
            ["Cloud", "14%", "14.7%"],
            ["CRM", "13%", "11.4%"],
            ["ERP", "12%", "9.5%"],
            ["Supply-chain management", "11%", "10.6%"],
            ["AI", "7%", "6.7%"],
          ],
          note: "Source: RIS, “MSME Digitalisation in India”, 2026. 56% of connected firms rely on mobile data.",
        },
        {
          type: "table",
          caption: "ERP status among 500 SME manufacturers (B-Square, January–April 2026)",
          columns: ["Status", "Share"],
          rows: [
            ["ERP fully deployed", "34%"],
            ["ERP deployed, under half the modules used", "19%"],
            ["Evaluating", "14%"],
            ["Had ERP and rolled back", "9%"],
            ["Only Tally or other accounting software", "15%"],
            ["Excel, manual or no system", "9%"],
          ],
          note: "B-Square sells ERP. Sample: decision-makers at manufacturers with 10 to 500 employees and ₹1 crore to ₹500 crore turnover in 12 states, ±4.4% ([B-Square report](https://www.bsquare.in/images/BSquare_ERP_Adoption_Report_2026_FINAL_updated%20.pdf)).",
        },
        {
          type: "p",
          text: "The same vendor survey lists the pains manufacturers had before ERP: inventory inaccuracy (71%), no real-time view of production (63%), slow month-end close (58%), GST errors (54%), defects that cannot be traced to a root cause (47%), purchase orders going through WhatsApp or phone (44%) and duplicate data entry (36%). Among firms not yet on ERP or only partly on it, 42% cite resistance from staff and management and 31% cost; 38% of those who abandoned ERP said implementation took too long, with failed projects averaging 9.4 months. A mobile app for shop-floor supervisors was a buying criterion for 79% (41% in 2022), and GST complexity triggered 58% of post-2017 adoptions ([B-Square report](https://www.bsquare.in/images/BSquare_ERP_Adoption_Report_2026_FINAL_updated%20.pdf)).",
        },
        { type: "h3", text: "Other surveys" },
        {
          type: "list",
          items: [
            "FICCI (October 2023, over 600 manufacturing SMEs in 14 cities): accounting software such as Tally, Vyapar and Busy, and ERP or CRM, are the most used digital tools; 37% use cloud business applications; about 40% cite a lack of skilled people ([ThePrint/ANI](https://theprint.in/economy/indian-smes-embrace-digitalisation-sustainability-ficci/1811443/)).",
            "CyberMedia Research (June 2025, over 400 MSMEs, tied to a Vi Business programme): 43% report proficiency in ERP, CRM and cloud; 23% have adopted AI, IoT or analytics; barriers are limited perceived value (84%), data-security concerns (81%) and skills (56%) ([CMR](https://cmrindia.com/67-of-msmes-demonstrate-digital-readiness-across-core-and-advanced-technologies-finds-cmr-study/)).",
            "Tally says more than 2.7 million businesses use TallyPrime (July 2026) and claims about 70% share among MSMEs; these are company claims ([Tally](https://tallysolutions.com/business-guides/why-businesses-trust-tallyprime/); [YourStory](https://yourstory.com/smbstory/tallys-nupur-goenka-charts-a-new-digital-course-for-msmes)).",
            "Unlicensed software: BSA measured 58% of software installed in India as unlicensed in 2015, down from 60% in 2013 ([BSA](https://www.bsa.org/news-events/news/use-of-unlicensed-software-at-58-percent-in-india-new-bsa-survey-finds)), and 56% in 2017. A December 2025 law-firm note calls India the third-most affected market after China and Russia ([Lakshmikumaran & Sridharan](https://lakshmisri.com/insights/articles/unauthorised-software-navigating-the-spectrum-of-software-piracy-and-compliance-action)), and Dassault Systèmes has won Indian court relief against companies running unlicensed SOLIDWORKS ([Conventus Law](https://conventuslaw.com/report/india-dassaults-landmark-victory-against-software-infringement/)).",
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Why 12% and 34% are both right",
          text: "RIS samples mostly micro enterprises across manufacturing and trade; B-Square samples 10-to-500-employee manufacturers reached through industry associations, and sells ERP. A fair statement is about one in eight MSMEs overall, rising to a third to a half among established small and mid-sized manufacturers. The Vi Business self-assessment study gives internally inconsistent figures for manufacturing maturity, so we do not rely on it ([Vi Business](https://www.myvi.in/business/enterprise-segments/smb/msme-growth-insights-study-report-2025)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: design constraints, not a feature list",
          text: "The surveys translate into four design rules for software aimed at this market: mobile-first shop-floor screens, local-language support, living alongside Tally rather than replacing it on day one, and treating WhatsApp as an input channel for purchase orders and approvals. With shop-floor visibility and traceability named as top pains while full MES is priced out of reach, the first product for a small Indian factory is lightweight production tracking and inventory accuracy. Our [manufacturing solutions page](/manufacturing-solutions) describes how we approach that by type of plant.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "open-source-maturity",
      kicker: "Open-source maturity",
      title: "Where open source is production-grade in manufacturing, and where the gaps are",
      answer:
        "Open source is production-grade for kernels and code-CAD, board design, solvers, machine control and slicing, integration and time-series plumbing, and ERP-level inventory. The clear gaps are PLM and PDM with change control, a mature community MES, an integrated QMS with automotive core tools, professional multi-axis CAM, and a maintained browser B-rep toolkit under a permissive licence. Several “open” projects are open-core or have moved to source-available licences.",
      blocks: [
        {
          type: "table",
          caption: "Open-source maturity by function, November 2026",
          columns: ["Function", "State", "Strongest candidates"],
          rows: [
            ["Geometry kernel, code-CAD", "Production-grade", "OCCT, CadQuery, build123d, OpenSCAD, Manifold"],
            ["Interactive mechanical CAD", "Active and improving; no independent production assessment found", "FreeCAD 1.1.x"],
            ["Browser CAD", "Emerging; copyleft or unmaintained", "Chili3D, CADAM on OpenSCAD WebAssembly, the Zoo app"],
            ["Electronics design", "Production-grade", "KiCad 10"],
            ["Simulation solvers", "Production-grade solvers", "OpenFOAM, CalculiX, Elmer, SU2, FEniCSx"],
            ["CAM", "Basic 2.5D and 3-axis; no evidence of professional 5-axis", "FreeCAD CAM, Kiri:Moto"],
            ["Machine control and slicing", "Production-grade", "LinuxCNC, grblHAL, Klipper, OrcaSlicer, PrusaSlicer"],
            ["PLM and PDM", "Gap", "InvenTree and ERP BOMs as a partial substitute; Carbon"],
            ["ERP, MRP, inventory", "Production-grade", "ERPNext, Odoo Community, InvenTree"],
            ["Advanced scheduling", "Good (open-core)", "frePPLe Community"],
            ["MES", "Gap: small or open-core projects", "Carbon, OpenMES, qcadoo"],
            ["IIoT, historian, dashboards", "Production-grade; watch licences", "Node-RED, PLC4X, UMH, Mosquitto, HiveMQ CE, TimescaleDB, Grafana, FUXA"],
            ["Quality, FMEA, PPAP", "Gap", "Carbon QMS; SPC libraries"],
            ["Maintenance (CMMS)", "Adequate; copyleft and open-core", "Atlas CMMS, openMAINT"],
            ["Warehouse", "Adequate", "GreaterWMS, OpenBoxes, InvenTree"],
            ["Robotics and vision", "Production-grade foundations", "ROS 2 Lyrical (supported to 2031), OpenCV 5"],
            ["Web viewing", "Good for STEP and meshes under MIT", "Online3DViewer, three.js"],
          ],
          note: "Maturity judgements rest on release cadence, community size and backing, not on measured production use. Sources are linked in the earlier sections.",
        },
        {
          type: "p",
          text: "The evidence on the gaps is specific. The two historically cited open-source PLM projects are dead (DocDokuPLM, last commit May 2021; PartKeepr, last release 2018), and comparison sites fall back on Aras, Odoo PLM and OpenBOM ([FitGap](https://us.fitgap.com/search/product-lifecycle-management-plm-software/open-source)). The established open MES keeps its integrations in the commercial edition, the Libre MES repository no longer resolves, and newer entrants are small or have one maintainer ([qcadoo](https://github.com/qcadoo/mes); [OpenMES](https://github.com/Mes-Open/OpenMes)). OpenSCAD's last tagged release is 2021.01 even though the repository is active, so users depend on development snapshots ([OpenSCAD](https://github.com/openscad/openscad)).",
        },
        {
          type: "p",
          text: "Star counts mislead in both directions. They favour hobbyist and maker tools (OrcaSlicer at 17,000, the Blender MCP bridge at 35,400) over industrial ones (qcadoo under 1,000, the MTConnect agent at 185). Projects whose primary home is elsewhere, such as KiCad on GitLab, are also undercounted on GitHub.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: build the records, embed the engines",
          text: "The gaps (PLM with change control, MES, QMS) are the record-keeping and workflow layers. The strengths (kernels, solvers, ECAD, machine control, connectivity) are specialist engines. That division suits a hub: own the systems of record and their links, and call or embed the engines. Open-source PLM has repeatedly failed as a standalone product while BOM and revision handling has grown inside ERPs and cloud CAD, which suggests PLM is being absorbed into adjacent systems. If you want to see where your own plant sits on this map, start with an [industrial systems audit](/industrial-systems-audit).",
        },
      ],
    },
  ],
  method: [
    "Repository facts (stars, licence, latest release, last commit) were read on 22 November 2026 from the GitHub API and badge endpoints; licences GitHub could not classify were read from each repository's licence file.",
    "Prices are list prices from vendor pages or, where labelled, aggregator and dealer listings. They come from different dates and currencies and are indicative only.",
    "The shared web-search budget ran out part-way through. List prices for CATIA, NX, Solid Edge, Creo, Inventor, AutoCAD, Mastercam, SolidCAM, Teamcenter, Windchill, SAP Digital Manufacturing and several QMS products were not verified and are not given.",
    "No survey of CAD, CAM, PLM, MES, SCADA or CMMS use among Indian MSMEs was found; statements about Indian adoption cover ERP, CRM, cloud and AI only.",
    "Items found only in search summaries are marked “reported”. Background knowledge that could not be verified in this session is left out.",
  ],
  faq: [
    {
      q: "What software does a manufacturing company use?",
      a: "Typically mechanical CAD and often electronics CAD for design, simulation for verification, CAM to turn geometry into machine programs, PDM or PLM for part numbers and revisions, ERP for BOMs, orders and stock, MES for what was actually made, SCADA and IIoT for machine data, plus quality, maintenance and warehouse systems. Smaller Indian manufacturers often run accounting software such as Tally, Excel and WhatsApp in place of several of these.",
    },
    {
      q: "Is there a free alternative to SolidWorks?",
      a: "FreeCAD (LGPL-2.1) is the main open-source interactive CAD, with version 1.1 released in March 2026. Code-CAD libraries such as CadQuery and build123d (Apache-2.0) suit scripted and AI-generated parts, and Onshape has a free plan. No independent assessment of FreeCAD on large production assemblies was found, so test it on your own parts before switching.",
    },
    {
      q: "How much does SolidWorks cost in India?",
      a: "A Dassault store offer through an Indian reseller lists a single-user SOLIDWORKS subscription at ₹171,240 a year (₹136,992 with a 20% promotion) before tax. Dealer listings on IndiaMART show about ₹3,00,000 to ₹3,50,000 per seat described as a lifetime licence; those are dealer listings, not official prices.",
    },
    {
      q: "What is the best open-source MES?",
      a: "There is no mature community MES yet. qcadoo MES is the established project but keeps its REST API and integrations in the commercial edition; OpenMES and FactorySemantics are new and small; Carbon covers ERP, MES and QMS but is AGPL-3.0 with commercially licensed parts. Many small plants use ERPNext or Odoo work orders and job cards instead.",
    },
    {
      q: "Can AI generate CAD models from a text prompt?",
      a: "For simple parts, yes, and editing existing parametric code works well. In Text2CAD-Bench (May 2026) the best general models executed about 80–89% of simple tasks but only 30–32% of complex ones involving sweeps, lofts and shells. Results improve when the agent can run the CAD kernel and check its output against tests.",
    },
    {
      q: "Which CAD software has an MCP server for AI agents?",
      a: "In the sources found, Autodesk has official Fusion MCP (local) and Fusion Data MCP (remote) servers, and PTC has a FeatureScript MCP Server for Onshape in Onshape Labs. Community servers exist for FreeCAD, KiCad, Blender and Onshape. SOLIDWORKS and Siemens NX had in-product assistants but no official external agent interface in the sources found.",
    },
    {
      q: "What percentage of Indian MSMEs use ERP?",
      a: "About 12% in the RIS and Kantar survey of 2,882 MSMEs published in 2026, which is mostly micro enterprises. Among established manufacturers with 10 to 500 employees, a vendor survey by B-Square found 34% fully on ERP and another 19% using it partially, with 15% on accounting software only.",
    },
    {
      q: "Is open-source software safe to use for factory IIoT?",
      a: "The core plumbing is mature: Node-RED, Mosquitto, HiveMQ Community Edition, Apache PLC4X, TimescaleDB and Grafana are widely used. The risk is licensing rather than quality: EMQX and ThingsBoard moved to the Business Source License in 2025 and 2026, which restricts some production and hosted uses. Pin versions and record each component's licence.",
    },
  ],
  platformLinks: ["cadCam", "manufacturing", "iot", "factoryGraph", "audit"],
  relatedReports: [
    "manufacturing-knowledge-graph-ontology",
    "embed-stream-integrate-specialist-software",
    "future-of-erp-crm-agentic-ai",
  ],
  blogSlugs: ["text-to-cad-benchmarks-2026", "indian-msme-software-adoption-2026"],
};
