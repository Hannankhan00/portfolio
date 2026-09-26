"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronUp, ChevronDown, Eye, Edit3, Trash2 } from "lucide-react";
import { DbProject } from "@/lib/db";

interface ProjectRowProps {
  project: DbProject;
  idx: number;
  totalLength: number;
  onMoveOrder: (project: DbProject, direction: "up" | "down") => void;
  onTogglePublish: (project: DbProject) => void;
  onPreview: (project: DbProject) => void;
  onEdit: (project: DbProject) => void;
  onDelete: (id: number) => void;
}

export default function ProjectRow({
  project,
  idx,
  totalLength,
  onMoveOrder,
  onTogglePublish,
  onPreview,
  onEdit,
  onDelete,
}: ProjectRowProps) {
  return (
    <div className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0f0f17]/70 hover:border-purple-500/30 hover:bg-[#12121d] transition-all duration-200">
      {/* Left section: Order + Image + Title Info */}
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        {/* Order control */}
        <div className="flex flex-col items-center gap-1 shrink-0 text-slate-500">
          <button
            onClick={() => onMoveOrder(project, "up")}
            disabled={idx === 0}
            title="Move up"
            className="p-1 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronUp size={14} />
          </button>
          <span className="font-mono text-xs font-semibold text-slate-400">
            #{project.order_index}
          </span>
          <button
            onClick={() => onMoveOrder(project, "down")}
            disabled={idx === totalLength - 1}
            title="Move down"
            className="p-1 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl bg-white/[0.04] border border-white/10 relative overflow-hidden shrink-0">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold font-display text-base">
              {project.title[0]}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-purple-300 transition-colors truncate">
              {project.title}
            </h3>

            {project.is_published ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Published
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Draft
              </span>
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-purple-300 transition-colors"
              >
                <span>{project.urlLabel || "Live URL"}</span>
                <ArrowUpRight size={11} />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {project.subtitle || project.description}
          </p>

          {/* Tech Badges */}
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {project.tech.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-slate-400"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 5 && (
                <span className="text-[10px] text-slate-500">
                  +{project.tech.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto justify-end">
        <button
          onClick={() => onTogglePublish(project)}
          title={project.is_published ? "Unpublish" : "Publish"}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            project.is_published
              ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10"
              : "border-white/10 text-slate-400 bg-white/[0.02] hover:bg-white/[0.06]"
          }`}
        >
          {project.is_published ? "Published" : "Set Published"}
        </button>

        <button
          onClick={() => onPreview(project)}
          title="Live Modal Preview"
          className="p-2 rounded-xl border border-white/10 hover:border-purple-500/40 bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all"
        >
          <Eye size={15} />
        </button>

        <button
          onClick={() => onEdit(project)}
          title="Edit Project"
          className="p-2 rounded-xl border border-white/10 hover:border-purple-500/40 bg-white/[0.03] hover:bg-purple-600/20 text-slate-400 hover:text-purple-300 transition-all"
        >
          <Edit3 size={15} />
        </button>

        <button
          onClick={() => onDelete(project.id)}
          title="Delete Project"
          className="p-2 rounded-xl border border-white/10 hover:border-red-500/40 bg-white/[0.03] hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
