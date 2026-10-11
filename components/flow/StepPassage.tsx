"use client";

import { useRef, useState, type ChangeEvent, type RefObject } from "react";
import { Msg } from "@/components/Msg";
import { MAX_WORDS, MIN_WORDS, wordCount } from "@/lib/passage";

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  title: string;
  text: string;
  agreed: boolean;
  onChange: (patch: { title?: string; text?: string; agreed?: boolean; heading?: string[] }) => void;
  onNext: () => void;
  onSample: () => void;
};

export function StepPassage({ headingRef, title, text, agreed, onChange, onNext, onSample }: Props) {
  const [textError, setTextError] = useState("");
  const [agreeError, setAgreeError] = useState("");
  const [upload, setUpload] = useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);
  const words = wordCount(text);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUpload({ kind: "info", text: `Reading "${file.name}"…` });
    try {
      let extracted = "";
      let heading: string[] = [];
      if (file.name.toLowerCase().endsWith(".txt")) {
        extracted = (await file.text()).trim();
      } else {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/extract", { method: "POST", body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "That file could not be read.");
        extracted = data.text;
        heading = Array.isArray(data.heading) ? data.heading : [];
      }
      if (!extracted) throw new Error("That file has no text in it. Please paste the passage instead.");
      // The title comes from the teacher or the AI, never from the file name.
      onChange({ text: extracted, heading });
      setTextError("");
      setUpload({ kind: "success", text: `Added the text from "${file.name}". Check it below; you can change anything.` });
    } catch (err) {
      setUpload({ kind: "error", text: err instanceof Error ? err.message : "That file could not be read." });
    }
  }

  function next() {
    let firstBad: HTMLElement | null = null;
    if (words < MIN_WORDS) {
      setTextError(
        words === 0
          ? "Please paste a passage or upload a file."
          : `This passage has ${words} words. LitSketch needs at least ${MIN_WORDS} words to make good notes.`,
      );
      firstBad = textRef.current;
    } else if (words > MAX_WORDS) {
      setTextError(`This passage has ${words} words. Please use ${MAX_WORDS} words or fewer; try one chapter or section.`);
      firstBad = textRef.current;
    } else setTextError("");

    if (!agreed) {
      setAgreeError("Please check this box to continue.");
      firstBad ??= agreeRef.current;
    } else setAgreeError("");

    if (firstBad) firstBad.focus();
    else onNext();
  }

  return (
    <section className="card" aria-labelledby="step1-title">
      <h1 className="page-title" id="step1-title" ref={headingRef} tabIndex={-1}>
        Add your reading passage
      </h1>
      <p className="lead">Paste the text your students will read, or upload a file.</p>

      <div className="field">
        <label htmlFor="title">
          Title of the text <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <input id="title" type="text" autoComplete="off" value={title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>

      <div className="field">
        <label htmlFor="passage">Passage</label>
        <p className="hint" id="passage-hint">
          Leave a blank line between paragraphs so they are numbered correctly.
        </p>
        <textarea
          id="passage"
          ref={textRef}
          value={text}
          onChange={(e) => {
            onChange({ text: e.target.value });
            if (textError) setTextError("");
          }}
          aria-describedby="passage-hint passage-count passage-error"
          aria-invalid={textError ? true : undefined}
          spellCheck={false}
        />
        <div className="meta-row">
          <span id="passage-count">{words === 1 ? "1 word" : `${words.toLocaleString()} words`}</span>
          <button type="button" className="btn-link" onClick={onSample}>
            No passage handy? Try a sample story
          </button>
        </div>
        <Msg id="passage-error">{textError}</Msg>
      </div>

      <div className="field">
        <div className="upload">
          <input
            id="upload"
            type="file"
            accept=".docx,.pdf,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFile}
            aria-describedby="upload-hint upload-msg"
          />
          <span className="btn" aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 16V4 M7 9l5-5 5 5 M4 15v4h16v-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload a file instead
          </span>
          <label htmlFor="upload" className="sr-only">
            Upload a file instead
          </label>
        </div>
        <p className="hint" id="upload-hint" style={{ marginTop: "0.5rem" }}>
          Word (.docx), PDF, or plain text (.txt), up to 4 MB.
        </p>
        <Msg id="upload-msg" kind={upload?.kind ?? "info"}>
          {upload?.text}
        </Msg>
      </div>

      <div className="field">
        <label className="check" htmlFor="agree">
          <input
            id="agree"
            ref={agreeRef}
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              onChange({ agreed: e.target.checked });
              if (e.target.checked) setAgreeError("");
            }}
            aria-describedby="agree-error"
            aria-invalid={agreeError ? true : undefined}
          />
          <span>
            I am allowed to use this passage with my students. It is my own copy of the text, or a public-domain work.
          </span>
        </label>
        <Msg id="agree-error">{agreeError}</Msg>
      </div>

      <div className="actions">
        <span className="spacer" />
        <button type="button" className="btn btn-primary btn-big" onClick={next}>
          Next: Choose grade and benchmark
        </button>
      </div>
    </section>
  );
}
