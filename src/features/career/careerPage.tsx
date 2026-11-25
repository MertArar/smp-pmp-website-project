"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  FiArrowUpRight,
  FiChevronDown,
  FiCheck,
  FiFileText,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiSearch,
  FiSend,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { menuItems } from "@/lib/navigation";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";

// Motion only animates an element's own opacity/translate; form layout,
// input interactions and the existing title effect remain independent.
type Direction = "up" | "left" | "right";
const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
const revealVariants: Variants = {
  hidden: ({
    direction,
    reduced,
  }: {
    direction: Direction;
    reduced: boolean;
  }) => ({
    opacity: reduced ? 1 : 0,
    x: reduced
      ? 0
      : direction === "left"
        ? -36
        : direction === "right"
          ? 36
          : 0,
    y: reduced ? 0 : direction === "up" ? 34 : 12,
    filter: reduced ? "blur(0px)" : "blur(5px)",
  }),
  visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
};
function reveal(
  direction: Direction = "up",
  delay = 0,
  reduced = false,
  amount = 0.2,
) {
  return {
    variants: revealVariants,
    custom: { direction, reduced },
    initial: reduced ? (false as const) : ("hidden" as const),
    whileInView: "visible" as const,
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.9,
      delay: reduced ? 0 : delay,
      ease: motionEase,
    },
  };
}

type CareerPosition = {
  id: string;

  title: string;

  department: string;

  employmentType: string;

  location: string;

  keywords: string[];
};

// Frontend sample vacancies. Replace this array when the vacancies API is connected.
const positions: CareerPosition[] = [
  {
    id: "hydraulic-design",
    title: "Senior Hydraulic Design & CFD Simulation Engineer",
    department: "Engineering & R&D",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["CFD", "fluid dynamics", "design", "research"],
  },

  {
    id: "mechanical-design",
    title: "Mechanical Design Engineer",
    department: "Engineering & R&D",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["CAD", "product development", "pumps"],
  },

  {
    id: "production-engineer",
    title: "Production Planning Engineer",
    department: "Production",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["manufacturing", "operations", "planning"],
  },

  {
    id: "export-sales",
    title: "Regional Export Sales Specialist",
    department: "Sales & Export",
    employmentType: "Full-time",
    location: "Istanbul",
    keywords: ["international", "business development", "sales"],
  },

  {
    id: "quality-specialist",
    title: "Quality Assurance Specialist",
    department: "Quality",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["testing", "inspection", "quality control"],
  },

  {
    id: "hr-specialist",
    title: "Human Resources Specialist",
    department: "Human Resources",
    employmentType: "Part-time",
    location: "Konya",
    keywords: ["recruitment", "people", "HR"],
  },

  {
    id: "engineering-intern",
    title: "Engineering & Research Intern",
    department: "Engineering & R&D",
    employmentType: "Internship",
    location: "Konya",
    keywords: ["student", "graduate", "research", "R&D"],
  },
];

const departments = [
  ...new Set(positions.map((position) => position.department)),
];

const employmentTypes = [
  ...new Set(positions.map((position) => position.employmentType)),
];

const competencies = [
  "Strategy & Direction Setting",
  "Embracing Team Power",
  "Effective Communication",

  "Business Development",
  "Result Orientation",
  "Creativity & Entrepreneurship",

  "Self & Team Development",
  "Adaptability & Change Agility",
  "Customer Sensitivity",
];

const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor",
  "Master",
  "PhD",
];

const experienceLevels = [
  "0–1 Year",
  "1–3 Years",
  "3–5 Years",
  "5–10 Years",
  "10+ Years",
];

const privacyHref = menuItems
  .flatMap((item) => item.children ?? [])
  .find(
    (item) => item.label === "Law on the Protection of Personal Data",
  )?.href;

const inputStyle =
  "min-h-11 w-full min-w-0 rounded-lg border border-[#d3e3f2] bg-white px-3.5 py-2.5 text-[12px]! leading-[1.2]! text-[#27272a]! outline-none placeholder:text-[#9eb7d0] shadow-[0_2px_4px_#0d579205] transition-[border-color,box-shadow] duration-250 focus:border-[#005eff] focus:ring-2 focus:ring-[#005eff]/15 aria-invalid:border-red-500 md:min-h-[38px] md:py-2 motion-reduce:transition-none";

const formDropdownStyle =
  "flex min-h-[44px] w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-[#bdd5e8]/90 bg-[linear-gradient(160deg,rgba(255,255,255,.96),rgba(239,248,255,.82))] px-3.5 py-2.5 text-left text-[12px] leading-[1.2] text-[#27272a] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_3px_14px_rgba(0,94,255,.055)] outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#8dbbe3] hover:bg-white focus-visible:border-[#005eff] focus-visible:ring-2 focus-visible:ring-[#005eff]/15";

// Custom accessible listbox: unlike native <select>, the expanded menu is fully
// stylable and stays consistent on Chrome, Safari, Windows and mobile.
type DropdownOption = { label: string; value: string };
type CareerDropdownProps = {
  id?: string;
  name?: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  variant?: "filter" | "form";
  invalid?: boolean;
  describedBy?: string;
  align?: "left" | "right";
};

