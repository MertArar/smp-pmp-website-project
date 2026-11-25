"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";

/** Elastic crest and ruler highlights share the thumb's animated position. */
export default function HomeElasticGallery({
  value,
  count,
  onChange,
}: {
  value: number;
  count: number;
  onChange: (position: number) => void;
}) {
  const [selected, setSelected] = useState(value);
  const ropeId = `home-product-rope-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const crestLine = useRef<SVGPathElement>(null);
  const crestGradient = useRef<SVGLinearGradientElement>(null);
  const markers = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLButtonElement>(null);
  const target = useRef(value);
  const current = useRef(value);
  const rulerCenter = useRef(Math.max(0, Math.min(Math.round(value) - 3, count - 7)) + 3);
  const dragLastX = useRef(0);
  const velocity = useRef(0);
  const ropeTension = useRef({ displacement: 0, velocity: 0 });
  const dragging = useRef(false);
  const selection = useRef(value);
  const frame = useRef(0);
  const reduced = useRef(false);
  const animate = useRef<() => void>(() => {});
  const onChangeRef = useRef(onChange);
  const userDriven = useRef(false);
  onChangeRef.current = onChange;

  useEffect(() => {
    userDriven.current = false;
    const snapped = Math.round(value);
    target.current = snapped;
    selection.current = snapped;
    setSelected(snapped);
    animate.current();
  }, [value]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduced.current = preference.matches;
    };
    sync();
    preference.addEventListener("change", sync);
    let last = 0;
    const paint = (time: number) => {
      const dt = last ? Math.min((time - last) / 16.667, 2) : 1;
      last = time;
      if (reduced.current) {
        current.current = target.current;
        velocity.current = 0;
      } else {
        velocity.current += (target.current - current.current) * 0.09 * dt;
        velocity.current *= Math.pow(0.66, dt);
        current.current += velocity.current * dt;
      }
      // Start at the center and pan the ruler window when the thumb reaches
      // an edge. The product range remains independent of the seven marks.
      const windowStart = Math.max(0, Math.min(current.current - 6, Math.max(0, count - 7)));
      rulerCenter.current = windowStart + 3;
      const x = 48 + (current.current - windowStart) * 54;
      // The strip consumes this same smoothed clock instead of raw pointer
      // events. Parent React rendering is bypassed during thumb dragging.
      if (userDriven.current) onChangeRef.current(current.current);
      // A separate spring lets the rope stretch during a pull and relax after
      // release. Keep its crest just above the ball so they read as contact.
      const tension = ropeTension.current;
      const pull = reduced.current ? 0 : Math.min(2, Math.abs(velocity.current) * 8);
      tension.velocity += (pull - tension.displacement) * 0.12 * dt;
      tension.velocity *= Math.pow(0.68, dt);
      tension.displacement += tension.velocity * dt;
      if (reduced.current) tension.displacement = tension.velocity = 0;
      const crestY = 13 - tension.displacement;
      // Broad, shallow shoulders match the reference. Shorten only the edge
      // shoulder at the first/last product to preserve monotonic control points.
      const leftShoulder = Math.min(72, x - 2);
      const rightShoulder = Math.min(72, 418 - x);
      const path = `M 0 30 H ${x - leftShoulder} C ${x - leftShoulder * 0.53} 30 ${x - leftShoulder * 0.56} ${crestY} ${x} ${crestY} C ${x + rightShoulder * 0.56} ${crestY} ${x + rightShoulder * 0.53} 30 ${x + rightShoulder} 30 H 420`;
      line.current?.setAttribute("d", path);
      crestLine.current?.setAttribute("d", path);
      crestGradient.current?.setAttribute("x1", String(x - 68));
      crestGradient.current?.setAttribute("x2", String(x + 68));
      ball.current?.style.setProperty("left", `${(x / 420) * 100}%`);
      ball.current?.style.setProperty("top", "27px");
      markers.current?.querySelectorAll<HTMLElement>("[data-ruler-mark]").forEach((mark, index) => {
        const position = Math.floor(windowStart) - 1 + index;
        const markX = 48 + (position - windowStart) * 54;
        mark.style.left = `${markX / 420 * 100}%`;
        const distance = Math.abs(x - markX);
        const lift = Math.pow(Math.max(0, 1 - distance / 54), 2);
        mark.style.transform = `translateY(${-18 * lift}px)`;
        const edgeFade = Math.max(0, Math.min(1, (markX - 8) / 16, (412 - markX) / 16));
        mark.style.opacity = String(position < 0 || position >= count ? 0 : (0.35 + lift * 0.65) * edgeFade);
      });
      ball.current?.style.setProperty(
        "--ball-lean",
        `${Math.max(-9, Math.min(9, velocity.current * 22))}deg`,
      );
      if (
        Math.abs(target.current - current.current) > 0.0005 ||
        Math.abs(velocity.current) > 0.0005 ||
        Math.abs(tension.displacement) > 0.005 ||
        Math.abs(tension.velocity) > 0.005
      )
        frame.current = requestAnimationFrame(paint);
      else {
        frame.current = 0;
        last = 0;
      }
    };
    animate.current = () => {
      if (!frame.current) frame.current = requestAnimationFrame(paint);
    };
    animate.current();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      preference.removeEventListener("change", sync);
    };
  }, [count]);

  function setStop(index: number) {
    userDriven.current = true;
    const stop = Math.max(0, Math.min(count - 1, index));
    target.current = stop;
    selection.current = stop;
    setSelected((previous) => Math.round(previous) === Math.round(stop) ? previous : stop);
    animate.current();
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !track.current) return;
    const rect = track.current.getBoundingClientRect();
    const delta = (event.clientX - dragLastX.current) / rect.width * 420 / 54;
    dragLastX.current = event.clientX;
    setStop(selection.current + delta);
  }
  function end() {
    if (!dragging.current) return;
    dragging.current = false;
    setStop(Math.round(selection.current));
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? count - 1
          : event.key === "ArrowRight"
            ? selection.current + 1
            : event.key === "ArrowLeft"
              ? selection.current - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      setStop(Math.round(next));
    }
  }
  function stopKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) end();
  }

  return (
    <div
      data-home-product-gallery
      className="relative mx-auto w-full max-w-[480px] translate-y-4 px-3 md:translate-y-5 lg:translate-y-6 xl:translate-y-8"
      aria-label="Pump gallery position"
    >
      <div
        ref={track}
        data-elastic-track
        className="relative mx-auto h-[100px] w-[72%] touch-pan-y select-none"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragging.current = true;
          dragLastX.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
      >
        <div
          aria-hidden="true"
          data-slider-glow
          className="pointer-events-none absolute -top-[160px] left-1/2 h-[190px] w-[92%] -translate-x-1/2"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#4687B852_0%,#4687B82b_32%,#4687B80d_58%,transparent_78%)] blur-[12px]" />
        </div>
        <div
          aria-hidden="true"
          ref={markers}
          className="pointer-events-none absolute inset-x-0 -top-6 h-12 overflow-hidden"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              data-ruler-mark
              style={{
                transform:
                  "translateY(0)",
                height: 16,
                left: `${(48 + (i - 1) * 54) / 420 * 100}%`,
                opacity: 0.35,
              }}
              className="absolute top-6 w-px bg-linear-to-b from-transparent via-[#e0e3e5] to-transparent"
            />
          ))}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 420 90"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient
              id={ropeId}
              gradientUnits="userSpaceOnUse"
              x1="20"
              x2="400"
              y1="0"
              y2="0"
            >
              <stop stopColor="#a3adb5" stopOpacity="0" />
              <stop offset=".25" stopColor="#a3adb5" stopOpacity=".35" />
              <stop offset=".5" stopColor="#a3adb5" stopOpacity=".45" />
              <stop offset=".75" stopColor="#a3adb5" stopOpacity=".35" />
              <stop offset="1" stopColor="#a3adb5" stopOpacity="0" />
            </linearGradient>
            <linearGradient ref={crestGradient} id={`${ropeId}-crest`} gradientUnits="userSpaceOnUse" x1="142" x2="278" y1="0" y2="0">
              <stop stopColor="#4687B8" stopOpacity="0" />
              <stop offset=".5" stopColor="#398abd" stopOpacity=".95" />
              <stop offset="1" stopColor="#4687B8" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`${ropeId}-light`}
              gradientUnits="userSpaceOnUse"
              x1="110"
              x2="310"
              y1="0"
              y2="0"
            >
              <stop stopColor="#4687B8" stopOpacity="0" />
              <stop offset=".5" stopColor="#4687B8" stopOpacity="1" />
              <stop offset="1" stopColor="#27272A" stopOpacity="1" />
            </linearGradient>
            <filter
              id={`${ropeId}-light-feather`}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <mask
              id={`${ropeId}-upper-light`}
              maskUnits="userSpaceOnUse"
              x="-30"
              y="-110"
              width="480"
              height="170"
            >
              <path
                d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420V-100H0Z"
                transform="translate(0,-4)"
                fill="white"
                filter={`url(#${ropeId}-light-feather)`}
              />
            </mask>
          </defs>
          <path
            ref={line}
            d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420"
            fill="none"
            stroke={`url(#${ropeId})`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            ref={crestLine}
            d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420"
            fill="none"
            stroke={`url(#${ropeId}-crest)`}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <button
          ref={ball}
          type="button"
          role="slider"
          aria-label="Scroll pump cards"
          aria-valuemin={0}
          aria-valuemax={count - 1}
          aria-valuenow={Number(selected.toFixed(2))}
          aria-valuetext={`Product ${Math.round(selected) + 1} of ${count}`}
          onKeyDown={keyboard}
          onKeyUp={stopKeyboard}
          onBlur={end}
          style={{
            left: `${(210 + (current.current - rulerCenter.current) * 54) / 420 * 100}%`,
            transform: "translateX(-50%) rotate(var(--ball-lean,0deg))",
          }}
          className="absolute top-[27px] grid size-[60px] cursor-grab touch-none place-items-center rounded-full border border-[#a5c7dc]/55 bg-[#4687B8]/30 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="relative size-[40px] rounded-full border border-white/85 bg-[#dedede]" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {`Product ${Math.round(selected) + 1} of ${count}`}
      </p>
    </div>
  );
}
