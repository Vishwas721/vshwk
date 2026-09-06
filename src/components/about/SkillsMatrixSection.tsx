"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillItem {
  name: string;
  tag: string;
  highlight: string;
  watermark: string;
  badge: string;
}

interface SkillCategory {
  id: string;
  label: string;
  code: string;
  color: string;
  description: string;
  skills: SkillItem[];
}

const SKILLS_DATA: SkillCategory[] = [
  {
    id: "cat-proficient",
    label: "PROFICIENT",
    code: "01",
    color: "#F9F6F0", // Cream
    description:
      "Core languages, frameworks, and database architectures actively utilized in production web applications and AI systems.",
    skills: [
      {
        name: "REACT 19",
        tag: "CORE FRONTEND",
        highlight: "ACTIONS & CONCURRENCY",
        watermark: "R19",
        badge: "PRODUCTION READY",
      },
      {
        name: "NEXT.JS 15",
        tag: "FULL-STACK WEB",
        highlight: "APP ROUTER & RSC",
        watermark: "N15",
        badge: "CORE ARCHITECTURE",
      },
      {
        name: "POSTGRESQL",
        tag: "RELATIONAL DB",
        highlight: "SCHEMA & OPTIMIZATION",
        watermark: "PG",
        badge: "DATA LAYER",
      },
      {
        name: "EXPRESS.JS",
        tag: "BACKEND API",
        highlight: "MIDDLEWARE & REST",
        watermark: "EXP",
        badge: "API SERVICES",
      },
      {
        name: "NODE.JS",
        tag: "SERVER RUNTIME",
        highlight: "ASYNC IO & EVENT LOOP",
        watermark: "NODE",
        badge: "RUNTIME",
      },
      {
        name: "PYTHON",
        tag: "AI & SYSTEMS",
        highlight: "ML PIPELINES & AUTOMATION",
        watermark: "PY",
        badge: "CORE LANGUAGE",
      },
      {
        name: "FASTAPI",
        tag: "HIGH-PERF API",
        highlight: "ASYNC PYDANTIC SERVICES",
        watermark: "FAST",
        badge: "MICROSERVICES",
      },
    ],
  },
  {
    id: "cat-familiar",
    label: "FAMILIAR",
    code: "02",
    color: "#E6E6FA", // Majestic Pale Lavender
    description:
      "Strong programmatic competencies spanning mobile development, systems programming, and graph-vector intelligence.",
    skills: [
      {
        name: "TYPESCRIPT",
        tag: "TYPE SYSTEMS",
        highlight: "ADVANCED GENERICS & AST",
        watermark: "TS",
        badge: "TYPE SAFETY",
      },
      {
        name: "JAVA",
        tag: "OOP & BACKEND",
        highlight: "DATA STRUCTURES & CONCURRENCY",
        watermark: "JAVA",
        badge: "ENTERPRISE",
      },
      {
        name: "C++",
        tag: "SYSTEMS PROGRAMMING",
        highlight: "MEMORY MANAGEMENT & STL",
        watermark: "C++",
        badge: "PERFORMANCE",
      },
      {
        name: "REACT NATIVE",
        tag: "MOBILE APPS",
        highlight: "CROSS-PLATFORM ENGINEERING",
        watermark: "RN",
        badge: "MOBILE UI",
      },
      {
        name: "NEO4J",
        tag: "GRAPH DATABASE",
        highlight: "CYPHER & KNOWLEDGE GRAPHS",
        watermark: "NEO",
        badge: "GRAPH INTEL",
      },
      {
        name: "PGVECTOR",
        tag: "VECTOR DATABASE",
        highlight: "COSINE SIMILARITY SEARCH",
        watermark: "VEC",
        badge: "EMBEDDINGS",
      },
    ],
  },
  {
    id: "cat-exposure",
    label: "EXPOSURE",
    code: "03",
    color: "#E0F4E8", // Soft Mint / Matcha
    description:
      "Hands-on exploratory depth across computer vision, agentic workflows, geospatial computing, and smart contracts.",
    skills: [
      {
        name: "YOLOV8",
        tag: "OBJECT DETECTION",
        highlight: "REAL-TIME INFERENCE & TRACKING",
        watermark: "YOLO",
        badge: "COMPUTER VISION",
      },
      {
        name: "LANGGRAPH",
        tag: "AGENTIC WORKFLOWS",
        highlight: "CYCLICAL MULTI-AGENT STATE",
        watermark: "GRAPH",
        badge: "AGENTIC AI",
      },
      {
        name: "EASYOCR",
        tag: "TEXT EXTRACTION",
        highlight: "OPTICAL CHARACTER RECOGNITION",
        watermark: "OCR",
        badge: "OCR PIPELINE",
      },
      {
        name: "OPENCV",
        tag: "IMAGE PROCESSING",
        highlight: "FILTERING, TRANSFORMS & MASKS",
        watermark: "CV",
        badge: "CV PIPELINE",
      },
      {
        name: "MEDIAPIPE",
        tag: "ON-DEVICE ML",
        highlight: "HAND & POSE LANDMARKING",
        watermark: "PIPE",
        badge: "VISION ML",
      },
      {
        name: "GOOGLE EARTH ENGINE",
        tag: "GEOSPATIAL AI",
        highlight: "SATELLITE REMOTE SENSING",
        watermark: "GEE",
        badge: "REMOTE SENSING",
      },
      {
        name: "MOVE (APTOS)",
        tag: "SMART CONTRACTS",
        highlight: "RESOURCE-ORIENTED ARCHITECTURE",
        watermark: "MOVE",
        badge: "BLOCKCHAIN",
      },
    ],
  },
];

