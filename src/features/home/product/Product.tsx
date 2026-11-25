"use client";

import Link from "next/link";

import Image from "next/image";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { FiArrowUpRight } from "react-icons/fi";

import { gsap, useGSAP } from "@/lib/gsap";

import HomeElasticGallery from "./HomeElasticGallery";

import { HOME_PUMPS } from "./homePumpCatalog";

const PUMP_MODEL_SELECT_EVENT = "sempa:pump-model-select";
const PRODUCT_MODEL_REQUEST_EVENT = "sempa:product-model-request";
const HERO_RETURN_EVENT = "sempa:hero-return-default";

const PRODUCT_UPWARD_BLAST_EVENT = "sempa:product-upward-blast";

const PUMP_ROTATE_START_EVENT = "sempa:pump-rotate-start";

const PUMP_ROTATE_DELTA_EVENT = "sempa:pump-rotate-delta";

const PUMP_ROTATE_END_EVENT = "sempa:pump-rotate-end";

const ACTIVE_PRODUCTS = HOME_PUMPS;

const LOOP_PRODUCTS = Array.from(
  { length: ACTIVE_PRODUCTS.length * 5 },
  (_, index) => ({
    ...ACTIVE_PRODUCTS[index % ACTIVE_PRODUCTS.length],
    loopKey: `p-${index}`,
  }),
);

const PRODUCT_STAGE_Y = -96;

