"use client";

import { DbContactMessage } from "@/lib/db";
import { X, Mail, CheckCircle2, Clock, Trash2, ArrowUpRight } from "lucide-react";

interface MessageDetailModalProps {
  message: DbContactMessage | null;
  onClose: () => void;
  onToggleRead: (id: number, currentRead: boolean) => void;
  onDelete: (id: number) => void;
}

export default function MessageDetailModal({
  message,
  onClose,
  onToggleRead,
  onDelete,
}: MessageDetailModalProps) {
  if (!message) return null;

  const dateStr = message.created_at
    ? new Date(message.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e0e14] shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden">
        {/* Top Glow Accent */}
        <div className="h-1 w-full bg-linear-to-r from-transparent via-purple-500 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X size={15} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold font-display text-lg">
                {message.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {message.name}
                </h3>
                <a
                  href={`mailto:${message.email}`}
                  className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                >
                  {message.email}
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${
                  message.is_read
                    ? "bg-slate-800/60 text-slate-400 border-white/8"
                    : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                }`}
              >
                {message.is_read ? "Read" : "Unread"}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={12} />
                {dateStr}
              </span>
            </div>
          </div>

          {/* Subject */}
          {message.subject && (
            <div className="mb-4 pb-3 border-b border-white/6">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Subject
              </div>
              <div className="text-sm font-medium text-white">
                {message.subject}
              </div>
            </div>
          )}

          {/* Message Body */}
          <div className="mb-8">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Message Content
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {message.message}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/6">
            <button
              onClick={() => onDelete(message.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-300 text-xs font-medium transition-colors"
            >
              <Trash2 size={13} />
              Delete Message
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onToggleRead(message.id, message.is_read)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                <CheckCircle2 size={13} className={message.is_read ? "text-purple-400" : "text-slate-500"} />
                {message.is_read ? "Mark Unread" : "Mark as Read"}
              </button>

              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(
                  message.subject ? `Re: ${message.subject}` : "Re: Your message via Hannan Khan Portfolio"
                )}`}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <Mail size={13} />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
