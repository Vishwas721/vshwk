"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { mouseCoordinator } from "@/lib/mouseCoordinator";
import FloatingCard from "@/components/dom/FloatingCard";
import BounceLine from "@/components/dom/BounceLine";
import HeaderLogo from "@/components/dom/HeaderLogo";
import HomeBriefAbout from "@/components/home/HomeBriefAbout";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Home — Hisami Kurita-style Portfolio Hero Section
 *
 * Bugs Fixed:
 * 1. Disabled scroll restoration (window.history.scrollRestoration = 'manual' + window.scrollTo(0, 0))
 * 2. Fixed GSAP scale bug: blue circle starts at baseline scale: 1 and scrubs to scale: 18 (never shrinking < 1)
 * 3. Shifted pink card horizontally (translate-x-24 md:translate-x-36 lg:translate-x-44) to completely clear 'ENGINEER'
 */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const blueCircleRef = useRef<HTMLDivElement>(null);
  const yellowCircleRef = useRef<HTMLDivElement>(null);
  const blueParallaxRef = useRef<HTMLDivElement>(null);
  const yellowParallaxRef = useRef<HTMLDivElement>(null);

  // ─── 1. Disable Scroll Restoration on Mount ───
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
  }, []);

  // ─── 2. GSAP ScrollTrigger Timeline & Entry Reveal using useGSAP ───
  useGSAP(
    () => {
      const yellowCircle = yellowCircleRef.current;
      const blueCircle = blueCircleRef.current;
      const hero = heroRef.current;
      if (!yellowCircle || !blueCircle || !hero) return;

      // Initial Entrance Reveal from 0 to baseline 1
      gsap.from(yellowCircle, {
        scale: 0,
        duration: 1.1,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(blueCircle, {
        scale: 0,
        duration: 1.1,
        delay: 0.4,
        ease: "power3.out",
      });

      // Scroll-based expansion: starts from scale: 1 (natural CSS size) and expands to 18
      // scrub: true ensures fluid tracking with zero lag, and immediateRender: false prevents shrinking to 0
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        blueCircle,
        {
          scale: 1, // Baseline: natural CSS size, NEVER shrinks smaller than 1
        },
        {
          scale: 18, // Massive scale expansion to cover entire viewport background
          transformOrigin: "center center",
          ease: "none",
          immediateRender: false,
        }
      );
    },
    { scope: heroRef }
  );

  // ─── Subtle Mouse Parallax subscribed to unified mouseCoordinator ───
  useEffect(() => {
    const blueParallax = blueParallaxRef.current;
    const yellowParallax = yellowParallaxRef.current;
    if (!blueParallax || !yellowParallax) return;

    const BLUE_FACTOR = -42;
    const YELLOW_FACTOR = -26;

    const unsubscribe = mouseCoordinator.subscribe(({ normX, normY }) => {
      gsap.to(blueParallax, {
        duration: 0.35,
        ease: "none",
        x: normX * BLUE_FACTOR,
        y: normY * BLUE_FACTOR,
        overwrite: "auto",
      });

      gsap.to(yellowParallax, {
        duration: 0.35,
        ease: "none",
        x: normX * YELLOW_FACTOR,
        y: normY * YELLOW_FACTOR,
        overwrite: "auto",
      });
    });

    return () => {
      unsubscribe();
      gsap.killTweensOf(blueParallax);
      gsap.killTweensOf(yellowParallax);
    };
  }, []);

  return (
    <main className="relative min-h-[300vh] w-full overflow-x-hidden bg-[#f0efeb]">
      {/* ─── Top-Left Branding Logo in Six Caps ─── */}
      <HeaderLogo />

      {/* ─── Hero Section ─── */}
      <section ref={heroRef} className="relative w-full min-h-screen z-0">
        {/* ─── Background Blobs Layer (Z-Index: 0, securely behind typography & card) ─── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          {/* Yellow Circle: hero-bg-circle-01 ($yellow: #ffd955) */}
          <div
            ref={yellowParallaxRef}
            className="absolute pointer-events-none z-0 will-change-transform"
            style={{
              top: "clamp(-220px, -14.375vw, -184px)",
              right: "clamp(-160px, -7.03vw, -90px)",
            }}
          >
            <div
              ref={yellowCircleRef}
              className="rounded-full bg-[#ffd955] will-change-transform"
              style={{
                width: "clamp(520px, 64.06vw, 950px)",
                height: "clamp(520px, 64.06vw, 950px)",
                transformOrigin: "center center",
              }}
            />
          </div>

          {/* Blue Circle: hero-bg-circle-02 ($lightBlue: #55b1ff) */}
          <div
            ref={blueParallaxRef}
            className="absolute pointer-events-none z-0 will-change-transform"
            style={{
              top: "0",
              left: "clamp(-320px, -16.875vw, -216px)",
            }}
          >
            <div
              ref={blueCircleRef}
              className="rounded-full bg-[#55b1ff] will-change-transform"
              style={{
                width: "clamp(680px, 80.78vw, 1250px)",
                height: "clamp(680px, 80.78vw, 1250px)",
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>

        {/* ─── Foreground Content Container (Layered at z-10) ─── */}
        <div className="relative z-10 w-full px-6 sm:px-10 pt-[92px] pb-[92px]">
          {/* Massive Heading Container - Crisp White Typography */}
          <h1
            className="relative uppercase leading-[0.88] tracking-[-0.002em] text-white select-none"
            style={{ fontFamily: "var(--font-six-caps)" }}
          >
            {/* ─── Top-Left Read-Area Metadata ─── */}
            <div className="absolute top-[8px] left-[2px] z-20 pointer-events-none text-left">
              <span className="block text-[32px] md:text-[36px] leading-[0.79] text-white indent-[-2px] font-[helvetica,Arial,sans-serif]">
                ・
              </span>
              <div className="font-[helvetica,Arial,sans-serif] text-[10px] md:text-[12px] tracking-[0.02em] leading-[1.12] text-white opacity-90 mt-1">
                <span className="block">AUTHOR : VISHWAS K</span>
                <span className="block">FRAMEWORK : NEXT.JS/REACT</span>
                <span className="block">LIBRARY : R3F/GSAP</span>
                <span className="block">AI : GENAI/LLMS</span>
              </div>
            </div>

            {/* ─── Line 1: Le Folio de VISHWAS K (wrapper-01) ─── */}
            <div className="relative block mb-6 md:mb-8 ml-0 sm:ml-[clamp(0px,20.31vw,260px)] max-w-[clamp(500px,61.17vw,783px)]">
              <BounceLine width={840} origin="left" delay={0.1} strokeColor="#ffffff" />
              <span className="block text-[clamp(4.5rem,14.06vw,11.25rem)] text-white pt-2 md:pt-4">
                Le Folio de VISHWAS
              </span>
            </div>

            {/* ─── Line 2: 05/MAR.2006 + ( BASED IN INDIA ) (wrapper-02) ─── */}
            <div className="relative flex flex-col md:flex-row md:items-baseline md:justify-between mb-6 md:mb-8 max-w-[clamp(650px,75.39vw,965px)]">
              <BounceLine width={1080} origin="right" delay={0.2} strokeColor="#ffffff" />

              {/* Left: Date */}
              <span className="block text-[clamp(4.5rem,14.06vw,11.25rem)] text-white pt-2 md:pt-4">
                05/MAR.2006
              </span>

              {/* Right: Base Area block */}
              <div className="relative pt-2 md:pt-3 text-right">
                <span
                  className="block text-[clamp(2.5rem,6.25vw,5rem)] text-white tracking-[0.0025em] leading-none"
                  style={{ fontFamily: "var(--font-six-caps)" }}
                >
                  ( BASED IN INDIA )
                </span>

                {/* Positioned SOMETIMES and ALLWAYS matching legacy vw offsets */}
                <div className="flex justify-end gap-10 mt-1 md:mt-2 text-[10px] md:text-[14px] font-[helvetica,Arial,sans-serif] tracking-[0.02em] text-white/80">
                  <span>SOMETIMES</span>
                  <span>ALLWAYS</span>
                </div>
              </div>
            </div>

            {/* ─── Line 3: AI & FULL-STACK (wrapper-03) ─── */}
            <div className="relative block mb-6 md:mb-8 ml-[170px] sm:ml-[clamp(0px,32.34vw,414px)] max-w-[clamp(450px,54.53vw,698px)] whitespace-nowrap">
              <BounceLine width={700} origin="left" delay={0.3} strokeColor="#ffffff" />
              <span className="block text-[clamp(4.5rem,14.06vw,11.25rem)] text-white pt-2 md:pt-4">
                AI & FULL-STACK
              </span>
            </div>

            {/* ─── Line 4: ENGINEER (wrapper-04) ─── */}
            <div className="relative block ml-[90px] sm:ml-[clamp(0px,16.09vw,206px)] max-w-[clamp(240px,26.25vw,336px)] whitespace-nowrap">
              <BounceLine width={350} origin="right" delay={0.4} strokeColor="#ffffff" />
              <span className="block text-[clamp(4.5rem,14.06vw,11.25rem)] text-white pt-2 md:pt-4">
                ENGINEER
              </span>
            </div>
          </h1>

          {/* ─── 3. Pink Floating 3D Tilt Card (Pinned strictly to left wall, hanging off Line 2 date) ─── */}
          <div className="absolute left-4 sm:left-8 md:left-12 lg:left-[5vw] top-[235px] sm:top-[270px] md:top-[320px] lg:top-[375px] xl:top-[400px] z-20 pointer-events-auto">
            <FloatingCard />
          </div>
        </div>
      </section>

      {/* ─── Brief About Introduction Section ─── */}
      <HomeBriefAbout />

      {/* ─── Subsequent Section (Layered at z-10 so expanded blue blob covers the background behind it) ─── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white px-6">
        <span className="opacity-40 tracking-[0.2em] font-mono text-sm mb-4">
          ↓ SCROLL DOWN TO EXPLORE
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90">
          SELECTED WORKS
        </h2>
      </section>
    </main>
  );
}
