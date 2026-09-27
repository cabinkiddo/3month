import { useEffect, useState } from "react";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + 1.8 + Math.random() * 3.4);
      setPct(Math.floor(value));
      if (value >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => setLeaving(true), 420);
        window.setTimeout(onDone, 1250);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="data text-signal text-glow text-[clamp(3.5rem,14vw,10rem)] leading-none font-light">
        {String(pct).padStart(3, "0")}%
      </div>
      <p className="label-mono mt-6">Preparing the data corridor</p>
      <div className="mt-8 h-px w-56 overflow-hidden bg-border">
        <div
          className="bg-signal h-full transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
