/**
 * LocalSave — versioned, fault-tolerant localStorage persistence.
 *
 * Browser-only games have no backend, so the save file *is* localStorage. This
 * wrapper never throws (private-mode / disabled storage degrades to in-memory
 * defaults), merges loaded data over defaults so new fields appear gracefully,
 * and supports a migration hook so old save shapes can be upgraded in place.
 */

export interface LocalSaveOptions<T extends object> {
  /** Storage key, e.g. "timeislands_v1". Bump the suffix on breaking changes. */
  key: string;
  /** Values used when nothing is stored yet or storage is unavailable. */
  defaults: T;
  /**
   * Optional upgrader for older stored blobs. Receives whatever was parsed and
   * returns the fields to overlay on top of defaults. Return `raw` unchanged if
   * no migration is needed.
   */
  migrate?: (raw: unknown) => Partial<T>;
}

export class LocalSave<T extends object> {
  constructor(private readonly opts: LocalSaveOptions<T>) {}

  load(): T {
    try {
      const raw = localStorage.getItem(this.opts.key);
      if (!raw) return { ...this.opts.defaults };
      const parsed = JSON.parse(raw) as unknown;
      const migrated = this.opts.migrate ? this.opts.migrate(parsed) : (parsed as Partial<T>);
      return { ...this.opts.defaults, ...migrated };
    } catch {
      return { ...this.opts.defaults };
    }
  }

  save(data: T): void {
    try {
      localStorage.setItem(this.opts.key, JSON.stringify(data));
    } catch {
      /* storage full or unavailable — game continues without persistence */
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.opts.key);
    } catch {
      /* ignore */
    }
  }
}
