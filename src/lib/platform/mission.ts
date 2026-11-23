// lib/platform/mission.ts
//
// "Give your enterprise an objective": the arithmetic behind the public
// mission demonstration.
//
// WHAT THIS IS. A worked example. The visitor changes the quantity, the
// number of working days and the target cost; this module answers from the
// EXAMPLE dataset below, and the page shows that dataset next to the answer
// so every figure can be checked by hand.
//
// WHAT THIS IS NOT. It is not an agent, it calls no model, and it reads no
// operational system. In a deployment the same questions are answered from
// the customer's ERP, MES and inventory through read-only connections; here
// they are answered from constants. The page labels it as example data.
//
// The answer is computed, never scripted: change an input and the verdict,
// the constraints and the approvals follow from the numbers.
//
// Pure: no imports. Covered by scripts/platform.test.mjs.

export interface MissionDataset {
  part: {
    number: string;
    name: string;
    revision: string;
    revisionStatus: "Released" | "In review";
    programRef: string;
    programForRevision: string;
  };
  routing: {
    /** Machining time per part, minutes. */
    cycleMinutes: number;
    /** Machines qualified to run this part. */
    capableMachines: number;
    /** One-off setup for the batch, hours. */
    setupHours: number;
  };
  calendar: {
    shiftsPerDay: number;
    productiveHoursPerShift: number;
    /** Share of scheduled time the machines have actually been available. */
    availability: number;
    /** Share of those machines' time already promised to other orders. */
    committedLoad: number;
    /** Extra hours per machine per day that overtime could add. */
    overtimeHoursPerDay: number;
  };
  material: {
    /** Raw material on hand, expressed as parts it can make. */
    onHandParts: number;
    /** Working days for the supplier to deliver the balance. */
    supplierLeadDays: number;
    unitCost: number;
  };
  rates: {
    machineHour: number;
    /** Extra cost of an overtime hour, as a share of the machine-hour rate. */
    overtimePremium: number;
    currency: string;
  };
}

/** The example dataset. Invented for the demonstration; not a customer's data. */
export const MISSION_EXAMPLE: MissionDataset = {
  part: {
    number: "BRK-204",
    name: "Mounting bracket",
    revision: "C",
    revisionStatus: "Released",
    programRef: "O2041",
    programForRevision: "C",
  },
  routing: { cycleMinutes: 4.5, capableMachines: 2, setupHours: 3 },
  calendar: {
    shiftsPerDay: 2,
    productiveHoursPerShift: 7,
    availability: 0.82,
    committedLoad: 0.35,
    overtimeHoursPerDay: 3,
  },
  material: { onHandParts: 640, supplierLeadDays: 2, unitCost: 62 },
  rates: { machineHour: 900, overtimePremium: 0.5, currency: "₹" },
};

export interface MissionInput {
  quantity: number;
  workingDays: number;
  targetUnitCost: number;
}

export const MISSION_DEFAULT: MissionInput = { quantity: 1000, workingDays: 5, targetUnitCost: 135 };

export const MISSION_RANGES = {
  quantity: { min: 200, max: 2000, step: 50 },
  workingDays: { min: 2, max: 8, step: 1 },
  targetUnitCost: { min: 110, max: 170, step: 1 },
} as const;

export type MissionVerdict = "feasible" | "conditional" | "not_feasible";

export interface MissionResult {
  input: MissionInput;
  engineering: { ok: boolean; note: string };
  capacity: {
    /** Machine hours the batch needs, setup included. */
    requiredHours: number;
    /** Hours available in normal shifts before the date. */
    regularHours: number;
    /** Further hours overtime could add. */
    overtimeAvailableHours: number;
    /** Overtime the plan would actually use. */
    overtimeHours: number;
    /** Parts that fit in normal shifts. */
    regularParts: number;
    /** Parts that fit with all available overtime. */
    maxParts: number;
    /** Hours lost waiting for material, if stock runs out before the delivery. */
    idleHours: number;
  };
  material: {
    shortfallParts: number;
    /** False when the balance cannot arrive in time to be machined. */
    arrivesInTime: boolean;
    /** Working day on which on-hand stock runs out at the planned pace (0 = it does not). */
    runsOutOnDay: number;
  };
  cost: {
    material: number;
    machining: number;
    setup: number;
    overtime: number;
    unit: number;
    withinTarget: boolean;
    /** Positive when the plan is over the target. */
    gap: number;
  };
  verdict: MissionVerdict;
  /** Why the plan is conditional or not feasible, in plain words. */
  constraints: string[];
  /** What a person has to approve before anything happens. */
  approvals: string[];
}

