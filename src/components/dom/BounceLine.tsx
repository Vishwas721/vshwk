"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface BounceLineProps {
  width: number;
  origin?: "left" | "right";
  delay?: number;
  className?: string;
  strokeColor?: string;
}

/**
 * BounceLine — Interactive wobbling divider line replicating legacy AppBounceLine.vue
 *
 * Geometry & Behavior:
 * - SVG height: 160px with baseline at y = 80px (aligned to top: -80px of parent text wrapper)
 * - Path: M 0,80 Q {ctrlX},{ctrlY} {width},80
 * - On hover/mousemove: Quadratic Bezier curve bends towards cursor
 * - On mouseleave: GSAP elastic spring back: ease: "elastic.out(1, 0.3)" (1.0s duration)
 * - On mount: scaleX: 0 -> 1 line-extend reveal animation from specified origin
 */
export default function BounceLine({
  width,
  origin = "left",
  delay = 0,
  className = "",
  strokeColor = "#ffffff",
}: BounceLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Animated curve points
  const points = useRef({
    x: width / 2,
    y: 80,
  });

  const baseLine = 80;
  const amplitude = 0.07;
  const isBouncingBack = useRef(false);

  // Sync path string to DOM
  const updatePath = () => {
    if (!pathRef.current) return;
    const { x, y } = points.current;
    pathRef.current.setAttribute("d", `M 0,${baseLine} Q ${x},${y} ${width},${baseLine}`);
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Set initial scaleX: 0 with specified transform origin
    gsap.set(svg, {
      scaleX: 0,
      transformOrigin: origin,
    });

    // Reveal animation matching legacy fadeInAnimation
    gsap.to(svg, {
      duration: 1.0,
      delay,
      ease: "power3.out",
      scaleX: 1,
    });

    updatePath();
  }, [width, origin, delay]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || isBouncingBack.current) return;

    const rect = svg.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const offsetX = e.clientX - rect.left;

    // Calculate Y bend using legacy amplitude formula
    const targetY =
      (offsetY / rect.height - 0.5) * (rect.height + rect.width) * amplitude + baseLine;

    // Responsive horizontal control point following mouse
    const targetX = Math.max(20, Math.min(width - 20, (offsetX / rect.width) * width));

    gsap.killTweensOf(points.current);
    gsap.to(points.current, {
      duration: 0.25,
      ease: "power1.out",
      x: targetX,
      y: targetY,
      onUpdate: updatePath,
    });
  };

  const handleMouseLeave = () => {
    isBouncingBack.current = true;
    gsap.killTweensOf(points.current);

    // Exact legacy elastic release
    gsap.to(points.current, {
      duration: 1.0,
      ease: "elastic.out(1, 0.3)",
      x: width / 2,
      y: baseLine,
      onUpdate: updatePath,
      onComplete: () => {
        isBouncingBack.current = false;
      },
    });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} 160`}
      className={`absolute left-0 w-full h-[160px] pointer-events-auto cursor-pointer select-none overflow-visible z-10 ${className}`}
      style={{
        top: "-80px", // Centers baseline (80px) precisely at parent's top-0 boundary
        transformOrigin: origin,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        className="pointer-events-none"
        d={`M 0,80 Q ${width / 2},80 ${width},80`}
      />
    </svg>
  );
}
