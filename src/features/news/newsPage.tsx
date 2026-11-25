"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowDownRight, FiCheck } from "react-icons/fi";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import SlidingCircleButton from "@/components/ui/ViewAllButton";
import useScrollReveal from "@/components/ui/useScrollReveal";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
  page: "tw-news-page [min-height:calc(100svh_-_100px)] [padding:85px_24px_140px] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-0.04em] [background:radial-gradient(ellipse_at_86%_48%,_#d5e9ff_0%,_transparent_66%),_radial-gradient(ellipse_at_5%_18%,_#f5faff_0%,_transparent_56%),_linear-gradient(115deg,_#e6f3ff,_#d5e9ff)] md:max-xl:[padding-inline:40px] max-md:[padding:60px_12px_80px]",
  title:
    "tw-news-title [margin:0_0_90px] [color:#9eb7d0]! text-center [font-size:clamp(34px,_3.48vw,_50px)]! [font-weight:410] [line-height:1]! max-md:[font-size:clamp(28px,_7.5vw,_34px)]! max-md:[margin-bottom:80px]",
  sectionHeader:
    "tw-news-sectionHeader flex items-center justify-between [gap:32px] [margin-bottom:35px] [&_h2]:m-0 [&_h2]:[color:#0d5792]! [&_h2]:[font-size:25px]! [&_h2]:[font-weight:540] [&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_h2]:[line-height:1.12]! [&_p]:m-0 [&_p]:[color:#9eb7d0]! [&_p]:[font-size:15px]! [&_p]:[line-height:1]! md:max-xl:items-start md:max-xl:[&_p]:[max-width:390px] md:max-xl:[&_p]:[line-height:1.12]! max-md:flex-col max-md:items-center max-md:[gap:18px] max-md:[&_h2]:[font-size:clamp(22px,_5.9vw,_26px)]! max-md:[&_p]:[line-height:1.12]! max-md:[&_p]:[font-size:13px]! max-md:text-center max-md:[margin-bottom:20px] max-md:[&_p]:[max-width:320px]",
  newsGrid:
    "tw-news-newsGrid grid [grid-template-columns:minmax(0,_650fr)_minmax(0,_344fr)_minmax(157px,_167fr)] [align-items:start] [gap:20px] md:max-xl:[grid-template-columns:minmax(0,_1fr)_190px] max-md:[grid-template-columns:minmax(0,_1fr)] max-md:[gap:15px]",
  featuredColumn:
    "tw-news-featuredColumn min-w-0 md:max-xl:[grid-column:1_/_-1] max-md:[grid-row:2]",
  featured:
    "tw-news-featured flex [gap:28px] [padding:20px] [min-height:280px] [border-radius:30px] [background:#f7f7f7] [transition:background-color_400ms_ease] [&:is(:hover,_:focus-within)]:[background-color:#005eff] [&:is(:hover,_:focus-within)_.tw-news-photo]:[filter:grayscale(0)] [&:is(:hover,_:focus-within)_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)] [&:is(:hover,_:focus-within)_.tw-news-logo]:[filter:brightness(0)_invert(1)] [&:is(:hover,_:focus-within)_h3]:[color:#fff]! [&:is(:hover,_:focus-within)_.tw-news-metadata]:[color:#e6f3ff]! max-md:flex-col max-md:[gap:0] max-md:[&:is(:hover,_:focus-within)_.tw-news-logo]:[transform:rotate(0deg)] motion-reduce:[transition:none] max-md:[padding:18px] max-md:[border-radius:16px] max-md:[&:is(:hover,_:focus-within)_.tw-news-featuredMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)]",
  featuredMedia:
    "tw-news-featuredMedia relative [flex:0_0_55%] min-w-0 [height:240px] md:max-xl:[flex-basis:55%] max-md:[flex-basis:auto] max-md:w-full max-md:h-auto max-md:[aspect-ratio:350_/_240] max-md:[&_.tw-news-logo]:[top:50%] max-md:[&_.tw-news-logo]:[bottom:auto] max-md:[&_.tw-news-logo]:[right:-8px] max-md:[&_.tw-news-logo]:[transform:translateY(-50%)_rotate(-90deg)]",
  photoFrame:
    "tw-news-photoFrame relative w-full h-full overflow-hidden [border-radius:30px] max-md:[border-radius:16px]",
  photo:
    "tw-news-photo object-cover [filter:grayscale(1)] [transition:filter_700ms_ease-out,scale_700ms_ease-out] motion-reduce:[transition:none]",
  logo: "tw-news-logo absolute [z-index:1] [right:-20px] [top:50%] [width:48px] h-auto [transform:translateY(-50%)_rotate(-90deg)] [transition:transform_400ms_ease,_filter_400ms_ease] max-md:[top:auto] max-md:[bottom:-10px] max-md:[right:15px] max-md:[transform:rotate(-90deg)] motion-reduce:[transition:none]",
  featuredText:
    "tw-news-featuredText min-w-0 flex flex-1 items-start flex-col [padding-top:25px] [&_h3]:m-0 [&_h3]:[color:#27272a]! [&_h3]:[font-size:15px]! [&_h3]:[font-weight:410] [&_h3]:[line-height:1]! [&_h3]:[transition:color_400ms_ease] max-md:[padding-top:28px] max-md:[&_h3]:[line-height:1.12]! motion-reduce:[&_h3]:[transition:none]",
  metadata:
    "tw-news-metadata flex items-center flex-wrap [gap:8px] [margin-top:auto] [margin-bottom:18px] [color:#9eb7d0]! [font-size:12px]! [line-height:1.12]! [transition:color_400ms_ease] max-md:[margin-top:25px] motion-reduce:[transition:none]",
  separator:
    "tw-news-separator [width:1px] [height:12px] [background:currentColor]",
  previewActive:
    "tw-news-previewActive [background-color:#005eff] [&_.tw-news-photo]:[filter:grayscale(0)] [&_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)] [&_.tw-news-logo]:[filter:brightness(0)_invert(1)] [&_h3]:[color:#fff]! [&_.tw-news-metadata]:[color:#e6f3ff]! max-md:[&_.tw-news-logo]:[transform:rotate(0deg)] max-md:[&_.tw-news-featuredMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)]",
  touchPreview:
    "tw-news-touchPreview hidden [&:focus-visible]:[outline:2px_solid_#005eff] [&:focus-visible]:[outline-offset:4px] [@media(hover:none)]:block [@media(hover:none)]:absolute [@media(hover:none)]:[bottom:12px] [@media(hover:none)]:[left:12px] [@media(hover:none)]:[padding:8px_12px] [@media(hover:none)]:[border:1px_solid_#ffffffa0] [@media(hover:none)]:[border-radius:16px] [@media(hover:none)]:[background:#f5faffd9] [@media(hover:none)]:[color:#0d5792]! [@media(hover:none)]:[font-size:11px]! [@media(hover:none)]:cursor-pointer [@media(hover:none)]:[backdrop-filter:blur(8px)]",
  latestList:
    "tw-news-latestList flex flex-col [gap:20px] min-w-0 max-md:[gap:10px] max-md:[grid-row:3]",
  smallCard:
    "tw-news-smallCard flex items-center gap-3 min-h-[73px] min-w-0 p-[13px] rounded-[15px] bg-white transition-[background-color,box-shadow] duration-300 [&:is(:hover,_:focus-visible)]:bg-[#005eff] [&:is(:hover,_:focus-visible)_h3]:text-white! [&:is(:hover,_:focus-visible)_.tw-news-arrow]:bg-[#9eb7d0] [&:is(:hover,_:focus-visible)_.tw-news-arrow]:shadow-[0_0_12px_#005eff40] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] motion-reduce:transition-none max-md:rounded-xl",
  arrow:
    "tw-news-arrow flex items-center justify-center flex-[0_0_24px] h-6 rounded-full bg-[#27272a] text-white! shadow-[0_0_22px_5px_#005eff73] transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none",
  smallContent:
    "tw-news-smallContent min-w-0 flex-1 [&_h3]:overflow-hidden [&_h3]:text-ellipsis [&_h3]:whitespace-nowrap [&_h3]:[margin:0_0_10px] [&_h3]:[color:#27272a]! [&_h3]:[font-size:12px]! [&_h3]:[font-weight:410] [&_h3]:[line-height:1.12]!",
  smallMeta:
    "tw-news-smallMeta flex justify-between [gap:8px] [color:#9eb7d0]! [font-size:9px]! [line-height:1]!",
  filters:
    "tw-news-filters flex flex-col [gap:12px] m-0 [padding:26px_21px] [border:0] [border-radius:15px] [background:#f7f7f7] max-md:grid max-md:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-md:[padding:24px_20px] max-md:[gap:14px_8px] max-md:[grid-row:1]",
  filter:
    "tw-news-filter flex items-center gap-[9px] text-[#9eb7d0]! text-[15px]! leading-none! cursor-pointer max-md:gap-1.5 max-md:text-[11px]!",
  empty:
    "tw-news-empty [padding:35px] [border-radius:30px] [background:#f7f7f7] [color:#0d5792]! [font-size:15px]!",
  collection: "tw-news-collection [margin-top:85px] max-md:[margin-top:55px]",
  collectionHeader:
    "tw-news-collectionHeader flex md:max-lg:flex-col md:max-lg:items-start items-center justify-between [gap:24px] [margin-bottom:35px] [&_h2]:flex [&_h2]:items-baseline [&_h2]:[gap:20px] [&_h2]:m-0 [&_h2]:[color:#0d5792]! [&_h2]:[font-size:25px]! [&_h2]:[line-height:1]! [&_h2]:[font-weight:540] [&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_h2_>_span]:[color:#9eb7d0]! [&_h2_>_span]:[font-size:13px]! [&_h2_>_span]:[font-weight:410] [&_h2_>_span]:[font-variation-settings:'wght'_410,_'wdth'_125] [&_h2_>_span]:tracking-[-.03em] max-md:flex-col max-md:items-center max-md:[gap:20px] max-md:[margin-bottom:25px] max-md:[&_h2]:flex-col max-md:[&_h2]:items-center max-md:[&_h2]:[gap:8px] max-md:[&_h2]:[font-size:25px]! max-md:[&_h2_>_span]:[font-size:11px]!",
  filterCapsule:
    "tw-news-filterCapsule flex max-w-full gap-2 rounded-[12px] bg-[#f7f7f7] p-1.5 overflow-x-auto md:gap-2.5 md:p-[9px] [&_button]:flex [&_button]:h-8 [&_button]:items-center [&_button]:justify-center [&_button]:gap-1 md:[&_button]:gap-1.5 [&_button]:shrink-0 [&_button]:px-1.5 [&_button]:rounded-[9px] [&_button]:border [&_button]:border-[#9eb7d080] [&_button]:bg-transparent [&_button]:text-[#27272a]! [&_button]:text-[10px]! [&_button]:leading-none! [&_button]:cursor-pointer [&_button]:transition-[color,background-color,border-color] [&_button]:duration-250 [&_.tw-news-activeFilter]:bg-[#005eff] [&_.tw-news-activeFilter]:border-[#005eff] [&_.tw-news-activeFilter]:text-white! [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-[#0d5792] [&_button:focus-visible]:outline-offset-2 sm:[&_button]:px-2.5 sm:[&_button]:text-[13px]! md:[&_button]:px-3 md:[&_button]:text-[15px]! lg:[&_button]:text-[16px]! max-md:w-full max-md:[&_button]:flex-1 motion-reduce:[&_button]:transition-none",
  activeFilter: "tw-news-activeFilter",
  collectionGrid:
    "tw-news-collectionGrid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 xl:gap-5 items-stretch max-md:[gap:12px]",
  collectionCard:
    "tw-news-collectionCard flex-col gap-0! min-h-[498px] [&_.tw-news-collectionMedia]:basis-auto [&_.tw-news-collectionMedia]:w-full [&_.tw-news-collectionMedia]:h-auto [&_.tw-news-collectionMedia]:aspect-[350/227] [&_.tw-news-photoFrame]:rounded-[25px] [&_.tw-news-logo]:left-0! [&_.tw-news-logo]:right-auto! [&_.tw-news-logo]:top-auto! [&_.tw-news-logo]:bottom-[-7px]! [&_.tw-news-logo]:transform-none! [&_.tw-news-collectionText]:pt-[25px] [&_.tw-news-metadata]:mt-0 [&_.tw-news-metadata]:mb-5 [&:is(:hover,_:focus-within)_.tw-news-photo]:scale-[1.04] [&.tw-news-previewActive_.tw-news-photo]:scale-[1.04] [&:is(:hover,_:focus-within)_.tw-news-collectionDescription]:text-white! [&.tw-news-previewActive_.tw-news-collectionDescription]:text-white! motion-reduce:[&_.tw-news-photo]:scale-100! max-md:min-h-0 max-md:[&_.tw-news-photoFrame]:rounded-2xl",
  collectionMedia: "tw-news-collectionMedia",
  collectionText:
    "tw-news-collectionText [&_h3]:[font-weight:540] [&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125] [&.tw-news-collectionText_h3]:[line-height:1.12]!",
  collectionDescription:
    "tw-news-collectionDescription [margin:25px_0_18px] [color:#27272a]! [font-size:12px]! [line-height:1.12]! [transition:color_400ms_ease] max-md:[margin-top:20px] motion-reduce:[transition:none]",
  expandButton: "tw-news-expandButton mx-auto mt-[35px] max-md:mt-[25px]",
  newsletter: "tw-news-newsletter [margin-top:90px]  max-md:[margin-top:60px]",
} as const;

