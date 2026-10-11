export const MIN_WORDS = 80;
export const MAX_WORDS = 2500;

export function wordCount(text: string): number {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

/**
 * Split pasted text into numbered paragraphs.
 * Blank lines separate paragraphs; if there are none (poems, some PDFs), each line is its own unit.
 */
export function splitParagraphs(text: string): string[] {
  const clean = text.replace(/\r\n?/g, "\n").replace(/ /g, " ").trim();
  if (!clean) return [];
  const byBlank = clean
    .split(/\n\s*\n/)
    .map((p) => p.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean);
  if (byBlank.length > 1) return byBlank.map((p) => p.replace(/\s*\n\s*/g, isPoemLike(p) ? "\n" : " "));
  return clean
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean);
}

/** Short lines inside a block suggest verse; keep its line breaks. */
function isPoemLike(block: string): boolean {
  const lines = block.split("\n").filter((l) => l.trim());
  if (lines.length < 3) return false;
  const avg = lines.reduce((n, l) => n + l.length, 0) / lines.length;
  return avg < 60;
}

export function numberedForPrompt(paragraphs: string[]): string {
  return paragraphs.map((p, i) => `¶${i + 1} ${p}`).join("\n");
}
