"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const instance = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Existing scenes consume wheel events themselves. Relay only unhandled
    // events, after their listeners, using Lenis's public eventsTarget API.
    // No wrapper is rendered: sticky elements and Footer's sibling lookup stay intact.
    const wheelTarget = document.createElement("div");
    const lenis = new Lenis({
      eventsTarget: wheelTarget,
      // Trionn-style response: preserve the wheel distance, but let a gesture
      // settle over roughly 1.2 seconds instead of snapping through it with a
      // high per-frame lerp. This curve was matched against the live site.
      duration: 2.55,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
      anchors: true,
      autoResize: true,
      autoRaf: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
      prevent: (element) => element.matches("textarea, select, [role='dialog'], [aria-modal='true']"),
    });
    instance.current = lenis;

    let footer: HTMLElement | null = null;
    let bindFrame = 0;
    const reset = () => {
      lenis.stop();
      lenis.start();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented) {
        reset();
        return;
      }
      if (document.body.style.overflow === "hidden") {
        reset();
        const scrollable = event.composedPath().some((node) => {
          if (!(node instanceof HTMLElement) || node === document.body || node === document.documentElement) return false;
          return node.scrollHeight > node.clientHeight && /auto|scroll/.test(getComputedStyle(node).overflowY);
        });
        if (!scrollable) event.preventDefault();
        return;
      }
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || lenis.prefersReducedMotion) {
        reset();
        return;
      }
      const forwarded = new WheelEvent("wheel", {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaMode: event.deltaMode,
        cancelable: event.cancelable,
      });
      // Retain the real target ancestry for Lenis's nested-scroll/prevent checks.
      forwarded.composedPath = () => event.composedPath();
      wheelTarget.dispatchEvent(forwarded);
      if (forwarded.defaultPrevented) event.preventDefault();
      else reset();
    };
    const bindWheel = () => {
      bindFrame = 0;
      window.removeEventListener("wheel", onWheel);
      window.addEventListener("wheel", onWheel, { passive: false });
      footer = document.querySelector<HTMLElement>("[data-footer-scroll-transition]");
    };
    const scheduleBind = () => {
      if (!bindFrame) bindFrame = requestAnimationFrame(bindWheel);
    };
    // Client navigations and streamed/dynamically mounted scenes can register
    // their handlers later than this persistent provider. Keep their priority.
    const mounts = new MutationObserver((records) => {
      if (records.some((record) => [...record.addedNodes, ...record.removedNodes].some((node) => node instanceof Element))) scheduleBind();
    });
    mounts.observe(document.body, { childList: true, subtree: true });
    const scrollLock = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") reset();
    });
    scrollLock.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    scheduleBind();

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    const tick = (seconds: number) => {
      const phase = footer?.dataset.phase;
      // The footer owns its scroll position during its reversible transition.
      // Discard incoming momentum instead of fighting its existing RAF loop.
      if ((phase === "opening" || phase === "closing") &&
          (lenis.isScrolling === "smooth" || Math.abs(lenis.targetScroll - lenis.actualScroll) > 0.5)) reset();
      lenis.raf(seconds * 1000);
    };
    gsap.ticker.add(tick);

    // Stop wheel inertia before native touch, keyboard, or browser restoration.
    // These events remain native; no preventDefault or manual scroll restoration.
    window.addEventListener("touchstart", reset, { passive: true, capture: true });
    window.addEventListener("keydown", reset, true);
    window.addEventListener("popstate", reset);
    window.addEventListener("pageshow", reset);

    return () => {
      mounts.disconnect();
      scrollLock.disconnect();
      cancelAnimationFrame(bindFrame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", reset, true);
      window.removeEventListener("keydown", reset, true);
      window.removeEventListener("popstate", reset);
      window.removeEventListener("pageshow", reset);
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
      lenis.destroy();
      instance.current = null;
    };
  }, []);

  useEffect(() => {
    // Next.js owns the actual reset/restoration position. Only cancel inertia
    // and refresh measurements after the newly committed route is laid out.
    instance.current?.stop();
    instance.current?.start();
    const frame = requestAnimationFrame(() => {
      instance.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
