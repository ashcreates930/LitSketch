import type { ReactNode } from "react";

/**
 * Small colorable icons for story-map circles and guided-note boxes.
 * city, people, heart, bolt, self, versus, nature, society are copied from
 * design-reference/storymap.html and guided.html; the rest follow the same style.
 */
export type ArtIcon = { key: string; tags: string[]; viewBox: string; body: ReactNode };

const T = "ln thin";

export const ICONS: ArtIcon[] = [
  {
    key: "city",
    tags: ["setting", "place", "city", "town", "where", "when", "time", "location", "world"],
    viewBox: "0 0 60 48",
    body: (
      <>
        <path className="fw f2" d="M6 44 L6 22 L16 22 L16 12 L26 12 L26 44 Z" />
        <path className="fw f6" d="M26 44 L26 6 L38 6 L38 44 Z" />
        <path className="fw f2" d="M38 44 L38 20 L54 20 L54 44 Z" />
        <path className={T} d="M30 12 v4 M34 12 v4 M30 22 v4 M34 22 v4 M42 26 h8 M42 34 h8 M10 28 h3 M10 36 h3" />
        <path className="ln" d="M2 44 H58" />
      </>
    ),
  },
  {
    key: "people",
    tags: ["characters", "character", "people", "who", "relationship", "family", "speaker", "audience", "groups"],
    viewBox: "0 0 60 48",
    body: (
      <>
        <circle className="fw f3" cx="20" cy="12" r="7" />
        <path className="fw f3" d="M8 44 C8 30 12 22 20 22 C28 22 32 30 32 44 Z" />
        <circle className="fw f2" cx="42" cy="13" r="6.5" />
        <path className="fw f2" d="M30 44 C30 31 34 23 42 23 C50 23 54 31 54 44 Z" />
      </>
    ),
  },
  {
    key: "heart",
    tags: ["resolution", "ending", "end", "feeling", "emotion", "love", "mood", "tone", "solve", "outcome"],
    viewBox: "0 0 60 48",
    body: (
      <>
        <path className="fw f4" d="M30 44 C14 32 6 24 6 15 C6 8 12 4 18 4 C24 4 28 8 30 12 C32 8 36 4 42 4 C48 4 54 8 54 15 C54 24 46 32 30 44 Z" />
        <path className={T} d="M14 14 C16 10 19 9 22 10" />
      </>
    ),
  },
  {
    key: "bolt",
    tags: ["conflict", "problem", "struggle", "climax", "tension", "turning point", "event", "change", "cause"],
    viewBox: "0 0 60 48",
    body: <path className="fw f5" d="M34 2 L14 26 L28 26 L22 46 L46 18 L32 18 Z" />,
  },
  {
    key: "self",
    tags: ["self", "inner", "internal", "feelings", "thoughts", "choice", "doubt", "narrator", "point of view", "perspective"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <circle className="fw f2" cx="26" cy="38" r="10" />
        <path className="fw f2" d="M10 62 C10 52 16 48 26 48 C36 48 42 52 42 62" />
        <path className="fw" d="M34 22 C30 22 28 18 31 15 C30 9 38 6 42 10 C46 5 56 8 54 14 C60 15 59 23 53 22 Z" />
        <circle className="fw" cx="36" cy="27" r="1.6" />
        <path className={T} d="M41 16 l6 0 M44 13 l0 6" />
      </>
    ),
  },
  {
    key: "versus",
    tags: ["versus", "against", "rival", "opposing", "argument", "counterclaim", "debate", "compare", "contrast", "character vs character"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <circle className="fw f3" cx="16" cy="30" r="8" />
        <path className="fw f3" d="M4 60 C4 48 8 42 16 42 C24 42 28 48 28 60" />
        <circle className="fw f2" cx="48" cy="30" r="8" />
        <path className="fw f2" d="M36 60 C36 48 40 42 48 42 C56 42 60 48 60 60" />
        <path className="ln" d="M27 14 L31 20 L28 22 L35 30 M37 14 L33 20 L36 22 L29 30" />
      </>
    ),
  },
  {
    key: "nature",
    tags: ["nature", "weather", "storm", "environment", "sea", "land", "animal", "survival", "outdoors", "imagery"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f4" d="M2 50 C10 40 18 40 26 50 C34 60 42 60 50 50 C54 45 58 44 62 46 L62 62 L2 62 Z" />
        <path className="fw f6" d="M40 6 C30 6 24 12 24 20 C24 26 28 30 34 32 L46 32 C52 30 56 26 56 20 C56 12 50 6 40 6 Z" />
        <path className="ln" d="M34 34 L30 42 M42 34 L38 44 M50 34 L46 42" />
      </>
    ),
  },
  {
    key: "society",
    tags: ["society", "rules", "law", "government", "power", "community", "school", "justice", "unfair", "history", "culture"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f5" d="M8 60 L8 24 L32 8 L56 24 L56 60 Z" />
        <path className="ln" d="M14 30 L14 54 M24 30 L24 54 M40 30 L40 54 M50 30 L50 54 M6 60 L58 60" />
        <circle className="fw f1" cx="32" cy="38" r="5" />
        <path className="fw f1" d="M24 60 C24 50 27 46 32 46 C37 46 40 50 40 60" />
      </>
    ),
  },
  {
    key: "book",
    tags: ["text", "story", "book", "author", "reading", "chapter", "title", "summary", "paraphrase", "literature"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f1" d="M32 14 C24 8 12 8 4 12 L4 54 C12 50 24 50 32 56 Z" />
        <path className="fw f1" d="M32 14 C40 8 52 8 60 12 L60 54 C52 50 40 50 32 56 Z" />
        <path className={T} d="M32 14 L32 56 M10 20 C16 18 22 18 26 20 M38 20 C42 18 48 18 54 20" />
      </>
    ),
  },
  {
    key: "bulb",
    tags: ["central idea", "main idea", "idea", "theme", "lesson", "message", "claim", "insight", "purpose", "point"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f1" d="M32 4 C20 4 12 12 12 24 C12 32 18 36 22 42 L42 42 C46 36 52 32 52 24 C52 12 44 4 32 4 Z" />
        <path className="fw f5" d="M22 42 L42 42 L40 52 L24 52 Z" />
        <path className={T} d="M26 58 L38 58 M4 10 l4 3 M60 10 l-4 3" />
      </>
    ),
  },
  {
    key: "search",
    tags: ["evidence", "detail", "details", "clue", "clues", "find", "support", "proof", "fact", "facts", "example"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <circle className="fw f2" cx="26" cy="26" r="18" />
        <path className={T} d="M16 20 C18 15 22 13 26 13" />
        <path className="fw f6" d="M38 40 L44 34 L60 50 L54 56 Z" />
      </>
    ),
  },
  {
    key: "clock",
    tags: ["sequence", "order", "time", "first", "next", "then", "timeline", "chronological", "history", "when"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <circle className="fw f6" cx="32" cy="34" r="26" />
        <circle className="fw" cx="32" cy="34" r="19" />
        <path className="ln" d="M32 22 L32 34 L41 39" />
        <path className={T} d="M20 6 l6 4 M44 6 l-6 4" />
      </>
    ),
  },
  {
    key: "steps",
    tags: ["structure", "steps", "process", "build", "develop", "development", "organization", "cause and effect", "problem and solution"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f3" d="M4 60 L4 44 L22 44 L22 60 Z" />
        <path className="fw f1" d="M22 60 L22 30 L40 30 L40 60 Z" />
        <path className="fw f4" d="M40 60 L40 14 L60 14 L60 60 Z" />
        <path className="ln" d="M8 34 C14 20 26 10 46 6 M40 2 L47 6 L42 12" />
      </>
    ),
  },
  {
    key: "speech",
    tags: ["dialogue", "speech", "say", "voice", "quote", "rhetoric", "persuade", "appeal", "speaker", "argument"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f2" d="M6 10 L58 8 L58 42 L28 42 L16 54 L18 42 L6 42 Z" />
        <path className={T} d="M16 20 L48 20 M16 30 L40 30" />
      </>
    ),
  },
  {
    key: "eye",
    tags: ["perspective", "point of view", "viewpoint", "observe", "see", "narrator", "imagery", "describe", "sensory"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f2" d="M4 32 C14 16 24 10 32 10 C40 10 50 16 60 32 C50 48 40 54 32 54 C24 54 14 48 4 32 Z" />
        <circle className="fw f4" cx="32" cy="32" r="11" />
        <circle className="fw f5" cx="32" cy="32" r="4" />
      </>
    ),
  },
  {
    key: "scale",
    tags: ["evaluate", "argument", "validity", "reasoning", "weigh", "judge", "fair", "balance", "effectiveness", "compare"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="ln" d="M32 6 L32 54 M10 16 L54 16 M20 60 L44 60" />
        <path className="fw f1" d="M2 34 L18 34 C18 42 2 42 2 34 Z" />
        <path className="fw f4" d="M46 34 L62 34 C62 42 46 42 46 34 Z" />
        <path className={T} d="M10 16 L4 34 M10 16 L16 34 M54 16 L48 34 M54 16 L60 34" />
      </>
    ),
  },
  {
    key: "star",
    tags: ["key", "important", "favorite", "best", "highlight", "figurative", "figurative language", "simile", "metaphor", "poem", "poetry"],
    viewBox: "0 0 64 64",
    body: <path className="fw f1" d="M32 4 L40 22 L60 24 L45 37 L49 58 L32 47 L15 58 L19 37 L4 24 L24 22 Z" />,
  },
  {
    key: "flag",
    tags: ["goal", "purpose", "want", "motivation", "aim", "author's purpose", "intent", "mission", "plan"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="ln" d="M12 4 L12 62" />
        <path className="fw f3" d="M12 6 L54 10 L44 22 L56 34 L12 32 Z" />
      </>
    ),
  },
  {
    key: "roots",
    tags: ["word", "words", "vocabulary", "root", "roots", "prefix", "suffix", "origin", "etymology", "meaning", "context"],
    viewBox: "0 0 64 64",
    body: (
      <>
        <path className="fw f4" d="M32 4 C18 4 10 14 12 24 C14 32 22 34 32 34 C42 34 50 32 52 24 C54 14 46 4 32 4 Z" />
        <path className="ln" d="M32 34 L32 50 M32 50 L18 60 M32 50 L46 60 M32 50 L32 62" />
      </>
    ),
  },
];

