"use client";

import {
  WIDGET_COLORS,
  WIDGET_RADII,
  setWidgetColor,
  setWidgetRadius,
  useWidgetTheme,
} from "@/lib/widgetTheme";

/**
 * Colour and shape pickers for the live launcher. Rendered in the hero and
 * again in the Brand card — both read the same store, so a change in one is
 * reflected in the other.
 */
export default function WidgetControls({ size = 28 }: { size?: number }) {
  const { color, radius } = useWidgetTheme();
  const px = `${size}px`;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <div className="flex items-center gap-2">
        {WIDGET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setWidgetColor(c)}
            aria-label={`Set widget colour to ${c}`}
            aria-pressed={color === c}
            className="rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
            style={{
              width: px,
              height: px,
              background: c,
              boxShadow:
                color === c
                  ? `0 0 0 2px var(--background), 0 0 0 4px ${c}`
                  : "0 0 0 1px var(--border)",
            }}
          />
        ))}
      </div>

      <span className="w-px h-5 bg-border" aria-hidden="true" />

      <div className="flex items-center gap-2">
        {WIDGET_RADII.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setWidgetRadius(r.value)}
            aria-label={`${r.label} corners`}
            aria-pressed={radius === r.value}
            className="border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
            style={{
              width: px,
              height: px,
              borderRadius: r.value,
              borderColor: radius === r.value ? "var(--blue)" : "var(--border-medium)",
              background: radius === r.value ? "var(--blue-soft)" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
