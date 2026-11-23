"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FlaskConical, Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { track } from "@/lib/analytics";
import { DATA_LABEL } from "@/lib/platform/capabilities";
import {
  HISTORY_LENGTH,
  STATE_LABEL,
  TWIN_TASK,
  createTwin,
  decideException,
  injectException,
  stateShare,
  stepTwin,
  type MachineState,
  type TwinMachine,
  type TwinState,
} from "@/lib/platform/twin-sim";
import { useMotionAllowed } from "../operator/views/useMotionAllowed";
import styles from "./Platform.module.css";

/**
 * A digital twin of a four-machine cell that does not exist.
 *
 * Every reading comes from lib/platform/twin-sim.ts, a seeded simulation that
 * runs in the visitor's browser. The bar above the cell says "Simulated
 * data", the machines and work orders carry example names, and nothing here
 * is fetched from anywhere. It demonstrates the behaviour the page describes:
 * state from signals, a machine tied to its work order, an exception that
 * becomes a drafted task, and a person deciding what happens to it.
 *
 * The cell advances once a second only while it is on screen, the tab is
 * visible and motion is allowed. Otherwise it stands still and "Advance one
 * reading" steps it by hand, so reduced motion loses no function.
 */

const TICK_MS = 1100;
const SEED = 7;
const LEGEND: MachineState[] = ["running", "idle", "setup", "attention", "planned_stop"];

