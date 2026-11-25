"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
// ============================================================
// FOOTER VARIANT
// ============================================================
type FooterVariant = "default" | "green-pump" | "foundry";
type FooterProps = {
  variant?: FooterVariant;
};
const footerAssets = {
  default: {
    video: null,
    image: "/footer/footer1.png",
    socialPrefix: "",
  },
  "green-pump": {
    video: "/footer/green-footer22.mp4",
    image: null,
    socialPrefix: "white-",
  },
  foundry: {
    video: "/footer/foundry-footer-vid.mp4",
    image: null,
    socialPrefix: "red-",
  },
} as const;
// ============================================================
// SOCIAL LINKS
// ============================================================
const socialLinks = [
  {
    name: "Facebook",
    file: "facebook",
    href: "#",
  },
  {
    name: "Instagram",
    file: "instagram",
    href: "#",
  },
  {
    name: "LinkedIn",
    file: "linkedin",
    href: "#",
  },
  {
    name: "YouTube",
    file: "youtube",
    href: "#",
  },
];
// ============================================================
// LEGAL LINKS
// ============================================================
const legalLinks = [
  {
    label: "Information Society Services",
    href: "#",
  },
  {
    label: "Law on the Protection of Personal Data",
    href: "#",
  },
  {
    label: "Cookie Notification",
    href: "#",
  },
];
// ============================================================
// FOOTER NAVIGATION LINKS
// ============================================================
const corporateLinks = [
  "About Us",
  "History",
  "Sempa in Numbers",
  "Our Quality Policy",
  "FAQ",
  "Blog",
  "News & Announcements",
  "Events",
  "Sustainability",
  "I'm Pump Technology",
];
const productionLinks = [
  "Innovation & Design",
  "Mold Park",
  "Foundry Park",
  "Machining Park",
  "Sempa Test Station",
  "Quality Control",
  "TCO",
];
const productLinks = [
  "End Suction Pumps",
  "Multi Stage Pumps",
  "Sewage Pumps",
  "In-Line Pumps",
  "Split Case Pumps",
  "Self Priming Pumps",
  "Booster Pumps",
  "Fire Fighting Pumps",
];
const mediaLinks = [
  "Catalog",
  "Video Gallery",
  "Photo Gallery",
  "User Manuals",
  "Document & Certification",
  "Pump Control Panel",
  "User Manuals",
];
const solutionsLinks = [
  "Special Areas",
  "Infrastructure",
  "Superstructure",
  "Wastewater Management",
  "Agriculture",
];
const supportLinks = [
  "Special Areas",
  "Infrastructure",
  "Superstructure",
  "Wastewater Management",
  "Agriculture",
];
// ============================================================
// TYPOGRAPHY
// ============================================================
const sfProRegular: CSSProperties = {
  fontFamily: "var(--font-sf-pro), Arial, sans-serif",
  fontWeight: 410,
  fontVariationSettings: '"wght" 410, "wdth" 132, "opsz" 12',
};
const footerNavTitleStyle: CSSProperties = {
  fontFamily: "var(--font-sf-pro), Arial, sans-serif",
  fontWeight: 760,
  fontVariationSettings: '"wght" 760, "wdth" 132, "opsz" 12',
  color: "#6DB7E0",
};
const foundryNavTitleStyle: CSSProperties = {
  ...footerNavTitleStyle,
  backgroundImage: "linear-gradient(180deg, #E30A17 0%, #7D060D 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};
const footerNavLinkStyle: CSSProperties = {
  fontFamily: "var(--font-sf-pro), Arial, sans-serif",
  fontWeight: 410,
  fontVariationSettings: '"wght" 410, "wdth" 132, "opsz" 12',
  color: "#9EB7D0",
};
const foundryNavLinkStyle: CSSProperties = {
  ...footerNavLinkStyle,
  color: "#E30A17",
};
// ============================================================
// FOOTER NAV COLUMN
// ============================================================
type FooterNavColumnProps = {
  title: string;
  links: string[];
  className: string;
  isFoundry: boolean;
};
function FooterNavColumn({
  title,
  links,
  className,
  isFoundry,
}: FooterNavColumnProps) {
  return (
    <nav
      aria-label={title}
      className={`
        absolute z-20
        top-[65%]
        w-[120px]
        xl:top-[67.8138%]
        ${className}
      `}
    >
      <h3
        className="
          m-0 font-sans
          text-[12px]
          leading-[139%]
          tracking-[-0.1em]
          min-[1600px]:text-[13.1px]
        "
        style={isFoundry ? foundryNavTitleStyle : footerNavTitleStyle}
      >
        {title}
      </h3>
      <ul className="m-0 list-none p-0">
        {links.map((link, index) => (
          <li key={`${title}-${index}`} className="m-0 p-0">
            <a
              href="#"
              className="
                block w-fit max-w-full
                cursor-pointer
                font-sans
                text-[12px]
                leading-[139%]
                tracking-[-0.1em]
                transition-colors
                duration-300 ease-out
                min-[1600px]:text-[13.1px]
              "
              style={isFoundry ? foundryNavLinkStyle : footerNavLinkStyle}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = isFoundry
                  ? "#E30A17"
                  : "#9EB7D0";
              }}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
// ============================================================
// FOOTER COMPONENT
// ============================================================
export default function Footer({ variant }: FooterProps) {
  const pathname = usePathname() ?? "";
  // ----------------------------------------------------------
  // ROUTE DETECTION
  // ----------------------------------------------------------
  const pathSegments = pathname.split("/");
  const detectedVariant: FooterVariant = pathSegments.includes("green-pump")
    ? "green-pump"
    : pathSegments.includes("foundry")
      ? "foundry"
      : "default";
  const activeVariant = variant ?? detectedVariant;
  const assets = footerAssets[activeVariant];
  return (
    <footer
      className="
        font-sans
        relative isolate z-10
        w-full
        min-h-[700px]
        overflow-visible
        bg-[#031725]
        xl:h-[988px]
        min-[1600px]:h-[1080px]
      "
    >
      {/* =====================================================
          BACKGROUND VIDEO / IMAGE
          GREEN PUMP:
          green-footer-pingpong.mp4
          FOUNDRY:
          foundry-footer-pingpong.mp4
          DEFAULT:
          footer1.png
          PING-PONG LOOP:
          Videolar ileri + geri birleştirildiği için
          native loop ile sürekli tekrar eder.
      ===================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 z-0
          overflow-hidden
        "
      >
        {assets.video ? (
          <video
            key={assets.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className={`
              absolute inset-0
              h-full w-full
              object-cover
              object-center
              ${
                activeVariant === "green-pump"
                  ? "xl:scale-[1.10] xl:-translate-y-[4%]"
                  : ""
              }
            `}
          >
            <source src={assets.video} type="video/mp4" />
          </video>
        ) : (
          <div
            className="
              absolute inset-0
              bg-cover
              bg-center
              bg-no-repeat
            "
            style={{
              backgroundImage: `url('${assets.image}')`,
            }}
          />
        )}
      </div>
      {/* =====================================================
          FIGMA BLUR
          Top: 62.4%
          Blur: 15px
          Background: #000000 / 20%
      ===================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 bottom-0
          top-[62.4%] z-[1]
          bg-black/20
          backdrop-blur-[15px]
        "
      />
      {/* =====================================================
          GREEN PUMP SVG
      ===================================================== */}
      <div
        className="
          pointer-events-none
          absolute z-30
          right-[24px]
          top-[-75px]
          w-[100px]
          sm:right-[60px]
          sm:w-[119px]
          sm:top-[-108px]
          xl:right-auto
          xl:left-[83.4028%]
          xl:top-[-11%]
          xl:w-[8.2639%]
        "
        style={{
          aspectRatio: "135 / 189",
        }}
      >
        <Image
          src="/footer/green-pump-logo.svg"
          alt="Green Pump"
          fill
          unoptimized
          sizes="(min-width: 1280px) 9vw, 135px"
          className="object-contain"
        />
      </div>
      {/* =====================================================
          SOL ÜST BAŞLIK
      ===================================================== */}
      <div
        className="
          absolute z-10
          left-6 top-[48px]
          w-[calc(100%-48px)]
          xl:left-[8.125%]
          xl:top-[6.3765%]
          xl:w-[45%]
          xl:h-[10.6275%]
        "
      >
        <h2
          className="
            m-0 font-sans
            text-[28px]
            font-normal
            leading-[100%]
            tracking-normal
            text-[#6DB7E0]
            sm:text-[32px]
            xl:text-[35px]
            min-[1600px]:text-[38.3px]
          "
          style={{
            fontFamily: "var(--font-sf-pro), Arial, sans-serif",
            fontWeight: 410,
            fontVariationSettings: '"wght" 410, "wdth" 132, "opsz" 28',
            letterSpacing: 0,
            ...(activeVariant === "foundry"
              ? {
                  // "g", "y", "p" gibi harflerin alt uzantılarını kesme.
                  lineHeight: 1.2,
                  paddingBottom: "0.15em",
                  backgroundImage:
                    "linear-gradient(180deg, #E30A17 0%, #7D060D 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
          }}
        >
          <span className="hidden xl:block">
            Powering global industries with
          </span>
          <span className="hidden xl:block">advanced fluid transfer</span>
          <span className="hidden xl:block">technologies.</span>
          <span className="xl:hidden">
            Powering global industries with advanced fluid transfer
            technologies.
          </span>
        </h2>
      </div>
      {/* =====================================================
          SEMPA LOGOSU
      ===================================================== */}
      <div
        className="
          absolute z-10
          left-[24px]
          top-[227px]
          h-[72px]
          w-[253px]
          xl:left-[8.125%]
          xl:top-[27.7%]
          xl:h-[7.8%]
          xl:w-[19%]
        "
      >
        <Image
          src={
            activeVariant === "foundry"
              ? "/footer/sempa-red.png"
              : "/footer/sempa-gray.png"
          }
          alt="SEMPA"
          fill
          unoptimized
          sizes="(min-width: 1280px) 19vw, 253px"
          className="object-contain object-left"
        />
      </div>
      {/* =====================================================
          ADRES VE E-POSTA
      ===================================================== */}
      <div
        className="
          absolute z-10
          left-[24px]
          top-[390px]
          w-[calc(100%-48px)]
          max-w-[380px]
          xl:left-[8.3333%]
          xl:top-[46.2551%]
          xl:w-[20.0694%]
          xl:max-w-none
        "
      >
        <address
          className="
            m-0 not-italic
            font-sans
            text-[12px]
            leading-[109%]
            tracking-normal
            text-[#6DB7E0]
            min-[1600px]:text-[13.1px]
          "
          style={{
            ...sfProRegular,
            letterSpacing: 0,
            ...(activeVariant === "foundry"
              ? {
                  lineHeight: 1.25,
                  paddingBottom: "0.15em",
                  backgroundImage:
                    "linear-gradient(180deg, #E30A17 0%, #7D060D 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
          }}
        >
          <span className="block">Büyükkayacık Organize Sanayi Bölgesi</span>
          <span className="block">Mahallesi 22. Sokak NO:4 42250</span>
          <span className="block">Selçuklu, Konya / Türkiye</span>
          <a
            href="mailto:info@sempapompa.com"
            className="
              block w-fit
              transition-colors duration-300
            "
            style={{
              color: activeVariant === "foundry" ? "transparent" : "#6DB7E0",
              ...(activeVariant === "foundry"
                ? {
                    backgroundImage:
                      "linear-gradient(180deg, #E30A17 0%, #7D060D 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : {}),
              textDecorationLine: "underline",
              textDecorationStyle: "solid",
              textDecorationColor:
                activeVariant === "foundry" ? "#7D060D" : "currentColor",
              textDecorationThickness: "auto",
              textUnderlineOffset: "2px",
              textDecorationSkipInk: "none",
            }}
          >
            info@sempapompa.com
          </a>
        </address>
      </div>
      {/* =====================================================
          TELEFON NUMARASI
      ===================================================== */}
      <div
        className="
          absolute z-10
          left-[24px]
          top-[455px]
          w-[180px]
          xl:left-[8.3333%]
          xl:top-[53.2389%]
          xl:w-[10.1389%]
          xl:h-[4.251%]
        "
      >
        <a
          href="tel:4446413"
          className="
            inline-block w-fit
            whitespace-nowrap
            font-sans
            text-[28px]
            leading-[139%]
            xl:text-[30px]
            min-[1600px]:text-[32.8px]
          "
          style={{
            fontFamily: "var(--font-sf-pro), Arial, sans-serif",
            fontWeight: 410,
            fontVariationSettings: '"wght" 410, "wdth" 132, "opsz" 30',
            letterSpacing: "-0.1em",
            color: activeVariant === "foundry" ? "transparent" : "#6DB7E0",
            ...(activeVariant === "foundry"
              ? {
                  backgroundImage:
                    "linear-gradient(180deg, #E30A17 0%, #7D060D 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
            textDecoration: "none",
            borderBottom:
              activeVariant === "foundry"
                ? "1px solid #7D060D"
                : "1px solid #6DB7E0",
            paddingBottom: "0px",
          }}
        >
          444 6 413
        </a>
      </div>
      {/* =====================================================
          I'M PUMP TECHNOLOGY
      ===================================================== */}
      <div
        className="
          absolute z-10
          right-6
          top-[57%]
          w-[180px]
          sm:w-[227px]
          xl:right-auto
          xl:left-[75.9028%]
          xl:top-[59.413%]
          xl:w-[15.7639%]
        "
        style={{
          aspectRatio: "227 / 44",
        }}
      >
        <Image
          src="/footer/slogan.png"
          alt="I'm Pump Technology"
          fill
          unoptimized
          sizes="(min-width: 1280px) 16vw, 227px"
          className="object-contain"
        />
      </div>
      {/* =====================================================
          TURKEY PUMP INDUSTRY
      ===================================================== */}
      <div
        className="
          absolute z-10
          right-[24px]
          top-[70%]
          w-[135px]
          sm:w-[146px]
          xl:right-auto
          xl:left-[81.3889%]
          xl:top-[69.8381%]
          xl:w-[10.1708%]
        "
        style={{
          aspectRatio: "146.46 / 74.37",
        }}
      >
        <Image
          src="/footer/turkey-pump-industry.png"
          alt="Turkey Pump Industry Export Leader"
          fill
          unoptimized
          sizes="(min-width: 1280px) 11vw, 146px"
          className="object-contain"
        />
      </div>
      {/* =====================================================
          FOOTER NAVIGATION
      ===================================================== */}
      <FooterNavColumn
        title="Corporate"
        links={corporateLinks}
        isFoundry={activeVariant === "foundry"}
        className="
          left-[24px]
          w-[185px]
          xl:left-[8.3333%]
          xl:w-[13%]
        "
      />
      <FooterNavColumn
        title="Production"
        links={productionLinks}
        isFoundry={activeVariant === "foundry"}
        className="
          left-[210px]
          xl:left-[21.4583%]
          xl:w-[8.3333%]
        "
      />
      <FooterNavColumn
        title="Product"
        links={productLinks}
        isFoundry={activeVariant === "foundry"}
        className="
          left-[360px]
          xl:left-[32.2917%]
          xl:w-[8.3333%]
        "
      />
      <FooterNavColumn
        title="Media"
        links={mediaLinks}
        isFoundry={activeVariant === "foundry"}
        className="
          left-[510px]
          w-[119px]
          xl:left-[43.125%]
          xl:w-[8.2639%]
        "
      />
      <FooterNavColumn
        title="Solutions"
        links={solutionsLinks}
        isFoundry={activeVariant === "foundry"}
        className="
          left-[650px]
          w-[93px]
          xl:left-[53.8889%]
          xl:w-[6.4583%]
        "
      />
      <FooterNavColumn
        title="Support"
        links={supportLinks}
        isFoundry={activeVariant === "foundry"}
        className="
          left-[775px]
          w-[93px]
          xl:left-[62.8472%]
          xl:w-[6.4583%]
        "
      />
      {/* =====================================================
          SOCIAL MEDIA
          GREEN PUMP:
          white-facebook.webp
          white-instagram.webp
          white-linkedin.webp
          white-youtube.webp
          FOUNDRY:
          red-facebook.webp
          red-instagram.webp
          red-linkedin.webp
          red-youtube.webp
      ===================================================== */}
      <div
        className="
          absolute z-20
          right-[24px]
          bottom-[75px]
          flex h-[26px] w-[112px]
          items-center
          justify-between
          xl:right-auto
          xl:bottom-auto
          xl:left-[71.3194%]
          xl:top-[89.4737%]
          xl:h-[1.80556vw]
          xl:w-[7.7778%]
        "
      >
        {socialLinks.map((social) => {
          const iconSrc = `/footer/${assets.socialPrefix}${social.file}.webp`;
          return (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="
                group relative block
                h-full
                w-[22.2143%]
                shrink-0
                cursor-pointer
                transition-transform
                duration-300 ease-out
                hover:-translate-y-[3px]
              "
            >
              <Image
                src={iconSrc}
                alt={social.name}
                fill
                unoptimized
                sizes="(min-width: 1280px) 2vw, 25px"
                className="
                  object-contain
                  transition-opacity
                  duration-300
                  group-hover:opacity-75
                "
              />
            </a>
          );
        })}
      </div>
      {/* =====================================================
          YASAL BAĞLANTILAR
      ===================================================== */}
      <div
        className="
          absolute z-20
          left-[24px]
          bottom-[65px]
          w-[calc(100%-48px)]
          xl:bottom-auto
          xl:left-[8.3333%]
          xl:top-[94.8381%]
          xl:w-[36.875%]
        "
      >
        <div
          className="
            flex flex-wrap
            items-center
            gap-x-[4px] gap-y-[4px]
            font-sans text-[12px]
            leading-[139%]
            xl:flex-nowrap
            xl:whitespace-nowrap
            min-[1600px]:text-[13.1px]
          "
          style={{
            fontFamily: "var(--font-sf-pro), Arial, sans-serif",
            fontWeight: 300,
            fontVariationSettings: '"wght" 300, "wdth" 132, "opsz" 12',
            letterSpacing: "-0.1em",
            color: activeVariant === "foundry" ? "#E30A17" : "#9EB7D0",
          }}
        >
          {legalLinks.map((link, index) => (
            <span
              key={link.label}
              className="inline-flex items-center gap-[4px]"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    color: activeVariant === "foundry" ? "#E30A17" : "#9EB7D0",
                    textDecoration: "none",
                    fontWeight: 300,
                  }}
                >
                  •
                </span>
              )}
              <a
                href={link.href}
                className="
                  inline-block cursor-pointer
                  transition-opacity duration-300
                  hover:opacity-70
                "
                style={{
                  color: activeVariant === "foundry" ? "#E30A17" : "#9EB7D0",
                  fontWeight: 300,
                  textDecorationLine: "underline",
                  textDecorationStyle: "solid",
                  textDecorationColor:
                    activeVariant === "foundry" ? "#E30A17" : "#9EB7D0",
                  textDecorationThickness: "0.6px",
                  textUnderlineOffset: "2px",
                  textDecorationSkipInk: "none",
                }}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </div>
      {/* =====================================================
          COPYRIGHT
      ===================================================== */}
      <div
        className="
          absolute z-10
          right-[24px]
          bottom-[25px]
          w-auto
          xl:right-auto
          xl:bottom-auto
          xl:left-[70.9028%]
          xl:top-[94.8381%]
          xl:w-[20.3472%]
        "
      >
        <p
          className="
            m-0 whitespace-nowrap
            font-sans
            text-[12px]
            leading-[109%]
            tracking-normal
            min-[1600px]:text-[13.1px]
          "
          style={{
            fontFamily: "var(--font-sf-pro), Arial, sans-serif",
            fontWeight: 410,
            fontVariationSettings: '"wght" 410, "wdth" 132, "opsz" 12',
            letterSpacing: 0,
            color: activeVariant === "foundry" ? "transparent" : "#4687B8",
            ...(activeVariant === "foundry"
              ? {
                  backgroundImage:
                    "linear-gradient(180deg, #E30A17 0%, #7D060D 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
          }}
        >
          © 2026 SEMPA. TÜM HAKLARI SAKLIDIR.
        </p>
      </div>
    </footer>
  );
}
