"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface HeaderLogoProps {
  name?: string[];
}

/**
 * HeaderLogo — Fixed top-left branding logo replicating legacy BaseHeader.vue
 *
 * Characteristics:
 * - Position: fixed top-5 left-10 (top: 20px, left: 40px)
 * - Font: Six Caps 50px
 * - Color: #302c1a (sits directly over the light blue #55b1ff blob for maximum contrast)
 * - Micro-interaction: staggered entrance reveal, odd/even letters stagger on hover
 */
export default function HeaderLogo({
  name = ["V", "I", "S", "H", "W", "A", "S", " ", "K"],
}: HeaderLogoProps) {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entrance animation
    const validLetters = lettersRef.current.filter(Boolean);
    if (validLetters.length > 0) {
      gsap.fromTo(
        validLetters,
        { y: 50, opacity: 0 },
        {
          duration: 1.0,
          delay: 0.2,
          y: 0,
          opacity: 1,
          stagger: 0.04,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const handleMouseEnter = () => {
    lettersRef.current.forEach((el, index) => {
      if (!el) return;
      if (index % 2 === 1) {
        gsap.to(el, { y: -4, duration: 0.25, ease: "power2.out" });
      } else {
        gsap.to(el, { y: 4, duration: 0.25, ease: "power2.out" });
      }
    });
  };

  const handleMouseLeave = () => {
    lettersRef.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, { y: 0, duration: 0.4, ease: "power2.out" });
    });
  };

  return (
    <div
      ref={containerRef}
      className="header-logo-container fixed top-[20px] left-[20px] md:left-[40px] z-50 select-none overflow-hidden will-change-transform"
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group flex items-center cursor-pointer bg-transparent border-none p-0 tracking-[0.04em] leading-none"
        aria-label="Scroll to top"
      >
        <span
          className="text-[#302c1a] text-[40px] md:text-[50px] font-normal leading-none inline-flex"
          style={{ fontFamily: "var(--font-six-caps)" }}
        >
          {name.map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                lettersRef.current[index] = el;
              }}
              className="inline-block transition-transform duration-200"
              style={{ minWidth: char === " " ? "10px" : "auto" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </button>
    </div>
  );
}
