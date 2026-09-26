"use client";

import { useState } from "react";
import { X, Check, Loader2, AlertCircle, Briefcase } from "lucide-react";
import { DbExperience } from "@/lib/db";

interface ExperienceEditorModalProps {
  editingExperience: DbExperience | null;
  initialOrderIndex: number;
  onClose: () => void;
  onSaveSuccess: () => void;
  showToast: (msg: string) => void;
}

export default function ExperienceEditorModal({
  editingExperience,
  initialOrderIndex,
  onClose,
  onSaveSuccess,
  showToast,
}: ExperienceEditorModalProps) {
  const [formCompany, setFormCompany] = useState(editingExperience?.company || "");
  const [formRole, setFormRole] = useState(editingExperience?.role || "");
  const [formPeriod, setFormPeriod] = useState(editingExperience?.period || "");
  const [formDescription, setFormDescription] = useState(editingExperience?.description || "");
  const [formOrderIndex, setFormOrderIndex] = useState(editingExperience?.order_index ?? initialOrderIndex);
  const [formIsPublished, setFormIsPublished] = useState(editingExperience?.is_published ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim()) {
      setError("Company name is required.");
      return;
    }
    if (!formRole.trim()) {
      setError("Job role/title is required.");
      return;
    }
    if (!formPeriod.trim()) {
      setError("Time period is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      company: formCompany.trim(),
      role: formRole.trim(),
      period: formPeriod.trim(),
      description: formDescription.trim() || null,
      order_index: Number(formOrderIndex) || 0,
      is_published: formIsPublished,
    };

    try {
      let res: Response;
      if (editingExperience) {
        res = await fetch(`/api/experiences/${editingExperience.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save operation failed");
      }

      showToast(editingExperience ? "Experience updated successfully" : "Experience created successfully");
      onSaveSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save experience.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl my-auto rounded-3xl border border-white/10 bg-[#0d0d15] shadow-[0_10px_50px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Briefcase size={18} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                {editingExperience ? "Edit Career Experience" : "Add Career Experience"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved directly to Neon PostgreSQL database.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. RapidTech Pro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
              Duration / Time Period *
            </label>
            <input
              type="text"
              required
              value={formPeriod}
              onChange={(e) => setFormPeriod(e.target.value)}
              placeholder="e.g. Jun 2024 – Present or May 2023 – Jun 2024"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
              Description / Role Summary (Optional)
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Key responsibilities, architectural contributions, or technologies used..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600 leading-relaxed"
            />
          </div>

          {/* Order & Publish status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                Display Order Index
              </label>
              <input
                type="number"
                value={formOrderIndex}
                onChange={(e) => setFormOrderIndex(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">Lower numbers appear first.</p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-6">
              <div>
                <span className="block text-xs font-semibold text-slate-300 uppercase">
                  Published Status
                </span>
                <span className="text-[11px] text-slate-500">Visible on public portfolio</span>
              </div>
              <input
                type="checkbox"
                checked={formIsPublished}
                onChange={(e) => setFormIsPublished(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/[0.05] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-400/30 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{editingExperience ? "Update Experience" : "Add Experience"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}