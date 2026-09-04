"use client";

/**
 * usePickupHijack (Deprecated)
 *
 * Discrete scroll hijacking has been completely superseded by continuous
 * GSAP ScrollTrigger scrubbing (`scrub: 1`, `pin: true`).
 *
 * All scrollbar locking, `lenis.stop()`, wheel intercepts, and discrete
 * state stepping have been stripped out. Native smooth scroll is preserved everywhere.
 */
export function usePickupHijack() {
  return {
    isLocked: false,
    releaseUpward: () => {},
    releaseDownward: () => {},
  };
}
