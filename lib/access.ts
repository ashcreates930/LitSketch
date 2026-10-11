import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Teacher access code for generating notes, read from LITSKETCH_ACCESS_CODE.
 * In production the code is always required; if the variable is missing, generation
 * stays off rather than open to anyone. In development it is required only when set.
 */
export type AccessResult = { ok: true } | { ok: false; status: number; error: string };

function digest(s: string): Buffer {
  return createHash("sha256").update(s.trim()).digest();
}

export function checkAccessCode(given: string | undefined): AccessResult {
  const expected = process.env.LITSKETCH_ACCESS_CODE?.trim();
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, error: "LitSketch isn't open yet. Please check back soon." };
    }
    return { ok: true };
  }
  if (!given?.trim()) {
    return { ok: false, status: 401, error: "Please type the teacher access code you were given." };
  }
  // Compare fixed-length hashes so the check takes the same time for any guess.
  if (!timingSafeEqual(digest(given), digest(expected))) {
    return {
      ok: false,
      status: 401,
      error: "That access code didn't match. Check the spelling and try again, or ask the person who gave it to you.",
    };
  }
  return { ok: true };
}
