"use client";

import Image from "next/image";
import Link from "next/link";

import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";

import UncompromisingPerformance from "@/components/UncompromissingPerformence/UncompromisingPerformance";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

// Page-level entrances only: never animate GSAP-owned transforms or interactive state.
type EntranceDirection = "up" | "left" | "right";

const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
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

const EMISSION_HERO_IMAGE = "/e-mission/e-mission%20hero.webp";

const emissionQuestion = "What is e-mission?";

function EmissionHero() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section
      className="emission-hero [.emission-page_&]:[position:relative] [.emission-page_&]:[isolation:isolate] [.emission-page_&]:[width:100%] [.emission-page_&]:[height:calc(966_*_var(--emission-unit))] [.emission-page_&]:[overflow:hidden] min-[768px]:max-[1200px]:[.emission-page_&]:[min-height:680px] max-[768px]:[.emission-page_&]:[height:auto] max-[768px]:[.emission-page_&]:[padding-top:clamp(380px,_99vw,_650px)] max-[768px]:[.emission-page_&]:[padding-right:40px] max-[768px]:[.emission-page_&]:[padding-bottom:56px] max-[768px]:[.emission-page_&]:[padding-left:40px] max-[768px]:[.emission-page_&]:[background:#e8f4fb] max-[768px]:[.emission-page_&::after]:[content:''] max-[768px]:[.emission-page_&::after]:[position:absolute] max-[768px]:[.emission-page_&::after]:[top:0] max-[768px]:[.emission-page_&::after]:[right:0] max-[768px]:[.emission-page_&::after]:[bottom:0] max-[768px]:[.emission-page_&::after]:[left:0] max-[768px]:[.emission-page_&::after]:[z-index:-1] max-[768px]:[.emission-page_&::after]:[background:linear-gradient(to_bottom,_transparent_45%,_#d5eaf8_83%,_#e8f4fb_100%)] max-[768px]:[.emission-page_&::after]:[pointer-events:none] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]"
      aria-labelledby="emission-title"
    >
      {EMISSION_HERO_IMAGE && (
        <picture>
          <source media="(max-width: 767px)" srcSet={EMISSION_HERO_IMAGE} />

          <Image
            src={EMISSION_HERO_IMAGE}
            alt=""
            fill
            sizes="100vw"
            preload
            className="emission-hero-image [.emission-page_&]:[object-fit:cover] [.emission-page_&]:[object-position:center] [.emission-page_&]:[z-index:-1] [.emission-page_&]:[pointer-events:none] max-[768px]:[.emission-page_&]:[width:180%]! max-[768px]:[.emission-page_&]:[height:auto]! max-[768px]:[.emission-page_&]:[max-width:none] max-[768px]:[.emission-page_&]:[left:-40%]! max-[768px]:[.emission-page_&]:[right:auto]! max-[768px]:[.emission-page_&]:[object-fit:contain] max-[768px]:[.emission-page_&]:[object-position:center_top] max-[768px]:[.emission-page_&]:[mask-image:linear-gradient(to_bottom,_#000_65%,_transparent_100%)]"
          />
        </picture>
      )}

      <div
        aria-hidden="true"
        data-emission-hero-blend
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1 hidden h-[38%] min-[769px]:block"
        style={{
          background:
            "linear-gradient(180deg,rgba(22,38,58,0) 0%,rgba(22,38,58,.12) 20%,rgba(22,38,58,.5) 55%,#16263a 100%)",
        }}
      />

      <motion.h1
        {...entrance("left", 0.08, reduced, 0.12, 36)}
        id="emission-title"
        className="emission-title [.emission-page_&]:[position:absolute] [.emission-page_&]:[top:calc(182_*_var(--emission-unit))] [.emission-page_&]:[left:calc(102_*_var(--emission-x-unit))] [.emission-page_&]:[margin-top:0] [.emission-page_&]:[margin-right:0] [.emission-page_&]:[margin-bottom:0] [.emission-page_&]:[margin-left:0] [.emission-page_&]:[color:#9eb7d0]! [.emission-page_&]:[font-size:calc(36_*_var(--emission-unit))]! [.emission-page_&]:[font-weight:410]! [.emission-page_&]:[line-height:1]! [.emission-page_&]:[letter-spacing:0] min-[768px]:max-[1200px]:[.emission-page_&]:[top:150px] min-[768px]:max-[1200px]:[.emission-page_&]:[font-size:clamp(28px,_2.5vw,_36px)]! max-[768px]:[.emission-page_&]:[top:154px] max-[768px]:[.emission-page_&]:[left:24px] max-[768px]:[.emission-page_&]:[font-size:28px]!"
      >
        E-Mission
      </motion.h1>

      <motion.nav
        {...entrance("up", 0.18, reduced, 0.12, 12)}
        aria-label="Breadcrumb"
        className="absolute left-[calc(102*var(--emission-x-unit))] top-[calc(233*var(--emission-unit))] z-10 flex items-center gap-2.5 text-[calc(13*var(--emission-unit))] text-[#9eb7d0] min-[768px]:max-[1200px]:top-[196px] min-[768px]:max-[1200px]:text-[12px] max-[768px]:left-[24px] max-[768px]:top-[199px] max-[768px]:text-[12px]"
      >
        <Link
          href="/"
          className="relative inline-block cursor-pointer pb-1 transition-colors duration-300 hover:text-[#f7f7f7] focus-visible:text-[#f7f7f7] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100"
        >
          Home
        </Link>
        <span aria-hidden="true">&gt;</span>
        <Link
          href="/e-mission"
          aria-current="page"
          className="relative inline-block cursor-pointer pb-1 transition-colors duration-300 hover:text-[#f7f7f7] focus-visible:text-[#f7f7f7] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100"
        >
          E-Mission
        </Link>
      </motion.nav>

      <div className="emission-introduction [.emission-page_&]:[position:absolute] [.emission-page_&]:[top:calc(756_*_var(--emission-unit))] [.emission-page_&]:[left:calc(183_*_var(--emission-x-unit))] [.emission-page_&]:[width:calc(877_*_var(--emission-x-unit))] [.emission-page_&]:[max-width:calc(100%_-_48px)] [.emission-page_&]:[letter-spacing:-0.04em] [.emission-page_&_h2]:[margin-top:0] [.emission-page_&_h2]:[margin-right:0] [.emission-page_&_h2]:[margin-bottom:0] [.emission-page_&_h2]:[margin-left:0] [.emission-page_&_h2]:[color:#f7f7f7]! [.emission-page_&_h2]:[font-size:calc(50_*_var(--emission-unit))]! [.emission-page_&_h2]:[font-weight:410]! [.emission-page_&_h2]:[line-height:1]! [.emission-page_&_p]:[width:calc(869_*_var(--emission-x-unit))] [.emission-page_&_p]:[max-width:100%] [.emission-page_&_p]:[margin-top:calc(11_*_var(--emission-unit))] [.emission-page_&_p]:[margin-right:0] [.emission-page_&_p]:[margin-bottom:0] [.emission-page_&_p]:[margin-left:calc(8_*_var(--emission-x-unit))] [.emission-page_&_p]:[color:#9eb7d0]! [.emission-page_&_p]:[font-size:calc(20_*_var(--emission-unit))]! [.emission-page_&_p]:[line-height:1.07]! min-[768px]:max-[1200px]:[.emission-page_&]:[top:auto] min-[768px]:max-[1200px]:[.emission-page_&]:[bottom:76px] min-[768px]:max-[1200px]:[.emission-page_&]:[left:8%] min-[768px]:max-[1200px]:[.emission-page_&]:[width:84%] min-[768px]:max-[1200px]:[.emission-page_&]:[max-width:none] min-[768px]:max-[1200px]:[.emission-page_&_h2]:[font-size:clamp(36px,_4vw,_50px)]! min-[768px]:max-[1200px]:[.emission-page_&_p]:[width:min(869px,_100%)] min-[768px]:max-[1200px]:[.emission-page_&_p]:[margin-left:0] min-[768px]:max-[1200px]:[.emission-page_&_p]:[font-size:18px]! min-[768px]:max-[1200px]:[.emission-page_&_p]:[line-height:1.2]! max-[768px]:[.emission-page_&]:[position:relative] max-[768px]:[.emission-page_&]:[top:auto] max-[768px]:[.emission-page_&]:[bottom:auto] max-[768px]:[.emission-page_&]:[left:auto] max-[768px]:[.emission-page_&]:[width:100%] max-[768px]:[.emission-page_&]:[max-width:none] max-[768px]:[.emission-page_&_h2]:[max-width:7em] max-[768px]:[.emission-page_&_h2]:[font-size:clamp(27px,_7.8vw,_40px)]! max-[768px]:[.emission-page_&_h2]:[line-height:1]! max-[768px]:[.emission-page_&_p]:[width:100%] max-[768px]:[.emission-page_&_p]:[margin-top:24px] max-[768px]:[.emission-page_&_p]:[margin-right:0] max-[768px]:[.emission-page_&_p]:[margin-bottom:0] max-[768px]:[.emission-page_&_p]:[margin-left:0] max-[768px]:[.emission-page_&_p]:[font-size:16px]! max-[768px]:[.emission-page_&_p]:[line-height:1.07]!">
        <h2 aria-label={emissionQuestion}>
          <span
            aria-hidden="true"
            className="flex flex-wrap gap-x-[0.28em] gap-y-0"
          >
            {emissionQuestion.split(" ").map((word, index) => (
              <span
                key={word}
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]"
              >
                <motion.span
                  className="inline-block will-change-transform"
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, y: "100%", filter: "blur(10px)" }
                  }
                  animate={
                    reduced
                      ? { opacity: 1, y: "0%", filter: "blur(0px)" }
                      : {
                          opacity: [0, 1, 1, 1, 0],
                          y: ["100%", "0%", "0%", "0%", "-65%"],
                          filter: [
                            "blur(10px)",
                            "blur(0px)",
                            "blur(0px)",
                            "blur(0px)",
                            "blur(8px)",
                          ],
                        }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          duration: 5.6,
                          delay: index * 0.17,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.16, 0.72, 0.86, 1],
                        }
                  }
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </h2>

        <motion.p {...entrance("up", 0.14, reduced, 0.3, 28)}>
          Discover our commitment to a sustainable future by reducing carbon
          footprints through innovative electric solutions.
        </motion.p>
      </div>
    </section>
  );
}

