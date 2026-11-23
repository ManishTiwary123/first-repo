/**
 * Offline tests for the lead pipeline: validation, anti-spam, triage, the
 * pipeline's every outcome, the signed webhook, the rate limiter, the request
 * guards and the POST /api/leads route handler end to end.
 *
 *   node --test scripts/leads.test.mjs
 *
 * Loads the real modules from src/ through Node's TypeScript type stripping
 * (Node >= 22.18). Nothing leaves the machine: the webhook receiver is an
 * http server on 127.0.0.1, and no database is contacted (the database sink
 * is injected as a fake; supabase/leads-schema.sql is checked as text here
 * and has to be exercised against a real Postgres separately).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import { register } from "node:module";

// Resolve the `@/` alias and extensionless imports inside src/, and load the
// locale JSON files as modules (they are imported without import attributes).
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
    // Package subpaths without an exports map (next/server) need the extension under ESM.
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

const schema = await import("../src/lib/leads/schema.ts");
const { assessSpam, MIN_FILL_MS } = await import("../src/lib/leads/spam.ts");
const { emailKind, followUpDueOn, scoreLead, triageLead } = await import("../src/lib/leads/categorize.ts");
const { buildLeadRecord, leadReference, processLead } = await import("../src/lib/leads/pipeline.ts");
const { WebhookError, createWebhookNotifier, parseWebhookUrl, signWebhook } = await import("../src/lib/leads/notify.ts");
const { LEAD_RATE_LIMITS, createRateLimiter } = await import("../src/lib/leads/rate-limit.ts");
const { isCrossSite, isJsonContentType, readBodyCapped } = await import("../src/lib/leads/http.ts");
const { describeLeadError } = await import("../src/lib/leads/log.ts");
const { getLeadFormCopy } = await import("../src/components/leads/lead-form-copy.ts");

const { LEAD_SERVICES, LEAD_LIMITS, CONSENT_TEXT, CONSENT_VERSION, validateLead } = schema;

/* -------------------------------------------------------------------------- */
/*                                  Fixtures                                  */
/* -------------------------------------------------------------------------- */

const NOW = Date.UTC(2026, 10, 23, 6, 30); // Monday 23 Nov 2026, 12:00 IST
let keyCounter = 0;
const nextKey = () => `test-key-${String(++keyCounter).padStart(12, "0")}`;

function submission(overrides = {}, meta = {}) {
  return {
    name: "Asha Mehta",
    email: "asha.mehta@precisionworks.example",
    phone: "+91 98765 43210",
    company: "Precision Works Pvt Ltd",
    role: "Plant Manager",
    country: "India",
    industry: "CNC & precision engineering",
    scale: "11-50",
    erpCrm: "Tally, Zoho CRM",
    cadCam: "SOLIDWORKS, Mastercam",
    connectivity: "partial",
    challenge: "Downtime is logged on paper and reaches planning a day late, so the schedule is always behind.",
    service: "iiot-digital-twin",
    consentContact: true,
    consentMarketing: false,
    ...overrides,
    meta: {
      idempotencyKey: nextKey(),
      formId: "factory-graph-demo",
      pagePath: "/in/en/factory-graph",
      locale: "en",
      market: "in",
      startedAt: NOW - 60_000,
      honeypot: "",
      attribution: { utmSource: "google", utmMedium: "cpc", landingPage: "/in/en/factory-graph" },
      ...meta,
    },
  };
}

const CLIENT = { ipHash: null, userAgent: "node-test", geoCountry: "IN" };

function deps(extra = {}) {
  const errors = [];
  return {
    errors,
    now: () => new Date(NOW),
    logError: (context, err, details) => errors.push({ context, err, details }),
    ...extra,
  };
}

/* -------------------------------------------------------------------------- */
/*                                 Validation                                 */
/* -------------------------------------------------------------------------- */

test("validateLead accepts a complete enquiry and normalises it", () => {
  const result = validateLead(
    submission({
      name: "  Asha   Mehta \u0007",
      email: "  Asha.Mehta@PrecisionWorks.Example ",
      challenge: "Line one.  \r\n\r\n\r\n\r\nLine two with enough words to pass.",
      consentMarketing: true,
    }),
  );
  assert.equal(result.ok, true);
  const { lead } = result;
  assert.equal(lead.name, "Asha Mehta", "whitespace collapsed, control character removed");
  assert.equal(lead.email, "asha.mehta@precisionworks.example", "email lower-cased");
  assert.equal(lead.challenge, "Line one.\n\nLine two with enough words to pass.", "blank lines capped");
  assert.equal(lead.consentContact, true);
  assert.equal(lead.consentMarketing, true);
  assert.equal(lead.scale, "11-50");
  assert.equal(lead.meta.pagePath, "/in/en/factory-graph");
});

test("validateLead: optional fields may be empty, and become null", () => {
  const result = validateLead(submission({ phone: "", scale: "", erpCrm: "", cadCam: "", connectivity: "" }));
  assert.equal(result.ok, true);
  for (const key of ["phone", "scale", "erpCrm", "cadCam", "connectivity"]) assert.equal(result.lead[key], null, key);
});

