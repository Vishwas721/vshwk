"use client";

import { useEffect, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { usePickupStore } from "@/store/usePickupStore";

interface UsePickupHijackOptions {
  wheelThreshold?: number;
  touchThreshold?: number;
  cooldownMs?: number;
  onRewindToAbout?: (completeRelease: () => void) => void;
}

/**
 * usePickupHijack
 *
 * Implements bidirectional state-machine scroll interception with smooth Lenis control:
 * 1. Scrolling down from About: Locks at Project 1 (Privex), snaps viewport, stops Lenis.
 * 2. Scrolling down steps Project 1 -> 2 -> 3.
 * 3. Scrolling down past Project 3 (SummAID):
 *    - Keeps globalBgColor Mint (#D8F3DC) to eliminate blue bleed.
 *    - Smoothly glides to footer and calls lenis.start().
 * 4. Scrolling up from Footer:
 *    - Detects upward entry into ProjectsPickupSection from the bottom.
 *    - Smoothly locks viewport at section offsetTop.
 *    - Initializes at Project 3 (SummAID) with Mint (#D8F3DC) background without entry blast animation.
 * 5. Scrolling up inside section steps Project 3 -> 2 -> 1.
 * 6. Scrolling up from Project 1:
 *    - Does NOT immediately call lenis.start() or leave().
 *    - Triggers onRewindToAbout to shrink the cream circle and reveal the blue About section.
 *    - Calls lenis.start() and releases to About only AFTER the shrinking animation completes.
 * 7. Enforces a 1200ms cooldown lockout between interactions to prevent state thrashing.
 */
export function usePickupHijack(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: UsePickupHijackOptions = {}
) {
  const {
    wheelThreshold = 50,
    touchThreshold = 50,
    cooldownMs = 1200,
    onRewindToAbout,
  } = options;

  const lenis = useLenis();
  const enter = usePickupStore((s) => s.enter);
  const enterFromBottom = usePickupStore((s) => s.enterFromBottom);
  const leave = usePickupStore((s) => s.leave);
  const next = usePickupStore((s) => s.next);
  const prev = usePickupStore((s) => s.prev);
  const setGlobalBgColor = usePickupStore((s) => s.setGlobalBgColor);
  const isCurrent = usePickupStore((s) => s.isCurrent);

  const isLockedRef = useRef(false);
  const isCoolingDownRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const touchStartYRef = useRef(0);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastScrollYRef = useRef(0);

  // Sync ref with store state
  useEffect(() => {
    isLockedRef.current = isCurrent;
  }, [isCurrent]);

  // Lock and snap to the Pickup section
  const lockAtSection = useCallback(
    (startProjectNumber: 1 | 3 = 1, direction: "init" | "prev" = "init") => {
      if (isLockedRef.current || !sectionRef.current) return;

      const section = sectionRef.current;
      isLockedRef.current = true;
      isCoolingDownRef.current = true;
      accumulatedDeltaRef.current = 0;

      // 1. Halt Lenis smooth scroll immediately
      if (lenis) {
        lenis.stop();
      }

      // 2. Set active project in Zustand store
      if (startProjectNumber === 3) {
        enterFromBottom();
      } else {
        enter();
      }

      // 3. Smoothly tween viewport to exact section offsetTop
      const targetY = section.offsetTop;
      const scrollObj = { y: window.scrollY };

      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
      }

      scrollTweenRef.current = gsap.to(scrollObj, {
        y: targetY,
        duration: 0.75,
        ease: "power2.out",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
          if (lenis) {
            lenis.scrollTo(scrollObj.y, { immediate: true });
          }
        },
        onComplete: () => {
          window.scrollTo(0, targetY);
          if (lenis) {
            lenis.scrollTo(targetY, { immediate: true });
          }
          // Enforce cooldown after snapping to prevent immediate re-trigger
          setTimeout(() => {
            isCoolingDownRef.current = false;
          }, cooldownMs);
        },
      });
    },
    [cooldownMs, enter, enterFromBottom, lenis, sectionRef]
  );

  // Release lock downward towards footer
  const releaseDownward = useCallback(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    isCoolingDownRef.current = true;
    isLockedRef.current = false;
    leave();

    // CRITICAL: Ensure base background REMAINS Mint (#D8F3DC) to eliminate blue bleed
    setGlobalBgColor("#D8F3DC");

    const exitTarget = section.offsetTop + section.offsetHeight + 80;
    const scrollObj = { y: window.scrollY };

    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }

    scrollTweenRef.current = gsap.to(scrollObj, {
      y: exitTarget,
      duration: 0.85,
      ease: "power2.inOut",
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
        if (lenis) {
          lenis.scrollTo(scrollObj.y, { immediate: true });
        }
      },
      onComplete: () => {
        window.scrollTo(0, exitTarget);
        if (lenis) {
          lenis.scrollTo(exitTarget, { immediate: true });
          lenis.start();
        }
        setTimeout(() => {
          isCoolingDownRef.current = false;
        }, 450);
      },
    });
  }, [leave, lenis, sectionRef, setGlobalBgColor]);

  // Release lock upward towards About section
  // Called ONLY after GSAP bubble shrinking timeline completes!
  const releaseUpward = useCallback(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    isLockedRef.current = false;
    leave();
    setGlobalBgColor("transparent");

    const exitTopTarget = Math.max(0, section.offsetTop - window.innerHeight * 0.45);

    if (lenis) {
      lenis.start();
      lenis.scrollTo(exitTopTarget, {
        duration: 0.75,
      });
    } else {
      window.scrollTo(0, exitTopTarget);
    }

    // Explicitly reset cooldown via setTimeout so that fast user scroll does not cancel unlock
    setTimeout(() => {
      isCoolingDownRef.current = false;
    }, 450);
  }, [leave, lenis, sectionRef, setGlobalBgColor]);

  // Handle downward user gesture
  const handleScrollDown = useCallback(() => {
    if (isCoolingDownRef.current) return;

    const currentNum = usePickupStore.getState().currentNumber;

    if (currentNum < 3) {
      isCoolingDownRef.current = true;
      next();
      setTimeout(() => {
        isCoolingDownRef.current = false;
      }, cooldownMs);
    } else {
      // Reached Project 3 (SummAID) and scrolling down: Release to footer!
      releaseDownward();
    }
  }, [cooldownMs, next, releaseDownward]);

  // Handle upward user gesture
  const handleScrollUp = useCallback(() => {
    if (isCoolingDownRef.current) return;

    const currentNum = usePickupStore.getState().currentNumber;

    if (currentNum > 1) {
      isCoolingDownRef.current = true;
      prev();
      setTimeout(() => {
        isCoolingDownRef.current = false;
      }, cooldownMs);
    } else {
      // At Project 1 (Privex) and scrolling UP:
      // Do NOT immediately call lenis.start() or leave()!
      // Trigger the Upward Rewind timeline first
      isCoolingDownRef.current = true;

      if (onRewindToAbout) {
        onRewindToAbout(() => {
          // ONLY called when bubble scale has reached 0:
          releaseUpward();
        });
      } else {
        releaseUpward();
      }
    }
  }, [cooldownMs, onRewindToAbout, prev, releaseUpward]);

  // Monitor viewport scroll to catch entry from above or below
  useLenis((lenisInstance) => {
    if (isLockedRef.current || isCoolingDownRef.current || !sectionRef.current) {
      lastScrollYRef.current = window.scrollY;
      return;
    }

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const isScrollingUp = currentScrollY < lastScrollYRef.current || (lenisInstance && lenisInstance.direction === -1);
    const isScrollingDown = currentScrollY > lastScrollYRef.current || (lenisInstance && lenisInstance.direction === 1);
    lastScrollYRef.current = currentScrollY;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    // Case 1: Scrolling DOWN from About into ProjectsPickupSection
    if (
      isScrollingDown &&
      rect.top <= 80 &&
      rect.bottom > window.innerHeight * 0.3 &&
      currentScrollY < sectionTop + sectionHeight * 0.7
    ) {
      lockAtSection(1, "init");
      return;
    }

    // Case 2: Scrolling UP from Footer into ProjectsPickupSection
    if (
      isScrollingUp &&
      currentScrollY <= sectionTop + sectionHeight + 120 &&
      currentScrollY >= sectionTop + sectionHeight * 0.2
    ) {
      lockAtSection(3, "prev");
      return;
    }
  });

  // Keep references to latest handlers for event listeners without triggering effect rebuilds
  const handlersRef = useRef({ handleScrollDown, handleScrollUp });
  useEffect(() => {
    handlersRef.current = { handleScrollDown, handleScrollUp };
  });

  // Attach gesture listeners (stable: doesn't re-run or unlock Lenis prematurely)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLockedRef.current) return;

      // Prevent native page scrolling while locked
      e.preventDefault();

      if (isCoolingDownRef.current) return;

      accumulatedDeltaRef.current += e.deltaY;

      if (accumulatedDeltaRef.current > wheelThreshold) {
        accumulatedDeltaRef.current = 0;
        handlersRef.current.handleScrollDown();
      } else if (accumulatedDeltaRef.current < -wheelThreshold) {
        accumulatedDeltaRef.current = 0;
        handlersRef.current.handleScrollUp();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLockedRef.current) return;

      if (e.cancelable) {
        e.preventDefault();
      }

      if (isCoolingDownRef.current || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY; // Upward swipe = scroll down

      if (deltaY > touchThreshold) {
        handlersRef.current.handleScrollDown();
      } else if (deltaY < -touchThreshold) {
        handlersRef.current.handleScrollUp();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLockedRef.current || isCoolingDownRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handlersRef.current.handleScrollDown();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handlersRef.current.handleScrollUp();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);

      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
      }
    };
  }, [touchThreshold, wheelThreshold]);

  return {
    isLocked: isLockedRef.current,
    releaseUpward,
    releaseDownward,
  };
}
