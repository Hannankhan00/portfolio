"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "./MagneticButton";
import ScrollArrow from "./ScrollArrow";
import dynamic from "next/dynamic";

// Lanyard uses WebGL — load client-side only (no SSR)
const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 70%",
        end: "bottom 10%",
        scrub: 1,
      },
    });
    tl.to(".hero-el", { y: -150, opacity: 0, stagger: 0.02 });
  }, { scope: containerRef });

  return (
    /*
     * position: relative so Lanyard (position:absolute) anchors here.
     * The lanyard scrolls away with this section — not fixed to viewport.
     */
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center z-10"
    >
      <ScrollArrow />

      {/* Lanyard — covers the full hero so the card can be dragged anywhere
           without hitting a CSS clip boundary. The canvas is transparent, so
           the left text area is unaffected visually. Pointer events still
           reach the text buttons because the text content div (max-w-xl) is
           at z-10, above this container's z-4, and has pointer-events:auto. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "auto",
        }}
      >
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
          fov={20}
          transparent={true}
          frontImage="/assets/profile.png"
          imageFit="cover"
        />
      </div>

      {/* Hero text — pointer-events:none on the full-width wrapper so the
           transparent right half doesn't block lanyard drag events (the canvas
           is at z-index 4, this wrapper is z-10 and spans 100% width).
           pointer-events:auto is restored on the inner content div so the
           button/text remain fully interactive. */}
      <div className="relative z-10 w-full px-10 sm:px-16 lg:px-28 xl:px-36 py-28" style={{ pointerEvents: "none" }}>
        <div className="max-w-xl" style={{ pointerEvents: "auto" }}>

          <p className="text-accent text-sm tracking-[0.25em] uppercase font-medium hero-el hero-el-1">
            Full Stack Developer
          </p>

          <h1 className="font-display font-bold uppercase leading-[0.9] tracking-tight text-[clamp(2.8rem,7vw,5.5rem)] mt-3 hero-el hero-el-2">
            <span className="text-accent">Hannan</span>
            <br />
            <span className="text-white">Khan</span>
          </h1>

          <p className="text-slate-400 sm:text-lg mt-4 mb-10 max-w-[38ch] leading-relaxed hero-el hero-el-3">
            Building performant, scalable web applications from polished
            frontends to robust backends.
          </p>

          <div className="flex flex-col items-start gap-4 hero-el hero-el-4">
            <MagneticButton href="mailto:8hannankhan00@gmail.com" />

            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-slate-400 text-sm">
                Available for new projects
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
