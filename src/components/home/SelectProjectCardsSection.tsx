"use client";

import React, { useRef } from "react";
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
  rotate: number;
  desktopPos: { top: string; left?: string; right?: string };
  mobilePos: { top: string; left?: string; right?: string };
}

export const PROJECT_CARDS: ProjectCardItem[] = [
  {
    id: "privex",
    number: "01",
    category: "AI SECURITY & PRIVACY",
    name: "PRIVEX FIREWALL",
    title: "PRIVX",
    desc: "Privacy-focused local visual firewall and memory agent with edge YOLOv8 detection.",
    tech: "YOLOv8 ・ LangGraph ・ FastAPI ・ Neo4j",
    rotate: -3.5,
    desktopPos: { top: "3%", left: "50%" },
    mobilePos: { top: "2%", left: "6%" },
  },
  {
    id: "nagarikone",
    number: "02",
    category: "CIVIC GOVERNANCE",
    name: "NAGARIKONE PORTAL",
    title: "NAGRK",
    desc: "Civic issue reporting platform with 50m geospatial duplicate detection.",
    tech: "PERN Stack ・ React Native ・ PostGIS",
    rotate: 4,
    desktopPos: { top: "17%", left: "14%" },
    mobilePos: { top: "16%", right: "6%" },
  },
  {
    id: "summaid",
    number: "03",
    category: "CLINICAL INTELLIGENCE",
    name: "SUMMAID HEALTH",
    title: "SUMAID",
    desc: "AI-powered clinical intelligence platform for medical records summarization.",
    tech: "FastAPI ・ pgvector ・ Local LLMs",
    rotate: -2.5,
    desktopPos: { top: "31%", left: "54%" },
    mobilePos: { top: "30%", left: "6%" },
  },
  {
    id: "prism",
    number: "04",
    category: "FINTECH & INSURANCE",
    name: "PRISM REVIEW",
    title: "PRISM",
    desc: "AI prior authorization review platform with real-time audit verification.",
    tech: "Azure Document AI ・ OpenAI ・ React",
    rotate: 3.5,
    desktopPos: { top: "45%", left: "16%" },
    mobilePos: { top: "44%", right: "6%" },
  },
  {
    id: "gesto",
    number: "05",
    category: "ACCESSIBILITY & VISION",
    name: "GESTO TRANSLATOR",
    title: "GESTO",
    desc: "Real-time sign language to code converter leveraging geometric skeletal tracking.",
    tech: "Python ・ MediaPipe ・ OpenCV",
    rotate: -4,
    desktopPos: { top: "59%", left: "52%" },
    mobilePos: { top: "58%", left: "6%" },
  },
  {
    id: "regenex",
    number: "06",
    category: "BIOINFORMATICS & GENOMICS",
    name: "REGENEX GRAPH",
    title: "REGENX",
    desc: "Graph neural network platform for drug repurposing and rare diseases.",
    tech: "PyTorch Geometric ・ Neo4j",
    rotate: 3,
    desktopPos: { top: "73%", left: "18%" },
    mobilePos: { top: "72%", right: "6%" },
  },
  {
    id: "archive",
    number: "07",
    category: "LAB & EXPERIMENTS",
    name: "CODEPEN ARCHIVE",
    title: "ARCVE",
    desc: "Dynamic collection of creative coding experiments, WebGL shaders, and prototypes.",
    tech: "Three.js ・ WebGL ・ GLSL ・ Canvas 2D",
    rotate: -2.5,
    desktopPos: { top: "87%", left: "48%" },
    mobilePos: { top: "86%", left: "8%" },
  },
];

const MARQUEE_TEXT = "MAINLY A SELECTION OF PROJECTS THAT I HAVE FOCUSED ON. — ";

/**
 * SelectProjectCardsSection
 *
 * Implements:
 * 1. Dual-line continuous infinite marquee loop:
 *    - Continuous auto-drift at baseline speed 1.
 *    - Line 1 drifts LEFT, Line 2 drifts RIGHT.
 *    - Dynamic timeScale modulation linked to vertical scroll velocity via ScrollTrigger.
 *    - Thin dark divider lines above, between, and below marquee text rows.
 * 2. Top metadata header safely padded away from fixed custom scrollbar.
 * 3. Scattered floating project cards layout with explicit canvas height to prevent card stacking.
 */
