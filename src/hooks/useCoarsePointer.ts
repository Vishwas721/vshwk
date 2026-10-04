"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

/**
 * True on touch-first devices (phones/tablets). Server snapshot is false so
 * the desktop (mouse) behaviour is the default render.
 */
export function useCoarsePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
