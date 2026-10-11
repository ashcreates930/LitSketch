/** Remembers the teacher access code on this device after it works once. */
const KEY = "litsketch:access-code";

export function loadAccessCode(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveAccessCode(code: string): void {
  try {
    if (code.trim()) localStorage.setItem(KEY, code.trim());
  } catch {}
}
