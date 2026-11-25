"use client";
import Image from "next/image";
import Link from "next/link";
import ViewAllButton from "@/components/ui/ViewAllButton";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useViewportVideo from "@/components/media/useViewportVideo";
import { motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { FiArrowDownRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";
type RevealDirection = "up" | "left" | "right";
const revealEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
function reveal(
  direction: RevealDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.18,
) {
  return {
    initial: reduced
      ? (false as const)
      : {
          opacity: 0,
          x: direction === "left" ? -34 : direction === "right" ? 34 : 0,
          y: direction === "up" ? 32 : 0,
          filter: "blur(5px)",
        },
    whileInView: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.92,
      delay: reduced ? 0 : delay,
      ease: revealEase,
    },
  };
}
function heroEnter(reduced: boolean, delay = 0) {
  return {
    initial: reduced
      ? (false as const)
      : { opacity: 0, y: 26, filter: "blur(7px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 1.02,
      delay: reduced ? 0 : delay,
      ease: revealEase,
    },
  };
}

const categoryDescription =
  "Developing sustainable solutions and creating integrated systems is our area of expertise.";
type CategoryLink = {
  title: string;
  href: string | null;
};
type SolutionCategory = {
  id: string;
  title: string[];
  videoSrc: string;
  href: string | null;
  subcategories: CategoryLink[];
};
const solutionCategories: SolutionCategory[] = [
  {
    id: "special-area",
    title: ["SPECIAL AREA"],
    videoSrc: "/solutions-category/solutions-detail-special-area.webm",
    href: "/solutions-detail",
    subcategories: [
      { title: "Industry", href: "/solutions-detail" },
      { title: "Snowmaking", href: null },
      { title: "Mining", href: null },
      { title: "Offshore", href: null },
    ],
  },
  {
    id: "infrastructure",
    title: ["INFRASTRUCTURE", "SUPERSTRUCTURE"],
    videoSrc: "/solutions-category/solutions-detail-infrastructure.webm",
    href: null,
    subcategories: [
      { title: "Construction Sites", href: null },
      { title: "Transport", href: null },
      { title: "Civil Construction", href: null },
      { title: "Road Construction Sites", href: null },
    ],
  },
  {
    id: "wastewater",
    title: ["WASTEWATER", "MANAGEMENT"],
    videoSrc: "/solutions-category/solutions-detail-wastewater.webm",
    href: null,
    subcategories: [],
  },
  {
    id: "agriculture",
    title: ["AGRICULTURE"],
    videoSrc: "/solutions-category/solutions-detail-agriculture.webm",
    href: null,
    subcategories: [],
  },
];
function CategoryBackgroundVideo({ source }: { source: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useViewportVideo(videoRef);
  const firstVideo = source === solutionCategories[0].videoSrc;
  return (
    <video
      ref={videoRef}
      className="category-background-video [.solutions-category-page_&]:[position:absolute] [.solutions-category-page_&]:[top:0] [.solutions-category-page_&]:[right:0] [.solutions-category-page_&]:[bottom:0] [.solutions-category-page_&]:[left:0] [.solutions-category-page_&]:[z-index:-2] [.solutions-category-page_&]:[width:100%] [.solutions-category-page_&]:[height:100%] [.solutions-category-page_&]:[object-fit:cover] [.solutions-category-page_&]:[object-position:center] [.solutions-category-page_&]:[pointer-events:none] max-md:[.solutions-category-page_&]:[object-position:70%_center]"
      autoPlay={firstVideo}
      muted
      loop
      playsInline
      poster={source.replace(/\.webm$/, "-poster.webp")}
      preload={firstVideo ? "auto" : "none"}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
    >
      <source
        src={firstVideo ? source : undefined}
        data-video-src={firstVideo ? undefined : source}
        type="video/webm"
      />
    </video>
  );
}
function CategoryViewAll({
  href,
  title,
}: {
  href: string | null;
  title: string;
}) {
  const appearance = {
    width: "calc(140 * var(--category-unit))",
    height: "var(--category-view-height)",
    fontSize: "calc(15 * var(--category-unit))",
    className:
      "category-view-all z-2 mt-6 min-h-11 self-start cursor-pointer [--category-view-height:44px] md:absolute md:top-[calc(32*var(--category-unit))] md:right-[calc(32*var(--category-unit))] md:mt-0 md:min-h-0 md:[--category-view-height:calc(43*var(--category-unit))]",
  };
  return href ? (
    <ViewAllButton
      {...appearance}
      href={href}
      aria-label={`View all ${title}`}
    />
  ) : (
    <ViewAllButton
      {...appearance}
      aria-disabled="true"
      aria-label={`View all ${title}: detail page not available yet`}
      title="Detail page not available yet"
    />
  );
}
function CategorySubLink({ link }: { link: CategoryLink }) {
  const content = (
    <>
      <span
        className="category-sub-orb [.solutions-category-page_&]:[display:grid]! [.solutions-category-page_&]:[place-items:center] [.solutions-category-page_&]:[flex-shrink:0] [.solutions-category-page_&]:[width:calc(28_*_var(--category-unit))] [.solutions-category-page_&]:[height:calc(28_*_var(--category-unit))] [.solutions-category-page_&]:[border:0.5px_solid_#eaf2ff] [.solutions-category-page_&]:[border-radius:50%] [.solutions-category-page_&]:[background:linear-gradient(135deg,_#4e91ff,_#004bdc)] [.solutions-category-page_&]:[box-shadow:0_0_calc(18_*_var(--category-unit))_calc(6_*_var(--category-unit))_#005eff33,_inset_0_1px_2px_#ffffff99] [.solutions-category-page_&]:[color:#fff]! [.solutions-category-page_&_svg]:[width:70%] [.solutions-category-page_&_svg]:[height:70%]"
        aria-hidden="true"
      >
        <FiArrowDownRight
          strokeWidth={3.2}
          className="origin-center transition-transform duration-300 group-hover/subcategory:-rotate-45 group-focus-visible/subcategory:-rotate-45 motion-reduce:transition-none"
        />
      </span>
      <span>{link.title}</span>
    </>
  );
  return link.href ? (
    <Link
      className="group/subcategory category-sub-link [.solutions-category-page_&:disabled]:[cursor:not-allowed] [.solutions-category-page_&]:[display:inline-flex]! [.solutions-category-page_&]:[align-items:center] [.solutions-category-page_&]:[gap:calc(9_*_var(--category-unit))] [.solutions-category-page_&]:[padding-top:calc(5_*_var(--category-unit))] [.solutions-category-page_&]:[padding-right:calc(12_*_var(--category-unit))] [.solutions-category-page_&]:[padding-bottom:calc(5_*_var(--category-unit))] [.solutions-category-page_&]:[padding-left:calc(5_*_var(--category-unit))] [.solutions-category-page_&]:[border:0.5px_solid_#ffffff59] [.solutions-category-page_&]:[border-radius:999px] [.solutions-category-page_&]:[background:#ffffff26] [.solutions-category-page_&]:[color:#005eff]! [.solutions-category-page_&]:[font-style:inherit] [.solutions-category-page_&]:[font-variant:inherit] [.solutions-category-page_&]:[font-weight:inherit]! [.solutions-category-page_&]:[font-stretch:inherit]! [.solutions-category-page_&]:[font-size:calc(14_*_var(--category-unit))]! [.solutions-category-page_&]:[line-height:1.12]! [.solutions-category-page_&]:[font-family:inherit]! [.solutions-category-page_&]:[font-feature-settings:inherit] [.solutions-category-page_&]:[font-variation-settings:inherit]! [.solutions-category-page_&]:[text-decoration:none]! [.solutions-category-page_&]:[cursor:pointer] max-md:[.solutions-category-page_&]:[font-size:15px]! max-md:[.solutions-category-page_&]:[padding-right:16px]"
      href={link.href}
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      className="group/subcategory category-sub-link [.solutions-category-page_&:disabled]:[cursor:not-allowed] [.solutions-category-page_&]:[display:inline-flex]! [.solutions-category-page_&]:[align-items:center] [.solutions-category-page_&]:[gap:calc(9_*_var(--category-unit))] [.solutions-category-page_&]:[padding-top:calc(5_*_var(--category-unit))] [.solutions-category-page_&]:[padding-right:calc(12_*_var(--category-unit))] [.solutions-category-page_&]:[padding-bottom:calc(5_*_var(--category-unit))] [.solutions-category-page_&]:[padding-left:calc(5_*_var(--category-unit))] [.solutions-category-page_&]:[border:0.5px_solid_#ffffff59] [.solutions-category-page_&]:[border-radius:999px] [.solutions-category-page_&]:[background:#ffffff26] [.solutions-category-page_&]:[color:#005eff]! [.solutions-category-page_&]:[font-style:inherit] [.solutions-category-page_&]:[font-variant:inherit] [.solutions-category-page_&]:[font-weight:inherit]! [.solutions-category-page_&]:[font-stretch:inherit]! [.solutions-category-page_&]:[font-size:calc(14_*_var(--category-unit))]! [.solutions-category-page_&]:[line-height:1.12]! [.solutions-category-page_&]:[font-family:inherit]! [.solutions-category-page_&]:[font-feature-settings:inherit] [.solutions-category-page_&]:[font-variation-settings:inherit]! [.solutions-category-page_&]:[text-decoration:none]! [.solutions-category-page_&]:[cursor:pointer] max-md:[.solutions-category-page_&]:[font-size:15px]! max-md:[.solutions-category-page_&]:[padding-right:16px]"
      disabled
      title="Detail page not available yet"
    >
      {content}
    </button>
  );
}
function SolutionCategoryCard({
  category,
  index,
}: {
  category: SolutionCategory;
  index: number;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.section
      {...(index === 0
        ? heroEnter(reduced, 0.12)
        : reveal("up", 0.04, reduced, 0.15))}
      className="solution-category-card [.solutions-category-page_&]:[position:relative] [.solutions-category-page_&]:[isolation:isolate] [.solutions-category-page_&]:[overflow:hidden] [.solutions-category-page_&]:[min-height:calc(490_*_var(--category-unit))] [.solutions-category-page_&]:[border:0.5px_solid_#ffffffb3] [.solutions-category-page_&]:[border-radius:calc(30_*_var(--category-unit))] [.solutions-category-page_&]:[background:#f7f7f7] [.solutions-category-page_&]:[box-shadow:0_calc(15_*_var(--category-unit))_calc(40_*_var(--category-unit))_#005eff0d]"
      aria-labelledby={`category-title-${category.id}`}
    >
      <CategoryBackgroundVideo source={category.videoSrc} />
      <div
        className="category-video-fade [.solutions-category-page_&]:[position:absolute] [.solutions-category-page_&]:[top:0] [.solutions-category-page_&]:[right:0] [.solutions-category-page_&]:[bottom:0] [.solutions-category-page_&]:[left:0] [.solutions-category-page_&]:[z-index:-1] [.solutions-category-page_&]:[pointer-events:none] [.solutions-category-page_&]:[background:linear-gradient(90deg,_#f7f7f7_0%,_#f7f7f7fa_24%,_#f7f7f7c7_43%,_#f7f7f71f_68%,_#ffffff00_100%)] max-md:[.solutions-category-page_&]:[background:linear-gradient(180deg,_#f7f7f7f2_0%,_#f7f7f7cc_30%,_#f7f7f74d_58%,_#f7f7f70d_100%),_linear-gradient(90deg,_#f7f7f7b3,_#f7f7f726_70%,_transparent)]"
        aria-hidden="true"
      />
      <div className="category-card-content [.solutions-category-page_&]:[display:flex]! [.solutions-category-page_&]:[flex-direction:column] [.solutions-category-page_&]:[justify-content:space-between] [.solutions-category-page_&]:[gap:calc(50_*_var(--category-unit))] [.solutions-category-page_&]:[min-height:calc(490_*_var(--category-unit))] [.solutions-category-page_&]:[padding-top:calc(70_*_var(--category-unit))] [.solutions-category-page_&]:[padding-right:calc(67_*_var(--category-unit))] [.solutions-category-page_&]:[padding-bottom:calc(85_*_var(--category-unit))] [.solutions-category-page_&]:[padding-left:calc(67_*_var(--category-unit))] max-xl:[.solutions-category-page_&]:[padding-left:40px] max-xl:[.solutions-category-page_&]:[padding-right:40px] max-md:[.solutions-category-page_&]:[min-height:580px] max-md:[.solutions-category-page_&]:[padding-top:40px] max-md:[.solutions-category-page_&]:[padding-right:24px] max-md:[.solutions-category-page_&]:[padding-bottom:32px] max-md:[.solutions-category-page_&]:[padding-left:24px] max-md:[.solutions-category-page_&]:[justify-content:flex-start] max-md:[.solutions-category-page_&]:[gap:0]">
        <div className="category-card-copy [.solutions-category-page_&]:[max-width:calc(400_*_var(--category-unit))] [.solutions-category-page_&_h2]:[margin-top:0] [.solutions-category-page_&_h2]:[margin-right:0] [.solutions-category-page_&_h2]:[margin-bottom:0] [.solutions-category-page_&_h2]:[margin-left:0] [.solutions-category-page_&_h2]:[font-size:calc(25_*_var(--category-unit))]! [.solutions-category-page_&_h2]:[font-weight:540]! [.solutions-category-page_&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.solutions-category-page_&_h2]:[line-height:1.12]! [.solutions-category-page_&_h2]:[letter-spacing:0] [.solutions-category-page_&_h2]:[color:transparent]! [.solutions-category-page_&_h2]:[background-image:linear-gradient(90deg,_#005eff,_#001ea2)] [.solutions-category-page_&_h2]:[background-clip:text] [.solutions-category-page_&_h2]:[-webkit-background-clip:text] [.solutions-category-page_&_h2_span]:[display:block]! [.solutions-category-page_&_p]:[width:calc(346_*_var(--category-unit))] [.solutions-category-page_&_p]:[max-width:100%] [.solutions-category-page_&_p]:[margin-top:calc(26_*_var(--category-unit))] [.solutions-category-page_&_p]:[margin-right:0] [.solutions-category-page_&_p]:[margin-bottom:0] [.solutions-category-page_&_p]:[margin-left:0] [.solutions-category-page_&_p]:[color:#000]! [.solutions-category-page_&_p]:[font-size:calc(15_*_var(--category-unit))]! [.solutions-category-page_&_p]:[line-height:1]! [.solutions-category-page_&_p]:[letter-spacing:-0.04em] max-md:[.solutions-category-page_&_h2]:[font-size:clamp(20px,_6.4vw,_25px)]! max-md:[.solutions-category-page_&_p]:[margin-top:14px] max-md:[.solutions-category-page_&_p]:[line-height:1.07]!">
          <motion.h2
            id={`category-title-${category.id}`}
            {...(index === 0
              ? heroEnter(reduced, 0.44)
              : reveal("left", 0.09, reduced, 0.22))}
          >
            {category.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </motion.h2>
          <motion.p
            {...(index === 0
              ? heroEnter(reduced, 0.61)
              : reveal("up", 0.17, reduced, 0.18))}
          >
            {categoryDescription}
          </motion.p>
        </div>
        <CategoryViewAll
          href={category.href}
          title={category.title.join(" ")}
        />
        {category.subcategories.length > 0 && (
          <div className="category-sub-links [.solutions-category-page_&]:[display:flex]! [.solutions-category-page_&]:[flex-wrap:wrap] [.solutions-category-page_&]:[gap:calc(12_*_var(--category-unit))] max-md:[.solutions-category-page_&]:[flex-direction:column] max-md:[.solutions-category-page_&]:[align-items:flex-start] max-md:[.solutions-category-page_&]:[gap:12px] max-md:[.solutions-category-page_&]:[margin-top:auto] max-md:[.solutions-category-page_&]:[padding-top:36px]">
            {category.subcategories.map((link) => (
              <CategorySubLink key={link.title} link={link} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
// One verified thumbnail is currently available; repeats are preview items.
const relatedProducts = Array.from({ length: 20 }, (_, index) => ({
  id: `related-pump-preview-${index + 1}`,
  image: "/solutions-category/product.webp",
  alt: "Sempa pump",
}));
function RelatedProductsCarousel() {
  const reduced = useReducedMotion() ?? false;
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const gestureStart = useRef<{
    x: number;
    y: number;
    touch: boolean;
  } | null>(null);
  const [position, setPosition] = useState({
    offset: 0,
    stride: 0,
    maximum: 0,
  });
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => {
      const width = track.firstElementChild?.getBoundingClientRect().width || 0;
      const stride =
        width + (parseFloat(getComputedStyle(track).columnGap) || 0);
      const maximum = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setPosition((current) => ({
        offset: Math.min(
          maximum,
          current.stride
            ? (current.offset / current.stride) * stride
            : stride * 0.8,
        ),
        stride,
        maximum,
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    if (track.firstElementChild) observer.observe(track.firstElementChild);
    return () => observer.disconnect();
  }, []);
  const move = (direction: -1 | 1) =>
    setPosition((current) => {
      if (!current.stride) return current;
      const nextIndex =
        direction > 0
          ? Math.floor(current.offset / current.stride + 0.001) + 1
          : Math.ceil(current.offset / current.stride - 0.001) - 1;
      return {
        ...current,
        offset: Math.max(
          0,
          Math.min(current.maximum, nextIndex * current.stride),
        ),
      };
    });
  const finishGesture = (x: number, y: number, touch: boolean) => {
    const start = gestureStart.current;
    gestureStart.current = null;
    setIsDragging(false);
    if (!start || start.touch !== touch) return;
    const dx = x - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(y - start.y))
      move(dx < 0 ? 1 : -1);
  };
  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0 || !event.isPrimary)
      return;
    event.preventDefault();
    gestureStart.current = { x: event.clientX, y: event.clientY, touch: false };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const touchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      gestureStart.current = null;
      return;
    }
    gestureStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      touch: true,
    };
  };
  return (
    <section
      className="category-related-products [.solutions-category-page_&]:[padding-top:calc(110_*_var(--category-unit))] [.solutions-category-page_&]:[padding-right:0] [.solutions-category-page_&]:[padding-bottom:calc(100_*_var(--category-unit))] [.solutions-category-page_&]:[padding-left:0] [.solutions-category-page_&]:[letter-spacing:-0.04em] max-md:[.solutions-category-page_&]:[padding-top:64px] max-md:[.solutions-category-page_&]:[padding-bottom:64px]"
      aria-labelledby="category-related-title"
    >
      <div className="category-related-header [.solutions-category-page_&]:[display:grid]! [.solutions-category-page_&]:[grid-template-columns:minmax(0,_539fr)_minmax(0,_601fr)_auto] [.solutions-category-page_&]:[align-items:center] [.solutions-category-page_&]:[gap:calc(35_*_var(--category-unit))] [.solutions-category-page_&_h2]:[margin-top:0] [.solutions-category-page_&_h2]:[margin-right:0] [.solutions-category-page_&_h2]:[margin-bottom:0] [.solutions-category-page_&_h2]:[margin-left:0] [.solutions-category-page_&_h2]:[font-size:calc(50_*_var(--category-unit))]! [.solutions-category-page_&_h2]:[font-weight:410]! [.solutions-category-page_&_h2]:[line-height:1]! [.solutions-category-page_&_h2]:[color:#0d5792]! [.solutions-category-page_&_>_p]:[margin-top:0] [.solutions-category-page_&_>_p]:[margin-right:0] [.solutions-category-page_&_>_p]:[margin-bottom:0] [.solutions-category-page_&_>_p]:[margin-left:0] [.solutions-category-page_&_>_p]:[font-size:calc(15_*_var(--category-unit))]! [.solutions-category-page_&_>_p]:[line-height:1]! [.solutions-category-page_&_>_p]:[color:#1d2049]! max-xl:[.solutions-category-page_&]:[grid-template-columns:minmax(0,_1fr)_minmax(0,_1.2fr)] max-xl:[.solutions-category-page_&]:[gap:28px] max-xl:[.solutions-category-page_&_h2]:[font-size:clamp(32px,_4vw,_50px)]! max-xl:[.solutions-category-page_&_>_p]:[line-height:1.2]! max-md:[.solutions-category-page_&]:[grid-template-columns:1fr] max-md:[.solutions-category-page_&]:[gap:24px] max-md:[.solutions-category-page_&]:[padding-left:24px] max-md:[.solutions-category-page_&]:[padding-right:24px] max-md:[.solutions-category-page_&_h2]:[font-size:clamp(30px,_8vw,_42px)]! max-md:[.solutions-category-page_&_>_p]:[line-height:1.1]! max-md:[.solutions-category-page_&_>_p]:[text-align:justify]">
        <motion.h2
          id="category-related-title"
          {...reveal("left", 0.03, reduced, 0.22)}
        >
          Related Other
          <br />
          Products
        </motion.h2>
        <motion.p {...reveal("right", 0.12, reduced, 0.22)}>
          Discover the most efficient pumping solution in seconds. Simply enter
          your technical parameters such as flow rate, pressure, and fluid type,
          and let our advanced configurator select the ideal Sempa pump for your
          specific industry needs.
        </motion.p>
        <div className="category-product-navigation [.solutions-category-page_&]:[display:flex]! [.solutions-category-page_&]:[gap:calc(16_*_var(--category-unit))] [.solutions-category-page_&_button]:[display:grid]! [.solutions-category-page_&_button]:[place-items:center] [.solutions-category-page_&_button]:[width:max(32px,_calc(32_*_var(--category-unit)))] [.solutions-category-page_&_button]:[height:max(32px,_calc(32_*_var(--category-unit)))] [.solutions-category-page_&_button]:[padding-top:0] [.solutions-category-page_&_button]:[padding-right:0] [.solutions-category-page_&_button]:[padding-bottom:0] [.solutions-category-page_&_button]:[padding-left:0] [.solutions-category-page_&_button]:[border:0] [.solutions-category-page_&_button]:[background:transparent] [.solutions-category-page_&_button]:[color:#9eb7d0]! [.solutions-category-page_&_button]:[cursor:pointer] [.solutions-category-page_&_button:hover:not(:disabled)]:[color:#0d5792]! [.solutions-category-page_&_button:disabled]:[opacity:.35] [.solutions-category-page_&_button:disabled]:[cursor:default] [.solutions-category-page_&_svg]:[width:75%] [.solutions-category-page_&_svg]:[height:75%] max-xl:[.solutions-category-page_&]:[grid-column:1_/_-1] max-xl:[.solutions-category-page_&]:[justify-content:center] max-xl:[.solutions-category-page_&]:[margin-top:16px] max-md:[.solutions-category-page_&]:[margin-top:20px] max-md:[.solutions-category-page_&]:[gap:20px] max-md:[.solutions-category-page_&_button]:[width:44px] max-md:[.solutions-category-page_&_button]:[height:44px] max-md:[.solutions-category-page_&_svg]:[width:70%] max-md:[.solutions-category-page_&_svg]:[height:70%]">
          <button
            type="button"
            aria-label="Previous related product"
            aria-controls="category-product-slider"
            disabled={position.offset < 1}
            onClick={() => move(-1)}
          >
            <FiArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next related product"
            aria-controls="category-product-slider"
            disabled={position.offset >= position.maximum - 1}
            onClick={() => move(1)}
          >
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        id="category-product-slider"
        data-dragging={isDragging}
        className="left-1/2 w-screen max-w-none -translate-x-1/2 cursor-grab select-none data-[dragging=true]:cursor-grabbing [&_*]:cursor-inherit [&_*]:select-none [&_img]:[-webkit-user-drag:none] category-product-viewport [.solutions-category-page_&]:[position:relative] [.solutions-category-page_&]:[overflow:hidden] [.solutions-category-page_&]:[margin-top:calc(45_*_var(--category-unit))] [.solutions-category-page_&]:[touch-action:pan-y] max-md:[.solutions-category-page_&]:[margin-top:36px]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Related other products"
        onPointerDown={pointerDown}
        onPointerUp={(event) => {
          if (event.pointerType !== "touch")
            finishGesture(event.clientX, event.clientY, false);
        }}
        onPointerCancel={() => {
          gestureStart.current = null;
        }}
        onTouchStart={touchStart}
        onTouchEnd={(event) => {
          const touch = event.changedTouches[0];
          if (touch) finishGesture(touch.clientX, touch.clientY, true);
        }}
        onTouchCancel={() => {
          gestureStart.current = null;
          setIsDragging(false);
        }}
      >
        <ol
          ref={trackRef}
          className="category-product-track [.solutions-category-page_&]:[display:flex]! [.solutions-category-page_&]:[gap:calc(14_*_var(--category-unit))] [.solutions-category-page_&]:[margin-top:0] [.solutions-category-page_&]:[margin-right:0] [.solutions-category-page_&]:[margin-bottom:0] [.solutions-category-page_&]:[margin-left:0] [.solutions-category-page_&]:[padding-top:0] [.solutions-category-page_&]:[padding-right:0] [.solutions-category-page_&]:[padding-bottom:0] [.solutions-category-page_&]:[padding-left:0] [.solutions-category-page_&]:[list-style:none] [.solutions-category-page_&]:[transition:transform_450ms_ease-in-out]"
          style={{ transform: `translateX(${-position.offset}px)` }}
        >
          {relatedProducts.map((product, index) => (
            <motion.li
              {...reveal("up", Math.min(index, 5) * 0.04, reduced, 0.12)}
              key={product.id}
              className="category-product-card [.solutions-category-page_&]:[position:relative] [.solutions-category-page_&]:[flex:0_0_calc(136_*_var(--category-unit))] [.solutions-category-page_&]:[height:calc(136_*_var(--category-unit))] [.solutions-category-page_&]:[border-radius:calc(20_*_var(--category-unit))] [.solutions-category-page_&]:[overflow:hidden] [.solutions-category-page_&]:[background:#fff] [.solutions-category-page_&_img]:[object-fit:contain] [.solutions-category-page_&_img]:[padding-top:calc(10_*_var(--category-unit))] [.solutions-category-page_&_img]:[padding-right:calc(10_*_var(--category-unit))] [.solutions-category-page_&_img]:[padding-bottom:calc(10_*_var(--category-unit))] [.solutions-category-page_&_img]:[padding-left:calc(10_*_var(--category-unit))]"
            >
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(min-width: 1280px) 10vw, 136px"
                draggable={false}
              />
            </motion.li>
          ))}
        </ol>
        <div
          className="category-product-blur [.solutions-category-page_&]:[position:absolute] [.solutions-category-page_&]:[top:0] [.solutions-category-page_&]:[right:0] [.solutions-category-page_&]:[bottom:0] [.solutions-category-page_&]:[left:auto] [.solutions-category-page_&]:[z-index:2] [.solutions-category-page_&]:[width:20%] [.solutions-category-page_&]:[pointer-events:none] [.solutions-category-page_&_span]:[position:absolute] [.solutions-category-page_&_span]:[top:0] [.solutions-category-page_&_span]:[right:0] [.solutions-category-page_&_span]:[bottom:0] [.solutions-category-page_&_span]:[left:0] [.solutions-category-page_&_span:last-child]:[background:linear-gradient(90deg,_transparent,_#ffffff55)] max-xl:[.solutions-category-page_&]:[display:none]!"
          aria-hidden="true"
        >
          {[2, 6, 10, 16].map((blur, index) => (
            <span
              key={blur}
              style={{
                left: `${index * 24}%`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
              }}
              className="[mask-image:linear-gradient(to_right,_transparent,_black)] [-webkit-mask-image:linear-gradient(to_right,_transparent,_black)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default function SolutionsCategoryPage() {
  const reduced = useReducedMotion() ?? false;
  return (
    <main
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] solutions-category-page overflow-x-clip font-sans [--category-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [width:100%] [padding-top:calc(80_*_var(--category-unit))] [padding-right:24px] [padding-bottom:calc(110_*_var(--category-unit))] [padding-left:24px] [background:linear-gradient(180deg,_#fff_0%,_#ffffff00_30%),_radial-gradient(ellipse_at_8%_85%,_#d1e7ff99,_transparent_65%),_radial-gradient(ellipse_at_60%_35%,_#e3f1ff66,_transparent_65%),_linear-gradient(110deg,_#f0f7ff,_#fff_75%)] [&_button:focus-visible]:[outline:2px_solid_#005eff] [&_button:focus-visible]:[outline-offset:3px] [&_a:focus-visible]:[outline:2px_solid_#005eff] [&_a:focus-visible]:[outline-offset:3px] max-xl:[--category-unit:1px] max-xl:[padding-top:64px] max-xl:[padding-bottom:80px] max-md:[padding-top:48px] max-md:[padding-right:10px] max-md:[padding-bottom:80px] max-md:[padding-left:10px] motion-reduce:[&_*]:[transition:none]! [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className="solutions-category-inner [.solutions-category-page_&]:[width:100%] [.solutions-category-page_&]:[max-width:calc(1200_*_var(--category-unit))] [.solutions-category-page_&]:[margin-left:auto] [.solutions-category-page_&]:[margin-right:auto]">
        <div className="solutions-category-cards [.solutions-category-page_&]:[display:grid]! [.solutions-category-page_&]:[gap:calc(45_*_var(--category-unit))]">
          {solutionCategories.map((category, index) => (
            <SolutionCategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
        <RelatedProductsCarousel />
        <motion.div
          data-category-newsletter
          {...reveal("up", 0.05, reduced, 0.12)}
        >
          <NewsletterSubscription scaled requireValidInput />
        </motion.div>
      </div>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.
