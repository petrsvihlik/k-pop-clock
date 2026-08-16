import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchDeployedBuild, watchForUpdates } from "@engine/index.ts";

const respondWith = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: async () => body } as unknown as Response);

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("fetchDeployedBuild", () => {
  it("reads the deployed build id", async () => {
    const fetchMock = respondWith({ build: "2026-01-01T00:00:00.000Z" });
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchDeployedBuild()).resolves.toBe("2026-01-01T00:00:00.000Z");
  });

  it("defeats caching so an installed copy cannot read a stale file", async () => {
    const fetchMock = respondWith({ build: "x" });
    vi.stubGlobal("fetch", fetchMock);
    await fetchDeployedBuild();
    const [url, opts] = fetchMock.mock.calls[0]!;
    expect(url).toMatch(/version\.json\?t=\d+/);
    expect(opts).toMatchObject({ cache: "no-store" });
  });

  it("returns null when offline or on an error response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(fetchDeployedBuild()).resolves.toBeNull();
    vi.stubGlobal("fetch", respondWith({ build: "x" }, false));
    await expect(fetchDeployedBuild()).resolves.toBeNull();
    vi.stubGlobal("fetch", respondWith({}));
    await expect(fetchDeployedBuild()).resolves.toBeNull();
  });
});

describe("watchForUpdates", () => {
  it("reports a build different from the running one", async () => {
    vi.stubGlobal("fetch", respondWith({ build: "some-other-build" }));
    const onUpdate = vi.fn();
    const stop = watchForUpdates({ onUpdate });
    await vi.advanceTimersByTimeAsync(0);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    stop();
  });

  it("stays quiet while the deployed build matches", async () => {
    const { RUNNING_BUILD } = await import("@engine/index.ts");
    vi.stubGlobal("fetch", respondWith({ build: RUNNING_BUILD }));
    const onUpdate = vi.fn();
    const stop = watchForUpdates({ onUpdate, intervalMs: 1000 });
    await vi.advanceTimersByTimeAsync(5000);
    expect(onUpdate).not.toHaveBeenCalled();
    stop();
  });

  it("notifies only once, then stops polling", async () => {
    const fetchMock = respondWith({ build: "newer" });
    vi.stubGlobal("fetch", fetchMock);
    const onUpdate = vi.fn();
    watchForUpdates({ onUpdate, intervalMs: 1000 });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("re-checks when the app comes back to the foreground", async () => {
    const fetchMock = respondWith({ build: "newer" });
    vi.stubGlobal("fetch", fetchMock);
    const onUpdate = vi.fn();
    const stop = watchForUpdates({ onUpdate, intervalMs: 60_000 });
    await vi.advanceTimersByTimeAsync(0);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    stop();

    // a fresh watcher only fires on focus
    const fetch2 = respondWith({ build: "newer-still" });
    vi.stubGlobal("fetch", fetch2);
    const onUpdate2 = vi.fn();
    const stop2 = watchForUpdates({ onUpdate: onUpdate2, intervalMs: 60_000 });
    fetch2.mockClear();
    window.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
    expect(fetch2).toHaveBeenCalled();
    stop2();
  });

  it("stops checking once stopped", async () => {
    const fetchMock = respondWith({ build: "newer" });
    vi.stubGlobal("fetch", fetchMock);
    const onUpdate = vi.fn();
    const stop = watchForUpdates({ onUpdate, intervalMs: 1000 });
    stop();
    fetchMock.mockClear();
    await vi.advanceTimersByTimeAsync(5000);
    window.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
