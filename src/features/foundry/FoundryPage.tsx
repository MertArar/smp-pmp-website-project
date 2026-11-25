"use client";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  LuCheck,
  LuCloudDownload,
  LuFactory,
  LuFlame,
  LuLayers,
  LuScale,
  LuScanLine,
  LuShieldCheck,
  LuTrendingUp,
} from "react-icons/lu";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useViewportVideo from "@/components/media/useViewportVideo";

// Match AboutUsPage's soft entrance timing and replay-on-view behavior.
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

const asset = (name: string) => `/foundry/${encodeURIComponent(name)}`;
const frame =
  "mx-auto w-[calc(100%-24px)] min-[768px]:w-[90%] min-[1200px]:w-5/6";
const heading =
  "m-0 text-[clamp(26px,7.7vw,34px)] leading-none tracking-[-0.04em] min-[768px]:text-[36px] min-[1200px]:text-[calc(50*var(--foundry-unit))]";
const redText =
  "bg-linear-to-b from-[#E30A17] to-[#7D060D] bg-clip-text text-transparent";
const body =
  "text-[16px] leading-[1.05] tracking-[-0.04em] min-[768px]:leading-[1.15] min-[1200px]:text-[calc(15*var(--foundry-unit))]";
const small =
  "text-[12px] leading-[1.12] tracking-[-0.04em] min-[1200px]:text-[calc(12*var(--foundry-unit))]";
const glass = "border border-white/20 bg-white/15 backdrop-blur-[30px]";
const heroGlass = "border border-white/25 bg-white/[0.08] backdrop-blur-[8px]";
const tableText =
  "bg-[linear-gradient(90deg,#F7F7F7_0%,rgba(247,247,247,0.2)_100%)] bg-clip-text text-transparent";
const tableRedText =
  "bg-[linear-gradient(90deg,#E30A17_0%,rgba(227,10,23,0.25)_100%)] bg-clip-text text-transparent";
const descriptionText =
  "bg-[linear-gradient(180deg,#F7F7F7_0%,rgba(247,247,247,0.22)_100%)] bg-clip-text text-transparent";

// All letter layers keep identical line breaks. Only the invisible anchor copy
// contains tiny flame bursts, each attached to a real word corner.
function FoundryHeroHeadline({ sparks = false }: { sparks?: boolean }) {
  return (
    <>
      <span className="relative whitespace-nowrap">
        Engineered
        {sparks && <FoundryMoltenBurst place="engineered" delay="1.2s" />}
      </span>
      <span className="min-[1200px]:hidden"> </span>
      <br className="hidden min-[1200px]:block" />
      <span className="relative whitespace-nowrap">
        Castings.
        {sparks && <FoundryMoltenBurst place="castings" delay="1.95s" />}
      </span>
      <br />
      <span className="relative whitespace-nowrap">
        Single-Source
        {sparks && <FoundryMoltenBurst place="single" delay="2.65s" />}
      </span>
      <br />
      <span className="relative whitespace-nowrap">
        Accountability.
        {sparks && <FoundryMoltenBurst place="accountability" delay="3.3s" />}
      </span>
    </>
  );
}

function FoundryMoltenBurst({
  place,
  delay,
}: {
  place: "engineered" | "castings" | "single" | "accountability";
  delay: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`foundry-molten-burst foundry-molten-burst-${place}`}
      style={{ "--flare-delay": delay } as CSSProperties}
    >
      <span className="foundry-molten-ember foundry-molten-ember-left" />
      <span className="foundry-molten-ember foundry-molten-ember-top" />
      <span className="foundry-molten-ember foundry-molten-ember-right" />
    </span>
  );
}

const moltenDrops = [
  { x: "11%", stop: "16%", delay: "0.06s", size: "12px", drift: "-4px" },
  { x: "6%", stop: "25%", delay: "0.19s", size: "6px", drift: "3px" },
  { x: "35%", stop: "28%", delay: "0.27s", size: "9px", drift: "5px" },
  { x: "58%", stop: "34%", delay: "0.45s", size: "8px", drift: "-3px" },
  { x: "19%", stop: "48%", delay: "0.68s", size: "11px", drift: "4px" },
  { x: "45%", stop: "58%", delay: "0.83s", size: "7px", drift: "-5px" },
  { x: "66%", stop: "69%", delay: "1.12s", size: "10px", drift: "3px" },
  { x: "75%", stop: "76%", delay: "1.18s", size: "6px", drift: "-4px" },
  { x: "23%", stop: "82%", delay: "1.3s", size: "12px", drift: "5px" },
  { x: "53%", stop: "89%", delay: "1.53s", size: "8px", drift: "-3px" },
] as const;

type RevealTone = "red" | "white" | "description";
type RevealPart = {
  text: string;
  tone: RevealTone;
  breakBefore?: "always" | "desktop" | "mobile";
  spaceBefore?: boolean;
};

// Split words into groups of about 4–5 characters without breaking the word's layout.
function splitRevealWord(word: string) {
  const letters = Array.from(word);
  const groupCount = Math.max(1, Math.ceil(letters.length / 5));
  const base = Math.floor(letters.length / groupCount);
  const extras = letters.length % groupCount;
  const chunks: string[] = [];
  let position = 0;

  for (let i = 0; i < groupCount; i++) {
    const length = base + (i < extras ? 1 : 0);
    chunks.push(letters.slice(position, position + length).join(""));
    position += length;
  }

  return chunks;
}

function ScrollColorChunk({
  value,
  tone,
  index,
  total,
  progress,
  reduced,
}: {
  value: string;
  tone: RevealTone;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const step = 0.92 / Math.max(1, total);
  const start = 0.025 + index * step;
  const end = Math.min(1, start + step * 2.8);
  const greyOpacity = useTransform(progress, [start, end], [1, 0]);

  return (
    <span className="relative inline-block">
      <span
        className={
          tone === "red"
            ? redText
            : tone === "description"
              ? descriptionText
              : "text-[#F7F7F7]"
        }
      >
        {value}
      </span>
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-[#A3AAB4]"
          style={{ opacity: greyOpacity, WebkitTextFillColor: "#A3AAB4" }}
        >
          {value}
        </motion.span>
      )}
    </span>
  );
}

function ScrollColorText({ parts }: { parts: RevealPart[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.87", "end 0.32"],
  });

  const total = parts.reduce(
    (sum, part) =>
      sum +
      (part.text.match(/\S+/gu) ?? []).reduce(
        (count, word) => count + splitRevealWord(word).length,
        0,
      ),
    0,
  );
  let sequence = 0;

  return (
    <span ref={ref} className="block">
      {parts.map((part, partIndex) => (
        <span key={partIndex}>
          {part.breakBefore === "always" && <br />}
          {part.breakBefore === "desktop" && (
            <>
              <span className="min-[1200px]:hidden"> </span>
              <br className="hidden min-[1200px]:block" />
            </>
          )}
          {part.breakBefore === "mobile" && (
            <>
              <br className="min-[768px]:hidden" />
              <span className="hidden min-[768px]:inline"> </span>
            </>
          )}
          {part.spaceBefore && " "}
          {(part.text.match(/\S+|\s+/gu) ?? []).map((unit, wordIndex) =>
            /^\s+$/u.test(unit) ? (
              <span key={wordIndex}>{unit}</span>
            ) : (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {splitRevealWord(unit).map((value, chunkIndex) => (
                  <ScrollColorChunk
                    key={chunkIndex}
                    value={value}
                    tone={part.tone}
                    index={sequence++}
                    total={total}
                    progress={scrollYProgress}
                    reduced={reduced}
                  />
                ))}
              </span>
            ),
          )}
        </span>
      ))}
    </span>
  );
}
const capacity = [
  {
    value: "4,000 kg",
    label: "MAX SINGLE PIECE",
    description: "Project-specific envelope & pit casting",
    color: "text-white",
  },
  {
    value: "3",
    label: "MOLDING ROUTES",
    description: "Automatic green sand, resin line & hand",
    color: "text-white",
  },
  {
    value: "95%",
    label: "SAND RECLAMATION",
    description: "Automatic green sand, resin line & hand",
    color: "text-[#00FF26]",
  },
  {
    value: "100+",
    label: "CNC MACHINES",
    description: "5-Axis vertical, horizontal & CMM inspection",
    color: "text-[#E30A17]",
  },
];
const production = [
  {
    process: "Automatic Green Sand",
    machine: "Flaskless automated",
    weight: "1–60 kg",
    envelope: "800 × 800 × 500 mm",
    rate: "90 molds / hour",
    fit: "Repeatable small and medium parts",
    detail:
      "High-speed automated flaskless green sand molding for serial impellers, flanges, and compact volute production with tight dimensional tolerances.",
  },
  {
    process: "Resin Molding Line",
    machine: "No-bake furan resin",
    weight: "30–600 kg",
    envelope: "2,000 × 2,500 × 2,000 mm",
    rate: "30 molds / day",
    fit: "Medium batches and complex geometry",
    detail:
      "Chemically bonded no-bake resin sand line optimized for intricate core packages, multi-stage pump diffusers, and medium-size pump bodies.",
  },
  {
    process: "Resin Hand Molding",
    machine: "Heavy section",
    weight: "200–4,000 kg",
    envelope: "Project-specific envelope",
    rate: "Project-based schedule",
    fit: "Large, low-volume heavy castings",
    detail:
      "Heavy floor and pit molding for double-suction split-case volute casings, large municipal pump housings, and custom heavy industrial rotating equipment.",
  },
];
const inHouseMaterials = [
  {
    name: "Grey Cast Iron",
    standard:
      "EN-GJL-200 / 250 / 300 (GG20–GG30) | ASTM A48 Class 30 / 35 / 40",
    description:
      "Excellent vibration damping, high machinability, and superior dimensional stability for standard industrial pump volutes and bearing brackets.",
    points: [
      "Tensile: 200–300 MPa",
      "Brinell Hardness: 160–240 HB",
      "Thermal stability",
    ],
  },
  {
    name: "Ductile Cast Iron",
    standard: "EN-GJS-400-15 / 500-7 / 600-3 (GGG40–GGG60) | ASTM A536",
    description:
      "Spheroidal graphite microstructure delivering exceptional tensile strength, impact resistance, and elongation for high-pressure multi-stage casings.",
    points: [
      "Tensile: up to 600 MPa",
      "Elongation: up to 15%",
      "High impact resilience",
    ],
  },
  {
    name: "Bronze & Copper Alloys",
    standard: "CuSn10, CuSn12 (RG10), CuAl10Fe5Ni5 (Nickel Aluminum Bronze)",
    description:
      "Superior corrosion and cavitation resistance for seawater intake pumps, marine propulsion, and aggressive industrial fluids.",
    points: [
      "Seawater resistant",
      "Anti-cavitation",
      "Self-lubricating qualities",
    ],
  },
];
const partnerMaterials = [
  {
    name: "Stainless Steel",
    standard: "Stainless steel · approved-partner route",
    description:
      "Sourced through Sempa’s approved-partner network and fully inspected and machined by Sempa.",
    points: [
      "Approved-partner sourcing",
      "Sempa inspection",
      "Documented acceptance",
    ],
  },
  {
    name: "Duplex Alloys",
    standard: "Duplex · approved-partner route",
    description:
      "Project requirements, grade selection, inspection scope and documentation are agreed before production release.",
    points: [
      "Project-specific grade selection",
      "Inspection and machining",
      "Single-interface coordination",
    ],
  },
  {
    name: "Superalloys",
    standard: "Special alloys · approved-partner route",
    description:
      "Special-alloy castings follow the same coordinated inspection, machining and documented release process.",
    points: [
      "Approved-partner sourcing",
      "Coordinated machining",
      "Documented release",
    ],
  },
];
const machiningStages = [
  {
    title: "AS-CAST",
    text: "Visual & receipt check",
    position: "top-[14%] left-[2%] min-[768px]:top-[28%]",
  },
  {
    title: "DATUM",
    text: "Rough alignment",
    position: "top-[8%] right-[12%] min-[768px]:top-[15%]",
  },
  {
    title: "FULL CNC",
    text: "Critical tolerances",
    position: "bottom-0 left-[4%] min-[768px]:bottom-[15%]",
  },
  {
    title: "CMM METRO",
    text: "Documented release",
    position:
      "bottom-0 right-[10%] min-[768px]:bottom-[5%] min-[768px]:right-[26%]",
  },
];
const castingFilters = [
  "All Castings",
  "Casing",
  "Impeller",
  "Bracket",
  "Special",
] as const;
const analysisTabs = [
  { label: "Alloys Comparison", Icon: LuScale },
  { label: "Melting Thermal Cycle", Icon: LuFlame },
  { label: "Sand & Ecology", Icon: LuLayers },
  { label: "3D Print Breakeven", Icon: LuTrendingUp },
  { label: "Metrology Deviation", Icon: LuScanLine },
];
const parameters = [
  "Tensile (Rm)",
  "Yield (Rp0.2)",
  "Elongation (A5)",
  "Hardness (HB)",
] as const;

