"use client";

import {
  useRef as useMobileSnapRailtsx_Ref,
  useState as useMobileSnapRailtsx_State,
  type ReactNode as MobileSnapRailtsx_ReactNode,
  useId,
} from "react";

import GreenPumpHerotsx_Image from "next/image";

import { useRef as useGreenPumpHerotsx_Ref } from "react";

import useGreenPumpHerotsx_ViewportVideo from "@/components/media/useViewportVideo";

import GreenPumpLinktsx_Link from "next/link";

import { FiArrowDownRight as GreenPumpLinktsx_FiArrowDownRight } from "react-icons/fi";

import { useState as useCarbonFootprintSectiontsx_State } from "react";

import { FiArrowDownRight as CarbonFootprintSectiontsx_FiArrowDownRight } from "react-icons/fi";

import {
  useEffect as useSustainableManufacturingtsx_Effect,
  useRef as useSustainableManufacturingtsx_Ref,
  useState as useSustainableManufacturingtsx_State,
} from "react";

import useSustainableManufacturingtsx_ViewportVideo from "@/components/media/useViewportVideo";

import {
  useEffect as useManufacturingBenefitsCarouseltsx_Effect,
  useRef as useManufacturingBenefitsCarouseltsx_Ref,
  useState as useManufacturingBenefitsCarouseltsx_State,
  type KeyboardEvent as ManufacturingBenefitsCarouseltsx_KeyboardEvent,
  type PointerEvent as ManufacturingBenefitsCarouseltsx_PointerEvent,
} from "react";

import {
  FiArrowLeft as ManufacturingBenefitsCarouseltsx_FiArrowLeft,
  FiArrowRight as ManufacturingBenefitsCarouseltsx_FiArrowRight,
  FiArrowUpRight as ManufacturingBenefitsCarouseltsx_FiArrowUpRight,
  FiArrowDownRight as ManufacturingBenefitsCarouseltsx_FiArrowDownRight,
} from "react-icons/fi";

import { useRef as useApproachAndProductstsx_Ref } from "react";

import useApproachAndProductstsx_ViewportVideo from "@/components/media/useViewportVideo";

import Image from "next/image";

import type { CSSProperties } from "react";

import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Fragment, useRef } from "react";

// About Us-inspired entrances: viewport-local, replayable and layout-safe.
type GreenRevealDirection = "up" | "left" | "right";
const greenMotionEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
const greenRevealVariants: Variants = {
  hidden: ({
    direction,
    reduced,
  }: {
    direction: GreenRevealDirection;
    reduced: boolean;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -32
        : direction === "right"
          ? 32
          : 0,
    y: reduced ? 0 : direction === "up" ? 32 : 0,
  }),
  visible: { opacity: 1, x: 0, y: 0 },
};

function greenReveal(
  direction: GreenRevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.18,
) {
  return {
    variants: greenRevealVariants,
    custom: { direction, reduced },
    initial: reduced ? (false as const) : ("hidden" as const),
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.85,
      delay: reduced ? 0 : delay,
      ease: greenMotionEase,
    },
  };
}

function greenHeroEnter(reduced: boolean, delay: number, y = 24) {
  return {
    initial: reduced ? false : { opacity: 0, y, filter: "blur(7px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 0.95,
      delay: reduced ? 0 : delay,
      ease: greenMotionEase,
    },
  };
}

// Her 3-4 harf, kaydırma ilerledikçe açık griden özgün rengine döner.
// Sözcüklerin doğal satır kırılımını bozmamak için gruplar kelime içinde oluşturulur.
const GREEN_PUMP_OUTRO_PARTS = [
  {
    text: "Green Pump: It's the step we're taking toward a future with less energy consumption,",
    color: "#27272a",
  },
  {
    text: "lower carbon emissions, and greater efficiency.",
    color: "#2c7e4e",
  },
] as const;

const GREEN_PUMP_OUTRO_WORDS = GREEN_PUMP_OUTRO_PARTS.flatMap((part) =>
  part.text.split(" ").map((word) => ({
    chunks: Array.from({ length: Math.ceil(word.length / 4) }, (_, index) =>
      word.slice(index * 4, index * 4 + 4),
    ),
    color: part.color,
  })),
);

const GREEN_PUMP_OUTRO_CHUNKS = GREEN_PUMP_OUTRO_WORDS.reduce(
  (total, word) => total + word.chunks.length,
  0,
);

function GreenPumpOutroChunk({
  text,
  color,
  index,
  progress,
}: {
  text: string;
  color: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = (index / GREEN_PUMP_OUTRO_CHUNKS) * 0.94;
  const end = Math.min(1, start + 0.12);
  const animatedColor = useTransform(
    progress,
    [start, end],
    ["#c9cfc9", color],
  );

  return <motion.span style={{ color: animatedColor }}>{text}</motion.span>;
}

function GreenPumpOutroText() {
  const headingRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.9", "end 0.38"],
  });

  let chunkIndex = 0;

  return (
    <p
      ref={headingRef}
      aria-label={GREEN_PUMP_OUTRO_PARTS.map((part) => part.text).join(" ")}
      className="mx-auto max-w-[920px] pt-16 pb-28 text-center text-[clamp(32px,10.7vw,46px)] leading-[1.08] [font-weight:500] [font-variation-settings:'wght'_500,'wdth'_125] md:pt-32 md:pb-40 md:text-[clamp(36px,3.5vw,48px)]"
    >
      {reduced ? (
        <>
          {GREEN_PUMP_OUTRO_PARTS.map((part, index) => (
            <span key={part.color} style={{ color: part.color }}>
              {index > 0 ? " " : ""}
              {part.text}
            </span>
          ))}
        </>
      ) : (
        GREEN_PUMP_OUTRO_WORDS.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            {wordIndex > 0 ? " " : null}
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {word.chunks.map((chunk) => (
                <GreenPumpOutroChunk
                  key={chunkIndex}
                  text={chunk}
                  color={word.color}
                  index={chunkIndex++}
                  progress={scrollYProgress}
                />
              ))}
            </span>
          </Fragment>
        ))
      )}
    </p>
  );
}

