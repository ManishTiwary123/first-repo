"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import home from "../home/IndustrialHome.module.css";
import styles from "./Platform.module.css";

/**
 * Root of every Factory Graph page.
 *
 * It is the page's motion switch, built the same way as HomeMotion and
 * ServicesMotion so the three behave alike: `data-motion` on the root is
 * "paused" when the visitor asks for reduced motion, presses the pause
 * control, or leaves the tab, and the stylesheet stops every loop under it.
 * Sections marked `data-scene` also stop while they are off screen.
 *
 * Nothing is hidden when motion is off. The server HTML is complete, and each
 * interactive example reads the same switch (useMotionAllowed) to decide only
 * whether it may advance by itself.
 *
 * `contentLang` is set when the page's language differs from the URL's
 * locale (the body is English on every locale for now), so assistive
 * technology reads it with the right voice and an RTL locale does not mirror
 * left-to-right technical diagrams.
 */
export function PlatformShell({ children, contentLang }: { children: ReactNode; contentLang?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [background, setBackground] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    const syncVisibility = () => setBackground(document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting);
      },
      { rootMargin: "80px" },
    );
    root.current?.querySelectorAll("[data-scene]").forEach((scene) => observer.observe(scene));

    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  const stopped = paused || reduced;
  return (
    <div
      ref={root}
      className={`${home.root} ${styles.root}`}
      data-motion={stopped || background ? "paused" : "running"}
      lang={contentLang}
      dir={contentLang ? "ltr" : undefined}
    >
      {children}
      <button
        type="button"
        className={home.motionControl}
        onClick={() => setPaused((value) => !value)}
        aria-pressed={stopped}
        aria-label={reduced ? "Motion reduced by your device preference" : paused ? "Resume diagram motion" : "Pause diagram motion"}
        disabled={reduced}
      >
        {stopped ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
        <span>{reduced ? "Reduced motion" : paused ? "Motion paused" : "Pause motion"}</span>
      </button>
    </div>
  );
}
