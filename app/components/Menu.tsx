"use client";
import { useState } from "react";

const links = [
  { label: "About",      href: "#about",      num: "01" },
  { label: "Skills",     href: "#skills",     num: "02" },
  { label: "Experience", href: "#experience", num: "03" },
  { label: "Projects",   href: "#projects",   num: "04" },
  { label: "Contact",    href: "#contact",    num: "05" },
];

export default function Menu() {
  const [open, setOpen]       = useState(false);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  };

  const toggle = () => (open ? close() : setOpen(true));

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">

      {/* ── Circle hamburger button ── */}
      <button
        onClick={toggle}
        aria-label="Toggle navigation"
        className="w-12 h-12 rounded-full border border-white/15 backdrop-blur-sm flex items-center justify-center hover:border-accent/50 transition-all duration-300 group"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex flex-col gap-1.25 items-end">
          <span
            className="block h-[1.5px] bg-slate-300 group-hover:bg-accent transition-all duration-300"
            style={{ width: open ? 16 : 16, transform: open ? "rotate(45deg) translate(4px, 5px)" : "none" }}
          />
          <span
            className="block h-[1.5px] bg-slate-300 group-hover:bg-accent transition-all duration-300"
            style={{ width: open ? 0 : 11, opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[1.5px] bg-slate-300 group-hover:bg-accent transition-all duration-300"
            style={{ width: open ? 16 : 16, transform: open ? "rotate(-45deg) translate(4px, -5px)" : "none" }}
          />
        </div>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className={`absolute top-15 w-60 rounded-2xl border border-white/10 shadow-2xl shadow-black/70 overflow-hidden ${closing ? "menu-pop-out" : "menu-pop-in"}`}
          style={{ background: "rgba(14,14,22,0.97)", backdropFilter: "blur(20px)" }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            {/* 2×2 accent dots */}
            <div className="grid grid-cols-2 gap-0.75">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-xs bg-accent/60" />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={close}
              className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l7 7M8 1l-7 7" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="py-1">
            {links.map(({ label, href, num }, i) => (
              <a
                key={label}
                href={href}
                onClick={close}
                className="flex items-center justify-between px-5 py-3.5 border-b border-white/4 last:border-0 group transition-colors duration-150 hover:bg-white/4"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors duration-150">
                  {label}
                </span>
                <span className="text-[10px] text-slate-600 font-mono">{num}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
