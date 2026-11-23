// lib/leads/pipeline.ts
//
// One enquiry, start to finish:
//
//   validate → anti-spam → triage → store (database) → notify (webhook) → outcome
//
// THE RULE THIS FILE EXISTS TO ENFORCE. A visitor is told "received" only when
// at least one durable sink has actually taken the lead: the database row was
// written, or the webhook receiver answered 2xx. If neither is configured the
// outcome is `not_configured`; if every configured sink failed it is `failed`.
// The form then says so and offers WhatsApp and email with the visitor's text
// carried over. Nothing in this pipeline reports a success it did not see.
//
// RETRY SAFETY. The browser sends one idempotency key per submission and
// reuses it on every retry. The database function returns the row it already
// wrote for that key (`replay: true`), in which case the webhook is not sent
// again; the key also travels in the webhook's headers so a receiver that was
// reached twice can drop the second copy.
//
// Server-only (node:crypto). The sinks are injected, so `node --test` drives
// every branch without a database or a network (scripts/leads.test.mjs).

import { createHash } from "node:crypto";
import { triageLead, type EmailKind, type LeadCategory, type LeadPriority } from "./categorize";
import {
  CONSENT_TEXT,
  CONSENT_VERSION,
  MARKETING_CONSENT_TEXT,
  validateLead,
  type LeadAttribution,
  type LeadConnectivityId,
  type LeadFieldErrors,
  type LeadInput,
  type LeadScaleId,
  type LeadServiceId,
} from "./schema";
import { assessSpam, type SpamReason } from "./spam";

/* -------------------------------------------------------------------------- */
/*                                   Record                                   */
/* -------------------------------------------------------------------------- */

/** What the request itself tells us. Nothing here is typed by the visitor. */
export interface LeadClientContext {
  /** Salted hash of the IP; null when no salt is configured (see route.ts). */
  ipHash: string | null;
  userAgent: string | null;
  /** Two-letter country from the host's geo header, when present. */
  geoCountry: string | null;
}

/** The stored row and the webhook payload share this one shape. */
export interface LeadRecord {
  reference: string;
  idempotencyKey: string;
  receivedAt: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  role: string;
  country: string;
  industry: string;
  scale: LeadScaleId | null;
  erpCrm: string | null;
  cadCam: string | null;
  connectivity: LeadConnectivityId | null;
  challenge: string;
  service: LeadServiceId;
  serviceLabel: string;
  category: LeadCategory;
  priority: LeadPriority;
  score: number;
  emailKind: EmailKind;
  consent: {
    contact: true;
    marketing: boolean;
    /** Exactly what the visitor agreed to, kept with the lead. */
    text: string;
    marketingText: string | null;
    version: string;
    at: string;
  };
  followUp: { title: string; dueOn: string };
  source: { formId: string; pagePath: string; locale: string; market: string } & LeadAttribution;
  client: LeadClientContext;
}

// Crockford base32: no I, L, O or U, so a reference read out over the phone
// cannot be mis-heard as a digit.
const REFERENCE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * A short reference the visitor can quote, derived from the idempotency key
 * so a retried submission shows the same one whichever sink answered.
 */
export function leadReference(idempotencyKey: string): string {
  const digest = createHash("sha256").update(`lead:${idempotencyKey}`).digest();
  let out = "";
  for (let i = 0; i < 8; i++) out += REFERENCE_ALPHABET[digest[i] % 32];
  return `SG-${out.slice(0, 4)}-${out.slice(4)}`;
}

