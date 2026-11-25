"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";

import { LuMinus, LuPlus } from "react-icons/lu";

import gsap from "gsap";
import { motion, useReducedMotion, type Variants } from "framer-motion";

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

import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";

const TOC_VIEWPORT_HEIGHT = 400;

const TOC_FADE_HEIGHT = 475;

const TOC_ROW_HEIGHT = 79;

const TOC_BLUR_START_RATIO = 0.515;

const categories = [
  { number: "01", title: "Digital Tools & Software Usage" },

  { number: "02", title: "Technical Terms & Basic Parameters" },

  { number: "03", title: "Pump Types, Components & Control Panels" },

  {
    number: "04",
    title: "Corrosion-Resistant Pump Materials and Applications",
  },

  { number: "05", title: "Installation, Maintenance & Warranty Policies" },

  { number: "06", title: "Installation, Maintenance & Warranty Policies" },
];

const pumpSelectionAnswer = [
  "You can log in using a username and password.",

  "After logging in, you can proceed to the next step by entering the details of the pump you request, such as the type of fluid, flow rate, discharge head, static head, and rpm.",

  'After entering the necessary information, click the "select pump" button and pump series are listed based on efficiency, either individually or in multiples.',

  "By accessing the data sheet of the requested pump, you can manually select the pump material, motor, mechanical seal, flange pressure classes, and their locations. If you want the standard material combination and information, there's no need to select manually.",

  'After completing the steps, you can obtain a printout of the data sheet by clicking the "print" button.',
];

// The desktop reference shows seven rows; the compact reference shows eight.

const questions = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,

  answer: pumpSelectionAnswer,
}));