const categories = [
  "Exhibition",
  "Company",
  "Event",
  "Product",
  "Press",
  "Awards",
  "Career",
] as const;
type Category = (typeof categories)[number];
type NewsItem = {
  id: string;
  title: string;
  category: Category;
  date: string;
  dateLabel: string;
  image: string;
  href: string;
};

// Share the colour photo with news-detail; CSS supplies the grayscale resting state.
const news: NewsItem[] = [
  {
    id: "brazil",
    title:
      "Our SCE Series Pumps Have Been Converted into an NFPA 20-Compliant Fire Pump Set in Brazil",
    category: "Exhibition",
    date: "2025-06-10",
    dateLabel: "10/06/2025",
    image: "/news-detail/news1.jpg",
    href: "/news-detail",
  },
  {
    id: "syria",
    title: "We Participated in SYRIA BUILDEX 2025",
    category: "Exhibition",
    date: "2025-06-10",
    dateLabel: "10/06/2025",
    image: "/news-detail/news1.jpg",
    href: "/news-detail",
  },
  {
    id: "russia",
    title: "New Project Delivery | Russia – Baltic...",
    category: "Company",
    date: "2025-05-28",
    dateLabel: "28/05/2025",
    image: "/news-detail/news1.jpg",
    href: "/news-detail",
  },
  {
    id: "siee",
    title: "We proudly took part in the SIEE-Pol...",
    category: "Exhibition",
    date: "2025-05-23",
    dateLabel: "23/05/2025",
    image: "/news-detail/news1.jpg",
    href: "/news-detail",
  },
];

