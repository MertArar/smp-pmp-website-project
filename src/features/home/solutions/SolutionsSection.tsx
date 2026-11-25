"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHomeCompact } from "../HomeMobileSections";
import HomeMediaVideo from "@/features/home/HomeMediaVideo";
import WaveButton from "@/components/ui/WaveButton";

gsap.registerPlugin(ScrollTrigger);

const FIGMA_BLUR_PX = 25;
const REVEAL_SCROLL_SCREENS = 0.58;
const MAP_HOLD_SCROLL_SCREENS = 0.17;
const ARTWORK_ASPECT = 1561.19 / 871.31;
const ARTWORK_EXTRA_PX = 4;
const ARTWORK_OVERSCAN = 1.02;
const CAMERA_ZOOM_DESKTOP = 1.06;
const CAMERA_ZOOM_MOBILE = 1.03;

export type SolutionMapPoint = {
  id: number;
  x: number;
  y: number;
  label: string;
};

export const SOLUTION_MAP_POINTS = [
  { id: 1, x: 85, y: 327, label: "Marine and coastal systems" },
  { id: 2, x: 226, y: 126, label: "Industrial facilities" },
  { id: 3, x: 257, y: 42, label: "Infrastructure systems" },
  { id: 4, x: 421, y: 69, label: "Energy and process plants" },
  { id: 5, x: 474, y: 236, label: "Fluid transfer networks" },
  { id: 6, x: 539, y: 320, label: "Urban water systems" },
  { id: 7, x: 607, y: 133, label: "Mountain installations" },
] as const;

type SolutionsProps = {
  variant?: "home" | "catalog";
  assetBase?: string;
  children?: ReactNode;
  mobileHome?: boolean;
  mapPoints?: readonly SolutionMapPoint[];
  mapImage?: string;
  waveMarkers?: boolean;
};

