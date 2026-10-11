import { DIVERGENT_SECTIONS, type Generation } from "./schema";

export type Issue = { repair: string; teacher: string };

/** Lowercase, straighten quotes and dashes, drop punctuation, collapse spaces. */
export function looseText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’‛`]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const BLANK = /_{3,}/g;

export function countBlanks(text: string): number {
  return (text.match(BLANK) ?? []).length;
}

function words(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length;
}

export function verifyGeneration(g: Generation, paragraphs: string[]): Issue[] {
  const issues: Issue[] = [];
  const whole = looseText(paragraphs.join(" "));
  const count = (label: string, n: number, min: number, max = min) => {
    if (n < min || n > max) {
      const want = min === max ? `exactly ${min}` : `${min} to ${max}`;
      issues.push({ repair: `${label} has ${n} items; it needs ${want}.`, teacher: `${label}: expected ${want} items, got ${n}.` });
    }
  };

  const c = g.convergent;
  count("convergent.vocab", c.vocab.length, 4);
  count("convergent.sequence", c.sequence.length, 4, 5);
  count("convergent.evidence", c.evidence.length, 3);
  count("convergent.checks", c.checks.length, 3);
  count("divergent.branches", g.divergent.branches.length, 6);
  count("divergent.what_ifs", g.divergent.what_ifs.length, 3);

  const sections = g.divergent_key.map((k) => k.section);
  for (const s of DIVERGENT_SECTIONS) {
    if (!sections.includes(s)) {
      issues.push({ repair: `divergent_key is missing the "${s}" section.`, teacher: `The answer key is missing look-fors for one section.` });
    }
  }

  const maxPara = paragraphs.length;
  const checkPara = (label: string, p: number) => {
    if (p < 1 || p > maxPara) {
      issues.push({ repair: `${label} cites ¶${p}, but the passage has ¶1-¶${maxPara}.`, teacher: `${label} points to a paragraph number that doesn't exist.` });
    }
  };

  c.evidence.forEach((e, i) => {
    checkPara(`Evidence ${i + 1}`, e.paragraph);
    const q = looseText(e.quote);
    if (q && !whole.includes(q)) {
      issues.push({
        repair: `evidence[${i}].quote is not word for word from the passage: "${e.quote}".`,
        teacher: `Evidence ${i + 1}: LitSketch could not find this quote word for word in your passage. Please check it.`,
      });
    }
    if (words(e.quote) > 30) issues.push({ repair: `evidence[${i}].quote is longer than 30 words.`, teacher: `Evidence ${i + 1}: the quote is long and may not fit.` });
  });

  c.vocab.forEach((v, i) => {
    checkPara(`Key word ${i + 1}`, v.paragraph);
    if (!whole.includes(looseText(v.word))) {
      issues.push({
        repair: `vocab[${i}].word "${v.word}" does not appear in the passage.`,
        teacher: `Key word "${v.word}" was not found in your passage.`,
      });
    }
  });
  c.checks.forEach((q, i) => checkPara(`Question ${i + 1}`, q.paragraph));

  const blanks = countBlanks(c.cloze.text);
  if (blanks !== c.cloze.answers.length) {
    issues.push({
      repair: `cloze.text has ${blanks} blanks but cloze.answers has ${c.cloze.answers.length}. They must match.`,
      teacher: `The fill-in summary has ${blanks} blanks but ${c.cloze.answers.length} answers.`,
    });
  }

  const tooLong = (label: string, s: string, max: number) => {
    if (words(s) > max + 4) issues.push({ repair: `${label} is ${words(s)} words; the limit is ${max}.`, teacher: `${label} is long and may not fit on the page.` });
  };
  tooLong("Big question", c.big_question, 18);
  c.checks.forEach((q, i) => tooLong(`Question ${i + 1}`, q.question, 18));
  g.divergent.branches.forEach((b, i) => tooLong(`Idea web prompt ${i + 1}`, b, 18));
  g.divergent.what_ifs.forEach((b, i) => tooLong(`What-if prompt ${i + 1}`, b, 18));
  c.vocab.forEach((v, i) => tooLong(`Definition ${i + 1}`, v.definition, 15));
  c.sequence.forEach((s, i) => tooLong(`Sequence starter ${i + 1}`, s.starter, 10));

  return issues;
}
