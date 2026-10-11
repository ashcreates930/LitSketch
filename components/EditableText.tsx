"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  as?: "span" | "p" | "div";
  className?: string;
};

/**
 * Click or tap to edit. Uncontrolled while focused so the cursor never jumps;
 * React state is updated on every keystroke so print and PDF stay in sync.
 */
export function EditableText({ value, onChange, label, as: Tag = "span", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.textContent !== value) el.textContent = value;
  }, [value]);

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Escape") e.currentTarget.blur();
    // Single-line feel: Enter finishes editing instead of adding a line.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  return (
    <Tag
      ref={ref as never}
      className={`editable ${className}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-label={label}
      spellCheck
      tabIndex={0}
      onInput={(e) => onChange(e.currentTarget.textContent ?? "")}
      onBlur={(e) => {
        const text = (e.currentTarget.textContent ?? "").replace(/\s+/g, " ").trim();
        if (text !== value) onChange(text);
      }}
      onKeyDown={onKeyDown}
    />
  );
}
