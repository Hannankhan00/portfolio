"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Slide content up and fade out as you scroll away (Banner.tsx pattern)
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 70%",
        end: "bottom 10%",
        scrub: 1,
      },
    });
    tl.to(".hero-el", { y: -150, opacity: 0, stagger: 0.02 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center z-10">
      <div className="w-full px-10 sm:px-16 lg:px-28 xl:px-36 py-28">
        <div className="max-w-4xl">

          <p className="text-accent text-sm tracking-[0.25em] uppercase font-medium hero-el hero-el-1">
            Full Stack Developer
          </p>

          <h1 className="font-display font-bold uppercase leading-[0.9] tracking-tight text-[clamp(2.8rem,7vw,5.5rem)] mt-3 hero-el hero-el-2">
            <span className="text-accent">Hannan</span>
            <br />
            <span className="text-white">Khan</span>
          </h1>

          <p className="text-slate-400 sm:text-lg mt-4 mb-10 max-w-[40ch] leading-relaxed hero-el hero-el-3">
            Building performant, scalable web applications from polished
            frontends to robust backends.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 hero-el hero-el-4">
            <MagneticButton href="mailto:8hannankhan00@gmail.com" />

            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-slate-400 text-sm">
                Available for opportunities
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
