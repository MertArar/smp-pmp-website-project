"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import SolutionsSection from "@/features/home/solutions/SolutionsSection";

const MAP_VIDEOS = [
  { name: "Water Treatment", file: "Water Treatment.mp4" },
  {
    name: "Agricultural Irrigation & Drainage",
    file: "Agricultural Irrigation & Drainage.mp4",
  },
  { name: "Building System", file: "Building System.mp4" },
  { name: "Power Plants", file: "powerplant.mp4" },
];

// Same item-based reveal system as AboutUsPage. Never animate the map's
// positioning container with a transform; its children contain overlays.
type RevealDirection = "up" | "left" | "right";
const revealVariants: Variants = {
  hidden: ({
    direction = "up",
    reduced = false,
  }: {
    direction?: RevealDirection;
    reduced?: boolean;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -34
        : direction === "right"
          ? 34
          : 0,
    y: reduced ? 0 : direction === "up" ? 34 : 0,
  }),
  visible: { opacity: 1, x: 0, y: 0 },
};
function reveal(
  direction: RevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.38,
) {
  return {
    variants: revealVariants,
    custom: { direction, reduced },
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -14% 0px" },
    transition: {
      duration: reduced ? 0 : 0.95,
      delay: reduced ? 0 : delay,
      ease: [0.25, 0.85, 0.3, 1] as [number, number, number, number],
    },
  };
}

/** Load once near the viewport; decode/play only while visible. */
function CatalogVideo({
  file,
  assetBase,
  className = "",
  label,
}: {
  file: string;
  assetBase: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let loaded = false;
    const sync = () => {
      if (disposed) return;
      if (
        visible &&
        !document.hidden &&
        !preference.matches &&
        video.readyState >= 2
      ) {
        void video
          .play()
          .then(() => {
            if (disposed || !visible || document.hidden || preference.matches)
              video.pause();
          })
          .catch(() => {});
      } else video.pause();
    };
    const near = new IntersectionObserver(
      (entries) => {
        if (loaded || !entries.some((e) => e.isIntersecting)) return;
        loaded = true;
        video.src = `${assetBase}/${file}`;
        video.preload = "auto";
        video.load();
        near.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      sync();
    });
    near.observe(video);
    observer.observe(video);
    video.addEventListener("loadeddata", sync);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      disposed = true;
      near.disconnect();
      observer.disconnect();
      video.removeEventListener("loadeddata", sync);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      video.pause();
    };
  }, [file, assetBase]);
  return (
    <video
      ref={ref}
      data-catalog-video={file}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    />
  );
}

