import Link from "next/link";
import { Fragment } from "react";
import { AlertTriangle, Eye, Search } from "lucide-react";
import { isExternal, parseInline } from "@/lib/research/text";
import type { ResearchBlock, ResearchStat } from "@/lib/research/types";
import styles from "./Research.module.css";

/**
 * Renders the research text model (lib/research/types.ts). Server components
 * only: every word, table cell and source link is in the HTML a crawler
 * receives.
 */

/** Text with `[anchor](href)` links: sources open in a new tab, site paths stay in the visitor's edition. */
export function RichText({ text, base }: { text: string; base: string }) {
  return (
    <>
      {parseInline(text).map((token, index) => {
        if (token.kind === "text") return <Fragment key={index}>{token.value}</Fragment>;
        if (isExternal(token.href)) {
          return (
            <a key={index} href={token.href} target="_blank" rel="noopener noreferrer">
              {token.value}
            </a>
          );
        }
        return (
          <Link key={index} href={token.href === "/" ? base : `${base}${token.href}`}>
            {token.value}
          </Link>
        );
      })}
    </>
  );
}

const CALLOUT = {
  finding: { label: "Finding", Icon: Search },
  caution: { label: "Caution", Icon: AlertTriangle },
  view: { label: "Our reading", Icon: Eye },
} as const;

export function StatSource({ stat }: { stat: ResearchStat }) {
  return (
    <>
      Source:{" "}
      <a href={stat.source.url} target="_blank" rel="noopener noreferrer">
        {stat.source.label}
      </a>
    </>
  );
}

export function Block({ block, base, id }: { block: ResearchBlock; base: string; id: string }) {
  switch (block.type) {
    case "p":
      return (
        <p className={styles.p}>
          <RichText text={block.text} base={base} />
        </p>
      );
    case "h3":
      return <h3 className={styles.h3}>{block.text}</h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`${styles.list} ${block.ordered ? styles.listOrdered : ""}`}>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} base={base} />
            </li>
          ))}
        </Tag>
      );
    }
    case "table": {
      const captionId = `${id}-caption`;
      return (
        <figure className={styles.figure}>
          {/* The wrapper scrolls on narrow screens; it is focusable so keyboard users can scroll it too. */}
          <div className={styles.tableWrap} role="region" aria-labelledby={captionId} tabIndex={0}>
            <table className={styles.table}>
              <caption id={captionId}>{block.caption}</caption>
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row">
                          <RichText text={cell} base={base} />
                        </th>
                      ) : (
                        <td key={c}>
                          <RichText text={cell} base={base} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && (
            <figcaption className={styles.tableNote}>
              <RichText text={block.note} base={base} />
            </figcaption>
          )}
        </figure>
      );
    }
    case "callout": {
      const { label, Icon } = CALLOUT[block.tone];
      return (
        <aside className={styles.callout} data-tone={block.tone}>
          <span className={styles.calloutLabel}>
            <Icon size={13} aria-hidden="true" />
            {label}
          </span>
          <h3>{block.title}</h3>
          <p>
            <RichText text={block.text} base={base} />
          </p>
        </aside>
      );
    }
    case "stats":
      return (
        <div className={styles.stats}>
          {block.items.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>
                <StatSource stat={stat} />
              </small>
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className={styles.quote}>
          <p>“{block.text}”</p>
          <footer>
            {block.url ? (
              <a href={block.url} target="_blank" rel="noopener noreferrer">
                {block.cite}
              </a>
            ) : (
              block.cite
            )}
          </footer>
        </blockquote>
      );
  }
}
