/**
 * Research-desk posts written from the report "AI Agent Orchestration
 * Platforms in 2026" (src/lib/research/reports/agent-orchestration.ts).
 */
import type { BlogPost } from "../../src/lib/blogs.ts";
import { RESEARCH_AUTHOR, RESEARCH_PUBLISHED } from "./author.ts";

export const AGENT_ORCHESTRATION_POSTS: BlogPost[] = [
  // ------------------------------------------------------------------------
  {
    slug: "paperclip-ai-review-company-of-agents",
    title: "Paperclip AI Review: What a ‘Company of Agents’ Gets Right and Wrong",
    subtitle:
      "Paperclip gives AI agents an org chart, a budget and a board of directors. Here is what it actually does, what its users report, and how to trial it without losing a week to drift.",
    excerpt:
      "Paperclip runs a team of AI agents like a company: org chart, tickets, budgets, approvals. A sourced review of what works, what users report and the risks.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "layerStack",
    tags: ["ai-agents", "orchestration", "open-source", "governance"],
    keywords: {
      primary: "paperclip ai review",
      secondary: ["paperclip ai agents", "company of agents", "ai agent orchestration", "zero-human company"],
      searchVolume: 0,
      difficulty: "low",
      intent: "commercial",
    },
    featured: false,
    popularityScore: 74,
    relatedSlugs: ["multi-agent-systems-evidence", "prompt-injection-crm-ai-agents", "mcp-for-erp-crm-agents"],
    crossPageLinks: [
      { href: "/research/ai-agent-orchestration-platforms", label: "The full research report", note: "orchestration platforms, oversight patterns and the multi-agent evidence" },
      { href: "/agentic-erp-crm", label: "Agentic ERP & CRM", note: "agents with approved tools, human approval and an audit trail" },
      { href: "/industrial-systems-audit", label: "Book a systems audit", note: "decide which work is worth handing to an agent" },
    ],
    takeaways: [
      "Paperclip is a control plane, not an agent: it assigns work to Claude Code, Codex, Gemini CLI and others, and controls when they wake, what they spend and who approves.",
      "It grew to about 115,900 GitHub stars in under nine months, but one June 2026 analysis warned that star counts overstate verified production use.",
      "Independent accounts describe oversight failures: work arriving faster than a person can review it, agents passing tickets back and forth, and budgets that stop spend without judging quality.",
      "Reviews report security advisories, no official hosted service yet, and a host machine that must never sleep.",
      "If you trial it, start with one agent, one routine and an explicit definition of done, exactly as its own maker advises.",
    ],
    sections: [
      {
        heading: "What Paperclip actually is",
        paragraphs: [
          "Paperclip describes itself as “the open-source app everyone uses to manage agents at work”. Its README is more precise: “a Node.js server and React UI that orchestrates a team of AI agents to run a business”. The one-line pitch is the clearest: “If OpenClaw is an employee, Paperclip is the company” ([Paperclip on GitHub](https://github.com/paperclipai/paperclip)). It is MIT-licensed, published by Paperclip Labs, Inc., and self-hosted.",
          "That makes it a different kind of product from the two things it is usually compared with. A workflow builder controls a fixed sequence of steps. A coding agent such as Claude Code or Codex controls one working session. Paperclip controls an organisation: which agent reports to which, which goal a ticket serves, what each worker may spend, and who must approve a hire or a plan. It does not build agents; it hires existing ones through adapters.",
          "Its traction is real. The repository was created on 2 March 2026 and had 115,887 stars and 19,237 forks on 22 November 2026, with a release every one to two weeks ([releases](https://github.com/paperclipai/paperclip/releases)). It is also young and thinly staffed: the lead developer is pseudonymous (@dotta, who presented it at AI Engineer Europe 2026), and the About page names a company and “a small team” but no founders, investors or funding ([paperclip.ing](https://paperclip.ing/about/)).",
        ],
      },
      {
        heading: "How it works: tickets, heartbeats, budgets and adapters",
        paragraphs: [
          "The working unit is the issue. Each has one assignee and an atomic checkout with execution locks, so two runs cannot claim the same task. Agents wake on a heartbeat (assigned work, a follow-up message or a schedule) rather than running in a loop, and a database-backed queue coalesces wake-ups. Budgets sit at company, agent and project level with warnings and hard stops, though the README is honest that “usage reporting lag and in-flight work can delay a stop” ([README](https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md)).",
        ],
        bullets: [
          "Thirteen built-in adapters, including Claude Code, Codex, Gemini CLI, Cursor, OpenCode, Hermes, Grok, Kimi Code and OpenClaw Gateway, plus generic process and HTTP adapters ([adapters reference](https://docs.paperclip.ing/reference/adapters/overview/)).",
          "An MCP Tool Gateway where each action is set to Allowed, Ask first or Off, and a person can approve one call or save a revocable rule.",
          "Review separated from completion: an assignee produces the work, a QA reviewer checks it, an approver judges fit.",
          "Routines triggered by cron, webhook or API, each creating a tracked issue; isolated execution workspaces per subtask since the 18 November 2026 release.",
          "Company templates you can export and import, with secret values omitted.",
        ],
        callout: {
          title: "A cost detail worth knowing",
          body: "The adapters reference notes that Cursor and native Grok “do not supply authoritative per-run cost totals”. If those are your agents, the budget is working from incomplete numbers.",
        },
      },
      {
        heading: "What users report, good and bad",
        paragraphs: [
          "The most detailed negative account comes from a one-person business that ran CEO, CTO and CFO agents on a Claude subscription, with real EC2 and GitHub access, for “a few months”. Every morning brought branches, drafts and tickets for work that was not the priority; a week of drift had to be unwound; and the verdict was blunt: “auditing Paperclip's work took more time than doing the work directly”. The owner replaced it with single-purpose bots behind a human approval gate ([Alien Brain Trust, anecdotal](https://abt-blog.pages.dev/ai-learning/2026-04-05-why-we-killed-paperclip)).",
          "A review by a company that sells an adjacent product reached a similar conclusion from a different angle: “governance catches structural problems, not wrong work”. Its test output included broken layouts, generic copy and unsourced statistics presented as fact, and it summed up that “the orchestration works, but the autonomous business promise does not hold up yet” ([fast.io](https://fast.io/resources/paperclip-ai-review-2026/)). Another review, drawing on Reddit threads it calls self-selected and unverified, reports executive agents that “kept checking in and passing tickets back and forth”, a CEO agent that tried to hire despite an instruction not to, and 12 GitHub security advisories, five rated critical, as of early October 2026 ([preuve.ai](https://preuve.ai/blog/paperclip-ai-review)).",
          "There are positive small-scale accounts too. One developer runs seven agents on heartbeats from every 30 minutes to twice a day on an existing subscription, with the lessons “set budget caps before launch” and “start with one agent” ([dev.to, anecdotal](https://dev.to/manja316/running-a-zero-human-company-with-paperclip-and-claude-code-1nk8)). Nobody, including the positive accounts, reports a business run by agents alone.",
        ],
        pullQuote: "Governance catches structural problems, not wrong work.",
      },
      {
        heading: "The structural risks before you build on it",
        paragraphs: [
          "A June 2026 research note listed the risks plainly: a three-month-old project, one main author, 4,953 open issues against 105 contributors, and no paid tier or support entity ([rywalker](https://rywalker.com/research/paperclip)). The tagline also moved from “open-source orchestration for zero-human companies” to “the app people use to manage AI agents for work”, with no change in architecture. That is a sensible correction, but it tells you the product is still finding its shape.",
        ],
        bullets: [
          "No official hosted service: the hosted plan is a waitlist, and a third-party host shut down on 2 October 2026.",
          "It stops when the host machine sleeps, so it needs an always-on server.",
          "Telemetry is on by default; switch it off with the documented environment variable if that matters to you.",
          "Cost estimates conflict: Paperclip's own pages, as quoted in one review, suggest USD 20 to 100 a month for an active company, while a promotional review puts three to five agents at USD 600 to 1,000 a month in API fees.",
          "Features come and go: a Pipelines experiment was added and removed within the year.",
        ],
      },
      {
        heading: "If you trial it: a one-agent checklist",
        paragraphs: [
          "Paperclip's own maker gives the right advice: hire agents one at a time, prove their quality before expanding, do not start from a 130-agent template, and match the model's strength to the role ([AI Engineer talk](https://ai.engineer/talks/h403btjldDQ-paperclip-open-source-human-control-plane-ai)). He runs Codex and Claude coders with routines for pull requests, daily summaries and changelogs, at a default concurrency of one run.",
          "An illustrative trial, not a customer case: give one agent one routine, such as drafting the weekly changelog from merged pull requests every Friday. Define done in writing (“a draft in the release folder, every item linked to a pull request, nothing published”), set an approval on anything that leaves the repository, and cap its budget at a figure you would not mind losing. After four weeks, compare the minutes you spent reviewing its drafts with the minutes the drafts used to take. If review costs more, stop there.",
        ],
        bullets: [
          "Run it on an always-on machine or server, not a laptop.",
          "Turn on approvals (“Ask first”) for every tool that sends email, opens pull requests or touches money.",
          "Check the Codex adapter's bypass setting, which one review says defaults to true.",
          "Track minutes of human review per ticket, not just spend.",
          "Add a second agent only after the first one's output needs little correction.",
        ],
      },
      {
        heading: "Lessons that apply to any team of agents",
        paragraphs: [
          "None of the reported failures is “the model could not do the task”. They are work arriving faster than a person can judge it, nobody defining what done looks like, and budgets that stop spending without judging value. An engineering blog makes the same point about agents generally: unbounded loops, not token prices, drive runaway cost, and agents past a certain depth “re-litigate settled decisions” ([Unblocked](https://getunblocked.com/blog/agent-auto-loop-token-cost)).",
          "So the controls that matter are the ones Paperclip is converging on in its newest releases: a single owner per ticket, explicit acceptance criteria, a reviewer before a person sees the result, approval on consequential actions and a cost ledger per ticket. Several of them (limited tools, approval before anything consequential, and an audit trail) are the controls described on our [agentic ERP and CRM page](/agentic-erp-crm). The wider evidence on when several agents beat one is in our companion post on [multi-agent systems](/blogs/multi-agent-systems-evidence) and in the full [orchestration research report](/research/ai-agent-orchestration-platforms).",
        ],
      },
    ],
    faq: [
      {
        question: "What is Paperclip AI?",
        answer:
          "An MIT-licensed, self-hosted Node.js server and React interface that orchestrates teams of AI agents such as Claude Code, Codex and Gemini CLI. It models an organisation with an org chart, goals, tickets, budgets, approvals and scheduled wake-ups, and drives each agent through an adapter.",
      },
      {
        question: "Is Paperclip free to use?",
        answer:
          "The software is open source under the MIT licence and free to self-host. You still pay for the agents' model usage, through API fees or subscriptions, and estimates of that cost conflict widely between Paperclip's own pages and independent reviews.",
      },
      {
        question: "Can Paperclip run a company with no people?",
        answer:
          "No account we found shows that. The project dropped its “zero-human companies” tagline, its maker says people still set direction, approve plans and rewrite instructions, and independent reviews describe review load and drift rather than autonomous success.",
      },
      {
        question: "Is Paperclip secure enough for production?",
        answer:
          "Treat it with care. One review counted 12 GitHub security advisories, five rated critical, as of early October 2026, and reported that the Codex adapter defaulted its bypass setting to true. Run it isolated, require approval for actions with outside effects, and check the current advisories yourself.",
      },
      {
        question: "How is Paperclip different from n8n or a coding agent?",
        answer:
          "A workflow tool such as n8n runs a fixed sequence of steps, and a coding agent runs one working session. Paperclip sits above agents and controls the organisation around them: who is assigned what, what it may cost, who reviews it and when each agent wakes.",
      },
    ],
  },

  // ------------------------------------------------------------------------
  {
    slug: "multi-agent-systems-evidence",
    title: "Do Multi-Agent AI Systems Work? What the Evidence Says in 2026",
    subtitle:
      "Several agents can beat one by 80%, or lose by 70%. The difference is not the model; it is whether the work splits into independent pieces and whether something checks the result.",
    excerpt:
      "Controlled studies and the teams that built multi-agent systems agree: they help on parallel work, hurt on sequential work, cost far more tokens, and need a checker.",
    category: "automation",
    readTime: 8,
    publishedAt: RESEARCH_PUBLISHED,
    author: RESEARCH_AUTHOR,
    heroSketch: "auditLens",
    tags: ["ai-agents", "multi-agent", "evidence", "operations"],
    keywords: {
      primary: "multi-agent systems",
      secondary: ["multi agent ai", "single agent vs multi agent", "why multi-agent llm systems fail", "ai agent orchestration patterns"],
      searchVolume: 0,
      difficulty: "medium",
      intent: "informational",
    },
    featured: false,
    popularityScore: 70,
    relatedSlugs: ["paperclip-ai-review-company-of-agents", "mcp-for-erp-crm-agents", "context-graphs-decision-traces"],
    crossPageLinks: [
      { href: "/research/ai-agent-orchestration-platforms", label: "The full research report", note: "benchmarks, oversight patterns and the open projects to build on" },
      { href: "/agentic-erp-crm", label: "Agentic ERP & CRM", note: "specialised agents with approved tools and human approval" },
      { href: "/industrial-systems-audit", label: "Book a systems audit", note: "find which of your workflows split cleanly" },
    ],
    takeaways: [
      "Across 260 configurations, multi-agent setups ranged from +80.8% on decomposable work to −70.0% on sequential planning, compared with a single agent.",
      "What works in production is one writer, with other agents researching, reviewing or handling separate pieces under a manager.",
      "Multi-agent systems use about 15 times the tokens of chat, against about 4 times for a single agent, so cost scales with the number of agents.",
      "Every documented success depends on a strong automatic check; most business departments do not have one yet.",
      "Before adding agents, ask whether the work splits into independent pieces and how a wrong result would be caught.",
    ],
    sections: [
      {
        heading: "The short answer: it depends on how parallel the work is",
        paragraphs: [
          "The clearest controlled evidence comes from a study of 260 configurations: five agent architectures, six benchmarks and three model families. Compared with a single agent, multi-agent performance ranged from +80.8% on decomposable financial reasoning to −70.0% on sequential planning. Architectures without centralised verification propagated errors more, and a predictive model picked the best architecture for 87% of held-out configurations ([Kim et al., arXiv 2512.08296](https://arxiv.org/abs/2512.08296)).",
          "That spread is the whole story in miniature. When a task breaks into independent pieces, several agents working in parallel and reporting to a coordinator can cover more ground than one. When each step depends on the last, extra agents add hand-offs, conflicting assumptions and errors that compound.",
        ],
        pullQuote: "Most coding tasks have fewer truly parallelizable parts than research.",
      },
      {
        heading: "What the teams that built them learned",
        paragraphs: [
          "Anthropic's research system, a lead agent with parallel subagents, beat a single agent by 90.2% on an internal research evaluation, and token usage alone explained 80% of performance variance on one benchmark. The same post warns that the design suits breadth-first research and fits poorly where agents must share context, and that “most coding tasks have fewer truly parallelizable parts than research” ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).",
          "Cognition argued in June 2025 for single-threaded agents, because “actions carry implicit decisions, and conflicting decisions carry bad results” ([Cognition](https://cognition.com/blog/dont-build-multi-agents)). In April 2026 it narrowed that view after a year of practice: what works is where “writes stay single-threaded and the additional agents contribute intelligence rather than actions”. That means a reviewer with a clean context, a stronger model consulted on hard steps, and a manager splitting work across child agents. Parallel writers “still don't see meaningful adoption” ([Cognition](https://cognition.com/blog/multi-agents-working)).",
          "Cursor found the same at scale. Flat coordination with locks failed (“Twenty agents would slow down to the effective throughput of two or three”), while planners, workers and a judge worked well enough for hundreds of concurrent agents to write over a million lines for a browser in about a week ([Cursor](https://cursor.com/blog/scaling-agents)). Anthropic's 16 parallel agents built a 100,000-line C compiler over nearly 2,000 sessions for just under USD 20,000; it builds Linux 6.9 on three architectures, but its output is slower than GCC with optimisations off and the author stresses the verifier must be “nearly perfect” ([Anthropic](https://www.anthropic.com/engineering/building-c-compiler)).",
        ],
      },
      {
        heading: "Why multi-agent systems fail",
        paragraphs: [
          "A taxonomy built from more than 1,600 annotated traces across seven frameworks found 14 failure modes in three groups: system design problems, misalignment between agents, and weak task verification. The authors also note that gains on popular benchmarks are “often minimal” ([Cemri et al., arXiv 2503.13657](https://arxiv.org/abs/2503.13657)).",
          "The builders' own write-ups name the same faults in their own systems. Cognition found its manager agents were over-prescriptive and assumed they shared state with the child agents they directed ([Cognition](https://cognition.com/blog/multi-agents-working)). Cursor found that optimistic concurrency made agents risk-averse, that an integrator role added more bottlenecks than it removed, and that long runs needed periodic fresh starts. Gas Town, an open orchestrator, claims it can “scale comfortably to 20-30 agents” but ships a scheduler specifically to prevent “API rate limit exhaustion” ([Gas Town](https://github.com/gastownhall/gastown)), which tells you where the ceiling is felt first.",
          "In plain terms, three things go wrong. Agents work from different pictures of the task because they did not share full context. Two agents make decisions that quietly contradict each other. And nobody checks the combined result against what was actually asked. Claude Code's own documentation lists the practical version: agent teams are experimental, use “significantly more tokens than a single session”, and for “sequential tasks, same-file edits, or work with many dependencies” a single session is more effective ([Claude Code docs](https://code.claude.com/docs/en/agent-teams.md)).",
        ],
        bullets: [
          "Missing context: agents act on summaries instead of full traces.",
          "Conflicting actions: two writers make incompatible choices.",
          "No verification: the merged result is never checked against the request.",
          "Coordination loops: agents hand work back and forth and re-open settled decisions.",
        ],
      },
      {
        heading: "The cost: tokens rise with every agent",
        paragraphs: [
          "Anthropic measured agents using about 4 times the tokens of a chat, and multi-agent systems about 15 times. Claude Code's documentation says team cost scales roughly linearly with the number of teammates and suggests starting with three to five. The compiler project consumed 2 billion input and 140 million output tokens.",
          "So every added agent has to earn its tokens. The only way to see whether it does is to track cost per ticket, not per month, and compare it with what the work used to cost a person. Vendor productivity claims do not settle the question: Warp cites a customer cutting cost per pull request from USD 80 to USD 30, a vendor claim ([warp.dev](https://www.warp.dev/)), while METR's randomised trial found experienced developers took 19% longer with AI tools in early 2025 and its late-2025 follow-up found only “very weak evidence” of a speed-up ([METR](https://metr.org/blog/2026-02-24-uplift-update/)).",
        ],
        callout: {
          title: "Benchmarks are moving too",
          body: "OpenAI stopped reporting SWE-bench Verified on 23 February 2026 after an audit found material flaws in 59.4% of 138 problems and signs of contamination. Read any single benchmark number with care.",
        },
      },
      {
        heading: "Verification is the real bottleneck",
        paragraphs: [
          "Look at the successes again: the compiler had a test suite, Cursor had a judge, Cognition has a reviewer agent. Each depends on something that can tell a correct result from an incorrect one without a person reading every line. Long-task capability keeps rising (METR's newest measured model has a 50% time horizon of about 1,045 minutes, though METR calls figures above 16 hours unreliable), but METR also warns that its tasks are self-contained and automatically scored while “real work is messier” ([METR](https://metr.org/time-horizons/)).",
          "Software has tests. A sales quote, a purchase order or a month-end reconciliation usually does not, which is why moving multi-agent patterns from engineering into business departments is harder than the demos suggest.",
        ],
      },
      {
        heading: "What this means for finance, sales and operations",
        paragraphs: [
          "Departments differ in how parallel their work is. Lead research across hundreds of accounts, matching many independent records, and reviewing a pile of supplier documents split cleanly, so a coordinator with several workers fits. A single order-to-cash flow, a quote whose price depends on the routing, or a drawing revision is sequential, so one agent with good context and a checker fits better.",
          "An illustrative example, not a customer case: a manufacturer wants agents to chase overdue invoices. Pulling each overdue invoice, its customer history and the last correspondence is parallel and suits several workers. Deciding whether to stop supply to a customer is a single decision with consequences, so it belongs to one agent drafting a recommendation and a named person approving it. The figures in that draft should come from the ledger, calculated by code, not from the model. That is how we design workflows on our [agentic ERP and CRM page](/agentic-erp-crm).",
        ],
        bullets: [
          "Does the work split into pieces that do not depend on each other? If not, use one agent.",
          "What will catch a wrong result: a rule, a reconciliation or a named reviewer?",
          "Who approves anything that changes a record or reaches a customer?",
          "What is the acceptance criterion for each ticket, written down before the agent starts?",
          "What does a ticket cost in tokens and review minutes, and is that less than before?",
        ],
      },
    ],
    faq: [
      {
        question: "Are multi-agent systems better than a single AI agent?",
        answer:
          "Only for work that splits into independent pieces. One study of 260 configurations found results ranging from +80.8% on decomposable tasks to −70.0% on sequential planning. For sequential work, one agent with full context and a checker usually does better.",
      },
      {
        question: "Why do multi-agent LLM systems fail?",
        answer:
          "A study of more than 1,600 traces grouped 14 failure modes into system design problems, misalignment between agents, and weak task verification. In practice agents lack shared context, make conflicting decisions, and nobody checks the combined result.",
      },
      {
        question: "How much more do multi-agent systems cost?",
        answer:
          "Anthropic measured multi-agent systems using about 15 times the tokens of a chat, against about 4 times for a single agent, and Claude Code's documentation says team cost scales roughly with the number of agents. Track cost per completed ticket to see whether extra agents pay for themselves.",
      },
      {
        question: "What multi-agent pattern works in production?",
        answer:
          "Keep one agent writing and use others to contribute intelligence rather than actions: a reviewer with a clean context, a stronger model consulted on hard steps, or a manager splitting independent work among child agents, as Cognition and Cursor describe.",
      },
      {
        question: "Can multi-agent AI run business departments such as finance or sales?",
        answer:
          "Parts of them. Research, enrichment and matching many independent records suit parallel agents. Decisions with consequences, such as approving credit or a price, suit one agent preparing a draft and a person approving it, with figures calculated from the system of record.",
      },
    ],
  },
];
