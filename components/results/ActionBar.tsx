"use client";

import { useRef, useState, type RefObject } from "react";
import type { Resource } from "@/lib/ai/schema";
import { DOCS, type DocKind } from "@/templates/PageFrame";
import { Msg } from "@/components/Msg";
import { downloadFile, makePdf, pdfFileName, shareFile, shouldUseShareSheet } from "@/lib/share";

type Props = {
  resource: Resource;
  activeDoc: DocKind;
  pageCount: number;
  printRef: RefObject<HTMLDivElement | null>;
  onStartOver: () => void;
};

type PdfState =
  | { kind: "idle" }
  | { kind: "making" }
  | { kind: "ready"; file: File }
  | { kind: "done"; text: string }
  | { kind: "error"; text: string };

const ICON = {
  print: "M7 9V3h10v6 M7 17H4v-7h16v7h-3 M7 14h10v7H7z",
  share: "M12 3v12 M7 8l5-5 5 5 M5 12v8h14v-8",
  restart: "M4 4v6h6 M4.5 15a8 8 0 1 0 1.9-8.3L4 10",
};

function Svg({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ActionBar({ resource, activeDoc, pageCount, printRef, onStartOver }: Props) {
  const [pdf, setPdf] = useState<PdfState>({ kind: "idle" });
  const [confirming, setConfirming] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const restartRef = useRef<HTMLButtonElement>(null);
  const label = DOCS[activeDoc].label;
  const pages = `${pageCount} ${pageCount === 1 ? "page" : "pages"}`;

  function commitEdits() {
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  function print() {
    commitEdits();
    // Let React flush the last edit into the print copy before the dialog opens.
    requestAnimationFrame(() => window.print());
  }

  async function sendFile(file: File) {
    if (shouldUseShareSheet(file)) {
      try {
        const r = await shareFile(file, `${resource.content.title}: ${label}`);
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
    const doc = printRef.current?.querySelector(`[data-doc-wrap="${activeDoc}"] .ls-doc`);
    if (!doc) {
      setPdf({ kind: "error", text: "Something went wrong. Please use the Print button instead." });
      return;
    }
    try {
      const file = await makePdf(doc.outerHTML, `${resource.content.title}: ${label}`, pdfFileName(resource.content.title, label));
      await sendFile(file);
    } catch (err) {
      setPdf({ kind: "error", text: err instanceof Error ? err.message : "LitSketch couldn't make the PDF." });
    }
  }

  return (
    <div className="action-bar no-print">
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={print} aria-describedby="print-hint">
          <Svg d={ICON.print} /> Print
        </button>
        <button
          type="button"
          className="btn"
          onClick={savePdf}
          aria-disabled={pdf.kind === "making" || undefined}
          aria-describedby="pdf-msg"
        >
          <Svg d={ICON.share} />
          {pdf.kind === "making" ? "Making PDF…" : pdf.kind === "ready" ? "Share PDF now" : "Save or share PDF"}
        </button>
        {!confirming ? (
          <button
            type="button"
            className="btn"
            ref={restartRef}
            onClick={() => {
              setConfirming(true);
              requestAnimationFrame(() => confirmRef.current?.focus());
            }}
          >
            <Svg d={ICON.restart} /> Start over
          </button>
        ) : null}
      </div>
      <p className="hint" id="print-hint" style={{ margin: "0.5rem 0 0" }}>
        Print and PDF use the {label.toLowerCase()} ({pages}). Pick a different tab above to print the others.
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
            <button type="button" className="btn btn-primary" ref={confirmRef} onClick={onStartOver}>
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
