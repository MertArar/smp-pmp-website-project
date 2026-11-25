"use client";

import { useEffect } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

/** Replays on viewport re-entry without wrapping or resizing existing content. */
export default function useScrollReveal(selector: string) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion) return;

    const saved = new Map<HTMLElement, { opacity: string; transform: string }>();
    const running = new Map<HTMLElement, { stop: () => void }>();
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        running.get(element)?.stop();
        if (!entry.isIntersecting) {
          element.dataset.scrollReveal = "waiting";
          // Reset offscreen only; scrolling itself never drives React renders.
          element.style.opacity = "0";
          continue;
        }
        const original = saved.get(element)!;
        element.style.transform = original.transform;
        const hasTransform = getComputedStyle(element).transform !== "none";
        element.dataset.scrollReveal = "visible";
        running.set(element, animate(element, hasTransform
          ? { opacity: [0, 1] }
          : { opacity: [0, 1], y: [24, 0] }, {
          duration: .7,
          delay: Math.min(stagger++ * .045, .18),
          ease: [.22, 1, .36, 1],
          onComplete: () => {
            element.style.transform = original.transform;
            element.style.opacity = original.opacity;
            running.delete(element);
          },
        }));
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    const register = () => {
      for (const element of root.querySelectorAll<HTMLElement>(selector)) {
        if (saved.has(element)) continue;
        saved.set(element, { opacity: element.style.opacity, transform: element.style.transform });
        element.dataset.scrollReveal = "waiting";
        element.style.opacity = "0";
        observer.observe(element);
      }
      // Sliders can replace their cards; release detached animation targets.
      for (const [element, original] of saved) {
        if (root.contains(element)) continue;
        observer.unobserve(element);
        running.get(element)?.stop();
        running.delete(element);
        element.style.opacity = original.opacity;
        element.style.transform = original.transform;
        delete element.dataset.scrollReveal;
        saved.delete(element);
      }
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
      running.forEach((animation) => animation.stop());
      saved.forEach((original, element) => {
        element.style.opacity = original.opacity;
        element.style.transform = original.transform;
        delete element.dataset.scrollReveal;
      });
    };
  }, [scope, animate, reducedMotion, selector]);

  return scope;
}
