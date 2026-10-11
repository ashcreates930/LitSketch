"use client";

import { useId, useSyncExternalStore } from "react";

type Theme = "auto" | "light" | "dark" | "contrast";
const KEY = "litsketch:theme";
const listeners = new Set<() => void>();

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function readTheme(): Theme {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" || t === "dark" || t === "contrast" ? t : "auto";
}

export function DisplaySetting() {
  const id = useId();
  // The saved choice is applied to <html data-theme> before paint (see layout); read it from there.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "auto" as Theme);

  function choose(t: Theme) {
    const root = document.documentElement;
    if (t === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", t);
    try {
      if (t === "auto") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, t);
    } catch {}
    listeners.forEach((l) => l());
  }

  return (
    <div className="display-setting">
      <label htmlFor={id}>Display</label>
      <select id={id} value={theme} onChange={(e) => choose(e.target.value as Theme)}>
        <option value="auto">Match my device</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="contrast">High contrast</option>
      </select>
    </div>
  );
}
