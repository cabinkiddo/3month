import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 md:px-16">
      <Reveal>
        <p className="label-mono">The 3-Month Rule</p>
      </Reveal>

      <Reveal delay={0.15}>
        <h1 className="display-xl mt-8 max-w-5xl">
          Everyone&apos;s chasing the exciting trade.
          <br />
          <span className="text-signal text-glow">The money is in the boring one.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="text-muted-foreground mt-10 max-w-xl text-lg leading-relaxed">
          Crypto and meme stocks make headlines. Funds offer a wider field to measure. What follows is a mechanical way to compare recent fund trends, with illustrative data.
        </p>
      </Reveal>

      <Reveal delay={0.5} className="mt-16">
        <div className="flex items-center gap-3">
          <span className="label-mono">Scroll</span>
          <span className="bg-signal/60 block h-px w-16 origin-left animate-pulse" />
        </div>
      </Reveal>
    </section>
  );
}
