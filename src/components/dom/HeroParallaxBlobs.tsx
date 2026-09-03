"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { mouseCoordinator } from "@/lib/mouseCoordinator";

interface HeroParallaxBlobsProps {
  children: React.ReactNode;
}

/**
 * HeroParallaxBlobs — Colored background circle masks with smooth mouse parallax.
 *
 * Exact specs from legacy MainVisualSection.vue:
 * - Yellow circle: hero-bg-circle-01 ($yellow: #ffd955), top-right
 * - Blue circle: hero-bg-circle-02 ($lightBlue: #55b1ff), top-left
 * - Subscribed to unified GSAP mouse coordinator for synchronized 60 FPS interpolation
 * - Entrance animation: scale 0 -> 1 with staggered delays
 */
export default function HeroParallaxBlobs({ children }: HeroParallaxBlobsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blueCircleRef = useRef<HTMLDivElement>(null);
  const yellowCircleRef = useRef<HTMLDivElement>(null);

  const BLUE_FACTOR = -42; // px max displacement for deeper layer
  const YELLOW_FACTOR = -26; // px max displacement for foreground layer

  useEffect(() => {
    const blue = blueCircleRef.current;
    const yellow = yellowCircleRef.current;
    if (!blue || !yellow) return;

    // Entrance scale-in animation matching legacy
    gsap.fromTo(
      yellow,
      { scale: 0 },
      {
        duration: 1.1,
        delay: 0.2,
        ease: "power3.out",
        scale: 1,
      }
    );

    gsap.fromTo(
      blue,
      { scale: 0 },
      {
        duration: 1.1,
        delay: 0.4,
        ease: "power3.out",
        scale: 1,
      }
    );

    // Subscribe to unified mouse coordinator
    const unsubscribe = mouseCoordinator.subscribe(({ normX, normY }) => {
      // Blue circle: deeper layer
      gsap.to(blue, {
        duration: 0.35,
        ease: "none",
        x: normX * BLUE_FACTOR,
        y: normY * BLUE_FACTOR,
        overwrite: "auto",
      });

      // Yellow circle: upper layer
      gsap.to(yellow, {
        duration: 0.35,
        ease: "none",
        x: normX * YELLOW_FACTOR,
        y: normY * YELLOW_FACTOR,
        overwrite: "auto",
      });
    });

    return () => {
      unsubscribe();
      gsap.killTweensOf(blue);
      gsap.killTweensOf(yellow);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden">
      {/* Blue Circle ($lightBlue #55b1ff) - hero-bg-circle-02 */}
      <div
        ref={blueCircleRef}
        className="absolute rounded-full pointer-events-none bg-[#55b1ff] will-change-transform"
        style={{
          width: "clamp(500px, 80vw, 1034px)",
          height: "clamp(500px, 80vw, 1034px)",
          top: "0",
          left: "clamp(-280px, -16.8vw, -216px)",
          transform: "scale(0)",
        }}
      />

      {/* Yellow Circle ($yellow #ffd955) - hero-bg-circle-01 */}
      <div
        ref={yellowCircleRef}
        className="absolute rounded-full pointer-events-none bg-[#ffd955] will-change-transform"
        style={{
          width: "clamp(400px, 64vw, 820px)",
          height: "clamp(400px, 64vw, 820px)",
          top: "clamp(-190px, -14.3vw, -184px)",
          right: "clamp(-140px, -7vw, -90px)",
          transform: "scale(0)",
        }}
      />

      {/* Content */}
      {children}
    </div>
  );
}
