/**
 * Offline tests for the Factory Graph pages' data and logic: the page
 * registry, canonical and hreflang rules, the explorer's graph, the mission
 * calculator, the simulated digital twin, the agent workflows and the
 * capability status list.
 *
 *   node --test scripts/platform.test.mjs
 *
 * Loads the real modules from src/ through Node's TypeScript type stripping
 * (Node >= 22.18). Nothing here renders React or touches the network.
 *
 * Several tests are about truthfulness rather than mechanics: they fail if a
 * capability is marked available without a basis, if an interactive example
 * loses its "simulated" label, or if copy starts promising percentages.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { register } from "node:module";

const SRC = new URL("../src/", import.meta.url).href;
register(
  "data:text/javascript," +
    encodeURIComponent(`
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const SRC = ${JSON.stringify(SRC)};
function withExtension(href) {
  if (/\\.(ts|tsx|mjs|js|json)$/.test(href)) return href;
  for (const ext of [".ts", ".tsx", "/index.ts"]) {
    if (existsSync(fileURLToPath(href + ext))) return href + ext;
  }
  return href;
}
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) return next(withExtension(new URL(specifier.slice(2), SRC).href), context);
  if (specifier.startsWith(".") && context.parentURL?.startsWith(SRC)) {
    return next(withExtension(new URL(specifier, context.parentURL).href), context);
  }
  try {
    return await next(specifier, context);
  } catch (err) {
    if (err?.code === "ERR_MODULE_NOT_FOUND" && /^[@\\w]/.test(specifier) && !/\\.\\w+$/.test(specifier)) {
      return next(specifier + ".js", context);
    }
    throw err;
  }
}
export async function load(url, context, next) {
  if (url.startsWith(SRC) && url.endsWith(".json")) {
    return { format: "module", source: "export default " + (await readFile(new URL(url), "utf8")) + ";", shortCircuit: true };
  }
  return next(url, context);
}
`),
);

const pages = await import("../src/lib/platform/pages.ts");
const seo = await import("../src/lib/platform/seo.ts");
const graph = await import("../src/lib/platform/graph.ts");
const mission = await import("../src/lib/platform/mission.ts");
const twin = await import("../src/lib/platform/twin-sim.ts");
const workflows = await import("../src/lib/platform/agent-workflows.ts");
const capabilities = await import("../src/lib/platform/capabilities.ts");
const constants = await import("../src/lib/constants.ts");
const { HREFLANG_COUNTRIES } = constants;
const { SITE_ORIGIN } = await import("../src/lib/public-url.ts");
const { LEAD_SERVICES } = await import("../src/lib/leads/schema.ts");

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

/* -------------------------------------------------------------------------- */
/*                              Registry and SEO                              */
/* -------------------------------------------------------------------------- */

