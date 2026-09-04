import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  isAppLoaded: boolean;
  isTransitioning: boolean;
  transitionTarget: string | null;
  setAppLoaded: (loaded?: boolean) => void;
  startTransition: (target?: string) => void;
  endTransition: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  isAppLoaded: false,
  isTransitioning: false,
  transitionTarget: null,
  setAppLoaded: (loaded = true) => set({ isAppLoaded: loaded }),
  startTransition: (target = "/about") =>
    set({ isTransitioning: true, transitionTarget: target }),
  endTransition: () => set({ isTransitioning: false, transitionTarget: null }),
}));
