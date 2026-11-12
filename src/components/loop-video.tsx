"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A muted ambient loop over its own poster. The poster is a real <Image> (fast first paint); the video
 * fades in once it can play, plays only while on screen, and never loads at all for reduced motion.
 * Phones get the lighter 720px portrait cut.
 */
export function LoopVideo({
  desktop,
  mobile,
  poster,
  alt = "",
  priority = false,
  className = "",
  imgClassName = "object-cover",
}: {
  desktop: string;
  mobile: string;
  poster: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(min-width: 768px)");
    setSrc(mq.matches ? desktop : mobile);
  }, [reduce, desktop, mobile]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image src={poster} alt={alt} fill priority={priority} sizes="100vw" className={imgClassName} />
      {src && (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${imgClassName} ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
