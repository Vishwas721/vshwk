"use client";

import React from "react";
import { usePickupStore } from "@/store/usePickupStore";

/**
 * DynamicBackground
 *
 * A fixed full-screen background layer positioned at the bottom of the z-index stack
 * (z-[-2], behind all Lenis scroll content and sections).
 *
 * Eliminates the "Blue Bleed" bug:
 * - When entering Project 1: snaps to Cream (#F9F6F0)
 * - When entering Project 2: snaps to Orange (#FFD8A8)
 * - When entering Project 3: snaps to Mint (#D8F3DC)
 * - When exiting Project 3 downward into the footer: REMAINS Mint (#D8F3DC)
 *   so that any bounce or gap between Project 3 and the footer displays the dynamic
 *   mint tone rather than the hero's blue circle.
 */
export default function DynamicBackground() {
  const globalBgColor = usePickupStore((s) => s.globalBgColor);

  return (
    <div
      id="dynamic-global-background"
      aria-hidden="true"
      className="fixed inset-0 z-[-2] pointer-events-none transition-colors duration-500 ease-out will-change-transform"
      style={{
        backgroundColor: globalBgColor === "transparent" ? "transparent" : globalBgColor,
      }}
    />
  );
}
