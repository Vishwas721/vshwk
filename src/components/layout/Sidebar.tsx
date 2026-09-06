"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useUIStore } from "@/store/useUIStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

/**
 * Real Project Roster for Interactive Sidebar
 */
export interface ProjectRosterItem {
  id: string;
  title: string;
  desc: string;
  tech: string;
  image: string;
  link: string;
}

export const WORKS_DATA: ProjectRosterItem[] = [
  {
    id: "01",
    title: "Privex",
    desc: "Privacy-focused local visual firewall and memory agent.",
    tech: "YOLOv8, LangGraph, FastAPI, pgvector, Neo4j",
    image: "/images/poster-mtrust.webp",
    link: "https://github.com/Vishwas721/privex",
  },
  {
    id: "02",
    title: "NagarikOne",
    desc: "Civic issue reporting platform with 50m geospatial duplicate detection.",
    tech: "PERN Stack, React Native, PostGIS, Gemini API",
    image: "/images/poster-ketakuma.webp",
    link: "https://github.com/Vishwas721/nagarikone",
  },
  {
    id: "03",
    title: "SummAID",
    desc: "AI-powered clinical intelligence platform for medical reports.",
    tech: "FastAPI, pgvector, local LLMs, React",
    image: "/images/poster-yakudoh.webp",
    link: "https://github.com/Vishwas721/summaid",
  },
  {
    id: "04",
    title: "Prism",
    desc: "AI prior authorization review platform.",
    tech: "Azure AI Document Intelligence, Azure OpenAI, FastAPI, React",
    image: "/images/poster-frontier.webp",
    link: "https://github.com/Vishwas721/prism",
  },
  {
    id: "05",
    title: "Gesto",
    desc: "Real-time sign language to code converter.",
    tech: "Python, MediaPipe, OpenCV",
    image: "/images/poster-basta.webp",
    link: "https://github.com/Vishwas721/gesto",
  },
  {
    id: "06",
    title: "RegeneX",
    desc: "Drug repurposing platform for rare diseases.",
    tech: "PyTorch Geometric, Neo4j",
    image: "/images/poster-redandgreen.webp",
    link: "https://github.com/Vishwas721/regenex",
  },
];

/**
 * Sidebar — 1:1 Architectural & UX Replica of Hisami Kurita's BaseHambergerMenu.vue
 *
 * Core Enhancements:
 * 1. Lenis Scroll Isolation:
 *    - data-lenis-prevent="true" and data-lenis-prevent-wheel="true" on <aside> and scroll container
 *    - overscroll-contain and onWheel propagation stop so parent website scroll is never triggered
 * 2. Overflow & Text Wrapping:
 *    - overflow-y-auto + overflow-x-hidden strictly enforced
 *    - break-words + w-full on all text nodes for fluid, dynamic wrapping without clipping or horizontal overflow
 *    - Hidden native scrollbar UX ([&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none])
 * 3. Grey Gutter Elimination:
 *    - 100% transparent click-away backdrop
 *    - Panel layers strictly bound to 510px width with rounded-l-[2rem]
 * 4. Close Button:
 *    - Perfect circle (rounded-full aspect-square w-[86px] h-[86px])
 *    - Positioned to intersect the left boundary of the 510px sidebar panel
 *    - Signature morphing into a centered 45°/ -45° close 'X'
 * 5. Exact Legacy Typography:
 *    - Six Caps 120px for "HISAMIKURITA" and "ABOUT"
 *    - Six Caps 56px for work titles
 *    - Helvetica 10px (leading: 1.3, tracking: 0.02em) for descriptions
 */
