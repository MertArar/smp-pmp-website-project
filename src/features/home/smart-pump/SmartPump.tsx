"use client";

import { useHomeCompact, MobileSmartPump } from "../HomeMobileSections";

import HomeMediaVideo from "@/features/home/HomeMediaVideo";

import Image from "next/image";

import {
  useLayoutEffect,
  useRef,
  type RefObject,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";
import { motion, useReducedMotion, type Variants } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// AboutUsPage-style reveals. GSAP keeps exclusive control of the moving cards.
const revealVariants: Variants = {
  hidden: ({
    direction = "up",
    reduced = false,
  }: {
    direction?: "up" | "left" | "right";
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
  direction: "up" | "left" | "right" = "up",
  delay = 0,
  reduced = false,
) {
  return {
    variants: revealVariants,
    custom: { direction, reduced },
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: false, amount: 0.38, margin: "0px 0px -14% 0px" },
    transition: {
      duration: reduced ? 0 : 0.95,
      delay: reduced ? 0 : delay,
      ease: [0.25, 0.85, 0.3, 1] as [number, number, number, number],
    },
  };
}

/* Design reference: Figma 1440px -> desktop 1920px */

const DESIGN = {
  figmaWidth: 1440,

  targetWidth: 1920,

  scale: 1920 / 1440,
};

const px = (value: number) => value * DESIGN.scale;

const SECTION = {
  background: "#E0EFF9",

  newsBackground:
    "linear-gradient(90deg, #D5EAF7 0%, #D1E8F6 48%, #C6E0F7 68%, #AFCDF9 90%, #BBD7FC 100%)",

  overlapTop: 185,

  minHeight: 1800,
};

const CLOUD = {
  width: 3120,

  height: 2565,

  left: -420,

  top: -710,

  opacity: 0.78,
};

const HEADING = {
  left: px(120),

  top: 320,

  width: px(539),

  height: px(100),

  fontSize: px(50),
};

const DESCRIPTION = {
  left: px(119),

  top: HEADING.top + px(152),

  width: px(601),

  height: px(60),

  fontSize: px(15),

  color: "#9EB7D0",

  fontWeight: 300,
};

const SECONDARY_HEADING = {
  left: px(120),

  top: HEADING.top + px(300),

  width: px(224),

  height: px(75),

  fontSize: px(25),

  color: "#0D5792",
};

const ROBOT_HAND = {
  top: 92,

  right: 34,

  width: 920,

  height: 920,
};

const ROBOT_BLUR = {
  sharpUntil: 61,

  blurFullAt: 72,

  strongBlurAt: 80,

  softBlur: 20,

  strongBlur: 48,
};

const PUMP_BUTTON = {
  left: px(820),

  top: HEADING.top + px(6045 - 5676),

  width: px(192),

  height: px(43),

  radius: px(19),

  borderWidth: px(0.5),

  borderColor: "#9EB7D0",

  background: "rgba(255, 255, 255, 0.20)",

  circleSize: px(33),

  circleInset: px(5),

  fontSize: px(15),

  textMove: px(40),

  duration: 650,

  easing: "cubic-bezier(0.22, 1, 0.36, 1)",

  backdropBlur: px(8),
};

/* Curve video is 1920x1080 (16:9). Keep its native aspect ratio,*

*   reduce its on-screen span and apply the approved 10-degree rotation. */

const CURVE_LINE = {
  left: 135,

  top: HEADING.top + px(6033 - 5676) + px(60) - 32,

  width: 1480,

  height: 832.5, // 1480 * 1080 / 1920*

  rotation: 10,
};

/* The Figma cards are shown at their optical desktop size rather than*

*   being enlarged a second time. All four share one glass/hover treatment. */

const PROCESS_CARDS = [
  {
    label: "Input System Parameters",

    lines: ["Input", "System", "Parameters"],

    left: px(119),

    topOffset: px(0),
  },

  {
    label: "Smart Matching Connection",

    lines: ["Smart", "Matching", "Connection"],

    left: px(420),

    topOffset: px(70),
  },

  {
    label: "View Performance Curves",

    lines: ["View", "Performance", "Curves"],

    left: px(800),

    topOffset: px(38),
  },

  {
    label: "Export Technical Data",

    lines: ["Export", "Technical", "Data"],

    left: px(1100),

    topOffset: px(-108),
  },
] as const;

const PROCESS_CARD = {
  top: HEADING.top + px(6272 - 5676),

  width: 253.76,

  height: 235.82,

  radius: 48.18,

  borderWidth: 1.61,

  paddingLeft: 40.15,

  fontSize: 24.09,

  backdropBlur: 15,

  shadowX: 48.18,

  shadowY: 24.09,

  shadowBlur: 80.3,
};

const headingFont: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",

  fontWeight: 410,

  fontStretch: "125%",

  fontVariationSettings: '"wght" 410, "wdth" 125',

  fontOpticalSizing: "auto",

  fontSynthesis: "none",
};

const descriptionFont: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",

  fontWeight: DESCRIPTION.fontWeight,

  fontStretch: "125%",

  fontVariationSettings: `"wght" ${DESCRIPTION.fontWeight}, "wdth" 125`,

  fontOpticalSizing: "auto",

  fontSynthesis: "none",
};

