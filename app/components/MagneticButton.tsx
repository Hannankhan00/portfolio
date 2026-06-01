"use client";
import { useRef, useEffect } from "react";

interface Props {
  href: string;
}

export default function MagneticButton({ href }: Props) {
  const btnRef  = useRef<HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const glowRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn   = btnRef.current;
    const inner = innerRef.current;
    const glow  = glowRef.current;
    if (!btn || !inner || !glow) return;

    let rafId: number;
    let cx = 0, cy = 0;   // current (lerped) position
    let tx = 0, ty = 0;   // target position
    let glowX = 50, glowY = 50; // spotlight position %
    let active = false;

    const RADIUS         = 110;  // px — magnetic pull radius
    const OUTER_STRENGTH = 0.42; // how much the button moves
    const INNER_EXTRA    = 0.3;  // extra parallax on the text
    const LERP           = 0.1;  // smoothing (lower = smoother but slower)

    const onMove = (e: MouseEvent) => {
      const r  = btn.getBoundingClientRect();
      const bx = r.left + r.width  / 2;
      const by = r.top  + r.height / 2;
      const dx = e.clientX - bx;
      const dy = e.clientY - by;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = 1 - dist / RADIUS;
        tx = dx * OUTER_STRENGTH * pull;
        ty = dy * OUTER_STRENGTH * pull;

        // spotlight position inside button
        glowX = ((e.clientX - r.left) / r.width)  * 100;
        glowY = ((e.clientY - r.top)  / r.height) * 100;

        if (!active) {
          active = true;
          btn.classList.add("mag-active");
        }
      } else {
        tx = 0; ty = 0;
        if (active) {
          active = false;
          btn.classList.remove("mag-active");
        }
      }
    };

    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;

      btn.style.transform   = `translate3d(${cx}px, ${cy}px, 0)`;
      inner.style.transform = `translate3d(${cx * INNER_EXTRA}px, ${cy * INNER_EXTRA}px, 0)`;

      // update spotlight gradient
      glow.style.background = `radial-gradient(circle 90px at ${glowX}% ${glowY}%, rgba(168,85,247,0.35), transparent 70%)`;
      glow.style.opacity    = active ? "1" : "0";

      rafId = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full border border-accent/25 text-white text-sm font-bold tracking-[0.12em] uppercase overflow-hidden transition-[border-color,box-shadow] duration-300 mag-active:border-accent/60"
      style={{ willChange: "transform", background: "rgba(168,85,247,0.06)" }}
    >
      {/* Spotlight glow layer */}
      <span
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0 }}
      />

      {/* Text + icon — moves slightly more than the outer shell */}
      <span
        ref={innerRef}
        className="relative z-10 flex items-center gap-3"
        style={{ willChange: "transform" }}
      >
        Let&apos;s Talk

        {/* Arrow circle */}
        <span className="w-7 h-7 rounded-full border border-accent/40 flex items-center justify-center text-accent transition-all duration-300 group-[.mag-active]:bg-accent group-[.mag-active]:border-accent group-[.mag-active]:text-white">
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5v6" />
          </svg>
        </span>
      </span>

      {/* Outer glow ring when active */}
      <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-[.mag-active]:opacity-100 pointer-events-none"
        style={{ boxShadow: "0 0 40px rgba(168,85,247,0.22)" }}
      />
    </a>
  );
}
