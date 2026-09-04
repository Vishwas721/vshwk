"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { usePickupStore, type ProjectData } from "@/store/usePickupStore";
import { usePickupHijack } from "@/hooks/usePickupHijack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

// Outgoing background color of the preceding About section
const ABOUT_BG_COLOR = "#55b1ff";

/**
 * ProjectsPickupSection
 *
 * Implements the dynamic "Gooey Bubble Collision" transition:
 * 1. Initial unengaged state matches AboutSection background (#55b1ff), eliminating hard-cut splits.
 * 2. On hijack lock: Host bubble (#55b1ff) and Invader bubble (Privex: #F9F6F0) collide inside
 *    an SVG gooey filter (<feGaussianBlur> + <feColorMatrix>), squishing and morphing like liquid.
 * 3. The incoming bubble surges and explodes to envelop the entire screen.
 * 4. Bidirectional project transitions (Privex <-> NagarikOne <-> SummAID) trigger gooey liquid blasts.
 */
export default function ProjectsPickupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const baseBgRef = useRef<HTMLDivElement>(null);
  const gooeyContainerRef = useRef<HTMLDivElement>(null);
  const hostBubbleRef = useRef<HTMLDivElement>(null);
  const invaderBubbleRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const numberBadgeRef = useRef<HTMLDivElement>(null);

  // Connect two-way scroll hijack hook
  usePickupHijack(sectionRef);

  const isCurrent = usePickupStore((s) => s.isCurrent);
  const currentNumber = usePickupStore((s) => s.currentNumber);
  const direction = usePickupStore((s) => s.direction);
  const projects = usePickupStore((s) => s.projects);

  const activeProject = projects[currentNumber - 1] || projects[0];
  const [displayedProject, setDisplayedProject] = useState<ProjectData>(activeProject);

  const prevNumberRef = useRef<number>(currentNumber);
  const hasInitializedRef = useRef<boolean>(false);
  const collisionTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Execute Gooey Bubble Collision & Explosion
  const playGooeyCollision = (
    hostColor: string,
    invaderColor: string,
    onBlastCovered: () => void,
    isInitialEntry: boolean = false
  ) => {
    const hostEl = hostBubbleRef.current;
    const invaderEl = invaderBubbleRef.current;
    const baseBgEl = baseBgRef.current;
    if (!hostEl || !invaderEl || !baseBgEl) return;

    if (collisionTimelineRef.current) {
      collisionTimelineRef.current.kill();
    }

    const viewportHypot = Math.hypot(window.innerWidth, window.innerHeight);
    // 130px base diameter: scale factor to envelop every corner of the viewport
    const blastTargetScale = (viewportHypot * 1.45) / 130;

    // Set colors
    hostEl.style.backgroundColor = hostColor;
    invaderEl.style.backgroundColor = invaderColor;

    const isForward = direction !== "prev";
    const startY = isForward ? -260 : 260;

    const tl = gsap.timeline({
      onComplete: () => {
        baseBgEl.style.backgroundColor = invaderColor;
        gsap.set([hostEl, invaderEl], {
          scale: 0,
          scaleX: 1,
          scaleY: 1,
          x: 0,
          y: 0,
        });
        onBlastCovered();
      },
    });

    // Initial setup: host bubble is at center, invader bubble hovers above/below
    tl.set(hostEl, {
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      opacity: 1,
    });
    tl.set(invaderEl, {
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: startY,
      opacity: 1,
    });

    // 1. Approach: Invader bubble swoops in towards host bubble
    tl.to(invaderEl, {
      y: 0,
      duration: 0.45,
      ease: "power2.in",
    });
    tl.to(
      hostEl,
      {
        y: isForward ? -25 : 25,
        duration: 0.45,
        ease: "power1.inOut",
      },
      "<"
    );

    // 2. Contact & Liquid Squash (Gooey filter creates organic meniscus connection)
    tl.to(
      [hostEl, invaderEl],
      {
        scaleX: 1.38,
        scaleY: 0.72,
        duration: 0.12,
        ease: "power1.out",
      }
    );

    // 3. Elastic Rebound
    tl.to(
      [hostEl, invaderEl],
      {
        scaleX: 0.88,
        scaleY: 1.18,
        duration: 0.16,
        ease: "sine.inOut",
      }
    );

    // 4. Explosion: Invader bubble explodes outward to cover viewport
    tl.to(
      invaderEl,
      {
        scale: blastTargetScale,
        scaleX: blastTargetScale,
        scaleY: blastTargetScale,
        duration: 0.85,
        ease: "power3.out",
      },
      "-=0.04"
    );

    // Host bubble dissolves into the blast
    tl.to(
      hostEl,
      {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "<"
    );

    collisionTimelineRef.current = tl;
  };

  // Trigger collision on initial entry or project step
  useEffect(() => {
    // Initial entry from About into Project 1 (Privex)
    if (!hasInitializedRef.current && isCurrent) {
      hasInitializedRef.current = true;

      playGooeyCollision(
        ABOUT_BG_COLOR, // Host is the About section blue
        activeProject.color, // Invader is Privex soft cream
        () => {
          setDisplayedProject(activeProject);

          // Animate in initial typography
          if (titleRef.current) {
            gsap.fromTo(
              titleRef.current,
              { yPercent: 60, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out" }
            );
          }
          if (categoryRef.current && descRef.current && numberBadgeRef.current) {
            gsap.fromTo(
              [categoryRef.current, descRef.current, numberBadgeRef.current],
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" }
            );
          }
        },
        true
      );
      prevNumberRef.current = currentNumber;
      return;
    }

    // Step transitions (Privex <-> NagarikOne <-> SummAID)
    if (prevNumberRef.current !== currentNumber && isCurrent) {
      const prevProject = projects[prevNumberRef.current - 1] || projects[0];
      const isForward = direction !== "prev";

      // Animate out old text
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: isForward ? -60 : 60,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      playGooeyCollision(
        prevProject.color, // Host is outgoing project color
        activeProject.color, // Invader is incoming project color
        () => {
          setDisplayedProject(activeProject);

          // Animate in new text
          if (titleRef.current) {
            gsap.fromTo(
              titleRef.current,
              { yPercent: isForward ? 60 : -60, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
            );
          }
          if (categoryRef.current && descRef.current && numberBadgeRef.current) {
            gsap.fromTo(
              [categoryRef.current, descRef.current, numberBadgeRef.current],
              { opacity: 0, y: isForward ? 15 : -15 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }
            );
          }
        }
      );

      prevNumberRef.current = currentNumber;
    }
  }, [activeProject, currentNumber, direction, isCurrent, projects]);

  return (
    <section
      ref={sectionRef}
      id="pickup-section"
      className="relative w-full min-h-screen h-screen overflow-hidden select-none z-10"
      style={{
        // Initially match AboutSection (#55b1ff) to prevent any hard-cut horizontal line
        backgroundColor: isCurrent ? displayedProject.color : ABOUT_BG_COLOR,
      }}
    >
      {/* ─── Inline SVG Gooey Filter ─── */}
      <svg
        className="pointer-events-none absolute w-0 h-0 overflow-hidden"
        aria-hidden="true"
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ─── Persistent Base Background Color Plane ─── */}
      <div
        ref={baseBgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundColor: isCurrent ? displayedProject.color : ABOUT_BG_COLOR,
          transition: "background-color 0.15s ease-out",
        }}
      />

      {/* ─── Gooey Liquid Collision Layer ─── */}
      <div
        ref={gooeyContainerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0"
        style={{ filter: "url(#gooey)" }}
      >
        {/* Host/Outgoing Bubble */}
        <div
          ref={hostBubbleRef}
          className="absolute rounded-full will-change-transform"
          style={{
            width: "140px",
            height: "140px",
            transform: "scale(0)",
            transformOrigin: "center center",
            backgroundColor: ABOUT_BG_COLOR,
          }}
        />

        {/* Invader/Incoming Bubble */}
        <div
          ref={invaderBubbleRef}
          className="absolute rounded-full will-change-transform"
          style={{
            width: "130px",
            height: "130px",
            transform: "scale(0)",
            transformOrigin: "center center",
            backgroundColor: activeProject.color,
          }}
        />
      </div>

      {/* ─── Top-Right Section Counter & Progress ─── */}
      <div className="absolute top-[65px] md:top-[70px] right-6 sm:right-10 md:right-[155px] z-20 pointer-events-none text-right font-[helvetica,Arial,sans-serif]">
        <div
          ref={numberBadgeRef}
          className="flex items-center justify-end gap-2 text-xs md:text-sm tracking-[0.18em] uppercase transition-colors duration-300 font-semibold"
          style={{
            color: displayedProject.textColor,
            opacity: isCurrent ? 1 : 0,
          }}
        >
          <span className="text-xl leading-none font-bold">・</span>
          <span>SELECTED</span>
          <span>PROJECT</span>
          <span className="font-mono text-sm md:text-base font-bold">
            0{displayedProject.num}
          </span>
          <span className="opacity-40 font-mono text-xs">/ 03</span>
        </div>
      </div>

      {/* ─── Center Giant Display Project Title in Six Caps ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4">
        <div className="overflow-hidden py-4">
          <h2
            ref={titleRef}
            className="text-[clamp(5.5rem,21vmin,19rem)] leading-[0.88] tracking-[-0.01em] text-center uppercase select-none will-change-transform transition-colors duration-300 drop-shadow-sm"
            style={{
              fontFamily: "var(--font-six-caps)",
              color: displayedProject.textColor,
              opacity: isCurrent ? 1 : 0,
            }}
          >
            {displayedProject.title}
          </h2>
        </div>
      </div>

      {/* ─── Bottom-Left Category & Project Brief ─── */}
      <div className="absolute bottom-10 md:bottom-[86px] left-6 sm:left-10 md:left-12 z-20 pointer-events-none max-w-[340px] md:max-w-md">
        <div>
          <span
            ref={categoryRef}
            className="block text-xs md:text-sm font-bold tracking-wider mb-2 uppercase transition-colors duration-300"
            style={{
              color: displayedProject.textColor,
              opacity: isCurrent ? 1 : 0,
            }}
          >
            {displayedProject.category}
          </span>
          <p
            ref={descRef}
            className="text-xs md:text-sm font-[helvetica,Arial,sans-serif] leading-relaxed tracking-wide transition-colors duration-300 opacity-85"
            style={{
              color: displayedProject.textColor,
              opacity: isCurrent ? 1 : 0,
            }}
          >
            {displayedProject.desc}
          </p>
        </div>
      </div>

      {/* ─── Interactive Click Target / Project Preview Button ─── */}
      <button
        type="button"
        aria-label={`View ${displayedProject.title}`}
        className="absolute inset-0 w-full h-full z-30 cursor-pointer bg-transparent border-0 outline-none"
        onClick={() => {
          // Navigation or detail drawer trigger
        }}
      />
    </section>
  );
}
