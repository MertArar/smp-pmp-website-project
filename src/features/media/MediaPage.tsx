"use client";

import { useState as useMediaTabstsx_State } from "react";
import type { MouseEvent as MediaTabstsx_MouseEvent } from "react";
import MediaTabstsx_Link from "next/link";
import { useRouter as useMediaTabstsx_Router } from "next/navigation";
import { LuArrowUpRight as MediaTabstsx_ArrowUpRight } from "react-icons/lu";
import ResourceGridtsx_Image from "next/image";
import Videotsx_Image from "next/image";
import { useState as useVideotsx_State } from "react";

import Phototsx_Image from "next/image";
import { createPortal as Phototsx_createPortal } from "react-dom";
import {
  useEffect as usePhototsx_Effect,
  useRef as usePhototsx_Ref,
  useState as usePhototsx_State,
} from "react";

import {
  LuChevronLeft as Phototsx_ChevronLeft,
  LuChevronRight as Phototsx_ChevronRight,
  LuX as Phototsx_X,
} from "react-icons/lu";
import Link from "next/link";

import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useScrollReveal from "@/components/ui/useScrollReveal";

type MediaTabstsx_MediaTab =
  | "all-catalog"
  | "video"
  | "photo"
  | "user-manuals"
  | "documents-certification"
  | "pump-control-panel";

type MediaTabstsx_MediaTabsProps = {
  tab: MediaTabstsx_MediaTab;
};

type MediaTabstsx_TabItem = {
  id: MediaTabstsx_MediaTab;
  href: string;
  lines: string[];
};

const MediaTabstsx_mediaTabs: MediaTabstsx_TabItem[] = [
  {
    id: "all-catalog",
    href: "/media/all-catalog",
    lines: ["All", "Catalog"],
  },
  {
    id: "video",
    href: "/media/video",
    lines: ["Video"],
  },
  {
    id: "photo",
    href: "/media/photo",
    lines: ["Photo"],
  },
  {
    id: "user-manuals",
    href: "/media/user-manuals",
    lines: ["User", "Manuals"],
  },
  {
    id: "documents-certification",
    href: "/media/documents-certification",
    lines: ["Document &", "Certification"],
  },
  {
    id: "pump-control-panel",
    href: "/media/pump-control-panel",
    lines: ["Pump Control Panel", "User Manuals"],
  },
];

