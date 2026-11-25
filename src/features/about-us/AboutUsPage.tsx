"use client";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type KeyboardEvent,
  type PointerEvent,
  type CSSProperties,
} from "react";
import {
  LuFactory,
  LuGlobe,
  LuHardHat,
  LuLayers,
  LuPlus,
} from "react-icons/lu";
import { FiArrowUpRight, FiEye } from "react-icons/fi";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useViewportVideo from "@/components/media/useViewportVideo";
// Scroll reveals: transform and opacity only, so the existing layout stays intact.
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

// The hero has its own entrance sequence: it plays once on load, independent of scroll.
const heroTitleVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.14 } },
};
const heroLineVariants: Variants = {
  hidden: { opacity: 0, y: "110%", filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
  },
};
const heroTitleLines = ["Reliable", "Engineering", "Wherever Fluid", "Flows"];

function heroEnter(reduced: boolean, delay: number, y = 18) {
  return {
    initial: reduced ? false : { opacity: 0, y, filter: "blur(7px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 0.85,
      delay: reduced ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };
}

const asset = (name: string) => `/about-us/${encodeURIComponent(name)}`;
const factoryVideo = asset(
  "magnific_kamera-yavas-bir-sekilde-_ovCFcYB829.webm",
);
const cultureVideo = asset("magnific_prompt-create-a-clean-pre_TdmBOmuVNR.mp4");
const globeVideo = asset("5976781_CG_Animation_1280x720.mp4");
const frame = "mx-auto w-5/6";
const title =
  "m-0 text-[clamp(28px,4.6vw,42px)] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(36*var(--about-unit))]";
const paragraph =
  "m-0 text-[13px] leading-[1.2] tracking-[-0.04em] text-[#6DB7D0] min-[1200px]:text-[calc(15*var(--about-unit))]";
const glass = "border border-white/60 bg-white/10 backdrop-blur-[25px]";

// Figma: upper sections fade from white on the left to cool blue on the right;
// lower sections retain the pale blue color, without section break lines.
const aboutPageBackground = {
  backgroundColor: "#E6F3FF",
  backgroundImage:
    "radial-gradient(ellipse 72% 45% at 5% 10%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.94) 43%, rgba(255,255,255,0) 100%), linear-gradient(100deg, #EAF6FF 0%, #E4F2FF 52%, #D1E9FF 100%)",
};

// The supplied MP4 has a visible grey background of its own. Softly erase
// its outside edges; the multiply blend lets the underlying page color show.
// Soft alpha fade reaches full transparency BEFORE the video bounds.
// This eliminates the tinted rectangular video edges against the page gradient.
const cultureVideoMask =
  "radial-gradient(ellipse 68% 65% at 50% 50%, #000 0%, #000 36%, rgba(0,0,0,0.88) 47%, rgba(0,0,0,0.42) 60%, transparent 72%)";

// Reveal runs on each visible element, NOT a whole tall section.
// This avoids off-screen children finishing before the user reaches them.
const localViewport = {
  once: false,
  amount: 0.38,
  margin: "0px 0px -14% 0px",
} as const;

// The original text and its two final colors are kept unchanged.
const storyTextParts = [
  {
    text: "With over 50 years of experience, Sempa Pompa Makina A.Ş. specializes in the manufacture of centrifugal pumps and offers comprehensive solutions, turnkey projects, ",
    color: "#27272A",
  },
  {
    text: "pump systems, and equipment tailored to its customers’ needs.",
    color: "#0D5792",
  },
] as const;
const storyFullText = storyTextParts.map((part) => part.text).join("");

type StoryToken = {
  text: string;
  color: string;
  sequence: number | null;
  wordIndex: number | null;
};
function splitStoryIntoGroups(): StoryToken[] {
  const tokens: StoryToken[] = [];
  let sequence = 0;
  let wordIndex = 0;
  for (const part of storyTextParts) {
    // Keep whitespace as text nodes so natural wrapping is preserved.
    for (const word of part.text.match(/\s+|\S+/gu) ?? []) {
      if (/^\s+$/u.test(word)) {
        tokens.push({
          text: word,
          color: part.color,
          sequence: null,
          wordIndex: null,
        });
        continue;
      }
      const letters = Array.from(word);
      const groupCount = Math.ceil(letters.length / 5);
      const groupSize = Math.ceil(letters.length / groupCount);
      for (let start = 0; start < letters.length; start += groupSize) {
        tokens.push({
          text: letters.slice(start, start + groupSize).join(""),
          color: part.color,
          sequence: sequence++,
          wordIndex,
        });
      }
      wordIndex++;
    }
  }
  return tokens;
}
const storyTokens = splitStoryIntoGroups();
const storyGroupCount = storyTokens.filter(
  (token) => token.sequence !== null,
).length;
// Group adjacent chunks from one word so line wrapping stays identical to normal text.
const storyUnits: StoryToken[][] = [];
for (const token of storyTokens) {
  const previous = storyUnits[storyUnits.length - 1];
  if (token.wordIndex !== null && previous?.[0].wordIndex === token.wordIndex) {
    previous.push(token);
  } else {
    storyUnits.push([token]);
  }
}

function ScrollColorChunk({
  token,
  progress,
  reduced,
}: {
  token: StoryToken;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each chunk contains approximately 4–5 characters, not individual letters.
  const index = token.sequence ?? 0;
  const groupStep = 0.94 / Math.max(1, storyGroupCount);
  const start = index * groupStep;
  const end = Math.min(1, start + groupStep * 1.6);
  const animatedColor = useTransform(
    progress,
    [start, end],
    ["#A3AAB4", token.color],
  );
  return (
    <motion.span style={{ color: reduced ? token.color : animatedColor }}>
      {token.text}
    </motion.span>
  );
}

function ScrollColorStoryTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion() ?? false;
  // 0: title reaches lower visible viewport; 1: title scrolls toward upper viewport.
  // Scrolling backwards restores grey gradually as well.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.87", "end 0.32"],
  });
  return (
    <h2
      ref={ref}
      id="about-story-title"
      className={title}
      aria-label={storyFullText}
    >
      <span aria-hidden="true">
        {storyUnits.map((unit, i) =>
          unit[0].sequence === null ? (
            <span key={i}>{unit[0].text}</span>
          ) : (
            <span key={i} className="whitespace-nowrap">
              {unit.map((token) => (
                <ScrollColorChunk
                  key={token.sequence}
                  token={token}
                  progress={scrollYProgress}
                  reduced={reduced}
                />
              ))}
            </span>
          ),
        )}
      </span>
    </h2>
  );
}

