"use client";

import { useState, useMemo } from "react";
import { Search, Loader2, Briefcase } from "lucide-react";
import { DbExperience } from "@/lib/db";
import ExperienceRow from "./ExperienceRow";

interface ExperiencesTabProps {
  experiences: DbExperience[];
  loading: boolean;
  onMoveOrder: (exp: DbExperience, direction: "up" | "down") => void;
  onTogglePublish: (exp: DbExperience) => void;
  onEdit: (exp: DbExperience) => void;
  onDelete: (id: number) => void;
}

export default function ExperiencesTab({
  experiences,
  loading,
  onMoveOrder,
  onTogglePublish,
  onEdit,
  onDelete,
}: ExperiencesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const totalCount = experiences.length;
  const publishedCount = experiences.filter((e) => e.is_published).length;

  const filtered = useMemo(() => {
    return experiences.filter((e) => {
      const matchesSearch =
        e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && e.is_published) ||
        (statusFilter === "draft" && !e.is_published);

      return matchesSearch && matchesStatus;
    });
  }, [experiences, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl border border-white/8 bg-[#0e0e15]/70">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experience by company, role, or period..."
            className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-white/8 pt-2 sm:pt-0 sm:pl-3">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === "all"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === "published"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === "draft"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Drafts ({totalCount - publishedCount})
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 size={28} className="animate-spin text-purple-500 mb-3" />
          <p className="text-sm">Loading experiences from Neon Postgres...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/8 bg-[#0e0e15]/40 p-8">
          <Briefcase size={36} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-white">No experiences found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No experiences matching "${searchQuery}".`
              : "No career experience entries found. Click 'Add Career Experience' to create one."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((exp, idx) => (
            <ExperienceRow
              key={exp.id}
              experience={exp}
              idx={idx}
              totalLength={filtered.length}
              onMoveOrder={onMoveOrder}
              onTogglePublish={onTogglePublish}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}