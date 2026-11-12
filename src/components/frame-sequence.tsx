"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * Draws one frame of a pre-rendered JPEG sequence onto a canvas for a 0..1 scroll progress value.
 * Frames load lazily once the canvas is near the viewport; until a frame exists, the nearest loaded
 * one is shown (or nothing, so the poster underneath shows through). Draws "cover"-fit.
 */
export function FrameSequence({
  base,
  count,
  progress,
  className = "",
}: {
  base: string;
  count: number;
  progress: MotionValue<number>;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(-1);

  const draw = (i: number) => {
    const c = canvas.current;
    if (!c) return;
    let img = frames.current[i];
    if (!img) {
      for (let d = 1; d < count && !img; d++) img = frames.current[i - d] ?? frames.current[i + d] ?? null;
    }
    if (!img) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const { width: cw, height: ch } = c;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    current.current = i;
  };

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      draw(Math.max(0, current.current));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      frames.current = new Array(count).fill(null);
      // first, last and every 8th frame first, so scrubbing has something to show immediately
      const order = [...Array(count).keys()].sort((a, b) => (a % 8 === 0 ? -1 : 0) - (b % 8 === 0 ? -1 : 0));
      order.forEach((i) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = `${base}/${String(i + 1).padStart(3, "0")}.jpg`;
        img.onload = () => {
          frames.current[i] = img;
          const want = Math.round(progress.get() * (count - 1));
          if (current.current < 0 || Math.abs(i - want) < Math.abs(current.current - want)) draw(want);
        };
      });
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "800px 0px" });
    io.observe(c);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, count]);

  useMotionValueEvent(progress, "change", (v) => {
    const i = Math.min(count - 1, Math.max(0, Math.round(v * (count - 1))));
    if (i !== current.current) draw(i);
  });

  return <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
}