test("validateLead names every missing required field", () => {
  const empty = {
    name: "", email: "", company: "", role: "", country: "", industry: "", challenge: "", service: "",
    consentContact: false,
  };
  const result = validateLead(submission(empty));
  assert.equal(result.ok, false);
  assert.equal(result.meta, false);
  assert.deepEqual(result.fields, {
    name: "required", email: "required", company: "required", role: "required", country: "required",
    industry: "required", challenge: "required", service: "required", consent: "required",
  });
});

test("validateLead: consent must be the literal true", () => {
  for (const value of ["true", "on", 1, "yes", null, undefined, {}]) {
    const result = validateLead(submission({ consentContact: value }));
    assert.equal(result.ok, false, String(value));
    assert.equal(result.fields.consent, "required", String(value));
  }
  // Marketing consent is opt-in: anything but true is false, never an error.
  assert.equal(validateLead(submission({ consentMarketing: "on" })).lead.consentMarketing, false);
});

test("validateLead rejects malformed values field by field", () => {
  const cases = [
    [{ email: "not-an-email" }, "email", "invalid"],
    [{ email: "a@b" }, "email", "invalid"],
    [{ email: "two@@signs.example" }, "email", "invalid"],
    [{ email: ".dot@start.example" }, "email", "invalid"],
    [{ email: `${"x".repeat(250)}@a.example` }, "email", "too_long"],
    [{ phone: "call me maybe" }, "phone", "invalid"],
    [{ phone: "12345" }, "phone", "invalid"],
    [{ phone: "1".repeat(40) }, "phone", "too_long"],
    [{ name: "A" }, "name", "too_short"],
    [{ name: "A".repeat(LEAD_LIMITS.name.max + 1) }, "name", "too_long"],
    [{ challenge: "too short" }, "challenge", "too_short"],
    [{ challenge: "x".repeat(LEAD_LIMITS.challenge.max + 1) }, "challenge", "too_long"],
    [{ service: "free-pizza" }, "service", "invalid"],
    [{ scale: "many" }, "scale", "invalid"],
    [{ connectivity: "wifi" }, "connectivity", "invalid"],
    [{ erpCrm: "x".repeat(LEAD_LIMITS.erpCrm.max + 1) }, "erpCrm", "too_long"],
  ];
  for (const [override, field, error] of cases) {
    const result = validateLead(submission(override));
    assert.equal(result.ok, false, JSON.stringify(override).slice(0, 60));
    assert.equal(result.fields[field], error, `${field}: ${JSON.stringify(override).slice(0, 60)}`);
  }
  for (const phone of ["+91 98765 43210", "(022) 2345-6789", "9876543210", "+1.415.555.0100"]) {
    assert.equal(validateLead(submission({ phone })).ok, true, phone);
  }
});

test("validateLead: a malformed envelope is the request's fault, not the visitor's", () => {
  for (const raw of [null, "string", 42, [], undefined]) {
    assert.deepEqual(validateLead(raw), { ok: false, fields: {}, meta: true });
  }
  const bad = [
    { idempotencyKey: "short" },
    { idempotencyKey: "has spaces in it which is bad" },
    { formId: "Has Caps" },
    { locale: "english" },
    { market: "IND" },
    { startedAt: "yesterday" },
    { startedAt: -5 },
    { pagePath: "https://evil.example/in/en" },
    { pagePath: `/${"x".repeat(400)}` },
  ];
  for (const meta of bad) {
    const result = validateLead(submission({}, meta));
    assert.equal(result.ok, false, JSON.stringify(meta));
    assert.equal(result.meta, true, JSON.stringify(meta));
    assert.deepEqual(result.fields, {}, "no field is blamed for a bad envelope");
  }
  assert.equal(validateLead({ ...submission(), meta: undefined }).meta, true);
});

test("validateLead keeps only known attribution keys, capped, and strips the query from the page path", () => {
  const result = validateLead(
    submission({}, {
      pagePath: "/in/en/contact?email=someone@example.com#form",
      attribution: {
        utmSource: "newsletter",
        utmCampaign: "x".repeat(900),
        injected: "<script>",
        referrer: { nested: true },
        gclid: 12345,
      },
    }),
  );
  assert.equal(result.ok, true);
  assert.equal(result.lead.meta.pagePath, "/in/en/contact");
  assert.deepEqual(Object.keys(result.lead.meta.attribution).sort(), ["gclid", "utmCampaign", "utmSource"]);
  assert.equal(result.lead.meta.attribution.utmCampaign.length, LEAD_LIMITS.attribution.max);
  assert.equal(result.lead.meta.attribution.gclid, "12345");
});

test("validateLead ignores unknown top-level keys", () => {
  const result = validateLead({ ...submission(), admin: true, status: "won", priority: "A" });
  assert.equal(result.ok, true);
  assert.equal("admin" in result.lead, false);
  assert.equal("status" in result.lead, false);
});

/* -------------------------------------------------------------------------- */
/*                                    Spam                                    */
/* -------------------------------------------------------------------------- */

