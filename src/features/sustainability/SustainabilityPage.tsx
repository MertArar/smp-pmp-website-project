"use client";

import FactoryViewer from "@/components/sustainability/FactoryViewer";
import {
  useEffect as useSustainabilityImpactCardstsx_Effect,
  useId as useSustainabilityImpactCardstsx_Id,
  useRef as useSustainabilityImpactCardstsx_Ref,
  useState as useSustainabilityImpactCardstsx_State,
  type KeyboardEvent as SustainabilityImpactCardstsx_KeyboardEvent,
  type PointerEvent as SustainabilityImpactCardstsx_PointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import useScrollReveal from "@/components/ui/useScrollReveal";
import type { CSSProperties } from "react";

// Visible artwork bounds exclude each PNG's transparent padding and soft shadow.
// Fit the artwork, rather than the file canvas, into the same 28-unit square.
const impactIconArtwork: Record<
  string,
  { width: number; height: number; bounds: [number, number, number, number] }
> = {
  "sun.png": { width: 223, height: 223, bounds: [16, 16, 175, 175] },
  "water-drop.png": { width: 258, height: 278, bounds: [75, 92, 177, 210] },
  "leaf.png": { width: 176, height: 176, bounds: [8, 18, 158, 160] },
  "database.png": { width: 120, height: 120, bounds: [11, 8, 115, 112] },
  "medal.png": { width: 87, height: 120, bounds: [0, 0, 86, 120] },
  "tree.png": { width: 120, height: 120, bounds: [16, 5, 104, 115] },
};

function ImpactIcon({ src }: { src: string }) {
  const artwork = impactIconArtwork[src.split("/").pop()!]!;
  const [left, top, right, bottom] = artwork.bounds;
  const scale = 28 / Math.max(right - left, bottom - top);
  return (
    <span
      data-impact-icon
      aria-hidden="true"
      className="relative block size-[calc(36*var(--sustain-unit))] shrink-0"
    >
      <Image
        src={src}
        alt=""
        width={artwork.width}
        height={artwork.height}
        sizes="96px"
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: `calc(${artwork.width * scale} * var(--sustain-unit))`,
          height: `calc(${artwork.height * scale} * var(--sustain-unit))`,
          left: `calc(${18 - ((left + right) / 2) * scale} * var(--sustain-unit))`,
          top: `calc(${18 - ((top + bottom) / 2) * scale} * var(--sustain-unit))`,
        }}
      />
    </span>
  );
}

const SustainabilityImpactCardstsx_impactCards = [
  {
    value: "1.296",
    unit: "kWp (1.3 MW)",
    title: "Rooftop Solar Plant Capacity",
    heading: "Unbroken Green Manufacturing by Solar Power",
    description:
      "With solar panels spanning 10,000 m² of factory roof, we generate our own electricity and feed surplus clean energy into the city grid.",
    icon: "/sustainability/sun.png",
    position: "xl:left-0 xl:top-[14%]",
  },
  {
    value: "35%+",
    unit: "Energy Savings (IE4/IE5)",
    title: "Eco-Design (ErP) Pump Savings",
    heading: "High Hydraulic Yield in Every Drop, Zero Energy Waste",
    description:
      "Advanced hydraulic engineering and high-efficiency motors reduce energy consumption throughout the entire operational lifespan.",
    icon: "/sustainability/water-drop.png",
    position: "xl:left-1/2 xl:top-[4%] xl:-translate-x-1/2",
  },
  {
    value: "1.774",
    unit: "Ton / Year",
    title: "Annual CO₂ Emissions Prevented",
    heading: "A Measurable Carbon Shield for Cleaner Skies",
    description:
      "Through our renewable solar energy investment, 1,774 tons of CO₂ emissions are prevented annually, creating a cleaner environment for our community.",
    icon: "/sustainability/leaf.png",
    position: "xl:right-0 xl:top-[14%]",
  },
  {
    value: "10.000",
    unit: "m² Solar Panel",
    title: "Photovoltaic Solar Roof Area",
    heading: "Factory Roof Transformed into a Clean Energy Farm",
    description:
      "Our solar panels turn the factory roof into a productive clean energy source, powering manufacturing and supporting the local electricity grid.",
    icon: "/sustainability/database.png",
    position: "xl:left-0 xl:top-[60%]",
  },
  {
    value: "%100",
    unit: "Circular Metallurgy & Direct Regeneration",
    title: "Zero Waste Foundry Metallurgy",
    heading: "Recovered Raw Metals, Uncompromising Metallurgical Purity",
    description:
      "Metal resources are recovered and returned to our production cycle, reducing waste while preserving the metallurgical quality of every casting.",
    icon: "/sustainability/medal.png",
    position: "xl:bottom-0 xl:left-1/2 xl:-translate-x-1/2",
  },
  {
    value: "~80.500",
    unit: "Tree Equivalent / Year",
    title: "Equivalent Forest Conservation",
    heading: "A Forest-Sized Breath of Clean Air Every Year",
    description:
      "The annual carbon reduction of our solar plant delivers an environmental contribution equivalent to the carbon absorption of approximately 80,500 trees.",
    icon: "/sustainability/tree.png",
    position: "xl:right-0 xl:top-[60%]",
  },
];

