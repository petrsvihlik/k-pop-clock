import { useLayoutEffect, useState } from "preact/hooks";
import type { Store } from "@engine/index.ts";

/**
 * Subscribe a Preact component to an engine Store. Any `setState` on the store
 * schedules a re-render. `useLayoutEffect` wires the subscription before paint
 * so no early update is missed.
 */
export function useStore<T extends object>(store: Store<T>): Readonly<T> {
  const [, bump] = useState(0);
  useLayoutEffect(() => store.subscribe(() => bump((n) => n + 1)), [store]);
  return store.get();
}
