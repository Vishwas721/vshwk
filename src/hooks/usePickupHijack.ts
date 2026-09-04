"use client";

import { useEffect, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { usePickupStore } from "@/store/usePickupStore";

interface UsePickupHijackOptions {
  wheelThreshold?: number;
  touchThreshold?: number;
  cooldownMs?: number;
}

/**
 * usePickupHijack
 *
 * Implements bidirectional state-machine scroll interception with smooth Lenis control:
 * 1. Scrolling down from About: Locks at Project 1 (Privex), snaps viewport, stops Lenis.
 * 2. Scrolling down steps Project 1 -> 2 -> 3.
 * 3. Scrolling down past Project 3 (SummAID): Calls lenis.start() and smoothly glides to footer.
 * 4. Scrolling up steps Project 3 -> 2 -> 1.
 * 5. Scrolling up from Project 1: Calls lenis.start() and smoothly glides back into About.
 * 6. Enforces a 1200ms cooldown lockout between interactions to prevent state thrashing.
 */
export function usePickupHijack(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: UsePickupHijackOptions = {}
) {
  const {
    wheelThreshold = 50,
    touchThreshold = 50,
    cooldownMs = 1200,
  } = options;

  const lenis = useLenis();
  const enter = usePickupStore((s) => s.enter);
  const leave = usePickupStore((s) => s.leave);
  const next = usePickupStore((s) => s.next);
  const prev = usePickupStore((s) => s.prev);
  const setCurrentNumber = usePickupStore((s) => s.setCurrentNumber);

  const isLockedRef = useRef(false);
  const isCoolingDownRef = useRef(false);
  const touchStartYRef = useRef(0);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  // Lock and snap to the Pickup section
  const lockAtSection = useCallback(
    (startProjectNumber: number = 1, direction: "next" | "prev" | "init" = "init") => {
      if (isLockedRef.current || !sectionRef.current) return;

      const section = sectionRef.current;
      isLockedRef.current = true;
      isCoolingDownRef.current = true;

      // 1. Halt Lenis smooth scroll immediately
      if (lenis) {
        lenis.stop();
      }

      // 2. Set active project
      if (startProjectNumber === 1) {
        enter();
      } else {
        setCurrentNumber(startProjectNumber, direction);
        usePickupStore.setState({ isCurrent: true, isAnimationActive: true });
      }

      // 3. Smoothly tween viewport to exact section offsetTop
      const targetY = section.offsetTop;
      const scrollObj = { y: window.scrollY };

      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
      }

      scrollTweenRef.current = gsap.to(scrollObj, {
        y: targetY,
        duration: 0.8,
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
          // Enforce cooldown after snapping
          setTimeout(() => {
            isCoolingDownRef.current = false;
          }, cooldownMs);
        },
      });
    },
    [cooldownMs, enter, lenis, sectionRef, setCurrentNumber]
  );

  // Release lock downward towards footer
  const releaseDownward = useCallback(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    isCoolingDownRef.current = true;
    isLockedRef.current = false;
    leave();

    const exitTarget = section.offsetTop + section.offsetHeight + 80;
    const scrollObj = { y: window.scrollY };

    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }

    scrollTweenRef.current = gsap.to(scrollObj, {
      y: exitTarget,
      duration: 0.9,
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
          // EXPLICITLY re-enable Lenis smooth scroll
          lenis.start();
        }
        setTimeout(() => {
          isCoolingDownRef.current = false;
        }, 400);
      },
    });
  }, [leave, lenis, sectionRef]);

  // Release lock upward towards About section
  const releaseUpward = useCallback(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    isCoolingDownRef.current = true;
    isLockedRef.current = false;
    leave();

    const exitTopTarget = Math.max(0, section.offsetTop - window.innerHeight * 0.45);
    const scrollObj = { y: window.scrollY };

    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }

    scrollTweenRef.current = gsap.to(scrollObj, {
      y: exitTopTarget,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
        if (lenis) {
          lenis.scrollTo(scrollObj.y, { immediate: true });
        }
      },
      onComplete: () => {
        window.scrollTo(0, exitTopTarget);
        if (lenis) {
          lenis.scrollTo(exitTopTarget, { immediate: true });
          // EXPLICITLY re-enable Lenis smooth scroll
          lenis.start();
        }
        setTimeout(() => {
          isCoolingDownRef.current = false;
        }, 400);
      },
    });
  }, [leave, lenis, sectionRef]);

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
      // At Project 1 (Privex) and scrolling up: Release to About section!
      releaseUpward();
    }
  }, [cooldownMs, prev, releaseUpward]);

  // Monitor viewport scroll to catch entry from above or below
  useLenis(() => {
    if (isLockedRef.current || isCoolingDownRef.current || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();

    // Entering from above (scrolling down into Pickup)
    if (rect.top <= 15 && rect.top >= -80 && rect.bottom > window.innerHeight * 0.5) {
      lockAtSection(1, "init");
    }
    // Entering from below (scrolling up into Pickup)
    else if (rect.bottom >= window.innerHeight - 15 && rect.bottom <= window.innerHeight + 80 && rect.top < 0) {
      lockAtSection(3, "prev");
    }
  });

  // Attach gesture listeners
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLockedRef.current) return;

      // Prevent native page scrolling while locked
      e.preventDefault();

      if (isCoolingDownRef.current) return;

      if (e.deltaY > wheelThreshold) {
        handleScrollDown();
      } else if (e.deltaY < -wheelThreshold) {
        handleScrollUp();
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
        handleScrollDown();
      } else if (deltaY < -touchThreshold) {
        handleScrollUp();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLockedRef.current || isCoolingDownRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleScrollDown();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handleScrollUp();
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

      if (isLockedRef.current && lenis) {
        lenis.start();
      }
    };
  }, [
    handleScrollDown,
    handleScrollUp,
    lenis,
    touchThreshold,
    wheelThreshold,
  ]);

  return {
    isLocked: isLockedRef.current,
  };
}
