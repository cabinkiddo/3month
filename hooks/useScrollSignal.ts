import { useEffect, useRef, useState } from "react";

/** Shared, mutable scroll state read by the WebGL loop without re-rendering. */
export const scrollSignal = { progress: 0, velocity: 0 };

export function useScrollTracker() {
  useEffect(() => {
    let last = 0;
    let raf = 0;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      scrollSignal.velocity += ((p - last) * 60 - scrollSignal.velocity) * 0.12;
      scrollSignal.progress = p;
      last = p;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}

/** Section-local progress (0 → 1) for scroll-driven UI values. */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const tick = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height + window.innerHeight;
        const p = 1 - (r.bottom / total || 0);
        setProgress(Math.max(0, Math.min(1, p)));
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [ref]);

  return progress;
}