// Grade-level reference figures, not batch-specific test results.
// EN-GJS: https://www.roeth-guss.de/en/materials/
// EN-GJL-250: https://walze-coswig.de/en/home/products/hand-mould-casting/material-information-on-hand-mould-casting/
// CuAl10Fe5Ni5-C (CC333G): https://www.fitscherguss.de/en/alloys/copper-aluminium-alloys
// CF8M: https://www.stainlessfoundry.com/selector/cf8m/
// Cast duplex 2205 (A890 4A): https://fondinox.it/en/materials/gr-4a/
const alloys = [
  {
    name: "EN-GJL-250",
    tensile: 250,
    yield: null,
    elongation: null,
    hardness: { min: 180, max: 255 },
  },
  {
    name: "EN-GJS-400-15",
    tensile: 400,
    yield: 250,
    elongation: 15,
    hardness: { min: 135, max: 180 },
  },
  {
    name: "EN-GJS-500-7",
    tensile: 500,
    yield: 320,
    elongation: 7,
    hardness: { min: 150, max: 220 },
  },
  {
    name: "EN-GJS-600-3",
    tensile: 600,
    yield: 370,
    elongation: 3,
    hardness: { min: 190, max: 270 },
  },
  {
    name: "CuAl10Fe5Ni5",
    tensile: 650,
    yield: 280,
    elongation: 13,
    hardness: { min: 150, max: null },
  },
  {
    name: "AISI 316 (CF8M)",
    tensile: 485,
    yield: 205,
    elongation: 30,
    hardness: { min: 146, max: 212 },
  },
  {
    name: "Duplex 2205",
    tensile: 620,
    yield: 415,
    elongation: 25,
    hardness: { min: 200, max: 260 },
  },
];
const alloyChartSettings = {
  "Tensile (Rm)": {
    title: "Tensile Strength Rm",
    description: "Reference ultimate tensile strength by casting grade.",
    unit: "MPa",
    max: 800,
  },
  "Yield (Rp0.2)": {
    title: "Yield Strength Rp0.2",
    description:
      "0.2% proof stress; unavailable where the grade has no defined Rp0.2 value.",
    unit: "MPa",
    max: 500,
  },
  "Elongation (A5)": {
    title: "Elongation A5",
    description:
      "Reference minimum elongation at fracture, expressed as a percentage.",
    unit: "%",
    max: 40,
  },
  "Hardness (HB)": {
    title: "Brinell Hardness HB",
    description:
      "Published Brinell hardness bands, where available, by alloy grade.",
    unit: "HB",
    max: 320,
  },
} satisfies Record<
  (typeof parameters)[number],
  { title: string; description: string; unit: string; max: number }