function MobileSnapRailtsx_MobileSnapRail({
  children,
  label,
  count,
  desktopClassName,
}: {
  children: MobileSnapRailtsx_ReactNode;

  label: string;

  count: number;

  desktopClassName: string;
}) {
  const rail = useMobileSnapRailtsx_Ref<HTMLDivElement>(null);

  const [active, setActive] = useMobileSnapRailtsx_State(0);

  function updateActive() {
    const element = rail.current;

    if (!element) return;

    const start = element.getBoundingClientRect().left;

    const maximum = element.scrollWidth - element.clientWidth;

    const distances = [...element.children].map((child) =>
      Math.abs(
        element.scrollLeft -
          Math.min(
            maximum,
            child.getBoundingClientRect().left - start + element.scrollLeft,
          ),
      ),
    );

    setActive(distances.indexOf(Math.min(...distances)));
  }

  return (
    <div className="min-w-0">
      <div
        ref={rail}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateActive}
        className={`flex max-w-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] after:block after:w-[max(0px,calc(100%_-_var(--rail-card-width)))] after:shrink-0 after:content-[''] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-[#2c7e4e] md:overflow-visible md:pb-0 md:after:hidden ${desktopClassName}`}
      >
        {children}
      </div>

      <div
        className="mt-5 flex justify-center gap-1.5 md:hidden"
        aria-label={`${label} navigation`}
      >
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show card ${index + 1}`}
            aria-pressed={active === index}
            onClick={() => {
              const element = rail.current;

              const child = element?.children[index];

              if (element && child)
                element.scrollBy({
                  left:
                    child.getBoundingClientRect().left -
                    element.getBoundingClientRect().left,
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                });
            }}
            className="flex h-8 min-w-5 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#2c7e4e]"
          >
            <span
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${active === index ? "w-7 bg-[#a5c843]" : "w-2 bg-[#dce4d7]"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const GreenPumpHerotsx_approaches = [
  {
    label: "Human-Centric Green Approach",
    icon: "/green-pump/user.webp",
    position:
      "md:top-[42%] md:left-8 min-[90rem]:left-[max(32px,calc((100%-1080px)/2))]",
    delay: "[animation-delay:80ms]",
  },

  {
    label: "Environment-Centric Green Approach",
    icon: "/green-pump/tree.webp",
    position:
      "md:top-[47%] md:right-8 min-[90rem]:right-[max(32px,calc((100%-1040px)/2))]",
    delay: "[animation-delay:180ms]",
  },

  {
    label: "Production-Centric Green Approach",
    icon: "/green-pump/leaf.webp",
    position: "md:right-1/2 md:translate-x-1/2 md:bottom-[19%]",
    delay: "[animation-delay:280ms]",
  },
];

function GreenLeafWords({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  let character = offset;

  return (
    <>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {Array.from(word, (letter, index) => {
            const seed = character++;

            return (
              <span
                key={index}
                className="green-leaf-letter inline-block"
                style={
                  {
                    "--leaf-delay": `${(seed * 293) % 1450}ms`,
                    "--leaf-turn": `${seed % 2 ? -7 : 7}deg`,
                    "--leaf-shift": `${seed % 2 ? -3 : 3}px`,
                  } as CSSProperties
                }
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </>
  );
}

function GreenPumpHerotsx_GreenPumpHero() {
  const title = useRepeatingTitle(2900);
  const reduced = useReducedMotion() ?? false;

  const video = useGreenPumpHerotsx_Ref<HTMLVideoElement>(null);

  useGreenPumpHerotsx_ViewportVideo(video);

  return (
    <section
      aria-labelledby="green-pump-title"
      className="box-content! pt-[var(--site-header-height,97px)] relative isolate w-full overflow-hidden bg-white pb-6 md:pb-0 md:h-[clamp(740px,63vw,900px)]"
    >
      <div
        className="absolute inset-x-0 top-0 h-[calc(clamp(580px,155vw,760px)+var(--site-header-height,97px))] md:inset-0 md:h-full"
        aria-hidden="true"
      >
        <video
          ref={video}
          data-green-pump-hero-video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/green-pump/green-pump-hero-poster.webp"
          className="absolute inset-0 h-full w-full object-cover object-center"
          tabIndex={-1}
        >
          <source
            src="/green-pump/green-pump-hero-pingpong.webm"
            type="video/webm"
          />
        </video>
      </div>

      <motion.h1
        {...greenHeroEnter(reduced, 0.12, 18)}
        ref={title}
        aria-label="A MORE EFFICIENT PUMP, A MORE SUSTAINABLE FUTURE"
        id="green-pump-title"
        className="relative z-10 mx-auto max-w-[300px] px-4 pt-10 text-center text-[clamp(24px,6.4vw,28px)] md:absolute md:inset-x-5 md:max-w-[760px] md:px-0 md:pt-0 leading-[1.12] [font-weight:650] [font-variation-settings:'wght'_650,'wdth'_125] tracking-[-0.04em] text-[#2c7e4e] md:top-[calc(80px+var(--site-header-height,97px))] md:text-[30px]"
      >
        <span aria-hidden="true">
          <GreenLeafWords text="A MORE EFFICIENT PUMP," />
          <br className="hidden md:block" />{" "}
          <GreenLeafWords text="A MORE SUSTAINABLE FUTURE" offset={21} />
        </span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-10 bottom-0 md:top-0"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <svg
              key={index}
              viewBox="0 0 24 40"
              className="green-title-leaf absolute h-[22px] w-[13px] opacity-0"
              style={
                {
                  left: `${4 + index * 8}%`,
                  top: `${(index % 3) * 18}%`,
                  color: ["#608c31", "#98b84f", "#bdad59"][index % 3],
                  "--fall-delay": `${(index * 97) % 950}ms`,
                  "--fall-drift": `${index % 2 ? -28 : 24}px`,
                  "--fall-turn": `${index % 2 ? -110 : 130}deg`,
                } as CSSProperties
              }
            >
              <path
                d="M12 1C-4 10-1 29 11 37C26 27 29 11 12 1Z"
                fill="currentColor"
              />
              <path
                d="M12 5Q8 23 11 39M10 18L4 13M10 25L18 18"
                fill="none"
                stroke="#395e27"
                strokeWidth=".8"
                opacity=".55"
              />
            </svg>
          ))}
        </span>
      </motion.h1>

      <style>{`

        @media (prefers-reduced-motion: no-preference) {

          #green-pump-title[data-title-revealing] .green-leaf-letter {

            animation: green-leaf-reveal 900ms cubic-bezier(.2,.65,.25,1) var(--leaf-delay) both;

          }

          #green-pump-title[data-title-revealing] .green-title-leaf {

            animation: green-title-fall 1900ms ease-in-out var(--fall-delay) both;

          }

        }

        @keyframes green-leaf-reveal {

          0% { opacity: 0; transform: translate(var(--leaf-shift),5px) rotate(var(--leaf-turn)); clip-path: polygon(23% 45%,35% 37%,43% 48%,55% 31%,66% 46%,57% 58%,70% 67%,42% 59%,26% 71%,31% 56%); }

          45% { opacity: .55; clip-path: polygon(0 24%,24% 9%,44% 21%,71% 0,100% 29%,83% 60%,100% 100%,42% 85%,0 100%,14% 53%); }

          100% { opacity: 1; transform: translate(0,0) rotate(0); clip-path: polygon(0 0,24% 0,44% 0,71% 0,100% 0,100% 60%,100% 100%,42% 100%,0 100%,0 53%); }

        }

        @keyframes green-title-fall {

          0% { opacity: 0; transform: translate(0,-26px) rotate(-25deg) scale(.7); }

          15% { opacity: .75; }

          40% { opacity: .8; transform: translate(var(--fall-drift),12px) rotate(30deg) scale(.95); }

          70% { opacity: .5; transform: translate(0,45px) rotate(-15deg) scale(.8); }

          100% { opacity: 0; transform: translate(var(--fall-drift),85px) rotate(var(--fall-turn)) scale(.55); }

        }

      `}</style>

      {/* The film contains the leaf sculpture; the supplied SVG supplies the Green Pump wordmark. */}

      <motion.div
        {...greenHeroEnter(reduced, 0.45, 28)}
        className="relative z-10 mx-auto mt-[clamp(230px,65vw,330px)] w-[min(95%,360px)] md:absolute md:top-[48%] md:left-1/2 md:mt-0 md:w-[344px] md:-translate-x-1/2"
      >
        <GreenPumpHerotsx_Image
          src="/green-pump/green-pump-icon.svg"
          alt="Green Pump by Sempa"
          width={1541}
          height={842}
          sizes="(min-width: 768px) 344px, 200px"
          className="h-auto w-full object-contain"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[430px] h-44 md:top-auto md:bottom-0 md:h-40 bg-linear-to-b from-transparent via-white/60 to-white"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:absolute md:inset-x-0 md:bottom-0 md:block md:h-24 bg-linear-to-b from-white/0 to-white backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent,#000)]"
      />

      <ul
        aria-label="Our green approaches"
        className="relative z-20 mx-auto mt-6 grid max-w-[380px] gap-3 px-5 md:static md:mt-0 md:max-w-none md:px-0"
      >
        {GreenPumpHerotsx_approaches.map(({ label, icon, position }, index) => (
          <li
            key={label}
            className={`z-20 min-w-0 md:absolute md:w-[min(30vw,344px)] ${position}`}
          >
            <motion.div {...greenHeroEnter(reduced, 0.7 + index * 0.14, 22)}>
              <div
                data-green-approach-card
                className="flex min-h-[76px] items-center justify-between gap-4 rounded-[25px] border-[0.5px] md:rounded-[30px] border-[#f7f7f7]/65 bg-[#a5c843]/10 px-5 py-4 text-[15px] leading-[1.12] text-[#27272a] md:bg-white/8 md:text-[#f7f7f7] shadow-[0_7px_25px_#2c7e4e0c] backdrop-blur-[8px] md:backdrop-blur-[10px] transition-[translate,background-color,box-shadow] duration-[350ms] hover:-translate-y-1 hover:bg-white/14 hover:shadow-[0_10px_30px_#2c7e4e18] motion-reduce:translate-none! motion-reduce:transform-none motion-reduce:transition-none md:min-h-[95px] md:px-[25px] md:text-[15px]"
              >
                <span className="max-w-[225px]">{label}</span>

                <span
                  aria-hidden="true"
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#a5c843]/20 text-[#63e535] shadow-[0_0_22px_#a5c84380] md:h-[54px] md:w-[54px]"
                >
                  <GreenPumpHerotsx_Image
                    src={icon}
                    alt=""
                    width={icon.endsWith("heart.webp") ? 235 : 34}
                    height={icon.endsWith("heart.webp") ? 235 : 34}
                    className={
                      icon.endsWith("heart.webp")
                        ? "h-auto w-[44px] max-w-none object-contain"
                        : "h-auto w-[34px] max-w-none object-contain"
                    }
                  />
                </span>
              </div>
            </motion.div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GreenPumpLinktsx_GreenPumpLink({
  href,
  children,
  variant = "forest",
}: {
  href: string;
  children: string;
  variant?: "forest" | "lime";
}) {
  return (
    <GreenPumpLinktsx_Link
      href={href}
      className="green-pump-cta"
      data-variant={variant}
    >
      <span className="green-pump-cta__label">{children}</span>
      <span aria-hidden="true" className="green-pump-cta__orb">
        <GreenPumpLinktsx_FiArrowDownRight
          className="green-pump-cta__arrow"
          strokeWidth={2.8}
        />
      </span>
    </GreenPumpLinktsx_Link>
  );
}

// Referans videodaki çift yönlü hover:
// Renkli kapsül -> açık kapsül; ok sağdan sola kayarken yukarı döner.
const greenPumpCtaStyles = `
  .green-pump-cta {
    --cta-width: 289px;
    --cta-color: #bbd775;
    --cta-orb-bg: #288554;
    --cta-arrow-color: #b9d957;
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    width: min(100%, var(--cta-width));
    height: 44px;
    min-height: 44px;
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: 9999px;
    background: #f7f7fb;
    color: var(--cta-color);
    text-decoration: none;
    font-family: inherit;
    font-size: 15px;
    font-weight: 410;
    line-height: 1.12;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      color 520ms cubic-bezier(.22, 1, .36, 1),
      border-color 520ms cubic-bezier(.22, 1, .36, 1),
      box-shadow 520ms cubic-bezier(.22, 1, .36, 1);
  }

  .green-pump-cta::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(105deg, #2e8354 0%, #08737c 100%);
    opacity: 1;
    transition: opacity 520ms cubic-bezier(.22, 1, .36, 1);
  }

  .green-pump-cta[data-variant="lime"] {
    --cta-width: 251px;
    --cta-color: #27272a;
    --cta-orb-bg: #b7dc60;
    --cta-arrow-color: #27272a;
  }

  .green-pump-cta[data-variant="lime"]::before {
    background: linear-gradient(105deg, #a5ce4d 0%, #94d273 100%);
  }

  .green-pump-cta__label {
    position: relative;
    z-index: 1;
    display: block;
    padding-left: 14px;
    padding-right: 45px;
    white-space: nowrap;
    transform: translate3d(0, 0, 0);
    transition: transform 520ms cubic-bezier(.22, 1, .36, 1);
  }

  .green-pump-cta__orb {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: calc(100% - 36px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--cta-orb-bg);
    color: var(--cta-arrow-color);
    transform: translateY(-50%);
    transition:
      left 520ms cubic-bezier(.22, 1, .36, 1),
      background-color 520ms cubic-bezier(.22, 1, .36, 1);
  }

  .green-pump-cta__arrow {
    display: block;
    width: 19px;
    height: 19px;
    transform: rotate(0deg);
    transition: transform 520ms cubic-bezier(.22, 1, .36, 1);
  }

  .green-pump-cta:is(:hover, :focus-visible) {
    border-color: #dddfea;
    color: #27272a;
    box-shadow: 0 2px 12px rgba(42, 83, 54, .035);
  }

  .green-pump-cta:is(:hover, :focus-visible)::before {
    opacity: 0;
  }

  .green-pump-cta:is(:hover, :focus-visible) .green-pump-cta__label {
    transform: translate3d(35px, 0, 0);
  }

  .green-pump-cta:is(:hover, :focus-visible) .green-pump-cta__orb {
    left: 7px;
  }

  .green-pump-cta:is(:hover, :focus-visible) .green-pump-cta__arrow {
    transform: rotate(-90deg);
  }

  .green-pump-cta:focus-visible {
    outline: 2px solid #2c7e4e;
    outline-offset: 3px;
  }

  /* Inspect / Protocol Details: same hover as both hero CTAs, compact size. */
  /* Detay butonlarının genişliği CTA varyantlarından etkilenmesin. */
  .green-pump-cta.green-pump-cta--detail {
    --cta-width: 80px;
    width: 80px;
    flex: 0 0 80px;
    height: 28px;
    min-height: 28px;
    padding: 0;
    font-size: 10px;
    line-height: 1;
    text-align: left;
  }

  .green-pump-cta.green-pump-cta--protocol {
    --cta-width: 116px;
    width: 116px;
    flex-basis: 116px;
  }

  /* Koyu kartta da varsayılan durum küçük, kontrastlı yeşil kapsül. */
  .green-pump-cta.green-pump-cta--detail[data-variant="lime"] {
    --cta-color: #d4eb64;
    --cta-orb-bg: #13797c;
    --cta-arrow-color: #cae855;
  }

  .green-pump-cta.green-pump-cta--detail[data-variant="lime"]::before {
    background: linear-gradient(105deg, #338958 0%, #08727c 100%);
  }

  .green-pump-cta--detail .green-pump-cta__label {
    padding-left: 9px;
    padding-right: 0;
  }

  .green-pump-cta--detail .green-pump-cta__orb {
    width: 18px;
    height: 18px;
    left: calc(100% - 23px);
  }

  .green-pump-cta--detail .green-pump-cta__arrow {
    width: 14px;
    height: 14px;
  }

  .green-pump-cta--detail:is(:hover, :focus-visible) .green-pump-cta__label {
    transform: translate3d(21px, 0, 0);
  }

  .green-pump-cta--detail:is(:hover, :focus-visible) .green-pump-cta__orb {
    left: 5px;
  }


  @media (prefers-reduced-motion: reduce) {
    .green-pump-cta,
    .green-pump-cta::before,
    .green-pump-cta__label,
    .green-pump-cta__orb,
    .green-pump-cta__arrow {
      transition: none;
    }
  }
`;

const CarbonFootprintSectiontsx_cards = [
  {
    id: "emissions",
    title: "Emission Identification",
    tag: "Scope 1 & 2 Direct Audit",
    kind: "emissions",

    description:
      "Pinpointing the exact sources of Scope 1, 2, and 3 emissions across every department, facility, and supply-chain tier.",

    metric: "GRANULARITY",
    value: "100% Audited",

    details:
      "Scope 1 covers direct emissions from owned or controlled sources. Scope 2 covers purchased energy. Scope 3 covers indirect emissions throughout the value chain, including suppliers and transport.",
  },

  {
    id: "resources",
    title: "Resource Evaluation",
    tag: "ISO 50001 Synergies",
    kind: "resources",

    description:
      "Analyzing and optimizing energy, fuel, and raw material efficiency to eliminate baseline operational waste.",

    metric: "ENERGY EFFICIENCY",
    value: "+18.4% Efficiency",

    details:
      "Resource evaluation connects energy, fuel, and raw-material consumption to an operational baseline. This provides a consistent basis for identifying waste and prioritizing efficiency opportunities.",
  },

  {
    id: "improvement",
    title: "Continuous Improvement",
    tag: "Dynamic Tracking",
    kind: "improvement",

    description:
      "Revealing precise areas for ongoing efficiency improvements and tracking verified year-over-year decarbonization.",

    metric: "GRANULARITY",
    value: "100% Audited",

    details:
      "Year-over-year tracking compares emissions and efficiency using consistent boundaries and reporting periods. Reviewing these indicators helps identify where further operational improvements can be made.",
  },

  {
    id: "future",
    title: "Future Goal Setting",
    tag: "SBTi Aligned",
    kind: "future",

    description:
      "Establishing data-driven, science-based targets (SBTi) to achieve verified net-zero milestones with transparent roadmaps.",

    metric: "NET ZERO TARGET",
    value: "2030 Horizon",

    details:
      "Science-based target setting links a defined emissions baseline to measurable milestones. Transparent roadmaps identify actions, review progress, and guide the next steps toward the stated 2030 horizon.",
  },
] as const;

const CarbonFootprintSectiontsx_cardStyle =
  "min-w-0 rounded-[27px] border-[0.5px] border-[#dce9d4]/65 " +
  "transition-[border-color,background-color,transform] duration-[350ms] " +
  "hover:border-[#b7cfad] motion-reduce:transition-none";

function CarbonFootprintSectiontsx_DetailButton({
  label,
  expanded,
  panelId,
  onClick,
  dark = false,
}: {
  label: "Inspect" | "Protocol Details";
  expanded: boolean;
  panelId: string;
  onClick: () => void;
  dark?: boolean;
}) {
  const protocol = label === "Protocol Details";

  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={panelId}
      onClick={onClick}
      className={`green-pump-cta green-pump-cta--detail ${protocol ? "green-pump-cta--protocol" : "green-pump-cta--inspect"}`}
      data-variant={dark ? "lime" : "forest"}
    >
      <span className="green-pump-cta__label">{label}</span>
      <span aria-hidden="true" className="green-pump-cta__orb">
        <CarbonFootprintSectiontsx_FiArrowDownRight
          className="green-pump-cta__arrow"
          strokeWidth={2.8}
        />
      </span>
    </button>
  );
}

function CarbonFootprintSectiontsx_CertificateBadge({
  audited = false,
}: {
  audited?: boolean;
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-[7px] bg-[#f7f7f7] px-[7px] py-[3px] text-[11px] leading-[1.12] text-[#9eb7d0] ${audited ? "min-h-[29px] w-[253px]" : "min-h-[29px] w-[242px]"}`}
    >
      <Image
        src={
          audited
            ? "/green-pump/green-secure.png"
            : "/green-pump/verify-green.png"
        }
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className="size-6 shrink-0 object-contain"
      />
      {audited
        ? "Audited GHG Protocol standard"
        : "Verified Governance Standard"}
    </span>
  );
}