function SmartPumpCloud() {
  const cloudMask: CSSProperties = {
    position: "absolute",

    left: CLOUD.left,

    top: CLOUD.top,

    width: CLOUD.width,

    height: CLOUD.height,

    WebkitMaskImage: "url('/home/smart-pump/cloud.png')",

    maskImage: "url('/home/smart-pump/cloud.png')",

    WebkitMaskRepeat: "no-repeat",

    maskRepeat: "no-repeat",

    WebkitMaskSize: "100% 100%",

    maskSize: "100% 100%",

    WebkitMaskPosition: "center",

    maskPosition: "center",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 3, overflow: "visible" }}
    >
      <div
        style={{
          ...cloudMask,

          opacity: CLOUD.opacity,

          background:
            "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.82) 52%, rgba(255,255,255,0.72) 100%)",

          filter: "blur(1px)",
        }}
      />

      <div
        style={{
          ...cloudMask,

          left: CLOUD.left - 10,

          top: CLOUD.top - 12,

          opacity: 0.2,

          background: "rgba(255,255,255,0.85)",

          filter: "blur(26px)",
        }}
      />
    </div>
  );
}

function SmartPumpRobotHand({ reducedMotion }: { reducedMotion: boolean }) {
  const sharpMask = `linear-gradient(90deg, black 0%, black ${ROBOT_BLUR.sharpUntil}%, transparent ${ROBOT_BLUR.blurFullAt}%, transparent 100%)`;

  const softBlurMask = `linear-gradient(90deg, transparent 0%, transparent ${ROBOT_BLUR.sharpUntil}%, black ${ROBOT_BLUR.blurFullAt}%, black 100%)`;

  const strongBlurMask = `linear-gradient(90deg, transparent 0%, transparent ${ROBOT_BLUR.strongBlurAt}%, rgba(0,0,0,0.35) ${ROBOT_BLUR.strongBlurAt + 5}%, black ${ROBOT_BLUR.strongBlurAt + 14}%, black 100%)`;

  const robotImage = (
    <Image
      src="/home/smart-pump/robot-el.webp"
      alt=""
      fill
      priority
      sizes={`${ROBOT_HAND.width}px`}
      className="object-contain"
    />
  );

  return (
    <motion.div
      {...reveal("right", 0.2, reducedMotion)}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        top: ROBOT_HAND.top,

        right: ROBOT_HAND.right,

        width: ROBOT_HAND.width,

        height: ROBOT_HAND.height,

        zIndex: 6,

        overflow: "visible",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: softBlurMask, maskImage: softBlurMask }}
      >
        <div
          className="relative h-full w-full"
          style={{ filter: `blur(${ROBOT_BLUR.softBlur}px)` }}
        >
          {robotImage}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: strongBlurMask, maskImage: strongBlurMask }}
      >
        <div
          className="relative h-full w-full"
          style={{ filter: `blur(${ROBOT_BLUR.strongBlur}px)` }}
        >
          {robotImage}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: sharpMask, maskImage: sharpMask }}
      >
        <div className="relative h-full w-full">{robotImage}</div>
      </div>
    </motion.div>
  );
}