/** Sliding circular CTA, matching the SmartPump home-section button. */
function CircleLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex h-11 min-h-11 shrink-0 items-center overflow-hidden rounded-[19px] border-[0.5px] border-[#9eb7d0] bg-white/20 text-left text-[14px] text-[#252525] backdrop-blur-[11px] transition-[background-color] duration-[350ms] hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] motion-reduce:transition-none ${className}`}
    >
      <span
        className="absolute left-[14px] top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[34px] group-focus-visible:translate-x-[34px] motion-reduce:transition-none"
        style={{
          fontFamily: "var(--font-sf-pro), sans-serif",
          fontWeight: 410,
          fontVariationSettings: '"wght" 410, "wdth" 125',
          lineHeight: 1.07,
          letterSpacing: "-0.04em",
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(100%_-_38px)] top-1/2 z-[3] flex size-[33px] -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005eff_0%,#001ea2_100%)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[5px] group-focus-visible:left-[5px] motion-reduce:transition-none"
      >
        <FiArrowUpRight
          size={20}
          strokeWidth={3.2}
          className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

export function JoinSempaGlobal({ assetBase }: { assetBase: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      aria-label="Join Sempa Global"
      className="max-md:border-0 max-md:bg-transparent max-md:px-0 max-md:py-0 max-md:backdrop-blur-none max-md:before:absolute max-md:before:inset-x-0 max-md:before:top-[76px] max-md:before:h-[140px] max-md:before:rounded-[30px] max-md:before:border max-md:before:border-[#9eb7d0]/45 max-md:before:bg-white/20 relative mx-auto mt-8 mb-24 w-[calc(100%-40px)] max-w-[571px] rounded-[30px] border border-[#9eb7d0]/45 bg-white/20 px-6 py-5 backdrop-blur-[12px] md:mt-24 md:mb-28 md:flex md:min-h-[124px] md:w-[min(84%,600px)] md:max-w-none md:items-center md:px-7 md:py-3 lg:min-h-[clamp(124px,8.6vw,172px)] lg:w-[clamp(571px,40vw,800px)] lg:px-[clamp(28px,2.1vw,42px)] lg:mb-32"
    >
      <div className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_130px_1fr] md:gap-2 max-md:justify-items-center md:w-full md:grid-cols-[1fr_100px_1fr] md:gap-5 lg:grid-cols-[1fr_clamp(100px,7vw,140px)_1fr] lg:gap-6">
        <motion.h2
          {...reveal("left", 0, reduced, 0.26)}
          className="text-[24px] leading-none font-[300] tracking-[-.04em] max-md:mb-6 max-md:text-center md:text-right md:text-[24px] lg:text-[clamp(24px,1.75vw,34px)] [font-variation-settings:'wdth'_125,'wght'_300]"
        >
          Join Now
          <br />
          Sempa Global
        </motion.h2>
        <motion.div
          {...reveal("up", 0.06, reduced, 0.24)}
          className="relative mx-auto w-full max-w-[130px] md:max-w-none max-md:max-w-[112px]"
        >
          <div className="aspect-square overflow-hidden rounded-full">
            <CatalogVideo
              assetBase={assetBase}
              file="sempa-global.webm"
              className="size-full scale-[1.16] object-cover"
            />
          </div>
          <CircleLink
            href="/global#global-partnership-desk"
            className="z-10 -mt-3 w-[117px] md:absolute md:bottom-0 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:translate-y-[calc(50%+4px)] lg:w-[128px]"
          >
            Apply
          </CircleLink>
        </motion.div>
        <motion.p
          {...reveal("right", 0.12, reduced, 0.26)}
          className="text-[12px] leading-[1.12] text-[#1d2049] max-md:mt-8 max-md:max-w-[300px] max-md:text-center md:col-span-1 md:text-[12px] lg:text-[clamp(12px,.9vw,16px)]"
        >
          Sempa, a manufacturer and investor of pump technologies, invites you
          to the world pump movement.
        </motion.p>
      </div>
    </section>
  );
}

export function CatalogSolutions({ assetBase }: { assetBase: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      aria-labelledby="catalog-solutions-title"
      className="mx-auto w-full max-w-[1600px] px-5 md:w-[94%] md:px-8 lg:w-[90%] lg:px-6 xl:px-10"
    >
      <motion.div
        {...reveal("up", 0, reduced, 0.34)}
        className="mb-12 px-2 text-center md:mb-14 lg:mb-20"
      >
        <h2
          id="catalog-solutions-title"
          className="text-[clamp(36px,4vw,50px)] leading-none tracking-[-.04em] text-[#005eff]"
        >
          Solutions
        </h2>
        <p className="mx-auto mt-4 max-w-[730px] text-[15px] leading-[1.12] text-[#4887b8]">
          Explore our wide range of high-performance pumps and choose the ideal
          solution tailored to your specific operational needs.
        </p>
      </motion.div>
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.12, margin: "0px 0px -12% 0px" }}
        transition={{
          duration: reduced ? 0 : 0.95,
          ease: [0.25, 0.85, 0.3, 1],
        }}
      >
        <SolutionsSection variant="catalog" assetBase={assetBase}>
          <div
            data-map-videos
            className="absolute bottom-[14%] left-1/2 z-30 flex -translate-x-1/2 gap-[clamp(6px,1vw,12px)]"
          >
            {MAP_VIDEOS.map((video, index) => (
              <motion.div
                key={video.file}
                {...reveal("up", 0.055 * index, reduced, 0.24)}
                className="shrink-0"
              >
                <Link
                  href="/solutions-category"
                  aria-label={`Explore ${video.name} solutions`}
                  title={video.name}
                  className="block size-[clamp(44px,5.1vw,71px)] shrink-0 overflow-hidden rounded-[clamp(6px,.8vw,11px)] border border-white/90 bg-white shadow-[0_5px_14px_#0d579225] transition-[transform,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005eff] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.06] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_0_0_2px_#005eff,0_5px_18px_#005eff50]"
                >
                  <CatalogVideo
                    assetBase={assetBase}
                    file={video.file}
                    className="size-full object-cover"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </SolutionsSection>
      </motion.div>
    </section>
  );
}