export default function SelectProjectCardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const cardsAreaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Step 3 & Step 4: Kinetic Liquid Drop Splash & Shockwave refs
  const splashWipeRef = useRef<HTMLDivElement>(null);
  const splashRingRef = useRef<HTMLDivElement>(null);
  const darkUnderlayRef = useRef<HTMLDivElement>(null);
  const cardSurfaceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const section = sectionRef.current;
      const splashWipe = splashWipeRef.current;
      const splashRing = splashRingRef.current;
      const darkUnderlay = darkUnderlayRef.current;
      if (!line1 || !line2 || !section) return;

      // Initial states for Splash Wipe and Shockwave elements
      gsap.set(splashWipe, {
        scaleX: 0,
        scaleY: 0,
        transformOrigin: "50% 0%",
        force3D: true,
      });

      gsap.set(splashRing, {
        scale: 0.1,
        opacity: 0,
        transformOrigin: "50% 0%",
        force3D: true,
      });

      gsap.set(darkUnderlay, {
        opacity: 1,
      });

      // ─── 1. Continuous TimeScale Dual Marquee ───
      // Line 1: moves continuously to the LEFT (xPercent: -50)
      const marqueeTween1 = gsap.to(line1, {
        xPercent: -50,
        repeat: -1,
        duration: 15,
        ease: "none",
      });
      // Offset into repeat zone so reverse playback never hits time 0 wall
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
          const targetTimeScale = 1 + (velocity / 100); // Base speed + scroll boost

          // Smoothly animate timeScale to target, then back to 1 when scrolling stops
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

      // ─── 2. Floating Cards Subtle Scroll Parallax ───
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const yDrift = (idx % 2 === 0 ? -1 : 1) * 60;
        gsap.fromTo(
          card,
          { y: -yDrift },
          {
            y: yDrift,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // ─── 3. Splash Wipe & Kinetic Shockwave (Steps 3 & 4) ───
      let hasShockwaved = false;

      ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        onEnter: () => {
          if (hasShockwaved) return;
          hasShockwaved = true;

          // Step 3: The Splash Wipe (expanding oval wipes screen into #f0efeb)
          gsap.fromTo(
            splashWipe,
            { scaleX: 0, scaleY: 0 },
            {
              scaleX: 1,
              scaleY: 1,
              duration: 0.85,
              ease: "power3.out",
              force3D: true,
            }
          );

          // Impact ripple ring in mint (#D8F3DC)
          gsap.fromTo(
            splashRing,
            { scale: 0.15, opacity: 1 },
            {
              scale: 4.8,
              opacity: 0,
              duration: 0.68,
              ease: "power2.out",
              force3D: true,
            }
          );

          // Seamlessly dissolve dark underlay as splash expands
          gsap.to(darkUnderlay, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });

          // Step 4: The Kinetic Shockwave (elastic physical bounce on cards)
          const validSurfaces = cardSurfaceRefs.current.filter(Boolean);
          if (validSurfaces.length > 0) {
            gsap.fromTo(
              validSurfaces,
              { y: 0 },
              {
                y: -32,
                duration: 0.16,
                ease: "power2.out",
                stagger: {
                  amount: 0.18,
                  from: "start",
                },
                onComplete: () => {
                  gsap.to(validSurfaces, {
                    y: 0,
                    duration: 1.25,
                    ease: "elastic.out(1.15, 0.35)",
                    stagger: {
                      amount: 0.16,
                      from: "start",
                    },
                  });
                },
              }
            );
          }
        },
        onLeaveBack: () => {
          hasShockwaved = false;
          gsap.set(splashWipe, { scaleX: 0, scaleY: 0 });
          gsap.set(splashRing, { scale: 0.1, opacity: 0 });
          gsap.set(darkUnderlay, { opacity: 1 });
          const validSurfaces = cardSurfaceRefs.current.filter(Boolean);
          gsap.set(validSurfaces, { y: 0 });
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
      className="relative w-full bg-[#f0efeb] text-[#302c1a] pt-28 md:pt-36 pb-32 overflow-hidden z-10 select-none"
    >
      {/* ─── Dark Underlay (Seamless continuation from exit of pinned section) ─── */}
      <div
        ref={darkUnderlayRef}
        className="absolute inset-0 bg-[#302c1a] pointer-events-none z-0 will-change-transform"
      />

      {/* ─── Step 3: Expanding Splash Wipe Oval (Anchor at top center) ─── */}
      <div
        ref={splashWipeRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-[1] rounded-full bg-[#f0efeb] will-change-transform"
        style={{
          width: "250vmax",
          height: "250vmax",
          transformOrigin: "50% 0%",
        }}
      />

      {/* ─── Splash Impact Ripple Ring (Mint #D8F3DC) ─── */}
      <div
        ref={splashRingRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#D8F3DC] shadow-[0_0_25px_rgba(216,243,220,0.85)] pointer-events-none z-[2] will-change-transform"
        style={{
          width: "180px",
          height: "90px",
          transformOrigin: "50% 0%",
        }}
      />

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

      {/* ─── Scattered Floating Cards Canvas (Explicit Height to Prevent Stacking) ─── */}
      <div
        ref={cardsAreaRef}
        className="relative z-10 w-full h-[3200px] md:h-[2600px] min-h-[3200px] md:min-h-[2600px] mt-16 md:mt-24 px-4 sm:px-8"
      >
        <div className="relative w-full h-full max-w-[1400px] mx-auto">
          {PROJECT_CARDS.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="project-card-item absolute will-change-transform pointer-events-auto"
              style={
                {
                  "--top-m": card.mobilePos.top,
                  "--left-m": card.mobilePos.left ?? "auto",
                  "--right-m": card.mobilePos.right ?? "auto",
                  "--top-d": card.desktopPos.top,
                  "--left-d": card.desktopPos.left ?? "auto",
                  "--right-d": card.desktopPos.right ?? "auto",
                } as React.CSSProperties
              }
            >
              {/* Card Surface */}
              <div
                ref={(el) => {
                  cardSurfaceRefs.current[idx] = el;
                }}
                className="project-card-surface group relative w-[240px] sm:w-[270px] md:w-[293px] h-[340px] sm:h-[370px] md:h-[400px] rounded-[14px] p-[20px_16px] md:p-[28px_18px] bg-white text-[#302c1a] shadow-[0_20px_50px_rgba(48,44,26,0.11)] hover:shadow-[0_30px_70px_rgba(48,44,26,0.22)] transition-all duration-300 ease-out hover:scale-[1.03] select-none flex flex-col justify-between overflow-hidden cursor-pointer will-change-transform"
                style={{
                  transform: `rotate(${card.rotate}deg)`,
                }}
              >
                {/* Header: Dot & Category */}
                <div>
                  <span className="block text-[30px] md:text-[36px] leading-[0.79] font-bold text-[#302c1a] indent-[-2px]">
                    ・
                  </span>
                  <span className="block font-mono text-[10px] tracking-[0.2em] text-[#302c1a]/50 uppercase mt-2">
                    {card.number} / 07
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
