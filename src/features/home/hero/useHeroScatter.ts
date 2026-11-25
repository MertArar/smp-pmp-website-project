"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

type ScatterController = { scatter: () => void; restore: () => void };
type Pose = { x: number; y: number; z: number; rotationX: number; rotationY: number; rotation: number };
type Actor = { element: HTMLElement; base: Pose; from: Pose; current: Pose; amplitude: Pose; sin: number; cos: number };
const keys = ["x", "y", "z", "rotationX", "rotationY", "rotation"] as const;
const zeroPose = (): Pose => ({ x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotation: 0 });

export function useHeroScatter(
  sectionRef: RefObject<HTMLElement | null>,
  blastRef: { current: boolean },
  explosionProgressRef: { current: number },
) {
  const controllerRef = useRef<ScatterController | null>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let context: gsap.Context | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let orbit: gsap.core.Tween | null = null;
    let actors: Actor[] = [];
    const motion = { blend: 0, phase: 0 };
    let scattered = false;
    let returning = false;
    let visible = true;
    let painting = false;
    let resizeFrame = 0;
    let clearFlagsFrame = 0;
    let returnStartProgress = 1;
    let returnStartedAt = 0;
    const setBlast = (active: boolean) => {
      header?.toggleAttribute("data-hero-blasting", active);
      section.toggleAttribute("data-hero-blasting", active);
    };
    // A single transform write per piece; no layout reads or per-piece clocks.
    const paint = () => {
      const sin = Math.sin(motion.phase), cos = Math.cos(motion.phase) - 1;
      const returnRatio = returning
        ? Math.max(0, Math.min(1, explosionProgressRef.current / returnStartProgress))
        : motion.blend;
      for (const actor of actors) {
        const wave = returning ? 0 : sin * actor.cos + cos * actor.sin;
        const sway = returning ? 0 : cos * actor.cos - sin * actor.sin;
        for (const key of keys) {
          if (returning) {
            actor.current[key] = actor.base[key] * returnRatio;
          } else {
            const offset = key === "y" || key === "rotationX" ? sway : wave;
            const target = actor.base[key] + offset * actor.amplitude[key];
            actor.current[key] = actor.from[key] + (target - actor.from[key]) * motion.blend;
          }
        }
        const p = actor.current;
        actor.element.style.transform = `perspective(1100px) translate3d(${p.x}px,${p.y}px,${p.z}px) rotate(${p.rotation}deg) rotateY(${p.rotationY}deg) rotateX(${p.rotationX}deg)`;
      }
      if (returning && (returnRatio <= 0.001 || performance.now() - returnStartedAt > 1800)) {
        finishReturn();
      }
    };
    const sync = () => {
      const active = !document.hidden && visible && actors.length > 0;
      orbit?.paused(!active);
      if (active && !painting) { gsap.ticker.add(paint); painting = true; }
      else if (!active && painting) { gsap.ticker.remove(paint); painting = false; }
    };
    const stop = () => {
      orbit?.kill(); orbit = null;
      timeline?.kill(); timeline = null;
      gsap.ticker.remove(paint); painting = false;
    };
    const reset = () => {
      cancelAnimationFrame(clearFlagsFrame); clearFlagsFrame = 0;
      stop(); context?.revert(); context = null;
      actors = []; scattered = false; returning = false;
      motion.blend = 0; motion.phase = 0; setBlast(false);
    };
    const finishReturn = () => {
      if (!returning) return;
      stop();
      // Revert while transform transitions are still disabled. Keep the flag
      // for one painted frame so Menu's normal 1100ms hover transition cannot
      // create a late tail after the pump has already reassembled.
      context?.revert(); context = null;
      actors = []; scattered = false; returning = false;
      motion.blend = 0; motion.phase = 0;
      clearFlagsFrame = requestAnimationFrame(() => {
        clearFlagsFrame = 0;
        setBlast(false);
      });
    };
    const snapshot = () => new Map(actors.map(actor => [actor.element, { ...actor.current }]));
    const pieces = () => Array.from(document.querySelectorAll<HTMLElement>("[data-hero-scatter]"))
      .filter(element => (section.contains(element) || header?.contains(element)) && element.offsetWidth > 0 && element.offsetHeight > 0);

    const scatter = (currentPoses?: Map<HTMLElement, Pose>) => {
      if (scattered || preference.matches) return;
      const starts = currentPoses ?? snapshot();
      reset(); scattered = true;
      const width = innerWidth, height = innerHeight, compact = width < 768;
      let headerIndex = 0;
      // Read all rectangles at rest before applying the first style write.
      actors = pieces().map((element, index) => {
        const rect = element.getBoundingClientRect();
        const inHeader = Boolean(header?.contains(element));
        const role = element.dataset.heroScatter;
        const alternate = index % 2 ? -1 : 1;
        const strength = compact ? 0.6 : 1;
        let base: Pose;
        if (inHeader) {
          const order = headerIndex++;
          const shift = (order % 2 ? -1 : 1) * Math.min(width * 0.048, 65);
          base = {
            x: Math.max(12 - rect.left, Math.min(width - rect.right - 12, shift)),
            y: Math.min(height * (0.085 + order % 3 * 0.032), compact ? 85 : 130),
            z: 12 + order % 3 * 9,
            rotationX: alternate * 5, rotationY: alternate * 7,
            rotation: alternate * (4 + order % 3 * 2),
          };
        } else {
          const scale = compact ? 0.5 : 1;
          base = {
            x: width * (role === "heading" ? -0.025 : alternate * 0.025) * scale,
            y: height * (role === "links" ? 0.03 : -0.035) * scale,
            z: (role === "cue" ? 6 : 35) * scale,
            rotationX: alternate * 7 * scale, rotationY: alternate * 9 * scale,
            rotation: (role === "heading" ? -5 : alternate * 5) * scale,
          };
        }
        const from = starts.get(element) ?? zeroPose();
        return {
          element, base, from, current: { ...from },
          amplitude: {
            x: Math.min(width * (inHeader ? 0.007 : 0.014), inHeader ? 9 : 22) * strength,
            y: Math.min(height * (inHeader ? 0.012 : 0.022), inHeader ? 12 : 25) * strength,
            z: (inHeader ? 14 : 35) * strength,
            rotationX: (inHeader ? 7 : 11) * strength,
            rotationY: (inHeader ? 9 : 13) * strength,
            rotation: (inHeader ? 6 : 8) * strength,
          },
          sin: Math.sin(index * 0.73), cos: Math.cos(index * 0.73),
        };
      });
      setBlast(true);
      context = gsap.context(() => {
        gsap.set(actors.map(actor => actor.element), { willChange: "transform", transformOrigin: "50% 50%", force3D: true });
        timeline = gsap.timeline().to(motion, { blend: 1, duration: 1, ease: "power2.out" });
        // The orbit runs from the first frame, underneath the entry envelope.
        orbit = gsap.to(motion, { phase: Math.PI * 2, duration: 12, repeat: -1, ease: "none" });
      }, section);
      paint(); sync();
    };
    const restore = () => {
      if (blastRef.current) return;
      if (!scattered) { if (!returning) setBlast(false); return; }
      scattered = false; stop(); returning = true;
      for (const actor of actors) { actor.base = { ...actor.current }; actor.from = zeroPose(); }
      returnStartProgress = Math.max(0.001, explosionProgressRef.current);
      returnStartedAt = performance.now();
      motion.blend = 1;
      // The UI now reads the pump's actual close progress on every frame.
      // Menu, logos and hero content therefore finish on the exact same frame.
      paint(); sync();
    };
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (scattered) scatterAfterResize();
      });
    };
    const scatterAfterResize = () => { const current = snapshot(); scattered = false; scatter(current); };
    const onPreference = () => { reset(); if (blastRef.current) scatter(); };
    const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); sync(); });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", onResize);
    preference.addEventListener("change", onPreference);
    controllerRef.current = { scatter, restore };
    if (blastRef.current) scatter();
    return () => {
      controllerRef.current = null;
      observer.disconnect(); cancelAnimationFrame(resizeFrame);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
      preference.removeEventListener("change", onPreference);
      reset();
    };
  }, [sectionRef, blastRef, explosionProgressRef]);
  return controllerRef;
}
