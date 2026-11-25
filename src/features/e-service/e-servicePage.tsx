"use client";

import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";

import UncompromisingPerformance from "@/components/UncompromissingPerformence/UncompromisingPerformance";

import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";

// ============================================================

// FRAMER MOTION

// ============================================================

type Direction = "up" | "left" | "right";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function reveal(
  direction: Direction = "up",

  delay = 0,

  reduced = false,

  once = false,
) {
  return {
    initial: reduced
      ? (false as const)
      : {
          opacity: 0,

          x: direction === "left" ? -36 : direction === "right" ? 36 : 0,

          y: direction === "up" ? 35 : 12,

          filter: "blur(6px)",
        },

    whileInView: {
      opacity: 1,

      x: 0,

      y: 0,

      filter: "blur(0px)",
    },

    viewport: {
      once,

      amount: 0.16,

      margin: "0px 0px -7% 0px",
    },

    transition: {
      duration: reduced ? 0 : 0.9,

      delay: reduced ? 0 : delay,

      ease,
    },
  };
}

// Sayfa yüklenince çalışan giriş animasyonu.

// Scroll veya görünürlük kontrolü kullanılmaz.

function revealOnLoad(delay = 0, reduced = false) {
  return {
    initial: reduced
      ? (false as const)
      : {
          opacity: 0,

          y: 30,

          filter: "blur(6px)",
        },

    animate: {
      opacity: 1,

      y: 0,

      filter: "blur(0px)",
    },

    transition: {
      duration: reduced ? 0 : 0.9,

      delay: reduced ? 0 : delay,

      ease,
    },
  };
}

// ============================================================

// FEATURES

// ============================================================

const FEATURES = [
  {
    id: "cloud",

    icon: "/e-service/cloud.webp",

    title: "Sempa Cloud Platform",

    description: "Centralized ticket processing and live status tracking.",
  },

  {
    id: "serial",

    icon: "/e-service/qr.webp",

    title: "Product Serial ID",

    description:
      "Instant access to warranty, hydraulic curve and history by serial number.",
  },

  {
    id: "parts",

    icon: "/e-service/shield.webp",

    title: "Original Spare Parts",

    description:
      "100% genuine factory-certified impellers, shafts and mechanical seals.",
  },

  {
    id: "network",

    icon: "/e-service/tool.webp",

    title: "Certified Service Network",

    description:
      "Rigorously scored, trained and audited technical service teams.",
  },
];

// ============================================================

// ABOUT US-STYLE HERO TITLE REVEAL

// ============================================================

const serviceHeroTitleVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.22, staggerChildren: 0.17 },
  },
};

const serviceHeroLineVariants: Variants = {
  hidden: { opacity: 0, y: "110%", filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: { duration: 1.05, ease },
  },
};