function SectionHeading({
  eyebrow,
  children,
  description,
}: {
  eyebrow: string;
  children: ReactNode;
  description?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      {...reveal("up", 0, reduced)}
      className={`${frame} grid gap-6 min-[1200px]:grid-cols-[242fr_883fr] min-[1200px]:gap-[calc(75*var(--about-unit))]`}
    >
      <p className="m-0 pt-1 text-[11px] leading-none tracking-[-0.04em] text-[#005EFF] min-[1200px]:text-[calc(15*var(--about-unit))]">
        {eyebrow}
      </p>
      <div className="min-w-0">
        <h2 className={title}>{children}</h2>
        {description && (
          <p
            className={`${paragraph} mt-4 min-[1200px]:mt-[calc(18*var(--about-unit))]`}
          >
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
function ActionLink({
  href,
  children,
  blue = false,
  frosted = false,
  icon = "arrow",
}: {
  href: string;
  children: ReactNode;
  blue?: boolean;
  frosted?: boolean;
  icon?: "arrow" | "eye";
}) {
  return (
    <Link
      href={href}
      className={`group/action relative isolate inline-flex h-[40px] max-w-full shrink-0 items-center overflow-hidden border pl-[15px] pr-[45px] text-[12px] leading-none tracking-[-0.04em] transition-[border-color,box-shadow,color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF] motion-reduce:transition-none min-[1200px]:h-[calc(43*var(--about-unit))] min-[1200px]:pl-[calc(16*var(--about-unit))] min-[1200px]:pr-[calc(50*var(--about-unit))] min-[1200px]:text-[calc(15*var(--about-unit))] ${frosted ? "rounded-[23px] min-[1200px]:rounded-[calc(23*var(--about-unit))]" : "rounded-[24px] min-[1200px]:rounded-[calc(25*var(--about-unit))]"} ${
        frosted
          ? "border-white/50 bg-white/10 text-[#27272A] shadow-[0_4px_14px_rgba(26,80,126,0.06),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[30px] hover:border-white/60 hover:bg-white/15 hover:shadow-[0_5px_15px_rgba(26,80,126,0.09)]"
          : blue
            ? "border-[#2465E5]/70 bg-white text-[#F7F7F7] shadow-[0_5px_14px_rgba(0,55,190,0.13),inset_0_1px_0_rgba(255,255,255,0.20)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:bg-[linear-gradient(180deg,#005EFF_0%,#0048ED_55%,#001DBD_100%)] before:opacity-100 before:content-[''] before:transition-opacity before:duration-[650ms] before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:opacity-0 hover:border-white hover:text-black hover:shadow-[0_6px_16px_rgba(26,80,126,0.11),inset_0_1px_0_rgba(255,255,255,0.74)]"
            : "border-[#B9D1E4] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,250,255,0.82)_100%)] text-[#27272A] shadow-[0_4px_12px_rgba(26,80,126,0.06),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px] hover:border-[#A7C8E4] hover:shadow-[0_6px_16px_rgba(26,80,126,0.11),inset_0_1px_0_rgba(255,255,255,0.74)]"
      }`}
    >
      <span
        className={`relative z-[2] block whitespace-nowrap transition-[transform,color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/action:translate-x-[30px] motion-reduce:transition-none motion-reduce:group-hover/action:translate-x-0 min-[1200px]:group-hover/action:translate-x-[calc(34*var(--about-unit))] ${blue ? "text-[#F7F7F7] group-hover/action:text-black" : ""}`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-[calc(100%-34px)] z-[3] flex size-[28px] -translate-y-1/2 items-center justify-center rounded-full transition-[left,box-shadow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/action:left-[6px] motion-reduce:transition-none min-[1200px]:size-[calc(29*var(--about-unit))] min-[1200px]:left-[calc(100%-35*var(--about-unit))] min-[1200px]:group-hover/action:left-[calc(6*var(--about-unit))] ${
          blue
            ? "bg-[linear-gradient(145deg,#075DFF_0%,#0348EA_48%,#0016AB_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_3px_8px_rgba(0,28,142,0.21)] group-hover/action:shadow-[0_0_14px_rgba(0,94,255,0.35),0_4px_11px_rgba(0,30,130,0.28)]"
            : "bg-[linear-gradient(145deg,#0067FF_0%,#0052F7_45%,#0016BC_100%)] shadow-[0_0_15px_rgba(0,94,255,0.47),0_3px_10px_rgba(0,36,160,0.23)] group-hover/action:shadow-[0_0_19px_rgba(0,94,255,0.55),0_5px_13px_rgba(0,36,160,0.27)]"
        }`}
      >
        {icon === "eye" ? (
          <FiEye
            size={19}
            strokeWidth={2.8}
            className="scale-[0.78] text-white opacity-0 transition-[opacity,transform] duration-[350ms] ease-out group-hover/action:scale-100 group-hover/action:opacity-100 motion-reduce:transition-none"
          />
        ) : (
          <FiArrowUpRight
            size={19}
            strokeWidth={3}
            className="scale-[0.78] text-white opacity-0 transition-[opacity,transform] duration-[350ms] ease-out group-hover/action:scale-100 group-hover/action:opacity-100 motion-reduce:transition-none"
          />
        )}
      </span>
    </Link>
  );
}
const introductionCards = [
  {
    title: (
      <>
        A Cycle on
        <br />
        the Line
        <br />
        Axis
      </>
    ),
    description:
      "We see the engineering that enables fluid motion not just as a job, but as a passionate journey.",
    icon: asset("icon1.png"),
  },
  {
    title: (
      <>
        Precision
        <br />& Trust
      </>
    ),
    description:
      "In the production of pumps that require high technology, we prioritize quality and innovation.",
    icon: asset("icon2.png"),
  },
  {
    title: (
      <>
        Network &<br />
        Culture
      </>
    ),
    description: "We grow and evolve together with our global partners.",
    icon: asset("icon3.png"),
  },
];
const scaleCards = [
  {
    value: "330",
    suffix: "+",
    label: (
      <>
        Employee
        <br />
        Recruitment
      </>
    ),
    description: "A strong workforce driving our manufacturing excellence.",
    action: "Join Our Team",
    href: "/career",
    Icon: LuHardHat,
    position: "min-[1200px]:left-[8.333%] min-[1200px]:top-[17%]",
  },
  {
    value: "100",
    suffix: "+",
    label: (
      <>
        Export
        <br />
        Country
      </>
    ),
    description:
      "Bringing Sempa reliability to more than 100 countries globally.",
    action: "Export Map",
    href: "#global-reach",
    Icon: LuGlobe,
    position: "min-[1200px]:right-[8.333%] min-[1200px]:top-[18%]",
  },
  {
    value: "132K",
    suffix: "",
    label: (
      <>
        Production
        <br />
        Facility
      </>
    ),
    description:
      "Advanced engineering powered by a massive scale of manufacturing.",
    action: "Factory Tour",
    href: "/media/video",
    Icon: LuFactory,
    position: "min-[1200px]:left-[16%] min-[1200px]:top-[62%]",
  },
  {
    value: "40",
    suffix: "+",
    label: (
      <>
        Pump
        <br />
        Series
      </>
    ),
    description: "Over 1,000 customizable industrial pump models.",
    action: "All Products",
    href: "/#products",
    Icon: LuLayers,
    position: "min-[1200px]:right-[13%] min-[1200px]:top-[53%]",
  },
];
const principles = [
  {
    title: "Engineering Mastery & Reliability",
    description:
      "Over half a century of deep engineering expertise ensuring uncompromising durability under extreme conditions.",
  },
  {
    title: "Green Pump & Energy Efficiency",
    description:
      "Developing eco-conscious solutions preserving planetary resources from initial design to end-of-life.",
  },
  {
    title: "Advanced R&D & Continuous Innovation",
    description:
      "Over 25 specialized engineers relentlessly redefining the frontiers of computational fluid mechanics.",
  },
  {
    title: "Customer Centricity & Tailored Engineering",
    description:
      "Engineering customized hydraulic solutions tailored to the unique fluid dynamics of each facility.",
  },
  {
    title: "Global Quality & Certifications",
    description:
      "Every manufacturing process verified by accredited international standards and certifications.",
  },
  {
    title: "Modular Service & Guaranteed Spares",
    description:
      "Protecting operational continuity with Back Pull-Out designs and a 25-year guaranteed spare parts availability.",
  },
];
function CompactStatistic({ year = false }: { year?: boolean }) {
  return (
    <div className="relative mx-auto flex w-fit max-w-full flex-col items-center pt-3">
      <div
        className={`absolute -top-1 z-10 -translate-x-1/2 whitespace-nowrap ${year ? "left-[calc(50%+10px)]" : "left-[calc(50%+56px)]"}`}
      >
        <ActionLink
          frosted
          href={year ? "#our-story" : "/#products"}
          icon={year ? "eye" : "arrow"}
        >
          {year ? "View History" : "View All Categories"}
        </ActionLink>
      </div>
      <p className="m-0 text-[clamp(76px,20vw,110px)] leading-none tracking-[-0.04em] text-[#4687B8] [font-variation-settings:'wght'_760,'wdth'_132]">
        {year ? "1972" : "40"}
      </p>
      <p className="mt-1 mb-0 text-[9px] leading-tight tracking-[-0.04em]">
        {year ? "YEAR OF COMPANY REGISTRATION" : "PUMP PRODUCT SERIES"}
      </p>
    </div>
  );
}
export default function AboutUsPage() {
  const reduced = useReducedMotion() ?? false;
  return (
    <main
      data-header-underlay
      style={aboutPageBackground}
      className="-mt-[var(--site-header-height,97px)] relative isolate w-full overflow-x-clip text-[#27272A] before:pointer-events-none before:absolute before:inset-x-0 before:-top-[200px] before:-z-10 before:h-[200px] before:bg-[#202747] before:content-[''] [--about-unit:1px] min-[1200px]:[--about-unit:clamp(0.833333px,0.0694444444vw,1.777778px)] [font-family:var(--font-sf-pro),_sans-serif]! [font-weight:410]! [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none]"
    >
      <section
        aria-labelledby="about-hero-title"
        className="box-content! relative h-[max(760px,100svh)] bg-[#202747] pt-[var(--site-header-height,97px)] text-[#F7F7F7] min-[1200px]:h-[max(660px,100svh)]"
      >
        <Image
          src={asset("HAKKIMIZDA HERO.png")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover object-[65%_top] min-[1200px]:object-top"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#141A39]/35 to-transparent min-[1200px]:hidden"
        />
        <div
          className={`${frame} relative flex h-full flex-col pb-[214px] pt-7 min-[1200px]:pb-[calc(242*var(--about-unit))] min-[1200px]:pt-[calc(55*var(--about-unit))]`}
        >
          <motion.nav
            {...heroEnter(reduced, 0.05, 10)}
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-[10px] text-white/65 min-[1200px]:mb-[calc(20*var(--about-unit))] min-[1200px]:text-[calc(12*var(--about-unit))]"
          >
            <Link
              href="/"
              className="relative inline-block pb-0.5 transition-colors duration-300 hover:text-white focus-visible:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100"
            >
              Home
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span>Corporate</span>
            <span aria-hidden="true">&gt;</span>
            <Link
              href="/about-us"
              aria-current="page"
              className="relative inline-block pb-0.5 transition-colors duration-300 hover:text-white focus-visible:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100"
            >
              About Us
            </Link>
          </motion.nav>
          <motion.h1
            id="about-hero-title"
            aria-label="Reliable Engineering Wherever Fluid Flows"
            variants={heroTitleVariants}
            initial={reduced ? false : "hidden"}
            animate="visible"
            className="m-0 max-w-full text-[clamp(34px,8.5vw,52px)] leading-[0.99] tracking-[-0.045em] min-[1200px]:max-w-[calc(790*var(--about-unit))] min-[1200px]:text-[calc(66*var(--about-unit))]"
          >
            <span aria-hidden="true">
              {heroTitleLines.map((line) => (
                <span
                  key={line}
                  className="-mb-[0.09em] block overflow-hidden pb-[0.09em]"
                >
                  <motion.span
                    variants={heroLineVariants}
                    className="block will-change-transform"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </span>
          </motion.h1>
          <motion.ul
            {...heroEnter(reduced, 0.88, 12)}
            aria-label="Our capabilities"
            className="mt-5 flex max-w-[600px] flex-wrap gap-2 p-0 text-[9px] leading-none min-[1200px]:mt-[calc(20*var(--about-unit))] min-[1200px]:max-w-none min-[1200px]:text-[calc(12*var(--about-unit))]"
          >
            {[
              "Precision Engineering",
              "In-House Foundry",
              "Advanced R&D",
              "Global Export",
            ].map((item) => (
              <li
                key={item}
                className="list-none rounded-lg border border-white/60 bg-white/15 px-2 py-1.5 shadow-[0_1px_6px_rgba(0,0,0,.06)] backdrop-blur-[14px]"
              >
                {item}
              </li>
            ))}
          </motion.ul>
          <motion.div
            {...heroEnter(reduced, 0.95, 12)}
            className="mt-6 ml-auto inline-flex w-fit max-w-full items-center gap-[9px] rounded-[10px] border border-white/25 bg-white/15 px-[10px] py-[6px] text-[11px] leading-[1.05] tracking-[-0.015em] text-[#F7F7F7] shadow-[0_3px_9px_rgba(0,0,0,0.07)] backdrop-blur-[8px] min-[1200px]:absolute min-[1200px]:top-[calc(60*var(--about-unit))] min-[1200px]:right-0 min-[1200px]:mt-0 min-[1200px]:gap-[calc(9*var(--about-unit))] min-[1200px]:rounded-[calc(10*var(--about-unit))] min-[1200px]:px-[calc(10*var(--about-unit))] min-[1200px]:py-[calc(6*var(--about-unit))] min-[1200px]:text-[calc(11*var(--about-unit))]"
          >
            <Image
              src="/about-us/sempa-icon.png"
              alt=""
              width={96}
              height={96}
              priority
              className="h-auto w-[36px] shrink-0 origin-center scale-[1.2] object-contain min-[1200px]:w-[calc(36*var(--about-unit))]"
            />
            <span className="block whitespace-nowrap">
              <span className="block">SINCE 1972 · 50+ YEARS OF</span>
              <span className="block">
                <strong className="font-semibold">ENGINEERING</strong> HERITAGE
              </span>
            </span>
          </motion.div>
          <div className="mt-auto flex min-w-0 items-end justify-between gap-4 min-[1200px]:gap-[calc(60*var(--about-unit))]">
            <motion.p
              {...heroEnter(reduced, 1.15, 22)}
              className="relative top-[5px] m-0 max-w-[46ch] min-w-0 text-[12px] font-[360] leading-[1.22] tracking-[-0.035em] [font-variation-settings:'wght'_360,'wdth'_132,'opsz'_28] min-[1200px]:top-[calc(4*var(--about-unit))] min-[1200px]:max-w-[calc(711*var(--about-unit))] min-[1200px]:text-[calc(15*var(--about-unit))]"
            >
              By managing every stage in-house—from CFD simulation and precision
              metallurgy in our foundry to CNC machining and accredited
              performance testing, we deliver ultra-efficient fluid technologies
              adhering to global standards.
            </motion.p>
            <motion.div
              {...heroEnter(reduced, 1.32, 16)}
              className="w-[72px] shrink-0 min-[768px]:w-[90px] min-[1200px]:w-[calc(102*var(--about-unit))]"
            >
              <Image
                src={asset("koordinat.webp")}
                alt="Konya, Türkiye. Since 1972."
                width={102}
                height={76}
                unoptimized
                className="h-auto w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section
        aria-label="Our engineering approach"
        className={`${frame} relative z-10 -mt-[180px] grid gap-4 min-[768px]:-mt-[150px] min-[900px]:grid-cols-3 min-[1200px]:-mt-[calc(120*var(--about-unit))] min-[1200px]:w-[calc(836*var(--about-unit))] min-[1200px]:gap-[calc(40*var(--about-unit))]`}
      >
        {introductionCards.map((card, index) => (
          <motion.article
            {...reveal(
              index === 0 ? "left" : index === 2 ? "right" : "up",
              index * 0.06,
              reduced,
            )}
            key={index}
            className={`rounded-[30px] px-6 py-7 max-[1199px]:mx-auto max-[1199px]:min-h-[326px] max-[1199px]:w-full max-[1199px]:max-w-[480px] shadow-[0_12px_32px_rgba(39,39,42,.05)] min-[1200px]:min-h-[calc(341*var(--about-unit))] min-[1200px]:px-[calc(20*var(--about-unit))] min-[1200px]:py-[calc(34*var(--about-unit))] ${index === 1 ? "bg-[#0D5792] text-[#F7F7F7]" : "bg-[#F7F7F7] text-[#0D5792]"}`}
          >
            <div
              aria-hidden="true"
              className="mb-5 flex size-[68px] shrink-0 items-center justify-center min-[1200px]:mb-[calc(20*var(--about-unit))] min-[1200px]:size-[calc(76*var(--about-unit))]"
            >
              <Image
                src={card.icon}
                alt=""
                width={512}
                height={512}
                unoptimized
                draggable={false}
                className="block h-full w-full object-contain object-center"
              />
            </div>
            <h2 className="m-0 text-[30px] leading-none tracking-[-0.04em] min-[900px]:max-[1199px]:text-[26px] min-[1200px]:text-[calc(36*var(--about-unit))]">
              {card.title}
            </h2>
            <p
              className={`mt-5 mb-0 text-[12px] leading-[1.12] tracking-[-0.04em] min-[1200px]:mt-[calc(24*var(--about-unit))] min-[1200px]:text-[calc(12*var(--about-unit))] ${index === 1 ? "text-[#F7F7F7]" : "text-[#27272A]"}`}
            >
              {card.description}
            </p>
          </motion.article>
        ))}
      </section>

      <section
        id="our-story"
        aria-labelledby="about-story-title"
        className="pt-24 min-[1200px]:pt-[calc(160*var(--about-unit))]"
      >
        <div
          className={`${frame} grid gap-6 min-[1200px]:grid-cols-[242fr_883fr] min-[1200px]:gap-[calc(75*var(--about-unit))]`}
        >
          <p className="m-0 hidden pt-1 text-[11px] text-[#005EFF] min-[1200px]:block min-[1200px]:text-[calc(15*var(--about-unit))]">
            ABOUT US
          </p>
          <div className="min-w-0">
            <ScrollColorStoryTitle />
            <div className="my-20 min-[1200px]:hidden">
              <CompactStatistic year />
            </div>
            <motion.div
              {...reveal("up", 0, reduced)}
              className={`${paragraph} mt-7 space-y-4 min-[1200px]:mt-[calc(45*var(--about-unit))]`}
            >
              <p className="m-0">
                As Turkey’s largest industrial pump manufacturer, Sempa operates
                in a modern 132,000 m² facility with over 300 employees. The R&D
                department, comprising more than 25 engineers, continuously
                develops the product range using the latest design technologies.
                Sempa delivers reliable solutions wherever there is fluid,
                ensuring its products operate safely for decades.
              </p>
              <p className="m-0">
                Sempa owns its foundry and performs all casting processes
                in-house with its specialized pump casting team using modern
                methods and machines. It also offers full support for its
                products, including service, repair, and modernization.
                Collaborating with Turkey’s leading science centers, Sempa
                continuously modernizes its efficient production infrastructure
                in Konya, ensuring it is fully prepared to manufacture and test
                pump prototypes. Sempa proudly exports its products to over 100
                countries worldwide.
              </p>
            </motion.div>
          </div>
        </div>
        <motion.div
          {...reveal("up", 0, reduced)}
          className={`${frame} mt-16 hidden gap-10 min-[768px]:grid-cols-2 min-[1200px]:grid min-[1200px]:mt-[calc(150*var(--about-unit))] min-[1200px]:w-[calc(950*var(--about-unit))] min-[1200px]:gap-[calc(120*var(--about-unit))]`}
        >
          {[
            {
              number: "1972",
              label: "YEAR OF COMPANY REGISTRATION",
              action: "View History",
              href: "#our-story",
            },
            {
              number: "40",
              label: "PUMP PRODUCT SERIES",
              action: "View All Categories",
              href: "/#products",
            },
          ].map((stat) => (
            <div key={stat.number} className="relative flex flex-col items-end">
              <p className="m-0 text-[clamp(72px,12vw,110px)] leading-none tracking-[-0.04em] text-[#4687B8] [font-variation-settings:'wght'_760,'wdth'_132] min-[1200px]:text-[calc(100*var(--about-unit))]">
                {stat.number}
              </p>
              <p className="mt-1 mb-0 text-[10px] leading-tight tracking-[-0.04em] min-[1200px]:text-[calc(12*var(--about-unit))]">
                {stat.label}
              </p>
              <div
                className={`absolute bottom-2 min-[1200px]:bottom-[calc(10*var(--about-unit))] ${stat.action === "View All Categories" ? "left-[70px] min-[1200px]:left-[calc(72*var(--about-unit))]" : "left-6 min-[1200px]:left-[calc(26*var(--about-unit))]"}`}
              >
                <ActionLink
                  frosted
                  href={stat.href}
                  icon={stat.action === "View History" ? "eye" : "arrow"}
                >
                  {stat.action}
                </ActionLink>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <motion.div
        {...reveal("up", 0, reduced)}
        className={`${frame} mt-20 min-[1200px]:hidden`}
      >
        <CompactStatistic />
      </motion.div>

      <ProductionGallery />

      <section
        id="global-reach"
        aria-labelledby="global-title"
        className={`${frame} mt-20 hidden gap-12 min-[1200px]:grid min-[1200px]:mt-[calc(180*var(--about-unit))] min-[1200px]:grid-cols-[561fr_640fr] min-[1200px]:gap-0`}
      >
        <motion.div
          {...reveal("left", 0, reduced)}
          className="relative min-h-[350px] min-[768px]:min-h-[440px] min-[1200px]:min-h-[calc(549*var(--about-unit))] min-[1200px]:border-r min-[1200px]:border-[#9EB7D0]"
        >
          <h2
            id="global-title"
            className="m-0 bg-linear-to-b from-[#005EFF] to-[#001EA2] bg-clip-text text-[28px] leading-none tracking-[-0.04em] text-transparent [font-variation-settings:'wght'_650,'wdth'_132] min-[1200px]:text-[calc(30*var(--about-unit))]"
          >
            Sempa Global
            <br />
            Powering the World
          </h2>
          <p className="absolute top-[28%] left-[22%] m-0 text-[clamp(70px,12vw,110px)] leading-none text-[#4687B8] [font-variation-settings:'wght'_270,'wdth'_132] min-[1200px]:text-[calc(100*var(--about-unit))]">
            100+
          </p>
          <div className="absolute top-[37%] left-[30%] h-[55%] w-[65%] max-w-[340px] overflow-hidden [mask-image:radial-gradient(circle_closest-side,black_82%,transparent_87%)] min-[1200px]:max-w-none">
            <AboutVideo
              desktopOnly
              src={globeVideo}
              className="h-full w-full object-cover"
              label="Rotating Earth — Sempa exports to more than 100 countries"
            />
          </div>
          <div
            className={`${glass} absolute bottom-[4%] left-0 z-10 w-[69%] rounded-[30px] p-5 min-[1200px]:w-[calc(331*var(--about-unit))] min-[1200px]:p-[calc(28*var(--about-unit))]`}
          >
            <h3 className="m-0 text-[23px] leading-none min-[1200px]:text-[calc(25*var(--about-unit))]">
              Export
              <br />
              Countries
            </h3>
            <p className="mt-2 mb-0 text-[12px] leading-none text-[#0D5792] min-[1200px]:text-[calc(12*var(--about-unit))]">
              Delivering fluid engineering excellence to industries worldwide.
            </p>
          </div>
        </motion.div>
        <motion.div
          {...reveal("right", 0.07, reduced)}
          className="relative min-h-[470px] min-[768px]:min-h-[540px] min-[1200px]:min-h-[calc(549*var(--about-unit))]"
        >
          <Image
            src={asset("forklift.webp")}
            alt="Forklift lifting a blue Sempa shipping container"
            fill
            sizes="(min-width:1200px) 38vw, 85vw"
            className="pointer-events-none object-contain object-top min-[1200px]:pl-[calc(90*var(--about-unit))]"
          />
          <div
            className={`${glass} absolute top-0 left-0 z-10 w-[55%] rounded-[30px] p-5 min-[1200px]:left-[calc(80*var(--about-unit))] min-[1200px]:w-[calc(255*var(--about-unit))] min-[1200px]:p-[calc(28*var(--about-unit))]`}
          >
            <h3 className="m-0 text-[23px] leading-none min-[1200px]:text-[calc(25*var(--about-unit))]">
              Export
              <br />
              Rate
            </h3>
            <p className="mt-3 mb-0 text-[12px] leading-none min-[1200px]:text-[calc(12*var(--about-unit))]">
              Powering industries worldwide.
            </p>
          </div>
          <p className="absolute top-[33%] right-0 m-0 text-[clamp(64px,12vw,110px)] leading-none text-[#4687B8] [font-variation-settings:'wght'_270,'wdth'_132] min-[1200px]:text-[calc(100*var(--about-unit))]">
            68%
          </p>
          <div
            className={`${glass} absolute right-0 bottom-0 w-[88%] rounded-[30px] p-6 min-[1200px]:w-[calc(390*var(--about-unit))] min-[1200px]:p-[calc(28*var(--about-unit))]`}
          >
            <h3 className="m-0 text-[25px] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(25*var(--about-unit))]">
              Join Sempa Global
            </h3>
            <p className="mt-3 mb-5 text-[12px] leading-none text-[#0D5792] min-[1200px]:text-[calc(12*var(--about-unit))]">
              Sempa, a manufacturer and investor of pump technologies, invites
              you to the world pump movement. Make your pre-application now.
            </p>
            <ActionLink href="/contact">Apply</ActionLink>
          </div>
        </motion.div>
      </section>

      <section
        aria-label="Sempa at a glance"
        className="mt-24 max-[1199px]:[&>div:first-child>p]:hidden min-[1200px]:mt-[calc(180*var(--about-unit))]"
      >
        <SectionHeading
          eyebrow="SEMPA AT A GLANCE"
          description="Half a century of engineering excellence delivering high capacity industrial pump solutions from Turkey to the world."
        >
          Manufacturing Scale &<br />
          Global Reach
        </SectionHeading>
        <div className="relative mt-8 min-[1200px]:mt-[calc(35*var(--about-unit))] min-[1200px]:h-[calc(720*var(--about-unit))]">
          <div className="pointer-events-none absolute inset-0 max-[1199px]:overflow-hidden [mask-image:linear-gradient(transparent,black_15%,black_80%,transparent)] max-[1199px]:opacity-80">
            <AboutVideo
              src={factoryVideo}
              className="h-full w-full object-contain max-[1199px]:scale-[1.5]"
              label="Sempa manufacturing plant overview"
            />
          </div>
          <div
            className={`${frame} relative grid gap-6 py-10 max-[1199px]:max-w-[640px] min-[1200px]:static min-[1200px]:block min-[1200px]:py-0`}
          >
            {scaleCards.map(
              (
                {
                  value,
                  suffix,
                  label,
                  description,
                  action,
                  href,
                  Icon,
                  position,
                },
                index,
              ) => (
                <motion.article
                  {...reveal(
                    index % 2 ? "right" : "left",
                    index * 0.05,
                    reduced,
                  )}
                  key={value}
                  className={`${glass} flex min-w-0 max-[1199px]:w-[90%] max-[1199px]:max-w-[440px] max-[1199px]:even:justify-self-end max-[1199px]:[&_a]:text-[11px] overflow-visible rounded-[30px] shadow-[0_8px_20px_rgba(39,39,42,.06)] min-[1200px]:absolute min-[1200px]:h-[calc(194*var(--about-unit))] min-[1200px]:w-[calc(433*var(--about-unit))] ${position}`}
                >
                  <div className="relative flex w-[39%] shrink-0 flex-col rounded-[30px] border border-[#005EFF]/50 bg-linear-to-br from-[#001EA2] to-[#005EFF] p-3 text-white shadow-[0_8px_20px_rgba(39,39,42,.12)] min-[1200px]:p-[calc(24*var(--about-unit))]">
                    <Icon
                      aria-hidden="true"
                      className="mb-4 size-5 min-[1200px]:mb-[calc(25*var(--about-unit))] min-[1200px]:size-[calc(29*var(--about-unit))]"
                    />
                    <p className="m-0 whitespace-nowrap text-[clamp(24px,4vw,40px)] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(45*var(--about-unit))]">
                      {value}
                      <span className="text-[.6em]">{suffix}</span>
                    </p>
                    <p className="mt-1 mb-0 text-[10px] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(13.5*var(--about-unit))]">
                      {label}
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4 p-3 min-[768px]:p-4 min-[1200px]:gap-[calc(20*var(--about-unit))] min-[1200px]:px-[calc(30*var(--about-unit))]">
                    <p className="m-0 text-[12px] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(15*var(--about-unit))]">
                      {description}
                    </p>
                    <ActionLink href={href} blue>
                      {action}
                    </ActionLink>
                  </div>
                </motion.article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        aria-label="Strategic direction"
        className="mt-20 max-[1199px]:[&>div:first-child>p]:hidden max-[1199px]:[&>div:first-child>div>p]:hidden min-[1200px]:mt-[calc(100*var(--about-unit))]"
      >
        <SectionHeading
          eyebrow="STRATEGIC DIRECTION"
          description="The core purpose and international objectives propelling SEMPA forward."
        >
          Our Mission & Vision
        </SectionHeading>
        <div className="mt-10 min-[1200px]:border-y min-[1200px]:border-[#9EB7D0]/65 min-[1200px]:mt-[calc(65*var(--about-unit))]">
          <div
            className={`${frame} grid gap-14 min-[768px]:grid-cols-2 min-[1200px]:gap-0 min-[1200px]:border-x min-[1200px]:border-[#9EB7D0]/65`}
          >
            {[
              {
                label: "OUR MISSION",
                image: "50 mission.gif",
                title: "Sustainable & Dependable Fluid Management",
                description:
                  "To engineer reliable pump systems that deliver premier energy efficiency, hydraulic performance, and operational endurance wherever fluid is present; and to generate sustainable value for industries and society by reducing energy consumption and carbon footprints through innovative engineering.",
              },
              {
                label: "OUR VISION",
                image: "vision.gif",
                title: "Global Leadership in Fluid Technologies",
                description:
                  "To stand as the preferred international benchmark in fluid transfer and water management—a pioneering Turkish engineering brand setting global standards through cutting-edge R&D, green pump principles, and digitalized integrated manufacturing.",
              },
            ].map((item, index) => (
              <motion.article
                {...reveal(index ? "right" : "left", index * 0.12, reduced)}
                key={item.label}
                className={`flex min-w-0 flex-col min-[1200px]:p-6 min-[1200px]:min-h-[calc(430*var(--about-unit))] min-[1200px]:px-[calc(65*var(--about-unit))] min-[1200px]:py-[calc(55*var(--about-unit))] ${index ? "min-[1200px]:border-l min-[1200px]:border-[#9EB7D0]/65" : ""}`}
              >
                <p className="m-0 flex items-center gap-2 text-[11px] leading-none text-[#0D5792] min-[1200px]:text-[calc(15*var(--about-unit))]">
                  <Image
                    src={asset(item.image)}
                    alt=""
                    width={26}
                    height={26}
                    unoptimized
                    className="size-7 rounded-md bg-[#005EFF] p-0.5 min-[1200px]:size-[calc(26*var(--about-unit))]"
                  />
                  {item.label}
                </p>
                <h3 className="mt-6 mb-0 text-[23px] leading-[1.12] tracking-[-0.04em] [font-variation-settings:'wght'_540,'wdth'_132] min-[1200px]:mt-[calc(30*var(--about-unit))] min-[1200px]:text-[calc(25*var(--about-unit))]">
                  {item.title}
                </h3>
                <p
                  className={`${paragraph} mt-5 min-[1200px]:mt-[calc(30*var(--about-unit))]`}
                >
                  {item.description}
                </p>
                <p className="mt-12 mb-0 hidden items-center gap-2 min-[1200px]:flex text-[18px] text-[#9EB7D0] min-[1200px]:mt-auto min-[1200px]:pt-[calc(60*var(--about-unit))] min-[1200px]:text-[calc(20*var(--about-unit))]">
                  <LuPlus aria-hidden="true" className="size-7 stroke-1" />0
                  {index + 1}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="Our corporate culture"
        className="relative pt-24 pb-20 min-[1200px]:pt-[calc(140*var(--about-unit))] min-[1200px]:pb-[calc(100*var(--about-unit))]"
      >
        <SectionHeading eyebrow="OUR CORPORATE CULTURE">
          6 foundational principles guiding our engineering decisions,{" "}
          <span className="text-[#0D5792]">
            client partnerships, and global standards.
          </span>
        </SectionHeading>
        <motion.div
          {...reveal("up", 0, reduced)}
          className="pointer-events-none relative mx-auto mt-8 -mb-20 h-[230px] w-full overflow-hidden min-[768px]:-mb-[120px] min-[768px]:h-[380px] min-[1200px]:-mb-[calc(275*var(--about-unit))] min-[1200px]:h-[calc(590*var(--about-unit))] min-[1200px]:w-[calc(952*var(--about-unit))]"
        >
          <AboutVideo
            src={cultureVideo}
            style={{
              WebkitMaskImage: cultureVideoMask,
              maskImage: cultureVideoMask,
            }}
            className="block h-full w-full object-cover mix-blend-multiply brightness-[1.12]"
            label="Sempa corporate culture and connected engineering"
          />
        </motion.div>
        <AboutCultureCards items={principles} />
      </section>
      <motion.div {...reveal("up", 0, reduced)} className={`${frame} pb-20`}>
        <NewsletterSubscription />
      </motion.div>
    </main>
  );
}

/** Desktop factory gallery: mouse drag, native touch scrolling and keyboard arrows. */
function ProductionGallery() {
  const reduced = useReducedMotion() ?? false;
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const element = event.currentTarget;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    };
    element.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.scrollLeft =
      drag.scrollLeft - (event.clientX - drag.startX);
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onGalleryKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.currentTarget.scrollBy({
      left: event.key === "ArrowRight" ? 260 : -260,
      behavior: "smooth",
    });
  }

  return (
    <motion.section
      {...reveal("up", 0, reduced)}
      aria-label="Sempa production facilities"
      tabIndex={0}
      className={`mt-16 hidden overflow-x-auto overscroll-x-contain pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[1200px]:block min-[1200px]:mt-[calc(90*var(--about-unit))] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => {
        dragRef.current = null;
        setIsDragging(false);
      }}
      onKeyDown={onGalleryKeyDown}
    >
      <div className="flex w-max gap-4 pl-[8.333333vw] pr-[8.333333vw] min-[1200px]:gap-[calc(16*var(--about-unit))]">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="relative h-[150px] w-[200px] shrink-0 overflow-hidden rounded-[24px] min-[1200px]:h-[calc(184*var(--about-unit))] min-[1200px]:w-[calc(245*var(--about-unit))] min-[1200px]:rounded-[calc(30*var(--about-unit))]"
          >
            <Image
              src={asset("image.webp")}
              alt={`Sempa solar-powered manufacturing facility${i ? ` — view ${i + 1}` : ""}`}
              fill
              draggable={false}
              sizes="(min-width:1200px) 18vw, 200px"
              className="pointer-events-none object-cover grayscale"
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

type AboutVideoProps = {
  src: string;
  className?: string;
  label?: string;
  style?: CSSProperties;
  desktopOnly?: boolean;
};
const subscribeDesktop = (callback: () => void) => {
  const query = matchMedia("(min-width: 1200px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const isDesktop = () => matchMedia("(min-width: 1200px)").matches;
const serverDesktop = () => false;
function DesktopVideo(props: AboutVideoProps) {
  const enabled = useSyncExternalStore(
    subscribeDesktop,
    isDesktop,
    serverDesktop,
  );
  return enabled ? <ViewportVideo {...props} /> : null;
}
function AboutVideo(props: AboutVideoProps) {
  return props.desktopOnly ? (
    <DesktopVideo {...props} />
  ) : (
    <ViewportVideo {...props} />
  );
}
function ViewportVideo({ src, className = "", label, style }: AboutVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useViewportVideo(ref);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      controls={false}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={style}
    >
      <source
        src={src}
        type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
      />
    </video>
  );
}
type Principle = {
  title: string;
  description: string;
};
function AboutCultureCards({ items }: { items: Principle[] }) {
  const reduced = useReducedMotion() ?? false;
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    scroll: number;
  } | null>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useRef(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 1199px)");
    reducedMotion.current = preference.matches;
    const onPreference = () => {
      reducedMotion.current = preference.matches;
    };
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!compact.matches) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let distance = Infinity;
        Array.from(track.children).forEach((child, index) => {
          const card = child as HTMLElement;
          const next = Math.abs(
            card.offsetLeft + card.offsetWidth / 2 - center,
          );
          if (next < distance) {
            distance = next;
            closest = index;
          }
        });
        setActive(closest);
      });
    };
    const resize = new ResizeObserver(() => {
      if (!compact.matches) {
        track.scrollLeft = 0;
        return;
      }
      const index = Number(track.dataset.active || 0);
      const card = track.children[index] as HTMLElement | undefined;
      if (card)
        track.scrollLeft =
          card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
      update();
    });
    resize.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    preference.addEventListener("change", onPreference);
    update();
    return () => {
      resize.disconnect();
      track.removeEventListener("scroll", update);
      preference.removeEventListener("change", onPreference);
      cancelAnimationFrame(frame);
    };
  }, []);
  function goTo(index: number) {
    const track = trackRef.current;
    const next = Math.max(0, Math.min(items.length - 1, index));
    const card = track?.children[next] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: reducedMotion.current ? "instant" : "smooth",
    });
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!matchMedia("(max-width: 1199px)").matches) return;
    const next =
      event.key === "ArrowRight"
        ? active + 1
        : event.key === "ArrowLeft"
          ? active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    goTo(next);
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      !matchMedia("(max-width: 1199px)").matches
    )
      return;
    drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.scrollSnapType = "none";
  }
  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = null;
    event.currentTarget.style.removeProperty("scroll-snap-type");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const center =
      event.currentTarget.scrollLeft + event.currentTarget.clientWidth / 2;
    const children = Array.from(event.currentTarget.children) as HTMLElement[];
    const closest = children.reduce(
      (best, card, index) =>
        Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) <
        Math.abs(
          children[best].offsetLeft + children[best].offsetWidth / 2 - center,
        )
          ? index
          : best,
      0,
    );
    goTo(closest);
  }
  return (
    <>
      <div
        ref={trackRef}
        id={trackId}
        role="region"
        aria-label="Corporate culture principles"
        tabIndex={0}
        data-active={active}
        onKeyDown={onKeyDown}
        onPointerDown={startDrag}
        onPointerMove={(event) => {
          if (drag.current)
            event.currentTarget.scrollLeft =
              drag.current.scroll - (event.clientX - drag.current.x);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mx-auto flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[calc((100%-var(--culture-slide-width))/2)] [--culture-slide-width:min(83.333333vw,560px)] [scroll-padding-inline:calc((100%-var(--culture-slide-width))/2)] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#005EFF] [&::-webkit-scrollbar]:hidden max-[1199px]:cursor-grab max-[1199px]:active:cursor-grabbing max-[1199px]:select-none min-[1200px]:grid min-[1200px]:w-[calc(1050*var(--about-unit))] min-[1200px]:grid-cols-3 min-[1200px]:gap-[calc(28*var(--about-unit))] min-[1200px]:overflow-visible min-[1200px]:p-0"
      >
        {items.map((item, index) => (
          <motion.article
            key={item.title}
            aria-label={`${index + 1} / ${items.length}: ${item.title}`}
            initial={{ opacity: reduced ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={localViewport}
            transition={{
              duration: reduced ? 0 : 0.95,
              ease: [0.25, 0.85, 0.3, 1] as [number, number, number, number],
            }}
            className="group/culture relative flex min-h-[330px] min-w-0 shrink-0 basis-[var(--culture-slide-width)] snap-center flex-col gap-10 rounded-[15px] border border-white/50 bg-white/35 p-[30px] shadow-[0_5px_18px_rgba(31,79,136,0.015)] backdrop-blur-[25px] transition-[transform,background-color,border-color,box-shadow] duration-[1300ms] ease-[cubic-bezier(0.45,0,0.3,1)] hover:-translate-y-[4px] hover:border-white/75 hover:bg-white/45 hover:shadow-[0_16px_36px_rgba(31,79,136,0.085)] motion-reduce:transform-none motion-reduce:transition-none min-[768px]:min-h-[360px] min-[1200px]:min-h-[calc(294*var(--about-unit))] min-[1200px]:gap-[calc(38*var(--about-unit))] min-[1200px]:bg-white/20 min-[1200px]:hover:bg-white/30 min-[1200px]:p-[calc(30*var(--about-unit))]"
          >
            <p className="m-0 text-[32px] leading-none text-[#9EB7D0] transition-colors duration-[1300ms] ease-[cubic-bezier(0.45,0,0.3,1)] group-hover/culture:text-[#79A2CA] motion-reduce:transition-none min-[1200px]:text-[calc(36*var(--about-unit))]">
              0{index + 1}
            </p>
            <h3 className="m-0 max-w-[22ch] text-[20px] leading-[1.07] tracking-[-0.04em] min-[1200px]:text-[calc(20*var(--about-unit))]">
              {item.title}
            </h3>
            <p className="m-0 max-w-[28ch] text-[12px] leading-[1.12] tracking-[-0.04em] text-[#9EB7D0] min-[1200px]:text-[calc(12*var(--about-unit))]">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>
      <div
        aria-label="Select a culture principle"
        className="mt-5 flex justify-center min-[1200px]:hidden"
      >
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Show principle ${index + 1}: ${item.title}`}
            aria-controls={trackId}
            aria-pressed={active === index}
            onClick={() => goTo(index)}
            className="flex min-h-8 min-w-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#005EFF]"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${active === index ? "w-7 bg-[#9EB7D0]" : "w-2 bg-[#CFDCE6]"}`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