function CareerDropdown({
  id,
  name,
  label,
  value,
  options,
  onChange,
  variant = "form",
  invalid = false,
  describedBy,
  align = "left",
}: CareerDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId().replace(/:/g, "");
  const listId = `career-options-${generatedId}`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const item = menuRef.current.children[activeIndex] as
      | HTMLElement
      | undefined;
    if (!item) return;
    const menu = menuRef.current;
    if (item.offsetTop < menu.scrollTop) menu.scrollTop = item.offsetTop;
    if (
      item.offsetTop + item.offsetHeight >
      menu.scrollTop + menu.clientHeight
    ) {
      menu.scrollTop = item.offsetTop + item.offsetHeight - menu.clientHeight;
    }
  }, [activeIndex, open]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggle() {
    if (!open) setActiveIndex(Math.max(0, selectedIndex));
    setOpen((previous) => !previous);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (
      ["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)
    ) {
      event.preventDefault();
      if (!open) {
        setActiveIndex(Math.max(0, selectedIndex));
        setOpen(true);
        return;
      }
      if (event.key === "ArrowDown")
        setActiveIndex((index) => (index + 1) % options.length);
      if (event.key === "ArrowUp")
        setActiveIndex(
          (index) => (index - 1 + options.length) % options.length,
        );
      if (event.key === "Home") setActiveIndex(0);
      if (event.key === "End") setActiveIndex(options.length - 1);
      if (event.key === "Enter" || event.key === " ") choose(activeIndex);
    } else if (event.key === "Tab" && open) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`relative min-w-0 ${open ? "z-[70]" : "z-0"}`}
    >
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-expanded={open}
        aria-activedescendant={
          open ? `${listId}-option-${activeIndex}` : undefined
        }
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={
          variant === "filter"
            ? "group/filter flex h-[27px] max-[639px]:h-[38px] w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-[8px] bg-transparent px-2 text-left text-[11px] font-[410] leading-none text-[#27272a] outline-none transition-colors duration-200 hover:bg-white/35 focus-visible:bg-white/45 focus-visible:ring-2 focus-visible:ring-[#005eff]/25"
            : formDropdownStyle
        }
      >
        <span
          className={`min-w-0 flex-1 truncate ${variant === "form" && !value ? "text-[#91aec8]" : ""}`}
        >
          {selected?.label ?? label}
        </span>
        {variant === "filter" ? (
          <FiChevronDown
            aria-hidden="true"
            className={`size-[15px] shrink-0 text-[#171b21] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            strokeWidth={2.2}
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-[8px] border border-white/85 bg-white/65 text-[#005eff] shadow-[0_2px_8px_rgba(0,94,255,.08)]"
          >
            <FiChevronDown
              className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-[calc(100%+7px)] z-[80] w-full min-w-[min(230px,85vw)] origin-top overflow-hidden rounded-[15px] border border-white/85 bg-[linear-gradient(145deg,rgba(250,253,255,.98),rgba(224,239,255,.96))] p-1.5 shadow-[0_14px_42px_rgba(21,83,148,.19),inset_0_1px_0_rgba(255,255,255,.98)] backdrop-blur-[26px] ${align === "right" ? "right-0" : "left-0"}`}
          >
            <div
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className="max-h-[252px] space-y-0.5 overflow-y-auto overscroll-contain [scrollbar-color:#b2cdec_transparent] [scrollbar-width:thin]"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = activeIndex === index;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    id={`${listId}-option-${index}`}
                    role="option"
                    type="button"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(index)}
                    className={`flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left text-[12px] leading-[1.2] outline-none transition-[background-color,color] duration-150 ${isSelected ? "bg-[#005eff]/10 font-[540] text-[#005eff]" : isActive ? "bg-white/90 text-[#0d5792]" : "text-[#365b7a] hover:bg-white/80"}`}
                  >
                    <span className="min-w-0 flex-1">{option.label}</span>
                    {isSelected && (
                      <FiCheck
                        aria-hidden="true"
                        className="size-4 shrink-0 text-[#005eff]"
                        strokeWidth={2.4}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const sectionStyle = "min-w-0 border-b border-[#9eb7d0]/10 pb-6";

const legendStyle = "mb-3 text-[12px] leading-[1.2] font-[540] text-[#27272a]";

const initialDetails = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  education: "",
  school: "",
  experience: "",
  portfolio: "",
  coverLetter: "",
};

type ApplicationDetails = typeof initialDetails;

type ApplicationErrorKey =
  | keyof ApplicationDetails
  | "targetPosition"
  | "resume"
  | "privacy";

type FormErrors = Partial<Record<ApplicationErrorKey, string>>;

const maxFileBytes = 10 * 1024 * 1024;

const allowedMimeTypes: Record<string, string[]> = {
  pdf: ["application/pdf"],

  doc: ["application/msword"],

  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  );
}

function FormField({
  name,
  label,
  required = false,
  error,
  children,
}: {
  name: string;

  label: string;

  required?: boolean;

  error?: string;

  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={`career-${name}`}
        className="mb-2 block text-[12px] leading-[1.2] text-[#597c9c]"
      >
        {label} {required && <RequiredMark />}
      </label>

      {children}

      {error && (
        <p
          id={`career-${name}-error`}
          className="mt-2 text-[12px] leading-[1.3] text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function CareerApplicationForm({
  targetPosition,
  onTargetPositionChange,
}: {
  targetPosition: string;

  onTargetPositionChange: (id: string) => void;
}) {
  const [details, setDetails] = useState<ApplicationDetails>(initialDetails);

  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>(
    [],
  );

  const [competencyMessage, setCompetencyMessage] = useState("");

  const [resume, setResume] = useState<File | null>(null);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [dragging, setDragging] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [feedback, setFeedback] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);

  const form = useRef<HTMLFormElement>(null);

  function changeDetail(name: keyof ApplicationDetails, value: string) {
    setDetails((previous) => ({ ...previous, [name]: value }));

    setErrors((previous) => ({ ...previous, [name]: undefined }));

    setFeedback("");
  }

  function toggleCompetency(value: string) {
    if (selectedCompetencies.includes(value)) {
      setSelectedCompetencies((previous) =>
        previous.filter((item) => item !== value),
      );

      setCompetencyMessage("");
    } else if (selectedCompetencies.length < 3) {
      setSelectedCompetencies((previous) => [...previous, value]);

      setCompetencyMessage("");
    } else {
      setCompetencyMessage(
        "You can select up to 3 competencies. Remove a selection to choose another.",
      );
    }

    setFeedback("");
  }

  function selectResume(files: FileList | File[]) {
    setFeedback("");

    if (files.length === 0) return;

    let error: string | undefined;

    const file = files[0];

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (files.length !== 1) error = "Please select one resume file.";
    else if (
      !allowedMimeTypes[extension] ||
      (file.type && !allowedMimeTypes[extension].includes(file.type))
    )
      error = "Please upload a PDF, DOC, or DOCX file.";
    else if (file.size === 0)
      error = "This file is empty. Please choose your resume again.";
    else if (file.size > maxFileBytes)
      error = "Your resume must be 10 MB or smaller.";

    if (!error) setResume(file);

    setErrors((previous) => ({ ...previous, resume: error }));

    if (fileInput.current) fileInput.current.value = "";
  }

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (
      !positions.some((position) => position.id === targetPosition) &&
      targetPosition !== "general-talent"
    )
      nextErrors.targetPosition =
        "Please select a position or the General Talent Database.";

    if (details.fullName.trim().length < 2)
      nextErrors.fullName = "Please enter your full name.";

    const digits = details.phone.replace(/\D/g, "");

    if (
      !/^\+?[\d\s().-]+$/.test(details.phone.trim()) ||
      digits.length < 10 ||
      digits.length > 15
    )
      nextErrors.phone = "Please enter a valid phone number with 10–15 digits.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
      nextErrors.email = "Please enter a valid email address.";

    if (details.portfolio.trim()) {
      try {
        const url = new URL(details.portfolio.trim());

        if (!["https:", "http:"].includes(url.protocol))
          nextErrors.portfolio = "Please enter an http:// or https:// URL.";
      } catch {
        nextErrors.portfolio =
          "Please enter a complete URL, including https://.";
      }
    }

    if (!resume) nextErrors.resume = "Please upload your resume.";
    else if (errors.resume) nextErrors.resume = errors.resume;

    if (!privacyAccepted)
      nextErrors.privacy =
        "Please agree to the Privacy Policy before continuing.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback(
        "Please check the highlighted fields. Your application has not been sent.",
      );

      form.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();

      return;
    }

    // Future API integration receives { targetPosition, ...details, competencies: selectedCompetencies, resume, privacyAccepted } here.
    // Keep all draft fields intact until a real backend confirms receipt.
    setFeedback(
      "Your profile is ready. Online application submission is not enabled yet; no information or file has been sent or saved.",
    );
  }

  function fieldProps(name: keyof ApplicationDetails) {
    return {
      id: `career-${name}`,
      name,
      value: details[name],

      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => changeDetail(name, event.target.value),

      "aria-invalid": Boolean(errors[name]),

      "aria-describedby": errors[name] ? `career-${name}-error` : undefined,

      className: inputStyle,
    };
  }

  return (
    <form
      ref={form}
      noValidate
      onSubmit={submitApplication}
      aria-label="Career application"
      className="min-w-0 space-y-7 rounded-[24px] border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,.78),rgba(244,250,255,.85))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.92),0_20px_60px_rgba(13,87,146,.09)] backdrop-blur-[22px] max-md:rounded-[18px] max-md:p-5 md:p-9"
    >
      <fieldset className={sectionStyle}>
        <legend className={`${legendStyle} w-full`}>
          <span className="flex items-center justify-between gap-4">
            <span>
              1. TARGET POSITION <RequiredMark />
            </span>
            <span className="text-[11px] font-[410] text-[#9eb7d0]">
              Tekil Açık Rol
            </span>
          </span>
        </legend>

        <label htmlFor="career-target-position" className="sr-only">
          Target Position
        </label>

        <CareerDropdown
          id="career-target-position"
          name="targetPosition"
          label="Target Position"
          value={targetPosition}
          options={[
            { value: "", label: "Select an open position" },
            ...positions.map((position) => ({
              value: position.id,
              label: position.title,
            })),
            { value: "general-talent", label: "General Talent Database" },
          ]}
          onChange={(value) => {
            onTargetPositionChange(value);
            setErrors((previous) => ({
              ...previous,
              targetPosition: undefined,
            }));
            setFeedback("");
          }}
          invalid={Boolean(errors.targetPosition)}
          describedBy={
            errors.targetPosition ? "career-targetPosition-error" : undefined
          }
        />
        {targetPosition && (
          <p className="mt-2 text-[11px] leading-[1.35] text-[#597c9c]">
            Selected position:{" "}
            <span className="font-[540] text-[#0d5792]">
              {positions.find((position) => position.id === targetPosition)
                ?.title ?? "General Talent Database"}
            </span>
          </p>
        )}

        {!targetPosition && errors.targetPosition && (
          <p
            id="career-targetPosition-error"
            className="mt-2 text-[12px] text-red-700"
          >
            {errors.targetPosition}
          </p>
        )}
      </fieldset>

      <fieldset className={sectionStyle}>
        <legend className={legendStyle}>
          2. PERSONAL & CONTACT DETAILS <RequiredMark />
        </legend>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="fullName"
            label="Full Name"
            required
            error={errors.fullName}
          >
            <input
              {...fieldProps("fullName")}
              autoComplete="name"
              placeholder="e.g. John Doe"
              required
              maxLength={160}
            />
          </FormField>

          <FormField
            name="email"
            label="Email Address"
            required
            error={errors.email}
          >
            <input
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              placeholder="ad.soyad@example.com"
              required
              maxLength={254}
            />
          </FormField>

          <FormField
            name="phone"
            label="Phone Number"
            required
            error={errors.phone}
          >
            <input
              {...fieldProps("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+90 (5XX) XXX XX XX"
              required
              maxLength={30}
            />
          </FormField>

          <FormField name="city" label="Current City">
            <input
              {...fieldProps("city")}
              autoComplete="address-level2"
              placeholder="City of residence"
              maxLength={120}
            />
          </FormField>
        </div>
      </fieldset>

      <fieldset className={sectionStyle}>
        <legend className={legendStyle}>3. EDUCATION & EXPERIENCE</legend>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField name="education" label="Education Level">
            <CareerDropdown
              id="career-education"
              name="education"
              label="Education Level"
              value={details.education}
              options={[
                { value: "", label: "Select education level" },
                ...educationLevels.map((level) => ({
                  value: level,
                  label: level,
                })),
              ]}
              onChange={(value) => changeDetail("education", value)}
            />
          </FormField>

          <FormField name="school" label="University / School">
            <input
              {...fieldProps("school")}
              placeholder="University or school name"
              maxLength={200}
            />
          </FormField>

          <FormField name="experience" label="Experience Years">
            <CareerDropdown
              id="career-experience"
              name="experience"
              label="Experience Years"
              value={details.experience}
              options={[
                { value: "", label: "Select experience" },
                ...experienceLevels.map((level) => ({
                  value: level,
                  label: level,
                })),
              ]}
              onChange={(value) => changeDetail("experience", value)}
            />
          </FormField>

          <div className="md:col-span-3">
            <FormField
              name="portfolio"
              label="LinkedIn / Portfolio URL"
              error={errors.portfolio}
            >
              <div className="relative">
                <FiLinkedin
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9eb7d0]"
                  aria-hidden="true"
                />
                <input
                  {...fieldProps("portfolio")}
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  className={`${inputStyle} pl-10`}
                  maxLength={2000}
                />
              </div>
            </FormField>
          </div>
        </div>
      </fieldset>

      <fieldset
        className={sectionStyle}
        aria-describedby="career-competency-help"
      >
        <legend className={`${legendStyle} w-full`}>
          <span className="flex items-center justify-between gap-4">
            <span>4. YOUR TOP SEMPA COMPETENCIES (SELECT UP TO 3)</span>
            <span className="shrink-0 rounded bg-[#f7f7f7] px-2 py-1 text-[11px] font-[410] text-[#597c9c]">
              {selectedCompetencies.length}/3
            </span>
          </span>
        </legend>

        <div className="grid gap-4 md:grid-cols-2 md:gap-2.5 lg:grid-cols-3">
          {competencies.map((value) => (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-[11px] leading-[1.2] transition-colors duration-250 md:min-h-10 ${selectedCompetencies.includes(value) ? "border-[#005eff]/40 bg-[#005eff]/8 text-[#0d5792]" : "border-[#d3e3f2]/70 bg-white/70 text-[#597c9c] hover:bg-white"}`}
            >
              <span>{value}</span>

              <input
                type="checkbox"
                name="competencies"
                value={value}
                checked={selectedCompetencies.includes(value)}
                onChange={() => toggleCompetency(value)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[#005eff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005eff]"
              />
            </label>
          ))}
        </div>

        <p
          id="career-competency-help"
          role="status"
          className={
            competencyMessage
              ? "mt-3 text-[12px] leading-[1.3] text-[#0d5792]"
              : "sr-only"
          }
        >
          {competencyMessage ||
            `${selectedCompetencies.length}/3 competencies selected.`}
        </p>
      </fieldset>

      <fieldset className={sectionStyle}>
        <legend className={legendStyle}>
          5. UPLOAD RESUME / CV <RequiredMark />
        </legend>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            selectResume(event.dataTransfer.files);
          }}
          className={`rounded-xl border border-dashed transition-colors ${dragging ? "border-[#005eff] bg-[#005eff]/10" : "border-[#9eb7d0] bg-white/55"}`}
        >
          <label
            htmlFor="career-resume"
            className="flex min-h-[190px] cursor-pointer flex-col items-start justify-center gap-3 px-8 py-6 text-left text-[14px] leading-[1.1] text-[#597c9c] focus-within:ring-2 focus-within:ring-[#005eff] md:min-h-[150px] md:items-center md:p-6 md:text-center md:text-[13px] md:leading-[1.3]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4ebf3]">
              <FiUploadCloud
                aria-hidden="true"
                className="h-5 w-5 text-[#597c9c]"
              />
            </span>

            <span className="text-[#27272a]">
              Click to upload your CV or drag and drop here
            </span>

            <span
              id="career-resume-help"
              className="text-[11px] text-[#9eb7d0]"
            >
              PDF preferred · DOC / DOCX accepted · Maximum 10 MB
            </span>

            <input
              ref={fileInput}
              id="career-resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                if (event.target.files) selectResume(event.target.files);
              }}
              aria-required="true"
              aria-invalid={Boolean(errors.resume)}
              aria-describedby={`career-resume-help${errors.resume ? " career-resume-error" : ""}`}
              className="sr-only"
            />
          </label>
        </div>

        {resume && (
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-white/80 p-3 text-[12px] leading-[1.3] text-[#0d5792]">
            <FiFileText aria-hidden="true" className="h-5 w-5 shrink-0" />

            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
              {resume.name}
              <span className="mt-1 block text-[11px] text-[#9eb7d0]">
                {resume.size < 1024 * 1024
                  ? `${Math.ceil(resume.size / 1024)} KB`
                  : `${(resume.size / (1024 * 1024)).toFixed(1)} MB`}
              </span>
            </span>

            <button
              type="button"
              aria-label="Remove resume"
              onClick={() => {
                setResume(null);
                setErrors((previous) => ({ ...previous, resume: undefined }));
                setFeedback("");
                if (fileInput.current) fileInput.current.value = "";
              }}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#597c9c]! hover:bg-[#d5e9ff] focus-visible:outline-2 focus-visible:outline-[#005eff]"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}

        {errors.resume && (
          <p
            id="career-resume-error"
            className="mt-2 text-[12px] leading-[1.3] text-red-700"
          >
            {errors.resume}
          </p>
        )}
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={legendStyle}>
          6. BRIEF COVER LETTER / YOUR AMBITIONS
        </legend>

        <label htmlFor="career-coverLetter" className="sr-only">
          Brief Cover Letter
        </label>

        <textarea
          {...fieldProps("coverLetter")}
          placeholder="Share your motivations, technical interests, and why you wish to contribute to Sempa..."
          rows={4}
          maxLength={5000}
          className={`${inputStyle} min-h-[110px]! resize-y`}
        />
      </fieldset>

      <div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[12px] leading-[1.4] text-[#597c9c]">
          <input
            name="privacy"
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(event) => {
              setPrivacyAccepted(event.target.checked);
              setErrors((previous) => ({ ...previous, privacy: undefined }));
              setFeedback("");
            }}
            aria-invalid={Boolean(errors.privacy)}
            aria-describedby={
              errors.privacy ? "career-privacy-error" : undefined
            }
            className="h-4 w-4 shrink-0 cursor-pointer accent-[#005eff]"
          />

          <span>
            I have read the{" "}
            {privacyHref ? (
              <Link
                href={privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0d5792]! underline! underline-offset-2"
              >
                Personal Data Notice
              </Link>
            ) : (
              "Personal Data Notice"
            )}{" "}
            and consent to the processing of my application data for Sempa
            recruitment evaluations.
          </span>
        </label>

        {errors.privacy && (
          <p
            id="career-privacy-error"
            className="mt-2 text-[12px] text-red-700"
          >
            {errors.privacy}
          </p>
        )}

        <div className="mt-7 flex flex-col items-center justify-between gap-5 border-t border-[#9eb7d0]/15 pt-6 sm:flex-row sm:items-center">
          <a
            href="mailto:insankaynaklari@sempapompa.com"
            className="flex min-w-0 items-center gap-2 text-[12px] text-[#597c9c]! [overflow-wrap:anywhere]"
          >
            <FiMail className="h-4 w-4 shrink-0" aria-hidden="true" />{" "}
            insankaynaklari@sempapompa.com
          </a>

          <button
            type="submit"
            disabled={!privacyAccepted}
            className="group/submit inline-flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#005eff] bg-[#005eff] px-7 py-3 text-[12px]! leading-[1.2]! text-white! shadow-[0_5px_20px_#005eff25] transition-[background-color,border-color,color,box-shadow,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-transparent hover:bg-[#f7f7f7] hover:text-[#005eff]! hover:shadow-[0_9px_25px_rgba(0,94,255,0.17)] active:translate-y-0 focus-visible:border-transparent focus-visible:bg-[#f7f7f7] focus-visible:text-[#005eff]! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <FiSend
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/submit:translate-x-0.5 group-hover/submit:-translate-y-0.5 motion-reduce:transition-none"
            />{" "}
            Submit Application
          </button>
        </div>

        <p
          role="status"
          aria-live="polite"
          className="mt-4 text-[13px] leading-[1.4] text-[#0d5792]"
        >
          {feedback}
        </p>
      </div>
    </form>
  );
}

// The role list is demo data supplied with the original component.
// Descriptions are display summaries, not additional live job postings.
const roleDescriptions: Record<string, string> = {
  "hydraulic-design":
    "Seeking a senior engineer to drive hydraulic design and numerical flow simulations (CFD) for next-generation high-efficiency centrifugal and split-case pumps in our certified R&D Center.",
  "mechanical-design":
    "Contribute to mechanical design and product development, from CAD modeling and technical drawings to engineering improvements across pump systems.",
  "production-engineer":
    "Support production planning, manufacturing coordination and efficient workshop operations for precision-engineered pump products.",
  "export-sales":
    "Work with international customers and partners, supporting regional export relationships, sales processes and business development.",
  "quality-specialist":
    "Support product quality through inspection, testing, documentation and continuous improvement in manufacturing processes.",
  "hr-specialist":
    "Support recruitment, people operations and employee experience across teams and departments.",
  "engineering-intern":
    "Gain practical experience by supporting engineering research, technical analysis and development projects alongside the team.",
};

const searchInputStyle =
  "h-[25px] w-full min-w-0 appearance-none rounded-[7px] border border-white/85 bg-white/95 py-0 pl-[29px] pr-2 text-[10px] min-[640px]:text-[9px] tracking-[-0.025em] leading-none text-[#31577b] shadow-[0_3px_13px_rgba(0,94,255,.14)] outline-none transition-[box-shadow,border-color] duration-300 placeholder:text-[#99b9d5] focus:border-[#8cc2ff] focus:shadow-[0_3px_16px_rgba(0,94,255,.22)] max-[639px]:h-[38px] max-[639px]:text-[12px]";

const blueOrb =
  "grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(155deg,#0877ff_0%,#005eff_54%,#001ba8_100%)] text-white shadow-[0_0_18px_rgba(0,94,255,.36),0_5px_15px_rgba(0,42,155,.14)]";

const careerTitle = [
  "Our Strength is People,",
  "Our Horizon the World:",
  "Shape Your Career at Sempa",
];

function JobRow({
  position,
  expanded,
  onToggle,
  onApply,
  index,
  reduced,
}: {
  position: CareerPosition;
  expanded: boolean;
  onToggle: () => void;
  onApply: (id: string) => void;
  index: number;
  reduced: boolean;
}) {
  const contentId = `career-role-content-${position.id}`;
  const departmentLabel =
    position.department === "Engineering & R&D"
      ? "R&D and Engineering Center"
      : position.department;
  const locationLabel =
    position.department === "Engineering & R&D" && position.location === "Konya"
      ? "Konya / HQ R&D Center"
      : `${position.location} / Sempa`;

  return (
    <motion.li
      layout="position"
      {...reveal(
        index % 2 === 0 ? "up" : "right",
        Math.min(index, 5) * 0.035,
        reduced,
        0.12,
      )}
      initial={index < 3 || reduced ? false : "hidden"}
      className="min-w-0"
    >
      <motion.article
        layout="position"
        className={`relative min-w-0 overflow-hidden border border-white/75 bg-[linear-gradient(130deg,rgba(255,255,255,.90),rgba(245,250,255,.79))] shadow-[0_7px_25px_rgba(0,94,255,.07)] backdrop-blur-[18px] transition-[border-radius,background-color,box-shadow] duration-500 ${
          expanded
            ? "rounded-[30px] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_14px_32px_rgba(0,94,255,.10)]"
            : "rounded-[14px] hover:bg-white/90 hover:shadow-[0_8px_28px_rgba(0,94,255,.12)]"
        }`}
      >
        <button
          type="button"
          id={`career-role-button-${position.id}`}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={onToggle}
          className={`group flex w-full cursor-pointer items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#005eff] ${
            expanded
              ? "min-h-[66px] px-5 pt-4 pb-2 md:px-6"
              : "min-h-[64px] px-5 py-3 md:px-6"
          }`}
        >
          <span className="min-w-0 max-w-[330px] text-[13px] leading-[1.18] font-[560] text-[#27272a] [font-variation-settings:'wght'_560,'wdth'_125] md:text-[14px]">
            {position.title}
          </span>
          {expanded ? (
            <FiX
              aria-hidden="true"
              className="size-6 shrink-0 text-[#172330] transition-transform duration-300 group-hover:rotate-90"
              strokeWidth={1.7}
            />
          ) : (
            <span
              aria-hidden="true"
              className={`${blueOrb} transition-[transform,box-shadow] duration-500 group-hover:scale-[1.06] group-hover:shadow-[0_0_24px_rgba(0,94,255,.5)]`}
            />
          )}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="detail"
              id={contentId}
              role="region"
              aria-labelledby={`career-role-button-${position.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: reduced ? 0 : 0.52, ease: motionEase },
                opacity: { duration: reduced ? 0 : 0.34, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 md:px-6 md:pb-6">
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] leading-[1.2] text-[#81a8cb]">
                  <span>{departmentLabel}</span>
                  <span className="inline-flex items-center gap-1 text-[#81a8cb]">
                    <FiMapPin
                      aria-hidden="true"
                      className="size-4 text-[#005eff]"
                    />
                    {locationLabel}
                  </span>
                </div>
                <p className="my-6 max-w-[550px] text-[13px] leading-[1.22] text-[#27323d] md:my-7 md:text-[14px]">
                  {roleDescriptions[position.id]}
                </p>
                <button
                  type="button"
                  onClick={() => onApply(position.id)}
                  className="group/apply inline-flex min-h-[43px] cursor-pointer items-center gap-2 rounded-full border border-[#a7c5e2]/70 bg-white/55 py-1 pr-5 pl-1 text-[15px] leading-none text-[#27272a] shadow-[0_4px_17px_rgba(0,94,255,.10)] backdrop-blur-[12px] transition-[background-color,box-shadow] duration-[350ms] hover:bg-white hover:shadow-[0_6px_22px_rgba(0,94,255,.17)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#005eff]"
                >
                  <span
                    className={`${blueOrb} transition-transform duration-500 group-hover/apply:rotate-45`}
                  >
                    <FiArrowUpRight
                      className="size-5"
                      strokeWidth={2.7}
                      aria-hidden="true"
                    />
                  </span>
                  <span>Apply</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.li>
  );
}

export default function CareerPage() {
  const heading = useRepeatingTitle(1100);
  const reduced = useReducedMotion() ?? false;
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(
    "hydraulic-design",
  );
  const application = useRef<HTMLElement>(null);

  const search = query.trim().toLocaleLowerCase("en");
  const matchingPositions = positions.filter(
    (position) =>
      (!department || position.department === department) &&
      (!employmentType || position.employmentType === employmentType) &&
      (!search ||
        [
          position.title,
          position.location,
          position.department,
          ...position.keywords,
        ]
          .join(" ")
          .toLocaleLowerCase("en")
          .includes(search)),
  );

  function applyFor(id: string) {
    setTargetPosition(id);
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    application.current?.scrollIntoView({
      behavior: isReduced ? "instant" : "smooth",
      block: "start",
    });
    // Keep the selected vacancy visible in the form; do not jump back to the list.
    document
      .getElementById("career-target-position")
      ?.focus({ preventScroll: true });
  }

  return (
    <main
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] w-full overflow-x-clip bg-[radial-gradient(ellipse_at_20%_15%,#ffffffd9_0%,transparent_55%),radial-gradient(ellipse_at_95%_60%,#c5e2ff99_0%,transparent_65%),linear-gradient(120deg,#e7f4ff_0%,#d6ebff_48%,#c5e2ff_100%)] px-3 pt-10 pb-32 font-sans text-[#27272a] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,'wdth'_125] tracking-[-0.04em] max-md:bg-[linear-gradient(115deg,#e7f4ff_0%,#d6ebff_48%,#c5e2ff_100%)] md:px-8 md:pt-16 lg:pb-40"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          {...reveal("left", 0, reduced, 0.25)}
          className="hidden md:mb-24 md:block min-[75rem]:mb-28"
        >
          <p className="text-[30px] leading-none text-[#0d5792] md:text-[36px]">
            Sempa Career
          </p>
        </motion.header>

        <section
          aria-labelledby="career-heading"
          className="grid items-start gap-0 md:grid-cols-2 md:gap-8 min-[75rem]:grid-cols-[minmax(0,390fr)_minmax(0,290fr)_minmax(0,520fr)] min-[75rem]:gap-0"
        >
          <motion.div
            {...reveal("left", 0.06, reduced, 0.15)}
            className="relative z-10 min-w-0 text-center md:text-left"
          >
            <h1
              ref={heading}
              id="career-heading"
              aria-label={careerTitle.join(" ")}
              className="mx-auto max-w-[310px] text-[clamp(30px,8vw,34px)] leading-none font-[410] text-[#0d5792] md:mx-0 md:max-w-[395px] md:text-[clamp(32px,4vw,50px)]"
            >
              {careerTitle.map((phrase, phraseIndex) => (
                <span key={phrase} aria-hidden="true">
                  {phraseIndex > 0 && " "}
                  {phrase.split(" ").map((word, wordIndex) => (
                    <span key={`${phraseIndex}-${wordIndex}`}>
                      {wordIndex > 0 && " "}
                      <span
                        className="career-title-word inline-block"
                        style={{
                          animationDelay: `${phraseIndex * 200 + wordIndex * 35}ms`,
                        }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <style>{`
              @media (prefers-reduced-motion: no-preference) {
                #career-heading[data-title-revealing] .career-title-word {
                  animation: career-title-rise 560ms cubic-bezier(.22,1,.36,1) both;
                }
              }
              @keyframes career-title-rise {
                from { opacity: 0; transform: translateY(.38em); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <motion.p
              {...reveal("up", 0.19, reduced, 0.15)}
              className="mx-auto mt-6 max-w-[340px] text-[16px] leading-[1.07] text-[#9eb7d0] md:mx-0 md:max-w-[390px] md:text-[20px]"
            >
              Browse current opportunities at our Konya 4th OIZ complex,
              certified R&amp;D Center, and regional export offices.
            </motion.p>
          </motion.div>

          <motion.div
            {...reveal("up", 0.08, reduced, 0.12)}
            className="relative mx-auto mt-12 h-[380px] w-full max-w-[360px] md:mt-0 md:h-[500px] md:max-w-[400px] min-[75rem]:mx-0 min-[75rem]:w-[calc(100%+90px)]"
          >
            <Image
              src="/career/01.webp"
              alt="Sempa team member standing in front of the blue Sempa symbol"
              fill
              preload
              sizes="(min-width:1200px) 380px, (min-width:768px) 45vw, 90vw"
              className="object-contain object-top"
            />
          </motion.div>

          <div className="relative z-10 min-w-0 md:col-span-2 min-[75rem]:col-span-1">
            <motion.div
              {...reveal("right", 0.08, reduced, 0.15)}
              data-career-filters
              className="relative mx-auto grid w-full max-w-[520px] grid-cols-1 items-center gap-1.5 rounded-[12px] border border-white/70 bg-[#f7f7f7]/95 px-[9px] py-[7px] shadow-[0_8px_25px_rgba(0,94,255,.045)] backdrop-blur-[15px] min-[640px]:max-w-none min-[640px]:grid-cols-[minmax(0,1.55fr)_minmax(0,.86fr)_minmax(0,1.03fr)] min-[640px]:gap-2 min-[640px]:py-[7px]"
            >
              <label className="relative block min-w-0">
                <span className="sr-only">Search positions</span>
                <FiSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[8px] top-1/2 size-[13px] -translate-y-1/2 text-[#8aaed0]"
                />
                <input
                  type="search"
                  placeholder="Search job title, keyword or location..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-controls="career-vacancies"
                  className={`${searchInputStyle} [font-family:var(--font-sf-pro),sans-serif] [font-variation-settings:'wght'_400,'wdth'_100] placeholder:opacity-100 [&::-webkit-search-decoration]:hidden [&::-webkit-search-cancel-button]:hidden`}
                />
              </label>
              <CareerDropdown
                label="Department"
                value={department}
                variant="filter"
                options={[
                  { value: "", label: "All Departments" },
                  ...departments.map((value) => ({ value, label: value })),
                ]}
                onChange={setDepartment}
              />
              <CareerDropdown
                label="Employment Type"
                align="right"
                value={employmentType}
                variant="filter"
                options={[
                  { value: "", label: "All Employment Types" },
                  ...employmentTypes.map((value) => ({ value, label: value })),
                ]}
                onChange={setEmploymentType}
              />
            </motion.div>

            <motion.p
              {...reveal("up", 0.12, reduced, 0.1)}
              role="status"
              aria-live="polite"
              className="mt-4 mb-6 text-center text-[11px] leading-none text-[#86a9c5] md:mt-3 md:mb-5 md:text-right"
            >
              Listing {matchingPositions.length} Open Positions
            </motion.p>

            <motion.div
              {...reveal("up", 0.13, reduced, 0.15)}
              className="mb-3 flex min-h-[64px] items-center justify-between gap-5 rounded-[13px] border border-white/60 bg-[linear-gradient(110deg,rgba(137,192,252,.38),rgba(148,196,254,.52))] px-5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_8px_22px_rgba(0,94,255,.08)] backdrop-blur-[22px]"
            >
              <h2 className="text-[17px] leading-[1.1] font-[560] text-[#005eff] [font-variation-settings:'wght'_560,'wdth'_125]">
                Our Relevant Departments
              </h2>
              <span
                aria-hidden="true"
                className="hidden size-[27px] shrink-0 place-items-center rounded-full bg-[linear-gradient(155deg,#0877ff_0%,#005eff_58%,#001ba8_100%)] text-white shadow-[0_0_17px_rgba(0,94,255,.65),0_3px_9px_rgba(0,42,155,.28)] md:grid"
              >
                <FiArrowUpRight className="size-[18px]" strokeWidth={2.7} />
              </span>
            </motion.div>

            <ul id="career-vacancies" className="space-y-2.5">
              {matchingPositions.map((position, index) => (
                <JobRow
                  key={position.id}
                  position={position}
                  expanded={expandedId === position.id}
                  onToggle={() =>
                    setExpandedId((current) =>
                      current === position.id ? null : position.id,
                    )
                  }
                  onApply={applyFor}
                  index={index}
                  reduced={reduced}
                />
              ))}
            </ul>
            {matchingPositions.length === 0 && (
              <div className="rounded-[17px] border border-white/70 bg-white/50 p-6 text-[14px] leading-[1.4] text-[#0d5792] backdrop-blur-[14px]">
                No positions match your search. Try another keyword or filter,
                or select the General Talent Database below.
              </div>
            )}
          </div>
        </section>

        <section
          ref={application}
          id="career-application"
          aria-labelledby="application-heading"
          className="mt-12 scroll-mt-32 md:mt-0"
        >
          <div className="grid items-end gap-0 md:grid-cols-[minmax(0,450fr)_minmax(0,750fr)]">
            <motion.div
              {...reveal("left", 0.04, reduced, 0.15)}
              className="relative mx-auto -mb-8 h-[390px] w-[calc(100%/1.2)] max-w-[380px] md:-mb-12 md:h-[530px] md:w-full md:max-w-[460px]"
            >
              <Image
                src="/career/02.webp"
                alt="Two Sempa team members"
                fill
                sizes="(min-width:1440px) 600px, (min-width:768px) 460px, 90vw"
                className="origin-bottom scale-x-[-1.2] scale-y-[1.2] object-contain object-bottom md:-scale-x-100 md:scale-y-100 min-[90rem]:scale-x-[-1.3] min-[90rem]:scale-y-[1.3]"
              />
            </motion.div>
            <motion.header
              {...reveal("right", 0.05, reduced, 0.2)}
              className="relative z-10 pb-16 text-center md:pb-24 md:pl-8 md:text-left"
            >
              <h2
                id="application-heading"
                className="mx-auto max-w-[360px] text-[30px] leading-none font-[410] text-[#0d5792] md:mx-0 md:max-w-none md:text-[clamp(30px,3.5vw,50px)]"
              >
                Submit Your Resume &amp;
                <br className="hidden min-[75rem]:block" /> Profile to the Sempa
                Family
              </h2>
              <p className="mx-auto mt-5 max-w-[340px] text-[15px] leading-[1.07] text-[#9eb7d0] md:mx-0 md:mt-6 md:max-w-[510px]">
                Select an open vacancy or register in our General Talent
                Database. You can prepare your application here; online
                submission will be available once the recruitment system is
                connected.
              </p>
            </motion.header>
          </div>
          <motion.div
            {...reveal("up", 0, reduced, 0.07)}
            className="relative z-10"
          >
            <CareerApplicationForm
              targetPosition={targetPosition}
              onTargetPositionChange={setTargetPosition}
            />
          </motion.div>
        </section>

        <motion.div
          {...reveal("up", 0, reduced, 0.09)}
          className="mt-24 [--newsletter-spacing-unit:1.5px] md:mt-28"
        >
          <NewsletterSubscription />
        </motion.div>
      </div>
    </main>
  );
}
