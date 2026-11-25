"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
} from "react";

/** Keep media prepared ahead of entry, without decoding it outside the viewport. */
export default function HomeMediaVideo({
  autoPlay = false,
  ref: externalRef,
  ...props
}: ComponentPropsWithRef<"video">) {
  const localRef = useRef<HTMLVideoElement>(null);
  const setRef = useCallback(
    (video: HTMLVideoElement | null) => {
      localRef.current = video;
      if (typeof externalRef === "function") return externalRef(video);
      if (externalRef) externalRef.current = video;
    },
    [externalRef],
  );

  useEffect(() => {
    const video = localRef.current;
    if (!video) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let wantsPlayback = autoPlay;
    let internalPause = false;
    let pending = false;
    let disposed = false;
    let startupReady = location.pathname !== "/" || document.documentElement.dataset.startupReady === "true";
    const suspend = () => {
      if (!video.paused) {
        internalPause = true;
        video.pause();
      }
    };
    const sync = () => {
      if (disposed) return;
      if (!startupReady || !visible || document.hidden || (autoPlay && preference.matches)) {
        suspend();
        return;
      }
      if (wantsPlayback && video.paused && video.readyState >= 2 && !pending) {
        pending = true;
        void video
          .play()
          .catch(() => {})
          .finally(() => {
            pending = false;
            if (
              disposed ||
              !startupReady || !visible ||
              document.hidden ||
              (autoPlay && preference.matches)
            )
              suspend();
          });
      }
    };
    const onPlay = () => {
      wantsPlayback = true;
      sync();
    };
    const onPause = () => {
      if (internalPause) internalPause = false;
      else wantsPlayback = false;
    };
    const near = new IntersectionObserver(
      (entries) => {
        if (startupReady && entries.some((entry) => entry.isIntersecting)) {
          video.preload = "auto";
          near.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    const visibility = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    const rect = video.getBoundingClientRect();
    visible = rect.bottom > -200 && rect.top < innerHeight + 200;
    if (startupReady && rect.bottom > -800 && rect.top < innerHeight + 800)
      video.preload = "auto";
    const reveal = () => {
      startupReady = true;
      const bounds = video.getBoundingClientRect();
      if (bounds.bottom > -800 && bounds.top < innerHeight + 800) video.preload = "auto";
      sync();
    };
    window.addEventListener("sempa:startup-reveal", reveal, { once: true });
    near.observe(video);
    visibility.observe(video);
    video.addEventListener("loadeddata", sync);
    video.addEventListener("canplay", sync);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    sync();
    return () => {
      disposed = true;
      window.removeEventListener("sempa:startup-reveal", reveal);
      near.disconnect();
      visibility.disconnect();
      video.removeEventListener("loadeddata", sync);
      video.removeEventListener("canplay", sync);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      video.pause();
    };
  }, [autoPlay]);

  // Native sources retain metadata/first-frame preparation; never reset currentTime.
  return <video {...props} autoPlay={false} preload="none" ref={setRef} />;
}
