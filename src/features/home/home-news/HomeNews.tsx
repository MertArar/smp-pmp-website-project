"use client";

import { useHomeCompact, MobileNews } from "../HomeMobileSections";

import Image from "next/image";

import Link from "next/link";

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

import { FiArrowUpRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { useRef, useState } from "react";

const DESIGN = {
  figmaWidth: 1440,

  targetWidth: 1920,

  scale: 1920 / 1440,
};

const px = (value: number) => value * DESIGN.scale;

const SHARED_BACKGROUND =
  "linear-gradient(90deg, #D5EAF7 0%, #D1E8F6 48%, #C6E0F7 68%, #AFCDF9 90%, #BBD7FC 100%)";

const SECTION = {
  background: "#E0EFF9",

  minHeight: 1460,

  // Move the entire content group right without changing internal positions.

  horizontalOffset: px(80),
};

const UPCOMING_EVENTS = {
  // Place the next section beneath the current news cards.

  top: px(310 + 445 + 95),

  title: { left: px(119), width: px(329), height: px(60), fontSize: px(30) },

  month: { left: px(475), top: px(8), width: px(43), fontSize: px(20) },

  divider: { left: px(533), top: 0, width: px(2), height: px(38) },

  year: { left: px(548), top: px(8), width: px(63), fontSize: px(20) },

  eventCards: {
    // Cards begin after the calendar navigation with breathing room.

    left: px(675),

    top: 0,

    width: px(421),

    height: px(193),

    gap: px(15),

    radius: px(30),

    background: "linear-gradient(180deg, #005EFF 0%, #001EA2 100%)",
  },

  calendar: {
    left: px(123),

    top: px(94), // Figma: 7612 - 7518

    width: px(483.23),

    height: px(87),

    dayWidth: px(56),

    dayHeight: px(87),

    dayGap: px(5),

    firstDayLeft: px(40),

    arrowSize: px(20),
  },
};

const HEADING = {
  left: px(119),

  top: px(70),

  width: px(792),

  height: px(100),

  fontSize: px(50),
};

const DESCRIPTION = {
  left: px(119),

  top: HEADING.top + px(115),

  width: px(603),

  height: px(48),

  fontSize: px(15),

  color: "#9EB7D0",
};

const FEATURED_NEWS = {
  number: {
    left: px(808),

    top: HEADING.top + px(6816 - 6755),

    width: px(129),

    height: px(100),

    fontSize: px(100),
  },

  event: {
    left: px(955),

    top: HEADING.top + px(6870 - 6755),

    width: px(79),

    height: px(32),
  },

  date: {
    left: px(1062),

    top: HEADING.top + px(6886 - 6755),

    width: px(96),

    height: px(16),
  },
};

const VIEW_ALL_BUTTON = {
  left: px(1180),

  top: HEADING.top + px(6762 - 6755),

  width: px(140),

  height: px(43),

  radius: px(19),

  circleSize: px(33),

  circleInset: px(5),

  textInset: px(18),

  textMove: px(40),

  fontSize: px(15),

  blur: px(15),

  glowSize: px(95),

  glowOpacity: 0.46,

  glowBlur: px(18),
};

const EXHIBITION_TAG = {
  left: px(1196),

  top: HEADING.top + px(6880 - 6755),

  width: px(124),

  height: px(28),

  radius: px(10),

  borderWidth: px(1),

  fontSize: px(15),

  color: "#9EB7D0",
};

const NEWS_CARD = {
  left: px(119),

  top: px(310),

  width: px(718),

  height: px(445),

  radius: px(30),

  borderWidth: 0.35,

  background: "#F7F7F7",

  borderColor: "#9EB7D0",
};

const SECOND_NEWS_CARD = {
  gap: px(10),

  left: NEWS_CARD.left + NEWS_CARD.width + px(10),

  top: NEWS_CARD.top,

  width: NEWS_CARD.width,

  height: NEWS_CARD.height,
};

type NewsItem = {
  id: number;

  category: string;

  title: string;

  description: string;

  date: string;

  image: string;

  href: string;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,

    category: "Exhibition",

    title: "We're Participating in MCE Milano Fair",

    description:
      "The MCE Milano Fair is a significant event bringing together industry professionals from March 12 to March 15, ...",

    date: "25.12.2025",

    image: "/home/home-news/news.jpg",

    href: "/news",
  },

  {
    id: 2,

    category: "Exhibition",

    title: "We're Participating in MCE Milano Fair",

    description:
      "The MCE Milano Fair is a significant event bringing together industry professionals from March 12 to March 15, ...",

    date: "25.12.2025",

    image: "/home/home-news/news.jpg",

    href: "/news",
  },
];

