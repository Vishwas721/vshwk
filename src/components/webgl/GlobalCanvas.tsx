"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ProjectMetaballs from "./ProjectMetaballs";

// Suppress known Three.js r183+ deprecation warning for THREE.Clock instantiated by @react-three/fiber
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export default function GlobalCanvas() {
  return (
    <Canvas
      frameloop="always"
      className="!fixed !inset-0 !z-[-1] !bg-[#f0efeb] !pointer-events-none"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={null}>
        <ProjectMetaballs />
      </Suspense>
    </Canvas>
  );
}
