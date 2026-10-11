@AGENTS.md

# LitSketch build rules

Read design-reference/LITSKETCH-STYLE-GUIDE.md and match the example pages exactly. Do not invent a new visual style.

- Reference pages: `design-reference/vocab.html`, `storymap.html`, `guided.html` (fonts embedded), plus `*-colored.png` previews and the shared `doodle.css` / `doodle.js`.
- Generated pages live in `templates/` and are styled by `styles/doodle.css`, which ports the reference CSS. Inside a sheet, sizes are in `em` so one sheet font-size scales the page for print and auto-fit.
- Work in phases. At the end of each phase, stop, summarize, and wait for approval.
