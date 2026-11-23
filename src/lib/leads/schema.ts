// lib/leads/schema.ts
//
// The shape of an enquiry and the one validator for it. The browser form
// (components/leads/LeadForm.tsx) and POST /api/leads both call
// `validateLead`, so a field can never be accepted on one side and refused on
// the other. The server's verdict is the one that counts; the client run only
// saves a round trip.
//
// Pure: no next/*, no node:*, no DOM. Loaded by `node --test` through type
// stripping (scripts/leads.test.mjs).

/* -------------------------------------------------------------------------- */
/*                                 Vocabularies                               */
/* -------------------------------------------------------------------------- */

/**
 * What a visitor can ask for. `id` is stored and sent to the CRM; `label` is
 * the English text shown in the form and in notifications. Changing an `id`
 * breaks reporting on rows already stored, so add rather than rename.
 */
export const LEAD_SERVICES = [
  { id: "factory-graph", label: "Factory Graph implementation" },
  { id: "iiot-digital-twin", label: "Industrial IoT / Digital Twin" },
  { id: "erp-integration", label: "ERP integration" },
  { id: "crm-ai-agents", label: "CRM and AI agents" },
  { id: "cad-cam-cnc", label: "CAD/CAM / CNC integration" },
  { id: "process-automation", label: "Business process automation" },
  { id: "custom-software", label: "Custom engineering software" },
  { id: "systems-audit", label: "Complete systems audit" },
  { id: "not-sure", label: "Not sure yet — help me decide" },
  // The general contact form also serves the site's web and growth services.
  { id: "other", label: "Something else (website, SEO, other)" },
] as const;

export type LeadServiceId = (typeof LEAD_SERVICES)[number]["id"];

export const LEAD_SCALES = [
  { id: "1-10", label: "1–10 machines" },
  { id: "11-50", label: "11–50 machines" },
  { id: "51-200", label: "51–200 machines" },
  { id: "200+", label: "More than 200 machines" },
  { id: "no-machines", label: "Not a machine-based operation" },
] as const;

export type LeadScaleId = (typeof LEAD_SCALES)[number]["id"];

export const LEAD_CONNECTIVITY = [
  { id: "none", label: "Machines are not connected yet" },
  { id: "partial", label: "Some machines report data" },
  { id: "connected", label: "Most machines are connected" },
  { id: "unsure", label: "Not sure" },
  { id: "not-applicable", label: "Not applicable" },
] as const;

export type LeadConnectivityId = (typeof LEAD_CONNECTIVITY)[number]["id"];

/** Industries offered by the enterprise form. Free text is accepted too. */
export const LEAD_INDUSTRIES = [
  "CNC & precision engineering",
  "Automotive components",
  "Metal fabrication",
  "Industrial machinery",
  "Electronics assembly",
  "Process manufacturing",
  "Other manufacturing",
  "Not manufacturing",
] as const;

const SERVICE_IDS = new Set<string>(LEAD_SERVICES.map((s) => s.id));
const SCALE_IDS = new Set<string>(LEAD_SCALES.map((s) => s.id));
const CONNECTIVITY_IDS = new Set<string>(LEAD_CONNECTIVITY.map((s) => s.id));

export function leadServiceLabel(id: LeadServiceId): string {
  return LEAD_SERVICES.find((s) => s.id === id)?.label ?? id;
}

/* -------------------------------------------------------------------------- */
/*                                   Limits                                   */
/* -------------------------------------------------------------------------- */

export const LEAD_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  phone: { max: 32, minDigits: 7, maxDigits: 15 },
  company: { min: 2, max: 120 },
  role: { min: 2, max: 100 },
  country: { min: 2, max: 80 },
  industry: { min: 2, max: 80 },
  erpCrm: { max: 200 },
  cadCam: { max: 200 },
  challenge: { min: 10, max: 2000 },
  attribution: { max: 300 },
  pagePath: { max: 300 },
  /** Upper bound for the whole JSON request body, in bytes. */
  bodyBytes: 16 * 1024,
} as const;

/**
 * The consent wording a visitor agreed to is stored with the lead, so a later
 * edit to the form cannot change what an earlier visitor consented to. Bump
 * the version whenever CONSENT_TEXT changes.
 */