const performanceDescription = `Our products with the E-mission identity have a provable high performance feature while simultaneously providing savings. The E-mission series we have developed for you and tomorrow can combat in any climate and conditions. E-mission eliminates user concerns about energy, time, and performance, and it can be preferred in all types of pumps we offer. Regardless of your country's climate conditions, work, life, or comfort area requirements, you can put an end to your worries with a pump featuring the E-mission feature. High energy bills, unbalanced consumption, uncontrolled operation, disruptions that waste your time, fears of unknown maintenance costs, and the irresponsibility towards nature caused by all of these are eradicated with E-mission. Now, owning a pump with the E-mission feature not only advances you in production but also preserves your living space comfort and contributes to your economy. Sempa's "Uncompromising" mission in efficiency will make your choice your gain. We want to introduce you to E-mission, our developers are ready to answer you. Contact us now.`;

type EmissionContentCardData = {
  id: string;

  title: [string, string];

  subtitle: string;

  paragraphs: string[];

  variant: "dark" | "light";
};

const emissionContentCards: EmissionContentCardData[] = [
  {
    id: "emission-performance",

    title: ["Performance &", "Savings Together!"],

    subtitle: "Uncompromising",

    paragraphs: [performanceDescription],

    variant: "dark",
  },

  {
    id: "emission-environment",

    title: ["While We Produce,", "You Use!"],

    subtitle: "Environment & Human",

    paragraphs: [
      `Now is the time to use the E-mission series pump. Pumps with the E-mission feature operate without harming the environment and while preserving the common right of all living beings, providing savings without compromising on high performance. Thanks to the E-mission feature, the pump's high energy consumption, uncontrolled fluid movement, noise, and negative environmental impacts have been minimized. Sempa's data center is a 50-year global resource. This data center closely examines events that continuously affect climate, life, and transformation occurring in different parts of the world. This determines the adaptation of production to humans, nature, and future generations. We are aware of the significance of nature for the future and, along with our production responsibilities, we use our 50-year data resources to fight to preserve this awareness. Our preferences determine the rating for the supply of production. So, are we making the right choices? The most crucial aspect of pump selection is questioning its eco-friendly structure. Guiding choices with the awareness that it is a tool that touches nature and the future of all living beings, increasing awareness of consumer responsibilities, and contributing is our responsibility that comes before production.`,
    ],

    variant: "light",
  },

  {
    id: "emission-technology",

    title: ["Next Generation", "Pump Technology!"],

    subtitle: "What is e-mission?",

    paragraphs: [
      `Sustainability is crucial for generations, the environment, and ourselves. E-mission's mission revolves around precisely this. Developed by our SempaX Technology Development Center, E-mission makes future pump technologies sustainable. The 'e' form represents the entirety of our production policy and product development approach, symbolizing the "eco-friendly" attribute. This form, embracing conservation and environmental responsibility, has transformed into a mission. The 'mission' form is integrated with environmentalism, evolving, enhancing, examining all assumptions and approaches, acting meticulously to adopt an ever-changing perspective as a responsibility, and transforming data into products by observing the world. The mission form, to fulfill its responsibility for our future, determines the direction of production and the quality of supply in all regions. Now, E-mission guides the choices of pump users.`,

      performanceDescription,
    ],

    variant: "light",
  },
];

function EmissionContentCard({ card }: { card: EmissionContentCardData }) {
  const reduced = useReducedMotion() ?? false;
  const direction =
    card.variant === "dark"
      ? "left"
      : card.id === "emission-environment"
        ? "right"
        : "up";

  return (
    <motion.section
      {...entrance(direction, 0, reduced, 0.14, 38)}
      className={twEmissionPage(
        `emission-content-card emission-content-card--${card.variant}`,
      )}
      aria-labelledby={card.id}
    >
      {card.variant === "dark" && (
        <svg
          className="emission-card-wave [.emission-page_&]:[position:absolute] [.emission-page_&]:[top:0] [.emission-page_&]:[right:0] [.emission-page_&]:[bottom:0] [.emission-page_&]:[left:0] [.emission-page_&]:[z-index:-1] [.emission-page_&]:[width:100%] [.emission-page_&]:[height:100%] [.emission-page_&]:[border-radius:inherit] [.emission-page_&]:[pointer-events:none] [.emission-page_&]:[opacity:0.35] max-[768px]:[.emission-page_&]:[display:none]!"
          viewBox="0 0 1200 365"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-40 126C220 32 366 292 672 136S1050 84 1240 196"
            stroke="#4687B8"
            strokeWidth="0.7"
          />

          <path
            d="M-40 138C220 44 366 304 672 148S1050 96 1240 208"
            stroke="#9EB7D0"
            strokeOpacity="0.35"
            strokeWidth="0.5"
          />
        </svg>
      )}

      <div className="emission-card-heading [.emission-page_&]:[display:flex]! [.emission-page_&]:[align-items:center] [.emission-page_&]:[justify-content:space-between] [.emission-page_&]:[gap:calc(32_*_var(--content-unit))] [.emission-page_&_h2]:[margin-top:0] [.emission-page_&_h2]:[margin-right:0] [.emission-page_&_h2]:[margin-bottom:0] [.emission-page_&_h2]:[margin-left:0] [.emission-page_&_h2]:[font-size:calc(36_*_var(--content-unit))]! [.emission-page_&_h2]:[font-weight:410]! [.emission-page_&_h2]:[line-height:1]! [.emission-page_&_h2]:[letter-spacing:0] [.emission-page_&_>_p]:[margin-top:0] [.emission-page_&_>_p]:[margin-right:0] [.emission-page_&_>_p]:[margin-bottom:0] [.emission-page_&_>_p]:[margin-left:0] [.emission-page_&_>_p]:[color:#0d5792]! [.emission-page_&_>_p]:[font-size:calc(20_*_var(--content-unit))]! [.emission-page_&_>_p]:[line-height:1.07]! [.emission-page_&_>_p]:[letter-spacing:-0.04em] [.emission-page_&_>_p]:[text-align:right] [.emission-page_.emission-content-card--dark_&&_>_p]:[color:#f7f7f7]! max-[1200px]:[.emission-page_&_h2]:[font-size:clamp(28px,_3vw,_36px)]! max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[color:#005eff]! max-[768px]:[.emission-page_.emission-content-card--dark_&&_>_p]:[color:#005eff]! max-[768px]:[.emission-page_.emission-content-card--light_&&_h2]:[color:#005eff]! max-[768px]:[.emission-page_.emission-content-card--light_&&_>_p]:[color:#005eff]! max-[768px]:[.emission-page_&]:[flex-direction:column] max-[768px]:[.emission-page_&]:[align-items:flex-start] max-[768px]:[.emission-page_&]:[gap:20px] max-[768px]:[.emission-page_&_h2]:[font-size:clamp(24px,_7vw,_32px)]! max-[768px]:[.emission-page_&_h2]:[letter-spacing:-0.04em] max-[768px]:[.emission-page_&_>_p]:[font-size:20px]! max-[768px]:[.emission-page_&_>_p]:[text-align:left]">
        <motion.h2 {...entrance("left", 0.08, reduced, 0.2, 27)} id={card.id}>
          {card.title[0]}
          <br />
          {card.title[1]}
        </motion.h2>

        <motion.p {...entrance("right", 0.14, reduced, 0.2, 24)}>
          {card.subtitle}
        </motion.p>
      </div>

      <div className="emission-card-description [.emission-page_&]:[display:grid]! [.emission-page_&]:[gap:0] [.emission-page_&]:[margin-top:calc(40_*_var(--content-unit))] [.emission-page_&]:[font-size:calc(15_*_var(--content-unit))]! [.emission-page_&]:[line-height:1]! [.emission-page_&]:[letter-spacing:-0.04em] [.emission-page_&_p]:[margin-top:0] [.emission-page_&_p]:[margin-right:0] [.emission-page_&_p]:[margin-bottom:0] [.emission-page_&_p]:[margin-left:0] max-[1200px]:[.emission-page_&]:[line-height:1.2]! max-[768px]:[.emission-page_&]:[margin-top:32px] max-[768px]:[.emission-page_&]:[font-size:15px]! max-[768px]:[.emission-page_&]:[line-height:1.35]! max-[768px]:[.emission-page_&]:[overflow-wrap:break-word] max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[font-size:16px]! max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[line-height:1.05]! max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[margin-top:40px]">
        {card.paragraphs.map((paragraph, index) => (
          <motion.p
            {...entrance("up", 0.17 + index * 0.09, reduced, 0.1, 22)}
            key={`${card.id}-${index}`}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.section>
  );
}

function EmissionContentSections() {
  return (
    <div className="emission-content-sections [.emission-page_&]:[--content-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.emission-page_&]:[display:grid]! [.emission-page_&]:[gap:calc(22_*_var(--content-unit))] [.emission-page_&]:[width:100%] [.emission-page_&]:[max-width:calc(1201_*_var(--content-unit))] [.emission-page_&]:[margin-left:auto] [.emission-page_&]:[margin-right:auto] max-[1200px]:[.emission-page_&]:[--content-unit:1px] max-[768px]:[.emission-page_&]:[gap:24px] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
      {emissionContentCards.map((card) => (
        <EmissionContentCard key={card.id} card={card} />
      ))}
    </div>
  );
}

// E-Service timing/easing, with safe replay when this section enters again.
// The headline stays visible between visits; no hidden inline state is retained.
function EmissionPerformanceReveal() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const scope = root.current;
    if (!scope || reduced) return;

    const headings = Array.from(
      scope.querySelectorAll<HTMLElement>(".uncompromising-stage h2"),
    );
    const copy = Array.from(
      scope.querySelectorAll<HTMLElement>(".uncompromising-glass p"),
    );
    const targets = [...headings, ...copy];
    const controls = new Map<HTMLElement, ReturnType<typeof animate>>();
    let readyToReplay = true;

    const showImmediately = () => {
      controls.forEach((control) => control.stop());
      controls.clear();
      targets.forEach((element) => {
        element.style.opacity = "1";
        element.style.filter = "blur(0px)";
        if (headings.includes(element)) element.style.translate = "0px 0px";
      });
    };

    const play = () => {
      showImmediately();
      targets.forEach((element) => {
        const isHeading = headings.includes(element);
        controls.set(
          element,
          animate(
            element,
            {
              opacity: [0, 1],
              filter: ["blur(7px)", "blur(0px)"],
              ...(isHeading ? { translate: ["0px 54px", "0px 0px"] } : {}),
            },
            {
              duration: isHeading ? 1.15 : 0.95,
              delay: isHeading ? 0.03 : 0.16,
              ease: entranceEase,
            },
          ),
        );
      });
    };

    // Observe a stationary wrapper, never the translating heading itself.
    // On exit, stop the animations AND leave every element fully visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.14 && readyToReplay) {
          readyToReplay = false;
          play();
        } else if (entry.intersectionRatio <= 0.02 && !readyToReplay) {
          readyToReplay = true;
          showImmediately();
        }
      },
      { threshold: [0, 0.02, 0.14], rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(scope);

    return () => {
      observer.disconnect();
      showImmediately();
      targets.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("filter");
        element.style.removeProperty("translate");
      });
    };
  }, [reduced]);

  return (
    <div ref={root}>
      <UncompromisingPerformance />
    </div>
  );
}

