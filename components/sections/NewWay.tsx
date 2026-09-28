import { Reveal } from "@/components/Reveal";

export function NewWay() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 text-center md:px-16">
      <div className="max-w-3xl">
        <Reveal>
          <p className="label-mono">02 — The new way</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="display-lg mt-6">
            A handful of good calls used to be enough. There&apos;s too much data now for guessing
            to compete.
          </h2>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="text-muted-foreground mx-auto mt-10 max-w-xl leading-relaxed">
            Thousands of possible fund paths can be compared on the same window.
          </p>
        </Reveal>

        <Reveal delay={0.36}>
          <dl className="mt-16 grid grid-cols-3 gap-8 text-left">
            {[
              ["100", "sample fund rows"],
              ["63", "illustrative daily points"],
              ["1950–25", "simulated timeline"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="data text-signal text-2xl md:text-3xl">{value}</dt>
                <dd className="label-mono mt-2">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
