"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectCardItem {
  id: string;
  number: string;
  category: string;
  name: string;
  title: string;
  desc: string;
  tech: string;
  top: string;
  left: string;
  rotate: number;
  posClass: string;
}

export const PROJECT_CARDS: ProjectCardItem[] = [
  {
    id: "prism",
    number: "01",
    category: "AI PRIOR AUTHORIZATION",
    name: "PRISM REVIEW",
    title: "PRISM",
    desc: "AI prior authorization review platform with real-time audit verification.",
    tech: "Azure Document AI ・ OpenAI ・ React",
    top: "10%",
    left: "10%",
    rotate: -4,
    posClass: "top-[10%] left-[10%]",
  },
  {
    id: "gesto",
    number: "02",
    category: "REAL-TIME SIGN TO CODE",
    name: "GESTO TRANSLATOR",
    title: "GESTO",
    desc: "Real-time sign language to code converter leveraging geometric skeletal tracking.",
    tech: "Python ・ MediaPipe ・ OpenCV",
    top: "25%",
    left: "55%",
    rotate: 3,
    posClass: "top-[25%] left-[55%]",
  },
  {
    id: "regenex",
    number: "03",
    category: "RARE DISEASE GRAPH ML",
    name: "REGENEX GRAPH",
    title: "REGENX",
    desc: "Graph neural network platform for drug repurposing and rare diseases.",
    tech: "PyTorch Geometric ・ Neo4j",
    top: "45%",
    left: "15%",
    rotate: -2,
    posClass: "top-[45%] left-[15%]",
  },
  {
    id: "parichay",
    number: "04",
    category: "DECENTRALIZED IDENTITY",
    name: "PROJECT PARICHAY",
    title: "PRCHY",
    desc: "Decentralized self-sovereign identity attestation protocol with verifiable credential proofs.",
    tech: "Aptos ・ Move Smart Contracts",
    top: "60%",
    left: "50%",
    rotate: 5,
    posClass: "top-[60%] left-[50%]",
  },
];

const MARQUEE_TEXT = "MAINLY A SELECTION OF PROJECTS THAT I HAVE FOCUSED ON. — ";

/**
 * FloatingProjectsSection
 *
 * Implements:
 * 1. Dual-line continuous infinite marquee loop:
 *    - Continuous auto-drift at baseline speed.
 *    - Line 1 drifts LEFT, Line 2 drifts RIGHT.
 *    - Dynamic timeScale modulation linked to vertical scroll velocity via ScrollTrigger.
 *    - Thin dark divider lines above, between, and below marquee text rows.
 * 2. Top metadata header safely padded away from fixed custom scrollbar.
 * 3. Pure Free Drag Playground (Zero Glitch / Teleporting):
 *    - Massive 200vh height (min-h-[200vh] w-full relative overflow-hidden pb-40).
 *    - Unconstrained free drag with dragMomentum={false} for 1:1 cursor tracking.
 *    - whileHover sets rotate: 0 and scale: 1.05 to straighten cards out when grabbed.
 *    - Initial formation clustered in upper/mid section so bottom card never touches the footer:
 *        Card 1 (PRISM):    top-[10%] left-[10%] rotate-[-4deg]
 *        Card 2 (GESTO):    top-[25%] left-[55%] rotate-[3deg]
 *        Card 3 (REGENEX):  top-[45%] left-[15%] rotate-[-2deg]
 *        Card 4 (PARICHAY): top-[60%] left-[50%] rotate-[5deg]
 */