export const CONSENT_VERSION = "2026-11-22";
export const CONSENT_TEXT =
  "I agree that Savin Group may contact me about this enquiry using the details I have provided.";
export const MARKETING_CONSENT_TEXT =
  "Optional: send me occasional product and engineering updates from Savin Group. I can unsubscribe at any time.";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export const ATTRIBUTION_KEYS = [
  "landingPage",
  "referrer",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type LeadAttribution = Partial<Record<AttributionKey, string>>;

export interface LeadMeta {
  /** Client-generated, stable across retries of one submission. */
  idempotencyKey: string;
  /** Which form on which page, e.g. "factory-graph-demo". */
  formId: string;
  /** Path the form was submitted from, without query or fragment. */
  pagePath: string;
  locale: string;
  /** Two-letter market segment of the URL (`/in/en/...` → "in"). */
  market: string;
  /** Epoch ms when the visitor first touched the form. */
  startedAt: number;
  /** Must stay empty; see spam.ts. */
  honeypot: string;
  attribution: LeadAttribution;
}

export interface LeadInput {
  name: string;
  email: string;
  phone: string | null;
  company: string;
  role: string;
  country: string;
  industry: string;
  scale: LeadScaleId | null;
  erpCrm: string | null;
  cadCam: string | null;
  connectivity: LeadConnectivityId | null;
  challenge: string;
  service: LeadServiceId;
  consentContact: true;
  consentMarketing: boolean;
  meta: LeadMeta;
}

export type LeadField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "role"
  | "country"
  | "industry"
  | "scale"
  | "erpCrm"
  | "cadCam"
  | "connectivity"
  | "challenge"
  | "service"
  | "consent";

export type LeadFieldError = "required" | "invalid" | "too_short" | "too_long";
export type LeadFieldErrors = Partial<Record<LeadField, LeadFieldError>>;

export type LeadValidation =
  | { ok: true; lead: LeadInput }
  /** `fields` are the visitor's to fix. `meta` means the request itself is malformed. */
  | { ok: false; fields: LeadFieldErrors; meta: boolean };

/* -------------------------------------------------------------------------- */
/*                                Normalisation                               */
/* -------------------------------------------------------------------------- */

// C0 controls except TAB / LF / CR, plus DEL and the bidi overrides that can
// make a stored value render as something other than what was typed.
const UNSAFE_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g;

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

/** One line: control characters out, every run of whitespace to one space. */
export function singleLine(value: unknown): string {
  return asText(value).replace(UNSAFE_CHARS, "").replace(/\s+/g, " ").trim();
}

/** Several lines: keeps line breaks, trims each line's tail, at most one blank line in a row. */
export function multiLine(value: unknown): string {
  return asText(value)
    .replace(UNSAFE_CHARS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const EMAIL_PATTERN =
  /^[^\s@<>()",;:\\[\]]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isEmail(value: string): boolean {
  if (value.length > LEAD_LIMITS.email.max) return false;
  if (!EMAIL_PATTERN.test(value)) return false;
  const local = value.slice(0, value.lastIndexOf("@"));
  return local.length <= 64 && !local.startsWith(".") && !local.endsWith(".") && !local.includes("..");
}

function checkLength(
  value: string,
  { min = 0, max }: { min?: number; max: number },
  required: boolean,
): LeadFieldError | null {
  if (!value) return required ? "required" : null;
  if (value.length < min) return "too_short";
  if (value.length > max) return "too_long";
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* -------------------------------------------------------------------------- */
/*                                 Validation                                 */
/* -------------------------------------------------------------------------- */

const IDEMPOTENCY_KEY = /^[A-Za-z0-9_-]{16,64}$/;
const FORM_ID = /^[a-z0-9-]{1,40}$/;
const LOCALE = /^[a-z]{2}$/;

function readAttribution(value: unknown): LeadAttribution {
  if (!isRecord(value)) return {};
  const out: LeadAttribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const text = singleLine(value[key]).slice(0, LEAD_LIMITS.attribution.max);
    if (text) out[key] = text;
  }
  return out;
}

function readMeta(value: unknown): LeadMeta | null {
  if (!isRecord(value)) return null;
  const idempotencyKey = asText(value.idempotencyKey);
  const formId = asText(value.formId);
  const locale = asText(value.locale).toLowerCase();
  const market = asText(value.market).toLowerCase();
  const startedAt = value.startedAt;
  // Path only: a query string can carry someone else's tracking parameters or
  // an email address, and none of it is needed to know which page converted.
  const pagePath = asText(value.pagePath).split(/[?#]/, 1)[0];

  if (!IDEMPOTENCY_KEY.test(idempotencyKey)) return null;
  if (!FORM_ID.test(formId)) return null;
  if (!LOCALE.test(locale) || !LOCALE.test(market)) return null;
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt) || startedAt <= 0) return null;
  if (!pagePath.startsWith("/") || pagePath.length > LEAD_LIMITS.pagePath.max) return null;

  return {
    idempotencyKey,
    formId,
    pagePath,
    locale,
    market,
    startedAt,
    // Not normalised: a honeypot holding only whitespace is still a hit.
    honeypot: asText(value.honeypot),
    attribution: readAttribution(value.attribution),
  };
}

/**
 * Normalises and checks a submission. Unknown keys are ignored rather than
 * rejected, so an older cached copy of the form keeps working after a deploy
 * that adds a field.
 */
export function validateLead(raw: unknown): LeadValidation {
  if (!isRecord(raw)) return { ok: false, fields: {}, meta: true };

  const fields: LeadFieldErrors = {};
  const set = (field: LeadField, error: LeadFieldError | null) => {
    if (error) fields[field] = error;
  };

  const name = singleLine(raw.name);
  set("name", checkLength(name, LEAD_LIMITS.name, true));

  const email = singleLine(raw.email).toLowerCase();
  if (!email) fields.email = "required";
  else if (email.length > LEAD_LIMITS.email.max) fields.email = "too_long";
  else if (!isEmail(email)) fields.email = "invalid";

  const phone = singleLine(raw.phone);
  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (phone.length > LEAD_LIMITS.phone.max) fields.phone = "too_long";
    else if (
      // "+91 98765 43210", "(022) 2345-6789", "9876543210", "+1.415.555.0100"
      !/^[+(\d][\d\s().-]*$/.test(phone) ||
      digits < LEAD_LIMITS.phone.minDigits ||
      digits > LEAD_LIMITS.phone.maxDigits
    ) {
      fields.phone = "invalid";
    }
  }

  const company = singleLine(raw.company);
  set("company", checkLength(company, LEAD_LIMITS.company, true));

  const role = singleLine(raw.role);
  set("role", checkLength(role, LEAD_LIMITS.role, true));

  const country = singleLine(raw.country);
  set("country", checkLength(country, LEAD_LIMITS.country, true));

  const industry = singleLine(raw.industry);
  set("industry", checkLength(industry, LEAD_LIMITS.industry, true));

  const scale = singleLine(raw.scale);
  if (scale && !SCALE_IDS.has(scale)) fields.scale = "invalid";

  const erpCrm = singleLine(raw.erpCrm);
  set("erpCrm", checkLength(erpCrm, LEAD_LIMITS.erpCrm, false));

  const cadCam = singleLine(raw.cadCam);
  set("cadCam", checkLength(cadCam, LEAD_LIMITS.cadCam, false));

  const connectivity = singleLine(raw.connectivity);
  if (connectivity && !CONNECTIVITY_IDS.has(connectivity)) fields.connectivity = "invalid";

  const challenge = multiLine(raw.challenge);
  set("challenge", checkLength(challenge, LEAD_LIMITS.challenge, true));

  const service = singleLine(raw.service);
  if (!service) fields.service = "required";
  else if (!SERVICE_IDS.has(service)) fields.service = "invalid";

  // Only the literal `true` counts. A truthy string from a hand-built request
  // is not a recorded consent.
  if (raw.consentContact !== true) fields.consent = "required";

  const meta = readMeta(raw.meta);

  if (Object.keys(fields).length > 0 || !meta) {
    return { ok: false, fields, meta: !meta };
  }

  return {
    ok: true,
    lead: {
      name,
      email,
      phone: phone || null,
      company,
      role,
      country,
      industry,
      scale: (scale || null) as LeadScaleId | null,
      erpCrm: erpCrm || null,
      cadCam: cadCam || null,
      connectivity: (connectivity || null) as LeadConnectivityId | null,
      challenge,
      service: service as LeadServiceId,
      consentContact: true,
      consentMarketing: raw.consentMarketing === true,
      meta,
    },
  };
}
