// lib/leads/rate-limit.ts
//
// Per-IP sliding-window limiter for POST /api/leads. Same design and the same
// caveat as the Operator's (lib/operator/rate-limit.ts): state lives in this
// module's memory, so each serverless instance counts on its own and a cold
// start forgets everything. It stops one browser or a naive script from
// flooding the pipeline; the durable control is a firewall rate-limit rule on
// /api/leads, which runs before the function and is shared across instances.
//
// Written as a factory rather than reusing the Operator's module, which is
// bound to its own config and covered by its own tests.
//
// `now` is passed in so the tests can move time. Pure.

export interface RateLimitWindow {
  windowMs: number;
  max: number;
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * A real visitor submits once or twice. The burst window leaves room for a
 * few retries after a failed delivery, and for several people behind one
 * office IP; the daily window bounds a script.
 */
export const LEAD_RATE_LIMITS: readonly RateLimitWindow[] = [
  { windowMs: 10 * 60 * 1000, max: 8 },
  { windowMs: 24 * 60 * 60 * 1000, max: 30 },
];

/** Upper bound on tracked keys, so a spray of spoofed IPs cannot grow memory without limit. */
const MAX_KEYS = 5000;
const PRUNE_EVERY_MS = 60 * 1000;

export function createRateLimiter(windows: readonly RateLimitWindow[]) {
  // Timestamps of ACCEPTED requests per key, oldest first. Refused requests
  // are not recorded, so a client that keeps retrying is not locked out forever.
  const hits = new Map<string, number[]>();
  const longest = Math.max(...windows.map((w) => w.windowMs));
  let lastPrune = 0;

  function prune(now: number): void {
    lastPrune = now;
    for (const [key, times] of hits) {
      if ((times[times.length - 1] ?? 0) <= now - longest) hits.delete(key);
    }
    // Map iteration order is insertion order and every accepted request
    // re-inserts its key, so the first keys are the least recently used.
    for (const key of hits.keys()) {
      if (hits.size <= MAX_KEYS) break;
      hits.delete(key);
    }
  }

  return function check(key: string, now: number): RateLimitResult {
    if (now - lastPrune >= PRUNE_EVERY_MS || hits.size > MAX_KEYS) prune(now);

    const times = (hits.get(key) ?? []).filter((time) => time > now - longest);
    for (const { windowMs, max } of windows) {
      const inWindow = times.filter((time) => time > now - windowMs);
      if (inWindow.length >= max) {
        const oldest = inWindow[inWindow.length - max] ?? now;
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
      }
    }

    times.push(now);
    hits.delete(key);
    hits.set(key, times);
    return { ok: true };
  };
}
