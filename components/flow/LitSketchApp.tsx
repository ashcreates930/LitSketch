"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { StepPassage } from "./StepPassage";
import { StepStandard } from "./StepStandard";
import { StepGenerate } from "./StepGenerate";
import { ResultsView } from "@/components/results/ResultsView";
import { useHydrated } from "@/lib/useHydrated";
import { EMPTY_DRAFT, clearDraft, loadDraft, saveDraft, type Draft } from "@/lib/draft";
import { splitParagraphs } from "@/lib/passage";
import { findBenchmark } from "@/lib/standards";
import type { Generation, Resource } from "@/lib/ai/schema";
import { DEMO_BENCHMARK, DEMO_GRADE, DEMO_PASSAGE, DEMO_TITLE } from "@/lib/ai/demo";

export function LitSketchApp() {
  const loaded = useHydrated();
  // Only read once the page is hydrated: nothing draft-specific renders before then.
  const [draft, setDraft] = useState<Draft>(() => {
    const saved = typeof window === "undefined" ? null : loadDraft();
    if (!saved) return EMPTY_DRAFT;
    return saved.step === 4 && !saved.resource ? { ...saved, step: 3 } : saved;
  });
  const [busy, setBusy] = useState(false);
  const [genError, setGenError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (loaded) saveDraft(draft);
  }, [draft, loaded]);

  // After moving between steps, put keyboard and VoiceOver focus on the new heading.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [draft.step]);

  const patch = useCallback((p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p })), []);
  const go = (step: Draft["step"]) => {
    moved.current = true;
    patch({ step });
  };

  async function generate() {
    if (!draft.grade || !draft.benchmarkCode) return go(2);
    const bm = findBenchmark(draft.benchmarkCode);
    if (!bm) return go(2);
    const paragraphs = splitParagraphs(draft.text);
    setBusy(true);
    setGenError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draft.title, paragraphs, grade: draft.grade, benchmarkCode: bm.code }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        content?: Generation;
        warnings?: string[];
        demo?: boolean;
      };
      if (!res.ok || !data.content) throw new Error(data.error || "LitSketch couldn't finish your notes. Please try again.");
      const resource: Resource = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        createdAt: new Date().toISOString(),
        grade: draft.grade,
        benchmark: { code: bm.code, topic: bm.topic, text: bm.text },
        passage: { title: draft.title, paragraphs },
        content: { ...data.content, title: draft.title.trim() || data.content.title },
        warnings: data.warnings ?? [],
        demo: !!data.demo,
      };
      moved.current = true;
      patch({ resource, step: 4, activeDoc: "convergent" });
    } catch (err) {
      setGenError(
        err instanceof TypeError
          ? "LitSketch couldn't reach the internet. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!loaded) {
    return <div className="container" aria-busy="true" />;
  }

  if (draft.step === 4 && draft.resource) {
    return (
      <ResultsView
        headingRef={headingRef}
        resource={draft.resource}
        onResourceChange={(resource) => patch({ resource })}
        activeDoc={draft.activeDoc}
        onActiveDocChange={(activeDoc) => patch({ activeDoc })}
        onStartOver={() => {
          clearDraft();
          moved.current = true;
          setDraft({ ...EMPTY_DRAFT });
        }}
      />
    );
  }

  const step = (draft.step === 4 ? 3 : draft.step) as 1 | 2 | 3;
  return (
    <div className="container">
      <StepIndicator step={step} />
      {step === 1 && (
        <StepPassage
          headingRef={headingRef}
          title={draft.title}
          text={draft.text}
          agreed={draft.agreed}
          onChange={patch}
          onNext={() => go(2)}
          onSample={() =>
            patch({ title: DEMO_TITLE, text: DEMO_PASSAGE, agreed: true, grade: DEMO_GRADE, benchmarkCode: DEMO_BENCHMARK })
          }
        />
      )}
      {step === 2 && (
        <StepStandard
          headingRef={headingRef}
          grade={draft.grade}
          benchmarkCode={draft.benchmarkCode}
          onChange={patch}
          onBack={() => go(1)}
          onNext={() => go(3)}
        />
      )}
      {step === 3 && draft.grade && draft.benchmarkCode && (
        <StepGenerate
          headingRef={headingRef}
          title={draft.title}
          text={draft.text}
          grade={draft.grade}
          benchmarkCode={draft.benchmarkCode}
          busy={busy}
          error={genError}
          onBack={() => go(2)}
          onGenerate={generate}
        />
      )}
    </div>
  );
}