export default function EmissionPage() {
  const pageRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const page = pageRef.current;

    const header = document.querySelector<HTMLElement>(".site-header");

    if (!page || !header) return;

    // This route's existing header is in normal flow. Only offset this page

    // so the hero's reference coordinates include the header area.

    const syncHeaderOffset = () => {
      const inFlow = !["absolute", "fixed"].includes(
        getComputedStyle(header).position,
      );

      page.style.setProperty(
        "--emission-header-offset",
        inFlow ? `${header.getBoundingClientRect().height}px` : "0px",
      );
    };

    syncHeaderOffset();

    const observer = new ResizeObserver(syncHeaderOffset);

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className="emission-page font-sans [&&_.emission-content-card--dark]:[min-height:calc(365_*_var(--content-unit))] [&&_.emission-content-card--dark]:[background:linear-gradient(180deg,_#56779280_0%,_#90afcd70_50%,_#d5eaff80_100%)] [&&_.emission-content-card--dark]:[color:#f7f7f7]! max-[768px]:[&&_.emission-content-card--dark]:[background:linear-gradient(125deg,_#dcecff,_#bfddfc)] max-[768px]:[&&_.emission-content-card--dark]:[color:#27272a]! max-[768px]:[&&_.emission-content-card--dark]:[border-color:#ffffff40] [--emission-header-offset:97px] [--emission-x-unit:0.0694444444vw] [--emission-unit:min(var(--emission-x-unit),_0.1035196687svh)] [width:100%] [margin-top:calc(-1_*_var(--emission-header-offset))] [background:#061d38] [&_.newsletter-section]:[--mail-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [&_.newsletter-section]:[max-width:calc(1200_*_var(--mail-unit))] [&_.newsletter-section]:[margin-top:0] [&_.newsletter-form]:[grid-template-columns:calc(212_*_var(--mail-unit))_calc(308_*_var(--mail-unit))_calc(135_*_var(--mail-unit))_minmax(0,_1fr)] [&_.newsletter-form]:[gap:calc(29_*_var(--mail-unit))] [&_.newsletter-form]:[min-height:calc(76_*_var(--mail-unit))] [&_.newsletter-form]:[padding-top:calc(8_*_var(--mail-unit))] [&_.newsletter-form]:[padding-right:calc(26_*_var(--mail-unit))] [&_.newsletter-form]:[padding-bottom:calc(8_*_var(--mail-unit))] [&_.newsletter-form]:[padding-left:calc(26_*_var(--mail-unit))] [&_.newsletter-form]:[border-radius:calc(8_*_var(--mail-unit))] [&_.newsletter-form_h2]:[font-size:calc(30_*_var(--mail-unit))]! [&_.newsletter-email]:[height:calc(45_*_var(--mail-unit))] [&_.newsletter-email]:[padding-top:calc(3_*_var(--mail-unit))] [&_.newsletter-email]:[padding-right:calc(25_*_var(--mail-unit))] [&_.newsletter-email]:[padding-bottom:calc(3_*_var(--mail-unit))] [&_.newsletter-email]:[padding-left:calc(25_*_var(--mail-unit))] [&_.newsletter-email]:[border-radius:calc(8_*_var(--mail-unit))] [&_.newsletter-email]:[font-size:calc(15_*_var(--mail-unit))]! [&_.newsletter-submit]:[height:calc(45_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-top:calc(3_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-right:calc(25_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-bottom:calc(3_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-left:calc(25_*_var(--mail-unit))] [&_.newsletter-submit]:[border-radius:calc(8_*_var(--mail-unit))] [&_.newsletter-submit]:[font-size:calc(15_*_var(--mail-unit))]! [&_.newsletter-submit:disabled]:[opacity:1] [&_.newsletter-consent]:[align-items:center] [&_.newsletter-consent]:[gap:calc(10_*_var(--mail-unit))] [&_.newsletter-consent]:[font-size:calc(13_*_var(--mail-unit))]! [&_.newsletter-consent]:[line-height:1]! [&_.newsletter-checkbox]:[flex-basis:calc(18_*_var(--mail-unit))] [&_.newsletter-checkbox]:[width:calc(18_*_var(--mail-unit))] [&_.newsletter-checkbox]:[height:calc(18_*_var(--mail-unit))] [&_.newsletter-checkbox_input]:[width:100%] [&_.newsletter-checkbox_input]:[height:100%] [&_.newsletter-checkbox_input]:[border-radius:calc(4_*_var(--mail-unit))] [&_.newsletter-checkbox_svg]:[top:12%] [&_.newsletter-checkbox_svg]:[right:12%] [&_.newsletter-checkbox_svg]:[bottom:12%] [&_.newsletter-checkbox_svg]:[left:12%] [&_.newsletter-checkbox_svg]:[width:76%] [&_.newsletter-checkbox_svg]:[height:76%] max-[1200px]:[&_.newsletter-section]:[--mail-unit:1px] max-[1200px]:[&_.newsletter-form]:[grid-template-columns:212px_minmax(180px,_308px)_135px] max-[1200px]:[&_.newsletter-form]:[gap:20px] max-[768px]:[&_.newsletter-form]:[grid-template-columns:1fr] max-[768px]:[&_.newsletter-form]:[padding-top:24px] max-[768px]:[&_.newsletter-form]:[padding-right:24px] max-[768px]:[&_.newsletter-form]:[padding-bottom:24px] max-[768px]:[&_.newsletter-form]:[padding-left:24px] max-[768px]:[&_.newsletter-form_h2]:[font-size:28px]! max-[768px]:[&_.newsletter-consent]:[align-items:flex-start] max-[768px]:[&_.newsletter-consent]:[font-size:13px]! max-[768px]:[&_.newsletter-consent]:[line-height:1.3]! max-[768px]:[&_.uncompromising-performance]:[--glass-top:clamp(44px,_13vw,_92px)] max-[768px]:[&_.uncompromising-performance]:[padding-top:64px] max-[768px]:[&_.uncompromising-performance]:[padding-right:0] max-[768px]:[&_.uncompromising-performance]:[padding-bottom:64px] max-[768px]:[&_.uncompromising-performance]:[padding-left:0] max-[768px]:[&_.uncompromising-stage]:[height:230px] max-[768px]:[&_.uncompromising-stage_h2]:[font-size:clamp(23px,_7vw,_54px)]! max-[768px]:[&_.uncompromising-glass]:[width:60%] max-[768px]:[&_.uncompromising-glass]:[max-width:300px] max-[768px]:[&_.uncompromising-glass]:[padding-top:22px] max-[768px]:[&_.uncompromising-glass]:[padding-right:16px] max-[768px]:[&_.uncompromising-glass]:[padding-bottom:22px] max-[768px]:[&_.uncompromising-glass]:[padding-left:16px] max-[768px]:[&_.uncompromising-glass_p]:[font-size:16px]! max-[768px]:[&_.uncompromising-glass_p]:[line-height:1]! max-[768px]:[&_.uncompromising-glow]:[top:var(--glass-top)] max-[768px]:[&_.uncompromising-glow]:[width:90%] max-[768px]:[&_.uncompromising-glow]:[height:220px]"
    >
      <EmissionHero />

      <div className="emission-newsletter [.emission-page_&]:[--newsletter-spacing-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.emission-page_&]:[display:flow-root]! [.emission-page_&]:[padding-top:40px] [.emission-page_&]:[padding-right:24px] [.emission-page_&]:[padding-bottom:calc(115_*_var(--newsletter-spacing-unit))] [.emission-page_&]:[padding-left:24px] [.emission-page_&]:[background:linear-gradient(180deg,_#16263a_0,_#9eb7d0_calc(260_*_var(--newsletter-spacing-unit)),_#d5eaf8_calc(440_*_var(--newsletter-spacing-unit)),_#e8f4fb_100%)] max-[768px]:[.emission-page_&]:[--newsletter-spacing-unit:1px] max-[768px]:[.emission-page_&]:[padding-top:24px] max-[768px]:[.emission-page_&]:[padding-right:20px] max-[768px]:[.emission-page_&]:[padding-bottom:80px] max-[768px]:[.emission-page_&]:[padding-left:20px] max-[768px]:[.emission-page_&]:[background:linear-gradient(110deg,_#e8f4fb,_#d5eaff)]">
        <EmissionContentSections />

        <EmissionPerformanceReveal />

        <motion.div {...entrance("up", 0, reduced, 0.12, 30)}>
          <NewsletterSubscription requireValidInput />
        </motion.div>
      </div>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.

const twEmissionPageRules: Record<string, string> = {
  "emission-content-sections":
    "[.emission-page_&]:[--content-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.emission-page_&]:[display:grid]! [.emission-page_&]:[gap:calc(22_*_var(--content-unit))] [.emission-page_&]:[width:100%] [.emission-page_&]:[max-width:calc(1201_*_var(--content-unit))] [.emission-page_&]:[margin-left:auto] [.emission-page_&]:[margin-right:auto] max-[1200px]:[.emission-page_&]:[--content-unit:1px] max-[768px]:[.emission-page_&]:[gap:24px]",

  "emission-content-card":
    "[.emission-page_&]:[position:relative] [.emission-page_&]:[isolation:isolate] [.emission-page_&]:[padding-top:calc(60_*_var(--content-unit))] [.emission-page_&]:[padding-right:calc(67_*_var(--content-unit))] [.emission-page_&]:[padding-bottom:calc(60_*_var(--content-unit))] [.emission-page_&]:[padding-left:calc(67_*_var(--content-unit))] [.emission-page_&]:[border:0.2px_solid_#9eb7d080] [.emission-page_&]:[border-radius:calc(30_*_var(--content-unit))] [.emission-page_&]:[background:linear-gradient(125deg,_#e8f4fb80,_#d5eaf840)] [.emission-page_&]:[color:#27272a]! max-[1200px]:[.emission-page_&]:[padding-left:36px] max-[1200px]:[.emission-page_&]:[padding-right:36px] max-[768px]:[.emission-page_&]:[padding-top:32px] max-[768px]:[.emission-page_&]:[padding-right:20px] max-[768px]:[.emission-page_&]:[padding-bottom:32px] max-[768px]:[.emission-page_&]:[padding-left:20px] max-[768px]:[.emission-page_&]:[border-color:#9eb7d055] max-[768px]:[.emission-page_&]:[border-radius:30px] max-[768px]:[.emission-page_&]:[background:linear-gradient(125deg,_#e8f4fb80,_#d5eaf840)]",

  "emission-page":
    "[&&_.emission-content-card--dark]:[min-height:calc(365_*_var(--content-unit))] [&&_.emission-content-card--dark]:[background:linear-gradient(180deg,_#56779280_0%,_#90afcd70_50%,_#d5eaff80_100%)] [&&_.emission-content-card--dark]:[color:#f7f7f7]! max-[768px]:[&&_.emission-content-card--dark]:[background:linear-gradient(125deg,_#dcecff,_#bfddfc)] max-[768px]:[&&_.emission-content-card--dark]:[color:#27272a]! max-[768px]:[&&_.emission-content-card--dark]:[border-color:#ffffff40] [--emission-header-offset:97px] [--emission-x-unit:0.0694444444vw] [--emission-unit:min(var(--emission-x-unit),_0.1035196687svh)] [width:100%] [margin-top:calc(-1_*_var(--emission-header-offset))] [background:#061d38] [&_.newsletter-section]:[--mail-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [&_.newsletter-section]:[max-width:calc(1200_*_var(--mail-unit))] [&_.newsletter-section]:[margin-top:0] [&_.newsletter-form]:[grid-template-columns:calc(212_*_var(--mail-unit))_calc(308_*_var(--mail-unit))_calc(135_*_var(--mail-unit))_minmax(0,_1fr)] [&_.newsletter-form]:[gap:calc(29_*_var(--mail-unit))] [&_.newsletter-form]:[min-height:calc(76_*_var(--mail-unit))] [&_.newsletter-form]:[padding-top:calc(8_*_var(--mail-unit))] [&_.newsletter-form]:[padding-right:calc(26_*_var(--mail-unit))] [&_.newsletter-form]:[padding-bottom:calc(8_*_var(--mail-unit))] [&_.newsletter-form]:[padding-left:calc(26_*_var(--mail-unit))] [&_.newsletter-form]:[border-radius:calc(8_*_var(--mail-unit))] [&_.newsletter-form_h2]:[font-size:calc(30_*_var(--mail-unit))]! [&_.newsletter-email]:[height:calc(45_*_var(--mail-unit))] [&_.newsletter-email]:[padding-top:calc(3_*_var(--mail-unit))] [&_.newsletter-email]:[padding-right:calc(25_*_var(--mail-unit))] [&_.newsletter-email]:[padding-bottom:calc(3_*_var(--mail-unit))] [&_.newsletter-email]:[padding-left:calc(25_*_var(--mail-unit))] [&_.newsletter-email]:[border-radius:calc(8_*_var(--mail-unit))] [&_.newsletter-email]:[font-size:calc(15_*_var(--mail-unit))]! [&_.newsletter-submit]:[height:calc(45_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-top:calc(3_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-right:calc(25_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-bottom:calc(3_*_var(--mail-unit))] [&_.newsletter-submit]:[padding-left:calc(25_*_var(--mail-unit))] [&_.newsletter-submit]:[border-radius:calc(8_*_var(--mail-unit))] [&_.newsletter-submit]:[font-size:calc(15_*_var(--mail-unit))]! [&_.newsletter-submit:disabled]:[opacity:1] [&_.newsletter-consent]:[align-items:center] [&_.newsletter-consent]:[gap:calc(10_*_var(--mail-unit))] [&_.newsletter-consent]:[font-size:calc(13_*_var(--mail-unit))]! [&_.newsletter-consent]:[line-height:1]! [&_.newsletter-checkbox]:[flex-basis:calc(18_*_var(--mail-unit))] [&_.newsletter-checkbox]:[width:calc(18_*_var(--mail-unit))] [&_.newsletter-checkbox]:[height:calc(18_*_var(--mail-unit))] [&_.newsletter-checkbox_input]:[width:100%] [&_.newsletter-checkbox_input]:[height:100%] [&_.newsletter-checkbox_input]:[border-radius:calc(4_*_var(--mail-unit))] [&_.newsletter-checkbox_svg]:[top:12%] [&_.newsletter-checkbox_svg]:[right:12%] [&_.newsletter-checkbox_svg]:[bottom:12%] [&_.newsletter-checkbox_svg]:[left:12%] [&_.newsletter-checkbox_svg]:[width:76%] [&_.newsletter-checkbox_svg]:[height:76%] max-[1200px]:[&_.newsletter-section]:[--mail-unit:1px] max-[1200px]:[&_.newsletter-form]:[grid-template-columns:212px_minmax(180px,_308px)_135px] max-[1200px]:[&_.newsletter-form]:[gap:20px] max-[768px]:[&_.newsletter-form]:[grid-template-columns:1fr] max-[768px]:[&_.newsletter-form]:[padding-top:24px] max-[768px]:[&_.newsletter-form]:[padding-right:24px] max-[768px]:[&_.newsletter-form]:[padding-bottom:24px] max-[768px]:[&_.newsletter-form]:[padding-left:24px] max-[768px]:[&_.newsletter-form_h2]:[font-size:28px]! max-[768px]:[&_.newsletter-consent]:[align-items:flex-start] max-[768px]:[&_.newsletter-consent]:[font-size:13px]! max-[768px]:[&_.newsletter-consent]:[line-height:1.3]! max-[768px]:[&_.uncompromising-performance]:[--glass-top:clamp(44px,_13vw,_92px)] max-[768px]:[&_.uncompromising-performance]:[padding-top:64px] max-[768px]:[&_.uncompromising-performance]:[padding-right:0] max-[768px]:[&_.uncompromising-performance]:[padding-bottom:64px] max-[768px]:[&_.uncompromising-performance]:[padding-left:0] max-[768px]:[&_.uncompromising-stage]:[height:230px] max-[768px]:[&_.uncompromising-stage_h2]:[font-size:clamp(23px,_7vw,_54px)]! max-[768px]:[&_.uncompromising-glass]:[width:60%] max-[768px]:[&_.uncompromising-glass]:[max-width:300px] max-[768px]:[&_.uncompromising-glass]:[padding-top:22px] max-[768px]:[&_.uncompromising-glass]:[padding-right:16px] max-[768px]:[&_.uncompromising-glass]:[padding-bottom:22px] max-[768px]:[&_.uncompromising-glass]:[padding-left:16px] max-[768px]:[&_.uncompromising-glass_p]:[font-size:16px]! max-[768px]:[&_.uncompromising-glass_p]:[line-height:1]! max-[768px]:[&_.uncompromising-glow]:[top:var(--glass-top)] max-[768px]:[&_.uncompromising-glow]:[width:90%] max-[768px]:[&_.uncompromising-glow]:[height:220px]",

  "emission-card-wave":
    "[.emission-page_&]:[position:absolute] [.emission-page_&]:[top:0] [.emission-page_&]:[right:0] [.emission-page_&]:[bottom:0] [.emission-page_&]:[left:0] [.emission-page_&]:[z-index:-1] [.emission-page_&]:[width:100%] [.emission-page_&]:[height:100%] [.emission-page_&]:[border-radius:inherit] [.emission-page_&]:[pointer-events:none] [.emission-page_&]:[opacity:0.35] max-[768px]:[.emission-page_&]:[display:none]!",

  "emission-card-heading":
    "[.emission-page_&]:[display:flex]! [.emission-page_&]:[align-items:center] [.emission-page_&]:[justify-content:space-between] [.emission-page_&]:[gap:calc(32_*_var(--content-unit))] [.emission-page_&_h2]:[margin-top:0] [.emission-page_&_h2]:[margin-right:0] [.emission-page_&_h2]:[margin-bottom:0] [.emission-page_&_h2]:[margin-left:0] [.emission-page_&_h2]:[font-size:calc(36_*_var(--content-unit))]! [.emission-page_&_h2]:[font-weight:410]! [.emission-page_&_h2]:[line-height:1]! [.emission-page_&_h2]:[letter-spacing:0] [.emission-page_&_>_p]:[margin-top:0] [.emission-page_&_>_p]:[margin-right:0] [.emission-page_&_>_p]:[margin-bottom:0] [.emission-page_&_>_p]:[margin-left:0] [.emission-page_&_>_p]:[color:#0d5792]! [.emission-page_&_>_p]:[font-size:calc(20_*_var(--content-unit))]! [.emission-page_&_>_p]:[line-height:1.07]! [.emission-page_&_>_p]:[letter-spacing:-0.04em] [.emission-page_&_>_p]:[text-align:right] [.emission-page_.emission-content-card--dark_&&_>_p]:[color:#f7f7f7]! max-[1200px]:[.emission-page_&_h2]:[font-size:clamp(28px,_3vw,_36px)]! max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[color:#005eff]! max-[768px]:[.emission-page_.emission-content-card--dark_&&_>_p]:[color:#005eff]! max-[768px]:[.emission-page_.emission-content-card--light_&&_h2]:[color:#005eff]! max-[768px]:[.emission-page_.emission-content-card--light_&&_>_p]:[color:#005eff]! max-[768px]:[.emission-page_&]:[flex-direction:column] max-[768px]:[.emission-page_&]:[align-items:flex-start] max-[768px]:[.emission-page_&]:[gap:20px] max-[768px]:[.emission-page_&_h2]:[font-size:clamp(24px,_7vw,_32px)]! max-[768px]:[.emission-page_&_h2]:[letter-spacing:-0.04em] max-[768px]:[.emission-page_&_>_p]:[font-size:20px]! max-[768px]:[.emission-page_&_>_p]:[text-align:left]",

  "emission-card-description":
    "[.emission-page_&]:[display:grid]! [.emission-page_&]:[gap:0] [.emission-page_&]:[margin-top:calc(40_*_var(--content-unit))] [.emission-page_&]:[font-size:calc(15_*_var(--content-unit))]! [.emission-page_&]:[line-height:1]! [.emission-page_&]:[letter-spacing:-0.04em] [.emission-page_&_p]:[margin-top:0] [.emission-page_&_p]:[margin-right:0] [.emission-page_&_p]:[margin-bottom:0] [.emission-page_&_p]:[margin-left:0] max-[1200px]:[.emission-page_&]:[line-height:1.2]! max-[768px]:[.emission-page_&]:[margin-top:32px] max-[768px]:[.emission-page_&]:[font-size:15px]! max-[768px]:[.emission-page_&]:[line-height:1.35]! max-[768px]:[.emission-page_&]:[overflow-wrap:break-word] max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[font-size:16px]! max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[line-height:1.05]! max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[margin-top:40px]",

  "emission-hero":
    "[.emission-page_&]:[position:relative] [.emission-page_&]:[isolation:isolate] [.emission-page_&]:[width:100%] [.emission-page_&]:[height:calc(966_*_var(--emission-unit))] [.emission-page_&]:[overflow:hidden] min-[768px]:max-[1200px]:[.emission-page_&]:[min-height:680px] max-[768px]:[.emission-page_&]:[height:auto] max-[768px]:[.emission-page_&]:[padding-top:clamp(380px,_99vw,_650px)] max-[768px]:[.emission-page_&]:[padding-right:40px] max-[768px]:[.emission-page_&]:[padding-bottom:56px] max-[768px]:[.emission-page_&]:[padding-left:40px] max-[768px]:[.emission-page_&]:[background:#e8f4fb] max-[768px]:[.emission-page_&::after]:[content:''] max-[768px]:[.emission-page_&::after]:[position:absolute] max-[768px]:[.emission-page_&::after]:[top:0] max-[768px]:[.emission-page_&::after]:[right:0] max-[768px]:[.emission-page_&::after]:[bottom:0] max-[768px]:[.emission-page_&::after]:[left:0] max-[768px]:[.emission-page_&::after]:[z-index:-1] max-[768px]:[.emission-page_&::after]:[background:linear-gradient(to_bottom,_transparent_45%,_#d5eaf8_83%,_#e8f4fb_100%)] max-[768px]:[.emission-page_&::after]:[pointer-events:none]",

  "emission-hero-image":
    "[.emission-page_&]:[object-fit:cover] [.emission-page_&]:[object-position:center] [.emission-page_&]:[z-index:-1] [.emission-page_&]:[pointer-events:none] max-[768px]:[.emission-page_&]:[width:180%]! max-[768px]:[.emission-page_&]:[height:auto]! max-[768px]:[.emission-page_&]:[max-width:none] max-[768px]:[.emission-page_&]:[left:-40%]! max-[768px]:[.emission-page_&]:[right:auto]! max-[768px]:[.emission-page_&]:[object-fit:contain] max-[768px]:[.emission-page_&]:[object-position:center_top] max-[768px]:[.emission-page_&]:[mask-image:linear-gradient(to_bottom,_#000_65%,_transparent_100%)]",

  "emission-newsletter":
    "[.emission-page_&]:[--newsletter-spacing-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.emission-page_&]:[display:flow-root]! [.emission-page_&]:[padding-top:40px] [.emission-page_&]:[padding-right:24px] [.emission-page_&]:[padding-bottom:calc(115_*_var(--newsletter-spacing-unit))] [.emission-page_&]:[padding-left:24px] [.emission-page_&]:[background:linear-gradient(180deg,_#16263a_0,_#9eb7d0_calc(260_*_var(--newsletter-spacing-unit)),_#d5eaf8_calc(440_*_var(--newsletter-spacing-unit)),_#e8f4fb_100%)] max-[768px]:[.emission-page_&]:[--newsletter-spacing-unit:1px] max-[768px]:[.emission-page_&]:[padding-top:24px] max-[768px]:[.emission-page_&]:[padding-right:20px] max-[768px]:[.emission-page_&]:[padding-bottom:80px] max-[768px]:[.emission-page_&]:[padding-left:20px] max-[768px]:[.emission-page_&]:[background:linear-gradient(110deg,_#e8f4fb,_#d5eaff)]",

  "emission-title":
    "[.emission-page_&]:[position:absolute] [.emission-page_&]:[top:calc(182_*_var(--emission-unit))] [.emission-page_&]:[left:calc(102_*_var(--emission-x-unit))] [.emission-page_&]:[margin-top:0] [.emission-page_&]:[margin-right:0] [.emission-page_&]:[margin-bottom:0] [.emission-page_&]:[margin-left:0] [.emission-page_&]:[color:#9eb7d0]! [.emission-page_&]:[font-size:calc(36_*_var(--emission-unit))]! [.emission-page_&]:[font-weight:410]! [.emission-page_&]:[line-height:1]! [.emission-page_&]:[letter-spacing:0] min-[768px]:max-[1200px]:[.emission-page_&]:[top:150px] min-[768px]:max-[1200px]:[.emission-page_&]:[font-size:clamp(28px,_2.5vw,_36px)]! max-[768px]:[.emission-page_&]:[top:154px] max-[768px]:[.emission-page_&]:[left:24px] max-[768px]:[.emission-page_&]:[font-size:28px]!",

  "emission-introduction":
    "[.emission-page_&]:[position:absolute] [.emission-page_&]:[top:calc(756_*_var(--emission-unit))] [.emission-page_&]:[left:calc(183_*_var(--emission-x-unit))] [.emission-page_&]:[width:calc(877_*_var(--emission-x-unit))] [.emission-page_&]:[max-width:calc(100%_-_48px)] [.emission-page_&]:[letter-spacing:-0.04em] [.emission-page_&_h2]:[margin-top:0] [.emission-page_&_h2]:[margin-right:0] [.emission-page_&_h2]:[margin-bottom:0] [.emission-page_&_h2]:[margin-left:0] [.emission-page_&_h2]:[color:#f7f7f7]! [.emission-page_&_h2]:[font-size:calc(50_*_var(--emission-unit))]! [.emission-page_&_h2]:[font-weight:410]! [.emission-page_&_h2]:[line-height:1]! [.emission-page_&_p]:[width:calc(869_*_var(--emission-x-unit))] [.emission-page_&_p]:[max-width:100%] [.emission-page_&_p]:[margin-top:calc(11_*_var(--emission-unit))] [.emission-page_&_p]:[margin-right:0] [.emission-page_&_p]:[margin-bottom:0] [.emission-page_&_p]:[margin-left:calc(8_*_var(--emission-x-unit))] [.emission-page_&_p]:[color:#9eb7d0]! [.emission-page_&_p]:[font-size:calc(20_*_var(--emission-unit))]! [.emission-page_&_p]:[line-height:1.07]! min-[768px]:max-[1200px]:[.emission-page_&]:[top:auto] min-[768px]:max-[1200px]:[.emission-page_&]:[bottom:76px] min-[768px]:max-[1200px]:[.emission-page_&]:[left:8%] min-[768px]:max-[1200px]:[.emission-page_&]:[width:84%] min-[768px]:max-[1200px]:[.emission-page_&]:[max-width:none] min-[768px]:max-[1200px]:[.emission-page_&_h2]:[font-size:clamp(36px,_4vw,_50px)]! min-[768px]:max-[1200px]:[.emission-page_&_p]:[width:min(869px,_100%)] min-[768px]:max-[1200px]:[.emission-page_&_p]:[margin-left:0] min-[768px]:max-[1200px]:[.emission-page_&_p]:[font-size:18px]! min-[768px]:max-[1200px]:[.emission-page_&_p]:[line-height:1.2]! max-[768px]:[.emission-page_&]:[position:relative] max-[768px]:[.emission-page_&]:[top:auto] max-[768px]:[.emission-page_&]:[bottom:auto] max-[768px]:[.emission-page_&]:[left:auto] max-[768px]:[.emission-page_&]:[width:100%] max-[768px]:[.emission-page_&]:[max-width:none] max-[768px]:[.emission-page_&_h2]:[max-width:7em] max-[768px]:[.emission-page_&_h2]:[font-size:clamp(27px,_7.8vw,_40px)]! max-[768px]:[.emission-page_&_h2]:[line-height:1]! max-[768px]:[.emission-page_&_p]:[width:100%] max-[768px]:[.emission-page_&_p]:[margin-top:24px] max-[768px]:[.emission-page_&_p]:[margin-right:0] max-[768px]:[.emission-page_&_p]:[margin-bottom:0] max-[768px]:[.emission-page_&_p]:[margin-left:0] max-[768px]:[.emission-page_&_p]:[font-size:16px]! max-[768px]:[.emission-page_&_p]:[line-height:1.07]!",
};

const twEmissionPagePriority: Record<string, number> = {
  "[.emission-page_&]:[--content-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 1,
  "[.emission-page_&]:[display:grid]!": 54,
  "[.emission-page_&]:[gap:calc(22_*_var(--content-unit))]": 3,
  "[.emission-page_&]:[width:100%]": 107,
  "[.emission-page_&]:[max-width:calc(1201_*_var(--content-unit))]": 5,
  "[.emission-page_&]:[margin-left:auto]": 6,
  "[.emission-page_&]:[margin-right:auto]": 7,
  "[.emission-page_&]:[position:relative]": 105,
  "[.emission-page_&]:[isolation:isolate]": 106,
  "[.emission-page_&]:[padding-top:calc(60_*_var(--content-unit))]": 10,
  "[.emission-page_&]:[padding-right:calc(67_*_var(--content-unit))]": 11,
  "[.emission-page_&]:[padding-bottom:calc(60_*_var(--content-unit))]": 12,
  "[.emission-page_&]:[padding-left:calc(67_*_var(--content-unit))]": 13,
  "[.emission-page_&]:[border:0.2px_solid_#9eb7d080]": 14,
  "[.emission-page_&]:[border-radius:calc(30_*_var(--content-unit))]": 15,
  "[.emission-page_&]:[background:linear-gradient(125deg,_#e8f4fb80,_#d5eaf840)]": 16,
  "[.emission-page_&]:[color:#27272a]!": 17,
  "[&&_.emission-content-card--dark]:[min-height:calc(365_*_var(--content-unit))]": 18,
  "[&&_.emission-content-card--dark]:[background:linear-gradient(180deg,_#56779280_0%,_#90afcd70_50%,_#d5eaff80_100%)]": 19,
  "[&&_.emission-content-card--dark]:[color:#f7f7f7]!": 20,
  "[.emission-page_&]:[position:absolute]": 188,
  "[.emission-page_&]:[top:0]": 22,
  "[.emission-page_&]:[right:0]": 23,
  "[.emission-page_&]:[bottom:0]": 24,
  "[.emission-page_&]:[left:0]": 25,
  "[.emission-page_&]:[z-index:-1]": 112,
  "[.emission-page_&]:[height:100%]": 28,
  "[.emission-page_&]:[border-radius:inherit]": 29,
  "[.emission-page_&]:[pointer-events:none]": 113,
  "[.emission-page_&]:[opacity:0.35]": 31,
  "[.emission-page_&]:[display:flex]!": 32,
  "[.emission-page_&]:[align-items:center]": 33,
  "[.emission-page_&]:[justify-content:space-between]": 34,
  "[.emission-page_&]:[gap:calc(32_*_var(--content-unit))]": 35,
  "[.emission-page_&_h2]:[margin-top:0]": 194,
  "[.emission-page_&_h2]:[margin-right:0]": 195,
  "[.emission-page_&_h2]:[margin-bottom:0]": 196,
  "[.emission-page_&_h2]:[margin-left:0]": 197,
  "[.emission-page_&_h2]:[font-size:calc(36_*_var(--content-unit))]!": 40,
  "[.emission-page_&_h2]:[font-weight:410]!": 200,
  "[.emission-page_&_h2]:[line-height:1]!": 201,
  "[.emission-page_&_h2]:[letter-spacing:0]": 43,
  "[.emission-page_&_>_p]:[margin-top:0]": 44,
  "[.emission-page_&_>_p]:[margin-right:0]": 45,
  "[.emission-page_&_>_p]:[margin-bottom:0]": 46,
  "[.emission-page_&_>_p]:[margin-left:0]": 47,
  "[.emission-page_&_>_p]:[color:#0d5792]!": 48,
  "[.emission-page_&_>_p]:[font-size:calc(20_*_var(--content-unit))]!": 49,
  "[.emission-page_&_>_p]:[line-height:1.07]!": 50,
  "[.emission-page_&_>_p]:[letter-spacing:-0.04em]": 51,
  "[.emission-page_&_>_p]:[text-align:right]": 52,
  "[.emission-page_.emission-content-card--dark_&&_>_p]:[color:#f7f7f7]!": 53,
  "[.emission-page_&]:[gap:0]": 55,
  "[.emission-page_&]:[margin-top:calc(40_*_var(--content-unit))]": 56,
  "[.emission-page_&]:[font-size:calc(15_*_var(--content-unit))]!": 57,
  "[.emission-page_&]:[line-height:1]!": 186,
  "[.emission-page_&]:[letter-spacing:-0.04em]": 193,
  "[.emission-page_&_p]:[margin-top:0]": 60,
  "[.emission-page_&_p]:[margin-right:0]": 205,
  "[.emission-page_&_p]:[margin-bottom:0]": 206,
  "[.emission-page_&_p]:[margin-left:0]": 63,
  "max-[1200px]:[.emission-page_&]:[--content-unit:1px]": 64,
  "max-[1200px]:[.emission-page_&]:[padding-left:36px]": 65,
  "max-[1200px]:[.emission-page_&]:[padding-right:36px]": 66,
  "max-[1200px]:[.emission-page_&_h2]:[font-size:clamp(28px,_3vw,_36px)]!": 67,
  "max-[1200px]:[.emission-page_&]:[line-height:1.2]!": 68,
  "max-[768px]:[.emission-page_&]:[gap:24px]": 69,
  "max-[768px]:[.emission-page_&]:[padding-top:32px]": 70,
  "max-[768px]:[.emission-page_&]:[padding-right:20px]": 226,
  "max-[768px]:[.emission-page_&]:[padding-bottom:32px]": 72,
  "max-[768px]:[.emission-page_&]:[padding-left:20px]": 228,
  "max-[768px]:[.emission-page_&]:[border-color:#9eb7d055]": 74,
  "max-[768px]:[.emission-page_&]:[border-radius:30px]": 75,
  "max-[768px]:[.emission-page_&]:[background:linear-gradient(125deg,_#e8f4fb80,_#d5eaf840)]": 76,
  "max-[768px]:[&&_.emission-content-card--dark]:[background:linear-gradient(125deg,_#dcecff,_#bfddfc)]": 77,
  "max-[768px]:[&&_.emission-content-card--dark]:[color:#27272a]!": 78,
  "max-[768px]:[&&_.emission-content-card--dark]:[border-color:#ffffff40]": 79,
  "max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[color:#005eff]!": 80,
  "max-[768px]:[.emission-page_.emission-content-card--dark_&&_>_p]:[color:#005eff]!": 81,
  "max-[768px]:[.emission-page_.emission-content-card--light_&&_h2]:[color:#005eff]!": 82,
  "max-[768px]:[.emission-page_.emission-content-card--light_&&_>_p]:[color:#005eff]!": 83,
  "max-[768px]:[.emission-page_&]:[display:none]!": 84,
  "max-[768px]:[.emission-page_&]:[flex-direction:column]": 85,
  "max-[768px]:[.emission-page_&]:[align-items:flex-start]": 86,
  "max-[768px]:[.emission-page_&]:[gap:20px]": 87,
  "max-[768px]:[.emission-page_&_h2]:[font-size:clamp(24px,_7vw,_32px)]!": 88,
  "max-[768px]:[.emission-page_&_h2]:[letter-spacing:-0.04em]": 89,
  "max-[768px]:[.emission-page_&_>_p]:[font-size:20px]!": 90,
  "max-[768px]:[.emission-page_&_>_p]:[text-align:left]": 91,
  "max-[768px]:[.emission-page_&]:[margin-top:32px]": 92,
  "max-[768px]:[.emission-page_&]:[font-size:15px]!": 93,
  "max-[768px]:[.emission-page_&]:[line-height:1.35]!": 94,
  "max-[768px]:[.emission-page_&]:[overflow-wrap:break-word]": 95,
  "max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[font-size:16px]!": 96,
  "max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[line-height:1.05]!": 97,
  "max-[768px]:[.emission-page_.emission-content-card--dark_&&]:[margin-top:40px]": 98,
  "[--emission-header-offset:97px]": 99,
  "[--emission-x-unit:0.0694444444vw]": 100,
  "[--emission-unit:min(var(--emission-x-unit),_0.1035196687svh)]": 101,
  "[width:100%]": 102,
  "[margin-top:calc(-1_*_var(--emission-header-offset))]": 103,
  "[background:#061d38]": 104,
  "[.emission-page_&]:[height:calc(966_*_var(--emission-unit))]": 108,
  "[.emission-page_&]:[overflow:hidden]": 109,
  "[.emission-page_&]:[object-fit:cover]": 110,
  "[.emission-page_&]:[object-position:center]": 111,
  "[.emission-page_&]:[--newsletter-spacing-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 114,
  "[.emission-page_&]:[display:flow-root]!": 115,
  "[.emission-page_&]:[padding-top:40px]": 116,
  "[.emission-page_&]:[padding-right:24px]": 117,
  "[.emission-page_&]:[padding-bottom:calc(115_*_var(--newsletter-spacing-unit))]": 118,
  "[.emission-page_&]:[padding-left:24px]": 119,
  "[.emission-page_&]:[background:linear-gradient(180deg,_#16263a_0,_#9eb7d0_calc(260_*_var(--newsletter-spacing-unit)),_#d5eaf8_calc(440_*_var(--newsletter-spacing-unit)),_#e8f4fb_100%)]": 120,
  "[&_.newsletter-section]:[--mail-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 121,
  "[&_.newsletter-section]:[max-width:calc(1200_*_var(--mail-unit))]": 122,
  "[&_.newsletter-section]:[margin-top:0]": 123,
  "[&_.newsletter-form]:[grid-template-columns:calc(212_*_var(--mail-unit))_calc(308_*_var(--mail-unit))_calc(135_*_var(--mail-unit))_minmax(0,_1fr)]": 124,
  "[&_.newsletter-form]:[gap:calc(29_*_var(--mail-unit))]": 125,
  "[&_.newsletter-form]:[min-height:calc(76_*_var(--mail-unit))]": 126,
  "[&_.newsletter-form]:[padding-top:calc(8_*_var(--mail-unit))]": 127,
  "[&_.newsletter-form]:[padding-right:calc(26_*_var(--mail-unit))]": 128,
  "[&_.newsletter-form]:[padding-bottom:calc(8_*_var(--mail-unit))]": 129,
  "[&_.newsletter-form]:[padding-left:calc(26_*_var(--mail-unit))]": 130,
  "[&_.newsletter-form]:[border-radius:calc(8_*_var(--mail-unit))]": 131,
  "[&_.newsletter-form_h2]:[font-size:calc(30_*_var(--mail-unit))]!": 132,
  "[&_.newsletter-email]:[height:calc(45_*_var(--mail-unit))]": 133,
  "[&_.newsletter-email]:[padding-top:calc(3_*_var(--mail-unit))]": 134,
  "[&_.newsletter-email]:[padding-right:calc(25_*_var(--mail-unit))]": 135,
  "[&_.newsletter-email]:[padding-bottom:calc(3_*_var(--mail-unit))]": 136,
  "[&_.newsletter-email]:[padding-left:calc(25_*_var(--mail-unit))]": 137,
  "[&_.newsletter-email]:[border-radius:calc(8_*_var(--mail-unit))]": 138,
  "[&_.newsletter-email]:[font-size:calc(15_*_var(--mail-unit))]!": 139,
  "[&_.newsletter-submit]:[height:calc(45_*_var(--mail-unit))]": 140,
  "[&_.newsletter-submit]:[padding-top:calc(3_*_var(--mail-unit))]": 141,
  "[&_.newsletter-submit]:[padding-right:calc(25_*_var(--mail-unit))]": 142,
  "[&_.newsletter-submit]:[padding-bottom:calc(3_*_var(--mail-unit))]": 143,
  "[&_.newsletter-submit]:[padding-left:calc(25_*_var(--mail-unit))]": 144,
  "[&_.newsletter-submit]:[border-radius:calc(8_*_var(--mail-unit))]": 145,
  "[&_.newsletter-submit]:[font-size:calc(15_*_var(--mail-unit))]!": 146,
  "[&_.newsletter-submit:disabled]:[opacity:1]": 147,
  "[&_.newsletter-consent]:[align-items:center]": 148,
  "[&_.newsletter-consent]:[gap:calc(10_*_var(--mail-unit))]": 149,
  "[&_.newsletter-consent]:[font-size:calc(13_*_var(--mail-unit))]!": 150,
  "[&_.newsletter-consent]:[line-height:1]!": 151,
  "[&_.newsletter-checkbox]:[flex-basis:calc(18_*_var(--mail-unit))]": 152,
  "[&_.newsletter-checkbox]:[width:calc(18_*_var(--mail-unit))]": 153,
  "[&_.newsletter-checkbox]:[height:calc(18_*_var(--mail-unit))]": 154,
  "[&_.newsletter-checkbox_input]:[width:100%]": 155,
  "[&_.newsletter-checkbox_input]:[height:100%]": 156,
  "[&_.newsletter-checkbox_input]:[border-radius:calc(4_*_var(--mail-unit))]": 157,
  "[&_.newsletter-checkbox_svg]:[top:12%]": 158,
  "[&_.newsletter-checkbox_svg]:[right:12%]": 159,
  "[&_.newsletter-checkbox_svg]:[bottom:12%]": 160,
  "[&_.newsletter-checkbox_svg]:[left:12%]": 161,
  "[&_.newsletter-checkbox_svg]:[width:76%]": 162,
  "[&_.newsletter-checkbox_svg]:[height:76%]": 163,
  "max-[1200px]:[&_.newsletter-section]:[--mail-unit:1px]": 164,
  "max-[1200px]:[&_.newsletter-form]:[grid-template-columns:212px_minmax(180px,_308px)_135px]": 165,
  "max-[1200px]:[&_.newsletter-form]:[gap:20px]": 166,
  "max-[768px]:[&_.newsletter-form]:[grid-template-columns:1fr]": 167,
  "max-[768px]:[&_.newsletter-form]:[padding-top:24px]": 168,
  "max-[768px]:[&_.newsletter-form]:[padding-right:24px]": 169,
  "max-[768px]:[&_.newsletter-form]:[padding-bottom:24px]": 170,
  "max-[768px]:[&_.newsletter-form]:[padding-left:24px]": 171,
  "max-[768px]:[&_.newsletter-form_h2]:[font-size:28px]!": 172,
  "max-[768px]:[&_.newsletter-consent]:[align-items:flex-start]": 173,
  "max-[768px]:[&_.newsletter-consent]:[font-size:13px]!": 174,
  "max-[768px]:[&_.newsletter-consent]:[line-height:1.3]!": 175,
  "[.emission-page_&]:[top:calc(182_*_var(--emission-unit))]": 177,
  "[.emission-page_&]:[left:calc(102_*_var(--emission-x-unit))]": 178,
  "[.emission-page_&]:[margin-top:0]": 179,
  "[.emission-page_&]:[margin-right:0]": 180,
  "[.emission-page_&]:[margin-bottom:0]": 181,
  "[.emission-page_&]:[margin-left:0]": 182,
  "[.emission-page_&]:[color:#9eb7d0]!": 183,
  "[.emission-page_&]:[font-size:calc(36_*_var(--emission-unit))]!": 184,
  "[.emission-page_&]:[font-weight:410]!": 185,
  "[.emission-page_&]:[letter-spacing:0]": 187,
  "[.emission-page_&]:[top:calc(756_*_var(--emission-unit))]": 189,
  "[.emission-page_&]:[left:calc(183_*_var(--emission-x-unit))]": 190,
  "[.emission-page_&]:[width:calc(877_*_var(--emission-x-unit))]": 191,
  "[.emission-page_&]:[max-width:calc(100%_-_48px)]": 192,
  "[.emission-page_&_h2]:[color:#f7f7f7]!": 198,
  "[.emission-page_&_h2]:[font-size:calc(50_*_var(--emission-unit))]!": 199,
  "[.emission-page_&_p]:[width:calc(869_*_var(--emission-x-unit))]": 202,
  "[.emission-page_&_p]:[max-width:100%]": 203,
  "[.emission-page_&_p]:[margin-top:calc(11_*_var(--emission-unit))]": 204,
  "[.emission-page_&_p]:[margin-left:calc(8_*_var(--emission-x-unit))]": 207,
  "[.emission-page_&_p]:[color:#9eb7d0]!": 208,
  "[.emission-page_&_p]:[font-size:calc(20_*_var(--emission-unit))]!": 209,
  "[.emission-page_&_p]:[line-height:1.07]!": 210,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[min-height:680px]": 211,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[top:150px]": 212,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[font-size:clamp(28px,_2.5vw,_36px)]!": 213,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[top:auto]": 214,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[bottom:76px]": 215,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[left:8%]": 216,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[width:84%]": 217,
  "min-[768px]:max-[1200px]:[.emission-page_&]:[max-width:none]": 218,
  "min-[768px]:max-[1200px]:[.emission-page_&_h2]:[font-size:clamp(36px,_4vw,_50px)]!": 219,
  "min-[768px]:max-[1200px]:[.emission-page_&_p]:[width:min(869px,_100%)]": 220,
  "min-[768px]:max-[1200px]:[.emission-page_&_p]:[margin-left:0]": 221,
  "min-[768px]:max-[1200px]:[.emission-page_&_p]:[font-size:18px]!": 222,
  "min-[768px]:max-[1200px]:[.emission-page_&_p]:[line-height:1.2]!": 223,
  "max-[768px]:[.emission-page_&]:[--newsletter-spacing-unit:1px]": 224,
  "max-[768px]:[.emission-page_&]:[padding-top:24px]": 225,
  "max-[768px]:[.emission-page_&]:[padding-bottom:80px]": 227,
  "max-[768px]:[.emission-page_&]:[background:linear-gradient(110deg,_#e8f4fb,_#d5eaff)]": 229,
  "max-[768px]:[.emission-page_&]:[height:auto]": 230,
  "max-[768px]:[.emission-page_&]:[padding-top:clamp(380px,_99vw,_650px)]": 231,
  "max-[768px]:[.emission-page_&]:[padding-right:40px]": 232,
  "max-[768px]:[.emission-page_&]:[padding-bottom:56px]": 233,
  "max-[768px]:[.emission-page_&]:[padding-left:40px]": 234,
  "max-[768px]:[.emission-page_&]:[background:#e8f4fb]": 235,
  "max-[768px]:[.emission-page_&]:[width:180%]!": 1000236,
  "max-[768px]:[.emission-page_&]:[height:auto]!": 1000237,
  "max-[768px]:[.emission-page_&]:[max-width:none]": 261,
  "max-[768px]:[.emission-page_&]:[left:-40%]!": 1000239,
  "max-[768px]:[.emission-page_&]:[right:auto]!": 1000240,
  "max-[768px]:[.emission-page_&]:[object-fit:contain]": 241,
  "max-[768px]:[.emission-page_&]:[object-position:center_top]": 242,
  "max-[768px]:[.emission-page_&]:[mask-image:linear-gradient(to_bottom,_#000_65%,_transparent_100%)]": 243,
  "max-[768px]:[.emission-page_&::after]:[content:'']": 244,
  "max-[768px]:[.emission-page_&::after]:[position:absolute]": 245,
  "max-[768px]:[.emission-page_&::after]:[top:0]": 246,
  "max-[768px]:[.emission-page_&::after]:[right:0]": 247,
  "max-[768px]:[.emission-page_&::after]:[bottom:0]": 248,
  "max-[768px]:[.emission-page_&::after]:[left:0]": 249,
  "max-[768px]:[.emission-page_&::after]:[z-index:-1]": 250,
  "max-[768px]:[.emission-page_&::after]:[background:linear-gradient(to_bottom,_transparent_45%,_#d5eaf8_83%,_#e8f4fb_100%)]": 251,
  "max-[768px]:[.emission-page_&::after]:[pointer-events:none]": 252,
  "max-[768px]:[.emission-page_&]:[top:154px]": 253,
  "max-[768px]:[.emission-page_&]:[left:24px]": 254,
  "max-[768px]:[.emission-page_&]:[font-size:28px]!": 255,
  "max-[768px]:[.emission-page_&]:[position:relative]": 256,
  "max-[768px]:[.emission-page_&]:[top:auto]": 257,
  "max-[768px]:[.emission-page_&]:[bottom:auto]": 258,
  "max-[768px]:[.emission-page_&]:[left:auto]": 259,
  "max-[768px]:[.emission-page_&]:[width:100%]": 260,
  "max-[768px]:[.emission-page_&_h2]:[max-width:7em]": 262,
  "max-[768px]:[.emission-page_&_h2]:[font-size:clamp(27px,_7.8vw,_40px)]!": 263,
  "max-[768px]:[.emission-page_&_h2]:[line-height:1]!": 264,
  "max-[768px]:[.emission-page_&_p]:[width:100%]": 265,
  "max-[768px]:[.emission-page_&_p]:[margin-top:24px]": 266,
  "max-[768px]:[.emission-page_&_p]:[margin-right:0]": 267,
  "max-[768px]:[.emission-page_&_p]:[margin-bottom:0]": 268,
  "max-[768px]:[.emission-page_&_p]:[margin-left:0]": 269,
  "max-[768px]:[.emission-page_&_p]:[font-size:16px]!": 270,
  "max-[768px]:[.emission-page_&_p]:[line-height:1.07]!": 271,
  "max-[768px]:[&_.uncompromising-performance]:[--glass-top:clamp(44px,_13vw,_92px)]": 272,
  "max-[768px]:[&_.uncompromising-performance]:[padding-top:64px]": 273,
  "max-[768px]:[&_.uncompromising-performance]:[padding-right:0]": 274,
  "max-[768px]:[&_.uncompromising-performance]:[padding-bottom:64px]": 275,
  "max-[768px]:[&_.uncompromising-performance]:[padding-left:0]": 276,
  "max-[768px]:[&_.uncompromising-stage]:[height:230px]": 277,
  "max-[768px]:[&_.uncompromising-stage_h2]:[font-size:clamp(23px,_7vw,_54px)]!": 278,
  "max-[768px]:[&_.uncompromising-glass]:[width:60%]": 279,
  "max-[768px]:[&_.uncompromising-glass]:[max-width:300px]": 280,
  "max-[768px]:[&_.uncompromising-glass]:[padding-top:22px]": 281,
  "max-[768px]:[&_.uncompromising-glass]:[padding-right:16px]": 282,
  "max-[768px]:[&_.uncompromising-glass]:[padding-bottom:22px]": 283,
  "max-[768px]:[&_.uncompromising-glass]:[padding-left:16px]": 284,
  "max-[768px]:[&_.uncompromising-glass_p]:[font-size:16px]!": 285,
  "max-[768px]:[&_.uncompromising-glass_p]:[line-height:1]!": 286,
  "max-[768px]:[&_.uncompromising-glow]:[top:var(--glass-top)]": 287,
  "max-[768px]:[&_.uncompromising-glow]:[width:90%]": 288,
  "max-[768px]:[&_.uncompromising-glow]:[height:220px]": 289,
};

function twEmissionPage(value: string | undefined): string {
  const names = (value ?? "").split(/\s+/).filter(Boolean);
  const selected = new Map<string, string>();
  for (const name of names)
    for (const token of (twEmissionPageRules[name] ?? "")
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
        (twEmissionPagePriority[token] ?? 0) >=
          (twEmissionPagePriority[old] ?? 0)
      )
        selected.set(key, token);
    }
  return [...names, ...selected.values()].join(" ");
}
