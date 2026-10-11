"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { Resource } from "@/lib/ai/schema";
import { LSProvider, setAt, type Path } from "@/templates/context";
import { DOCS, PageFrame, type DocKind } from "@/templates/PageFrame";
import { Document } from "@/templates/Document";
import { PassageBody } from "@/templates/passage/PassagePage";
import { Msg } from "@/components/Msg";
import { useHydrated } from "@/lib/useHydrated";
import { ActionBar } from "./ActionBar";

const ORDER: DocKind[] = ["convergent", "divergent", "key"];
const TAB_SUB: Record<DocKind, string> = {
  convergent: "Step by step",
  divergent: "Open-ended",
  key: "For you",
};

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  resource: Resource;
  onResourceChange: (r: Resource) => void;
  activeDoc: DocKind;
  onActiveDocChange: (d: DocKind) => void;
  onStartOver: () => void;
};

export function ResultsView({ headingRef, resource, onResourceChange, activeDoc, onActiveDocChange, onStartOver }: Props) {
  const allParas = useMemo(() => resource.passage.paragraphs.map((_, i) => i), [resource.passage.paragraphs]);
  const [passageGroups, setPassageGroups] = useState<number[][]>([allParas]);
  const [overflow, setOverflow] = useState<string[]>([]);
  const [wide, setWide] = useState(false);
  const mounted = useHydrated();
  const screenRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<DocKind, HTMLButtonElement | null>>({ convergent: null, divergent: null, key: null });

  const update = useCallback(
    (path: Path, value: string) => onResourceChange(setAt(resource, path, value)),
    [resource, onResourceChange],
  );

  // Show the two-column "paper" layout on screen only when there is room at the reader's text size.
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setWide(el.clientWidth / rem >= 40);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Split the passage into printed pages by measuring it at paper size.
  useLayoutEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const run = () => {
      const root = measureRef.current;
      const body = root?.querySelector<HTMLElement>(".ls-body");
      if (!body || cancelled) return;
      const avail = body.clientHeight;
      const paras = Array.from(body.querySelectorAll<HTMLElement>(".ls-passage-p"));
      const groups: number[][] = [];
      let current: number[] = [];
      let startTop = 0;
      paras.forEach((p, i) => {
        const top = p.offsetTop;
        const bottom = top + p.offsetHeight;
        if (current.length && bottom - startTop > avail) {
          groups.push(current);
          current = [];
          startTop = top;
        }
        if (!current.length) startTop = top;
        current.push(i);
      });
      if (current.length) groups.push(current);
      if (groups.length) setPassageGroups((old) => (JSON.stringify(old) === JSON.stringify(groups) ? old : groups));
    };
    run();
    document.fonts?.ready.then(run);
    return () => {
      cancelled = true;
    };
  }, [mounted, resource.passage.paragraphs]);

  // Fit each printed page on one sheet: shrink text a little (never below 9.5pt),
  // and list any page that still will not fit so the teacher can shorten it.
  useLayoutEffect(() => {
    if (!mounted) return;
    const check = () => {
      const root = printRef.current;
      if (!root) return;
      const bad: string[] = [];
      root.querySelectorAll<HTMLElement>(".ls-page").forEach((page) => {
        const body = page.querySelector<HTMLElement>(".ls-body");
        if (!body) return;
        const over = () => body.scrollHeight > body.clientHeight + 2;
        page.style.fontSize = "";
        for (let pt = 10.5; over() && pt >= 9.5; pt -= 0.5) page.style.fontSize = `${pt}pt`;
        if (over()) bad.push(page.dataset.pageId ?? "");
      });
      setOverflow((old) => (old.join() === bad.join() ? old : bad));
    };
    check();
    document.fonts?.ready.then(check);
  }, [mounted, resource, passageGroups]);

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    const i = ORDER.indexOf(activeDoc);
    let next: DocKind | null = null;
    if (e.key === "ArrowRight") next = ORDER[(i + 1) % ORDER.length];
    if (e.key === "ArrowLeft") next = ORDER[(i + ORDER.length - 1) % ORDER.length];
    if (e.key === "Home") next = ORDER[0];
    if (e.key === "End") next = ORDER[ORDER.length - 1];
    if (next) {
      e.preventDefault();
      onActiveDocChange(next);
      tabRefs.current[next]?.focus();
    }
  }

  const c = resource.content;
  const screenCtx = { resource, editable: true, update, passageGroups };
  const printCtx = { resource, editable: false, update, passageGroups };
  const pageCount = (doc: DocKind) => (doc === "key" ? 2 : 2 + passageGroups.length);
  const overflowHere = overflow.filter((id) => id.startsWith(`${activeDoc}-`));

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
        <p className="msg msg-info">
          <span>
            <strong>To change any words,</strong> tap the text on a page (it has a dotted outline) and type. Your changes
            are saved on this device and will print.
          </span>
        </p>
      </div>

      <div className="tabs" role="tablist" aria-label="Choose which notes to see">
        {ORDER.map((doc) => (
          <button
            key={doc}
            ref={(el) => {
              tabRefs.current[doc] = el;
            }}
            id={`tab-${doc}`}
            role="tab"
            type="button"
            className="tab"
            aria-selected={activeDoc === doc}
            aria-controls="doc-panel"
            tabIndex={activeDoc === doc ? 0 : -1}
            onClick={() => onActiveDocChange(doc)}
            onKeyDown={onTabKey}
          >
            {DOCS[doc].label}
            <small>{TAB_SUB[doc]}</small>
          </button>
        ))}
      </div>

      <ActionBar resource={resource} activeDoc={activeDoc} pageCount={pageCount(activeDoc)} printRef={printRef} onStartOver={onStartOver} />

      <div id="doc-panel" role="tabpanel" aria-labelledby={`tab-${activeDoc}`} className="tab-panel" tabIndex={0}>
        {overflowHere.length > 0 && (
          <Msg kind="error">
            {overflowHere.length === 1 ? "Page " : "Pages "}
            {overflowHere.map((id) => id.split("-")[1]).join(" and ")} {overflowHere.length === 1 ? "has" : "have"} too
            much text to fit on one sheet. Shorten some of the writing on {overflowHere.length === 1 ? "that page" : "those pages"},
            or the bottom will be cut off when printed.
          </Msg>
        )}
        <div ref={screenRef} className={`ls-screen${wide ? " is-wide" : ""}`}>
          <LSProvider value={screenCtx}>
            <Document doc={activeDoc} />
          </LSProvider>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            {/* Exactly what prints and what goes into the PDF. Hidden on screen. */}
            <div ref={printRef} className="print-root ls-print" aria-hidden="true" inert>
              <LSProvider value={printCtx}>
                {ORDER.map((doc) => (
                  <div key={doc} className="ls-doc-wrap" data-active={doc === activeDoc ? "" : undefined} data-doc-wrap={doc}>
                    <Document doc={doc} />
                  </div>
                ))}
              </LSProvider>
            </div>
            <div ref={measureRef} className="measure-root ls-print" aria-hidden="true" inert>
              <LSProvider value={printCtx}>
                <div className="ls-measure-page">
                  <PageFrame doc="convergent" n={1} total={1} section="Passage">
                    <PassageBody indexes={allParas} />
                  </PageFrame>
                </div>
              </LSProvider>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
