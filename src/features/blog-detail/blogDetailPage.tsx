"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useId, useRef, useState, type ReactNode } from "react";

import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";

// ============================================================
// FRAMER MOTION CONFIGURATION
// ============================================================

type RevealDirection = "up" | "left" | "right";

type RevealCustom = {
  direction?: RevealDirection;
  reduced?: boolean;
  distance?: number;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const inView = {
  once: false,
  amount: 0.24,
  margin: "0px 0px -10% 0px",
} as const;

const revealVariants: Variants = {
  hidden: ({
    direction = "up",
    reduced = false,
    distance = 52,
  }: RevealCustom) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -distance * 0.75
        : direction === "right"
          ? distance * 0.75
          : 0,
    y: reduced ? 0 : direction === "up" ? distance : 20,
    filter: reduced ? "blur(0px)" : "blur(8px)",
  }),

  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
  },
};

function reveal(
  direction: RevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.24,
  distance = 52,
) {
  return {
    variants: revealVariants,
    custom: { direction, reduced, distance },
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { ...inView, amount },
    transition: {
      duration: reduced ? 0 : 1.08,
      delay: reduced ? 0 : delay,
      ease: EASE,
    },
  };
}

// ============================================================
// HERO TITLE MOTION
// ============================================================

const heroVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : 48,
    filter: reduced ? "blur(0px)" : "blur(8px)",
  }),

  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: reduced ? 0 : 0.88,
      ease: EASE,
    },
  }),
};

const titleWordVariants: Variants = {
  hidden: (custom: { reduced: boolean; index: number }) => ({
    opacity: custom.reduced ? 1 : 0,
    y: custom.reduced ? 0 : 42,
    rotateX: custom.reduced ? 0 : -16,
    filter: custom.reduced ? "blur(0px)" : "blur(6px)",
  }),

  visible: (custom: { reduced: boolean; index: number }) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.reduced ? 0 : 1.05,
      delay: custom.reduced ? 0 : 0.17 + custom.index * 0.095,
      ease: EASE,
    },
  }),
};

// ============================================================
// METADATA MOTION
// ============================================================

const staggerGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const metaItemVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : 30,
    filter: reduced ? "blur(0px)" : "blur(5px)",
  }),

  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: reduced ? 0 : 0.74,
      ease: EASE,
    },
  }),
};

// ============================================================
// ARTICLE CONTENT MOTION
// ============================================================

const articleVariants: Variants = {
  hidden: ({ direction = "up", reduced = false }: RevealCustom) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -44
        : direction === "right"
          ? 44
          : 0,
    y: reduced ? 0 : 38,
    filter: reduced ? "blur(0px)" : "blur(8px)",
  }),

  visible: (custom: RevealCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.reduced ? 0 : 1.05,
      ease: EASE,
      delayChildren: custom.reduced ? 0 : 0.08,
      staggerChildren: custom.reduced ? 0 : 0.17,
    },
  }),
};

const articleChildVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : 24,
  }),

  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0 : 0.75,
      ease: EASE,
    },
  }),
};

// ============================================================
// TABLE OF CONTENTS MOTION
// ============================================================

const tocListVariants: Variants = {
  hidden: {},

  visible: (reduced: boolean) => ({
    transition: {
      staggerChildren: reduced ? 0 : 0.075,
      delayChildren: reduced ? 0 : 0.09,
    },
  }),
};

const tocItemVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 1 : 0,
    x: reduced ? 0 : 36,
    y: reduced ? 0 : 12,
  }),

  visible: (reduced: boolean) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: reduced ? 0 : 0.72,
      ease: EASE,
    },
  }),
};

// ============================================================
// RELATED ARTICLE CARD MOTION
// ============================================================

const cardVariants: Variants = {
  hidden: ({ reduced = false }: { reduced?: boolean; index?: number }) => ({
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : 68,
    scale: reduced ? 1 : 0.95,
    rotate: reduced ? 0 : 1.3,
    filter: reduced ? "blur(0px)" : "blur(9px)",
  }),

  visible: ({
    reduced = false,
    index = 0,
  }: {
    reduced?: boolean;
    index?: number;
  }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: reduced ? 0 : 1.12,
      delay: reduced ? 0 : index * 0.13,
      ease: EASE,
      staggerChildren: reduced ? 0 : 0.12,
      delayChildren: reduced ? 0 : 0.11,
    },
  }),
};

const cardChildVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : 25,
  }),

  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0 : 0.8,
      ease: EASE,
    },
  }),
};

// ============================================================
// TYPES
// ============================================================

type BlogPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  href?: string;
};

// ============================================================
// VIEW ALL BUTTON - EXISTING APPROVED DESIGN
// ============================================================

const viewAllClass = `
  group/blog-action relative inline-flex
  h-[43px] min-h-[43px] w-[140px]
  shrink-0 items-center overflow-hidden
  rounded-[19px]
  border-[0.5px] border-[#9eb7d0]
  bg-white/20 text-left text-[#252525]
  backdrop-blur-[11px]
  transition-[background-color] duration-[350ms]
  hover:bg-[#f7f7f7]
  focus-visible:bg-[#f7f7f7]
  focus-visible:outline-2
  focus-visible:outline-offset-4
  focus-visible:outline-[#005eff]
  motion-reduce:transition-none
`;

function ViewAllButton({ href }: { href?: string }) {
  const contents = (
    <>
      <span
        className="
          absolute left-[14px] top-1/2 z-[2]
          -translate-y-1/2 whitespace-nowrap
          text-[15px]
          transition-transform duration-[650ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover/blog-action:translate-x-[36px]
          group-focus-visible/blog-action:translate-x-[36px]
          motion-reduce:transition-none
        "
        style={{
          fontFamily: "var(--font-sf-pro), sans-serif",
          fontWeight: 410,
          fontVariationSettings: '"wght" 410, "wdth" 125',
          lineHeight: 1.07,
          letterSpacing: "-0.04em",
        }}
      >
        View All
      </span>

      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute
          left-[calc(100%_-_38px)] top-1/2 z-[3]
          flex size-[33px] -translate-y-1/2
          items-center justify-center rounded-full
          bg-[linear-gradient(180deg,#005eff_0%,#001ea2_100%)]
          shadow-[0_0_15px_rgba(0,94,255,0.25)]
          transition-[left] duration-[650ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover/blog-action:left-[5px]
          group-focus-visible/blog-action:left-[5px]
          motion-reduce:transition-none
        "
      >
        <FiArrowUpRight
          size={20}
          strokeWidth={3.2}
          className="
            scale-[0.8] text-white opacity-0
            transition-[opacity,transform] duration-[350ms]
            group-hover/blog-action:scale-100
            group-hover/blog-action:opacity-100
            group-focus-visible/blog-action:scale-100
            group-focus-visible/blog-action:opacity-100
            motion-reduce:transition-none
          "
        />
      </span>
    </>
  );

  return href ? (
    <Link href={href} className={viewAllClass}>
      {contents}
    </Link>
  ) : (
    <button
      type="button"
      disabled
      aria-label="View All — blog details are not available yet"
      className={viewAllClass}
    >
      {contents}
    </button>
  );
}

// ============================================================
// RELATED ARTICLES CAROUSEL
// ============================================================

function RelatedArticlesCarousel({ children }: { children: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const [active, setActive] = useState(0);

  function updateActive() {
    const element = track.current;
    if (!element) return;

    const first = element.children[0] as HTMLElement | undefined;

    if (!first) return;

    const positions = Array.from(
      element.children,
      (child) => (child as HTMLElement).offsetLeft - first.offsetLeft,
    );

    const nearest = positions.reduce(
      (best, position, index) =>
        Math.abs(position - element.scrollLeft) <
        Math.abs(positions[best] - element.scrollLeft)
          ? index
          : best,
      0,
    );

    setActive(nearest);
  }

  function showArticle(index: number) {
    const element = track.current;

    const first = element?.children[0] as HTMLElement | undefined;

    const selected = element?.children[index] as HTMLElement | undefined;

    if (!element || !first || !selected) return;

    element.scrollTo({
      left: selected.offsetLeft - first.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <>
      <div
        ref={track}
        id={id}
        onScroll={updateActive}
        aria-label="Related articles"
        tabIndex={0}
        className="
          relative -mr-8 flex snap-x snap-mandatory
          items-stretch gap-4 overflow-x-auto pr-12 pb-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          focus-visible:outline-2
          focus-visible:outline-[#005eff]
          md:mr-0 md:grid md:grid-cols-2
          md:gap-5 md:overflow-visible md:p-0
          min-[75rem]:grid-cols-3
        "
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="
              flex w-[calc(100vw-80px)] shrink-0
              snap-start md:w-auto [&>article]:w-full
            "
          >
            {child}
          </div>
        ))}
      </div>

      <div
        className="mt-5 flex justify-center gap-1 md:hidden"
        role="group"
        aria-label="Choose related article"
      >
        {children.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-controls={id}
            aria-label={`Show related article ${index + 1}`}
            aria-pressed={active === index}
            onClick={() => showArticle(index)}
            className="
              flex h-8 min-w-6 cursor-pointer
              items-center justify-center rounded
              focus-visible:outline-2
              focus-visible:outline-[#005eff]
            "
          >
            <span
              className={`
                block h-1.5 rounded-full
                transition-[width,background-color]
                duration-300 motion-reduce:transition-none
                ${active === index ? "w-8 bg-[#9eb7d0]" : "w-2.5 bg-[#f7f7f7]"}
              `}
            />
          </button>
        ))}
      </div>
    </>
  );
}

// ============================================================
// BLOG CONTENT
// ============================================================

const title =
  "Corrosion-Resistant Pump Materials and Applications: A Comprehensive Guide";

const titleLines = [
  [["Corrosion-", "Resistant"], ["Pump"], ["Materials"]],
  [["and"], ["Applications:"], ["A"], ["Comprehensive"]],
  [["Guide"]],
];

const titleRevealOrder = [
  "Corrosion-",
  "Resistant",
  "Pump",
  "Materials",
  "and",
  "Applications:",
  "A",
  "Comprehensive",
  "Guide",
];

const description =
  "Corrosion is a common issue in industrial processes that can significantly reduce the lifespan of equipment. Pumps, particularly those used in liquid transport processes, are among the most susceptible equipment to corrosion. For this reason, pumps made from corrosion-resistant";

const sections = [
  {
    id: "comprehensive-guide",
    title: "Corrosion-Resistant Pump Materials and Applications:",
    content: (
      <p>
        A Comprehensive Guide In this blog post, we will thoroughly examine
        corrosion-resistant pump materials and the different applications where
        these materials are used.
      </p>
    ),
  },
  {
    id: "understanding-corrosion",
    title: "What is Corrosion and Why is it Important?",
    content: (
      <>
        <p>
          Corrosion is a common issue in industrial processes that can
          significantly reduce the lifespan of equipment. Pumps, particularly
          those used in liquid transport processes, are among the most
          susceptible equipment to corrosion. For this reason, pumps made from
          corrosion-resistant materials are preferred.
        </p>

        <p>
          Corrosion is the deterioration of a material by interacting with its
          environment. On metal surfaces, it usually manifests as rusting or
          wear by reacting with oxygen and water. Corrosion not only shortens
          the lifespan of equipment but can also lead to inefficiency in
          production processes and even safety risks.
        </p>
      </>
    ),
  },
  {
    id: "pump-materials",
    title: "Corrosion-Resistant Pump Materials",
    content: (
      <>
        <p>
          Various materials with different properties are used in the
          manufacturing of corrosion-resistant pumps. The most commonly used
          materials are:
        </p>

        <ul>
          <li>
            Stainless Steel: It is one of the most frequently used materials due
            to its high resistance to corrosion. Its different alloys make it
            suitable for various corrosive environments.
          </li>

          <li>
            Cast Iron: An economical material that performs well in acidic
            environments.
          </li>

          <li>
            Bronze: Ideal for use in environments such as seawater and
            saltwater.
          </li>

          <li>
            Plastics: Plastics such as PTFE and PVC show high resistance against
            abrasive chemicals.
          </li>

          <li>
            Ceramics: A special material used in high-temperature and abrasive
            environments.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "industrial-applications",
    title: "Corrosion-Resistant Pump Applications in Different Sectors",
    content: (
      <ul>
        <li>
          Energy Sector: Stainless steel and special alloy pumps are used in
          harsh conditions such as seawater cooling systems and acid rain.
        </li>

        <li>
          Paper and Cellulose Industry: Stainless steel and special alloy pumps
          are used for transporting acidic and hot liquids.
        </li>
      </ul>
    ),
  },
  {
    id: "corrosion-resistance-methods",
    title: "Methods to Increase Corrosion Resistance",
    content: (
      <>
        <ul>
          <li>
            Protection Anodes: Corrosion can be prevented by electrically
            connecting the pump to an anode.
          </li>

          <li>
            Material Selection: Choosing the appropriate material based on the
            characteristics of the operating environment is of great importance.
          </li>

          <li>
            Regular Maintenance: Regular cleaning and lubrication of the pumps
            extend their lifespan.
          </li>
        </ul>

        <p>
          Proper material selection and regular maintenance extend the lifespan
          of pumps and reduce operating costs. In this blog post, we have tried
          to provide general information about corrosion and corrosion-resistant
          pump materials. It is recommended to consult an expert for more
          detailed information.
        </p>
      </>
    ),
  },
];

// ============================================================
// RELATED ARTICLES DATA
// ============================================================

const relatedArticles: BlogPost[] = Array.from({ length: 3 }, (_, index) => ({
  id: `related-corrosion-${index + 1}`,
  title,
  description,
  date: "2025-06-10",
  image: "/blog-detail/news1.jpg",
  href: "/blog-detail",
}));

// ============================================================
// RELATED ARTICLE CARD
// ============================================================

function RelatedArticle({ post, index }: { post: BlogPost; index: number }) {
  const reduced = useReducedMotion() ?? false;

  const [year, month, day] = post.date.split("-");

  return (
    <motion.article
      variants={cardVariants}
      custom={{ reduced, index }}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...inView, amount: 0.13 }}
      aria-labelledby={post.id}
      className="
        group flex min-w-0 flex-col
        rounded-[30px] bg-[#f7f7f7] p-4
        transition-colors duration-300
        hover:bg-[#f1f7ff]
        focus-within:bg-[#f1f7ff]
        md:p-5 min-[75rem]:min-h-[558px]
        motion-reduce:transition-none
      "
    >
      <motion.div
        variants={cardChildVariants}
        custom={reduced}
        className="
          relative mb-7 aspect-[350/227] w-full
          md:mb-9
        "
      >
        <div
          className="
            relative h-full overflow-hidden
            rounded-[20px] bg-[#ededed]
          "
        >
          <Image
            src={post.image}
            alt="Sempa pumps at an industrial exhibition"
            fill
            sizes="
              (min-width: 1200px) 347px,
              (min-width: 768px) 44vw,
              88vw
            "
            className="
              object-cover grayscale
              transition-transform duration-300
              group-hover:scale-[1.015]
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          />
        </div>

        <Image
          src="/blog-detail/sempa-icon.png"
          alt="Sempa"
          width={48}
          height={32}
          className="
            absolute -bottom-2 left-0
            h-auto w-12
          "
        />
      </motion.div>

      <motion.h3
        variants={cardChildVariants}
        custom={reduced}
        id={post.id}
        className="
          max-w-[260px] text-[15px] leading-[1.12]
          [font-weight:540]
          [font-variation-settings:'wght'_540,'wdth'_125]
        "
      >
        {post.title}
      </motion.h3>

      <motion.p
        variants={cardChildVariants}
        custom={reduced}
        className="mt-6 text-[12px] leading-[1.12]"
      >
        {post.description}
      </motion.p>

      <motion.div
        variants={cardChildVariants}
        custom={reduced}
        className="mt-auto pt-6"
      >
        <time
          dateTime={post.date}
          className="
            mb-5 block text-[12px] leading-none
            text-[#9eb7d0]
          "
        >
          {day}/{month}/{year}
        </time>

        <ViewAllButton href={post.href} />
      </motion.div>
    </motion.article>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function BlogDetailPage() {
  const reduced = useReducedMotion() ?? false;

  return (
    <main
      data-header-underlay
      className="
        -mt-[var(--site-header-height,97px)]
        w-full overflow-x-clip
        bg-[radial-gradient(ellipse_at_88%_8%,#c9e3ff80,transparent_65%),radial-gradient(ellipse_at_20%_65%,#d6ebff70,transparent_68%),linear-gradient(110deg,#eaf5ff,#ddeeff_58%,#d0e7ff)]
        px-8 pt-8 pb-28
        font-sans text-[#27272a]
        [font-weight:410]
        [font-stretch:125%]
        [font-variation-settings:'wght'_410,'wdth'_125]
        tracking-[-0.04em]
        md:pt-20 lg:pb-36
      "
    >
      {/* HEADER SPACER */}
      <div
        data-header-spacer
        aria-hidden="true"
        className="
          h-[var(--site-header-height,97px)]
          shrink-0
        "
      />

      <div className="mx-auto w-full max-w-[1200px]">
        {/* ===================================================
            HERO TITLE
        =================================================== */}

        <motion.header
          variants={heroVariants}
          custom={reduced}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="mb-12 md:mb-20"
        >
          <h1
            aria-label={title}
            className="
              mx-auto max-w-[300px]
              text-center
              text-[clamp(27px,7.6vw,32px)]
              leading-none font-[410]
              text-[#0d5792]
              md:max-w-[960px]
              md:text-[clamp(28px,3.5vw,50px)]
            "
          >
            {titleLines.map((line, lineIndex) => (
              <span key={lineIndex} aria-hidden="true" className="md:block">
                {lineIndex > 0 && " "}

                {line.map((word, wordIndex) => (
                  <span key={word[0]}>
                    {wordIndex > 0 && " "}

                    <span className="whitespace-nowrap">
                      {word.map((part) => (
                        <motion.span
                          key={part}
                          variants={titleWordVariants}
                          custom={{
                            reduced,
                            index: titleRevealOrder.indexOf(part),
                          }}
                          className="inline-block"
                          style={{
                            transformOrigin: "50% 100%",
                            transformPerspective: 900,
                          }}
                        >
                          {part}
                        </motion.span>
                      ))}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </motion.header>

        {/* ===================================================
            DATE / CATEGORY / VIEWS
        =================================================== */}

        <motion.div
          variants={staggerGroup}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...inView, amount: 0.4 }}
          className="
            mb-12 flex flex-col items-center
            justify-between gap-4
            text-[13px] leading-none
            md:mb-[52px] md:flex-row
            md:flex-wrap md:text-[15px]
          "
        >
          <motion.div
            variants={staggerGroup}
            className="flex flex-wrap justify-center gap-0.5"
          >
            <motion.time
              variants={metaItemVariants}
              custom={reduced}
              dateTime="2024-11-19"
              className="
                rounded-md bg-[#f7f7f7]
                px-3 py-1 md:px-4
              "
            >
              19/11/2024
            </motion.time>

            <motion.span
              variants={metaItemVariants}
              custom={reduced}
              className="
                rounded-md bg-[#f7f7f7]
                px-3 py-1 text-[#0d5792]
                md:px-4
              "
            >
              #PumpTechnologies
            </motion.span>
          </motion.div>

          <motion.span
            variants={metaItemVariants}
            custom={reduced}
            className="text-[#0d5792] md:ml-auto"
          >
            215 Görüntüleme
          </motion.span>
        </motion.div>

        {/* ===================================================
            ARTICLE + TABLE OF CONTENTS
        =================================================== */}

        <div
          className="
            grid min-w-0 items-start gap-8
            lg:grid-cols-[minmax(0,790fr)_minmax(0,330fr)]
            lg:gap-12 min-[90rem]:gap-20
          "
        >
          {/* ARTICLE */}
          <article
            aria-label={title}
            className="
              min-w-0 rounded-[30px]
              bg-[#f7f7f7] px-8 py-8
              text-[14px] leading-[1.05]
              md:text-[15px] md:leading-none
              [&_ul]:mt-3
              [&_ul]:list-disc
              [&_ul]:pl-5
              [&_ul+p]:mt-8
            "
          >
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                variants={articleVariants}
                custom={{
                  direction:
                    index % 3 === 0 ? "up" : index % 3 === 1 ? "left" : "right",
                  reduced,
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  ...inView,
                  amount: 0.11,
                }}
                className="
                  mb-6 scroll-mt-36
                  last:mb-0
                "
              >
                <motion.h2
                  variants={articleChildVariants}
                  custom={reduced}
                  id={`${section.id}-heading`}
                  className="
                    mb-3 text-[26px] leading-[1.04]
                    [font-weight:540]
                    [font-variation-settings:'wght'_540,'wdth'_125]
                    md:text-[clamp(21px,2vw,25px)]
                    md:leading-[1.12]
                  "
                >
                  {section.id === "comprehensive-guide" ? (
                    <>
                      Corrosion-Resistant Pump Materials and
                      <br />
                      Applications:
                    </>
                  ) : (
                    section.title
                  )}
                </motion.h2>

                <motion.div variants={articleChildVariants} custom={reduced}>
                  {section.content}
                </motion.div>
              </motion.section>
            ))}
          </article>

          {/* TABLE OF CONTENTS */}
          <nav
            aria-labelledby="table-of-contents"
            className="
              hidden min-w-0 md:block
              lg:sticky lg:top-32
            "
          >
            <motion.div
              variants={staggerGroup}
              initial="hidden"
              whileInView="visible"
              viewport={{
                ...inView,
                amount: 0.18,
              }}
            >
              <motion.h2
                variants={tocItemVariants}
                custom={reduced}
                id="table-of-contents"
                className="
                  w-full rounded-md
                  bg-[#f7f7f7] px-4 py-1.5
                  text-[15px] leading-none
                "
              >
                Table of Contents
              </motion.h2>

              <motion.ol variants={tocListVariants} custom={reduced}>
                {sections.map((section, index) => (
                  <motion.li
                    key={section.id}
                    variants={tocItemVariants}
                    custom={reduced}
                    className="
                      border-b border-[#9eb7d0]/45
                    "
                  >
                    <a
                      href={`#${section.id}`}
                      className="
                        flex min-h-20 items-center
                        gap-4 rounded-lg px-4 py-4
                        transition-colors duration-200
                        hover:bg-white/35
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-[#005eff]
                        md:min-h-[96px]
                        motion-reduce:transition-none
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          shrink-0 text-[25px]
                          leading-none text-[#18181b]
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="
                          text-[15px] leading-[1.15]
                        "
                      >
                        {section.title.replace(/:$/, "")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>
          </nav>
        </div>

        {/* ===================================================
            RELATED ARTICLES
        =================================================== */}

        <section aria-labelledby="related-articles" className="mt-20 md:mt-24">
          <motion.h2
            {...reveal("left", 0.04, reduced, 0.16, 42)}
            id="related-articles"
            className="
              mb-9 pl-5
              text-[15px] leading-none
              font-[410] text-[#005eff]
              md:mb-11 md:pl-0
            "
          >
            RELATED ARTICLES
          </motion.h2>

          <RelatedArticlesCarousel>
            {relatedArticles.map((post, index) => (
              <RelatedArticle key={post.id} post={post} index={index} />
            ))}
          </RelatedArticlesCarousel>
        </section>

        {/* ===================================================
            NEWSLETTER
        =================================================== */}

        <motion.div
          {...reveal("up", 0, reduced, 0.13, 44)}
          className="
            mt-24
            [--newsletter-spacing-unit:1.5px]
            md:mt-28
          "
        >
          <NewsletterSubscription />
        </motion.div>
      </div>
    </main>
  );
}
