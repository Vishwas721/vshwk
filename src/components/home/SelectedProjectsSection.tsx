"use client";

import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SelectedProjectItem {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  bg: string;
  zIndexClass: string;
}

export const SELECTED_PROJECTS: SelectedProjectItem[] = [
  {
    id: "summaid",
    index: "01 / 03",
    title: "SUMMAID",
    tagline: "AI CLINICAL INTELLIGENCE PLATFORM",
    description:
      "Longitudinal medical report summarization engine utilizing RAG architecture.",
    stack: ["FASTAPI", "PGVECTOR", "LOCAL LLMS", "REACT"],
    bg: "#E3EAF4", // Ice Blue
    zIndexClass: "z-10",
  },
  {
    id: "privex",
    index: "02 / 03",
    title: "PRIVEX",
    tagline: "VISUAL FIREWALL & MEMORY AGENT",
    description:
      "Privacy-focused local infrastructure with real-time edge detection and hybrid vector-graph pipelines.",
    stack: ["YOLOV8", "EASYOCR", "LANGGRAPH", "FASTAPI", "NEO4J"],
    bg: "#E4F0E8", // Matcha Green
    zIndexClass: "z-20",
  },
  {
    id: "nagarikone",
    index: "03 / 03",
    title: "NAGARIKONE",
    tagline: "DECENTRALIZED CIVIC GOVERNANCE",
    description:
      "Civic issue reporting platform engineered with 50-meter geospatial duplicate detection.",
    stack: ["PERN STACK", "REACT NATIVE", "POSTGIS", "GEMINI API"],
    bg: "#F9EAE1", // Peach Orange
    zIndexClass: "z-30",
  },
];

const STACK_CARD_COLORS = [
  "#F5B041", // Mustard Yellow
  "#A9DFBF", // Soft Green
  "#AED6F1", // Light Blue
  "#F5CBA7", // Peach
  "#D7BDE2", // Soft Lavender
  "#F9E79F", // Warm Cream
];

interface TactileStackDrawerProps {
  stack: string[];
}

/**
 * TactileStackDrawer
 *
 * Premium physical card deck matching the reference:
 * - Solid vibrant backgrounds (#F5B041, #A9DFBF, #AED6F1, #F5CBA7) with solid black typography.
 * - w-48 h-64 rounded-2xl p-5 shadow-xl relative overflow-hidden.
 * - Top element: small dot + '• STACK' tracked-out label.
 * - Middle element: bold clean sans-serif tool name.
 * - Bottom element: massive ultra-condensed watermark (-bottom-4 -left-2 text-6xl text-black/10).
 * - Staggered slide-up cascade (initial y: 100, opacity: 0 -> animate y: 0, opacity: 1).
 * - Positioned beside/above toggle button so it does not overlap project description.
 * - Mechanical hover state: whileHover={{ y: -10, scale: 1.02, zIndex: 50 }}.
 */