function SmartPumpCurveLine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        // Keep the entire animation inside this section.*

        zIndex: 2,

        backgroundImage:
          "linear-gradient(180deg, #E0EFF9 0%, #E0EFF9 65%, rgba(224,239,249,0.98) 73%, rgba(224,239,249,0.74) 85%, rgba(224,239,249,0) 100%)",
      }}
    >
      <div
        className="absolute"
        style={{
          left: CURVE_LINE.left,

          top: CURVE_LINE.top,

          width: CURVE_LINE.width,

          height: CURVE_LINE.height,

          transform: `rotate(${CURVE_LINE.rotation}deg)`,

          transformOrigin: "center center",

          // Şeffaf videoda kalan koyu yarı saydam kenarları açık zeminde yok eder.*

          mixBlendMode: "screen",

          // Only soften the problematic beginning; keep the rest fully visible.*

          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 3%, #000 10%, #000 100%)",

          maskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 3%, #000 10%, #000 100%)",
        }}
      >
        <HomeMediaVideo
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block h-full w-full object-fill"
        >
          <source
            src="/home/smart-pump/curve-line-transparent.webm"
            type="video/webm"
          />
        </HomeMediaVideo>
      </div>
    </div>
  );
}

function SmartPumpHeading({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.h1
      {...reveal("left", 0, reducedMotion)}
      className="absolute z-10 m-0 bg-clip-text text-transparent"
      style={{
        ...headingFont,

        left: HEADING.left,

        top: HEADING.top,

        width: HEADING.width,

        height: HEADING.height,

        fontSize: HEADING.fontSize,

        lineHeight: 1,

        letterSpacing: "-0.04em",

        backgroundImage: "linear-gradient(180deg, #005EFF 0%, #001EA2 100%)",

        WebkitBackgroundClip: "text",

        WebkitTextFillColor: "transparent",
      }}
    >
      <span className="block whitespace-nowrap">Smart Pump</span>

      <span className="block whitespace-nowrap">Selection Assistant</span>
    </motion.h1>
  );
}

function SmartPumpDescription({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.p
      {...reveal("right", 0.16, reducedMotion)}
      className="absolute z-10 m-0"
      style={{
        ...descriptionFont,

        left: DESCRIPTION.left,

        top: DESCRIPTION.top,

        width: DESCRIPTION.width,

        minHeight: DESCRIPTION.height,

        fontSize: DESCRIPTION.fontSize,

        lineHeight: 1,

        letterSpacing: 0,

        color: DESCRIPTION.color,
      }}
    >
      Discover the most efficient pumping solution in seconds. Simply enter your
      technical parameters such as flow rate, pressure, and fluid type, and let
      our advanced configurator select the ideal Sempa pump for your specific
      industry needs.
    </motion.p>
  );
}

function SmartPumpSecondaryHeading({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <motion.h2
      {...reveal("left", 0.24, reducedMotion)}
      className="absolute z-10 m-0"
      style={{
        ...headingFont,

        left: SECONDARY_HEADING.left,

        top: SECONDARY_HEADING.top,

        width: SECONDARY_HEADING.width,

        minHeight: SECONDARY_HEADING.height,

        fontSize: SECONDARY_HEADING.fontSize,

        lineHeight: 1,

        letterSpacing: 0,

        color: SECONDARY_HEADING.color,
      }}
    >
      Find the Perfect Match for Your Project
    </motion.h2>
  );
}

