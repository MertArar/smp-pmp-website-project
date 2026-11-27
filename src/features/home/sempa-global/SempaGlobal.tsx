"use client";

import { useHomeCompact, MobileGlobal } from "../HomeMobileSections";

import HomeMediaVideo from "@/features/home/HomeMediaVideo";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

// Match the directional scroll reveals used on AboutUsPage.
// Only opacity and transforms are animated; absolute layout stays untouched.
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

const DESIGN = {
  figmaWidth: 1440,
  targetWidth: 1920,
  scale: 1920 / 1440,
};

const px = (value: number) => value * DESIGN.scale;

/* COMPONENT DIMENSIONS */

const COMPONENT = {
  width: px(1201),
  height: px(549),
};

/* TYPOGRAPHY */

const headingFont: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",
  fontWeight: 650,
  fontVariationSettings: '"wght" 650, "wdth" 125',
  fontOpticalSizing: "auto",
};

const statisticFont: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",
  fontWeight: 270,
  fontVariationSettings: '"wght" 270, "wdth" 125',
  fontOpticalSizing: "auto",
};

const expandedRegular: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",
  fontWeight: 410,
  fontVariationSettings: '"wght" 410, "wdth" 125',
  fontOpticalSizing: "auto",
};

/* WORLD VIDEO */

const WORLD = {
  left: px(240),
  top: px(250),
  size: px(202.77),
  rotation: 4.96,
};

/* EXPORT COUNTRIES CARD */

const EXPORT_CARD = {
  left: px(0),
  top: px(354),
  width: px(331),
  height: px(129),
  radius: px(30),
  border: px(0.5),
  padding: px(28),
};

/* CENTER LINE */

const CENTER_LINE = {
  left: px(561),
  top: 0,
  height: px(549),
  thickness: px(2),
  color: "#9EB7D0",
};

/* FORKLIFT */

const FORKLIFT = {
  left: px(668),
  top: px(29),
  width: px(510),
  height: px(325),
};

/* EXPORT RATE CARD */

const EXPORT_RATE_CARD = {
  left: px(668),
  top: px(29),
  width: px(248),
  height: px(143),
  radius: px(30),
  border: px(0.5),
  padding: px(28),
  blur: 15,
};

/* JOIN SEMPA GLOBAL CARD */

const JOIN_CARD = {
  left: px(758),
  top: px(288),
  width: px(379),
  height: px(197),
  radius: px(30),
  border: px(0.5),
  padding: px(28),
  gap: px(24),
  blur: 15,
};

/* APPLY BUTTON */

const APPLY_BUTTON = {
  width: px(117),
  height: px(43),
  radius: px(19),
  circleSize: px(30),
  circleInset: px(6),
  textInset: px(18),
};

/* NEW: RIGHT STATISTIC — 68% */

const EXPORT_PERCENTAGE = {
  left: px(948),
  top: px(196),
  width: px(253),
  height: px(100),
  fontSize: px(100),
  color: "#4687B8",
};

/* SHARED GLASS STYLES */

function glassStyle(
  radius: number,
  border: number,
  blur: number,
): CSSProperties {
  return {
    boxSizing: "border-box",
    borderRadius: radius,
    border: `${border}px solid #9EB7D0`,
    backgroundColor: "rgba(255,255,255,0.10)",
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  };
}

/* EXPORT COUNTRIES CONTENT */

