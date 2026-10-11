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

export const STORY_HEADINGS = ["Setting", "Characters", "Conflict", "Resolution"] as const;
export const STORY_LINKS = ["who wants…", "but…", "so then…"] as const;

export function isStory(g: Generation): boolean {
  return g.text_type === "narrative" || g.text_type === "drama";
}

/**
 * Story maps always run Setting → Characters → Conflict → Resolution with the
 * connectors "who wants…", "but…", "so then…" (design-reference/storymap.html).
 * If the model used those headings in another order, put the circles back in order.
 */
export function normalizeStoryMap(g: Generation): Generation {
  if (!isStory(g)) return g;
  const map = { ...g.map, title: "Story Map", links: [...STORY_LINKS] };
  const key = (h: string) => looseText(h).replace(/s$/, "");
  const wanted = STORY_HEADINGS.map((h) => key(h));
  const found = map.orbits.map((o) => key(o.heading));
  if (wanted.every((w) => found.includes(w)) && map.orbits.length === 4) {
    map.orbits = wanted.map((w) => map.orbits[found.indexOf(w)]);
  }
  map.orbits = map.orbits.map((o, i) => (i < 4 ? { ...o, heading: STORY_HEADINGS[i] } : o));
  return { ...g, map };
}

/** The 1-based paragraph that contains this text (whole words, loose punctuation), or 0. */
function locate(needle: string, paragraphs: string[], prefer: number): number {
  const n = ` ${looseText(needle)} `;
  if (n.trim().length === 0) return 0;
  const has = (i: number) => ` ${looseText(paragraphs[i - 1] ?? "")} `.includes(n);
  if (prefer >= 1 && prefer <= paragraphs.length && has(prefer)) return prefer;
  for (let i = 1; i <= paragraphs.length; i++) if (has(i)) return i;
  return 0;
}

/**
 * Every ¶ cue must point at the paragraph where the evidence really is.
 * Each cited item carries a short clue copied from the passage; we find it and
 * correct the number. Vocabulary words are found the same way.
 * Returns the corrected content and the items whose evidence could not be found.
 */
export function fixCitations(g: Generation, paragraphs: string[]): { content: Generation; missing: Issue[] } {
  const missing: Issue[] = [];
  const fix = <T extends { paragraph: number; clue?: string }>(item: T, needle: string, label: string, path: string): T => {
    const at = locate(needle, paragraphs, item.paragraph);
    if (at) return at === item.paragraph ? item : { ...item, paragraph: at };
    missing.push({
      repair: `${path}: the clue "${needle}" is not copied word for word from the passage. Copy 3 to 12 exact words from the paragraph that holds the answer.`,
      teacher: `${label}: LitSketch couldn't confirm the ¶ number. Check that ¶${item.paragraph} has the answer.`,
    });
    return item;
  };

  const content: Generation = {
    ...g,
    vocab: {
      ...g.vocab,
      words: g.vocab.words.map((w, i) => fix(w, w.word, `Vocab word "${w.word}"`, `vocab.words[${i}].word`)),
    },
    map: {
      ...g.map,
      orbits: g.map.orbits.map((o, i) => fix(o, o.clue, `Map circle ${i + 1} (${o.heading})`, `map.orbits[${i}].clue`)),
    },
    guided: {
      ...g.guided,
      boxes: g.guided.boxes.map((b, i) => fix(b, b.clue, `Guided box ${i + 1} (${b.label})`, `guided.boxes[${i}].clue`)),
      your_turn: fix(g.guided.your_turn, g.guided.your_turn.clue, "Your turn", "guided.your_turn.clue"),
    },
  };
  return { content, missing };
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
    if (!Number.isInteger(p) || p < 1 || p > max) {
      add(`${label} cites ¶${p}, but the passage has ¶1-¶${max}.`, `${label} points to a paragraph that doesn't exist.`);
    }
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
    if (!whole.includes(` ${looseText(w.word)} `)) add(`vocab.words[${i}].word "${w.word}" does not appear in the passage.`, `Key word "${w.word}" was not found in your passage.`);
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
    count(`map.orbits[${i}].lines`, o.lines.length, 2);
    o.lines.forEach((l, j) => {
      if (countBlanks(l) !== 1) add(`map.orbits[${i}].lines[${j}] needs exactly one [[answer]] blank.`, `${label} line ${j + 1} is missing its blank.`);
      if (/\?\s*$/.test(l.replace(/\[\[[^\]]*\]\]/g, ""))) {
        add(`map.orbits[${i}].lines[${j}] is a question. Write a fill-in sentence frame instead, like 'Where: [[...]]'.`, `${label} line ${j + 1} is a question instead of a fill-in.`);
      }
    });
    long(`${label} prompt`, o.divergent.prompt, 18);
  });
  if (isStory(g)) {
    m.orbits.forEach((o, i) => {
      if (o.heading !== STORY_HEADINGS[i]) add(`map.orbits must be ${STORY_HEADINGS.join(", ")} in that order.`, "The story map circles are out of order.");
    });
  }

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
