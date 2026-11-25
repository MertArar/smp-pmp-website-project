"use client";

import AlbumPreviewtsx_Image from "next/image";
import { useRef as useAlbumPreviewtsx_Ref, useState, useEffect } from "react";
import Image from "next/image";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import SlidingCircleButton from "@/components/ui/ViewAllButton";
import useScrollReveal from "@/components/ui/useScrollReveal";

const AlbumPreviewtsx_albumImage = "/news-detail/files5.png";

function AlbumPreviewtsx_AlbumPreview({
  classNames: styles,
}: {
  classNames: Record<
    | "album"
    | "albumText"
    | "albumPhoto"
    | "viewButton"
    | "viewLabel"
    | "albumDialog"
    | "dialogHeader"
    | "dialogPhoto",
    string
  >;
}) {
  const dialog = useAlbumPreviewtsx_Ref<HTMLDialogElement>(null);
  return (
    <>
      <aside className={styles.album} aria-label="2023 Sodex Photo Album">
        <div className={styles.albumText}>
          <h3>2023 Sodex Photo Album</h3>
          <p>We were at the ISK-SODEX 2023 Istanbul exhibition.</p>
          <span>
            Latest Update / <time dateTime="2024-04-01">1.04.2024</time>
          </span>
        </div>
        <div className={styles.albumPhoto}>
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-[68%] overflow-hidden rounded-r-[20px]"
          >
            <AlbumPreviewtsx_Image
              src={AlbumPreviewtsx_albumImage}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-y-0 left-0 z-10 w-[68%] overflow-hidden rounded-r-[20px] shadow-[4px_0_5px_-2px_#00162c80,10px_0_16px_-5px_#00162c66]">
            <AlbumPreviewtsx_Image
              src={AlbumPreviewtsx_albumImage}
              alt="Sempa exhibition stand at ISK-SODEX Istanbul"
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            className={styles.viewButton}
            onClick={() => dialog.current?.showModal()}
            aria-haspopup="dialog"
            aria-label="View 2023 Sodex exhibition photo"
          >
            <Image
              src="/news-detail/eye.png"
              alt=""
              width={22}
              height={22}
              className="size-[22px] shrink-0 object-contain"
            />
            <span className={styles.viewLabel}>View</span>
          </button>
        </div>
      </aside>
      <dialog
        ref={dialog}
        className={styles.albumDialog}
        aria-labelledby="album-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className={styles.dialogHeader}>
          <h2 id="album-dialog-title">2023 Sodex Photo Album</h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close photo preview"
          >
            ×
          </button>
        </div>
        <div className={styles.dialogPhoto}>
          <figure className="relative aspect-[4/3] w-full max-w-[min(100%,calc(min(65svh,600px)*4/3))] bg-[#e9dfc9] p-3 shadow-[0_12px_36px_#382c2833] [clip-path:polygon(0_1%,18%_0,35%_0.6%,52%_0,74%_0.5%,99.5%_0,100%_22%,99.6%_44%,100%_67%,99.5%_99%,78%_100%,54%_99.4%,28%_100%,0.5%_99.5%,0_74%,0.4%_49%)] md:p-5">
            <div className="relative h-full w-full">
              <AlbumPreviewtsx_Image
                src={AlbumPreviewtsx_albumImage}
                alt="Sempa exhibition stand at ISK-SODEX Istanbul"
                fill
                sizes="(min-width:1024px) 800px, 90vw"
                className="object-contain [filter:sepia(.32)_saturate(.72)_contrast(.94)]"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_48%,#62431d33_100%),repeating-linear-gradient(0deg,#61482004_0px,#61482004_1px,transparent_1px,transparent_3px)] shadow-[inset_0_0_20px_#70502b40]"
            />
          </figure>
        </div>
      </dialog>
    </>
  );
}

// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
  page: "tw-detail-page [padding:70px_24px_110px] [color:#27272a]! [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-0.04em] [background:radial-gradient(ellipse_at_94%_14%,_#c9e4ff_0%,_transparent_49%),_radial-gradient(ellipse_at_8%_47%,_#f5faff_0%,_transparent_46%),_radial-gradient(ellipse_at_72%_80%,_#d5e9ff_0%,_transparent_55%),_linear-gradient(125deg,_#f5faff_0%,_#e6f3ff_42%,_#d5e9ff_100%)] md:max-xl:[padding-inline:40px] max-md:[padding:60px_32px_65px]",
  titleRow:
    "tw-detail-titleRow flex items-start justify-between [gap:35px] [&_h1]:[max-width:1030px] [&_h1]:m-0 [&_h1]:[font-size:clamp(28px,_2.78vw,_40px)]! [&_h1]:[line-height:1]! [&_h1]:[font-weight:410] [&_h1]:[color:#0d5792]! [&_time]:[padding-top:6px] [&_time]:whitespace-nowrap [&_time]:[font-size:15px]! [&_time]:[line-height:1.12]! md:max-xl:[gap:24px] max-md:flex-col max-md:[gap:18px] max-md:[&_h1]:[font-size:clamp(27px,_7.5vw,_38px)]! max-md:[&_time]:[order:-1] max-md:[&_time]:[font-size:15px]! max-md:[&_time]:p-0",
  hero: "tw-detail-hero relative [margin-top:45px] [height:clamp(350px,_44.444vw,_640px)] max-md:[margin:20px_-32px_0] max-md:[height:clamp(365px,_112vw,_540px)]",
  heroPhoto:
    "tw-detail-heroPhoto object-cover opacity-[0.82] [object-position:center_45%] [filter:grayscale(1)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_30%,#000_52%,transparent_100%),linear-gradient(to_right,#000e_0%,#000_2%,#000_98%,#000e_100%)] [mask-composite:intersect] max-md:[object-position:44%_center]",
  contentGrid:
    "tw-detail-contentGrid grid [grid-template-columns:minmax(0,_500fr)_minmax(0,_660fr)] [gap:40px] relative [margin-top:-300px] [align-items:start] md:max-xl:[grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] md:max-xl:[gap:24px] md:max-xl:[margin-top:-110px] max-md:[grid-template-columns:minmax(0,_1fr)] max-md:[margin-top:-15px] max-md:[gap:52px]",
  introduction:
    "tw-detail-introduction [padding-top:300px] [&_h2]:m-0 [&_h2]:[max-width:500px] [&_h2]:[font-size:clamp(34px,_3.48vw,_50px)]! [&_h2]:[line-height:1]! [&_h2]:[font-weight:410] [&_>_p]:[max-width:475px] [&_>_p]:[margin:30px_0_0] [&_>_p]:[color:#9eb7d0]! [&_>_p]:[font-size:15px]! [&_>_p]:[line-height:1.12]! md:max-xl:[padding-top:140px] md:max-xl:[&_h2]:[font-size:clamp(30px,_3.5vw,_42px)]! max-md:[padding-top:0] max-md:[&_h2]:[font-size:clamp(28px,_7.5vw,_38px)]! max-md:[&_>_p]:[margin-top:24px] max-md:[&_>_p]:[line-height:1.12]!",
  rightColumn:
    "tw-detail-rightColumn min-w-0 relative [padding-top:45px] max-md:p-0 max-md:[margin-inline:-20px]",
  blueCard:
    "tw-detail-blueCard relative isolate overflow-hidden [background:linear-gradient(180deg,#005eff_0%,#0044cc_50%,#003399_100%)] [border-radius:28px] [padding:150px_clamp(32px,_5vw,_72px)_34px] [color:#f7f7f7]! [font-size:15px]! [line-height:1.02]! [&_p]:[margin:0_0_20px] [&_ul]:[margin:0_0_20px] [&_ul]:list-disc [&_ul]:[padding-left:18px] [&_li]:[padding-left:3px] [&_li]:[margin-bottom:20px] [&_li:last-child]:mb-0 [&_strong]:[font-weight:410] [&_strong]:[font-variation-settings:'wght'_410,_'wdth'_125] [&_.tw-detail-engineeringIntro]:[color:#9eb7d0]! [&_.tw-detail-engineeringIntro]:[font-weight:540] [&_.tw-detail-engineeringIntro]:[font-variation-settings:'wght'_540,_'wdth'_125] md:max-xl:[padding:85px_28px_40px] max-md:[padding:65px_26px_38px] max-md:[font-size:16px]! max-md:[line-height:1.2]!",
  engineeringIntro: "tw-detail-engineeringIntro",
  technologyLogo:
    "tw-detail-technologyLogo [margin-top:45px] [width:min(100%,_170px)] h-auto object-contain max-md:[margin-top:120px] max-md:[width:min(100%,_160px)]",
  previewNote: "tw-detail-previewNote [opacity:0.7] [font-size:12px]!",
  slogan:
    "tw-detail-slogan [font-size:clamp(30px,_2.78vw,_40px)]! [line-height:1]! [margin:14px_0_0_clamp(32px,_5vw,_72px)] [background:linear-gradient(90deg,_#0d5792,_#9eb7d0)] [background-clip:text]! [color:transparent]! md:max-xl:[margin-left:28px] md:max-xl:[font-size:clamp(26px,_3vw,_36px)]! max-md:[margin:40px_20px_0] max-md:[font-size:clamp(29px,_8vw,_40px)]!",
  mobileSloganBreak:
    "tw-detail-mobileSloganBreak hidden max-md:[display:initial]",
  newsletter:
    "tw-detail-newsletter [margin-top:65px]  max-md:[margin-top:45px]",
  album:
    "tw-detail-album absolute left-1/2 -translate-x-1/2 [top:0] [z-index:2] grid [grid-template-columns:minmax(0,_3fr)_minmax(0,_1fr)] [width:min(540px,_calc(100%_-_30px))] [min-height:110px] [border-radius:20px] [background:#f7f7f7] [box-shadow:0_14px_36px_#1742691a] overflow-hidden md:max-xl:w-full max-md:hidden",
  albumText:
    "tw-detail-albumText flex flex-col [padding:18px_22px] [&_h3]:[font-size:22px]! [&_h3]:[font-weight:410] [&_h3]:[line-height:1]! [&_h3]:[margin:0_0_10px] [&_h3]:[background-image:linear-gradient(90deg,#aaa,#27272a)] [&_h3]:bg-clip-text [&_h3]:text-transparent! [&_p]:[font-size:11px]! [&_p]:[line-height:1.12]! [&_p]:text-[#9eb7d0] [&_p]:[margin:0_0_12px] [&_p]:mt-auto! [&_>_span]:[font-size:10px]! [&_>_span]:[color:#9eb7d0]! md:max-xl:[padding:16px] md:max-xl:[&_h3]:[font-size:16px]! max-md:[padding:17px] max-md:[&_h3]:[font-size:17px]!",
  albumPhoto:
    "tw-detail-albumPhoto [min-height:110px] relative [container-type:inline-size]",
  viewButton:
    "tw-detail-viewButton group/album-view absolute bottom-3 left-1/2 z-20 flex h-9 w-[calc(100%_-_8px)] -translate-x-1/2 items-center justify-start gap-2 rounded-[10px] border border-white/70 bg-white/20 px-3 text-[#0d5792] backdrop-blur-[10px] cursor-pointer transition-[background-color,box-shadow] duration-300 hover:bg-[#72aaff]/40 hover:shadow-[inset_0_0_20px_#8bb8ff33] focus-visible:bg-[#72aaff]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005eff] motion-reduce:transition-none",
  viewLabel:
    "tw-detail-viewLabel text-[13px]! text-[#0d5792]! transition-colors duration-300 group-hover/album-view:text-white! group-focus-visible/album-view:text-white! motion-reduce:transition-none",
  relatedCard:
    "tw-detail-relatedCard transition-colors duration-500 [&:is(:hover,_:focus-within)]:bg-[#005eff] [&:is(:hover,_:focus-within)_.tw-detail-relatedText]:text-white [&:is(:hover,_:focus-within)_.tw-detail-relatedPhoto_img]:grayscale-0 [&:is(:hover,_:focus-within)_.tw-detail-relatedPhoto_img]:scale-[1.04] motion-reduce:[&:is(:hover,_:focus-within)_.tw-detail-relatedPhoto_img]:scale-100 [&:is(:hover,_:focus-within)_.tw-detail-relatedLogo]:[filter:brightness(0)_invert(1)] [&:focus-visible]:[outline:2px_solid_#005eff] [&:focus-visible]:[outline-offset:4px] flex flex-col min-w-0 [min-height:498px] [padding:20px] [border-radius:30px] [background:#f7f7f7] motion-reduce:[transition:none]",
  related:
    "tw-detail-related [margin-top:32px] [&_>_h2]:[font-size:15px]! [&_>_h2]:[line-height:1]! [&_>_h2]:[font-weight:410] [&_>_h2]:[letter-spacing:-0.04em] [&_>_h2]:[color:#005eff]! [&_>_h2]:[margin:0_0_45px] max-md:[margin-top:38px]",
  relatedGrid:
    "tw-detail-relatedGrid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 xl:gap-5 items-stretch",
  relatedMedia: "tw-detail-relatedMedia relative shrink-0 w-full",
  relatedPhoto:
    "tw-detail-relatedPhoto relative w-full [aspect-ratio:350_/_227] [border-radius:30px] overflow-hidden [&_img]:object-cover [&_img]:grayscale [&_img]:transition-[filter,scale] [&_img]:duration-700 [&_img]:ease-out motion-reduce:[&_img]:transition-none",
  relatedLogo:
    "tw-detail-relatedLogo transition-[filter] duration-500 motion-reduce:transition-none absolute [left:0] [bottom:-7px] [width:48px] h-auto",
  relatedText:
    "tw-detail-relatedText flex flex-1 flex-col items-start min-w-0 [padding-top:25px] [&_h3]:m-0 [&_h3]:[font-size:15px]! [&_h3]:[line-height:1.12]! [&_h3]:[font-weight:540] [&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_>_p]:[margin:25px_0_18px] [&_>_p]:[font-size:12px]! [&_>_p]:[font-weight:410] [&_>_p]:[line-height:1.12]!",
  relatedMeta:
    "tw-detail-relatedMeta flex items-center [gap:10px] [margin-bottom:20px] [color:#9eb7d0]! [font-size:12px]! [line-height:1.12]!",
  relatedSeparator:
    "tw-detail-relatedSeparator [width:1px] [height:12px] [background:#9eb7d0]",
  albumDialog:
    "tw-detail-albumDialog fixed inset-0 m-auto overflow-y-auto [width:min(960px,_92vw)] [max-height:90svh] [padding:20px] [border:1px_solid_#fff] [border-radius:24px] [background:#f3efe6] [color:#0d5792]! [&::backdrop]:[background:#00162c99] [&::backdrop]:[backdrop-filter:blur(8px)]",
  dialogHeader:
    "tw-detail-dialogHeader flex justify-between items-center [gap:16px] [&_h2]:m-0 [&_h2]:[font-size:clamp(18px,_3vw,_24px)]! [&_h2]:[font-weight:410] [&_button]:[width:40px] [&_button]:[height:40px] [&_button]:[border:0] [&_button]:[border-radius:50%] [&_button]:cursor-pointer [&_button]:[background:#d5e9ff] [&_button]:[font-size:26px]!",
  dialogPhoto:
    "tw-detail-dialogPhoto relative grid place-items-center [height:min(65svh,_600px)] [margin-top:16px]",
  desktopSloganBreak: "tw-detail-desktopSloganBreak max-md:hidden",
} as const;

