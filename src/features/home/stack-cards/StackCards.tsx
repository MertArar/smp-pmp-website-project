"use client";

import { useHomeCompact, MobileStack } from "../HomeMobileSections";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { pageWheelDelta, stopSmoothScroll } from "@/lib/smoothScroll";

/* =========================================================
   DESIGN REFERENCE
========================================================= */

const DESIGN = {
  figmaWidth: 1440,
  figmaHeight: 1024,
  targetWidth: 1920,
  targetHeight: 1080,
  scale: 1920 / 1440,
  figmaStackHeight: 688,
  verticalPadding: 48,
};

const MASTER = {
  width: DESIGN.targetWidth,
  height: DESIGN.figmaStackHeight * DESIGN.scale,
};

const px = (value: number) => value * DESIGN.scale;

/* =========================================================
   TYPES
========================================================= */

type CardGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  blur: number;
};

type ContentTag = {
  id: string;
  text: string;
  width: number;
};

type StackCard = {
  id: number;
  background: string;
  title: string;
  titleColor: string;
  tags: ContentTag[];
  description: string;
  buttonText: string;
  href: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  headingStartSize: number;
  headingStartWeight: number;
};

/* =========================================================
   FIGMA CARD POSITIONS
========================================================= */

const FIGMA_SLOTS: CardGeometry[] = [
  {
    x: 120,
    y: 219,
    width: 1200,
    height: 469,
    radius: 30,
    blur: 0,
  },
  {
    x: 133,
    y: 111,
    width: 1174,
    height: 458.84,
    radius: 29.35,
    blur: 8,
  },
  {
    x: 162,
    y: 52,
    width: 1116,
    height: 436.17,
    radius: 27.9,
    blur: 10.5,
  },
  {
    x: 202,
    y: 0,
    width: 1036,
    height: 404.9,
    radius: 25.9,
    blur: 11.31,
  },
];

/* =========================================================
   BLUR VALUES
========================================================= */

const CSS_BLUR_VALUES = [0, 5.5, 8, 10.5] as const;

const CARD_SLOTS: CardGeometry[] = FIGMA_SLOTS.map((slot, index) => ({
  x: px(slot.x),
  y: px(slot.y),
  width: px(slot.width),
  height: px(slot.height),
  radius: px(slot.radius),
  blur: CSS_BLUR_VALUES[index],
}));

/* =========================================================
   TYPOGRAPHY
========================================================= */

const sfExpandedHeading: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",
  fontVariationSettings: '"wght" 350, "wdth" 125',
  fontWeight: 350,
  fontOpticalSizing: "auto",
};

const sfExpandedRegular: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",
  fontVariationSettings: '"wght" 410, "wdth" 125',
  fontWeight: 410,
  fontOpticalSizing: "auto",
};

const sfExpandedLight: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",
  fontVariationSettings: '"wght" 300, "wdth" 125',
  fontWeight: 300,
  fontOpticalSizing: "auto",
};

/* =========================================================
   TAG STYLE
========================================================= */

const TAG_STYLE = {
  height: 20.5,
  radius: 5.66,
  border: 0.31,
  gap: 8,
  paddingX: 7.1,
  paddingY: 3.54,
  fontSize: 8.5,
};

/* =========================================================
   FRONT IMAGE DIMENSIONS — FIGMA
========================================================= */

const FRONT_IMAGE = {
  width: 439,
  height: 385,
};

/* =========================================================
   CARD CONTENT AND INITIAL IMAGE DIMENSIONS

   imageWidth and imageHeight represent
   the image dimensions in the closed stack.

   These dimensions animate toward FRONT_IMAGE
   when each card advances to the front.
========================================================= */

