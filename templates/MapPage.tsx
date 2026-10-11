"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { Field, useLS } from "./context";
import { AskBubble, Cloze, Cue, Lines, LookFor, Sheet } from "./parts";
import { CenterBook, IconSvg, MapArrows, ThemeRibbon, pickIcon } from "./art/icons";

/** Hub-and-orbit colors from storymap.html, in reading order around the map. */
const ORBIT_COLOR = ["var(--c2)", "var(--c3)", "var(--c5)", "var(--c4)"];

/**
 * Story map (or Idea map), built from design-reference/storymap.html.
 * Circles 1 → 2 → 3 → 4 run clockwise; the DOM keeps that reading order for VoiceOver.
 */
export function MapPage() {
  const { resource, mode } = useLS();
  const uid = useId();
  const m = resource.content.map;
  const used = new Set<string>();
  const icons = m.orbits.map((o) => pickIcon(`${o.heading} ${o.icon_hint}`, used));
  const byline = [resource.content.title, resource.content.author].filter(Boolean).join(" · ");

  return (
    <Sheet kind="map" label={`${m.title}, ${mode} version`}>
      <div className="title">
        <h1 className="hollow">
          <Field path={["content", "map", "title"]} label="Map title" />
        </h1>
        <p className="sub">{byline}</p>
      </div>
      <Field as="p" className="say how" path={["content", "map", "how"]} label="How to use the map" />

      <div className="map">
        <MapArrows />
        <div className="center">
          <CenterBook />
          <p className="bt">
            <Field path={["content", "map", "center", 0]} label="Center book, left page" />
            <Field path={["content", "map", "center", 1]} label="Center book, right page" fallback="" />
          </p>
        </div>
        {m.orbits.map((o, i) => {
          const P = ["content", "map", "orbits", i] as const;
          return (
            <FragmentOrbit key={i} i={i} link={i < 3 ? m.links[i] : undefined}>
              <section className={`orb o${i + 1}`} aria-labelledby={`${uid}o${i}`}>
                <IconSvg icon={icons[i]} />
                <h2 className="hollow sm" id={`${uid}o${i}`} style={{ "--hc": ORBIT_COLOR[i] } as CSSProperties}>
                  <Field path={[...P, "heading"]} label={`Circle ${i + 1} heading`} />
                </h2>
                <Cue n={o.paragraph} />
                {mode === "convergent" ? (
                  <>
                    {o.lines.map((_, j) => (
                      <p key={j} className="say">
                        <Cloze path={[...P, "lines", j]} label={`Circle ${i + 1}, line ${j + 1}`} />
                      </p>
                    ))}
                    <Lines n={3} />
                  </>
                ) : (
                  <>
                    <Field as="p" className="say" path={[...P, "divergent", "prompt"]} label={`Circle ${i + 1} open question`} />
                    <Lines n={3} />
                    <LookFor path={[...P, "divergent", "look_for"]} />
                  </>
                )}
              </section>
            </FragmentOrbit>
          );
        })}
      </div>

      <section className="theme" aria-labelledby={`${uid}th`}>
        <ThemeRibbon />
        <div className="inner">
          <h2 className="hollow" id={`${uid}th`}>
            <Field path={["content", "map", "banner", "heading"]} label="Banner heading" />
          </h2>
          {mode === "convergent" ? (
            <Field as="p" className="say" path={["content", "map", "banner", "starter"]} label="Banner sentence starter" />
          ) : (
            <Field as="p" className="say" path={["content", "map", "banner", "divergent", "prompt"]} label="Banner open question" />
          )}
          <Lines n={1} />
          {mode === "divergent" && <LookFor path={["content", "map", "banner", "divergent", "look_for"]} />}
        </div>
      </section>

      {mode === "divergent" && <AskBubble />}
    </Sheet>
  );
}

/** A circle followed by the arrow phrase that leads to the next one. */
function FragmentOrbit({ i, link, children }: { i: number; link?: string; children: ReactNode }) {
  return (
    <>
      {children}
      {link !== undefined && (
        <p className={`link k${i + 1}`}>
          <span>
            <Field path={["content", "map", "links", i]} label={`Arrow phrase ${i + 1}`} />
          </span>
        </p>
      )}
    </>
  );
}