type SolutionButtonsProps = {
  points: readonly SolutionMapPoint[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  alwaysVisible?: boolean;
};

function SolutionButtons({
  points,
  selectedId,
  onSelect,
  alwaysVisible = false,
}: SolutionButtonsProps) {
  return (
    <div
      data-wave-group
      className={`solutions-hotspots pointer-events-none absolute inset-0 z-[25] ${
        alwaysVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Solution areas"
    >
      {points.map((point) => (
        <WaveButton
          key={point.id}
          label={`Open ${point.label} details`}
          aria-pressed={selectedId === point.id}
          onClick={() => onSelect(point.id)}
          size="var(--solution-marker-size)"
          className="pointer-events-auto cursor-pointer absolute -translate-x-1/2 -translate-y-1/2 [--solution-marker-size:116px] sm:[--solution-marker-size:128px] md:[--solution-marker-size:144px] lg:[--solution-marker-size:172px] xl:[--solution-marker-size:200px] 2xl:[--solution-marker-size:224px]"
          style={{
            position: "absolute",
            left: `${(point.x / 699) * 100}%`,
            top: `${(point.y / 418) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

function SolutionsScene({
  variant = "home",
  assetBase = "/home/solution",
  children,
  mobileHome = false,
  mapPoints = SOLUTION_MAP_POINTS,
  mapImage,
}: SolutionsProps = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const catalogPanRef = useRef<HTMLDivElement>(null);
  const cameraTweenRef = useRef<gsap.core.Tween | null>(null);
  const previousSelectedRef = useRef<number | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

  useEffect(() => {
    if (selectedHotspot === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedHotspot(null);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedHotspot]);

  // Picture and WaveButtons move together.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const artwork = artworkRef.current;

    if (!section || !artwork) return;

    const updateCamera = (animate: boolean) => {
      const viewWidth = section.clientWidth;
      const viewHeight = section.clientHeight;

      if (!viewWidth || !viewHeight) return;

      const artworkWidth =
        Math.max(viewWidth, viewHeight * ARTWORK_ASPECT) *
          (variant === "home" ? ARTWORK_OVERSCAN : 1) +
        ARTWORK_EXTRA_PX;

      const artworkHeight = artworkWidth / ARTWORK_ASPECT;

      artwork.style.width = `${artworkWidth}px`;

      const point = mapPoints.find((item) => item.id === selectedHotspot);

      const isMobile = viewWidth < (mobileHome ? 1024 : 768);

      const scale = point
        ? isMobile
          ? CAMERA_ZOOM_MOBILE
          : CAMERA_ZOOM_DESKTOP
        : 1;

      const panelOnLeft = !!point && point.x / 699 > 0.56 && !isMobile;

      const focusX = isMobile ? 0.5 : panelOnLeft ? 0.7 : 0.3;

      const focusY = isMobile ? 0.51 : 0.49;

      const desiredX = point
        ? viewWidth * (focusX - 0.5) -
          (point.x / 699 - 0.5) * artworkWidth * scale
        : 0;

      const desiredY = point
        ? viewHeight * (focusY - 0.5) -
          (point.y / 418 - 0.5) * artworkHeight * scale
        : 0;

      const limit = (offset: number, size: number, viewport: number) => {
        const max = Math.max(0, (size - viewport) / 2);
        return gsap.utils.clamp(-max, max, offset);
      };

      cameraTweenRef.current?.kill();

      if (variant === "catalog" && isMobile) {
        gsap.set(artwork, {
          x: 0,
          y: 0,
          scale: 1,
        });

        const pan = catalogPanRef.current;

        if (pan) {
          if (point) {
            pan.scrollTo({
              left: (point.x / 699) * artworkWidth - viewWidth / 2,
              behavior: animate ? "smooth" : "auto",
            });
          } else if (!pan.dataset.positioned) {
            pan.scrollLeft = (artworkWidth - viewWidth) / 2;

            pan.dataset.positioned = "true";
          }
        }
      } else {
        if (catalogPanRef.current) {
          catalogPanRef.current.scrollLeft = 0;
          delete catalogPanRef.current.dataset.positioned;
        }

        const motion = {
          x: Number(gsap.getProperty(artwork, "x")) || 0,
          y: Number(gsap.getProperty(artwork, "y")) || 0,
          scale: Number(gsap.getProperty(artwork, "scale")) || 1,
        };

        const applyCamera = () => {
          gsap.set(artwork, {
            x: limit(motion.x, artworkWidth * motion.scale, viewWidth),
            y: limit(motion.y, artworkHeight * motion.scale, viewHeight),
            scale: motion.scale,
            transformOrigin: "center center",
          });
        };

        cameraTweenRef.current = gsap.to(motion, {
          x: limit(desiredX, artworkWidth * scale, viewWidth),
          y: limit(desiredY, artworkHeight * scale, viewHeight),
          scale,
          duration: animate ? 1.12 : 0,
          ease: "sine.inOut",
          onUpdate: applyCamera,
          onComplete: applyCamera,
        });
      }

      const panel = panelRef.current;

      if (point && panel) {
        const panelZoom =
          variant === "catalog"
            ? Math.min(
                1,
                (viewHeight - 32) / panel.offsetHeight,
                (viewWidth - 32) / panel.offsetWidth,
              )
            : 1;

        panel.style.zoom = String(panelZoom);

        const panelWidth = panel.offsetWidth * panelZoom;

        const panelHeight = panel.offsetHeight * panelZoom;

        const x = viewWidth * focusX;
        const y = viewHeight * focusY;

        const left = isMobile
          ? (viewWidth - panelWidth) / 2
          : panelOnLeft
            ? x - panelWidth - 28
            : x + 28;

        const top = y - panelHeight * (isMobile ? 0.55 : 0.48);

        const panelTarget = {
          left:
            gsap.utils.clamp(
              12,
              Math.max(12, viewWidth - panelWidth - 12),
              left,
            ) / panelZoom,

          top:
            gsap.utils.clamp(
              12,
              Math.max(12, viewHeight - panelHeight - 12),
              top,
            ) / panelZoom,
        };

        if (previousSelectedRef.current === null || !animate) {
          gsap.set(panel, panelTarget);
        } else {
          gsap.to(panel, {
            ...panelTarget,
            duration: 1.05,
            ease: "sine.inOut",
            overwrite: "auto",
          });
        }
      }

      previousSelectedRef.current = selectedHotspot;
    };

    updateCamera(true);

    const onResize = () => updateCamera(false);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cameraTweenRef.current?.kill();
    };
  }, [selectedHotspot, variant, mobileHome, mapPoints]);

  // CSS sticky controls the hold.
  // GSAP animates the scroll-driven visuals.
  useLayoutEffect(() => {
    if (variant === "catalog") return;

    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    const content = contentRef.current;
    const blur = blurRef.current;
    const gradient = gradientRef.current;
    const fog = fogRef.current;

    if (
      !section ||
      !scrollContainer ||
      !content ||
      !blur ||
      !gradient ||
      !fog
    ) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "sine.inOut",
        },

        scrollTrigger: {
          trigger: scrollContainer,
          start: "top top",
          end: "bottom bottom",

          scrub: reduceMotion.matches ? true : 0.65,

          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        content,
        {
          y: () => -window.innerHeight * 0.27,
          opacity: 0,
          pointerEvents: "none",
          duration: REVEAL_SCROLL_SCREENS,
        },
        0,
      );

      timeline.to(
        blur,
        {
          opacity: 0,
          duration: REVEAL_SCROLL_SCREENS,
        },
        0,
      );

      timeline.to(
        gradient,
        {
          opacity: 0,
          duration: REVEAL_SCROLL_SCREENS,
        },
        0,
      );

      const buttons = section.querySelector<HTMLElement>(".solutions-hotspots");

      if (buttons) {
        timeline.fromTo(
          buttons,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: REVEAL_SCROLL_SCREENS * 0.6,
          },
          REVEAL_SCROLL_SCREENS * 0.4,
        );
      }

      timeline.fromTo(
        fog,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: REVEAL_SCROLL_SCREENS + MAP_HOLD_SCROLL_SCREENS,
          ease: "sine.inOut",
        },
        0,
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [variant]);

  const panelAnimation = (
    <style jsx>{`
      .solution-detail-panel {
        animation: solution-panel-in 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes solution-panel-in {
        from {
          opacity: 0;
          filter: blur(4px);
          transform: translate3d(0, 12px, 0) scale(0.985);
        }

        to {
          opacity: 1;
          filter: blur(0);
          transform: translate3d(0, 0, 0) scale(1);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .solution-detail-panel {
          animation: none;
        }
      }
    `}</style>
  );

  const detailPanel =
    selectedHotspot !== null ? (
      <div
        className="pointer-events-none absolute inset-0 z-[60]"
        aria-live="polite"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Wastewater Management"
          className="solution-detail-panel pointer-events-auto absolute left-[52%] top-[10%] flex w-[min(490px,calc(100vw-32px))] flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_30px_90px_rgba(13,40,77,0.19)] max-md:rounded-[22px]"
        >
          <div
            className="relative flex h-[143px] shrink-0 items-center gap-[28px] overflow-hidden px-[37px] max-md:h-[115px] max-md:gap-5 max-md:px-6"
            style={{
              background:
                "radial-gradient(ellipse at 24% -30%,rgba(255,255,255,0.84),transparent 63%),linear-gradient(115deg,rgba(184,204,227,0.84) 0%,rgba(204,221,239,0.66) 47%,rgba(162,197,231,0.73) 100%)",
              backdropFilter: "blur(34px) saturate(170%)",
              WebkitBackdropFilter: "blur(34px) saturate(170%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.86),inset 0 -1px 0 rgba(255,255,255,0.27)",
            }}
          >
            <div className="relative h-[67px] w-[67px] shrink-0 max-md:h-[56px] max-md:w-[56px]">
              <Image
                src={`${assetBase}/atik-su.gif`}
                alt="Wastewater Management icon"
                fill
                unoptimized
                className="object-contain"
                sizes="67px"
              />
            </div>

            <h2
              className="relative m-0 max-w-[290px] text-[34px] leading-[1.03] tracking-[-0.025em] text-white max-md:text-[27px]"
              style={{
                fontFamily:
                  "var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 290,
                fontVariationSettings: '"wght" 290',
                fontSynthesis: "none",
              }}
            >
              Wastewater
              <br />
              Management
            </h2>

            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              aria-label="Kartı kapat"
              className="absolute right-[25px] top-[25px] z-10 flex h-8 w-8 cursor-pointer items-center justify-center text-black transition-transform duration-200 hover:scale-110 max-md:right-4 max-md:top-4"
            >
              <svg
                viewBox="0 0 32 32"
                width="30"
                height="30"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5 27 27M27 5 5 27"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="grid h-[334px] grid-cols-2 max-md:h-[280px]">
            {[
              {
                src: `${assetBase}/02.webp`,
                label: "DPT",
                alt: "DPT pump",
              },
              {
                src: `${assetBase}/03.png`,
                label: "DPT-DI",
                alt: "Blue centrifugal pump",
              },
            ].map((product) => (
              <div
                key={product.label}
                className="group relative min-w-0 overflow-hidden border-r border-[#e8eff5] bg-white last:border-r-0"
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  sizes="(max-width:768px) 50vw,245px"
                  className="object-contain p-[14px] transition-transform duration-500 group-hover:scale-[1.04]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[43%] translate-y-4 items-center justify-center bg-[linear-gradient(180deg,rgba(217,230,241,0.46),rgba(107,128,148,0.52))] opacity-0 backdrop-blur-[22px] backdrop-saturate-150 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span
                    className="text-[42px] font-normal tracking-[-0.04em] text-white drop-shadow-[0_2px_12px_rgba(31,45,67,0.2)]"
                    style={{
                      fontFamily: "var(--font-sf-pro), Arial, sans-serif",
                    }}
                  >
                    {product.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : null;

  if (variant === "catalog") {
    return (
      <div
        ref={(element) => {
          sectionRef.current = element;
        }}
        data-solutions-catalog
        className="relative isolate aspect-[1561.19/871.31] w-full overflow-hidden rounded-[30px] bg-[#e0eff9] max-md:aspect-auto max-md:h-[clamp(540px,150vw,720px)] max-sm:rounded-[20px]"
      >
        <div
          ref={catalogPanRef}
          data-map-pan
          className={`absolute inset-0 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            mobileHome
              ? ""
              : "md:pointer-events-none md:flex md:items-center md:justify-center md:overflow-hidden"
          }`}
        >
          <div
            ref={artworkRef}
            className="pointer-events-auto relative shrink-0 will-change-transform"
            style={{
              width: "100%",
              aspectRatio: "1561.19 / 871.31",
            }}
          >
            <Image
              src={mapImage ?? `${assetBase}/solutions.webp`}
              alt="Industrial pumping solutions"
              fill
              sizes="(min-width:1800px) 1520px, 92vw"
              className="object-fill"
            />

            <SolutionButtons
              points={mapPoints}
              selectedId={selectedHotspot}
              onSelect={setSelectedHotspot}
              alwaysVisible
            />
          </div>
        </div>

        {children}

        {mobileHome && (
          <div
            aria-label="Choose a solution area"
            className="absolute inset-x-0 bottom-0 z-40 flex gap-2 overflow-x-auto bg-white/80 p-3 backdrop-blur-md [scrollbar-width:none]"
          >
            {mapPoints.map((point) => (
              <button
                type="button"
                key={point.id}
                onClick={() => setSelectedHotspot(point.id)}
                aria-pressed={selectedHotspot === point.id}
                className="shrink-0 rounded-full border border-[#9eb7d080] bg-white px-3 py-2 text-xs text-[#0d5792]"
              >
                {point.label}
              </button>
            ))}
          </div>
        )}

        <span className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-2 text-[11px] text-[#0d5792] shadow-sm md:hidden">
          &larr; Swipe to explore &rarr;
        </span>

        {detailPanel}
        {panelAnimation}
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full bg-[#0E2D42]"
      style={{
        height: `${
          (1 + REVEAL_SCROLL_SCREENS + MAP_HOLD_SCROLL_SCREENS) * 100
        }svh`,
      }}
    >
      <section
        ref={sectionRef}
        id="solutions"
        className="sticky top-0 isolate h-[100svh] min-h-[650px] w-full overflow-hidden bg-[#0E2D42]"
      >
        <div className="pointer-events-none absolute inset-0 z-0 flex translate-y-[3.5svh] items-center justify-center">
          <div
            ref={artworkRef}
            className="pointer-events-auto relative shrink-0 will-change-transform"
            style={{
              width: "max(calc(100vw + 4px), calc(100svh * 1.7917 + 4px))",
              aspectRatio: "1561.19 / 871.31",
            }}
          >
            <Image
              src={mapImage ?? `${assetBase}/solutions.webp`}
              alt="Industrial pumping solutions"
              fill
              sizes="(min-width: 1440px) 109vw, 109vw"
              quality={90}
              className="object-fill"
            />

            <SolutionButtons
              points={mapPoints}
              selectedId={selectedHotspot}
              onSelect={setSelectedHotspot}
            />
          </div>
        </div>

        <div
          ref={gradientRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,45,66,0.38) 0%, rgba(14,45,66,0.17) 20%, rgba(14,45,66,0.05) 42%, rgba(14,45,66,0) 60%)",
          }}
        />

        <div
          ref={blurRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backdropFilter: `blur(${FIGMA_BLUR_PX}px)`,
            WebkitBackdropFilter: `blur(${FIGMA_BLUR_PX}px)`,
          }}
        />

        <div
          ref={contentRef}
          className="relative z-30 flex h-full w-full flex-col items-center justify-center px-6"
        >
          <h1
            className="m-0 text-center text-[#F7F7F7]"
            style={{
              width: "1056px",
              maxWidth: "100%",
              fontFamily: "var(--font-sf-pro)",
              fontSize: "clamp(36px, 3.472vw, 66.67px)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350, "wdth" 125, "opsz" 28',
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontSynthesis: "none",
            }}
          >
            High-Performance Pumping
            <br />
            Solutions for Global Industries
          </h1>

          <p
            className="m-0 mt-[20px] text-center text-[#F7F7F7]"
            style={{
              width: "969.33px",
              maxWidth: "100%",
              fontFamily: "var(--font-sf-pro)",
              fontSize: "clamp(14px, 1.042vw, 20px)",
              fontWeight: 220,
              fontVariationSettings: '"wght" 220, "wdth" 125, "opsz" 20',
              lineHeight: 1.07,
              letterSpacing: "-0.02em",
              fontSynthesis: "none",
            }}
          >
            Sempa Pompa delivers advanced engineering and innovative fluid
            transfer technologies tailored to the unique demands of diverse
            sectors.
          </p>

          <div
            className="relative mt-[32px] shrink-0"
            style={{
              width: "133.33px",
              height: "133.33px",
              borderRadius: "53.33px",
              border: "1.33px solid transparent",
              background:
                "linear-gradient(180deg, #005EFF 0%, #001EA2 100%) padding-box, linear-gradient(180deg, #9ABFFF 0%, #001EA2 100%) border-box",
              boxShadow: "inset 0 0 5.33px 0 #6DB7E0",
            }}
          >
            <span
              className="absolute block text-center text-[#F7F7F7]"
              style={{
                top: "26.67px",
                left: "23.11px",
                width: "83.56px",
                height: "58.67px",
                fontFamily: "var(--font-sf-pro)",
                fontSize: "13.33px",
                fontWeight: 380,
                fontVariationSettings: '"wght" 380, "wdth" 125, "opsz" 13',
                lineHeight: 1.07,
                letterSpacing: "-0.05em",
                fontSynthesis: "none",
              }}
            >
              EXPLORE OUR SOLUTION AREAS
            </span>

            <HomeMediaVideo
              src="/home/solution/scroll-down.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="pointer-events-none absolute mix-blend-screen"
              style={{
                top: "85.33px",
                left: "47.11px",
                width: "39.11px",
                height: "39.11px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div
          ref={fogRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
          style={{
            height: "clamp(90px, 18svh, 190px)",
            opacity: 0,
            background:
              "linear-gradient(to bottom, rgba(224,239,249,0), rgba(224,239,249,0.2) 40%, rgba(224,239,249,0.65) 75%, #E0EFF9 100%)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            maskImage: "linear-gradient(to bottom, transparent, black 55%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 55%)",
          }}
        />

        {detailPanel}
        {panelAnimation}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40"
          style={{
            boxShadow: "inset 0 0 0 0.2px #FFFFFF",
          }}
        />
      </section>
    </div>
  );
}

export default function SolutionsSection(props: SolutionsProps = {}) {
  const compact = useHomeCompact();

  if (compact && (!props.variant || props.variant === "home")) {
    return (
      <section
        id="solutions"
        data-home-mobile-solutions
        className="relative bg-linear-to-b from-[#123849] to-[#e0eff9] px-4 pb-10 pt-14 text-white"
      >
        <div className="mx-auto max-w-[760px]">
          <h2
            className="mx-auto max-w-xl text-center text-[clamp(28px,6.8vw,44px)] leading-[1.04] tracking-[-.04em]"
            style={{
              fontVariationSettings: '"wght" 350,"wdth" 125',
            }}
          >
            High-Performance Pumping Solutions for Global Industries
          </h2>

          <p className="mx-auto mb-8 mt-5 max-w-xl text-center text-base leading-[1.2] text-[#e0eff9]">
            Sempa Pompa delivers advanced engineering and innovative fluid
            transfer technologies tailored to the unique demands of diverse
            sectors.
          </p>

          <div className="[&_[data-solutions-catalog]]:h-[520px]! [&_[data-solutions-catalog]]:min-h-0 [&_[data-solutions-catalog]]:shadow-[0_18px_50px_#0d579225] md:[&_[data-solutions-catalog]]:h-[620px]!">
            <SolutionsScene {...props} variant="catalog" mobileHome />
          </div>
        </div>
      </section>
    );
  }

  return <SolutionsScene {...props} />;
}
