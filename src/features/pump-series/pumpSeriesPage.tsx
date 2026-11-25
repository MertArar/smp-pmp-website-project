"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useId, useMemo, useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import {
  JoinSempaGlobal,
  CatalogSolutions,
} from "@/components/catalog/CatalogSections";
import SeriesMarquee from "@/components/catalog/SeriesMarquee";
import SmartPumpAssistant from "@/components/smart-pump/SmartPumpAssistant";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
const seriesEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
type SeriesRevealDirection = "up" | "left" | "right";
const seriesRevealVariants: Variants = {
  hidden: ({
    direction,
    reduced,
  }: {
    direction: SeriesRevealDirection;
    reduced: boolean;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -34
        : direction === "right"
          ? 34
          : 0,
    y: reduced ? 0 : direction === "up" ? 32 : 0,
  }),
  visible: { opacity: 1, x: 0, y: 0 },
};
function seriesReveal(
  direction: SeriesRevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.15,
) {
  return {
    variants: seriesRevealVariants,
    custom: { direction, reduced },
    initial: reduced ? (false as const) : ("hidden" as const),
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -8% 0px" },
    transition: {
      duration: reduced ? 0 : 0.85,
      delay: reduced ? 0 : delay,
      ease: seriesEase,
    },
  };
}
function seriesHeroEnter(reduced: boolean, delay = 0, y = 24) {
  return {
    initial: reduced ? false : { opacity: 0, y, filter: "blur(5px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: reduced ? 0 : 0.95, delay, ease: seriesEase },
  };
}

const FAMILIES = [
  {
    slug: "end-suction",
    title: "End Suction Pumps",
    models:
      "ASL | TKF | TKF-M | TKF-AH | TKF-K | DPT-DI | DPT-TR | TKF-KE | MKF-Y | TKF-Y",
    image: "end-suction.webp",
    description:
      "Maximum efficiency, minimum maintenance. Our end suction pumps are the reliable solution for continuous fluid transfer.",
  },
  {
    slug: "multi-stage",
    title: "Multi Stage Pumps",
    models: "ARS | ARS-DD | DPT-TR",
    image: "multi-stage.webp",
    description: "Explore our multi stage pump series for your application.",
  },
  {
    slug: "sewage",
    title: "Sewage Pumps",
    models: "Sewage pump series",
    image: "sewage.webp",
    description:
      "Discover pumping solutions for wastewater handling and transfer.",
  },
  {
    slug: "in-line",
    title: "In-Line Pumps",
    models: "DPT | DPT-DI",
    image: "in-line.webp",
    description: "Explore our in-line pump range for your system requirements.",
  },
  {
    slug: "split-case",
    title: "Split Case Pumps",
    models: "ASL",
    image: "split-case.webp",
    description: "Discover our split case pump series for your project.",
  },
  {
    slug: "self-priming",
    title: "Self Priming Pumps",
    models: "Self priming pump series",
    image: "self-priming.webp",
    description: "Explore self priming pumping solutions for your application.",
  },
  {
    slug: "fire-fighting",
    title: "Fire Fighting Pumps",
    models: "Fire fighting pump series",
    image: "fire-fighting.webp",
    description:
      "Explore our fire fighting pump range with our engineering team.",
  },
  {
    slug: "vertical-multi-stage",
    title: "Vertical Multi Stage Pumps",
    models: "Vertical multi stage pump series",
    image: "vertical-multi-stage.webp",
    description:
      "Explore our vertical multi stage pumping solutions for your application.",
  },
  {
    slug: "horizontal-axial-flow",
    title: "Horizontal Axial Flow Pumps",
    models: "Horizontal axial flow pump series",
    image: "horizontal-axial-flow.webp",
    description:
      "Discover our horizontal axial flow pumping solutions for your project.",
  },
  {
    slug: "vertical-turbine-axial-flow",
    title: "Vertical Turbine & Axial Flow Pumps",
    models: "Vertical turbine and axial flow pump series",
    image: "vertical-turbine-axial-flow.webp",
    description:
      "Explore our vertical turbine and axial flow pump range for your system.",
  },
];

export default function PumpSeriesPage({
  artwork,
}: {
  artwork: Record<string, string>;
}) {
  const reduced = useReducedMotion() ?? false;
  const [query, setQuery] = useState("");
  const searchId = useId();
  const families = useMemo(
    () =>
      FAMILIES.filter((item) =>
        `${item.title} ${item.models}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query],
  );
  return (
    <main
      data-pump-series-page
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] isolate w-full overflow-x-clip motion-reduce:[&_.ps-card_*]:transition-none! bg-[#d1e8f3] text-[#0d5792] [font-family:var(--font-sf-pro),sans-serif] [font-variation-settings:'wdth'_125,'wght'_410]"
    >
      <div className="h-[var(--site-header-height,97px)]" />
      <section
        aria-labelledby="pump-series-title"
        className="mx-auto w-[90%] max-w-[1600px] pt-8 md:w-5/6 md:pt-12"
      >
        <div
          data-series-heading
          className="flex flex-wrap items-center gap-x-8 gap-y-5"
        >
          <motion.h1
            {...seriesHeroEnter(reduced, 0.08)}
            id="pump-series-title"
            className="text-[25px] font-[650] tracking-[-.035em]"
          >
            Product Series
          </motion.h1>
          <motion.nav
            {...seriesHeroEnter(reduced, 0.18, 16)}
            aria-label="Breadcrumb"
            className="text-[11px] text-[#9eb7d0]"
          >
            <Link href="/">Home</Link> &gt; Products
          </motion.nav>
          <motion.div
            {...seriesHeroEnter(reduced, 0.28, 18)}
            className="relative w-full md:ml-auto md:w-[280px]"
          >
            <label className="sr-only" htmlFor={searchId}>
              Search product series
            </label>
            <input
              id={searchId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="SEARCH PRODUCT"
              className="h-12 w-full rounded-[22px] border border-white/70 bg-white/20 pr-12 pl-6 text-xs tracking-[-.025em] shadow-[0_8px_22px_#005eff25,inset_0_0_10px_#ffffff20] outline-none placeholder:text-[#9eb7d0] focus:border-[#005eff] md:text-[13px] [font-variation-settings:'wdth'_110,'wght'_410]"
            />
            {query ? (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-3 grid w-8 place-items-center text-[#4687b8]"
              >
                <FiX />
              </button>
            ) : (
              <Image
                src="/pump-series/search.png"
                alt=""
                width={28}
                height={28}
                className="pointer-events-none absolute top-1/2 right-4 size-7 -translate-y-1/2 object-contain"
              />
            )}
          </motion.div>
        </div>
        <p aria-live="polite" className="sr-only">
          {families.length} product families
        </p>
        <div
          data-series-grid
          className="mt-10 grid grid-cols-1 gap-x-7 gap-y-10 md:mt-16 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:mt-20 lg:gap-y-16"
        >
          {families.map((item) => {
            const index = FAMILIES.indexOf(item);
            const suppliedImage =
              artwork[item.slug] ??
              artwork[`pump${index + 1}`] ??
              artwork["pump-series"];
            const image = suppliedImage ?? `/pump-series/${item.image}`;
            const darkImage =
              artwork[`${item.slug}-dark`] ??
              artwork[`pump${index + 1}-dark`] ??
              artwork["pump-series-black"] ??
              artwork["pump-series-dark"];
            return (
              <motion.div
                key={item.slug}
                {...seriesReveal("up", (index % 2) * 0.12, reduced, 0.11)}
                className="min-w-0"
              >
                <Link
                  href={`/all-products?series=${encodeURIComponent(item.title)}`}
                  data-series-card
                  data-series-slug={item.slug}
                  className="ps-card group block min-w-0 rounded-[25px] outline-none focus-visible:ring-2 focus-visible:ring-[#005eff] focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[585/329] overflow-hidden rounded-[25px] bg-[#f1f1f1] shadow-[0_30px_55px_#005eff25]">
                    <Image
                      src={image}
                      alt={item.title}
                      fill
                      preload={index < 2}
                      sizes="(max-width:767px) 90vw, (max-width:1920px) 41vw, 784px"
                      className={`ps-art transition-opacity duration-500 ${suppliedImage ? "object-cover" : "object-contain p-8"} ${darkImage ? "group-hover:opacity-0 group-focus-visible:opacity-0" : ""}`}
                    />
                    {darkImage && (
                      <Image
                        src={darkImage}
                        alt=""
                        fill
                        sizes="(max-width:767px) 90vw, 41vw"
                        className={`${suppliedImage ? "object-cover" : "object-contain p-8"} opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100`}
                      />
                    )}
                    <SeriesMarquee />
                  </div>
                  <div className="relative -mt-6 h-[130px]">
                    <div className="ps-caption transition-[min-height,box-shadow] duration-500 ease-out group-hover:min-h-[120px] group-focus-visible:min-h-[120px] group-hover:shadow-[0_20px_35px_#005eff22] group-focus-visible:shadow-[0_20px_35px_#005eff22] max-md:flex-wrap absolute top-0 right-[1%] left-[1%] flex min-h-[100px] items-center gap-3 rounded-[25px] border border-white/60 bg-white/50 px-[6%] py-5 shadow-[0_12px_30px_#005eff0d] backdrop-blur-[15px]">
                      <span
                        aria-hidden
                        className="ps-arrow -mr-3 grid h-8 w-0 -translate-x-2 opacity-0 transition-[width,opacity,margin,transform] duration-400 group-hover:mr-0 group-hover:w-8 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:mr-0 group-focus-visible:w-8 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#0877ff,#001ca3)] text-white shadow-[0_0_22px_#005eff66]"
                      >
                        <FiArrowRight className="size-6" />
                      </span>
                      <h2 className="min-w-0 bg-[linear-gradient(130deg,#005eff,#001ea2)] bg-clip-text text-[clamp(17px,1.7vw,32px)] leading-[1.05] tracking-[-.035em] text-transparent uppercase">
                        {item.title}
                      </h2>
                      <p className="ps-description max-h-0 max-w-0 overflow-hidden opacity-0 transition-[max-width,max-height,opacity] duration-500 group-hover:max-h-[130px] group-hover:max-w-[28%] group-hover:opacity-100 group-focus-visible:max-h-[130px] group-focus-visible:max-w-[28%] group-focus-visible:opacity-100 max-md:group-hover:max-w-full! max-md:group-hover:basis-full max-md:group-focus-visible:max-w-full! max-md:group-focus-visible:basis-full ml-auto shrink-0 text-[clamp(9px,.7vw,12px)] leading-[1.12] text-[#82b7d3]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {families.length === 0 && (
          <motion.div
            {...seriesReveal("up", 0, reduced, 0.15)}
            data-series-empty
            className="py-20 text-center"
          >
            <p>No product series found.</p>
            <button onClick={() => setQuery("")} className="mt-4 underline">
              Clear search
            </button>
          </motion.div>
        )}
      </section>
      <motion.div {...seriesReveal("left", 0, reduced, 0.12)}>
        <JoinSempaGlobal assetBase="/pump-series" />
      </motion.div>
      <motion.div {...seriesReveal("up", 0, reduced, 0.1)}>
        <CatalogSolutions assetBase="/pump-series" />
      </motion.div>
      <SmartPumpAssistant assetBase="/pump-series" />
      <motion.div
        {...seriesReveal("up", 0, reduced, 0.1)}
        data-series-newsletter
        className="mx-auto w-full max-w-[1600px] px-5 pt-1 pb-32 md:w-[94%] md:px-8 md:pt-8 lg:w-[90%] lg:px-6 xl:px-10"
      >
        <NewsletterSubscription
          scaled
          className="max-w-none! 2xl:[--mail-unit:1.25px]!"
        />
      </motion.div>
    </main>
  );
}
