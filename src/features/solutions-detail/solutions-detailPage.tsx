"use client";
import Image from "next/image";
import SendButton from "@/components/ui/SendButton";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
} from "react";
import {
  FiArrowDownRight,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiImage,
  FiUpload,
  FiX,
} from "react-icons/fi";

type RevealDirection = "up" | "left" | "right";
const revealEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
function reveal(
  direction: RevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.17,
) {
  return {
    initial: reduced
      ? (false as const)
      : {
          opacity: 0,
          x: direction === "left" ? -34 : direction === "right" ? 34 : 0,
          y: direction === "up" ? 34 : 0,
          filter: "blur(5px)",
        },
    whileInView: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.92,
      delay: reduced ? 0 : delay,
      ease: revealEase,
    },
  };
}
function heroEnter(reduced: boolean, delay = 0, y = 24) {
  return {
    initial: reduced
      ? (false as const)
      : { opacity: 0, y, filter: "blur(7px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 1.02,
      delay: reduced ? 0 : delay,
      ease: revealEase,
    },
  };
}
const INDUSTRY_HERO_IMAGE = "/solutions-detail/solutions-detail%20hero.webp";

type IndustryHotspotData = {
  id: string;
  title: string;
  x: number;
  y: number;
  products: {
    id: string;
    image: string | null;
    alt: string;
    name: string;
  }[];
};
const wastewaterProducts: IndustryHotspotData["products"] = [
  {
    id: "pump-one",
    image: "/solutions-detail/02.webp",
    alt: "DPT pump",
    name: "DPT",
  },
  {
    id: "pump-two",
    image: "/solutions-detail/03.png",
    alt: "Blue centrifugal DPT-DI pump",
    name: "DPT-DI",
  },
];
// Coordinates refer to the original 1376 × 768 illustration, not its container.
const industryHotspots: IndustryHotspotData[] = [
  {
    id: "wastewater-left",
    title: "Wastewater Management",
    x: 19.5,
    y: 50.9,
    products: wastewaterProducts,
  },
  {
    id: "wastewater-center",
    title: "Wastewater Management",
    x: 35.5,
    y: 48.1,
    products: wastewaterProducts,
  },
  {
    id: "wastewater-top",
    title: "Wastewater Management",
    x: 51,
    y: 21.7,
    products: wastewaterProducts,
  },
  {
    id: "wastewater-right",
    title: "Wastewater Management",
    x: 64.2,
    y: 38.3,
    products: wastewaterProducts,
  },
];
export type IndustryItem = {
  id: string;
  title: string;
  description: string;
  activeTitleLines?: string[];
};
const industryItems: IndustryItem[] = [
  {
    id: "industrial",
    title: "Specialized Industrial Processes",
    description:
      "Uninterrupted fluid transfer for heavy industry and demanding production processes. We provide engineering solutions that ensure maximum stability in specific operations requiring high pressure and temperature.",
  },
  {
    id: "chemical",
    title: "Chemical and Petrochemical Applications",
    description:
      "Superior sealing technology for the transfer of corrosive and aggressive fluids. We maximize your facility's safety and system lifespan using advanced alloy materials.",
  },
  {
    id: "facility",
    title: "Heavy Duty and Facility Solutions",
    activeTitleLines: ["Heavy", "Duty", "and", "Facility", "Solutions"],
    description:
      "Extra wear-resistant structural equipment built for 24/7 continuous operation. We ensure seamless integration with the complex flow and pressure requirements of your industrial infrastructure.",
  },
  {
    id: "engineering",
    title: "Custom Engineering and Integration",
    description:
      "Tailored hydraulic designs for niche sectors where standard production molds fall short. We build compact, highly energy-efficient systems focused entirely on the unique needs of your facility.",
  },
  {
    id: "hygiene",
    title: "Food, Beverage, and Pharmaceutical Industries",
    description:
      "Specialized surface designs for sensitive processes where hygiene standards are paramount. We provide reliable, stainless steel solutions for sterile fluid transfer in full compliance with international health norms.",
  },
];
export function getIndustryVisibleIndices(
  activeIndex: number,
  total: number,
  visibleCount: number,
) {
  if (!total) return [];
  const count = Math.min(visibleCount, total);
  const anchor = Math.min(2, Math.floor(visibleCount / 2));
  return Array.from(
    { length: count },
    (_, slot) => (((activeIndex - anchor + slot) % total) + total) % total,
  );
}
function getIndustryRotation(current: number, target: number, total: number) {
  const forward = (((target - current) % total) + total) % total;
  return forward > total / 2 ? forward - total : forward;
}
function IndustryHotspot({
  hotspot,
  active,
  onSelect,
  delay,
}: {
  hotspot: IndustryHotspotData;
  active: boolean;
  onSelect: () => void;
  delay: number;
}) {
  return (
    <button
      type="button"
      id={`industry-hotspot-${hotspot.id}`}
      className="industry-hotspot [.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[z-index:1] [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[transform:translate(-50%,_-50%)] [.solutions-detail-page_&]:[width:max(36px,_calc(64_*_var(--industry-unit)))] [.solutions-detail-page_&]:[height:max(36px,_calc(64_*_var(--industry-unit)))] [.solutions-detail-page_&]:[border:0] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[background:transparent] [.solutions-detail-page_&]:[box-shadow:0_4px_24px_#005eff26] [.solutions-detail-page_&]:[cursor:pointer] [.solutions-detail-page_&::before]:[content:''] [.solutions-detail-page_&::before]:[position:absolute] [.solutions-detail-page_&::before]:[top:0] [.solutions-detail-page_&::before]:[right:0] [.solutions-detail-page_&::before]:[bottom:0] [.solutions-detail-page_&::before]:[left:0] [.solutions-detail-page_&::before]:[border:1px_solid_#005eff99] [.solutions-detail-page_&::before]:[border-radius:inherit] [.solutions-detail-page_&::before]:[pointer-events:none] [.solutions-detail-page_&::before]:[opacity:0] [.solutions-detail-page_&::before]:animate-migrated-c542d7896 [.solutions-detail-page_&::after]:[content:''] [.solutions-detail-page_&::after]:[position:absolute] [.solutions-detail-page_&::after]:[top:0] [.solutions-detail-page_&::after]:[right:0] [.solutions-detail-page_&::after]:[bottom:0] [.solutions-detail-page_&::after]:[left:0] [.solutions-detail-page_&::after]:[border:1px_solid_#005eff99] [.solutions-detail-page_&::after]:[border-radius:inherit] [.solutions-detail-page_&::after]:[pointer-events:none] [.solutions-detail-page_&::after]:[opacity:0] [.solutions-detail-page_&::after]:animate-migrated-c542d7896 [.solutions-detail-page_&::before]:[animation-delay:calc(-1_*_var(--hotspot-delay))] [.solutions-detail-page_&::after]:[animation-delay:calc(0.65s_-_var(--hotspot-delay))] [.solutions-detail-page_&:is(:hover,_:focus)]:[z-index:2] max-md:[.solutions-detail-page_&]:[width:clamp(22px,_6vw,_36px)] max-md:[.solutions-detail-page_&]:[height:clamp(22px,_6vw,_36px)] motion-reduce:[.solutions-detail-page_&::before]:[animation:none] motion-reduce:[.solutions-detail-page_&::before]:[opacity:0] motion-reduce:[.solutions-detail-page_&::after]:[animation:none] motion-reduce:[.solutions-detail-page_&::after]:[opacity:0]"
      style={
        {
          left: `${hotspot.x}%`,
          top: `${hotspot.y}%`,
          "--hotspot-delay": `${delay}s`,
        } as CSSProperties
      }
      aria-label={`Explore ${hotspot.title}`}
      aria-expanded={active}
      aria-controls={active ? "industry-popup" : undefined}
      onClick={onSelect}
    >
      <span
        className="industry-hotspot-core [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[z-index:1] [.solutions-detail-page_&]:[display:block]! [.solutions-detail-page_&]:[width:62%] [.solutions-detail-page_&]:[height:62%] [.solutions-detail-page_&]:[border:2px_solid_#d9e8ff] [.solutions-detail-page_&]:[outline:1px_solid_#005eff] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[background:linear-gradient(180deg,_#0065ff,_#002399)] [.solutions-detail-page_&]:[box-shadow:0_0_0_4px_#b9ddff66,_0_0_0_7px_#f5faff80,_0_0_0_8px_#005eff40] max-md:[.solutions-detail-page_&]:[border-width:1px] max-md:[.solutions-detail-page_&]:[box-shadow:0_0_0_2px_#b9ddff66,_0_0_0_4px_#f5faff80,_0_0_0_5px_#005eff40]"
        aria-hidden="true"
      />
      <span
        className="industry-hotspot-tooltip [.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[bottom:calc(100%_+_12px)] [.solutions-detail-page_&]:[left:50%] [.solutions-detail-page_&]:[transform:translate(-50%,_5px)] [.solutions-detail-page_&]:[width:max-content] [.solutions-detail-page_&]:[max-width:220px] [.solutions-detail-page_&]:[padding-top:9px] [.solutions-detail-page_&]:[padding-right:14px] [.solutions-detail-page_&]:[padding-bottom:9px] [.solutions-detail-page_&]:[padding-left:14px] [.solutions-detail-page_&]:[border:0.5px_solid_#ffffffb3] [.solutions-detail-page_&]:[border-radius:10px] [.solutions-detail-page_&]:[background:#f7fbfff2] [.solutions-detail-page_&]:[box-shadow:0_4px_18px_#0d579222] [.solutions-detail-page_&]:[color:#0d5792]! [.solutions-detail-page_&]:[font-size:clamp(11px,_0.95vw,_18px)]! [.solutions-detail-page_&]:[line-height:1.15]! [.solutions-detail-page_&]:[opacity:0] [.solutions-detail-page_&]:[visibility:hidden] [.solutions-detail-page_&]:[pointer-events:none] [.solutions-detail-page_&]:[transition:opacity_180ms_ease,_transform_180ms_ease] [.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[opacity:1] [.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[visibility:visible] [.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[transform:translate(-50%,_0)]"
        aria-hidden="true"
      >
        {hotspot.title}
      </span>
    </button>
  );
}
function IndustryPopup({
  hotspot,
  onClose,
}: {
  hotspot: IndustryHotspotData;
  onClose: () => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const popup = popupRef.current;
    const illustration = popup?.parentElement;
    if (!popup || !illustration) return;
    const position = () => {
      const bounds = illustration.getBoundingClientRect();
      if (window.innerWidth < 768) {
        popup.style.position = "relative";
        popup.style.width = "min(490px, 100%)";
        popup.style.left = "0px";
        popup.style.top = "0px";
        return;
      }
      popup.style.position = "absolute";
      popup.style.width = `${Math.min(490, bounds.width * 0.46)}px`;
      const anchorX = (bounds.width * hotspot.x) / 100;
      const anchorY = (bounds.height * hotspot.y) / 100;
      const width = popup.offsetWidth,
        height = popup.offsetHeight;
      const preferred =
        anchorX + width + 28 <= bounds.width
          ? anchorX + 28
          : anchorX - width - 28;
      popup.style.left = `${Math.max(12, Math.min(bounds.width - width - 12, preferred))}px`;
      popup.style.top = `${Math.max(0, Math.min(bounds.height - height, anchorY - 80))}px`;
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(illustration);
    observer.observe(popup);
    return () => observer.disconnect();
  }, [hotspot.x, hotspot.y]);
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const pointerdown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (
        !popupRef.current?.contains(event.target) &&
        !event.target.closest(".industry-hotspot")
      )
        onClose();
    };
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", pointerdown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", pointerdown);
    };
  }, [onClose]);
  return (
    <div
      ref={popupRef}
      id="industry-popup"
      role="dialog"
      aria-modal="false"
      aria-labelledby="industry-popup-title"
      className="industry-popup z-[60] mx-auto flex flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_30px_90px_rgba(13,40,77,0.19)] max-md:mt-4 max-md:rounded-[22px] motion-safe:animate-[industry-panel-in_350ms_ease-out]"
    >
      <div
        className="relative flex h-[143px] shrink-0 items-center gap-7 overflow-hidden px-[37px] max-lg:h-[115px] max-lg:gap-4 max-lg:px-5"
        style={{
          background:
            "radial-gradient(ellipse at 24% -30%,rgba(255,255,255,.84),transparent 63%),linear-gradient(115deg,rgba(184,204,227,.84),rgba(204,221,239,.66) 47%,rgba(162,197,231,.73))",
          backdropFilter: "blur(34px) saturate(170%)",
          boxShadow: "inset 0 1px 0 #ffffffdb,inset 0 -1px 0 #ffffff45",
        }}
      >
        <div className="relative size-[67px] shrink-0 max-lg:size-12">
          <Image
            src="/solutions-detail/atik-su.gif"
            alt=""
            fill
            unoptimized
            sizes="67px"
            className="object-contain"
          />
        </div>
        <h3
          id="industry-popup-title"
          className="relative m-0 text-[34px] leading-[1.03] tracking-[-.025em] text-white max-lg:text-[27px]"
          style={{
            fontWeight: 290,
            fontVariationSettings: '"wght" 290',
            fontSynthesis: "none",
          }}
        >
          Wastewater
          <br />
          Management
        </h3>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close industry details"
          onClick={onClose}
          className="absolute right-[25px] top-[25px] z-10 flex size-8 cursor-pointer items-center justify-center text-black transition-transform hover:scale-110 max-md:right-4 max-md:top-4"
        >
          <FiX className="size-[30px]" aria-hidden="true" />
        </button>
      </div>
      <div className="grid h-[334px] grid-cols-2 max-md:h-[280px]">
        {hotspot.products.map((product) => (
          <div
            key={product.id}
            className="group relative min-w-0 overflow-hidden border-r border-[#e8eff5] bg-white last:border-r-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#005eff]"
            tabIndex={0}
            aria-label={product.name}
          >
            {product.image && (
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(max-width:768px) 45vw,245px"
                className="object-contain p-[14px] transition-transform duration-500 group-hover:scale-[1.04] group-focus:scale-[1.04] motion-reduce:transition-none"
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[43%] translate-y-4 items-center justify-center bg-[linear-gradient(180deg,rgba(217,230,241,.46),rgba(107,128,148,.52))] opacity-0 backdrop-blur-[22px] backdrop-saturate-150 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 motion-reduce:transition-none">
              <span className="text-[42px] font-normal tracking-[-.04em] text-white drop-shadow-[0_2px_12px_rgba(31,45,67,.2)] max-md:text-[34px]">
                {product.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes industry-panel-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
function SolutionDetailsHero() {
  const reduced = useReducedMotion() ?? false;
  const flowTitle = useRepeatingTitle(2700);
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const [activeHotspot, setActiveHotspot] =
    useState<IndustryHotspotData | null>(null);
  const closePopup = useCallback(() => {
    const id = activeHotspot?.id;
    setActiveHotspot(null);
    if (id)
      document
        .getElementById(`industry-hotspot-${id}`)
        ?.focus({ preventScroll: true });
  }, [activeHotspot?.id]);
  return (
    <section
      className="industry-hero [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[isolation:isolate] [.solutions-detail-page_&]:[padding-top:calc(80_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:24px] [.solutions-detail-page_&::before]:[content:''] [.solutions-detail-page_&::before]:[position:absolute] [.solutions-detail-page_&::before]:[top:0] [.solutions-detail-page_&::before]:[right:0] [.solutions-detail-page_&::before]:[bottom:0] [.solutions-detail-page_&::before]:[left:0] [.solutions-detail-page_&::before]:[z-index:-1] [.solutions-detail-page_&::before]:[pointer-events:none] [.solutions-detail-page_&::before]:[background:radial-gradient(ellipse_at_50%_65%,_#f0f3f7_0%,_#fafbfc_45%,_#fff_75%)] [.solutions-detail-page_&::before]:[mask-image:linear-gradient(to_bottom,_#000_0%,_#000_68%,_#000000e6_78%,_#00000066_90%,_transparent_100%)] max-md:[.solutions-detail-page_&]:[padding-top:52px] max-md:[.solutions-detail-page_&]:[padding-right:20px] max-md:[.solutions-detail-page_&]:[padding-bottom:0] max-md:[.solutions-detail-page_&]:[padding-left:20px]"
      aria-labelledby="industry-page-title"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <motion.div
        {...heroEnter(reduced, 0.1)}
        className="industry-hero-heading [.solutions-detail-page_&]:[text-align:center] [.solutions-detail-page_&_h1]:[margin-top:0] [.solutions-detail-page_&_h1]:[margin-right:0] [.solutions-detail-page_&_h1]:[margin-bottom:0] [.solutions-detail-page_&_h1]:[margin-left:0] [.solutions-detail-page_&_h1]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h1]:[font-weight:410]! [.solutions-detail-page_&_h1]:[line-height:1]! [.solutions-detail-page_&_h1]:[color:#0d5792]! [.solutions-detail-page_&_>_p]:[width:calc(690_*_var(--industry-unit))] [.solutions-detail-page_&_>_p]:[max-width:100%] [.solutions-detail-page_&_>_p]:[margin-top:calc(36_*_var(--industry-unit))] [.solutions-detail-page_&_>_p]:[margin-right:auto] [.solutions-detail-page_&_>_p]:[margin-bottom:0] [.solutions-detail-page_&_>_p]:[margin-left:auto] [.solutions-detail-page_&_>_p]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_>_p]:[line-height:1]! [.solutions-detail-page_&_>_p]:[color:#27272a]! max-xl:[.solutions-detail-page_&_h1]:[font-size:clamp(30px,_4.1vw,_50px)]! max-xl:[.solutions-detail-page_&_>_p]:[line-height:1.2]! max-md:[.solutions-detail-page_&_h1]:[font-size:clamp(27px,_7.5vw,_40px)]! max-md:[.solutions-detail-page_&_h1]:[line-height:1.1]!"
      >
        <h1
          ref={flowTitle}
          id="industry-page-title"
          aria-label="Specialized Areas (Industry)"
          className="relative inline-block max-w-full"
        >
          <span aria-hidden="true">
            {["Specialized", "Areas", "(Industry)"].map((word, wordIndex) => (
              <span key={word} className="inline-block whitespace-nowrap">
                {Array.from(word, (letter, index) => (
                  <span
                    key={index}
                    className="industry-flow-letter inline-block"
                    style={
                      {
                        "--flow-delay": `${wordIndex * 340 + index * 32}ms`,
                      } as CSSProperties
                    }
                  >
                    {letter}
                  </span>
                ))}
                {wordIndex < 2 ? "\u00a0" : ""}
              </span>
            ))}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 600 90"
            preserveAspectRatio="none"
            fill="none"
            className="industry-title-pipe pointer-events-none absolute -inset-x-4 -top-2 h-[calc(100%+16px)] w-[calc(100%+32px)] opacity-0"
          >
            <path
              d="M0 75H105Q120 75 120 60V35Q120 20 135 20H295Q310 20 310 35V60Q310 75 325 75H465Q480 75 480 60V35Q480 20 495 20H600"
              stroke="#68b6e0"
              strokeWidth=".7"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="industry-title-pressure"
              pathLength="100"
              d="M0 75H105Q120 75 120 60V35Q120 20 135 20H295Q310 20 310 35V60Q310 75 325 75H465Q480 75 480 60V35Q480 20 495 20H600"
              stroke="#008cff"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </h1>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            #industry-page-title[data-title-revealing] .industry-flow-letter { animation: industry-flow-form 950ms cubic-bezier(.2,.7,.25,1) var(--flow-delay) both; }
            #industry-page-title[data-title-revealing] .industry-title-pipe { animation: industry-pipe-glow 2500ms ease both; }
            #industry-page-title[data-title-revealing] .industry-title-pressure { stroke-dasharray: 14 86; animation: industry-pressure-run 2200ms cubic-bezier(.3,.1,.3,1) both; }
          }
          @keyframes industry-flow-form {
            0% { opacity: 0; transform: translate(-7px,7px) rotateX(65deg); color: #5cb8db; clip-path: inset(0 100% 0 0); }
            45% { opacity: 1; color: #258fcb; clip-path: inset(0 0 0 0); }
            100% { opacity: 1; transform: translate(0,0) rotateX(0); color: #0d5792; clip-path: inset(0 0 0 0); }
          }
          @keyframes industry-pipe-glow { 0%,100% { opacity: 0; } 20%,65% { opacity: .6; } }
          @keyframes industry-pressure-run { from { stroke-dashoffset: 14; } to { stroke-dashoffset: -100; } }
        `}</style>
        <p>
          We offer advanced water management solutions for industries and
          specific applications, including mining, Oil &amp; Gas, fish farming,
          steel production, artificial snowmaking, and various industrial
          sectors.
        </p>
      </motion.div>
      <motion.div
        {...heroEnter(reduced, 0.43, 30)}
        className="industry-illustration [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1440_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-top:calc(40_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:auto]"
      >
        <div className="industry-artwork [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[aspect-ratio:1376_/_768] [.solutions-detail-page_&::before]:[content:''] [.solutions-detail-page_&::before]:[position:absolute] [.solutions-detail-page_&::before]:[top:0] [.solutions-detail-page_&::before]:[right:0] [.solutions-detail-page_&::before]:[bottom:0] [.solutions-detail-page_&::before]:[left:0] [.solutions-detail-page_&::before]:[background:radial-gradient(ellipse_at_50%_52%,_#e6f1fa35,_transparent_72%)] [.solutions-detail-page_&::before]:[pointer-events:none]">
          {!imageUnavailable ? (
            <Image
              src={INDUSTRY_HERO_IMAGE}
              alt="Isometric industrial facility and pumping infrastructure"
              fill
              sizes="100vw"
              preload
              unoptimized
              className="industry-hero-image [.solutions-detail-page_&]:[object-fit:contain] [.solutions-detail-page_&]:[mask-image:radial-gradient(ellipse_75%_150%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%),_radial-gradient(ellipse_150%_75%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%)] [.solutions-detail-page_&]:[mask-composite:intersect] [.solutions-detail-page_&]:[-webkit-mask-image:radial-gradient(ellipse_75%_150%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%),_radial-gradient(ellipse_150%_75%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%)] [.solutions-detail-page_&]:[-webkit-mask-composite:source-in]"
              onError={() => setImageUnavailable(true)}
            />
          ) : (
            <div className="industry-illustration-placeholder [.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[top:0] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:0] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[flex-direction:column] [.solutions-detail-page_&]:[justify-content:center] [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:16px] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[background:radial-gradient(ellipse,_#e8f4fb88,_transparent_70%)] [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&_svg]:[width:42px] [.solutions-detail-page_&_svg]:[height:42px] max-md:[.solutions-detail-page_&_span]:[max-width:80%] max-md:[.solutions-detail-page_&_span]:[text-align:center]">
              <FiImage aria-hidden="true" />
              <span>Industrial facility illustration pending</span>
            </div>
          )}
          {industryHotspots.map((hotspot, index) => (
            <IndustryHotspot
              key={hotspot.id}
              hotspot={hotspot}
              active={activeHotspot?.id === hotspot.id}
              delay={index * 0.3}
              onSelect={() =>
                setActiveHotspot((current) =>
                  current?.id === hotspot.id ? null : hotspot,
                )
              }
            />
          ))}
        </div>
        {activeHotspot && (
          <IndustryPopup
            key={activeHotspot.id}
            hotspot={activeHotspot}
            onClose={closePopup}
          />
        )}
      </motion.div>
    </section>
  );
}
function IndustryCarouselItem({
  item,
  active,
  visible,
  onSelect,
  onPrevious,
  onNext,
  first,
  last,
}: {
  item: IndustryItem;
  active: boolean;
  visible: boolean;
  onSelect: () => void;
  onPrevious: () => void;
  onNext: () => void;
  first: boolean;
  last: boolean;
}) {
  const Arrow = active ? FiArrowDownRight : FiArrowUpRight;
  return (
    <li
      className={twsolutionsdetailPage(
        `industry-carousel-item${active ? " industry-carousel-item--active" : ""}`,
      )}
      data-industry-id={item.id}
      aria-current={active ? "step" : undefined}
      aria-hidden={!visible}
      inert={!visible}
    >
      <button
        type="button"
        className="industry-card [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[flex-direction:column] [.solutions-detail-page_&]:[align-items:flex-start] [.solutions-detail-page_&]:[justify-content:space-between] [.solutions-detail-page_&]:[gap:calc(22_*_var(--industry-unit))] [.solutions-detail-page_&]:[width:calc(120_*_var(--industry-unit))] [.solutions-detail-page_&]:[max-width:100%] [.solutions-detail-page_&]:[min-height:calc(130_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[border:0] [.solutions-detail-page_&]:[border-radius:calc(20_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:transparent] [.solutions-detail-page_&]:[color:#27272a]! [.solutions-detail-page_&]:[text-align:left] [.solutions-detail-page_&]:[cursor:pointer] [.solutions-detail-page_&]:[transition:width_350ms_ease,_min-height_350ms_ease,_padding_350ms_ease,_background-color_350ms_ease,_box-shadow_350ms_ease] [.solutions-detail-page_.industry-carousel-item--active_&&]:[width:calc(161_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[min-height:calc(249_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-top:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-right:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-bottom:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-left:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[border-radius:calc(15_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[background:#f7f7f7] [.solutions-detail-page_.industry-carousel-item--active_&&]:[box-shadow:0_-20px_50px_#005eff18] max-md:[.solutions-detail-page_&]:[width:min(120px,_100%)] max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:min(161px,_100%)]"
        onClick={onSelect}
        aria-pressed={active}
      >
        <span className="industry-card-title [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.12]! [.solutions-detail-page_&]:[transition:font-size_350ms_ease] [.solutions-detail-page_.industry-carousel-item--active_&&]:[width:100%] [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-size:calc(22_*_var(--industry-unit))]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-weight:540]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1.07]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[text-align:center]">
          {active && item.activeTitleLines
            ? item.activeTitleLines.map((line, index) => (
                <span
                  className="industry-title-line [.solutions-detail-page_&]:[display:block]!"
                  key={`${line}-${index}`}
                >
                  {line}
                  {index < item.activeTitleLines!.length - 1 ? " " : ""}
                </span>
              ))
            : item.title}
        </span>
        <span
          className="industry-card-arrow [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[flex-shrink:0] [.solutions-detail-page_&]:[width:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[background:#27272a] [.solutions-detail-page_&]:[color:#fff]! [.solutions-detail-page_&_svg]:[width:60%] [.solutions-detail-page_&_svg]:[height:60%] [.solutions-detail-page_.industry-carousel-item--active_&&]:[border:0.5px_solid_#dceaff] [.solutions-detail-page_.industry-carousel-item--active_&&]:[background:linear-gradient(135deg,_#438aff,_#004bdc)] [.solutions-detail-page_.industry-carousel-item--active_&&]:[box-shadow:0_0_calc(21_*_var(--industry-unit))_calc(7_*_var(--industry-unit))_#005eff40,_inset_0_1px_2px_#ffffff99] [.solutions-detail-page_.industry-carousel-item--active_&&_svg]:[width:70%] [.solutions-detail-page_.industry-carousel-item--active_&&_svg]:[height:70%]"
          aria-hidden="true"
        >
          <Arrow strokeWidth={active ? 3.2 : 2} />
        </span>
      </button>
      <div className="industry-navigation-slot [.solutions-detail-page_&]:[min-height:calc(46_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[min-height:calc(115_*_var(--industry-unit))]">
        {active && (
          <div
            className="industry-navigation [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[justify-content:center] [.solutions-detail-page_&]:[gap:calc(15_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:calc(10_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-top:calc(50_*_var(--industry-unit))] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[width:max(32px,_calc(30_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[height:max(32px,_calc(30_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#9eb7d0]! [.solutions-detail-page_&_button]:[cursor:pointer] [.solutions-detail-page_&_button:disabled]:[opacity:0.35] [.solutions-detail-page_&_button:disabled]:[cursor:default] [.solutions-detail-page_&_svg]:[width:90%] [.solutions-detail-page_&_svg]:[height:90%]"
            aria-label="Industry navigation"
          >
            <button
              type="button"
              aria-label="Rotate industries left"
              disabled={first}
              onClick={onPrevious}
            >
              <FiArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Rotate industries right"
              disabled={last}
              onClick={onNext}
            >
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <p className="industry-item-description [.solutions-detail-page_&]:[width:calc(120_*_var(--industry-unit))] [.solutions-detail-page_&]:[max-width:100%] [.solutions-detail-page_&]:[margin-top:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.12]! [.solutions-detail-page_&]:[overflow-wrap:anywhere] [.solutions-detail-page_&]:[transition:width_350ms_ease,_font-size_350ms_ease] [.solutions-detail-page_.industry-carousel-item--active_&&]:[width:calc(135_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[text-align:center] max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:min(160px,_100%)] max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1.2]!">
        {item.description}
      </p>
    </li>
  );
}
export function IndustryCarousel({
  items = industryItems,
}: {
  items?: IndustryItem[];
}) {
  const reduced = useReducedMotion() ?? false;
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.min(2, Math.max(0, items.length - 1)),
  );
  const [layout, setLayout] = useState({
    visibleCount: 5,
    width: 0,
    gap: 0,
    mobile: false,
  });
  const swipeStart = useRef<{
    x: number;
    y: number;
  } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const previousRotation = useRef(selectedIndex);
  const previousPositions = useRef(
    new Map<
      string,
      {
        left: number;
        top: number;
        width: number;
        snapshot: HTMLElement;
      }
    >(),
  );
  const activeIndex = items.length
    ? ((selectedIndex % items.length) + items.length) % items.length
    : 0;
  const count = Math.min(layout.visibleCount, items.length);
  const visibleIndices = getIndustryVisibleIndices(
    activeIndex,
    items.length,
    count,
  );
  const slotWidth = layout.mobile
    ? Math.max(161, layout.width * 0.55)
    : count
      ? Math.max(0, (layout.width - layout.gap * (count - 1)) / count)
      : 0;
  const trackOffset = layout.mobile
    ? (layout.width - slotWidth) / 2 -
      Math.floor(count / 2) * (slotWidth + layout.gap)
    : 0;
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const update = () => {
      const visibleCount = window.innerWidth >= 1200 ? 5 : 3;
      const unit =
        parseFloat(
          getComputedStyle(viewport).getPropertyValue("--industry-unit"),
        ) || 1;
      // Gap is read from the track because the scaling unit uses CSS clamp().
      const gap =
        parseFloat(getComputedStyle(viewport.firstElementChild!).columnGap) ||
        40 * unit;
      setLayout({
        visibleCount,
        width: viewport.clientWidth,
        gap,
        mobile: window.innerWidth < 768,
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const rotation = selectedIndex - previousRotation.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nodes = Array.from(
      track.querySelectorAll<HTMLElement>("[data-industry-id]"),
    );
    const stride =
      nodes.length > 1 ? nodes[1].offsetLeft - nodes[0].offsetLeft : slotWidth;
    const cycleWidth = stride * items.length;
    const nextPositions = new Map<
      string,
      {
        left: number;
        top: number;
        width: number;
        snapshot: HTMLElement;
      }
    >();
    viewport
      .querySelectorAll(".industry-exit-ghost")
      .forEach((ghost) => ghost.remove());
    nodes.forEach((node) => {
      const id = node.dataset.industryId!;
      const previous = previousPositions.current.get(id);
      const translation = new DOMMatrixReadOnly(
        getComputedStyle(node).transform,
      ).m41;
      node.getAnimations().forEach((animation) => animation.cancel());
      if (!reducedMotion && rotation && previousPositions.current.size) {
        let from = previous
          ? previous.left - node.offsetLeft + translation
          : rotation * stride;
        if (rotation > 0 && from < 0) from += cycleWidth;
        if (rotation < 0 && from > 0) from -= cycleWidth;
        node.animate(
          [
            { transform: `translateX(${from}px)` },
            { transform: "translateX(0)" },
          ],
          { duration: 350, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
      nextPositions.set(id, {
        left: node.offsetLeft,
        top: node.offsetTop,
        width: node.offsetWidth,
        snapshot: node.cloneNode(true) as HTMLElement,
      });
    });
    if (!reducedMotion && rotation) {
      previousPositions.current.forEach((previous, id) => {
        const next = nextPositions.get(id);
        const wrapped =
          next &&
          (rotation > 0
            ? next.left > previous.left
            : next.left < previous.left);
        if (next && !wrapped) return;
        const ghost = previous.snapshot;
        ghost.classList.remove("industry-carousel-item--active");
        ghost.classList.add("industry-exit-ghost");
        ghost.removeAttribute("data-industry-id");
        ghost.removeAttribute("aria-current");
        ghost.setAttribute("aria-hidden", "true");
        ghost.inert = true;
        Object.assign(ghost.style, {
          position: "absolute",
          top: `${previous.top}px`,
          left: `${previous.left + trackOffset}px`,
          width: `${previous.width}px`,
          margin: "0",
          pointerEvents: "none",
          listStyle: "none",
        });
        viewport.appendChild(ghost);
        const animation = ghost.animate(
          [
            { transform: "translateX(0)" },
            { transform: `translateX(${-rotation * stride}px)` },
          ],
          { duration: 350, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
        animation.onfinish = () => ghost.remove();
      });
    }
    previousPositions.current = nextPositions;
    previousRotation.current = selectedIndex;
  }, [selectedIndex, count, slotWidth, trackOffset, items]);
  const navigate = (direction: -1 | 1) =>
    setSelectedIndex((current) => current + direction);
  const selectItem = (index: number) =>
    setSelectedIndex(
      (current) => current + getIndustryRotation(current, index, items.length),
    );
  return (
    <motion.section
      {...reveal("up", 0.04, reduced, 0.13)}
      className="industry-carousel-section [.solutions-detail-page_&]:[padding-top:calc(90_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(100_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-left:20px] max-md:[.solutions-detail-page_&]:[padding-right:20px]"
      aria-label="Specialized industry solutions"
    >
      <div
        ref={viewportRef}
        className="industry-carousel-viewport [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[touch-action:pan-y]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Industry applications"
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
          const dy = touch.clientY - start.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy))
            navigate(dx < 0 ? 1 : -1);
        }}
      >
        <ol
          ref={trackRef}
          className="industry-carousel-track [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:flex-start] [.solutions-detail-page_&]:[gap:calc(40_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:calc(35_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:calc(35_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&]:[min-height:calc(730_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[gap:20px] max-md:[.solutions-detail-page_&]:[min-height:620px]"
          style={
            {
              transform: `translateX(${trackOffset}px)`,
              "--industry-slot-width": layout.width
                ? `${slotWidth}px`
                : `calc((100% - ${(count - 1) * 40} * var(--industry-unit)) / ${count || 1})`,
            } as CSSProperties
          }
        >
          {visibleIndices.map((index) => (
            <IndustryCarouselItem
              key={items[index].id}
              item={items[index]}
              active={index === activeIndex}
              visible
              first={items.length < 2}
              last={items.length < 2}
              onSelect={() => selectItem(index)}
              onPrevious={() => navigate(-1)}
              onNext={() => navigate(1)}
            />
          ))}
        </ol>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {items[activeIndex]?.title}
      </p>
    </motion.section>
  );
}
const CONSULTATION_BANNER_IMAGE =
  "/solutions-detail/solutions-detail-request-engineering.webp";
function EngineeringConsultationBanner() {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      {...reveal("up", 0.03, reduced, 0.16)}
      className="consultation-banner [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[isolation:isolate] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[min-height:calc(401_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:linear-gradient(110deg,_#0657ce_0%,_#006eff_46%,_#051a44_100%)] max-md:[.solutions-detail-page_&]:[display:flex]! max-md:[.solutions-detail-page_&]:[flex-direction:column] max-md:[.solutions-detail-page_&]:[min-height:0]"
    >
      {CONSULTATION_BANNER_IMAGE && (
        <Image
          src={CONSULTATION_BANNER_IMAGE}
          alt=""
          fill
          sizes="84vw"
          className="consultation-banner-image [.solutions-detail-page_&]:[object-fit:cover] [.solutions-detail-page_&]:[z-index:-1] max-md:[.solutions-detail-page_&]:[position:relative]! max-md:[.solutions-detail-page_&]:[top:auto]! max-md:[.solutions-detail-page_&]:[right:auto]! max-md:[.solutions-detail-page_&]:[bottom:auto]! max-md:[.solutions-detail-page_&]:[left:auto]! max-md:[.solutions-detail-page_&]:[order:1] max-md:[.solutions-detail-page_&]:[width:100%]! max-md:[.solutions-detail-page_&]:[height:auto]! max-md:[.solutions-detail-page_&]:[aspect-ratio:4096_/_1482] max-md:[.solutions-detail-page_&]:[object-fit:contain] max-md:[.solutions-detail-page_&]:[z-index:0]"
        />
      )}
      {!CONSULTATION_BANNER_IMAGE && (
        <svg
          className="consultation-banner-waves [.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[top:0] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:0] [.solutions-detail-page_&]:[z-index:-1] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[height:100%] [.solutions-detail-page_&]:[pointer-events:none]"
          viewBox="0 0 1200 401"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-40 200C220 20 350 420 680 190S1050 150 1240 220M-40 220C220 40 350 440 680 210S1050 170 1240 240M-40 240C220 60 350 460 680 230S1050 190 1240 260"
            stroke="#91c9ff"
            strokeOpacity=".2"
          />
        </svg>
      )}
      <div className="consultation-banner-copy [.solutions-detail-page_&]:[width:52%] [.solutions-detail-page_&]:[padding-top:calc(60_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:calc(67_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-bottom:calc(60_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:calc(67_*_var(--industry-unit))] [.solutions-detail-page_&]:[color:#f7f7f7]! [.solutions-detail-page_&_h2]:[margin-top:0] [.solutions-detail-page_&_h2]:[margin-right:0] [.solutions-detail-page_&_h2]:[margin-bottom:0] [.solutions-detail-page_&_h2]:[margin-left:0] [.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h2]:[font-weight:410]! [.solutions-detail-page_&_h2]:[line-height:1]! [.solutions-detail-page_&_p]:[margin-top:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&_p]:[margin-right:0] [.solutions-detail-page_&_p]:[margin-bottom:0] [.solutions-detail-page_&_p]:[margin-left:0] [.solutions-detail-page_&_p]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_p]:[line-height:1]! max-xl:[.solutions-detail-page_&]:[width:65%] max-xl:[.solutions-detail-page_&]:[padding-left:40px] max-xl:[.solutions-detail-page_&]:[padding-right:40px] max-xl:[.solutions-detail-page_&_h2]:[font-size:42px]! max-xl:[.solutions-detail-page_&_p]:[line-height:1.2]! max-md:[.solutions-detail-page_&]:[display:contents]! max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(30px,_8vw,_42px)]! max-md:[.solutions-detail-page_&_h2]:[order:0] max-md:[.solutions-detail-page_&_h2]:[margin-top:26px] max-md:[.solutions-detail-page_&_h2]:[margin-right:24px] max-md:[.solutions-detail-page_&_h2]:[margin-bottom:20px] max-md:[.solutions-detail-page_&_h2]:[margin-left:24px] max-md:[.solutions-detail-page_&_p]:[order:2] max-md:[.solutions-detail-page_&_p]:[margin-top:20px] max-md:[.solutions-detail-page_&_p]:[margin-right:24px] max-md:[.solutions-detail-page_&_p]:[margin-bottom:26px] max-md:[.solutions-detail-page_&_p]:[margin-left:24px] max-md:[.solutions-detail-page_&_p]:[font-size:13px]! max-md:[.solutions-detail-page_&_p]:[line-height:1.2]!">
        <h2 id="consultation-title">
          Request
          <br />
          Engineering
          <br />
          Consultation
        </h2>
        <p>
          Share your technical requirements, and our expert engineering team
          will reach out to design the optimal hydraulic infrastructure for your
          system.
        </p>
      </div>
    </motion.div>
  );
}
type ConsultationValues = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  fluid: string;
  flow: string;
  pressure: string;
  details: string;
};
type ConsultationFieldData = {
  name: keyof ConsultationValues;
  label: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  required?: boolean;
  inputMode?: "decimal";
};
const contactFields: ConsultationFieldData[] = [
  {
    name: "fullName",
    label: "Full Name",
    autoComplete: "name",
    required: true,
  },
  { name: "company", label: "Company Name", autoComplete: "organization" },
  {
    name: "email",
    label: "Corporate Email",
    type: "email",
    autoComplete: "email",
    required: true,
  },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
];
const specificationFields: ConsultationFieldData[] = [
  { name: "industry", label: "Industry" },
  { name: "fluid", label: "Fluid Type" },
  { name: "flow", label: "Estimated Flow Rat", inputMode: "decimal" },
  { name: "pressure", label: "Estimated Pressure", inputMode: "decimal" },
];
function ConsultationInput({
  field,
  value,
  onChange,
}: {
  field: ConsultationFieldData;
  value: string;
  onChange: (name: keyof ConsultationValues, value: string) => void;
}) {
  const id = `consultation-${field.name}`;
  return (
    <div
      className="consultation-field [.solutions-detail-page_&]:[min-width:0] [.solutions-detail-page_&_input]:[display:block]! [.solutions-detail-page_&_input]:[width:100%] [.solutions-detail-page_&_input]:[height:calc(45_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[min-height:44px] [.solutions-detail-page_&_input]:[padding-top:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-bottom:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[border:1px_solid_transparent] [.solutions-detail-page_&_input]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[background:#f7f7f7] [.solutions-detail-page_&_input]:[color:#334155]! [.solutions-detail-page_&_input]:[font-style:inherit] [.solutions-detail-page_&_input]:[font-variant:inherit] [.solutions-detail-page_&_input]:[font-weight:inherit]! [.solutions-detail-page_&_input]:[font-stretch:inherit]! [.solutions-detail-page_&_input]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_input]:[line-height:1.07]! [.solutions-detail-page_&_input]:[font-family:inherit]! [.solutions-detail-page_&_input]:[font-feature-settings:inherit] [.solutions-detail-page_&_input]:[font-variation-settings:inherit]! [.solutions-detail-page_&_textarea]:[display:block]! [.solutions-detail-page_&_textarea]:[width:100%] [.solutions-detail-page_&_textarea]:[height:calc(188_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[min-height:44px] [.solutions-detail-page_&_textarea]:[padding-top:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-bottom:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[border:1px_solid_transparent] [.solutions-detail-page_&_textarea]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[background:#f7f7f7] [.solutions-detail-page_&_textarea]:[color:#334155]! [.solutions-detail-page_&_textarea]:[font-style:inherit] [.solutions-detail-page_&_textarea]:[font-variant:inherit] [.solutions-detail-page_&_textarea]:[font-weight:inherit]! [.solutions-detail-page_&_textarea]:[font-stretch:inherit]! [.solutions-detail-page_&_textarea]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_textarea]:[line-height:1.07]! [.solutions-detail-page_&_textarea]:[font-family:inherit]! [.solutions-detail-page_&_textarea]:[font-feature-settings:inherit] [.solutions-detail-page_&_textarea]:[font-variation-settings:inherit]! [.solutions-detail-page_&_input::placeholder]:[color:#9eb7d0]! [.solutions-detail-page_&_input::placeholder]:[opacity:1] [.solutions-detail-page_&_textarea::placeholder]:[color:#9eb7d0]! [.solutions-detail-page_&_textarea::placeholder]:[opacity:1] [.solutions-detail-page_&_textarea]:[resize:vertical] [.solutions-detail-page_&_input:focus]:[outline:none] [.solutions-detail-page_&_input:focus]:[border-color:#005eff] [.solutions-detail-page_&_input:focus]:[box-shadow:0_0_0_2px_#005eff12] [.solutions-detail-page_&_textarea:focus]:[outline:none] [.solutions-detail-page_&_textarea:focus]:[border-color:#005eff] [.solutions-detail-page_&_textarea:focus]:[box-shadow:0_0_0_2px_#005eff12] max-md:[.solutions-detail-page_&[data-field='phone']]:[order:2] max-md:[.solutions-detail-page_&[data-field='email']]:[order:3] max-md:[.solutions-detail-page_&_input]:[padding-left:22px] max-md:[.solutions-detail-page_&_input]:[padding-right:22px] max-md:[.solutions-detail-page_&_textarea]:[padding-left:22px] max-md:[.solutions-detail-page_&_textarea]:[padding-right:22px] max-md:[.solutions-detail-page_&_textarea]:[height:188px] max-md:[.solutions-detail-page_&_textarea]:[resize:vertical]"
      data-field={field.name}
    >
      <label className="sr-only" htmlFor={id}>
        {field.label}
      </label>
      <input
        id={id}
        name={field.name}
        type={field.type || "text"}
        autoComplete={field.autoComplete}
        inputMode={field.inputMode}
        required={field.required}
        placeholder={field.label}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
      />
    </div>
  );
}
function technicalFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
function TechnicalDocumentUpload({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const addFiles = (incoming: File[]) => {
    const accepted = incoming.filter((file) =>
      /\.(pdf|jpe?g|png|docx?)$/i.test(file.name),
    );
    setError(
      accepted.length !== incoming.length
        ? "Please select PDF, JPG, PNG, DOC or DOCX files."
        : "",
    );
    const combined = new Map(
      files.map((file) => [technicalFileKey(file), file]),
    );
    accepted.forEach((file) => combined.set(technicalFileKey(file), file));
    onChange([...combined.values()]);
  };
  return (
    <div className="consultation-upload-field [.solutions-detail-page_&]:[min-width:0]">
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        tabIndex={-1}
        aria-label="Upload Technical Documents"
        onChange={(event) => {
          addFiles(Array.from(event.target.files || []));
          event.target.value = "";
        }}
      />
      <div
        className="consultation-upload [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[flex-direction:column] [.solutions-detail-page_&]:[gap:12px] [.solutions-detail-page_&]:[height:calc(188_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-bottom:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&]:[border:1px_solid_transparent] [.solutions-detail-page_&]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:#f7f7f7] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[cursor:pointer] [.solutions-detail-page_&[data-dragging='true']]:[border-color:#005eff] [.solutions-detail-page_&[data-dragging='true']]:[background:#eff6ff] [.solutions-detail-page_&:focus-visible]:[outline:2px_solid_#005eff] [.solutions-detail-page_&:focus-visible]:[outline-offset:3px] max-md:[.solutions-detail-page_&]:[height:188px] max-md:[.solutions-detail-page_&]:[padding-top:23px] max-md:[.solutions-detail-page_&]:[padding-right:18px] max-md:[.solutions-detail-page_&]:[padding-bottom:23px] max-md:[.solutions-detail-page_&]:[padding-left:18px] max-md:[.solutions-detail-page_&]:[align-items:center] max-md:[.solutions-detail-page_&]:[gap:14px]"
        data-dragging={dragging}
        role="button"
        tabIndex={0}
        aria-label="Upload Technical Documents: PDF, JPG, PNG, DOC or DOCX"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          )
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <span className="consultation-upload-title [.solutions-detail-page_&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.07]! max-md:[.solutions-detail-page_&]:[text-align:center]">
          Upload Technical Documents
        </span>
        <span
          className="consultation-upload-symbol [.solutions-detail-page_&]:[display:none]! max-md:[.solutions-detail-page_&]:[display:grid]! max-md:[.solutions-detail-page_&]:[place-items:center] max-md:[.solutions-detail-page_&]:[flex-shrink:0] max-md:[.solutions-detail-page_&]:[width:48px] max-md:[.solutions-detail-page_&]:[height:48px] max-md:[.solutions-detail-page_&]:[border-radius:50%] max-md:[.solutions-detail-page_&]:[background:#e2e8f0] max-md:[.solutions-detail-page_&]:[color:#475569]! max-md:[.solutions-detail-page_&_svg]:[width:24px] max-md:[.solutions-detail-page_&_svg]:[height:24px]"
          aria-hidden="true"
        >
          <FiUpload />
        </span>
        <ul className="consultation-file-list [.solutions-detail-page_&]:[flex:1] [.solutions-detail-page_&]:[overflow-y:auto] [.solutions-detail-page_&]:[min-height:0] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&_li]:[display:flex]! [.solutions-detail-page_&_li]:[align-items:center] [.solutions-detail-page_&_li]:[gap:8px] [.solutions-detail-page_&_li]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&_li]:[color:#334155]! [.solutions-detail-page_&_li_>_span]:[flex:1] [.solutions-detail-page_&_li_>_span]:[min-width:0] [.solutions-detail-page_&_li_>_span]:[overflow-wrap:anywhere] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[flex-shrink:0] [.solutions-detail-page_&_button]:[width:28px] [.solutions-detail-page_&_button]:[height:28px] [.solutions-detail-page_&_button]:[padding-top:0] [.solutions-detail-page_&_button]:[padding-right:0] [.solutions-detail-page_&_button]:[padding-bottom:0] [.solutions-detail-page_&_button]:[padding-left:0] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#9eb7d0]! [.solutions-detail-page_&_button]:[cursor:pointer] max-md:[.solutions-detail-page_&]:[width:100%]">
          {files.map((file) => (
            <li key={technicalFileKey(file)}>
              <span>{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(
                    files.filter(
                      (existing) =>
                        technicalFileKey(existing) !== technicalFileKey(file),
                    ),
                  );
                }}
              >
                <FiX aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <span
          className="consultation-file-icons [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[gap:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_svg]:[width:calc(14_*_var(--industry-unit))] [.solutions-detail-page_&_svg]:[height:calc(14_*_var(--industry-unit))] [.solutions-detail-page_&_svg]:[stroke-width:1.4] max-md:[.solutions-detail-page_&]:[justify-content:center] max-md:[.solutions-detail-page_&]:[gap:6px] max-md:[.solutions-detail-page_&_svg]:[width:22px] max-md:[.solutions-detail-page_&_svg]:[height:22px]"
          aria-hidden="true"
        >
          {["adobe", "jpg", "word"].map((format) => (
            <Image
              key={format}
              src={`/solutions-detail/${format}.png`}
              alt=""
              width={69}
              height={92}
              unoptimized
              style={{
                width: "auto",
                height: "clamp(22px, calc(28 * var(--industry-unit)), 40px)",
                objectFit: "contain",
              }}
            />
          ))}
        </span>
      </div>
      <p
        className="consultation-upload-error [.solutions-detail-page_&]:[margin-top:8px] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[color:#9b3131]! [.solutions-detail-page_&]:[font-size:12px]! [.solutions-detail-page_&]:[line-height:1.2]! [.solutions-detail-page_&:empty]:[display:none]!"
        role="alert"
      >
        {error}
      </p>
    </div>
  );
}
function EngineeringConsultationForm() {
  const reduced = useReducedMotion() ?? false;
  const [values, setValues] = useState<ConsultationValues>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    industry: "",
    fluid: "",
    flow: "",
    pressure: "",
    details: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [feedback, setFeedback] = useState("");
  const updateValue = (name: keyof ConsultationValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFeedback("");
  };
  const submitPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    // Selected documents stay in browser memory; no submission is performed.
    setFeedback("Danışmanlık talep sistemi yakında aktif olacaktır.");
  };
  return (
    <form
      className="consultation-form [.solutions-detail-page_&]:[margin-top:calc(75_*_var(--industry-unit))] [.solutions-detail-page_&_fieldset]:[min-width:0] [.solutions-detail-page_&_fieldset]:[margin-top:0] [.solutions-detail-page_&_fieldset]:[margin-right:0] [.solutions-detail-page_&_fieldset]:[margin-bottom:calc(48_*_var(--industry-unit))] [.solutions-detail-page_&_fieldset]:[margin-left:0] [.solutions-detail-page_&_fieldset]:[padding-top:0] [.solutions-detail-page_&_fieldset]:[padding-right:0] [.solutions-detail-page_&_fieldset]:[padding-bottom:0] [.solutions-detail-page_&_fieldset]:[padding-left:0] [.solutions-detail-page_&_fieldset]:[border:0] [.solutions-detail-page_&_legend]:[margin-bottom:calc(27_*_var(--industry-unit))] [.solutions-detail-page_&_legend]:[padding-top:0] [.solutions-detail-page_&_legend]:[padding-right:0] [.solutions-detail-page_&_legend]:[padding-bottom:0] [.solutions-detail-page_&_legend]:[padding-left:0] [.solutions-detail-page_&_legend]:[font-size:calc(25_*_var(--industry-unit))]! [.solutions-detail-page_&_legend]:[font-weight:540]! [.solutions-detail-page_&_legend]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.solutions-detail-page_&_legend]:[line-height:1.12]! [.solutions-detail-page_&_legend]:[color:#005eff]! max-md:[.solutions-detail-page_&]:[margin-top:48px] max-md:[.solutions-detail-page_&_fieldset]:[margin-bottom:32px] max-md:[.solutions-detail-page_&_legend]:[margin-bottom:18px] max-md:[.solutions-detail-page_&_legend]:[font-size:clamp(20px,_5.4vw,_25px)]!"
      noValidate
      onSubmit={submitPreview}
    >
      <motion.fieldset {...reveal("up", 0.03, reduced, 0.13)}>
        <legend>Contact Information</legend>
        <div className="consultation-input-grid [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.solutions-detail-page_&]:[gap:calc(23_*_var(--industry-unit))_calc(37_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:10px]">
          {contactFields.map((field) => (
            <ConsultationInput
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={updateValue}
            />
          ))}
        </div>
      </motion.fieldset>
      <motion.fieldset {...reveal("up", 0.05, reduced, 0.13)}>
        <legend>Project Specifications</legend>
        <div className="consultation-input-grid [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.solutions-detail-page_&]:[gap:calc(23_*_var(--industry-unit))_calc(37_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:10px]">
          {specificationFields.map((field) => (
            <ConsultationInput
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={updateValue}
            />
          ))}
        </div>
      </motion.fieldset>
      <motion.fieldset {...reveal("up", 0.07, reduced, 0.13)}>
        <legend>Details &amp; Attachments</legend>
        <div className="consultation-details-grid [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.solutions-detail-page_&]:[gap:calc(23_*_var(--industry-unit))_calc(37_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:10px]">
          <div className="consultation-field [.solutions-detail-page_&]:[min-width:0] [.solutions-detail-page_&_input]:[display:block]! [.solutions-detail-page_&_input]:[width:100%] [.solutions-detail-page_&_input]:[height:calc(45_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[min-height:44px] [.solutions-detail-page_&_input]:[padding-top:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-bottom:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[border:1px_solid_transparent] [.solutions-detail-page_&_input]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[background:#f7f7f7] [.solutions-detail-page_&_input]:[color:#334155]! [.solutions-detail-page_&_input]:[font-style:inherit] [.solutions-detail-page_&_input]:[font-variant:inherit] [.solutions-detail-page_&_input]:[font-weight:inherit]! [.solutions-detail-page_&_input]:[font-stretch:inherit]! [.solutions-detail-page_&_input]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_input]:[line-height:1.07]! [.solutions-detail-page_&_input]:[font-family:inherit]! [.solutions-detail-page_&_input]:[font-feature-settings:inherit] [.solutions-detail-page_&_input]:[font-variation-settings:inherit]! [.solutions-detail-page_&_textarea]:[display:block]! [.solutions-detail-page_&_textarea]:[width:100%] [.solutions-detail-page_&_textarea]:[height:calc(188_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[min-height:44px] [.solutions-detail-page_&_textarea]:[padding-top:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-bottom:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[border:1px_solid_transparent] [.solutions-detail-page_&_textarea]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[background:#f7f7f7] [.solutions-detail-page_&_textarea]:[color:#334155]! [.solutions-detail-page_&_textarea]:[font-style:inherit] [.solutions-detail-page_&_textarea]:[font-variant:inherit] [.solutions-detail-page_&_textarea]:[font-weight:inherit]! [.solutions-detail-page_&_textarea]:[font-stretch:inherit]! [.solutions-detail-page_&_textarea]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_textarea]:[line-height:1.07]! [.solutions-detail-page_&_textarea]:[font-family:inherit]! [.solutions-detail-page_&_textarea]:[font-feature-settings:inherit] [.solutions-detail-page_&_textarea]:[font-variation-settings:inherit]! [.solutions-detail-page_&_input::placeholder]:[color:#9eb7d0]! [.solutions-detail-page_&_input::placeholder]:[opacity:1] [.solutions-detail-page_&_textarea::placeholder]:[color:#9eb7d0]! [.solutions-detail-page_&_textarea::placeholder]:[opacity:1] [.solutions-detail-page_&_textarea]:[resize:vertical] [.solutions-detail-page_&_input:focus]:[outline:none] [.solutions-detail-page_&_input:focus]:[border-color:#005eff] [.solutions-detail-page_&_input:focus]:[box-shadow:0_0_0_2px_#005eff12] [.solutions-detail-page_&_textarea:focus]:[outline:none] [.solutions-detail-page_&_textarea:focus]:[border-color:#005eff] [.solutions-detail-page_&_textarea:focus]:[box-shadow:0_0_0_2px_#005eff12] max-md:[.solutions-detail-page_&[data-field='phone']]:[order:2] max-md:[.solutions-detail-page_&[data-field='email']]:[order:3] max-md:[.solutions-detail-page_&_input]:[padding-left:22px] max-md:[.solutions-detail-page_&_input]:[padding-right:22px] max-md:[.solutions-detail-page_&_textarea]:[padding-left:22px] max-md:[.solutions-detail-page_&_textarea]:[padding-right:22px] max-md:[.solutions-detail-page_&_textarea]:[height:188px] max-md:[.solutions-detail-page_&_textarea]:[resize:vertical]">
            <label className="sr-only" htmlFor="consultation-details">
              Project Details &amp; Challenges
            </label>
            <textarea
              id="consultation-details"
              name="details"
              placeholder="Project Details & Challenges"
              value={values.details}
              onChange={(event) => updateValue("details", event.target.value)}
            />
          </div>
          <TechnicalDocumentUpload
            files={files}
            onChange={(next) => {
              setFiles(next);
              setFeedback("");
            }}
          />
        </div>
      </motion.fieldset>
      <motion.div
        {...reveal("up", 0.1, reduced, 0.22)}
        className="consultation-form-footer [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[justify-content:space-between] [.solutions-detail-page_&]:[gap:24px] max-md:[.solutions-detail-page_&]:[align-items:center] max-md:[.solutions-detail-page_&]:[flex-direction:column] max-md:[.solutions-detail-page_&]:[gap:18px]"
      >
        <label className="consultation-consent [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.07]! [.solutions-detail-page_&]:[letter-spacing:0] [.solutions-detail-page_&]:[color:#000]! [.solutions-detail-page_&]:[cursor:pointer] max-md:[.solutions-detail-page_&]:[width:100%] max-md:[.solutions-detail-page_&]:[align-items:flex-start] max-md:[.solutions-detail-page_&]:[gap:20px] max-md:[.solutions-detail-page_&_>_span:last-child]:[flex:1] max-md:[.solutions-detail-page_&_>_span:last-child]:[text-align:center] max-md:[.solutions-detail-page_&_>_span:last-child]:[line-height:1.2]!">
          <span className="consultation-checkbox [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[flex-shrink:0] [.solutions-detail-page_&]:[width:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[appearance:none] [.solutions-detail-page_&_input]:[display:block]! [.solutions-detail-page_&_input]:[width:100%] [.solutions-detail-page_&_input]:[height:100%] [.solutions-detail-page_&_input]:[margin-top:0] [.solutions-detail-page_&_input]:[margin-right:0] [.solutions-detail-page_&_input]:[margin-bottom:0] [.solutions-detail-page_&_input]:[margin-left:0] [.solutions-detail-page_&_input]:[border:0] [.solutions-detail-page_&_input]:[border-radius:calc(3_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[background:#d9d9d9] [.solutions-detail-page_&_input]:[cursor:pointer] [.solutions-detail-page_&_input:checked]:[background:#005eff] [.solutions-detail-page_&_svg]:[position:absolute] [.solutions-detail-page_&_svg]:[top:10%] [.solutions-detail-page_&_svg]:[right:10%] [.solutions-detail-page_&_svg]:[bottom:10%] [.solutions-detail-page_&_svg]:[left:10%] [.solutions-detail-page_&_svg]:[width:80%] [.solutions-detail-page_&_svg]:[height:80%] [.solutions-detail-page_&_svg]:[color:#fff]! [.solutions-detail-page_&_svg]:[opacity:0] [.solutions-detail-page_&_svg]:[pointer-events:none] [.solutions-detail-page_&_input:checked_+_svg]:[opacity:1] [.solutions-detail-page_&_input:focus-visible]:[outline:2px_solid_#005eff] [.solutions-detail-page_&_input:focus-visible]:[outline-offset:3px]">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                setFeedback("");
              }}
            />
            <FiCheck aria-hidden="true" />
          </span>
          <span>I have read and agree to the Privacy Policy.</span>
        </label>
        <SendButton />
      </motion.div>
      <p
        className="consultation-feedback [.solutions-detail-page_&]:[min-height:20px] [.solutions-detail-page_&]:[margin-top:16px] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&]:[color:#0d5792]!"
        role="status"
        aria-live="polite"
        lang="tr"
      >
        {feedback}
      </p>
    </form>
  );
}
function EngineeringConsultationSection() {
  return (
    <section
      className="engineering-consultation [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-left:20px] max-md:[.solutions-detail-page_&]:[padding-right:20px]"
      aria-labelledby="consultation-title"
    >
      <div className="consultation-inner [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto]">
        <EngineeringConsultationBanner />
        <EngineeringConsultationForm />
      </div>
    </section>
  );
}
type SolutionSlide = {
  id: string;
  image: string;
  titleLines: [string, string, string];
};
type PumpSlide = {
  id: string;
  image: string;
  alt: string;
};
// Reference repeats are preview data, not separate invented solution/product models.
const otherSolutionSlides: SolutionSlide[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `infrastructure-preview-${index + 1}`,
    image: "/solutions-detail/solution-basic.webp",
    titleLines: ["Infrastructure", "Superstructure", "(Civil Construction)"],
  }),
);
const infrastructurePumpSlides: PumpSlide[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: `pump-preview-${index + 1}`,
    image: "/solutions-detail/product.webp",
    alt: "Sempa pump",
  }),
);
function useSolutionSlider(
  itemCount: number,
  viewportRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLOListElement | null>,
  initialPeek = 0.8,
) {
  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const [position, setPosition] = useState({
    offset: 0,
    stride: 0,
    maximum: 0,
    viewportWidth: 0,
    cardWidth: 0,
  });
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const cardWidth = children[0]?.getBoundingClientRect().width || 0;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const stride = cardWidth + gap;
      const maximum = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setPosition((current) => ({
        offset: Math.min(
          maximum,
          current.stride
            ? (current.offset / current.stride) * stride
            : stride * initialPeek,
        ),
        stride,
        maximum,
        viewportWidth: viewport.clientWidth,
        cardWidth,
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    if (track.firstElementChild) observer.observe(track.firstElementChild);
    return () => observer.disconnect();
  }, [itemCount, viewportRef, trackRef, initialPeek]);
  const move = (direction: -1 | 1) =>
    setPosition((current) => {
      if (!current.stride) return current;
      const nextIndex =
        direction > 0
          ? Math.floor(current.offset / current.stride + 0.001) + 1
          : Math.ceil(current.offset / current.stride - 0.001) - 1;
      return {
        ...current,
        offset: Math.max(
          0,
          Math.min(current.maximum, nextIndex * current.stride),
        ),
      };
    });
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !event.isPrimary || event.button !== 0)
      return;
    event.preventDefault();
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      pointerStart.current = null;
      return;
    }
    const touch = event.touches[0];
    pointerStart.current = { x: touch.clientX, y: touch.clientY, id: -1 };
  };
  const onTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    const touch = event.changedTouches[0];
    pointerStart.current = null;
    if (!start || start.id !== -1 || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const start = pointerStart.current;
    pointerStart.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  };
  const visible = (index: number) =>
    !position.viewportWidth ||
    (index * position.stride + position.cardWidth > position.offset &&
      index * position.stride < position.offset + position.viewportWidth);
  const cancelDrag = () => {
    pointerStart.current = null;
    setIsDragging(false);
  };
  return {
    offset: position.offset,
    isDragging,
    previousDisabled: position.offset < 1,
    nextDisabled: position.offset >= position.maximum - 1,
    previous: () => move(-1),
    next: () => move(1),
    visible,
    pointerHandlers: {
      onPointerDown,
      onPointerUp,
      onTouchStart,
      onTouchEnd,
      onTouchCancel: cancelDrag,
      onPointerCancel: cancelDrag,
      onLostPointerCapture: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "touch") cancelDrag();
      },
      onDragStart: (event: { preventDefault: () => void }) =>
        event.preventDefault(),
    },
  };
}
function SolutionSliderArrows({
  slider,
  label,
  controls,
}: {
  slider: ReturnType<typeof useSolutionSlider>;
  label: string;
  controls: string;
}) {
  return (
    <div className="solution-slider-navigation [.solutions-detail-page_.other-solutions-inner_>_&]:[justify-content:center] [.solutions-detail-page_.other-solutions-inner_>_&]:[margin-top:calc(25_*_var(--industry-unit))] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[gap:calc(18_*_var(--industry-unit))] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[flex-shrink:0] [.solutions-detail-page_&_button]:[width:max(32px,_calc(32_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[height:max(32px,_calc(32_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[padding-top:0] [.solutions-detail-page_&_button]:[padding-right:0] [.solutions-detail-page_&_button]:[padding-bottom:0] [.solutions-detail-page_&_button]:[padding-left:0] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#9eb7d0]! [.solutions-detail-page_&_button]:[cursor:pointer] [.solutions-detail-page_&_button:hover:not(:disabled)]:[color:#0d5792]! [.solutions-detail-page_&_button:disabled]:[opacity:0.35] [.solutions-detail-page_&_button:disabled]:[cursor:default] [.solutions-detail-page_&_svg]:[width:75%] [.solutions-detail-page_&_svg]:[height:75%] max-xl:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[grid-column:1_/_-1] max-xl:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[justify-content:flex-end] max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[justify-content:center] max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[margin-top:22px] max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[gap:18px] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_button]:[width:32px] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_button]:[height:32px] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_svg]:[width:100%] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_svg]:[height:100%]">
      <button
        type="button"
        aria-label={`Previous ${label}`}
        aria-controls={controls}
        disabled={slider.previousDisabled}
        onClick={slider.previous}
      >
        <FiArrowLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Next ${label}`}
        aria-controls={controls}
        disabled={slider.nextDisabled}
        onClick={slider.next}
      >
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}
function SolutionSliderEdgeBlur() {
  const layers = [
    { blur: 2, left: "0%" },
    { blur: 6, left: "25%" },
    { blur: 10, left: "50%" },
    { blur: 16, left: "72%" },
  ];
  return (
    <div
      className="solution-slider-edge-blur [.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[z-index:2] [.solutions-detail-page_&]:[top:0] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:auto] [.solutions-detail-page_&]:[width:min(24%,_calc(220_*_var(--industry-unit)))] [.solutions-detail-page_&]:[pointer-events:none] [.solutions-detail-page_&_span]:[position:absolute] [.solutions-detail-page_&_span]:[top:0] [.solutions-detail-page_&_span]:[right:0] [.solutions-detail-page_&_span]:[bottom:0] [.solutions-detail-page_&_span]:[left:0] [.solutions-detail-page_&_span:last-child]:[background:linear-gradient(90deg,_transparent,_#fafcff55)] max-md:[.solutions-detail-page_&]:[width:min(18%,_65px)] max-md:[.solutions-detail-page_.infrastructure-pump-viewport_&]:[display:none]!"
      aria-hidden="true"
    >
      {layers.map((layer) => (
        <span
          key={layer.blur}
          style={{
            left: layer.left,
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
          }}
          className="[mask-image:linear-gradient(to_right,_transparent,_black)] [-webkit-mask-image:linear-gradient(to_right,_transparent,_black)]"
        />
      ))}
    </div>
  );
}
function OtherSolutionsHeading() {
  const reduced = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const slider = useSolutionSlider(
    otherSolutionSlides.length,
    viewportRef,
    trackRef,
    0,
  );
  return (
    <section
      className="other-solutions-section [.solutions-detail-page_&]:[padding-top:calc(90_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-top:64px] max-md:[.solutions-detail-page_&]:[padding-right:20px] max-md:[.solutions-detail-page_&]:[padding-bottom:80px] max-md:[.solutions-detail-page_&]:[padding-left:20px]"
      aria-labelledby="other-solutions-title"
    >
      <div className="other-solutions-inner [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&_h2]:[margin-top:0] [.solutions-detail-page_&_h2]:[margin-right:0] [.solutions-detail-page_&_h2]:[margin-bottom:0] [.solutions-detail-page_&_h2]:[margin-left:0] [.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h2]:[font-weight:410]! [.solutions-detail-page_&_h2]:[line-height:1]! [.solutions-detail-page_&_h2]:[color:#0d5792]! [.solutions-detail-page_&_h2]:[text-align:center] max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(30px,_8vw,_42px)]!">
        <motion.h2
          id="other-solutions-title"
          {...reveal("left", 0.02, reduced, 0.22)}
        >
          Other Solutions
        </motion.h2>
        <SolutionSliderArrows
          slider={slider}
          label="solution"
          controls="other-solutions-slider"
        />
        <div
          ref={viewportRef}
          id="other-solutions-slider"
          data-dragging={slider.isDragging}
          className="left-5 mx-0! w-[calc(100vw-20px)]! max-w-none md:left-[8%] md:w-[92vw]! cursor-grab select-none data-[dragging=true]:cursor-grabbing [&_*]:cursor-inherit [&_*]:select-none [&_img]:[-webkit-user-drag:none] solution-slider-viewport other-solutions-viewport [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[touch-action:pan-y] [.solutions-detail-page_&]:[max-width:calc(1040_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-top:calc(40_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:auto]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Other solutions"
          {...slider.pointerHandlers}
        >
          <ol
            ref={trackRef}
            className="solution-slider-track other-solutions-track [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:stretch] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&]:[transition:transform_450ms_ease-in-out] [.solutions-detail-page_&]:[gap:calc(19_*_var(--industry-unit))]"
            style={{ transform: `translateX(${-slider.offset}px)` }}
          >
            {otherSolutionSlides.map((slide, index) => (
              <motion.li
                {...reveal("up", Math.min(index, 5) * 0.045, reduced, 0.12)}
                key={slide.id}
                className="other-solution-card [.solutions-detail-page_&]:[flex:0_0_calc(292_*_var(--industry-unit))] [.solutions-detail-page_&]:[min-width:0] [.solutions-detail-page_&]:[min-height:calc(375_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:calc(17_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-bottom:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:calc(17_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(15_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:#f7f7f7] [.solutions-detail-page_&_h3]:[margin-top:calc(25_*_var(--industry-unit))] [.solutions-detail-page_&_h3]:[margin-right:0] [.solutions-detail-page_&_h3]:[margin-bottom:0] [.solutions-detail-page_&_h3]:[margin-left:0] [.solutions-detail-page_&_h3]:[color:#000]! [.solutions-detail-page_&_h3]:[font-size:calc(20_*_var(--industry-unit))]! [.solutions-detail-page_&_h3]:[font-weight:410]! [.solutions-detail-page_&_h3]:[line-height:1.07]! [.solutions-detail-page_&_h3]:[text-align:center] [.solutions-detail-page_&_h3_span]:[display:block]! max-md:[.solutions-detail-page_&]:[flex-basis:min(292px,_calc(100vw_-_56px))]"
                aria-hidden={!slider.visible(index)}
              >
                <div className="other-solution-image [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[height:calc(240_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(17_*_var(--industry-unit))] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&_img]:[object-fit:cover]">
                  <Image
                    src={slide.image}
                    alt="Isometric infrastructure and pumping systems"
                    fill
                    sizes="(min-width: 1280px) 18vw, 258px"
                    draggable={false}
                  />
                </div>
                <h3>
                  {slide.titleLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
              </motion.li>
            ))}
          </ol>
          <SolutionSliderEdgeBlur />
        </div>
      </div>
    </section>
  );
}
function InfrastructurePumpSolutions() {
  const reduced = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const slider = useSolutionSlider(
    infrastructurePumpSlides.length,
    viewportRef,
    trackRef,
  );
  return (
    <section
      className="infrastructure-pump-solutions [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-top:0] max-md:[.solutions-detail-page_&]:[padding-right:0] max-md:[.solutions-detail-page_&]:[padding-bottom:80px] max-md:[.solutions-detail-page_&]:[padding-left:0]"
      aria-labelledby="infrastructure-pump-title"
    >
      <div className="infrastructure-pump-inner [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto]">
        <div className="infrastructure-pump-header [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:minmax(0,_539fr)_minmax(0,_449fr)_auto] [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:calc(45_*_var(--industry-unit))] [.solutions-detail-page_&_h2]:[margin-top:0] [.solutions-detail-page_&_h2]:[margin-right:0] [.solutions-detail-page_&_h2]:[margin-bottom:0] [.solutions-detail-page_&_h2]:[margin-left:0] [.solutions-detail-page_&_h2]:[color:#0d5792]! [.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h2]:[font-weight:410]! [.solutions-detail-page_&_h2]:[line-height:1]! [.solutions-detail-page_&_p]:[margin-top:0] [.solutions-detail-page_&_p]:[margin-right:0] [.solutions-detail-page_&_p]:[margin-bottom:0] [.solutions-detail-page_&_p]:[margin-left:0] [.solutions-detail-page_&_p]:[color:#1d2049]! [.solutions-detail-page_&_p]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_p]:[line-height:1]! [.solutions-detail-page_&_p]:[letter-spacing:0] max-xl:[.solutions-detail-page_&]:[grid-template-columns:minmax(0,_1.2fr)_minmax(0,_1fr)] max-xl:[.solutions-detail-page_&]:[gap:28px] max-xl:[.solutions-detail-page_&_h2]:[font-size:clamp(32px,_4.1vw,_50px)]! max-xl:[.solutions-detail-page_&_p]:[line-height:1.2]! max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:22px] max-md:[.solutions-detail-page_&]:[padding-left:32px] max-md:[.solutions-detail-page_&]:[padding-right:32px] max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(27px,_7.2vw,_42px)]! max-md:[.solutions-detail-page_&_p]:[text-align:justify] max-md:[.solutions-detail-page_&_p]:[font-size:15px]! max-md:[.solutions-detail-page_&_p]:[line-height:1.07]!">
          <motion.h2
            id="infrastructure-pump-title"
            {...reveal("left", 0.03, reduced, 0.22)}
          >
            Our Pump Solutions
            <br />
            for Infrastructure
          </motion.h2>
          <motion.p {...reveal("right", 0.12, reduced, 0.22)}>
            Discover the most efficient pumping solution in seconds. Simply
            enter your technical parameters such as flow rate, pressure, and
            fluid type, and let our advanced configurator select the ideal Sempa
            pump for your specific industry needs.
          </motion.p>
          <SolutionSliderArrows
            slider={slider}
            label="pump"
            controls="infrastructure-pump-slider"
          />
        </div>
        <div
          ref={viewportRef}
          id="infrastructure-pump-slider"
          data-dragging={slider.isDragging}
          className="left-1/2 mx-0! w-screen! max-w-none -translate-x-1/2 cursor-grab select-none data-[dragging=true]:cursor-grabbing [&_*]:cursor-inherit [&_*]:select-none [&_img]:[-webkit-user-drag:none] solution-slider-viewport infrastructure-pump-viewport [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[touch-action:pan-y] [.solutions-detail-page_&]:[margin-top:calc(45_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[margin-top:48px]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Pump solutions for infrastructure"
          {...slider.pointerHandlers}
        >
          <ol
            ref={trackRef}
            className="solution-slider-track infrastructure-pump-track [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:stretch] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&]:[transition:transform_450ms_ease-in-out] [.solutions-detail-page_&]:[gap:calc(14_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[gap:12px]"
            style={{ transform: `translateX(${-slider.offset}px)` }}
          >
            {infrastructurePumpSlides.map((pump, index) => (
              <motion.li
                {...reveal("up", Math.min(index, 5) * 0.04, reduced, 0.12)}
                key={pump.id}
                className="infrastructure-pump-card [.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[flex:0_0_calc(136.28_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(136.28_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(20.44_*_var(--industry-unit))] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[background:#fff] [.solutions-detail-page_&_img]:[object-fit:contain] [.solutions-detail-page_&_img]:[padding-top:calc(10_*_var(--industry-unit))] [.solutions-detail-page_&_img]:[padding-right:calc(10_*_var(--industry-unit))] [.solutions-detail-page_&_img]:[padding-bottom:calc(10_*_var(--industry-unit))] [.solutions-detail-page_&_img]:[padding-left:calc(10_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[flex-basis:34.5vw] max-md:[.solutions-detail-page_&]:[height:34.5vw] max-md:[.solutions-detail-page_&]:[border-radius:20px]"
                aria-hidden={!slider.visible(index)}
              >
                <Image
                  src={pump.image}
                  alt={pump.alt}
                  fill
                  sizes="(min-width: 1280px) 10vw, 136px"
                  draggable={false}
                />
              </motion.li>
            ))}
          </ol>
          <SolutionSliderEdgeBlur />
        </div>
      </div>
    </section>
  );
}
// Standard Tailwind breakpoints keep the complete hero fitted to the viewport.
const solutionsResponsive = [
  "lg:[&_.industry-hero]:[--industry-unit:min(.0694444444vw,_.1svh,_1.777778px)]!",
  "lg:[&_.industry-hero]:[height:100svh]!",
  "lg:[&_.industry-hero]:[min-height:620px]!",
  "lg:[&_.industry-hero]:[padding-top:24px]!",
  "lg:[&_.industry-hero]:[padding-bottom:12px]!",
  "lg:[&_.industry-hero]:[display:flex]!",
  "lg:[&_.industry-hero]:[flex-direction:column]!",
  "lg:[&_.industry-hero]:[align-items:center]!",
  "lg:[&_.industry-hero_>_[data-header-spacer]]:[flex:0_0_var(--site-header-height,_97px)]!",
  "lg:[&_.industry-hero_>_[data-header-spacer]]:[width:100%]!",
  "lg:[&_.industry-hero-heading]:[flex:0_0_auto]!",
  "lg:[&_.industry-hero-heading]:[width:100%]!",
  "lg:[&_.industry-hero-heading_>_p]:[margin-top:22px]!",
  "lg:[&_.industry-hero-heading_>_p]:[line-height:1.2]!",
  "lg:[&_.industry-illustration]:[flex:1_1_0]!",
  "lg:[&_.industry-illustration]:[min-height:0]!",
  "lg:[&_.industry-illustration]:[width:100%]!",
  "lg:[&_.industry-illustration]:[max-width:none]!",
  "lg:[&_.industry-illustration]:[margin-top:18px]!",
  "lg:[&_.industry-illustration]:[display:flex]!",
  "lg:[&_.industry-illustration]:[justify-content:center]!",
  "lg:[&_.industry-illustration]:[align-items:center]!",
  "lg:[&_.industry-artwork]:[height:100%]!",
  "lg:[&_.industry-artwork]:[width:auto]!",
  "lg:[&_.industry-artwork]:[max-width:100%]!",
  "lg:[&_.industry-artwork]:[aspect-ratio:1376_/_768]!",
  "lg:[&_.industry-artwork]:[flex:0_1_auto]!",
  "max-lg:[&_.consultation-form]:[width:94%]!",
  "max-lg:[&_.consultation-form]:[--industry-unit:1px]!",
  "max-md:[&_.consultation-form]:[width:100%]!",
  "max-md:[&_.consultation-banner]:[width:100%]!",
  "max-md:[&_.consultation-banner]:[min-height:0]!",
  "max-md:[&_.other-solution-card]:[flex-basis:min(292px,_calc(100vw_-_56px))]!",
  "motion-reduce:[&_.infrastructure-pump-track]:[transition:none]!",
].join(" ");

export default function SolutionDetailsPage() {
  const reduced = useReducedMotion() ?? false;
  return (
    <main
      data-header-underlay
      className={`${solutionsResponsive} -mt-[var(--site-header-height,97px)] solutions-detail-page overflow-x-clip font-sans [--industry-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [width:100%] [background:radial-gradient(ellipse_at_28%_65%,_#acd5ff24,_transparent_62%),_radial-gradient(ellipse_at_48%_90%,_#c5e5ff33,_transparent_65%),_linear-gradient(105deg,_#d2e8ff_0%,_#dceeff_28%,_#ebf5ff_56%,_#fafcff_84%,_#fff_100%)] [letter-spacing:-0.04em] [body:has(&)_>_.site-header]:[background:#fff] [&_button:focus-visible]:[outline:2px_solid_#005eff] [&_button:focus-visible]:[outline-offset:3px] [&_a:focus-visible]:[outline:2px_solid_#005eff] [&_a:focus-visible]:[outline-offset:3px] max-xl:[--industry-unit:1px] motion-reduce:[&_*]:[transition:none]! motion-reduce:[&_*]:[animation:none]! [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]`}
    >
      <SolutionDetailsHero />
      <IndustryCarousel />
      <EngineeringConsultationSection />
      <OtherSolutionsHeading />
      <InfrastructurePumpSolutions />
      <motion.div
        {...reveal("up", 0.03, reduced, 0.12)}
        className="solution-newsletter [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-top:0] max-md:[.solutions-detail-page_&]:[padding-right:20px] max-md:[.solutions-detail-page_&]:[padding-bottom:80px] max-md:[.solutions-detail-page_&]:[padding-left:20px]"
      >
        <NewsletterSubscription scaled requireValidInput />
      </motion.div>
      <style jsx global>{`
        /* Keep the complete map and its heading within the initial desktop viewport. */

        .solutions-detail-page .industry-card-title {
          max-width: 100%;
          overflow-wrap: anywhere;
          text-wrap: balance;
        }
        .solutions-detail-page
          .industry-carousel-item--active
          .industry-card.industry-card {
          width: min(100%, calc(200 * var(--industry-unit)));
          padding-inline: calc(16 * var(--industry-unit));
        }
        .solutions-detail-page
          .industry-carousel-item--active
          .industry-card-title.industry-card-title {
          font-size: calc(20 * var(--industry-unit)) !important;
          line-height: 1.12 !important;
        }
        .solutions-detail-page .consultation-banner {
          width: 92%;
          margin-inline: auto;
          min-height: calc(350 * var(--industry-unit));
        }
        .solutions-detail-page .consultation-banner-image {
          object-fit: cover;
          object-position: right center;
        }
        .solutions-detail-page .consultation-banner-copy {
          padding-block: calc(42 * var(--industry-unit));
        }
        .solutions-detail-page .consultation-form {
          --industry-unit: clamp(0.85px, 0.06vw, 1.25px);
          width: 88%;
          max-width: 1200px;
          margin-inline: auto;
          margin-top: 56px;
        }
        .solutions-detail-page .consultation-form-footer {
          flex-direction: column;
          justify-content: center;
          gap: 30px;
          padding-top: 12px;
        }
        .solutions-detail-page .consultation-consent {
          justify-content: center;
        }
        .solutions-detail-page .consultation-feedback {
          text-align: center;
        }
        .solutions-detail-page .other-solutions-section {
          padding-inline: 0;
          overflow: hidden;
        }
        .solutions-detail-page .other-solutions-inner {
          max-width: none;
        }
        .solutions-detail-page .other-solutions-viewport {
          width: calc(
            100% - max(24px, (100% - 1200 * var(--industry-unit)) / 2)
          );
          max-width: none;
          margin-left: max(
            24px,
            calc((100% - 1200 * var(--industry-unit)) / 2)
          );
          margin-right: 0;
          margin-top: calc(60 * var(--industry-unit));
        }
        .solutions-detail-page
          .other-solutions-viewport
          .solution-slider-edge-blur {
          width: 30%;
        }
        .solutions-detail-page .other-solutions-track {
          gap: calc(18 * var(--industry-unit));
        }
        .solutions-detail-page .other-solution-card {
          flex-basis: calc(292 * var(--industry-unit));
        }
        .solutions-detail-page .infrastructure-pump-track {
          transition: transform 850ms cubic-bezier(0.22, 0.75, 0.25, 1);
        }
      `}</style>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.
const twsolutionsdetailPageRules: Record<string, string> = {
  "engineering-consultation":
    "[.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-left:20px] max-md:[.solutions-detail-page_&]:[padding-right:20px]",
  "consultation-inner":
    "[.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto]",
  "consultation-banner":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[isolation:isolate] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[min-height:calc(401_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:linear-gradient(110deg,_#0657ce_0%,_#006eff_46%,_#051a44_100%)] max-md:[.solutions-detail-page_&]:[display:flex]! max-md:[.solutions-detail-page_&]:[flex-direction:column] max-md:[.solutions-detail-page_&]:[min-height:0]",
  "consultation-banner-image":
    "[.solutions-detail-page_&]:[object-fit:cover] [.solutions-detail-page_&]:[z-index:-1] max-md:[.solutions-detail-page_&]:[position:relative]! max-md:[.solutions-detail-page_&]:[top:auto]! max-md:[.solutions-detail-page_&]:[right:auto]! max-md:[.solutions-detail-page_&]:[bottom:auto]! max-md:[.solutions-detail-page_&]:[left:auto]! max-md:[.solutions-detail-page_&]:[order:1] max-md:[.solutions-detail-page_&]:[width:100%]! max-md:[.solutions-detail-page_&]:[height:auto]! max-md:[.solutions-detail-page_&]:[aspect-ratio:4096_/_1482] max-md:[.solutions-detail-page_&]:[object-fit:contain] max-md:[.solutions-detail-page_&]:[z-index:0]",
  "consultation-banner-waves":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[top:0] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:0] [.solutions-detail-page_&]:[z-index:-1] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[height:100%] [.solutions-detail-page_&]:[pointer-events:none]",
  "consultation-banner-copy":
    "[.solutions-detail-page_&]:[width:52%] [.solutions-detail-page_&]:[padding-top:calc(60_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:calc(67_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-bottom:calc(60_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:calc(67_*_var(--industry-unit))] [.solutions-detail-page_&]:[color:#f7f7f7]! [.solutions-detail-page_&_h2]:[margin-top:0] [.solutions-detail-page_&_h2]:[margin-right:0] [.solutions-detail-page_&_h2]:[margin-bottom:0] [.solutions-detail-page_&_h2]:[margin-left:0] [.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h2]:[font-weight:410]! [.solutions-detail-page_&_h2]:[line-height:1]! [.solutions-detail-page_&_p]:[margin-top:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&_p]:[margin-right:0] [.solutions-detail-page_&_p]:[margin-bottom:0] [.solutions-detail-page_&_p]:[margin-left:0] [.solutions-detail-page_&_p]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_p]:[line-height:1]! max-xl:[.solutions-detail-page_&]:[width:65%] max-xl:[.solutions-detail-page_&]:[padding-left:40px] max-xl:[.solutions-detail-page_&]:[padding-right:40px] max-xl:[.solutions-detail-page_&_h2]:[font-size:42px]! max-xl:[.solutions-detail-page_&_p]:[line-height:1.2]! max-md:[.solutions-detail-page_&]:[display:contents]! max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(30px,_8vw,_42px)]! max-md:[.solutions-detail-page_&_h2]:[order:0] max-md:[.solutions-detail-page_&_h2]:[margin-top:26px] max-md:[.solutions-detail-page_&_h2]:[margin-right:24px] max-md:[.solutions-detail-page_&_h2]:[margin-bottom:20px] max-md:[.solutions-detail-page_&_h2]:[margin-left:24px] max-md:[.solutions-detail-page_&_p]:[order:2] max-md:[.solutions-detail-page_&_p]:[margin-top:20px] max-md:[.solutions-detail-page_&_p]:[margin-right:24px] max-md:[.solutions-detail-page_&_p]:[margin-bottom:26px] max-md:[.solutions-detail-page_&_p]:[margin-left:24px] max-md:[.solutions-detail-page_&_p]:[font-size:13px]! max-md:[.solutions-detail-page_&_p]:[line-height:1.2]!",
  "consultation-form":
    "[.solutions-detail-page_&]:[margin-top:calc(75_*_var(--industry-unit))] [.solutions-detail-page_&_fieldset]:[min-width:0] [.solutions-detail-page_&_fieldset]:[margin-top:0] [.solutions-detail-page_&_fieldset]:[margin-right:0] [.solutions-detail-page_&_fieldset]:[margin-bottom:calc(48_*_var(--industry-unit))] [.solutions-detail-page_&_fieldset]:[margin-left:0] [.solutions-detail-page_&_fieldset]:[padding-top:0] [.solutions-detail-page_&_fieldset]:[padding-right:0] [.solutions-detail-page_&_fieldset]:[padding-bottom:0] [.solutions-detail-page_&_fieldset]:[padding-left:0] [.solutions-detail-page_&_fieldset]:[border:0] [.solutions-detail-page_&_legend]:[margin-bottom:calc(27_*_var(--industry-unit))] [.solutions-detail-page_&_legend]:[padding-top:0] [.solutions-detail-page_&_legend]:[padding-right:0] [.solutions-detail-page_&_legend]:[padding-bottom:0] [.solutions-detail-page_&_legend]:[padding-left:0] [.solutions-detail-page_&_legend]:[font-size:calc(25_*_var(--industry-unit))]! [.solutions-detail-page_&_legend]:[font-weight:540]! [.solutions-detail-page_&_legend]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.solutions-detail-page_&_legend]:[line-height:1.12]! [.solutions-detail-page_&_legend]:[color:#005eff]! max-md:[.solutions-detail-page_&]:[margin-top:48px] max-md:[.solutions-detail-page_&_fieldset]:[margin-bottom:32px] max-md:[.solutions-detail-page_&_legend]:[margin-bottom:18px] max-md:[.solutions-detail-page_&_legend]:[font-size:clamp(20px,_5.4vw,_25px)]!",
  "consultation-input-grid":
    "[.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.solutions-detail-page_&]:[gap:calc(23_*_var(--industry-unit))_calc(37_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:10px]",
  "consultation-details-grid":
    "[.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.solutions-detail-page_&]:[gap:calc(23_*_var(--industry-unit))_calc(37_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:10px]",
  "consultation-field":
    "[.solutions-detail-page_&]:[min-width:0] [.solutions-detail-page_&_input]:[display:block]! [.solutions-detail-page_&_input]:[width:100%] [.solutions-detail-page_&_input]:[height:calc(45_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[min-height:44px] [.solutions-detail-page_&_input]:[padding-top:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-bottom:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[border:1px_solid_transparent] [.solutions-detail-page_&_input]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[background:#f7f7f7] [.solutions-detail-page_&_input]:[color:#334155]! [.solutions-detail-page_&_input]:[font-style:inherit] [.solutions-detail-page_&_input]:[font-variant:inherit] [.solutions-detail-page_&_input]:[font-weight:inherit]! [.solutions-detail-page_&_input]:[font-stretch:inherit]! [.solutions-detail-page_&_input]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_input]:[line-height:1.07]! [.solutions-detail-page_&_input]:[font-family:inherit]! [.solutions-detail-page_&_input]:[font-feature-settings:inherit] [.solutions-detail-page_&_input]:[font-variation-settings:inherit]! [.solutions-detail-page_&_textarea]:[display:block]! [.solutions-detail-page_&_textarea]:[width:100%] [.solutions-detail-page_&_textarea]:[height:calc(188_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[min-height:44px] [.solutions-detail-page_&_textarea]:[padding-top:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-bottom:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[border:1px_solid_transparent] [.solutions-detail-page_&_textarea]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&_textarea]:[background:#f7f7f7] [.solutions-detail-page_&_textarea]:[color:#334155]! [.solutions-detail-page_&_textarea]:[font-style:inherit] [.solutions-detail-page_&_textarea]:[font-variant:inherit] [.solutions-detail-page_&_textarea]:[font-weight:inherit]! [.solutions-detail-page_&_textarea]:[font-stretch:inherit]! [.solutions-detail-page_&_textarea]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_textarea]:[line-height:1.07]! [.solutions-detail-page_&_textarea]:[font-family:inherit]! [.solutions-detail-page_&_textarea]:[font-feature-settings:inherit] [.solutions-detail-page_&_textarea]:[font-variation-settings:inherit]! [.solutions-detail-page_&_input::placeholder]:[color:#9eb7d0]! [.solutions-detail-page_&_input::placeholder]:[opacity:1] [.solutions-detail-page_&_textarea::placeholder]:[color:#9eb7d0]! [.solutions-detail-page_&_textarea::placeholder]:[opacity:1] [.solutions-detail-page_&_textarea]:[resize:vertical] [.solutions-detail-page_&_input:focus]:[outline:none] [.solutions-detail-page_&_input:focus]:[border-color:#005eff] [.solutions-detail-page_&_input:focus]:[box-shadow:0_0_0_2px_#005eff12] [.solutions-detail-page_&_textarea:focus]:[outline:none] [.solutions-detail-page_&_textarea:focus]:[border-color:#005eff] [.solutions-detail-page_&_textarea:focus]:[box-shadow:0_0_0_2px_#005eff12] max-md:[.solutions-detail-page_&[data-field='phone']]:[order:2] max-md:[.solutions-detail-page_&[data-field='email']]:[order:3] max-md:[.solutions-detail-page_&_input]:[padding-left:22px] max-md:[.solutions-detail-page_&_input]:[padding-right:22px] max-md:[.solutions-detail-page_&_textarea]:[padding-left:22px] max-md:[.solutions-detail-page_&_textarea]:[padding-right:22px] max-md:[.solutions-detail-page_&_textarea]:[height:188px] max-md:[.solutions-detail-page_&_textarea]:[resize:vertical]",
  "consultation-upload-field": "[.solutions-detail-page_&]:[min-width:0]",
  "consultation-upload":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[flex-direction:column] [.solutions-detail-page_&]:[gap:12px] [.solutions-detail-page_&]:[height:calc(188_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-bottom:calc(23_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:calc(37_*_var(--industry-unit))] [.solutions-detail-page_&]:[border:1px_solid_transparent] [.solutions-detail-page_&]:[border-radius:calc(8_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:#f7f7f7] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[cursor:pointer] [.solutions-detail-page_&[data-dragging='true']]:[border-color:#005eff] [.solutions-detail-page_&[data-dragging='true']]:[background:#eff6ff] [.solutions-detail-page_&:focus-visible]:[outline:2px_solid_#005eff] [.solutions-detail-page_&:focus-visible]:[outline-offset:3px] max-md:[.solutions-detail-page_&]:[height:188px] max-md:[.solutions-detail-page_&]:[padding-top:23px] max-md:[.solutions-detail-page_&]:[padding-right:18px] max-md:[.solutions-detail-page_&]:[padding-bottom:23px] max-md:[.solutions-detail-page_&]:[padding-left:18px] max-md:[.solutions-detail-page_&]:[align-items:center] max-md:[.solutions-detail-page_&]:[gap:14px]",
  "consultation-upload-title":
    "[.solutions-detail-page_&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.07]! max-md:[.solutions-detail-page_&]:[text-align:center]",
  "consultation-upload-symbol":
    "[.solutions-detail-page_&]:[display:none]! max-md:[.solutions-detail-page_&]:[display:grid]! max-md:[.solutions-detail-page_&]:[place-items:center] max-md:[.solutions-detail-page_&]:[flex-shrink:0] max-md:[.solutions-detail-page_&]:[width:48px] max-md:[.solutions-detail-page_&]:[height:48px] max-md:[.solutions-detail-page_&]:[border-radius:50%] max-md:[.solutions-detail-page_&]:[background:#e2e8f0] max-md:[.solutions-detail-page_&]:[color:#475569]! max-md:[.solutions-detail-page_&_svg]:[width:24px] max-md:[.solutions-detail-page_&_svg]:[height:24px]",
  "consultation-file-list":
    "[.solutions-detail-page_&]:[flex:1] [.solutions-detail-page_&]:[overflow-y:auto] [.solutions-detail-page_&]:[min-height:0] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&_li]:[display:flex]! [.solutions-detail-page_&_li]:[align-items:center] [.solutions-detail-page_&_li]:[gap:8px] [.solutions-detail-page_&_li]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&_li]:[color:#334155]! [.solutions-detail-page_&_li_>_span]:[flex:1] [.solutions-detail-page_&_li_>_span]:[min-width:0] [.solutions-detail-page_&_li_>_span]:[overflow-wrap:anywhere] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[flex-shrink:0] [.solutions-detail-page_&_button]:[width:28px] [.solutions-detail-page_&_button]:[height:28px] [.solutions-detail-page_&_button]:[padding-top:0] [.solutions-detail-page_&_button]:[padding-right:0] [.solutions-detail-page_&_button]:[padding-bottom:0] [.solutions-detail-page_&_button]:[padding-left:0] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#9eb7d0]! [.solutions-detail-page_&_button]:[cursor:pointer] max-md:[.solutions-detail-page_&]:[width:100%]",
  "consultation-file-icons":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[gap:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&_svg]:[width:calc(14_*_var(--industry-unit))] [.solutions-detail-page_&_svg]:[height:calc(14_*_var(--industry-unit))] [.solutions-detail-page_&_svg]:[stroke-width:1.4] max-md:[.solutions-detail-page_&]:[justify-content:center] max-md:[.solutions-detail-page_&]:[gap:6px] max-md:[.solutions-detail-page_&_svg]:[width:22px] max-md:[.solutions-detail-page_&_svg]:[height:22px]",
  "consultation-upload-error":
    "[.solutions-detail-page_&]:[margin-top:8px] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[color:#9b3131]! [.solutions-detail-page_&]:[font-size:12px]! [.solutions-detail-page_&]:[line-height:1.2]! [.solutions-detail-page_&:empty]:[display:none]!",
  "consultation-form-footer":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[justify-content:space-between] [.solutions-detail-page_&]:[gap:24px] max-md:[.solutions-detail-page_&]:[align-items:center] max-md:[.solutions-detail-page_&]:[flex-direction:column] max-md:[.solutions-detail-page_&]:[gap:18px]",
  "consultation-consent":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.07]! [.solutions-detail-page_&]:[letter-spacing:0] [.solutions-detail-page_&]:[color:#000]! [.solutions-detail-page_&]:[cursor:pointer] max-md:[.solutions-detail-page_&]:[width:100%] max-md:[.solutions-detail-page_&]:[align-items:flex-start] max-md:[.solutions-detail-page_&]:[gap:20px] max-md:[.solutions-detail-page_&_>_span:last-child]:[flex:1] max-md:[.solutions-detail-page_&_>_span:last-child]:[text-align:center] max-md:[.solutions-detail-page_&_>_span:last-child]:[line-height:1.2]!",
  "consultation-checkbox":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[flex-shrink:0] [.solutions-detail-page_&]:[width:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[appearance:none] [.solutions-detail-page_&_input]:[display:block]! [.solutions-detail-page_&_input]:[width:100%] [.solutions-detail-page_&_input]:[height:100%] [.solutions-detail-page_&_input]:[margin-top:0] [.solutions-detail-page_&_input]:[margin-right:0] [.solutions-detail-page_&_input]:[margin-bottom:0] [.solutions-detail-page_&_input]:[margin-left:0] [.solutions-detail-page_&_input]:[border:0] [.solutions-detail-page_&_input]:[border-radius:calc(3_*_var(--industry-unit))] [.solutions-detail-page_&_input]:[background:#d9d9d9] [.solutions-detail-page_&_input]:[cursor:pointer] [.solutions-detail-page_&_input:checked]:[background:#005eff] [.solutions-detail-page_&_svg]:[position:absolute] [.solutions-detail-page_&_svg]:[top:10%] [.solutions-detail-page_&_svg]:[right:10%] [.solutions-detail-page_&_svg]:[bottom:10%] [.solutions-detail-page_&_svg]:[left:10%] [.solutions-detail-page_&_svg]:[width:80%] [.solutions-detail-page_&_svg]:[height:80%] [.solutions-detail-page_&_svg]:[color:#fff]! [.solutions-detail-page_&_svg]:[opacity:0] [.solutions-detail-page_&_svg]:[pointer-events:none] [.solutions-detail-page_&_input:checked_+_svg]:[opacity:1] [.solutions-detail-page_&_input:focus-visible]:[outline:2px_solid_#005eff] [.solutions-detail-page_&_input:focus-visible]:[outline-offset:3px]",
  "consultation-send":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[flex-shrink:0] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[width:calc(141_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(43_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[border:1px_solid_#c8d7e5] [.solutions-detail-page_&]:[border-radius:999px] [.solutions-detail-page_&]:[background:linear-gradient(#fff,_#f6f9fc)] [.solutions-detail-page_&]:[color:#27272a]! [.solutions-detail-page_&]:[font-style:inherit] [.solutions-detail-page_&]:[font-variant:inherit] [.solutions-detail-page_&]:[font-weight:inherit]! [.solutions-detail-page_&]:[font-stretch:inherit]! [.solutions-detail-page_&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:inherit]! [.solutions-detail-page_&]:[font-family:inherit]! [.solutions-detail-page_&]:[font-feature-settings:inherit] [.solutions-detail-page_&]:[font-variation-settings:inherit]! [.solutions-detail-page_&]:[cursor:pointer] max-md:[.solutions-detail-page_&]:[align-self:center] max-md:[.solutions-detail-page_&]:[min-height:44px]",
  "consultation-send-label":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[z-index:2] [.solutions-detail-page_&]:[margin-left:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&]:[transition:transform_650ms_cubic-bezier(0.22,_1,_0.36,_1)] [.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&]:[transform:translateX(calc(37_*_var(--industry-unit)))]",
  "consultation-send-orb":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[z-index:3] [.solutions-detail-page_&]:[top:50%] [.solutions-detail-page_&]:[left:calc(100%_-_37_*_var(--industry-unit))] [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[transform:translateY(-50%)] [.solutions-detail-page_&]:[width:calc(31_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(31_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[background:linear-gradient(135deg,_#005eff,_#001ea2)] [.solutions-detail-page_&]:[box-shadow:0_0_12px_#005eff61] [.solutions-detail-page_&]:[transition:left_650ms_cubic-bezier(0.22,_1,_0.36,_1)] [.solutions-detail-page_&_svg]:[width:68%] [.solutions-detail-page_&_svg]:[height:68%] [.solutions-detail-page_&_svg]:[color:#fff]! [.solutions-detail-page_&_svg]:[opacity:0] [.solutions-detail-page_&_svg]:[transform:scale(.78)] [.solutions-detail-page_&_svg]:[transition:opacity_350ms_ease,_transform_350ms_ease] [.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&]:[left:calc(6_*_var(--industry-unit))] [.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&_svg]:[opacity:1] [.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&_svg]:[transform:scale(1)]",
  "consultation-feedback":
    "[.solutions-detail-page_&]:[min-height:20px] [.solutions-detail-page_&]:[margin-top:16px] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&]:[color:#0d5792]!",
  "other-solutions-section":
    "[.solutions-detail-page_&]:[padding-top:calc(90_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-top:64px] max-md:[.solutions-detail-page_&]:[padding-right:20px] max-md:[.solutions-detail-page_&]:[padding-bottom:80px] max-md:[.solutions-detail-page_&]:[padding-left:20px]",
  "other-solutions-inner":
    "[.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&_h2]:[margin-top:0] [.solutions-detail-page_&_h2]:[margin-right:0] [.solutions-detail-page_&_h2]:[margin-bottom:0] [.solutions-detail-page_&_h2]:[margin-left:0] [.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h2]:[font-weight:410]! [.solutions-detail-page_&_h2]:[line-height:1]! [.solutions-detail-page_&_h2]:[color:#0d5792]! [.solutions-detail-page_&_h2]:[text-align:center] max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(30px,_8vw,_42px)]!",
  "solution-slider-navigation":
    "[.solutions-detail-page_.other-solutions-inner_>_&]:[justify-content:center] [.solutions-detail-page_.other-solutions-inner_>_&]:[margin-top:calc(25_*_var(--industry-unit))] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[gap:calc(18_*_var(--industry-unit))] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[flex-shrink:0] [.solutions-detail-page_&_button]:[width:max(32px,_calc(32_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[height:max(32px,_calc(32_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[padding-top:0] [.solutions-detail-page_&_button]:[padding-right:0] [.solutions-detail-page_&_button]:[padding-bottom:0] [.solutions-detail-page_&_button]:[padding-left:0] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#9eb7d0]! [.solutions-detail-page_&_button]:[cursor:pointer] [.solutions-detail-page_&_button:hover:not(:disabled)]:[color:#0d5792]! [.solutions-detail-page_&_button:disabled]:[opacity:0.35] [.solutions-detail-page_&_button:disabled]:[cursor:default] [.solutions-detail-page_&_svg]:[width:75%] [.solutions-detail-page_&_svg]:[height:75%] max-xl:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[grid-column:1_/_-1] max-xl:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[justify-content:flex-end] max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[justify-content:center] max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[margin-top:22px] max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[gap:18px] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_button]:[width:32px] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_button]:[height:32px] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_svg]:[width:100%] max-md:[.solutions-detail-page_.infrastructure-pump-header_&_svg]:[height:100%]",
  "solution-slider-viewport":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[touch-action:pan-y]",
  "solution-slider-track":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:stretch] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&]:[transition:transform_450ms_ease-in-out]",
  "other-solutions-viewport":
    "[.solutions-detail-page_&]:[max-width:calc(1040_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-top:calc(40_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:auto]",
  "other-solutions-track":
    "[.solutions-detail-page_&]:[gap:calc(19_*_var(--industry-unit))]",
  "other-solution-card":
    "[.solutions-detail-page_&]:[flex:0_0_calc(292_*_var(--industry-unit))] [.solutions-detail-page_&]:[min-width:0] [.solutions-detail-page_&]:[min-height:calc(375_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:calc(17_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-bottom:calc(12_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:calc(17_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(15_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:#f7f7f7] [.solutions-detail-page_&_h3]:[margin-top:calc(25_*_var(--industry-unit))] [.solutions-detail-page_&_h3]:[margin-right:0] [.solutions-detail-page_&_h3]:[margin-bottom:0] [.solutions-detail-page_&_h3]:[margin-left:0] [.solutions-detail-page_&_h3]:[color:#000]! [.solutions-detail-page_&_h3]:[font-size:calc(20_*_var(--industry-unit))]! [.solutions-detail-page_&_h3]:[font-weight:410]! [.solutions-detail-page_&_h3]:[line-height:1.07]! [.solutions-detail-page_&_h3]:[text-align:center] [.solutions-detail-page_&_h3_span]:[display:block]! max-md:[.solutions-detail-page_&]:[flex-basis:min(292px,_calc(100vw_-_56px))]",
  "other-solution-image":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[height:calc(240_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(17_*_var(--industry-unit))] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&_img]:[object-fit:cover]",
  "solution-slider-edge-blur":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[z-index:2] [.solutions-detail-page_&]:[top:0] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:auto] [.solutions-detail-page_&]:[width:min(24%,_calc(220_*_var(--industry-unit)))] [.solutions-detail-page_&]:[pointer-events:none] [.solutions-detail-page_&_span]:[position:absolute] [.solutions-detail-page_&_span]:[top:0] [.solutions-detail-page_&_span]:[right:0] [.solutions-detail-page_&_span]:[bottom:0] [.solutions-detail-page_&_span]:[left:0] [.solutions-detail-page_&_span:last-child]:[background:linear-gradient(90deg,_transparent,_#fafcff55)] max-md:[.solutions-detail-page_&]:[width:min(18%,_65px)] max-md:[.solutions-detail-page_.infrastructure-pump-viewport_&]:[display:none]!",
  "infrastructure-pump-solutions":
    "[.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-top:0] max-md:[.solutions-detail-page_&]:[padding-right:0] max-md:[.solutions-detail-page_&]:[padding-bottom:80px] max-md:[.solutions-detail-page_&]:[padding-left:0]",
  "infrastructure-pump-inner":
    "[.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto]",
  "infrastructure-pump-header":
    "[.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:minmax(0,_539fr)_minmax(0,_449fr)_auto] [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:calc(45_*_var(--industry-unit))] [.solutions-detail-page_&_h2]:[margin-top:0] [.solutions-detail-page_&_h2]:[margin-right:0] [.solutions-detail-page_&_h2]:[margin-bottom:0] [.solutions-detail-page_&_h2]:[margin-left:0] [.solutions-detail-page_&_h2]:[color:#0d5792]! [.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h2]:[font-weight:410]! [.solutions-detail-page_&_h2]:[line-height:1]! [.solutions-detail-page_&_p]:[margin-top:0] [.solutions-detail-page_&_p]:[margin-right:0] [.solutions-detail-page_&_p]:[margin-bottom:0] [.solutions-detail-page_&_p]:[margin-left:0] [.solutions-detail-page_&_p]:[color:#1d2049]! [.solutions-detail-page_&_p]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_p]:[line-height:1]! [.solutions-detail-page_&_p]:[letter-spacing:0] max-xl:[.solutions-detail-page_&]:[grid-template-columns:minmax(0,_1.2fr)_minmax(0,_1fr)] max-xl:[.solutions-detail-page_&]:[gap:28px] max-xl:[.solutions-detail-page_&_h2]:[font-size:clamp(32px,_4.1vw,_50px)]! max-xl:[.solutions-detail-page_&_p]:[line-height:1.2]! max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr] max-md:[.solutions-detail-page_&]:[gap:22px] max-md:[.solutions-detail-page_&]:[padding-left:32px] max-md:[.solutions-detail-page_&]:[padding-right:32px] max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(27px,_7.2vw,_42px)]! max-md:[.solutions-detail-page_&_p]:[text-align:justify] max-md:[.solutions-detail-page_&_p]:[font-size:15px]! max-md:[.solutions-detail-page_&_p]:[line-height:1.07]!",
  "infrastructure-pump-viewport":
    "[.solutions-detail-page_&]:[margin-top:calc(45_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[margin-top:48px]",
  "infrastructure-pump-track":
    "[.solutions-detail-page_&]:[gap:calc(14_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[gap:12px]",
  "infrastructure-pump-card":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[flex:0_0_calc(136.28_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(136.28_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:calc(20.44_*_var(--industry-unit))] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[background:#fff] [.solutions-detail-page_&_img]:[object-fit:contain] [.solutions-detail-page_&_img]:[padding-top:calc(10_*_var(--industry-unit))] [.solutions-detail-page_&_img]:[padding-right:calc(10_*_var(--industry-unit))] [.solutions-detail-page_&_img]:[padding-bottom:calc(10_*_var(--industry-unit))] [.solutions-detail-page_&_img]:[padding-left:calc(10_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[flex-basis:34.5vw] max-md:[.solutions-detail-page_&]:[height:34.5vw] max-md:[.solutions-detail-page_&]:[border-radius:20px]",
  "solutions-detail-page":
    "[--industry-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [width:100%] [background:radial-gradient(ellipse_at_28%_65%,_#acd5ff24,_transparent_62%),_radial-gradient(ellipse_at_48%_90%,_#c5e5ff33,_transparent_65%),_linear-gradient(105deg,_#d2e8ff_0%,_#dceeff_28%,_#ebf5ff_56%,_#fafcff_84%,_#fff_100%)] [letter-spacing:-0.04em] [body:has(&)_>_.site-header]:[background:#fff] [&_button:focus-visible]:[outline:2px_solid_#005eff] [&_button:focus-visible]:[outline-offset:3px] [&_a:focus-visible]:[outline:2px_solid_#005eff] [&_a:focus-visible]:[outline-offset:3px] max-xl:[--industry-unit:1px] motion-reduce:[&_*]:[transition:none]! motion-reduce:[&_*]:[animation:none]!",
  "solution-newsletter":
    "[.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-top:0] max-md:[.solutions-detail-page_&]:[padding-right:20px] max-md:[.solutions-detail-page_&]:[padding-bottom:80px] max-md:[.solutions-detail-page_&]:[padding-left:20px]",
  "industry-hero":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[isolation:isolate] [.solutions-detail-page_&]:[padding-top:calc(80_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:24px] [.solutions-detail-page_&::before]:[content:''] [.solutions-detail-page_&::before]:[position:absolute] [.solutions-detail-page_&::before]:[top:0] [.solutions-detail-page_&::before]:[right:0] [.solutions-detail-page_&::before]:[bottom:0] [.solutions-detail-page_&::before]:[left:0] [.solutions-detail-page_&::before]:[z-index:-1] [.solutions-detail-page_&::before]:[pointer-events:none] [.solutions-detail-page_&::before]:[background:radial-gradient(ellipse_at_50%_65%,_#f0f3f7_0%,_#fafbfc_45%,_#fff_75%)] [.solutions-detail-page_&::before]:[mask-image:linear-gradient(to_bottom,_#000_0%,_#000_68%,_#000000e6_78%,_#00000066_90%,_transparent_100%)] max-md:[.solutions-detail-page_&]:[padding-top:52px] max-md:[.solutions-detail-page_&]:[padding-right:20px] max-md:[.solutions-detail-page_&]:[padding-bottom:0] max-md:[.solutions-detail-page_&]:[padding-left:20px]",
  "industry-hero-heading":
    "[.solutions-detail-page_&]:[text-align:center] [.solutions-detail-page_&_h1]:[margin-top:0] [.solutions-detail-page_&_h1]:[margin-right:0] [.solutions-detail-page_&_h1]:[margin-bottom:0] [.solutions-detail-page_&_h1]:[margin-left:0] [.solutions-detail-page_&_h1]:[font-size:calc(50_*_var(--industry-unit))]! [.solutions-detail-page_&_h1]:[font-weight:410]! [.solutions-detail-page_&_h1]:[line-height:1]! [.solutions-detail-page_&_h1]:[color:#0d5792]! [.solutions-detail-page_&_>_p]:[width:calc(690_*_var(--industry-unit))] [.solutions-detail-page_&_>_p]:[max-width:100%] [.solutions-detail-page_&_>_p]:[margin-top:calc(36_*_var(--industry-unit))] [.solutions-detail-page_&_>_p]:[margin-right:auto] [.solutions-detail-page_&_>_p]:[margin-bottom:0] [.solutions-detail-page_&_>_p]:[margin-left:auto] [.solutions-detail-page_&_>_p]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_&_>_p]:[line-height:1]! [.solutions-detail-page_&_>_p]:[color:#27272a]! max-xl:[.solutions-detail-page_&_h1]:[font-size:clamp(30px,_4.1vw,_50px)]! max-xl:[.solutions-detail-page_&_>_p]:[line-height:1.2]! max-md:[.solutions-detail-page_&_h1]:[font-size:clamp(27px,_7.5vw,_40px)]! max-md:[.solutions-detail-page_&_h1]:[line-height:1.1]!",
  "industry-illustration":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1440_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-top:calc(40_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:auto]",
  "industry-artwork":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[aspect-ratio:1376_/_768] [.solutions-detail-page_&::before]:[content:''] [.solutions-detail-page_&::before]:[position:absolute] [.solutions-detail-page_&::before]:[top:0] [.solutions-detail-page_&::before]:[right:0] [.solutions-detail-page_&::before]:[bottom:0] [.solutions-detail-page_&::before]:[left:0] [.solutions-detail-page_&::before]:[background:radial-gradient(ellipse_at_50%_52%,_#e6f1fa35,_transparent_72%)] [.solutions-detail-page_&::before]:[pointer-events:none]",
  "industry-hero-image":
    "[.solutions-detail-page_&]:[object-fit:contain] [.solutions-detail-page_&]:[mask-image:radial-gradient(ellipse_75%_150%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%),_radial-gradient(ellipse_150%_75%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%)] [.solutions-detail-page_&]:[mask-composite:intersect] [.solutions-detail-page_&]:[-webkit-mask-image:radial-gradient(ellipse_75%_150%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%),_radial-gradient(ellipse_150%_75%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%)] [.solutions-detail-page_&]:[-webkit-mask-composite:source-in]",
  "industry-illustration-placeholder":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[top:0] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:0] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[flex-direction:column] [.solutions-detail-page_&]:[justify-content:center] [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:16px] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[background:radial-gradient(ellipse,_#e8f4fb88,_transparent_70%)] [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&_svg]:[width:42px] [.solutions-detail-page_&_svg]:[height:42px] max-md:[.solutions-detail-page_&_span]:[max-width:80%] max-md:[.solutions-detail-page_&_span]:[text-align:center]",
  "industry-hotspot":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[z-index:1] [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[transform:translate(-50%,_-50%)] [.solutions-detail-page_&]:[width:max(36px,_calc(64_*_var(--industry-unit)))] [.solutions-detail-page_&]:[height:max(36px,_calc(64_*_var(--industry-unit)))] [.solutions-detail-page_&]:[border:0] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[background:transparent] [.solutions-detail-page_&]:[box-shadow:0_4px_24px_#005eff26] [.solutions-detail-page_&]:[cursor:pointer] [.solutions-detail-page_&::before]:[content:''] [.solutions-detail-page_&::before]:[position:absolute] [.solutions-detail-page_&::before]:[top:0] [.solutions-detail-page_&::before]:[right:0] [.solutions-detail-page_&::before]:[bottom:0] [.solutions-detail-page_&::before]:[left:0] [.solutions-detail-page_&::before]:[border:1px_solid_#005eff99] [.solutions-detail-page_&::before]:[border-radius:inherit] [.solutions-detail-page_&::before]:[pointer-events:none] [.solutions-detail-page_&::before]:[opacity:0] [.solutions-detail-page_&::before]:animate-migrated-c542d7896 [.solutions-detail-page_&::after]:[content:''] [.solutions-detail-page_&::after]:[position:absolute] [.solutions-detail-page_&::after]:[top:0] [.solutions-detail-page_&::after]:[right:0] [.solutions-detail-page_&::after]:[bottom:0] [.solutions-detail-page_&::after]:[left:0] [.solutions-detail-page_&::after]:[border:1px_solid_#005eff99] [.solutions-detail-page_&::after]:[border-radius:inherit] [.solutions-detail-page_&::after]:[pointer-events:none] [.solutions-detail-page_&::after]:[opacity:0] [.solutions-detail-page_&::after]:animate-migrated-c542d7896 [.solutions-detail-page_&::before]:[animation-delay:calc(-1_*_var(--hotspot-delay))] [.solutions-detail-page_&::after]:[animation-delay:calc(0.65s_-_var(--hotspot-delay))] [.solutions-detail-page_&:is(:hover,_:focus)]:[z-index:2] max-md:[.solutions-detail-page_&]:[width:clamp(22px,_6vw,_36px)] max-md:[.solutions-detail-page_&]:[height:clamp(22px,_6vw,_36px)] motion-reduce:[.solutions-detail-page_&::before]:[animation:none] motion-reduce:[.solutions-detail-page_&::before]:[opacity:0] motion-reduce:[.solutions-detail-page_&::after]:[animation:none] motion-reduce:[.solutions-detail-page_&::after]:[opacity:0]",
  "industry-hotspot-core":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[z-index:1] [.solutions-detail-page_&]:[display:block]! [.solutions-detail-page_&]:[width:62%] [.solutions-detail-page_&]:[height:62%] [.solutions-detail-page_&]:[border:2px_solid_#d9e8ff] [.solutions-detail-page_&]:[outline:1px_solid_#005eff] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[background:linear-gradient(180deg,_#0065ff,_#002399)] [.solutions-detail-page_&]:[box-shadow:0_0_0_4px_#b9ddff66,_0_0_0_7px_#f5faff80,_0_0_0_8px_#005eff40] max-md:[.solutions-detail-page_&]:[border-width:1px] max-md:[.solutions-detail-page_&]:[box-shadow:0_0_0_2px_#b9ddff66,_0_0_0_4px_#f5faff80,_0_0_0_5px_#005eff40]",
  "industry-hotspot-tooltip":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[bottom:calc(100%_+_12px)] [.solutions-detail-page_&]:[left:50%] [.solutions-detail-page_&]:[transform:translate(-50%,_5px)] [.solutions-detail-page_&]:[width:max-content] [.solutions-detail-page_&]:[max-width:220px] [.solutions-detail-page_&]:[padding-top:9px] [.solutions-detail-page_&]:[padding-right:14px] [.solutions-detail-page_&]:[padding-bottom:9px] [.solutions-detail-page_&]:[padding-left:14px] [.solutions-detail-page_&]:[border:0.5px_solid_#ffffffb3] [.solutions-detail-page_&]:[border-radius:10px] [.solutions-detail-page_&]:[background:#f7fbfff2] [.solutions-detail-page_&]:[box-shadow:0_4px_18px_#0d579222] [.solutions-detail-page_&]:[color:#0d5792]! [.solutions-detail-page_&]:[font-size:clamp(11px,_0.95vw,_18px)]! [.solutions-detail-page_&]:[line-height:1.15]! [.solutions-detail-page_&]:[opacity:0] [.solutions-detail-page_&]:[visibility:hidden] [.solutions-detail-page_&]:[pointer-events:none] [.solutions-detail-page_&]:[transition:opacity_180ms_ease,_transform_180ms_ease] [.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[opacity:1] [.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[visibility:visible] [.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[transform:translate(-50%,_0)]",
  "industry-popup":
    "[.solutions-detail-page_&]:[--popup-unit:1px] [.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[z-index:3] [.solutions-detail-page_&]:[width:280px] [.solutions-detail-page_&]:[max-width:calc(100%_-_24px)] [.solutions-detail-page_&]:[left:clamp(12px,_var(--popup-anchor-left),_max(12px,_calc(100%_-_292px)))] [.solutions-detail-page_&]:[top:clamp(12px,_calc(var(--popup-y)_-_60px),_max(12px,_calc(100%_-_232px)))] [.solutions-detail-page_&]:[border-radius:18px] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[box-shadow:0_10px_30px_#0d579226] [.solutions-detail-page_&]:animate-migrated-541932b35 max-md:[.solutions-detail-page_&]:[position:absolute] max-md:[.solutions-detail-page_&]:[width:200px] max-md:[.solutions-detail-page_&]:[max-width:calc(100%_-_16px)] max-md:[.solutions-detail-page_&]:[margin-top:0] max-md:[.solutions-detail-page_&]:[margin-right:0] max-md:[.solutions-detail-page_&]:[margin-bottom:0] max-md:[.solutions-detail-page_&]:[margin-left:0] max-md:[.solutions-detail-page_&]:[border-radius:12px]",
  "industry-popup-header":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:center] [.solutions-detail-page_&]:[gap:16px] [.solutions-detail-page_&]:[min-height:72px] [.solutions-detail-page_&]:[padding-top:14px] [.solutions-detail-page_&]:[padding-right:48px] [.solutions-detail-page_&]:[padding-bottom:14px] [.solutions-detail-page_&]:[padding-left:20px] [.solutions-detail-page_&]:[color:#fff]! [.solutions-detail-page_&]:[background:linear-gradient(125deg,_#53a7c5a6,_#dfe8f1a6)] [.solutions-detail-page_&_>_svg]:[flex-shrink:0] [.solutions-detail-page_&_>_svg]:[width:32px] [.solutions-detail-page_&_>_svg]:[height:32px] [.solutions-detail-page_&_h3]:[margin-top:0] [.solutions-detail-page_&_h3]:[margin-right:0] [.solutions-detail-page_&_h3]:[margin-bottom:0] [.solutions-detail-page_&_h3]:[margin-left:0] [.solutions-detail-page_&_h3]:[font-size:19px]! [.solutions-detail-page_&_h3]:[font-weight:410]! [.solutions-detail-page_&_h3]:[line-height:1.07]! [.solutions-detail-page_&_button]:[position:absolute] [.solutions-detail-page_&_button]:[top:10px] [.solutions-detail-page_&_button]:[right:10px] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[width:28px] [.solutions-detail-page_&_button]:[height:28px] [.solutions-detail-page_&_button]:[padding-top:0] [.solutions-detail-page_&_button]:[padding-right:0] [.solutions-detail-page_&_button]:[padding-bottom:0] [.solutions-detail-page_&_button]:[padding-left:0] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[border-radius:50%] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#101010]! [.solutions-detail-page_&_button]:[cursor:pointer] max-md:[.solutions-detail-page_&]:[min-height:52px] max-md:[.solutions-detail-page_&]:[padding-top:8px] max-md:[.solutions-detail-page_&]:[padding-right:25px] max-md:[.solutions-detail-page_&]:[padding-bottom:8px] max-md:[.solutions-detail-page_&]:[padding-left:8px] max-md:[.solutions-detail-page_&]:[gap:5px] max-md:[.solutions-detail-page_&_>_svg]:[width:18px] max-md:[.solutions-detail-page_&_>_svg]:[height:18px] max-md:[.solutions-detail-page_&_h3]:[font-size:clamp(10px,_2.6vw,_13px)]! max-md:[.solutions-detail-page_&_h3]:[overflow-wrap:anywhere] max-md:[.solutions-detail-page_&_button]:[width:22px] max-md:[.solutions-detail-page_&_button]:[height:22px] max-md:[.solutions-detail-page_&_button]:[right:2px] max-md:[.solutions-detail-page_&_button]:[top:4px]",
  "industry-popup-products":
    "[.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [.solutions-detail-page_&]:[max-height:min(300px,_50svh)] [.solutions-detail-page_&]:[overflow-y:auto] [.solutions-detail-page_&]:[background:#fff] max-md:[.solutions-detail-page_&]:[max-height:120px]",
  "industry-popup-product":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[grid-column:span_2] [.solutions-detail-page_&]:[height:150px] [.solutions-detail-page_&]:[min-width:0] [.solutions-detail-page_&:last-child:nth-child(odd)]:[grid-column:2_/_span_2] max-md:[.solutions-detail-page_&]:[height:90px]",
  "industry-product-image": "[.solutions-detail-page_&]:[object-fit:contain]",
  "industry-product-placeholder":
    "[.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[height:100%] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[background:#f8fbfd] [.solutions-detail-page_&]:[font-size:14px]!",
  "industry-product-name":
    "[.solutions-detail-page_&]:[position:absolute] [.solutions-detail-page_&]:[top:auto] [.solutions-detail-page_&]:[right:0] [.solutions-detail-page_&]:[bottom:0] [.solutions-detail-page_&]:[left:0] [.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[min-height:72px] [.solutions-detail-page_&]:[padding-top:12px] [.solutions-detail-page_&]:[padding-right:12px] [.solutions-detail-page_&]:[padding-bottom:12px] [.solutions-detail-page_&]:[padding-left:12px] [.solutions-detail-page_&]:[border:0.5px_solid_#ffffffa6] [.solutions-detail-page_&]:[background:linear-gradient(135deg,_#e8f4fb80,_#a7c6f380)] [.solutions-detail-page_&]:[box-shadow:0_-8px_24px_#005eff18] [.solutions-detail-page_&]:[color:#0d5792]! [.solutions-detail-page_&]:[font-size:22px]! [.solutions-detail-page_&]:[line-height:1]! [.solutions-detail-page_&]:[opacity:0] [.solutions-detail-page_&]:[transform:translateY(8px)] [.solutions-detail-page_&]:[transition:opacity_200ms_ease,_transform_200ms_ease] [.solutions-detail-page_.industry-popup-product:is(:hover,_:focus)_&]:[opacity:1] [.solutions-detail-page_.industry-popup-product:is(:hover,_:focus)_&]:[transform:translateY(0)] max-md:[.solutions-detail-page_&]:[min-height:44px] max-md:[.solutions-detail-page_&]:[font-size:16px]! max-md:[.solutions-detail-page_&]:[padding-top:8px] max-md:[.solutions-detail-page_&]:[padding-right:8px] max-md:[.solutions-detail-page_&]:[padding-bottom:8px] max-md:[.solutions-detail-page_&]:[padding-left:8px]",
  "industry-carousel-section":
    "[.solutions-detail-page_&]:[padding-top:calc(90_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:24px] [.solutions-detail-page_&]:[padding-bottom:calc(100_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:24px] max-md:[.solutions-detail-page_&]:[padding-left:20px] max-md:[.solutions-detail-page_&]:[padding-right:20px]",
  "industry-carousel-viewport":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[width:100%] [.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[overflow:hidden] [.solutions-detail-page_&]:[touch-action:pan-y]",
  "industry-carousel-track":
    "[.solutions-detail-page_&]:[position:relative] [.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[align-items:flex-start] [.solutions-detail-page_&]:[gap:calc(40_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-top:0] [.solutions-detail-page_&]:[margin-right:0] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:0] [.solutions-detail-page_&]:[padding-top:calc(35_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:calc(35_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[list-style:none] [.solutions-detail-page_&]:[min-height:calc(730_*_var(--industry-unit))] max-md:[.solutions-detail-page_&]:[gap:20px] max-md:[.solutions-detail-page_&]:[min-height:620px]",
  "industry-carousel-item":
    "[.solutions-detail-page_&]:[flex:0_0_var(--industry-slot-width)] [.solutions-detail-page_&]:[min-width:0]",
  "industry-card":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[flex-direction:column] [.solutions-detail-page_&]:[align-items:flex-start] [.solutions-detail-page_&]:[justify-content:space-between] [.solutions-detail-page_&]:[gap:calc(22_*_var(--industry-unit))] [.solutions-detail-page_&]:[width:calc(120_*_var(--industry-unit))] [.solutions-detail-page_&]:[max-width:100%] [.solutions-detail-page_&]:[min-height:calc(130_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[padding-top:0] [.solutions-detail-page_&]:[padding-right:0] [.solutions-detail-page_&]:[padding-bottom:0] [.solutions-detail-page_&]:[padding-left:0] [.solutions-detail-page_&]:[border:0] [.solutions-detail-page_&]:[border-radius:calc(20_*_var(--industry-unit))] [.solutions-detail-page_&]:[background:transparent] [.solutions-detail-page_&]:[color:#27272a]! [.solutions-detail-page_&]:[text-align:left] [.solutions-detail-page_&]:[cursor:pointer] [.solutions-detail-page_&]:[transition:width_350ms_ease,_min-height_350ms_ease,_padding_350ms_ease,_background-color_350ms_ease,_box-shadow_350ms_ease] [.solutions-detail-page_.industry-carousel-item--active_&&]:[width:calc(161_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[min-height:calc(249_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-top:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-right:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-bottom:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-left:calc(20_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[border-radius:calc(15_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[background:#f7f7f7] [.solutions-detail-page_.industry-carousel-item--active_&&]:[box-shadow:0_-20px_50px_#005eff18] max-md:[.solutions-detail-page_&]:[width:min(120px,_100%)] max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:min(161px,_100%)]",
  "industry-card-title":
    "[.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.12]! [.solutions-detail-page_&]:[transition:font-size_350ms_ease] [.solutions-detail-page_.industry-carousel-item--active_&&]:[width:100%] [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-size:calc(22_*_var(--industry-unit))]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-weight:540]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1.07]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[text-align:center]",
  "industry-card-arrow":
    "[.solutions-detail-page_&]:[display:grid]! [.solutions-detail-page_&]:[place-items:center] [.solutions-detail-page_&]:[flex-shrink:0] [.solutions-detail-page_&]:[width:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&]:[height:calc(30_*_var(--industry-unit))] [.solutions-detail-page_&]:[border-radius:50%] [.solutions-detail-page_&]:[background:#27272a] [.solutions-detail-page_&]:[color:#fff]! [.solutions-detail-page_&_svg]:[width:60%] [.solutions-detail-page_&_svg]:[height:60%] [.solutions-detail-page_.industry-carousel-item--active_&&]:[border:0.5px_solid_#dceaff] [.solutions-detail-page_.industry-carousel-item--active_&&]:[background:linear-gradient(135deg,_#438aff,_#004bdc)] [.solutions-detail-page_.industry-carousel-item--active_&&]:[box-shadow:0_0_calc(21_*_var(--industry-unit))_calc(7_*_var(--industry-unit))_#005eff40,_inset_0_1px_2px_#ffffff99] [.solutions-detail-page_.industry-carousel-item--active_&&_svg]:[width:70%] [.solutions-detail-page_.industry-carousel-item--active_&&_svg]:[height:70%]",
  "industry-title-line": "[.solutions-detail-page_&]:[display:block]!",
  "industry-navigation-slot":
    "[.solutions-detail-page_&]:[min-height:calc(46_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[min-height:calc(115_*_var(--industry-unit))]",
  "industry-navigation":
    "[.solutions-detail-page_&]:[display:flex]! [.solutions-detail-page_&]:[justify-content:center] [.solutions-detail-page_&]:[gap:calc(15_*_var(--industry-unit))] [.solutions-detail-page_&]:[padding-top:calc(10_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-top:calc(50_*_var(--industry-unit))] [.solutions-detail-page_&_button]:[display:grid]! [.solutions-detail-page_&_button]:[place-items:center] [.solutions-detail-page_&_button]:[width:max(32px,_calc(30_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[height:max(32px,_calc(30_*_var(--industry-unit)))] [.solutions-detail-page_&_button]:[border:0] [.solutions-detail-page_&_button]:[background:transparent] [.solutions-detail-page_&_button]:[color:#9eb7d0]! [.solutions-detail-page_&_button]:[cursor:pointer] [.solutions-detail-page_&_button:disabled]:[opacity:0.35] [.solutions-detail-page_&_button:disabled]:[cursor:default] [.solutions-detail-page_&_svg]:[width:90%] [.solutions-detail-page_&_svg]:[height:90%]",
  "industry-item-description":
    "[.solutions-detail-page_&]:[width:calc(120_*_var(--industry-unit))] [.solutions-detail-page_&]:[max-width:100%] [.solutions-detail-page_&]:[margin-top:calc(16_*_var(--industry-unit))] [.solutions-detail-page_&]:[margin-right:auto] [.solutions-detail-page_&]:[margin-bottom:0] [.solutions-detail-page_&]:[margin-left:auto] [.solutions-detail-page_&]:[color:#9eb7d0]! [.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]! [.solutions-detail-page_&]:[line-height:1.12]! [.solutions-detail-page_&]:[overflow-wrap:anywhere] [.solutions-detail-page_&]:[transition:width_350ms_ease,_font-size_350ms_ease] [.solutions-detail-page_.industry-carousel-item--active_&&]:[width:calc(135_*_var(--industry-unit))] [.solutions-detail-page_.industry-carousel-item--active_&&]:[font-size:calc(15_*_var(--industry-unit))]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1]! [.solutions-detail-page_.industry-carousel-item--active_&&]:[text-align:center] max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:min(160px,_100%)] max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1.2]!",
};
const twsolutionsdetailPagePriority: Record<string, number> = {
  "[.solutions-detail-page_&]:[padding-top:0]": 848,
  "[.solutions-detail-page_&]:[padding-right:24px]": 812,
  "[.solutions-detail-page_&]:[padding-bottom:0]": 850,
  "[.solutions-detail-page_&]:[padding-left:24px]": 814,
  "[.solutions-detail-page_&]:[width:100%]": 816,
  "[.solutions-detail-page_&]:[max-width:calc(1200_*_var(--industry-unit))]": 817,
  "[.solutions-detail-page_&]:[margin-left:auto]": 917,
  "[.solutions-detail-page_&]:[margin-right:auto]": 915,
  "[.solutions-detail-page_&]:[position:relative]": 822,
  "[.solutions-detail-page_&]:[isolation:isolate]": 577,
  "[.solutions-detail-page_&]:[overflow:hidden]": 820,
  "[.solutions-detail-page_&]:[min-height:calc(401_*_var(--industry-unit))]": 12,
  "[.solutions-detail-page_&]:[border-radius:calc(30_*_var(--industry-unit))]": 13,
  "[.solutions-detail-page_&]:[background:linear-gradient(110deg,_#0657ce_0%,_#006eff_46%,_#051a44_100%)]": 14,
  "[.solutions-detail-page_&]:[object-fit:cover]": 15,
  "[.solutions-detail-page_&]:[z-index:-1]": 22,
  "[.solutions-detail-page_&]:[position:absolute]": 788,
  "[.solutions-detail-page_&]:[top:0]": 634,
  "[.solutions-detail-page_&]:[right:0]": 790,
  "[.solutions-detail-page_&]:[bottom:0]": 791,
  "[.solutions-detail-page_&]:[left:0]": 792,
  "[.solutions-detail-page_&]:[height:100%]": 784,
  "[.solutions-detail-page_&]:[pointer-events:none]": 717,
  "[.solutions-detail-page_&]:[width:52%]": 26,
  "[.solutions-detail-page_&]:[padding-top:calc(60_*_var(--industry-unit))]": 27,
  "[.solutions-detail-page_&]:[padding-right:calc(67_*_var(--industry-unit))]": 28,
  "[.solutions-detail-page_&]:[padding-bottom:calc(60_*_var(--industry-unit))]": 29,
  "[.solutions-detail-page_&]:[padding-left:calc(67_*_var(--industry-unit))]": 30,
  "[.solutions-detail-page_&]:[color:#f7f7f7]!": 31,
  "[.solutions-detail-page_&_h2]:[margin-top:0]": 507,
  "[.solutions-detail-page_&_h2]:[margin-right:0]": 508,
  "[.solutions-detail-page_&_h2]:[margin-bottom:0]": 509,
  "[.solutions-detail-page_&_h2]:[margin-left:0]": 510,
  "[.solutions-detail-page_&_h2]:[font-size:calc(50_*_var(--industry-unit))]!": 512,
  "[.solutions-detail-page_&_h2]:[font-weight:410]!": 513,
  "[.solutions-detail-page_&_h2]:[line-height:1]!": 514,
  "[.solutions-detail-page_&_p]:[margin-top:calc(30_*_var(--industry-unit))]": 39,
  "[.solutions-detail-page_&_p]:[margin-right:0]": 516,
  "[.solutions-detail-page_&_p]:[margin-bottom:0]": 517,
  "[.solutions-detail-page_&_p]:[margin-left:0]": 518,
  "[.solutions-detail-page_&_p]:[font-size:calc(15_*_var(--industry-unit))]!": 520,
  "[.solutions-detail-page_&_p]:[line-height:1]!": 521,
  "[.solutions-detail-page_&]:[margin-top:calc(75_*_var(--industry-unit))]": 45,
  "[.solutions-detail-page_&_fieldset]:[min-width:0]": 46,
  "[.solutions-detail-page_&_fieldset]:[margin-top:0]": 47,
  "[.solutions-detail-page_&_fieldset]:[margin-right:0]": 48,
  "[.solutions-detail-page_&_fieldset]:[margin-bottom:calc(48_*_var(--industry-unit))]": 49,
  "[.solutions-detail-page_&_fieldset]:[margin-left:0]": 50,
  "[.solutions-detail-page_&_fieldset]:[padding-top:0]": 51,
  "[.solutions-detail-page_&_fieldset]:[padding-right:0]": 52,
  "[.solutions-detail-page_&_fieldset]:[padding-bottom:0]": 53,
  "[.solutions-detail-page_&_fieldset]:[padding-left:0]": 54,
  "[.solutions-detail-page_&_fieldset]:[border:0]": 55,
  "[.solutions-detail-page_&_legend]:[margin-bottom:calc(27_*_var(--industry-unit))]": 56,
  "[.solutions-detail-page_&_legend]:[padding-top:0]": 57,
  "[.solutions-detail-page_&_legend]:[padding-right:0]": 58,
  "[.solutions-detail-page_&_legend]:[padding-bottom:0]": 59,
  "[.solutions-detail-page_&_legend]:[padding-left:0]": 60,
  "[.solutions-detail-page_&_legend]:[font-size:calc(25_*_var(--industry-unit))]!": 61,
  "[.solutions-detail-page_&_legend]:[font-weight:540]!": 62,
  "[.solutions-detail-page_&_legend]:[font-variation-settings:'wght'_540,_'wdth'_125]!": 63,
  "[.solutions-detail-page_&_legend]:[line-height:1.12]!": 64,
  "[.solutions-detail-page_&_legend]:[color:#005eff]!": 65,
  "[.solutions-detail-page_&]:[display:grid]!": 862,
  "[.solutions-detail-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]": 70,
  "[.solutions-detail-page_&]:[gap:calc(23_*_var(--industry-unit))_calc(37_*_var(--industry-unit))]": 71,
  "[.solutions-detail-page_&]:[min-width:0]": 837,
  "[.solutions-detail-page_&_input]:[display:block]!": 215,
  "[.solutions-detail-page_&_input]:[width:100%]": 216,
  "[.solutions-detail-page_&_input]:[height:calc(45_*_var(--industry-unit))]": 75,
  "[.solutions-detail-page_&_input]:[min-height:44px]": 76,
  "[.solutions-detail-page_&_input]:[padding-top:calc(12_*_var(--industry-unit))]": 77,
  "[.solutions-detail-page_&_input]:[padding-right:calc(37_*_var(--industry-unit))]": 78,
  "[.solutions-detail-page_&_input]:[padding-bottom:calc(12_*_var(--industry-unit))]": 79,
  "[.solutions-detail-page_&_input]:[padding-left:calc(37_*_var(--industry-unit))]": 80,
  "[.solutions-detail-page_&_input]:[border:1px_solid_transparent]": 81,
  "[.solutions-detail-page_&_input]:[border-radius:calc(8_*_var(--industry-unit))]": 82,
  "[.solutions-detail-page_&_input]:[background:#f7f7f7]": 83,
  "[.solutions-detail-page_&_input]:[color:#334155]!": 84,
  "[.solutions-detail-page_&_input]:[font-style:inherit]": 85,
  "[.solutions-detail-page_&_input]:[font-variant:inherit]": 86,
  "[.solutions-detail-page_&_input]:[font-weight:inherit]!": 87,
  "[.solutions-detail-page_&_input]:[font-stretch:inherit]!": 88,
  "[.solutions-detail-page_&_input]:[font-size:inherit]!": 89,
  "[.solutions-detail-page_&_input]:[line-height:inherit]!": 90,
  "[.solutions-detail-page_&_input]:[font-family:inherit]!": 91,
  "[.solutions-detail-page_&_input]:[font-feature-settings:inherit]": 92,
  "[.solutions-detail-page_&_input]:[font-variation-settings:inherit]!": 93,
  "[.solutions-detail-page_&_input]:[font-size:calc(15_*_var(--industry-unit))]!": 94,
  "[.solutions-detail-page_&_input]:[line-height:1.07]!": 95,
  "[.solutions-detail-page_&_textarea]:[display:block]!": 96,
  "[.solutions-detail-page_&_textarea]:[width:100%]": 97,
  "[.solutions-detail-page_&_textarea]:[height:calc(45_*_var(--industry-unit))]": 98,
  "[.solutions-detail-page_&_textarea]:[min-height:44px]": 99,
  "[.solutions-detail-page_&_textarea]:[padding-top:calc(12_*_var(--industry-unit))]": 100,
  "[.solutions-detail-page_&_textarea]:[padding-right:calc(37_*_var(--industry-unit))]": 101,
  "[.solutions-detail-page_&_textarea]:[padding-bottom:calc(12_*_var(--industry-unit))]": 102,
  "[.solutions-detail-page_&_textarea]:[padding-left:calc(37_*_var(--industry-unit))]": 103,
  "[.solutions-detail-page_&_textarea]:[border:1px_solid_transparent]": 104,
  "[.solutions-detail-page_&_textarea]:[border-radius:calc(8_*_var(--industry-unit))]": 105,
  "[.solutions-detail-page_&_textarea]:[background:#f7f7f7]": 106,
  "[.solutions-detail-page_&_textarea]:[color:#334155]!": 107,
  "[.solutions-detail-page_&_textarea]:[font-style:inherit]": 108,
  "[.solutions-detail-page_&_textarea]:[font-variant:inherit]": 109,
  "[.solutions-detail-page_&_textarea]:[font-weight:inherit]!": 110,
  "[.solutions-detail-page_&_textarea]:[font-stretch:inherit]!": 111,
  "[.solutions-detail-page_&_textarea]:[font-size:inherit]!": 112,
  "[.solutions-detail-page_&_textarea]:[line-height:inherit]!": 113,
  "[.solutions-detail-page_&_textarea]:[font-family:inherit]!": 114,
  "[.solutions-detail-page_&_textarea]:[font-feature-settings:inherit]": 115,
  "[.solutions-detail-page_&_textarea]:[font-variation-settings:inherit]!": 116,
  "[.solutions-detail-page_&_textarea]:[font-size:calc(15_*_var(--industry-unit))]!": 117,
  "[.solutions-detail-page_&_textarea]:[line-height:1.07]!": 118,
  "[.solutions-detail-page_&_input::placeholder]:[color:#9eb7d0]!": 119,
  "[.solutions-detail-page_&_input::placeholder]:[opacity:1]": 120,
  "[.solutions-detail-page_&_textarea::placeholder]:[color:#9eb7d0]!": 121,
  "[.solutions-detail-page_&_textarea::placeholder]:[opacity:1]": 122,
  "[.solutions-detail-page_&_textarea]:[height:calc(188_*_var(--industry-unit))]": 123,
  "[.solutions-detail-page_&_textarea]:[padding-top:calc(23_*_var(--industry-unit))]": 124,
  "[.solutions-detail-page_&_textarea]:[padding-bottom:calc(23_*_var(--industry-unit))]": 125,
  "[.solutions-detail-page_&_textarea]:[resize:vertical]": 126,
  "[.solutions-detail-page_&_input:focus]:[outline:none]": 127,
  "[.solutions-detail-page_&_input:focus]:[border-color:#005eff]": 128,
  "[.solutions-detail-page_&_input:focus]:[box-shadow:0_0_0_2px_#005eff12]": 129,
  "[.solutions-detail-page_&_textarea:focus]:[outline:none]": 130,
  "[.solutions-detail-page_&_textarea:focus]:[border-color:#005eff]": 131,
  "[.solutions-detail-page_&_textarea:focus]:[box-shadow:0_0_0_2px_#005eff12]": 132,
  "[.solutions-detail-page_&]:[display:flex]!": 894,
  "[.solutions-detail-page_&]:[flex-direction:column]": 839,
  "[.solutions-detail-page_&]:[gap:12px]": 136,
  "[.solutions-detail-page_&]:[height:calc(188_*_var(--industry-unit))]": 137,
  "[.solutions-detail-page_&]:[padding-top:calc(23_*_var(--industry-unit))]": 138,
  "[.solutions-detail-page_&]:[padding-right:calc(37_*_var(--industry-unit))]": 139,
  "[.solutions-detail-page_&]:[padding-bottom:calc(23_*_var(--industry-unit))]": 140,
  "[.solutions-detail-page_&]:[padding-left:calc(37_*_var(--industry-unit))]": 141,
  "[.solutions-detail-page_&]:[border:1px_solid_transparent]": 142,
  "[.solutions-detail-page_&]:[border-radius:calc(8_*_var(--industry-unit))]": 143,
  "[.solutions-detail-page_&]:[background:#f7f7f7]": 457,
  "[.solutions-detail-page_&]:[color:#9eb7d0]!": 918,
  "[.solutions-detail-page_&]:[cursor:pointer]": 857,
  "[.solutions-detail-page_&[data-dragging='true']]:[border-color:#005eff]": 147,
  "[.solutions-detail-page_&[data-dragging='true']]:[background:#eff6ff]": 148,
  "[.solutions-detail-page_&]:[font-size:calc(15_*_var(--industry-unit))]!": 266,
  "[.solutions-detail-page_&]:[line-height:1.07]!": 206,
  "[.solutions-detail-page_&]:[display:none]!": 151,
  "[.solutions-detail-page_&]:[flex:1]": 152,
  "[.solutions-detail-page_&]:[overflow-y:auto]": 774,
  "[.solutions-detail-page_&]:[min-height:0]": 154,
  "[.solutions-detail-page_&]:[margin-top:0]": 826,
  "[.solutions-detail-page_&]:[margin-right:0]": 827,
  "[.solutions-detail-page_&]:[margin-bottom:0]": 916,
  "[.solutions-detail-page_&]:[margin-left:0]": 829,
  "[.solutions-detail-page_&]:[padding-right:0]": 849,
  "[.solutions-detail-page_&]:[padding-left:0]": 851,
  "[.solutions-detail-page_&]:[list-style:none]": 834,
  "[.solutions-detail-page_&_li]:[display:flex]!": 164,
  "[.solutions-detail-page_&_li]:[align-items:center]": 165,
  "[.solutions-detail-page_&_li]:[gap:8px]": 166,
  "[.solutions-detail-page_&_li]:[font-size:calc(12_*_var(--industry-unit))]!": 167,
  "[.solutions-detail-page_&_li]:[color:#334155]!": 168,
  "[.solutions-detail-page_&_li_>_span]:[flex:1]": 169,
  "[.solutions-detail-page_&_li_>_span]:[min-width:0]": 170,
  "[.solutions-detail-page_&_li_>_span]:[overflow-wrap:anywhere]": 171,
  "[.solutions-detail-page_&_button]:[display:grid]!": 900,
  "[.solutions-detail-page_&_button]:[place-items:center]": 901,
  "[.solutions-detail-page_&_button]:[flex-shrink:0]": 410,
  "[.solutions-detail-page_&_button]:[width:28px]": 760,
  "[.solutions-detail-page_&_button]:[height:28px]": 761,
  "[.solutions-detail-page_&_button]:[padding-top:0]": 762,
  "[.solutions-detail-page_&_button]:[padding-right:0]": 763,
  "[.solutions-detail-page_&_button]:[padding-bottom:0]": 764,
  "[.solutions-detail-page_&_button]:[padding-left:0]": 765,
  "[.solutions-detail-page_&_button]:[border:0]": 904,
  "[.solutions-detail-page_&_button]:[background:transparent]": 905,
  "[.solutions-detail-page_&_button]:[color:#9eb7d0]!": 906,
  "[.solutions-detail-page_&_button]:[cursor:pointer]": 907,
  "[.solutions-detail-page_&]:[gap:calc(12_*_var(--industry-unit))]": 204,
  "[.solutions-detail-page_&_svg]:[width:calc(14_*_var(--industry-unit))]": 187,
  "[.solutions-detail-page_&_svg]:[height:calc(14_*_var(--industry-unit))]": 188,
  "[.solutions-detail-page_&_svg]:[stroke-width:1.4]": 189,
  "[.solutions-detail-page_&]:[margin-top:8px]": 190,
  "[.solutions-detail-page_&]:[color:#9b3131]!": 194,
  "[.solutions-detail-page_&]:[font-size:12px]!": 195,
  "[.solutions-detail-page_&]:[line-height:1.2]!": 196,
  "[.solutions-detail-page_&:empty]:[display:none]!": 197,
  "[.solutions-detail-page_&]:[align-items:center]": 736,
  "[.solutions-detail-page_&]:[justify-content:space-between]": 841,
  "[.solutions-detail-page_&]:[gap:24px]": 201,
  "[.solutions-detail-page_&]:[letter-spacing:0]": 207,
  "[.solutions-detail-page_&]:[color:#000]!": 208,
  "[.solutions-detail-page_&]:[flex-shrink:0]": 864,
  "[.solutions-detail-page_&]:[width:calc(16_*_var(--industry-unit))]": 212,
  "[.solutions-detail-page_&]:[height:calc(16_*_var(--industry-unit))]": 213,
  "[.solutions-detail-page_&_input]:[appearance:none]": 214,
  "[.solutions-detail-page_&_input]:[height:100%]": 217,
  "[.solutions-detail-page_&_input]:[margin-top:0]": 218,
  "[.solutions-detail-page_&_input]:[margin-right:0]": 219,
  "[.solutions-detail-page_&_input]:[margin-bottom:0]": 220,
  "[.solutions-detail-page_&_input]:[margin-left:0]": 221,
  "[.solutions-detail-page_&_input]:[border:0]": 222,
  "[.solutions-detail-page_&_input]:[border-radius:calc(3_*_var(--industry-unit))]": 223,
  "[.solutions-detail-page_&_input]:[background:#d9d9d9]": 224,
  "[.solutions-detail-page_&_input]:[cursor:pointer]": 225,
  "[.solutions-detail-page_&_input:checked]:[background:#005eff]": 226,
  "[.solutions-detail-page_&_svg]:[position:absolute]": 227,
  "[.solutions-detail-page_&_svg]:[top:10%]": 228,
  "[.solutions-detail-page_&_svg]:[right:10%]": 229,
  "[.solutions-detail-page_&_svg]:[bottom:10%]": 230,
  "[.solutions-detail-page_&_svg]:[left:10%]": 231,
  "[.solutions-detail-page_&_svg]:[width:80%]": 232,
  "[.solutions-detail-page_&_svg]:[height:80%]": 233,
  "[.solutions-detail-page_&_svg]:[color:#fff]!": 287,
  "[.solutions-detail-page_&_svg]:[opacity:0]": 288,
  "[.solutions-detail-page_&_svg]:[pointer-events:none]": 236,
  "[.solutions-detail-page_&_input:checked_+_svg]:[opacity:1]": 237,
  "[.solutions-detail-page_&_input:focus-visible]:[outline:2px_solid_#005eff]": 238,
  "[.solutions-detail-page_&_input:focus-visible]:[outline-offset:3px]": 239,
  "[.solutions-detail-page_&:focus-visible]:[outline:2px_solid_#005eff]": 240,
  "[.solutions-detail-page_&:focus-visible]:[outline-offset:3px]": 241,
  "[.solutions-detail-page_&]:[width:calc(141_*_var(--industry-unit))]": 247,
  "[.solutions-detail-page_&]:[height:calc(43_*_var(--industry-unit))]": 248,
  "[.solutions-detail-page_&]:[border:1px_solid_#c8d7e5]": 253,
  "[.solutions-detail-page_&]:[border-radius:999px]": 254,
  "[.solutions-detail-page_&]:[background:linear-gradient(#fff,_#f6f9fc)]": 255,
  "[.solutions-detail-page_&]:[color:#27272a]!": 855,
  "[.solutions-detail-page_&]:[font-style:inherit]": 257,
  "[.solutions-detail-page_&]:[font-variant:inherit]": 258,
  "[.solutions-detail-page_&]:[font-weight:inherit]!": 259,
  "[.solutions-detail-page_&]:[font-stretch:inherit]!": 260,
  "[.solutions-detail-page_&]:[font-size:inherit]!": 261,
  "[.solutions-detail-page_&]:[line-height:inherit]!": 262,
  "[.solutions-detail-page_&]:[font-family:inherit]!": 263,
  "[.solutions-detail-page_&]:[font-feature-settings:inherit]": 264,
  "[.solutions-detail-page_&]:[font-variation-settings:inherit]!": 265,
  "[.solutions-detail-page_&]:[z-index:2]": 475,
  "[.solutions-detail-page_&]:[margin-left:calc(16_*_var(--industry-unit))]": 270,
  "[.solutions-detail-page_&]:[transition:transform_650ms_cubic-bezier(0.22,_1,_0.36,_1)]": 271,
  "[.solutions-detail-page_&]:[z-index:3]": 725,
  "[.solutions-detail-page_&]:[top:50%]": 274,
  "[.solutions-detail-page_&]:[left:calc(100%_-_37_*_var(--industry-unit))]": 275,
  "[.solutions-detail-page_&]:[place-items:center]": 863,
  "[.solutions-detail-page_&]:[transform:translateY(-50%)]": 278,
  "[.solutions-detail-page_&]:[width:calc(31_*_var(--industry-unit))]": 279,
  "[.solutions-detail-page_&]:[height:calc(31_*_var(--industry-unit))]": 280,
  "[.solutions-detail-page_&]:[border-radius:50%]": 867,
  "[.solutions-detail-page_&]:[background:linear-gradient(135deg,_#005eff,_#001ea2)]": 282,
  "[.solutions-detail-page_&]:[box-shadow:0_0_12px_#005eff61]": 283,
  "[.solutions-detail-page_&]:[transition:left_650ms_cubic-bezier(0.22,_1,_0.36,_1)]": 284,
  "[.solutions-detail-page_&_svg]:[width:68%]": 285,
  "[.solutions-detail-page_&_svg]:[height:68%]": 286,
  "[.solutions-detail-page_&_svg]:[transform:scale(.78)]": 289,
  "[.solutions-detail-page_&_svg]:[transition:opacity_350ms_ease,_transform_350ms_ease]": 290,
  "[.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&]:[transform:translateX(calc(37_*_var(--industry-unit)))]": 291,
  "[.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&]:[left:calc(6_*_var(--industry-unit))]": 292,
  "[.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&_svg]:[opacity:1]": 293,
  "[.solutions-detail-page_.consultation-send:is(:hover,_:focus-visible)_&_svg]:[transform:scale(1)]": 294,
  "[.solutions-detail-page_&]:[min-height:20px]": 295,
  "[.solutions-detail-page_&]:[margin-top:16px]": 296,
  "[.solutions-detail-page_&]:[font-size:calc(12_*_var(--industry-unit))]!": 919,
  "[.solutions-detail-page_&]:[color:#0d5792]!": 803,
  "max-xl:[.solutions-detail-page_&]:[width:65%]": 302,
  "max-xl:[.solutions-detail-page_&]:[padding-left:40px]": 303,
  "max-xl:[.solutions-detail-page_&]:[padding-right:40px]": 304,
  "max-xl:[.solutions-detail-page_&_h2]:[font-size:42px]!": 305,
  "max-xl:[.solutions-detail-page_&_p]:[line-height:1.2]!": 539,
  "max-md:[.solutions-detail-page_&]:[padding-left:20px]": 980,
  "max-md:[.solutions-detail-page_&]:[padding-right:20px]": 981,
  "max-md:[.solutions-detail-page_&]:[display:flex]!": 309,
  "max-md:[.solutions-detail-page_&]:[flex-direction:column]": 377,
  "max-md:[.solutions-detail-page_&]:[min-height:0]": 311,
  "max-md:[.solutions-detail-page_&]:[position:relative]!": 1000312,
  "max-md:[.solutions-detail-page_&]:[top:auto]!": 1000313,
  "max-md:[.solutions-detail-page_&]:[right:auto]!": 1000314,
  "max-md:[.solutions-detail-page_&]:[bottom:auto]!": 1000315,
  "max-md:[.solutions-detail-page_&]:[left:auto]!": 1000316,
  "max-md:[.solutions-detail-page_&]:[order:1]": 317,
  "max-md:[.solutions-detail-page_&]:[width:100%]!": 1000318,
  "max-md:[.solutions-detail-page_&]:[height:auto]!": 1000319,
  "max-md:[.solutions-detail-page_&]:[aspect-ratio:4096_/_1482]": 320,
  "max-md:[.solutions-detail-page_&]:[object-fit:contain]": 321,
  "max-md:[.solutions-detail-page_&]:[z-index:0]": 322,
  "max-md:[.solutions-detail-page_&]:[display:contents]!": 323,
  "max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(30px,_8vw,_42px)]!": 492,
  "max-md:[.solutions-detail-page_&_h2]:[order:0]": 325,
  "max-md:[.solutions-detail-page_&_h2]:[margin-top:26px]": 326,
  "max-md:[.solutions-detail-page_&_h2]:[margin-right:24px]": 327,
  "max-md:[.solutions-detail-page_&_h2]:[margin-bottom:20px]": 328,
  "max-md:[.solutions-detail-page_&_h2]:[margin-left:24px]": 329,
  "max-md:[.solutions-detail-page_&_p]:[order:2]": 330,
  "max-md:[.solutions-detail-page_&_p]:[margin-top:20px]": 331,
  "max-md:[.solutions-detail-page_&_p]:[margin-right:24px]": 332,
  "max-md:[.solutions-detail-page_&_p]:[margin-bottom:26px]": 333,
  "max-md:[.solutions-detail-page_&_p]:[margin-left:24px]": 334,
  "max-md:[.solutions-detail-page_&_p]:[font-size:13px]!": 335,
  "max-md:[.solutions-detail-page_&_p]:[line-height:1.2]!": 336,
  "max-md:[.solutions-detail-page_&]:[margin-top:48px]": 561,
  "max-md:[.solutions-detail-page_&_fieldset]:[margin-bottom:32px]": 338,
  "max-md:[.solutions-detail-page_&_legend]:[margin-bottom:18px]": 339,
  "max-md:[.solutions-detail-page_&_legend]:[font-size:clamp(20px,_5.4vw,_25px)]!": 340,
  "max-md:[.solutions-detail-page_&]:[grid-template-columns:1fr]": 546,
  "max-md:[.solutions-detail-page_&]:[gap:10px]": 344,
  "max-md:[.solutions-detail-page_&[data-field='phone']]:[order:2]": 345,
  "max-md:[.solutions-detail-page_&[data-field='email']]:[order:3]": 346,
  "max-md:[.solutions-detail-page_&_input]:[padding-left:22px]": 347,
  "max-md:[.solutions-detail-page_&_input]:[padding-right:22px]": 348,
  "max-md:[.solutions-detail-page_&_textarea]:[padding-left:22px]": 349,
  "max-md:[.solutions-detail-page_&_textarea]:[padding-right:22px]": 350,
  "max-md:[.solutions-detail-page_&_textarea]:[height:188px]": 351,
  "max-md:[.solutions-detail-page_&_textarea]:[resize:vertical]": 352,
  "max-md:[.solutions-detail-page_&]:[height:188px]": 353,
  "max-md:[.solutions-detail-page_&]:[padding-top:23px]": 354,
  "max-md:[.solutions-detail-page_&]:[padding-right:18px]": 355,
  "max-md:[.solutions-detail-page_&]:[padding-bottom:23px]": 356,
  "max-md:[.solutions-detail-page_&]:[padding-left:18px]": 357,
  "max-md:[.solutions-detail-page_&]:[align-items:center]": 376,
  "max-md:[.solutions-detail-page_&]:[gap:14px]": 359,
  "max-md:[.solutions-detail-page_&]:[text-align:center]": 360,
  "max-md:[.solutions-detail-page_&]:[display:grid]!": 361,
  "max-md:[.solutions-detail-page_&]:[place-items:center]": 362,
  "max-md:[.solutions-detail-page_&]:[flex-shrink:0]": 363,
  "max-md:[.solutions-detail-page_&]:[width:48px]": 364,
  "max-md:[.solutions-detail-page_&]:[height:48px]": 365,
  "max-md:[.solutions-detail-page_&]:[border-radius:50%]": 366,
  "max-md:[.solutions-detail-page_&]:[background:#e2e8f0]": 367,
  "max-md:[.solutions-detail-page_&]:[color:#475569]!": 368,
  "max-md:[.solutions-detail-page_&_svg]:[width:24px]": 369,
  "max-md:[.solutions-detail-page_&_svg]:[height:24px]": 370,
  "max-md:[.solutions-detail-page_&]:[width:100%]": 379,
  "max-md:[.solutions-detail-page_&]:[justify-content:center]": 372,
  "max-md:[.solutions-detail-page_&]:[gap:6px]": 373,
  "max-md:[.solutions-detail-page_&_svg]:[width:22px]": 374,
  "max-md:[.solutions-detail-page_&_svg]:[height:22px]": 375,
  "max-md:[.solutions-detail-page_&]:[gap:18px]": 378,
  "max-md:[.solutions-detail-page_&]:[align-items:flex-start]": 380,
  "max-md:[.solutions-detail-page_&]:[gap:20px]": 982,
  "max-md:[.solutions-detail-page_&_>_span:last-child]:[flex:1]": 382,
  "max-md:[.solutions-detail-page_&_>_span:last-child]:[text-align:center]": 383,
  "max-md:[.solutions-detail-page_&_>_span:last-child]:[line-height:1.2]!": 384,
  "max-md:[.solutions-detail-page_&]:[align-self:center]": 385,
  "max-md:[.solutions-detail-page_&]:[min-height:44px]": 974,
  "[.solutions-detail-page_&]:[padding-top:calc(90_*_var(--industry-unit))]": 811,
  "[.solutions-detail-page_&]:[padding-bottom:calc(110_*_var(--industry-unit))]": 574,
  "[.solutions-detail-page_&_h2]:[color:#0d5792]!": 511,
  "[.solutions-detail-page_&_h2]:[text-align:center]": 403,
  "[.solutions-detail-page_.other-solutions-inner_>_&]:[justify-content:center]": 404,
  "[.solutions-detail-page_.other-solutions-inner_>_&]:[margin-top:calc(25_*_var(--industry-unit))]": 405,
  "[.solutions-detail-page_&]:[gap:calc(18_*_var(--industry-unit))]": 407,
  "[.solutions-detail-page_&_button]:[width:max(32px,_calc(32_*_var(--industry-unit)))]": 411,
  "[.solutions-detail-page_&_button]:[height:max(32px,_calc(32_*_var(--industry-unit)))]": 412,
  "[.solutions-detail-page_&_button:hover:not(:disabled)]:[color:#0d5792]!": 421,
  "[.solutions-detail-page_&_button:disabled]:[opacity:0.35]": 908,
  "[.solutions-detail-page_&_button:disabled]:[cursor:default]": 909,
  "[.solutions-detail-page_&_svg]:[width:75%]": 424,
  "[.solutions-detail-page_&_svg]:[height:75%]": 425,
  "[.solutions-detail-page_&]:[touch-action:pan-y]": 821,
  "[.solutions-detail-page_&]:[align-items:stretch]": 431,
  "[.solutions-detail-page_&]:[transition:transform_450ms_ease-in-out]": 442,
  "[.solutions-detail-page_&]:[max-width:calc(1040_*_var(--industry-unit))]": 443,
  "[.solutions-detail-page_&]:[margin-top:calc(40_*_var(--industry-unit))]": 613,
  "[.solutions-detail-page_&]:[gap:calc(19_*_var(--industry-unit))]": 448,
  "[.solutions-detail-page_&]:[flex:0_0_calc(292_*_var(--industry-unit))]": 449,
  "[.solutions-detail-page_&]:[min-height:calc(375_*_var(--industry-unit))]": 451,
  "[.solutions-detail-page_&]:[padding-top:calc(12_*_var(--industry-unit))]": 452,
  "[.solutions-detail-page_&]:[padding-right:calc(17_*_var(--industry-unit))]": 453,
  "[.solutions-detail-page_&]:[padding-bottom:calc(12_*_var(--industry-unit))]": 454,
  "[.solutions-detail-page_&]:[padding-left:calc(17_*_var(--industry-unit))]": 455,
  "[.solutions-detail-page_&]:[border-radius:calc(15_*_var(--industry-unit))]": 456,
  "[.solutions-detail-page_&]:[height:calc(240_*_var(--industry-unit))]": 460,
  "[.solutions-detail-page_&]:[border-radius:calc(17_*_var(--industry-unit))]": 461,
  "[.solutions-detail-page_&_img]:[object-fit:cover]": 463,
  "[.solutions-detail-page_&_h3]:[margin-top:calc(25_*_var(--industry-unit))]": 464,
  "[.solutions-detail-page_&_h3]:[margin-right:0]": 749,
  "[.solutions-detail-page_&_h3]:[margin-bottom:0]": 750,
  "[.solutions-detail-page_&_h3]:[margin-left:0]": 751,
  "[.solutions-detail-page_&_h3]:[color:#000]!": 468,
  "[.solutions-detail-page_&_h3]:[font-size:calc(20_*_var(--industry-unit))]!": 469,
  "[.solutions-detail-page_&_h3]:[font-weight:410]!": 753,
  "[.solutions-detail-page_&_h3]:[line-height:1.07]!": 754,
  "[.solutions-detail-page_&_h3]:[text-align:center]": 472,
  "[.solutions-detail-page_&_h3_span]:[display:block]!": 473,
  "[.solutions-detail-page_&]:[left:auto]": 479,
  "[.solutions-detail-page_&]:[width:min(24%,_calc(220_*_var(--industry-unit)))]": 480,
  "[.solutions-detail-page_&_span]:[position:absolute]": 482,
  "[.solutions-detail-page_&_span]:[top:0]": 483,
  "[.solutions-detail-page_&_span]:[right:0]": 484,
  "[.solutions-detail-page_&_span]:[bottom:0]": 485,
  "[.solutions-detail-page_&_span]:[left:0]": 486,
  "[.solutions-detail-page_&_span:last-child]:[background:linear-gradient(90deg,_transparent,_#fafcff55)]": 487,
  "max-md:[.solutions-detail-page_&]:[padding-top:64px]": 488,
  "max-md:[.solutions-detail-page_&]:[padding-bottom:80px]": 936,
  "max-md:[.solutions-detail-page_&]:[width:min(18%,_65px)]": 493,
  "max-md:[.solutions-detail-page_&]:[flex-basis:min(292px,_calc(100vw_-_56px))]": 494,
  "[.solutions-detail-page_&]:[grid-template-columns:minmax(0,_539fr)_minmax(0,_449fr)_auto]": 504,
  "[.solutions-detail-page_&]:[gap:calc(45_*_var(--industry-unit))]": 506,
  "[.solutions-detail-page_&_p]:[margin-top:0]": 515,
  "[.solutions-detail-page_&_p]:[color:#1d2049]!": 519,
  "[.solutions-detail-page_&_p]:[letter-spacing:0]": 522,
  "[.solutions-detail-page_&]:[margin-top:calc(45_*_var(--industry-unit))]": 523,
  "[.solutions-detail-page_&]:[gap:calc(14_*_var(--industry-unit))]": 524,
  "[.solutions-detail-page_&]:[flex:0_0_calc(136.28_*_var(--industry-unit))]": 526,
  "[.solutions-detail-page_&]:[height:calc(136.28_*_var(--industry-unit))]": 527,
  "[.solutions-detail-page_&]:[border-radius:calc(20.44_*_var(--industry-unit))]": 528,
  "[.solutions-detail-page_&]:[background:#fff]": 775,
  "[.solutions-detail-page_&_img]:[object-fit:contain]": 531,
  "[.solutions-detail-page_&_img]:[padding-top:calc(10_*_var(--industry-unit))]": 532,
  "[.solutions-detail-page_&_img]:[padding-right:calc(10_*_var(--industry-unit))]": 533,
  "[.solutions-detail-page_&_img]:[padding-bottom:calc(10_*_var(--industry-unit))]": 534,
  "[.solutions-detail-page_&_img]:[padding-left:calc(10_*_var(--industry-unit))]": 535,
  "max-xl:[.solutions-detail-page_&]:[grid-template-columns:minmax(0,_1.2fr)_minmax(0,_1fr)]": 536,
  "max-xl:[.solutions-detail-page_&]:[gap:28px]": 537,
  "max-xl:[.solutions-detail-page_&_h2]:[font-size:clamp(32px,_4.1vw,_50px)]!": 538,
  "max-xl:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[grid-column:1_/_-1]": 540,
  "max-xl:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[justify-content:flex-end]": 541,
  "max-md:[.solutions-detail-page_&]:[padding-top:0]": 934,
  "max-md:[.solutions-detail-page_&]:[padding-right:0]": 543,
  "max-md:[.solutions-detail-page_&]:[padding-left:0]": 545,
  "max-md:[.solutions-detail-page_&]:[gap:22px]": 547,
  "max-md:[.solutions-detail-page_&]:[padding-left:32px]": 548,
  "max-md:[.solutions-detail-page_&]:[padding-right:32px]": 549,
  "max-md:[.solutions-detail-page_&_h2]:[font-size:clamp(27px,_7.2vw,_42px)]!": 550,
  "max-md:[.solutions-detail-page_&_p]:[text-align:justify]": 551,
  "max-md:[.solutions-detail-page_&_p]:[font-size:15px]!": 552,
  "max-md:[.solutions-detail-page_&_p]:[line-height:1.07]!": 553,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[justify-content:center]": 554,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[margin-top:22px]": 555,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_>_&]:[gap:18px]": 556,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_&_button]:[width:32px]": 557,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_&_button]:[height:32px]": 558,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_&_svg]:[width:100%]": 559,
  "max-md:[.solutions-detail-page_.infrastructure-pump-header_&_svg]:[height:100%]": 560,
  "max-md:[.solutions-detail-page_&]:[gap:12px]": 562,
  "max-md:[.solutions-detail-page_&]:[flex-basis:34.5vw]": 563,
  "max-md:[.solutions-detail-page_&]:[height:34.5vw]": 564,
  "max-md:[.solutions-detail-page_&]:[border-radius:20px]": 565,
  "max-md:[.solutions-detail-page_.infrastructure-pump-viewport_&]:[display:none]!": 566,
  "[--industry-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 567,
  "[width:100%]": 568,
  "[background:radial-gradient(ellipse_at_28%_65%,_#acd5ff24,_transparent_62%),_radial-gradient(ellipse_at_48%_90%,_#c5e5ff33,_transparent_65%),_linear-gradient(105deg,_#d2e8ff_0%,_#dceeff_28%,_#ebf5ff_56%,_#fafcff_84%,_#fff_100%)]": 569,
  "[letter-spacing:-0.04em]": 570,
  "[body:has(&)_>_.site-header]:[background:#fff]": 571,
  "[.solutions-detail-page_&]:[padding-top:calc(80_*_var(--industry-unit))]": 578,
  "[.solutions-detail-page_&::before]:[content:'']": 674,
  "[.solutions-detail-page_&::before]:[position:absolute]": 675,
  "[.solutions-detail-page_&::before]:[top:0]": 676,
  "[.solutions-detail-page_&::before]:[right:0]": 677,
  "[.solutions-detail-page_&::before]:[bottom:0]": 678,
  "[.solutions-detail-page_&::before]:[left:0]": 679,
  "[.solutions-detail-page_&::before]:[z-index:-1]": 588,
  "[.solutions-detail-page_&::before]:[pointer-events:none]": 682,
  "[.solutions-detail-page_&::before]:[background:radial-gradient(ellipse_at_50%_65%,_#f0f3f7_0%,_#fafbfc_45%,_#fff_75%)]": 590,
  "[.solutions-detail-page_&::before]:[mask-image:linear-gradient(to_bottom,_#000_0%,_#000_68%,_#000000e6_78%,_#00000066_90%,_transparent_100%)]": 591,
  "[.solutions-detail-page_&]:[text-align:center]": 592,
  "[.solutions-detail-page_&_h1]:[margin-top:0]": 593,
  "[.solutions-detail-page_&_h1]:[margin-right:0]": 594,
  "[.solutions-detail-page_&_h1]:[margin-bottom:0]": 595,
  "[.solutions-detail-page_&_h1]:[margin-left:0]": 596,
  "[.solutions-detail-page_&_h1]:[font-size:calc(50_*_var(--industry-unit))]!": 597,
  "[.solutions-detail-page_&_h1]:[font-weight:410]!": 598,
  "[.solutions-detail-page_&_h1]:[line-height:1]!": 599,
  "[.solutions-detail-page_&_h1]:[color:#0d5792]!": 600,
  "[.solutions-detail-page_&_>_p]:[width:calc(690_*_var(--industry-unit))]": 601,
  "[.solutions-detail-page_&_>_p]:[max-width:100%]": 602,
  "[.solutions-detail-page_&_>_p]:[margin-top:calc(36_*_var(--industry-unit))]": 603,
  "[.solutions-detail-page_&_>_p]:[margin-right:auto]": 604,
  "[.solutions-detail-page_&_>_p]:[margin-bottom:0]": 605,
  "[.solutions-detail-page_&_>_p]:[margin-left:auto]": 606,
  "[.solutions-detail-page_&_>_p]:[font-size:calc(15_*_var(--industry-unit))]!": 607,
  "[.solutions-detail-page_&_>_p]:[line-height:1]!": 608,
  "[.solutions-detail-page_&_>_p]:[color:#27272a]!": 609,
  "[.solutions-detail-page_&]:[max-width:calc(1440_*_var(--industry-unit))]": 612,
  "[.solutions-detail-page_&]:[aspect-ratio:1376_/_768]": 619,
  "[.solutions-detail-page_&::before]:[background:radial-gradient(ellipse_at_50%_52%,_#e6f1fa35,_transparent_72%)]": 626,
  "[.solutions-detail-page_&]:[object-fit:contain]": 781,
  "[.solutions-detail-page_&]:[mask-image:radial-gradient(ellipse_75%_150%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%),_radial-gradient(ellipse_150%_75%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%)]": 629,
  "[.solutions-detail-page_&]:[mask-composite:intersect]": 630,
  "[.solutions-detail-page_&]:[-webkit-mask-image:radial-gradient(ellipse_75%_150%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%),_radial-gradient(ellipse_150%_75%_at_center,_#000_56%,_#000000e6_60%,_transparent_67%)]": 631,
  "[.solutions-detail-page_&]:[-webkit-mask-composite:source-in]": 632,
  "[.solutions-detail-page_&]:[justify-content:center]": 895,
  "[.solutions-detail-page_&]:[gap:16px]": 737,
  "[.solutions-detail-page_&]:[background:radial-gradient(ellipse,_#e8f4fb88,_transparent_70%)]": 644,
  "[.solutions-detail-page_&_svg]:[width:42px]": 646,
  "[.solutions-detail-page_&_svg]:[height:42px]": 647,
  "[.solutions-detail-page_&]:[z-index:1]": 665,
  "[.solutions-detail-page_&]:[transform:translate(-50%,_-50%)]": 652,
  "[.solutions-detail-page_&]:[width:max(36px,_calc(64_*_var(--industry-unit)))]": 653,
  "[.solutions-detail-page_&]:[height:max(36px,_calc(64_*_var(--industry-unit)))]": 654,
  "[.solutions-detail-page_&]:[border:0]": 852,
  "[.solutions-detail-page_&]:[background:transparent]": 854,
  "[.solutions-detail-page_&]:[box-shadow:0_4px_24px_#005eff26]": 662,
  "[.solutions-detail-page_&]:[display:block]!": 887,
  "[.solutions-detail-page_&]:[width:62%]": 667,
  "[.solutions-detail-page_&]:[height:62%]": 668,
  "[.solutions-detail-page_&]:[border:2px_solid_#d9e8ff]": 669,
  "[.solutions-detail-page_&]:[outline:1px_solid_#005eff]": 670,
  "[.solutions-detail-page_&]:[background:linear-gradient(180deg,_#0065ff,_#002399)]": 672,
  "[.solutions-detail-page_&]:[box-shadow:0_0_0_4px_#b9ddff66,_0_0_0_7px_#f5faff80,_0_0_0_8px_#005eff40]": 673,
  "[.solutions-detail-page_&::before]:[border:1px_solid_#005eff99]": 680,
  "[.solutions-detail-page_&::before]:[border-radius:inherit]": 681,
  "[.solutions-detail-page_&::before]:[opacity:0]": 683,
  "[.solutions-detail-page_&::before]:animate-migrated-c542d7896": 684,
  "[.solutions-detail-page_&::after]:[content:'']": 685,
  "[.solutions-detail-page_&::after]:[position:absolute]": 686,
  "[.solutions-detail-page_&::after]:[top:0]": 687,
  "[.solutions-detail-page_&::after]:[right:0]": 688,
  "[.solutions-detail-page_&::after]:[bottom:0]": 689,
  "[.solutions-detail-page_&::after]:[left:0]": 690,
  "[.solutions-detail-page_&::after]:[border:1px_solid_#005eff99]": 691,
  "[.solutions-detail-page_&::after]:[border-radius:inherit]": 692,
  "[.solutions-detail-page_&::after]:[pointer-events:none]": 693,
  "[.solutions-detail-page_&::after]:[opacity:0]": 694,
  "[.solutions-detail-page_&::after]:animate-migrated-c542d7896": 695,
  "[.solutions-detail-page_&::before]:[animation-delay:calc(-1_*_var(--hotspot-delay))]": 696,
  "[.solutions-detail-page_&::after]:[animation-delay:calc(0.65s_-_var(--hotspot-delay))]": 697,
  "[.solutions-detail-page_&]:[bottom:calc(100%_+_12px)]": 699,
  "[.solutions-detail-page_&]:[left:50%]": 700,
  "[.solutions-detail-page_&]:[transform:translate(-50%,_5px)]": 701,
  "[.solutions-detail-page_&]:[width:max-content]": 702,
  "[.solutions-detail-page_&]:[max-width:220px]": 703,
  "[.solutions-detail-page_&]:[padding-top:9px]": 704,
  "[.solutions-detail-page_&]:[padding-right:14px]": 705,
  "[.solutions-detail-page_&]:[padding-bottom:9px]": 706,
  "[.solutions-detail-page_&]:[padding-left:14px]": 707,
  "[.solutions-detail-page_&]:[border:0.5px_solid_#ffffffb3]": 708,
  "[.solutions-detail-page_&]:[border-radius:10px]": 709,
  "[.solutions-detail-page_&]:[background:#f7fbfff2]": 710,
  "[.solutions-detail-page_&]:[box-shadow:0_4px_18px_#0d579222]": 711,
  "[.solutions-detail-page_&]:[font-size:clamp(11px,_0.95vw,_18px)]!": 713,
  "[.solutions-detail-page_&]:[line-height:1.15]!": 714,
  "[.solutions-detail-page_&]:[opacity:0]": 806,
  "[.solutions-detail-page_&]:[visibility:hidden]": 716,
  "[.solutions-detail-page_&]:[transition:opacity_180ms_ease,_transform_180ms_ease]": 718,
  "[.solutions-detail-page_&:is(:hover,_:focus)]:[z-index:2]": 719,
  "[.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[opacity:1]": 720,
  "[.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[visibility:visible]": 721,
  "[.solutions-detail-page_.industry-hotspot:is(:hover,_:focus)_&]:[transform:translate(-50%,_0)]": 722,
  "[.solutions-detail-page_&]:[--popup-unit:1px]": 723,
  "[.solutions-detail-page_&]:[width:280px]": 726,
  "[.solutions-detail-page_&]:[max-width:calc(100%_-_24px)]": 727,
  "[.solutions-detail-page_&]:[left:clamp(12px,_var(--popup-anchor-left),_max(12px,_calc(100%_-_292px)))]": 728,
  "[.solutions-detail-page_&]:[top:clamp(12px,_calc(var(--popup-y)_-_60px),_max(12px,_calc(100%_-_232px)))]": 729,
  "[.solutions-detail-page_&]:[border-radius:18px]": 730,
  "[.solutions-detail-page_&]:[box-shadow:0_10px_30px_#0d579226]": 732,
  "[.solutions-detail-page_&]:animate-migrated-541932b35": 733,
  "[.solutions-detail-page_&]:[min-height:72px]": 795,
  "[.solutions-detail-page_&]:[padding-top:14px]": 739,
  "[.solutions-detail-page_&]:[padding-right:48px]": 740,
  "[.solutions-detail-page_&]:[padding-bottom:14px]": 741,
  "[.solutions-detail-page_&]:[padding-left:20px]": 742,
  "[.solutions-detail-page_&]:[color:#fff]!": 869,
  "[.solutions-detail-page_&]:[background:linear-gradient(125deg,_#53a7c5a6,_#dfe8f1a6)]": 744,
  "[.solutions-detail-page_&_>_svg]:[flex-shrink:0]": 745,
  "[.solutions-detail-page_&_>_svg]:[width:32px]": 746,
  "[.solutions-detail-page_&_>_svg]:[height:32px]": 747,
  "[.solutions-detail-page_&_h3]:[margin-top:0]": 748,
  "[.solutions-detail-page_&_h3]:[font-size:19px]!": 752,
  "[.solutions-detail-page_&_button]:[position:absolute]": 755,
  "[.solutions-detail-page_&_button]:[top:10px]": 756,
  "[.solutions-detail-page_&_button]:[right:10px]": 757,
  "[.solutions-detail-page_&_button]:[border-radius:50%]": 767,
  "[.solutions-detail-page_&_button]:[color:#101010]!": 769,
  "[.solutions-detail-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))]": 772,
  "[.solutions-detail-page_&]:[max-height:min(300px,_50svh)]": 773,
  "[.solutions-detail-page_&]:[grid-column:span_2]": 777,
  "[.solutions-detail-page_&]:[height:150px]": 778,
  "[.solutions-detail-page_&:last-child:nth-child(odd)]:[grid-column:2_/_span_2]": 780,
  "[.solutions-detail-page_&]:[background:#f8fbfd]": 786,
  "[.solutions-detail-page_&]:[font-size:14px]!": 787,
  "[.solutions-detail-page_&]:[top:auto]": 789,
  "[.solutions-detail-page_&]:[padding-top:12px]": 796,
  "[.solutions-detail-page_&]:[padding-right:12px]": 797,
  "[.solutions-detail-page_&]:[padding-bottom:12px]": 798,
  "[.solutions-detail-page_&]:[padding-left:12px]": 799,
  "[.solutions-detail-page_&]:[border:0.5px_solid_#ffffffa6]": 800,
  "[.solutions-detail-page_&]:[background:linear-gradient(135deg,_#e8f4fb80,_#a7c6f380)]": 801,
  "[.solutions-detail-page_&]:[box-shadow:0_-8px_24px_#005eff18]": 802,
  "[.solutions-detail-page_&]:[font-size:22px]!": 804,
  "[.solutions-detail-page_&]:[line-height:1]!": 805,
  "[.solutions-detail-page_&]:[transform:translateY(8px)]": 807,
  "[.solutions-detail-page_&]:[transition:opacity_200ms_ease,_transform_200ms_ease]": 808,
  "[.solutions-detail-page_.industry-popup-product:is(:hover,_:focus)_&]:[opacity:1]": 809,
  "[.solutions-detail-page_.industry-popup-product:is(:hover,_:focus)_&]:[transform:translateY(0)]": 810,
  "[.solutions-detail-page_&]:[padding-bottom:calc(100_*_var(--industry-unit))]": 813,
  "[.solutions-detail-page_&]:[align-items:flex-start]": 840,
  "[.solutions-detail-page_&]:[gap:calc(40_*_var(--industry-unit))]": 825,
  "[.solutions-detail-page_&]:[padding-top:calc(35_*_var(--industry-unit))]": 830,
  "[.solutions-detail-page_&]:[padding-bottom:calc(35_*_var(--industry-unit))]": 832,
  "[.solutions-detail-page_&]:[min-height:calc(730_*_var(--industry-unit))]": 835,
  "[.solutions-detail-page_&]:[flex:0_0_var(--industry-slot-width)]": 836,
  "[.solutions-detail-page_&]:[gap:calc(22_*_var(--industry-unit))]": 842,
  "[.solutions-detail-page_&]:[width:calc(120_*_var(--industry-unit))]": 912,
  "[.solutions-detail-page_&]:[max-width:100%]": 913,
  "[.solutions-detail-page_&]:[min-height:calc(130_*_var(--industry-unit))]": 845,
  "[.solutions-detail-page_&]:[border-radius:calc(20_*_var(--industry-unit))]": 853,
  "[.solutions-detail-page_&]:[text-align:left]": 856,
  "[.solutions-detail-page_&]:[transition:width_350ms_ease,_min-height_350ms_ease,_padding_350ms_ease,_background-color_350ms_ease,_box-shadow_350ms_ease]": 858,
  "[.solutions-detail-page_&]:[line-height:1.12]!": 920,
  "[.solutions-detail-page_&]:[transition:font-size_350ms_ease]": 861,
  "[.solutions-detail-page_&]:[width:calc(30_*_var(--industry-unit))]": 865,
  "[.solutions-detail-page_&]:[height:calc(30_*_var(--industry-unit))]": 866,
  "[.solutions-detail-page_&]:[background:#27272a]": 868,
  "[.solutions-detail-page_&_svg]:[width:60%]": 870,
  "[.solutions-detail-page_&_svg]:[height:60%]": 871,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:calc(161_*_var(--industry-unit))]": 872,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[min-height:calc(249_*_var(--industry-unit))]": 873,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-top:calc(20_*_var(--industry-unit))]": 874,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-right:calc(20_*_var(--industry-unit))]": 875,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-bottom:calc(20_*_var(--industry-unit))]": 876,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-left:calc(20_*_var(--industry-unit))]": 877,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[border-radius:calc(15_*_var(--industry-unit))]": 878,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[background:#f7f7f7]": 879,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[box-shadow:0_-20px_50px_#005eff18]": 880,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:100%]": 881,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[font-size:calc(22_*_var(--industry-unit))]!": 882,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[font-weight:540]!": 883,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[font-variation-settings:'wght'_540,_'wdth'_125]!": 884,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1.07]!": 885,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[text-align:center]": 926,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[border:0.5px_solid_#dceaff]": 888,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[background:linear-gradient(135deg,_#438aff,_#004bdc)]": 889,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[box-shadow:0_0_calc(21_*_var(--industry-unit))_calc(7_*_var(--industry-unit))_#005eff40,_inset_0_1px_2px_#ffffff99]": 890,
  "[.solutions-detail-page_.industry-carousel-item--active_&&_svg]:[width:70%]": 891,
  "[.solutions-detail-page_.industry-carousel-item--active_&&_svg]:[height:70%]": 892,
  "[.solutions-detail-page_&]:[min-height:calc(46_*_var(--industry-unit))]": 893,
  "[.solutions-detail-page_&]:[gap:calc(15_*_var(--industry-unit))]": 896,
  "[.solutions-detail-page_&]:[padding-top:calc(10_*_var(--industry-unit))]": 897,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[min-height:calc(115_*_var(--industry-unit))]": 898,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[padding-top:calc(50_*_var(--industry-unit))]": 899,
  "[.solutions-detail-page_&_button]:[width:max(32px,_calc(30_*_var(--industry-unit)))]": 902,
  "[.solutions-detail-page_&_button]:[height:max(32px,_calc(30_*_var(--industry-unit)))]": 903,
  "[.solutions-detail-page_&_svg]:[width:90%]": 910,
  "[.solutions-detail-page_&_svg]:[height:90%]": 911,
  "[.solutions-detail-page_&]:[margin-top:calc(16_*_var(--industry-unit))]": 914,
  "[.solutions-detail-page_&]:[overflow-wrap:anywhere]": 921,
  "[.solutions-detail-page_&]:[transition:width_350ms_ease,_font-size_350ms_ease]": 922,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:calc(135_*_var(--industry-unit))]": 923,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[font-size:calc(15_*_var(--industry-unit))]!": 924,
  "[.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1]!": 925,
  "[&_button:focus-visible]:[outline:2px_solid_#005eff]": 927,
  "[&_button:focus-visible]:[outline-offset:3px]": 928,
  "[&_a:focus-visible]:[outline:2px_solid_#005eff]": 929,
  "[&_a:focus-visible]:[outline-offset:3px]": 930,
  "max-xl:[--industry-unit:1px]": 931,
  "max-xl:[.solutions-detail-page_&_h1]:[font-size:clamp(30px,_4.1vw,_50px)]!": 932,
  "max-xl:[.solutions-detail-page_&_>_p]:[line-height:1.2]!": 933,
  "max-md:[.solutions-detail-page_&]:[padding-top:52px]": 938,
  "max-md:[.solutions-detail-page_&]:[padding-bottom:0]": 940,
  "max-md:[.solutions-detail-page_&_h1]:[font-size:clamp(27px,_7.5vw,_40px)]!": 942,
  "max-md:[.solutions-detail-page_&_h1]:[line-height:1.1]!": 943,
  "max-md:[.solutions-detail-page_&_span]:[max-width:80%]": 944,
  "max-md:[.solutions-detail-page_&_span]:[text-align:center]": 945,
  "max-md:[.solutions-detail-page_&]:[width:clamp(22px,_6vw,_36px)]": 946,
  "max-md:[.solutions-detail-page_&]:[height:clamp(22px,_6vw,_36px)]": 947,
  "max-md:[.solutions-detail-page_&]:[border-width:1px]": 948,
  "max-md:[.solutions-detail-page_&]:[box-shadow:0_0_0_2px_#b9ddff66,_0_0_0_4px_#f5faff80,_0_0_0_5px_#005eff40]": 949,
  "max-md:[.solutions-detail-page_&]:[position:absolute]": 950,
  "max-md:[.solutions-detail-page_&]:[width:200px]": 951,
  "max-md:[.solutions-detail-page_&]:[max-width:calc(100%_-_16px)]": 952,
  "max-md:[.solutions-detail-page_&]:[margin-top:0]": 953,
  "max-md:[.solutions-detail-page_&]:[margin-right:0]": 954,
  "max-md:[.solutions-detail-page_&]:[margin-bottom:0]": 955,
  "max-md:[.solutions-detail-page_&]:[margin-left:0]": 956,
  "max-md:[.solutions-detail-page_&]:[border-radius:12px]": 957,
  "max-md:[.solutions-detail-page_&]:[min-height:52px]": 958,
  "max-md:[.solutions-detail-page_&]:[padding-top:8px]": 976,
  "max-md:[.solutions-detail-page_&]:[padding-right:25px]": 960,
  "max-md:[.solutions-detail-page_&]:[padding-bottom:8px]": 978,
  "max-md:[.solutions-detail-page_&]:[padding-left:8px]": 979,
  "max-md:[.solutions-detail-page_&]:[gap:5px]": 963,
  "max-md:[.solutions-detail-page_&_>_svg]:[width:18px]": 964,
  "max-md:[.solutions-detail-page_&_>_svg]:[height:18px]": 965,
  "max-md:[.solutions-detail-page_&_h3]:[font-size:clamp(10px,_2.6vw,_13px)]!": 966,
  "max-md:[.solutions-detail-page_&_h3]:[overflow-wrap:anywhere]": 967,
  "max-md:[.solutions-detail-page_&_button]:[width:22px]": 968,
  "max-md:[.solutions-detail-page_&_button]:[height:22px]": 969,
  "max-md:[.solutions-detail-page_&_button]:[right:2px]": 970,
  "max-md:[.solutions-detail-page_&_button]:[top:4px]": 971,
  "max-md:[.solutions-detail-page_&]:[max-height:120px]": 972,
  "max-md:[.solutions-detail-page_&]:[height:90px]": 973,
  "max-md:[.solutions-detail-page_&]:[font-size:16px]!": 975,
  "max-md:[.solutions-detail-page_&]:[padding-right:8px]": 977,
  "max-md:[.solutions-detail-page_&]:[min-height:620px]": 983,
  "max-md:[.solutions-detail-page_&]:[width:min(120px,_100%)]": 984,
  "max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:min(161px,_100%)]": 985,
  "max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[width:min(160px,_100%)]": 986,
  "max-md:[.solutions-detail-page_.industry-carousel-item--active_&&]:[line-height:1.2]!": 987,
  "motion-reduce:[&_*]:[transition:none]!": 1000988,
  "motion-reduce:[&_*]:[animation:none]!": 1000989,
  "motion-reduce:[.solutions-detail-page_&::before]:[animation:none]": 990,
  "motion-reduce:[.solutions-detail-page_&::before]:[opacity:0]": 991,
  "motion-reduce:[.solutions-detail-page_&::after]:[animation:none]": 992,
  "motion-reduce:[.solutions-detail-page_&::after]:[opacity:0]": 993,
};
function twsolutionsdetailPage(value: string | undefined): string {
  const names = (value ?? "").split(/\s+/).filter(Boolean);
  const selected = new Map<string, string>();
  for (const name of names)
    for (const token of (twsolutionsdetailPageRules[name] ?? "")
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
        (twsolutionsdetailPagePriority[token] ?? 0) >=
          (twsolutionsdetailPagePriority[old] ?? 0)
      )
        selected.set(key, token);
    }
  return [...names, ...selected.values()].join(" ");
}
