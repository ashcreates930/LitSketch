import "server-only";

/**
 * Small per-instance limiter so a public Phase 1 endpoint can't be hammered.
 * Not shared across serverless instances; real per-teacher limits come with sign-in (Phase 3).
 */
const hits = new Map<string, number[]>();

function recent(key: string, windowMs: number): number[] {
  const now = Date.now();
  return (hits.get(key) ?? []).filter((t) => now - t < windowMs);
}

function record(key: string, list: number[]): void {
  list.push(Date.now());
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
}

/** Counts this request and reports whether the key is over its limit. */
export function rateLimited(key: string, max: number, windowMs: number): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const list = recent(key, windowMs);
  record(key, list);
  return list.length > max;
}

/** For counting only failures (like wrong access codes): check first, record later. */
export function overLimit(key: string, max: number, windowMs: number): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  return recent(key, windowMs).length >= max;
}

export function recordFailure(key: string, windowMs: number): void {
  if (process.env.NODE_ENV !== "production") return;
  record(key, recent(key, windowMs));
}

export function clientKey(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Reject cross-site POSTs; the API is only for LitSketch's own pages. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
