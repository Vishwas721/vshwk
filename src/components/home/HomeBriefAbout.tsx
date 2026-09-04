"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import BounceLine from "@/components/dom/BounceLine";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
}

/**
 * Desktop Headline Text Lines
 * Exact 1:1 match with legacy AboutSection.vue:
 * Line 0 ends with "LA", Line 1 with "PASSION", Line 2 with "STREN", Line 3 is "GTH IS INSATIABLE CURIOSITY."
 * The syllables intentionally carry across lines (LA-TER, PASSION-ATE, STREN-GTH) as an editorial design block.
 */
const DESKTOP_TITLE_LINES = [
  {
    text: "IN THE SUMMER OF 22, I STARTED PROGRAMMING. IT WAS LA",
    rotate: 3,
    isRightAlign: true,
    delay: 0,
    hasPaddingRight: false,
  },
  {
    text: "TER THAN MOST, BUT I THINK I FOUND SOMETHING THAT I WAS PASSION",
    rotate: -3,
    isRightAlign: false,
    delay: 0.12,
    hasPaddingRight: false,
  },
  {
    text: "ATE ABOUT. I'VE BEEN WRITING CODE EVERY DAY EVER SINCE. MY STREN",
    rotate: 3,
    isRightAlign: false,
    delay: 0.24,
    hasPaddingRight: false,
  },
  {
    text: "GTH IS INSATIABLE CURIOSITY.",
    rotate: -3,
    isRightAlign: false,
    delay: 0.36,
    hasPaddingRight: true, // legacy .about-title-wrapper-04: padding: 0 vw(150) 0 0
  },
];

/**
 * Mobile Headline Chunks
 * Matching legacy AboutSection.vue .sp-only block
 */
const MOBILE_TITLE_FLOW = [
  { text: "STARTED PROGRAMMING. IT WA", br: true },
  { text: "S LATER THAN MOST, BUT I THI", br: true },
  { text: "NK I FOUND SOMETHING THAT I", br: true },
  { text: "WAS PASSIONATE ABOUT. I'VE B", br: true },
  { text: "EEN WRITING CODE EVERY DAY", br: true },
  { text: "EVER SINCE. MY STRENGTH IS", br: true },
  { text: "INSATIABLE CURIOSITY.", br: false },
];

/**
 * Footer Paragraph Text Lines (Desktop)
 * Exact 1:1 match with legacy AboutSection.vue AppReadTitle
 */
const FOOTER_LINES = [
  "THE VISUAL EXPRESSIONS THAT I AM EXPLORING ON A DAILY BASIS ARE AVAILABLE ON CODEPEN AND",
  "GITHUB, RANGING FROM CSS ANIMATION TO EXPRESSIONS IN THREE.JS. NOT",
  "ALL OF MY WORK IS AVAILABLE ON GITHUB OR CODEPEN,",
  "BUT YOU CAN FIND LINKS TO IT IN MY PORTFOLIO.",
];

/**
 * HomeBriefAbout — Homepage brief introductory "About" section
 *
 * 1:1 Replication of legacy 2022 Vue/Nuxt AboutSection:
 * - Fluid typography: exact vw math based on 1280px design viewport (vw(80) = 6.25vw, line-height: 0.964)
 * - Container bounds: width: vw(1090) = 85.156vw, padding: 0 56px 0 40px
 * - Right-aligned Line 0 leaving space for absolute "・ ABOUT" indicator at top-left
 * - Whitespace nowrap on line blocks preventing premature wrapping
 * - BounceLine separator with spring interaction
 * - Right-aligned footer read text in 12px tight Helvetica
 * - ScrollTrigger staggered reveal with signature Kurita CustomEase curve
 */
