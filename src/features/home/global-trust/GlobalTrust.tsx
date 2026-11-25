"use client";

import { useHomeCompact, MobileTrust } from "../HomeMobileSections";

import HomeMediaVideo from "@/features/home/HomeMediaVideo";

import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const smoothstep = (value: number) => {
  const t = clamp(value);

  return t * t * (3 - 2 * t);
};

const SHARED_BACKGROUND =
  "linear-gradient(90deg, #D5EAF7 0%, #D1E8F6 48%, #C6E0F7 68%, #AFCDF9 90%, #BBD7FC 100%)";

const logos = [
  { src: "/home/global-trust/iski.png", alt: "İSKİ" },

  { src: "/home/global-trust/ilbank.png", alt: "İLBANK" },

  { src: "/home/global-trust/isdemir.png", alt: "İSDEMİR" },

  { src: "/home/global-trust/izsu.png", alt: "İZSU" },
];

function DesktopGlobalTrust() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!section || !viewport || !image) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    let frame = 0;
    let lastTime = 0;
    let current = 0;
    let target = 0;
    let top = 0;
    let distance = 1;
    let width = innerWidth;
    let height = innerHeight;
    let baseWidth = 1;
    let visible = false;
    let partnersVisible = false;
    let disposed = false;
    let lastImageTransform = "";
    let lastTextProgress = -1;
    let lastIndicatorOpacity = -1;
    const setMarquee = (progress: number) => {
      const running = visible && partnersVisible && !document.hidden && !reduced && progress > 0.001;
      const value = String(running);
      if (section.dataset.marqueeRunning !== value) section.dataset.marqueeRunning = value;
    };
    const paint = () => {
      const imageProgress = smoothstep(current / 0.78);
      const finalWidth = Math.min(baseWidth, width * 0.195833);
      const scale = lerp(1, finalWidth / baseWidth, imageProgress);
      const x = width * (lerp(0.5, 0.358, imageProgress) - 0.5);
      const y = height * (lerp(0.5, 0.37, imageProgress) - 0.5);
      const transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
      if (lastImageTransform !== transform) {
        image.style.transform = transform;
        lastImageTransform = transform;
      }
      const textProgress = smoothstep((current - 0.48) / 0.32);
      const offset = lerp(45, 0, textProgress);
      if (lastTextProgress !== textProgress) {
        if (headingRef.current) {
          headingRef.current.style.opacity = String(textProgress);
          headingRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        if (descriptionRef.current) {
          descriptionRef.current.style.opacity = String(textProgress);
          descriptionRef.current.style.transform = `translate3d(0, ${offset * 0.6}px, 0)`;
        }
        if (partnersRef.current) partnersRef.current.style.opacity = String(textProgress);
        lastTextProgress = textProgress;
      }
      const indicatorOpacity = 1 - smoothstep(current / 0.22);
      if (indicatorRef.current && lastIndicatorOpacity !== indicatorOpacity) {
        indicatorRef.current.style.opacity = String(indicatorOpacity);
        lastIndicatorOpacity = indicatorOpacity;
      }
      setMarquee(textProgress);
    };
    const animate = (time: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = lastTime ? Math.min(time - lastTime, 64) : 16.667;
      lastTime = time;
      current = reduced ? target : lerp(current, target, 1 - Math.exp(-delta / 180));
      if (Math.abs(current - target) < 0.00001) current = target;
      paint();
      if (current !== target) frame = requestAnimationFrame(animate);
      else lastTime = 0;
    };
    const schedule = () => {
      target = clamp((scrollY - top) / distance);
      if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(animate);
    };
    const measure = () => {
      if (disposed) return;
      top = section.getBoundingClientRect().top + scrollY;
      distance = Math.max(section.offsetHeight - viewport.offsetHeight, 1);
      width = viewport.clientWidth;
      height = viewport.clientHeight;
      // A contained, fixed-size layer scales on the compositor. Its full bounds
      // fit the viewport at every point, including short and portrait screens.
      baseWidth = Math.min(width * 0.94, height * 0.9 * 1128 / 680);
      image.style.width = `${baseWidth}px`;
      schedule();
      paint();
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      setMarquee(0);
    };
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) schedule();
      else stop();
    });
    const pageVisibility = () => {
      if (document.hidden) stop();
      else { schedule(); setMarquee(smoothstep((current - 0.48) / 0.32)); }
    };
    const onMotionChange = () => {
      reduced = preference.matches;
      if (reduced) { current = target; paint(); }
      schedule();
    };
    measure();
    current = target;
    paint();
    visibilityObserver.observe(viewport);
    const partnersObserver = new IntersectionObserver(entries => {
      partnersVisible = entries.some(entry => entry.isIntersecting);
      setMarquee(smoothstep((current - 0.48) / 0.32));
    });
    if (partnersRef.current) partnersObserver.observe(partnersRef.current);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(section);
    if (section.parentElement) resizeObserver.observe(section.parentElement);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", pageVisibility);
    preference.addEventListener("change", onMotionChange);
    return () => {
      disposed = true;
      stop();
      visibilityObserver.disconnect();
      partnersObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", pageVisibility);
      preference.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global-trust"
      className="relative h-[260svh] w-full"
    >
      <style>{`

        @keyframes globalTrustMarquee {

          from {

            transform: translateX(0);

          }

          to {

            transform: translateX(-50%);

          }

        }

        .global-trust-marquee {

          display: flex;

          width: max-content;

          animation: globalTrustMarquee 28s linear infinite;
          animation-play-state: paused;

          will-change: transform;

        }

        #global-trust[data-marquee-running="true"] .global-trust-marquee {
          animation-play-state: running;
        }

        .global-trust-logo-group {

          display: flex;

          align-items: center;

          flex-shrink: 0;

          gap: 64px;

          padding-right: 64px;

        }

        .global-trust-logo {

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          width: 112px;

          height: 67px;

        }

        .global-trust-logo img {

          display: block;

          max-width: 100%;

          max-height: 100%;

          width: auto;

          height: auto;

          object-fit: contain;

          opacity: 0.65;

          filter:

            brightness(0)

            saturate(100%)

            invert(72%)

            sepia(10%)

            saturate(672%)

            hue-rotate(169deg)

            brightness(91%)

            contrast(86%);

        }

        @media (prefers-reduced-motion: reduce) {

          .global-trust-marquee {

            animation: none;

          }

        }

      `}</style>

      {/* STICKY CONTENT */}

      <div
        ref={viewportRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{
          backgroundColor: "#D1E8F6",

          backgroundImage: SHARED_BACKGROUND,
        }}
      >
        {/* SCROLL DOWN GROUP */}

        <div
          ref={indicatorRef}
          className="pointer-events-none absolute left-1/2 top-[5.8%] z-30 w-[232px] -translate-x-1/2"
          style={{
            opacity: 1,
          }}
        >
          {/* SCROLL DOWN TEXT */}

          <p
            className="m-0 h-[17.33px] w-[232px] text-center text-[#9EB7D0]"
            style={{
              fontFamily: "var(--font-sf-pro)",

              fontSize: "16px",

              fontWeight: 410,

              lineHeight: "107%",

              letterSpacing: "-0.04em",

              fontStretch: "expanded",

              whiteSpace: "nowrap",
            }}
          >
            Scroll Down to Learn more
          </p>

          {/* SCROLL DOWN MOUSE VIDEO */}

          <div
            className="absolute isolate overflow-hidden"
            style={{
              top: "32px",

              left: "82.67px",

              width: "68px",

              height: "68px",

              borderRadius: "11.72px",

              backgroundColor: "#9EB7D0",

              clipPath: "inset(0 round 11.72px)",
            }}
          >
            <HomeMediaVideo
              src="/home/solution/scroll-down.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls={false}
              aria-label="Scroll down animation"
              className="h-full w-full object-cover"
              style={{
                mixBlendMode: "screen",

                filter: "contrast(1.25) brightness(1.1)",
              }}
            />
          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="pointer-events-none absolute inset-0">
          {/* FIGMA HEADLINE */}

          <div
            ref={headingRef}
            className="absolute z-10"
            style={{
              left: "28.4722%",

              top: "23%",

              width: "44.4444%",

              height: "133.33px",

              opacity: 0,

              transform: "translate3d(0, 45px, 0)",

              fontFamily: "var(--font-sf-pro)",
            }}
          >
            <h1
              className="m-0 font-normal"
              style={{
                width: "100%",

                fontFamily: "var(--font-sf-pro)",

                fontSize: "66.67px",

                fontWeight: 410,

                fontStretch: "expanded",

                lineHeight: "100%",

                letterSpacing: "-0.04em",

                backgroundImage:
                  "linear-gradient(180deg, #005EFF 0%, #001EA2 100%)",

                WebkitBackgroundClip: "text",

                backgroundClip: "text",

                WebkitTextFillColor: "transparent",

                color: "transparent",
              }}
            >
              <span className="block whitespace-nowrap">
                Proven Performance.
              </span>

              <span
                className="block whitespace-nowrap"
                style={{
                  paddingLeft: "34%",
                }}
              >
                Global Trust.
              </span>
            </h1>
          </div>

          {/* ANIMATED IMAGE */}

          <div
            ref={imageRef}
            className="absolute z-20 flex items-center justify-center"
            style={{
              left: "50%",

              top: "50%",

              width: "min(94vw, 149.2941svh)",
              aspectRatio: "1128 / 680",

              transform: "translate3d(-50%, -50%, 0)",

              willChange: "transform",
            }}
          >
            <img
              src="/home/global-trust/ikon.png"
              alt="Global Trust"
              draggable={false}
              width={1128}
              height={680}
              className="block h-full w-full select-none object-contain"
            />
          </div>

          {/* DESCRIPTION */}

          <div
            ref={descriptionRef}
            className="absolute z-10"
            style={{
              left: "50%",

              top: "37.5%",

              width: "432px",

              height: "64px",

              opacity: 0,

              transform: "translate3d(0, 27px, 0)",

              fontFamily: "var(--font-sf-pro)",
            }}
          >
            <p
              className="m-0"
              style={{
                width: "100%",

                fontFamily: "var(--font-sf-pro)",

                fontSize: "20px",

                fontWeight: 270,

                fontStretch: "expanded",

                lineHeight: "107%",

                letterSpacing: "-0.02em",

                color: "#9EB7D0",
              }}
            >
              Our high-performance pumps power thousands of successful projects
              across 100+ countries.
            </p>
          </div>

          {/* INFINITE LOGO MARQUEE */}

          <div
            ref={partnersRef}
            className="absolute left-0 z-10 w-full overflow-hidden"
            style={{
              top: "69%",

              height: "67px",

              opacity: 0,
            }}
            aria-label="Our trusted partners"
          >
            <div className="global-trust-marquee">
              {[0, 1].map((groupIndex) => (
                <div
                  key={groupIndex}
                  className="global-trust-logo-group"
                  aria-hidden={groupIndex === 1}
                >
                  {Array.from({ length: 4 }).flatMap((_, repeatIndex) =>
                    logos.map((logo, logoIndex) => (
                      <div
                        key={`${repeatIndex}-${logoIndex}`}
                        className="global-trust-logo"
                      >
                        <img
                          src={logo.src}
                          alt={groupIndex === 0 ? logo.alt : ""}
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    )),
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT-SIDE PROGRESSIVE BLUR */}

            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-20"
              style={{
                width: "17.88%",

                backdropFilter: "blur(25px)",

                WebkitBackdropFilter: "blur(25px)",

                maskImage:
                  "linear-gradient(to right, transparent 0%, black 100%)",

                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GlobalTrust() {
  const compact = useHomeCompact();
  return compact ? <MobileTrust logos={logos} /> : <DesktopGlobalTrust />;
}