export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useUIStore();

  const rootRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnHoverRef = useRef<HTMLSpanElement>(null);
  const openareaRef = useRef<HTMLSpanElement>(null);
  const line01Ref = useRef<HTMLSpanElement>(null);
  const line02Ref = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  useGSAP(
    () => {
      let kuritaEase: string;
      try {
        CustomEase.create("kuritaTransform", "M0,0 C0.44,0.05 0.17,1 1,1");
        kuritaEase = "kuritaTransform";
      } catch {
        kuritaEase = "power3.out";
      }

      const isMobile = window.innerWidth <= 767;

      // Ensure Tailwind translate utility does not conflict with GSAP transform
      if (rootRef.current) {
        rootRef.current.style.translate = "none";
      }

      // On initial mount, establish clean off-screen state without running close animation
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (rootRef.current) {
          gsap.set(rootRef.current, { xPercent: 100 });
          rootRef.current.style.pointerEvents = "none";
        }
        if (btnRef.current) {
          gsap.set(btnRef.current, { autoAlpha: 0, scale: 0.8 });
          btnRef.current.style.pointerEvents = "none";
        }
        if (contentsRef.current) {
          gsap.set(contentsRef.current, { autoAlpha: 0 });
          contentsRef.current.style.pointerEvents = "none";
        }
        gsap.set(".sidebar-item-wrapper", { y: 180 });
        gsap.set(".sidebar-title-item", { y: 40, opacity: 0 });
        return;
      }

      if (isSidebarOpen) {
        if (!isMobile) {
          // ─── Desktop Open Animation ───
          // Root panel slides in with the website push
          if (rootRef.current) {
            rootRef.current.style.pointerEvents = "auto";
            gsap.to(rootRef.current, {
              xPercent: 0,
              duration: 0.3,
              delay: 0.16,
              ease: kuritaEase,
            });
          }

          if (contentsRef.current) {
            gsap.set(contentsRef.current, { autoAlpha: 1 });
            contentsRef.current.style.pointerEvents = "auto";
          }

          // Button morphs into perfect circle on the seam (-left-[43px])
          if (btnRef.current) {
            btnRef.current.style.pointerEvents = "auto";
            gsap.to(btnRef.current, {
              delay: 0.16,
              duration: 0.25,
              ease: kuritaEase,
              autoAlpha: 1,
              scale: 1,
            });
            gsap.to(btnHoverRef.current, {
              duration: 0.2,
              ease: kuritaEase,
              borderRadius: 100,
              boxShadow: "0px 10px 20px 5px rgba(193, 193, 192, 0.15)",
            });

            // Morph 2 horizontal lines into a 45° close 'X'
            gsap.to(line01Ref.current, {
              duration: 0.2,
              ease: kuritaEase,
              top: 3,
              height: 9,
              borderRadius: 4,
              rotate: 45,
            });
            gsap.to(line02Ref.current, {
              duration: 0.2,
              ease: kuritaEase,
              bottom: 2,
              height: 9,
              borderRadius: 4,
              rotate: -45,
            });
            gsap.to(openareaRef.current, {
              duration: 0.2,
              ease: kuritaEase,
              scale: 0.6,
            });
          }

          // Staggered reveal of titles and works cards
          gsap.to(".sidebar-title-item", {
            duration: 1.0,
            delay: 0.26,
            ease: kuritaEase,
            stagger: { each: 0.1 },
            y: 0,
            opacity: 1,
          });
          gsap.to(".sidebar-item-wrapper", {
            duration: 1.0,
            delay: 0.36,
            ease: kuritaEase,
            stagger: { each: 0.12 },
            y: 0,
          });
        } else {
          // ─── Mobile Open Animation ───
          if (rootRef.current) {
            rootRef.current.style.pointerEvents = "auto";
            gsap.to(rootRef.current, {
              xPercent: 0,
              duration: 0.3,
              delay: 0.16,
              ease: kuritaEase,
            });
          }

          if (contentsRef.current) {
            gsap.set(contentsRef.current, { autoAlpha: 1 });
            contentsRef.current.style.pointerEvents = "auto";
          }

          // Mobile button reveals on seam
          if (btnRef.current) {
            btnRef.current.style.pointerEvents = "auto";
            gsap.to(btnRef.current, {
              duration: 0.2,
              ease: kuritaEase,
              autoAlpha: 1,
              scale: 1,
            });
            gsap.to(btnHoverRef.current, {
              duration: 0.2,
              borderRadius: 100,
              boxShadow: "none",
            });

            // Lines morph
            gsap.to(line01Ref.current, {
              duration: 0.2,
              ease: kuritaEase,
              top: 5,
              rotate: 45,
            });
            gsap.to(line02Ref.current, {
              duration: 0.2,
              ease: kuritaEase,
              bottom: 4,
              rotate: -45,
            });
          }

          // Text reveals
          gsap.to(".sidebar-title-item", {
            duration: 1.0,
            delay: 0.26,
            ease: kuritaEase,
            stagger: { each: 0.1 },
            y: 0,
            opacity: 1,
          });
          gsap.to(".sidebar-item-wrapper", {
            duration: 1.0,
            delay: 0.36,
            ease: kuritaEase,
            stagger: { each: 0.12 },
            y: 0,
          });
        }
      } else {
        // ─── Closed State Animation ───
        if (!isMobile) {
          // Desktop Close
          if (rootRef.current) {
            gsap.to(rootRef.current, {
              xPercent: 100,
              duration: 0.3,
              delay: 0,
              ease: kuritaEase,
              onComplete: () => {
                if (rootRef.current) rootRef.current.style.pointerEvents = "none";
              },
            });
          }

          if (btnRef.current) {
            gsap.to(btnRef.current, {
              duration: 0.2,
              ease: kuritaEase,
              autoAlpha: 0,
              scale: 0.8,
              onComplete: () => {
                if (btnRef.current) btnRef.current.style.pointerEvents = "none";
              },
            });
            gsap.to(btnHoverRef.current, {
              duration: 0.2,
              borderRadius: 100,
              boxShadow: "none",
            });
            gsap.to(openareaRef.current, {
              delay: 0.2,
              duration: 0.2,
              ease: kuritaEase,
              scale: 1,
            });
            gsap.to(line01Ref.current, {
              delay: 0.2,
              duration: 0.2,
              ease: kuritaEase,
              top: 0,
              height: 4,
              borderRadius: 2,
              rotate: 0,
            });
            gsap.to(line02Ref.current, {
              delay: 0.2,
              duration: 0.2,
              ease: kuritaEase,
              bottom: 0,
              height: 4,
              borderRadius: 2,
              rotate: 0,
            });
          }

          if (contentsRef.current) {
            gsap.to(contentsRef.current, {
              duration: 0.2,
              autoAlpha: 0,
              onComplete: () => {
                if (contentsRef.current) {
                  contentsRef.current.scrollTo(0, 0);
                  contentsRef.current.style.pointerEvents = "none";
                }
                gsap.set(".sidebar-item-wrapper", { y: 180 });
                gsap.set(".sidebar-title-item", { y: 40, opacity: 0 });
              },
            });
          }
        } else {
          // Mobile Close
          if (rootRef.current) {
            gsap.to(rootRef.current, {
              xPercent: 100,
              duration: 0.3,
              delay: 0,
              ease: kuritaEase,
              onComplete: () => {
                if (rootRef.current) rootRef.current.style.pointerEvents = "none";
              },
            });
          }

          if (btnRef.current) {
            gsap.to(btnRef.current, {
              duration: 0.2,
              ease: kuritaEase,
              autoAlpha: 0,
              scale: 0.8,
              onComplete: () => {
                if (btnRef.current) btnRef.current.style.pointerEvents = "none";
              },
            });
            gsap.to(btnHoverRef.current, {
              duration: 0.2,
              borderRadius: 10,
              boxShadow: "none",
            });
            gsap.to(line01Ref.current, {
              duration: 0.2,
              ease: kuritaEase,
              top: 0,
              rotate: 0,
            });
            gsap.to(line02Ref.current, {
              duration: 0.2,
              ease: kuritaEase,
              bottom: 0,
              rotate: 0,
            });
          }

          if (contentsRef.current) {
            gsap.to(contentsRef.current, {
              duration: 0.2,
              autoAlpha: 0,
              onComplete: () => {
                if (contentsRef.current) {
                  contentsRef.current.scrollTo(0, 0);
                  contentsRef.current.style.pointerEvents = "none";
                }
                gsap.set(".sidebar-item-wrapper", { y: 180 });
                gsap.set(".sidebar-title-item", { y: 40, opacity: 0 });
              },
            });
          }
        }
      }
    },
    { dependencies: [isSidebarOpen] }
  );

  return (
    <>
      {/* ─── Backdrop: Click-outside to close; 100% transparent ─── */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-[998] ${
          isSidebarOpen
            ? "pointer-events-auto bg-transparent"
            : "pointer-events-none"
        }`}
      />

      {/* 
        ─── The Outer Wrapper (The Frame) ───
        - Fixed right-0 h-[100dvh], 560px wide (matching -560px website push)
        - Base flat legacy grey/beige background (#dfded9)
        - NO rounded corners (flat rectangular outer frame)
        - Left padding of 50px (pl-[50px]) creating the signature gap
        - Holds the close button positioned absolutely relative to this outer wrapper
      */}
      <aside
        ref={rootRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        aria-label="Site navigation menu"
        className="fixed top-0 right-0 h-[100dvh] w-[560px] max-[767px]:w-full z-[999] pl-[50px] max-[767px]:pl-0 overscroll-contain bg-[#dfded9] pointer-events-none translate-x-full will-change-transform"
      >
        {/* 
          ─── The Close Button ("X") ───
          Positioned absolutely relative to the Outer Wrapper.
          Sits at -left-[43px] (centered on the seam at 0px),
          floating completely clear of the inner rounded box (which begins at +50px).
        */}
        <button
          ref={btnRef}
          type="button"
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={toggleSidebar}
          className="absolute top-0 bottom-0 my-auto -left-[43px] w-[86px] h-[86px] rounded-full cursor-pointer z-20 opacity-0 pointer-events-none border-none outline-none focus:outline-none max-[767px]:-left-[30px] max-[767px]:top-[20px] max-[767px]:bottom-auto max-[767px]:w-[60px] max-[767px]:h-[60px]"
        >
          <span
            ref={btnHoverRef}
            className="flex justify-center items-center absolute inset-0 w-full h-full bg-white rounded-full transition-transform duration-250 hover:scale-[0.95] shadow-[0px_10px_20px_5px_rgba(193,193,192,0.15)]"
          >
            <span
              ref={openareaRef}
              className="relative w-[37px] h-[13px] max-[767px]:w-[26px] max-[767px]:h-[13px]"
            >
              <span
                ref={line01Ref}
                className="absolute top-0 left-0 w-full h-[4px] bg-[#302c1a] rounded-[2px]"
              />
              <span
                ref={line02Ref}
                className="absolute bottom-0 left-0 w-full h-[4px] bg-[#302c1a] rounded-[2px]"
              />
            </span>
          </span>
        </button>

        {/* 
          ─── The Inner Wrapper (The Content Box) ───
          - Takes up w-full h-full inside the pl-[50px] frame (yielding 510px width)
          - Styled with legacy darker beige-grey base color (#bcbbb4)
          - Rounded left corners: rounded-l-[2rem] max-[767px]:rounded-l-[1rem]
          - Dark moody gradient/inset shadow: shadow-[inset_35px_60px_50px_20px_rgba(24,23,13,0.50)]
          - Holds all the text and project cards with isolated scrolling
        */}
        <div
          ref={contentsRef}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          onWheel={(e) => e.stopPropagation()}
          className="relative z-10 w-full h-full bg-[#bcbbb4] rounded-l-[2rem] max-[767px]:rounded-l-[1rem] shadow-[-20px_0px_50px_rgba(0,0,0,0.15)] inset-shadow-[35px_60px_50px_20px_rgba(24,23,13,0.50)]
            pt-[50px] pb-[50px] pr-[26px] pl-[24px] max-[767px]:px-[12px] max-[767px]:py-[38px]
            overflow-y-auto overflow-x-hidden overscroll-contain
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            opacity-0 pointer-events-none"
        >
          {/* Main Top Navigation Headings (Exact legacy typography math: Six Caps 120px / SP: 28.8vw, leading-[0.88]) */}
          <div className="relative mb-[36px] max-[767px]:mb-[46px] text-[#302c1a] text-[120px] max-[767px]:text-[28.8vw] leading-[0.88] tracking-[-0.002em] font-[family-name:var(--font-sidebar-title)] z-[2] w-full break-words">
            <div className="sidebar-title-item block translate-y-10 opacity-0 w-full break-words">
              <Link
                href="/"
                onClick={closeSidebar}
                className="block w-full break-words hover:opacity-75 transition-opacity"
              >
                VISHWAS
              </Link>
            </div>
            <div className="sidebar-title-item block translate-y-10 opacity-0 mt-2 w-full break-words">
              <Link
                href="/about"
                onClick={closeSidebar}
                className="inline-block w-full break-words hover:opacity-75 transition-opacity"
              >
                ABOUT
              </Link>
            </div>
          </div>

          {/* Section Indicator: '・ WORKS' (Exact legacy typography math: 36px dot, 12px label) */}
          <div className="sidebar-title-item relative mb-[36px] max-[767px]:mb-[34px] z-[2] translate-y-10 opacity-0 flex items-baseline gap-1 text-[#302c1a] w-full break-words">
            <span className="text-[36px] max-[767px]:text-[28px] leading-[0.79] font-[family-name:var(--font-sidebar-body)] select-none flex-shrink-0">
              ・
            </span>
            <span className="text-[12px] max-[767px]:text-[10px] font-bold tracking-[0.02em] leading-[1.04] uppercase font-[family-name:var(--font-sidebar-body)] break-words">
              WORKS
            </span>
          </div>

          {/* Works & Archive List (Exact legacy typography: 56px Six Caps title, 10px Helvetica desc) with dynamic break-words */}
          <ul className="space-y-[20px] max-[767px]:space-y-[17px] w-full">
            {WORKS_DATA.map((item) => (
              <li key={item.id} className="relative overflow-hidden w-full">
                <div className="sidebar-item-wrapper translate-y-[180px] w-full">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center group cursor-pointer w-full hover:opacity-80 transition-opacity"
                  >
                    {/* Thumbnail: 180x180 with 14px border radius */}
                    <span className="relative flex-shrink-0 w-[180px] h-[180px] mr-[20px] rounded-[14px] overflow-hidden bg-[#302c1a]/10 max-[767px]:w-[28.67vw] max-[767px]:h-[28.67vw] max-[767px]:rounded-[4px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 767px) 215px, 180px"
                      />
                    </span>

                    {/* Metadata: dynamic break-words without rigid fixed widths or overflow */}
                    <span className="flex-1 min-w-0 w-full flex flex-col items-center break-words">
                      <span className="block w-full break-words text-[#302c1a] text-[56px] max-[767px]:text-[12.8vw] font-[family-name:var(--font-sidebar-title)] text-center leading-none mt-[-12px] mb-[16px] max-[767px]:mb-[10px] group-hover:opacity-70 transition-opacity uppercase">
                        {item.title}
                      </span>
                      <span className="block w-full break-words text-[#302c1a] text-[10px] leading-[1.35] tracking-[0.02em] text-center font-[family-name:var(--font-sidebar-body)] uppercase">
                        {item.desc}
                      </span>
                      {item.tech && (
                        <span className="block w-full break-words text-[#302c1a]/70 text-[9px] font-mono leading-[1.3] tracking-[0.02em] text-center mt-[8px] max-[767px]:mt-[5px] uppercase">
                          {item.tech}
                        </span>
                      )}
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
