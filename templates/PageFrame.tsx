"use client";

import type { ReactNode } from "react";
import { Field, useLS } from "./context";

export type DocKind = "convergent" | "divergent" | "key";

export const DOCS: Record<DocKind, { label: string; tag: string; tagline: string; suffix: string }> = {
  convergent: { label: "Convergent notes", tag: "Convergent", tagline: "step by step, one best answer", suffix: "Doodle Notes" },
  divergent: { label: "Divergent notes", tag: "Divergent", tagline: "open-ended, many possible answers", suffix: "Doodle Notes" },
  key: { label: "Answer key", tag: "Teacher key", tagline: "keep this copy for yourself", suffix: "Answer Key" },
};

type Props = {
  doc: DocKind;
  n: number;
  total: number;
  children: ReactNode;
  /** short name of this page shown under the header, e.g. "Passage" */
  section?: string;
};

export function PageFrame({ doc, n, total, children, section }: Props) {
  const { resource } = useLS();
  const meta = DOCS[doc];
  const code = resource.benchmark.code;
  const first = n === 1;
  return (
    <article className={`ls-page ls-doc-${doc}`} data-page-id={`${doc}-${n}`} aria-label={`${meta.label}, page ${n} of ${total}`}>
      <header className="ls-head">
        <div className="ls-head-row">
          <p className="ls-tag">
            <span className="ls-tag-mode">{meta.tag}</span> <span className="ls-tag-line">{meta.tagline}</span>
          </p>
          <p className="ls-code">
            <span className="ls-sr">Florida B.E.S.T. benchmark </span>
            {code}
          </p>
        </div>
        <h2 className="ls-title">
          <Field path={["content", "title"]} label="Title of the text" editable={first} />
          <span className="ls-title-suffix">
            {" "}
            · {section ?? meta.suffix}
          </span>
        </h2>
        <p className="ls-goal">
          <strong>Goal: </strong>
          <Field path={["content", "benchmark_summary"]} label="Learning goal" editable={first} />
        </p>
        {doc !== "key" && (
          <p className="ls-name-row" aria-hidden="true">
            <span>Name</span>
            <span className="ls-fill ls-fill-name" />
            <span>Date</span>
            <span className="ls-fill" />
            <span>Period</span>
            <span className="ls-fill ls-fill-short" />
          </p>
        )}
      </header>
      <div className="ls-body">{children}</div>
      <footer className="ls-foot">
        <span>
          {code} · {meta.label}
        </span>
        <span>
          Page {n} of {total}
        </span>
        <span>Made with LitSketch</span>
      </footer>
    </article>
  );
}
