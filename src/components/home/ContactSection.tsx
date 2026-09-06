"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

// Register plugins client-side only
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);
}

/** Project roster matching portfolio showcase */
const PROJECT_INDEX = [

  { name: "PRIVEX", href: "#" },
  { name: "NAGARIKONE", href: "#" },
  { name: "SUMMAID", href: "#" },
  { name: "PRISM", href: "#" },
  { name: "GESTO", href: "#" },
  { name: "REGENEX", href: "#" },
  { name: "ARCHIVE", href: "#" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinkBubbleRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // ─── Step 2: Smooth Scrub Pink Bubble Expansion via ScrollTrigger ───
      if (pinkBubbleRef.current) {
        gsap.fromTo(
          pinkBubbleRef.current,
          { scale: 0.1 },
          {
            scale: 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom", // Starts exactly when the top of the footer hits the bottom of the screen
              end: "center center", // Reaches full size when the footer is centered
              scrub: true, // Ties the bubble's growth directly to the scroll wheel
            },
          }
        );
      }

      // ─── Step 4: Interactive Draggable Cards with Inertia ───
      const cardElements = [card1Ref.current, card2Ref.current].filter(
        Boolean
      ) as HTMLElement[];

      const draggables = Draggable.create(cardElements, {
        type: "x,y",
        bounds: sectionRef.current,
        edgeResistance: 0.65,
        inertia: true,
        dragClickables: false,
        onPress: function () {
          gsap.to(this.target, {
            scale: 1.05,
            boxShadow: "0 35px 80px rgba(45,42,38,0.32)",
            duration: 0.15,
            zIndex: 45,
          });
        },
        onRelease: function () {
          gsap.to(this.target, {
            scale: 1,
            boxShadow: "0 20px 50px rgba(45,42,38,0.18)",
            duration: 0.25,
            zIndex: 30,
          });
        },
        onThrowUpdate: function () {
          if (typeof this.deltaX === "number") {
            const currentRotation =
              Number(gsap.getProperty(this.target, "rotation")) || 0;
            gsap.set(this.target, {
              rotation: currentRotation + this.deltaX * 0.12,
            });
          }
        },
      });

      // Cleanup Draggable instances on unmount (React 19 safe)
      return () => {
        draggables.forEach((d) => d.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative isolate w-full min-h-screen overflow-hidden bg-transparent pt-28 md:pt-40 pb-16 md:pb-24 select-none"
    >
      {/* ─── Step 1: Expanding Pink Circle Element (#ffabb7) ─── */}
      <div
        ref={pinkBubbleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] rounded-full bg-[#ffabb7] -z-10"
      />

      {/* ─── Main Content Container (Full Width Edge-to-Edge) ─── */}
      <div className="relative z-10 w-full flex flex-col justify-between min-h-[85vh]">
        {/* Read Badge ("・ SAY HI") */}
        <div className="w-[90vw] mx-auto mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base font-bold text-[#cf1146]">
              ・
            </span>
            <span className="text-xs md:text-sm font-mono tracking-[0.25em] uppercase text-[#cf1146] opacity-80">
              SAY HI
            </span>
          </div>
        </div>

        {/* ─── Steps 1, 2, 3: Flush Typographic Block (Strict w-[90vw] mx-auto) ─── */}
        <div className="w-full flex flex-col items-center justify-center select-none overflow-hidden">
          <div
            className="flex flex-col items-center justify-center font-custom-condensed text-[#cf1146] uppercase leading-none w-[90vw] mx-auto"
            style={{ fontFamily: "var(--font-six-caps)" }}
          >
            {/* 17 chars -> needs large size */}
            <span className="block w-full text-center whitespace-nowrap text-[13.3vw]">
              I AM A FULL-STACK
            </span>

            {/* 13 chars -> needs MASSIVE size */}
            <span className="block w-full text-center whitespace-nowrap text-[18.2vw]">
              & AI ENGINEER
            </span>

            {/* 26 chars -> needs small size */}
            <span className="block w-full text-center whitespace-nowrap text-[8.3vw]">
              FOCUSED ON CREATING THINGS
            </span>

            {/* 28 chars -> needs smallest size */}
            <span className="block w-full text-center whitespace-nowrap text-[7.8vw]">
              WITH INTERACTION & ANIMATION
            </span>

            {/* 17 chars -> needs large size */}
            <span className="block w-full text-center whitespace-nowrap text-[13.2vw]">
              AS MY MAIN FOCUS.
            </span>
          </div>
        </div>

        {/* ─── Bottom Area: Left Index Menu & Bottom Name ─── */}
        <div className="w-[90vw] mx-auto mt-16 sm:mt-20 md:mt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 w-full">
            {/* Left Index Menu */}
            <div className="relative z-20">
              <div className="flex items-center gap-2 mb-3 sm:mb-5">
                <span className="text-xs sm:text-sm font-bold text-[#cf1146]">
                  ・
                </span>
                <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-[#cf1146]/70">
                  INDEX
                </span>
              </div>

              <ul className="flex flex-col space-y-1 sm:space-y-1.5 font-[helvetica,Arial,sans-serif]">
                {PROJECT_INDEX.map((project, idx) => (
                  <li key={idx}>
                    <a
                      href={project.href}
                      className="group flex items-center gap-2 text-[12px] sm:text-[13px] tracking-[0.06em] uppercase text-[#cf1146] transition-all duration-200 hover:text-black py-0.5"
                    >
                      {/* Active/Hover Dot Indicator */}
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#cf1146] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 group-hover:font-semibold transition-transform duration-200">
                        {project.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Giant Bottom Name anchoring right side */}
            <div className="relative z-0 select-none pointer-events-none md:text-right overflow-hidden leading-none">
              <span
                className="block font-custom-condensed text-[clamp(4.5rem,18vw,20rem)] leading-[0.74] uppercase text-[#cf1146] opacity-90"
                style={{ fontFamily: "var(--font-six-caps)" }}
              >
                VISHWAS K
              </span>
            </div>
          </div>

          {/* Bottom Footer Line */}
          <div className="mt-12 pt-6 border-t border-[#cf1146]/20 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#cf1146]/60 w-full">
            <span>© 2026 VISHWAS K. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>

      {/* ─── Step 4: Interactive Draggable Cards ─── */}

      {/* Card 1: Developer / Vishwas K */}
      <div
        ref={card1Ref}
        className="absolute top-[28%] sm:top-[32%] md:top-[34%] left-[6%] sm:left-[14%] md:left-[20%] z-30 w-[260px] sm:w-[290px] h-[360px] sm:h-[400px] bg-white text-[#2d2a26] rounded-[14px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(45,42,38,0.18)] hover:shadow-[0_30px_70px_rgba(45,42,38,0.28)] flex flex-col justify-between cursor-grab active:cursor-grabbing touch-none select-none will-change-transform"
        style={{ transform: "rotate(-10deg)" }}
      >
        {/* Card 1 Header */}
        <div>
          <span className="block text-[32px] sm:text-[36px] leading-[0.75] font-bold text-[#2d2a26] indent-[-2px]">
            ・
          </span>
          <div className="mt-2 text-[17px] sm:text-[20px] font-sans font-bold leading-[1.18] uppercase tracking-tight text-[#2d2a26]">
            <span>CODED & DESIGNED BY</span>
            <span className="block">(VISHWAS K)</span>
          </div>
        </div>

        {/* Card 1 Links */}
        <ul className="space-y-1.5 text-[11px] sm:text-[12px] font-mono tracking-wider text-[#2d2a26]/75 uppercase">
          <li>
            <a
              href="https://github.com/Vishwas721"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:underline inline-block transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              GITHUB
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/vishwas-k217/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:underline inline-block transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              LINKEDIN
            </a>
          </li>
          <li>
            <a
              href="mailto:vishwasvishu2830@gmail.com"
              className="hover:text-black hover:underline inline-block transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              EMAIL
            </a>
          </li>
        </ul>

        {/* Card 1 Bottom Display Text */}
        <div className="relative pt-2 border-t border-[#2d2a26]/10">
          <span
            className="block text-[85px] sm:text-[112px] leading-[0.8] uppercase tracking-[-0.01em] text-[#2d2a26] select-none pointer-events-none"
            style={{ fontFamily: "var(--font-six-caps)" }}
          >
            VISHWAS K
          </span>

        </div>
      </div>

      {/* Card 2: Contact / Say Hi */}
      <div
        ref={card2Ref}
        className="absolute top-[40%] sm:top-[44%] md:top-[46%] right-[5%] sm:right-[10%] md:right-[16%] z-30 w-[260px] sm:w-[290px] h-[360px] sm:h-[400px] bg-white text-[#2d2a26] rounded-[14px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(45,42,38,0.18)] hover:shadow-[0_30px_70px_rgba(45,42,38,0.28)] flex flex-col justify-between cursor-grab active:cursor-grabbing touch-none select-none will-change-transform"
        style={{ transform: "rotate(8deg)" }}
      >
        {/* Card 2 Header */}
        <div>
          <span className="block text-[32px] sm:text-[36px] leading-[0.75] font-bold text-[#2d2a26] indent-[-2px]">
            ・
          </span>
          <div className="mt-2 text-[17px] sm:text-[20px] font-sans font-bold leading-[1.18] uppercase tracking-tight text-[#2d2a26]">
            <span>GET IN TOUCH</span>
            <span className="block">(SAY HI)</span>
          </div>
        </div>

        {/* Card 2 Links */}
        <ul className="space-y-1.5 text-[11px] sm:text-[12px] font-mono tracking-wider text-[#2d2a26]/75 uppercase">
          <li>
            <a
              href="mailto:vishwasvishu2830@gmail.com"
              className="hover:text-black hover:underline inline-block transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              vishwasvishu2830@gmail.com
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:underline inline-block transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              TWITTER / X
            </a>
          </li>
          <li>
            <a
              href="https://drive.google.com/file/d/13EvElbYmP60zFxeg9dc8gUGZz-HS2UzG/view?usp=sharing"
              className="hover:text-black hover:underline inline-block transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              READ RESUME
            </a>
          </li>
        </ul>

        {/* Card 2 Bottom Display Text */}
        <div className="relative pt-2 border-t border-[#2d2a26]/10">
          <span
            className="block text-[85px] sm:text-[112px] leading-[0.8] uppercase tracking-[-0.01em] text-[#2d2a26] select-none pointer-events-none"
            style={{ fontFamily: "var(--font-six-caps)" }}
          >
            SAY HI
          </span>

        </div>
      </div>
    </section>
  );
}
