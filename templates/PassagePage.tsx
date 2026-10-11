"use client";

import { useLS } from "./context";
import { Sheet } from "./parts";

/** The teacher's passage with ¶ numbers that match the "Find the clue in ¶4" cues. */
export function PassagePage({ indexes, n, total }: { indexes: number[]; n: number; total: number }) {
  const { resource } = useLS();
  const paras = resource.passage.paragraphs;
  const first = n === 1;
  return (
    <Sheet
      kind="passage"
      label={`Passage, page ${n} of ${total}`}
      footRight={`Passage · page ${n} of ${total}`}
    >
      {first && (
        <div className="title">
          <h1 className="hollow">Read it</h1>
          <p className="sub">{resource.content.title}</p>
        </div>
      )}
      <div className="ptext">
        {indexes.map((i) => (
          <p key={i} className="para" data-para={i}>
            <span className="pn">¶{i + 1}</span>
            <span className="pt">{paras[i]}</span>
          </p>
        ))}
      </div>
    </Sheet>
  );
}
