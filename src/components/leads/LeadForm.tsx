"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Loader2, Mail, MessageCircle, Plus, RotateCw } from "lucide-react";
import LocalizedLink from "../LocalizedLink";
import { track } from "@/lib/analytics";
import {
  LEAD_CONNECTIVITY,
  LEAD_LIMITS,
  LEAD_SCALES,
  LEAD_SERVICES,
  leadServiceLabel,
  validateLead,
  type LeadField,
  type LeadFieldError,
  type LeadFieldErrors,
  type LeadServiceId,
} from "@/lib/leads/schema";
import { captureAttribution } from "./attribution";
import type { LeadFormCopy } from "./lead-form-copy";
import styles from "./LeadForm.module.css";

/**
 * The site's one enquiry form.
 *
 * It posts to /api/leads and reports exactly what the server said. The three
 * visible end states are:
 *
 *   success   the server answered 200, which it does only after the lead was
 *             stored or delivered. The visitor gets a reference to quote.
 *   invalid   the highlighted fields need fixing; nothing was sent.
 *   failure   the request did NOT go through (not configured, delivery failed,
 *             network down, rate limited, refused). The form stays filled in,
 *             says so in plain words, and offers WhatsApp and email with the
 *             visitor's text already in the message.
 *
 * There is no optimistic "thanks" on any other path. The previous form showed
 * "Message received" after a 900 ms timer and sent nothing.
 */
export interface LeadFormProps {
  locale: string;
  /** The `/{country}/` segment of the URL. */
  market: string;
  /** Names the form in the stored lead and in analytics, e.g. "factory-graph-demo". */
  formId: string;
  copy: LeadFormCopy;
  industries: readonly string[];
  /** Prefills the country field; the visitor can change it. */
  defaultCountry: string;
  defaultService?: LeadServiceId;
  /** Where the optional systems questions sit. */
  systems?: "open" | "collapsed";
  contact: { email: string; phone: string };
  /** Shown under the success message, in order. */
  nextSteps?: readonly string[];
  tone?: "site" | "platform";
  /** Overrides the heading from `copy`. */
  eyebrow?: string;
  title?: string;
  /** DOM id for in-page links such as `#enquiry`. */
  id?: string;
}

type FailureReason = "unavailable" | "delivery" | "network" | "rateLimited" | "rejected";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string; name: string; email: string }
  | { kind: "failure"; reason: FailureReason; whatsapp: string; mailto: string };

const FIELD_ORDER: readonly LeadField[] = [
  "name",
  "email",
  "company",
  "role",
  "country",
  "industry",
  "phone",
  "service",
  "challenge",
  "scale",
  "connectivity",
  "erpCrm",
  "cadCam",
  "consent",
];

/** Longest text put into a wa.me or mailto: link before encoding. */
const HANDOFF_MAX = 1400;
const REQUEST_TIMEOUT_MS = 35_000;
const RETRY_PAUSE_MS = 1_200;

function newKey(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Old browsers and non-secure contexts. Uniqueness matters, secrecy does not.
    let out = "";
    for (let i = 0; i < 32; i++) out += Math.floor(Math.random() * 36).toString(36);
    return out;
  }
}

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function errorMessage(field: LeadField, error: LeadFieldError, copy: LeadFormCopy): string {
  if (field === "consent") return copy.errors.consent;
  if (error === "required") return copy.errors.required;
  if (error === "too_short") return copy.errors.tooShort;
  if (error === "too_long") return copy.errors.tooLong;
  if (field === "email") return copy.errors.invalidEmail;
  if (field === "phone") return copy.errors.invalidPhone;
  return copy.errors.invalid;
}

/** The enquiry as plain text, for the WhatsApp and email fallbacks. */
function handoffText(data: FormData, copy: LeadFormCopy): string {
  const service = text(data, "service");
  const lines = [
    "Enquiry from savingroup.in",
    "",
    `${copy.name}: ${text(data, "name")}`,
    `${copy.company}: ${text(data, "company")}`,
    `${copy.role}: ${text(data, "role")}`,
    `${copy.email}: ${text(data, "email")}`,
    `${copy.country}: ${text(data, "country")}`,
    `${copy.industry}: ${text(data, "industry")}`,
    service ? `${copy.service} ${leadServiceLabel(service as LeadServiceId)}` : "",
    text(data, "erpCrm") ? `${copy.erpCrm}: ${text(data, "erpCrm")}` : "",
    text(data, "cadCam") ? `${copy.cadCam}: ${text(data, "cadCam")}` : "",
    "",
    text(data, "challenge"),
  ];
  const body = lines.filter((line, index) => line !== "" || lines[index - 1] !== "").join("\n").trim();
  return body.length > HANDOFF_MAX ? `${body.slice(0, HANDOFF_MAX)}…` : body;
}

