"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { usePickupStore, type ProjectData } from "@/store/usePickupStore";
import { usePickupHijack } from "@/hooks/usePickupHijack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

/**
 * ProjectsPickupSection
 *
 * Replaces the dark WebGL metaball presentation with a clean, high-impact "Bubble Blast":
 * 1. Centralized expanding circular wipe (scale: 0 -> max) covering the viewport.
 * 2. Three fresh light theme projects:
 *    - Privex (#F9F6F0 / Soft Cream)
 *    - NagarikOne (#FFD8A8 / Light Orange)
 *    - SummAID (#D8F3DC / Soft Mint)
 * 3. Directional kinetic typography transitions (Six Caps + Helvetica).
 * 4. Intercepts and releases scroll two-ways seamlessly via usePickupHijack.
 */
export default function ProjectsPickupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const baseBgRef = useRef<HTMLDivElement>(null);
  const bubbleBlastRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const numberBadgeRef = useRef<HTMLDivElement>(null);

  // Bind two-way scroll hijacking hook
  usePickupHijack(sectionRef);

  const isCurrent = usePickupStore((s) => s.isCurrent);
  const currentNumber = usePickupStore((s) => s.currentNumber);
  const direction = usePickupStore((s) => s.direction);
  const projects = usePickupStore((s) => s.projects);

  const activeProject = projects[currentNumber - 1] || projects[0];
  const [displayedProject, setDisplayedProject] = useState<ProjectData>(activeProject);

  // Track previous project to trigger blasts
  const prevNumberRef = useRef<number>(currentNumber);
  const hasInitializedRef = useRef<boolean>(false);

  // The Bubble Blast circular wipe animation
  useEffect(() => {
    if (!bubbleBlastRef.current || !baseBgRef.current) return;

    // Create signature high-energy blast curve
    let bubbleEase = "power3.out";
    try {
      CustomEase.create("bubbleBlast", "M0,0 C0.16,1 0.3,1 1,1");
      bubbleEase = "bubbleBlast";
    } catch {
      bubbleEase = "power3.out";
    }

    const targetColor = activeProject.color;
    const bubbleEl = bubbleBlastRef.current;
    const baseBgEl = baseBgRef.current;

    // Calculate scale factor required to envelop entire viewport from center
    const viewportHypot = Math.hypot(window.innerWidth, window.innerHeight);
    // Bubble base diameter is 120px
    const targetScale = (viewportHypot * 1.35) / 120;

    // First time entering the section
    if (!hasInitializedRef.current && isCurrent) {
      hasInitializedRef.current = true;
      bubbleEl.style.backgroundColor = targetColor;

      gsap.fromTo(
        bubbleEl,
        { scale: 0 },
        {
          scale: targetScale,
          duration: 1.0,
          ease: bubbleEase,
          onComplete: () => {
            baseBgEl.style.backgroundColor = targetColor;
            gsap.set(bubbleEl, { scale: 0 });
          },
        }
      );
      setDisplayedProject(activeProject);
      prevNumberRef.current = currentNumber;
      return;
    }

    // Step transition (1 -> 2, 2 -> 3, 3 -> 2, etc.)
    if (prevNumberRef.current !== currentNumber && isCurrent) {
      bubbleEl.style.backgroundColor = targetColor;

      // Animate the bubble explosion
      gsap.fromTo(
        bubbleEl,
        { scale: 0 },
        {
          scale: targetScale,
          duration: 0.9,
          ease: bubbleEase,
          onComplete: () => {
            baseBgEl.style.backgroundColor = targetColor;
            gsap.set(bubbleEl, { scale: 0 });
          },
        }
      );

      // Kinetic typography transitions
      const isForward = direction !== "prev";
      const exitYPercent = isForward ? -80 : 80;
      const enterYPercent = isForward ? 80 : -80;

      // Animate out old title & metadata
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: exitYPercent,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            setDisplayedProject(activeProject);
            // Animate in new title
            gsap.fromTo(
              titleRef.current,
              { yPercent: enterYPercent, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power3.out",
              }
            );
          },
        });
      } else {
        setDisplayedProject(activeProject);
      }

      // Staggered metadata entrance
      if (categoryRef.current && descRef.current && numberBadgeRef.current) {
        gsap.fromTo(
          [categoryRef.current, descRef.current, numberBadgeRef.current],
          { opacity: 0, y: isForward ? 15 : -15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: 0.25,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      }

      prevNumberRef.current = currentNumber;
    }
  }, [activeProject, currentNumber, direction, isCurrent]);

  return (
    <section
      ref={sectionRef}
      id="pickup-section"
      className="relative w-full min-h-screen h-screen overflow-hidden select-none z-10"
      style={{
        // Fallback default tone
        backgroundColor: displayedProject.color,
      }}
    >
      {/* ─── Persistent Base Background Color Plane ─── */}
      <div
        ref={baseBgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundColor: displayedProject.color,
          transition: "background-color 0.2s ease-out",
        }}
      />

      {/* ─── The Bubble Blast Expanding Circle Layer ─── */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <div
          ref={bubbleBlastRef}
          className="rounded-full will-change-transform pointer-events-none"
          style={{
            width: "120px",
            height: "120px",
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
          style={{ color: displayedProject.textColor }}
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
            style={{ color: displayedProject.textColor }}
          >
            {displayedProject.category}
          </span>
          <p
            ref={descRef}
            className="text-xs md:text-sm font-[helvetica,Arial,sans-serif] leading-relaxed tracking-wide transition-colors duration-300 opacity-85"
            style={{ color: displayedProject.textColor }}
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
