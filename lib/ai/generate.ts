import "server-only";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ResponseInputItem } from "openai/resources/responses/responses";
import type { Benchmark } from "@/lib/standards";
import { GenerationSchema, type Generation } from "./schema";
import { SYSTEM_PROMPT, buildRepairMessage, buildUserMessage } from "./prompt";
import { verifyGeneration } from "./verify";
import { DEMO_GENERATION } from "./demo";

export const DEFAULT_MODEL = "gpt-5.4-mini";

export function demoModeActive(): boolean {
  if (process.env.OPENAI_API_KEY) return false;
  return process.env.NODE_ENV !== "production" || process.env.LITSKETCH_DEMO === "1";
}

export type GenerateResult = { content: Generation; warnings: string[]; demo: boolean };

export class GenerationError extends Error {}

export async function generateResource(args: {
  grade: number;
  benchmark: Benchmark;
  title: string;
  paragraphs: string[];
}): Promise<GenerateResult> {
  if (demoModeActive()) {
    return { content: DEMO_GENERATION, warnings: [], demo: true };
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new GenerationError("LitSketch is not set up to write content yet (missing OpenAI key).");
  }

  const client = new OpenAI({ timeout: 150_000, maxRetries: 1 });
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const effort = process.env.OPENAI_REASONING_EFFORT || "low";
  const format = zodTextFormat(GenerationSchema, "litsketch_resource");

  const input: ResponseInputItem[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserMessage(args) },
  ];

  let content: Generation | null = null;
  let issues: ReturnType<typeof verifyGeneration> = [];

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await client.responses.parse({
      model,
      input,
      text: { format },
      ...(effort !== "none" ? { reasoning: { effort: effort as "low" | "medium" | "high" | "minimal" } } : {}),
    });
    const parsed = response.output_parsed;
    if (!parsed) throw new GenerationError("The writing service sent back an empty answer.");
    content = parsed;
    issues = verifyGeneration(parsed, args.paragraphs);
    if (issues.length === 0 || parsed.status !== "ok") break;
    input.push(
      { role: "assistant", content: JSON.stringify(parsed) },
      { role: "user", content: buildRepairMessage(issues.map((i) => i.repair)) },
    );
  }

  return { content: content!, warnings: issues.map((i) => i.teacher), demo: false };
}
