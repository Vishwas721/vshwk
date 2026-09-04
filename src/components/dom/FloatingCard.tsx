"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { mouseCoordinator } from "@/lib/mouseCoordinator";
import { useUIStore } from "@/store/useUIStore";

/**
 * FloatingCard — Pink card with 3D mouse-tilt effect.
 *
 * Exact specs from legacy AppCard.vue & CardMv.vue:
 * - Proportions: 293px x 400px (Desktop), 212px x 302px (Mobile)
 * - Base rotation: 8deg
 * - Position: Anchored lower down so only the top edge peeks over the date text (Line 2),
 *   leaving the main title text completely unobstructed
 * - Layering: The readable description text sits at z-10 with clean flex spacing,
 *   while the large Six Caps 'VSHWSK' text acts as a true background watermark (opacity-25, z-0)
 *   to eliminate any collision or overwriting
 * - Colors: bg #ffabb7 ($thinPink), accent #d32254 ($darkPink), text #302c1a ($black)
 */
interface FloatingCardProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingCard({ className = "", style }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mouseNorm = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const TILT_MAX = 14; // max degrees of perspective tilt

  const handleMouseEnter = () => {
    isHovering.current = true;
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        duration: 0.35,
        ease: "power2.out",
        scale: 1.03,
      });
    }
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    mouseNorm.current = { x: 0, y: 0 };
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        duration: 0.6,
        ease: "power3.out",
        rotateX: 0,
        rotateY: 0,
        scale: 1,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current || !isHovering.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseNorm.current = { x, y };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Entrance animation matching legacy mvItemViewIn:
    if (innerRef.current) {
      gsap.fromTo(
        innerRef.current,
        { x: -70, opacity: 0, rotateZ: 20 },
        {
          duration: 1.2,
          delay: 0.5,
          x: 0,
          opacity: 1,
          rotateZ: 8,
          ease: "power3.out",
        }
      );
    }

    // Subscribe to unified mouse coordinator for per-frame tilt smoothing
    const unsubscribe = mouseCoordinator.subscribe(() => {
      if (!isHovering.current || !innerRef.current) return;
      const { x, y } = mouseNorm.current;
      gsap.to(innerRef.current, {
        duration: 0.25,
        ease: "none",
        rotateY: x * TILT_MAX,
        rotateX: -y * TILT_MAX,
        overwrite: "auto",
      });
    });

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      unsubscribe();
    };
  }, [handleMouseMove]);

  const startTransition = useUIStore((state) => state.startTransition);
  const isTransitioning = useUIStore((state) => state.isTransitioning);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTransitioning) return;
    startTransition("/about");
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative cursor-pointer select-none ${className}`}
      style={{
        width: "clamp(165px, 16vw, 215px)",
        height: "clamp(240px, 23vw, 315px)",
        perspective: "1000px",
        ...style,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        className="block w-full h-full cursor-pointer focus:outline-none"
        aria-label="Learn more about Vishwas K"
      >
        <div
          ref={innerRef}
          className="w-full h-full rounded-[14px] p-[18px_14px] sm:p-[20px_16px] md:p-[24px_18px] relative overflow-hidden bg-[#ffabb7] text-[#302c1a] will-change-transform shadow-[0_20px_50px_rgba(48,44,26,0.18)]"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotate(8deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Layer 1: Foreground Readable Content (z-10) */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top: Name section peeking near the date line */}
            <div>
              <span className="block text-[24px] md:text-[30px] leading-[0.9] text-[#fff] font-[helvetica,Arial,sans-serif] indent-[-4px]">
                ・
              </span>
              <span className="block text-[14px] md:text-[17px] font-medium leading-[1.2] text-[#fff] font-[helvetica,Arial,sans-serif] tracking-[0.02em]">
                VISHWAS K
              </span>
            </div>

            {/* Middle: Cleanly legible description lines with zero watermark collision */}
            <div className="text-[#d32254] font-[helvetica,Arial,sans-serif] text-[10px] md:text-[11.5px] font-semibold tracking-[0.03em] leading-[1.32] my-auto">
              <span className="block">YOU CAN CLICK AND,</span>
              <span className="block">EXPLORE ABOUT ME.</span>
              <span className="block">BY THE WAY,</span>
              <span className="block">WELCOME TO MY</span>
              <span className="block">DIGITAL SPACE.</span>
            </div>

            {/* Bottom subtitle indicator */}
            <div className="text-right pb-1">
              <span className="text-[9px] md:text-[11px] font-bold font-[helvetica,Arial,sans-serif] tracking-[0.06em] text-[#d32254]">
                (ABOUT ME)
              </span>
            </div>
          </div>

          {/* Layer 2: Background Watermark Text (z-0, opacity-25) */}
          <div className="absolute bottom-[-8px] left-0 w-full z-0 pointer-events-none select-none overflow-hidden text-[#d32254] opacity-25">
            <span
              className="block text-[75px] md:text-[105px] leading-[0.8] tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-six-caps)" }}
            >
              VSHWSK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
