"use client";

import { useRef, useEffect } from "react";

// ─── Constants (from reference HTML) ─────────────────────────────────────────
const NUM_SEG = 18;
const SEG_LEN = 24;
const CW = 230;  // card width  (bigger)
const CH = 320;  // card height (bigger)
const GRAV = 0.45;
const DAMP = 0.986;
const ITER = 30;

// How many px from the RIGHT edge the anchor pin sits
const ANCHOR_FROM_RIGHT = 450;

interface RopeNode {
  x: number; y: number;
  px: number; py: number;
  pinned: boolean;
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function HangingCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // The parent IS the hero <section> — we attach events there
    // so the canvas never eats clicks on hero buttons.
    const heroEl = wrap.parentElement as HTMLElement;

    const ctx = canvas.getContext("2d")!;

    // ── Sizing ────────────────────────────────────────────────────────────────
    function fitCanvas() {
      canvas!.width = wrap!.offsetWidth;
      canvas!.height = wrap!.offsetHeight;
    }
    fitCanvas();

    const anchorX = () => canvas!.width - ANCHOR_FROM_RIGHT;
    const anchorY = 0;

    // ── Rope state ────────────────────────────────────────────────────────────
    let nodes: RopeNode[] = [];

    function initRope() {
      nodes = [];
      const ax = anchorX();
      for (let i = 0; i <= NUM_SEG; i++) {
        nodes.push({
          x: ax, y: i * SEG_LEN,
          px: ax + (i ? 0.01 : 0), py: i * SEG_LEN - 0.5,
          pinned: i === 0,
        });
      }
    }
    initRope();

    // ── Verlet physics ────────────────────────────────────────────────────────
    function verlet() {
      for (const n of nodes) {
        if (n.pinned) continue;
        const vx = (n.x - n.px) * DAMP;
        const vy = (n.y - n.py) * DAMP;
        n.px = n.x; n.py = n.y;
        n.x += vx; n.y += vy + GRAV;
      }
    }

    function constrain() {
      for (let it = 0; it < ITER; it++) {
        nodes[0].x = anchorX(); nodes[0].y = anchorY;
        for (let i = 0; i < nodes.length - 1; i++) {
          const a = nodes[i], b = nodes[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const diff = (d - SEG_LEN) / d * 0.5;
          const cx = dx * diff, cy = dy * diff;
          if (!a.pinned) { a.x += cx; a.y += cy; }
          if (!b.pinned) { b.x -= cx; b.y -= cy; }
        }
      }
    }

    // ── Card hit-test (rotated bounding box) ─────────────────────────────────
    function isOnCard(mx: number, my: number): boolean {
      const tip = nodes[nodes.length - 1];
      const prev = nodes[nodes.length - 2];
      if (!tip || !prev) return false;
      const dx = tip.x - prev.x, dy = tip.y - prev.y;
      const angle = Math.atan2(dy, dx) - Math.PI / 2;
      // Transform into card local space (origin at tip)
      const relX = mx - tip.x, relY = my - tip.y;
      const cos = Math.cos(-angle), sin = Math.sin(-angle);
      const lx = relX * cos - relY * sin;
      const ly = relX * sin + relY * cos;
      const pad = 14;
      return lx >= -CW / 2 - pad && lx <= CW / 2 + pad &&
        ly >= -pad && ly <= CH + pad;
    }

    // ── Helper: pointer position in canvas coords ─────────────────────────────
    function getXY(e: MouseEvent | TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const sx = canvas!.width / rect.width;
      const sy = canvas!.height / rect.height;
      const src = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);
      return {
        x: (src.clientX - rect.left) * sx,
        y: (src.clientY - rect.top) * sy,
      };
    }

    // ── Nearest rope node (for drag attachment point) ─────────────────────────
    function nearest(mx: number, my: number): RopeNode | null {
      let best: RopeNode | null = null, bd = 9999;
      for (const n of nodes) {
        if (n.pinned) continue;
        const d = Math.hypot(n.x - mx, n.y - my);
        if (d < bd) { bd = d; best = n; }
      }
      return bd < CW + 30 ? best : null; // wide radius = anywhere on card
    }

    // ── Drag state ────────────────────────────────────────────────────────────
    let dragging = false;
    let dragNode: RopeNode | null = null;
    let velX = 0, velY = 0, lastMX = 0, lastMY = 0;

