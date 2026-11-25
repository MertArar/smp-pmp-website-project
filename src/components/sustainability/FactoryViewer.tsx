"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const FactoryScene = dynamic(() => import("./FactoryScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function FactoryViewer() {
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setActive(visible && !document.hidden); setReduced(preference.matches); };
    const warm = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNear(true); warm.disconnect(); }
    }, { rootMargin: "500px" });
    const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); sync(); });
    warm.observe(element);
    observer.observe(element);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { warm.disconnect(); observer.disconnect(); preference.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return <div ref={root} data-factory-viewer data-auto-rotate={active && !reduced && ready && !failed} data-model-ready={ready && !failed} data-model-state={failed ? "fallback" : ready ? "ready" : near ? "loading" : "idle"} aria-busy={near && !ready && !failed} className="relative size-full">
    <Image src="/sustainability/ges.webp" alt="SEMPA solar-roof factory" fill sizes="(min-width:1280px) 60vw, 100vw" className={`pointer-events-none object-contain transition-opacity duration-700 motion-reduce:transition-none ${ready && !failed ? "opacity-0" : "opacity-100"}`} />
    {near && !failed && <div className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}>
      <SceneBoundary onError={onError}><FactoryScene active={active} reduced={reduced} onReady={onReady} /></SceneBoundary>
    </div>}
    {ready && !failed && <span aria-hidden="true" className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-[10px] text-[#0d5792] backdrop-blur-md md:text-xs">360° · Drag to rotate</span>}
    {near && !ready && !failed && <span role="status" className="absolute bottom-[8%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/65 px-3 py-1.5 text-[10px] text-[#0d5792]">Loading 3D factory…</span>}
  </div>;
}
