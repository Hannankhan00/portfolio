"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Asterisk } from "lucide-react";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiTailwindcss, SiSass, SiBootstrap,
  SiGsap, SiFramer,
  SiNodedotjs, SiExpress,
  SiMysql, SiPostgresql, SiMongodb,
} from "react-icons/si";
import type { IconType } from "react-icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

interface Skill {
  name: string;
  icon: IconType;
  color: string;
}

const groups: { category: string; skills: Skill[] }[] = [
  {
    category: "Frontend",
    skills: [
      { name: "JavaScript",   icon: SiJavascript,  color: "#F7DF1E" },
      { name: "TypeScript",   icon: SiTypescript,  color: "#3178C6" },
      { name: "React",        icon: SiReact,       color: "#61DAFB" },
      { name: "Next.js",      icon: SiNextdotjs,   color: "#ffffff" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "Sass",          icon: SiSass,        color: "#CC6699" },
      { name: "Bootstrap",    icon: SiBootstrap,   color: "#7952B3" },
      { name: "GSAP",         icon: SiGsap,        color: "#88CE02" },
      { name: "Framer Motion", icon: SiFramer,     color: "#0055FF" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js",    icon: SiNodedotjs, color: "#539E43" },
      { name: "Express.js", icon: SiExpress,   color: "#ffffff"  },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MySQL",      icon: SiMysql,      color: "#4479A1" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#699eca" },
      { name: "MongoDB",    icon: SiMongodb,    color: "#47A248" },
    ],
  },
];

function SkillItem({ name, icon: Icon, color }: Skill) {
  return (
    <div className="slide-up flex items-center gap-5 group">
      <Icon
        size={40}
        color={color}
        className="shrink-0 transition-transform duration-200 group-hover:scale-110"
      />
      <span className="text-slate-300 text-lg font-medium whitespace-nowrap group-hover:text-white transition-colors duration-150">
        {name}
      </span>
    </div>
  );
}

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);

  // Animate IN: skill groups fade up
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 80%",
        scrub: 0.5,
      },
    });
    tl.from(".slide-up", { opacity: 0, y: 40, ease: "none", stagger: 0.25 });
  }, { scope: containerRef });

  // Animate OUT: whole section slides up and fades
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 50%",
        end: "bottom 10%",
        scrub: 1,
      },
    });
    tl.to(containerRef.current, { y: -150, opacity: 0 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" className="relative z-10 py-24 px-10 sm:px-16 lg:px-28 xl:px-36">
      <div className="max-w-6xl mx-auto">

        {/* * MY STACK */}
        <div className="slide-up flex items-center gap-2 mb-6">
          <Asterisk size={16} strokeWidth={2.5} className="text-accent" />
          <span className="text-slate-400 text-sm font-medium tracking-[0.25em] uppercase">
            My Stack
          </span>
        </div>

        {/* Skill groups */}
        {groups.map((group) => (
          <div key={group.category} className="py-10">

            {/* Category name — full row, no side-by-side collision */}
            <div className="slide-up mb-14">
              <h3 className="font-display text-[3rem] sm:text-[4.5rem] lg:text-[5.5rem] font-bold text-white uppercase leading-none">
                {group.category}
              </h3>
            </div>

            {/* Skills grid below the title */}
            <div className="flex flex-wrap gap-x-10 gap-y-5 pl-1">
              {group.skills.map((skill) => (
                <SkillItem key={skill.name} {...skill} />
              ))}
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
