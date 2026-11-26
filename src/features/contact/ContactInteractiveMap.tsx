"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number;
  longitude: number;
  location: string;
};

type RoadProperties = Record<string, unknown>;
type VectorGridFactory = {
  protobuf: (
    url: string,
    options: Record<string, unknown>,
  ) => import("leaflet").Layer;
};

const INITIAL_ZOOM = 15.1;
const RETURN_DISTANCE_METERS = 1_500;

// Thin luminous strokes, from the diffused edge to the white centre.
const luminousRoadStrokes = [
  {
    color: "#a7c6ff",
    weight: 4.1,
    opacity: 0.06,
    className: "sempa-road-halo-outer",
  },
  {
    color: "#dce9ff",
    weight: 2.3,
    opacity: 0.13,
    className: "sempa-road-halo-inner",
  },
  {
    color: "#f6fbff",
    weight: 1.35,
    opacity: 0.71,
    className: "sempa-road-light",
  },
  { color: "#ffffff", weight: 0.7, opacity: 1, className: "sempa-road-core" },
] as const;

const vectorTiles =
  "https://tiles.openfreemap.org/planet/latest/{z}/{x}/{y}.pbf";

// These labels reproduce the placement and restrained typography in the
// supplied Figma viewport. The roads underneath remain actual map features.
const figmaLabels = [
  { x: 0.568, y: 0.545, text: "Sempa Pompa<br/>Makina A.Ş.", width: 108 },
  {
    x: 0.184,
    y: 0.507,
    text: "ACV Süspansiyon<br/>Sistemleri A.Ş.",
    width: 115,
  },
  {
    x: 0.208,
    y: 0.779,
    text: "AVD Otomotiv<br/>Endüstri San. ve Tic. A.Ş.",
    width: 148,
  },
  { x: 0.833, y: 0.697, text: "Butkon Asansör", width: 103 },
  { x: 0.927, y: 0.857, text: "Çınar İtfaiye", width: 95 },
  { x: 0.661, y: 0.278, text: "İlko İlaç", width: 80 },
] as const;

