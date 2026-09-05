"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventItem {
  id: string;
  title: string;
  details: string;
  code: string;
  category: string;
}

const EVENTS_DATA: EventItem[] = [
  {
    id: "event-1",
    title: "MICROSOFT IMAGINE CUP 2026",
    details: "Azure AI Document Intelligence • Project Prism",
    code: "01",
    category: "GLOBAL HACKATHON",
  },
  {
    id: "event-2",
    title: "BUILD ON APTOS HACKATHON",
    details: "Decentralized Identity • Project Parichay",
    code: "02",
    category: "WEB3 / BLOCKCHAIN",
  },
  {
    id: "event-3",
    title: "MICROSOFT CODECUBICLE",
    details: "September 2025 • Participant",
    code: "03",
    category: "INVITATIONAL CODEATHON",
  },
  {
    id: "event-4",
    title: "VIRTUAL HACKATHON",
    details: "Team Collaboration • SynergySphere",
    code: "04",
    category: "AGENTIC WORKFLOWS",
  },
  {
    id: "event-5",
    title: "IBM SKILLSBUILD",
    details: "Edunet Foundation • Frontend Development",
    code: "05",
    category: "NATIONAL ACCREDITATION",
  },
  {
    id: "event-6",
    title: "TATA CRUCIBLE",
    details: "Campus Quiz • Participant",
    code: "06",
    category: "CAMPUS COMPETITION",
  },
];

