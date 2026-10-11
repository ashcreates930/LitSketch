// Sanity check: the sample content passes LitSketch's own quote and count checks,
// and a made-up quote is caught. Run: npx tsx scripts/check-verify.ts
import { verifyGeneration } from "../lib/ai/verify";
import { DEMO_GENERATION, DEMO_PASSAGE } from "../lib/ai/demo";
import { splitParagraphs } from "../lib/passage";

const paras = splitParagraphs(DEMO_PASSAGE);
const clean = verifyGeneration(DEMO_GENERATION, paras);
const bad = structuredClone(DEMO_GENERATION);
bad.convergent.evidence[0].quote = "The sea was a hungry wolf that night.";
const caught = verifyGeneration(bad, paras);
console.log("paragraphs:", paras.length, "| sample issues:", clean.length, "| invented quote caught:", caught.some((i) => i.repair.includes("not word for word")));
if (clean.length || !caught.length) { console.log(clean); process.exit(1); }
