"use client";

import { useRef, useState, type RefObject } from "react";
import type { Resource } from "@/lib/ai/schema";
import type { View } from "@/lib/draft";
import { LAYOUT_NAMES } from "@/templates/parts";
import { Msg } from "@/components/Msg";
import { downloadFile, makePdf, pdfFileName, shareFile, shouldUseShareSheet } from "@/lib/share";

type Props = {
  resource: Resource;
  view: View;
  sheetCount: number;
  printRef: RefObject<HTMLDivElement | null>;
  onViewChange: (v: Partial<View>) => void;
  onStartOver: () => void;
};

type PdfState =
  | { kind: "idle" }
  | { kind: "making" }
  | { kind: "ready"; file: File }
  | { kind: "done"; text: string }
  | { kind: "error"; text: string };

/**
 * The reference toolbar (design-reference/doodle.js): Preview colored · Show answers · Print,
 * plus Save or share PDF and Start over. Screen only.
 */
export function Toolbar({ resource, view, sheetCount, printRef, onViewChange, onStartOver }: Props) {
  const [pdf, setPdf] = useState<PdfState>({ kind: "idle" });
  const [confirming, setConfirming] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const restartRef = useRef<HTMLButtonElement>(null);
  const name = LAYOUT_NAMES[view.layout];
  const modeName = view.mode === "convergent" ? "Convergent" : "Divergent";
  const docLabel = `${name} ${modeName}${view.answers ? " answer key" : ""}`;
  const pages = `${sheetCount} ${sheetCount === 1 ? "page" : "pages"}`;

  function commitEdits() {
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  function print() {
    commitEdits();
    requestAnimationFrame(() => window.print());
  }

  async function sendFile(file: File) {
    if (shouldUseShareSheet(file)) {
      try {
        const r = await shareFile(file, `${resource.content.title}: ${docLabel}`);
        setPdf(r === "shared" ? { kind: "done", text: "Shared." } : { kind: "ready", file });
      } catch {
        // Safari needs a fresh tap after a slow download; offer one.
        setPdf({ kind: "ready", file });
      }
    } else {
      downloadFile(file);
      setPdf({ kind: "done", text: `Saved "${file.name}" to your downloads.` });
    }
  }

  async function savePdf() {
    if (pdf.kind === "making") return;
    if (pdf.kind === "ready") return sendFile(pdf.file);
    commitEdits();
    setPdf({ kind: "making" });
    await new Promise((r) => requestAnimationFrame(r));
    const doc = printRef.current?.querySelector(".ls-doc");
    if (!doc) {
      setPdf({ kind: "error", text: "Something went wrong. Please use the Print button instead." });
      return;
    }
    try {
      const file = await makePdf(
        doc.outerHTML,
        `${resource.content.title}: ${docLabel}`,
        pdfFileName(resource.content.title, docLabel),
        view.answers,
      );
      await sendFile(file);
    } catch (err) {
      setPdf({ kind: "error", text: err instanceof Error ? err.message : "LitSketch couldn't make the PDF." });
    }
  }

  return (
    <div className="toolbar no-print" role="toolbar" aria-label="Page tools">
      <div className="toolbar-row">
        <span className="name">{name}</span>
        <div className="actions">
          <button type="button" className="btn" aria-pressed={view.editing} onClick={() => onViewChange({ editing: !view.editing })}>
            Teacher edit
          </button>
          <button type="button" className="btn" aria-pressed={view.colored} onClick={() => onViewChange({ colored: !view.colored })}>
            Preview colored
          </button>
          <button
            type="button"
            className="btn"
            aria-pressed={view.answers}
            onClick={() => onViewChange({ answers: !view.answers })}
            aria-describedby="answers-hint"
          >
            Show answers
          </button>
          <button type="button" className="btn solid" onClick={print} aria-describedby="print-hint">
            Print
          </button>
          <button
            type="button"
            className="btn"
            onClick={savePdf}
            aria-disabled={pdf.kind === "making" || undefined}
            aria-describedby="pdf-msg"
          >
            {pdf.kind === "making" ? "Making PDF…" : pdf.kind === "ready" ? "Share PDF now" : "Save or share PDF"}
          </button>
          {!confirming && (
            <button
              type="button"
              className="btn"
              ref={restartRef}
              onClick={() => {
                setConfirming(true);
                requestAnimationFrame(() => confirmRef.current?.focus());
              }}
            >
              Start over
            </button>
          )}
        </div>
      </div>
      <p className="hint" id="print-hint">
        Print and PDF give you {pages} in black and white
        {view.answers ? ", with the answers showing in red. That copy is your answer key." : "."}
      </p>
      <p className="sr-only" id="answers-hint">
        Shows the answers in red on the page. Print while answers are showing to get an answer key.
      </p>
      <Msg id="pdf-msg" kind={pdf.kind === "error" ? "error" : pdf.kind === "done" ? "success" : "info"}>
        {pdf.kind === "making"
          ? "Making your PDF. This takes a few seconds…"
          : pdf.kind === "ready"
            ? "Your PDF is ready. Tap “Share PDF now” to AirDrop it, email it, or save it to Files."
            : pdf.kind === "done" || pdf.kind === "error"
              ? pdf.text
              : null}
      </Msg>
      {confirming && (
        <div className="msg msg-info" role="group" aria-labelledby="restart-q" style={{ display: "block" }}>
          <p id="restart-q" style={{ margin: "0 0 0.6rem" }}>
            <strong>Start over?</strong> This clears these notes from this device. Print or save anything you need first.
          </p>
          <div className="actions" style={{ marginTop: 0 }}>
            <button type="button" className="btn solid" ref={confirmRef} onClick={onStartOver}>
              Yes, start over
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setConfirming(false);
                requestAnimationFrame(() => restartRef.current?.focus());
              }}
            >
              No, keep my notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
