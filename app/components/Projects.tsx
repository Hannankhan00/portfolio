"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Asterisk, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Project {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  urlLabel: string;
  description: string;
  highlights: string[];
  tech: string[];
  image: string | null;
}

const projects: Project[] = [
  {
    id: 1,
    title: "SkillSpill",
    subtitle: "AI-powered career & skill marketplace",
    url: "https://skillspill.app",
    urlLabel: "skillspill.app",
    description:
      "A CV-less hiring platform where recruiters discover and hire talent based on verified skills — not resumes. The AI matching engine runs in three layers: semantic NLP embeddings (all-MiniLM-L6-v2), deterministic skill-overlap scoring, and LLM-driven GitHub code-quality analysis via Groq's llama-3.1-70b — composited into a single explainable match score. Talents build verifiable profiles with GitHub integration; recruiters post bounties and receive a ranked shortlist automatically. A social feed called 'The Spill' makes skill signals public and discoverable, not locked inside a resume PDF.",
    highlights: [
      "Semantic NLP matching with all-MiniLM-L6-v2 — 50% of final score",
      "Verified skill-overlap scoring — 35% of final score",
      "GitHub code quality scored via Groq's llama-3.1-70b — 15% of final score",
      "Social feed 'The Spill' — posts, code blocks, GitHub repo cards, hashtags",
      "Real-time notifications & direct messaging via Pusher",
      "Final Year Project — University of Gujrat, Pakistan",
    ],
    tech: [
      "Next.js 16", "React 19", "TypeScript", "MySQL", "Prisma",
      "Python Flask", "sentence-transformers", "Groq API",
      "Azure Blob Storage", "Pusher", "Tailwind CSS 4",
      "JWT", "GitHub OAuth", "Zod",
    ],
    image: null, // /assets/skillspill.png — upload to public/assets/
  },
];

/* ── Modal ── */
function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const lastRef    = useRef<Project | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel   = panelRef.current;
    if (!overlay || !panel) return;

    if (project) {
      lastRef.current = project;
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(panel,
        { y: 48, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.42, ease: "power3.out", delay: 0.05 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panel,   { y: 28, opacity: 0, scale: 0.97, duration: 0.2,  ease: "power2.in" });
      gsap.to(overlay, {
        opacity: 0, duration: 0.26, ease: "power2.in", delay: 0.09,
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const displayed = project ?? lastRef.current;

  return (
    <div
      ref={overlayRef}
      style={{ display: "none" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e14] shadow-[0_0_80px_rgba(168,85,247,0.08)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <X size={15} className="text-slate-400" />
        </button>

        {/* Image */}
        <div className="w-full h-52 sm:h-64 bg-[#13131c] relative overflow-hidden rounded-t-2xl">
          {displayed?.image ? (
            <Image src={displayed.image} alt={displayed.title ?? ""} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl border border-white/8 bg-white/5 flex items-center justify-center">
                <span className="text-slate-600 text-xl font-bold font-display">
                  {displayed?.title?.[0]}
                </span>
              </div>
              <span className="text-slate-700 text-xs tracking-widest uppercase">Image coming soon</span>
            </div>
          )}
          {/* fade to panel bg */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0e0e14] to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 sm:px-10 pb-10 pt-6">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-[2.2rem] sm:text-[3rem] font-bold text-white leading-none mb-2">
                {displayed?.title}
              </h2>
              <p className="text-accent text-sm font-medium">{displayed?.subtitle}</p>
            </div>
            {displayed?.url && (
              <a
                href={displayed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/10 hover:border-accent/40 bg-white/5 hover:bg-accent/10 px-4 py-2 rounded-full transition-all duration-200"
              >
                {displayed.urlLabel}
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/6 mb-7" />

          {/* Description */}
          <p className="text-slate-400 text-sm sm:text-[0.9375rem] leading-relaxed mb-8">
            {displayed?.description}
          </p>

          {/* Highlights */}
          {displayed?.highlights && displayed.highlights.length > 0 && (
            <div className="mb-8">
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-[0.22em] font-semibold mb-3">
                Highlights
              </p>
              <ul className="space-y-2.5">
                {displayed.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm leading-snug">
                    <span className="mt-[6px] w-1 h-1 rounded-full bg-accent shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          {displayed?.tech && (
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-[0.22em] font-semibold mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {displayed.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-slate-300 bg-[#13131c] border border-white/8 px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */
export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

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
    tl.from(".proj-animate", { y: 60, opacity: 0, stagger: 0.18 });
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
    <>
      <section
        ref={containerRef}
        id="projects"
        className="relative z-10 py-24 px-10 sm:px-16 lg:px-28 xl:px-36"
      >
        <div className="max-w-6xl mx-auto">

          {/* Label */}
          <div className="proj-animate flex items-center gap-2 mb-12">
            <Asterisk size={15} strokeWidth={2.5} className="text-accent" />
            <span className="text-slate-400 text-xs font-medium tracking-[0.25em] uppercase">
              Selected Projects
            </span>
          </div>

          {/* List */}
          <div>
            {projects.map((project, i) => (
              <button
                key={project.id}
                onClick={() => setSelected(project)}
                className="proj-animate w-full text-left group border-t border-white/8 py-7 sm:py-10 flex items-center gap-6 sm:gap-10 last:border-b hover:pl-3 transition-all duration-300"
              >
                {/* Number */}
                <span className="font-display text-slate-600 text-sm font-bold shrink-0 tabular-nums group-hover:text-accent transition-colors duration-200">
                  _{String(i + 1).padStart(2, "0")}.
                </span>

                {/* Title + tags */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-[2rem] sm:text-[3rem] md:text-[3.6rem] font-bold text-white leading-none mb-2 sm:mb-3 group-hover:text-accent transition-colors duration-200 truncate">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {project.tech.slice(0, 3).map((t, ti) => (
                      <span key={t} className="flex items-center gap-3 text-slate-500 text-xs">
                        {t}
                        {ti < Math.min(2, project.tech.length - 1) && (
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                        )}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-slate-600 text-xs">+{project.tech.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight
                  size={20}
                  className="text-slate-700 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 shrink-0"
                />
              </button>
            ))}
          </div>

        </div>
      </section>

      <ProjectModal project={selected} onClose={closeModal} />
    </>
  );
}
