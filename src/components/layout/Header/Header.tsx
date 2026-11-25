"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
export type HeaderVariant = "red" | "blue" | "white" | "gray" | "green";
export type HeaderOptions = {
  variant?: HeaderVariant | "basic";
  showImPumpTechnology?: boolean;
  textColors?: Partial<HeaderTextColors>;
  languageAccent?: "green";
};
export type HeaderTextColors = {
  pumpSelection: string;
  contactUs: string;
  menu: string;
  language: string;
};
export const HEADER_DEFAULT_TEXT_COLORS: HeaderTextColors = {
  pumpSelection: "#F7F7F7",
  contactUs: "#27272A",
  menu: "#0D5792",
  language: "#F7F7F7",
};
// Nested paths inherit their closest configured parent. IM logo is independent.
export const HEADER_PAGE_OPTIONS: Record<string, HeaderOptions> = {
  // White / basic
  "/": { variant: "white", textColors: { contactUs: "#F7F7F7" } },
  "/history": { variant: "white", textColors: { contactUs: "#F7F7F7" } },
  "/global": { variant: "white", textColors: { contactUs: "#F7F7F7" } },
  "/contact": {
    variant: "white",
    textColors: {
      pumpSelection: "#F7F7F7",
      contactUs: "#F7F7F7",
    },
  },
  "/im-pump-technology": {
    variant: "white",
    textColors: { contactUs: "#F7F7F7" },
  },
  "/e-mission": {
    variant: "white",
    textColors: { pumpSelection: "#27272A" },
  },
  "/e-service": {
    variant: "white",
    textColors: {
      pumpSelection: "#9EB7D0",
      contactUs: "#9EB7D0",
    },
  },
  // Blue
  "/solutions-category": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/solutions-detail": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/quality": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/news-detail": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/news": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/sustainability": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/blog": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/blog-detail": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/faq": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/media": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/media-catalog": { variant: "blue" },
  "/career": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/all-products": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/production": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/pump-series": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  "/product-detail": {
    variant: "blue",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
    },
  },
  // Gray uses the complete static Sempa logo.
  "/about-us": {
    variant: "white",
    textColors: {
      pumpSelection: "#9EB7D0",
      contactUs: "#9EB7D0",
    },
  },
  "/green-pump": {
    variant: "green",
    textColors: {
      pumpSelection: "#27272A",
      contactUs: "#27272A",
      menu: "#0D5792",
      language: "#27272A",
    },
    languageAccent: "green",
  },
  // Red
  "/foundry": {
    variant: "red",
    textColors: { contactUs: "#F7F7F7" },
  },
};
export const HEADER_DEFAULT_OPTIONS = {
  variant: "white",
  showImPumpTechnology: true,
} as const;
export function getHeaderAppearance(
  pathname: string,
  overrides: HeaderOptions = {},
) {
  const path = pathname.replace(/\/$/, "") || "/";
  const match = Object.keys(HEADER_PAGE_OPTIONS)
    .filter(
      (route) =>
        path === route || (route !== "/" && path.startsWith(`${route}/`)),
    )
    .sort((a, b) => b.length - a.length)[0];
  const page = match ? HEADER_PAGE_OPTIONS[match] : undefined;
  const selected =
    overrides.variant ?? page?.variant ?? HEADER_DEFAULT_OPTIONS.variant;
  return {
    variant: selected === "basic" ? ("white" as const) : selected,
    showImPumpTechnology:
      overrides.showImPumpTechnology ??
      page?.showImPumpTechnology ??
      HEADER_DEFAULT_OPTIONS.showImPumpTechnology,
    languageAccent: overrides.languageAccent ?? page?.languageAccent,
    textColors: {
      ...HEADER_DEFAULT_TEXT_COLORS,
      ...(selected === "red"
        ? {
            pumpSelection: "#F7F7F7",
            contactUs: "#27272A",
            menu: "#F7F7F7",
            language: "#F7F7F7",
          }
        : {}),
      ...(selected === "blue" ? { language: "#27272A" } : {}),
      ...(selected === "gray"
        ? { pumpSelection: "#F7F7F7", menu: "#9EB7D0", language: "#9EB7D0" }
        : {}),
      ...page?.textColors,
      ...overrides.textColors,
    },
  };
}
type HeaderTheme = {
  logo: string;
  fallbackFilter: string;
  tokens: CSSProperties;
};
const blueLogoFilter =
  "brightness(0) saturate(100%) invert(25%) sepia(85%) saturate(1015%) hue-rotate(169deg) brightness(91%) contrast(94%)";
const blueOrb = "linear-gradient(135deg,#005eff,#001ea2)";
const blueOrbShadow = "0 0 12px #005eff61,0 5px 14px #001ea247";
const greenHeaderAccent = "#16b85c";
const greenHeaderOrb =
  "linear-gradient(135deg,#34de7c 0%,#16b85c 54%,#087c40 100%)";
const greenHeaderOrbShadow = "0 0 18px #16b85c78,0 6px 16px #087c4052";
const glass = "linear-gradient(130deg,#ffffff26,#ffffff12)";
function themeTokens(values: Record<string, string>): CSSProperties {
  return values as CSSProperties;
}
const HEADER_THEMES: Record<HeaderVariant, HeaderTheme> = {
  white: {
    logo: "/header/sempa-white.png",
    fallbackFilter: "none",
    tokens: themeTokens({
      "--header-selection-text": "#F7F7F7",
      "--header-selection-bg": glass,
      "--header-border": "#ffffff73",
      "--header-menu-text": "#0d5792",
      "--header-menu-bg": glass,
      "--header-orb": blueOrb,
      "--header-orb-shadow": blueOrbShadow,
      "--header-language-text": "#9eb7d0",
      "--header-language-bg": glass,
      "--header-language-border": "#ffffff73",
      "--header-language-shadow": "0 7px 20px #d3193033",
    }),
  },
  blue: {
    logo: "/header/sempa-blue.png",
    fallbackFilter: blueLogoFilter,
    tokens: themeTokens({
      "--header-selection-text": "#F7F7F7",
      "--header-selection-bg": "#ffffff26",
      "--header-border": "#bfd8eb",
      "--header-menu-text": "#0d5792",
      "--header-menu-bg": "#ffffff40",
      "--header-orb": blueOrb,
      "--header-orb-shadow": blueOrbShadow,
      "--header-language-text": "#27272a",
      "--header-language-bg": "linear-gradient(150deg,#ffffff60,#f8edef80)",
      "--header-language-border": "#ffffffb3",
      "--header-language-shadow": "0 7px 20px #d3193033",
    }),
  },
  red: {
    logo: "/header/sempa-white.png",
    fallbackFilter: "none",
    tokens: themeTokens({
      "--header-selection-text": "#f7f7f7",
      "--header-selection-bg": "linear-gradient(115deg,#ffffff26,#e30a1740)",
      "--header-border": "#ffffff73",
      "--header-menu-text": "#f7f7f7",
      "--header-menu-bg": glass,
      "--header-orb": "linear-gradient(135deg,#e30a17,#94000b)",
      "--header-orb-shadow": "0 0 16px #e30a1766,0 5px 14px #94000b47",
      "--header-language-text": "#f7f7f7",
      "--header-language-bg": "linear-gradient(130deg,#ffffff26,#e30a1726)",
      "--header-language-border": "#ffffff73",
      "--header-language-shadow": "0 7px 20px #e30a1726",
    }),
  },
  gray: {
    logo: "/header/sempa-gray.png",
    fallbackFilter: "brightness(0) saturate(100%) opacity(.85)",
    tokens: themeTokens({
      "--header-selection-text": "#F7F7F7",
      "--header-selection-bg": "linear-gradient(115deg,#ffffff26,#005eff40)",
      "--header-border": "#ffffffb3",
      "--header-menu-text": "#9eb7d0",
      "--header-menu-bg": glass,
      "--header-orb": blueOrb,
      "--header-orb-shadow": blueOrbShadow,
      "--header-language-text": "#9eb7d0",
      "--header-language-bg": "linear-gradient(130deg,#ffffff26,#e30a1726)",
      "--header-language-border": "#ffffffb3",
      "--header-language-shadow": "0 7px 20px #e30a1726",
    }),
  },
  green: {
    logo: "/header/sempa-gray.png",
    fallbackFilter: "brightness(0) saturate(100%) opacity(.85)",
    tokens: themeTokens({
      "--header-selection-bg": "linear-gradient(115deg,#ffffff26,#005eff40)",
      "--header-border": "#ffffffb3",
      "--header-menu-bg": glass,
      "--header-orb": blueOrb,
      "--header-orb-shadow": blueOrbShadow,
      "--header-language-bg": glass,
      "--header-language-border": "#ffffffb3",
      "--header-language-shadow": "0 7px 20px #e30a1726",
    }),
  },
};
// About Us uses the PNG logo; keep a fallback if the file cannot load.
const GRAY_LOGO_CANDIDATES = ["/header/sempa-gray.png"] as const;