type SectionId = "exhibition" | "company" | "event";
type CollectionItem = NewsItem & { description: string; status: string };
const statusIcons = [
  "/news/status-scheduled.png",
  "/news/status-in-progress.png",
  "/news/status-completed.png",
];
const collectionSections = [
  {
    id: "exhibition",
    title: "Exhibition",
    filters: ["Scheduled", "In Progress", "Completed"],
  },
  {
    id: "company",
    title: "Company",
    filters: ["Announcements", "Corporate", "Investments"],
  },
  { id: "event", title: "Event", filters: [] },
] as const;

// Twelve previews per filter let every capsule exercise the six-card expansion.
const collectionNews: CollectionItem[] = collectionSections.flatMap((section) =>
  (section.filters.length ? [...section.filters] : ["Event"]).flatMap(
    (status) =>
      Array.from({ length: 12 }, (_, index) => ({
        id: `${section.id}-${status.toLowerCase().replaceAll(" ", "-")}-${index + 1}`,
        category: section.title,
        status,
        title:
          "We are Participating in IFAT Saudi Arabia (January 26–28, 2026)",
        description:
          "We are preparing to showcase the quality of Sempa Pompa at the IFAT Saudi Arabia exhibition, which will take place between January 26–28, 2026.",
        date: "2025-06-10",
        dateLabel: "10/06/2025",
        image: "/news-detail/news1.jpg",
        href: "/news-detail?article=ifat-saudi-arabia",
      })),
  ),
);

