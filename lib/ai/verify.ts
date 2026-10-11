import type { Generation } from "./schema";
import { countBlanks } from "@/lib/cloze";

export type Issue = { repair: string; teacher: string };

/** Lowercase, straighten quotes and dashes, drop punctuation, collapse spaces. */
export function looseText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’‛`]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length;
}

export function verifyGeneration(g: Generation, paragraphs: string[]): Issue[] {
  const issues: Issue[] = [];
  const add = (repair: string, teacher: string) => issues.push({ repair, teacher });
  const whole = ` ${looseText(paragraphs.join(" "))} `;
  const max = paragraphs.length;

  const count = (label: string, n: number, min: number, maxN = min) => {
    if (n < min || n > maxN) {
      const want = min === maxN ? `exactly ${min}` : `${min} to ${maxN}`;
      add(`${label} has ${n} items; it needs ${want}.`, `${label}: expected ${want} items, got ${n}.`);
    }
  };
  const para = (label: string, p: number) => {
    if (p < 1 || p > max) add(`${label} cites ¶${p}, but the passage has ¶1-¶${max}.`, `${label} points to a paragraph that doesn't exist.`);
  };
  const long = (label: string, s: string, limit: number) => {
    if (words(s) > limit + 4) add(`${label} is ${words(s)} words; the limit is ${limit}.`, `${label} is long and may not fit on the page.`);
  };
  const blanks = (label: string, s: string, min: number, maxB = 99) => {
    const n = countBlanks(s);
    if (n < min || n > maxB) add(`${label} needs ${min === maxB ? min : `${min} or more`} [[answer]] blanks; it has ${n}.`, `${label} is missing its fill-in blanks.`);
  };

  // Doodle vocabulary
  const v = g.vocab.words;
  count("vocab.words", v.length, 3);
  v.forEach((w, i) => {
    const label = `Vocab word ${i + 1} (${w.word})`;
    if (!whole.includes(` ${looseText(w.word)}`)) add(`vocab.words[${i}].word "${w.word}" does not appear in the passage.`, `Key word "${w.word}" was not found in your passage.`);
    para(label, w.paragraph);
    long(`${label} meaning`, w.meaning, 20);
    long(`${label} sentence`, w.sentence, 22);
    long(`${label} doodle prompt`, w.doodle_what, 12);
    const t = w.task;
    if (t.kind === "circle") {
      if (t.chips.length < 4 || !t.chips.some((c) => c.correct) || t.chips.every((c) => c.correct)) {
        add(`vocab.words[${i}].task (circle) needs 6 chips with 2 or 3 correct.`, `${label}: the circle-the-words task is incomplete.`);
      }
    } else if (t.kind === "sort") {
      const letters = t.sort_letters.map((l) => l.letter.trim().toUpperCase());
      if (letters.length !== 2 || t.sort_items.length < 2 || t.sort_items.some((s) => !letters.includes(s.answer.trim().toUpperCase()))) {
        add(`vocab.words[${i}].task (sort) needs 2 letters and 3 items whose answers are one of those letters.`, `${label}: the sorting task is incomplete.`);
      }
    } else if (t.finish.length < 1 || t.finish.some((s) => countBlanks(s) !== 1)) {
      add(`vocab.words[${i}].task (finish) needs 2 sentences with exactly one [[answer]] each.`, `${label}: the finish-the-sentence task is incomplete.`);
    }
  });

  // Story / idea map
  const m = g.map;
  count("map.orbits", m.orbits.length, 4);
  count("map.links", m.links.length, 3);
  count("map.center", m.center.length, 1, 2);
  m.orbits.forEach((o, i) => {
    const label = `Map circle ${i + 1} (${o.heading})`;
    para(label, o.paragraph);
    if (o.lines.reduce((n, l) => n + countBlanks(l), 0) < 1) add(`map.orbits[${i}].lines need at least one [[answer]] blank.`, `${label} has no fill-in blank.`);
    long(`${label} prompt`, o.divergent.prompt, 18);
  });

  // Guided notes
  const gd = g.guided;
  blanks("guided.lead", gd.lead, 2, 6);
  count("guided.boxes", gd.boxes.length, 4);
  gd.boxes.forEach((b, i) => {
    const label = `Guided box ${i + 1} (${b.label})`;
    para(label, b.paragraph);
    blanks(`guided.boxes[${i}].text`, b.text, 1, 3);
    long(`${label} prompt`, b.divergent.prompt, 18);
  });
  para("Your turn", gd.your_turn.paragraph);
  if (gd.your_turn.choices.length < 3 || !gd.your_turn.choices.some((c) => c.correct)) {
    add("guided.your_turn.choices needs 3 to 5 choices with at least one correct.", "The check-the-boxes question is incomplete.");
  }

  return issues;
}
