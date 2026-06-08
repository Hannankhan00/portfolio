"use client";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".footer-el", {
      y: 36,
      opacity: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  return (
    <footer
      ref={containerRef}
      id="contact"
      className="relative z-10 overflow-hidden pt-24 pb-10 px-10 sm:px-16 lg:px-28 xl:px-36"
    >
      {/* Glow line */}
      <div className="footer-el absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-6xl mx-auto">

        {/* Availability badge */}
        <div className="footer-el flex items-center gap-2 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-slate-400 text-xs font-medium tracking-[0.22em] uppercase">
            Available for new projects
          </span>
        </div>

        {/* Small CTA label */}
        <p className="footer-el text-slate-500 text-sm tracking-wide mb-4">
          Have a project in mind?
        </p>

        {/* Email — hero */}
        <a
          href="mailto:8hannankhan00@gmail.com"
          className="footer-el group inline-flex items-end gap-4 mb-20"
        >
          <span className="font-display font-bold text-white leading-none
            text-[1.9rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.4rem]
            transition-all duration-500 group-hover:text-transparent
            group-hover:bg-clip-text group-hover:bg-gradient-to-r
            group-hover:from-accent group-hover:via-purple-300 group-hover:to-accent">
            8hannankhan00@gmail.com
          </span>
          <span className="mb-1 sm:mb-2 flex items-center justify-center w-9 h-9 rounded-full
            border border-white/10 bg-white/5
            group-hover:bg-accent/15 group-hover:border-accent/40
            transition-all duration-300 shrink-0">
            <ArrowUpRight size={15} className="text-slate-500 group-hover:text-accent
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5
              transition-all duration-300" />
          </span>
        </a>

        {/* Divider */}
        <div className="footer-el w-full h-px bg-white/6 mb-8" />

        {/* Bottom strip */}
        <div className="footer-el flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Cursive name */}
          <span
            className="text-accent text-2xl sm:text-[1.7rem]"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            Hannan Khan
          </span>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Hannankhan00"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white
                border border-white/8 hover:border-white/20 bg-white/4 hover:bg-white/8
                px-4 py-2 rounded-full text-sm transition-all duration-200"
            >
              <GithubIcon />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/hannankhan00"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white
                border border-white/8 hover:border-white/20 bg-white/4 hover:bg-white/8
                px-4 py-2 rounded-full text-sm transition-all duration-200"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <p className="text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} Hannan Khan
          </p>

        </div>
      </div>
    </footer>
  );
}