// Source width / height are the real WebP dimensions (not square placeholders).
// displayWidth is adjusted for how large the *visible* icon appears.
const carbonCardIcons = {
  emissions: {
    src: "/green-pump/co2.webp",
    width: 96,
    height: 96,
    displayWidth: 24,
  },
  resources: {
    src: "/green-pump/battery.webp",
    width: 39,
    height: 68,
    displayWidth: 16,
  },
  improvement: {
    src: "/green-pump/dynamic.webp",
    width: 96,
    height: 96,
    displayWidth: 29,
  },
  future: {
    src: "/green-pump/goal.webp",
    width: 96,
    height: 96,
    displayWidth: 29,
  },
} as const;

function CarbonFootprintSectiontsx_CardIcon({
  kind,
}: {
  kind: (typeof CarbonFootprintSectiontsx_cards)[number]["kind"];
}) {
  const icon = carbonCardIcons[kind];
  return (
    <span className="flex h-[30px] w-[27px] shrink-0 items-center justify-center">
      <Image
        src={icon.src}
        alt=""
        aria-hidden="true"
        width={icon.width}
        height={icon.height}
        style={{ width: icon.displayWidth, height: "auto" }}
        className="max-w-none shrink-0 object-contain"
      />
    </span>
  );
}

function CarbonFootprintSectiontsx_CarbonFootprintSection() {
  const [expanded, setExpanded] = useCarbonFootprintSectiontsx_State<
    Record<string, boolean>
  >({});
  const reduced = useReducedMotion() ?? false;
  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section
      aria-labelledby="carbon-footprint-title"
      className="bg-[radial-gradient(ellipse_at_50%_40%,#d0efa92e,transparent_65%),linear-gradient(to_bottom,#fff_0%,#fafff6_50%,#fff_100%)] px-5 pt-10 pb-12 md:px-10 md:pt-9 md:pb-32"
    >
      <div className="mx-auto grid max-w-[1200px] items-stretch gap-4 lg:grid-cols-[minmax(0,563fr)_minmax(0,621fr)]">
        {/* Left information panel: spacing follows the supplied reference screenshot. */}
        <motion.article
          {...greenReveal("left", 0, reduced, 0.12)}
          aria-labelledby="carbon-footprint-title"
          className="flex min-h-[780px] min-w-0 flex-col rounded-[27px] bg-[#a5c843] p-6 text-[#27272a] md:min-h-[703px]"
        >
          <div className="flex min-h-[45px] w-[301px] max-w-full items-center gap-3 rounded-[15px] bg-[#f7f7f7]/90 px-4 py-[8px] text-[13px] leading-[1.12] text-[#2c7e4e]">
            <Image
              src="/green-pump/green-ball.png"
              alt=""
              aria-hidden="true"
              width={108}
              height={108}
              className="h-auto w-8 shrink-0 object-contain"
            />
            <span className="min-w-0 flex-1">ISO 14064-1:2018 Certified</span>
            <Image
              src="/green-pump/info.webp"
              alt=""
              aria-hidden="true"
              width={80}
              height={80}
              className="h-auto w-[21px] shrink-0 object-contain"
            />
          </div>

          <h2
            id="carbon-footprint-title"
            className="mt-[39px] max-w-[470px] text-[22px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]"
          >
            Measuring Our Carbon Footprint, Planning Our Future.
          </h2>

          <p className="mt-[57px] max-w-[445px] text-[15px] leading-[1.08] text-[#2c7e4e]">
            A crucial step in our sustainability journey is the measurement and
            monitoring of greenhouse gas emissions. By systematically tracking
            our direct and indirect carbon output across all operational scopes,
            we transform environmental metrics into decisive strategic insights.
          </p>

          <p className="mt-[77px] max-w-[390px] text-[12px] leading-[1.12] text-[#2c7e4e]">
            For us, calculating our carbon footprint is not merely a reporting
            exercise; it is a critical management tool.
          </p>

          <div className="mt-[17px]">
            <CarbonFootprintSectiontsx_CertificateBadge />
          </div>

          <div className="mt-auto pt-9 md:pb-[47px]">
            <h3 className="text-[12px] leading-none [font-weight:410]">
              OPERATIONAL MANTRA
            </h3>
            <ol className="mt-[10px] grid max-w-[436px] grid-cols-1 gap-[10px] sm:grid-cols-3">
              {["WE MEASURE", "WE MONITOR", "WE IMPROVE"].map(
                (mantra, index) => (
                  <motion.li
                    {...greenReveal("up", 0.1 + index * 0.08, reduced, 0.2)}
                    key={mantra}
                    className="flex min-h-[63px] flex-col justify-between gap-2 rounded-[15px] border border-white/60 bg-[#f7f7f7] p-[8px]"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] leading-none text-[#2c7e4e]">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Image
                        src="/green-pump/green-ball.png"
                        alt=""
                        aria-hidden="true"
                        width={12}
                        height={12}
                        className="size-3 shrink-0 object-contain"
                      />
                    </div>
                    <p className="text-[14px] leading-[1.12]">{mantra}</p>
                  </motion.li>
                ),
              )}
            </ol>

            <div className="mt-[10px] flex max-w-[436px] flex-wrap items-center justify-between gap-2">
              <CarbonFootprintSectiontsx_CertificateBadge audited />
              <CarbonFootprintSectiontsx_DetailButton
                label="Protocol Details"
                panelId="green-protocol-details"
                expanded={Boolean(expanded.protocol)}
                onClick={() => toggle("protocol")}
              />
            </div>
            <div
              id="green-protocol-details"
              role="region"
              aria-labelledby="green-protocol-heading"
              hidden={!expanded.protocol}
              className="mt-4 rounded-xl border border-white/60 bg-white/35 p-4 text-[12px] leading-[1.35] text-[#194f30]"
            >
              <h4 id="green-protocol-heading" className="mb-2 font-[540]">
                GHG Protocol reporting scopes
              </h4>
              <p>
                The GHG Protocol distinguishes direct emissions (Scope 1),
                purchased energy (Scope 2), and other value-chain emissions
                (Scope 3). Consistent reporting boundaries, activity data, and
                emission factors support measurement, monitoring, and
                improvement over time.
              </p>
            </div>
          </div>
        </motion.article>

        {/* Right cards: two compact vertical cards, then two flatter horizontal cards. */}
        <MobileSnapRailtsx_MobileSnapRail
          label="Carbon footprint insights"
          count={4}
          desktopClassName="[--rail-card-width:min(80vw,330px)] md:grid md:grid-cols-2 md:gap-[14px] lg:grid-rows-[271px_202px_201px]"
        >
          {CarbonFootprintSectiontsx_cards.map((card, index) => {
            const dark = card.kind === "resources";
            const wide = card.kind === "improvement" || card.kind === "future";
            const panelId = `green-${card.id}-details`;

            const metrics = (
              <div className={dark ? "text-[#d8e75b]" : "text-[#2c7e4e]"}>
                <p
                  className={`text-[10px] leading-[1.12] ${dark ? "text-[#d5e353]" : "text-[#9eb7d0]"}`}
                >
                  {card.metric}
                </p>
                <p
                  className={`mt-[3px] text-[12px] leading-[1.12] ${dark ? "text-white" : "text-[#27272a]"}`}
                >
                  {card.value}
                </p>
              </div>
            );

            return (
              <motion.article
                {...greenReveal(
                  index % 2 ? "right" : "up",
                  0.08 + index * 0.07,
                  reduced,
                  0.12,
                )}
                key={card.id}
                aria-labelledby={`green-${card.id}-title`}
                className={`${CarbonFootprintSectiontsx_cardStyle} w-[min(80vw,330px)] shrink-0 snap-start px-[25px] py-[26px] md:w-auto md:px-[26px] ${wide ? "min-h-[201px] md:col-span-2 md:min-h-0" : "min-h-[270px] md:min-h-0"} ${dark ? "border-[#2c7e4e] bg-[#2c7e4e] text-white hover:bg-[#2e8050]" : "bg-white/25 text-[#27272a] backdrop-blur-xl hover:bg-white/35"}`}
              >
                <div className="flex h-full min-w-0 flex-col">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div
                      className={`flex min-h-[24px] min-w-0 items-center gap-[10px] text-[10px] leading-[1.12] ${dark ? "text-[#c8db5c]" : "text-[#9eb7d0]"}`}
                    >
                      <CarbonFootprintSectiontsx_CardIcon kind={card.kind} />
                      <span
                        className={
                          card.kind === "future"
                            ? "rounded-[5px] bg-white/60 px-[5px] py-[3px]"
                            : ""
                        }
                      >
                        {card.tag}
                      </span>
                    </div>
                    {wide && (
                      <div className="hidden shrink-0 items-start gap-[45px] md:flex">
                        <div className="w-[108px]">{metrics}</div>
                        <CarbonFootprintSectiontsx_DetailButton
                          label="Inspect"
                          panelId={panelId}
                          expanded={Boolean(expanded[card.id])}
                          onClick={() => toggle(card.id)}
                          dark={dark}
                        />
                      </div>
                    )}
                  </div>

                  <h3
                    id={`green-${card.id}-title`}
                    className={`${wide ? "mt-[28px] max-w-[450px]" : "mt-[22px] max-w-[190px]"} text-[20px] leading-[1.12] [font-weight:410] ${dark ? "text-[#bbd64d]" : "text-[#2c7e4e]"}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`mt-[16px] text-[12px] leading-[1.12] ${wide ? "max-w-[395px]" : "max-w-full"}`}
                  >
                    {card.description}
                  </p>

                  {!wide && (
                    <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                      {metrics}
                      <CarbonFootprintSectiontsx_DetailButton
                        label="Inspect"
                        panelId={panelId}
                        expanded={Boolean(expanded[card.id])}
                        onClick={() => toggle(card.id)}
                        dark={dark}
                      />
                    </div>
                  )}
                  {wide && (
                    <div className="mt-auto flex items-end justify-between gap-3 pt-4 md:hidden">
                      {metrics}
                      <CarbonFootprintSectiontsx_DetailButton
                        label="Inspect"
                        panelId={panelId}
                        expanded={Boolean(expanded[card.id])}
                        onClick={() => toggle(card.id)}
                      />
                    </div>
                  )}

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`green-${card.id}-title`}
                    hidden={!expanded[card.id]}
                    className={`mt-4 rounded-xl border p-4 text-[12px] leading-[1.35] ${dark ? "border-white/20 bg-white/10" : "border-[#dce9d4] bg-white/60"}`}
                  >
                    {card.details}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </MobileSnapRailtsx_MobileSnapRail>
      </div>
    </section>
  );
}

const SustainableManufacturingtsx_metrics = [
  {
    label: "Efficiency Standard",
    value: "IE4 / IE5",
    icon: "/green-pump/standard.webp",
    iconWidth: 108,
    iconHeight: 108,
    displayWidth: 36,
    position:
      "top-[25%] left-1/2 -translate-x-1/2 md:translate-x-0 md:top-[32%] md:left-0",
    duration: 4600,
    delay: -1200,
  },

  {
    label: "Recyclability",
    value: "%97",
    icon: "/green-pump/recycle.webp",
    iconWidth: 120,
    iconHeight: 113,
    displayWidth: 36,
    position:
      "top-0 left-1/2 -translate-x-1/2 md:top-[37%] md:left-auto md:right-0 md:translate-x-0",
    duration: 5400,
    delay: -3600,
  },

  {
    label: "Service Life",
    value: "25 Year",
    icon: "/green-pump/heart.webp",
    iconWidth: 235,
    iconHeight: 235,
    displayWidth: 60,
    position: "bottom-0 left-1/2 -translate-x-1/2 md:bottom-10",
    duration: 6100,
    delay: -2100,
  },
];

function SustainableManufacturingtsx_SustainableManufacturing() {
  const section = useSustainableManufacturingtsx_Ref<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const video = useSustainableManufacturingtsx_Ref<HTMLVideoElement>(null);

  const [failed, setFailed] = useSustainableManufacturingtsx_State(false);

  useSustainableManufacturingtsx_ViewportVideo(video);

  useSustainableManufacturingtsx_Effect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    let animations: Animation[] = [];

    let visible = false;

    const syncAnimations = () =>
      animations.forEach((animation) => {
        if (visible && !document.hidden && !preference.matches)
          animation.play();
        else animation.pause();
      });

    function updateMotion() {
      animations.forEach((animation) => animation.cancel());

      animations = [];

      if (!preference.matches) {
        section.current
          ?.querySelectorAll<HTMLElement>("[data-manufacturing-float]")
          .forEach((element, index) => {
            animations.push(
              element.animate(
                [
                  { transform: "translateY(0px)" },
                  { transform: "translateY(-5px)" },
                ],
                {
                  duration: SustainableManufacturingtsx_metrics[index].duration,
                  delay: SustainableManufacturingtsx_metrics[index].delay,
                  iterations: Infinity,
                  direction: "alternate",
                  easing: "ease-in-out",
                },
              ),
            );
          });
      }

      syncAnimations();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);

        syncAnimations();
      },
      { rootMargin: "200px 0px" },
    );

    if (section.current) observer.observe(section.current);

    updateMotion();

    preference.addEventListener("change", updateMotion);

    document.addEventListener("visibilitychange", syncAnimations);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncAnimations);
      preference.removeEventListener("change", updateMotion);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <section
      ref={section}
      aria-labelledby="sustainable-manufacturing-title"
      className="bg-[radial-gradient(ellipse_at_50%_65%,#bee6a533_0%,#ebfae11a_50%,transparent_75%),linear-gradient(to_bottom,#fff,#fafff6)] px-5 pt-10 pb-10 md:px-8 md:pt-20 md:pb-10"
    >
      <motion.header
        {...greenReveal("up", 0, reduced, 0.16)}
        className="sr-only text-center md:not-sr-only md:mx-auto md:max-w-[900px]"
      >
        <h2
          id="sustainable-manufacturing-title"
          className="text-[clamp(30px,4vw,50px)] leading-none font-[410] text-[#2c7e4e]"
        >
          Sustainable Manufacturing
        </h2>

        <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-[1.12] md:text-[15px]">
          At SEMPA Pump, sustainability is not limited merely to energy
          consumption. We aim to reduce our environmental impacts through the
          efficient utilization of resources in production and the continuous
          development of processes.
        </p>
      </motion.header>

      <div className="relative mx-auto max-w-[1000px] md:mt-14">
        <motion.div
          {...greenReveal("up", 0.1, reduced, 0.16)}
          className="relative mx-auto mt-8 aspect-square w-full max-w-[662px] md:mt-0 overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_at_center,#e2f3d6aa,transparent_72%)]"
        >
          <div
            role="img"
            aria-label="97 percent recyclability"
            aria-hidden={!failed}
            className="absolute inset-0 flex flex-col items-center justify-center text-[#2c7e4e]"
          >
            <span className="text-[clamp(72px,16vw,150px)] leading-none font-[540]">
              97%
            </span>
            <span className="mt-4 text-[14px] text-[#2c7e4e]">
              Recyclability
            </span>
          </div>

          <video
            ref={video}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setFailed(false)}
            onError={() => setFailed(true)}
            aria-label="Leaf-formed 97 percent figure representing recyclable manufacturing materials"
            className={`absolute inset-0 h-full w-full object-contain [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent),linear-gradient(to_bottom,transparent,#000_7%,#000_93%,transparent)] [mask-composite:intersect] transition-opacity duration-300 motion-reduce:transition-none ${failed ? "opacity-0" : "opacity-100"}`}
          >
            {/* VP9/WebM preserves the original 97% video's transparency. */}
            <source
              src="/green-pump/97percent-pingpong.webm"
              type="video/webm"
            />
          </video>
        </motion.div>

        <ul
          aria-label="Sustainable manufacturing metrics"
          className="absolute inset-0"
        >
          {SustainableManufacturingtsx_metrics.map(
            (
              {
                label,
                value,
                icon,
                iconWidth,
                iconHeight,
                displayWidth,
                position,
              },
              index,
            ) => (
              <motion.li
                {...greenReveal(
                  index % 2 ? "right" : "left",
                  0.15 + index * 0.1,
                  reduced,
                  0.13,
                )}
                key={label}
                className={`absolute w-[min(72%,300px)] min-w-0 md:w-[220px] md:first:w-[262px] ${position}`}
              >
                <div data-manufacturing-float>
                  <div className="relative flex min-h-[72px] md:min-h-[93px] flex-col justify-center rounded-[15px] border-[0.5px] border-white/75 bg-white/15 p-3 md:p-4 text-[#2c7e4e] shadow-[0_12px_35px_#2d6e411f,inset_0_1px_0_#ffffff73] backdrop-blur-[30px] transition-[translate,box-shadow,backdrop-filter] duration-[350ms] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_#2d6e4129] hover:backdrop-blur-[24px] motion-reduce:translate-none! motion-reduce:transition-none">
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-2 flex size-12 items-center justify-center"
                    >
                      <Image
                        src={icon}
                        alt=""
                        width={iconWidth}
                        height={iconHeight}
                        style={{ width: displayWidth, height: "auto" }}
                        className="max-w-none object-contain"
                      />
                    </span>

                    <p className="pr-5 text-[12px] leading-[1.12]">{label}</p>

                    <p className="mt-2 text-[22px] leading-none md:text-[25px] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]">
                      {value}
                    </p>
                  </div>
                </div>
              </motion.li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

const ManufacturingBenefitsCarouseltsx_benefits = [
  {
    id: "waste",
    title: "Waste Reduction",
    description:
      "Metal shavings, casting slag, and packaging materials from manufacturing processes are segregated at source and transferred to certified recyclers, minimizing disposed waste volume.",
    label: "Material Recovery",
    value: "Certified Recyclers",
  },

  {
    id: "energy",
    title: "Energy Efficiency",
    description:
      "High-efficiency motors, hydraulic flow optimization, and energy-saving production lines.",
    label: "Motor & Flow Efficiency",
    value: "IE4 / IE5 Standart",
  },

  {
    id: "lifespan",
    title: "Extended Product Lifespan",
    description:
      "SEMPA pumps are engineered with mechanical robustness to operate reliably for decades. Wear-resistant specialized alloys, anti-corrosive epoxy coatings, and dynamically balanced bearings multiply operational lifespan.",
    label: "Built for Longevity",
    value: "Wear-Resistant Design",
  },

  {
    id: "maintenance",
    title: "Streamlined Maintenance & Service",
    description:
      "The Back Pull-Out modular design allows maintenance without dismantling piping, reducing downtime and service requirements.",
    label: "Modular Service Design",
    value: "Back Pull-Out",
  },

  {
    id: "resources",
    title: "Effective Resource Utilization",
    description:
      "Every gram of material, each kilowatt of energy, and every production resource is managed through optimized and responsible manufacturing processes.",
    label: "Responsible Manufacturing",
    value: "Optimized Resources",
  },
];

const ManufacturingBenefitsCarouseltsx_count =
  ManufacturingBenefitsCarouseltsx_benefits.length;

const ManufacturingBenefitsCarouseltsx_slides = Array.from(
  { length: ManufacturingBenefitsCarouseltsx_count * 3 },
  (_, position) => ({
    ...ManufacturingBenefitsCarouseltsx_benefits[
      position % ManufacturingBenefitsCarouseltsx_count
    ],
    position,
  }),
);

const ManufacturingBenefitsCarouseltsx_wrap = (index: number) =>
  ((index % ManufacturingBenefitsCarouseltsx_count) +
    ManufacturingBenefitsCarouseltsx_count) %
  ManufacturingBenefitsCarouseltsx_count;

function ManufacturingBenefitsCarouseltsx_ManufacturingBenefitsCarousel() {
  const reduced = useReducedMotion() ?? false;
  const [position, setPosition] = useManufacturingBenefitsCarouseltsx_State(
    ManufacturingBenefitsCarouseltsx_count + 1,
  );

  const [animated, setAnimated] =
    useManufacturingBenefitsCarouseltsx_State(true);

  const [moving, setMoving] = useManufacturingBenefitsCarouseltsx_State(false);

  const region = useManufacturingBenefitsCarouseltsx_Ref<HTMLDivElement>(null);

  const gesture = useManufacturingBenefitsCarouseltsx_Ref<{
    x: number;

    y: number;

    id: number;
  } | null>(null);

  const suppressClick = useManufacturingBenefitsCarouseltsx_Ref(false);

  const active =
    ManufacturingBenefitsCarouseltsx_benefits[
      ManufacturingBenefitsCarouseltsx_wrap(position)
    ];

  useManufacturingBenefitsCarouseltsx_Effect(() => {
    if (animated) return;

    let secondFrame = 0;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setAnimated(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [animated]);

  function moveTo(next: number) {
    if (moving || next === position) return;

    if (region.current?.contains(document.activeElement))
      region.current.focus({ preventScroll: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimated(false);

      setPosition(
        ManufacturingBenefitsCarouseltsx_count +
          ManufacturingBenefitsCarouseltsx_wrap(next),
      );

      return;
    }

    setMoving(true);

    setPosition(next);
  }

  function finishMovement() {
    if (
      position < ManufacturingBenefitsCarouseltsx_count ||
      position >= ManufacturingBenefitsCarouseltsx_count * 2
    ) {
      setAnimated(false);

      setPosition(
        ManufacturingBenefitsCarouseltsx_count +
          ManufacturingBenefitsCarouseltsx_wrap(position),
      );
    }

    setMoving(false);
  }

  function onKeyDown(
    event: ManufacturingBenefitsCarouseltsx_KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();

      moveTo(position + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();

      moveTo(
        ManufacturingBenefitsCarouseltsx_count +
          (event.key === "Home"
            ? 0
            : ManufacturingBenefitsCarouseltsx_count - 1),
      );
    }
  }

  function onPointerUp(
    event: ManufacturingBenefitsCarouseltsx_PointerEvent<HTMLDivElement>,
  ) {
    const start = gesture.current;

    gesture.current = null;

    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;

    const dy = event.clientY - start.y;

    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClick.current = true;

      moveTo(position + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <section
      aria-labelledby="manufacturing-benefits-title"
      className="overflow-hidden bg-[linear-gradient(to_bottom,#fafff6_0%,#f5fdeb_45%,#fff_100%)] px-3 pt-4 pb-32 md:px-8 md:pb-28"
    >
      <h2 id="manufacturing-benefits-title" className="sr-only">
        Manufacturing benefits
      </h2>

      <p id="manufacturing-carousel-help" className="sr-only">
        Use the left and right arrow keys, the navigation buttons, or swipe to
        explore the manufacturing benefits.
      </p>

      <motion.div
        {...greenReveal("up", 0.04, reduced, 0.12)}
        ref={region}
        role="region"
        aria-roledescription="carousel"
        aria-label="Explore manufacturing benefits"
        aria-describedby="manufacturing-carousel-help"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          suppressClick.current = false;
          gesture.current = {
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId,
          };
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          gesture.current = null;
        }}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();

            event.stopPropagation();

            suppressClick.current = false;
          }
        }}
        className="relative mx-auto h-[670px] max-w-[1100px] touch-pan-y overflow-hidden rounded-[15px] [--benefit-passive:140px] [--benefit-active:clamp(164px,48vw,200px)] [--benefit-gap:40px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2c7e4e] md:[--benefit-passive:160px] md:[--benefit-active:180px] md:[--benefit-gap:60px]"
      >
        <div
          className={`absolute top-2 left-1/2 flex w-max items-start gap-[var(--benefit-gap)] ${animated ? "transition-transform duration-500 ease-in-out" : "transition-none"} motion-reduce:transition-none`}
          style={{
            transform: `translate3d(calc(-${position} * (var(--benefit-passive) + var(--benefit-gap)) - var(--benefit-active) / 2), 0, 0)`,
          }}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "transform"
            )
              finishMovement();
          }}
        >
          {ManufacturingBenefitsCarouseltsx_slides.map((slide) => {
            const selected = slide.position === position;

            const visible = Math.abs(slide.position - position) <= 2;

            return (
              <article
                key={slide.position}
                role="group"
                aria-roledescription="slide"
                aria-label={`${ManufacturingBenefitsCarouseltsx_wrap(slide.position) + 1} of ${ManufacturingBenefitsCarouseltsx_count}: ${slide.title}`}
                aria-hidden={!visible}
                inert={!visible}
                data-active={selected ? "true" : "false"}
                className={`relative flex shrink-0 flex-col overflow-hidden rounded-[15px] [&>*]:relative border px-4 py-5 ${animated ? "transition-[width,height,margin,background-color,box-shadow] duration-[350ms] ease-in-out" : "transition-none"} motion-reduce:transition-none ${selected ? "mt-0 h-[640px] w-[var(--benefit-active)] border-transparent bg-transparent text-center before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[245px] before:rounded-[15px] before:bg-white/65 md:border-white/40 md:bg-white/65 md:before:hidden shadow-[inset_0_1px_8px_#fff,0_10px_30px_#2c7e4e0a]" : "mt-5 h-[600px] w-[var(--benefit-passive)] border-transparent bg-transparent "}`}
              >
                <h3
                  className={`${selected ? `max-w-[190px] leading-none [font-weight:410] ${slide.id === "energy" ? "text-[clamp(21px,6vw,25px)]" : "text-[18px] md:text-[20px]"}` : "text-[15px] leading-[1.12] font-[410]"}`}
                >
                  {slide.title}
                </h3>

                {selected ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="mt-14 flex size-8 shrink-0 self-start items-center justify-center rounded-full bg-[#2c7e4e] text-[#a5c843]! shadow-[0_0_24px_6px_#2c7e4e55]"
                    >
                      <ManufacturingBenefitsCarouseltsx_FiArrowDownRight
                        className="size-6"
                        strokeWidth={3}
                      />
                    </span>

                    <div className="flex shrink-0 items-center justify-center gap-5 mt-10">
                      <button
                        type="button"
                        aria-label="Previous manufacturing benefit"
                        aria-disabled={moving}
                        onClick={() => moveTo(position - 1)}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#9eb7d0]! transition-colors duration-200 hover:bg-[#e4efda] hover:text-[#2c7e4e]! focus-visible:outline-2 focus-visible:outline-[#2c7e4e]"
                      >
                        <ManufacturingBenefitsCarouseltsx_FiArrowLeft
                          className="size-7 md:size-8"
                          strokeWidth={3}
                        />
                      </button>

                      <button
                        type="button"
                        aria-label="Next manufacturing benefit"
                        aria-disabled={moving}
                        onClick={() => moveTo(position + 1)}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#9eb7d0]! transition-colors duration-200 hover:bg-[#e4efda] hover:text-[#2c7e4e]! focus-visible:outline-2 focus-visible:outline-[#2c7e4e]"
                      >
                        <ManufacturingBenefitsCarouseltsx_FiArrowRight
                          className="size-7 md:size-8"
                          strokeWidth={3}
                        />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Show ${slide.title}`}
                    aria-disabled={moving}
                    onClick={() => moveTo(slide.position)}
                    className="mt-4 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#27272a] text-white! transition-[background-color,transform] duration-200 hover:rotate-6 hover:bg-[#2c7e4e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c7e4e]"
                  >
                    <ManufacturingBenefitsCarouseltsx_FiArrowUpRight
                      className="size-5"
                      strokeWidth={3}
                    />
                  </button>
                )}

                <p
                  className={`text-[12px] leading-[1.12] ${selected ? "text-[#9eb7d0] mt-8" : "text-[#9eb7d0] mt-10"}`}
                >
                  {slide.description}
                </p>

                {selected && (
                  <div className="mt-auto flex min-h-[90px] shrink-0 flex-col justify-center rounded-lg bg-[#a5c843] p-3 text-[#27272a] md:mx-auto md:w-full">
                    <p className="text-[11px] leading-[1.12]">{slide.label}</p>

                    <p className="mt-3 text-[15px] leading-[1.12] [font-weight:540]">
                      {slide.value}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-linear-to-r from-[#f8fff2] to-transparent md:w-12"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-linear-to-l from-[#f8fff2] to-transparent md:w-12"
        />
      </motion.div>

      <p className="sr-only" role="status" aria-live="polite">
        {active.title}. {ManufacturingBenefitsCarouseltsx_wrap(position) + 1} of{" "}
        {ManufacturingBenefitsCarouseltsx_count}.
      </p>
    </section>
  );
}

const ApproachAndProductstsx_approachCards = [
  {
    title: "More Efficient",
    description:
      "We focus on maximizing energy efficiency across pump systems.",
    icon: "/green-pump/efficient.webp",
    iconWidth: 120,
    iconHeight: 120,
    displayWidth: 30,
    iconLeft: 0,
  },

  {
    title: "Less Energy",
    description:
      "We support the reduction of energy consumption through optimum pump selection and high-efficiency solutions.",
    icon: "/green-pump/less-energy.webp",
    iconWidth: 240,
    iconHeight: 255,
    displayWidth: 64,
    iconLeft: -17,
  },

  {
    title: "Longer Lifespan",
    description:
      "We aim to increase operational lifespan through durable, reliable, and easily maintainable products.",
    icon: "/green-pump/lifespan.webp",
    iconWidth: 188,
    iconHeight: 188,
    displayWidth: 43,
    iconLeft: 0,
  },

  {
    title: "Cleaner Energy",
    description:
      "We reduce the environmental impact of our manufacturing processes by scaling up renewable energy investments.",
    icon: "/green-pump/cleaner-energy.webp",
    iconWidth: 144,
    iconHeight: 153,
    displayWidth: 47,
    iconLeft: -10,
  },
];

const ApproachAndProductstsx_productCards = [
  {
    title: "Quality",
    description:
      "Tight machining tolerances, high-grade metallurgical casting, and zero-defect quality inspection protocols at every step.",
  },

  {
    title: "Durability",
    description:
      "Special alloy ductile iron casings, corrosion-proof stainless/bronze impellers, and heavy-duty bearing arrangements endure for decades without wear.",
  },

  {
    title: "Reliability",
    description:
      "Optimized hydraulic geometries and thermal stability ensure consistent flow rates and pressure heads even under extreme duty cycles.",
  },

  {
    title: "Maintainability",
    description:
      "Thanks to the Back Pull-Out design philosophy, seal, bearing, and motor replacements are executed in minutes without pipe dismantling.",
  },
];

function CarbonReportingRing() {
  const filterId = `${useId()}-circle-key`;
  const video = useApproachAndProductstsx_Ref<HTMLVideoElement>(null);
  useApproachAndProductstsx_ViewportVideo(video);
  return (
    <>
      <svg aria-hidden="true" className="pointer-events-none absolute size-0">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 1 1 0 -0.5"
            />
          </filter>
        </defs>
      </svg>
      <video
        ref={video}
        data-carbon-reporting-ring
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="metadata"
        style={{ filter: `url(#${filterId}) hue-rotate(25deg)` }}
        className="pointer-events-none absolute top-1/2 -left-4 size-24 -translate-y-1/2 rounded-full object-cover md:size-[104px]"
      >
        <source src="/green-pump/circle-animation.mp4" type="video/mp4" />
      </video>
    </>
  );
}

function ApproachAndProductstsx_ApproachAndProducts() {
  const reduced = useReducedMotion() ?? false;
  const pump = useApproachAndProductstsx_Ref<HTMLVideoElement>(null);

  const forest = useApproachAndProductstsx_Ref<HTMLVideoElement>(null);

  useApproachAndProductstsx_ViewportVideo(pump);

  useApproachAndProductstsx_ViewportVideo(forest);

  return (
    <>
      <section
        aria-labelledby="lasting-products-title"
        className="relative isolate bg-white text-[#f7f7f7] md:bg-[#163626]"
      >
        <video
          ref={forest}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="A green forest forming the Sempa symbol"
          className="absolute inset-x-0 top-0 -z-10 h-[440px] w-full object-cover object-center md:h-full"
          onError={(event) => {
            const element = event.currentTarget;
            if (element.dataset.pingpongFallback === "true") return;
            element.dataset.pingpongFallback = "true";
            element.src = "/green-pump/green-flow-slider.mp4";
            element.load();
            if (!document.hidden) void element.play().catch(() => {});
          }}
        >
          {/* Forward + reversed frames encoded into one file. */}
          <source
            src="/green-pump/green-flow-slider-pingpong.mp4"
            type="video/mp4"
          />
        </video>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px] md:h-full bg-[linear-gradient(to_bottom,#0000002e,#0000001f_45%,#0000006b)]"
        />

        <div className="relative mx-auto flex min-h-[500px] max-w-[1264px] flex-col px-5 pt-12 pb-0 md:px-8 md:pt-24 md:pb-0">
          <motion.header
            {...greenReveal("up", 0, reduced, 0.2)}
            className="text-center"
          >
            <h2
              id="lasting-products-title"
              className="mx-auto max-w-[900px] text-[clamp(30px,4vw,50px)] leading-none"
            >
              Long-Lasting Products,
              <br className="hidden md:block" /> Less Resource Consumption
            </h2>

            <p className="mx-auto mt-28 max-w-[760px] md:mt-4 text-[13px] leading-[1.12] md:text-[15px]">
              A product operating reliably for an extended lifespan contributes
              directly to reducing the need for new equipment and replacement
              parts.
            </p>
          </motion.header>

          <ul className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 lg:mt-auto lg:-mb-3 lg:grid-cols-4">
            {ApproachAndProductstsx_productCards.map(
              ({ title, description }, index) => (
                <motion.li
                  {...greenReveal("up", index * 0.09, reduced, 0.16)}
                  key={title}
                  className="relative isolate min-w-0 rounded-[15px] border-[0.5px] border-white/75 bg-[#232323]/50 p-5 text-[#f7f7f7] shadow-[0_8px_25px_#0000001f] backdrop-blur-[28px] transition-[translate,backdrop-filter,background-color,color,border-color,box-shadow] duration-300 ease-in-out after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:hidden after:rounded-[inherit] after:bg-[linear-gradient(to_bottom,transparent_60%,#9da395_96%,#9da395_100%)] after:transition-opacity after:duration-300 hover:-translate-y-[5px] hover:border-white hover:bg-[#d0f053] hover:text-[#27272a] hover:shadow-[0_8px_25px_#d0f05340] hover:backdrop-blur-[22px] hover:after:opacity-0 motion-reduce:translate-none! motion-reduce:transition-none motion-reduce:after:transition-none md:bg-[#232323]/30 md:hover:bg-[#d0f053] lg:min-h-[130px] lg:after:block"
                >
                  <h3 className="text-[19px] leading-[1.05]">{title}</h3>

                  <p className="mt-3 text-[12px] leading-[1.12]">
                    {description}
                  </p>
                </motion.li>
              ),
            )}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-5 lg:hidden bg-linear-to-b from-transparent to-[#fafff6]/20"
        />
      </section>

      <section
        aria-labelledby="green-approach-title"
        className="overflow-hidden bg-[radial-gradient(ellipse_65%_60%_at_43%_60%,#e7f4d680,transparent_76%),linear-gradient(to_bottom,#ffffff_0%,#fdfef9_38%,#f9fdf2_75%,#ffffff_100%)] px-5 pt-14 md:px-8 md:pt-[148px]"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:items-start lg:gap-0 lg:pl-[10px] lg:grid-cols-[minmax(0,714fr)_minmax(0,480fr)]">
          <div className="order-2 min-w-0 md:order-1">
            <motion.h2
              {...greenReveal("left", 0, reduced, 0.2)}
              id="green-approach-title"
              className="max-w-[300px] text-[clamp(36px,12vw,50px)] md:max-w-[520px] md:text-[clamp(36px,4vw,50px)] leading-none text-[#2c7e4e]"
            >
              Our Green Pump
              <br />
              Approach
            </motion.h2>

            <motion.p
              {...greenReveal("left", 0.12, reduced, 0.2)}
              className="mt-8 max-w-[640px] text-[14px] leading-[1.12] md:mt-[44px] md:text-[15px]"
            >
              SEMPA Pump&apos;s “Green Pump” approach represents a philosophy
              that considers not merely the manufacturing phase, but the
              complete product lifecycle extending from initial design through
              to end-of-life.
            </motion.p>

            <ul className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 md:mt-[46px] md:gap-4">
              {ApproachAndProductstsx_approachCards.map(
                (
                  {
                    title,
                    description,
                    icon,
                    iconWidth,
                    iconHeight,
                    displayWidth,
                    iconLeft,
                  },
                  index,
                ) => (
                  <motion.li
                    {...greenReveal(
                      index % 2 ? "right" : "up",
                      0.06 + index * 0.07,
                      reduced,
                      0.15,
                    )}
                    key={title}
                    className="group min-h-[150px] min-w-0 rounded-[15px] border border-[#9eb7d0]/25 bg-white/80 p-5 transition-[translate,border-color,background-color,box-shadow] duration-300 ease-in-out hover:-translate-y-1 hover:border-[#2c7e4e]/50 hover:bg-[#f7fff2] hover:shadow-[0_10px_25px_#2c7e4e12] motion-reduce:translate-none! motion-reduce:transition-none md:min-h-[159px] md:p-[22px] lg:h-[159px]"
                  >
                    {/* Source aspect ratios are preserved. The fixed 30px slot keeps
                      card titles at their reference positions; the glow can extend. */}
                    <div className="relative h-[30px]">
                      <Image
                        src={icon}
                        alt=""
                        aria-hidden="true"
                        width={iconWidth}
                        height={iconHeight}
                        style={{
                          width: displayWidth,
                          height: "auto",
                          left: iconLeft,
                        }}
                        className="absolute left-0 top-1/2 max-w-none -translate-y-1/2 object-contain transition-[filter] duration-300 group-hover:drop-shadow-[0_0_5px_#a5c84399] motion-reduce:transition-none"
                      />
                    </div>

                    <h3 className="mt-3 text-[18px] leading-[1.05] md:text-[20px]">
                      {title}
                    </h3>

                    <p className="mt-3 text-[12px] leading-[1.12]">
                      {description}
                    </p>
                  </motion.li>
                ),
              )}
            </ul>
          </div>

          {/* The pump area is intentionally wider and taller on desktop, matching the reference. */}
          <motion.div
            {...greenReveal("right", 0.06, reduced, 0.17)}
            className="relative order-1 mx-auto w-full min-w-0 max-w-[650px] md:order-2 lg:mx-0 lg:max-w-none lg:self-start"
          >
            <div
              data-green-pump-visual
              className="relative aspect-[0.85] w-full bg-transparent md:aspect-square lg:aspect-auto lg:h-[620px]"
            >
              <div className="absolute inset-0 overflow-hidden mix-blend-multiply [mask-image:linear-gradient(to_bottom,#000_94%,transparent)]">
                <div className="absolute inset-0">
                  <video
                    ref={pump}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Blue Sempa pump demonstrating durable pump engineering"
                    onError={(event) => {
                      const element = event.currentTarget;
                      if (element.dataset.pingpongFallback === "true") return;
                      element.dataset.pingpongFallback = "true";
                      element.src = "/green-pump/pump-video.webm";
                      element.load();
                      if (!document.hidden) void element.play().catch(() => {});
                    }}
                    className="absolute top-1/2 left-1/2 h-auto w-[255%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:w-[199%] lg:top-[calc(50%-12px)] lg:left-[calc(50%-40px)] lg:w-[282%]"
                  >
                    <source
                      src="/green-pump/pump-video-pingpong.webm"
                      type="video/webm"
                    />
                  </video>
                </div>
              </div>

              <div
                data-carbon-reporting-fog
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 h-[55%] w-[68%] backdrop-blur-[28px] [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_0%,#000c_45%,transparent_100%)] md:backdrop-blur-[42px]"
              />
            </div>

            {/* The reporting label floats above the video blur. */}
            <div className="relative z-10 mx-auto -mt-24 max-w-[360px] text-center md:-mt-28 lg:absolute lg:right-0 lg:bottom-[90px] lg:mt-0 lg:w-[360px]">
              <div className="relative ml-auto flex min-h-[60px] max-w-[205px] items-center justify-end gap-1 px-0 py-2 md:min-h-[66px]">
                <CarbonReportingRing />
                <h3 className="relative max-w-[126px] text-right text-[12px] leading-[1.02] text-[#27272a] md:text-[13px]">
                  We Are Reporting Our Carbon Footprint
                </h3>

                <span
                  aria-hidden="true"
                  className="relative h-[61px] w-[51px] shrink-0"
                >
                  <Image
                    src="/green-pump/document.webp"
                    alt=""
                    width={345}
                    height={364}
                    className="absolute left-1/2 top-1/2 h-auto w-[86px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:w-[93px]"
                  />
                </span>
              </div>

              <p className="sr-only text-[12px] leading-[1.12] text-[#9eb7d0] md:not-sr-only md:mt-3">
                Under ISO 14064 GHG verification and ISO 50001 Energy Management
                frameworks, we rigorously audit Scope 1, Scope 2, and Scope 3
                emissions to ensure data-driven decarbonization.
              </p>
            </div>
          </motion.div>
        </div>

        <GreenPumpOutroText />
      </section>
    </>
  );
}

const technologyTags = [
  "Energy Efficiency",
  "Sustainable Design",
  "Eco-Friendly",
  "High Performance",
  "Low Carbon",
  "GreenFlow Initiative",
];

const advantages = [
  {
    title: "Optimal Performance",
    description:
      "Ideal operating conditions supported by precise pump selection.",
    surface:
      "border-[#dce4e7]/75 bg-[linear-gradient(to_bottom,#ffffff26_0%,#ffffff26_45%,#ffffffb3_100%)] text-[#27272a] backdrop-blur-[30px] hover:bg-white/25",
  },

  {
    title: "Low Energy Consumption",
    description: "Maximum hydraulic efficiency with minimal power usage.",
    surface: "border-[#a5c843] bg-[#a5c843] text-[#27272a] hover:bg-[#afd14d]",
  },

  {
    title: "Lower Operating Costs",
    description:
      "Increased operational profitability driven by energy savings.",
    surface:
      "border-[#dce4e7]/75 bg-[linear-gradient(to_bottom,#ffffff26_0%,#ffffff26_45%,#ffffffb3_100%)] text-[#27272a] backdrop-blur-[30px] hover:bg-white/25",
  },

  {
    title: "Reduced Carbon Emissions",
    description:
      "An eco-friendly infrastructure that mitigates fossil fuel impact.",
    surface: "border-[#2c7e4e] bg-[#2c7e4e] text-white hover:bg-[#328b57]",
  },
];

export default function GreenPumpPage() {
  const reduced = useReducedMotion() ?? false;
  return (
    <main
      data-header-underlay
      onDragStart={(event) => {
        const target = event.target;
        if (
          target instanceof Element &&
          target.closest("img, picture, video, svg")
        ) {
          event.preventDefault();
        }
      }}
      className="-mt-[var(--site-header-height,97px)] w-full font-sans text-[#27272a] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,'wdth'_125] tracking-[-0.04em] [&_img]:select-none [&_img]:[-webkit-user-drag:none] [&_svg]:select-none [&_video]:select-none"
    >
      <style>{greenPumpCtaStyles}</style>
      <style>{`
        main[data-header-underlay] img,
        main[data-header-underlay] picture,
        main[data-header-underlay] video,
        main[data-header-underlay] svg {
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
          -webkit-touch-callout: none;
        }
      `}</style>

      <div className="bg-[radial-gradient(ellipse_at_55%_65%,#dcf6c166,transparent_60%),linear-gradient(135deg,#fff_0%,#f7fff2_55%,#f2ffe8_100%)]">
        <GreenPumpHerotsx_GreenPumpHero />

        <section
          aria-labelledby="green-technology-title"
          className="relative bg-[linear-gradient(to_bottom,#fff_0%,transparent_160px)] px-5 pt-12 pb-10 md:px-8 md:pt-10 md:pb-10"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-x-6 gap-y-10 md:grid-cols-2 min-[75rem]:grid-cols-[minmax(0,289fr)_minmax(0,594fr)_minmax(0,251fr)]">
            <motion.div
              {...greenReveal("left", 0.03, reduced, 0.16)}
              className="order-3 min-w-0 md:order-none"
            >
              <h2
                id="green-technology-title"
                className="max-w-[329px] text-[25px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]"
              >
                Energy-Efficient Pump Technologies for a Sustainable Future
              </h2>

              <ul
                aria-label="Technology features"
                className="mt-4 grid max-w-[329px] grid-cols-2 gap-1.5"
              >
                {technologyTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-[#f7f7f7]/85 px-2 py-1.5 text-[10px] leading-[1.12] text-[#9eb7d0]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <p className="mt-4 max-w-[289px] text-[15px] leading-[1.12]">
                The environmental impact lies in the energy consumed over the
                product’s lifespan.
              </p>

              <div className="mt-5">
                <GreenPumpLinktsx_GreenPumpLink href="/contact#contact-write-title">
                  Request Efficiency Analysis
                </GreenPumpLinktsx_GreenPumpLink>
              </div>
            </motion.div>

            <motion.div
              {...greenReveal("up", 0.12, reduced, 0.17)}
              className="relative order-1 min-w-0 md:order-none md:col-span-2 md:row-start-2 min-[75rem]:col-span-1 min-[75rem]:row-start-auto"
            >
              <Image
                src="/green-pump/01.jpg"
                alt="Metallic Sempa symbol with solar panels"
                width={1376}
                height={768}
                sizes="(min-width: 1200px) 604px, (min-width: 768px) 90vw, 100vw"
                className="h-auto w-full object-contain mix-blend-multiply [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent),linear-gradient(to_bottom,transparent,#000_8%,#000_94%,transparent)] [mask-composite:intersect]"
              />
            </motion.div>

            <motion.div
              {...greenReveal("right", 0.08, reduced, 0.16)}
              className="order-2 min-w-0 md:order-none md:col-start-2 md:row-start-1 min-[75rem]:col-start-3 min-[75rem]:row-start-auto"
            >
              <h2 className="max-w-[300px] text-[25px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125] text-[#a5c843]">
                2MW Solar Plant Provides 40% of Energy
              </h2>

              <p className="mt-6 max-w-[300px] text-[15px] leading-[1.12] min-[75rem]:max-w-[251px]">
                At Sempa Pump, we view sustainability not merely as an
                environmental responsibility, but as an integral part of our
                product development, production, and business practices.
              </p>

              <div className="mt-5">
                <GreenPumpLinktsx_GreenPumpLink
                  href="/e-mission"
                  variant="lime"
                >
                  Discover Sustainability
                </GreenPumpLinktsx_GreenPumpLink>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          aria-label="Green Pump advantages"
          className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,#f2ffe866_45%,#fff_100%)] px-5 pt-[220px] pb-8 md:px-8 md:pt-44 md:pb-44 min-[75rem]:pt-[240px] min-[75rem]:pb-[160px]"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[1280px]"
            aria-hidden="true"
          >
            <Image
              src="/green-pump/02.png"
              alt=""
              width={1654}
              height={1009}
              sizes="(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 760px"
              className="absolute top-0 left-1/2 h-auto w-[760px] max-w-none -translate-x-[60%] object-contain md:w-full md:-translate-x-1/2"
            />

            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-white" />
          </div>

          <div className="relative mx-auto max-w-[998px]">
            <MobileSnapRailtsx_MobileSnapRail
              label="Green Pump advantages"
              count={4}
              desktopClassName="[--rail-card-width:min(72vw,280px)] md:grid md:grid-cols-2 md:gap-[22px] min-[75rem]:grid-cols-4"
            >
              {advantages.map((advantage, index) => (
                <motion.article
                  {...greenReveal("up", 0.05 + index * 0.09, reduced, 0.15)}
                  key={advantage.title}
                  className={`flex w-[min(72vw,280px)] shrink-0 snap-start min-h-[195px] md:w-auto flex-col items-center rounded-[30px] border-[0.2px] px-[14px] pt-9 pb-[23px] text-center transition-[translate,box-shadow,background-color] duration-[350ms] hover:-translate-y-[5px] hover:shadow-[0_12px_30px_#2c7e4e20] motion-reduce:translate-none! motion-reduce:transform-none motion-reduce:transition-none min-[75rem]:min-h-[195px] min-[75rem]:pt-[42px] ${advantage.surface}`}
                >
                  <h2 className="text-[17px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]">
                    {advantage.title}
                  </h2>

                  <p className="mt-4 max-w-[205px] text-[13px] leading-[1.12]">
                    {advantage.description}
                  </p>
                </motion.article>
              ))}
            </MobileSnapRailtsx_MobileSnapRail>
          </div>
        </section>
      </div>

      <CarbonFootprintSectiontsx_CarbonFootprintSection />

      <SustainableManufacturingtsx_SustainableManufacturing />

      <ManufacturingBenefitsCarouseltsx_ManufacturingBenefitsCarousel />

      <ApproachAndProductstsx_ApproachAndProducts />
    </main>
  );
}