function Sparkline({ machine }: { machine: TwinMachine }) {
  const width = HISTORY_LENGTH - 1;
  const points = machine.loadHistory.map((load, index) => `${index},${100 - load}`).join(" ");
  const bandLow = Math.max(0, machine.baseLoad - 14);
  return (
    <svg
      className={styles.spark}
      viewBox={`0 0 ${width} 100`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Spindle load trend for ${machine.name} over the last ${machine.loadHistory.length} readings. Latest ${machine.load} percent; expected band ${bandLow} to ${machine.bandHigh} percent.`}
    >
      <rect className={styles.sparkBand} x="0" y={100 - machine.bandHigh} width={width} height={machine.bandHigh - bandLow} />
      <line className={styles.sparkLimit} x1="0" x2={width} y1={100 - machine.bandHigh} y2={100 - machine.bandHigh} />
      <polyline className={styles.sparkLine} points={points} />
    </svg>
  );
}

export function DigitalTwinDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const motionAllowed = useMotionAllowed(rootRef);
  // Deterministic from the seed, so the server HTML and the first client render match.
  const [twin, setTwin] = useState<TwinState>(() => createTwin(SEED));
  const [selectedId, setSelectedId] = useState("vmc-01");
  const [running, setRunning] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "60px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ticking = running && visible && motionAllowed;
  useEffect(() => {
    if (!ticking) return;
    const timer = window.setInterval(() => setTwin((state) => stepTwin(state)), TICK_MS);
    return () => window.clearInterval(timer);
  }, [ticking]);

  const selected = twin.machines.find((m) => m.id === selectedId) ?? twin.machines[0];
  const exception = twin.exception;
  const affected = exception ? twin.machines.find((m) => m.id === exception.machineId) : undefined;
  const share = stateShare(selected);
  const canInject =
    !exception && selected.setupLeft === 0 && selected.workOrder.done < selected.workOrder.target;

  function inject() {
    setTwin((state) => injectException(state, selected.id));
    setRunning(true);
    track("explorer_select", { explorer: "digital-twin", item: "simulate_exception" });
  }

  function decide(decision: "approve" | "dismiss") {
    setTwin((state) => decideException(state, decision));
    track("explorer_select", { explorer: "digital-twin", item: `task_${decision}` });
  }

  return (
    <div className={styles.twin} ref={rootRef}>
      <div className={styles.twinBar}>
        <span className={styles.dataLabel} title={DATA_LABEL.simulated.long}>
          <FlaskConical size={12} aria-hidden="true" />
          {DATA_LABEL.simulated.short} · example cell · not connected to any machine
        </span>
        <div className={styles.twinActions}>
          {motionAllowed && (
            <button type="button" className={styles.btn} onClick={() => setRunning((value) => !value)} aria-pressed={!running}>
              {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {running ? "Pause" : "Resume"}
            </button>
          )}
          <button type="button" className={styles.btn} onClick={() => setTwin((state) => stepTwin(state))}>
            <StepForward size={14} aria-hidden="true" />
            Advance one reading
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnSolid}`} onClick={inject} disabled={!canInject}>
            <AlertTriangle size={14} aria-hidden="true" />
            Simulate an exception on {selected.name}
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setTwin(createTwin(SEED));
              setRunning(true);
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className={styles.twinBody}>
        <div className={styles.machines} role="group" aria-label="Machines in the example cell">
          {twin.machines.map((machine) => (
            <button
              key={machine.id}
              type="button"
              className={styles.machine}
              aria-pressed={machine.id === selected.id}
              onClick={() => {
                setSelectedId(machine.id);
                track("explorer_select", { explorer: "digital-twin", item: machine.id });
              }}
            >
              <span className={styles.machineTop}>
                <strong>{machine.name}</strong>
                <span className={styles.stateChip} data-state={machine.state}>
                  {STATE_LABEL[machine.state]}
                </span>
              </span>
              <span className={styles.machineKind}>{machine.kind}</span>
              <span className={styles.loadRow}>
                <span>Spindle load</span>
                <b>{machine.load}%</b>
              </span>
              <span className={styles.loadBar} data-state={machine.state} aria-hidden="true">
                <i style={{ width: `${machine.load}%` }} />
                <em style={{ insetInlineStart: `${machine.bandHigh}%` }} />
              </span>
              <span className={styles.woRow}>
                <b>{machine.workOrder.id}</b> · {machine.workOrder.done} / {machine.workOrder.target}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.twinDetail}>
          <span className={styles.mono}>Asset · {selected.kind}</span>
          <h3>{selected.name}</h3>
          <div className={styles.sparkWrap}>
            <div className={styles.sparkHead}>
              <span>Spindle load, last {selected.loadHistory.length} readings</span>
              <b>{selected.load}%</b>
            </div>
            <Sparkline machine={selected} />
            <div className={styles.sparkAxis} aria-hidden="true">
              <span>earlier</span>
              <span>dashed line: top of the expected band ({selected.bandHigh}%)</span>
              <span>now</span>
            </div>
          </div>
          <div className={styles.strip} aria-hidden="true">
            {selected.stateHistory.map((state, index) => (
              <i key={index} data-state={state} />
            ))}
          </div>
          <ul className={styles.legend}>
            {LEGEND.map((state) => (
              <li key={state} className={styles.stateChip} data-state={state}>
                {STATE_LABEL[state]} {share[state]}%
              </li>
            ))}
          </ul>
          <dl className={styles.twinFacts}>
            <div>
              <dt>State</dt>
              <dd>{STATE_LABEL[selected.state]}</dd>
            </div>
            <div>
              <dt>Work order</dt>
              <dd>{selected.workOrder.id}</dd>
            </div>
            <div>
              <dt>Part</dt>
              <dd>{selected.workOrder.part}</dd>
            </div>
            <div>
              <dt>Operation</dt>
              <dd>{selected.workOrder.operation}</dd>
            </div>
            <div>
              <dt>Progress</dt>
              <dd>
                {selected.workOrder.done} of {selected.workOrder.target} parts
              </dd>
            </div>
            <div>
              <dt>Program</dt>
              <dd>{selected.program}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.twinSide}>
          <div className={styles.taskCard} data-open={exception?.stage === "detected" ? "" : undefined} role="status">
            {!exception && (
              <>
                <span className={styles.mono}>Alerts and tasks</span>
                <h4>No open exception.</h4>
                <p>
                  Choose a machine that is cutting and press “Simulate an exception” to see how a change in behaviour
                  becomes a drafted task and a decision for a person.
                </p>
              </>
            )}
            {exception?.stage === "building" && (
              <>
                <span className={styles.mono}>Watching {affected?.name}</span>
                <h4>Load is climbing.</h4>
                <p>
                  One high reading is noise. The twin waits for several readings in a row above the expected band before
                  it raises anything.
                </p>
              </>
            )}
            {exception?.stage === "detected" && (
              <>
                <span className={styles.mono}>Draft task · {TWIN_TASK.id} · awaiting approval</span>
                <h4>
                  {TWIN_TASK.title} on {affected?.name}
                </h4>
                <p>
                  Evidence: spindle load above the expected band for {affected?.program}, on work order{" "}
                  {affected?.workOrder.id}. Suggested check: {TWIN_TASK.suggested}
                </p>
                <p>The task is a draft. The machine keeps running until a supervisor decides.</p>
                <div className={styles.taskActions}>
                  <button type="button" className={`${styles.btn} ${styles.btnSolid}`} onClick={() => decide("approve")}>
                    Approve the task
                  </button>
                  <button type="button" className={styles.btn} onClick={() => decide("dismiss")}>
                    Dismiss with a record
                  </button>
                </div>
              </>
            )}
            {exception?.stage === "approved" && (
              <>
                <span className={styles.mono}>{TWIN_TASK.id} · approved</span>
                <h4>{affected?.name} is out of cycle for the check.</h4>
                <p>You approved it, so the stop is a planned one. The work order and the delivery outlook can now be updated from a known state.</p>
              </>
            )}
          </div>
          <div className={styles.log}>
            <h4>Event log (simulated)</h4>
            <ol aria-label="Simulated event log, newest first">
              {[...twin.events].reverse().map((event, index) => (
                <li key={`${event.tick}-${index}`} data-kind={event.kind}>
                  <span>t+{event.tick}</span>
                  {event.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
