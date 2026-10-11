import data from "./best-ela-6-12.json";

export type Benchmark = {
  code: string;
  grade: number;
  topic: string;
  text: string;
};

export const GRADES = [6, 7, 8, 9, 10, 11, 12] as const;
export type Grade = (typeof GRADES)[number];

export const BENCHMARKS: Benchmark[] = data.benchmarks;

/** Plain-language names for the strand groups shown in the picker. */
export const GROUPS = [
  { key: "R.1", label: "Reading stories, poems, and plays" },
  { key: "R.2", label: "Reading informational texts" },
  { key: "R.3", label: "Reading across all kinds of texts" },
  { key: "V.1", label: "Vocabulary" },
] as const;

export function groupKey(code: string): string {
  // ELA.9.R.1.1 -> R.1
  const parts = code.split(".");
  return `${parts[2]}.${parts[3]}`;
}

export function findBenchmark(code: string): Benchmark | undefined {
  return BENCHMARKS.find((b) => b.code === code);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();
}

/** Benchmarks for a grade, filtered by a search that matches code, topic, or wording. */
export function searchBenchmarks(grade: number, query: string): Benchmark[] {
  const inGrade = BENCHMARKS.filter((b) => b.grade === grade);
  const q = normalize(query);
  if (!q) return inGrade;
  const words = q.split(" ").filter(Boolean);
  return inGrade.filter((b) => {
    const hay = normalize(`${b.code} ${b.topic} ${b.text}`);
    return words.every((w) => hay.includes(w));
  });
}
