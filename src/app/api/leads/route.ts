// app/api/leads/route.ts
//
// The site's enquiry endpoint. Every form on the site posts here:
//
//   POST /api/leads   (root-absolute: a /{country}/{locale} prefix would send
//                      it through the middleware as a page and 404)
//
// Body: JSON, the fields of lib/leads/schema.ts plus `meta`.
//
// Responses are always JSON and never cached:
//   200 { ok: true, reference }                 stored and/or delivered
//   400 { ok: false, error: "bad_request" }     not JSON / malformed meta
//   403 { ok: false, error: "forbidden" }       sent from another site
//   413 { ok: false, error: "too_large" }
//   415 { ok: false, error: "unsupported" }     not application/json
//   422 { ok: false, error: "validation", fields }
//   422 { ok: false, error: "rejected" }        failed an anti-spam check
//   429 { ok: false, error: "rate_limited" }    + Retry-After
//   502 { ok: false, error: "delivery_failed" } every configured sink failed
//   503 { ok: false, error: "unavailable" }     no sink is configured
//
// A 2xx is sent only after a sink has taken the lead (lib/leads/pipeline.ts).
// On 502 and 503 the form tells the visitor the request was NOT sent and
// offers WhatsApp and email instead.
//
// GET /api/leads answers 204 when a sink is configured and 503 when none is,
// for an uptime check. It never touches the database.
//
// Configuration: LEADS_DATABASE_URL and/or LEAD_WEBHOOK_URL (lib/leads/
// config.ts, .env.example). The in-memory rate limit is per instance; add a
// firewall rate-limit rule on /api/leads as the shared ceiling.

import { ipAddress } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";
import { getLeadSinks, hashIp, isLeadPipelineConfigured, leadSinkStatus } from "@/lib/leads/config";
import { isCrossSite, isJsonContentType, readBodyCapped } from "@/lib/leads/http";
import { logLeadError, logLeadEvent } from "@/lib/leads/log";
import { processLead, type LeadClientContext } from "@/lib/leads/pipeline";
import { LEAD_RATE_LIMITS, createRateLimiter } from "@/lib/leads/rate-limit";
import { LEAD_LIMITS, type LeadFieldErrors } from "@/lib/leads/schema";

// Node, not edge: postgres.js and node:crypto.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// One database call (8 s budget) and at most two webhook attempts (6 s each).
export const maxDuration = 30;

type LeadErrorCode =
  | "bad_request"
  | "forbidden"
  | "too_large"
  | "unsupported"
  | "validation"
  | "rejected"
  | "rate_limited"
  | "delivery_failed"
  | "unavailable";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(
  status: number,
  error: LeadErrorCode,
  extra: { fields?: LeadFieldErrors; headers?: Record<string, string> } = {},
) {
  return NextResponse.json(
    { ok: false, error, ...(extra.fields ? { fields: extra.fields } : {}) },
    { status, headers: { ...NO_STORE, ...extra.headers } },
  );
}

const checkRateLimit = createRateLimiter(LEAD_RATE_LIMITS);

function clientIp(req: NextRequest): string | null {
  return ipAddress(req) ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

let warnedMisconfigured = false;

export function GET() {
  return new NextResponse(null, { status: isLeadPipelineConfigured() ? 204 : 503, headers: NO_STORE });
}

export async function POST(req: NextRequest) {
  if (isCrossSite(req.headers)) return fail(403, "forbidden");
  if (!isJsonContentType(req.headers.get("content-type"))) return fail(415, "unsupported");

  const ip = clientIp(req);
  const limit = checkRateLimit(ip ?? "anon", Date.now());
  if (!limit.ok) {
    return fail(429, "rate_limited", { headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  const text = await readBodyCapped(req.body, LEAD_LIMITS.bodyBytes).catch(() => null);
  if (text === null) return fail(413, "too_large");

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return fail(400, "bad_request");
  }

  const status = leadSinkStatus();
  if (status.misconfigured.length > 0 && !warnedMisconfigured) {
    warnedMisconfigured = true;
    // Names only: the values may be credentials.
    logLeadError("ignored an unusable setting", undefined, { settings: status.misconfigured.join(",") });
  }

  const client: LeadClientContext = {
    ipHash: hashIp(ip),
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    geoCountry: req.headers.get("x-vercel-ip-country")?.slice(0, 2).toUpperCase() ?? null,
  };

  const outcome = await processLead(raw, client, {
    now: () => new Date(),
    ...getLeadSinks(),
    logError: logLeadError,
  });

  switch (outcome.status) {
    case "invalid":
      return outcome.malformed ? fail(400, "bad_request") : fail(422, "validation", { fields: outcome.fields });
    case "rejected":
      logLeadEvent("rejected", { reason: outcome.reason });
      return fail(422, "rejected");
    case "not_configured":
      logLeadError("no sink configured: set LEADS_DATABASE_URL or LEAD_WEBHOOK_URL");
      return fail(503, "unavailable");
    case "failed":
      // The sinks' own failures were logged by the pipeline; this line is the
      // one to alert on, because it means a lead was turned away.
      logLeadError("delivery failed: lead not accepted", undefined, { reference: outcome.reference });
      return fail(502, "delivery_failed");
    case "accepted":
      logLeadEvent("accepted", {
        reference: outcome.reference,
        service: outcome.service,
        category: outcome.category,
        database: outcome.delivered.database,
        webhook: outcome.delivered.webhook,
        duplicate: outcome.duplicate,
        replay: outcome.replay,
      });
      // `duplicate` stays server-side: echoing it would tell a caller whether
      // an email address has enquired before.
      return NextResponse.json({ ok: true, reference: outcome.reference }, { status: 200, headers: NO_STORE });
  }
}