function words(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter((w) => w.length > 2);
}

/** Pick the icon whose tags best match a heading or hint, avoiding repeats on a page. */
export function pickIcon(hint: string, used: Set<string>): ArtIcon {
  const h = hint.toLowerCase();
  const ws = words(hint);
  let best = ICONS.find((i) => !used.has(i.key)) ?? ICONS[0];
  let bestScore = -1;
  for (const icon of ICONS) {
    if (used.has(icon.key)) continue;
    let s = 0;
    for (const t of [icon.key, ...icon.tags]) {
      if (h.includes(t)) s += t.includes(" ") ? 6 : 4;
      for (const w of ws) if (w === t) s += 2;
    }
    if (s > bestScore) {
      best = icon;
      bestScore = s;
    }
  }
  used.add(best.key);
  return best;
}

export function IconSvg({ icon }: { icon: ArtIcon }) {
  return (
    <svg className="art" viewBox={icon.viewBox} aria-hidden="true" focusable="false">
      {icon.body}
    </svg>
  );
}

/** Center book for the story map, and the theme ribbon (copied from storymap.html). */
export function CenterBook() {
  return (
    <svg className="art" viewBox="0 0 220 170" aria-hidden="true" focusable="false">
      <path className="fw f1" d="M110 30 C80 14 40 14 12 24 L12 150 C40 140 80 140 110 156 Z" />
      <path className="fw f1" d="M110 30 C140 14 180 14 208 24 L208 150 C180 140 140 140 110 156 Z" />
      <path className="ln thin" d="M110 30 L110 156 M24 38 C50 30 80 30 98 38 M122 38 C140 30 170 30 196 38" />
      <path className="ln thin" d="M20 160 l-8 6 M200 160 l8 6 M110 8 v-6 M80 10 l-4 -6 M140 10 l4 -6" />
    </svg>
  );
}

