"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { prepareFactoryScene } from "./factoryScene";

// =====================================================
// DESIGN / ASSETS
// =====================================================

const MODEL_URL = "/production/fabrika.glb";

const DESIGN_W = 1920;
const DESIGN_H = 1080;

const EXTRA_GAP = 25;
const CONTENT_VERTICAL_OFFSET = 130;

const PIN_W = 72;
const PIN_H = 96;

const SF_PRO_FONT = "var(--font-sf-pro), sans-serif";

// =====================================================
// INNOVATION — RESPONSIVE SETTINGS
// =====================================================

const HEADER_HEIGHT = 92;

const INNOVATION_DESIGN_WIDTH = 1440;
const INNOVATION_DESIGN_HEIGHT = 1090;

const INNOVATION_START_Y = 869;

const INNOVATION_HORIZONTAL_PADDING = 32;
const INNOVATION_VERTICAL_PADDING = 32;

const INNOVATION_SCROLL_SCREENS = 2.85;

// =====================================================
// CARD & IMAGE SETTINGS
// =====================================================

const CARD_SCALE = 1.12;

const PART_IMAGE = {
  top: 1025,
  left: 34,

  width: 690,
  height: 569,

  shadowX: 0,
  shadowY: 28,
  shadowBlur: 23.4,
} as const;

const ARROW_IMAGES = {
  black: "/production/black-arrow.png",
  white: "/production/white-arrow.png",
} as const;

// =====================================================
// CARD STYLE
// =====================================================

const CARD_STYLE = {
  width: 468,
  height: 227,
  radius: 30,

  paddingTop: 37,
  paddingRight: 31,
  paddingBottom: 37,
  paddingLeft: 31,

  gap: 12,

  titleWidth: 192,
  titleHeight: 56,
  titleFontSize: 25,
  titleFontWeight: 540,
  titleLineHeight: 1.12,

  paragraphWidth: 202,
  paragraphHeight: 153,
  paragraphFontSize: 15,
  paragraphFontWeight: 410,
  paragraphLineHeight: 1,
  paragraphLetterSpacing: "-0.04em",

  arrowSize: 28,
} as const;

// =====================================================
// INNOVATION CARDS
// =====================================================

type InnovationCardData = {
  id: string;
  title: string;
  description: string;

  top: number;
  left: number;

  background: string;
  color: string;
  dark: boolean;

  shadow?: string;
};

const INNOVATION_CARDS: readonly InnovationCardData[] = [
  {
    id: "vision",
    title: "Continuous R&D Vision",
    description:
      "We continuously invest in research and development to shape the future of fluid technologies, taking innovative steps that set global standards.",
    top: 869,
    left: 176,
    background: "#F7F7F7",
    color: "#27272A",
    dark: false,
  },
  {
    id: "engineering",
    title: "Advanced Engineering & Simulation",
    description:
      "Utilizing Computational Fluid Dynamics (CFD) and advanced 3D modeling, we optimize and perfect our designs in a virtual environment prior to production.",
    top: 960,
    left: 541,
    background: "#F7F7F7",
    color: "#27272A",
    dark: false,
    shadow: "0 18px 32px rgba(0, 0, 0, 0.13)",
  },
  {
    id: "efficiency",
    title: "Maximum Energy Efficiency",
    description:
      "Driven by a sustainable ecosystem goal, we engineer hydraulic structures using modern approaches to deliver peak performance with minimum energy consumption.",
    top: 1114,
    left: 814,
    background: "#F7F7F7",
    color: "#27272A",
    dark: false,
    shadow: "0 18px 32px rgba(0, 0, 0, 0.12)",
  },
  {
    id: "materials",
    title: "Innovative Material Technology",
    description:
      "We integrate premium alloys into our manufacturing processes, ensuring minimal friction loss and long-lasting durability to withstand the harshest industrial conditions.",
    top: 1308,
    left: 721,
    background: "#4B8FBC",
    color: "#FFFFFF",
    dark: true,
    shadow: "0 20px 36px rgba(22, 82, 130, 0.25)",
  },
  {
    id: "solutions",
    title: "Custom & Industry-Specific Solutions",
    description:
      "Going beyond standard production molds, we develop tailored designs that precisely meet the specialized fluid transfer demands of international industries.",
    top: 1498,
    left: 541,
    background: "#005EFF",
    color: "#FFFFFF",
    dark: true,
    shadow: "0 20px 36px rgba(0, 66, 190, 0.25)",
  },
  {
    id: "performance",
    title: "Comprehensive Performance Analysis",
    description:
      "Every innovative concept we design undergoes rigorous testing and validation processes in our advanced facilities to ensure reliability and performance.",
    top: 1599,
    left: 176,
    background: "#F7F7F7",
    color: "#27272A",
    dark: false,
    shadow: "0 16px 32px rgba(0, 0, 0, 0.10)",
  },
];

