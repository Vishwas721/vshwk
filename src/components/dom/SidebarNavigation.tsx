"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

/**
 * SidebarNavigation — Fixed right-edge vertical capsule & scroll slider replicating BaseHambergerMenu.vue
 *
 * Adapted for Kurita's signature soft off-white/cream #f0efeb theme:
 * - Crisp white (#ffffff) capsule with subtle warm border and shadow
 * - Signature 2-bar hamburger menu in #302c1a
 * - Dynamic scroll slider track and gliding handle in #302c1a
 * - Hover micro-squeeze animation matching legacy behavior
 */
export default function SidebarNavigation() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverAreaRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Initial entrance from offscreen right (+130px)
    gsap.fromTo(
      sidebar,
      { x: 130, opacity: 0 },
      {
        duration: 1.2,
        delay: 0.4,
        x: 0,
        opacity: 1,
        ease: "power3.out",
      }
    );

    // Track scroll position for slider handle
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      setScrollProgress(progress);

      if (sliderHandleRef.current) {
        gsap.to(sliderHandleRef.current, {
          y: progress * 140, // Range of motion for the slider handle indicator
          duration: 0.2,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      ref={sidebarRef}
      className="fixed z-50 select-none transition-all duration-300
        /* Mobile: top-right 60x60 square button */
        top-[10px] right-[20px] w-[60px] h-[60px]
        /* Desktop: tall vertical dock capsule */
        md:top-[10px] md:bottom-[10px] md:right-[10px] md:w-[110px] md:h-[calc(100vh-20px)]"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        ref={hoverAreaRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full bg-[#ffffff] border border-[rgba(48,44,26,0.08)] rounded-[10px] shadow-[0_8px_30px_rgba(48,44,26,0.08)] cursor-pointer overflow-hidden flex flex-col justify-between items-center py-8"
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
          <div className="hidden md:block absolute -top-20 bottom-[-80px] w-[2px] bg-[#e6e4dc] rounded-full">
            {/* Dynamic Slider Handle Indicator */}
            <div
              ref={sliderHandleRef}
              className="w-2.5 h-6 -ml-[4px] bg-[#302c1a] rounded-full shadow-sm"
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
      </div>
    </aside>
  );
}
