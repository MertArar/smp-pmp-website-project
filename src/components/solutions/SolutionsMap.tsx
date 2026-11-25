"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import SolutionsSection, {
  SOLUTION_MAP_POINTS,
  type SolutionMapPoint,
} from "@/features/home/solutions/SolutionsSection";
import useViewportVideo from "@/components/media/useViewportVideo";

export type SolutionMapDefinition = {
  id: string;
  label: string;
  /** Public image and video paths, or filenames relative to assetBase. */
  image: string;
  iconVideo: string;
  points: readonly SolutionMapPoint[];
};

// Preview layouts are intentionally fixed: changing tabs is visible and repeatable.
// Replace each image/point set independently when the remaining artwork is ready.
export const DEFAULT_SOLUTION_MAPS: readonly SolutionMapDefinition[] = [
  {
    id: "water",
    label: "Water Treatment",
    image: "solutions.webp",
    iconVideo: "Water Treatment.mp4",
    points: SOLUTION_MAP_POINTS,
  },
  {
    id: "agriculture",
    label: "Agricultural Irrigation & Drainage",
    image: "solutions.webp",
    iconVideo: "Agricultural Irrigation & Drainage.mp4",
    points: [
      { id: 1, x: 135, y: 275, label: "Irrigation intake" },
      { id: 2, x: 305, y: 140, label: "Field distribution" },
      { id: 3, x: 470, y: 285, label: "Drainage station" },
      { id: 4, x: 580, y: 100, label: "Reservoir supply" },
    ],
  },
  {
    id: "buildings",
    label: "Building Systems",
    image: "solutions.webp",
    iconVideo: "Building System.mp4",
    points: [
      { id: 1, x: 90, y: 310, label: "Coastal building supply" },
      { id: 2, x: 165, y: 160, label: "Service plant" },
      { id: 3, x: 270, y: 70, label: "Building water treatment" },
      { id: 4, x: 350, y: 235, label: "Pressure boosting" },
      { id: 5, x: 435, y: 85, label: "Cooling systems" },
      { id: 6, x: 515, y: 190, label: "Heating network" },
      { id: 7, x: 585, y: 325, label: "Urban supply" },
      { id: 8, x: 625, y: 135, label: "Elevated installations" },
      { id: 9, x: 240, y: 330, label: "Fire protection" },
    ],
  },
  {
    id: "power",
    label: "Power Plants",
    image: "solutions.webp",
    iconVideo: "powerplant.mp4",
    points: [
      { id: 1, x: 120, y: 235, label: "Process intake" },
      { id: 2, x: 285, y: 100, label: "Cooling water" },
      { id: 3, x: 400, y: 205, label: "Plant circulation" },
      { id: 4, x: 535, y: 70, label: "Energy production" },
      { id: 5, x: 605, y: 285, label: "Process discharge" },
    ],
  },
];

function TabVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useViewportVideo(ref);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="size-full object-cover"
    >
      <source data-video-src={src} type="video/mp4" />
    </video>
  );
}

export default function SolutionsMap({
  assetBase = "/pump-series",
  maps = DEFAULT_SOLUTION_MAPS,
}: {
  assetBase?: string;
  maps?: readonly SolutionMapDefinition[];
}) {
  const id = useId();
  const [selected, setSelected] = useState(maps[0]?.id);
  const active = maps.find((map) => map.id === selected) ?? maps[0];
  const tabs = useRef<HTMLDivElement>(null);
  const resolve = (file: string) =>
    file.startsWith("/") ? file : `${assetBase}/${file}`;
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = maps.findIndex((map) => map.id === active?.id);
    const next =
      event.key === "ArrowRight"
        ? (current + 1) % maps.length
        : event.key === "ArrowLeft"
          ? (current - 1 + maps.length) % maps.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? maps.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(maps[next].id);
    tabs.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }
  if (!active) return null;
  return (
    <div data-solutions-map data-map-id={active.id} className="relative">
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${active.id}`}
      >
        <SolutionsSection
          key={`${active.id}-${active.image}`}
          variant="catalog"
          assetBase={assetBase}
          mapImage={resolve(active.image)}
          mapPoints={active.points}
          waveMarkers
        />
      </div>
      <div
        ref={tabs}
        data-map-videos
        role="tablist"
        aria-label="Choose solution map"
        onKeyDown={onKeyDown}
        className="absolute bottom-[14%] left-1/2 z-30 flex -translate-x-1/2 gap-1.5 md:gap-2 lg:gap-3"
      >
        {maps.map((map) => (
          <button
            key={map.id}
            id={`${id}-${map.id}`}
            type="button"
            role="tab"
            aria-label={map.label}
            aria-selected={map.id === active.id}
            aria-controls={`${id}-panel`}
            tabIndex={map.id === active.id ? 0 : -1}
            title={map.label}
            onClick={() => setSelected(map.id)}
            className="block size-11 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/90 bg-white shadow-[0_5px_14px_#0d579225] transition-shadow aria-selected:border-[#005eff] aria-selected:shadow-[0_0_0_2px_#005eff,0_5px_18px_#005eff35] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] md:size-14 lg:size-[clamp(56px,5.1vw,71px)] motion-reduce:transition-none"
          >
            <TabVideo src={resolve(map.iconVideo)} />
          </button>
        ))}
      </div>
    </div>
  );
}
