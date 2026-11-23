// lib/platform/twin-sim.ts
//
// The simulated machine cell behind the digital-twin demonstration.
//
// EVERYTHING HERE IS SIMULATED. The four machines, their work orders and
// every reading are produced by the functions below from a seeded random
// number generator, in the visitor's browser. Nothing is fetched, nothing is
// connected, and no name or number comes from a customer. The page says so
// beside the demonstration (lib/platform/capabilities.ts → DATA_LABEL).
//
// The demonstration also never "controls" its pretend machines on its own:
// the one thing that changes a machine's course is the visitor approving the
// drafted maintenance task, which is the behaviour the page is describing.
//
// The state is a plain value and every function returns a new one, so the
// same seed and the same actions always give the same cell. That is what lets
// scripts/platform.test.mjs test it, and what keeps the server render and the
// first client render identical.
//
// Pure: no imports.

export type MachineState = "running" | "idle" | "setup" | "attention" | "planned_stop";

export const STATE_LABEL: Record<MachineState, string> = {
  running: "Running",
  idle: "Idle",
  setup: "In setup",
  attention: "Needs attention",
  planned_stop: "Planned stop",
};

/** Readings kept per machine for the trend line. */
export const HISTORY_LENGTH = 48;

/** Upper edge of the load band this example treats as normal, per machine. */
const BAND_MARGIN = 14;
/** Consecutive readings above the band before the twin calls it a pattern. */
const SUSTAIN_TICKS = 4;

export interface TwinMachine {
  id: string;
  name: string;
  kind: string;
  state: MachineState;
  /** Spindle load, percent. */
  load: number;
  /** Typical load for the program it is running. */
  baseLoad: number;
  /** Upper edge of the expected band. */
  bandHigh: number;
  program: string;
  workOrder: { id: string; part: string; operation: string; target: number; done: number };
  loadHistory: number[];
  stateHistory: MachineState[];
  /** Ticks into the current part's cycle. */
  cycleTick: number;
  cycleLength: number;
  /** Ticks of setup left. */
  setupLeft: number;
  /** Consecutive readings above the band. */
  aboveBand: number;
}

export type TwinEventKind = "state" | "alert" | "task" | "decision" | "info";

export interface TwinEvent {
  tick: number;
  machineId: string;
  kind: TwinEventKind;
  text: string;
}

export type ExceptionStage = "building" | "detected" | "approved" | "dismissed";

export interface TwinException {
  machineId: string;
  stage: ExceptionStage;
  startedAt: number;
  /** Ticks left in the planned stop after approval. */
  stopLeft: number;
}

export interface TwinState {
  tick: number;
  /** Generator state; advances with every reading. */
  rng: number;
  machines: TwinMachine[];
  events: TwinEvent[];
  exception: TwinException | null;
}

export const TWIN_TASK = {
  id: "MT-EX-0031",
  title: "Check tool wear and spindle load",
  suggested: "Inspect the active tool, compare with tool-life count, and review the last three parts.",
} as const;

/* -------------------------------------------------------------------------- */
/*                                 Randomness                                 */
/* -------------------------------------------------------------------------- */

