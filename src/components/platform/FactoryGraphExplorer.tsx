"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Boxes,
  Building2,
  ClipboardCheck,
  Cog,
  Cuboid,
  DraftingCompass,
  FlaskConical,
  Handshake,
  Landmark,
  Layers3,
  ListChecks,
  Megaphone,
  Pause,
  Play,
  Plus,
  Radio,
  Route,
  ShoppingCart,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { track } from "@/lib/analytics";
import { DATA_LABEL } from "@/lib/platform/capabilities";
import {
  DOMAIN_LABEL,
  DOMAIN_ORDER,
  GRAPH_CANVAS,
  GRAPH_HUB,
  GRAPH_NODES,
  STORIES,
  getNode,
  storyParticipants,
  type NodeId,
  type StoryId,
} from "@/lib/platform/graph";
import { platformHref } from "@/lib/platform/pages";
import { useMotionAllowed } from "../operator/views/useMotionAllowed";
import styles from "./Platform.module.css";

/**
 * The interactive Factory Graph: seventeen systems around one hub, and three
 * stories told across them.
 *
 * HOW IT IS BUILT, AND WHY
 *
 * - The nodes are real <button>s laid over an SVG of spokes. On a wide screen
 *   they sit at fixed points of the canvas; below 960px the same buttons
 *   reflow into a grouped index and the SVG is dropped. One set of controls
 *   serves mouse, keyboard, touch and screen reader, so there is no separate
 *   "accessible version" to fall out of date.
 * - Every flow passes through the hub, because that is the claim the page
 *   makes: systems do not get wired to each other, they are related through
 *   one layer. A step lights the spoke its data comes in on and the spokes it
 *   goes out on.
 * - Nothing moves until the visitor asks. A story opens on its first step and
 *   advances on Next; Play is offered only when motion is allowed, and stops
 *   at the last step.
 * - With reduced motion the moving dashes are removed by the stylesheet and
 *   Play is not offered. The lit systems, the step text and the panel carry
 *   everything the animation did.
 * - The full text of all three stories is also printed under the graph in a
 *   disclosure, for a reader who prefers a list, for a browser without
 *   JavaScript and for search engines.
 *
 * All of it is illustration, and the label in the top bar says so.
 */

const ICONS: Record<NodeId, LucideIcon> = {
  cad: DraftingCompass,
  cam: Route,
  agents: Bot,
  crm: Users,
  sales: Handshake,
  marketing: Megaphone,
  finance: Landmark,
  erp: Layers3,
  procurement: ShoppingCart,
  suppliers: Building2,
  inventory: Boxes,
  delivery: Truck,
  quality: ClipboardCheck,
  mes: ListChecks,
  cnc: Cog,
  iot: Radio,
  twin: Cuboid,
};

const STEP_MS = 3400;

type Selection = NodeId | "hub" | null;
type NodeVisual = "lit" | "part" | "dim";
type SpokeVisual = "in" | "out" | "lit" | "part" | "dim";