test("assessSpam: honeypot, speed, clock and links", () => {
  const lead = (overrides, meta) => validateLead(submission(overrides, meta)).lead;

  assert.deepEqual(assessSpam(lead(), NOW), { spam: false });
  assert.deepEqual(assessSpam(lead({}, { honeypot: "x" }), NOW), { spam: true, reason: "honeypot" });
  assert.deepEqual(assessSpam(lead({}, { honeypot: " " }), NOW), { spam: true, reason: "honeypot" }, "whitespace is still a hit");
  assert.deepEqual(assessSpam(lead({}, { startedAt: NOW - (MIN_FILL_MS - 1) }), NOW), { spam: true, reason: "too_fast" });
  assert.deepEqual(assessSpam(lead({}, { startedAt: NOW - MIN_FILL_MS }), NOW), { spam: false });
  assert.deepEqual(assessSpam(lead({}, { startedAt: NOW + 60_000 }), NOW), { spam: false }, "a minute of clock skew is tolerated");
  assert.deepEqual(assessSpam(lead({}, { startedAt: NOW + 60 * 60_000 }), NOW), { spam: true, reason: "clock" });
  assert.deepEqual(assessSpam(lead({}, { startedAt: NOW - 3 * 24 * 60 * 60_000 }), NOW), { spam: false }, "a form left open for days is still a person");

  assert.deepEqual(assessSpam(lead({ name: "Buy now https://spam.example" }), NOW), { spam: true, reason: "links" });
  const twoLinks = "See https://ours.example/spec and www.ours.example/drawing for the part family we machine.";
  assert.deepEqual(assessSpam(lead({ challenge: twoLinks }), NOW), { spam: false });
  assert.deepEqual(
    assessSpam(lead({ challenge: `${twoLinks} Also http://a.example and http://b.example` }), NOW),
    { spam: true, reason: "links" },
  );
});

/* -------------------------------------------------------------------------- */
/*                                   Triage                                   */
/* -------------------------------------------------------------------------- */

const sqlText = await readFile(new URL("../supabase/leads-schema.sql", import.meta.url), "utf8");

test("triage: every service has a category and a label", () => {
  for (const { id, label } of LEAD_SERVICES) {
    const lead = validateLead(submission({ service: id })).lead;
    const triage = triageLead(lead, new Date(NOW));
    assert.ok(["industrial", "business-systems", "audit", "general"].includes(triage.category), id);
    assert.ok(sqlText.includes(`'${triage.category}'`), `category ${triage.category} is allowed by the table`);
    assert.equal(triage.serviceLabel, label);
    assert.match(triage.followUp.title, /Asha Mehta at Precision Works/);
  }
});

test("triage: email kind and score", () => {
  assert.equal(emailKind("someone@gmail.com"), "free");
  assert.equal(emailKind("someone@GMAIL.com"), "free");
  assert.equal(emailKind("someone@precisionworks.example"), "work");

  const strong = validateLead(submission({ role: "Managing Director", scale: "200+" })).lead;
  assert.equal(scoreLead(strong).priority, "A");

  const thin = validateLead(
    submission({
      role: "Student", email: "someone@gmail.com", phone: "", scale: "", erpCrm: "", cadCam: "", connectivity: "",
      challenge: "Just curious about pricing.",
    }),
  ).lead;
  assert.deepEqual(scoreLead(thin), { score: 0, priority: "C" });

  // A free mailbox withholds one point; it never decides the tier alone.
  const owner = validateLead(submission({ role: "Owner", email: "owner@gmail.com", scale: "51-200" })).lead;
  assert.notEqual(scoreLead(owner).priority, "C");
});

test("triage: follow-up is due the next working day in IST, never on a Sunday", () => {
  const ist = (y, m, d, h = 12) => new Date(Date.UTC(y, m - 1, d, h - 5, -30));
  assert.equal(followUpDueOn(ist(2026, 11, 23)), "2026-11-24", "Monday → Tuesday");
  assert.equal(followUpDueOn(ist(2026, 11, 27)), "2026-11-28", "Friday → Saturday (a working day)");
  assert.equal(followUpDueOn(ist(2026, 11, 28)), "2026-11-30", "Saturday → Monday");
  assert.equal(followUpDueOn(ist(2026, 11, 29)), "2026-11-30", "Sunday → Monday");
  // 23:30 UTC on Monday is already Tuesday 05:00 in India.
  assert.equal(followUpDueOn(new Date(Date.UTC(2026, 10, 23, 23, 30))), "2026-11-25");
});

/* -------------------------------------------------------------------------- */
/*                                  Pipeline                                  */
/* -------------------------------------------------------------------------- */