const CARDS: StackCard[] = [
  {
    id: 1,
    background: "#9EB7D0",
    title: "Foundry Park",
    titleColor: "#F7F7F7",

    tags: [
      {
        id: "engineers",
        text: "[25+] Specialized Engineers",
        width: 164.25,
      },
      {
        id: "simulation",
        text: "3D CAD & Advanced Fluid Simulation",
        width: 200.34,
      },
      {
        id: "experience",
        text: "50+ Years of Engineering",
        width: 146.54,
      },
    ],

    description:
      "We combine advanced engineering with creativity to offer innovative fluid solutions. Supported by our R&D team and advanced test simulations, we turn complex customer needs into reality.",

    buttonText: "Discover",
    href: "/foundry",

    image: "/home/stack-card/stack-card-img01.webp",
    imageAlt: "Foundry Park manufacturing facility",

    imageWidth: 439,
    imageHeight: 385,

    headingStartSize: 50,
    headingStartWeight: 350,
  },

  {
    id: 2,
    background: "#F7F7F7",
    title: "Innovation & Design",
    titleColor: "#0D5792",

    tags: [
      {
        id: "creative",
        text: "Creative Engineering",
        width: 141,
      },
      {
        id: "research",
        text: "Advanced R&D Solutions",
        width: 173,
      },
      {
        id: "technology",
        text: "Future-Ready Technology",
        width: 165,
      },
    ],

    description:
      "We transform bold ideas into intelligent engineering solutions. Through research, digital innovation and advanced design technologies, we create efficient and reliable systems for tomorrow.",

    buttonText: "Discover",
    href: "/innovation",

    image: "/home/stack-card/stack-card-img02.webp",
    imageAlt: "Innovation and engineering design",

    imageWidth: 429.49,
    imageHeight: 376.66,

    headingStartSize: 48.92,
    headingStartWeight: 410,
  },

  {
    id: 3,
    background: "#4687B8",
    title: "Production Excellence",
    titleColor: "#F7F7F7",

    tags: [
      {
        id: "precision",
        text: "Precision Manufacturing",
        width: 170,
      },
      {
        id: "technology",
        text: "Advanced Production Systems",
        width: 198,
      },
      {
        id: "quality",
        text: "Quality at Every Stage",
        width: 166,
      },
    ],

    description:
      "Our manufacturing capabilities bring precision and innovation together. With advanced production technologies and continuous quality control, we deliver dependable pumping solutions for demanding industries.",

    buttonText: "Discover",
    href: "/production",

    image: "/home/stack-card/stack-card-img02.webp",
    imageAlt: "Advanced industrial production",

    imageWidth: 408.27,
    imageHeight: 358.05,

    headingStartSize: 48.92,
    headingStartWeight: 410,
  },

  {
    id: 4,
    background: "#F7F7F7",
    title: "Global Solutions",
    titleColor: "#0D5792",

    tags: [
      {
        id: "global",
        text: "Global Engineering Network",
        width: 184,
      },
      {
        id: "industries",
        text: "Industry-Specific Solutions",
        width: 193,
      },
      {
        id: "reliability",
        text: "Trusted Performance",
        width: 153,
      },
    ],

    description:
      "We support industries worldwide with reliable fluid transfer technologies. Combining engineering expertise with a global perspective, we develop solutions tailored to diverse operational needs.",

    buttonText: "Discover",
    href: "/global",

    image: "/home/stack-card/stack-card-img02.webp",
    imageAlt: "Global engineering solutions",

    imageWidth: 379,
    imageHeight: 332.38,

    headingStartSize: 48.92,
    headingStartWeight: 410,
  },
];

/* =========================================================
   ANIMATION CONFIG
========================================================= */

const CONFIG = {
  scrollLength: 4.2,
  exitDistance: px(620),
  transitionDuration: 900,
  gestureIdle: 180,
  precision: 0.0001,
};

/* =========================================================
   HELPERS
========================================================= */

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function smoothstep(progress: number): number {
  const t = clamp(progress);
  return t * t * (3 - 2 * t);
}

function interpolateGeometry(
  from: CardGeometry,
  to: CardGeometry,
  progress: number,
): CardGeometry {
  return {
    x: lerp(from.x, to.x, progress),
    y: lerp(from.y, to.y, progress),
    width: lerp(from.width, to.width, progress),
    height: lerp(from.height, to.height, progress),
    radius: lerp(from.radius, to.radius, progress),
    blur: lerp(from.blur, to.blur, progress),
  };
}

/* =========================================================
   CARD TAGS
========================================================= */

function StackCardTags({ tags, color }: { tags: ContentTag[]; color: string }) {
  return (
    <div
      className="absolute flex items-center"
      style={{
        left: px(65),
        top: px(230),
        gap: px(TAG_STYLE.gap),
        height: px(TAG_STYLE.height),
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="flex shrink-0 items-center justify-center whitespace-nowrap"
          style={{
            boxSizing: "border-box",
            width: px(tag.width),
            height: px(TAG_STYLE.height),
            borderRadius: px(TAG_STYLE.radius),
            border: `${px(TAG_STYLE.border)}px solid ${color}`,
            paddingTop: px(TAG_STYLE.paddingY),
            paddingBottom: px(TAG_STYLE.paddingY),
            paddingLeft: px(TAG_STYLE.paddingX),
            paddingRight: px(TAG_STYLE.paddingX),
            background: "transparent",
            color,
            ...sfExpandedRegular,
            fontSize: px(TAG_STYLE.fontSize),
            lineHeight: 1,
            letterSpacing: 0,
          }}
        >
          {tag.text}
        </span>
      ))}
    </div>
  );
}