// Begin with the efficiency card on small screens, matching the supplied reference.
// Desktop positions remain attached to each card rather than to its array index.
const SustainabilityImpactCardstsx_slides = [
  ...SustainabilityImpactCardstsx_impactCards.slice(1),
  SustainabilityImpactCardstsx_impactCards[0],
];

function SustainabilityImpactCardstsx_SustainabilityImpactCards() {
  const trackId = useSustainabilityImpactCardstsx_Id();
  const trackRef = useSustainabilityImpactCardstsx_Ref<HTMLDivElement>(null);
  const [active, setActive] = useSustainabilityImpactCardstsx_State(0);
  const [compact, setCompact] = useSustainabilityImpactCardstsx_State(true);
  const dragRef = useSustainabilityImpactCardstsx_Ref<{
    x: number;
    left: number;
  } | null>(null);
  const frameRef = useSustainabilityImpactCardstsx_Ref<number | null>(null);
  function closestSlide() {
    const track = trackRef.current;
    if (!track) return 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let distance = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const nextDistance = Math.abs(
        card.offsetLeft + card.offsetWidth / 2 - center,
      );
      if (nextDistance < distance) {
        closest = index;
        distance = nextDistance;
      }
    });
    return closest;
  }
  function syncActive() {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (window.innerWidth < 1280) setActive(closestSlide());
    });
  }
  useSustainabilityImpactCardstsx_Effect(() => {
    const media = window.matchMedia("(width < 1280px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new ResizeObserver(() => {
      if (media.matches) {
        const track = trackRef.current;
        if (!track) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let index = 0;
        let distance = Infinity;
        Array.from(track.children).forEach((child, next) => {
          const card = child as HTMLElement;
          const nextDistance = Math.abs(
            card.offsetLeft + card.offsetWidth / 2 - center,
          );
          if (nextDistance < distance) {
            index = next;
            distance = nextDistance;
          }
        });
        setActive(index);
      }
    });
    if (trackRef.current) observer.observe(trackRef.current);
    return () => {
      media.removeEventListener("change", sync);
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);
  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card || !compact) return;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  function onKeyDown(
    event: SustainabilityImpactCardstsx_KeyboardEvent<HTMLDivElement>,
  ) {
    if (!compact) return;
    let target: number;
    if (event.key === "ArrowLeft") target = Math.max(0, active - 1);
    else if (event.key === "ArrowRight")
      target = Math.min(
        SustainabilityImpactCardstsx_slides.length - 1,
        active + 1,
      );
    else if (event.key === "Home") target = 0;
    else if (event.key === "End")
      target = SustainabilityImpactCardstsx_slides.length - 1;
    else return;
    event.preventDefault();
    goTo(target);
  }
  function startDrag(
    event: SustainabilityImpactCardstsx_PointerEvent<HTMLDivElement>,
  ) {
    if (!compact || event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = {
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.scrollSnapType = "none";
  }
  function moveDrag(
    event: SustainabilityImpactCardstsx_PointerEvent<HTMLDivElement>,
  ) {
    const drag = dragRef.current;
    if (!drag) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.left + drag.x - event.clientX;
  }
  function endDrag(
    event: SustainabilityImpactCardstsx_PointerEvent<HTMLDivElement>,
  ) {
    if (!dragRef.current) return;
    const index = closestSlide();
    dragRef.current = null;
    event.currentTarget.style.scrollSnapType = "";
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    goTo(index);
  }
  return (
    <div
      data-impact-stage
      className="relative -mx-5 mt-16 h-[480px] [--impact-card-width:min(86vw,480px)] sm:-mx-6 sm:h-[640px] xl:mx-0 xl:mt-6 xl:h-[calc(800*var(--sustain-unit))]"
    >
      <figure className="absolute top-[110px] left-1/2 aspect-square w-[min(100vw,620px)] -translate-x-1/2 xl:top-0 xl:w-[66.666667%] xl:max-w-none">
        <FactoryViewer />
      </figure>

      <div
        id={trackId}
        ref={trackRef}
        role="region"
        aria-roledescription={compact ? "carousel" : undefined}
        aria-label="Sustainability impact"
        tabIndex={compact ? 0 : -1}
        onScroll={syncActive}
        onKeyDown={onKeyDown}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative z-10 flex w-full cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[calc((100%-var(--impact-card-width))/2)] pb-3 select-none [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d5792] active:cursor-grabbing xl:contents xl:cursor-default xl:select-text [&::-webkit-scrollbar]:hidden"
      >
        {SustainabilityImpactCardstsx_slides.map((card, index) => (
          <article
            key={card.title}
            data-impact-card
            role={compact ? "group" : undefined}
            aria-roledescription={compact ? "slide" : undefined}
            aria-label={
              compact
                ? `${index + 1} of ${SustainabilityImpactCardstsx_slides.length}: ${card.title}`
                : undefined
            }
            className={`relative flex min-h-[240px] w-[var(--impact-card-width)] min-w-0 shrink-0 snap-center flex-col gap-[calc(13*var(--sustain-unit))] rounded-[calc(30*var(--sustain-unit))] border border-[#9eb7d0]/30 bg-white/40 max-md:bg-white/80 px-[calc(23*var(--sustain-unit))] py-[calc(19*var(--sustain-unit))] shadow-[inset_0_1px_0_#ffffff99] backdrop-blur-[18px] transition-[box-shadow,background-color] duration-300 hover:bg-white/55 max-md:hover:bg-white/85 hover:shadow-[0_12px_30px_#0d579210,inset_0_1px_0_#ffffffaa] motion-reduce:transition-none xl:absolute xl:z-10 xl:min-h-[calc(240*var(--sustain-unit))] xl:w-[29.083333%] ${card.position}`}
          >
            <div className="flex items-center justify-between gap-3">
              <ImpactIcon src={card.icon} />
              <span className="max-w-[65%] text-right text-[calc(9*var(--sustain-unit))] leading-[1.12] text-[#9eb7d0]">
                {card.unit}
              </span>
            </div>
            <p className="text-[calc(25*var(--sustain-unit))] leading-[1.12] font-[540] [font-variation-settings:'wght'_540,'wdth'_125]">
              {card.value}
            </p>
            <h2 className="text-[calc(15*var(--sustain-unit))] leading-[1.12] font-[410] text-[#0d5792]">
              {card.title}
            </h2>
            <p className="max-w-[94%] text-[calc(15*var(--sustain-unit))] leading-[1.12]">
              {card.heading}
            </p>
            <p className="text-[11px] leading-[1.2] text-[#8eabc4] xl:text-[calc(9*var(--sustain-unit))]">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div
        role="group"
        aria-label="Choose an impact card"
        className="absolute inset-x-0 bottom-0 flex justify-center xl:hidden"
      >
        {SustainabilityImpactCardstsx_slides.map((card, index) => (
          <button
            key={card.title}
            type="button"
            aria-label={`Show ${card.title}`}
            aria-pressed={active === index}
            aria-controls={trackId}
            onClick={() => goTo(index)}
            className={`grid h-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-[#0d5792] ${active === index ? "w-10" : "w-5"}`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${active === index ? "w-8 bg-[#9eb7d0]" : "w-2 bg-white/85"}`}
            />
          </button>
        ))}
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {SustainabilityImpactCardstsx_slides[active].title}
        </span>
      </div>
    </div>
  );
}

const introduction =
  "With our 2 mW rooftop solar plant, ISO 14001 environmental management, IE4/IE5 ecodesign hydraulic engineering, and SEMPA Academy, we power an energy-efficient future and a living planet.";

const certifications = [
  {
    title: "ISO",
    number: "14001:2015",
    description: "Environmental Management System Certificate",
    image: "/sustainability/ISO.png",
  },
  {
    title: "ErP",
    number: "2009/125/EC",
    description: "Ecodesign Directive & MEI Minimum Efficiency Index",
    image: "/sustainability/stars.png",
  },
  {
    title: "ISO",
    number: "50001:2018",
    description: "Energy Management System Certificate",
    image: "/sustainability/ISO.png",
  },
  {
    title: "ISO",
    number: "14064-1:2018",
    description: "Corporate GHG (Carbon Footprint) Verification Statement",
    image: "/sustainability/ISO.png",
  },
];

const commitments = [
  {
    title: "2 mW Rooftop Solar Power Plant",
    heading: "Factory Powered by the Sun, Clean Electricity for the Community",
    description:
      "Spanning 10,000 m² of plant roof, our 1.3 MW solar farm powers factory operations and feeds surplus renewable power to the Konya municipal grid, preventing 1,774 tons of CO₂ annually.",
  },
  {
    title: "Carbon Footprint Audits & Science-Based Targets",
    heading:
      "What Cannot Be Measured Cannot Be Reduced: Transparent GHG Accounting",
    description:
      "Scope 1, Scope 2, and Scope 3 greenhouse gas inventories are independently audited in compliance with ISO 14064 standards, backed by rigorous reduction targets.",
  },
  {
    title: "Green Pumps & EU ErP Eco-Design Directives",
    heading:
      "Exceeding European Benchmarks with MEI ≥ 0.70 Hydraulic Efficiency",
    description:
      "All centrifugal pump series conform to EU Ecodesign directives. CFD-optimized impellers transform every electrical watt into peak hydraulic performance with zero thermal waste.",
  },
  {
    title: "Pump Retrofit & Energy Auditing Field Services",
    heading: "Upgrade Legacy Pumps, Slash Operating Power by up to 35%",
    description:
      "Our field service teams combine on-site energy audits and industrial pump optimization, upgrading underperforming legacy pumps to modern high-efficiency SEMPA units.",
  },
  {
    title: "Eco-Conscious Water & Wastewater Engineering",
    heading:
      "Every Drop Counts: Hydraulic Power for Water Recycling & Treatment",
    description:
      "Pumps support water recycling systems and municipal wastewater treatment, helping industrial operations protect water resources through responsible hydraulic engineering.",
  },
];

const governanceStatements = [
  "To ensure 100% compliance with honesty and ethical rules, the necessary documentation and management infrastructure have been established and put into operation. Relevant clauses have been included in the contracts we have made with our employees, customers, subcontractors, and suppliers.",
  "Full compliance with laws and regulations is ensured, and flawless results are achieved in inspections conducted by the relevant ministries.",
  "We have aligned our documentation system with anti-corruption and anti-bribery measures, fair competition, and antitrust legislation. Relevant clauses have been included in the contracts we have made with our customers and suppliers.",
  "All our records are kept transparently and are provided to the relevant authorities upon request.",
  "To improve product and production quality, ISO 9001 Quality Management System certification has been obtained and successfully maintained.",
  "To enhance customer satisfaction, ISO 10002 Customer Satisfaction Management System certification has been obtained and is being successfully maintained.",
  "ISO 45001 Occupational Health and Safety Management System standard requirements are adhered to for ensuring workplace health and safety.",
  "Supply chain management is conducted in accordance with the requirements of the standards mentioned above.",
  "To protect the environment and reduce climate change, ISO 14001 Environmental Management System standard requirements are followed.",
  "We have started producing 1.3 megawatts of electrical energy as installed capacity by installing solar panels on the roof of our production center, covering approximately 10,000 square meters. Our investment not only meets our own needs but also contributes to Konya's electricity consumption. Thanks to the 1296 kWp rooftop PV (solar photovoltaic) system, a total of 1,774 CO₂ emissions will be prevented annually.",
  "Carbon footprint calculation and goal-setting efforts have also begun.",
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mx-auto max-w-[calc(1000*var(--sustain-unit))] text-center text-[clamp(28px,3.4722vw,66.6667px)] leading-none font-[410] tracking-[-0.04em] text-[#0d5792]">
      {children}
    </h2>
  );
}

function CircularTitleWords({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span key={word} className="inline-block whitespace-nowrap">
          <span
            className="sustain-cycle-word inline-block"
            style={
              {
                "--cycle-delay": `${(index + offset) * 90 + 180}ms`,
                "--cycle-drift": `${(index + offset) % 2 ? -18 : 18}px`,
                "--cycle-turn": `${(index + offset) % 2 ? 5 : -5}deg`,
              } as CSSProperties
            }
          >
            {word}
          </span>
          {index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </>
  );
}

export default function SustainabilityPage() {
  const circularTitle = useRepeatingTitle(3100);
  const pageRef = useScrollReveal(
    "[data-sustain-introduction], [data-impact-card], section[aria-labelledby='esg-title'] > h2, section[aria-labelledby='esg-title'] > p, section[aria-labelledby='esg-title'] article, section[aria-labelledby='governance-title'], [data-sustain-newsletter]",
  );
  return (
    <main
      ref={pageRef}
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] relative isolate w-full overflow-x-clip bg-[linear-gradient(115deg,#e6f4ff_0%,#cce6ff_55%,#e9f5ff_100%)] font-[410] tracking-[-0.04em] text-[#27272a] [font-family:var(--font-sf-pro),Arial,sans-serif] [font-variation-settings:'wght'_410,'wdth'_125] [--sustain-unit:clamp(1px,0.0694444444vw,1.333333px)]"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className="mx-auto w-[calc(100%-40px)] max-w-[calc(1200*var(--sustain-unit))] sm:w-[calc(100%-48px)]">
        <nav
          aria-label="Breadcrumb"
          className="hidden pt-7 text-[10px] text-[#9eb7d0] xl:block xl:pt-9"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[#0d5792] focus-visible:outline-2 focus-visible:outline-[#005eff]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>Corporate</li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Sustainability</li>
          </ol>
        </nav>

        <section aria-labelledby="sustainability-title" className="pt-12">
          <header className="text-center">
            <h1
              ref={circularTitle}
              aria-label="Returning Clean What Nature Gives: Zero Carbon, Endless Circularity"
              id="sustainability-title"
              className="relative mx-auto max-w-[290px] text-[clamp(30px,3.4722vw,66.6667px)] leading-none font-[410] tracking-[-0.04em] text-[#0d5792] sm:max-w-[640px] xl:max-w-[calc(1050*var(--sustain-unit))]"
            >
              <span aria-hidden="true">
                <CircularTitleWords text="Returning Clean What Nature" />
                <br className="hidden sm:block" />{" "}
                <CircularTitleWords
                  text="Gives: Zero Carbon, Endless Circularity"
                  offset={4}
                />
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 600 180"
                preserveAspectRatio="none"
                className="sustain-cycle-route pointer-events-none absolute -inset-x-2 -top-4 h-[calc(100%+32px)] w-[calc(100%+16px)] overflow-visible opacity-0"
                fill="none"
              >
                <path
                  className="sustain-cycle-trail"
                  pathLength="100"
                  d="M300 90C240 0 65 0 50 80C30 190 220 165 300 90C380 15 570-10 550 100C535 180 360 180 300 90C240 0 65 0 50 80"
                  stroke="#499d79"
                  strokeWidth="1"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                {[0, 1, 2].map((index) => (
                  <path
                    key={index}
                    className="sustain-cycle-energy"
                    pathLength="100"
                    d="M300 90C240 0 65 0 50 80C30 190 220 165 300 90C380 15 570-10 550 100C535 180 360 180 300 90C240 0 65 0 50 80"
                    stroke={index === 1 ? "#8db665" : "#2e9f9c"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={
                      { "--energy-offset": `${index * -33}px` } as CSSProperties
                    }
                  />
                ))}
                {[
                  { x: 74, y: 37 },
                  { x: 520, y: 135 },
                ].map((leaf, index) => (
                  <g
                    key={index}
                    className="sustain-cycle-leaf"
                    transform={`translate(${leaf.x} ${leaf.y}) rotate(${index ? 135 : -25})`}
                  >
                    <path
                      d="M0 0C-12-14-11-23 2-28C13-15 11-6 0 0Z"
                      fill="#82ad6c"
                      fillOpacity=".75"
                    />
                    <path d="M0 0L2-24" stroke="#367b64" strokeWidth=".8" />
                  </g>
                ))}
              </svg>
            </h1>
            <style>{`
              @media (prefers-reduced-motion: no-preference) {
                #sustainability-title[data-title-revealing] .sustain-cycle-word {
                  animation: sustain-regenerate 1150ms cubic-bezier(.2,.7,.25,1) var(--cycle-delay) both;
                }
                #sustainability-title[data-title-revealing] .sustain-cycle-route { animation: sustain-route-atmosphere 3000ms ease both; }
                #sustainability-title[data-title-revealing] .sustain-cycle-trail {
                  stroke-dasharray: 24 76; animation: sustain-energy-flow 2700ms cubic-bezier(.3,.1,.3,1) both;
                }
                #sustainability-title[data-title-revealing] .sustain-cycle-energy {
                  stroke-dasharray: .1 99.9; animation: sustain-energy-flow 2700ms cubic-bezier(.3,.1,.3,1) both;
                }
                #sustainability-title[data-title-revealing] .sustain-cycle-leaf { animation: sustain-leaf-breathe 2700ms ease both; transform-box: fill-box; transform-origin: center; }
              }
              @keyframes sustain-regenerate {
                0% { opacity: 0; transform: translate(var(--cycle-drift),18px) rotate(var(--cycle-turn)); color: #4b9973; clip-path: inset(100% 0 0); }
                35% { opacity: .8; color: #3e9376; clip-path: inset(0 0 0); }
                65% { opacity: 1; transform: translate(0,-2px) rotate(0); color: #248a8d; }
                100% { opacity: 1; transform: translate(0,0) rotate(0); color: #0d5792; clip-path: inset(0 0 0); }
              }
              @keyframes sustain-route-atmosphere { 0% { opacity: 0; } 15% { opacity: .6; } 65% { opacity: .4; } 100% { opacity: 0; } }
              @keyframes sustain-energy-flow { from { stroke-dashoffset: calc(var(--energy-offset,0px) + 12px); } to { stroke-dashoffset: calc(var(--energy-offset,0px) - 88px); } }
              @keyframes sustain-leaf-breathe { 0%,100% { opacity: 0; } 30%,65% { opacity: .8; } }
            `}</style>
            <p
              data-sustain-introduction
              className="mx-auto mt-14 max-w-[340px] text-[15px] leading-[1.12] sm:max-w-[640px] xl:mt-4 xl:max-w-[calc(870*var(--sustain-unit))] xl:leading-[1.2] 2xl:text-[calc(15*var(--sustain-unit))]"
            >
              {introduction}
            </p>
          </header>

          <SustainabilityImpactCardstsx_SustainabilityImpactCards />
        </section>

        <section
          aria-labelledby="esg-title"
          className="pt-[calc(100*var(--sustain-unit))]"
        >
          <SectionHeading>
            <span id="esg-title">
              Environmental, Social &amp; Governance:
              <br className="hidden sm:block" /> Our Three-Dimensional
              Commitment
            </span>
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-[340px] text-center text-[15px] leading-[1.12] sm:max-w-[640px] xl:max-w-[calc(870*var(--sustain-unit))] xl:leading-[1.2] 2xl:text-[calc(15*var(--sustain-unit))]">
            {introduction}
          </p>

          <div className="mt-20 xl:mt-[calc(40*var(--sustain-unit))] xl:rounded-[calc(30*var(--sustain-unit))] xl:bg-white xl:px-[calc(45*var(--sustain-unit))] xl:py-[calc(30*var(--sustain-unit))]">
            <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,403fr)_minmax(0,674fr)] xl:gap-[calc(28*var(--sustain-unit))]">
              <div className="px-3 xl:px-0">
                <p className="text-[calc(9*var(--sustain-unit))] leading-[1.12] text-[#0d5792]">
                  CLIMATE ACTION · ISO 14001
                </p>
                <h3 className="mt-4 text-[calc(20*var(--sustain-unit))] leading-[1.07] font-[410]">
                  Reverence for Nature, Net Zero Carbon, and Eco-Design
                  Engineering
                </h3>
                <p className="mt-5 text-[calc(12*var(--sustain-unit))] leading-[1.12]">
                  SEMPA implements an end-to-end environmental doctrine
                  minimizing carbon footprints from manufacturing lines to a
                  30-year operational field lifespan.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-[calc(10*var(--sustain-unit))]">
                {certifications.map((certificate) => (
                  <article
                    key={certificate.number}
                    className="min-h-[120px] min-w-0 rounded-[calc(11*var(--sustain-unit))] border border-[#9eb7d0]/65 bg-white/30 p-[calc(16*var(--sustain-unit))] [overflow-wrap:anywhere] xl:min-h-[calc(145*var(--sustain-unit))]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="min-w-0 text-[11px] leading-[1.12] font-[410] text-[#0d5792] 2xl:text-[calc(11*var(--sustain-unit))]">
                        {certificate.title}
                        <br />
                        {certificate.number}
                      </h4>
                      <Image
                        src={certificate.image}
                        alt=""
                        width={28}
                        height={28}
                        unoptimized
                        sizes="(min-width: 1920px) 37px, 28px"
                        className="size-[calc(28*var(--sustain-unit))] shrink-0 object-contain"
                      />
                    </div>
                    <p className="mt-4 max-w-[175px] text-[10px] leading-[1.12] xl:max-w-none 2xl:text-[calc(10*var(--sustain-unit))]">
                      {certificate.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-[calc(62*var(--sustain-unit))] hidden gap-[calc(20*var(--sustain-unit))] xl:grid xl:grid-cols-3">
              {commitments.map((commitment) => (
                <article
                  key={commitment.title}
                  className="flex min-w-0 flex-col gap-[calc(22*var(--sustain-unit))] rounded-[calc(15*var(--sustain-unit))] bg-[#f7f7f7] px-[calc(22*var(--sustain-unit))] py-[calc(20*var(--sustain-unit))] transition-[background-color,box-shadow] duration-300 hover:bg-[#f1f7fc] hover:shadow-[0_8px_20px_#0d57920a] motion-reduce:transition-none xl:min-h-[calc(174*var(--sustain-unit))]"
                >
                  <h3 className="text-[calc(15*var(--sustain-unit))] leading-[1.12] font-[540] [font-variation-settings:'wght'_540,'wdth'_125]">
                    {commitment.title}
                  </h3>
                  <p className="text-[calc(12*var(--sustain-unit))] leading-[1.12]">
                    {commitment.heading}
                  </p>
                  <p className="text-[calc(10*var(--sustain-unit))] leading-[1.2]">
                    {commitment.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="governance-title"
          className="mt-16 xl:mt-[calc(100*var(--sustain-unit))] xl:min-h-[calc(462*var(--sustain-unit))]"
        >
          <h2
            id="governance-title"
            className="text-[20px] leading-[1.15] font-[410] text-[#0d5792] 2xl:text-[calc(20*var(--sustain-unit))]"
          >
            We are tirelessly working towards sustainable growth as Sempa!
          </h2>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-[15px] leading-[1.12] 2xl:text-[calc(15*var(--sustain-unit))]">
            {governanceStatements.map((statement) => (
              <li key={statement}>{statement}</li>
            ))}
          </ul>
        </section>

        <div
          data-sustain-newsletter
          className="pt-[calc(60*var(--sustain-unit))] pb-[calc(130*var(--sustain-unit))]"
        >
          <NewsletterSubscription scaled />
        </div>
      </div>
    </main>
  );
}
