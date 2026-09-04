"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { usePickupStore, type ProjectData } from "@/store/usePickupStore";
import { usePickupHijack } from "@/hooks/usePickupHijack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

// Outgoing background color of the preceding Short About section
const ABOUT_BG_COLOR = "#55b1ff";

/**
 * ProjectsPickupSection
 *
 * Implements:
 * 1. Initial "Entry Blast" wipe from Short About (#55b1ff) into Selected Project 01 (Privex: #F9F6F0).
 * 2. Upward "Rewind" animation when scrolling UP from Project 1:
 *    - Fades out Privex text.
 *    - Scales Cream circle back down from full viewport to 0, seamlessly revealing blue About underneath.
 *    - Releases Lenis and smoothly glides to About.
 * 3. Liquid Gooey Bubble Collision for project-to-project steps (Privex <-> NagarikOne <-> SummAID).
 * 4. Dynamic background sync to prevent any blue bleed below the section.
 */
export default function ProjectsPickupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const baseBgRef = useRef<HTMLDivElement>(null);
  const entryCircleRef = useRef<HTMLDivElement>(null);

  const gooeyContainerRef = useRef<HTMLDivElement>(null);
  const hostBubbleRef = useRef<HTMLDivElement>(null);
  const invaderBubbleRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const numberBadgeRef = useRef<HTMLDivElement>(null);

  const isCurrent = usePickupStore((s) => s.isCurrent);
  const currentNumber = usePickupStore((s) => s.currentNumber);
  const direction = usePickupStore((s) => s.direction);
  const projects = usePickupStore((s) => s.projects);
  const setGlobalBgColor = usePickupStore((s) => s.setGlobalBgColor);

  const activeProject = projects[currentNumber - 1] || projects[0];
  const [displayedProject, setDisplayedProject] = useState<ProjectData>(activeProject);

  // Base background starts at About blue (#55b1ff) so there is ZERO hard cut
  const [baseBgColor, setBaseBgColor] = useState<string>(ABOUT_BG_COLOR);

  const prevNumberRef = useRef<number>(currentNumber);
  const hasInitializedRef = useRef<boolean>(false);
  const entryTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const rewindTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const collisionTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // ─── Step 1: Upward "Rewind" Animation Handler ───
  const handleRewindToAbout = useCallback((completeRelease: () => void) => {
    const circleEl = entryCircleRef.current;
    const baseBgEl = baseBgRef.current;

    // Kill any active forward tweens
    if (entryTimelineRef.current) entryTimelineRef.current.kill();
    if (collisionTimelineRef.current) collisionTimelineRef.current.kill();
    if (rewindTimelineRef.current) rewindTimelineRef.current.kill();

    const viewportHypot = Math.hypot(window.innerWidth, window.innerHeight);
    const blastTargetScale = (viewportHypot * 2.6) / 64;

    const rewindTl = gsap.timeline({
      onComplete: () => {
        // Reset state after circle has shrunken to 0
        hasInitializedRef.current = false;
        prevNumberRef.current = 1;
        setBaseBgColor(ABOUT_BG_COLOR);
        if (baseBgEl) baseBgEl.style.backgroundColor = ABOUT_BG_COLOR;
        if (circleEl) gsap.set(circleEl, { scale: 0, opacity: 1 });

        // Complete release to About section and restart Lenis
        completeRelease();
      },
    });

    // 1. Fade and translate out Privex typography
    rewindTl.to(
      [titleRef.current, categoryRef.current, descRef.current, numberBadgeRef.current],
      {
        y: 40,
        opacity: 0,
        duration: 0.32,
        ease: "power2.in",
      }
    );

    // 2. Prepare circle at full scale over the blue background
    rewindTl.set(circleEl, {
      scale: blastTargetScale,
      opacity: 1,
      backgroundColor: "#F9F6F0",
    });

    // Ensure underlying plane is the blue About color so shrinking reveals blue
    if (baseBgEl) {
      baseBgEl.style.backgroundColor = ABOUT_BG_COLOR;
    }

    // 3. Shrink the Cream bubble from massive scale back down to 0
    rewindTl.to(
      circleEl,
      {
        scale: 0,
        duration: 0.85,
        ease: "power3.inOut",
      },
      "-=0.1"
    );

    rewindTimelineRef.current = rewindTl;
  }, []);

  // Connect two-way scroll hijack hook with rewind callback
  usePickupHijack(sectionRef, {
    onRewindToAbout: handleRewindToAbout,
  });

  // ─── Initial Entrance Blast Animation ───
  useEffect(() => {
    // Exact moment store triggers enter() into Project 1 for the first time
    if (!hasInitializedRef.current && isCurrent) {
      hasInitializedRef.current = true;

      const circleEl = entryCircleRef.current;
      const baseBgEl = baseBgRef.current;
      if (!circleEl || !baseBgEl) return;

      if (entryTimelineRef.current) entryTimelineRef.current.kill();

      const viewportHypot = Math.hypot(window.innerWidth, window.innerHeight);
      const blastTargetScale = (viewportHypot * 2.6) / 64;

      // Base background stays strictly #55b1ff while circle violently expands
      baseBgEl.style.backgroundColor = ABOUT_BG_COLOR;
      circleEl.style.backgroundColor = activeProject.color;

      gsap.set(
        [titleRef.current, categoryRef.current, descRef.current, numberBadgeRef.current],
        { y: 50, opacity: 0 }
      );

      const entryTl = gsap.timeline({
        onComplete: () => {
          setBaseBgColor(activeProject.color);
          baseBgEl.style.backgroundColor = activeProject.color;
          setGlobalBgColor(activeProject.color);
          setDisplayedProject(activeProject);
          gsap.set(circleEl, { scale: 0, opacity: 0 });
        },
      });

      // 1. Violently expand Cream circle from scale 0 to full screen
      entryTl.fromTo(
        circleEl,
        { scale: 0, opacity: 1 },
        {
          scale: blastTargetScale,
          duration: 1.15,
          ease: "expo.inOut",
        }
      );

      // 2. Sequence Privex Content Reveal during tail-end of Entry Blast
      entryTl.to(
        titleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.4"
      );

      entryTl.to(
        [categoryRef.current, descRef.current, numberBadgeRef.current],
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        },
        "<+=0.05"
      );

      entryTimelineRef.current = entryTl;
      prevNumberRef.current = currentNumber;
      return;
    }

    // ─── Liquid Gooey Collision for Project Steps (1 <-> 2 <-> 3) ───
    if (prevNumberRef.current !== currentNumber && isCurrent) {
      const prevProject = projects[prevNumberRef.current - 1] || projects[0];
      const isForward = direction !== "prev";

      const hostEl = hostBubbleRef.current;
      const invaderEl = invaderBubbleRef.current;
      const baseBgEl = baseBgRef.current;
      if (!hostEl || !invaderEl || !baseBgEl) return;

      if (collisionTimelineRef.current) collisionTimelineRef.current.kill();

      const viewportHypot = Math.hypot(window.innerWidth, window.innerHeight);
      const blastTargetScale = (viewportHypot * 1.45) / 130;

      hostEl.style.backgroundColor = prevProject.color;
      invaderEl.style.backgroundColor = activeProject.color;

      const startY = isForward ? -260 : 260;

      // Animate out old text
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: isForward ? -50 : 50,
          opacity: 0,
          duration: 0.28,
          ease: "power2.in",
        });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setBaseBgColor(activeProject.color);
          baseBgEl.style.backgroundColor = activeProject.color;
          setGlobalBgColor(activeProject.color);
          setDisplayedProject(activeProject);
          gsap.set([hostEl, invaderEl], {
            scale: 0,
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0,
          });

          // Animate in new project text
          if (titleRef.current) {
            gsap.fromTo(
              titleRef.current,
              { y: isForward ? 50 : -50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
            );
          }
          if (categoryRef.current && descRef.current && numberBadgeRef.current) {
            gsap.fromTo(
              [categoryRef.current, descRef.current, numberBadgeRef.current],
              { y: isForward ? 25 : -25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.65, stagger: 0.06, ease: "power2.out" }
            );
          }
        },
      });

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

      // Approach
      tl.to(invaderEl, {
        y: 0,
        duration: 0.42,
        ease: "power2.in",
      });
      tl.to(
        hostEl,
        {
          y: isForward ? -25 : 25,
          duration: 0.42,
          ease: "power1.inOut",
        },
        "<"
      );

      // Liquid squash & elastic rebound
      tl.to([hostEl, invaderEl], {
        scaleX: 1.38,
        scaleY: 0.72,
        duration: 0.12,
        ease: "power1.out",
      });
      tl.to([hostEl, invaderEl], {
        scaleX: 0.88,
        scaleY: 1.18,
        duration: 0.16,
        ease: "sine.inOut",
      });

      // Explosion outward
      tl.to(
        invaderEl,
        {
          scale: blastTargetScale,
          scaleX: blastTargetScale,
          scaleY: blastTargetScale,
          duration: 0.82,
          ease: "power3.out",
        },
        "-=0.04"
      );
      tl.to(
        hostEl,
        {
          scale: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        "<"
      );

      collisionTimelineRef.current = tl;
      prevNumberRef.current = currentNumber;
    }
  }, [activeProject, currentNumber, direction, isCurrent, projects, setGlobalBgColor]);

  return (
    <section
      ref={sectionRef}
      id="pickup-section"
      className="relative w-full min-h-screen h-screen overflow-hidden select-none z-10"
      style={{
        backgroundColor: baseBgColor,
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

      {/* ─── Persistent Base Background Color Plane (Starts strictly at #55b1ff) ─── */}
      <div
        ref={baseBgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundColor: baseBgColor,
        }}
      />

      {/* ─── Step 1: Initial Entry Blast Wipe Circle (#F9F6F0 Cream) ─── */}
      <div
        ref={entryCircleRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full pointer-events-none z-[5] will-change-transform"
        style={{
          backgroundColor: "#F9F6F0",
          transform: "scale(0)",
          transformOrigin: "center center",
        }}
      />

      {/* ─── Gooey Liquid Collision Layer for Project Steps (z-[6]) ─── */}
      <div
        ref={gooeyContainerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-[6]"
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

      {/* ─── Top-Right Section Counter & Progress (z-20) ─── */}
      <div className="absolute top-[65px] md:top-[70px] right-6 sm:right-10 md:right-[155px] z-20 pointer-events-none text-right font-[helvetica,Arial,sans-serif]">
        <div
          ref={numberBadgeRef}
          className="flex items-center justify-end gap-2 text-xs md:text-sm tracking-[0.18em] uppercase transition-colors duration-300 font-semibold opacity-0 will-change-transform"
          style={{
            color: displayedProject.textColor,
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

      {/* ─── Center Giant Display Project Title in Six Caps (z-20) ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4">
        <div className="overflow-hidden py-4">
          <h2
            ref={titleRef}
            className="text-[clamp(5.5rem,21vmin,19rem)] leading-[0.88] tracking-[-0.01em] text-center uppercase select-none will-change-transform transition-colors duration-300 drop-shadow-sm opacity-0"
            style={{
              fontFamily: "var(--font-six-caps)",
              color: displayedProject.textColor,
            }}
          >
            {displayedProject.title}
          </h2>
        </div>
      </div>

      {/* ─── Bottom-Left Category & Project Brief (z-20) ─── */}
      <div className="absolute bottom-10 md:bottom-[86px] left-6 sm:left-10 md:left-12 z-20 pointer-events-none max-w-[340px] md:max-w-md">
        <div>
          <span
            ref={categoryRef}
            className="block text-xs md:text-sm font-bold tracking-wider mb-2 uppercase transition-colors duration-300 opacity-0 will-change-transform"
            style={{
              color: displayedProject.textColor,
            }}
          >
            {displayedProject.category}
          </span>
          <p
            ref={descRef}
            className="text-xs md:text-sm font-[helvetica,Arial,sans-serif] leading-relaxed tracking-wide transition-colors duration-300 opacity-0 will-change-transform"
            style={{
              color: displayedProject.textColor,
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
          // Future detail view or drawer
        }}
      />
    </section>
  );
}
