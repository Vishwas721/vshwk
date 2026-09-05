"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeaderLogo from "@/components/dom/HeaderLogo";
import BounceLine from "@/components/dom/BounceLine";
import CertificatesSection from "@/components/about/CertificatesSection";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * AboutPage — 1:1 Architectural Replica of Hisami Kurita's /about Route
 *
 * Includes:
 * - Replicated 2D Kurita Structural Layout:
 *   - AboutMainVisualSection: HELLO, WORLD / VISHWAS K / IS FULL-STACK / AI ENGINEER AT REVA UNIVERSITY
 *   - Floating Profile Card with institution details
 * - "The Eclipse Inversion" transition:
 *   - Scrubbed expanding black circular void (w-[150vw] h-[150vw]) anchored at the boundary
 *   - Curved wipe swallowing the light beige theme into pure black
 *   - Seamless staggered entrance of the dark-mode CertificatesSection
 * - CertificatesSection (Legacy AwardSection.vue 1:1 clone)
 * - Harmonious dark-mode footer
 */
export default function AboutPage() {
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const eclipseCircleRef = useRef<HTMLDivElement>(null);
  const certsSectionRef = useRef<HTMLElement>(null);

  // ─── "The Eclipse Inversion" ScrollTrigger Master Timeline ───
  useGSAP(
    () => {
      if (!eclipseCircleRef.current || !certsSectionRef.current) return;

      // Initial state of the Eclipse Inversion circle
      gsap.set(eclipseCircleRef.current, {
        scale: 0,
        xPercent: -50,
        yPercent: 50,
        transformOrigin: "center center",
      });

      // Target reveal elements inside CertificatesSection
      const revealItems = certsSectionRef.current.querySelectorAll(
        ".certificate-reveal-item"
      );

      // Initial state of certificate items (hidden)
      gsap.set(revealItems, {
        opacity: 0,
        y: 50,
      });

      // Master Timeline: The Eclipse Inversion + Staggered Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: certsSectionRef.current,
          start: "top bottom", // Starts the moment the boundary enters the viewport bottom
          end: "top 18%",     // Fully engulfs and reveals as the section reaches reading position
          scrub: true,        // Exact 1:1 scrub tied to scroll wheel
        },
      });

      // Step 2: Scrubbed expanding black circle wipe (curved wipe covering beige)
      tl.to(eclipseCircleRef.current, {
        scale: 2.2,
        ease: "none",
        duration: 1,
      });

      // Step 3: Staggered reveal of certificates content after screen is engulfed
      tl.to(
        revealItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          duration: 0.8,
        },
        ">-0.15" // Begins right as the screen becomes completely engulfed in black
      );
    },
    { scope: pageWrapperRef }
  );

  return (
    <main className="relative min-h-screen w-full bg-[#f0efeb] text-[#302c1a] overflow-x-hidden">
      {/* ─── Navigation Elements ─── */}
      <HeaderLogo />

      {/* ─── Page Content Wrapper with Strict Overflow Containment ─── */}
      <div ref={pageWrapperRef} className="relative z-10 w-full overflow-hidden">
        {/* ─── Hero Section (AboutMainVisualSection) ─── */}
        <section
          ref={heroSectionRef}
          className="relative w-full min-h-screen px-6 sm:px-10 pt-[92px] pb-[92px]"
        >
          {/* Top Back Link */}
          <div className="mb-8 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.15em] text-[#302c1a] hover:opacity-60 transition-opacity"
            >
              <span>←</span>
              <span>BACK TO HERO</span>
            </Link>
          </div>

          {/* Heading Container replicating Kurita's About Hero */}
          <div className="relative">
            {/* Top-Left Metadata Read Area */}
            <div className="mb-6">
              <span className="block text-[32px] md:text-[36px] leading-[0.79] text-[#302c1a] indent-[-2px] font-[helvetica,Arial,sans-serif]">
                ・
              </span>
              <div className="font-[helvetica,Arial,sans-serif] text-[10px] md:text-[12px] tracking-[0.02em] leading-[1.15] text-[#302c1a] opacity-85 mt-1">
                <span className="block font-bold">MYSKILL :</span>
                <span className="block">FULL-STACK WEB / NEXT.JS</span>
                <span className="block">AI ENGINEERING & AGENTIC WORKFLOWS</span>
                <span className="block">MACHINE LEARNING / COMPUTER VISION / NLP</span>
              </div>
            </div>

            {/* Massive Typography Lines */}
            <h1
              className="relative uppercase leading-[0.88] tracking-[-0.002em] text-[#302c1a] select-none"
              style={{ fontFamily: "var(--font-six-caps)" }}
            >
              {/* Line 1: HELLO, WORLD */}
              <div className="relative block mb-6 md:mb-8 max-w-[clamp(400px,50vw,600px)]">
                <BounceLine width={470} origin="left" strokeColor="#302c1a" />
                <span className="block text-[clamp(4rem,13vw,10.5rem)] pt-2 md:pt-4">
                  HELLO, WORLD
                </span>
              </div>

              {/* Line 2: VISHWAS K */}
              <div className="relative block mb-6 md:mb-8 ml-0 sm:ml-[clamp(0px,12vw,160px)] max-w-[clamp(500px,65vw,820px)]">
                <BounceLine width={820} origin="right" strokeColor="#302c1a" />
                <span className="block text-[clamp(4rem,13vw,10.5rem)] pt-2 md:pt-4">
                  VISHWAS K
                </span>
              </div>

              {/* Line 3: IS FULL-STACK */}
              <div className="relative block mb-6 md:mb-8 ml-0 sm:ml-[clamp(0px,22vw,300px)] max-w-[clamp(550px,70vw,900px)]">
                <BounceLine width={900} origin="left" strokeColor="#302c1a" />
                <span className="block text-[clamp(4rem,13vw,10.5rem)] pt-2 md:pt-4">
                  IS FULL-STACK
                </span>
              </div>

              {/* Line 4: AI ENGINEER AT REVA */}
              <div className="relative block ml-0 sm:ml-[clamp(0px,8vw,120px)] max-w-[clamp(650px,85vw,1100px)]">
                <BounceLine width={1100} origin="right" strokeColor="#302c1a" />
                <span className="block text-[clamp(3.5rem,11.5vw,9.5rem)] pt-2 md:pt-4">
                  AI ENGINEER AT REVA UNIVERSITY
                </span>
              </div>
            </h1>

            {/* Floating Card: Institution Details */}
            <div
              className="mt-12 md:absolute md:top-24 md:right-16 z-20 cursor-pointer select-none"
              style={{
                width: "clamp(240px, 22vw, 290px)",
                perspective: "1000px",
              }}
            >
              <div
                className="w-full rounded-[14px] p-6 relative overflow-hidden bg-[#ffd955] text-[#302c1a] shadow-[0_16px_40px_rgba(48,44,26,0.12)]"
                style={{ transform: "rotate(6deg)" }}
              >
                <span className="block text-[28px] leading-none text-[#302c1a] indent-[-2px]">
                  ・
                </span>
                <span className="block text-[18px] font-bold tracking-[0.02em] font-[helvetica,Arial,sans-serif] mt-1">
                  REVA UNIVERSITY
                </span>
                <div className="mt-6 text-[11px] font-[helvetica,Arial,sans-serif] font-medium leading-[1.3] opacity-90">
                  <span className="block">B.TECH IN INFORMATION SCIENCE</span>
                  <span className="block">& ENGINEERING (2022 - 2026)</span>
                  <span className="block mt-2">BENGALURU, KARNATAKA, INDIA</span>
                </div>
                <div className="mt-8 text-right">
                  <span
                    className="block text-[65px] leading-[0.8] text-[#302c1a]/80"
                    style={{ fontFamily: "var(--font-six-caps)" }}
                  >
                    REVA.EDU
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── The Eclipse Inversion: Expanding Black Geometric Void (z-20) ─── */}
          <div
            ref={eclipseCircleRef}
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[150vw] h-[150vw] rounded-full bg-black z-20 will-change-transform"
            aria-hidden="true"
          />
        </section>

        {/* ─── Certificates Section (z-30, revealed after eclipse expands) ─── */}
        <CertificatesSection ref={certsSectionRef} />

        {/* ─── Bottom Footer Bar ─── */}
        <footer className="relative z-30 bg-black py-12 px-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono tracking-[0.15em] text-[#828282] border-t border-[#828282]/20">
          <span>VISHWAS K ・ PORTFOLIO 2026</span>
          <Link href="/" className="hover:text-white transition-colors mt-4 sm:mt-0">
            RETURN TO HOME ↑
          </Link>
        </footer>
      </div>
    </main>
  );
}