test("leadReference is stable per key, readable and unambiguous", () => {
  const a = leadReference("test-key-000000000001");
  assert.equal(a, leadReference("test-key-000000000001"));
  assert.notEqual(a, leadReference("test-key-000000000002"));
  assert.match(a, /^SG-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
});

test("buildLeadRecord carries consent, attribution and the follow-up task", () => {
  const lead = validateLead(submission({ consentMarketing: true })).lead;
  const record = buildLeadRecord(lead, CLIENT, new Date(NOW));
  assert.deepEqual(record.consent, {
    contact: true,
    marketing: true,
    text: CONSENT_TEXT,
    marketingText: schema.MARKETING_CONSENT_TEXT,
    version: CONSENT_VERSION,
    at: new Date(NOW).toISOString(),
  });
  assert.equal(record.source.formId, "factory-graph-demo");
  assert.equal(record.source.utmSource, "google");
  assert.equal(record.source.market, "in");
  assert.equal(record.followUp.dueOn, "2026-11-24");
  assert.equal(record.category, "industrial");
  assert.equal(record.client.geoCountry, "IN");
  assert.equal("honeypot" in record, false);
  // Without opt-in, no marketing wording is recorded as agreed.
  const quiet = buildLeadRecord(validateLead(submission()).lead, CLIENT, new Date(NOW));
  assert.equal(quiet.consent.marketing, false);
  assert.equal(quiet.consent.marketingText, null);
});

test("processLead: with no sink configured nothing is accepted", async () => {
  const d = deps();
  assert.deepEqual(await processLead(submission(), CLIENT, d), { status: "not_configured" });
});

test("processLead: invalid and rejected submissions never reach a sink", async () => {
  let calls = 0;
  const d = deps({ store: async () => { calls++; throw new Error("unreachable"); }, notify: async () => { calls++; } });

  const invalid = await processLead(submission({ email: "nope" }), CLIENT, d);
  assert.equal(invalid.status, "invalid");
  assert.equal(invalid.fields.email, "invalid");
  assert.equal(invalid.malformed, false);

  const malformed = await processLead({ ...submission(), meta: null }, CLIENT, d);
  assert.deepEqual(malformed, { status: "invalid", fields: {}, malformed: true });

  const spam = await processLead(submission({}, { honeypot: "bot" }), CLIENT, d);
  assert.deepEqual(spam, { status: "rejected", reason: "honeypot" });

  assert.equal(calls, 0);
});

test("processLead: stored and notified", async () => {
  const events = [];
  const d = deps({
    store: async (record) => ({ id: "11111111-1111-4111-8111-111111111111", reference: record.reference, duplicate: false, replay: false }),
    notify: async (event) => { events.push(event); },
  });
  const raw = submission();
  const outcome = await processLead(raw, CLIENT, d);
  assert.equal(outcome.status, "accepted");
  assert.deepEqual(outcome.delivered, { database: true, webhook: true });
  assert.equal(outcome.reference, leadReference(raw.meta.idempotencyKey));
  assert.equal(events.length, 1);
  assert.equal(events[0].event, "lead.created");
  assert.equal(events[0].lead.id, "11111111-1111-4111-8111-111111111111");
  assert.equal(events[0].lead.email, "asha.mehta@precisionworks.example");
  assert.equal(events[0].lead.followUp.dueOn, "2026-11-24");
  assert.equal(d.errors.length, 0);
});

test("processLead: one working sink is enough, and the gap is logged", async () => {
  // Database down, webhook up.
  const a = deps({ store: async () => { throw new Error("connection refused"); }, notify: async () => {} });
  const first = await processLead(submission(), CLIENT, a);
  assert.equal(first.status, "accepted");
  assert.deepEqual(first.delivered, { database: false, webhook: true });
  assert.equal(a.errors[0].context, "store failed");

  // Database up, webhook down: the lead is safe, the notification gap must alert.
  const b = deps({
    store: async (record) => ({ id: "x", reference: record.reference, duplicate: false, replay: false }),
    notify: async () => { throw new WebhookError("receiver answered 500", 500); },
  });
  const second = await processLead(submission(), CLIENT, b);
  assert.equal(second.status, "accepted");
  assert.deepEqual(second.delivered, { database: true, webhook: false });
  assert.equal(b.errors[0].context, "notify failed after store");

  // Webhook only.
  const c = deps({ notify: async () => {} });
  assert.deepEqual((await processLead(submission(), CLIENT, c)).delivered, { database: false, webhook: true });
});

test("processLead: when every configured sink fails, it says failed", async () => {
  const both = deps({ store: async () => { throw new Error("down"); }, notify: async () => { throw new Error("down"); } });
  const raw = submission();
  assert.deepEqual(await processLead(raw, CLIENT, both), { status: "failed", reference: leadReference(raw.meta.idempotencyKey) });
  assert.equal(both.errors.length, 2);

  const dbOnly = deps({ store: async () => { throw new Error("down"); } });
  assert.equal((await processLead(submission(), CLIENT, dbOnly)).status, "failed");

  const hookOnly = deps({ notify: async () => { throw new Error("down"); } });
  assert.equal((await processLead(submission(), CLIENT, hookOnly)).status, "failed");
});

test("processLead: a retried submission is a replay, and is not announced twice", async () => {
  const rows = new Map();
  let notified = 0;
  const d = deps({
    store: async (record) => {
      const existing = rows.get(record.idempotencyKey);
      if (existing) return { ...existing, replay: true };
      const row = { id: `id-${rows.size + 1}`, reference: record.reference, duplicate: false };
      rows.set(record.idempotencyKey, row);
      return { ...row, replay: false };
    },
    notify: async () => { notified++; },
  });
  const raw = submission();
  const first = await processLead(raw, CLIENT, d);
  const again = await processLead(structuredClone(raw), CLIENT, d);
  assert.equal(first.replay, false);
  assert.equal(again.status, "accepted");
  assert.equal(again.replay, true);
  assert.equal(again.reference, first.reference);
  assert.equal(rows.size, 1, "one row");
  assert.equal(notified, 1, "one notification");
});

test("processLead: a duplicate is still accepted and flagged for the team", async () => {
  const events = [];
  const d = deps({
    store: async (record) => ({ id: "second", reference: record.reference, duplicate: true, replay: false }),
    notify: async (event) => { events.push(event); },
  });
  const outcome = await processLead(submission(), CLIENT, d);
  assert.equal(outcome.status, "accepted");
  assert.equal(outcome.duplicate, true);
  assert.equal(events[0].lead.duplicate, true);
});

/* -------------------------------------------------------------------------- */
/*                                   Webhook                                  */
/* -------------------------------------------------------------------------- */

function receiver(handler) {
  const requests = [];
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const request = { headers: req.headers, body: Buffer.concat(chunks).toString("utf8"), url: req.url };
      requests.push(request);
      const status = handler ? handler(request, requests.length) : 200;
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end("{}");
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        url: new URL(`http://127.0.0.1:${port}/hooks/leads`),
        requests,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}

function sampleEvent() {
  const lead = validateLead(submission()).lead;
  const record = buildLeadRecord(lead, CLIENT, new Date(NOW));
  return { event: "lead.created", version: 1, sentAt: new Date(NOW).toISOString(), lead: { ...record, id: null, duplicate: false } };
}

test("webhook: one signed POST that a receiver can verify", async () => {
  const hook = await receiver();
  try {
    const event = sampleEvent();
    await createWebhookNotifier({ url: hook.url, secret: "s3cret", now: () => NOW })(event);
    assert.equal(hook.requests.length, 1);
    const [{ headers, body }] = hook.requests;
    assert.equal(headers["content-type"], "application/json");
    assert.equal(headers["x-savin-event"], "lead.created");
    assert.equal(headers["x-savin-idempotency-key"], event.lead.idempotencyKey);
    assert.equal(headers["x-savin-timestamp"], String(Math.floor(NOW / 1000)));
    // The receiver's side of the check, written out independently.
    const expected = `sha256=${createHmac("sha256", "s3cret").update(`${headers["x-savin-timestamp"]}.${body}`).digest("hex")}`;
    assert.equal(headers["x-savin-signature"], expected);
    assert.equal(signWebhook("s3cret", headers["x-savin-timestamp"], body), expected);
    assert.deepEqual(JSON.parse(body), event);
  } finally {
    await hook.close();
  }
});

test("webhook: unsigned without a secret; retried once on 5xx; not retried on 4xx", async () => {
  const plain = await receiver();
  const flaky = await receiver((_, n) => (n === 1 ? 503 : 200));
  const down = await receiver(() => 500);
  const refused = await receiver(() => 400);
  try {
    await createWebhookNotifier({ url: plain.url })(sampleEvent());
    assert.equal(plain.requests[0].headers["x-savin-signature"], undefined);

    await createWebhookNotifier({ url: flaky.url, retryPauseMs: 1 })(sampleEvent());
    assert.equal(flaky.requests.length, 2, "second attempt succeeded");
    assert.equal(
      flaky.requests[0].headers["x-savin-idempotency-key"],
      flaky.requests[1].headers["x-savin-idempotency-key"],
      "the receiver can drop the repeat",
    );

    await assert.rejects(createWebhookNotifier({ url: down.url, retryPauseMs: 1 })(sampleEvent()), (err) => {
      assert.ok(err instanceof WebhookError);
      assert.equal(err.status, 500);
      return true;
    });
    assert.equal(down.requests.length, 2);

    await assert.rejects(createWebhookNotifier({ url: refused.url, retryPauseMs: 1 })(sampleEvent()), /answered 400/);
    assert.equal(refused.requests.length, 1, "a 4xx is the receiver's verdict, not a blip");
  } finally {
    await Promise.all([plain.close(), flaky.close(), down.close(), refused.close()]);
  }
});

test("webhook: a failure never quotes the URL or the lead", async () => {
  const notify = createWebhookNotifier({
    url: new URL("http://127.0.0.1:9/hooks/secret-token-in-path"),
    retryPauseMs: 1,
    fetchImpl: async () => { throw new TypeError("fetch failed: http://127.0.0.1:9/hooks/secret-token-in-path asha.mehta@precisionworks.example"); },
  });
  await assert.rejects(notify(sampleEvent()), (err) => {
    assert.doesNotMatch(err.message, /secret-token|asha|precisionworks/);
    return true;
  });
});

test("parseWebhookUrl: https anywhere; plain http only on loopback outside production", () => {
  assert.equal(parseWebhookUrl("https://crm.example/api/leads", true)?.host, "crm.example");
  assert.equal(parseWebhookUrl(" https://crm.example/api/leads ", true)?.host, "crm.example");
  assert.equal(parseWebhookUrl("http://127.0.0.1:4000/hook", false)?.port, "4000");
  assert.equal(parseWebhookUrl("http://localhost:4000/hook", false)?.port, "4000");
  assert.equal(parseWebhookUrl("http://127.0.0.1:4000/hook", true), null);
  assert.equal(parseWebhookUrl("http://crm.example/api/leads", false), null);
  assert.equal(parseWebhookUrl("https://user:pass@crm.example/", true), null, "credentials belong in a header, not the URL");
  assert.equal(parseWebhookUrl("ftp://crm.example/", false), null);
  assert.equal(parseWebhookUrl("not a url", false), null);
  assert.equal(parseWebhookUrl(undefined, false), null);
  assert.equal(parseWebhookUrl("", false), null);
});

/* -------------------------------------------------------------------------- */
/*                         Rate limit, guards, logging                        */
/* -------------------------------------------------------------------------- */

test("rate limiter: burst and daily windows, per key", () => {
  const check = createRateLimiter([
    { windowMs: 1000, max: 2 },
    { windowMs: 10_000, max: 3 },
  ]);
  assert.deepEqual(check("a", 0), { ok: true });
  assert.deepEqual(check("a", 100), { ok: true });
  assert.deepEqual(check("a", 200), { ok: false, retryAfterSeconds: 1 });
  assert.deepEqual(check("b", 200), { ok: true }, "another key is unaffected");
  assert.deepEqual(check("a", 1200), { ok: true }, "burst window moved on");
  const blocked = check("a", 2300);
  assert.equal(blocked.ok, false, "long window is full");
  assert.equal(blocked.retryAfterSeconds, 8);
  assert.deepEqual(check("a", 10_001), { ok: true });

  assert.ok(LEAD_RATE_LIMITS.every((w) => w.max >= 5), "room for a human to retry");
});

test("request guards", async () => {
  const h = (init) => new Headers(init);
  assert.equal(isCrossSite(h({ host: "www.savingroup.in", origin: "https://www.savingroup.in", "sec-fetch-site": "same-origin" })), false);
  assert.equal(isCrossSite(h({ host: "www.savingroup.in" })), false, "non-browser clients send neither header");
  assert.equal(isCrossSite(h({ host: "www.savingroup.in", "sec-fetch-site": "cross-site" })), true);
  assert.equal(isCrossSite(h({ host: "www.savingroup.in", "sec-fetch-site": "same-site" })), true);
  assert.equal(isCrossSite(h({ host: "www.savingroup.in", origin: "https://evil.example" })), true);
  assert.equal(isCrossSite(h({ host: "www.savingroup.in", origin: "null" })), true);
  assert.equal(isCrossSite(h({ host: "internal", "x-forwarded-host": "www.savingroup.in", origin: "https://www.savingroup.in" })), false);

  assert.equal(isJsonContentType("application/json"), true);
  assert.equal(isJsonContentType("application/json; charset=utf-8"), true);
  assert.equal(isJsonContentType("text/plain"), false);
  assert.equal(isJsonContentType(null), false);

  const stream = (text) => new Response(text).body;
  assert.equal(await readBodyCapped(stream("hello"), 10), "hello");
  assert.equal(await readBodyCapped(stream("x".repeat(11)), 10), null);
  assert.equal(await readBodyCapped(null, 10), "");
});

test("logs describe the failure without the lead or the credentials", () => {
  const err = new Error(
    'insert failed for asha.mehta@precisionworks.example via postgresql://lead_writer:hunter2@db.example:6543/postgres',
  );
  err.code = "23514";
  const text = describeLeadError(err);
  assert.doesNotMatch(text, /asha|precisionworks|hunter2|lead_writer/);
  assert.match(text, /^Error\(23514\): /);
  assert.equal(describeLeadError("a string with someone@example.com"), "non-Error thrown");
  assert.ok(describeLeadError(new Error("x".repeat(1000))).length < 300);
});

/* -------------------------------------------------------------------------- */
/*                              Schema and copy                               */
/* -------------------------------------------------------------------------- */

test("the SQL schema keeps the tables closed and the function narrow", async () => {
  const sql = await readFile(new URL("../supabase/leads-schema.sql", import.meta.url), "utf8");
  assert.match(sql, /alter table public\.leads enable row level security/);
  assert.match(sql, /alter table public\.lead_tasks enable row level security/);
  assert.doesNotMatch(sql, /create policy/i, "no policy: the REST API cannot read or write leads");
  assert.match(sql, /security definer\s+set search_path = public, pg_temp/);
  assert.match(sql, /revoke all on function public\.submit_lead\(jsonb\) from public/);
  assert.match(sql, /revoke all on public\.leads from lead_writer/);
  assert.match(sql, /grant execute on function public\.submit_lead\(jsonb\) to lead_writer/);
  assert.doesNotMatch(sql, /grant (?:select|insert|update|delete|all)[^;]*to lead_writer/i);
  assert.doesNotMatch(sql, /password\s+'[^<]/i, "no real password in the repository");
  // The table's vocabularies must match the form's, or a valid lead is refused.
  for (const { id } of LEAD_SERVICES) assert.ok(sql.includes(`'${id}'`), `service ${id}`);
  for (const { id } of schema.LEAD_SCALES) assert.ok(sql.includes(`'${id}'`), `scale ${id}`);
  for (const { id } of schema.LEAD_CONNECTIVITY) assert.ok(sql.includes(`'${id}'`), `connectivity ${id}`);
  for (const key of ["idempotencyKey", "erpCrm", "cadCam", "emailKind", "followUp", "consent"]) {
    assert.ok(sql.includes(`'${key}'`), `the function reads ${key} from the record`);
  }
});

test("form copy: every locale is complete and keeps its placeholders", () => {
  const en = getLeadFormCopy("en");
  const flatten = (value, prefix = "") =>
    Object.entries(value).flatMap(([key, v]) => (typeof v === "string" ? [[prefix + key, v]] : flatten(v, `${prefix}${key}.`)));
  const keys = flatten(en).map(([key]) => key);
  for (const locale of ["en", "es", "fr", "de", "ar", "hi", "zh", "gu"]) {
    const copy = Object.fromEntries(flatten(getLeadFormCopy(locale)));
    for (const key of keys) assert.ok(copy[key]?.trim(), `${locale}.${key} is empty`);
    assert.match(copy["success.body"], /\{name\}/, locale);
    assert.match(copy["success.body"], /\{email\}/, locale);
    assert.match(copy["noscript"], /\{email\}/, locale);
    assert.match(copy["noscript"], /\{phone\}/, locale);
    assert.match(copy["consent"], /Savin Group/, `${locale}: consent names who will be in touch`);
  }
  assert.equal(en.consent, CONSENT_TEXT, "the English consent line is the stored wording");
  assert.equal(en.marketing, schema.MARKETING_CONSENT_TEXT);
  assert.notEqual(getLeadFormCopy("hi").consent, en.consent, "translated, not copied");
});

/* -------------------------------------------------------------------------- */
/*                         POST /api/leads, end to end                        */
/* -------------------------------------------------------------------------- */

const { NextRequest } = await import("next/server");
const route = await import("../src/app/api/leads/route.ts");

let ipCounter = 0;
function request(body, { headers = {}, method = "POST", ip } = {}) {
  const address = ip ?? `203.0.113.${(++ipCounter % 250) + 1}`;
  return new NextRequest("http://localhost/api/leads", {
    method,
    headers: {
      "content-type": "application/json",
      host: "localhost",
      "x-forwarded-for": address,
      "x-real-ip": address,
      ...headers,
    },
    body: method === "POST" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });
}

/** The route reads the real clock, so its fixtures are relative to now. */
function live(overrides = {}, meta = {}) {
  return submission(overrides, { startedAt: Date.now() - 30_000, ...meta });
}

function withEnv(values, fn) {
  const names = ["LEADS_DATABASE_URL", "LEAD_WEBHOOK_URL", "LEAD_WEBHOOK_SECRET", "LEAD_HASH_SALT"];
  const before = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  for (const name of names) delete process.env[name];
  Object.assign(process.env, values);
  const restore = () => {
    for (const name of names) {
      if (before[name] === undefined) delete process.env[name];
      else process.env[name] = before[name];
    }
  };
  return Promise.resolve().then(fn).finally(restore);
}

function silence(fn) {
  const { error, info } = console;
  const lines = [];
  console.error = (...args) => lines.push(args.join(" "));
  console.info = (...args) => lines.push(args.join(" "));
  return Promise.resolve()
    .then(() => fn(lines))
    .finally(() => { console.error = error; console.info = info; });
}

test("route: 503 when nothing is configured, and it says so in the logs", () =>
  withEnv({}, () =>
    silence(async (lines) => {
      assert.equal(route.GET().status, 503);
      const res = await route.POST(request(live()));
      assert.equal(res.status, 503);
      assert.deepEqual(await res.json(), { ok: false, error: "unavailable" });
      assert.equal(res.headers.get("cache-control"), "no-store");
      assert.ok(lines.some((line) => line.includes("[leads]") && line.includes("no sink configured")));
    }),
  ));

test("route: accepted, delivered to the webhook with a valid signature", async () => {
  const hook = await receiver();
  try {
    await withEnv({ LEAD_WEBHOOK_URL: hook.url.href, LEAD_WEBHOOK_SECRET: "topsecret", LEAD_HASH_SALT: "pepper" }, () =>
      silence(async (lines) => {
        assert.equal(route.GET().status, 204);
        const raw = live();
        const res = await route.POST(request(raw, { headers: { "user-agent": "Mozilla/5.0 test", "x-vercel-ip-country": "in" } }));
        assert.equal(res.status, 200);
        const json = await res.json();
        assert.deepEqual(json, { ok: true, reference: leadReference(raw.meta.idempotencyKey) });
        assert.equal("duplicate" in json, false, "never tells a caller whether an address enquired before");

        assert.equal(hook.requests.length, 1);
        const { headers, body } = hook.requests[0];
        const expected = `sha256=${createHmac("sha256", "topsecret").update(`${headers["x-savin-timestamp"]}.${body}`).digest("hex")}`;
        assert.equal(headers["x-savin-signature"], expected);
        const payload = JSON.parse(body);
        assert.equal(payload.lead.email, "asha.mehta@precisionworks.example");
        assert.equal(payload.lead.reference, json.reference);
        assert.equal(payload.lead.service, "iiot-digital-twin");
        assert.equal(payload.lead.category, "industrial");
        assert.equal(payload.lead.consent.contact, true);
        assert.equal(payload.lead.source.utmSource, "google");
        assert.equal(payload.lead.client.geoCountry, "IN");
        assert.equal(payload.lead.client.userAgent, "Mozilla/5.0 test");
        assert.match(payload.lead.client.ipHash, /^[0-9a-f]{32}$/, "salted hash, not the address");
        assert.doesNotMatch(body, /203\.0\.113\./, "the raw IP is never forwarded");

        // The log line for an accepted lead carries codes, not the person.
        const accepted = lines.find((line) => line.includes("[leads] accepted"));
        assert.ok(accepted);
        assert.doesNotMatch(accepted, /asha|precisionworks|98765/i);
      }),
    );
  } finally {
    await hook.close();
  }
});

test("route: without a salt no IP-derived value is stored", async () => {
  const hook = await receiver();
  try {
    await withEnv({ LEAD_WEBHOOK_URL: hook.url.href }, () =>
      silence(async () => {
        assert.equal((await route.POST(request(live()))).status, 200);
        assert.equal(JSON.parse(hook.requests[0].body).lead.client.ipHash, null);
      }),
    );
  } finally {
    await hook.close();
  }
});

test("route: validation, spam and malformed requests are refused before delivery", async () => {
  const hook = await receiver();
  try {
    await withEnv({ LEAD_WEBHOOK_URL: hook.url.href }, () =>
      silence(async () => {
        const invalid = await route.POST(request(live({ email: "nope", consentContact: false })));
        assert.equal(invalid.status, 422);
        assert.deepEqual(await invalid.json(), { ok: false, error: "validation", fields: { email: "invalid", consent: "required" } });

        const bot = await route.POST(request(live({}, { honeypot: "http://spam.example" })));
        assert.equal(bot.status, 422);
        assert.deepEqual(await bot.json(), { ok: false, error: "rejected" });

        const instant = await route.POST(request(live({}, { startedAt: Date.now() - 200 })));
        assert.deepEqual(await instant.json(), { ok: false, error: "rejected" });

        assert.equal((await route.POST(request("{not json"))).status, 400);
        assert.equal((await route.POST(request({ ...live(), meta: { formId: "x" } }))).status, 400);
        assert.equal((await route.POST(request(live(), { headers: { "content-type": "text/plain" } }))).status, 415);
        assert.equal((await route.POST(request(live(), { headers: { "sec-fetch-site": "cross-site" } }))).status, 403);
        assert.equal((await route.POST(request(live(), { headers: { origin: "https://evil.example" } }))).status, 403);
        assert.equal((await route.POST(request(live({ challenge: "x".repeat(LEAD_LIMITS.bodyBytes + 1) })))).status, 413);

        assert.equal(hook.requests.length, 0, "nothing was forwarded");
      }),
    );
  } finally {
    await hook.close();
  }
});

test("route: 502 when the only sink refuses, and the turned-away lead is logged", async () => {
  const hook = await receiver(() => 500);
  try {
    await withEnv({ LEAD_WEBHOOK_URL: hook.url.href }, () =>
      silence(async (lines) => {
        const res = await route.POST(request(live()));
        assert.equal(res.status, 502);
        assert.deepEqual(await res.json(), { ok: false, error: "delivery_failed" });
        assert.equal(hook.requests.length, 2, "one retry, then give up");
        assert.ok(lines.some((line) => line.includes("delivery failed: lead not accepted")));
        assert.ok(lines.every((line) => !/asha|precisionworks/i.test(line)));
      }),
    );
  } finally {
    await hook.close();
  }
});

test("route: an unusable webhook URL is ignored, not half-used", () =>
  withEnv({ LEAD_WEBHOOK_URL: "http://crm.example/plain-http" }, () =>
    silence(async () => {
      assert.equal(route.GET().status, 503);
      assert.equal((await route.POST(request(live()))).status, 503);
    }),
  ));

test("route: rate limited per IP with Retry-After", async () => {
  const hook = await receiver();
  try {
    await withEnv({ LEAD_WEBHOOK_URL: hook.url.href }, () =>
      silence(async () => {
        const ip = "198.51.100.77";
        const burst = LEAD_RATE_LIMITS[0].max;
        for (let i = 0; i < burst; i++) {
          assert.equal((await route.POST(request(live(), { ip }))).status, 200, `request ${i + 1}`);
        }
        const blocked = await route.POST(request(live(), { ip }));
        assert.equal(blocked.status, 429);
        assert.deepEqual(await blocked.json(), { ok: false, error: "rate_limited" });
        assert.ok(Number(blocked.headers.get("retry-after")) > 0);
        assert.equal((await route.POST(request(live(), { ip: "198.51.100.78" }))).status, 200, "other visitors are unaffected");
        assert.equal(hook.requests.length, burst + 1);
      }),
    );
  } finally {
    await hook.close();
  }
});
