// lib/leads/spam.ts
//
// Cheap, explainable checks that run before anything is stored or forwarded.
// They are deliberately conservative: each one describes something a person
// filling in the form cannot do by accident, because a rejected human is a
// lost enquiry and the route tells a rejected sender so (it never answers a
// refused submission with a fake success).
//
// Volume is handled elsewhere: rate-limit.ts per IP, and a firewall rule in
// front of the route (see .env.example).
//
// Pure. `now` is passed in so the tests can move time.

import type { LeadInput } from "./schema";

export type SpamReason = "honeypot" | "too_fast" | "clock" | "links";
export type SpamVerdict = { spam: false } | { spam: true; reason: SpamReason };

/**
 * Fastest plausible human fill. The form has eight required fields; a person
 * with autofill still has to choose a service, type a challenge and tick the
 * consent box.
 */
export const MIN_FILL_MS = 3_000;

/** Tolerance for a visitor's clock running ahead of the server's. */
const CLOCK_SKEW_MS = 5 * 60 * 1000;

/** Enquiries describe a factory; they rarely need more than a couple of links. */
const MAX_LINKS_IN_CHALLENGE = 2;

const LINK = /(?:https?:\/\/|www\.)\S+/gi;

export function assessSpam(lead: LeadInput, now: number): SpamVerdict {
  // The honeypot is hidden from sight, from the tab order and from assistive
  // technology, and is marked autocomplete="off".
  if (lead.meta.honeypot.length > 0) return { spam: true, reason: "honeypot" };

  const elapsed = now - lead.meta.startedAt;
  if (elapsed < -CLOCK_SKEW_MS) return { spam: true, reason: "clock" };
  // A small negative value is clock skew, not a time machine: let it through.
  if (elapsed >= 0 && elapsed < MIN_FILL_MS) return { spam: true, reason: "too_fast" };

  // Single-line identity fields never contain a URL.
  for (const value of [lead.name, lead.role, lead.country]) {
    if (/(?:https?:\/\/|www\.)/i.test(value)) return { spam: true, reason: "links" };
  }
  if ((lead.challenge.match(LINK) ?? []).length > MAX_LINKS_IN_CHALLENGE) {
    return { spam: true, reason: "links" };
  }

  return { spam: false };
}
