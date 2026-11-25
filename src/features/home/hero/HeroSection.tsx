"use client";
import Link from "next/link";
import { useHomeCompact } from "../HomeMobileSections";

import {
  useEffect,
  useEffectEvent,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { gsap, useGSAP } from "@/lib/gsap";

import { FiArrowRight } from "react-icons/fi";

import { useHeroScatter } from "./useHeroScatter";
import HomeMediaVideo from "../HomeMediaVideo";

type MutableRef<T> = {
  current: T;
};

type PointerPosition = {
  x: number;

  y: number;

  active: boolean;
};

type HeroSectionProps = {
  blastRef: MutableRef<boolean>;

  explosionProgressRef: MutableRef<number>;

  pointerRef: MutableRef<PointerPosition>;

  canvasShakeRef: MutableRef<HTMLDivElement | null>;
};

type AnimatedHeroLinkProps = {
  label: string;

  href: string;
};

// TEK BOYUT AYARI: Buton çizgisinin uzunluğu da, yazının sağa ilerleyeceği

// boşluk da etiketin gerçek genişliğine eklenen bu paydan türetilir.

// Sabit buton genişliği yok; iki metin de responsive olarak kendi alanını oluşturur.

const CTA_RIGHT_SPACE = "clamp(32px, 2.3vw, 44px)";

const CTA_TEXT_RIGHT_GAP = 8;

function AnimatedHeroLink({ label, href }: AnimatedHeroLinkProps) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const link = rootRef.current;

    if (!link) return;

    const text = link.querySelector<HTMLElement>("[data-cta-text]");

    const characters = Array.from(
      link.querySelectorAll<HTMLElement>("[data-hover-character]"),
    );

    const arrowRight = link.querySelector<HTMLElement>("[data-arrow-right]");

    const arrowLeft = link.querySelector<HTMLElement>("[data-arrow-left]");

    const oldLine = link.querySelector<HTMLElement>("[data-line-old]");

    const newLine = link.querySelector<HTMLElement>("[data-line-new]");

    if (
      !text ||
      !characters.length ||
      !arrowRight ||
      !arrowLeft ||
      !oldLine ||
      !newLine
    )
      return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      gsap.set(text, { x: 0 });

      gsap.set(characters, { x: 0 });

      gsap.set(arrowRight, { autoAlpha: 1 });

      gsap.set(arrowLeft, { autoAlpha: 0 });

      gsap.set(oldLine, { scaleX: 1, transformOrigin: "right center" });

      gsap.set(newLine, { scaleX: 0, transformOrigin: "left center" });

      if (reducedMotion) return;

      // Timeline: arrow disappears immediately; letters travel to the right

      // one by one and STAY there; the old underline wipes off to the right;

      // only then does the new underline grow from the left, accompanied by

      // the arrow appearing on the left.

      // Tek bir zaman çizelgesi: ok hemen kaybolur, harfler dalga halinde

      // sağ uca ilerler, eski çizgi kaybolur, yeni çizgi ve sol ok birlikte gelir.

      const LETTER_START = 0.08;

      const LETTER_DURATION = 0.56;

      const LETTER_STAGGER = 0.043;

      const LINE_ERASE_START = 0.12;

      const LINE_ERASE_DURATION = 0.98;

      const LINE_DRAW_START = 1.19;

      const LINE_DRAW_DURATION = 0.4;

      const timeline = gsap.timeline({ paused: true });

      // Metin artık absolute değil: butonun doğal genişliği doğrudan bu

      // metnin genişliği + CTA_RIGHT_SPACE kadar. Çizgiler w-full ile aynı

      // genişliği kullanıyor. Harfler kayarken layout boyutu değişmiyor.

      const shiftToRightEdge = () =>
        Math.max(
          0,

          Math.floor(link.clientWidth - text.offsetWidth - CTA_TEXT_RIGHT_GAP),
        );

      // Sabit başlangıç (x: 0) resize sonrası GSAP ölçümlerini güvenli kılar.

      // Son harften ilk harfe doğru yavaş kayma; hover boyunca sağda kalır.

      timeline.fromTo(
        characters,

        {
          x: 0,
        },

        {
          x: shiftToRightEdge,

          immediateRender: false,

          duration: LETTER_DURATION,

          ease: "power2.inOut",

          stagger: { each: LETTER_STAGGER, from: "end" },
        },

        LETTER_START,
      );

      // The right arrow exits as soon as hover begins; it does not slide.

      timeline.to(
        arrowRight,

        {
          autoAlpha: 0,

          duration: 0.1,

          ease: "none",
        },

        0,
      );

      // transformOrigin RIGHT: the line's left edge travels RIGHT until gone.

      timeline.to(
        oldLine,

        {
          scaleX: 0,

          duration: LINE_ERASE_DURATION,

          ease: "none",
        },

        LINE_ERASE_START,
      );

      // The second line starts only AFTER the original line is completely

      // gone. transformOrigin LEFT: the right edge grows towards the right.

      timeline.to(
        newLine,

        {
          scaleX: 1,

          duration: LINE_DRAW_DURATION,

          ease: "none",
        },

        LINE_DRAW_START,
      );

      // The left arrow reappears at exactly the beginning of that redraw.

      timeline.to(
        arrowLeft,

        {
          autoAlpha: 1,

          duration: 0.16,

          ease: "power1.out",
        },

        LINE_DRAW_START,
      );

      timelineRef.current = timeline;
    }, link);

    // Ekran boyutu veya font ölçüsü değiştiğinde aktif hover durumunu

    // ve harflerin yeni sağ sınırını yeniden hesapla.

    const observer = new ResizeObserver(() => {
      const timeline = timelineRef.current;

      if (!timeline) return;

      const progress = timeline.progress();

      timeline.invalidate().progress(progress);
    });

    observer.observe(link);

    return () => {
      observer.disconnect();

      timelineRef.current = null;

      context.revert();
    };
  }, []);

  const startHover = () => timelineRef.current?.play();

  const stopHover = () => timelineRef.current?.reverse();

  return (
    <a
      ref={rootRef}
      href={href}
      aria-label={label}
      data-no-blast
      onMouseEnter={startHover}
      onMouseLeave={stopHover}
      onFocus={startHover}
      onBlur={stopHover}
      className="trionn-cta relative block h-[39px] w-max max-w-full shrink-0 cursor-pointer pr-[var(--cta-right-space)] text-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      style={{ "--cta-right-space": CTA_RIGHT_SPACE } as CSSProperties}
    >
      <span
        data-cta-text
        aria-hidden="true"
        className="pointer-events-none relative block w-max whitespace-nowrap font-mono text-[clamp(13px,1.05vw,17px)] leading-[1.2] tracking-[-0.035em] text-[#f7f7f7] max-md:text-[clamp(10px,2.5vw,13px)]"
        style={{ color: "#f7f7f7" }}
      >
        {Array.from(label).map((character, index) => (
          <span
            key={`${index}-${character}`}
            data-hover-character
            className="inline-block"
            style={{ whiteSpace: "pre", marginRight: 0 }}
          >
            {character}
          </span>
        ))}
      </span>

      {/* Right arrow exits immediately; left arrow enters with the new line. */}

      <span
        data-arrow-right
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 flex h-[20px] w-[20px] items-center justify-center text-[#f7f7f7]"
      >
        <FiArrowRight
          className="h-[17px] w-[17px]"
          style={{ color: "#f7f7f7" }}
        />
      </span>

      <span
        data-arrow-left
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 flex h-[20px] w-[20px] items-center justify-center text-[#f7f7f7] opacity-0"
      >
        <FiArrowRight
          className="h-[17px] w-[17px]"
          style={{ color: "#f7f7f7" }}
        />
      </span>

      {/* Original line wipes left-to-right; replacement draws left-to-right. */}

      <span
        data-line-old
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 block h-px w-full bg-[#f7f7f7]"
        style={{ backgroundColor: "#f7f7f7" }}
      />

      <span
        data-line-new
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 block h-px w-full bg-[#f7f7f7]"
        style={{ backgroundColor: "#f7f7f7", transform: "scaleX(0)" }}
      />
    </a>
  );
}

export function HeroSection({
  blastRef,

  explosionProgressRef,

  pointerRef,

  canvasShakeRef,
}: HeroSectionProps) {
  const compact = useHomeCompact();
  const sectionRef = useRef<HTMLElement | null>(null);

  const scatterRef = useHeroScatter(
    sectionRef,
    blastRef,
    explosionProgressRef,
  );

  const shakeRef = useRef<HTMLDivElement | null>(null);

  const productHoverRef = useRef<HTMLDivElement | null>(null);

  const pressedRef = useRef(false);

  const blastTriggeredRef = useRef(false);

  const holdStartTimeRef = useRef<number | null>(null);

  const vibrationFrameRef = useRef<number | null>(null);

  const chargeRingRef = useRef<SVGCircleElement | null>(null);

  const chargeLabelRef = useRef<HTMLSpanElement | null>(null);

  const chargeProgressRef = useRef(0);

  const CHARGE_DURATION = 0.5;

  const CHARGE_RING_CIRCUMFERENCE = 2 * Math.PI * 22;

  const updateChargeDisplay = (progress: number) => {
    const value = Math.max(0, Math.min(1, progress));

    chargeProgressRef.current = value;

    if (chargeRingRef.current) {
      chargeRingRef.current.style.strokeDashoffset = String(
        CHARGE_RING_CIRCUMFERENCE * (1 - value),
      );
    }

    if (chargeLabelRef.current) {
      chargeLabelRef.current.textContent =
        value >= 1
          ? "READY"
          : value > 0
            ? `${Math.round(value * 100)}%`
            : "HOLD";
    }
  };

  const VIBRATION_X = 2.4;

  const VIBRATION_Y = 1.5;

  const VIBRATION_SPEED = 78;

  // Loop the reference word sequence: engineering -> experience -> innovation -> precision.

  // The words are pre-rendered, avoiding React rerenders and timer races.

  useGSAP(
    () => {
      if (compact) return;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const staticChars = gsap.utils.toArray<HTMLElement>(
        ".trionn-static-char",
      );

      const links = gsap.utils.toArray<HTMLElement>(".trionn-cta");

      const info = gsap.utils.toArray<HTMLElement>(".hero-info");

      const wordEls = ["engineering", "experience", "innovation", "precision"]

        .map((name) =>
          sectionRef.current?.querySelector<HTMLElement>(
            `[data-trionn-word="${name}"]`,
          ),
        )

        .filter((word): word is HTMLElement => Boolean(word));

      if (wordEls.length !== 4) return;

      const letters = wordEls.map((word) =>
        word
          ? Array.from(word.querySelectorAll<HTMLElement>(".trionn-word-char"))
          : [],
      );

      gsap.set(wordEls.filter(Boolean), { autoAlpha: 0 });

      gsap.set(letters.flat(), { autoAlpha: 0, filter: "none", y: 5 });

      if (reducedMotion) {
        gsap.set(staticChars, { autoAlpha: 1, y: 0, filter: "none" });

        gsap.set([...links, ...info], { autoAlpha: 1, y: 0 });

        gsap.set(wordEls[0], { autoAlpha: 1 });

        gsap.set(letters[0], { autoAlpha: 1, y: 0, filter: "none" });

        return;
      }

      const tl = gsap.timeline({ delay: 0.04 });

      tl.fromTo(
        staticChars,

        { autoAlpha: 1, y: 4 },

        {
          autoAlpha: 1,

          y: 0,

          duration: 0.25,

          stagger: 0.003,

          ease: "power2.out",
        },

        0,
      );

      // Butonun kök elementine transform uygulanmıyor. Başlığın sürekli

      // blur animasyonu sırasında compositing/rasterizasyon değişmesini

      // azaltmak için girişte sadece opacity kullanıyoruz.

      tl.fromTo(
        links,

        { opacity: 0 },

        {
          opacity: 1,

          duration: 0.4,

          stagger: 0.12,

          ease: "power2.out",

          clearProps: "opacity,transform,filter,willChange",
        },

        0.2,
      );

      tl.fromTo(
        info,

        { autoAlpha: 0, y: 14 },

        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },

        0.2,
      );

      // In the supplied reference, letters resolve in a scattered order,

      // NOT from left to right. Explicit permutations keep it repeatable.

      // Keep the one-time heading/link entrance separate from the looping words.

      const wordTl = gsap.timeline({
        delay: 0.04,

        repeat: -1,

        repeatDelay: 0.45,
      });

      const revealOrders = [
        [2, 8, 0, 6, 3, 10, 1, 9, 4, 7, 5], // engineering
        [2, 0, 5, 8, 1, 9, 3, 7, 4, 6], // experience
        [1, 7, 0, 5, 3, 9, 2, 8, 4, 6], // innovation
        [3, 0, 6, 2, 8, 1, 5, 7, 4], // precision
      ];

      const hideOrders = [
        [4, 9, 1, 7, 0, 10, 3, 8, 5, 2, 6],
        [5, 1, 8, 3, 9, 0, 6, 2, 7, 4],
        [3, 8, 0, 6, 1, 9, 4, 7, 2, 5],
        [2, 7, 0, 5, 8, 1, 6, 3, 4],
      ];

      const reveal = (index: number, at: number) => {
        wordTl.set(wordEls[index], { autoAlpha: 1 }, at);

        revealOrders[index].forEach((charIndex, order) => {
          wordTl.fromTo(
            letters[index][charIndex],

            {
              autoAlpha: 0,

              x: order % 2 ? 12 : -10,

              y: order % 3 === 0 ? -3 : 5,


            },

            {
              autoAlpha: 1,

              x: 0,

              y: 0,



              duration: 0.45,

              ease: "power2.out",
            },

            at + order * 0.045,
          );
        });
      };

      const hide = (index: number, at: number) => {
        hideOrders[index].forEach((charIndex, order) => {
          wordTl.to(
            letters[index][charIndex],

            {
              autoAlpha: 0,

              x: order % 2 ? -9 : 11,

              y: -3,



              duration: 0.35,

              ease: "power2.in",
            },

            at + order * 0.045,
          );
        });

        wordTl.set(wordEls[index], { autoAlpha: 0 }, at + 0.75);
      };

      wordTl.set(wordEls[0], { autoAlpha: 1 }, 0);
      wordTl.set(letters[0], { autoAlpha: 1, x: 0, y: 0, filter: "none" }, 0);
      hide(0, 3.05);
      reveal(1, 4.1);
      hide(1, 6.3);
      reveal(2, 7.06);
      hide(2, 10.2);
      reveal(3, 10.96);
      hide(3, 14.1);
      wordTl.addLabel("cycleEnd", 15.0);

      const section = sectionRef.current;
      if (!section) return;
      let visible = true;
      const syncVisibility = () => wordTl.paused(!visible || document.hidden);
      const observer = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        syncVisibility();
      });
      observer.observe(section);
      document.addEventListener("visibilitychange", syncVisibility);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncVisibility);
      };
    },

    { scope: sectionRef, dependencies: [compact], revertOnUpdate: true },
  );

  const handleMouseMove = (event: ReactMouseEvent<HTMLElement>) => {
    pointerRef.current.x = Math.max(-0.5, Math.min(0.5, event.clientX / window.innerWidth - 0.5));
    pointerRef.current.y = Math.max(-0.5, Math.min(0.5, event.clientY / window.innerHeight - 0.5));
    pointerRef.current.active = true;
  };

  const handleMouseLeave = () => {
    pointerRef.current.x = 0;

    pointerRef.current.y = 0;

    pointerRef.current.active = false;
  };

  /* UI ve Canvas aynı anda titreşsin. */

  const applyShakeTransition = (value: string) => {
    const targets = [shakeRef.current, canvasShakeRef.current];

    targets.forEach((target) => {
      if (!target) {
        return;
      }

      target.style.transition = value;
    });
  };

  const applyShakeTransform = (value: string) => {
    const targets = [shakeRef.current, canvasShakeRef.current];

    targets.forEach((target) => {
      if (!target) {
        return;
      }

      target.style.transform = value;
    });
  };

  const stopVibration = () => {
    if (vibrationFrameRef.current !== null) {
      cancelAnimationFrame(vibrationFrameRef.current);

      vibrationFrameRef.current = null;
    }

    applyShakeTransition("transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)");

    applyShakeTransform("translate3d(0px, 0px, 0px)");
  };

  const startCharge = () => {
    if (!shakeRef.current) {
      return;
    }

    if (vibrationFrameRef.current !== null) {
      cancelAnimationFrame(vibrationFrameRef.current);
    }

    holdStartTimeRef.current = performance.now();

    updateChargeDisplay(0);

    blastTriggeredRef.current = false;

    applyShakeTransition("none");

    const tick = (now: number) => {
      if (!pressedRef.current) {
        return;
      }

      const start = holdStartTimeRef.current;

      if (start === null) {
        return;
      }

      const elapsed = (now - start) / 1000;

      updateChargeDisplay(elapsed / CHARGE_DURATION);

      if (elapsed < CHARGE_DURATION) {
        const phase = elapsed * VIBRATION_SPEED;

        const sx =
          Math.sin(phase) * VIBRATION_X + Math.sin(phase * 1.73) * 0.55;

        const sy = Math.cos(phase * 1.31) * VIBRATION_Y;

        applyShakeTransform(`translate3d(${sx}px, ${sy}px, 0px)`);

        vibrationFrameRef.current = requestAnimationFrame(tick);

        return;
      }

      if (!blastTriggeredRef.current) {
        blastTriggeredRef.current = true;

        blastRef.current = true;

        scatterRef.current?.scatter();
      }

      applyShakeTransition("transform 0.18s ease-out");

      applyShakeTransform("translate3d(0px, 0px, 0px)");

      vibrationFrameRef.current = null;
    };

    vibrationFrameRef.current = requestAnimationFrame(tick);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("a, button, input, textarea, select, [data-no-blast]")) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (pressedRef.current) {
      return;
    }

    event.preventDefault();

    pressedRef.current = true;

    blastRef.current = false;

    startCharge();

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture desteklenmiyorsa devam et.
    }
  };

  const releaseBlast = () => {
    pressedRef.current = false;

    blastRef.current = false;

    blastTriggeredRef.current = false;

    holdStartTimeRef.current = null;

    updateChargeDisplay(0);

    scatterRef.current?.restore();

    stopVibration();
  };

  const stopBlast = useEffectEvent(releaseBlast);

  useEffect(() => {
    const stop = () => stopBlast();

    window.addEventListener("pointerup", stop);

    window.addEventListener("pointercancel", stop);

    window.addEventListener("blur", stop);

    return () => {
      window.removeEventListener("pointerup", stop);

      window.removeEventListener("pointercancel", stop);

      window.removeEventListener("blur", stop);

      if (vibrationFrameRef.current !== null) {
        cancelAnimationFrame(vibrationFrameRef.current);
      }
    };
  }, []);

  return (
    <section
      data-home-hero
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={releaseBlast}
      onPointerCancel={releaseBlast}
      className="

        relative

        w-full

        min-h-[100svh]

        cursor-pointer

        overflow-hidden

        bg-[#082637]

        md:aspect-auto

        md:min-h-[100svh]

      "
    >
      {/* Hero'ya özel arka plan videosu */}

      <HomeMediaVideo
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_30%]"
      >
        <source src="/home/hero/hero-vid.mp4" type="video/mp4" />
      </HomeMediaVideo>

      {/* The last part of the Hero blends toward the shared seam color. */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(120px,17svh,220px)] bg-gradient-to-b from-transparent via-[#082637]/35 to-[#082637]"
      />

      <div
        ref={shakeRef}
        data-home-hero-content
        className="

          relative

          z-10

          min-h-[100svh]

          md:absolute

          md:inset-0

          md:min-h-0

        "
      >
        {/* =============================================== */}

        {/* PRODUCT HOVER AREA */}

        {/* =============================================== */}

        <div
          ref={productHoverRef}
          aria-hidden="true"
          className="

            pointer-events-none

            absolute

            left-[46%]

            top-[43%]

            z-10

            h-[48vh]

            w-[76vw]

            -translate-x-1/2

            -translate-y-1/2

            md:left-[56%]

            md:top-[40.5%]

            md:h-[62vh]

            md:w-[39vw]

          "
        />

        {/* =============================================== */}

        {/* VIEWPORT UI */}

        {/* =============================================== */}

        <div data-home-hero-ui
          className="

            pointer-events-none

            absolute

            left-0

            top-0

            z-20

            h-[100svh]

            w-full

            overflow-visible

          "
        >
          {/* ============================================= */}

          {/* TITLE */}

          {/* ============================================= */}

          {/* Trionn-inspired hero heading and animated inline links. */}

          <div data-home-mobile-title className="pointer-events-auto absolute left-[7%] top-[140px] z-30 hidden w-[86%] text-center">
            <h1 className="text-[clamp(29px,7.8vw,48px)] leading-[1.02] tracking-[-.05em] text-[#f7f7f7]">Technologies that<br/>keep life going</h1>
            <Link href="/pump-series" className="mx-auto mt-6 inline-flex items-center gap-5 rounded-full border border-[#9eb7d0] bg-[#f7f7f7] py-2 pl-5 pr-2 text-[17px] text-[#27272a]">Product Catalog<span aria-hidden="true" className="size-9 rounded-full bg-linear-to-b from-[#005eff] to-[#001ea2] shadow-[0_0_16px_#005eff66]" /></Link>
          </div>
          <div data-home-desktop-title className="pointer-events-none absolute left-[4.25%] top-[19%] z-30 w-[min(54vw,1040px)] max-lg:left-[5%] max-lg:top-[20%] max-lg:w-[64vw] max-md:left-[7%] max-md:top-[21%] max-md:w-[86vw]">
            <h1
              data-hero-scatter="heading"
              aria-label="It all starts with engineering, experience, innovation, precision."
              className="m-0 font-normal text-[clamp(52px,5.15vw,104px)] leading-[0.97] tracking-[-0.065em] text-[#D1D1D1] max-md:text-[clamp(43px,9.1vw,73px)]"
              style={{ fontFamily: "var(--font-sf-pro), Arial, sans-serif" }}
            >
              <span aria-hidden="true" className="block whitespace-nowrap">
                {Array.from("It all starts with").map((char, index) => (
                  <span
                    key={index}
                    className="trionn-static-char inline-block"
                    style={{ whiteSpace: "pre" }}
                  >
                    {char === " " ? "\u00a0" : char}
                  </span>
                ))}
              </span>

              <span aria-hidden="true" className="block whitespace-nowrap">
                <span className="relative inline-grid align-baseline">
                  {(
                    [
                      "engineering",
                      "experience",
                      "innovation",
                      "precision",
                    ] as const
                  ).map((word) => (
                    <span
                      key={word}
                      data-trionn-word={word}
                      className="col-start-1 row-start-1 inline-block whitespace-nowrap"
                      style={{ visibility: word === "engineering" ? "visible" : "hidden" }}
                    >
                      {Array.from(word).map((char, index) => (
                        <span
                          key={`${word}-${index}`}
                          className="trionn-word-char inline-block"
                          style={{ whiteSpace: "pre" }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <nav
              data-hero-scatter="links"
              aria-label="Hero links"
              className="pointer-events-auto relative z-10 isolate mt-[clamp(29px,2.9vw,52px)] flex flex-wrap items-center gap-x-[44px] gap-y-5 max-md:gap-x-4"
            >
              {(
                [
                  { label: "EXPLORE THE PRODUCTS", href: "/products" },

                  { label: "CONTACT YOUR SUPERVISOR", href: "/contact" },
                ] as const
              ).map((link) => (
                <AnimatedHeroLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                />
              ))}
            </nav>
          </div>

          {/* Hold-to-blast interaction cue. The ring uses the same 0.5s*

*              charge window that triggers the actual pump explosion. */}

          <div
            data-hero-scatter="cue"
            className="pointer-events-auto absolute bottom-[7.4%] left-[4.25%] z-30 flex max-w-[420px] select-none items-center gap-[15px] text-[#f7f7f7] max-lg:left-[5%] max-md:bottom-[23%] max-md:left-[7%] max-md:gap-3"
            aria-label="Press and hold for half a second to disassemble the pump"
          >
            <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center max-md:h-[50px] max-md:w-[50px]">
              <svg
                viewBox="0 0 56 56"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="rgba(247,247,247,0.22)"
                  strokeWidth="1.5"
                />

                <circle
                  ref={chargeRingRef}
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="#f7f7f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={CHARGE_RING_CIRCUMFERENCE}
                  strokeDashoffset={CHARGE_RING_CIRCUMFERENCE}
                  transform="rotate(-90 28 28)"
                />
              </svg>

              <span
                ref={chargeLabelRef}
                className="relative text-[9px] font-medium tracking-[0.06em] tabular-nums max-md:text-[8px]"
                style={{ fontFamily: "var(--font-sf-pro), Arial, sans-serif" }}
              >
                HOLD
              </span>
            </div>

            <div
              className="flex min-w-0 flex-col gap-[5px]"
              style={{ fontFamily: "var(--font-sf-pro), Arial, sans-serif" }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7f7f7] max-md:text-[10px]">
                HOLD TO BLAST
              </span>

              <span className="text-[clamp(12px,0.88vw,15px)] font-normal leading-[1.3] tracking-[-0.01em] text-[#f7f7f7]/80">
                Break it apart. Discover what drives it.
              </span>
            </div>
          </div>

          <div
            className="

              hero-info

              pointer-events-none

              absolute

              bottom-[7.4%]

              right-[8.2%]

              h-[79px]

              w-[537px]

              max-xl:right-[5%]

              max-lg:right-[4%]

              max-md:hidden

            "
          >
            {/* RIGHT BOX */}

            <div
              data-hero-scatter="info-label"
              className="

                absolute

                left-[277px]

                top-0

                z-10

                h-[79px]

                w-[260px]

                rounded-r-[15px]

                border

                border-[#9EB7D0]

                bg-transparent

              "
            >
              <div
                className="

                  flex

                  h-full

                  w-full

                  items-center

                  pl-[75px]

                  pr-[18px]

                "
              >
                <p
                  className="

                    text-[15px]

                    leading-[1.1]

                    tracking-[-0.04em]

                    uppercase

                    text-[#6DB7E0]

                  "
                  style={{
                    fontFamily: "var(--font-sf-pro)",

                    fontWeight: 410,

                    fontVariationSettings: '"wght" 410, "wdth" 125',

                    textShadow: "0 0 20px #6DB7E0",
                  }}
                >
                  Centrifugal
                  <br />
                  Pump
                  <br />
                  Manufacturing
                </p>
              </div>
            </div>

            {/* LEFT BOX */}

            <div
              data-hero-scatter="info-copy"
              className="

                absolute

                left-0

                top-0

                z-20

                flex

                h-[79px]

                w-[312px]

                items-center

                rounded-[15px]

                border

                border-white/35

                bg-[linear-gradient(135deg,rgba(255,255,255,0.24)\_0%,rgba(255,255,255,0.10)\_48%,rgba(155,200,225,0.07)\_100%)]

                backdrop-blur-[22px]

                backdrop-saturate-[160%]

                shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_10px_32px_rgba(0,15,32,0.14)]

                px-[20px]

              "
            >
              <p
                className="

                  w-full

                  text-[12px]

                  leading-[1.12]

                  tracking-[-0.04em]

                  text-[#9EB7D0]

                "
                style={{
                  fontFamily: "var(--font-sf-pro)",

                  fontWeight: 540,

                  fontVariationSettings: '"wght" 540, "wdth" 125',

                  fontOpticalSizing: "auto",
                }}
              >
                A city&apos;s drinking water, a factory&apos;s
                <br />
                cooling system, the irrigation of a field.
                <br />
                We&apos;ve been working wherever there&apos;s
                <br />a fluid since 1972.
              </p>
            </div>
          </div>

          {/* ============================================= */}

          {/* MOBILE INFO */}

          {/* ============================================= */}

          <div
            className="

              hero-info

              pointer-events-none

              absolute

              bottom-[5%]

              left-[7vw]

              right-[7vw]

              hidden

              max-md:block

            "
          >
            <div
              data-hero-scatter="info-mobile"
              className="

                overflow-hidden

                rounded-[15px]

                border

                border-white/35

                bg-[linear-gradient(135deg,rgba(255,255,255,0.24)\_0%,rgba(255,255,255,0.10)\_48%,rgba(155,200,225,0.07)\_100%)]

                backdrop-blur-[22px]

                backdrop-saturate-[160%]

                shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_10px_32px_rgba(0,15,32,0.14)]

              "
            >
              <div
                className="

                  px-[17px]

                  py-[14px]

                "
              >
                <p
                  className="

                    text-[12px]

                    leading-[1.12]

                    tracking-[-0.04em]

                    text-[#9EB7D0]

                  "
                  style={{
                    fontFamily: "var(--font-sf-pro)",

                    fontWeight: 540,

                    fontVariationSettings: '"wght" 540, "wdth" 125',

                    fontOpticalSizing: "auto",
                  }}
                >
                  A city&apos;s drinking water, a factory&apos;s cooling system, the
                  irrigation of a field. We&apos;ve been working wherever there&apos;s a
                  fluid since 1972.
                </p>
              </div>

              <div
                className="

                  border-t

                  border-[#9EB7D0]

                  px-[17px]

                  py-[13px]

                "
              >
                <p
                  className="

                    text-[15px]

                    leading-[1.1]

                    tracking-[-0.04em]

                    uppercase

                    text-[#6DB7E0]

                  "
                  style={{
                    fontFamily: "var(--font-sf-pro)",

                    fontWeight: 410,

                    fontVariationSettings: '"wght" 410, "wdth" 125',

                    textShadow: "0 0 20px #6DB7E0",
                  }}
                >
                  Centrifugal Pump Manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
