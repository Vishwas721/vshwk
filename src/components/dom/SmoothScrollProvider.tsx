"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useUIStore } from "@/store/useUIStore";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function LenisScrollController() {
  const isAppLoaded = useUIStore((state) => state.isAppLoaded);
  const isTransitioning = useUIStore((state) => state.isTransitioning);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (!isAppLoaded || isTransitioning) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, isAppLoaded, isTransitioning]);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    const handleRefresh = () => {
      lenis.resize();
    };

    lenis.on("scroll", handleScroll);
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    return () => {
      lenis.off("scroll", handleScroll);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.5,
        syncTouch: true,
      }}
    >
      <LenisScrollController />
      {children}
    </ReactLenis>
  );
}
