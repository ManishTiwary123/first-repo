// lib/leads/config.ts
//
// Reads the lead pipeline's environment and builds its two sinks. All four
// variables are server-only; none may carry a NEXT_PUBLIC_ prefix.
//
//   LEADS_DATABASE_URL    `lead_writer` connection string (Supabase transaction
//                         pooler, port 6543). See supabase/leads-schema.sql.
//   LEAD_WEBHOOK_URL      https endpoint that receives each accepted lead:
//                         the CRM's intake, an automation builder, a chat hook.
//   LEAD_WEBHOOK_SECRET   signs the webhook (lib/leads/notify.ts).
//   LEAD_HASH_SALT        salts the stored IP hash; without it no IP-derived
//                         value is stored at all.
//
// With neither sink set, POST /api/leads answers 503 and the form tells the
// visitor the request was not sent. That is the intended behaviour for a
// deployment that has not been wired up yet, not an error to paper over.
//
// Server-only.

import { createHash } from "node:crypto";
import { normalizeDatabaseUrl } from "@/lib/db-url";
import { createWebhookNotifier, parseWebhookUrl } from "./notify";
import type { LeadNotifier, LeadStore } from "./pipeline";
import { createLeadStore } from "./store";

export interface LeadSinks {
  store?: LeadStore;
  notify?: LeadNotifier;
}

function databaseUrl(): string | null {
  const value = process.env.LEADS_DATABASE_URL?.trim();
  if (!value) return null;
  try {
    // Accepts the same paste slips as DATABASE_URL (quotes, unencoded password).
    return normalizeDatabaseUrl(value, "LEADS_DATABASE_URL");
  } catch {
    return null;
  }
}

function webhookUrl(): URL | null {
  return parseWebhookUrl(process.env.LEAD_WEBHOOK_URL, process.env.NODE_ENV === "production");
}

/** Which sinks are usable. Says nothing about whether they are reachable. */
export function leadSinkStatus(): { database: boolean; webhook: boolean; misconfigured: string[] } {
  const misconfigured: string[] = [];
  const database = databaseUrl() !== null;
  const webhook = webhookUrl() !== null;
  if (process.env.LEADS_DATABASE_URL?.trim() && !database) misconfigured.push("LEADS_DATABASE_URL");
  if (process.env.LEAD_WEBHOOK_URL?.trim() && !webhook) misconfigured.push("LEAD_WEBHOOK_URL");
  return { database, webhook, misconfigured };
}

export function isLeadPipelineConfigured(): boolean {
  const { database, webhook } = leadSinkStatus();
  return database || webhook;
}

export function getLeadSinks(): LeadSinks {
  const sinks: LeadSinks = {};
  const db = databaseUrl();
  if (db) sinks.store = createLeadStore(db);
  const hook = webhookUrl();
  if (hook) {
    sinks.notify = createWebhookNotifier({ url: hook, secret: process.env.LEAD_WEBHOOK_SECRET?.trim() || undefined });
  }
  return sinks;
}

/**
 * A stable, non-reversible handle for an IP, for spotting repeat senders.
 * Unsalted, a hash of an IPv4 address can be reversed by trying all four
 * billion of them, so without LEAD_HASH_SALT nothing is derived or stored.
 */
export function hashIp(ip: string | null): string | null {
  const salt = process.env.LEAD_HASH_SALT?.trim();
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
