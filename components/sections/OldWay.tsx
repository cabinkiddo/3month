import { Reveal } from "@/components/Reveal";
import { Sparkline } from "@/components/Sparkline";
import { noisySingle } from "@/lib/marketData";

const series = noisySingle();

export function OldWay() {
  return (
    <section className="relative flex min-h-screen items-center px-6 md:px-16">
      <div className="grid w-full max-w-6xl gap-16 md:grid-cols-2 md:items-center">
        <div>
          <Reveal>
            <p className="label-mono">01 — The old way</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-lg mt-6">One company. One story. One guess.</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-muted-foreground mt-8 max-w-md leading-relaxed">
              Read the annual report. Believe in the founder. Decide what the market has missed.
              Then wait, and find out whether you were right about a single line on a chart.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="border-border/70 bg-card/40 relative rounded-md border p-6 backdrop-blur-sm">
            <div className="flex items-baseline justify-between">
              <span className="label-mono">Single equity · illustration</span>
              <span className="data text-noise text-sm">sample trace</span>
            </div>
            <div className="text-noise mt-6">
              <Sparkline series={series} width={420} height={140} strokeWidth={1.1} />
            </div>
            <p className="data text-muted-foreground mt-6 text-[0.7rem]">
              A noisy path, generated for illustration
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
