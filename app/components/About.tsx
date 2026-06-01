import Reveal from "./Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 pt-24 pb-32"
    >
      <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-28 xl:px-36">

        {/* Large statement */}
        <Reveal>
          <h2 className="font-display font-bold text-white leading-[1.1] text-[clamp(1.9rem,4.5vw,3.8rem)] mb-20 max-w-5xl">
            I build clean, scalable web applications, engineering the full picture from intuitive frontends to powerful backends.
          </h2>
        </Reveal>

        {/* Divider */}
        <Reveal delay={100}>
          <div className="flex items-center gap-6 mb-14">
            <span className="text-slate-500 text-sm whitespace-nowrap">This is me.</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </Reveal>

        {/* Two-column bio */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <Reveal delay={150}>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              Hi, I&apos;m{" "}
              <span className="text-accent">Hannan.</span>
            </h3>
          </Reveal>

          <Reveal delay={250}>
            <div className="space-y-5 text-slate-400 leading-relaxed">
              <p>
                I&apos;m a Full Stack Developer focused on building end-to-end
                web solutions. From crafting intuitive interfaces with React and
                Next.js to designing robust APIs with Node.js and Express. I
                care about every layer of the product.
              </p>
              <p>
                My approach centres on performance, clean architecture, and
                delivering experiences that genuinely work for users. Whether
                it&apos;s a complex database schema or a pixel-perfect UI, I bring
                the same attention to detail across the entire stack.
              </p>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
