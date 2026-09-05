"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePickupStore, PICKUP_PROJECTS } from "@/store/usePickupStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Outgoing background color of the preceding Short About section
const ABOUT_BG_COLOR = "#55b1ff";

/**
 * ProjectsPickupSection
 *
 * Implements a continuous, scroll-linked "scrubbing" architecture using GSAP ScrollTrigger.
 *
 * Fixed Layout Architecture:
 * - Outer Wrapper (Trigger): <div ref={triggerRef} className="relative w-full">
 * - Inner Wrapper (Pinned Canvas): <div ref={pinnedRef} className="h-screen w-full relative overflow-hidden bg-transparent z-10">
 * - pinSpacing: true guarantees GSAP creates the exact 4000px track without collapsing the layout or blanking.
 */
export default function ProjectsPickupSection() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);

  // Bubble layer refs
  const creamMainRef = useRef<HTMLDivElement>(null);
  const creamSub1Ref = useRef<HTMLDivElement>(null);
  const creamSub2Ref = useRef<HTMLDivElement>(null);

  const orangeMainRef = useRef<HTMLDivElement>(null);
  const orangeSub1Ref = useRef<HTMLDivElement>(null);
  const orangeSub2Ref = useRef<HTMLDivElement>(null);

  const mintMainRef = useRef<HTMLDivElement>(null);
  const mintSub1Ref = useRef<HTMLDivElement>(null);
  const mintSub2Ref = useRef<HTMLDivElement>(null);

  // Content layers refs
  const privexTextRef = useRef<HTMLDivElement>(null);
  const nagarikTextRef = useRef<HTMLDivElement>(null);
  const summaidTextRef = useRef<HTMLDivElement>(null);

  const setGlobalBgColor = usePickupStore((s) => s.setGlobalBgColor);

  useGSAP(
    () => {
      if (!triggerRef.current || !pinnedRef.current) return;

      const creamMain = creamMainRef.current;
      const creamSub1 = creamSub1Ref.current;
      const creamSub2 = creamSub2Ref.current;

      const orangeMain = orangeMainRef.current;
      const orangeSub1 = orangeSub1Ref.current;
      const orangeSub2 = orangeSub2Ref.current;

      const mintMain = mintMainRef.current;
      const mintSub1 = mintSub1Ref.current;
      const mintSub2 = mintSub2Ref.current;

      const privexText = privexTextRef.current;
      const nagarikText = nagarikTextRef.current;
      const summaidText = summaidTextRef.current;

      // 1. Explicit initial states
      gsap.set([creamMain, orangeMain, mintMain], {
        scale: 0,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
        force3D: true,
      });

      gsap.set([creamSub1, creamSub2, orangeSub1, orangeSub2, mintSub1, mintSub2], {
        scale: 0,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
        force3D: true,
      });

      gsap.set([privexText, nagarikText, summaidText], {
        opacity: 0,
        y: 60,
        force3D: true,
      });

      // 2. Build the master scrubbing timeline with continuous flow and zero dead zones
      const tl = gsap.timeline({
        defaults: { ease: "none" },
      });

      // ─── PHASE 1: Entry to Project 1 (Privex: #F9F6F0 Cream) ───
      // Cream bubble expands 0 -> 160vmax
      tl.to(creamMain, {
        scale: 1,
        duration: 1.5,
        ease: "none",
      });
      tl.fromTo(
        creamSub1,
        { scale: 0, x: -160, y: -200 },
        { scale: 1.3, x: 0, y: 0, duration: 1.5, ease: "none" },
        "<"
      );
      tl.fromTo(
        creamSub2,
        { scale: 0, x: 180, y: 140 },
        { scale: 1.1, x: 0, y: 0, duration: 1.5, ease: "none" },
        "<"
      );

      // Privex text reveals as Cream bubble reaches full size
      tl.to(
        privexText,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "none",
        },
        "-=0.6"
      );

      // ─── PHASE 2: Privex -> Project 2 (NagarikOne: #FFD8A8 Orange) ───
      // Privex text fades out and moves up
      tl.to(
        privexText,
        {
          opacity: 0,
          y: -40,
          duration: 0.6,
          ease: "none",
        },
        "+=0.2"
      );

      // Orange bubble expands over Cream, aggressively overlapping text fadeout
      tl.to(
        orangeMain,
        {
          scale: 1,
          duration: 1.5,
          ease: "none",
        },
        "-=0.4"
      );
      tl.fromTo(
        orangeSub1,
        { scale: 0, x: 140, y: -180 },
        { scale: 1.3, x: 0, y: 0, duration: 1.5, ease: "none" },
        "<"
      );
      tl.fromTo(
        orangeSub2,
        { scale: 0, x: -160, y: 130 },
        { scale: 1.1, x: 0, y: 0, duration: 1.5, ease: "none" },
        "<"
      );

      // NagarikOne text reveals as Orange bubble reaches full cover
      tl.to(
        nagarikText,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "none",
        },
        "-=0.6"
      );

      // ─── PHASE 3: NagarikOne -> Project 3 (SummAID: #D8F3DC Mint) ───
      // NagarikOne text fades out and moves up
      tl.to(
        nagarikText,
        {
          opacity: 0,
          y: -40,
          duration: 0.6,
          ease: "none",
        },
        "+=0.2"
      );

      // Mint bubble expands over Orange, aggressively overlapping text fadeout
      tl.to(
        mintMain,
        {
          scale: 1,
          duration: 1.5,
          ease: "none",
        },
        "-=0.4"
      );
      tl.fromTo(
        mintSub1,
        { scale: 0, x: -120, y: 170 },
        { scale: 1.3, x: 0, y: 0, duration: 1.5, ease: "none" },
        "<"
      );
      tl.fromTo(
        mintSub2,
        { scale: 0, x: 150, y: -120 },
        { scale: 1.1, x: 0, y: 0, duration: 1.5, ease: "none" },
        "<"
      );

      // SummAID text reveals as Mint bubble reaches full cover
      tl.to(
        summaidText,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "none",
        },
        "-=0.6"
      );

      // Settle on SummAID before smoothly unpinning to Footer
      tl.to(
        {},
        {
          duration: 0.4,
          ease: "none",
        }
      );

      // 3. Create the ScrollTrigger pinning the inner container with pinSpacing: true
      ScrollTrigger.create({
        trigger: triggerRef.current,
        pin: pinnedRef.current, // Pin the inner container specifically
        pinSpacing: true,       // Force GSAP to pad the DOM so the footer doesn't overlap
        scrub: 1.2,
        start: "top top",
        end: () => "+=" + window.innerHeight * 4,
        animation: tl,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.68) {
            setGlobalBgColor("#D8F3DC");
          } else if (self.progress > 0.32) {
            setGlobalBgColor("#FFD8A8");
          } else if (self.progress > 0.03) {
            setGlobalBgColor("#F9F6F0");
          } else {
            setGlobalBgColor("transparent");
          }
        },
      });

      // Force layout calculation on mount to guarantee perfect pin-spacer calculations
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        clearTimeout(refreshTimer);
      };
    },
    { scope: triggerRef }
  );

  return (
    <div ref={triggerRef} id="pickup-section" className="relative w-full">
      <div
        ref={pinnedRef}
        className="h-screen w-full relative overflow-hidden bg-transparent z-10"
      >
        {/* ─── Inline SVG Gooey Filter ─── */}
        <svg
          className="pointer-events-none absolute w-0 h-0 overflow-hidden"
          aria-hidden="true"
        >
          <defs>
            <filter id="gooey-pickup">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                result="gooey"
              />
              <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* ─── Base Background: About Blue (#55b1ff) ─── */}
        <div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ backgroundColor: ABOUT_BG_COLOR }}
        />

        {/* ═══════════════════════════════════════════════════════════
            LAYER 1: Project 1 — Privex (#F9F6F0 Cream)
            ═══════════════════════════════════════════════════════════ */}
        {/* Cream Gooey Bubble Layer (z-[5]) */}
        <div
          className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ filter: "url(#gooey-pickup)" }}
        >
          <div
            ref={creamSub1Ref}
            className="absolute rounded-full bg-[#F9F6F0] will-change-transform"
            style={{ width: "260px", height: "260px", top: "50%", left: "50%" }}
          />
          <div
            ref={creamSub2Ref}
            className="absolute rounded-full bg-[#F9F6F0] will-change-transform"
            style={{ width: "200px", height: "200px", top: "50%", left: "50%" }}
          />
          <div
            ref={creamMainRef}
            className="absolute rounded-full bg-[#F9F6F0] will-change-transform"
            style={{ width: "160vmax", height: "160vmax", top: "50%", left: "50%" }}
          />
        </div>

        {/* Privex Text Content (z-10) */}
        <div
          ref={privexTextRef}
          className="absolute inset-0 z-10 pointer-events-none will-change-transform"
        >
          {/* Top-Right Badge */}
          <div className="absolute top-[65px] md:top-[70px] right-6 sm:right-10 md:right-[155px] text-right font-[helvetica,Arial,sans-serif]">
            <div
              className="flex items-center justify-end gap-2 text-xs md:text-sm tracking-[0.18em] uppercase font-semibold"
              style={{ color: PICKUP_PROJECTS[0].textColor }}
            >
              <span className="text-xl leading-none font-bold">・</span>
              <span>SELECTED</span>
              <span>PROJECT</span>
              <span className="font-mono text-sm md:text-base font-bold">01</span>
              <span className="opacity-40 font-mono text-xs">/ 03</span>
            </div>
          </div>

          {/* Center Title */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h2
              className="text-[clamp(5.5rem,21vmin,19rem)] leading-[0.88] tracking-[-0.01em] text-center uppercase select-none drop-shadow-sm"
              style={{
                fontFamily: "var(--font-six-caps)",
                color: PICKUP_PROJECTS[0].textColor,
              }}
            >
              {PICKUP_PROJECTS[0].title}
            </h2>
          </div>

          {/* Bottom-Left Description */}
          <div className="absolute bottom-10 md:bottom-[86px] left-6 sm:left-10 md:left-12 max-w-[340px] md:max-w-md">
            <span
              className="block text-xs md:text-sm font-bold tracking-wider mb-2 uppercase"
              style={{ color: PICKUP_PROJECTS[0].textColor }}
            >
              {PICKUP_PROJECTS[0].category}
            </span>
            <p
              className="text-xs md:text-sm font-[helvetica,Arial,sans-serif] leading-relaxed tracking-wide"
              style={{ color: PICKUP_PROJECTS[0].textColor }}
            >
              {PICKUP_PROJECTS[0].desc}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            LAYER 2: Project 2 — NagarikOne (#FFD8A8 Orange)
            ═══════════════════════════════════════════════════════════ */}
        {/* Orange Gooey Bubble Layer (z-[20], expands over Privex) */}
        <div
          className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ filter: "url(#gooey-pickup)" }}
        >
          <div
            ref={orangeSub1Ref}
            className="absolute rounded-full bg-[#FFD8A8] will-change-transform"
            style={{ width: "260px", height: "260px", top: "50%", left: "50%" }}
          />
          <div
            ref={orangeSub2Ref}
            className="absolute rounded-full bg-[#FFD8A8] will-change-transform"
            style={{ width: "200px", height: "200px", top: "50%", left: "50%" }}
          />
          <div
            ref={orangeMainRef}
            className="absolute rounded-full bg-[#FFD8A8] will-change-transform"
            style={{ width: "160vmax", height: "160vmax", top: "50%", left: "50%" }}
          />
        </div>

        {/* NagarikOne Text Content (z-30) */}
        <div
          ref={nagarikTextRef}
          className="absolute inset-0 z-30 pointer-events-none will-change-transform"
        >
          {/* Top-Right Badge */}
          <div className="absolute top-[65px] md:top-[70px] right-6 sm:right-10 md:right-[155px] text-right font-[helvetica,Arial,sans-serif]">
            <div
              className="flex items-center justify-end gap-2 text-xs md:text-sm tracking-[0.18em] uppercase font-semibold"
              style={{ color: PICKUP_PROJECTS[1].textColor }}
            >
              <span className="text-xl leading-none font-bold">・</span>
              <span>SELECTED</span>
              <span>PROJECT</span>
              <span className="font-mono text-sm md:text-base font-bold">02</span>
              <span className="opacity-40 font-mono text-xs">/ 03</span>
            </div>
          </div>

          {/* Center Title */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h2
              className="text-[clamp(5.5rem,21vmin,19rem)] leading-[0.88] tracking-[-0.01em] text-center uppercase select-none drop-shadow-sm"
              style={{
                fontFamily: "var(--font-six-caps)",
                color: PICKUP_PROJECTS[1].textColor,
              }}
            >
              {PICKUP_PROJECTS[1].title}
            </h2>
          </div>

          {/* Bottom-Left Description */}
          <div className="absolute bottom-10 md:bottom-[86px] left-6 sm:left-10 md:left-12 max-w-[340px] md:max-w-md">
            <span
              className="block text-xs md:text-sm font-bold tracking-wider mb-2 uppercase"
              style={{ color: PICKUP_PROJECTS[1].textColor }}
            >
              {PICKUP_PROJECTS[1].category}
            </span>
            <p
              className="text-xs md:text-sm font-[helvetica,Arial,sans-serif] leading-relaxed tracking-wide"
              style={{ color: PICKUP_PROJECTS[1].textColor }}
            >
              {PICKUP_PROJECTS[1].desc}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            LAYER 3: Project 3 — SummAID (#D8F3DC Mint)
            ═══════════════════════════════════════════════════════════ */}
        {/* Mint Gooey Bubble Layer (z-[40], expands over NagarikOne) */}
        <div
          className="absolute inset-0 z-[40] flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ filter: "url(#gooey-pickup)" }}
        >
          <div
            ref={mintSub1Ref}
            className="absolute rounded-full bg-[#D8F3DC] will-change-transform"
            style={{ width: "260px", height: "260px", top: "50%", left: "50%" }}
          />
          <div
            ref={mintSub2Ref}
            className="absolute rounded-full bg-[#D8F3DC] will-change-transform"
            style={{ width: "200px", height: "200px", top: "50%", left: "50%" }}
          />
          <div
            ref={mintMainRef}
            className="absolute rounded-full bg-[#D8F3DC] will-change-transform"
            style={{ width: "160vmax", height: "160vmax", top: "50%", left: "50%" }}
          />
        </div>

        {/* SummAID Text Content (z-50) */}
        <div
          ref={summaidTextRef}
          className="absolute inset-0 z-50 pointer-events-none will-change-transform"
        >
          {/* Top-Right Badge */}
          <div className="absolute top-[65px] md:top-[70px] right-6 sm:right-10 md:right-[155px] text-right font-[helvetica,Arial,sans-serif]">
            <div
              className="flex items-center justify-end gap-2 text-xs md:text-sm tracking-[0.18em] uppercase font-semibold"
              style={{ color: PICKUP_PROJECTS[2].textColor }}
            >
              <span className="text-xl leading-none font-bold">・</span>
              <span>SELECTED</span>
              <span>PROJECT</span>
              <span className="font-mono text-sm md:text-base font-bold">03</span>
              <span className="opacity-40 font-mono text-xs">/ 03</span>
            </div>
          </div>

          {/* Center Title */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h2
              className="text-[clamp(5.5rem,21vmin,19rem)] leading-[0.88] tracking-[-0.01em] text-center uppercase select-none drop-shadow-sm"
              style={{
                fontFamily: "var(--font-six-caps)",
                color: PICKUP_PROJECTS[2].textColor,
              }}
            >
              {PICKUP_PROJECTS[2].title}
            </h2>
          </div>

          {/* Bottom-Left Description */}
          <div className="absolute bottom-10 md:bottom-[86px] left-6 sm:left-10 md:left-12 max-w-[340px] md:max-w-md">
            <span
              className="block text-xs md:text-sm font-bold tracking-wider mb-2 uppercase"
              style={{ color: PICKUP_PROJECTS[2].textColor }}
            >
              {PICKUP_PROJECTS[2].category}
            </span>
            <p
              className="text-xs md:text-sm font-[helvetica,Arial,sans-serif] leading-relaxed tracking-wide"
              style={{ color: PICKUP_PROJECTS[2].textColor }}
            >
              {PICKUP_PROJECTS[2].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