const CARD_CONTENT = {
  tag: {
    left: px(30),

    top: px(30),

    fontSize: px(15),

    color: "#9EB7D0",
  },

  heading: {
    left: px(30),

    top: px(98),

    width: px(359),

    height: px(60),

    fontSize: px(30),

    color: "#0D5792",
  },

  description: {
    left: px(30),

    top: px(174),

    width: px(339),

    height: px(39),

    fontSize: px(12),

    color: "#27272A",
  },

  button: {
    left: px(30),

    top: px(230.5),
  },

  date: {
    left: px(30),

    bottom: px(30),

    width: px(96),

    height: px(16),

    fontSize: px(15),

    color: "#9EB7D0",
  },

  image: {
    right: px(30),

    top: px(30),

    width: px(288),

    height: px(384),

    radius: px(30),
  },
};

const DISCOVER_BUTTON = {
  width: px(140),

  height: px(43),

  radius: px(19),

  circleSize: px(32),

  circleInset: px(5),

  textInset: px(17),

  textMove: px(40),

  fontSize: px(15),
};

const regularFont: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",

  fontWeight: 410,

  fontStretch: "125%",

  fontVariationSettings: '"wght" 410, "wdth" 125',

  fontOpticalSizing: "auto",

  fontSynthesis: "none",
};

const lightFont: CSSProperties = {
  fontFamily: "var(--font-sf-pro), sans-serif",

  fontWeight: 270,

  fontStretch: "125%",

  fontVariationSettings: '"wght" 270, "wdth" 125',

  fontOpticalSizing: "auto",

  fontSynthesis: "none",
};

