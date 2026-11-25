"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** First-document boot screen; route changes never restart the loader. */
export default function StartupScreen() {
  const pathname = usePathname();
  const initialPath = useRef(pathname);
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">("loading");
  const [canSkip, setCanSkip] = useState(false);
  const revealRef = useRef<() => void>(() => {});
  useEffect(() => {
    const root = document.documentElement;
    let disposed = false;
    let fontsReady = !document.fonts || document.fonts.status === "loaded";
    let revealed = false;
    let doneTimer = 0;
    const reveal = () => {
      if (disposed || revealed) return;
      revealed = true;
      root.dataset.startupReady = "true";
      window.dispatchEvent(new Event("sempa:startup-reveal"));
      setPhase("revealing");
      doneTimer = window.setTimeout(() => setPhase("done"), 220);
    };
    const check = () => {
      const homeReady = initialPath.current !== "/" || root.dataset.heroReady === "true" || window.scrollY > window.innerHeight * 1.5;
      if (fontsReady && homeReady) reveal();
    };
    revealRef.current = reveal;
    // Never trap a visitor behind failed WebGL, fonts, or a slow connection.
    const safety = window.setTimeout(reveal, 8000);
    const skip = window.setTimeout(() => setCanSkip(true), 4000);
    const fontTimeout = window.setTimeout(() => { fontsReady = true; check(); }, 2000);
    void document.fonts?.ready.then(() => { if (!disposed) { fontsReady = true; check(); } });
    const stopScroll = (event: KeyboardEvent) => {
      if (!revealed && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) event.preventDefault();
    };
    window.addEventListener("sempa:hero-ready", check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("keydown", stopScroll, true);
    check();
    return () => {
      disposed = true;
      clearTimeout(safety); clearTimeout(skip); clearTimeout(fontTimeout); clearTimeout(doneTimer);
      window.removeEventListener("sempa:hero-ready", check);
      window.removeEventListener("scroll", check);
      window.removeEventListener("keydown", stopScroll, true);
      revealRef.current = () => {};
    };
  }, []);
  if (phase === "done") return null;
  return (
    <div data-startup-screen data-state={phase} role="status" aria-live="polite" aria-label="Site loading"
      onWheel={event => { if (phase === "loading") event.preventDefault(); }}
      className="fixed inset-0 z-[9999] flex touch-none flex-col items-center justify-center gap-8 bg-[#061824] text-white transition-opacity duration-200 motion-reduce:transition-none"
      style={{ opacity: phase === "revealing" ? 0 : 1, pointerEvents: phase === "revealing" ? "none" : "auto" }}>
      {/* Small existing brand asset; no extra font or animation library. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/header/sempa-logo.png" width="178" height="48" alt="SEMPA" className="h-auto w-[178px] brightness-0 invert" />
      <span className="h-px w-32 overflow-hidden bg-white/15" aria-hidden="true">
        <span className="block h-full w-12 animate-[startup-sweep_1.1s_ease-in-out_infinite] bg-[#4687B8] motion-reduce:animate-none" />
      </span>
      <span className="text-[11px] tracking-[0.18em] text-white/60">PREPARING YOUR EXPERIENCE</span>
      {canSkip && <button type="button" onClick={() => revealRef.current()} className="rounded-full border border-white/25 px-4 py-2 text-xs text-white/75 focus-visible:outline-2 focus-visible:outline-white">Continue to site</button>}
      <style>{`@keyframes startup-sweep { 0%,100% { transform:translateX(-48px) } 50% { transform:translateX(128px) } }`}</style>
    </div>
  );
}