function TactileStackDrawer({ stack }: TactileStackDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mt-4 pt-3 border-t border-[#2d2a26]/15 pointer-events-auto">
      {/* Interactive Staggered Physical Cards Deck (Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full left-0 mb-4 sm:mb-0 sm:bottom-0 sm:left-full sm:ml-8 flex items-end z-40 pointer-events-auto"
          >
            {stack.map((tool, idx) => (
              <motion.div
                key={tool}
                initial={{ y: 100, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    delay: idx * 0.08,
                    duration: 0.35,
                    ease: "easeOut",
                  },
                }}
                exit={{
                  y: 50,
                  opacity: 0,
                  transition: { duration: 0.2, ease: "easeIn" },
                }}
                whileHover={{ y: -10, scale: 1.02, zIndex: 50 }}
                className={`w-44 sm:w-48 h-56 sm:h-64 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-xl border border-black/10 cursor-pointer select-none text-black shrink-0 ${
                  idx > 0 ? "-ml-20 sm:-ml-24" : ""
                }`}
                style={{
                  backgroundColor:
                    STACK_CARD_COLORS[idx % STACK_CARD_COLORS.length],
                  zIndex: idx + 1,
                }}
              >
                {/* Top Elements: Dot & STACK label */}
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-black select-none z-10">
                  <span className="text-xs leading-none">•</span>
                  <span>STACK</span>
                </div>

                {/* Middle Element: Tool Name Primary Title */}
                <div className="my-auto z-10">
                  <h4 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-black leading-tight uppercase break-words">
                    {tool}
                  </h4>
                </div>

                {/* Bottom Element: Massive Ultra-Condensed Watermark */}
                <span
                  className="absolute -bottom-4 -left-2 text-6xl font-custom-condensed text-black/10 leading-none select-none pointer-events-none uppercase tracking-tighter whitespace-nowrap"
                  style={{
                    fontFamily:
                      "var(--font-custom-condensed, var(--font-six-caps))",
                  }}
                >
                  {tool}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full border border-current px-4 py-1.5 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors font-mono cursor-pointer pointer-events-auto text-[#2d2a26]"
      >
        {isOpen ? "[ - CLOSE STACK ]" : "[ + EXPLORE STACK ]"}
      </button>
    </div>
  );
}

export interface SelectedProjectsSectionProps
  extends React.HTMLAttributes<HTMLElement> {}

/**
 * SelectedProjectsSection
 *
 * Implements:
 * 1. Pinned Base Layer: Blue About background (#55b1ff).
 * 2. Unified Expanding Circular Bubble Wipes (clipPath circle(150% at 50% 50%)):
 *    - Blue About -> SummAID (Ice Blue #E3EAF4)
 *    - SummAID -> Privex (Matcha Green #E4F0E8)
 *    - Privex -> NagarikOne (Peach Orange #F9EAE1)
 * 3. Consistent Text Overlap (-=0.35) with masked typography slide-up reveals.
 * 4. Final Exit Wipe into Marquee Section (#F0EFEB Beige) untouched.
 */
const SelectedProjectsSection = forwardRef<
  HTMLElement,
  SelectedProjectsSectionProps
>((props, forwardedRef) => {
  const containerRef = useRef<HTMLElement>(null);

  // Master pinned wrapper ref
  const masterWrapperRef = useRef<HTMLDivElement>(null);

  // Project cards refs
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);

  // Typography & meta refs
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const metaTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaBottomRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Exit wipe ref
  const exitWipeRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(forwardedRef, () => containerRef.current as HTMLElement);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const masterWrapper = masterWrapperRef.current;
      const p1 = p1Ref.current;
      const p2 = p2Ref.current;
      const p3 = p3Ref.current;
      const exitWipe = exitWipeRef.current;

      // ─── Master Continuous Timeline with Unified Bubble Wipes ───
      if (masterWrapper && p1 && p2 && p3 && exitWipe) {
        // Initial setup: all project layers start hidden in center
        gsap.set([p1, p2, p3, exitWipe], {
          clipPath: "circle(0% at 50% 50%)",
          WebkitClipPath: "circle(0% at 50% 50%)",
        });

        // Initialize titles & metadata
        [0, 1, 2].forEach((idx) => {
          const titleEl = titleRefs.current[idx];
          const metaTopEl = metaTopRefs.current[idx];
          const metaBottomEl = metaBottomRefs.current[idx];

          if (titleEl) gsap.set(titleEl, { y: "100%", force3D: true });
          if (metaTopEl) gsap.set(metaTopEl, { opacity: 0, y: -10, force3D: true });
          if (metaBottomEl) gsap.set(metaBottomEl, { opacity: 0, y: 15, force3D: true });
        });

        // Master Timeline pinned with virtual scroll track (+=450%) for buttery smooth pacing
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: masterWrapper,
            start: "top top",
            end: "+=450%",
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        const t1 = titleRefs.current[0];
        const mTop1 = metaTopRefs.current[0];
        const mBot1 = metaBottomRefs.current[0];

        const t2 = titleRefs.current[1];
        const mTop2 = metaTopRefs.current[1];
        const mBot2 = metaBottomRefs.current[1];

        const t3 = titleRefs.current[2];
        const mTop3 = metaTopRefs.current[2];
        const mBot3 = metaBottomRefs.current[2];

        // ─── 1. Blue About -> Project 1 (SummAID) Breathing Bubble Wipe ───
        masterTl.to(
          p1,
          {
            clipPath: "circle(150% at 50% 50%)",
            WebkitClipPath: "circle(150% at 50% 50%)",
            ease: "none",
            duration: 1.0,
          },
          0.1
        );

        // Text starts revealing WHILE the bubble is still expanding (-=0.35)
        if (t1) {
          masterTl.to(t1, { y: "0%", duration: 0.6, ease: "power3.out" }, "-=0.35");
        }
        if (mTop1 && mBot1) {
          masterTl.to(
            [mTop1, mBot1],
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" },
            "<0.1"
          );
        }

        // ─── 2. SummAID -> Project 2 (Privex) Breathing Bubble Wipe (Exact Match) ───
        masterTl.to(
          p2,
          {
            clipPath: "circle(150% at 50% 50%)",
            WebkitClipPath: "circle(150% at 50% 50%)",
            ease: "none",
            duration: 1.0,
          },
          "+=0.2"
        );

        // Text starts revealing WHILE the bubble is still expanding (-=0.35)
        if (t2) {
          masterTl.to(t2, { y: "0%", duration: 0.6, ease: "power3.out" }, "-=0.35");
        }
        if (mTop2 && mBot2) {
          masterTl.to(
            [mTop2, mBot2],
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" },
            "<0.1"
          );
        }

        // ─── 3. Privex -> Project 3 (NagarikOne) Breathing Bubble Wipe (Exact Match) ───
        masterTl.to(
          p3,
          {
            clipPath: "circle(150% at 50% 50%)",
            WebkitClipPath: "circle(150% at 50% 50%)",
            ease: "none",
            duration: 1.0,
          },
          "+=0.2"
        );

        // Text starts revealing WHILE the bubble is still expanding (-=0.35)
        if (t3) {
          masterTl.to(t3, { y: "0%", duration: 0.6, ease: "power3.out" }, "-=0.35");
        }
        if (mTop3 && mBot3) {
          masterTl.to(
            [mTop3, mBot3],
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" },
            "<0.1"
          );
        }

        // ─── 4. Step 4: Final Exit Wipe into Marquee Section (#F0EFEB Beige) ───
        masterTl.to(
          exitWipe,
          {
            clipPath: "circle(150% at 50% 50%)",
            WebkitClipPath: "circle(150% at 50% 50%)",
            ease: "none",
            duration: 0.8,
          },
          "+=0.2"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="selected-projects"
      {...props}
      className={`relative w-full select-none ${props.className || ""}`}
    >
      {/* ─── Master Pinned Container with Virtual Scroll Track ─── */}
      <div
        ref={masterWrapperRef}
        className="h-screen w-full relative overflow-hidden bg-[#55b1ff]"
      >
        {/* ─── Pinned Base Layer: Blue background from About section (#55b1ff) ─── */}
        <div
          className="absolute inset-0 w-full h-full bg-[#55b1ff] z-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* ─── Project 1: SummAID (Ice Blue #E3EAF4, z-10) ─── */}
        <div
          ref={p1Ref}
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-16 z-10 will-change-transform will-change-[clip-path]"
          style={{
            backgroundColor: SELECTED_PROJECTS[0].bg,
            clipPath: "circle(0% at 50% 50%)",
            WebkitClipPath: "circle(0% at 50% 50%)",
          }}
        >
          {/* Ambient Ghost Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none opacity-[0.035]"
            aria-hidden="true"
          >
            <span
              className="text-[32vw] font-custom-condensed leading-none tracking-tighter text-[#2d2a26]"
              style={{
                fontFamily: "var(--font-custom-condensed, var(--font-six-caps))",
              }}
            >
              01
            </span>
          </div>

          {/* Top Right: Project Index Readout */}
          <div
            ref={(el) => {
              metaTopRefs.current[0] = el;
            }}
            className="absolute top-8 sm:top-12 md:top-16 right-6 sm:right-12 md:right-16 z-20 will-change-transform"
          >
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-[#2d2a26]/75 select-none">
              {`• SELECTED PROJECT ${SELECTED_PROJECTS[0].index}`}
            </span>
          </div>

          {/* Center: Massive Project Title with Masking Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
            <div className="overflow-hidden py-4 flex items-center justify-center">
              <h2
                ref={(el) => {
                  titleRefs.current[0] = el;
                }}
                className="project-title text-[clamp(4.5rem,15vw,22rem)] leading-[0.8] uppercase font-custom-condensed text-[#2d2a26] tracking-[-0.01em] select-none text-center will-change-transform whitespace-nowrap pointer-events-auto"
                style={{
                  fontFamily:
                    "var(--font-custom-condensed, var(--font-six-caps))",
                }}
              >
                {SELECTED_PROJECTS[0].title}
              </h2>
            </div>
          </div>

          {/* Bottom Left: Project Details Block */}
          <div
            ref={(el) => {
              metaBottomRefs.current[0] = el;
            }}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-12 md:left-16 z-20 max-w-lg will-change-transform select-none"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d2a26]" />
              <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] uppercase text-[#2d2a26]">
                {SELECTED_PROJECTS[0].tagline}
              </p>
            </div>
            <p className="text-sm sm:text-base font-[helvetica,Arial,sans-serif] text-[#2d2a26]/85 leading-relaxed max-w-md">
              {SELECTED_PROJECTS[0].description}
            </p>
            <TactileStackDrawer stack={SELECTED_PROJECTS[0].stack} />
          </div>
        </div>

        {/* ─── Project 2: Privex (Matcha Green #E4F0E8, z-20) ─── */}
        <div
          ref={p2Ref}
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-16 z-20 will-change-transform will-change-[clip-path]"
          style={{
            backgroundColor: SELECTED_PROJECTS[1].bg,
            clipPath: "circle(0% at 50% 50%)",
            WebkitClipPath: "circle(0% at 50% 50%)",
          }}
        >
          {/* Ambient Ghost Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none opacity-[0.035]"
            aria-hidden="true"
          >
            <span
              className="text-[32vw] font-custom-condensed leading-none tracking-tighter text-[#2d2a26]"
              style={{
                fontFamily: "var(--font-custom-condensed, var(--font-six-caps))",
              }}
            >
              02
            </span>
          </div>

          {/* Top Right: Project Index Readout */}
          <div
            ref={(el) => {
              metaTopRefs.current[1] = el;
            }}
            className="absolute top-8 sm:top-12 md:top-16 right-6 sm:right-12 md:right-16 z-20 will-change-transform"
          >
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-[#2d2a26]/75 select-none">
              {`• SELECTED PROJECT ${SELECTED_PROJECTS[1].index}`}
            </span>
          </div>

          {/* Center: Massive Project Title with Masking Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
            <div className="overflow-hidden py-4 flex items-center justify-center">
              <h2
                ref={(el) => {
                  titleRefs.current[1] = el;
                }}
                className="project-title text-[clamp(4.5rem,15vw,22rem)] leading-[0.8] uppercase font-custom-condensed text-[#2d2a26] tracking-[-0.01em] select-none text-center will-change-transform whitespace-nowrap pointer-events-auto"
                style={{
                  fontFamily:
                    "var(--font-custom-condensed, var(--font-six-caps))",
                }}
              >
                {SELECTED_PROJECTS[1].title}
              </h2>
            </div>
          </div>

          {/* Bottom Left: Project Details Block */}
          <div
            ref={(el) => {
              metaBottomRefs.current[1] = el;
            }}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-12 md:left-16 z-20 max-w-lg will-change-transform select-none"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d2a26]" />
              <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] uppercase text-[#2d2a26]">
                {SELECTED_PROJECTS[1].tagline}
              </p>
            </div>
            <p className="text-sm sm:text-base font-[helvetica,Arial,sans-serif] text-[#2d2a26]/85 leading-relaxed max-w-md">
              {SELECTED_PROJECTS[1].description}
            </p>
            <TactileStackDrawer stack={SELECTED_PROJECTS[1].stack} />
          </div>
        </div>

        {/* ─── Project 3: NagarikOne (Peach Orange #F9EAE1, z-30) ─── */}
        <div
          ref={p3Ref}
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-16 z-30 will-change-transform will-change-[clip-path]"
          style={{
            backgroundColor: SELECTED_PROJECTS[2].bg,
            clipPath: "circle(0% at 50% 50%)",
            WebkitClipPath: "circle(0% at 50% 50%)",
          }}
        >
          {/* Ambient Ghost Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none opacity-[0.035]"
            aria-hidden="true"
          >
            <span
              className="text-[32vw] font-custom-condensed leading-none tracking-tighter text-[#2d2a26]"
              style={{
                fontFamily: "var(--font-custom-condensed, var(--font-six-caps))",
              }}
            >
              03
            </span>
          </div>

          {/* Top Right: Project Index Readout */}
          <div
            ref={(el) => {
              metaTopRefs.current[2] = el;
            }}
            className="absolute top-8 sm:top-12 md:top-16 right-6 sm:right-12 md:right-16 z-20 will-change-transform"
          >
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-[#2d2a26]/75 select-none">
              {`• SELECTED PROJECT ${SELECTED_PROJECTS[2].index}`}
            </span>
          </div>

          {/* Center: Massive Project Title with Masking Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
            <div className="overflow-hidden py-4 flex items-center justify-center">
              <h2
                ref={(el) => {
                  titleRefs.current[2] = el;
                }}
                className="project-title text-[clamp(4.5rem,15vw,22rem)] leading-[0.8] uppercase font-custom-condensed text-[#2d2a26] tracking-[-0.01em] select-none text-center will-change-transform whitespace-nowrap pointer-events-auto"
                style={{
                  fontFamily:
                    "var(--font-custom-condensed, var(--font-six-caps))",
                }}
              >
                {SELECTED_PROJECTS[2].title}
              </h2>
            </div>
          </div>

          {/* Bottom Left: Project Details Block */}
          <div
            ref={(el) => {
              metaBottomRefs.current[2] = el;
            }}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-12 md:left-16 z-20 max-w-lg will-change-transform select-none"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d2a26]" />
              <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] uppercase text-[#2d2a26]">
                {SELECTED_PROJECTS[2].tagline}
              </p>
            </div>
            <p className="text-sm sm:text-base font-[helvetica,Arial,sans-serif] text-[#2d2a26]/85 leading-relaxed max-w-md">
              {SELECTED_PROJECTS[2].description}
            </p>
            <TactileStackDrawer stack={SELECTED_PROJECTS[2].stack} />
          </div>
        </div>

        {/* ─── Step 4: Final Exit Transition Layer to Marquee (#F0EFEB Beige, z-40) ─── */}
        <div
          ref={exitWipeRef}
          className="absolute inset-0 w-full h-full z-40 pointer-events-none will-change-[clip-path]"
          style={{
            backgroundColor: "#F0EFEB",
            clipPath: "circle(0% at 50% 50%)",
            WebkitClipPath: "circle(0% at 50% 50%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
});

SelectedProjectsSection.displayName = "SelectedProjectsSection";

export default SelectedProjectsSection;
