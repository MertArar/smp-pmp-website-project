"use client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
  page: "tw-blog-page [--blog-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] w-full [padding:calc(60_*_var(--blog-unit))_24px_calc(115_*_var(--blog-unit))] [background:radial-gradient(ellipse_at_88%_8%,_#c9e3ff80,_transparent_65%),_radial-gradient(ellipse_at_20%_65%,_#d6ebff70,_transparent_68%),_linear-gradient(110deg,_#eaf5ff,_#ddeeff_58%,_#d0e7ff)] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-0.04em] [color:#27272a]! [@media(width<1200px)]:[--blog-unit:1px] [@media(width<768px)]:[html:has(&)]:[overflow-x:clip] [@media(width<768px)]:[body:has(&)]:[overflow-x:clip] [@media(width<768px)]:[padding:40px_20px_80px]",
  inner:
    "tw-blog-inner w-full [max-width:calc(1200_*_var(--blog-unit))] [margin-inline:auto]",
  statistics:
    "tw-blog-statistics flex items-center justify-between [gap:calc(35_*_var(--blog-unit))] [width:calc(541_*_var(--blog-unit))] max-w-full [min-height:calc(58_*_var(--blog-unit))] [margin:0_auto] [padding:calc(11_*_var(--blog-unit))_calc(25_*_var(--blog-unit))] [border-radius:calc(15_*_var(--blog-unit))] [background:#f7f7f7] [@media(width<768px)]:justify-between [@media(width<768px)]:[gap:10px] [@media(width<768px)]:[padding:14px_12px]",
  statistic:
    "tw-blog-statistic flex items-center [gap:calc(10_*_var(--blog-unit))] whitespace-nowrap [&_dd]:[order:-1] [&_dd]:m-0 [&_dd]:[font-size:calc(36_*_var(--blog-unit))]! [&_dd]:[line-height:1]! [&_dt]:[font-size:calc(15_*_var(--blog-unit))]! [&_dt]:[line-height:1]! [&_dt]:[color:#005eff]! [@media(width<768px)]:flex-col [@media(width<768px)]:items-center [@media(width<768px)]:[gap:6px] [@media(width<768px)]:[&_dd]:[font-size:28px]! [@media(width<768px)]:[&_dt]:[font-size:12px]!",
  introduction:
    "tw-blog-introduction [margin-top:calc(90_*_var(--blog-unit))] text-center [&_h1]:m-0 [&_h1]:[font-size:calc(50_*_var(--blog-unit))]! [&_h1]:[font-weight:410] [&_h1]:[line-height:1]! [&_h1]:[color:#0d5792]! [&_>_p]:[max-width:calc(870_*_var(--blog-unit))] [&_>_p]:[margin:calc(25_*_var(--blog-unit))_auto_0] [&_>_p]:[font-size:calc(15_*_var(--blog-unit))]! [&_>_p]:[line-height:1]! [@media(width<1200px)]:[&_h1]:[font-size:clamp(32px,_4.2vw,_50px)]! [@media(width<1200px)]:[&_>_p]:[line-height:1.2]! [@media(width<768px)]:[margin-top:56px] [@media(width<768px)]:[&_h1]:[font-size:clamp(28px,_8vw,_42px)]! [@media(width<768px)]:[&_h1]:[line-height:1.07]! [@media(width<768px)]:[&_>_p]:[margin-top:22px] [@media(width<768px)]:[&_>_p]:[font-size:14px]!",
  hashtags:
    "tw-blog-hashtags flex flex-wrap justify-center [gap:calc(20_*_var(--blog-unit))] [margin:calc(32_*_var(--blog-unit))_0_0] p-0 list-none [font-size:calc(15_*_var(--blog-unit))]! [line-height:1.12]! [@media(width<768px)]:[gap:12px_16px] [@media(width<768px)]:[font-size:12px]! [@media(width<768px)]:[margin-top:24px] [@media(width<768px)]:[overflow-wrap:anywhere]",
  posts:
    "tw-blog-posts w-full [max-width:1200px] [margin-inline:auto] grid [gap:calc(20_*_var(--blog-unit))] [margin-top:calc(48_*_var(--blog-unit))] [@media(width<768px)]:[max-width:calc(100%_-_24px)] [@media(width<768px)]:[margin-top:32px] [@media(width<768px)]:[gap:24px]",
  card: "tw-blog-card flex items-start [gap:44px] min-w-0 [min-height:249px] [padding:12px] [border-radius:30px] [background:#f7f7f7] [@media(width<1200px)]:[gap:24px] [@media(width<768px)]:flex-col [@media(width<768px)]:items-stretch [@media(width<768px)]:[gap:32px] [@media(width<768px)]:min-h-0 [@media(width<768px)]:[padding:32px_18px_22px] [@media(width<768px)]:[&.tw-blog-mobileHidden]:hidden",
  cardMedia:
    "tw-blog-cardMedia relative [flex:0_0_350px] shrink-0 [width:350px] [height:225px] [@media(width<768px)]:flex-none [@media(width<768px)]:w-full [@media(width<768px)]:h-auto [@media(width<768px)]:[aspect-ratio:350_/_225]",
  photoFrame:
    "tw-blog-photoFrame relative w-full h-full overflow-hidden [border-radius:30px] [background:#ededed]",
  photo: "tw-blog-photo object-cover object-center [filter:grayscale(1)]",
  logo: "tw-blog-logo pointer-events-none absolute z-10 [left:0] [bottom:-8px] [width:46px] h-auto [@media(width<768px)]:[left:0] [@media(width<768px)]:[bottom:-8px]",
  cardContent:
    "tw-blog-cardContent flex flex-1 min-w-0 flex-col items-start [gap:16px] [padding:8px_12px_8px_0] [&_h2]:m-0 [&_h2]:[font-size:15px]! [&_h2]:[font-weight:540] [&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_h2]:[line-height:1.3]! [&_time]:[font-size:12px]! [&_time]:[line-height:1.2]! [&_time]:[color:#9eb7d0]! [@media(width<768px)]:[gap:24px] [@media(width<768px)]:p-0 [@media(width<768px)]:[&_h2]:[font-size:16px]! [@media(width<768px)]:[&_h2]:[line-height:1.07]!",
  excerpt:
    "tw-blog-excerpt [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden m-0 [font-size:12px]! [line-height:1.4]! [@media(width<768px)]:block [@media(width<768px)]:[-webkit-line-clamp:unset] [@media(width<768px)]:overflow-visible [@media(width<768px)]:[font-size:13px]! [@media(width<768px)]:[line-height:1.12]!",
  newsletter:
    "tw-blog-newsletter [--newsletter-spacing-unit:1.5px] w-full [max-width:1200px] [margin-inline:auto] [@media(width<768px)]:[padding-top:16px]",
  loadMore:
    "tw-blog-loadMore hidden [@media(width<768px)]:flex [@media(width<768px)]:[width:170px] [@media(width<768px)]:[margin:40px_auto_0]",
  mobileStatus: "tw-blog-mobileStatus hidden [@media(width<768px)]:block",
  desktopBreak: "tw-blog-desktopBreak [@media(width<768px)]:hidden",
  mobileHidden: "tw-blog-mobileHidden",
} as const;
// Same independent, repeatable scroll reveal pattern used on AboutUsPage.
// Animating transform + opacity keeps the existing layout and measurements intact.
type RevealDirection = "up" | "left" | "right";

