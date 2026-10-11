import { z } from "zod";

/**
 * What the model writes: words only. Templates own layout and the app picks the art
 * (style guide, "How generation should work"). Blanks are written inline as [[answer]].
 * Every field is required (OpenAI strict structured outputs); counts are checked in verify.ts.
 */

const Para = z.number().int().describe("The ¶ number in the passage where students can find this.");

const Divergent = z.object({
  prompt: z.string().describe("Open prompt for the divergent version, 18 words or fewer, many good answers."),
  look_for: z.string().describe("For the teacher: what a strong answer includes, 12 words or fewer."),
});

const VocabWord = z.object({
  word: z.string().describe("A word from the passage, spelled exactly as it appears there."),
  part_of_speech: z.string().describe("e.g. noun, verb, adjective, noun or verb"),
  meaning: z.string().describe("Student-friendly meaning, 20 words or fewer."),
  sentence: z.string().describe("A sentence using the word about this passage, 22 words or fewer. Not a quote."),
  paragraph: Para,
  picture: z.string().describe("One concrete object that fits the word, e.g. gift box, treasure chest, door, mirror."),
  doodle_what: z
    .string()
    .describe("What students doodle, finishing the sentence 'Doodle ___ inside the <object>.' 12 words or fewer."),
  task: z.object({
    kind: z.enum(["circle", "sort", "finish"]),
    prompt: z.string().describe("Short instruction in the voice of a teacher, e.g. 'Circle the words that mean about the same as sacrifice.'"),
    chips: z
      .array(z.object({ text: z.string(), correct: z.boolean() }))
      .describe("circle only: 6 short words or phrases, 2 or 3 correct. Empty for other kinds."),
    sort_letters: z
      .array(z.object({ letter: z.string(), meaning: z.string() }))
      .describe("sort only: exactly 2 single letters and what each means, e.g. I = ironic. Empty otherwise."),
    sort_items: z
      .array(z.object({ text: z.string(), answer: z.string() }))
      .describe("sort only: 3 short statements, each answered with one of the letters. Empty otherwise."),
    finish: z
      .array(z.string())
      .describe("finish only: 2 sentences about the passage, each with exactly one [[answer]] blank. Empty otherwise."),
  }),
  divergent: Divergent,
});

export const GenerationSchema = z.object({
  status: z.enum(["ok", "needs_teacher_input"]),
  teacher_message: z.string().describe("Empty when status is ok. Otherwise a plain-language reason for the teacher."),
  title: z.string().describe("Title of the text, or a short descriptive title if none was given."),
  author: z.string().describe("Author if the passage or title states it; otherwise empty."),
  text_type: z.enum(["narrative", "informational", "poetry", "drama"]),
  topic_label: z.string().describe("2 to 4 word label for the skill, shown next to the benchmark code, e.g. 'Story elements'."),

  vocab: z.object({
    subtitle: z.string().describe("e.g. 'Words from The Gift of the Magi'"),
    words: z.array(VocabWord).describe("Exactly 3 words. Use a different task kind for each word."),
  }),

  map: z.object({
    title: z.string().describe("'Story Map' for stories and plays; 'Idea Map' for informational texts and poems."),
    how: z.string().describe("One or two sentences telling students how to use the map, 30 words or fewer."),
    center: z.array(z.string()).describe("Exactly 2 short lines for the open book in the middle, usually the title split in two."),
    orbits: z
      .array(
        z.object({
          heading: z.string().describe("One or two words, e.g. Setting, Characters, Conflict, Resolution, Key detail."),
          icon_hint: z.string().describe("One word naming a simple icon idea, e.g. city, people, storm, heart, clue."),
          lines: z
            .array(z.string())
            .describe("Exactly 2 short sentence frames, each with one [[answer]] blank, e.g. 'Where: [[New York City]]'."),
          paragraph: Para,
          divergent: Divergent,
        }),
      )
      .describe("Exactly 4 circles, in the order they connect around the map."),
    links: z
      .array(z.string())
      .describe("Exactly 3 connecting phrases for the arrows between circles 1→2, 2→3, 3→4, e.g. 'who wants…', 'but…', 'so then…'."),
    banner: z.object({
      heading: z.string().describe("e.g. Theme or Central idea"),
      starter: z.string().describe("Sentence starter students finish on a line, 16 words or fewer."),
      divergent: Divergent,
    }),
  }),

  guided: z.object({
    concept: z.string().describe("The concept this page teaches, 1 to 3 words, from the benchmark, e.g. Conflict, Setting, Central Idea."),
    lead: z
      .string()
      .describe("2 or 3 sentences defining the concept, with 3 to 5 [[answer]] blanks for key words."),
    boxes: z
      .array(
        z.object({
          label: z.string().describe("Box heading in capitals, 4 words or fewer, e.g. 'CHARACTER VS. SELF'."),
          icon_hint: z.string().describe("One word naming a simple icon idea."),
          text: z.string().describe("One or two sentences tied to this passage, with 2 [[answer]] blanks."),
          paragraph: Para,
          divergent: Divergent,
        }),
      )
      .describe("Exactly 4 boxes: the parts or kinds of the concept, each applied to the passage."),
    your_turn: z.object({
      prompt: z.string().describe("A question about the passage students answer by checking boxes."),
      choices: z.array(z.object({ text: z.string(), correct: z.boolean() })).describe("3 to 5 one- or two-word choices."),
      paragraph: Para,
      divergent: Divergent,
    }),
    doodle_prompt: z.string().describe("e.g. 'Doodle the moment the conflict is at its worst.' 14 words or fewer."),
  }),
});

export type Generation = z.infer<typeof GenerationSchema>;
export type VocabWordT = Generation["vocab"]["words"][number];

export type LayoutKind = "vocab" | "map" | "guided";
export type ThinkerMode = "convergent" | "divergent";

/** What the browser keeps for one finished resource. */
export type Resource = {
  id: string;
  createdAt: string;
  grade: number;
  benchmark: { code: string; topic: string; text: string };
  passage: { title: string; paragraphs: string[] };
  content: Generation;
  /** notebook page number on the guided-notes tab */
  notebookPage?: string;
  /** the layout LitSketch picked; the teacher can switch */
  suggestedLayout: LayoutKind;
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

/** Style-guide rule: V benchmarks get vocab, story elements in fiction get the story map, the rest get guided notes. */
export function pickLayout(benchmarkCode: string, textType: Generation["text_type"]): LayoutKind {
  if (/\.V\./.test(benchmarkCode)) return "vocab";
  if (/\.R\.1\./.test(benchmarkCode) && (textType === "narrative" || textType === "drama")) return "map";
  return "guided";
}
