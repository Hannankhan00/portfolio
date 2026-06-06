"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const container = useRef<HTMLElement>(null);

  // Animate IN when section enters viewport
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });
    tl.from(".slide-up-and-fade", { y: 150, opacity: 0, stagger: 0.05 });
  }, { scope: container });

  // Animate OUT when section leaves viewport
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "bottom 50%",
        end: "bottom 10%",
        scrub: 0.5,
      },
    });
    tl.to(".slide-up-and-fade", { y: -150, opacity: 0, stagger: 0.02 });
  }, { scope: container });

  return (
    <section ref={container} id="about" className="relative z-10 pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-28 xl:px-36">

        {/* Large statement */}
        <h2 className="slide-up-and-fade font-display font-bold text-white leading-[1.1] text-[clamp(1.9rem,4.5vw,3.8rem)] mb-20 max-w-5xl">
          I build clean, scalable web applications, engineering the full picture from intuitive frontends to powerful backends.
        </h2>

        {/* Divider */}
        <div className="slide-up-and-fade flex items-center gap-6 mb-14">
          <span className="text-slate-500 text-sm whitespace-nowrap">This is me.</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Two-column bio */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <h3 className="slide-up-and-fade font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Hi, I&apos;m{" "}
            <span className="text-accent">Hannan.</span>
          </h3>

          <div className="slide-up-and-fade space-y-5 text-slate-400 leading-relaxed">
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
        </div>

      </div>
    </section>
  );
}
