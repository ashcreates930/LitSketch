// Sanity check: the sample content passes LitSketch's own checks, and problems are caught.
// Run: npx tsx scripts/check-verify.ts
import { verifyGeneration } from "../lib/ai/verify";
import { DEMO_GENERATION, DEMO_PASSAGE } from "../lib/ai/demo";
import { splitParagraphs } from "../lib/passage";

const paras = splitParagraphs(DEMO_PASSAGE);
const clean = verifyGeneration(DEMO_GENERATION, paras);

const bad = structuredClone(DEMO_GENERATION);
bad.vocab.words[0].word = "melancholy"; // not in the passage
bad.guided.boxes[0].text = "No blanks here."; // missing [[answer]]
bad.map.orbits[0].paragraph = 40; // no such paragraph
const caught = verifyGeneration(bad, paras).map((i) => i.repair);

console.log("paragraphs:", paras.length, "| sample issues:", clean.length, "| planted problems caught:", caught.length);
if (clean.length || caught.length !== 3) {
  console.log(clean, caught);
  process.exit(1);
}
