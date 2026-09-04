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
 * Works & Archive Datas matching legacy BaseHambergerMenu.vue
 * Including M-TRUST, KTKM, YAKUDOH, and ARCHIVE
 */
const WORKS_DATA = [
  {
    id: "01",
    title: "M-TRUST",
    desc: "DIGITAL PRODUCTION SPECIALIZING IN BRANDING & WEBGL EXPERIENCES.",
    image: "/images/poster-mtrust.webp",
    link: "/#works",
  },
  {
    id: "02",
    title: "KTKM",
    desc: "OFFICIAL PORTAL WITH PLAYFUL INTERACTIONS AND SOUND DESIGN.",
    image: "/images/poster-ketakuma.webp",
    link: "/#works",
  },
  {
    id: "03",
    title: "YAKUDOH",
    desc: "THE DIGITAL EXPERIENCE FOR CONTEMPORARY ARTS & THREE.JS SHADERS.",
    image: "/images/poster-yakudoh.webp",
    link: "/#works",
  },
  {
    id: "archive",
    title: "ARCHIVE",
    desc: "I'M PUTTING TOGETHER A DYNAMIC ARCHIVE PAGE OF THE WORK I'M SUBMITTING TO CODEPEN.",
    image: "/images/hambergermenu-archive.webp",
    link: "/archive",
    isArchive: true,
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
  const overlay01Ref = useRef<HTMLDivElement>(null);
  const overlay02Ref = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnHoverRef = useRef<HTMLSpanElement>(null);
  const openareaRef = useRef<HTMLSpanElement>(null);
  const line01Ref = useRef<HTMLSpanElement>(null);
  const line02Ref = useRef<HTMLSpanElement>(null);

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

      if (isSidebarOpen) {
        if (!isMobile) {
          // ─── Desktop Open Animation ───
          if (contentsRef.current) {
            gsap.set(contentsRef.current, { autoAlpha: 1 });
            contentsRef.current.style.pointerEvents = "auto";
          }

          // Button translates to intersect the left edge of the 510px drawer (-520px from right)
          if (btnRef.current) btnRef.current.style.pointerEvents = "auto";
          gsap.to(btnRef.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            x: -520,
            autoAlpha: 1,
          });
          // Button morphs into a perfect circle (86px x 86px, rounded-full aspect-square)
          gsap.to(btnRef.current, {
            duration: 0.2,
            ease: kuritaEase,
            width: 86,
            height: 86,
            borderRadius: 100,
            scale: 0.9,
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

          // Overlay 01 and 02 expand in lockstep from right (510px wide with curved left edge)
          gsap.to(overlay01Ref.current, {
            delay: 0.16,
            duration: 0.3,
            ease: kuritaEase,
            scaleX: 1.0,
            scaleY: 1.0,
          });
          gsap.to(overlay02Ref.current, {
            delay: 0.16,
            duration: 0.3,
            ease: kuritaEase,
            scaleX: 1.0,
          });

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
          if (contentsRef.current) {
            gsap.set(contentsRef.current, { autoAlpha: 1 });
            contentsRef.current.style.pointerEvents = "auto";
          }

          // Mobile button shifts left
          if (btnRef.current) btnRef.current.style.pointerEvents = "auto";
          gsap.to(btnRef.current, {
            duration: 0.2,
            ease: kuritaEase,
            x: -window.innerWidth / 2 + 50,
            autoAlpha: 1,
            borderRadius: 100,
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

          // Overlays drop down vertically
          gsap.to(overlay01Ref.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            scaleY: 1,
          });
          gsap.to(overlay02Ref.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            scaleY: 1,
          });

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
          gsap.to(btnRef.current, {
            duration: 0.2,
            ease: kuritaEase,
            x: 0,
            autoAlpha: 0,
            onComplete: () => {
              if (btnRef.current) btnRef.current.style.pointerEvents = "none";
            },
          });
          gsap.to(btnRef.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            width: 110,
            height: "calc(100dvh - 20px)",
            borderRadius: 10,
            scale: 1.0,
          });
          gsap.to(btnHoverRef.current, {
            duration: 0.2,
            borderRadius: 10,
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

          gsap.to(overlay02Ref.current, {
            delay: 0,
            duration: 0.3,
            ease: kuritaEase,
            scaleX: 0,
          });
          gsap.to(overlay01Ref.current, {
            delay: 0,
            duration: 0.3,
            ease: kuritaEase,
            scaleX: 0,
          });

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
        } else {
          // Mobile Close
          gsap.to(btnRef.current, {
            duration: 0.2,
            ease: kuritaEase,
            x: 0,
            autoAlpha: 0,
            width: 60,
            height: 60,
            borderRadius: 10,
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

          gsap.to(overlay01Ref.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            scaleY: 0,
          });
          gsap.to(overlay02Ref.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            scaleY: 0,
          });

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
    },
    { dependencies: [isSidebarOpen] }
  );

  return (
    <>
      {/* ─── Backdrop: Click-outside to close; 100% transparent so NO grey tint/void appears ─── */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-[998] ${
          isSidebarOpen
            ? "pointer-events-auto bg-transparent"
            : "pointer-events-none"
        }`}
      />

      {/* ─── Global Fixed Navigation Root (.hambergerMenu) ─── */}
      <aside
        ref={rootRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        aria-label="Site navigation menu"
        className="fixed top-0 right-0 h-[100dvh] z-[999] pointer-events-none overscroll-contain"
      >
        {/* 
          Overlay 01 (.hambergerMenu-overlay-01)
          Background under-layer strictly bounded to 510px with curved left edge (rounded-l-[2rem])
        */}
        <div
          ref={overlay01Ref}
          className="absolute top-0 right-0 w-[510px] h-full bg-[#dfded9] rounded-l-[2rem] pointer-events-none origin-right scale-x-0 overflow-hidden
            max-[767px]:top-[42px] max-[767px]:right-0 max-[767px]:w-full max-[767px]:h-[calc(100vh-72px)] max-[767px]:scale-y-0 max-[767px]:origin-top max-[767px]:rounded-l-[1rem]"
        >
          <div
            className={`absolute inset-0 rounded-inherit pointer-events-none shadow-[inset_2px_35px_16px_5px_rgba(24,23,13,0.20)] transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* 
          Overlay 02 (.hambergerMenu-overlay-02)
          Main drawer surface (510px width) with elegant curved left edge: rounded-l-[2rem]
        */}
        <div
          ref={overlay02Ref}
          className="absolute top-0 right-0 w-[510px] h-full bg-[#bcbbb4] rounded-l-[2rem] pointer-events-none origin-right scale-x-0 overflow-hidden
            max-[767px]:top-[42px] max-[767px]:right-0 max-[767px]:w-full max-[767px]:h-[calc(100vh-72px)] max-[767px]:scale-y-0 max-[767px]:origin-top max-[767px]:rounded-l-[1rem]"
        >
          <div className="absolute inset-0 rounded-inherit pointer-events-none shadow-[inset_35px_60px_50px_20px_rgba(24,23,13,0.50)]" />
        </div>

        {/* 
          Contents (.hambergerMenu-contents)
          510px drawer panel with curved left edge (rounded-l-[2rem])
          Lenis isolated: data-lenis-prevent="true" data-lenis-prevent-wheel="true" overscroll-contain
          Horizontal overflow blocked: overflow-x-hidden
          Vertical scroll enabled with hidden scrollbar UX: overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        */}
        <div
          ref={contentsRef}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          onWheel={(e) => e.stopPropagation()}
          className="absolute top-0 right-0 w-[510px] h-full pt-[50px] pb-[50px] pr-[26px] pl-[24px]
            rounded-l-[2rem] overflow-y-auto overflow-x-hidden overscroll-contain
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            opacity-0 pointer-events-none max-[767px]:right-0 max-[767px]:w-full max-[767px]:px-[12px] max-[767px]:py-[38px] max-[767px]:rounded-l-[1rem]"
        >
          {/* Main Top Navigation Headings (Exact legacy typography math: Six Caps 120px / SP: 28.8vw, leading-[0.88]) */}
          <div className="relative mb-[36px] max-[767px]:mb-[46px] text-[#302c1a] text-[120px] max-[767px]:text-[28.8vw] leading-[0.88] tracking-[-0.002em] font-[family-name:var(--font-sidebar-title)] z-[2] w-full break-words">
            <div className="sidebar-title-item block translate-y-10 opacity-0 w-full break-words">
              <Link
                href="/"
                onClick={closeSidebar}
                className="block w-full break-words hover:opacity-75 transition-opacity"
              >
                HISAMIKURITA
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
                  <Link
                    href={item.link}
                    onClick={closeSidebar}
                    className="flex items-center group cursor-pointer w-full"
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
                      <span className="block w-full break-words text-[#302c1a] text-[56px] max-[767px]:text-[12.8vw] font-[family-name:var(--font-sidebar-title)] text-center leading-none mt-[-12px] mb-[20px] max-[767px]:mb-[12px] group-hover:opacity-70 transition-opacity">
                        {item.title}
                      </span>
                      <span className="block w-full break-words text-[#302c1a] text-[10px] leading-[1.3] tracking-[0.02em] text-center font-[family-name:var(--font-sidebar-body)]">
                        {item.desc}
                      </span>
                    </span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 
          Hamburger / Close Button (.hambergerMenu-btn)
          - Closed: fills right 110px capsule with parallel horizontal lines
          - Open: transforms into a perfect circle (w-[86px] h-[86px] rounded-full aspect-square)
            centered on the left edge of the sidebar panel with a 45° close 'X'
        */}
        <button
          ref={btnRef}
          type="button"
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={toggleSidebar}
          className="absolute top-0 right-[10px] bottom-0 my-auto w-[110px] h-[calc(100dvh-20px)] rounded-[10px] cursor-pointer z-10 opacity-0 pointer-events-none border-none outline-none focus:outline-none max-[767px]:top-[10px] max-[767px]:right-[20px] max-[767px]:bottom-auto max-[767px]:w-[60px] max-[767px]:h-[60px]"
        >
          <span
            ref={btnHoverRef}
            className="flex justify-center items-center absolute inset-0 w-full h-full bg-white rounded-inherit transition-transform duration-250 hover:scale-[0.9,0.98]"
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
      </aside>
    </>
  );
}
