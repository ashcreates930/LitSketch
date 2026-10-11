"use client";

import type { CSSProperties, ReactNode } from "react";
import { Field, useLS, type Path } from "./context";
import { EditableText } from "@/components/EditableText";
import { blankWidth, joinCloze, parseCloze } from "@/lib/cloze";
import { AskIcon } from "./art/icons";
import type { LayoutKind } from "@/lib/ai/schema";

export const LAYOUT_NAMES: Record<LayoutKind | "passage", string> = {
  vocab: "Doodle vocabulary",
  map: "Story map",
  guided: "Guided notes",
  passage: "Passage",
};

/** One letter-size page: name bar with the benchmark code, content, LitSketch footer. */
export function Sheet({
  kind,
  label,
  children,
  before,
  footRight,
}: {
  kind: LayoutKind | "passage";
  label: string;
  children: ReactNode;
  before?: ReactNode;
  footRight?: string;
}) {
  const { resource, mode } = useLS();
  const modeName = mode === "convergent" ? "Convergent" : "Divergent";
  return (
    <article className={`sheet layout-${kind}`} aria-label={label}>
      {before}
      <div className="namebar">
        <span>
          Name <span className="blank" style={{ "--w": "10em" } as CSSProperties} />
        </span>
        <span className="std">
          {resource.benchmark.code} · <Field path={["content", "topic_label"]} label="Skill label next to the benchmark code" />
        </span>
      </div>
      {children}
      <div className="foot">
        <span>LitSketch by AmplifiED</span>
        <span>{footRight ?? `${LAYOUT_NAMES[kind]} · ${modeName}`}</span>
      </div>
    </article>
  );
}

/**
 * Fill-in text with [[answer]] blanks. Answers stay invisible until Show answers.
 * On screen every piece (text and answer) can be edited.
 */
export function Cloze({ path, label }: { path: Path; label: string }) {
  const { resource, editable, update } = useLS();
  const raw = String(path.reduce<unknown>((o, k) => (o as Record<string | number, unknown>)?.[k], resource) ?? "");
  const parts = parseCloze(raw);
  let blankNo = 0;
  return (
    <>
      {parts.map((p, i) => {
        if (p.blank) {
          blankNo++;
          const style = { "--w": blankWidth(p.text) } as CSSProperties;
          if (!editable) {
            return (
              <span key={i} className="blank" style={style}>
                {p.text}
              </span>
            );
          }
          return (
            <EditableText
              key={i}
              className="blank"
              label={`${label}, answer ${blankNo}`}
              value={p.text}
              onChange={(v) => update(path, joinCloze(parts.map((q, j) => (j === i ? { ...q, text: v } : q))))}
            />
          );
        }
        // Tiny bits like "." or " lit." are too small to tap reliably; they stay as plain text.
        if (!editable || p.text.trim().length < 6) return <span key={i}>{p.text}</span>;
        return (
          <EditableText
            key={i}
            label={`${label}, text`}
            value={p.text}
            onChange={(v) => update(path, joinCloze(parts.map((q, j) => (j === i ? { ...q, text: v } : q))))}
          />
        );
      })}
    </>
  );
}

/** "Find the clue in ¶4": points students to the numbered passage. */
export function Cue({ n }: { n: number }) {
  return <span className="cue"> Find the clue in ¶{n}.</span>;
}

/** Teacher look-for, shown in red only with Show answers. */
export function LookFor({ path }: { path: Path }) {
  return (
    <p className="key">
      Look for: <Field path={path} label="Look-for for the teacher" />
    </p>
  );
}

export function Lines({ n }: { n: number }) {
  return <div className="lines" style={{ "--n": n } as CSSProperties} aria-hidden="true" />;
}

/** Every divergent page ends with a bubble for the student's own question. */
export function AskBubble() {
  return (
    <section className="ask" aria-label="Your own question">
      <AskIcon />
      <div className="bubble">
        <p className="prompt">My own question about this text:</p>
        <Lines n={1} />
      </div>
    </section>
  );
}
