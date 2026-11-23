// components/leads/attribution.ts
//
// Where a visitor came from, remembered for the length of the browser session
// and attached to the lead they send. Captured on the first page of the
// session (components/common/Analytics.tsx calls this on mount), because by
// the time someone reaches a form the campaign parameters are usually gone
// from the URL.
//
// First touch wins, with one exception: a later page view that carries new
// campaign parameters replaces them, since that click is the more recent
// reason the visitor is here.
//
// Stored in sessionStorage only: it never leaves the browser except inside a
// lead the visitor chooses to send, and it is gone when the tab closes.
// Storage can throw (private windows, blocked site data), so every access is
// guarded and the form works without it.

import type { LeadAttribution } from "@/lib/leads/schema";

const STORAGE_KEY = "savin.attribution.v1";
const MAX = 300;

const PARAMS: ReadonlyArray<[string, keyof LeadAttribution]> = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_term", "utmTerm"],
  ["utm_content", "utmContent"],
  ["gclid", "gclid"],
  ["fbclid", "fbclid"],
  ["msclkid", "msclkid"],
];

function read(): LeadAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : null;
    return value && typeof value === "object" && !Array.isArray(value) ? (value as LeadAttribution) : null;
  } catch {
    return null;
  }
}

function write(value: LeadAttribution): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // No storage: attribution is limited to the page the form is on.
  }
}

/** Origin and path only. A referrer's query string can hold a search term or a token. */
function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const url = new URL(document.referrer);
    if (url.host === window.location.host) return undefined;
    return `${url.origin}${url.pathname}`.slice(0, MAX);
  } catch {
    return undefined;
  }
}

function fromLocation(): LeadAttribution {
  const out: LeadAttribution = {};
  const query = new URLSearchParams(window.location.search);
  for (const [param, key] of PARAMS) {
    const value = query.get(param)?.trim().slice(0, MAX);
    if (value) out[key] = value;
  }
  return out;
}

/** Records the session's attribution if it is not recorded yet, and returns it. */
export function captureAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};
  const campaign = fromLocation();
  const stored = read();

  if (!stored) {
    const first: LeadAttribution = { landingPage: window.location.pathname.slice(0, MAX), ...campaign };
    const referrer = externalReferrer();
    if (referrer) first.referrer = referrer;
    write(first);
    return first;
  }

  if (Object.keys(campaign).length > 0) {
    const next: LeadAttribution = { landingPage: stored.landingPage, referrer: stored.referrer, ...campaign };
    if (!next.landingPage) delete next.landingPage;
    if (!next.referrer) delete next.referrer;
    write(next);
    return next;
  }

  return stored;
}