export interface SkillsMatrixSectionProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * SkillsMatrixSection
 *
 * 3-Tier Interactive Skills Matrix Section for /about
 *
 * Features:
 * - 3 Stacked Full-height (min-h-screen) Categories: Proficient, Familiar, Exposure
 * - Left sticky label pinning category metadata as right column scrolls
 * - CSS Grid of massive ultra-condensed typography (Six Caps)
 * - Majestic GSAP ScrollTrigger Background Color Crossfades:
 *   #F9F6F0 (Cream) -> #E6E6FA (Pale Lavender) -> #E0F4E8 (Soft Mint)
 * - Scattered Floating Visual Cards Hover Effect (legacy M-Trust style):
 *   Two physical glassmorphic cards abruptly scatter around cursor with -8deg and +10deg rotation
 *   and back.out(1.8) spring physics, strictly pointer-events-none.
 */
const SkillsMatrixSection = forwardRef<HTMLElement, SkillsMatrixSectionProps>(
  (props, forwardedRef) => {
    const containerRef = useRef<HTMLElement>(null);
    const cat1Ref = useRef<HTMLDivElement>(null);
    const cat2Ref = useRef<HTMLDivElement>(null);
    const cat3Ref = useRef<HTMLDivElement>(null);

    // Floating scatter cards refs
    const scatterWrapRef = useRef<HTMLDivElement>(null);
    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);

    const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

    // Sync forwardedRef
    useImperativeHandle(forwardedRef, () => containerRef.current as HTMLElement);

    // ─── Step 3: Majestic GSAP Color Crossfades ───
    useGSAP(
      () => {
        if (!containerRef.current || !cat2Ref.current || !cat3Ref.current) return;

        // Set initial background color (Cream)
        gsap.set(containerRef.current, { backgroundColor: "#F9F6F0" });

        // Category 1 -> Category 2 (#F9F6F0 -> #E6E6FA)
        gsap.fromTo(
          containerRef.current,
          { backgroundColor: "#F9F6F0" },
          {
            backgroundColor: "#E6E6FA",
            ease: "none",
            scrollTrigger: {
              trigger: cat2Ref.current,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          }
        );

        // Category 2 -> Category 3 (#E6E6FA -> #E0F4E8)
        gsap.fromTo(
          containerRef.current,
          { backgroundColor: "#E6E6FA" },
          {
            backgroundColor: "#E0F4E8",
            ease: "none",
            scrollTrigger: {
              trigger: cat3Ref.current,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      },
      { scope: containerRef }
    );

    // ─── Step 4: Cursor Tracker for Scattered Floating Cards ───
    useEffect(() => {
      const scatterWrap = scatterWrapRef.current;
      if (!scatterWrap) return;

      const isPointerFine = window.matchMedia("(pointer: fine)").matches;
      if (!isPointerFine) return;

      const xTo = gsap.quickTo(scatterWrap, "x", { duration: 0.22, ease: "power2.out" });
      const yTo = gsap.quickTo(scatterWrap, "y", { duration: 0.22, ease: "power2.out" });

      const handleWindowMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener("mousemove", handleWindowMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleWindowMouseMove);
      };
    }, []);

    // ─── Hover In / Out Handlers for Skill Items ───
    const handleSkillEnter = (skill: SkillItem) => {
      setActiveSkill(skill);

      if (card1Ref.current && card2Ref.current) {
        // Abrupt physical "thrown" card scatter effect (M-Trust style)
        gsap.killTweensOf([card1Ref.current, card2Ref.current]);

        // Card 1: Thrown to top-left (-8deg rotation)
        gsap.fromTo(
          card1Ref.current,
          {
            scale: 0.75,
            opacity: 0,
            rotation: -18,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: -7,
            duration: 0.32,
            ease: "back.out(1.8)",
          }
        );

        // Card 2: Thrown to bottom-right (+10deg rotation with slight stagger)
        gsap.fromTo(
          card2Ref.current,
          {
            scale: 0.75,
            opacity: 0,
            rotation: 24,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 11,
            duration: 0.35,
            delay: 0.04,
            ease: "back.out(1.8)",
          }
        );
      }
    };

    const handleSkillLeave = () => {
      if (card1Ref.current && card2Ref.current) {
        gsap.killTweensOf([card1Ref.current, card2Ref.current]);
        gsap.to([card1Ref.current, card2Ref.current], {
          scale: 0.8,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
          onComplete: () => {
            setActiveSkill(null);
          },
        });
      } else {
        setActiveSkill(null);
      }
    };

    const categoryRefs = [cat1Ref, cat2Ref, cat3Ref];

    return (
      <section
        ref={containerRef}
        id="skills-matrix"
        {...props}
        className={`relative w-full text-[#302c1a] transition-colors will-change-[background-color] select-none ${
          props.className || ""
        }`}
        style={{ backgroundColor: "#F9F6F0" }}
      >
        {/* Anchor for #skills navigation */}
        <div id="skills" className="absolute top-0 pointer-events-none" aria-hidden="true" />

        {/* ─── Step 4: Floating Scatter Cards Overlay (Cursor-Following, strictly pointer-events-none) ─── */}
        <div
          ref={scatterWrapRef}
          className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block will-change-transform"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {activeSkill && (
            <div className="pointer-events-none relative w-0 h-0 select-none">
              {/* Card 1: Top-Left Primary Tech Badge (-7deg rotation) */}
              <div
                ref={card1Ref}
                className="pointer-events-none absolute -top-28 -left-36 w-[200px] bg-white/90 backdrop-blur-md border border-[#302c1a]/15 rounded-[14px] p-4 shadow-[0_22px_45px_rgba(48,44,26,0.18)] text-[#302c1a] origin-bottom-right will-change-transform"
                style={{ transform: "rotate(-7deg)" }}
              >
                <div className="flex items-center justify-between opacity-75">
                  <span className="text-[9px] font-mono tracking-[0.18em] uppercase font-bold">
                    {activeSkill.badge}
                  </span>
                  <span className="text-[12px] leading-none">・</span>
                </div>
                <h4
                  className="mt-2 text-[38px] leading-[0.85] tracking-tight uppercase"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  {activeSkill.name}
                </h4>
                <div className="mt-2 pt-2 border-t border-[#302c1a]/10 flex justify-between items-center text-[10px] font-mono tracking-wider opacity-80 uppercase">
                  <span>{activeSkill.tag}</span>
                  <span className="font-bold">{activeSkill.watermark}</span>
                </div>
              </div>

              {/* Card 2: Bottom-Right Secondary Focus Badge (+11deg rotation) */}
              <div
                ref={card2Ref}
                className="pointer-events-none absolute -bottom-16 -right-32 w-[180px] bg-[#ffd955]/95 backdrop-blur-md border border-[#302c1a]/20 rounded-[12px] p-3.5 shadow-[0_18px_38px_rgba(48,44,26,0.14)] text-[#302c1a] origin-top-left will-change-transform"
                style={{ transform: "rotate(11deg)" }}
              >
                <span className="block text-[9px] font-mono tracking-[0.15em] opacity-80 uppercase font-bold">
                  FOCUS DOMAIN
                </span>
                <p className="mt-1 text-[11px] font-[helvetica,Arial,sans-serif] font-bold leading-tight uppercase">
                  {activeSkill.highlight}
                </p>
                <div className="mt-2 text-right">
                  <span
                    className="block text-[42px] leading-[0.75] opacity-40 uppercase"
                    style={{ fontFamily: "var(--font-six-caps)" }}
                  >
                    {activeSkill.watermark}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Step 1 & 2: 3 Full-Height Stacked Categories ─── */}
        {SKILLS_DATA.map((cat, idx) => (
          <div
            key={cat.id}
            ref={categoryRefs[idx]}
            className="relative w-full min-h-screen px-6 sm:px-10 lg:px-[56px] py-20 lg:py-32 flex flex-col lg:flex-row lg:items-start justify-between gap-12 lg:gap-16 border-b border-[#302c1a]/10 last:border-b-0"
          >
            {/* ─── Left Column (Sticky Label) ─── */}
            <div className="lg:w-[240px] xl:w-[280px] shrink-0 lg:sticky lg:top-[140px] self-start">
              <span className="block text-[32px] md:text-[36px] leading-[0.79] indent-[-2px] text-[#302c1a] font-[helvetica,Arial,sans-serif]">
                ・
              </span>
              <div className="mt-2 text-[11px] font-mono tracking-[0.2em] uppercase text-[#302c1a]/60">
                {`0${idx + 1} / CATEGORY`}
              </div>
              <h2 className="mt-1 text-[24px] sm:text-[28px] font-bold font-mono tracking-[0.08em] uppercase text-[#302c1a]">
                {cat.label}
              </h2>
              <p className="mt-4 text-[13px] font-[helvetica,Arial,sans-serif] text-[#302c1a]/75 leading-[1.6] max-w-[240px]">
                {cat.description}
              </p>
              <div className="mt-8 hidden lg:block">
                <span className="inline-block px-3 py-1 rounded-full border border-[#302c1a]/20 text-[10px] font-mono tracking-[0.15em] uppercase text-[#302c1a]/70">
                  {`${cat.skills.length} TECHNOLOGIES`}
                </span>
              </div>
            </div>

            {/* ─── Right Column (The Matrix Grid) ─── */}
            <div className="flex-1 w-full max-w-[1100px] pr-4 sm:pr-12 md:pr-20 lg:pr-28">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="group relative cursor-pointer select-none py-5 border-b border-[#302c1a]/15 hover:border-[#302c1a]/70 transition-all duration-300"
                    onMouseEnter={() => handleSkillEnter(skill)}
                    onMouseLeave={handleSkillLeave}
                  >
                    {/* Index & Tag */}
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.15em] uppercase text-[#302c1a]/50 group-hover:text-[#302c1a]/90 transition-colors mb-2">
                      <span>{`0${sIdx + 1}`}</span>
                      <span>{skill.tag}</span>
                    </div>

                    {/* Ultra-Condensed Skill Title in Six Caps */}
                    <h3
                      className="text-[clamp(3.5rem,5.5vw,5.8rem)] leading-[0.84] tracking-[0.01em] uppercase text-[#302c1a] group-hover:translate-x-1.5 transition-transform duration-200"
                      style={{ fontFamily: "var(--font-six-caps)" }}
                    >
                      {skill.name}
                    </h3>

                    {/* Bottom Status Dot & Highlight */}
                    <div className="flex items-center gap-2 mt-3 text-[11px] font-mono tracking-wider text-[#302c1a]/65 group-hover:text-[#302c1a] transition-colors">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#302c1a]/40 group-hover:bg-[#302c1a] transition-colors" />
                      <span className="text-[10px] uppercase font-medium truncate">
                        {skill.highlight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }
);

SkillsMatrixSection.displayName = "SkillsMatrixSection";

export default SkillsMatrixSection;
