"use client";

import Image from "next/image";
import { X, ArrowUpRight } from "lucide-react";
import { DbProject } from "@/lib/db";

interface ProjectPreviewModalProps {
  project: DbProject | null;
  onClose: () => void;
}

export default function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e14] shadow-[0_0_80px_rgba(168,85,247,0.12)] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <X size={15} className="text-slate-400" />
        </button>

        {/* Hero Image */}
        <div className="w-full aspect-video bg-[#13131c] relative overflow-hidden rounded-t-2xl">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl border border-white/8 bg-white/5 flex items-center justify-center">
                <span className="text-slate-600 text-xl font-bold font-display">
                  {project.title[0]}
                </span>
              </div>
              <span className="text-slate-700 text-xs tracking-widest uppercase">Image coming soon</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#0e0e14] to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 sm:px-10 pb-10 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-[2.2rem] sm:text-[3rem] font-bold text-white leading-none mb-2">
                {project.title}
              </h2>
              <p className="text-purple-400 text-sm font-medium">{project.subtitle}</p>
            </div>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/10 hover:border-purple-400/40 bg-white/5 hover:bg-purple-500/10 px-4 py-2 rounded-full transition-all duration-200"
              >
                {project.urlLabel || "Live URL"}
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>

          <div className="w-full h-px bg-white/6 mb-7" />

          <p className="text-slate-400 text-sm sm:text-[0.9375rem] leading-relaxed mb-8">
            {project.description}
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-8">
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-[0.22em] font-semibold mb-3">
                Highlights
              </p>
              <ul className="space-y-2.5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm leading-snug">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.tech && project.tech.length > 0 && (
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-[0.22em] font-semibold mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
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