export function ThemeRibbon() {
  return (
    <svg className="art" viewBox="0 0 600 130" aria-hidden="true" focusable="false">
      <path className="fw f1" d="M12 40 L70 40 L70 110 L12 110 L34 75 Z" />
      <path className="fw f1" d="M588 40 L530 40 L530 110 L588 110 L566 75 Z" />
      <path className="fw f6" d="M70 110 L90 124 L90 112 Z M530 110 L510 124 L510 112 Z" />
      <path className="fw f6" d="M90 14 C200 4 400 4 510 14 L510 112 C400 104 200 104 90 112 Z" />
    </svg>
  );
}

export function MapArrows() {
  return (
    <svg className="arrows" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="ln thin dash" fill="none">
        <path d="M108 40 C130 26 170 26 192 40" />
        <path d="M262 106 C272 130 272 170 262 194" />
        <path d="M192 262 C170 276 130 276 108 262" />
      </g>
      <g className="ln" fill="none">
        <path d="M185 33 L193 41 L182 44" />
        <path d="M268 186 L262 195 L256 186" />
        <path d="M115 270 L107 262 L118 259" />
      </g>
    </svg>
  );
}

export function Squiggle() {
  return (
    <svg className="squig" viewBox="0 0 320 16" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="ln" d="M4 9 C24 1 40 15 60 8 S96 1 116 8 S152 15 172 8 S208 1 228 8 S264 15 284 8 S308 3 316 6" />
    </svg>
  );
}

/** Small speech bubble person for the "your own question" box on divergent pages. */
export function AskIcon() {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle className="fw f2" cx="20" cy="40" r="9" />
      <path className="fw f2" d="M6 63 C6 54 11 50 20 50 C29 50 34 54 34 63" />
      <path className="fw f1" d="M30 4 L60 4 L60 26 L44 26 L36 34 L37 26 L30 26 Z" />
      <path className="ln thin" d="M42 10 C42 7 48 7 48 10 C48 13 45 13 45 17 M45 21 v0.5" />
    </svg>
  );
}
