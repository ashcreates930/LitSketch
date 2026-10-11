"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { LayoutKind, Resource, ThinkerMode } from "@/lib/ai/schema";
import { EditableText } from "@/components/EditableText";
import type { PassageChunk } from "./PassagePage";

export type Path = (string | number)[];

type Ctx = {
  resource: Resource;
  /** true on screen (teacher can edit), false in the print/PDF copy */
  editable: boolean;
  update: (path: Path, value: string) => void;
  layout: LayoutKind;
  mode: ThinkerMode;
  /** paragraph indexes grouped into printed passage pages */
  passageGroups: PassageChunk[][];
};

const LSContext = createContext<Ctx | null>(null);

export function LSProvider({ value, children }: { value: Ctx; children: ReactNode }) {
  return <LSContext.Provider value={value}>{children}</LSContext.Provider>;
}

export function useLS(): Ctx {
  const ctx = useContext(LSContext);
  if (!ctx) throw new Error("useLS outside LSProvider");
  return ctx;
}

export function getAt(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o == null ? o : (o as Record<string | number, unknown>)[k]), obj);
}

export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const src = obj as Record<string | number, unknown>;
  const copy = (Array.isArray(obj) ? [...obj] : { ...src }) as Record<string | number, unknown>;
  copy[k] = setAt(src[k], rest, value);
  return copy as T;
}

type FieldProps = {
  path: Path;
  /** plain-language name read by screen readers, e.g. "Big question" */
  label: string;
  as?: "span" | "p" | "div";
  className?: string;
  /** shown when the stored value is missing */
  fallback?: string;
};

/** A piece of generated text: editable on screen, plain text in print. */
export function Field({ path, label, as = "span", className = "", fallback = "" }: FieldProps) {
  const { resource, editable, update } = useLS();
  const value = String(getAt(resource, path) ?? fallback);
  if (!editable) {
    const Tag = as;
    return <Tag className={className || undefined}>{value}</Tag>;
  }
  return <EditableText as={as} className={className} label={label} value={value} onChange={(v) => update(path, v)} />;
}
