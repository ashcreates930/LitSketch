# LitSketch

**An AmplifiED tool.** LitSketch turns a reading passage into printable, accessible doodle notes for grades 6 to 12, aligned to Florida B.E.S.T. ELA benchmarks.

A teacher pastes or uploads a passage, picks a grade and benchmark, and taps one button. LitSketch writes content for three doodle-note layouts and opens the best fit for the benchmark. The teacher can switch layouts with one tap:
- **Doodle vocabulary:** 3 words, each with a big object to doodle inside.
- **Story map** (an Idea map for nonfiction): circles around a center book, linked by retell phrases.
- **Guided notes:** a concept with fill-in blanks, four typed boxes, Your Turn, and a doodle frame.

Each layout comes in two versions:
- **Convergent:** blanks with hidden answers, plus circle and sort tasks.
- **Divergent:** open prompts, teacher look-fors, and a "my own question" bubble.

The toolbar matches the reference pages:
- **Preview colored.**
- **Show answers.** Print with it on to get the answer key.
- **Print.**

The passage with numbered paragraphs is an optional last page, on by default. Prompts point to it, for example "Find the clue in ¶4."

**Visual standard:** `design-reference/LITSKETCH-STYLE-GUIDE.md` and the example pages in `design-reference/`. Match them exactly; do not invent a new style.

## Run it locally

```bash
npm install
npx playwright install chromium webkit   # for tests and icon rendering
cp .env.example .env.local               # add OPENAI_API_KEY; leave it blank for sample mode
npm run dev
```

With no `OPENAI_API_KEY`, development runs in **sample mode**: every request returns the built-in sample story's notes. Use this to try the flow without spending API credits.

## Environment variables

See `.env.example`. `OPENAI_API_KEY` is only read on the server (`lib/ai/generate.ts` imports `server-only`). Never give it a `NEXT_PUBLIC_` prefix.

**Teacher access code.** Set `LITSKETCH_ACCESS_CODE` before sharing the deployed link. Teachers type it on step 3; this device remembers it after it works once.
- The server checks the code on every generation (`lib/access.ts`), comparing in constant time.
- Wrong codes get a plain message next to the field.
- Ten wrong tries from one address in an hour lock that address out for the hour.
- The per-address limit of 30 generations an hour still applies as a second layer.
- In production, if the variable is missing, generation is off rather than open.

**Illustration review:** `/illustrations` shows every object and icon with its keywords and the Preview colored toggle. It is not indexed by search engines.

## How it works

| Piece | Where |
|---|---|
| 3-step flow | `components/flow/` |
| Benchmark list (105 Reading and Vocabulary benchmarks, grades 6–12) | `lib/standards/best-ela-6-12.json` |
| Generation prompt and JSON schema | `lib/ai/prompt.ts`, `lib/ai/schema.ts` |
| Vocab, blank, count, ¶, and length checks (one automatic retry) | `lib/ai/verify.ts` |
| Page templates: vocab, story map, guided, passage | `templates/` |
| Illustration library: 28 objects and 19 icons, tagged by keyword | `templates/art/` |
| Page styles shared by screen, print, and PDF | `styles/doodle.css` |
| Tagged PDF via headless Chromium | `app/api/pdf/route.ts` |
| Word, PDF, and text upload | `app/api/extract/route.ts` |

Each layout prints on one letter page at 0.4-inch margins, in black and white. The benchmark code is in the name bar and "LitSketch by AmplifiED" is in the footer.

A hidden print-size copy is measured after every edit:
- If a page is too full, its text shrinks a little, never below 85%.
- If it still won't fit, a message asks the teacher to shorten it.
- Printing and the PDF both use that copy.

## Tests

```bash
npx playwright test               # 7 device profiles, axe WCAG 2.2 AA checks, touch targets, PDF download
npx tsx scripts/check-verify.ts   # the checker catches missing words, blanks, and ¶ numbers
node scripts/snapshot-pages.mjs   # PNG of every layout in both modes, plus colored and answer views
node scripts/snapshot-screens.mjs # saves screens at iPhone SE, iPad dark, and desktop high contrast
```

The tests can't replace a real device for VoiceOver, the Safari print dialog, or Add to Home Screen. Use `docs/device-checklist.md` for those.

## Deploy (Vercel)

1. The repo is on GitHub at `ashcreates930/LitSketch`.
2. In Vercel, use **Add New → Project** and import the repo. The defaults are correct.
3. Add `OPENAI_API_KEY` under **Settings → Environment Variables**.
4. Every push to `main` deploys automatically.

PDF export uses `@sparticuz/chromium`. The route allows 60 seconds and needs about 1 GB of memory, which is the Vercel default.

## Benchmark source

The benchmark wording comes from the official FLDOE document, *Florida B.E.S.T. Standards: English Language Arts* (elabeststandardsfinal.pdf), grade-level sections for grades 6–12, Reading and Vocabulary strands. Checked 2026-10-11.
