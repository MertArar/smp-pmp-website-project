"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const SERIES_LABELS = "ASL | TKF | TKF-M | TKF-AH | TKF-K | DPT-DI | DPT-TR | TKF-KE | MKF-Y | TKF-Y";

/** Alternate straight and spring returns; hidden cards have no running animation. */
export default function SeriesMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const [copies, setCopies] = useState(4);
  const [reduced, setReduced] = useState(true);
  const x = useMotionValue(0);

  useEffect(() => {
    const element = root.current;
    const text = copy.current;
    if (!element || !text) return;
    let intersecting = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    const sync = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(entries => {
      intersecting = entries.some(entry => entry.isIntersecting);
      sync();
    });
    const measure = () => {
      const textWidth = text.getBoundingClientRect().width;
      const cardWidth = element.closest("[data-series-card]")?.clientWidth ?? element.clientWidth;
      // Keep one full copy before the starting point, including spring overshoot.
      // The trailing copies cover two card widths of travel plus the viewport.
      setBounds({ left: -textWidth - cardWidth * 2, right: -textWidth });
      setCopies(Math.max(4, Math.ceil((cardWidth * 2 + element.clientWidth) / Math.max(1, textWidth)) + 3));
    };
    const resize = new ResizeObserver(measure);
    observer.observe(element);
    resize.observe(text);
    resize.observe(element);
    measure();
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      resize.disconnect();
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    x.set(bounds.right);
    if (!visible || reduced || bounds.left === bounds.right) return;
    let stopped = false;
    let animation: ReturnType<typeof animate> | undefined;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    const pause = () => new Promise<void>(resolve => { pauseTimer = setTimeout(resolve, 1000); });
    const run = async () => {
      await pause();
      while (!stopped) {
        for (const step of [
          { target: bounds.left, spring: false },
          { target: bounds.right, spring: false },
          { target: bounds.left, spring: true },
          { target: bounds.right, spring: true },
        ]) {
          if (stopped) return;
          animation = animate(x, step.target, step.spring
            ? { type: "spring", duration: .5, bounce: .15 }
            : { duration: 1, ease: "linear" });
          await animation;
          if (stopped) return;
          await pause();
        }
      }
    };
    void run();
    return () => {
      stopped = true;
      animation?.stop();
      clearTimeout(pauseTimer);
    };
  }, [visible, reduced, bounds, x]);

  return <div ref={root} data-series-marquee data-running={visible && !reduced && bounds.left < bounds.right} className="absolute right-[7%] bottom-[12%] left-[7%] overflow-hidden text-[10px] text-[#9eb7d0] uppercase md:text-[11px] lg:text-[clamp(11px,.85vw,16px)]">
    <span className="sr-only">{SERIES_LABELS}</span>
    <motion.div aria-hidden="true" className="flex w-max whitespace-nowrap" style={{ x }}>
      {Array.from({ length: copies }, (_, index) => <span key={index} ref={index === 0 ? copy : undefined} className="shrink-0 pr-3">{SERIES_LABELS} |</span>)}
    </motion.div>
  </div>;
}
