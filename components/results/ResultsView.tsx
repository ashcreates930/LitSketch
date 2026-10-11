"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { LayoutKind, Resource, ThinkerMode } from "@/lib/ai/schema";
import type { View } from "@/lib/draft";
import { LSProvider, setAt, type Path } from "@/templates/context";
import { Document } from "@/templates/Document";
import { PassagePage } from "@/templates/PassagePage";
import { LAYOUT_NAMES } from "@/templates/parts";
import { Msg } from "@/components/Msg";
import { useHydrated } from "@/lib/useHydrated";
import { Toolbar } from "./Toolbar";

const MODES: { key: ThinkerMode; label: string; sub: string }[] = [
  { key: "convergent", label: "Convergent", sub: "Blanks and answers" },
  { key: "divergent", label: "Divergent", sub: "Open questions" },
];
const LAYOUTS: LayoutKind[] = ["vocab", "map", "guided"];

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  resource: Resource;
  onResourceChange: (r: Resource) => void;
  view: View;
  onViewChange: (v: Partial<View>) => void;
  onStartOver: () => void;
};

export function ResultsView({ headingRef, resource, onResourceChange, view, onViewChange, onStartOver }: Props) {
  const allParas = useMemo(() => resource.passage.paragraphs.map((_, i) => i), [resource.passage.paragraphs]);
  const [passageGroups, setPassageGroups] = useState<number[][]>([allParas]);
  const [overflow, setOverflow] = useState<string[]>([]);
  const mounted = useHydrated();
  const printRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const modeRefs = useRef<Record<ThinkerMode, HTMLButtonElement | null>>({ convergent: null, divergent: null });

  const update = useCallback(
    (path: Path, value: string) => onResourceChange(setAt(resource, path, value)),
    [resource, onResourceChange],
  );

  // Split the passage into printed pages by measuring it at paper size.
  useLayoutEffect(() => {
    if (!mounted) return;
    const run = () => {
      const sheet = measureRef.current?.querySelector<HTMLElement>(".sheet");
      const text = sheet?.querySelector<HTMLElement>(".ptext");
      const foot = sheet?.querySelector<HTMLElement>(".foot");
      const name = sheet?.querySelector<HTMLElement>(".namebar");
      if (!sheet || !text || !foot || !name) return;
      const top = text.getBoundingClientRect().top;
      const footTop = foot.getBoundingClientRect().top - 12;
      const firstCap = footTop - top;
      const restCap = footTop - name.getBoundingClientRect().bottom - 16;
      const groups: number[][] = [];
      let current: number[] = [];
      let start = top;
      let cap = firstCap;
      sheet.querySelectorAll<HTMLElement>(".para").forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (current.length && r.bottom - start > cap) {
          groups.push(current);
          current = [];
          start = r.top;
          cap = restCap;
        }
        current.push(i);
      });
      if (current.length) groups.push(current);
      if (groups.length) setPassageGroups((old) => (JSON.stringify(old) === JSON.stringify(groups) ? old : groups));
    };
    run();
    document.fonts?.ready.then(run);
  }, [mounted, resource.passage.paragraphs]);

  // Fit each printed sheet on one page: shrink a little (to 85%), then warn if it still won't fit.
  useLayoutEffect(() => {
    if (!mounted) return;
    const check = () => {
      const bad: string[] = [];
      printRef.current?.querySelectorAll<HTMLElement>(".sheet").forEach((sheet, i) => {
        sheet.style.fontSize = "";
        const base = parseFloat(getComputedStyle(sheet).fontSize);
        const over = () => sheet.scrollHeight > sheet.clientHeight + 1;
        for (let px = base - 0.25; over() && px >= base * 0.85; px -= 0.25) sheet.style.fontSize = `${px}px`;
        if (over()) bad.push(i === 0 ? LAYOUT_NAMES[view.layout] : `Passage page ${i}`);
      });
      setOverflow((old) => (old.join() === bad.join() ? old : bad));
    };
    check();
    document.fonts?.ready.then(check);
  }, [mounted, resource, passageGroups, view.layout, view.mode, view.answers, view.withPassage]);

  function onModeKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next: ThinkerMode = view.mode === "convergent" ? "divergent" : "convergent";
    onViewChange({ mode: next });
    modeRefs.current[next]?.focus();
  }

  const c = resource.content;
  const ctx = { resource, update, layout: view.layout, mode: view.mode, passageGroups };
  const sheetCount = 1 + (view.withPassage ? passageGroups.length : 0);

  return (
    <div className="container-wide">
      <div className="results-head">
        <h1 className="page-title" ref={headingRef} tabIndex={-1}>
          Your notes are ready
        </h1>
        <p className="lead" style={{ marginBottom: "0.75rem" }}>
          {c.title} · Grade {resource.grade} · {resource.benchmark.code}
        </p>
        {resource.demo && (
          <Msg kind="info">
            Sample mode: LitSketch is not connected to its writing service yet, so these are the sample-story notes.
          </Msg>
        )}
        {c.status === "needs_teacher_input" && <Msg kind="info">{c.teacher_message}</Msg>}
        {resource.warnings.length > 0 && (
          <div className="msg msg-info" role="note" style={{ display: "block" }}>
            <strong>Please check these before printing:</strong>
            <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.2rem" }}>
              {resource.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="view-controls">
        <div className="control">
          <p className="control-label" id="mode-label">
            Version
          </p>
          <div className="tabs tabs-2" role="tablist" aria-labelledby="mode-label">
            {MODES.map((m) => (
              <button
                key={m.key}
                ref={(el) => {
                  modeRefs.current[m.key] = el;
                }}
                id={`tab-${m.key}`}
                role="tab"
                type="button"
                className="tab"
                aria-selected={view.mode === m.key}
                aria-controls="doc-panel"
                tabIndex={view.mode === m.key ? 0 : -1}
                onClick={() => onViewChange({ mode: m.key })}
                onKeyDown={onModeKey}
              >
                {m.label}
                <small>{m.sub}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="control">
          <p className="control-label" id="layout-label">
            Try another layout
          </p>
          <div className="seg" role="group" aria-labelledby="layout-label">
            {LAYOUTS.map((l) => (
              <button
                key={l}
                type="button"
                className="seg-btn"
                aria-pressed={view.layout === l}
                onClick={() => onViewChange({ layout: l })}
              >
                {LAYOUT_NAMES[l]}
                {l === resource.suggestedLayout && <small>LitSketch&apos;s pick</small>}
              </button>
            ))}
          </div>
        </div>
        <label className="check" htmlFor="with-passage">
          <input
            id="with-passage"
            type="checkbox"
            checked={view.withPassage}
            onChange={(e) => onViewChange({ withPassage: e.target.checked })}
          />
          <span>Add the passage with numbered paragraphs as the last page</span>
        </label>
      </div>

      <Toolbar
        resource={resource}
        view={view}
        sheetCount={sheetCount}
        printRef={printRef}
        onViewChange={onViewChange}
        onStartOver={onStartOver}
      />

      <div id="doc-panel" role="tabpanel" aria-labelledby={`tab-${view.mode}`} className="tab-panel">
        {overflow.length > 0 && (
          <Msg kind="error">
            {overflow.join(" and ")} {overflow.length === 1 ? "has" : "have"} too much text to print on one page. Shorten some
            of the writing, or the bottom will be cut off.
          </Msg>
        )}
        <p className="msg msg-info edit-tip" aria-live="polite">
          <span>
            {view.editing ? (
              <>
                <strong>Teacher edit is on.</strong> Tap any outlined text and type. Changes are saved on this device and
                will print. The outlines never print.
              </>
            ) : (
              <>
                <strong>To change any words,</strong> turn on <strong>Teacher edit</strong> in the toolbar.
              </>
            )}
          </span>
        </p>
        <div className={`ls-screen${view.colored ? " colored" : ""}${view.answers ? " answers" : ""}`}>
          <LSProvider value={{ ...ctx, editable: view.editing }}>
            <Document withPassage={view.withPassage} />
          </LSProvider>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            {/* Exactly what prints and what goes into the PDF: always black and white. Hidden on screen. */}
            <div ref={printRef} className={`print-root ls-print${view.answers ? " answers" : ""}`} aria-hidden="true" inert>
              <LSProvider value={{ ...ctx, editable: false }}>
                <Document withPassage={view.withPassage} />
              </LSProvider>
            </div>
            <div ref={measureRef} className="measure-root ls-print" aria-hidden="true" inert>
              <LSProvider value={{ ...ctx, editable: false }}>
                <PassagePage indexes={allParas} n={1} total={1} />
              </LSProvider>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
