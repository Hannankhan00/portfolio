import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const skillGroups = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "HTML & CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    category: "Database",
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 py-28 px-10 sm:px-16 lg:px-28 xl:px-36">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <SectionLabel>Skills</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-4 mb-14">
            Tech Stack
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-10">
          {skillGroups.map(({ category, skills }, i) => (
            <Reveal key={category} delay={i * 100}>
              <h3 className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-5 font-medium">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-lg bg-surface border border-white/10 text-slate-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
