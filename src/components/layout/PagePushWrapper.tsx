"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useUIStore } from "@/store/useUIStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

interface PagePushWrapperProps {
  children: React.ReactNode;
}

/**
 * PagePushWrapper — Replicates legacy layouts/default.vue container push interaction
 *
 * When sidebar opens:
 * - Desktop: shifts main website container x: -560px with delay: 0.16s, duration: 0.3s
 * - Mobile: shifts container x: -85vw
 * - Uses signature Kurita CustomEase: M0,0 C0.44,0.05 0.17,1 1,1
 *
 * When sidebar closes:
 * - Smoothly glides back to x: 0 with delay: 0s, duration: 0.3s
 */
export default function PagePushWrapper({ children }: PagePushWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen } = useUIStore();

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
      const targetX = isSidebarOpen ? (isMobile ? -window.innerWidth * 0.85 : -560) : 0;
      const delay = isSidebarOpen ? 0.16 : 0;

      // Animate main container push
      gsap.to(containerRef.current, {
        x: targetX,
        duration: 0.3,
        delay,
        ease: kuritaEase,
        onComplete: () => {
          if (!isSidebarOpen && containerRef.current) {
            gsap.set(containerRef.current, { clearProps: "transform" });
          }
        },
      });

      // Also animate any fixed header logo elements in sync (legacy BaseHeader.vue behavior)
      const headerLogo = document.querySelector(".header-logo-container");
      if (headerLogo) {
        gsap.to(headerLogo, {
          x: targetX,
          duration: 0.3,
          delay,
          ease: kuritaEase,
          onComplete: () => {
            if (!isSidebarOpen && headerLogo) {
              gsap.set(headerLogo, { clearProps: "transform" });
            }
          },
        });
      }
    },
    { dependencies: [isSidebarOpen] }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#f0efeb]"
    >
      {children}
    </div>
  );
}
