import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import { Briefcase } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 py-28 px-10 sm:px-16 lg:px-28 xl:px-36">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <SectionLabel>Experience</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-4 mb-14">
            Work History
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10 bg-surface/20">
            <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center mb-4 text-accent/40">
              <Briefcase size={20} />
            </div>
            <p className="text-slate-500 text-sm">Experience details coming soon</p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
