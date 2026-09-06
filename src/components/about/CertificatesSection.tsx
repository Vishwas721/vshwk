"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import BounceLine from "@/components/dom/BounceLine";

interface Certificate {
  id: string;
  issuer: string;
  title: string;
  tag: string;
  category?: string;
  href: string;
  cardBg: string;
  cardText: string;
  watermark: string;
}

const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "cert-01",
    issuer: "COURSERA",
    title: "IBM GENERATIVE AI ENGINEERING",
    tag: "PROFESSIONAL CERTIFICATE",
    category: "PROFESSIONAL CERTIFICATE",
    href: "https://www.coursera.org/account/accomplishments/professional-cert/NDGS5TPT75ZS",
    cardBg: "#9dd5d6",
    cardText: "#1e5658",
    watermark: "GEN AI",
  },
  {
    id: "cert-02",
    issuer: "UDEMY",
    title: "FULL-STACK WEB DEVELOPMENT",
    tag: "62-HOUR BOOTCAMP",
    category: "62-HOUR BOOTCAMP",
    href: "https://www.udemy.com/certificate/UC-2ac2b41e-53ac-4925-ab1e-8ad8932076e8/",
    cardBg: "#fab740",
    cardText: "#7c5614",
    watermark: "BOOTCAMP",
  },
  {
    id: "cert-03",
    issuer: "AICTE / EDUNET",
    title: "FRONT END WEB DEV INTERNSHIP",
    tag: "6-WEEK INTERNSHIP",
    category: "6-WEEK INTERNSHIP",
    href: "https://github.com/Vishwas721/Certificates/blob/main/AICTE%20B3_PD_2001-3491-1424.pdf",
    cardBg: "#7aa0d0",
    cardText: "#254167",
    watermark: "INTERN",
  },
  {
    id: "cert-04",
    issuer: "AWS",
    title: "SOLUTIONS ARCHITECTURE",
    tag: "JOB SIMULATION",
    category: "JOB SIMULATION",
    href: "https://github.com/Vishwas721/Certificates/blob/main/vishwasamazon.pdf",
    cardBg: "#df6588",
    cardText: "#6e1b34",
    watermark: "CLOUD",
  },
  {
    id: "cert-05",
    issuer: "DELOITTE",
    title: "TECHNOLOGY",
    tag: "JOB SIMULATION",
    category: "JOB SIMULATION",
    href: "https://github.com/Vishwas721/Certificates/blob/main/vishwasdeloitee.pdf",
    cardBg: "#a3d9a5",
    cardText: "#215c23",
    watermark: "TECH",
  },
  {
    id: "cert-06",
    issuer: "BRITISH AIRWAYS",
    title: "DATA SCIENCE",
    tag: "JOB SIMULATION",
    category: "JOB SIMULATION",
    href: "https://github.com/Vishwas721/Certificates/blob/main/britishvishwas.pdf",
    cardBg: "#c4a7e7",
    cardText: "#4b2a75",
    watermark: "DATA",
  },
  {
    id: "cert-07",
    issuer: "TATA",
    title: "DATA VISUALISATION",
    tag: "JOB SIMULATION",
    category: "JOB SIMULATION",
    href: "https://github.com/Vishwas721/Certificates/blob/main/vishwastat.pdf",
    cardBg: "#f9a875",
    cardText: "#7a350c",
    watermark: "VISUAL",
  },
  {
    id: "cert-08",
    issuer: "QUANT MASTERS",
    title: "LOW CODE/NO CODE AI DEV",
    tag: "SKILL DEVELOPMENT",
    category: "SKILL DEVELOPMENT",
    href: "https://github.com/Vishwas721/Certificates/blob/main/Vishwas_K_R23EQ134_QMI159.pdf",
    cardBg: "#e5a4be",
    cardText: "#6e1f3a",
    watermark: "NO CODE",
  },
  {
    id: "cert-09",
    issuer: "IBM SKILLSBUILD",
    title: "AGILE EXPLORER",
    tag: "CREDENTIAL",
    category: "CREDENTIAL",
    href: "https://github.com/Vishwas721/Certificates/blob/main/Vish%20agile.pdf",
    cardBg: "#d2bc95",
    cardText: "#5e4042",
    watermark: "AGILE",
  },
  {
    id: "cert-10",
    issuer: "IBM SKILLSBUILD",
    title: "WEB DEV FUNDAMENTALS",
    tag: "CREDENTIAL",
    category: "CREDENTIAL",
    href: "https://github.com/Vishwas721/Certificates/blob/main/IBMDesign20251001-31-ok4kot.pdf",
    cardBg: "#abc2cb",
    cardText: "#2a4a58",
    watermark: "FUNDAMENTALS",
  },
  {
    id: "cert-11",
    issuer: "IBM SKILLSBUILD",
    title: "EDUNET FRONT END",
    tag: "CREDENTIAL",
    category: "CREDENTIAL",
    href: "https://github.com/Vishwas721/Certificates/blob/main/Vishwas.pdf",
    cardBg: "#d6e291",
    cardText: "#4d5c19",
    watermark: "FRONTEND",
  },
  {
    id: "cert-12",
    issuer: "IBM SKILLSBUILD",
    title: "GITHUB BLOG",
    tag: "CREDENTIAL",
    category: "CREDENTIAL",
    href: "https://github.com/Vishwas721/Certificates/blob/main/vishwasgithub.pdf",
    cardBg: "#f4a261",
    cardText: "#6d3106",
    watermark: "GITHUB",
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
              <div
                className="pointer-events-none flex items-center gap-1.5 opacity-90"
                style={{ color: CERTIFICATES_DATA[activeCardIndex].cardText }}
              >
                <span className="text-[24px] leading-none indent-[-1px]">・</span>
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase font-bold">
                  {CERTIFICATES_DATA[activeCardIndex].tag}
                </span>
              </div>

              {/* Credential Status */}
              <p
                className="pointer-events-none mt-3 text-[11px] font-[helvetica,Arial,sans-serif] tracking-[0.02em] uppercase opacity-80 leading-tight"
                style={{ color: CERTIFICATES_DATA[activeCardIndex].cardText }}
              >
                VERIFIED CREDENTIAL
              </p>

              {/* Issuer */}
              <p
                className="pointer-events-none text-[10px] font-[helvetica,Arial,sans-serif] tracking-[0.02em] uppercase opacity-70 mt-0.5"
                style={{ color: CERTIFICATES_DATA[activeCardIndex].cardText }}
              >
                {CERTIFICATES_DATA[activeCardIndex].issuer}
              </p>

              {/* Certificate Title */}
              <h3
                className="pointer-events-none mt-4 text-[13px] font-bold font-[helvetica,Arial,sans-serif] tracking-[0.01em] uppercase leading-[1.25]"
                style={{ color: CERTIFICATES_DATA[activeCardIndex].cardText }}
              >
                {CERTIFICATES_DATA[activeCardIndex].title}
              </h3>

              {/* Giant Six Caps Watermark in Card Bottom */}
              <div
                className="pointer-events-none absolute -bottom-[11px] left-0 w-full text-[120px] leading-none uppercase select-none opacity-40 px-3 overflow-hidden"
                style={{
                  fontFamily: "var(--font-six-caps)",
                  color: CERTIFICATES_DATA[activeCardIndex].cardText,
                }}
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
                  <a
                    key={cert.id}
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certificate-reveal-item group relative w-full flex flex-col md:flex-row md:items-baseline justify-between py-6 sm:py-8 border-t border-[#828282]/30 text-[#828282] hover:text-white transition-colors duration-300 cursor-pointer will-change-transform no-underline"
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
                  </a>
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
