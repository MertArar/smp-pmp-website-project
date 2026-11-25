"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function withLayoutRefresh(module: { default: ComponentType }) {
  const Section = module.default;
  return function LoadedSection({ onReady }: { onReady: () => void }) {
    useEffect(onReady, [onReady]);
    return <><Section /><RefreshLayout /></>;
  };
}
const News = dynamic(() => import("./home-news/HomeNews").then(withLayoutRefresh), { ssr: false });
const Trust = dynamic(() => import("./global-trust/GlobalTrust").then(withLayoutRefresh), { ssr: false });
const Social = dynamic(() => import("./social-media/SocialMedia").then(withLayoutRefresh), { ssr: false });
const Video = dynamic(() => import("./home-video/HomeVideo").then(withLayoutRefresh), { ssr: false });

function DeferredSection({ component: Component, label }: { component: ComponentType<{ onReady: () => void }>; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let scheduled = false;
    let idle = 0;
    let timer = 0;
    const near = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || scheduled) return;
      scheduled = true;
      near.disconnect();
      const mount = () => { if (!disposed) setMounted(true); };
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(mount, { timeout: 250 });
      else timer = window.setTimeout(mount, 0);
    }, { rootMargin: "1400px 0px" });
    const start = () => near.observe(element);
    if (document.documentElement.dataset.startupReady === "true") start();
    else window.addEventListener("sempa:startup-reveal", start, { once: true });
    return () => {
      disposed = true;
      near.disconnect();
      window.removeEventListener("sempa:startup-reveal", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);
  return <div ref={host} data-deferred-home={label} style={ready ? undefined : { minHeight: "100svh" }}>
    {mounted && <Component onReady={onReady} />}
  </div>;
}

function RefreshLayout() {
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => ScrollTrigger.refresh()); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, []);
  return null;
}

export default function HomeDeferredSections() {
  return <>
    <DeferredSection component={News} label="news" />
    <DeferredSection component={Trust} label="trust" />
    <DeferredSection component={Social} label="social" />
    <DeferredSection component={Video} label="video" />
  </>;
}
