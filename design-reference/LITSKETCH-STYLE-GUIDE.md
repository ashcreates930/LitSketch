# LitSketch Doodle Notes: Style Guide for the Build

These example pages are the visual standard for every resource LitSketch generates. Open each HTML file, study the structure, and match this system. Do not invent a new look.

## Reference files

| File | Note type | Modeled on |
|---|---|---|
| `vocab.html` | Doodle vocabulary | Daily doodle vocabulary sets: label bar, meaning, story sentence, one task, and a large object students doodle inside |
| `storymap.html` | Story map (hub and orbit) | Spheres of the Earth doodle notes: center illustration, content circles, connector arrows |
| `guided.html` | Guided fill-in notes | Elements of a Story guided notebook: cloze sentences, four typed boxes, numbered page tab |
| `*-colored.png` | Colored previews | What a finished, student-colored page looks like; also used as product cover images |
| `doodle.css` | Shared design system | Tokens, hollow lettering, label bars, line-art classes, print rules |

Each HTML file is self-contained (fonts embedded) and works offline on iPad, iPhone, Mac, and Chromebook.

## The five signature moves (every page uses at least three)

1. **Write and doodle inside a big object.** The illustration is the organizer, not decoration. It should take up 35 to 50 percent of its row. The doodle prompt sits on a hand-lettered tag beside it: "Doodle ___ inside the ___."
2. **Hollow display lettering** for page titles and section headings (`.hollow`, Bowlby One, uppercase). Students color it in. Use `.hollow.sm` below about 1.8rem so the outline stays crisp.
3. **Black label bars** for numbered terms (`.bar`), like "1. SACRIFICE."
4. **Fill-in blanks** (`.blank`) for convergent and guided content. Each blank holds its answer, which stays invisible until the teacher taps Show answers. That is the answer key.
5. **Colorable black-and-white line art.** Every closed shape uses `fw` plus one color class (`f1` to `f6`). It prints white; Preview colored fills it.

## Non-negotiable rules

- **All text is real HTML text.** Never put words inside a generated image. Line art may be SVG; labels inside SVG use `<text>`.
- **Prints on one letter page** at 0.4-inch margins. Use the print block to scale down; check page count before shipping.
- **Prints in black and white.** Color appears only in Preview colored and in fills. Text is always ink on white.
- **Fonts:** Bowlby One (hollow display), Kalam (handwritten prompts and tags), Atkinson Hyperlegible (all instructions and reading text, chosen for low-vision readers). Nothing else.
- **No AI-look tells:** no cream backgrounds, no gradients, no drop shadows on content, no identical rounded cards, no decorative sparkles that carry no meaning. Hand-drawn frames use the uneven border radii in the examples.
- **Accessibility:** rem sizing, 44-point touch targets, `prefers-contrast: more` turns hollow letters solid, every SVG is `aria-hidden` or has `role="img"` with an `aria-label`, and no horizontal scrolling at 375px wide.
- **Apple:** safe-area insets, `apple-mobile-web-app-capable`, and print that works from Safari's share sheet.
- **Standards:** the B.E.S.T. benchmark code appears in the name bar of every page.
- **Footer:** "LitSketch by AmplifiED" on every page. AmplifiED is always one word with a capital ED.

## Toolbar (screen only, hidden in print)

`Preview colored` · `Show answers` · `Print`. Reuse `doodle.js` as written.

## How generation should work

1. The AI writes the content (words, meanings, sentences, blanks with answers, prompts) as JSON.
2. The app chooses a layout template (vocab, story map, guided, and the Phase 2 types) and an illustration from the illustration library that fits each word or idea.
3. The template renders the JSON into these exact HTML structures.

The AI never draws the page and never generates text as an image.

## Illustration library (build in Phase 1, grow over time)

Start with these coloring-ready SVG objects, drawn in the same line style as the examples (3px round strokes, slightly uneven lines, closed fillable regions):

gift box, treasure chest, picture frames, open book, locker, lunch bag, backpack, door, window, mirror, scroll banner, ribbon banner, sign post, speech bubble, thought cloud, light bulb, jar, suitcase, map, phone screen, envelope, heart, lightning bolt, house, city skyline, globe, two-person and one-person silhouettes.

Tag each object with keywords so the generator can match "treasure" to the chest and "sacrifice" to the gift box.

## Phase 2 layouts to build in this same system

Cornell doodle notes, compare and contrast (Venn), cause and effect chain, claim-evidence-reasoning, question and answer bubbles, and comic panels.
