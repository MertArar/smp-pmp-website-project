"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import HomeMediaVideo from "./HomeMediaVideo";

const compactQuery = "(max-width: 1023px)";
function subscribe(listener: () => void) {
  const query = matchMedia(compactQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
export function useHomeCompact() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(compactQuery).matches,
    () => false,
  );
}
const blue = "bg-linear-to-b from-[#005eff] to-[#001ea2]";
const heading =
  "text-[clamp(28px,7.4vw,46px)] leading-[1.02] tracking-[-.05em] font-normal";
const light = "bg-linear-to-r from-[#e2f2ff] via-[#cce5ff] to-[#f7fbff]";
export function MobilePill({
  children,
  href,
  blueButton = false,
}: {
  children: ReactNode;
  href: string;
  blueButton?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{ color: blueButton ? "#F7F7F7" : "#27272A" }}
      className={`inline-flex min-h-11 max-w-full items-center gap-5 rounded-full border border-[#9eb7d080] py-1.5 pl-4 pr-1.5 text-[15px] leading-none shadow-[0_3px_18px_#005eff20] ${blueButton ? `${blue} text-white` : "bg-white/45 text-[#27272a]"}`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`size-8 shrink-0 rounded-full ${blue} shadow-[0_0_15px_#005eff55]`}
      />
    </Link>
  );
}
function FactoryMobileLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  return (
    <Link
      href={href}
      data-factory-mobile-link
      data-opening={opening}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        if (opening) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          router.push(href);
          return;
        }
        setOpening(true);
      }}
      style={{
        color: opening ? "#27272A" : "#F7F7F7",
        background: opening ? "#f7f7f7" : "linear-gradient(#005eff,#001ea2)",
      }}
      className="relative block h-11 w-full max-w-[190px] shrink-0 overflow-hidden rounded-full border border-[#9eb7d080] shadow-[0_4px_15px_#005eff30] transition-[background,color] duration-500"
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(11px,3.3vw,15px)] leading-none transition-[left] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ left: opening ? 44 : 14 }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        data-factory-orb
        onTransitionEnd={(event) => {
          if (event.propertyName === "left" && opening) router.push(href);
        }}
        className={`absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full shadow-[0_0_15px_#005eff55] transition-[left] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${blue}`}
        style={{ left: opening ? 6 : "calc(100% - 38px)" }}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          className={`text-white transition-opacity duration-300 ${opening ? "opacity-100" : "opacity-0"}`}
        >
          <path
            d="M5 19 19 5M5 5h14v14"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </span>
    </Link>
  );
}