export default function Product({ selectionReadyRef }: { selectionReadyRef: { current: boolean } }) {
  const sectionRef = useRef<HTMLElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);

  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const categoriesButtonRef = useRef<HTMLAnchorElement>(null);

  const controlBarRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeProduct = ACTIVE_PRODUCTS[activeIndex];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const stripTrackRef = useRef<HTMLDivElement>(null);

  const [galleryPosition, setGalleryPosition] = useState(0);
  const [blurStartIndex, setBlurStartIndex] = useState(16);

  const stripPositionRef = useRef<number>(ACTIVE_PRODUCTS.length);

  const stripStepRef = useRef(1);

  const stripDragRef = useRef({
    active: false,
    startX: 0,
    startPosition: 0,
    moved: false,
  });

  const wakeStripRef = useRef<() => void>(() => {});
  const leavingProductsRef = useRef(false);

  const setStripPosition = useCallback((value: number, syncControl = true) => {
    if (!selectionReadyRef.current) return;
    const position = Math.max(0, Math.min(ACTIVE_PRODUCTS.length - 1, value));

    stripPositionRef.current = ACTIVE_PRODUCTS.length + position;

    const index = Math.round(position);

    if (activeIndexRef.current !== index) {
      activeIndexRef.current = index;

      setActiveIndex(index);

      window.dispatchEvent(
        new CustomEvent(PUMP_MODEL_SELECT_EVENT, {
          detail: { modelUrl: ACTIVE_PRODUCTS[index].modelUrl },
        }),
      );
    }

    if (syncControl) setGalleryPosition(position);

    wakeStripRef.current();
  }, [selectionReadyRef]);

  useEffect(() => {
    const row = stripTrackRef.current;

    if (!row) return;

    let frame = 0;

    let position: number = ACTIVE_PRODUCTS.length;

    let cardStep = 1;

    let lastBlurSlot = -1;

    const render = () => {
      position = stripPositionRef.current;

      row.style.transform = `translate3d(${-position * cardStep}px,0,0)`;

      const blurSlot = Math.floor(position);

      if (blurSlot === lastBlurSlot) return;

      lastBlurSlot = blurSlot;
      const viewportWidth = row.parentElement?.clientWidth ?? innerWidth;
      const visibleCards = Math.ceil(viewportWidth / cardStep);
      // Keep a usable first card even on screens displaying fewer than six.
      const blurStart = blurSlot + Math.max(1, visibleCards - 5);
      setBlurStartIndex(blurStart);

      Array.from(row.children).forEach((item, index) => {
        const image = item.firstElementChild
          ?.firstElementChild as HTMLElement | null;

        if (!image) return;

        const blur = Math.max(
          0,
          Math.min(
            15,
            (index - blurStart + 1) * 3,
          ),
        );

        const filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";

        if (image.style.filter !== filter) image.style.filter = filter;

        const opacity = String(1 - blur * 0.015);

        if (image.style.opacity !== opacity) image.style.opacity = opacity;
      });
    };

    const measure = () => {
      const card = row.firstElementChild;

      if (!card) return;

      cardStep = card.getBoundingClientRect().width + 12;

      stripStepRef.current = cardStep;
      lastBlurSlot = -1;

      render();
    };

    const paint = () => {
      position = stripPositionRef.current;

      // Identical repeated cycles make wrapping seamless in either direction.

      stripPositionRef.current = position;

      render();

      frame = 0;
    };

    wakeStripRef.current = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const stop = () => {
      stripDragRef.current.active = false;
    };

    const visibility = () => {
      if (document.hidden) stop();
    };

    const observer = new ResizeObserver(measure);

    observer.observe(row);

    const intersection = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) stop();
    });

    if (sectionRef.current) intersection.observe(sectionRef.current);

    measure();

    window.addEventListener("blur", stop);

    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelAnimationFrame(frame);

      observer.disconnect();

      intersection.disconnect();

      window.removeEventListener("blur", stop);

      document.removeEventListener("visibilitychange", visibility);

      wakeStripRef.current = () => {};
    };
  }, []);

  const activeIndexRef = useRef(0);

  // Each hero/products journey starts with the hero pump, never an old selection.
  useEffect(() => {
    const restoreSelectedProduct = () => {
      leavingProductsRef.current = false;
    };
    const resetSelection = () => {
      activeIndexRef.current = 0;
      setActiveIndex(0);
      setGalleryPosition(0);
      setHoveredIndex(null);
      setExpandedIndex(null);
      stripPositionRef.current = ACTIVE_PRODUCTS.length;
      wakeStripRef.current();
      const modelUrl = ACTIVE_PRODUCTS[0].modelUrl;
      window.dispatchEvent(
        new CustomEvent(PUMP_MODEL_SELECT_EVENT, { detail: { modelUrl } }),
      );
    };
    const leaveProducts = () => {
      leavingProductsRef.current = true;
      stripDragRef.current.active = false;
      resetSelection();
    };
    window.addEventListener(HERO_RETURN_EVENT, leaveProducts);
    window.addEventListener(
      PRODUCT_MODEL_REQUEST_EVENT,
      restoreSelectedProduct,
    );
    return () => {
      window.removeEventListener(HERO_RETURN_EVENT, leaveProducts);
      window.removeEventListener(
        PRODUCT_MODEL_REQUEST_EVENT,
        restoreSelectedProduct,
      );
    };
  }, []);

  const modelRotateRef = useRef({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
  });

  const jumpToProduct = (index: number) => {
    if (!selectionReadyRef.current) return;
    if (index < 0 || index >= ACTIVE_PRODUCTS.length) return;

    if (activeIndexRef.current === index) return;

    activeIndexRef.current = index;

    setActiveIndex(index);
    setGalleryPosition(index);

    window.dispatchEvent(
      new CustomEvent(PUMP_MODEL_SELECT_EVENT, {
        detail: { modelUrl: ACTIVE_PRODUCTS[index].modelUrl },
      }),
    );
  };

  const handleModelRotatePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    // Mouse'ta sadece sol tık ile 3D pompayı döndür.

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();

    event.stopPropagation();

    modelRotateRef.current.active = true;

    modelRotateRef.current.pointerId = event.pointerId;

    modelRotateRef.current.lastX = event.clientX;

    modelRotateRef.current.lastY = event.clientY;

    window.dispatchEvent(new CustomEvent(PUMP_ROTATE_START_EVENT));

    try {
      // Pointer alanın dışına çıksa bile sol tık bırakılana kadar

      // 360° dönüş kesilmeden devam eder.

      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture desteklenmiyorsa mevcut event akışıyla devam eder.
    }
  };

  const handleModelRotatePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!modelRotateRef.current.active) {
      return;
    }

    event.preventDefault();

    event.stopPropagation();

    const deltaX = event.clientX - modelRotateRef.current.lastX;

    const deltaY = event.clientY - modelRotateRef.current.lastY;

    modelRotateRef.current.lastX = event.clientX;

    modelRotateRef.current.lastY = event.clientY;

    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    // X ve Y delta'ları clamp'lenmiyor.

    // Kullanıcı pompayı hem sağa/sola hem yukarı/aşağı sınırsız

    // çevirebilir; diagonal sürükleme iki ekseni aynı anda döndürür.

    window.dispatchEvent(
      new CustomEvent(PUMP_ROTATE_DELTA_EVENT, {
        detail: { deltaX, deltaY },
      }),
    );
  };

  const finishModelRotate = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!modelRotateRef.current.active) {
      return;
    }

    event.preventDefault();

    event.stopPropagation();

    modelRotateRef.current.active = false;

    modelRotateRef.current.pointerId = -1;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    window.dispatchEvent(new CustomEvent(PUMP_ROTATE_END_EVENT));
  };

  useGSAP(
    () => {
      const section = sectionRef.current;

      const card = cardRef.current;

      const title = titleRef.current;

      const description = descriptionRef.current;

      const categoriesButton = categoriesButtonRef.current;

      const controlBar = controlBarRef.current;

      if (
        !section ||
        !card ||
        !title ||
        !description ||
        !categoriesButton ||
        !controlBar
      ) {
        return;
      }

      // Scroll tabanlı seçim: yatay slider başlangıç hareketi yok.

      gsap.set(card, {
        left: "61.5%",

        top: "24.5%",

        scale: 1,
        x: () => Math.max(360, window.innerWidth * 0.48),

        autoAlpha: 0,

        rotate: 0,

        filter: "none",

        transformOrigin: "50% 50%",
      });

      gsap.set(title, {
        autoAlpha: 0,

        y: 32,

        scale: 0.985,

        filter: "blur(8px)",
      });

      gsap.set(description, {
        autoAlpha: 0,

        y: 24,

        filter: "blur(6px)",
      });

      gsap.set(categoriesButton, {
        autoAlpha: 0,

        x: 26,

        y: -18,

        scale: 0.965,

        filter: "blur(10px)",

        transformOrigin: "100% 50%",
      });

      gsap.set(controlBar, {
        autoAlpha: 0,

        y: 22,

        scale: 0.97,

        filter: "blur(6px)",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top 28%",

          end: "top 0%",

          scrub: true,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            // Model, End Suction kartinin geri cekilmesiyle birebir ayni

            // ScrollTrigger ilerlemesini kullanir. Solutions tarafinda asla tetiklenmez.

            const progress = self.progress;

            const leavingToHero =
              self.direction === -1 && progress > 0 && progress < 1;

            // Geri giderken parcalanma tek yonlu artar. Hero scroll

            // animasyonu devralana kadar tekrar toplanmaz.

            const returnProgress = 1 - progress;
            const smoothReturn =
              returnProgress * returnProgress * (3 - 2 * returnProgress);
            const explosion = leavingToHero ? smoothReturn : 0;

            window.dispatchEvent(
              new CustomEvent(PRODUCT_UPWARD_BLAST_EVENT, {
                detail: { progress: explosion },
              }),
            );
          },

          onLeave: () =>
            window.dispatchEvent(
              new CustomEvent(PRODUCT_UPWARD_BLAST_EVENT, {
                detail: { progress: 0 },
              }),
            ),

          onLeaveBack: () =>
            window.dispatchEvent(
              new CustomEvent(PRODUCT_UPWARD_BLAST_EVENT, {
                detail: { progress: 0 },
              }),
            ),
        },
      });

      timeline.to(card, { x: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.2);



      timeline.to(
        categoriesButton,

        {
          autoAlpha: 1,

          x: 0,

          y: 0,

          scale: 1,

          filter: "blur(0px)",

          duration: 0.28,

          ease: "power3.out",
        },

        0.5,
      );

      timeline.to(
        title,

        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          filter: "blur(0px)",

          duration: 0.22,

          ease: "power2.out",
        },

        0.58,
      );

      timeline.to(
        description,

        {
          autoAlpha: 1,

          y: 0,

          filter: "blur(0px)",

          duration: 0.18,

          ease: "power2.out",
        },

        0.64,
      );


      timeline.to(
        controlBar,

        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          filter: "blur(0px)",

          duration: 0.22,

          ease: "power3.out",
        },

        0.69,
      );


      timeline.to(
        {},

        {
          duration: 0.09,
        },

        0.91,
      );

      return () => {
        window.dispatchEvent(
          new CustomEvent(PRODUCT_UPWARD_BLAST_EVENT, {
            detail: { progress: 0 },
          }),
        );

        timeline.scrollTrigger?.kill();

        timeline.kill();
      };
    },

    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="products"
      data-home-products
      aria-label="Sempa Products"
      className="

        relative

        h-[100svh]

        w-full

        overflow-x-clip

        bg-[#082637]

      "
    >
      <div
        data-home-product-viewport
        className="relative h-[100svh] w-full overflow-hidden"
      >
        {/* Product section background video, independent from Hero */}

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.35) 80px, black clamp(180px, 21svh, 260px))",

            maskImage:
              "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.35) 80px, black clamp(180px, 21svh, 260px))",
          }}
        >
          <source src="/home/products/product-vid.mp4" type="video/mp4" />
        </video>

        <div
          data-home-product-stage
          className="absolute inset-0"
          style={{
            transform: `translateY(${PRODUCT_STAGE_Y}px)`,
          }}
        >
          {/* VIEW ALL CATEGORIES */}

          <Link
            ref={categoriesButtonRef}
            data-home-categories
            href="/pump-series"
            aria-label="View All Categories"
            className="

            group

            absolute

            left-[1460px]

            top-[115px]

            z-50

            flex

            h-[57px]

            w-[300px]

            items-center

            overflow-hidden

            rounded-full

            border

            border-white/40

            bg-[linear-gradient(128deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.11)_42%,rgba(255,255,255,0.06)_100%)]

            backdrop-blur-[34px]

            backdrop-saturate-[180%]

            shadow-[0_10px_36px_rgba(0,16,38,0.20),inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(255,255,255,0.12)]

            transition-[background-color,border-color,box-shadow]

            duration-[450ms]

            ease-[cubic-bezier(0.22,1,0.36,1)]

            hover:border-white/90

            hover:bg-white/95

            hover:shadow-[0_14px_40px_rgba(0,20,40,0.25),inset_0_1px_0_rgba(255,255,255,0.8)]

            will-change-[transform,opacity,filter]

          "
          >
            <span
              className="

              relative

              z-10

              ml-[18px]

              whitespace-nowrap

              text-[20px]

              leading-[1.07]

              tracking-[-0.04em]

              text-[#F7F7F7]

              transition-[transform,color]

              duration-[650ms]

              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover:translate-x-[49px]

              group-hover:text-[#071A29]

            "
              style={{
                fontFamily: "var(--font-sf-pro)",

                fontWeight: 410,

                fontVariationSettings: '"wght" 410, "wdth" 125, "opsz" 20',
              }}
            >
              View All Categories
            </span>

            <span
              className="

              absolute

              left-[calc(100%_-_49px)]

              top-1/2

              z-20

              flex

              h-[41px]

              w-[41px]

              -translate-y-1/2

              items-center

              justify-center

              rounded-full

              bg-[linear-gradient(135deg,#005EFF_0%,#001EA2_100%)]

              shadow-[0_0_18px_rgba(0,94,255,0.45)]

              transition-[left]

              duration-[650ms]

              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover:left-[8px]

            "
            >
              <FiArrowUpRight
                size={28}
                strokeWidth={3.2}
                className="

                scale-[0.78]

                text-white

                opacity-0

                transition-[opacity,transform]

                duration-[350ms]

                ease-out

                group-hover:scale-100

                group-hover:opacity-100

              "
              />
            </span>
          </Link>

          {/* LEFT TITLE */}

          <h2
            ref={titleRef}
            data-home-product-title
            className="

            absolute

            left-[160px]

            top-[411px]

            z-30

            h-[201px]

            w-[462px]

            text-[67px]

            leading-[1]

            tracking-[-0.04em]

            text-[#F7F7F7]

            will-change-[transform,opacity,filter]

          "
            style={{
              fontFamily: "var(--font-sf-pro)",

              fontWeight: 410,

              fontVariationSettings: '"wght" 410, "wdth" 125, "opsz" 67',
            }}
          >
            Advanced <br />
            Pumping <br />
            Technologies
          </h2>

          {/* LEFT DESCRIPTION */}

          <p
            ref={descriptionRef}
            data-home-product-description
            className="

            absolute

            left-[160px]

            top-[645px]

            z-30

            w-[377px]

            text-[16px]

            leading-[1.07]

            tracking-[-0.10em]

            text-[#F7F7F7]

            will-change-[transform,opacity,filter]

          "
            style={{
              fontFamily: "var(--font-sf-pro)",

              fontWeight: 270,

              fontVariationSettings: '"wght" 270, "wdth" 125, "opsz" 16',
            }}
          >
            Browse our advanced pump categories, <br />
            engineered for ultimate reliability, energy <br />
            efficiency, and seamless industrial integration.
          </p>

          {/* FLYING CARD */}

          <div
            ref={cardRef}
            data-home-product-card
            className="

            pointer-events-none

            absolute

            z-40

            h-[431px]

            w-[392px]

            will-change-[transform,left,top,opacity,filter]

          "
          >
            <div
              className="

              relative

              h-full

              w-full

              overflow-hidden

              rounded-[53px]

              backdrop-blur-[24px]

              backdrop-saturate-[115%]

            "
              style={{
                background:
                  "linear-gradient(145deg, rgba(78,157,199,0.22) 0%, rgba(26,92,132,0.18) 42%, rgba(5,42,68,0.30) 100%)",

                border: "2px solid rgba(148,218,255,0.92)",

                boxShadow:
                  "0 0 13px rgba(29,138,220,0.22), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 20px rgba(146,220,255,0.05)",
              }}
            >
              <div
                aria-hidden="true"
                className="

                pointer-events-none

                absolute

                inset-0

                rounded-[53px]

              "
                style={{
                  background:
                    "linear-gradient(180deg, rgba(158,224,255,0.08) 0%, rgba(158,224,255,0.025) 28%, rgba(0,0,0,0) 55%)",
                }}
              />

              <p
                className="

                absolute

                left-[40px]

                top-[115px]

                w-[270px]

                z-10

                text-[33px]

                leading-[1]

                text-[#F7F7F7]

              "
                style={{
                  fontFamily: "var(--font-sf-pro)",

                  fontWeight: 650,

                  fontVariationSettings: '"wght" 650, "wdth" 125, "opsz" 33',
                }}
              >
                {activeProduct.title}
              </p>

              <p
                className="

                absolute

                left-[40px]

                top-[209px]

                z-10

                w-[270px]

                text-[16px]

                leading-[1.07]

                tracking-[-0.02em]

                text-[#F7F7F7]

              "
                style={{
                  fontFamily: "var(--font-sf-pro)",

                  fontWeight: 270,

                  fontVariationSettings: '"wght" 270, "wdth" 125, "opsz" 16',
                }}
              >
                {activeProduct.description}
              </p>

              <span
                className="

                absolute

                left-[40px]

                top-[317px]

                z-10

                whitespace-nowrap

                text-[16px]

                leading-[1.07]

                tracking-[-0.02em]

                text-white

              "
                style={{
                  fontFamily: "var(--font-sf-pro)",

                  fontWeight: 270,

                  fontVariationSettings: '"wght" 270, "wdth" 125, "opsz" 16',
                }}
              >
                {activeProduct.name}
              </span>
            </div>
          </div>

          {/* 3D MODEL ROTATION AREA */}

          <div
            aria-label="Rotate 3D pump"
            data-home-product-rotate
            className="

            absolute

            left-1/2

            top-[31%]

            z-[35]

            h-[430px]

            w-[620px]

            -translate-x-1/2

            -translate-y-1/2

            touch-none

            cursor-grab

            active:cursor-grabbing

          "
            onPointerDown={handleModelRotatePointerDown}
            onPointerMove={handleModelRotatePointerMove}
            onPointerUp={finishModelRotate}
            onPointerCancel={finishModelRotate}
            onLostPointerCapture={finishModelRotate}
            onContextMenu={(event) => event.preventDefault()}
          />

          {/* ÜRÜN ŞERİDİ — slider değil, doğrudan scroll konumu seçer. */}

          <div
            data-home-product-strip
            style={
              {
                "--product-card-size": "calc((100vw - 168px) / 13)",
              } as React.CSSProperties
            }
            className="absolute left-0 top-[795px] z-[90] h-[460px] w-full overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
            onPointerDown={(event) => {
              if (event.pointerType === "mouse" && event.button !== 0) return;

              stripDragRef.current = {
                active: true,
                startX: event.clientX,
                startPosition:
                  stripPositionRef.current - ACTIVE_PRODUCTS.length,
                moved: false,
              };
            }}
            onPointerMove={(event) => {
              const drag = stripDragRef.current;

              if (!drag.active) return;

              const dx = event.clientX - drag.startX;

              if (!drag.moved && Math.abs(dx) < 6) return;

              drag.moved = true;

              event.currentTarget.setPointerCapture(event.pointerId);

              setStripPosition(drag.startPosition - dx / stripStepRef.current);
            }}
            onPointerUp={() => {
              stripDragRef.current.active = false;

              if (stripDragRef.current.moved)
                setStripPosition(
                  Math.round(stripPositionRef.current - ACTIVE_PRODUCTS.length),
                );
            }}
            onPointerCancel={() => {
              stripDragRef.current.active = false;
            }}
            onLostPointerCapture={() => {
              stripDragRef.current.active = false;
            }}
            onClickCapture={(event) => {
              if (stripDragRef.current.moved) {
                event.preventDefault();
                event.stopPropagation();
                stripDragRef.current.moved = false;
              }
            }}
            onDragStart={(event) => event.preventDefault()}
          >
            <div
              ref={stripTrackRef}
              data-home-product-track
              className="flex w-max gap-[12px] px-[12px] will-change-transform"
            >
              {LOOP_PRODUCTS.map((product, index) => {
                const isActive = index % ACTIVE_PRODUCTS.length === activeIndex;
                const isBlurred = index >= blurStartIndex;

                const showDetails = !isBlurred && (hoveredIndex ?? expandedIndex) === index;

                return (
                  <div
                    key={product.loopKey}
                    className={`relative h-[430px] w-[var(--product-card-size)] shrink-0 transition-[z-index] ${isActive ? "z-30" : "z-10"}`}
                  >
                    <button
                      type="button"
                      disabled={isBlurred}
                      data-product-blurred={isBlurred}
                      aria-label={`${product.name} ${product.title} 3D modelini göster`}
                      aria-pressed={isActive}
                      onClick={() => {
                        if (isBlurred || !selectionReadyRef.current) return;
                        if (
                          window.matchMedia(
                            "(min-width: 768px) and (width < 1024px)",
                          ).matches
                        ) {
                          setExpandedIndex((current) =>
                            current === index ? null : index,
                          );
                        }

                        jumpToProduct(index % ACTIVE_PRODUCTS.length);
                      }}
                      onPointerEnter={(event) => {
                        if (!isBlurred && event.pointerType === "mouse") {
                          setHoveredIndex(index);
                        }
                      }}
                      onPointerLeave={() => {
                        setHoveredIndex((current) =>
                          current === index ? null : current,
                        );
                      }}
                      className="relative block w-full cursor-pointer text-left disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#73c6ff]"
                    >
                      <div
                        className={`relative z-20 aspect-square w-full overflow-hidden rounded-[16px] bg-white transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "shadow-[0_0_0_2px_rgba(255,255,255,0.85),0_4px_24px_rgba(85,190,255,0.23)]" : "shadow-[0_3px_8px_rgba(0,0,0,0.08)]"}`}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(min-width: 1920px) 132px, 8vw"
                          draggable={false}
                          className="pointer-events-none select-none object-contain p-[9px]"
                        />
                        {isActive && !isBlurred && <span aria-hidden="true" className="product-selection-orbit" />}
                      </div>

                      {/* Aktif kartın altında referanstaki gri-mavi, dikey bilgi paneli. */}

                      <div
                        className={`absolute left-0 top-[calc(var(--product-card-size)-8px)] z-10 flex w-full origin-top items-center justify-center overflow-hidden rounded-b-[17px] bg-[#9EAFB9] transition-[height,opacity,transform] duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${showDetails ? "h-[200px] scale-y-100 opacity-100" : "h-0 scale-y-90 opacity-0"}`}
                        aria-hidden={!showDetails}
                      >
                        <div className="flex h-[108px] w-[182px] -rotate-90 flex-col items-start justify-center gap-[7px] text-left">
                          <span
                            className="w-full overflow-hidden text-[12px] font-medium leading-[1.12] tracking-[-0.03em] text-[#0057E7] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                            style={{
                              fontFamily: "var(--font-sf-pro)",

                              fontWeight: 560,

                              fontVariationSettings: '"wght" 560, "wdth" 120',
                            }}
                          >
                            {product.title}
                          </span>

                          <span
                            className="w-full overflow-hidden text-[9px] leading-[1.2] text-[#0057E7] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                            style={{ fontFamily: "var(--font-sf-pro)" }}
                          >
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            ref={controlBarRef}
            data-home-gallery-layer
            className="absolute bottom-5 left-1/2 z-[75] w-[calc(100%-24px)] -translate-x-1/2"
          >
            <HomeElasticGallery
              value={galleryPosition}
              count={ACTIVE_PRODUCTS.length}
              onChange={(position) => setStripPosition(position, false)}
            />
          </div>
        </div>
      </div>

      <style>{`
        @property --product-border-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes product-border-orbit { to { --product-border-angle: 360deg; } }
        .product-selection-orbit { position:absolute;inset:0;border-radius:inherit;padding:2px;pointer-events:none;background:conic-gradient(from var(--product-border-angle),#0057e733,#0057e7 70deg,#73c6ff 120deg,#4687b8 160deg,#0057e733 210deg);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;animation:product-border-orbit 2.8s linear infinite; }
        @media(prefers-reduced-motion:reduce){.product-selection-orbit{animation:none;}}

        @media(min-width:1024px){

          [data-home-products]{--product-gallery-space:50px;--product-cards-drop:0px;height:calc(100svh + var(--product-gallery-space))}

          [data-home-products] [data-home-product-viewport]{overflow:visible}

          [data-home-products] [data-home-product-viewport]>video{height:calc(100% + var(--product-gallery-space))}

          [data-home-products] [data-home-product-stage]{transform:none!important;top:0}

          [data-home-products] [data-home-categories]{left:auto;right:8.333333%;top:7vh;width:clamp(220px,16vw,300px);height:48px}

          [data-home-products] [data-home-categories]>span:first-child{font-size:clamp(14px,1.05vw,20px)}

          [data-home-products] [data-home-product-title]{left:8.333333%;top:32%;width:29%;height:auto;font-size:clamp(36px,3.5vw,67px)}

          [data-home-products] [data-home-product-description]{left:8.333333%;top:calc(32% + clamp(108px,10.5vw,201px) + 28px);width:26%;font-size:clamp(12px,.95vw,16px);letter-spacing:-.03em;line-height:1.2}

          [data-home-products] [data-home-product-card]{width:clamp(235px,20.4vw,392px);height:clamp(260px,22.45vw,431px)}

          [data-home-products] [data-home-product-card]>div{border-radius:clamp(30px,2.76vw,53px)}

          [data-home-products] [data-home-product-card] p:first-of-type{left:10%;top:25%;font-size:clamp(23px,1.72vw,33px)}

          [data-home-products] [data-home-product-card] p:nth-of-type(2){left:10%;top:48%;width:75%;font-size:clamp(12px,.84vw,16px)}

          [data-home-products] [data-home-product-card] span{left:10%;top:75%;font-size:clamp(12px,.84vw,16px)}

          [data-home-products] [data-home-product-rotate]{top:40%;width:42vw;height:45vh}

          [data-home-products] [data-home-product-strip]{top:auto;bottom:calc(max(74px,110px - 3vh) - var(--product-cards-drop));height:clamp(132px,10vw,190px);overflow:visible}

          [data-home-products] [data-home-product-strip]>div>div{height:auto}

          [data-home-products] [data-home-product-strip] button>div:nth-child(2){top:calc(var(--product-card-size) - 8px);bottom:auto;border-radius:0 0 17px 17px;transform-origin:top}

          [data-home-products] [data-home-gallery-layer]{bottom:calc(32px - var(--product-gallery-space))}

        }

        @media(min-width:1024px) and (max-height:800px){

          [data-home-products] [data-home-product-strip]{bottom:calc(56px - var(--product-cards-drop))}

        }

      `}</style>
    </section>
  );
}
