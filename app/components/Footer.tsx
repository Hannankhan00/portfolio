"use client";
import { useRef } from "react";
import { Mail, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".footer-el", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  return (
    <footer
      ref={containerRef}
      id="contact"
      className="relative z-10 pt-28 pb-10 px-10 sm:px-16 lg:px-28 xl:px-36 overflow-hidden"
    >
      {/* Top glow line */}
      <div className="footer-el absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-6xl mx-auto">

        {/* Availability badge */}
        <div className="footer-el flex items-center gap-2 mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-slate-400 text-xs font-medium tracking-[0.22em] uppercase">
            Available for new projects
          </span>
        </div>

        {/* CTA heading */}
        <p className="footer-el text-slate-500 text-sm sm:text-base font-medium mb-4">
          Have a project in mind?
        </p>

        {/* Email — hero element */}
        <a
          href="mailto:8hannankhan00@gmail.com"
          className="footer-el group inline-flex items-end gap-4 mb-20"
        >
          <span className="font-display font-bold text-white leading-none
            text-[2.2rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[6rem]
            bg-clip-text transition-all duration-500
            group-hover:text-transparent group-hover:bg-gradient-to-r
            group-hover:from-accent group-hover:via-purple-300 group-hover:to-accent">
            8hannankhan00@gmail.com
          </span>
          <ArrowUpRight
            className="text-slate-700 group-hover:text-accent transition-all duration-300
              group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 mb-2"
            size={28}
          />
        </a>

        {/* Divider */}
        <div className="footer-el w-full h-px bg-white/6 mb-8" />

        {/* Bottom strip */}
        <div className="footer-el flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Logo */}
          <span className="font-display text-lg font-bold tracking-[0.25em] text-accent">
            HK
          </span>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Hannankhan00"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
            >
              <GithubIcon />
              GitHub
            </a>
            <span className="w-px h-3 bg-white/10" />
            <a
              href="mailto:8hannankhan00@gmail.com"
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
            >
              <Mail size={14} />
              Email
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
