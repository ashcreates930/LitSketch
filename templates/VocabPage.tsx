"use client";

import { useId, type CSSProperties } from "react";
import { Field, useLS } from "./context";
import { AskBubble, Cloze, Cue, Lines, LookFor, Sheet } from "./parts";
import { ArtSvg, PencilPaper, pickObject } from "./art/library";

/** Doodle vocabulary, built from design-reference/vocab.html. */
export function VocabPage() {
  const { resource, mode } = useLS();
  const uid = useId();
  const v = resource.content.vocab;
  const used = new Set<string>();
  const art = v.words.map((w) => pickObject(w.picture, `${w.word} ${w.meaning}`, used));

  return (
    <Sheet kind="vocab" label={`Doodle vocabulary, ${mode} version`}>
      <div className="title">
        <div>
          <h1 className="hollow">
            Doodle <span>Vocab</span>
          </h1>
          <Field as="p" className="sub" path={["content", "vocab", "subtitle"]} label="Subtitle" />
        </div>
        <PencilPaper />
      </div>

      {v.words.map((w, i) => {
        const P = ["content", "vocab", "words", i] as const;
        const t = w.task;
        const flip = i % 2 === 1;
        return (
          <section key={i} className={`vrow${flip ? " flip" : ""}`} aria-labelledby={`${uid}w${i}`}>
            <div className="text">
              <h2 className="bar" id={`${uid}w${i}`}>
                <span className="n">{i + 1}.</span>
                <Field className="w" path={[...P, "word"]} label={`Word ${i + 1}`} />
              </h2>
              <span className="pos">
                (<Field path={[...P, "part_of_speech"]} label={`Part of speech for word ${i + 1}`} />)
              </span>
              <p className="say def">
                <b>Meaning:</b> <Field path={[...P, "meaning"]} label={`Meaning of word ${i + 1}`} />
              </p>
              <p className="say ex">
                <Field path={[...P, "sentence"]} label={`Example sentence for word ${i + 1}`} />
                <Cue n={w.paragraph} />
              </p>

              {mode === "convergent" ? (
                <div className="task">
                  <Field as="p" className="prompt" path={[...P, "task", "prompt"]} label={`Task for word ${i + 1}`} />
                  {t.kind === "circle" && (
                    <ul className="chips" role="list">
                      {t.chips.map((c, j) => (
                        <li key={j} className={c.correct ? "yes" : undefined}>
                          <Field path={[...P, "task", "chips", j, "text"]} label={`Choice ${j + 1}`} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {t.kind === "sort" && (
                    <ol className="io" role="list">
                      {t.sort_items.map((s, j) => (
                        <li key={j}>
                          <span className="box">{s.answer}</span>
                          <Field path={[...P, "task", "sort_items", j, "text"]} label={`Statement ${j + 1}`} />
                        </li>
                      ))}
                    </ol>
                  )}
                  {t.kind === "finish" &&
                    t.finish.map((_, j) => (
                      <p key={j} className="fillrow">
                        <Cloze path={[...P, "task", "finish", j]} label={`Sentence ${j + 1}`} />
                      </p>
                    ))}
                </div>
              ) : (
                <div className="task">
                  <Field as="p" className="prompt" path={[...P, "divergent", "prompt"]} label={`Open question for word ${i + 1}`} />
                  <Lines n={2} />
                  <LookFor path={[...P, "divergent", "look_for"]} />
                </div>
              )}
            </div>

            <div className={`art-wrap ${flip ? "tb" : "tt"}`}>
              <p className="tag" style={{ "--r": flip ? "-2deg" : "3deg" } as CSSProperties}>
                Doodle <Field path={[...P, "doodle_what"]} label={`Doodle prompt for word ${i + 1}`} /> inside the {art[i].inside}.
              </p>
              <ArtSvg obj={art[i]} />
            </div>
          </section>
        );
      })}

      {mode === "divergent" && <AskBubble />}
    </Sheet>
  );
}
