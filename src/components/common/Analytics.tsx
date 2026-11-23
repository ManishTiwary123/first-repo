"use client";

import { useEffect } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/components/leads/attribution";

/**
 * Site-wide measurement, mounted once by the locale layout.
 *
 * 1. Records where the session came from (attribution.ts), on the first page.
 * 2. Reports clicks on anything carrying `data-track`, so a CTA is measured by
 *    adding an attribute rather than by wiring a handler:
 *      <a data-track="cta_click" data-track-label="Book a Factory Graph demo"
 *         data-track-location="factory-graph-hero" …>
 * 3. Loads Google Analytics 4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * With no measurement ID, no third-party script is requested: events are
 * queued on `window.dataLayer` and dispatched as `savin:analytics` DOM events
 * (lib/analytics.ts), and that is all.
 *
 * BEFORE SETTING THE ID for markets with consent rules (the site resolves
 * /de, /fr, /es, /gb, …): GA4 sets cookies, and the privacy page's cookie
 * section and a consent prompt for those visitors have to exist first.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const VALID_GA_ID = /^G-[A-Z0-9]{4,20}$/;

export function Analytics() {
  useEffect(() => {
    captureAttribution();

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("[data-track]") : null;
      if (!target) return;
      track(target.getAttribute("data-track") || "cta_click", {
        label: target.getAttribute("data-track-label") ?? undefined,
        location: target.getAttribute("data-track-location") ?? undefined,
        page: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID || !VALID_GA_ID.test(GA_ID)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