export default function FloatingProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const section = sectionRef.current;
      if (!line1 || !line2 || !section) return;

      // ─── Continuous TimeScale Dual Marquee ───
      // Line 1: moves continuously to the LEFT (xPercent: -50)
      const marqueeTween1 = gsap.to(line1, {
        xPercent: -50,
        repeat: -1,
        duration: 15,
        ease: "none",
      });
      marqueeTween1.totalTime(marqueeTween1.duration() * 100);

      // Line 2: moves continuously to the RIGHT (-50% to 0%)
      const marqueeTween2 = gsap.fromTo(
        line2,
        { xPercent: -50 },
        {
          xPercent: 0,
          repeat: -1,
          duration: 15,
          ease: "none",
        }
      );
      marqueeTween2.totalTime(marqueeTween2.duration() * 100);

      // Scroll velocity dynamically drives timeScale and direction
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const targetTimeScale = 1 + velocity / 100;

          gsap.to([marqueeTween1, marqueeTween2], {
            timeScale: targetTimeScale,
            duration: 0.5,
            overwrite: true,
            onComplete: () => {
              gsap.to([marqueeTween1, marqueeTween2], {
                timeScale: 1,
                duration: 0.5,
              });
            },
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="selected-projects"
      aria-label="Selected Projects Gallery"
      className="relative w-full bg-[#f0efeb] text-[#302c1a] pt-24 md:pt-32 pb-40 overflow-hidden z-10 select-none"
    >
      {/* ─── Top Read-Area Metadata Badge (Clearance for Fixed Scrollbar) ─── */}
      <div className="relative z-10 flex items-center justify-end pr-24 sm:pr-28 md:pr-36 pl-6 mb-6 md:mb-8 text-right font-[helvetica,Arial,sans-serif]">
        <div className="flex items-center gap-2 text-xs md:text-sm tracking-[0.2em] uppercase font-semibold text-[#302c1a]">
          <span className="text-xl leading-none font-bold">・</span>
          <span>SELECTED</span>
          <span>PROJECTS</span>
        </div>
      </div>

      {/* ─── Dual-Line Continuous Marquee with Thin Dark Dividers ─── */}
      <div ref={marqueeContainerRef} className="relative z-10 w-full overflow-hidden">
        {/* Marquee Line 1 (Continuous Left Drift + Borders Above and Between) */}
        <div className="overflow-hidden w-full whitespace-nowrap py-2 sm:py-3.5 border-t border-b border-[#2d2a26]">
          <div ref={line1Ref} className="flex w-max will-change-transform">
            <div className="flex shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block text-[clamp(4.2rem,11.2vw,11.2rem)] leading-[0.88] uppercase tracking-[-0.01em] text-[#302c1a] px-4 md:px-8 select-none"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  {MARQUEE_TEXT}
                </span>
              ))}
            </div>
            <div className="flex shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={`dup-${i}`}
                  className="inline-block text-[clamp(4.2rem,11.2vw,11.2rem)] leading-[0.88] uppercase tracking-[-0.01em] text-[#302c1a] px-4 md:px-8 select-none"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  {MARQUEE_TEXT}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee Line 2 (Continuous Right Drift + Border Below) */}
        <div className="overflow-hidden w-full whitespace-nowrap py-2 sm:py-3.5 border-b border-[#2d2a26]">
          <div ref={line2Ref} className="flex w-max will-change-transform">
            <div className="flex shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block text-[clamp(4.2rem,11.2vw,11.2rem)] leading-[0.88] uppercase tracking-[-0.01em] text-[#302c1a] px-4 md:px-8 select-none"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  {MARQUEE_TEXT}
                </span>
              ))}
            </div>
            <div className="flex shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={`dup-${i}`}
                  className="inline-block text-[clamp(4.2rem,11.2vw,11.2rem)] leading-[0.88] uppercase tracking-[-0.01em] text-[#302c1a] px-4 md:px-8 select-none"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  {MARQUEE_TEXT}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Massive 200vh Free Drag Canvas (No teleports, endless room) ─── */}
      <div className="relative z-10 w-full min-h-[200vh] h-[200vh] overflow-hidden mt-8 md:mt-12">
        {PROJECT_CARDS.map((card) => (
          <motion.div
            key={card.id}
            drag
            dragMomentum={false}
            initial={{ rotate: card.rotate }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 50, cursor: "grab" }}
            whileTap={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
            className={`absolute select-none will-change-transform ${card.posClass}`}
            style={{
              top: card.top,
              left: card.left,
            }}
          >
            {/* Card Surface */}
            <div className="project-card-surface group relative w-[250px] sm:w-[275px] md:w-[295px] h-[350px] sm:h-[375px] md:h-[405px] rounded-[14px] p-[20px_16px] md:p-[28px_18px] bg-white text-[#302c1a] shadow-[0_20px_50px_rgba(48,44,26,0.11)] hover:shadow-[0_30px_70px_rgba(48,44,26,0.22)] transition-shadow duration-300 ease-out select-none flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing">
              {/* Header: Dot & Category */}
              <div>
                <span className="block text-[30px] md:text-[36px] leading-[0.79] font-bold text-[#302c1a] indent-[-2px]">
                  ・
                </span>
                <span className="block font-mono text-[10px] tracking-[0.2em] text-[#302c1a]/50 uppercase mt-2">
                  {card.number} / 04
                </span>
                <h3 className="text-xs md:text-base font-sans font-bold uppercase tracking-tight mt-1 text-[#302c1a] leading-tight">
                  {card.category}
                </h3>
              </div>

              {/* Description & Tech Stack */}
              <div className="max-w-[215px]">
                <p className="text-[11px] sm:text-[12px] font-sans text-[#302c1a]/80 leading-[1.35] tracking-[0.02em]">
                  {card.desc}
                </p>
                <span className="block mt-2 font-mono text-[9px] sm:text-[10px] text-[#302c1a]/50 uppercase tracking-wider">
                  {card.tech}
                </span>
              </div>

              {/* Bottom Six Caps Title */}
              <div className="w-full">
                <span
                  className="block text-[72px] sm:text-[88px] md:text-[110px] leading-[0.82] uppercase select-none tracking-[-0.01em] text-[#302c1a] transition-transform duration-300 group-hover:scale-105 origin-left"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  {card.title}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
