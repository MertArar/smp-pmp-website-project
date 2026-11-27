"use client";

import Image from "next/image";
import GlassViewAllButton from "@/components/ui/GlassViewAllButton";
import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { gsap } from "@/lib/gsap";

import {
  DESIGN_WIDTH,
  BASE_HEIGHT,
  CARD_COUNT,
  SEGMENTS_X,
  SEGMENTS_Y,
  clamp,
  mix,
  smoothstep,
} from "./ribbonGeometry";
// Tailwind classes stay next to the component; marker classes scope descendant variants.
const SOCIAL_BACKGROUND = "linear-gradient(90deg, #d5eaf7 0%, #d1e8f6 48%, #c6e0f7 68%, #afcdf9 90%, #bbd7fc 100%)";
const styles = {
  "section": "tw-social-section isolate relative w-full [height:860svh] [color:#434343]! [font-family:var(--font-sf-pro),_sans-serif] [@media(max-width:1023px)]:[height:760svh] [@media(prefers-reduced-motion:reduce)]:[height:100svh]",
  "viewport": "tw-social-viewport sticky [top:0] w-full [height:100svh] overflow-hidden [&[data-fallback='true']_.tw-social-grid]:visible [&[data-fallback='true']_.tw-social-grid]:pointer-events-auto [&[data-fallback='true']_.tw-social-divider]:[transform:scaleX(1)] [&[data-fallback='true']_.tw-social-ribbon]:invisible [&[data-fallback='true']_.tw-social-heading]:invisible [&[data-fallback='true']_.tw-social-guides]:invisible [&[data-fallback='true']_.tw-social-caption]:invisible [&[data-fallback='true']_.tw-social-grid]:[opacity:1]",
  "stage": "tw-social-stage [--reference-scale:1] [--viewport-width:1904px] [--viewport-height:878px] [--design-x:calc((1904px_-_var(--viewport-width))_/_2_-_584px)] [--motion-x:calc((1904px_+_var(--viewport-width))_/_2_+_32px)] [--caption-opacity:1] [--divider-progress:0] [--intro-offset:29px] absolute [left:50%] [top:50%] [width:1904px] [height:878px] [transform:translate(-50%,_-50%)_scale(var(--reference-scale))] [transform-origin:center] [&[data-settled='true']_.tw-social-grid]:visible",
  "heading": "tw-social-heading m-0 [font-weight:400] [font-size:138px]! [line-height:1]! [letter-spacing:-0.04em] [font-stretch:100%] [font-variation-settings:'wght'_400,_'wdth'_100] [@media(prefers-reduced-motion:reduce)]:hidden",
  "design": "tw-social-design absolute [left:0] whitespace-nowrap [will-change:transform] [top:calc(239px_+_var(--intro-offset))] [transform:translate3d(var(--design-x),_0,_0)] [&_>_span]:block [&_>_span]:[width:max-content]",
  "motion": "tw-social-motion absolute [left:0] whitespace-nowrap [will-change:transform] [top:calc(416px_+_var(--intro-offset))] [transform:translate3d(var(--motion-x),_0,_0)] [&_>_span]:block [&_>_span]:[width:max-content]",
  "caption": "tw-social-caption absolute [left:50%] [top:calc(387px_+_var(--intro-offset))] m-0 [transform:translateX(-50%)] [font-size:15px]! [line-height:16px]! [font-weight:400] text-center [opacity:var(--caption-opacity)] [@media(prefers-reduced-motion:reduce)]:hidden",
  "ribbon": "tw-social-ribbon absolute [left:calc((1904px_-_var(--viewport-width))_/_2)] [top:calc((878px_-_var(--viewport-height))_/_2)] [z-index:1] [width:var(--viewport-width)] [height:var(--viewport-height)] pointer-events-none [@media(prefers-reduced-motion:reduce)]:hidden",
  "guides": "tw-social-guides absolute inset-0 w-full h-full pointer-events-none [fill:none] [stroke:#434343] [stroke-width:0.5px] [opacity:0.2] [&_path]:[opacity:0] [@media(prefers-reduced-motion:reduce)]:hidden",
  "grid": "tw-social-grid absolute [scale:var(--grid-scale,1)] [left:335px] [top:107px] [z-index:2] grid [grid-template-columns:repeat(3,_406px)] [grid-template-rows:repeat(2,_283px)] [column-gap:16px] [row-gap:25px] [opacity:0] invisible pointer-events-none [@media(max-width:1023px)]:[left:54px] [@media(max-width:1023px)]:[top:-517px] [@media(max-width:1023px)]:[grid-template-columns:repeat(2,_880px)] [@media(max-width:1023px)]:[grid-template-rows:repeat(3,_616px)] [@media(max-width:1023px)]:[gap:32px_36px] [@media(prefers-reduced-motion:reduce)]:[opacity:1] [@media(prefers-reduced-motion:reduce)]:visible [@media(prefers-reduced-motion:reduce)]:pointer-events-auto",
  "card": "tw-social-card m-0 overflow-hidden [border-radius:8px] [transition:transform_450ms_cubic-bezier(0.22,1,0.36,1),box-shadow_450ms_ease] [@media(hover:hover)_and_(pointer:fine)]:hover:[transform:translateY(-4px)_scale(1.04)] [@media(hover:hover)_and_(pointer:fine)]:hover:[box-shadow:0_12px_30px_#234e7226] motion-reduce:transition-none motion-reduce:hover:transform-none [@media(max-width:1023px)]:[border-radius:24px]",
  "divider": "tw-social-divider absolute [left:37px] [right:37px] [top:402.5px] [height:1px] [background:rgba(67,_67,_67,_0.16)] [transform:scaleX(var(--divider-progress))] [transform-origin:left_center] pointer-events-none [@media(max-width:1023px)]:[left:100px] [@media(max-width:1023px)]:[right:100px] [@media(max-width:1023px)]:[top:calc(439px_-_324px_*_var(--grid-scale,1))] [@media(prefers-reduced-motion:reduce)]:[transform:scaleX(1)]",
  "secondDivider": "tw-social-secondDivider hidden [@media(max-width:1023px)]:block [@media(max-width:1023px)]:[top:calc(439px_+_324px_*_var(--grid-scale,1))]",
  "artwork": "tw-social-artwork w-full h-full object-cover",
  "description": "tw-social-description absolute [left:37px] [top:calc(740px_+_var(--intro-offset))] [z-index:3] m-0 [font-size:17px]! [line-height:20px]! [letter-spacing:-0.65px] [font-weight:400] [@media(max-width:1023px)]:[left:100px] [@media(max-width:1023px)]:[top:calc(439px_-_var(--viewport-height)_/_2_+_36px_/_var(--reference-scale))] [@media(max-width:1023px)]:[font-size:calc(11px_/_var(--reference-scale))]! [@media(max-width:1023px)]:[line-height:1.2]! [@media(max-width:1023px)]:[letter-spacing:0]",
  "viewAll": "absolute [right:37px] [top:calc(770px_+_var(--intro-offset))] [z-index:3] [@media(max-width:1023px)]:[left:100px] [@media(max-width:1023px)]:[right:auto] [@media(max-width:1023px)]:[top:calc(439px_+_var(--viewport-height)_/_2_-_65px_/_var(--reference-scale))] [@media(max-width:1023px)]:[transform:scale(calc(0.75_/_var(--reference-scale)))] [transform-origin:top_left]",
} as const;



