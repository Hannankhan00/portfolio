"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Asterisk, X, Send, Check, AlertCircle, Loader2 } from "lucide-react";

export function openContactModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  }
}

interface ContactModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ContactModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: ContactModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onClose = controlledOnClose || (() => setInternalIsOpen(false));

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setInternalIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpen);
    return () => window.removeEventListener("open-contact-modal", handleOpen);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSuccess(false);
      setError(null);
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { y: 44, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.04 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panel, { y: 24, opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        delay: 0.08,
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      style={{ display: "none" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === overlayRef.current && !loading) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Card */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-[#0e0e14] shadow-[0_0_80px_rgba(168,85,247,0.14)] overflow-hidden"
      >
        {/* Top subtle glow strip */}
        <div className="h-1 w-full bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-80" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute top-5 right-5 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <X size={15} />
        </button>

        <div className="p-6 sm:p-9">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Asterisk size={15} strokeWidth={2.5} className="text-purple-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-purple-400 font-semibold">
              Let&apos;s Connect
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            Send a Message
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            Have a project in mind, a freelance inquiry, or just want to discuss an idea? Send a message and I&apos;ll get back to you promptly.
          </p>

          {/* Success View */}
          {success ? (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 animate-in fade-in zoom-in duration-300">
                <Check size={28} />
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                Message Delivered
              </h4>
              <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                Thank you for reaching out. Your message has been received and stored securely. I will review it and reply as soon as possible.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-300 text-xs sm:text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                    Your Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Hannan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-slate-600 text-sm outline-hidden transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                    Email Address <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-slate-600 text-sm outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                  Subject / Project Scope
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Full-Stack Web Development, Freelance Consultation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-slate-600 text-sm outline-hidden transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                  Your Message <span className="text-purple-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project, timeline, budget, or any questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-slate-600 text-sm outline-hidden transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_25px_rgba(168,85,247,0.35)] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
