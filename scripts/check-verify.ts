// Sanity checks for LitSketch's content checker. Run: npx tsx scripts/check-verify.ts
import { fixCitations, normalizeStoryMap, verifyGeneration } from "../lib/ai/verify";
import { DEMO_GENERATION, DEMO_PASSAGE } from "../lib/ai/demo";
import { splitParagraphs } from "../lib/passage";

const paras = splitParagraphs(DEMO_PASSAGE);
let failed = 0;
const check = (name: string, ok: boolean) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  if (!ok) failed++;
};

// 1. The sample passes as is.
const fixedSample = fixCitations(normalizeStoryMap(DEMO_GENERATION), paras);
check("sample has no issues", verifyGeneration(fixedSample.content, paras).length === 0 && fixedSample.missing.length === 0);

// 2. Planted problems are caught.
const bad = structuredClone(DEMO_GENERATION);
bad.vocab.words[0].word = "melancholy"; // not in the passage
bad.guided.boxes[0].text = "No blanks here."; // missing [[answer]]
bad.map.orbits[0].paragraph = 40; // no such paragraph
bad.map.orbits[1].lines[0] = "What does Mara want [[the lamp lit]]?"; // a question, not a frame
const caught = verifyGeneration(bad, paras).map((i) => i.repair);
check("missing word caught", caught.some((r) => r.includes("melancholy")));
check("missing blanks caught", caught.some((r) => r.includes("guided.boxes[0].text")));
check("nonexistent ¶ caught", caught.some((r) => r.includes("¶40")));
check("question frame caught", caught.some((r) => r.includes("is a question")));

// 3. Wrong ¶ numbers are corrected from the clue; duplicates stay only where the evidence really is.
const wrong = structuredClone(DEMO_GENERATION);
wrong.map.orbits[2].paragraph = 1; // conflict clue is really in ¶3
wrong.guided.boxes[3].paragraph = 4; // already right
wrong.vocab.words[1].paragraph = 6; // "groaned" is in ¶2
const fixed = fixCitations(wrong, paras).content;
check("conflict ¶ corrected to 3", fixed.map.orbits[2].paragraph === 3);
check("vocab ¶ corrected to 2", fixed.vocab.words[1].paragraph === 2);
check("correct ¶ left alone", fixed.guided.boxes[3].paragraph === 4);
const noClue = structuredClone(DEMO_GENERATION);
noClue.map.orbits[0].clue = "words that are not in the story at all";
check("invented clue flagged", fixCitations(noClue, paras).missing.length === 1);

// 4. Story maps always run Setting, Characters, Conflict, Resolution with the reference connectors.
const shuffled = structuredClone(DEMO_GENERATION);
shuffled.map.orbits = [shuffled.map.orbits[2], shuffled.map.orbits[0], shuffled.map.orbits[3], shuffled.map.orbits[1]];
shuffled.map.links = ["and…", "then…", "finally…"];
const ordered = normalizeStoryMap(shuffled);
check("circles reordered", ordered.map.orbits.map((o) => o.heading).join(",") === "Setting,Characters,Conflict,Resolution");
check("content moved with its circle", ordered.map.orbits[2].lines[0].includes("vent"));
check("connectors fixed", ordered.map.links.join(" ") === "who wants… but… so then…");


// 5. One page sending every prompt to ¶1 is flagged for a retry.
const lazy = structuredClone(DEMO_GENERATION);
lazy.map.orbits.forEach((o) => (o.paragraph = 1));
check("all-¶1 story map flagged", verifyGeneration(lazy, paras).some((i) => i.repair.includes("4 of 4 items cite ¶1")));
process.exit(failed ? 1 : 0);
