"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ProjectMetaballs from "./ProjectMetaballs";

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
