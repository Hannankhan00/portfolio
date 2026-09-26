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

const DEFAULT_PROJECTS: Project[] = [
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
    image: "/assets/skillspill.png",
  },
  {
    id: 2,
    title: "Compact Personnel",
    subtitle: "Healthcare & care-staffing platform",
    url: "https://www.compactpersonnel.co.uk",
    urlLabel: "compactpersonnel.co.uk",
    description:
      "A full landing platform for Compact Personnel, a UK-based care organisation that supports adults with learning disabilities, complex needs, and neurodivergent conditions. The site presents their full service catalogue — Supported Living, Domiciliary Care, Complex Care, Mental Health Support, Live-in Care, Respite, Palliative & End of Life Care, and Hospital-to-Home transitions — with a person-centred design that reflects their mission of independence, choice, and social inclusion. The platform is built to scale with a recruitment system and additional modules.",
    highlights: [
      "Landing platform covering 8 care service categories",
      "Recruitment system integration for care-staff hiring",
      "Person-centred design reflecting the company's therapeutic approach",
      "Framer Motion page transitions and scroll animations",
      "Modular architecture allowing new service pages and features",
    ],
    tech: ["Next.js", "Node.js", "Tailwind CSS", "Framer Motion"],
    image: "/assets/compactpersonnel.png",
  },
  {
    id: 3,
    title: "GoTripJapan",
    subtitle: "Travel booking platform",
    url: "https://gotripjapan.com",
    urlLabel: "gotripjapan.com",
    description:
      "A comprehensive travel booking platform for Japan featuring full booking functionality, seamless PayPal integration for secure payments, and reliable cloud storage for managing user and booking data.",
    highlights: [
      "Full booking and reservation system",
      "Secure payment processing via PayPal integration",
      "Cloud storage integration for user and booking data",
    ],
    tech: ["Next.js", "Node.js", "MySQL", "Tailwind CSS"],
    image: "/assets/gotripjapan.png",
  },
  {
    id: 4,
    title: "4Atek",
    subtitle: "Software house platform & custom CMS",
    url: "https://fouratek.com",
    urlLabel: "fouratek.com",
    description:
      "A complete website and custom-built CMS for 4Atek, a software house. The platform features a beautiful welcome animation powered by Framer Motion, alongside a fully integrated client management system and a robust internal hiring system.",
    highlights: [
      "Custom-built CMS for full content control",
      "Integrated Client Management System",
      "Built-in Hiring and Applicant Tracking System",
      "Framer Motion welcome animations",
    ],
    tech: ["Next.js", "Node.js", "MySQL", "Framer Motion"],
    image: "/assets/fouratek.png",
  },
];

