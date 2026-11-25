"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type CSSProperties,
} from "react";

const waveOrigins = new WeakMap<Element, number>();
const WAVE_DURATION = 6800;
const WAVE_EASE = "cubic-bezier(.37,0,.63,1)";

function waveFrames(closedScale: number): Keyframe[] {
  // A→B 1.5s, B .5s, B→A 1.5s, A .5s;
  // A→B .3s, B .5s, B→A 1.5s, A .5s, then repeat.
  return [
    { at: 0, open: false },
    { at: 1500, open: true },
    { at: 2000, open: true },
    { at: 3500, open: false },
    { at: 4000, open: false },
    { at: 4300, open: true },
    { at: 4800, open: true },
    { at: 6300, open: false },
    { at: 6800, open: false },
  ].map(({ at, open }) => ({
    transform: `scale(${open ? 1 : closedScale})`,
    opacity: open ? 1 : 0,
    offset: at / WAVE_DURATION,
    easing: WAVE_EASE,
  }));
}

/** Offset inner contour: nearly hairline at one side, fuller at the other. */
function taperedRing(radius: number, thinLeft: boolean) {
  const inside = radius - 0.38;
  const center = 50 + (thinLeft ? -0.37 : 0.37);
  return `M${50 + radius} 50a${radius} ${radius} 0 1 0 ${-2 * radius} 0a${radius} ${radius} 0 1 0 ${2 * radius} 0Z M${center + inside} 50a${inside} ${inside} 0 1 0 ${-2 * inside} 0a${inside} ${inside} 0 1 0 ${2 * inside} 0Z`;
}

type Appearance = {
  label?: string;
  /** Full diameter, including the translucent background disc. */
  size?: CSSProperties["width"];
  animated?: boolean;
  /** Seconds; negative values start at a different point in the wave cycle. */
  delay?: number;
  className?: string;
};
type ButtonProps = Appearance &
  Omit<ComponentProps<"button">, keyof Appearance | "children"> & {
    href?: never;
    decorative?: false;
  };
type LinkProps = Appearance &
  Omit<ComponentProps<typeof Link>, keyof Appearance | "children"> & {
    decorative?: false;
  };
type DecorativeProps = Appearance &
  Omit<ComponentProps<"span">, keyof Appearance | "children"> & {
    decorative: true;
    href?: never;
  };
export type WaveButtonProps = ButtonProps | LinkProps | DecorativeProps;

/** The blue centre, tapered wave rings and translucent disc scale together. */
export default function WaveButton({
  label = "Open details",
  size = "var(--wave-button-size,60px)",
  animated = true,
  delay = 0,
  className = "",
  decorative = false,
  ...props
}: WaveButtonProps) {
  const root = useRef<HTMLElement | null>(null);
  const id = `wave-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const group = element.closest("[data-wave-group]") ?? element;
    const origin =
      waveOrigins.get(group) ?? Number(document.timeline.currentTime ?? 0);
    waveOrigins.set(group, origin);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const frames: Record<string, Keyframe[]> = {
      inner: [{ transform: "scale(1)" }, { transform: "scale(1)" }],
      middle: waveFrames(32 / 38),
      outer: waveFrames(32 / 44),
    };
    const animations = Array.from(
      element.querySelectorAll<SVGElement>("[data-wave-ring]"),
      (ring) => {
        const animation = ring.animate(frames[ring.dataset.waveRing!], {
          duration: WAVE_DURATION,
          iterations: Infinity,
          easing: "linear",
          fill: "both",
        });
        animation.pause();
        return animation;
      },
    );
    let visible = false;
    let wasRunning: boolean | undefined;
    const sync = () => {
      const running =
        visible && !document.hidden && animated && !preference.matches;
      element.dataset.waveVisible = String(running);
      // Repeated observer notifications must not restart the shared timeline.
      if (running === wasRunning) return;
      wasRunning = running;
      animations.forEach((animation) => {
        if (running) {
          animation.play();
          animation.startTime = origin + delay * 1000;
        } else {
          animation.pause();
          if (preference.matches || !animated) animation.currentTime = 1750;
        }
      });
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    // Map markers share one visibility boundary so their wave cycles stay in sync.
    observer.observe(group);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      animations.forEach((animation) => animation.cancel());
    };
  }, [animated, delay]);

  const artwork = (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      className="pointer-events-none block size-full overflow-visible"
    >
      <defs>
        <linearGradient id={`${id}-disc`} x1="15%" y1="0%" x2="80%" y2="100%">
          <stop stopColor="#fff" stopOpacity=".55" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity=".55" />
        </linearGradient>
        <linearGradient id={`${id}-blue`} x1="30%" y1="0%" x2="65%" y2="100%">
          <stop stopColor="#005EFF" />
          <stop offset=".5" stopColor="#0044D8" />
          <stop offset="1" stopColor="#00199E" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".75" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".1" />
          <stop offset="1" stopColor="#fff" stopOpacity=".75" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="49.5"
        fill={`url(#${id}-disc)`}
        stroke={`url(#${id}-edge)`}
        strokeWidth=".18"
      />
      {[
        { radius: 32, name: "inner" },
        { radius: 38, name: "middle" },
        { radius: 44, name: "outer" },
      ].map(({ radius, name }) => (
        <g
          key={name}
          data-wave-ring={name}
          className="[transform-origin:50px_50px] [backface-visibility:hidden] will-change-[transform,opacity]"
        >
          <path
            d={taperedRing(radius, name === "middle")}
            fill={`url(#${id}-blue)`}
            fillRule="evenodd"
          />
        </g>
      ))}
      <circle cx="50" cy="50" r="27" fill={`url(#${id}-blue)`} />
    </svg>
  );

  const shared = {
    ref: (element: HTMLElement | null) => {
      root.current = element;
    },
    "data-wave-button": "",
    "data-wave-visible": "false",
    "data-wave-animated": String(animated),
    className: `relative inline-grid shrink-0 scale-50 place-items-center rounded-full border-0 bg-white/20 p-0 align-middle shadow-[0_0_16px_5px_#005eff55,inset_0_0_18px_#005eff44] backdrop-blur-[4px] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#005eff] disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
    style: { width: size, height: size } as CSSProperties,
  };
  if (decorative) {
    const { style, ...rest } = props as ComponentProps<"span">;
    return (
      <span
        {...rest}
        {...shared}
        aria-hidden="true"
        style={{ ...shared.style, ...style }}
      >
        {artwork}
      </span>
    );
  }
  if ("href" in props && props.href !== undefined) {
    const { style, ...rest } = props as LinkProps;
    return (
      <Link
        {...rest}
        {...shared}
        aria-label={props["aria-label"] ?? label}
        style={{ ...shared.style, ...style }}
      >
        {artwork}
      </Link>
    );
  }
  const { style, type = "button", ...rest } = props as ButtonProps;
  return (
    <button
      {...rest}
      {...shared}
      type={type}
      aria-label={props["aria-label"] ?? label}
      style={{ ...shared.style, ...style }}
    >
      {artwork}
    </button>
  );
}
