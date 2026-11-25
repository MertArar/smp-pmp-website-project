"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import SempaGlobal from "../home/sempa-global/SempaGlobal";
import HomeMediaVideo from "../home/HomeMediaVideo";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Page-level entrances only: never animate GSAP-owned transforms or interactive state.
type EntranceDirection = "up" | "left" | "right";

const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// One horizontal gradient keeps the color at every section boundary identical,
// regardless of section height or responsive layout.
const globalLightBackground =
  "linear-gradient(90deg,#EDF7FF 0%,#D9ECFD 54%,#CEE6FC 100%)";

const entranceVariants: Variants = {
  hidden: ({
    direction = "up",
    reduced = false,
    distance = 44,
  }: {
    direction?: EntranceDirection;
    reduced?: boolean;
    distance?: number;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -distance
        : direction === "right"
          ? distance
          : 0,
    y: reduced ? 0 : direction === "up" ? distance : 0,
    filter: reduced ? "blur(0px)" : "blur(6px)",
  }),
  visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
};

function entrance(
  direction: EntranceDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.18,
  distance = 44,
) {
  return {
    variants: entranceVariants,
    custom: { direction, reduced, distance },
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -9% 0px" },
    transition: {
      duration: reduced ? 0 : 0.95,
      delay: reduced ? 0 : delay,
      ease: entranceEase,
    },
  };
}

function GlobalRouteHeading({
  className,
  style,
}: {
  className: string;
  style: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const glowId = useId().replace(/:/g, "");
  useEffect(() => {
    const title = ref.current;
    if (!title) return;
    const svg = title.querySelector("svg")!;
    const route = title.querySelector<SVGPathElement>(".ocean-route")!;
    const light = title.querySelector<SVGGElement>(".ocean-light")!;
    const hubs = Array.from(
      title.querySelectorAll<SVGCircleElement>(".ocean-hub"),
    );
    const particles = Array.from(
      title.querySelectorAll<SVGCircleElement>(".ocean-particle"),
    );
    const letters = title.querySelectorAll<HTMLElement>(".ocean-letter");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: gsap.core.Timeline | undefined;
    let visible = false;
    const context = gsap.context(() => {}, title);
    const build = () =>
      context.add(() => {
        timeline?.kill();
        gsap.set(letters, { clearProps: "all" });
        gsap.set(svg, { opacity: 0 });
        if (motion.matches) return;
        const bounds = title.getBoundingClientRect();
        const lines = Array.from(
          title.querySelectorAll<HTMLElement>(".ocean-line"),
        );
        const points = lines.map((line) => {
          const r = line.getBoundingClientRect();
          const last = line.lastElementChild!.getBoundingClientRect();
          return {
            x: r.left - bounds.left,
            y: r.top - bounds.top + r.height * 0.78,
            width: last.right - r.left,
          };
        });
        svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        let path = `M ${points[0].x} ${points[0].y}`;
        points.forEach((point, index) => {
          if (index) {
            const previous = points[index - 1];
            path += ` C ${previous.width + 32} ${previous.y + 32}, ${point.x - 32} ${point.y - 40}, ${point.x} ${point.y}`;
          }
          path += ` C ${point.x + point.width * 0.3} ${point.y - 14}, ${point.x + point.width * 0.7} ${point.y + 10}, ${point.x + point.width} ${point.y}`;
        });
        route.setAttribute("d", path);
        const length = route.getTotalLength();
        gsap.set(route, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.65,
        });
        gsap.set(letters, { opacity: 0, y: 7 });
        gsap.set(hubs, { opacity: 0 });
        gsap.set(particles, { opacity: 0, x: 0, y: 0 });
        gsap.set(light, { opacity: 0 });
        gsap.set(svg, { opacity: 1 });
        const travel = { progress: 0 };
        timeline = gsap.timeline({ paused: true });
        timeline.to(light, { opacity: 1, duration: 0.15 }, 0);
        timeline.to(
          travel,
          {
            progress: 1,
            duration: 2.45,
            ease: "sine.inOut",
            onUpdate: () => {
              const distance = travel.progress * length;
              const point = route.getPointAtLength(distance);
              light.setAttribute(
                "transform",
                `translate(${point.x} ${point.y})`,
              );
              route.style.strokeDashoffset = String(length - distance);
            },
          },
          0,
        );
        // Reveal each letter when the travelling light reaches its nearest route point.
        lines.forEach((line) =>
          Array.from(line.children).forEach((letter) => {
            const r = letter.getBoundingClientRect();
            const x = r.left - bounds.left + r.width / 2;
            const y = r.top - bounds.top + r.height * 0.78;
            let closest = 0,
              best = Infinity;
            for (let sample = 0; sample <= 400; sample++) {
              const point = route.getPointAtLength((length * sample) / 400);
              const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
              if (distance < best) {
                best = distance;
                closest = sample / 400;
              }
            }
            const time = (Math.acos(1 - 2 * closest) / Math.PI) * 2.45;
            timeline!.to(
              letter,
              { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
              Math.max(0, time - 0.12),
            );
          }),
        );
        hubs.forEach((hub, index) => {
          const point = route.getPointAtLength(length * (0.22 + index * 0.29));
          hub.setAttribute("cx", String(point.x));
          hub.setAttribute("cy", String(point.y));
          timeline!
            .to(hub, { opacity: 0.8, duration: 0.18 }, 1.85 + index * 0.09)
            .to(hub, { opacity: 0, duration: 0.45 }, 2.15 + index * 0.07);
        });
        particles.forEach((particle, index) => {
          const point = route.getPointAtLength(
            (length * (index + 1)) / (particles.length + 1),
          );
          particle.setAttribute("cx", String(point.x));
          particle.setAttribute("cy", String(point.y));
          timeline!.to(particle, { opacity: 0.6, duration: 0.1 }, 2.35).to(
            particle,
            {
              opacity: 0,
              y: -5 - (index % 3) * 3,
              x: index % 2 ? 4 : -4,
              duration: 0.45,
            },
            2.45,
          );
        });
        timeline
          .to(route, { opacity: 0, duration: 0.45 }, 2.4)
          .to(light, { opacity: 0, duration: 0.3 }, 2.4)
          .fromTo(
            letters,
            { textShadow: "0 0 0px transparent" },
            { textShadow: "0 0 7px #b9edff", duration: 0.12, stagger: 0.004 },
            2.42,
          )
          .to(
            letters,
            { textShadow: "0 0 0px transparent", duration: 0.25 },
            2.7,
          );
        const reveal = timeline
          .repeat(1)
          .yoyo(true)
          .repeatDelay(4)
          .paused(false);
        timeline = gsap.timeline({ paused: true, repeat: -1 }).add(reveal);
        if (visible && !document.hidden) timeline.play();
      });
    build();
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (visible && !document.hidden) timeline?.resume();
        else timeline?.pause();
      },
      { threshold: [0, 0.5] },
    );
    const visibility = () => {
      if (document.hidden || !visible) timeline?.pause();
      else timeline?.resume();
    };
    let measuredSize = `${title.offsetWidth}:${title.offsetHeight}`;
    const resize = new ResizeObserver(() => {
      const nextSize = `${title.offsetWidth}:${title.offsetHeight}`;
      if (nextSize !== measuredSize) {
        measuredSize = nextSize;
        build();
      }
    });
    resize.observe(title);
    observer.observe(title);
    motion.addEventListener("change", build);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      resize.disconnect();
      timeline?.kill();
      context.revert();
      motion.removeEventListener("change", build);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <h1
      ref={ref}
      className={`relative ${className}`}
      style={style}
      aria-label="Global Export & Distribution Network"
    >
      <span aria-hidden="true">
        {["Global Export", "& Distribution", "Network"].map((line) => (
          <span key={line} className="ocean-line block whitespace-nowrap">
            {Array.from(line, (letter, index) => (
              <span key={index} className="ocean-letter inline-block">
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </span>
        ))}
      </span>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <filter id={glowId} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <path
          className="ocean-route"
          fill="none"
          stroke="#65cfff"
          strokeWidth=".9"
          opacity="0"
        />
        <g className="ocean-light" opacity="0">
          <circle
            r="6"
            fill="#009fff"
            opacity=".45"
            filter={`url(#${glowId})`}
          />
          <circle r="1.8" fill="#d6f6ff" />
        </g>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            className="ocean-hub"
            r="1.7"
            fill="#82ddff"
            opacity="0"
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            className="ocean-particle"
            r=".8"
            fill="#9ae6ff"
            opacity="0"
          />
        ))}
      </svg>
    </h1>
  );
}

// ============================================================
// COMMON SETTINGS
// ============================================================

const caseContentWidth =
  "mx-auto w-[calc(100%-48px)] max-w-[1600px] lg:w-[83.333333%]";

const countryFontSize = "clamp(22px, 1.65vw, 32px)";
const descriptionFontSize = "clamp(13.2px, 0.99vw, 19.2px)";
const categoryFontSize = "10px";

const cardElasticEasing = "cubic-bezier(0.18, 1.85, 0.38, 1)";

const ctaTextStyle = {
  fontFamily: "var(--font-sf-pro)",
  fontWeight: 410,
  fontSize: "15px",
  lineHeight: "1.07",
  letterSpacing: "-0.04em",
  fontStretch: "125%" as const,
  fontVariationSettings: '"wght" 410, "wdth" 125',
  fontOpticalSizing: "auto" as const,
};

// ============================================================
// HERO STATISTICS
// ============================================================

const statCardClassName = [
  "relative h-full w-full min-w-0 overflow-hidden rounded-[30px] max-xl:bg-none! max-xl:bg-[#ffffff26]!",
  "border-[0.5px] border-white/25",
  "bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(195,212,230,0.11)_35%,rgba(8,23,36,0.30)_100%)]",
  "backdrop-blur-[18px] backdrop-saturate-[125%]",
  "px-[25px] py-[18px]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_32px_rgba(0,8,20,0.14)]",
].join(" ");

const statNumberStyle = {
  fontFamily: "var(--font-sf-pro)",
  fontWeight: 410,
  fontStyle: "normal" as const,
  fontVariationSettings: '"wght" 410, "wdth" 125',
  fontStretch: "125%" as const,
  fontSize: "36px",
  lineHeight: "100%",
  letterSpacing: "0em",
  color: "#9EB7D0",
};

const statLabelStyle = {
  ...statNumberStyle,
  fontSize: "20px",
  lineHeight: "107%",
  letterSpacing: "-0.04em",
  color: "#F7F7F7",
};

const statCaptionStyle = {
  ...statLabelStyle,
  fontSize: "12px",
  lineHeight: "112%",
};

// ============================================================
// EUROPE MAP
// ============================================================

function EuropeMap() {
  return (
    <div
      className="pointer-events-none absolute right-[4%] top-[7%] select-none max-xl:w-[42%]!"
      style={{
        width: "47.54%",
        aspectRatio: "145 / 99",
      }}
    >
      <Image
        src="/global/europe.png"
        alt=""
        fill
        unoptimized
        draggable={false}
        sizes="(min-width: 1024px) 200px, 145px"
        className="object-contain"
      />
    </div>
  );
}

// ============================================================
// ISIB LOGO
// ============================================================

function IsibLogo() {
  return (
    <div
      className="pointer-events-none absolute right-[7%] top-[12%] select-none"
      style={{
        width: "18.06%",
        aspectRatio: "55.07 / 58",
      }}
    >
      <Image
        src="/global/isib.png"
        alt=""
        fill
        unoptimized
        draggable={false}
        sizes="(min-width: 1024px) 80px, 55px"
        className="object-contain object-top"
      />
    </div>
  );
}

// ============================================================
// GLASS REFLECTION
// ============================================================