function ExportCountriesContent() {
  return (
    <div className="relative h-full w-full">
      <h3
        className="m-0 text-[#1D2049]"
        style={{
          ...expandedRegular,
          width: px(132),
          height: px(50),
          fontSize: px(25),
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        <span className="block whitespace-nowrap">Export</span>
        <span className="block whitespace-nowrap">Countries</span>
      </h3>

      <p
        className="absolute m-0 text-[#0D5792]"
        style={{
          ...expandedRegular,
          left: 0,
          top: px(65),
          width: px(248),
          minHeight: px(24),
          fontSize: px(12),
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        Delivering fluid engineering excellence to industries worldwide.
      </p>
    </div>
  );
}

/* EXPORT RATE CONTENT */

function ExportRateContent() {
  return (
    <div className="relative h-full w-full">
      <h3
        className="m-0 text-[#1D2049]"
        style={{
          ...expandedRegular,
          width: px(91),
          height: px(50),
          fontSize: px(25),
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        <span className="block whitespace-nowrap">Export</span>
        <span className="block whitespace-nowrap">Rate</span>
      </h3>

      <p
        className="absolute m-0 text-[#27272A]"
        style={{
          ...expandedRegular,
          left: px(0.5),
          top: px(65.5),
          width: px(191),
          minHeight: px(24),
          fontSize: px(12),
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        Powering industries worldwide.
      </p>
    </div>
  );
}

/* EXPORT RATE GLASS CARD */

function ExportRateCard({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      {...reveal("right", 0.32, reducedMotion)}
      className="absolute z-[15]"
      style={{
        left: EXPORT_RATE_CARD.left,
        top: EXPORT_RATE_CARD.top,
        width: EXPORT_RATE_CARD.width,
        height: EXPORT_RATE_CARD.height,
        padding: EXPORT_RATE_CARD.padding,
        ...glassStyle(
          EXPORT_RATE_CARD.radius,
          EXPORT_RATE_CARD.border,
          EXPORT_RATE_CARD.blur,
        ),
      }}
    >
      <ExportRateContent />
    </motion.div>
  );
}

/* APPLY BUTTON */

function ApplyButton() {
  return (
    <Link
      href="/career"
      aria-label="Apply to join Sempa Global"
      className="group pointer-events-auto relative flex shrink-0 items-center overflow-hidden bg-[#F7F7F7] transition-[box-shadow] duration-[350ms] hover:bg-[#F7F7F7]"
      style={{
        width: APPLY_BUTTON.width,
        height: APPLY_BUTTON.height,
        borderRadius: APPLY_BUTTON.radius,
        boxShadow: "0 4px 12px rgba(0,74,226,0.12)",
      }}
    >
      <span
        className="absolute top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap text-[#27272A] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[29px]"
        style={{
          ...expandedRegular,
          left: APPLY_BUTTON.textInset,
          fontSize: px(15),
          lineHeight: 1.07,
          letterSpacing: "-0.04em",
        }}
      >
        Apply
      </span>

      <span
        aria-hidden="true"
        className="absolute top-1/2 z-[3] flex -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] left-[var(--circle-start)] group-hover:left-[var(--circle-end)]"
        style={
          {
            width: APPLY_BUTTON.circleSize,
            height: APPLY_BUTTON.circleSize,
            "--circle-start": `${
              APPLY_BUTTON.width -
              APPLY_BUTTON.circleSize -
              APPLY_BUTTON.circleInset
            }px`,
            "--circle-end": `${APPLY_BUTTON.circleInset}px`,
          } as CSSProperties
        }
      >
        <FiArrowUpRight
          size={px(20)}
          strokeWidth={3.2}
          className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover:scale-100 group-hover:opacity-100"
        />
      </span>
    </Link>
  );
}

/* JOIN SEMPA GLOBAL CONTENT */

function JoinSempaGlobalContent() {
  return (
    <div className="relative h-full w-full">
      <h3
        className="m-0 whitespace-nowrap text-[#1D2049]"
        style={{
          ...expandedRegular,
          width: px(252),
          height: px(25),
          fontSize: px(25),
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        Join Sempa Global
      </h3>

      <p
        className="absolute m-0 text-[#0D5792]"
        style={{
          ...expandedRegular,
          left: 0,
          top: px(25 + 24),
          width: px(328),
          minHeight: px(36),
          fontSize: px(12),
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        Sempa, a manufacturer and investor of pump technologies, invites you to
        the world pump movement. Make your pre-application now.
      </p>

      <div
        className="absolute pointer-events-auto"
        style={{
          left: 0,
          top: px(25 + 24 + 36 + 24),
        }}
      >
        <ApplyButton />
      </div>
    </div>
  );
}

/* JOIN SEMPA GLOBAL CARD */

function JoinSempaGlobalCard({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      {...reveal("right", 0.52, reducedMotion)}
      className="absolute z-30"
      style={{
        left: JOIN_CARD.left,
        top: JOIN_CARD.top,
        width: JOIN_CARD.width,
        height: JOIN_CARD.height,
        padding: JOIN_CARD.padding,
        ...glassStyle(JOIN_CARD.radius, JOIN_CARD.border, JOIN_CARD.blur),
      }}
    >
      <JoinSempaGlobalContent />
    </motion.div>
  );
}

/* FORKLIFT IMAGE */

function ForkliftImage({
  assetBase,
  reducedMotion,
}: {
  assetBase: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      {...reveal("right", 0.18, reducedMotion)}
      className="pointer-events-none absolute z-20"
      style={{
        left: FORKLIFT.left,
        top: FORKLIFT.top,
        width: FORKLIFT.width,
        height: FORKLIFT.height,
      }}
    >
      <Image
        src={`${assetBase}/forklift.png`}
        alt="Sempa global forklift and shipping container"
        fill
        unoptimized
        sizes="680px"
        className="object-contain"
        style={{
          objectPosition: "center center",
          filter: "none",
        }}
      />
    </motion.div>
  );
}

/* NEW: 68% STATISTIC */

function ExportPercentage({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      {...reveal("up", 0.42, reducedMotion)}
      aria-label="68 percent export rate"
      className="pointer-events-none absolute z-[25] m-0 whitespace-nowrap"
      style={{
        ...statisticFont,
        left: EXPORT_PERCENTAGE.left,
        top: EXPORT_PERCENTAGE.top,
        width: EXPORT_PERCENTAGE.width,
        height: EXPORT_PERCENTAGE.height,
        fontSize: EXPORT_PERCENTAGE.fontSize,
        lineHeight: 1,
        letterSpacing: 0,
        color: EXPORT_PERCENTAGE.color,
      }}
    >
      68%
    </motion.div>
  );
}

/* MAIN COMPONENT */

function DesktopSempaGlobal({
  assetBase = "/home/sempa-global",
}: {
  assetBase?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionVisible = useInView(sectionRef, { once: false, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="sempa-global"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#E0EFF9]"
    >
      <div
        className="relative shrink-0"
        style={{
          width: COMPONENT.width,
          height: COMPONENT.height,
          maxWidth: "calc(100% - 48px)",
        }}
      >
        {/* MAIN HEADING */}
        <motion.h2
          {...reveal("left", 0, reducedMotion)}
          className="absolute z-10 m-0 overflow-visible bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] bg-clip-text text-transparent"
          style={{
            ...headingFont,
            left: px(1),
            top: px(23),
            width: px(330),
            height: "auto",
            paddingBottom: px(5),
            fontSize: px(30),
            lineHeight: 1.12,
            letterSpacing: 0,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <span className="block whitespace-nowrap">Sempa Global</span>
          <span className="block whitespace-nowrap">Powering the World</span>
        </motion.h2>

        {/* LEFT STATISTIC */}
        <motion.div
          {...reveal("up", 0.14, reducedMotion)}
          className="pointer-events-none absolute z-10 m-0 whitespace-nowrap text-[#4687B8]"
          style={{
            ...statisticFont,
            left: px(180),
            top: px(196),
            width: px(280),
            height: "auto",
            minHeight: px(100),
            fontSize: px(100),
            lineHeight: 1,
            letterSpacing: 0,
          }}
        >
          100+
        </motion.div>

        {/* CENTER VERTICAL LINE */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-[5]"
          initial={reducedMotion ? false : { opacity: 0, scaleY: 0 }}
          animate={
            reducedMotion || sectionVisible
              ? { opacity: 1, scaleY: 1 }
              : { opacity: 0, scaleY: 0 }
          }
          transition={{
            duration: reducedMotion ? 0 : 1.1,
            delay: reducedMotion ? 0 : 0.2,
            ease: [0.25, 0.85, 0.3, 1],
          }}
          style={{
            left: CENTER_LINE.left,
            top: CENTER_LINE.top,
            width: 0,
            height: CENTER_LINE.height,
            borderLeft: `${CENTER_LINE.thickness}px solid ${CENTER_LINE.color}`,
            transformOrigin: "center top",
          }}
        />

        {/* WORLD VIDEO */}
        <div
          className="pointer-events-none absolute z-20"
          style={{
            left: WORLD.left,
            top: WORLD.top,
            width: WORLD.size,
            height: WORLD.size,
            transform: `rotate(${WORLD.rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          <motion.div
            {...reveal("left", 0.24, reducedMotion)}
            className="absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at center, black 0%, black 65.5%, transparent 49%)",
              maskImage:
                "radial-gradient(circle at center, black 0%, black 65.5%, transparent 49%)",
            }}
          >
            <HomeMediaVideo
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              className="block h-full w-full object-cover"
              style={{
                transform: "scale(1.06)",
                transformOrigin: "center center",
                objectPosition: "center center",
              }}
            >
              <source
                src={`${assetBase}/sempa-global.webm`}
                type="video/webm"
              />
            </HomeMediaVideo>
          </motion.div>
        </div>

        {/* EXPORT COUNTRIES CARD */}
        <motion.div
          {...reveal("left", 0.36, reducedMotion)}
          className="absolute z-30"
          style={{
            left: EXPORT_CARD.left,
            top: EXPORT_CARD.top,
            width: EXPORT_CARD.width,
            height: EXPORT_CARD.height,
            padding: EXPORT_CARD.padding,
            ...glassStyle(EXPORT_CARD.radius, EXPORT_CARD.border, 15),
          }}
        >
          <ExportCountriesContent />
        </motion.div>

        {/* EXPORT RATE CARD */}
        <ExportRateCard reducedMotion={reducedMotion} />

        {/* FORKLIFT */}
        <ForkliftImage assetBase={assetBase} reducedMotion={reducedMotion} />

        {/* NEW: 68% */}
        <ExportPercentage reducedMotion={reducedMotion} />

        {/* JOIN CARD IN FRONT OF FORKLIFT */}
        <JoinSempaGlobalCard reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

export default function SempaGlobal({
  assetBase = "/home/sempa-global",
}: {
  assetBase?: string;
}) {
  const compact = useHomeCompact();
  return (
    <div data-home-global-slot>
      {compact ? (
        <MobileGlobal assetBase={assetBase} />
      ) : (
        <DesktopSempaGlobal assetBase={assetBase} />
      )}
    </div>
  );
}
