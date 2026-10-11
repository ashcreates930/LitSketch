import { z } from "zod";

/**
 * The content the model writes. Templates own all layout; this is text only.
 * Every field is required (OpenAI strict structured outputs); counts are checked in verify.ts.
 */
export const DIVERGENT_SECTIONS = [
  "central",
  "branches",
  "sketch",
  "what_if",
  "connect",
  "author",
  "show_it",
] as const;

export const GenerationSchema = z.object({
  status: z.enum(["ok", "needs_teacher_input"]),
  teacher_message: z
    .string()
    .describe("Empty string when status is ok. Otherwise a plain-language reason for the teacher."),
  title: z.string().describe("Title of the text, or a short descriptive title if none was given."),
  text_type: z.enum(["narrative", "informational", "poetry", "drama"]),
  benchmark_summary: z
    .string()
    .describe("Student-friendly 'I can' statement for the benchmark, 16 words or fewer, starting with 'I can'."),
  convergent: z.object({
    big_question: z.string(),
    vocab: z
      .array(
        z.object({
          word: z.string().describe("A word that appears in the passage, spelled exactly as it appears."),
          definition: z.string(),
          paragraph: z.number().int(),
        }),
      )
      .describe("Exactly 4 items."),
    sequence_label: z
      .string()
      .describe("Heading for the sequence chain, e.g. 'How the plot unfolds' or 'How the central idea builds'."),
    sequence: z
      .array(z.object({ starter: z.string(), answer: z.string() }))
      .describe("4 or 5 steps, in the order they happen in the passage."),
    evidence: z
      .array(
        z.object({
          claim: z.string(),
          paragraph: z.number().int(),
          quote: z.string().describe("Copied word for word from the passage."),
          explanation: z.string(),
        }),
      )
      .describe("Exactly 3 items."),
    cloze: z.object({
      text: z
        .string()
        .describe("A 3 to 5 sentence summary of the passage with each blank written as ___ (three underscores)."),
      answers: z.array(z.string()).describe("One answer per blank, in order."),
      distractors: z.array(z.string()).describe("1 or 2 extra words for the word bank that do not fit any blank."),
    }),
    checks: z
      .array(z.object({ question: z.string(), answer: z.string(), paragraph: z.number().int() }))
      .describe("Exactly 3 items."),
    sum_it_up: z.string(),
  }),
  divergent: z.object({
    central_prompt: z.string(),
    branches: z.array(z.string()).describe("Exactly 6 short open prompts."),
    sketch_prompt: z.string(),
    what_ifs: z.array(z.string()).describe("Exactly 3 prompts, each starting with 'What if'."),
    connect_prompt: z.string(),
    author_prompt: z.string(),
    show_it_prompt: z.string(),
  }),
  divergent_key: z
    .array(
      z.object({
        section: z.enum(DIVERGENT_SECTIONS),
        look_fors: z.array(z.string()).describe("2 to 4 things a strong response includes."),
        sample: z.string().describe("One example response. Many answers are correct."),
      }),
    )
    .describe("Exactly one item for each section, in this order: central, branches, sketch, what_if, connect, author, show_it."),
});

export type Generation = z.infer<typeof GenerationSchema>;

/** What the browser keeps for one finished resource. */
export type Resource = {
  id: string;
  createdAt: string;
  grade: number;
  benchmark: { code: string; topic: string; text: string };
  passage: { title: string; paragraphs: string[] };
  content: Generation;
  warnings: string[];
  demo: boolean;
};

/** Request body for /api/generate. */
export const GenerateRequestSchema = z.object({
  title: z.string().max(200),
  paragraphs: z.array(z.string().max(6000)).min(1).max(400),
  grade: z.number().int().min(6).max(12),
  benchmarkCode: z.string().regex(/^ELA\.\d{1,2}\.(R|V)\.\d\.\d$/),
});
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