function GlassReflection() {
  return (
    <>
      <div
        className="
          pointer-events-none absolute inset-0 rounded-[30px]
          bg-[radial-gradient(ellipse_110%_85%_at_15%_0%,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.04)_35%,transparent_70%)]
        "
      />
      <div
        className="
          pointer-events-none absolute inset-0 rounded-[30px]
          bg-[linear-gradient(180deg,transparent_0%,rgba(8,18,28,0.08)_100%)]
        "
      />
    </>
  );
}

// ============================================================
// EXPORT STATISTICS CARDS
// ============================================================

function ExportStatisticsCards() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      className="
        relative mt-[50px] grid w-full grid-cols-1
        gap-[14px] pb-[48px]
        lg:absolute lg:left-[29%] lg:top-[85svh]
        lg:mt-0 lg:h-[215px] lg:w-[62%]
        lg:grid-cols-3 lg:pb-0
       max-xl:relative! max-xl:left-auto! max-xl:top-auto! max-xl:mt-7! max-xl:h-auto! max-xl:w-full! max-xl:gap-3! max-xl:pb-14! max-xl:grid-cols-1! sm:max-xl:grid-cols-3!"
      aria-label="Global export statistics"
    >
      {/* CARD 1 */}
      <motion.div
        {...entrance("left", 0.0, reduced, 0.13, 37)}
        className={`${statCardClassName} min-h-[185px] lg:min-h-0 max-xl:min-h-0! max-xl:h-[176px]! max-sm:h-[calc((100vw-24px)*0.5)]! max-sm:p-[7%]! max-xl:px-5! max-xl:py-5! max-xl:rounded-[28px]! max-xl:order-2`}
      >
        <GlassReflection />
        <EuropeMap />
        <div className="relative z-10 flex h-full flex-col items-start">
          <div
            className="max-w-full max-sm:text-[clamp(36px,9.5vw,54px)]! sm:max-xl:text-[32px]!"
            style={statNumberStyle}
          >
            100+
          </div>
          <div
            className="mt-[2px] max-w-full max-sm:text-[clamp(20px,5.25vw,30px)]! sm:max-xl:text-[17px]! sm:max-xl:w-[130px]!"
            style={{ ...statLabelStyle, width: "142px" }}
          >
            Export
            <br />
            Destinations
          </div>
          <p
            className="mt-auto max-w-full max-sm:w-full! max-sm:text-[clamp(12px,3.15vw,18px)]! sm:max-xl:text-[11px]!"
            style={{ ...statCaptionStyle, width: "242px" }}
          >
            Active footprint across 5 continents
          </p>
        </div>
      </motion.div>

      {/* CARD 2 */}
      <motion.div
        {...entrance("up", 0.1, reduced, 0.13, 37)}
        className={`${statCardClassName} min-h-[185px] lg:min-h-0 max-xl:min-h-0! max-xl:h-[176px]! max-sm:h-[calc((100vw-24px)*0.5)]! max-sm:p-[7%]! max-xl:px-5! max-xl:py-5! max-xl:rounded-[28px]! max-xl:order-1`}
      >
        <GlassReflection />
        <IsibLogo />
        <div className="relative z-10 flex h-full flex-col items-start">
          <div
            className="max-w-full max-sm:text-[clamp(36px,9.5vw,54px)]! sm:max-xl:text-[32px]!"
            style={statNumberStyle}
          >
            1.
          </div>
          <div
            className="mt-[2px] max-w-full max-sm:text-[clamp(20px,5.25vw,30px)]! sm:max-xl:text-[17px]! sm:max-xl:w-[130px]!"
            style={{ ...statLabelStyle, width: "142px" }}
          >
            2023 Export
            <br />
            Leader
          </div>
          <p
            className="mt-auto max-w-full max-sm:w-full! max-sm:text-[clamp(12px,3.15vw,18px)]! sm:max-xl:text-[11px]!"
            style={{ ...statCaptionStyle, width: "242px" }}
          >
            Ranked #1 in Pumps &amp; Components
            <br />
            by ISIB
          </p>
        </div>
      </motion.div>

      {/* CARD 3 */}
      <motion.div
        {...entrance("right", 0.2, reduced, 0.13, 37)}
        className={`${statCardClassName} min-h-[185px] lg:min-h-0 max-xl:min-h-0! max-xl:h-[176px]! max-sm:h-[calc((100vw-24px)*0.5)]! max-sm:p-[7%]! max-xl:px-5! max-xl:py-5! max-xl:rounded-[28px]! max-xl:order-3`}
      >
        <GlassReflection />
        <EuropeMap />
        <div className="relative z-10 flex h-full flex-col items-start">
          <div
            className="max-w-full max-sm:text-[clamp(36px,9.5vw,54px)]! sm:max-xl:text-[32px]!"
            style={statNumberStyle}
          >
            5
          </div>
          <div
            className="mt-[2px] max-w-full max-sm:text-[clamp(20px,5.25vw,30px)]! sm:max-xl:text-[17px]! sm:max-xl:w-[130px]!"
            style={{ ...statLabelStyle, width: "142px" }}
          >
            Continents
            <br />
            Covered
          </div>
          <p
            className="mt-auto max-w-full max-sm:w-full! max-sm:text-[clamp(12px,3.15vw,18px)]! sm:max-xl:text-[11px]!"
            style={{ ...statCaptionStyle, width: "242px" }}
          >
            Europe, Asia, Africa, Americas,
            <br />
            Oceania
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// SECTOR FILTERS
// ============================================================

const sectorFilters = [
  "All Sector",
  "Irrigation",
  "Fire Protection",
  "Chemical Industry",
  "District HVAC",
  "Infrastructure",
] as const;

type SectorFilter = (typeof sectorFilters)[number];

// ============================================================
// CASE STUDY DATA
// ============================================================

const hoverSample = {
  model: "SCM & SPS Series NFPA 20 Compliant Diesel + Electric Fire Sets",
  summary:
    "Engineered and supplied redundant diesel and electric driven SEMPA NFPA 20 compliant fire pump skids protecting critical aircraft hangar infrastructure at Ashgabat Military Airport.",
  specification:
    "2,500 GPM @ 14 Bar · Dual-Battery Fully Automated PLC Fire Control System",
};

const caseStudies = [
  {
    id: 1,
    country: "Türkmenistan",
    year: "2022",
    categoryLines: ["Aviation & Military Defense"],
    descriptionLines: [
      "Ashgabat Military Airport Aircraft",
      "Hangars Fire Pumping Station",
    ],
    image: "/global/sector-img.jpg",
    hover: hoverSample,
  },
  {
    id: 2,
    country: "Russia",
    year: "2021 - 2023",
    categoryLines: ["District Heating &", "Municipal Utilities"],
    descriptionLines: [
      "Russian Federation District",
      "Heating (HVAC) & Industrial",
      "Dewatering",
    ],
    image: "/global/sector-img.jpg",
    hover: hoverSample,
  },
  {
    id: 3,
    country: "Azerbaijan",
    year: "2022",
    categoryLines: ["Municipal Infrastructure", "& Potable Water"],
    descriptionLines: [
      "Azerbaijan Shusha & Karabakh",
      "Regional Water Transmission",
      "Network",
    ],
    image: "/global/sector-img.jpg",
    hover: hoverSample,
  },
];

type CaseStudy = (typeof caseStudies)[number];