const revealVariants: Variants = {
  hidden: ({
    direction = "up",
    reduced = false,
  }: {
    direction?: RevealDirection;
    reduced?: boolean;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -34
        : direction === "right"
          ? 34
          : 0,
    y: reduced ? 0 : direction === "up" ? 34 : 0,
  }),
  visible: { opacity: 1, x: 0, y: 0 },
};

function reveal(
  direction: RevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.28,
) {
  return {
    variants: revealVariants,
    custom: { direction, reduced },
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.95,
      delay: reduced ? 0 : delay,
      ease: [0.25, 0.85, 0.3, 1] as [number, number, number, number],
    },
  };
}

// Based on SmartPump.tsx: frosted pill, 650ms circular slide and text slide.
// The orb remains at the right end until hover or keyboard focus.
const blogActionClass =
  "group/blog-action relative inline-flex h-[43px] min-h-[43px] w-[140px] shrink-0 items-center overflow-hidden rounded-[19px] border-[0.5px] border-[#9eb7d0] bg-white/20 text-left text-[#252525] backdrop-blur-[11px] transition-[background-color] duration-[350ms] hover:bg-[#f7f7f7] focus-visible:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] motion-reduce:transition-none";

function BlogActionContents({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        className="absolute left-[14px] top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap text-[15px] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/blog-action:translate-x-[36px] group-focus-visible/blog-action:translate-x-[36px] motion-reduce:transition-none"
        style={{
          fontFamily: "var(--font-sf-pro), sans-serif",
          fontWeight: 410,
          fontVariationSettings: '"wght" 410, "wdth" 125',
          lineHeight: 1.07,
          letterSpacing: "-0.04em",
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(100%_-_38px)] top-1/2 z-[3] flex size-[33px] -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005eff_0%,#001ea2_100%)] shadow-[0_0_15px_rgba(0,94,255,0.25)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/blog-action:left-[5px] group-focus-visible/blog-action:left-[5px] motion-reduce:transition-none"
      >
        <FiArrowUpRight
          size={20}
          strokeWidth={3.2}
          className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover/blog-action:scale-100 group-hover/blog-action:opacity-100 group-focus-visible/blog-action:scale-100 group-focus-visible/blog-action:opacity-100 motion-reduce:transition-none"
        />
      </span>
    </>
  );
}

const blogTitle = "Discover Everything About Flow";
const blogTitleWords = Array.from(blogTitle.matchAll(/\S+/g));
export type BlogPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  href?: string;
};
export type BlogStatistics = {
  totalPosts: number;
  totalCategories: number;
  currentPage: number;
  totalPages: number;
};
const previewPost: Omit<BlogPost, "id"> = {
  title:
    "Corrosion-Resistant Pump Materials and Applications: A Comprehensive Guide",
  description:
    "Corrosion is a common issue in industrial processes that can significantly reduce the lifespan of equipment. Pumps, particularly those used in liquid transport processes, are among the most susceptible equipment to corrosion. For this reason, pumps made from corrosion-resistant",
  date: "2025-06-10",
  image: "/blog/news1.jpg",
};
// Repeated reference content and Figma counters are presentation placeholders.
// Supply posts and statistics together when a real data source is introduced.
const previewPosts: BlogPost[] = Array.from({ length: 4 }, (_, index) => ({
  ...previewPost,
  id: `corrosion-preview-${index + 1}`,
}));
const previewStatistics: BlogStatistics = {
  totalPosts: 68,
  totalCategories: 18,
  currentPage: 1,
  totalPages: 16,
};
const hashtags = [
  "#PompaTeknolojileri",
  "#MühendislikNotları",
  "#ArGeVeİnovasyon",
  "#TeknikRehber",
];
function BlogStats({ statistics }: { statistics: BlogStatistics }) {
  const groups = [
    { value: statistics.totalPosts, label: "Total Text" },
    { value: statistics.totalCategories, label: "Category" },
    {
      value: `${statistics.currentPage}/${statistics.totalPages}`,
      label: "Page",
    },
  ];
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.dl
      {...reveal("up", 0, reduced, 0.16)}
      className={styles.statistics}
      aria-label="Blog statistics"
    >
      {groups.map(({ value, label }) => (
        <div className={styles.statistic} key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </motion.dl>
  );
}
export function BlogViewButton({ href }: { href?: string }) {
  const content = <BlogActionContents>View All</BlogActionContents>;
  return href ? (
    <Link href={href} className={blogActionClass}>
      {content}
    </Link>
  ) : (
    <button
      type="button"
      disabled
      aria-label="View All — blog details are not available yet"
      className={blogActionClass}
    >
      {content}
    </button>
  );
}

export function BlogCard({
  post,
  first = false,
  mobileHidden = false,
  index = 0,
}: {
  post: BlogPost;
  first?: boolean;
  mobileHidden?: boolean;
  index?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const [year, month, day] = post.date.split("-");
  return (
    <motion.article
      {...reveal(index % 2 === 0 ? "left" : "right", 0, reduced, 0.22)}
      className={`${styles.card}${mobileHidden ? ` ${styles.mobileHidden}` : ""}`}
      aria-labelledby={`blog-post-${post.id}`}
    >
      <div className={styles.cardMedia}>
        <div className={styles.photoFrame}>
          <Image
            src={post.image}
            alt="Sempa pumps on display at an industrial exhibition"
            fill
            sizes="(min-width: 768px) 350px, calc(100vw - 100px)"
            preload={first}
            className={styles.photo}
          />
        </div>
        <Image
          src="/blog/sempa-icon.png"
          alt="Sempa"
          width={192}
          height={128}
          sizes="60px"
          className={styles.logo}
        />
      </div>
      <div className={styles.cardContent}>
        <h2 id={`blog-post-${post.id}`}>{post.title}</h2>
        <p className={styles.excerpt}>{post.description}</p>
        <time dateTime={post.date}>
          {day}/{month}/{year}
        </time>
        <BlogViewButton href={post.href} />
      </div>
    </motion.article>
  );
}
export default function BlogPage({
  posts = previewPosts,
  statistics = previewStatistics,
}: {
  posts?: BlogPost[];
  statistics?: BlogStatistics;
}) {
  const [visibleMobilePosts, setVisibleMobilePosts] = useState(3);
  const reduced = useReducedMotion() ?? false;
  const headingRef = useRepeatingTitle(1550);
  return (
    <main
      data-header-underlay
      className={`-mt-[var(--site-header-height,97px)] ${styles.page} overflow-x-clip font-sans`}
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className={styles.inner}>
        <BlogStats statistics={statistics} />
        <header className={styles.introduction}>
          <motion.div {...reveal("up", 0.06, reduced, 0.15)}>
            <h1 ref={headingRef} aria-label={blogTitle}>
              <span aria-hidden="true">
                {blogTitleWords.map(({ 0: word, index }) => (
                  <span key={word}>
                    {index > 0 && " "}
                    <span className="inline-block whitespace-nowrap">
                      {Array.from(word, (letter, letterIndex) => (
                        <span
                          key={letterIndex}
                          className="blog-title-letter inline-block"
                          style={{
                            animationDelay: `${(index + letterIndex) * 24}ms`,
                          }}
                        >
                          {letter}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
          </motion.div>
          <style jsx>{`
            @media (prefers-reduced-motion: no-preference) {
              [data-title-revealing] .blog-title-letter {
                animation: blog-title-wave 850ms both;
              }
            }
            @keyframes blog-title-wave {
              0% {
                opacity: 0;
                transform: translateY(-0.85em);
                animation-timing-function: cubic-bezier(0.2, 0.65, 0.3, 1);
              }
              72% {
                opacity: 1;
                transform: translateY(0.045em);
                animation-timing-function: ease-out;
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <motion.p {...reveal("up", 0.08, reduced, 0.18)}>
            From engineering tips to technical guides, check out our blogs{" "}
            <br className={styles.desktopBreak} />
            to read the latest content shaping the world of pumps.
          </motion.p>
          <motion.ul
            {...reveal("up", 0.12, reduced, 0.18)}
            className={styles.hashtags}
            aria-label="Blog topics"
          >
            {hashtags.map((hashtag) => (
              <li key={hashtag}>{hashtag}</li>
            ))}
          </motion.ul>
        </header>
        <div
          id="blog-articles"
          className={styles.posts}
          aria-label="Blog articles"
        >
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              first={index === 0}
              mobileHidden={index >= visibleMobilePosts}
              index={index}
            />
          ))}
        </div>
        {visibleMobilePosts < posts.length && (
          <motion.div
            {...reveal("up", 0, reduced, 0.15)}
            className="hidden justify-center max-[767px]:flex"
          >
            <button
              type="button"
              className={`${blogActionClass} ${styles.loadMore}`}
              aria-controls="blog-articles"
              onClick={() =>
                setVisibleMobilePosts((count) =>
                  Math.min(count + 3, posts.length),
                )
              }
            >
              <BlogActionContents>Load More</BlogActionContents>
            </button>
          </motion.div>
        )}
        <p
          className={`${styles.mobileStatus} sr-only`}
          role="status"
          aria-live="polite"
        >
          {visibleMobilePosts > 3
            ? "Additional blog articles are now visible."
            : ""}
        </p>
        <motion.div
          {...reveal("up", 0, reduced, 0.12)}
          className={styles.newsletter}
        >
          <NewsletterSubscription />
        </motion.div>
      </div>
    </main>
  );
}
