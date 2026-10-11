"use client";

import { useId } from "react";
import { Field, useLS } from "../context";
import { Icon } from "../icons";
import { Arrow, Blank, Frame, Lines } from "../shapes";
import { BLANK } from "@/lib/ai/verify";

const C = ["content", "convergent"] as const;

/** Page 1: big question, key words, sequence chain. */
export function ConvergentPage1() {
  const { resource } = useLS();
  const uid = useId();
  const c = resource.content.convergent;
  return (
    <>
      <Frame variant="bold" seed={11} className="ls-bigq" as="section" labelledBy={`${uid}cv-bigq`}>
        <h3 className="ls-h" id={`${uid}cv-bigq`}>
          <Icon name="question" /> Big Question
        </h3>
        <Field as="p" className="ls-bigq-text" path={[...C, "big_question"]} label="Big question" />
      </Frame>

      <section className="ls-sec" aria-labelledby={`${uid}cv-words`}>
        <h3 className="ls-h" id={`${uid}cv-words`}>
          <Icon name="book" /> Key Words
        </h3>
        <ul role="list" className="ls-vocab ls-grid-2">
          {c.vocab.map((v, i) => (
            <Frame as="li" key={i} seed={20 + i} className="ls-vocab-item">
              <p className="ls-word">
                <Field path={[...C, "vocab", i, "word"]} label={`Key word ${i + 1}`} />{" "}
                <span className="ls-para">¶{v.paragraph}</span>
              </p>
              <div className="ls-vocab-cols">
                <div className="ls-vocab-write">
                  <p className="ls-label">What it means:</p>
                  <Lines count={3} />
                </div>
                <div className="ls-mini-sketch" aria-hidden="true">
                  <Icon name="pencil" /> Sketch it
                </div>
              </div>
            </Frame>
          ))}
        </ul>
      </section>

      <section className="ls-sec" aria-labelledby={`${uid}cv-seq`}>
        <h3 className="ls-h" id={`${uid}cv-seq`}>
          <Icon name="steps" /> <Field path={[...C, "sequence_label"]} label="Sequence heading" />
        </h3>
        <ol role="list" className="ls-seq">
          {c.sequence.map((s, i) => (
            <li key={i} className="ls-seq-item">
              <Frame seed={40 + i} className="ls-seq-box">
                <span className="ls-num" aria-hidden="true">
                  {i + 1}
                </span>
                <Field as="p" className="ls-starter" path={[...C, "sequence", i, "starter"]} label={`Sequence step ${i + 1} starter`} />
                <Lines count={3} />
              </Frame>
              {i < c.sequence.length - 1 && <Arrow />}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

/** Splits cloze text at ___ markers. */
export function clozeParts(text: string): string[] {
  return text.split(BLANK);
}

export function wordBank(answers: string[], distractors: string[]): string[] {
  return [...new Set([...answers, ...distractors].map((w) => w.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** Page 2: evidence frame, cloze summary, check questions, sum it up. */
export function ConvergentPage2() {
  const { resource, editable } = useLS();
  const uid = useId();
  const c = resource.content.convergent;
  const parts = clozeParts(c.cloze.text);
  return (
    <>
      <section className="ls-sec" aria-labelledby={`${uid}cv-ev`}>
        <h3 className="ls-h" id={`${uid}cv-ev`}>
          <Icon name="quote" /> Find the Evidence
        </h3>
        <table className="ls-evidence">
          <thead>
            <tr>
              <th scope="col">Claim</th>
              <th scope="col">Evidence from the text</th>
              <th scope="col">Explain: how does it prove the claim?</th>
            </tr>
          </thead>
          <tbody>
            {c.evidence.map((e, i) => (
              <tr key={i}>
                <td>
                  <Field path={[...C, "evidence", i, "claim"]} label={`Claim ${i + 1}`} />
                </td>
                <td>
                  <span className="ls-cue">
                    <Icon name="search" /> Look in ¶{e.paragraph}
                  </span>
                  <Lines count={2} />
                </td>
                <td>
                  <Lines count={3} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Frame seed={61} className="ls-cloze-box" as="section" labelledBy={`${uid}cv-cloze`}>
        <h3 className="ls-h" id={`${uid}cv-cloze`}>
          <Icon name="list" /> Fill in the Summary
        </h3>
        <div className="ls-cloze-cols">
          {editable ? (
            <Field as="p" className="ls-cloze" path={[...C, "cloze", "text"]} label="Fill-in summary (___ marks a blank)" />
          ) : (
            <p className="ls-cloze">
              {parts.map((p, i) => (
                <span key={i}>
                  {p}
                  {i < parts.length - 1 && <Blank wide />}
                </span>
              ))}
            </p>
          )}
          <div className="ls-bank">
            <p className="ls-bank-title">Word bank</p>
            <ul>
              {wordBank(c.cloze.answers, c.cloze.distractors).map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </Frame>

      <section className="ls-sec" aria-labelledby={`${uid}cv-check`}>
        <h3 className="ls-h" id={`${uid}cv-check`}>
          <Icon name="check" /> Check Your Understanding
        </h3>
        <ol role="list" className="ls-checks">
          {c.checks.map((q, i) => (
            <li key={i}>
              <Field as="p" path={[...C, "checks", i, "question"]} label={`Question ${i + 1}`} />
              <Lines count={2} />
            </li>
          ))}
        </ol>
      </section>

      <Frame seed={71} className="ls-sumup" as="section" labelledBy={`${uid}cv-sum`}>
        <div className="ls-sumup-write">
          <h3 className="ls-h" id={`${uid}cv-sum`}>
            <Icon name="bulb" /> Sum It Up
          </h3>
          <Field as="p" path={[...C, "sum_it_up"]} label="Sum it up prompt" />
          <Lines count={2} />
        </div>
        <div className="ls-mini-sketch ls-sumup-sketch" aria-hidden="true">
          <Icon name="pencil" /> Sketch it
        </div>
      </Frame>
    </>
  );
}