const relatedNews = Array.from({ length: 3 }, (_, index) => ({
  id: `ifat-preview-${index + 1}`,
  title: "We are Participating in IFAT Saudi Arabia (January 26–28, 2026)",
  description:
    "We are preparing to showcase the quality of Sempa Pompa at the IFAT Saudi Arabia exhibition, which will take place between January 26–28, 2026.",
  href: "/news-detail?article=ifat-saudi-arabia",
}));

const advantages = [
  [
    "Exceptional High Flow Capacity",
    "Designed to rapidly deliver massive volumes of water, the SCE Series meets the intense hydraulic demands required for severe fire suppression scenarios.",
  ],
  [
    "Optimized Low Hydraulic Losses",
    "Engineered with advanced fluid dynamics, the system minimizes internal friction, ensuring superior energy efficiency and sustained peak performance under extreme pressure.",
  ],
  [
    "Robust Diesel Engine Compatibility",
    "Specifically configured for seamless mechanical integration with diesel drivers, guaranteeing uninterrupted, reliable operation even during complete electrical grid failures.",
  ],
  [
    "Comprehensive NFPA 20-Compliant Infrastructure",
    "Equipped with advanced control mechanisms and rigorous testing frameworks that meet the world’s most trusted international fire safety regulations.",
  ],
] as const;