test("page registry: six pages, unique paths, complete metadata, and a route file for each", async () => {
  const { PLATFORM_PAGES } = pages;
  assert.equal(PLATFORM_PAGES.length, 6);
  assert.equal(new Set(PLATFORM_PAGES.map((p) => p.path)).size, 6);
  assert.equal(new Set(PLATFORM_PAGES.map((p) => p.key)).size, 6);
  assert.equal(PLATFORM_PAGES[0].path, "factory-graph", "the flagship leads the navigation");

  const routes = await readdir(new URL("../src/app/[country]/[locale]/", import.meta.url));
  for (const page of PLATFORM_PAGES) {
    assert.match(page.path, /^[a-z0-9-]+$/, page.path);
    assert.ok(routes.includes(page.path), `no route directory for ${page.path}`);
    assert.ok(page.title.length >= 20 && page.title.length <= 62, `${page.key} title length ${page.title.length}`);
    assert.ok(page.description.length >= 110 && page.description.length <= 160, `${page.key} description length ${page.description.length}`);
    assert.ok(page.keywords.length >= 4, page.key);
    assert.match(page.lastmod, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(page.nav && page.navDetail);
  }
  assert.equal(pages.platformHref("iot"), "/industrial-iot-digital-twins");
  assert.throws(() => pages.getPlatformPage("nope"));
});

test("canonical and hreflang: the page lives on the canonical edition, and every other URL points at it", () => {
  // Expectations are derived from the site's own constants (lib/constants.ts),
  // so this holds under the current rule (one canonical edition) and still
  // holds if a market or a language is added back.
  const { buildPlatformAlternates } = seo;
  const { INDEXABLE_COUNTRIES, PRIMARY_COUNTRY, PRIMARY_LOCALE } = constants;
  const path = "factory-graph";
  const primary = `/${PRIMARY_COUNTRY}/${PRIMARY_LOCALE}/${path}`;
  assert.ok(pages.PLATFORM_LOCALES.includes(PRIMARY_LOCALE), "the pages are written in the language everything points at");

  const home = buildPlatformAlternates({ country: PRIMARY_COUNTRY, locale: PRIMARY_LOCALE, subPath: path });
  assert.equal(home.canonical, primary, "the primary edition is its own canonical");
  assert.equal(home.languages["x-default"], SITE_ORIGIN + primary);
  assert.deepEqual(
    Object.keys(home.languages).sort(),
    [...HREFLANG_COUNTRIES.flatMap((c) => pages.PLATFORM_LOCALES.map((l) => `${l}-${c.toUpperCase()}`)), "x-default"].sort(),
    "the cluster holds only editions, in the languages the page is written in",
  );
  // Reciprocity: every URL in the cluster is itself a self-canonical member declaring the same cluster.
  for (const [key, url] of Object.entries(home.languages)) {
    if (key === "x-default") continue;
    const [, country, locale] = new URL(url).pathname.split("/");
    const member = buildPlatformAlternates({ country, locale, subPath: path });
    assert.equal(SITE_ORIGIN + member.canonical, url, `${key} is self-canonical`);
    assert.deepEqual(member.languages, home.languages, `${key} declares the identical cluster`);
  }

  // A locale the page is not written in: the English copy is canonical, and it joins no cluster.
  for (const locale of ["hi", "gu", "ar", "de", "fr", "es", "zh"]) {
    assert.equal(pages.PLATFORM_LOCALES.includes(locale), false, `${locale}: update this test when the page is translated`);
    const alt = buildPlatformAlternates({ country: PRIMARY_COUNTRY, locale, subPath: path });
    assert.deepEqual(alt, { canonical: primary }, `${locale}: canonical is the English page, no cluster`);
    assert.ok(pages.PLATFORM_LOCALE_NOTICE[locale], `${locale}: has an "English only" notice`);
  }
  assert.equal(pages.PLATFORM_LOCALE_NOTICE.en, undefined);

  // Another country: self-canonical only if it is a canonical edition; otherwise it points at the primary.
  for (const country of ["us", "ae", "gb", "cv"]) {
    const self = `/${country}/en/${path}`;
    const alt = buildPlatformAlternates({ country, locale: "en", subPath: path });
    const edition = INDEXABLE_COUNTRIES.includes(country);
    assert.equal(alt.canonical, edition ? self : primary, country);
    if (!edition) assert.equal(alt.languages, undefined, `${country}: a page that points elsewhere declares no cluster`);
    // Both at once.
    assert.deepEqual(buildPlatformAlternates({ country, locale: "hi", subPath: path }), {
      canonical: edition ? self : primary,
    });
  }

  // An unknown code is not a page at all: self-canonical, no cluster (the route 404s and is noindex).
  assert.deepEqual(buildPlatformAlternates({ country: "zz", locale: "en", subPath: path }), { canonical: `/zz/en/${path}` });
});

test("metadata and structured data", () => {
  const meta = seo.buildPlatformMetadata({ page: "iot", country: "in", locale: "en" });
  assert.equal(meta.title, pages.getPlatformPage("iot").title);
  assert.equal(meta.alternates.canonical, `/${constants.PRIMARY_COUNTRY}/en/industrial-iot-digital-twins`);
  assert.equal(meta.robots.index, true);
  assert.equal(meta.openGraph.url, `${SITE_ORIGIN}/in/en/industrial-iot-digital-twins`);
  assert.equal(meta.openGraph.locale, "en_IN");
  // The title is the same in every market: no place-name swapping.
  assert.equal(seo.buildPlatformMetadata({ page: "iot", country: "us", locale: "en" }).title, meta.title);
  assert.equal(seo.buildPlatformMetadata({ page: "iot", country: "zz", locale: "en" }).robots.index, false);

  const crumbs = seo.buildPlatformBreadcrumbJsonLd("cadCam", "in").itemListElement;
  assert.deepEqual(crumbs.map((c) => c.name), ["Home", "Factory Graph", "CAD/CAM & CNC Integration"]);
  assert.deepEqual(crumbs.map((c) => c.position), [1, 2, 3]);
  assert.equal(seo.buildPlatformBreadcrumbJsonLd("factoryGraph", "in").itemListElement.length, 2);

  const service = seo.buildPlatformServiceJsonLd("factoryGraph", "in", "x");
  assert.equal(service["@type"], "Service");
  for (const key of ["aggregateRating", "review", "offers"]) {
    assert.equal(key in service, false, `no ${key}: the site has none it can substantiate`);
  }
  assert.equal(seo.jsonLd({ a: "</script><script>alert(1)" }).includes("</script>"), false);
});

/* -------------------------------------------------------------------------- */
/*                                    Graph                                   */
/* -------------------------------------------------------------------------- */

test("graph: the seventeen systems of the brief, inside the canvas, without collisions", () => {
  const { GRAPH_NODES, GRAPH_CANVAS, DOMAIN_ORDER } = graph;
  const expected = [
    "CRM", "ERP", "AI agents", "Sales", "Finance", "CAD", "CAM", "CNC", "Digital twin", "Industrial IoT",
    "MES", "Quality", "Inventory", "Suppliers", "Marketing", "Procurement", "Delivery",
  ];
  assert.deepEqual(GRAPH_NODES.map((n) => n.label).sort(), [...expected].sort());
  assert.equal(new Set(GRAPH_NODES.map((n) => n.id)).size, 17);

  for (const node of GRAPH_NODES) {
    assert.ok(node.x > 40 && node.x < GRAPH_CANVAS.width - 40, `${node.id} x`);
    assert.ok(node.y > 30 && node.y < GRAPH_CANVAS.height - 30, `${node.id} y`);
    assert.ok(DOMAIN_ORDER.includes(node.domain), node.id);
    assert.ok(node.purpose.length > 20 && node.connects.length > 20 && node.targets.length > 5, node.id);
    assert.ok(node.records.length >= 3 && node.events.length >= 2, node.id);
    assert.doesNotThrow(() => pages.getPlatformPage(node.link), `${node.id} links to a real page`);
    // Far enough from the hub that the hub's box cannot cover it.
    assert.ok(Math.hypot(node.x - GRAPH_CANVAS.hub.x, node.y - GRAPH_CANVAS.hub.y) > 190, `${node.id} too close to the hub`);
  }
  // A node button is about 110 x 40 on the canvas; no two may overlap.
  for (const a of GRAPH_NODES) {
    for (const b of GRAPH_NODES) {
      if (a.id >= b.id) continue;
      assert.ok(Math.abs(a.x - b.x) >= 150 || Math.abs(a.y - b.y) >= 70, `${a.id} and ${b.id} overlap`);
    }
  }
});

test("graph: three stories, every step complete and every reference real", () => {
  const { STORIES, GRAPH_NODES, storyParticipants } = graph;
  const ids = new Set(GRAPH_NODES.map((n) => n.id));
  assert.deepEqual(STORIES.map((s) => s.id), ["understand", "objective", "exception"]);
  assert.deepEqual(STORIES.map((s) => s.title), [
    "Understand my factory",
    "Execute a business objective",
    "Detect an operational exception",
  ]);

  for (const story of STORIES) {
    assert.ok(story.steps.length >= 6, story.id);
    assert.equal(new Set(story.steps.map((s) => s.title)).size, story.steps.length, `${story.id}: step titles are unique (they are React keys)`);
    for (const step of story.steps) {
      for (const field of ["title", "body", "record", "event", "decision", "control"]) {
        assert.ok(step[field]?.trim().length > 3, `${story.id} / ${step.title} / ${field}`);
      }
      assert.ok(step.nodes.length > 0, step.title);
      for (const id of [...step.nodes, ...(step.from ? [step.from] : []), ...(step.to ?? [])]) {
        assert.ok(ids.has(id), `${story.id} / ${step.title}: unknown node ${id}`);
      }
    }
  }
  assert.equal(storyParticipants(STORIES[0]).length, 17, "the first story introduces every system");
  // The stories the brief asks for touch the systems it names.
  for (const id of ["crm", "cad", "erp", "mes", "agents"]) assert.ok(storyParticipants(STORIES[1]).includes(id), `objective: ${id}`);
  for (const id of ["cnc", "iot", "twin", "mes", "agents"]) assert.ok(storyParticipants(STORIES[2]).includes(id), `exception: ${id}`);
});

test("graph and pages never say the platform commands equipment", async () => {
  const text = JSON.stringify([graph.GRAPH_NODES, graph.STORIES]);
  assert.match(text, /does not send commands to a controller/);
  assert.match(text, /never stops, starts or adjusts a machine/);
  const cnc = graph.getNode("cnc");
  assert.match(cnc.connects, /Reads/);
  const cam = graph.getNode("cam");
  assert.match(cam.connects, /does not generate, edit or post toolpaths/);

  for (const file of ["FactoryGraphPage", "IotPage", "CadCamPage", "AgenticPage"]) {
    const source = await read(`../src/components/platform/pages/${file}.tsx`);
    // Affirmative control claims, as opposed to the "does not …" lists.
    assert.doesNotMatch(source, /\b(?:we|it|platform|Factory Graph) (?:can |will )?(?:remotely )?(?:control|operate|command)s? (?:your |the )?(?:machine|CNC|PLC|equipment)/i, file);
  }
});

/* -------------------------------------------------------------------------- */
/*                                   Mission                                  */
/* -------------------------------------------------------------------------- */

test("mission: the default question is answered from the example data, by arithmetic", () => {
  const { evaluateMission, MISSION_DEFAULT } = mission;
  const r = evaluateMission(MISSION_DEFAULT);
  // 1,000 parts x 4.5 min = 75 h, + 3 h setup.
  assert.equal(r.capacity.requiredHours, 78);
  // 2 machines x 5 days x (2 shifts x 7 h x 0.82 x 0.65) = 74.62 h.
  assert.equal(r.capacity.regularHours, 74.6);
  assert.equal(r.capacity.overtimeAvailableHours, 24.6);
  assert.equal(r.capacity.regularParts, 954);
  assert.equal(r.capacity.maxParts, 1282);
  assert.equal(r.capacity.overtimeHours, 3.4);
  assert.equal(r.material.shortfallParts, 360);
  assert.equal(r.material.arrivesInTime, true);
  assert.equal(r.material.runsOutOnDay, 4);
  // 62 + 67.5 + 2.7 + 1.52
  assert.equal(r.cost.unit, 133.72);
  assert.equal(r.cost.withinTarget, true);
  assert.equal(r.verdict, "conditional");
  assert.equal(r.approvals.length, 3);
  assert.ok(r.approvals.some((a) => /requisition/i.test(a)));
  assert.ok(r.approvals.some((a) => /Overtime/.test(a)));
  assert.ok(r.approvals.some((a) => /delivery promise/i.test(a)), "a customer commitment always needs a person");
});

test("mission: the verdict follows the inputs", () => {
  const { evaluateMission } = mission;

  const easy = evaluateMission({ quantity: 600, workingDays: 5, targetUnitCost: 140 });
  assert.equal(easy.verdict, "feasible");
  assert.equal(easy.constraints.length, 0);
  assert.equal(easy.material.shortfallParts, 0);
  assert.equal(easy.capacity.overtimeHours, 0);
  // Feasible is not the same as automatic: committing to a customer still needs a person.
  assert.deepEqual(easy.approvals, ["The delivery promise to the customer (account owner)."]);

  const tooMany = evaluateMission({ quantity: 2000, workingDays: 5, targetUnitCost: 140 });
  assert.equal(tooMany.verdict, "not_feasible");
  assert.ok(tooMany.constraints.some((c) => /Capacity allows about/.test(c)));
  assert.ok(!tooMany.approvals.some((a) => /delivery promise/i.test(a)), "nothing to promise when it cannot be done");

  const noTime = evaluateMission({ quantity: 1000, workingDays: 2, targetUnitCost: 140 });
  assert.equal(noTime.verdict, "not_feasible");
  assert.equal(noTime.material.arrivesInTime, false, "a 2-day lead time leaves nothing of a 2-day window");

  const tight = evaluateMission({ quantity: 1000, workingDays: 5, targetUnitCost: 120 });
  assert.equal(tight.cost.withinTarget, false);
  assert.equal(tight.cost.gap, 13.72);
  assert.equal(tight.verdict, "conditional");
  assert.ok(tight.approvals.some((a) => /margin exception/.test(a)));

  // More time removes the overtime.
  const relaxed = evaluateMission({ quantity: 1000, workingDays: 8, targetUnitCost: 135 });
  assert.equal(relaxed.capacity.overtimeHours, 0);
  assert.ok(relaxed.cost.unit < 133.72);
});

test("mission: monotonic, bounded and safe on bad input", () => {
  const { evaluateMission, MISSION_RANGES } = mission;
  // More days never means less capacity. (Overtime USED is not monotonic: it
  // is capped by what is available, so an infeasible two-day plan uses less
  // than a three-day one.)
  let previous = { regularHours: -1, maxParts: -1 };
  for (let days = 2; days <= 8; days++) {
    const r = evaluateMission({ quantity: 1000, workingDays: days, targetUnitCost: 135 });
    assert.ok(r.capacity.regularHours >= previous.regularHours, `regular hours never fall with more days (${days})`);
    assert.ok(r.capacity.maxParts >= previous.maxParts, `capacity never falls with more days (${days})`);
    assert.ok(r.capacity.overtimeHours <= r.capacity.overtimeAvailableHours + 0.05, `overtime used never exceeds what is available (${days})`);
    previous = r.capacity;
  }
  for (const bad of [NaN, Infinity, -5, 1e9, "abc", null, undefined]) {
    const r = evaluateMission({ quantity: bad, workingDays: bad, targetUnitCost: bad });
    assert.ok(r.input.quantity >= MISSION_RANGES.quantity.min && r.input.quantity <= MISSION_RANGES.quantity.max, String(bad));
    assert.ok(Number.isFinite(r.cost.unit) && r.cost.unit > 0, String(bad));
    assert.ok(["feasible", "conditional", "not_feasible"].includes(r.verdict));
  }
  // An engineering problem blocks the plan whatever the capacity.
  const blocked = evaluateMission(
    { quantity: 300, workingDays: 8, targetUnitCost: 170 },
    { ...mission.MISSION_EXAMPLE, part: { ...mission.MISSION_EXAMPLE.part, programForRevision: "B" } },
  );
  assert.equal(blocked.verdict, "not_feasible");
  assert.match(blocked.engineering.note, /approved for revision B, not C/);
});

/* -------------------------------------------------------------------------- */
/*                                Digital twin                                */
/* -------------------------------------------------------------------------- */

const run = (state, ticks) => {
  for (let i = 0; i < ticks; i++) state = twin.stepTwin(state);
  return state;
};

test("twin: deterministic from its seed, so server and client render the same cell", () => {
  const a = twin.createTwin(7);
  const b = twin.createTwin(7);
  assert.deepEqual(a, b);
  assert.deepEqual(run(a, 25), run(b, 25));
  assert.notDeepEqual(twin.createTwin(8).machines.map((m) => m.loadHistory), a.machines.map((m) => m.loadHistory));

  assert.equal(a.tick, 0);
  assert.equal(a.machines.length, 4);
  assert.equal(a.exception, null);
  assert.equal(a.events.length, 1);
  for (const machine of a.machines) {
    assert.equal(machine.loadHistory.length, twin.HISTORY_LENGTH, "trend is full on first paint");
    assert.equal(machine.stateHistory.length, twin.HISTORY_LENGTH);
    assert.ok(machine.loadHistory.every((v) => v >= 0 && v <= 100));
    assert.match(machine.workOrder.id, /^WO-EX-/, "work orders are marked as examples");
  }
  assert.ok(a.machines.some((m) => m.state === "setup"), "the cell opens with more than one state");
  assert.ok(a.machines.some((m) => m.state === "running" || m.state === "idle"));
});

test("twin: with no exception injected, nothing ever needs attention", () => {
  const end = run(twin.createTwin(7), 400);
  assert.equal(end.exception, null);
  for (const machine of end.machines) {
    assert.ok(!machine.stateHistory.includes("attention"), machine.id);
    assert.ok(machine.workOrder.done <= machine.workOrder.target, `${machine.id} never overruns its quantity`);
    assert.equal(machine.loadHistory.length, twin.HISTORY_LENGTH);
  }
  assert.ok(end.events.length <= 40, "the log is bounded");
  assert.ok(!end.events.some((e) => e.kind === "alert"));
});

test("twin: an exception builds, is detected, drafts a task, and waits for a person", () => {
  let state = twin.injectException(twin.createTwin(7), "vmc-01");
  assert.equal(state.exception.stage, "building");
  assert.equal(twin.injectException(state, "vmc-02"), state, "one exception at a time");

  let ticks = 0;
  while (state.exception.stage === "building" && ticks < 60) {
    state = twin.stepTwin(state);
    ticks++;
  }
  assert.equal(state.exception.stage, "detected", `detected after ${ticks} readings`);
  assert.ok(ticks >= 4, "one high reading is not a pattern");
  assert.ok(state.events.some((e) => e.kind === "alert" && /VMC-01/.test(e.text)));
  assert.ok(state.events.some((e) => e.kind === "task" && e.text.includes(twin.TWIN_TASK.id)));

  // It waits: the simulation never resolves the task on its own.
  const waiting = run(state, 80);
  assert.equal(waiting.exception.stage, "detected");
  const machine = waiting.machines.find((m) => m.id === "vmc-01");
  assert.ok(!machine.stateHistory.includes("planned_stop"), "no stop without an approval");
});

test("twin: approving stops the machine for the check; dismissing keeps it running, on record", () => {
  let detected = twin.injectException(twin.createTwin(7), "vmc-01");
  while (detected.exception.stage === "building") detected = twin.stepTwin(detected);

  const approved = twin.decideException(detected, "approve");
  assert.equal(approved.exception.stage, "approved");
  assert.ok(approved.events.at(-1).text.includes("approved by the supervisor (you)"));
  const during = twin.stepTwin(approved);
  assert.equal(during.machines.find((m) => m.id === "vmc-01").state, "planned_stop");
  const after = run(approved, 20);
  assert.equal(after.exception, null, "the check ends and the exception closes");
  const recovered = after.machines.find((m) => m.id === "vmc-01");
  assert.ok(recovered.load <= recovered.bandHigh, "back inside its band");
  assert.ok(after.events.some((e) => /check complete/.test(e.text)));

  const dismissed = twin.decideException(detected, "dismiss");
  assert.equal(dismissed.exception, null);
  assert.ok(dismissed.events.at(-1).text.includes("dismissed by the supervisor (you)"));
  assert.ok(!run(dismissed, 20).machines.find((m) => m.id === "vmc-01").stateHistory.slice(-15).includes("planned_stop"));

  // Decisions only apply to a drafted task.
  const idle = twin.createTwin(7);
  assert.equal(twin.decideException(idle, "approve"), idle);
  // A machine in setup has nothing to go wrong with yet.
  assert.equal(twin.injectException(idle, "vmc-04"), idle);
  assert.equal(twin.injectException(idle, "no-such-machine"), idle);
});

test("twin: state shares add up", () => {
  const share = twin.stateShare(twin.createTwin(7).machines[0]);
  const total = Object.values(share).reduce((sum, v) => sum + v, 0);
  assert.ok(total >= 98 && total <= 102, `rounded shares total ${total}`);
  for (const state of Object.keys(share)) assert.ok(twin.STATE_LABEL[state], state);
});

/* -------------------------------------------------------------------------- */
/*                         Agent workflows and status                         */
/* -------------------------------------------------------------------------- */

test("agent workflows: the five named agents, and eight complete parts per workflow", () => {
  assert.deepEqual(workflows.AGENTS.map((a) => a.name), [
    "Sales Executive",
    "Operations",
    "Finance",
    "Business Analyst",
    "CRM Data Steward",
  ]);
  assert.deepEqual(workflows.ANATOMY.map(([, label]) => label), [
    "Trigger", "Context", "Agent", "Authorised tools", "Proposed action", "Approval", "Result", "Audit trail",
  ]);
  assert.ok(workflows.AGENT_WORKFLOWS.length >= 5);
  for (const workflow of workflows.AGENT_WORKFLOWS) {
    for (const [key] of workflows.ANATOMY) {
      assert.ok(workflow[key]?.trim().length > 20, `${workflow.id} / ${key}`);
    }
    assert.equal(workflow.chain.filter((s) => s.human).length, 1, `${workflow.id}: exactly one point where a person decides`);
    assert.equal(new Set(workflow.chain.map((s) => s.text)).size, workflow.chain.length, workflow.id);
  }
  // The headline workflow is the one the brief spells out.
  assert.deepEqual(workflows.AGENT_WORKFLOWS[0].chain.map((s) => s.text), [
    "Sales inquiry", "CRM qualification", "Engineering review", "ERP estimate", "Quote draft", "Human approval", "Customer follow-up",
  ]);
  assert.equal(workflows.MORE_WORKFLOWS.length, 4);
});

test("capability status: every claim has a basis, and 'available' means someone vouched for it", () => {
  const { CAPABILITIES, STATUS_LABEL, DATA_LABEL } = capabilities;
  assert.deepEqual(Object.values(STATUS_LABEL), ["Available now", "In development", "Planned capability"]);
  assert.equal(new Set(CAPABILITIES.map((c) => c.id)).size, CAPABILITIES.length);
  for (const status of ["available", "development", "planned"]) {
    assert.ok(capabilities.capabilitiesByStatus(status).length > 0, status);
  }
  for (const item of CAPABILITIES) {
    assert.ok(item.title && item.body && item.proof, item.id);
    if (item.status === "available") {
      assert.ok(["founder", "repository"].includes(item.basis), `${item.id}: 'available' needs a founder or repository basis`);
    } else {
      assert.equal(item.basis, "positioning", `${item.id}: not-yet-available lines are positioning, not claims`);
    }
    // No invented metric may ride along in a status line.
    assert.doesNotMatch(`${item.title} ${item.body} ${item.proof}`, /\d+\s?%|\d+x\b|₹|\$\d|\b\d{2,}\+? (?:machines|customers|clients|plants)/i, item.id);
  }
  // No named third-party connector is listed as available.
  const available = JSON.stringify(capabilities.capabilitiesByStatus("available"));
  assert.doesNotMatch(available, /SOLIDWORKS|Mastercam|FANUC|Siemens|SAP|Salesforce|Odoo|Tally|Dynamics/i);

  assert.deepEqual(Object.keys(DATA_LABEL).sort(), ["example", "illustrative", "simulated"]);
  assert.equal("live" in DATA_LABEL, false, "nothing on the public site is live data");
});

/* -------------------------------------------------------------------------- */
/*                        Truthfulness of the page copy                       */
/* -------------------------------------------------------------------------- */

const PAGE_FILES = ["FactoryGraphPage", "IotPage", "AgenticPage", "CadCamPage", "ManufacturingPage", "AuditPage"];

test("every interactive example states what kind of data it shows", async () => {
  const explorer = await read("../src/components/platform/FactoryGraphExplorer.tsx");
  const missionDemo = await read("../src/components/platform/MissionDemo.tsx");
  const twinDemo = await read("../src/components/platform/DigitalTwinDemo.tsx");
  assert.match(explorer, /DATA_LABEL\.illustrative\.short/);
  assert.match(missionDemo, /DATA_LABEL\.example\.short/);
  assert.match(twinDemo, /DATA_LABEL\.simulated\.short/);
  for (const source of [explorer, missionDemo, twinDemo]) {
    assert.doesNotMatch(source, /\bfetch\(|XMLHttpRequest|WebSocket|EventSource/, "the demonstrations contact nothing");
  }
  assert.match(await read("../src/components/platform/pages/AgenticPage.tsx"), /<DataLabel kind="simulated"/);
  assert.match(await read("../src/components/platform/pages/CadCamPage.tsx"), /<DataLabel kind="example"/);
});

test("page copy makes no outcome promises and names no customers", async () => {
  for (const file of PAGE_FILES) {
    const source = await read(`../src/components/platform/pages/${file}.tsx`);
    const copy = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    // Percentages, multipliers and money as results. The mission demo's
    // figures live in lib/platform/mission.ts and are labelled example data.
    assert.doesNotMatch(copy, /\b\d+(?:\.\d+)?\s?%/, `${file}: a percentage in the copy`);
    assert.doesNotMatch(copy, /\b\d+x\b/i, `${file}: a multiplier in the copy`);
    assert.doesNotMatch(copy, /(?:reduce[sd]?|cut[s]?|save[sd]?|increase[sd]?|boost[s]?) [^.]{0,40}\bby \d/i, `${file}: a quantified promise`);
    assert.doesNotMatch(copy, /\b(?:trusted by|our clients include|as seen in|award-winning|guaranteed)\b/i, file);
    assert.doesNotMatch(copy, /\b(?:in|within) \d+ (?:days|weeks|months)\b/i, `${file}: an implementation-time promise`);
  }
});

test("every page has its required parts: one form, a FAQ, the status or boundary, and the brief's CTA", async () => {
  const cta = {
    FactoryGraphPage: ["Book a Factory Graph Demo", "Explore the Architecture"],
    IotPage: ["Discuss Your Machine Integration"],
    AgenticPage: ["See an Agentic Workflow"],
    CadCamPage: ["Discuss CAD/CAM Integration"],
    ManufacturingPage: ["Book an Industrial Systems Audit"],
    AuditPage: ["Book an industrial systems audit"],
  };
  const formServices = new Set(LEAD_SERVICES.map((s) => s.id));
  for (const file of PAGE_FILES) {
    const source = await read(`../src/components/platform/pages/${file}.tsx`);
    assert.equal((source.match(/<EnquirySection/g) ?? []).length, 1, `${file}: exactly one enquiry form`);
    assert.equal((source.match(/<PlatformHero/g) ?? []).length, 1, `${file}: exactly one hero (one h1)`);
    assert.match(source, /<Faq items=/, `${file}: FAQ`);
    assert.match(source, /<LegalNote \/>/, `${file}: trademark note`);
    for (const label of cta[file]) assert.ok(source.includes(label), `${file}: CTA "${label}"`);
    const service = source.match(/service="([a-z-]+)"/)?.[1];
    assert.ok(formServices.has(service), `${file}: form service ${service}`);
    const formId = source.match(/formId="([a-z0-9-]+)"/)?.[1];
    assert.match(formId ?? "", /^[a-z0-9-]{1,40}$/, `${file}: form id`);
  }
  // The flagship page carries every section the brief lists.
  const flagship = await read("../src/components/platform/pages/FactoryGraphPage.tsx");
  for (const id of [
    "problem", "concept", "architecture", "integration", "mission", "data-architecture", "governance",
    "integrations", "proof", "use-cases", "deployment", "faq",
  ]) {
    assert.ok(flagship.includes(`id="${id}"`), `flagship section #${id}`);
  }
  assert.match(flagship, /<FactoryGraphExplorer/);
  assert.match(flagship, /<MissionDemo/);
  assert.match(flagship, /<StatusBoard/);
});
