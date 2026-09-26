"use client";

import { ChevronUp, ChevronDown, Edit3, Trash2, Briefcase } from "lucide-react";
import { DbExperience } from "@/lib/db";

interface ExperienceRowProps {
  experience: DbExperience;
  idx: number;
  totalLength: number;
  onMoveOrder: (exp: DbExperience, direction: "up" | "down") => void;
  onTogglePublish: (exp: DbExperience) => void;
  onEdit: (exp: DbExperience) => void;
  onDelete: (id: number) => void;
}

export default function ExperienceRow({
  experience,
  idx,
  totalLength,
  onMoveOrder,
  onTogglePublish,
  onEdit,
  onDelete,
}: ExperienceRowProps) {
  return (
    <div className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0f0f17]/70 hover:border-purple-500/30 hover:bg-[#12121d] transition-all duration-200">
      {/* Left: Order + Icon + Info */}
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        <div className="flex flex-col items-center gap-1 shrink-0 text-slate-500">
          <button
            onClick={() => onMoveOrder(experience, "up")}
            disabled={idx === 0}
            title="Move up"
            className="p-1 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronUp size={14} />
          </button>
          <span className="font-mono text-xs font-semibold text-slate-400">
            #{experience.order_index}
          </span>
          <button
            onClick={() => onMoveOrder(experience, "down")}
            disabled={idx === totalLength - 1}
            title="Move down"
            className="p-1 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <Briefcase size={20} className="text-purple-400" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-purple-300 transition-colors truncate">
              {experience.role}
            </h3>

            {experience.is_published ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Published
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Draft
              </span>
            )}
          </div>

          <p className="text-xs text-purple-300 font-medium mt-0.5">
            {experience.company}
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            {experience.period}
          </p>
          {experience.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              {experience.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto justify-end">
        <button
          onClick={() => onTogglePublish(experience)}
          title={experience.is_published ? "Unpublish" : "Publish"}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            experience.is_published
              ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10"
              : "border-white/10 text-slate-400 bg-white/[0.02] hover:bg-white/[0.06]"
          }`}
        >
          {experience.is_published ? "Published" : "Set Published"}
        </button>

        <button
          onClick={() => onEdit(experience)}
          title="Edit Experience"
          className="p-2 rounded-xl border border-white/10 hover:border-purple-500/40 bg-white/[0.03] hover:bg-purple-600/20 text-slate-400 hover:text-purple-300 transition-all"
        >
          <Edit3 size={15} />
        </button>

        <button
          onClick={() => onDelete(experience.id)}
          title="Delete Experience"
          className="p-2 rounded-xl border border-white/10 hover:border-red-500/40 bg-white/[0.03] hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}