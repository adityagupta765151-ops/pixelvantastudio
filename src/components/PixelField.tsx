import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Grid of pixels behind the hero. Lights up around the pointer and twinkles at random.
 *  Pauses off-screen; draws one static frame for reduced motion. */
export function PixelField({ cell = 24 }: { cell?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Px = { x: number; y: number; a: number; coral: boolean };
    let w = 0, h = 0, cells: Px[] = [], mx = -999, my = -999, running = true, raf = 0;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      for (let y = cell / 2; y < h; y += cell)
        for (let x = cell / 2; x < w; x += cell) cells.push({ x, y, a: 0, coral: Math.random() < 0.12 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of cells) {
        ctx.fillStyle = "rgba(14,15,19,.07)";
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
        const d = Math.hypot(p.x - mx, p.y - my);
        const target = d < 150 ? (1 - d / 150) * 0.6 : 0;
        if (!reduce && Math.random() < 0.0007) p.a = 0.45;
        p.a += (target - p.a) * (target > p.a ? 0.3 : 0.035);
        if (p.a > 0.02) {
          ctx.fillStyle = p.coral ? `rgba(255,106,61,${p.a})` : `rgba(58,75,255,${p.a})`;
          const z = 4 + p.a * 6;
          ctx.fillRect(p.x - z / 2, p.y - z / 2, z, z);
        }
      }
      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const onLeave = () => { mx = my = -999; };
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(); });
    const io = new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was && !reduce) draw();
    });

    size();
    ro.observe(canvas);
    io.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [cell]);

  return <canvas ref={ref} className="pixel-field" aria-hidden="true" />;
}
