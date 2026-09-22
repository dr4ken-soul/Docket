import { useEffect, useState } from "react";

interface ScrollState {
  compact: boolean;
  progress: number;
}

/** Tracks navigation compaction and document scroll progress. */
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({ compact: false, progress: 0 });

  useEffect(() => {
    /** Updates the scroll state from the current document position. */
    function updateScrollState(): void {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setState({
        compact: window.scrollY > 80,
        progress: available > 0 ? Math.min(window.scrollY / available, 1) : 0,
      });
    }
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return state;
}