// Local preview articles keep related links usable until a news data source exists.
const articles = [
  {
    id: "ifat-saudi-arabia",
    title: "We are Participating in IFAT Saudi Arabia (January 26–28, 2026)",
    heading: "Sempa Pompa at IFAT Saudi Arabia",
    description:
      "We are preparing to showcase the quality of Sempa Pompa at the IFAT Saudi Arabia exhibition, which will take place between January 26–28, 2026.",
    image: "/news-detail/haber.webp",
  },
  {
    id: "fire-safety",
    title:
      "Our SCE Series Pumps Integrated into NFPA 20 Compliant Fire Pump Set in Brazil",
    heading:
      "Advancing Global Fire Safety: Sempa Pompa and LS Fire Collaborate on NFPA 20-Compliant Solutions",
    description:
      "We are thrilled to announce a significant milestone in our ongoing commitment to global life safety and critical infrastructure. Our esteemed partner, LS Fire, has successfully integrated Sempa Pompa's high-efficiency SCE Series double suction pumps into a state-of-the-art, diesel engine-driven fire pump set.",
    image: "/news-detail/haber.webp",
  },
  {
    id: "corrosion",
    title:
      "Corrosion-Resistant Pump Materials and Applications: A Comprehensive Guide",
    heading: "Choosing Pump Materials for Reliable Industrial Performance",
    description:
      "Corrosion can reduce the lifespan of equipment in industrial processes. Selecting pump materials starts with understanding the pumped fluid, operating temperature and maintenance requirements.",
    image: "/news-detail/news1.jpg",
  },
  {
    id: "engineering",
    title: "Engineering Reliable Pump Systems for Critical Infrastructure",
    heading: "From System Requirements to Long-Term Pump Reliability",
    description:
      "Reliable pumping begins with a clear understanding of the installation. Flow, pressure and service conditions guide equipment selection, while inspection and maintenance help sustain performance throughout its working life.",
    image: "/news-detail/haber.webp",
  },
] as const;