// =====================================================
// FACTORY CONFIG
// =====================================================

const HIGHLIGHT_MIN_Y = 0.035;
const HIGHLIGHT_MAX_Y = 0.85;

const FRONT_FACE_Z = 2.35;
const FULL_VOLUME_BACK_Z = -3.55;

type SectionConfig = {
  id: string;
  label: string;
  image: string;

  minX: number;
  maxX: number;
  markerX: number;

  highlightMode: "front" | "volume";
};

const SECTIONS: readonly SectionConfig[] = [
  {
    id: "foundry",
    label: "Foundry",
    image: "/production/foundry.jpeg",
    minX: -3.65,
    maxX: -1.97,
    markerX: -2.95,
    highlightMode: "front",
  },
  {
    id: "mold",
    label: "Mold",
    image: "/production/mold.jpeg",
    minX: -2,
    maxX: -0.74,
    markerX: -1.4,
    highlightMode: "front",
  },
  {
    id: "design",
    label: "Innovation & Design",
    image: "/production/design.jpeg",
    minX: -0.74,
    maxX: 0.5,
    markerX: -0.18,
    highlightMode: "front",
  },
  {
    id: "park",
    label: "Machine Park",
    image: "/production/park.jpeg",
    minX: 0.5,
    maxX: 1.5,
    markerX: 1.3,
    highlightMode: "front",
  },
  {
    id: "test",
    label: "Testing",
    image: "/production/test.jpeg",
    minX: 1.48,
    maxX: 3.85,
    markerX: 2.5,
    highlightMode: "front",
  },
];

const INITIAL_SECTION = 2;

const CAMERA_POSITION: [number, number, number] = [5, 1.35, 10];

const CAMERA_TARGET: [number, number, number] = [0, 0.42, 0];

const POLAR = Math.atan2(
  Math.hypot(
    CAMERA_POSITION[0] - CAMERA_TARGET[0],
    CAMERA_POSITION[2] - CAMERA_TARGET[2],
  ),
  CAMERA_POSITION[1] - CAMERA_TARGET[1],
);

// =====================================================
// RESPONSIVE HELPERS
// =====================================================

const xPercent = (value: number) => `${(value / DESIGN_W) * 100}%`;

const yPercent = (value: number) => `${(value / DESIGN_H) * 100}%`;

const cqw = (value: number) => `${(value / DESIGN_W) * 100}cqw`;

// =====================================================
// FACTORY HELPERS
// =====================================================

function getSectionCenterX(section: SectionConfig) {
  return (section.minX + section.maxX) / 2;
}

function nearestSection(x: number): number {
  const hitIndex = SECTIONS.findIndex(
    (section) => x >= section.minX && x <= section.maxX,
  );

  if (hitIndex !== -1) return hitIndex;

  return SECTIONS.reduce((best, section, index) => {
    const bestCenter = getSectionCenterX(SECTIONS[best]);

    const currentCenter = getSectionCenterX(section);

    return Math.abs(currentCenter - x) < Math.abs(bestCenter - x)
      ? index
      : best;
  }, 0);
}

// =====================================================
// STUDIO ENVIRONMENT
// =====================================================

function StudioEnvironment() {
  const room = useMemo(() => new RoomEnvironment(), []);

  useEffect(() => {
    return () => room.dispose();
  }, [room]);

  return (
    <Environment frames={1} resolution={256} environmentIntensity={0.78}>
      <primitive object={room} dispose={null} />
    </Environment>
  );
}

// =====================================================
// FACTORY MARKER
// =====================================================

function FactoryMarker({ x }: { x: number }) {
  return (
    <Html
      position={[x, 0.805, 2.85]}
      center
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "relative",
          width: cqw(PIN_W),
          height: cqw(PIN_H),
          transform: "translateY(-50%)",
          pointerEvents: "none",
          filter: "drop-shadow(0 5px 9px rgba(0,75,210,0.18))",
        }}
      >
        <Image
          src="/production/pin.png"
          alt="Selected factory section"
          fill
          unoptimized
          draggable={false}
          sizes={`${PIN_W}px`}
          style={{
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
    </Html>
  );
}

// =====================================================
// FACTORY HIGHLIGHT
// =====================================================

