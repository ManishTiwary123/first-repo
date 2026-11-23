"use client";

import { useId, useMemo, useState } from "react";
import { FlaskConical, Plus } from "lucide-react";
import { track } from "@/lib/analytics";
import { DATA_LABEL } from "@/lib/platform/capabilities";
import {
  MISSION_DEFAULT,
  MISSION_EXAMPLE,
  MISSION_RANGES,
  evaluateMission,
  type MissionInput,
  type MissionVerdict,
} from "@/lib/platform/mission";
import styles from "./Platform.module.css";

/**
 * "Give your enterprise an objective", as a worked example.
 *
 * The visitor moves three sliders. The nine steps and the answer are
 * recalculated by lib/platform/mission.ts from the example dataset printed at
 * the bottom of the panel, so every number on screen can be traced to an
 * input the visitor can see. There is no model call and no connection to any
 * system behind this: it is arithmetic on constants, and it is labelled as
 * example data at the top.
 *
 * The first render uses the default inputs, on the server and on the client
 * alike, so the answer is in the HTML before any script runs.
 */

const VERDICT_TEXT: Record<MissionVerdict, { title: string; body: string }> = {
  feasible: {
    title: "Yes, within normal shifts.",
    body: "On the example data the batch fits the date and the target cost without overtime or a purchase.",
  },
  conditional: {
    title: "Yes, with conditions.",
    body: "On the example data the date can be met, provided the decisions listed below are approved by the people named.",
  },
  not_feasible: {
    title: "Not as asked.",
    body: "On the example data this quantity cannot be delivered by this date. The plan says so instead of promising it.",
  },
};

const AUDIT_TRAIL = [
  ["read", "ERP", "routing, rates and standard cost for the part"],
  ["read", "CAD / CAM", "revision status and program reference"],
  ["read", "Inventory", "stock on hand and supplier lead time"],
  ["read", "MES / twin", "shift calendar, committed load, recorded availability"],
  ["calc", "Factory Graph", "capacity, material timing and cost per part"],
  ["draft", "Factory Graph", "plan and approval requests; nothing released"],
] as const;

