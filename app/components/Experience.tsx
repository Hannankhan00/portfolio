"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Asterisk } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ExperienceItem {
  id?: number;
  company: string;
  role: string;
  period: string;
  description?: string | null;
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    company: "RapidTech Pro",
    role: "Full Stack Developer",
    period: "Jun 2024 \u2013 Present",
  },
  {
    company: "Inhancers",
    role: "Graphic Designer",
    period: "May 2023 \u2013 Jun 2024",
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const [experiencesList, setExperiencesList] = useState<ExperienceItem[]>(DEFAULT_EXPERIENCES);

  // Fetch published experiences dynamically from database
  useEffect(() => {
    let active = true;
    fetch("/api/experiences")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.experiences && Array.isArray(data.experiences) && data.experiences.length > 0) {
          setExperiencesList(data.experiences);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Animate IN — smooth, reliable reveal using fromTo so dynamic data never gets stuck at opacity 0
  useGSAP(() => {
    if (!containerRef.current) return;

    const tween = gsap.fromTo(
      ".experience-item",
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Refresh ScrollTrigger calculations after dynamic data updates
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => {
      clearTimeout(timer);
      tween.kill();
    };
  }, { scope: containerRef, dependencies: [experiencesList] });

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
        {experiencesList.map((exp, index) => (
          <div key={`${exp.company}-${exp.role}-${index}`} className="experience-item py-6 sm:py-10">
            <p className="text-slate-500 text-xs sm:text-sm mb-1">{exp.company}</p>
            <h3 className="font-display text-[1.75rem] sm:text-[3rem] md:text-[3.6rem] font-bold text-white leading-tight sm:leading-none mb-2 sm:mb-3">
              {exp.role}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">{exp.period}</p>
            {exp.description && (
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                {exp.description}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