function FactoryHighlight({ activeSection }: { activeSection: number }) {
  const { scene } = useGLTF(MODEL_URL);

  const overlays = useMemo(() => {
    const selected = SECTIONS[activeSection];

    const createOverlay = (clippingPlanes: THREE.Plane[]) => {
      const material = new THREE.MeshBasicMaterial({
        color: "#25F45F",
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
        side: THREE.DoubleSide,
        clippingPlanes,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -4,
        toneMapped: false,
      });

      const cloned = scene.clone(true);

      cloned.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        object.material = material;
        object.renderOrder = 2;
        object.raycast = () => {};
      });

      return { scene: cloned, material };
    };

    if (selected.highlightMode === "front") {
      return [
        createOverlay([
          new THREE.Plane(new THREE.Vector3(1, 0, 0), -selected.minX),
          new THREE.Plane(new THREE.Vector3(-1, 0, 0), selected.maxX),
          new THREE.Plane(new THREE.Vector3(0, 1, 0), -HIGHLIGHT_MIN_Y),
          new THREE.Plane(new THREE.Vector3(0, -1, 0), HIGHLIGHT_MAX_Y),
          new THREE.Plane(new THREE.Vector3(0, 0, 1), -FRONT_FACE_Z),
        ]),
      ];
    }

    return [
      createOverlay([
        new THREE.Plane(new THREE.Vector3(1, 0, 0), -selected.minX),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), selected.maxX),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), -HIGHLIGHT_MIN_Y),
        new THREE.Plane(new THREE.Vector3(0, -1, 0), HIGHLIGHT_MAX_Y),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), -FULL_VOLUME_BACK_Z),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), FRONT_FACE_Z),
      ]),
    ];
  }, [scene, activeSection]);

  useEffect(() => {
    return () => {
      overlays.forEach(({ material }) => {
        material.dispose();
      });
    };
  }, [overlays]);

  return (
    <group>
      {overlays.map((overlay, index) => (
        <primitive
          key={`${activeSection}-${index}`}
          object={overlay.scene}
          dispose={null}
        />
      ))}
    </group>
  );
}

// =====================================================
// FACTORY MODEL
// =====================================================

type FactoryProps = {
  activeSection: number;
  hoveredSection: number | null;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
};

function FactoryModel({
  activeSection,
  hoveredSection,
  onSelect,
  onHover,
}: FactoryProps) {
  const { scene } = useGLTF(MODEL_URL);

  const factory = useMemo(() => prepareFactoryScene(scene), [scene]);

  useEffect(
    () => () => {
      factory.materials.forEach((material) => material.dispose());

      factory.geometries.forEach((geometry) => geometry.dispose());
    },
    [factory],
  );

  return (
    <group>
      <primitive
        object={factory.scene}
        dispose={null}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect(nearestSection(event.point.x));
        }}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();

          const section = nearestSection(event.point.x);

          if (hoveredSection !== section) {
            onHover(section);
          }
        }}
        onPointerOut={() => onHover(null)}
      />

      <FactoryHighlight activeSection={activeSection} />

      <FactoryMarker x={SECTIONS[activeSection].markerX} />
    </group>
  );
}

// =====================================================
// FACTORY VIEWER
// =====================================================

function FactoryViewer(props: FactoryProps) {
  return (
    <div
      className="absolute z-20"
      style={{
        top: "60%",
        left: "56.303%",
        width: "82%",
        height: "40%",
        transform: "translateX(-50%)",
        touchAction: "pan-y",
        pointerEvents: "auto",
      }}
    >
      <Canvas
        camera={{
          position: CAMERA_POSITION,
          fov: 18.5,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.75]}
        frameloop="demand"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, invalidate }) => {
          gl.localClippingEnabled = true;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.setClearColor(0x000000, 0);
          invalidate();
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          cursor: props.hoveredSection === null ? "grab" : "pointer",
        }}
        onPointerMissed={() => props.onHover(null)}
      >
        <StudioEnvironment />

        <ambientLight intensity={0.24} color="#FFFFFF" />

        <hemisphereLight args={["#FFFFFF", "#FFFFFF", 0.35]} />

        <directionalLight
          position={[5, 8, 7]}
          intensity={1.05}
          color="#FFFFFF"
        />

        <directionalLight
          position={[-5, 4, -3]}
          intensity={0.18}
          color="#FFFFFF"
        />

        <Suspense fallback={null}>
          <FactoryModel {...props} />
        </Suspense>

        <OrbitControls
          makeDefault
          target={CAMERA_TARGET}
          enableRotate
          minPolarAngle={POLAR}
          maxPolarAngle={POLAR}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.065}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}

// =====================================================
// FIRST COMPONENT — FACTORY HERO
// =====================================================