function ServiceSignalTitle({ reduced }: { reduced: boolean }) {
  const lines = ["What is Sempa", "e-service Team?"];

  return (
    <motion.h2
      aria-label={lines.join(" ")}
      className="signal-heading"
      variants={serviceHeroTitleVariants}
      initial={reduced ? false : "hidden"}
      animate="visible"
    >
      {lines.map((line) => (
        <span
          key={line}
          aria-hidden="true"
          className="signal-line -mb-[0.08em] overflow-hidden pb-[0.08em]"
        >
          <motion.span
            variants={serviceHeroLineVariants}
            className="block will-change-transform"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

// ============================================================

// FEATURE CARD

// ============================================================

function FeatureCard({
  feature,

  index,
}: {
  feature: (typeof FEATURES)[number];

  index: number;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.article
      {...reveal(index % 2 ? "right" : "up", index * 0.075, reduced)}
      className="feature-card"
    >
      <span className="feature-icon" aria-hidden="true">
        <Image
          src={feature.icon}
          width={36}
          height={36}
          alt=""
          className="object-contain"
        />
      </span>

      <h3>{feature.title}</h3>

      <p>{feature.description}</p>
    </motion.article>
  );
}

// ============================================================

// HERO

// ============================================================

function EServiceHero() {
  const reduced = useReducedMotion() ?? false;

  const [imageUnavailable, setImageUnavailable] = useState(false);

  const track = useRef<HTMLDivElement>(null);

  const drag = useRef<{
    x: number;

    scroll: number;
  } | null>(null);

  function move(direction: number) {
    const element = track.current;

    const card = element?.firstElementChild;

    if (!element || !card) return;

    const gap = Number.parseFloat(getComputedStyle(element).gap) || 0;

    element.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),

      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <section className="service-hero" aria-labelledby="service-page-heading">
      <div className="hero-background" aria-hidden="true">
        {!imageUnavailable && (
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/e-service/e-service%20hero.webp"
            />

            <Image
              src="/e-service/e-service%20hero.webp"
              fill
              preload
              sizes="100vw"
              alt=""
              onError={() => setImageUnavailable(true)}
              className="hero-background-image"
            />
          </picture>
        )}
      </div>

      <motion.h1
        {...revealOnLoad(0.04, reduced)}
        id="service-page-heading"
        className="service-page-title"
      >
        E-Service
      </motion.h1>

      <div className="service-inner">
        <div className="hero-introduction">
          <ServiceSignalTitle reduced={reduced} />

          <motion.p {...revealOnLoad(0.62, reduced)}>
            Your digital gateway to uninterrupted performance. The Sempa
            e-service Team provides rapid online technical support, remote
            troubleshooting, and expert guidance to keep your critical systems
            running smoothly worldwide.
          </motion.p>
        </div>

        <div
          ref={track}
          className="feature-track"
          role="region"
          aria-label="E-Service benefits"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

            event.preventDefault();

            move(event.key === "ArrowRight" ? 1 : -1);
          }}
          onPointerDown={(event) => {
            const element = event.currentTarget;

            if (
              event.pointerType !== "mouse" ||
              event.button !== 0 ||
              element.scrollWidth <= element.clientWidth
            )
              return;

            drag.current = {
              x: event.clientX,

              scroll: element.scrollLeft,
            };

            element.dataset.dragging = "true";

            element.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (drag.current) {
              event.currentTarget.scrollLeft =
                drag.current.scroll - (event.clientX - drag.current.x);
            }
          }}
          onPointerUp={(event) => {
            drag.current = null;

            delete event.currentTarget.dataset.dragging;
          }}
          onPointerCancel={(event) => {
            drag.current = null;

            delete event.currentTarget.dataset.dragging;
          }}
          onLostPointerCapture={(event) => {
            drag.current = null;

            delete event.currentTarget.dataset.dragging;
          }}
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        <nav
          className="feature-navigation"
          aria-label="Browse E-Service benefits"
        >
          <button
            type="button"
            aria-label="Previous benefit"
            onClick={() => move(-1)}
          >
            <FiChevronLeft />
          </button>

          <button
            type="button"
            aria-label="Next benefit"
            onClick={() => move(1)}
          >
            <FiChevronRight />
          </button>
        </nav>
      </div>
    </section>
  );
}

// ============================================================

// FORM DATA

// ============================================================

type Tab = "request" | "network";

type Values = {
  expertise: string;

  serial: string;

  requestType: string;

  location: string;

  contact: string;

  company: string;

  phone: string;

  details: string;
};

const FORM_COPY = {
  request: {
    expertiseLabel: "Pump Model / Type",

    expertisePlaceholder: "Örn: TKF-K 100-250, ARS veya Dikey Milli",

    serialLabel: "Serial Number (If available)",

    serialPlaceholder: "Örn: 2024-88421 veya etiket no",

    typeLabel: "Request Type",

    options: [
      "Breakdown & Urgent Repair",

      "Maintenance Request",

      "Spare Parts Request",

      "Technical Support",

      "Installation & Commissioning",

      "Other",
    ],

    locationLabel: "City / Plant Location",

    locationPlaceholder: "Örn: Konya, İstanbul, İzmir veya Ülke",

    detailsLabel: "Issue / Request Details",

    detailsPlaceholder:
      "Describe the issue (vibration, pressure drop, leak, or required part details).",

    notice: "For critical emergencies, call our hotline directly:",
  },

  network: {
    expertiseLabel: "Service Expertise / Specialization",

    expertisePlaceholder: "Örn: Pompa bakımı, mekanik onarım veya devreye alma",

    serialLabel: "Certification / Registration No (If available)",

    serialPlaceholder: "Örn: Servis sertifikası veya firma kayıt numarası",

    typeLabel: "Application Type",

    options: [
      "Authorized Service Partnership",

      "Maintenance & Repair Partner",

      "Installation & Commissioning Partner",

      "Spare Parts Partner",

      "Technical Support Partner",

      "Other",
    ],

    locationLabel: "Service Region / City",

    locationPlaceholder: "Örn: Konya, İstanbul, İzmir veya hizmet bölgeniz",

    detailsLabel: "Service Network Application Details",

    detailsPlaceholder:
      "Describe your technical experience, team, facilities and service coverage.",

    notice: "For service network enquiries, call our team directly:",
  },
};

function emptyValues(tab: Tab): Values {
  return {
    expertise: "",

    serial: "",

    requestType: FORM_COPY[tab].options[0],

    location: "",

    contact: "",

    company: "",

    phone: "",

    details: "",
  };
}

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length > 10) {
    digits = digits.slice(2);
  }

  if (digits.length === 10 && !digits.startsWith("0")) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 11);

  return [
    digits.slice(0, 4),

    digits.slice(4, 7),

    digits.slice(7, 9),

    digits.slice(9, 11),
  ]

    .filter(Boolean)

    .join(" ");
}

// ============================================================

// FORM TABS

// ============================================================