function GrayHeaderLogo({ className }: { className: string }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const useFallback = sourceIndex >= GRAY_LOGO_CANDIDATES.length;
  const src = useFallback
    ? "/header/sempa-white.png"
    : (GRAY_LOGO_CANDIDATES[sourceIndex] ?? "/header/sempa-white.png");

  return (
    <Image
      key={src}
      src={src}
      alt="Sempa"
      width={155}
      height={40}
      priority
      unoptimized
      onError={() => {
        if (!useFallback) {
          setSourceIndex((current) =>
            Math.min(current + 1, GRAY_LOGO_CANDIDATES.length),
          );
        }
      }}
      style={{
        filter: useFallback
          ? "brightness(0) saturate(100%) opacity(.85)"
          : "none",
      }}
      className={className}
    />
  );
}

function HeaderLogo({ variant }: { variant: HeaderVariant }) {
  const [fallback, setFallback] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = HEADER_THEMES[variant];
  const animated = variant === "red" || variant === "green";
  useEffect(() => {
    if (!animated || !rootRef.current) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () =>
      setMotionEnabled(visible && !document.hidden && !preference.matches);
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    observer.observe(rootRef.current);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [animated]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    const play = () => {
      void video
        .play()
        .then(() => {
          if (disposed) video.pause();
        })
        .catch(() => {});
    };
    if (motionEnabled) play();
    else video.pause();
    return () => {
      disposed = true;
      video.pause();
    };
  }, [motionEnabled]);
  if (!animated) {
    if (variant === "gray") {
      return (
        <GrayHeaderLogo className="h-auto w-[155px] object-contain max-[380px]:w-[108px] min-[1024px]:w-[calc(172*var(--header-unit))]" />
      );
    }
    return (
      <Image
        src={fallback ? "/header/sempa-white.png" : theme.logo}
        alt="Sempa"
        width={155}
        height={40}
        priority
        onError={() => setFallback(true)}
        style={{ filter: fallback ? theme.fallbackFilter : "none" }}
        className="h-auto w-[155px] object-contain max-[380px]:w-[108px] min-[1024px]:w-[calc(172*var(--header-unit))]"
      />
    );
  }
  return (
    <span
      ref={rootRef}
      data-header-brand={variant}
      className="relative block h-[40px] w-[155px] max-[380px]:h-[29px] max-[380px]:w-[108px] min-[1024px]:h-[calc(44*var(--header-unit))] min-[1024px]:w-[calc(172*var(--header-unit))]"
    >
      {animated && motionEnabled ? (
        <>
          <Image
            src={
              variant === "red"
                ? "/header/sempa-white-text.png"
                : "/header/sempa-black-text.png"
            }
            alt="Sempa"
            width={96}
            height={32}
            priority
            className="absolute top-1/2 left-0 h-auto w-[96px] -translate-y-1/2 object-contain max-[380px]:w-[66px] min-[1024px]:w-[calc(106*var(--header-unit))]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-0 size-[54px] -translate-y-1/2 max-[380px]:size-[38px] min-[1024px]:size-[calc(60*var(--header-unit))]"
          >
            {variant === "red" ? (
              <video
                ref={videoRef}
                data-header-brand-video
                src="/header/sempa-red.webm"
                width={54}
                height={54}
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                className="size-full object-contain mix-blend-screen [mask-image:radial-gradient(ellipse,#000_45%,transparent_74%)]"
              />
            ) : (
              <Image
                data-header-brand-green
                src="/header/sempa-green.webp"
                alt=""
                width={54}
                height={54}
                unoptimized
                className="size-full object-contain"
              />
            )}
          </span>
        </>
      ) : (
        <Image
          src={fallback ? "/header/sempa-white.png" : theme.logo}
          alt="Sempa"
          width={155}
          height={40}
          priority
          onError={() => setFallback(true)}
          style={{ filter: fallback ? theme.fallbackFilter : "none" }}
          className="h-full w-full object-contain"
        />
      )}
    </span>
  );
}
type MenuKey =
  | "Corporate"
  | "Production"
  | "Product"
  | "Media"
  | "Solutions"
  | "Support";