function ProductionHero(props: FactoryProps) {
  return (
    <section
      className="pointer-events-none relative mx-auto"
      style={{
        width: "100%",
        maxWidth: DESIGN_W,
        aspectRatio: `${DESIGN_W} / ${DESIGN_H}`,
        containerType: "inline-size",
        isolation: "isolate",
      }}
    >
      {/* HEADING */}

      <h1
        className="pointer-events-none absolute z-30 m-0 text-center"
        style={{
          top: yPercent((200 * DESIGN_H) / 1024 - CONTENT_VERTICAL_OFFSET),
          left: xPercent((473 * DESIGN_W) / 1440),
          width: xPercent((494 * DESIGN_W) / 1440),
          height: yPercent((50 * DESIGN_H) / 1024),
          fontFamily: SF_PRO_FONT,
          fontSize: cqw(67),
          fontWeight: 410,
          fontStretch: "expanded",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          overflow: "visible",
        }}
      >
        <span
          className="inline-block bg-gradient-to-b from-[#005EFF] to-[#001EA2] bg-clip-text text-transparent"
          style={{
            lineHeight: 1.1,
            paddingBottom: "0.12em",
          }}
        >
          Innovation &amp; Design
        </span>
      </h1>

      {/* PRODUCTION IMAGE */}

      <section
        className="pointer-events-none absolute z-0"
        aria-label="Production visual"
        style={{
          top: yPercent(
            (282 * DESIGN_H) / 1024 + EXTRA_GAP - CONTENT_VERTICAL_OFFSET,
          ),
          left: xPercent((203 * DESIGN_W) / 1440),
          width: xPercent(1371),
          height: yPercent(585),
          borderRadius: cqw((30 * DESIGN_W) / 1440),
          isolation: "isolate",
        }}
      >
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            borderRadius: "inherit",
            backgroundColor: "#E8EEF7",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 77%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 77%, transparent 100%)",
          }}
        >
          {SECTIONS.map((section, index) => (
            <div
              key={section.id}
              className="absolute inset-0"
              style={{
                opacity: index === props.activeSection ? 1 : 0,
                transition: "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                pointerEvents: "none",
              }}
            >
              <Image
                src={section.image}
                alt={section.label}
                fill
                priority={index === INITIAL_SECTION}
                unoptimized
                draggable={false}
                sizes="(max-width: 1920px) 71.4vw, 1371px"
                style={{
                  objectFit: "cover",
                  objectPosition: "center 0%",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* BOTTOM ATMOSPHERE */}

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            borderRadius: "inherit",
            background:
              "linear-gradient(to bottom, transparent 54%, rgba(222,238,255,0.02) 70%, rgba(220,237,255,0.18) 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 77%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 77%, transparent 100%)",
          }}
        />
      </section>

      {/* INTERACTIVE FACTORY */}

      <div
        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
        style={{
          top: yPercent(
            DESIGN_W * 0.1617 + EXTRA_GAP - CONTENT_VERTICAL_OFFSET,
          ),
          width: "71.64%",
          height: yPercent(DESIGN_W * 0.411),
        }}
      >
        <FactoryViewer {...props} />
      </div>
    </section>
  );
}

// =====================================================
// NEW: CLOSED DECK + SMOOTH SHARED ORBIT
// =====================================================

// Videodaki kapalı deste görünümü:
// Arkadaki kartların üst kenarları görünür.
// X konumları aynıdır ve hiçbir kart döndürülmez.

const DECK_STEP_Y = 16;

// Arkadaki kartların görünen üst kısımlarını
// merkeze doğru daraltır.
const DECK_SIDE_INSET = 11;

// Destenin üst kenarlarının ekran dışında
// kalmaması için eklenen tasarım boşluğu.
const DECK_HEADROOM = 88;

// =====================================================
// SCROLL REVEAL TIMING
// =====================================================

// Kart 6 -> Kart 5 -> Kart 4 -> Kart 3
// -> Kart 2 -> Kart 1 sırasıyla açılır.

const REVEAL_START = 0.045;
const REVEAL_GAP = 0.135;
const REVEAL_DURATION = 0.255;

// =====================================================
// ORBIT TYPES
// =====================================================

type OrbitPoint = {
  x: number;
  y: number;
};

type OrbitSample = OrbitPoint & {
  distance: number;
};

// =====================================================
// ORBIT WAYPOINTS
// =====================================================

// Kartların son konumları ortak eğrinin
// geçtiği sabit duraklardır.

const ORBIT_WAYPOINTS: readonly OrbitPoint[] = INNOVATION_CARDS.map((card) => ({
  x: card.left,
  y: card.top - INNOVATION_START_Y,
}));

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

