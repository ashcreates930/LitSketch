import { GenerateRequestSchema, pickLayout } from "@/lib/ai/schema";
import { GenerationError, generateResource } from "@/lib/ai/generate";
import { findBenchmark } from "@/lib/standards";
import { MAX_WORDS, MIN_WORDS, wordCount } from "@/lib/passage";
import { clientKey, overLimit, rateLimited, recordFailure, sameOrigin } from "@/lib/rate-limit";
import { checkAccessCode } from "@/lib/access";

export const maxDuration = 300;

const HOUR = 60 * 60 * 1000;

function fail(message: string, status: number, field?: "accessCode") {
  return Response.json({ error: message, field }, { status });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("This request came from outside LitSketch.", 403);
  const who = clientKey(req);
  // Too many wrong codes from one address: stop guessing for an hour.
  if (overLimit(`code:${who}`, 10, HOUR)) {
    return fail("Too many tries with the wrong access code. Please wait an hour, or ask for the code again.", 429, "accessCode");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Something went wrong sending your passage. Please try again.", 400);
  }
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) return fail("Some of the information was missing. Please go back and check each step.", 400);
  const { title, paragraphs, grade, benchmarkCode, accessCode, titleHint } = parsed.data;

  // Layer 1: teacher access code, checked here on the server.
  const access = checkAccessCode(accessCode);
  if (!access.ok) {
    if (access.status === 401 && accessCode?.trim()) recordFailure(`code:${who}`, HOUR);
    return fail(access.error, access.status, access.status === 401 ? "accessCode" : undefined);
  }
  // Layer 2: per-address limit on generations.
  if (rateLimited(`gen:${who}`, 30, HOUR)) {
    return fail("You've made a lot of resources this hour. Please wait a few minutes and try again.", 429);
  }

  const benchmark = findBenchmark(benchmarkCode);
  if (!benchmark || benchmark.grade !== grade) {
    return fail("Please choose a benchmark for the grade you picked.", 400);
  }
  const words = wordCount(paragraphs.join(" "));
  if (words < MIN_WORDS) return fail(`The passage needs at least ${MIN_WORDS} words.`, 400);
  if (words > MAX_WORDS) return fail(`The passage can be up to ${MAX_WORDS} words. Try a shorter section.`, 400);

  try {
    const result = await generateResource({ grade, benchmark, title, titleHint, paragraphs });
    // One rule, decided here: V benchmarks always open on vocab (see pickLayout).
    return Response.json({ ...result, suggestedLayout: pickLayout(benchmark.code, result.content.text_type) });
  } catch (err) {
    console.error("generate failed", err);
    if (err instanceof GenerationError) return fail(err.message, 503);
    return fail("LitSketch couldn't finish writing your notes. Please try again in a minute.", 502);
  }
}
