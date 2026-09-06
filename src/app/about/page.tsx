"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeaderLogo from "@/components/dom/HeaderLogo";
import BounceLine from "@/components/dom/BounceLine";
import SkillsMatrixSection from "@/components/about/SkillsMatrixSection";
import EventsHackathonsSection from "@/components/about/EventsHackathonsSection";
import CertificatesSection from "@/components/about/CertificatesSection";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * AboutPage — 1:1 Architectural Replica of Hisami Kurita's /about Route
 *
 * Includes:
 * - "The Z-Axis Depth Drop":
 *   - Hero wrapper pinned during the 75vh spacer runway
 *   - Hero physically recedes into the screen: scale 0.85, rounded corners (3rem), darkening to brightness(0.6)
 *   - SkillsMatrixSection (z-20, rounded-t-[3rem], shadow-[0_-40px_80px_rgba(0,0,0,0.14)]) slides smoothly over the sunken Hero
 * - 3-Tier Interactive Skills Matrix Section (Cream #F9F6F0 -> Pale Lavender #E6E6FA -> Soft Mint #E0F4E8)
 *   with M-Trust style scattered floating cards hover effect
 * - "The Brutalist Horizon Wipe":
 *   - 100vh spacer runway bridging Skills (Mint #E0F4E8) and Events (Hermès Orange #F37021)
 *   - Razor-thin horizontal laser strike (scaleX: 0 -> 1)
 *   - Aggressive vertical tear (scaleY: 1000) swallowing the screen in Hermès Orange
 * - Events & Hackathons Section:
 *   - Full-screen Hermès Orange (#F37021) horizontal scrolling marquee driven by vertical scroll
 *   - Brutalist Monolithic Ticket hover effect snapping with GSAP quickSetter
 * - "The Eclipse Inversion" transition:
 *   - Scrubbed expanding black circular void (w-[150vw] h-[150vw]) anchored at the boundary
 *   - Curved wipe swallowing the Hermès Orange theme into pure black
 *   - Seamless staggered entrance of the dark-mode CertificatesSection
 * - CertificatesSection (Legacy AwardSection.vue 1:1 clone)
 * - Harmonious dark-mode footer
 */
export default function AboutPage() {
  const router = useRouter();
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const heroPinContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroSpacerRef = useRef<HTMLDivElement>(null);
  const skillsWrapperRef = useRef<HTMLDivElement>(null);
  const skillsMatrixRef = useRef<HTMLElement>(null);
  const horizonSpacerRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const eventsSectionRef = useRef<HTMLElement>(null);
  const eclipseCircleRef = useRef<HTMLDivElement>(null);
  const certsSectionRef = useRef<HTMLElement>(null);

  // ─── Master ScrollTrigger Timeline: Z-Axis Depth Drop, Horizon Wipe & Eclipse Inversion ───
  useGSAP(
    () => {
      if (
        !heroPinContainerRef.current ||
        !heroSectionRef.current ||
        !heroSpacerRef.current ||
        !skillsWrapperRef.current
      )
        return;

      // 1. The Hero "Z-Axis Depth Drop" (Delayed until user scrolls through the entire Hero)
      gsap.fromTo(
        heroSectionRef.current,
        {
          scale: 1,
          borderRadius: "0rem",
          filter: "brightness(1)",
          transformOrigin: "center bottom",
        },
        {
          scale: 0.85,
          borderRadius: "3rem",
          filter: "brightness(0.6)",
          transformOrigin: "center bottom",
          ease: "none",
          scrollTrigger: {
            trigger: heroPinContainerRef.current,
            start: "bottom bottom",
            end: "+=75vh",
            pin: true,
            pinSpacing: false,
            scrub: true,
          },
        }
      );

      // 2. "The Brutalist Horizon Wipe" ScrollTrigger Master Timeline
      if (horizonSpacerRef.current && horizonRef.current) {
        // Initial state: razor-thin horizontal line, flat, horizontally collapsed, hidden
        gsap.set(horizonRef.current, {
          scaleX: 0,
          scaleY: 1,
          opacity: 0,
          transformOrigin: "center center",
        });

        const horizonTl = gsap.timeline({
          scrollTrigger: {
            trigger: horizonSpacerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Phase 1 (The Strike): As spacer enters, razor line strikes across screen
        horizonTl.to(horizonRef.current, {
          scaleX: 1,
          opacity: 1,
          duration: 0.15,
          ease: "power2.out",
        });

        // Phase 2 (The Tear): Violent vertical expansion swallowing the screen in Hermès Orange
        horizonTl.to(horizonRef.current, {
          scaleY: 1000,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }

      // 3. "The Eclipse Inversion" ScrollTrigger Master Timeline
      if (eclipseCircleRef.current && certsSectionRef.current) {
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

        const eclipseTl = gsap.timeline({
          scrollTrigger: {
            trigger: certsSectionRef.current,
            start: "top bottom",
            end: "top 18%",
            scrub: true,
          },
        });

        // Scrubbed expanding black circle wipe
        eclipseTl.to(eclipseCircleRef.current, {
          scale: 2.2,
          ease: "none",
          duration: 1,
        });

        // Staggered reveal of certificates content
        eclipseTl.to(
          revealItems,
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            duration: 0.8,
          },
          ">-0.15"
        );
      }
    },
    { scope: pageWrapperRef }
  );

  return (
    <main className="relative min-h-screen w-full bg-[#0d0c0a] text-[#302c1a] overflow-x-hidden">
      {/* ─── Navigation Elements ─── */}
      <HeaderLogo />

      {/* ─── Page Content Wrapper with Strict Horizontal Overflow Containment ─── */}
      <div ref={pageWrapperRef} className="relative z-10 w-full overflow-x-clip">

        {/* ─── Hero Pin Container (z-10) ─── */}
        <div ref={heroPinContainerRef} className="relative w-full z-10">
          <section
            ref={heroSectionRef}
            className="relative w-full min-h-screen px-6 sm:px-10 pt-[92px] pb-[92px] bg-[#f0efeb] overflow-hidden will-change-transform"
          >
            {/* Top Back Link */}
            <div className="relative z-30 mb-8 pt-4 pointer-events-auto">
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                  router.push("/");
                }}
                className="relative z-30 inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.15em] text-[#302c1a] hover:opacity-60 transition-opacity cursor-pointer pointer-events-auto select-none"
              >
                <span>←</span>
                <span>BACK TO HERO</span>
              </Link>
            </div>

            {/* Heading Container replicating Kurita's About Hero */}
            <div className="relative">


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
                    AND AI ENGINEER
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
                    <span className="block">& ENGINEERING (2023 - 2027)</span>
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
          </section>
        </div>

        {/* ─── Step 1: The Runway (75vh Spacer between Hero and Skills) ─── */}
        <div
          ref={heroSpacerRef}
          className="w-full h-[75vh] pointer-events-none bg-transparent"
          aria-hidden="true"
        />

        {/* ─── Step 3: Skills Section Layer Overlap (z-20, rounded-t-[3rem], shadow) ─── */}
        <div
          ref={skillsWrapperRef}
          className="relative w-full z-20 shadow-[0_-40px_80px_rgba(0,0,0,0.14)] rounded-t-[3rem] bg-[#F9F6F0]"
        >
          <SkillsMatrixSection ref={skillsMatrixRef} className="rounded-t-[3rem]" />
        </div>

        {/* ─── The Brutalist Horizon Wipe: 100vh Runway Spacer & Orange Laser (z-25) ─── */}
        <div
          ref={horizonSpacerRef}
          className="relative w-full h-[100vh] bg-transparent pointer-events-none overflow-hidden z-25"
          style={{ backgroundColor: "#E0F4E8" }}
          aria-hidden="true"
        >
          <div
            ref={horizonRef}
            className="absolute top-1/2 left-0 w-full h-[2px] bg-[#F37021] -translate-y-1/2 origin-center z-30 will-change-transform"
          />
        </div>

        {/* ─── Events & Hackathons Section: Hermès Orange (#F37021) Horizontal Marquee (z-25) ─── */}
        <div className="relative w-full z-25">
          <EventsHackathonsSection ref={eventsSectionRef} />

          {/* ─── The Eclipse Inversion: Expanding Black Geometric Void (z-30) ─── */}
          <div
            ref={eclipseCircleRef}
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[150vw] h-[150vw] rounded-full bg-black z-30 will-change-transform"
            aria-hidden="true"
          />
        </div>

        {/* ─── Certificates Section (z-30, revealed after eclipse expands) ─── */}
        <CertificatesSection ref={certsSectionRef} />

        {/* ─── Bottom Footer Bar ─── */}
        <footer className="relative z-30 bg-black py-12 pl-6 sm:pl-10 pr-24 sm:pr-[120px] flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono tracking-[0.15em] text-[#828282] border-t border-[#828282]/20">
          <span>VISHWAS K ・ PORTFOLIO 2026</span>
          <Link href="/" className="hover:text-white transition-colors mt-4 sm:mt-0">
            RETURN TO HOME ↑
          </Link>
        </footer>
      </div>
    </main>
  );
}
