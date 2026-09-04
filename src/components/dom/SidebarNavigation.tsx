"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { useUIStore } from "@/store/useUIStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SidebarNavigation — Fixed right-edge vertical capsule & scroll slider replicating BaseHambergerMenu.vue
 *
 * Core Features:
 * - Global fixed positioning: fixed top-0 right-0 h-[100dvh] z-[50]
 * - Dual-layer global scroll tracker: useLenis + GSAP ScrollTrigger (tracking entire document.body 0 to 1)
 * - Dynamic black slider thumb mapped to 0-1 progress from absolute top (/) to footer
 * - Signature 2-bar hamburger menu trigger wired to useUIStore
 */
export default function SidebarNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverAreaRef = useRef<HTMLButtonElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { toggleSidebar } = useUIStore();

  // Range of motion for the slider handle indicator on the 173px track
  const maxTravel = 140;

  // ─── 1. Lenis Real-time Smooth Scroll Tracker ───
  useLenis(({ progress }) => {
    setScrollProgress(progress);
    if (sliderHandleRef.current) {
      gsap.to(sliderHandleRef.current, {
        y: progress * maxTravel,
        duration: 0.1,
        ease: "none",
        overwrite: "auto",
      });
    }
  });

  // ─── 2. GSAP ScrollTrigger tracking entire document.body (0 to 1) ───
  useGSAP(() => {
    if (typeof document === "undefined") return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        if (sliderHandleRef.current) {
          gsap.to(sliderHandleRef.current, {
            y: self.progress * maxTravel,
            duration: 0.1,
            ease: "none",
            overwrite: "auto",
          });
        }
      },
    });

    return () => trigger.kill();
  }, []);

  const handleMouseEnter = () => {
    if (hoverAreaRef.current) {
      gsap.to(hoverAreaRef.current, {
        scaleX: 0.94,
        scaleY: 0.98,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (hoverAreaRef.current) {
      gsap.to(hoverAreaRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  return (
    <aside
      ref={containerRef}
      aria-label="Navigation and scroll progress"
      className="fixed top-0 right-0 h-[100dvh] z-[50] pointer-events-none select-none flex flex-col justify-center items-end pr-[10px] max-[767px]:pr-[20px] max-[767px]:top-[10px] max-[767px]:bottom-auto max-[767px]:h-auto"
      style={{ willChange: "transform, opacity" }}
    >
      <button
        ref={hoverAreaRef}
        type="button"
        aria-label="Open navigation menu"
        onClick={toggleSidebar}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto relative w-[110px] h-[calc(100dvh-20px)] bg-[#ffffff] border border-[rgba(48,44,26,0.08)] rounded-[10px] shadow-[0_8px_30px_rgba(48,44,26,0.08)] cursor-pointer overflow-hidden flex flex-col justify-between items-center py-8 outline-none focus:outline-none transition-opacity duration-300 max-[767px]:w-[60px] max-[767px]:h-[60px] max-[767px]:p-0 max-[767px]:justify-center"
      >
        {/* Top subtle branding/indicator on desktop */}
        <div className="hidden md:flex flex-col items-center gap-1.5 opacity-50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#302c1a]" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#302c1a] [writing-mode:vertical-lr] rotate-180">
            SCROLL
          </span>
        </div>

        {/* Center: Signature Kurita Hamburger Trigger & Scroll Track */}
        <div className="relative flex flex-col items-center justify-center my-auto">
          {/* Slider track line */}
          <div className="hidden md:block absolute -top-20 bottom-[-80px] w-[2px] bg-[#e6e4dc] rounded-full pointer-events-none">
            {/* Dynamic Black Slider Handle Indicator */}
            <div
              ref={sliderHandleRef}
              className="w-2.5 h-6 -ml-[4px] bg-[#302c1a] rounded-full shadow-sm will-change-transform"
              title="Scroll indicator"
            />
          </div>

          {/* 2 Horizontal Bars matching .hambergerMenu-openarea-line */}
          <div className="relative z-10 w-[30px] md:w-[37px] h-[13px] flex flex-col justify-between">
            <span className="block w-full h-[3px] md:h-[4px] bg-[#302c1a] rounded-[2px]" />
            <span className="block w-full h-[3px] md:h-[4px] bg-[#302c1a] rounded-[2px]" />
          </div>
        </div>

        {/* Bottom percentage indicator on desktop */}
        <div className="hidden md:flex flex-col items-center gap-1 opacity-60 text-[11px] font-mono text-[#302c1a]">
          <span>{Math.round(scrollProgress * 100)}%</span>
        </div>
      </button>
    </aside>
  );
}