function RequestTabs({
  activeTab,

  onSelect,
}: {
  activeTab: Tab;

  onSelect: (value: Tab) => void;
}) {
  const reduced = useReducedMotion() ?? false;

  const tabs: {
    id: Tab;

    label: string;

    icon: string;
  }[] = [
    {
      id: "request",

      label: "Quick Service Request",

      icon: "/e-service/arrow.webp",
    },

    {
      id: "network",

      label: "Join Service Network",

      icon: "/e-service/puzzle.webp",
    },
  ];

  return (
    <motion.div
      {...reveal("up", 0, reduced, true)}
      role="tablist"
      aria-label="Service forms"
      className="request-tabs"
    >
      {tabs.map((tab, index) => (
        <button
          type="button"
          role="tab"
          key={tab.id}
          id={`service-tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls="service-form-panel"
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onSelect(tab.id)}
          onKeyDown={(event) => {
            if (
              ![
                "ArrowLeft",

                "ArrowRight",

                "ArrowUp",

                "ArrowDown",

                "Home",

                "End",
              ].includes(event.key)
            )
              return;

            event.preventDefault();

            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? 1
                  : (index + 1) % 2;

            onSelect(tabs[next].id);

            document.getElementById(`service-tab-${tabs[next].id}`)?.focus();
          }}
        >
          <Image
            src={tab.icon}
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
          />

          <span>{tab.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ============================================================

// CUSTOM SELECT

// ============================================================

function ServiceSelect({
  id,

  name,

  value,

  options,

  onChange,
}: {
  id: string;

  name: keyof Values;

  value: string;

  options: string[];

  onChange: (name: keyof Values, value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const [highlighted, setHighlighted] = useState(0);

  const root = useRef<HTMLDivElement>(null);

  const menu = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;

    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", dismiss);

    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  useEffect(() => {
    if (open) {
      menu.current?.querySelector('[data-highlighted="true"]')?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [open, highlighted]);

  const choose = (index: number) => {
    if (!options[index]) return;

    onChange(name, options[index]);

    setOpen(false);
  };

  return (
    <div
      ref={root}
      className={`service-select ${open ? "is-open" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <input type="hidden" name={name} value={value} />

      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        onClick={() => {
          setHighlighted(Math.max(0, options.indexOf(value)));

          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();

            setOpen(false);

            return;
          }

          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();

            const current = open
              ? highlighted
              : Math.max(0, options.indexOf(value));

            setHighlighted(
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? options.length - 1
                  : Math.max(
                      0,

                      Math.min(
                        options.length - 1,

                        current + (event.key === "ArrowDown" ? 1 : -1),
                      ),
                    ),
            );

            setOpen(true);
          } else if ((event.key === "Enter" || event.key === " ") && open) {
            event.preventDefault();

            choose(highlighted);
          } else if (event.key.length === 1 && event.key !== " ") {
            const index = options.findIndex((option) =>
              option.toLowerCase().startsWith(event.key.toLowerCase()),
            );

            if (index >= 0) {
              event.preventDefault();

              setHighlighted(index);

              setOpen(true);
            }
          }
        }}
      >
        <span>{value}</span>

        <FiChevronDown aria-hidden="true" />
      </button>

      {open && (
        <ul
          ref={menu}
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={value === option}
              data-highlighted={highlighted === index}
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => setHighlighted(index)}
              onClick={() => choose(index)}
            >
              <span>{option}</span>

              {value === option && <FiCheck aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================

// FORM FIELD

// ============================================================

type FieldProps = {
  name: keyof Values;

  label: string;

  value: string;

  onChange: (name: keyof Values, value: string) => void;

  placeholder?: string;

  required?: boolean;

  options?: string[];

  type?: "text" | "tel";

  search?: boolean;

  multiline?: boolean;

  autoComplete?: string;
};

function FormField({
  name,

  label,

  value,

  onChange,

  placeholder,

  required,

  options,

  type = "text",

  search,

  multiline,

  autoComplete,
}: FieldProps) {
  const id = `service-field-${name}`;

  return (
    <div className="service-field">
      <label htmlFor={id} id={`${id}-label`}>
        {label}

        {required && <span className="required"> *</span>}
      </label>

      <div className={`service-control ${search ? "has-search" : ""}`}>
        {search && <FiSearch className="search-icon" aria-hidden="true" />}

        {options ? (
          <ServiceSelect
            id={id}
            name={name}
            value={value}
            options={options}
            onChange={onChange}
          />
        ) : multiline ? (
          <textarea
            id={id}
            name={name}
            required={required}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(name, event.target.value)}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={type === "tel" ? "tel" : undefined}
            pattern={
              type === "tel"
                ? "0[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
                : undefined
            }
            title={
              type === "tel"
                ? "Telefon numarasını 05XX XXX XX XX formatında giriniz."
                : undefined
            }
            onChange={(event) =>
              onChange(
                name,

                type === "tel"
                  ? formatPhone(event.target.value)
                  : event.target.value,
              )
            }
          />
        )}
      </div>
    </div>
  );
}

// ============================================================

// SEND BUTTON

// ============================================================

function SendButton() {
  return (
    <button type="submit" className="send-button">
      <span className="send-label">Send</span>

      <span className="send-orb" aria-hidden="true">
        <FiArrowUpRight strokeWidth={3.2} />
      </span>
    </button>
  );
}

// ============================================================

// REQUEST SECTION

// ============================================================

function EServiceRequestSection() {
  const reduced = useReducedMotion() ?? false;

  const [activeTab, setActiveTab] = useState<Tab>("request");

  const [forms, setForms] = useState<Record<Tab, Values>>(() => ({
    request: emptyValues("request"),

    network: emptyValues("network"),
  }));

  const [feedback, setFeedback] = useState("");

  const copy = FORM_COPY[activeTab];

  const values = forms[activeTab];

  const update = (name: keyof Values, value: string) => {
    setForms((previous) => ({
      ...previous,

      [activeTab]: {
        ...previous[activeTab],

        [name]: value,
      },
    }));

    setFeedback("");
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    // Backend henüz bağlı değil.

    // Gerçek e-posta veya API isteği yapılmaz.

    setFeedback("Form gönderimi henüz aktif değil. Bilgileriniz gönderilmedi.");
  }

  return (
    <section
      className="request-section"
      aria-label="Service request and network application"
    >
      <div className="request-inner">
        <RequestTabs
          activeTab={activeTab}
          onSelect={(tab) => {
            setActiveTab(tab);

            setFeedback("");
          }}
        />

        <div
          id="service-form-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${activeTab}`}
        >
          <form className="request-form" noValidate onSubmit={submit}>
            <motion.div
              {...reveal("left", 0.04, reduced, true)}
              className="form-row two"
            >
              <FormField
                name="expertise"
                label={copy.expertiseLabel}
                placeholder={copy.expertisePlaceholder}
                required
                value={values.expertise}
                onChange={update}
              />

              <FormField
                name="serial"
                label={copy.serialLabel}
                placeholder={copy.serialPlaceholder}
                search
                value={values.serial}
                onChange={update}
              />
            </motion.div>

            <motion.div
              {...reveal("right", 0.06, reduced, true)}
              className="form-row two"
            >
              <FormField
                name="requestType"
                label={copy.typeLabel}
                options={copy.options}
                required
                value={values.requestType}
                onChange={update}
              />

              <FormField
                name="location"
                label={copy.locationLabel}
                placeholder={copy.locationPlaceholder}
                required
                value={values.location}
                onChange={update}
              />
            </motion.div>

            <motion.div
              {...reveal("up", 0.06, reduced, true)}
              className="form-row three"
            >
              <FormField
                name="contact"
                label="Contact Person"
                placeholder="Adınız Soyadınız"
                autoComplete="name"
                required
                value={values.contact}
                onChange={update}
              />

              <FormField
                name="company"
                label="Company Name"
                placeholder="Örn: XYZ Sanayi A.Ş."
                autoComplete="organization"
                value={values.company}
                onChange={update}
              />

              <FormField
                name="phone"
                label="Phone Number"
                placeholder="05XX XXX XX XX"
                autoComplete="tel-national"
                type="tel"
                required
                value={values.phone}
                onChange={update}
              />
            </motion.div>

            <motion.div
              {...reveal("up", 0.03, reduced, true)}
              className="form-row"
            >
              <FormField
                name="details"
                label={copy.detailsLabel}
                placeholder={copy.detailsPlaceholder}
                multiline
                required
                value={values.details}
                onChange={update}
              />
            </motion.div>

            <motion.div
              {...reveal("up", 0.02, reduced, true)}
              className="form-footer"
            >
              <p>
                <FiAlertTriangle aria-hidden="true" />

                <span>
                  {copy.notice} <a href="tel:4446413">444 6 413.</a>
                </span>
              </p>

              <SendButton />
            </motion.div>

            <p
              className="form-feedback"
              role="status"
              aria-live="polite"
              lang="tr"
            >
              {feedback}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ============================================================

// CLOSING TEXT MOTION

// ============================================================

function ClosingTextMotion() {
  const root = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const scope = root.current;

    if (!scope || reduced) return;

    const headings = Array.from(
      scope.querySelectorAll<HTMLElement>(".uncompromising-stage h2"),
    );

    const copy = Array.from(
      scope.querySelectorAll<HTMLElement>(".uncompromising-glass p"),
    );

    const targets = [...headings, ...copy];

    const controls = new Map<HTMLElement, ReturnType<typeof animate>>();
    let readyToReplay = true;

    // Never leave the heading or glass copy in an invisible state.
    const showImmediately = () => {
      controls.forEach((control) => control.stop());
      controls.clear();
      targets.forEach((element) => {
        element.style.opacity = "1";
        element.style.filter = "blur(0px)";
        if (headings.includes(element)) element.style.translate = "0px 0px";
      });
    };

    const play = () => {
      showImmediately();
      targets.forEach((element) => {
        const isHeading = headings.includes(element);
        controls.set(
          element,
          animate(
            element,
            {
              opacity: [0, 1],
              filter: ["blur(7px)", "blur(0px)"],
              ...(isHeading ? { translate: ["0px 54px", "0px 0px"] } : {}),
            },
            {
              duration: isHeading ? 1.15 : 0.95,
              delay: isHeading ? 0.03 : 0.16,
              ease,
            },
          ),
        );
      });
    };

    // Use the stationary wrapper for observation, not the animated text.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.14 && readyToReplay) {
          readyToReplay = false;
          play();
        } else if (entry.intersectionRatio <= 0.02 && !readyToReplay) {
          readyToReplay = true;
          showImmediately();
        }
      },
      { threshold: [0, 0.02, 0.14], rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(scope);

    return () => {
      observer.disconnect();

      showImmediately();

      targets.forEach((element) => {
        element.style.removeProperty("opacity");

        element.style.removeProperty("filter");

        element.style.removeProperty("translate");
      });
    };
  }, [reduced]);

  return (
    <div ref={root}>
      <UncompromisingPerformance
        wideDescription
        titleLines={["if we stop,", "life stops!"]}
        description={
          "Water is the lifeblood of the world, and our pumps are its beating heart.\nWe ensure uninterrupted flow for cities, industries, and critical systems 24/7."
        }
      />
    </div>
  );
}

function NewsletterReveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div {...reveal("up", 0, reduced, true)}>{children}</motion.div>
  );
}

// ============================================================

// MAIN PAGE

// ============================================================

export default function EServicePage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;

    const header = document.querySelector<HTMLElement>(".site-header");

    if (!page || !header) return;

    const sync = () => {
      const inFlow = !["fixed", "absolute"].includes(
        getComputedStyle(header).position,
      );

      page.style.setProperty(
        "--service-header-offset",

        inFlow ? `${header.getBoundingClientRect().height}px` : "0px",
      );
    };

    sync();

    const observer = new ResizeObserver(sync);

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="e-service-page">
      <style>{serviceStyles}</style>

      <EServiceHero />

      <EServiceRequestSection />

      <div className="service-closing">
        <ClosingTextMotion />

        <NewsletterReveal>
          <NewsletterSubscription requireValidInput scaled />
        </NewsletterReveal>
      </div>
    </main>
  );
}

// ============================================================

// PAGE STYLES

// ============================================================

const serviceStyles = `

.e-service-page {

  --unit: clamp(0.833333px, 0.0694444444vw, 1.777778px);

  --service-header-offset: 97px;

  position: relative;

  width: 100%;

  margin-top: calc(-1 * var(--service-header-offset));

  background: linear-gradient(

    180deg,

    #d5eaf8 0%,

    #d5eaf8 32%,

    #dceefa 53%,

    #e7f4fc 78%,

    #e8f4fb 100%

  );

  font-family: var(--font-sf-pro), sans-serif;

  font-weight: 410;

  font-stretch: 125%;

  font-variation-settings: 'wght' 410, 'wdth' 125;

  color: #27272a;

}



.e-service-page * {

  box-sizing: border-box;

}



.e-service-page .service-hero {

  position: relative;

  isolation: isolate;

  padding: calc(455 * var(--unit)) 24px calc(80 * var(--unit));

}



.e-service-page .hero-background {

  position: absolute;

  inset: 0 0 auto;

  z-index: -1;

  height: calc(966 * var(--unit));

  background: #061521;

  overflow: hidden;

  pointer-events: none;

  -webkit-mask-image: linear-gradient(

    to bottom,

    #000 0%,

    #000 58%,

    rgba(0,0,0,.92) 72%,

    transparent 100%

  );

  mask-image: linear-gradient(

    to bottom,

    #000 0%,

    #000 58%,

    rgba(0,0,0,.92) 72%,

    transparent 100%

  );

}



.e-service-page .hero-background-image {

  object-fit: cover;

  object-position: center;

}



.e-service-page .service-page-title {

  position: absolute;

  top: calc(182 * var(--unit));

  left: calc(120 * var(--unit));

  margin: 0;

  font-size: calc(36 * var(--unit));

  font-weight: 410;

  line-height: 1;

  color: #9eb7d0;

}



.e-service-page .service-inner {

  width: 100%;

  max-width: calc(1200 * var(--unit));

  margin-inline: auto;

}



.e-service-page .hero-introduction {

  position: relative;

  top: calc(-28 * var(--unit));

  letter-spacing: -.04em;

}



.e-service-page .signal-heading {

  margin: 0;

  font-size: calc(50 * var(--unit));

  font-weight: 410;

  line-height: 1;

  color: #f7f7f7;

}



.e-service-page .signal-line {

  position: relative;

  display: block;

  width: fit-content;

  max-width: 100%;

}



.e-service-page .hero-introduction > p {

  width: calc(869 * var(--unit));

  max-width: 100%;

  margin: calc(28 * var(--unit)) 0 0;

  font-weight: 360;

  font-size: calc(20 * var(--unit));

  line-height: 1.2;

  color: #9eb7d0;

}



.e-service-page .feature-track {

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: calc(20 * var(--unit));

  margin-top: calc(48 * var(--unit));

}



.e-service-page .feature-track:focus-visible {

  outline: 2px solid #005eff;

  outline-offset: 4px;

}



.e-service-page .feature-card {

  min-width: 0;

  min-height: calc(233 * var(--unit));

  padding: calc(24 * var(--unit));

  border: 1px solid #fff;

  border-radius: calc(16 * var(--unit));

  background: #ffffff26;

  box-shadow: 0 2px 8px #00000008;

  backdrop-filter: blur(30px);

  -webkit-backdrop-filter: blur(30px);

  letter-spacing: -.04em;

}



.e-service-page .feature-icon {

  display: grid;

  place-items: center;

  width: calc(48 * var(--unit));

  height: calc(48 * var(--unit));

  border: 1px solid #cbeedc;

  border-radius: calc(12 * var(--unit));

  background: #eefaf4;

}



.e-service-page .feature-icon img {

  width: 55%;

  height: 55%;

}



.e-service-page .feature-card h3 {

  margin: calc(24 * var(--unit)) 0 0;

  font-size: calc(15 * var(--unit));

  font-weight: 540;

  line-height: 1.12;

  color: #0d5792;

}



.e-service-page .feature-card p {

  margin: calc(12 * var(--unit)) 0 0;

  font-size: calc(12 * var(--unit));

  line-height: 1.12;

}



.e-service-page .feature-navigation {

  display: none;

}



/* FORM */



.e-service-page .request-section {

  padding: 0 24px calc(80 * var(--unit));

  letter-spacing: -.04em;

}



.e-service-page .request-inner {

  width: 100%;

  max-width: calc(1201 * var(--unit));

  margin: auto;

}



.e-service-page .request-tabs {

  display: flex;

  gap: calc(32 * var(--unit));

  border-bottom: 1px solid #9eb7d066;

}



.e-service-page .request-tabs button {

  display: flex;

  align-items: center;

  gap: calc(10 * var(--unit));

  margin-bottom: -1px;

  padding: calc(16 * var(--unit)) calc(4 * var(--unit));

  border: 0;

  border-bottom: 2px solid transparent;

  background: transparent;

  color: #64748b;

  cursor: pointer;

  font: inherit;

  font-weight: 540;

  font-size: calc(12 * var(--unit));

  line-height: 1.12;

}



.e-service-page .request-tabs button img {

  flex-shrink: 0;

  object-fit: contain;

  width: calc(18 * var(--unit));

  height: calc(18 * var(--unit));

}



.e-service-page .request-tabs button[aria-selected='true'] {

  color: #0f172a;

  border-bottom-color: #005eff;

}



.e-service-page button:focus-visible {

  outline: 2px solid #005eff;

  outline-offset: 3px;

}



.e-service-page .request-form {

  display: grid;

  gap: calc(24 * var(--unit));

  padding-top: calc(30 * var(--unit));

}



.e-service-page .form-row {

  position: relative;

  z-index: 0;

  display: grid;

  gap: calc(24 * var(--unit));

  overflow: visible;

}



.e-service-page .form-row.two {

  grid-template-columns: repeat(2, minmax(0, 1fr));

}



.e-service-page .form-row.three {

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



/* Dropdown üst üste binme düzeltmesi */

.e-service-page .form-row:has(.service-select.is-open) {

  z-index: 100;

}



.e-service-page .service-field {

  min-width: 0;

}



.e-service-page .service-field > label {

  display: block;

  margin-bottom: calc(10 * var(--unit));

  color: #334155;

  font-size: calc(12 * var(--unit));

  font-weight: 540;

  line-height: 1.12;

}



.e-service-page .required {

  color: #dc2626;

}



.e-service-page .service-control {

  position: relative;

  min-width: 0;

}



.e-service-page .service-control > input,

.e-service-page .service-control > textarea {

  display: block;

  width: 100%;

  min-width: 0;

  height: calc(48 * var(--unit));

  min-height: 44px;

  padding: calc(14 * var(--unit)) calc(16 * var(--unit));

  border: 1px solid transparent;

  border-radius: calc(12 * var(--unit));

  background: #fff;

  color: #1e293b;

  font: inherit;

  font-size: calc(12 * var(--unit));

  line-height: 1.12;

  outline: none;

}



.e-service-page .service-control > input::placeholder,

.e-service-page .service-control > textarea::placeholder {

  color: #94a3b8;

  opacity: 1;

}



.e-service-page .service-control > input:focus,

.e-service-page .service-control > textarea:focus {

  border-color: #005eff;

  box-shadow: 0 0 0 2px #005eff12;

}



.e-service-page .service-control > textarea {

  height: calc(105 * var(--unit));

  resize: none;

  overflow-y: auto;

}



.e-service-page .search-icon {

  position: absolute;

  left: calc(16 * var(--unit));

  top: 50%;

  width: calc(16 * var(--unit));

  height: calc(16 * var(--unit));

  transform: translateY(-50%);

  color: #94a3b8;

  pointer-events: none;

}



/* Serial Number placeholder sağa kaydırıldı */

.e-service-page .service-control.has-search > input {

  padding-left: calc(48 * var(--unit));

}



/* CUSTOM DROPDOWN */



.e-service-page .service-select {

  position: relative;

  min-width: 0;

}



.e-service-page .service-select.is-open {

  z-index: 110;

}



.e-service-page .service-select > input[type='hidden'] {

  display: none;

}



.e-service-page .service-select > button {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  width: 100%;

  min-height: 48px;

  padding: 13px 16px;

  border: 1px solid #cbddeb;

  border-radius: 12px;

  background: linear-gradient(180deg, #fff, #f7fbff);

  box-shadow: 0 3px 10px #0d579208;

  color: #1e293b;

  font: inherit;

  font-size: clamp(13px, calc(12 * var(--unit)), 18px);

  line-height: 1.35;

  text-align: left;

  cursor: pointer;

  transition: border-color .2s, box-shadow .2s;

}



.e-service-page .service-select > button span {

  min-width: 0;

  overflow-wrap: anywhere;

}



.e-service-page .service-select > button svg {

  width: 18px;

  height: 18px;

  flex-shrink: 0;

  color: #0d5792;

  transition: transform .2s;

}



.e-service-page .service-select.is-open > button svg {

  transform: rotate(180deg);

}



.e-service-page .service-select > button:hover {

  border-color: #80afd7;

}



.e-service-page .service-select.is-open > button,

.e-service-page .service-select > button:focus-visible {

  outline: none;

  border-color: #005eff;

  box-shadow: 0 0 0 3px #005eff14;

}



.e-service-page .service-select > ul {

  position: absolute;

  z-index: 120;

  top: calc(100% + 8px);

  left: 0;

  right: 0;

  max-height: min(300px, 45svh);

  overflow-y: auto;

  margin: 0;

  padding: 6px;

  border: 1px solid #d0dfec;

  border-radius: 14px;

  background: #fbfdff;

  box-shadow: 0 14px 32px rgba(13,87,146,.18);

  list-style: none;

}



.e-service-page .service-select li {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  min-height: 44px;

  padding: 10px 12px;

  border-radius: 8px;

  color: #334155;

  font-size: clamp(13px, calc(12 * var(--unit)), 18px);

  line-height: 1.35;

  overflow-wrap: anywhere;

  cursor: pointer;

}



.e-service-page .service-select li[aria-selected='true'] {

  background: #e8f2ff;

  color: #0d5792;

}



.e-service-page .service-select li[data-highlighted='true'] {

  background: #dcecff;

  color: #005eff;

}



.e-service-page .service-select li svg {

  width: 16px;

  height: 16px;

  flex-shrink: 0;

}



/* SEND BUTTON */



.e-service-page .form-footer {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: calc(24 * var(--unit));

}



.e-service-page .form-footer > p {

  display: flex;

  align-items: center;

  gap: calc(10 * var(--unit));

  margin: 0;

  color: #9eb7d0;

  font-size: calc(12 * var(--unit));

  line-height: 1.12;

}



.e-service-page .form-footer > p svg {

  flex-shrink: 0;

  width: calc(18 * var(--unit));

  height: calc(18 * var(--unit));

  color: #005eff;

}



.e-service-page .form-footer a {

  color: #334155;

  white-space: nowrap;

}



.e-service-page .send-button {

  position: relative;

  display: flex;

  flex-shrink: 0;

  align-items: center;

  overflow: hidden;

  width: calc(141 * var(--unit));

  height: calc(43 * var(--unit));

  padding: 0;

  border: 1px solid #c8d7e5;

  border-radius: 999px;

  background: linear-gradient(180deg, #fff, #f6f9fc);

  box-shadow: 0 4px 12px #1a507e0f;

  color: #27272a;

  font: inherit;

  font-size: calc(15 * var(--unit));

  cursor: pointer;

}



.e-service-page .send-label {

  position: relative;

  z-index: 2;

  margin-left: calc(16 * var(--unit));

  white-space: nowrap;

  transition: transform 650ms cubic-bezier(.22,1,.36,1);

}



.e-service-page .send-orb {

  position: absolute;

  z-index: 3;

  left: calc(100% - 37 * var(--unit));

  top: 50%;

  transform: translateY(-50%);

  display: grid;

  place-items: center;

  width: calc(31 * var(--unit));

  height: calc(31 * var(--unit));

  border-radius: 50%;

  background: linear-gradient(135deg, #005eff, #001ea2);

  box-shadow:

    0 0 17px #005eff90,

    0 0 26px #005eff42,

    0 5px 14px #001ea247;

  transition: left 650ms cubic-bezier(.22,1,.36,1);

}



.e-service-page .send-orb svg {

  width: calc(21 * var(--unit));

  height: calc(21 * var(--unit));

  color: #fff;

  opacity: 0;

  transform: scale(.78);

  transition: opacity .35s, transform .35s;

}



.e-service-page .send-button:is(:hover,:focus-visible) .send-label {

  transform: translateX(calc(37 * var(--unit)));

}



.e-service-page .send-button:is(:hover,:focus-visible) .send-orb {

  left: calc(6 * var(--unit));

}



.e-service-page .send-button:is(:hover,:focus-visible) .send-orb svg {

  opacity: 1;

  transform: scale(1);

}



.e-service-page .form-feedback {

  min-height: calc(16 * var(--unit));

  margin: 0;

  color: #0d5792;

  font-size: calc(12 * var(--unit));

  line-height: 1.2;

}



.e-service-page .service-closing {

  padding: 0 24px calc(115 * var(--unit));

}



/* 1920px DESKTOP */



@media (min-width: 1600px) {

  .e-service-page .request-form {

    gap: 25px;

    padding-top: 25px;

  }



  .e-service-page .form-row {

    gap: 25px;

  }



  .e-service-page .service-field > label {

    margin-bottom: 9px;

    font-size: 14px;

  }



  .e-service-page .service-control > input {

    height: 54px;

    min-height: 54px;

    padding: 12px 14px;

    font-size: 14px;

    border-radius: 11px;

  }



  .e-service-page .service-control.has-search > input {

    padding-left: 54px;

  }



  .e-service-page .service-control > textarea {

    height: 112px;

    min-height: 112px;

    padding: 14px;

    font-size: 14px;

    border-radius: 11px;

  }



  .e-service-page .service-select > button {

    min-height: 54px;

    padding: 12px 14px;

    font-size: 14px;

    border-radius: 11px;

  }



  .e-service-page .service-select li {

    min-height: 42px;

    padding: 9px 12px;

    font-size: 14px;

  }



  .e-service-page .form-footer {

    gap: 20px;

  }



  .e-service-page .form-footer > p {

    font-size: 14px;

  }



  .e-service-page .send-button {

    width: 160px;

    height: 49px;

    font-size: 15px;

  }



  .e-service-page .send-label {

    margin-left: 15px;

  }



  .e-service-page .send-orb {

    width: 31px;

    height: 31px;

    left: calc(100% - 37px);

  }



  .e-service-page .send-button:is(:hover,:focus-visible) .send-orb {

    left: 6px;

  }



  .e-service-page .send-button:is(:hover,:focus-visible) .send-label {

    transform: translateX(33px);

  }



  .e-service-page .request-tabs button {

    padding-top: 15px;

    padding-bottom: 15px;

    font-size: 15px;

  }



  .e-service-page .request-tabs button img {

    width: 19px;

    height: 19px;

  }

}



/* TABLET */



@media (max-width: 1200px) {

  .e-service-page {

    --unit: 1px;

  }



  .e-service-page .service-hero {

    padding-top: 440px;

  }



  .e-service-page .hero-background {

    height: 880px;

  }



  .e-service-page .hero-background-image {

    object-position: 65% center;

  }



  .e-service-page .service-page-title {

    top: 160px;

    left: 32px;

    font-size: 32px;

  }



  .e-service-page .signal-heading {

    font-size: 44px;

  }



  .e-service-page .hero-introduction > p {

    font-size: 18px;

    line-height: 1.2;

  }



  .e-service-page .feature-track {

    display: flex;

    gap: 24px;

    overflow-x: auto;

    padding-bottom: 8px;

    scroll-snap-type: x mandatory;

    scrollbar-width: thin;

    scrollbar-color: #9eb7d0 transparent;

    cursor: grab;

    touch-action: pan-x pan-y;

  }



  .e-service-page .feature-track[data-dragging='true'] {

    cursor: grabbing;

    scroll-snap-type: none;

    user-select: none;

  }



  .e-service-page .feature-card {

    flex: 0 0 calc((100% - 48px) / 2);

    scroll-snap-align: start;

  }



  .e-service-page .feature-navigation {

    display: flex;

    justify-content: center;

    gap: 12px;

    margin-top: 16px;

  }



  .e-service-page .feature-navigation button {

    display: grid;

    place-items: center;

    width: 44px;

    height: 44px;

    border: 1px solid #9eb7d080;

    border-radius: 50%;

    background: #ffffff80;

    color: #0d5792;

    cursor: pointer;

  }



  .e-service-page .feature-navigation button:hover {

    background: #fff;

  }

}



/* MOBILE */



@media (max-width: 768px) {

  .e-service-page .service-hero {

    padding: clamp(300px,65vw,390px) 32px 64px;

  }



  .e-service-page .hero-background {

    height: clamp(680px,174vw,1100px);

  }



  .e-service-page .hero-background-image {

    object-position: 60% top;

  }



  .e-service-page .service-page-title {

    top: 154px;

    left: 20px;

    font-size: 28px;

  }



  .e-service-page .hero-introduction {

    top: -16px;

  }



  .e-service-page .signal-heading {

    font-size: clamp(28px,7.8vw,42px);

  }



  .e-service-page .hero-introduction > p {

    margin-top: 24px;

    font-size: 16px;

    line-height: 1.07;

  }



  .e-service-page .feature-track {

    margin: 40px -32px 0;

    padding: 0 32px 4px;

    gap: 24px;

    scrollbar-width: none;

    scroll-padding-inline: 32px;

  }



  .e-service-page .feature-track::-webkit-scrollbar {

    display: none;

  }



  .e-service-page .feature-card {

    flex: 0 0 72vw;

    min-height: 233px;

    padding: 28px;

  }



  .e-service-page .request-section {

    padding: 0 20px 64px;

  }



  .e-service-page .request-tabs {

    flex-direction: column;

    align-items: stretch;

    gap: 0;

  }



  .e-service-page .request-tabs button {

    padding: 16px 4px;

  }



  .e-service-page .form-row.two,

  .e-service-page .form-row.three {

    grid-template-columns: 1fr;

  }



  .e-service-page .service-control > input,

  .e-service-page .service-control > textarea {

    font-size: 13px;

  }



  .e-service-page .service-control > textarea {

    height: 105px;

  }



  .e-service-page .form-footer {

    flex-direction: column;

    align-items: flex-start;

    gap: 26px;

    margin-top: 4px;

  }



  .e-service-page .form-footer > p {

    font-size: 12px;

  }



  .e-service-page .send-button {

    align-self: flex-end;

    min-height: 44px;

  }



  .e-service-page .service-closing {

    padding: 0 20px 80px;

  }



  .e-service-page .uncompromising-performance {

    --glass-top: clamp(78px,22vw,150px);

    padding: 64px 0 88px;

  }



  .e-service-page .uncompromising-stage {

    height: 300px;

  }



  .e-service-page .uncompromising-stage h2 {

    font-size: clamp(38px,12.5vw,80px) !important;

    line-height: 1.07 !important;

  }



  .e-service-page .uncompromising-glass {

    width: 60%;

    max-width: 300px;

    padding: 22px 16px;

  }



  .e-service-page .uncompromising-glass p {

    font-size: 16px !important;

    line-height: 1 !important;

  }



  .e-service-page .uncompromising-glow {

    top: var(--glass-top);

    height: 240px;

    width: 90%;

  }

}



@media (prefers-reduced-motion: reduce) {

  .e-service-page .send-label,

  .e-service-page .send-orb,

  .e-service-page .send-orb svg {

    transition: none;

  }

}

`;
