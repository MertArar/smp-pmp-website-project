"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import dynamic from "next/dynamic";
import { HeroSection } from "@/features/home/hero/HeroSection";
import Product from "@/features/home/product/Product";

const Hero3D = dynamic(
  () => import("@/features/home/hero/Hero3D").then((module) => module.Hero3D),
  { ssr: false },
);

const HERO_RETURN_EVENT = "sempa:hero-return-default";
const HERO_RETURN_COMPLETE_EVENT = "sempa:hero-return-complete";
const PRODUCT_MODEL_REQUEST_EVENT = "sempa:product-model-request";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function rangeProgress(value: number, start: number, end: number) {
  if (end === start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export default function HomeJourney() {
  const journeyRef = useRef<HTMLDivElement | null>(null);
  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const productAnchorRef = useRef<HTMLDivElement | null>(null);
  const [stickyRangeHeight, setStickyRangeHeight] = useState<number | null>(
    null,
  );

  const blastRef = useRef(false);
  const explosionProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const scrollExplosionRef = useRef(0);
  const selectionReadyRef = useRef(false);
  const journeyProgressRef = useRef(0);
  const returningToHeroRef = useRef(false);
  const returnScrollLockedRef = useRef(false);
  const beginReturnLockRef = useRef<() => void>(() => {});
  const cancelReturnLockRef = useRef<() => void>(() => {});
  const canvasShakeRef = useRef<HTMLDivElement | null>(null);
  const productReturnExplosionRef = useRef(0);

  useEffect(() => {
    const handleReturnExplosion = (event: Event) => {
      const detail = (event as CustomEvent<{ progress?: number }>).detail;
      productReturnExplosionRef.current = clamp01(detail?.progress ?? 0);
    };
    window.addEventListener(
      "sempa:product-upward-blast",
      handleReturnExplosion,
    );
    return () => {
      window.removeEventListener(
        "sempa:product-upward-blast",
        handleReturnExplosion,
      );
      productReturnExplosionRef.current = 0;
    };
  }, []);

  useEffect(() => {
    let frozenY = 0;
    let frame = 0;
    let timeout = 0;
    const unlock = () => {
      returnScrollLockedRef.current = false;
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
    const hold = () => {
      if (!returnScrollLockedRef.current) return;
      if (Math.abs(window.scrollY - frozenY) > 0.5) window.scrollTo({ top: frozenY, behavior: "instant" });
      frame = requestAnimationFrame(hold);
    };
    beginReturnLockRef.current = () => {
      if (returnScrollLockedRef.current) return;
      const current = document.querySelector<HTMLElement>("[data-home-model]")?.dataset.homeModel;
      if (!current || current === "/home/products/models/sempa-sce.glb") return;
      frozenY = Math.max(0, (productAnchorRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY);
      returnScrollLockedRef.current = true;
      journeyProgressRef.current = 1;
      scrollExplosionRef.current = productReturnExplosionRef.current = 0;
      hold();
      timeout = window.setTimeout(unlock, 1200);
    };
    const wheel = (event: WheelEvent) => { if (returnScrollLockedRef.current) event.preventDefault(); };
    const touch = (event: TouchEvent) => { if (returnScrollLockedRef.current) event.preventDefault(); };
    const key = (event: KeyboardEvent) => {
      if (returnScrollLockedRef.current && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key) && !(event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]"))) event.preventDefault();
    };
    cancelReturnLockRef.current = unlock;
    window.addEventListener(HERO_RETURN_COMPLETE_EVENT, unlock);
    window.addEventListener("wheel", wheel, { capture: true, passive: false });
    window.addEventListener("touchmove", touch, { capture: true, passive: false });
    window.addEventListener("keydown", key, true);
    window.addEventListener("pagehide", unlock);
    return () => {
      unlock();
      beginReturnLockRef.current = cancelReturnLockRef.current = () => {};
      window.removeEventListener(HERO_RETURN_COMPLETE_EVENT, unlock);
      window.removeEventListener("wheel", wheel, true);
      window.removeEventListener("touchmove", touch, true);
      window.removeEventListener("keydown", key, true);
      window.removeEventListener("pagehide", unlock);
    };
  }, []);


  useLayoutEffect(() => {
    const hero = heroWrapperRef.current;
    const product = productAnchorRef.current;
    if (!hero || !product) return;

    const updateStickyHeight = () => {
      const heroHeight = hero.getBoundingClientRect().height;
      const productViewport = product.querySelector(
        "[data-home-product-viewport]",
      );
      const measuredProductHeight = (
        productViewport ?? product
      ).getBoundingClientRect().height;
      const productHeight =
        innerWidth < 1024
          ? Math.min(innerHeight, measuredProductHeight)
          : measuredProductHeight;
      setStickyRangeHeight(heroHeight + productHeight);
    };

    updateStickyHeight();
    const resizeObserver = new ResizeObserver(updateStickyHeight);
    resizeObserver.observe(hero);
    resizeObserver.observe(product);
    window.addEventListener("resize", updateStickyHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateStickyHeight);
    };
  }, []);

  useGSAP(
    () => {
      const journey = journeyRef.current;
      const productAnchor = productAnchorRef.current;
      if (!journey || !productAnchor) return;

      const state = { progress: 0 };

      const returnToHero = () => {
        if (returningToHeroRef.current) return;
        returningToHeroRef.current = true;
        beginReturnLockRef.current();
        window.dispatchEvent(new Event(HERO_RETURN_EVENT));
      };

      const returnToProduct = () => {
        if (returnScrollLockedRef.current) return;
        if (!returningToHeroRef.current) return;
        returningToHeroRef.current = false;
        window.dispatchEvent(new Event(PRODUCT_MODEL_REQUEST_EVENT));
      };

      const tween = gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          endTrigger: productAnchor,
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (returnScrollLockedRef.current) return;
            const progress = clamp01(self.progress);
            let explosion = 0;

            if (progress > 0 && progress < 0.32) {
              explosion = Math.pow(rangeProgress(progress, 0, 0.32), 1.1);
            } else if (progress >= 0.32 && progress < 0.64) {
              explosion = 1;
            } else if (progress >= 0.64 && progress < 0.88) {
              explosion = 1 - smoothstep(rangeProgress(progress, 0.64, 0.88));
            }

            // Reverse scrolling follows the same continuous flight as entry.
            // No instant 100% explosion when the user changes scroll direction.
            scrollExplosionRef.current = explosion;
            journeyProgressRef.current = smoothstep(
              rangeProgress(progress, 0.05, 0.94),
            );

            // Switch back to the hero GLB as soon as the product starts leaving.
            // The 3D scene animates this change before the hero becomes visible.
            if (self.direction === -1 && progress < 0.999) {
              returnToHero();
            } else if (self.direction === 1 && progress > 0.94) {
              returnToProduct();
            }
          },
          onLeave: () => {
            journeyProgressRef.current = 1;
            scrollExplosionRef.current = 0;
            if (!returnScrollLockedRef.current) returnToProduct();
          },
          onEnterBack: () => {
            returnToHero();
          },
          onLeaveBack: () => {
            journeyProgressRef.current = 0;
            scrollExplosionRef.current = 0;
          },
        },
      });

      return () => {
        cancelReturnLockRef.current();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: journeyRef },
  );

  return (
    <div ref={journeyRef} className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 w-full"
        style={{
          height:
            stickyRangeHeight !== null ? `${stickyRangeHeight}px` : "200svh",
        }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div
            ref={canvasShakeRef}
            className="absolute inset-0 will-change-transform"
          >
            <Hero3D
              selectionReadyRef={selectionReadyRef}
              blastRef={blastRef}
              explosionProgressRef={explosionProgressRef}
              pointerRef={pointerRef}
              scrollExplosionRef={scrollExplosionRef}
              productReturnExplosionRef={productReturnExplosionRef}
              journeyProgressRef={journeyProgressRef}
              returningToHeroRef={returningToHeroRef}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 min-[1024px]:z-auto">
        <div ref={heroWrapperRef} className="relative w-full min-[1024px]:z-20">
          <HeroSection
            blastRef={blastRef}
            explosionProgressRef={explosionProgressRef}
            pointerRef={pointerRef}
            canvasShakeRef={canvasShakeRef}
          />
        </div>
        <div ref={productAnchorRef} className="relative w-full">
          <Product selectionReadyRef={selectionReadyRef} />
        </div>
      </div>
    </div>
  );
}