/** mulberry32: one 32-bit state in, a value in [0, 1) and the next state out. */
function nextRandom(state: number): [number, number] {
  const next = (state + 0x6d2b79f5) | 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

function clampLoad(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Events kept for the log. */
const MAX_EVENTS = 40;

function withEvent(events: TwinEvent[], event: TwinEvent): TwinEvent[] {
  return [...events, event].slice(-MAX_EVENTS);
}

function push<T>(list: T[], value: T): T[] {
  const next = [...list, value];
  return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
}

/* -------------------------------------------------------------------------- */
/*                                   Set-up                                   */
/* -------------------------------------------------------------------------- */

interface Blueprint {
  id: string;
  name: string;
  kind: string;
  baseLoad: number;
  program: string;
  workOrder: TwinMachine["workOrder"];
  cycleLength: number;
  setupLeft: number;
}

const BLUEPRINTS: readonly Blueprint[] = [
  {
    id: "vmc-01", name: "VMC-01", kind: "Vertical machining centre", baseLoad: 46, program: "O2041",
    workOrder: { id: "WO-EX-1042", part: "BRK-204 Rev C", operation: "Op 20 · Mill profile", target: 240, done: 96 },
    cycleLength: 9, setupLeft: 0,
  },
  {
    id: "vmc-02", name: "VMC-02", kind: "Vertical machining centre", baseLoad: 58, program: "O3310",
    workOrder: { id: "WO-EX-1047", part: "HSG-118 Rev B", operation: "Op 10 · Rough pocket", target: 120, done: 41 },
    cycleLength: 12, setupLeft: 0,
  },
  {
    id: "tc-03", name: "TC-03", kind: "Turning centre", baseLoad: 39, program: "O1187",
    workOrder: { id: "WO-EX-1039", part: "SHF-077 Rev A", operation: "Op 10 · Turn OD", target: 400, done: 283 },
    cycleLength: 6, setupLeft: 0,
  },
  {
    id: "vmc-04", name: "VMC-04", kind: "Vertical machining centre", baseLoad: 51, program: "O2290",
    workOrder: { id: "WO-EX-1051", part: "PLT-352 Rev D", operation: "Op 10 · Face and drill", target: 180, done: 0 },
    // Longer than the warm-up below, so one machine is still in setup when the
    // demonstration opens and the cell shows more than one state.
    cycleLength: 10, setupLeft: HISTORY_LENGTH + 16,
  },
];

export function createTwin(seed = 7): TwinState {
  const machines: TwinMachine[] = BLUEPRINTS.map((b) => ({
    id: b.id,
    name: b.name,
    kind: b.kind,
    state: b.setupLeft > 0 ? "setup" : "running",
    load: b.setupLeft > 0 ? 0 : b.baseLoad,
    baseLoad: b.baseLoad,
    bandHigh: b.baseLoad + BAND_MARGIN,
    program: b.program,
    workOrder: { ...b.workOrder },
    loadHistory: [],
    stateHistory: [],
    cycleTick: 0,
    cycleLength: b.cycleLength,
    setupLeft: b.setupLeft,
    aboveBand: 0,
  }));

  let state: TwinState = { tick: 0, rng: seed | 0, machines, events: [], exception: null };
  // Run in the background first so the trend lines are full on first paint,
  // then drop the events that warm-up produced: the log starts at "now".
  for (let i = 0; i < HISTORY_LENGTH; i++) state = stepTwin(state);
  return {
    ...state,
    tick: 0,
    events: [{ tick: 0, machineId: "", kind: "info", text: "Simulation started. Four example machines, example work orders." }],
  };
}

/* -------------------------------------------------------------------------- */
/*                                    Step                                    */
/* -------------------------------------------------------------------------- */

function stepMachine(
  machine: TwinMachine,
  random: number,
  exception: TwinException | null,
  tick: number,
): { machine: TwinMachine; events: TwinEvent[]; sustained: boolean } {
  const events: TwinEvent[] = [];
  const affected = exception?.machineId === machine.id ? exception : null;
  let { state, load, cycleTick, setupLeft, aboveBand } = machine;
  const workOrder = { ...machine.workOrder };
  const noise = (random - 0.5) * 10;
  let sustained = false;

  if (affected?.stage === "approved" && affected.stopLeft > 0) {
    // The supervisor approved the task: the machine is stopped for the check.
    state = "planned_stop";
    load = 0;
    aboveBand = 0;
  } else if (setupLeft > 0) {
    setupLeft -= 1;
    state = "setup";
    load = 0;
    if (setupLeft === 0) {
      events.push({ tick, machineId: machine.id, kind: "state", text: `${machine.name}: setup complete, first cycle started.` });
    }
  } else if (workOrder.done >= workOrder.target) {
    state = "idle";
    load = 0;
  } else {
    cycleTick += 1;
    // The last tick of each cycle is the part change: door open, spindle off.
    if (cycleTick >= machine.cycleLength) {
      cycleTick = 0;
      workOrder.done += 1;
      state = "idle";
      load = 0;
      if (workOrder.done === workOrder.target) {
        events.push({ tick, machineId: machine.id, kind: "state", text: `${machine.name}: ${workOrder.id} reached its quantity.` });
      }
    } else {
      // An exception pushes the load up a little more on every reading.
      const drift =
        affected && (affected.stage === "building" || affected.stage === "detected")
          ? Math.min(34, (tick - affected.startedAt) * 2.6)
          : 0;
      load = clampLoad(machine.baseLoad + noise + drift);
      aboveBand = load > machine.bandHigh ? aboveBand + 1 : 0;
      sustained = aboveBand >= SUSTAIN_TICKS;
      state = affected?.stage === "detected" || sustained ? "attention" : "running";
    }
  }

  return {
    machine: {
      ...machine,
      state,
      load,
      cycleTick,
      setupLeft,
      aboveBand,
      workOrder,
      loadHistory: push(machine.loadHistory, load),
      stateHistory: push(machine.stateHistory, state),
    },
    events,
    sustained,
  };
}

/** Advance the cell by one reading. */
export function stepTwin(prev: TwinState): TwinState {
  const tick = prev.tick + 1;
  let rng = prev.rng;
  let exception = prev.exception ? { ...prev.exception } : null;
  const events: TwinEvent[] = [];

  const machines = prev.machines.map((machine) => {
    let random: number;
    [random, rng] = nextRandom(rng);
    const result = stepMachine(machine, random, exception, tick);
    events.push(...result.events);

    if (exception && exception.machineId === machine.id && exception.stage === "building" && result.sustained) {
      exception = { ...exception, stage: "detected" };
      events.push({
        tick, machineId: machine.id, kind: "alert",
        text: `${machine.name}: spindle load above the expected band for ${machine.program} on ${SUSTAIN_TICKS} readings in a row.`,
      });
      events.push({
        tick, machineId: machine.id, kind: "task",
        text: `Maintenance task ${TWIN_TASK.id} drafted for ${machine.name}. Waiting for a supervisor.`,
      });
    }
    return result.machine;
  });

  if (exception?.stage === "approved") {
    if (exception.stopLeft > 0) {
      exception = { ...exception, stopLeft: exception.stopLeft - 1 };
    } else {
      const name = machines.find((m) => m.id === exception?.machineId)?.name ?? "";
      events.push({ tick, machineId: exception.machineId, kind: "state", text: `${name}: check complete, back in cycle within its normal band.` });
      exception = null;
    }
  }

  return { tick, rng, machines, events: [...prev.events, ...events].slice(-MAX_EVENTS), exception };
}

/* -------------------------------------------------------------------------- */
/*                                   Actions                                  */
/* -------------------------------------------------------------------------- */

/** Start an example exception on a machine that is cutting. No-op if one is already open. */
export function injectException(state: TwinState, machineId: string): TwinState {
  if (state.exception) return state;
  const machine = state.machines.find((m) => m.id === machineId);
  if (!machine || machine.setupLeft > 0 || machine.workOrder.done >= machine.workOrder.target) return state;
  return {
    ...state,
    exception: { machineId, stage: "building", startedAt: state.tick, stopLeft: 0 },
    events: withEvent(state.events, { tick: state.tick, machineId, kind: "info", text: `Example exception started on ${machine.name} by you.` }),
  };
}

/** The visitor, standing in for the supervisor, decides what happens to the drafted task. */
export function decideException(state: TwinState, decision: "approve" | "dismiss"): TwinState {
  const exception = state.exception;
  if (!exception || exception.stage !== "detected") return state;
  const machine = state.machines.find((m) => m.id === exception.machineId);
  const name = machine?.name ?? "";

  if (decision === "approve") {
    return {
      ...state,
      exception: { ...exception, stage: "approved", stopLeft: 6 },
      events: withEvent(state.events, { tick: state.tick, machineId: exception.machineId, kind: "decision", text: `${TWIN_TASK.id} approved by the supervisor (you). ${name} is taken out of cycle for the check.` }),
    };
  }

  return {
    ...state,
    // Dismissed: the readings return to the band and the decision is kept on record.
    exception: null,
    machines: state.machines.map((m) => (m.id === exception.machineId ? { ...m, aboveBand: 0 } : m)),
    events: withEvent(state.events, { tick: state.tick, machineId: exception.machineId, kind: "decision", text: `${TWIN_TASK.id} dismissed by the supervisor (you). ${name} continues; the alert and the decision stay in the record.` }),
  };
}

/** Share of the kept history each state occupies, for the availability strip. */
export function stateShare(machine: TwinMachine): Record<MachineState, number> {
  const share: Record<MachineState, number> = { running: 0, idle: 0, setup: 0, attention: 0, planned_stop: 0 };
  if (machine.stateHistory.length === 0) return share;
  for (const state of machine.stateHistory) share[state] += 1;
  for (const key of Object.keys(share) as MachineState[]) {
    share[key] = Math.round((share[key] / machine.stateHistory.length) * 100);
  }
  return share;
}
