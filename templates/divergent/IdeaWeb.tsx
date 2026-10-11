"use client";

import { useId } from "react";
import { Field, useLS } from "../context";
import { Icon } from "../icons";
import { Frame, Lines } from "../shapes";

const D = ["content", "divergent"] as const;

/** Branch bubble centers (percent of the web area), left column then right column. */
const BRANCH_POS: [number, number][] = [
  [15, 14],
  [11, 50],
  [15, 86],
  [85, 14],
  [89, 50],
  [85, 86],
];

/** Page 1: idea web around a central question, plus a big sketch space. */
export function DivergentPage1() {
  const { resource } = useLS();
  const uid = useId();
  const branches = resource.content.divergent.branches.slice(0, 6);
  return (
    <>
      <section className="ls-sec ls-web-sec" aria-labelledby={`${uid}web`}>
        <h3 className="ls-h" id={`${uid}web`}>
          <Icon name="web" /> Idea Web
        </h3>
        <div className="ls-web">
          <svg className="ls-web-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {branches.map((_, i) => {
              const [x, y] = BRANCH_POS[i];
              const mx = (50 + x) / 2;
              const my = (50 + y) / 2 + (i % 2 ? 4 : -4);
              return (
                <path
                  key={i}
                  d={`M 50 50 Q ${mx} ${my} ${x} ${y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
          <Frame shape="ellipse" variant="bold" seed={5} className="ls-web-center">
            <Field as="p" className="ls-web-center-text" path={[...D, "central_prompt"]} label="Central question" />
          </Frame>
          <ul role="list" className="ls-web-branches">
            {branches.map((_, i) => (
              <Frame as="li" key={i} seed={80 + i} className={`ls-web-b ls-web-b${i + 1}`}>
                <Field as="p" path={[...D, "branches", i]} label={`Idea web prompt ${i + 1}`} />
              </Frame>
            ))}
          </ul>
        </div>
      </section>

      <Frame variant="dashed" seed={9} className="ls-sketch-big" as="section" labelledBy={`${uid}sk`}>
        <h3 className="ls-h" id={`${uid}sk`}>
          <Icon name="pencil" /> Sketch It
        </h3>
        <Field as="p" path={[...D, "sketch_prompt"]} label="Sketch prompt" />
      </Frame>
    </>
  );
}

/** Page 2: what-if clouds, connect it, ask the author, show it your way. */
export function DivergentPage2() {
  const { resource } = useLS();
  const uid = useId();
  const whatIfs = resource.content.divergent.what_ifs.slice(0, 3);
  return (
    <>
      <section className="ls-sec" aria-labelledby={`${uid}wi`}>
        <h3 className="ls-h" id={`${uid}wi`}>
          <Icon name="cloud" /> What If…?
        </h3>
        <ul role="list" className="ls-whatifs ls-grid-3">
          {whatIfs.map((_, i) => (
            <Frame as="li" key={i} shape="cloud" seed={100 + i} className="ls-cloud">
              <Field as="p" path={[...D, "what_ifs", i]} label={`What-if prompt ${i + 1}`} />
            </Frame>
          ))}
        </ul>
      </section>

      <Frame seed={110} className="ls-connect" as="section" labelledBy={`${uid}cn`}>
        <h3 className="ls-h" id={`${uid}cn`}>
          <Icon name="link" /> Connect It
        </h3>
        <Field as="p" path={[...D, "connect_prompt"]} label="Connect it prompt" />
        <Lines count={3} />
      </Frame>

      <div className="ls-row-2">
        <Frame seed={120} className="ls-author" as="section" labelledBy={`${uid}au`}>
          <h3 className="ls-h" id={`${uid}au`}>
            <Icon name="chat" /> Ask the Author
          </h3>
          <Field as="p" path={[...D, "author_prompt"]} label="Ask the author prompt" />
          <Lines count={3} />
        </Frame>
        <section className="ls-showit" aria-labelledby={`${uid}sh`}>
          <h3 className="ls-h" id={`${uid}sh`}>
            <Icon name="star" /> Show It Your Way
          </h3>
          <Field as="p" path={[...D, "show_it_prompt"]} label="Show it your way prompt" />
          <p className="ls-label">Circle one:</p>
          <ul role="list" className="ls-choices ls-grid-3">
            <Frame as="li" seed={131} variant="dashed">
              <Icon name="pencil" /> Sketch it
            </Frame>
            <Frame as="li" seed={132} variant="dashed">
              <Icon name="list" /> List it
            </Frame>
            <Frame as="li" seed={133} variant="dashed">
              <Icon name="star" /> Write a poem
            </Frame>
          </ul>
          <Frame seed={134} className="ls-showit-space" />
        </section>
      </div>
    </>
  );
}
