"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import styles from "./Platform.module.css";

export interface TabItem {
  id: string;
  label: string;
  /** Rendered for every tab, so all of it is in the server HTML; the inactive panels are `hidden`. */
  panel: ReactNode;
}

/**
 * An accessible tab set (WAI-ARIA tabs pattern, manual activation is not
 * needed here: the panels are cheap, so focus follows selection).
 *
 * Arrow keys move between tabs and respect right-to-left pages; Home and End
 * jump to the ends. Every panel is rendered on the server, which keeps the
 * content available to search engines and to a browser without JavaScript:
 * with scripting off, the `<noscript>` rule below un-hides them all.
 */
export function Tabs({
  items,
  label,
  name,
  numbered = true,
}: {
  items: TabItem[];
  /** Accessible name of the tab list. */
  label: string;
  /** Names this tab set in analytics (`explorer_select`). */
  name: string;
  numbered?: boolean;
}) {
  const uid = useId();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number, focus = false) {
    setSelected(index);
    if (focus) tabs.current[index]?.focus();
    track("explorer_select", { explorer: name, item: items[index]?.id });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const last = items.length - 1;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + (rtl && event.key === "ArrowRight" ? -1 : 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index + (rtl && event.key === "ArrowLeft" ? 1 : -1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    select(next < 0 ? last : next > last ? 0 : next, true);
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${item.id}`}
            aria-controls={`${uid}-panel-${item.id}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            className={styles.tab}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {numbered && <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${uid}-panel-${item.id}`}
          aria-labelledby={`${uid}-tab-${item.id}`}
          tabIndex={0}
          hidden={index !== selected}
          className={styles.tabPanel}
          data-tabpanel
        >
          {item.panel}
        </div>
      ))}
      <noscript>
        <style>{`[data-tabpanel][hidden]{display:block!important}`}</style>
      </noscript>
    </div>
  );
}
