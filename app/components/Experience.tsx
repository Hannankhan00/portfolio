"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Asterisk } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const experiences = [
  {
    company: "Acme Corp",
    role: "Senior Frontend Engineer",
    period: "Jan 2024 – Present",
  },
  {
    company: "Bright Digital",
    role: "Frontend Developer",
    period: "Mar 2022 – Dec 2023",
  },
  {
    company: "Nova Systems",
    role: "Software Engineer",
    period: "Jun 2021 – Feb 2022",
  },
  {
    company: "Pixel Labs",
    role: "Web Developer Intern",
    period: "Jan 2021 – May 2021",
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);

  // Animate IN
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 50%",
        toggleActions: "restart none none reverse",
        scrub: 1,
      },
    });
    tl.from(".experience-item", { y: 50, opacity: 0, stagger: 0.3 });
  }, { scope: containerRef });

  // Animate OUT
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 50%",
        end: "bottom 20%",
        scrub: 1,
      },
    });
    tl.to(containerRef.current, { y: -150, opacity: 0 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="experience" className="relative z-10 py-16 sm:py-24 px-6 sm:px-16 lg:px-28 xl:px-36">
      <div className="max-w-6xl mx-auto">

        {/* * MY EXPERIENCE */}
        <div className="experience-item flex items-center gap-2 mb-8 sm:mb-12">
          <Asterisk size={15} strokeWidth={2.5} className="text-accent" />
          <span className="text-slate-400 text-xs font-medium tracking-[0.25em] uppercase">
            My Experience
          </span>
        </div>

        {/* Experience entries */}
        {experiences.map((exp) => (
          <div key={exp.company} className="experience-item py-6 sm:py-10">
            <p className="text-slate-500 text-xs sm:text-sm mb-1">{exp.company}</p>
            <h3 className="font-display text-[1.75rem] sm:text-[3rem] md:text-[3.6rem] font-bold text-white leading-tight sm:leading-none mb-2 sm:mb-3">
              {exp.role}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">{exp.period}</p>
          </div>
        ))}

      </div>
    </section>
  );
}
