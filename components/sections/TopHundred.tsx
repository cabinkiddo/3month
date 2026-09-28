import { useMemo } from "react";

import { Reveal } from "@/components/Reveal";
import { Sparkline } from "@/components/Sparkline";
import { GreenPortal } from "@/components/GreenPortal";
import { buildFunds } from "@/lib/marketData";

const X_PROFILE_URL = "https://x.com/TheDataEdge_";

export function TopHundred() {
  const funds = useMemo(() => buildFunds(100), []);

  return (
    <section className="relative px-6 pt-32 pb-0 md:px-16">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="label-mono">05 — The board</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-lg mt-6">Top 100, funds worldwide</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-muted-foreground mt-6 max-w-lg leading-relaxed">
            100 fund names and three-month returns, sorted by return. The sparklines are illustrative.
          </p>
        </Reveal>

        <div className="mt-20 border-t border-border/60">
          {funds.map((f) => (
            <div
              key={f.name}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-border/40 py-4 transition-colors hover:bg-signal/[0.04] md:grid-cols-[3rem_1fr_7rem_9rem] md:gap-6"
            >
              <span className="data text-muted-foreground/60 text-xs">
                {String(f.rank).padStart(3, "0")}
              </span>
              <span className="truncate text-sm font-light md:text-base">{f.name}</span>
              <span className="data text-signal text-right text-sm">
                +{f.returnPct.toFixed(2)}%
              </span>
              <span className="text-signal-dim group-hover:text-signal hidden justify-self-end transition-colors md:block">
                <Sparkline series={f.series} width={130} height={30} />
              </span>
            </div>
          ))}
        </div>

        <Reveal className="pt-40 pb-10 text-center">
          <p className="label-mono">End of board</p>
          <p className="display-lg text-signal text-glow mt-8">Follow the trend. Check the data.</p>
          <p className="text-muted-foreground data mt-10 text-[0.68rem]">
            Sparklines are illustrative. Not investment advice.
          </p>
          <p className="data mt-12 text-xs uppercase tracking-[0.25em] text-signal-dim">
            Presented by the team at The Data Edge
          </p>
          <div className="edge-portal-slot">
          <GreenPortal />
          <a
            href={X_PROFILE_URL}
            aria-label="Visit our X page"
            title="The Data Edge on X"
            target="_blank"
            rel="noopener noreferrer"
            className="edge-x-link mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-signal hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M18.901 1.153h3.308l-7.227 8.26L23.483 22.847h-6.657l-5.214-6.817-5.964 6.817H2.338l7.73-8.835L1.92 1.153h6.826l4.713 6.231 5.442-6.231Zm-1.161 19.33h1.833L7.75 3.393H5.783L17.74 20.483Z" />
            </svg>
          </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
