"use client";

import React from "react";
import Link from "next/link";
import HeaderLogo from "@/components/dom/HeaderLogo";
import BounceLine from "@/components/dom/BounceLine";

/**
 * AboutPage — 1:1 Architectural Replica of Hisami Kurita's /about Route
 *
 * Includes:
 * - Replicated 2D Kurita Structural Layout:
 *   - AboutMainVisualSection: HELLO, WORLD / VISHWAS K / IS FULL-STACK / AI ENGINEER AT REVA UNIVERSITY
 *   - Floating Profile Card with institution details
 *   - AboutIntroSection with requested bio context:
 *     'Final-year B.Tech Information Science and Engineering student at REVA University, Bengaluru.
 *      Building agentic workflows and specializing in Full-Stack web development and AI Engineering (Machine Learning, Computer Vision, NLP).'
 *   - Technical Stack badges & Navigation controls
 */
export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#f0efeb] text-[#302c1a] overflow-x-hidden">
      {/* ─── Navigation Elements ─── */}
      <HeaderLogo />

      {/* ─── Page Content ─── */}
      <div className="relative z-10 w-full">
        {/* ─── Hero Section (AboutMainVisualSection) ─── */}
        <section className="relative w-full min-h-screen px-6 sm:px-10 pt-[92px] pb-[92px] overflow-hidden">
          {/* Top Back Link */}
          <div className="mb-8 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.15em] text-[#302c1a] hover:opacity-60 transition-opacity"
            >
              <span>←</span>
              <span>BACK TO HERO</span>
            </Link>
          </div>

          {/* Heading Container replicating Kurita's About Hero */}
          <div className="relative">
            {/* Top-Left Metadata Read Area */}
            <div className="mb-6">
              <span className="block text-[32px] md:text-[36px] leading-[0.79] text-[#302c1a] indent-[-2px] font-[helvetica,Arial,sans-serif]">
                ・
              </span>
              <div className="font-[helvetica,Arial,sans-serif] text-[10px] md:text-[12px] tracking-[0.02em] leading-[1.15] text-[#302c1a] opacity-85 mt-1">
                <span className="block font-bold">MYSKILL :</span>
                <span className="block">FULL-STACK WEB / NEXT.JS</span>
                <span className="block">AI ENGINEERING & AGENTIC WORKFLOWS</span>
                <span className="block">MACHINE LEARNING / COMPUTER VISION / NLP</span>
              </div>
            </div>

            {/* Massive Typography Lines */}
            <h1
              className="relative uppercase leading-[0.88] tracking-[-0.002em] text-[#302c1a] select-none"
              style={{ fontFamily: "var(--font-six-caps)" }}
            >
              {/* Line 1: HELLO, WORLD */}
              <div className="relative block mb-6 md:mb-8 max-w-[clamp(400px,50vw,600px)]">
                <BounceLine width={470} origin="left" strokeColor="#302c1a" />
                <span className="block text-[clamp(4rem,13vw,10.5rem)] pt-2 md:pt-4">
                  HELLO, WORLD
                </span>
              </div>

              {/* Line 2: VISHWAS K */}
              <div className="relative block mb-6 md:mb-8 ml-0 sm:ml-[clamp(0px,12vw,160px)] max-w-[clamp(500px,65vw,820px)]">
                <BounceLine width={820} origin="right" strokeColor="#302c1a" />
                <span className="block text-[clamp(4rem,13vw,10.5rem)] pt-2 md:pt-4">
                  VISHWAS K
                </span>
              </div>

              {/* Line 3: IS FULL-STACK */}
              <div className="relative block mb-6 md:mb-8 ml-0 sm:ml-[clamp(0px,22vw,300px)] max-w-[clamp(550px,70vw,900px)]">
                <BounceLine width={900} origin="left" strokeColor="#302c1a" />
                <span className="block text-[clamp(4rem,13vw,10.5rem)] pt-2 md:pt-4">
                  IS FULL-STACK
                </span>
              </div>

              {/* Line 4: AI ENGINEER AT REVA */}
              <div className="relative block ml-0 sm:ml-[clamp(0px,8vw,120px)] max-w-[clamp(650px,85vw,1100px)]">
                <BounceLine width={1100} origin="right" strokeColor="#302c1a" />
                <span className="block text-[clamp(3.5rem,11.5vw,9.5rem)] pt-2 md:pt-4">
                  AI ENGINEER AT REVA UNIVERSITY
                </span>
              </div>
            </h1>

            {/* Floating Card: Institution Details */}
            <div
              className="mt-12 md:absolute md:top-24 md:right-16 z-20 cursor-pointer select-none"
              style={{
                width: "clamp(240px, 22vw, 290px)",
                perspective: "1000px",
              }}
            >
              <div
                className="w-full rounded-[14px] p-6 relative overflow-hidden bg-[#ffd955] text-[#302c1a] shadow-[0_16px_40px_rgba(48,44,26,0.12)]"
                style={{ transform: "rotate(6deg)" }}
              >
                <span className="block text-[28px] leading-none text-[#302c1a] indent-[-2px]">
                  ・
                </span>
                <span className="block text-[18px] font-bold tracking-[0.02em] font-[helvetica,Arial,sans-serif] mt-1">
                  REVA UNIVERSITY
                </span>
                <div className="mt-6 text-[11px] font-[helvetica,Arial,sans-serif] font-medium leading-[1.3] opacity-90">
                  <span className="block">B.TECH IN INFORMATION SCIENCE</span>
                  <span className="block">& ENGINEERING (2022 - 2026)</span>
                  <span className="block mt-2">BENGALURU, KARNATAKA, INDIA</span>
                </div>
                <div className="mt-8 text-right">
                  <span
                    className="block text-[65px] leading-[0.8] text-[#302c1a]/80"
                    style={{ fontFamily: "var(--font-six-caps)" }}
                  >
                    REVA.EDU
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Intro Section (AboutIntroSection) ─── */}
        <section className="relative w-full py-20 px-6 sm:px-10 border-t border-[rgba(48,44,26,0.1)]">
          {/* Running Section Header */}
          <div className="flex items-center gap-4 text-[11px] font-mono tracking-[0.2em] opacity-40 uppercase mb-12">
            <span>INTRODUCTION</span>
            <span>・</span>
            <span>ABOUT ME</span>
            <span>・</span>
            <span>BACKGROUND</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Section Label */}
            <div className="lg:col-span-3">
              <span className="block text-[32px] md:text-[36px] leading-[0.79] text-[#302c1a] indent-[-2px] font-[helvetica,Arial,sans-serif]">
                ・
              </span>
              <h2 className="text-[14px] font-bold tracking-[0.1em] font-mono uppercase mt-2">
                PROFILE & BIO
              </h2>
            </div>

            {/* Center/Right: Big Statement & Exact Pre-filled Bio Context */}
            <div className="lg:col-span-9">
              {/* Massive Condensed Statement */}
              <div
                className="text-[clamp(3.5rem,8vw,7rem)] uppercase leading-[0.88] tracking-[-0.002em] mb-10 text-[#302c1a]"
                style={{ fontFamily: "var(--font-six-caps)" }}
              >
                <span className="block">BUILDING AGENTIC WORKFLOWS</span>
                <span className="block">SPECIALIZING IN FULL-STACK WEB</span>
                <span className="block">& ARTIFICIAL INTELLIGENCE.</span>
              </div>

              {/* Exact Pre-filled Bio Context matching User Requirement */}
              <div className="max-w-2xl bg-white/60 p-6 md:p-8 rounded-[12px] border border-[rgba(48,44,26,0.08)] shadow-sm">
                <p className="text-[14px] md:text-[16px] leading-[1.6] font-[helvetica,Arial,sans-serif] tracking-[0.01em] text-[#302c1a]">
                  Final-year B.Tech Information Science and Engineering student at REVA University, Bengaluru. Building agentic workflows and specializing in Full-Stack web development and AI Engineering (Machine Learning, Computer Vision, NLP).
                </p>
              </div>

              {/* Technical Competencies Grid */}
              <div className="mt-12 pt-8 border-t border-[rgba(48,44,26,0.1)]">
                <h3 className="text-[11px] font-mono tracking-[0.2em] uppercase opacity-50 mb-6">
                  CORE COMPETENCIES & DOMAINS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-[12px] font-mono">
                  <div className="bg-white/40 p-4 rounded-[8px] border border-[rgba(48,44,26,0.06)]">
                    <span className="block font-bold mb-2">01 / FRONTEND & 3D</span>
                    <span className="block opacity-75">React, Next.js, TypeScript</span>
                    <span className="block opacity-75">Tailwind CSS, GSAP, Three.js / R3F</span>
                  </div>
                  <div className="bg-white/40 p-4 rounded-[8px] border border-[rgba(48,44,26,0.06)]">
                    <span className="block font-bold mb-2">02 / AI & MACHINE LEARNING</span>
                    <span className="block opacity-75">LLMs, Agentic Workflows</span>
                    <span className="block opacity-75">NLP, Computer Vision, PyTorch</span>
                  </div>
                  <div className="bg-white/40 p-4 rounded-[8px] border border-[rgba(48,44,26,0.06)]">
                    <span className="block font-bold mb-2">03 / BACKEND & SYSTEMS</span>
                    <span className="block opacity-75">Node.js, Python, FastAPI</span>
                    <span className="block opacity-75">RESTful APIs, Git, Cloud Deployments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom Footer Bar ─── */}
        <footer className="py-12 px-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono tracking-[0.15em] opacity-50 border-t border-[rgba(48,44,26,0.1)]">
          <span>VISHWAS K ・ PORTFOLIO 2026</span>
          <Link href="/" className="hover:opacity-100 transition-opacity mt-4 sm:mt-0">
            RETURN TO HOME ↑
          </Link>
        </footer>
      </div>
    </main>
  );
}
