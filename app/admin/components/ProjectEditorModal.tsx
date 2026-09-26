"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Check, Loader2, AlertCircle, ImageIcon, UploadCloud, Plus } from "lucide-react";
import { DbProject } from "@/lib/db";

const DEFAULT_PRESET_IMAGES = [
  { label: "SkillSpill Asset", path: "/assets/skillspill.png" },
  { label: "Compact Personnel Asset", path: "/assets/compactpersonnel.png" },
  { label: "GoTripJapan Asset", path: "/assets/gotripjapan.png" },
  { label: "4Atek Asset", path: "/assets/fouratek.png" },
];

const SUGGESTED_TECH = [
  "Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Node.js",
  "PostgreSQL", "Neon", "Prisma", "Python Flask", "Groq API",
  "Framer Motion", "GSAP", "Three.js", "MySQL", "JWT"
];

interface ProjectEditorModalProps {
  editingProject: DbProject | null;
  initialOrderIndex: number;
  onClose: () => void;
  onSaveSuccess: () => void;
  showToast: (msg: string) => void;
}

export default function ProjectEditorModal({
  editingProject,
  initialOrderIndex,
  onClose,
  onSaveSuccess,
  showToast,
}: ProjectEditorModalProps) {
  const [formTitle, setFormTitle] = useState(editingProject?.title || "");
  const [formSubtitle, setFormSubtitle] = useState(editingProject?.subtitle || "");
  const [formUrl, setFormUrl] = useState(editingProject?.url || "");
  const [formUrlLabel, setFormUrlLabel] = useState(editingProject?.urlLabel || "");
  const [formDescription, setFormDescription] = useState(editingProject?.description || "");
  const [formHighlights, setFormHighlights] = useState<string[]>(editingProject?.highlights || []);
  const [highlightInput, setHighlightInput] = useState("");
  const [formTech, setFormTech] = useState<string[]>(editingProject?.tech || []);
  const [techInput, setTechInput] = useState("");
  const [formImage, setFormImage] = useState(editingProject?.image || "");
  const [imageMode, setImageMode] = useState<"url" | "upload" | "presets">(
    editingProject?.image?.startsWith("/assets") ? "presets" : "url"
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formOrderIndex, setFormOrderIndex] = useState(editingProject?.order_index ?? initialOrderIndex);
  const [formIsPublished, setFormIsPublished] = useState(editingProject?.is_published ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setFormHighlights([...formHighlights, highlightInput.trim()]);
    setHighlightInput("");
  };

  const removeHighlight = (index: number) => {
    setFormHighlights(formHighlights.filter((_, i) => i !== index));
  };

  const addTechTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || formTech.includes(trimmed)) return;
    setFormTech([...formTech, trimmed]);
    setTechInput("");
  };

  const removeTechTag = (tag: string) => {
    setFormTech(formTech.filter((t) => t !== tag));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      setFormImage(data.url);
      showToast("Image uploaded successfully");
    } catch (err: any) {
      alert("Image upload error: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!formDescription.trim()) {
      setError("Project description is required.");
      return;
    }

    setSaving(true);
    setError(null);

    let resolvedLabel = formUrlLabel.trim();
    if (!resolvedLabel && formUrl.trim()) {
      try {
        const u = formUrl.trim().startsWith("http") ? formUrl.trim() : `https://${formUrl.trim()}`;
        resolvedLabel = new URL(u).hostname;
      } catch {
        resolvedLabel = formUrl.trim();
      }
    }

    const payload = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim(),
      url: formUrl.trim(),
      urlLabel: resolvedLabel,
      description: formDescription.trim(),
      highlights: formHighlights,
      tech: formTech,
      image: formImage.trim() || null,
      order_index: Number(formOrderIndex) || 0,
      is_published: formIsPublished,
    };

    try {
      let res: Response;
      if (editingProject) {
        res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save operation failed");
      }

      showToast(editingProject ? "Project updated successfully" : "Project created successfully");
      onSaveSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl my-auto rounded-3xl border border-white/10 bg-[#0d0d15] shadow-[0_10px_50px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/8 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-display font-bold text-white">
              {editingProject ? "Edit Project Entry" : "Create New Project"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live database record synced with your portfolio.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. SkillSpill"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="e.g. AI-powered career & skill marketplace"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* URL & Display Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                Live URL
              </label>
              <input
                type="text"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
                URL Display Label
              </label>
              <input
                type="text"
                value={formUrlLabel}
                onChange={(e) => setFormUrlLabel(e.target.value)}
                placeholder="example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/8 bg-white/[0.02] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <ImageIcon size={15} className="text-purple-400" />
                <span>Project Image (Cloudflare R2 / Storage Ready)</span>
              </label>

              <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    imageMode === "url" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Direct URL / R2
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    imageMode === "upload" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("presets")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    imageMode === "presets" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Portfolio Presets
                </button>
              </div>
            </div>

            {imageMode === "url" && (
              <div>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://your-r2-bucket.domain.com/preview.png or /assets/project.png"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Cloudflare R2 ready: Paste your public R2 URL or any HTTPS image link.
                </p>
              </div>
            )}

            {imageMode === "upload" && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-6 text-center cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03]"
                >
                  <UploadCloud size={28} className="mx-auto text-purple-400 mb-2" />
                  <p className="text-xs font-medium text-slate-300">
                    {uploadingImage ? "Uploading to storage..." : "Click to browse and upload image file"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    PNG, JPG, WEBP, or SVG up to 10MB
                  </p>
                </div>
              </div>
            )}

            {imageMode === "presets" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEFAULT_PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setFormImage(preset.path)}
                    className={`p-2 rounded-xl border text-left transition-all text-xs ${
                      formImage === preset.path
                        ? "border-purple-500 bg-purple-500/10 text-purple-200"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="block font-medium truncate">{preset.label}</span>
                    <span className="block text-[10px] text-slate-500 font-mono truncate">{preset.path}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Preview Box */}
            {formImage && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <Image
                  src={formImage}
                  alt="Project Preview"
                  fill
                  sizes="600px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormImage("")}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-slate-300 hover:text-white"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Provide an in-depth summary of the project architecture, features, and accomplishments..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-sm outline-none transition-all placeholder:text-slate-600 leading-relaxed"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5 flex items-center justify-between">
              <span>Project Highlights (Bullet Points)</span>
              <span className="text-[11px] text-slate-500 font-normal">{formHighlights.length} added</span>
            </label>

            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                placeholder="e.g. Semantic NLP matching with all-MiniLM-L6-v2 — 50% of final score"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-xs outline-none"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>

            {formHighlights.length > 0 && (
              <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {formHighlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-300"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(i)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1.5 flex items-center justify-between">
              <span>Technologies & Frameworks</span>
              <span className="text-[11px] text-slate-500 font-normal">{formTech.length} tags</span>
            </label>

            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTechTag(techInput);
                  }
                }}
                placeholder="Type technology name and press Enter..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 text-white text-xs outline-none"
              />
              <button
                type="button"
                onClick={() => addTechTag(techInput)}
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[10px] text-slate-500 mr-1 self-center">Suggestions:</span>
              {SUGGESTED_TECH.filter((t) => !formTech.includes(t)).slice(0, 8).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => addTechTag(st)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.02] hover:bg-purple-500/20 hover:text-purple-300 border border-white/5 text-slate-400 transition-colors"
                >
                  + {st}
                </button>
              ))}
            </div>

            {formTech.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                {formTech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTechTag(t)}
                      className="hover:text-red-400 text-purple-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Order index & Published status */}
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
              <p className="text-[11px] text-slate-500 mt-1">Lower numbers appear first on the site.</p>
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
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{editingProject ? "Update Project" : "Create Project"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
