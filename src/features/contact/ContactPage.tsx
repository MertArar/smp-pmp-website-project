"use client";
import Image from "next/image";
import ContactInteractiveMap from "./ContactInteractiveMap";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useViewportVideo from "@/components/media/useViewportVideo";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  FiArrowDownRight,
  FiFileText,
  FiImage,
  FiMapPin,
  FiTruck,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { LuPlane, LuTrainFront } from "react-icons/lu";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const contactEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
type ContactDirection = "up" | "left" | "right";
const contactVariants: Variants = {
  hidden: ({
    direction,
    reduced,
  }: {
    direction: ContactDirection;
    reduced: boolean;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -32
        : direction === "right"
          ? 32
          : 0,
    y: reduced ? 0 : direction === "up" ? 30 : 0,
  }),
  visible: { opacity: 1, x: 0, y: 0 },
};
function contactReveal(
  direction: ContactDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.17,
) {
  return {
    variants: contactVariants,
    custom: { direction, reduced },
    initial: reduced ? (false as const) : ("hidden" as const),
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.88,
      delay: reduced ? 0 : delay,
      ease: contactEase,
    },
  };
}
function contactHeroEnter(reduced: boolean, delay: number, y = 20) {
  return {
    initial: reduced ? false : { opacity: 0, y, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 0.9,
      delay: reduced ? 0 : delay,
      ease: contactEase,
    },
  };
}

const headquartersAddress =
  "Büyükkayacık Organize Sanayi Bölgesi Mahallesi 22. Sokak No:4, 42250 Selçuklu, Konya, Türkiye";
const plazaAddress =
  "Büsan Özel Organize Sanayi Bölgesi 10644. Sk. No:43-45-47, Karatay, Konya, Türkiye";