export interface EventsHackathonsSectionProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * EventsHackathonsSection
 *
 * Horizontal scrolling marquee driven by vertical scroll.
 *
 * Features:
 * - Rich Hermès Orange background (#F37021), completely bubble-free.
 * - Pinned full-screen viewport (min-h-screen) with horizontal GSAP scroll translation.
 * - Massive ultra-condensed typography (Six Caps) in solid jet black (#0a0a0a).
 * - Monolithic Ticket Hover Effect:
 *   - Brutalist cursor pass (rounded-none, bg-[#0a0a0a], text-[#F37021], p-6, w-72).
 *   - Zero-lag GSAP quickSetter mouse tracking.
 *   - Marquee dimming (opacity: 0.3) on hover while Ticket smoothly pops to scale: 1, opacity: 1.
 */
const EventsHackathonsSection = forwardRef<HTMLElement, EventsHackathonsSectionProps>(
  (props, forwardedRef) => {
    const sectionRef = useRef<HTMLElement>(null);
    const marqueeTrackRef = useRef<HTMLDivElement>(null);
    const ticketRef = useRef<HTMLDivElement>(null);

    // Fast quickSetters for cursor coordinates
    const xSet = useRef<((value: number) => void) | null>(null);
    const ySet = useRef<((value: number) => void) | null>(null);

    const [activeTicket, setActiveTicket] = useState<EventItem | null>(null);
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

    // Forward ref to parent
    useImperativeHandle(forwardedRef, () => sectionRef.current as HTMLElement);

    // ─── Step 4: Setup GSAP quickSetter for Zero-Lag Mouse Snapping ───
    useEffect(() => {
      if (!ticketRef.current) return;
      xSet.current = gsap.quickSetter(ticketRef.current, "x", "px") as (value: number) => void;
      ySet.current = gsap.quickSetter(ticketRef.current, "y", "px") as (value: number) => void;

      // Initial state: hidden and scaled down
      gsap.set(ticketRef.current, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "top left",
      });
    }, []);

    // ─── Step 2: Scroll-Driven Horizontal Translation via ScrollTrigger ───
    useGSAP(
      () => {
        const section = sectionRef.current;
        const track = marqueeTrackRef.current;
        if (!section || !track) return;

        const getScrollAmount = () => {
          const trackWidth = track.scrollWidth;
          const viewportWidth = window.innerWidth;
          return Math.max(0, trackWidth - viewportWidth + 160); // 160px end padding
        };

        const horizontalTween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          horizontalTween.scrollTrigger?.kill();
        };
      },
      { scope: sectionRef }
    );

    // Mousemove handler to keep Monolithic Ticket snapped directly to cursor
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!xSet.current || !ySet.current) return;

      // Keep ticket in-bounds near screen edges
      const ticketWidth = 290;
      const ticketHeight = 220;
      const offsetX = e.clientX + ticketWidth > window.innerWidth ? -ticketWidth - 15 : 20;
      const offsetY = e.clientY + ticketHeight > window.innerHeight ? -ticketHeight - 15 : 20;

      xSet.current(e.clientX + offsetX);
      ySet.current(e.clientY + offsetY);
    };

    // ─── Hover In / Out Handlers ───
    const handleEventEnter = (event: EventItem) => {
      setActiveTicket(event);
      setHoveredEventId(event.id);

      if (ticketRef.current) {
        gsap.killTweensOf(ticketRef.current);
        gsap.to(ticketRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleEventLeave = () => {
      setHoveredEventId(null);

      if (ticketRef.current) {
        gsap.killTweensOf(ticketRef.current);
        gsap.to(ticketRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.16,
          ease: "power2.in",
          onComplete: () => {
            setActiveTicket(null);
          },
        });
      } else {
        setActiveTicket(null);
      }
    };

    return (
      <section
        ref={sectionRef}
        id="events-hackathons"
        {...props}
        className={`relative w-full h-screen min-h-screen overflow-hidden bg-[#F37021] text-[#0a0a0a] flex flex-col justify-between py-12 sm:py-16 select-none ${
          props.className || ""
        }`}
        onMouseMove={handleMouseMove}
      >
        {/* ─── Top Category Header & Indicator ─── */}
        <div className="relative z-10 w-full px-6 sm:px-12 flex justify-between items-center text-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <span className="text-[28px] sm:text-[32px] leading-none font-bold indent-[-2px]">
              ・
            </span>
            <span className="text-[11px] sm:text-[13px] font-mono tracking-[0.25em] uppercase font-bold">
              EVENTS & HACKATHONS
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono tracking-[0.2em] uppercase opacity-75">
            <span>SCROLL HORIZONTAL</span>
            <span>→</span>
          </div>
        </div>

        {/* ─── Step 1 & 2: Massive Horizontal Scroll Marquee Track ─── */}
        <div className="relative z-10 w-full overflow-visible my-auto">
          <div
            ref={marqueeTrackRef}
            className={`flex items-center whitespace-nowrap will-change-transform transition-opacity duration-300 ${
              hoveredEventId ? "opacity-30" : "opacity-100"
            }`}
          >
            {/* Initial leading spacer */}
            <div className="w-[8vw] shrink-0" aria-hidden="true" />

            {EVENTS_DATA.map((event) => {
              const isCurrentHovered = hoveredEventId === event.id;
              return (
                <div key={event.id} className="flex items-center shrink-0">
                  {/* Event Title Button / Trigger */}
                  <span
                    className={`inline-block cursor-pointer px-4 sm:px-8 py-2 uppercase leading-[0.82] tracking-tight transition-all duration-200 ${
                      isCurrentHovered
                        ? "!opacity-100 scale-[1.02] text-black"
                        : "text-[#0a0a0a]"
                    }`}
                    style={{
                      fontFamily: "var(--font-six-caps)",
                      fontSize: "clamp(6.5rem, 16vw, 17.5rem)",
                    }}
                    data-details={event.details}
                    onMouseEnter={() => handleEventEnter(event)}
                    onMouseLeave={handleEventLeave}
                  >
                    {event.title}
                  </span>

                  {/* Bullet Point Separator */}
                  <span
                    className="inline-block px-4 sm:px-10 text-[#0a0a0a]/60 select-none"
                    style={{
                      fontFamily: "var(--font-six-caps)",
                      fontSize: "clamp(4rem, 10vw, 11rem)",
                    }}
                    aria-hidden="true"
                  >
                    •
                  </span>
                </div>
              );
            })}

            {/* Trailing spacer */}
            <div className="w-[12vw] shrink-0" aria-hidden="true" />
          </div>
        </div>

        {/* ─── Bottom Meta Bar ─── */}
        <div className="relative z-10 w-full px-6 sm:px-12 flex justify-between items-center text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase opacity-75">
          <span>06 OFFICIAL STOPS</span>
          <span>COMPETITIONS & RECOGNITION</span>
        </div>

        {/* ─── Step 4: The Monolithic Ticket Cursor Element ─── */}
        <div
          ref={ticketRef}
          className="pointer-events-none fixed top-0 left-0 z-50 rounded-none bg-[#0a0a0a] text-[#F37021] p-6 w-72 shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-[#F37021]/30 will-change-transform select-none"
          style={{ transform: "translate(0px, 0px)" }}
        >
          {activeTicket && (
            <div className="flex flex-col">
              {/* Ticket Top Meta */}
              <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase opacity-70">
                <span>ADMIT ONE // PASS</span>
                <span>{`NO. ${activeTicket.code}`}</span>
              </div>

              {/* Perforated Divider */}
              <div className="border-t border-dashed border-[#F37021]/30 my-3" />

              {/* Category Tag */}
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase opacity-60">
                {activeTicket.category}
              </span>

              {/* Event Name */}
              <h4 className="mt-1 text-[15px] font-bold font-[helvetica,Arial,sans-serif] uppercase tracking-tight leading-snug text-[#F37021]">
                {activeTicket.title}
              </h4>

              {/* Event Details */}
              <p className="mt-3 text-[11px] font-mono tracking-wider text-[#F37021]/85 uppercase leading-relaxed">
                {activeTicket.details}
              </p>

              {/* Bottom Perforated Stamping */}
              <div className="border-t border-dashed border-[#F37021]/30 mt-4 pt-3 flex justify-between items-center text-[9px] font-mono tracking-[0.2em] uppercase opacity-60">
                <span>STATUS: VERIFIED</span>
                <span>2025 - 2026</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
);

EventsHackathonsSection.displayName = "EventsHackathonsSection";

export default EventsHackathonsSection;
