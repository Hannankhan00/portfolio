import Reveal from "./Reveal";
import { Asterisk } from "lucide-react";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiTailwindcss, SiSass, SiBootstrap,
  SiNodedotjs, SiExpress,
  SiMysql, SiPostgresql, SiMongodb,
} from "react-icons/si";
import type { IconType } from "react-icons";

interface Skill {
  name: string;
  icon: IconType;
  color: string;
  bg: string;
}

const groups: { category: string; skills: Skill[] }[] = [
  {
    category: "Frontend",
    skills: [
      { name: "JavaScript",   icon: SiJavascript,  color: "#1e1e1e", bg: "#F7DF1E" },
      { name: "TypeScript",   icon: SiTypescript,  color: "#ffffff", bg: "#3178C6" },
      { name: "React",        icon: SiReact,       color: "#61DAFB", bg: "#1a1f35" },
      { name: "Next.js",      icon: SiNextdotjs,   color: "#000000", bg: "#ffffff" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8", bg: "#0c1929" },
      { name: "Sass",         icon: SiSass,        color: "#ffffff", bg: "#bf4080" },
      { name: "Bootstrap",    icon: SiBootstrap,   color: "#ffffff", bg: "#7952B3" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js",    icon: SiNodedotjs, color: "#539E43", bg: "#0f1f0f" },
      { name: "Express.js", icon: SiExpress,   color: "#ffffff", bg: "#1c1c1c" },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MySQL",      icon: SiMysql,      color: "#4479A1", bg: "#0d1929" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#699eca", bg: "#0d1534" },
      { name: "MongoDB",    icon: SiMongodb,    color: "#47A248", bg: "#0d1f0d" },
    ],
  },
];

function SkillItem({ name, icon: Icon, color, bg }: Skill) {
  return (
    <div className="flex items-center gap-3.5 group">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: bg }}
      >
        <Icon size={22} color={color} />
      </div>
      <span className="text-slate-300 text-sm font-medium whitespace-nowrap group-hover:text-white transition-colors duration-150">
        {name}
      </span>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 py-24 px-10 sm:px-16 lg:px-28 xl:px-36">
      <div className="max-w-6xl mx-auto">

        {/* * MY STACK */}
        <Reveal>
          <div className="flex items-center gap-2 mb-12">
            <Asterisk size={15} strokeWidth={2.5} className="text-accent" />
            <span className="text-slate-400 text-xs font-medium tracking-[0.25em] uppercase">
              My Stack
            </span>
          </div>
        </Reveal>

        {/* Skill groups */}
        {groups.map((group, gi) => (
          <Reveal key={group.category} delay={gi * 80}>
            <div className="grid grid-cols-1 sm:grid-cols-[310px_1fr] gap-y-8 sm:gap-x-16 sm:gap-y-0 py-12 border-t border-white/[0.07] last:border-b last:border-white/[0.07]">

              {/* Category name */}
              <div className="flex items-start overflow-hidden">
                <h3 className="font-display text-[2.8rem] sm:text-[3.5rem] font-bold text-white uppercase leading-none">
                  {group.category}
                </h3>
              </div>

              {/* Skills — 3 per row grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 content-start">
                {group.skills.map((skill) => (
                  <SkillItem key={skill.name} {...skill} />
                ))}
              </div>

            </div>
          </Reveal>
        ))}

      </div>
    </section>
  );
}
