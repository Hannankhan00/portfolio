"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop screens (md+)
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    let isHovered = false;
    let isPressed = false;
    let isText = false;

    const updateState = () => {
      let scale = 1;
      let opacity = 1;

      if (isText) {
        opacity = 0;
      } else if (isPressed) {
        scale = 0.7;
      } else if (isHovered) {
        scale = 2.8;
      }

      inner.style.transform = `scale(${scale})`;
      inner.style.opacity = opacity.toString();
    };

    const onMouseMove = (e: MouseEvent) => {
      // Don't render custom cursor on admin routes
      if (
        document.body.classList.contains("admin-root") ||
        document.querySelector(".admin-root") ||
        window.location.pathname.startsWith("/admin")
      ) {
        cursor.style.opacity = "0";
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      if (!visible) {
        setVisible(true);
        cursor.style.opacity = "1";
      }

      // Zero-lag instant position tracking
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Detect interactive element under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer, [data-cursor-hover]'
        );
        const textInput = target.closest(
          'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]), textarea'
        );

        const newHovered = !!interactive;
        const newText = !!textInput;

        if (newHovered !== isHovered || newText !== isText) {
          isHovered = newHovered;
          isText = newText;
          updateState();
        }
      }
    };

    const onMouseDown = () => {
      isPressed = true;
      updateState();
    };

    const onMouseUp = () => {
      isPressed = false;
      updateState();
    };

    const onMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    const onMouseEnter = () => {
      cursor.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [visible]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block opacity-0"
      style={{
        willChange: "transform",
        mixBlendMode: "difference",
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Single unified cursor element with smooth scaling & subtle purple aura */}
      <div
        ref={innerRef}
        style={{
          width: "12px",
          height: "12px",
          marginLeft: "-6px",
          marginTop: "-6px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: "0 0 14px rgba(168, 85, 247, 0.45)",
          willChange: "transform",
          transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
        }}
      />
    </div>
  );
}