function RelatedNewsCard({ item }: { item: (typeof relatedNews)[number] }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <article
      className={styles.relatedCard}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      aria-labelledby={`${item.id}-title`}
    >
      <div className={styles.relatedMedia}>
        <div className={styles.relatedPhoto}>
          <Image
            src="/news-detail/news1.jpg"
            alt="Sempa industrial pump system"
            fill
            sizes="(min-width: 1280px) 350px, (min-width: 768px) 42vw, calc(100vw - 84px)"
          />
        </div>
        <Image
          src="/news-detail/sempa-icon.png"
          alt="Sempa"
          width={192}
          height={128}
          className={styles.relatedLogo}
          sizes="48px"
        />
      </div>
      <div className={styles.relatedText}>
        <h3 id={`${item.id}-title`}>{item.title}</h3>
        <p>{item.description}</p>
        <div className={styles.relatedMeta}>
          <span>Exhibition</span>
          <span className={styles.relatedSeparator} aria-hidden="true" />
          <time dateTime="2025-06-10">10/06/2025</time>
        </div>
        <SlidingCircleButton
          active={hovered || focused}
          href={item.href}
          className="mt-auto bg-[#f7f7f7]!"
          aria-label={`View news: ${item.title}`}
        />
      </div>
    </article>
  );
}