/* =========================================================
   CARD DESCRIPTION
========================================================= */

function StackCardDescription({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <p
      className="absolute m-0"
      style={{
        ...sfExpandedLight,
        left: px(65),
        top: px(270),
        width: px(554),
        minHeight: px(60),
        fontSize: px(15),
        lineHeight: 1,
        letterSpacing: 0,
        color,
      }}
    >
      {text}
    </p>
  );
}

/* =========================================================
   DISCOVER BUTTON
========================================================= */

function StackCardButton({ text, href }: { text: string; href: string }) {
  return (
    <Link
      href={href}
      className="group pointer-events-auto absolute flex h-[43px] w-[179px] items-center overflow-hidden rounded-[19px] bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] shadow-[0_4px_12px_rgba(0,74,226,0.25)]"
      style={{
        left: px(65),
        top: px(365),
      }}
    >
      {/* WHITE HOVER BACKGROUND */}
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100"
      />

      {/* BUTTON TEXT */}
      <span
        className="absolute left-[18px] top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap text-[#F7F7F7] transition-[transform,color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[29px] group-hover:text-[#27272A]"
        style={{
          ...sfExpandedRegular,
          fontSize: "15px",
          lineHeight: "1.07",
          letterSpacing: "-0.04em",
        }}
      >
        {text}
      </span>

      {/* MOVING CIRCLE */}
      <span
        aria-hidden="true"
        className="absolute left-[141px] top-1/2 z-[3] flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[6px]"
      >
        <FiArrowUpRight
          size={20}
          strokeWidth={3.2}
          className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover:scale-100 group-hover:opacity-100"
        />
      </span>
    </Link>
  );
}

/* =========================================================
   CARD IMAGE

   Image dimensions are driven by CSS variables.

   Initial values:
   Card 1: 439 x 385
   Card 2: 429.49 x 376.66
   Card 3: 408.27 x 358.05
   Card 4: 379 x 332.38

   Every card approaches 439 x 385 in the front slot.
========================================================= */

