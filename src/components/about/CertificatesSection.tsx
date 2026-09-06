"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import BounceLine from "@/components/dom/BounceLine";

interface Certificate {
  id: string;
  issuer: string;
  title: string;
  tag: string;
  cardBg: string;
  cardText: string;
  watermark: string;
}

const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "cert-01",
    issuer: "SWAYAM-NPTEL (IIT ROPAR)",
    title: "DEEP LEARNING",
    tag: "IIT ROPAR",
    cardBg: "#9dd5d6",
    cardText: "#1e5658",
    watermark: "DEEP",
  },
  {
    id: "cert-02",
    issuer: "SWAYAM-NPTEL",
    title: "SOFTWARE PROJECT MANAGEMENT",
    tag: "NPTEL",
    cardBg: "#fab740",
    cardText: "#7c5614",
    watermark: "SPM",
  },
  {
    id: "cert-03",
    issuer: "GOOGLE CLOUD",
    title: "GEN AI ACADEMY",
    tag: "GOOGLE",
    cardBg: "#7aa0d0",
    cardText: "#254167",
    watermark: "GENAI",
  },
  {
    id: "cert-04",
    issuer: "IBM SKILLSBUILD",
    title: "FRONTEND DEVELOPMENT",
    tag: "IBM",
    cardBg: "#df6588",
    cardText: "#6e1b34",
    watermark: "FRONT",
  },
];

/**
 * CertificatesSection
 *
 * 1:1 Architectural and Visual Translation of Hisami Kurita's legacy AwardSection.vue
 *
 * Visual & Structural Specs:
 * - Background: Dark Black ($darkBlack: #000)
 * - Layering: z-30 (sits above the z-20 expanding Eclipse Inversion circle)
 * - Entrance reveal: .certificate-reveal-item elements are initially hidden and staggered in by GSAP
 * - Right-side padding: pr-12 sm:pr-24 md:pr-32 lg:pr-36 xl:pr-[10vw] clears the custom fixed sidebar
 * - Cursor Follower: Floating verified credential preview card (CardAward.vue replica)
 */
export interface CertificatesSectionProps extends React.HTMLAttributes<HTMLElement> { }