    // ── Document-level move/up so drags never lose tracking ─────────────────
    function onDocMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      const { x, y } = getXY(e);
      velX = x - lastMX; velY = y - lastMY;
      if (dragNode) {
        dragNode.x = x; dragNode.y = y;
        dragNode.px = x - velX * 0.55;
        dragNode.py = y - velY * 0.55;
      }
      lastMX = x; lastMY = y;
      // Update cursor on hero during drag
      heroEl.style.cursor = "grabbing";
    }

    function onDocUp() {
      if (!dragging) return;
      if (dragNode) {
        dragNode.px = dragNode.x - velX * 3.5;
        dragNode.py = dragNode.y - velY * 3.5;
      }
      dragging = false; dragNode = null;
      heroEl.style.cursor = "";
    }

    // mousedown on the hero section — only start drag if on card
    function onHeroDown(e: MouseEvent | TouchEvent) {
      const { x, y } = getXY(e);
      if (!isOnCard(x, y)) return;  // not on card → let event bubble normally
      e.preventDefault();
      dragNode = nearest(x, y) || nodes[nodes.length - 1];
      dragging = true;
      lastMX = x; lastMY = y; velX = velY = 0;
      heroEl.style.cursor = "grabbing";
    }

    // Hover cursor — show 'grab' over card
    function onHeroHover(e: MouseEvent | TouchEvent) {
      if (dragging) return;
      const { x, y } = getXY(e);
      heroEl.style.cursor = isOnCard(x, y) ? "grab" : "";
    }

    // Attach: mousedown + hover on hero, move+up always on document
    heroEl.addEventListener("mousedown", onHeroDown as EventListener);
    heroEl.addEventListener("mousemove", onHeroHover as EventListener);
    heroEl.addEventListener("touchstart", onHeroDown as EventListener, { passive: false });
    document.addEventListener("mousemove", onDocMove as EventListener);
    document.addEventListener("mouseup", onDocUp);
    document.addEventListener("touchmove", onDocMove as EventListener, { passive: false });
    document.addEventListener("touchend", onDocUp);

    // ── Drawing helpers ───────────────────────────────────────────────────────

    function drawPivot() {
      const px = anchorX();
      ctx.fillStyle = "#2a2a2a"; ctx.fillRect(px - 32, 0, 64, 5);
      ctx.fillStyle = "#3a3a3a"; ctx.fillRect(px - 32, 0, 64, 2);
      ctx.beginPath(); ctx.arc(px, 4, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = "#555"; ctx.fill();
      ctx.beginPath(); ctx.arc(px, 4, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#222"; ctx.fill();
    }

    function drawLanyard() {
      const n = nodes;
      if (n.length < 2) return;
      const HW = 12; // half-width of strap

      // Filled quads (dark woven fabric)
      for (let i = 0; i < n.length - 1; i++) {
        const a = n[i], b = n[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len * HW, ny = dx / len * HW;
        ctx.beginPath();
        ctx.moveTo(a.x - nx, a.y - ny); ctx.lineTo(b.x - nx, b.y - ny);
        ctx.lineTo(b.x + nx, b.y + ny); ctx.lineTo(a.x + nx, a.y + ny);
        ctx.closePath(); ctx.fillStyle = "#111"; ctx.fill();
      }

      // Left-edge highlight + right-edge shadow (3-D tube look)
      for (let i = 0; i < n.length - 1; i++) {
        const a = n[i], b = n[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len, ny = dx / len;
        ctx.beginPath();
        ctx.moveTo(a.x - nx * 11, a.y - ny * 11);
        ctx.lineTo(b.x - nx * 11, b.y - ny * 11);
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(a.x + nx * 11, a.y + ny * 11);
        ctx.lineTo(b.x + nx * 11, b.y + ny * 11);
        ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      }

      // "ID CARD" rotated text every other segment
      for (let i = 1; i < n.length - 2; i += 2) {
        const a = n[i], b = n[i + 1];
        const mx2 = (a.x + b.x) / 2, my2 = (a.y + b.y) / 2;
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        ctx.save();
        ctx.translate(mx2, my2); ctx.rotate(ang);
        ctx.font = "bold 7px Arial";
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("ID CARD", 0, 0);
        ctx.restore();
      }
    }

    // Photo image (loaded once)
    const img = new Image();
    img.src = "/assets/profile.jpg";
    let imgLoaded = false;
    img.onload = () => { imgLoaded = true; };

    function drawCard() {
      const tip = nodes[nodes.length - 1];
      const prev = nodes[nodes.length - 2];
      if (!tip || !prev) return;

      const dx = tip.x - prev.x, dy = tip.y - prev.y;
      const angle = Math.atan2(dy, dx) - Math.PI / 2;

      ctx.save();
      ctx.translate(tip.x, tip.y);
      ctx.rotate(angle);

      const w = CW, h = CH, r = 10;
      const L = -w / 2, T = 0;

      // Shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.75)"; ctx.shadowBlur = 32;
      ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 12;
      rr(ctx, L, T, w, h, r); ctx.fillStyle = "#eee"; ctx.fill();
      ctx.restore();

      // Clip to card
      rr(ctx, L, T, w, h, r); ctx.clip();

      // Card base
      ctx.fillStyle = "#f2ede7"; ctx.fillRect(L, T, w, h);

      // Photo zone (full card)
      const photoH = h;

      const pad = 14;
      const pX = L + pad;
      const pY = T + pad;
      const pW = w - pad * 2;
      const pH = photoH - pad * 2;

      ctx.fillStyle = "#0f0f0f"; ctx.fillRect(pX, pY, pW, pH);

      if (imgLoaded && img.naturalWidth > 0) {
        ctx.save();
        ctx.drawImage(img, pX, pY, pW, pH);
        // Desaturate via compositing (same as grayscale CSS filter)
        ctx.globalCompositeOperation = "saturation";
        ctx.fillStyle = "#000"; ctx.fillRect(pX, pY, pW, pH);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(pX, pY, pW, pH);
        ctx.restore();
      } else {
        // Silhouette placeholder
        const pxo = -36, pyo = pY + 14, pw = 72, ph = 86;
        ctx.fillStyle = "#191919"; ctx.fillRect(pxo, pyo, pw, ph);
        ctx.fillStyle = "#2d2d2d";
        ctx.beginPath(); ctx.ellipse(0, pyo + 24, 16, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, pyo + ph + 6, 26, 16, 0, Math.PI, 0, true); ctx.fill();
      }

      // Vignette
      const vg = ctx.createRadialGradient(0, pY + pH * 0.5, 10, 0, pY + pH * 0.5, 95);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.52)");
      ctx.fillStyle = vg; ctx.fillRect(pX, pY, pW, pH);

      // Light leak
      const ll = ctx.createRadialGradient(pX + 14, pY + 14, 0, pX + 14, pY + 14, 55);
      ll.addColorStop(0, "rgba(255,255,255,0.07)"); ll.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = ll; ctx.fillRect(pX, pY, pW, pH);

      // Photo Border
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(pX, pY, pW, pH);



      // Unclip, draw border
      ctx.restore();
      rr(ctx, L, T, w, h, r);
      ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 1; ctx.stroke();

      // Metal eyelet at rope tip (card top-centre)
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = "#999"; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#111"; ctx.fill();
      ctx.beginPath(); ctx.arc(-1, -1, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fill();

      ctx.restore();
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    let rafId = 0;
    function loop() {
      // Re-fit if hero was resized
      if (canvas!.width !== wrap!.offsetWidth || canvas!.height !== wrap!.offsetHeight) {
        fitCanvas();
        initRope();
      }

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      nodes[0].x = anchorX(); nodes[0].y = anchorY;

      if (!dragging) verlet();
      constrain();

      drawPivot();
      drawLanyard();
      drawCard();

      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      heroEl.removeEventListener("mousedown", onHeroDown as EventListener);
      heroEl.removeEventListener("mousemove", onHeroHover as EventListener);
      heroEl.removeEventListener("touchstart", onHeroDown as EventListener);
      document.removeEventListener("mousemove", onDocMove as EventListener);
      document.removeEventListener("mouseup", onDocUp);
      document.removeEventListener("touchmove", onDocMove as EventListener);
      document.removeEventListener("touchend", onDocUp);
    };
  }, []);

  return (
    /*
     * Absolutely covers the FULL hero section (inset:0).
     * pointer-events:none so the canvas never intercepts hero button clicks.
     * Events are attached to the parent hero element in JS instead.
     * No overflow:hidden — the card can swing anywhere in the hero.
     */
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