function clamp(value: number, { min, max }: { min: number; max: number }): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function round(value: number, places = 1): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function evaluateMission(raw: MissionInput, data: MissionDataset = MISSION_EXAMPLE): MissionResult {
  const input: MissionInput = {
    quantity: Math.round(clamp(raw.quantity, MISSION_RANGES.quantity)),
    workingDays: Math.round(clamp(raw.workingDays, MISSION_RANGES.workingDays)),
    targetUnitCost: Math.round(clamp(raw.targetUnitCost, MISSION_RANGES.targetUnitCost)),
  };
  const { quantity, workingDays, targetUnitCost } = input;
  const { routing, calendar, material, rates, part } = data;
  const currency = rates.currency;

  /* ---- Engineering ---- */
  const revisionOk = part.revisionStatus === "Released";
  const programOk = part.programForRevision === part.revision;
  const engineering = {
    ok: revisionOk && programOk,
    note: !revisionOk
      ? `Revision ${part.revision} is not released.`
      : !programOk
        ? `Program ${part.programRef} is approved for revision ${part.programForRevision}, not ${part.revision}.`
        : `Revision ${part.revision} is released, and program ${part.programRef} is approved for it.`,
  };

  /* ---- Capacity ---- */
  const hoursPerPart = routing.cycleMinutes / 60;
  // What one machine really gives this order in a normal day.
  const regularPerMachineDay =
    calendar.shiftsPerDay * calendar.productiveHoursPerShift * calendar.availability * (1 - calendar.committedLoad);
  const overtimePerMachineDay = calendar.overtimeHoursPerDay * calendar.availability;
  const dailyRegular = regularPerMachineDay * routing.capableMachines;
  const dailyOvertime = overtimePerMachineDay * routing.capableMachines;

  /* ---- Material ---- */
  const shortfallParts = Math.max(0, quantity - material.onHandParts);
  // Days of machining the on-hand stock supports at the normal pace.
  const daysOfStock = (material.onHandParts * hoursPerPart + routing.setupHours) / dailyRegular;
  const waitsForMaterial = shortfallParts > 0 && daysOfStock < material.supplierLeadDays;
  const idleDays = waitsForMaterial ? material.supplierLeadDays - daysOfStock : 0;
  const arrivesInTime = shortfallParts === 0 || material.supplierLeadDays < workingDays;

  // Machining hours lost while the machines wait for the delivery.
  const idleHours = idleDays * dailyRegular;
  const regularHours = Math.max(0, dailyRegular * workingDays - idleHours);
  const overtimeAvailableHours = Math.max(0, dailyOvertime * (workingDays - idleDays));

  const requiredHours = quantity * hoursPerPart + routing.setupHours;
  const partsIn = (hours: number) => Math.max(0, Math.floor((hours - routing.setupHours) / hoursPerPart + 1e-9));
  const regularParts = partsIn(regularHours);
  const maxParts = partsIn(regularHours + overtimeAvailableHours);
  const overtimeHours = Math.min(overtimeAvailableHours, Math.max(0, requiredHours - regularHours));

  const fitsRegular = requiredHours <= regularHours + 1e-9;
  const fitsWithOvertime = requiredHours <= regularHours + overtimeAvailableHours + 1e-9;

  /* ---- Cost ---- */
  const machining = hoursPerPart * rates.machineHour;
  const setup = (routing.setupHours * rates.machineHour) / quantity;
  const overtime = (overtimeHours * rates.machineHour * rates.overtimePremium) / quantity;
  const unit = material.unitCost + machining + setup + overtime;
  const withinTarget = unit <= targetUnitCost + 1e-9;

  /* ---- Verdict ---- */
  const constraints: string[] = [];
  const approvals: string[] = [];

  if (!engineering.ok) constraints.push(engineering.note);

  if (shortfallParts > 0) {
    if (!arrivesInTime) {
      constraints.push(
        `Material for ${shortfallParts} parts is short, and the supplier's ${material.supplierLeadDays}-day lead time leaves no time to machine it.`,
      );
    } else {
      approvals.push(`Purchase requisition for material for ${shortfallParts} parts (buyer).`);
      if (waitsForMaterial) {
        constraints.push(
          `Stock runs out before the delivery arrives: about ${round(idleHours)} machine hours are lost waiting.`,
        );
      }
    }
  }

  if (!fitsWithOvertime) {
    constraints.push(
      `Capacity allows about ${maxParts} parts in ${workingDays} working days, even with overtime. ${quantity} were asked for.`,
    );
  } else if (!fitsRegular) {
    constraints.push(`Normal shifts cover about ${regularParts} parts. The rest needs ${round(overtimeHours)} hours of overtime.`);
    approvals.push(`Overtime of ${round(overtimeHours)} machine hours (production manager).`);
  }

  if (!withinTarget) {
    constraints.push(
      `Estimated cost is ${currency}${round(unit, 2)} per part, ${currency}${round(unit - targetUnitCost, 2)} over the target.`,
    );
    approvals.push(`A price or margin exception of ${currency}${round(unit - targetUnitCost, 2)} per part (commercial lead).`);
  }

  const blocked = !engineering.ok || !arrivesInTime || !fitsWithOvertime;
  const verdict: MissionVerdict = blocked ? "not_feasible" : constraints.length > 0 || approvals.length > 0 ? "conditional" : "feasible";

  // Whatever the verdict, committing to a customer is a person's decision.
  if (!blocked) approvals.push("The delivery promise to the customer (account owner).");

  return {
    input,
    engineering,
    capacity: {
      requiredHours: round(requiredHours),
      regularHours: round(regularHours),
      overtimeAvailableHours: round(overtimeAvailableHours),
      overtimeHours: round(overtimeHours),
      regularParts,
      maxParts,
      idleHours: round(idleHours),
    },
    material: {
      shortfallParts,
      arrivesInTime,
      runsOutOnDay: shortfallParts > 0 ? Math.max(1, Math.ceil(daysOfStock)) : 0,
    },
    cost: {
      material: round(material.unitCost, 2),
      machining: round(machining, 2),
      setup: round(setup, 2),
      overtime: round(overtime, 2),
      unit: round(unit, 2),
      withinTarget,
      gap: round(unit - targetUnitCost, 2),
    },
    verdict,
    constraints,
    approvals,
  };
}
