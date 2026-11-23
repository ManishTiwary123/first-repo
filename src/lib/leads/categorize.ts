// lib/leads/categorize.ts
//
// Turns a validated enquiry into what the sales side needs first: which
// pipeline it belongs to, how soon to pick it up, and the follow-up task.
//
// The score is a sorting aid for a small team, not a judgement of the sender:
// every lead gets a follow-up task whatever its tier, and nothing here changes
// what the visitor is told.
//
// Pure. Dates are computed in IST because the published business hours are
// "Mon–Sat · 10:00–19:00 IST" (locales/en.json → contact.details.hours).

import { leadServiceLabel, type LeadInput, type LeadServiceId } from "./schema";

export type LeadCategory = "industrial" | "business-systems" | "audit" | "general";
export type LeadPriority = "A" | "B" | "C";
export type EmailKind = "work" | "free";

const CATEGORY_BY_SERVICE: Record<LeadServiceId, LeadCategory> = {
  "factory-graph": "industrial",
  "iiot-digital-twin": "industrial",
  "cad-cam-cnc": "industrial",
  "erp-integration": "business-systems",
  "crm-ai-agents": "business-systems",
  "process-automation": "business-systems",
  "custom-software": "business-systems",
  "systems-audit": "audit",
  "not-sure": "audit",
  other: "general",
};

/**
 * Consumer mailbox providers. A free address is common among Indian SME
 * owners and is never a reason to refuse or deprioritise a lead on its own;
 * it only withholds the one point a company domain earns.
 */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.in",
  "yahoo.co.in",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "rediffmail.com",
  "zoho.com",
  "zohomail.in",
  "yandex.com",
  "gmx.com",
  "mail.com",
]);

export function emailKind(email: string): EmailKind {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  return FREE_EMAIL_DOMAINS.has(domain) ? "free" : "work";
}

const SENIOR_ROLE =
  /\b(?:owner|founder|co-?founder|proprietor|partner|chairman|md|managing director|director|ceo|cto|coo|cio|cfo|president|vp|vice president|head|general manager|gm|plant (?:manager|head))\b/i;
const MANAGER_ROLE = /\b(?:manager|lead|supervisor|in-?charge|superintendent)\b/i;
const ENGINEER_ROLE = /\b(?:engineer|planner|programmer|analyst|architect|developer|technician)\b/i;

function roleScore(role: string): number {
  if (SENIOR_ROLE.test(role)) return 3;
  if (MANAGER_ROLE.test(role)) return 2;
  if (ENGINEER_ROLE.test(role)) return 1;
  return 0;
}

const SCALE_SCORE: Record<string, number> = {
  "200+": 3,
  "51-200": 3,
  "11-50": 2,
  "1-10": 1,
  "no-machines": 0,
};

export interface LeadScore {
  score: number;
  priority: LeadPriority;
}

export function scoreLead(lead: LeadInput): LeadScore {
  let score = roleScore(lead.role);
  if (lead.scale) score += SCALE_SCORE[lead.scale] ?? 0;
  if (emailKind(lead.email) === "work") score += 1;
  if (lead.erpCrm) score += 1;
  if (lead.cadCam) score += 1;
  if (lead.connectivity && lead.connectivity !== "unsure" && lead.connectivity !== "not-applicable") score += 1;
  if (lead.challenge.length >= 200) score += 1;
  if (lead.phone) score += 1;
  const priority: LeadPriority = score >= 7 ? "A" : score >= 4 ? "B" : "C";
  return { score, priority };
}

/* -------------------------------------------------------------------------- */
/*                               Follow-up task                               */
/* -------------------------------------------------------------------------- */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The day by which a human reply is due, as an ISO date in IST.
 *
 * The site promises a reply "within one business day", so the task is due on
 * the working day after the enquiry arrives. Sunday is the one day off: an
 * enquiry from Saturday or Sunday is due on Monday.
 */
export function followUpDueOn(now: Date): string {
  // Shift the instant so that the UTC getters read IST wall-clock values.
  let due = new Date(now.getTime() + IST_OFFSET_MS + DAY_MS);
  if (due.getUTCDay() === 0) due = new Date(due.getTime() + DAY_MS);
  return due.toISOString().slice(0, 10);
}

export interface LeadTriage extends LeadScore {
  category: LeadCategory;
  emailKind: EmailKind;
  serviceLabel: string;
  followUp: { title: string; dueOn: string };
}

export function triageLead(lead: LeadInput, now: Date): LeadTriage {
  const serviceLabel = leadServiceLabel(lead.service);
  return {
    ...scoreLead(lead),
    category: CATEGORY_BY_SERVICE[lead.service],
    emailKind: emailKind(lead.email),
    serviceLabel,
    followUp: {
      title: `Reply to ${lead.name} at ${lead.company} — ${serviceLabel}`,
      dueOn: followUpDueOn(now),
    },
  };
}
