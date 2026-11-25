"use client";

import { useEffect, type RefObject } from "react";

/** Warm media ahead of scrolling; retain its decoded frame and playback position. */
export default function useViewportVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let pending = false;
    const sync = () => {
      if (disposed) return;
      if (!visible || document.hidden || preference.matches) { video.pause(); return; }
      if (video.readyState >= 2 && video.paused && !pending) {
        pending = true;
        void video.play().catch(() => {}).finally(() => {
          pending = false;
          if (disposed || !visible || document.hidden || preference.matches) video.pause();
        });
      }
    };
    const prepare = () => {
      if (video.dataset.viewportPrepared) return;
      video.dataset.viewportPrepared = "true";
      let attached = false;
      video.querySelectorAll<HTMLSourceElement>("source[data-video-src]").forEach(source => {
        source.src = source.dataset.videoSrc!;
        attached = true;
      });
      video.preload = "auto";
      if (attached) video.load();
    };
    const near = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { prepare(); near.disconnect(); }
    }, { rootMargin: "2500px 0px" });
    const visibility = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) prepare();
      sync();
    }, { rootMargin: "200px 0px" });
    const rect = video.getBoundingClientRect();
    visible = rect.bottom > -200 && rect.top < innerHeight + 200;
    if (rect.bottom > -2500 && rect.top < innerHeight + 2500) prepare();
    sync();
    near.observe(video);
    visibility.observe(video);
    video.addEventListener("loadeddata", sync);
    video.addEventListener("canplay", sync);
    video.addEventListener("play", sync);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      near.disconnect(); visibility.disconnect();
      video.removeEventListener("loadeddata", sync);
      video.removeEventListener("canplay", sync);
      video.removeEventListener("play", sync);
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [ref]);
}
