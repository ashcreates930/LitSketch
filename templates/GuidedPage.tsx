"use client";

import { useId, type CSSProperties } from "react";
import { Field, useLS } from "./context";
import { AskBubble, Cloze, Cue, Lines, LookFor, Sheet } from "./parts";
import { IconSvg, Squiggle, pickIcon } from "./art/icons";
import { fillCloze } from "@/lib/cloze";

/** Guided fill-in notes, built from design-reference/guided.html. */
export function GuidedPage() {
  const { resource, mode, editable } = useLS();
  const uid = useId();
  const g = resource.content.guided;
  const used = new Set<string>();
  const icons = g.boxes.map((b) => pickIcon(`${b.label} ${b.icon_hint}`, used));
  const G = ["content", "guided"] as const;

  const tab = (
    <span className="pagetab">
      <Field path={["notebookPage"]} label="Notebook page number" fallback="1" />
    </span>
  );

  return (
    <Sheet kind="guided" label={`Guided notes, ${mode} version`} before={tab}>
      <div className="title">
        <h1 className="hollow">
          <Field path={[...G, "concept"]} label="Concept" />
        </h1>
        <Squiggle />
      </div>

      {mode === "convergent" ? (
        <p className="say lead">
          <Cloze path={[...G, "lead"]} label="Definition" />
        </p>
      ) : (
        <p className="say lead">{editable ? <Cloze path={[...G, "lead"]} label="Definition" /> : fillCloze(g.lead)}</p>
      )}

      <div className="types">
        {g.boxes.map((b, i) => {
          const P = [...G, "boxes", i] as const;
          return (
            <section key={i} className={`type t${i + 1}`} aria-labelledby={`${uid}b${i}`}>
              <IconSvg icon={icons[i]} />
              <h2 className="hd" id={`${uid}b${i}`}>
                <span className="bar">
                  <Field className="w" path={[...P, "label"]} label={`Box ${i + 1} label`} />
                </span>
              </h2>
              {mode === "convergent" ? (
                <p className="say">
                  <Cloze path={[...P, "text"]} label={`Box ${i + 1}`} />
                  <Cue n={b.paragraph} />
                </p>
              ) : (
                <div>
                  <p className="say">
                    <Field path={[...P, "divergent", "prompt"]} label={`Box ${i + 1} open question`} />
                    <Cue n={b.paragraph} />
                  </p>
                  <Lines n={2} />
                  <LookFor path={[...P, "divergent", "look_for"]} />
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="apply">
        <section className="box" aria-labelledby={`${uid}yt`}>
          <h2 className="hollow sm" id={`${uid}yt`} style={{ "--hc": "var(--c1)" } as CSSProperties}>
            Your turn
          </h2>
          {mode === "convergent" ? (
            <>
              <p className="prompt">
                <Field path={[...G, "your_turn", "prompt"]} label="Your turn question" />
                <Cue n={g.your_turn.paragraph} />
              </p>
              <ul className="checks" role="list">
                {g.your_turn.choices.map((c, j) => (
                  <li key={j} className={c.correct ? "yes" : undefined}>
                    <Field path={[...G, "your_turn", "choices", j, "text"]} label={`Check box ${j + 1}`} />
                  </li>
                ))}
              </ul>
              <p className="say">I know this because</p>
              <Lines n={3} />
            </>
          ) : (
            <>
              <p className="prompt">
                <Field path={[...G, "your_turn", "divergent", "prompt"]} label="Your turn open question" />
                <Cue n={g.your_turn.paragraph} />
              </p>
              <Lines n={4} />
              <LookFor path={[...G, "your_turn", "divergent", "look_for"]} />
            </>
          )}
        </section>
        <section className="frame-d" aria-labelledby={`${uid}dd`}>
          <p className="prompt" id={`${uid}dd`}>
            <Field path={[...G, "doodle_prompt"]} label="Doodle prompt" />
          </p>
          <div className="space" aria-hidden="true" />
          <p className="say">
            Caption: <span className="blank" style={{ "--w": "12em" } as CSSProperties} />
          </p>
        </section>
      </div>

      {mode === "divergent" && <AskBubble />}
    </Sheet>
  );
}