const ARTWORKS = [
  {
    id: "ai",
    alt: "Loose sketches to visualizations",
  },
  {
    id: "studio",
    alt: "We bring imagination to life",
  },
  {
    id: "shank",
    alt: "SHANK fashion concept",
  },
  {
    id: "watch",
    alt: "Watch customization interface",
  },
  {
    id: "trends",
    alt: "Fashion trends 2026",
  },
  {
    id: "novaglam",
    alt: "Novaglam vintage fashion studio",
  },
  {
    id: "music",
    alt: "Future of music experiences",
  },
  {
    id: "headphones",
    alt: "Designed for every note",
  },
  {
    id: "editorial",
    alt: "Editorial fashion and art direction",
  },
] as const;

// Ribbon order follows the reference; the first six ARTWORKS retain grid order.
const SPIRAL_SEQUENCE = [0, 1, 3, 6, 2, 8, 5, 4, 7] as const;

type Panel = {
  index: number;
  hover?: number;
  settledAt?: number;
  geometryProgress?: number;
  geometryFrameHeight?: number;
  kind?: "grid";
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

const GUIDE_STOPS = [
  {
    t: 1.3,
    curves: [
      [
        [866, 99],
        [990, 84],
        [1109, 46],
        [1212, 0],
      ],
      [
        [1011, 226],
        [1230, 169],
        [1390, 97],
        [1480, 0],
      ],
    ],
  },
  {
    t: 1.95,
    curves: [
      [
        [352, 22],
        [205, 43],
        [525, 113],
        [772, 105],
      ],
      [
        [340, 344],
        [391, 297],
        [725, 280],
        [897, 247],
      ],
    ],
  },
  {
    t: 2.6,
    curves: [
      [
        [362, 22],
        [680, 4],
        [1536, 252],
        [1590, 421],
      ],
      [
        [329, 359],
        [304, 516],
        [1143, 778],
        [1560, 767],
      ],
    ],
  },
  {
    t: 3.25,
    curves: [
      [
        [1437, 489],
        [1494, 482],
        [1560, 470],
        [1591, 460],
      ],
      [
        [1079, 667],
        [1208, 657],
        [1588, 714],
        [1590, 758],
      ],
    ],
  },
  {
    t: 3.9,
    curves: [
      [
        [529, 629],
        [697, 548],
        [930, 520],
        [1151, 510],
      ],
      [
        [592, 784],
        [744, 692],
        [960, 647],
        [1204, 671],
      ],
    ],
  },
  {
    t: 4.55,
    curves: [
      [
        [411, 708],
        [543, 596],
        [770, 536],
        [1021, 518],
      ],
      [
        [473, 878],
        [614, 738],
        [850, 666],
        [1078, 666],
      ],
    ],
  },
  {
    t: 5.2,
    curves: [
      [
        [329, 878],
        [339, 737],
        [468, 640],
        [660, 578],
      ],
      [
        [473, 878],
        [542, 811],
        [633, 763],
        [714, 727],
      ],
    ],
  },
];

function findInterval<T extends { t: number }>(
  samples: readonly T[],
  time: number,
): readonly [T, T] {
  let lo = 0;
  let hi = samples.length - 1;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (samples[mid].t < time) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return [samples[Math.max(0, lo - 1)], samples[lo]];
}

function titlePositions(progress: number, frameWidth: number, designWidth: number, motionWidth: number) {
  const left = (DESIGN_WIDTH - frameWidth) / 2;
  const right = left + frameWidth;
  // Measure natural text widths so both titles keep identical letter shapes
  // and spacing while each word still clears the viewport completely.
  return [
    mix(left - designWidth - 32, right + 32, progress),
    mix(right + 32, left - motionWidth - 32, progress),
  ] as const;
}

function ribbonExitTravel(frameHeight: number) {
  const z = 340 * Math.cos(-9.6) - 220;
  const pitch = 120 + Math.max(0, frameHeight - BASE_HEIGHT) * 0.7;
  let low = 0;
  let high = 20;
  for (let i = 0; i < 24; i++) {
    const distance = (low + high) / 2;
    const departure = distance * distance / (1 + distance);
    const bottom = BASE_HEIGHT / 2 - 700 + 85 * 7 + 85 * distance
      + pitch * departure - 142.5 / (1 + 0.08 * departure);
    if (bottom * 1600 / (1600 - z) < frameHeight / 2 + 32) low = distance;
    else high = distance;
  }
  return (CARD_COUNT - 1) * 0.555 + 0.265 + 7 + high;
}

function gridArrivalStart(finalTravel: number) {
  // Begin as the last three ribbon cards leave, including on taller viewports.
  const travelAtArrival = finalTravel - 3 * 0.555;
  return 0.18 + 0.82 * (travelAtArrival + 2.5) / (finalTravel + 2.5);
}

// Mobile uses a wide, shallow helix across the portrait frame: the distant
// row rises to the right, while the near row sweeps down across the foreground.
// Only the travelling ribbon samples this path; titles and grid arrivals keep
// their existing timeline and coordinates.
function mobileRibbonPoint(alongPath: number, v: number, frameHeight: number) {
  const path = Math.min(alongPath, 7);
  const theta = -2.6 - path;
  const radius = 1200;
  const pitch = frameHeight * .065;
  const baseY = -frameHeight * .25;
  let x = radius * Math.sin(theta);
  let y = baseY + pitch * path - x * .06 * Math.cos(theta) + (0.5 - v) * 550;
  let z = 700 * Math.cos(theta) + 100;

  if (alongPath < 0) {
    // Match both tangent and curvature at the join with the circular path.
    // Clamping the circle here used to make the first bend turn abruptly.
    const t = clamp((alongPath + 2.2) / 2.2);
    const blend = t * t * t * (t * (t * 6 - 15) + 10);
    const leadX = -2300 + (radius * Math.sin(-2.6) + 2300) / 2.2 * (alongPath + 2.2);
    x = mix(leadX, x, blend);
    y = mix(baseY - frameHeight * .08 + (0.5 - v) * 550, y, blend);
    z = mix(700 * Math.cos(-2.6) + 100, z, blend);
  } else if (alongPath > 7) {
    const distance = alongPath - 7;
    const endAngle = -9.6;
    const endX = radius * Math.sin(endAngle);
    const tangentX = -radius * Math.cos(endAngle);
    const tangentY = pitch + radius * .06 * Math.cos(2 * endAngle);
    const tangentZ = 700 * Math.sin(endAngle);
    const curvatureX = -endX;
    const curvatureY = radius * .12 * Math.sin(2 * endAngle);
    const curvatureZ = -700 * Math.cos(endAngle);
    const turnLength = .4;
    const decay = Math.exp(-distance / turnLength);
    const tangentTravel = turnLength * (1 - decay);
    const curvatureTravel = turnLength * turnLength * (1 - (1 + distance / turnLength) * decay);
    // Continue the circle's tangent to the right. Vertical/depth motion eases
    // out without a corner; there is no upward launch or shrinking exit.
    x = endX + tangentX * distance + curvatureX * curvatureTravel;
    y = baseY + pitch * 7 - endX * .06 * Math.cos(endAngle) + (0.5 - v) * 550
      + tangentY * tangentTravel + (curvatureY + tangentY / turnLength) * curvatureTravel;
    z = 700 * Math.cos(endAngle) + 100
      + tangentZ * tangentTravel + (curvatureZ + tangentZ / turnLength) * curvatureTravel;
  }
  return [x, y, z] as const;
}

function updatePanel(panel: Panel, progress: number, mobile: boolean, frameHeight = BASE_HEIGHT, seconds = 0, finalTravel = Math.PI * 2 * 1.12 + 8, mobileRibbon = false, gridScale = 1) {
  const { mesh, index } = panel;
  // Cards never blink at the back of the spiral. Visibility is determined
  // by actual depth and the camera frame, not recorded alpha keyframes.
  mesh.visible = true;
  mesh.material.opacity = 1;

  // Give the first bend its own scroll distance: the leading edge emerges
  // first, then every following card samples that same bend with a delay.
  const snakeProgress = clamp((progress - 0.18) / 0.82);
  const travel = mix(-2.5, finalTravel, snakeProgress);
  const phase = SPIRAL_SEQUENCE.findIndex((cardIndex) => cardIndex === index) * 0.555;
  const exitPitch = 120 + Math.max(0, frameHeight - BASE_HEIGHT) * 0.7;
  // Independent arrival meshes overlap the last three departing ribbon cards.
  // A ribbon card is never teleported into its grid destination.
  const enteringGrid = panel.kind === "grid";
  const arrivalStart = gridArrivalStart(finalTravel);
  const arrivalWindow = 0.995 - arrivalStart;
  const settle = enteringGrid
    ? smoothstep((progress - arrivalStart - index / 5 * arrivalWindow * 0.45) / (arrivalWindow * 0.55))
    : 0;
  if (enteringGrid) mesh.visible = settle > 0;
  if (enteringGrid) {
    if (settle === 1) panel.settledAt ??= seconds;
    else panel.settledAt = undefined;
    // Hidden arrival cards have no geometry to draw yet. Recompute on entry.
    if (!mesh.visible) return;
  }
  const residual = enteringGrid
    ? 0.22 * settle ** 8 * (1 - smoothstep(panel.settledAt === undefined ? 0 : seconds - panel.settledAt))
    : 0;

  const geometry = mesh.geometry;

  const positions = geometry.attributes.position as THREE.BufferAttribute;

  let vertexIndex = 0;

  // Hover and the grid's settling tail need new frames, but a stationary ribbon
  // still uses exactly the same vertices. Keep its buffer until scroll changes.
  const updateVertices = enteringGrid || panel.geometryProgress !== progress || panel.geometryFrameHeight !== frameHeight;
  if (updateVertices) {
  for (let row = 0; row <= SEGMENTS_Y; row++) {
    const v = row / SEGMENTS_Y;

    for (let column = 0; column <= SEGMENTS_X; column++) {
      const u = column / SEGMENTS_X;

      if (enteringGrid) {
        const columns = mobile ? 2 : 3;
        const width = mobile ? 880 : 406;
        const height = mobile ? 616 : 283;
        const gridX = (mobile ? 54 : 335) + (index % columns) * (mobile ? 916 : 422) + u * width;
        const gridY = (mobile ? -517 : 107) + Math.floor(index / columns) * (mobile ? 648 : 308) + v * height;
        const entryX = mobile ? (index % columns === 0 ? -1000 : 1000) : (index % columns - 1) * 800;
        const entryY = Math.floor(index / columns) === 0 ? -600 : 600;
        const wobble = Math.sin(Math.PI * settle) * (1 - settle) + residual;
        const wave = seconds * 1.15 + index * 0.8;
        positions.setXYZ(vertexIndex++,
          (gridX - DESIGN_WIDTH / 2) * gridScale + entryX * (1 - settle) + Math.sin(wave + v * 2.4) * 16 * wobble,
          (BASE_HEIGHT / 2 - gridY) * gridScale - entryY * (1 - settle) + Math.cos(wave + u * 2.8) * 12 * wobble,
          100 * Math.sin(Math.PI * u) * (1 - settle) + Math.sin(wave + u * Math.PI * 2 + v * 1.7) * 32 * wobble);
        continue;
      }

      // All vertices sit on the same unwrapped helix. Subdivisions bend
      // the card across its width while its front and back retain the texture.
      const alongPath = travel - phase - (u - 0.5) * 0.53;
      if (mobileRibbon) {
        const point = mobileRibbonPoint(alongPath, v, frameHeight);
        positions.setXYZ(vertexIndex++, point[0], point[1], point[2]);
        continue;
      }
      const spiralPath = Math.max(0, Math.min(alongPath, 7));
      const growth = mix(0.72, 1, smoothstep(spiralPath / 3));
      const theta = -2.6 - spiralPath;
      let x = 760 * growth * Math.sin(theta);
      // Sample the pitch at every vertex too: adjacent edges continue along
      // one curve instead of becoming separate, stair-stepped cards.
      let y = BASE_HEIGHT / 2 - 700 + 85 * growth * spiralPath + (0.5 - v) * 285 * growth;
      let z = 340 * growth * Math.cos(theta) - 220;
      if (alongPath > 7) {
        // Bend the shared path upwards in the screen plane. Every vertex and
        // following card traverses this turn; its horizontal tangent never reverses.
        const distance = alongPath - 7;
        const startX = 760 * Math.sin(-2.6 - 7);
        const tangentX = -760 * Math.cos(-2.6 - 7);
        const turnLength = (760 - startX) / tangentX;
        const departure = distance * distance / (1 + distance);
        const shrink = 1 / (1 + 0.08 * departure);
        x = startX + (760 - startX) * (1 - Math.exp(-distance / turnLength));
        y = BASE_HEIGHT / 2 - 700 + 85 * 7 + 85 * distance
          + exitPitch * departure + (0.5 - v) * 285 * shrink;
        z = 340 * Math.cos(-2.6 - 7) - 220;
      }
      if (alongPath < 0) {
        // A curved, bottom-left lead-in joins the helix with matching tangents.
        // It changes individual vertices, never the position of the whole strip.
        const t = clamp((alongPath + 2.2) / 2.2);
        const inverse = 1 - t;
        const startX = -820;
        const startY = -(frameHeight * 0.65 + 600);
        const endX = 760 * 0.72 * Math.sin(-2.6);
        const endY = BASE_HEIGHT / 2 - 700;
        const endTangentX = -760 * 0.72 * Math.cos(-2.6);
        const endTangentY = 85 * 0.72;
        x = inverse ** 3 * startX
          + 3 * inverse ** 2 * t * (startX + 60)
          + 3 * inverse * t ** 2 * (endX - endTangentX * 2.2 / 3)
          + t ** 3 * endX;
        y = inverse ** 3 * startY
          + 3 * inverse ** 2 * t * (startY + (endY - startY) * 0.55)
          + 3 * inverse * t ** 2 * (endY - endTangentY * 2.2 / 3)
          + t ** 3 * endY
          + (0.5 - v) * 285 * 0.72
          + Math.min(0, alongPath + 2.2) * 300;
        // Match the helix depth derivative at the join as well.
        z += 340 * 0.72 * Math.sin(-2.6) * 2.2 * t ** 2 * (t - 1);
      }
      positions.setXYZ(vertexIndex, x, y, z);

      vertexIndex++;
    }
  }

  positions.needsUpdate = true;
  panel.geometryProgress = progress;
  panel.geometryFrameHeight = frameHeight;
  }
  const scale = 1 + (panel.hover ?? 0) * 0.04;
  mesh.scale.setScalar(scale);
  if (scale !== 1) {
    geometry.computeBoundingBox();
    const center = geometry.boundingBox!;
    mesh.position.set(
      (center.min.x + center.max.x) * 0.5 * (1 - scale),
      (center.min.y + center.max.y) * 0.5 * (1 - scale),
      (center.min.z + center.max.z) * 0.5 * (1 - scale) + (panel.hover ?? 0) * 8,
    );
  } else mesh.position.set(0, 0, 0);

  // Prevent stale bounds from culling moving meshes.
  mesh.frustumCulled = false;

  mesh.renderOrder = index;
}

export default function SocialMedia() {
  const sectionRef = useRef<HTMLElement>(null);

  const viewportRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const guideRefs = useRef<Array<SVGPathElement | null>>([]);

  const designRef = useRef<HTMLSpanElement>(null);

  const motionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!section || !viewport || !stage || !canvas) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let reducedMotion = mediaQuery.matches;
    let disposed = false;
    let initializing = false;

    let current = 0;
    let arrivalProgress = 0;
    const motionState = { progress: 0 };
    let scrollTween: gsap.core.Tween | undefined;

    let renderer: THREE.WebGLRenderer | undefined;

    let scene: THREE.Scene | undefined;

    let camera: THREE.PerspectiveCamera | undefined;

    const panels: Panel[] = [];
    const textures: THREE.Texture[] = [];
    let frameHeight = BASE_HEIGHT;
    let frameWidth = DESIGN_WIDTH;
    let designTitleWidth = 552;
    let motionTitleWidth = 480;
    let raycaster: THREE.Raycaster | undefined;
    let pointer: THREE.Vector2 | undefined;
    let pointerInside = false;
    let hovered: Panel | undefined;
    let pointerDirty = false;
    let needsPaint = true;
    let viewportVisible = false;
    let mobile = false;
    let mobileRibbon = false;
    let gridScale = 1;
    let viewportHeight = 1;
    let sectionHeight = 1;
    let finalRibbonTravel = ribbonExitTravel(BASE_HEIGHT);

    const measure = () => {
      mobile = viewport.clientWidth < 1024;
      mobileRibbon = mobile;
      viewportHeight = viewport.offsetHeight;
      sectionHeight = section.offsetHeight;
      const scale = Math.min(
        viewport.clientWidth / DESIGN_WIDTH,
        viewport.clientHeight / BASE_HEIGHT,
      );

      stage.style.setProperty("--reference-scale", String(scale));
      frameHeight = viewport.clientHeight / Math.max(scale, 0.001);
      frameWidth = viewport.clientWidth / Math.max(scale, 0.001);
      gridScale = mobile && viewport.clientWidth >= 768
        ? Math.min(0.86, Math.max(0.1, (viewportHeight - 192) / (1912 * scale)))
        : 1;
      stage.style.setProperty("--grid-scale", String(gridScale));
      finalRibbonTravel = ribbonExitTravel(frameHeight);
      stage.style.setProperty("--viewport-height", `${frameHeight}px`);
      stage.style.setProperty("--viewport-width", `${frameWidth}px`);

      if (camera) {
        camera.fov = 2 * Math.atan(frameHeight / (2 * 1600)) * 180 / Math.PI;
        camera.aspect = viewport.clientWidth / Math.max(1, viewport.clientHeight);
        camera.updateProjectionMatrix();
      }

      designTitleWidth = designRef.current?.offsetWidth || designTitleWidth;
      motionTitleWidth = motionRef.current?.offsetWidth || motionTitleWidth;

      if (renderer) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        renderer.setSize(
          Math.max(1, viewport.clientWidth),
          Math.max(1, viewport.clientHeight),
          false,
        );
      }
    };

    const paintGuides = (time: number) => {
      if (mobileRibbon) {
        guideRefs.current.forEach((path, index) => {
          if (!path) return;
          const sweep = smoothstep((time - 1.4) / 3.8);
          const y = BASE_HEIGHT / 2 - frameHeight * .28 + frameHeight * .50 * sweep + index * 540;
          const bend = Math.cos(sweep * Math.PI) * 360;
          path.setAttribute("d", `M-180,${y + bend} C500,${y + bend} 1200,${y + 80} 2100,${y - bend}`);
          path.style.opacity = String(smoothstep((time - .8) / .5) * (1 - smoothstep((time - 5.2) / .6)));
          path.style.strokeWidth = "2.4px";
          path.parentElement!.style.overflow = "visible";
        });
        return;
      }
      const [a, b] = findInterval(GUIDE_STOPS, time);

      const interpolation = a.t === b.t ? 0 : clamp((time - a.t) / (b.t - a.t));

      guideRefs.current.forEach((path, index) => {
        if (!path) return;
        path.style.strokeWidth = "";
        path.parentElement!.style.overflow = "";

        const points = a.curves[index].map((point, i) => [
          mix(point[0], b.curves[index][i][0], interpolation),
          mix(point[1], b.curves[index][i][1], interpolation),
        ]);

        path.setAttribute(
          "d",
          `M${points[0][0]},${points[0][1]} ` +
            `C${points[1][0]},${points[1][1]} ` +
            `${points[2][0]},${points[2][1]} ` +
            `${points[3][0]},${points[3][1]}`,
        );

        path.style.opacity = String(
          smoothstep((time - 0.8) / 0.5) * (1 - smoothstep((time - 5.2) / 0.6)),
        );
      });
    };

    const paint = () => {
      // The first card peeks out just before the titles meet. Keep the titles
      // travelling through the scene until the ribbon's final departure.
      const time = current * 5.85;
      const [designX, motionX] = titlePositions(current, frameWidth, designTitleWidth, motionTitleWidth);
      // Continue each title in its original direction until its complete
      // enlarged mobile word has cleared the viewport. Never fade the text.
      const titleExit = mobileRibbon ? smoothstep((current - .23) / .13) : 0;
      const designExit = mobileRibbon ? mix(designX, frameWidth / 2 + DESIGN_WIDTH / 2 + 100, titleExit) : designX;
      const motionExit = mobileRibbon ? mix(motionX, (DESIGN_WIDTH - frameWidth) / 2 - motionTitleWidth - 100, titleExit) : motionX;

      stage.style.setProperty("--design-x", `${designExit}px`);

      stage.style.setProperty("--motion-x", `${motionExit}px`);

      stage.style.setProperty(
        "--intro-offset",
        `${29 * (1 - smoothstep(time / 0.65))}px`,
      );

      stage.style.setProperty(
        "--caption-opacity",
        String(1 - smoothstep((current - 0.60) / 0.10)),
      );
      stage.style.setProperty("--divider-progress", String(
        reducedMotion ? 1 : smoothstep((arrivalProgress - gridArrivalStart(finalRibbonTravel)) / (1 - gridArrivalStart(finalRibbonTravel))),
      ));

      const arrivalPanels = panels.filter(panel => panel.kind);
      const lastSettledAt = arrivalPanels.length === 6 && arrivalPanels.every(panel => panel.settledAt !== undefined)
        ? Math.max(...arrivalPanels.map(panel => panel.settledAt!))
        : undefined;
      // Keep the final cards on the same canvas. Crossfading two copies of
      // the grid briefly exposed the background and caused a brightness flash.
      // The transparent DOM grid still exposes image descriptions once settled;
      // reduced-motion and WebGL fallback modes display that grid directly.
      stage.dataset.settled = String(lastSettledAt !== undefined);

      paintGuides(time);

      if (renderer && scene && camera && !reducedMotion) {
        for (const panel of panels) {
          if (panel.kind) {
            const size = panel.mesh.material.userData.cardSize as THREE.Vector2;
            size.set((mobile ? 880 : 406) * gridScale, (mobile ? 616 : 283) * gridScale);
          }
          updatePanel(panel, panel.kind ? arrivalProgress : current, mobile, frameHeight, gsap.ticker.time, finalRibbonTravel, mobileRibbon, gridScale);
        }

        renderer.render(scene, camera);
        if (pointerInside) pointerDirty = true;
      }
    };

    const schedule = () => {
      if (!disposed) needsPaint = true;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !pointer) return;
      const rect = viewport.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
        -(event.clientY - rect.top) / rect.height * 2 + 1);
      pointerInside = true;
      pointerDirty = true;
    };
    const onPointerLeave = () => { pointerInside = false; hovered = undefined; };
    const animateInteractions = (_time: number, delta: number) => {
      if (disposed || reducedMotion || !viewportVisible) return;
      if (!renderer || !scene || !camera) {
        if (needsPaint) { needsPaint = false; paint(); }
        return;
      }
      if (pointerInside && pointer && raycaster && (pointerDirty || needsPaint)) {
        pointerDirty = false;
        scene.updateMatrixWorld(true);
        raycaster.setFromCamera(pointer, camera);
        // Every visible card can respond, including cards still arriving.
        // Hover caches a bounding box; refresh it as well as the sphere after
        // deformation so an old box cannot reject hits on the current card.
        const interactivePanels = panels.filter(panel => panel.mesh.visible);
        interactivePanels.forEach(({ mesh }) => {
          mesh.geometry.computeBoundingBox();
          mesh.geometry.computeBoundingSphere();
        });
        const hit = raycaster.intersectObjects(interactivePanels.map(panel => panel.mesh))[0];
        hovered = interactivePanels.find(panel => panel.mesh === hit?.object);
      } else if (!pointerInside) hovered = undefined;
      const easing = 1 - Math.exp(-Math.min(delta, 64) / 260);
      let changing = false;
      for (const panel of panels) {
        const target = panel === hovered ? 1 : 0;
        const value = panel.hover ?? 0;
        panel.hover = Math.abs(value - target) < 0.001 ? target : mix(value, target, easing);
        changing ||= panel.hover !== value;
      }
      const jellyTail = panels.some(panel => panel.kind && panel.settledAt !== undefined && _time - panel.settledAt < 1.25);
      if (needsPaint || changing || jellyTail || (arrivalProgress > gridArrivalStart(finalRibbonTravel) && arrivalProgress < 1)) {
        needsPaint = false;
        paint();
      }
    };

    const readScroll = () => {
      // Titles start gently once the section fills a fifth of the viewport.
      // Share a shorter timeline, with half a viewport for card arrivals and
      // only a quarter viewport of hold before the section scrolls away.
      const travelled = motionState.progress * sectionHeight - viewportHeight;
      const animationDistance = Math.max(1, sectionHeight - viewportHeight * 1.75) + viewportHeight * 0.8;
      const rawProgress = (travelled + viewportHeight * 0.8) / animationDistance;
      const arrivalStart = gridArrivalStart(finalRibbonTravel);
      const arrivalSpan = 1 - arrivalStart;
      current = reducedMotion ? 1 : clamp(rawProgress);
      arrivalProgress = reducedMotion ? 1 : clamp(rawProgress <= arrivalStart
        ? rawProgress
        : arrivalStart + (rawProgress - arrivalStart) * arrivalSpan / (arrivalSpan + viewportHeight * 0.5 / animationDistance));
      schedule();
    };

    const createScrollAnimation = () => {
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      if (reducedMotion) { current = 1; arrivalProgress = 1; paint(); return; }
      scrollTween = gsap.fromTo(motionState, { progress: 0 }, {
        progress: 1,
        ease: "none",
        onUpdate: readScroll,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom bottom",
          // Smooth the shared timeline too: titles and ribbon keep gliding
          // towards the scroll target after input stops, in either direction.
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    };

    const initializeRibbon = async () => {
      if (initializing || disposed || reducedMotion) {
        return;
      }

      initializing = true;

      try {
        const three = await import("three");

        if (disposed) return;
        raycaster = new three.Raycaster();
        pointer = new three.Vector2();

        renderer = new three.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });

        renderer.outputColorSpace = three.SRGBColorSpace;

        renderer.setClearColor(0x000000, 0);

        scene = new three.Scene();

        const fov = 2 * Math.atan(BASE_HEIGHT / (2 * 1600)) * 180 / Math.PI;
        camera = new three.PerspectiveCamera(fov, DESIGN_WIDTH / BASE_HEIGHT, 1, 5000);
        camera.position.set(0, 0, 1600);

        camera.lookAt(0, 0, 0);

        const loader = new three.TextureLoader();

        const loadedTextures = await Promise.all(
          ARTWORKS.map(async (artwork) => {
            try {
              return await loader.loadAsync(
                `/home/social-media/reference/${artwork.id}.webp`,
              );
            } catch {
              return null;
            }
          }),
        );

        if (disposed) {
          loadedTextures.forEach((texture) => texture?.dispose());
          return;
        }

        loadedTextures.forEach((texture, index) => {
          if (!texture || index >= CARD_COUNT) {
            return;
          }

          texture.colorSpace = three.SRGBColorSpace;

          texture.anisotropy = Math.min(
            8,
            renderer!.capabilities.getMaxAnisotropy(),
          );

          textures.push(texture);

          const geometry = new three.PlaneGeometry(
            1,
            1,
            SEGMENTS_X,
            SEGMENTS_Y,
          );

          const positions = geometry.attributes
            .position as THREE.BufferAttribute;

          positions.setUsage(three.DynamicDrawUsage);

          const material = new three.MeshBasicMaterial({
            map: texture,
            side: three.DoubleSide,
            transparent: false,
            opacity: 1,
            depthTest: true,
            depthWrite: true,
            polygonOffset: false,
          });
          // Keep the artwork readable on the back face instead of mirroring it.
          material.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <map_fragment>",
              three.ShaderChunk.map_fragment.replace(
                "texture2D( map, vMapUv )",
                "texture2D( map, gl_FrontFacing ? vMapUv : vec2( 1.0 - vMapUv.x, vMapUv.y ) )",
              ),
            );
          };
          material.customProgramCacheKey = () => "social-ribbon-double-face-v1";

          const mesh = new three.Mesh(geometry, material);

          mesh.frustumCulled = false;
          mesh.renderOrder = index;

          scene!.add(mesh);

          panels.push({
            index,
            mesh,
          });
          if (index < 6) {
            const arrivalMaterial = material.clone();
            arrivalMaterial.userData.cardSize = new three.Vector2(406, 283);
            arrivalMaterial.onBeforeCompile = (shader) => {
              material.onBeforeCompile(shader, renderer!);
              shader.uniforms.cardSize = { value: arrivalMaterial.userData.cardSize };
              shader.fragmentShader = "uniform vec2 cardSize;\n" + shader.fragmentShader;
              shader.fragmentShader = shader.fragmentShader.replace("void main() {", `void main() {
                vec2 corner = abs((vMapUv - 0.5) * cardSize) - (cardSize * 0.5 - 20.0);
                if (length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) > 20.0) discard;
              `);
            };
            arrivalMaterial.customProgramCacheKey = () => "social-grid-rounded-v1";
            const arrivalMesh = new three.Mesh(geometry.clone(), arrivalMaterial);
            arrivalMesh.frustumCulled = false;
            scene!.add(arrivalMesh);
            panels.push({ index, mesh: arrivalMesh, kind: "grid" });
          }
        });

        if (panels.length === 0) viewport.dataset.fallback = "true";

        if (disposed) return;

        measure();
        paint();
      } catch (error) {
        console.error("SocialMedia WebGL initialization failed:", error);

        viewport.dataset.fallback = "true";
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void initializeRibbon();
          readScroll();
        }
      },
      {
        rootMargin: "100% 0px",
      },
    );

    observer.observe(viewport);
    const visibilityObserver = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      if (visible === viewportVisible) return;
      viewportVisible = visible;
      if (visible) {
        schedule();
        gsap.ticker.add(animateInteractions);
      } else {
        gsap.ticker.remove(animateInteractions);
      }
    });
    visibilityObserver.observe(viewport);

    const resizeObserver = new ResizeObserver(() => {
      measure();
      scrollTween?.scrollTrigger?.refresh();
      readScroll();
    });

    resizeObserver.observe(viewport);
    resizeObserver.observe(section);

    const onMotionChange = () => {
      reducedMotion = mediaQuery.matches;

      if (!reducedMotion) {
        void initializeRibbon();
      }

      measure();
      createScrollAnimation();
      readScroll();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();

      viewport.dataset.fallback = "true";
    };

    const onContextRestored = () => {
      delete viewport.dataset.fallback;
      schedule();
    };

    measure();
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerleave", onPointerLeave);
    createScrollAnimation();
    readScroll();

    void document.fonts.ready.then(() => {
      if (!disposed) {
        measure();
        schedule();
      }
    });

    mediaQuery.addEventListener("change", onMotionChange);

    canvas.addEventListener("webglcontextlost", onContextLost);

    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      disposed = true;
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerleave", onPointerLeave);
      gsap.ticker.remove(animateInteractions);

      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();

      observer.disconnect();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();

      mediaQuery.removeEventListener("change", onMotionChange);

      canvas.removeEventListener("webglcontextlost", onContextLost);

      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      panels.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      textures.forEach((texture) => {
        texture.dispose();
      });

      renderer?.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="social-media"
      className={styles.section}
      style={{ background: SOCIAL_BACKGROUND }}
      aria-labelledby="social-media-heading"
    >
      <div ref={viewportRef} className={styles.viewport} style={{ background: SOCIAL_BACKGROUND }}>
        <div ref={stageRef} className={styles.stage}>
          <h2 id="social-media-heading" className={`${styles.heading} [@media(max-width:1023px)]:[font-size:240px]!`}>
            <span className={`${styles.design} [@media(max-width:1023px)]:[top:calc(190px_+_var(--intro-offset))]`}>
              <span ref={designRef}>I&apos;M PUMP</span>
            </span>

            <span className={`${styles.motion} [@media(max-width:1023px)]:[top:calc(460px_+_var(--intro-offset))]`}>
              <span ref={motionRef}>TECHNOLOGY</span>
            </span>
          </h2>

          <p className={`${styles.caption} [@media(max-width:1023px)]:hidden`}>
            EXPLORING IDEAS THROUGH
            <br />
            DAILY DESIGN PRACTICE.
          </p>

          <svg
            className={styles.guides}
            viewBox="0 0 1904 878"
            aria-hidden="true"
          >
            {[0, 1].map((index) => (
              <path
                key={index}
                ref={(element) => {
                  guideRefs.current[index] = element;
                }}
              />
            ))}
          </svg>

          <canvas
            ref={canvasRef}
            className={styles.ribbon}
            aria-hidden="true"
          />

          <div className={styles.divider} aria-hidden="true" />
          <div className={`${styles.divider} ${styles.secondDivider}`} aria-hidden="true" />

          <div className={styles.grid}>
            {ARTWORKS.slice(0, 6).map((artwork) => (
              <figure className={styles.card} key={artwork.id}>
                <Image
                  src={`/home/social-media/reference/${artwork.id}.webp`}
                  alt={artwork.alt}
                  width={406}
                  height={283}
                  unoptimized
                  className={styles.artwork}
                />
              </figure>
            ))}
          </div>

          <p className={styles.description}>
            Concepts, explorations, and interface
            <br />
            experiments shared openly as part of
            <br />
            our creative process.
          </p>

          <div className={styles.viewAll}>
            <GlassViewAllButton
              href="https://dribbble.com/"
              aria-label="View all on Dribbble"
              scale={4 / 3}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
