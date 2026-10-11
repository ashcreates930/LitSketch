"use client";

import { useEffect, useState, type RefObject } from "react";
import { Msg } from "@/components/Msg";
import { findBenchmark } from "@/lib/standards";
import { splitParagraphs, wordCount } from "@/lib/passage";

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  title: string;
  text: string;
  grade: number;
  benchmarkCode: string;
  busy: boolean;
  error: string;
  /** shown in production, or once the server asks for it */
  showCode: boolean;
  accessCode: string;
  codeError: string;
  codeRef: RefObject<HTMLInputElement | null>;
  onAccessCodeChange: (code: string) => void;
  onBack: () => void;
  onGenerate: () => void;
};

const YOU_GET = [
  { name: "Convergent doodle notes", desc: "step-by-step frames with one best answer, for students who like structure" },
  { name: "Divergent doodle notes", desc: "open idea webs and “what if” spaces, for students who like to explore" },
  { name: "An answer key", desc: "answers for the convergent notes and look-fors for the divergent notes" },
];

export function StepGenerate({
  headingRef,
  title,
  text,
  grade,
  benchmarkCode,
  busy,
  error,
  showCode,
  accessCode,
  codeError,
  codeRef,
  onAccessCodeChange,
  onBack,
  onGenerate,
}: Props) {
  const bm = findBenchmark(benchmarkCode);
  const paragraphs = splitParagraphs(text);

  return (
    <section className="card" aria-labelledby="step3-title">
      <h1 className="page-title" id="step3-title" ref={headingRef} tabIndex={-1}>
        Ready to make your notes
      </h1>
      <p className="lead">Check that this looks right, then press the button.</p>

      <dl className="summary">
        <div>
          <dt>Passage</dt>
          <dd>
            {title.trim() || "Untitled passage"}: {wordCount(text).toLocaleString()} words, {paragraphs.length}{" "}
            {paragraphs.length === 1 ? "paragraph" : "paragraphs"}
          </dd>
        </div>
        <div>
          <dt>Grade</dt>
          <dd>Grade {grade}</dd>
        </div>
        <div>
          <dt>Benchmark</dt>
          <dd>
            <strong>{bm?.code}</strong> · {bm?.topic}: {bm?.text}
          </dd>
        </div>
      </dl>

      <h2 style={{ fontSize: "1.15rem", margin: "0 0 0.6rem" }}>You will get</h2>
      <ul className="you-get">
        {YOU_GET.map((g) => (
          <li key={g.name}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              <strong>{g.name}</strong>: {g.desc}
            </span>
          </li>
        ))}
      </ul>
      <p className="hint">Every page prints in black and white with the benchmark code on it. You can change any words before printing.</p>

      {showCode && (
        <div className="field" style={{ marginTop: "1.25rem", marginBottom: 0 }}>
          <label htmlFor="access-code">Teacher access code</label>
          <p className="hint" id="access-hint">
            Type the code you were given. This device will remember it.
          </p>
          <input
            id="access-code"
            ref={codeRef}
            type="text"
            value={accessCode}
            onChange={(e) => onAccessCodeChange(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="access-hint access-error"
            aria-invalid={codeError ? true : undefined}
            style={{ maxWidth: "20rem" }}
          />
          <Msg id="access-error">{codeError}</Msg>
        </div>
      )}

      <div className="actions">
        <button type="button" className="btn" onClick={onBack} disabled={busy}>
          Back
        </button>
        <span className="spacer" />
        <button
          type="button"
          className="btn btn-primary btn-big"
          onClick={() => !busy && onGenerate()}
          aria-disabled={busy || undefined}
          aria-describedby="gen-status gen-error"
        >
          {busy ? (
            <>
              <span className="working" aria-hidden="true" /> Making your notes…
            </>
          ) : error ? (
            "Try again"
          ) : (
            "Make my doodle notes"
          )}
        </button>
      </div>
      <Msg id="gen-status" kind="info">
        {busy ? "Writing your notes. This usually takes under a minute. Please keep this page open." : null}
      </Msg>
      {busy && <Elapsed />}
      <Msg id="gen-error">{error}</Msg>
    </section>
  );
}

/** Shows a running count once generation takes longer than usual. Mounted only while busy. */
function Elapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return seconds >= 20 ? <p className="hint">{seconds} seconds so far…</p> : null;
}