const CertificatesSection = forwardRef<HTMLElement, CertificatesSectionProps>(
  (props, forwardedRef) => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardAreaRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

    // Forward ref to parent for GSAP ScrollTrigger orchestration
    useImperativeHandle(forwardedRef, () => sectionRef.current as HTMLElement);

    // Smooth mouse-following floating preview card (legacy CardAward cursor follower)
    useEffect(() => {
      const section = sectionRef.current;
      const cardArea = cardAreaRef.current;
      if (!section || !cardArea) return;

      // Check if device supports fine pointer (mouse)
      const isPointerFine = window.matchMedia("(pointer: fine)").matches;
      if (!isPointerFine) return;

      const xTo = gsap.quickTo(cardArea, "x", { duration: 0.35, ease: "power2.out" });
      const yTo = gsap.quickTo(cardArea, "y", { duration: 0.35, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        const relX = e.clientX - rect.left - 117; // offset by half card width (234px / 2)
        const relY = e.clientY - rect.top - 160; // offset by half card height (320px / 2)
        xTo(relX);
        yTo(relY);
      };

      section.addEventListener("mousemove", handleMouseMove);
      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    return (
      <section
        ref={sectionRef}
        id="certificates"
        {...props}
        className={`relative z-30 w-full bg-black text-[#828282] overflow-hidden select-none ${props.className || ""
          }`}
      >
        {/* ─── Floating Cursor-Tracked Certificate Preview Card (CardAward.vue 1:1 Replica) ─── */}
        <div
          ref={cardAreaRef}
          className="pointer-events-none select-none absolute top-0 left-0 z-40 hidden md:block will-change-transform"
          style={{
            opacity: activeCardIndex !== null ? 1 : 0,
            transform: `scale(${activeCardIndex !== null ? 1 : 0.85})`,
            transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
          }}
        >
          {activeCardIndex !== null && (
            <div
              className="pointer-events-none select-none relative w-[234px] h-[320px] rounded-[10px] p-[28px_18px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: CERTIFICATES_DATA[activeCardIndex].cardBg,
                color: CERTIFICATES_DATA[activeCardIndex].cardText,
                pointerEvents: "none",
              }}
            >
              {/* Top Dot & Issuer Indicator */}
              <div className="pointer-events-none flex items-center gap-1.5 opacity-90">
                <span className="text-[24px] leading-none indent-[-1px]">・</span>
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase font-bold">
                  {CERTIFICATES_DATA[activeCardIndex].tag}
                </span>
              </div>

              {/* Credential Status */}
              <p className="pointer-events-none mt-3 text-[11px] font-[helvetica,Arial,sans-serif] tracking-[0.02em] uppercase opacity-80 leading-tight">
                VERIFIED CREDENTIAL
              </p>

              {/* Issuer */}
              <p className="pointer-events-none text-[10px] font-[helvetica,Arial,sans-serif] tracking-[0.02em] uppercase opacity-70 mt-0.5">
                {CERTIFICATES_DATA[activeCardIndex].issuer}
              </p>

              {/* Certificate Title */}
              <h3 className="pointer-events-none mt-4 text-[13px] font-bold font-[helvetica,Arial,sans-serif] tracking-[0.01em] uppercase leading-[1.25] text-black">
                {CERTIFICATES_DATA[activeCardIndex].title}
              </h3>

              {/* Giant Six Caps Watermark in Card Bottom */}
              <div
                className="pointer-events-none absolute -bottom-[11px] left-0 w-full text-[120px] leading-none uppercase select-none opacity-40 px-3 overflow-hidden"
                style={{ fontFamily: "var(--font-six-caps)" }}
              >
                {CERTIFICATES_DATA[activeCardIndex].watermark}
              </div>
            </div>
          )}
        </div>

        {/* ─── Main Content Container (legacy .award-inner & .l-container) ─── */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-[40px] py-[63px] md:py-[152px]">
          <div className="w-full flex flex-col lg:flex-row lg:items-start justify-between gap-12 lg:gap-16">

            {/* ─── Left Column: Sticky Section Title (Revealed in Stagger) ─── */}
            <div className="certificate-reveal-item lg:w-[220px] xl:w-[260px] shrink-0 lg:sticky lg:top-[140px] self-start will-change-transform">
              <div className="flex flex-col">
                {/* Decorative top dot */}
                <span className="block text-[36px] max-[767px]:text-[28px] leading-[0.79] indent-[-2px] max-[767px]:indent-0 text-[#f0efeb] font-[helvetica,Arial,sans-serif]">
                  ・
                </span>
                {/* Section Header */}
                <h2 className="text-[14px] max-[767px]:text-[10px] tracking-[0.02em] font-[helvetica,Arial,sans-serif] uppercase text-[#828282] mt-1">
                  CERTIFICATES
                </h2>
              </div>
            </div>

            {/* ─── Right Column: Certificate List Container with Aggressive Right Padding ─── */}
            <div
              className="flex-1 w-full max-w-[1050px] pr-12 sm:pr-24 md:pr-32 lg:pr-36 xl:pr-[10vw]"
              onMouseLeave={() => setActiveCardIndex(null)}
            >
              <div className="relative w-full">
                {CERTIFICATES_DATA.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="certificate-reveal-item group relative w-full flex flex-col md:flex-row md:items-baseline justify-between py-6 sm:py-8 border-t border-[#828282]/30 text-[#828282] hover:text-white transition-colors duration-300 cursor-pointer will-change-transform"
                    onMouseEnter={() => setActiveCardIndex(index)}
                  >
                    {/* Interactive BounceLine Divider (strictly pointer-events: none) */}
                    <BounceLine
                      width={1000}
                      strokeColor="#828282"
                      style={{ pointerEvents: "none" }}
                      className="!pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Left Column in Row: Issuer */}
                    <p className="pointer-events-none relative top-0 md:top-[2px] shrink-0 w-full md:w-[240px] text-[12px] md:text-[14px] font-[helvetica,Arial,sans-serif] tracking-[0.02em] uppercase text-[#828282] group-hover:text-white transition-colors duration-300 mb-2 md:mb-0">
                      {cert.issuer}
                    </p>

                    {/* Center/Right in Row: Ultra-Condensed Title */}
                    <p
                      className="pointer-events-none flex-1 text-[clamp(44px,5.8vw,68px)] max-[767px]:text-[clamp(36px,10vw,48px)] leading-[0.88] tracking-[0.02em] uppercase text-[#828282] group-hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "var(--font-six-caps)" }}
                    >
                      {cert.title}
                    </p>

                    {/* Right-most column in Row: Tag / Category */}
                    <p
                      className="pointer-events-none shrink-0 hidden sm:block text-[clamp(36px,4.5vw,56px)] leading-[0.88] tracking-[0.02em] uppercase text-[#828282]/50 group-hover:text-white/80 transition-colors duration-300 md:ml-4"
                      style={{ fontFamily: "var(--font-six-caps)" }}
                    >
                      {cert.tag}
                    </p>
                  </div>
                ))}

                {/* Bottom Closing Line (strictly pointer-events: none) */}
                <div className="relative w-full h-[1px] border-b border-[#828282]/30 !pointer-events-none">
                  <BounceLine
                    width={1000}
                    strokeColor="#828282"
                    style={{ pointerEvents: "none" }}
                    className="!pointer-events-none opacity-40"
                  />
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>
    );
  }
);

CertificatesSection.displayName = "CertificatesSection";

export default CertificatesSection;