export function buildLeadRecord(lead: LeadInput, client: LeadClientContext, now: Date): LeadRecord {
  const triage = triageLead(lead, now);
  const at = now.toISOString();
  return {
    reference: leadReference(lead.meta.idempotencyKey),
    idempotencyKey: lead.meta.idempotencyKey,
    receivedAt: at,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    role: lead.role,
    country: lead.country,
    industry: lead.industry,
    scale: lead.scale,
    erpCrm: lead.erpCrm,
    cadCam: lead.cadCam,
    connectivity: lead.connectivity,
    challenge: lead.challenge,
    service: lead.service,
    serviceLabel: triage.serviceLabel,
    category: triage.category,
    priority: triage.priority,
    score: triage.score,
    emailKind: triage.emailKind,
    consent: {
      contact: true,
      marketing: lead.consentMarketing,
      text: CONSENT_TEXT,
      marketingText: lead.consentMarketing ? MARKETING_CONSENT_TEXT : null,
      version: CONSENT_VERSION,
      at,
    },
    followUp: triage.followUp,
    source: {
      formId: lead.meta.formId,
      pagePath: lead.meta.pagePath,
      locale: lead.meta.locale,
      market: lead.meta.market,
      ...lead.meta.attribution,
    },
    client,
  };
}

/* -------------------------------------------------------------------------- */
/*                                    Sinks                                   */
/* -------------------------------------------------------------------------- */

export interface StoreResult {
  id: string;
  reference: string;
  /** The same email enquired in the last 30 days; this row points at that one. */
  duplicate: boolean;
  /** This idempotency key was already stored; nothing new was written. */
  replay: boolean;
}

export interface LeadEvent {
  event: "lead.created";
  version: 1;
  sentAt: string;
  lead: LeadRecord & { id: string | null; duplicate: boolean };
}

/** Throws when the lead was not stored. */
export type LeadStore = (record: LeadRecord) => Promise<StoreResult>;
/** Throws when the receiver did not accept the event. */
export type LeadNotifier = (event: LeadEvent) => Promise<void>;

export interface LeadDeps {
  now: () => Date;
  /** `undefined` = no database configured. */
  store?: LeadStore;
  /** `undefined` = no webhook configured. */
  notify?: LeadNotifier;
  logError: (context: string, err?: unknown, details?: Record<string, string | number | boolean | undefined>) => void;
}

export type LeadOutcome =
  | { status: "invalid"; fields: LeadFieldErrors; malformed: boolean }
  | { status: "rejected"; reason: SpamReason }
  | { status: "not_configured" }
  | { status: "failed"; reference: string }
  | {
      status: "accepted";
      reference: string;
      duplicate: boolean;
      replay: boolean;
      delivered: { database: boolean; webhook: boolean };
      category: LeadCategory;
      service: LeadServiceId;
    };

/* -------------------------------------------------------------------------- */
/*                                  Pipeline                                  */
/* -------------------------------------------------------------------------- */

export async function processLead(raw: unknown, client: LeadClientContext, deps: LeadDeps): Promise<LeadOutcome> {
  const validation = validateLead(raw);
  if (!validation.ok) {
    return { status: "invalid", fields: validation.fields, malformed: validation.meta };
  }
  const lead = validation.lead;
  const now = deps.now();

  const verdict = assessSpam(lead, now.getTime());
  if (verdict.spam) return { status: "rejected", reason: verdict.reason };

  if (!deps.store && !deps.notify) return { status: "not_configured" };

  const record = buildLeadRecord(lead, client, now);

  let stored: StoreResult | null = null;
  if (deps.store) {
    try {
      stored = await deps.store(record);
    } catch (err) {
      deps.logError("store failed", err, { reference: record.reference });
    }
  }

  // The database's reference wins: for a replay it is the one the visitor was
  // already shown.
  const reference = stored?.reference ?? record.reference;
  const replay = stored?.replay ?? false;

  let notified = false;
  if (deps.notify && !replay) {
    try {
      await deps.notify({
        event: "lead.created",
        version: 1,
        sentAt: now.toISOString(),
        lead: { ...record, reference, id: stored?.id ?? null, duplicate: stored?.duplicate ?? false },
      });
      notified = true;
    } catch (err) {
      // With the row stored this is a notification gap, not a lost lead; with
      // nothing stored it is the failure reported below. Both must alert.
      deps.logError(stored ? "notify failed after store" : "notify failed", err, { reference });
    }
  }

  if (!stored && !notified) return { status: "failed", reference };

  return {
    status: "accepted",
    reference,
    duplicate: stored?.duplicate ?? false,
    replay,
    delivered: { database: stored !== null, webhook: notified },
    category: record.category,
    service: record.service,
  };
}
