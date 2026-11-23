import type { ResearchReport } from "../types";

/**
 * Research report: agent-orchestration platforms, web IDEs, human oversight
 * and the evidence on multi-agent systems. Facts checked on 2026-11-22.
 * Opinion is confined to "Our reading" callouts.
 */
export const AGENT_ORCHESTRATION_REPORT: ResearchReport = {
  slug: "ai-agent-orchestration-platforms",
  shortTitle: "Agent orchestration platforms",
  title: "AI Agent Orchestration Platforms in 2026: What Actually Works",
  h1: ["A company of agents still needs", "a manager, a reviewer and a budget."],
  description:
    "Paperclip, coding agents, browser IDEs and human-oversight patterns compared, with the evidence on when multi-agent systems help, hurt and fail.",
  eyebrow: "Research · AI agents",
  lead:
    "In 2026 the question moved from “can an AI agent write code?” to “who manages twenty of them?”. Products such as Paperclip model a whole company of agents, with an org chart, budgets and approvals; coding agents moved into cloud workspaces; and a handful of oversight patterns became standard across vendors. This report reads what these products actually ship, what their users report, and what controlled studies say about when several agents beat one.",
  primaryKeyword: "AI agent orchestration platform",
  keywords: [
    "paperclip ai",
    "multi-agent systems",
    "human in the loop AI agents",
    "browser IDE for AI agents",
    "code-server vs openvscode server",
    "AI agent sandbox providers",
    "agent client protocol",
    "agentic AI governance",
    "AI coding agent benchmarks",
  ],
  publishedAt: "2026-11-23",
  updatedAt: "2026-11-23",
  dataAsOf: "2026-11-22",
  readMinutes: 26,
  keyFindings: [
    {
      value: "115.9k",
      label: "GitHub stars for Paperclip, an MIT-licensed “company of agents” control plane created on 2 March 2026.",
      source: { label: "GitHub, paperclipai/paperclip", url: "https://github.com/paperclipai/paperclip" },
    },
    {
      value: "+80.8% to −70.0%",
      label: "Range of multi-agent results against a single agent across 260 configurations: large gains on decomposable tasks, large losses on sequential ones.",
      source: { label: "Kim et al., arXiv 2512.08296", url: "https://arxiv.org/abs/2512.08296" },
    },
    {
      value: "≈15×",
      label: "Tokens Anthropic's multi-agent research system uses compared with chat. Single agents use about 4 times as many.",
      source: { label: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/multi-agent-research-system" },
    },
    {
      value: "59.4%",
      label: "Of 138 audited SWE-bench Verified problems had material flaws. OpenAI stopped reporting the benchmark on 23 February 2026.",
      source: { label: "OpenAI", url: "https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/" },
    },
  ],
  summary: [
    "Paperclip is a control plane, not an agent: it models a company (org chart, goals, issues, budgets, approvals, heartbeats) and drives other vendors' agents through adapters. Workflow builders model a fixed graph of steps; coding agents model one worker.",
    "Independent accounts of Paperclip report that review cost can exceed the work saved, that agent-to-agent check-ins burn tokens, and that budgets stop spend without judging whether the work is right. The project itself dropped its “zero-human company” tagline.",
    "Developers can work in a central web hub with open parts (code-server or Theia, Open VSX, one container per task), but Microsoft's VS Code Server licence and Marketplace terms rule out reusing Microsoft's own server and extension store in a product offered to others.",
    "Seven oversight controls recur across almost every product: the ticket as the unit of work, allow / ask-first / block on each action, budgets with hard stops, scheduled wake-ups, a manager-and-workers hierarchy, one screen of runs, and a separate reviewer before a person sees the result.",
    "Multi-agent systems help when work splits into independent pieces and hurt when it is sequential. What works in production is one writer with other agents advising, reviewing or working on separate pieces, at several times the token cost.",
    "Verification is the binding constraint. The best-documented multi-agent successes all rest on a strong automatic check, which most business departments do not yet have.",
    "Five projects in this space were archived, closed or sunset during 2026, and several popular engines carry licences that restrict hosting them for others. Build the organisation layer yourself and keep the parts underneath replaceable.",
  ],
  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "company-of-agents",
      kicker: "Company of agents",
      title: "What is a “company of agents” platform, and how does it differ from a workflow builder?",
      answer:
        "A “company of agents” platform such as Paperclip is a control plane: it models an organisation (who reports to whom, which goals exist, which tickets are open, what each worker may spend, who must approve what) and wakes other vendors' agents to do the work. A workflow builder controls a fixed sequence of steps, and a coding agent controls one working session. The unit of control is the difference.",
      blocks: [
        {
          type: "p",
          text: "Paperclip lives at [github.com/paperclipai/paperclip](https://github.com/paperclipai/paperclip) and calls itself “the open-source app everyone uses to manage agents at work”. Its README describes “a Node.js server and React UI that orchestrates a team of AI agents to run a business”, and sums up the positioning in one line: “If OpenClaw is an employee, Paperclip is the company.” It is MIT-licensed, copyright Paperclip Labs, Inc.",
        },
        {
          type: "stats",
          items: [
            {
              value: "115,887",
              label: "Stars on 22 November 2026, with 19,237 forks, for a repository created on 2 March 2026",
              source: { label: "GitHub", url: "https://github.com/paperclipai/paperclip" },
            },
            {
              value: "≈4k",
              label: "Open issues, beside about 3k open pull requests and more than 2,700 merged",
              source: { label: "GitHub", url: "https://github.com/paperclipai/paperclip" },
            },
            {
              value: "1–2 weeks",
              label: "Release rhythm: v2026.1005.0 on 6 October through v2026.1117.0 on 18 November 2026",
              source: { label: "Paperclip releases", url: "https://github.com/paperclipai/paperclip/releases" },
            },
          ],
        },
        {
          type: "p",
          text: "Growth was unusually fast: about 30,000 stars in the first three weeks, 53,487 on 14 April and 69,955 on 11 June 2026, when 105 contributors faced 4,953 open issues ([fast.io review](https://fast.io/resources/paperclip-ai-review-2026/); [rywalker research note](https://rywalker.com/research/paperclip)). The lead developer is pseudonymous, @dotta, who presented the project as “Dotta” at AI Engineer Europe 2026 ([AI Engineer](https://ai.engineer/talks/h403btjldDQ-paperclip-open-source-human-control-plane-ai)). The About page names Paperclip Labs, Inc. and “a small team” but lists no founders, investors or funding ([paperclip.ing](https://paperclip.ing/about/)).",
        },
        {
          type: "table",
          caption: "What Paperclip models, as documented in its README (November 2026)",
          columns: ["Concept", "How it works"],
          rows: [
            ["Org chart", "Each agent has a manager, a title and a job description; delegation moves up and down the chart."],
            ["Goals", "Tasks and projects link to organisation goals, and agents receive that goal context."],
            ["Issues", "One assignee per issue, atomic checkout with execution locks so two runs cannot claim the same task, blockers, comments, documents and work products."],
            ["Heartbeats", "Agents wake for assigned work, follow-up messages or schedules (“If it can receive a heartbeat, it's hired”). Since v2026.1005.0 an @-mention alone no longer starts a run."],
            ["Budgets", "Company, agent and project budgets with warnings and hard stops. Usage reporting lag and in-flight work “can delay a stop”."],
            ["Governance", "The human acts as the board: approvals for new hires, review and approval stages, pause, resume, terminate or reassign."],
            ["Adapters", "Thirteen built in, including Claude Code, Codex, Gemini CLI, Cursor, OpenCode, Hermes, Grok, Kimi Code, OpenClaw Gateway and generic process and HTTP adapters."],
            ["MCP Tool Gateway", "Each action set to Allowed, Ask first or Off; a person can approve one call or save a revocable rule."],
            ["Routines", "Recurring tasks by cron, webhook or API; each run creates a tracked issue."],
          ],
          note: "Sources: the [Paperclip README](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md) and [adapters reference](https://docs.paperclip.ing/reference/adapters/overview/).",
        },
        {
          type: "p",
          text: "The stack is a Node.js 24.11+ server, React, TypeScript and an embedded PostgreSQL by default, installed with npx paperclipai@latest onboard --yes; telemetry is on by default and can be switched off with an environment variable ([README](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md)). Execution workspaces give each task a repository checkout, and since v2026.1117.0 every subtask gets its own execution workspace, with sandbox providers including e2b, Cloudflare, Daytona, Modal and self-hosted Kubernetes ([releases](https://github.com/paperclipai/paperclip/releases)). The adapters reference notes that Cursor and native Grok “do not supply authoritative per-run cost totals” ([Paperclip docs](https://docs.paperclip.ing/reference/adapters/overview/)).",
        },
        { type: "h3", text: "How Paperclip describes the difference" },
        {
          type: "list",
          items: [
            "“Not an agent framework”: it does not prescribe how to build agents; it runs a company made of them.",
            "“Not just a workflow builder”: routines run inside an organisation with roles, goals, budgets and governance.",
            "“Not a prompt manager”: agents bring their own prompts, models and runtimes.",
            "Against Claude Code or OpenClaw, Paperclip “uses those agents and orchestrates them into a company, with org charts, budgets, goals, governance, and accountability” ([README](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md)).",
          ],
        },
        {
          type: "p",
          text: "The visual-workflow category is contracting at the same time. Flowise froze its code on 29 July 2026 and archived its repository on 13 August 2026; its maintainer wrote that “the typical rigid workflow low-code approach quickly hits the limit when it comes to complexity” as developers move to coding agents ([Flowise discussion](https://github.com/FlowiseAI/Flowise/discussions/6727)). OpenAI is withdrawing Agent Builder, its visual multi-agent canvas, and Evals, unavailable from 30 November 2026, pointing users to the Agents SDK instead ([OpenAI](https://openai.com/index/introducing-agentkit/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: three different units of control",
          text: "A workflow builder controls steps, a coding agent controls one session, and Paperclip controls an organisation: who may be assigned what, what it may cost, who reviews it and when each worker wakes. That is why it can sit above Claude Code, Codex or OpenClaw without competing with them, and why its failures, described in the next section, are oversight failures rather than model failures.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "paperclip-results",
      kicker: "Results and failures",
      title: "What results and failures do Paperclip users report?",
      answer:
        "The orchestration works, but independent accounts report that agents produce work faster than one person can review it, that agents checking in with each other burn tokens, that budgets stop spending without judging whether the work is right, and that agents sometimes overreach. Most user reports are anecdotal and relayed by blogs, some of which sell adjacent products, and the project has dropped its “zero-human company” pitch.",
      blocks: [
        {
          type: "p",
          text: "The maker's own account, from AI Engineer Europe 2026, is modest. He mainly runs Codex and Claude coders; routines handle pull requests, daily Discord summaries and changelogs; default concurrency is one parallel run. His advice: hire agents one at a time and prove their quality before expanding, do not start from a 130-agent template, and match model strength to role. People still set direction and taste, approve hires and phased plans, rewrite agent instructions after poor behaviour and debug, and organisational learning “is still largely manual” ([AI Engineer](https://ai.engineer/talks/h403btjldDQ-paperclip-open-source-human-control-plane-ai)).",
        },
        {
          type: "quote",
          text: "Auditing Paperclip's work took more time than doing the work directly.",
          cite: "Alien Brain Trust, “Why We Killed Paperclip” (5 April 2026), an anecdotal account from a one-person business",
          url: "https://abt-blog.pages.dev/ai-learning/2026-04-05-why-we-killed-paperclip",
        },
        {
          type: "p",
          text: "That business ran CEO, CTO and CFO agents on a Claude subscription with real EC2 and GitHub access for “a few months”. Agents executed faster than the owner could review; each morning brought branches, drafts and tickets for work that was not the priority, and a week of drift had to be unwound. It replaced Paperclip with single-purpose bots behind a human approval gate ([Alien Brain Trust](https://abt-blog.pages.dev/ai-learning/2026-04-05-why-we-killed-paperclip)).",
        },
        {
          type: "table",
          caption: "Reported problems, by type",
          columns: ["Problem", "What was reported", "Source and its status"],
          rows: [
            ["No quality gate", "“Governance catches structural problems, not wrong work”: broken layouts, generic copy, unsourced statistics presented as fact. Verdict: “the orchestration works, but the autonomous business promise does not hold up yet”.", "[fast.io](https://fast.io/resources/paperclip-ai-review-2026/); the publisher sells a product it recommends alongside Paperclip"],
            ["Coordination burn", "CEO, CTO and CMO agents “kept checking in and passing tickets back and forth”; a five-agent team ran for weeks without instructions; one operator reported about EUR 20,000 on setup and EUR 650 a month with no revenue.", "[preuve.ai](https://preuve.ai/blog/paperclip-ai-review), drawn from Reddit threads the author calls self-selected and unverified"],
            ["Overreach", "A CEO agent tried to hire a marketing manager despite an instruction not to hire; a Codex agent sent real email through a Gmail account connected elsewhere.", "[preuve.ai](https://preuve.ai/blog/paperclip-ai-review), anecdotal"],
            ["Security", "12 GitHub advisories, five rated critical, two without a named fix as of early October 2026; the Codex adapter “still defaults its bypass setting to true”.", "[preuve.ai](https://preuve.ai/blog/paperclip-ai-review); the advisories were counted by one review"],
            ["Uptime", "It stops when the host machine sleeps, so it needs an always-on machine.", "[preuve.ai](https://preuve.ai/blog/paperclip-ai-review)"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Cost figures conflict",
          text: "Paperclip's own pages, as quoted in one review, estimate USD 5 to 20 to try it, USD 20 to 100 a month for an active company and about USD 3 to 15 a month per moderately active worker ([preuve.ai](https://preuve.ai/blog/paperclip-ai-review)). A promotional review puts a three-to-five agent setup at USD 600 to 1,000 a month in API fees ([fast.io](https://fast.io/resources/paperclip-ai-review-2026/)). The maker's own dashboard showed zero spend because he runs on Claude and Codex subscriptions, which he says is not zero cost and may not scale with a team.",
        },
        {
          type: "p",
          text: "There are positive small-scale accounts. One developer ran seven agents on heartbeats from every 30 minutes to twice daily at no extra cost on an existing subscription, without revenue figures; the lessons were to set budget caps before launch and to start with one agent ([dev.to, anecdotal](https://dev.to/manja316/running-a-zero-human-company-with-paperclip-and-claude-code-1nk8)). The cost pattern is not unique to Paperclip: an engineering blog argues that unbounded loops, not token prices, drive runaway agent cost, and that agents past a certain depth “re-litigate settled decisions” ([Unblocked](https://getunblocked.com/blog/agent-auto-loop-token-cost)); commenters on Hacker News trace most cost problems to ambiguous completion criteria ([Ask HN](https://hn.svelte.dev/item/47559293)).",
        },
        { type: "h3", text: "Structural risks and direction" },
        {
          type: "list",
          items: [
            "A June 2026 analysis found a three-month-old project with one main author, 4,953 open issues against 105 contributors, no paid tier or support entity, and warned that “star counts overstate verified production usage” ([rywalker](https://rywalker.com/research/paperclip)).",
            "The tagline changed from “open-source orchestration for zero-human companies” (April 2026) to “the app people use to manage AI agents for work” (June 2026), with no change in architecture ([rywalker](https://rywalker.com/research/paperclip)).",
            "There is no official hosted service: the hosted plan is a waitlist, and a third-party host shut down on 2 October 2026 ([preuve.ai](https://preuve.ai/blog/paperclip-ai-review)).",
            "October and November 2026 releases moved toward a team product: outside assistants such as Claude Code and Codex can connect over MCP and delegate work, agents can run through a company's model gateway, a live browser “that people can watch and take over”, “model-backed prompt injection prevention”, and “Coordinator workspace and Agent Chat become the default layout”. A Pipelines experiment was removed ([releases](https://github.com/paperclipai/paperclip/releases)).",
            "Planned items in the README include Work Queues, Self-Organization, Automatic Organizational Learning, a Desktop App and bring-your-own ticket systems such as Asana, Linear and Jira ([README](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md)).",
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the failures are about oversight",
          text: "None of the reported failures is “the model could not do the task”. They are “work arrived faster than a person could judge it”, “nobody defined done”, and “a budget stopped spend without judging value”. Copying an org chart of agents without a strong review queue and explicit completion criteria will reproduce them. We cover the controls that address this in our [agentic ERP and CRM page](/agentic-erp-crm) and in the oversight section below.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "web-ide",
      kicker: "Developing in a hub",
      title: "What would it take for developers to work entirely inside a central web hub?",
      answer:
        "The parts exist and are open source: an MIT browser IDE (code-server) or Eclipse Theia, the Open VSX extension registry, one container or microVM workspace per person and per agent task defined by a dev container, a web terminal and a port proxy for previews. Microsoft's own VS Code Server and Marketplace cannot be used this way, because their terms forbid hosting them for others and limit the Marketplace to Microsoft products.",
      blocks: [
        {
          type: "p",
          text: "The licence line is precise. The VS Code source repository is MIT (“Code - OSS”), but the downloadable Visual Studio Code product ships under “a traditional Microsoft product license” ([VS Code wiki](https://github.com/microsoft/vscode/wiki/Differences-between-the-repository-and-Visual-Studio-Code)). Microsoft's VS Code Server licence says you may not “host, share, publish, rent or lease the software” or “provide the software as a stand-alone offering or combine it with any of your applications for others to use” ([VS Code Server licence](https://code.visualstudio.com/license/server)). The Marketplace “is not a general purpose store designed to support any distribution”, and code-server's FAQ states that “Microsoft prohibits the use of any non-Microsoft VS Code from accessing their marketplace”, so it uses Open VSX; Live Share and the Remote extensions are unavailable ([code-server FAQ](https://coder.com/docs/code-server/FAQ)).",
        },
        {
          type: "table",
          caption: "Browser IDE and editor building blocks (GitHub, read 22 November 2026)",
          columns: ["Component", "What it is", "Licence", "Stars and activity", "Embedding notes"],
          rows: [
            ["[code-server](https://github.com/coder/code-server)", "VS Code in the browser, patched for self-hosting", "MIT", "79.9k, active", "Sub-path hosting, built-in port proxy, needs HTTPS for web views, Open VSX gallery"],
            ["[OpenVSCode Server](https://github.com/gitpod-io/openvscode-server)", "Upstream VS Code with “minimal bits” to run as a server", "MIT", "6.2k, last push 24 Sep 2026", "Maintainer Gitpod rebranded as Ona, whose site now reads “Part of OpenAI”"],
            ["[Eclipse Theia](https://github.com/eclipse-theia/theia)", "A platform for custom IDEs; “NOT a fork of VS Code”, uses Monaco", "EPL-2.0", "21.8k; 1.77 on 19 Nov 2026", "Runs VS Code extensions from Open VSX; Theia AI with custom agents"],
            ["[Eclipse Che](https://github.com/eclipse-che/che)", "Kubernetes-based cloud development environments", "EPL-2.0", "7.2k, active", "Needs Kubernetes"],
            ["[Monaco Editor](https://github.com/microsoft/monaco-editor)", "VS Code's editor component, no workbench", "MIT", "47.0k, active", "Editor only: no file tree, terminal or extensions"],
            ["[xterm.js](https://github.com/xtermjs/xterm.js)", "Terminal for the web", "MIT", "21.4k", "Used by VS Code, Theia, Che, JupyterLab and Replit"],
            ["[Open VSX](https://github.com/eclipse/openvsx)", "Vendor-neutral extension registry", "EPL-2.0", "Self-hostable", "Can mirror another registry"],
            ["[Coder](https://github.com/coder/coder)", "Self-hosted workspaces “for developers and their agents”", "AGPL-3.0 (Community)", "17.5k, active", "AWS, Azure, GCP, on-premises or air-gapped"],
            ["[DevPod](https://github.com/loft-sh/devpod)", "Client-only “Codespaces but open-source”", "MPL-2.0", "15.3k, last push 14 Nov 2025", "Appears unmaintained for a year"],
            ["[Daytona](https://github.com/daytonaio/daytona)", "Sandbox runtime for AI-generated code", "Archived", "71.3k, archived 3 Oct 2026", "Core development moved to a private codebase in June 2026"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "Two more licence traps",
          text: "Microsoft's hosted vscode.dev has no terminal or debugger and runs only web-compatible extensions ([VS Code docs](https://code.visualstudio.com/docs/setup/vscode-web)). StackBlitz's WebContainer API, which runs Node.js inside the browser tab, needs a commercial licence for “production usage of the API in a commercial, for-profit setting”, including serving employees ([WebContainers](https://webcontainers.io/enterprise)).",
        },
        { type: "h3", text: "How hosted products give a person or an agent a workspace" },
        {
          type: "list",
          items: [
            "GitHub Codespaces runs a Docker dev container from devcontainer.json on a dedicated VM, keeps /workspaces across stops and rebuilds, keeps forwarded ports private by default and uses a repository-scoped token ([GitHub Docs](https://docs.github.com/en/codespaces/about-codespaces/deep-dive)).",
            "The GitHub Copilot cloud agent works one branch and one pull request per task, either in Actions-based sessions of at most 59 minutes or in cloud sandboxes that can span repositories ([GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)).",
            "Claude Code self-hosted environments (public beta) put a runner inside the customer's network that polls Anthropic's queue over outbound HTTPS: “Anthropic never connects into your network”, though the conversation still goes to Anthropic ([Claude Code docs](https://code.claude.com/docs/en/self-hosted-environments.md)).",
            "Devin gives each parallel session its own cloud machine, and added Windows VMs on 21 May 2026 and Android emulators on 13 May 2026 ([Devin release notes](https://docs.devin.ai/release-notes/overview)).",
            "Amp gives each thread an “orb”, a cloud sandbox teammates can join to “share control of the same agent, code, and running app” ([ampcode.com](https://ampcode.com/)).",
            "Coder's own agent picks a workspace template the user may access, and developers then open the same workspace in VS Code, Cursor or JetBrains to review and finish ([Coder docs](https://coder.com/docs/ai-coder/tasks)). Coder's comparison page claims Ona Cloud shut down in October 2026, a competitor's statement ([Coder](https://coder.com/solutions/workspaces/ona-alternative)).",
            "OpenHands, MIT, runs each conversation in its own Docker container with its own agent server REST API ([OpenHands](https://github.com/OpenHands/OpenHands)); Vibe Kanban gives an agent a branch, a terminal and a dev server, and sends reviewers' inline diff comments straight to the agent ([Vibe Kanban](https://github.com/BloopAI/vibe-kanban)).",
          ],
        },
        { type: "h3", text: "Sandboxes for agent code" },
        {
          type: "table",
          caption: "Agent sandbox providers: vendors' list figures",
          columns: ["Provider", "Isolation", "Start time (vendor claim)", "List price", "Open source or self-host"],
          rows: [
            ["E2B", "Firecracker microVM", "≈150 ms", "$0.0504 per vCPU-hour, wall-clock", "Apache-2.0 self-hosted runtime"],
            ["Daytona", "Container by default, VM classes", "Under 90 ms", "$0.0504 per vCPU-hour, wall-clock", "Open repository archived"],
            ["Modal", "gVisor (VM option)", "Sub-second", "≈$0.142 per core-hour", "Managed only; GPUs available"],
            ["Cloudflare Sandbox", "Firecracker microVM running a container", "1 to 3 s", "$0.072 per vCPU-hour, active", "SDK Apache-2.0, platform managed"],
            ["Vercel Sandbox", "Firecracker microVM", "“Milliseconds”", "$0.128 per active vCPU-hour", "SDK Apache-2.0, platform managed"],
            ["Beam", "gVisor and runc, microVM opt-in", "≈0.5 s", "$0.05 per vCPU-hour", "Self-host via Beta9 (AGPL-3.0)"],
            ["Northflank", "Kata and Cloud Hypervisor", "Under 1 s", "$0.01667 per vCPU-hour", "Managed, bring your own cloud"],
            ["Runloop", "VM on a custom hypervisor", "A few seconds", "$0.108 per CPU-hour", "Winding down; support until 13 Nov 2026"],
          ],
          note: "Source: [Upstash's comparison of 15 providers](https://upstash.com/blog/ai-agent-sandbox-providers-compared-2026), last checked November 2026. Upstash is itself a provider and ranks its own product first. It notes that active-CPU billing costs less than wall-clock billing while an agent waits on a model, and that model tokens are billed separately everywhere.",
        },
        {
          type: "p",
          text: "The self-hostable isolation primitives are all Apache-2.0: [Firecracker](https://github.com/firecracker-microvm/firecracker) (38.2k stars), [gVisor](https://github.com/google/gvisor) (20.1k) and the Kubernetes SIG [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) (4.7k). Docker Sandboxes run coding agents in microVM isolation locally or in Docker's cloud, with organisation-wide policies on a paid plan ([Docker docs](https://docs.docker.com/ai/sandboxes/)). Claude Managed Agents, in public beta since 8 April 2026, charge standard token rates plus $0.08 per session-hour of active runtime and keep credentials in vaults outside the sandbox ([Anthropic](https://claude.com/blog/claude-managed-agents)).",
        },
        { type: "h3", text: "Connecting agents to an editor" },
        {
          type: "p",
          text: "The Agent Client Protocol (ACP), “a protocol for connecting any editor to any agent”, is Apache-2.0 with 4.7k stars ([ACP](https://github.com/agentclientprotocol/agent-client-protocol)). Zed launched it in 2025 with Gemini CLI, JetBrains joined in October 2025 and calls it the counterpart of LSP, a shared ACP Registry entered beta on 28 January 2026, and Copilot CLI and Cursor have joined ([Zed](https://zed.dev/blog/jetbrains-on-acp); [JetBrains](https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the workspace replaces local VS Code, not the editor",
          text: "An editor in a tab is the easy part. What replaces a laptop is the workspace: a container or microVM built from a dev container, a terminal over a WebSocket, a port proxy for previews and Git credentials scoped to the person. Every product above separates a control plane from runners and lets runners live in the customer's network with outbound-only connections. People and agents should use the same workspace template, one per task, so a person can open exactly what the agent worked in. Because Daytona withdrew its open repository and Runloop is winding down, keep the runner interface swappable.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "toolchain-absorbed",
      kicker: "Toolchain consolidation",
      title: "How the developer toolchain is being absorbed into agent hubs",
      answer:
        "Through 2026 the main coding-agent vendors widened into whole developer platforms: GitHub put agents from several labs under one “mission control”, Cursor added an app marketplace and cloud agents that build and host internal apps, Cognition added review, triage and always-on bots, and Warp, Factory, Kiro and Google's Antigravity sell multi-agent “factories”. Underneath, open self-hostable equivalents exist for almost every tool a team uses.",
      blocks: [
        {
          type: "list",
          items: [
            "GitHub Agent HQ (announced October 2025) runs agents from OpenAI, Anthropic, Google and xAI under one “mission control” across web, VS Code, mobile and CLI, with a control plane for policy and audit logs ([GitHub](https://github.blog/news-insights/company-news/welcome-home-agents/)).",
            "Cursor shipped an app marketplace (“Origin”, 13 October 2026) and cloud agents that build web apps with a database and auth and share them behind Cursor sign-in ([Cursor changelog](https://cursor.com/changelog)). Its parent was acquired by SpaceX in an all-stock deal that closed on 14 August 2026 at a USD 60 billion implied value ([Wikipedia](https://en.wikipedia.org/wiki/Cursor_(company))).",
            "Cognition added Devin Review (21 January 2026), Auto-Triage (18 May 2026) and always-on “Devin Bots” with their own identity, memory and permissions (19 November 2026), and reports crossing USD 1 billion annualised revenue on 25 September 2026 ([Cognition](https://cognition.com/blog)).",
            "Factory's Droids work across the command line, desktop, web, mobile, Slack, Teams, Jira, Linear and CI, with “persistent Droid Computers” and human approval checkpoints ([factory.com](https://factory.com/)).",
            "Warp sells “cloud software factories” defined in a factory.yaml of agents, models, triggers and approval gates, and says most organisations start with 20 to 30% of pull requests fully automated, a vendor claim ([warp.dev](https://www.warp.dev/)).",
            "Codex CLI 0.171.0 (20 November 2026, Apache-2.0, 136.1k stars) turned its terminal into a workspace with subagent transcripts and remote control from a paired device ([Codex changelog](https://learn.chatgpt.com/docs/changelog); [openai/codex](https://github.com/openai/codex)). Google Antigravity reached 2.0 on 19 May 2026 and added “Antigravity for Knowledge Work” on 9 November 2026 ([Antigravity](https://antigravity.google/blog)).",
          ],
        },
        {
          type: "stats",
          items: [
            {
              value: "70%+",
              label: "Of developers in the 2026 Stack Overflow survey use AI daily; 66% use coding assistants or agents",
              source: { label: "Stack Overflow 2026", url: "https://survey.stackoverflow.co/2026/ai" },
            },
            {
              value: "66% / 59%",
              label: "Most used coding-agent tools in the same survey: Claude Code and GitHub Copilot",
              source: { label: "Stack Overflow 2026", url: "https://survey.stackoverflow.co/2026/ai" },
            },
          ],
        },
        {
          type: "table",
          caption: "Open, self-hostable equivalents of the developer toolchain (GitHub, read 22 November 2026)",
          columns: ["Category", "Tool", "Licence", "Stars"],
          rows: [
            ["Source control", "[Gitea](https://github.com/go-gitea/gitea)", "MIT", "59.2k"],
            ["Source control", "[Forgejo](https://forgejo.org/faq/)", "GPL v3+ from v9.0", "Hosted on Codeberg"],
            ["CI", "[Woodpecker](https://github.com/woodpecker-ci/woodpecker)", "Apache-2.0", "8.3k"],
            ["Issues and projects", "[Plane](https://github.com/makeplane/plane)", "AGPL-3.0", "63.0k"],
            ["Issues and projects", "[OpenProject](https://github.com/opf/openproject)", "GPL-3.0", "17.6k"],
            ["Docs and wiki", "[Outline](https://github.com/outline/outline)", "BSL 1.1 (no hosted “Document Service”)", "41.3k"],
            ["Docs and wiki", "[Docmost](https://github.com/docmost/docmost)", "AGPL-3.0", "22.4k"],
            ["Deployment", "[Coolify](https://github.com/coollabsio/coolify)", "Apache-2.0", "66.4k"],
            ["Observability", "[Sentry](https://github.com/getsentry/sentry)", "Functional Source License 1.1", "45.9k"],
            ["Observability", "[SigNoz](https://github.com/SigNoz/signoz)", "MIT except ee/", "32.7k"],
            ["API client", "[Bruno](https://github.com/usebruno/bruno)", "MIT", "48.5k"],
            ["Feature flags", "[Unleash](https://github.com/Unleash/unleash)", "AGPL-3.0", "14.3k"],
            ["Secrets", "[OpenBao](https://github.com/openbao/openbao)", "MPL-2.0", "9.1k"],
            ["App builder", "[bolt.diy](https://github.com/stackblitz-labs/bolt.diy)", "MIT", "20.1k"],
          ],
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: the hub is being built either way",
          text: "Each vendor is assembling the same hub: tickets, review, deployment and agents under one login. The difference for a company is whether that hub is locked to one vendor's agent or sits above all of them. Paperclip's adapters show the second shape is possible, and its newest releases also let Claude Code and Codex connect to it over MCP, so the hub is reachable from the tools developers already use.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "oversight-patterns",
      kicker: "Human oversight",
      title: "Which human-oversight patterns for AI agents are becoming standard?",
      answer:
        "Seven controls recur across almost every product: the ticket as the unit of work with an agent as assignee, a three-way setting on each action (allowed, ask first, blocked), budgets with hard stops, scheduled or event wake-ups instead of always-on loops, a manager-and-workers hierarchy, one screen that lists every run and which ones need a person, and a separate reviewer before a human sees the result. Identity is settling on scoped credentials per agent.",
      blocks: [
        {
          type: "table",
          caption: "Oversight patterns and who implements them (November 2026)",
          columns: ["Pattern", "How it is implemented", "Examples"],
          rows: [
            ["Ticket as the unit of work", "One assignee, single checkout, blockers; each routine run creates a tracked issue. Agents can be assignees without being billable seats.", "[Paperclip](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md); [Linear](https://linear.app/docs/agents-in-linear); [GitHub](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent); [Jules](https://jules.google/)"],
            ["Approval per action", "Each tool or action set to Allowed, Ask first or Off, with single-call approval or a revocable saved rule.", "Paperclip; [Devin](https://docs.devin.ai/release-notes/overview) (12 Nov 2026); [Relevance AI](https://relevanceai.com/); [Lindy](https://www.lindy.ai/); [Cowork](https://claude.com/blog/cowork-research-preview)"],
            ["Plan approval first", "The agent drafts a plan a person approves before execution.", "Jules; Paperclip board; [Replit](https://docs.replit.com/replitai/agent); [Claude Code agent teams](https://code.claude.com/docs/en/agent-teams.md)"],
            ["Budgets and caps", "Company, agent and project budgets; hierarchical budgets for users and organisations; token budgets.", "Paperclip; Devin Budgets (30 Oct 2026); [Coder AI Gateway](https://coder.com/solutions/workspaces/ona-alternative); [Claude Code scheduled tasks](https://code.claude.com/docs/en/routines.md)"],
            ["Scheduled wake-ups", "Heartbeats, cron, webhooks and events instead of tight polling; Claude Code runs scheduled tasks no more often than hourly.", "Paperclip; Claude Code; Devin reminders (11 Nov 2026); [Cursor](https://cursor.com/changelog); [Hermes](https://github.com/NousResearch/hermes-agent)"],
            ["Org chart and delegation", "A manager splits work among workers, each in its own environment.", "Paperclip; Devin managing Devins (19 Mar 2026); [Gas Town](https://github.com/gastownhall/gastown); Claude Code agent teams; Warp “Foreman”"],
            ["One screen of runs", "A single view of every run and which ones need a person.", "[Claude Code agent view](https://code.claude.com/docs/en/agents.md); [GitHub mission control](https://github.blog/changelog/2025-11-27-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/); Vibe Kanban; [Conductor](https://www.conductor.build/)"],
            ["Separate reviewer", "Assignee, then reviewer, then approver; review before a person opens the pull request.", "Paperclip; [Devin Review](https://cognition.com/blog/multi-agents-working); Claude Code Code Review"],
            ["Quality gates as code", "Hooks that block completion and send feedback; scorers that grade finished runs.", "Claude Code TaskCompleted hook; Warp scorers; Paperclip agent evals"],
            ["Audit trail", "Every action attributed; every prompt and tool call logged by user; export to a SIEM.", "Paperclip; Coder AI Gateway; Cowork; Relevance AI"],
          ],
        },
        { type: "h3", text: "Identity and authority" },
        {
          type: "list",
          items: [
            "Scheduled tasks in Claude Code act as the person: “Commits and pull requests carry your GitHub user” ([Claude Code docs](https://code.claude.com/docs/en/routines.md)).",
            "A message from another agent is not consent. Claude Code tells a receiving agent that a message “came from another Claude session, not from you”; a teammate “can't approve a permission prompt or supply consent on your behalf”, and a denied action cannot be relayed to another teammate to get around the check ([agent teams](https://code.claude.com/docs/en/agent-teams.md)).",
            "The MCP specification of 28 July 2026 requires clients to validate the iss parameter, binds client credentials to their issuer, deprecates Dynamic Client Registration in favour of Client ID Metadata Documents, and makes Enterprise Managed Authorization an official extension ([MCP blog](https://blog.modelcontextprotocol.io/posts/2026-07-28/)).",
            "A2A v1.0 (March 2026) added signed agent cards for cryptographic identity, multi-tenancy and version negotiation ([AAIF](https://aaif.io/blog/a2a-joins-aaif)).",
            "Managed Agents keep credentials out of the sandbox where generated code runs, and Paperclip passes secret references to authorised runs without copying values into agent configuration.",
          ],
        },
        {
          type: "callout",
          tone: "finding",
          title: "Developers' trust is conditional",
          text: "In the 2026 Stack Overflow survey, 48% trust AI output when they can easily validate it, and only 16% extend trust to most tasks that are not important work decisions ([Stack Overflow](https://survey.stackoverflow.co/2026/ai)). News coverage of the same survey reports that 6.6% would trust it with important decisions ([IT Brief](https://itbrief.com.au/story/stack-overflow-survey-shows-developers-trust-ai-with-caveats)).",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: budgets are necessary and weak",
          text: "The three-way permission on each action, with a saved and revocable rule, has become a common grammar: four unrelated vendors use nearly the same words. Budgets cap spend but lag behind work in flight and say nothing about value, so the products with the best-reported outcomes pair them with a reviewer agent and a human review queue. Hourly-or-slower schedules plus event triggers are replacing the tight polling loops that caused the reported token waste. These are the same controls our agents are built around: approved tools, approval on anything consequential, and an audit trail ([agentic ERP and CRM](/agentic-erp-crm)).",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "multi-agent-evidence",
      kicker: "Multi-agent evidence",
      title: "Do multi-agent systems beat a single agent? What the evidence says",
      answer:
        "Multi-agent systems help when work splits into independent pieces and hurt when it is sequential: one controlled study measured changes from +80.8% to −70.0% against a single agent. What works in production is one writer with other agents advising, reviewing or working on separate pieces under a manager, at several times the token cost. Long-task capability keeps rising, but controlled studies of real developer speed remain inconclusive.",
      blocks: [
        { type: "h3", text: "What the builders learned" },
        {
          type: "list",
          items: [
            "Anthropic (13 June 2025): a lead agent with parallel subagents beat a single agent by 90.2% on an internal research evaluation. Agents use about 4 times the tokens of chat, multi-agent systems about 15 times, and token usage alone explained 80% of performance variance on one benchmark. “Most coding tasks have fewer truly parallelizable parts than research” ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).",
            "Cognition (12 June 2025): “Share context, and share full agent traces, not just individual messages” and “Actions carry implicit decisions, and conflicting decisions carry bad results”; default to a single-threaded agent ([Cognition](https://cognition.com/blog/dont-build-multi-agents)).",
            "Cognition (22 April 2026) narrowed that: what works is where “writes stay single-threaded and the additional agents contribute intelligence rather than actions”: a reviewer with clean context, a stronger model consulted on hard steps, and a manager splitting work across child agents. Parallel-writer swarms “still don't see meaningful adoption” ([Cognition](https://cognition.com/blog/multi-agents-working)).",
            "Cursor (14 January 2026): flat coordination with locks failed (“Twenty agents would slow down to the effective throughput of two or three”); planners, workers and a judge worked, and hundreds of concurrent agents wrote over 1 million lines for a browser in about a week. “Prompts mattered more than the harness” ([Cursor](https://cursor.com/blog/scaling-agents)).",
            "Anthropic (5 February 2026): 16 parallel agents coordinating through lock files produced a 100,000-line C compiler over nearly 2,000 sessions for just under USD 20,000 (2 billion input and 140 million output tokens). It builds Linux 6.9 on three architectures, but its output is slower than GCC with optimisations off, merge conflicts were frequent, and the author stresses the task verifier must be “nearly perfect” ([Anthropic](https://www.anthropic.com/engineering/building-c-compiler)).",
          ],
        },
        { type: "h3", text: "Controlled studies" },
        {
          type: "p",
          text: "Across 260 configurations (five architectures, six benchmarks, three model families), multi-agent performance against a single agent ranged from +80.8% on decomposable financial reasoning to −70.0% on sequential planning; architectures without centralised verification propagated errors more, and a predictive model picked the best architecture for 87% of held-out configurations ([Kim et al., arXiv 2512.08296](https://arxiv.org/abs/2512.08296)). A taxonomy built from more than 1,600 annotated traces across seven frameworks identifies 14 failure modes in three groups (system design, inter-agent misalignment and task verification) and notes that gains on popular benchmarks are “often minimal” ([Cemri et al., arXiv 2503.13657](https://arxiv.org/abs/2503.13657)).",
        },
        { type: "h3", text: "Capability benchmarks, read with care" },
        {
          type: "table",
          caption: "METR 50% time horizons (version 1.1; values read as minutes)",
          columns: ["Model", "50% time horizon", "Note"],
          rows: [
            ["Claude Mythos Preview (early)", "≈1,045 (95% interval 509 to 3,304)", "Roughly 17 hours; METR calls figures above 16 hours unreliable"],
            ["Claude Opus 4.6", "≈719 (317 to 3,634)", "About 12 hours, with a wide interval"],
            ["Gemini 3.1 Pro", "≈384", "About 6 hours"],
            ["GPT-5.2", "≈352", "About 6 hours"],
            ["GPT-5.3-Codex", "≈350", "About 6 hours"],
            ["GPT-5.4", "≈342", "About 6 hours"],
            ["Claude Opus 4.5", "≈293", "About 5 hours"],
            ["GPT-5", "≈203", "About 3.4 hours"],
          ],
          note: "Source: [METR's data file](https://metr.org/assets/benchmark_results_1_1.yaml). METR says tasks are self-contained and automatically scored while “real work is messier”, and the page is no longer actively updated (last update 8 September 2026) ([METR](https://metr.org/time-horizons/)). Under version 1.1 the post-2023 doubling time is 131 days ([METR](https://metr.org/blog/2026-1-29-time-horizon-1-1)).",
        },
        {
          type: "p",
          text: "OpenAI stopped reporting SWE-bench Verified on 23 February 2026: in an audit of 138 problems, 59.4% had material flaws in tests or descriptions, and every frontier model tested could reproduce some reference patches, indicating contamination. It recommends SWE-bench Pro ([OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)). On Scale's standardised public SWE-bench Pro runs, Muse Spark 1.1 scored 61.5 ± 3.1, GPT-5.4 (xHigh) 59.1 ± 3.6, Claude Opus 4.6 (thinking) 51.9 and Gemini 3.1 Pro 46.1; private proprietary codebases scored lower in earlier results (GPT-5: 23.1% public against 14.9% private) ([Scale](https://labs.scale.com/leaderboard/swe_bench_pro_public)). Vendor-reported figures run far higher (80.0% listed for Claude Fable 5) and are not comparable ([llm-stats](https://llm-stats.com/benchmarks/swe-bench-pro)).",
        },
        { type: "h3", text: "Does it make developers faster?" },
        {
          type: "p",
          text: "METR's early-2025 randomised trial found experienced open-source developers took 19% longer with AI tools (interval +2% to +39%). The late-2025 follow-up (57 developers, 143 repositories, more than 800 tasks) estimated −18% task time for returning developers (−38% to +9%) and −4% for new ones (−15% to +9%), which METR reads as “some evidence for speedup” but “only very weak evidence” of its size; 30 to 50% of developers withheld tasks they did not want to do without AI ([METR](https://metr.org/blog/2026-02-24-uplift-update/)). A METR survey of 349 technical workers found self-reported gains of 1.4 to 2 times ([TechCrunch](https://techcrunch.com/2026/05/29/coders-are-refusing-to-work-without-ai-and-that-could-come-back-to-bite-them/)).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Vendor productivity claims",
          text: "Warp cites a customer cutting cost per pull request from USD 80 to USD 30, and Cognition offers an “AI Productivity Guarantee” of up to USD 10 million ([warp.dev](https://www.warp.dev/); [Cognition](https://cognition.com/blog)). Neither is an independent measurement.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: verification is the binding constraint",
          text: "The evidence supports a manager that fans out independent tasks and a reviewer with fresh context; it does not support several agents editing the same thing or negotiating with each other. The compiler, Cursor's judge and Cognition's reviewer all depend on a strong automatic check. Business departments rarely have an equivalent of a test suite, so each ticket needs explicit acceptance criteria and a human or rule-based check before a consequential action. Cost scales roughly with agent count, so per-ticket cost tracking is the only way to see whether added agents pay for themselves.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "foundations",
      kicker: "What to build on",
      title: "Which open projects and protocols can a multi-department agent hub build on?",
      answer:
        "No single project is a ready foundation, but the layers exist under permissive licences: Paperclip (MIT) is the closest reference for the organisation layer; MCP, A2A, Agent Skills, AGENTS.md and ACP are the vendor-neutral protocols; OpenHands, code-server and Theia cover the developer workspace; Temporal and Trigger.dev cover durable workflows. Several obvious choices closed or changed terms in 2026, and n8n, Dify, Outline, Sentry and Phoenix restrict offering them inside a hosted product.",
      blocks: [
        {
          type: "table",
          caption: "Orchestration projects and agent frameworks (GitHub, read 22 November 2026)",
          columns: ["Project", "What it is", "Licence", "Traction and status"],
          rows: [
            ["[Paperclip](https://github.com/paperclipai/paperclip)", "Control plane for a company of other vendors' agents", "MIT", "115.9k stars; release every one to two weeks"],
            ["[OpenClaw](https://github.com/openclaw/openclaw)", "Personal assistant on the user's devices, reachable from messaging channels", "MIT", "395.0k stars; a foundation announced 8 Jul 2026"],
            ["[Hermes Agent](https://github.com/NousResearch/hermes-agent)", "“Self-improving” agent that writes skills after complex tasks; six terminal backends", "MIT", "265.4k stars"],
            ["[OpenHands](https://github.com/OpenHands/OpenHands)", "Self-hosted control centre for coding agents with an agent server REST API", "MIT", "94.1k stars"],
            ["[opencode](https://github.com/anomalyco/opencode)", "Open coding agent with build and plan modes", "MIT", "228.6k stars"],
            ["[goose](https://github.com/aaif-goose/goose)", "Extensible agent under the Agentic AI Foundation", "Apache-2.0", "56.9k stars"],
            ["[Gas Town](https://github.com/gastownhall/gastown)", "Orchestrator for 20 to 30 coding agents with a git-backed issue store and merge queue", "MIT", "18.9k stars"],
            ["[Vibe Kanban](https://github.com/BloopAI/vibe-kanban)", "Board for planning and reviewing coding-agent work", "Apache-2.0", "28.8k stars; company sunset 10 Apr 2026, community-maintained"],
            ["[CrewAI](https://github.com/crewAIInc/crewAI)", "Role-playing agent crews", "MIT", "61.2k stars"],
            ["[LangGraph](https://github.com/langchain-ai/langgraph)", "Graph runtime with checkpoints and human interrupts", "MIT", "45.3k stars"],
            ["[AutoGen](https://github.com/microsoft/autogen)", "Microsoft's multi-agent framework", "MIT (code)", "62.0k stars; archived 20 Nov 2026, succeeded by Microsoft Agent Framework"],
            ["[Mastra](https://github.com/mastra-ai/mastra)", "TypeScript agent framework", "Apache-2.0 except ee/", "29.7k stars"],
            ["[Letta](https://github.com/letta-ai/letta)", "Stateful agents with memory they edit themselves", "Apache-2.0", "25.5k stars"],
            ["[MetaGPT](https://github.com/FoundationAgents/MetaGPT)", "“First AI software company” framework", "MIT", "71.4k stars; last push 21 Jan 2026"],
          ],
        },
        {
          type: "table",
          caption: "Workflow and durable-execution engines: the licence matters",
          columns: ["Engine", "Licence", "Stars", "Constraint"],
          rows: [
            ["[n8n](https://github.com/n8n-io/n8n)", "Sustainable Use License, separate .ee files", "211.8k", "Not an open-source licence; check before embedding or hosting for others"],
            ["[Dify](https://github.com/langgenius/dify)", "Modified Apache-2.0", "161.7k", "Multi-tenant use of the source needs a commercial licence"],
            ["[Flowise](https://github.com/FlowiseAI/Flowise)", "Apache-2.0, commercial enterprise directory", "55.6k", "Archived 13 Aug 2026, end of life 31 Aug 2026"],
            ["[Activepieces](https://github.com/activepieces/activepieces)", "MIT except ee packages", "25.7k", "Describes about 400 MCP servers for agents"],
            ["[Windmill](https://github.com/windmill-labs/windmill)", "AGPL-3.0 with Apache-2.0 parts and proprietary features", "18.7k", "Copyleft"],
            ["[Temporal](https://github.com/temporalio/temporal)", "MIT", "24.5k", "Durable execution service"],
            ["[Trigger.dev](https://github.com/triggerdotdev/trigger.dev)", "Apache-2.0", "16.8k", "“Durable AI agents and workflows” in TypeScript"],
            ["[Inngest](https://github.com/inngest/inngest)", "SSPL with delayed Apache-2.0 grant", "6.1k", "SSPL restricts offering it as a service"],
          ],
        },
        { type: "h3", text: "Protocols and shared formats" },
        {
          type: "list",
          items: [
            "Model Context Protocol, specification 2026-07-28: the core is now stateless (no initialise handshake or session id), Tasks moved to an extension, and Roots, Sampling, Logging and the old HTTP+SSE transport are deprecated with a twelve-month window. Tier 1 SDKs see “close to half-a-billion downloads a month” ([MCP blog](https://blog.modelcontextprotocol.io/posts/2026-07-28/)). The official MCP Registry is still in preview and stores metadata only ([MCP Registry](https://modelcontextprotocol.io/registry/about)).",
            "Agent2Agent (A2A): Apache-2.0, donated to the Linux Foundation in June 2025, v1.0 in March 2026, more than 150 supporting organisations by April 2026, and a hosted project of the Agentic AI Foundation since 17 August 2026 ([Linux Foundation](https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year); [AAIF](https://aaif.io/blog/a2a-joins-aaif)).",
            "Agent Skills: a folder with a SKILL.md plus optional scripts, loaded by progressive disclosure; released by Anthropic as an open standard, and Devin is converting its Playbooks into Skills ([agentskills.io](https://agentskills.io/home)).",
            "AGENTS.md: a plain-Markdown “README for agents”, stewarded by the Agentic AI Foundation and used by over 60,000 open-source projects ([agents.md](https://agents.md/)).",
            "Agent Client Protocol for editors, covered above; MCP Apps for interactive UI returned by tools, an official extension since 26 January 2026 ([MCP Apps](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)).",
          ],
        },
        {
          type: "table",
          caption: "Supporting infrastructure",
          columns: ["Layer", "Project", "Licence", "Stars"],
          rows: [
            ["Browser agents", "[browser-use](https://github.com/browser-use/browser-use)", "MIT", "121.8k"],
            ["Browser agents", "[Playwright MCP](https://github.com/microsoft/playwright-mcp)", "Apache-2.0", "40.0k"],
            ["Memory", "[Mem0](https://github.com/mem0ai/mem0)", "Apache-2.0", "69.3k"],
            ["Memory", "[Graphiti](https://github.com/getzep/graphiti)", "Apache-2.0", "33.0k"],
            ["Tracing and evals", "[Langfuse](https://github.com/langfuse/langfuse)", "MIT except ee/", "37.7k"],
            ["Tracing and evals", "[Arize Phoenix](https://github.com/Arize-ai/phoenix)", "Elastic License 2.0", "12.4k"],
            ["Model gateway and cost", "[LiteLLM](https://github.com/BerriAI/litellm)", "MIT except enterprise/", "63.7k"],
            ["Sandbox", "[E2B](https://github.com/e2b-dev/E2B)", "Apache-2.0", "15.0k"],
          ],
        },
        {
          type: "callout",
          tone: "caution",
          title: "2026 closures and licence changes",
          text: "Flowise was archived, AutoGen archived in favour of Microsoft Agent Framework, Daytona moved its core to a private codebase, Roo Code's repository was archived (last push 15 May 2026), Vibe Kanban's company sunset its hosted services, and OpenAI is withdrawing Agent Builder. Venture-funded open-source tools in this field can disappear within a year, so pin versions and keep each dependency behind an interface you control.",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: build the organisation layer, borrow the rest",
          text: "Paperclip is the best reference design and a plausible component, but a weak foundation to build a product on: it is under a year old, led by one pseudonymous author, has thousands of open issues and unresolved security advisories as reported, and changes direction between releases. A practical split is to keep the organisation layer (goals, tickets, budgets, approvals, cost ledger) in-house and adopt open pieces underneath: MCP for tools, Agent Skills for procedures, ACP for editor agents, a swappable sandbox runner, Temporal or Trigger.dev for durable steps, and Langfuse or OpenTelemetry for traces.",
        },
      ],
    },
    /* ------------------------------------------------------------------ */
    {
      id: "beyond-software",
      kicker: "Beyond software teams",
      title: "Does the agent-orchestration pattern reach beyond software departments?",
      answer:
        "It is starting to. Paperclip says it is not only for code and ships templates for content, e-commerce and sales teams; Rakuten deployed product, sales, marketing and finance agents on Claude Managed Agents; and Google, Anthropic, Zapier, Relevance AI, Lindy and Sintra sell agents for knowledge work. No controlled study of a “company of agents” on business outcomes was found, so the evidence is engineering posts and vendor statements.",
      blocks: [
        {
          type: "list",
          items: [
            "Paperclip says it is “not only for code review”: coding sits “alongside research, operations, and content work”, and community templates include a content agency, an e-commerce operator and a real-estate lead team. In June 2026 six community templates were counted, described as starting points rather than production-ready ([README](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md); [rywalker](https://rywalker.com/research/paperclip)).",
            "Rakuten deployed specialist agents for product, sales, marketing and finance on Claude Managed Agents, each within a week; Asana built “AI Teammates” that take tasks inside projects; Notion delegates work to agents in the workspace; Atlassian built Jira-assigned agents on the same platform ([Anthropic](https://claude.com/blog/claude-managed-agents)).",
            "Claude Cowork bundles skills, connectors and sub-agents into plugins for roles such as legal and finance, with scheduled tasks and admin controls for access, spend and SIEM export ([Cowork](https://claude.com/blog/cowork-research-preview)). Google positioned Antigravity “for Knowledge Work” on 9 November 2026 ([Antigravity](https://antigravity.google/blog)).",
            "Vendor figures: Zapier Agents work across more than 9,000 app integrations ([Zapier](https://zapier.com/agents)); Relevance AI sells “AI Factories” with approvals in Slack or Teams, and says one customer runs 35+ agents ([Relevance AI](https://relevanceai.com/)); Lindy offers preset roles such as Bookkeeper and Receptionist from USD 29.99 per user a month ([Lindy](https://www.lindy.ai/)); Sintra offers 12 role helpers with a shared “Brain” from USD 15.60 a month on an annual plan ([Sintra](https://sintra.ai/)).",
          ],
        },
        {
          type: "quote",
          text: "If you can write a function to handle the task, do that instead of using an AI agent.",
          cite: "Microsoft Agent Framework documentation",
          url: "https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview",
        },
        {
          type: "callout",
          tone: "view",
          title: "Our reading: departments differ in how parallel their work is",
          text: "Research, lead enrichment, reconciling many independent records and reviewing documents fit the fan-out pattern. A single order-to-cash flow, a quote that depends on the routing, or a design revision is sequential and is better served by one agent with good context and a checker. In a factory, figures should come from systems and code rather than from a model; that is how we design the workflows on our [agentic ERP and CRM page](/agentic-erp-crm), and a [systems audit](/industrial-systems-audit) is where we decide which work is worth handing to an agent at all.",
        },
      ],
    },
  ],
  method: [
    "Repository figures (stars, licence, last push, archived flag) were read from GitHub's public API or repository pages on 22 November 2026. Product facts come from each vendor's documentation, changelog or release notes, linked in place.",
    "User reports about Paperclip come from secondary blogs, two of which sell competing or adjacent products, and from Reddit threads relayed by one of them; they are labelled anecdotal. No Hacker News or Reddit thread was read directly, and Paperclip's founders, team size and funding are not publicly confirmed.",
    "Sandbox start times and prices are vendor list figures compiled by a competing vendor; no independent benchmark was found. Whether Ona Cloud shut down is confirmed only by a competitor's page.",
    "No controlled study of company-of-agents products on business outcomes, and no productivity evidence for non-software departments using agent teams, was found. Microsoft Agent Framework's licence and repository could not be read.",
  ],
  faq: [
    {
      q: "What is an AI agent orchestration platform?",
      a: "Software that assigns work to several AI agents and controls how they run: which agent gets which task, when it wakes, what tools it may use, what it may spend and who must approve its results. Some orchestrate steps in a workflow; “company of agents” platforms such as Paperclip model a whole organisation, with an org chart, goals, tickets, budgets and approvals, and drive other vendors' agents through adapters.",
    },
    {
      q: "What is Paperclip AI and is it open source?",
      a: "Paperclip is an MIT-licensed Node.js server and React interface, published by Paperclip Labs, Inc., that orchestrates teams of AI agents such as Claude Code, Codex and Gemini CLI. It is self-hosted, had about 115,900 GitHub stars on 22 November 2026, and has no official hosted service yet. Independent reviews report security advisories, token-burning coordination between agents and heavy review load.",
    },
    {
      q: "Are multi-agent systems better than a single AI agent?",
      a: "Only for work that splits into independent pieces. A study of 260 configurations found results from +80.8% on decomposable tasks to −70.0% on sequential planning. Anthropic and Cognition both report that most coding has few truly parallel parts; the patterns that work keep one agent writing and use others to research, review or handle separate pieces, at several times the token cost.",
    },
    {
      q: "Can I host VS Code Server for my team or customers?",
      a: "Not Microsoft's build. Its licence forbids hosting the software or combining it with your applications for others to use, and Microsoft's Marketplace is limited to Microsoft's products. Open alternatives are code-server (MIT) or OpenVSCode Server (MIT), or Eclipse Theia (EPL-2.0), with extensions from Open VSX.",
    },
    {
      q: "How do you stop AI agents from running up costs?",
      a: "Set budgets with hard stops per company, agent and project, wake agents on schedules or events rather than in loops, define what “done” means for each ticket, and track cost per ticket. Reports from Paperclip users and engineering blogs trace most runaway cost to agents checking in with each other and to unclear completion criteria, not to token prices.",
    },
    {
      q: "What is the Agent Client Protocol?",
      a: "ACP is an Apache-2.0 protocol for connecting any editor to any coding agent, launched by Zed in 2025 and joined by JetBrains, which calls it the counterpart of LSP. A shared registry entered beta in January 2026, and Copilot CLI and Cursor have joined. It lets one editor host many agents without a separate integration for each.",
    },
    {
      q: "Is SWE-bench Verified still a reliable AI coding benchmark?",
      a: "OpenAI stopped reporting it on 23 February 2026 after an audit found material flaws in 59.4% of 138 problems and signs that models had seen the reference patches. It recommends SWE-bench Pro, where standardised public runs in late 2026 put the leading models around 50 to 62%, with lower scores on private codebases.",
    },
    {
      q: "Can AI agents run a whole company without people?",
      a: "No product we examined shows that. Paperclip dropped its “zero-human company” tagline, its maker says people still set direction, approve plans and rewrite instructions, and the independent accounts describe review load and drift rather than autonomous success. The agent products with the best-reported outcomes keep a person approving consequential actions.",
    },
  ],
  platformLinks: ["agentic", "factoryGraph", "audit"],
  relatedReports: [
    "future-of-erp-crm-agentic-ai",
    "embed-stream-integrate-specialist-software",
    "back-office-software-open-source-alternatives",
  ],
  blogSlugs: ["paperclip-ai-review-company-of-agents", "multi-agent-systems-evidence"],
};