// Verified Maps pin avoids the street-only query resolving to another Konya district.
const locationCoordinates: Record<string, string> = {
  [headquartersAddress]: "37.995635,32.6233606",
  [plazaAddress]: "37.919543,32.542606",
};
const offices = [
  { id: "plaza", title: "SEMPA PLAZA" },
  { id: "istanbul", title: "OFFICE ISTANBUL" },
  { id: "egypt", title: "OFFICE EYGPT" },
] as const;
const salesFilterRows = [
  ["ALL", "EUROPE", "NORTH AMERICA"],
  ["ASIAN PASIFIC", "NORTH AFRICA"],
  ["SOUTH AMERICA", "MIDDLE EAST"],
  ["ASIA", "AFRICA", "CIS"],
  ["DOMECTIC SALES TEAM"],
] as const;
type SalesFilter = (typeof salesFilterRows)[number][number];
type SalesContact = {
  name: string;
  role: string;
  email: string;
  region: SalesFilter | "GLOBAL";
};
const salesContacts: SalesContact[] = [
  {
    name: "Sempa Türkiye",
    role: "Forwarding By Secretariat",
    email: "info@sempapompa.com",
    region: "DOMECTIC SALES TEAM",
  },
  {
    name: "Sema Nur Topbaş",
    role: "Africa Regional Manager",
    email: "s.turan@sempapompa.com",
    region: "AFRICA",
  },
  {
    name: "Aslı Bilirgen",
    role: "Asia Regional Manager",
    email: "a.bilirgen@sempapompa.com",
    region: "ASIA",
  },
  {
    name: "Muzaffer Ferahkaya",
    role: "Export Manager",
    email: "mu.ferahkaya@sempapompa.com",
    region: "GLOBAL",
  },
  {
    name: "Mehmet Toklu",
    role: "Middle East Sales Representative",
    email: "m.toklu@sempapompa.com",
    region: "MIDDLE EAST",
  },
  {
    name: "Mehmet Enes İnan",
    role: "Export Sales Technical Manager",
    email: "e.inan@sempapompa.com",
    region: "GLOBAL",
  },
  {
    name: "Mehmet Ferahkaya",
    role: "Sales Director",
    email: "me.ferahkaya@sempapompa.com",
    region: "GLOBAL",
  },
  {
    name: "İlayda Beyza Onat",
    role: "CIS Regional Manager",
    email: "ib.ferahkaya@sempapompa.com",
    region: "CIS",
  },
];
function matchesSalesFilter(contact: SalesContact, filter: SalesFilter) {
  if (filter === "ALL" || contact.region === filter) return true;
  // Unassigned export leads remain available in international divisions.
  if (filter !== "DOMECTIC SALES TEAM" && contact.region === "GLOBAL")
    return true;
  if (filter === "NORTH AFRICA") return contact.region === "AFRICA";
  if (filter === "ASIAN PASIFIC") return contact.region === "ASIA";
  return false;
}
function googleDirections(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationCoordinates[address] ?? address)}&travelmode=driving`;
}
function MapServiceLinks({
  address,
  location,
}: {
  address: string;
  location: string;
}) {
  const isPlaza = address === plazaAddress;
  const destination = encodeURIComponent(
    locationCoordinates[address] ?? address,
  );
  return (
    <nav
      className="contact-map-services [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[flex-shrink:0] [.contact-page_&]:[gap:calc(12_*_var(--location-unit))] [.contact-page_&_a]:[display:grid]! [.contact-page_&_a]:[place-items:center] [.contact-page_&_a]:[width:calc(34_*_var(--location-unit))] [.contact-page_&_a]:[height:calc(34_*_var(--location-unit))] [.contact-page_&_a]:[border-radius:8px] [.contact-page_&_a]:[transition:transform_200ms_ease] [.contact-page_&_svg]:[width:calc(30_*_var(--location-unit))] [.contact-page_&_svg]:[height:calc(30_*_var(--location-unit))] [.contact-page_&_a:hover]:[transform:translateY(-3px)] [.contact-page_.contact-office-content_&]:[gap:calc(6_*_var(--location-unit))] max-[768px]:[.contact-page_&_a]:[width:36px] max-[768px]:[.contact-page_&_a]:[height:36px] motion-reduce:[.contact-page_&_a]:[transition:none] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:6px] max-[768px]:[.contact-page_.contact-headquarters_&_a]:[width:28px] max-[768px]:[.contact-page_.contact-headquarters_&_a]:[height:32px] max-[768px]:[.contact-page_.contact-headquarters_&_svg]:[width:24px] max-[768px]:[.contact-page_.contact-headquarters_&_svg]:[height:24px] max-[768px]:[.contact-page_.contact-office-content_&_a]:[width:28px] max-[768px]:[.contact-page_.contact-office-content_&_a]:[height:32px] max-[768px]:[.contact-page_.contact-office-content_&_svg]:[width:24px] max-[768px]:[.contact-page_.contact-office-content_&_svg]:[height:24px]"
      aria-label={`${location} map services`}
    >
      <a
        href={`https://yandex.com/maps/?mode=routes&rtext=~${destination}&rtt=auto`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${location}: Get directions with Yandex Maps`}
        title="Yandex Maps"
      >
        <Image
          src={isPlaza ? "/Contact/yandex-white.png" : "/Contact/yandex.png"}
          alt=""
          width={30}
          height={30}
          className="h-[calc(30_*_var(--location-unit))] w-[calc(30_*_var(--location-unit))] object-contain max-[768px]:h-6 max-[768px]:w-6"
          aria-hidden="true"
        />
      </a>
      <a
        href={googleDirections(address)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${location}: Get directions with Google Maps`}
        title="Google Maps"
      >
        <Image
          src={isPlaza ? "/Contact/google-white.png" : "/Contact/google.png"}
          alt=""
          width={30}
          height={30}
          className="h-[calc(30_*_var(--location-unit))] w-[calc(30_*_var(--location-unit))] object-contain max-[768px]:h-6 max-[768px]:w-6"
          aria-hidden="true"
        />
      </a>
      <a
        href={`https://maps.apple.com/directions?destination=${destination}&mode=driving`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${location}: Get directions with Apple Maps`}
        title="Apple Maps"
      >
        <Image
          src={isPlaza ? "/Contact/apple-white.png" : "/Contact/apple.png"}
          alt=""
          width={30}
          height={30}
          className="h-[calc(30_*_var(--location-unit))] w-[calc(30_*_var(--location-unit))] object-contain max-[768px]:h-6 max-[768px]:w-6"
          aria-hidden="true"
        />
      </a>
    </nav>
  );
}
function LocationMap({
  address,
  location,
  compact = false,
}: {
  address: string;
  location: string;
  compact?: boolean;
}) {
  const isHeadquarters = address === headquartersAddress;

  return (
    <div
      className={twContactPage(
        `contact-location-map${compact ? " contact-location-map--compact" : ""}`,
      )}
    >
      {isHeadquarters ? (
        <ContactInteractiveMap
          latitude={37.995635}
          longitude={32.6233606}
          location={location}
        />
      ) : (
        <Image
          src="/contact/map.webp"
          alt={`${location} location map`}
          fill
          sizes={
            compact
              ? "(max-width: 767px) 85vw, (max-width: 1023px) 45vw, 340px"
              : "(max-width: 1023px) 85vw, 616px"
          }
        />
      )}
      <a
        className="contact-directions [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:calc(18_*_var(--location-unit))] [.contact-page_&]:[right:calc(18_*_var(--location-unit))] [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[justify-content:center] [.contact-page_&]:[gap:calc(10_*_var(--location-unit))] [.contact-page_&]:[min-height:calc(41_*_var(--location-unit))] [.contact-page_&]:[padding-top:calc(10_*_var(--location-unit))] [.contact-page_&]:[padding-right:calc(15_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(10_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(15_*_var(--location-unit))] [.contact-page_&]:[border:0.5px_solid_#ffffffb3] [.contact-page_&]:[border-radius:calc(12_*_var(--location-unit))] [.contact-page_&]:[background:#122c4ec4] [.contact-page_&]:[backdrop-filter:blur(12px)] [.contact-page_&]:[color:#f7f7f7]! [.contact-page_&]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&]:[white-space:nowrap] [.contact-page_&]:[transition:background_200ms_ease,_box-shadow_200ms_ease] [.contact-page_&_svg]:[width:calc(20_*_var(--location-unit))] [.contact-page_&_svg]:[height:calc(20_*_var(--location-unit))] [.contact-page_&_svg]:[color:#459dff]! [.contact-page_&_svg]:[filter:drop-shadow(0_0_5px_#005effb3)] [.contact-page_&:hover]:[background:#123e6fe6] [.contact-page_&:hover]:[box-shadow:0_0_15px_#005eff40] [.contact-page_.contact-location-map--compact_&&]:[top:50%] [.contact-page_.contact-location-map--compact_&&]:[left:50%] [.contact-page_.contact-location-map--compact_&&]:[right:auto] [.contact-page_.contact-location-map--compact_&&]:[transform:translate(-50%,_-50%)] max-[768px]:[.contact-page_&]:[top:12px] max-[768px]:[.contact-page_&]:[right:12px] max-[768px]:[.contact-page_&]:[min-height:44px] max-[768px]:[.contact-page_&]:[padding-top:10px] max-[768px]:[.contact-page_&]:[padding-right:12px] max-[768px]:[.contact-page_&]:[padding-bottom:10px] max-[768px]:[.contact-page_&]:[padding-left:12px] motion-reduce:[.contact-page_&]:[transition:none] max-[768px]:[.contact-page_.contact-headquarters_&]:[top:calc(100%_+_14px)] max-[768px]:[.contact-page_.contact-headquarters_&]:[left:50%] max-[768px]:[.contact-page_.contact-headquarters_&]:[right:auto] max-[768px]:[.contact-page_.contact-headquarters_&]:[transform:translateX(-50%)] max-[768px]:[.contact-page_.contact-headquarters_&]:[min-height:36px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-top:8px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-right:14px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-bottom:8px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-left:14px] max-[768px]:[.contact-page_.contact-headquarters_&]:[border-color:#f7f7f7b3] max-[768px]:[.contact-page_.contact-headquarters_&]:[background:linear-gradient(90deg,_#ffffff40,_#7db7ff66)] max-[768px]:[.contact-page_.contact-headquarters_&]:[color:#f7f7f7]!"
        href={googleDirections(address)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get Directions to ${location}`}
      >
        <FiMapPin aria-hidden="true" />
        Get Directions
      </a>
    </div>
  );
}
function LocationHours({
  address,
  location,
}: {
  address: string;
  location: string;
}) {
  return (
    <div className="contact-location-footer [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:flex-end] [.contact-page_&]:[justify-content:space-between] [.contact-page_&]:[gap:calc(20_*_var(--location-unit))] [.contact-page_&]:[margin-top:calc(24_*_var(--location-unit))] [.contact-page_.contact-office-content_&]:[gap:calc(12_*_var(--location-unit))] [.contact-page_.contact-office-content_&]:[margin-top:calc(20_*_var(--location-unit))]! max-[1200px]:[.contact-page_.contact-office-content_&]:[flex-wrap:wrap] max-[1024px]:[.contact-page_.contact-office-content_&]:[flex-wrap:nowrap] max-[768px]:[.contact-page_&]:[align-items:flex-start] max-[768px]:[.contact-page_&]:[flex-wrap:wrap] max-[768px]:[.contact-page_&]:[gap:18px] max-[768px]:[.contact-page_.contact-office-content_&]:[flex-wrap:nowrap] max-[768px]:[.contact-page_.contact-office-content_&]:[gap:8px] max-[768px]:[.contact-page_.contact-headquarters_&]:[order:3] max-[768px]:[.contact-page_.contact-headquarters_&]:[margin-top:0] max-[768px]:[.contact-page_.contact-headquarters_&]:[flex-wrap:nowrap] max-[768px]:[.contact-page_.contact-headquarters_&]:[align-items:flex-end] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:8px] max-[768px]:[.contact-page_.contact-office-content_&]:[align-items:flex-end]">
      <div className="contact-business-hours [.contact-page_&_>_p:last-child]:[margin-top:0] [.contact-page_&_>_p:last-child]:[margin-right:0] [.contact-page_&_>_p:last-child]:[margin-bottom:0] [.contact-page_&_>_p:last-child]:[margin-left:0] [.contact-page_&_>_p:last-child]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_>_p:last-child]:[line-height:1]! [.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_.contact-office-content_&_>_p:last-child]:[line-height:1.12]! max-[1024px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:15px]! max-[768px]:[.contact-page_&_>_p:last-child]:[font-size:14px]! max-[768px]:[.contact-page_&_>_p:last-child]:[line-height:1.2]! max-[768px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:12px]! max-[768px]:[.contact-page_.contact-headquarters_&_>_p:last-child]:[font-size:12px]! max-[768px]:[.contact-page_.contact-headquarters_&_>_p:last-child]:[line-height:1.12]!">
        <p className="contact-info-label [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(10_*_var(--location-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&]:[font-weight:410]! [.contact-page_&]:[line-height:1.12]! [.contact-page_&]:[letter-spacing:0]">
          Business Hours
        </p>
        <p>
          Monday–Friday:
          <br />
          8:00 a.m.–6:00 p.m.
        </p>
      </div>
      <MapServiceLinks address={address} location={location} />
    </div>
  );
}
const contactTitle = [
  "You can contact us regarding",
  "our products, projects, technical",
  "support, and partnerships.",
];

export default function ContactPage() {
  const reduced = useReducedMotion() ?? false;
  const headingRef = useRepeatingTitle(850);
  const particlesRef = useRef<HTMLVideoElement>(null);
  const lightRef = useRef<HTMLVideoElement>(null);
  const earthRef = useRef<HTMLVideoElement>(null);
  useViewportVideo(particlesRef);
  useViewportVideo(lightRef);
  useViewportVideo(earthRef);
  const [openOffice, setOpenOffice] = useState<string | null>("plaza");
  const [salesFilter, setSalesFilter] = useState<SalesFilter>("ALL");
  const salesScrollRef = useRef<HTMLDivElement>(null);
  const [salesScrollbar, setSalesScrollbar] = useState({
    visible: false,
    progress: 0,
  });
  const visibleSalesContacts = salesContacts.filter((contact) =>
    matchesSalesFilter(contact, salesFilter),
  );
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [formFeedback, setFormFeedback] = useState<string | null>(null);
  function addAttachments(files: File[]) {
    const accepted = files.filter((file) =>
      /\.(pdf|jpe?g|png|docx?)$/i.test(file.name),
    );
    setAttachmentError(
      accepted.length < files.length
        ? "Please select PDF, JPG, JPEG, PNG, DOC or DOCX files."
        : null,
    );
    setAttachments((current) => {
      const next = [...current];
      for (const file of accepted) {
        if (
          !next.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified,
          )
        )
          next.push(file);
      }
      return next;
    });
    setFormFeedback(null);
  }
  function submitContactPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.elements.namedItem("corporateEmail") as HTMLInputElement;
    const phone = form.elements.namedItem("phoneNumber") as HTMLInputElement;
    const phoneDigits = phone.value.replace(/\D/g, "");
    email.setCustomValidity(
      email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
        ? "Please enter a valid corporate email address."
        : "",
    );
    phone.setCustomValidity(
      phone.value &&
        (phoneDigits.length < 7 ||
          phoneDigits.length > 15 ||
          !/^[+\d\s().-]+$/.test(phone.value))
        ? "Please enter a valid phone number with 7–15 digits."
        : "",
    );
    for (const name of ["fullName", "companyName"]) {
      const input = form.elements.namedItem(name) as HTMLInputElement;
      input.setCustomValidity(
        input.value.trim() ? "" : "Please complete this field.",
      );
    }
    if (!form.reportValidity()) {
      setFormFeedback(
        "Please complete the required contact fields and agree to the Privacy Policy.",
      );
      return;
    }
    // Frontend preview only. Do not transmit or persist any form data or files.
    setFormFeedback(
      "Sending is not enabled yet. Your information and files have not been sent.",
    );
  }
  function selectSalesFilter(filter: SalesFilter) {
    setSalesFilter(filter);
    // A new division starts at its first contact, even after scrolling another list.
    salesScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }
  function scrollSalesToPointer(clientY: number, track: HTMLDivElement) {
    const scroll = salesScrollRef.current;
    if (!scroll) return;
    const rect = track.getBoundingClientRect();
    const thumbHeight = rect.height * 0.55;
    const travel = rect.height - thumbHeight;
    if (travel <= 0) return;
    const thumbTop = Math.max(
      0,
      Math.min(travel, clientY - rect.top - thumbHeight / 2),
    );
    scroll.scrollTop =
      (thumbTop / travel) * (scroll.scrollHeight - scroll.clientHeight);
  }
  useEffect(() => {
    const scroll = salesScrollRef.current;
    const panel = scroll?.parentElement;
    const lastCard = scroll?.querySelector<HTMLElement>(
      ".contact-sales-person:last-child",
    );
    if (!scroll || !panel || !lastCard) return;
    // Allow just one row of travel when the final record sits under the fixed blur.
    const updateScrollLimit = () => {
      const lastRect = lastCard.getBoundingClientRect();
      const cards = Array.from(
        scroll.querySelectorAll<HTMLElement>(".contact-sales-person"),
      );
      const previousRow = cards
        .reverse()
        .find((card) => card.getBoundingClientRect().top < lastRect.top - 1);
      const rowStep = previousRow
        ? lastRect.top - previousRow.getBoundingClientRect().top
        : 0;
      const lastBottom =
        lastRect.bottom - scroll.getBoundingClientRect().top + scroll.scrollTop;
      const blurHeight =
        panel.querySelector<HTMLElement>(".contact-sales-panel-fade")
          ?.offsetHeight ?? 0;
      const maxTravel =
        lastBottom > scroll.clientHeight - blurHeight ? rowStep : 0;
      const trailingSpace = Math.max(
        0,
        scroll.clientHeight + maxTravel - lastBottom,
      );
      scroll.style.setProperty("--sales-trailing-space", `${trailingSpace}px`);
    };
    const updateScrollbar = () => {
      const scrollRange = scroll.scrollHeight - scroll.clientHeight;
      setSalesScrollbar({
        visible: scrollRange > 1,
        progress: scrollRange > 1 ? scroll.scrollTop / scrollRange : 0,
      });
    };
    const update = () => {
      updateScrollLimit();
      updateScrollbar();
    };
    update();
    scroll.addEventListener("scroll", updateScrollbar, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    observer.observe(lastCard);
    return () => {
      observer.disconnect();
      scroll.removeEventListener("scroll", updateScrollbar);
    };
  }, [salesFilter]);
  return (
    <main className="contact-page font-sans [html:has(&)]:[overflow-x:clip] [body:has(&)]:[overflow-x:clip] [--contact-unit:clamp(0.71px,_0.0694444444vw,_1.777778px)] [width:100%] [min-height:100svh] [overflow-x:clip] [background:#ddeeff] [letter-spacing:0] max-[1024px]:[--contact-unit:1px] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]">
      <section
        className="contact-hero [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:1] [.contact-page_&]:[isolation:isolate] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:calc(805_*_var(--contact-unit))] [.contact-page_&]:[overflow:visible] [.contact-page_&]:[background:#061824] [.contact-page_&::after]:[content:''] [.contact-page_&::after]:[position:absolute] [.contact-page_&::after]:[z-index:3] [.contact-page_&::after]:[top:auto] [.contact-page_&::after]:[right:0] [.contact-page_&::after]:[bottom:0] [.contact-page_&::after]:[left:0] [.contact-page_&::after]:[height:1px] [.contact-page_&::after]:[background:#9bdcff] [.contact-page_&::after]:[box-shadow:0_0_8px_#48b8ff80] [.contact-page_&::after]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[height:850px] max-[768px]:[.contact-page_&]:[height:860px] max-[768px]:[.contact-page_&]:[min-height:0] max-[768px]:[.contact-page_&]:[padding-top:0]"
        aria-labelledby="contact-title"
      >
        <Image
          src="/contact/contact-hero.webp"
          alt=""
          fill
          sizes="100vw"
          preload
          className="contact-hero-background [.contact-page_&]:[z-index:0] [.contact-page_&]:[object-fit:cover] [.contact-page_&]:[object-position:right_top] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[height:660px]! max-[1024px]:[.contact-page_&]:[object-position:70%_top] max-[768px]:[.contact-page_&]:[top:250px]! max-[768px]:[.contact-page_&]:[left:50%]! max-[768px]:[.contact-page_&]:[right:auto]! max-[768px]:[.contact-page_&]:[width:min(160%,_640px)]! max-[768px]:[.contact-page_&]:[max-width:none] max-[768px]:[.contact-page_&]:[height:auto]! max-[768px]:[.contact-page_&]:[object-fit:contain] max-[768px]:[.contact-page_&]:[object-position:right_top] max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_20%,_#000_100%)] max-[768px]:[.contact-page_&]:[transform:translateX(-59.4%)] max-[768px]:[.contact-page_&]:[clip-path:inset(0_0_28%_0)]"
        />

        <video
          ref={particlesRef}
          className="contact-particles [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:calc(337_*_var(--contact-unit))] [.contact-page_&]:[left:calc(-149_*_var(--contact-unit))] [.contact-page_&]:[width:calc(908_*_var(--contact-unit))] [.contact-page_&]:[height:calc(510_*_var(--contact-unit))] [.contact-page_&]:[max-width:none] [.contact-page_&]:[object-fit:contain] [.contact-page_&]:[mix-blend-mode:screen] [.contact-page_&]:[clip-path:inset(0_0_calc(42_*_var(--contact-unit))_0)] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:310px] max-[1024px]:[.contact-page_&]:[left:-180px] max-[1024px]:[.contact-page_&]:[width:760px] max-[1024px]:[.contact-page_&]:[height:428px] max-[768px]:[.contact-page_&]:[top:325px] max-[768px]:[.contact-page_&]:[left:-80px] max-[768px]:[.contact-page_&]:[width:480px] max-[768px]:[.contact-page_&]:[height:270px] motion-reduce:[.contact-page_&]:[visibility:hidden]"
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src="/contact/Particle Sphere.webm" type="video/webm" />
        </video>

        <motion.h1
          {...contactHeroEnter(reduced, 0.12, 18)}
          ref={headingRef}
          id="contact-title"
          aria-label={contactTitle.join(" ")}
          className="contact-title [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:4] [.contact-page_&]:[top:calc(222_*_var(--contact-unit))] [.contact-page_&]:[left:calc(120_*_var(--contact-unit))] [.contact-page_&]:[width:calc(618_*_var(--contact-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[color:#f7f7f7]! [.contact-page_&]:[font-size:calc(36_*_var(--contact-unit))]! [.contact-page_&]:[font-weight:410]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[letter-spacing:0] [.contact-page_&_span]:[display:block]! max-[1024px]:[.contact-page_&]:[top:180px] max-[1024px]:[.contact-page_&]:[left:6%] max-[1024px]:[.contact-page_&]:[width:60%] max-[1024px]:[.contact-page_&]:[font-size:clamp(22px,_3vw,_30px)]! max-[768px]:[.contact-page_&]:[top:140px] max-[768px]:[.contact-page_&]:[left:28px] max-[768px]:[.contact-page_&]:[width:calc(100%_-_56px)] max-[768px]:[.contact-page_&]:[font-size:clamp(24px,_6.65vw,_30px)]! max-[768px]:[.contact-page_&_span]:[white-space:normal] max-[768px]:[.contact-page_&]:[max-width:340px] max-[768px]:[.contact-page_&]:[line-height:1.04]! max-[768px]:[.contact-page_&_span]:[display:contents]!"
        >
          <em
            aria-hidden="true"
            className="contact-title-trail pointer-events-none absolute inset-0 block not-italic text-[#69caff] opacity-0 [text-shadow:0_0_0.35em_#39aaff]"
          >
            {contactTitle.map((line, index) => (
              <span key={line}>
                {index > 0 && " "}
                {line}
              </span>
            ))}
          </em>
          <em
            aria-hidden="true"
            className="contact-title-text relative block not-italic"
          >
            {contactTitle.map((line, index) => (
              <span key={line}>
                {index > 0 && " "}
                {line}
              </span>
            ))}
          </em>
        </motion.h1>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            #contact-title[data-title-revealing] .contact-title-text {
              animation: contact-title-arrival 520ms cubic-bezier(.16, 1, .3, 1) both;
            }
            #contact-title[data-title-revealing] .contact-title-trail {
              animation: contact-title-afterglow 660ms 110ms cubic-bezier(.18, .75, .26, 1) both;
            }
          }
          @keyframes contact-title-arrival {
            0% { opacity: 0; transform: translateX(-72vw) skewX(-18deg) scaleX(1.2); }
            52% { opacity: 1; transform: translateX(.15em) skewX(-3deg); }
            100% { opacity: 1; transform: none; }
          }
          @keyframes contact-title-afterglow {
            0% { opacity: 0; transform: translateX(-58vw) skewX(-18deg) scaleX(1.25); }
            28% { opacity: .55; transform: translateX(-.85em) skewX(-10deg) scaleX(1.04); }
            100% { opacity: 0; transform: none; }
          }
          .contact-page .contact-hero::after {
            content: none !important;
          }
          .contact-page .contact-transport-card {
            background: rgba(255, 255, 255, .13) !important;
            border: 1px solid rgba(255, 255, 255, .3) !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, .19), 0 12px 30px rgba(0, 0, 0, .16) !important;
            backdrop-filter: blur(32px) saturate(100%) !important;
            -webkit-backdrop-filter: blur(32px) saturate(100%) !important;
          }
          @media (min-width: 769px) {
            .contact-page .contact-transport-card h3,
            .contact-page .contact-transport-card p,
            .contact-page .contact-transport-card strong {
              color: #f7fbff !important;
              text-shadow: 0 1px 8px rgba(0, 0, 0, .7);
            }
          }
          @media (max-width: 768px) {
            .contact-page .contact-transport-card {
              background: rgba(255, 255, 255, .84) !important;
            }
          }
        `}</style>

        <div
          className="contact-bottom-atmosphere [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:2] [.contact-page_&]:[top:auto] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[height:calc(260_*_var(--contact-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_transparent_0%,_#20384d80_24%,_#24374bd9_100%)] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[height:330px] max-[768px]:[.contact-page_&]:[top:480px] max-[768px]:[.contact-page_&]:[bottom:0] max-[768px]:[.contact-page_&]:[height:auto] max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_transparent,_#173a60cc_18%,_#24374b_100%)]"
          aria-hidden="true"
        />

        <div
          className="contact-light-line [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:3] [.contact-page_&]:[top:calc(563_*_var(--contact-unit))] [.contact-page_&]:[left:0] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:calc(48_*_var(--contact-unit))] [.contact-page_&]:[overflow:hidden] [.contact-page_&]:[mix-blend-mode:screen] [.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_35%,_#000_65%,_transparent)] [.contact-page_&]:[pointer-events:none] [.contact-page_&_video]:[position:absolute] [.contact-page_&_video]:[top:50%] [.contact-page_&_video]:[left:0] [.contact-page_&_video]:[width:100%] [.contact-page_&_video]:[max-width:none] [.contact-page_&_video]:[height:auto] [.contact-page_&_video]:[aspect-ratio:16_/_9] [.contact-page_&_video]:[transform:translateY(-50%)] [.contact-page_&_video]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:548px] max-[768px]:[.contact-page_&]:[top:486px] max-[768px]:[.contact-page_&]:[height:52px] max-[768px]:[.contact-page_&_video]:[width:1440px] max-[768px]:[.contact-page_&_video]:[left:50%] max-[768px]:[.contact-page_&_video]:[transform:translate(-50%,_-50%)] motion-reduce:[.contact-page_&]:[visibility:hidden]"
          aria-hidden="true"
        >
          <video
            ref={lightRef}
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
          >
            <source
              src="/contact/0_Light_Line_1920x1080.webm"
              type="video/webm"
            />
          </video>
        </div>

        <motion.section
          {...contactHeroEnter(reduced, 0.55, 24)}
          className="contact-logistics [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:4] [.contact-page_&]:[top:calc(587_*_var(--contact-unit))] [.contact-page_&]:[left:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[padding-top:calc(26_*_var(--contact-unit))] [.contact-page_&]:[padding-right:calc(120_*_var(--contact-unit))] [.contact-page_&]:[padding-bottom:calc(38_*_var(--contact-unit))] [.contact-page_&]:[padding-left:calc(120_*_var(--contact-unit))] [.contact-page_&]:[isolation:isolate] [.contact-page_&::before]:[content:''] [.contact-page_&::before]:[position:absolute] [.contact-page_&::before]:[z-index:-1] [.contact-page_&::before]:[top:0] [.contact-page_&::before]:[right:0] [.contact-page_&::before]:[bottom:0] [.contact-page_&::before]:[left:0] [.contact-page_&::before]:[background:linear-gradient(110deg,_#183547b3,_#42577380_55%,_#29333bc4)] [.contact-page_&::before]:[backdrop-filter:blur(8px)] [.contact-page_&::before]:[pointer-events:none] [.contact-page_&_h2]:[margin-top:0] [.contact-page_&_h2]:[margin-right:0] [.contact-page_&_h2]:[margin-bottom:0] [.contact-page_&_h2]:[margin-left:0] [.contact-page_&_h2]:[color:#f7f7f7]! [.contact-page_&_h2]:[font-size:calc(20_*_var(--contact-unit))]! [.contact-page_&_h2]:[font-weight:410]! [.contact-page_&_h2]:[line-height:1.2]! [.contact-page_&_h2]:[letter-spacing:-0.04em] max-[1024px]:[.contact-page_&]:[top:572px] max-[1024px]:[.contact-page_&]:[padding-top:30px] max-[1024px]:[.contact-page_&]:[padding-right:6%] max-[1024px]:[.contact-page_&]:[padding-bottom:56px] max-[1024px]:[.contact-page_&]:[padding-left:6%] max-[768px]:[.contact-page_&]:[position:absolute] max-[768px]:[.contact-page_&]:[top:510px] max-[768px]:[.contact-page_&]:[bottom:0] max-[768px]:[.contact-page_&]:[padding-top:20px] max-[768px]:[.contact-page_&]:[padding-right:28px] max-[768px]:[.contact-page_&]:[padding-bottom:0] max-[768px]:[.contact-page_&]:[padding-left:28px] max-[768px]:[.contact-page_&_h2]:[max-width:18em] max-[768px]:[.contact-page_&_h2]:[font-size:18px]! max-[768px]:[.contact-page_&]:[z-index:auto] max-[768px]:[.contact-page_&]:[isolation:auto] max-[768px]:[.contact-page_&::before]:[display:none]! max-[768px]:[.contact-page_&_h2]:[position:relative] max-[768px]:[.contact-page_&_h2]:[z-index:4] max-[768px]:[.contact-page_&_h2]:[line-height:1.12]!"
          aria-labelledby="contact-logistics-title"
        >
          <div className="contact-logistics-inner [.contact-page_&]:[max-width:calc(744_*_var(--contact-unit))] max-[1024px]:[.contact-page_&]:[max-width:67%] max-[768px]:[.contact-page_&]:[max-width:none]">
            <p className="contact-eyebrow [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(10_*_var(--contact-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[color:#9eb7d0]! [.contact-page_&]:[font-size:calc(12_*_var(--contact-unit))]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&]:[font-size:11px]! max-[768px]:[.contact-page_&]:[line-height:1.3]! max-[768px]:[.contact-page_.contact-logistics_&]:[position:relative] max-[768px]:[.contact-page_.contact-logistics_&]:[z-index:4] max-[768px]:[.contact-page_.contact-logistics_&]:[font-size:10px]! max-[768px]:[.contact-page_.contact-logistics_&]:[margin-bottom:8px]">
              LOGISTICS &amp; TRANSPORTATION GUIDE
            </p>
            <h2 id="contact-logistics-title">
              Transportation to the Konya Integrated Plant
            </h2>
            <div
              className="contact-transport-cards [.contact-page_&]:[position:absolute] [.contact-page_&]:[left:calc(120_*_var(--contact-unit))] [.contact-page_&]:[bottom:calc(-28_*_var(--contact-unit))] [.contact-page_&]:[width:calc(600_*_var(--contact-unit))] [.contact-page_&]:[max-width:calc(100%_-_480_*_var(--contact-unit))] [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [.contact-page_&]:[gap:calc(12_*_var(--contact-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] max-[1024px]:[.contact-page_&]:[left:6%] max-[1024px]:[.contact-page_&]:[bottom:-28px] max-[1024px]:[.contact-page_&]:[width:60%] max-[1024px]:[.contact-page_&]:[max-width:60%] max-[1024px]:[.contact-page_&]:[gap:10px] max-[768px]:[.contact-page_&]:[position:absolute] max-[768px]:[.contact-page_&]:[width:190px] max-[768px]:[.contact-page_&]:[max-width:190px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:8px] max-[768px]:[.contact-page_&]:[margin-top:0] max-[768px]:[.contact-page_&]:[z-index:6] max-[768px]:[.contact-page_&]:[left:50%] max-[768px]:[.contact-page_&]:[bottom:-104px] max-[768px]:[.contact-page_&]:[margin-right:0] max-[768px]:[.contact-page_&]:[margin-bottom:0] max-[768px]:[.contact-page_&]:[margin-left:0] max-[768px]:[.contact-page_&]:[transform:translateX(-50%)]"
              lang="tr"
            >
              <article className="contact-transport-card [.contact-page_&]:[min-width:0] [.contact-page_&]:[padding-top:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-right:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-bottom:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-left:calc(12_*_var(--contact-unit))] [.contact-page_&]:[border:1px_solid_#ffffff26] [.contact-page_&]:[border-radius:calc(11_*_var(--contact-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_#ffffff1f,_#ffffff66)] [.contact-page_&]:[box-shadow:inset_0_1px_12px_#d4eaff18,_0_12px_26px_#005eff12] [.contact-page_&]:[backdrop-filter:blur(20px)] [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_h3]:[display:flex]! [.contact-page_&_h3]:[align-items:center] [.contact-page_&_h3]:[gap:calc(7_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-top:0] [.contact-page_&_h3]:[margin-right:0] [.contact-page_&_h3]:[margin-bottom:calc(8_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-left:0] [.contact-page_&_h3]:[color:#f7f7f7]! [.contact-page_&_h3]:[font-size:calc(12_*_var(--contact-unit))]! [.contact-page_&_h3]:[font-weight:410]! [.contact-page_&_h3]:[line-height:1.2]! [.contact-page_&_h3_svg]:[flex-shrink:0] [.contact-page_&_h3_svg]:[width:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[height:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[color:#c1ddfa]! [.contact-page_&_h3_svg]:[stroke-width:1.5] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[color:#c6def5]! [.contact-page_&_p]:[font-size:calc(11.5_*_var(--contact-unit))]! [.contact-page_&_p]:[line-height:1.25]! [.contact-page_&_strong]:[color:#f7f7f7]! [.contact-page_&_strong]:[font-weight:410]! max-[1024px]:[.contact-page_&]:[padding-top:12px] max-[1024px]:[.contact-page_&]:[padding-right:10px] max-[1024px]:[.contact-page_&]:[padding-bottom:12px] max-[1024px]:[.contact-page_&]:[padding-left:10px] max-[1024px]:[.contact-page_&_h3]:[flex-wrap:wrap] max-[1024px]:[.contact-page_&_h3]:[font-size:12px]! max-[768px]:[.contact-page_&]:[padding-top:10px] max-[768px]:[.contact-page_&]:[padding-right:14px] max-[768px]:[.contact-page_&]:[padding-bottom:10px] max-[768px]:[.contact-page_&]:[padding-left:14px] max-[768px]:[.contact-page_&_h3]:[flex-wrap:nowrap] max-[768px]:[.contact-page_&_h3]:[font-size:11px]! max-[768px]:[.contact-page_&_h3]:[margin-bottom:6px] max-[768px]:[.contact-page_&_p]:[font-size:11px]! max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_#d2e6ff59,_#d2e6ff9c)] max-[768px]:[.contact-page_&_h3]:[color:#18375b]! max-[768px]:[.contact-page_&_p]:[color:#005eff]! max-[768px]:[.contact-page_&_strong]:[color:#0d5792]! max-[768px]:[.contact-page_&_h3_svg]:[width:14px] max-[768px]:[.contact-page_&_h3_svg]:[height:14px] max-[768px]:[.contact-page_&_h3_svg]:[color:#18375b]!">
                <h3>
                  <LuPlane aria-hidden="true" />
                  Havalimanı
                </h3>
                <p>
                  Konya Havalimanı:
                  <br />
                  <strong>12 km (15 dk)</strong>
                </p>
              </article>
              <article className="contact-transport-card [.contact-page_&]:[min-width:0] [.contact-page_&]:[padding-top:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-right:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-bottom:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-left:calc(12_*_var(--contact-unit))] [.contact-page_&]:[border:1px_solid_#ffffff26] [.contact-page_&]:[border-radius:calc(11_*_var(--contact-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_#ffffff1f,_#ffffff66)] [.contact-page_&]:[box-shadow:inset_0_1px_12px_#d4eaff18,_0_12px_26px_#005eff12] [.contact-page_&]:[backdrop-filter:blur(20px)] [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_h3]:[display:flex]! [.contact-page_&_h3]:[align-items:center] [.contact-page_&_h3]:[gap:calc(7_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-top:0] [.contact-page_&_h3]:[margin-right:0] [.contact-page_&_h3]:[margin-bottom:calc(8_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-left:0] [.contact-page_&_h3]:[color:#f7f7f7]! [.contact-page_&_h3]:[font-size:calc(12_*_var(--contact-unit))]! [.contact-page_&_h3]:[font-weight:410]! [.contact-page_&_h3]:[line-height:1.2]! [.contact-page_&_h3_svg]:[flex-shrink:0] [.contact-page_&_h3_svg]:[width:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[height:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[color:#c1ddfa]! [.contact-page_&_h3_svg]:[stroke-width:1.5] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[color:#c6def5]! [.contact-page_&_p]:[font-size:calc(11.5_*_var(--contact-unit))]! [.contact-page_&_p]:[line-height:1.25]! [.contact-page_&_strong]:[color:#f7f7f7]! [.contact-page_&_strong]:[font-weight:410]! max-[1024px]:[.contact-page_&]:[padding-top:12px] max-[1024px]:[.contact-page_&]:[padding-right:10px] max-[1024px]:[.contact-page_&]:[padding-bottom:12px] max-[1024px]:[.contact-page_&]:[padding-left:10px] max-[1024px]:[.contact-page_&_h3]:[flex-wrap:wrap] max-[1024px]:[.contact-page_&_h3]:[font-size:12px]! max-[768px]:[.contact-page_&]:[padding-top:10px] max-[768px]:[.contact-page_&]:[padding-right:14px] max-[768px]:[.contact-page_&]:[padding-bottom:10px] max-[768px]:[.contact-page_&]:[padding-left:14px] max-[768px]:[.contact-page_&_h3]:[flex-wrap:nowrap] max-[768px]:[.contact-page_&_h3]:[font-size:11px]! max-[768px]:[.contact-page_&_h3]:[margin-bottom:6px] max-[768px]:[.contact-page_&_p]:[font-size:11px]! max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_#d2e6ff59,_#d2e6ff9c)] max-[768px]:[.contact-page_&_h3]:[color:#18375b]! max-[768px]:[.contact-page_&_p]:[color:#005eff]! max-[768px]:[.contact-page_&_strong]:[color:#0d5792]! max-[768px]:[.contact-page_&_h3_svg]:[width:14px] max-[768px]:[.contact-page_&_h3_svg]:[height:14px] max-[768px]:[.contact-page_&_h3_svg]:[color:#18375b]!">
                <h3>
                  <LuTrainFront aria-hidden="true" />
                  Hızlı Tren{" "}
                  <span className="contact-yht [.contact-page_&]:[margin-left:calc(-3_*_var(--contact-unit))] [.contact-page_&]:[color:#65b5ff]! max-[768px]:[.contact-page_&]:[color:#005eff]!">
                    (YHT)
                  </span>
                </h3>
                <p>
                  Selçuklu YHT Garı:
                  <br />
                  <strong>18 km (20 dk)</strong>
                </p>
              </article>
              <article className="contact-transport-card [.contact-page_&]:[min-width:0] [.contact-page_&]:[padding-top:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-right:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-bottom:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-left:calc(12_*_var(--contact-unit))] [.contact-page_&]:[border:1px_solid_#ffffff26] [.contact-page_&]:[border-radius:calc(11_*_var(--contact-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_#ffffff1f,_#ffffff66)] [.contact-page_&]:[box-shadow:inset_0_1px_12px_#d4eaff18,_0_12px_26px_#005eff12] [.contact-page_&]:[backdrop-filter:blur(20px)] [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_h3]:[display:flex]! [.contact-page_&_h3]:[align-items:center] [.contact-page_&_h3]:[gap:calc(7_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-top:0] [.contact-page_&_h3]:[margin-right:0] [.contact-page_&_h3]:[margin-bottom:calc(8_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-left:0] [.contact-page_&_h3]:[color:#f7f7f7]! [.contact-page_&_h3]:[font-size:calc(12_*_var(--contact-unit))]! [.contact-page_&_h3]:[font-weight:410]! [.contact-page_&_h3]:[line-height:1.2]! [.contact-page_&_h3_svg]:[flex-shrink:0] [.contact-page_&_h3_svg]:[width:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[height:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[color:#c1ddfa]! [.contact-page_&_h3_svg]:[stroke-width:1.5] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[color:#c6def5]! [.contact-page_&_p]:[font-size:calc(11.5_*_var(--contact-unit))]! [.contact-page_&_p]:[line-height:1.25]! [.contact-page_&_strong]:[color:#f7f7f7]! [.contact-page_&_strong]:[font-weight:410]! max-[1024px]:[.contact-page_&]:[padding-top:12px] max-[1024px]:[.contact-page_&]:[padding-right:10px] max-[1024px]:[.contact-page_&]:[padding-bottom:12px] max-[1024px]:[.contact-page_&]:[padding-left:10px] max-[1024px]:[.contact-page_&_h3]:[flex-wrap:wrap] max-[1024px]:[.contact-page_&_h3]:[font-size:12px]! max-[768px]:[.contact-page_&]:[padding-top:10px] max-[768px]:[.contact-page_&]:[padding-right:14px] max-[768px]:[.contact-page_&]:[padding-bottom:10px] max-[768px]:[.contact-page_&]:[padding-left:14px] max-[768px]:[.contact-page_&_h3]:[flex-wrap:nowrap] max-[768px]:[.contact-page_&_h3]:[font-size:11px]! max-[768px]:[.contact-page_&_h3]:[margin-bottom:6px] max-[768px]:[.contact-page_&_p]:[font-size:11px]! max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_#d2e6ff59,_#d2e6ff9c)] max-[768px]:[.contact-page_&_h3]:[color:#18375b]! max-[768px]:[.contact-page_&_p]:[color:#005eff]! max-[768px]:[.contact-page_&_strong]:[color:#0d5792]! max-[768px]:[.contact-page_&_h3_svg]:[width:14px] max-[768px]:[.contact-page_&_h3_svg]:[height:14px] max-[768px]:[.contact-page_&_h3_svg]:[color:#18375b]!">
                <h3>
                  <FiTruck aria-hidden="true" />
                  Otoyol / Çevre Yolu
                </h3>
                <p>
                  Konya-Ankara Ç. Yolu:
                  <br />
                  <strong>2 km mesafede</strong>
                </p>
              </article>
            </div>
          </div>
        </motion.section>

        <Image
          src="/contact/musteri-temsilcisi.webp"
          alt="Sempa müşteri temsilcisi"
          width={303}
          height={303}
          unoptimized
          className="contact-representative [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:5] [.contact-page_&]:[top:calc(502_*_var(--contact-unit))] [.contact-page_&]:[left:calc(992_*_var(--contact-unit))] [.contact-page_&]:[width:calc(303_*_var(--contact-unit))] [.contact-page_&]:[height:calc(303_*_var(--contact-unit))] [.contact-page_&]:[object-fit:contain] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:auto] max-[1024px]:[.contact-page_&]:[bottom:0] max-[1024px]:[.contact-page_&]:[left:auto] max-[1024px]:[.contact-page_&]:[right:2%] max-[1024px]:[.contact-page_&]:[width:260px] max-[1024px]:[.contact-page_&]:[height:260px] max-[768px]:[.contact-page_&]:[top:570px] max-[768px]:[.contact-page_&]:[bottom:auto] max-[768px]:[.contact-page_&]:[right:auto] max-[768px]:[.contact-page_&]:[width:290px] max-[768px]:[.contact-page_&]:[height:290px] max-[768px]:[.contact-page_&]:[left:50%] max-[768px]:[.contact-page_&]:[transform:translateX(-50%)]"
        />
      </section>

      <div className="contact-locations [.contact-page_&]:[--location-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:0] [.contact-page_&]:[padding-top:calc(60_*_var(--location-unit))] [.contact-page_&]:[padding-right:24px] [.contact-page_&]:[padding-bottom:calc(90_*_var(--location-unit))] [.contact-page_&]:[padding-left:24px] [.contact-page_&]:[background:radial-gradient(ellipse_at_25%_60%,_#b1cce955,_transparent_52%),_radial-gradient(ellipse_at_85%_78%,_#ffffff80,_transparent_48%),_linear-gradient(180deg,_#ddeeff_0%,_#d5e9fd_32%,_#e7f3ff_72%,_#f2f9ff_100%)] [.contact-page_&]:[color:#000]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_a:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_a:focus-visible]:[outline-offset:4px] max-[1200px]:[.contact-page_&]:[--location-unit:1px] max-[768px]:[.contact-page_&]:[padding-top:140px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:50px] max-[768px]:[.contact-page_&]:[padding-left:20px]">
        <div className="contact-locations-inner [.contact-page_&]:[width:100%] [.contact-page_&]:[max-width:calc(1200_*_var(--location-unit))] [.contact-page_&]:[margin-left:auto] [.contact-page_&]:[margin-right:auto]">
          <motion.section
            {...contactReveal("left", 0, reduced, 0.14)}
            className="contact-headquarters contact-location-glass [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:minmax(0,_1fr)_minmax(0,_calc(616_*_var(--location-unit)))] [.contact-page_&]:[gap:calc(40_*_var(--location-unit))] [.contact-page_&]:[min-height:calc(411_*_var(--location-unit))] [.contact-page_&]:[padding-top:calc(35_*_var(--location-unit))] [.contact-page_&]:[padding-right:calc(35_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(35_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(35_*_var(--location-unit))] [.contact-page_&_h2]:[margin-top:0] [.contact-page_&_h2]:[margin-right:0] [.contact-page_&_h2]:[margin-bottom:calc(30_*_var(--location-unit))] [.contact-page_&_h2]:[margin-left:0] [.contact-page_&_h2]:[font-size:calc(20_*_var(--location-unit))]! [.contact-page_&_h2]:[font-weight:410]! [.contact-page_&_h2]:[line-height:1]! max-[1200px]:[.contact-page_&]:[grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)] max-[1024px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1024px]:[.contact-page_&]:[gap:32px] max-[1024px]:[.contact-page_&]:[padding-top:30px] max-[1024px]:[.contact-page_&]:[padding-right:30px] max-[1024px]:[.contact-page_&]:[padding-bottom:30px] max-[1024px]:[.contact-page_&]:[padding-left:30px] max-[768px]:[.contact-page_&]:[padding-top:26px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:26px] max-[768px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&]:[gap:26px] [.contact-page_&]:[border:0.5px_solid_#f7f7f7] [.contact-page_&]:[border-radius:calc(30_*_var(--location-unit))] [.contact-page_&]:[background:#ffffff40] [.contact-page_&]:[box-shadow:inset_0_1px_18px_#ffffff30,_0_8px_30px_#4274a308] [.contact-page_&]:[backdrop-filter:blur(30px)]"
            aria-labelledby="contact-headquarters-title"
          >
            <div className="contact-headquarters-details max-[768px]:[.contact-page_.contact-headquarters_>_&]:[order:2]">
              <h2 id="contact-headquarters-title">HEADQUARTERS</h2>
              <dl className="contact-info-list [.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:calc(25_*_var(--location-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&_dt]:[margin-top:0] [.contact-page_&_dt]:[margin-right:0] [.contact-page_&_dt]:[margin-bottom:calc(10_*_var(--location-unit))] [.contact-page_&_dt]:[margin-left:0] [.contact-page_&_dt]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&_dt]:[font-weight:410]! [.contact-page_&_dt]:[line-height:1.12]! [.contact-page_&_dt]:[letter-spacing:0] [.contact-page_&_dd]:[margin-top:0] [.contact-page_&_dd]:[margin-right:0] [.contact-page_&_dd]:[margin-bottom:0] [.contact-page_&_dd]:[margin-left:0] [.contact-page_&_dd]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_dd]:[font-weight:410]! [.contact-page_&_dd]:[line-height:1]! [.contact-page_&_dd]:[overflow-wrap:anywhere] max-[1024px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1.3fr_1fr_0.7fr] max-[1024px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[1024px]:[.contact-page_&_dd]:[line-height:1.2]! max-[1024px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:none]! max-[768px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[768px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:inline]! max-[768px]:[.contact-page_&_dd]:[font-size:14px]! max-[768px]:[.contact-page_&_dd]:[line-height:1.2]!">
                <div>
                  <dt>Address</dt>
                  <dd lang="tr">
                    Büyükkayacık Organize Sanayi
                    <br />
                    Bölgesi Mahallesi 22. Sokak No:4
                    <br />
                    42250 Selçuklu, Konya / Türkiye
                  </dd>
                </div>
                <div>
                  <dt>E-Mail</dt>
                  <dd>
                    <a href="mailto:info@sempapompa.com">info@sempapompa.com</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a
                      className="contact-location-phone [.contact-page_&]:[color:#0d5792]! [.contact-page_&]:[font-size:calc(25_*_var(--location-unit))]! [.contact-page_&]:[font-weight:540]! [.contact-page_&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[white-space:nowrap] [.contact-page_.contact-office-communication_&]:[font-size:calc(20_*_var(--location-unit))]! max-[768px]:[.contact-page_.contact-office-communication_&]:[font-size:18px]!"
                      href="tel:4446413"
                    >
                      444 6 413
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="contact-headquarters-map-column [.contact-page_&]:[min-width:0] max-[768px]:[.contact-page_&]:[display:contents]!">
              <LocationMap
                address={headquartersAddress}
                location="Headquarters"
              />
              <LocationHours
                address={headquartersAddress}
                location="Headquarters"
              />
            </div>
          </motion.section>

          <motion.section
            {...contactReveal("up", 0.05, reduced, 0.12)}
            className="contact-offices [.contact-page_&]:[position:relative] [.contact-page_&]:[isolation:isolate] [.contact-page_&]:[margin-top:calc(24_*_var(--location-unit))] [.contact-page_&]:[min-height:calc(648_*_var(--location-unit))] max-[1024px]:[.contact-page_&]:[padding-bottom:180px] max-[768px]:[.contact-page_&]:[padding-bottom:0] max-[768px]:[.contact-page_&]:[min-height:0] max-[768px]:[.contact-page_&]:[margin-top:24px] max-[768px]:[.contact-page_&]:[padding-top:190px]"
            aria-label="Offices"
          >
            <Image
              src="/contact/farbrika-logo.webp"
              alt=""
              width={3840}
              height={2160}
              sizes="(max-width: 767px) 150vw, (max-width: 1023px) 100vw, 1152px"
              className="contact-factory [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:0] [.contact-page_&]:[top:calc(8_*_var(--location-unit))] [.contact-page_&]:[left:calc(76_*_var(--location-unit))] [.contact-page_&]:[width:calc(1152_*_var(--location-unit))] [.contact-page_&]:[max-width:none] [.contact-page_&]:[height:auto] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:auto] max-[1024px]:[.contact-page_&]:[bottom:-40px] max-[1024px]:[.contact-page_&]:[left:0] max-[1024px]:[.contact-page_&]:[width:100%] max-[768px]:[.contact-page_&]:[bottom:auto] max-[768px]:[.contact-page_&]:[left:-5%] max-[768px]:[.contact-page_&]:[width:110%] max-[768px]:[.contact-page_&]:[top:-25px]"
            />
            <div
              className="contact-factory-atmosphere [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[background:radial-gradient(ellipse_at_45%_60%,_#17396518,_transparent_60%)] [.contact-page_&]:[pointer-events:none] max-[768px]:[.contact-page_&]:[display:none]!"
              aria-hidden="true"
            />
            <div className="contact-office-grid [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:2] [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [.contact-page_&]:[align-items:start] [.contact-page_&]:[gap:calc(15_*_var(--location-unit))] max-[1024px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1024px]:[.contact-page_&]:[gap:16px]">
              {offices.map((office, index) => {
                const isOpen = openOffice === office.id;
                return (
                  <motion.article
                    {...contactReveal("up", index * 0.1, reduced, 0.12)}
                    className="contact-office contact-location-glass [.contact-page_&]:[min-width:0] [.contact-page_&]:[overflow:hidden] [.contact-page_&[data-open='true']]:[background:linear-gradient(145deg,_#ffffff40_0%,_#ffffff25_55%,_#16315840_100%)] [.contact-page_&]:[border:0.5px_solid_#f7f7f7] [.contact-page_&]:[border-radius:calc(30_*_var(--location-unit))] [.contact-page_&]:[background:#ffffff40] [.contact-page_&]:[box-shadow:inset_0_1px_18px_#ffffff30,_0_8px_30px_#4274a308] [.contact-page_&]:[backdrop-filter:blur(30px)]"
                    data-open={isOpen}
                    key={office.id}
                  >
                    <h2 className="contact-office-heading [.contact-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_button:focus-visible]:[outline-offset:-6px] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&_button]:[display:flex]! [.contact-page_&_button]:[align-items:center] [.contact-page_&_button]:[justify-content:space-between] [.contact-page_&_button]:[gap:calc(10_*_var(--location-unit))] [.contact-page_&_button]:[width:100%] [.contact-page_&_button]:[min-height:calc(101_*_var(--location-unit))] [.contact-page_&_button]:[padding-top:calc(35_*_var(--location-unit))] [.contact-page_&_button]:[padding-right:calc(25_*_var(--location-unit))] [.contact-page_&_button]:[padding-bottom:calc(35_*_var(--location-unit))] [.contact-page_&_button]:[padding-left:calc(25_*_var(--location-unit))] [.contact-page_&_button]:[border:0] [.contact-page_&_button]:[background:transparent] [.contact-page_&_button]:[color:#000]! [.contact-page_&_button]:[font-style:inherit] [.contact-page_&_button]:[font-variant:inherit] [.contact-page_&_button]:[font-weight:410]! [.contact-page_&_button]:[font-stretch:inherit]! [.contact-page_&_button]:[font-size:calc(20_*_var(--location-unit))]! [.contact-page_&_button]:[line-height:1]! [.contact-page_&_button]:[font-family:inherit]! [.contact-page_&_button]:[font-feature-settings:inherit] [.contact-page_&_button]:[font-variation-settings:inherit]! [.contact-page_&_button]:[letter-spacing:-0.04em] [.contact-page_&_button]:[text-align:left] [.contact-page_&_button]:[cursor:pointer] [.contact-page_&_button:focus-visible]:[border-radius:calc(30_*_var(--location-unit))] max-[1200px]:[.contact-page_&_button]:[font-size:17px]! max-[1200px]:[.contact-page_&_button]:[padding-left:20px] max-[1200px]:[.contact-page_&_button]:[padding-right:20px] max-[1024px]:[.contact-page_&_button]:[font-size:20px]! max-[1024px]:[.contact-page_&_button]:[padding-left:25px] max-[1024px]:[.contact-page_&_button]:[padding-right:25px] max-[768px]:[.contact-page_&_button]:[padding-top:28px] max-[768px]:[.contact-page_&_button]:[padding-right:20px] max-[768px]:[.contact-page_&_button]:[padding-bottom:28px] max-[768px]:[.contact-page_&_button]:[padding-left:20px] max-[768px]:[.contact-page_&_button]:[min-height:88px] max-[768px]:[.contact-page_&_button]:[font-size:18px]!">
                      <button
                        id={`contact-office-${office.id}-trigger`}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`contact-office-${office.id}-panel`}
                        onClick={() => setOpenOffice(isOpen ? null : office.id)}
                      >
                        <span>{office.title}</span>
                        <span className="contact-office-arrow [.contact-page_&]:[display:grid]! [.contact-page_&]:[place-items:center] [.contact-page_&]:[flex:0_0_calc(30_*_var(--location-unit))] [.contact-page_&]:[width:calc(30_*_var(--location-unit))] [.contact-page_&]:[height:calc(30_*_var(--location-unit))] [.contact-page_&]:[border-radius:50%] [.contact-page_&]:[background:linear-gradient(145deg,_#005eff,_#0033c8)] [.contact-page_&]:[box-shadow:0_0_12px_#005eff66,_0_3px_8px_#0033c829] [.contact-page_&]:[transition:box-shadow_250ms_ease] [.contact-page_&_svg]:[width:65%] [.contact-page_&_svg]:[height:65%] [.contact-page_&_svg]:[color:#fff]! [.contact-page_&_svg]:[stroke-width:2] [.contact-page_&_svg]:[transition:transform_400ms_ease-in-out] [.contact-page_.contact-office[data-open='true']_&_svg]:[transform:rotate(180deg)] [.contact-page_.contact-office-heading_button:hover_&]:[box-shadow:0_0_18px_#005eff99,_0_3px_8px_#0033c840] motion-reduce:[.contact-page_&_svg]:[transition:none] motion-reduce:[.contact-page_&]:[transition:none]">
                          <FiArrowDownRight aria-hidden="true" />
                        </span>
                      </button>
                    </h2>
                    <div
                      className="contact-office-panel [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-rows:0fr] [.contact-page_&]:[opacity:0] [.contact-page_&]:[transition:grid-template-rows_400ms_ease-in-out,_opacity_300ms_ease-in-out] [.contact-page_.contact-office[data-open='true']_&]:[grid-template-rows:1fr] [.contact-page_.contact-office[data-open='true']_&]:[opacity:1] motion-reduce:[.contact-page_&]:[transition:none]"
                      id={`contact-office-${office.id}-panel`}
                      role="region"
                      aria-labelledby={`contact-office-${office.id}-trigger`}
                      aria-hidden={!isOpen}
                      inert={!isOpen}
                    >
                      <div className="contact-office-panel-inner [.contact-page_&]:[min-height:0] [.contact-page_&]:[overflow:hidden]">
                        {office.id === "plaza" ? (
                          <div className="contact-office-content [.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:calc(25_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(28_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(25_*_var(--location-unit))] max-[1200px]:[.contact-page_&]:[padding-left:20px] max-[1200px]:[.contact-page_&]:[padding-right:20px] max-[1024px]:[.contact-page_&]:[padding-left:25px] max-[1024px]:[.contact-page_&]:[padding-right:25px] max-[768px]:[.contact-page_&]:[padding-top:0] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:26px] max-[768px]:[.contact-page_&]:[padding-left:20px]">
                            <dl className="contact-info-list contact-plaza-info [.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:calc(25_*_var(--location-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&_dt]:[margin-top:0] [.contact-page_&_dt]:[margin-right:0] [.contact-page_&_dt]:[margin-bottom:calc(10_*_var(--location-unit))] [.contact-page_&_dt]:[margin-left:0] [.contact-page_&_dt]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&_dt]:[font-weight:410]! [.contact-page_&_dt]:[line-height:1.12]! [.contact-page_&_dt]:[letter-spacing:0] [.contact-page_&_dd]:[margin-top:0] [.contact-page_&_dd]:[margin-right:0] [.contact-page_&_dd]:[margin-bottom:0] [.contact-page_&_dd]:[margin-left:0] [.contact-page_&_dd]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_dd]:[font-weight:410]! [.contact-page_&_dd]:[line-height:1]! [.contact-page_&_dd]:[overflow-wrap:anywhere] max-[1024px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1.3fr_1fr_0.7fr] max-[1024px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[1024px]:[.contact-page_&_dd]:[line-height:1.2]! max-[1024px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:none]! max-[768px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[768px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:inline]! max-[768px]:[.contact-page_&_dd]:[font-size:14px]! max-[768px]:[.contact-page_&_dd]:[line-height:1.2]! max-[1024px]:[.contact-page_&]:[max-width:440px]">
                              <div>
                                <dt>Address</dt>
                                <dd lang="tr">
                                  Büsan Özel Organize Sanayi
                                  <br />
                                  Bölgesi 10644. Sk. No:43-45-47
                                  <br />
                                  Karatay, Konya / Türkiye
                                </dd>
                              </div>
                            </dl>
                            <dl className="contact-office-communication contact-info-list [.contact-page_&]:[grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [.contact-page_&]:[gap:calc(12_*_var(--location-unit))] [.contact-page_&]:[margin-top:calc(20_*_var(--location-unit))] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(20_*_var(--location-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&_dd]:[font-size:calc(12_*_var(--location-unit))]! max-[1024px]:[.contact-page_&]:[max-width:440px] max-[1024px]:[.contact-page_&_dd]:[font-size:15px]! max-[768px]:[.contact-page_&]:[grid-template-columns:minmax(100px,_0.8fr)_minmax(0,_1.2fr)] max-[768px]:[.contact-page_&]:[gap:10px] max-[768px]:[.contact-page_&_dd]:[font-size:11px]! [.contact-page_&]:[display:grid]! [.contact-page_&_dt]:[margin-top:0] [.contact-page_&_dt]:[margin-right:0] [.contact-page_&_dt]:[margin-bottom:calc(10_*_var(--location-unit))] [.contact-page_&_dt]:[margin-left:0] [.contact-page_&_dt]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&_dt]:[font-weight:410]! [.contact-page_&_dt]:[line-height:1.12]! [.contact-page_&_dt]:[letter-spacing:0] [.contact-page_&_dd]:[margin-top:0] [.contact-page_&_dd]:[margin-right:0] [.contact-page_&_dd]:[margin-bottom:0] [.contact-page_&_dd]:[margin-left:0] [.contact-page_&_dd]:[font-weight:410]! [.contact-page_&_dd]:[line-height:1]! [.contact-page_&_dd]:[overflow-wrap:anywhere] max-[1024px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1.3fr_1fr_0.7fr] max-[1024px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[1024px]:[.contact-page_&_dd]:[line-height:1.2]! max-[1024px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:none]! max-[768px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[768px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:inline]! max-[768px]:[.contact-page_&_dd]:[line-height:1.2]!">
                              <div>
                                <dt>Phone</dt>
                                <dd>
                                  <a
                                    className="contact-location-phone [.contact-page_&]:[color:#0d5792]! [.contact-page_&]:[font-size:calc(25_*_var(--location-unit))]! [.contact-page_&]:[font-weight:540]! [.contact-page_&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[white-space:nowrap] [.contact-page_.contact-office-communication_&]:[font-size:calc(20_*_var(--location-unit))]! max-[768px]:[.contact-page_.contact-office-communication_&]:[font-size:18px]!"
                                    href="tel:4446413"
                                  >
                                    444 6 413
                                  </a>
                                </dd>
                              </div>
                              <div>
                                <dt>E-Mail</dt>
                                <dd>
                                  <a href="mailto:info@sempapompa.com">
                                    info@sempapompa.com
                                  </a>
                                </dd>
                              </div>
                            </dl>
                            <LocationMap
                              address={plazaAddress}
                              location="SEMPA PLAZA"
                              compact
                            />
                            <LocationHours
                              address={plazaAddress}
                              location="SEMPA PLAZA"
                            />
                          </div>
                        ) : (
                          <div className="contact-office-content contact-office-pending [.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:calc(25_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(28_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(25_*_var(--location-unit))] max-[1200px]:[.contact-page_&]:[padding-left:20px] max-[1200px]:[.contact-page_&]:[padding-right:20px] max-[1024px]:[.contact-page_&]:[padding-left:25px] max-[1024px]:[.contact-page_&]:[padding-right:25px] max-[768px]:[.contact-page_&]:[padding-top:0] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:26px] max-[768px]:[.contact-page_&]:[padding-left:20px] [.contact-page_&]:[min-height:calc(395_*_var(--location-unit))] [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:flex-start] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[max-width:22em] [.contact-page_&_p]:[color:#0d5792]! [.contact-page_&_p]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_p]:[line-height:1.35]! max-[1024px]:[.contact-page_&]:[min-height:240px] max-[768px]:[.contact-page_&]:[min-height:200px]">
                            <p>Office contact details will be added soon.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>

      <section
        className="contact-sales [.contact-page_&]:[--sales-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:2] [.contact-page_&]:[isolation:isolate] [.contact-page_&]:[overflow:visible] [.contact-page_&]:[padding-top:calc(66_*_var(--sales-unit))] [.contact-page_&]:[padding-right:24px] [.contact-page_&]:[padding-bottom:0] [.contact-page_&]:[padding-left:24px] [.contact-page_&]:[background:linear-gradient(90deg,_#1c2fb8_0%,_#081e63_40%,_#02111f_100%)] [.contact-page_&]:[color:#fff]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_h2]:[margin-top:0] [.contact-page_&_h2]:[margin-right:0] [.contact-page_&_h2]:[margin-bottom:calc(54_*_var(--sales-unit))] [.contact-page_&_h2]:[margin-left:0] [.contact-page_&_h2]:[color:#fff]! [.contact-page_&_h2]:[font-size:calc(50_*_var(--sales-unit))]! [.contact-page_&_h2]:[font-weight:410]! [.contact-page_&_h2]:[line-height:1]! [.contact-page_&_h2]:[text-align:center] [.contact-page_&_h2]:[letter-spacing:-0.04em] [.contact-page_&_button:focus-visible]:[outline:2px_solid_#c0e2ff] [.contact-page_&_button:focus-visible]:[outline-offset:4px] [.contact-page_&_a:focus-visible]:[outline:2px_solid_#c0e2ff] [.contact-page_&_a:focus-visible]:[outline-offset:4px] max-[1200px]:[.contact-page_&]:[--sales-unit:1px] max-[1200px]:[.contact-page_&]:[padding-top:44px] max-[1200px]:[.contact-page_&]:[padding-bottom:40px] max-[1200px]:[.contact-page_&_h2]:[margin-bottom:36px] max-[1200px]:[.contact-page_&_h2]:[font-size:clamp(28px,_8vw,_38px)]! max-[1200px]:[.contact-page_&]:[padding-right:20px] max-[1200px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&]:[padding-top:44px] max-[768px]:[.contact-page_&]:[padding-right:16px] max-[768px]:[.contact-page_&]:[padding-bottom:0] max-[768px]:[.contact-page_&]:[padding-left:16px] max-[768px]:[.contact-page_&_h2]:[margin-bottom:26px] max-[768px]:[.contact-page_&_h2]:[font-size:clamp(27px,_7.5vw,_34px)]!"
        aria-labelledby="contact-sales-title"
      >
        <style>{`
          /* Sales section typography and alignment from the Figma reference. */
          main.contact-page .contact-sales-layout {
            grid-template-columns: minmax(0, calc(400 * var(--sales-unit))) minmax(0, 1fr) !important;
            gap: calc(93 * var(--sales-unit)) !important;
          }
          main.contact-page .contact-sales-introduction {
            padding-top: calc(73 * var(--sales-unit)) !important;
            padding-left: calc(63 * var(--sales-unit)) !important;
          }
          main.contact-page .contact-sales-description {
            font-weight: 470 !important;
            font-variation-settings: 'wght' 470, 'wdth' 125 !important;
          }
          main.contact-page .contact-sales-right {
            min-width: 0;
          }
          main.contact-page .contact-sales-right #contact-sales-title {
            margin: 0 0 calc(40 * var(--sales-unit)) calc(36 * var(--sales-unit)) !important;
            font-size: calc(46 * var(--sales-unit)) !important;
            font-weight: 360 !important;
            font-variation-settings: 'wght' 360, 'wdth' 125 !important;
            line-height: 1 !important;
            letter-spacing: -.04em !important;
            text-align: left !important;
          }
          main.contact-page .contact-sales-scroll {
            padding-top: calc(57 * var(--sales-unit)) !important;
            padding-right: calc(90 * var(--sales-unit)) !important;
            padding-left: calc(36 * var(--sales-unit)) !important;
            scrollbar-width: none !important;
          }
          main.contact-page .contact-sales-scroll::-webkit-scrollbar {
            display: none !important;
          }
          main.contact-page .contact-sales-scrollbar {
            position: absolute;
            z-index: 4;
            top: calc(60 * var(--sales-unit));
            right: calc(43 * var(--sales-unit));
            bottom: calc(52 * var(--sales-unit));
            width: 6px;
            cursor: grab;
            touch-action: none;
          }
          main.contact-page .contact-sales-scrollbar:active {
            cursor: grabbing;
          }
          main.contact-page .contact-sales-scrollbar::before {
            content: '';
            position: absolute;
            inset: 0 auto 0 2px;
            width: 2px;
            border-radius: 999px;
            background: rgba(244, 248, 255, .62);
          }
          main.contact-page .contact-sales-scrollbar-thumb {
            position: absolute;
            left: 0;
            width: 6px;
            height: 55%;
            border-radius: 999px;
            background: #fff;
            box-shadow: 0 0 4px rgba(255, 255, 255, .25);
            pointer-events: none;
          }
          @media (max-width: 1200px) {
            main.contact-page .contact-sales-layout {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
            main.contact-page .contact-sales-introduction {
              padding-top: 0 !important;
              padding-left: 0 !important;
            }
            main.contact-page .contact-sales-right {
              width: 100%;
              max-width: 640px;
              margin-inline: auto;
            }
            main.contact-page .contact-sales-right #contact-sales-title {
              margin: 0 0 26px 0 !important;
              font-size: 38px !important;
            }
            main.contact-page .contact-sales-scroll {
              padding-top: 30px !important;
              padding-right: 46px !important;
              padding-left: 16px !important;
            }
            main.contact-page .contact-sales-scrollbar {
              top: 30px;
              right: 18px;
              bottom: 30px;
            }
          }
          @media (max-width: 768px) {
            main.contact-page .contact-sales-right #contact-sales-title {
              margin-bottom: 24px !important;
              font-size: 30px !important;
            }
            main.contact-page .contact-sales-scroll {
              padding: 0 0 var(--sales-trailing-space, 728px) !important;
            }
            main.contact-page .contact-sales-scrollbar {
              display: none;
            }
          }
        `}</style>
        <video
          ref={earthRef}
          className="contact-sales-earth [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:0] [.contact-page_&]:[top:0] [.contact-page_&]:[right:auto] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:-8%] [.contact-page_&]:[width:85%] [.contact-page_&]:[height:100%] [.contact-page_&]:[max-width:none] [.contact-page_&]:[object-fit:cover] [.contact-page_&]:[object-position:35%_center] [.contact-page_&]:[opacity:0.55] [.contact-page_&]:[mask-image:linear-gradient(90deg,_#000_0%,_#000_45%,_transparent_100%)] [.contact-page_&]:[pointer-events:none] max-[1200px]:[.contact-page_&]:[width:130%] max-[1200px]:[.contact-page_&]:[left:-30%] max-[1200px]:[.contact-page_&]:[opacity:0.4] motion-reduce:[.contact-page_&]:[visibility:hidden]"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src="/contact/earth.webm" type="video/webm" />
        </video>
        <div
          className="contact-sales-overlay [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[background:linear-gradient(90deg,_#1c2fb866_0%,_#081e638c_40%,_#02111fe6_100%)] [.contact-page_&]:[pointer-events:none]"
          aria-hidden="true"
        />
        <div
          className="contact-sales-glow [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:2] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[background:radial-gradient(ellipse_at_22%_35%,_#005eff59_0%,_transparent_34%),_radial-gradient(ellipse_at_14%_68%,_#478eff38_0%,_transparent_28%),_radial-gradient(ellipse_at_68%_14%,_#78aaff1f_0%,_transparent_35%)] [.contact-page_&]:[pointer-events:none]"
          aria-hidden="true"
        />
        <div className="contact-sales-inner [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:3] [.contact-page_&]:[width:100%] [.contact-page_&]:[max-width:calc(1200_*_var(--sales-unit))] [.contact-page_&]:[margin-left:auto] [.contact-page_&]:[margin-right:auto]">
          <div className="contact-sales-layout [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:minmax(0,_calc(380_*_var(--sales-unit)))_minmax(0,_1fr)] [.contact-page_&]:[align-items:start] [.contact-page_&]:[gap:calc(70_*_var(--sales-unit))] max-[1200px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1200px]:[.contact-page_&]:[gap:32px] max-[768px]:[.contact-page_&]:[gap:24px]">
            <motion.div
              {...contactReveal("left", 0.06, reduced, 0.18)}
              className="contact-sales-introduction [.contact-page_&]:[position:relative] [.contact-page_&]:[padding-top:calc(32_*_var(--sales-unit))] [.contact-page_&::before]:[content:''] [.contact-page_&::before]:[position:absolute] [.contact-page_&::before]:[top:-15%] [.contact-page_&::before]:[right:-25%] [.contact-page_&::before]:[bottom:-15%] [.contact-page_&::before]:[left:-25%] [.contact-page_&::before]:[z-index:-1] [.contact-page_&::before]:[background:radial-gradient(ellipse_at_45%_38%,_#005eff33,_transparent_64%)] [.contact-page_&::before]:[pointer-events:none] max-[1200px]:[.contact-page_&]:[width:100%] max-[1200px]:[.contact-page_&]:[max-width:640px] max-[1200px]:[.contact-page_&]:[margin-left:auto] max-[1200px]:[.contact-page_&]:[margin-right:auto] max-[1200px]:[.contact-page_&]:[padding-top:0]"
            >
              <p className="contact-sales-description [.contact-page_&]:[position:relative] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(35_*_var(--sales-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[max-width:15em] [.contact-page_&]:[color:#fff]! [.contact-page_&]:[font-size:calc(25_*_var(--sales-unit))]! [.contact-page_&]:[font-weight:540]! [.contact-page_&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&]:[line-height:1.12]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&]:[text-shadow:0_0_26px_#478eff40] max-[1200px]:[.contact-page_&]:[max-width:25em] max-[1200px]:[.contact-page_&]:[margin-bottom:24px] max-[1200px]:[.contact-page_&]:[font-size:22px]! max-[1200px]:[.contact-page_&]:[line-height:1.15]! max-[768px]:[.contact-page_&]:[font-size:21px]!">
                Connect Directly with Engineering Leads: Specialized Divisions
              </p>
              <div
                className="contact-sales-filters [.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:calc(14_*_var(--sales-unit))] [.contact-page_&_button]:[display:inline-flex]! [.contact-page_&_button]:[align-items:center] [.contact-page_&_button]:[justify-content:center] [.contact-page_&_button]:[gap:calc(12_*_var(--sales-unit))] [.contact-page_&_button]:[min-height:calc(37_*_var(--sales-unit))] [.contact-page_&_button]:[padding-top:calc(11_*_var(--sales-unit))] [.contact-page_&_button]:[padding-right:calc(15_*_var(--sales-unit))] [.contact-page_&_button]:[padding-bottom:calc(11_*_var(--sales-unit))] [.contact-page_&_button]:[padding-left:calc(15_*_var(--sales-unit))] [.contact-page_&_button]:[border:1px_solid_#78aaff59] [.contact-page_&_button]:[border-radius:calc(11_*_var(--sales-unit))] [.contact-page_&_button]:[background:#081e6359] [.contact-page_&_button]:[box-shadow:inset_0_0_12px_#478eff14,_0_0_15px_#005eff12] [.contact-page_&_button]:[backdrop-filter:blur(12px)] [.contact-page_&_button]:[color:#dceaff]! [.contact-page_&_button]:[font-style:inherit] [.contact-page_&_button]:[font-variant:inherit] [.contact-page_&_button]:[font-weight:inherit]! [.contact-page_&_button]:[font-stretch:inherit]! [.contact-page_&_button]:[font-size:calc(14_*_var(--sales-unit))]! [.contact-page_&_button]:[line-height:1.1]! [.contact-page_&_button]:[font-family:inherit]! [.contact-page_&_button]:[font-feature-settings:inherit] [.contact-page_&_button]:[font-variation-settings:inherit]! [.contact-page_&_button]:[letter-spacing:0] [.contact-page_&_button]:[cursor:pointer] [.contact-page_&_button]:[transition:background_220ms_ease,_border-color_220ms_ease,_box-shadow_220ms_ease] [.contact-page_&_button:hover]:[background:#005eff40] [.contact-page_&_button:hover]:[border-color:#a3ceffb3] [.contact-page_&_button:hover]:[box-shadow:inset_0_0_12px_#478eff26,_0_0_18px_#005eff40] [.contact-page_&_button[aria-pressed='true']]:[background:linear-gradient(145deg,_#005effb3,_#2c5cb966)] [.contact-page_&_button[aria-pressed='true']]:[border-color:#a7d0ffcc] [.contact-page_&_button[aria-pressed='true']]:[box-shadow:inset_0_0_14px_#78aaff33,_0_0_20px_#005eff59] [.contact-page_&_button[aria-pressed='true']]:[color:#fff]! max-[1200px]:[.contact-page_&]:[width:100%] max-[1200px]:[.contact-page_&]:[margin-left:auto] max-[1200px]:[.contact-page_&]:[margin-right:auto] max-[1200px]:[.contact-page_&]:[gap:8px] max-[1200px]:[.contact-page_&_button]:[min-height:44px] max-[1200px]:[.contact-page_&_button]:[padding-top:10px] max-[1200px]:[.contact-page_&_button]:[padding-right:8px] max-[1200px]:[.contact-page_&_button]:[padding-bottom:10px] max-[1200px]:[.contact-page_&_button]:[padding-left:8px] max-[1200px]:[.contact-page_&_button]:[font-size:10px]! motion-reduce:[.contact-page_&_button]:[transition:none] max-[768px]:[.contact-page_&_button]:[font-size:15px]! max-[768px]:[.contact-page_&_button]:[font-weight:410]! max-[768px]:[.contact-page_&_button]:[font-variation-settings:'wght'_410,_'wdth'_125]! max-[768px]:[.contact-page_&_button]:[line-height:1]! max-[768px]:[.contact-page_&_button]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_button]:[color:#fff]! max-[768px]:[.contact-page_&_button]:[padding-left:7px] max-[768px]:[.contact-page_&_button]:[padding-right:7px] max-[360px]:[.contact-page_&_button]:[font-size:13px]! max-[360px]:[.contact-page_&_button]:[padding-left:5px] max-[360px]:[.contact-page_&_button]:[padding-right:5px] max-[360px]:[.contact-page_&_button]:[gap:6px]"
                role="group"
                aria-label="Sales divisions"
              >
                {salesFilterRows.map((row, index) => (
                  <div
                    className="contact-sales-filter-row [.contact-page_&]:[display:flex]! [.contact-page_&]:[gap:calc(10_*_var(--sales-unit))] [.contact-page_&_button]:[flex:1_1_0] [.contact-page_&_button]:[min-width:0] [.contact-page_&:first-child_button:nth-child(1)]:[flex-grow:0.55] [.contact-page_&:first-child_button:nth-child(3)]:[flex-grow:1.75] [.contact-page_&:last-child_button]:[justify-content:center] max-[1200px]:[.contact-page_&]:[gap:8px]"
                    key={index}
                  >
                    {row.map((filter) => (
                      <button
                        type="button"
                        key={filter}
                        aria-pressed={salesFilter === filter}
                        onClick={() => selectSalesFilter(filter)}
                        aria-controls="contact-sales-list"
                      >
                        {filter}
                        {filter === "DOMECTIC SALES TEAM" && (
                          <span className="contact-sales-domestic [.contact-page_&]:[display:inline-flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:calc(7_*_var(--sales-unit))] [.contact-page_&]:[font-size:calc(10_*_var(--sales-unit))]! [.contact-page_&_img]:[width:calc(22_*_var(--sales-unit))] [.contact-page_&_img]:[height:calc(22_*_var(--sales-unit))] [.contact-page_&_img]:[border-radius:50%] [.contact-page_&_img]:[object-fit:cover] max-[360px]:[.contact-page_&]:[gap:4px] max-[360px]:[.contact-page_&]:[font-size:9px]! max-[360px]:[.contact-page_&_img]:[width:18px] max-[360px]:[.contact-page_&_img]:[height:18px]">
                            <span>TR</span>
                            <Image
                              src="/contact/flags/tr.png"
                              alt="Türkiye"
                              width={22}
                              height={22}
                            />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="contact-sales-right">
              <motion.h2
                {...contactReveal("up", 0, reduced, 0.18)}
                id="contact-sales-title"
              >
                Sales Department
              </motion.h2>
              <motion.div
                {...contactReveal("right", 0.1, reduced, 0.13)}
                className="contact-sales-panel [.contact-page_&]:[position:relative] [.contact-page_&]:[min-width:0] [.contact-page_&]:[height:calc(510_*_var(--sales-unit))] [.contact-page_&]:[margin-bottom:calc(-44_*_var(--sales-unit))] [.contact-page_&]:[overflow:hidden] [.contact-page_&]:[border:0.5px_solid_#dce6ef59] [.contact-page_&]:[border-radius:calc(30_*_var(--sales-unit))] [.contact-page_&]:[background:#7d8da047] [.contact-page_&]:[backdrop-filter:blur(24px)] [.contact-page_&]:[box-shadow:inset_0_1px_22px_#ffffff12,_0_20px_60px_#020a1e33] max-[1200px]:[.contact-page_&]:[width:100%] max-[1200px]:[.contact-page_&]:[max-width:640px] max-[1200px]:[.contact-page_&]:[height:460px] max-[1200px]:[.contact-page_&]:[margin-left:auto] max-[1200px]:[.contact-page_&]:[margin-right:auto] max-[1200px]:[.contact-page_&]:[margin-bottom:0] max-[1200px]:[.contact-page_&]:[border-radius:24px] max-[768px]:[.contact-page_&]:[height:816px] max-[768px]:[.contact-page_&]:[margin-top:0] max-[768px]:[.contact-page_&]:[margin-right:0] max-[768px]:[.contact-page_&]:[margin-bottom:0] max-[768px]:[.contact-page_&]:[margin-left:0] max-[768px]:[.contact-page_&]:[overflow:hidden] max-[768px]:[.contact-page_&]:[border:0] max-[768px]:[.contact-page_&]:[border-radius:0] max-[768px]:[.contact-page_&]:[background:transparent] max-[768px]:[.contact-page_&]:[box-shadow:none] max-[768px]:[.contact-page_&]:[backdrop-filter:none]"
              >
                <div
                  ref={salesScrollRef}
                  className="contact-sales-scroll [.contact-page_&]:[height:100%] [.contact-page_&]:[overflow-y:auto] [.contact-page_&]:[overflow-x:hidden] [.contact-page_&]:[padding-top:calc(30_*_var(--sales-unit))] [.contact-page_&]:[padding-right:calc(30_*_var(--sales-unit))] [.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_calc(106_*_var(--sales-unit)))] [.contact-page_&]:[padding-left:calc(30_*_var(--sales-unit))] [.contact-page_&]:[scrollbar-width:thin] [.contact-page_&]:[scrollbar-color:#f7f7f7b3_#ffffff0a] [.contact-page_&]:[overscroll-behavior-y:auto] [.contact-page_&]:[scrollbar-gutter:stable] [.contact-page_&::-webkit-scrollbar]:[width:5px] [.contact-page_&::-webkit-scrollbar-track]:[background:#ffffff0a] [.contact-page_&::-webkit-scrollbar-thumb]:[border-radius:20px] [.contact-page_&::-webkit-scrollbar-thumb]:[background:#f7f7f7b3] [.contact-page_&:focus-visible]:[outline:2px_solid_#c0e2ff] [.contact-page_&:focus-visible]:[outline-offset:-4px] [.contact-page_&:focus-visible]:[border-radius:inherit] max-[1200px]:[.contact-page_&]:[padding-left:16px] max-[1200px]:[.contact-page_&]:[padding-right:16px] max-[1200px]:[.contact-page_&]:[padding-top:20px] max-[1200px]:[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_96px)] max-[768px]:[.contact-page_&]:[height:100%] max-[768px]:[.contact-page_&]:[padding-top:0] max-[768px]:[.contact-page_&]:[padding-right:0] max-[768px]:[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_728px)] max-[768px]:[.contact-page_&]:[padding-left:0] max-[768px]:[.contact-page_&]:[overflow-y:auto] max-[768px]:[.contact-page_&]:[overflow-x:hidden] max-[768px]:[.contact-page_&]:[scrollbar-gutter:auto]"
                  role="region"
                  aria-label="Sales department contacts"
                  tabIndex={0}
                >
                  <ul
                    id="contact-sales-list"
                    className="contact-sales-grid [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:calc(12_*_var(--sales-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:0] [.contact-page_&]:[padding-bottom:0] [.contact-page_&]:[padding-left:0] [.contact-page_&]:[list-style:none] max-[1200px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1200px]:[.contact-page_&]:[gap:12px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:8px]"
                    aria-label={`${salesFilter} sales contacts`}
                  >
                    {visibleSalesContacts.map((contact) => (
                      <li
                        key={contact.email}
                        className="contact-sales-person [.contact-page_&]:[display:flex]! [.contact-page_&]:[flex-direction:column] [.contact-page_&]:[align-items:flex-start] [.contact-page_&]:[gap:calc(10_*_var(--sales-unit))] [.contact-page_&]:[min-width:0] [.contact-page_&]:[min-height:calc(116_*_var(--sales-unit))] [.contact-page_&]:[padding-top:calc(16_*_var(--sales-unit))] [.contact-page_&]:[padding-right:calc(16_*_var(--sales-unit))] [.contact-page_&]:[padding-bottom:calc(16_*_var(--sales-unit))] [.contact-page_&]:[padding-left:calc(16_*_var(--sales-unit))] [.contact-page_&]:[border:0.5px_solid_#dce6ef33] [.contact-page_&]:[border-radius:calc(10_*_var(--sales-unit))] [.contact-page_&]:[background:#ffffff17] [.contact-page_&]:[box-shadow:inset_0_1px_10px_#ffffff08] [.contact-page_&]:[transition:background_220ms_ease,_border-color_220ms_ease] [.contact-page_&:hover]:[background:#ffffff24] [.contact-page_&:hover]:[border-color:#dce6ef66] [.contact-page_&_h3]:[margin-top:0] [.contact-page_&_h3]:[margin-right:0] [.contact-page_&_h3]:[margin-bottom:0] [.contact-page_&_h3]:[margin-left:0] [.contact-page_&_h3]:[color:#fff]! [.contact-page_&_h3]:[font-size:calc(16_*_var(--sales-unit))]! [.contact-page_&_h3]:[font-weight:540]! [.contact-page_&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&_h3]:[line-height:1.15]! [.contact-page_&_h3]:[letter-spacing:-0.04em] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[color:#dce6efb3]! [.contact-page_&_p]:[font-size:calc(12_*_var(--sales-unit))]! [.contact-page_&_p]:[line-height:1.25]! [.contact-page_&_a]:[margin-top:auto] [.contact-page_&_a]:[max-width:100%] [.contact-page_&_a]:[color:#eef6ff]! [.contact-page_&_a]:[font-size:calc(12_*_var(--sales-unit))]! [.contact-page_&_a]:[line-height:1.2]! [.contact-page_&_a]:[overflow-wrap:anywhere] [.contact-page_&_a:hover]:[color:#fff]! [.contact-page_&_a:hover]:[text-decoration:underline]! [.contact-page_&_a:hover]:[text-underline-offset:3px] max-[1200px]:[.contact-page_&]:[padding-top:16px] max-[1200px]:[.contact-page_&]:[padding-right:16px] max-[1200px]:[.contact-page_&]:[padding-bottom:16px] max-[1200px]:[.contact-page_&]:[padding-left:16px] max-[1200px]:[.contact-page_&]:[min-height:112px] max-[1200px]:[.contact-page_&_h3]:[font-size:15px]! max-[1200px]:[.contact-page_&_p]:[font-size:12px]! max-[1200px]:[.contact-page_&_a]:[font-size:12px]! motion-reduce:[.contact-page_&]:[transition:none] max-[768px]:[.contact-page_&]:[min-height:88px] max-[768px]:[.contact-page_&]:[padding-top:12px] max-[768px]:[.contact-page_&]:[padding-right:14px] max-[768px]:[.contact-page_&]:[padding-bottom:12px] max-[768px]:[.contact-page_&]:[padding-left:14px] max-[768px]:[.contact-page_&]:[gap:7px] max-[768px]:[.contact-page_&_h3]:[font-size:20px]! max-[768px]:[.contact-page_&_h3]:[font-weight:410]! max-[768px]:[.contact-page_&_h3]:[font-variation-settings:'wght'_410,_'wdth'_125]! max-[768px]:[.contact-page_&_h3]:[line-height:1.07]! max-[768px]:[.contact-page_&_h3]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_p]:[font-size:9px]! max-[768px]:[.contact-page_&_p]:[font-weight:410]! max-[768px]:[.contact-page_&_p]:[line-height:1.12]! max-[768px]:[.contact-page_&_p]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_p]:[color:#fff]! max-[768px]:[.contact-page_&_a]:[font-size:12px]! max-[768px]:[.contact-page_&_a]:[font-weight:410]! max-[768px]:[.contact-page_&_a]:[line-height:1.12]! max-[768px]:[.contact-page_&_a]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_a]:[color:#fff]!"
                      >
                        <h3>{contact.name}</h3>
                        <p>{contact.role}</p>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="contact-sales-panel-fade [.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:2] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[right:10px] [.contact-page_&]:[height:calc(88_*_var(--sales-unit))] [.contact-page_&]:[border-radius:0_0_calc(30_*_var(--sales-unit))_calc(30_*_var(--sales-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_#dce6ef00,_#dce6ef45_45%,_#dce6efa6_100%)] [.contact-page_&]:[backdrop-filter:blur(6px)] [.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_70%)] [.contact-page_&]:[pointer-events:none] max-[1200px]:[.contact-page_&]:[height:80px] max-[1200px]:[.contact-page_&]:[border-radius:0_0_24px_24px] max-[768px]:[.contact-page_&]:[display:block]! max-[768px]:[.contact-page_&]:[bottom:0] max-[768px]:[.contact-page_&]:[left:0] max-[768px]:[.contact-page_&]:[right:0] max-[768px]:[.contact-page_&]:[height:160px] max-[768px]:[.contact-page_&]:[border-radius:0] max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_transparent,_#02111f20)] max-[768px]:[.contact-page_&]:[backdrop-filter:blur(4px)] max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_40%)]"
                  aria-hidden="true"
                />
                {salesScrollbar.visible && (
                  <div
                    className="contact-sales-scrollbar"
                    aria-hidden="true"
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      scrollSalesToPointer(event.clientY, event.currentTarget);
                    }}
                    onPointerMove={(event) => {
                      if (
                        event.currentTarget.hasPointerCapture(event.pointerId)
                      ) {
                        scrollSalesToPointer(
                          event.clientY,
                          event.currentTarget,
                        );
                      }
                    }}
                  >
                    <span
                      className="contact-sales-scrollbar-thumb"
                      style={{ top: `${salesScrollbar.progress * 45}%` }}
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {visibleSalesContacts.length} contacts in {salesFilter}.
          </p>
        </div>
      </section>

      <section
        className="contact-write [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:0] [.contact-page_&]:[padding-top:140px] [.contact-page_&]:[padding-right:24px] [.contact-page_&]:[padding-bottom:88px] [.contact-page_&]:[padding-left:24px] [.contact-page_&]:[background:radial-gradient(ellipse_at_8%_90%,_#8dc4ff26,_transparent_55%),_radial-gradient(ellipse_at_47%_42%,_#b0d7ff24,_transparent_52%),_linear-gradient(110deg,_#cde6ff_0%,_#ddeeff_42%,_#ebf5ff_72%,_#f8fbff_100%)] [.contact-page_&]:[color:#000]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_#contact-write-title]:[margin-top:0] [.contact-page_&_#contact-write-title]:[margin-right:0] [.contact-page_&_#contact-write-title]:[margin-bottom:54px] [.contact-page_&_#contact-write-title]:[margin-left:0] [.contact-page_&_#contact-write-title]:[text-align:center] [.contact-page_&_#contact-write-title]:[font-size:50px]! [.contact-page_&_#contact-write-title]:[font-weight:410]! [.contact-page_&_#contact-write-title]:[line-height:1]! [.contact-page_&_#contact-write-title]:[letter-spacing:-0.04em] [.contact-page_&_#contact-write-title]:[color:#0d5792]! [.contact-page_&_fieldset]:[min-width:0] [.contact-page_&_fieldset]:[margin-top:0] [.contact-page_&_fieldset]:[margin-right:0] [.contact-page_&_fieldset]:[margin-bottom:0] [.contact-page_&_fieldset]:[margin-left:0] [.contact-page_&_fieldset]:[padding-top:0] [.contact-page_&_fieldset]:[padding-right:0] [.contact-page_&_fieldset]:[padding-bottom:0] [.contact-page_&_fieldset]:[padding-left:0] [.contact-page_&_fieldset]:[border:0] [.contact-page_&_legend]:[width:100%] [.contact-page_&_legend]:[margin-bottom:25px] [.contact-page_&_legend]:[padding-top:0] [.contact-page_&_legend]:[padding-right:0] [.contact-page_&_legend]:[padding-bottom:0] [.contact-page_&_legend]:[padding-left:0] [.contact-page_&_legend]:[font-size:25px]! [.contact-page_&_legend]:[font-weight:540]! [.contact-page_&_legend]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&_legend]:[line-height:1.12]! [.contact-page_&_legend]:[color:#005eff]! [.contact-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_button:focus-visible]:[outline-offset:3px] max-[1024px]:[.contact-page_&]:[padding-top:120px] max-[1024px]:[.contact-page_&_#contact-write-title]:[font-size:42px]! max-[768px]:[.contact-page_&]:[padding-top:56px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:60px] max-[768px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&_#contact-write-title]:[margin-bottom:36px] max-[768px]:[.contact-page_&_#contact-write-title]:[font-size:clamp(30px,_8vw,_40px)]! max-[768px]:[.contact-page_&_legend]:[font-size:22px]! max-[768px]:[.contact-page_&_legend]:[margin-bottom:20px]"
        aria-labelledby="contact-write-title"
      >
        <div className="contact-write-inner [.contact-page_&]:[width:100%] [.contact-page_&]:[max-width:1200px] [.contact-page_&]:[margin-left:auto] [.contact-page_&]:[margin-right:auto]">
          <motion.h2
            {...contactReveal("up", 0, reduced, 0.18)}
            id="contact-write-title"
          >
            Write To Us
          </motion.h2>
          <motion.form
            {...contactReveal("up", 0.08, reduced, 0.1)}
            className="contact-write-form [.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:56px] max-[768px]:[.contact-page_&]:[gap:38px]"
            noValidate
            onSubmit={submitContactPreview}
            onInput={(event) => {
              const target = event.target;
              if (target instanceof HTMLInputElement)
                target.setCustomValidity("");
              setFormFeedback(null);
            }}
          >
            <fieldset>
              <legend>Contact Information</legend>
              <div className="contact-write-grid [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:10px_25px] [.contact-page_&_>_label]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[display:block]! [.contact-page_&_input:not([type='file'])]:[width:100%] [.contact-page_&_input:not([type='file'])]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[height:45px] [.contact-page_&_input:not([type='file'])]:[padding-top:12px] [.contact-page_&_input:not([type='file'])]:[padding-right:37px] [.contact-page_&_input:not([type='file'])]:[padding-bottom:12px] [.contact-page_&_input:not([type='file'])]:[padding-left:37px] [.contact-page_&_input:not([type='file'])]:[border:1px_solid_transparent] [.contact-page_&_input:not([type='file'])]:[border-radius:8px] [.contact-page_&_input:not([type='file'])]:[background:#f7f7f7] [.contact-page_&_input:not([type='file'])]:[color:#0d5792]! [.contact-page_&_input:not([type='file'])]:[font-style:inherit] [.contact-page_&_input:not([type='file'])]:[font-variant:inherit] [.contact-page_&_input:not([type='file'])]:[font-weight:inherit]! [.contact-page_&_input:not([type='file'])]:[font-stretch:inherit]! [.contact-page_&_input:not([type='file'])]:[font-size:15px]! [.contact-page_&_input:not([type='file'])]:[line-height:1.2]! [.contact-page_&_input:not([type='file'])]:[font-family:inherit]! [.contact-page_&_input:not([type='file'])]:[font-feature-settings:inherit] [.contact-page_&_input:not([type='file'])]:[font-variation-settings:inherit]! [.contact-page_&_input:not([type='file'])]:[letter-spacing:-0.04em] [.contact-page_&_input:not([type='file'])]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_textarea]:[display:block]! [.contact-page_&_textarea]:[width:100%] [.contact-page_&_textarea]:[min-width:0] [.contact-page_&_textarea]:[height:188px] [.contact-page_&_textarea]:[padding-top:23px] [.contact-page_&_textarea]:[padding-right:37px] [.contact-page_&_textarea]:[padding-bottom:23px] [.contact-page_&_textarea]:[padding-left:37px] [.contact-page_&_textarea]:[border:1px_solid_transparent] [.contact-page_&_textarea]:[border-radius:8px] [.contact-page_&_textarea]:[background:#f7f7f7] [.contact-page_&_textarea]:[color:#0d5792]! [.contact-page_&_textarea]:[font-style:inherit] [.contact-page_&_textarea]:[font-variant:inherit] [.contact-page_&_textarea]:[font-weight:inherit]! [.contact-page_&_textarea]:[font-stretch:inherit]! [.contact-page_&_textarea]:[font-size:15px]! [.contact-page_&_textarea]:[line-height:1.2]! [.contact-page_&_textarea]:[font-family:inherit]! [.contact-page_&_textarea]:[font-feature-settings:inherit] [.contact-page_&_textarea]:[font-variation-settings:inherit]! [.contact-page_&_textarea]:[letter-spacing:-0.04em] [.contact-page_&_textarea]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_input::placeholder]:[color:#9eb7d0]! [.contact-page_&_input::placeholder]:[opacity:1] [.contact-page_&_textarea::placeholder]:[color:#9eb7d0]! [.contact-page_&_textarea::placeholder]:[opacity:1] [.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_input:focus-visible]:[outline-offset:1px] [.contact-page_&_input:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_input:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_textarea:focus-visible]:[outline-offset:1px] [.contact-page_&_textarea:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_textarea:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea]:[resize:none] [.contact-page_&_textarea]:[overflow-y:auto] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-left:24px] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-right:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-left:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-right:24px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:12px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-left:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-right:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[font-size:14px]! max-[768px]:[.contact-page_&_textarea]:[padding-left:20px] max-[768px]:[.contact-page_&_textarea]:[padding-right:20px] max-[768px]:[.contact-page_&_textarea]:[font-size:14px]! motion-reduce:[.contact-page_&_input]:[transition:none] motion-reduce:[.contact-page_&_textarea]:[transition:none] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(3)]:[order:4] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(4)]:[order:3] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(1)]:[order:1] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(2)]:[order:2]">
                <label>
                  <span className="sr-only">Full Name (required)</span>
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  <span className="sr-only">Company Name (required)</span>
                  <input
                    name="companyName"
                    placeholder="Company Name"
                    autoComplete="organization"
                    required
                  />
                </label>
                <label>
                  <span className="sr-only">Corporate Email (required)</span>
                  <input
                    name="corporateEmail"
                    type="email"
                    placeholder="Corporate Email"
                    autoComplete="email"
                    required
                  />
                </label>
                <label>
                  <span className="sr-only">Phone Number (required)</span>
                  <input
                    name="phoneNumber"
                    type="tel"
                    inputMode="tel"
                    placeholder="Phone Number"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Project Specifications</legend>
              <div className="contact-write-grid [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:10px_25px] [.contact-page_&_>_label]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[display:block]! [.contact-page_&_input:not([type='file'])]:[width:100%] [.contact-page_&_input:not([type='file'])]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[height:45px] [.contact-page_&_input:not([type='file'])]:[padding-top:12px] [.contact-page_&_input:not([type='file'])]:[padding-right:37px] [.contact-page_&_input:not([type='file'])]:[padding-bottom:12px] [.contact-page_&_input:not([type='file'])]:[padding-left:37px] [.contact-page_&_input:not([type='file'])]:[border:1px_solid_transparent] [.contact-page_&_input:not([type='file'])]:[border-radius:8px] [.contact-page_&_input:not([type='file'])]:[background:#f7f7f7] [.contact-page_&_input:not([type='file'])]:[color:#0d5792]! [.contact-page_&_input:not([type='file'])]:[font-style:inherit] [.contact-page_&_input:not([type='file'])]:[font-variant:inherit] [.contact-page_&_input:not([type='file'])]:[font-weight:inherit]! [.contact-page_&_input:not([type='file'])]:[font-stretch:inherit]! [.contact-page_&_input:not([type='file'])]:[font-size:15px]! [.contact-page_&_input:not([type='file'])]:[line-height:1.2]! [.contact-page_&_input:not([type='file'])]:[font-family:inherit]! [.contact-page_&_input:not([type='file'])]:[font-feature-settings:inherit] [.contact-page_&_input:not([type='file'])]:[font-variation-settings:inherit]! [.contact-page_&_input:not([type='file'])]:[letter-spacing:-0.04em] [.contact-page_&_input:not([type='file'])]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_textarea]:[display:block]! [.contact-page_&_textarea]:[width:100%] [.contact-page_&_textarea]:[min-width:0] [.contact-page_&_textarea]:[height:188px] [.contact-page_&_textarea]:[padding-top:23px] [.contact-page_&_textarea]:[padding-right:37px] [.contact-page_&_textarea]:[padding-bottom:23px] [.contact-page_&_textarea]:[padding-left:37px] [.contact-page_&_textarea]:[border:1px_solid_transparent] [.contact-page_&_textarea]:[border-radius:8px] [.contact-page_&_textarea]:[background:#f7f7f7] [.contact-page_&_textarea]:[color:#0d5792]! [.contact-page_&_textarea]:[font-style:inherit] [.contact-page_&_textarea]:[font-variant:inherit] [.contact-page_&_textarea]:[font-weight:inherit]! [.contact-page_&_textarea]:[font-stretch:inherit]! [.contact-page_&_textarea]:[font-size:15px]! [.contact-page_&_textarea]:[line-height:1.2]! [.contact-page_&_textarea]:[font-family:inherit]! [.contact-page_&_textarea]:[font-feature-settings:inherit] [.contact-page_&_textarea]:[font-variation-settings:inherit]! [.contact-page_&_textarea]:[letter-spacing:-0.04em] [.contact-page_&_textarea]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_input::placeholder]:[color:#9eb7d0]! [.contact-page_&_input::placeholder]:[opacity:1] [.contact-page_&_textarea::placeholder]:[color:#9eb7d0]! [.contact-page_&_textarea::placeholder]:[opacity:1] [.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_input:focus-visible]:[outline-offset:1px] [.contact-page_&_input:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_input:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_textarea:focus-visible]:[outline-offset:1px] [.contact-page_&_textarea:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_textarea:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea]:[resize:none] [.contact-page_&_textarea]:[overflow-y:auto] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-left:24px] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-right:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-left:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-right:24px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:12px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-left:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-right:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[font-size:14px]! max-[768px]:[.contact-page_&_textarea]:[padding-left:20px] max-[768px]:[.contact-page_&_textarea]:[padding-right:20px] max-[768px]:[.contact-page_&_textarea]:[font-size:14px]! motion-reduce:[.contact-page_&_input]:[transition:none] motion-reduce:[.contact-page_&_textarea]:[transition:none] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(3)]:[order:4] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(4)]:[order:3] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(1)]:[order:1] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(2)]:[order:2]">
                <label>
                  <span className="sr-only">Industry</span>
                  <input name="industry" placeholder="Industry" />
                </label>
                <label>
                  <span className="sr-only">Fluid Type</span>
                  <input name="fluidType" placeholder="Fluid Type" />
                </label>
                <label>
                  <span className="sr-only">Estimated Flow Rat</span>
                  <input
                    name="estimatedFlowRate"
                    placeholder="Estimated Flow Rat"
                  />
                </label>
                <label>
                  <span className="sr-only">Estimated Pressure</span>
                  <input
                    name="estimatedPressure"
                    placeholder="Estimated Pressure"
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Details &amp; Attachments</legend>
              <div className="contact-write-grid [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:10px_25px] [.contact-page_&_>_label]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[display:block]! [.contact-page_&_input:not([type='file'])]:[width:100%] [.contact-page_&_input:not([type='file'])]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[height:45px] [.contact-page_&_input:not([type='file'])]:[padding-top:12px] [.contact-page_&_input:not([type='file'])]:[padding-right:37px] [.contact-page_&_input:not([type='file'])]:[padding-bottom:12px] [.contact-page_&_input:not([type='file'])]:[padding-left:37px] [.contact-page_&_input:not([type='file'])]:[border:1px_solid_transparent] [.contact-page_&_input:not([type='file'])]:[border-radius:8px] [.contact-page_&_input:not([type='file'])]:[background:#f7f7f7] [.contact-page_&_input:not([type='file'])]:[color:#0d5792]! [.contact-page_&_input:not([type='file'])]:[font-style:inherit] [.contact-page_&_input:not([type='file'])]:[font-variant:inherit] [.contact-page_&_input:not([type='file'])]:[font-weight:inherit]! [.contact-page_&_input:not([type='file'])]:[font-stretch:inherit]! [.contact-page_&_input:not([type='file'])]:[font-size:15px]! [.contact-page_&_input:not([type='file'])]:[line-height:1.2]! [.contact-page_&_input:not([type='file'])]:[font-family:inherit]! [.contact-page_&_input:not([type='file'])]:[font-feature-settings:inherit] [.contact-page_&_input:not([type='file'])]:[font-variation-settings:inherit]! [.contact-page_&_input:not([type='file'])]:[letter-spacing:-0.04em] [.contact-page_&_input:not([type='file'])]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_textarea]:[display:block]! [.contact-page_&_textarea]:[width:100%] [.contact-page_&_textarea]:[min-width:0] [.contact-page_&_textarea]:[height:188px] [.contact-page_&_textarea]:[padding-top:23px] [.contact-page_&_textarea]:[padding-right:37px] [.contact-page_&_textarea]:[padding-bottom:23px] [.contact-page_&_textarea]:[padding-left:37px] [.contact-page_&_textarea]:[border:1px_solid_transparent] [.contact-page_&_textarea]:[border-radius:8px] [.contact-page_&_textarea]:[background:#f7f7f7] [.contact-page_&_textarea]:[color:#0d5792]! [.contact-page_&_textarea]:[font-style:inherit] [.contact-page_&_textarea]:[font-variant:inherit] [.contact-page_&_textarea]:[font-weight:inherit]! [.contact-page_&_textarea]:[font-stretch:inherit]! [.contact-page_&_textarea]:[font-size:15px]! [.contact-page_&_textarea]:[line-height:1.2]! [.contact-page_&_textarea]:[font-family:inherit]! [.contact-page_&_textarea]:[font-feature-settings:inherit] [.contact-page_&_textarea]:[font-variation-settings:inherit]! [.contact-page_&_textarea]:[letter-spacing:-0.04em] [.contact-page_&_textarea]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_input::placeholder]:[color:#9eb7d0]! [.contact-page_&_input::placeholder]:[opacity:1] [.contact-page_&_textarea::placeholder]:[color:#9eb7d0]! [.contact-page_&_textarea::placeholder]:[opacity:1] [.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_input:focus-visible]:[outline-offset:1px] [.contact-page_&_input:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_input:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_textarea:focus-visible]:[outline-offset:1px] [.contact-page_&_textarea:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_textarea:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea]:[resize:none] [.contact-page_&_textarea]:[overflow-y:auto] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-left:24px] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-right:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-left:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-right:24px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:12px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-left:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-right:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[font-size:14px]! max-[768px]:[.contact-page_&_textarea]:[padding-left:20px] max-[768px]:[.contact-page_&_textarea]:[padding-right:20px] max-[768px]:[.contact-page_&_textarea]:[font-size:14px]! motion-reduce:[.contact-page_&_input]:[transition:none] motion-reduce:[.contact-page_&_textarea]:[transition:none] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(3)]:[order:4] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(4)]:[order:3] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(1)]:[order:1] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(2)]:[order:2]">
                <label>
                  <span className="sr-only">
                    Project Details &amp; Challenges
                  </span>
                  <textarea
                    name="projectDetails"
                    placeholder="Project Details & Challenges"
                  />
                </label>
                <div
                  className="contact-write-upload [.contact-page_&]:[min-width:0] [.contact-page_&]:[height:188px] [.contact-page_&]:[border:1px_solid_transparent] [.contact-page_&]:[border-radius:8px] [.contact-page_&]:[background:#f7f7f7] [.contact-page_&]:[transition:background_180ms_ease,_border-color_180ms_ease] [.contact-page_&:hover]:[border-color:#9cc7ff] [.contact-page_&:hover]:[background:#edf5ff] [.contact-page_&[data-dragging='true']]:[border-color:#9cc7ff] [.contact-page_&[data-dragging='true']]:[background:#edf5ff] motion-reduce:[.contact-page_&]:[transition:none]"
                  data-dragging={isDraggingFiles}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(true);
                  }}
                  onDragLeave={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                      )
                    )
                      setIsDraggingFiles(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(false);
                    addAttachments(Array.from(event.dataTransfer.files));
                  }}
                >
                  <input
                    ref={attachmentInputRef}
                    className="sr-only"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    aria-label="Technical document files"
                    tabIndex={-1}
                    onChange={(event) => {
                      addAttachments(
                        Array.from(event.currentTarget.files ?? []),
                      );
                      event.currentTarget.value = "";
                    }}
                  />
                  <button
                    className="contact-write-upload-trigger [.contact-page_&]:[display:flex]! [.contact-page_&]:[flex-direction:column] [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:18px] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:100%] [.contact-page_&]:[padding-top:22px] [.contact-page_&]:[padding-right:25px] [.contact-page_&]:[padding-bottom:16px] [.contact-page_&]:[padding-left:25px] [.contact-page_&]:[border:0] [.contact-page_&]:[border-radius:8px] [.contact-page_&]:[background:transparent] [.contact-page_&]:[color:#9eb7d0]! [.contact-page_&]:[font-style:inherit] [.contact-page_&]:[font-variant:inherit] [.contact-page_&]:[font-weight:inherit]! [.contact-page_&]:[font-stretch:inherit]! [.contact-page_&]:[font-size:15px]! [.contact-page_&]:[line-height:1.2]! [.contact-page_&]:[font-family:inherit]! [.contact-page_&]:[font-feature-settings:inherit] [.contact-page_&]:[font-variation-settings:inherit]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&]:[cursor:pointer] [.contact-page_&_>_span:first-child]:[align-self:flex-start] max-[768px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[font-size:14px]!"
                    type="button"
                    onClick={() => attachmentInputRef.current?.click()}
                    aria-label="Upload Technical Documents"
                  >
                    <span>Upload Technical Documents</span>
                    <span className="contact-write-upload-icon [.contact-page_&]:[display:grid]! [.contact-page_&]:[place-items:center] [.contact-page_&]:[flex:0_0_48px] [.contact-page_&]:[width:48px] [.contact-page_&]:[height:48px] [.contact-page_&]:[border-radius:50%] [.contact-page_&]:[background:#e1eeff] [.contact-page_&]:[color:#587c9d]! [.contact-page_&]:[transition:box-shadow_180ms_ease] [.contact-page_&_svg]:[width:24px] [.contact-page_&_svg]:[height:24px] [.contact-page_&_svg]:[stroke-width:1.5] [.contact-page_.contact-write-upload-trigger:hover_&]:[box-shadow:0_0_18px_#005eff26] motion-reduce:[.contact-page_&]:[transition:none]">
                      <FiUpload aria-hidden="true" />
                    </span>
                    <span
                      className="contact-write-file-types [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:22px] [.contact-page_&]:[color:#9eb7d0]! [.contact-page_&]:[font-size:10px]! [.contact-page_&_>_span]:[display:flex]! [.contact-page_&_>_span]:[align-items:center] [.contact-page_&_>_span]:[gap:4px] [.contact-page_&_svg]:[width:22px] [.contact-page_&_svg]:[height:26px] [.contact-page_&_svg]:[stroke-width:1.25]"
                      aria-hidden="true"
                    >
                      <span>
                        <FiFileText />
                        PDF
                      </span>
                      <span>
                        <FiImage />
                        JPG
                      </span>
                      <span>
                        <FiFileText />
                        Word
                      </span>
                    </span>
                  </button>
                </div>
              </div>
              {attachmentError && (
                <p
                  className="contact-write-file-error [.contact-page_&]:[margin-top:12px] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[color:#9b3131]! [.contact-page_&]:[font-size:13px]!"
                  role="alert"
                >
                  {attachmentError}
                </p>
              )}
              {attachments.length > 0 && (
                <ul
                  className="contact-write-attachments [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:8px_25px] [.contact-page_&]:[margin-top:16px] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:0] [.contact-page_&]:[padding-bottom:0] [.contact-page_&]:[padding-left:0] [.contact-page_&]:[list-style:none] [.contact-page_&_li]:[display:flex]! [.contact-page_&_li]:[align-items:center] [.contact-page_&_li]:[gap:8px] [.contact-page_&_li]:[min-width:0] [.contact-page_&_li]:[padding-top:8px] [.contact-page_&_li]:[padding-right:12px] [.contact-page_&_li]:[padding-bottom:8px] [.contact-page_&_li]:[padding-left:12px] [.contact-page_&_li]:[border:1px_solid_#9eb7d066] [.contact-page_&_li]:[border-radius:8px] [.contact-page_&_li]:[background:#f7f7f799] [.contact-page_&_li]:[color:#0d5792]! [.contact-page_&_li]:[font-size:12px]! [.contact-page_&_li_>_svg]:[flex-shrink:0] [.contact-page_&_li_>_span]:[flex:1] [.contact-page_&_li_>_span]:[min-width:0] [.contact-page_&_li_>_span]:[overflow-wrap:anywhere] [.contact-page_&_button]:[display:grid]! [.contact-page_&_button]:[place-items:center] [.contact-page_&_button]:[flex:0_0_32px] [.contact-page_&_button]:[width:32px] [.contact-page_&_button]:[height:32px] [.contact-page_&_button]:[border:0] [.contact-page_&_button]:[border-radius:6px] [.contact-page_&_button]:[background:transparent] [.contact-page_&_button]:[color:#0d5792]! [.contact-page_&_button]:[cursor:pointer] [.contact-page_&_button:hover]:[background:#005eff14] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr]"
                  aria-label="Selected technical documents"
                >
                  {attachments.map((file) => (
                    <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                      <FiFileText aria-hidden="true" />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() =>
                          setAttachments((current) =>
                            current.filter((item) => item !== file),
                          )
                        }
                      >
                        <FiX aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>
            <div className="contact-write-actions [.contact-page_&]:[display:flex]! [.contact-page_&]:[flex-direction:column] [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:25px]">
              <label className="contact-write-consent [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:flex-start] [.contact-page_&]:[gap:8px] [.contact-page_&]:[max-width:100%] [.contact-page_&]:[font-size:15px]! [.contact-page_&]:[line-height:1.2]! [.contact-page_&]:[color:#000]! [.contact-page_&]:[cursor:pointer] [.contact-page_&_input]:[appearance:none] [.contact-page_&_input]:[display:grid]! [.contact-page_&_input]:[place-items:center] [.contact-page_&_input]:[flex:0_0_16px] [.contact-page_&_input]:[width:16px] [.contact-page_&_input]:[height:16px] [.contact-page_&_input]:[margin-top:1px] [.contact-page_&_input]:[margin-right:0] [.contact-page_&_input]:[margin-bottom:0] [.contact-page_&_input]:[margin-left:0] [.contact-page_&_input]:[border:0] [.contact-page_&_input]:[border-radius:3px] [.contact-page_&_input]:[background:#d9d9d9] [.contact-page_&_input]:[cursor:pointer] [.contact-page_&_input:checked]:[background:#005eff] [.contact-page_&_input:checked::after]:[content:''] [.contact-page_&_input:checked::after]:[width:5px] [.contact-page_&_input:checked::after]:[height:9px] [.contact-page_&_input:checked::after]:[border:solid_white] [.contact-page_&_input:checked::after]:[border-width:0_2px_2px_0] [.contact-page_&_input:checked::after]:[transform:translateY(-1px)_rotate(45deg)] [.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_input:focus-visible]:[outline-offset:3px] max-[768px]:[.contact-page_&]:[font-size:13px]!">
                <input name="privacyConsent" type="checkbox" required />
                <span>I have read and agree to the Privacy Policy.</span>
              </label>
              <button
                className="contact-write-send [.contact-page_&]:[--contact-send-offset:95px] [.contact-page_&]:[position:relative] [.contact-page_&]:[width:141px] [.contact-page_&]:[height:43px] [.contact-page_&]:[overflow:visible] [.contact-page_&]:[border:0.5px_solid_#9eb7d0] [.contact-page_&]:[border-radius:24px] [.contact-page_&]:[background:#f7f7f780] [.contact-page_&]:[box-shadow:inset_0_0_10px_#d1e7ff50] [.contact-page_&]:[color:#27272a]! [.contact-page_&]:[font-style:inherit] [.contact-page_&]:[font-variant:inherit] [.contact-page_&]:[font-weight:inherit]! [.contact-page_&]:[font-stretch:inherit]! [.contact-page_&]:[font-size:15px]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[font-family:inherit]! [.contact-page_&]:[font-feature-settings:inherit] [.contact-page_&]:[font-variation-settings:inherit]! [.contact-page_&]:[cursor:pointer] [.contact-page_&]:[transition:--contact-send-offset_400ms_ease-in-out] [.contact-page_&:is(:hover,_:focus-visible)]:[--contact-send-offset:0px] motion-reduce:[.contact-page_&]:[transition:none]"
                type="submit"
              >
                <span className="contact-write-send-label [.contact-page_&]:[position:absolute] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[padding-left:calc(55px_-_var(--contact-send-offset)_*_0.368421053)] [.contact-page_&]:[white-space:nowrap] [.contact-page_&]:[mask-image:radial-gradient(circle_at_calc(22.5px_+_var(--contact-send-offset))_50%,_transparent_19px,_#000_20px)]">
                  Send
                </span>
                <span
                  className="contact-write-send-orb [.contact-page_&]:[position:absolute] [.contact-page_&]:[top:50%] [.contact-page_&]:[left:calc(6px_+_var(--contact-send-offset))] [.contact-page_&]:[width:33px] [.contact-page_&]:[height:33px] [.contact-page_&]:[transform:translateY(-50%)] [.contact-page_&]:[border-radius:50%] [.contact-page_&]:[background:linear-gradient(180deg,_#005eff,_#0024b8)] [.contact-page_&]:[box-shadow:inset_0_1px_3px_#8fc5ff66,_0_0_14px_#005eff99,_8px_0_24px_#005eff66]"
                  aria-hidden="true"
                />
              </button>
              <p
                className="contact-write-feedback [.contact-page_&]:[min-height:18px] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[text-align:center] [.contact-page_&]:[color:#0d5792]! [.contact-page_&]:[font-size:13px]! [.contact-page_&]:[line-height:1.35]!"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {formFeedback}
              </p>
            </div>
          </motion.form>
          <NewsletterSubscription />
        </div>
      </section>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.
const twContactPageRules: Record<string, string> = {
  "contact-page":
    "[html:has(&)]:[overflow-x:clip] [body:has(&)]:[overflow-x:clip] [--contact-unit:clamp(0.71px,_0.0694444444vw,_1.777778px)] [--contact-header-offset:97px] [width:100%] [min-height:100svh] [margin-top:calc(-1_*_var(--contact-header-offset))] [overflow-x:clip] [background:#ddeeff] [letter-spacing:0] max-[1024px]:[--contact-unit:1px]",
  "contact-hero":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:1] [.contact-page_&]:[isolation:isolate] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:calc(805_*_var(--contact-unit))] [.contact-page_&]:[overflow:visible] [.contact-page_&]:[background:#061824] [.contact-page_&::after]:[content:''] [.contact-page_&::after]:[position:absolute] [.contact-page_&::after]:[z-index:3] [.contact-page_&::after]:[top:auto] [.contact-page_&::after]:[right:0] [.contact-page_&::after]:[bottom:0] [.contact-page_&::after]:[left:0] [.contact-page_&::after]:[height:1px] [.contact-page_&::after]:[background:#9bdcff] [.contact-page_&::after]:[box-shadow:0_0_8px_#48b8ff80] [.contact-page_&::after]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[height:850px] max-[768px]:[.contact-page_&]:[height:860px] max-[768px]:[.contact-page_&]:[min-height:0] max-[768px]:[.contact-page_&]:[padding-top:0]",
  "contact-hero-background":
    "[.contact-page_&]:[z-index:0] [.contact-page_&]:[object-fit:cover] [.contact-page_&]:[object-position:right_top] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[height:660px]! max-[1024px]:[.contact-page_&]:[object-position:70%_top] max-[768px]:[.contact-page_&]:[top:250px]! max-[768px]:[.contact-page_&]:[left:50%]! max-[768px]:[.contact-page_&]:[right:auto]! max-[768px]:[.contact-page_&]:[width:min(160%,_640px)]! max-[768px]:[.contact-page_&]:[max-width:none] max-[768px]:[.contact-page_&]:[height:auto]! max-[768px]:[.contact-page_&]:[object-fit:contain] max-[768px]:[.contact-page_&]:[object-position:right_top] max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_20%,_#000_100%)] max-[768px]:[.contact-page_&]:[transform:translateX(-59.4%)] max-[768px]:[.contact-page_&]:[clip-path:inset(0_0_28%_0)]",
  "contact-particles":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:calc(337_*_var(--contact-unit))] [.contact-page_&]:[left:calc(-149_*_var(--contact-unit))] [.contact-page_&]:[width:calc(908_*_var(--contact-unit))] [.contact-page_&]:[height:calc(510_*_var(--contact-unit))] [.contact-page_&]:[max-width:none] [.contact-page_&]:[object-fit:contain] [.contact-page_&]:[mix-blend-mode:screen] [.contact-page_&]:[clip-path:inset(0_0_calc(42_*_var(--contact-unit))_0)] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:310px] max-[1024px]:[.contact-page_&]:[left:-180px] max-[1024px]:[.contact-page_&]:[width:760px] max-[1024px]:[.contact-page_&]:[height:428px] max-[768px]:[.contact-page_&]:[top:325px] max-[768px]:[.contact-page_&]:[left:-80px] max-[768px]:[.contact-page_&]:[width:480px] max-[768px]:[.contact-page_&]:[height:270px] motion-reduce:[.contact-page_&]:[visibility:hidden]",
  "contact-title":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:4] [.contact-page_&]:[top:calc(222_*_var(--contact-unit))] [.contact-page_&]:[left:calc(120_*_var(--contact-unit))] [.contact-page_&]:[width:calc(618_*_var(--contact-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[color:#f7f7f7]! [.contact-page_&]:[font-size:calc(36_*_var(--contact-unit))]! [.contact-page_&]:[font-weight:410]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[letter-spacing:0] [.contact-page_&_span]:[display:block]! max-[1024px]:[.contact-page_&]:[top:180px] max-[1024px]:[.contact-page_&]:[left:6%] max-[1024px]:[.contact-page_&]:[width:60%] max-[1024px]:[.contact-page_&]:[font-size:clamp(22px,_3vw,_30px)]! max-[768px]:[.contact-page_&]:[top:140px] max-[768px]:[.contact-page_&]:[left:28px] max-[768px]:[.contact-page_&]:[width:calc(100%_-_56px)] max-[768px]:[.contact-page_&]:[font-size:clamp(24px,_6.65vw,_30px)]! max-[768px]:[.contact-page_&_span]:[white-space:normal] max-[768px]:[.contact-page_&]:[max-width:340px] max-[768px]:[.contact-page_&]:[line-height:1.04]! max-[768px]:[.contact-page_&_span]:[display:contents]!",
  "contact-bottom-atmosphere":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:2] [.contact-page_&]:[top:auto] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[height:calc(260_*_var(--contact-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_transparent_0%,_#20384d80_24%,_#24374bd9_100%)] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[height:330px] max-[768px]:[.contact-page_&]:[top:480px] max-[768px]:[.contact-page_&]:[bottom:0] max-[768px]:[.contact-page_&]:[height:auto] max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_transparent,_#173a60cc_18%,_#24374b_100%)]",
  "contact-light-line":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:3] [.contact-page_&]:[top:calc(563_*_var(--contact-unit))] [.contact-page_&]:[left:0] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:calc(48_*_var(--contact-unit))] [.contact-page_&]:[overflow:hidden] [.contact-page_&]:[mix-blend-mode:screen] [.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_35%,_#000_65%,_transparent)] [.contact-page_&]:[pointer-events:none] [.contact-page_&_video]:[position:absolute] [.contact-page_&_video]:[top:50%] [.contact-page_&_video]:[left:0] [.contact-page_&_video]:[width:100%] [.contact-page_&_video]:[max-width:none] [.contact-page_&_video]:[height:auto] [.contact-page_&_video]:[aspect-ratio:16_/_9] [.contact-page_&_video]:[transform:translateY(-50%)] [.contact-page_&_video]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:548px] max-[768px]:[.contact-page_&]:[top:486px] max-[768px]:[.contact-page_&]:[height:52px] max-[768px]:[.contact-page_&_video]:[width:1440px] max-[768px]:[.contact-page_&_video]:[left:50%] max-[768px]:[.contact-page_&_video]:[transform:translate(-50%,_-50%)] motion-reduce:[.contact-page_&]:[visibility:hidden]",
  "contact-logistics":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:4] [.contact-page_&]:[top:calc(587_*_var(--contact-unit))] [.contact-page_&]:[left:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[padding-top:calc(26_*_var(--contact-unit))] [.contact-page_&]:[padding-right:calc(120_*_var(--contact-unit))] [.contact-page_&]:[padding-bottom:calc(38_*_var(--contact-unit))] [.contact-page_&]:[padding-left:calc(120_*_var(--contact-unit))] [.contact-page_&]:[isolation:isolate] [.contact-page_&::before]:[content:''] [.contact-page_&::before]:[position:absolute] [.contact-page_&::before]:[z-index:-1] [.contact-page_&::before]:[top:0] [.contact-page_&::before]:[right:0] [.contact-page_&::before]:[bottom:0] [.contact-page_&::before]:[left:0] [.contact-page_&::before]:[background:linear-gradient(110deg,_#183547b3,_#42577380_55%,_#29333bc4)] [.contact-page_&::before]:[backdrop-filter:blur(8px)] [.contact-page_&::before]:[pointer-events:none] [.contact-page_&_h2]:[margin-top:0] [.contact-page_&_h2]:[margin-right:0] [.contact-page_&_h2]:[margin-bottom:0] [.contact-page_&_h2]:[margin-left:0] [.contact-page_&_h2]:[color:#f7f7f7]! [.contact-page_&_h2]:[font-size:calc(20_*_var(--contact-unit))]! [.contact-page_&_h2]:[font-weight:410]! [.contact-page_&_h2]:[line-height:1.2]! [.contact-page_&_h2]:[letter-spacing:-0.04em] max-[1024px]:[.contact-page_&]:[top:572px] max-[1024px]:[.contact-page_&]:[padding-top:30px] max-[1024px]:[.contact-page_&]:[padding-right:6%] max-[1024px]:[.contact-page_&]:[padding-bottom:56px] max-[1024px]:[.contact-page_&]:[padding-left:6%] max-[768px]:[.contact-page_&]:[position:absolute] max-[768px]:[.contact-page_&]:[top:510px] max-[768px]:[.contact-page_&]:[bottom:0] max-[768px]:[.contact-page_&]:[padding-top:20px] max-[768px]:[.contact-page_&]:[padding-right:28px] max-[768px]:[.contact-page_&]:[padding-bottom:0] max-[768px]:[.contact-page_&]:[padding-left:28px] max-[768px]:[.contact-page_&_h2]:[max-width:18em] max-[768px]:[.contact-page_&_h2]:[font-size:18px]! max-[768px]:[.contact-page_&]:[z-index:auto] max-[768px]:[.contact-page_&]:[isolation:auto] max-[768px]:[.contact-page_&::before]:[display:none]! max-[768px]:[.contact-page_&_h2]:[position:relative] max-[768px]:[.contact-page_&_h2]:[z-index:4] max-[768px]:[.contact-page_&_h2]:[line-height:1.12]!",
  "contact-logistics-inner":
    "[.contact-page_&]:[max-width:calc(744_*_var(--contact-unit))] max-[1024px]:[.contact-page_&]:[max-width:67%] max-[768px]:[.contact-page_&]:[max-width:none]",
  "contact-eyebrow":
    "[.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(10_*_var(--contact-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[color:#9eb7d0]! [.contact-page_&]:[font-size:calc(12_*_var(--contact-unit))]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&]:[font-size:11px]! max-[768px]:[.contact-page_&]:[line-height:1.3]! max-[768px]:[.contact-page_.contact-logistics_&]:[position:relative] max-[768px]:[.contact-page_.contact-logistics_&]:[z-index:4] max-[768px]:[.contact-page_.contact-logistics_&]:[font-size:10px]! max-[768px]:[.contact-page_.contact-logistics_&]:[margin-bottom:8px]",
  "contact-transport-cards":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[left:calc(120_*_var(--contact-unit))] [.contact-page_&]:[bottom:calc(-28_*_var(--contact-unit))] [.contact-page_&]:[width:calc(600_*_var(--contact-unit))] [.contact-page_&]:[max-width:calc(100%_-_480_*_var(--contact-unit))] [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [.contact-page_&]:[gap:calc(12_*_var(--contact-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] max-[1024px]:[.contact-page_&]:[left:6%] max-[1024px]:[.contact-page_&]:[bottom:-28px] max-[1024px]:[.contact-page_&]:[width:60%] max-[1024px]:[.contact-page_&]:[max-width:60%] max-[1024px]:[.contact-page_&]:[gap:10px] max-[768px]:[.contact-page_&]:[position:absolute] max-[768px]:[.contact-page_&]:[width:190px] max-[768px]:[.contact-page_&]:[max-width:190px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:8px] max-[768px]:[.contact-page_&]:[margin-top:0] max-[768px]:[.contact-page_&]:[z-index:6] max-[768px]:[.contact-page_&]:[left:50%] max-[768px]:[.contact-page_&]:[bottom:-104px] max-[768px]:[.contact-page_&]:[margin-right:0] max-[768px]:[.contact-page_&]:[margin-bottom:0] max-[768px]:[.contact-page_&]:[margin-left:0] max-[768px]:[.contact-page_&]:[transform:translateX(-50%)]",
  "contact-transport-card":
    "[.contact-page_&]:[min-width:0] [.contact-page_&]:[padding-top:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-right:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-bottom:calc(12_*_var(--contact-unit))] [.contact-page_&]:[padding-left:calc(12_*_var(--contact-unit))] [.contact-page_&]:[border:1px_solid_#ffffff26] [.contact-page_&]:[border-radius:calc(11_*_var(--contact-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_#ffffff1f,_#ffffff66)] [.contact-page_&]:[box-shadow:inset_0_1px_12px_#d4eaff18,_0_12px_26px_#005eff12] [.contact-page_&]:[backdrop-filter:blur(20px)] [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_h3]:[display:flex]! [.contact-page_&_h3]:[align-items:center] [.contact-page_&_h3]:[gap:calc(7_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-top:0] [.contact-page_&_h3]:[margin-right:0] [.contact-page_&_h3]:[margin-bottom:calc(8_*_var(--contact-unit))] [.contact-page_&_h3]:[margin-left:0] [.contact-page_&_h3]:[color:#f7f7f7]! [.contact-page_&_h3]:[font-size:calc(12_*_var(--contact-unit))]! [.contact-page_&_h3]:[font-weight:410]! [.contact-page_&_h3]:[line-height:1.2]! [.contact-page_&_h3_svg]:[flex-shrink:0] [.contact-page_&_h3_svg]:[width:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[height:calc(16_*_var(--contact-unit))] [.contact-page_&_h3_svg]:[color:#c1ddfa]! [.contact-page_&_h3_svg]:[stroke-width:1.5] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[color:#c6def5]! [.contact-page_&_p]:[font-size:calc(11.5_*_var(--contact-unit))]! [.contact-page_&_p]:[line-height:1.25]! [.contact-page_&_strong]:[color:#f7f7f7]! [.contact-page_&_strong]:[font-weight:410]! max-[1024px]:[.contact-page_&]:[padding-top:12px] max-[1024px]:[.contact-page_&]:[padding-right:10px] max-[1024px]:[.contact-page_&]:[padding-bottom:12px] max-[1024px]:[.contact-page_&]:[padding-left:10px] max-[1024px]:[.contact-page_&_h3]:[flex-wrap:wrap] max-[1024px]:[.contact-page_&_h3]:[font-size:12px]! max-[768px]:[.contact-page_&]:[padding-top:10px] max-[768px]:[.contact-page_&]:[padding-right:14px] max-[768px]:[.contact-page_&]:[padding-bottom:10px] max-[768px]:[.contact-page_&]:[padding-left:14px] max-[768px]:[.contact-page_&_h3]:[flex-wrap:nowrap] max-[768px]:[.contact-page_&_h3]:[font-size:11px]! max-[768px]:[.contact-page_&_h3]:[margin-bottom:6px] max-[768px]:[.contact-page_&_p]:[font-size:11px]! max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_#d2e6ff59,_#d2e6ff9c)] max-[768px]:[.contact-page_&_h3]:[color:#18375b]! max-[768px]:[.contact-page_&_p]:[color:#005eff]! max-[768px]:[.contact-page_&_strong]:[color:#0d5792]! max-[768px]:[.contact-page_&_h3_svg]:[width:14px] max-[768px]:[.contact-page_&_h3_svg]:[height:14px] max-[768px]:[.contact-page_&_h3_svg]:[color:#18375b]!",
  "contact-yht":
    "[.contact-page_&]:[margin-left:calc(-3_*_var(--contact-unit))] [.contact-page_&]:[color:#65b5ff]! max-[768px]:[.contact-page_&]:[color:#005eff]!",
  "contact-representative":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:5] [.contact-page_&]:[top:calc(502_*_var(--contact-unit))] [.contact-page_&]:[left:calc(992_*_var(--contact-unit))] [.contact-page_&]:[width:calc(303_*_var(--contact-unit))] [.contact-page_&]:[height:calc(303_*_var(--contact-unit))] [.contact-page_&]:[object-fit:contain] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:auto] max-[1024px]:[.contact-page_&]:[bottom:0] max-[1024px]:[.contact-page_&]:[left:auto] max-[1024px]:[.contact-page_&]:[right:2%] max-[1024px]:[.contact-page_&]:[width:260px] max-[1024px]:[.contact-page_&]:[height:260px] max-[768px]:[.contact-page_&]:[top:570px] max-[768px]:[.contact-page_&]:[bottom:auto] max-[768px]:[.contact-page_&]:[right:auto] max-[768px]:[.contact-page_&]:[width:290px] max-[768px]:[.contact-page_&]:[height:290px] max-[768px]:[.contact-page_&]:[left:50%] max-[768px]:[.contact-page_&]:[transform:translateX(-50%)]",
  "contact-locations":
    "[.contact-page_&]:[--location-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:0] [.contact-page_&]:[padding-top:calc(60_*_var(--location-unit))] [.contact-page_&]:[padding-right:24px] [.contact-page_&]:[padding-bottom:calc(90_*_var(--location-unit))] [.contact-page_&]:[padding-left:24px] [.contact-page_&]:[background:radial-gradient(ellipse_at_25%_60%,_#b1cce955,_transparent_52%),_radial-gradient(ellipse_at_85%_78%,_#ffffff80,_transparent_48%),_linear-gradient(180deg,_#ddeeff_0%,_#d5e9fd_32%,_#e7f3ff_72%,_#f2f9ff_100%)] [.contact-page_&]:[color:#000]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_a:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_a:focus-visible]:[outline-offset:4px] max-[1200px]:[.contact-page_&]:[--location-unit:1px] max-[768px]:[.contact-page_&]:[padding-top:140px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:50px] max-[768px]:[.contact-page_&]:[padding-left:20px]",
  "contact-locations-inner":
    "[.contact-page_&]:[width:100%] [.contact-page_&]:[max-width:calc(1200_*_var(--location-unit))] [.contact-page_&]:[margin-left:auto] [.contact-page_&]:[margin-right:auto]",
  "contact-location-glass":
    "[.contact-page_&]:[border:0.5px_solid_#f7f7f7] [.contact-page_&]:[border-radius:calc(30_*_var(--location-unit))] [.contact-page_&]:[background:#ffffff40] [.contact-page_&]:[box-shadow:inset_0_1px_18px_#ffffff30,_0_8px_30px_#4274a308] [.contact-page_&]:[backdrop-filter:blur(30px)]",
  "contact-headquarters":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:minmax(0,_1fr)_minmax(0,_calc(616_*_var(--location-unit)))] [.contact-page_&]:[gap:calc(40_*_var(--location-unit))] [.contact-page_&]:[min-height:calc(411_*_var(--location-unit))] [.contact-page_&]:[padding-top:calc(35_*_var(--location-unit))] [.contact-page_&]:[padding-right:calc(35_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(35_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(35_*_var(--location-unit))] [.contact-page_&_h2]:[margin-top:0] [.contact-page_&_h2]:[margin-right:0] [.contact-page_&_h2]:[margin-bottom:calc(30_*_var(--location-unit))] [.contact-page_&_h2]:[margin-left:0] [.contact-page_&_h2]:[font-size:calc(20_*_var(--location-unit))]! [.contact-page_&_h2]:[font-weight:410]! [.contact-page_&_h2]:[line-height:1]! max-[1200px]:[.contact-page_&]:[grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)] max-[1024px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1024px]:[.contact-page_&]:[gap:32px] max-[1024px]:[.contact-page_&]:[padding-top:30px] max-[1024px]:[.contact-page_&]:[padding-right:30px] max-[1024px]:[.contact-page_&]:[padding-bottom:30px] max-[1024px]:[.contact-page_&]:[padding-left:30px] max-[768px]:[.contact-page_&]:[padding-top:26px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:26px] max-[768px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&]:[gap:26px]",
  "contact-info-list":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:calc(25_*_var(--location-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&_dt]:[margin-top:0] [.contact-page_&_dt]:[margin-right:0] [.contact-page_&_dt]:[margin-bottom:calc(10_*_var(--location-unit))] [.contact-page_&_dt]:[margin-left:0] [.contact-page_&_dt]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&_dt]:[font-weight:410]! [.contact-page_&_dt]:[line-height:1.12]! [.contact-page_&_dt]:[letter-spacing:0] [.contact-page_&_dd]:[margin-top:0] [.contact-page_&_dd]:[margin-right:0] [.contact-page_&_dd]:[margin-bottom:0] [.contact-page_&_dd]:[margin-left:0] [.contact-page_&_dd]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_dd]:[font-weight:410]! [.contact-page_&_dd]:[line-height:1]! [.contact-page_&_dd]:[overflow-wrap:anywhere] max-[1024px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1.3fr_1fr_0.7fr] max-[1024px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[1024px]:[.contact-page_&_dd]:[line-height:1.2]! max-[1024px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:none]! max-[768px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:24px] max-[768px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:inline]! max-[768px]:[.contact-page_&_dd]:[font-size:14px]! max-[768px]:[.contact-page_&_dd]:[line-height:1.2]!",
  "contact-info-label":
    "[.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(10_*_var(--location-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&]:[font-weight:410]! [.contact-page_&]:[line-height:1.12]! [.contact-page_&]:[letter-spacing:0]",
  "contact-location-phone":
    "[.contact-page_&]:[color:#0d5792]! [.contact-page_&]:[font-size:calc(25_*_var(--location-unit))]! [.contact-page_&]:[font-weight:540]! [.contact-page_&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[white-space:nowrap] [.contact-page_.contact-office-communication_&]:[font-size:calc(20_*_var(--location-unit))]! max-[768px]:[.contact-page_.contact-office-communication_&]:[font-size:18px]!",
  "contact-headquarters-map-column":
    "[.contact-page_&]:[min-width:0] max-[768px]:[.contact-page_&]:[display:contents]!",
  "contact-location-map":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:calc(246_*_var(--location-unit))] [.contact-page_&]:[overflow:hidden] [.contact-page_&]:[border-radius:calc(30_*_var(--location-unit))] [.contact-page_&]:[background:#111c28] [.contact-page_&_img]:[object-fit:cover] [.contact-page_&_img]:[object-position:center] max-[1024px]:[.contact-page_&]:[height:auto] max-[1024px]:[.contact-page_&]:[aspect-ratio:616_/_246] max-[768px]:[.contact-page_&]:[aspect-ratio:340_/_180] max-[768px]:[.contact-page_&]:[border-radius:22px] max-[768px]:[.contact-page_.contact-headquarters_&]:[order:1] max-[768px]:[.contact-page_.contact-headquarters_&]:[aspect-ratio:4_/_3] max-[768px]:[.contact-page_.contact-headquarters_&]:[margin-bottom:56px] max-[768px]:[.contact-page_.contact-headquarters_&]:[overflow:visible] max-[768px]:[.contact-page_.contact-headquarters_&_img]:[border-radius:inherit]",
  "contact-directions":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:calc(18_*_var(--location-unit))] [.contact-page_&]:[right:calc(18_*_var(--location-unit))] [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[justify-content:center] [.contact-page_&]:[gap:calc(10_*_var(--location-unit))] [.contact-page_&]:[min-height:calc(41_*_var(--location-unit))] [.contact-page_&]:[padding-top:calc(10_*_var(--location-unit))] [.contact-page_&]:[padding-right:calc(15_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(10_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(15_*_var(--location-unit))] [.contact-page_&]:[border:0.5px_solid_#ffffffb3] [.contact-page_&]:[border-radius:calc(12_*_var(--location-unit))] [.contact-page_&]:[background:#122c4ec4] [.contact-page_&]:[backdrop-filter:blur(12px)] [.contact-page_&]:[color:#f7f7f7]! [.contact-page_&]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&]:[white-space:nowrap] [.contact-page_&]:[transition:background_200ms_ease,_box-shadow_200ms_ease] [.contact-page_&_svg]:[width:calc(20_*_var(--location-unit))] [.contact-page_&_svg]:[height:calc(20_*_var(--location-unit))] [.contact-page_&_svg]:[color:#459dff]! [.contact-page_&_svg]:[filter:drop-shadow(0_0_5px_#005effb3)] [.contact-page_&:hover]:[background:#123e6fe6] [.contact-page_&:hover]:[box-shadow:0_0_15px_#005eff40] [.contact-page_.contact-location-map--compact_&&]:[top:50%] [.contact-page_.contact-location-map--compact_&&]:[left:50%] [.contact-page_.contact-location-map--compact_&&]:[right:auto] [.contact-page_.contact-location-map--compact_&&]:[transform:translate(-50%,_-50%)] max-[768px]:[.contact-page_&]:[top:12px] max-[768px]:[.contact-page_&]:[right:12px] max-[768px]:[.contact-page_&]:[min-height:44px] max-[768px]:[.contact-page_&]:[padding-top:10px] max-[768px]:[.contact-page_&]:[padding-right:12px] max-[768px]:[.contact-page_&]:[padding-bottom:10px] max-[768px]:[.contact-page_&]:[padding-left:12px] motion-reduce:[.contact-page_&]:[transition:none] max-[768px]:[.contact-page_.contact-headquarters_&]:[top:calc(100%_+_14px)] max-[768px]:[.contact-page_.contact-headquarters_&]:[left:50%] max-[768px]:[.contact-page_.contact-headquarters_&]:[right:auto] max-[768px]:[.contact-page_.contact-headquarters_&]:[transform:translateX(-50%)] max-[768px]:[.contact-page_.contact-headquarters_&]:[min-height:36px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-top:8px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-right:14px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-bottom:8px] max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-left:14px] max-[768px]:[.contact-page_.contact-headquarters_&]:[border-color:#f7f7f7b3] max-[768px]:[.contact-page_.contact-headquarters_&]:[background:linear-gradient(90deg,_#ffffff40,_#7db7ff66)] max-[768px]:[.contact-page_.contact-headquarters_&]:[color:#f7f7f7]!",
  "contact-location-footer":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:flex-end] [.contact-page_&]:[justify-content:space-between] [.contact-page_&]:[gap:calc(20_*_var(--location-unit))] [.contact-page_&]:[margin-top:calc(24_*_var(--location-unit))] [.contact-page_.contact-office-content_&]:[gap:calc(12_*_var(--location-unit))] [.contact-page_.contact-office-content_&]:[margin-top:calc(20_*_var(--location-unit))]! max-[1200px]:[.contact-page_.contact-office-content_&]:[flex-wrap:wrap] max-[1024px]:[.contact-page_.contact-office-content_&]:[flex-wrap:nowrap] max-[768px]:[.contact-page_&]:[align-items:flex-start] max-[768px]:[.contact-page_&]:[flex-wrap:wrap] max-[768px]:[.contact-page_&]:[gap:18px] max-[768px]:[.contact-page_.contact-office-content_&]:[flex-wrap:nowrap] max-[768px]:[.contact-page_.contact-office-content_&]:[gap:8px] max-[768px]:[.contact-page_.contact-headquarters_&]:[order:3] max-[768px]:[.contact-page_.contact-headquarters_&]:[margin-top:0] max-[768px]:[.contact-page_.contact-headquarters_&]:[flex-wrap:nowrap] max-[768px]:[.contact-page_.contact-headquarters_&]:[align-items:flex-end] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:8px] max-[768px]:[.contact-page_.contact-office-content_&]:[align-items:flex-end]",
  "contact-business-hours":
    "[.contact-page_&_>_p:last-child]:[margin-top:0] [.contact-page_&_>_p:last-child]:[margin-right:0] [.contact-page_&_>_p:last-child]:[margin-bottom:0] [.contact-page_&_>_p:last-child]:[margin-left:0] [.contact-page_&_>_p:last-child]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_>_p:last-child]:[line-height:1]! [.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:calc(12_*_var(--location-unit))]! [.contact-page_.contact-office-content_&_>_p:last-child]:[line-height:1.12]! max-[1024px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:15px]! max-[768px]:[.contact-page_&_>_p:last-child]:[font-size:14px]! max-[768px]:[.contact-page_&_>_p:last-child]:[line-height:1.2]! max-[768px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:12px]! max-[768px]:[.contact-page_.contact-headquarters_&_>_p:last-child]:[font-size:12px]! max-[768px]:[.contact-page_.contact-headquarters_&_>_p:last-child]:[line-height:1.12]!",
  "contact-map-services":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[flex-shrink:0] [.contact-page_&]:[gap:calc(12_*_var(--location-unit))] [.contact-page_&_a]:[display:grid]! [.contact-page_&_a]:[place-items:center] [.contact-page_&_a]:[width:calc(34_*_var(--location-unit))] [.contact-page_&_a]:[height:calc(34_*_var(--location-unit))] [.contact-page_&_a]:[border-radius:8px] [.contact-page_&_a]:[transition:transform_200ms_ease] [.contact-page_&_svg]:[width:calc(30_*_var(--location-unit))] [.contact-page_&_svg]:[height:calc(30_*_var(--location-unit))] [.contact-page_&_a:hover]:[transform:translateY(-3px)] [.contact-page_.contact-office-content_&]:[gap:calc(6_*_var(--location-unit))] max-[768px]:[.contact-page_&_a]:[width:36px] max-[768px]:[.contact-page_&_a]:[height:36px] motion-reduce:[.contact-page_&_a]:[transition:none] max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:6px] max-[768px]:[.contact-page_.contact-headquarters_&_a]:[width:28px] max-[768px]:[.contact-page_.contact-headquarters_&_a]:[height:32px] max-[768px]:[.contact-page_.contact-headquarters_&_svg]:[width:24px] max-[768px]:[.contact-page_.contact-headquarters_&_svg]:[height:24px] max-[768px]:[.contact-page_.contact-office-content_&_a]:[width:28px] max-[768px]:[.contact-page_.contact-office-content_&_a]:[height:32px] max-[768px]:[.contact-page_.contact-office-content_&_svg]:[width:24px] max-[768px]:[.contact-page_.contact-office-content_&_svg]:[height:24px]",
  "contact-google-maps-icon": "[.contact-page_&]:[color:#34a853]!",
  "contact-office-heading":
    "[.contact-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_button:focus-visible]:[outline-offset:-6px] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&_button]:[display:flex]! [.contact-page_&_button]:[align-items:center] [.contact-page_&_button]:[justify-content:space-between] [.contact-page_&_button]:[gap:calc(10_*_var(--location-unit))] [.contact-page_&_button]:[width:100%] [.contact-page_&_button]:[min-height:calc(101_*_var(--location-unit))] [.contact-page_&_button]:[padding-top:calc(35_*_var(--location-unit))] [.contact-page_&_button]:[padding-right:calc(25_*_var(--location-unit))] [.contact-page_&_button]:[padding-bottom:calc(35_*_var(--location-unit))] [.contact-page_&_button]:[padding-left:calc(25_*_var(--location-unit))] [.contact-page_&_button]:[border:0] [.contact-page_&_button]:[background:transparent] [.contact-page_&_button]:[color:#000]! [.contact-page_&_button]:[font-style:inherit] [.contact-page_&_button]:[font-variant:inherit] [.contact-page_&_button]:[font-weight:410]! [.contact-page_&_button]:[font-stretch:inherit]! [.contact-page_&_button]:[font-size:calc(20_*_var(--location-unit))]! [.contact-page_&_button]:[line-height:1]! [.contact-page_&_button]:[font-family:inherit]! [.contact-page_&_button]:[font-feature-settings:inherit] [.contact-page_&_button]:[font-variation-settings:inherit]! [.contact-page_&_button]:[letter-spacing:-0.04em] [.contact-page_&_button]:[text-align:left] [.contact-page_&_button]:[cursor:pointer] [.contact-page_&_button:focus-visible]:[border-radius:calc(30_*_var(--location-unit))] max-[1200px]:[.contact-page_&_button]:[font-size:17px]! max-[1200px]:[.contact-page_&_button]:[padding-left:20px] max-[1200px]:[.contact-page_&_button]:[padding-right:20px] max-[1024px]:[.contact-page_&_button]:[font-size:20px]! max-[1024px]:[.contact-page_&_button]:[padding-left:25px] max-[1024px]:[.contact-page_&_button]:[padding-right:25px] max-[768px]:[.contact-page_&_button]:[padding-top:28px] max-[768px]:[.contact-page_&_button]:[padding-right:20px] max-[768px]:[.contact-page_&_button]:[padding-bottom:28px] max-[768px]:[.contact-page_&_button]:[padding-left:20px] max-[768px]:[.contact-page_&_button]:[min-height:88px] max-[768px]:[.contact-page_&_button]:[font-size:18px]!",
  "contact-offices":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[isolation:isolate] [.contact-page_&]:[margin-top:calc(24_*_var(--location-unit))] [.contact-page_&]:[min-height:calc(648_*_var(--location-unit))] max-[1024px]:[.contact-page_&]:[padding-bottom:180px] max-[768px]:[.contact-page_&]:[padding-bottom:0] max-[768px]:[.contact-page_&]:[min-height:0] max-[768px]:[.contact-page_&]:[margin-top:24px] max-[768px]:[.contact-page_&]:[padding-top:190px]",
  "contact-factory":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:0] [.contact-page_&]:[top:calc(8_*_var(--location-unit))] [.contact-page_&]:[left:calc(76_*_var(--location-unit))] [.contact-page_&]:[width:calc(1152_*_var(--location-unit))] [.contact-page_&]:[max-width:none] [.contact-page_&]:[height:auto] [.contact-page_&]:[pointer-events:none] max-[1024px]:[.contact-page_&]:[top:auto] max-[1024px]:[.contact-page_&]:[bottom:-40px] max-[1024px]:[.contact-page_&]:[left:0] max-[1024px]:[.contact-page_&]:[width:100%] max-[768px]:[.contact-page_&]:[bottom:auto] max-[768px]:[.contact-page_&]:[left:-5%] max-[768px]:[.contact-page_&]:[width:110%] max-[768px]:[.contact-page_&]:[top:-25px]",
  "contact-factory-atmosphere":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[background:radial-gradient(ellipse_at_45%_60%,_#17396518,_transparent_60%)] [.contact-page_&]:[pointer-events:none] max-[768px]:[.contact-page_&]:[display:none]!",
  "contact-office-grid":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:2] [.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [.contact-page_&]:[align-items:start] [.contact-page_&]:[gap:calc(15_*_var(--location-unit))] max-[1024px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1024px]:[.contact-page_&]:[gap:16px]",
  "contact-office":
    "[.contact-page_&]:[min-width:0] [.contact-page_&]:[overflow:hidden] [.contact-page_&[data-open='true']]:[background:linear-gradient(145deg,_#ffffff40_0%,_#ffffff25_55%,_#16315840_100%)]",
  "contact-office-arrow":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[place-items:center] [.contact-page_&]:[flex:0_0_calc(30_*_var(--location-unit))] [.contact-page_&]:[width:calc(30_*_var(--location-unit))] [.contact-page_&]:[height:calc(30_*_var(--location-unit))] [.contact-page_&]:[border-radius:50%] [.contact-page_&]:[background:linear-gradient(145deg,_#005eff,_#0033c8)] [.contact-page_&]:[box-shadow:0_0_12px_#005eff66,_0_3px_8px_#0033c829] [.contact-page_&]:[transition:box-shadow_250ms_ease] [.contact-page_&_svg]:[width:65%] [.contact-page_&_svg]:[height:65%] [.contact-page_&_svg]:[color:#fff]! [.contact-page_&_svg]:[stroke-width:2] [.contact-page_&_svg]:[transition:transform_400ms_ease-in-out] [.contact-page_.contact-office[data-open='true']_&_svg]:[transform:rotate(180deg)] [.contact-page_.contact-office-heading_button:hover_&]:[box-shadow:0_0_18px_#005eff99,_0_3px_8px_#0033c840] motion-reduce:[.contact-page_&_svg]:[transition:none] motion-reduce:[.contact-page_&]:[transition:none]",
  "contact-office-panel":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-rows:0fr] [.contact-page_&]:[opacity:0] [.contact-page_&]:[transition:grid-template-rows_400ms_ease-in-out,_opacity_300ms_ease-in-out] [.contact-page_.contact-office[data-open='true']_&]:[grid-template-rows:1fr] [.contact-page_.contact-office[data-open='true']_&]:[opacity:1] motion-reduce:[.contact-page_&]:[transition:none]",
  "contact-office-panel-inner":
    "[.contact-page_&]:[min-height:0] [.contact-page_&]:[overflow:hidden]",
  "contact-office-content":
    "[.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:calc(25_*_var(--location-unit))] [.contact-page_&]:[padding-bottom:calc(28_*_var(--location-unit))] [.contact-page_&]:[padding-left:calc(25_*_var(--location-unit))] max-[1200px]:[.contact-page_&]:[padding-left:20px] max-[1200px]:[.contact-page_&]:[padding-right:20px] max-[1024px]:[.contact-page_&]:[padding-left:25px] max-[1024px]:[.contact-page_&]:[padding-right:25px] max-[768px]:[.contact-page_&]:[padding-top:0] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:26px] max-[768px]:[.contact-page_&]:[padding-left:20px]",
  "contact-office-communication":
    "[.contact-page_&]:[grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [.contact-page_&]:[gap:calc(12_*_var(--location-unit))] [.contact-page_&]:[margin-top:calc(20_*_var(--location-unit))]! [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(20_*_var(--location-unit))]! [.contact-page_&]:[margin-left:0] [.contact-page_&_dd]:[font-size:calc(12_*_var(--location-unit))]! max-[1024px]:[.contact-page_&]:[max-width:440px] max-[1024px]:[.contact-page_&_dd]:[font-size:15px]! max-[768px]:[.contact-page_&]:[grid-template-columns:minmax(100px,_0.8fr)_minmax(0,_1.2fr)] max-[768px]:[.contact-page_&]:[gap:10px] max-[768px]:[.contact-page_&_dd]:[font-size:11px]!",
  "contact-location-map--compact":
    "[.contact-page_&]:[height:calc(130_*_var(--location-unit))] max-[1024px]:[.contact-page_&&]:[aspect-ratio:340_/_130] max-[1024px]:[.contact-page_&&]:[max-height:246px] max-[768px]:[.contact-page_&&]:[aspect-ratio:340_/_160]",
  "contact-office-pending":
    "[.contact-page_&]:[min-height:calc(395_*_var(--location-unit))] [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:flex-start] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[max-width:22em] [.contact-page_&_p]:[color:#0d5792]! [.contact-page_&_p]:[font-size:calc(15_*_var(--location-unit))]! [.contact-page_&_p]:[line-height:1.35]! max-[1024px]:[.contact-page_&]:[min-height:240px] max-[768px]:[.contact-page_&]:[min-height:200px]",
  "contact-plaza-info": "max-[1024px]:[.contact-page_&]:[max-width:440px]",
  "contact-sales":
    "[.contact-page_&]:[--sales-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:2] [.contact-page_&]:[isolation:isolate] [.contact-page_&]:[overflow:visible] [.contact-page_&]:[padding-top:calc(66_*_var(--sales-unit))] [.contact-page_&]:[padding-right:24px] [.contact-page_&]:[padding-bottom:0] [.contact-page_&]:[padding-left:24px] [.contact-page_&]:[background:linear-gradient(90deg,_#1c2fb8_0%,_#081e63_40%,_#02111f_100%)] [.contact-page_&]:[color:#fff]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_h2]:[margin-top:0] [.contact-page_&_h2]:[margin-right:0] [.contact-page_&_h2]:[margin-bottom:calc(54_*_var(--sales-unit))] [.contact-page_&_h2]:[margin-left:0] [.contact-page_&_h2]:[color:#fff]! [.contact-page_&_h2]:[font-size:calc(50_*_var(--sales-unit))]! [.contact-page_&_h2]:[font-weight:410]! [.contact-page_&_h2]:[line-height:1]! [.contact-page_&_h2]:[text-align:center] [.contact-page_&_h2]:[letter-spacing:-0.04em] [.contact-page_&_button:focus-visible]:[outline:2px_solid_#c0e2ff] [.contact-page_&_button:focus-visible]:[outline-offset:4px] [.contact-page_&_a:focus-visible]:[outline:2px_solid_#c0e2ff] [.contact-page_&_a:focus-visible]:[outline-offset:4px] max-[1200px]:[.contact-page_&]:[--sales-unit:1px] max-[1200px]:[.contact-page_&]:[padding-top:44px] max-[1200px]:[.contact-page_&]:[padding-bottom:40px] max-[1200px]:[.contact-page_&_h2]:[margin-bottom:36px] max-[1200px]:[.contact-page_&_h2]:[font-size:clamp(28px,_8vw,_38px)]! max-[1200px]:[.contact-page_&]:[padding-right:20px] max-[1200px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&]:[padding-top:44px] max-[768px]:[.contact-page_&]:[padding-right:16px] max-[768px]:[.contact-page_&]:[padding-bottom:0] max-[768px]:[.contact-page_&]:[padding-left:16px] max-[768px]:[.contact-page_&_h2]:[margin-bottom:26px] max-[768px]:[.contact-page_&_h2]:[font-size:clamp(27px,_7.5vw,_34px)]!",
  "contact-sales-earth":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:0] [.contact-page_&]:[top:0] [.contact-page_&]:[right:auto] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:-8%] [.contact-page_&]:[width:85%] [.contact-page_&]:[height:100%] [.contact-page_&]:[max-width:none] [.contact-page_&]:[object-fit:cover] [.contact-page_&]:[object-position:35%_center] [.contact-page_&]:[opacity:0.55] [.contact-page_&]:[mask-image:linear-gradient(90deg,_#000_0%,_#000_45%,_transparent_100%)] [.contact-page_&]:[pointer-events:none] max-[1200px]:[.contact-page_&]:[width:130%] max-[1200px]:[.contact-page_&]:[left:-30%] max-[1200px]:[.contact-page_&]:[opacity:0.4] motion-reduce:[.contact-page_&]:[visibility:hidden]",
  "contact-sales-overlay":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:1] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[background:linear-gradient(90deg,_#1c2fb866_0%,_#081e638c_40%,_#02111fe6_100%)] [.contact-page_&]:[pointer-events:none]",
  "contact-sales-glow":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:2] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[background:radial-gradient(ellipse_at_22%_35%,_#005eff59_0%,_transparent_34%),_radial-gradient(ellipse_at_14%_68%,_#478eff38_0%,_transparent_28%),_radial-gradient(ellipse_at_68%_14%,_#78aaff1f_0%,_transparent_35%)] [.contact-page_&]:[pointer-events:none]",
  "contact-sales-inner":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:3] [.contact-page_&]:[width:100%] [.contact-page_&]:[max-width:calc(1200_*_var(--sales-unit))] [.contact-page_&]:[margin-left:auto] [.contact-page_&]:[margin-right:auto]",
  "contact-sales-layout":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:minmax(0,_calc(380_*_var(--sales-unit)))_minmax(0,_1fr)] [.contact-page_&]:[align-items:start] [.contact-page_&]:[gap:calc(70_*_var(--sales-unit))] max-[1200px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1200px]:[.contact-page_&]:[gap:32px] max-[768px]:[.contact-page_&]:[gap:24px]",
  "contact-sales-introduction":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[padding-top:calc(32_*_var(--sales-unit))] [.contact-page_&::before]:[content:''] [.contact-page_&::before]:[position:absolute] [.contact-page_&::before]:[top:-15%] [.contact-page_&::before]:[right:-25%] [.contact-page_&::before]:[bottom:-15%] [.contact-page_&::before]:[left:-25%] [.contact-page_&::before]:[z-index:-1] [.contact-page_&::before]:[background:radial-gradient(ellipse_at_45%_38%,_#005eff33,_transparent_64%)] [.contact-page_&::before]:[pointer-events:none] max-[1200px]:[.contact-page_&]:[width:100%] max-[1200px]:[.contact-page_&]:[max-width:640px] max-[1200px]:[.contact-page_&]:[margin-left:auto] max-[1200px]:[.contact-page_&]:[margin-right:auto] max-[1200px]:[.contact-page_&]:[padding-top:0]",
  "contact-sales-description":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:calc(35_*_var(--sales-unit))] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[max-width:15em] [.contact-page_&]:[color:#fff]! [.contact-page_&]:[font-size:calc(25_*_var(--sales-unit))]! [.contact-page_&]:[font-weight:540]! [.contact-page_&]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&]:[line-height:1.12]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&]:[text-shadow:0_0_26px_#478eff40] max-[1200px]:[.contact-page_&]:[max-width:25em] max-[1200px]:[.contact-page_&]:[margin-bottom:24px] max-[1200px]:[.contact-page_&]:[font-size:22px]! max-[1200px]:[.contact-page_&]:[line-height:1.15]! max-[768px]:[.contact-page_&]:[font-size:21px]!",
  "contact-sales-filters":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:calc(14_*_var(--sales-unit))] [.contact-page_&_button]:[display:inline-flex]! [.contact-page_&_button]:[align-items:center] [.contact-page_&_button]:[justify-content:center] [.contact-page_&_button]:[gap:calc(12_*_var(--sales-unit))] [.contact-page_&_button]:[min-height:calc(37_*_var(--sales-unit))] [.contact-page_&_button]:[padding-top:calc(11_*_var(--sales-unit))] [.contact-page_&_button]:[padding-right:calc(15_*_var(--sales-unit))] [.contact-page_&_button]:[padding-bottom:calc(11_*_var(--sales-unit))] [.contact-page_&_button]:[padding-left:calc(15_*_var(--sales-unit))] [.contact-page_&_button]:[border:1px_solid_#78aaff59] [.contact-page_&_button]:[border-radius:calc(11_*_var(--sales-unit))] [.contact-page_&_button]:[background:#081e6359] [.contact-page_&_button]:[box-shadow:inset_0_0_12px_#478eff14,_0_0_15px_#005eff12] [.contact-page_&_button]:[backdrop-filter:blur(12px)] [.contact-page_&_button]:[color:#dceaff]! [.contact-page_&_button]:[font-style:inherit] [.contact-page_&_button]:[font-variant:inherit] [.contact-page_&_button]:[font-weight:inherit]! [.contact-page_&_button]:[font-stretch:inherit]! [.contact-page_&_button]:[font-size:calc(14_*_var(--sales-unit))]! [.contact-page_&_button]:[line-height:1.1]! [.contact-page_&_button]:[font-family:inherit]! [.contact-page_&_button]:[font-feature-settings:inherit] [.contact-page_&_button]:[font-variation-settings:inherit]! [.contact-page_&_button]:[letter-spacing:0] [.contact-page_&_button]:[cursor:pointer] [.contact-page_&_button]:[transition:background_220ms_ease,_border-color_220ms_ease,_box-shadow_220ms_ease] [.contact-page_&_button:hover]:[background:#005eff40] [.contact-page_&_button:hover]:[border-color:#a3ceffb3] [.contact-page_&_button:hover]:[box-shadow:inset_0_0_12px_#478eff26,_0_0_18px_#005eff40] [.contact-page_&_button[aria-pressed='true']]:[background:linear-gradient(145deg,_#005effb3,_#2c5cb966)] [.contact-page_&_button[aria-pressed='true']]:[border-color:#a7d0ffcc] [.contact-page_&_button[aria-pressed='true']]:[box-shadow:inset_0_0_14px_#78aaff33,_0_0_20px_#005eff59] [.contact-page_&_button[aria-pressed='true']]:[color:#fff]! max-[1200px]:[.contact-page_&]:[width:100%] max-[1200px]:[.contact-page_&]:[margin-left:auto] max-[1200px]:[.contact-page_&]:[margin-right:auto] max-[1200px]:[.contact-page_&]:[gap:8px] max-[1200px]:[.contact-page_&_button]:[min-height:44px] max-[1200px]:[.contact-page_&_button]:[padding-top:10px] max-[1200px]:[.contact-page_&_button]:[padding-right:8px] max-[1200px]:[.contact-page_&_button]:[padding-bottom:10px] max-[1200px]:[.contact-page_&_button]:[padding-left:8px] max-[1200px]:[.contact-page_&_button]:[font-size:10px]! motion-reduce:[.contact-page_&_button]:[transition:none] max-[768px]:[.contact-page_&_button]:[font-size:15px]! max-[768px]:[.contact-page_&_button]:[font-weight:410]! max-[768px]:[.contact-page_&_button]:[font-variation-settings:'wght'_410,_'wdth'_125]! max-[768px]:[.contact-page_&_button]:[line-height:1]! max-[768px]:[.contact-page_&_button]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_button]:[color:#fff]! max-[768px]:[.contact-page_&_button]:[padding-left:7px] max-[768px]:[.contact-page_&_button]:[padding-right:7px] max-[360px]:[.contact-page_&_button]:[font-size:13px]! max-[360px]:[.contact-page_&_button]:[padding-left:5px] max-[360px]:[.contact-page_&_button]:[padding-right:5px] max-[360px]:[.contact-page_&_button]:[gap:6px]",
  "contact-sales-filter-row":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[gap:calc(10_*_var(--sales-unit))] [.contact-page_&_button]:[flex:1_1_0] [.contact-page_&_button]:[min-width:0] [.contact-page_&:first-child_button:nth-child(1)]:[flex-grow:0.55] [.contact-page_&:first-child_button:nth-child(3)]:[flex-grow:1.75] [.contact-page_&:last-child_button]:[justify-content:center] max-[1200px]:[.contact-page_&]:[gap:8px]",
  "contact-sales-domestic":
    "[.contact-page_&]:[display:inline-flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:calc(7_*_var(--sales-unit))] [.contact-page_&]:[font-size:calc(10_*_var(--sales-unit))]! [.contact-page_&_img]:[width:calc(22_*_var(--sales-unit))] [.contact-page_&_img]:[height:calc(22_*_var(--sales-unit))] [.contact-page_&_img]:[border-radius:50%] [.contact-page_&_img]:[object-fit:cover] max-[360px]:[.contact-page_&]:[gap:4px] max-[360px]:[.contact-page_&]:[font-size:9px]! max-[360px]:[.contact-page_&_img]:[width:18px] max-[360px]:[.contact-page_&_img]:[height:18px]",
  "contact-sales-panel":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[min-width:0] [.contact-page_&]:[height:calc(510_*_var(--sales-unit))] [.contact-page_&]:[margin-bottom:calc(-44_*_var(--sales-unit))] [.contact-page_&]:[overflow:hidden] [.contact-page_&]:[border:0.5px_solid_#dce6ef59] [.contact-page_&]:[border-radius:calc(30_*_var(--sales-unit))] [.contact-page_&]:[background:#7d8da047] [.contact-page_&]:[backdrop-filter:blur(24px)] [.contact-page_&]:[box-shadow:inset_0_1px_22px_#ffffff12,_0_20px_60px_#020a1e33] max-[1200px]:[.contact-page_&]:[width:100%] max-[1200px]:[.contact-page_&]:[max-width:640px] max-[1200px]:[.contact-page_&]:[height:460px] max-[1200px]:[.contact-page_&]:[margin-left:auto] max-[1200px]:[.contact-page_&]:[margin-right:auto] max-[1200px]:[.contact-page_&]:[margin-bottom:0] max-[1200px]:[.contact-page_&]:[border-radius:24px] max-[768px]:[.contact-page_&]:[height:816px] max-[768px]:[.contact-page_&]:[margin-top:0] max-[768px]:[.contact-page_&]:[margin-right:0] max-[768px]:[.contact-page_&]:[margin-bottom:0] max-[768px]:[.contact-page_&]:[margin-left:0] max-[768px]:[.contact-page_&]:[overflow:hidden] max-[768px]:[.contact-page_&]:[border:0] max-[768px]:[.contact-page_&]:[border-radius:0] max-[768px]:[.contact-page_&]:[background:transparent] max-[768px]:[.contact-page_&]:[box-shadow:none] max-[768px]:[.contact-page_&]:[backdrop-filter:none]",
  "contact-sales-scroll":
    "[.contact-page_&]:[height:100%] [.contact-page_&]:[overflow-y:auto] [.contact-page_&]:[overflow-x:hidden] [.contact-page_&]:[padding-top:calc(30_*_var(--sales-unit))] [.contact-page_&]:[padding-right:calc(30_*_var(--sales-unit))] [.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_calc(106_*_var(--sales-unit)))] [.contact-page_&]:[padding-left:calc(30_*_var(--sales-unit))] [.contact-page_&]:[scrollbar-width:thin] [.contact-page_&]:[scrollbar-color:#f7f7f7b3_#ffffff0a] [.contact-page_&]:[overscroll-behavior-y:auto] [.contact-page_&]:[scrollbar-gutter:stable] [.contact-page_&::-webkit-scrollbar]:[width:5px] [.contact-page_&::-webkit-scrollbar-track]:[background:#ffffff0a] [.contact-page_&::-webkit-scrollbar-thumb]:[border-radius:20px] [.contact-page_&::-webkit-scrollbar-thumb]:[background:#f7f7f7b3] [.contact-page_&:focus-visible]:[outline:2px_solid_#c0e2ff] [.contact-page_&:focus-visible]:[outline-offset:-4px] [.contact-page_&:focus-visible]:[border-radius:inherit] max-[1200px]:[.contact-page_&]:[padding-left:16px] max-[1200px]:[.contact-page_&]:[padding-right:16px] max-[1200px]:[.contact-page_&]:[padding-top:20px] max-[1200px]:[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_96px)] max-[768px]:[.contact-page_&]:[height:100%] max-[768px]:[.contact-page_&]:[padding-top:0] max-[768px]:[.contact-page_&]:[padding-right:0] max-[768px]:[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_728px)] max-[768px]:[.contact-page_&]:[padding-left:0] max-[768px]:[.contact-page_&]:[overflow-y:auto] max-[768px]:[.contact-page_&]:[overflow-x:hidden] max-[768px]:[.contact-page_&]:[scrollbar-gutter:auto]",
  "contact-sales-grid":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:calc(12_*_var(--sales-unit))] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:0] [.contact-page_&]:[padding-bottom:0] [.contact-page_&]:[padding-left:0] [.contact-page_&]:[list-style:none] max-[1200px]:[.contact-page_&]:[grid-template-columns:1fr] max-[1200px]:[.contact-page_&]:[gap:12px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:8px]",
  "contact-sales-person":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[flex-direction:column] [.contact-page_&]:[align-items:flex-start] [.contact-page_&]:[gap:calc(10_*_var(--sales-unit))] [.contact-page_&]:[min-width:0] [.contact-page_&]:[min-height:calc(116_*_var(--sales-unit))] [.contact-page_&]:[padding-top:calc(16_*_var(--sales-unit))] [.contact-page_&]:[padding-right:calc(16_*_var(--sales-unit))] [.contact-page_&]:[padding-bottom:calc(16_*_var(--sales-unit))] [.contact-page_&]:[padding-left:calc(16_*_var(--sales-unit))] [.contact-page_&]:[border:0.5px_solid_#dce6ef33] [.contact-page_&]:[border-radius:calc(10_*_var(--sales-unit))] [.contact-page_&]:[background:#ffffff17] [.contact-page_&]:[box-shadow:inset_0_1px_10px_#ffffff08] [.contact-page_&]:[transition:background_220ms_ease,_border-color_220ms_ease] [.contact-page_&:hover]:[background:#ffffff24] [.contact-page_&:hover]:[border-color:#dce6ef66] [.contact-page_&_h3]:[margin-top:0] [.contact-page_&_h3]:[margin-right:0] [.contact-page_&_h3]:[margin-bottom:0] [.contact-page_&_h3]:[margin-left:0] [.contact-page_&_h3]:[color:#fff]! [.contact-page_&_h3]:[font-size:calc(16_*_var(--sales-unit))]! [.contact-page_&_h3]:[font-weight:540]! [.contact-page_&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&_h3]:[line-height:1.15]! [.contact-page_&_h3]:[letter-spacing:-0.04em] [.contact-page_&_p]:[margin-top:0] [.contact-page_&_p]:[margin-right:0] [.contact-page_&_p]:[margin-bottom:0] [.contact-page_&_p]:[margin-left:0] [.contact-page_&_p]:[color:#dce6efb3]! [.contact-page_&_p]:[font-size:calc(12_*_var(--sales-unit))]! [.contact-page_&_p]:[line-height:1.25]! [.contact-page_&_a]:[margin-top:auto] [.contact-page_&_a]:[max-width:100%] [.contact-page_&_a]:[color:#eef6ff]! [.contact-page_&_a]:[font-size:calc(12_*_var(--sales-unit))]! [.contact-page_&_a]:[line-height:1.2]! [.contact-page_&_a]:[overflow-wrap:anywhere] [.contact-page_&_a:hover]:[color:#fff]! [.contact-page_&_a:hover]:[text-decoration:underline]! [.contact-page_&_a:hover]:[text-underline-offset:3px] max-[1200px]:[.contact-page_&]:[padding-top:16px] max-[1200px]:[.contact-page_&]:[padding-right:16px] max-[1200px]:[.contact-page_&]:[padding-bottom:16px] max-[1200px]:[.contact-page_&]:[padding-left:16px] max-[1200px]:[.contact-page_&]:[min-height:112px] max-[1200px]:[.contact-page_&_h3]:[font-size:15px]! max-[1200px]:[.contact-page_&_p]:[font-size:12px]! max-[1200px]:[.contact-page_&_a]:[font-size:12px]! motion-reduce:[.contact-page_&]:[transition:none] max-[768px]:[.contact-page_&]:[min-height:88px] max-[768px]:[.contact-page_&]:[padding-top:12px] max-[768px]:[.contact-page_&]:[padding-right:14px] max-[768px]:[.contact-page_&]:[padding-bottom:12px] max-[768px]:[.contact-page_&]:[padding-left:14px] max-[768px]:[.contact-page_&]:[gap:7px] max-[768px]:[.contact-page_&_h3]:[font-size:20px]! max-[768px]:[.contact-page_&_h3]:[font-weight:410]! max-[768px]:[.contact-page_&_h3]:[font-variation-settings:'wght'_410,_'wdth'_125]! max-[768px]:[.contact-page_&_h3]:[line-height:1.07]! max-[768px]:[.contact-page_&_h3]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_p]:[font-size:9px]! max-[768px]:[.contact-page_&_p]:[font-weight:410]! max-[768px]:[.contact-page_&_p]:[line-height:1.12]! max-[768px]:[.contact-page_&_p]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_p]:[color:#fff]! max-[768px]:[.contact-page_&_a]:[font-size:12px]! max-[768px]:[.contact-page_&_a]:[font-weight:410]! max-[768px]:[.contact-page_&_a]:[line-height:1.12]! max-[768px]:[.contact-page_&_a]:[letter-spacing:-0.04em] max-[768px]:[.contact-page_&_a]:[color:#fff]!",
  "contact-sales-panel-fade":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[z-index:2] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[right:10px] [.contact-page_&]:[height:calc(88_*_var(--sales-unit))] [.contact-page_&]:[border-radius:0_0_calc(30_*_var(--sales-unit))_calc(30_*_var(--sales-unit))] [.contact-page_&]:[background:linear-gradient(180deg,_#dce6ef00,_#dce6ef45_45%,_#dce6efa6_100%)] [.contact-page_&]:[backdrop-filter:blur(6px)] [.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_70%)] [.contact-page_&]:[pointer-events:none] max-[1200px]:[.contact-page_&]:[height:80px] max-[1200px]:[.contact-page_&]:[border-radius:0_0_24px_24px] max-[768px]:[.contact-page_&]:[display:block]! max-[768px]:[.contact-page_&]:[bottom:0] max-[768px]:[.contact-page_&]:[left:0] max-[768px]:[.contact-page_&]:[right:0] max-[768px]:[.contact-page_&]:[height:160px] max-[768px]:[.contact-page_&]:[border-radius:0] max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_transparent,_#02111f20)] max-[768px]:[.contact-page_&]:[backdrop-filter:blur(4px)] max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_40%)]",
  "contact-write":
    "[.contact-page_&]:[position:relative] [.contact-page_&]:[z-index:0] [.contact-page_&]:[padding-top:140px] [.contact-page_&]:[padding-right:24px] [.contact-page_&]:[padding-bottom:88px] [.contact-page_&]:[padding-left:24px] [.contact-page_&]:[background:radial-gradient(ellipse_at_8%_90%,_#8dc4ff26,_transparent_55%),_radial-gradient(ellipse_at_47%_42%,_#b0d7ff24,_transparent_52%),_linear-gradient(110deg,_#cde6ff_0%,_#ddeeff_42%,_#ebf5ff_72%,_#f8fbff_100%)] [.contact-page_&]:[color:#000]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&_#contact-write-title]:[margin-top:0] [.contact-page_&_#contact-write-title]:[margin-right:0] [.contact-page_&_#contact-write-title]:[margin-bottom:54px] [.contact-page_&_#contact-write-title]:[margin-left:0] [.contact-page_&_#contact-write-title]:[text-align:center] [.contact-page_&_#contact-write-title]:[font-size:50px]! [.contact-page_&_#contact-write-title]:[font-weight:410]! [.contact-page_&_#contact-write-title]:[line-height:1]! [.contact-page_&_#contact-write-title]:[letter-spacing:-0.04em] [.contact-page_&_#contact-write-title]:[color:#0d5792]! [.contact-page_&_fieldset]:[min-width:0] [.contact-page_&_fieldset]:[margin-top:0] [.contact-page_&_fieldset]:[margin-right:0] [.contact-page_&_fieldset]:[margin-bottom:0] [.contact-page_&_fieldset]:[margin-left:0] [.contact-page_&_fieldset]:[padding-top:0] [.contact-page_&_fieldset]:[padding-right:0] [.contact-page_&_fieldset]:[padding-bottom:0] [.contact-page_&_fieldset]:[padding-left:0] [.contact-page_&_fieldset]:[border:0] [.contact-page_&_legend]:[width:100%] [.contact-page_&_legend]:[margin-bottom:25px] [.contact-page_&_legend]:[padding-top:0] [.contact-page_&_legend]:[padding-right:0] [.contact-page_&_legend]:[padding-bottom:0] [.contact-page_&_legend]:[padding-left:0] [.contact-page_&_legend]:[font-size:25px]! [.contact-page_&_legend]:[font-weight:540]! [.contact-page_&_legend]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.contact-page_&_legend]:[line-height:1.12]! [.contact-page_&_legend]:[color:#005eff]! [.contact-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_button:focus-visible]:[outline-offset:3px] max-[1024px]:[.contact-page_&]:[padding-top:120px] max-[1024px]:[.contact-page_&_#contact-write-title]:[font-size:42px]! max-[768px]:[.contact-page_&]:[padding-top:56px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[padding-bottom:60px] max-[768px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&_#contact-write-title]:[margin-bottom:36px] max-[768px]:[.contact-page_&_#contact-write-title]:[font-size:clamp(30px,_8vw,_40px)]! max-[768px]:[.contact-page_&_legend]:[font-size:22px]! max-[768px]:[.contact-page_&_legend]:[margin-bottom:20px]",
  "contact-write-inner":
    "[.contact-page_&]:[width:100%] [.contact-page_&]:[max-width:1200px] [.contact-page_&]:[margin-left:auto] [.contact-page_&]:[margin-right:auto]",
  "contact-write-form":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[gap:56px] max-[768px]:[.contact-page_&]:[gap:38px]",
  "contact-write-grid":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:10px_25px] [.contact-page_&_>_label]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[display:block]! [.contact-page_&_input:not([type='file'])]:[width:100%] [.contact-page_&_input:not([type='file'])]:[min-width:0] [.contact-page_&_input:not([type='file'])]:[height:45px] [.contact-page_&_input:not([type='file'])]:[padding-top:12px] [.contact-page_&_input:not([type='file'])]:[padding-right:37px] [.contact-page_&_input:not([type='file'])]:[padding-bottom:12px] [.contact-page_&_input:not([type='file'])]:[padding-left:37px] [.contact-page_&_input:not([type='file'])]:[border:1px_solid_transparent] [.contact-page_&_input:not([type='file'])]:[border-radius:8px] [.contact-page_&_input:not([type='file'])]:[background:#f7f7f7] [.contact-page_&_input:not([type='file'])]:[color:#0d5792]! [.contact-page_&_input:not([type='file'])]:[font-style:inherit] [.contact-page_&_input:not([type='file'])]:[font-variant:inherit] [.contact-page_&_input:not([type='file'])]:[font-weight:inherit]! [.contact-page_&_input:not([type='file'])]:[font-stretch:inherit]! [.contact-page_&_input:not([type='file'])]:[font-size:15px]! [.contact-page_&_input:not([type='file'])]:[line-height:1.2]! [.contact-page_&_input:not([type='file'])]:[font-family:inherit]! [.contact-page_&_input:not([type='file'])]:[font-feature-settings:inherit] [.contact-page_&_input:not([type='file'])]:[font-variation-settings:inherit]! [.contact-page_&_input:not([type='file'])]:[letter-spacing:-0.04em] [.contact-page_&_input:not([type='file'])]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_textarea]:[display:block]! [.contact-page_&_textarea]:[width:100%] [.contact-page_&_textarea]:[min-width:0] [.contact-page_&_textarea]:[height:188px] [.contact-page_&_textarea]:[padding-top:23px] [.contact-page_&_textarea]:[padding-right:37px] [.contact-page_&_textarea]:[padding-bottom:23px] [.contact-page_&_textarea]:[padding-left:37px] [.contact-page_&_textarea]:[border:1px_solid_transparent] [.contact-page_&_textarea]:[border-radius:8px] [.contact-page_&_textarea]:[background:#f7f7f7] [.contact-page_&_textarea]:[color:#0d5792]! [.contact-page_&_textarea]:[font-style:inherit] [.contact-page_&_textarea]:[font-variant:inherit] [.contact-page_&_textarea]:[font-weight:inherit]! [.contact-page_&_textarea]:[font-stretch:inherit]! [.contact-page_&_textarea]:[font-size:15px]! [.contact-page_&_textarea]:[line-height:1.2]! [.contact-page_&_textarea]:[font-family:inherit]! [.contact-page_&_textarea]:[font-feature-settings:inherit] [.contact-page_&_textarea]:[font-variation-settings:inherit]! [.contact-page_&_textarea]:[letter-spacing:-0.04em] [.contact-page_&_textarea]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease] [.contact-page_&_input::placeholder]:[color:#9eb7d0]! [.contact-page_&_input::placeholder]:[opacity:1] [.contact-page_&_textarea::placeholder]:[color:#9eb7d0]! [.contact-page_&_textarea::placeholder]:[opacity:1] [.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_input:focus-visible]:[outline-offset:1px] [.contact-page_&_input:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_input:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea:focus-visible]:[outline:2px_solid_#005eff33] [.contact-page_&_textarea:focus-visible]:[outline-offset:1px] [.contact-page_&_textarea:focus-visible]:[border-color:#9cc7ff] [.contact-page_&_textarea:focus-visible]:[box-shadow:0_0_14px_#005eff12] [.contact-page_&_textarea]:[resize:none] [.contact-page_&_textarea]:[overflow-y:auto] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-left:24px] max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-right:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-left:24px] max-[1024px]:[.contact-page_&_textarea]:[padding-right:24px] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr] max-[768px]:[.contact-page_&]:[gap:12px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-left:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-right:20px] max-[768px]:[.contact-page_&_input:not([type='file'])]:[font-size:14px]! max-[768px]:[.contact-page_&_textarea]:[padding-left:20px] max-[768px]:[.contact-page_&_textarea]:[padding-right:20px] max-[768px]:[.contact-page_&_textarea]:[font-size:14px]! motion-reduce:[.contact-page_&_input]:[transition:none] motion-reduce:[.contact-page_&_textarea]:[transition:none] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(3)]:[order:4] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(4)]:[order:3] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(1)]:[order:1] max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(2)]:[order:2]",
  "contact-write-upload":
    "[.contact-page_&]:[min-width:0] [.contact-page_&]:[height:188px] [.contact-page_&]:[border:1px_solid_transparent] [.contact-page_&]:[border-radius:8px] [.contact-page_&]:[background:#f7f7f7] [.contact-page_&]:[transition:background_180ms_ease,_border-color_180ms_ease] [.contact-page_&:hover]:[border-color:#9cc7ff] [.contact-page_&:hover]:[background:#edf5ff] [.contact-page_&[data-dragging='true']]:[border-color:#9cc7ff] [.contact-page_&[data-dragging='true']]:[background:#edf5ff] motion-reduce:[.contact-page_&]:[transition:none]",
  "contact-write-upload-trigger":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[flex-direction:column] [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:18px] [.contact-page_&]:[width:100%] [.contact-page_&]:[height:100%] [.contact-page_&]:[padding-top:22px] [.contact-page_&]:[padding-right:25px] [.contact-page_&]:[padding-bottom:16px] [.contact-page_&]:[padding-left:25px] [.contact-page_&]:[border:0] [.contact-page_&]:[border-radius:8px] [.contact-page_&]:[background:transparent] [.contact-page_&]:[color:#9eb7d0]! [.contact-page_&]:[font-style:inherit] [.contact-page_&]:[font-variant:inherit] [.contact-page_&]:[font-weight:inherit]! [.contact-page_&]:[font-stretch:inherit]! [.contact-page_&]:[font-size:15px]! [.contact-page_&]:[line-height:1.2]! [.contact-page_&]:[font-family:inherit]! [.contact-page_&]:[font-feature-settings:inherit] [.contact-page_&]:[font-variation-settings:inherit]! [.contact-page_&]:[letter-spacing:-0.04em] [.contact-page_&]:[cursor:pointer] [.contact-page_&_>_span:first-child]:[align-self:flex-start] max-[768px]:[.contact-page_&]:[padding-left:20px] max-[768px]:[.contact-page_&]:[padding-right:20px] max-[768px]:[.contact-page_&]:[font-size:14px]!",
  "contact-write-upload-icon":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[place-items:center] [.contact-page_&]:[flex:0_0_48px] [.contact-page_&]:[width:48px] [.contact-page_&]:[height:48px] [.contact-page_&]:[border-radius:50%] [.contact-page_&]:[background:#e1eeff] [.contact-page_&]:[color:#587c9d]! [.contact-page_&]:[transition:box-shadow_180ms_ease] [.contact-page_&_svg]:[width:24px] [.contact-page_&_svg]:[height:24px] [.contact-page_&_svg]:[stroke-width:1.5] [.contact-page_.contact-write-upload-trigger:hover_&]:[box-shadow:0_0_18px_#005eff26] motion-reduce:[.contact-page_&]:[transition:none]",
  "contact-write-file-types":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:22px] [.contact-page_&]:[color:#9eb7d0]! [.contact-page_&]:[font-size:10px]! [.contact-page_&_>_span]:[display:flex]! [.contact-page_&_>_span]:[align-items:center] [.contact-page_&_>_span]:[gap:4px] [.contact-page_&_svg]:[width:22px] [.contact-page_&_svg]:[height:26px] [.contact-page_&_svg]:[stroke-width:1.25]",
  "contact-write-attachments":
    "[.contact-page_&]:[display:grid]! [.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [.contact-page_&]:[gap:8px_25px] [.contact-page_&]:[margin-top:16px] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[padding-top:0] [.contact-page_&]:[padding-right:0] [.contact-page_&]:[padding-bottom:0] [.contact-page_&]:[padding-left:0] [.contact-page_&]:[list-style:none] [.contact-page_&_li]:[display:flex]! [.contact-page_&_li]:[align-items:center] [.contact-page_&_li]:[gap:8px] [.contact-page_&_li]:[min-width:0] [.contact-page_&_li]:[padding-top:8px] [.contact-page_&_li]:[padding-right:12px] [.contact-page_&_li]:[padding-bottom:8px] [.contact-page_&_li]:[padding-left:12px] [.contact-page_&_li]:[border:1px_solid_#9eb7d066] [.contact-page_&_li]:[border-radius:8px] [.contact-page_&_li]:[background:#f7f7f799] [.contact-page_&_li]:[color:#0d5792]! [.contact-page_&_li]:[font-size:12px]! [.contact-page_&_li_>_svg]:[flex-shrink:0] [.contact-page_&_li_>_span]:[flex:1] [.contact-page_&_li_>_span]:[min-width:0] [.contact-page_&_li_>_span]:[overflow-wrap:anywhere] [.contact-page_&_button]:[display:grid]! [.contact-page_&_button]:[place-items:center] [.contact-page_&_button]:[flex:0_0_32px] [.contact-page_&_button]:[width:32px] [.contact-page_&_button]:[height:32px] [.contact-page_&_button]:[border:0] [.contact-page_&_button]:[border-radius:6px] [.contact-page_&_button]:[background:transparent] [.contact-page_&_button]:[color:#0d5792]! [.contact-page_&_button]:[cursor:pointer] [.contact-page_&_button:hover]:[background:#005eff14] max-[768px]:[.contact-page_&]:[grid-template-columns:1fr]",
  "contact-write-file-error":
    "[.contact-page_&]:[margin-top:12px] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[color:#9b3131]! [.contact-page_&]:[font-size:13px]!",
  "contact-write-actions":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[flex-direction:column] [.contact-page_&]:[align-items:center] [.contact-page_&]:[gap:25px]",
  "contact-write-consent":
    "[.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:flex-start] [.contact-page_&]:[gap:8px] [.contact-page_&]:[max-width:100%] [.contact-page_&]:[font-size:15px]! [.contact-page_&]:[line-height:1.2]! [.contact-page_&]:[color:#000]! [.contact-page_&]:[cursor:pointer] [.contact-page_&_input]:[appearance:none] [.contact-page_&_input]:[display:grid]! [.contact-page_&_input]:[place-items:center] [.contact-page_&_input]:[flex:0_0_16px] [.contact-page_&_input]:[width:16px] [.contact-page_&_input]:[height:16px] [.contact-page_&_input]:[margin-top:1px] [.contact-page_&_input]:[margin-right:0] [.contact-page_&_input]:[margin-bottom:0] [.contact-page_&_input]:[margin-left:0] [.contact-page_&_input]:[border:0] [.contact-page_&_input]:[border-radius:3px] [.contact-page_&_input]:[background:#d9d9d9] [.contact-page_&_input]:[cursor:pointer] [.contact-page_&_input:checked]:[background:#005eff] [.contact-page_&_input:checked::after]:[content:''] [.contact-page_&_input:checked::after]:[width:5px] [.contact-page_&_input:checked::after]:[height:9px] [.contact-page_&_input:checked::after]:[border:solid_white] [.contact-page_&_input:checked::after]:[border-width:0_2px_2px_0] [.contact-page_&_input:checked::after]:[transform:translateY(-1px)_rotate(45deg)] [.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff] [.contact-page_&_input:focus-visible]:[outline-offset:3px] max-[768px]:[.contact-page_&]:[font-size:13px]!",
  "contact-write-send":
    "[.contact-page_&]:[--contact-send-offset:95px] [.contact-page_&]:[position:relative] [.contact-page_&]:[width:141px] [.contact-page_&]:[height:43px] [.contact-page_&]:[overflow:visible] [.contact-page_&]:[border:0.5px_solid_#9eb7d0] [.contact-page_&]:[border-radius:24px] [.contact-page_&]:[background:#f7f7f780] [.contact-page_&]:[box-shadow:inset_0_0_10px_#d1e7ff50] [.contact-page_&]:[color:#27272a]! [.contact-page_&]:[font-style:inherit] [.contact-page_&]:[font-variant:inherit] [.contact-page_&]:[font-weight:inherit]! [.contact-page_&]:[font-stretch:inherit]! [.contact-page_&]:[font-size:15px]! [.contact-page_&]:[line-height:1]! [.contact-page_&]:[font-family:inherit]! [.contact-page_&]:[font-feature-settings:inherit] [.contact-page_&]:[font-variation-settings:inherit]! [.contact-page_&]:[cursor:pointer] [.contact-page_&]:[transition:--contact-send-offset_400ms_ease-in-out] [.contact-page_&:is(:hover,_:focus-visible)]:[--contact-send-offset:0px] motion-reduce:[.contact-page_&]:[transition:none]",
  "contact-write-send-label":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[top:0] [.contact-page_&]:[right:0] [.contact-page_&]:[bottom:0] [.contact-page_&]:[left:0] [.contact-page_&]:[display:flex]! [.contact-page_&]:[align-items:center] [.contact-page_&]:[padding-left:calc(55px_-_var(--contact-send-offset)_*_0.368421053)] [.contact-page_&]:[white-space:nowrap] [.contact-page_&]:[mask-image:radial-gradient(circle_at_calc(22.5px_+_var(--contact-send-offset))_50%,_transparent_19px,_#000_20px)]",
  "contact-write-send-orb":
    "[.contact-page_&]:[position:absolute] [.contact-page_&]:[top:50%] [.contact-page_&]:[left:calc(6px_+_var(--contact-send-offset))] [.contact-page_&]:[width:33px] [.contact-page_&]:[height:33px] [.contact-page_&]:[transform:translateY(-50%)] [.contact-page_&]:[border-radius:50%] [.contact-page_&]:[background:linear-gradient(180deg,_#005eff,_#0024b8)] [.contact-page_&]:[box-shadow:inset_0_1px_3px_#8fc5ff66,_0_0_14px_#005eff99,_8px_0_24px_#005eff66]",
  "contact-write-feedback":
    "[.contact-page_&]:[min-height:18px] [.contact-page_&]:[margin-top:0] [.contact-page_&]:[margin-right:0] [.contact-page_&]:[margin-bottom:0] [.contact-page_&]:[margin-left:0] [.contact-page_&]:[text-align:center] [.contact-page_&]:[color:#0d5792]! [.contact-page_&]:[font-size:13px]! [.contact-page_&]:[line-height:1.35]!",
  "contact-headquarters-details":
    "max-[768px]:[.contact-page_.contact-headquarters_>_&]:[order:2]",
};
const twContactPagePriority: Record<string, number> = {
  "[html:has(&)]:[overflow-x:clip]": 1,
  "[body:has(&)]:[overflow-x:clip]": 2,
  "[--contact-unit:clamp(0.71px,_0.0694444444vw,_1.777778px)]": 3,
  "[--contact-header-offset:97px]": 4,
  "[width:100%]": 5,
  "[min-height:100svh]": 6,
  "[margin-top:calc(-1_*_var(--contact-header-offset))]": 7,
  "[overflow-x:clip]": 8,
  "[background:#ddeeff]": 9,
  "[letter-spacing:0]": 10,
  "[.contact-page_&]:[position:relative]": 1208,
  "[.contact-page_&]:[z-index:1]": 665,
  "[.contact-page_&]:[isolation:isolate]": 641,
  "[.contact-page_&]:[width:100%]": 1080,
  "[.contact-page_&]:[height:calc(805_*_var(--contact-unit))]": 15,
  "[.contact-page_&]:[overflow:visible]": 1211,
  "[.contact-page_&]:[background:#061824]": 17,
  "[.contact-page_&::after]:[content:'']": 18,
  "[.contact-page_&::after]:[position:absolute]": 19,
  "[.contact-page_&::after]:[z-index:3]": 20,
  "[.contact-page_&::after]:[top:auto]": 21,
  "[.contact-page_&::after]:[right:0]": 22,
  "[.contact-page_&::after]:[bottom:0]": 23,
  "[.contact-page_&::after]:[left:0]": 24,
  "[.contact-page_&::after]:[height:1px]": 25,
  "[.contact-page_&::after]:[background:#9bdcff]": 26,
  "[.contact-page_&::after]:[box-shadow:0_0_8px_#48b8ff80]": 27,
  "[.contact-page_&::after]:[pointer-events:none]": 28,
  "[.contact-page_&]:[z-index:0]": 948,
  "[.contact-page_&]:[object-fit:cover]": 659,
  "[.contact-page_&]:[object-position:right_top]": 31,
  "[.contact-page_&]:[pointer-events:none]": 867,
  "[.contact-page_&]:[position:absolute]": 1240,
  "[.contact-page_&]:[top:calc(337_*_var(--contact-unit))]": 35,
  "[.contact-page_&]:[left:calc(-149_*_var(--contact-unit))]": 36,
  "[.contact-page_&]:[width:calc(908_*_var(--contact-unit))]": 37,
  "[.contact-page_&]:[height:calc(510_*_var(--contact-unit))]": 38,
  "[.contact-page_&]:[max-width:none]": 658,
  "[.contact-page_&]:[object-fit:contain]": 182,
  "[.contact-page_&]:[mix-blend-mode:screen]": 75,
  "[.contact-page_&]:[clip-path:inset(0_0_calc(42_*_var(--contact-unit))_0)]": 42,
  "[.contact-page_&]:[z-index:4]": 88,
  "[.contact-page_&]:[top:calc(222_*_var(--contact-unit))]": 46,
  "[.contact-page_&]:[left:calc(120_*_var(--contact-unit))]": 127,
  "[.contact-page_&]:[width:calc(618_*_var(--contact-unit))]": 48,
  "[.contact-page_&]:[margin-top:0]": 1251,
  "[.contact-page_&]:[margin-right:0]": 1252,
  "[.contact-page_&]:[margin-bottom:0]": 1253,
  "[.contact-page_&]:[margin-left:0]": 1254,
  "[.contact-page_&]:[color:#f7f7f7]!": 380,
  "[.contact-page_&]:[font-size:calc(36_*_var(--contact-unit))]!": 54,
  "[.contact-page_&]:[font-weight:410]!": 337,
  "[.contact-page_&]:[line-height:1]!": 1227,
  "[.contact-page_&]:[letter-spacing:0]": 339,
  "[.contact-page_&_span]:[display:block]!": 58,
  "[.contact-page_&]:[z-index:2]": 858,
  "[.contact-page_&]:[top:auto]": 61,
  "[.contact-page_&]:[right:0]": 1232,
  "[.contact-page_&]:[bottom:0]": 1233,
  "[.contact-page_&]:[left:0]": 1234,
  "[.contact-page_&]:[height:calc(260_*_var(--contact-unit))]": 65,
  "[.contact-page_&]:[background:linear-gradient(180deg,_transparent_0%,_#20384d80_24%,_#24374bd9_100%)]": 66,
  "[.contact-page_&]:[z-index:3]": 681,
  "[.contact-page_&]:[top:calc(563_*_var(--contact-unit))]": 70,
  "[.contact-page_&]:[height:calc(48_*_var(--contact-unit))]": 73,
  "[.contact-page_&]:[overflow:hidden]": 781,
  "[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_35%,_#000_65%,_transparent)]": 76,
  "[.contact-page_&_video]:[position:absolute]": 78,
  "[.contact-page_&_video]:[top:50%]": 79,
  "[.contact-page_&_video]:[left:0]": 80,
  "[.contact-page_&_video]:[width:100%]": 81,
  "[.contact-page_&_video]:[max-width:none]": 82,
  "[.contact-page_&_video]:[height:auto]": 83,
  "[.contact-page_&_video]:[aspect-ratio:16_/_9]": 84,
  "[.contact-page_&_video]:[transform:translateY(-50%)]": 85,
  "[.contact-page_&_video]:[pointer-events:none]": 86,
  "[.contact-page_&]:[top:calc(587_*_var(--contact-unit))]": 89,
  "[.contact-page_&]:[padding-top:calc(26_*_var(--contact-unit))]": 93,
  "[.contact-page_&]:[padding-right:calc(120_*_var(--contact-unit))]": 94,
  "[.contact-page_&]:[padding-bottom:calc(38_*_var(--contact-unit))]": 95,
  "[.contact-page_&]:[padding-left:calc(120_*_var(--contact-unit))]": 96,
  "[.contact-page_&::before]:[content:'']": 715,
  "[.contact-page_&::before]:[position:absolute]": 716,
  "[.contact-page_&::before]:[z-index:-1]": 721,
  "[.contact-page_&::before]:[top:0]": 101,
  "[.contact-page_&::before]:[right:0]": 102,
  "[.contact-page_&::before]:[bottom:0]": 103,
  "[.contact-page_&::before]:[left:0]": 104,
  "[.contact-page_&::before]:[background:linear-gradient(110deg,_#183547b3,_#42577380_55%,_#29333bc4)]": 105,
  "[.contact-page_&::before]:[backdrop-filter:blur(8px)]": 106,
  "[.contact-page_&::before]:[pointer-events:none]": 723,
  "[.contact-page_&]:[max-width:calc(744_*_var(--contact-unit))]": 108,
  "[.contact-page_&]:[margin-bottom:calc(10_*_var(--contact-unit))]": 111,
  "[.contact-page_&]:[color:#9eb7d0]!": 1120,
  "[.contact-page_&]:[font-size:calc(12_*_var(--contact-unit))]!": 114,
  "[.contact-page_&]:[letter-spacing:-0.04em]": 1101,
  "[.contact-page_&_h2]:[margin-top:0]": 686,
  "[.contact-page_&_h2]:[margin-right:0]": 687,
  "[.contact-page_&_h2]:[margin-bottom:0]": 119,
  "[.contact-page_&_h2]:[margin-left:0]": 689,
  "[.contact-page_&_h2]:[color:#f7f7f7]!": 121,
  "[.contact-page_&_h2]:[font-size:calc(20_*_var(--contact-unit))]!": 122,
  "[.contact-page_&_h2]:[font-weight:410]!": 692,
  "[.contact-page_&_h2]:[line-height:1.2]!": 124,
  "[.contact-page_&_h2]:[letter-spacing:-0.04em]": 695,
  "[.contact-page_&]:[bottom:calc(-28_*_var(--contact-unit))]": 128,
  "[.contact-page_&]:[width:calc(600_*_var(--contact-unit))]": 129,
  "[.contact-page_&]:[max-width:calc(100%_-_480_*_var(--contact-unit))]": 130,
  "[.contact-page_&]:[display:grid]!": 1128,
  "[.contact-page_&]:[grid-template-columns:repeat(3,_minmax(0,_1fr))]": 444,
  "[.contact-page_&]:[gap:calc(12_*_var(--contact-unit))]": 133,
  "[.contact-page_&]:[min-width:0]": 1066,
  "[.contact-page_&]:[padding-top:calc(12_*_var(--contact-unit))]": 139,
  "[.contact-page_&]:[padding-right:calc(12_*_var(--contact-unit))]": 140,
  "[.contact-page_&]:[padding-bottom:calc(12_*_var(--contact-unit))]": 141,
  "[.contact-page_&]:[padding-left:calc(12_*_var(--contact-unit))]": 142,
  "[.contact-page_&]:[border:1px_solid_#ffffff26]": 143,
  "[.contact-page_&]:[border-radius:calc(11_*_var(--contact-unit))]": 144,
  "[.contact-page_&]:[background:linear-gradient(180deg,_#ffffff1f,_#ffffff66)]": 145,
  "[.contact-page_&]:[box-shadow:inset_0_1px_12px_#d4eaff18,_0_12px_26px_#005eff12]": 146,
  "[.contact-page_&]:[backdrop-filter:blur(20px)]": 147,
  "[.contact-page_&_h3]:[display:flex]!": 149,
  "[.contact-page_&_h3]:[align-items:center]": 150,
  "[.contact-page_&_h3]:[gap:calc(7_*_var(--contact-unit))]": 151,
  "[.contact-page_&_h3]:[margin-top:0]": 831,
  "[.contact-page_&_h3]:[margin-right:0]": 832,
  "[.contact-page_&_h3]:[margin-bottom:calc(8_*_var(--contact-unit))]": 154,
  "[.contact-page_&_h3]:[margin-left:0]": 834,
  "[.contact-page_&_h3]:[color:#f7f7f7]!": 156,
  "[.contact-page_&_h3]:[font-size:calc(12_*_var(--contact-unit))]!": 157,
  "[.contact-page_&_h3]:[font-weight:410]!": 158,
  "[.contact-page_&_h3]:[line-height:1.2]!": 159,
  "[.contact-page_&_h3_svg]:[flex-shrink:0]": 160,
  "[.contact-page_&_h3_svg]:[width:calc(16_*_var(--contact-unit))]": 161,
  "[.contact-page_&_h3_svg]:[height:calc(16_*_var(--contact-unit))]": 162,
  "[.contact-page_&_h3_svg]:[color:#c1ddfa]!": 163,
  "[.contact-page_&_h3_svg]:[stroke-width:1.5]": 164,
  "[.contact-page_&]:[margin-left:calc(-3_*_var(--contact-unit))]": 165,
  "[.contact-page_&]:[color:#65b5ff]!": 166,
  "[.contact-page_&_p]:[margin-top:0]": 841,
  "[.contact-page_&_p]:[margin-right:0]": 842,
  "[.contact-page_&_p]:[margin-bottom:0]": 843,
  "[.contact-page_&_p]:[margin-left:0]": 844,
  "[.contact-page_&_p]:[color:#c6def5]!": 171,
  "[.contact-page_&_p]:[font-size:calc(11.5_*_var(--contact-unit))]!": 172,
  "[.contact-page_&_p]:[line-height:1.25]!": 847,
  "[.contact-page_&_strong]:[color:#f7f7f7]!": 174,
  "[.contact-page_&_strong]:[font-weight:410]!": 175,
  "[.contact-page_&]:[z-index:5]": 177,
  "[.contact-page_&]:[top:calc(502_*_var(--contact-unit))]": 178,
  "[.contact-page_&]:[left:calc(992_*_var(--contact-unit))]": 179,
  "[.contact-page_&]:[width:calc(303_*_var(--contact-unit))]": 180,
  "[.contact-page_&]:[height:calc(303_*_var(--contact-unit))]": 181,
  "max-[1024px]:[--contact-unit:1px]": 184,
  "max-[1024px]:[.contact-page_&]:[height:850px]": 185,
  "max-[1024px]:[.contact-page_&]:[height:660px]!": 1000186,
  "max-[1024px]:[.contact-page_&]:[object-position:70%_top]": 187,
  "max-[1024px]:[.contact-page_&]:[top:180px]": 188,
  "max-[1024px]:[.contact-page_&]:[left:6%]": 203,
  "max-[1024px]:[.contact-page_&]:[width:60%]": 205,
  "max-[1024px]:[.contact-page_&]:[font-size:clamp(22px,_3vw,_30px)]!": 191,
  "max-[1024px]:[.contact-page_&]:[top:310px]": 192,
  "max-[1024px]:[.contact-page_&]:[left:-180px]": 193,
  "max-[1024px]:[.contact-page_&]:[width:760px]": 194,
  "max-[1024px]:[.contact-page_&]:[height:428px]": 195,
  "max-[1024px]:[.contact-page_&]:[top:548px]": 196,
  "max-[1024px]:[.contact-page_&]:[top:572px]": 197,
  "max-[1024px]:[.contact-page_&]:[padding-top:30px]": 551,
  "max-[1024px]:[.contact-page_&]:[padding-right:6%]": 199,
  "max-[1024px]:[.contact-page_&]:[padding-bottom:56px]": 200,
  "max-[1024px]:[.contact-page_&]:[padding-left:6%]": 201,
  "max-[1024px]:[.contact-page_&]:[max-width:67%]": 202,
  "max-[1024px]:[.contact-page_&]:[bottom:-28px]": 204,
  "max-[1024px]:[.contact-page_&]:[max-width:60%]": 206,
  "max-[1024px]:[.contact-page_&]:[gap:10px]": 207,
  "max-[1024px]:[.contact-page_&]:[padding-top:12px]": 208,
  "max-[1024px]:[.contact-page_&]:[padding-right:10px]": 209,
  "max-[1024px]:[.contact-page_&]:[padding-bottom:12px]": 210,
  "max-[1024px]:[.contact-page_&]:[padding-left:10px]": 211,
  "max-[1024px]:[.contact-page_&_h3]:[flex-wrap:wrap]": 212,
  "max-[1024px]:[.contact-page_&_h3]:[font-size:12px]!": 213,
  "max-[1024px]:[.contact-page_&]:[top:auto]": 575,
  "max-[1024px]:[.contact-page_&]:[bottom:0]": 215,
  "max-[1024px]:[.contact-page_&]:[left:auto]": 216,
  "max-[1024px]:[.contact-page_&]:[right:2%]": 217,
  "max-[1024px]:[.contact-page_&]:[width:260px]": 218,
  "max-[1024px]:[.contact-page_&]:[height:260px]": 219,
  "max-[1024px]:[.contact-page_&]:[height:330px]": 220,
  "max-[768px]:[.contact-page_&]:[height:auto]": 244,
  "max-[768px]:[.contact-page_&]:[min-height:1100px]": 222,
  "max-[768px]:[.contact-page_&]:[padding-top:590px]": 223,
  "max-[768px]:[.contact-page_&]:[top:190px]!": 1000224,
  "max-[768px]:[.contact-page_&]:[left:-60%]!": 1000225,
  "max-[768px]:[.contact-page_&]:[right:auto]!": 1000226,
  "max-[768px]:[.contact-page_&]:[width:180%]!": 1000227,
  "max-[768px]:[.contact-page_&]:[max-width:none]": 265,
  "max-[768px]:[.contact-page_&]:[height:auto]!": 1000229,
  "max-[768px]:[.contact-page_&]:[object-fit:contain]": 230,
  "max-[768px]:[.contact-page_&]:[object-position:right_top]": 231,
  "max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_18%,_#000_86%,_transparent)]": 232,
  "max-[768px]:[.contact-page_&]:[top:165px]": 233,
  "max-[768px]:[.contact-page_&]:[left:24px]": 234,
  "max-[768px]:[.contact-page_&]:[width:calc(100%_-_48px)]": 235,
  "max-[768px]:[.contact-page_&]:[font-size:clamp(14px,_4.3vw,_30px)]!": 236,
  "max-[768px]:[.contact-page_&_span]:[white-space:nowrap]": 237,
  "max-[768px]:[.contact-page_&]:[top:295px]": 238,
  "max-[768px]:[.contact-page_&]:[left:-190px]": 239,
  "max-[768px]:[.contact-page_&]:[width:650px]": 240,
  "max-[768px]:[.contact-page_&]:[height:366px]": 241,
  "max-[768px]:[.contact-page_&]:[top:480px]": 1318,
  "max-[768px]:[.contact-page_&]:[bottom:0]": 1486,
  "max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_transparent,_#173a60cc_18%,_#24374b_100%)]": 245,
  "max-[768px]:[.contact-page_&]:[top:564px]": 246,
  "max-[768px]:[.contact-page_&]:[height:52px]": 247,
  "max-[768px]:[.contact-page_&_video]:[width:1440px]": 248,
  "max-[768px]:[.contact-page_&_video]:[left:50%]": 249,
  "max-[768px]:[.contact-page_&_video]:[transform:translate(-50%,_-50%)]": 250,
  "max-[768px]:[.contact-page_&]:[position:relative]": 251,
  "max-[768px]:[.contact-page_&]:[top:auto]": 277,
  "max-[768px]:[.contact-page_&]:[bottom:auto]": 1411,
  "max-[768px]:[.contact-page_&]:[padding-top:28px]": 254,
  "max-[768px]:[.contact-page_&]:[padding-right:24px]": 255,
  "max-[768px]:[.contact-page_&]:[padding-bottom:240px]": 256,
  "max-[768px]:[.contact-page_&]:[padding-left:24px]": 257,
  "max-[768px]:[.contact-page_&]:[font-size:11px]!": 259,
  "max-[768px]:[.contact-page_&]:[line-height:1.3]!": 260,
  "max-[768px]:[.contact-page_&_h2]:[max-width:24em]": 261,
  "max-[768px]:[.contact-page_&_h2]:[font-size:20px]!": 262,
  "max-[768px]:[.contact-page_&]:[position:static]": 263,
  "max-[768px]:[.contact-page_&]:[width:100%]": 264,
  "max-[768px]:[.contact-page_&]:[grid-template-columns:1fr]": 1462,
  "max-[768px]:[.contact-page_&]:[gap:10px]": 1416,
  "max-[768px]:[.contact-page_&]:[margin-top:22px]": 268,
  "max-[768px]:[.contact-page_&]:[padding-top:12px]": 1465,
  "max-[768px]:[.contact-page_&]:[padding-right:16px]": 1428,
  "max-[768px]:[.contact-page_&]:[padding-bottom:12px]": 1467,
  "max-[768px]:[.contact-page_&]:[padding-left:16px]": 1430,
  "max-[768px]:[.contact-page_&_h3]:[flex-wrap:nowrap]": 273,
  "max-[768px]:[.contact-page_&_h3]:[font-size:13px]!": 274,
  "max-[768px]:[.contact-page_&_h3]:[margin-bottom:8px]": 275,
  "max-[768px]:[.contact-page_&_p]:[font-size:12px]!": 276,
  "max-[768px]:[.contact-page_&]:[right:24px]": 279,
  "max-[768px]:[.contact-page_&]:[width:220px]": 280,
  "max-[768px]:[.contact-page_&]:[height:220px]": 281,
  "motion-reduce:[.contact-page_&]:[visibility:hidden]": 944,
  "[.contact-page_&]:[--location-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 284,
  "[.contact-page_&]:[padding-top:calc(60_*_var(--location-unit))]": 287,
  "[.contact-page_&]:[padding-right:24px]": 950,
  "[.contact-page_&]:[padding-bottom:calc(90_*_var(--location-unit))]": 289,
  "[.contact-page_&]:[padding-left:24px]": 952,
  "[.contact-page_&]:[background:radial-gradient(ellipse_at_25%_60%,_#b1cce955,_transparent_52%),_radial-gradient(ellipse_at_85%_78%,_#ffffff80,_transparent_48%),_linear-gradient(180deg,_#ddeeff_0%,_#d5e9fd_32%,_#e7f3ff_72%,_#f2f9ff_100%)]": 291,
  "[.contact-page_&]:[color:#000]!": 1184,
  "[.contact-page_&]:[max-width:calc(1200_*_var(--location-unit))]": 295,
  "[.contact-page_&]:[margin-left:auto]": 958,
  "[.contact-page_&]:[margin-right:auto]": 959,
  "[.contact-page_&]:[border:0.5px_solid_#f7f7f7]": 298,
  "[.contact-page_&]:[border-radius:calc(30_*_var(--location-unit))]": 359,
  "[.contact-page_&]:[background:#ffffff40]": 300,
  "[.contact-page_&]:[box-shadow:inset_0_1px_18px_#ffffff30,_0_8px_30px_#4274a308]": 301,
  "[.contact-page_&]:[backdrop-filter:blur(30px)]": 302,
  "[.contact-page_&]:[grid-template-columns:minmax(0,_1fr)_minmax(0,_calc(616_*_var(--location-unit)))]": 304,
  "[.contact-page_&]:[gap:calc(40_*_var(--location-unit))]": 305,
  "[.contact-page_&]:[min-height:calc(411_*_var(--location-unit))]": 306,
  "[.contact-page_&]:[padding-top:calc(35_*_var(--location-unit))]": 307,
  "[.contact-page_&]:[padding-right:calc(35_*_var(--location-unit))]": 308,
  "[.contact-page_&]:[padding-bottom:calc(35_*_var(--location-unit))]": 309,
  "[.contact-page_&]:[padding-left:calc(35_*_var(--location-unit))]": 310,
  "[.contact-page_&_h2]:[margin-bottom:calc(30_*_var(--location-unit))]": 313,
  "[.contact-page_&_h2]:[font-size:calc(20_*_var(--location-unit))]!": 315,
  "[.contact-page_&_h2]:[line-height:1]!": 693,
  "[.contact-page_&]:[gap:calc(25_*_var(--location-unit))]": 319,
  "[.contact-page_&_dt]:[margin-top:0]": 324,
  "[.contact-page_&_dt]:[margin-right:0]": 325,
  "[.contact-page_&_dt]:[margin-bottom:calc(10_*_var(--location-unit))]": 326,
  "[.contact-page_&_dt]:[margin-left:0]": 327,
  "[.contact-page_&_dt]:[font-size:calc(12_*_var(--location-unit))]!": 328,
  "[.contact-page_&_dt]:[font-weight:410]!": 329,
  "[.contact-page_&_dt]:[line-height:1.12]!": 330,
  "[.contact-page_&_dt]:[letter-spacing:0]": 331,
  "[.contact-page_&]:[margin-bottom:calc(10_*_var(--location-unit))]": 334,
  "[.contact-page_&]:[font-size:calc(12_*_var(--location-unit))]!": 381,
  "[.contact-page_&]:[line-height:1.12]!": 712,
  "[.contact-page_&_dd]:[margin-top:0]": 340,
  "[.contact-page_&_dd]:[margin-right:0]": 341,
  "[.contact-page_&_dd]:[margin-bottom:0]": 342,
  "[.contact-page_&_dd]:[margin-left:0]": 343,
  "[.contact-page_&_dd]:[font-size:calc(15_*_var(--location-unit))]!": 344,
  "[.contact-page_&_dd]:[font-weight:410]!": 345,
  "[.contact-page_&_dd]:[line-height:1]!": 346,
  "[.contact-page_&_dd]:[overflow-wrap:anywhere]": 347,
  "[.contact-page_&]:[color:#0d5792]!": 1256,
  "[.contact-page_&]:[font-size:calc(25_*_var(--location-unit))]!": 349,
  "[.contact-page_&]:[font-weight:540]!": 710,
  "[.contact-page_&]:[font-variation-settings:'wght'_540,_'wdth'_125]!": 711,
  "[.contact-page_&]:[white-space:nowrap]": 1238,
  "[.contact-page_&]:[height:calc(246_*_var(--location-unit))]": 357,
  "[.contact-page_&]:[background:#111c28]": 360,
  "[.contact-page_&_img]:[object-fit:cover]": 776,
  "[.contact-page_&_img]:[object-position:center]": 362,
  "[.contact-page_&]:[top:calc(18_*_var(--location-unit))]": 365,
  "[.contact-page_&]:[right:calc(18_*_var(--location-unit))]": 366,
  "[.contact-page_&]:[display:flex]!": 1235,
  "[.contact-page_&]:[align-items:center]": 1236,
  "[.contact-page_&]:[justify-content:center]": 369,
  "[.contact-page_&]:[gap:calc(10_*_var(--location-unit))]": 370,
  "[.contact-page_&]:[min-height:calc(41_*_var(--location-unit))]": 371,
  "[.contact-page_&]:[padding-top:calc(10_*_var(--location-unit))]": 372,
  "[.contact-page_&]:[padding-right:calc(15_*_var(--location-unit))]": 373,
  "[.contact-page_&]:[padding-bottom:calc(10_*_var(--location-unit))]": 374,
  "[.contact-page_&]:[padding-left:calc(15_*_var(--location-unit))]": 375,
  "[.contact-page_&]:[border:0.5px_solid_#ffffffb3]": 376,
  "[.contact-page_&]:[border-radius:calc(12_*_var(--location-unit))]": 377,
  "[.contact-page_&]:[background:#122c4ec4]": 378,
  "[.contact-page_&]:[backdrop-filter:blur(12px)]": 379,
  "[.contact-page_&]:[transition:background_200ms_ease,_box-shadow_200ms_ease]": 385,
  "[.contact-page_&_svg]:[width:calc(20_*_var(--location-unit))]": 386,
  "[.contact-page_&_svg]:[height:calc(20_*_var(--location-unit))]": 387,
  "[.contact-page_&_svg]:[color:#459dff]!": 388,
  "[.contact-page_&_svg]:[filter:drop-shadow(0_0_5px_#005effb3)]": 389,
  "[.contact-page_&:hover]:[background:#123e6fe6]": 390,
  "[.contact-page_&:hover]:[box-shadow:0_0_15px_#005eff40]": 391,
  "[.contact-page_&]:[align-items:flex-end]": 393,
  "[.contact-page_&]:[justify-content:space-between]": 394,
  "[.contact-page_&]:[gap:calc(20_*_var(--location-unit))]": 395,
  "[.contact-page_&]:[margin-top:calc(24_*_var(--location-unit))]": 423,
  "[.contact-page_&_>_p:last-child]:[margin-top:0]": 397,
  "[.contact-page_&_>_p:last-child]:[margin-right:0]": 398,
  "[.contact-page_&_>_p:last-child]:[margin-bottom:0]": 399,
  "[.contact-page_&_>_p:last-child]:[margin-left:0]": 400,
  "[.contact-page_&_>_p:last-child]:[font-size:calc(15_*_var(--location-unit))]!": 401,
  "[.contact-page_&_>_p:last-child]:[line-height:1]!": 402,
  "[.contact-page_&]:[flex-shrink:0]": 405,
  "[.contact-page_&]:[gap:calc(12_*_var(--location-unit))]": 513,
  "[.contact-page_&_a]:[display:grid]!": 407,
  "[.contact-page_&_a]:[place-items:center]": 408,
  "[.contact-page_&_a]:[width:calc(34_*_var(--location-unit))]": 409,
  "[.contact-page_&_a]:[height:calc(34_*_var(--location-unit))]": 410,
  "[.contact-page_&_a]:[border-radius:8px]": 411,
  "[.contact-page_&_a]:[transition:transform_200ms_ease]": 412,
  "[.contact-page_&_svg]:[width:calc(30_*_var(--location-unit))]": 413,
  "[.contact-page_&_svg]:[height:calc(30_*_var(--location-unit))]": 414,
  "[.contact-page_&_a:hover]:[transform:translateY(-3px)]": 415,
  "[.contact-page_&]:[color:#34a853]!": 416,
  "[.contact-page_&_a:focus-visible]:[outline:2px_solid_#005eff]": 417,
  "[.contact-page_&_a:focus-visible]:[outline-offset:4px]": 871,
  "[.contact-page_&_button:focus-visible]:[outline:2px_solid_#005eff]": 1259,
  "[.contact-page_&_button:focus-visible]:[outline-offset:4px]": 869,
  "[.contact-page_&]:[min-height:calc(648_*_var(--location-unit))]": 424,
  "[.contact-page_&]:[top:calc(8_*_var(--location-unit))]": 427,
  "[.contact-page_&]:[left:calc(76_*_var(--location-unit))]": 428,
  "[.contact-page_&]:[width:calc(1152_*_var(--location-unit))]": 429,
  "[.contact-page_&]:[height:auto]": 431,
  "[.contact-page_&]:[top:0]": 1231,
  "[.contact-page_&]:[background:radial-gradient(ellipse_at_45%_60%,_#17396518,_transparent_60%)]": 439,
  "[.contact-page_&]:[align-items:start]": 698,
  "[.contact-page_&]:[gap:calc(15_*_var(--location-unit))]": 446,
  "[.contact-page_&[data-open='true']]:[background:linear-gradient(145deg,_#ffffff40_0%,_#ffffff25_55%,_#16315840_100%)]": 449,
  "[.contact-page_&_button]:[display:flex]!": 454,
  "[.contact-page_&_button]:[align-items:center]": 733,
  "[.contact-page_&_button]:[justify-content:space-between]": 456,
  "[.contact-page_&_button]:[gap:calc(10_*_var(--location-unit))]": 457,
  "[.contact-page_&_button]:[width:100%]": 458,
  "[.contact-page_&_button]:[min-height:calc(101_*_var(--location-unit))]": 459,
  "[.contact-page_&_button]:[padding-top:calc(35_*_var(--location-unit))]": 460,
  "[.contact-page_&_button]:[padding-right:calc(25_*_var(--location-unit))]": 461,
  "[.contact-page_&_button]:[padding-bottom:calc(35_*_var(--location-unit))]": 462,
  "[.contact-page_&_button]:[padding-left:calc(25_*_var(--location-unit))]": 463,
  "[.contact-page_&_button]:[border:0]": 1162,
  "[.contact-page_&_button]:[background:transparent]": 1164,
  "[.contact-page_&_button]:[color:#000]!": 466,
  "[.contact-page_&_button]:[font-style:inherit]": 747,
  "[.contact-page_&_button]:[font-variant:inherit]": 748,
  "[.contact-page_&_button]:[font-weight:inherit]!": 749,
  "[.contact-page_&_button]:[font-stretch:inherit]!": 750,
  "[.contact-page_&_button]:[font-size:inherit]!": 751,
  "[.contact-page_&_button]:[line-height:inherit]!": 752,
  "[.contact-page_&_button]:[font-family:inherit]!": 753,
  "[.contact-page_&_button]:[font-feature-settings:inherit]": 754,
  "[.contact-page_&_button]:[font-variation-settings:inherit]!": 755,
  "[.contact-page_&_button]:[font-size:calc(20_*_var(--location-unit))]!": 476,
  "[.contact-page_&_button]:[font-weight:410]!": 477,
  "[.contact-page_&_button]:[letter-spacing:-0.04em]": 478,
  "[.contact-page_&_button]:[line-height:1]!": 479,
  "[.contact-page_&_button]:[text-align:left]": 480,
  "[.contact-page_&_button]:[cursor:pointer]": 1166,
  "[.contact-page_&_button:focus-visible]:[outline-offset:-6px]": 482,
  "[.contact-page_&_button:focus-visible]:[border-radius:calc(30_*_var(--location-unit))]": 483,
  "[.contact-page_&]:[place-items:center]": 1105,
  "[.contact-page_&]:[flex:0_0_calc(30_*_var(--location-unit))]": 486,
  "[.contact-page_&]:[width:calc(30_*_var(--location-unit))]": 487,
  "[.contact-page_&]:[height:calc(30_*_var(--location-unit))]": 488,
  "[.contact-page_&]:[border-radius:50%]": 1246,
  "[.contact-page_&]:[background:linear-gradient(145deg,_#005eff,_#0033c8)]": 490,
  "[.contact-page_&]:[box-shadow:0_0_12px_#005eff66,_0_3px_8px_#0033c829]": 491,
  "[.contact-page_&]:[transition:box-shadow_250ms_ease]": 492,
  "[.contact-page_&_svg]:[width:65%]": 493,
  "[.contact-page_&_svg]:[height:65%]": 494,
  "[.contact-page_&_svg]:[color:#fff]!": 495,
  "[.contact-page_&_svg]:[stroke-width:2]": 496,
  "[.contact-page_&_svg]:[transition:transform_400ms_ease-in-out]": 497,
  "[.contact-page_.contact-office[data-open='true']_&_svg]:[transform:rotate(180deg)]": 498,
  "[.contact-page_.contact-office-heading_button:hover_&]:[box-shadow:0_0_18px_#005eff99,_0_3px_8px_#0033c840]": 499,
  "[.contact-page_&]:[grid-template-rows:0fr]": 501,
  "[.contact-page_&]:[opacity:0]": 502,
  "[.contact-page_&]:[transition:grid-template-rows_400ms_ease-in-out,_opacity_300ms_ease-in-out]": 503,
  "[.contact-page_.contact-office[data-open='true']_&]:[grid-template-rows:1fr]": 504,
  "[.contact-page_.contact-office[data-open='true']_&]:[opacity:1]": 505,
  "[.contact-page_&]:[min-height:0]": 506,
  "[.contact-page_&]:[padding-top:0]": 1135,
  "[.contact-page_&]:[padding-right:calc(25_*_var(--location-unit))]": 509,
  "[.contact-page_&]:[padding-bottom:calc(28_*_var(--location-unit))]": 510,
  "[.contact-page_&]:[padding-left:calc(25_*_var(--location-unit))]": 511,
  "[.contact-page_&]:[grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)]": 512,
  "[.contact-page_&]:[margin-top:calc(20_*_var(--location-unit))]!": 514,
  "[.contact-page_&]:[margin-bottom:calc(20_*_var(--location-unit))]!": 516,
  "[.contact-page_&_dd]:[font-size:calc(12_*_var(--location-unit))]!": 518,
  "[.contact-page_.contact-office-communication_&]:[font-size:calc(20_*_var(--location-unit))]!": 519,
  "[.contact-page_&]:[height:calc(130_*_var(--location-unit))]": 520,
  "[.contact-page_.contact-location-map--compact_&&]:[top:50%]": 521,
  "[.contact-page_.contact-location-map--compact_&&]:[left:50%]": 522,
  "[.contact-page_.contact-location-map--compact_&&]:[right:auto]": 523,
  "[.contact-page_.contact-location-map--compact_&&]:[transform:translate(-50%,_-50%)]": 524,
  "[.contact-page_.contact-office-content_&]:[gap:calc(12_*_var(--location-unit))]": 525,
  "[.contact-page_.contact-office-content_&]:[margin-top:calc(20_*_var(--location-unit))]!": 526,
  "[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:calc(12_*_var(--location-unit))]!": 527,
  "[.contact-page_.contact-office-content_&_>_p:last-child]:[line-height:1.12]!": 528,
  "[.contact-page_.contact-office-content_&]:[gap:calc(6_*_var(--location-unit))]": 529,
  "[.contact-page_&]:[min-height:calc(395_*_var(--location-unit))]": 530,
  "[.contact-page_&]:[align-items:flex-start]": 1179,
  "[.contact-page_&_p]:[max-width:22em]": 537,
  "[.contact-page_&_p]:[color:#0d5792]!": 538,
  "[.contact-page_&_p]:[font-size:calc(15_*_var(--location-unit))]!": 539,
  "[.contact-page_&_p]:[line-height:1.35]!": 540,
  "max-[1200px]:[.contact-page_&]:[--location-unit:1px]": 541,
  "max-[1200px]:[.contact-page_&]:[grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)]": 542,
  "max-[1200px]:[.contact-page_&_button]:[font-size:17px]!": 543,
  "max-[1200px]:[.contact-page_&_button]:[padding-left:20px]": 544,
  "max-[1200px]:[.contact-page_&_button]:[padding-right:20px]": 545,
  "max-[1200px]:[.contact-page_&]:[padding-left:20px]": 911,
  "max-[1200px]:[.contact-page_&]:[padding-right:20px]": 909,
  "max-[1200px]:[.contact-page_.contact-office-content_&]:[flex-wrap:wrap]": 548,
  "max-[1024px]:[.contact-page_&]:[grid-template-columns:1fr]": 561,
  "max-[1024px]:[.contact-page_&]:[gap:32px]": 550,
  "max-[1024px]:[.contact-page_&]:[padding-right:30px]": 552,
  "max-[1024px]:[.contact-page_&]:[padding-bottom:30px]": 553,
  "max-[1024px]:[.contact-page_&]:[padding-left:30px]": 554,
  "max-[1024px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1.3fr_1fr_0.7fr]": 555,
  "max-[1024px]:[.contact-page_.contact-headquarters_&]:[gap:24px]": 556,
  "max-[1024px]:[.contact-page_&_dd]:[line-height:1.2]!": 557,
  "max-[1024px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:none]!": 558,
  "max-[1024px]:[.contact-page_&]:[height:auto]": 559,
  "max-[1024px]:[.contact-page_&]:[aspect-ratio:616_/_246]": 560,
  "max-[1024px]:[.contact-page_&]:[gap:16px]": 562,
  "max-[1024px]:[.contact-page_&_button]:[font-size:20px]!": 563,
  "max-[1024px]:[.contact-page_&_button]:[padding-left:25px]": 564,
  "max-[1024px]:[.contact-page_&_button]:[padding-right:25px]": 565,
  "max-[1024px]:[.contact-page_&]:[padding-left:25px]": 566,
  "max-[1024px]:[.contact-page_&]:[padding-right:25px]": 567,
  "max-[1024px]:[.contact-page_&]:[max-width:440px]": 569,
  "max-[1024px]:[.contact-page_&_dd]:[font-size:15px]!": 570,
  "max-[1024px]:[.contact-page_&&]:[aspect-ratio:340_/_130]": 571,
  "max-[1024px]:[.contact-page_&&]:[max-height:246px]": 572,
  "max-[1024px]:[.contact-page_.contact-office-content_&]:[flex-wrap:nowrap]": 573,
  "max-[1024px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:15px]!": 574,
  "max-[1024px]:[.contact-page_&]:[bottom:-40px]": 576,
  "max-[1024px]:[.contact-page_&]:[left:0]": 577,
  "max-[1024px]:[.contact-page_&]:[width:100%]": 578,
  "max-[1024px]:[.contact-page_&]:[padding-bottom:180px]": 579,
  "max-[1024px]:[.contact-page_&]:[min-height:240px]": 580,
  "max-[768px]:[.contact-page_&]:[padding-top:40px]": 581,
  "max-[768px]:[.contact-page_&]:[padding-right:20px]": 1287,
  "max-[768px]:[.contact-page_&]:[padding-bottom:60px]": 1271,
  "max-[768px]:[.contact-page_&]:[padding-left:20px]": 1286,
  "max-[768px]:[.contact-page_&]:[padding-top:26px]": 585,
  "max-[768px]:[.contact-page_&]:[padding-bottom:26px]": 619,
  "max-[768px]:[.contact-page_&]:[gap:28px]": 589,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[grid-template-columns:1fr]": 590,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:24px]": 591,
  "max-[768px]:[.contact-page_.contact-headquarters_&_dd_br]:[display:inline]!": 592,
  "max-[768px]:[.contact-page_&_dd]:[font-size:14px]!": 623,
  "max-[768px]:[.contact-page_&_dd]:[line-height:1.2]!": 594,
  "max-[768px]:[.contact-page_&]:[aspect-ratio:340_/_180]": 595,
  "max-[768px]:[.contact-page_&]:[border-radius:22px]": 596,
  "max-[768px]:[.contact-page_&]:[top:12px]": 597,
  "max-[768px]:[.contact-page_&]:[right:12px]": 598,
  "max-[768px]:[.contact-page_&]:[min-height:44px]": 599,
  "max-[768px]:[.contact-page_&]:[padding-top:10px]": 1357,
  "max-[768px]:[.contact-page_&]:[padding-right:12px]": 601,
  "max-[768px]:[.contact-page_&]:[padding-bottom:10px]": 1359,
  "max-[768px]:[.contact-page_&]:[padding-left:12px]": 603,
  "max-[768px]:[.contact-page_&]:[align-items:flex-start]": 604,
  "max-[768px]:[.contact-page_&]:[flex-wrap:wrap]": 605,
  "max-[768px]:[.contact-page_&]:[gap:18px]": 606,
  "max-[768px]:[.contact-page_&_>_p:last-child]:[font-size:14px]!": 607,
  "max-[768px]:[.contact-page_&_>_p:last-child]:[line-height:1.2]!": 608,
  "max-[768px]:[.contact-page_&_a]:[width:36px]": 609,
  "max-[768px]:[.contact-page_&_a]:[height:36px]": 610,
  "max-[768px]:[.contact-page_&_button]:[padding-top:28px]": 611,
  "max-[768px]:[.contact-page_&_button]:[padding-right:20px]": 612,
  "max-[768px]:[.contact-page_&_button]:[padding-bottom:28px]": 613,
  "max-[768px]:[.contact-page_&_button]:[padding-left:20px]": 614,
  "max-[768px]:[.contact-page_&_button]:[min-height:88px]": 615,
  "max-[768px]:[.contact-page_&_button]:[font-size:18px]!": 616,
  "max-[768px]:[.contact-page_&]:[padding-top:0]": 1455,
  "max-[768px]:[.contact-page_&]:[gap:20px]": 622,
  "max-[768px]:[.contact-page_&&]:[aspect-ratio:340_/_160]": 624,
  "max-[768px]:[.contact-page_.contact-office-content_&]:[flex-wrap:wrap]": 625,
  "max-[768px]:[.contact-page_.contact-office-content_&]:[gap:18px]": 626,
  "max-[768px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:14px]!": 627,
  "max-[768px]:[.contact-page_&]:[bottom:-30px]": 628,
  "max-[768px]:[.contact-page_&]:[left:-10%]": 629,
  "max-[768px]:[.contact-page_&]:[width:120%]": 630,
  "max-[768px]:[.contact-page_&]:[padding-bottom:140px]": 631,
  "max-[768px]:[.contact-page_&]:[min-height:200px]": 632,
  "motion-reduce:[.contact-page_&]:[transition:none]": 1295,
  "motion-reduce:[.contact-page_&_svg]:[transition:none]": 634,
  "motion-reduce:[.contact-page_&_a]:[transition:none]": 636,
  "[.contact-page_&]:[--sales-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)]": 638,
  "[.contact-page_&]:[padding-top:calc(66_*_var(--sales-unit))]": 643,
  "[.contact-page_&]:[padding-bottom:0]": 1137,
  "[.contact-page_&]:[background:linear-gradient(90deg,_#1c2fb8_0%,_#081e63_40%,_#02111f_100%)]": 647,
  "[.contact-page_&]:[color:#fff]!": 708,
  "[.contact-page_&]:[right:auto]": 653,
  "[.contact-page_&]:[left:-8%]": 655,
  "[.contact-page_&]:[width:85%]": 656,
  "[.contact-page_&]:[height:100%]": 1081,
  "[.contact-page_&]:[object-position:35%_center]": 660,
  "[.contact-page_&]:[opacity:0.55]": 661,
  "[.contact-page_&]:[mask-image:linear-gradient(90deg,_#000_0%,_#000_45%,_transparent_100%)]": 662,
  "[.contact-page_&]:[background:linear-gradient(90deg,_#1c2fb866_0%,_#081e638c_40%,_#02111fe6_100%)]": 670,
  "[.contact-page_&]:[background:radial-gradient(ellipse_at_22%_35%,_#005eff59_0%,_transparent_34%),_radial-gradient(ellipse_at_14%_68%,_#478eff38_0%,_transparent_28%),_radial-gradient(ellipse_at_68%_14%,_#78aaff1f_0%,_transparent_35%)]": 678,
  "[.contact-page_&]:[max-width:calc(1200_*_var(--sales-unit))]": 683,
  "[.contact-page_&_h2]:[margin-bottom:calc(54_*_var(--sales-unit))]": 688,
  "[.contact-page_&_h2]:[color:#fff]!": 690,
  "[.contact-page_&_h2]:[font-size:calc(50_*_var(--sales-unit))]!": 691,
  "[.contact-page_&_h2]:[text-align:center]": 694,
  "[.contact-page_&]:[grid-template-columns:minmax(0,_calc(380_*_var(--sales-unit)))_minmax(0,_1fr)]": 697,
  "[.contact-page_&]:[gap:calc(70_*_var(--sales-unit))]": 699,
  "[.contact-page_&]:[padding-top:calc(32_*_var(--sales-unit))]": 701,
  "[.contact-page_&]:[margin-bottom:calc(35_*_var(--sales-unit))]": 705,
  "[.contact-page_&]:[max-width:15em]": 707,
  "[.contact-page_&]:[font-size:calc(25_*_var(--sales-unit))]!": 709,
  "[.contact-page_&]:[text-shadow:0_0_26px_#478eff40]": 714,
  "[.contact-page_&::before]:[top:-15%]": 717,
  "[.contact-page_&::before]:[right:-25%]": 718,
  "[.contact-page_&::before]:[bottom:-15%]": 719,
  "[.contact-page_&::before]:[left:-25%]": 720,
  "[.contact-page_&::before]:[background:radial-gradient(ellipse_at_45%_38%,_#005eff33,_transparent_64%)]": 722,
  "[.contact-page_&]:[gap:calc(14_*_var(--sales-unit))]": 725,
  "[.contact-page_&]:[gap:calc(10_*_var(--sales-unit))]": 817,
  "[.contact-page_&_button]:[flex:1_1_0]": 728,
  "[.contact-page_&_button]:[min-width:0]": 729,
  "[.contact-page_&:first-child_button:nth-child(1)]:[flex-grow:0.55]": 730,
  "[.contact-page_&:first-child_button:nth-child(3)]:[flex-grow:1.75]": 731,
  "[.contact-page_&_button]:[display:inline-flex]!": 732,
  "[.contact-page_&_button]:[justify-content:center]": 734,
  "[.contact-page_&_button]:[gap:calc(12_*_var(--sales-unit))]": 735,
  "[.contact-page_&_button]:[min-height:calc(37_*_var(--sales-unit))]": 736,
  "[.contact-page_&_button]:[padding-top:calc(11_*_var(--sales-unit))]": 737,
  "[.contact-page_&_button]:[padding-right:calc(15_*_var(--sales-unit))]": 738,
  "[.contact-page_&_button]:[padding-bottom:calc(11_*_var(--sales-unit))]": 739,
  "[.contact-page_&_button]:[padding-left:calc(15_*_var(--sales-unit))]": 740,
  "[.contact-page_&_button]:[border:1px_solid_#78aaff59]": 741,
  "[.contact-page_&_button]:[border-radius:calc(11_*_var(--sales-unit))]": 742,
  "[.contact-page_&_button]:[background:#081e6359]": 743,
  "[.contact-page_&_button]:[box-shadow:inset_0_0_12px_#478eff14,_0_0_15px_#005eff12]": 744,
  "[.contact-page_&_button]:[backdrop-filter:blur(12px)]": 745,
  "[.contact-page_&_button]:[color:#dceaff]!": 746,
  "[.contact-page_&_button]:[font-size:calc(14_*_var(--sales-unit))]!": 756,
  "[.contact-page_&_button]:[line-height:1.1]!": 757,
  "[.contact-page_&_button]:[letter-spacing:0]": 758,
  "[.contact-page_&_button]:[transition:background_220ms_ease,_border-color_220ms_ease,_box-shadow_220ms_ease]": 760,
  "[.contact-page_&_button:hover]:[background:#005eff40]": 761,
  "[.contact-page_&_button:hover]:[border-color:#a3ceffb3]": 762,
  "[.contact-page_&_button:hover]:[box-shadow:inset_0_0_12px_#478eff26,_0_0_18px_#005eff40]": 763,
  "[.contact-page_&_button[aria-pressed='true']]:[background:linear-gradient(145deg,_#005effb3,_#2c5cb966)]": 764,
  "[.contact-page_&_button[aria-pressed='true']]:[border-color:#a7d0ffcc]": 765,
  "[.contact-page_&_button[aria-pressed='true']]:[box-shadow:inset_0_0_14px_#78aaff33,_0_0_20px_#005eff59]": 766,
  "[.contact-page_&_button[aria-pressed='true']]:[color:#fff]!": 767,
  "[.contact-page_&:last-child_button]:[justify-content:center]": 768,
  "[.contact-page_&]:[display:inline-flex]!": 769,
  "[.contact-page_&]:[gap:calc(7_*_var(--sales-unit))]": 771,
  "[.contact-page_&]:[font-size:calc(10_*_var(--sales-unit))]!": 772,
  "[.contact-page_&_img]:[width:calc(22_*_var(--sales-unit))]": 773,
  "[.contact-page_&_img]:[height:calc(22_*_var(--sales-unit))]": 774,
  "[.contact-page_&_img]:[border-radius:50%]": 775,
  "[.contact-page_&]:[height:calc(510_*_var(--sales-unit))]": 779,
  "[.contact-page_&]:[margin-bottom:calc(-44_*_var(--sales-unit))]": 780,
  "[.contact-page_&]:[border:0.5px_solid_#dce6ef59]": 782,
  "[.contact-page_&]:[border-radius:calc(30_*_var(--sales-unit))]": 783,
  "[.contact-page_&]:[background:#7d8da047]": 784,
  "[.contact-page_&]:[backdrop-filter:blur(24px)]": 785,
  "[.contact-page_&]:[box-shadow:inset_0_1px_22px_#ffffff12,_0_20px_60px_#020a1e33]": 786,
  "[.contact-page_&]:[overflow-y:auto]": 788,
  "[.contact-page_&]:[overflow-x:hidden]": 789,
  "[.contact-page_&]:[padding-top:calc(30_*_var(--sales-unit))]": 790,
  "[.contact-page_&]:[padding-right:calc(30_*_var(--sales-unit))]": 791,
  "[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_calc(106_*_var(--sales-unit)))]": 792,
  "[.contact-page_&]:[padding-left:calc(30_*_var(--sales-unit))]": 793,
  "[.contact-page_&]:[scrollbar-width:thin]": 794,
  "[.contact-page_&]:[scrollbar-color:#f7f7f7b3_#ffffff0a]": 795,
  "[.contact-page_&]:[overscroll-behavior-y:auto]": 796,
  "[.contact-page_&]:[scrollbar-gutter:stable]": 797,
  "[.contact-page_&::-webkit-scrollbar]:[width:5px]": 798,
  "[.contact-page_&::-webkit-scrollbar-track]:[background:#ffffff0a]": 799,
  "[.contact-page_&::-webkit-scrollbar-thumb]:[border-radius:20px]": 800,
  "[.contact-page_&::-webkit-scrollbar-thumb]:[background:#f7f7f7b3]": 801,
  "[.contact-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]": 1129,
  "[.contact-page_&]:[gap:calc(12_*_var(--sales-unit))]": 804,
  "[.contact-page_&]:[padding-right:0]": 1136,
  "[.contact-page_&]:[padding-left:0]": 1138,
  "[.contact-page_&]:[list-style:none]": 1139,
  "[.contact-page_&]:[flex-direction:column]": 1175,
  "[.contact-page_&]:[min-height:calc(116_*_var(--sales-unit))]": 819,
  "[.contact-page_&]:[padding-top:calc(16_*_var(--sales-unit))]": 820,
  "[.contact-page_&]:[padding-right:calc(16_*_var(--sales-unit))]": 821,
  "[.contact-page_&]:[padding-bottom:calc(16_*_var(--sales-unit))]": 822,
  "[.contact-page_&]:[padding-left:calc(16_*_var(--sales-unit))]": 823,
  "[.contact-page_&]:[border:0.5px_solid_#dce6ef33]": 824,
  "[.contact-page_&]:[border-radius:calc(10_*_var(--sales-unit))]": 825,
  "[.contact-page_&]:[background:#ffffff17]": 826,
  "[.contact-page_&]:[box-shadow:inset_0_1px_10px_#ffffff08]": 827,
  "[.contact-page_&]:[transition:background_220ms_ease,_border-color_220ms_ease]": 828,
  "[.contact-page_&:hover]:[background:#ffffff24]": 829,
  "[.contact-page_&:hover]:[border-color:#dce6ef66]": 830,
  "[.contact-page_&_h3]:[margin-bottom:0]": 833,
  "[.contact-page_&_h3]:[color:#fff]!": 835,
  "[.contact-page_&_h3]:[font-size:calc(16_*_var(--sales-unit))]!": 836,
  "[.contact-page_&_h3]:[font-weight:540]!": 837,
  "[.contact-page_&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]!": 838,
  "[.contact-page_&_h3]:[line-height:1.15]!": 839,
  "[.contact-page_&_h3]:[letter-spacing:-0.04em]": 840,
  "[.contact-page_&_p]:[color:#dce6efb3]!": 845,
  "[.contact-page_&_p]:[font-size:calc(12_*_var(--sales-unit))]!": 846,
  "[.contact-page_&_a]:[margin-top:auto]": 848,
  "[.contact-page_&_a]:[max-width:100%]": 849,
  "[.contact-page_&_a]:[color:#eef6ff]!": 850,
  "[.contact-page_&_a]:[font-size:calc(12_*_var(--sales-unit))]!": 851,
  "[.contact-page_&_a]:[line-height:1.2]!": 852,
  "[.contact-page_&_a]:[overflow-wrap:anywhere]": 853,
  "[.contact-page_&_a:hover]:[color:#fff]!": 854,
  "[.contact-page_&_a:hover]:[text-decoration:underline]!": 855,
  "[.contact-page_&_a:hover]:[text-underline-offset:3px]": 856,
  "[.contact-page_&]:[right:10px]": 861,
  "[.contact-page_&]:[height:calc(88_*_var(--sales-unit))]": 862,
  "[.contact-page_&]:[border-radius:0_0_calc(30_*_var(--sales-unit))_calc(30_*_var(--sales-unit))]": 863,
  "[.contact-page_&]:[background:linear-gradient(180deg,_#dce6ef00,_#dce6ef45_45%,_#dce6efa6_100%)]": 864,
  "[.contact-page_&]:[backdrop-filter:blur(6px)]": 865,
  "[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_70%)]": 866,
  "[.contact-page_&_button:focus-visible]:[outline:2px_solid_#c0e2ff]": 868,
  "[.contact-page_&_a:focus-visible]:[outline:2px_solid_#c0e2ff]": 870,
  "[.contact-page_&:focus-visible]:[outline:2px_solid_#c0e2ff]": 872,
  "[.contact-page_&:focus-visible]:[outline-offset:-4px]": 873,
  "[.contact-page_&:focus-visible]:[border-radius:inherit]": 874,
  "max-[1200px]:[.contact-page_&]:[--sales-unit:1px]": 875,
  "max-[1200px]:[.contact-page_&]:[grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.5fr)]": 876,
  "max-[1200px]:[.contact-page_&]:[gap:36px]": 877,
  "max-[1200px]:[.contact-page_&]:[padding-top:14px]": 878,
  "max-[1200px]:[.contact-page_&]:[padding-right:14px]": 879,
  "max-[1200px]:[.contact-page_&]:[padding-bottom:14px]": 880,
  "max-[1200px]:[.contact-page_&]:[padding-left:14px]": 881,
  "max-[1200px]:[.contact-page_&]:[padding-left:22px]": 882,
  "max-[1200px]:[.contact-page_&]:[padding-right:22px]": 883,
  "max-[1200px]:[.contact-page_&]:[padding-top:56px]": 884,
  "max-[1200px]:[.contact-page_&]:[padding-bottom:0]": 885,
  "max-[1200px]:[.contact-page_&_h2]:[margin-bottom:36px]": 886,
  "max-[1200px]:[.contact-page_&_h2]:[font-size:42px]!": 887,
  "max-[1200px]:[.contact-page_&]:[grid-template-columns:1fr]": 932,
  "max-[1200px]:[.contact-page_&]:[gap:32px]": 889,
  "max-[1200px]:[.contact-page_&]:[width:100%]": 900,
  "max-[1200px]:[.contact-page_&]:[max-width:640px]": 901,
  "max-[1200px]:[.contact-page_&]:[margin-left:auto]": 903,
  "max-[1200px]:[.contact-page_&]:[margin-right:auto]": 904,
  "max-[1200px]:[.contact-page_&]:[padding-top:0]": 894,
  "max-[1200px]:[.contact-page_&]:[max-width:25em]": 895,
  "max-[1200px]:[.contact-page_&]:[margin-bottom:24px]": 896,
  "max-[1200px]:[.contact-page_&]:[height:470px]": 902,
  "max-[1200px]:[.contact-page_&]:[width:130%]": 905,
  "max-[1200px]:[.contact-page_&]:[left:-30%]": 906,
  "max-[1200px]:[.contact-page_&]:[opacity:0.4]": 907,
  "max-[1200px]:[.contact-page_&]:[padding-top:44px]": 908,
  "max-[1200px]:[.contact-page_&]:[padding-bottom:40px]": 910,
  "max-[1200px]:[.contact-page_&_h2]:[font-size:clamp(28px,_8vw,_38px)]!": 912,
  "max-[1200px]:[.contact-page_&]:[font-size:22px]!": 913,
  "max-[1200px]:[.contact-page_&]:[line-height:1.15]!": 914,
  "max-[1200px]:[.contact-page_&]:[gap:8px]": 922,
  "max-[1200px]:[.contact-page_&_button]:[min-height:44px]": 916,
  "max-[1200px]:[.contact-page_&_button]:[padding-top:10px]": 917,
  "max-[1200px]:[.contact-page_&_button]:[padding-right:12px]": 918,
  "max-[1200px]:[.contact-page_&_button]:[padding-bottom:10px]": 919,
  "max-[1200px]:[.contact-page_&_button]:[padding-left:12px]": 920,
  "max-[1200px]:[.contact-page_&_button]:[font-size:10px]!": 921,
  "max-[1200px]:[.contact-page_&_button]:[padding-left:8px]": 923,
  "max-[1200px]:[.contact-page_&_button]:[padding-right:8px]": 924,
  "max-[1200px]:[.contact-page_&]:[height:460px]": 925,
  "max-[1200px]:[.contact-page_&]:[margin-bottom:0]": 926,
  "max-[1200px]:[.contact-page_&]:[border-radius:24px]": 927,
  "max-[1200px]:[.contact-page_&]:[padding-top:20px]": 928,
  "max-[1200px]:[.contact-page_&]:[padding-right:16px]": 936,
  "max-[1200px]:[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_96px)]": 930,
  "max-[1200px]:[.contact-page_&]:[padding-left:16px]": 938,
  "max-[1200px]:[.contact-page_&]:[gap:12px]": 933,
  "max-[1200px]:[.contact-page_&]:[min-height:112px]": 934,
  "max-[1200px]:[.contact-page_&]:[padding-top:16px]": 935,
  "max-[1200px]:[.contact-page_&]:[padding-bottom:16px]": 937,
  "max-[1200px]:[.contact-page_&_h3]:[font-size:15px]!": 939,
  "max-[1200px]:[.contact-page_&_p]:[font-size:12px]!": 940,
  "max-[1200px]:[.contact-page_&_a]:[font-size:12px]!": 941,
  "max-[1200px]:[.contact-page_&]:[height:80px]": 942,
  "max-[1200px]:[.contact-page_&]:[border-radius:0_0_24px_24px]": 943,
  "motion-reduce:[.contact-page_&_button]:[transition:none]": 945,
  "[.contact-page_&]:[padding-top:140px]": 949,
  "[.contact-page_&]:[padding-bottom:88px]": 951,
  "[.contact-page_&]:[background:radial-gradient(ellipse_at_8%_90%,_#8dc4ff26,_transparent_55%),_radial-gradient(ellipse_at_47%_42%,_#b0d7ff24,_transparent_52%),_linear-gradient(110deg,_#cde6ff_0%,_#ddeeff_42%,_#ebf5ff_72%,_#f8fbff_100%)]": 953,
  "[.contact-page_&]:[max-width:1200px]": 957,
  "[.contact-page_&_#contact-write-title]:[margin-top:0]": 960,
  "[.contact-page_&_#contact-write-title]:[margin-right:0]": 961,
  "[.contact-page_&_#contact-write-title]:[margin-bottom:54px]": 962,
  "[.contact-page_&_#contact-write-title]:[margin-left:0]": 963,
  "[.contact-page_&_#contact-write-title]:[text-align:center]": 964,
  "[.contact-page_&_#contact-write-title]:[font-size:50px]!": 965,
  "[.contact-page_&_#contact-write-title]:[font-weight:410]!": 966,
  "[.contact-page_&_#contact-write-title]:[line-height:1]!": 967,
  "[.contact-page_&_#contact-write-title]:[letter-spacing:-0.04em]": 968,
  "[.contact-page_&_#contact-write-title]:[color:#0d5792]!": 969,
  "[.contact-page_&]:[gap:56px]": 971,
  "[.contact-page_&_fieldset]:[min-width:0]": 972,
  "[.contact-page_&_fieldset]:[margin-top:0]": 973,
  "[.contact-page_&_fieldset]:[margin-right:0]": 974,
  "[.contact-page_&_fieldset]:[margin-bottom:0]": 975,
  "[.contact-page_&_fieldset]:[margin-left:0]": 976,
  "[.contact-page_&_fieldset]:[padding-top:0]": 977,
  "[.contact-page_&_fieldset]:[padding-right:0]": 978,
  "[.contact-page_&_fieldset]:[padding-bottom:0]": 979,
  "[.contact-page_&_fieldset]:[padding-left:0]": 980,
  "[.contact-page_&_fieldset]:[border:0]": 981,
  "[.contact-page_&_legend]:[width:100%]": 982,
  "[.contact-page_&_legend]:[margin-bottom:25px]": 983,
  "[.contact-page_&_legend]:[padding-top:0]": 984,
  "[.contact-page_&_legend]:[padding-right:0]": 985,
  "[.contact-page_&_legend]:[padding-bottom:0]": 986,
  "[.contact-page_&_legend]:[padding-left:0]": 987,
  "[.contact-page_&_legend]:[font-size:25px]!": 988,
  "[.contact-page_&_legend]:[font-weight:540]!": 989,
  "[.contact-page_&_legend]:[font-variation-settings:'wght'_540,_'wdth'_125]!": 990,
  "[.contact-page_&_legend]:[line-height:1.12]!": 991,
  "[.contact-page_&_legend]:[color:#005eff]!": 992,
  "[.contact-page_&]:[gap:10px_25px]": 995,
  "[.contact-page_&_>_label]:[min-width:0]": 996,
  "[.contact-page_&_input:not([type='file'])]:[display:block]!": 997,
  "[.contact-page_&_input:not([type='file'])]:[width:100%]": 998,
  "[.contact-page_&_input:not([type='file'])]:[min-width:0]": 999,
  "[.contact-page_&_input:not([type='file'])]:[height:45px]": 1000,
  "[.contact-page_&_input:not([type='file'])]:[padding-top:12px]": 1001,
  "[.contact-page_&_input:not([type='file'])]:[padding-right:37px]": 1002,
  "[.contact-page_&_input:not([type='file'])]:[padding-bottom:12px]": 1003,
  "[.contact-page_&_input:not([type='file'])]:[padding-left:37px]": 1004,
  "[.contact-page_&_input:not([type='file'])]:[border:1px_solid_transparent]": 1005,
  "[.contact-page_&_input:not([type='file'])]:[border-radius:8px]": 1006,
  "[.contact-page_&_input:not([type='file'])]:[background:#f7f7f7]": 1007,
  "[.contact-page_&_input:not([type='file'])]:[color:#0d5792]!": 1008,
  "[.contact-page_&_input:not([type='file'])]:[font-style:inherit]": 1009,
  "[.contact-page_&_input:not([type='file'])]:[font-variant:inherit]": 1010,
  "[.contact-page_&_input:not([type='file'])]:[font-weight:inherit]!": 1011,
  "[.contact-page_&_input:not([type='file'])]:[font-stretch:inherit]!": 1012,
  "[.contact-page_&_input:not([type='file'])]:[font-size:inherit]!": 1013,
  "[.contact-page_&_input:not([type='file'])]:[line-height:inherit]!": 1014,
  "[.contact-page_&_input:not([type='file'])]:[font-family:inherit]!": 1015,
  "[.contact-page_&_input:not([type='file'])]:[font-feature-settings:inherit]": 1016,
  "[.contact-page_&_input:not([type='file'])]:[font-variation-settings:inherit]!": 1017,
  "[.contact-page_&_input:not([type='file'])]:[font-size:15px]!": 1018,
  "[.contact-page_&_input:not([type='file'])]:[line-height:1.2]!": 1019,
  "[.contact-page_&_input:not([type='file'])]:[letter-spacing:-0.04em]": 1020,
  "[.contact-page_&_input:not([type='file'])]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease]": 1021,
  "[.contact-page_&_textarea]:[display:block]!": 1022,
  "[.contact-page_&_textarea]:[width:100%]": 1023,
  "[.contact-page_&_textarea]:[min-width:0]": 1024,
  "[.contact-page_&_textarea]:[height:45px]": 1025,
  "[.contact-page_&_textarea]:[padding-top:12px]": 1026,
  "[.contact-page_&_textarea]:[padding-right:37px]": 1061,
  "[.contact-page_&_textarea]:[padding-bottom:12px]": 1028,
  "[.contact-page_&_textarea]:[padding-left:37px]": 1063,
  "[.contact-page_&_textarea]:[border:1px_solid_transparent]": 1030,
  "[.contact-page_&_textarea]:[border-radius:8px]": 1031,
  "[.contact-page_&_textarea]:[background:#f7f7f7]": 1032,
  "[.contact-page_&_textarea]:[color:#0d5792]!": 1033,
  "[.contact-page_&_textarea]:[font-style:inherit]": 1034,
  "[.contact-page_&_textarea]:[font-variant:inherit]": 1035,
  "[.contact-page_&_textarea]:[font-weight:inherit]!": 1036,
  "[.contact-page_&_textarea]:[font-stretch:inherit]!": 1037,
  "[.contact-page_&_textarea]:[font-size:inherit]!": 1038,
  "[.contact-page_&_textarea]:[line-height:inherit]!": 1039,
  "[.contact-page_&_textarea]:[font-family:inherit]!": 1040,
  "[.contact-page_&_textarea]:[font-feature-settings:inherit]": 1041,
  "[.contact-page_&_textarea]:[font-variation-settings:inherit]!": 1042,
  "[.contact-page_&_textarea]:[font-size:15px]!": 1043,
  "[.contact-page_&_textarea]:[line-height:1.2]!": 1044,
  "[.contact-page_&_textarea]:[letter-spacing:-0.04em]": 1045,
  "[.contact-page_&_textarea]:[transition:border-color_180ms_ease,_box-shadow_180ms_ease]": 1046,
  "[.contact-page_&_input::placeholder]:[color:#9eb7d0]!": 1047,
  "[.contact-page_&_input::placeholder]:[opacity:1]": 1048,
  "[.contact-page_&_textarea::placeholder]:[color:#9eb7d0]!": 1049,
  "[.contact-page_&_textarea::placeholder]:[opacity:1]": 1050,
  "[.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff33]": 1051,
  "[.contact-page_&_input:focus-visible]:[outline-offset:1px]": 1052,
  "[.contact-page_&_input:focus-visible]:[border-color:#9cc7ff]": 1053,
  "[.contact-page_&_input:focus-visible]:[box-shadow:0_0_14px_#005eff12]": 1054,
  "[.contact-page_&_textarea:focus-visible]:[outline:2px_solid_#005eff33]": 1055,
  "[.contact-page_&_textarea:focus-visible]:[outline-offset:1px]": 1056,
  "[.contact-page_&_textarea:focus-visible]:[border-color:#9cc7ff]": 1057,
  "[.contact-page_&_textarea:focus-visible]:[box-shadow:0_0_14px_#005eff12]": 1058,
  "[.contact-page_&_textarea]:[height:188px]": 1059,
  "[.contact-page_&_textarea]:[padding-top:23px]": 1060,
  "[.contact-page_&_textarea]:[padding-bottom:23px]": 1062,
  "[.contact-page_&_textarea]:[resize:none]": 1064,
  "[.contact-page_&_textarea]:[overflow-y:auto]": 1065,
  "[.contact-page_&]:[height:188px]": 1067,
  "[.contact-page_&]:[border:1px_solid_transparent]": 1068,
  "[.contact-page_&]:[border-radius:8px]": 1087,
  "[.contact-page_&]:[background:#f7f7f7]": 1070,
  "[.contact-page_&]:[transition:background_180ms_ease,_border-color_180ms_ease]": 1071,
  "[.contact-page_&:hover]:[border-color:#9cc7ff]": 1072,
  "[.contact-page_&:hover]:[background:#edf5ff]": 1073,
  "[.contact-page_&[data-dragging='true']]:[border-color:#9cc7ff]": 1074,
  "[.contact-page_&[data-dragging='true']]:[background:#edf5ff]": 1075,
  "[.contact-page_&]:[gap:18px]": 1079,
  "[.contact-page_&]:[padding-top:22px]": 1082,
  "[.contact-page_&]:[padding-right:25px]": 1083,
  "[.contact-page_&]:[padding-bottom:16px]": 1084,
  "[.contact-page_&]:[padding-left:25px]": 1085,
  "[.contact-page_&]:[border:0]": 1086,
  "[.contact-page_&]:[background:transparent]": 1088,
  "[.contact-page_&]:[font-style:inherit]": 1217,
  "[.contact-page_&]:[font-variant:inherit]": 1218,
  "[.contact-page_&]:[font-weight:inherit]!": 1219,
  "[.contact-page_&]:[font-stretch:inherit]!": 1220,
  "[.contact-page_&]:[font-size:inherit]!": 1221,
  "[.contact-page_&]:[line-height:inherit]!": 1222,
  "[.contact-page_&]:[font-family:inherit]!": 1223,
  "[.contact-page_&]:[font-feature-settings:inherit]": 1224,
  "[.contact-page_&]:[font-variation-settings:inherit]!": 1225,
  "[.contact-page_&]:[font-size:15px]!": 1226,
  "[.contact-page_&]:[line-height:1.2]!": 1183,
  "[.contact-page_&]:[cursor:pointer]": 1228,
  "[.contact-page_&_>_span:first-child]:[align-self:flex-start]": 1103,
  "[.contact-page_&]:[flex:0_0_48px]": 1106,
  "[.contact-page_&]:[width:48px]": 1107,
  "[.contact-page_&]:[height:48px]": 1108,
  "[.contact-page_&]:[background:#e1eeff]": 1110,
  "[.contact-page_&]:[color:#587c9d]!": 1111,
  "[.contact-page_&]:[transition:box-shadow_180ms_ease]": 1112,
  "[.contact-page_&_svg]:[width:24px]": 1113,
  "[.contact-page_&_svg]:[height:24px]": 1114,
  "[.contact-page_&_svg]:[stroke-width:1.5]": 1115,
  "[.contact-page_.contact-write-upload-trigger:hover_&]:[box-shadow:0_0_18px_#005eff26]": 1116,
  "[.contact-page_&]:[gap:22px]": 1119,
  "[.contact-page_&]:[font-size:10px]!": 1121,
  "[.contact-page_&_>_span]:[display:flex]!": 1122,
  "[.contact-page_&_>_span]:[align-items:center]": 1123,
  "[.contact-page_&_>_span]:[gap:4px]": 1124,
  "[.contact-page_&_svg]:[width:22px]": 1125,
  "[.contact-page_&_svg]:[height:26px]": 1126,
  "[.contact-page_&_svg]:[stroke-width:1.25]": 1127,
  "[.contact-page_&]:[gap:8px_25px]": 1130,
  "[.contact-page_&]:[margin-top:16px]": 1131,
  "[.contact-page_&_li]:[display:flex]!": 1140,
  "[.contact-page_&_li]:[align-items:center]": 1141,
  "[.contact-page_&_li]:[gap:8px]": 1142,
  "[.contact-page_&_li]:[min-width:0]": 1143,
  "[.contact-page_&_li]:[padding-top:8px]": 1144,
  "[.contact-page_&_li]:[padding-right:12px]": 1145,
  "[.contact-page_&_li]:[padding-bottom:8px]": 1146,
  "[.contact-page_&_li]:[padding-left:12px]": 1147,
  "[.contact-page_&_li]:[border:1px_solid_#9eb7d066]": 1148,
  "[.contact-page_&_li]:[border-radius:8px]": 1149,
  "[.contact-page_&_li]:[background:#f7f7f799]": 1150,
  "[.contact-page_&_li]:[color:#0d5792]!": 1151,
  "[.contact-page_&_li]:[font-size:12px]!": 1152,
  "[.contact-page_&_li_>_svg]:[flex-shrink:0]": 1153,
  "[.contact-page_&_li_>_span]:[flex:1]": 1154,
  "[.contact-page_&_li_>_span]:[min-width:0]": 1155,
  "[.contact-page_&_li_>_span]:[overflow-wrap:anywhere]": 1156,
  "[.contact-page_&_button]:[display:grid]!": 1157,
  "[.contact-page_&_button]:[place-items:center]": 1158,
  "[.contact-page_&_button]:[flex:0_0_32px]": 1159,
  "[.contact-page_&_button]:[width:32px]": 1160,
  "[.contact-page_&_button]:[height:32px]": 1161,
  "[.contact-page_&_button]:[border-radius:6px]": 1163,
  "[.contact-page_&_button]:[color:#0d5792]!": 1165,
  "[.contact-page_&_button:hover]:[background:#005eff14]": 1167,
  "[.contact-page_&]:[margin-top:12px]": 1168,
  "[.contact-page_&]:[color:#9b3131]!": 1172,
  "[.contact-page_&]:[font-size:13px]!": 1257,
  "[.contact-page_&]:[gap:25px]": 1177,
  "[.contact-page_&]:[gap:8px]": 1180,
  "[.contact-page_&]:[max-width:100%]": 1181,
  "[.contact-page_&_input]:[appearance:none]": 1186,
  "[.contact-page_&_input]:[display:grid]!": 1187,
  "[.contact-page_&_input]:[place-items:center]": 1188,
  "[.contact-page_&_input]:[flex:0_0_16px]": 1189,
  "[.contact-page_&_input]:[width:16px]": 1190,
  "[.contact-page_&_input]:[height:16px]": 1191,
  "[.contact-page_&_input]:[margin-top:1px]": 1192,
  "[.contact-page_&_input]:[margin-right:0]": 1193,
  "[.contact-page_&_input]:[margin-bottom:0]": 1194,
  "[.contact-page_&_input]:[margin-left:0]": 1195,
  "[.contact-page_&_input]:[border:0]": 1196,
  "[.contact-page_&_input]:[border-radius:3px]": 1197,
  "[.contact-page_&_input]:[background:#d9d9d9]": 1198,
  "[.contact-page_&_input]:[cursor:pointer]": 1199,
  "[.contact-page_&_input:checked]:[background:#005eff]": 1200,
  "[.contact-page_&_input:checked::after]:[content:'']": 1201,
  "[.contact-page_&_input:checked::after]:[width:5px]": 1202,
  "[.contact-page_&_input:checked::after]:[height:9px]": 1203,
  "[.contact-page_&_input:checked::after]:[border:solid_white]": 1204,
  "[.contact-page_&_input:checked::after]:[border-width:0_2px_2px_0]": 1205,
  "[.contact-page_&_input:checked::after]:[transform:translateY(-1px)_rotate(45deg)]": 1206,
  "[.contact-page_&]:[--contact-send-offset:95px]": 1207,
  "[.contact-page_&]:[width:141px]": 1209,
  "[.contact-page_&]:[height:43px]": 1210,
  "[.contact-page_&]:[border:0.5px_solid_#9eb7d0]": 1212,
  "[.contact-page_&]:[border-radius:24px]": 1213,
  "[.contact-page_&]:[background:#f7f7f780]": 1214,
  "[.contact-page_&]:[box-shadow:inset_0_0_10px_#d1e7ff50]": 1215,
  "[.contact-page_&]:[color:#27272a]!": 1216,
  "[.contact-page_&]:[transition:--contact-send-offset_400ms_ease-in-out]": 1229,
  "[.contact-page_&]:[padding-left:calc(55px_-_var(--contact-send-offset)_*_0.368421053)]": 1237,
  "[.contact-page_&]:[mask-image:radial-gradient(circle_at_calc(22.5px_+_var(--contact-send-offset))_50%,_transparent_19px,_#000_20px)]": 1239,
  "[.contact-page_&]:[top:50%]": 1241,
  "[.contact-page_&]:[left:calc(6px_+_var(--contact-send-offset))]": 1242,
  "[.contact-page_&]:[width:33px]": 1243,
  "[.contact-page_&]:[height:33px]": 1244,
  "[.contact-page_&]:[transform:translateY(-50%)]": 1245,
  "[.contact-page_&]:[background:linear-gradient(180deg,_#005eff,_#0024b8)]": 1247,
  "[.contact-page_&]:[box-shadow:inset_0_1px_3px_#8fc5ff66,_0_0_14px_#005eff99,_8px_0_24px_#005eff66]": 1248,
  "[.contact-page_&:is(:hover,_:focus-visible)]:[--contact-send-offset:0px]": 1249,
  "[.contact-page_&]:[min-height:18px]": 1250,
  "[.contact-page_&]:[text-align:center]": 1255,
  "[.contact-page_&]:[line-height:1.35]!": 1258,
  "[.contact-page_&_button:focus-visible]:[outline-offset:3px]": 1260,
  "[.contact-page_&_input:focus-visible]:[outline:2px_solid_#005eff]": 1261,
  "[.contact-page_&_input:focus-visible]:[outline-offset:3px]": 1262,
  "max-[1024px]:[.contact-page_&]:[padding-top:120px]": 1263,
  "max-[1024px]:[.contact-page_&_#contact-write-title]:[font-size:42px]!": 1264,
  "max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-left:24px]": 1265,
  "max-[1024px]:[.contact-page_&_input:not([type='file'])]:[padding-right:24px]": 1266,
  "max-[1024px]:[.contact-page_&_textarea]:[padding-left:24px]": 1267,
  "max-[1024px]:[.contact-page_&_textarea]:[padding-right:24px]": 1268,
  "max-[768px]:[.contact-page_&]:[padding-top:56px]": 1269,
  "max-[768px]:[.contact-page_&_#contact-write-title]:[margin-bottom:36px]": 1273,
  "max-[768px]:[.contact-page_&_#contact-write-title]:[font-size:clamp(30px,_8vw,_40px)]!": 1274,
  "max-[768px]:[.contact-page_&]:[gap:38px]": 1275,
  "max-[768px]:[.contact-page_&_legend]:[font-size:22px]!": 1276,
  "max-[768px]:[.contact-page_&_legend]:[margin-bottom:20px]": 1277,
  "max-[768px]:[.contact-page_&]:[gap:12px]": 1279,
  "max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-left:20px]": 1280,
  "max-[768px]:[.contact-page_&_input:not([type='file'])]:[padding-right:20px]": 1281,
  "max-[768px]:[.contact-page_&_input:not([type='file'])]:[font-size:14px]!": 1282,
  "max-[768px]:[.contact-page_&_textarea]:[padding-left:20px]": 1283,
  "max-[768px]:[.contact-page_&_textarea]:[padding-right:20px]": 1284,
  "max-[768px]:[.contact-page_&_textarea]:[font-size:14px]!": 1285,
  "max-[768px]:[.contact-page_&]:[font-size:14px]!": 1288,
  "max-[768px]:[.contact-page_&]:[font-size:13px]!": 1290,
  "motion-reduce:[.contact-page_&_input]:[transition:none]": 1292,
  "motion-reduce:[.contact-page_&_textarea]:[transition:none]": 1293,
  "max-[768px]:[.contact-page_&]:[height:860px]": 1296,
  "max-[768px]:[.contact-page_&]:[min-height:0]": 1406,
  "max-[768px]:[.contact-page_&]:[top:140px]": 1299,
  "max-[768px]:[.contact-page_&]:[left:28px]": 1300,
  "max-[768px]:[.contact-page_&]:[width:calc(100%_-_56px)]": 1301,
  "max-[768px]:[.contact-page_&]:[max-width:340px]": 1302,
  "max-[768px]:[.contact-page_&]:[font-size:clamp(24px,_6.65vw,_30px)]!": 1303,
  "max-[768px]:[.contact-page_&]:[line-height:1.04]!": 1304,
  "max-[768px]:[.contact-page_&_span]:[display:contents]!": 1305,
  "max-[768px]:[.contact-page_&_span]:[white-space:normal]": 1306,
  "max-[768px]:[.contact-page_&]:[top:250px]!": 1001307,
  "max-[768px]:[.contact-page_&]:[left:50%]!": 1001308,
  "max-[768px]:[.contact-page_&]:[width:min(160%,_640px)]!": 1001309,
  "max-[768px]:[.contact-page_&]:[transform:translateX(-59.4%)]": 1310,
  "max-[768px]:[.contact-page_&]:[clip-path:inset(0_0_28%_0)]": 1311,
  "max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_20%,_#000_100%)]": 1312,
  "max-[768px]:[.contact-page_&]:[top:325px]": 1313,
  "max-[768px]:[.contact-page_&]:[left:-80px]": 1314,
  "max-[768px]:[.contact-page_&]:[width:480px]": 1315,
  "max-[768px]:[.contact-page_&]:[height:270px]": 1316,
  "max-[768px]:[.contact-page_&]:[top:486px]": 1317,
  "max-[768px]:[.contact-page_&]:[position:absolute]": 1345,
  "max-[768px]:[.contact-page_&]:[top:510px]": 1320,
  "max-[768px]:[.contact-page_&]:[padding-top:20px]": 1322,
  "max-[768px]:[.contact-page_&]:[padding-right:28px]": 1323,
  "max-[768px]:[.contact-page_&]:[padding-bottom:0]": 1429,
  "max-[768px]:[.contact-page_&]:[padding-left:28px]": 1325,
  "max-[768px]:[.contact-page_&]:[z-index:auto]": 1326,
  "max-[768px]:[.contact-page_&]:[isolation:auto]": 1327,
  "max-[768px]:[.contact-page_&::before]:[display:none]!": 1328,
  "max-[768px]:[.contact-page_.contact-logistics_&]:[position:relative]": 1329,
  "max-[768px]:[.contact-page_.contact-logistics_&]:[z-index:4]": 1330,
  "max-[768px]:[.contact-page_&_h2]:[position:relative]": 1331,
  "max-[768px]:[.contact-page_&_h2]:[z-index:4]": 1332,
  "max-[768px]:[.contact-page_.contact-logistics_&]:[font-size:10px]!": 1333,
  "max-[768px]:[.contact-page_.contact-logistics_&]:[margin-bottom:8px]": 1334,
  "max-[768px]:[.contact-page_&_h2]:[max-width:18em]": 1335,
  "max-[768px]:[.contact-page_&_h2]:[font-size:18px]!": 1336,
  "max-[768px]:[.contact-page_&_h2]:[line-height:1.12]!": 1337,
  "max-[768px]:[.contact-page_&]:[top:570px]": 1338,
  "max-[768px]:[.contact-page_&]:[left:50%]": 1347,
  "max-[768px]:[.contact-page_&]:[right:auto]": 1341,
  "max-[768px]:[.contact-page_&]:[width:290px]": 1342,
  "max-[768px]:[.contact-page_&]:[height:290px]": 1343,
  "max-[768px]:[.contact-page_&]:[transform:translateX(-50%)]": 1356,
  "max-[768px]:[.contact-page_&]:[z-index:6]": 1346,
  "max-[768px]:[.contact-page_&]:[bottom:-104px]": 1348,
  "max-[768px]:[.contact-page_&]:[width:190px]": 1349,
  "max-[768px]:[.contact-page_&]:[max-width:190px]": 1350,
  "max-[768px]:[.contact-page_&]:[margin-top:0]": 1444,
  "max-[768px]:[.contact-page_&]:[margin-right:0]": 1445,
  "max-[768px]:[.contact-page_&]:[margin-bottom:0]": 1446,
  "max-[768px]:[.contact-page_&]:[margin-left:0]": 1447,
  "max-[768px]:[.contact-page_&]:[gap:8px]": 1463,
  "max-[768px]:[.contact-page_&]:[padding-right:14px]": 1466,
  "max-[768px]:[.contact-page_&]:[padding-left:14px]": 1468,
  "max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_#d2e6ff59,_#d2e6ff9c)]": 1361,
  "max-[768px]:[.contact-page_&_h3]:[color:#18375b]!": 1362,
  "max-[768px]:[.contact-page_&_h3]:[font-size:11px]!": 1363,
  "max-[768px]:[.contact-page_&_h3]:[margin-bottom:6px]": 1364,
  "max-[768px]:[.contact-page_&_p]:[color:#005eff]!": 1365,
  "max-[768px]:[.contact-page_&_p]:[font-size:11px]!": 1366,
  "max-[768px]:[.contact-page_&_strong]:[color:#0d5792]!": 1367,
  "max-[768px]:[.contact-page_&_h3_svg]:[width:14px]": 1368,
  "max-[768px]:[.contact-page_&_h3_svg]:[height:14px]": 1369,
  "max-[768px]:[.contact-page_&_h3_svg]:[color:#18375b]!": 1370,
  "max-[768px]:[.contact-page_&]:[color:#005eff]!": 1371,
  "max-[768px]:[.contact-page_&]:[padding-top:140px]": 1372,
  "max-[768px]:[.contact-page_&]:[padding-bottom:50px]": 1373,
  "max-[768px]:[.contact-page_&]:[gap:26px]": 1374,
  "max-[768px]:[.contact-page_&]:[display:contents]!": 1375,
  "max-[768px]:[.contact-page_.contact-headquarters_>_&]:[order:2]": 1376,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[order:1]": 1377,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[aspect-ratio:4_/_3]": 1378,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[margin-bottom:56px]": 1379,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[overflow:visible]": 1380,
  "max-[768px]:[.contact-page_.contact-headquarters_&_img]:[border-radius:inherit]": 1381,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[top:calc(100%_+_14px)]": 1382,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[left:50%]": 1383,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[right:auto]": 1384,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[transform:translateX(-50%)]": 1385,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[min-height:36px]": 1386,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-top:8px]": 1387,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-right:14px]": 1388,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-bottom:8px]": 1389,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[padding-left:14px]": 1390,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[border-color:#f7f7f7b3]": 1391,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[background:linear-gradient(90deg,_#ffffff40,_#7db7ff66)]": 1392,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[color:#f7f7f7]!": 1393,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[order:3]": 1394,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[margin-top:0]": 1395,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[flex-wrap:nowrap]": 1396,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[align-items:flex-end]": 1397,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:8px]": 1398,
  "max-[768px]:[.contact-page_.contact-headquarters_&_>_p:last-child]:[font-size:12px]!": 1399,
  "max-[768px]:[.contact-page_.contact-headquarters_&_>_p:last-child]:[line-height:1.12]!": 1400,
  "max-[768px]:[.contact-page_.contact-headquarters_&]:[gap:6px]": 1401,
  "max-[768px]:[.contact-page_.contact-headquarters_&_a]:[width:28px]": 1402,
  "max-[768px]:[.contact-page_.contact-headquarters_&_a]:[height:32px]": 1403,
  "max-[768px]:[.contact-page_.contact-headquarters_&_svg]:[width:24px]": 1404,
  "max-[768px]:[.contact-page_.contact-headquarters_&_svg]:[height:24px]": 1405,
  "max-[768px]:[.contact-page_&]:[margin-top:24px]": 1407,
  "max-[768px]:[.contact-page_&]:[padding-top:190px]": 1408,
  "max-[768px]:[.contact-page_&]:[top:-25px]": 1410,
  "max-[768px]:[.contact-page_&]:[left:-5%]": 1412,
  "max-[768px]:[.contact-page_&]:[width:110%]": 1413,
  "max-[768px]:[.contact-page_&]:[display:none]!": 1414,
  "max-[768px]:[.contact-page_&]:[grid-template-columns:minmax(100px,_0.8fr)_minmax(0,_1.2fr)]": 1415,
  "max-[768px]:[.contact-page_&_dd]:[font-size:11px]!": 1417,
  "max-[768px]:[.contact-page_.contact-office-communication_&]:[font-size:18px]!": 1418,
  "max-[768px]:[.contact-page_.contact-office-content_&]:[flex-wrap:nowrap]": 1419,
  "max-[768px]:[.contact-page_.contact-office-content_&]:[align-items:flex-end]": 1420,
  "max-[768px]:[.contact-page_.contact-office-content_&]:[gap:8px]": 1421,
  "max-[768px]:[.contact-page_.contact-office-content_&_>_p:last-child]:[font-size:12px]!": 1422,
  "max-[768px]:[.contact-page_.contact-office-content_&_a]:[width:28px]": 1423,
  "max-[768px]:[.contact-page_.contact-office-content_&_a]:[height:32px]": 1424,
  "max-[768px]:[.contact-page_.contact-office-content_&_svg]:[width:24px]": 1425,
  "max-[768px]:[.contact-page_.contact-office-content_&_svg]:[height:24px]": 1426,
  "max-[768px]:[.contact-page_&]:[padding-top:44px]": 1427,
  "max-[768px]:[.contact-page_&_h2]:[margin-bottom:26px]": 1431,
  "max-[768px]:[.contact-page_&_h2]:[font-size:clamp(27px,_7.5vw,_34px)]!": 1432,
  "max-[768px]:[.contact-page_&]:[gap:24px]": 1433,
  "max-[768px]:[.contact-page_&]:[font-size:21px]!": 1434,
  "max-[768px]:[.contact-page_&_button]:[font-size:15px]!": 1435,
  "max-[768px]:[.contact-page_&_button]:[font-weight:410]!": 1436,
  "max-[768px]:[.contact-page_&_button]:[font-variation-settings:'wght'_410,_'wdth'_125]!": 1437,
  "max-[768px]:[.contact-page_&_button]:[line-height:1]!": 1438,
  "max-[768px]:[.contact-page_&_button]:[letter-spacing:-0.04em]": 1439,
  "max-[768px]:[.contact-page_&_button]:[color:#fff]!": 1440,
  "max-[768px]:[.contact-page_&_button]:[padding-left:7px]": 1441,
  "max-[768px]:[.contact-page_&_button]:[padding-right:7px]": 1442,
  "max-[768px]:[.contact-page_&]:[height:816px]": 1443,
  "max-[768px]:[.contact-page_&]:[overflow:hidden]": 1448,
  "max-[768px]:[.contact-page_&]:[border:0]": 1449,
  "max-[768px]:[.contact-page_&]:[border-radius:0]": 1490,
  "max-[768px]:[.contact-page_&]:[background:transparent]": 1451,
  "max-[768px]:[.contact-page_&]:[box-shadow:none]": 1452,
  "max-[768px]:[.contact-page_&]:[backdrop-filter:none]": 1453,
  "max-[768px]:[.contact-page_&]:[height:100%]": 1454,
  "max-[768px]:[.contact-page_&]:[padding-right:0]": 1456,
  "max-[768px]:[.contact-page_&]:[padding-bottom:var(--sales-trailing-space,_728px)]": 1457,
  "max-[768px]:[.contact-page_&]:[padding-left:0]": 1458,
  "max-[768px]:[.contact-page_&]:[overflow-y:auto]": 1459,
  "max-[768px]:[.contact-page_&]:[overflow-x:hidden]": 1460,
  "max-[768px]:[.contact-page_&]:[scrollbar-gutter:auto]": 1461,
  "max-[768px]:[.contact-page_&]:[min-height:88px]": 1464,
  "max-[768px]:[.contact-page_&]:[gap:7px]": 1469,
  "max-[768px]:[.contact-page_&_h3]:[font-size:20px]!": 1470,
  "max-[768px]:[.contact-page_&_h3]:[font-weight:410]!": 1471,
  "max-[768px]:[.contact-page_&_h3]:[font-variation-settings:'wght'_410,_'wdth'_125]!": 1472,
  "max-[768px]:[.contact-page_&_h3]:[line-height:1.07]!": 1473,
  "max-[768px]:[.contact-page_&_h3]:[letter-spacing:-0.04em]": 1474,
  "max-[768px]:[.contact-page_&_p]:[font-size:9px]!": 1475,
  "max-[768px]:[.contact-page_&_p]:[font-weight:410]!": 1476,
  "max-[768px]:[.contact-page_&_p]:[line-height:1.12]!": 1477,
  "max-[768px]:[.contact-page_&_p]:[letter-spacing:-0.04em]": 1478,
  "max-[768px]:[.contact-page_&_p]:[color:#fff]!": 1479,
  "max-[768px]:[.contact-page_&_a]:[font-size:12px]!": 1480,
  "max-[768px]:[.contact-page_&_a]:[font-weight:410]!": 1481,
  "max-[768px]:[.contact-page_&_a]:[line-height:1.12]!": 1482,
  "max-[768px]:[.contact-page_&_a]:[letter-spacing:-0.04em]": 1483,
  "max-[768px]:[.contact-page_&_a]:[color:#fff]!": 1484,
  "max-[768px]:[.contact-page_&]:[display:block]!": 1485,
  "max-[768px]:[.contact-page_&]:[left:0]": 1487,
  "max-[768px]:[.contact-page_&]:[right:0]": 1488,
  "max-[768px]:[.contact-page_&]:[height:160px]": 1489,
  "max-[768px]:[.contact-page_&]:[background:linear-gradient(180deg,_transparent,_#02111f20)]": 1491,
  "max-[768px]:[.contact-page_&]:[backdrop-filter:blur(4px)]": 1492,
  "max-[768px]:[.contact-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_40%)]": 1493,
  "max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(3)]:[order:4]": 1494,
  "max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(4)]:[order:3]": 1495,
  "max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(1)]:[order:1]": 1496,
  "max-[768px]:[.contact-page_.contact-write-form_>_fieldset:first-child_&_>_label:nth-child(2)]:[order:2]": 1497,
  "max-[360px]:[.contact-page_&_button]:[font-size:13px]!": 1498,
  "max-[360px]:[.contact-page_&_button]:[padding-left:5px]": 1499,
  "max-[360px]:[.contact-page_&_button]:[padding-right:5px]": 1500,
  "max-[360px]:[.contact-page_&_button]:[gap:6px]": 1501,
  "max-[360px]:[.contact-page_&]:[gap:4px]": 1502,
  "max-[360px]:[.contact-page_&]:[font-size:9px]!": 1503,
  "max-[360px]:[.contact-page_&_img]:[width:18px]": 1504,
  "max-[360px]:[.contact-page_&_img]:[height:18px]": 1505,
};
function twContactPage(value: string | undefined): string {
  const names = (value ?? "").split(/\s+/).filter(Boolean);
  const selected = new Map<string, string>();
  for (const name of names)
    for (const token of (twContactPageRules[name] ?? "")
      .split(" ")
      .filter(Boolean)) {
      const matches = [...token.matchAll(/\[([\w-]+):/g)];
      const match = matches[matches.length - 1];
      const key = match
        ? token.slice(0, match.index) + "|" + match[1]
        : token.replace(/animate-[\w-]+!?$/, "animation");
      const old = selected.get(key);
      if (
        !old ||
        (twContactPagePriority[token] ?? 0) >= (twContactPagePriority[old] ?? 0)
      )
        selected.set(key, token);
    }
  return [...names, ...selected.values()].join(" ");
}
