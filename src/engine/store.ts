/**
 * Store — a tiny reactive state container with React-style `setState`.
 *
 * Engine primitive, framework-agnostic. A game controller keeps one Store of
 * plain serialisable state; the UI subscribes and re-renders on change. Keeping
 * this independent of any view library is what lets the same game logic drive a
 * Preact UI today and something else tomorrow.
 */

export type Listener = () => void;

export type StatePatch<T> = Partial<T> | ((prev: Readonly<T>) => Partial<T>);

export class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener>();

  constructor(initial: T) {
    this.state = initial;
  }

  /** Current state. Treat as read-only — never mutate in place. */
  get(): Readonly<T> {
    return this.state;
  }

  /**
   * Merge a partial patch into state and notify subscribers, then run the
   * optional callback (mirrors React's `setState(patch, cb)`). The callback is
   * where side effects that must happen after the state settles belong — saving
   * to disk, speaking a prompt, etc.
   */
  setState(patch: StatePatch<T>, cb?: () => void): void {
    const next = typeof patch === "function" ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.emit();
    if (cb) cb();
  }

  /** Subscribe to changes. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}
