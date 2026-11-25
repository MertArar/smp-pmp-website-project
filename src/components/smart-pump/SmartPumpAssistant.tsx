"use client";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import useViewportVideo from "@/components/media/useViewportVideo";

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

function CoordinatesVideo({
  filterId,
  assetBase,
}: {
  filterId: string;
  assetBase: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useViewportVideo(ref);
  return (
    <video
      ref={ref}
      data-catalog-video="magnific_create-a-video_Cqq3aLIEEy.mp4"
      muted
      loop
      playsInline
      preload="none"
      aria-label="SEMPA engineering heritage since 1972"
      style={{ filter: `url("#${filterId}")` }}
      className="size-full object-contain"
    >
      <source
        data-video-src={`${assetBase}/magnific_create-a-video_Cqq3aLIEEy.mp4`}
        type="video/mp4"
      />
    </video>
  );
}
/** Same 650ms sliding-circle interaction as SmartPump.tsx. */
function AssistantLink({
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
      className={`group relative inline-flex h-[43px] min-h-[43px] w-[192px] shrink-0 items-center overflow-hidden rounded-[19px] border-[0.5px] border-[#9eb7d0] bg-white/20 text-left text-[15px] text-[#252525] backdrop-blur-[11px] transition-[background-color] duration-[350ms] hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] motion-reduce:transition-none ${className}`}
    >
      <span
        className="absolute left-[14px] top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[34px] group-focus-visible:translate-x-[34px] motion-reduce:transition-none"
        style={{
          fontFamily: "var(--font-sf-pro), sans-serif",
          fontWeight: 410,
          fontVariationSettings: '"wght" 410, "wdth" 125',
          fontSize: "15px",
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

export default function SmartPumpAssistant({
  assetBase,
  headingId,
}: {
  assetBase: string;
  headingId?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const filterId = `assistant-coordinates-${instanceId}`;
  const titleId = headingId ?? `assistant-heading-${instanceId}`;
  return (
    <section
      data-smart-pump-assistant
      aria-labelledby={titleId}
      style={
        {
          "--assistant-art": `url("${assetBase}/robot-el.webp")`,
        } as CSSProperties
      }
      className="relative isolate mx-auto mt-20 text-[#0d5792] [container-type:inline-size] w-full max-w-[1700px] overflow-hidden px-5 pt-8 pb-6 md:mt-16 md:w-[94%] md:px-8 md:py-8 lg:mt-16 lg:w-[94%] lg:px-6 lg:py-8 xl:px-10"
    >
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        className="pointer-events-none absolute"
        focusable="false"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -20 0 0 0 19"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_45%,#a8c9ff99,transparent_65%)] [mask-image:radial-gradient(ellipse,#000_20%,transparent_75%)]"
      />
      <div className="grid items-center gap-8 max-md:gap-0 md:min-h-[470px] md:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] md:gap-8 lg:min-h-[580px] lg:gap-14 xl:min-h-[680px]">
        <div
          data-selection-copy
          className="max-md:contents relative z-10 mx-auto w-full max-w-[590px] md:mx-0"
        >
          <motion.h2
            {...reveal("left", 0, reduced, 0.28)}
            id={titleId}
            className="max-md:order-1 text-[clamp(32px,3.5vw,50px)] leading-none tracking-[-.04em] md:text-[clamp(30px,3.5vw,50px)]"
          >
            Smart Pump
            <br />
            Selection Assistant
          </motion.h2>
          <motion.p
            {...reveal("up", 0.08, reduced, 0.28)}
            className="max-md:order-2 max-md:text-[#9eb7d0] mt-8 max-w-[510px] text-[15px] leading-[1.15] text-[#648caa] md:mt-7 md:text-[13px] lg:mt-10 lg:text-[15px]"
          >
            Discover the most efficient pumping solution in seconds. Simply
            enter your technical parameters such as flow rate, pressure, and
            fluid type, and let our advanced configurator select the ideal Sempa
            pump for your specific industry needs.
          </motion.p>
          <motion.div
            {...reveal("left", 0.09, reduced, 0.2)}
            data-assistant-long-card
            className="relative isolate max-md:order-5 max-md:mt-0 max-md:mb-12 mt-8 rounded-[30px] border border-white/40 bg-white/20 p-6 shadow-[0_4px_45px_#005eff10] backdrop-blur-[20px] md:mt-8 md:p-5 lg:mt-10 lg:flex lg:w-[100cqw] lg:items-center lg:gap-6 lg:px-[42px] lg:py-[56px] lg:border-transparent lg:shadow-none lg:bg-transparent! lg:backdrop-blur-none"
          >
            <div
              data-assistant-glass
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 hidden rounded-[30px] border border-white/60 bg-white/25 backdrop-blur-[20px] [mask-image:linear-gradient(90deg,#000_0%,#000_20%,rgba(0,0,0,.85)_38%,transparent_62%)] lg:block"
            />
            <div className="relative z-10 flex items-center gap-3 lg:min-w-0 lg:w-[56cqw] lg:flex-none lg:gap-[35px]">
              <h3 className="max-md:text-[25px] min-w-0 flex-1 text-[clamp(20px,2vw,25px)] leading-none md:text-[18px] lg:w-[225px] lg:flex-none lg:text-[25px]">
                Find the Perfect
                <br />
                Match for Your
                <br />
                Project
              </h3>
              <div className="aspect-[130/96] w-[90px] shrink-0 overflow-hidden bg-transparent sm:w-[110px] md:w-[72px] lg:w-[110px] max-md:w-[130px]">
                <CoordinatesVideo filterId={filterId} assetBase={assetBase} />
              </div>
            </div>
            <AssistantLink
              href="/contact"
              className="max-md:hidden relative z-20 mt-6 lg:mt-0 lg:w-[192px] lg:text-[15px]"
            >
              Pump Selection
            </AssistantLink>
          </motion.div>
        </div>
        <motion.div
          {...reveal("up", 0.1, reduced, 0.28)}
          className="relative z-10 order-3 mt-12 w-fit md:hidden"
        >
          <AssistantLink href="/contact">Pump Selection</AssistantLink>
        </motion.div>
        <motion.div
          {...reveal("right", 0.07, reduced, 0.22)}
          data-selection-art
          className="max-md:order-4 max-md:-mt-16 max-md:aspect-[1/1.1] pointer-events-none relative mx-auto aspect-square w-full max-w-[700px] min-w-0 md:mx-0 md:aspect-[1/1.2] lg:aspect-[1/1.05]"
        >
          <Image
            src={`${assetBase}/robot-el.webp`}
            alt="Robotic hand holding a blue SEMPA pump"
            fill
            sizes="(min-width:1440px) 660px, (min-width:1024px) 48vw, 90vw"
            className="object-contain object-center md:object-right lg:origin-right lg:scale-[1.12]"
          />
        </motion.div>
      </div>
      <style jsx global>{`
        [data-smart-pump-assistant] [data-assistant-long-card] video {
          mix-blend-mode: normal;
          background: transparent;
          mask-image: none;
        }
        @media (min-width: 1024px) {
          [data-smart-pump-assistant] {
            width: 83.333333%;
            padding-left: 0;
            padding-right: 0;
            overflow: visible;
          }
          [data-smart-pump-assistant] [data-selection-art] {
            width: 110%;
            max-width: none;
            justify-self: end;
            margin-right: -6vw;
          }
          [data-smart-pump-assistant] [data-assistant-long-card] video {
            mask-image: none;
          }
          [data-smart-pump-assistant]
            [data-assistant-long-card]
            div:has(> video) {
            mix-blend-mode: multiply;
          }
          [data-smart-pump-assistant] [data-selection-art] img {
            transform: none;
            object-position: center;
            mask-image: linear-gradient(
              90deg,
              #000 0%,
              #000 65%,
              transparent 79%
            );
          }
          [data-smart-pump-assistant] [data-selection-art]::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--assistant-art) center / contain no-repeat;
            filter: blur(18px);
            mask-image: linear-gradient(
              90deg,
              transparent 63%,
              #000 78%,
              #000 92%,
              transparent 100%
            );
            pointer-events: none;
          }
        }
        @layer utilities {
          @media (width < 768px) {
            [data-smart-pump-assistant] {
              margin-top: 0;
              padding: 24px 7% 0;
            }
            [data-smart-pump-assistant] [data-selection-copy] h2 {
              font-size: 30px !important;
              line-height: 1.03 !important;
            }
            [data-smart-pump-assistant] [data-selection-copy] > p {
              font-size: 15px !important;
              line-height: 1.2 !important;
              margin-top: 24px;
            }
            [data-smart-pump-assistant] [data-selection-art] {
              width: 118%;
              max-width: none;
              margin-left: -9%;
              margin-top: -75px;
              aspect-ratio: 1/1.15;
            }
            [data-smart-pump-assistant] [data-selection-art] img {
              transform: scale(1.2);
              mask-image: linear-gradient(
                90deg,
                #000 0%,
                #000 65%,
                transparent 79%
              );
            }
            [data-smart-pump-assistant] [data-selection-art]::after {
              content: "";
              position: absolute;
              inset: 0;
              background: var(--assistant-art) center / contain no-repeat;
              transform: scale(1.2);
              filter: blur(14px);
              mask-image: linear-gradient(
                90deg,
                transparent 63%,
                #000 78%,
                #000 92%,
                transparent 100%
              );
              pointer-events: none;
            }
            [data-smart-pump-assistant] [data-assistant-long-card] {
              margin: -15px -12px 45px;
              padding: 30px 24px;
              background-color: #ffffff30;
            }
            [data-smart-pump-assistant] [data-assistant-long-card] h3 {
              font-size: 26px !important;
              max-width: 52%;
            }
            [data-smart-pump-assistant] [data-assistant-long-card] video {
              mask-image: none;
            }
          }
        }
      `}</style>
    </section>
  );
}
