// lib/leads/log.ts
//
// Server logs for the lead pipeline. The rule is the Operator's (see
// lib/operator/log.ts): say what failed, never log the payload. A lead is a
// person's name, email, phone and employer; logs go to a drain whose retention
// and access the privacy page does not describe.
//
// Every line starts with LEAD_LOG_PREFIX so a log-drain alert can match on it.
// That alert is the pipeline's error monitoring: there is no Sentry or similar
// in this project, so "delivery failed" must be watched for in the host's logs.
//
// Pure: no imports.

export const LEAD_LOG_PREFIX = "[leads]";

const MAX_MESSAGE = 240;
// Anything that looks like an address is cut, in case a driver or an upstream
// service quotes a row or a request body in its error text.
const EMAIL_LIKE = /[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+/g;
const CONNECTION_STRING = /\b[a-z][a-z0-9+.-]*:\/\/[^\s"']+/gi;

/** `Name: message`, with addresses and URLs (which can embed credentials) removed, capped. */
export function describeLeadError(err: unknown): string {
  if (!(err instanceof Error)) return typeof err === "string" ? "non-Error thrown" : typeof err;
  const code = (err as { code?: unknown }).code;
  const message = err.message.replace(CONNECTION_STRING, "<url>").replace(EMAIL_LIKE, "<email>");
  const text = message.length > MAX_MESSAGE ? `${message.slice(0, MAX_MESSAGE)}…` : message;
  return `${err.name}${typeof code === "string" ? `(${code})` : ""}: ${text}`;
}

export type LeadLogDetail = string | number | boolean | undefined;

function format(context: string, details: Record<string, LeadLogDetail>): string {
  const parts = [LEAD_LOG_PREFIX, context];
  for (const [key, value] of Object.entries(details)) {
    if (value !== undefined) parts.push(`${key}=${value}`);
  }
  return parts.join(" ");
}

/** A failure someone must act on. `details` are identifiers and codes, never visitor text. */
export function logLeadError(context: string, err?: unknown, details: Record<string, LeadLogDetail> = {}): void {
  console.error(format(context, details), err === undefined ? "" : describeLeadError(err));
}

/** An accepted or refused submission, for counting. Reference and codes only. */
export function logLeadEvent(context: string, details: Record<string, LeadLogDetail> = {}): void {
  console.info(format(context, details));
}
