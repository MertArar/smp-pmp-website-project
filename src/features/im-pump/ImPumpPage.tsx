"use client";
import Image from "next/image";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useViewportVideo from "@/components/media/useViewportVideo";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  FiArrowDownRight,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiCpu,
  FiImage,
  FiShield,
} from "react-icons/fi";
import { IoDiamondOutline, IoFingerPrintOutline } from "react-icons/io5";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const imMotionEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
type ImRevealDirection = "up" | "left" | "right";
const imRevealVariants: Variants = {
  hidden: ({
    direction,
    reduced,
  }: {
    direction: ImRevealDirection;
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
function imReveal(
  direction: ImRevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.18,
) {
  return {
    variants: imRevealVariants,
    custom: { direction, reduced },
    initial: reduced ? (false as const) : ("hidden" as const),
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.86,
      delay: reduced ? 0 : delay,
      ease: imMotionEase,
    },
  };
}
function imHeroEnter(reduced: boolean, delay: number, y = 22) {
  return {
    initial: reduced ? false : { opacity: 0, y, filter: "blur(7px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 0.92,
      delay: reduced ? 0 : delay,
      ease: imMotionEase,
    },
  };
}
// The neon title and water ring are part of the supplied video artwork.
const HERO_VIDEO = "/im-pump/im-pump-hero.webm";
const SCROLL_VIDEO = "/im-pump/scroll-down.webm";

/** Keep the existing video artwork ready, but only play around the viewport. */
function useDecorativeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useViewportVideo(videoRef);
  return videoRef;
}
function HeroBackgroundVideo() {
  const videoRef = useDecorativeVideo();
  return (
    <div
      className="im-pump-video pointer-events-none absolute inset-x-0 top-0 overflow-hidden [.im-pump-page_&]:[height:calc(648_*_var(--im-pump-unit))] [.im-pump-page_&_>_video]:[position:absolute] [.im-pump-page_&_>_video]:[width:100%] [.im-pump-page_&_>_video]:[height:auto] [.im-pump-page_&_>_video]:[min-height:100%] [.im-pump-page_&_>_video]:[top:calc(-800_*_(var(--im-pump-x-unit)_-_var(--im-pump-unit)))] max-[768px]:[.im-pump-page_&]:[height:clamp(400px,_104vw,_750px)] max-[768px]:[.im-pump-page_&_>_video]:[top:90px] max-[768px]:[.im-pump-page_&_>_video]:[left:50%] max-[768px]:[.im-pump-page_&_>_video]:[width:160%] max-[768px]:[.im-pump-page_&_>_video]:[max-width:none] max-[768px]:[.im-pump-page_&_>_video]:[transform:translateX(-50%)] max-[768px]:[.im-pump-page_&_>_video]:[height:auto] max-[768px]:[.im-pump-page_&_>_video]:[min-height:0] max-[768px]:[.im-pump-page_&_>_video]:[object-fit:contain] max-[768px]:[.im-pump-page_&_>_video]:[object-position:center_bottom]"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        className="h-full w-full object-cover object-top"
      >
        <source src={HERO_VIDEO} type="video/webm" />
      </video>
      <div className="im-pump-video-fade absolute inset-x-0 bottom-0 [.im-pump-page_&]:[height:calc(40_*_var(--im-pump-unit))] [.im-pump-page_&]:[background:linear-gradient(transparent,_#141a32aa)]" />
    </div>
  );
}
function HeroPhilosophyBadge() {
  return (
    <div className="im-pump-badge absolute left-1/2 z-10 flex -translate-x-1/2 items-center rounded-[8px] border-[0.25px] border-white/40 bg-white/15 text-[#F7F7F7] backdrop-blur-[8px] [.im-pump-page_&]:[top:calc(273_*_var(--im-pump-x-unit)_-_800_*_(var(--im-pump-x-unit)_-_var(--im-pump-unit)))] [.im-pump-page_&]:[width:calc(351_*_var(--im-pump-unit))] [.im-pump-page_&]:[height:calc(47.42_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-top:calc(7_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-right:calc(16_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-bottom:calc(7_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-left:calc(16_*_var(--im-pump-unit))] [.im-pump-page_&]:[gap:calc(12_*_var(--im-pump-unit))] max-[768px]:[.im-pump-page_&]:[top:clamp(450px,_120vw,_840px)] max-[768px]:[.im-pump-page_&]:[width:186px] max-[768px]:[.im-pump-page_&]:[height:80px] max-[768px]:[.im-pump-page_&]:[padding-top:8px] max-[768px]:[.im-pump-page_&]:[padding-right:16px] max-[768px]:[.im-pump-page_&]:[padding-bottom:8px] max-[768px]:[.im-pump-page_&]:[padding-left:16px] max-[768px]:[.im-pump-page_&]:[gap:12px]">
      <span
        className="im-pump-badge-icon relative flex shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0069ff,#0838b5)] shadow-[0_0_16px_#005eff55] [.im-pump-page_&]:[width:calc(32_*_var(--im-pump-unit))] [.im-pump-page_&]:[height:calc(32_*_var(--im-pump-unit))]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
          <rect
            x="9"
            y="8"
            width="21"
            height="21"
            rx="6"
            fill="#5093ff"
            fillOpacity=".45"
          />
          <circle cx="19" cy="18" r="7" stroke="#AFD2FF" strokeWidth="1.6" />
          <path
            d="M12 18h14M19 11c-4 4-4 10 0 14M19 11c4 4 4 10 0 14"
            stroke="#AFD2FF"
            strokeWidth="1.1"
          />
        </svg>
      </span>
      <p className="im-pump-badge-text [.im-pump-page_&]:[font-size:calc(12_*_var(--im-pump-unit))]! [.im-pump-page_&]:[line-height:1.05]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[768px]:[.im-pump-page_&]:[font-size:12px]! [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
        <span className="block">I&apos;M PUMP TECHNOLOGY ·</span>
        <span className="block">THE SEMPA ENGINEERING PHILOSOPHY</span>
      </p>
    </div>
  );
}
/** Small clipped text tiles reconstruct the heading without a canvas or a raster asset. */
function PixelHeadingWords({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  return (
    <>
      {text.split(" ").map((word, wordIndex) => {
        const columns = Math.max(2, Math.ceil(word.length * 0.8));
        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            <span className="im-pixel-word relative inline-block">
              <span className="im-pixel-original">{word}</span>
              {Array.from({ length: columns * 3 }, (_, tile) => {
                const seed = tile + (wordIndex + offset) * 31;
                const row = Math.floor(tile / columns),
                  column = tile % columns;
                return (
                  <span
                    key={tile}
                    className="im-pixel-tile pointer-events-none absolute inset-0 hidden"
                    style={
                      {
                        clipPath: `inset(${(row * 100) / 3}% ${((columns - column - 1) * 100) / columns}% ${((2 - row) * 100) / 3}% ${(column * 100) / columns}%)`,
                        "--pixel-delay": `${(seed * 197) % 1380}ms`,
                        "--pixel-x": `${((seed * 13) % 29) - 14}px`,
                        "--pixel-y": `${((seed * 17) % 25) - 12}px`,
                      } as CSSProperties
                    }
                  >
                    {word}
                  </span>
                );
              })}
            </span>
            {wordIndex < text.split(" ").length - 1 ? "\u00a0" : ""}
          </span>
        );
      })}
    </>
  );
}

function HeroIntroduction() {
  const title = useRepeatingTitle(2900);
  return (
    <div className="im-pump-introduction absolute inset-x-0 z-10 mx-auto text-center [.im-pump-page_&]:[top:calc(699_*_var(--im-pump-unit))] [.im-pump-page_&]:[width:calc(732_*_var(--im-pump-unit))] [.im-pump-page_&]:[max-width:calc(100%_-_48px)] max-[768px]:[.im-pump-page_&]:[position:absolute] max-[768px]:[.im-pump-page_&]:[top:0] max-[768px]:[.im-pump-page_&]:[width:100%] max-[768px]:[.im-pump-page_&]:[max-width:none] max-[768px]:[.im-pump-page_&]:[padding-top:0] max-[768px]:[.im-pump-page_&]:[padding-right:0] max-[768px]:[.im-pump-page_&]:[padding-bottom:0] max-[768px]:[.im-pump-page_&]:[padding-left:0]">
      <h1
        ref={title}
        aria-label="Every Pump is a Mechanical Product; But Every Pump Produced by Sempa is a Commitment"
        id="im-pump-heading"
        className="im-pump-heading text-[#F7F7F7] [.im-pump-page_&]:[font-size:calc(25_*_var(--im-pump-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[letter-spacing:0] max-[768px]:[.im-pump-page_&]:[position:absolute] max-[768px]:[.im-pump-page_&]:[top:clamp(130px,_36vw,_240px)] max-[768px]:[.im-pump-page_&]:[left:28px] max-[768px]:[.im-pump-page_&]:[right:28px] max-[768px]:[.im-pump-page_&]:[font-size:clamp(16px,_4.3vw,_25px)]! max-[768px]:[.im-pump-page_&]:[font-weight:410]! max-[768px]:[.im-pump-page_&]:[font-variation-settings:'wght'_410,_'wdth'_125]! max-[768px]:[.im-pump-page_&]:[line-height:1.07]! [font-weight:540]! [font-stretch:125%]! [font-variation-settings:'wght'_540,_'wdth'_125]! [font-optical-sizing:auto]"
      >
        <span aria-hidden="true">
          <PixelHeadingWords text="Every Pump is a Mechanical Product; But Every" />{" "}
          <br className="hidden md:block" />
          <PixelHeadingWords
            text="Pump Produced by Sempa is a Commitment"
            offset={8}
          />
        </span>
      </h1>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          #im-pump-heading[data-title-revealing] .im-pixel-original { visibility: hidden; }
          #im-pump-heading[data-title-revealing] .im-pixel-tile {
            display: block;
            animation: im-pixel-assemble 950ms cubic-bezier(.16,.7,.28,1) var(--pixel-delay) both;
          }
          #im-pump-heading[data-title-revealing] .im-pixel-word::after {
            content: ""; position: absolute; pointer-events: none;
            inset: 0; border-top: 1px solid #8be9ff;
            background: linear-gradient(180deg, #58cfff20, transparent);
            animation: im-pixel-calibrate 550ms ease-out 2250ms both;
          }
        }
        @keyframes im-pixel-assemble {
          0% { opacity: 0; color: #52caff; transform: translate(var(--pixel-x),var(--pixel-y)); }
          16% { opacity: .8; color: #5bddff; }
          28% { opacity: .3; }
          42% { opacity: 1; color: #bdefff; transform: translate(calc(var(--pixel-x) * .15),calc(var(--pixel-y) * .15)); }
          70% { opacity: 1; color: #edfaff; transform: translate(0,0); }
          100% { opacity: 1; color: #f7f7f7; transform: translate(0,0); }
        }
        @keyframes im-pixel-calibrate {
          0% { opacity: 0; transform: translateY(0); }
          15% { opacity: .55; }
          85% { opacity: .15; }
          100% { opacity: 0; transform: translateY(100%); }
        }
      `}</style>
      <p className="im-pump-description text-[#9EB7D0] [.im-pump-page_&]:[margin-top:calc(29_*_var(--im-pump-unit))] [.im-pump-page_&]:[font-size:calc(15_*_var(--im-pump-unit))]! [.im-pump-page_&]:[line-height:1]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[768px]:[.im-pump-page_&]:[position:absolute] max-[768px]:[.im-pump-page_&]:[top:clamp(568px,_150vw,_1030px)] max-[768px]:[.im-pump-page_&]:[left:28px] max-[768px]:[.im-pump-page_&]:[right:28px] max-[768px]:[.im-pump-page_&]:[margin-top:0] max-[768px]:[.im-pump-page_&]:[margin-right:0] max-[768px]:[.im-pump-page_&]:[margin-bottom:0] max-[768px]:[.im-pump-page_&]:[margin-left:0] max-[768px]:[.im-pump-page_&]:[font-size:16px]! max-[768px]:[.im-pump-page_&]:[line-height:1]! [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
        Sempa does not merely fabricate machinery; we deliver technology backed
        by human <br className="hidden md:block" />
        intellect, engineering excellence, and future responsibility. Moving not
        just fluids, but <br className="hidden md:block" />
        global industries.
      </p>
    </div>
  );
}
function HeroScrollIndicator() {
  const videoRef = useDecorativeVideo();
  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      width={61}
      height={61}
      className="im-pump-scroll pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 object-contain mix-blend-screen [.im-pump-page_&]:[top:calc(869_*_var(--im-pump-unit))] [.im-pump-page_&]:[width:calc(61_*_var(--im-pump-unit))] [.im-pump-page_&]:[height:calc(61_*_var(--im-pump-unit))] max-[768px]:[.im-pump-page_&]:[display:none]!"
    >
      <source src={SCROLL_VIDEO} type="video/webm" />
    </video>
  );
}
function ImPumpHero() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      aria-labelledby="im-pump-heading"
      className="im-pump-hero relative isolate w-full overflow-hidden [.im-pump-page_&]:[height:calc(966_*_var(--im-pump-unit))] [.im-pump-page_&]:[background:radial-gradient(ellipse_at_50%_43%,_#073789_0%,_#020e3a_35%,_#010416_70%)] max-[768px]:[.im-pump-page_&]:[height:clamp(720px,_185vw,_1100px)] max-[768px]:[.im-pump-page_&]:[min-height:0]"
    >
      <HeroBackgroundVideo />
      <div
        className="im-pump-lower pointer-events-none absolute inset-x-0 bottom-0 [.im-pump-page_&]:[height:calc(318_*_var(--im-pump-unit))] [.im-pump-page_&]:[background:radial-gradient(ellipse_at_50%_0%,_#377ac882_0%,_#26397570_28%,_transparent_66%),_radial-gradient(ellipse_at_50%_60%,_#272e5870,_transparent_70%),_linear-gradient(#202233,_#1c1d28)] max-[768px]:[.im-pump-page_&]:[top:clamp(400px,_104vw,_750px)] max-[768px]:[.im-pump-page_&]:[height:auto]"
        aria-hidden="true"
      />
      <motion.div
        {...imHeroEnter(reduced, 0.42, 18)}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <HeroPhilosophyBadge />
      </motion.div>
      <motion.div
        {...imHeroEnter(reduced, 0.13, 24)}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <HeroIntroduction />
      </motion.div>
      <HeroScrollIndicator />
    </section>
  );
}
type PhilosophyCardData = {
  word: "I'M" | "PUMP" | "TECHNOLOGY";
  variant: "primary" | "light";
  eyebrow: [string, string];
  title: [string, string];
  description: string;
};
const philosophyCards: PhilosophyCardData[] = [
  {
    word: "I'M",
    variant: "primary",
    eyebrow: ["IDENTITY, UNIQUENESS &", "CHARACTER"],
    title: ["Every Pump Has Its Own", "Unique Identity"],
    description:
      "Every single Sempa pump carries a unique identity like an individual; rigorously tested, certified, and engineered...",
  },
  {
    word: "PUMP",
    variant: "light",
    eyebrow: ["CORE EXPERTISE &", "THE BEATING HEART"],
    title: ["Our Sole Core Focus and the", "Heart of Critical Systems"],
    description:
      "To us, a pump is not just a spare component; it is our primary domain, our heritage, and the vital heart of entir...",
  },
  {
    word: "TECHNOLOGY",
    variant: "light",
    eyebrow: ["INNOVATION, SIMULATION &", "DIGITAL FUTURE"],
    title: ["End-to-End Technological", "Engineering"],
    description:
      "Technology at Sempa is not merely a machining process; it is an end-to-end digital discipline spanning advanced CF...",
  },
];
const engineeringProofs = [
  "Hydraulic optimization tailored to project specifications",
  "EN 10204 3.1 certified material metallurgical traceability",
  "Individual hydraulic test performance curve & digital QR passport",
  "Customized metallurgy and mechanical seal configurations",
];
function EngineeringPhilosophyHeading() {
  return (
    <div className="engineering-philosophy-heading [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:650fr_396fr] [.im-pump-page_&]:[gap:calc(146_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(10_*_var(--philosophy-unit))] [.im-pump-page_&]:[align-items:start] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--philosophy-unit))]! [.im-pump-page_&_h2]:[line-height:1]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_>_p]:[margin-top:calc(92_*_var(--philosophy-unit))] [.im-pump-page_&_>_p]:[font-size:calc(15_*_var(--philosophy-unit))]! [.im-pump-page_&_>_p]:[line-height:1]! [.im-pump-page_&_>_p]:[color:#9eb7d0]! max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1.5fr_1fr] max-[1200px]:[.im-pump-page_&]:[gap:32px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[1200px]:[.im-pump-page_&_>_p]:[margin-top:64px] max-[1200px]:[.im-pump-page_&_>_p]:[line-height:1.2]! max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.3vw,_42px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&_>_p]:[margin-top:0] max-[768px]:[.im-pump-page_&_>_p]:[max-width:396px] max-[768px]:[.im-pump-page_&]:[text-align:center] max-[768px]:[.im-pump-page_&_h2]:[max-width:340px] max-[768px]:[.im-pump-page_&_h2]:[margin-left:auto] max-[768px]:[.im-pump-page_&_h2]:[margin-right:auto] max-[768px]:[.im-pump-page_&_>_p]:[margin-left:auto] max-[768px]:[.im-pump-page_&_>_p]:[margin-right:auto] max-[768px]:[.im-pump-page_&_>_p]:[line-height:1]!">
      <h2 id="engineering-philosophy-title">
        <span className="philosophy-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[1200px]:[.im-pump-page_&]:[white-space:normal]">
          Three Words, One Identity:
        </span>{" "}
        <br className="philosophy-desktop-break max-[768px]:[.im-pump-page_&]:[display:none]!" />
        <span className="philosophy-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[1200px]:[.im-pump-page_&]:[white-space:normal]">
          Journey to the Core of
        </span>{" "}
        <br className="philosophy-desktop-break max-[768px]:[.im-pump-page_&]:[display:none]!" />
        <span className="philosophy-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[1200px]:[.im-pump-page_&]:[white-space:normal]">
          Engineering
        </span>
      </h2>
      <p>
        Every single word in our philosophy represents an exact engineering
        commitment spanning raw metallurgy to real-time IoT monitoring.
      </p>
    </div>
  );
}
function PhilosophyCard({ card }: { card: PhilosophyCardData }) {
  const Icon =
    card.word === "I'M"
      ? IoFingerPrintOutline
      : card.word === "PUMP"
        ? IoDiamondOutline
        : FiCpu;
  return (
    <article
      className={twImPumpPage(
        `philosophy-card philosophy-card--${card.variant}`,
      )}
    >
      <div className="philosophy-card-top [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&]:[height:calc(38_*_var(--philosophy-unit))]">
        <span
          className="philosophy-card-icon [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(38_*_var(--philosophy-unit))] [.im-pump-page_&]:[height:calc(38_*_var(--philosophy-unit))] [.im-pump-page_&]:[border-radius:calc(11_*_var(--philosophy-unit))] [.im-pump-page_&]:[color:#c7e6ff]! [.im-pump-page_&]:[background:linear-gradient(135deg,_#86c7ff_0%,_#0065f5_52%,_#153fae_100%)] [.im-pump-page_&]:[box-shadow:inset_0_1px_2px_#ffffff80,_0_3px_12px_#005eff26] [.im-pump-page_&_svg]:[width:72%] [.im-pump-page_&_svg]:[height:72%] [.im-pump-page_&_svg]:[stroke-width:1.5]"
          aria-hidden="true"
        >
          <Icon />
        </span>
        <span className="philosophy-card-word [.im-pump-page_&]:[font-size:calc(27_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1]! max-[768px]:[.im-pump-page_&]:[font-size:15px]!">
          {card.word}
        </span>
      </div>
      <p className="philosophy-card-eyebrow [.im-pump-page_&]:[font-size:calc(12_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#27272a]! [.im-pump-page_.philosophy-card--primary_&&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[font-size:12px]!">
        {card.eyebrow[0]}
        <br />
        {card.eyebrow[1]}
      </p>
      <h3 className="philosophy-card-title [.im-pump-page_&]:[font-size:calc(20_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.07]! [.im-pump-page_&]:[font-weight:410]! max-[768px]:[.im-pump-page_&]:[font-size:20px]! max-[768px]:[.im-pump-page_&]:[line-height:1.07]!">
        {card.title[0]}{" "}
        <br className="philosophy-card-break max-[768px]:[.im-pump-page_&]:[display:none]!" />
        {card.title[1]}
      </h3>
      <p className="philosophy-card-description [.im-pump-page_&]:[max-width:calc(297_*_var(--philosophy-unit))] [.im-pump-page_&]:[font-size:calc(9_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[font-size:10px]! max-[768px]:[.im-pump-page_&]:[line-height:1.07]!">
        {card.description}
      </p>
    </article>
  );
}
function PhilosophyCards() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="philosophy-cards [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [.im-pump-page_&]:[gap:calc(19_*_var(--philosophy-unit))] [.im-pump-page_&]:[margin-top:calc(57_*_var(--philosophy-unit))] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[margin-top:36px] max-[768px]:[.im-pump-page_&]:[gap:18px]">
      {philosophyCards.map((card, index) => (
        <motion.div
          key={card.word}
          {...imReveal("up", 0.07 + index * 0.1, reduced, 0.15)}
        >
          <PhilosophyCard card={card} />
        </motion.div>
      ))}
    </div>
  );
}
function EngineeringProofItem({ children }: { children: string }) {
  return (
    <li className="engineering-proof-item [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[gap:calc(10_*_var(--philosophy-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(34_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-top:calc(7_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-bottom:calc(7_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&]:[border-radius:calc(6_*_var(--philosophy-unit))] [.im-pump-page_&]:[background:#f5f5f5] [.im-pump-page_&]:[color:#27272a]! [.im-pump-page_&]:[font-size:calc(12_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.15]! max-[768px]:[.im-pump-page_&]:[padding-top:10px] max-[768px]:[.im-pump-page_&]:[padding-bottom:10px] max-[768px]:[.im-pump-page_&]:[line-height:1.3]!">
      <span
        className="engineering-proof-icon [.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(20_*_var(--philosophy-unit))] [.im-pump-page_&]:[height:calc(20_*_var(--philosophy-unit))] [.im-pump-page_&]:[color:#005eff]! [.im-pump-page_&_svg]:[position:absolute] [.im-pump-page_&_svg]:[top:0] [.im-pump-page_&_svg]:[right:0] [.im-pump-page_&_svg]:[bottom:0] [.im-pump-page_&_svg]:[left:0] [.im-pump-page_&_svg]:[width:100%] [.im-pump-page_&_svg]:[height:100%]"
        aria-hidden="true"
      >
        <FiShield />
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="m8 12 3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}
function EngineeringProofPanel() {
  return (
    <div className="engineering-proof-panel [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[gap:calc(29_*_var(--philosophy-unit))] [.im-pump-page_&]:[min-height:calc(336.26_*_var(--philosophy-unit))] [.im-pump-page_&]:[margin-top:calc(34_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-top:calc(51_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(43_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-bottom:calc(51_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:calc(43_*_var(--philosophy-unit))] [.im-pump-page_&]:[border-radius:calc(30_*_var(--philosophy-unit))] [.im-pump-page_&]:[background:#fff] [.im-pump-page_&_>_h3]:[font-size:calc(25_*_var(--philosophy-unit))]! [.im-pump-page_&_>_h3]:[line-height:1.12]! [.im-pump-page_&_>_h3]:[font-weight:540]! [.im-pump-page_&_>_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]! max-[1200px]:[.im-pump-page_&]:[height:auto] max-[768px]:[.im-pump-page_&]:[margin-top:28px] max-[768px]:[.im-pump-page_&]:[padding-top:32px] max-[768px]:[.im-pump-page_&]:[padding-right:24px] max-[768px]:[.im-pump-page_&]:[padding-bottom:32px] max-[768px]:[.im-pump-page_&]:[padding-left:24px] max-[768px]:[.im-pump-page_&]:[gap:24px] max-[768px]:[.im-pump-page_&_>_h3]:[font-size:23px]! max-[768px]:[.im-pump-page_&_>_h3]:[line-height:1.15]!">
      <h3>Far More Than a Serial Number: Purpose-Built Character</h3>
      <p className="engineering-proof-description [.im-pump-page_&]:[font-size:calc(15_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[line-height:1.3]!">
        No pump leaving Sempa&apos;s production floor is a generic commodity.
        Every unit&apos;s hydraulic profile, fluid chemistry, and operating
        temperature are tailored to precise specifications, backed by certified
        performance charts.
      </p>
      <div className="engineering-proof-highlights [.im-pump-page_&_h4]:[font-size:calc(12_*_var(--philosophy-unit))]! [.im-pump-page_&_h4]:[line-height:1.12]! [.im-pump-page_&_h4]:[font-weight:410]! [.im-pump-page_&_ul]:[display:grid]! [.im-pump-page_&_ul]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.im-pump-page_&_ul]:[gap:calc(8_*_var(--philosophy-unit))_calc(18_*_var(--philosophy-unit))] [.im-pump-page_&_ul]:[margin-top:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&_ul]:[list-style:none] [.im-pump-page_&_ul]:[padding-top:0] [.im-pump-page_&_ul]:[padding-right:0] [.im-pump-page_&_ul]:[padding-bottom:0] [.im-pump-page_&_ul]:[padding-left:0] max-[768px]:[.im-pump-page_&_ul]:[grid-template-columns:1fr]">
        <h4>ENGINEERING HIGHLIGHTS &amp; PRACTICAL PROOFS</h4>
        <ul>
          {engineeringProofs.map((proof) => (
            <EngineeringProofItem key={proof}>{proof}</EngineeringProofItem>
          ))}
        </ul>
      </div>
    </div>
  );
}
function EngineeringPhilosophySection() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      className="engineering-philosophy [.im-pump-page_&]:[--philosophy-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.im-pump-page_&]:[padding-top:calc(115_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:24px] [.im-pump-page_&]:[padding-bottom:calc(115_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:24px] [.im-pump-page_&]:[background:linear-gradient(110deg,_#eef7fb_0%,_#e4f2fa_48%,_#cde7f8_100%)] [.im-pump-page_&]:[color:#0d5792]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[1200px]:[.im-pump-page_&]:[--philosophy-unit:1px] max-[1200px]:[.im-pump-page_&]:[padding-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-top:64px] max-[768px]:[.im-pump-page_&]:[padding-right:20px] max-[768px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-left:20px] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]"
      aria-labelledby="engineering-philosophy-title"
    >
      <div className="engineering-philosophy-inner [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1202_*_var(--philosophy-unit))] [.im-pump-page_&]:[margin-left:auto] [.im-pump-page_&]:[margin-right:auto]">
        <motion.div {...imReveal("left", 0, reduced, 0.2)}>
          <EngineeringPhilosophyHeading />
        </motion.div>
        <PhilosophyCards />
        <motion.div {...imReveal("up", 0.12, reduced, 0.12)}>
          <EngineeringProofPanel />
        </motion.div>
      </div>
    </section>
  );
}
type EngineeringPromise = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: [string, string];
};
const engineeringPromises: EngineeringPromise[] = [
  {
    eyebrow: "35%+ Energy Savings",
    title: "High Efficiency",
    description:
      "Targets reduced energy consumption to directly lower operational expenses.",
    highlights: [
      "Zero turbulence and friction losses via advanced CFD",
      "Full compliance with EU ErP Ecodesign directives",
    ],
  },
  {
    eyebrow: "30+ Years of Service Life",
    title: "Heavy-Duty Durability",
    description:
      "Delivers proven operational longevity even under severe, aggressive operating conditions.",
    highlights: [
      "High-purity metallurgies cast in our dedicated foundry",
      "Heavy-duty oil/grease lubricated long-life bearing arrangements",
    ],
  },
  {
    eyebrow: "Modular & Smart Integration",
    title: "System Compatibility",
    description:
      "Ensures fluid compatibility and seamless plug-and-play integration with automation systems.",
    highlights: [
      "Variable speed drive (VFD) intelligent automation compatibility",
      "Full integration with central SCADA and building management (BMS)",
    ],
  },
  {
    eyebrow: "100% Tested & Certified",
    title: "Certified Reliability",
    description:
      "Instills uncompromising confidence through 132,000 m² integrated production and global standards.",
    highlights: [
      "132,000 m² integrated manufacturing eliminating third-party reliance",
      "100% verified performance with ISO 9906 Grade 1 & 2 witnessed testing",
    ],
  },
];
function EngineeringPromisesHeader() {
  return (
    <div className="engineering-promises-header [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:minmax(0,_650fr)_minmax(0,_463fr)] [.im-pump-page_&]:[gap:calc(79_*_var(--promise-unit))] [.im-pump-page_&]:[padding-right:calc(12_*_var(--promise-unit))] [.im-pump-page_&]:[min-height:calc(130_*_var(--promise-unit))] [.im-pump-page_&]:[align-items:start] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[1200px]:[.im-pump-page_&]:[gap:32px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[768px]:[.im-pump-page_&]:[gap:24px]">
      <div className="engineering-promises-heading [.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--promise-unit))] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--promise-unit))]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_h2]:[line-height:1]! max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(40px,_11vw,_56px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&_h2]:[width:min(304px,_100%)] max-[768px]:[.im-pump-page_&_h2]:[margin-top:0] max-[768px]:[.im-pump-page_&_h2]:[overflow-wrap:anywhere]">
        <p className="engineering-promises-eyebrow [.im-pump-page_&]:[margin-left:calc(6_*_var(--promise-unit))] [.im-pump-page_&]:[font-size:calc(9_*_var(--promise-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#f7f7f7]! max-[768px]:[.im-pump-page_&]:[display:none]!">
          THE 4 CORE ENGINEERING PROMISES
        </p>
        <h2 id="engineering-promises-title">
          <span className="engineering-promises-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]">
            Efficiency, Durability,
          </span>{" "}
          <br className="engineering-promises-desktop-break max-[768px]:[.im-pump-page_&]:[display:none]!" />
          <span className="engineering-promises-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]">
            Compatibility &amp; Reliability
          </span>
        </h2>
      </div>
      <div className="engineering-promises-introduction [.im-pump-page_&_>_p]:[margin-top:calc(10_*_var(--promise-unit))] [.im-pump-page_&_>_p]:[font-size:calc(15_*_var(--promise-unit))]! [.im-pump-page_&_>_p]:[line-height:1]! [.im-pump-page_&_>_p]:[color:#f7f7f7]! max-[1200px]:[.im-pump-page_&]:[max-width:463px] max-[1200px]:[.im-pump-page_&_>_p]:[line-height:1.2]! max-[768px]:[.im-pump-page_&]:[order:-1]">
        <Image
          src="/im-pump/im-pump%20icon.png"
          alt="I'm Pump Technology"
          width={680}
          height={128}
          sizes="(min-width: 2560px) 303px, (min-width: 1200px) 12vw, 170px"
          className="engineering-promises-logo [.im-pump-page_&]:[width:calc(170_*_var(--promise-unit))] [.im-pump-page_&]:[height:auto]"
        />
        <p>
          Reliability Our promises deliver measurable impact: slashing power
          bills, preventing catastrophic shutdowns, and delivering 30-year
          lifecycle confidence.
        </p>
      </div>
    </div>
  );
}
function EngineeringPromiseChecklist({
  highlights,
}: {
  highlights: EngineeringPromise["highlights"];
}) {
  return (
    <ul className="engineering-promise-checklist [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[gap:calc(13_*_var(--promise-unit))] [.im-pump-page_&]:[margin-top:0] [.im-pump-page_&]:[margin-right:0] [.im-pump-page_&]:[margin-bottom:0] [.im-pump-page_&]:[margin-left:0] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[list-style:none] [.im-pump-page_&_li]:[display:flex]! [.im-pump-page_&_li]:[align-items:flex-start] [.im-pump-page_&_li]:[gap:calc(7_*_var(--promise-unit))] [.im-pump-page_&_li]:[min-height:calc(20_*_var(--promise-unit))] [.im-pump-page_&_li]:[font-size:calc(9_*_var(--promise-unit))]! [.im-pump-page_&_li]:[line-height:1.12]! [.im-pump-page_&_li]:[color:#9eb7d0]! [.im-pump-page_&_svg]:[flex-shrink:0] [.im-pump-page_&_svg]:[width:calc(15_*_var(--promise-unit))] [.im-pump-page_&_svg]:[height:calc(15_*_var(--promise-unit))] [.im-pump-page_&_svg]:[color:#005eff]! [.im-pump-page_&_svg]:[stroke-width:1.5] [.im-pump-page_&_span]:[min-width:0]">
      {highlights.map((highlight) => (
        <li key={highlight}>
          <FiCheck aria-hidden="true" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  );
}
function EngineeringPromiseCard({ promise }: { promise: EngineeringPromise }) {
  return (
    <article className="engineering-promise-card [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(32_*_var(--promise-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(277_*_var(--promise-unit))] [.im-pump-page_&]:[padding-top:calc(31_*_var(--promise-unit))] [.im-pump-page_&]:[padding-right:calc(20_*_var(--promise-unit))] [.im-pump-page_&]:[padding-bottom:calc(31_*_var(--promise-unit))] [.im-pump-page_&]:[padding-left:calc(20_*_var(--promise-unit))] [.im-pump-page_&]:[border:0.5px_solid_#9eb7d0] [.im-pump-page_&]:[border-radius:calc(30_*_var(--promise-unit))] [.im-pump-page_&]:[background:linear-gradient(35deg,_#ffffff_0%,_#ffffffb3_43%,_#ffffff00_100%)] max-[768px]:[.im-pump-page_&]:[min-height:277px]">
      <div className="engineering-promise-information [.im-pump-page_&_h3]:[margin-top:calc(13_*_var(--promise-unit))] [.im-pump-page_&_h3]:[font-size:calc(20_*_var(--promise-unit))]! [.im-pump-page_&_h3]:[font-weight:410]! [.im-pump-page_&_h3]:[line-height:1.07]! [.im-pump-page_&_h3]:[white-space:nowrap] max-[768px]:[.im-pump-page_&_h3]:[white-space:normal]">
        <p className="engineering-promise-eyebrow [.im-pump-page_&]:[font-size:calc(12_*_var(--promise-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#4687b8]!">
          {promise.eyebrow}
        </p>
        <h3>{promise.title}</h3>
        <p className="engineering-promise-description [.im-pump-page_&]:[margin-top:calc(13_*_var(--promise-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--promise-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]!">
          {promise.description}
        </p>
      </div>
      <EngineeringPromiseChecklist highlights={promise.highlights} />
    </article>
  );
}
function EngineeringPromisesGrid() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="engineering-promises-grid [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [.im-pump-page_&]:[gap:calc(13_*_var(--promise-unit))] [.im-pump-page_&]:[max-width:calc(1199_*_var(--promise-unit))] [.im-pump-page_&]:[margin-top:calc(60_*_var(--promise-unit))] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[1200px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[margin-top:60px] max-[768px]:[.im-pump-page_&]:[gap:18px]">
      {engineeringPromises.map((promise, index) => (
        <motion.div
          key={promise.title}
          {...imReveal("up", 0.05 + index * 0.08, reduced, 0.13)}
        >
          <EngineeringPromiseCard promise={promise} />
        </motion.div>
      ))}
    </div>
  );
}
function EngineeringPromisesSection() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      className="engineering-promises [.im-pump-page_&]:[--promise-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.im-pump-page_&]:[padding-top:calc(115_*_var(--promise-unit))] [.im-pump-page_&]:[padding-right:24px] [.im-pump-page_&]:[padding-bottom:calc(115_*_var(--promise-unit))] [.im-pump-page_&]:[padding-left:24px] [.im-pump-page_&]:[background:#9eb7d0] [.im-pump-page_&]:[color:#0d5792]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[1200px]:[.im-pump-page_&]:[--promise-unit:1px] max-[1200px]:[.im-pump-page_&]:[padding-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-top:64px] max-[768px]:[.im-pump-page_&]:[padding-right:20px] max-[768px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-left:20px] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]"
      aria-labelledby="engineering-promises-title"
    >
      <div className="engineering-promises-inner [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1204_*_var(--promise-unit))] [.im-pump-page_&]:[margin-left:auto] [.im-pump-page_&]:[margin-right:auto]">
        <motion.div {...imReveal("left", 0, reduced, 0.18)}>
          <EngineeringPromisesHeader />
        </motion.div>
        <EngineeringPromisesGrid />
      </div>
    </section>
  );
}
type StandardCategory = "all" | "en733" | "iso2858" | "nfpa20" | "iso9906";
type Standard = {
  id: string;
  category: Exclude<StandardCategory, "all">;
  code: string;
  title: string;
  description: string;
  applicationTitle: string;
  applicationDescription: string;
};
const standardFilters: {
  category: StandardCategory;
  label: string;
}[] = [
  { category: "all", label: "Tümü" },
  { category: "en733", label: "EN 733" },
  { category: "iso2858", label: "ISO 2858" },
  { category: "nfpa20", label: "NFPA 20" },
  { category: "iso9906", label: "ISO 9906" },
];
const standards: Standard[] = [
  {
    id: "ts-en-733",
    category: "en733",
    code: "TS EN 733",
    title: "End-Suction Centrifugal Pumps (10 bar)",
    description:
      "Rated operating points, principal dimensions, and modular casing standards.",
    applicationTitle: "SEMPA APPLICATION & PRODUCT SERIES",
    applicationDescription:
      "100% implemented across TKF and TKF-M series end-suction monoblock pumps.",
  },
  {
    id: "iso-2858-5199",
    category: "iso2858",
    code: "ISO 2858 / ISO 5199",
    title: "Chemical & Industrial Heavy-Duty Process Pumps",
    description:
      "16-bar heavy process benchmarks, shaft deflection, bearing life, and flange ratings.",
    applicationTitle: "SEMPA APPLICATION & PRODUCT SERIES",
    applicationDescription:
      "Standard baseline for petrochemical, industrial process, and aggressive liquid lines.",
  },
  {
    id: "nfpa-20-ul-fm",
    category: "nfpa20",
    code: "NFPA 20 / UL / FM",
    title: "Stationary Pumps for Fire Protection Service",
    description:
      "Strict mandate guaranteeing at least 65% head at 150% rated flow capacity.",
    applicationTitle: "SEMPA APPLICATION & PRODUCT SERIES",
    applicationDescription:
      "Certified across SEMPA UL-listed and FM-approved split-case & end-suction fire sets.",
  },
  {
    id: "iso-9906",
    category: "iso9906",
    code: "ISO 9906 Grade 1 & 2",
    title: "Hydraulic Flow Acceptance Performance Tests",
    description:
      "High-precision laboratory verification of flow rate, head, absorbed power and efficiency",
    applicationTitle: "SEMPA APPLICATION & PRODUCT SERIES",
    applicationDescription:
      "Applied to every manufactured pump in our 1,500 m³ SCADA-controlled test bay.",
  },
];
function StandardsHeading() {
  return (
    <div className="standards-heading [.im-pump-page_&_>_p]:[font-size:calc(9_*_var(--standard-unit))]! [.im-pump-page_&_>_p]:[line-height:1.12]! [.im-pump-page_&_>_p]:[color:#9eb7d0]! [.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--standard-unit))] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--standard-unit))]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_h2]:[line-height:1]! max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.4vw,_42px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&]:[text-align:center]">
      <p>GLOBAL NORMS &amp; ACCREDITATION MATRIX</p>
      <h2 id="standards-title">
        <span className="standards-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]">
          100% Conformance to
        </span>{" "}
        <br className="standards-desktop-break max-[768px]:[.im-pump-page_&]:[display:none]!" />
        <span className="standards-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]">
          International Standards
        </span>
      </h2>
    </div>
  );
}
function StandardsFilter({
  activeCategory,
  onSelect,
  onNext,
}: {
  activeCategory: StandardCategory;
  onSelect: (category: StandardCategory) => void;
  onNext: () => void;
}) {
  return (
    <div
      className="standards-filter [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[height:calc(34_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(68_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:calc(2_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(10_*_var(--standard-unit))] [.im-pump-page_&]:[padding-bottom:calc(2_*_var(--standard-unit))] [.im-pump-page_&]:[padding-left:calc(10_*_var(--standard-unit))] [.im-pump-page_&]:[border-radius:calc(8_*_var(--standard-unit))] [.im-pump-page_&]:[background:#f5f5f4] [.im-pump-page_&]:[box-shadow:0_3px_12px_#0d579210] [.im-pump-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.im-pump-page_&_button:focus-visible]:[outline-offset:2px] max-[1200px]:[.im-pump-page_&]:[max-width:509px] max-[1200px]:[.im-pump-page_&]:[margin-top:0] max-[768px]:[.im-pump-page_&]:[gap:10px]"
      role="group"
      aria-label="Filter international standards"
    >
      <div className="standards-filter-options [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex:1] [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&_button]:[flex-shrink:0] [.im-pump-page_&_button]:[padding-top:calc(5_*_var(--standard-unit))] [.im-pump-page_&_button]:[padding-right:calc(8_*_var(--standard-unit))] [.im-pump-page_&_button]:[padding-bottom:calc(5_*_var(--standard-unit))] [.im-pump-page_&_button]:[padding-left:calc(8_*_var(--standard-unit))] [.im-pump-page_&_button]:[border:0] [.im-pump-page_&_button]:[border-radius:calc(5_*_var(--standard-unit))] [.im-pump-page_&_button]:[background:transparent] [.im-pump-page_&_button]:[color:#27272a]! [.im-pump-page_&_button]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&_button]:[line-height:1.08]! [.im-pump-page_&_button]:[white-space:nowrap] [.im-pump-page_&_button]:[cursor:pointer] [.im-pump-page_&_button:hover]:[background:#ffffff80] [.im-pump-page_&_button[aria-pressed='true']]:[background:#fff] [.im-pump-page_&_button[aria-pressed='true']]:[box-shadow:0_1px_4px_#0d579214] max-[1200px]:[.im-pump-page_&]:[overflow-x:auto] max-[1200px]:[.im-pump-page_&]:[justify-content:flex-start] max-[1200px]:[.im-pump-page_&]:[scrollbar-width:thin] max-[768px]:[.im-pump-page_&]:[gap:8px] max-[768px]:[.im-pump-page_&]:[scrollbar-width:none] max-[768px]:[.im-pump-page_&::-webkit-scrollbar]:[display:none]!">
        {standardFilters.map((filter) => (
          <button
            key={filter.category}
            type="button"
            aria-pressed={activeCategory === filter.category}
            aria-controls="standards-grid"
            onClick={() => onSelect(filter.category)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <button
        className="standards-filter-next [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(23_*_var(--standard-unit))] [.im-pump-page_&]:[height:calc(23_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[border:0] [.im-pump-page_&]:[border-radius:50%] [.im-pump-page_&]:[color:#fff]! [.im-pump-page_&]:[background:linear-gradient(135deg,_#005eff,_#001ea2)] [.im-pump-page_&]:[box-shadow:0_0_8px_#005eff40] [.im-pump-page_&]:[cursor:pointer] [.im-pump-page_&_svg]:[width:65%] [.im-pump-page_&_svg]:[height:65%] [.im-pump-page_&_svg]:[stroke-width:2]"
        type="button"
        aria-label="Select next standard filter"
        aria-controls="standards-grid"
        onClick={onNext}
      >
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}
function StandardCard({ standard }: { standard: Standard }) {
  return (
    <article className="standard-card [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(238_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:calc(31_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(20_*_var(--standard-unit))] [.im-pump-page_&]:[padding-bottom:calc(31_*_var(--standard-unit))] [.im-pump-page_&]:[padding-left:calc(20_*_var(--standard-unit))] [.im-pump-page_&]:[border:0.5px_solid_#9eb7d0] [.im-pump-page_&]:[border-radius:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[background:linear-gradient(125deg,_#fff_0%,_#ffffff80_48%,_#ffffff00_100%)] [.im-pump-page_&]:[backdrop-filter:blur(16.8px)] max-[1200px]:[.im-pump-page_&]:[height:auto] max-[768px]:[.im-pump-page_&]:[min-height:300px] max-[768px]:[.im-pump-page_&]:[padding-top:30px] max-[768px]:[.im-pump-page_&]:[padding-right:22px] max-[768px]:[.im-pump-page_&]:[padding-bottom:30px] max-[768px]:[.im-pump-page_&]:[padding-left:22px]">
      <div className="standard-card-information [.im-pump-page_&_h3]:[margin-top:calc(13_*_var(--standard-unit))] [.im-pump-page_&_h3]:[font-size:calc(20_*_var(--standard-unit))]! [.im-pump-page_&_h3]:[font-weight:410]! [.im-pump-page_&_h3]:[line-height:1.07]!">
        <p className="standard-card-code [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[font-weight:410]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#005eff]!">
          {standard.code}
        </p>
        <h3>{standard.title}</h3>
        <p className="standard-card-description [.im-pump-page_&]:[margin-top:calc(13_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[line-height:1.25]!">
          {standard.description}
        </p>
      </div>
      <div className="standard-card-application [.im-pump-page_&_h4]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&_h4]:[font-weight:410]! [.im-pump-page_&_h4]:[line-height:1.12]! [.im-pump-page_&_h4]:[color:#005eff]! [.im-pump-page_&_>_p]:[max-width:calc(480_*_var(--standard-unit))] [.im-pump-page_&_>_p]:[margin-top:calc(13_*_var(--standard-unit))] [.im-pump-page_&_>_p]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&_>_p]:[line-height:1.12]! [.im-pump-page_&_>_p]:[color:#27272a]! max-[768px]:[.im-pump-page_&_>_p]:[line-height:1.25]!">
        <h4>{standard.applicationTitle}</h4>
        <p>{standard.applicationDescription}</p>
      </div>
    </article>
  );
}
function StandardsGrid({ visibleStandards }: { visibleStandards: Standard[] }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      id="standards-grid"
      className="standards-grid [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.im-pump-page_&]:[align-content:start] [.im-pump-page_&]:[gap:calc(20_*_var(--standard-unit))_calc(26_*_var(--standard-unit))] [.im-pump-page_&]:[min-height:calc(496_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(47_*_var(--standard-unit))] max-[1200px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[min-height:0] max-[768px]:[.im-pump-page_&]:[margin-top:36px]"
    >
      {visibleStandards.map((standard, index) => (
        <motion.div
          key={standard.id}
          {...imReveal("up", 0.04 + index * 0.07, reduced, 0.13)}
        >
          <StandardCard standard={standard} />
        </motion.div>
      ))}
    </div>
  );
}
function EngineeringLifecycleHeading() {
  return (
    <div className="engineering-lifecycle-heading [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:minmax(0,_702fr)_minmax(0,_376fr)] [.im-pump-page_&]:[gap:calc(124_*_var(--standard-unit))] [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1204_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(95_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(2_*_var(--standard-unit))] [.im-pump-page_&]:[align-items:start] [.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--standard-unit))] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--standard-unit))]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_h2]:[line-height:1]! [.im-pump-page_&_h2]:[letter-spacing:-0.04em] [.im-pump-page_&_h2]:[color:#0d5792]! max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[1200px]:[.im-pump-page_&]:[gap:24px] max-[1200px]:[.im-pump-page_&]:[margin-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[768px]:[.im-pump-page_&]:[margin-top:64px] max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.3vw,_42px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&]:[text-align:center] max-[768px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&_h2]:[max-width:320px] max-[768px]:[.im-pump-page_&_h2]:[margin-left:auto] max-[768px]:[.im-pump-page_&_h2]:[margin-right:auto]">
      <div>
        <p className="engineering-lifecycle-eyebrow [.im-pump-page_&]:[font-size:calc(9_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]!">
          ENGINEERING LIFECYCLE · 6-STEP QUALITY JOURNEY
        </p>
        <h2 id="engineering-lifecycle-title">
          <span className="engineering-lifecycle-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]">
            From 3D CFD Simulation to
          </span>{" "}
          <br className="engineering-lifecycle-desktop-break max-[768px]:[.im-pump-page_&]:[display:none]!" />
          <span className="engineering-lifecycle-heading-line [.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]">
            1,500 m³ Accredited Bay
          </span>
        </h2>
      </div>
      <p className="engineering-lifecycle-description [.im-pump-page_&]:[margin-top:calc(82_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(15_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1]! [.im-pump-page_&]:[color:#9eb7d0]! max-[1200px]:[.im-pump-page_&]:[max-width:376px] max-[1200px]:[.im-pump-page_&]:[margin-top:0] max-[1200px]:[.im-pump-page_&]:[line-height:1.2]! max-[768px]:[.im-pump-page_&]:[margin-left:auto] max-[768px]:[.im-pump-page_&]:[margin-right:auto] max-[768px]:[.im-pump-page_&]:[line-height:1]!">
        Every pump undergoes seamless digital CFD validation, in-house
        metallurgical verification, and full-scale hydrodynamic testing.
      </p>
    </div>
  );
}
type LifecycleStepData = {
  id: string;
  title: string;
  description: string;
  // null explicitly represents a missing photo; set a real public URL when supplied.
  image: string | null;
};
const lifecycleStages: LifecycleStepData[] = [
  {
    id: "hydraulic-cfd",
    title: "Advanced Hydraulic Design & CFD Simulation",
    description:
      "Every pump genesis begins with 3D computational fluid simulations. Liquid velocity vectors through the impeller and volute casing are refined to eliminate cavitation (NPSH) and vortex turbulence.",
    image: null,
  },
  {
    id: "foundry-spectrometry",
    title: "Dedicated Foundry Casting & Spectrometry Inspection",
    description:
      "Raw charges are melted in our induction furnaces. Prior to pouring, optical emission spectrometers confirm the exact chemical composition of grey iron, ductile iron, bronze, and stainless steels.",
    image: null,
  },
  {
    id: "multi-axis-cnc",
    title: "360° Multi-Axis High-Precision CNC Machining",
    description:
      "Raw castings, impellers, and shafts pass into our 5-axis CNC machining bays, shaped to micron tolerances. This surgical alignment prevents mechanical seal wear and bearing runout.",
    image: null,
  },
  {
    id: "dynamic-balancing",
    title: "Dynamic Balancing & Vibration Analysis (ISO 1940)",
    description:
      "Rotating assemblies—impellers, shafts, and flexible couplings—are dynamically balanced on electronic balancers under ISO 1940 criteria, securing vibration-free performance at maximum RPM.",
    image: null,
  },
  {
    id: "accredited-test-bay",
    title: "100% Hydraulic Verification in 1,500 m³ Accredited Test Bay",
    description:
      "Prior to dispatch, every single pump is submerged and coupled in our 1,500 m³ accredited testing bay under ISO 9906 Grade 1/2 protocols, verifying flow, head, power, and NPSH curves.",
    image: null,
  },
  {
    id: "digital-iot",
    title: "Digital Solutions, Selection Software & IoT Tracking",
    description:
      "Our proprietary digital pump sizing software calculates the ideal duty point. Furthermore, integrated smart sensors monitor real-time temperature, vibration, and flow for predictive maintenance.",
    image: null,
  },
];
function getLifecycleVisibleIndices(
  activeIndex: number,
  total: number,
  visibleCount: number,
  centered = false,
) {
  if (!total) return [];
  const count = Math.min(visibleCount, total);
  const anchor = centered ? Math.floor(count / 2) : Math.min(2, count - 1);
  return Array.from(
    { length: count },
    (_, slot) => (((activeIndex - anchor + slot) % total) + total) % total,
  );
}
function getLifecycleRotation(current: number, target: number, total: number) {
  const forward = (((target - current) % total) + total) % total;
  return forward > total / 2 ? forward - total : forward;
}
function LifecycleStepImage({
  step,
  active,
  onSelect,
}: {
  step: LifecycleStepData;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="lifecycle-image-slot [.im-pump-page_&]:[height:calc(205_*_var(--standard-unit))] max-[1200px]:[.im-pump-page_&]:[display:flex]! max-[1200px]:[.im-pump-page_&]:[justify-content:center]">
      <button
        type="button"
        className="lifecycle-image [.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[display:block]! [.im-pump-page_&]:[width:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[height:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[max-width:100%] [.im-pump-page_&]:[overflow:hidden] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[border:0] [.im-pump-page_&]:[border-radius:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[background:#c3ddec] [.im-pump-page_&]:[cursor:pointer] [.im-pump-page_&]:[transition:width_300ms_ease,_height_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[width:calc(160_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[height:calc(205_*_var(--standard-unit))]"
        onClick={onSelect}
        aria-label={`Select ${step.title}`}
        aria-pressed={active}
      >
        {step.image ? (
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="(min-width: 2560px) 285px, (min-width: 1200px) 12vw, 160px"
            className="object-cover"
          />
        ) : (
          <span className="lifecycle-photo-placeholder [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[height:100%] [.im-pump-page_&]:[background:linear-gradient(145deg,_#c8e6f5,_#85b5d1)] [.im-pump-page_&]:[color:#4687b8]! [.im-pump-page_&_svg]:[width:28%] [.im-pump-page_&_svg]:[height:28%] [.im-pump-page_&_svg]:[stroke-width:1]">
            <FiImage aria-hidden="true" />
            <span className="sr-only">Photo pending: {step.title}</span>
          </span>
        )}
      </button>
    </div>
  );
}
function LifecycleStepContent({
  step,
  active,
  onSelect,
}: {
  step: LifecycleStepData;
  active: boolean;
  onSelect: () => void;
}) {
  const Arrow = active ? FiArrowDownRight : FiArrowUpRight;
  return (
    <button
      className="lifecycle-step-content [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[align-items:flex-start] [.im-pump-page_&]:[gap:calc(16_*_var(--standard-unit))] [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[margin-top:calc(20_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[border:0] [.im-pump-page_&]:[border-radius:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[background:transparent] [.im-pump-page_&]:[text-align:left] [.im-pump-page_&]:[color:#27272a]! [.im-pump-page_&]:[cursor:pointer] [.im-pump-page_&]:[transition:background-color_300ms_ease,_box-shadow_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[min-height:calc(249_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[justify-content:space-between] [.im-pump-page_.lifecycle-step--active_&&]:[padding-top:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[padding-right:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[padding-bottom:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[padding-left:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[background:#f7f7f7] [.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_calc(-59_*_var(--standard-unit))_calc(95.9_*_var(--standard-unit))_#005eff26] max-[1200px]:[.im-pump-page_&]:[max-width:160px] max-[1200px]:[.im-pump-page_&]:[margin-top:32px] max-[1200px]:[.im-pump-page_&]:[margin-right:auto] max-[1200px]:[.im-pump-page_&]:[margin-bottom:0] max-[1200px]:[.im-pump-page_&]:[margin-left:auto]"
      type="button"
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="lifecycle-step-title [.im-pump-page_&]:[display:block]! [.im-pump-page_&]:[max-width:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[font-weight:410]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[overflow-wrap:anywhere] [.im-pump-page_&]:[transition:font-size_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[max-width:none] [.im-pump-page_.lifecycle-step--active_&&]:[width:100%] [.im-pump-page_.lifecycle-step--active_&&]:[font-size:calc(20_*_var(--standard-unit))]! [.im-pump-page_.lifecycle-step--active_&&]:[line-height:1.07]! [.im-pump-page_.lifecycle-step--active_&&]:[text-align:center]">
        {step.title}
      </span>
      <span
        className="lifecycle-selection-arrow [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[height:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[border-radius:50%] [.im-pump-page_&]:[color:#fff]! [.im-pump-page_&]:[background:#27272a] [.im-pump-page_&]:[transition:background-color_300ms_ease] [.im-pump-page_&_svg]:[width:64%] [.im-pump-page_&_svg]:[height:64%] [.im-pump-page_&_svg]:[stroke-width:1.8] [.im-pump-page_.lifecycle-step--active_&&]:[background:#005eff] [.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_0_12px_#005eff30] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[background:linear-gradient(135deg,_#438aff,_#004bdc)] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[border:0.5px_solid_#dceaff] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_0_20px_7px_#005eff40]"
        aria-hidden="true"
      >
        <Arrow />
      </span>
    </button>
  );
}
function LifecycleNavigation({
  canRotate,
  onPrevious,
  onNext,
}: {
  canRotate: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="lifecycle-navigation [.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[justify-content:center] [.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(12_*_var(--standard-unit))] [.im-pump-page_&_button]:[display:grid]! [.im-pump-page_&_button]:[place-items:center] [.im-pump-page_&_button]:[width:calc(34_*_var(--standard-unit))] [.im-pump-page_&_button]:[height:calc(34_*_var(--standard-unit))] [.im-pump-page_&_button]:[border:0] [.im-pump-page_&_button]:[padding-top:0] [.im-pump-page_&_button]:[padding-right:0] [.im-pump-page_&_button]:[padding-bottom:0] [.im-pump-page_&_button]:[padding-left:0] [.im-pump-page_&_button]:[background:transparent] [.im-pump-page_&_button]:[color:#9eb7d0]! [.im-pump-page_&_button]:[cursor:pointer] [.im-pump-page_&_svg]:[width:65%] [.im-pump-page_&_svg]:[height:65%] [.im-pump-page_&_button:hover:not(:disabled)]:[color:#0d5792]! [.im-pump-page_&_button:disabled]:[opacity:0.35] [.im-pump-page_&_button:disabled]:[cursor:default] max-[1200px]:[.im-pump-page_&]:[margin-top:42px] max-[1200px]:[.im-pump-page_&_svg]:[width:90%] max-[1200px]:[.im-pump-page_&_svg]:[height:90%]"
      aria-label="Engineering stage navigation"
    >
      <button
        type="button"
        aria-label="Rotate carousel left"
        disabled={!canRotate}
        onClick={onPrevious}
      >
        <FiArrowLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Rotate carousel right"
        disabled={!canRotate}
        onClick={onNext}
      >
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}
function LifecycleStep({
  step,
  active,
  index,
  onSelect,
}: {
  step: LifecycleStepData;
  active: boolean;
  index: number;
  onSelect: () => void;
}) {
  return (
    <li
      className={twImPumpPage(
        `lifecycle-step${active ? " lifecycle-step--active" : ""}`,
      )}
      data-lifecycle-id={step.id}
      data-step-index={index}
      aria-current={active ? "step" : undefined}
    >
      <LifecycleStepImage step={step} active={active} onSelect={onSelect} />
      <LifecycleStepContent step={step} active={active} onSelect={onSelect} />
      {active && (
        <div
          className="lifecycle-navigation-slot [.im-pump-page_&]:[height:calc(46_*_var(--standard-unit))] max-[1200px]:[.im-pump-page_&]:[height:100px]"
          aria-hidden="true"
        />
      )}
      <p className="lifecycle-step-description [.im-pump-page_&]:[width:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[max-width:100%] [.im-pump-page_&]:[margin-top:calc(24_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! [.im-pump-page_&]:[overflow-wrap:anywhere] [.im-pump-page_&]:[transition:font-size_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[width:calc(149_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[margin-left:auto] [.im-pump-page_.lifecycle-step--active_&&]:[margin-right:auto] [.im-pump-page_.lifecycle-step--active_&&]:[font-size:calc(15_*_var(--standard-unit))]! [.im-pump-page_.lifecycle-step--active_&&]:[line-height:1]! [.im-pump-page_.lifecycle-step--active_&&]:[text-align:center] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[width:150px] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[margin-left:auto] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[margin-right:auto] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[font-size:15px]! max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[line-height:1]!">
        {step.description}
      </p>
    </li>
  );
}
function LifecycleEdgeBlur() {
  return (
    <div
      className="lifecycle-edge-blur [.im-pump-page_&]:[position:absolute] [.im-pump-page_&]:[top:0] [.im-pump-page_&]:[right:0] [.im-pump-page_&]:[bottom:0] [.im-pump-page_&]:[left:auto] [.im-pump-page_&]:[width:10%] [.im-pump-page_&]:[pointer-events:none] [.im-pump-page_&]:[z-index:2] [.im-pump-page_&_span]:[position:absolute] [.im-pump-page_&_span]:[top:0] [.im-pump-page_&_span]:[right:0] [.im-pump-page_&_span]:[bottom:0] [.im-pump-page_&_span]:[left:0] [.im-pump-page_&_span]:[mask-image:linear-gradient(90deg,_transparent,_#000)] [.im-pump-page_&_span:nth-child(1)]:[backdrop-filter:blur(3px)] [.im-pump-page_&_span:nth-child(2)]:[left:30%] [.im-pump-page_&_span:nth-child(2)]:[backdrop-filter:blur(8px)] [.im-pump-page_&_span:nth-child(3)]:[left:55%] [.im-pump-page_&_span:nth-child(3)]:[backdrop-filter:blur(16px)] [.im-pump-page_&_span:nth-child(4)]:[left:78%] [.im-pump-page_&_span:nth-child(4)]:[backdrop-filter:blur(34.1px)] [.im-pump-page_&_span:nth-child(4)]:[background:#f5fafc55] max-[1200px]:[.im-pump-page_&]:[display:none]!"
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

// Both directions transition the complete track, including its images and copy.
// Old and new slides share a physical path and crossfade as a single scene.
type LifecycleSlide = { direction: number; distance: number };
const lifecycleSlideTransition = {
  duration: 0.7,
  ease: imMotionEase,
};

function EngineeringLifecycleCarousel({
  steps = lifecycleStages,
}: {
  steps?: LifecycleStepData[];
}) {
  const reduced = useReducedMotion() ?? false;
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.min(2, Math.max(steps.length - 1, 0)),
  );
  const [visibleCount, setVisibleCount] = useState(6);
  const [compact, setCompact] = useState(false);
  const swipeStart = useRef<{
    x: number;
    y: number;
  } | null>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const strideRef = useRef(0);
  const slideRef = useRef<LifecycleSlide>({ direction: 1, distance: 0 });
  // Both the entering and the exiting track read the *current* navigation
  // direction. This does not depend on Framer passing a custom argument.
  const trackVariants = useRef<Variants>({
    enter: () => ({
      x: slideRef.current.direction * slideRef.current.distance,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: () => ({
      x: -slideRef.current.direction * slideRef.current.distance,
      opacity: 0,
    }),
  }).current;
  const navigationRef = useRef<HTMLDivElement>(null);
  // Keep an unbounded rotation counter so physical direction survives wraparound.
  const activeIndex = steps.length
    ? ((selectedIndex % steps.length) + steps.length) % steps.length
    : 0;
  const visibleIndices = getLifecycleVisibleIndices(
    activeIndex,
    steps.length,
    visibleCount,
    compact,
  );
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    const updateCount = () => {
      setVisibleCount(desktop.matches ? 6 : 3);
      setCompact(!desktop.matches);
    };
    updateCount();
    desktop.addEventListener("change", updateCount);
    return () => {
      desktop.removeEventListener("change", updateCount);
    };
  }, []);
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const cards = track.querySelectorAll<HTMLElement>("[data-lifecycle-id]");
      strideRef.current =
        cards.length > 1
          ? cards[1].offsetLeft - cards[0].offsetLeft
          : track.clientWidth;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [selectedIndex, visibleCount, compact, steps]);
  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    const activeItem = track?.querySelector<HTMLElement>(
      ".lifecycle-step--active",
    );
    const content = activeItem?.querySelector<HTMLElement>(
      ".lifecycle-step-content",
    );
    if (!track || !viewport || !activeItem || !content) return;
    const positionNavigation = () => {
      if (!navigationRef.current) return;
      Object.assign(navigationRef.current.style, {
        left: `${activeItem.offsetLeft + track.offsetLeft}px`,
        width: `${activeItem.offsetWidth}px`,
        top: `${content.offsetTop + content.offsetHeight}px`,
      });
    };
    positionNavigation();
    const observer = new ResizeObserver(positionNavigation);
    observer.observe(viewport);
    observer.observe(track);
    observer.observe(content);
    return () => observer.disconnect();
  }, [selectedIndex, visibleCount, compact, steps]);
  const navigate = (delta: number) => {
    if (!delta) return;
    slideRef.current = {
      direction: Math.sign(delta),
      distance: Math.abs(delta) * strideRef.current,
    };
    setSelectedIndex((current) => current + delta);
  };
  if (!steps.length) return null;
  return (
    <div
      className="lifecycle-carousel [.im-pump-page_&]:[margin-top:calc(168_*_var(--standard-unit))] [.im-pump-page_&]:[margin-left:calc(-8.5_*_var(--standard-unit))] [.im-pump-page_&]:[margin-right:calc(-8.5_*_var(--standard-unit))] [.im-pump-page_&]:[letter-spacing:-0.04em] [.im-pump-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.im-pump-page_&_button:focus-visible]:[outline-offset:3px] max-[1200px]:[.im-pump-page_&]:[margin-top:48px] max-[1200px]:[.im-pump-page_&]:[margin-left:-20px] max-[1200px]:[.im-pump-page_&]:[margin-right:-20px] max-[1200px]:[.im-pump-page_&]:[margin-bottom:0] motion-reduce:[.im-pump-page_&_*]:[transition:none]!"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="engineering-lifecycle-title"
      style={
        { "--lifecycle-visible-count": visibleIndices.length } as CSSProperties
      }
    >
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Stage {activeIndex + 1} of {steps.length}: {steps[activeIndex].title}
      </p>
      <div
        className="lifecycle-viewport [.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[isolation:isolate] [.im-pump-page_&]:[min-height:calc(872.23_*_var(--standard-unit))] [.im-pump-page_&]:[overflow:clip] max-[1200px]:[.im-pump-page_&]:[min-height:850px] max-[1200px]:[.im-pump-page_&]:[touch-action:pan-y]"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          swipeStart.current =
            event.touches.length === 1
              ? { x: touch.clientX, y: touch.clientY }
              : null;
        }}
        onTouchCancel={() => {
          swipeStart.current = null;
        }}
        onTouchEnd={(event) => {
          const start = swipeStart.current;
          const touch = event.changedTouches[0];
          swipeStart.current = null;
          if (!start || !touch) return;
          const dx = touch.clientX - start.x;
          if (
            Math.abs(dx) > 40 &&
            Math.abs(dx) > Math.abs(touch.clientY - start.y)
          )
            navigate(dx < 0 ? 1 : -1);
        }}
      >
        <div className="relative grid w-full">
          <AnimatePresence initial={false}>
            <motion.ol
              key={selectedIndex}
              data-lifecycle-track-key={selectedIndex}
              variants={trackVariants}
              initial={reduced ? false : "enter"}
              animate="center"
              exit={reduced ? undefined : "exit"}
              transition={reduced ? { duration: 0 } : lifecycleSlideTransition}
              style={{ gridArea: "1 / 1" }}
              className="lifecycle-track [.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(var(--lifecycle-visible-count),_minmax(0,_1fr))] [.im-pump-page_&]:[gap:calc(51_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:0] [.im-pump-page_&]:[margin-right:0] [.im-pump-page_&]:[margin-bottom:0] [.im-pump-page_&]:[margin-left:0] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[list-style:none] [.im-pump-page_&]:[align-items:start] max-[1200px]:[.im-pump-page_&]:[gap:70px] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(var(--lifecycle-visible-count),_160px)] max-[1200px]:[.im-pump-page_&]:[width:620px] max-[1200px]:[.im-pump-page_&]:[left:calc(50%_-_310px)]"
              ref={(node) => {
                if (node) {
                  trackRef.current = node;
                } else if (
                  trackRef.current?.dataset.lifecycleTrackKey ===
                  String(selectedIndex)
                ) {
                  trackRef.current = null;
                }
              }}
            >
              {visibleIndices.map((index) => {
                const step = steps[index];
                return (
                  <LifecycleStep
                    key={step.id}
                    step={step}
                    active={index === activeIndex}
                    index={index}
                    onSelect={() =>
                      navigate(
                        getLifecycleRotation(
                          selectedIndex,
                          index,
                          steps.length,
                        ),
                      )
                    }
                  />
                );
              })}
            </motion.ol>
          </AnimatePresence>
        </div>
        <div
          className="lifecycle-navigation-fixed transition-[left,top,width] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [.im-pump-page_&]:[position:absolute] [.im-pump-page_&]:[z-index:3]"
          ref={navigationRef}
        >
          <LifecycleNavigation
            canRotate={steps.length > 1}
            onPrevious={() => navigate(1)}
            onNext={() => navigate(-1)}
          />
        </div>
        <LifecycleEdgeBlur />
      </div>
      <div
        className="lifecycle-pagination [.im-pump-page_&]:[display:none]! max-[1200px]:[.im-pump-page_&]:[display:flex]! max-[1200px]:[.im-pump-page_&]:[justify-content:center] max-[1200px]:[.im-pump-page_&]:[gap:4px] max-[1200px]:[.im-pump-page_&]:[margin-top:20px] max-[1200px]:[.im-pump-page_&_button]:[width:10px] max-[1200px]:[.im-pump-page_&_button]:[height:7px] max-[1200px]:[.im-pump-page_&_button]:[padding-top:0] max-[1200px]:[.im-pump-page_&_button]:[padding-right:0] max-[1200px]:[.im-pump-page_&_button]:[padding-bottom:0] max-[1200px]:[.im-pump-page_&_button]:[padding-left:0] max-[1200px]:[.im-pump-page_&_button]:[border:0] max-[1200px]:[.im-pump-page_&_button]:[border-radius:999px] max-[1200px]:[.im-pump-page_&_button]:[background:#d9d9d9] max-[1200px]:[.im-pump-page_&_button]:[cursor:pointer] max-[1200px]:[.im-pump-page_&_button[aria-pressed='true']]:[width:34px] max-[1200px]:[.im-pump-page_&_button[aria-pressed='true']]:[background:#9eb7d0]"
        aria-label="Engineering stages"
      >
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-label={`Show ${step.title}`}
            aria-pressed={index === activeIndex}
            onClick={() =>
              navigate(getLifecycleRotation(selectedIndex, index, steps.length))
            }
          />
        ))}
      </div>
    </div>
  );
}
function StandardsSection() {
  const reduced = useReducedMotion() ?? false;
  const [activeCategory, setActiveCategory] = useState<StandardCategory>("all");
  const filteredStandards =
    activeCategory === "all"
      ? standards
      : standards.filter((standard) => standard.category === activeCategory);
  const selectNextCategory = () => {
    setActiveCategory((current) => {
      const index = standardFilters.findIndex(
        (filter) => filter.category === current,
      );
      return standardFilters[(index + 1) % standardFilters.length].category;
    });
  };
  return (
    <section
      className="standards-section [.im-pump-page_&]:[--standard-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.im-pump-page_&]:[padding-top:calc(115_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:24px] [.im-pump-page_&]:[padding-bottom:calc(115_*_var(--standard-unit))] [.im-pump-page_&]:[padding-left:24px] [.im-pump-page_&]:[background:linear-gradient(105deg,_#d5eaf8_0%,_#e8f4fb_54%,_#f5fafc_100%)] [.im-pump-page_&]:[color:#0d5792]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[1200px]:[.im-pump-page_&]:[--standard-unit:1px] max-[1200px]:[.im-pump-page_&]:[padding-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-top:64px] max-[768px]:[.im-pump-page_&]:[padding-right:20px] max-[768px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-left:20px] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]"
      aria-labelledby="standards-title"
    >
      <div className="standards-inner [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1204_*_var(--standard-unit))] [.im-pump-page_&]:[margin-left:auto] [.im-pump-page_&]:[margin-right:auto]">
        <div className="standards-header [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:minmax(0,_650fr)_minmax(0,_509fr)] [.im-pump-page_&]:[gap:calc(40_*_var(--standard-unit))] [.im-pump-page_&]:[min-height:calc(130_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(5_*_var(--standard-unit))] [.im-pump-page_&]:[align-items:start] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[1200px]:[.im-pump-page_&]:[gap:32px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[768px]:[.im-pump-page_&]:[gap:40px]">
          <motion.div {...imReveal("left", 0, reduced, 0.18)}>
            <StandardsHeading />
          </motion.div>
          <motion.div {...imReveal("right", 0.09, reduced, 0.18)}>
            <StandardsFilter
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
              onNext={selectNextCategory}
            />
          </motion.div>
        </div>
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {
            standardFilters.find((filter) => filter.category === activeCategory)
              ?.label
          }
          : {filteredStandards.length} standards shown.
        </p>
        <StandardsGrid visibleStandards={filteredStandards} />
        <motion.div {...imReveal("up", 0.04, reduced, 0.2)}>
          <EngineeringLifecycleHeading />
        </motion.div>
        <EngineeringLifecycleCarousel />
        <motion.div {...imReveal("up", 0, reduced, 0.1)}>
          <NewsletterSubscription />
        </motion.div>
      </div>
    </section>
  );
}
export default function ImPumpPage() {
  const pageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const page = pageRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!page || !header) return;
    // The existing header is in normal flow on this route. Move only this page
    // behind it so all Figma coordinates start at the top of the frame.
    const syncHeaderOffset = () => {
      const inFlow = !["absolute", "fixed"].includes(
        getComputedStyle(header).position,
      );
      page.style.setProperty(
        "--im-pump-header-offset",
        inFlow ? `${header.getBoundingClientRect().height}px` : "0px",
      );
    };
    syncHeaderOffset();
    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderOffset);
    };
  }, []);
  return (
    <main
      ref={pageRef}
      className="im-pump-page min-h-svh w-full font-sans [&&_.philosophy-card--primary]:[background:linear-gradient(180deg,_#005eff_0%,_#001ea2_100%)] [&&_.philosophy-card--primary]:[color:#f7f7f7]! [&&_.philosophy-card--primary]:[border-color:#70a6ff80] [--im-pump-header-offset:97px] [--im-pump-x-unit:0.0694444444vw] [--im-pump-unit:min(var(--im-pump-x-unit),_0.1035196687svh)] [margin-top:calc(-1_*_var(--im-pump-header-offset))] [background:#010416] min-[768px]:max-[1440px]:[--im-pump-unit:clamp(0.8px,_0.0694444444vw,_1px)] min-[768px]:max-[1440px]:[--im-pump-x-unit:var(--im-pump-unit)] max-[768px]:[--im-pump-unit:1px] max-[768px]:[--im-pump-x-unit:1px]"
    >
      <ImPumpHero />
      <EngineeringPhilosophySection />
      <EngineeringPromisesSection />
      <StandardsSection />
      <style jsx global>{`
        /*
         * Connected section endpoints prevent visible color seams.
         * The palette stays within the existing navy / ice-blue tones.
         */
        .im-pump-page .engineering-philosophy {
          background: linear-gradient(
            180deg,
            #eef7fb 0%,
            #e4f2fa 40%,
            #cde7f8 72%,
            #9eb7d0 100%
          ) !important;
        }
        .im-pump-page .engineering-promises {
          background: linear-gradient(
            180deg,
            #9eb7d0 0%,
            #a9c4da 55%,
            #bdd8e8 100%
          ) !important;
        }
        .im-pump-page .standards-section {
          background: linear-gradient(
            180deg,
            #bdd8e8 0%,
            #d5eaf8 22%,
            #e8f4fb 58%,
            #f5fafc 100%
          ) !important;
        }
        /*
         * Only wide, 16:9-class desktop viewports receive the badge offset.
         * The original position remains untouched on mobile, tablet,
         * portrait and ultrawide displays.
         */
        @media (min-width: 1600px) and (min-height: 800px) and (min-aspect-ratio: 17/10) and (max-aspect-ratio: 21/10) {
          .im-pump-page .im-pump-badge {
            margin-top: calc(80 * var(--im-pump-unit));
          }
        }
      `}</style>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.
const twImPumpPageRules: Record<string, string> = {
  "engineering-philosophy":
    "[.im-pump-page_&]:[--philosophy-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.im-pump-page_&]:[padding-top:calc(115_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:24px] [.im-pump-page_&]:[padding-bottom:calc(115_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:24px] [.im-pump-page_&]:[background:linear-gradient(110deg,_#eef7fb_0%,_#e4f2fa_48%,_#cde7f8_100%)] [.im-pump-page_&]:[color:#0d5792]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[1200px]:[.im-pump-page_&]:[--philosophy-unit:1px] max-[1200px]:[.im-pump-page_&]:[padding-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-top:64px] max-[768px]:[.im-pump-page_&]:[padding-right:20px] max-[768px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-left:20px]",
  "engineering-philosophy-inner":
    "[.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1202_*_var(--philosophy-unit))] [.im-pump-page_&]:[margin-left:auto] [.im-pump-page_&]:[margin-right:auto]",
  "engineering-philosophy-heading":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:650fr_396fr] [.im-pump-page_&]:[gap:calc(146_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(10_*_var(--philosophy-unit))] [.im-pump-page_&]:[align-items:start] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--philosophy-unit))]! [.im-pump-page_&_h2]:[line-height:1]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_>_p]:[margin-top:calc(92_*_var(--philosophy-unit))] [.im-pump-page_&_>_p]:[font-size:calc(15_*_var(--philosophy-unit))]! [.im-pump-page_&_>_p]:[line-height:1]! [.im-pump-page_&_>_p]:[color:#9eb7d0]! max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1.5fr_1fr] max-[1200px]:[.im-pump-page_&]:[gap:32px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[1200px]:[.im-pump-page_&_>_p]:[margin-top:64px] max-[1200px]:[.im-pump-page_&_>_p]:[line-height:1.2]! max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.3vw,_42px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&_>_p]:[margin-top:0] max-[768px]:[.im-pump-page_&_>_p]:[max-width:396px] max-[768px]:[.im-pump-page_&]:[text-align:center] max-[768px]:[.im-pump-page_&_h2]:[max-width:340px] max-[768px]:[.im-pump-page_&_h2]:[margin-left:auto] max-[768px]:[.im-pump-page_&_h2]:[margin-right:auto] max-[768px]:[.im-pump-page_&_>_p]:[margin-left:auto] max-[768px]:[.im-pump-page_&_>_p]:[margin-right:auto] max-[768px]:[.im-pump-page_&_>_p]:[line-height:1]!",
  "philosophy-heading-line":
    "[.im-pump-page_&]:[white-space:nowrap] max-[1200px]:[.im-pump-page_&]:[white-space:normal]",
  "philosophy-cards":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [.im-pump-page_&]:[gap:calc(19_*_var(--philosophy-unit))] [.im-pump-page_&]:[margin-top:calc(57_*_var(--philosophy-unit))] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[margin-top:36px] max-[768px]:[.im-pump-page_&]:[gap:18px]",
  "philosophy-card":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[gap:calc(13_*_var(--philosophy-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(222_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-top:calc(19_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(23_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-bottom:calc(19_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:calc(23_*_var(--philosophy-unit))] [.im-pump-page_&]:[border:0.5px_solid_#ffffffa6] [.im-pump-page_&]:[border-radius:calc(30_*_var(--philosophy-unit))] [.im-pump-page_&]:[background:linear-gradient(135deg,_#ffffff_0%,_#ffffff80_45%,_#ffffff00_100%)] max-[1200px]:[.im-pump-page_&:last-child]:[grid-column:1_/_-1] max-[768px]:[.im-pump-page_&:last-child]:[grid-column:auto] max-[768px]:[.im-pump-page_&]:[min-height:222px] max-[768px]:[.im-pump-page_&]:[padding-left:22px] max-[768px]:[.im-pump-page_&]:[padding-right:22px] max-[768px]:[.im-pump-page_&]:[padding-top:22px] max-[768px]:[.im-pump-page_&]:[padding-bottom:22px]",
  "im-pump-page":
    "[&&_.philosophy-card--primary]:[background:linear-gradient(180deg,_#005eff_0%,_#001ea2_100%)] [&&_.philosophy-card--primary]:[color:#f7f7f7]! [&&_.philosophy-card--primary]:[border-color:#70a6ff80] [--im-pump-header-offset:97px] [--im-pump-x-unit:0.0694444444vw] [--im-pump-unit:min(var(--im-pump-x-unit),_0.1035196687svh)] [margin-top:calc(-1_*_var(--im-pump-header-offset))] [background:#010416] min-[768px]:max-[1440px]:[--im-pump-unit:clamp(0.8px,_0.0694444444vw,_1px)] min-[768px]:max-[1440px]:[--im-pump-x-unit:var(--im-pump-unit)] max-[768px]:[--im-pump-unit:1px] max-[768px]:[--im-pump-x-unit:1px]",
  "philosophy-card-top":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&]:[height:calc(38_*_var(--philosophy-unit))]",
  "philosophy-card-icon":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(38_*_var(--philosophy-unit))] [.im-pump-page_&]:[height:calc(38_*_var(--philosophy-unit))] [.im-pump-page_&]:[border-radius:calc(11_*_var(--philosophy-unit))] [.im-pump-page_&]:[color:#c7e6ff]! [.im-pump-page_&]:[background:linear-gradient(135deg,_#86c7ff_0%,_#0065f5_52%,_#153fae_100%)] [.im-pump-page_&]:[box-shadow:inset_0_1px_2px_#ffffff80,_0_3px_12px_#005eff26] [.im-pump-page_&_svg]:[width:72%] [.im-pump-page_&_svg]:[height:72%] [.im-pump-page_&_svg]:[stroke-width:1.5]",
  "philosophy-card-word":
    "[.im-pump-page_&]:[font-size:calc(27_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1]! max-[768px]:[.im-pump-page_&]:[font-size:15px]!",
  "philosophy-card-eyebrow":
    "[.im-pump-page_&]:[font-size:calc(12_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#27272a]! [.im-pump-page_.philosophy-card--primary_&&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[font-size:12px]!",
  "philosophy-card-title":
    "[.im-pump-page_&]:[font-size:calc(20_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.07]! [.im-pump-page_&]:[font-weight:410]! max-[768px]:[.im-pump-page_&]:[font-size:20px]! max-[768px]:[.im-pump-page_&]:[line-height:1.07]!",
  "philosophy-card-description":
    "[.im-pump-page_&]:[max-width:calc(297_*_var(--philosophy-unit))] [.im-pump-page_&]:[font-size:calc(9_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[font-size:10px]! max-[768px]:[.im-pump-page_&]:[line-height:1.07]!",
  "engineering-proof-panel":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[gap:calc(29_*_var(--philosophy-unit))] [.im-pump-page_&]:[min-height:calc(336.26_*_var(--philosophy-unit))] [.im-pump-page_&]:[margin-top:calc(34_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-top:calc(51_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(43_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-bottom:calc(51_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:calc(43_*_var(--philosophy-unit))] [.im-pump-page_&]:[border-radius:calc(30_*_var(--philosophy-unit))] [.im-pump-page_&]:[background:#fff] [.im-pump-page_&_>_h3]:[font-size:calc(25_*_var(--philosophy-unit))]! [.im-pump-page_&_>_h3]:[line-height:1.12]! [.im-pump-page_&_>_h3]:[font-weight:540]! [.im-pump-page_&_>_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]! max-[1200px]:[.im-pump-page_&]:[height:auto] max-[768px]:[.im-pump-page_&]:[margin-top:28px] max-[768px]:[.im-pump-page_&]:[padding-top:32px] max-[768px]:[.im-pump-page_&]:[padding-right:24px] max-[768px]:[.im-pump-page_&]:[padding-bottom:32px] max-[768px]:[.im-pump-page_&]:[padding-left:24px] max-[768px]:[.im-pump-page_&]:[gap:24px] max-[768px]:[.im-pump-page_&_>_h3]:[font-size:23px]! max-[768px]:[.im-pump-page_&_>_h3]:[line-height:1.15]!",
  "engineering-proof-description":
    "[.im-pump-page_&]:[font-size:calc(15_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[line-height:1.3]!",
  "engineering-proof-highlights":
    "[.im-pump-page_&_h4]:[font-size:calc(12_*_var(--philosophy-unit))]! [.im-pump-page_&_h4]:[line-height:1.12]! [.im-pump-page_&_h4]:[font-weight:410]! [.im-pump-page_&_ul]:[display:grid]! [.im-pump-page_&_ul]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.im-pump-page_&_ul]:[gap:calc(8_*_var(--philosophy-unit))_calc(18_*_var(--philosophy-unit))] [.im-pump-page_&_ul]:[margin-top:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&_ul]:[list-style:none] [.im-pump-page_&_ul]:[padding-top:0] [.im-pump-page_&_ul]:[padding-right:0] [.im-pump-page_&_ul]:[padding-bottom:0] [.im-pump-page_&_ul]:[padding-left:0] max-[768px]:[.im-pump-page_&_ul]:[grid-template-columns:1fr]",
  "engineering-proof-item":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[gap:calc(10_*_var(--philosophy-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(34_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-top:calc(7_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-right:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-bottom:calc(7_*_var(--philosophy-unit))] [.im-pump-page_&]:[padding-left:calc(12_*_var(--philosophy-unit))] [.im-pump-page_&]:[border-radius:calc(6_*_var(--philosophy-unit))] [.im-pump-page_&]:[background:#f5f5f5] [.im-pump-page_&]:[color:#27272a]! [.im-pump-page_&]:[font-size:calc(12_*_var(--philosophy-unit))]! [.im-pump-page_&]:[line-height:1.15]! max-[768px]:[.im-pump-page_&]:[padding-top:10px] max-[768px]:[.im-pump-page_&]:[padding-bottom:10px] max-[768px]:[.im-pump-page_&]:[line-height:1.3]!",
  "engineering-proof-icon":
    "[.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(20_*_var(--philosophy-unit))] [.im-pump-page_&]:[height:calc(20_*_var(--philosophy-unit))] [.im-pump-page_&]:[color:#005eff]! [.im-pump-page_&_svg]:[position:absolute] [.im-pump-page_&_svg]:[top:0] [.im-pump-page_&_svg]:[right:0] [.im-pump-page_&_svg]:[bottom:0] [.im-pump-page_&_svg]:[left:0] [.im-pump-page_&_svg]:[width:100%] [.im-pump-page_&_svg]:[height:100%]",
  "philosophy-desktop-break": "max-[768px]:[.im-pump-page_&]:[display:none]!",
  "philosophy-card-break": "max-[768px]:[.im-pump-page_&]:[display:none]!",
  "engineering-promises":
    "[.im-pump-page_&]:[--promise-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.im-pump-page_&]:[padding-top:calc(115_*_var(--promise-unit))] [.im-pump-page_&]:[padding-right:24px] [.im-pump-page_&]:[padding-bottom:calc(115_*_var(--promise-unit))] [.im-pump-page_&]:[padding-left:24px] [.im-pump-page_&]:[background:#9eb7d0] [.im-pump-page_&]:[color:#0d5792]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[1200px]:[.im-pump-page_&]:[--promise-unit:1px] max-[1200px]:[.im-pump-page_&]:[padding-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-top:64px] max-[768px]:[.im-pump-page_&]:[padding-right:20px] max-[768px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-left:20px]",
  "engineering-promises-inner":
    "[.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1204_*_var(--promise-unit))] [.im-pump-page_&]:[margin-left:auto] [.im-pump-page_&]:[margin-right:auto]",
  "engineering-promises-header":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:minmax(0,_650fr)_minmax(0,_463fr)] [.im-pump-page_&]:[gap:calc(79_*_var(--promise-unit))] [.im-pump-page_&]:[padding-right:calc(12_*_var(--promise-unit))] [.im-pump-page_&]:[min-height:calc(130_*_var(--promise-unit))] [.im-pump-page_&]:[align-items:start] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[1200px]:[.im-pump-page_&]:[gap:32px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[768px]:[.im-pump-page_&]:[gap:24px]",
  "engineering-promises-eyebrow":
    "[.im-pump-page_&]:[margin-left:calc(6_*_var(--promise-unit))] [.im-pump-page_&]:[font-size:calc(9_*_var(--promise-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#f7f7f7]! max-[768px]:[.im-pump-page_&]:[display:none]!",
  "engineering-promises-heading":
    "[.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--promise-unit))] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--promise-unit))]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_h2]:[line-height:1]! max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(40px,_11vw,_56px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&_h2]:[width:min(304px,_100%)] max-[768px]:[.im-pump-page_&_h2]:[margin-top:0] max-[768px]:[.im-pump-page_&_h2]:[overflow-wrap:anywhere]",
  "engineering-promises-heading-line":
    "[.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]",
  "engineering-promises-logo":
    "[.im-pump-page_&]:[width:calc(170_*_var(--promise-unit))] [.im-pump-page_&]:[height:auto]",
  "engineering-promises-introduction":
    "[.im-pump-page_&_>_p]:[margin-top:calc(10_*_var(--promise-unit))] [.im-pump-page_&_>_p]:[font-size:calc(15_*_var(--promise-unit))]! [.im-pump-page_&_>_p]:[line-height:1]! [.im-pump-page_&_>_p]:[color:#f7f7f7]! max-[1200px]:[.im-pump-page_&]:[max-width:463px] max-[1200px]:[.im-pump-page_&_>_p]:[line-height:1.2]! max-[768px]:[.im-pump-page_&]:[order:-1]",
  "engineering-promises-grid":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [.im-pump-page_&]:[gap:calc(13_*_var(--promise-unit))] [.im-pump-page_&]:[max-width:calc(1199_*_var(--promise-unit))] [.im-pump-page_&]:[margin-top:calc(60_*_var(--promise-unit))] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[1200px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[margin-top:60px] max-[768px]:[.im-pump-page_&]:[gap:18px]",
  "engineering-promise-card":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(32_*_var(--promise-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(277_*_var(--promise-unit))] [.im-pump-page_&]:[padding-top:calc(31_*_var(--promise-unit))] [.im-pump-page_&]:[padding-right:calc(20_*_var(--promise-unit))] [.im-pump-page_&]:[padding-bottom:calc(31_*_var(--promise-unit))] [.im-pump-page_&]:[padding-left:calc(20_*_var(--promise-unit))] [.im-pump-page_&]:[border:0.5px_solid_#9eb7d0] [.im-pump-page_&]:[border-radius:calc(30_*_var(--promise-unit))] [.im-pump-page_&]:[background:linear-gradient(35deg,_#ffffff_0%,_#ffffffb3_43%,_#ffffff00_100%)] max-[768px]:[.im-pump-page_&]:[min-height:277px]",
  "engineering-promise-eyebrow":
    "[.im-pump-page_&]:[font-size:calc(12_*_var(--promise-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#4687b8]!",
  "engineering-promise-information":
    "[.im-pump-page_&_h3]:[margin-top:calc(13_*_var(--promise-unit))] [.im-pump-page_&_h3]:[font-size:calc(20_*_var(--promise-unit))]! [.im-pump-page_&_h3]:[font-weight:410]! [.im-pump-page_&_h3]:[line-height:1.07]! [.im-pump-page_&_h3]:[white-space:nowrap] max-[768px]:[.im-pump-page_&_h3]:[white-space:normal]",
  "engineering-promise-description":
    "[.im-pump-page_&]:[margin-top:calc(13_*_var(--promise-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--promise-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]!",
  "engineering-promise-checklist":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[gap:calc(13_*_var(--promise-unit))] [.im-pump-page_&]:[margin-top:0] [.im-pump-page_&]:[margin-right:0] [.im-pump-page_&]:[margin-bottom:0] [.im-pump-page_&]:[margin-left:0] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[list-style:none] [.im-pump-page_&_li]:[display:flex]! [.im-pump-page_&_li]:[align-items:flex-start] [.im-pump-page_&_li]:[gap:calc(7_*_var(--promise-unit))] [.im-pump-page_&_li]:[min-height:calc(20_*_var(--promise-unit))] [.im-pump-page_&_li]:[font-size:calc(9_*_var(--promise-unit))]! [.im-pump-page_&_li]:[line-height:1.12]! [.im-pump-page_&_li]:[color:#9eb7d0]! [.im-pump-page_&_svg]:[flex-shrink:0] [.im-pump-page_&_svg]:[width:calc(15_*_var(--promise-unit))] [.im-pump-page_&_svg]:[height:calc(15_*_var(--promise-unit))] [.im-pump-page_&_svg]:[color:#005eff]! [.im-pump-page_&_svg]:[stroke-width:1.5] [.im-pump-page_&_span]:[min-width:0]",
  "engineering-promises-desktop-break":
    "max-[768px]:[.im-pump-page_&]:[display:none]!",
  "engineering-lifecycle-heading":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:minmax(0,_702fr)_minmax(0,_376fr)] [.im-pump-page_&]:[gap:calc(124_*_var(--standard-unit))] [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1204_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(95_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(2_*_var(--standard-unit))] [.im-pump-page_&]:[align-items:start] [.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--standard-unit))] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--standard-unit))]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_h2]:[line-height:1]! [.im-pump-page_&_h2]:[letter-spacing:-0.04em] [.im-pump-page_&_h2]:[color:#0d5792]! max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[1200px]:[.im-pump-page_&]:[gap:24px] max-[1200px]:[.im-pump-page_&]:[margin-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[768px]:[.im-pump-page_&]:[margin-top:64px] max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.3vw,_42px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&]:[text-align:center] max-[768px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&_h2]:[max-width:320px] max-[768px]:[.im-pump-page_&_h2]:[margin-left:auto] max-[768px]:[.im-pump-page_&_h2]:[margin-right:auto]",
  "engineering-lifecycle-eyebrow":
    "[.im-pump-page_&]:[font-size:calc(9_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]!",
  "engineering-lifecycle-heading-line":
    "[.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]",
  "engineering-lifecycle-description":
    "[.im-pump-page_&]:[margin-top:calc(82_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(15_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1]! [.im-pump-page_&]:[color:#9eb7d0]! max-[1200px]:[.im-pump-page_&]:[max-width:376px] max-[1200px]:[.im-pump-page_&]:[margin-top:0] max-[1200px]:[.im-pump-page_&]:[line-height:1.2]! max-[768px]:[.im-pump-page_&]:[margin-left:auto] max-[768px]:[.im-pump-page_&]:[margin-right:auto] max-[768px]:[.im-pump-page_&]:[line-height:1]!",
  "engineering-lifecycle-desktop-break":
    "max-[768px]:[.im-pump-page_&]:[display:none]!",
  "lifecycle-pagination":
    "[.im-pump-page_&]:[display:none]! max-[1200px]:[.im-pump-page_&]:[display:flex]! max-[1200px]:[.im-pump-page_&]:[justify-content:center] max-[1200px]:[.im-pump-page_&]:[gap:4px] max-[1200px]:[.im-pump-page_&]:[margin-top:20px] max-[1200px]:[.im-pump-page_&_button]:[width:10px] max-[1200px]:[.im-pump-page_&_button]:[height:7px] max-[1200px]:[.im-pump-page_&_button]:[padding-top:0] max-[1200px]:[.im-pump-page_&_button]:[padding-right:0] max-[1200px]:[.im-pump-page_&_button]:[padding-bottom:0] max-[1200px]:[.im-pump-page_&_button]:[padding-left:0] max-[1200px]:[.im-pump-page_&_button]:[border:0] max-[1200px]:[.im-pump-page_&_button]:[border-radius:999px] max-[1200px]:[.im-pump-page_&_button]:[background:#d9d9d9] max-[1200px]:[.im-pump-page_&_button]:[cursor:pointer] max-[1200px]:[.im-pump-page_&_button[aria-pressed='true']]:[width:34px] max-[1200px]:[.im-pump-page_&_button[aria-pressed='true']]:[background:#9eb7d0]",
  "lifecycle-carousel":
    "[.im-pump-page_&]:[margin-top:calc(168_*_var(--standard-unit))] [.im-pump-page_&]:[margin-left:calc(-8.5_*_var(--standard-unit))] [.im-pump-page_&]:[margin-right:calc(-8.5_*_var(--standard-unit))] [.im-pump-page_&]:[letter-spacing:-0.04em] [.im-pump-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.im-pump-page_&_button:focus-visible]:[outline-offset:3px] max-[1200px]:[.im-pump-page_&]:[margin-top:48px] max-[1200px]:[.im-pump-page_&]:[margin-left:-20px] max-[1200px]:[.im-pump-page_&]:[margin-right:-20px] max-[1200px]:[.im-pump-page_&]:[margin-bottom:0] motion-reduce:[.im-pump-page_&_*]:[transition:none]!",
  "lifecycle-viewport":
    "[.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[isolation:isolate] [.im-pump-page_&]:[min-height:calc(872.23_*_var(--standard-unit))] [.im-pump-page_&]:[overflow:clip] max-[1200px]:[.im-pump-page_&]:[min-height:850px] max-[1200px]:[.im-pump-page_&]:[touch-action:pan-y]",
  "lifecycle-track":
    "[.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(var(--lifecycle-visible-count),_minmax(0,_1fr))] [.im-pump-page_&]:[gap:calc(51_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:0] [.im-pump-page_&]:[margin-right:0] [.im-pump-page_&]:[margin-bottom:0] [.im-pump-page_&]:[margin-left:0] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[list-style:none] [.im-pump-page_&]:[align-items:start] max-[1200px]:[.im-pump-page_&]:[gap:70px] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(var(--lifecycle-visible-count),_160px)] max-[1200px]:[.im-pump-page_&]:[width:620px] max-[1200px]:[.im-pump-page_&]:[left:calc(50%_-_310px)]",
  "lifecycle-step":
    "[.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[min-width:0] max-[1200px]:[.im-pump-page_&]:[width:160px] max-[1200px]:[.im-pump-page_&]:[margin-left:0] max-[1200px]:[.im-pump-page_&]:[margin-right:0]",
  "lifecycle-navigation-slot":
    "[.im-pump-page_&]:[height:calc(46_*_var(--standard-unit))] max-[1200px]:[.im-pump-page_&]:[height:100px]",
  "lifecycle-navigation-fixed":
    "[.im-pump-page_&]:[position:absolute] [.im-pump-page_&]:[z-index:3]",
  "lifecycle-image-slot":
    "[.im-pump-page_&]:[height:calc(205_*_var(--standard-unit))] max-[1200px]:[.im-pump-page_&]:[display:flex]! max-[1200px]:[.im-pump-page_&]:[justify-content:center]",
  "lifecycle-image":
    "[.im-pump-page_&]:[position:relative] [.im-pump-page_&]:[display:block]! [.im-pump-page_&]:[width:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[height:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[max-width:100%] [.im-pump-page_&]:[overflow:hidden] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[border:0] [.im-pump-page_&]:[border-radius:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[background:#c3ddec] [.im-pump-page_&]:[cursor:pointer] [.im-pump-page_&]:[transition:width_300ms_ease,_height_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[width:calc(160_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[height:calc(205_*_var(--standard-unit))]",
  "lifecycle-photo-placeholder":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[height:100%] [.im-pump-page_&]:[background:linear-gradient(145deg,_#c8e6f5,_#85b5d1)] [.im-pump-page_&]:[color:#4687b8]! [.im-pump-page_&_svg]:[width:28%] [.im-pump-page_&_svg]:[height:28%] [.im-pump-page_&_svg]:[stroke-width:1]",
  "lifecycle-step-content":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[align-items:flex-start] [.im-pump-page_&]:[gap:calc(16_*_var(--standard-unit))] [.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[margin-top:calc(20_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[border:0] [.im-pump-page_&]:[border-radius:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[background:transparent] [.im-pump-page_&]:[text-align:left] [.im-pump-page_&]:[color:#27272a]! [.im-pump-page_&]:[cursor:pointer] [.im-pump-page_&]:[transition:background-color_300ms_ease,_box-shadow_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[min-height:calc(249_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[justify-content:space-between] [.im-pump-page_.lifecycle-step--active_&&]:[padding-top:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[padding-right:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[padding-bottom:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[padding-left:calc(20_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[background:#f7f7f7] [.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_calc(-59_*_var(--standard-unit))_calc(95.9_*_var(--standard-unit))_#005eff26] max-[1200px]:[.im-pump-page_&]:[max-width:160px] max-[1200px]:[.im-pump-page_&]:[margin-top:32px] max-[1200px]:[.im-pump-page_&]:[margin-right:auto] max-[1200px]:[.im-pump-page_&]:[margin-bottom:0] max-[1200px]:[.im-pump-page_&]:[margin-left:auto]",
  "lifecycle-step-title":
    "[.im-pump-page_&]:[display:block]! [.im-pump-page_&]:[max-width:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[font-weight:410]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[overflow-wrap:anywhere] [.im-pump-page_&]:[transition:font-size_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[max-width:none] [.im-pump-page_.lifecycle-step--active_&&]:[width:100%] [.im-pump-page_.lifecycle-step--active_&&]:[font-size:calc(20_*_var(--standard-unit))]! [.im-pump-page_.lifecycle-step--active_&&]:[line-height:1.07]! [.im-pump-page_.lifecycle-step--active_&&]:[text-align:center]",
  "lifecycle-selection-arrow":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[height:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[border-radius:50%] [.im-pump-page_&]:[color:#fff]! [.im-pump-page_&]:[background:#27272a] [.im-pump-page_&]:[transition:background-color_300ms_ease] [.im-pump-page_&_svg]:[width:64%] [.im-pump-page_&_svg]:[height:64%] [.im-pump-page_&_svg]:[stroke-width:1.8] [.im-pump-page_.lifecycle-step--active_&&]:[background:#005eff] [.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_0_12px_#005eff30] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[background:linear-gradient(135deg,_#438aff,_#004bdc)] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[border:0.5px_solid_#dceaff] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_0_20px_7px_#005eff40]",
  "lifecycle-navigation":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[justify-content:center] [.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(12_*_var(--standard-unit))] [.im-pump-page_&_button]:[display:grid]! [.im-pump-page_&_button]:[place-items:center] [.im-pump-page_&_button]:[width:calc(34_*_var(--standard-unit))] [.im-pump-page_&_button]:[height:calc(34_*_var(--standard-unit))] [.im-pump-page_&_button]:[border:0] [.im-pump-page_&_button]:[padding-top:0] [.im-pump-page_&_button]:[padding-right:0] [.im-pump-page_&_button]:[padding-bottom:0] [.im-pump-page_&_button]:[padding-left:0] [.im-pump-page_&_button]:[background:transparent] [.im-pump-page_&_button]:[color:#9eb7d0]! [.im-pump-page_&_button]:[cursor:pointer] [.im-pump-page_&_svg]:[width:65%] [.im-pump-page_&_svg]:[height:65%] [.im-pump-page_&_button:hover:not(:disabled)]:[color:#0d5792]! [.im-pump-page_&_button:disabled]:[opacity:0.35] [.im-pump-page_&_button:disabled]:[cursor:default] max-[1200px]:[.im-pump-page_&]:[margin-top:42px] max-[1200px]:[.im-pump-page_&_svg]:[width:90%] max-[1200px]:[.im-pump-page_&_svg]:[height:90%]",
  "lifecycle-step-description":
    "[.im-pump-page_&]:[width:calc(120_*_var(--standard-unit))] [.im-pump-page_&]:[max-width:100%] [.im-pump-page_&]:[margin-top:calc(24_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! [.im-pump-page_&]:[overflow-wrap:anywhere] [.im-pump-page_&]:[transition:font-size_300ms_ease] [.im-pump-page_.lifecycle-step--active_&&]:[width:calc(149_*_var(--standard-unit))] [.im-pump-page_.lifecycle-step--active_&&]:[margin-left:auto] [.im-pump-page_.lifecycle-step--active_&&]:[margin-right:auto] [.im-pump-page_.lifecycle-step--active_&&]:[font-size:calc(15_*_var(--standard-unit))]! [.im-pump-page_.lifecycle-step--active_&&]:[line-height:1]! [.im-pump-page_.lifecycle-step--active_&&]:[text-align:center] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[width:150px] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[margin-left:auto] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[margin-right:auto] max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[font-size:15px]! max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[line-height:1]!",
  "lifecycle-edge-blur":
    "[.im-pump-page_&]:[position:absolute] [.im-pump-page_&]:[top:0] [.im-pump-page_&]:[right:0] [.im-pump-page_&]:[bottom:0] [.im-pump-page_&]:[left:auto] [.im-pump-page_&]:[width:10%] [.im-pump-page_&]:[pointer-events:none] [.im-pump-page_&]:[z-index:2] [.im-pump-page_&_span]:[position:absolute] [.im-pump-page_&_span]:[top:0] [.im-pump-page_&_span]:[right:0] [.im-pump-page_&_span]:[bottom:0] [.im-pump-page_&_span]:[left:0] [.im-pump-page_&_span]:[mask-image:linear-gradient(90deg,_transparent,_#000)] [.im-pump-page_&_span:nth-child(1)]:[backdrop-filter:blur(3px)] [.im-pump-page_&_span:nth-child(2)]:[left:30%] [.im-pump-page_&_span:nth-child(2)]:[backdrop-filter:blur(8px)] [.im-pump-page_&_span:nth-child(3)]:[left:55%] [.im-pump-page_&_span:nth-child(3)]:[backdrop-filter:blur(16px)] [.im-pump-page_&_span:nth-child(4)]:[left:78%] [.im-pump-page_&_span:nth-child(4)]:[backdrop-filter:blur(34.1px)] [.im-pump-page_&_span:nth-child(4)]:[background:#f5fafc55] max-[1200px]:[.im-pump-page_&]:[display:none]!",
  "standards-section":
    "[.im-pump-page_&]:[--standard-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.im-pump-page_&]:[padding-top:calc(115_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:24px] [.im-pump-page_&]:[padding-bottom:calc(115_*_var(--standard-unit))] [.im-pump-page_&]:[padding-left:24px] [.im-pump-page_&]:[background:linear-gradient(105deg,_#d5eaf8_0%,_#e8f4fb_54%,_#f5fafc_100%)] [.im-pump-page_&]:[color:#0d5792]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[1200px]:[.im-pump-page_&]:[--standard-unit:1px] max-[1200px]:[.im-pump-page_&]:[padding-top:80px] max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-top:64px] max-[768px]:[.im-pump-page_&]:[padding-right:20px] max-[768px]:[.im-pump-page_&]:[padding-bottom:80px] max-[768px]:[.im-pump-page_&]:[padding-left:20px]",
  "standards-inner":
    "[.im-pump-page_&]:[width:100%] [.im-pump-page_&]:[max-width:calc(1204_*_var(--standard-unit))] [.im-pump-page_&]:[margin-left:auto] [.im-pump-page_&]:[margin-right:auto]",
  "standards-header":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:minmax(0,_650fr)_minmax(0,_509fr)] [.im-pump-page_&]:[gap:calc(40_*_var(--standard-unit))] [.im-pump-page_&]:[min-height:calc(130_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(5_*_var(--standard-unit))] [.im-pump-page_&]:[align-items:start] max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[1200px]:[.im-pump-page_&]:[gap:32px] max-[1200px]:[.im-pump-page_&]:[padding-right:0] max-[768px]:[.im-pump-page_&]:[gap:40px]",
  "standards-heading":
    "[.im-pump-page_&_>_p]:[font-size:calc(9_*_var(--standard-unit))]! [.im-pump-page_&_>_p]:[line-height:1.12]! [.im-pump-page_&_>_p]:[color:#9eb7d0]! [.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--standard-unit))] [.im-pump-page_&_h2]:[font-size:calc(50_*_var(--standard-unit))]! [.im-pump-page_&_h2]:[font-weight:410]! [.im-pump-page_&_h2]:[line-height:1]! max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]! max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.4vw,_42px)]! max-[768px]:[.im-pump-page_&_h2]:[line-height:1]! max-[768px]:[.im-pump-page_&]:[text-align:center]",
  "standards-heading-line":
    "[.im-pump-page_&]:[white-space:nowrap] max-[768px]:[.im-pump-page_&]:[white-space:normal]",
  "standards-filter":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[height:calc(34_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(68_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:calc(2_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(10_*_var(--standard-unit))] [.im-pump-page_&]:[padding-bottom:calc(2_*_var(--standard-unit))] [.im-pump-page_&]:[padding-left:calc(10_*_var(--standard-unit))] [.im-pump-page_&]:[border-radius:calc(8_*_var(--standard-unit))] [.im-pump-page_&]:[background:#f5f5f4] [.im-pump-page_&]:[box-shadow:0_3px_12px_#0d579210] [.im-pump-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.im-pump-page_&_button:focus-visible]:[outline-offset:2px] max-[1200px]:[.im-pump-page_&]:[max-width:509px] max-[1200px]:[.im-pump-page_&]:[margin-top:0] max-[768px]:[.im-pump-page_&]:[gap:10px]",
  "standards-filter-options":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex:1] [.im-pump-page_&]:[align-items:center] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&_button]:[flex-shrink:0] [.im-pump-page_&_button]:[padding-top:calc(5_*_var(--standard-unit))] [.im-pump-page_&_button]:[padding-right:calc(8_*_var(--standard-unit))] [.im-pump-page_&_button]:[padding-bottom:calc(5_*_var(--standard-unit))] [.im-pump-page_&_button]:[padding-left:calc(8_*_var(--standard-unit))] [.im-pump-page_&_button]:[border:0] [.im-pump-page_&_button]:[border-radius:calc(5_*_var(--standard-unit))] [.im-pump-page_&_button]:[background:transparent] [.im-pump-page_&_button]:[color:#27272a]! [.im-pump-page_&_button]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&_button]:[line-height:1.08]! [.im-pump-page_&_button]:[white-space:nowrap] [.im-pump-page_&_button]:[cursor:pointer] [.im-pump-page_&_button:hover]:[background:#ffffff80] [.im-pump-page_&_button[aria-pressed='true']]:[background:#fff] [.im-pump-page_&_button[aria-pressed='true']]:[box-shadow:0_1px_4px_#0d579214] max-[1200px]:[.im-pump-page_&]:[overflow-x:auto] max-[1200px]:[.im-pump-page_&]:[justify-content:flex-start] max-[1200px]:[.im-pump-page_&]:[scrollbar-width:thin] max-[768px]:[.im-pump-page_&]:[gap:8px] max-[768px]:[.im-pump-page_&]:[scrollbar-width:none] max-[768px]:[.im-pump-page_&::-webkit-scrollbar]:[display:none]!",
  "standards-filter-next":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[place-items:center] [.im-pump-page_&]:[flex-shrink:0] [.im-pump-page_&]:[width:calc(23_*_var(--standard-unit))] [.im-pump-page_&]:[height:calc(23_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:0] [.im-pump-page_&]:[padding-right:0] [.im-pump-page_&]:[padding-bottom:0] [.im-pump-page_&]:[padding-left:0] [.im-pump-page_&]:[border:0] [.im-pump-page_&]:[border-radius:50%] [.im-pump-page_&]:[color:#fff]! [.im-pump-page_&]:[background:linear-gradient(135deg,_#005eff,_#001ea2)] [.im-pump-page_&]:[box-shadow:0_0_8px_#005eff40] [.im-pump-page_&]:[cursor:pointer] [.im-pump-page_&_svg]:[width:65%] [.im-pump-page_&_svg]:[height:65%] [.im-pump-page_&_svg]:[stroke-width:2]",
  "standards-grid":
    "[.im-pump-page_&]:[display:grid]! [.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.im-pump-page_&]:[align-content:start] [.im-pump-page_&]:[gap:calc(20_*_var(--standard-unit))_calc(26_*_var(--standard-unit))] [.im-pump-page_&]:[min-height:calc(496_*_var(--standard-unit))] [.im-pump-page_&]:[margin-top:calc(47_*_var(--standard-unit))] max-[1200px]:[.im-pump-page_&]:[gap:20px] max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr] max-[768px]:[.im-pump-page_&]:[min-height:0] max-[768px]:[.im-pump-page_&]:[margin-top:36px]",
  "standard-card":
    "[.im-pump-page_&]:[display:flex]! [.im-pump-page_&]:[flex-direction:column] [.im-pump-page_&]:[justify-content:space-between] [.im-pump-page_&]:[gap:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[min-width:0] [.im-pump-page_&]:[min-height:calc(238_*_var(--standard-unit))] [.im-pump-page_&]:[padding-top:calc(31_*_var(--standard-unit))] [.im-pump-page_&]:[padding-right:calc(20_*_var(--standard-unit))] [.im-pump-page_&]:[padding-bottom:calc(31_*_var(--standard-unit))] [.im-pump-page_&]:[padding-left:calc(20_*_var(--standard-unit))] [.im-pump-page_&]:[border:0.5px_solid_#9eb7d0] [.im-pump-page_&]:[border-radius:calc(30_*_var(--standard-unit))] [.im-pump-page_&]:[background:linear-gradient(125deg,_#fff_0%,_#ffffff80_48%,_#ffffff00_100%)] [.im-pump-page_&]:[backdrop-filter:blur(16.8px)] max-[1200px]:[.im-pump-page_&]:[height:auto] max-[768px]:[.im-pump-page_&]:[min-height:300px] max-[768px]:[.im-pump-page_&]:[padding-top:30px] max-[768px]:[.im-pump-page_&]:[padding-right:22px] max-[768px]:[.im-pump-page_&]:[padding-bottom:30px] max-[768px]:[.im-pump-page_&]:[padding-left:22px]",
  "standard-card-code":
    "[.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[font-weight:410]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#005eff]!",
  "standard-card-application":
    "[.im-pump-page_&_h4]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&_h4]:[font-weight:410]! [.im-pump-page_&_h4]:[line-height:1.12]! [.im-pump-page_&_h4]:[color:#005eff]! [.im-pump-page_&_>_p]:[max-width:calc(480_*_var(--standard-unit))] [.im-pump-page_&_>_p]:[margin-top:calc(13_*_var(--standard-unit))] [.im-pump-page_&_>_p]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&_>_p]:[line-height:1.12]! [.im-pump-page_&_>_p]:[color:#27272a]! max-[768px]:[.im-pump-page_&_>_p]:[line-height:1.25]!",
  "standard-card-information":
    "[.im-pump-page_&_h3]:[margin-top:calc(13_*_var(--standard-unit))] [.im-pump-page_&_h3]:[font-size:calc(20_*_var(--standard-unit))]! [.im-pump-page_&_h3]:[font-weight:410]! [.im-pump-page_&_h3]:[line-height:1.07]!",
  "standard-card-description":
    "[.im-pump-page_&]:[margin-top:calc(13_*_var(--standard-unit))] [.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[color:#9eb7d0]! max-[768px]:[.im-pump-page_&]:[line-height:1.25]!",
  "standards-desktop-break": "max-[768px]:[.im-pump-page_&]:[display:none]!",
  "im-pump-hero":
    "[.im-pump-page_&]:[height:calc(966_*_var(--im-pump-unit))] [.im-pump-page_&]:[background:radial-gradient(ellipse_at_50%_43%,_#073789_0%,_#020e3a_35%,_#010416_70%)] max-[768px]:[.im-pump-page_&]:[height:clamp(720px,_185vw,_1100px)] max-[768px]:[.im-pump-page_&]:[min-height:0]",
  "im-pump-video":
    "[.im-pump-page_&]:[height:calc(648_*_var(--im-pump-unit))] [.im-pump-page_&_>_video]:[position:absolute] [.im-pump-page_&_>_video]:[width:100%] [.im-pump-page_&_>_video]:[height:auto] [.im-pump-page_&_>_video]:[min-height:100%] [.im-pump-page_&_>_video]:[top:calc(-800_*_(var(--im-pump-x-unit)_-_var(--im-pump-unit)))] max-[768px]:[.im-pump-page_&]:[height:clamp(400px,_104vw,_750px)] max-[768px]:[.im-pump-page_&_>_video]:[top:90px] max-[768px]:[.im-pump-page_&_>_video]:[left:50%] max-[768px]:[.im-pump-page_&_>_video]:[width:160%] max-[768px]:[.im-pump-page_&_>_video]:[max-width:none] max-[768px]:[.im-pump-page_&_>_video]:[transform:translateX(-50%)] max-[768px]:[.im-pump-page_&_>_video]:[height:auto] max-[768px]:[.im-pump-page_&_>_video]:[min-height:0] max-[768px]:[.im-pump-page_&_>_video]:[object-fit:contain] max-[768px]:[.im-pump-page_&_>_video]:[object-position:center_bottom]",
  "im-pump-video-fade":
    "[.im-pump-page_&]:[height:calc(40_*_var(--im-pump-unit))] [.im-pump-page_&]:[background:linear-gradient(transparent,_#141a32aa)]",
  "im-pump-lower":
    "[.im-pump-page_&]:[height:calc(318_*_var(--im-pump-unit))] [.im-pump-page_&]:[background:radial-gradient(ellipse_at_50%_0%,_#377ac882_0%,_#26397570_28%,_transparent_66%),_radial-gradient(ellipse_at_50%_60%,_#272e5870,_transparent_70%),_linear-gradient(#202233,_#1c1d28)] max-[768px]:[.im-pump-page_&]:[top:clamp(400px,_104vw,_750px)] max-[768px]:[.im-pump-page_&]:[height:auto]",
  "im-pump-badge":
    "[.im-pump-page_&]:[top:calc(273_*_var(--im-pump-x-unit)_-_800_*_(var(--im-pump-x-unit)_-_var(--im-pump-unit)))] [.im-pump-page_&]:[width:calc(351_*_var(--im-pump-unit))] [.im-pump-page_&]:[height:calc(47.42_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-top:calc(7_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-right:calc(16_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-bottom:calc(7_*_var(--im-pump-unit))] [.im-pump-page_&]:[padding-left:calc(16_*_var(--im-pump-unit))] [.im-pump-page_&]:[gap:calc(12_*_var(--im-pump-unit))] max-[768px]:[.im-pump-page_&]:[top:clamp(450px,_120vw,_840px)] max-[768px]:[.im-pump-page_&]:[width:186px] max-[768px]:[.im-pump-page_&]:[height:80px] max-[768px]:[.im-pump-page_&]:[padding-top:8px] max-[768px]:[.im-pump-page_&]:[padding-right:16px] max-[768px]:[.im-pump-page_&]:[padding-bottom:8px] max-[768px]:[.im-pump-page_&]:[padding-left:16px] max-[768px]:[.im-pump-page_&]:[gap:12px]",
  "im-pump-badge-icon":
    "[.im-pump-page_&]:[width:calc(32_*_var(--im-pump-unit))] [.im-pump-page_&]:[height:calc(32_*_var(--im-pump-unit))]",
  "im-pump-badge-text":
    "[.im-pump-page_&]:[font-size:calc(12_*_var(--im-pump-unit))]! [.im-pump-page_&]:[line-height:1.05]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[768px]:[.im-pump-page_&]:[font-size:12px]!",
  "im-pump-introduction":
    "[.im-pump-page_&]:[top:calc(699_*_var(--im-pump-unit))] [.im-pump-page_&]:[width:calc(732_*_var(--im-pump-unit))] [.im-pump-page_&]:[max-width:calc(100%_-_48px)] max-[768px]:[.im-pump-page_&]:[position:absolute] max-[768px]:[.im-pump-page_&]:[top:0] max-[768px]:[.im-pump-page_&]:[width:100%] max-[768px]:[.im-pump-page_&]:[max-width:none] max-[768px]:[.im-pump-page_&]:[padding-top:0] max-[768px]:[.im-pump-page_&]:[padding-right:0] max-[768px]:[.im-pump-page_&]:[padding-bottom:0] max-[768px]:[.im-pump-page_&]:[padding-left:0]",
  "im-pump-heading":
    "[.im-pump-page_&]:[font-size:calc(25_*_var(--im-pump-unit))]! [.im-pump-page_&]:[line-height:1.12]! [.im-pump-page_&]:[letter-spacing:0] max-[768px]:[.im-pump-page_&]:[position:absolute] max-[768px]:[.im-pump-page_&]:[top:clamp(130px,_36vw,_240px)] max-[768px]:[.im-pump-page_&]:[left:28px] max-[768px]:[.im-pump-page_&]:[right:28px] max-[768px]:[.im-pump-page_&]:[font-size:clamp(16px,_4.3vw,_25px)]! max-[768px]:[.im-pump-page_&]:[font-weight:410]! max-[768px]:[.im-pump-page_&]:[font-variation-settings:'wght'_410,_'wdth'_125]! max-[768px]:[.im-pump-page_&]:[line-height:1.07]!",
  "im-pump-description":
    "[.im-pump-page_&]:[margin-top:calc(29_*_var(--im-pump-unit))] [.im-pump-page_&]:[font-size:calc(15_*_var(--im-pump-unit))]! [.im-pump-page_&]:[line-height:1]! [.im-pump-page_&]:[letter-spacing:-0.04em] max-[768px]:[.im-pump-page_&]:[position:absolute] max-[768px]:[.im-pump-page_&]:[top:clamp(568px,_150vw,_1030px)] max-[768px]:[.im-pump-page_&]:[left:28px] max-[768px]:[.im-pump-page_&]:[right:28px] max-[768px]:[.im-pump-page_&]:[margin-top:0] max-[768px]:[.im-pump-page_&]:[margin-right:0] max-[768px]:[.im-pump-page_&]:[margin-bottom:0] max-[768px]:[.im-pump-page_&]:[margin-left:0] max-[768px]:[.im-pump-page_&]:[font-size:16px]! max-[768px]:[.im-pump-page_&]:[line-height:1]!",
  "im-pump-scroll":
    "[.im-pump-page_&]:[top:calc(869_*_var(--im-pump-unit))] [.im-pump-page_&]:[width:calc(61_*_var(--im-pump-unit))] [.im-pump-page_&]:[height:calc(61_*_var(--im-pump-unit))] max-[768px]:[.im-pump-page_&]:[display:none]!",
};
const twImPumpPagePriority: Record<string, number> = {
  "[.im-pump-page_&]:[--philosophy-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 1,
  "[.im-pump-page_&]:[padding-top:calc(115_*_var(--philosophy-unit))]": 2,
  "[.im-pump-page_&]:[padding-right:24px]": 546,
  "[.im-pump-page_&]:[padding-bottom:calc(115_*_var(--philosophy-unit))]": 4,
  "[.im-pump-page_&]:[padding-left:24px]": 548,
  "[.im-pump-page_&]:[background:linear-gradient(110deg,_#eef7fb_0%,_#e4f2fa_48%,_#cde7f8_100%)]": 6,
  "[.im-pump-page_&]:[color:#0d5792]!": 550,
  "[.im-pump-page_&]:[letter-spacing:-0.04em]": 735,
  "[.im-pump-page_&]:[width:100%]": 552,
  "[.im-pump-page_&]:[max-width:calc(1202_*_var(--philosophy-unit))]": 10,
  "[.im-pump-page_&]:[margin-left:auto]": 554,
  "[.im-pump-page_&]:[margin-right:auto]": 555,
  "[.im-pump-page_&]:[display:grid]!": 625,
  "[.im-pump-page_&]:[grid-template-columns:650fr_396fr]": 14,
  "[.im-pump-page_&]:[gap:calc(146_*_var(--philosophy-unit))]": 15,
  "[.im-pump-page_&]:[padding-right:calc(10_*_var(--philosophy-unit))]": 16,
  "[.im-pump-page_&]:[align-items:start]": 561,
  "[.im-pump-page_&_h2]:[font-size:calc(50_*_var(--philosophy-unit))]!": 18,
  "[.im-pump-page_&_h2]:[line-height:1]!": 568,
  "[.im-pump-page_&_h2]:[font-weight:410]!": 567,
  "[.im-pump-page_&]:[white-space:nowrap]": 569,
  "[.im-pump-page_&_>_p]:[margin-top:calc(92_*_var(--philosophy-unit))]": 22,
  "[.im-pump-page_&_>_p]:[font-size:calc(15_*_var(--philosophy-unit))]!": 23,
  "[.im-pump-page_&_>_p]:[line-height:1]!": 209,
  "[.im-pump-page_&_>_p]:[color:#9eb7d0]!": 564,
  "[.im-pump-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))]": 27,
  "[.im-pump-page_&]:[gap:calc(19_*_var(--philosophy-unit))]": 28,
  "[.im-pump-page_&]:[margin-top:calc(57_*_var(--philosophy-unit))]": 29,
  "[.im-pump-page_&]:[display:flex]!": 631,
  "[.im-pump-page_&]:[flex-direction:column]": 632,
  "[.im-pump-page_&]:[gap:calc(13_*_var(--philosophy-unit))]": 32,
  "[.im-pump-page_&]:[min-width:0]": 635,
  "[.im-pump-page_&]:[min-height:calc(222_*_var(--philosophy-unit))]": 34,
  "[.im-pump-page_&]:[padding-top:calc(19_*_var(--philosophy-unit))]": 35,
  "[.im-pump-page_&]:[padding-right:calc(23_*_var(--philosophy-unit))]": 36,
  "[.im-pump-page_&]:[padding-bottom:calc(19_*_var(--philosophy-unit))]": 37,
  "[.im-pump-page_&]:[padding-left:calc(23_*_var(--philosophy-unit))]": 38,
  "[.im-pump-page_&]:[border:0.5px_solid_#ffffffa6]": 39,
  "[.im-pump-page_&]:[border-radius:calc(30_*_var(--philosophy-unit))]": 84,
  "[.im-pump-page_&]:[background:linear-gradient(135deg,_#ffffff_0%,_#ffffff80_45%,_#ffffff00_100%)]": 41,
  "[&&_.philosophy-card--primary]:[background:linear-gradient(180deg,_#005eff_0%,_#001ea2_100%)]": 42,
  "[&&_.philosophy-card--primary]:[color:#f7f7f7]!": 43,
  "[&&_.philosophy-card--primary]:[border-color:#70a6ff80]": 44,
  "[.im-pump-page_&]:[align-items:center]": 585,
  "[.im-pump-page_&]:[justify-content:space-between]": 633,
  "[.im-pump-page_&]:[gap:calc(12_*_var(--philosophy-unit))]": 48,
  "[.im-pump-page_&]:[height:calc(38_*_var(--philosophy-unit))]": 54,
  "[.im-pump-page_&]:[place-items:center]": 606,
  "[.im-pump-page_&]:[flex-shrink:0]": 607,
  "[.im-pump-page_&]:[width:calc(38_*_var(--philosophy-unit))]": 53,
  "[.im-pump-page_&]:[border-radius:calc(11_*_var(--philosophy-unit))]": 55,
  "[.im-pump-page_&]:[color:#c7e6ff]!": 56,
  "[.im-pump-page_&]:[background:linear-gradient(135deg,_#86c7ff_0%,_#0065f5_52%,_#153fae_100%)]": 57,
  "[.im-pump-page_&]:[box-shadow:inset_0_1px_2px_#ffffff80,_0_3px_12px_#005eff26]": 58,
  "[.im-pump-page_&_svg]:[width:72%]": 59,
  "[.im-pump-page_&_svg]:[height:72%]": 60,
  "[.im-pump-page_&_svg]:[stroke-width:1.5]": 263,
  "[.im-pump-page_&]:[font-size:calc(27_*_var(--philosophy-unit))]!": 62,
  "[.im-pump-page_&]:[line-height:1]!": 734,
  "[.im-pump-page_&]:[font-size:calc(12_*_var(--philosophy-unit))]!": 117,
  "[.im-pump-page_&]:[line-height:1.12]!": 730,
  "[.im-pump-page_&]:[color:#27272a]!": 393,
  "[.im-pump-page_.philosophy-card--primary_&&]:[color:#9eb7d0]!": 67,
  "[.im-pump-page_&]:[font-size:calc(20_*_var(--philosophy-unit))]!": 68,
  "[.im-pump-page_&]:[line-height:1.07]!": 69,
  "[.im-pump-page_&]:[font-weight:410]!": 646,
  "[.im-pump-page_&]:[max-width:calc(297_*_var(--philosophy-unit))]": 71,
  "[.im-pump-page_&]:[font-size:calc(9_*_var(--philosophy-unit))]!": 72,
  "[.im-pump-page_&]:[color:#9eb7d0]!": 660,
  "[.im-pump-page_&]:[gap:calc(29_*_var(--philosophy-unit))]": 77,
  "[.im-pump-page_&]:[min-height:calc(336.26_*_var(--philosophy-unit))]": 78,
  "[.im-pump-page_&]:[margin-top:calc(34_*_var(--philosophy-unit))]": 79,
  "[.im-pump-page_&]:[padding-top:calc(51_*_var(--philosophy-unit))]": 80,
  "[.im-pump-page_&]:[padding-right:calc(43_*_var(--philosophy-unit))]": 81,
  "[.im-pump-page_&]:[padding-bottom:calc(51_*_var(--philosophy-unit))]": 82,
  "[.im-pump-page_&]:[padding-left:calc(43_*_var(--philosophy-unit))]": 83,
  "[.im-pump-page_&]:[background:#fff]": 85,
  "[.im-pump-page_&_>_h3]:[font-size:calc(25_*_var(--philosophy-unit))]!": 86,
  "[.im-pump-page_&_>_h3]:[line-height:1.12]!": 87,
  "[.im-pump-page_&_>_h3]:[font-weight:540]!": 88,
  "[.im-pump-page_&_>_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]!": 89,
  "[.im-pump-page_&]:[font-size:calc(15_*_var(--philosophy-unit))]!": 90,
  "[.im-pump-page_&_h4]:[font-size:calc(12_*_var(--philosophy-unit))]!": 93,
  "[.im-pump-page_&_h4]:[line-height:1.12]!": 651,
  "[.im-pump-page_&_h4]:[font-weight:410]!": 650,
  "[.im-pump-page_&_ul]:[display:grid]!": 96,
  "[.im-pump-page_&_ul]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]": 97,
  "[.im-pump-page_&_ul]:[gap:calc(8_*_var(--philosophy-unit))_calc(18_*_var(--philosophy-unit))]": 98,
  "[.im-pump-page_&_ul]:[margin-top:calc(12_*_var(--philosophy-unit))]": 99,
  "[.im-pump-page_&_ul]:[list-style:none]": 100,
  "[.im-pump-page_&_ul]:[padding-top:0]": 101,
  "[.im-pump-page_&_ul]:[padding-right:0]": 102,
  "[.im-pump-page_&_ul]:[padding-bottom:0]": 103,
  "[.im-pump-page_&_ul]:[padding-left:0]": 104,
  "[.im-pump-page_&]:[gap:calc(10_*_var(--philosophy-unit))]": 107,
  "[.im-pump-page_&]:[min-height:calc(34_*_var(--philosophy-unit))]": 109,
  "[.im-pump-page_&]:[padding-top:calc(7_*_var(--philosophy-unit))]": 110,
  "[.im-pump-page_&]:[padding-right:calc(12_*_var(--philosophy-unit))]": 111,
  "[.im-pump-page_&]:[padding-bottom:calc(7_*_var(--philosophy-unit))]": 112,
  "[.im-pump-page_&]:[padding-left:calc(12_*_var(--philosophy-unit))]": 113,
  "[.im-pump-page_&]:[border-radius:calc(6_*_var(--philosophy-unit))]": 114,
  "[.im-pump-page_&]:[background:#f5f5f5]": 115,
  "[.im-pump-page_&]:[line-height:1.15]!": 118,
  "[.im-pump-page_&]:[position:relative]": 353,
  "[.im-pump-page_&]:[width:calc(20_*_var(--philosophy-unit))]": 121,
  "[.im-pump-page_&]:[height:calc(20_*_var(--philosophy-unit))]": 122,
  "[.im-pump-page_&]:[color:#005eff]!": 648,
  "[.im-pump-page_&_svg]:[position:absolute]": 124,
  "[.im-pump-page_&_svg]:[top:0]": 125,
  "[.im-pump-page_&_svg]:[right:0]": 126,
  "[.im-pump-page_&_svg]:[bottom:0]": 127,
  "[.im-pump-page_&_svg]:[left:0]": 128,
  "[.im-pump-page_&_svg]:[width:100%]": 129,
  "[.im-pump-page_&_svg]:[height:100%]": 130,
  "max-[1200px]:[.im-pump-page_&]:[--philosophy-unit:1px]": 131,
  "max-[1200px]:[.im-pump-page_&]:[padding-top:80px]": 667,
  "max-[1200px]:[.im-pump-page_&]:[padding-bottom:80px]": 668,
  "max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1.5fr_1fr]": 134,
  "max-[1200px]:[.im-pump-page_&]:[gap:32px]": 670,
  "max-[1200px]:[.im-pump-page_&]:[padding-right:0]": 671,
  "max-[1200px]:[.im-pump-page_&_h2]:[font-size:clamp(32px,_4.2vw,_50px)]!": 672,
  "max-[1200px]:[.im-pump-page_&]:[white-space:normal]": 138,
  "max-[1200px]:[.im-pump-page_&_>_p]:[margin-top:64px]": 139,
  "max-[1200px]:[.im-pump-page_&_>_p]:[line-height:1.2]!": 273,
  "max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]": 274,
  "max-[1200px]:[.im-pump-page_&:last-child]:[grid-column:1_/_-1]": 142,
  "max-[1200px]:[.im-pump-page_&]:[height:auto]": 679,
  "max-[768px]:[.im-pump-page_&]:[padding-top:64px]": 680,
  "max-[768px]:[.im-pump-page_&]:[padding-right:20px]": 681,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:80px]": 682,
  "max-[768px]:[.im-pump-page_&]:[padding-left:20px]": 683,
  "max-[768px]:[.im-pump-page_&]:[grid-template-columns:1fr]": 690,
  "max-[768px]:[.im-pump-page_&]:[gap:24px]": 814,
  "max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(28px,_7.4vw,_42px)]!": 684,
  "max-[768px]:[.im-pump-page_&_h2]:[line-height:1.04]!": 685,
  "max-[768px]:[.im-pump-page_&]:[display:none]!": 816,
  "max-[768px]:[.im-pump-page_&_>_p]:[margin-top:0]": 153,
  "max-[768px]:[.im-pump-page_&_>_p]:[max-width:396px]": 154,
  "max-[768px]:[.im-pump-page_&]:[margin-top:36px]": 692,
  "max-[768px]:[.im-pump-page_&]:[gap:18px]": 286,
  "max-[768px]:[.im-pump-page_&:last-child]:[grid-column:auto]": 158,
  "max-[768px]:[.im-pump-page_&]:[min-height:222px]": 807,
  "max-[768px]:[.im-pump-page_&]:[font-size:clamp(22px,_6.9vw,_27px)]!": 162,
  "max-[768px]:[.im-pump-page_&]:[font-size:clamp(17px,_5.1vw,_20px)]!": 163,
  "max-[768px]:[.im-pump-page_&]:[margin-top:28px]": 165,
  "max-[768px]:[.im-pump-page_&]:[padding-top:32px]": 166,
  "max-[768px]:[.im-pump-page_&]:[padding-right:24px]": 167,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:32px]": 168,
  "max-[768px]:[.im-pump-page_&]:[padding-left:24px]": 169,
  "max-[768px]:[.im-pump-page_&_>_h3]:[font-size:23px]!": 171,
  "max-[768px]:[.im-pump-page_&_>_h3]:[line-height:1.15]!": 172,
  "max-[768px]:[.im-pump-page_&]:[line-height:1.3]!": 177,
  "max-[768px]:[.im-pump-page_&_ul]:[grid-template-columns:1fr]": 174,
  "max-[768px]:[.im-pump-page_&]:[padding-top:10px]": 175,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:10px]": 176,
  "[.im-pump-page_&]:[--promise-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 178,
  "[.im-pump-page_&]:[padding-top:calc(115_*_var(--promise-unit))]": 179,
  "[.im-pump-page_&]:[padding-bottom:calc(115_*_var(--promise-unit))]": 181,
  "[.im-pump-page_&]:[background:#9eb7d0]": 183,
  "[.im-pump-page_&]:[max-width:calc(1204_*_var(--promise-unit))]": 187,
  "[.im-pump-page_&]:[grid-template-columns:minmax(0,_650fr)_minmax(0,_463fr)]": 191,
  "[.im-pump-page_&]:[gap:calc(79_*_var(--promise-unit))]": 192,
  "[.im-pump-page_&]:[padding-right:calc(12_*_var(--promise-unit))]": 193,
  "[.im-pump-page_&]:[min-height:calc(130_*_var(--promise-unit))]": 194,
  "[.im-pump-page_&]:[margin-left:calc(6_*_var(--promise-unit))]": 196,
  "[.im-pump-page_&]:[font-size:calc(9_*_var(--promise-unit))]!": 197,
  "[.im-pump-page_&]:[color:#f7f7f7]!": 199,
  "[.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--promise-unit))]": 200,
  "[.im-pump-page_&_h2]:[font-size:calc(50_*_var(--promise-unit))]!": 201,
  "[.im-pump-page_&]:[width:calc(170_*_var(--promise-unit))]": 205,
  "[.im-pump-page_&]:[height:auto]": 206,
  "[.im-pump-page_&_>_p]:[margin-top:calc(10_*_var(--promise-unit))]": 207,
  "[.im-pump-page_&_>_p]:[font-size:calc(15_*_var(--promise-unit))]!": 208,
  "[.im-pump-page_&_>_p]:[color:#f7f7f7]!": 210,
  "[.im-pump-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))]": 212,
  "[.im-pump-page_&]:[gap:calc(13_*_var(--promise-unit))]": 242,
  "[.im-pump-page_&]:[max-width:calc(1199_*_var(--promise-unit))]": 214,
  "[.im-pump-page_&]:[margin-top:calc(60_*_var(--promise-unit))]": 215,
  "[.im-pump-page_&]:[gap:calc(32_*_var(--promise-unit))]": 219,
  "[.im-pump-page_&]:[min-height:calc(277_*_var(--promise-unit))]": 221,
  "[.im-pump-page_&]:[padding-top:calc(31_*_var(--promise-unit))]": 222,
  "[.im-pump-page_&]:[padding-right:calc(20_*_var(--promise-unit))]": 223,
  "[.im-pump-page_&]:[padding-bottom:calc(31_*_var(--promise-unit))]": 224,
  "[.im-pump-page_&]:[padding-left:calc(20_*_var(--promise-unit))]": 225,
  "[.im-pump-page_&]:[border:0.5px_solid_#9eb7d0]": 641,
  "[.im-pump-page_&]:[border-radius:calc(30_*_var(--promise-unit))]": 227,
  "[.im-pump-page_&]:[background:linear-gradient(35deg,_#ffffff_0%,_#ffffffb3_43%,_#ffffff00_100%)]": 228,
  "[.im-pump-page_&]:[font-size:calc(12_*_var(--promise-unit))]!": 238,
  "[.im-pump-page_&]:[color:#4687b8]!": 375,
  "[.im-pump-page_&_h3]:[margin-top:calc(13_*_var(--promise-unit))]": 232,
  "[.im-pump-page_&_h3]:[font-size:calc(20_*_var(--promise-unit))]!": 233,
  "[.im-pump-page_&_h3]:[font-weight:410]!": 655,
  "[.im-pump-page_&_h3]:[line-height:1.07]!": 656,
  "[.im-pump-page_&_h3]:[white-space:nowrap]": 236,
  "[.im-pump-page_&]:[margin-top:calc(13_*_var(--promise-unit))]": 237,
  "[.im-pump-page_&]:[margin-top:0]": 337,
  "[.im-pump-page_&]:[margin-right:0]": 338,
  "[.im-pump-page_&]:[margin-bottom:0]": 339,
  "[.im-pump-page_&]:[margin-left:0]": 340,
  "[.im-pump-page_&]:[padding-top:0]": 610,
  "[.im-pump-page_&]:[padding-right:0]": 611,
  "[.im-pump-page_&]:[padding-bottom:0]": 612,
  "[.im-pump-page_&]:[padding-left:0]": 613,
  "[.im-pump-page_&]:[list-style:none]": 345,
  "[.im-pump-page_&_li]:[display:flex]!": 252,
  "[.im-pump-page_&_li]:[align-items:flex-start]": 253,
  "[.im-pump-page_&_li]:[gap:calc(7_*_var(--promise-unit))]": 254,
  "[.im-pump-page_&_li]:[min-height:calc(20_*_var(--promise-unit))]": 255,
  "[.im-pump-page_&_li]:[font-size:calc(9_*_var(--promise-unit))]!": 256,
  "[.im-pump-page_&_li]:[line-height:1.12]!": 257,
  "[.im-pump-page_&_li]:[color:#9eb7d0]!": 258,
  "[.im-pump-page_&_svg]:[flex-shrink:0]": 259,
  "[.im-pump-page_&_svg]:[width:calc(15_*_var(--promise-unit))]": 260,
  "[.im-pump-page_&_svg]:[height:calc(15_*_var(--promise-unit))]": 261,
  "[.im-pump-page_&_svg]:[color:#005eff]!": 262,
  "[.im-pump-page_&_span]:[min-width:0]": 264,
  "max-[1200px]:[.im-pump-page_&]:[--promise-unit:1px]": 265,
  "max-[1200px]:[.im-pump-page_&]:[grid-template-columns:1fr]": 669,
  "max-[1200px]:[.im-pump-page_&]:[max-width:463px]": 272,
  "max-[1200px]:[.im-pump-page_&]:[gap:20px]": 678,
  "max-[768px]:[.im-pump-page_&]:[white-space:normal]": 686,
  "max-[768px]:[.im-pump-page_&]:[min-height:277px]": 823,
  "max-[768px]:[.im-pump-page_&_h3]:[white-space:normal]": 288,
  "[.im-pump-page_&]:[grid-template-columns:minmax(0,_702fr)_minmax(0,_376fr)]": 290,
  "[.im-pump-page_&]:[gap:calc(124_*_var(--standard-unit))]": 291,
  "[.im-pump-page_&]:[max-width:calc(1204_*_var(--standard-unit))]": 553,
  "[.im-pump-page_&]:[margin-top:calc(95_*_var(--standard-unit))]": 294,
  "[.im-pump-page_&]:[padding-right:calc(2_*_var(--standard-unit))]": 295,
  "[.im-pump-page_&]:[font-size:calc(9_*_var(--standard-unit))]!": 297,
  "[.im-pump-page_&_h2]:[margin-top:calc(20_*_var(--standard-unit))]": 565,
  "[.im-pump-page_&_h2]:[font-size:calc(50_*_var(--standard-unit))]!": 566,
  "[.im-pump-page_&_h2]:[letter-spacing:-0.04em]": 304,
  "[.im-pump-page_&_h2]:[color:#0d5792]!": 305,
  "[.im-pump-page_&]:[margin-top:calc(82_*_var(--standard-unit))]": 307,
  "[.im-pump-page_&]:[font-size:calc(15_*_var(--standard-unit))]!": 308,
  "max-[1200px]:[.im-pump-page_&]:[gap:24px]": 312,
  "max-[1200px]:[.im-pump-page_&]:[margin-top:80px]": 489,
  "max-[1200px]:[.im-pump-page_&]:[max-width:376px]": 316,
  "max-[1200px]:[.im-pump-page_&]:[margin-top:0]": 674,
  "max-[1200px]:[.im-pump-page_&]:[line-height:1.2]!": 318,
  "max-[768px]:[.im-pump-page_&]:[margin-top:64px]": 319,
  "[.im-pump-page_&]:[display:none]!": 324,
  "[.im-pump-page_&]:[margin-top:calc(168_*_var(--standard-unit))]": 325,
  "[.im-pump-page_&]:[margin-left:calc(-8.5_*_var(--standard-unit))]": 326,
  "[.im-pump-page_&]:[margin-right:calc(-8.5_*_var(--standard-unit))]": 327,
  "[.im-pump-page_&]:[isolation:isolate]": 330,
  "[.im-pump-page_&]:[min-height:calc(872.23_*_var(--standard-unit))]": 331,
  "[.im-pump-page_&]:[overflow:clip]": 332,
  "[.im-pump-page_&]:[grid-template-columns:repeat(var(--lifecycle-visible-count),_minmax(0,_1fr))]": 335,
  "[.im-pump-page_&]:[gap:calc(51_*_var(--standard-unit))]": 336,
  "[.im-pump-page_&]:[height:calc(46_*_var(--standard-unit))]": 349,
  "[.im-pump-page_&]:[position:absolute]": 467,
  "[.im-pump-page_&]:[z-index:3]": 351,
  "[.im-pump-page_&]:[height:calc(205_*_var(--standard-unit))]": 352,
  "[.im-pump-page_&]:[display:block]!": 396,
  "[.im-pump-page_&]:[width:calc(120_*_var(--standard-unit))]": 453,
  "[.im-pump-page_&]:[height:calc(120_*_var(--standard-unit))]": 356,
  "[.im-pump-page_&]:[max-width:100%]": 454,
  "[.im-pump-page_&]:[overflow:hidden]": 358,
  "[.im-pump-page_&]:[border:0]": 614,
  "[.im-pump-page_&]:[border-radius:calc(30_*_var(--standard-unit))]": 642,
  "[.im-pump-page_&]:[background:#c3ddec]": 365,
  "[.im-pump-page_&]:[cursor:pointer]": 619,
  "[.im-pump-page_&]:[transition:width_300ms_ease,_height_300ms_ease]": 367,
  "[.im-pump-page_.lifecycle-step--active_&&]:[width:calc(160_*_var(--standard-unit))]": 368,
  "[.im-pump-page_.lifecycle-step--active_&&]:[height:calc(205_*_var(--standard-unit))]": 369,
  "[.im-pump-page_&]:[height:100%]": 373,
  "[.im-pump-page_&]:[background:linear-gradient(145deg,_#c8e6f5,_#85b5d1)]": 374,
  "[.im-pump-page_&_svg]:[width:28%]": 376,
  "[.im-pump-page_&_svg]:[height:28%]": 377,
  "[.im-pump-page_&_svg]:[stroke-width:1]": 378,
  "[.im-pump-page_&]:[align-items:flex-start]": 381,
  "[.im-pump-page_&]:[gap:calc(16_*_var(--standard-unit))]": 382,
  "[.im-pump-page_&]:[margin-top:calc(20_*_var(--standard-unit))]": 384,
  "[.im-pump-page_&]:[border-radius:calc(15_*_var(--standard-unit))]": 390,
  "[.im-pump-page_&]:[background:transparent]": 391,
  "[.im-pump-page_&]:[text-align:left]": 392,
  "[.im-pump-page_&]:[transition:background-color_300ms_ease,_box-shadow_300ms_ease]": 395,
  "[.im-pump-page_&]:[max-width:calc(120_*_var(--standard-unit))]": 397,
  "[.im-pump-page_&]:[font-size:calc(12_*_var(--standard-unit))]!": 658,
  "[.im-pump-page_&]:[overflow-wrap:anywhere]": 459,
  "[.im-pump-page_&]:[transition:font-size_300ms_ease]": 460,
  "[.im-pump-page_.lifecycle-step--active_&&]:[min-height:calc(249_*_var(--standard-unit))]": 403,
  "[.im-pump-page_.lifecycle-step--active_&&]:[justify-content:space-between]": 404,
  "[.im-pump-page_.lifecycle-step--active_&&]:[padding-top:calc(20_*_var(--standard-unit))]": 405,
  "[.im-pump-page_.lifecycle-step--active_&&]:[padding-right:calc(20_*_var(--standard-unit))]": 406,
  "[.im-pump-page_.lifecycle-step--active_&&]:[padding-bottom:calc(20_*_var(--standard-unit))]": 407,
  "[.im-pump-page_.lifecycle-step--active_&&]:[padding-left:calc(20_*_var(--standard-unit))]": 408,
  "[.im-pump-page_.lifecycle-step--active_&&]:[background:#f7f7f7]": 409,
  "[.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_calc(-59_*_var(--standard-unit))_calc(95.9_*_var(--standard-unit))_#005eff26]": 410,
  "[.im-pump-page_.lifecycle-step--active_&&]:[max-width:none]": 411,
  "[.im-pump-page_.lifecycle-step--active_&&]:[width:100%]": 412,
  "[.im-pump-page_.lifecycle-step--active_&&]:[font-size:calc(20_*_var(--standard-unit))]!": 413,
  "[.im-pump-page_.lifecycle-step--active_&&]:[line-height:1.07]!": 414,
  "[.im-pump-page_.lifecycle-step--active_&&]:[text-align:center]": 466,
  "[.im-pump-page_&]:[width:calc(30_*_var(--standard-unit))]": 419,
  "[.im-pump-page_&]:[height:calc(30_*_var(--standard-unit))]": 420,
  "[.im-pump-page_&]:[border-radius:50%]": 615,
  "[.im-pump-page_&]:[color:#fff]!": 616,
  "[.im-pump-page_&]:[background:#27272a]": 423,
  "[.im-pump-page_&]:[transition:background-color_300ms_ease]": 424,
  "[.im-pump-page_&_svg]:[width:64%]": 425,
  "[.im-pump-page_&_svg]:[height:64%]": 426,
  "[.im-pump-page_&_svg]:[stroke-width:1.8]": 427,
  "[.im-pump-page_.lifecycle-step--active_&&]:[background:#005eff]": 428,
  "[.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_0_12px_#005eff30]": 429,
  "[.im-pump-page_&]:[justify-content:center]": 431,
  "[.im-pump-page_&]:[gap:calc(15_*_var(--standard-unit))]": 587,
  "[.im-pump-page_&]:[margin-top:calc(12_*_var(--standard-unit))]": 433,
  "[.im-pump-page_&_button]:[display:grid]!": 434,
  "[.im-pump-page_&_button]:[place-items:center]": 435,
  "[.im-pump-page_&_button]:[width:calc(34_*_var(--standard-unit))]": 436,
  "[.im-pump-page_&_button]:[height:calc(34_*_var(--standard-unit))]": 437,
  "[.im-pump-page_&_button]:[border:0]": 594,
  "[.im-pump-page_&_button]:[padding-top:0]": 439,
  "[.im-pump-page_&_button]:[padding-right:0]": 440,
  "[.im-pump-page_&_button]:[padding-bottom:0]": 441,
  "[.im-pump-page_&_button]:[padding-left:0]": 442,
  "[.im-pump-page_&_button]:[background:transparent]": 596,
  "[.im-pump-page_&_button]:[color:#9eb7d0]!": 444,
  "[.im-pump-page_&_button]:[cursor:pointer]": 601,
  "[.im-pump-page_&_svg]:[width:65%]": 620,
  "[.im-pump-page_&_svg]:[height:65%]": 621,
  "[.im-pump-page_&_button:hover:not(:disabled)]:[color:#0d5792]!": 448,
  "[.im-pump-page_&_button:disabled]:[opacity:0.35]": 449,
  "[.im-pump-page_&_button:disabled]:[cursor:default]": 450,
  "[.im-pump-page_&_button:focus-visible]:[outline:2px_solid_#005eff]": 623,
  "[.im-pump-page_&_button:focus-visible]:[outline-offset:3px]": 452,
  "[.im-pump-page_&]:[margin-top:calc(24_*_var(--standard-unit))]": 455,
  "[.im-pump-page_.lifecycle-step--active_&&]:[width:calc(149_*_var(--standard-unit))]": 461,
  "[.im-pump-page_.lifecycle-step--active_&&]:[margin-left:auto]": 462,
  "[.im-pump-page_.lifecycle-step--active_&&]:[margin-right:auto]": 463,
  "[.im-pump-page_.lifecycle-step--active_&&]:[font-size:calc(15_*_var(--standard-unit))]!": 464,
  "[.im-pump-page_.lifecycle-step--active_&&]:[line-height:1]!": 465,
  "[.im-pump-page_&]:[top:0]": 468,
  "[.im-pump-page_&]:[right:0]": 469,
  "[.im-pump-page_&]:[bottom:0]": 470,
  "[.im-pump-page_&]:[left:auto]": 471,
  "[.im-pump-page_&]:[width:10%]": 472,
  "[.im-pump-page_&]:[pointer-events:none]": 473,
  "[.im-pump-page_&]:[z-index:2]": 474,
  "[.im-pump-page_&_span]:[position:absolute]": 475,
  "[.im-pump-page_&_span]:[top:0]": 476,
  "[.im-pump-page_&_span]:[right:0]": 477,
  "[.im-pump-page_&_span]:[bottom:0]": 478,
  "[.im-pump-page_&_span]:[left:0]": 479,
  "[.im-pump-page_&_span]:[mask-image:linear-gradient(90deg,_transparent,_#000)]": 480,
  "[.im-pump-page_&_span:nth-child(1)]:[backdrop-filter:blur(3px)]": 481,
  "[.im-pump-page_&_span:nth-child(2)]:[left:30%]": 482,
  "[.im-pump-page_&_span:nth-child(2)]:[backdrop-filter:blur(8px)]": 483,
  "[.im-pump-page_&_span:nth-child(3)]:[left:55%]": 484,
  "[.im-pump-page_&_span:nth-child(3)]:[backdrop-filter:blur(16px)]": 485,
  "[.im-pump-page_&_span:nth-child(4)]:[left:78%]": 486,
  "[.im-pump-page_&_span:nth-child(4)]:[backdrop-filter:blur(34.1px)]": 487,
  "[.im-pump-page_&_span:nth-child(4)]:[background:#f5fafc55]": 488,
  "max-[1200px]:[.im-pump-page_&]:[margin-left:0]": 505,
  "max-[1200px]:[.im-pump-page_&]:[margin-right:0]": 506,
  "max-[1200px]:[.im-pump-page_&]:[min-height:980px]": 493,
  "max-[1200px]:[.im-pump-page_&]:[margin-top:48px]": 494,
  "max-[1200px]:[.im-pump-page_&]:[margin-right:-20px]": 495,
  "max-[1200px]:[.im-pump-page_&]:[margin-bottom:0]": 512,
  "max-[1200px]:[.im-pump-page_&]:[margin-left:-20px]": 497,
  "max-[1200px]:[.im-pump-page_&]:[min-height:850px]": 498,
  "max-[1200px]:[.im-pump-page_&]:[touch-action:pan-y]": 499,
  "max-[1200px]:[.im-pump-page_&]:[grid-template-columns:repeat(var(--lifecycle-visible-count),_160px)]": 500,
  "max-[1200px]:[.im-pump-page_&]:[gap:70px]": 501,
  "max-[1200px]:[.im-pump-page_&]:[width:620px]": 502,
  "max-[1200px]:[.im-pump-page_&]:[left:calc(50%_-_310px)]": 503,
  "max-[1200px]:[.im-pump-page_&]:[width:160px]": 504,
  "max-[1200px]:[.im-pump-page_&]:[display:flex]!": 527,
  "max-[1200px]:[.im-pump-page_&]:[justify-content:center]": 528,
  "max-[1200px]:[.im-pump-page_&]:[max-width:160px]": 509,
  "max-[1200px]:[.im-pump-page_&]:[margin-top:32px]": 510,
  "max-[1200px]:[.im-pump-page_&]:[margin-right:auto]": 511,
  "max-[1200px]:[.im-pump-page_&]:[margin-left:auto]": 513,
  "max-[1200px]:[.im-pump-page_&]:[height:100px]": 514,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[width:150px]": 515,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[margin-left:auto]": 516,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[margin-right:auto]": 517,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[font-size:15px]!": 518,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[line-height:1]!": 519,
  "max-[1200px]:[.im-pump-page_&]:[margin-top:42px]": 520,
  "max-[1200px]:[.im-pump-page_&_svg]:[width:90%]": 521,
  "max-[1200px]:[.im-pump-page_&_svg]:[height:90%]": 522,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[background:linear-gradient(135deg,_#438aff,_#004bdc)]": 523,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[border:0.5px_solid_#dceaff]": 524,
  "max-[1200px]:[.im-pump-page_.lifecycle-step--active_&&]:[box-shadow:0_0_20px_7px_#005eff40]": 525,
  "max-[1200px]:[.im-pump-page_&]:[display:none]!": 526,
  "max-[1200px]:[.im-pump-page_&]:[gap:4px]": 529,
  "max-[1200px]:[.im-pump-page_&]:[margin-top:20px]": 530,
  "max-[1200px]:[.im-pump-page_&_button]:[width:10px]": 531,
  "max-[1200px]:[.im-pump-page_&_button]:[height:7px]": 532,
  "max-[1200px]:[.im-pump-page_&_button]:[padding-top:0]": 533,
  "max-[1200px]:[.im-pump-page_&_button]:[padding-right:0]": 534,
  "max-[1200px]:[.im-pump-page_&_button]:[padding-bottom:0]": 535,
  "max-[1200px]:[.im-pump-page_&_button]:[padding-left:0]": 536,
  "max-[1200px]:[.im-pump-page_&_button]:[border:0]": 537,
  "max-[1200px]:[.im-pump-page_&_button]:[border-radius:999px]": 538,
  "max-[1200px]:[.im-pump-page_&_button]:[background:#d9d9d9]": 539,
  "max-[1200px]:[.im-pump-page_&_button]:[cursor:pointer]": 540,
  "max-[1200px]:[.im-pump-page_&_button[aria-pressed='true']]:[width:34px]": 541,
  "max-[1200px]:[.im-pump-page_&_button[aria-pressed='true']]:[background:#9eb7d0]": 542,
  "motion-reduce:[.im-pump-page_&_*]:[transition:none]!": 1000543,
  "[.im-pump-page_&]:[--standard-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 544,
  "[.im-pump-page_&]:[padding-top:calc(115_*_var(--standard-unit))]": 545,
  "[.im-pump-page_&]:[padding-bottom:calc(115_*_var(--standard-unit))]": 547,
  "[.im-pump-page_&]:[background:linear-gradient(105deg,_#d5eaf8_0%,_#e8f4fb_54%,_#f5fafc_100%)]": 549,
  "[.im-pump-page_&]:[grid-template-columns:minmax(0,_650fr)_minmax(0,_509fr)]": 557,
  "[.im-pump-page_&]:[gap:calc(40_*_var(--standard-unit))]": 558,
  "[.im-pump-page_&]:[min-height:calc(130_*_var(--standard-unit))]": 559,
  "[.im-pump-page_&]:[padding-right:calc(5_*_var(--standard-unit))]": 560,
  "[.im-pump-page_&_>_p]:[font-size:calc(9_*_var(--standard-unit))]!": 562,
  "[.im-pump-page_&_>_p]:[line-height:1.12]!": 664,
  "[.im-pump-page_&]:[height:calc(34_*_var(--standard-unit))]": 574,
  "[.im-pump-page_&]:[margin-top:calc(68_*_var(--standard-unit))]": 575,
  "[.im-pump-page_&]:[padding-top:calc(2_*_var(--standard-unit))]": 576,
  "[.im-pump-page_&]:[padding-right:calc(10_*_var(--standard-unit))]": 577,
  "[.im-pump-page_&]:[padding-bottom:calc(2_*_var(--standard-unit))]": 578,
  "[.im-pump-page_&]:[padding-left:calc(10_*_var(--standard-unit))]": 579,
  "[.im-pump-page_&]:[border-radius:calc(8_*_var(--standard-unit))]": 580,
  "[.im-pump-page_&]:[background:#f5f5f4]": 581,
  "[.im-pump-page_&]:[box-shadow:0_3px_12px_#0d579210]": 582,
  "[.im-pump-page_&]:[flex:1]": 584,
  "[.im-pump-page_&_button]:[flex-shrink:0]": 589,
  "[.im-pump-page_&_button]:[padding-top:calc(5_*_var(--standard-unit))]": 590,
  "[.im-pump-page_&_button]:[padding-right:calc(8_*_var(--standard-unit))]": 591,
  "[.im-pump-page_&_button]:[padding-bottom:calc(5_*_var(--standard-unit))]": 592,
  "[.im-pump-page_&_button]:[padding-left:calc(8_*_var(--standard-unit))]": 593,
  "[.im-pump-page_&_button]:[border-radius:calc(5_*_var(--standard-unit))]": 595,
  "[.im-pump-page_&_button]:[color:#27272a]!": 597,
  "[.im-pump-page_&_button]:[font-size:calc(12_*_var(--standard-unit))]!": 598,
  "[.im-pump-page_&_button]:[line-height:1.08]!": 599,
  "[.im-pump-page_&_button]:[white-space:nowrap]": 600,
  "[.im-pump-page_&_button:hover]:[background:#ffffff80]": 602,
  "[.im-pump-page_&_button[aria-pressed='true']]:[background:#fff]": 603,
  "[.im-pump-page_&_button[aria-pressed='true']]:[box-shadow:0_1px_4px_#0d579214]": 604,
  "[.im-pump-page_&]:[width:calc(23_*_var(--standard-unit))]": 608,
  "[.im-pump-page_&]:[height:calc(23_*_var(--standard-unit))]": 609,
  "[.im-pump-page_&]:[background:linear-gradient(135deg,_#005eff,_#001ea2)]": 617,
  "[.im-pump-page_&]:[box-shadow:0_0_8px_#005eff40]": 618,
  "[.im-pump-page_&_svg]:[stroke-width:2]": 622,
  "[.im-pump-page_&_button:focus-visible]:[outline-offset:2px]": 624,
  "[.im-pump-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]": 626,
  "[.im-pump-page_&]:[align-content:start]": 627,
  "[.im-pump-page_&]:[gap:calc(20_*_var(--standard-unit))_calc(26_*_var(--standard-unit))]": 628,
  "[.im-pump-page_&]:[min-height:calc(496_*_var(--standard-unit))]": 629,
  "[.im-pump-page_&]:[margin-top:calc(47_*_var(--standard-unit))]": 630,
  "[.im-pump-page_&]:[gap:calc(30_*_var(--standard-unit))]": 634,
  "[.im-pump-page_&]:[min-height:calc(238_*_var(--standard-unit))]": 636,
  "[.im-pump-page_&]:[padding-top:calc(31_*_var(--standard-unit))]": 637,
  "[.im-pump-page_&]:[padding-right:calc(20_*_var(--standard-unit))]": 638,
  "[.im-pump-page_&]:[padding-bottom:calc(31_*_var(--standard-unit))]": 639,
  "[.im-pump-page_&]:[padding-left:calc(20_*_var(--standard-unit))]": 640,
  "[.im-pump-page_&]:[background:linear-gradient(125deg,_#fff_0%,_#ffffff80_48%,_#ffffff00_100%)]": 643,
  "[.im-pump-page_&]:[backdrop-filter:blur(16.8px)]": 644,
  "[.im-pump-page_&_h4]:[font-size:calc(12_*_var(--standard-unit))]!": 649,
  "[.im-pump-page_&_h4]:[color:#005eff]!": 652,
  "[.im-pump-page_&_h3]:[margin-top:calc(13_*_var(--standard-unit))]": 653,
  "[.im-pump-page_&_h3]:[font-size:calc(20_*_var(--standard-unit))]!": 654,
  "[.im-pump-page_&]:[margin-top:calc(13_*_var(--standard-unit))]": 657,
  "[.im-pump-page_&_>_p]:[max-width:calc(480_*_var(--standard-unit))]": 661,
  "[.im-pump-page_&_>_p]:[margin-top:calc(13_*_var(--standard-unit))]": 662,
  "[.im-pump-page_&_>_p]:[font-size:calc(12_*_var(--standard-unit))]!": 663,
  "[.im-pump-page_&_>_p]:[color:#27272a]!": 665,
  "max-[1200px]:[.im-pump-page_&]:[--standard-unit:1px]": 666,
  "max-[1200px]:[.im-pump-page_&]:[max-width:509px]": 673,
  "max-[1200px]:[.im-pump-page_&]:[overflow-x:auto]": 675,
  "max-[1200px]:[.im-pump-page_&]:[justify-content:flex-start]": 676,
  "max-[1200px]:[.im-pump-page_&]:[scrollbar-width:thin]": 677,
  "max-[768px]:[.im-pump-page_&]:[gap:10px]": 688,
  "max-[768px]:[.im-pump-page_&]:[gap:8px]": 689,
  "max-[768px]:[.im-pump-page_&]:[min-height:0]": 744,
  "max-[768px]:[.im-pump-page_&]:[min-height:238px]": 693,
  "max-[768px]:[.im-pump-page_&]:[line-height:1.25]!": 694,
  "max-[768px]:[.im-pump-page_&_>_p]:[line-height:1.25]!": 695,
  "[--im-pump-header-offset:97px]": 696,
  "[--im-pump-x-unit:0.0694444444vw]": 697,
  "[--im-pump-unit:min(var(--im-pump-x-unit),_0.1035196687svh)]": 698,
  "[margin-top:calc(-1_*_var(--im-pump-header-offset))]": 699,
  "[background:#010416]": 700,
  "[.im-pump-page_&]:[height:calc(966_*_var(--im-pump-unit))]": 701,
  "[.im-pump-page_&]:[background:radial-gradient(ellipse_at_50%_43%,_#073789_0%,_#020e3a_35%,_#010416_70%)]": 702,
  "[.im-pump-page_&]:[height:calc(648_*_var(--im-pump-unit))]": 703,
  "[.im-pump-page_&_>_video]:[position:absolute]": 704,
  "[.im-pump-page_&_>_video]:[width:100%]": 705,
  "[.im-pump-page_&_>_video]:[height:auto]": 706,
  "[.im-pump-page_&_>_video]:[min-height:100%]": 707,
  "[.im-pump-page_&_>_video]:[top:calc(-800_*_(var(--im-pump-x-unit)_-_var(--im-pump-unit)))]": 708,
  "[.im-pump-page_&]:[height:calc(40_*_var(--im-pump-unit))]": 709,
  "[.im-pump-page_&]:[background:linear-gradient(transparent,_#141a32aa)]": 710,
  "[.im-pump-page_&]:[height:calc(318_*_var(--im-pump-unit))]": 711,
  "[.im-pump-page_&]:[background:radial-gradient(ellipse_at_50%_0%,_#377ac882_0%,_#26397570_28%,_transparent_66%),_radial-gradient(ellipse_at_50%_60%,_#272e5870,_transparent_70%),_linear-gradient(#202233,_#1c1d28)]": 712,
  "[.im-pump-page_&]:[top:calc(273_*_var(--im-pump-x-unit)_-_800_*_(var(--im-pump-x-unit)_-_var(--im-pump-unit)))]": 713,
  "[.im-pump-page_&]:[width:calc(351_*_var(--im-pump-unit))]": 714,
  "[.im-pump-page_&]:[height:calc(47.42_*_var(--im-pump-unit))]": 715,
  "[.im-pump-page_&]:[padding-top:calc(7_*_var(--im-pump-unit))]": 716,
  "[.im-pump-page_&]:[padding-right:calc(16_*_var(--im-pump-unit))]": 717,
  "[.im-pump-page_&]:[padding-bottom:calc(7_*_var(--im-pump-unit))]": 718,
  "[.im-pump-page_&]:[padding-left:calc(16_*_var(--im-pump-unit))]": 719,
  "[.im-pump-page_&]:[gap:calc(12_*_var(--im-pump-unit))]": 720,
  "[.im-pump-page_&]:[width:calc(32_*_var(--im-pump-unit))]": 721,
  "[.im-pump-page_&]:[height:calc(32_*_var(--im-pump-unit))]": 722,
  "[.im-pump-page_&]:[font-size:calc(12_*_var(--im-pump-unit))]!": 723,
  "[.im-pump-page_&]:[line-height:1.05]!": 724,
  "[.im-pump-page_&]:[top:calc(699_*_var(--im-pump-unit))]": 726,
  "[.im-pump-page_&]:[width:calc(732_*_var(--im-pump-unit))]": 727,
  "[.im-pump-page_&]:[max-width:calc(100%_-_48px)]": 728,
  "[.im-pump-page_&]:[font-size:calc(25_*_var(--im-pump-unit))]!": 729,
  "[.im-pump-page_&]:[letter-spacing:0]": 731,
  "[.im-pump-page_&]:[margin-top:calc(29_*_var(--im-pump-unit))]": 732,
  "[.im-pump-page_&]:[font-size:calc(15_*_var(--im-pump-unit))]!": 733,
  "[.im-pump-page_&]:[top:calc(869_*_var(--im-pump-unit))]": 736,
  "[.im-pump-page_&]:[width:calc(61_*_var(--im-pump-unit))]": 737,
  "[.im-pump-page_&]:[height:calc(61_*_var(--im-pump-unit))]": 738,
  "min-[768px]:max-[1440px]:[--im-pump-unit:clamp(0.8px,_0.0694444444vw,_1px)]": 739,
  "min-[768px]:max-[1440px]:[--im-pump-x-unit:var(--im-pump-unit)]": 740,
  "max-[768px]:[--im-pump-unit:1px]": 741,
  "max-[768px]:[--im-pump-x-unit:1px]": 742,
  "max-[768px]:[.im-pump-page_&]:[height:clamp(720px,_185vw,_1100px)]": 743,
  "max-[768px]:[.im-pump-page_&]:[height:clamp(400px,_104vw,_750px)]": 745,
  "max-[768px]:[.im-pump-page_&_>_video]:[top:90px]": 746,
  "max-[768px]:[.im-pump-page_&_>_video]:[left:50%]": 747,
  "max-[768px]:[.im-pump-page_&_>_video]:[width:160%]": 748,
  "max-[768px]:[.im-pump-page_&_>_video]:[max-width:none]": 749,
  "max-[768px]:[.im-pump-page_&_>_video]:[transform:translateX(-50%)]": 750,
  "max-[768px]:[.im-pump-page_&_>_video]:[height:auto]": 751,
  "max-[768px]:[.im-pump-page_&_>_video]:[min-height:0]": 752,
  "max-[768px]:[.im-pump-page_&_>_video]:[object-fit:contain]": 753,
  "max-[768px]:[.im-pump-page_&_>_video]:[object-position:center_bottom]": 754,
  "max-[768px]:[.im-pump-page_&]:[top:clamp(450px,_120vw,_840px)]": 755,
  "max-[768px]:[.im-pump-page_&]:[width:186px]": 756,
  "max-[768px]:[.im-pump-page_&]:[height:80px]": 757,
  "max-[768px]:[.im-pump-page_&]:[padding-top:8px]": 758,
  "max-[768px]:[.im-pump-page_&]:[padding-right:16px]": 759,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:8px]": 760,
  "max-[768px]:[.im-pump-page_&]:[padding-left:16px]": 761,
  "max-[768px]:[.im-pump-page_&]:[gap:12px]": 762,
  "max-[768px]:[.im-pump-page_&]:[font-size:12px]!": 809,
  "max-[768px]:[.im-pump-page_&]:[top:clamp(400px,_104vw,_750px)]": 764,
  "max-[768px]:[.im-pump-page_&]:[height:auto]": 765,
  "max-[768px]:[.im-pump-page_&]:[position:absolute]": 782,
  "max-[768px]:[.im-pump-page_&]:[top:0]": 767,
  "max-[768px]:[.im-pump-page_&]:[width:100%]": 768,
  "max-[768px]:[.im-pump-page_&]:[max-width:none]": 769,
  "max-[768px]:[.im-pump-page_&]:[padding-top:0]": 770,
  "max-[768px]:[.im-pump-page_&]:[padding-right:0]": 771,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:0]": 772,
  "max-[768px]:[.im-pump-page_&]:[padding-left:0]": 773,
  "max-[768px]:[.im-pump-page_&]:[top:clamp(130px,_36vw,_240px)]": 775,
  "max-[768px]:[.im-pump-page_&]:[left:28px]": 784,
  "max-[768px]:[.im-pump-page_&]:[right:28px]": 785,
  "max-[768px]:[.im-pump-page_&]:[font-size:clamp(16px,_4.3vw,_25px)]!": 778,
  "max-[768px]:[.im-pump-page_&]:[font-weight:410]!": 1000779,
  "max-[768px]:[.im-pump-page_&]:[font-variation-settings:'wght'_410,_'wdth'_125]!": 1000780,
  "max-[768px]:[.im-pump-page_&]:[line-height:1.07]!": 813,
  "max-[768px]:[.im-pump-page_&]:[top:clamp(568px,_150vw,_1030px)]": 783,
  "max-[768px]:[.im-pump-page_&]:[margin-top:0]": 786,
  "max-[768px]:[.im-pump-page_&]:[margin-right:0]": 787,
  "max-[768px]:[.im-pump-page_&]:[margin-bottom:0]": 788,
  "max-[768px]:[.im-pump-page_&]:[margin-left:0]": 789,
  "max-[768px]:[.im-pump-page_&]:[font-size:16px]!": 790,
  "max-[768px]:[.im-pump-page_&]:[line-height:1]!": 844,
  "max-[768px]:[.im-pump-page_&]:[text-align:center]": 835,
  "max-[768px]:[.im-pump-page_&]:[gap:20px]": 836,
  "max-[768px]:[.im-pump-page_&_h2]:[max-width:340px]": 795,
  "max-[768px]:[.im-pump-page_&_h2]:[margin-left:auto]": 838,
  "max-[768px]:[.im-pump-page_&_h2]:[margin-right:auto]": 839,
  "max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.3vw,_42px)]!": 840,
  "max-[768px]:[.im-pump-page_&_h2]:[line-height:1]!": 841,
  "max-[768px]:[.im-pump-page_&_>_p]:[margin-left:auto]": 800,
  "max-[768px]:[.im-pump-page_&_>_p]:[margin-right:auto]": 801,
  "max-[768px]:[.im-pump-page_&_>_p]:[line-height:1]!": 802,
  "max-[768px]:[.im-pump-page_&]:[padding-top:22px]": 803,
  "max-[768px]:[.im-pump-page_&]:[padding-right:22px]": 832,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:22px]": 805,
  "max-[768px]:[.im-pump-page_&]:[padding-left:22px]": 834,
  "max-[768px]:[.im-pump-page_&]:[font-size:15px]!": 808,
  "max-[768px]:[.im-pump-page_&]:[font-size:20px]!": 810,
  "max-[768px]:[.im-pump-page_&]:[font-size:10px]!": 812,
  "max-[768px]:[.im-pump-page_&]:[order:-1]": 815,
  "max-[768px]:[.im-pump-page_&_h2]:[width:min(304px,_100%)]": 817,
  "max-[768px]:[.im-pump-page_&_h2]:[margin-top:0]": 818,
  "max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(40px,_11vw,_56px)]!": 819,
  "max-[768px]:[.im-pump-page_&_h2]:[overflow-wrap:anywhere]": 821,
  "max-[768px]:[.im-pump-page_&]:[margin-top:60px]": 822,
  "max-[768px]:[.im-pump-page_&_h2]:[font-size:clamp(27px,_7.4vw,_42px)]!": 825,
  "max-[768px]:[.im-pump-page_&]:[gap:40px]": 827,
  "max-[768px]:[.im-pump-page_&]:[scrollbar-width:none]": 828,
  "max-[768px]:[.im-pump-page_&::-webkit-scrollbar]:[display:none]!": 829,
  "max-[768px]:[.im-pump-page_&]:[min-height:300px]": 830,
  "max-[768px]:[.im-pump-page_&]:[padding-top:30px]": 831,
  "max-[768px]:[.im-pump-page_&]:[padding-bottom:30px]": 833,
  "max-[768px]:[.im-pump-page_&_h2]:[max-width:320px]": 837,
  "max-[768px]:[.im-pump-page_&]:[margin-left:auto]": 842,
  "max-[768px]:[.im-pump-page_&]:[margin-right:auto]": 843,
};
function twImPumpPage(value: string | undefined): string {
  const names = (value ?? "").split(/\s+/).filter(Boolean);
  const selected = new Map<string, string>();
  for (const name of names)
    for (const token of (twImPumpPageRules[name] ?? "")
      .split(" ")
      .filter(Boolean)) {
      const matches = [...token.matchAll(/\[([\w-]+):/g)];
      const match = matches[matches.length - 1];
      const key = match
        ? token.slice(0, match.index) + "|" + match[1]
        : token.replace(/animate-[\w-]+!?$/, "animation");
      const old = selected.get(key);
      if (
        !old ||
        (twImPumpPagePriority[token] ?? 0) >= (twImPumpPagePriority[old] ?? 0)
      )
        selected.set(key, token);
    }
  return [...names, ...selected.values()].join(" ");
}
