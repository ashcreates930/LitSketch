import type { LayoutKind, Resource, ThinkerMode } from "@/lib/ai/schema";

/** How the finished notes are being viewed. */
export type View = {
  layout: LayoutKind;
  mode: ThinkerMode;
  colored: boolean;
  answers: boolean;
  withPassage: boolean;
};

export const DEFAULT_VIEW: View = { layout: "guided", mode: "convergent", colored: false, answers: false, withPassage: true };

/**
 * The teacher's work in progress, kept in this browser only so a refresh,
 * a back-swipe, or an iPad going to sleep never loses it.
 */
export type Draft = {
  step: 1 | 2 | 3 | 4;
  title: string;
  text: string;
  agreed: boolean;
  grade: number | null;
  benchmarkCode: string | null;
  resource: Resource | null;
  view: View;
};

export const EMPTY_DRAFT: Draft = {
  step: 1,
  title: "",
  text: "",
  agreed: false,
  grade: null,
  benchmarkCode: null,
  resource: null,
  view: DEFAULT_VIEW,
};

const KEY = "litsketch:draft:v2";

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Draft>;
    return { ...EMPTY_DRAFT, ...d, view: { ...DEFAULT_VIEW, ...d.view } };
  } catch {
    return null;
  }
}

export function saveDraft(d: Draft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // Storage full or blocked (private mode): the app still works, it just won't survive a refresh.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