// =====================================================
// SHAPE-PRESERVING SPLINE
// =====================================================

// Önceki sorun:
// Her segmentte bağımsız Bézier kontrol noktası
// kullanılması dönüşlerde zikzak üretiyordu.
//
// Yeni sistem:
// X koordinatı Y boyunca shape-preserving
// cubic Hermite interpolation ile hesaplanır.
//
// X sadece bir kez yön değiştirir:
// SAĞA -> SOLA.
//
// Y koordinatı sürekli aşağıya ilerler.

function createOrbitTangents(points: readonly OrbitPoint[]): number[] {
  const n = points.length;

  const h = Array.from(
    { length: n - 1 },
    (_, index) => points[index + 1].y - points[index].y,
  );

  const d = h.map(
    (delta, index) => (points[index + 1].x - points[index].x) / delta,
  );

  const tangents = Array<number>(n).fill(0);

  const endpointSlope = (h0: number, h1: number, d0: number, d1: number) => {
    let slope = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1);

    if (Math.sign(slope) !== Math.sign(d0)) {
      slope = 0;
    } else if (
      Math.sign(d0) !== Math.sign(d1) &&
      Math.abs(slope) > 3 * Math.abs(d0)
    ) {
      slope = 3 * d0;
    }

    return slope;
  };

  // Desteden ayrılırken önce çok hafif dikey,
  // ardından sağa doğru yumuşak hareket.
  tangents[0] = 0;

  tangents[n - 1] = endpointSlope(h[n - 2], h[n - 3], d[n - 2], d[n - 3]);

  for (let index = 1; index < n - 1; index++) {
    const previousSlope = d[index - 1];
    const nextSlope = d[index];

    if (previousSlope * nextSlope <= 0) {
      // Sağdan sola dönülen tepe noktası.
      // Böylece dönüşte geri sekme olmaz.
      tangents[index] = 0;
    } else {
      const w1 = 2 * h[index] + h[index - 1];

      const w2 = h[index] + 2 * h[index - 1];

      tangents[index] = (w1 + w2) / (w1 / previousSlope + w2 / nextSlope);
    }
  }

  return tangents;
}

const ORBIT_TANGENTS = createOrbitTangents(ORBIT_WAYPOINTS);

// =====================================================
// SAMPLE THE SHARED CURVE BY Y
// =====================================================

function orbitPointAtY(y: number): OrbitPoint {
  const first = ORBIT_WAYPOINTS[0];

  const last = ORBIT_WAYPOINTS[ORBIT_WAYPOINTS.length - 1];

  // Kapalı destedeki üst kartlar da aynı
  // yörüngenin kısa dikey başlangıcındadır.
  if (y <= first.y) {
    return {
      x: first.x,
      y,
    };
  }

  if (y >= last.y) {
    return {
      x: last.x,
      y: last.y,
    };
  }

  let segment = 0;

  while (
    segment < ORBIT_WAYPOINTS.length - 2 &&
    y > ORBIT_WAYPOINTS[segment + 1].y
  ) {
    segment++;
  }

  const start = ORBIT_WAYPOINTS[segment];
  const end = ORBIT_WAYPOINTS[segment + 1];

  const height = end.y - start.y;

  const t = (y - start.y) / height;
  const t2 = t * t;
  const t3 = t2 * t;

  // Cubic Hermite basis
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const x =
    h00 * start.x +
    h10 * height * ORBIT_TANGENTS[segment] +
    h01 * end.x +
    h11 * height * ORBIT_TANGENTS[segment + 1];

  return { x, y };
}

// =====================================================
// ARC-LENGTH LOOKUP
// =====================================================

// Aynı eğri 1px aralıklarla örneklenir.
//
// Böylece kartlar tüm dönüşleri aynı yolda
// ve tutarlı hareketle tamamlar.

function buildOrbit(): OrbitSample[] {
  const minY = -(INNOVATION_CARDS.length - 1) * DECK_STEP_Y;

  const maxY = ORBIT_WAYPOINTS[ORBIT_WAYPOINTS.length - 1].y;

  const samples: OrbitSample[] = [];

  let distance = 0;
  let previous = orbitPointAtY(minY);

  for (let y = minY; y <= maxY; y += 1) {
    const next = orbitPointAtY(y);

    if (samples.length > 0) {
      distance += Math.hypot(next.x - previous.x, next.y - previous.y);
    }

    samples.push({
      ...next,
      distance,
    });

    previous = next;
  }

  return samples;
}

const SHARED_ORBIT = buildOrbit();