function CollectionCard({ item }: { item: CollectionItem }) {
  const [touchPreview, setTouchPreview] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <article
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      data-news-id={item.id}
      className={`${styles.featured} ${styles.collectionCard} ${touchPreview ? styles.previewActive : ""}`}
      aria-labelledby={`${item.id}-title`}
    >
      <div className={`${styles.featuredMedia} ${styles.collectionMedia}`}>
        <div className={styles.photoFrame}>
          <Image
            src={item.image}
            alt="Sempa industrial pump system"
            fill
            sizes="(min-width: 1280px) 350px, (min-width: 768px) 42vw, calc(100vw - 84px)"
            className={styles.photo}
          />
        </div>
        <Image
          src="/news/sempa-icon.png"
          alt="Sempa"
          width={192}
          height={128}
          sizes="48px"
          className={styles.logo}
        />
        <button
          type="button"
          className={styles.touchPreview}
          aria-pressed={touchPreview}
          onClick={() => setTouchPreview((value) => !value)}
          aria-label="Haber kartının renkli görünümünü göster"
        >
          {touchPreview ? "Normal görünüm" : "Renkli görünüm"}
        </button>
      </div>
      <div className={`${styles.featuredText} ${styles.collectionText}`}>
        <h3 id={`${item.id}-title`}>{item.title}</h3>
        <p className={styles.collectionDescription}>{item.description}</p>
        <div className={styles.metadata}>
          <span>{item.category}</span>
          <span className={styles.separator} aria-hidden="true" />
          <time dateTime={item.date}>{item.dateLabel}</time>
        </div>
        <SlidingCircleButton
          active={hovered || focused || touchPreview}
          href={item.href}
          className="mt-auto bg-[#f7f7f7]!"
          aria-label={`View news: ${item.title}`}
        />
      </div>
    </article>
  );
}

