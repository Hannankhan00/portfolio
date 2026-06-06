"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  parallax: number;     // 0.2–1.0  →  depth: low = far/slow, high = near/fast
  twinkle: number;      // current phase
  twinkleSpeed: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x:            Math.random() * window.innerWidth,
      y:            Math.random() * window.innerHeight,
      size:         Math.random() * 1.4 + 0.2,
      opacity:      Math.random() * 0.5 + 0.15,
      parallax:     Math.random() * 0.8 + 0.2,
      twinkle:      Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.003,
    }));

    // Smooth scroll velocity — computed every rAF frame directly from scrollY
    let smoothVelocity = 0;
    let prevScrollY    = window.scrollY;

    let animId: number;

    const draw = () => {
      // Raw delta this frame
      const currentScrollY = window.scrollY;
      const rawDelta        = currentScrollY - prevScrollY;
      prevScrollY           = currentScrollY;

      // Exponential smoothing: eases to 0 within ~0.3s after scrolling stops
      smoothVelocity = smoothVelocity * 0.82 + rawDelta * 0.18;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // Twinkle: gentle opacity oscillation only — stars don't drift
        s.twinkle += s.twinkleSpeed;
        const opacity = Math.max(0.05, s.opacity + Math.sin(s.twinkle) * 0.07);

        // Scroll-driven movement:
        //   scroll down (velocity > 0) → y decreases → stars move UP
        //   scroll up   (velocity < 0) → y increases → stars move DOWN
        s.y -= smoothVelocity * s.parallax;

        // Wrap so stars never permanently leave the canvas
        if (s.y < -20)                  s.y += canvas.height + 40;
        if (s.y > canvas.height + 20)   s.y -= canvas.height + 40;

        // Trail — behind the direction of travel, gradient to transparent
        const trailLength = smoothVelocity * s.parallax * 4;

        if (Math.abs(trailLength) > 1) {
          const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + trailLength);
          grad.addColorStop(0, `rgba(255,255,255,${opacity})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x, s.y + trailLength);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = s.size;
          ctx.stroke();
        }

        // Star dot (drawn on top of the trail)
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
