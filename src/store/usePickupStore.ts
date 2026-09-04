import { create } from "zustand";

export interface ProjectData {
  id: string;
  num: number;
  title: string;
  category: string;
  desc: string;
  color: string;
  textColor: string;
}

export const PICKUP_PROJECTS: ProjectData[] = [
  {
    id: "privex",
    num: 1,
    title: "Privex",
    category: "DECENTRALIZED PRIVACY & WEB3 INFRASTRUCTURE",
    desc: "A NEXT-GENERATION PRIVACY LAYER EMPOWERING SECURE TRANSACTIONS AND CONFIDENTIAL DECENTRALIZED PROTOCOLS.",
    color: "#F9F6F0",
    textColor: "#302c1a",
  },
  {
    id: "nagarikone",
    num: 2,
    title: "NagarikOne",
    category: "CIVIC GOVERNANCE & DIGITAL IDENTITY PLATFORM",
    desc: "A UNIFIED CITIZEN SERVICES APPLICATION BRIDGING MODERN ACCESSIBILITY, VERIFIABLE CREDENTIALS, AND PUBLIC UTILITIES.",
    color: "#FFD8A8",
    textColor: "#302c1a",
  },
  {
    id: "summaid",
    num: 3,
    title: "SummAID",
    category: "AI HEALTHCARE ASSISTANT & MEDICAL SUMMARIZATION",
    desc: "AN ADVANCED GENERATIVE WORKFLOW TOOL SYNTHESIZING CLINICAL AUDIO AND NOTES INTO CONCISE HEALTHCARE DOCUMENTATION.",
    color: "#D8F3DC",
    textColor: "#1b4332",
  },
];

export interface PickupState {
  currentNumber: number;
  direction: "next" | "prev" | "init";
  scene: string;
  isAnimationActive: boolean;
  isCurrent: boolean;
  projects: ProjectData[];
  enter: () => void;
  leave: () => void;
  setScene: (sceneName: string) => void;
  setCurrentNumber: (num: number, direction?: "next" | "prev" | "init") => void;
  next: () => boolean;
  prev: () => boolean;
  setAnimationActive: (active: boolean) => void;
}

export const usePickupStore = create<PickupState>((set, get) => ({
  currentNumber: 1,
  direction: "init",
  scene: "",
  isAnimationActive: false,
  isCurrent: false,
  projects: PICKUP_PROJECTS,

  enter: () =>
    set({
      isAnimationActive: true,
      isCurrent: true,
      direction: "init",
      currentNumber: 1,
      scene: "next01",
    }),

  leave: () =>
    set({
      isAnimationActive: false,
      isCurrent: false,
      scene: "",
    }),

  setScene: (sceneName: string) =>
    set({
      scene: sceneName,
    }),

  setCurrentNumber: (num: number, direction: "next" | "prev" | "init" = "next") =>
    set({
      currentNumber: Math.max(1, Math.min(3, num)),
      direction,
      scene: `next0${num}`,
    }),

  next: () => {
    const { currentNumber } = get();
    if (currentNumber < 3) {
      const nextNum = currentNumber + 1;
      set({
        currentNumber: nextNum,
        direction: "next",
        scene: `next0${nextNum}`,
      });
      return true;
    }
    return false;
  },

  prev: () => {
    const { currentNumber } = get();
    if (currentNumber > 1) {
      const prevNum = currentNumber - 1;
      set({
        currentNumber: prevNum,
        direction: "prev",
        scene: `prev0${prevNum}`,
      });
      return true;
    }
    return false;
  },

  setAnimationActive: (active: boolean) =>
    set({
      isAnimationActive: active,
    }),
}));