>;
const qualityRows = [
  [
    "Chemical Composition",
    "Spectrometric analysis, Optical Emission Spectroscopy (OES), PMI",
    "Every melt ladle and heat lot against EN/ASTM chemical limits",
    "Spectro analysis report & Melt heat log",
  ],
  [
    "Mechanical Properties",
    "Tensile test, yield strength, elongation, Brinell hardness (HBW), Charpy impact",
    "Test bars poured in the same heat lot as the castings",
    "Mechanical test certificate per EN 10204 3.1",
  ],
  [
    "Microstructure Review",
    "Metallographic microscope inspection, nodularity percent, pearlite/ferrite ratio",
    "Critical ductile iron grades to ensure spheroidal graphite nodularity",
    "Microstructure micrographs & evaluation",
  ],
  [
    "Non-Destructive Testing (NDT)",
    "Visual (VT), Liquid Penetrant (PT), Magnetic Particle (MT), Ultrasonic (UT), Radiographic (RT)",
    "Pressure-retaining walls, impeller vanes, and critical hydraulic zones",
    "Level I/II certified NDT inspection sheets",
  ],
  [
    "Dimensional Metrology",
    "Precision CMM, 3D blue laser optical scanning",
    "Critical machining datums, wall thickness, flange bolt circles, runner profiles",
    "Full CMM dimensional report & CAD deviation color map",
  ],
  [
    "Pressure & Hydrostatic",
    "Hydrostatic pressure testing up to 100 bar, helium leak testing",
    "100% of pressure-bearing casings and hydraulic assemblies",
    "Calibrated hydrostatic pressure test certificate",
  ],
];
const finishing = [
  "SHAKE OUT",
  "SHOT BLASTING",
  "FETTLING",
  "GRINDING",
  "EXTERNAL PROCESSING",
  "SURFACE FINISHING",
];
function FoundryCarousel({
  children,
  label,
  kind,
}: {
  children: ReactNode[];
  label: string;
  kind: "routes" | "finishing";
}) {
  const reduced = useReducedMotion() ?? false;
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const compactQuery =
    kind === "routes" ? "(max-width: 767px)" : "(max-width: 1199px)";
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const compact = matchMedia(compactQuery);
    const update = () => {
      if (!compact.matches) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max < 1) {
        setActive(0);
        return;
      }
      if (track.scrollLeft >= max - 2) {
        setActive(children.length - 1);
        return;
      }
      const cards = Array.from(track.children) as HTMLElement[];
      const origin = cards[0]?.offsetLeft ?? 0;
      let closest = 0;
      cards.forEach((card, index) => {
        if (
          Math.abs(card.offsetLeft - origin - track.scrollLeft) <
          Math.abs(cards[closest].offsetLeft - origin - track.scrollLeft)
        )
          closest = index;
      });
      setActive(closest);
    };
    const resize = new ResizeObserver(() => {
      if (!compact.matches) track.scrollLeft = 0;
      update();
    });
    resize.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [children.length, compactQuery]);
  const goTo = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !card || !first) return;
    track.scrollTo({
      left: card.offsetLeft - first.offsetLeft,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <div
      className={
        kind === "routes"
          ? "order-3 min-w-0 min-[768px]:col-span-2 min-[1200px]:order-none min-[1200px]:mt-[calc(110*var(--foundry-unit))]"
          : "mt-20 min-w-0 min-[1200px]:mt-[calc(80*var(--foundry-unit))]"
      }
    >
      <div
        ref={trackRef}
        id={trackId}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-active={active}
        onKeyDown={(event) => {
          if (!matchMedia(compactQuery).matches) return;
          const next =
            event.key === "ArrowRight"
              ? Math.min(children.length - 1, active + 1)
              : event.key === "ArrowLeft"
                ? Math.max(0, active - 1)
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? children.length - 1
                    : null;
          if (next !== null) {
            event.preventDefault();
            goTo(next);
          }
        }}
        className={`relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E30A17] ${kind === "routes" ? "min-[768px]:grid min-[768px]:grid-cols-2 min-[768px]:overflow-visible min-[768px]:pb-0" : "px-4 [scroll-padding-inline:16px] min-[1200px]:px-0 min-[1200px]:grid min-[1200px]:grid-cols-6 min-[1200px]:gap-[calc(12*var(--foundry-unit))] min-[1200px]:overflow-visible min-[1200px]:pb-0"}`}
      >
        {children.map((child, index) => (
          <motion.div
            {...reveal(
              index % 3 === 0 ? "left" : index % 3 === 2 ? "right" : "up",
              Math.min(index * 0.06, 0.24),
              reduced,
            )}
            key={index}
            className={`min-w-0 shrink-0 snap-start ${kind === "routes" ? "basis-[85%] min-[768px]:basis-auto" : "basis-[55%] min-[768px]:basis-[32%] min-[1200px]:basis-auto"}`}
          >
            {child}
          </motion.div>
        ))}
      </div>
      <div
        className={`flex justify-center ${kind === "routes" ? "mt-2 min-[768px]:hidden" : "mt-4 min-[1200px]:hidden"}`}
      >
        {children.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`${label}: show card ${index + 1}`}
            aria-controls={trackId}
            aria-pressed={active === index}
            onClick={() => goTo(index)}
            className={`flex min-h-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white ${kind === "finishing" ? (active === index ? "w-9" : "w-3.5") : "w-8"}`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none ${active === index ? "w-6 bg-[#E30A17]" : "w-1.5 bg-white/70"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
function FoundryVideo({
  src,
  className,
  label,
}: {
  src: string;
  className: string;
  label?: string;
}) {
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
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <source
        src={src}
        type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
      />
    </video>
  );
}
function SectionTitle({
  children,
  description,
  eyebrow,
  titleClassName = "",
  revealParts,
}: {
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  titleClassName?: string;
  revealParts?: RevealPart[];
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      {...reveal("up", 0, reduced)}
      className="mx-auto max-w-[760px] text-center min-[1200px]:max-w-[calc(883*var(--foundry-unit))]"
    >
      {eyebrow && (
        <p
          className={`${body} mx-auto mt-0 mb-4 max-w-[88%] text-[#BABACA] min-[768px]:max-w-none`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`${heading} ${revealParts ? "" : redText} mx-auto max-w-[92%] min-[768px]:max-w-none ${titleClassName}`}
      >
        {revealParts ? <ScrollColorText parts={revealParts} /> : children}
      </h2>
      {description && (
        <p
          className={`${body} ${revealParts ? "" : descriptionText} mx-auto mt-5 mb-0 max-w-[82%] min-[768px]:max-w-[68ch] min-[1200px]:mt-[calc(18*var(--foundry-unit))]`}
        >
          {revealParts ? (
            <ScrollColorText
              parts={[{ text: description, tone: "description" }]}
            />
          ) : (
            description
          )}
        </p>
      )}
    </motion.div>
  );
}
function AlloyComparisonChart({
  parameter,
}: {
  parameter: (typeof parameters)[number];
}) {
  const id = useId().replaceAll(":", "");
  const reduced = useReducedMotion() ?? false;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, {
    amount: 0.28,
    margin: "0px 0px -8% 0px",
    once: true,
  });
  const settings = alloyChartSettings[parameter];
  const baseline = 380;
  const plotHeight = 340;
  const yFor = (value: number) =>
    baseline - (value / settings.max) * plotHeight;
  const readAlloy = (alloy: (typeof alloys)[number]) => {
    if (parameter === "Tensile (Rm)") {
      return {
        value: alloy.tensile,
        rangeEnd: null,
        label: `${alloy.tensile}`,
      };
    }
    if (parameter === "Yield (Rp0.2)") {
      return {
        value: alloy.yield,
        rangeEnd: null,
        label: alloy.yield === null ? "N/A" : `${alloy.yield}`,
      };
    }
    if (parameter === "Elongation (A5)") {
      return {
        value: alloy.elongation,
        rangeEnd: null,
        label: alloy.elongation === null ? "N/A" : `${alloy.elongation}`,
      };
    }
    return {
      value: alloy.hardness.min,
      rangeEnd: alloy.hardness.max,
      label:
        alloy.hardness.max === null
          ? `≥${alloy.hardness.min}`
          : `${alloy.hardness.min}–${alloy.hardness.max}`,
    };
  };

  return (
    <div
      ref={chartRef}
      tabIndex={0}
      role="img"
      aria-label={`${settings.title} comparison in ${settings.unit}: ${alloys.map((alloy) => `${alloy.name} ${readAlloy(alloy).label}`).join("; ")}. N/A indicates no comparable grade value.`}
      className="overflow-x-auto overscroll-x-contain pb-2 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#E30A17]"
    >
      <svg
        viewBox="0 0 1200 445"
        preserveAspectRatio="none"
        className="block h-[clamp(400px,123vw,520px)] w-full min-w-[1000px] min-[768px]:h-auto min-[768px]:min-w-[850px] min-[1200px]:min-w-[650px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#E30A17" />
            <stop offset="1" stopColor="#27272A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from(
          { length: 5 },
          (_, index) => (settings.max / 4) * index,
        ).map((tick) => (
          <g key={tick}>
            <text
              x="44"
              y={yFor(tick) - 5}
              fill="#F7F7F7"
              fontSize="14"
              textAnchor="end"
            >
              {tick}
            </text>
            <text
              x="44"
              y={yFor(tick) + 8}
              fill="#BABACA"
              fontSize="9"
              textAnchor="end"
            >
              {settings.unit}
            </text>
            <line
              x1="65"
              x2="1190"
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="#9EB7D0"
              strokeWidth="1"
              strokeDasharray={tick ? "3 4" : undefined}
              opacity=".65"
            />
          </g>
        ))}
        <g>
          {alloys.map((alloy, index) => {
            const reading = readAlloy(alloy);
            const barTop = yFor(reading.value ?? 0);
            const barHeight = baseline - barTop;
            const rangeTop = yFor(reading.rangeEnd ?? reading.value ?? 0);
            const active = reduced || chartInView;
            const delay = reduced ? 0 : index * 0.09;
            const barX = 108 + index * 155;
            const centerX = barX + 27;
            return (
              <g key={alloy.name}>
                {reading.value !== null ? (
                  <>
                    <motion.rect
                      x={barX}
                      width="54"
                      rx="6"
                      fill={`url(#${id})`}
                      initial={false}
                      animate={{
                        y: active ? barTop : baseline,
                        height: active ? barHeight : 0,
                        opacity: active ? 1 : 0,
                      }}
                      transition={{
                        duration: reduced ? 0 : 1.08,
                        delay,
                        ease: [0.16, 0.8, 0.2, 1],
                      }}
                    />
                    {reading.rangeEnd !== null && (
                      <motion.rect
                        x={barX}
                        width="54"
                        rx="3"
                        fill="#F97316"
                        fillOpacity="0.25"
                        stroke="#FB923C"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        initial={false}
                        animate={{
                          y: active ? rangeTop : barTop,
                          height: active ? barTop - rangeTop : 0,
                          opacity: active ? 1 : 0,
                        }}
                        transition={{
                          duration: reduced ? 0 : 0.9,
                          delay: reduced ? 0 : delay + 0.14,
                          ease: [0.16, 0.8, 0.2, 1],
                        }}
                      />
                    )}
                  </>
                ) : (
                  <line
                    x1={barX + 10}
                    x2={barX + 44}
                    y1="380"
                    y2="380"
                    stroke="#BABACA"
                    strokeDasharray="3 4"
                    strokeWidth="2"
                  />
                )}
                <motion.text
                  x={centerX}
                  fill={reading.value === null ? "#BABACA" : "#F7F7F7"}
                  fontSize={parameter === "Hardness (HB)" ? "12" : "14"}
                  fontWeight="600"
                  textAnchor="middle"
                  initial={false}
                  animate={{
                    opacity: active ? 1 : 0,
                    y: active
                      ? reading.value === null
                        ? 358
                        : rangeTop - 12
                      : 365,
                  }}
                  transition={{
                    duration: reduced ? 0 : 0.65,
                    delay: reduced ? 0 : delay + 0.32,
                  }}
                >
                  {reading.label}
                </motion.text>
                <text
                  x={centerX}
                  y="412"
                  fill="#BABACA"
                  fontSize="10"
                  className="max-[767px]:text-[12px]"
                  textAnchor="middle"
                >
                  {alloy.name}
                </text>
                <title>{`${alloy.name}: ${reading.label} ${settings.unit}`}</title>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
function EngineeringAnalytics() {
  const reduced = useReducedMotion() ?? false;
  const [tab, setTab] = useState(0);
  const [parameter, setParameter] =
    useState<(typeof parameters)[number]>("Tensile (Rm)");
  const [costs, setCosts] = useState({
    tooling: "",
    conventional: "",
    printed: "",
  });
  const tabId = useId();
  const difference = Number(costs.printed) - Number(costs.conventional);
  const breakEven =
    costs.tooling &&
    costs.conventional &&
    costs.printed &&
    Number(costs.tooling) > 0 &&
    difference > 0
      ? Math.ceil(Number(costs.tooling) / difference)
      : null;
  return (
    <section
      id="foundry-analytics"
      className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}
    >
      <SectionTitle
        description="Comparative mechanical properties, additive tooling breakeven economics, induction furnace thermal control, and laser metrology tolerance curves."
        revealParts={[
          { text: "Foundry Engineering &", tone: "red" },
          { text: "Process Analytics.", tone: "red", breakBefore: "always" },
        ]}
      >
        Foundry Engineering &amp;
        <br />
        Process Analytics.
      </SectionTitle>
      {/* The selector and its statistics panel enter as one coordinated sequence. */}
      <motion.div
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.08, margin: "0px 0px -10% 0px" }}
        variants={{
          hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: reduced ? 0 : 0.82,
              ease: [0.25, 0.85, 0.3, 1],
              staggerChildren: reduced ? 0 : 0.16,
              delayChildren: reduced ? 0 : 0.08,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: reduced ? 0 : 0.66 },
            },
          }}
          role="tablist"
          aria-label="Engineering analysis"
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowDown" || event.key === "ArrowRight"
                ? (tab + 1) % analysisTabs.length
                : event.key === "ArrowUp" || event.key === "ArrowLeft"
                  ? (tab + analysisTabs.length - 1) % analysisTabs.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? analysisTabs.length - 1
                      : null;
            if (next !== null) {
              event.preventDefault();
              setTab(next);
              event.currentTarget
                .querySelectorAll<HTMLButtonElement>('[role="tab"]')
                [next]?.focus();
            }
          }}
          className="mx-auto mt-8 flex w-full max-w-[440px] flex-col gap-2 rounded-2xl border border-white/5 bg-black/65 p-4 min-[768px]:w-fit min-[768px]:max-w-full min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:justify-center min-[1200px]:gap-1 min-[1200px]:bg-black/25 min-[1200px]:p-3 shadow-[0_5px_25px_rgba(0,0,0,.6)] min-[1200px]:mt-[calc(50*var(--foundry-unit))]"
        >
          {analysisTabs.map(({ label, Icon }, index) => (
            <button
              key={label}
              id={`${tabId}-tab-${index}`}
              role="tab"
              aria-selected={tab === index}
              aria-controls={`${tabId}-panel`}
              onClick={() => setTab(index)}
              className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${tab === index ? "border-white/50 bg-[#E30A17]" : "border-transparent hover:bg-white/10"}`}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span
                className={`${small} ${tab === index ? "font-bold text-white" : "text-white/65"}`}
              >
                {label}
              </span>
            </button>
          ))}
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: reduced ? 0 : 0.78,
                ease: [0.25, 0.85, 0.3, 1],
              },
            },
          }}
          id={`${tabId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabId}-tab-${tab}`}
          className="mt-12 min-[1200px]:mt-[calc(130*var(--foundry-unit))]"
        >
          {/* Keep the chart mounted when switching tabs so its in-view animation state survives. */}
          <div hidden={tab !== 0} aria-hidden={tab !== 0}>
            <div className="flex flex-col justify-between gap-8 min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:border-b min-[1200px]:border-white/60 min-[1200px]:pb-7">
              <div className="min-w-0 border-b border-white/60 pb-7 text-center min-[768px]:text-left min-[1200px]:border-0 min-[1200px]:pb-0">
                <h3 className="m-0 flex flex-col items-center gap-2 min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:gap-3 text-[clamp(25px,7.7vw,32px)] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(36*var(--foundry-unit))]">
                  {alloyChartSettings[parameter].title}
                  <span className="rounded border border-white/25 bg-[#E30A17] px-2 py-1 text-[12px] font-bold">
                    {alloyChartSettings[parameter].unit}
                  </span>
                </h3>
                <p className={`${body} mt-2 mb-0 text-white/70`}>
                  {alloyChartSettings[parameter].description}
                </p>
              </div>
              <div
                role="group"
                aria-label="Material parameter"
                className="mx-auto grid w-full max-w-[330px] grid-cols-2 items-center gap-2 min-[768px]:flex min-[768px]:w-auto min-[768px]:max-w-none min-[768px]:flex-wrap min-[768px]:justify-start min-[1200px]:mx-0"
              >
                <span
                  className={`${body} col-span-2 w-full text-center min-[768px]:w-auto min-[768px]:text-left`}
                >
                  Parameter:
                </span>
                {parameters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={parameter === item}
                    onClick={() => setParameter(item)}
                    className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${parameter === item ? "bg-[#E30A17]" : "bg-[#F7F7F7]"}`}
                  >
                    <span
                      className={`${body} ${parameter === item ? "text-white" : "text-[#A1A1A1]"}`}
                    >
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <figure className="mt-6">
              <AlloyComparisonChart parameter={parameter} />
              <figcaption className="mt-3 text-center text-[12px] leading-relaxed text-white/50 min-[768px]:text-left">
                {parameter === "Hardness (HB)" && (
                  <span className="mb-1 block text-[#FDBA74]">
                    Solid bar: published lower bound · Orange extension:
                    reported hardness range · ≥: minimum only.
                  </span>
                )}
                Grade-level reference data for comparison only. Actual results
                vary by casting process and inspection scope; confirm against
                the applicable material standard and test certificate. N/A means
                no directly comparable grade value is specified.
              </figcaption>
            </figure>
            <motion.div
              initial={reduced ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: false, amount: 0.24 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduced ? 0 : 0.12 },
                },
              }}
              className="mt-8 grid gap-4 min-[768px]:grid-cols-3"
            >
              {[
                "EN-GJL-250 (GG25):",
                "EN-GJS-400/500/600:",
                "CuAl10 & Duplex 2205:",
              ].map((label, i) => (
                <motion.div
                  variants={{
                    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 26 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: reduced ? 0 : 0.72,
                        ease: [0.25, 0.85, 0.3, 1],
                      },
                    },
                  }}
                  key={label}
                  className={`min-h-[96px] rounded-xl border border-white/60 p-4 ${i === 1 ? "bg-[#E30A17]" : "bg-[#F7F7F7]"}`}
                >
                  <h4
                    className={`${small} m-0 font-semibold ${i === 1 ? "text-white" : "text-[#E30A17]"}`}
                  >
                    {label}
                  </h4>
                  <p
                    className={`${body} mt-2 mb-0 ${i === 1 ? "text-white" : "text-[#27272A]"}`}
                  >
                    {i === 0
                      ? "Superior vibration damping and low resonant transmission for standard volute bodies."
                      : i === 1
                        ? "Spheroidal graphite iron reaching up to 600 MPa tensile and 15% elongation for pressure casings."
                        : "Corrosion, cavitation, and brine resistance for reverse osmosis and marine systems."}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
          {tab !== 0 && (
            <motion.div
              key={`engineering-tab-${tab}`}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0 : 0.6,
                ease: [0.25, 0.85, 0.3, 1],
              }}
            >
              {tab === 1 && (
                <div className="grid gap-8 rounded-2xl border border-white/15 bg-white/5 p-7 min-[768px]:grid-cols-2">
                  <div>
                    <h3 className={`${heading} ${redText}`}>
                      Melting Thermal Cycle
                    </h3>
                    <p className={`${body} mt-5 text-white/65`}>
                      Sempa Foundry Bay 1 · induction melting
                    </p>
                    <p className="my-8 text-[64px] leading-none">
                      45 <span className="text-[22px] text-white/60">min</span>
                    </p>
                    <p className={body}>Published melt cycle</p>
                  </div>
                  <div className="flex flex-col justify-center gap-6">
                    <div className={`${glass} rounded-xl p-6`}>
                      <p className={`${small} mt-0 text-white/60`}>
                        INDUCTION FURNACES
                      </p>
                      <p className="m-0 text-[26px] leading-tight">
                        2 × 2,000 kg
                        <br />+ 1 × 500 kg
                      </p>
                    </div>
                    <p className={`${body} text-white/65`}>
                      Thermal records and heat-lot documentation are included in
                      the agreed inspection and release package.
                    </p>
                  </div>
                </div>
              )}
              {tab === 2 && (
                <div className="rounded-2xl border border-white/15 bg-white/5 p-7">
                  <h3 className={`${heading} ${redText}`}>
                    Sand &amp; Ecology
                  </h3>
                  <p className="my-10 text-[80px] leading-none text-[#00FF26]">
                    95%
                  </p>
                  <p className={body}>Sand reclamation</p>
                  <div
                    role="meter"
                    aria-label="Sand reclamation"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={95}
                    className="mt-8 h-5 overflow-hidden rounded-full bg-white/10"
                  >
                    <div className="h-full w-[95%] rounded-full bg-linear-to-r from-[#E30A17] to-[#00B954]" />
                  </div>
                </div>
              )}
              {tab === 3 && (
                <div className="grid gap-8 rounded-2xl border border-white/15 bg-white/5 p-7 min-[768px]:grid-cols-2">
                  <div>
                    <h3 className={`${heading} ${redText}`}>
                      3D Print Breakeven
                    </h3>
                    <p className={`${body} mt-6 text-white/65`}>
                      Compare conventional pattern tooling with printed sand
                      molds using your project costs in the same currency.
                    </p>
                    <p className={`${small} mt-6 text-white/60`}>
                      Breakeven quantity = tooling cost ÷ (printed cost per
                      casting − conventional cost per casting).
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {(
                      [
                        { key: "tooling", label: "Conventional tooling cost" },
                        {
                          key: "conventional",
                          label: "Conventional cost per casting",
                        },
                        { key: "printed", label: "Printed cost per casting" },
                      ] as const
                    ).map((item) => (
                      <label
                        key={item.key}
                        className={`${body} flex flex-col gap-2`}
                      >
                        {item.label}
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={costs[item.key]}
                          onChange={(event) =>
                            setCosts((current) => ({
                              ...current,
                              [item.key]: event.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-white/25 bg-black/30 px-4 py-3 outline-none focus:border-[#E30A17]"
                        />
                      </label>
                    ))}
                    <output
                      aria-live="polite"
                      className="rounded-xl bg-[#E30A17]/20 p-5 text-[20px]"
                    >
                      {breakEven
                        ? `${breakEven.toLocaleString()} castings`
                        : "Enter your project costs to compare."}
                    </output>
                    {costs.printed && costs.conventional && difference <= 0 && (
                      <p className={`${small} m-0 text-white/65`}>
                        At these inputs, printing has no higher per-casting
                        cost; there is no finite crossover quantity.
                      </p>
                    )}
                  </div>
                </div>
              )}
              {tab === 4 && (
                <div className="grid gap-8 rounded-2xl border border-white/15 bg-white/5 p-7 min-[768px]:grid-cols-2">
                  <div>
                    <h3 className={`${heading} ${redText}`}>
                      Metrology Deviation
                    </h3>
                    <p className={`${body} mt-6 text-white/65`}>
                      CAD-to-part color deviation analysis and dimensional
                      verification of casting stock allowances and critical wall
                      thicknesses.
                    </p>
                    <p className="my-8 text-[54px] leading-none">
                      0.020{" "}
                      <span className="text-[22px] text-white/60">mm</span>
                    </p>
                    <p className={small}>
                      Optical scanning accuracy with photogrammetry grid
                    </p>
                  </div>
                  <div className="relative min-h-[240px] overflow-hidden rounded-xl">
                    <Image
                      src={asset("image.webp")}
                      alt="Optical dimensional inspection"
                      fill
                      sizes="(min-width:768px) 40vw, 85vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
export default function FoundryPage() {
  const reduced = useReducedMotion() ?? false;
  const [materialRoute, setMaterialRoute] = useState<"in-house" | "partner">(
    "in-house",
  );
  const [castingFilter, setCastingFilter] =
    useState<(typeof castingFilters)[number]>("All Castings");
  const materials =
    materialRoute === "in-house" ? inHouseMaterials : partnerMaterials;
  return (
    <main
      data-foundry-page
      className="relative isolate w-full overflow-x-clip bg-[#111011] text-[#F7F7F7] before:pointer-events-none before:absolute before:inset-x-0 before:-top-[200px] before:-z-10 before:h-[200px] before:bg-[#111011] before:content-[''] [--foundry-unit:1px] min-[1200px]:[--foundry-unit:clamp(0.833333px,0.0694444444vw,1.777778px)] [font-family:var(--font-sf-pro),_sans-serif]! [font-weight:410]! [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [background-image:linear-gradient(140deg,#100D0D_0%,#151213_52%,#363335_100%)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <FoundryVideo
          src={asset("fire_bp1.webm")}
          className="sticky top-0 h-svh w-full object-cover opacity-25 mix-blend-screen"
        />
      </div>
      <div className="relative">
        <section
          aria-labelledby="foundry-hero-title"
          data-foundry-hero
          className="relative pb-16 min-[1200px]:min-h-[calc(900*var(--foundry-unit))] min-[1200px]:pb-[calc(65*var(--foundry-unit))]"
        >
          <style>{`
            /* MOLTEN TYPOGRAPHY — molten lava gathers into the letterforms. */
            .foundry-molten-heading { --molten-cycle: 8.6s; }

            .foundry-molten-final,
            .foundry-molten-liquid,
            .foundry-molten-meniscus {
              -webkit-text-fill-color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
            }

            .foundry-molten-final {
              display: block;
              padding-bottom: .22em;
              color: #e8eff2;
              background-image: linear-gradient(
                165deg,
                #f5f7f8 0%, #aab7bf 18%, #fcffff 38%,
                #778891 56%, #e5ecee 76%, #bcc8cd 100%
              );
              opacity: 0;
              /* Solidifies only once; the next lava cycles pour over this text. */
              animation: foundry-molten-solidify var(--molten-cycle) linear forwards;
            }

            .foundry-molten-liquid,
            .foundry-molten-meniscus {
              position: absolute;
              inset: 0;
              display: block;
              color: transparent;
              pointer-events: none;
            }

            /* Dense molten metal: hot cores, orange currents and dark crust. */
            .foundry-molten-liquid {
              background-image:
                radial-gradient(ellipse at 18% 26%, rgba(255,246,179,.98) 0%, rgba(255,160,34,.75) 12%, transparent 29%),
                radial-gradient(ellipse at 74% 72%, rgba(255,215,95,.96) 0%, rgba(242,77,12,.7) 18%, transparent 36%),
                radial-gradient(ellipse at 47% 56%, rgba(74,5,7,.9) 0%, transparent 26%),
                radial-gradient(ellipse at 88% 18%, rgba(80,4,5,.82) 0%, transparent 21%),
                radial-gradient(ellipse at 12% 90%, rgba(105,9,7,.8) 0%, transparent 24%),
                linear-gradient(
                  139deg,
                  #550706 0%, #d82b08 22%, #ff901b 45%,
                  #9f1308 65%, #f85c13 84%, #610708 100%
                );
              background-size: 155% 145%;
              animation:
                foundry-molten-fill var(--molten-cycle) cubic-bezier(.22,.69,.31,1) infinite,
                foundry-molten-flow var(--molten-cycle) ease-in-out infinite;
            }

            /* A narrow white-hot edge; avoid thick, rope-like liquid strips. */
            .foundry-molten-meniscus {
              background-image: linear-gradient(
                112deg,
                #ef4d10 0%, #ffeaa0 16%, #e9440d 31%,
                #fff4b6 52%, #f77917 74%, #ffdc6e 100%
              );
              background-size: 145% 100%;
              animation: foundry-molten-edge var(--molten-cycle) cubic-bezier(.22,.69,.31,1) infinite;
            }

            .foundry-molten-droplets {
              position: absolute;
              inset: 0;
              z-index: 1;
              overflow: hidden;
              pointer-events: none;
            }

            .foundry-molten-droplet {
              position: absolute;
              top: -14%;
              left: var(--drop-x);
              width: var(--drop-size);
              aspect-ratio: 1;
              border-radius: 49% 47% 54% 52%;
              background: radial-gradient(
                circle at 32% 27%,
                #fff1b2 0%, #ffda51 18%, #ff8719 45%,
                #d3380a 73%, #690906 100%
              );
              box-shadow:
                inset -1px -2px 2px rgba(65,5,3,.6),
                0 0 4px rgba(255,139,25,.53),
                0 0 9px rgba(229,53,9,.17);
              opacity: 0;
              animation: foundry-molten-drop var(--molten-cycle)
                cubic-bezier(.27,.02,.51,.99) var(--drop-delay) infinite;
            }

            .foundry-molten-droplet::before {
              position: absolute;
              content: "";
              left: 35%;
              bottom: 91%;
              width: 28%;
              height: 70%;
              border-radius: 80% 80% 20% 20%;
              background: linear-gradient(to top, rgba(255,148,36,.7), rgba(255,194,82,0));
              opacity: .38;
            }

            .foundry-molten-droplet::after {
              position: absolute;
              content: "";
              left: 36%;
              bottom: 171%;
              width: 24%;
              aspect-ratio: 1;
              border-radius: 50%;
              background: #ffbe49;
              box-shadow: 0 0 3px rgba(255,137,36,.42);
              opacity: .42;
            }

            /* Four small flames are anchored to actual word corners. */
            .foundry-molten-spark-anchors {
              position: absolute;
              inset: 0;
              z-index: 2;
              display: block;
              color: transparent;
              -webkit-text-fill-color: transparent;
              pointer-events: none;
            }

            .foundry-molten-burst {
              position: absolute;
              display: block;
              width: clamp(11px, .23em, 19px);
              height: clamp(14px, .34em, 28px);
              transform-origin: 50% 90%;
              opacity: 0;
              animation: foundry-molten-burst var(--molten-cycle)
                linear var(--flare-delay) infinite;
            }

            .foundry-molten-burst-engineered { top: -12%; right: 1%; }
            .foundry-molten-burst-castings { top: 0%; left: 4%; }
            .foundry-molten-burst-single { top: -14%; right: 4%; }
            .foundry-molten-burst-accountability { bottom: 0%; right: 7%; }

            .foundry-molten-burst::before,
            .foundry-molten-burst::after {
              position: absolute;
              display: block;
              content: "";
              bottom: 0;
              background: linear-gradient(to top, #b52608 0%, #ff7311 40%, #ffd44c 77%, #fff2a5 100%);
              filter: blur(.35px);
            }

            .foundry-molten-burst::before {
              left: 27%;
              width: 49%;
              height: 100%;
              clip-path: polygon(50% 0%, 77% 29%, 94% 65%, 100% 100%, 0% 100%, 17% 52%);
              transform: rotate(6deg);
            }

            .foundry-molten-burst::after {
              left: 5%;
              width: 43%;
              height: 65%;
              clip-path: polygon(60% 0%, 100% 68%, 90% 100%, 0% 100%, 21% 42%);
              transform: rotate(-18deg);
            }

            .foundry-molten-ember {
              position: absolute;
              z-index: 1;
              width: 3px;
              height: 3px;
              border-radius: 50%;
              background: #ffe794;
              box-shadow: 0 0 5px #ff8d23;
              opacity: 0;
              animation: foundry-molten-ember-flight var(--molten-cycle)
                linear var(--flare-delay) infinite;
            }

            .foundry-molten-ember-left { left: 10%; top: 25%; --spark-x: -12px; --spark-y: -12px; }
            .foundry-molten-ember-top { left: 50%; top: 6%; --spark-x: 2px; --spark-y: -19px; }
            .foundry-molten-ember-right { right: 7%; top: 30%; --spark-x: 13px; --spark-y: -10px; }

            @keyframes foundry-molten-fill {
              0%, 5% {
                clip-path: polygon(
                  0% 0%, 100% 0%, 100% -9%, 88% -12%,
                  75% -8%, 63% -11%, 50% -9%, 38% -12%,
                  25% -8%, 13% -11%, 0% -9%
                );
                opacity: 0;
              }
              12% { opacity: 1; }
              42% {
                clip-path: polygon(
                  0% 0%, 100% 0%, 100% 112%, 88% 109%,
                  75% 113%, 63% 110%, 50% 112%, 38% 109%,
                  25% 113%, 13% 110%, 0% 112%
                );
                opacity: 1;
              }
              47% { opacity: 1; }
              60%, 100% { opacity: 0; }
            }

            @keyframes foundry-molten-edge {
              0%, 5% {
                clip-path: polygon(
                  0% -9%, 13% -11%, 25% -8%, 38% -12%,
                  50% -9%, 63% -11%, 75% -8%, 88% -12%,
                  100% -9%, 100% -6%, 88% -9%, 75% -5%,
                  63% -8%, 50% -6%, 38% -9%, 25% -5%,
                  13% -8%, 0% -6%
                );
                opacity: 0;
              }
              10% { opacity: .95; }
              35% { opacity: .95; }
              42% {
                clip-path: polygon(
                  0% 112%, 13% 110%, 25% 113%, 38% 109%,
                  50% 112%, 63% 110%, 75% 113%, 88% 109%,
                  100% 112%, 100% 115%, 88% 112%, 75% 116%,
                  63% 113%, 50% 115%, 38% 112%, 25% 116%,
                  13% 113%, 0% 115%
                );
                opacity: 0;
              }
              100% { opacity: 0; }
            }

            @keyframes foundry-molten-flow {
              0% { background-position: 100% 0%; }
              31% { background-position: 48% 65%; }
              58%, 100% { background-position: 0% 100%; }
            }

            @keyframes foundry-molten-solidify {
              0%, 46% { opacity: 0; }
              60%, 100% { opacity: 1; }
            }

            @keyframes foundry-molten-drop {
              0%, 2% {
                top: -14%;
                transform: translateX(0) scale(.68, 1);
                opacity: 0;
              }
              5% {
                transform: translateX(1px) scale(.85, 1.08);
                opacity: .95;
              }
              19% {
                top: var(--drop-stop);
                transform: translateX(var(--drop-drift)) scale(.94, 1.16);
                opacity: 1;
              }
              22% {
                top: var(--drop-stop);
                transform: translateX(var(--drop-drift)) scale(1.38, .67);
                opacity: .67;
              }
              29%, 100% {
                top: var(--drop-stop);
                transform: translateX(var(--drop-drift)) scale(.12);
                opacity: 0;
              }
            }

            @keyframes foundry-molten-burst {
              0%, 1% {
                opacity: 0;
                transform: translateY(4px) rotate(-9deg) scale(.2);
              }
              2.6% {
                opacity: .96;
                transform: translateY(0) rotate(5deg) scale(1.14);
              }
              4.6% {
                opacity: .9;
                transform: translateY(-2px) rotate(-5deg) scale(.93);
              }
              8.5%, 100% {
                opacity: 0;
                transform: translateY(-6px) rotate(3deg) scale(.2);
              }
            }

            @keyframes foundry-molten-ember-flight {
              0%, 1% {
                opacity: 0;
                transform: translate(0, 0) scale(.4);
              }
              3% { opacity: .95; }
              8%, 100% {
                opacity: 0;
                transform: translate(var(--spark-x), var(--spark-y)) scale(.18);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .foundry-molten-final { animation: none; opacity: 1; }
              .foundry-molten-liquid,
              .foundry-molten-meniscus,
              .foundry-molten-droplets,
              .foundry-molten-spark-anchors { display: none; animation: none; }
            }
          `}</style>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(480px,140vw,640px)] overflow-hidden min-[768px]:bottom-0 min-[768px]:h-full"
          >
            <Image
              src={asset("dokumhane-hero.webp")}
              alt=""
              fill
              unoptimized
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-[55%_center] opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/35 to-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-[#111011] via-transparent to-transparent" />
            <svg
              viewBox="0 0 1440 1000"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full opacity-15"
            >
              <g fill="none" stroke="#BABACA" strokeWidth="1">
                {Array.from({ length: 50 }, (_, i) => (
                  <path
                    key={i}
                    d={`M-100 ${i * 19} C 350 ${i * 19 + 80}, 600 ${i * 19 + 260}, 1540 ${i * 19 - 90}`}
                  />
                ))}
              </g>
            </svg>
          </div>
          <div
            className={`${frame} relative grid gap-6 pt-[160px] min-[768px]:grid-cols-2 min-[768px]:gap-8 min-[1200px]:grid-cols-[588fr_523fr] min-[1200px]:gap-x-[calc(89*var(--foundry-unit))] min-[1200px]:gap-y-[calc(60*var(--foundry-unit))] min-[1200px]:pt-[calc(200*var(--foundry-unit))]`}
          >
            <div className="contents min-[1200px]:block min-[1200px]:min-w-0">
              <h1
                id="foundry-hero-title"
                className="foundry-molten-heading relative order-1 m-0 min-w-0 self-center text-[clamp(24px,6.4vw,40px)] leading-none tracking-[-0.04em] min-[768px]:text-[clamp(30px,4.5vw,46px)] min-[1200px]:order-none min-[1200px]:text-[calc(80*var(--foundry-unit))]"
              >
                <span className="foundry-molten-final">
                  <FoundryHeroHeadline />
                </span>
                <span aria-hidden="true" className="foundry-molten-liquid">
                  <FoundryHeroHeadline />
                </span>
                <span aria-hidden="true" className="foundry-molten-meniscus">
                  <FoundryHeroHeadline />
                </span>
                <span className="foundry-molten-droplets" aria-hidden="true">
                  {moltenDrops.map((drop, index) => (
                    <span
                      key={index}
                      className="foundry-molten-droplet"
                      style={
                        {
                          "--drop-x": drop.x,
                          "--drop-stop": drop.stop,
                          "--drop-delay": drop.delay,
                          "--drop-drift": drop.drift,
                          "--drop-size": drop.size,
                        } as CSSProperties
                      }
                    />
                  ))}
                </span>
                <span
                  className="foundry-molten-spark-anchors"
                  aria-hidden="true"
                >
                  <FoundryHeroHeadline sparks />
                </span>
              </h1>
              <FoundryCarousel kind="routes" label="Foundry production routes">
                {[
                  {
                    title: "In-House Foundry Route",
                    text: "Grey iron, ductile iron (nodular), and bronze melted and cast directly in Sempa’s own induction furnaces.",
                    Icon: LuFactory,
                  },
                  {
                    title: "Special-Alloy Route",
                    text: "Stainless steel, duplex & superalloys sourced via pre-approved partners and fully inspected & machined by Sempa.",
                    Icon: LuShieldCheck,
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className={`${heroGlass} h-full rounded-[15px] p-4 min-[1200px]:p-[calc(19*var(--foundry-unit))]`}
                  >
                    <h2 className="m-0 flex items-center gap-3 text-[19px] leading-[1.07] tracking-[-0.04em] min-[1200px]:text-[calc(20*var(--foundry-unit))]">
                      <span className="flex size-9 shrink-0 -rotate-6 items-center justify-center rounded-lg border border-white/10 bg-linear-to-br from-[#E30A17] to-[#7D060D]">
                        <item.Icon
                          aria-hidden="true"
                          className="size-5 rotate-6"
                        />
                      </span>
                      {item.title}
                    </h2>
                    <p className={`${small} mt-3 mb-0 text-[#9EB7D0]`}>
                      {item.text}
                    </p>
                  </article>
                ))}
              </FoundryCarousel>
            </div>
            <motion.div
              {...reveal("right", 0.12, reduced)}
              className="relative order-2 min-w-0 pt-8 min-[1200px]:order-none min-[1200px]:pt-[calc(30*var(--foundry-unit))]"
            >
              <div className="relative aspect-[523/450] overflow-hidden rounded-[24px] min-[1200px]:aspect-[523/544] min-[1200px]:rounded-[calc(30*var(--foundry-unit))] border-2 border-white/65">
                <Image
                  src={asset("DSC05461.webp")}
                  alt="Sempa foundry team pouring molten metal from an induction furnace"
                  fill
                  unoptimized
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width:1200px) 38vw, 85vw"
                  className="object-cover object-[75%_center]"
                />
              </div>
              <div
                className={`${heroGlass} absolute top-0 left-1/2 flex w-max max-w-full -translate-x-1/2 items-center gap-2 rounded-[15px] px-3 py-2 min-[1200px]:left-0 min-[1200px]:w-auto min-[1200px]:translate-x-0 min-[1200px]:gap-3 min-[1200px]:px-4 min-[1200px]:py-3`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#E30A17] to-[#7D060D] text-[16px] min-[1200px]:size-10 min-[1200px]:text-[20px]">
                  4T
                </span>
                <div>
                  <p className="m-0 text-[9px] leading-tight">
                    Max Casting Piece
                  </p>
                  <p className={`${small} mt-1 mb-0 font-semibold`}>
                    4,000 kg / 8,820 lb
                  </p>
                </div>
              </div>
              <div
                className={`${heroGlass} absolute bottom-4 left-3 right-3 rounded-[15px] p-3 min-[1200px]:top-[15%] min-[1200px]:bottom-auto min-[1200px]:right-auto min-[1200px]:max-w-[95%] min-[1200px]:p-4 min-[1200px]:-left-[calc(35*var(--foundry-unit))]`}
              >
                <div className="flex flex-wrap justify-between gap-3 text-[9px] leading-none">
                  <span>SEMPA FOUNDRY BAY 1</span>
                  <span className="text-[#9EB7D0]">132,000 m² FACILITY</span>
                </div>
                <p className={`${small} mt-3 mb-0`}>
                  2 × 2,000 kg + 1 × 500 kg Induction Furnaces ·<br />
                  45 min Melt Cycle
                </p>
              </div>
            </motion.div>
            <motion.p
              {...reveal("up", 0.08, reduced)}
              className={`${body} order-4 m-0 max-w-[48ch] self-start min-[1200px]:order-none`}
            >
              Sempa operates its own modern foundry in Konya, producing grey
              cast iron, ductile iron, and selected bronze castings with
              complete single-interface coordination. From 3D CAD drawing
              review, additive 3D sand printing, to CNC precision machining and
              full documented release.
            </motion.p>
            <div className="order-5 grid grid-cols-2 gap-3 min-[1200px]:order-none min-[1200px]:grid-cols-4">
              {capacity.map((item, index) => (
                <motion.article
                  {...reveal(
                    index % 2 ? "right" : "left",
                    index * 0.06,
                    reduced,
                  )}
                  key={item.label}
                  className={`${heroGlass} max-[767px]:bg-white/15 min-h-[160px] min-w-0 rounded-[15px] p-5 min-[1200px]:min-h-0 min-[1200px]:p-[calc(15*var(--foundry-unit))]`}
                >
                  <p className={`${body} ${item.color} m-0 font-semibold`}>
                    {item.value}
                  </p>
                  <h3 className="mt-3 mb-0 text-[10px] leading-none min-[1200px]:text-[calc(10*var(--foundry-unit))]">
                    {item.label}
                  </h3>
                  <p className={`${small} mt-3 mb-0`}>{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Production routing envelope"
          className={`${frame} pt-20 min-[1200px]:pt-[calc(120*var(--foundry-unit))]`}
        >
          <SectionTitle
            eyebrow="A clear operating envelope for faster sourcing decisions."
            revealParts={[
              {
                text: "Published Sempa production data provides the initial routing envelope.",
                tone: "white",
              },
              {
                text: "Final feasibility depends on geometry, alloy grade, annual demand",
                tone: "red",
                spaceBefore: true,
              },
              {
                text: "profile, and inspection",
                tone: "red",
                breakBefore: "mobile",
              },
              { text: "scope.", tone: "red", breakBefore: "mobile" },
            ]}
          >
            <span className="text-[#F7F7F7]">
              Published Sempa production data provides the initial routing
              envelope.
            </span>{" "}
            <span className={redText}>
              Final feasibility depends on geometry, alloy grade, annual demand
              <br className="min-[768px]:hidden" />
              <span className="hidden min-[768px]:inline"> </span>profile, and
              inspection
              <br className="min-[768px]:hidden" />
              <span className="hidden min-[768px]:inline"> </span>scope.
            </span>
          </SectionTitle>
          <motion.div
            {...reveal("up", 0.1, reduced)}
            tabIndex={0}
            role="region"
            aria-label="Molding process capacity table"
            className="mt-12 overflow-x-auto rounded-xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.13)_0%,rgba(125,6,13,0.08)_55%,rgba(0,0,0,0.12)_100%)] backdrop-blur-[12px] shadow-[0_0_45px_rgba(227,10,23,.08)] min-[1200px]:mt-[calc(60*var(--foundry-unit))]"
          >
            <div className="min-w-[1200px] min-[1200px]:min-w-0">
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">
                  Published foundry operating envelopes by molding process
                </caption>
                <thead>
                  <tr>
                    {[
                      "MOLDING PROCESS",
                      "CAST WEIGHT",
                      "MOLD / FLASK ENVELOPE",
                      "NOMINAL RATE",
                      "BEST FIT APPLICATION",
                    ].map((label) => (
                      <th
                        key={label}
                        scope="col"
                        className="px-5 py-6 text-[12px] font-bold [font-variation-settings:'wght'_760,'wdth'_132] leading-tight tracking-[.08em] text-white min-[1200px]:text-[calc(12*var(--foundry-unit))]"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {production.map((row) => (
                    <tr
                      key={row.process}
                      className="border-t border-white/55 align-top first:border-t-0"
                    >
                      <th scope="row" className="px-5 py-10 font-normal">
                        <p className={`${body} ${tableText} m-0`}>
                          {row.process.slice(0, row.process.lastIndexOf(" "))}
                          <br />
                          {row.process.slice(row.process.lastIndexOf(" ") + 1)}
                        </p>
                        <p className={`${small} ${tableText} mt-2 mb-0`}>
                          {row.machine}
                        </p>
                      </th>
                      <td className={`${body} px-5 py-10 font-medium`}>
                        <span className={`block ${tableRedText}`}>
                          {row.weight}
                        </span>
                      </td>
                      <td className={`${small} px-5 py-10`}>
                        <span className={`block ${tableText}`}>
                          {row.envelope}
                        </span>
                      </td>
                      <td className={`${small} px-5 py-10`}>
                        <span className={`block ${tableText}`}>{row.rate}</span>
                      </td>
                      <td className="px-5 py-10">
                        <p className={`${body} ${tableText} m-0`}>{row.fit}</p>
                        <p
                          className={`${tableText} mt-2 mb-0 text-[10px] leading-tight`}
                        >
                          {row.detail}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between gap-16 whitespace-nowrap border-t border-white/40 bg-linear-to-b from-[#E30A17] to-[#7D060D] px-7 py-[14px] text-[12px] leading-tight">
                <span className={tableText}>
                  * Project-specific feasibility confirmed upon 3D CAD and batch
                  analysis review.
                </span>
                <span className={tableText}>
                  ISO 9001:2015 ACCREDITED FOUNDRY
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          aria-label="3D sand printing and optical scanning"
          className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}
        >
          <SectionTitle
            description="Eliminating conventional wooden pattern tooling delays. Directly converting 3D digital CAD into functional silica sand molds and verifying cast geometries with sub-millimeter laser metrology."
            revealParts={[
              { text: "3D Sand Printing &", tone: "red" },
              {
                text: "Optical 3D Scanning.",
                tone: "red",
                breakBefore: "always",
              },
            ]}
          >
            3D Sand Printing &amp;
            <br />
            Optical 3D Scanning.
          </SectionTitle>
          <div className="mx-auto mt-14 grid max-w-[1050px] gap-8 min-[768px]:grid-cols-2 min-[1200px]:mt-[calc(100*var(--foundry-unit))] min-[1200px]:gap-[calc(90*var(--foundry-unit))]">
            {[
              {
                eyebrow: "KOCEL AJS 2500 SYSTEM",
                badge: "NO PATTERN TOOLING",
                title: "Additive 3D Sand Printing",
                text: "Complex hydraulic cores, runner systems, and low-volume prototypes produced directly from CAD data. Drastically compresses lead times from months down to days while enabling undercut geometry impossible with conventional draft angles.",
                points: [
                  "Build Envelope: 2,500 × 1,500 × 1,000 mm",
                  "Shortens prototype cycle by 70% vs wooden tooling",
                  "Zero core shifts in intricate double-curvature pump impellers",
                ],
              },
              {
                eyebrow: "SCANTECH KSCAN-MAGIC II",
                badge: "METROLOGY GRADE",
                title: "Optical 3D Scanning & Inspection",
                text: "Reverse engineering and dimensional inspection of patterns, as-cast surfaces, and fully machined components. CAD-to-part color deviation analysis provides immediate visual verification of casting stock allowances and critical wall thicknesses.",
                points: [
                  "Accuracy down to 0.020 mm with photogrammetry grid",
                  "Shortens prototype cycle by 70% vs wooden tooling",
                  "Zero core shifts in intricate double-curvature pump impellers",
                ],
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={
                  index
                    ? "min-[1200px]:translate-y-[calc(90*var(--foundry-unit))]"
                    : ""
                }
              >
                <motion.article
                  {...reveal(
                    index === 0 ? "left" : "right",
                    index * 0.08,
                    reduced,
                  )}
                  className="flex min-w-0 flex-col gap-8 rounded-[30px] border border-[#E30A17]/15 bg-linear-to-br from-white/15 to-[#7D060D]/5 p-[38px] min-[768px]:p-6 shadow-[0_20px_60px_rgba(227,10,23,.035)] backdrop-blur-[30px] min-[1200px]:p-[calc(38*var(--foundry-unit))]"
                >
                  <div className="flex flex-col gap-2 text-[10px] leading-tight min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:justify-between min-[768px]:gap-3 min-[1200px]:text-[9px]">
                    <span className="text-[#E30A17]">{item.eyebrow}</span>
                    <span className="text-white/70">{item.badge}</span>
                  </div>
                  <h3 className="m-0 text-[20px] leading-[1.07] tracking-[-0.04em] text-[#E30A17] min-[1200px]:text-[calc(20*var(--foundry-unit))]">
                    {item.title}
                  </h3>
                  <p className={`${body} m-0 text-[#BABACA]`}>{item.text}</p>
                  <div className="relative aspect-[414/219] overflow-hidden rounded-[15px]">
                    <Image
                      src={asset("image.webp")}
                      alt={item.title}
                      fill
                      sizes="(min-width:900px) 35vw, 85vw"
                      className="object-cover"
                    />
                  </div>
                  <ul className={`${small} m-0 space-y-3 pl-4 text-[#BABACA]`}>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </motion.article>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Material routes"
          className={`${frame} pt-28 min-[1200px]:pt-[calc(260*var(--foundry-unit))]`}
        >
          <SectionTitle
            description="We state clearly what is cast in-house and what is supplied through Sempa’s approved-partner network. Both routes pass through Sempa’s inspection, machining, and documented acceptance."
            revealParts={[
              { text: "Two material routes.", tone: "red" },
              {
                text: "One Sempa release.",
                tone: "red",
                breakBefore: "always",
              },
            ]}
          >
            Two material routes.
            <br />
            One Sempa release.
          </SectionTitle>
          <motion.div
            {...reveal("up", 0.08, reduced)}
            role="group"
            aria-label="Choose material route"
            className="mt-10 flex flex-col justify-center gap-3 min-[768px]:flex-row min-[1200px]:mt-12 min-[1200px]:gap-4"
          >
            {[
              {
                key: "in-house",
                label: "In-House Route (Grey, Ductile, Bronze)",
              },
              {
                key: "partner",
                label: "Special-Alloy Route (Stainless, Duplex, Superalloys)",
              },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={materialRoute === item.key}
                onClick={() =>
                  setMaterialRoute(item.key as "in-house" | "partner")
                }
                aria-label={item.label}
                className={`max-w-full cursor-pointer rounded-[15px] border px-6 py-4 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${materialRoute === item.key ? "border-[#E30A17]/70 bg-[#E30A17]/15" : "border-white/10 bg-white/15 hover:bg-white/20"}`}
              >
                <span className={`${body} max-[767px]:hidden`}>
                  {item.label}
                </span>
                <span className={`${body} min-[768px]:hidden`}>
                  {item.key === "partner" ? "Special-Alloy Route" : item.label}
                </span>
              </button>
            ))}
          </motion.div>
          <motion.div
            {...reveal("up", 0.12, reduced)}
            className="mt-5 flex flex-col items-center justify-center gap-5 rounded-[10px] border-2 border-[#E30A17] bg-[#E30A17]/15 px-4 py-4 text-center text-[10px] leading-tight min-[768px]:flex-row min-[768px]:justify-between min-[1200px]:mt-10 min-[1200px]:text-[9px]"
          >
            <span>
              ●{" "}
              {materialRoute === "in-house"
                ? "MELTED & CAST IN SEMPA KONYA FOUNDRY"
                : "APPROVED-PARTNER CASTING · SEMPA INSPECTION & MACHINING"}
            </span>
            {materialRoute === "in-house" && (
              <span>2 × 2,000 kg + 1 × 500 kg INDUCTION FURNACES</span>
            )}
          </motion.div>
          <div className="mt-8 grid gap-4 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1200px]:gap-6">
            {materials.map((item, index) => (
              <motion.article
                {...reveal(
                  index === 0 ? "left" : index === 2 ? "right" : "up",
                  index * 0.06,
                  reduced,
                )}
                key={item.name}
                className="flex min-h-[420px] min-w-0 flex-col rounded-[30px] min-[1200px]:rounded-[20px] min-[768px]:max-[1023px]:last:col-span-2 min-[768px]:max-[1023px]:last:w-[calc(50%-8px)] min-[768px]:max-[1023px]:last:justify-self-center border-2 border-[#E30A17]/80 bg-linear-to-br from-[#E30A17]/20 to-black/30 p-8 min-[768px]:p-6 shadow-[0_1px_2px_rgba(227,10,23,.1)] backdrop-blur-[30px] min-[1200px]:min-h-[calc(429*var(--foundry-unit))] min-[1200px]:p-[calc(32*var(--foundry-unit))]"
              >
                <p className="m-0 text-[10px] leading-none text-[#E30A17] min-[1200px]:text-[9px]">
                  GRADE FAMILY 0{index + 1}
                </p>
                <h3 className="mt-5 mb-0 text-[21px] leading-[1.07] tracking-[-0.04em] min-[1200px]:text-[calc(20*var(--foundry-unit))]">
                  {item.name}
                </h3>
                <p
                  className={`${small} mt-6 mb-5 rounded-xl border border-white/40 bg-linear-to-b from-[#E30A17] to-[#7D060D] p-4`}
                >
                  {item.standard}
                </p>
                <p className={`${body} mt-0 mb-8`}>{item.description}</p>
                <ul className="mt-auto mb-0 space-y-4 border-t border-white/50 pt-4 pl-0">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className={`${small} flex list-none items-start gap-2 text-white`}
                    >
                      <LuCheck
                        aria-hidden="true"
                        className="size-4 shrink-0 text-[#059669]"
                      />
                      <span className={tableText}>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          aria-label="Integrated machining and release"
          className="relative isolate hidden pt-24 min-[768px]:block min-[1200px]:pt-[calc(140*var(--foundry-unit))]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[25%] -bottom-24 -z-10 overflow-hidden min-[1200px]:-bottom-[calc(120*var(--foundry-unit))]"
          >
            <FoundryVideo
              src={asset("fire_bp2.webm")}
              className="h-full w-full object-cover object-bottom opacity-40 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
            />
          </div>
          <div
            className={`${frame} grid items-start gap-8 min-[768px]:grid-cols-2 min-[1200px]:gap-12`}
          >
            <motion.div
              {...reveal("left", 0, reduced)}
              className="relative aspect-[572/482] min-w-0"
            >
              <Image
                src={asset("dokumhane.webp")}
                alt="Integrated Sempa casting, machining and inspection"
                fill
                unoptimized
                sizes="(min-width:1200px) 42vw, 48vw"
                className="object-contain [mask-image:radial-gradient(ellipse,black_45%,transparent_75%)]"
              />
              {machiningStages.map((item) => (
                <div
                  key={item.title}
                  className={`${glass} absolute ${item.position} w-[32%] rounded-xl p-2 min-[1200px]:w-[23%] min-[1200px]:p-3 shadow-[inset_-13px_2px_29px_rgba(227,10,23,.65)]`}
                >
                  <h3 className="m-0 text-[clamp(10px,1.2vw,15px)] leading-[1.12]">
                    {item.title}
                  </h3>
                  <p className="mt-3 mb-0 text-[clamp(9px,1vw,12px)] leading-tight">
                    {item.text}
                  </p>
                </div>
              ))}
            </motion.div>
            <motion.div
              {...reveal("right", 0.1, reduced)}
              className="pt-5 min-[1200px]:pt-[calc(65*var(--foundry-unit))]"
            >
              <h2 className={`${heading} ${redText}`}>
                Cast. Machine.
                <br />
                Inspect. Deliver.
              </h2>
              <p className={`${body} mt-6 mb-0 max-w-[503px]`}>
                Sempa’s in-house machining infrastructure converts castings into
                finished, assembly-ready components according to approved
                customer drawings. Horizontal and vertical turning and milling
                support both serial production and customized components.
              </p>
            </motion.div>
          </div>
        </section>

        <section
          aria-label="Examples of casting parts"
          className={`${frame} mt-24 rounded-[30px] bg-linear-to-b from-[#27272A] to-[#E30A17] p-6 min-[1200px]:mt-[calc(120*var(--foundry-unit))] min-[1200px]:p-[calc(52*var(--foundry-unit))]`}
        >
          <div className="flex flex-col justify-between gap-8 min-[1200px]:flex-row">
            <motion.div {...reveal("left", 0, reduced)}>
              <h2 className={`${heading} text-[#E30A17]`}>
                Examples of<span className="min-[1200px]:hidden"> </span>
                <br className="hidden min-[1200px]:block" />
                Casting Parts.
              </h2>
              <p className={`${body} mt-5 mb-0 max-w-[50ch]`}>
                Precision-engineered cast components manufactured for demanding
                hydraulic, municipal, and industrial rotating machinery
                applications.
              </p>
            </motion.div>
            <motion.div
              {...reveal("right", 0.08, reduced)}
              role="group"
              aria-label="Filter casting examples"
              className={`${glass} flex h-fit max-w-full flex-wrap gap-2 rounded-[13px] p-4 min-[1200px]:p-2`}
            >
              {castingFilters.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={castingFilter === item}
                  onClick={() => setCastingFilter(item)}
                  className={`cursor-pointer rounded-lg px-2 py-2 min-[1200px]:px-3 focus-visible:outline-2 focus-visible:outline-white ${castingFilter === item ? "bg-linear-to-b from-white to-[#BABACA]" : "hover:bg-white/10"}`}
                >
                  <span
                    className={`${body} min-[1200px]:text-[calc(12*var(--foundry-unit))] ${castingFilter === item ? "text-black" : "text-white"}`}
                  >
                    {item}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
          <div
            aria-live="polite"
            className="mt-12 grid gap-5 min-[768px]:grid-cols-2 min-[1200px]:mt-[calc(60*var(--foundry-unit))] min-[1200px]:grid-cols-3"
          >
            {castingFilter === "All Castings" || castingFilter === "Casing" ? (
              Array.from({ length: 6 }, (_, index) => (
                <motion.article
                  {...reveal(
                    index % 3 === 0 ? "left" : index % 3 === 2 ? "right" : "up",
                    Math.min(index * 0.05, 0.25),
                    reduced,
                  )}
                  key={index}
                  className="min-w-0 rounded-[15px] bg-white/15 p-5 min-[1200px]:p-[calc(24*var(--foundry-unit))]"
                >
                  <div className="relative aspect-[325/255] overflow-hidden min-[768px]:aspect-[325/217] rounded-[15px]">
                    <Image
                      src={asset("image.webp")}
                      alt="CMM inspection of a casting"
                      fill
                      sizes="(min-width:1200px) 25vw, (min-width:768px) 40vw, 75vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-lg bg-[#E30A17] px-2 py-1 text-[11px]">
                      85 Kg
                    </span>
                    <span className="absolute bottom-3 left-3 max-w-[90%] rounded-lg bg-[#F7F7F7] px-2 py-1 text-[10px] text-[#E30A17]">
                      INSPECTION: 100% CMM
                    </span>
                  </div>
                  <p className={`${small} mt-5 mb-0`}>
                    Ductile Iron EN-GJS-500-7
                  </p>
                  <h3 className="mt-6 mb-0 text-[24px] leading-[1.12] tracking-normal [font-variation-settings:'wght'_540,'wdth'_132] min-[1200px]:text-[calc(25*var(--foundry-unit))]">
                    End-Suction Volute
                    <br />
                    Pump Casing
                  </h3>
                  <p className={`${small} mt-6 mb-0`}>
                    DN 150 × DN 100 · 650 mm outer dia
                  </p>
                  <p className={`${body} mt-6 mb-0`}>
                    Single-stage volute pump casing per ISO 2858. Molded on the
                    resin line with core assembly for optimized hydraulic flow
                    and minimum wall friction.
                  </p>
                </motion.article>
              ))
            ) : (
              <motion.div
                {...reveal("up", 0, reduced)}
                className="col-span-full flex min-h-[240px] flex-col items-center justify-center gap-6 text-center"
              >
                <p className={body}>
                  Contact our engineering team for {castingFilter.toLowerCase()}{" "}
                  casting examples and project requirements.
                </p>
                <Link
                  href="/contact"
                  className="rounded-lg border border-white/60 px-5 py-3 text-[13px]"
                >
                  Contact Sempa
                </Link>
                <button
                  type="button"
                  onClick={() => setCastingFilter("All Castings")}
                  className="cursor-pointer text-[12px] underline"
                >
                  Show all castings
                </button>
              </motion.div>
            )}
          </div>
        </section>

        <EngineeringAnalytics />

        <section
          aria-label="Quality and documentation"
          className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}
        >
          <SectionTitle
            description="The governing standard, critical dimensions, test methods, acceptance criteria, witness points, and documentation package are aligned and agreed before production release."
            revealParts={[
              { text: "Quality designed into", tone: "red" },
              { text: "the quotation.", tone: "red", breakBefore: "always" },
            ]}
          >
            Quality designed into
            <br />
            the quotation.
          </SectionTitle>
          <motion.div
            {...reveal("up", 0.1, reduced)}
            className="mt-14 rounded-2xl bg-[#27272A] p-5 shadow-[0_24px_50px_rgba(0,0,0,.25)] min-[1200px]:mt-[calc(100*var(--foundry-unit))] min-[1200px]:p-[calc(40*var(--foundry-unit))]"
          >
            <div
              tabIndex={0}
              role="region"
              aria-label="Quality methods and deliverable documents"
              className="overflow-x-auto"
            >
              <table className="w-full min-w-[850px] table-fixed border-collapse text-left">
                <caption className="sr-only">
                  Quality methods, application scope and deliverable documents
                </caption>
                <thead>
                  <tr>
                    {[
                      "CATEGORY",
                      "METHOD / EVIDENCE",
                      "APPLICATION SCOPE",
                      "DELIVERABLE DOCUMENT",
                    ].map((label) => (
                      <th
                        key={label}
                        scope="col"
                        className={`${small} pb-8 pr-5 font-normal text-[#E30A17]`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qualityRows.map((row) => (
                    <tr key={row[0]} className="border-b border-white/15">
                      {row.map((cell, index) =>
                        index === 0 ? (
                          <th
                            key={cell}
                            scope="row"
                            className={`${body} max-[767px]:text-[13px] py-6 pr-5 font-medium`}
                          >
                            {cell}
                          </th>
                        ) : (
                          <td
                            key={cell}
                            className={`${small} max-[767px]:text-[11px] py-6 pr-5 ${index === 3 ? "text-[#E30A17]" : "text-[#BABACA]"}`}
                          >
                            {cell}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="m-0 text-[9px] text-[#BABACA]">
                DOCUMENT PACKAGE OPTIONS:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "SEMPA CoC",
                  "EN 10204 3.1 / 3.2",
                  "CMM DIMENSIONAL",
                  "NDT REPORTS",
                  "PPAP / FAI",
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[9px]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section
          aria-label="Finishing and delivery"
          className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}
        >
          <SectionTitle
            titleClassName="max-[767px]:max-w-[85%] max-[767px]:text-[clamp(25px,7.4vw,32px)]"
            description="Finishing, external processing and delivery condition are defined in the quotation so the customer knows exactly what arrives."
            revealParts={[
              { text: "From shakeout to the level", tone: "red" },
              {
                text: "of completion you need.",
                tone: "red",
                breakBefore: "desktop",
              },
            ]}
          >
            From shakeout to the level
            <span className="min-[1200px]:hidden"> </span>
            <br className="hidden min-[1200px]:block" />
            of completion you need.
          </SectionTitle>
          <FoundryCarousel kind="finishing" label="Finishing stages">
            {finishing.map((label, index) => (
              <article
                key={label}
                className={`border border-white/65 bg-white/15 backdrop-blur-[30px] flex h-full min-h-[230px] min-w-0 flex-col justify-between gap-8 rounded-[20px] p-4 min-[1200px]:min-h-[calc(237*var(--foundry-unit))] min-[1200px]:px-[calc(13*var(--foundry-unit))] min-[1200px]:py-[calc(23*var(--foundry-unit))]`}
              >
                <p className="m-0 text-[36px] leading-none min-[1200px]:text-[calc(36*var(--foundry-unit))]">
                  0{index + 1}
                </p>
                <h3
                  className={`${body} max-[767px]:text-[clamp(14px,4.1vw,16px)] m-0 font-medium`}
                >
                  {label.split(" ").map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
                <p className={`${body} m-0`}>
                  Mold removal and initial separation.
                </p>
              </article>
            ))}
          </FoundryCarousel>
          <motion.div
            {...reveal("up", 0.1, reduced)}
            className="mt-12 flex flex-col justify-between gap-7 rounded-[10px] border border-[#E30A17]/70 bg-linear-to-r from-white/15 to-[#E30A17]/0 px-6 py-6 backdrop-blur-[21.4px] min-[1200px]:mt-[calc(60*var(--foundry-unit))] min-[1200px]:flex-row min-[1200px]:items-start"
          >
            <div>
              <p className={`${small} m-0`}>
                Foundry Capabilities Catalog · 2026 Edition
              </p>
              <h3 className="mt-4 mb-0 text-[25px] leading-none tracking-[-0.04em] text-[#E30A17] min-[1200px]:text-[calc(25*var(--foundry-unit))]">
                Download the Complete 20-Page PDF Document.
              </h3>
              <p className="mt-4 mb-0 text-[10px] leading-tight">
                Includes full metallurgical tables, furnace power logs, machine
                park coordinates, and quality procedures.
              </p>
            </div>
            <a
              href={asset("foundry-capabilities-2026-v1.pdf")}
              download
              className="flex w-fit max-w-full shrink-0 items-center gap-3 rounded-[10px] bg-white/15 px-4 py-3 transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <LuCloudDownload
                aria-hidden="true"
                className="size-6 shrink-0 text-[#E30A17]"
              />
              <span className={body}>DOWNLOAD PDF (2026 v1)</span>
            </a>
          </motion.div>
        </section>
        <motion.div
          {...reveal("up", 0, reduced)}
          className={`${frame} pt-20 pb-20 min-[1200px]:pt-[calc(120*var(--foundry-unit))] min-[1200px]:pb-[calc(120*var(--foundry-unit))]`}
        >
          <NewsletterSubscription />
        </motion.div>
      </div>
    </main>
  );
}
