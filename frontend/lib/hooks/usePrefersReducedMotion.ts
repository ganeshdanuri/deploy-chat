import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Whether the visitor has asked for reduced motion.
 *
 * useSyncExternalStore rather than useState + useEffect: matchMedia is an
 * external store, and reading it in an effect means a setState during mount.
 * The third argument is the server snapshot — assume motion is fine so SSR
 * markup matches the common case.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