export default function HomeBriefAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Signature legacy bezier easing curve: M0,0 C0.44,0.05 0.17,1 1,1
      let kuritaEase: string;
      try {
        CustomEase.create("kuritaTransform", "M0,0 C0.44,0.05 0.17,1 1,1");
        kuritaEase = "kuritaTransform";
      } catch {
        kuritaEase = "power3.out";
      }

      const triggerEl = triggerRef.current || sectionRef.current;
      if (!triggerEl) return;

      // 2. Initial Setup: Set rotation & masked position
      // Indicator items
      gsap.set(".about-read-dot-wrap", { rotate: 3, transformOrigin: "left bottom" });
      gsap.set(".about-read-dot-block", { yPercent: 105, opacity: 1 });
      gsap.set(".about-read-text-wrap", { rotate: 3, transformOrigin: "left bottom" });
      gsap.set(".about-read-text-block", { yPercent: 105, opacity: 1 });

      // Title lines (desktop)
      DESKTOP_TITLE_LINES.forEach((line, i) => {
        const origin = line.rotate > 0 ? "left bottom" : "right bottom";
        gsap.set(`.pc-title-wrap-${i}`, { rotate: line.rotate, transformOrigin: origin });
        gsap.set(`.pc-title-block-${i}`, { yPercent: 105, opacity: 1 });
      });

      // Title lines (mobile)
      gsap.set(".sp-title-wrap-0", { rotate: 3, transformOrigin: "left bottom" });
      gsap.set(".sp-title-block-0", { yPercent: 127, opacity: 1 });
      MOBILE_TITLE_FLOW.forEach((_, i) => {
        const rotate = (i + 1) % 2 === 0 ? 3 : -3;
        const origin = rotate > 0 ? "left bottom" : "right bottom";
        gsap.set(`.sp-title-wrap-${i + 1}`, { rotate, transformOrigin: origin });
        gsap.set(`.sp-title-block-${i + 1}`, { yPercent: 127, opacity: 1 });
      });

      // Separator line
      gsap.set(".about-bounce-line", { scaleX: 0, transformOrigin: "left center" });

      // Footer paragraph lines
      FOOTER_LINES.forEach((_, i) => {
        gsap.set(`.footer-line-wrap-${i}`, { rotate: 3, transformOrigin: "left bottom" });
        gsap.set(`.footer-line-block-${i}`, { yPercent: 105, opacity: 1 });
      });

      // 3. Main Entrance ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 78%",
          once: true,
        },
      });

      // 3.1 Indicator reveal
      tl.to(".about-read-dot-wrap", { rotate: 0, duration: 2.0, ease: kuritaEase }, 0.0);
      tl.to(".about-read-dot-block", { yPercent: 0, duration: 1.0, ease: kuritaEase }, 0.0);
      tl.to(".about-read-text-wrap", { rotate: 0, duration: 2.0, ease: kuritaEase }, 0.12);
      tl.to(".about-read-text-block", { yPercent: 0, duration: 1.0, ease: kuritaEase }, 0.12);

      // 3.2 Desktop Headline reveal
      DESKTOP_TITLE_LINES.forEach((line, i) => {
        tl.to(`.pc-title-wrap-${i}`, { rotate: 0, duration: 2.0, ease: kuritaEase }, line.delay);
        tl.to(`.pc-title-block-${i}`, { yPercent: 0, duration: 1.0, ease: kuritaEase }, line.delay);
      });

      // 3.3 Mobile Headline reveal
      tl.to(".sp-title-wrap-0", { rotate: 0, duration: 2.0, ease: kuritaEase }, 0);
      tl.to(".sp-title-block-0", { yPercent: 0, duration: 1.0, ease: kuritaEase }, 0);
      MOBILE_TITLE_FLOW.forEach((_, i) => {
        const lineDelay = 0.08 * (i + 1);
        tl.to(`.sp-title-wrap-${i + 1}`, { rotate: 0, duration: 2.0, ease: kuritaEase }, lineDelay);
        tl.to(`.sp-title-block-${i + 1}`, { yPercent: 0, duration: 1.0, ease: kuritaEase }, lineDelay);
      });

      // 3.4 Separator line reveal (start: 0.60 matching legacy)
      tl.to(
        ".about-bounce-line",
        {
          scaleX: 1,
          duration: 1.0,
          ease: kuritaEase,
        },
        0.60
      );

      // 3.5 Footer read text reveal (start: 0.48, staggered by 0.12)
      FOOTER_LINES.forEach((_, i) => {
        const lineDelay = 0.48 + i * 0.12;
        tl.to(`.footer-line-wrap-${i}`, { rotate: 0, duration: 2.0, ease: kuritaEase }, lineDelay);
        tl.to(`.footer-line-block-${i}`, { yPercent: 0, duration: 1.0, ease: kuritaEase }, lineDelay);
      });

      // Recalculate on resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="About brief introduction"
      className="relative w-full bg-transparent select-none z-10 overflow-hidden md:overflow-visible"
    >
      {/* 
        .about-inner padding extracted from legacy SCSS:
        - Desktop: pt-[333px] pb-[568px]
        - Tablet Vertical (<= 1028px): pt-[213px] pb-[448px]
        - Mobile (<= 767px): pt-[118px] pb-[340px]
      */}
      <div className="relative w-full pt-[118px] pb-[340px] max-[1028px]:pt-[213px] max-[1028px]:pb-[448px] md:pt-[333px] md:pb-[568px]">
        {/* 
          .l-container:
          width: 100%; padding: 0 40px; (Mobile: 0 vw_sp(20) = 0 2.667vw)
        */}
        <div
          ref={triggerRef}
          className="relative w-full px-[40px] max-[767px]:px-[2.667vw]"
        >
          {/* 
            .about-title:
            - Desktop: width: vw(1090) = 85.156vw, margin: 0 0 85px 0, padding: 0 56px 0 40px, font-size: vw(80) = 6.25vw, line-height: 0.964
            - Tab (<= 1280px): width: vw(1070) = 83.594vw, padding: 0 vw(56) 0 vw(40) = 0 4.375vw 0 3.125vw, font-size: vw(76) = 5.938vw, line-height: 1
            - Tab Vertical (<= 1028px): width: vw(998) = 77.969vw, font-size: vw(70) = 5.469vw
            - SP (<= 767px): width: auto, margin: 0 0 54px 0, padding: 0 vw_sp(20) = 0 2.667vw, font-size: vw_sp(120) = 16vw, white-space: nowrap
          */}
          <h2
            className="relative text-[#0d4c82] uppercase mb-[85px] max-[767px]:mb-[54px]
              w-[85.156vw] max-[1280px]:w-[83.594vw] max-[1028px]:w-[77.969vw] max-[767px]:w-auto
              pl-[40px] pr-[56px] max-[1280px]:pl-[3.125vw] max-[1280px]:pr-[4.375vw] max-[767px]:px-[2.667vw]
              text-[6.25vw] max-[1280px]:text-[5.938vw] max-[1028px]:text-[5.469vw] max-[767px]:text-[16vw]
              leading-[0.964] max-[1280px]:leading-[1] max-[767px]:whitespace-nowrap"
            style={{
              fontFamily: "var(--font-six-caps)",
            }}
          >
            {/* ─── Top-Left Indicator ("・ ABOUT") ─── */}
            <div
              className="absolute top-[-20px] md:top-[-24px] max-[767px]:top-[-14px] -translate-y-1.5 left-[42px] max-[1028px]:left-[3.594vw] max-[767px]:left-[9px] z-20 pointer-events-none text-white font-[helvetica,Arial,sans-serif]"
              aria-hidden="true"
            >
              {/* Dot '・' */}
              <span className="block overflow-hidden leading-[0.79]">
                <span className="about-read-dot-wrap inline-block overflow-hidden">
                  <span className="about-read-dot-block inline-block text-[36px] max-[1028px]:text-[30px] max-[767px]:text-[28px] leading-[0.79] indent-[-2px] max-[1028px]:indent-[-1.6px] max-[767px]:indent-0">
                    ・
                  </span>
                </span>
              </span>
              {/* 'ABOUT' text */}
              <span className="block overflow-hidden mt-0.5">
                <span className="about-read-text-wrap inline-block overflow-hidden">
                  <span className="about-read-text-block inline-block text-[12px] max-[1028px]:text-[10px] max-[767px]:text-[10px] tracking-[0.02em] leading-[1.04]">
                    ABOUT
                  </span>
                </span>
              </span>
            </div>

            {/* ─── PC/Tablet Main Title Block with exact legacy SCSS math ─── */}
            <div className="hidden md:block w-full">
              {DESKTOP_TITLE_LINES.map((line, idx) => (
                <div
                  key={idx}
                  className={`block w-full ${line.isRightAlign ? "text-right" : "text-left"} ${line.hasPaddingRight ? "pr-[11.719vw]" : ""
                    }`}
                >
                  <span className="app-text-animation block pointer-events-none select-none">
                    <span
                      className={`pc-title-wrap-${idx} app-text-animation-wrapper inline-block relative overflow-hidden`}
                    >
                      <span
                        className={`pc-title-block-${idx} app-text-animation-block inline-block opacity-0 whitespace-nowrap`}
                      >
                        {line.text}
                      </span>
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* ─── Mobile Main Title Block ─── */}
            <div className="block md:hidden w-full text-[16vw] leading-[0.964] whitespace-nowrap">
              <div className="block text-right">
                <span className="sp-title-wrap-0 inline-block relative overflow-hidden">
                  <span className="sp-title-block-0 inline-block opacity-0 whitespace-nowrap">
                    IN THE SUMMER OF 22, I
                  </span>
                </span>
              </div>
              <div className="block text-left whitespace-normal">
                {MOBILE_TITLE_FLOW.map((chunk, idx) => (
                  <span key={idx} className="inline">
                    <span
                      className={`sp-title-wrap-${idx + 1} inline-block relative overflow-hidden`}
                    >
                      <span
                        className={`sp-title-block-${idx + 1} inline-block opacity-0 whitespace-nowrap`}
                      >
                        {chunk.text}
                      </span>
                    </span>
                    {chunk.br && <br />}
                  </span>
                ))}
              </div>
            </div>

            {/* ─── 1px Horizontal BounceLine Separator (Desktop) ─── */}
            <div className="hidden md:block relative w-full mt-6 md:mt-10 h-[1px]">
              <BounceLine
                width={1000}
                origin="left"
                strokeColor="#0d4c82"
                autoPlay={false}
                className="about-bounce-line"
              />
            </div>

            {/* ─── Mobile Static Underline ─── */}
            <span className="block md:hidden absolute bottom-[-34px] right-[2.667vw] w-[calc(100%-5.333vw)] h-[1px] bg-[#0d4c82]" />
          </h2>

          {/* ─── Right-Aligned Footer Text Block ─── */}
          {/*
            .about-read-text:
            - Desktop: width: vw(1090) = 85.156vw, padding: 0 56px 0 40px, font-size: 12px, text-align: right, letter-spacing: 0.02em
            - Tab (<= 1280px): padding: 0 vw(75) 0 vw(40) = 0 5.859vw 0 3.125vw
            - Tab Vertical (<= 1028px): padding: 0 vw(160) 0 40px = 0 12.5vw 0 40px
            - SP (<= 767px): width: calc(270px + vw_sp(20)), margin: 0 0 0 auto, padding: 0 vw_sp(20), font-size: 10px, line-height: 1.3
          */}
          <p
            className="text-[#0d4c82] text-right font-[helvetica,Arial,sans-serif] tracking-[0.02em]
              w-[85.156vw] max-[1280px]:w-[83.594vw] max-[1028px]:w-[77.969vw] max-[767px]:w-[calc(270px+2.667vw)] max-[767px]:ml-auto
              pl-[40px] pr-[56px] max-[1280px]:pl-[3.125vw] max-[1280px]:pr-[5.859vw] max-[1028px]:pl-[40px] max-[1028px]:pr-[12.5vw] max-[767px]:px-[2.667vw]
              text-[12px] max-[767px]:text-[10px] max-[767px]:leading-[1.3]"
          >
            {/* Desktop Paragraph with line-by-line staggered reveal */}
            <span className="hidden md:block">
              {FOOTER_LINES.map((text, idx) => (
                <span
                  key={idx}
                  className="block overflow-hidden w-full break-normal whitespace-normal"
                >
                  <span
                    className={`footer-line-wrap-${idx} block w-full relative overflow-hidden break-normal whitespace-normal`}
                  >
                    <span
                      className={`footer-line-block-${idx} block w-full break-normal whitespace-normal`}
                    >
                      {text}
                    </span>
                  </span>
                </span>
              ))}
            </span>

            {/* Mobile Paragraph: continuous flow */}
            <span className="block md:hidden">
              THE VISUAL EXPRESSIONS THAT I AM EXPLORING ON A DAILY BASIS ARE AVAILABLE ON CODEPEN AND
              GITHUB, RANGING FROM CSS ANIMATION TO EXPRESSIONS IN THREE.JS. NOT ALL OF MY WORK IS
              AVAILABLE ON GITHUB OR CODEPEN, BUT YOU CAN FIND LINKS TO IT IN MY PORTFOLIO.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