// =====================================================
// FIND A POINT ON THE SAME ORBIT
// =====================================================

function findOrbitSample(value: number, key: "distance" | "y"): OrbitSample {
  const lastIndex = SHARED_ORBIT.length - 1;

  const firstValue = SHARED_ORBIT[0][key];

  const lastValue = SHARED_ORBIT[lastIndex][key];

  if (value <= firstValue) {
    return SHARED_ORBIT[0];
  }

  if (value >= lastValue) {
    return SHARED_ORBIT[lastIndex];
  }

  // Binary search
  let low = 0;
  let high = lastIndex;

  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);

    if (SHARED_ORBIT[mid][key] < value) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const a = SHARED_ORBIT[low];
  const b = SHARED_ORBIT[high];

  const range = b[key] - a[key];

  const t = range > 0 ? (value - a[key]) / range : 0;

  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,

    distance: a.distance + (b.distance - a.distance) * t,
  };
}

// =====================================================
// REVEAL PHASE PER CARD
// =====================================================

function getRevealPhase(index: number, progress: number): number {
  // Son kart en önde olduğu için ilk o çıkar.
  const order = INNOVATION_CARDS.length - 1 - index;

  const start = REVEAL_START + order * REVEAL_GAP;

  return clamp01((progress - start) / REVEAL_DURATION);
}

// =====================================================
// CARD POSITION ON SHARED ORBIT
// =====================================================

function getCardPosition(index: number, progress: number): OrbitPoint {
  const depth = INNOVATION_CARDS.length - 1 - index;

  // Kapalı halde birbirini tamamen kapatmazlar.
  // Her arkadaki kart bir üst basamakta durur.
  const closedY = -depth * DECK_STEP_Y;

  const finalY = ORBIT_WAYPOINTS[index].y;

  const phase = getRevealPhase(index, progress);

  // Kapalı konum
  if (phase <= 0) {
    return orbitPointAtY(closedY);
  }

  // Son konum
  if (phase >= 1) {
    return ORBIT_WAYPOINTS[index];
  }

  // Tek easing: Aradaki duraklarda yeniden
  // hızlanma veya ani dönüş yapılmaz.
  const eased = phase * phase * (3 - 2 * phase);

  const from = findOrbitSample(closedY, "y").distance;

  const to = findOrbitSample(finalY, "y").distance;

  const travelledDistance = from + (to - from) * eased;

  return findOrbitSample(travelledDistance, "distance");
}

// =====================================================
// CLOSED DECK — PERSPECTIVE-LIKE TIER CLIP
// =====================================================

// Kartın kendisi dönmez, eğilmez,
// skew veya rotate uygulanmaz.
//
// Yalnızca kapalı haldeki arkadaki kartların
// görünür kenarları simetrik daraltılır.
//
// Videodaki üst üste dizilmiş kartların
// basamaklı ve daralan görünümünü oluşturur.

function getDeckClip(index: number, progress: number): string {
  const depth = INNOVATION_CARDS.length - 1 - index;

  const phase = getRevealPhase(index, progress);

  const reveal = Math.max(
    clamp01(phase * 5),
    getCardContentOpacity(index, progress),
  );

  const inset = Math.max(0, depth * DECK_SIDE_INSET * (1 - reveal));

  return `inset(0px ${inset}px 0px ${inset}px round ${CARD_STYLE.radius}px)`;
}

// =====================================================
// CARD CONTENT REVEAL
// =====================================================

// Kapalı halde arkadaki kartların başlıkları
// üst üste yazı oluşturmuyor.
//
// Ön kart açıldıkça alttaki kartın
// metinleri beliriyor.

function getCardContentOpacity(index: number, progress: number): number {
  if (index === INNOVATION_CARDS.length - 1) {
    return 1;
  }

  const nextFrontOrder = INNOVATION_CARDS.length - 2 - index;

  const previousStart = REVEAL_START + nextFrontOrder * REVEAL_GAP;

  const showAt = previousStart + REVEAL_DURATION * 0.36;

  return clamp01((progress - showAt) / 0.045);
}

// =====================================================
// INNOVATION PART IMAGE
// =====================================================

function InnovationPartImage() {
  return (
    <div
      className="pointer-events-none absolute z-[100]"
      style={{
        top: PART_IMAGE.top - INNOVATION_START_Y,

        left: PART_IMAGE.left,

        width: PART_IMAGE.width,
        height: PART_IMAGE.height,

        isolation: "isolate",
      }}
    >
      <Image
        src="/production/ic-parca.png"
        alt="Industrial engineering component"
        fill
        unoptimized
        draggable={false}
        sizes="690px"
        style={{
          objectFit: "contain",
          objectPosition: "center",
          userSelect: "none",
          pointerEvents: "none",

          filter: `drop-shadow(
            ${PART_IMAGE.shadowX}px
            ${PART_IMAGE.shadowY}px
            ${PART_IMAGE.shadowBlur}px
            rgba(0, 0, 0, 0.15)
          )`,
        }}
      />
    </div>
  );
}

