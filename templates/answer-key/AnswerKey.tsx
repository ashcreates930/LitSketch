"use client";

import { useId } from "react";
import { Field, useLS } from "../context";
import { Icon } from "../icons";
import type { Generation } from "@/lib/ai/schema";

const C = ["content", "convergent"] as const;

const SECTION_NAMES: Record<Generation["divergent_key"][number]["section"], string> = {
  central: "Idea Web: central question",
  branches: "Idea Web: branches",
  sketch: "Sketch It",
  what_if: "What If…?",
  connect: "Connect It",
  author: "Ask the Author",
  show_it: "Show It Your Way",
};

/** Page 1: every convergent answer. */
export function KeyConvergent() {
  const { resource } = useLS();
  const uid = useId();
  const c = resource.content.convergent;
  return (
    <>
      <p className="ls-key-note">
        <Icon name="key" /> Convergent notes: one best answer for each item. Accept answers that match the meaning.
      </p>

      <section className="ls-sec ls-key-sec" aria-labelledby={`${uid}w`}>
        <h3 className="ls-h" id={`${uid}w`}>Key Words</h3>
        <dl className="ls-key-dl">
          {c.vocab.map((v, i) => (
            <div key={i}>
              <dt>
                {v.word} <span className="ls-para">¶{v.paragraph}</span>
              </dt>
              <dd>
                <Field path={[...C, "vocab", i, "definition"]} label={`Definition of ${v.word}`} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ls-sec ls-key-sec" aria-labelledby={`${uid}s`}>
        <h3 className="ls-h" id={`${uid}s`}>{c.sequence_label}</h3>
        <ol role="list" className="ls-key-ol">
          {c.sequence.map((s, i) => (
            <li key={i}>
              <span className="ls-key-q">{s.starter}</span>{" "}
              <Field path={[...C, "sequence", i, "answer"]} label={`Sequence answer ${i + 1}`} />
            </li>
          ))}
        </ol>
      </section>

      <section className="ls-sec ls-key-sec" aria-labelledby={`${uid}e`}>
        <h3 className="ls-h" id={`${uid}e`}>Find the Evidence</h3>
        <ol role="list" className="ls-key-ol">
          {c.evidence.map((e, i) => (
            <li key={i}>
              <span className="ls-key-q">{e.claim}</span>
              <br />
              <span className="ls-quote">
                “<Field path={[...C, "evidence", i, "quote"]} label={`Evidence quote ${i + 1}`} />” (¶{e.paragraph})
              </span>
              <br />
              <Field path={[...C, "evidence", i, "explanation"]} label={`Evidence explanation ${i + 1}`} />
            </li>
          ))}
        </ol>
      </section>

      <div className="ls-row-2">
        <section className="ls-sec ls-key-sec" aria-labelledby={`${uid}c`}>
          <h3 className="ls-h" id={`${uid}c`}>Fill in the Summary</h3>
          <ol role="list" className="ls-key-ol">
            {c.cloze.answers.map((_, i) => (
              <li key={i}>
                <Field path={[...C, "cloze", "answers", i]} label={`Summary blank ${i + 1} answer`} />
              </li>
            ))}
          </ol>
        </section>
        <section className="ls-sec ls-key-sec" aria-labelledby={`${uid}q`}>
          <h3 className="ls-h" id={`${uid}q`}>Check Your Understanding</h3>
          <ol role="list" className="ls-key-ol">
            {c.checks.map((q, i) => (
              <li key={i}>
                <Field path={[...C, "checks", i, "answer"]} label={`Answer to question ${i + 1}`} />{" "}
                <span className="ls-para">¶{q.paragraph}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

/** Page 2: divergent look-fors and labeled sample responses. */
export function KeyDivergent() {
  const { resource } = useLS();
  const keys = resource.content.divergent_key;
  return (
    <>
      <p className="ls-key-note">
        <Icon name="key" /> Divergent notes: many answers are correct. Use these look-fors; samples are examples only.
      </p>
      <div className="ls-key-grid">
        {keys.map((k, i) => (
          <section key={i} className="ls-key-card">
            <h3 className="ls-h">{SECTION_NAMES[k.section]}</h3>
            <p className="ls-label">Look for:</p>
            <ul role="list" className="ls-key-ul">
              {k.look_fors.map((_, j) => (
                <li key={j}>
                  <Field path={["content", "divergent_key", i, "look_fors", j]} label={`${SECTION_NAMES[k.section]} look-for ${j + 1}`} />
                </li>
              ))}
            </ul>
            <p className="ls-sample">
              <span className="ls-label">Example only: </span>
              <Field path={["content", "divergent_key", i, "sample"]} label={`${SECTION_NAMES[k.section]} sample response`} />
            </p>
          </section>
        ))}
      </div>
    </>
  );
}
