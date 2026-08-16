import { useSyncExternalStore } from "react";

export type WidgetTheme = { color: string; radius: string };

export const WIDGET_COLORS = ["#0052FF", "#1D2020", "#0D9488", "#EA580C", "#7C3AED"];
export const WIDGET_RADII = [
  { label: "Circle", value: "50%" },
  { label: "Rounded", value: "12px" },
  { label: "Square", value: "4px" },
];

const DEFAULT: WidgetTheme = { color: WIDGET_COLORS[0], radius: "50%" };

/**
 * One source of truth for the live launcher's appearance.
 *
 * The controls appear in two places (hero and the Brand card) and both drive
 * the same bubble, so local state in each would leave one showing a stale
 * selection. An external store keeps them in step and writes the CSS custom
 * properties the launcher reads — the same values the shipped widget takes
 * via data-color and data-radius.
 */
let state: WidgetTheme = DEFAULT;
const listeners = new Set<() => void>();

function commit(next: WidgetTheme) {
  state = next;
  const s = document.documentElement.style;
  s.setProperty("--launcher-color", next.color);
  s.setProperty("--launcher-radius", next.radius);
  listeners.forEach((l) => l());
}

export function setWidgetColor(color: string) {
  commit({ ...state, color });
}

export function setWidgetRadius(radius: string) {
  commit({ ...state, radius });
}

export function useWidgetTheme(): WidgetTheme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => DEFAULT
  );
}