function NewsDiscoverButton({
  href,

  interactive = true,
}: {
  href: string;

  interactive?: boolean;
}) {
  const circleStart =
    DISCOVER_BUTTON.width -
    DISCOVER_BUTTON.circleSize -
    DISCOVER_BUTTON.circleInset;

  const variables = {
    "--circle-start": `${circleStart}px`,

    "--circle-end": `${DISCOVER_BUTTON.circleInset}px`,

    "--text-move": `${DISCOVER_BUTTON.textMove}px`,
  } as CSSProperties;

  const buttonStyle: CSSProperties = {
    ...variables,

    width: DISCOVER_BUTTON.width,

    height: DISCOVER_BUTTON.height,

    borderRadius: DISCOVER_BUTTON.radius,

    boxShadow: "0 4px 14px rgba(0,94,255,0.22)",
  };

  const content = (
    <>
      <span
        className={`pointer-events-none absolute top-1/2 z-[2]

          -translate-y-1/2 whitespace-nowrap text-white

          transition-colors duration-[350ms]

          ${interactive ? "group-hover:text-[#27272A]" : ""}`}
        style={{
          ...regularFont,

          left: DISCOVER_BUTTON.textInset,

          fontSize: DISCOVER_BUTTON.fontSize,

          lineHeight: 1.07,

          letterSpacing: "-0.04em",
        }}
      >
        <span
          className={`block transition-transform duration-[650ms]

            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${interactive ? "group-hover:translate-x-[var(--text-move)]" : ""}`}
        >
          Discover
        </span>
      </span>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 z-[3]

          flex -translate-y-1/2 items-center justify-center

          rounded-full

          bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)]

          left-[var(--circle-start)]

          transition-[left] duration-[650ms]

          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${interactive ? "group-hover:left-[var(--circle-end)]" : ""}`}
        style={{
          width: DISCOVER_BUTTON.circleSize,

          height: DISCOVER_BUTTON.circleSize,

          boxShadow: "0 0 13px rgba(0,94,255,0.38)",
        }}
      >
        <FiArrowUpRight
          size={px(20)}
          strokeWidth={3.2}
          className={`scale-[0.8] text-white opacity-0

            transition-[opacity,transform] duration-[350ms]

            ${
              interactive ? "group-hover:scale-100 group-hover:opacity-100" : ""
            }`}
        />
      </span>
    </>
  );

  if (!interactive) {
    return (
      <div
        aria-hidden="true"
        className="relative block overflow-hidden bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)]"
        style={buttonStyle}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label="Discover news"
      className="group relative block overflow-hidden

        bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)]

        transition-[background,box-shadow] duration-[350ms]

        hover:bg-none hover:bg-white"
      style={buttonStyle}
    >
      {content}
    </Link>
  );
}

function NewsCardContent({
  item,

  interactive = true,
}: {
  item: NewsItem;

  interactive?: boolean;
}) {
  return (
    <div className="relative h-full w-full">
      {/* CATEGORY */}

      <span
        className="absolute block whitespace-nowrap"
        style={{
          ...lightFont,

          left: CARD_CONTENT.tag.left,

          top: CARD_CONTENT.tag.top,

          fontSize: CARD_CONTENT.tag.fontSize,

          lineHeight: 1.07,

          letterSpacing: "-0.02em",

          color: CARD_CONTENT.tag.color,
        }}
      >
        {item.category}
      </span>

      {/* HEADING */}

      <h3
        className="absolute m-0"
        style={{
          ...regularFont,

          left: CARD_CONTENT.heading.left,

          top: CARD_CONTENT.heading.top,

          width: CARD_CONTENT.heading.width,

          minHeight: CARD_CONTENT.heading.height,

          fontSize: CARD_CONTENT.heading.fontSize,

          lineHeight: 1,

          letterSpacing: 0,

          color: CARD_CONTENT.heading.color,
        }}
      >
        {item.title}
      </h3>

      {/* DESCRIPTION */}

      <p
        className="absolute m-0"
        style={{
          ...lightFont,

          left: CARD_CONTENT.description.left,

          top: CARD_CONTENT.description.top,

          width: CARD_CONTENT.description.width,

          minHeight: CARD_CONTENT.description.height,

          fontSize: CARD_CONTENT.description.fontSize,

          lineHeight: 1.07,

          letterSpacing: "-0.02em",

          color: CARD_CONTENT.description.color,
        }}
      >
        {item.description}
      </p>

      {/* DISCOVER */}

      <div
        className="absolute z-20"
        style={{
          left: CARD_CONTENT.button.left,

          top: CARD_CONTENT.button.top,
        }}
      >
        <NewsDiscoverButton href={item.href} interactive={interactive} />
      </div>

      {/* DATE */}

      <span
        className="absolute block whitespace-nowrap"
        style={{
          ...lightFont,

          left: CARD_CONTENT.date.left,

          bottom: CARD_CONTENT.date.bottom,

          width: CARD_CONTENT.date.width,

          minHeight: CARD_CONTENT.date.height,

          fontSize: CARD_CONTENT.date.fontSize,

          lineHeight: 1.07,

          letterSpacing: "-0.02em",

          color: CARD_CONTENT.date.color,
        }}
      >
        {item.date}
      </span>

      {/* IMAGE */}

      <div
        className="absolute z-10 overflow-hidden"
        style={{
          right: CARD_CONTENT.image.right,

          top: CARD_CONTENT.image.top,

          width: CARD_CONTENT.image.width,

          height: CARD_CONTENT.image.height,

          borderRadius: CARD_CONTENT.image.radius,
        }}
      >
        <Image
          src={item.image}
          alt={interactive ? item.title : ""}
          fill
          sizes={`${CARD_CONTENT.image.width}px`}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="pointer-events-none select-none object-cover"
          style={{
            objectPosition: "center center",

            userSelect: "none",

            WebkitUserSelect: "none",
          }}
        />
      </div>
    </div>
  );
}

function useCardDrag(step: number) {
  const [offset, setOffset] = useState(0);

  const [dragging, setDragging] = useState(false);

  const offsetRef = useRef(0);

  const gesture = useRef<{
    pointerId: number;

    startX: number;

    startOffset: number;

    moved: boolean;
  } | null>(null);

  const suppressClick = useRef(false);

  function moveTo(next: number) {
    const bounded = Math.max(-step, Math.min(0, next));

    offsetRef.current = bounded;

    setOffset(bounded);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    // Let links and buttons receive genuine clicks and hover without pointer capture.

    if ((event.target as HTMLElement).closest("a, button")) return;

    gesture.current = {
      pointerId: event.pointerId,

      startX: event.clientX,

      startOffset: offsetRef.current,

      moved: false,
    };

    setDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = gesture.current;

    if (!current || current.pointerId !== event.pointerId) return;

    const delta = event.clientX - current.startX;

    if (Math.abs(delta) > 5) current.moved = true;

    moveTo(current.startOffset + delta);
  }

  function finish(event: ReactPointerEvent<HTMLDivElement>, cancelled = false) {
    const current = gesture.current;

    if (!current || current.pointerId !== event.pointerId) return;

    const delta = event.clientX - current.startX;

    suppressClick.current = current.moved;

    gesture.current = null;

    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (cancelled) {
      moveTo(current.startOffset);
    } else if (Math.abs(delta) > 40) {
      moveTo(delta < 0 ? -step : 0);
    } else {
      moveTo(current.startOffset < -step / 2 ? -step : 0);
    }
  }

  function onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (suppressClick.current) {
      event.preventDefault();

      event.stopPropagation();

      suppressClick.current = false;
    }
  }

  return {
    offset,

    dragging,

    handlers: {
      onPointerDown,

      onPointerMove,

      onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => finish(event),

      onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) =>
        finish(event, true),

      onClickCapture,
    },
  };
}

function HomeNewsFirstCard() {
  return (
    <article
      className="absolute z-10 overflow-hidden"
      style={{
        boxSizing: "border-box",

        left: NEWS_CARD.left,

        top: NEWS_CARD.top,

        width: NEWS_CARD.width,

        height: NEWS_CARD.height,

        borderRadius: NEWS_CARD.radius,

        border: `${NEWS_CARD.borderWidth}px solid ${NEWS_CARD.borderColor}`,

        backgroundColor: NEWS_CARD.background,
      }}
    >
      <NewsCardContent item={NEWS_ITEMS[0]} />
    </article>
  );
}

function HomeNewsSecondCard() {
  return (
    <article
      className="absolute z-10 overflow-hidden"
      style={{
        boxSizing: "border-box",

        left: SECOND_NEWS_CARD.left,

        top: SECOND_NEWS_CARD.top,

        width: SECOND_NEWS_CARD.width,

        height: SECOND_NEWS_CARD.height,

        borderRadius: NEWS_CARD.radius,

        border: `${NEWS_CARD.borderWidth}px solid ${NEWS_CARD.borderColor}`,

        backgroundColor: NEWS_CARD.background,
      }}
    >
      {/* The card itself stays sharp even while it is dragged. */}

      <NewsCardContent item={NEWS_ITEMS[1]} interactive />
    </article>
  );
}

function HomeNewsHeading() {
  return (
    <h2
      className="absolute z-10 m-0 bg-clip-text text-transparent"
      style={{
        ...regularFont,

        left: HEADING.left,

        top: HEADING.top,

        width: HEADING.width,

        minHeight: HEADING.height,

        fontSize: HEADING.fontSize,

        lineHeight: 1,

        letterSpacing: "-0.04em",

        backgroundImage: "linear-gradient(180deg,#005EFF 0%,#001EA2 100%)",

        WebkitBackgroundClip: "text",

        WebkitTextFillColor: "transparent",
      }}
    >
      <span className="block whitespace-nowrap">Latest News &</span>

      <span className="block whitespace-nowrap">Announcements</span>
    </h2>
  );
}

function HomeNewsDescription() {
  return (
    <p
      className="absolute z-10 m-0"
      style={{
        ...lightFont,

        left: DESCRIPTION.left,

        top: DESCRIPTION.top,

        width: DESCRIPTION.width,

        minHeight: DESCRIPTION.height,

        fontSize: DESCRIPTION.fontSize,

        lineHeight: 1.07,

        letterSpacing: "-0.02em",

        color: DESCRIPTION.color,
      }}
    >
      Stay up-to-date with our latest global projects, technological
      innovations, and corporate developments. Discover how Sempa is making an
      impact across industries worldwide.
    </p>
  );
}

function HomeNewsFeaturedInformation() {
  return (
    <>
      <span
        className="absolute z-10 block whitespace-nowrap text-[#0D5792]"
        style={{
          ...regularFont,

          left: FEATURED_NEWS.number.left,

          top: FEATURED_NEWS.number.top,

          width: FEATURED_NEWS.number.width,

          height: FEATURED_NEWS.number.height,

          fontSize: FEATURED_NEWS.number.fontSize,

          lineHeight: 1,
        }}
      >
        01
      </span>

      <span
        className="absolute z-10 block text-[#9EB7D0]"
        style={{
          ...lightFont,

          left: FEATURED_NEWS.event.left,

          top: FEATURED_NEWS.event.top,

          width: FEATURED_NEWS.event.width,

          height: FEATURED_NEWS.event.height,

          fontSize: px(15),

          lineHeight: 1.07,

          letterSpacing: "-0.02em",
        }}
      >
        Frankfurt Fair
      </span>

      <span
        className="absolute z-10 block whitespace-nowrap text-[#9EB7D0]"
        style={{
          ...lightFont,

          left: FEATURED_NEWS.date.left,

          top: FEATURED_NEWS.date.top,

          width: FEATURED_NEWS.date.width,

          height: FEATURED_NEWS.date.height,

          fontSize: px(15),

          lineHeight: 1.07,

          letterSpacing: "-0.02em",
        }}
      >
        25.12.2025
      </span>
    </>
  );
}

function HomeNewsViewAllButton() {
  const circleStart =
    VIEW_ALL_BUTTON.width -
    VIEW_ALL_BUTTON.circleSize -
    VIEW_ALL_BUTTON.circleInset;

  const glowOffset =
    (VIEW_ALL_BUTTON.glowSize - VIEW_ALL_BUTTON.circleSize) / 2;

  const vars = {
    "--circle-start": `${circleStart}px`,

    "--circle-end": `${VIEW_ALL_BUTTON.circleInset}px`,

    "--text-move": `${VIEW_ALL_BUTTON.textMove}px`,
  } as CSSProperties;

  return (
    <Link
      href="/news"
      aria-label="View all news"
      className="group absolute z-20 block overflow-hidden

        transition-colors duration-[350ms]"
      style={{
        ...vars,

        left: VIEW_ALL_BUTTON.left,

        top: VIEW_ALL_BUTTON.top,

        width: VIEW_ALL_BUTTON.width,

        height: VIEW_ALL_BUTTON.height,

        borderRadius: VIEW_ALL_BUTTON.radius,

        border: `${px(0.5)}px solid #9EB7D0`,

        backgroundColor: "rgba(255,255,255,0.10)",

        backdropFilter: `blur(${VIEW_ALL_BUTTON.blur}px)`,

        WebkitBackdropFilter: `blur(${VIEW_ALL_BUTTON.blur}px)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#F7F7F7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.10)";
      }}
    >
      {/* GLASS HIGHLIGHT */}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg,rgba(255,255,255,0.13),rgba(255,255,255,0.01))",
        }}
      />

      {/* GLOW */}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-[1]

          -translate-y-1/2

          left-[var(--circle-start)]

          group-hover:left-[var(--circle-end)]

          transition-[left] duration-[650ms]

          ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: VIEW_ALL_BUTTON.circleSize,

          height: VIEW_ALL_BUTTON.circleSize,
        }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: VIEW_ALL_BUTTON.glowSize,

            height: VIEW_ALL_BUTTON.glowSize,

            left: -glowOffset,

            top: -glowOffset,

            background:
              "radial-gradient(circle,rgba(0,94,255,0.60),rgba(0,94,255,0.12) 54%,transparent 75%)",

            opacity: VIEW_ALL_BUTTON.glowOpacity,

            filter: `blur(${VIEW_ALL_BUTTON.glowBlur}px)`,
          }}
        />
      </span>

      {/* TEXT */}

      <span
        className="pointer-events-none absolute top-1/2 z-[2]

          -translate-y-1/2 whitespace-nowrap text-[#27272A]"
        style={{
          ...regularFont,

          left: VIEW_ALL_BUTTON.textInset,

          fontSize: VIEW_ALL_BUTTON.fontSize,

          lineHeight: 1.07,

          letterSpacing: "-0.04em",
        }}
      >
        <span
          className="block transition-transform duration-[650ms]

            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:translate-x-[var(--text-move)]"
        >
          View All
        </span>
      </span>

      {/* CIRCLE */}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-[3]

          flex -translate-y-1/2 items-center justify-center

          rounded-full

          bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)]

          left-[var(--circle-start)]

          group-hover:left-[var(--circle-end)]

          transition-[left] duration-[650ms]

          ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: VIEW_ALL_BUTTON.circleSize,

          height: VIEW_ALL_BUTTON.circleSize,
        }}
      >
        <FiArrowUpRight
          size={px(20)}
          strokeWidth={3.2}
          className="scale-[0.8] text-white opacity-0

            transition-[opacity,transform] duration-[350ms]

            group-hover:scale-100 group-hover:opacity-100"
        />
      </span>
    </Link>
  );
}

function HomeNewsExhibitionTag() {
  return (
    <div
      className="absolute z-10 flex items-center justify-center"
      style={{
        boxSizing: "border-box",

        left: EXHIBITION_TAG.left,

        top: EXHIBITION_TAG.top,

        width: EXHIBITION_TAG.width,

        height: EXHIBITION_TAG.height,

        borderRadius: EXHIBITION_TAG.radius,

        border: `${EXHIBITION_TAG.borderWidth}px solid ${EXHIBITION_TAG.color}`,
      }}
    >
      <span
        style={{
          ...lightFont,

          fontSize: EXHIBITION_TAG.fontSize,

          lineHeight: 1.07,

          letterSpacing: "-0.02em",

          color: EXHIBITION_TAG.color,
        }}
      >
        Exhibition
      </span>
    </div>
  );
}

// Dates use UTC calendar fields so month/year boundaries stay stable in every timezone.

const INITIAL_CALENDAR_DATE = Date.UTC(2027, 9, 22);

const ONE_DAY = 24 * 60 * 60 * 1000;

const CALENDAR_DAY_STYLES = [
  {
    background: "linear-gradient(180deg,#005EFF 0%,#001EA2 100%)",

    color: "#FFFFFF",

    weekdayColor: "#FFFFFF",
  },

  { background: "#FFFFFF", color: "#9CA3AE", weekdayColor: "#454B53" },

  {
    background: "rgba(255,255,255,0.62)",

    color: "#BBCBD8",

    weekdayColor: "#8E9DA9",
  },

  {
    background: "rgba(255,255,255,0.45)",

    color: "#C5D4E0",

    weekdayColor: "#9DADB9",
  },

  {
    background: "rgba(255,255,255,0.31)",

    color: "#CDDAE5",

    weekdayColor: "#A8B8C6",
  },

  {
    background: "rgba(255,255,255,0.19)",

    color: "#D2DDE7",

    weekdayColor: "#B5C3CF",
  },
] as const;

function HomeNewsCalendar({
  firstDate,

  selectedDate,

  onChangeFirstDate,

  onSelectDate,
}: {
  firstDate: number;

  selectedDate: number;

  onChangeFirstDate: (next: number) => void;

  onSelectDate: (next: number) => void;
}) {
  const cal = UPCOMING_EVENTS.calendar;

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",

    timeZone: "UTC",
  });

  return (
    <div
      className="absolute"
      aria-label="Upcoming event dates"
      style={{
        left: cal.left,

        top: cal.top,

        width: cal.width,

        height: cal.height,
      }}
    >
      <button
        type="button"
        aria-label="Previous day"
        onClick={() => onChangeFirstDate(firstDate - ONE_DAY)}
        className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-[#9EB7D0] transition-colors hover:text-[#005EFF]"
        style={{ left: 0, width: px(25), height: px(34) }}
      >
        <FiArrowLeft size={cal.arrowSize} strokeWidth={3.93} />
      </button>

      {Array.from({ length: 6 }, (_, index) => {
        const dateValue = firstDate + index * ONE_DAY;

        const date = new Date(dateValue);

        const selected = selectedDate === dateValue;

        const palette = CALENDAR_DAY_STYLES[index];

        const weekday = weekdayFormatter.format(date);

        return (
          <button
            key={dateValue}
            type="button"
            aria-label={`Select ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}`}
            aria-pressed={selected}
            onClick={() => onSelectDate(dateValue)}
            className="absolute top-0 flex flex-col items-center justify-start rounded-[11px] transition-colors"
            style={{
              left: cal.firstDayLeft + index * (cal.dayWidth + cal.dayGap),

              width: cal.dayWidth,

              height: cal.dayHeight,

              background: palette.background,

              color: palette.color,
            }}
          >
            <span
              style={{
                ...regularFont,

                marginTop: px(14),

                width: px(31),

                height: px(21),

                fontSize: px(18),

                lineHeight: 1,

                letterSpacing: "1px",

                textAlign: "center",

                fontWeight: 540,
              }}
            >
              {date.getUTCDate()}
            </span>

            <span
              style={{
                ...regularFont,

                marginTop: px(11),

                fontSize: px(15),

                lineHeight: 1,

                textAlign: "center",

                color: palette.weekdayColor,
              }}
            >
              {weekday}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next day"
        onClick={() => onChangeFirstDate(firstDate + ONE_DAY)}
        className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-[#9EB7D0] transition-colors hover:text-[#005EFF]"
        style={{ right: 0, width: px(25), height: px(34) }}
      >
        <FiArrowRight size={cal.arrowSize} strokeWidth={3.93} />
      </button>
    </div>
  );
}

const EVENT_CARD_CONTENT = {
  image: {
    left: px(25),

    top: px(29),

    width: px(179),

    height: px(135),

    radius: px(15),
  },

  title: {
    left: px(220),

    top: px(29),

    width: px(175),

    height: px(100),

    fontSize: px(20),
  },

  date: {
    left: px(220),

    top: px(125),

    width: px(86),

    height: px(12),

    fontSize: px(12),
  },
};

const EVENT_HOVER = {
  imageGrow: px(54),

  duration: 520,
};

function UpcomingEventCardContent() {
  return (
    <div className="absolute inset-0">
      {/* IMAGE: EXPANDS TO THE RIGHT ON HOVER */}

      <div
        className="absolute overflow-hidden transition-[width] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/event:!w-[var(--expanded-image-width)]"
        style={{
          left: EVENT_CARD_CONTENT.image.left,

          top: EVENT_CARD_CONTENT.image.top,

          width: EVENT_CARD_CONTENT.image.width,

          height: EVENT_CARD_CONTENT.image.height,

          borderRadius: EVENT_CARD_CONTENT.image.radius,

          ...({
            "--expanded-image-width": `${EVENT_CARD_CONTENT.image.width + EVENT_HOVER.imageGrow}px`,
          } as CSSProperties),
        }}
      >
        <Image
          src="/home/home-news/event.webp"
          alt="IFAT Munich Trade Show"
          fill
          draggable={false}
          sizes={`${EVENT_CARD_CONTENT.image.width + EVENT_HOVER.imageGrow}px`}
          className="select-none object-cover"
        />
      </div>

      {/* TITLE: MOVES RIGHT WHILE ITS AVAILABLE WIDTH NARROWS */}

      <div
        className="absolute transition-[left,width] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/event:!left-[var(--hover-text-left)] group-hover/event:!w-[var(--hover-text-width)]"
        style={{
          left: EVENT_CARD_CONTENT.title.left,

          top: EVENT_CARD_CONTENT.title.top,

          width: EVENT_CARD_CONTENT.title.width,

          height: EVENT_CARD_CONTENT.title.height,

          ...({
            "--hover-text-left": `${EVENT_CARD_CONTENT.title.left + EVENT_HOVER.imageGrow}px`,

            "--hover-text-width": `${EVENT_CARD_CONTENT.title.width - EVENT_HOVER.imageGrow}px`,
          } as CSSProperties),
        }}
      >
        <h3
          className="m-0 max-h-full overflow-hidden text-white [overflow-wrap:anywhere]"
          style={{
            ...regularFont,

            fontSize: EVENT_CARD_CONTENT.title.fontSize,

            fontWeight: 540,

            fontVariationSettings: '"wght" 540, "wdth" 125',

            lineHeight: 1,

            letterSpacing: 0,
          }}
        >
          We Are Participating in the IFAT Munich Trade Show
        </h3>
      </div>

      {/* DATE: SHIFTS WITH THE TEXT, STAYS INSIDE CARD */}

      <span
        className="absolute block whitespace-nowrap transition-[left] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/event:!left-[var(--hover-date-left)]"
        style={{
          ...regularFont,

          left: EVENT_CARD_CONTENT.date.left,

          bottom: px(22),

          color: "#9EB7D0",

          fontSize: EVENT_CARD_CONTENT.date.fontSize,

          lineHeight: 1,

          letterSpacing: 0,

          ...({
            "--hover-date-left": `${EVENT_CARD_CONTENT.date.left + EVENT_HOVER.imageGrow}px`,
          } as CSSProperties),
        }}
      >
        05.05.2027
      </span>
    </div>
  );
}

function HomeNewsEventCards() {
  const cards = UPCOMING_EVENTS.eventCards;

  const rail = useCardDrag(cards.width + cards.gap);

  return (
    <div
      aria-label="Upcoming event cards"
      className="absolute select-none cursor-default touch-pan-y overflow-hidden"
      {...rail.handlers}
      style={{
        left: cards.left,

        top: cards.top,

        // Dragging is clipped to the cards area, never over the calendar.

        width: `calc(100vw - ${SECTION.horizontalOffset + cards.left}px)`,

        height: cards.height,

        touchAction: "pan-y",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${rail.offset}px,0,0)`,

          transition: rail.dragging
            ? "none"
            : "transform 520ms cubic-bezier(0.22,1,0.36,1)",

          willChange: "transform",
        }}
      >
        {Array.from({ length: 2 }, (_, index) => (
          <article
            key={index}
            aria-label={`Event ${index + 1}: IFAT Munich Trade Show`}
            className="group/event absolute overflow-hidden"
            style={{
              left: index * (cards.width + cards.gap),

              top: 0,

              width: cards.width,

              height: cards.height,

              borderRadius: cards.radius,

              background: cards.background,

              isolation: "isolate",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/event:opacity-100 motion-reduce:transition-none"
              style={{
                background: `radial-gradient(ellipse 51% 34% at 35% 88%, rgba(0,94,255,0.42) 0%, rgba(0,83,230,0.19) 38%, rgba(0,83,230,0) 100%), #292A2D`,
              }}
              aria-hidden="true"
            />

            <div
              className={`absolute inset-0 ${index === 1 && rail.offset > -(cards.width + cards.gap) / 2 ? "blur-[5px] transition-[filter] duration-[520ms] group-hover/event:blur-none" : "transition-[filter] duration-[520ms]"}`}
            >
              <UpcomingEventCardContent />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function HomeNewsUpcomingHeader() {
  const [firstDate, setFirstDate] = useState(INITIAL_CALENDAR_DATE);

  const [selectedDate, setSelectedDate] = useState(INITIAL_CALENDAR_DATE);

  const firstVisible = new Date(firstDate);

  const displayMonth = new Intl.DateTimeFormat("en-US", {
    month: "short",

    timeZone: "UTC",
  }).format(firstVisible);

  const displayYear = firstVisible.getUTCFullYear();

  return (
    <div className="absolute" style={{ top: UPCOMING_EVENTS.top, left: 0 }}>
      <h2
        className="absolute m-0"
        style={{
          ...regularFont,

          left: UPCOMING_EVENTS.title.left,

          top: 0,

          width: UPCOMING_EVENTS.title.width,

          height: UPCOMING_EVENTS.title.height,

          fontSize: UPCOMING_EVENTS.title.fontSize,

          lineHeight: 1,

          letterSpacing: 0,

          color: "#0D5792",
        }}
      >
        <span className="block whitespace-nowrap">Upcoming Events</span>

        <span className="block whitespace-nowrap">Discover Now</span>
      </h2>

      <span
        className="absolute block whitespace-nowrap"
        style={{
          ...regularFont,

          left: UPCOMING_EVENTS.month.left,

          top: UPCOMING_EVENTS.month.top,

          width: UPCOMING_EVENTS.month.width,

          fontSize: UPCOMING_EVENTS.month.fontSize,

          lineHeight: 1,

          letterSpacing: 0,

          color: "#005EFF",
        }}
      >
        {displayMonth}
      </span>

      <span
        aria-hidden="true"
        className="absolute block"
        style={{
          left: UPCOMING_EVENTS.divider.left,

          top: UPCOMING_EVENTS.divider.top,

          width: UPCOMING_EVENTS.divider.width,

          height: UPCOMING_EVENTS.divider.height,

          backgroundColor: "#005EFF",
        }}
      />

      <span
        className="absolute block whitespace-nowrap"
        style={{
          ...regularFont,

          left: UPCOMING_EVENTS.year.left,

          top: UPCOMING_EVENTS.year.top,

          width: UPCOMING_EVENTS.year.width,

          fontSize: UPCOMING_EVENTS.year.fontSize,

          lineHeight: 1,

          letterSpacing: 0,

          color: "#005EFF",
        }}
      >
        {displayYear}
      </span>

      <HomeNewsEventCards />

      <HomeNewsCalendar
        firstDate={firstDate}
        selectedDate={selectedDate}
        onChangeFirstDate={(next) => {
          setFirstDate(next);

          setSelectedDate(next);
        }}
        onSelectDate={(next) => {
          setFirstDate(next);

          setSelectedDate(next);
        }}
      />
    </div>
  );
}

function DesktopHomeNews() {
  const newsRail = useCardDrag(
    NEWS_CARD.width +
      (SECOND_NEWS_CARD.left - NEWS_CARD.left - NEWS_CARD.width),
  );

  return (
    <section
      id="home-news"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: SECTION.minHeight,

        backgroundColor: "#D1E8F6",

        backgroundImage: SHARED_BACKGROUND,
      }}
    >
      {/* Shift all section content together; crop the trailing card at viewport edge. */}

      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${SECTION.horizontalOffset}px)` }}
      >
        <HomeNewsHeading />

        <HomeNewsDescription />

        <HomeNewsFeaturedInformation />

        <HomeNewsViewAllButton />

        <HomeNewsExhibitionTag />

        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          <div
            {...newsRail.handlers}
            className="absolute overflow-hidden select-none cursor-grab active:cursor-grabbing"
            aria-label="Drag latest news cards horizontally"
            style={{
              left: NEWS_CARD.left,

              top: NEWS_CARD.top,

              // Crop at the news rail's left boundary, not at the page edge.

              width: `calc(100vw - ${SECTION.horizontalOffset + NEWS_CARD.left}px)`,

              height: NEWS_CARD.height,

              pointerEvents: "auto",

              touchAction: "pan-y",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate3d(${newsRail.offset}px,0,0)`,

                transition: newsRail.dragging
                  ? "none"
                  : "transform 520ms cubic-bezier(0.22,1,0.36,1)",

                willChange: "transform",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ left: -NEWS_CARD.left, top: -NEWS_CARD.top }}
              >
                <HomeNewsFirstCard />

                <HomeNewsSecondCard />
              </div>
            </div>
          </div>
        </div>

        <HomeNewsUpcomingHeader />
      </div>

      {/* Page-level progressive blur: independent of cards, images and dragging. */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-30"
        style={{
          top: NEWS_CARD.top,

          bottom: "auto",

          left: SECTION.horizontalOffset + SECOND_NEWS_CARD.left + px(120),

          right: 0,

          height: NEWS_CARD.height,

          backdropFilter: "blur(18px)",

          WebkitBackdropFilter: "blur(18px)",

          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.65) 42%, black 72%)",

          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.65) 42%, black 72%)",
        }}
      />
    </section>
  );
}

export default function HomeNews() {
  const compact = useHomeCompact();
  return compact ? <MobileNews items={NEWS_ITEMS} /> : <DesktopHomeNews />;
}
