// lib/leads/notify.ts
//
// The outbound half of the lead pipeline: one signed JSON POST per accepted
// enquiry to LEAD_WEBHOOK_URL. That URL is the integration point for whatever
// should hear about a lead first: the CRM's intake endpoint, an automation
// builder (n8n, Make, Zapier), or a chat channel's incoming webhook. This
// site holds no CRM credentials and calls no CRM API directly; the receiver
// owns that.
//
// Every request carries:
//   X-Savin-Event            lead.created
//   X-Savin-Idempotency-Key  the submission's key; drop repeats of it
//   X-Savin-Timestamp        epoch seconds at send time
//   X-Savin-Signature        sha256=<hex HMAC-SHA256 of `${timestamp}.${body}`>
//                            (only when LEAD_WEBHOOK_SECRET is set)
//
// A receiver verifies the signature over the raw body and rejects a timestamp
// more than a few minutes old, which makes a captured request useless.
//
// Server-only (node:crypto). `fetchImpl` is injectable for the tests.

import { createHmac } from "node:crypto";
import type { LeadEvent, LeadNotifier } from "./pipeline";

/** One attempt's budget. Two attempts plus the pause must fit the route's maxDuration. */
const ATTEMPT_TIMEOUT_MS = 6_000;
const RETRY_PAUSE_MS = 400;
const MAX_ATTEMPTS = 2;

export class WebhookError extends Error {
  readonly status: number | null;
  constructor(message: string, status: number | null) {
    super(message);
    this.name = "WebhookError";
    this.status = status;
  }
}

export function signWebhook(secret: string, timestamp: string, body: string): string {
  return `sha256=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
}

/**
 * Only https, except loopback outside production so the tests and a local
 * receiver work. A plain-http receiver would put a lead's contact details on
 * the wire in clear text.
 */
export function parseWebhookUrl(value: string | undefined, production: boolean): URL | null {
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (url.protocol === "https:") return url;
  const loopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
  return url.protocol === "http:" && loopback && !production ? url : null;
}

function isRetryable(status: number | null): boolean {
  return status === null || status === 408 || status === 425 || status === 429 || status >= 500;
}

export interface WebhookOptions {
  url: URL;
  secret?: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
  /** Test hook; production uses the constants above. */
  retryPauseMs?: number;
}

export function createWebhookNotifier({
  url,
  secret,
  fetchImpl = fetch,
  now = Date.now,
  retryPauseMs = RETRY_PAUSE_MS,
}: WebhookOptions): LeadNotifier {
  return async function notify(event: LeadEvent): Promise<void> {
    const body = JSON.stringify(event);
    let lastError: WebhookError = new WebhookError("webhook not attempted", null);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      // Signed per attempt, so a retry is not rejected for a stale timestamp.
      const timestamp = String(Math.floor(now() / 1000));
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "SavinGroup-Leads/1",
        "X-Savin-Event": event.event,
        "X-Savin-Idempotency-Key": event.lead.idempotencyKey,
        "X-Savin-Timestamp": timestamp,
      };
      if (secret) headers["X-Savin-Signature"] = signWebhook(secret, timestamp, body);

      let status: number | null = null;
      try {
        const res = await fetchImpl(url, {
          method: "POST",
          headers,
          body,
          // Never follow a redirect with a lead in the body: the new location
          // was not the one configured.
          redirect: "error",
          signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        });
        status = res.status;
        // The body is not needed; drain it so the connection can be reused.
        await res.arrayBuffer().catch(() => undefined);
        if (res.ok) return;
        lastError = new WebhookError(`receiver answered ${res.status}`, res.status);
      } catch (err) {
        // The cause's message can quote the URL, which may carry a token in
        // its path; keep only the error's name.
        lastError = new WebhookError(`request failed (${err instanceof Error ? err.name : "unknown"})`, null);
      }

      if (attempt < MAX_ATTEMPTS && isRetryable(status)) {
        await new Promise((resolve) => setTimeout(resolve, retryPauseMs));
        continue;
      }
      break;
    }

    throw lastError;
  };
}
