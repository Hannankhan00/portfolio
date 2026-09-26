"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let tx = -200, ty = -200;
    let lastX = -200, lastY = -200;
    let scale = 1;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };

    const onLeave = () => { el.style.opacity = "0"; };
    const onEnter = () => { el.style.opacity = "1"; };

    const tick = () => {
      const dx = tx - lastX;
      const dy = ty - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Scale grows with velocity, lerps smoothly back to 1
      const targetScale = 1 + Math.min(speed * 0.1, 2);
      scale += (targetScale - scale) * 0.1;

      // tip is at (5.5, 3.21) inside the SVG, offset translate to place it at the mouse
      el.style.transform = `translate(${tx - 5.5}px, ${ty - 3.21}px) scale(${scale})`;
      lastX = tx;
      lastY = ty;
      raf = requestAnimationFrame(tick);
    };

    el.style.opacity = "0";
    tick();

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-9999 hidden md:block"
      style={{
        willChange: "transform",
        mixBlendMode: "difference",
        transformOrigin: "5.5px 3.21px",
      }}
    >
      {/* Exact cursor shape from user's CSS — tip at (5.5, 3.21) in viewBox */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" />
      </svg>
    </div>
  );
}
