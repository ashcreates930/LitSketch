"use client";

import type { ReactNode } from "react";
import { useLS } from "./context";
import { PageFrame, type DocKind } from "./PageFrame";
import { ConvergentPage1, ConvergentPage2 } from "./convergent/StructuredFrames";
import { DivergentPage1, DivergentPage2 } from "./divergent/IdeaWeb";
import { KeyConvergent, KeyDivergent } from "./answer-key/AnswerKey";
import { PassageBody } from "./passage/PassagePage";

/** All pages for one document, in print order. */
export function Document({ doc }: { doc: DocKind }) {
  const { passageGroups } = useLS();
  const pages: { body: ReactNode; section?: string }[] =
    doc === "convergent"
      ? [{ body: <ConvergentPage1 /> }, { body: <ConvergentPage2 /> }]
      : doc === "divergent"
        ? [{ body: <DivergentPage1 /> }, { body: <DivergentPage2 /> }]
        : [{ body: <KeyConvergent /> }, { body: <KeyDivergent /> }];

  // Students get the numbered passage after their notes; the key does not need it.
  if (doc !== "key") {
    passageGroups.forEach((g) => pages.push({ body: <PassageBody indexes={g} />, section: "Passage" }));
  }

  return (
    <div className="ls-doc" data-doc={doc}>
      {pages.map((p, i) => (
        <PageFrame key={i} doc={doc} n={i + 1} total={pages.length} section={p.section}>
          {p.body}
        </PageFrame>
      ))}
    </div>
  );
}