type LanguageKey = "TR" | "EN" | "ES" | "RU";
type MenuItem = {
  label: MenuKey;
  href?: string;
  children: {
    label: string;
    href: string;
  }[];
};
const menuItems: MenuItem[] = [
  {
    label: "Corporate",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "History", href: "/history" },
      { label: "Our Quality Policy", href: "/quality" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "News & Announcements", href: "/news" },
      { label: "Events", href: "/media" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "I'm Pump Technology", href: "/im-pump-technology" },
      {
        label: "Law on the Protection of Personal Data",
        href: "/personal-data",
      },
      {
        label: "Cookie Notification",
        href: "/cookie-notification",
      },
    ],
  },
  {
    label: "Production",
    href: "/production",
    children: [],
  },
  {
    label: "Product",
    href: "/pump-series",
    children: [],
  },
  {
    label: "Media",
    href: "/media",
    children: [],
  },
  {
    label: "Solutions",
    href: "/solutions",
    children: [],
  },
  {
    label: "Support",
    href: "/e-service",
    children: [],
  },
];
const languageFlags: Record<LanguageKey, string> = {
  TR: "/header/flag-tr.png",
  EN: "/header/flag-en.png",
  ES: "/header/flag-es.png",
  RU: "/header/flag-ru.png",
};
function LanguageFlag({
  language,
  size = 24,
}: {
  language: LanguageKey;
  size?: number;
}) {
  return (
    <Image
      src={languageFlags[language]}
      alt={`${language} flag`}
      width={size}
      height={size}
      draggable={false}
      className="pointer-events-none block size-full select-none object-contain"
    />
  );
}
export default function Header(options: HeaderOptions = {}) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const syncScroll = () => setIsScrolled(window.scrollY > 90);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, [pathname]);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const documentStyle = document.documentElement.style;
    const previous = documentStyle.getPropertyValue("--site-header-height");
    let disposed = false;
    const measure = () => {
      if (!disposed)
        documentStyle.setProperty(
          "--site-header-height",
          `${Math.ceil(header.getBoundingClientRect().height)}px`,
        );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
      if (previous) documentStyle.setProperty("--site-header-height", previous);
      else documentStyle.removeProperty("--site-header-height");
    };
  }, []);
  const isHomePage = pathname === "/";
  const isCatalogStylePage =
    pathname === "/all-products" ||
    pathname.startsWith("/all-products/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/blog-detail" ||
    pathname.startsWith("/blog-detail/") ||
    pathname === "/career" ||
    pathname.startsWith("/career/") ||
    pathname === "/faq" ||
    pathname.startsWith("/faq/") ||
    pathname === "/media" ||
    pathname.startsWith("/media/") ||
    pathname === "/news" ||
    pathname.startsWith("/news/") ||
    pathname === "/news-detail" ||
    pathname.startsWith("/news-detail/") ||
    pathname === "/product-detail" ||
    pathname.startsWith("/product-detail/") ||
    pathname === "/pump-series" ||
    pathname.startsWith("/pump-series/") ||
    pathname === "/quality" ||
    pathname.startsWith("/quality/") ||
    pathname === "/solutions-category" ||
    pathname.startsWith("/solutions-category/") ||
    pathname === "/solutions-detail" ||
    pathname.startsWith("/solutions-detail/") ||
    pathname === "/sustainability" ||
    pathname.startsWith("/sustainability/");

  const isAboutUsPage =
    pathname === "/about-us" || pathname.startsWith("/about-us/");
  const useMatchingButtonStyles = isHomePage || isAboutUsPage;
  const isContactPage =
    pathname === "/contact" || pathname.startsWith("/contact/");
  const isEmissionPage =
    pathname === "/e-mission" || pathname.startsWith("/e-mission/");
  const isEServicePage =
    pathname === "/e-service" || pathname.startsWith("/e-service/");
  const isFoundryPage =
    pathname === "/foundry" || pathname.startsWith("/foundry/");
  const isGreenPumpPage =
    pathname === "/green-pump" || pathname.startsWith("/green-pump/");
  const isGlobalPage =
    pathname === "/global" || pathname.startsWith("/global/");
  const isHistoryPage =
    pathname === "/history" || pathname.startsWith("/history/");
  const isImPumpPage =
    pathname === "/im-pump-technology" ||
    pathname.startsWith("/im-pump-technology/");
  const contactMatchesSelection =
    isFoundryPage || isGlobalPage || isHistoryPage || isImPumpPage;
  const useMatchingActionStyles = useMatchingButtonStyles || isContactPage;
  const overlaysHero =
    isHomePage ||
    pathname === "/contact" ||
    pathname === "/foundry" ||
    pathname.startsWith("/foundry/");
  const appearance = getHeaderAppearance(pathname, options);
  const theme = HEADER_THEMES[appearance.variant];
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const showMenuLogo = !isHomePage || menuOpened;
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("TR");
  const languageRef = useRef<HTMLDivElement>(null);
  const activeMenuData = activeMenu
    ? menuItems.find((item) => item.label === activeMenu)
    : undefined;
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveMenu(null);
        setHoveredSubItem(null);
        setLanguageOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const openMenu = () => {
    setMenuOpened(true);
    setLanguageOpen(false);
    setActiveMenu(null);
    setHoveredSubItem(null);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setActiveMenu(null);
    setHoveredSubItem(null);
  };
  const changeActiveMenu = (label: MenuKey) => {
    setHoveredSubItem(null);
    setActiveMenu(label);
  };
  const clearActiveMenu = () => {
    setActiveMenu(null);
    setHoveredSubItem(null);
  };
  const selectLanguage = (language: LanguageKey) => {
    setSelectedLanguage(language);
    setLanguageOpen(false);
  };
  // Foundry, Global, History and IM Pump Technology share the Pump Selection appearance with Contact Us.
  const selectionButtonClass = `group relative flex h-[36px] w-[162px] items-center overflow-hidden rounded-[16px] ${isCatalogStylePage ? "border-[0.25px]" : "border"} transition-[background-color,border-color,box-shadow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] min-[1024px]:h-[calc(39*var(--header-unit))] min-[1024px]:w-[calc(180*var(--header-unit))] min-[1024px]:rounded-[calc(17*var(--header-unit))] ${
    isEmissionPage
      ? "border-[var(--header-border)] bg-transparent shadow-none backdrop-blur-none hover:border-white hover:bg-[#F7F7F7]"
      : isCatalogStylePage
        ? "border-[#9EB7D0] bg-transparent shadow-none hover:border-[#9EB7D0] hover:bg-[#F7F7F7]"
        : "border-[var(--header-border)] [background:var(--header-selection-bg)] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[0_8px_28px_rgba(10,36,65,0.12),inset_0_1px_0_rgba(255,255,255,0.25)] hover:border-white hover:bg-white"
  }`;
  const selectionHoverTextClass =
    useMatchingActionStyles ||
    isCatalogStylePage ||
    isFoundryPage ||
    isHistoryPage ||
    isImPumpPage
      ? "group-hover:text-[#27272A]"
      : "group-hover:text-[#0D5792]";
  return (
    <>
      <header
        ref={headerRef}
        data-header-variant={appearance.variant}
        data-header-scrolled={isScrolled ? "true" : "false"}
        data-header-im-pump={appearance.showImPumpTechnology}
        data-header-emission={isEmissionPage ? "true" : undefined}
        data-header-e-service={isEServicePage ? "true" : undefined}
        data-header-green-pump={isGreenPumpPage ? "true" : undefined}
        style={{
          ...theme.tokens,
          ...(appearance.languageAccent === "green"
            ? themeTokens({
                "--header-language-bg":
                  "radial-gradient(ellipse at 72% 50%,#b6f3bb99,transparent 72%),linear-gradient(110deg,#f7f7f7,#f1f9f2)",
                "--header-language-border": "#e5f3e7",
                "--header-language-shadow":
                  "0 0 20px #78e98a66,0 6px 18px #e30a172b",
              })
            : {}),
          ...(isGreenPumpPage
            ? themeTokens({
                "--header-orb": greenHeaderOrb,
                "--header-orb-shadow": greenHeaderOrbShadow,
              })
            : {}),
          ...themeTokens({
            "--header-selection-text": appearance.textColors.pumpSelection,
            "--header-contact-text": appearance.textColors.contactUs,
            "--header-menu-text": isGreenPumpPage
              ? greenHeaderAccent
              : isScrolled
                ? "#0D5792"
                : appearance.textColors.menu,
            "--header-language-text": isScrolled
              ? "#27272A"
              : appearance.textColors.language,
          }),
        }}
        className={`
          site-header [--header-unit:clamp(0.64px,0.0625vw,1.6px)]
          z-50
          w-full
          bg-transparent
          ${overlaysHero ? "fixed inset-x-0 top-0" : "sticky top-0"}
        `}
      >
        <div className="site-header__inner mx-auto flex w-full max-w-[1200px] min-[1024px]:w-5/6 min-[1024px]:max-w-none items-center justify-between pt-[53px] min-[1024px]:pt-[calc(53*var(--header-unit))]">
          {/* LOGOS */}
          <div className="site-header__logos flex shrink-0 items-center gap-[22px] max-[380px]:gap-3 min-[1024px]:gap-[calc(24*var(--header-unit))]">
            <Link
              href="/"
              aria-label="Sempa Home"
              data-hero-scatter={isHomePage ? "logo" : undefined}
            >
              {/* Mobile and desktop keep the page-specific logo underneath.
                  On scroll the actual blue PNG fades in over the top. */}
              <span className="site-header__mobile-logo relative hidden">
                <span className="site-header__original-logo block">
                  {appearance.variant === "gray" ? (
                    <GrayHeaderLogo className="h-auto w-[155px] object-contain" />
                  ) : (
                    <Image
                      src={
                        appearance.variant === "blue"
                          ? "/header/sempa-blue.png"
                          : "/header/sempa-white.png"
                      }
                      alt="Sempa"
                      width={155}
                      height={40}
                      priority
                    />
                  )}
                </span>
                <Image
                  src="/header/sempa-blue.png"
                  alt=""
                  aria-hidden="true"
                  width={155}
                  height={40}
                  priority
                  className="site-header__scrolled-logo pointer-events-none absolute inset-0 h-auto w-full object-contain"
                />
              </span>
              <span className="site-header__desktop-logo relative block">
                <span className="site-header__original-logo block">
                  <HeaderLogo
                    key={appearance.variant}
                    variant={appearance.variant}
                  />
                </span>
                <Image
                  src="/header/sempa-blue.png"
                  alt=""
                  aria-hidden="true"
                  width={155}
                  height={40}
                  priority
                  className="site-header__scrolled-logo pointer-events-none absolute inset-0 h-full w-full object-contain"
                />
              </span>
            </Link>
            {appearance.showImPumpTechnology && (
              <Link
                href="/im-pump-technology"
                aria-label="I'm Pump Technology"
                data-hero-scatter={isHomePage ? "header" : undefined}
              >
                <Image
                  src="/header/im-pump-technology.png"
                  alt="I'm Pump Technology"
                  width={134}
                  height={29}
                  priority
                  className="h-auto w-[134px] max-[380px]:w-[102px] min-[1024px]:w-[calc(149*var(--header-unit))]"
                />
              </Link>
            )}
          </div>
          {/* DESKTOP ACTIONS */}
          <div className="site-header__actions hidden items-center gap-[9px] lg:flex min-[1024px]:gap-[calc(10*var(--header-unit))]">
            {/* PUMP SELECTION */}
            <Link
              href="/pump-series"
              data-header-action="selection"
              data-header-blast-control={isHomePage ? "selection" : undefined}
              data-hero-scatter={isHomePage ? "header" : undefined}
              className={selectionButtonClass}
            >
              <span
                className={`relative z-[2] ml-[13px] whitespace-nowrap text-[var(--header-selection-text)] ${selectionHoverTextClass} transition-[transform,color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[31px] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:13px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto] min-[1024px]:ml-[calc(14*var(--header-unit))] min-[1024px]:group-hover:translate-x-[calc(34*var(--header-unit))] min-[1024px]:[font-size:calc(14*var(--header-unit))]!`}
              >
                Pump Selection
              </span>
              <span
                className={`absolute left-[calc(100%-32px)] top-1/2 z-[3] flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full [background:var(--header-orb)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[5px] min-[1024px]:h-[calc(28*var(--header-unit))] min-[1024px]:w-[calc(28*var(--header-unit))] min-[1024px]:left-[calc(100%-34*var(--header-unit))] min-[1024px]:group-hover:left-[calc(5*var(--header-unit))] ${isCatalogStylePage ? "shadow-none" : "shadow-[var(--header-orb-shadow)]"}`}
              >
                <FiArrowUpRight
                  size={21}
                  strokeWidth={3.2}
                  className="scale-[0.78] text-white opacity-0 transition-[opacity,transform] duration-[350ms] ease-out group-hover:scale-100 group-hover:opacity-100"
                />
              </span>
            </Link>
            {/* CONTACT */}
            <Link
              href="/contact"
              data-header-action="contact"
              data-header-blast-control={isHomePage ? "contact" : undefined}
              data-hero-scatter={isHomePage ? "header" : undefined}
              className={
                contactMatchesSelection
                  ? selectionButtonClass
                  : `group relative flex h-[36px] w-[158px] items-center overflow-hidden rounded-[16px] ${isCatalogStylePage ? "border-[0.25px]" : "border"} shadow-[0_4px_12px_rgba(26,80,126,0.06)] min-[1024px]:h-[calc(39*var(--header-unit))] min-[1024px]:w-[calc(176*var(--header-unit))] min-[1024px]:rounded-[calc(17*var(--header-unit))] ${
                      useMatchingActionStyles
                        ? "border-[var(--header-border)] [background:var(--header-selection-bg)] backdrop-blur-[18px] backdrop-saturate-[160%] transition-[background-color,border-color,box-shadow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white hover:bg-white"
                        : isCatalogStylePage
                          ? "border-[#9EB7D0] bg-transparent transition-[background-color,border-color,box-shadow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#9EB7D0] hover:bg-[#F7F7F7]"
                          : "border-[#c8d7e5] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)]"
                    }`
              }
            >
              <span
                className={`relative z-[2] ml-[13px] whitespace-nowrap text-[var(--header-contact-text)] ${contactMatchesSelection ? selectionHoverTextClass : useMatchingActionStyles ? "group-hover:text-[#27272A]" : ""} transition-[transform,color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[31px] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:13px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto] min-[1024px]:ml-[calc(14*var(--header-unit))] min-[1024px]:group-hover:translate-x-[calc(34*var(--header-unit))] min-[1024px]:[font-size:calc(14*var(--header-unit))]!`}
              >
                Contact Us
              </span>
              <span className="absolute left-[calc(100%-32px)] top-1/2 z-[3] flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full [background:var(--header-orb)] shadow-[var(--header-orb-shadow)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[5px] min-[1024px]:h-[calc(28*var(--header-unit))] min-[1024px]:w-[calc(28*var(--header-unit))] min-[1024px]:left-[calc(100%-34*var(--header-unit))] min-[1024px]:group-hover:left-[calc(5*var(--header-unit))]">
                <FiArrowUpRight
                  size={21}
                  strokeWidth={3.2}
                  className="scale-[0.78] text-white opacity-0 transition-[opacity,transform] duration-[350ms] ease-out group-hover:scale-100 group-hover:opacity-100"
                />
              </span>
            </Link>
            {/* MENU */}
            <button
              type="button"
              aria-label="Open menu"
              data-header-action="menu"
              onClick={openMenu}
              data-header-blast-control={isHomePage ? "menu" : undefined}
              data-hero-scatter={isHomePage ? "header" : undefined}
              className={`group/menu flex h-[36px] w-[115px] cursor-pointer items-center justify-center rounded-[16px] border border-[var(--header-border)] [background:var(--header-menu-bg)] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[0_8px_28px_rgba(10,36,65,0.12),inset_0_1px_0_rgba(255,255,255,0.25)] transform-gpu transition-[scale,transform,filter,box-shadow,border-color,background-color] ${useMatchingButtonStyles ? "duration-[450ms]" : "duration-[1100ms]"} ease-[cubic-bezier(0.45,0,0.55,1)] hover:scale-[1.025] ${isGlobalPage || isHistoryPage || isImPumpPage ? "" : "hover:brightness-[1.06]"} motion-reduce:transition-none hover:shadow-[0_10px_28px_rgba(10,36,65,0.19),inset_0_1px_0_rgba(255,255,255,0.30)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-menu-text)] min-[1024px]:h-[calc(39*var(--header-unit))] min-[1024px]:w-[calc(128*var(--header-unit))] min-[1024px]:rounded-[calc(17*var(--header-unit))] ${
                isGlobalPage
                  ? "hover:border-white hover:[background:#F7F7F7]"
                  : isHistoryPage || isImPumpPage
                    ? "hover:[background:#F7F7F7]"
                    : useMatchingButtonStyles
                      ? "hover:border-white hover:bg-white"
                      : ""
              }`}
            >
              <span
                className={`mr-[11px] text-[var(--header-menu-text)] ${isAboutUsPage ? "transition-colors duration-[450ms] group-hover/menu:text-[#0D5792]" : ""} [font-family:var(--font-sf-pro)]! [font-weight:550]! [font-size:13px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_550,_'wdth'_125]! [font-optical-sizing:auto] min-[1024px]:mr-[calc(12*var(--header-unit))] min-[1024px]:[font-size:calc(14*var(--header-unit))]!`}
              >
                MENU
              </span>
              <span
                aria-hidden="true"
                className="flex w-[19px] flex-col gap-[3px] min-[1024px]:w-[calc(21*var(--header-unit))] min-[1024px]:gap-[calc(3*var(--header-unit))]"
              >
                <span
                  className={`h-[2px] w-full rounded-full bg-[var(--header-menu-text)] ${isAboutUsPage ? "group-hover/menu:bg-[#0D5792]" : ""} transition-[transform,background-color] ${useMatchingButtonStyles ? "duration-[450ms]" : "duration-[1100ms]"} ease-[cubic-bezier(0.45,0,0.55,1)] group-hover/menu:translate-x-[2px] min-[1024px]:h-[calc(2*var(--header-unit))]`}
                />
                <span
                  className={`h-[2px] w-full rounded-full bg-[var(--header-menu-text)] ${isAboutUsPage ? "group-hover/menu:bg-[#0D5792]" : ""} transition-[transform,background-color] ${useMatchingButtonStyles ? "duration-[450ms]" : "duration-[1100ms]"} ease-[cubic-bezier(0.45,0,0.55,1)] group-hover/menu:-translate-x-[2px] min-[1024px]:h-[calc(2*var(--header-unit))]`}
                />
                <span
                  className={`h-[2px] w-full rounded-full bg-[var(--header-menu-text)] ${isAboutUsPage ? "group-hover/menu:bg-[#0D5792]" : ""} transition-[transform,background-color] ${useMatchingButtonStyles ? "duration-[450ms]" : "duration-[1100ms]"} ease-[cubic-bezier(0.45,0,0.55,1)] group-hover/menu:translate-x-[2px] min-[1024px]:h-[calc(2*var(--header-unit))]`}
                />
              </span>
            </button>
            {/* LANGUAGE — expanded selector matches the closed button width */}
            <div
              ref={languageRef}
              data-header-blast-control={isHomePage ? "language" : undefined}
              data-hero-scatter={isHomePage ? "header" : undefined}
              className="relative h-[36px] w-[94px] shrink-0 min-[1024px]:h-[calc(39*var(--header-unit))] min-[1024px]:w-[calc(104*var(--header-unit))]"
            >
              {!languageOpen ? (
                <button
                  type="button"
                  aria-label="Change language"
                  aria-haspopup="listbox"
                  aria-expanded={languageOpen}
                  data-header-action="language"
                  onClick={() => setLanguageOpen(true)}
                  className="flex h-[36px] w-[94px] cursor-pointer items-center justify-between rounded-[16px] border border-[var(--header-language-border)] [background:var(--header-language-bg)] pl-[13px] pr-[12px] shadow-[var(--header-language-shadow)] transition-[filter,box-shadow] duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-language-text)] min-[1024px]:h-[calc(39*var(--header-unit))] min-[1024px]:w-[calc(104*var(--header-unit))] min-[1024px]:rounded-[calc(17*var(--header-unit))] min-[1024px]:pl-[calc(15*var(--header-unit))] min-[1024px]:pr-[calc(14*var(--header-unit))]"
                >
                  <span className="text-[var(--header-language-text)] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:13px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto] min-[1024px]:[font-size:calc(14*var(--header-unit))]!">
                    {selectedLanguage}
                  </span>
                  <span className="flex size-[22px] shrink-0 items-center justify-center min-[1024px]:size-[calc(24*var(--header-unit))]">
                    <LanguageFlag language={selectedLanguage} />
                  </span>
                </button>
              ) : (
                <div
                  role="listbox"
                  aria-label="Select language"
                  className="absolute right-0 top-0 z-[80] flex h-[144px] w-[94px] flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.55)] bg-[linear-gradient(160deg,rgba(34,37,39,0.96)_0%,rgba(41,44,47,0.92)_42%,rgba(87,101,109,0.78)_76%,rgba(117,137,148,0.74)_100%)] pt-[3px] shadow-[0_14px_35px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[18px] min-[1024px]:h-[calc(144*var(--header-unit))] min-[1024px]:w-[calc(104*var(--header-unit))] min-[1024px]:rounded-[calc(16*var(--header-unit))] min-[1024px]:pt-[calc(3*var(--header-unit))]"
                >
                  {(["TR", "EN", "ES", "RU"] as LanguageKey[]).map(
                    (language) => {
                      const isSelected = selectedLanguage === language;
                      return (
                        <button
                          key={language}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => selectLanguage(language)}
                          className="group/lang flex h-[33px] w-full shrink-0 cursor-pointer items-center justify-between pl-[15px] pr-[16px] text-left transition-colors duration-250 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none min-[1024px]:h-[calc(33*var(--header-unit))] min-[1024px]:pl-[calc(15*var(--header-unit))] min-[1024px]:pr-[calc(16*var(--header-unit))]"
                        >
                          <span
                            className={`whitespace-nowrap transition-colors duration-250 group-hover/lang:text-[#F7F7F7] group-focus-visible/lang:text-[#F7F7F7] ${
                              isSelected ? "text-[#F7F7F7]" : "text-[#20252A]"
                            } [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:14px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto] min-[1024px]:[font-size:calc(14*var(--header-unit))]!`}
                          >
                            {language}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`flex size-[20px] shrink-0 items-center justify-center rounded-full min-[1024px]:size-[calc(20*var(--header-unit))] ${
                              isSelected
                                ? "shadow-[0_0_15px_5px_rgba(255,255,255,0.08)]"
                                : ""
                            }`}
                          >
                            <LanguageFlag language={language} />
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <style jsx global>{`
        /* Premium matte glass appears only after scrolling. */
        [data-home-hero][data-hero-blasting] [data-hero-scatter],
        [data-home-hero][data-hero-blasting] [data-hero-scatter] > div {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .site-header.site-header[data-hero-blasting]::before {
          opacity: 0;
        }
        .site-header[data-hero-blasting] [data-hero-scatter] {
          transition-property: background-color, border-color, box-shadow;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .site-header::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          /* Soft lower corners, while the top edge remains flush with viewport. */
          border-radius: 0 0 18px 18px;
          background: linear-gradient(
            115deg,
            rgba(249, 251, 254, 0.79) 0%,
            rgba(240, 245, 252, 0.75) 52%,
            rgba(235, 242, 252, 0.78) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.42);
          box-shadow:
            0 12px 32px rgba(18, 39, 67, 0.065),
            inset 0 1px 0 rgba(255, 255, 255, 0.48);
          -webkit-backdrop-filter: blur(32px) saturate(125%);
          backdrop-filter: blur(32px) saturate(125%);
          transition: opacity 850ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .site-header[data-header-scrolled="true"]::before {
          opacity: 1;
        }
        .site-header .site-header__inner {
          position: relative;
          z-index: 1;
          transition:
            padding-top 850ms cubic-bezier(0.22, 1, 0.36, 1),
            padding-bottom 850ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Page variants are untouched until the glass state is active.
           Transition the actual PNGs instead of swapping src (which snaps). */
        .site-header .site-header__original-logo,
        .site-header .site-header__scrolled-logo {
          transition: opacity 1050ms cubic-bezier(0.22, 1, 0.36, 1);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .site-header .site-header__original-logo {
          opacity: 1;
        }
        .site-header .site-header__scrolled-logo {
          opacity: 0;
        }
        .site-header[data-header-scrolled="true"] .site-header__original-logo {
          opacity: 0;
        }
        .site-header[data-header-scrolled="true"] .site-header__scrolled-logo {
          opacity: 1;
        }

        /* Green Pump retains the same page-specific logo on scroll,
           including its green icon, instead of changing to the blue logo. */
        .site-header[data-header-green-pump="true"]
          .site-header__original-logo {
          opacity: 1;
        }
        .site-header[data-header-green-pump="true"]
          .site-header__scrolled-logo {
          opacity: 0;
        }

        /* MENU and language labels follow the scroll state on every route.
           Their CSS variables are updated above; transition the computed colors. */
        .site-header [data-header-action="menu"] > span:first-child,
        .site-header button[aria-label="Change language"] > span:first-child {
          transition: color 1000ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .site-header [data-header-action="menu"] > span:last-child > span {
          transition:
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 1000ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* The compact mobile hamburger has a legacy !important icon color.
           Override it only in the glass state, keeping other pages untouched. */
        @media (width < 768px) {
          .site-header.site-header[data-header-scrolled="true"]
            [data-header-action="menu"]
            > span:last-child
            > span {
            background-color: #0d5792 !important;
          }
          .site-header::before {
            border-radius: 0 0 14px 14px;
          }
        }

        /* Color must animate independently from the existing hover movement.
           The glass state wins over all route-specific and hover text colors. */
        .site-header [data-header-action="selection"] > span:first-child,
        .site-header [data-header-action="contact"] > span:first-child {
          transition-property: transform, color;
          transition-duration: 650ms, 1000ms;
          transition-timing-function:
            cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1);
        }
        .site-header[data-header-scrolled="true"]
          [data-header-action="selection"]
          > span:first-child,
        .site-header[data-header-scrolled="true"]
          [data-header-action="contact"]
          > span:first-child {
          color: #27272a !important;
        }

        /* Two identical PNGs crossfade: the second is tinted #005EFF.
           This keeps PNG transparency/edges and does not depend on mask-image. */
        .site-header-menu__slogan-original,
        .site-header-menu__slogan-blue {
          transition: opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .site-header-menu__slogan-blue {
          opacity: 0;
        }
        .site-header-menu[data-header-scrolled="true"]
          .site-header-menu__slogan-original {
          opacity: 0;
        }
        .site-header-menu[data-header-scrolled="true"]
          .site-header-menu__slogan-blue {
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .site-header::before,
          .site-header .site-header__inner,
          .site-header .site-header__original-logo,
          .site-header .site-header__scrolled-logo,
          .site-header [data-header-action="selection"] > span:first-child,
          .site-header [data-header-action="contact"] > span:first-child,
          .site-header [data-header-action="menu"] > span:first-child,
          .site-header [data-header-action="menu"] > span:last-child > span,
          .site-header button[aria-label="Change language"] > span:first-child,
          .site-header-menu__slogan-original,
          .site-header-menu__slogan-blue {
            transition-duration: 0.01ms !important;
          }
        }

        /* Green Pump: fully transparent action buttons with light hover. */
        .site-header[data-header-green-pump="true"]
          [data-header-action="selection"],
        .site-header[data-header-green-pump="true"]
          [data-header-action="contact"] {
          background: transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          transition:
            background-color 650ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 650ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .site-header[data-header-green-pump="true"]
          [data-header-action="selection"]:hover,
        .site-header[data-header-green-pump="true"]
          [data-header-action="contact"]:hover {
          background: #f7f7f7;
        }
        .site-header[data-header-green-pump="true"]
          [data-header-action="selection"]:hover
          > span:first-child,
        .site-header[data-header-green-pump="true"]
          [data-header-action="contact"]:hover
          > span:first-child {
          color: #27272a;
        }
        /* E-Mission: consistent button borders, including hover states. */
        .site-header[data-header-emission="true"]
          [data-header-action="selection"],
        .site-header[data-header-emission="true"]
          [data-header-action="contact"],
        .site-header[data-header-emission="true"] [data-header-action="menu"] {
          border-color: #9eb7d0;
        }
        /* E-Mission: transparent action buttons with solid light hover colors. */
        .site-header[data-header-emission="true"]
          [data-header-action="selection"],
        .site-header[data-header-emission="true"]
          [data-header-action="contact"] {
          background: transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .site-header[data-header-emission="true"]
          [data-header-action="selection"]:hover,
        .site-header[data-header-emission="true"]
          [data-header-action="contact"]:hover {
          background: #f7f7f7;
        }
        .site-header[data-header-emission="true"]
          [data-header-action="selection"]:hover
          > span:first-child,
        .site-header[data-header-emission="true"]
          [data-header-action="contact"]:hover
          > span:first-child {
          color: #27272a;
        }
        .site-header[data-header-emission="true"]
          [data-header-action="selection"]
          > span:nth-child(2),
        .site-header[data-header-emission="true"]
          [data-header-action="contact"]
          > span:nth-child(2) {
          box-shadow: none;
        }
        .site-header[data-header-emission="true"]
          [data-header-action="menu"]:hover {
          background: #f7f7f7;
        }
        /* E-Service: transparent normal state, light hover and muted borders. */
        .site-header[data-header-e-service="true"]
          [data-header-action="selection"],
        .site-header[data-header-e-service="true"]
          [data-header-action="contact"],
        .site-header[data-header-e-service="true"] [data-header-action="menu"] {
          border-color: #9eb7d0;
        }
        .site-header[data-header-e-service="true"]
          [data-header-action="selection"],
        .site-header[data-header-e-service="true"]
          [data-header-action="contact"] {
          background: transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .site-header[data-header-e-service="true"]
          [data-header-action="selection"]
          > span:nth-child(2),
        .site-header[data-header-e-service="true"]
          [data-header-action="contact"]
          > span:nth-child(2) {
          box-shadow: none;
        }
        .site-header[data-header-e-service="true"]
          [data-header-action="selection"]:hover,
        .site-header[data-header-e-service="true"]
          [data-header-action="contact"]:hover,
        .site-header[data-header-e-service="true"]
          [data-header-action="menu"]:hover {
          background: #f7f7f7;
        }
        .site-header[data-header-e-service="true"]
          [data-header-action="selection"]:hover
          > span:first-child,
        .site-header[data-header-e-service="true"]
          [data-header-action="contact"]:hover
          > span:first-child {
          color: #27272a;
        }
        @media (768px <= width < 1200px) {
          .site-header-menu .site-header-menu__panel {
            width: calc(100% - 48px);
            max-width: 1040px;
            height: calc(100dvh - 48px);
            top: 24px;
            left: 50%;
            translate: -50% 0 !important;
            transform: none;
            overflow-y: auto;
            overscroll-behavior: contain;
            border-radius: 24px;
          }
          .site-header-menu .site-header-menu__close {
            position: fixed;
            top: 32px;
            right: 32px;
          }
          .site-header-menu .site-header-menu__floating-logo {
            display: none;
          }
          .site-header-menu .site-header-menu__grid {
            grid-template-columns: minmax(190px, 30%) minmax(0, 1fr);
            gap: 24px;
            height: auto;
            min-height: 100%;
            padding: 56px 24px 24px;
          }
          .site-header-menu .site-header-menu__brand {
            height: auto;
            border-radius: 20px;
          }
          .site-header-menu .site-header-menu__brand-content {
            padding: 28px 18px;
          }
          .site-header-menu .site-header-menu__brand-content > img {
            width: min(171px, 100%);
          }
          .site-header-menu .site-header-menu__brand-content > p:first-of-type {
            margin-top: 64px;
            font-size: 18px !important;
          }
          .site-header-menu
            .site-header-menu__brand-content
            > p:nth-of-type(2) {
            margin-top: 40px;
          }
          .site-header-menu .site-header-menu__brand-content > div {
            padding-top: 48px;
          }
          .site-header-menu .site-header-menu__brand-content > div p {
            width: auto;
            height: auto;
            font-size: 11px !important;
            line-height: 1.35 !important;
          }
          .site-header-menu .site-header-menu__brand-content > div a {
            font-size: 25px !important;
          }
          .site-header-menu .site-header-menu__content {
            display: flex;
            flex-direction: column;
            height: auto;
            min-width: 0;
            padding-top: 0;
          }
          .site-header-menu .site-header-menu__columns {
            gap: 16px;
            min-height: 290px;
          }
          .site-header-menu .site-header-menu__nav {
            width: 128px;
          }
          .site-header-menu .site-header-menu__nav button {
            font-size: 17px !important;
          }
          .site-header-menu .site-header-menu__submenu {
            flex: 1;
            min-width: 0;
            padding-top: 12px;
          }
          .site-header-menu .site-header-menu__submenu a {
            white-space: normal;
            overflow-wrap: anywhere;
            font-size: 14px !important;
            line-height: 1.25 !important;
          }
          .site-header-menu .site-header-menu__green {
            position: relative;
            inset: auto;
            align-self: flex-end;
            width: 145px;
            height: 72px;
            margin-top: 20px;
          }
          .site-header-menu .site-header-menu__contact {
            position: relative;
            inset: auto;
            align-self: flex-end;
            margin-top: 20px;
            flex-shrink: 0;
          }
          .site-header-menu .site-header-menu__social {
            position: static;
            margin-top: 28px;
          }
          .site-header-menu .site-header-menu__copyright {
            position: static;
            margin-top: 12px;
          }
          .site-header-menu .site-header-menu__slogan {
            position: static;
            align-self: flex-end;
            width: min(230px, 100%);
            margin-top: 20px;
          }
        }
        @media (768px <= width < 1024px) {
          .site-header.site-header .site-header__inner {
            width: 1033.333px !important;
            max-width: none !important;
            padding: 40px 0 0 !important;
            zoom: calc(100vw / 1240px);
          }
          .site-header.site-header .site-header__actions {
            display: flex !important;
          }
          .site-header.site-header .site-header__actions > a {
            display: flex !important;
          }
          .site-header.site-header .site-header__actions > button {
            width: 115px !important;
            height: 36px !important;
            border-radius: 16px !important;
          }
          .site-header.site-header
            .site-header__actions
            > button
            > span:first-child {
            display: inline !important;
          }
          .site-header.site-header .site-header__actions > div {
            width: 94px !important;
            height: 36px !important;
          }
          .site-header.site-header button[aria-label="Change language"] {
            width: 94px !important;
            height: 36px !important;
            padding: 0 12px 0 13px !important;
            justify-content: space-between !important;
            border-radius: 16px !important;
            background: var(--header-language-bg) !important;
            border-color: var(--header-language-border) !important;
          }
          .site-header.site-header
            button[aria-label="Change language"]
            > span:first-child {
            display: inline !important;
          }
          .site-header.site-header .site-header__logos > a:nth-child(2) {
            display: block !important;
          }
          .site-header.site-header .site-header__logos img {
            width: auto !important;
          }
        }
        @media (width < 768px) {
          .site-header-menu .site-header-menu__mobile {
            display: block !important;
          }
          .site-header-menu .site-header-menu__desktop {
            display: none !important;
          }
          .site-header.site-header .site-header__inner {
            width: calc(100% - 24px) !important;
            max-width: none !important;
            padding: 24px 0 0 !important;
            zoom: 1 !important;
          }
          .site-header.site-header .site-header__desktop-logo,
          .site-header.site-header .site-header__logos > a:nth-child(2) {
            display: none !important;
          }
          .site-header.site-header .site-header__mobile-logo {
            display: block !important;
          }
          .site-header.site-header .site-header__mobile-logo img {
            width: clamp(88px, 22vw, 118px) !important;
            height: auto !important;
          }
          .site-header.site-header .site-header__actions {
            display: flex !important;
            gap: 8px !important;
          }
          .site-header.site-header .site-header__actions > a {
            display: none !important;
          }
          .site-header.site-header [data-header-action="menu"],
          .site-header.site-header .site-header__actions > div,
          .site-header.site-header button[aria-label="Change language"] {
            width: 44px !important;
            height: 44px !important;
            border-radius: 15px !important;
          }
          .site-header.site-header [data-header-action="menu"] {
            border-color: #ffffffcc !important;
            background: linear-gradient(
              130deg,
              #ffffff26,
              #9eb7d026
            ) !important;
          }
          .site-header.site-header
            [data-header-action="menu"]
            > span:first-child,
          .site-header.site-header
            button[aria-label="Change language"]
            > span:first-child {
            display: none !important;
          }
          .site-header.site-header
            [data-header-action="menu"]
            > span:last-child {
            display: flex !important;
            width: 21px !important;
            gap: 4px !important;
          }
          .site-header.site-header
            [data-header-action="menu"]
            > span:last-child
            > span {
            background: #9eb7d0 !important;
            height: 3px !important;
          }
          .site-header.site-header button[aria-label="Change language"] {
            padding: 0 !important;
            justify-content: center !important;
            border-color: #ffffffcc !important;
          }
          /* On mobile the MENU label is hidden; match its icon to the
             Green Pump accent in both regular and scrolled headers. */
          .site-header.site-header[data-header-green-pump="true"]
            [data-header-action="menu"]
            > span:last-child
            > span {
            background: #16b85c !important;
          }
        }
        /* Scroll spacing must override the older mobile/tablet padding rules. */
        .site-header.site-header[data-header-scrolled="true"]
          .site-header__inner {
          padding-top: 14px !important;
          padding-bottom: 14px !important;
        }
        @media (width < 768px) {
          .site-header.site-header[data-header-scrolled="true"]
            .site-header__inner {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
        }
      `}</style>
      {/* MENU OVERLAY */}
      <div
        role="dialog"
        aria-label="Main navigation"
        aria-modal={menuOpen || undefined}
        inert={!menuOpen}
        data-header-scrolled={isScrolled && menuOpen ? "true" : "false"}
        className={`site-header-menu fixed inset-0 z-[100] transition-opacity duration-300 ${
          menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="site-header-menu__mobile hidden h-dvh overflow-y-auto overscroll-contain bg-white text-[#27272A] [font-family:var(--font-sf-pro)]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]!">
          <div className="relative flex min-h-dvh flex-col px-[clamp(32px,12vw,56px)] pt-[70px] pb-7">
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="group absolute top-5 right-5 grid size-11 cursor-pointer place-items-center bg-transparent p-0 transition-transform duration-300 ease-out hover:rotate-90 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5792]"
            >
              <span className="absolute h-0.5 w-5 rotate-45 rounded-full bg-[#0D5792]" />
              <span className="absolute h-0.5 w-5 -rotate-45 rounded-full bg-[#0D5792]" />
            </button>
            <div className="size-[160px] shrink-0">
              {showMenuLogo && (
                <Image
                  src="/header/logo.gif"
                  alt="Sempa"
                  width={160}
                  height={160}
                  unoptimized
                  className="size-full object-contain"
                />
              )}
            </div>
            <nav aria-label="Mobile navigation" className="mt-7">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.children.length ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={activeMenu === item.label}
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === item.label ? null : item.label,
                          )
                        }
                        className="flex min-h-11 w-full items-center text-left text-[20px]! leading-[1.1]!"
                      >
                        {item.label}
                      </button>
                      {activeMenu === item.label && (
                        <div className="mb-3 flex flex-col border-l border-[#d5e5f3] pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMenu}
                              className="py-2 text-[14px]! leading-[1.25]! text-[#0D5792]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={closeMenu}
                      className="flex min-h-11 items-center text-[20px]! leading-[1.1]!"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-auto pt-[clamp(48px,9svh,90px)]">
              <Link
                href="/im-pump-technology"
                onClick={closeMenu}
                aria-label="I'm Pump Technology"
              >
                <Image
                  src="/header/im-pump-technology.png"
                  alt="I'm Pump Technology"
                  width={195}
                  height={42}
                  className="h-auto w-[195px]"
                />
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="relative mt-8 flex h-11 w-[200px] items-center rounded-[19px] border border-[#bfd3e4] bg-linear-to-b from-white to-[#f0f6ff] pl-4 text-[16px]! text-[#27272A] shadow-[0_4px_14px_#005eff12]"
              >
                Contact Us
                <span
                  aria-hidden="true"
                  className="absolute right-3 size-[31px] rounded-full bg-linear-to-br from-[#005eff] to-[#001ea2] shadow-[0_0_18px_#005eff80]"
                />
              </Link>
              <div className="mt-9 flex gap-1">
                {[
                  { label: "Facebook", Icon: FaFacebookF },
                  { label: "Instagram", Icon: FaInstagram },
                  { label: "YouTube", Icon: FaYoutube },
                  { label: "LinkedIn", Icon: FaLinkedinIn },
                ].map(({ label, Icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="grid size-[26px] place-items-center rounded-[5px] bg-[#0D5792] text-white"
                  >
                    <Icon size={17} style={{ color: "#ffffff" }} />
                  </a>
                ))}
              </div>
              <p className="mt-2 text-[10px]! text-[#9EB7D0]">
                © 2026 SEMPA. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        <div className="site-header-menu__desktop absolute inset-0">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute inset-0 h-full w-full cursor-default bg-[#18232d]/82 backdrop-blur-[18px]"
          />
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="site-header-menu__close group absolute right-[8.6vw] top-[12.5vh] z-[5] flex h-[40px] w-[40px] cursor-pointer items-center justify-center bg-transparent p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-90 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="absolute h-[2px] w-[19px] rotate-45 rounded-full bg-[#F7F7F7]" />
            <span className="absolute h-[2px] w-[19px] -rotate-45 rounded-full bg-[#F7F7F7]" />
          </button>
          <div
            className={`site-header-menu__panel absolute left-1/2 top-1/2 h-[668px] w-[calc(100%-140px)] max-w-[1290px] -translate-x-1/2 -translate-y-[47%] overflow-visible rounded-[29px] bg-white transition-all duration-500 ${menuOpen ? "scale-100 opacity-100" : "scale-[0.985] opacity-0"}`}
          >
            {/* GIF */}
            <div className="site-header-menu__floating-logo pointer-events-none absolute right-[68px] top-[-62px] z-[6] h-[155px] w-[155px]">
              {showMenuLogo && (
                <Image
                  src="/header/logo.gif"
                  alt=""
                  fill
                  unoptimized
                  sizes="155px"
                  className="object-contain"
                />
              )}
            </div>
            <div className="site-header-menu__grid grid h-full grid-cols-[360px_1fr] gap-[126px] px-[56px] py-[53px]">
              {/* LEFT CARD */}
              <div className="site-header-menu__brand relative h-full overflow-hidden rounded-[30px] bg-[#245b91] bg-cover bg-center bg-no-repeat [background-image:url('/header/header-menu-bg.jpg')]">
                <div className="site-header-menu__brand-content flex h-full flex-col px-[30px] pb-[42px] pt-[38px]">
                  <Image
                    src="/header/sempa-logo.png"
                    alt="Sempa"
                    width={171}
                    height={45}
                    className="h-auto w-[171px] brightness-0 invert"
                  />
                  <p className="mt-[102px] max-w-[230px] text-[#f7f7f7] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:20px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
                    Smarter fluid
                    <br />
                    automation, powered
                    <br />
                    by engineering.
                  </p>
                  <p className="mt-[78px] text-[#f7f7f7] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:9px]! [line-height:1.12]! [letter-spacing:-0.04em] [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
                    Since 1972 • Konya / Turkey
                  </p>
                  <div className="mt-auto">
                    <p className="h-[52px] w-[301px] text-[#f7f7f7] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-style:normal] [font-size:12px]! [line-height:109%]! [letter-spacing:0%] [color:#f7f7f7]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
                      Büyükkayacık Organize Sanayi Bölgesi
                      <br />
                      Mahallesi 22. Sokak NO:4 42250 Selçuklu,
                      <br />
                      Konya / Türkiye
                      <br />
                      info@sempapompa.com
                    </p>
                    <a
                      href="tel:4446413"
                      className="mt-[22px] block [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:30px]! [line-height:1.39]! [letter-spacing:-0.1em] [color:#F7F7F7]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]"
                    >
                      444 6 413
                    </a>
                  </div>
                </div>
              </div>
              {/* RIGHT SIDE */}
              <div className="site-header-menu__content relative h-full pt-[20px]">
                <div
                  className="site-header-menu__columns flex"
                  onMouseLeave={clearActiveMenu}
                >
                  {/* MAIN MENU */}
                  <nav className="site-header-menu__nav w-[188px] shrink-0">
                    <div className="flex flex-col">
                      {menuItems.map((item) => {
                        const isActive = activeMenu === item.label;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onPointerEnter={() => changeActiveMenu(item.label)}
                            onFocus={() => changeActiveMenu(item.label)}
                            onClick={() => changeActiveMenu(item.label)}
                            className="flex h-[41px] items-center whitespace-nowrap text-left [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:20px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto] [transition:color_180ms_ease,_transform_180ms_ease]"
                            style={{
                              color: isActive ? "#075b93" : "#27272A",
                              transform: isActive
                                ? "translateX(10px)"
                                : "translateX(0)",
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </nav>
                  {/* SUB MENU */}
                  <div className="site-header-menu__submenu min-h-[290px] pt-[14px]">
                    {activeMenuData?.children.length ? (
                      <div className="flex flex-col gap-[11px]">
                        {activeMenuData.children.map((item) => {
                          const isHovered = hoveredSubItem === item.label;
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={closeMenu}
                              onMouseEnter={() => setHoveredSubItem(item.label)}
                              onMouseLeave={() => setHoveredSubItem(null)}
                              onFocus={() => setHoveredSubItem(item.label)}
                              onBlur={() => setHoveredSubItem(null)}
                              className="block w-fit whitespace-nowrap text-[16px] font-[400] leading-[1.05] [transform-origin:left_center] [transition-property:transform,_color] [transition-duration:350ms,_150ms] [transition-timing-function:cubic-bezier(0.45,_0,_0.55,_1),_ease] [will-change:transform]"
                              style={{
                                color: isHovered ? "#075b93" : "#24272c",
                                transform: isHovered
                                  ? "translate3d(12px, 0, 0) scale(1.035)"
                                  : "translate3d(0, 0, 0) scale(1)",
                              }}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : activeMenuData?.href ? (
                      <Link
                        href={activeMenuData.href}
                        onClick={closeMenu}
                        onMouseEnter={() =>
                          setHoveredSubItem(activeMenuData.label)
                        }
                        onMouseLeave={() => setHoveredSubItem(null)}
                        className="block w-fit whitespace-nowrap text-[16px] [transform-origin:left_center] [transition-property:transform,_color] [transition-duration:800ms,_350ms] [transition-timing-function:cubic-bezier(0.45,_0,_0.55,_1),_ease] [will-change:transform]"
                        style={{
                          color:
                            hoveredSubItem === activeMenuData.label
                              ? "#075b93"
                              : "#24272c",
                          transform:
                            hoveredSubItem === activeMenuData.label
                              ? "translate3d(12px, 0, 0) scale(1.035)"
                              : "translate3d(0, 0, 0) scale(1)",
                        }}
                      >
                        View {activeMenuData.label}
                      </Link>
                    ) : null}
                  </div>
                </div>
                {/* GREEN SEMPA */}
                <Link
                  href="/green-pump"
                  onClick={closeMenu}
                  className="site-header-menu__green absolute right-0 top-[158px] block h-[92px] w-[185px] select-none"
                >
                  <Image
                    src="/header/green-sempa.png"
                    alt="Green Sempa"
                    fill
                    sizes="185px"
                    draggable={false}
                    className="pointer-events-none select-none object-contain"
                  />
                </Link>
                {/* MENU CONTACT */}
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="site-header-menu__contact group absolute right-0 top-[348px] flex h-[44px] w-[192px] items-center overflow-hidden rounded-[19px] border border-[#c8d7e5] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)] shadow-[0_4px_12px_rgba(26,80,126,0.06)]"
                >
                  <span className="relative z-[2] ml-[15px] whitespace-nowrap text-[var(--header-contact-text)] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[37px] [font-family:var(--font-sf-pro)]! [font-weight:410]! [font-size:15px]! [line-height:1.07]! [letter-spacing:-0.04em] [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
                    Contact Us
                  </span>
                  <span className="absolute left-[calc(100%-37px)] top-1/2 z-[3] flex h-[31px] w-[31px] -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(135deg,#005EFF_0%,#001EA2_100%)] shadow-[0_0_12px_rgba(0,94,255,0.38),0_5px_14px_rgba(0,30,162,0.28)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[6px]">
                    <FiArrowUpRight
                      size={21}
                      strokeWidth={3.2}
                      className="scale-[0.78] text-white opacity-0 transition-[opacity,transform] duration-[350ms] ease-out group-hover:scale-100 group-hover:opacity-100"
                    />
                  </span>
                </Link>
                {/* SOCIAL MEDIA */}
                <div className="site-header-menu__social absolute bottom-[103px] left-0 flex items-center gap-[5px]">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#075b93]"
                  >
                    <FaFacebookF size={15} color="#ffffff" />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#075b93]"
                  >
                    <FaInstagram size={16} color="#ffffff" />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#075b93]"
                  >
                    <FaYoutube size={16} color="#ffffff" />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#075b93]"
                  >
                    <FaLinkedinIn size={15} color="#ffffff" />
                  </a>
                </div>
                {/* COPYRIGHT */}
                <p className="site-header-menu__copyright absolute bottom-[22px] left-0 text-[10px] text-[#a9c3dd]">
                  © 2026 SEMPA. All rights reserved.
                </p>
                {/* LOGO SLOGAN */}
                <div className="site-header-menu__slogan pointer-events-none absolute bottom-[27px] right-0 w-[330px] select-none">
                  <Image
                    src="/header/logo-slogan.png"
                    alt="I'm Pump Technology"
                    width={330}
                    height={80}
                    quality={100}
                    draggable={false}
                    className="site-header-menu__slogan-original pointer-events-none h-auto w-full select-none"
                  />
                  <Image
                    src="/header/logo-slogan.png"
                    alt=""
                    aria-hidden="true"
                    width={330}
                    height={80}
                    quality={100}
                    draggable={false}
                    className="site-header-menu__slogan-blue pointer-events-none absolute inset-0 h-auto w-full select-none"
                    style={{
                      // Starts from black; calibrated to RGB(0, 94, 255).
                      // Works on the real PNG pixels, unlike a CSS mask layer.
                      filter:
                        "brightness(0) saturate(100%) invert(58.8%) sepia(97.9%) saturate(5141%) hue-rotate(209.5deg) brightness(90.5%) contrast(166.4%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