export default function ContactInteractiveMap({
  latitude,
  longitude,
  location,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [failed, setFailed] = useState(false);
  const [showReturnButton, setShowReturnButton] = useState(false);
  const [creditsExpanded, setCreditsExpanded] = useState(true);

  // Keep the legally required map attribution visible at first, then reduce
  // it to an unobtrusive information button after five seconds.
  useEffect(() => {
    const timer = window.setTimeout(() => setCreditsExpanded(false), 5_000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let leafletMap: import("leaflet").Map | null = null;
    let observer: ResizeObserver | null = null;

    const initialize = async () => {
      const leafletModule = await import("leaflet");
      const L = ((
        leafletModule as unknown as { default?: typeof leafletModule }
      ).default ?? leafletModule) as typeof leafletModule & {
        vectorGrid?: VectorGridFactory;
      };

      // VectorGrid's browser build registers itself on Leaflet.
      (window as Window & { L?: typeof L }).L = L;
      if (disposed) return;

      const map = L.map(container, {
        center: [latitude, longitude],
        zoom: INITIAL_ZOOM,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        attributionControl: false,
        preferCanvas: false,
      });
      leafletMap = map;
      mapRef.current = map;

      const headquarters = L.latLng(latitude, longitude);
      const updateReturnButton = () => {
        setShowReturnButton(
          map.getCenter().distanceTo(headquarters) > RETURN_DISTANCE_METERS ||
            map.getZoom() < 13.5,
        );
      };
      map.on("moveend zoomend", updateReturnButton);

      // Dark raster underlay keeps a legible real map visible even while the
      // separately styled vector streets are loading.
      L.tileLayer(
        "https://basemap.queeniemella.cc/tiles/countries/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
          opacity: 0.44,
        },
      ).addTo(map);

      try {
        await import("leaflet.vectorgrid");
      } catch (error) {
        console.warn(
          "Vector street styling is unavailable; showing the dark base map.",
          error,
        );
      }
      if (disposed) return;

      const gridFactory = L.vectorGrid;
      if (!gridFactory) {
        console.warn(
          "Leaflet VectorGrid is unavailable; showing the dark base map.",
        );
        return;
      }

      const hidden = { stroke: false, fill: false, opacity: 0, fillOpacity: 0 };
      const roadStyle = (properties: RoadProperties, zoom: number) => {
        const roadClass = String(properties.class ?? "");
        const bright = [
          "motorway",
          "trunk",
          "primary",
          "secondary",
          "tertiary",
        ].includes(roadClass);
        if (!bright) {
          return [
            {
              color: "#59616d",
              weight: zoom >= 16 ? 1.1 : 0.8,
              opacity: 0.55,
              lineCap: "round",
              lineJoin: "round",
              className: "sempa-road-muted",
            },
          ];
        }

        // VectorGrid supports multiple stroke passes per single real road.
        // Separate diffuse / close / hot passes create the luminous Figma look
        // even on renderers where CSS SVG drop-shadows are unavailable.
        const scale = zoom >= 16 ? 1.1 : 1;
        return luminousRoadStrokes.map((stroke) => ({
          ...stroke,
          weight: stroke.weight * scale,
          lineCap: "round",
          lineJoin: "round",
        }));
      };

      const styles = new Proxy(
        {
          water: {
            fill: true,
            stroke: false,
            fillColor: "#0e141c",
            fillOpacity: 1,
          },
          landcover: {
            fill: true,
            stroke: false,
            fillColor: "#141a21",
            fillOpacity: 0.5,
          },
          landuse: (properties: RoadProperties) => ({
            fill: true,
            stroke: false,
            fillColor:
              properties.class === "industrial" ? "#151b23" : "#171c24",
            fillOpacity: 0.82,
          }),
          building: {
            fill: true,
            stroke: true,
            fillColor: "#192028",
            fillOpacity: 0.65,
            color: "#424a53",
            weight: 0.55,
            opacity: 0.58,
          },
          transportation: roadStyle,
          waterway: { color: "#202833", weight: 1, opacity: 0.55 },
        },
        {
          get(target, key) {
            if (typeof key !== "string") return Reflect.get(target, key);
            return Reflect.get(target, key) ?? hidden;
          },
        },
      );

      const svgTiles = (
        L.svg as typeof L.svg & {
          tile?: (...args: unknown[]) => unknown;
        }
      ).tile;

      gridFactory
        .protobuf(vectorTiles, {
          vectorTileLayerStyles: styles,
          maxNativeZoom: 14,
          maxZoom: 19,
          interactive: false,
          ...(svgTiles ? { rendererFactory: svgTiles } : {}),
        })
        .addTo(map);

      // Position the surrounding industrial-site labels at the same relative
      // screen locations as the supplied design, then bind them to the map.
      const dimensions = map.getSize();
      for (const label of figmaLabels) {
        const anchor = map.containerPointToLatLng([
          label.x * dimensions.x,
          label.y * dimensions.y,
        ]);
        L.marker(anchor, {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({
            className: "sempa-map-label",
            html: label.text,
            iconSize: [label.width, 30],
            iconAnchor: [label.width / 2, 15],
          }),
        }).addTo(map);
      }

      observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
      observer.observe(container);
      updateReturnButton();
    };

    void initialize().catch((error: unknown) => {
      if (!disposed) {
        console.error("Contact map could not initialize:", error);
        setFailed(true);
      }
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      leafletMap?.remove();
      if (mapRef.current === leafletMap) mapRef.current = null;
    };
  }, [latitude, longitude, location]);

  return (
    <>
      <div
        ref={containerRef}
        className="contact-live-map absolute inset-0 z-0 h-full w-full bg-[#10141b]"
        role="region"
        aria-label={`${location} interactive map`}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_45%_55%,transparent_20%,rgba(4,8,14,0.32)_100%)]"
        aria-hidden="true"
      />
      {showReturnButton && (
        <button
          type="button"
          onClick={() =>
            mapRef.current?.flyTo([latitude, longitude], INITIAL_ZOOM, {
              animate: true,
              duration: 1.1,
            })
          }
          className="absolute left-4 top-4 z-[3] inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/45 bg-[#122c4e]/90 px-3.5 py-2.5 text-xs font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-lg transition-colors hover:bg-[#1b4877] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84bbff]"
          aria-label="Sempa Pompa konumuna geri dön"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-[#459dff]"
          >
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          Konuma Dön
        </button>
      )}
      <div className="absolute bottom-2 right-2 z-[3] text-right">
        {creditsExpanded && (
          <div className="mb-1 rounded-md bg-[#101923]/90 px-2.5 py-1.5 text-[10px] leading-4 text-[#c1cbd7] shadow-lg backdrop-blur-md">
            ©{" "}
            <a
              className="underline decoration-white/30 hover:text-white"
              href="https://queeniemella.cc/"
              target="_blank"
              rel="noopener noreferrer"
            >
              queeniemella
            </a>
            {" · "}©{" "}
            <a
              className="underline decoration-white/30 hover:text-white"
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap
            </a>
            {" · "}©{" "}
            <a
              className="underline decoration-white/30 hover:text-white"
              href="https://openfreemap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenFreeMap
            </a>
          </div>
        )}
        <button
          type="button"
          aria-label="Harita kaynaklarını göster veya gizle"
          aria-expanded={creditsExpanded}
          onClick={() => setCreditsExpanded((current) => !current)}
          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[#0e1622]/60 text-[11px] font-semibold text-[#b9c6d6] backdrop-blur-sm transition-colors hover:bg-[#1b3048] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          i
        </button>
      </div>
      {failed && (
        <p className="pointer-events-none absolute bottom-3 left-3 z-[2] rounded-lg bg-[#122c4e]/95 px-3 py-2 text-xs text-white">
          Map could not load. Please use Get Directions.
        </p>
      )}
      <style>{`
        .contact-live-map.leaflet-container { background: #10141b; }
        .contact-live-map .leaflet-pane svg path.sempa-road-core,
        .contact-live-map .leaflet-pane svg path[stroke="#ffffff"] {
          filter: drop-shadow(0 0 0.55px rgba(255,255,255,0.9))
                  drop-shadow(0 0 1.2px rgba(238,245,255,0.75))
                  drop-shadow(0 0 1.8px rgba(186,213,255,0.38));
        }
        .contact-live-map .sempa-map-label {
          color: rgba(199,207,216,0.73);
          font-size: 9px;
          line-height: 1.1;
          font-weight: 400;
          letter-spacing: -0.025em;
          text-align: center;
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0,0,0,0.65);
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
