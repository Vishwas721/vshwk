"use client";

import gsap from "gsap";

export type MouseListener = (state: {
  clientX: number;
  clientY: number;
  normX: number; // -1 to 1 normalized from viewport center
  normY: number; // -1 to 1 normalized from viewport center
}) => void;

class MouseCoordinator {
  private static instance: MouseCoordinator;
  private listeners: Set<MouseListener> = new Set();
  private clientX = 0;
  private clientY = 0;
  private normX = 0;
  private normY = 0;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): MouseCoordinator {
    if (!MouseCoordinator.instance) {
      MouseCoordinator.instance = new MouseCoordinator();
    }
    return MouseCoordinator.instance;
  }

  public init() {
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    this.clientX = window.innerWidth / 2;
    this.clientY = window.innerHeight / 2;

    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
    gsap.ticker.add(this.handleTick);
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.normX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.normY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  private handleTick = () => {
    if (this.listeners.size === 0) return;
    const payload = {
      clientX: this.clientX,
      clientY: this.clientY,
      normX: this.normX,
      normY: this.normY,
    };
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error("Error in mouse ticker listener:", err);
      }
    });
  };

  public subscribe(listener: MouseListener): () => void {
    this.init();
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState() {
    return {
      clientX: this.clientX,
      clientY: this.clientY,
      normX: this.normX,
      normY: this.normY,
    };
  }
}

export const mouseCoordinator = MouseCoordinator.getInstance();
