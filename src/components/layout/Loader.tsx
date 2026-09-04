"use client";

import React, { useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUIStore } from "@/store/useUIStore";

export default function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const isAppLoaded = useUIStore((state) => state.isAppLoaded);
  const isTransitioning = useUIStore((state) => state.isTransitioning);
  const transitionTarget = useUIStore((state) => state.transitionTarget);
  const setAppLoaded = useUIStore((state) => state.setAppLoaded);
  const endTransition = useUIStore((state) => state.endTransition);

  // 1. Initial Page Load Animation
  useGSAP(
    () => {
      // If already loaded in an existing session, stay hidden
      if (isAppLoaded) {
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { yPercent: -100, pointerEvents: "none" });
        }
        return;
      }

      const counter = { val: 0 };
      const tl = gsap.timeline();

      // Animate counter from 0 to 100
      tl.to(counter, {
        val: 100,
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = `${Math.floor(counter.val)}%`;
          }
        },
      });

      // Slide loader overlay out of viewport
      tl.to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power3.inOut",
          onComplete: () => {
            setAppLoaded(true);
            if (overlayRef.current) {
              overlayRef.current.style.pointerEvents = "none";
            }
          },
        },
        "+=0.1"
      );
    },
    { scope: overlayRef }
  );

  // 2. Route Transition In Animation (when pink card is clicked)
  useEffect(() => {
    if (!isTransitioning || !overlayRef.current) return;

    overlayRef.current.style.pointerEvents = "auto";
    const counter = { val: 0 };
    if (textRef.current) {
      textRef.current.textContent = "0%";
    }

    const tl = gsap.timeline();

    // Slide overlay in from bottom
    tl.fromTo(
      overlayRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.55,
        ease: "power3.out",
      }
    );

    // Animate counter from 0 to 100
    tl.to(counter, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (textRef.current) {
          textRef.current.textContent = `${Math.floor(counter.val)}%`;
        }
      },
      onComplete: () => {
        const target = transitionTarget || "/about";
        router.push(target);
      },
    });
  }, [isTransitioning, transitionTarget, router]);

  // 3. Route Transition Out Animation (after arriving on destination route)
  useEffect(() => {
    if (!isTransitioning || !overlayRef.current) return;
    const target = transitionTarget || "/about";

    if (pathname === target) {
      const timer = setTimeout(() => {
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power3.inOut",
          onComplete: () => {
            endTransition();
            if (overlayRef.current) {
              overlayRef.current.style.pointerEvents = "none";
            }
          },
        });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname, isTransitioning, transitionTarget, endTransition]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] select-none overflow-hidden"
      aria-live="polite"
      aria-label="Loading page"
    >
      {/* Top micro-indicator */}
      <div
        ref={subtextRef}
        className="absolute top-8 left-8 sm:top-10 sm:left-12 flex items-center space-x-2 text-white/70 text-[11px] md:text-[13px] tracking-[0.2em] uppercase font-[helvetica,Arial,sans-serif]"
      >
        <span className="inline-block text-[22px] leading-none text-white">・</span>
        <span>HISAMI KURITA / PORTFOLIO</span>
      </div>

      {/* Center Massive Typographic Percentage */}
      <div className="relative flex items-center justify-center">
        <span
          ref={textRef}
          className="text-white text-[28vw] sm:text-[22vw] md:text-[18vw] leading-none tracking-normal font-normal select-none pointer-events-none"
          style={{ fontFamily: "var(--font-six-caps)" }}
        >
          0%
        </span>
      </div>

      {/* Bottom subtle indicator */}
      <div className="absolute bottom-8 right-8 sm:bottom-10 sm:right-12 text-white/50 text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-[helvetica,Arial,sans-serif]">
        INITIALIZING EXPERIENCE
      </div>
    </div>
  );
}
