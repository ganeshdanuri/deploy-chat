import { useEffect, useRef, useState } from "react";

/**
 * Returns `[ref, entered]`. `entered` flips to true the first time the element
 * scrolls into view and stays true.
 *
 * Use this for one-shot entrance animations that need a boolean in React state
 * (counters, SVG draws). For plain CSS reveals, prefer `useReveal`, which
 * toggles a class and avoids a re-render.
 *
 * Options are taken as primitives rather than an IntersectionObserverInit so
 * they can sit in the dependency array honestly.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.25,
  rootMargin = "0px",
  delay = 0,
}: { threshold?: number; rootMargin?: string; delay?: number } = {}) {
  const ref = useRef<T>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (entered) return;
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (delay) timer = setTimeout(() => setEntered(true), delay);
        else setEntered(true);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    // Runs again once `entered` flips, which cleans up and then bails out.
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [entered, threshold, rootMargin, delay]);

  return [ref, entered] as const;
}
