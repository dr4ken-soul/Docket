import { useEffect, useRef } from "react";

/** Observes an element and repeats its reveal whenever it re-enters the viewport. */
export function useRepeatableReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => element.classList.toggle("is-revealed", entry.isIntersecting),
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
