import type { ReactNode } from "react";

/**
 * Hand-drawn-looking frames. Each is an SVG stretched behind real HTML text,
 * so text stays selectable, scalable, and readable by screen readers.
 * Strokes use non-scaling-stroke so line weight is even at any size.
 */

function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
}

const f = (n: number) => n.toFixed(2);

/**
 * Coordinates are percentages of the box, so wobble is kept tiny and mostly
 * inward: on a full-width frame 1% is about 7px, and text must not touch the line.
 */
export function sketchRectPath(seed: number): string {
  const j = rng(seed);
  const c = () => f(0.3 + Math.abs(j()) * 0.8); // corner, 0.3..0.7 from the edge
  const C = () => f(99.7 - Math.abs(j()) * 0.8);
  const bow = () => f(0.5 + j() * 1.0); // edge midpoint, bows slightly in or out
  const BOW = () => f(99.5 + j() * 1.0);
  const mid = () => f(50 + j() * 8);
  return [
    `M ${c()} ${c()}`,
    `Q ${mid()} ${bow()} ${C()} ${c()}`,
    `Q ${BOW()} ${mid()} ${C()} ${C()}`,
    `Q ${mid()} ${BOW()} ${c()} ${C()}`,
    `Q ${bow()} ${mid()} ${c()} ${c()}`,
  ].join(" ");
}

export function sketchEllipsePath(seed: number): string {
  const j = rng(seed);
  const pts: string[] = [];
  const n = 36;
  for (let i = 0; i <= n + 2; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = 48 + j() * 1.4;
    pts.push(`${f(50 + Math.cos(a) * r)} ${f(50 + Math.sin(a) * r)}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(" L ")}`;
}

/** A cloud outline: bumps around an ellipse. */
export function cloudPath(seed: number, bumps = 9): string {
  const j = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < bumps; i++) {
    const a = (i / bumps) * Math.PI * 2;
    pts.push([50 + Math.cos(a) * 44, 50 + Math.sin(a) * 40]);
  }
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < bumps; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % bumps];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const ox = (mx - 50) * 0.32 + j() * 2;
    const oy = (my - 50) * 0.32 + j() * 2;
    d += ` Q ${f(mx + ox)} ${f(my + oy)} ${f(x2)} ${f(y2)}`;
  }
  return d;
}

type Variant = "solid" | "dashed" | "bold";

function Outline({ d, variant }: { d: string; variant: Variant }) {
  return (
    <svg className="ls-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={variant === "bold" ? 2.6 : 1.6}
        strokeDasharray={variant === "dashed" ? "6 5" : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

type FrameProps = {
  children?: ReactNode;
  seed?: number;
  variant?: Variant;
  shape?: "rect" | "ellipse" | "cloud";
  className?: string;
  as?: "div" | "section" | "li" | "figure";
  labelledBy?: string;
};

export function Frame({ children, seed = 1, variant = "solid", shape = "rect", className = "", as: Tag = "div", labelledBy }: FrameProps) {
  const d = shape === "ellipse" ? sketchEllipsePath(seed) : shape === "cloud" ? cloudPath(seed) : sketchRectPath(seed);
  return (
    <Tag className={`ls-frame ls-frame-${shape} ${className}`} aria-labelledby={labelledBy}>
      <Outline d={d} variant={variant} />
      <div className="ls-frame-inner">{children}</div>
    </Tag>
  );
}

/** Ruled writing lines for students. Decorative to assistive tech. */
export function Lines({ count = 2 }: { count?: number }) {
  return (
    <span className="ls-lines" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="ls-line" />
      ))}
    </span>
  );
}

/** A short blank used inside sentences. */
export function Blank({ wide = false }: { wide?: boolean }) {
  return (
    <span className={`ls-blank${wide ? " ls-blank-wide" : ""}`} role="img" aria-label="blank">
      &nbsp;
    </span>
  );
}

export function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg className={`ls-arrow ls-arrow-${direction}`} viewBox="0 0 40 24" aria-hidden="true" focusable="false">
      <path d="M2 12 Q 18 9 34 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 5 L 35 12 L 27 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
