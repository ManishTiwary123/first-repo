// lib/leads/http.ts
//
// Request guards for POST /api/leads. The same two checks the Operator route
// applies (app/api/operator/route.ts), written against plain `Headers` and a
// byte stream so they can be tested without a server.
//
// Pure.

/**
 * True when a browser sent this request from another site.
 *
 * A cross-origin JSON POST is already blocked by CORS (none is configured),
 * but a "simple" text/plain POST is not, and without this any page could
 * submit leads from its visitors' browsers. Non-browser clients send neither
 * header; they are left to the rate limiter and the firewall.
 */
export function isCrossSite(headers: Headers): boolean {
  const site = headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return true;
  const origin = headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return true; // "null" (sandboxed frames, file://) and garbage
  }
  const hosts = [headers.get("host"), headers.get("x-forwarded-host")?.split(",")[0]?.trim()];
  return !hosts.some((host) => host && host.toLowerCase() === originHost.toLowerCase());
}

/**
 * Reads a body with a hard byte cap. `req.text()` would buffer whatever a
 * chunked request sends before it could be measured. Returns null when the
 * body is larger than the cap.
 */
export async function readBodyCapped(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number,
): Promise<string | null> {
  if (!body) return "";
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/** `application/json`, with or without parameters. */
export function isJsonContentType(value: string | null): boolean {
  return (value ?? "").split(";", 1)[0].trim().toLowerCase() === "application/json";
}
