"use client";

import { useEffect, useRef } from "react";

const repeatDelay = 4000;

export default function useRepeatingTitle(duration?: number, restingDuration?: number) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let repeatTimer: number | undefined;
    let revealTimer: number | undefined;

    const play = () => {
      heading.setAttribute("data-title-revealing", "");
      revealTimer = window.setTimeout(() => {
        heading.removeAttribute("data-title-revealing");
      }, duration);
    };

    const stop = () => {
      window.clearInterval(repeatTimer);
      window.clearTimeout(revealTimer);
      heading.removeAttribute("data-title-revealing");
    };

    const sync = () => {
      stop();
      if (!visible || document.hidden || motion.matches) return;
      if (duration === undefined) {
        // CSS handles cycles that include their own exit and resting state.
        heading.setAttribute("data-title-revealing", "");
        return;
      }
      play();
      repeatTimer = window.setInterval(play, restingDuration === undefined ? repeatDelay : duration + restingDuration);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      sync();
    }, { threshold: 0.5 });

    observer.observe(heading);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      stop();
    };
  }, [duration, restingDuration]);

  return ref;
}
