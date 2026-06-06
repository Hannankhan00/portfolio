"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "./SectionLabel";
import { FolderOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);

  // Animate IN
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });
    tl.from(".slide-up-and-fade", { y: 80, opacity: 0, stagger: 0.1 });
  }, { scope: containerRef });

  // Animate OUT
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 50%",
        end: "bottom 10%",
        scrub: 0.5,
      },
    });
    tl.to(containerRef.current, { y: -150, opacity: 0 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="projects" className="relative z-10 py-28 px-10 sm:px-16 lg:px-28 xl:px-36">
      <div className="max-w-6xl mx-auto">

        <div className="slide-up-and-fade">
          <SectionLabel>Projects</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-4 mb-14">
            Featured Work
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="slide-up-and-fade rounded-2xl border border-white/5 bg-surface p-6 flex flex-col gap-4 opacity-50">
              <div className="w-full h-36 rounded-xl bg-surface-2 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-3/5 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-4/5 rounded bg-white/5" />
              </div>
              <div className="flex gap-2 mt-auto">
                <div className="h-6 w-16 rounded-full bg-white/5" />
                <div className="h-6 w-16 rounded-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>

        <div className="slide-up-and-fade flex flex-col items-center mt-12 gap-2 text-slate-500">
          <FolderOpen size={20} className="opacity-40" />
          <p className="text-sm">Project details coming soon</p>
        </div>

      </div>
    </section>
  );
}
