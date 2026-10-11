"use client";

import { useLS } from "./context";
import { Sheet } from "./parts";

/** A piece of one paragraph placed on a page. Only the first piece carries the ¶ number. */
export type PassageChunk = { i: number; text: string; first: boolean };

/**
 * The teacher's passage with ¶ numbers that match the "Find the clue in ¶4" cues.
 * It flows over as many pages as it needs; each page repeats the title and page number.
 * `probe` renders the one-paragraph measuring copy used to paginate.
 */
export function PassagePage({ chunks, n, total, probe = false }: { chunks: PassageChunk[]; n: number; total: number; probe?: boolean }) {
  const { resource } = useLS();
  const paras = resource.passage.paragraphs;
  return (
    <Sheet kind="passage" label={`Passage, page ${n} of ${total}`} footRight={`Passage · page ${n} of ${total}`}>
      <div className="phead">
        <h2 className="hollow sm ptitle">{resource.content.title}</h2>
        <p className="ppage">
          Passage · page {n} of {total}
        </p>
      </div>
      <div className="ptext">
        {chunks.map((c, k) => (
          <p key={`${c.i}-${k}`} className={`para${c.first ? "" : " cont"}${probe ? " probe" : ""}`} data-para={c.i}>
            <span className="pn" aria-hidden={c.first ? undefined : true}>
              {c.first ? (
                <>
                  {/* Bowlby One's ¶ looks like a 1, so the mark uses the reading font */}
                  <span className="pmark">¶</span>
                  {c.i + 1}
                </>
              ) : (
                ""
              )}
            </span>
            <span className="pt">{probe ? c.text : c.text || paras[c.i]}</span>
          </p>
        ))}
      </div>
    </Sheet>
  );
}

/**
 * Split paragraphs into pages using a measuring copy at paper size.
 * `height(text)` returns the rendered height of one paragraph with that text.
 * A paragraph may continue on the next page, but its ¶ number always stays with
 * at least two lines of its text.
 */
export function paginatePassage(
  paragraphs: string[],
  capacity: number,
  gap: number,
  lineHeight: number,
  height: (text: string) => number,
): PassageChunk[][] {
  const pages: PassageChunk[][] = [];
  let page: PassageChunk[] = [];
  let used = 0;
  const newPage = () => {
    if (page.length) pages.push(page);
    page = [];
    used = 0;
  };

  paragraphs.forEach((para, i) => {
    let words = para.split(" ");
    let first = true;
    while (words.length) {
      const extra = page.length ? gap : 0;
      const whole = words.join(" ");
      if (used + extra + height(whole) <= capacity) {
        page.push({ i, text: whole, first });
        used += extra + height(whole);
        return;
      }
      // Fit as many words as the rest of this page holds.
      const room = capacity - used - extra;
      let lo = 0;
      let hi = words.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (height(words.slice(0, mid).join(" ")) <= room) lo = mid;
        else hi = mid - 1;
      }
      // Keep a paragraph's opening (and its ¶ number) to at least two lines; otherwise start a fresh page.
      if (page.length && (room < lineHeight * 2.2 || lo < 6)) {
        newPage();
        continue;
      }
      if (lo === 0) lo = 1; // a single giant word: place it anyway
      page.push({ i, text: words.slice(0, lo).join(" "), first });
      first = false;
      words = words.slice(lo);
      newPage();
    }
  });
  newPage();
  return pages;
}
