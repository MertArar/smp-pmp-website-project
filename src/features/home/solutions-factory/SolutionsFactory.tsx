"use client";

import { useHomeCompact, MobileFactory } from "../HomeMobileSections";

import HomeMediaVideo from "@/features/home/HomeMediaVideo";

import Link from "next/link";

import { useEffect, useRef, type CSSProperties } from "react";

import { FiArrowUpRight } from "react-icons/fi";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* =========================================================*

*   SCROLL CONFIGURATION*

*========================================================= */

const SCROLL_CONFIG = {
  scrollHeight: "210svh",

  smoothing: 0.12,

  precision: 0.0001,
};

/**

*  Her kartın başlangıç ve bitiş koordinatları.*

*  x: soldan yüzde*

*  bottom: alttan yüzde*

*  1. Kart: sola çıkar, yüksekliği korunur.*

*  2. Kart: 1. kartın yerine gelir.*

*  3. Kart: 2. kartın yerine gelir.*

**/

const CARD_POSITIONS = {
  first: {
    from: { x: 15, bottom: 12 },

    to: { x: -19.1, bottom: 12 },
  },

  second: {
    from: { x: 49.1, bottom: 25 },

    to: { x: 15, bottom: 12 },
  },

  third: {
    from: { x: 83.26, bottom: 12 },

    to: { x: 49.1, bottom: 25 },
  },
};

/* =========================================================*

*   FONT*

*========================================================= */

const sfExpanded: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",

  fontVariationSettings: '"wght" 410, "wdth" 125',

  fontWeight: 410,

  fontOpticalSizing: "auto",
};

/* =========================================================*

*   BACKGROUND MASK*

*========================================================= */

const factoryMask = `

  linear-gradient(

    to bottom,

    transparent 0%,

    black 18%,

    black 78%,

    transparent 100%

  ),

  linear-gradient(

    to right,

    transparent 0%,

    black 12%,

    black 88%,

    transparent 100%

  )

`;

/* =========================================================*

*   HELPERS*

*========================================================= */

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function smoothstep(progress: number) {
  const p = clamp(progress);

  return p * p * (3 - 2 * p);
}

/* =========================================================*

*   CARD COMPONENT*

*========================================================= */

type FactoryStatCardProps = {
  icon: string;

  value: string;

  suffix?: string;

  label: string[];

  description?: string;

  buttonText?: string;

  href?: string;
};