function MediaTabstsx_MediaTabs({ tab }: MediaTabstsx_MediaTabsProps) {
  const router = useMediaTabstsx_Router();
  const [visualTab, setVisualTab] =
    useMediaTabstsx_State<MediaTabstsx_MediaTab>(tab);
  const [previousTab, setPreviousTab] = useMediaTabstsx_State(tab);
  if (previousTab !== tab) {
    setPreviousTab(tab);
    setVisualTab(tab);
  }
  function handleTabClick(
    event: MediaTabstsx_MouseEvent<HTMLAnchorElement>,
    item: MediaTabstsx_TabItem,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      item.id === tab
    )
      return;
    event.preventDefault();
    setVisualTab(item.id);
    router.push(item.href, { scroll: false });
  }
  return (
    <nav
      aria-label="Media categories"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 xl:gap-[calc(16*var(--media-unit))]"
    >
      {MediaTabstsx_mediaTabs.map((item) => {
        const active = visualTab === item.id;
        return (
          <MediaTabstsx_Link
            key={item.id}
            href={item.href}
            aria-current={tab === item.id ? "page" : undefined}
            onClick={(event) => handleTabClick(event, item)}
            className={`${item.id === "documents-certification" || item.id === "pump-control-panel" ? "max-xl:order-first" : ""} group relative flex min-h-[60px] min-w-0 items-center justify-between gap-1 rounded-[11px] border border-white/40 px-[clamp(10px,4vw,24px)] py-2 text-[clamp(10px,2.7vw,14px)] leading-[1.05] tracking-[-0.04em] shadow-[2px_15px_24px_rgba(0,94,255,0.10)] transition-[background,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF] motion-reduce:transition-none xl:min-h-[calc(64*var(--media-unit))] xl:rounded-[calc(10*var(--media-unit))] xl:px-[calc(20*var(--media-unit))] xl:py-[calc(12*var(--media-unit))] xl:text-[calc(12*var(--media-unit))] ${active ? "bg-linear-to-b from-[#005EFF] to-[#001EA2] text-white" : "bg-linear-to-b from-white to-white/20 text-[#005EFF] hover:shadow-[2px_15px_24px_rgba(0,94,255,0.2)]"}`}
          >
            <span
              className={`min-w-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none ${active ? "text-white" : "text-[#005EFF]"}`}
            >
              {item.lines.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </span>
            <span
              aria-hidden="true"
              className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border border-white/25 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none xl:size-[calc(21*var(--media-unit))] ${active ? "bg-white/20" : "bg-linear-to-br from-[#438BFF] via-[#005EFF] to-[#0038BF] shadow-[0_0_16px_rgba(0,94,255,.65)]"}`}
            >
              <MediaTabstsx_ArrowUpRight
                className={`size-5 xl:size-[calc(18*var(--media-unit))] text-white transition-transform duration-300 motion-reduce:transition-none ${active ? "rotate-90" : ""}`}
              />
            </span>
          </MediaTabstsx_Link>
        );
      })}
    </nav>
  );
}

function ResourceGridtsx_ResourceGrid({
  kind,
}: {
  kind: "catalog" | "manual" | "document" | "control";
}) {
  const catalog = kind === "catalog";
  const certificate = kind === "document";
  const title = catalog
    ? "Sempa Product Catalog"
    : certificate
      ? "Certificate of Conformity 475"
      : "TKF-M Series User Manual";
  const image = certificate ? "/media/sertifika.webp" : "/media/catalog01.png";
  return (
    <section
      aria-label={
        catalog
          ? "Sempa catalogs"
          : certificate
            ? "Documents and Certifications"
            : kind === "control"
              ? "Pump Control Panel User Manuals"
              : "User Manuals"
      }
      className="mx-auto grid max-w-[640px] grid-cols-1 gap-y-[calc(100*var(--media-card-unit))] lg:max-w-none lg:grid-cols-2 lg:gap-x-[calc(36*var(--media-unit))] lg:gap-y-[calc(125*var(--media-unit))] lg:pl-[calc(58*var(--media-unit))] lg:pr-[calc(100*var(--media-unit))]"
    >
      {Array.from({ length: 10 }, (_, index) => (
        <article key={index} className="relative min-w-0">
          <div className="flex min-h-[calc(135*var(--media-card-unit))] w-[62%] flex-col justify-center rounded-[calc(20*var(--media-card-unit))] bg-[#F7F7F7] px-[calc(20*var(--media-card-unit))] py-[calc(16*var(--media-card-unit))] lg:min-h-[calc(98*var(--media-unit))] lg:w-[80%] lg:justify-start lg:rounded-[calc(15*var(--media-unit))] lg:px-[calc(15*var(--media-unit))] lg:py-[calc(17*var(--media-unit))]">
            <h2
              className={`m-0 bg-linear-to-r from-[#27272A]/35 to-[#27272A]/85 bg-clip-text text-[calc(27*var(--media-card-unit))] leading-[1.07] tracking-[-0.04em] text-transparent lg:text-[calc(21*var(--media-unit))] ${catalog ? "" : "lg:mt-[calc(22*var(--media-unit))]"}`}
            >
              {title}
            </h2>
            {catalog && (
              <p className="mt-[calc(6*var(--media-card-unit))] mb-0 text-[calc(11*var(--media-card-unit))] leading-tight tracking-[-0.04em] text-[#9EB7D0] lg:text-[calc(10*var(--media-unit))]">
                2023 Sempa General Product Catalog
              </p>
            )}
          </div>
          <div
            className={`pointer-events-none absolute right-0 top-[calc(-35*var(--media-card-unit))] h-[calc(190*var(--media-card-unit))] w-[45%] lg:right-0 lg:top-[calc(-45*var(--media-unit))] lg:h-[calc(190*var(--media-unit))] lg:w-[43%] ${certificate ? "mix-blend-multiply" : ""}`}
          >
            <ResourceGridtsx_Image
              src={image}
              alt={`${title} cover`}
              fill
              sizes="(min-width:1024px) 16vw, (min-width:768px) 290px, 42vw"
              className="object-contain"
              draggable={false}
            />
          </div>
          <div className="mt-[calc(47*var(--media-card-unit))] flex flex-col items-center gap-[calc(24*var(--media-card-unit))] lg:mt-[calc(14*var(--media-unit))] lg:flex-row lg:justify-between lg:gap-[calc(10*var(--media-unit))] lg:pr-[calc(25*var(--media-unit))] lg:pl-[calc(18*var(--media-unit))]">
            <p className="m-0 shrink-0 text-[calc(13*var(--media-card-unit))] leading-none tracking-[-0.04em] lg:text-[calc(10*var(--media-unit))]">
              Latest Update
              <br />
              25.09.2025
            </p>
            <div className="flex w-[84%] min-w-0 gap-[calc(12*var(--media-card-unit))] lg:w-auto lg:gap-[calc(8*var(--media-unit))]">
              {(["View", "Download"] as const).map((action) => (
                <button
                  key={action}
                  type="button"
                  aria-label={`${action} ${title}`}
                  className="group flex h-[calc(43*var(--media-card-unit))] min-w-0 flex-1 cursor-pointer items-center justify-center gap-[calc(6*var(--media-card-unit))] rounded-[calc(10*var(--media-card-unit))] border border-white/75 bg-white/20 px-[calc(9*var(--media-card-unit))] text-[calc(16*var(--media-card-unit))] leading-none shadow-[5px_8px_19px_rgba(0,94,255,.15)] backdrop-blur-[9px] transition-[background,color,box-shadow] duration-300 hover:bg-[#8AB8FF] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005EFF] motion-reduce:transition-none lg:h-[calc(31*var(--media-unit))] lg:w-[calc(124*var(--media-unit))] lg:flex-none lg:text-[calc(12*var(--media-unit))]"
                >
                  <ResourceGridtsx_Image
                    src={
                      action === "View"
                        ? "/media/eye.png"
                        : "/media/download.png"
                    }
                    alt=""
                    width={32}
                    height={32}
                    className="size-[calc(27*var(--media-card-unit))] shrink-0 lg:size-[calc(23*var(--media-unit))]"
                  />
                  <span className="text-[calc(16*var(--media-card-unit))] lg:text-[calc(12*var(--media-unit))]">
                    {action}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function AllCatalogtsx_AllCatalog() {
  return <ResourceGridtsx_ResourceGrid kind="catalog" />;
}

// ==========================================
// VIDEO CONTAINER SETTINGS
// ==========================================
// Figma: 590.94px × 287.1px

// Figma radius: 14.77px

// VIDEO THUMBNAIL
const Videotsx_VIDEO_THUMBNAIL = "/media/video-picture.webp";

// FIGMA DARK OVERLAY

const Videotsx_VIDEO_OVERLAY_OPACITY = 0.65;

// Video oynarken koyuluk
const Videotsx_VIDEO_PLAYING_OVERLAY_OPACITY = 0.24;

// X EKSENİ — İKİ KART ARASI

// Y EKSENİ — MOBİL KART ARASI

// SAĞDAKİ VİDEONUN YATAY KONUMU

// ==========================================
// VIDEO PREVIEW SETTINGS
// ==========================================
// HomeVideo.tsx'de kullanılan mevcut video.
// YouTube videosundan farklıysa bu yolu
// ilgili yüksek çözünürlüklü MP4 ile değiştir.
const Videotsx_VIDEO_PREVIEW_SRC = "/media/media-video.mp4";

// PLAY BUTONUNUN AÇACAĞI YOUTUBE ADRESİ
const Videotsx_VIDEO_YOUTUBE_URL =
  "https://www.youtube.com/watch?v=1_9TgKu6hpk";

// Thumbnail / video geçişi

// ==========================================
// BOTTOM GLASSMORPHISM SETTINGS
// ==========================================

// ==========================================
// VIDEO TITLE SETTINGS
// ==========================================

// ==========================================
// BOTTOM DESCRIPTION SETTINGS
// ==========================================

// ==========================================
// SEMPA ICON SETTINGS
// ==========================================
const Videotsx_VIDEO_ICON = "/media/sempa-icon.png";

// ==========================================
// PLAY BUTTON SETTINGS
// ==========================================
// Figma: 79.63px × 79.63px

// ==========================================
// PLAY HOVER ANIMATION
// ==========================================
// ==========================================
// VIDEO CARDS
// ==========================================
const Videotsx_videoCards = [
  {
    id: 1,
    title: "Watch the Promotional Video",
    description: "Sempa Pump Manufacturing Plant Promotional Video",
  },
  {
    id: 2,
    title: "Watch the Promotional Video",
    description: "Sempa Pump Manufacturing Plant Promotional Video",
  },
];

// ==========================================
// CARD STYLE
// ==========================================

// ==========================================
// BOTTOM GLASS STYLE
// ==========================================

// ==========================================
// VIDEO TITLE STYLE
// ==========================================

// ==========================================
// BOTTOM DESCRIPTION STYLE
// ==========================================

// ==========================================
// SEMPA ICON STYLE
// ==========================================

// ==========================================
// PLAY BUTTON STYLE
// ==========================================

// ==========================================
// PLAY BUTTON HOVER STYLES
// ==========================================
const Videotsx_videoPlayButtonClassName = `
  group
  absolute
  flex
  items-center
  justify-center
  rounded-[50%]
  cursor-pointer
  border-0

  shadow-[0_0_38.67px_rgba(0,88,240,0.75)]

  transition-[transform,box-shadow]
  duration-[700ms]
  ease-[cubic-bezier(0.22,1,0.36,1)]

  hover:scale-[1.045]
  hover:shadow-[0_0_46px_rgba(0,88,240,0.82)]

  active:scale-[0.985]

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-white
  focus-visible:ring-offset-2
  focus-visible:ring-offset-[#0D5792]

  motion-reduce:transition-none
`;

const Videotsx_videoPlayInnerClassName = `
  relative
  flex
  h-[66%]
  w-[66%]
  items-center
  justify-center
  rounded-full
  border
  border-[#86B4F0]/70
  bg-white/20
  backdrop-blur-md

  transition-[background-color,transform]
  duration-[700ms]
  ease-[cubic-bezier(0.22,1,0.36,1)]

  group-hover:scale-[1.025]
  group-hover:bg-white/25

  motion-reduce:transition-none
`;

// ==========================================
// VIDEO COMPONENT
// ==========================================
function Videotsx_Video() {
  // Üzerine gelinen kart
  const [hoveredVideoId, setHoveredVideoId] = useVideotsx_State<number | null>(
    null,
  );
  // Oynamaya başlamış video
  const [readyVideoId, setReadyVideoId] = useVideotsx_State<number | null>(
    null,
  );
  // ========================================
  // HOVER EVENTS
  // ========================================
  const handleVideoEnter = (videoId: number) => {
    setReadyVideoId(null);
    setHoveredVideoId(videoId);
  };
  const handleVideoLeave = (videoId: number) => {
    setHoveredVideoId((current) => (current === videoId ? null : current));
    setReadyVideoId((current) => (current === videoId ? null : current));
  };
  return (
    <section
      aria-label="Sempa Videos"
      className="relative mx-auto w-full max-w-[640px] lg:max-w-none"
    >
      {/* ==================================
              VIDEO GRID
          ================================== */}

      <div className="grid w-full grid-cols-1 lg:grid-cols-2 [column-gap:1.258333vw] [row-gap:24px] [justify-items:stretch]">
        {Videotsx_videoCards.map((video, index) => {
          const isHovered = hoveredVideoId === video.id;
          const isReady = readyVideoId === video.id;
          const showPreview = isHovered && isReady;
          return (
            <article
              key={video.id}
              className={
                `
                relative
                min-w-0

                ${index === 1 ? "lg:translate-x-[var(--video-right-shift)]" : ""}
              ` +
                " [position:relative] [width:100%] [aspect-ratio:590.94_/_287.1] [border-radius:19.69px] [overflow:hidden] [--video-right-shift:0px]"
              }
              onMouseEnter={() => handleVideoEnter(video.id)}
              onMouseLeave={() => handleVideoLeave(video.id)}
            >
              {/* ==================================
                      VIDEO THUMBNAIL
                  ================================== */}

              <div
                className="pointer-events-none absolute inset-0 z-[7] [transition:opacity_550ms_cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: showPreview ? 0 : 1,
                }}
              >
                <Videotsx_Image
                  src={Videotsx_VIDEO_THUMBNAIL}
                  alt="Sempa promotional video thumbnail"
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                  draggable={false}
                />
              </div>

              {/* ==================================
                      LOCAL MP4 HOVER PREVIEW
    
                      - No YouTube interface
                      - Muted autoplay
                      - Continuous loop
                      - Stops on mouse leave
                  ================================== */}

              {isHovered && (
                <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
                  <video
                    src={Videotsx_VIDEO_PREVIEW_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    aria-hidden="true"
                    tabIndex={-1}
                    onPlaying={() => {
                      setReadyVideoId(video.id);
                    }}
                    onError={() => {
                      setReadyVideoId(null);
                    }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}

              {/* ==================================
                      FIGMA DARK OVERLAY
                  ================================== */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 [background-color:#27272A] [transition:opacity_600ms_cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: showPreview
                    ? Videotsx_VIDEO_PLAYING_OVERLAY_OPACITY
                    : Videotsx_VIDEO_OVERLAY_OPACITY,
                }}
              />

              {/* ==================================
                      BOTTOM GLASSMORPHISM
                  ================================== */}

              <div
                aria-hidden="true"
                className="[position:absolute] [left:0] [right:0] [bottom:0] [width:100%] [height:21.783%] [background-color:rgba(255,_255,_255,_0.10)] [backdrop-filter:blur(21.67px)] [-webkit-backdrop-filter:blur(21.67px)] [z-index:20] [pointer-events:none]"
              />

              {/* ==================================
                      VIDEO TITLE
                  ================================== */}

              <h2 className="[position:absolute] [top:13.138%] [left:6.03%] [width:65%] [max-width:calc(100%_-_12%)] [min-height:66.67px] [margin:0] [font-family:var(--font-sf-pro),_sans-serif]! [font-weight:410]! [font-style:normal] [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [font-synthesis:none] [font-size:clamp(18px,_4.15vw,_calc(25_*_var(--media-card-unit)))]! [line-height:100%]! [letter-spacing:0] [color:#FFFFFF]! [z-index:30]">
                Watch the
                <span className="block">Promotional Video</span>
              </h2>

              {/* ==================================
                      SEMPA ICON
                  ================================== */}

              <div className="[position:absolute] [top:84.305%] [left:3.369%] [width:8%] [height:12%] [z-index:30] [pointer-events:none]">
                <Videotsx_Image
                  src={Videotsx_VIDEO_ICON}
                  alt=""
                  fill
                  sizes="59px"
                  quality={100}
                  className="object-contain"
                  draggable={false}
                />
              </div>

              {/* ==================================
                      BOTTOM DESCRIPTION
                  ================================== */}

              <p className="[position:absolute] [top:84.671%] [left:12.944%] [width:60%] [max-width:calc(100%_-_15%)] [min-height:37.33px] [margin:0] [font-family:var(--font-sf-pro),_sans-serif]! [font-weight:410]! [font-style:normal] [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [font-synthesis:none] [font-size:clamp(9px,_2.1vw,_calc(13_*_var(--media-card-unit)))]! [line-height:112%]! [letter-spacing:-0.04em] [color:#9EB7D0]! [z-index:30] [pointer-events:none]">
                <span className="block">Sempa Pump Manufacturing</span>

                <span className="block">Plant Promotional Video</span>
              </p>

              {/* ==================================
                      PLAY BUTTON
    
                      CLICK → YOUTUBE NEW TAB
                  ================================== */}

              <a
                href={Videotsx_VIDEO_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${video.description} on YouTube`}
                className={
                  Videotsx_videoPlayButtonClassName +
                  " [position:absolute] [top:64.6%] [right:6.9%] [width:13.475%] [aspect-ratio:1_/_1] [display:flex]! [align-items:center] [justify-content:center] [padding:1.4px] [border:none] [border-radius:50%] [background:linear-gradient(145deg,_#0D5792_0%,_#0058F0_100%)] [z-index:40] [cursor:pointer]"
                }
              >
                {/* OUTER BLUE CIRCLE */}
                <span className="relative flex h-full w-full items-center justify-center rounded-full [background:linear-gradient(145deg,_#205CB1_0%,_#173885_100%)]">
                  {/* INNER GLASS CIRCLE */}
                  <span className={Videotsx_videoPlayInnerClassName}>
                    {/* WHITE PLAY ICON */}
                    <svg
                      width="42%"
                      height="42%"
                      viewBox="0 0 30 34"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 2.5C4 1.1 5.6 0.3 6.8 1L28 14.5C29.2 15.3 29.2 17.1 28 17.9L6.8 31.4C5.6 32.2 4 31.3 4 29.9V2.5Z"
                        fill="#F7F7F7"
                      />
                    </svg>
                  </span>
                </span>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type Phototsx_PhotoItem = {
  id: number;
  title: string;
  description: string;
  updateDate: string;
};

type Phototsx_PhotoLayer = {
  src: string;
  left: string;
  width: string;
  radius: string;
  shadow: string;
  zIndex: number;
};

const Phototsx_GALLERY_ARROW_SIZE = 42;

const Phototsx_GALLERY_CLOSE_SIZE = 30;

// ==========================================
// PHOTO CONTENT
// ==========================================
const Phototsx_photos: Phototsx_PhotoItem[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: index + 1,
    title: "2023 Sodex Photo Album",
    description: "We were at the ISK-SODEX 2023 Istanbul exhibition.",
    updateDate: "1.04.2024",
  }),
);

// ==========================================
// THREE OVERLAPPING PHOTO LAYERS
// ==========================================
const Phototsx_photoLayers: Phototsx_PhotoLayer[] = [
  {
    src: "/media/media-photo01.jpg",
    left: "-8.4%",
    width: "49.45%",
    radius: "22px",
    shadow: "7.33px 0px 11.31px 0px rgba(0,0,0,0.50)",
    zIndex: 3,
  },
  {
    src: "/media/media-photo02.jpg",
    left: "14.6%",
    width: "49.45%",
    radius: "22px",
    shadow: "7.33px 0px 5.87px 0px rgba(0,0,0,0.25)",
    zIndex: 2,
  },
  {
    src: "/media/media-photo03.jpg",
    left: "50.55%",
    width: "49.45%",
    radius: "17px",
    shadow: "none",
    zIndex: 1,
  },
];

// ==========================================
// TYPOGRAPHY
// ==========================================

// ==========================================
// GALLERY CONTROL STYLES
// ==========================================
const Phototsx_galleryControlClassName = `
  flex
  items-center
  justify-center
  cursor-pointer
  border-0
  bg-transparent
  p-0
  text-[#0D5792]
  transition-[transform,color,opacity]
  duration-[350ms]
  ease-[cubic-bezier(0.22,1,0.36,1)]
  hover:scale-[1.15]
  hover:text-[#005EFF]
  active:scale-[0.95]
  focus-visible:outline
  focus-visible:outline-2
  focus-visible:outline-offset-4
  focus-visible:outline-[#005EFF]
  motion-reduce:transition-none
`;

const Phototsx_galleryCloseClassName = `
  flex
  items-center
  justify-center
  cursor-pointer
  border-0
  bg-transparent
  p-0
  text-[#0D5792]
  transition-[transform,color,opacity]
  duration-[350ms]
  ease-[cubic-bezier(0.22,1,0.36,1)]
  hover:rotate-90
  hover:scale-[1.15]
  hover:text-[#005EFF]
  active:scale-[0.95]
  focus-visible:outline
  focus-visible:outline-2
  focus-visible:outline-offset-4
  focus-visible:outline-[#005EFF]
  motion-reduce:transition-none
`;

// ==========================================
// COMPONENT
// ==========================================
function Phototsx_Photo() {
  const [activeAlbum, setActiveAlbum] =
    usePhototsx_State<Phototsx_PhotoItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = usePhototsx_State(0);
  const galleryRef = usePhototsx_Ref<HTMLDivElement | null>(null);
  const closeButtonRef = usePhototsx_Ref<HTMLButtonElement | null>(null);
  const openerButtonRef = usePhototsx_Ref<HTMLButtonElement | null>(null);
  // ========================================
  // OPEN GALLERY
  // ========================================
  const openGallery = (
    album: Phototsx_PhotoItem,
    opener: HTMLButtonElement,
  ) => {
    openerButtonRef.current = opener;
    setActiveImageIndex(0);
    setActiveAlbum(album);
  };
  // ========================================
  // CLOSE GALLERY
  // ========================================
  const closeGallery = () => {
    setActiveAlbum(null);
  };
  // ========================================
  // NEXT IMAGE
  // ========================================
  const nextImage = () => {
    setActiveImageIndex(
      (current) => (current + 1) % Phototsx_photoLayers.length,
    );
  };
  // ========================================
  // PREVIOUS IMAGE
  // ========================================
  const previousImage = () => {
    setActiveImageIndex(
      (current) =>
        (current - 1 + Phototsx_photoLayers.length) %
        Phototsx_photoLayers.length,
    );
  };
  // ========================================
  // KEYBOARD / SCROLL LOCK
  // ========================================
  usePhototsx_Effect(() => {
    if (!activeAlbum) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveAlbum(null);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveImageIndex(
          (current) => (current + 1) % Phototsx_photoLayers.length,
        );
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveImageIndex(
          (current) =>
            (current - 1 + Phototsx_photoLayers.length) %
            Phototsx_photoLayers.length,
        );
        return;
      }
      if (event.key === "Tab") {
        const buttons = galleryRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not([disabled])",
        );
        if (!buttons || buttons.length === 0) {
          return;
        }
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      openerButtonRef.current?.focus();
    };
  }, [activeAlbum]);
  // ========================================
  // IMAGE COUNTER
  // ========================================
  const currentImageNumber = String(activeImageIndex + 1).padStart(2, "0");
  const totalImageNumber = String(Phototsx_photoLayers.length).padStart(2, "0");
  const activeImage = Phototsx_photoLayers[activeImageIndex];
  return (
    <>
      {/* ====================================
              PHOTO GRID
          ==================================== */}
      <section
        aria-label="Sempa Photo Albums"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-[calc(22*var(--media-unit))]"
      >
        {Phototsx_photos.map((photo) => (
          <article
            key={photo.id}
            className="relative min-w-0 overflow-hidden rounded-[clamp(18px,4.2vw,24px)] bg-[#F7F7F7] max-lg:mx-auto max-lg:w-full max-lg:max-w-[640px] lg:rounded-[calc(18*var(--media-unit))]"
          >
            <div className="relative z-10 flex min-h-[clamp(125px,24vw,156px)] w-[70%] flex-col p-[clamp(14px,4.2vw,24px)] max-lg:py-[clamp(12px,2.8vw,16px)] lg:min-h-[calc(110*var(--media-unit))] lg:w-[67%] lg:p-[calc(17*var(--media-unit))]">
              <h2 className="m-0 bg-linear-to-r from-[#27272A]/35 to-[#27272A]/85 bg-clip-text text-[clamp(20px,4.88vw,28px)] leading-[1.07] tracking-[-0.04em] text-transparent lg:text-[calc(20*var(--media-unit))]">
                <span className="max-lg:block">2023 Sodex</span>{" "}
                <span className="max-lg:block">Photo Album</span>
              </h2>
              <p className="mt-2 mb-0 max-w-[27ch] text-[clamp(11px,2.44vw,14px)] leading-[1.1] text-[#9EB7D0] lg:mt-auto lg:max-w-none lg:pt-[calc(18*var(--media-unit))] lg:text-[calc(10*var(--media-unit))]">
                {photo.description}
              </p>
              <p className="mt-2 mb-0 whitespace-nowrap text-[clamp(9px,2.27vw,13px)] leading-tight text-[#0D5792] lg:text-[calc(10*var(--media-unit))]">
                Latest Update / {photo.updateDate}
              </p>
            </div>
            <div className="absolute inset-y-0 right-0 h-full w-[30%] overflow-hidden lg:w-[33.24%]">
              {Phototsx_photoLayers.map((layer, index) => (
                <div
                  key={layer.src}
                  className={`absolute top-0 h-full overflow-hidden ${index < 2 ? "max-lg:hidden" : "max-lg:left-0! max-lg:w-full!"}`}
                  style={{
                    left: layer.left,
                    width: layer.width,
                    zIndex: layer.zIndex,
                    borderTopRightRadius: layer.radius,
                    borderBottomRightRadius: layer.radius,
                    boxShadow: layer.shadow,
                  }}
                >
                  <Phototsx_Image
                    src={layer.src}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 20vw, 400px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label={`View ${photo.title}`}
              onClick={(event) => openGallery(photo, event.currentTarget)}
              className="absolute right-[3%] bottom-[8%] z-20 flex h-[clamp(34px,8.4vw,48px)] w-[42%] cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/20 text-[#0D5792] shadow-[5px_8px_19px_rgba(0,94,255,.15)] backdrop-blur-[9px] transition-colors duration-300 hover:bg-[#8AB8FF] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005EFF] motion-reduce:transition-none lg:right-[4.986%] lg:bottom-[12%] lg:h-[calc(34*var(--media-unit))] lg:w-[23.268%]"
            >
              <Phototsx_Image
                src="/media/eye.png"
                alt=""
                width={32}
                height={32}
                className="size-[clamp(25px,6.3vw,36px)] lg:size-[calc(25*var(--media-unit))]"
              />
              <span className="text-[clamp(14px,3.5vw,20px)] lg:text-[calc(14*var(--media-unit))]">
                View
              </span>
            </button>
          </article>
        ))}
      </section>{" "}
      {/* ====================================
              FULLSCREEN PHOTO GALLERY
          ==================================== */}
      {activeAlbum &&
        typeof document !== "undefined" &&
        Phototsx_createPortal(
          <div
            ref={galleryRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-gallery-title"
            className="fixed inset-0 z-[9999] overflow-hidden [background:linear-gradient(_125deg,_rgba(255,255,255,0.76)_0%,_rgba(242,248,255,0.57)_48%,_rgba(255,255,255,0.72)_100%_)] [backdrop-filter:blur(38px)_saturate(160%)] [-webkit-backdrop-filter:blur(38px)_saturate(160%)] [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.45)]"
          >
            {/* GLASS LIGHT EFFECT */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background:radial-gradient(_ellipse_65%_65%_at_15%_5%,_rgba(255,255,255,0.38),_transparent_75%_)]"
            />

            {/* ALBUM TITLE */}
            <header className="absolute left-5 right-5 top-5 z-40 flex items-start justify-between gap-5 sm:left-10 sm:right-10 sm:top-7">
              <div className="min-w-0">
                <p className="mb-2 text-[11px] uppercase tracking-[0.20em] text-[#6A91BC]">
                  Photo Album
                </p>

                <h2
                  id="photo-gallery-title"
                  className="m-0 text-[22px] leading-tight text-[#0D5792] sm:text-[30px] [font-family:var(--font-sf-pro),_sans-serif]! [font-style:normal] [font-weight:410]! [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [font-synthesis:none] [letter-spacing:-0.04em]"
                >
                  {activeAlbum.title}
                </h2>
              </div>

              {/* CLOSE BUTTON */}
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close photo gallery"
                onClick={closeGallery}
                className={
                  Phototsx_galleryCloseClassName +
                  " [width:44px] [height:44px] [flex-shrink:0]"
                }
              >
                <Phototsx_X
                  size={Phototsx_GALLERY_CLOSE_SIZE}
                  strokeWidth={1.7}
                />
              </button>
            </header>

            {/* LARGE PHOTO — ORIGINAL VERSION */}
            <div className="absolute z-10 [top:88px] [bottom:68px] [left:clamp(14px,_3.8vw,_72px)] [right:clamp(14px,_3.8vw,_72px)]">
              <Phototsx_Image
                key={activeImage.src}
                src={activeImage.src}
                alt={`${activeAlbum.title} - Photo ${activeImageIndex + 1} of ${Phototsx_photoLayers.length}`}
                fill
                sizes="(max-width: 768px) 100vw, 1800px"
                quality={100}
                priority
                draggable={false}
                className="object-contain [filter:drop-shadow(0_18px_28px_rgba(24,64,106,0.16))]"
              />
            </div>

            {/* PREVIOUS ARROW */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={previousImage}
              className={`
                absolute
                left-3
                top-1/2
                z-40
                h-14
                w-14
                -translate-y-1/2
                sm:left-6
                ${Phototsx_galleryControlClassName}
              `}
            >
              <Phototsx_ChevronLeft
                size={Phototsx_GALLERY_ARROW_SIZE}
                strokeWidth={1.6}
              />
            </button>

            {/* NEXT ARROW */}
            <button
              type="button"
              aria-label="Next photo"
              onClick={nextImage}
              className={`
                absolute
                right-3
                top-1/2
                z-40
                h-14
                w-14
                -translate-y-1/2
                sm:right-6
                ${Phototsx_galleryControlClassName}
              `}
            >
              <Phototsx_ChevronRight
                size={Phototsx_GALLERY_ARROW_SIZE}
                strokeWidth={1.6}
              />
            </button>

            {/* PHOTO COUNTER */}
            <div
              className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center gap-3 tabular-nums sm:bottom-7 [font-family:var(--font-sf-pro),_sans-serif]! [font-style:normal] [font-weight:410]! [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [font-synthesis:none] [letter-spacing:-0.04em]"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-[22px] text-[#0D5792]">
                {currentImageNumber}
              </span>

              <span className="text-[16px] text-[#8BA8C6]">/</span>

              <span className="text-[22px] text-[#8BA8C6]">
                {totalImageNumber}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function UserManualstsx_UserManuals() {
  return <ResourceGridtsx_ResourceGrid kind="manual" />;
}

function PumpControlPaneltsx_PumpControlPanel() {
  return <ResourceGridtsx_ResourceGrid kind="control" />;
}

function Documentstsx_Documents() {
  return <ResourceGridtsx_ResourceGrid kind="document" />;
}

const titles: Record<MediaTabstsx_MediaTab, string> = {
  "all-catalog": "All Catalog",
  video: "Video",
  photo: "Photo",
  "user-manuals": "User Manuals",
  "documents-certification": "Document & Certification",
  "pump-control-panel": "Pump Control Panel User Manuals",
};

export default function MediaPage({
  tab = "all-catalog",
}: {
  tab?: MediaTabstsx_MediaTab;
}) {
  const pageRef = useScrollReveal("[data-media-reveal], article");
  return (
    <main
      ref={pageRef}
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] relative min-h-svh w-full pb-20 text-[#0D5792] [--media-unit:1px] lg:[--media-unit:clamp(0.7px,0.0694444444vw,1.777778px)] [--media-card-unit:clamp(0.65px,0.185185vw,1.3px)] xl:[--media-unit:clamp(0.833333px,0.0694444444vw,1.777778px)] xl:[--media-card-unit:var(--media-unit)] xl:pb-[calc(70*var(--media-unit))] [font-family:var(--font-sf-pro),_sans-serif]! [font-weight:410]! [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [background:radial-gradient(ellipse_85%_90%_at_12%_42%,rgba(244,249,255,.75),rgba(235,245,255,.35)_55%,transparent),linear-gradient(110deg,#E7F2FD,#DDEEFF_38%,#D3E8FF_70%,#CBE3FF)]"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className="mx-auto w-5/6 pt-8 xl:pt-[calc(62*var(--media-unit))]">
        <div
          data-media-reveal
          className="flex flex-col items-center gap-6 text-center xl:flex-row xl:items-center xl:justify-between xl:gap-[calc(24*var(--media-unit))] xl:text-left"
        >
          <div className="min-w-0 xl:shrink-0">
            <h1
              className={`m-0 text-[clamp(28px,7.4vw,40px)] leading-[1.02] tracking-[-0.04em] xl:text-[calc(36*var(--media-unit))] ${tab === "pump-control-panel" ? "max-xl:mx-auto max-xl:max-w-[8.3em]" : ""}`}
            >
              {titles[tab]}
            </h1>
            <nav
              aria-label="Breadcrumb"
              className="mt-[calc(12*var(--media-unit))] hidden text-[calc(12*var(--media-unit))] leading-tight text-[#9EB7D0] xl:block"
            >
              <Link href="/">Home</Link> &gt;<Link href="/media">Media</Link>{" "}
              &gt;{" "}
              <span aria-current="page">
                {tab === "all-catalog" ? "Catalog" : titles[tab]}
              </span>
            </nav>
          </div>
          <p className="m-0 max-w-[36ch] text-[clamp(16px,3.9vw,21px)] leading-[1.05] tracking-[-0.04em] text-[#9EB7D0] xl:max-w-none xl:text-right xl:text-[calc(15*var(--media-unit))]">
            Discover the world of Sempa through videos, photos, and news.
          </p>
        </div>
        <div
          data-media-reveal
          className="mt-12 xl:mt-[calc(38*var(--media-unit))]"
        >
          <MediaTabstsx_MediaTabs tab={tab} />
        </div>
        <div
          key={tab}
          className={`mt-[calc(100*var(--media-card-unit))] ${tab === "video" ? "xl:mt-[calc(94*var(--media-unit))]" : tab === "photo" ? "xl:mt-[calc(66*var(--media-unit))]" : "xl:mt-[calc(82*var(--media-unit))]"}`}
        >
          {tab === "all-catalog" && <AllCatalogtsx_AllCatalog />}
          {tab === "video" && <Videotsx_Video />}
          {tab === "photo" && <Phototsx_Photo />}
          {tab === "user-manuals" && <UserManualstsx_UserManuals />}
          {tab === "pump-control-panel" && (
            <PumpControlPaneltsx_PumpControlPanel />
          )}
          {tab === "documents-certification" && <Documentstsx_Documents />}
        </div>
        <div
          data-media-reveal
          className="mt-24 xl:mt-[calc(120*var(--media-unit))]"
        >
          <NewsletterSubscription />
        </div>
      </div>
    </main>
  );
}
