/**
 * Small random helpers shared across game logic.
 * Centralised so a future engine feature (seeded RNG for daily challenges,
 * replays, testing) can swap the source in one place.
 */

/** Integer in [0, n). */
export const randInt = (n: number): number => Math.floor(Math.random() * n);

/** A random element of a non-empty array. */
export const pick = <T>(arr: readonly T[]): T => arr[randInt(arr.length)];

/** A shuffled copy of the array (does not mutate the input). */
export const shuffle = <T>(arr: readonly T[]): T[] => arr.slice().sort(() => Math.random() - 0.5);