function SmartPumpSelectionButton({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      {...reveal("right", 0.32, reducedMotion)}
      type="button"
      aria-label="Pump Selection"
      className="group pointer-events-auto absolute z-20 flex shrink-0 items-center overflow-hidden bg-[rgba(255,255,255,0.20)] text-left transition-[background-color] duration-[350ms] hover:bg-[#F7F7F7]"
      style={{
        left: PUMP_BUTTON.left,

        top: PUMP_BUTTON.top,

        width: PUMP_BUTTON.width,

        height: PUMP_BUTTON.height,

        borderRadius: PUMP_BUTTON.radius,

        border: `${PUMP_BUTTON.borderWidth}px solid ${PUMP_BUTTON.borderColor}`,

        backdropFilter: `blur(${PUMP_BUTTON.backdropBlur}px)`,

        WebkitBackdropFilter: `blur(${PUMP_BUTTON.backdropBlur}px)`,

        cursor: "pointer",
      }}
    >
      <span
        className="absolute top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap text-[#252525] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[var(--text-move)]"
        style={
          {
            left: px(14),

            "--text-move": `${PUMP_BUTTON.textMove}px`,

            fontSize: PUMP_BUTTON.fontSize,

            fontFamily: "var(--font-sf-pro), sans-serif",

            fontWeight: 410,

            fontVariationSettings: '"wght" 410, "wdth" 125',

            lineHeight: 1.07,

            letterSpacing: "-0.04em",
          } as CSSProperties
        }
      >
        Pump Selection
      </span>

      <span
        aria-hidden="true"
        className="absolute top-1/2 z-[3] flex -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] left-[var(--circle-start)] group-hover:left-[var(--circle-end)]"
        style={
          {
            width: PUMP_BUTTON.circleSize,

            height: PUMP_BUTTON.circleSize,

            "--circle-start": `${
              PUMP_BUTTON.width -
              PUMP_BUTTON.circleSize -
              PUMP_BUTTON.circleInset
            }px`,

            "--circle-end": `${PUMP_BUTTON.circleInset}px`,
          } as CSSProperties
        }
      >
        <FiArrowUpRight
          size={px(20)}
          strokeWidth={3.2}
          className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover:scale-100 group-hover:opacity-100"
        />
      </span>
    </motion.button>
  );
}

/* PROCESS CARDS — matching desktop size and shared hover behavior */

