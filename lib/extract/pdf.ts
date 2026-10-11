import "server-only";
import { getDocumentProxy } from "unpdf";

/**
 * Rebuild real paragraphs from a PDF. PDFs store wrapped lines, not paragraphs, so a
 * plain text dump turns each page into one giant "paragraph" and every ¶ cue points
 * at ¶1. Here a new paragraph starts at a bigger-than-usual line gap or an indent.
 * Centered lines above the body on page 1 (title, author) are returned separately
 * so they don't become ¶1 and ¶2.
 */
export type PdfText = { text: string; heading: string[] };

type Line = { y: number; x: number; right: number; text: string };

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function pageLines(pdf: Awaited<ReturnType<typeof getDocumentProxy>>, n: number): Promise<Line[]> {
  const page = await pdf.getPage(n);
  const { items } = await page.getTextContent();
  const lines: Line[] = [];
  for (const it of items) {
    if (!("str" in it) || !it.str) continue;
    const x = it.transform[4];
    const y = it.transform[5];
    let line = lines.find((l) => Math.abs(l.y - y) < 2);
    if (!line) lines.push((line = { y, x, right: x, text: "" }));
    // Items on one line arrive left to right; keep a space between words.
    if (line.text && !/\s$/.test(line.text) && !/^\s/.test(it.str) && x > line.right + 1) line.text += " ";
    line.text += it.str;
    line.x = Math.min(line.x, x);
    line.right = Math.max(line.right, x + (it.width ?? 0));
  }
  return lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+/g, " ").trim() }))
    .filter((l) => l.text && !/^\d{1,4}$/.test(l.text)) // drop bare page numbers
    .sort((a, b) => b.y - a.y);
}

function joinLine(para: string, next: string): string {
  if (!para) return next;
  if (/[A-Za-z]-$/.test(para)) return para.slice(0, -1) + next; // re-join hyphenated words
  return `${para} ${next}`;
}

export async function extractPdf(bytes: Uint8Array): Promise<PdfText> {
  const pdf = await getDocumentProxy(bytes);
  const pages: Line[][] = [];
  for (let n = 1; n <= pdf.numPages; n++) pages.push(await pageLines(pdf, n));

  const all = pages.flat();
  const left = median(all.map((l) => l.x));
  const gaps = pages.flatMap((ls) => ls.slice(1).map((l, i) => ls[i].y - l.y)).filter((g) => g > 0);
  const lineGap = median(gaps) || 12;

  // Title and author: short, centered lines at the very top of page 1.
  const heading: string[] = [];
  const first = pages[0] ?? [];
  while (first.length && first[0].x > left + 40 && first[0].text.length < 80 && heading.length < 3) {
    heading.push(first.shift()!.text);
  }

  const paragraphs: string[] = [];
  let current = "";
  pages.forEach((lines) => {
    lines.forEach((line, i) => {
      const gap = i === 0 ? null : lines[i - 1].y - line.y;
      const indented = line.x > left + 8;
      const startsPage = i === 0;
      const prevEnded = /[.?!:"'”’)]$/.test(current);
      const newPara =
        !current ||
        indented ||
        (gap !== null && gap > lineGap * 1.35) ||
        (startsPage && prevEnded); // a paragraph that crosses a page break stays together
      if (newPara && current) {
        paragraphs.push(current);
        current = "";
      }
      current = joinLine(current, line.text);
    });
  });
  if (current) paragraphs.push(current);

  return { text: paragraphs.join("\n\n"), heading };
}
