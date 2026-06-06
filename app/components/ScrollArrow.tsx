"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ScrollArrow() {
  const svgRef  = useRef<SVGSVGElement>(null);
  // Upper chevron — two wings drawn from the apex outward
  const w1a = useRef<SVGPathElement>(null);
  const w1b = useRef<SVGPathElement>(null);
  // Lower chevron — same trick, slightly narrower for depth
  const w2a = useRef<SVGPathElement>(null);
  const w2b = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const l1a = w1a.current!.getTotalLength();
    const l1b = w1b.current!.getTotalLength();
    const l2a = w2a.current!.getTotalLength();
    const l2b = w2b.current!.getTotalLength();

    const upper = [w1a.current, w1b.current];
    const lower = [w2a.current, w2b.current];
    const all   = [...upper, ...lower];

    // Hidden + stroke-dash trick applied to all four wings
    gsap.set(svgRef.current, { autoAlpha: 0 });
    gsap.set(w1a.current, { strokeDasharray: l1a, strokeDashoffset: l1a });
    gsap.set(w1b.current, { strokeDasharray: l1b, strokeDashoffset: l1b });
    gsap.set(w2a.current, { strokeDasharray: l2a, strokeDashoffset: l2a });
    gsap.set(w2b.current, { strokeDasharray: l2b, strokeDashoffset: l2b });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    // 1 — appear
    tl.to(svgRef.current, { autoAlpha: 1, duration: 0.01 });

    // 2 — upper chevron wings radiate from apex simultaneously
    tl.to(upper, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, "+=0.3");

    // 3 — lower chevron wings radiate, overlapping so both feel like one motion
    tl.to(lower, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, "-=0.4");

    // 4 — flash bright (the "fill" equivalent for open paths)
    tl.to(all, { attr: { stroke: "#c084fc" }, strokeWidth: 2.5, duration: 0.18 });
    tl.to(all, { attr: { stroke: "#a855f7" }, strokeWidth: 1.5, duration: 0.5, ease: "power1.in" });

    // 5 — single bob downward to reinforce the "scroll" gesture
    tl.to(svgRef.current, { y: 10, duration: 0.35, ease: "power1.out" }, "+=0.1");
    tl.to(svgRef.current, { y: 0,  duration: 0.35, ease: "power1.in" });

    // 6 — float down and dissolve
    tl.to(svgRef.current, { y: 130, opacity: 0, duration: 1.4, ease: "power2.in" }, "+=0.45");

    // 7 — hard reset before next loop
    tl.set(svgRef.current, { y: 0, autoAlpha: 0 });
    tl.set(w1a.current, { strokeDashoffset: l1a });
    tl.set(w1b.current, { strokeDashoffset: l1b });
    tl.set(w2a.current, { strokeDashoffset: l2a });
    tl.set(w2b.current, { strokeDashoffset: l2b });
    tl.set(all, { attr: { stroke: "#a855f7" }, strokeWidth: 1.5 });
  });

  return (
    <svg
      ref={svgRef}
      width="52"
      height="42"
      viewBox="0 0 52 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // Centered at the bottom of the hero section
      className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10"
    >
      {/*
        Upper chevron — apex at (26, 24).
        Both wings draw FROM the apex outward toward the tips.
      */}
      <path ref={w1a} d="M 26 24 L 4 5"  stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path ref={w1b} d="M 26 24 L 48 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/*
        Lower chevron — apex at (26, 37), wings slightly narrower for depth.
        Draws after the upper chevron starts, creating a cascade effect.
      */}
      <path ref={w2a} d="M 26 37 L 8 21"  stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
      <path ref={w2b} d="M 26 37 L 44 21" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
    </svg>
  );
}