function SmartPumpProcessCards({
  cardRefs,
}: {
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {PROCESS_CARDS.map((card, index) => (
        <div
          key={card.label}
          ref={(element) => {
            cardRefs.current[index] = element;
          }}
          tabIndex={0}
          aria-label={card.label}
          className="group pointer-events-auto absolute box-border flex cursor-pointer items-center overflow-hidden transition-[background,box-shadow,border-color] duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF]"
          style={{
            left: card.left,

            top: PROCESS_CARD.top + card.topOffset,

            width: PROCESS_CARD.width,

            height: PROCESS_CARD.height,

            paddingLeft: PROCESS_CARD.paddingLeft,

            borderRadius: PROCESS_CARD.radius,

            border: `${PROCESS_CARD.borderWidth}px solid #F7F7F7`,

            backgroundColor: "rgba(255,255,255,0.15)",

            backdropFilter: `blur(${PROCESS_CARD.backdropBlur}px)`,

            WebkitBackdropFilter: `blur(${PROCESS_CARD.backdropBlur}px)`,

            boxShadow: `inset ${PROCESS_CARD.shadowX}px ${PROCESS_CARD.shadowY}px ${PROCESS_CARD.shadowBlur}px rgba(0,94,255,0.15)`,
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{
              borderRadius: "inherit",

              background: "linear-gradient(180deg, #005EFF 0%, #001EA2 100%)",

              boxShadow: "0 12px 35px rgba(0,94,255,0.22)",
            }}
          />

          <span
            className="relative z-[1] block text-[#0D5792] transition-colors duration-500 group-hover:text-white group-focus-visible:text-white"
            style={{
              ...headingFont,

              fontSize: PROCESS_CARD.fontSize,

              lineHeight: 1,

              letterSpacing: 0,
            }}
          >
            {card.lines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

// Kartlar yalnızca bu sahneye gelindiğinde scroll ile ilerler.
// Eğri videosu, kartların bitiş koordinatları ve mevcut hover stilleri değişmez.
const CARD_SCROLL_DISTANCE = 3400;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const bezier = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

function DesktopSmartPump() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion() ?? false;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => !!el);
    if (!section || cards.length !== PROCESS_CARDS.length) return;

    const ctx = gsap.context(() => {
      const draw = (progress: number) => {
        const height = window.innerHeight;
        // Kartların ekranda belirdiği an section yaklaşık bu kadar yukarıdadır.
        const pinOffset = Math.max(0, PROCESS_CARD.top - height * 0.43);
        const firstX = -PROCESS_CARD.width - 100;
        const firstY = pinOffset + height + 100;

        cards.forEach((card, index) => {
          const xEnd = PROCESS_CARDS[index].left;
          const yEnd = PROCESS_CARD.top + PROCESS_CARDS[index].topOffset;
          const start = (PROCESS_CARDS.length - 1 - index) * 0.13;
          const duration = 0.58;
          const t = smoothstep((progress - start) / duration);

          // Ortak sol-alt çıkıştan başlayıp beyaz eğrinin yönünü izler.
          const curveX = bezier(
            firstX,
            firstX + (xEnd - firstX) * 0.32,
            firstX + (xEnd - firstX) * 0.78,
            xEnd,
            t,
          );
          const curveY = bezier(
            firstY,
            firstY - height * 0.65,
            yEnd + height * 0.11,
            yEnd,
            t,
          );

          gsap.set(card, {
            x: curveX - xEnd,
            y: curveY - yEnd,
            autoAlpha: t <= 0 ? 0 : Math.min(1, t * 8),
          });
        });
      };

      // Scroll'un küçük sıçramalarını sönümle; kartlar eğri boyunca akıcı ilerler.
      const motion = { progress: 0 };
      const updateMotion = (target: number) => {
        gsap.to(motion, {
          progress: target,
          duration: 0.85,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => draw(motion.progress),
        });
      };

      draw(0);
      ScrollTrigger.create({
        trigger: section,
        start: () =>
          `top top-=${Math.max(0, PROCESS_CARD.top - window.innerHeight * 0.43)}`,
        end: () => `+=${CARD_SCROLL_DISTANCE}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateMotion(self.progress),
        onRefresh: (self) => {
          gsap.killTweensOf(motion);
          motion.progress = self.progress;
          draw(self.progress);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="smart-pump"
      className="relative w-full"
      style={{
        marginTop: -SECTION.overlapTop,

        paddingTop: SECTION.overlapTop,

        minHeight: SECTION.minHeight + SECTION.overlapTop,

        backgroundColor: SECTION.background,

        backgroundImage: SECTION.newsBackground,

        overflow: "visible",

        zIndex: 5,
      }}
    >
      <SmartPumpCloud />

      <SmartPumpCurveLine />

      <SmartPumpRobotHand reducedMotion={reducedMotion} />

      <SmartPumpHeading reducedMotion={reducedMotion} />

      <SmartPumpDescription reducedMotion={reducedMotion} />

      <SmartPumpSecondaryHeading reducedMotion={reducedMotion} />

      <SmartPumpSelectionButton reducedMotion={reducedMotion} />

      <SmartPumpProcessCards cardRefs={cardRefs} />
    </section>
  );
}

export default function SmartPump() {
  const compact = useHomeCompact();
  return compact ? <MobileSmartPump /> : <DesktopSmartPump />;
}