export function FactoryGraphExplorer({ base }: { base: string }) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const modeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const motionAllowed = useMotionAllowed(rootRef);

  const [storyId, setStoryId] = useState<StoryId>("understand");
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<Selection>(null);
  const [playing, setPlaying] = useState(false);

  const story = STORIES.find((s) => s.id === storyId) ?? STORIES[0];
  const step = story.steps[stepIndex] ?? story.steps[0];
  const participants = useMemo(() => new Set(storyParticipants(story)), [story]);
  const lastStep = story.steps.length - 1;

  // Autoplay: one step at a time, only while motion is allowed, never looping.
  useEffect(() => {
    if (!playing) return;
    if (!motionAllowed || stepIndex >= lastStep) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStepIndex((index) => Math.min(lastStep, index + 1)), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, motionAllowed, stepIndex, lastStep]);

  function chooseStory(id: StoryId, focusIndex?: number) {
    setStoryId(id);
    setStepIndex(0);
    setSelected(null);
    setPlaying(false);
    if (focusIndex !== undefined) modeRefs.current[focusIndex]?.focus();
    track("explorer_select", { explorer: "factory-graph-story", item: id });
  }

  function goTo(index: number) {
    setStepIndex(Math.max(0, Math.min(lastStep, index)));
    setSelected(null);
    setPlaying(false);
  }

  function chooseNode(id: Selection) {
    setPlaying(false);
    setSelected((current) => (current === id ? null : id));
    if (id) track("explorer_select", { explorer: "factory-graph-node", item: id });
  }

  function onModeKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const last = STORIES.length - 1;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + (rtl && event.key === "ArrowRight" ? -1 : 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index + (rtl && event.key === "ArrowLeft" ? 1 : -1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    next = next < 0 ? last : next > last ? 0 : next;
    chooseStory(STORIES[next].id, next);
  }

  const inStep = (id: NodeId) => step.nodes.includes(id) || step.from === id || (step.to ?? []).includes(id);
  const nodeVisual = (id: NodeId): NodeVisual => (inStep(id) ? "lit" : participants.has(id) ? "part" : "dim");
  const spokeVisual = (id: NodeId): SpokeVisual => {
    if (step.from === id) return "in";
    if ((step.to ?? []).includes(id)) return "out";
    return nodeVisual(id);
  };

  const node = selected && selected !== "hub" ? getNode(selected) : null;
  const panelId = `${uid}-panel`;

  return (
    <div className={styles.explorer} ref={rootRef}>
      <div className={styles.explorerBar}>
        <div className={styles.modes} role="tablist" aria-label="Story mode">
          {STORIES.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                modeRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-mode-${item.id}`}
              aria-selected={item.id === storyId}
              aria-controls={panelId}
              tabIndex={item.id === storyId ? 0 : -1}
              className={styles.mode}
              onClick={() => chooseStory(item.id)}
              onKeyDown={(event) => onModeKey(event, index)}
            >
              <span>{item.mode}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
        <div className={styles.explorerLabel}>
          <span className={styles.dataLabel} title={DATA_LABEL.illustrative.long}>
            <FlaskConical size={12} aria-hidden="true" />
            {DATA_LABEL.illustrative.short} · {DATA_LABEL.simulated.short}
          </span>
        </div>
      </div>

      <div className={styles.explorerMain} role="tabpanel" id={panelId} aria-labelledby={`${uid}-mode-${storyId}`}>
        <div className={styles.graphWrap}>
          <div className={styles.graph}>
            <svg
              className={styles.edges}
              viewBox={`0 0 ${GRAPH_CANVAS.width} ${GRAPH_CANVAS.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {GRAPH_NODES.map((n) => {
                const d = `M${n.x} ${n.y}L${GRAPH_CANVAS.hub.x} ${GRAPH_CANVAS.hub.y}`;
                const visual = spokeVisual(n.id);
                return (
                  <g key={n.id}>
                    <path className={styles.spoke} d={d} data-state={visual} />
                    {(visual === "in" || visual === "out") && <path className={styles.flow} d={d} data-state={visual} />}
                  </g>
                );
              })}
            </svg>

            <button
              type="button"
              className={styles.hub}
              aria-pressed={selected === "hub"}
              onClick={() => chooseNode("hub")}
            >
              <strong>{GRAPH_HUB.label}</strong>
              <span>{GRAPH_HUB.sub}</span>
            </button>

            {DOMAIN_ORDER.map((domain) => (
              <div key={domain} className={styles.domain}>
                <h3 className={styles.domainLabel}>{DOMAIN_LABEL[domain]}</h3>
                <ul>
                  {GRAPH_NODES.filter((n) => n.domain === domain).map((n) => {
                    const Icon = ICONS[n.id];
                    const tipId = `${uid}-tip-${n.id}`;
                    return (
                      <li
                        key={n.id}
                        className={styles.nodeItem}
                        style={{ "--x": n.x / 10, "--y": n.y / 6 } as CSSProperties}
                      >
                        <button
                          type="button"
                          className={styles.node}
                          data-state={nodeVisual(n.id)}
                          aria-pressed={selected === n.id}
                          aria-describedby={tipId}
                          onClick={() => chooseNode(n.id)}
                        >
                          <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                          <span>{n.label}</span>
                        </button>
                        <span className={styles.tip} id={tipId} role="tooltip" data-side={n.tip}>
                          {n.purpose}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.panel} aria-live={playing ? "off" : "polite"}>
          {selected === "hub" ? (
            <>
              <div className={styles.panelHead}>
                <span className={styles.mono}>The hub</span>
                <h3>{GRAPH_HUB.label}</h3>
                <p>{GRAPH_HUB.purpose}</p>
              </div>
              <div className={styles.panelBody}>
                <dl>
                  <div>
                    <dt>What it holds</dt>
                    <dd>Identities, relationships and events. Not a copy of every record.</dd>
                  </div>
                  <div>
                    <dt>What it does not do</dt>
                    <dd>It does not replace your ERP, your CAD/CAM tools or your machine controllers, and it does not command equipment.</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.panelFoot}>
                <button type="button" className={styles.panelLink} onClick={() => setSelected(null)}>
                  <ArrowLeft size={14} aria-hidden="true" />
                  Back to the story
                </button>
              </div>
            </>
          ) : node ? (
            <>
              <div className={styles.panelHead}>
                <span className={styles.mono}>{DOMAIN_LABEL[node.domain]} · integration detail</span>
                <h3>{node.label}</h3>
                <p>{node.purpose}</p>
              </div>
              <div className={styles.panelBody}>
                <dl>
                  <div>
                    <dt>Typical records</dt>
                    <dd>
                      <ul className={styles.chips}>
                        {node.records.map((record) => (
                          <li key={record}>{record}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Events it raises</dt>
                    <dd>
                      <ul className={styles.chips}>
                        {node.events.map((event) => (
                          <li key={event}>{event}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>How Factory Graph connects</dt>
                    <dd>{node.connects}</dd>
                  </div>
                  <div>
                    <dt>Integration targets</dt>
                    <dd>{node.targets}</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.panelFoot}>
                Targets are examples of what this node can stand for. Each connection is confirmed against your versions,
                licences and access during discovery.
                <br />
                <Link href={`${base}${platformHref(node.link)}`}>
                  Read more
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <br />
                <button type="button" className={styles.panelLink} onClick={() => setSelected(null)}>
                  <ArrowLeft size={14} aria-hidden="true" />
                  Back to the story
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.panelHead}>
                <span className={styles.mono}>
                  {story.mode} · step {stepIndex + 1} of {story.steps.length}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <div className={styles.panelBody}>
                <dl>
                  <div>
                    <dt>Systems involved</dt>
                    <dd>
                      <ul className={styles.chips}>
                        {GRAPH_NODES.filter((n) => inStep(n.id)).map((n) => (
                          <li key={n.id}>{n.label}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Record</dt>
                    <dd>{step.record}</dd>
                  </div>
                  <div>
                    <dt>Event</dt>
                    <dd>{step.event}</dd>
                  </div>
                  <div>
                    <dt>Agent decision</dt>
                    <dd>{step.decision}</dd>
                  </div>
                  <div>
                    <dt>Stays with a person</dt>
                    <dd data-emphasis="">{step.control}</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.panelFoot}>{story.summary} Select any system to see how it connects.</div>
            </>
          )}
        </aside>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => goTo(stepIndex - 1)}
          disabled={stepIndex === 0}
          aria-label="Previous step"
        >
          <ArrowLeft size={15} aria-hidden="true" />
        </button>
        <div className={styles.stepDots}>
          {story.steps.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={styles.stepDot}
              aria-label={`Step ${index + 1}: ${item.title}`}
              aria-current={index === stepIndex ? "step" : undefined}
              data-done={index < stepIndex ? "" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <span className={styles.stepCount}>
          {String(stepIndex + 1).padStart(2, "0")} / {String(story.steps.length).padStart(2, "0")}
        </span>
        {motionAllowed && (
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => {
              if (!playing && stepIndex >= lastStep) setStepIndex(0);
              setSelected(null);
              setPlaying((value) => !value);
            }}
            aria-pressed={playing}
          >
            {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            {playing ? "Pause" : "Play"}
          </button>
        )}
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => goTo(stepIndex + 1)}
          disabled={stepIndex === lastStep}
        >
          Next
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>

      <details className={styles.dataset}>
        <summary>
          Read all three stories as text
          <Plus size={16} aria-hidden="true" />
        </summary>
        <div className={styles.transcript}>
          {STORIES.map((item) => (
            <section key={item.id}>
              <h3>
                {item.mode}: {item.title}
              </h3>
              <p>{item.summary}</p>
              <ol>
                {item.steps.map((s) => (
                  <li key={s.title}>
                    <strong>{s.title}.</strong> {s.body} <em>Record:</em> {s.record}. <em>Event:</em> {s.event}{" "}
                    <em>Agent:</em> {s.decision} <em>Person:</em> {s.control}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </details>
    </div>
  );
}