function FactoryStatCard({
  icon,

  value,

  suffix,

  label,

  description,

  buttonText,

  href,
}: FactoryStatCardProps) {
  return (
    <div className="relative h-[194px] w-[433px] overflow-visible rounded-[30px]">
      {/* GLASS PANEL */}

      <div
        className="pointer-events-none absolute inset-0 rounded-[30px]"
        style={{
          background: "rgba(255,255,255,0.10)",

          backdropFilter: "blur(25px)",

          WebkitBackdropFilter: "blur(25px)",
        }}
      />

      {/* BLUE PANEL */}

      <div
        className="absolute left-0 top-0 z-10 h-[194px] w-[168px] rounded-[30px]"
        style={{
          background: "linear-gradient(315deg,#005EFF 0%,#001EA2 100%)",

          boxShadow: "0 0 60px #004AE2",
        }}
      >
        {/* ICON */}

        <HomeMediaVideo
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none absolute left-[24px] top-[24px] h-[36.03px] w-[36.03px] rounded-[7.21px] object-contain"
          style={{ mixBlendMode: "screen" }}
        >
          <source src={icon} type="video/webm" />
        </HomeMediaVideo>

        {/* NUMBER */}

        <div
          className="absolute left-[24px] top-[91px] flex h-[45px] w-[127px] items-baseline whitespace-nowrap text-white"
          style={{
            ...sfExpanded,

            letterSpacing: "0",

            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: "45.04px",

              lineHeight: 1,
            }}
          >
            {value}
          </span>

          {suffix && (
            <span
              style={{
                fontSize: "27.02px",

                lineHeight: 1,
              }}
            >
              {suffix}
            </span>
          )}
        </div>

        {/* LABEL */}

        <p
          className="absolute left-[24px] top-[137px] m-0 text-[#F7F7F7]"
          style={{
            ...sfExpanded,

            fontSize: "13.51px",

            lineHeight: 1,

            letterSpacing: "-0.09em",
          }}
        >
          {label.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      {/* RIGHT CONTENT */}

      <div className="absolute bottom-0 left-[168px] right-0 top-0 z-20">
        {description && (
          <p
            className="pointer-events-none absolute left-[24px] top-[50px] m-0 w-[226px] text-[#27272A]"
            style={{
              ...sfExpanded,

              fontSize: "15px",

              lineHeight: 1,

              letterSpacing: "-0.09em",
            }}
          >
            {description}
          </p>
        )}

        {buttonText && href && (
          <Link
            href={href}
            className="group absolute left-[24px] top-[113px] flex h-[43px] w-[179px] items-center overflow-hidden rounded-[19px] bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] shadow-[0_4px_12px_rgba(0,74,226,0.25)]"
          >
            {/* HOVER BACKGROUND */}

            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100"
            />

            {/* BUTTON TEXT */}

            <span
              className="absolute left-[18px] top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap text-[#F7F7F7] transition-[transform,color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[29px] group-hover:text-[#27272A]"
              style={{
                ...sfExpanded,

                fontSize: "15px",

                lineHeight: "1.07",

                letterSpacing: "-0.04em",
              }}
            >
              {buttonText}
            </span>

            {/* MOVING CIRCLE */}

            <span
              aria-hidden="true"
              className="absolute left-[141px] top-1/2 z-[3] flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[6px]"
            >
              <FiArrowUpRight
                size={20}
                strokeWidth={3.2}
                className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover:scale-100 group-hover:opacity-100"
              />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

/* =========================================================*

*   MAIN SECTION*

*========================================================= */

function DesktopSectionsFactory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const headingVisible = useInView(sectionRef, { once: true, amount: 0.08 });

  const coordinateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coordinate = coordinateRef.current;

    if (!coordinate) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        coordinate.style.setProperty(
          "--factory-coordinate-mask",
          "url('/home/solution-factory/koordinat.webp')",
        );

        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(coordinate);

    return () => observer.disconnect();
  }, []);

  const firstCardRef = useRef<HTMLDivElement | null>(null);

  const secondCardRef = useRef<HTMLDivElement | null>(null);

  const thirdCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    const firstCard = firstCardRef.current;

    const secondCard = secondCardRef.current;

    const thirdCard = thirdCardRef.current;

    if (!section || !firstCard || !secondCard || !thirdCard) {
      return;
    }

    let frameId: number | null = null;

    let currentProgress = 0;

    let targetProgress = 0;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let prefersReducedMotion = reducedMotionQuery.matches;

    /* -----------------------------------------------------*

*       CARD TRANSFORM*

*    ----------------------------------------------------- */

    const applyCardPosition = (
      element: HTMLDivElement,

      from: { x: number; bottom: number },

      to: { x: number; bottom: number },

      progress: number,
    ) => {
      const x = lerp(from.x, to.x, progress);

      const bottom = lerp(from.bottom, to.bottom, progress);

      element.style.left = `${x}%`;

      element.style.bottom = `${bottom}%`;
    };

    const applyProgress = (progress: number) => {
      applyCardPosition(
        firstCard,

        CARD_POSITIONS.first.from,

        CARD_POSITIONS.first.to,

        progress,
      );

      applyCardPosition(
        secondCard,

        CARD_POSITIONS.second.from,

        CARD_POSITIONS.second.to,

        progress,
      );

      applyCardPosition(
        thirdCard,

        CARD_POSITIONS.third.from,

        CARD_POSITIONS.third.to,

        progress,
      );
    };

    /* -----------------------------------------------------*

*       SCROLL PROGRESS*

*    ----------------------------------------------------- */

    const calculateProgress = () => {
      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      const scrollDistance = Math.max(rect.height - viewportHeight, 1);

      const travelled = -rect.top;

      const rawProgress = clamp(travelled / scrollDistance);

      targetProgress = prefersReducedMotion
        ? rawProgress
        : smoothstep(rawProgress);
    };

    /* -----------------------------------------------------*

*       ANIMATION LOOP*

*    ----------------------------------------------------- */

    const animate = () => {
      frameId = null;

      if (prefersReducedMotion) {
        currentProgress = targetProgress;
      } else {
        currentProgress = lerp(
          currentProgress,

          targetProgress,

          SCROLL_CONFIG.smoothing,
        );
      }

      if (
        Math.abs(targetProgress - currentProgress) < SCROLL_CONFIG.precision
      ) {
        currentProgress = targetProgress;
      }

      applyProgress(currentProgress);

      if (
        Math.abs(targetProgress - currentProgress) >= SCROLL_CONFIG.precision
      ) {
        frameId = requestAnimationFrame(animate);
      }
    };

    /* -----------------------------------------------------*

*       REQUEST RENDER*

*    ----------------------------------------------------- */

    const requestRender = () => {
      calculateProgress();

      if (frameId === null) {
        frameId = requestAnimationFrame(animate);
      }
    };

    /* -----------------------------------------------------*

*       REDUCED MOTION*

*    ----------------------------------------------------- */

    const handleMotionPreference = () => {
      prefersReducedMotion = reducedMotionQuery.matches;

      requestRender();
    };

    /* -----------------------------------------------------*

*       INITIAL STATE*

*    ----------------------------------------------------- */

    calculateProgress();

    currentProgress = targetProgress;

    applyProgress(currentProgress);

    /* -----------------------------------------------------*

*       EVENTS*

*    ----------------------------------------------------- */

    window.addEventListener("scroll", requestRender, { passive: true });

    window.addEventListener("resize", requestRender);

    reducedMotionQuery.addEventListener("change", handleMotionPreference);

    /* -----------------------------------------------------*

*       CLEANUP*

*    ----------------------------------------------------- */

    return () => {
      window.removeEventListener("scroll", requestRender);

      window.removeEventListener("resize", requestRender);

      reducedMotionQuery.removeEventListener("change", handleMotionPreference);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="factory"
      className="relative w-full bg-[#E0EFF9] font-sans"
      style={{
        height: SCROLL_CONFIG.scrollHeight,
      }}
    >
      {/* ===================================================*

*          STICKY VIEWPORT*

*      =================================================== */}

      <div
        className="

          sticky

          top-0

          isolate

          h-[100svh]

          min-h-[720px]

          w-full

          overflow-hidden

          bg-[#E0EFF9]

        "
      >
        {/* BACKGROUND VIDEO */}

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <HomeMediaVideo
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute left-1/2 top-[-4%] h-auto w-[88%] max-w-none -translate-x-1/2"
            style={{
              aspectRatio: "1172 / 784",

              WebkitMaskImage: factoryMask,

              maskImage: factoryMask,

              WebkitMaskComposite: "source-in",

              maskComposite: "intersect",
            }}
          >
            <source
              src="/home/solution-factory/factory.webm"
              type="video/webm"
            />
          </HomeMediaVideo>
        </div>

        {/* CONTENT LAYER */}

        <div className="relative z-10 h-full w-full">
          {/* COORDINATE GIF */}

          <div
            ref={coordinateRef}
            role="img"
            aria-label="Koordinat animasyonu"
            className="pointer-events-none absolute left-1/2 top-[4.1%] h-[90px] w-[122px] -translate-x-1/2"
            style={
              {
                background: `

                  linear-gradient(

                    90deg,

                    #003EAF 0%,

                    #0054D6 28%,

                    #65B9F1 68%,

                    #0062C9 75%,

                    #003EAF 100%

                  )

                `,

                WebkitMaskImage:
                  "var(--factory-coordinate-mask, linear-gradient(transparent, transparent))",

                maskImage:
                  "var(--factory-coordinate-mask, linear-gradient(transparent, transparent))",

                WebkitMaskSize: "contain",

                maskSize: "contain",

                WebkitMaskPosition: "center",

                maskPosition: "center",

                WebkitMaskRepeat: "no-repeat",

                maskRepeat: "no-repeat",

                WebkitMaskMode: "alpha",

                maskMode: "alpha",
              } as CSSProperties & { WebkitMaskMode: "alpha" }
            }
          />

          {/* MAIN HEADING */}

          <div className="pointer-events-none absolute left-1/2 top-[14.9%] w-[792px] max-w-[calc(100%-48px)] -translate-x-1/2">
            <motion.h1
              className="m-0 bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] bg-clip-text text-center text-[50px] leading-[1] tracking-[-0.04em] text-transparent"
              style={{
                ...sfExpanded,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={reducedMotion ? false : "hidden"}
              animate={headingVisible ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: { delayChildren: 0.12, staggerChildren: 0.15 },
                },
              }}
            >
              {[
                "High-Performance Pumping",
                "Solutions for Global Industries",
              ].map((line) => (
                <span
                  key={line}
                  className="block overflow-hidden whitespace-nowrap"
                >
                  <motion.span
                    className="block"
                    variants={{
                      hidden: {
                        opacity: reducedMotion ? 1 : 0,
                        y: reducedMotion ? "0%" : "110%",
                        filter: reducedMotion ? "blur(0px)" : "blur(10px)",
                      },
                      visible: {
                        opacity: 1,
                        y: "0%",
                        filter: "blur(0px)",
                        transition: {
                          duration: reducedMotion ? 0 : 1.05,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </div>

          {/* DESCRIPTION */}

          <div className="pointer-events-none absolute left-1/2 top-[calc(14.9%+115px)] w-[727px] max-w-[calc(100%-48px)] -translate-x-1/2">
            <motion.p
              className="m-0 text-center text-[15px] leading-[1.07] tracking-[-0.02em] text-[#27272A]"
              style={{
                fontFamily: "var(--font-sf-pro), sans-serif",

                fontWeight: 270,

                fontVariationSettings: '"wght" 270, "wdth" 115',
              }}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 22, filter: "blur(7px)" }
              }
              animate={
                headingVisible
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : undefined
              }
              transition={{
                duration: reducedMotion ? 0 : 0.85,
                delay: reducedMotion ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Sempa Pompa delivers advanced engineering and innovative fluid
              transfer technologies tailored to the unique demands of diverse
              sectors.
            </motion.p>
          </div>

          {/* =================================================*

*              ANIMATED CARD 01*

*              Başlangıç: left 15%, bottom 12%*

*              Bitiş: left -19.1%, bottom 12%*

*          ================================================= */}

          <div
            ref={firstCardRef}
            className="

              absolute

              left-[15%]

              bottom-[12%]

              will-change-[left,bottom]

            "
          >
            <FactoryStatCard
              icon="/home/solution-factory/icon01.webm"
              value="330"
              suffix="+"
              label={["Employee", "Recruitment"]}
              description="A strong workforce driving our manufacturing excellence."
              buttonText="Join Our Team"
              href="/career"
            />
          </div>

          {/* =================================================*

*              ANIMATED CARD 02*

*              Başlangıç: left 49.1%, bottom 25%*

*              Bitiş: left 15%, bottom 12%*

*          ================================================= */}

          <div
            ref={secondCardRef}
            className="

              absolute

              left-[49.1%]

              bottom-[25%]

              will-change-[left,bottom]

            "
          >
            <FactoryStatCard
              icon="/home/solution-factory/icon02.webm"
              value="132K"
              label={["Production", "Facility"]}
              description="Advanced engineering powered by a massive scale of manufacturing."
              buttonText="Factory Tour"
              href="/production"
            />
          </div>

          {/* =================================================*

*              ANIMATED CARD 03*

*              Başlangıç: left 83.26%, bottom 12%*

*              Bitiş: left 49.1%, bottom 25%*

*          ================================================= */}

          <div
            ref={thirdCardRef}
            className="

              absolute

              left-[83.26%]

              bottom-[12%]

              will-change-[left,bottom]

            "
          >
            <FactoryStatCard
              icon="/home/solution-factory/icon03.webm"
              value="100"
              suffix="+"
              label={["Export", "Country"]}
              description="Bringing Sempa reliability to more than 100 countries globally."
              buttonText="Export"
              href="/global"
            />
          </div>

          {/* SCROLL DOWN GROUP */}

          <div className="pointer-events-none absolute bottom-[1.8%] left-1/2 flex -translate-x-1/2 flex-col items-center">
            {/* SCROLL TEXT */}

            <p
              className="m-0 h-[13px] w-[174px] text-center text-[#9EB7D0]"
              style={{
                ...sfExpanded,

                fontSize: "12px",

                lineHeight: "1.07",

                letterSpacing: "-0.04em",
              }}
            >
              Scroll Down to Learn more
            </p>

            {/* SCROLL VIDEO — BLUE BOX, NO BORDER */}

            <div
              className="relative mt-[11px] h-[51px] w-[51px] overflow-hidden rounded-[8.79px] border-0 bg-[#9EB7D0] p-0 shadow-none outline-none"
              style={{
                border: "none",

                boxShadow: "none",

                outline: "none",
              }}
            >
              <HomeMediaVideo
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                className="block h-full w-full border-0 object-contain outline-none"
                style={{
                  mixBlendMode: "screen",

                  border: "none",

                  outline: "none",

                  boxShadow: "none",
                }}
              >
                <source src="/home/solution/scroll-down.mp4" type="video/mp4" />
              </HomeMediaVideo>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SectionsFactory() {
  const compact = useHomeCompact();

  return compact ? <MobileFactory /> : <DesktopSectionsFactory />;
}
