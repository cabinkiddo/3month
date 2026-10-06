"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import CorridorFallback from "@/app/CorridorThree";
import { AmbientSound } from "@/components/AmbientSound";
import { GreenPortal } from "@/components/GreenPortal";
import { useScrollTracker } from "@/hooks/useScrollSignal";

const TunnelCanvas = lazy(() => import("@/components/TunnelCanvas"));
// Replace N/A with the verified contract address when the token is ready.
const CRYPTO_CA = "0xcb6a84613601008cb7120f7f2850de9c1d75699c";

export default function CryptoPreview() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const hasAddress = CRYPTO_CA.trim().length > 0 && CRYPTO_CA !== "N/A";
  async function copyAddress() {
    if (!hasAddress) return;
    try {
      await navigator.clipboard.writeText(CRYPTO_CA);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  }
  useScrollTracker();
  useEffect(() => {
    const canvas = document.createElement("canvas");
    setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
  }, []);

  return (
    <main className="green-page relative min-h-screen overflow-x-clip bg-[#08080b] text-foreground">
      <AmbientSound src="/data-edge-crypto.mp3" />
      {webgl === true ? <Suspense fallback={null}><TunnelCanvas theme="green" /></Suspense>
        : webgl === false ? <CorridorFallback /> : null}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_15%,#08080b_88%)]" />
      <div className="relative z-10">
        <section className="flex min-h-screen flex-col justify-center px-6 md:px-16">
          <p className="label-mono text-signal">The Data Edge / Strategy 02</p>
          <h1 className="display-xl mt-8 max-w-5xl">The Crypto <span className="text-signal text-glow">Signal.</span></h1>
          <p className="data mt-8 text-sm uppercase tracking-[0.3em] text-signal">Coming soon</p>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            A new strategy for reading crypto markets is in development. We’ll share the rule, the data and its limits when it’s ready.
          </p>
          <div className="mt-16 flex items-center gap-3"><span className="label-mono">Scroll</span><span className="block h-px w-16 animate-pulse bg-signal/60" /></div>
        </section>
        <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
          <p className="label-mono text-signal">The next chapter</p>
          <h2 className="display-lg mt-7 max-w-3xl">Another market.<br /><span className="text-signal text-glow">The same curiosity.</span></h2>
          <p className="mt-8 max-w-md leading-relaxed text-muted-foreground">We’re building the next Data Edge project. The details will appear here when the strategy is ready to show.</p>
          <div className="mt-20 w-full max-w-2xl rounded-sm border border-signal/30 bg-[#08150e]/75 p-6 text-left shadow-[0_0_45px_#4bed8b12] backdrop-blur-md md:p-8">
            <p className="label-mono text-signal">A new chapter is taking shape</p>
            <p className="mt-5 text-lg font-light leading-relaxed md:text-xl">To mark our next project, we’re lanching a cryptocurrency. The verified contract address is now live!</p>
            <div className="mt-7 flex flex-col gap-3 border-t border-signal/20 pt-6 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <span className="label-mono">Contract address (CA)</span>
                <p className="data mt-2 break-all text-sm text-signal" aria-label={`Contract address: ${CRYPTO_CA}`}>{CRYPTO_CA}</p>
              </div>
              <button type="button" onClick={copyAddress} disabled={!hasAddress}
                className="data shrink-0 rounded-sm border border-signal/60 px-5 py-3 text-xs uppercase tracking-widest text-signal transition-colors hover:bg-signal/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground">
                {copied ? "Copied" : "Copy CA"}
              </button>
            </div>
            <p className="data mt-4 text-[0.68rem] text-muted-foreground" role="status">{copyError ? "Could not copy. Please copy the address manually." : hasAddress ? "Check the contract address before using it." : "Address available when announced."}</p>
          </div>
          <div className="edge-portal-slot"><GreenPortal returnToGold /></div>
          <p className="label-mono mt-8">Return to The 3-Month Rule</p>
        </section>
      </div>
    </main>
  );
}
