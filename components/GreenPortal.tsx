"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

export function GreenPortal({ returnToGold = false }: { returnToGold?: boolean }) {
  const [opening, setOpening] = useState(false);
  const [origin, setOrigin] = useState({ x: "25vw", y: "90vh" });
  const portal = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destination = returnToGold ? "/" : "/crypto/";

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function enter(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (opening) return;
    const box = portal.current?.getBoundingClientRect();
    if (box) setOrigin({ x: `${box.left + box.width / 2}px`, y: `${box.top + box.height / 2}px` });
    setOpening(true);
    timer.current = setTimeout(() => { window.location.assign(destination); }, 940);
  }

  return (
    <>
      <a ref={portal} className="edge-portal" href={destination} onClick={enter}
        aria-label={returnToGold ? "Return to The 3-Month Rule" : "Enter the crypto strategy preview"}
        title={returnToGold ? "Return to The 3-Month Rule" : "Next strategy: The Crypto Signal"}>
        <span className="edge-hint" aria-hidden="true">{returnToGold ? "RETURN TO GOLD" : "NEXT STRATEGY"}</span>
        <span className="edge-rift" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
        <span className="edge-pixels" aria-hidden="true" />
      </a>
      {opening && createPortal(<div className="edge-warp active" aria-hidden="true"
        style={{ "--portal-x": origin.x, "--portal-y": origin.y } as React.CSSProperties}>
        <span className="edge-band" /><span className="edge-band" /><span className="edge-band" />
        <span className="edge-warp-label">{returnToGold ? "RETURNING TO GOLD" : "SIGNAL FOUND"}</span>
      </div>, document.body)}
    </>
  );
}
