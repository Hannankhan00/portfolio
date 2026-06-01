"use client";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { top, bottom } = el.getBoundingClientRect();
      const vh = window.innerHeight;

      if (bottom < 0) {
        // Fully above viewport — slide out upward
        if (timer.current) clearTimeout(timer.current);
        el.classList.remove("revealed");
        el.classList.add("exit-up");
      } else if (top > vh) {
        // Fully below viewport — snap back to ready state instantly (no transition)
        if (timer.current) clearTimeout(timer.current);
        el.classList.add("no-transition");
        el.classList.remove("revealed", "exit-up");
        requestAnimationFrame(() => el.classList.remove("no-transition"));
      } else {
        // In viewport — reveal
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          el.classList.add("revealed");
          el.classList.remove("exit-up");
        }, delay);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
