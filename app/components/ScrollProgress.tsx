"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed right-0 top-0 h-screen w-[3px] z-50 bg-white/[0.04]">
      <div
        className="w-full rounded-full"
        style={{
          height: `${progress}%`,
          background: "linear-gradient(to bottom, #7c3aed, #a855f7, #ec4899)",
        }}
      />
    </div>
  );
}
