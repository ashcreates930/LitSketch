import { GenerateRequestSchema } from "@/lib/ai/schema";
import { GenerationError, generateResource } from "@/lib/ai/generate";
import { findBenchmark } from "@/lib/standards";
import { MAX_WORDS, MIN_WORDS, wordCount } from "@/lib/passage";
import { clientKey, rateLimited, sameOrigin } from "@/lib/rate-limit";

export const maxDuration = 300;

function fail(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("This request came from outside LitSketch.", 403);
  if (rateLimited(`gen:${clientKey(req)}`, 30, 60 * 60 * 1000)) {
    return fail("You've made a lot of resources this hour. Please wait a few minutes and try again.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Something went wrong sending your passage. Please try again.", 400);
  }
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) return fail("Some of the information was missing. Please go back and check each step.", 400);
  const { title, paragraphs, grade, benchmarkCode } = parsed.data;

  const benchmark = findBenchmark(benchmarkCode);
  if (!benchmark || benchmark.grade !== grade) {
    return fail("Please choose a benchmark for the grade you picked.", 400);
  }
  const words = wordCount(paragraphs.join(" "));
  if (words < MIN_WORDS) return fail(`The passage needs at least ${MIN_WORDS} words.`, 400);
  if (words > MAX_WORDS) return fail(`The passage can be up to ${MAX_WORDS} words. Try a shorter section.`, 400);

  try {
    const result = await generateResource({ grade, benchmark, title, paragraphs });
    return Response.json(result);
  } catch (err) {
    console.error("generate failed", err);
    if (err instanceof GenerationError) return fail(err.message, 503);
    return fail("LitSketch couldn't finish writing your notes. Please try again in a minute.", 502);
  }
}
