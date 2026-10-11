"use client";

import { useState } from "react";
import { OBJECTS, ArtSvg } from "@/templates/art/library";
import { ICONS, IconSvg } from "@/templates/art/icons";

/** Review page: the whole illustration library, labeled, with the Preview colored toggle. */
export function Gallery() {
  const [colored, setColored] = useState(false);

  return (
    <div className="container-wide">
      <h1 className="page-title">Illustration library</h1>
      <p className="lead">
        {OBJECTS.length} objects that students doodle inside, and {ICONS.length} small icons for story-map circles and
        guided-note boxes. LitSketch matches them to words using the keywords under each one.
      </p>

      <div className="toolbar gallery-toolbar" role="toolbar" aria-label="Page tools">
        <div className="toolbar-row">
          <span className="name">Illustration review</span>
          <div className="actions">
            <button type="button" className="btn" aria-pressed={colored} onClick={() => setColored(!colored)}>
              Preview colored
            </button>
          </div>
        </div>
      </div>

      <div className={`ls-screen${colored ? " colored" : ""}`}>
        <section className="sheet gallery" aria-labelledby="objects-h">
          <h2 id="objects-h" className="hollow sm gallery-h">
            Objects ({OBJECTS.length})
          </h2>
          <ul className="gallery-grid" role="list">
            {OBJECTS.map((o, i) => (
              <li key={o.key} className="gallery-card">
                <div className="gallery-art">
                  <ArtSvg obj={o} />
                </div>
                <p className="gallery-name">
                  {i + 1}. {o.key}
                </p>
                <p className="gallery-inside">“Doodle … inside the {o.inside}.”</p>
                <p className="gallery-tags">
                  <span className="sr-only">Keywords: </span>
                  {o.tags.join(", ")}
                </p>
              </li>
            ))}
          </ul>

          <h2 id="icons-h" className="hollow sm gallery-h">
            Icons ({ICONS.length})
          </h2>
          <ul className="gallery-grid gallery-grid-icons" role="list" aria-labelledby="icons-h">
            {ICONS.map((icon, i) => (
              <li key={icon.key} className="gallery-card">
                <div className="gallery-art gallery-art-icon">
                  <IconSvg icon={icon} />
                </div>
                <p className="gallery-name">
                  {i + 1}. {icon.key}
                </p>
                <p className="gallery-tags">
                  <span className="sr-only">Keywords: </span>
                  {icon.tags.join(", ")}
                </p>
              </li>
            ))}
          </ul>
          <div className="foot">
            <span>LitSketch by AmplifiED</span>
            <span>Illustration library</span>
          </div>
        </section>
      </div>
    </div>
  );
}