/* ── Modal ── */
function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);

  // Derived state: keep the last non-null project so content stays visible during close animation
  if (project !== null && project !== displayedProject) {
    setDisplayedProject(project);
  }

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (project) {
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(panel,
        { y: 48, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.42, ease: "power3.out", delay: 0.05 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panel, { y: 28, opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" });
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

  const displayed = displayedProject;

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
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-surface shadow-[0_0_80px_rgba(168,85,247,0.08)]"
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
        <div className="w-full aspect-video bg-surface-2 relative overflow-hidden rounded-t-2xl">
          {displayed?.image ? (
            <Image src={displayed.image} alt={displayed.title ?? ""} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
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
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-surface to-transparent" />
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
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
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
                    className="text-xs text-slate-300 bg-surface-2 border border-white/8 px-3 py-1 rounded-full"
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
  const previewRef = useRef<HTMLDivElement>(null);
  const [projectsList, setProjectsList] = useState<Project[]>(DEFAULT_PROJECTS);
  const [selected, setSelected] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  // Fetch published projects dynamically from Neon database
  useEffect(() => {
    let active = true;
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectsList(data.projects);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Smooth floating cursor preview tracking
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    const xTo = gsap.quickTo(preview, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.3, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      // Offset preview from cursor so it doesn't block clicks
      const offsetX = 28;
      const offsetY = -100;
      xTo(e.clientX + offsetX);
      yTo(e.clientY + offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate floating preview in / out based on hover state
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    if (hoveredProject?.image) {
      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(preview, {
        opacity: 0,
        scale: 0.88,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [hoveredProject]);

  // Animate IN — smooth, reliable reveal using fromTo so dynamic data never gets stuck at opacity 0
  useGSAP(() => {
    if (!containerRef.current) return;

    const tween = gsap.fromTo(
      ".proj-animate",
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

    // Refresh ScrollTrigger calculations after DOM update
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => {
      clearTimeout(timer);
      tween.kill();
    };
  }, { scope: containerRef, dependencies: [projectsList] });

  return (
    <>
      <section
        ref={containerRef}
        id="projects"
        className="relative z-10 py-24 px-6 sm:px-16 lg:px-28 xl:px-36"
        onMouseLeave={() => setHoveredProject(null)}
      >
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="proj-animate flex items-center justify-between gap-4 mb-12 sm:mb-16">
            <div className="flex items-center gap-2">
              <Asterisk size={15} strokeWidth={2.5} className="text-accent" />
              <span className="text-slate-400 text-xs font-semibold tracking-[0.25em] uppercase">
                Featured Work
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono tracking-wider hidden sm:inline-block">
              {projectsList.length} Projects &bull; Click row for full case study
            </span>
          </div>

          {/* Editorial Project List */}
          <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {projectsList.map((project, i) => (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredProject(project)}
                onClick={() => setSelected(project)}
                className="proj-animate group relative w-full py-8 sm:py-11 px-2 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.02] rounded-2xl transition-all duration-300"
              >
                {/* Left: Number + Title & Info */}
                <div className="flex items-start sm:items-center gap-5 sm:gap-8 flex-1 min-w-0">
                  {/* Number */}
                  <span className="font-display text-slate-600 text-sm sm:text-base font-bold shrink-0 tabular-nums group-hover:text-accent transition-colors duration-200 mt-1 sm:mt-0">
                    _{String(i + 1).padStart(2, "0")}.
                  </span>

                  {/* Mobile Thumbnail (visible only on small screens < md where cursor hover doesn't exist) */}
                  {project.image && (
                    <div className="md:hidden relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-surface-2">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Text details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="font-display text-2xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] font-bold text-white leading-tight sm:leading-none group-hover:text-accent transition-colors duration-200">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <span className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:inline-block">
                          &bull; {project.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Subtitle for mobile screens */}
                    {project.subtitle && (
                      <p className="sm:hidden text-xs text-slate-400 mt-1 line-clamp-1">
                        {project.subtitle}
                      </p>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                      {project.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono text-slate-300 bg-white/[0.04] border border-white/8 px-2.5 py-0.5 rounded-md group-hover:border-accent/25 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center pl-10 md:pl-0">
                  {/* Direct Live Demo button */}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`Open live site for ${project.title}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-accent/20 border border-white/10 hover:border-accent/50 transition-all duration-200 group/btn"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight
                        size={13}
                        className="text-slate-400 group-hover/btn:text-accent group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  )}

                  {/* Case Study Modal Trigger Pill */}
                  <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-400 group-hover:text-white bg-transparent group-hover:bg-white/[0.06] border border-transparent group-hover:border-white/10 transition-all duration-200">
                    <span>Details</span>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-500 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Floating Cursor Screenshot Preview (Desktop only) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:block w-80 h-48 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(168,85,247,0.22)] border border-purple-500/30 bg-[#0e0e14] opacity-0 will-change-transform"
      >
        {hoveredProject?.image && (
          <div className="relative w-full h-full">
            <Image
              src={hoveredProject.image}
              alt={hoveredProject.title}
              fill
              sizes="320px"
              className="object-cover"
            />
            {/* Subtle bottom vignette gradient with project name badge */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white font-display truncate">
                {hoveredProject.title}
              </span>
              <span className="text-[10px] text-accent font-mono uppercase tracking-wider">
                Click to inspect
              </span>
            </div>
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={closeModal} />
    </>
  );
}
