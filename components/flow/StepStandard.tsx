"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { Msg } from "@/components/Msg";
import { GRADES, GROUPS, findBenchmark, groupKey, searchBenchmarks } from "@/lib/standards";

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  grade: number | null;
  benchmarkCode: string | null;
  onChange: (patch: { grade?: number | null; benchmarkCode?: string | null }) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepStandard({ headingRef, grade, benchmarkCode, onChange, onBack, onNext }: Props) {
  const [query, setQuery] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [bmError, setBmError] = useState("");
  const gradeRef = useRef<HTMLSelectElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (grade ? searchBenchmarks(grade, query) : []), [grade, query]);
  const selected = benchmarkCode ? findBenchmark(benchmarkCode) : undefined;
  const selectedHidden = selected && !results.some((b) => b.code === selected.code);

  function next() {
    if (!grade) {
      setGradeError("Please choose a grade.");
      gradeRef.current?.focus();
      return;
    }
    if (!selected || selected.grade !== grade) {
      setBmError("Please choose one benchmark from the list.");
      searchRef.current?.focus();
      return;
    }
    onNext();
  }

  return (
    <section className="card" aria-labelledby="step2-title">
      <h1 className="page-title" id="step2-title" ref={headingRef} tabIndex={-1}>
        Choose grade and benchmark
      </h1>
      <p className="lead">Pick the grade you teach, then the Florida B.E.S.T. benchmark this lesson is for.</p>

      <div className="field">
        <label htmlFor="grade">Grade level</label>
        <select
          id="grade"
          ref={gradeRef}
          value={grade ?? ""}
          onChange={(e) => {
            const g = e.target.value ? Number(e.target.value) : null;
            // Benchmarks are grade-specific; keep the same skill when switching grades.
            const same = benchmarkCode && g ? benchmarkCode.replace(/^ELA\.\d+\./, `ELA.${g}.`) : null;
            onChange({ grade: g, benchmarkCode: same && findBenchmark(same) ? same : null });
            setGradeError("");
          }}
          aria-describedby="grade-error"
          aria-invalid={gradeError ? true : undefined}
        >
          <option value="">Choose a grade</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
        <Msg id="grade-error">{gradeError}</Msg>
      </div>

      <fieldset aria-describedby="bm-error">
        <legend>Benchmark</legend>
        {!grade ? (
          <p className="hint">Choose a grade first. Then the benchmarks for that grade will appear here.</p>
        ) : (
          <>
            <label htmlFor="bm-search" className="hint" style={{ display: "block" }}>
              Search by a word, like <em>theme</em> or <em>argument</em>, or by code, like <em>R.2.2</em>
            </label>
            <input
              id="bm-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            <p className="bm-count" aria-live="polite">
              {results.length === 0
                ? "No benchmarks match that search. Try a different word."
                : `Showing ${results.length} of 15 benchmarks for grade ${grade}.`}
            </p>
            {selectedHidden && (
              <p className="selected-note">
                <strong>Selected:</strong> {selected.code} ({selected.topic})
              </p>
            )}
            {GROUPS.map((g) => {
              const items = results.filter((b) => groupKey(b.code) === g.key);
              if (!items.length) return null;
              return (
                <fieldset key={g.key} className="bm-group">
                  <legend>{g.label}</legend>
                  <div className="bm-list">
                    {items.map((b) => (
                      <label key={b.code} className="choice">
                        <input
                          type="radio"
                          name="benchmark"
                          value={b.code}
                          checked={benchmarkCode === b.code}
                          onChange={() => {
                            onChange({ benchmarkCode: b.code });
                            setBmError("");
                          }}
                        />
                        <span className="choice-head">
                          <span className="choice-code">{b.code}</span> · {b.topic}
                        </span>
                        <span className="choice-text">{b.text}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </>
        )}
        <Msg id="bm-error">{bmError}</Msg>
      </fieldset>

      <div className="actions">
        <button type="button" className="btn" onClick={onBack}>
          Back
        </button>
        <span className="spacer" />
        <button type="button" className="btn btn-primary btn-big" onClick={next}>
          Next: Review and make notes
        </button>
      </div>
    </section>
  );
}
