// lib/leads/store.ts
//
// The database half of the lead pipeline. Leads go to the same Supabase
// Postgres project as the blog, through a SEPARATE login:
//
//   DATABASE_URL        blog_reader   SELECT on published posts only
//   LEADS_DATABASE_URL  lead_writer   EXECUTE on public.submit_lead(jsonb) only
//
// `lead_writer` has no privilege on any table. It cannot read a lead back,
// list leads, or touch the blog; the one thing it can do is hand a JSON
// document to the function in supabase/leads-schema.sql, which checks it
// again, de-duplicates and inserts. A leaked LEADS_DATABASE_URL therefore
// lets someone add rows (which the rate limit and the firewall bound), and
// nothing else.
//
// Server-only.

import postgres from "postgres";
import { SUPABASE_ROOT_CA } from "@/lib/supabase-ca";
import type { LeadRecord, LeadStore, StoreResult } from "./pipeline";

/** Past this the request reports a failure; the browser's retry reuses the key. */
const QUERY_TIMEOUT_MS = 8_000;

const globalForLeads = globalThis as unknown as {
  __leadDb?: { url: string; sql: postgres.Sql };
};

/**
 * One pool per process, rebuilt if the URL changes (dev hot reload). Mirrors
 * `getDb` in lib/blogs.ts: the Supabase transaction pooler has no prepared
 * statements, and its chain ends in a root that has to be pinned.
 */
function getLeadDb(url: string): postgres.Sql {
  if (globalForLeads.__leadDb?.url !== url) {
    void globalForLeads.__leadDb?.sql.end({ timeout: 5 });
    const parsed = new URL(url);
    // A Prisma-style flag that postgres.js would forward as a startup parameter.
    parsed.searchParams.delete("pgbouncer");
    const sql = postgres(parsed.toString(), {
      prepare: false,
      ssl: { ca: SUPABASE_ROOT_CA, rejectUnauthorized: true },
      max: 2,
      idle_timeout: 20,
      connect_timeout: 8,
      // Row values never reach the logs through a driver notice.
      onnotice: () => undefined,
    });
    globalForLeads.__leadDb = { url, sql };
  }
  return globalForLeads.__leadDb.sql;
}

interface SubmitLeadRow {
  id: string;
  reference: string;
  duplicate: boolean;
  replay: boolean;
}

export function createLeadStore(url: string): LeadStore {
  return async function store(record: LeadRecord): Promise<StoreResult> {
    const sql = getLeadDb(url);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("submit_lead timed out")), QUERY_TIMEOUT_MS);
    });
    try {
      // Sent as text and cast, so the parameter's type comes from the cast and
      // not from the driver's guess.
      const query = sql<SubmitLeadRow[]>`
        select id, reference, duplicate, replay
        from public.submit_lead(${JSON.stringify(record)}::jsonb)
      `;
      const rows = await Promise.race([query, timeout]);
      const row = rows[0];
      if (!row) throw new Error("submit_lead returned no row");
      return { id: row.id, reference: row.reference, duplicate: row.duplicate, replay: row.replay };
    } finally {
      clearTimeout(timer);
    }
  };
}
