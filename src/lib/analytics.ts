// lib/analytics.ts
//
// One function for every measurable event on the site. It works with whatever
// tag is installed and does nothing harmful when none is:
//
//   - gtag.js present (NEXT_PUBLIC_GA_MEASUREMENT_ID set, see
//     components/common/Analytics.tsx)  → gtag("event", name, params)
//   - Google Tag Manager present        → dataLayer.push({ event: name, ...params })
//   - neither                           → the dataLayer entry is still queued, so
//                                         a tag added later sees the session's events
//
// It also dispatches a `savin:analytics` DOM event, which is how the tests and
// any future first-party collector observe events without a vendor script.
//
// NEVER pass personal data here. Events describe what happened (which form,
// which service, which page), not who did it. No name, email, phone, company
// or free text ever goes into an event.
//
// EVENTS IN USE
//   lead_form_start   first interaction with a lead form        { form_id }
//   lead_form_error   a submit that did not go through          { form_id, reason }
//   generate_lead     GA4's recommended conversion event; sent only after
//                     POST /api/leads answered 200               { form_id, service }
//   cta_click         a link or button carrying data-track       { label, location }
//   explorer_select   a choice inside an interactive explainer   { explorer, item }

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const ANALYTICS_EVENT = "savin:analytics";

export function track(event: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    const clean: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) clean[key] = typeof value === "string" ? value.slice(0, 100) : value;
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", event, clean);
    } else {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ event, ...clean });
    }
    window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: { event, params: clean } }));
  } catch {
    // Measurement must never break the page it measures.
  }
}