type AccordionItemProps = {
  item: (typeof questions)[number];

  isOpen: boolean;

  onToggle: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTOCRowVisual(index: number, scrollTop: number) {
  const rowTop = index * TOC_ROW_HEIGHT - scrollTop;

  const rowCenter = rowTop + TOC_ROW_HEIGHT * 0.56;

  const blurStart = TOC_FADE_HEIGHT * TOC_BLUR_START_RATIO;

  const progress = clamp(
    (rowCenter - blurStart) / (TOC_FADE_HEIGHT - blurStart),
    0,
    1,
  );

  return {
    blur: Math.pow(progress, 1.14) * 7.2,

    opacity: clamp(1 - Math.pow(progress, 1.02) * 0.84, 0.12, 1),

    lineOpacity: clamp(0.26 - progress * 0.2, 0.04, 0.26),
  };
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  const reduced = useReducedMotion() ?? false;

  const answerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = answerRef.current;

    const content = contentRef.current;

    if (!panel || !content) return;

    gsap.killTweensOf(panel);

    gsap.killTweensOf(content);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panel, { height: isOpen ? "auto" : 0 });

      gsap.set(content, { opacity: isOpen ? 1 : 0, y: 0 });

      return;
    }

    if (isOpen) {
      gsap.to(panel, {
        height: content.scrollHeight,

        duration: 0.68,

        ease: "back.out(1.45)",

        overwrite: "auto",

        onComplete: () => gsap.set(panel, { height: "auto" }),
      });

      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.38,
        delay: 0.1,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.set(panel, { height: panel.getBoundingClientRect().height });

      gsap.to(panel, {
        height: 0,
        duration: 0.44,
        ease: "back.in(0.85)",
        overwrite: "auto",
      });

      gsap.to(content, {
        opacity: 0,
        y: -8,
        duration: 0.22,
        ease: "power2.in",
        overwrite: "auto",
      });
    }

    return () => {
      gsap.killTweensOf(panel);

      gsap.killTweensOf(content);
    };
  }, [isOpen]);

  return (
    <motion.article
      {...entrance("up", Math.min(item.id - 1, 3) * 0.055, reduced, 0.16, 28)}
      className={`w-full overflow-hidden rounded-[14px] border border-[#9eb7d0] bg-transparent min-[1200px]:rounded-[calc(12*var(--faq-unit))] ${item.id === 8 ? "min-[1200px]:hidden" : ""}`}
    >
      <button
        id={`faq-question-${item.id}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="flex min-h-[78px] w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-[22px] py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#005eff] min-[1200px]:min-h-[calc(69*var(--faq-unit))] min-[1200px]:gap-[calc(32*var(--faq-unit))] min-[1200px]:px-[calc(23*var(--faq-unit))] min-[1200px]:py-0"
      >
        <span
          className={`min-w-0 text-[clamp(13px,3.93vw,16px)] leading-[1.05] tracking-[-0.035em] transition-[color,font-size,font-weight] duration-300 motion-reduce:transition-none min-[768px]:text-[18px] min-[1200px]:leading-[1.18] ${isOpen ? "font-[540] text-[#0049e0] min-[1200px]:text-[calc(17*var(--faq-unit))]" : "font-[410] text-[#0d3235] min-[1200px]:text-[calc(15.5*var(--faq-unit))]"}`}
        >
          How Should I Use the
          <br className="min-[768px]:hidden" /> Pump Selection Assistant?
        </span>

        <span
          className="grid size-6 shrink-0 place-items-center text-[#0d3235] min-[1200px]:size-[calc(24*var(--faq-unit))]"
          aria-hidden="true"
        >
          {isOpen ? (
            <LuMinus className="size-full" strokeWidth={1.3} />
          ) : (
            <LuPlus className="size-full" strokeWidth={1.3} />
          )}
        </span>
      </button>

      <div
        ref={answerRef}
        id={`faq-answer-${item.id}`}
        role="region"
        aria-labelledby={`faq-question-${item.id}`}
        aria-hidden={!isOpen}
        className="[height:0] [overflow:hidden]"
      >
        <div
          ref={contentRef}
          className="px-[22px] pt-2 pb-7 text-[15px] leading-[1.4] text-[#27272a] min-[1200px]:px-[calc(23*var(--faq-unit))] min-[1200px]:pb-[calc(32*var(--faq-unit))] min-[1200px]:text-[calc(15*var(--faq-unit))] [opacity:0] [transform:translateY(-8px)]"
        >
          <ul className="m-0 list-disc space-y-2 pl-5">
            {item.answer.map((answer) => (
              <li key={answer}>{answer}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export default function FAQPage() {
  const reduced = useReducedMotion() ?? false;

  const scrollRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({ active: false, startY: 0, scrollTop: 0 });

  const [isDragging, setIsDragging] = useState(false);

  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const [tocScrollTop, setTocScrollTop] = useState(0);

  function syncTOCScroll() {
    const element = scrollRef.current;

    if (!element || !element.clientHeight) return;

    setTocScrollTop(
      element.scrollTop / (element.clientHeight / TOC_VIEWPORT_HEIGHT),
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const element = scrollRef.current;

    if (!element) return;

    dragRef.current = {
      active: true,
      startY: event.clientY,
      scrollTop: element.scrollTop,
    };

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active || !scrollRef.current) return;

    scrollRef.current.scrollTop =
      dragRef.current.scrollTop - (event.clientY - dragRef.current.startY);

    syncTOCScroll();
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    dragRef.current.active = false;

    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <main
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] relative w-full overflow-x-clip bg-[radial-gradient(ellipse_85%_90%_at_12%_42%,#f4f9ffbf_0%,#ebf5ff59_55%,transparent_100%),linear-gradient(110deg,#e7f2fd_0%,#ddeeff_38%,#d3e8ff_70%,#cbe3ff_100%)] font-[410] text-[#27272a] [font-family:var(--font-sf-pro),sans-serif] [font-stretch:125%] [font-variation-settings:'wdth'_125] [--faq-unit:1px] min-[1200px]:[--faq-unit:clamp(0.833333px,0.0694444444vw,1.777778px)]"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />

      <div className="mx-auto w-5/6 max-w-[calc(1200*var(--faq-unit))] pt-12 pb-20 min-[1200px]:pt-[calc(64*var(--faq-unit))] min-[1200px]:pb-[calc(80*var(--faq-unit))]">
        <motion.h1
          {...entrance("left", 0.02, reduced, 0.2, 38)}
          className="m-0 text-center text-[clamp(24px,7.4vw,30px)] leading-none tracking-normal text-[#0d5792] min-[1200px]:text-left min-[1200px]:text-[calc(50*var(--faq-unit))]"
        >
          <span className="whitespace-nowrap">Frequently Asked</span>
          <br />
          Questions
        </motion.h1>

        <div className="mt-9 grid grid-cols-1 items-start min-[1200px]:mt-[calc(70*var(--faq-unit))] min-[1200px]:grid-cols-[minmax(0,254fr)_minmax(0,840fr)] min-[1200px]:gap-[calc(106*var(--faq-unit))]">
          <motion.aside
            {...entrance("left", 0.09, reduced, 0.2, 32)}
            aria-label="Table of Contents"
            className="hidden min-w-0 min-[1200px]:block"
          >
            <h2 className="flex h-[calc(27*var(--faq-unit))] w-[calc(228*var(--faq-unit))] items-center rounded-[calc(9*var(--faq-unit))] bg-[#f7f7f7] pl-[calc(17*var(--faq-unit))] text-[calc(15*var(--faq-unit))] leading-none tracking-[-0.03em]">
              Table of Contents
            </h2>

            <div
              ref={scrollRef}
              onScroll={syncTOCScroll}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              role="region"
              aria-label="FAQ categories"
              tabIndex={0}
              className="h-[calc(400*var(--faq-unit))] overflow-x-hidden overflow-y-auto select-none [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] [&::-webkit-scrollbar]:hidden"
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <ol className="m-0 list-none p-0 pb-[calc(321*var(--faq-unit))]">
                {categories.map((category, index) => {
                  const visual = getTOCRowVisual(index, tocScrollTop);

                  return (
                    <li
                      key={category.number}
                      className="relative h-[calc(79*var(--faq-unit))]"
                    >
                      <div
                        className="relative flex h-full items-center gap-[calc(14*var(--faq-unit))] pl-[calc(15*var(--faq-unit))]"
                        style={{
                          filter: `blur(${visual.blur}px)`,
                          opacity: visual.opacity,
                        }}
                      >
                        <span className="w-[calc(39*var(--faq-unit))] shrink-0 text-[calc(26*var(--faq-unit))] leading-none font-[540] tracking-[-0.01em]">
                          {category.number}
                        </span>

                        <span className="min-w-0 text-[calc(13*var(--faq-unit))] leading-[1.05] tracking-[-0.035em]">
                          {category.title}
                        </span>

                        {index !== categories.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-px"
                            style={{
                              backgroundColor: `rgba(13,87,146,${visual.lineOpacity})`,
                            }}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.aside>

          <section
            aria-label="Frequently asked questions"
            className="flex min-w-0 flex-col gap-[14px] min-[1200px]:gap-[calc(17.3*var(--faq-unit))]"
          >
            {questions.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openQuestion === item.id}
                onToggle={() =>
                  setOpenQuestion(openQuestion === item.id ? null : item.id)
                }
              />
            ))}
          </section>
        </div>

        <motion.div
          {...entrance("up", 0, reduced, 0.13, 35)}
          className="mt-[72px] min-[1200px]:mt-[calc(120*var(--faq-unit))]"
        >
          <NewsletterSubscription scaled />
        </motion.div>
      </div>
    </main>
  );
}