// =====================================================
// INNOVATION CARD ARROW
// =====================================================

function InnovationCardArrow({ dark }: { dark: boolean }) {
  const src = dark ? ARROW_IMAGES.white : ARROW_IMAGES.black;

  return (
    <span
      aria-hidden="true"
      className="absolute bottom-0 left-0 block"
      style={{
        width: CARD_STYLE.arrowSize,
        height: CARD_STYLE.arrowSize,

        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        draggable={false}
        sizes={`${CARD_STYLE.arrowSize}px`}
        style={{
          objectFit: "contain",
          objectPosition: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </span>
  );
}

// =====================================================
// ANIMATED CARD
// =====================================================

function InnovationCard({
  card,
  index,
  progress,
}: {
  card: InnovationCardData;
  index: number;
  progress: MotionValue<number>;
}) {
  // Her kart aynı düzgün yörüngeyi izler.
  // Sadece başlangıçtaki basamak ve
  // yörünge üzerindeki son durak farklıdır.

  const position = useTransform(progress, (value) =>
    getCardPosition(index, value),
  );

  const x = useTransform(position, (value) => value.x);

  const y = useTransform(position, (value) => value.y);

  // Kapalı deste görünümündeki
  // simetrik yan kenar daralması.
  const clipPath = useTransform(progress, (value) => getDeckClip(index, value));

  const contentOpacity = useTransform(progress, (value) =>
    getCardContentOpacity(index, value),
  );

  const isPerformanceCard = card.id === "performance";

  const titleFontSize = isPerformanceCard ? 20 : CARD_STYLE.titleFontSize;

  return (
    <motion.article
      className="absolute flex"
      style={{
        top: 0,
        left: 0,

        x,
        y,

        clipPath,

        // Hareket boyunca sabit boyut.
        // Rotation / skew animasyonu yok.
        scale: CARD_SCALE,

        transformOrigin: "top left",
        willChange: "transform",

        width: CARD_STYLE.width,
        height: CARD_STYLE.height,

        backgroundColor: card.background,
        color: card.color,

        borderRadius: CARD_STYLE.radius,

        paddingTop: CARD_STYLE.paddingTop,
        paddingRight: CARD_STYLE.paddingRight,
        paddingBottom: CARD_STYLE.paddingBottom,
        paddingLeft: CARD_STYLE.paddingLeft,

        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: CARD_STYLE.gap,

        boxSizing: "border-box",
        isolation: "isolate",

        // Son kart destenin en önündedir.
        zIndex: 30 + index,

        boxShadow: card.shadow ?? "none",
      }}
    >
      <motion.div
        style={{
          opacity: contentOpacity,

          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",

          gap: CARD_STYLE.gap,

          width: "100%",
          height: "100%",
        }}
      >
        {/* LEFT — TITLE AND ARROW */}

        <div
          className="relative shrink-0"
          style={{
            width: CARD_STYLE.titleWidth,
            height: "100%",
            minWidth: 0,
          }}
        >
          <h3
            className="m-0"
            style={{
              width: "100%",
              maxWidth: "100%",

              minHeight: CARD_STYLE.titleHeight,

              fontFamily: SF_PRO_FONT,
              fontSize: titleFontSize,
              fontWeight: CARD_STYLE.titleFontWeight,

              fontStretch: "expanded",

              lineHeight: CARD_STYLE.titleLineHeight,

              letterSpacing: isPerformanceCard ? "-0.02em" : "0em",

              color: card.color,

              overflowWrap: isPerformanceCard ? "anywhere" : "normal",

              wordBreak: "normal",
              whiteSpace: "normal",
            }}
          >
            {card.title}
          </h3>

          <InnovationCardArrow dark={card.dark} />
        </div>

        {/* RIGHT — PARAGRAPH */}

        <p
          className="m-0 shrink-0"
          style={{
            width: CARD_STYLE.paragraphWidth,

            height: CARD_STYLE.paragraphHeight,

            fontFamily: SF_PRO_FONT,

            fontSize: CARD_STYLE.paragraphFontSize,

            fontWeight: CARD_STYLE.paragraphFontWeight,

            fontStretch: "expanded",

            lineHeight: CARD_STYLE.paragraphLineHeight,

            letterSpacing: CARD_STYLE.paragraphLetterSpacing,

            color: card.color,

            overflow: "hidden",
            overflowWrap: "break-word",
          }}
        >
          {card.description}
        </p>
      </motion.div>
    </motion.article>
  );
}

// =====================================================
// ANIMATED CARD GROUP
// =====================================================

function InnovationCards({ progress }: { progress: MotionValue<number> }) {
  return (
    <section
      aria-label="Innovation and engineering capabilities"
      className="absolute inset-0 z-20"
      style={{
        overflow: "visible",
        isolation: "isolate",
      }}
    >
      {INNOVATION_CARDS.map((card, index) => (
        <InnovationCard
          key={card.id}
          card={card}
          index={index}
          progress={progress}
        />
      ))}
    </section>
  );
}

// =====================================================
// STICKY INNOVATION SECTION
// =====================================================

function InnovationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(0.75);

  // Bölümün başlangıcı = 0
  // Bölümün sticky bitişi = 1

  const { scrollYProgress } = useScroll({
    target: sectionRef,

    offset: [`start ${HEADER_HEIGHT}px`, "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 31,
    mass: 0.36,
    restDelta: 0.0005,
  });

  // ===================================================
  // RESPONSIVE SCALE
  // ===================================================

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const updateScale = () => {
      const bounds = viewport.getBoundingClientRect();

      const availableWidth = Math.max(
        1,
        bounds.width - INNOVATION_HORIZONTAL_PADDING,
      );

      const availableHeight = Math.max(
        1,
        bounds.height - INNOVATION_VERTICAL_PADDING,
      );

      const widthScale = availableWidth / INNOVATION_DESIGN_WIDTH;

      const heightScale = availableHeight / INNOVATION_DESIGN_HEIGHT;

      const nextScale = Math.max(0.1, Math.min(widthScale, heightScale, 1));

      setScale((previous) =>
        Math.abs(previous - nextScale) < 0.001 ? previous : nextScale,
      );
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scaledWidth = INNOVATION_DESIGN_WIDTH * scale;

  const scaledHeight = INNOVATION_DESIGN_HEIGHT * scale;

  // ===================================================
  // STICKY VIEWPORT
  // ===================================================

  return (
    <section
      ref={sectionRef}
      aria-label="Innovation and design capabilities"
      className="relative w-full"
      style={{
        height: `calc(
          (100svh - ${HEADER_HEIGHT}px)
          * ${INNOVATION_SCROLL_SCREENS}
        )`,

        scrollMarginTop: HEADER_HEIGHT,
      }}
    >
      <div
        ref={viewportRef}
        className="sticky w-full overflow-hidden"
        style={{
          top: HEADER_HEIGHT,

          height: `calc(
            100svh - ${HEADER_HEIGHT}px
          )`,

          isolation: "isolate",
        }}
      >
        {/* DESIGN CANVAS */}

        <div
          className="absolute"
          style={{
            left: `calc(
              50% - ${scaledWidth / 2}px
            )`,

            // Kapalı kartların üst basamaklarının
            // ekran dışında kalmasını engeller.
            top: `calc(
              50% -
              ${scaledHeight / 2}px +
              ${DECK_HEADROOM * scale}px
            )`,

            width: INNOVATION_DESIGN_WIDTH,
            height: INNOVATION_DESIGN_HEIGHT,

            transform: `scale(${scale})`,
            transformOrigin: "top left",

            isolation: "isolate",
          }}
        >
          {/* IMAGE — FRONT LAYER */}

          <InnovationPartImage />

          {/* CARDS — FAN DECK AND SMOOTH ORBIT */}

          <InnovationCards progress={smoothProgress} />
        </div>
      </div>
    </section>
  );
}

// =====================================================
// PRODUCTION PAGE
// =====================================================

export default function ProductionPage() {
  const [activeSection, setActiveSection] = useState(INITIAL_SECTION);

  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  return (
    <main
      className="relative w-full max-w-full"
      style={{
        overflowX: "clip",

        background:
          "linear-gradient(110deg, #FFFFFF 33%, #E9F5FF 65%, #D7EAFF 100%)",
      }}
    >
      {/* FIRST COMPONENT — FACTORY */}

      <ProductionHero
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onSelect={setActiveSection}
        onHover={setHoveredSection}
      />

      {/* COMPONENT SPACING */}

      <div
        aria-hidden="true"
        style={{
          height: "min(1.25vw, 24px)",
        }}
      />

      {/* SECOND COMPONENT — STICKY CARDS */}

      <InnovationSection />
    </main>
  );
}

useGLTF.preload(MODEL_URL);