async function post(body: string): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    window.clearTimeout(timer);
  }
}

export function LeadForm({
  locale,
  market,
  formId,
  copy,
  industries,
  defaultCountry,
  defaultService,
  systems = "collapsed",
  contact,
  nextSteps,
  tone = "site",
  eyebrow,
  title,
  id,
}: LeadFormProps) {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef("");
  const startedRef = useRef(0);
  const touchedRef = useRef(false);

  useEffect(() => {
    keyRef.current = newKey();
    startedRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.kind === "success") doneRef.current?.focus();
    if (status.kind === "failure") alertRef.current?.focus();
  }, [status]);

  const fieldId = (field: string) => `${uid}-${field}`;
  const errorId = (field: string) => `${uid}-${field}-error`;

  function onFirstInteraction() {
    if (touchedRef.current) return;
    touchedRef.current = true;
    track("lead_form_start", { form_id: formId });
  }

  function focusFirstError(found: LeadFieldErrors) {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (!first) return;
    const node = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    // The systems questions may be inside a closed <details>.
    node?.closest("details")?.setAttribute("open", "");
    node?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "submitting") return;
    onFirstInteraction();

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: text(data, "name"),
      email: text(data, "email"),
      phone: text(data, "phone"),
      company: text(data, "company"),
      role: text(data, "role"),
      country: text(data, "country"),
      industry: text(data, "industry"),
      scale: text(data, "scale"),
      erpCrm: text(data, "erpCrm"),
      cadCam: text(data, "cadCam"),
      connectivity: text(data, "connectivity"),
      challenge: text(data, "challenge"),
      service: text(data, "service"),
      consentContact: data.get("consentContact") === "on",
      consentMarketing: data.get("consentMarketing") === "on",
      meta: {
        idempotencyKey: keyRef.current || (keyRef.current = newKey()),
        formId,
        pagePath: window.location.pathname,
        locale,
        market,
        startedAt: startedRef.current || Date.now(),
        honeypot: text(data, "contact_window"),
        attribution: captureAttribution(),
      },
    };

    // Same validator as the server, run here to save a round trip.
    const local = validateLead(payload);
    if (!local.ok && Object.keys(local.fields).length > 0) {
      setErrors(local.fields);
      setStatus({ kind: "idle" });
      focusFirstError(local.fields);
      track("lead_form_error", { form_id: formId, reason: "validation" });
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });

    const fail = (reason: FailureReason) => {
      const message = handoffText(data, copy);
      const digits = contact.phone.replace(/\D/g, "");
      setStatus({
        kind: "failure",
        reason,
        whatsapp: `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
        mailto: `mailto:${contact.email}?subject=${encodeURIComponent(
          `Enquiry: ${text(data, "company") || text(data, "name")}`,
        )}&body=${encodeURIComponent(message.replace(/\n/g, "\r\n"))}`,
      });
      track("lead_form_error", { form_id: formId, reason });
    };

    const body = JSON.stringify(payload);
    // One automatic retry for a dropped connection or a 5xx. It reuses the
    // idempotency key, so a request that did land is not stored twice.
    for (let attempt = 1; attempt <= 2; attempt++) {
      let res: Response;
      try {
        res = await post(body);
      } catch {
        if (attempt === 1) {
          await new Promise((resolve) => window.setTimeout(resolve, RETRY_PAUSE_MS));
          continue;
        }
        fail("network");
        return;
      }

      let json: { ok?: boolean; reference?: string; error?: string; fields?: LeadFieldErrors } = {};
      try {
        json = await res.json();
      } catch {
        // A non-JSON answer (a proxy's error page) is handled by status below.
      }

      if (res.ok && json.ok === true && typeof json.reference === "string") {
        setStatus({ kind: "success", reference: json.reference, name: payload.name.trim(), email: payload.email.trim() });
        // Sent only now, after the server confirmed the lead was taken.
        track("generate_lead", { form_id: formId, service: payload.service });
        keyRef.current = newKey();
        startedRef.current = Date.now();
        return;
      }

      if (res.status === 422 && json.error === "validation" && json.fields) {
        setErrors(json.fields);
        setStatus({ kind: "idle" });
        focusFirstError(json.fields);
        track("lead_form_error", { form_id: formId, reason: "validation" });
        return;
      }
      if (res.status === 422) return fail("rejected");
      if (res.status === 429) return fail("rateLimited");
      if (res.status === 503) return fail("unavailable");
      if (res.status >= 500 && attempt === 1) {
        await new Promise((resolve) => window.setTimeout(resolve, RETRY_PAUSE_MS));
        continue;
      }
      return fail("delivery");
    }
  }

  if (status.kind === "success") {
    return (
      <div id={id} className={`${styles.form} ${styles[tone]}`} data-lead-form={formId}>
        <div className={styles.done} role="status">
          <div className={styles.doneIcon} aria-hidden="true">
            <CheckCircle2 size={28} strokeWidth={1.8} />
          </div>
          <h3 ref={doneRef} tabIndex={-1} className={styles.doneTitle}>
            {copy.success.title}
          </h3>
          <p className={styles.doneBody}>
            {copy.success.body.replace("{name}", status.name).replace("{email}", status.email)}
          </p>
          <div className={styles.reference}>
            <span>{copy.success.reference}</span>
            <strong dir="ltr">{status.reference}</strong>
          </div>
          {nextSteps && nextSteps.length > 0 && (
            <div className={styles.next}>
              <h4>{copy.success.nextTitle}</h4>
              <ol>
                {nextSteps.map((step) => (
                  <li key={step}>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className={styles.doneActions}>
            <button type="button" className={styles.ghost} onClick={() => setStatus({ kind: "idle" })}>
              {copy.success.again}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const failureText =
    status.kind === "failure"
      ? {
          unavailable: copy.failure.unavailable,
          delivery: copy.failure.delivery,
          network: copy.failure.network,
          rateLimited: copy.failure.rateLimited,
          rejected: copy.failure.rejected,
        }[status.reason]
      : "";

  /** Shared wiring for a labelled control and its error line. */
  const field = (name: LeadField, label: string, control: (props: ControlProps) => ReactNode, full = false) => {
    const error = errors[name];
    return (
      <div className={`${styles.field} ${full ? styles.full : ""}`}>
        <label className={styles.label} htmlFor={fieldId(name)}>
          {label}
        </label>
        {control({
          id: fieldId(name),
          name,
          className: styles.control,
          "data-field": name,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId(name) : undefined,
        })}
        {error && (
          <span className={styles.error} id={errorId(name)}>
            {errorMessage(name, error, copy)}
          </span>
        )}
      </div>
    );
  };

  const systemsFields = (
    <div className={styles.grid}>
      {field("scale", copy.scale, (props) => (
        <select {...props} defaultValue="">
          <option value="">{copy.select}</option>
          {LEAD_SCALES.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      {field("connectivity", copy.connectivity, (props) => (
        <select {...props} defaultValue="">
          <option value="">{copy.select}</option>
          {LEAD_CONNECTIVITY.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      {field("erpCrm", copy.erpCrm, (props) => (
        <input {...props} type="text" maxLength={LEAD_LIMITS.erpCrm.max} placeholder={copy.erpCrmPlaceholder} />
      ))}
      {field("cadCam", copy.cadCam, (props) => (
        <input {...props} type="text" maxLength={LEAD_LIMITS.cadCam.max} placeholder={copy.cadCamPlaceholder} />
      ))}
    </div>
  );

  return (
    <form
      id={id}
      ref={formRef}
      className={`${styles.form} ${styles[tone]}`}
      onSubmit={onSubmit}
      // Focus is the usual first touch; input covers autofill and assistive
      // tools that set a value without moving focus.
      onFocusCapture={onFirstInteraction}
      onInputCapture={onFirstInteraction}
      noValidate
      aria-busy={submitting}
      data-lead-form={formId}
    >
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <i aria-hidden="true" />
          {eyebrow ?? copy.eyebrow}
        </div>
        <h3 className={styles.title}>{title ?? copy.title}</h3>
      </div>

      <noscript>
        <p className={styles.noscript}>
          {copy.noscript.replace("{email}", contact.email).replace("{phone}", contact.phone)}
        </p>
      </noscript>

      <div className={styles.body}>
        <div className={styles.grid}>
          {field("name", copy.name, (props) => (
            <input {...props} type="text" autoComplete="name" required maxLength={LEAD_LIMITS.name.max} />
          ))}
          {field("email", copy.email, (props) => (
            <input
              {...props}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={LEAD_LIMITS.email.max}
              dir="ltr"
            />
          ))}
          {field("company", copy.company, (props) => (
            <input {...props} type="text" autoComplete="organization" required maxLength={LEAD_LIMITS.company.max} />
          ))}
          {field("role", copy.role, (props) => (
            <input
              {...props}
              type="text"
              autoComplete="organization-title"
              required
              maxLength={LEAD_LIMITS.role.max}
              placeholder={copy.rolePlaceholder}
            />
          ))}
          {field("country", copy.country, (props) => (
            <input
              {...props}
              type="text"
              autoComplete="country-name"
              required
              maxLength={LEAD_LIMITS.country.max}
              defaultValue={defaultCountry}
            />
          ))}
          {field("industry", copy.industry, (props) => (
            <select {...props} required defaultValue="">
              <option value="" disabled>
                {copy.select}
              </option>
              {industries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
          {field("phone", copy.phone, (props) => (
            <input
              {...props}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={LEAD_LIMITS.phone.max}
              dir="ltr"
            />
          ))}
          {field("service", copy.service, (props) => (
            <select {...props} required defaultValue={defaultService ?? ""}>
              <option value="" disabled>
                {copy.select}
              </option>
              {LEAD_SERVICES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          {field(
            "challenge",
            copy.challenge,
            (props) => (
              <textarea
                {...props}
                required
                rows={5}
                maxLength={LEAD_LIMITS.challenge.max}
                placeholder={copy.challengePlaceholder}
              />
            ),
            true,
          )}
        </div>

        {systems === "open" ? (
          <div className={styles.systemsOpen}>
            <h4>{copy.systemsTitle}</h4>
            <p className={styles.hint}>{copy.systemsHint}</p>
            {systemsFields}
          </div>
        ) : (
          <details className={styles.systems}>
            <summary>
              {copy.systemsTitle}
              <Plus size={16} aria-hidden="true" />
            </summary>
            <div className={styles.systemsInner}>
              <p className={styles.hint}>{copy.systemsHint}</p>
              {systemsFields}
            </div>
          </details>
        )}

        {/* Honeypot. See lib/leads/spam.ts. */}
        <div className={styles.trap} aria-hidden="true">
          <label htmlFor={fieldId("contact_window")}>Leave this field empty</label>
          <input
            id={fieldId("contact_window")}
            name="contact_window"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className={styles.checks}>
          <div>
            <label className={styles.check}>
              <input
                type="checkbox"
                name="consentContact"
                required
                data-field="consent"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? errorId("consent") : undefined}
              />
              <span>{copy.consent}</span>
            </label>
            {errors.consent && (
              <span className={styles.error} id={errorId("consent")}>
                {copy.errors.consent}
              </span>
            )}
          </div>
          <label className={`${styles.check} ${styles.checkOptional}`}>
            <input type="checkbox" name="consentMarketing" />
            <span>{copy.marketing}</span>
          </label>
        </div>

        {Object.keys(errors).length > 0 && status.kind !== "failure" && (
          <p className={styles.error} role="alert">
            {copy.errors.summary}
          </p>
        )}

        {status.kind === "failure" && (
          <div className={styles.alert} role="alert" tabIndex={-1} ref={alertRef}>
            <h4 className={styles.alertTitle}>
              <AlertTriangle size={17} aria-hidden="true" />
              {copy.failure.title}
            </h4>
            <p>{failureText}</p>
            <div className={styles.alertActions}>
              <a className={styles.ghost} href={status.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} aria-hidden="true" />
                {copy.failure.whatsapp}
              </a>
              <a className={styles.ghost} href={status.mailto}>
                <Mail size={16} aria-hidden="true" />
                {copy.failure.email}
              </a>
              {status.reason !== "rejected" && status.reason !== "unavailable" && (
                <button type="submit" className={styles.ghost}>
                  <RotateCw size={15} aria-hidden="true" />
                  {copy.failure.retry}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.foot}>
        <p className={styles.footnote}>
          {copy.footnote}{" "}
          <LocalizedLink href="/privacy" className={styles.link}>
            {copy.privacy}
          </LocalizedLink>
        </p>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={17} className={styles.spin} aria-hidden="true" />
              {copy.submitting}
            </>
          ) : (
            <>
              {copy.submit}
              <ArrowUpRight size={17} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

interface ControlProps {
  id: string;
  name: string;
  className: string;
  "data-field": string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}
