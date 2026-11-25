"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import WaveButton from "@/components/ui/WaveButton";

// ============================================================
// HISTORY TIMELINE DATA
// ============================================================

const HISTORY_POINTS = [
  {
    id: "80s",
    year: "80’S",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "11.23%",
    y: "93.59%",
    phase: "-0.35s",
  },
  {
    id: "90s",
    year: "90’S",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "33.95%",
    y: "83.46%",
    phase: "-1.4s",
  },
  {
    id: "20s",
    year: "20’S",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "55.99%",
    y: "76.30%",
    phase: "-2.25s",
  },
  {
    id: "now",
    year: "NOW",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "76.85%",
    y: "68.26%",
    phase: "-0.9s",
  },
] as const;

type HistoryPoint = (typeof HISTORY_POINTS)[number];

// Detail records come from the supplied reference. Sort by year independently
// of their order in the artwork; same-year records retain their input order.
const HISTORY_EVENTS = [
  {
    id: "inception",
    year: 1972,
    category: "INCEPTION",
    title: "Sempa (under the name MSM) was established in Konya.",
    description:
      "SEMPA was founded in 1972 under the name MSM in Konya, Turkey, initially established to meet the surface water pump requirements of the Konya region.",
  },
  {
    id: "turbine",
    year: 1989,
    category: "DEVELOPMENT",
    title: "Deep Well Turbine Pump Manufacturing",
    description:
      "In response to receding vertical shaft surface water levels, commenced the manufacturing of deep well turbine pumps.",
  },
  {
    id: "submersible",
    year: 1991,
    category: "INNOVATION",
    title: "Submersible Pump Production Launch",
    description:
      "Initiated the production of high-efficiency submersible pumps and motors tailored for deep borehole agricultural irrigation.",
  },
  {
    id: "foundry",
    year: 1994,
    category: "FOUNDRY",
    title: '"0 to 1" Production Philosophy & First In-House Foundry',
    description:
      'Adopted the "0 to 1" manufacturing philosophy and established Turkey’s first specialized in-house foundry in the pump manufacturing sector.',
  },
  {
    id: "rebranding",
    year: 1996,
    category: "REBRANDING",
    title: "SEMPA Brand Renewal & ISO 9000 Quality Management",
    description:
      "Rebranded from MSM to SEMPA as part of corporate restructuring and expansion strategies. Established the ISO 9000 Quality Management System.",
  },
  {
    id: "export",
    year: 1991,
    category: "EXPORT",
    title: "First International Export to the United States (USA)",
    description:
      "Achieved landmark first international export to the United States of America (USA), introducing SEMPA engineering to global markets.",
  },
  // Preview records requested for layout review; replace with verified milestones later.
  {
    id: "preview-2020",
    year: 2020,
    category: "PREVIEW",
    title: "Digital Pump Monitoring Pilot",
    description:
      "A sample project exploring remote diagnostics, operating data, and connected pump monitoring.",
  },
  {
    id: "preview-2021",
    year: 2021,
    category: "PREVIEW",
    title: "High-Efficiency Hydraulic Design",
    description:
      "A concept milestone for hydraulic simulation and more efficient industrial pumping systems.",
  },
  {
    id: "preview-2022",
    year: 2022,
    category: "PREVIEW",
    title: "Advanced Manufacturing Workshop",
    description:
      "An illustrative manufacturing initiative focused on precision machining and repeatable production quality.",
  },
  {
    id: "preview-2023",
    year: 2023,
    category: "PREVIEW",
    title: "International Engineering Partnerships",
    description:
      "An example collaboration milestone connecting engineering teams and regional service partners.",
  },
  {
    id: "preview-2024",
    year: 2024,
    category: "PREVIEW",
    title: "Circular Production Programme",
    description:
      "A sample programme exploring material recovery and resource efficiency across production.",
  },
  {
    id: "preview-2025",
    year: 2025,
    category: "PREVIEW",
    title: "Smart Service Demonstration",
    description:
      "A demonstration of digital service planning, maintenance insights, and connected technical support.",
  },
  {
    id: "preview-2026-lab",
    year: 2026,
    category: "PREVIEW",
    title: "Next-Generation Pump Test Lab",
    description:
      "A concept test environment for performance measurement and future pump technology development.",
  },
  {
    id: "preview-2026-network",
    year: 2026,
    category: "PREVIEW",
    title: "Global Service Network Concept",
    description:
      "An illustrative service network linking technical expertise, training, and customer support.",
  },
].sort((a, b) => a.year - b.year);

gsap.registerPlugin(ScrollTrigger);

const timelineWindowSize = 4;
const maximumPairRise = 64;
const maximumGroupRise = 185;

function timelineRiseForGap(yearGap: number, betweenPairs = false) {
  const gap = Math.max(0, yearGap);
  // Each pair forms a gentle slope; the next pair sits on a higher terrace.
  // Keep date-sensitive variation within both ranges without allowing cliffs.
  return betweenPairs
    ? Math.min(maximumGroupRise, 160 + gap * 8)
    : Math.min(maximumPairRise, 44 + gap * 6);
}

const historyRises = [0];
for (let index = 1; index < HISTORY_EVENTS.length; index++) {
  historyRises.push(
    historyRises[index - 1] +
      timelineRiseForGap(
        HISTORY_EVENTS[index].year - HISTORY_EVENTS[index - 1].year,
        index % 2 === 0,
      ),
  );
}
const largestWindowRise = historyRises.reduce(
  (largest, rise, index) =>
    Math.max(
      largest,
      historyRises[
        Math.min(historyRises.length - 1, index + timelineWindowSize - 1)
      ] - rise,
    ),
  1,
);

function overviewTargetYear(spot: HistoryPoint) {
  return spot.id === "80s"
    ? 1980
    : spot.id === "90s"
      ? 1990
      : spot.id === "20s"
        ? 2020
        : new Date().getFullYear();
}

function historyStartIndex(year: number) {
  return HISTORY_EVENTS.findIndex((event) => event.year >= year);
}

function timelineStops(total: number, first: number, windowSize: number) {
  const step = windowSize > 1 ? 2 : 1;
  const stops = [first];
  for (let index = first - step; index > 0; index -= step) stops.unshift(index);
  if (stops[0] !== 0) stops.unshift(0);
  // Keep the same two-card rhythm through the final pair or single card.
  for (let index = first + step; index < total; index += step)
    stops.push(index);
  return stops;
}

