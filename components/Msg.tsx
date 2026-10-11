import type { ReactNode } from "react";

type Kind = "error" | "success" | "info";

const ICONS: Record<Kind, string> = {
  error: "M12 3l9.5 17h-19z M12 10v4.5 M12 17.5v.5",
  success: "M4 12.5l5 5L20 6.5",
  info: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z M12 11v6 M12 7.5v.5",
};

/**
 * A message placed directly after the control it is about.
 * The wrapper is always rendered so screen readers announce changes to it.
 */
export function Msg({ id, kind = "error", children }: { id?: string; kind?: Kind; children?: ReactNode }) {
  const live = kind === "error" ? "assertive" : "polite";
  return (
    <div id={id} aria-live={live} aria-atomic="true">
      {children ? (
        <p className={`msg msg-${kind}`}>
          <svg className="msg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={ICONS[kind]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            {kind === "error" && <span className="sr-only">Problem: </span>}
            {children}
          </span>
        </p>
      ) : null}
    </div>
  );
}
