import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false during the server render and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