export function MissionDemo() {
  const uid = useId();
  const [input, setInput] = useState<MissionInput>(MISSION_DEFAULT);
  const result = useMemo(() => evaluateMission(input), [input]);
  const data = MISSION_EXAMPLE;
  const currency = data.rates.currency;
  const money = (value: number) => `${currency}${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  const count = (value: number) => value.toLocaleString("en-IN");

  function set(key: keyof MissionInput, value: number) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  const { capacity, material, cost, verdict } = result;
  const verdictText = VERDICT_TEXT[verdict];

  const plan =
    verdict === "feasible"
      ? "Run the batch on normal shifts from stock. Confirm the date with the customer."
      : verdict === "conditional"
        ? "Proceed once the approvals are in. Raise the requisition and the overtime request first, since both have lead time."
        : `Do not promise this date. Offer instead: about ${count(Math.min(capacity.maxParts, result.input.quantity))} parts by the date, or the full quantity with more working days.`;

  return (
    <div className={styles.mission}>
      <div className={styles.missionAsk}>
        <div>
          <span className={styles.dataLabel} title={DATA_LABEL.example.long}>
            <FlaskConical size={12} aria-hidden="true" />
            {DATA_LABEL.example.short} · not from a real plant
          </span>
          <blockquote>
            “Can we produce <b>{count(result.input.quantity)} components</b> in{" "}
            <b>{result.input.workingDays} working days</b> without exceeding{" "}
            <b>{money(result.input.targetUnitCost)} per part</b>?”
          </blockquote>
        </div>
        <div className={styles.controls}>
          <div className={styles.range}>
            <label htmlFor={`${uid}-qty`}>Quantity</label>
            <output htmlFor={`${uid}-qty`}>{count(result.input.quantity)} parts</output>
            <input
              id={`${uid}-qty`}
              type="range"
              {...MISSION_RANGES.quantity}
              value={input.quantity}
              onChange={(event) => set("quantity", Number(event.target.value))}
              onPointerUp={() => track("explorer_select", { explorer: "mission", item: "quantity" })}
            />
          </div>
          <div className={styles.range}>
            <label htmlFor={`${uid}-days`}>Working days until the date</label>
            <output htmlFor={`${uid}-days`}>{result.input.workingDays} days</output>
            <input
              id={`${uid}-days`}
              type="range"
              {...MISSION_RANGES.workingDays}
              value={input.workingDays}
              onChange={(event) => set("workingDays", Number(event.target.value))}
              onPointerUp={() => track("explorer_select", { explorer: "mission", item: "working_days" })}
            />
          </div>
          <div className={styles.range}>
            <label htmlFor={`${uid}-cost`}>Target cost per part</label>
            <output htmlFor={`${uid}-cost`}>{money(result.input.targetUnitCost)}</output>
            <input
              id={`${uid}-cost`}
              type="range"
              {...MISSION_RANGES.targetUnitCost}
              value={input.targetUnitCost}
              onChange={(event) => set("targetUnitCost", Number(event.target.value))}
              onPointerUp={() => track("explorer_select", { explorer: "mission", item: "target_cost" })}
            />
          </div>
        </div>
      </div>

      <div className={styles.missionBody}>
        <ol className={styles.missionSteps}>
          <li>
            <div>
              <h3>Identify the requested outcome</h3>
              <p>
                Deliver <b>{count(result.input.quantity)} parts</b> within <b>{result.input.workingDays} working days</b>,
                at or under <b>{money(result.input.targetUnitCost)}</b> each.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>
                Resolve the context<small>CRM · ERP</small>
              </h3>
              <p>
                Part <b>{data.part.number}</b> ({data.part.name}), revision {data.part.revision}. One machining
                operation, {data.routing.capableMachines} machines qualified to run it.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>
                Check the engineering revision<small>CAD · CAM</small>
              </h3>
              <p>{result.engineering.note}</p>
            </div>
          </li>
          <li>
            <div>
              <h3>
                Query inventory and capacity<small>ERP · MES · Twin</small>
              </h3>
              <p>
                Material on hand for <b>{count(data.material.onHandParts)} parts</b>. Normal shifts give{" "}
                <b>{capacity.regularHours} machine hours</b> before the date; overtime could add{" "}
                <b>{capacity.overtimeAvailableHours}</b>.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>Calculate feasibility from the source data</h3>
              <p>
                The batch needs <b>{capacity.requiredHours} machine hours</b>, setup included. Normal shifts cover about{" "}
                <b>{count(capacity.regularParts)} parts</b>; with overtime, up to <b>{count(capacity.maxParts)}</b>.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>Identify the constraints</h3>
              {result.constraints.length === 0 ? (
                <p>None found in the example data.</p>
              ) : (
                result.constraints.map((constraint) => <p key={constraint}>{constraint}</p>)
              )}
            </div>
          </li>
          <li>
            <div>
              <h3>Prepare a recommended plan</h3>
              <p>{plan}</p>
            </div>
          </li>
          <li>
            <div>
              <h3>Flag what needs human approval</h3>
              <p>
                {result.approvals.length === 0 ? (
                  "Nothing can be approved until the constraints above are resolved."
                ) : (
                  <>
                    <b>
                      {result.approvals.length} {result.approvals.length === 1 ? "decision" : "decisions"}
                    </b>{" "}
                    wait for a named person. Nothing is ordered, scheduled or promised before then.
                  </>
                )}
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>Record the execution and audit timeline</h3>
              <p>
                {material.shortfallParts > 0 && material.arrivesInTime
                  ? `Stock runs out on working day ${material.runsOutOnDay}; the balance for ${count(material.shortfallParts)} parts is due on day ${data.material.supplierLeadDays}. `
                  : ""}
                Each read, calculation and draft is logged with its source, as listed on the right.
              </p>
            </div>
          </li>
        </ol>

        <div className={styles.missionSide}>
          <div className={styles.verdict} data-verdict={verdict} role="status">
            <span className={styles.mono}>Answer on the example data</span>
            <h3>{verdictText.title}</h3>
            <p>{verdictText.body}</p>
          </div>
          {result.approvals.length > 0 && (
            <div className={styles.sideBlock}>
              <h4>Needs a person&apos;s approval</h4>
              <ul>
                {result.approvals.map((approval) => (
                  <li key={approval}>{approval}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.sideBlock}>
            <h4>Cost per part</h4>
            <table>
              <tbody>
                <tr>
                  <td>Material</td>
                  <td>{money(cost.material)}</td>
                </tr>
                <tr>
                  <td>Machining</td>
                  <td>{money(cost.machining)}</td>
                </tr>
                <tr>
                  <td>Setup share</td>
                  <td>{money(cost.setup)}</td>
                </tr>
                <tr>
                  <td>Overtime premium</td>
                  <td>{money(cost.overtime)}</td>
                </tr>
                <tr>
                  <td>Estimate {cost.withinTarget ? "(within target)" : "(over target)"}</td>
                  <td>{money(cost.unit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.sideBlock}>
            <h4>Audit trail (example)</h4>
            <ul>
              {AUDIT_TRAIL.map(([verb, source, what]) => (
                <li key={what}>
                  <b>{verb}</b> · {source} · {what}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <details className={styles.dataset}>
        <summary>
          See the example dataset every figure above is calculated from
          <Plus size={16} aria-hidden="true" />
        </summary>
        <div className={styles.datasetGrid}>
          <div>
            <h4>Part</h4>
            <ul>
              <li>
                {data.part.number}, {data.part.name}
              </li>
              <li>
                Revision {data.part.revision}: {data.part.revisionStatus}
              </li>
              <li>
                Program {data.part.programRef}, approved for revision {data.part.programForRevision}
              </li>
            </ul>
          </div>
          <div>
            <h4>Routing</h4>
            <ul>
              <li>{data.routing.cycleMinutes} minutes per part</li>
              <li>{data.routing.capableMachines} capable machines</li>
              <li>{data.routing.setupHours} hours setup for the batch</li>
            </ul>
          </div>
          <div>
            <h4>Calendar</h4>
            <ul>
              <li>
                {data.calendar.shiftsPerDay} shifts of {data.calendar.productiveHoursPerShift} productive hours
              </li>
              <li>{Math.round(data.calendar.availability * 100)}% recorded availability</li>
              <li>{Math.round(data.calendar.committedLoad * 100)}% already committed to other orders</li>
              <li>Up to {data.calendar.overtimeHoursPerDay} overtime hours per machine per day</li>
            </ul>
          </div>
          <div>
            <h4>Material and rates</h4>
            <ul>
              <li>Stock for {count(data.material.onHandParts)} parts</li>
              <li>{data.material.supplierLeadDays} working days supplier lead time</li>
              <li>{money(data.material.unitCost)} material per part</li>
              <li>
                {money(data.rates.machineHour)} per machine hour, {Math.round(data.rates.overtimePremium * 100)}%
                overtime premium
              </li>
            </ul>
          </div>
        </div>
        <p className={styles.dataNote}>
          {DATA_LABEL.example.long} In a deployment the same questions are answered from your ERP, MES and inventory
          through read-only connections, and the plan still stops for approval.
        </p>
      </details>
    </div>
  );
}