function NewsCollection({
  section,
  filter,
  expanded,
  onFilter,
  onExpand,
}: {
  section: (typeof collectionSections)[number];
  filter?: string;
  expanded: boolean;
  onFilter: (value: string) => void;
  onExpand: () => void;
}) {
  const items = collectionNews.filter(
    (item) =>
      item.category === section.title && (!filter || item.status === filter),
  );
  const visible = expanded ? items : items.slice(0, 6);
  return (
    <section
      className={styles.collection}
      aria-labelledby={`${section.id}-heading`}
    >
      <header className={styles.collectionHeader}>
        <h2 id={`${section.id}-heading`}>
          {section.title}
          <span aria-label={`${items.length} news`}>{items.length} News</span>
        </h2>
        {section.filters.length > 0 && (
          <div
            className={styles.filterCapsule}
            role="group"
            aria-label={`${section.title} filtreleri`}
          >
            {section.filters.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`group ${filter === option ? styles.activeFilter : ""}`}
                aria-pressed={filter === option}
                aria-controls={`${section.id}-cards`}
                onClick={() => onFilter(option)}
              >
                <Image
                  src={statusIcons[index]}
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                  className={`size-4 shrink-0 object-contain md:size-5 ${index === 0 ? "" : "group-aria-pressed:brightness-0 group-aria-pressed:invert"}`}
                />
                {option}
              </button>
            ))}
          </div>
        )}
      </header>
      <div id={`${section.id}-cards`} className={styles.collectionGrid}>
        {visible.map((item) => (
          <CollectionCard key={item.id} item={item} />
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {section.title}: {visible.length} / {items.length} haber görüntüleniyor.
      </p>
      {items.length > 6 && (
        <SlidingCircleButton
          label={expanded ? "Show Less" : "View All"}
          width={170}
          className={styles.expandButton}
          aria-expanded={expanded}
          aria-controls={`${section.id}-cards`}
          onClick={onExpand}
        />
      )}
    </section>
  );
}

function FeaturedNews({ item }: { item: NewsItem }) {
  const [touchPreview, setTouchPreview] = useState(false);
  return (
    <article
      className={`${styles.featured} ${touchPreview ? styles.previewActive : ""}`}
      aria-labelledby="featured-news-title"
    >
      <div className={styles.featuredMedia}>
        <div className={styles.photoFrame}>
          <Image
            src={item.image}
            alt="Sempa industrial pump system"
            fill
            preload
            sizes="(min-width: 1280px) 330px, (min-width: 768px) 50vw, calc(100vw - 84px)"
            className={styles.photo}
          />
        </div>
        <Image
          src="/news/sempa-icon.png"
          alt="Sempa"
          width={192}
          height={128}
          sizes="48px"
          className={styles.logo}
        />
        <button
          type="button"
          className={styles.touchPreview}
          onClick={() => setTouchPreview((value) => !value)}
          aria-pressed={touchPreview}
          aria-label="Haber kartının renkli görünümünü göster"
        >
          {touchPreview ? "Normal görünüm" : "Renkli görünüm"}
        </button>
      </div>
      <div className={styles.featuredText}>
        <h3 id="featured-news-title">{item.title}</h3>
        <div className={styles.metadata}>
          <span>{item.category}</span>
          <span className={styles.separator} aria-hidden="true" />
          <time dateTime={item.date}>{item.dateLabel}</time>
        </div>
        <SlidingCircleButton
          href={item.href}
          className="mt-auto"
          aria-label={`View news: ${item.title}`}
        />
      </div>
    </article>
  );
}

export default function NewsPage() {
  const titleRef = useRepeatingTitle();
  const pageRef = useScrollReveal(
    ".tw-news-sectionHeader, .tw-news-featured, .tw-news-smallCard, .tw-news-filters, .tw-news-empty, .tw-news-collectionHeader, .tw-news-expandButton, .tw-news-newsletter",
  );
  const [selected, setSelected] = useState<Category[]>([]);
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(
    null,
  );
  const [sectionFilters, setSectionFilters] = useState({
    exhibition: "Scheduled",
    company: "Announcements",
  });
  const filtered = news.filter(
    (item) => selected.length === 0 || selected.includes(item.category),
  );
  const featured = filtered[0];
  const latest = filtered.slice(1);
  function toggleCategory(category: Category) {
    setSelected((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    );
  }
  return (
    <main
      ref={pageRef}
      data-header-underlay
      className={`-mt-[var(--site-header-height,97px)] ${styles.page} font-sans`}
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 ref={titleRef} className={styles.title}>
          <span className="news-color-reveal">İşte dünden bugüne</span>
          <br />
          <span className="news-color-reveal news-color-reveal-last">
            Sempa’nın köklü yolculuğu
          </span>
        </h1>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .tw-news-title[data-title-revealing] .news-color-reveal {
              background-image: linear-gradient(90deg, #9eb7d0 0%, #9eb7d0 42%, rgba(158,183,208,.18) 58%, rgba(158,183,208,.18) 100%);
              background-size: 250% 100%;
              background-repeat: no-repeat;
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation-name: news-title-color-flow;
              animation-duration: 8000ms;
              animation-timing-function: cubic-bezier(.25,.1,.25,1);
              animation-fill-mode: both;
              animation-iteration-count: infinite;
            }
            .tw-news-title[data-title-revealing] .news-color-reveal-last {
              animation-name: news-title-color-flow-last;
            }
          }
          @keyframes news-title-color-flow {
            0%, 88%, 100% { background-position: 100% 0; }
            28%, 65% { background-position: 0% 0; }
          }
          @keyframes news-title-color-flow-last {
            0%, 11%, 76%, 100% { background-position: 100% 0; }
            39%, 53% { background-position: 0% 0; }
          }
        `}</style>
        <section aria-labelledby="latest-news-title">
          <header className={styles.sectionHeader}>
            <h2 id="latest-news-title">Son Yüklenen Haberler</h2>
            <p>
              Küresel fuarlar, yeni lansmanlar, sektörel seminerler...
              <br />
              Üretimin ötesine geçiyor, sektöre yön veriyoruz.
            </p>
          </header>
          <div className={styles.newsGrid}>
            <div className={styles.featuredColumn}>
              {featured ? (
                <FeaturedNews key={featured.id} item={featured} />
              ) : (
                <p className={styles.empty}>
                  Seçtiğiniz kategorilerde henüz haber bulunmuyor.
                </p>
              )}
            </div>
            <div
              className={styles.latestList}
              aria-label="Diğer güncel haberler"
            >
              {latest.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={styles.smallCard}
                >
                  <span className={styles.arrow} aria-hidden="true">
                    <FiArrowDownRight size={20} strokeWidth={3} />
                  </span>
                  <div className={styles.smallContent}>
                    <h3 title={item.title}>{item.title}</h3>
                    <div className={styles.smallMeta}>
                      <span>{item.category}</span>
                      <time dateTime={item.date}>{item.dateLabel}</time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <fieldset className={styles.filters}>
              <legend className="sr-only">Haber kategorilerini filtrele</legend>
              {categories.map((category) => (
                <label key={category} className={styles.filter}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selected.includes(category)}
                    onChange={() => toggleCategory(category)}
                    aria-controls="news-filter-status"
                  />
                  <span
                    aria-hidden="true"
                    className="grid size-[19px] shrink-0 place-items-center rounded-[4px] bg-[#9eb7d040] transition-colors peer-checked:bg-[#005eff] peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#005eff] motion-reduce:transition-none max-md:size-[17px]"
                  >
                    <FiCheck
                      className="size-[14px] text-white opacity-0"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="peer-checked:text-[#0d5792]">
                    {category}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
          <p
            id="news-filter-status"
            className="sr-only"
            role="status"
            aria-live="polite"
          >
            {filtered.length} haber görüntüleniyor.
          </p>
        </section>
        {collectionSections.map((section) => (
          <NewsCollection
            key={section.id}
            section={section}
            filter={
              section.id === "event" ? undefined : sectionFilters[section.id]
            }
            expanded={expandedSection === section.id}
            onExpand={() =>
              setExpandedSection((previous) =>
                previous === section.id ? null : section.id,
              )
            }
            onFilter={(value) => {
              if (section.id === "event") return;
              setSectionFilters((previous) => ({
                ...previous,
                [section.id]: value,
              }));
              setExpandedSection((previous) =>
                previous === section.id ? null : previous,
              );
            }}
          />
        ))}
        <div className={styles.newsletter}>
          <NewsletterSubscription />
        </div>
      </div>
    </main>
  );
}
