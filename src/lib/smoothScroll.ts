const DAMPING_PER_SECOND = 18;
const SETTLE_DISTANCE = 0.75;
let frame: number | null = null;

export function stopSmoothScroll() {
  if (frame === null) return;
  cancelAnimationFrame(frame);
  frame = null;
}

function pageScrollIsLocked() {
  return [document.documentElement, document.body].some((element) => {
    const { overflowY } = getComputedStyle(element);
    return overflowY === "hidden" || overflowY === "clip";
  });
}

export function pageWheelDelta(event: WheelEvent) {
  const { deltaMode, deltaX, deltaY } = event;
  if (
    event.defaultPrevented || !event.cancelable ||
    event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
    !deltaY || Math.abs(deltaX) >= Math.abs(deltaY) ||
    pageScrollIsLocked()
  ) return 0;

  // Let scrollable panels and form controls handle their own wheel input.
  for (const element of event.composedPath()) {
    if (element === document.body || element === document.documentElement) break;
    if (!(element instanceof HTMLElement)) continue;
    if (element.matches("select, textarea, input[type='number']")) return 0;
    if (element.scrollHeight > element.clientHeight) {
      const { overflowY } = getComputedStyle(element);
      if (overflowY === "auto" || overflowY === "scroll") return 0;
    }
  }

  const unit = deltaMode === 1 ? 16 : deltaMode === 2 ? window.innerHeight : 1;
  return deltaY * unit;
}

export function startSmoothScroll() {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scroller = document.documentElement;
  const clampToPage = (top: number) =>
    Math.max(0, Math.min(top, scroller.scrollHeight - scroller.clientHeight));

  let target = 0;
  let position = 0;
  let lastScrollY = 0;
  let lastTime = 0;
  let activeUrl = "";

  function animate(time: number) {
    // Route changes and external scrolls (such as ScrollTrigger pins) take priority.
    if (window.scrollY !== lastScrollY || location.href !== activeUrl || pageScrollIsLocked()) {
      stopSmoothScroll();
      return;
    }

    target = clampToPage(target);
    const elapsed = Math.min(Math.max(0, time - lastTime), 50) / 1000;
    const settled = Math.abs(target - position) <= SETTLE_DISTANCE;
    position = settled ? target : position + (target - position) * -Math.expm1(-DAMPING_PER_SECOND * elapsed);
    lastTime = time;

    // Move the document so sticky elements, observers and scroll scenes see real scroll.
    window.scrollTo({ top: position, behavior: "instant" });
    lastScrollY = window.scrollY;
    frame = settled ? null : requestAnimationFrame(animate);
  }

  function onWheel(event: WheelEvent) {
    // Scene listeners run in capture and can consume the gesture first.
    const delta = motion.matches ? 0 : pageWheelDelta(event);
    if (!delta) {
      stopSmoothScroll();
      return;
    }

    const current = window.scrollY;
    if (
      frame === null || current !== lastScrollY || location.href !== activeUrl ||
      Math.sign(target - current) !== Math.sign(delta)
    ) {
      stopSmoothScroll();
      position = target = lastScrollY = current;
      lastTime = performance.now();
      activeUrl = location.href;
    }

    const next = clampToPage(target + delta);
    if (next === current && frame === null) return;

    event.preventDefault();
    target = next;
    if (frame === null) frame = requestAnimationFrame(animate);
  }

  const listeners = new AbortController();
  const { signal } = listeners;
  window.addEventListener("wheel", onWheel, { passive: false, signal });
  for (const event of ["pointerdown", "keydown", "hashchange", "popstate", "pagehide"]) {
    window.addEventListener(event, stopSmoothScroll, { passive: true, signal });
  }
  document.addEventListener("visibilitychange", stopSmoothScroll, { signal });
  motion.addEventListener("change", stopSmoothScroll, { signal });

  return () => {
    listeners.abort();
    stopSmoothScroll();
  };
}