function StackCardImage({
  src,
  alt,
  initialWidth,
  initialHeight,
}: {
  src: string;
  alt: string;
  initialWidth: number;
  initialHeight: number;
}) {
  return (
    <div
      className="pointer-events-none absolute isolate overflow-hidden"
      style={{
        top: px(42),
        right: px(52),

        width: `var(--card-image-width, ${px(initialWidth)}px)`,
        height: `var(--card-image-height, ${px(initialHeight)}px)`,

        borderRadius: px(30),
        border: "none",
        boxShadow: "none",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="586px"
        className="object-cover"
        style={{
          objectPosition: "center",
          imageRendering: "auto",
          filter: "none",
        }}
      />
    </div>
  );
}

/* =========================================================
   SHARED CARD CONTENT
========================================================= */

function StackCardContent({ card }: { card: StackCard }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* HEADING */}
      <h2
        className="absolute m-0 whitespace-nowrap"
        style={{
          ...sfExpandedHeading,
          left: px(65),
          top: px(60),
          width: px(650),
          height: px(50),

          fontSize: `var(--card-heading-size, ${px(card.headingStartSize)}px)`,

          fontWeight:
            "var(--card-heading-weight, 350)" as CSSProperties["fontWeight"],

          fontVariationSettings:
            '"wght" var(--card-heading-weight, 350), "wdth" 125',

          lineHeight: 1,
          letterSpacing: 0,
          color: card.titleColor,
        }}
      >
        {card.title}
      </h2>

      <StackCardTags tags={card.tags} color={card.titleColor} />

      <StackCardDescription text={card.description} color={card.titleColor} />

      <StackCardButton text={card.buttonText} href={card.href} />

      <StackCardImage
        src={card.image}
        alt={card.imageAlt}
        initialWidth={card.imageWidth}
        initialHeight={card.imageHeight}
      />
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function DesktopStackCards() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    const cards = cardRefs.current;

    if (cards.length !== CARDS.length || cards.some((card) => !card)) {
      return;
    }

    let animationFrame: number | null = null;
    let currentProgress = 0;
    let settledIndex = 0;
    let sectionTop = 0;
    let scrollDistance = 1;
    let previousScrollY = window.scrollY;
    let gestureUntil = 0;
    let disposed = false;
    let transition: { from: number; to: number; started: number } | null = null;
    let touchStart: { x: number; y: number; consumed: boolean } | null = null;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let reducedMotion = reducedMotionQuery.matches;

    const styleValues = new WeakMap<HTMLElement, Map<string, string>>();
    const contentProgress = new WeakMap<HTMLElement, number>();
    const writeStyle = (element: HTMLElement, property: string, value: string) => {
      let values = styleValues.get(element);
      if (!values) { values = new Map(); styleValues.set(element, values); }
      if (!values.has(property)) values.set(property, element.style.getPropertyValue(property));
      if (values.get(property) === value) return;
      element.style.setProperty(property, value);
      values.set(property, value);
    };

    /* -----------------------------------------------------
       RESPONSIVE STAGE SCALING
    ----------------------------------------------------- */

    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const widthRatio = viewportWidth / MASTER.width;

      const heightRatio =
        (viewportHeight - DESIGN.verticalPadding * 2) / MASTER.height;

      const scale = Math.max(0.2, Math.min(widthRatio, heightRatio, 1));

      stage.style.setProperty("--stack-scale", String(scale));
    };

    /* -----------------------------------------------------
       APPLY CARD GEOMETRY AND IMAGE DIMENSIONS
    ----------------------------------------------------- */

    const setCardStyle = (
      element: HTMLDivElement,
      geometry: CardGeometry,
      options: {
        opacity?: number;
        translateY?: number;
        zIndex?: number;
        cardIndex?: number;
      } = {},
    ) => {
      const {
        opacity = 1,
        translateY = 0,
        zIndex = 1,
        cardIndex = -1,
      } = options;

      const anchor = CARD_SLOTS[cardIndex];
      writeStyle(element, "transform", `translate3d(${geometry.x - anchor.x}px, ${geometry.y - anchor.y + translateY}px, 0)`);
      writeStyle(element, "width", `${geometry.width}px`);
      writeStyle(element, "height", `${geometry.height}px`);
      writeStyle(element, "border-radius", `${geometry.radius}px`);
      writeStyle(element, "filter", geometry.blur > 0.01 ? `blur(${geometry.blur}px)` : "none");
      writeStyle(element, "opacity", String(opacity));
      writeStyle(element, "z-index", String(zIndex));

      /* -----------------------------------------------
         CONTENT PROGRESS

         Progress is based on the card's own original
         stack width and the target front width.

         Card 1 always uses progress 1.
      ----------------------------------------------- */

      if (cardIndex >= 0) {
        const cardData = CARDS[cardIndex];

        const originalSlot = CARD_SLOTS[cardIndex];
        const frontSlot = CARD_SLOTS[0];

        const frontProgress =
          cardIndex === 0
            ? 1
            : clamp(
                (geometry.width - originalSlot.width) /
                  (frontSlot.width - originalSlot.width),
              );

        if (contentProgress.get(element) === frontProgress) return;
        contentProgress.set(element, frontProgress);

        /* -----------------------------------------------
           HEADING INTERPOLATION
        ----------------------------------------------- */

        const headingSize = px(
          lerp(cardData.headingStartSize, 50, frontProgress),
        );

        const headingWeight = lerp(
          cardData.headingStartWeight,
          350,
          frontProgress,
        );

        writeStyle(element, "--card-heading-size", `${headingSize}px`);

        writeStyle(element,
          "--card-heading-weight",
          String(headingWeight),
        );

        /* -----------------------------------------------
           IMAGE INTERPOLATION

           Closed dimensions -> Front dimensions.

           This continues smoothly through every
           intermediate stack position.
        ----------------------------------------------- */

        const imageWidth = px(
          lerp(cardData.imageWidth, FRONT_IMAGE.width, frontProgress),
        );

        const imageHeight = px(
          lerp(cardData.imageHeight, FRONT_IMAGE.height, frontProgress),
        );

        writeStyle(element, "--card-image-width", `${imageWidth}px`);

        writeStyle(element, "--card-image-height", `${imageHeight}px`);
      }
    };

    /* -----------------------------------------------------
       STACK SCROLL ANIMATION
    ----------------------------------------------------- */

    const applyProgress = (progress: number) => {
      const transitions = CARDS.length - 1;
      const scaledProgress = clamp(progress) * transitions;

      const phase = Math.min(Math.floor(scaledProgress), transitions);

      const phaseProgress =
        phase >= transitions ? 0 : smoothstep(scaledProgress - phase);

      for (let index = 0; index < cards.length; index++) {
        const element = cards[index];

        if (!element) continue;

        /* EXITED CARDS */
        if (index < phase) {
          writeStyle(element, "opacity", "0");
          writeStyle(element, "visibility", "hidden");
          writeStyle(element, "pointer-events", "none");
          continue;
        }

        writeStyle(element, "visibility", "visible");
        writeStyle(element, "pointer-events", "auto");

        /* ACTIVE FRONT CARD */
        if (index === phase && phase < transitions) {
          const movement = lerp(0, CONFIG.exitDistance, phaseProgress);

          const opacity = clamp(1 - phaseProgress * 1.55);

          setCardStyle(element, CARD_SLOTS[0], {
            opacity,
            translateY: movement,
            zIndex: 100,
            cardIndex: index,
          });

          continue;
        }

        /* REMAINING CARDS ADVANCE */
        const currentSlot = index - phase;
        const nextSlot = Math.max(0, currentSlot - 1);

        const startGeometry = CARD_SLOTS[currentSlot];
        const endGeometry = CARD_SLOTS[nextSlot];

        if (!startGeometry || !endGeometry) {
          continue;
        }

        const transitionProgress = phase >= transitions ? 1 : phaseProgress;

        const geometry = interpolateGeometry(
          startGeometry,
          endGeometry,
          transitionProgress,
        );

        const depth = lerp(currentSlot, nextSlot, transitionProgress);

        setCardStyle(element, geometry, {
          opacity: 1,
          translateY: 0,
          zIndex: Math.round(80 - depth * 10),
          cardIndex: index,
        });
      }

      /* FINAL CARD */
      if (phase >= transitions) {
        const lastCard = cards[transitions];

        if (lastCard) {
          writeStyle(lastCard, "visibility", "visible");
          writeStyle(lastCard, "pointer-events", "auto");

          setCardStyle(lastCard, CARD_SLOTS[0], {
            opacity: 1,
            translateY: 0,
            zIndex: 100,
            cardIndex: transitions,
          });
        }
      }
    };

    /* -----------------------------------------------------
       SCROLL PROGRESS
    ----------------------------------------------------- */

    const transitions = CARDS.length - 1;
    const isPinned = () => window.scrollY >= sectionTop - 1 && window.scrollY <= sectionTop + scrollDistance + 1;
    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      calculateScale();
    };
    const renderProgress = (value: number) => {
      currentProgress = value;
      applyProgress(value);
    };
    const movePage = () => {
      const top = sectionTop + currentProgress * scrollDistance;
      window.scrollTo({ top, behavior: "instant" });
      previousScrollY = window.scrollY;
    };
    const animate = (time: number) => {
      animationFrame = null;
      if (!transition || disposed) return;
      const elapsed = reducedMotion ? 1 : clamp((time - transition.started) / CONFIG.transitionDuration);
      // applyProgress retains the original smoothstep geometry, blur and exit path.
      renderProgress(lerp(transition.from, transition.to, elapsed));
      movePage();
      if (elapsed < 1) animationFrame = requestAnimationFrame(animate);
      else {
        settledIndex = Math.round(transition.to * transitions);
        transition = null;
      }
    };
    const goToCard = (index: number) => {
      stopSmoothScroll();
      transition = { from: currentProgress, to: index / transitions, started: performance.now() };
      if (animationFrame === null) animationFrame = requestAnimationFrame(animate);
    };
    const step = (direction: number) => {
      if (!isPinned()) return false;
      if (transition) return true;
      const next = settledIndex + direction;
      // A fresh gesture at either boundary returns control to normal page scroll.
      if (next < 0 || next > transitions) return false;
      goToCard(next);
      return true;
    };
    const onWheel = (event: WheelEvent) => {
      if (!isPinned() || !pageWheelDelta(event)) return;
      const now = performance.now();
      if (transition || now < gestureUntil || step(Math.sign(event.deltaY))) {
        event.preventDefault();
        // Consume the tail of one trackpad gesture, without queuing extra cards.
        gestureUntil = now + CONFIG.gestureIdle;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement).closest("a,button,input,textarea,select,[contenteditable='true']")) return;
      const direction = event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey)
        ? 1 : event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey) ? -1 : 0;
      if (direction && isPinned() && (transition || (event.repeat ? settledIndex > 0 && settledIndex < transitions : step(direction)))) event.preventDefault();
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches.length === 1 ? event.touches[0] : undefined;
      touchStart = touch ? { x: touch.clientX, y: touch.clientY, consumed: false } : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touchStart || event.touches.length !== 1 || !isPinned()) return;
      const touch = event.touches[0];
      const dy = touchStart.y - touch.clientY;
      const dx = touchStart.x - touch.clientX;
      if (Math.abs(dy) < 6 || Math.abs(dx) > Math.abs(dy)) return;
      if (touchStart.consumed || transition || step(Math.sign(dy))) {
        event.preventDefault();
        touchStart.consumed = true;
      }
    };
    const onTouchEnd = () => { touchStart = null; };
    const requestUpdate = () => {
      if (transition || disposed) return;
      const position = window.scrollY;
      const direction = Math.sign(position - previousScrollY);
      previousScrollY = position;
      const raw = clamp((position - sectionTop) / scrollDistance);
      if (Math.abs(raw - currentProgress) * scrollDistance <= 1) return;
      renderProgress(raw);
      if (isPinned()) {
        // Scrollbar dragging and navigation also settle on a whole card.
        const index = direction > 0 ? Math.ceil(raw * transitions) : direction < 0 ? Math.floor(raw * transitions) : Math.round(raw * transitions);
        goToCard(clamp(index, 0, transitions));
      } else settledIndex = Math.round(raw * transitions);
    };
    const handleResize = () => {
      if (disposed) return;
      const pinned = isPinned();
      measure();
      if (transition && pinned) movePage();
      else requestUpdate();
    };
    const handleReducedMotion = () => { reducedMotion = reducedMotionQuery.matches; };

    measure();
    currentProgress = clamp((window.scrollY - sectionTop) / scrollDistance);
    settledIndex = Math.round(currentProgress * transitions);
    renderProgress(currentProgress);
    if (isPinned() && Math.abs(currentProgress * transitions - settledIndex) > CONFIG.precision) goToCard(settledIndex);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(section);
    if (section.parentElement) resizeObserver.observe(section.parentElement);
    void document.fonts.ready.then(() => { if (!disposed) handleResize(); });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);
    reducedMotionQuery.addEventListener("change", handleReducedMotion);
    return () => {
      disposed = true;
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      reducedMotionQuery.removeEventListener("change", handleReducedMotion);
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    };
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="stack-cards"
      ref={sectionRef}
      className="relative w-full bg-[#E0EFF9]"
      style={{
        height: `${CONFIG.scrollLength * 100}svh`,
      }}
    >
      {/* STICKY VIEWPORT */}
      <div className="sticky top-0 isolate h-[100svh] w-full overflow-hidden bg-[#E0EFF9]">
        {/* 1920 DESKTOP STAGE */}
        <div
          ref={stageRef}
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={
            {
              width: MASTER.width,
              height: MASTER.height,
              "--stack-scale": 1,
              transform: "translate(-50%, -50%) scale(var(--stack-scale))",
              transformOrigin: "center center",
            } as CSSProperties
          }
        >
          {/* RENDER CARDS BACK TO FRONT */}
          {[...CARDS].reverse().map((card) => {
            const index = card.id - 1;
            const slot = CARD_SLOTS[index];

            return (
              <div
                key={card.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="absolute overflow-hidden will-change-[transform,opacity]"
                style={
                  {
                    left: slot.x,
                    top: slot.y,
                    width: slot.width,
                    height: slot.height,
                    borderRadius: slot.radius,
                    backgroundColor: card.background,
                    filter: slot.blur > 0 ? `blur(${slot.blur}px)` : "none",
                    zIndex: 40 - index * 10,
                    border: "none",
                    boxShadow: "none",

                    "--card-heading-size": `${px(card.headingStartSize)}px`,

                    "--card-heading-weight": card.headingStartWeight,

                    "--card-image-width": `${px(card.imageWidth)}px`,

                    "--card-image-height": `${px(card.imageHeight)}px`,
                  } as CSSProperties
                }
              >
                <StackCardContent card={card} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function StackCards() {
  const compact = useHomeCompact();
  return compact ? <MobileStack cards={CARDS} /> : <DesktopStackCards />;
}