export default function NewsDetailPage({ article }: { article?: string }) {
  const pageRef = useScrollReveal(
    ".tw-detail-titleRow, .tw-detail-hero, .tw-detail-introduction, .tw-detail-album, .tw-detail-blueCard, .tw-detail-slogan, .tw-detail-related > h2, .tw-detail-relatedCard, .tw-detail-newsletter",
  );
  const selected =
    articles.find((item) => item.id === article) ??
    articles.find((item) => item.id === "fire-safety")!;
  const featured = selected.id === "fire-safety";
  useEffect(() => {
    const hero = pageRef.current?.querySelector<HTMLElement>(".tw-detail-hero");
    const card = pageRef.current?.querySelector<HTMLElement>(
      ".tw-detail-blueCard",
    );
    if (!hero || !card) return;
    // Layout offsets ignore entrance-animation transforms, so the two photo crops line up.
    const position = (element: HTMLElement) => {
      let left = 0,
        top = 0;
      for (
        let node: HTMLElement | null = element;
        node;
        node = node.offsetParent as HTMLElement | null
      ) {
        left += node.offsetLeft;
        top += node.offsetTop;
      }
      return { left, top };
    };
    const measure = () => {
      const source = position(hero),
        target = position(card);
      card.style.setProperty(
        "--card-photo-left",
        `${source.left - target.left}px`,
      );
      card.style.setProperty(
        "--card-photo-top",
        `${source.top - target.top}px`,
      );
      card.style.setProperty("--card-photo-width", `${hero.clientWidth}px`);
      card.style.setProperty("--card-photo-height", `${hero.clientHeight}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    observer.observe(card);
    return () => observer.disconnect();
  }, [pageRef, selected.image]);
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
      <article
        className="mx-auto w-full max-w-[1200px]"
        aria-labelledby="news-title"
      >
        <header className={styles.titleRow}>
          <h1 id="news-title">{selected.title}</h1>
          <time dateTime="2025-06-10">June 10, 2025</time>
        </header>

        <div className={styles.hero}>
          <Image
            src={selected.image}
            alt="Sempa industrial pump system"
            fill
            preload
            sizes="(min-width: 1440px) 1200px, (min-width: 768px) 90vw, 100vw"
            className={styles.heroPhoto}
          />
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.introduction}>
            <h2>{selected.heading}</h2>
            <p>{selected.description}</p>
          </div>
          <div className={styles.rightColumn}>
            <AlbumPreviewtsx_AlbumPreview
              classNames={{
                album: styles.album,
                albumText: styles.albumText,
                albumPhoto: styles.albumPhoto,
                viewButton: styles.viewButton,
                viewLabel: styles.viewLabel,
                albumDialog: styles.albumDialog,
                dialogHeader: styles.dialogHeader,
                dialogPhoto: styles.dialogPhoto,
              }}
            />
            <div className={styles.blueCard}>
              {/* Match the reference's blue-tinted photograph, without washing out the blue with white alpha. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-60 mix-blend-multiply [mask-image:linear-gradient(#000_0%,#000_12%,transparent_30%)]"
              >
                <div
                  className="absolute"
                  style={{
                    left: "var(--card-photo-left,0px)",
                    top: "var(--card-photo-top,0px)",
                    width: "var(--card-photo-width,1200px)",
                    height: "var(--card-photo-height,640px)",
                  }}
                >
                  <Image
                    src={selected.image}
                    alt=""
                    fill
                    sizes="(min-width:1440px) 1200px, 90vw"
                    className="object-cover [object-position:center_45%] grayscale"
                  />
                </div>
              </div>
              {featured ? (
                <>
                  <p>
                    This robust system has been meticulously engineered to
                    achieve full compliance with the rigorous NFPA 20 standards,
                    ensuring uncompromising performance in emergency situations.
                  </p>
                  <p className={styles.engineeringIntro}>
                    The integration of the SCE Series brings several critical
                    engineering advantages to fire protection systems:
                  </p>
                  <ul>
                    {advantages.map(([label, text]) => (
                      <li key={label}>
                        <strong>{label}:</strong> {text}
                      </li>
                    ))}
                  </ul>
                  <p>
                    At Sempa Pompa, we recognize that emergency systems leave no
                    room for error. We are immensely proud to contribute to
                    global fire protection networks by providing engineering
                    solutions that protect both lives and investments.
                  </p>
                </>
              ) : (
                <>
                  <p>{selected.description}</p>
                  <p>
                    Review the installation’s operating conditions alongside the
                    equipment documentation. A suitable system combines
                    correctly selected pumps, compatible components and a
                    maintenance plan suited to the application.
                  </p>
                  <p>
                    Regular inspections and performance checks help identify
                    changes in operating conditions and support reliable
                    service.
                  </p>
                  <p className={styles.previewNote}>
                    Engineering preview article
                  </p>
                </>
              )}
              <Image
                src="/news-detail/im-pump-technology.png"
                alt="IM PUMP TECHNOLOGY"
                width={441}
                height={84}
                className={styles.technologyLogo}
              />
            </div>
            <p className={styles.slogan}>
              A força da água
              <br className={styles.mobileSloganBreak} /> é a
              <br className={styles.desktopSloganBreak} /> nossa força!
            </p>
          </div>
        </div>
      </article>

      <section
        className={`${styles.related} mx-auto w-full max-w-[1200px]`}
        aria-labelledby="related-title"
      >
        <h2 id="related-title">RELATED NEWS</h2>
        <div className={styles.relatedGrid}>
          {relatedNews.map((item) => (
            <RelatedNewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <div className={`${styles.newsletter} mx-auto w-full max-w-[1200px]`}>
        <NewsletterSubscription />
      </div>
    </main>
  );
}
