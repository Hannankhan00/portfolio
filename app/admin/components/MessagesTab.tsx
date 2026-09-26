"use client";

import { useState, useMemo } from "react";
import { Search, Loader2, Mail, MailOpen, Clock, Trash2, ArrowUpRight, CheckCircle2, Eye } from "lucide-react";
import { DbContactMessage } from "@/lib/db";

interface MessagesTabProps {
  messages: DbContactMessage[];
  loading: boolean;
  onViewMessage: (msg: DbContactMessage) => void;
  onToggleRead: (id: number, currentRead: boolean) => void;
  onDeleteMessage: (id: number) => void;
}

export default function MessagesTab({
  messages,
  loading,
  onViewMessage,
  onToggleRead,
  onDeleteMessage,
}: MessagesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const readCount = totalCount - unreadCount;

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !m.is_read) ||
        (filter === "read" && m.is_read);

      return matchesSearch && matchesFilter;
    });
  }, [messages, searchQuery, filter]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl border border-white/8 bg-[#0e0e15]/70">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by sender, email, subject, or content..."
            className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-white/8 pt-2 sm:pt-0 sm:pl-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === "unread"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === "read"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 size={28} className="animate-spin text-purple-500 mb-3" />
          <p className="text-sm">Loading contact messages from Neon Postgres...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/8 bg-[#0e0e15]/40 p-8">
          <Mail size={36} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-white">No messages found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No inquiries matching "${searchQuery}".`
              : "No contact messages received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const dateStr = msg.created_at
              ? new Date(msg.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently";

            return (
              <div
                key={msg.id}
                onClick={() => onViewMessage(msg)}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  msg.is_read
                    ? "bg-[#0e0e15]/50 border-white/6 hover:border-white/12 hover:bg-[#0e0e15]/80"
                    : "bg-[#0e0e15] border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.06)] hover:border-purple-500/50"
                }`}
              >
                {/* Left details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Status Indicator Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold font-display border ${
                      msg.is_read
                        ? "bg-white/5 border-white/8 text-slate-400"
                        : "bg-purple-500/15 border-purple-500/30 text-purple-300"
                    }`}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      )}
                      <h4 className="font-display text-sm font-bold text-white truncate">
                        {msg.name}
                      </h4>
                      <span className="text-xs text-slate-500 truncate">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>

                    {msg.subject && (
                      <p className="text-xs font-medium text-purple-300/90 mb-1 truncate">
                        {msg.subject}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right metadata & quick buttons */}
                <div
                  className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock size={11} />
                    {dateStr}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewMessage(msg)}
                      title="View details"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleRead(msg.id, msg.is_read)}
                      title={msg.is_read ? "Mark unread" : "Mark read"}
                      className={`p-2 rounded-xl border transition-colors ${
                        msg.is_read
                          ? "border-white/8 bg-white/4 text-slate-400 hover:text-white"
                          : "border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25"
                      }`}
                    >
                      {msg.is_read ? <MailOpen size={14} /> : <Mail size={14} />}
                    </button>

                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        msg.subject ? `Re: ${msg.subject}` : "Re: Your message via Hannan Khan Portfolio"
                      )}`}
                      title="Reply via email"
                      className="p-2 rounded-xl border border-white/8 bg-white/4 hover:bg-purple-500/20 hover:border-purple-500/30 text-slate-300 hover:text-purple-300 transition-colors"
                    >
                      <ArrowUpRight size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={() => onDeleteMessage(msg.id)}
                      title="Delete message"
                      className="p-2 rounded-xl border border-white/8 bg-white/4 hover:bg-rose-500/15 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
