import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { Sparkline } from "@/components/Sparkline";
import { buildContrastPair } from "@/lib/marketData";

const { smooth, jagged } = buildContrastPair();

const STEPS = [
  {
    n: "01",
    title: "Measure, don't predict",
    body: "Take trailing 3-month returns across the entire fund universe. No forecasts, no narratives — just what already happened.",
  },
  {
    n: "02",
    title: "Prefer shape over size",
    body: "Filter for runs that look stable: a smooth upward trend, low day-to-day scatter. Test whether steadier shapes persist more often than chaotic ones.",
  },
  {
    n: "03",
    title: "Ride it, then leave",
    body: "Hold while the shape holds. When the trend breaks down, rotate to whatever now looks stable. Repeat at the next review.",
  },
];

export function RuleSection() {
  const [pick, setPick] = useState<"smooth" | "jagged">("smooth");

  // Keep the selected path under the visitor’s control.
  const highlight = pick;

  return (
    <section className="relative px-6 py-32 md:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="label-mono">03 — The rule</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-lg mt-6 max-w-3xl">
            Trust the <span className="text-signal text-glow">data</span>, not the story.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            A fund can hold hundreds of companies, so its trend reflects more than one company’s fortunes. Look for a steady three-month uptrend and test whether that momentum persists. It may continue, but no trend is a promise.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={0.1 * i}>
              <div className="border-border/60 h-full border-t pt-6">
                <span className="data text-signal-dim text-sm">{s.n}</span>
                <h3 className="mt-4 text-xl font-light">{s.title}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-28">
          <div className="border-border/70 bg-card/40 rounded-md border p-6 backdrop-blur-sm md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="label-mono">Same return. Different shape.</p>
              <p className="data text-muted-foreground text-xs">
                both +18.0% over the trailing 3 months
              </p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {(
                [
                  { key: "jagged", series: jagged, label: "Fund A — spiky", vol: "2.61" },
                  { key: "smooth", series: smooth, label: "Fund B — stable", vol: "0.22" },
                ] as const
              ).map((card) => {
                const active = highlight === card.key;
                return (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setPick(card.key)}
                    className={`rounded-md border p-6 text-left transition-all duration-500 ${
                      active
                        ? "border-signal/70 bg-signal/[0.06] text-signal shadow-[var(--glow-signal)]"
                        : "border-border/60 text-noise hover:border-border"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="label-mono">{card.label}</span>
                      <span className="data text-sm">+18.0%</span>
                    </div>
                    <Sparkline
                      series={card.series}
                      width={420}
                      height={120}
                      className="mt-6 w-full"
                      strokeWidth={active ? 1.6 : 1}
                      fill={active}
                    />
                    <div className="data mt-6 flex items-center justify-between text-[0.7rem]">
                      <span>daily vol {card.vol}</span>
                      <span
                        className={
                          active ? "text-signal" : "text-muted-foreground/70"
                        }
                      >
                        {active ? "▸ steadier path" : "—"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-muted-foreground mt-8 max-w-2xl text-sm leading-relaxed">
              Identical headline numbers, opposite information. The spike may reflect one event; the steadier path is the pattern this rule would screen for. Neither chart predicts the next quarter.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
