# LitSketch

**An AmplifiED tool.** LitSketch turns a reading passage into printable, accessible doodle notes for grades 6 to 12, aligned to Florida B.E.S.T. ELA benchmarks.

A teacher pastes or uploads a passage, picks a grade and benchmark, and taps one button. They get:
- convergent notes,
- divergent notes,
- an answer key,
- and the passage with numbered paragraphs.

They can edit any of it on screen, then print, share, or save.

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

## How it works

| Piece | Where |
|---|---|
| 3-step flow | `components/flow/` |
| Benchmark list (105 Reading and Vocabulary benchmarks, grades 6–12) | `lib/standards/best-ela-6-12.json` |
| Generation prompt and JSON schema | `lib/ai/prompt.ts`, `lib/ai/schema.ts` |
| Quote, vocab, cloze, and length checks (one automatic retry) | `lib/ai/verify.ts` |
| Doodle-note templates (HTML and SVG) | `templates/` |
| Page styles shared by screen, print, and PDF | `styles/doodle.css` |
| Tagged PDF via headless Chromium | `app/api/pdf/route.ts` |
| Word, PDF, and text upload | `app/api/extract/route.ts` |

Pages are fixed letter-size sheets. Each sheet draws its own header and footer, so the benchmark code prints on every page in every browser.

A hidden print-size copy of the notes is measured after every edit:
- If a page is too full, its text shrinks slightly, never below 9.5pt.
- If a page still won't fit, a message appears above it so the teacher can shorten the text.
- Printing and the PDF both use this same copy.

## Tests

```bash
npx playwright test               # 7 device profiles, axe WCAG 2.2 AA checks, touch targets, PDF download
npx tsx scripts/check-verify.ts   # the quote checker catches invented quotes
node scripts/snapshot-pages.mjs   # saves a PNG of every printed page to test-results/pages
node scripts/snapshot-screens.mjs # saves screens at iPhone SE, iPad dark, and desktop high contrast
```

The tests can't replace a real device for VoiceOver, the Safari print dialog, or Add to Home Screen. Use `docs/device-checklist.md` for those.

## Deploy (Vercel)

1. Push this repo to GitHub as `litsketch`.
2. In Vercel, use **Add New → Project** and import the repo. The defaults are correct.
3. Add `OPENAI_API_KEY` under **Settings → Environment Variables**.
4. Every push to `main` deploys automatically.

PDF export uses `@sparticuz/chromium`. The route allows 60 seconds and needs about 1 GB of memory, which is the Vercel default.

## Benchmark source

The benchmark wording comes from the Florida B.E.S.T. ELA Standards (FLDOE). It was retrieved 2026-10-11 from the Achievement Standards Network listing. Spot-check it against the official FLDOE document before the pilot.
