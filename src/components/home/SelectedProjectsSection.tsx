"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
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
}

export const SELECTED_PROJECTS: SelectedProjectItem[] = [
  {
    id: "summaid",
    index: "01 / 03",
    title: "SUMMAID",
    tagline: "AI CLINICAL INTELLIGENCE PLATFORM",
    description:
      "Longitudinal medical report summarization engine utilizing RAG architecture.",
    stack: ["FastAPI", "pgvector", "Local LLMs", "React"],
    bg: "#f0efeb",
  },
  {
    id: "privex",
    index: "02 / 03",
    title: "PRIVEX",
    tagline: "VISUAL FIREWALL & MEMORY AGENT",
    description:
      "Privacy-focused local infrastructure with real-time edge detection and hybrid vector-graph pipelines.",
    stack: ["YOLOv8", "EasyOCR", "LangGraph", "FastAPI", "Neo4j"],
    bg: "#ebe9e4",
  },
  {
    id: "nagarikone",
    index: "03 / 03",
    title: "NAGARIKONE",
    tagline: "DECENTRALIZED CIVIC GOVERNANCE",
    description:
      "Civic issue reporting platform engineered with 50-meter geospatial duplicate detection.",
    stack: ["PERN Stack", "React Native", "PostGIS", "Gemini API"],
    bg: "#f3f2ee",
  },
];

export interface SelectedProjectsSectionProps
  extends React.HTMLAttributes<HTMLElement> {}

/**
 * SelectedProjectsSection
 *
 * Cinematic, stark, and isolated presentation of the user's 3 heavyweight flagship projects.
 *
 * Architecture:
 * - Master container with CSS scroll snapping (snap-y snap-mandatory)
 * - Full-screen project wrappers (h-screen w-full snap-start snap-always overflow-hidden)
 * - Top Right: Absolute index readout ("• SELECTED PROJECT 01 / 03")
 * - Center: Massive project title in ultra-condensed Six Caps with GSAP mask reveal (y: "100%" -> "0%")
 * - Bottom Left: Absolute details block with Tagline, Description, and Stack badges
 */
const SelectedProjectsSection = forwardRef<
  HTMLElement,
  SelectedProjectsSectionProps
>((props, forwardedRef) => {
  const containerRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const metaTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaBottomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useImperativeHandle(forwardedRef, () => containerRef.current as HTMLElement);

  // ─── Step 3: GSAP Upward Mask Reveal on Enter ───
  useGSAP(
    () => {
      SELECTED_PROJECTS.forEach((_, idx) => {
        const section = sectionRefs.current[idx];
        const title = titleRefs.current[idx];
        const metaTop = metaTopRefs.current[idx];
        const metaBottom = metaBottomRefs.current[idx];

        if (!section || !title) return;

        // Explicit initial states: title masked below overflow, details faded out
        gsap.set(title, {
          y: "100%",
          force3D: true,
        });

        if (metaTop) {
          gsap.set(metaTop, {
            opacity: 0,
            y: -12,
            force3D: true,
          });
        }

        if (metaBottom) {
          gsap.set(metaBottom, {
            opacity: 0,
            y: 18,
            force3D: true,
          });
        }

        // ScrollTrigger timeline for upward masking reveal
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 35%",
            toggleActions: "play reverse play reverse",
          },
        });

        // 1. Upward masking reveal of giant title
        tl.to(title, {
          y: "0%",
          duration: 1.5,
          ease: "power4.out",
        });

        // 2. Staggered opacity fade-in for metadata
        const metaElements = [metaTop, metaBottom].filter(Boolean);
        if (metaElements.length > 0) {
          tl.to(
            metaElements,
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=1.1"
          );
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="selected-projects"
      {...props}
      className={`relative w-full snap-y snap-mandatory select-none ${
        props.className || ""
      }`}
    >
      {SELECTED_PROJECTS.map((project, idx) => (
        <div
          key={project.id}
          ref={(el) => {
            sectionRefs.current[idx] = el;
          }}
          className="h-screen w-full relative overflow-hidden snap-start snap-always flex flex-col justify-between p-6 sm:p-10 md:p-16 border-b border-[#2d2a26]/10 last:border-b-0"
          style={{ backgroundColor: project.bg }}
        >
          {/* ─── Ambient Ghost Watermark (Deep Editorial Texture) ─── */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none opacity-[0.035]"
            aria-hidden="true"
          >
            <span
              className="text-[32vw] font-custom-condensed leading-none tracking-tighter text-[#2d2a26]"
              style={{
                fontFamily:
                  "var(--font-custom-condensed, var(--font-six-caps))",
              }}
            >
              {`0${idx + 1}`}
            </span>
          </div>

          {/* ─── Top Right: Project Index Readout ─── */}
          <div
            ref={(el) => {
              metaTopRefs.current[idx] = el;
            }}
            className="absolute top-8 sm:top-12 md:top-16 right-6 sm:right-12 md:right-16 z-20 will-change-transform"
          >
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-[#2d2a26]/75 select-none">
              {`• SELECTED PROJECT ${project.index}`}
            </span>
          </div>

          {/* ─── Center: Massive Project Title with Masking Container ─── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
            <div className="overflow-hidden py-4 flex items-center justify-center">
              <h2
                ref={(el) => {
                  titleRefs.current[idx] = el;
                }}
                className="project-title text-[clamp(4.5rem,15vw,22rem)] leading-[0.8] uppercase font-custom-condensed text-[#2d2a26] tracking-[-0.01em] select-none text-center will-change-transform whitespace-nowrap pointer-events-auto"
                style={{
                  fontFamily:
                    "var(--font-custom-condensed, var(--font-six-caps))",
                }}
              >
                {project.title}
              </h2>
            </div>
          </div>

          {/* ─── Bottom Left: Project Details Block (Tagline, Description, Stack) ─── */}
          <div
            ref={(el) => {
              metaBottomRefs.current[idx] = el;
            }}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-12 md:left-16 z-20 max-w-lg will-change-transform select-none"
          >
            {/* Tagline with indicator dot */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d2a26]" />
              <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] uppercase text-[#2d2a26]">
                {project.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base font-[helvetica,Arial,sans-serif] text-[#2d2a26]/85 leading-relaxed max-w-md">
              {project.description}
            </p>

            {/* Stack Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#2d2a26]/15">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#2d2a26]/50 mr-1">
                STACK:
              </span>
              {project.stack.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#2d2a26]/20 bg-[#2d2a26]/[0.03] text-[#2d2a26]/75 hover:border-[#2d2a26]/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
});

SelectedProjectsSection.displayName = "SelectedProjectsSection";

export default SelectedProjectsSection;