export function MobileFactory() {
  const stats = [
    {
      value: "330+",
      label: "Employee Recruitment",
      copy: "A strong workforce driving our manufacturing excellence.",
      button: "Join Our Team",
      href: "/career",
    },
    {
      value: "132K",
      label: "Production Facility",
      copy: "Advanced engineering powered by a massive scale of manufacturing.",
      button: "Factory Tour",
      href: "/production",
    },
    {
      value: "100+",
      label: "Export Country",
      copy: "Bringing Sempa reliability to more than 100 countries globally.",
      button: "Export Map",
      href: "/global",
    },
  ];
  return (
    <section
      id="factory"
      className={`relative overflow-hidden px-4 pb-16 pt-14 text-[#0d5792] ${light}`}
    >
      <div className="mx-auto max-w-[720px]">
        <div className="mx-auto mb-10 h-24 w-36">
          <Image
            src="/home/solution-factory/koordinat.webp"
            width={144}
            height={100}
            alt="Engineering since 1972"
            unoptimized
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
        <h2 className={`${heading} text-center text-[#005eff]`}>
          High-Performance Pumping Solutions for Global Industries
        </h2>
        <p className="mx-auto mb-10 mt-6 max-w-xl text-center text-[16px] leading-[1.15] text-[#27272a]">
          Sempa Pompa delivers advanced engineering and innovative fluid
          transfer technologies tailored to the unique demands of diverse
          sectors.
        </p>
        {stats.map((s, i) => (
          <div key={s.value}>
            {i === 1 && (
              <HomeMediaVideo
                autoPlay
                muted
                loop
                playsInline
                src="/home/solution-factory/factory.webm"
                className="-my-3 h-52 w-full object-cover mix-blend-multiply md:h-72"
              />
            )}
            <article className="relative my-3 grid min-h-[178px] grid-cols-[39%_61%] rounded-[28px] border border-white/75 bg-white/20 md:min-h-[210px]">
              <div
                className={`flex flex-col justify-between rounded-[28px] p-4 text-white shadow-[0_8px_30px_#005eff40] ${blue}`}
              >
                <HomeMediaVideo
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={`/home/solution-factory/icon0${i + 1}.webm`}
                  className="size-9 object-contain mix-blend-screen"
                />
                <strong className="mt-3 text-[clamp(36px,10vw,66px)] font-normal leading-none tracking-[-.06em]">
                  {s.value}
                </strong>
                <span className="mt-1 max-w-28 text-sm leading-none">
                  {s.label}
                </span>
              </div>
              <div className="flex min-w-0 flex-col items-start justify-center gap-5 px-4 py-5">
                <p className="text-[14px] leading-[1.12] text-[#27272a] md:text-lg">
                  {s.copy}
                </p>
                <FactoryMobileLink href={s.href}>{s.button}</FactoryMobileLink>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
type MobileStackItem = {
  id: number;
  title: string;
  titleColor: string;
  background: string;
  tags: { id: string; text: string }[];
  description: string;
  buttonText: string;
  href: string;
  image: string;
  imageAlt: string;
};
export function MobileStack({ cards }: { cards: MobileStackItem[] }) {
  return (
    <section id="stack-cards" className={`relative px-4 pb-16 pt-14 ${light}`}>
      <div className="mx-auto max-w-[720px]">
        <p className="mb-10 text-center text-sm text-[#9eb7d0]">
          Scroll Down to Learn more
        </p>
        {cards.map((card, i) => (
          <article
            key={card.id}
            className="sticky mb-8 overflow-hidden rounded-[30px] p-6 pb-0 shadow-[0_-8px_20px_#75a8cd22] md:p-8 md:pb-0"
            style={{
              top: 16 + i * 12,
              background: card.background,
              color: card.titleColor,
            }}
          >
            <h2 className={`${heading} mb-6`}>{card.title}</h2>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded border border-current/30 px-2 py-1 text-[10px]"
                >
                  {t.text}
                </span>
              ))}
            </div>
            <p className="mb-5 mt-6 text-[17px] leading-[1.16] md:max-w-xl md:text-xl">
              {card.description}
            </p>
            <MobilePill href={card.href} blueButton>
              {card.buttonText}
            </MobilePill>
            <Image
              src={card.image}
              alt={card.imageAlt}
              width={620}
              height={540}
              sizes="(max-width:767px) 100vw, 720px"
              className="-mx-6 mt-8 h-[320px] w-[calc(100%+48px)] max-w-none rounded-t-[28px] object-cover md:-mx-8 md:h-[390px] md:w-[calc(100%+64px)]"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
export function MobileGlobal({ assetBase }: { assetBase: string }) {
  return (
    <section
      id="sempa-global"
      className={`overflow-hidden px-5 pb-12 pt-8 ${light}`}
    >
      <div className="mx-auto max-w-[700px]">
        <h2 className={`${heading} font-semibold text-[#005eff]`}>
          Sempa Global
          <br />
          Powering the World
        </h2>
        <div className="relative mx-auto mt-20 h-[330px] w-full max-w-[480px] md:mt-14 md:h-[430px]">
          <span className="absolute left-0 top-0 text-[clamp(100px,30vw,175px)] leading-none tracking-[-.08em] text-[#4687b8]">
            100+
          </span>
          <div className="absolute left-1/2 top-14 size-[220px] -translate-x-1/2 overflow-hidden rounded-full [mask-image:radial-gradient(circle_closest-side,black_92%,transparent_96%)] md:top-20 md:size-[290px]">
            <HomeMediaVideo
              autoPlay
              muted
              loop
              playsInline
              src={`${assetBase}/sempa-global.webm`}
              className="size-full scale-[1.12] object-cover"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 rounded-[28px] border border-[#9eb7d070] bg-white/25 p-6 backdrop-blur-lg">
            <h3 className="text-[28px] leading-none text-[#1d2049]">
              Export
              <br />
              Countries
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-[1.12] text-[#0d5792]">
              Delivering fluid engineering excellence to industries worldwide.
            </p>
          </div>
        </div>
        <hr className="my-12 border-[#9eb7d0]" />
        <div className="mx-auto w-3/4 rounded-[28px] border border-[#9eb7d070] bg-white/20 p-6">
          <h3 className="text-[28px] leading-none text-[#1d2049]">
            Export
            <br />
            Rate
          </h3>
          <p className="mt-3 text-sm leading-tight text-[#27272a]">
            Powering industries worldwide.
          </p>
        </div>
        <div className="relative mx-auto mb-8 mt-4 h-[300px] max-w-[510px] md:h-[360px]">
          <span className="absolute bottom-0 right-0 text-[clamp(105px,31vw,180px)] leading-none tracking-[-.09em] text-[#4687b8]">
            68%
          </span>
          <div
            data-home-mobile-forklift
            className="absolute inset-y-0 -left-[37%] w-[130%]"
          >
            <Image
              src={`${assetBase}/forklift.png`}
              alt="SEMPA export container"
              fill
              sizes="(max-width:767px) 100vw,510px"
              className="object-contain object-left"
            />
          </div>
        </div>
        <article className="rounded-[30px] border border-[#9eb7d070] bg-white/35 p-6">
          <h3 className="text-[27px] leading-none text-[#1d2049]">
            Join Sempa Global
          </h3>
          <p className="mb-6 mt-4 text-[15px] leading-[1.15] text-[#0d5792]">
            Sempa, a manufacturer and investor of pump technologies, invites you
            to the world pump movement. Make your pre-application now.
          </p>
          <MobilePill href="/global">Apply</MobilePill>
        </article>
      </div>
    </section>
  );
}
export function MobileSmartPump() {
  return (
    <section
      id="smart-pump"
      className={`overflow-hidden pb-20 pt-16 text-[#0d5792] ${light}`}
    >
      <div className="mx-auto max-w-[720px]">
        <div className="px-6">
          <h2 className={heading}>
            Smart Pump
            <br />
            Selection Assistant
          </h2>
          <p className="mt-6 text-[17px] leading-[1.16] text-[#9eb7d0] md:max-w-xl md:text-xl">
            Discover the most efficient pumping solution in seconds. Simply
            enter your technical parameters such as flow rate, pressure, and
            fluid type, and let our advanced configurator select the ideal Sempa
            pump for your specific industry needs.
          </p>
        </div>
        <div className="relative mt-12 h-[390px] md:h-[550px]">
          <div className="absolute left-6 top-0 z-10">
            <MobilePill href="/all-products">Pump Selection</MobilePill>
          </div>
          <Image
            src="/home/smart-pump/robot-el.webp"
            alt="Robotic hand holding a Sempa pump"
            fill
            sizes="(max-width:767px) 115vw,800px"
            className="object-contain object-right mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-[70%] w-[32%] bg-linear-to-r from-transparent to-[#f6fbff] backdrop-blur-[12px] [mask-image:linear-gradient(to_right,transparent,black)]"
          />
        </div>
        <div
          className="relative z-10 -mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none]"
          aria-label="Pump selection steps"
        >
          {[
            "Input System Parameters",
            "Smart Matching Connection",
            "View Performance Curves",
            "Export Technical Data",
          ].map((label) => (
            <article
              key={label}
              className="flex min-h-[230px] w-[66vw] max-w-[320px] shrink-0 snap-start items-center rounded-[36px] border border-white/70 bg-linear-to-br from-[#a7cbff80] to-white/60 p-8 text-[28px] leading-[1.05] tracking-[-.04em] shadow-[inset_0_0_30px_#005eff0a] md:w-[310px]"
            >
              {label}
            </article>
          ))}
        </div>
        <div className="mx-5 mt-10 flex min-h-[180px] items-center gap-4 rounded-[30px] border-l border-t border-white bg-white/30 p-6">
          <h3 className="w-1/2 text-[27px] leading-[1.05] tracking-[-.04em]">
            Find the Perfect Match for Your Project
          </h3>
          <HomeMediaVideo
            autoPlay
            muted
            loop
            playsInline
            src="/home/solution-factory/fingerprint.mp4"
            className="w-1/2 object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </section>
  );
}
type MobileNewsItem = {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
};
export function MobileNews({ items }: { items: MobileNewsItem[] }) {
  const [day, setDay] = useState(0);
  return (
    <section
      id="home-news"
      className="px-4 pb-20 pt-8"
      style={{
        backgroundImage:
          "linear-gradient(to bottom,transparent 0%,#fff 80%),linear-gradient(to right,#e2f2ff,#cce5ff,#f7fbff)",
      }}
    >
      <div className="mx-auto max-w-[720px]">
        <h2 className={`${heading} text-center text-[#005eff]`}>
          Latest News &amp;
          <br />
          Announcements
        </h2>
        <p className="mb-14 mt-6 px-3 text-center text-[17px] leading-[1.17] text-[#9eb7d0]">
          Stay up-to-date with our latest global projects, technological
          innovations, and corporate developments. Discover how Sempa is making
          an impact across industries worldwide.
        </p>
        {items.map((item) => (
          <article
            key={item.id}
            className="mb-6 rounded-[30px] border border-[#9eb7d080] bg-[#f7f7f7] p-5 md:p-8"
          >
            <p className="mb-10 text-[16px] text-[#9eb7d0]">{item.category}</p>
            <h3 className="text-[29px] leading-[1.04] tracking-[-.04em] text-[#0d5792] md:text-[38px]">
              {item.title}
            </h3>
            <p className="mb-12 mt-6 text-[16px] leading-[1.15] text-[#27272a]">
              {item.description}
            </p>
            <MobilePill href={item.href} blueButton>
              Discover
            </MobilePill>
            <p className="mb-7 mt-6 text-[16px] text-[#9eb7d0]">{item.date}</p>
            <Image
              src={item.image}
              alt={item.title}
              width={720}
              height={620}
              sizes="(max-width:767px) 100vw,720px"
              className="aspect-[1/1.08] w-full rounded-[25px] object-cover md:aspect-[1.3]"
            />
          </article>
        ))}
        <div className="my-12 text-center">
          <MobilePill href="/news">View All</MobilePill>
        </div>
        <h2 className={`${heading} mt-20 text-center text-[#0d5792]`}>
          Upcoming Events
          <br />
          Discover Now
        </h2>
        <div
          className="my-10 flex items-center gap-3 overflow-x-auto pb-2 [scrollbar-width:none]"
          aria-label="Event date"
        >
          <button
            type="button"
            aria-label="Previous event date"
            className="p-3 text-3xl text-[#9eb7d0]"
            onClick={() => setDay(Math.max(0, day - 1))}
          >
            ←
          </button>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => (
            <button
              key={label}
              aria-pressed={day === i}
              onClick={() => setDay(i)}
              className={`flex min-h-[90px] min-w-[58px] flex-col justify-center gap-2 rounded-2xl p-2 text-lg ${day === i ? `${blue} text-white` : "text-[#9eb7d0]"}`}
            >
              <span>{22 + i}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        {[0, 1].map((i) => (
          <Link
            href="/news"
            key={i}
            style={{ color: "#F7F7F7" }}
            className={`mb-4 flex items-center gap-4 rounded-[30px] p-5 text-white ${blue}`}
          >
            <Image
              src="/home/home-news/event.webp"
              width={150}
              height={150}
              alt="SEMPA trade show"
              sizes="150px"
              className="aspect-square w-[40%] rounded-[20px] object-cover"
            />
            <div className="min-w-0">
              <h3 className="text-[20px] leading-[1.04] md:text-[28px]">
                We Are Participating in the IFAT Munich Trade Show
              </h3>
              <p className="mt-5 text-sm text-[#9eb7d0]">05.05.2027</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function MobileTrust({
  logos,
}: {
  logos: { src: string; alt: string }[];
}) {
  return (
    <section id="global-trust" className="overflow-hidden bg-white pb-16 pt-12">
      <div className="relative mx-auto mb-8 w-full max-w-[680px] px-3">
        <Image
          data-mobile-trust-image
          src="/home/global-trust/ikon.png"
          alt="SEMPA engineering trusted worldwide"
          width={1128}
          height={680}
          sizes="(max-width:767px) 100vw,680px"
          className="h-auto w-full object-contain"
        />
      </div>
      <h2 className={`${heading} px-6 text-center text-[#005eff]`}>
        Proven Performance.
        <br />
        Global Trust.
      </h2>
      <div
        aria-label="Trusted partners"
        className="mx-auto mt-12 flex max-w-[760px] snap-x gap-9 overflow-x-auto px-6 pb-6 [scrollbar-width:none]"
      >
        {logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={180}
            height={110}
            sizes="(max-width:767px) 140px,180px"
            className="h-24 w-[140px] shrink-0 snap-center object-contain md:h-28 md:w-[180px]"
          />
        ))}
      </div>
    </section>
  );
}
