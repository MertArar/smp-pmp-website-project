"use client";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FiArrowUpRight, FiCheck, FiSliders, FiX } from "react-icons/fi";
import {
  JoinSempaGlobal,
  CatalogSolutions,
} from "@/components/catalog/CatalogSections";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import SmartPumpAssistant from "@/components/smart-pump/SmartPumpAssistant";
// Matches the scroll reveal behaviour of AboutUsPage.
// Each element has its own viewport observer so animations do not finish early.
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

const ASSETS = "/all-products";
const SERIES = [
  "End Suction Pumps",
  "Multi Stage Pumps",
  "Sewage Pumps",
  "In-Line Pumps",
  "Split Case Pumps",
  "Self Priming Pumps",
  "Booster Pumps",
  "Fire Fighting Pumps",
];
const APPLICATIONS = [
  "Power Plants",
  "Agricultural Irrigation Drainage",
  "Petroleum Industry",
  "Water Treatment and Pressurization",
  "Mining",
  "Chemical Industry",
  "Marine",
  "Fire extinguishing",
  "Food and Beverage Industry",
  "Iron and Steel Industry",
];
type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  series: string;
  applications: string[];
};
const PRODUCTS: Product[] = [
  {
    id: "tkf",
    name: "TKF Series",
    description: "Single Stage End Suction Pumps",
    image: "tkf-80.jpg",
    series: SERIES[0],
    applications: [APPLICATIONS[0], APPLICATIONS[1], APPLICATIONS[3]],
  },
  {
    id: "tkf-k",
    name: "TKF K Series",
    description: "End Suction Pumps",
    image: "tkf-k-100.jpg",
    series: SERIES[0],
    applications: [APPLICATIONS[1], APPLICATIONS[3], APPLICATIONS[8]],
  },
  {
    id: "tkf-ke",
    name: "TKF KE Series",
    description: "Industrial Pump Solutions",
    image: "tkf-ke.jpg",
    series: SERIES[0],
    applications: [APPLICATIONS[0], APPLICATIONS[5], APPLICATIONS[9]],
  },
  {
    id: "tkf-ah",
    name: "TKF AH Series",
    description: "Booster Pumps",
    image: "tkf-ah.jpg",
    series: SERIES[6],
    applications: [APPLICATIONS[3], APPLICATIONS[7]],
  },
  {
    id: "tkf-m",
    name: "TKF M Series",
    description: "Industrial Pump Solutions",
    image: "tkf-m-80.jpg",
    series: SERIES[0],
    applications: [APPLICATIONS[2], APPLICATIONS[4], APPLICATIONS[5]],
  },
  {
    id: "asl",
    name: "ASL Series",
    description: "Split Case Pumps",
    image: "asl.jpg",
    series: SERIES[4],
    applications: [APPLICATIONS[0], APPLICATIONS[1], APPLICATIONS[6]],
  },
  {
    id: "ars-uf",
    name: "ARS UF Series",
    description: "End Suction Pumps",
    image: "1-k.jpg",
    series: SERIES[0],
    applications: [APPLICATIONS[1], APPLICATIONS[3], APPLICATIONS[8]],
  },
  {
    id: "dpt",
    name: "DPT Series",
    description: "Inline Centrifugal Pumps",
    image: "dpt-di.jpg",
    series: SERIES[3],
    applications: [APPLICATIONS[0], APPLICATIONS[3], APPLICATIONS[9]],
  },
  {
    id: "dpt-tr",
    name: "DPT TR Series",
    description: "Vertical Centrifugal Pumps",
    image: "dpt-tr-100.jpg",
    series: SERIES[1],
    applications: [APPLICATIONS[1], APPLICATIONS[3], APPLICATIONS[4]],
  },
  {
    id: "axial",
    name: "ASL Series",
    description: "Axial Flow Elbow Propeller Pumps",
    image: "product.webp",
    series: SERIES[4],
    applications: [APPLICATIONS[1], APPLICATIONS[6]],
  },
];
function CircleLink({
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
      className={`
        group inline-flex min-h-11
        items-center justify-between
        gap-5 rounded-[19px]
        border border-[#9eb7d0]/60
        bg-white/25
        py-1.5 pr-1.5 pl-5
        text-[15px] text-[#27272a]
        shadow-[0_5px_20px_#005eff12]
        backdrop-blur-md
        transition-colors duration-300
        hover:bg-white/65
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#005eff]
        ${className}
      `}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="
          grid size-8 shrink-0
          place-items-center
          rounded-full
          border border-white/50
          bg-[linear-gradient(145deg,#0877ff,#001ca3)]
          shadow-[0_0_22px_#005eff55]
          transition-transform duration-300
          group-hover:translate-x-0.5
        "
      >
        <FiArrowUpRight className="size-4 text-white" />
      </span>
    </Link>
  );
}
function FilterGroup({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.fieldset {...reveal("left", 0, reduced, 0.18)}>
      <legend
        className="
          mb-4 text-[15px]
          font-[540]
          text-[#0d5792]
        "
      >
        {title}
      </legend>
      <div className="space-y-3">
        {values.map((value) => (
          <label
            key={value}
            className="
              flex cursor-pointer
              items-start gap-2.5
              text-[12px]
              leading-[1.15]
              text-[#27272a]
            "
          >
            <span className="relative mt-px size-[19px] shrink-0">
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => onToggle(value)}
                className="
                  peer size-full cursor-pointer
                  appearance-none rounded-[3px]
                  border border-transparent
                  bg-[#f4f6f7]
                  checked:border-[#005eff]
                  checked:bg-[#005eff]
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-[#005eff]
                "
              />
              <FiCheck
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute inset-0 m-auto
                  size-3.5 text-white
                  opacity-0
                  peer-checked:opacity-100
                "
              />
            </span>
            <span className="pt-0.5">{value}</span>
          </label>
        ))}
      </div>
    </motion.fieldset>
  );
}
function ProductDetails({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion() ?? false;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !product) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [product]);
  return (
    <dialog
      ref={ref}
      aria-labelledby="catalog-product-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="
        fixed inset-0 m-auto
        max-h-[90svh]
        w-[min(540px,calc(100%-32px))]
        overflow-y-auto
        rounded-[28px]
        border border-white/80
        bg-[#eef8ff]
        p-6 text-[#0d5792]
        shadow-2xl
        backdrop:bg-[#001b35]/50
        backdrop:backdrop-blur-sm
        sm:p-9
      "
    >
      {product && (
        <>
          <button
            type="button"
            aria-label="Close product details"
            onClick={onClose}
            className="
              absolute top-4 right-4 z-10
              grid size-10 cursor-pointer
              place-items-center
              rounded-full
              bg-white/80
              transition-colors
              hover:bg-white
              focus-visible:outline-2
              focus-visible:outline-[#005eff]
            "
          >
            <FiX />
          </button>
          <motion.div
            key={product.id}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="pr-10 text-xs text-[#7a9ab5]">
              Type Series · {product.series}
            </p>
            <h2
              id="catalog-product-title"
              className="mt-3 text-2xl leading-tight"
            >
              {product.name}
              <br />
              {product.description}
            </h2>
            <div className="relative my-6 aspect-square rounded-3xl bg-white">
              <Image
                src={`${ASSETS}/${product.image}`}
                alt={product.description}
                fill
                sizes="460px"
                className="object-contain p-7 mix-blend-multiply"
              />
            </div>
            <p className="text-sm leading-relaxed text-[#476d8e]">
              For product dimensions, performance curves and application advice,
              contact our engineering team.
            </p>
            <CircleLink href="/contact" className="mt-6">
              Contact engineering
            </CircleLink>
          </motion.div>
        </>
      )}
    </dialog>
  );
}
export default function AllProductsPage({
  initialSeries,
}: {
  initialSeries?: string;
} = {}) {
  const [series, setSeries] = useState<string[]>(() =>
    SERIES.filter((value) => value === initialSeries),
  );
  const [applications, setApplications] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;
  const filterId = useId();
  const searchId = useId();
  useEffect(() => {
    const clearOutside = (event: PointerEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest("[data-product-card]")
      ) {
        setActiveProduct(null);
      }
    };
    document.addEventListener("pointerdown", clearOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener("pointerdown", clearOutside);
    };
  }, []);
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("en");
    return PRODUCTS.filter((product) => {
      const matchesSeries = !series.length || series.includes(product.series);
      const matchesApplication =
        !applications.length ||
        applications.some((value) => product.applications.includes(value));
      const matchesSearch =
        !search ||
        `${product.name} ${product.description}`
          .toLocaleLowerCase("en")
          .includes(search);
      return matchesSeries && matchesApplication && matchesSearch;
    });
  }, [series, applications, query]);
  const toggle = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };
  const clear = () => {
    setSeries([]);
    setApplications([]);
    setQuery("");
    setActiveProduct(null);
  };
  const activeFilters = series.length + applications.length;
  const hasActiveFilters = activeFilters > 0 || query.trim().length > 0;
  return (
    <main
      data-header-underlay
      data-all-products-page
      className="
        -mt-[var(--site-header-height,97px)]
        isolate w-full overflow-x-clip
        bg-[#d1e8f3]
        text-[#0d5792]
        [font-family:var(--font-sf-pro),sans-serif]
        [font-variation-settings:'wdth'_125,'wght'_410]
      "
    >
      {/* HEADER SPACER */}
      <div
        data-header-spacer
        aria-hidden="true"
        className="
          h-[var(--site-header-height,97px)]
          shrink-0
        "
      />
      {/* PAGE STYLES */}
      <style>{`
        body:has([data-all-products-page]) {
          background: #d1e8f3;
        }
        [data-solutions-corner-fix] {
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
        }
        [data-solutions-corner-fix] > * {
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
        }
        /* Popup corners, not only the outer Solutions section. */
        [data-all-products-page] .solution-detail-panel,
        [data-all-products-page] .solution-detail-panel > :first-child {
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
        }
      `}</style>
      <section
        aria-labelledby="catalog-title"
        className="
          mx-auto w-full max-w-[1600px]
          px-5 pt-12 pb-16
          md:w-[94%]
          md:px-8
          md:pt-12
          lg:w-[90%]
          lg:px-6
          xl:px-10
        "
      >
        {/* TOP FILTER BAR */}
        <div
          className="
            mb-8 grid grid-cols-2
            items-start
            gap-x-3 gap-y-4
            sm:mb-10
            md:flex
            md:flex-wrap
            md:gap-x-7
            md:gap-y-5
            max-md:mb-16
          "
        >
          {/* TITLE */}
          <motion.div
            {...reveal("left", 0, reduced)}
            className="
              min-w-36
              sm:mr-6
              max-md:col-span-2
              max-md:mr-0
              max-md:text-center
            "
          >
            <h1
              id="catalog-title"
              className="
                m-0 text-[25px]
                font-[650]
                leading-none
                [font-variation-settings:'wdth'_125,'wght'_650]
              "
            >
              Type Series
            </h1>
            <nav
              aria-label="Breadcrumb"
              className="
                mt-2 text-[11px]
                text-[#8ba9c0]
                max-md:hidden
              "
            >
              <Link href="/" className="hover:text-[#005eff]">
                Home
              </Link>
              <span aria-hidden="true"> &gt; </span>
              <span>Type Series</span>
            </nav>
          </motion.div>
          {/* RESULTS */}
          <motion.output
            {...reveal("up", 0.07, reduced)}
            aria-live="polite"
            aria-atomic="true"
            data-catalog-results
            className="
              pt-2 text-[15px]
              max-md:col-span-2
              max-md:mb-2
              max-md:text-center
            "
          >
            {filtered.length} Results
          </motion.output>
          {/* MOBILE FILTER TOGGLE */}
          <motion.button
            {...reveal("up", 0.08, reduced)}
            type="button"
            aria-controls={filterId}
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            className="
              flex min-h-11
              cursor-pointer
              items-center
              justify-between
              gap-2
              rounded-[10px]
              bg-white px-3
              text-[13px]
              transition-colors duration-300
              hover:bg-white/75
              md:hidden
            "
          >
            <span>
              {filtersOpen ? "Close Filters" : "Open Filters"}
              {activeFilters ? ` (${activeFilters})` : ""}
            </span>
            <FiSliders aria-hidden="true" />
          </motion.button>
          {/* CLEAR ALL FILTERS */}
          {hasActiveFilters && (
            <motion.button
              {...reveal("up", 0.09, reduced)}
              type="button"
              onClick={clear}
              className="
                group/clear
                flex min-h-10
                cursor-pointer
                items-center
                gap-5
                rounded-[10px]
                bg-white
                px-3.5
                text-[13px]
                transition-[background-color,box-shadow,transform]
                duration-300
                ease-out
                hover:bg-[#005eff]
                hover:text-white
                hover:shadow-[0_5px_18px_#005eff25]
                active:scale-[0.98]
                focus-visible:outline-2
                focus-visible:outline-[#005eff]
                max-md:min-h-11
                max-md:justify-between
                max-md:gap-2
                max-md:whitespace-nowrap
                max-md:px-3
                max-md:text-[12px]
              "
            >
              <span>Clear All Filters</span>
              <FiX
                aria-hidden="true"
                className="
                  size-5
                  text-[#27272a]
                  transition-[transform,color]
                  duration-300
                  group-hover/clear:rotate-90
                  group-hover/clear:text-white
                "
              />
            </motion.button>
          )}
          {/* SEARCH */}
          <motion.label
            {...reveal("right", 0.12, reduced)}
            htmlFor={searchId}
            className="
                relative ml-auto block w-full min-w-0
                md:w-[224px] md:shrink-0
                max-md:col-span-2
              "
          >
            <span className="sr-only">Search products</span>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="SEARCH PRODUCT"
              style={{
                // The root layout installs SF Pro through --font-sf-pro.
                // Match this page's 125-width SF Pro instead of the
                // condensed width used in the previous search field.
                fontFamily: "var(--font-sf-pro), sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                fontVariationSettings: "'wdth' 125, 'wght' 400, 'opsz' 17",
                fontOpticalSizing: "none",
                letterSpacing: "-0.02em",
              }}
              className="
                  box-border h-11 w-full min-w-0 appearance-none
                  rounded-[17px] border border-white/80 bg-white/20
                  py-0 pl-5 pr-[48px]
                  leading-none text-[#0d5792]
                  shadow-[inset_-10px_0_20px_#005eff10,0_4px_20px_#005eff12]
                  outline-none backdrop-blur-md
                  transition-[border-color,box-shadow] duration-300
                  placeholder:opacity-100 placeholder:text-[#9eb7d0]
                  [&::-webkit-search-decoration]:hidden
                  [&::-webkit-search-cancel-button]:hidden
                  focus:border-[#005eff]/60 focus:ring-2 focus:ring-[#005eff]/15
                "
            />
            <Image
              src={`${ASSETS}/search-icon.png`}
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
              className="
                  pointer-events-none absolute right-[17px] top-1/2
                  size-6 -translate-y-1/2 object-contain
                "
            />
          </motion.label>
        </div>
        {/* FILTERS + PRODUCTS */}
        <div
          className="
            grid items-start gap-6
            md:grid-cols-[210px_minmax(0,1fr)]
            lg:grid-cols-[minmax(220px,.92fr)_3fr]
            xl:grid-cols-[minmax(250px,.95fr)_3fr]
          "
        >
          {/* FILTER SIDEBAR */}
          <aside
            aria-label="Product filters"
            className={`
              ${filtersOpen ? "block" : "hidden"}
              min-w-0
              rounded-[30px]
              bg-white p-5
              md:block
              md:p-6
              xl:px-[35px]
              xl:py-8
            `}
          >
            <div
              id={filterId}
              className={`
                ${filtersOpen ? "mt-6 block" : "hidden"}
                space-y-9
                md:mt-0
                md:block
              `}
            >
              <FilterGroup
                title="Series"
                values={SERIES}
                selected={series}
                onToggle={(value) => toggle(value, setSeries)}
              />
              <FilterGroup
                title="Application"
                values={APPLICATIONS}
                selected={applications}
                onToggle={(value) => toggle(value, setApplications)}
              />
            </div>
          </aside>
          {/* PRODUCT GRID */}
          <div className="min-w-0">
            <div
              data-product-grid
              className="
                grid grid-cols-1
                gap-x-[26px]
                gap-y-[72px]
                max-md:mx-auto
                max-md:w-[calc(100%-64px)]
                min-[540px]:grid-cols-2
                lg:grid-cols-3
              "
            >
              {/* First six cards are visible immediately; remaining cards reveal on scroll. */}
              {filtered.map((product, index) => (
                <motion.article
                  {...(index < 6
                    ? { initial: false as const }
                    : reveal(
                        index % 3 === 0
                          ? "left"
                          : index % 3 === 2
                            ? "right"
                            : "up",
                        (index % 3) * 0.055,
                        reduced,
                        0.28,
                      ))}
                  key={product.id}
                  data-product-card={product.id}
                  data-active={activeProduct === product.id}
                  className="
                    group relative
                    aspect-[288/350]
                    min-w-0
                    [@media(hover:hover)_and_(pointer:fine)]:hover:z-10
                  "
                >
                  {/* PRODUCT CARD SURFACE */}
                  <div
                    data-product-surface
                    className="
                      absolute inset-x-0
                      top-0 bottom-0
                      flex min-w-0
                      flex-col
                      rounded-[30px]
                      bg-[#f7f7f7]
                      p-4
                      text-[#4887b8]
                      transition-[bottom,background-color,color,box-shadow]
                      duration-500
                      ease-[cubic-bezier(.22,1,.36,1)]
                      group-has-[:focus-visible]:-bottom-10
                      group-has-[:focus-visible]:bg-[#005eff]
                      group-has-[:focus-visible]:text-white
                      group-data-[active=true]:-bottom-10
                      group-data-[active=true]:bg-[#005eff]
                      group-data-[active=true]:text-white
                      group-data-[active=true]:shadow-[0_15px_35px_#005eff25]
                      [@media(hover:hover)_and_(pointer:fine)]:group-hover:-bottom-10
                      [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[#005eff]
                      [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-white
                      [@media(hover:hover)_and_(pointer:fine)]:group-hover:shadow-[0_15px_35px_#005eff25]
                      motion-reduce:transition-none
                      sm:p-5
                    "
                  >
                    {/* PRODUCT TITLE */}
                    <h2
                      className="
                        mr-9 mb-5
                        min-h-[45px]
                        text-[15px]
                        font-[540]
                        leading-[1.03]
                        tracking-[-.025em]
                      "
                    >
                      {product.name}
                      <br />
                      {product.description}
                    </h2>
                    {/* PRODUCT ARROW — 900MS */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute top-5 right-4
                        grid size-[30px]
                        place-items-center
                        rounded-full
                        border border-transparent
                        bg-[#27272a]
                        text-white
                        transition-[background-color,border-color,transform,box-shadow]
                        duration-[900ms]
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-has-[:focus-visible]:rotate-90
                        group-has-[:focus-visible]:border-white/50
                        group-has-[:focus-visible]:bg-[#005eff]
                        group-data-[active=true]:rotate-90
                        group-data-[active=true]:border-white/50
                        group-data-[active=true]:bg-[#005eff]
                        [@media(hover:hover)_and_(pointer:fine)]:group-hover:rotate-90
                        [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-white/50
                        [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[#005eff]
                        motion-reduce:transition-none
                      "
                    >
                      <FiArrowUpRight className="size-[22px] text-white" />
                    </span>
                    {/* PRODUCT IMAGE */}
                    <div
                      className="
                        relative min-h-0
                        flex-1
                        overflow-hidden
                        rounded-[25px]
                        bg-[linear-gradient(180deg,#f5fcff,#e0fbff)]
                      "
                    >
                      <Image
                        src={`${ASSETS}/${product.image}`}
                        alt={product.description}
                        fill
                        sizes="
                          (min-width:1800px) 330px,
                          (min-width:1024px) 22vw,
                          (min-width:768px) 30vw,
                          (min-width:540px) 44vw,
                          86vw
                        "
                        className="
                          object-contain
                          p-4
                          mix-blend-multiply
                          max-md:scale-[1.45]
                          max-md:p-0
                        "
                      />
                    </div>
                    {/* CARD INTERACTION */}
                    <button
                      type="button"
                      onClick={(event) => {
                        const isTouch =
                          typeof window !== "undefined" &&
                          window.matchMedia("(hover: none), (pointer: coarse)")
                            .matches;
                        if (
                          event.detail !== 0 &&
                          isTouch &&
                          activeProduct !== product.id
                        ) {
                          setActiveProduct(product.id);
                          return;
                        }
                        setSelectedProduct(product);
                      }}
                      aria-label={`View ${product.name} — ${product.description}`}
                      className="
                        absolute inset-0
                        cursor-pointer
                        rounded-[30px]
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#005eff]
                        focus-visible:ring-offset-4
                      "
                    />
                  </div>
                </motion.article>
              ))}
            </div>
            {/* NO RESULTS */}
            {!filtered.length && (
              <motion.div
                {...reveal("up", 0, reduced, 0.22)}
                role="status"
                className="
                  rounded-[30px]
                  border border-white/80
                  bg-white/40
                  px-6 py-16
                  text-center
                "
              >
                <h2 className="text-2xl">No matching products</h2>
                <p className="mt-3 text-sm text-[#648aa8]">
                  Try another series, application or product name.
                </p>
                <button
                  type="button"
                  onClick={clear}
                  className="
                    mt-6 cursor-pointer
                    rounded-full
                    bg-[#005eff]
                    px-5 py-3
                    text-sm text-white
                    transition-colors duration-300
                    hover:bg-[#0049c9]
                  "
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      <JoinSempaGlobal assetBase="/all-products" />
      <div
        data-solutions-corner-fix
        className="
          relative w-full
          overflow-hidden
          rounded-none
          bg-[#d1e8f3]
        "
      >
        <CatalogSolutions assetBase="/all-products" />
      </div>
      <SmartPumpAssistant assetBase="/all-products" />
      <motion.div
        {...reveal("up", 0, reduced, 0.15)}
        data-all-products-newsletter
        className="
          mx-auto w-full
          max-w-[1600px]
          px-5 pt-1 pb-32
          md:w-[94%]
          md:px-8
          md:pt-8
          md:pb-32
          lg:w-[90%]
          lg:px-6
          xl:px-10
        "
      >
        <NewsletterSubscription />
      </motion.div>
      {/* PRODUCT MODAL */}
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
