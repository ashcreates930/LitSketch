/** Fill-in text is stored with inline blanks: "Conflict is the [[problem]] that drives the [[plot]]." */

export type Part = { blank: boolean; text: string };

const RE = /\[\[([^\]]*)\]\]/g;

export function parseCloze(s: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const m of s.matchAll(RE)) {
    if (m.index! > last) parts.push({ blank: false, text: s.slice(last, m.index) });
    parts.push({ blank: true, text: m[1].trim() });
    last = m.index! + m[0].length;
  }
  if (last < s.length) parts.push({ blank: false, text: s.slice(last) });
  return parts;
}

export function joinCloze(parts: Part[]): string {
  return parts.map((p) => (p.blank ? `[[${p.text}]]` : p.text)).join("");
}

export function countBlanks(s: string): number {
  return [...s.matchAll(RE)].length;
}

/** The sentence with answers written in, for divergent pages and screen readers. */
export function fillCloze(s: string): string {
  return s.replace(RE, (_, a: string) => a.trim());
}

/** Blank width from the answer length, like the reference pages' --w values. */
export function blankWidth(answer: string): string {
  return `${Math.max(2.5, Math.min(12, answer.length * 0.55 + 1.5)).toFixed(1)}em`;
}