function HistoryAllMilestonesLink({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/history"
      className={`group relative inline-flex w-fit items-center gap-2.5 text-[#9eb7d0] transition-colors duration-300 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9eb7d0] ${compact ? "mt-5 text-xs md:text-sm" : "text-xs md:text-base lg:text-[clamp(18px,1.4vw,28px)]"}`}
      style={{
        fontFamily: "var(--font-sf-pro), sans-serif",
        fontWeight: 410,
        fontVariationSettings: '"wght" 410, "wdth" 125',
        letterSpacing: "-0.04em",
      }}
    >
      <FiArrowLeft
        aria-hidden="true"
        className="size-[1.05em] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1 motion-reduce:transition-none"
        strokeWidth={1.9}
      />
      <span className="relative inline-block pb-1">
        All Milestones
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 h-px w-0 bg-current transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

function HistoryTimeline({ targetYear }: { targetYear: number }) {
  if (historyStartIndex(targetYear) < 0) {
    return (
      <section
        className="relative z-30 mx-auto min-h-svh w-11/12 pt-[440px] pb-20 text-center text-white md:pt-[520px] lg:pt-[calc(var(--history-header-offset,97px)+300px)]"
        aria-label="Historical milestones timeline"
      >
        <p>No milestones are available from {targetYear} onward.</p>
        <HistoryAllMilestonesLink compact />
      </section>
    );
  }
  return <HistoryTimelineScene targetYear={targetYear} />;
}

function HistoryTimelineScene({ targetYear }: { targetYear: number }) {
  const targetIndex = historyStartIndex(targetYear);
  const [windowSize, setWindowSize] = useState(timelineWindowSize);
  const stops = useMemo(
    () => timelineStops(HISTORY_EVENTS.length, targetIndex, windowSize),
    [targetIndex, windowSize],
  );
  const maximumStart = stops[stops.length - 1];
  // The selected period starts at its first record, never at a preceding year.
  const [start, setStart] = useState(targetIndex);
  const [position, setPosition] = useState(targetIndex);
  const [riseScale, setRiseScale] = useState(0);
  const [mountedWindow, setMountedWindow] = useState(timelineWindowSize);
  const [requestedStart, setRequestedStart] = useState(targetIndex);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const currentStartRef = useRef(start);
  const requestedStartRef = useRef(targetIndex);
  const seekRef = useRef<((index: number) => void) | null>(null);
  const visible = HISTORY_EVENTS.slice(start, start + windowSize);
  const atEnd = start === maximumStart;
  // Keep every card mounted at a stable point on the same mountain route.
  // Each three-card climb is bounded, even when two dates are far apart.
  const rises = historyRises;
  const cameraIndex = Math.min(
    HISTORY_EVENTS.length - 1,
    Math.floor(position) + windowSize - 1,
  );
  const cameraRise =
    rises[cameraIndex] +
    ((rises[cameraIndex + 1] ?? rises[cameraIndex]) - rises[cameraIndex]) *
      (position - Math.floor(position));
  const firstMounted = Math.max(0, Math.floor(position) - 1);
  const mountedEvents = HISTORY_EVENTS.slice(
    firstMounted,
    Math.ceil(position) + Math.max(windowSize, mountedWindow) + 1,
  );
  const mountainProgress = maximumStart ? start / maximumStart : 0;
  const move = (direction: number) => {
    const current = stops.indexOf(requestedStartRef.current);
    const next =
      stops[Math.max(0, Math.min(stops.length - 1, current + direction))];
    if (next === requestedStartRef.current) return;
    if (seekRef.current) seekRef.current(next);
    else {
      requestedStartRef.current = next;
      currentStartRef.current = next;
      setPosition(next);
      setRequestedStart(next);
      setStart(next);
    }
  };

  // Query navigation can retain the overview scroll position. Reset only on entry,
  // so moving between pairs never moves the document.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [targetYear]);

  useLayoutEffect(() => {
    const resize = () => {
      const count =
        window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1;
      setWindowSize(count);
      const resizedStops = timelineStops(
        HISTORY_EVENTS.length,
        targetIndex,
        count,
      );
      setStart(
        (value) =>
          [...resizedStops].reverse().find((stop) => stop <= value) ?? 0,
      );
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [targetIndex]);

  // Keep the shared title size, then fit the taller card scene below the detail heading.
  useLayoutEffect(() => {
    const row = cardsRef.current;
    const section = row?.closest<HTMLElement>("[data-history-detail]");
    const page = row?.closest<HTMLElement>("#history-page");
    const heading = page?.querySelector<HTMLElement>("[data-history-heading]");
    if (!row || !section || !page || !heading) return;
    const fit = () => {
      if (window.innerWidth < 1024) {
        setRiseScale(0);
        setMountedWindow(window.innerWidth >= 768 ? 2 : 1);
        const top =
          heading.getBoundingClientRect().bottom -
          page.getBoundingClientRect().top +
          24;
        section.style.setProperty("padding-top", `${top}px`, "important");
        section.style.removeProperty("width");
        section.style.removeProperty("--history-unit");
        section.style.removeProperty("--history-stage-height");
        return;
      }
      const top =
        heading.getBoundingClientRect().bottom -
        page.getBoundingClientRect().top +
        24;
      const available = Math.max(240, window.innerHeight - top - 90);
      const unit = Math.min(
        window.innerWidth / 1440,
        available / (352 + 140 + 20),
      );
      section.style.setProperty("padding-top", `${top}px`, "important");
      const width = window.innerWidth * 0.86;
      setMountedWindow(Math.ceil(width / (354 * unit)));
      section.style.width = `${width}px`;
      section.style.setProperty("--history-unit", `${unit}px`);
      section.style.setProperty("--history-stage-height", `${available}px`);
      // Derive the camera scale from the fixed stage geometry, never from a
      // card whose size/composited bounds may change during an interrupted pan.
      const stageUnit = available / (largestWindowRise + 352 + 20);
      setRiseScale(
        Math.min(
          stageUnit,
          Math.max(0, available - 372 * unit) / largestWindowRise,
        ),
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    const header = document.querySelector(".site-header");
    if (header) observer.observe(header);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useLayoutEffect(() => {
    const page = cardsRef.current?.closest<HTMLElement>("#history-page");
    if (!page || page.dataset.historyScrollScene === "true") return;
    page.style.setProperty("--history-pan-x", `${mountainProgress * 4}%`);
    page.style.setProperty(
      "--history-pan-y",
      `calc(${mountainProgress * 32} * var(--history-unit, 1px))`,
    );
  }, [mountainProgress]);

  useLayoutEffect(() => {
    const page = cardsRef.current?.closest<HTMLElement>("#history-page");
    return () => {
      page?.style.removeProperty("--history-pan-x");
      page?.style.removeProperty("--history-pan-y");
    };
  }, []);

  useLayoutEffect(() => {
    const row = cardsRef.current;
    const page = row?.closest<HTMLElement>("#history-page");
    const track = row?.querySelector<HTMLElement>("[data-history-track]");
    if (!row || !page || !track) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 0px)", () => {
      const openingIndex =
        [...stops].reverse().find((stop) => stop <= currentStartRef.current) ??
        0;
      let origin = openingIndex;
      const model = { progress: 0 };
      let disposed = false;
      let requestedIndex = openingIndex;
      let navigating = false;
      let navigationTween: gsap.core.Tween | null = null;
      let wheelReadyAt = 0;
      page.dataset.historyScrollScene = "true";
      const paint = () => {
        const p = Math.max(0, Math.min(1, model.progress));
        const routeProgress = Math.min(1, p / 0.75);
        const index = Math.max(
          0,
          Math.min(
            maximumStart,
            origin + (maximumStart - origin) * routeProgress,
          ),
        );
        const unit =
          windowSize === 4
            ? row.getBoundingClientRect().height /
              (largestWindowRise + 352 + 20)
            : 1;
        // Horizontal travel and stair heights commit together from one position.
        setPosition(index);
        page.style.setProperty(
          "--history-pan-x",
          `${maximumStart ? (index / maximumStart) * 4 : 0}%`,
        );
        page.style.setProperty("--history-pan-y", `${p * 32 * unit}px`);
        page.dataset.historyScrollProgress = p.toFixed(3);
        // Browser scroll positions round to pixels; include the intended stop
        // when the interpolated card index lands just below its boundary.
        const selected =
          [...stops].reverse().find((stop) => stop <= index + 0.01) ?? origin;
        const next = routeProgress === 1 ? maximumStart : selected;
        if (currentStartRef.current !== next) {
          currentStartRef.current = next;
          setStart(next);
        }
        if (!navigating && requestedStartRef.current !== next) {
          requestedIndex = next;
          requestedStartRef.current = next;
          setRequestedStart(next);
        }
      };
      const tween = gsap.to(model, {
        progress: 1,
        duration: 1,
        ease: "none",
        paused: true,
        onUpdate: paint,
      });
      const trigger = ScrollTrigger.create({
        id: "history-detail-journey",
        trigger: page,
        pin: page,
        start: () =>
          Math.max(0, page.getBoundingClientRect().top + window.scrollY),
        end: () =>
          `+=${window.innerHeight * (1 + maximumStart / (windowSize > 1 ? 2 : 1))}`,
        animation: tween,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap:
          windowSize > 1
            ? undefined
            : {
                // Rest only at complete groups of two (one card on narrow phones).
                snapTo: (value, self) => {
                  if (navigating) return value;
                  if (maximumStart === origin) return 1;
                  const snapStops = stops
                    .filter((stop) => stop >= origin)
                    .map(
                      (stop) =>
                        ((stop - origin) / (maximumStart - origin)) * 0.75,
                    );
                  snapStops.push(1);
                  const exact = snapStops.find(
                    (stop) => Math.abs(stop - value) < 0.003,
                  );
                  if (exact !== undefined) return exact;
                  return (self?.direction ?? 1) > 0
                    ? (snapStops.find((stop) => stop > value) ?? 1)
                    : ([...snapStops].reverse().find((stop) => stop < value) ??
                        0);
                },
                duration: { min: 0.45, max: 0.9 },
                delay: 0.12,
                ease: "power2.inOut",
                inertia: false,
              },
      });
      seekRef.current = (index) => {
        const destination =
          [...stops]
            .reverse()
            .find(
              (stop) => stop <= Math.max(0, Math.min(maximumStart, index)),
            ) ?? 0;
        requestedIndex = destination;
        requestedStartRef.current = destination;
        setRequestedStart(destination);
        navigating = true;
        navigationTween?.kill();
        trigger.getTween(true)?.kill();
        wheelReadyAt = performance.now() + 1000;
        if (destination < origin) {
          // Expand the route backwards once without rebuilding the pin or
          // changing the camera position during an interrupted transition.
          const currentIndex =
            origin +
            (maximumStart - origin) *
              Math.min(1, Math.max(0, model.progress) / 0.75);
          origin = 0;
          const progress = maximumStart
            ? (currentIndex / maximumStart) * 0.75
            : 0;
          window.scrollTo({
            top: Math.max(
              0,
              trigger.start + progress * (trigger.end - trigger.start),
            ),
            behavior: "instant",
          });
          tween.progress(progress);
        }
        const p =
          maximumStart === origin
            ? 0
            : ((destination - origin) / (maximumStart - origin)) * 0.75;
        const scroll = { y: window.scrollY };
        navigationTween = gsap.to(scroll, {
          y: Math.max(0, trigger.start + p * (trigger.end - trigger.start)),
          duration: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? 0
            : 0.65,
          ease: "power2.out",
          onUpdate: () => {
            window.scrollTo({ top: scroll.y, behavior: "instant" });
            trigger.update();
          },
          onComplete: () => {
            tween.progress(p);
            navigating = false;
            paint();
          },
        });
      };
      const onPairWheel = (event: WheelEvent) => {
        if (
          windowSize < 2 ||
          event.defaultPrevented ||
          event.ctrlKey ||
          !event.deltaY ||
          Math.abs(event.deltaX) > Math.abs(event.deltaY)
        )
          return;
        if (
          (event.target as HTMLElement).closest(
            "input,textarea,select,[contenteditable='true']",
          )
        )
          return;
        const y = window.scrollY;
        if (y < trigger.start - 2 || y > trigger.end + 2) return;
        if (performance.now() < wheelReadyAt) {
          event.preventDefault();
          return;
        }
        const direction = Math.sign(event.deltaY);
        if (direction < 0 && requestedIndex <= origin && origin === 0) return;
        event.preventDefault();
        if (direction > 0 && requestedIndex >= maximumStart) {
          window.scrollTo({
            top: trigger.end + Math.max(80, Math.abs(event.deltaY)),
            behavior: "smooth",
          });
          return;
        }
        const current = stops.indexOf(requestedIndex);
        seekRef.current?.(
          stops[Math.max(0, Math.min(stops.length - 1, current + direction))],
        );
      };
      window.addEventListener("wheel", onPairWheel, {
        passive: false,
        capture: true,
      });
      const openingProgress = 0;
      window.scrollTo({
        top: Math.max(
          0,
          trigger.start + openingProgress * (trigger.end - trigger.start),
        ),
        behavior: "instant",
      });
      tween.progress(openingProgress);
      paint();
      document.fonts.ready.then(() => {
        if (disposed) return;
        const opening =
          Math.abs(model.progress - openingProgress) < 0.001 &&
          requestedIndex === openingIndex &&
          !navigating;
        trigger.refresh();
        if (opening) {
          window.scrollTo({
            top: Math.max(
              0,
              trigger.start + openingProgress * (trigger.end - trigger.start),
            ),
            behavior: "instant",
          });
          tween.progress(openingProgress);
          paint();
        }
      });
      return () => {
        disposed = true;
        navigationTween?.kill();
        window.removeEventListener("wheel", onPairWheel, true);
        seekRef.current = null;
        trigger.kill(true);
        tween.kill();
        delete page.dataset.historyScrollScene;
        delete page.dataset.historyScrollProgress;
        page.style.removeProperty("--history-heading-rise");
        page.style.removeProperty("--history-heading-opacity");
      };
    });
    return () => media.revert();
  }, [maximumStart, stops, windowSize]);

  return (
    <section
      aria-label="Historical milestones timeline"
      data-history-detail
      data-target-year={targetYear}
      data-nearest-year={HISTORY_EVENTS[targetIndex].year}
      data-timeline-start={start}
      data-timeline-target={requestedStart}
      data-timeline-position={position}
      data-timeline-end={atEnd}
      data-mountain-progress={mountainProgress}
      tabIndex={0}
      className="relative z-30 mx-auto w-11/12 pt-[320px] pb-16 outline-none focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-[#9EB7D0] lg:ml-[14%] lg:mr-0 lg:w-[86%] lg:max-w-none lg:pt-[calc(var(--history-header-offset,97px)+200*var(--history-unit))] lg:pb-[calc(20*var(--history-unit))]"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      <div className="relative flex min-h-10 items-center justify-between gap-4 text-[#9EB7D0] lg:min-h-12 lg:pr-[8vw]">
        <HistoryAllMilestonesLink />
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-4 lg:left-[42%] lg:gap-4">
          {[-1, 1].map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={
                direction < 0 ? "Previous milestones" : "Next milestones"
              }
              disabled={
                direction < 0
                  ? requestedStart === 0
                  : requestedStart === maximumStart
              }
              onClick={() => move(direction)}
              className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-30 lg:size-[clamp(44px,3.3vw,64px)] motion-reduce:transition-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-7 lg:size-[clamp(32px,2.6vw,50px)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                style={{
                  transform: direction > 0 ? "rotate(180deg)" : undefined,
                }}
              >
                <path d="M20 12H4m7-7-7 7 7 7" />
              </svg>
            </button>
          ))}
        </div>
        <span
          aria-live="polite"
          aria-atomic="true"
          className="text-xs md:text-base lg:text-[clamp(18px,1.4vw,28px)]"
        >
          {visible[0].year === visible[visible.length - 1].year
            ? visible[0].year
            : `${visible[0].year}–${visible[visible.length - 1].year}`}
        </span>
      </div>

      <div
        ref={cardsRef}
        className="mt-8 h-[740px] touch-pan-y overflow-clip px-3 pb-5 [scroll-snap-type:none] lg:mt-[calc(20*var(--history-unit))] lg:p-0 lg:h-[var(--history-stage-height)] lg:[mask-image:linear-gradient(90deg,#000_0%,#000_88%,transparent_100%)]"
        style={
          {
            "--history-card-gap": "calc(36 * var(--history-unit, 1px))",
            minHeight: "var(--history-stage-height)",
          } as CSSProperties
        }
        onTouchStart={(event) => {
          if (event.touches.length === 1)
            swipeRef.current = {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
            };
        }}
        onTouchEnd={(event) => {
          const initial = swipeRef.current;
          swipeRef.current = null;
          if (!initial || !event.changedTouches[0]) return;
          const x = event.changedTouches[0].clientX - initial.x;
          const y = event.changedTouches[0].clientY - initial.y;
          if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y))
            move(x < 0 ? 1 : -1);
        }}
        onTouchCancel={() => {
          swipeRef.current = null;
        }}
      >
        <div
          data-history-track
          className="grid grid-flow-col auto-cols-[min(290px,78vw)] gap-5 lg:auto-cols-[calc(318*var(--history-unit))] lg:gap-[var(--history-card-gap)] [transform:var(--history-track-transform)] transition-none will-change-transform"
          style={
            {
              "--history-track-transform":
                windowSize === 4
                  ? `translate3d(calc(${firstMounted - position} * (318 * var(--history-unit) + var(--history-card-gap))),0,0)`
                  : `translate3d(calc(${((firstMounted - position) * 100) / windowSize}% + ${(firstMounted - position) / windowSize} * var(--history-card-gap)),0,0)`,
            } as CSSProperties
          }
        >
          {mountedEvents.map((event, mountedIndex) => {
            const index = firstMounted + mountedIndex;
            const inView = index >= start && index < start + windowSize;
            const blurred = windowSize === 4 && index >= start + 2 && !atEnd;
            const offset = cameraRise - rises[index];
            return (
              <article
                key={event.id}
                data-history-card={event.id}
                data-history-card-index={index}
                data-history-pair={Math.floor(index / 2)}
                data-in-view={inView}
                aria-hidden={!inView}
                inert={!inView}
                data-year={event.year}
                data-blurred={blurred}
                data-rise={offset}
                aria-current={
                  event.id === HISTORY_EVENTS[targetIndex].id
                    ? "date"
                    : undefined
                }
                className="relative h-[390px] w-[min(290px,78vw)] shrink-0 rounded-[30px] border border-white/40 bg-white/15 text-[#F7F7F7] shadow-[0_12px_35px_#082f4c10] backdrop-blur-[10px] transition-[filter,opacity] duration-[1250ms] ease-[cubic-bezier(.25,.8,.25,1)] [font-variation-settings:'wdth'_125,'wght'_410,'opsz'_20] lg:h-auto lg:aspect-[318/352] lg:w-auto lg:[container-type:inline-size] lg:[--history-card-unit:calc((100cqw_+_2px)/318)] lg:[border-radius:9.433962%/8.522727%] motion-reduce:transition-none"
                style={
                  {
                    transform: `translate3d(0,${Math.max(0, Math.min(largestWindowRise, offset)) * riseScale}px,0)`,
                    filter: blurred
                      ? "blur(calc(8 * var(--history-unit, 1px)))"
                      : "none",
                    opacity: blurred ? 0.85 : 1,
                  } as CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-[30px] bottom-[30px] w-px bg-white/90 lg:left-[calc(50*var(--history-card-unit))] lg:top-[calc(45*var(--history-card-unit))] lg:bottom-[calc(59*var(--history-card-unit))]"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-[30px] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white lg:left-[calc(50*var(--history-card-unit))] lg:top-[calc(45*var(--history-card-unit))] lg:size-[calc(7*var(--history-card-unit))]"
                />
                <div className="pl-11 pr-5 pt-5 lg:pl-[calc(75*var(--history-card-unit))] lg:pr-[calc(25*var(--history-card-unit))] lg:pt-[calc(29*var(--history-card-unit))]">
                  <div className="flex flex-wrap items-center gap-2 lg:gap-[calc(7*var(--history-card-unit))]">
                    <p className="m-0 text-[15px] leading-none tracking-[-.04em] lg:text-[calc(21*var(--history-card-unit))]">
                      {event.year}
                    </p>
                    <span className="rounded-full border border-white/55 bg-white/15 px-2 py-1 text-[11px] leading-none lg:px-[calc(8*var(--history-card-unit))] lg:py-[calc(5*var(--history-card-unit))] lg:text-[calc(15*var(--history-card-unit))]">
                      {event.category}
                    </span>
                  </div>
                  <h2 className="mt-6 mb-0 text-[20px] leading-[1.07] tracking-[-.04em] lg:mt-[calc(22*var(--history-card-unit))] lg:max-w-[calc(198*var(--history-card-unit))] lg:text-[calc(20*var(--history-card-unit))]">
                    {event.title}
                  </h2>
                  <p className="mt-5 mb-0 text-[12px] leading-[1.12] tracking-[-.04em] lg:mt-[calc(10*var(--history-card-unit))] lg:max-w-[calc(185*var(--history-card-unit))] lg:text-[calc(12*var(--history-card-unit))]">
                    {event.description}
                  </p>
                </div>
                <div className="pointer-events-none absolute left-6 bottom-[30px] lg:left-[calc(50*var(--history-card-unit))] lg:bottom-[calc(59*var(--history-card-unit))]">
                  <HistoryHotspot
                    spot={HISTORY_POINTS[index % HISTORY_POINTS.length]}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOTSPOT ANIMATION SETTINGS
// ============================================================

// ============================================================
// TIMELINE SETTINGS
// ============================================================

const timelineLineHeight =
  "var(--history-line-height,clamp(180px,17.3vw,290px))";
const timelineLineWidth = 1.5;

const timelineTextOffsetX = "calc(15 * var(--history-unit, 1px))";
const timelineTextOffsetY = "calc(12 * var(--history-unit, 1px))";

// ============================================================
// TIMELINE TYPOGRAPHY
// ============================================================

const timelineYearFontSize =
  "var(--history-year-size,clamp(17px, 1.375vw, 26.4px))";
const timelineYearFontWeight = 350;

const timelineBadgeFontSize =
  "var(--history-badge-size,clamp(12px, 1vw, 19.2px))";
const timelineBadgeFontWeight = 350;

const timelineDescriptionFontSize =
  "var(--history-body-size,clamp(10px, 0.75vw, 14.4px))";
const timelineDescriptionFontWeight = 300;

const timelineDescriptionGap =
  "var(--history-description-gap,clamp(18px, 1.52778vw, 29px))";

// ============================================================
// HISTORY HOTSPOT
// ============================================================

function HistoryHotspot({ spot }: { spot: HistoryPoint }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 block size-[clamp(56px,4.7vw,76px)] -translate-x-1/2 -translate-y-1/2 select-none lg:size-[calc(60*var(--history-unit))]"
    >
      <WaveButton decorative size="100%" delay={parseFloat(spot.phase)} />
    </span>
  );
}

// ============================================================
// TIMELINE CONTENT
// ============================================================

function MilestoneContent({ spot }: { spot: HistoryPoint }) {
  return (
    <div className="min-w-0 text-left">
      {/* YEAR + EXPANSION BADGE */}
      <div className="flex flex-nowrap items-center gap-[clamp(10px,0.83vw,16px)] lg:gap-[calc(12*var(--history-unit))]">
        <h2
          className="m-0 shrink-0 whitespace-nowrap font-sans"
          style={{
            fontSize: timelineYearFontSize,
            fontWeight: timelineYearFontWeight,
            fontVariationSettings: `"wdth" 132, "wght" ${timelineYearFontWeight}, "opsz" 28`,
            fontSynthesis: "none",
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            color: "#F7F7F7",
          }}
        >
          {spot.year}
        </h2>

        {/* EXPANSION GLASS BADGE */}
        <span
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            whitespace-nowrap
            rounded-full
            border
            border-[#F7F7F7]/60
            bg-white/15
            px-[clamp(10px,0.8333vw,16px)] lg:px-[calc(12*var(--history-unit))]
            py-[clamp(5px,0.41667vw,8px)] lg:py-[calc(6*var(--history-unit))]
            font-sans
            backdrop-blur-[4.9px]
          "
          style={{
            fontSize: timelineBadgeFontSize,
            fontWeight: timelineBadgeFontWeight,
            fontVariationSettings: `"wdth" 132, "wght" ${timelineBadgeFontWeight}, "opsz" 28`,
            fontSynthesis: "none",
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            color: "#F7F7F7",
            borderWidth: "0.65px",
          }}
        >
          {spot.label}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p
        className="mb-0 max-w-[clamp(190px,16.5vw,315px)] font-sans lg:ml-[calc(7*var(--history-unit))] lg:max-w-[calc(215*var(--history-unit))]"
        style={{
          marginTop: timelineDescriptionGap,
          fontSize: timelineDescriptionFontSize,
          fontWeight: timelineDescriptionFontWeight,
          fontVariationSettings: `"wdth" 132, "wght" ${timelineDescriptionFontWeight}, "opsz" 20`,
          fontSynthesis: "none",
          lineHeight: "112%",
          letterSpacing: "-0.04em",
          color: "#F7F7F7",
        }}
      >
        {spot.description}
      </p>
    </div>
  );
}

// ============================================================
// DESKTOP TIMELINE MILESTONE
// ============================================================

function DesktopMilestone({ spot }: { spot: HistoryPoint }) {
  return (
    <div
      data-history-milestone={spot.id}
      className="pointer-events-none absolute z-20"
      style={
        {
          left: spot.x,
          top: spot.y,
        } as CSSProperties
      }
    >
      {/* VERTICAL WHITE LINE */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 bg-[#F7F7F7]/90"
        style={{
          width: `calc(${timelineLineWidth} * var(--history-unit, 1px))`,
          height: timelineLineHeight,
          transform: "translateX(-50%)",
        }}
      />

      {/* SMALL WHITE POINT */}
      <span
        aria-hidden="true"
        className="
          absolute
          left-0
          h-[clamp(10px,0.76389vw,14.67px)] lg:h-[calc(10*var(--history-unit))]
          w-[clamp(10px,0.76389vw,14.67px)] lg:w-[calc(10*var(--history-unit))]
          -translate-x-1/2
          translate-y-1/2
          rounded-full
          bg-[#F7F7F7]
        "
        style={{
          bottom: "var(--history-line-height)",
        }}
      />

      {/* MILESTONE TEXT */}
      <div
        className="pointer-events-none absolute w-max"
        style={{
          left: timelineTextOffsetX,
          top: `calc(0px - var(--history-line-height) - ${timelineTextOffsetY})`,
        }}
      >
        <Link
          href={`/history?year=${overviewTargetYear(spot)}`}
          className="pointer-events-auto block rounded-lg focus-visible:outline-2 focus-visible:outline-white"
          aria-label={`Explore ${spot.year} milestones`}
        >
          <MilestoneContent spot={spot} />
        </Link>
      </div>

      {/* ANIMATED BLUE POINT */}
      <Link
        href={`/history?year=${overviewTargetYear(spot)}`}
        aria-label={`Open ${spot.year} timeline`}
        className="pointer-events-auto absolute left-0 top-0 size-[calc(60*var(--history-unit))] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="absolute left-1/2 top-1/2">
          <HistoryHotspot spot={spot} />
        </span>
      </Link>
    </div>
  );
}

// ============================================================
// MOBILE TIMELINE
// ============================================================

function MobileTimeline() {
  const overviewRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overview = overviewRef.current;
    const viewport = overview?.firstElementChild as HTMLElement | null;
    const page = overview?.closest<HTMLElement>("#history-page");
    if (!overview || !viewport || !page) return;
    const media = gsap.matchMedia();
    media.add(
      {
        responsive: "(width < 80rem)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (!context.conditions?.responsive) return;
        const reduced = context.conditions.reduced;
        const model = { progress: 0 };
        const originalSnap = viewport.style.scrollSnapType;
        let expectedLeft = 0;
        let disposed = false;
        const steps = () =>
          HISTORY_POINTS.length - (window.innerWidth >= 768 ? 2 : 1);
        const distance = () =>
          Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        // Native vertical scroll drives the existing horizontal strip. No wheel
        // or touch input is blocked, and normal page travel resumes after NOW.
        viewport.style.scrollSnapType = "none";
        const paint = () => {
          expectedLeft = model.progress * distance();
          viewport.scrollLeft = expectedLeft;
          overview.dataset.overviewProgress = model.progress.toFixed(3);
        };
        const tween = gsap.to(model, {
          progress: 1,
          duration: 1,
          paused: true,
          ease: "none",
          onUpdate: paint,
        });
        const trigger = ScrollTrigger.create({
          id: "history-overview-journey",
          trigger: page,
          pin: page,
          start: () =>
            Math.max(
              0,
              page.getBoundingClientRect().top +
                window.scrollY +
                page.offsetHeight -
                window.innerHeight,
            ),
          end: () => `+=${window.innerHeight * (steps() * 0.65 + 0.25)}`,
          animation: tween,
          scrub: reduced ? true : 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: reduced
            ? undefined
            : {
                snapTo: (value) => Math.round(value * steps()) / steps(),
                duration: { min: 0.2, max: 0.45 },
                delay: 0.15,
                ease: "power2.inOut",
                inertia: false,
              },
          onRefresh: paint,
        });
        // Keep horizontal swipes in sync with the vertical route as well.
        const onHorizontalScroll = () => {
          if (Math.abs(viewport.scrollLeft - expectedLeft) < 1 || !distance())
            return;
          const progress = viewport.scrollLeft / distance();
          window.scrollTo({
            top: trigger.start + progress * (trigger.end - trigger.start),
            behavior: "instant",
          });
        };
        viewport.addEventListener("scroll", onHorizontalScroll, {
          passive: true,
        });
        paint();
        document.fonts.ready.then(() => {
          if (!disposed) trigger.refresh();
        });
        return () => {
          disposed = true;
          viewport.removeEventListener("scroll", onHorizontalScroll);
          trigger.kill(true);
          tween.kill();
          viewport.style.scrollSnapType = originalSnap;
          viewport.scrollLeft = 0;
          delete overview.dataset.overviewProgress;
        };
      },
    );
    return () => media.revert();
  }, []);

  return (
    <div
      ref={overviewRef}
      data-history-overview-mobile
      className="relative z-20 xl:hidden"
    >
      <div className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]">
        {HISTORY_POINTS.map((spot) => (
          <div
            key={spot.id}
            className="relative w-full shrink-0 snap-center"
            data-history-overview-slide
          >
            <Link
              href={`/history?year=${overviewTargetYear(spot)}`}
              aria-label={`Explore ${spot.year} milestones`}
              className="relative block text-[#F7F7F7]"
            >
              <span className="absolute left-0 top-3 size-3 -translate-x-1/2 rounded-full bg-white" />
              <div className="flex items-center gap-4">
                <h2 className="m-0 text-[24px] leading-none tracking-[-.04em]">
                  {spot.year}
                </h2>
                <span className="rounded-full border border-white/50 bg-white/15 px-3 py-2 text-[14px] leading-none">
                  {spot.label}
                </span>
              </div>
              <p className="mt-6 max-w-[250px] text-[14px] leading-[1.12] tracking-[-.03em]">
                {spot.description}
              </p>
              <span
                data-history-overview-stem
                className="absolute left-0 top-3 w-px bg-white/90"
              />
              <span data-history-overview-hotspot className="absolute left-0">
                <HistoryHotspot spot={spot} />
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HISTORY PAGE
// ============================================================

export default function HistoryPage({
  initialYear = null,
}: {
  initialYear?: number | null;
}) {
  const snowTitle = useRepeatingTitle(3100, 4000);
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const page = pageRef.current;
    if (!header || !page) return;
    const measureHeader = () => {
      const inFlow = !["absolute", "fixed"].includes(
        getComputedStyle(header).position,
      );
      page.style.setProperty(
        "--history-header-offset",
        `${inFlow ? header.getBoundingClientRect().height : 0}px`,
      );
    };
    measureHeader();
    const observer = new ResizeObserver(measureHeader);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  // ==========================================
  // BACKGROUND SETTINGS
  // ==========================================

  const imageOffsetY = -290;

  // ==========================================
  // TITLE SETTINGS
  // ==========================================

  // Önceki: 27.5svh
  // Yeni: Tüm içerik grubu biraz daha yukarıda
  const titleTop = "var(--history-title-top,25.5svh)";

  // Önceki: clamp(30px, 3.4722vw, 72px)
  const titleFontSize = "var(--history-title-size,clamp(28px,3.2vw,66px))";

  const titleFontWeight = 330;

  // ==========================================
  // DESCRIPTION SETTINGS
  // ==========================================

  // Önceki: clamp(11px, 0.83333vw, 17px)
  const descriptionFontSize =
    "var(--history-body-size,clamp(10px,0.77vw,15.5px))";

  const descriptionFontWeight = 250;
  const descriptionLetterSpacing = "-0.01em";
  const descriptionGap = "clamp(5px, 0.41667vw, 9px)";

  // ==========================================
  // HERITAGE BADGE SETTINGS
  // ==========================================

  const badgeMarginTop =
    "var(--history-heritage-gap,clamp(20px,2.08333vw,40px))";

  // Önceki: 0.9
  // Yeni: Kutucuk biraz küçüldü
  const badgeScale = 0.86;

  // İkonun önceki görünen boyutunu koruyoruz
  const badgeIconScale = 1.8 / badgeScale;

  const badgeWidth =
    "var(--history-heritage-width,clamp(250px,18.95833vw,364px))";

  const badgeMinHeight =
    "var(--history-heritage-height,clamp(40.5px,2.8125vw,54px))";

  const badgeRadius =
    "var(--history-heritage-radius,clamp(8px, 0.55556vw, 10.67px))";

  const badgePaddingX =
    "var(--history-heritage-padding-x,clamp(12px, 1.11111vw, 21.33px))";

  const badgePaddingY =
    "var(--history-heritage-padding-y,clamp(7px, 0.48611vw, 9.33px))";

  const badgeGap =
    "var(--history-heritage-gap-x,clamp(8px, 0.69444vw, 13.33px))";

  // ==========================================
  // BADGE ICON SETTINGS
  // ==========================================

  const badgeIconWidth =
    "var(--history-heritage-icon-width,clamp(36px, 2.91667vw, 56px))";

  const badgeIconHeight =
    "var(--history-heritage-icon-height,clamp(23px, 1.875vw, 36px))";

  const badgeIconOffsetX = 25;
  const badgeIconOffsetY = 2.5;

  // ==========================================
  // BADGE TEXT SETTINGS
  // ==========================================

  // Önceki: clamp(11px, 0.83333vw, 16px)
  const badgeFontSize =
    "var(--history-heritage-font-size,clamp(10px, 0.79vw, 15px))";

  const badgeFontWeight = 330;
  const badgeBoldFontWeight = 520;

  return (
    <>
      <main
        ref={pageRef}
        id="history-page"
        data-history-view={initialYear === null ? "overview" : "detail"}
        style={
          initialYear === null
            ? undefined
            : ({ minHeight: "100svh" } as CSSProperties)
        }
        className="max-lg:[&[data-history-view='detail']_[data-history-heading]]:[top:calc(2*var(--history-header-offset,80px)+16px)]! md:max-lg:[&[data-history-view='detail']_[data-history-detail]_>_div:first-child_>_a]:block! md:max-lg:[&[data-history-view='detail']_[data-history-detail]_>_div:first-child_>_span]:block! lg:[&[data-history-view='detail']]:[--history-title-top:calc(var(--history-header-offset,97px)+20px)] md:max-xl:[&[data-history-view='detail']_[data-history-heading]]:translate-y-0! max-md:[.pin-spacer:has(>_&)]:[background-color:#24547a]! max-lg:[body:has(&)_.site-header__inner]:[padding:24px_12px_0]! max-lg:[body:has(&)_.site-header__inner]:[max-width:none]! max-lg:[body:has(&)_.site-header__logos_img]:[width:94px]! max-lg:[body:has(&)_.site-header__logos_>_a:nth-child(2)]:[display:none]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)]:[display:flex]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)]:[gap:10px]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_a]:[display:none]! max-lg:[body:has(&)_.site-header__inner_>_button:last-child]:[display:none]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_button]:[width:44px]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_button]:[height:44px]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_button]:[border-radius:15px]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_button_>_span:first-child]:[display:none]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_button_>_span:last-child_>_span]:[background:#9eb7d0]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_div]:[width:44px]! max-lg:[body:has(&)_.site-header__inner_>_div:nth-child(2)_>_div]:[height:44px]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[width:44px]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[height:44px]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[padding:0]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[justify-content:center]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[background:#ffffff15]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[border-color:#ffffff60]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']]:[border-radius:15px]! max-lg:[body:has(&)_.site-header__inner_button[aria-label='Change_language']_>_span:first-child]:[display:none]! max-lg:[&]:[margin-top:calc(-1_*_var(--history-header-offset,_80px))]! max-lg:[&]:[--history-unit:1px]! max-lg:[&]:[--history-mobile-unit:min(1px,_calc(100vw_/_428))]! max-lg:[&]:[--history-card-gap:20px]! max-lg:[&_[data-history-art]_>_img]:[position:absolute]! max-lg:[&_[data-history-art]_>_img]:[inset:0]! max-lg:[&_[data-history-art]_>_img]:[width:100%]! max-lg:[&_[data-history-art]_>_img]:[height:100%]! max-lg:[&_[data-history-art]_>_img]:[object-fit:cover]! max-lg:[&_[data-history-art]_>_img]:[object-position:50%_bottom]! max-lg:[&_[data-history-art]_>_img]:[transform:none]! max-lg:[&[data-history-view='overview']]:[min-height:max(100svh,_calc(960_*_var(--history-mobile-unit)))]! max-lg:[&[data-history-view='detail']]:[min-height:max(100svh,_calc(1040_*_var(--history-mobile-unit)))]! max-lg:[&[data-history-view='overview']_[data-history-art]_>_img]:[top:-35%]! max-lg:[&[data-history-view='overview']_[data-history-art]_>_img]:[height:135%]! max-lg:[&[data-history-view='detail']_[data-history-art]_>_img]:[top:-100%]! max-lg:[&[data-history-view='detail']_[data-history-art]_>_img]:[height:200%]! max-lg:[&[data-history-view='detail']_[data-history-art]_>_img]:[object-position:45%_bottom]! max-lg:[&[data-history-view='detail']_[data-history-art]_>_img]:[transform:translateX(var(--history-pan-x,_0%))_scale(1.12)]! max-lg:[&[data-history-view='detail']_[data-history-art]_>_img]:[transform-origin:center_bottom]! max-lg:[&_[data-history-heading]]:[top:calc(114_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heading]]:[align-items:flex-start]! max-lg:[&_[data-history-heading]]:[padding:0_calc(36_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heading]]:[text-align:left]! max-lg:[&_[data-history-heading]_h1]:[font-size:calc(52_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heading]_h1]:[width:100%]! max-lg:[&_[data-history-heading]_h1]:[max-width:520px]! max-lg:[&_[data-history-heading]_h1]:[text-align:left]! max-lg:[&_[data-history-heading]_h1]:[line-height:1.04]! max-lg:[&_[data-history-heading]_h1]:[text-wrap:initial]! max-lg:[&_[data-history-heading]_h1]:[max-width:calc(360_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heading]_>_p]:[display:none]! max-lg:[&_[data-history-heritage]]:[margin-top:calc(36_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heritage]]:[width:calc(298_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heritage]]:[min-height:calc(45_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-heritage]]:[transform:none]! max-lg:[&_[data-history-heritage]]:[padding:6px_12px]! max-lg:[&_[data-history-heritage]]:[gap:12px]! max-lg:[&_[data-history-heritage]_>_img]:[width:38px]! max-lg:[&_[data-history-heritage]_>_img]:[height:26px]! max-lg:[&_[data-history-heritage]_>_img]:[transform:scale(1.5)]! max-lg:[&_[data-history-heritage]_>_p]:[font-size:calc(13_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-overview-mobile]]:[padding-top:calc(440_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-overview-slide]_a]:[color:#f7f7f7]! max-lg:[&_[data-history-overview-slide]]:[height:calc(500_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-overview-slide]]:[padding-left:calc(104_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-overview-slide]]:[padding-right:24px]! max-lg:[&_[data-history-overview-slide]_a_>_div]:[margin-left:24px]! max-lg:[&_[data-history-overview-slide]_a_>_p]:[margin-left:24px]! max-lg:[&_[data-history-overview-stem]]:[height:calc(270_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-overview-hotspot]]:[top:calc(285_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-detail]]:[width:81%]! max-lg:[&_[data-history-detail]]:[padding-top:calc(380_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-detail]]:[padding-bottom:100px]! max-lg:[&_[data-history-detail]_>_div:first-child]:[justify-content:center]! max-lg:[&_[data-history-detail]_>_div:first-child]:[height:48px]! max-lg:[&_[data-history-detail]_>_div:first-child_>_a]:[display:none]! max-lg:[&_[data-history-detail]_>_div:first-child_>_span]:[display:none]! max-lg:[&_[data-history-detail]_button]:[width:48px]! max-lg:[&_[data-history-detail]_button]:[height:48px]! max-lg:[&_[data-history-detail]_button_svg]:[width:44px]! max-lg:[&_[data-history-detail]_button_svg]:[height:44px]! max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[margin-top:calc(28_*_var(--history-mobile-unit))]! max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[padding:0]! max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[height:420px]! max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[min-height:0]! max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[overflow:clip]! max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[--history-card-gap:20px]! max-lg:[&_[data-history-track]]:[grid-auto-columns:100%]! max-lg:[&_[data-history-track]]:[gap:20px]! max-lg:[&_[data-history-card]]:[width:auto]! max-lg:[&_[data-history-card]]:[height:clamp(320px,_46svh,_390px)]! max-lg:[&_[data-history-card]]:[transform:none]! max-lg:[&_[data-history-card]]:[filter:none]! max-lg:[&_[data-history-card]]:[opacity:1]! max-lg:[&_[data-history-card]_>_div:last-child]:[left:32px]! max-lg:[&_[data-history-card]_>_div:last-child]:[bottom:55px]! max-lg:[&_[data-history-card]_>_span:nth-child(1)]:[left:32px]! max-lg:[&_[data-history-card]_>_span:nth-child(1)]:[bottom:55px]! max-lg:[&_[data-history-card]_>_span:nth-child(2)]:[left:32px]! max-lg:[&_[data-history-card]_>_div:nth-child(3)]:[padding-left:56px]! max-lg:[&_[data-history-card]_>_div:nth-child(3)]:[padding-right:24px]! max-lg:[&_[data-history-card]_h2]:[font-weight:410]! max-md:[@media(max-height:740px)]:[&_[data-history-heading]]:[top:90px]! max-md:[@media(max-height:740px)]:[&_[data-history-heading]_h1]:[font-size:calc(46_*_var(--history-mobile-unit))]! max-md:[@media(max-height:740px)]:[&_[data-history-heritage]]:[margin-top:22px]! max-md:[@media(max-height:740px)]:[&_[data-history-detail]]:[padding-top:calc(320_*_var(--history-mobile-unit))]! max-md:[@media(max-height:740px)]:[&_[data-history-card]]:[height:310px]! max-md:[@media(max-height:740px)]:[&_[data-history-card]_h2]:[margin-top:18px]! max-md:[@media(max-height:740px)]:[&_[data-history-card]_h2]:[font-size:18px]! max-md:[@media(max-height:740px)]:[&_[data-history-card]_h2_+_p]:[margin-top:14px]! max-md:[@media(max-height:740px)]:[&_[data-history-card]_h2_+_p]:[font-size:11px]! max-md:[@media(max-height:740px)]:[&_[data-history-card]_>_div:last-child]:[bottom:38px]! max-md:[@media(max-height:740px)]:[&_[data-history-card]_>_span:first-child]:[bottom:38px]! md:max-lg:[&]:[--history-mobile-unit:1px]! md:max-lg:[&_[data-history-heading]]:[left:5%]! md:max-lg:[&_[data-history-heading]]:[padding-left:0]! md:max-lg:[&_[data-history-heading]_h1]:[max-width:600px]! md:max-lg:[&_[data-history-heading]_h1]:[font-size:64px]! md:max-lg:[&[data-history-view='overview']]:[min-height:1180px]! md:max-lg:[&_[data-history-overview-mobile]]:[padding-top:520px]! md:max-lg:[&_[data-history-overview-slide]]:[width:50%]! md:max-lg:[&_[data-history-overview-slide]]:[padding-left:70px]! md:max-lg:[&_[data-history-detail]]:[width:88%]! md:max-lg:[&_[data-history-detail]]:[padding-top:480px]! md:max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[height:490px]! md:max-lg:[&_[data-history-detail]_>_div:nth-child(2)]:[margin-top:70px]! md:max-lg:[&_[data-history-track]]:[grid-auto-columns:calc((100%_-_20px)_/_2)]! md:max-lg:[&_[data-history-card]]:[height:430px]! md:max-lg:[&[data-history-view='detail']]:[min-height:1250px]! lg:max-xl:[&[data-history-view='overview']]:[min-height:1180px]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[position:absolute]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[inset:auto_0_0]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[top:-35%]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[height:135%]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[width:100%]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[object-fit:cover]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[object-position:center_bottom]! lg:max-xl:[&[data-history-view='overview']_[data-history-art]_>_img]:[transform:none]! lg:max-xl:[&_[data-history-overview-mobile]]:[padding-top:520px]! lg:max-xl:[&_[data-history-overview-slide]]:[width:50%]! lg:max-xl:[&_[data-history-overview-slide]]:[height:500px]! lg:max-xl:[&_[data-history-overview-slide]]:[padding-left:70px]! lg:max-xl:[&_[data-history-overview-slide]]:[padding-right:24px]! lg:max-xl:[&_[data-history-overview-slide]_a]:[color:#f7f7f7]! lg:max-xl:[&_[data-history-overview-slide]_a_>_div]:[margin-left:24px]! lg:max-xl:[&_[data-history-overview-slide]_a_>_p]:[margin-left:24px]! lg:max-xl:[&_[data-history-overview-stem]]:[height:270px]! lg:max-xl:[&_[data-history-overview-hotspot]]:[top:285px]! relative min-h-[100svh] w-full overflow-hidden bg-[#24547A] lg:min-h-0 lg:mt-[calc(-1*var(--history-header-offset,97px))] lg:[--history-unit:var(--history-detail-unit,calc(100vw/1440))] lg:[--history-line-height:calc(250*var(--history-unit))] lg:[--history-year-size:calc(21*var(--history-unit))] lg:[--history-badge-size:calc(15*var(--history-unit))] lg:[--history-body-size:calc(13*var(--history-unit))] lg:[--history-description-gap:calc(28*var(--history-unit))] lg:[--history-title-top:calc(280*var(--history-unit))] lg:[--history-title-size:calc(50*var(--history-unit))] lg:[--history-image-offset:0px] lg:[--history-heritage-scale:1] lg:[--history-heritage-gap:calc(22*var(--history-unit))] lg:[--history-heritage-width:calc(273*var(--history-unit))] lg:[--history-heritage-height:calc(40*var(--history-unit))] lg:[--history-heritage-radius:calc(8*var(--history-unit))] lg:[--history-heritage-padding-x:calc(12*var(--history-unit))] lg:[--history-heritage-padding-y:calc(6*var(--history-unit))] lg:[--history-heritage-gap-x:calc(10*var(--history-unit))] lg:[--history-heritage-icon-width:calc(42*var(--history-unit))] lg:[--history-heritage-icon-height:calc(27*var(--history-unit))] lg:[--history-heritage-font-size:calc(11.5*var(--history-unit))] lg:[--history-heritage-icon-x:calc(25*var(--history-unit))] lg:[--history-heritage-icon-y:calc(2.5*var(--history-unit))]"
      >
        {/* ======================================
          HISTORY BACKGROUND
      ====================================== */}

        <div
          data-history-art
          className={
            initialYear === null
              ? "absolute inset-0 xl:relative xl:-translate-y-8 xl:-mb-8"
              : "contents"
          }
        >
          <img
            src="/history/history-hero01.webp"
            width={2880}
            height={2048}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className={
              initialYear === null
                ? "pointer-events-none block h-auto w-full select-none xl:[mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)]"
                : "pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-bottom transition-transform duration-[1250ms] ease-[cubic-bezier(.25,.8,.25,1)] will-change-transform motion-reduce:transition-none"
            }
            style={{
              transform:
                initialYear === null
                  ? `translateY(var(--history-image-offset, ${imageOffsetY}px))`
                  : "translate3d(var(--history-pan-x, 0%), var(--history-pan-y, 0px), 0) scale(1.25)",
              transformOrigin: "center bottom",
              imageRendering: "auto",
            }}
          />
          {initialYear === null && (
            <div
              className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          hidden
          h-full
          xl:block
        "
            >
              {HISTORY_POINTS.map((spot) => (
                <DesktopMilestone key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </div>

        {/* ======================================
          HISTORY CONTENT
      ====================================== */}

        <div
          data-history-heading
          className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-4 text-center md:max-xl:translate-y-8"
          style={{
            top: titleTop,
          }}
        >
          {/* HISTORY TITLE */}
          <h1
            ref={snowTitle}
            id="history-snow-title"
            aria-label="Our Historical Milestones"
            className="relative m-0 w-full max-w-full font-sans whitespace-normal text-balance lg:w-auto lg:whitespace-nowrap"
            style={{
              fontSize: titleFontSize,
              fontWeight: titleFontWeight,
              fontVariationSettings: `"wdth" 132, "wght" ${titleFontWeight}, "opsz" 28`,
              lineHeight: "100%",
              letterSpacing: "-0.04em",
              color: "#F7F7F7",
              textAlign: "center",
            }}
          >
            <span aria-hidden="true">
              {["Our", "Historical", "Milestones"].map((word, wordIndex) => (
                <span key={word} className="max-lg:block">
                  {Array.from(word, (letter, index) => (
                    <span
                      key={index}
                      className="history-snow-letter relative inline-block"
                      style={
                        {
                          "--snow-delay": `${(index * 137 + wordIndex * 173) % 520}ms`,
                        } as CSSProperties
                      }
                    >
                      {letter}
                    </span>
                  ))}
                  {wordIndex < 2 ? (
                    <span className="max-lg:hidden"> </span>
                  ) : null}
                </span>
              ))}
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {Array.from({ length: 32 }, (_, index) => (
                <span
                  key={index}
                  className="history-snowflake absolute opacity-0"
                  style={
                    {
                      left: `${(index * 31 + 7) % 100}%`,
                      top: `${(index % 3) * 24}%`,
                      "--snow-fall-delay": `${(index * 73) % 850}ms`,
                      "--snow-drift": `${index % 2 ? -0.3 : 0.25}em`,
                      "--snow-size": `${index % 4 === 0 ? 4 : 2}px`,
                    } as CSSProperties
                  }
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="block size-full"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  >
                    <path d="M6 0v12M.8 3l10.4 6M.8 9l10.4-6" />
                  </svg>
                </span>
              ))}
            </span>
          </h1>

          <style>{`
        body:has(#history-page[data-history-view="detail"]) > .site-header {
          position: sticky;
          top: 0;
          transform: none !important;
        }
          @media (prefers-reduced-motion: no-preference) {
            #history-snow-title[data-title-revealing] .history-snow-letter {
              animation: history-snow-build 2150ms cubic-bezier(.25,.55,.35,1) var(--snow-delay) both;
            }
            #history-snow-title[data-title-revealing] .history-snowflake {
              width: var(--snow-size); height: var(--snow-size); color: #f7f7f7;
              animation: history-snow-fall 2100ms linear var(--snow-fall-delay) both;
            }
          }
          @keyframes history-snow-build {
            0% { opacity: 0; clip-path: polygon(0 100%,15% 100%,30% 100%,45% 100%,60% 100%,75% 100%,90% 100%,100% 100%,100% 100%,0 100%); }
            12% { opacity: .85; clip-path: polygon(0 97%,15% 91%,30% 95%,45% 87%,60% 94%,75% 89%,90% 96%,100% 92%,100% 100%,0 100%); text-shadow: 0 0 3px #d3efff; }
            38% { opacity: 1; clip-path: polygon(0 73%,15% 64%,30% 72%,45% 60%,60% 69%,75% 62%,90% 70%,100% 65%,100% 100%,0 100%); }
            65% { opacity: 1; clip-path: polygon(0 40%,15% 29%,30% 39%,45% 24%,60% 34%,75% 27%,90% 39%,100% 31%,100% 100%,0 100%); text-shadow: 0 0 2px #e2f6ff; }
            88% { opacity: 1; clip-path: polygon(0 9%,15% 0,30% 8%,45% 0,60% 5%,75% 0,90% 9%,100% 0,100% 100%,0 100%); }
            100% { opacity: 1; clip-path: polygon(0 0,15% 0,30% 0,45% 0,60% 0,75% 0,90% 0,100% 0,100% 100%,0 100%); text-shadow: none; }
          }
          @keyframes history-snow-fall {
            0% { opacity: 0; transform: translate(0,-1.5em) rotate(0); }
            12% { opacity: .85; }
            50% { opacity: .85; transform: translate(var(--snow-drift),-.2em) rotate(65deg); }
            83% { opacity: .65; transform: translate(0,.6em) rotate(125deg); }
            100% { opacity: 0; transform: translate(var(--snow-drift),.65em) rotate(140deg) scale(.3); }
          }
        `}</style>
          {/* HISTORY DESCRIPTION */}
          <p
            className="m-0 w-full max-w-full font-sans text-balance md:max-w-[47.5vw] lg:max-w-[calc(900*var(--history-unit))]"
            style={{
              marginTop: descriptionGap,
              fontSize: descriptionFontSize,
              fontWeight: descriptionFontWeight,
              fontVariationSettings: `"wdth" 132, "wght" ${descriptionFontWeight}, "opsz" 28`,
              lineHeight: "112%",
              letterSpacing: descriptionLetterSpacing,
              color: "#F7F7F7",
              textAlign: "center",
            }}
          >
            Chronicle of growth from our initial 1972 foundry in Konya to an
            international pump manufacturing leader.
          </p>

          {/* ==================================
            ENGINEERING HERITAGE BADGE
        ================================== */}

          <div
            data-history-heritage
            className="relative flex flex-shrink-0 items-center text-left"
            style={{
              marginTop: badgeMarginTop,
              width: badgeWidth,
              minHeight: badgeMinHeight,
              padding: `${badgePaddingY} ${badgePaddingX}`,
              gap: badgeGap,
              borderRadius: badgeRadius,

              backgroundColor: "rgba(255,255,255,0.15)",

              border: "0.25px solid rgba(247,247,247,0.28)",

              backdropFilter: "blur(4.9px)",
              WebkitBackdropFilter: "blur(4.9px)",

              boxShadow: "0px 22px 28.9px 0px rgba(0,85,255,0.2)",

              transform: `scale(var(--history-heritage-scale, ${badgeScale}))`,
              transformOrigin: "center top",
            }}
          >
            {/* SEMPA ICON */}
            <img
              src="/history/sempa-icon.png"
              alt=""
              draggable={false}
              className="relative z-10 block shrink-0 select-none object-contain"
              style={{
                width: badgeIconWidth,
                height: badgeIconHeight,
                transform: `translate(var(--history-heritage-icon-x, ${badgeIconOffsetX}px), var(--history-heritage-icon-y, ${badgeIconOffsetY}px)) scale(${badgeIconScale})`,
                transformOrigin: "right center",
              }}
            />

            {/* BADGE TEXT */}
            <p
              className="relative z-10 m-0 min-w-0 flex-1 font-sans"
              style={{
                fontSize: badgeFontSize,
                fontWeight: badgeFontWeight,
                fontVariationSettings: `"wdth" 132, "wght" ${badgeFontWeight}, "opsz" 28`,
                lineHeight: "112%",
                letterSpacing: "-0.04em",
                color: "#9EB7D0",
                textAlign: "left",
              }}
            >
              SINCE 1972 •{" "}
              <strong
                style={{
                  fontWeight: badgeBoldFontWeight,
                  fontVariationSettings: `"wdth" 132, "wght" ${badgeBoldFontWeight}, "opsz" 28`,
                  letterSpacing: "0em",
                }}
              >
                50+ YEARS OF ENGINEERING
              </strong>{" "}
              HERITAGE
            </p>
          </div>
        </div>

        {/* ======================================
          DESKTOP TIMELINE
      ====================================== */}

        {/* ======================================
          MOBILE TIMELINE
      ====================================== */}

        {initialYear === null ? (
          <MobileTimeline />
        ) : (
          <HistoryTimeline key={initialYear} targetYear={initialYear} />
        )}

        {/* ======================================
          HOTSPOT ANIMATIONS
      ====================================== */}

        <style>{`
        #history-page[data-history-scroll-scene="true"] [data-history-track] { transition: none; }
        #history-page[data-history-scroll-scene="true"] [data-history-card] { transition-property: filter, opacity; }
      `}</style>
      </main>
      <div
        data-history-newsletter
        className="relative z-20 px-5 pt-48 pb-40 [--history-blend-height:288px] md:px-10 md:pt-56 md:pb-48 md:[--history-blend-height:352px] lg:pt-64 lg:pb-56 lg:[--history-blend-height:416px] xl:pt-80 xl:pb-64 xl:[--history-blend-height:480px]"
      >
        <div
          data-history-newsletter-blend
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -top-[var(--history-blend-height)] bg-[linear-gradient(180deg_in_oklab,#24547a,#e8f4ff)] [mask-image:linear-gradient(180deg,transparent_0%,#0000000d_calc(var(--history-blend-height)*.15),#00000080_calc(var(--history-blend-height)*.5),#000000f2_calc(var(--history-blend-height)*.85),#000_var(--history-blend-height))]"
        />
        <NewsletterSubscription className="relative z-10 mt-0! mb-0!" />
      </div>
    </>
  );
}