// ============================================================
// CASE STUDY CARD
// ============================================================

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div
      className="
        relative min-h-[440px] w-full min-w-0
        hover:z-20 focus-within:z-20
        xl:aspect-[384/396] xl:min-h-0
       max-xl:min-h-[390px]! sm:max-xl:min-h-[440px]!"
    >
      <article
        tabIndex={0}
        aria-label={`${study.country} case study`}
        className="
          group/card
          absolute inset-x-0 top-0 z-0
          flex h-full min-w-0 flex-col
          overflow-hidden rounded-[26px]
          border-[0.6px] border-[#B8CEDF]/55
          bg-[linear-gradient(130deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0.28)_58%,rgba(232,244,255,0.10)_100%)]
          px-[clamp(24px,2.78vw,52px)]
          pb-[clamp(26px,2.5vw,38px)]
          pt-[clamp(25px,1.8vw,35px)]
          backdrop-blur-[8px]
          outline-none
          transition-[height,padding-bottom,box-shadow,border-color]
          duration-[820ms]
          hover:h-[112%]
          hover:pb-[16px]
          hover:border-white/70
          hover:shadow-[0_20px_38px_rgba(53,110,238,0.19)]
          focus-visible:h-[112%]
          focus-visible:pb-[16px]
          focus-visible:border-[#9EB7D0]
          focus-visible:shadow-[0_20px_38px_rgba(53,110,238,0.19)]
          motion-reduce:transition-none
         max-xl:px-8! max-xl:pt-7! max-xl:pb-7! max-xl:rounded-[28px]! max-xl:hover:h-full! max-xl:focus-visible:h-full!"
        style={{ transitionTimingFunction: cardElasticEasing }}
      >
        {/* HOVER BACKGROUND */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-[#F7F7F8] opacity-0
            transition-opacity duration-[480ms] ease-out
            group-hover/card:opacity-100
            group-focus-visible/card:opacity-100
            motion-reduce:transition-none
          "
        />

        {/* CATEGORY BADGE */}
        <div
          className="
            relative z-10 flex min-h-[24px]
            w-[40%] min-w-[145px] max-w-[210px]
            shrink-0 flex-col justify-center
            rounded-[7px] bg-[#0D5792]
            px-[8px] py-[5px] text-[#6DB7E0]
           max-xl:w-fit! max-xl:min-w-[140px]! max-xl:text-[9px]!"
          style={{
            fontFamily: "var(--font-sf-pro)",
            fontSize: categoryFontSize,
            fontWeight: 410,
            fontStretch: "125%",
            fontVariationSettings: '"wght" 410, "wdth" 125',
            lineHeight: "112%",
            letterSpacing: "-0.04em",
          }}
        >
          {study.categoryLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </div>

        {/* COUNTRY + YEAR */}
        <div
          className="
            relative z-10 mt-[clamp(12px,1vw,18px)]
            flex shrink-0 flex-wrap items-baseline
            gap-x-[16px] gap-y-[3px]
           max-xl:gap-x-4! max-xl:mt-4!"
        >
          <h3
            className="m-0 text-[#111111] max-xl:text-[24px]!"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontSize: countryFontSize,
              fontWeight: 560,
              fontStretch: "125%",
              fontVariationSettings: '"wght" 560, "wdth" 125',
              lineHeight: "110%",
              letterSpacing: "-0.04em",
            }}
          >
            {study.country}
          </h3>
          <span
            className="whitespace-nowrap text-[clamp(11px,0.8vw,14px)] text-[#171717]"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontWeight: 410,
              fontStretch: "125%",
              fontVariationSettings: '"wght" 410, "wdth" 125',
              lineHeight: "112%",
              letterSpacing: "-0.04em",
            }}
          >
            {study.year}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p
          className="
            relative z-10 mb-0
            mt-[clamp(29px,1.97vw,38px)]
            w-full shrink-0 text-[#151515]
           max-xl:mt-6! max-xl:text-[14px]!"
          style={{
            fontFamily: "var(--font-sf-pro)",
            fontSize: descriptionFontSize,
            fontWeight: 410,
            fontStretch: "125%",
            fontVariationSettings: '"wght" 410, "wdth" 125',
            lineHeight: "108%",
            letterSpacing: "-0.04em",
          }}
        >
          {study.descriptionLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* IMAGE + HOVER DETAILS */}
        <div className="relative z-10 mt-[10px] min-h-0 w-full flex-1">
          <div
            className="
              absolute inset-x-0 bottom-0
              aspect-[304/175] overflow-hidden
              rounded-[16px] opacity-100
              transition-[opacity,transform,filter]
              duration-[430ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover/card:translate-y-[-8px]
              group-hover/card:scale-[0.985]
              group-hover/card:opacity-0
              group-hover/card:blur-[5px]
              group-focus-visible/card:opacity-0
              motion-reduce:transition-none
             max-xl:aspect-[304/175]! max-xl:group-hover/card:opacity-100! max-xl:group-hover/card:translate-y-0! max-xl:group-hover/card:scale-100! max-xl:group-hover/card:blur-none! max-xl:group-focus-visible/card:opacity-100!"
          >
            <Image
              src={study.image}
              alt={`${study.country} pumping project`}
              fill
              quality={95}
              draggable={false}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 44vw, 85vw"
              className="pointer-events-none select-none object-cover object-center"
            />
          </div>

          {/* HOVER INFORMATION */}
          <div
            className="
              pointer-events-none absolute inset-0
              flex translate-y-[14px] flex-col opacity-0
              transition-[opacity,transform] duration-[420ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover/card:pointer-events-auto
              group-hover/card:translate-y-0
              group-hover/card:opacity-100
              group-hover/card:delay-[90ms]
              group-focus-visible/card:pointer-events-auto
              group-focus-visible/card:translate-y-0
              group-focus-visible/card:opacity-100
              motion-reduce:transition-none
             max-xl:hidden!"
          >
            {/* PUMP SPECIFICATION */}
            <div className="w-[94%] rounded-[17px] border border-[#9EB7D0] px-[15px] py-[14px]">
              <p
                className="m-0 tracking-[-0.04em] text-[#9EB7D0]"
                style={{
                  fontFamily: "var(--font-sf-pro)",
                  fontWeight: 350,
                  fontSize: "14px",
                  lineHeight: "110%",
                }}
              >
                Pump Model &amp; Specification
              </p>
              <p
                className="mb-0 mt-[9px] tracking-[-0.04em] text-[#0D5792]"
                style={{
                  fontFamily: "var(--font-sf-pro)",
                  fontWeight: 410,
                  fontSize: "15px",
                  lineHeight: "110%",
                }}
              >
                {study.hover.model}
              </p>
            </div>

            {/* TECHNICAL DESCRIPTION */}
            <p
              className="mb-0 mt-[clamp(16px,1.875vw,36px)] tracking-[-0.035em] text-[#0D5792]"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 410,
                fontSize: "12px",
                lineHeight: "108%",
              }}
            >
              {study.hover.summary}
            </p>

            {/* SPECIFICATION FOOTNOTE */}
            <p
              className="mb-0 mt-[clamp(12px,1.458vw,28px)] tracking-[-0.035em] text-[#9EB7D0]"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 350,
                fontSize: "12px",
                lineHeight: "112%",
              }}
            >
              {study.hover.specification}
            </p>

            {/* VIEW ALL */}
            <div
              className="
                group/cta relative mt-auto flex h-[43px] w-[140px]
                shrink-0 cursor-pointer items-center
                overflow-hidden rounded-[19px]
                border border-[#c8d7e5]
                bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)]
                shadow-[0_4px_12px_rgba(26,80,126,0.06)]
                transition-[transform,box-shadow,border-color]
                duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-[2px] hover:scale-[1.025]
                hover:border-[#9EB7D0]
                hover:shadow-[0_8px_24px_rgba(0,94,255,0.20),0_0_18px_rgba(0,94,255,0.10)]
                motion-reduce:transition-none
              "
            >
              <span
                className="
                  pointer-events-none absolute inset-0 z-0
                  bg-[linear-gradient(120deg,rgba(225,239,255,0.98)_0%,rgba(255,255,255,1)_100%)]
                  opacity-0 transition-opacity duration-[500ms] ease-out
                  group-hover/cta:opacity-100
                "
              />
              <span
                className="
                  relative z-[2] ml-[16px] whitespace-nowrap text-[#27272A]
                  transition-[transform,color] duration-[650ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/cta:translate-x-[37px]
                  group-hover/cta:text-[#0D5792]
                "
                style={ctaTextStyle}
              >
                View All
              </span>
              <span
                className="
                  absolute left-[calc(100%-37px)] top-1/2 z-[3]
                  flex h-[31px] w-[31px] -translate-y-1/2
                  items-center justify-center rounded-full
                  bg-[linear-gradient(135deg,#005EFF_0%,#001EA2_100%)]
                  shadow-[0_0_12px_rgba(0,94,255,0.38),0_5px_14px_rgba(0,30,162,0.28)]
                  transition-[left,box-shadow,background] duration-[650ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/cta:left-[6px]
                  group-hover/cta:shadow-[0_0_18px_rgba(0,94,255,0.60),0_6px_18px_rgba(0,30,162,0.35)]
                "
              >
                <FiArrowUpRight
                  size={21}
                  strokeWidth={3.2}
                  className="
                    scale-[0.78] text-white opacity-0
                    transition-[opacity,transform] duration-[350ms] ease-out
                    group-hover/cta:scale-100 group-hover/cta:opacity-100
                  "
                />
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// ============================================================
// CASE STUDIES GRID
// ============================================================

function CaseStudiesGrid() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      className={`${caseContentWidth} mt-[34px] grid grid-cols-1 items-start gap-x-[24px] gap-y-[105px] pb-[140px] md:grid-cols-2 lg:mt-[48px] xl:grid-cols-3 xl:gap-y-[120px] max-xl:mt-7! max-xl:w-full! max-xl:gap-3! max-xl:pb-14! sm:max-xl:grid-cols-2! sm:max-xl:[&>div:last-child:nth-child(odd)]:col-span-2 sm:max-xl:[&>div:last-child:nth-child(odd)]:w-[calc((100%-12px)/2)] sm:max-xl:[&>div:last-child:nth-child(odd)]:justify-self-center`}
    >
      {caseStudies.map((study, index) => (
        <motion.div
          key={study.id}
          {...entrance(
            index % 3 === 0 ? "left" : index % 3 === 2 ? "right" : "up",
            Math.min(index % 3, 2) * 0.08,
            reduced,
            0.13,
            42,
          )}
          className="relative min-w-0 hover:z-30 focus-within:z-30"
        >
          <CaseStudyCard study={study} />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// GLOBAL PARTNERSHIP TYPOGRAPHY
// PARAGRAPH = HEADING * 70%
// ============================================================

const gpTypography = {
  min: 20,
  viewport: 1.52,
  max: 28,
  paragraphRatio: 0.7,
};

const gpHeadingFontSize = `clamp(${gpTypography.min}px, ${gpTypography.viewport}vw, ${gpTypography.max}px)`;

const gpParagraphFontSize = `clamp(${
  gpTypography.min * gpTypography.paragraphRatio
}px, ${gpTypography.viewport * gpTypography.paragraphRatio}vw, ${
  gpTypography.max * gpTypography.paragraphRatio
}px)`;

const gpBlockTitleStyle = {
  fontFamily: "var(--font-sf-pro)",
  fontSize: gpHeadingFontSize,
  fontWeight: 410,
  fontStyle: "normal" as const,
  fontStretch: "125%" as const,
  fontVariationSettings: '"wght" 410, "wdth" 125',
  fontOpticalSizing: "auto" as const,
  lineHeight: "100%",
  letterSpacing: "-0.04em",
  color: "#27272A",
};

const gpBlockBodyStyle = {
  fontFamily: "var(--font-sf-pro)",
  fontSize: gpParagraphFontSize,
  fontWeight: 350,
  fontStyle: "normal" as const,
  fontStretch: "125%" as const,
  fontVariationSettings: '"wght" 350, "wdth" 125',
  fontOpticalSizing: "auto" as const,
  lineHeight: "100%",
  letterSpacing: "-0.04em",
  color: "#9EB7D0",
};

// ============================================================
// PARTNERSHIP HOTSPOT SETTINGS
// ============================================================

const gpHotspotSettings = {
  duration: "3.1s",
  gradientStart: "#005EFF",
  gradientEnd: "#001EA2",
};

type PartnershipHotspotData = {
  id: string;
  x: string;
  y: string;
  phase: string;
};

const partnershipHotspots: PartnershipHotspotData[] = [
  { id: "distribution", x: "20.8%", y: "25%", phase: "-0.35s" },
  { id: "logistics", x: "77.5%", y: "47%", phase: "-1.4s" },
  { id: "metallurgy", x: "16%", y: "82%", phase: "-2.25s" },
];

// ============================================================
// PARTNERSHIP HOTSPOT
// ============================================================

function PartnershipHotspot({ spot }: { spot: PartnershipHotspotData }) {
  return (
    <span
      aria-hidden="true"
      className="
        pointer-events-none absolute z-20 block
        h-[clamp(56px,4.7vw,76px)]
        w-[clamp(56px,4.7vw,76px)]
        -translate-x-1/2 -translate-y-1/2 select-none
       max-xl:hidden!"
      style={
        {
          left: spot.x,
          top: spot.y,
          "--gp-delay": spot.phase,
          "--gp-duration": gpHotspotSettings.duration,
          "--gp-gradient-start": gpHotspotSettings.gradientStart,
          "--gp-gradient-end": gpHotspotSettings.gradientEnd,
        } as CSSProperties
      }
    >
      {/* SOFT BLUE GLOW */}
      <span className="gp-hotspot-glow absolute inset-[2%] rounded-full bg-[#71B8FF]/25 blur-[9px]" />

      {/* WHITE CIRCULAR BACKGROUND */}
      <span
        className="
          gp-hotspot-white-disc absolute inset-[13%] rounded-full
          bg-white/85
          shadow-[0_0_0_3px_rgba(255,255,255,0.35),0_0_18px_7px_rgba(255,255,255,0.65),0_3px_12px_rgba(0,94,255,0.20)]
        "
      />

      {/* OUTER GRADIENT RING */}
      <span className="gp-hotspot-ring gp-hotspot-ring-outer absolute inset-[3%] rounded-full">
        <span className="gp-hotspot-gradient-stroke absolute inset-0 rounded-full" />
      </span>

      {/* MIDDLE GRADIENT RING */}
      <span className="gp-hotspot-ring gp-hotspot-ring-middle absolute inset-[10%] rounded-full">
        <span className="gp-hotspot-gradient-stroke absolute inset-0 rounded-full" />
      </span>

      {/* INNER GRADIENT RING */}
      <span className="gp-hotspot-ring gp-hotspot-ring-inner absolute inset-[17%] rounded-full">
        <span className="gp-hotspot-gradient-stroke absolute inset-0 rounded-full" />
      </span>

      {/* FIXED WHITE CENTER BORDER */}
      <span
        className="
          absolute inset-[23%] rounded-full border-[2px] border-white
          bg-[#257BF5]
          shadow-[0_0_0_1px_rgba(25,103,238,0.62),0_1px_6px_rgba(0,61,213,0.32)]
        "
      />

      {/* FIXED BLUE CENTER */}
      <span
        className="
          absolute inset-[28%] rounded-full
          bg-[linear-gradient(145deg,#005EFF_0%,#0348E4_40%,#00199E_100%)]
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.16)]
        "
      />
    </span>
  );
}

// ============================================================
// GLOBAL PARTNERSHIP SECTION
// ============================================================

function GlobalPartnershipSection() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      id="global-partnership"
      aria-labelledby="global-partnership-heading"
      className="relative w-full overflow-hidden px-6 pt-[40px] pb-[90px] lg:px-0 lg:pt-[6.5svh] xl:pb-[30px] max-xl:px-6! max-xl:pt-8! max-xl:pb-0! max-sm:px-[7.2vw]! max-sm:pt-7!"
      style={{
        backgroundImage: globalLightBackground,
      }}
    >
      {/* SECTION TITLE */}
      <motion.h2
        {...entrance("up", 0, reduced, 0.18, 40)}
        id="global-partnership-heading"
        className="relative z-10 mx-auto w-full max-w-[856px] text-center text-[clamp(34px,3.125vw,60px)] max-xl:text-[29px]! max-sm:text-[clamp(29px,8.42vw,48px)]! sm:max-xl:text-[40px]!"
        style={{
          fontFamily: "var(--font-sf-pro)",
          fontWeight: 350,
          fontStyle: "normal",
          fontStretch: "125%",
          fontVariationSettings: '"wght" 350, "wdth" 125',
          fontOpticalSizing: "auto",
          lineHeight: "100%",
          letterSpacing: "-0.04em",
          color: "#0D5792",
        }}
      >
        Global &amp; Partnership
        <br />
        Logistics
      </motion.h2>

      {/* CONTENT STAGE */}
      <div className="relative mx-auto mt-[34px] w-full max-w-[1920px] xl:mt-[12px] xl:h-[690px] max-xl:mt-6! max-sm:mt-0! sm:max-xl:grid sm:max-xl:grid-cols-2 sm:max-xl:gap-x-10">
        {/* CENTER IMAGE + HOTSPOTS */}
        <div
          className="
            relative z-0 mx-auto w-[min(88vw,660px)]
            xl:absolute xl:left-1/2 xl:top-0
            xl:w-[clamp(630px,44vw,800px)] xl:-translate-x-1/2
           max-xl:w-[min(100%,500px)]! max-sm:w-[calc(100%+11.5vw)]! max-sm:max-w-none max-sm:-ml-[5.75vw]! sm:max-xl:col-span-2"
        >
          <Image
            src="/global/global-partnership.webp"
            alt="SEMPA global partnership and international logistics"
            width={1600}
            height={1600}
            unoptimized
            draggable={false}
            sizes="(max-width: 1279px) 88vw, (max-width: 1920px) 44vw, 800px"
            className="pointer-events-none block h-auto w-full select-none object-contain"
          />
          {partnershipHotspots.map((spot) => (
            <PartnershipHotspot key={spot.id} spot={spot} />
          ))}
        </div>

        {/* LEFT TOP TEXT */}
        <div
          className="
            relative z-10 mx-auto mt-[24px] w-full max-w-[520px]
            xl:absolute xl:left-[7.6%] xl:top-[145px]
            xl:mt-0 xl:w-auto xl:max-w-none
           max-xl:relative! max-xl:mt-8! max-sm:mt-[clamp(20px,4.9vw,28px)]! max-xl:pr-0 max-xl:pb-2 sm:max-xl:col-span-2"
        >
          <span
            aria-hidden="true"
            className="absolute -top-1 right-4 hidden size-10 max-sm:size-[clamp(40px,14vw,80px)] items-center justify-center rounded-full border border-white/60 bg-white/15 shadow-[0_0_0_7px_#ffffff15] max-xl:flex"
          >
            <span className="size-8 max-sm:size-[clamp(32px,9vw,52px)] rounded-full border border-white/80 bg-linear-to-br from-[#005eff] to-[#001ea2]" />
          </span>
          <motion.h3
            {...entrance("up", 0.07, reduced, 0.16, 27)}
            className="m-0 max-xl:text-[20px]! max-sm:text-[clamp(20px,5.25vw,30px)]! max-xl:leading-[1.05]! max-xl:pr-14 max-sm:pr-[clamp(56px,16.84vw,96px)]!"
            style={gpBlockTitleStyle}
          >
            <span className="block xl:whitespace-nowrap">
              Sempa Global
              <br className="hidden max-sm:block" /> Partnership &amp;
            </span>
            <span className="block xl:whitespace-nowrap">
              Authorized Distribution Network
            </span>
          </motion.h3>
          <motion.p
            {...entrance("up", 0.12, reduced, 0.12, 20)}
            className="mb-0 mt-[20px] max-xl:mt-3! max-sm:mt-4! max-xl:text-[15px]! max-sm:text-[clamp(15px,4.02vw,23px)]! max-xl:leading-[1.03]! max-xl:[&_span]:inline! max-xl:[&_span]:after:content-['_']"
            style={gpBlockBodyStyle}
          >
            <span className="block xl:whitespace-nowrap">
              Under the Sempa Global Partnership System (SGPS)
            </span>
            <span className="block xl:whitespace-nowrap">
              established since 1972, we collaborate with
            </span>
            <span className="block xl:whitespace-nowrap">
              technically trained regional distributors and service
            </span>
            <span className="block xl:whitespace-nowrap">
              partners across all continents.
            </span>
          </motion.p>
        </div>

        {/* RIGHT TEXT */}
        <div
          className="
            relative z-10 mx-auto mt-[38px] w-full max-w-[520px]
            xl:absolute xl:left-[68%] xl:top-[285px]
            xl:mt-0 xl:w-auto xl:max-w-none
           max-xl:relative! max-xl:mt-14! max-sm:mt-[clamp(56px,14.7vw,84px)]! max-xl:pr-0 max-xl:pb-2"
        >
          <span
            aria-hidden="true"
            className="absolute -top-1 left-0 right-auto hidden size-10 max-sm:size-[clamp(40px,14vw,80px)] items-center justify-center rounded-full border border-white/60 bg-white/15 shadow-[0_0_0_7px_#ffffff15] max-xl:flex"
          >
            <span className="size-8 max-sm:size-[clamp(32px,9vw,52px)] rounded-full border border-white/80 bg-linear-to-br from-[#005eff] to-[#001ea2]" />
          </span>
          <motion.h3
            {...entrance("up", 0.07, reduced, 0.16, 27)}
            className="m-0 max-xl:text-[20px]! max-sm:text-[clamp(20px,5.25vw,30px)]! max-xl:leading-[1.05]! max-xl:pr-0 max-xl:pl-16 max-sm:pl-[clamp(64px,16.84vw,96px)]! max-sm:[&_span]:inline! max-sm:[&_span]:after:content-['_']"
            style={gpBlockTitleStyle}
          >
            <span className="block xl:whitespace-nowrap">
              International Logistics Corridors &amp;
            </span>
            <span className="block xl:whitespace-nowrap">
              Expedited Shipping
            </span>
          </motion.h3>
          <motion.p
            {...entrance("up", 0.12, reduced, 0.12, 20)}
            className="mb-0 mt-[20px] max-xl:mt-3! max-sm:mt-4! max-xl:text-[15px]! max-sm:text-[clamp(15px,4.02vw,23px)]! max-xl:leading-[1.03]! max-xl:[&_span]:inline! max-xl:[&_span]:after:content-['_']"
            style={gpBlockBodyStyle}
          >
            <span className="block xl:whitespace-nowrap">
              Our 132,000 m² mega complex in Konya 4th
            </span>
            <span className="block xl:whitespace-nowrap">
              Industrial Zone connects directly with Turkish
            </span>
            <span className="block xl:whitespace-nowrap">
              maritime ports, rail corridors, and air cargo
            </span>
            <span className="block xl:whitespace-nowrap">
              terminals. All shipments comply with
            </span>
            <span className="block xl:whitespace-nowrap">
              international seaworthy ISPM-15 crating.
            </span>
          </motion.p>

          {/* VIEW ISPM CERTIFICATE */}
          <div className="mt-[28px] flex items-center gap-[12px] xl:ml-[42px] max-xl:mt-6!">
            <span
              className="text-right text-[clamp(13px,0.95vw,18px)]"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 410,
                fontStretch: "125%",
                fontVariationSettings: '"wght" 410, "wdth" 125',
                lineHeight: "95%",
                letterSpacing: "-0.04em",
                color: "#27272A",
              }}
            >
              View
              <br />
              ISPM
              <br />
              Certificate
            </span>
            <div className="relative h-[clamp(42px,3.6vw,65px)] w-[clamp(42px,3.6vw,65px)] shrink-0">
              <Image
                src="/global/document.png"
                alt="ISPM certificate document"
                fill
                unoptimized
                draggable={false}
                sizes="65px"
                className="pointer-events-none select-none object-contain"
              />
            </div>
          </div>
        </div>

        {/* LEFT BOTTOM TEXT */}
        <div
          className="
            relative z-10 mx-auto mt-[38px] w-full max-w-[520px]
            xl:absolute xl:left-[7%] xl:top-[510px]
            xl:mt-0 xl:w-auto xl:max-w-none
           max-xl:relative! max-xl:mt-14! max-sm:mt-[clamp(56px,14.7vw,84px)]! max-xl:pr-0 max-xl:pb-2"
        >
          <span
            aria-hidden="true"
            className="absolute -top-1 right-4 hidden size-10 max-sm:size-[clamp(40px,14vw,80px)] items-center justify-center rounded-full border border-white/60 bg-white/15 shadow-[0_0_0_7px_#ffffff15] max-xl:flex"
          >
            <span className="size-8 max-sm:size-[clamp(32px,9vw,52px)] rounded-full border border-white/80 bg-linear-to-br from-[#005eff] to-[#001ea2]" />
          </span>
          <motion.h3
            {...entrance("up", 0.07, reduced, 0.16, 27)}
            className="m-0 max-xl:text-[20px]! max-sm:text-[clamp(20px,5.25vw,30px)]! max-xl:leading-[1.05]! max-xl:pr-14 max-sm:pr-[clamp(56px,16.84vw,96px)]!"
            style={gpBlockTitleStyle}
          >
            <span className="block xl:whitespace-nowrap">
              Tailored Metallurgy &amp; Regional
            </span>
            <span className="block xl:whitespace-nowrap">
              Standard Compliance
            </span>
          </motion.h3>
          <motion.p
            {...entrance("up", 0.12, reduced, 0.12, 20)}
            className="mb-0 mt-[20px] max-xl:mt-3! max-sm:mt-4! max-xl:text-[15px]! max-sm:text-[clamp(15px,4.02vw,23px)]! max-xl:leading-[1.03]! max-xl:[&_span]:inline! max-xl:[&_span]:after:content-['_']"
            style={gpBlockBodyStyle}
          >
            <span className="block xl:whitespace-nowrap">
              To meet differing regional fluid chemistry,
            </span>
            <span className="block xl:whitespace-nowrap">
              temperatures, and statutory regulations,
            </span>
            <span className="block xl:whitespace-nowrap">
              we cast ductile iron, tin bronze, duplex
            </span>
            <span className="block xl:whitespace-nowrap">
              (1.4462), and super duplex stainless alloys
            </span>
            <span className="block xl:whitespace-nowrap">
              directly in our proprietary foundry.
            </span>
          </motion.p>
        </div>
      </div>

      {/* HOTSPOT ANIMATIONS */}
      <style>{`
        #global-partnership .gp-hotspot-gradient-stroke {
          display: block;
          position: absolute;
          inset: 0;
          box-sizing: border-box;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(
            135deg,
            var(--gp-gradient-start, #005EFF) 0%,
            var(--gp-gradient-end, #001EA2) 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        @keyframes gpRingCycle {
          0%, 8%, 88%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          23% {
            transform: scale(0.88);
            opacity: 0.45;
          }
          32%, 61% {
            transform: scale(0.72);
            opacity: 0;
          }
          73% {
            transform: scale(0.86);
            opacity: 0.35;
          }
        }

        @keyframes gpWhiteDiscCycle {
          0%, 12%, 88%, 100% {
            opacity: 0.95;
            transform: scale(1);
          }
          35%, 58% {
            opacity: 0.60;
            transform: scale(0.94);
          }
        }

        @keyframes gpGlowCycle {
          0%, 12%, 88%, 100% {
            opacity: 0.95;
            transform: scale(1);
          }
          35%, 58% {
            opacity: 0.12;
            transform: scale(0.75);
          }
        }

        #global-partnership .gp-hotspot-ring {
          transform-origin: center center;
          animation-name: gpRingCycle;
          animation-duration: var(--gp-duration, 3.1s);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          animation-delay: var(--gp-delay, 0s);
          will-change: transform, opacity;
        }

        #global-partnership .gp-hotspot-ring-middle {
          animation-delay: calc(var(--gp-delay, 0s) + 0.10s);
        }

        #global-partnership .gp-hotspot-ring-inner {
          animation-delay: calc(var(--gp-delay, 0s) + 0.18s);
        }

        #global-partnership .gp-hotspot-white-disc {
          transform-origin: center center;
          animation: gpWhiteDiscCycle var(--gp-duration, 3.1s) ease-in-out infinite;
          animation-delay: var(--gp-delay, 0s);
        }

        #global-partnership .gp-hotspot-glow {
          transform-origin: center center;
          animation: gpGlowCycle var(--gp-duration, 3.1s) ease-in-out infinite;
          animation-delay: var(--gp-delay, 0s);
        }

        @media (prefers-reduced-motion: reduce) {
          #global-partnership .gp-hotspot-ring,
          #global-partnership .gp-hotspot-white-disc,
          #global-partnership .gp-hotspot-glow {
            animation: none;
            opacity: 1;
            transform: none;
            will-change: auto;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// STRATEGIC EXPORT CORRIDORS
// ============================================================

function StrategicExportCorridorsSection() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      id="strategic-export-corridors"
      aria-labelledby="strategic-export-corridors-title"
      className="
        relative w-full overflow-hidden px-6
        pt-[96px] pb-[100px]
        xl:px-0 xl:pt-[calc(110px+6.5svh)] xl:pb-[130px]
       max-xl:px-3! max-xl:pt-16! max-xl:pb-12!"
      style={{
        backgroundImage: globalLightBackground,
      }}
    >
      {/* ==================================================
          MAIN CTA CONTAINER

          Radius: changed from 30px to 36px.
          Other sizing and section spacing preserved.
      ================================================== */}
      <motion.div
        {...entrance("up", 0.06, reduced, 0.14, 34)}
        className="
          relative isolate mx-auto w-full max-w-[1600px]
          min-h-[450px] overflow-hidden rounded-[36px]
          bg-[#031321]
          lg:aspect-[1200/296] lg:min-h-0 lg:w-[83.333333%]
         max-xl:min-h-0! max-xl:aspect-auto! max-xl:w-full! max-xl:rounded-[28px]! max-xl:pb-9!"
      >
        <Image
          src="/global/global-cta.webp"
          alt="SEMPA global logistics and export corridors"
          fill
          unoptimized
          draggable={false}
          sizes="(max-width: 1023px) 100vw, 83.333vw"
          className="pointer-events-none absolute inset-0 z-0 select-none object-cover object-center max-xl:object-[55%_center]!"
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 z-[1]
            bg-[linear-gradient(90deg,rgba(0,12,23,0.16)_0%,rgba(0,12,23,0.06)_42%,rgba(0,12,23,0)_100%)]
          "
        />

        {/* ==================================================
            NEW: STRATEGIC EXPORT CORRIDORS EYEBROW

            Figma 1440px reference:
            left = 158px; CTA left approximately 123px
            => 35px from the CTA's left edge.
            font size 9px, weight 410, color #4687B8.
            The label and headline share the same left edge.
        ================================================== */}
        <div
          className="
            absolute z-[3]
            left-[3.2%] top-[13.9%]
            w-[93.6%]
           max-xl:relative! max-xl:left-auto! max-xl:top-auto! max-xl:w-auto! max-xl:px-6! max-xl:pt-10!"
        >
          <p
            className="m-0 text-[clamp(9px,0.625vw,12px)]"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontWeight: 350,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 350, "wdth" 125',
              fontOpticalSizing: "auto",
              lineHeight: "112%",
              letterSpacing: "-0.04em",
              color: "#4687B8",
            }}
          >
            STRATEGIC EXPORT CORRIDORS
          </p>

          {/* ==================================================
              NEW: HEADLINE

              Figma: 20px, weight 410, line height 107%,
              letter spacing -4%, color #F7F7F7.
              Figma top difference: 2852 - 2827 = 25px.
          ================================================== */}
          <motion.h2
            {...entrance("left", 0.02, reduced, 0.14, 42)}
            id="strategic-export-corridors-title"
            className="
              m-0 mt-[clamp(15px,1.08vw,21px)]
              max-w-full lg:whitespace-nowrap
              text-[clamp(20px,1.38889vw,26.67px)]
             max-xl:whitespace-normal! max-xl:text-[22px]! max-xl:max-w-[380px]!"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontWeight: 350,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 350, "wdth" 125',
              fontOpticalSizing: "auto",
              lineHeight: "107%",
              letterSpacing: "-0.04em",
              color: "#F7F7F7",
            }}
          >
            Direct Intermodal Connectivity from Konya HQ to Global Ports
          </motion.h2>
        </div>

        {/* ==================================================
            STRATEGIC EXPORT CORRIDORS — GLASS CARDS

            FIGMA REFERENCE (1440px):
            Card heading: 15px, #6DB7E0, -4% tracking
            Card body: 9px, #9EB7D0, 112% line-height, -4%

            REVISION:
            Heading weight: 410 -> 350
            Paragraph weight: 410 -> 300
            Card corner radius: 18px -> 21px
            Icons: pin.png / truck.png / plane.png

            ICON ALIGNMENT (reference screenshot):
            Each icon sits at the upper-right of its own card.
            Display dimensions account for the PNG alpha padding:
            pin has almost no transparent padding, truck and plane
            have a lot of transparent glow space.
            Sizes/positions are relative to the heading row below.

            Icons are anchored directly to their card top-right corner.
            Pin is slightly larger; truck/plane use PNG inner scaling
            to compensate for transparent pixels.
            Font sizes scale proportionally toward 1920px;
            border, radius and blur do not scale.
        ================================================== */}
        <div
          className="
            relative z-10 mx-auto mt-[145px]
            grid w-[88%] grid-cols-1 gap-[12px]
            lg:absolute lg:left-[3.2%] lg:top-[46.6%]
            lg:mt-0 lg:ml-0 lg:h-[40.7%]
            lg:w-[65%] lg:grid-cols-3
           max-xl:relative! max-xl:left-auto! max-xl:top-auto! max-xl:ml-auto! max-xl:mt-[100px]! max-xl:h-auto! max-xl:w-[88%]! max-xl:grid-cols-1! sm:max-xl:mt-[180px]! sm:max-xl:grid-cols-3!"
        >
          {[
            {
              id: "sea",
              title: "Mersin & İzmir Deniz Limanları",
              description:
                "Weekly scheduled container and bulk cargo ship services from the Mediterranean and Aegean routes via the Suez Canal and the Strait of Gibraltar to ports in the Americas, the Gulf, Asia, and Africa.",
              icon: "/global/pin.png",
              // Visible image enlarged by roughly 30% compared with previous version.
              iconWidth: "clamp(34px,2.3611vw,55px)",
              iconHeight: "clamp(36px,2.5vw,55px)",
              iconScale: 5.2,
            },
            {
              id: "road",
              title: "Europe & the Balkans Road",
              description:
                "Direct door-to-door delivery to Germany, Italy, Austria, and all Central European countries in 3-7 days via the Kapıkule, Hamzabeyli, and Pendik/Çeşme Ro-Ro routes.",
              icon: "/global/truck.png",
              // Original PNG contains wide transparent margins. Magnify the image,
              // not its positioned wrapper, to align the actual truck with the pin.
              iconWidth: "clamp(36px,2.5vw,32px)",
              iconHeight: "clamp(36px,2.5vw,32px)",
              iconScale: 2.45,
            },
            {
              id: "air",
              title: "48-Hour Express Air Cargo Service",
              description:
                "A protocol for shipping original spare parts and emergency hydraulic equipment from the Istanbul and Konya airports to locations worldwide within 48 hours for critical industrial facilities.",
              icon: "/global/plane.png",
              iconWidth: "clamp(36px,2.5vw,32px)",
              iconHeight: "clamp(36px,2.5vw,32px)",
              iconScale: 2.45,
            },
          ].map((card) => (
            <div
              key={card.id}
              className="
                relative w-full min-h-[140px] lg:min-h-0 lg:h-full
                overflow-hidden rounded-[21px]
                border-[0.75px] border-white/45
                bg-[linear-gradient(145deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.13)_55%,rgba(255,255,255,0.19)_100%)]
                backdrop-blur-[14px] backdrop-saturate-[125%]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_20px_rgba(0,0,0,0.12)]
               max-xl:min-h-[126px]! max-xl:h-auto! max-xl:rounded-[18px]!"
            >
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0 rounded-[21px]
                  bg-[radial-gradient(ellipse_110%_100%_at_35%_0%,rgba(255,255,255,0.09)_0%,transparent_75%)]
                "
              />

              {/*
                ALL THREE ICONS: FIXED TO CARD'S TOP-RIGHT CORNER
                Both offsets are from the outer card, NOT the heading row.
                Adjust these two values to move all icons together.
              */}
              <div
                className="pointer-events-none absolute z-20"
                style={{
                  top: "clamp(12px,0.8333vw,16px)",
                  right: "clamp(12px,0.8333vw,16px)",
                  width: card.iconWidth,
                  height: card.iconHeight,
                }}
              >
                <Image
                  src={card.icon}
                  alt=""
                  fill
                  unoptimized
                  draggable={false}
                  sizes="(min-width: 1920px) 48px, 36px"
                  className="pointer-events-none select-none object-contain"
                  style={{ transform: `scale(${card.iconScale})` }}
                />
              </div>

              <div
                className="
                  relative z-10 flex h-full flex-col
                  px-[clamp(18px,1.25vw,24px)]
                  pt-[clamp(14px,0.9722vw,19px)]
                  pb-[clamp(11px,0.8333vw,16px)]
                "
              >
                <div className="relative flex min-h-[clamp(30px,2.0833vw,40px)] items-start">
                  {/* CARD HEADING — ICON IS ANCHORED TO THE OUTER CARD */}
                  <h3
                    className="m-0 max-w-[calc(100%-44px)] max-xl:text-[15px]!"
                    style={{
                      fontFamily: "var(--font-sf-pro)",
                      fontSize: "clamp(15px,1.041667vw,20px)",
                      fontWeight: 350,
                      fontStyle: "normal",
                      fontStretch: "125%",
                      fontVariationSettings: '"wght" 350, "wdth" 125',
                      fontOpticalSizing: "auto",
                      lineHeight: "100%",
                      letterSpacing: "-0.04em",
                      color: "#6DB7E0",
                    }}
                  >
                    {card.title}
                  </h3>
                </div>

                {/* CARD DESCRIPTION */}
                <p
                  className="m-0 mt-[clamp(9px,0.625vw,12px)] max-w-full max-xl:mt-2! max-xl:text-[10px]! max-xl:leading-[1.12]!"
                  style={{
                    fontFamily: "var(--font-sf-pro)",
                    fontSize: "clamp(9px,0.625vw,12px)",
                    fontWeight: 300,
                    fontStyle: "normal",
                    fontStretch: "125%",
                    fontVariationSettings: '"wght" 300, "wdth" 125',
                    fontOpticalSizing: "auto",
                    lineHeight: "112%",
                    letterSpacing: "-0.04em",
                    color: "#9EB7D0",
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================
// GLOBAL PARTNERSHIP DESK — TEXT LAYOUT (STAGE 1)
//
// Figma reference width: 1440px
// Left edge: x = 121px (within 1200px content container)
// Right heading: x = 629px (509px from content container left)
//
// Vertical offsets relative to the Contact Information title:
// Contact Information: 0px
// Partnership Desk label: +18px
// Main heading: +55px
// Description: +247px
//
// Form fields intentionally deferred until their Figma values arrive.
// ============================================================

// ============================================================
// INQUIRY TYPOGRAPHY AND SECTION CONTINUITY
//
// Body copy is always exactly 30% of its heading size.
// One gradient is shared by the seam overlay and the form,
// so their colors agree precisely along their boundary.
// ============================================================

const inquiryHeadingSizes = {
  // Left inquiry text scaled to 90% of the previous design.
  min: 32.4,
  viewport: 3.125,
  max: 60,
  bodyRatio: 0.3,
};

const inquiryHeadingFontSize = `clamp(${inquiryHeadingSizes.min}px,${inquiryHeadingSizes.viewport}vw,${inquiryHeadingSizes.max}px)`;
const inquiryBodyFontSize = `clamp(${inquiryHeadingSizes.min * inquiryHeadingSizes.bodyRatio}px,${inquiryHeadingSizes.viewport * inquiryHeadingSizes.bodyRatio}vw,${inquiryHeadingSizes.max * inquiryHeadingSizes.bodyRatio}px)`;

const inquirySeamlessBackground = globalLightBackground;

const inquiryGradientTextStyle = {
  backgroundImage: "linear-gradient(130deg,#005EFF 0%,#001EA2 100%)",
  backgroundClip: "text" as const,
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
};

// ============================================================
// GLOBAL PARTNERSHIP DESK — FORM FIELD STYLES (FIGMA STAGE 2)
//
// Figma 1440px reference:
// Left/right input width: 339px each
// Input height: 45px, column gap: 13px
// Textarea: 691 x 167px
// Form controls scaled to 90% together (dimensions, spacing, and type).
// Border radius: fixed 11px (does not scale)
// Placeholder: SF Pro at 90% size, wght 300, #9EB7D0
// ============================================================

const inquiryFieldClassName = [
  "gp-inquiry-field min-w-0 w-full appearance-none rounded-[11px]",
  "border-0 bg-[#F7F7F7] shadow-none outline-none",
  "text-[#27272A] placeholder:text-[#9EB7D0] placeholder:opacity-100",
  "focus-visible:ring-1 focus-visible:ring-[#9EB7D0]",
  "transition-[box-shadow] duration-300",
].join(" ");

const inquiryFieldTypography: CSSProperties = {
  fontFamily: "var(--font-sf-pro)",
  fontSize: "clamp(13.5px,0.9375vw,18px)",
  fontWeight: 410,
  fontStyle: "normal",
  fontStretch: "125%",
  fontVariationSettings: '"wght" 410, "wdth" 125',
  fontOpticalSizing: "auto",
  lineHeight: "100%",
  letterSpacing: "-0.04em",
};

const inquiryInputs = [
  {
    name: "companyName",
    placeholder: "Company Name",
    autoComplete: "organization",
    type: "text",
  },
  {
    name: "countryCity",
    placeholder: "Country / City",
    autoComplete: "address-level2",
    type: "text",
  },
  {
    name: "contactPerson",
    placeholder: "Contact Person Full Name",
    autoComplete: "name",
    type: "text",
  },
  {
    name: "businessEmail",
    placeholder: "Business Email",
    autoComplete: "email",
    type: "email",
  },
  {
    name: "phone",
    placeholder: "Phone / WhatsApp",
    autoComplete: "tel",
    type: "tel",
  },
  {
    name: "inquiryType",
    placeholder: "Inquiry Type",
    autoComplete: "off",
    type: "text",
  },
] as const;

function GlobalPartnershipInquirySection() {
  const reduced = useReducedMotion() ?? false;
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [inquiryFeedback, setInquiryFeedback] = useState("");

  return (
    <section
      id="global-partnership-desk"
      aria-labelledby="global-partnership-desk-heading"
      className="relative isolate w-full overflow-hidden px-6 py-[85px] lg:px-0 lg:py-[clamp(96px,6.6667vw,128px)] max-xl:px-[10px]! max-xl:pt-8! max-xl:pb-14! sm:max-xl:px-8!"
      style={{
        // Same horizontal gradient used by the crossfade above.
        backgroundImage: inquirySeamlessBackground,
      }}
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-x-0 gap-y-[52px] lg:min-h-[clamp(410px,28.47vw,546px)] lg:w-[83.333333%] lg:grid-cols-[42.416667%_minmax(0,1fr)] max-xl:w-full! max-xl:grid-cols-1! max-xl:gap-y-14! max-xl:min-h-0!">
        {/* LEFT GROUP: all dimensions and spacing are 90% of the previous design */}
        <motion.div
          {...entrance("left", 0.06, reduced, 0.12, 32)}
          className="min-w-0 lg:w-[90%] lg:pt-[clamp(16.2px,1.125vw,21.6px)] max-xl:w-full! max-xl:px-6! max-xl:pt-0! sm:max-xl:px-5!"
        >
          {/* Figma label 12px scaled by 90% (10.8px at 1440px) */}
          <p
            className="m-0 max-xl:text-[13px]! max-xl:pl-1!"
            style={{
              ...inquiryGradientTextStyle,
              fontFamily: "var(--font-sf-pro)",
              fontSize: "clamp(10.8px,0.75vw,14.4px)",
              fontWeight: 410,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 410, "wdth" 125',
              lineHeight: "112%",
              letterSpacing: "-0.04em",
            }}
          >
            GLOBAL PARTNERSHIP DESK
          </p>

          {/* Figma heading 50px scaled by 90% (45px at 1440px) */}
          <motion.h2
            {...entrance("left", 0.02, reduced, 0.14, 42)}
            id="global-partnership-desk-heading"
            className="m-0 mt-[clamp(21.6px,1.5vw,28.8px)] max-xl:mt-5! max-xl:text-[clamp(28px,7.7vw,42px)]! max-xl:leading-[1]! max-xl:[&_span]:inline!"
            style={{
              ...inquiryGradientTextStyle,
              fontFamily: "var(--font-sf-pro)",
              fontSize: inquiryHeadingFontSize,
              fontWeight: 410,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 410, "wdth" 125',
              lineHeight: "100%",
              letterSpacing: "-0.04em",
            }}
          >
            <span className="block">International</span>{" "}
            <span className="block">Distribution &amp;</span>{" "}
            <span className="block">Export Inquiries</span>
          </motion.h2>

          {/* Font size is always 30% of the heading, at every viewport. */}
          <motion.p
            {...entrance("up", 0.12, reduced, 0.15, 25)}
            className="mb-0 mt-[clamp(37.8px,2.625vw,50.4px)] max-w-[min(100%,514.8px)] max-xl:mt-5! max-xl:max-w-none! max-xl:text-[16px]! max-xl:leading-[1.04]! sm:max-xl:max-w-[650px]! sm:max-xl:text-[20px]!"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontSize: inquiryBodyFontSize,
              fontWeight: 410,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 410, "wdth" 125',
              lineHeight: "100%",
              letterSpacing: "-0.04em",
              color: "#27272A",
            }}
          >
            Submit your inquiry to become an authorized SEMPA distributor in
            your country, request tailored technical tender assistance, or
            receive formal export quotations. Our export division responds
            within 24 hours.
          </motion.p>
        </motion.div>

        {/* RIGHT GROUP: x=629px on Figma's 1440px canvas */}
        <motion.div
          {...entrance("right", 0.13, reduced, 0.12, 32)}
          className="min-w-0"
        >
          {/* FIGMA: 25px, weight 540, line-height 112%, tracking 0% */}
          <h3
            className="m-0 max-xl:px-8! max-xl:text-[17px]! max-xl:font-[410]! max-xl:[font-variation-settings:'wght'_410,'wdth'_125]!"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontSize: "clamp(25px,1.736111vw,33.333px)",
              fontWeight: 540,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 540, "wdth" 125',
              lineHeight: "112%",
              letterSpacing: "0em",
              color: "#005EFF",
            }}
          >
            Contact Information
          </h3>
          {/* ===================================================
              INQUIRY FORM — FIGMA REFERENCE 1440px

              Contact Information starts at x=629, y=3884.
              Small fields start at x=629/982, y=3944.
              2 columns of 339px, 13px gap, 45px tall.
              Vertical row step: 67px (45px + 22px gap).
              Large textarea starts at x=629, y=4145;
              width 691px, height 167px.

              Form fields, grid gaps, paddings, and typography are
              scaled together by 0.90 (relative to the Figma stage).
              Radius increases slightly to FIXED 11px on all screens.
          ==================================================== */}
          <form
            aria-label="Global export inquiry"
            className="mt-[clamp(28.8px,2vw,38.7px)] w-[90%] max-xl:mt-10! max-xl:w-full!"
            onSubmit={(event) => {
              event.preventDefault();
              // No submission endpoint has been provided. Do not imply delivery.
              setInquiryFeedback(
                "Form submission is not connected yet; your inquiry has not been sent.",
              );
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(11.7px,0.8125vw,16.2px)] gap-y-[clamp(19.8px,1.375vw,26.1px)] max-sm:grid-cols-1! max-xl:gap-y-[10px]! sm:max-xl:gap-4!">
              {inquiryInputs.map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  aria-label={field.placeholder}
                  placeholder={field.placeholder}
                  className={`${inquiryFieldClassName} h-[clamp(40.5px,2.8125vw,54px)] px-[clamp(21.6px,2.3125vw,44.1px)] max-xl:h-[46px]! max-xl:px-9! max-xl:text-[16px]! max-xl:font-[410]! sm:max-xl:h-14!`}
                  style={inquiryFieldTypography}
                />
              ))}
            </div>

            {/* Full-width specification box; starts 22px after row 3. */}
            <textarea
              name="projectSpecifications"
              aria-label="Project and pump specifications"
              placeholder="Project & Pump Specifications (Flow, Head, Fluid, Qty)"
              rows={5}
              className={`${inquiryFieldClassName} mt-[clamp(19.8px,1.375vw,26.1px)] block h-[clamp(150.3px,10.4375vw,200.7px)] resize-none px-[clamp(21.6px,2.3125vw,44.1px)] pt-[clamp(24.3px,1.6875vw,32.4px)] pb-[clamp(24.3px,1.6875vw,32.4px)] max-xl:mt-[10px]! max-xl:h-[170px]! max-xl:px-9! max-xl:py-7! max-xl:text-[16px]! sm:max-xl:mt-4! sm:max-xl:h-[220px]!`}
              style={{ ...inquiryFieldTypography, lineHeight: "112%" }}
            />

            {/* ==================================================
                PRIVACY POLICY + SEND
                Matches the small, understated reference controls.
                Field scaling (90%) is preserved.
                Only this GlobalPage.tsx form is modified.
            ================================================== */}
            <label
              className="mt-[clamp(17px,1.18vw,22.7px)] flex w-fit cursor-pointer items-center gap-[5px] max-xl:mx-3! max-xl:mt-11! max-xl:items-start! max-xl:gap-3! max-xl:text-[16px]!"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontSize: "clamp(10.8px,0.75vw,14.4px)",
                fontWeight: 350,
                fontStyle: "normal",
                fontStretch: "125%",
                fontVariationSettings: '"wght" 350, "wdth" 125',
                letterSpacing: "-0.04em",
                lineHeight: "112%",
                color: "#27272A",
              }}
            >
              <input
                type="checkbox"
                name="privacyAgreement"
                required
                checked={privacyAgreed}
                onChange={(event) => {
                  setPrivacyAgreed(event.target.checked);
                  setInquiryFeedback("");
                }}
                className="peer sr-only"
                aria-label="I have read and agree to the Privacy Policy"
              />
              <span
                aria-hidden="true"
                className="flex h-[clamp(10.8px,0.75vw,14.4px)] w-[clamp(10.8px,0.75vw,14.4px)] shrink-0 items-center justify-center rounded-[2px] bg-[#D9D9D9] transition-colors duration-200 peer-checked:bg-[#005EFF] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#005EFF] max-xl:size-4!"
              >
                {privacyAgreed && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="h-[85%] w-[85%]"
                  >
                    <path
                      d="M3.2 8.1 6.5 11.1 12.8 4.8"
                      stroke="white"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span>I have read and agree to the Privacy Policy.</span>
            </label>

            {/* SEND — same View All dimensions and movement, with independent hover CSS. */}
            <button
              type="submit"
              aria-label="Send export inquiry"
              className="
                gp-send-button relative mt-[clamp(22.5px,1.5625vw,30px)]
                flex h-[43px] w-[140px] shrink-0 cursor-pointer items-center
                overflow-hidden rounded-[19px]
                border border-[#c8d7e5]
                bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)]
                shadow-[0_4px_12px_rgba(26,80,126,0.06)]
                transition-[transform,box-shadow,border-color]
                duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-[2px] hover:scale-[1.025]
                hover:border-[#9EB7D0]
                hover:shadow-[0_8px_24px_rgba(0,94,255,0.20),0_0_18px_rgba(0,94,255,0.10)]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-[#005EFF]
                motion-reduce:transition-none
               max-xl:mx-auto! max-xl:mt-5! max-xl:h-11! max-xl:w-[142px]!"
            >
              <span
                aria-hidden="true"
                className="
                  gp-send-sheen pointer-events-none absolute inset-0 z-0
                  bg-[linear-gradient(120deg,rgba(225,239,255,0.98)_0%,rgba(255,255,255,1)_100%)]
                "
              />

              <span
                className="gp-send-label relative z-[2] ml-[16px] whitespace-nowrap text-[#27272A]"
                style={ctaTextStyle}
              >
                Send
              </span>

              <span
                aria-hidden="true"
                className="
                  gp-send-orb absolute left-[calc(100%-37px)] top-1/2 z-[3]
                  flex h-[31px] w-[31px] -translate-y-1/2
                  items-center justify-center rounded-full
                  bg-[linear-gradient(135deg,#005EFF_0%,#001EA2_100%)]
                  shadow-[0_0_12px_rgba(0,94,255,0.38),0_5px_14px_rgba(0,30,162,0.28)]
                "
              >
                {/* Inline SVG avoids icon-library or opacity utility conflicts. */}
                <svg
                  className="gp-send-arrow pointer-events-none block h-[21px] w-[21px] text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </button>

            {inquiryFeedback && (
              <p role="status" className="mt-3 text-[12px] text-[#27272A]">
                {inquiryFeedback}
              </p>
            )}
          </form>
          <style>{`
            #global-partnership-desk .gp-inquiry-field::placeholder {
              color: #9EB7D0;
              opacity: 1;
              font-weight: 300;
              font-variation-settings: "wght" 300, "wdth" 125;
            }


            /* Send has its own hover state; no Tailwind group selectors needed. */
            #global-partnership-desk .gp-send-sheen {
              opacity: 0;
              transition: opacity 500ms ease-out;
            }
            #global-partnership-desk .gp-send-label {
              transform: translateX(0);
              transition: transform 650ms cubic-bezier(0.22,1,0.36,1), color 650ms;
            }
            #global-partnership-desk .gp-send-orb {
              transition: left 650ms cubic-bezier(0.22,1,0.36,1), box-shadow 650ms;
            }
            #global-partnership-desk .gp-send-arrow {
              opacity: 0;
              transform: scale(0.78);
              transform-origin: center;
              transition: opacity 350ms ease-out, transform 350ms ease-out;
            }
            #global-partnership-desk .gp-send-button:is(:hover,:focus-visible) .gp-send-sheen {
              opacity: 1;
            }
            #global-partnership-desk .gp-send-button:is(:hover,:focus-visible) .gp-send-label {
              transform: translateX(37px);
              color: #0D5792;
            }
            #global-partnership-desk .gp-send-button:is(:hover,:focus-visible) .gp-send-orb {
              left: 6px;
              box-shadow: 0 0 18px rgba(0,94,255,0.60), 0 6px 18px rgba(0,30,162,0.35);
            }
            #global-partnership-desk .gp-send-button:is(:hover,:focus-visible) .gp-send-arrow {
              opacity: 1;
              transform: scale(1);
            }
            @media (prefers-reduced-motion: reduce) {
              #global-partnership-desk .gp-send-sheen,
              #global-partnership-desk .gp-send-label,
              #global-partnership-desk .gp-send-orb,
              #global-partnership-desk .gp-send-arrow {
                transition-duration: 0.01ms;
              }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// GLOBAL PAGE
// ============================================================

function CompactGlobalImpact() {
  return (
    <section
      aria-labelledby="compact-global-impact-title"
      className="px-3 pt-2 pb-5 xl:hidden sm:px-8 sm:pt-8"
      style={{ backgroundImage: globalLightBackground }}
    >
      <h2
        id="compact-global-impact-title"
        className="text-[28px] leading-[1]! font-[650]! tracking-[-0.035em] text-[#005eff] [font-variation-settings:'wght'_650,'wdth'_125] sm:text-[40px]"
      >
        Sempa Global
        <br />
        Powering the World
      </h2>
      <div className="mx-auto mt-14 w-full max-w-[760px] sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-10">
        <div className="relative h-[440px] border-b border-[#9eb7d0]/70 sm:h-[430px] sm:border-b-0 sm:border-r">
          <p className="absolute top-4 left-5 text-[clamp(85px,26vw,125px)] leading-none! font-[270]! tracking-normal text-[#4687b8] [font-variation-settings:'wght'_270,'wdth'_125] sm:text-[112px]">
            100+
          </p>
          <div className="absolute top-[90px] left-1/2 size-[220px] -translate-x-1/2 overflow-hidden rounded-full [mask-image:radial-gradient(circle,#000_69%,transparent_70.5%)] sm:top-[95px] sm:size-[240px]">
            <HomeMediaVideo
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="h-full w-full scale-[1.145] object-cover"
            >
              <source src="/global/sempa-global.webm" type="video/webm" />
            </HomeMediaVideo>
          </div>
          <div className="absolute right-5 bottom-12 left-5 rounded-[28px] border border-[#9eb7d0]/60 bg-white/20 px-6 py-5 shadow-[0_8px_24px_#9eb7d015] backdrop-blur-[12px] sm:right-4 sm:left-0">
            <h3 className="text-[25px] leading-none! font-[410]! tracking-normal text-[#1d2049] [font-variation-settings:'wght'_410,'wdth'_125]">
              Export
              <br />
              Countries
            </h3>
            <p className="mt-2 text-[12px] leading-none! font-[410]! tracking-normal text-[#0d5792] [font-variation-settings:'wght'_410,'wdth'_125]">
              Delivering fluid engineering
              <br />
              excellence to industries worldwide.
            </p>
          </div>
        </div>
        <div className="relative mt-10 h-[460px] sm:mt-0 sm:h-[430px]">
          <div className="absolute top-7 left-[15%] z-20 w-[68%] rounded-[28px] border border-[#9eb7d0]/60 bg-white/20 px-6 py-5 backdrop-blur-[12px] sm:top-8 sm:left-0 sm:w-[90%]">
            <h3 className="text-[25px] leading-none! font-[410]! tracking-normal text-[#1d2049] [font-variation-settings:'wght'_410,'wdth'_125]">
              Export
              <br />
              Rate
            </h3>
            <p className="mt-2 text-[12px] leading-none! font-[410]! tracking-normal text-[#27272a] [font-variation-settings:'wght'_410,'wdth'_125]">
              Powering industries
              <br />
              worldwide.
            </p>
          </div>
          <Image
            src="/global/forklift.png"
            alt="SEMPA export container on a forklift"
            width={700}
            height={700}
            className="absolute -bottom-10 -left-[33%] z-10 h-auto w-[155%] max-w-none object-contain sm:-bottom-14 sm:-left-[40%] sm:w-[160%]"
            sizes="(min-width:640px) 45vw, 95vw"
          />
          <p className="absolute right-1 bottom-0 text-[clamp(82px,25vw,120px)] leading-none! font-[270]! tracking-normal text-[#4687b8] [font-variation-settings:'wght'_270,'wdth'_125] sm:text-[105px]">
            68%
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[760px] rounded-[26px] border border-white/90 bg-white/20 px-6 py-6 shadow-[0_4px_15px_#9eb7d015]">
        <h3 className="text-[25px] leading-none! text-[#27272a]">
          Join Sempa Global
        </h3>
        <p className="mt-3 max-w-[510px] text-[14px] leading-[1.08]! text-[#4687b8]">
          Sempa, a manufacturer and exporter of pump technologies, invites you
          to the world pump movement. Make your pre-application now.
        </p>
        <Link
          href="#global-partnership-desk"
          className="group relative mt-5 inline-flex h-10 w-[126px] items-center rounded-full border border-white/90 bg-white/25 pl-5 text-[15px] text-[#27272a]! shadow-[0_4px_18px_#005eff15] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff]"
        >
          Apply
          <span
            aria-hidden="true"
            className="absolute right-1 size-8 rounded-full border border-white/80 bg-linear-to-br from-[#005eff] to-[#001ea2] shadow-[0_0_18px_#005eff70] transition-transform group-hover:scale-110 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </section>
  );
}

export default function GlobalPage() {
  const reduced = useReducedMotion() ?? false;
  const [activeSector, setActiveSector] = useState<SectorFilter>("All Sector");

  return (
    <main
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] w-full bg-black overflow-x-clip [font-family:var(--font-sf-pro),sans-serif]"
    >
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        className="
          box-content! pt-[var(--site-header-height,97px)] relative min-h-[100svh] w-full overflow-hidden
          lg:h-[109svh] lg:min-h-[calc(85svh+255px)]
         max-xl:min-h-0! max-xl:h-auto! max-xl:bg-[#001b29]"
      >
        <Image
          src="/global/global-hero.webp"
          alt="Global export and distribution network"
          fill
          priority
          unoptimized
          sizes="100vw"
          draggable={false}
          className="
            pointer-events-none select-none object-cover
            object-[62%_34%] lg:object-[50%_22%]
            lg:[transform:translateX(5vw)_scale(1.12)]
           max-xl:h-[calc(510px+var(--site-header-height,97px))]! max-xl:bottom-auto! max-xl:object-[78%_top]! max-xl:transform-none! sm:max-xl:h-[calc(650px+var(--site-header-height,97px))]!"
        />

        <div
          className="
            relative z-10 mx-auto w-full max-w-[1920px]
            px-[6%] pb-[50px] lg:h-full lg:px-0 lg:pb-0
           max-xl:px-3! max-xl:pb-0!"
        >
          <div
            className="
              relative w-full pt-[190px]
              lg:absolute lg:left-[7.986111%]
              lg:top-[18.359375%] lg:w-[85%] lg:pt-0
             max-xl:relative! max-xl:left-auto! max-xl:top-auto! max-xl:flex max-xl:w-full! max-xl:flex-col max-xl:px-5 max-xl:pt-6! sm:max-xl:px-10 sm:max-xl:pt-10!"
          >
            {/* HERO TITLE */}
            <GlobalRouteHeading
              className="
                m-0 w-full min-h-[clamp(84px,16.6668vw,320px)]
                text-[clamp(28px,5.208333vw,100px)] lg:w-[52.5vw]
               max-xl:order-1 max-xl:min-h-0! max-xl:w-full! max-xl:text-[clamp(27px,7.2vw,36px)]! sm:max-xl:text-[48px]!"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 350,
                fontStyle: "normal",
                lineHeight: "100%",
                letterSpacing: "-0.04em",
                color: "#F7F7F7",
                fontStretch: "125%",
                fontVariationSettings: '"wght" 350, "wdth" 125',
                fontOpticalSizing: "auto",
              }}
            />

            {/* HERO DESCRIPTION */}
            <motion.p
              {...entrance("up", 0.28, reduced, 0.2, 26)}
              className="
                ml-[0.347222vw] mt-[2.83203125svh]
                w-[90%] text-[clamp(13px,0.9375vw,18px)]
                lg:w-[33.194444vw]
               max-xl:order-3 max-xl:ml-0! max-xl:mt-8! max-xl:w-full! max-xl:max-w-[530px] max-xl:text-[14px]! max-xl:leading-[1.08]! sm:max-xl:mt-10! sm:max-xl:text-[17px]!"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 300,
                fontStyle: "normal",
                lineHeight: "100%",
                letterSpacing: "-0.04em",
                color: "#F7F7F7",
                fontStretch: "125%",
                fontVariationSettings: '"wght" 300, "wdth" 125',
                fontOpticalSizing: "auto",
              }}
            >
              Leveraging our comprehensive in-house foundry and hydraulic
              engineering heritage since 1972—from our milestone first export to
              the USA in 1997—SEMPA delivers heavy-duty pump solutions for
              municipal water, heavy industries, agricultural irrigation, and
              NFPA 20 fire protection across 100+ countries worldwide.
            </motion.p>

            {/* GLOBAL INFO BADGE */}
            <div
              className="
                ml-[0.347222vw] mt-[6.6svh]
                flex min-h-[63.23px] w-[364px] max-w-full
                items-center gap-[16px] rounded-[10.67px]
                border-[0.25px] border-white/20 bg-white/15
                px-[21.33px] py-[9.33px]
                shadow-[0_29.33px_38.53px_0_rgba(0,94,255,0.20)]
                backdrop-blur-[6.53px]
               max-xl:order-2 max-xl:ml-6! max-xl:mt-[150px]! max-xl:min-h-0! max-xl:w-[250px]! max-xl:gap-2! max-xl:px-3! max-xl:py-2! sm:max-xl:mt-[210px]! sm:max-xl:ml-[36%]!"
            >
              <div className="relative h-[43.89px] w-[46.33px] shrink-0 max-xl:h-8! max-xl:w-8!">
                <Image
                  src="/global/hero-icon.png"
                  alt="Global distribution"
                  fill
                  unoptimized
                  sizes="46px"
                  draggable={false}
                  className="pointer-events-none select-none object-contain"
                />
              </div>
              <p
                className="m-0 min-w-0 flex-1 text-[clamp(12px,0.833333vw,16px)] max-xl:text-[10px]!"
                style={{
                  fontFamily: "var(--font-sf-pro)",
                  fontWeight: 410,
                  fontStyle: "normal",
                  lineHeight: "112%",
                  letterSpacing: "-0.04em",
                  color: "#9EB7D0",
                  fontStretch: "125%",
                  fontVariationSettings: '"wght" 410, "wdth" 125',
                  fontOpticalSizing: "auto",
                }}
              >
                100+ COUNTRIES ACROSS
                <span className="block">5 CONTINENTS</span>
              </p>
            </div>
          </div>

          <ExportStatisticsCards />
        </div>
      </section>

      {/* =====================================================
          INTERNATIONAL CASE STUDIES
      ===================================================== */}
      <section
        className="relative isolate min-h-[100svh] w-full"
        style={{
          backgroundImage: globalLightBackground,
        }}
        aria-labelledby="international-case-studies-title"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 pt-[84px] lg:px-0 lg:pt-[16.2svh] max-xl:px-4! max-xl:pt-14!">
          <motion.h2
            {...entrance("up", 0, reduced, 0.2, 45)}
            id="international-case-studies-title"
            className="mx-auto w-full max-w-[856px] text-center text-[clamp(34px,3.125vw,60px)] max-xl:max-w-[320px]! max-xl:text-[29px]! sm:max-xl:max-w-[600px]! sm:max-xl:text-[40px]!"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontWeight: 350,
              fontStyle: "normal",
              fontStretch: "125%",
              fontVariationSettings: '"wght" 350, "wdth" 125',
              fontOpticalSizing: "auto",
              lineHeight: "100%",
              letterSpacing: "-0.04em",
              color: "#0D5792",
            }}
          >
            International Case Studies
          </motion.h2>

          {/* SEARCH + SECTOR FILTERS */}
          <motion.div
            {...entrance("up", 0.08, reduced, 0.17, 27)}
            className={`${caseContentWidth} mt-[42px] flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[20px] lg:mt-[62px] max-xl:mt-12! max-xl:flex-col! max-xl:items-stretch! max-xl:gap-8! max-xl:w-full! sm:max-xl:mt-10!`}
          >
            {/* SEARCH BAR */}
            <div
              role="search"
              className="
                relative flex h-[43px] w-[279px] max-w-full
                shrink-0 items-center gap-[10px] rounded-[24px]
                border-[0.5px] border-white/90
                bg-[linear-gradient(180deg,rgba(209,222,233,0.86)_0%,rgba(222,232,240,0.86)_100%)]
                py-[9px] pl-[22px] pr-[18px]
                shadow-[0_4px_23px_rgba(0,94,255,0.15),inset_0_1px_0_rgba(255,255,255,0.45)]
                backdrop-blur-[8px] lg:h-[57px] lg:w-[372px]
               max-xl:h-11! max-xl:w-full! max-xl:bg-white/20! sm:max-xl:max-w-[520px]! sm:max-xl:self-center"
            >
              <input
                type="search"
                name="case-study-search"
                aria-label="Search international case studies"
                placeholder="Search countries, sectors, certs..."
                autoComplete="off"
                className="
                  h-full min-w-0 flex-1 appearance-none
                  bg-transparent p-0 text-[#0D5792] outline-none
                  placeholder:text-[#9EB7D0]
                  [&::-webkit-search-cancel-button]:hidden
                  [&::-webkit-search-decoration]:hidden
                "
                style={{
                  fontFamily: "var(--font-sf-pro)",
                  fontWeight: 350,
                  fontStyle: "normal",
                  fontSize: "12px",
                  lineHeight: "112%",
                  letterSpacing: "-0.04em",
                  fontStretch: "125%",
                  fontVariationSettings: '"wght" 350, "wdth" 125',
                  fontOpticalSizing: "auto",
                }}
              />
              <Image
                src="/global/search.png"
                alt=""
                width={24}
                height={24}
                draggable={false}
                className="pointer-events-none h-[24px] w-[24px] shrink-0 select-none object-contain"
              />
            </div>

            {/* FILTER BY SECTOR */}
            <div
              role="group"
              aria-label="Filter case studies by sector"
              className="
                flex min-w-0 max-w-full items-center gap-[40px]
                overflow-x-auto whitespace-nowrap
                [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
               max-xl:flex-col! max-xl:items-start! max-xl:gap-5! max-xl:overflow-visible! max-xl:whitespace-normal! max-sm:px-[calc(7.5vw-16px)] max-sm:gap-[clamp(28px,7vw,40px)]!"
            >
              <div className="flex shrink-0 items-center gap-[10px]">
                <Image
                  src="/global/filter.png"
                  alt=""
                  width={24}
                  height={24}
                  draggable={false}
                  className="pointer-events-none h-[24px] w-[24px] select-none object-contain"
                />
                <span
                  className="whitespace-nowrap text-[13px] text-[#24272B] max-sm:text-[clamp(14px,3.5vw,20px)]"
                  style={{
                    fontFamily: "var(--font-sf-pro)",
                    fontWeight: 410,
                    fontVariationSettings: '"wght" 410, "wdth" 125',
                    lineHeight: "112%",
                    letterSpacing: "-0.04em",
                  }}
                >
                  Filter by Sector
                </span>
              </div>

              {/* FILTER BUTTONS */}
              <div className="flex w-max shrink-0 items-center gap-[9px] max-xl:w-full! max-xl:flex-wrap! max-xl:gap-2! max-sm:gap-x-[2%]! max-sm:gap-y-[clamp(6px,1.75vw,10px)]! max-sm:[&>button:nth-child(1)]:basis-[28.3%] max-sm:[&>button:nth-child(2)]:basis-[27%] max-sm:[&>button:nth-child(3)]:basis-[40.7%] max-sm:[&>button:nth-child(4)]:basis-[53%] max-sm:[&>button:nth-child(5)]:basis-[45%] max-sm:[&>button:nth-child(6)]:basis-[32.5%]">
                {sectorFilters.map((sector) => {
                  const isActive = activeSector === sector;
                  return (
                    <button
                      key={sector}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveSector(sector)}
                      className={`
                        inline-flex h-[28px] w-max min-w-max shrink-0
                        cursor-pointer items-center justify-center whitespace-nowrap
                        rounded-[8px] border px-[8px] py-0
                        transition-[background-color,border-color,color]
                        duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                        focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-[#0D5792]
                        ${
                          isActive
                            ? "border-transparent bg-[#27272A] text-[#F7F7F7]"
                            : "border-[#9EB7D0] bg-white/20 text-[#9EB7D0] backdrop-blur-[12.9px] hover:bg-white/30"
                        }
                       max-xl:h-7! max-xl:min-w-0! max-xl:rounded-md! max-xl:px-3! max-xl:text-[11px]! sm:max-xl:text-[13px]! max-sm:px-0! max-sm:h-[clamp(28px,6.67vw,38px)]! max-sm:rounded-[clamp(6px,1.93vw,11px)]! max-sm:text-[clamp(12px,3.5vw,20px)]! max-sm:font-[410]! max-sm:[font-variation-settings:'wght'_410,'wdth'_125]!`}
                      style={{
                        fontFamily: "var(--font-sf-pro)",
                        fontSize: "13px",
                        fontWeight: 350,
                        fontStyle: "normal",
                        fontStretch: "125%",
                        fontVariationSettings: '"wght" 350, "wdth" 125',
                        fontOpticalSizing: "auto",
                        lineHeight: "112%",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {sector}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <CaseStudiesGrid />
        </div>
      </section>

      <GlobalPartnershipSection />
      <StrategicExportCorridorsSection />

      {/*
        GLOBAL PAGE ONLY — SEAMLESS BACKGROUND TRANSITION

        The same gradient layer now spans BOTH sides of the section edge:
        120px over Strategic Export Corridors + 180px over SempaGlobal.
        It fades in before the edge, stays fully opaque across the edge,
        then fades out. This removes the visible horizontal color seam.
        SempaGlobal.tsx and its own animations remain untouched.
      */}
      <div className="relative isolate">
        <div className="hidden xl:block">
          <SempaGlobal assetBase="/global" />
        </div>
        <CompactGlobalImpact />

        <div
          aria-hidden="true"
          className="hidden xl:block pointer-events-none absolute inset-x-0 top-[-120px] z-20 h-[300px]"
          style={{
            backgroundImage: globalLightBackground,
            maskImage:
              "linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.45) 13%,black 31%,black 47%,rgba(0,0,0,0.55) 72%,transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.45) 13%,black 31%,black 47%,rgba(0,0,0,0.55) 72%,transparent 100%)",
          }}
        />

        {/*
          CROSSFADE INTO GLOBAL PARTNERSHIP DESK
          Scoped to GlobalPage.tsx: fade the existing component
          background into the same gradient as the form section.
          Both sides now meet at exactly the same colors.
        */}
        <div
          aria-hidden="true"
          className="hidden xl:block pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[clamp(180px,16vw,300px)]"
          style={{
            backgroundImage: inquirySeamlessBackground,
            maskImage:
              "linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.15) 28%,rgba(0,0,0,0.55) 62%,rgba(0,0,0,0.9) 86%,black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.15) 28%,rgba(0,0,0,0.55) 62%,rgba(0,0,0,0.9) 86%,black 100%)",
          }}
        />
      </div>

      {/* Next section: Global Partnership Desk / export inquiry form */}
      <GlobalPartnershipInquirySection />
    </main>
  );
}
