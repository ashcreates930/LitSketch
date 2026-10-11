"use client";

import { useLS } from "./context";
import { VocabPage } from "./VocabPage";
import { MapPage } from "./MapPage";
import { GuidedPage } from "./GuidedPage";
import { PassagePage } from "./PassagePage";

/** The chosen layout in the chosen thinker mode, then (optionally) the numbered passage. */
export function Document({ withPassage }: { withPassage: boolean }) {
  const { layout, passageGroups } = useLS();
  return (
    <div className="ls-doc">
      {layout === "vocab" ? <VocabPage /> : layout === "map" ? <MapPage /> : <GuidedPage />}
      {withPassage &&
        passageGroups.map((g, i) => <PassagePage key={i} indexes={g} n={i + 1} total={passageGroups.length} />)}
    </div>
  );
}
