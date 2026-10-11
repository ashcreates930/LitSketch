"use client";

import { useLS } from "../context";

/** Teacher's passage with paragraph numbers that match the ¶ cues on the notes. */
export function PassageBody({ indexes }: { indexes: number[] }) {
  const { resource } = useLS();
  return (
    <div className="ls-passage">
      {indexes.map((i) => (
        <p key={i} className="ls-passage-p" data-para={i}>
          <span className="ls-pnum">¶{i + 1}</span>
          <span className="ls-ptext">{resource.passage.paragraphs[i]}</span>
        </p>
      ))}
    </div>
  );
}
