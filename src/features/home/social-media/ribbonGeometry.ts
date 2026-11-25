export const DESIGN_WIDTH = 1904;
export const BASE_HEIGHT = 878;

export const CARD_COUNT = 9;
export const FINAL_COUNT = 6;

export const SEGMENTS_X = 48;
export const SEGMENTS_Y = 8;

export type RibbonVertex = [number, number, number];

const TWO_PI = Math.PI * 2;

const HELIX_RADIUS = 680;
const HELIX_DEPTH = 560;
const HELIX_PITCH = 85;

const PANEL_HEIGHT = 285;
const PANEL_ARC = 0.53;
const PANEL_GAP = 0.025;
const PANEL_STEP = PANEL_ARC + PANEL_GAP;

const GRID = {
  left: 335,
  top: 107,
  width: 406,
  height: 283,
  gapX: 16,
  gapY: 25,
};

const MOBILE_GRID = {
  left: 110,
  top: -670,
  width: 818,
  height: 570,
  gapX: 48,
  gapY: 48,
};

export const clamp = (value: number) => Math.max(0, Math.min(1, value));

export const mix = (a: number, b: number, amount: number) =>
  a + (b - a) * amount;

export const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function getHeadAngle(progress: number) {
  const travel = smoothstep(progress / 0.75);

  return mix(1.4, 1.4 + TWO_PI * 1.1, travel);
}

function getHorizontalTravel(progress: number) {
  return -420 * smoothstep((progress - 0.33) / 0.34);
}

/**
 * Single shared 3D helix.
 * Every card is sampled from this exact curve.
 */
function getCurvePoint(theta: number, progress: number): RibbonVertex {
  const x =
    DESIGN_WIDTH / 2 +
    HELIX_RADIUS * Math.sin(theta) +
    getHorizontalTravel(progress);

  const y = 640 - HELIX_PITCH * theta;

  const z = HELIX_DEPTH * Math.cos(theta);

  return [x - DESIGN_WIDTH / 2, BASE_HEIGHT / 2 - y, z];
}

function getFinalRect(
  index: number,
  u: number,
  v: number,
  mobile: boolean,
): RibbonVertex {
  const grid = mobile ? MOBILE_GRID : GRID;
  const columns = mobile ? 2 : 3;

  const column = index % columns;
  const row = Math.floor(index / columns);

  const x = grid.left + column * (grid.width + grid.gapX) + u * grid.width;

  const y = grid.top + row * (grid.height + grid.gapY) + v * grid.height;

  return [x - DESIGN_WIDTH / 2, BASE_HEIGHT / 2 - y, 0];
}

export function getMorphProgress(progress: number) {
  return smoothstep((progress - 0.73) / 0.22);
}

/**
 * Returns one vertex of a card.
 *
 * u: 0..1, left to right
 * v: 0..1, top to bottom
 *
 * Before morphing, every card follows the
 * same curve with a fixed phase offset.
 */
export function getVertex(
  index: number,
  u: number,
  v: number,
  progress: number,
  mobile = false,
): RibbonVertex {
  const head = getHeadAngle(progress);

  const theta = head - index * PANEL_STEP + (u - 0.5) * PANEL_ARC;

  const point = getCurvePoint(theta, progress);

  const origin: RibbonVertex = [
    point[0],
    point[1] + (0.5 - v) * PANEL_HEIGHT,
    point[2],
  ];

  // Only the first six cards join the grid.
  if (index >= FINAL_COUNT) {
    return origin;
  }

  const morph = getMorphProgress(progress);

  if (morph <= 0) {
    return origin;
  }

  const destination = getFinalRect(index, u, v, mobile);

  if (morph >= 1) {
    return destination;
  }

  // Smooth continuous transformation.
  // No wrapped angles or discontinuous yaw.
  return [
    mix(origin[0], destination[0], morph),
    mix(origin[1], destination[1], morph),
    mix(origin[2], destination[2], morph),
  ];
}

/**
 * Opacity is monotonic:
 * a card enters once and never blinks.
 * The three non-grid cards leave at the end.
 */
export function getPanelOpacity(index: number, progress: number) {
  const entrance = smoothstep((progress - (0.075 + index * 0.012)) / 0.055);

  if (index < FINAL_COUNT) {
    return entrance;
  }

  const exit = 1 - smoothstep((progress - 0.76) / 0.11);

  return entrance * exit;
}
