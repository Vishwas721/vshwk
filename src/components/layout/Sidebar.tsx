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
 */
const WORKS_DATA = [
  {
    id: "01",
    title: "YAKUDOH",
    desc: "THE DIGITAL EXPERIENCE FOR CONTEMPORARY ARTS & THREE.JS SHADERS.",
    image: "/images/poster-yakudoh.webp",
    link: "/#works",
  },
  {
    id: "02",
    title: "FRONTIER",
    desc: "IMMERSIVE WEBGL PORTFOLIO WITH METABALLS AND FLUID SIMULATION.",
    image: "/images/poster-frontier.webp",
    link: "/#works",
  },
  {
    id: "03",
    title: "BASTA",
    desc: "REACTIVE 3D PARTICLES, TILT CARDS & SMOOTH HYBRID TYPOGRAPHY.",
    image: "/images/poster-basta.webp",
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
 * Sidebar — Global Navigation Drawer Replicating BaseHambergerMenu.vue
 *
 * Architecture & Aesthetics:
 * - Managed via Zustand global UI store (isSidebarOpen, toggleSidebar, closeSidebar)
 * - Docked right capsule (110px width desktop, 60x60 square mobile)
 * - Dual layered rounded overlays (.hambergerMenu-overlay-01 #dfded9 and .hambergerMenu-overlay-02 #bcbbb4)
 * - Morphing hamburger button (transforms into circular floating 'X' with smooth translation)
 * - CustomEase 'kuritaTransform' (M0,0 C0.44,0.05 0.17,1 1,1)
 * - Zero scroll blocking when closed (pointer-events-none on backdrop and overlay surfaces)
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

          // Button translates -520px to the left of the 510px drawer
          gsap.to(btnRef.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            x: -520,
          });
          // Button morphs into circular floating trigger
          gsap.to(btnRef.current, {
            duration: 0.2,
            ease: kuritaEase,
            width: 86,
            height: 86,
            borderRadius: 100,
            scale: 0.9,
          });
          gsap.set(btnHoverRef.current, {
            boxShadow: "0px 10px 20px 5px rgba(193, 193, 192, 0.10)",
          });

          // Morph 2 horizontal bars to 'X'
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

          // Overlay 01 expands
          gsap.to(overlay01Ref.current, {
            delay: 0.16,
            duration: 0.3,
            ease: kuritaEase,
            scaleX: 5.1,
            scaleY: 1.1,
            x: 10,
          });
          // Overlay 02 drawer unfolds
          gsap.to(overlay02Ref.current, {
            delay: 0.16,
            duration: 0.3,
            ease: kuritaEase,
            scaleX: 1.0,
          });

          // Stagger in title and project items
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
          gsap.to(btnRef.current, {
            duration: 0.2,
            ease: kuritaEase,
            x: -window.innerWidth / 2 + 50,
            borderRadius: 100,
          });
          gsap.to(btnHoverRef.current, {
            duration: 0.2,
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
          });
          gsap.to(btnRef.current, {
            delay: 0.2,
            duration: 0.2,
            ease: kuritaEase,
            width: "100%",
            height: "100%",
            borderRadius: 10,
            scale: 1.0,
          });
          gsap.set(btnHoverRef.current, {
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
            scaleX: 1.0,
            scaleY: 1.0,
            x: 0,
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
            borderRadius: 10,
          });
          gsap.to(btnHoverRef.current, {
            duration: 0.2,
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
      {/* ─── Backdrop: Click-outside to close; STRICTLY pointer-events-none when closed ─── */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-[85] transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto bg-black/30"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ─── Global Fixed Navigation Root (.hambergerMenu) ─── */}
      <aside
        ref={rootRef}
        aria-label="Site navigation menu"
        className="fixed top-0 right-[10px] bottom-0 w-[110px] h-[calc(100%-20px)] my-auto z-[90] pointer-events-none
          max-[767px]:top-[10px] max-[767px]:right-[20px] max-[767px]:bottom-auto max-[767px]:w-[60px] max-[767px]:h-[60px]"
      >
        {/* 
          Overlay 01 (.hambergerMenu-overlay-01)
          Background under-capsule with inner shadow
        */}
        <div
          ref={overlay01Ref}
          className="absolute top-0 left-0 w-full h-full bg-[#dfded9] rounded-[10px] pointer-events-none origin-right
            max-[767px]:top-[22px] max-[767px]:left-[calc(-100vw+80px)] max-[767px]:w-screen max-[767px]:h-[calc(100vh-32px)] max-[767px]:rounded-[10px] max-[767px]:origin-top max-[767px]:scale-y-0"
        >
          <div
            className={`absolute inset-0 rounded-[10px] pointer-events-none shadow-[inset_2px_35px_16px_5px_rgba(24,23,13,0.20)] transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* 
          Overlay 02 (.hambergerMenu-overlay-02)
          Main drawer surface (510px width) with deep inset shadow
        */}
        <div
          ref={overlay02Ref}
          className="absolute top-0 right-0 w-[510px] h-full bg-[#bcbbb4] rounded-[10px] pointer-events-none origin-right scale-x-0 overflow-hidden
            max-[767px]:top-[42px] max-[767px]:right-[-10px] max-[767px]:w-[calc(100vw-20px)] max-[767px]:h-[calc(100vh-72px)] max-[767px]:scale-y-0 max-[767px]:origin-top"
        >
          <div className="absolute inset-0 rounded-[10px] pointer-events-none shadow-[inset_35px_60px_50px_20px_rgba(24,23,13,0.50)]" />
        </div>

        {/* 
          Contents (.hambergerMenu-contents)
          Contains navigation links, section titles, and project cards
        */}
        <div
          ref={contentsRef}
          className="absolute top-0 right-0 w-[510px] h-full pt-[50px] pb-[50px] pr-[26px] pl-[16px] overflow-y-auto opacity-0 pointer-events-none
            max-[767px]:right-0 max-[767px]:w-full max-[767px]:px-[8px] max-[767px]:py-[38px]"
        >
          {/* Main Top Navigation Headings */}
          <div className="relative mb-[36px] max-[767px]:mb-[46px] text-[#302c1a] text-[120px] max-[767px]:text-[calc(216/750*100vw)] leading-none tracking-[-0.002em] font-[var(--font-six-caps)] z-[2]">
            <div className="sidebar-title-item block translate-y-10 opacity-0">
              <Link
                href="/"
                onClick={closeSidebar}
                className="block hover:opacity-75 transition-opacity"
              >
                HISAMIKURITA
              </Link>
            </div>
            <div className="sidebar-title-item block translate-y-10 opacity-0 mt-1">
              <Link
                href="/about"
                onClick={closeSidebar}
                className="inline-block hover:opacity-75 transition-opacity"
              >
                ABOUT
              </Link>
            </div>
          </div>

          {/* Section Indicator: '・ WORKS' */}
          <div className="sidebar-title-item relative mb-[36px] max-[767px]:mb-[34px] z-[2] translate-y-10 opacity-0 flex items-baseline gap-1 text-[#302c1a]">
            <span className="text-[36px] leading-none font-sans select-none">・</span>
            <span className="text-[12px] font-sans font-bold tracking-[0.02em] leading-none">
              WORKS
            </span>
          </div>

          {/* Project List */}
          <ul className="space-y-[20px] max-[767px]:space-y-[17px]">
            {WORKS_DATA.map((item) => (
              <li key={item.id} className="relative overflow-hidden">
                <div className="sidebar-item-wrapper translate-y-[180px]">
                  <Link
                    href={item.link}
                    onClick={closeSidebar}
                    className="flex items-center group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <span className="relative flex-shrink-0 w-[180px] h-[180px] mr-[20px] rounded-[14px] overflow-hidden bg-[#302c1a]/10 max-[767px]:w-[calc(215/750*100vw)] max-[767px]:h-[calc(215/750*100vw)] max-[767px]:rounded-[4px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 767px) 215px, 180px"
                      />
                    </span>

                    {/* Metadata */}
                    <span className="flex-1 flex flex-col items-center">
                      <span className="block text-[#302c1a] text-[56px] max-[767px]:text-[calc(96/750*100vw)] font-[var(--font-six-caps)] text-center leading-none mt-[-12px] mb-[20px] max-[767px]:mb-[12px] group-hover:opacity-70 transition-opacity">
                        {item.title}
                      </span>
                      <span className="block text-[#302c1a] text-[10px] leading-[1.3] tracking-[0.02em] text-center font-[helvetica,Arial,sans-serif] max-w-[240px]">
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
          Hamburger Toggle Button (.hambergerMenu-btn)
          Morphs into a circular trigger and translates out when opened
        */}
        <button
          ref={btnRef}
          type="button"
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={toggleSidebar}
          className="absolute inset-0 m-auto w-full h-full rounded-[10px] cursor-pointer z-10 pointer-events-auto border-none outline-none focus:outline-none"
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
