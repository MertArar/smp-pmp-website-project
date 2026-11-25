"use client";
// Quality page motion is coordinated with the About Us reveal language.
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuArrowLeft, LuArrowRight, LuShieldCheck } from "react-icons/lu";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";

type QualityDirection = "up" | "left" | "right";
const qualityEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
const heroWords = ["Quality", "Management", "Certifications"];
const certificationSequence = [
  "Certifications",
  "ISO 14001",
  "Certifications",
  "TSE",
  "Certifications",
  "NFPA",
  "Certifications",
  "EAC",
] as const;
const hackerCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useCertificationScramble(reduced: boolean) {
  const [label, setLabel] = useState<string>(certificationSequence[0]);
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (reduced) {
      setLabel(certificationSequence[0]);
      setScrambling(false);
      return;
    }

    let sequenceIndex = 0;
    let currentLabel: string = certificationSequence[0];
    let frameId = 0;
    let timeoutId = 0;
    let cancelled = false;

    const transitionToNext = () => {
      sequenceIndex = (sequenceIndex + 1) % certificationSequence.length;
      const nextLabel =
        certificationSequence[sequenceIndex] ?? certificationSequence[0];
      const previousLabel = currentLabel;
      const duration = 950;
      let startTime: number | null = null;
      let lastPaint = 0;
      setScrambling(true);

      const draw = (now: number) => {
        if (cancelled) return;
        if (startTime === null) startTime = now;
        const progress = Math.min(1, (now - startTime) / duration);

        // Limit React updates while keeping the scrambling effect fluid.
        if (now - lastPaint >= 38 || progress === 1) {
          lastPaint = now;
          const length = Math.max(
            nextLabel.length,
            Math.round(
              previousLabel.length +
                (nextLabel.length - previousLabel.length) *
                  Math.min(1, progress * 1.5),
            ),
          );
          const characters = Array.from({ length }, (_, index) => {
            const targetCharacter = nextLabel[index];
            const settlePoint = 0.17 + ((index + 1) / nextLabel.length) * 0.77;

            if (targetCharacter && progress >= settlePoint)
              return targetCharacter;
            if (progress < 0.11 && index < previousLabel.length)
              return previousLabel[index];
            if (targetCharacter === " ") return " ";
            return hackerCharacters.charAt(
              Math.floor(Math.random() * hackerCharacters.length),
            );
          });
          setLabel(characters.join(""));
        }

        if (progress < 1) {
          frameId = window.requestAnimationFrame(draw);
        } else {
          currentLabel = nextLabel;
          setLabel(nextLabel);
          setScrambling(false);
          timeoutId = window.setTimeout(transitionToNext, 1400);
        }
      };

      frameId = window.requestAnimationFrame(draw);
    };

    // Allow all three original hero lines to finish their opening reveal.
    timeoutId = window.setTimeout(transitionToNext, 3100);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [reduced]);

  return { label, scrambling };
}

function qualityReveal(
  direction: QualityDirection = "up",
  delay = 0,
  reduced = false,
  amount = 0.16,
) {
  const offsetX = direction === "left" ? -34 : direction === "right" ? 34 : 0;
  return {
    initial: reduced
      ? (false as const)
      : {
          opacity: 0,
          x: offsetX,
          y: direction === "up" ? 34 : 0,
          filter: "blur(6px)",
        },
    whileInView: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
    viewport: { once: false, amount, margin: "0px 0px -10% 0px" },
    transition: {
      duration: reduced ? 0 : 0.92,
      delay: reduced ? 0 : delay,
      ease: qualityEase,
    },
  };
}

function qualityHeroEnter(reduced: boolean, delay = 0, y = 16) {
  return {
    initial: reduced
      ? (false as const)
      : { opacity: 0, y, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduced ? 0 : 0.95,
      delay: reduced ? 0 : delay,
      ease: qualityEase,
    },
  };
}

// Surface centers measured in the original 4168 × 2443 artwork.
const isoAnchors = [
  { left: "56.04%", top: "61.37%" },
  { left: "67.01%", top: "49.76%" },
  { left: "77.64%", top: "38.51%" },
];
const qualityCards = [
  {
    value: "%100",
    title: "Hydraulic Test Coverage",
    description:
      "Every manufactured pump is verified in our ISO 9906 closed-loop test facility.",
  },
  {
    value: "14+",
    title: "Global Type Approvals & Systems",
    description:
      "TÜV NORD, TÜRKAK, TSE, CE, ErP, NFPA 20, EAC, SASO certified.",
  },
  {
    value: "EN 10204",
    title: "3.1 / 3.2 Material Traceability",
    description:
      "Full chemical and mechanical traceability from melt heat to finished pump.",
  },
  {
    value: "Class 1 & 2",
    title: "ISO 9906 Grade 1 & 2 Testing",
    description:
      "TÜV NORD, TÜRKAK, TSE, CE, ErP, NFPA 20, EAC, SASO certified.",
  },
];
type QualityStage = {
  id: number;
  number: string;
  title: string;
  titleLines?: string[];
  image: string;
  description: string;
  equipment: string;
  checks: string[];
  standards: string[];
  caption: string;
};
const exampleQualityStage: QualityStage = {
  id: 1,
  number: "01",
  title: "Spectrometric & Metallurgical Ingot Analysis",
  titleLines: ["Spectrometric &", "Metallurgical Ingot", "Analysis"],
  // Pre-encoded copy of the supplied PNG avoids repeated processing of the 38MB source.
  image: "/quality/Kalite kontrol-01.webp",
  description:
    "In-house chemical composition and microstructure verification before casting",
  equipment:
    "Optical Emission Spectrometer & Metallurgical Microstructure Analyzer",
  checks: [
    "Calibrated Metrology & SCADA Logging",
    "Lifetime Digital Traceability & Archiving",
  ],
  standards: [
    "ASTM A890 / A995",
    "EN 1561 / EN 1563",
    "DIN 17007 / All Standards",
  ],
  caption:
    "Before induction melting, optical emission spectrometers verify the exact alloy composition of ductile iron, bronze, duplex stainless, and alloy steels in compliance with EN and ASTM standards.",
};
// 02 and 03 deliberately repeat the first stage for the slider preview.
const qualityStages: (QualityStage | null)[] = [
  ...[1, 2, 3].map((id) => ({
    ...exampleQualityStage,
    id,
    number: String(id).padStart(2, "0"),
  })),
  null,
  null,
];
const certificateIcons = {
  iso: "/quality/ISO.png",
  ce: "/quality/Group%20(4).png",
  erp: "/quality/ErP%202009%20125%20EC%201.png",
  tse: "/quality/Group%20(6).png",
  nfpa: "/quality/NFPA_logo%201.png",
  eac: "/quality/EAC_b-on-w%201.png",
};
const certificates = [
  {
    title: "ISO 9001:2015",
    description: "Quality Management System Certificate",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 14001:2015",
    description: "Environmental Management System Certificate",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 45001:2018",
    description: "Occupational Health & Safety Management System",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 50001:2018",
    description: "Energy Management System Certificate",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 14064-1:2018",
    description: "Corporate GHG (Carbon Footprint) Verification Statement",
    icon: certificateIcons.iso,
  },
  {
    title: "CE 2006/42/AT",
    description: "EU Machinery Directive 2006/42/EC Declaration of Conformity",
    icon: certificateIcons.ce,
  },
  {
    title: "ErP 2009/125/EC",
    description: "Ecodesign Directive & MEI Minimum Efficiency Index",
    icon: certificateIcons.erp,
  },
  {
    title: "TSE & TSEK",
    description: "Turkish Standards Institute (TSE) Product Conformity",
    icon: certificateIcons.tse,
  },
  {
    title: "NFPA 20 & UL/FM",
    description: "Fire Protection Systems & NFPA 20 Standards Compliance",
    icon: certificateIcons.nfpa,
  },
  {
    title: "EAC & GOST-R",
    description: "Eurasian Customs Union (EAC) & GOST-R Conformity",
    icon: certificateIcons.eac,
  },
];
const qualityPolicyImage = "/quality/policy.webp";
const exampleQualityPolicy = {
  id: "quality-management",
  title: "Quality Management System",
  image: qualityPolicyImage,
  imageAlt: "Silver and blue first-place quality medal with two ribbons",
  progress: 21,
  statements: [
    "To be a reliable and sought-after company in all processes, adopting an approach that fully meets customer needs and expectations,",
    "To closely follow and implement technological developments in order to reduce costs and increase market share and profitability,",
    "To continuously improve the quality management system within the framework of quality systems by emphasizing teamwork, enabling all employees to become more competent individuals who can utilize their abilities at the highest level,",
    "To establish awareness of quality, environment, and occupational health and safety among all employees,",
    "To maintain strong cooperation based on commercial relationships with customers and suppliers,",
    "To produce the most appropriate, most accurate, and most economical solutions in the fastest way possible and to prevent potential nonconformities,",
    "To complete every order undertaken in a timely manner, using the highest level of technical methods and in accordance with the required quality standards,",
    "To comply with nuclear safety requirements and ensure that other priorities do not compromise nuclear safety,",
    "To be an exemplary organization that commits to fulfilling all applicable requirements with respect for the society and the environment in which we operate, has adopted this as its QUALITY POLICY.",
  ],
  signatoryRole: "Chairman of the Board",
  signatory: "Seyit Mehmet Ferahkaya",
};
// Each view has its own editorial perspective. The medal image stays constant.
const qualityPolicies = [
  { ...exampleQualityPolicy, id: "quality-management-1" },
  {
    ...exampleQualityPolicy,
    id: "quality-management-2",
    statements: [
      "To embed quality into every engineering decision, from initial hydraulic design reviews to the final verification of finished products,",
      "To strengthen process capability through documented controls, measurable targets, and consistent manufacturing practices,",
      "To preserve material and component traceability throughout procurement, production, inspection, and delivery,",
      "To use testing, calibration, and objective performance data as the foundation for reliable technical decisions,",
      "To examine nonconformities systematically, address their root causes, and prevent recurrence through effective corrective action,",
      "To connect design, foundry, machining, assembly, and quality teams around shared requirements and clear communication,",
      "To foster a working environment where safety, accountability, and responsible use of resources are considered at every stage,",
      "To maintain open, solution-oriented relationships with customers and suppliers while honoring agreed specifications and timelines,",
      "To make continuous improvement an everyday engineering discipline, delivering dependable and repeatable outcomes for every project.",
    ],
    signatoryRole: "Quality & Engineering Perspective",
    signatory: "Muzaffer Ferahkaya",
  },
  {
    ...exampleQualityPolicy,
    id: "quality-management-3",
    statements: [
      "To listen attentively to customers and translate their expectations into clear, achievable quality objectives across the organization,",
      "To encourage employees to question established processes, share ideas, and take ownership of meaningful improvements,",
      "To promote a culture of trust in which accurate documentation, transparent communication, and ethical conduct guide our work,",
      "To invest in the development of people and the transfer of knowledge between experienced specialists and emerging talent,",
      "To reduce preventable waste and use energy, materials, and other resources with care throughout the product lifecycle,",
      "To evaluate feedback and service insights as opportunities to enhance products, processes, and the customer experience,",
      "To maintain constructive partnerships with suppliers and stakeholders built on mutual respect and long-term reliability,",
      "To place occupational health, environmental responsibility, and applicable requirements alongside product excellence,",
      "To carry a shared commitment to quality into the future through learning, collaboration, and lasting value for the communities we serve.",
    ],
    signatoryRole: "People & Continuous Improvement Perspective",
    signatory: "Almila Ferahkaya",
  },
];
function CertificatesSection() {
  const reduced = useReducedMotion() ?? false;
  const [visibleCount, setVisibleCount] = useState(10);
  const [feedback, setFeedback] = useState("");
  const certificateTrack = useRef<HTMLDivElement>(null);
  const [certificatePage, setCertificatePage] = useState(0);
  const visibleCertificates = certificates.slice(0, visibleCount);
  const certificatePageCount = Math.ceil(visibleCertificates.length / 2);
  const scrollCertificates = (page: number) => {
    const track = certificateTrack.current;
    const orderedCards = track
      ? Array.from(track.children)
          .map((child) => child as HTMLElement)
          .sort((a, b) => a.offsetLeft - b.offsetLeft)
      : [];
    const card = orderedCards[page * 2];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - orderedCards[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const loadMore = () => {
    if (visibleCount < certificates.length) {
      setVisibleCount(Math.min(visibleCount + 10, certificates.length));
      setFeedback("");
    } else {
      setFeedback("All certificates are displayed.");
    }
  };
  return (
    <section
      className="quality-certificates"
      aria-labelledby="quality-certificates-title"
    >
      <div className="quality-certificates-heading [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:25px] [.quality-page_&]:[margin-bottom:calc(70_*_var(--compliance-unit))] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:0] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[color:#0d5792]! [.quality-page_&_h2]:[font-size:calc(25_*_var(--compliance-unit))]! [.quality-page_&_h2]:[font-weight:540]! [.quality-page_&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.quality-page_&_h2]:[line-height:1.12]! [.quality-page_&_h2]:[letter-spacing:0] [.quality-page_&_>_p]:[flex-shrink:0] [.quality-page_&_>_p]:[margin-top:0] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#0d5792]! [.quality-page_&_>_p]:[font-size:calc(12_*_var(--compliance-unit))]! [.quality-page_&_>_p]:[text-align:right] max-md:[.quality-page_&]:[flex-direction:column] max-md:[.quality-page_&]:[align-items:center] max-md:[.quality-page_&]:[gap:16px] max-md:[.quality-page_&_h2]:[font-size:21px]! max-md:[.quality-page_&]:[margin-bottom:36px] max-md:[.quality-page_&]:[text-align:center] max-md:[.quality-page_&_>_p]:[font-size:10px]! max-md:[.quality-page_&_>_p]:[text-align:center]">
        <motion.h2
          id="quality-certificates-title"
          {...qualityReveal("left", 0.02, reduced, 0.18)}
        >
          Accredited Certificates &amp; Compliance Portfolio
        </motion.h2>
        <motion.p {...qualityReveal("right", 0.12, reduced, 0.18)}>
          Showing {visibleCertificates.length} Certificates
        </motion.p>
      </div>
      <div
        className="quality-certificate-grid [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:repeat(5,_minmax(0,_1fr))] [.quality-page_&]:[gap:calc(15_*_var(--compliance-unit))] max-xl:[.quality-page_&]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-md:[.quality-page_&]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-md:[.quality-page_&]:[gap:12px] max-sm:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[position:relative] max-md:[.quality-page_&]:[display:flex]! max-md:[.quality-page_&]:[overflow-x:auto] max-md:[.quality-page_&]:[scroll-snap-type:x_mandatory] max-md:[.quality-page_&]:[scrollbar-width:none] max-md:[.quality-page_&]:[padding-top:4px] max-md:[.quality-page_&]:[padding-right:0] max-md:[.quality-page_&]:[padding-bottom:12px] max-md:[.quality-page_&]:[padding-left:0] max-md:[.quality-page_&::-webkit-scrollbar]:[display:none]!"
        ref={certificateTrack}
        onScroll={() => {
          const track = certificateTrack.current;
          if (!track || !track.children[1]) return;
          const stride =
            (track.children[0] as HTMLElement).getBoundingClientRect().width +
            parseFloat(getComputedStyle(track).columnGap);
          setCertificatePage(
            Math.min(
              certificatePageCount - 1,
              Math.round(track.scrollLeft / (stride * 2)),
            ),
          );
        }}
      >
        {visibleCertificates.map((certificate, index) => (
          <motion.article
            {...qualityReveal("up", (index % 5) * 0.055, reduced, 0.16)}
            className="quality-certificate [.quality-page_&]:[min-width:0] [.quality-page_&]:[min-height:calc(149_*_var(--compliance-unit))] [.quality-page_&]:[padding-top:calc(23_*_var(--compliance-unit))] [.quality-page_&]:[padding-right:calc(25_*_var(--compliance-unit))] [.quality-page_&]:[padding-bottom:calc(23_*_var(--compliance-unit))] [.quality-page_&]:[padding-left:calc(25_*_var(--compliance-unit))] [.quality-page_&]:[border:1px_solid_#9eb7d0] [.quality-page_&]:[border-radius:calc(15_*_var(--compliance-unit))] [.quality-page_&]:[background:#ffffff4d] [.quality-page_&]:[backdrop-filter:blur(30px)] [.quality-page_&]:[transition:transform_300ms_ease,_background-color_300ms_ease,_border-color_300ms_ease,_box-shadow_300ms_ease] [.quality-page_&_h3]:[margin-top:0] [.quality-page_&_h3]:[margin-right:0] [.quality-page_&_h3]:[margin-bottom:0] [.quality-page_&_h3]:[margin-left:0] [.quality-page_&_h3]:[color:#0d5792]! [.quality-page_&_h3]:[font-size:calc(15_*_var(--compliance-unit))]! [.quality-page_&_h3]:[font-weight:410]! [.quality-page_&_h3]:[line-height:1]! [.quality-page_&_h3]:[white-space:pre-line] [.quality-page_&_img]:[flex-shrink:0] [.quality-page_&_img]:[width:calc(30_*_var(--compliance-unit))] [.quality-page_&_img]:[height:calc(30_*_var(--compliance-unit))] [.quality-page_&_img]:[object-fit:contain] [.quality-page_&_>_p]:[margin-top:calc(20_*_var(--compliance-unit))] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#27272a]! [.quality-page_&_>_p]:[font-size:calc(12_*_var(--compliance-unit))]! [.quality-page_&_>_p]:[line-height:1]! [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[background:#ffffff80] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[border-color:#4687b8] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[transform:translateY(-4px)] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[box-shadow:0_8px_24px_#005eff1a] max-md:[.quality-page_&]:[padding-top:20px] max-md:[.quality-page_&]:[padding-right:18px] max-md:[.quality-page_&]:[padding-bottom:20px] max-md:[.quality-page_&]:[padding-left:18px] max-md:[.quality-page_&]:[min-height:145px] max-md:[.quality-page_&_h3]:[flex:1_1_85px]      motion-reduce:[.quality-page_&]:[transition:none] max-md:[.quality-page_&]:[order:var(--mobile-certificate-order)] max-md:[.quality-page_&]:[flex:0_0_66%] max-md:[.quality-page_&]:[scroll-snap-align:start] max-md:[.quality-page_&_h3]:[font-size:13px]! max-md:[.quality-page_&_>_p]:[font-size:11px]! max-md:[.quality-page_&_img]:[width:27px] max-md:[.quality-page_&_img]:[height:27px]"
            key={certificate.title}
            style={
              {
                "--mobile-certificate-order":
                  index < 10 ? (index % 5) * 2 + Math.floor(index / 5) : index,
              } as CSSProperties
            }
          >
            <div className="quality-certificate-top [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:start] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:8px] max-md:[.quality-page_&]:[flex-wrap:wrap]">
              <h3>{certificate.title.replace(/^(ISO|CE|ErP) /, "$1\n")}</h3>
              <Image
                src={certificate.icon}
                alt={`${certificate.title} certification mark`}
                width={30}
                height={30}
                sizes="30px"
              />
            </div>
            <p>{certificate.description}</p>
          </motion.article>
        ))}
      </div>
      <nav
        className="quality-certificate-pagination [.quality-page_&]:[display:none]! max-md:[.quality-page_&]:[display:flex]! max-md:[.quality-page_&]:[justify-content:center] max-md:[.quality-page_&]:[gap:2px] max-md:[.quality-page_&]:[margin-top:10px] max-md:[.quality-page_&_button]:[width:26px] max-md:[.quality-page_&_button]:[height:28px] max-md:[.quality-page_&_button]:[border:0] max-md:[.quality-page_&_button]:[padding-top:10px] max-md:[.quality-page_&_button]:[padding-right:4px] max-md:[.quality-page_&_button]:[padding-bottom:10px] max-md:[.quality-page_&_button]:[padding-left:4px] max-md:[.quality-page_&_button]:[background:transparent] max-md:[.quality-page_&_button]:[cursor:pointer] max-md:[.quality-page_&_span]:[display:block]! max-md:[.quality-page_&_span]:[height:4px] max-md:[.quality-page_&_span]:[border-radius:3px] max-md:[.quality-page_&_span]:[background:#d5dfe7] max-md:[.quality-page_&_button[aria-current='page']_span]:[background:#9eb7d0]"
        aria-label="Certificate pages"
      >
        {Array.from({ length: certificatePageCount }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show certificate page ${index + 1}`}
            aria-current={certificatePage === index ? "page" : undefined}
            onClick={() => scrollCertificates(index)}
          >
            <span />
          </button>
        ))}
      </nav>
      <motion.div
        {...qualityReveal("up", 0.06, reduced, 0.3)}
        className="quality-certificate-actions [.quality-page_&]:[position:relative] [.quality-page_&]:[display:flex]! [.quality-page_&]:[justify-content:center] [.quality-page_&]:[margin-top:calc(70_*_var(--compliance-unit))] max-md:[.quality-page_&]:[margin-top:28px]"
      >
        <LoadMoreButton onClick={loadMore} />
        <p
          className="quality-certificate-status [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:calc(100%_+_12px)] [.quality-page_&]:[left:0] [.quality-page_&]:[right:0] [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#0d5792]! [.quality-page_&]:[font-size:12px]! [.quality-page_&]:[text-align:center]"
          role="status"
        >
          {feedback}
        </p>
      </motion.div>
    </section>
  );
}
function QualityPolicySection() {
  const reduced = useReducedMotion() ?? false;
  const [activePolicy, setActivePolicy] = useState(0);
  const [direction, setDirection] = useState(1);
  const policy = qualityPolicies[activePolicy];
  const changePolicy = (index: number) => {
    if (!qualityPolicies[index]) return;
    setDirection(index > activePolicy ? 1 : -1);
    setActivePolicy(index);
  };
  return (
    <motion.section
      {...qualityReveal("up", 0.04, reduced, 0.12)}
      className="quality-policy [.quality-page_&]:[margin-top:calc(100_*_var(--compliance-unit))] max-md:[.quality-page_&]:[margin-top:70px]"
      aria-label="Quality policies"
      aria-roledescription="carousel"
    >
      <div
        className="quality-policy-slide [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:minmax(0,_372fr)_minmax(0,_750fr)] [.quality-page_&]:[align-items:start] [.quality-page_&]:[gap:calc(68_*_var(--compliance-unit))] [.quality-page_&]:[min-height:calc(450_*_var(--compliance-unit))] max-xl:[.quality-page_&]:[grid-template-columns:minmax(0,1fr)_minmax(0,2fr)] max-xl:[.quality-page_&]:[gap:35px] max-md:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[gap:36px] motion-reduce:[.quality-page_&]:[animation:none] md:max-lg:[.quality-page_&]:[grid-template-columns:minmax(0,_1fr)] md:max-lg:[.quality-page_&]:[gap:36px]"
        role="group"
        aria-label={`Quality policy ${activePolicy + 1} of ${qualityPolicies.length}`}
      >
        <div className="quality-policy-image [.quality-page_&]:[position:relative] [.quality-page_&]:[width:100%] [.quality-page_&]:[height:calc(424_*_var(--compliance-unit))] [.quality-page_&]:[margin-top:calc(35_*_var(--compliance-unit))] [.quality-page_&]:[filter:drop-shadow(0_12px_12px_#0d579212)] [.quality-page_&_img]:[object-fit:contain] max-md:[.quality-page_&]:[width:min(420px,_calc(100%_+_40px))] max-md:[.quality-page_&]:[max-width:none] max-md:[.quality-page_&]:[height:auto] max-md:[.quality-page_&]:[margin-top:0] max-md:[.quality-page_&]:[margin-right:auto] max-md:[.quality-page_&]:[margin-bottom:0] max-md:[.quality-page_&]:[margin-left:50%] max-md:[.quality-page_&]:[aspect-ratio:1920_/_2192] max-md:[.quality-page_&]:[transform:translateX(-50%)] md:max-lg:[.quality-page_&]:[width:310px] md:max-lg:[.quality-page_&]:[max-width:100%] md:max-lg:[.quality-page_&]:[height:354px] md:max-lg:[.quality-page_&]:[margin-top:0] md:max-lg:[.quality-page_&]:[margin-right:auto] md:max-lg:[.quality-page_&]:[margin-bottom:0] md:max-lg:[.quality-page_&]:[margin-left:auto]">
          <Image
            src={qualityPolicyImage}
            alt={exampleQualityPolicy.imageAlt}
            fill
            unoptimized
            sizes="(max-width: 1023px) 310px, 26vw"
          />
        </div>
        <div className="quality-policy-content [.quality-page_&]:[min-width:0] max-md:[.quality-page_&_>_div[aria-live]]:[width:90%] max-md:[.quality-page_&_>_div[aria-live]]:[max-width:330px] max-md:[.quality-page_&_>_div[aria-live]]:[margin-left:auto] max-md:[.quality-page_&_>_div[aria-live]]:[margin-right:auto] md:max-lg:[.quality-page_&]:[width:100%] md:max-lg:[.quality-page_&]:[max-width:680px] md:max-lg:[.quality-page_&]:[margin-left:auto] md:max-lg:[.quality-page_&]:[margin-right:auto]">
          <div className="quality-policy-heading [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:20px] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:0] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[color:#0d5792]! [.quality-page_&_h2]:[font-weight:410]! [.quality-page_&_h2]:[font-size:calc(20_*_var(--compliance-unit))]! [.quality-page_&_h2]:[line-height:1.12]!   max-md:[.quality-page_&]:[flex-direction:column] max-md:[.quality-page_&]:[align-items:center] max-md:[.quality-page_&]:[text-align:center] max-md:[.quality-page_&]:[gap:18px] max-md:[.quality-page_&_h2]:[font-size:19px]! md:max-lg:[.quality-page_&]:[justify-content:center] md:max-lg:[.quality-page_&]:[flex-direction:column] md:max-lg:[.quality-page_&]:[text-align:center] md:max-lg:[.quality-page_&]:[gap:18px]">
            <h2>{policy.title}</h2>
            <div className="quality-policy-arrows [.quality-page_&]:[display:flex]! [.quality-page_&]:[flex-shrink:0] [.quality-page_&]:[gap:20px] [.quality-page_&_button]:[display:grid]! [.quality-page_&_button]:[place-items:center] [.quality-page_&_button]:[width:24px] [.quality-page_&_button]:[height:28px] [.quality-page_&_button]:[padding-top:0] [.quality-page_&_button]:[padding-right:0] [.quality-page_&_button]:[padding-bottom:0] [.quality-page_&_button]:[padding-left:0] [.quality-page_&_button]:[border:0] [.quality-page_&_button]:[background:transparent] [.quality-page_&_button]:[color:#9eb7d0]! [.quality-page_&_button]:[cursor:pointer] [.quality-page_&_button]:[transition:color_250ms_ease] [.quality-page_&_svg]:[width:22px] [.quality-page_&_svg]:[height:22px] [.quality-page_&_button:disabled]:[opacity:.5] [.quality-page_&_button:disabled]:[cursor:not-allowed] [.quality-page_&_button:not(:disabled):hover]:[color:#0d5792]! max-md:[.quality-page_&]:[gap:24px] max-md:[.quality-page_&_button]:[width:36px] max-md:[.quality-page_&_button]:[height:36px] max-md:[.quality-page_&_svg]:[width:32px] max-md:[.quality-page_&_svg]:[height:32px]">
              <button
                type="button"
                aria-label="Previous quality policy"
                disabled={activePolicy === 0}
                onClick={() => changePolicy(activePolicy - 1)}
              >
                <LuArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next quality policy"
                disabled={activePolicy === qualityPolicies.length - 1}
                onClick={() => changePolicy(activePolicy + 1)}
              >
                <LuArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className="quality-policy-progress [.quality-page_&]:[height:3px] [.quality-page_&]:[margin-top:calc(20_*_var(--compliance-unit))] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:calc(20_*_var(--compliance-unit))] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[border-radius:2px] [.quality-page_&]:[background:#9eb7d0] [.quality-page_&_span]:[display:block]! [.quality-page_&_span]:[height:100%] [.quality-page_&_span]:[background:#0d5792] [.quality-page_&_span]:[transition:width_450ms_ease] motion-reduce:[.quality-page_&_span]:[transition:none] max-md:[.quality-page_&]:[margin-top:26px] max-md:[.quality-page_&]:[margin-right:0] max-md:[.quality-page_&]:[margin-bottom:36px] max-md:[.quality-page_&]:[margin-left:0]"
            role="progressbar"
            aria-label="Quality policy position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              qualityPolicies.length === 1
                ? policy.progress
                : ((activePolicy + 1) / qualityPolicies.length) * 100
            }
          >
            <motion.span
              initial={false}
              animate={{
                width: `${qualityPolicies.length === 1 ? policy.progress : ((activePolicy + 1) / qualityPolicies.length) * 100}%`,
              }}
              transition={{ duration: reduced ? 0 : 0.65, ease: qualityEase }}
            />
          </div>
          <div aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={policy.id}
                initial={
                  reduced
                    ? false
                    : {
                        opacity: 0,
                        x: direction * 15,
                        y: 18,
                        filter: "blur(8px)",
                      }
                }
                animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                exit={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: 0,
                        x: -direction * 12,
                        y: -13,
                        filter: "blur(6px)",
                      }
                }
                transition={{ duration: reduced ? 0 : 0.42, ease: qualityEase }}
              >
                <ul className="quality-policy-statements [.quality-page_&]:[display:grid]! [.quality-page_&]:[gap:calc(2_*_var(--compliance-unit))] [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[padding-top:0] [.quality-page_&]:[padding-right:0] [.quality-page_&]:[padding-bottom:0] [.quality-page_&]:[padding-left:17px] [.quality-page_&]:[color:#000]! [.quality-page_&]:[font-size:calc(15_*_var(--compliance-unit))]! [.quality-page_&]:[line-height:1]! [.quality-page_&]:[list-style:disc] max-md:[.quality-page_&]:[line-height:1.05]! max-md:[.quality-page_&]:[gap:2px] max-md:[.quality-page_&]:[font-size:14px]! md:max-lg:[.quality-page_&]:[line-height:1.2]! md:max-lg:[.quality-page_&]:[gap:10px]">
                  {policy.statements.map((statement, index) => (
                    <motion.li
                      key={statement}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.5,
                        delay: reduced ? 0 : 0.08 + index * 0.028,
                        ease: qualityEase,
                      }}
                    >
                      {statement}
                    </motion.li>
                  ))}
                </ul>
                <div className="quality-policy-signature [.quality-page_&]:[margin-top:20px] [.quality-page_&]:[color:#000]! [.quality-page_&_p]:[margin-top:0] [.quality-page_&_p]:[margin-right:0] [.quality-page_&_p]:[margin-bottom:0] [.quality-page_&_p]:[margin-left:0] [.quality-page_&_p]:[font-size:calc(9_*_var(--compliance-unit))]! [.quality-page_&_p]:[line-height:1.12]! [.quality-page_&_p_+_p]:[margin-top:6px] [.quality-page_&_p_+_p]:[font-size:calc(15_*_var(--compliance-unit))]! [.quality-page_&_p_+_p]:[font-weight:540]! [.quality-page_&_p_+_p]:[font-variation-settings:'wght'_540,_'wdth'_125]! max-md:[.quality-page_&_p_+_p]:[font-size:13px]!">
                  <p>{policy.signatoryRole}</p>
                  <p>{policy.signatory}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
// Standard Tailwind breakpoints keep the complete hero fitted to the viewport.
const qualityResponsive = [
  "lg:[&_.quality-hero]:[--quality-unit:min(0.0694444444vw,_0.1176470588svh,_1.777778px)]!",
  "lg:[&_.quality-hero]:[min-height:100svh]!",
  "lg:[&_.quality-hero]:[padding-top:calc(650_*_var(--quality-unit))]!",
  "lg:[&_.quality-hero]:[padding-bottom:calc(15_*_var(--quality-unit))]!",
  "lg:[&_.quality-scene]:[--quality-scene-unit:var(--quality-unit)]!",
  "lg:[&_.quality-scene]:[mask-image:linear-gradient(90deg,_transparent,_#000_6%,_#000_94%,_transparent)]!",
  "lg:[&_.quality-scene]:[width:calc(1440_*_var(--quality-unit))]!",
  "lg:[&_.quality-scene]:[left:50%]!",
  "lg:[&_.quality-scene]:[transform:translateX(-50%)]!",
  "lg:[&_.quality-introduction]:[top:max(calc(var(--quality-header-offset)_+_18px),_calc(190_*_var(--quality-unit)))]!",
  "lg:[&_.quality-introduction]:[left:calc((100%_-_1200_*_var(--quality-unit))_/_2)]!",
  "lg:[&_.quality-introduction]:[max-width:calc(560_*_var(--quality-unit))]!",
  "lg:[&_.quality-introduction_h1]:[font-size:calc(80_*_var(--quality-unit))]!",
].join(" ");

export default function QualityPage() {
  const reduced = useReducedMotion() ?? false;
  const { label: certificationLabel, scrambling: certificationScrambling } =
    useCertificationScramble(reduced);
  const pageRef = useRef<HTMLElement>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [stagePickerOpen, setStagePickerOpen] = useState(false);
  const [stageDirection, setStageDirection] = useState(1);
  const stage = qualityStages[stageIndex]!;
  const previousStage = qualityStages.findLastIndex(
    (item, index) => item !== null && index < stageIndex,
  );
  const nextStage = qualityStages.findIndex(
    (item, index) => item !== null && index > stageIndex,
  );
  const selectStage = (index: number) => {
    if (!qualityStages[index]) return;
    setStageDirection(index >= stageIndex ? 1 : -1);
    setStageIndex(index);
    setStagePickerOpen(false);
  };
  useEffect(() => {
    const page = pageRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!page || !header) return;
    const updateHeaderOffset = () => {
      const inFlow = !["absolute", "fixed"].includes(
        getComputedStyle(header).position,
      );
      page.style.setProperty(
        "--quality-header-offset",
        inFlow ? `${header.getBoundingClientRect().height}px` : "0px",
      );
    };
    updateHeaderOffset();
    const observer = new ResizeObserver(updateHeaderOffset);
    observer.observe(header);
    return () => observer.disconnect();
  }, [pageRef]);
  return (
    <main
      ref={pageRef}
      className={`${qualityResponsive} quality-page font-sans [html:has(&)]:[overflow-x:clip] [body:has(&)]:[overflow-x:clip] [--quality-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [--quality-header-offset:97px] [width:100%] [min-height:100svh] [margin-top:calc(-1_*_var(--quality-header-offset))] [background:#f7fbff] [letter-spacing:-0.04em] max-xl:[--quality-unit:1px] max-md:[background:linear-gradient(180deg,_#f7fbff,_transparent_580px),_linear-gradient(110deg,_#e2f1ff,_#c8e4ff_65%,_#e5f3ff)] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]`}
    >
      <section
        className="quality-hero [.quality-page_&]:[position:relative] [.quality-page_&]:[isolation:isolate] [.quality-page_&]:[width:100%] [.quality-page_&]:[min-height:calc(850_*_var(--quality-unit))] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[padding-top:calc(650_*_var(--quality-unit))] [.quality-page_&]:[padding-right:24px] [.quality-page_&]:[padding-bottom:calc(15_*_var(--quality-unit))] [.quality-page_&]:[padding-left:24px] max-xl:[.quality-page_&]:[min-height:850px] max-xl:[.quality-page_&]:[padding-top:630px] max-xl:[.quality-page_&]:[padding-bottom:48px] max-lg:[.quality-page_&]:[padding-top:570px] max-md:[.quality-page_&]:[min-height:0] max-md:[.quality-page_&]:[padding-top:600px] max-md:[.quality-page_&]:[padding-right:20px] max-md:[.quality-page_&]:[padding-bottom:0] max-md:[.quality-page_&]:[padding-left:20px] max-md:[.quality-page_&]:[background:transparent]"
        aria-labelledby="quality-title"
      >
        <div className="quality-scene [.quality-page_&]:[--quality-scene-unit:0.0694444444vw] [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:0] [.quality-page_&]:[top:0] [.quality-page_&]:[left:0] [.quality-page_&]:[width:100%] [.quality-page_&]:[aspect-ratio:4168_/_2443] max-md:[.quality-page_&]:[--quality-scene-unit:min(0.125vw,_0.5px)] max-md:[.quality-page_&]:[top:180px] max-md:[.quality-page_&]:[left:50%] max-md:[.quality-page_&]:[width:min(180%,_720px)] max-md:[.quality-page_&]:[transform:translateX(-67.2222%)]">
          <Image
            src="/quality/kalite-yonetimi.webp"
            alt="Three ascending white certification pillars with blue glass surfaces"
            fill
            unoptimized
            sizes="(max-width: 767px) 180vw, 100vw"
            preload
            className="quality-artwork [.quality-page_&]:[object-fit:contain] [.quality-page_&]:[object-position:center_top] [.quality-page_&]:[pointer-events:none] max-xl:[.quality-page_&]:[mask-image:linear-gradient(180deg,_#000_0%,_#000_62%,_#000000e6_72%,_#00000080_85%,_transparent_100%)] max-md:[.quality-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_15%,_#000_64%,_#000000e6_74%,_#00000080_86%,_transparent_100%)]"
          />
          {isoAnchors.map((anchor, index) => (
            <div
              className="quality-iso-marker [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:1] [.quality-page_&]:[display:flex]! [.quality-page_&]:[flex-direction:column] [.quality-page_&]:[align-items:center] [.quality-page_&]:[width:5.56%] [.quality-page_&]:[transform:translate(-50%,_-100%)] [.quality-page_&]:[pointer-events:none] [.quality-page_&_>_img]:[width:100%] [.quality-page_&_>_img]:[height:auto]"
              style={anchor}
              key={index}
              aria-hidden="true"
            >
              <Image
                src="/quality/ISO.png"
                alt=""
                width={210}
                height={208}
                sizes="(max-width: 767px) 45px, 6vw"
              />
              <span className="quality-iso-connector [.quality-page_&]:[position:relative] [.quality-page_&]:[width:1px] [.quality-page_&]:[height:calc(105_*_var(--quality-scene-unit))] [.quality-page_&]:[background:#005eff] [.quality-page_&_>_span]:[position:absolute] [.quality-page_&_>_span]:[left:50%] [.quality-page_&_>_span]:[bottom:calc(-3_*_var(--quality-scene-unit))] [.quality-page_&_>_span]:[width:calc(6_*_var(--quality-scene-unit))] [.quality-page_&_>_span]:[height:calc(6_*_var(--quality-scene-unit))] [.quality-page_&_>_span]:[border:1px_solid_#005eff] [.quality-page_&_>_span]:[border-radius:50%] [.quality-page_&_>_span]:[background:#72b4ff] [.quality-page_&_>_span]:[transform:translateX(-50%)]">
                <span />
              </span>
            </div>
          ))}
          <div className="quality-certification-badge [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:2] [.quality-page_&]:[top:70.8%] [.quality-page_&]:[left:75.4%] [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[gap:calc(8_*_var(--quality-scene-unit))] [.quality-page_&]:[width:calc(225_*_var(--quality-scene-unit))] [.quality-page_&]:[min-height:calc(47_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-top:calc(6_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-right:calc(10_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-bottom:calc(6_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-left:calc(10_*_var(--quality-scene-unit))] [.quality-page_&]:[border:0.25px_solid_#fff] [.quality-page_&]:[border-radius:calc(8_*_var(--quality-scene-unit))] [.quality-page_&]:[background:#ffffff26] [.quality-page_&]:[backdrop-filter:blur(12px)] [.quality-page_&]:[color:#4687b8]! [.quality-page_&]:[font-size:calc(12_*_var(--quality-scene-unit))]! [.quality-page_&]:[line-height:1.12]! [.quality-page_&_img]:[flex-shrink:0] [.quality-page_&_img]:[width:calc(34_*_var(--quality-scene-unit))] [.quality-page_&_img]:[height:auto] max-md:[.quality-page_&]:[left:50%] max-md:[.quality-page_&]:[top:84%] max-md:[.quality-page_&]:[width:270px] max-md:[.quality-page_&]:[min-height:56px] max-md:[.quality-page_&]:[gap:10px] max-md:[.quality-page_&]:[padding-top:8px] max-md:[.quality-page_&]:[padding-right:12px] max-md:[.quality-page_&]:[padding-bottom:8px] max-md:[.quality-page_&]:[padding-left:12px] max-md:[.quality-page_&]:[border-radius:10px] max-md:[.quality-page_&]:[font-size:12px]! max-md:[.quality-page_&_img]:[width:36px] max-md:[.quality-page_&]:[line-height:1.12]! max-md:[.quality-page_&]:[background:#ffffff40] max-sm:[.quality-page_&]:[width:235px] max-sm:[.quality-page_&]:[font-size:11px]!">
            <Image
              src="/quality/Frame%202398.png"
              alt=""
              width={160}
              height={157}
              sizes="34px"
            />
            <span>
              TÜV NORD • TÜRKAK
              <br className="quality-badge-break [.quality-page_&]:[display:none]! max-md:[.quality-page_&]:[display:block]!" />{" "}
              • TSE • CE
            </span>
          </div>
        </div>

        <div className="quality-introduction [.quality-page_&_h1_>_span]:[display:block]! [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:2] [.quality-page_&]:[top:calc(190_*_var(--quality-unit))] [.quality-page_&]:[left:calc(120_*_var(--quality-unit))] [.quality-page_&]:[max-width:calc(560_*_var(--quality-unit))] [.quality-page_&_h1]:[margin-top:0] [.quality-page_&_h1]:[margin-right:0] [.quality-page_&_h1]:[margin-bottom:0] [.quality-page_&_h1]:[margin-left:0] [.quality-page_&_h1]:[color:#005eff]! [.quality-page_&_h1]:[font-size:calc(80_*_var(--quality-unit))]! [.quality-page_&_h1]:[font-weight:410]! [.quality-page_&_h1]:[line-height:1]! [.quality-page_&_h1]:[letter-spacing:-0.04em] [.quality-page_&_>_p]:[width:calc(440_*_var(--quality-unit))] [.quality-page_&_>_p]:[max-width:100%] [.quality-page_&_>_p]:[margin-top:calc(30_*_var(--quality-unit))] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#9eb7d0]! [.quality-page_&_>_p]:[font-size:calc(15_*_var(--quality-unit))]! [.quality-page_&_>_p]:[line-height:1]! max-xl:[.quality-page_&]:[top:170px] max-xl:[.quality-page_&]:[left:7%] max-xl:[.quality-page_&]:[max-width:47%] max-xl:[.quality-page_&_h1]:[font-size:clamp(44px,_5.5vw,_66px)]! max-xl:[.quality-page_&_>_p]:[width:360px] max-xl:[.quality-page_&_>_p]:[font-size:14px]! max-xl:[.quality-page_&_>_p]:[line-height:1.2]! max-md:[.quality-page_&]:[top:130px] max-md:[.quality-page_&]:[left:24px] max-md:[.quality-page_&]:[max-width:calc(100%_-_48px)] max-md:[.quality-page_&_h1]:[font-size:clamp(24px,_6.7vw,_36px)]! max-md:[.quality-page_&_>_p]:[width:340px] max-md:[.quality-page_&_>_p]:[margin-top:22px] max-md:[.quality-page_&_>_p]:[font-size:14px]! max-md:[.quality-page_&_h1]:[line-height:1]! max-md:[.quality-page_&_h1_>_span:nth-child(-n+2)]:[display:inline]! max-md:[.quality-page_&_h1_>_span:first-child::after]:[content:'_'] max-md:[.quality-page_&_>_p]:[display:none]!">
          <motion.h1
            id="quality-title"
            aria-label="Quality Management Certifications"
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: reduced ? 0 : 0.18,
                  staggerChildren: reduced ? 0 : 0.17,
                },
              },
            }}
          >
            {heroWords.map((word) => (
              <span
                key={word}
                aria-hidden="true"
                className="block overflow-hidden pb-[0.09em] -mb-[0.09em]"
              >
                <motion.span
                  className="block will-change-transform"
                  variants={{
                    hidden: reduced
                      ? { opacity: 1, y: "0%" }
                      : {
                          opacity: 0,
                          y: "108%",
                          filter: "blur(10px)",
                          rotateX: -9,
                        },
                    visible: {
                      opacity: 1,
                      y: "0%",
                      filter: "blur(0px)",
                      rotateX: 0,
                      transition: {
                        duration: reduced ? 0 : 1.05,
                        ease: qualityEase,
                      },
                    },
                  }}
                >
                  {word === "Certifications" ? (
                    <span className="relative inline-block whitespace-nowrap align-baseline">
                      <span className="invisible" aria-hidden="true">
                        Certifications
                      </span>
                      <span
                        className="absolute inset-0 whitespace-nowrap"
                        aria-hidden="true"
                      >
                        {certificationLabel}
                        {certificationScrambling && (
                          <span className="ml-[0.05em] inline-block animate-pulse align-baseline text-[#0d5792]">
                            _
                          </span>
                        )}
                      </span>
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p {...qualityHeroEnter(reduced, 0.8, 22)}>
            Quality standards verified and audited by international independent
            certification bodies from design to dispatch.
          </motion.p>
        </div>

        <div
          className="quality-bottom-atmosphere [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:1] [.quality-page_&]:[top:auto] [.quality-page_&]:[right:0] [.quality-page_&]:[bottom:0] [.quality-page_&]:[left:0] [.quality-page_&]:[height:calc(250_*_var(--quality-unit))] [.quality-page_&]:[background:radial-gradient(ellipse_at_35%_24%,_#4a8dd82e,_transparent_68%),_linear-gradient(180deg,_#d6e7f300_0%,_#c6d9ed40_42%,_#f7fbff_100%)] [.quality-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_30%)] [.quality-page_&]:[pointer-events:none] max-lg:[.quality-page_&]:[height:480px] max-md:[.quality-page_&]:[height:calc(100%_-_500px)] max-md:[.quality-page_&]:[background:radial-gradient(ellipse_at_35%_10%,_#78ade51a,_transparent_65%)]"
          aria-hidden="true"
        />
        <div
          className="quality-cards [.quality-page_&]:[position:relative] [.quality-page_&]:[z-index:3] [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [.quality-page_&]:[gap:calc(17_*_var(--quality-unit))] [.quality-page_&]:[width:100%] [.quality-page_&]:[max-width:calc(1200_*_var(--quality-unit))] [.quality-page_&]:[margin-left:auto] [.quality-page_&]:[margin-right:auto] max-lg:[.quality-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-lg:[.quality-page_&]:[max-width:800px] max-lg:[.quality-page_&]:[gap:18px] max-md:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[gap:12px] max-md:[.quality-page_&]:[max-width:330px]"
          aria-label="Quality standards and certifications"
        >
          {qualityCards.map((card, index) => (
            <motion.article
              {...qualityReveal("up", index * 0.085, reduced, 0.22)}
              className="quality-card [container-type:inline-size] [.quality-page_&]:[position:relative] [.quality-page_&]:[isolation:isolate] [.quality-page_&]:[min-width:0] [.quality-page_&]:[min-height:calc(185_*_var(--quality-unit))] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[padding-top:calc(18_*_var(--quality-unit))] [.quality-page_&]:[padding-right:calc(25_*_var(--quality-unit))] [.quality-page_&]:[padding-bottom:calc(18_*_var(--quality-unit))] [.quality-page_&]:[padding-left:calc(25_*_var(--quality-unit))] [.quality-page_&]:[border:0.5px_solid_#f7f7f7] [.quality-page_&]:[border-radius:calc(30_*_var(--quality-unit))] [.quality-page_&]:[background:#ffffff26] [.quality-page_&]:[backdrop-filter:blur(14px)] [.quality-page_&]:[box-shadow:inset_0_1px_15px_#ffffff26,_0_8px_24px_#4274a30a] [.quality-page_&]:[transition:box-shadow_450ms_cubic-bezier(0.22,_1,_0.36,_1),_border-color_450ms_cubic-bezier(0.22,_1,_0.36,_1)] [.quality-page_&::before]:[content:''] [.quality-page_&::before]:[position:absolute] [.quality-page_&::before]:[z-index:-1] [.quality-page_&::before]:[top:0] [.quality-page_&::before]:[right:0] [.quality-page_&::before]:[bottom:0] [.quality-page_&::before]:[left:0] [.quality-page_&::before]:[border-radius:inherit] [.quality-page_&::before]:[background:linear-gradient(180deg,_#ffffff2e_0%,_#a3c8fa73_45%,_#4084ffe6_100%)] [.quality-page_&::before]:[opacity:0] [.quality-page_&::before]:[transition:opacity_450ms_cubic-bezier(0.22,_1,_0.36,_1)] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:calc(12_*_var(--quality-unit))] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[color:#4687b8]! [.quality-page_&_h2]:[font-size:calc(20_*_var(--quality-unit))]! [.quality-page_&_h2]:[font-weight:410]! [.quality-page_&_h2]:[line-height:1]! [.quality-page_&_h2]:[letter-spacing:-0.04em] [.quality-page_&[data-highlighted='true']::before]:[opacity:1] [.quality-page_&[data-highlighted='true']]:[border-color:#ffffffcc] [.quality-page_&[data-highlighted='true']]:[box-shadow:inset_0_1px_15px_#ffffff26,_0_10px_30px_#005eff26] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover::before]:[opacity:1] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[border-color:#ffffffcc] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[box-shadow:inset_0_1px_15px_#ffffff26,_0_10px_30px_#005eff26] max-md:[.quality-page_&]:[min-height:155px] max-md:[.quality-page_&]:[padding-top:20px] max-md:[.quality-page_&]:[padding-right:22px] max-md:[.quality-page_&]:[padding-bottom:20px] max-md:[.quality-page_&]:[padding-left:22px] max-md:[.quality-page_&_h2]:[font-size:17px]! max-md:[.quality-page_&]:[background:#ffffff33] max-md:[.quality-page_&]:[box-shadow:inset_0_0_28px_#ffffff40,_0_10px_25px_#0d579212] max-md:[.quality-page_&:nth-child(1)]:[order:4] max-md:[.quality-page_&_h2]:[margin-bottom:10px] max-md:[.quality-page_&[data-highlighted='true']_h2]:[color:#f7f7f7]! motion-reduce:[.quality-page_&]:[transition:none] motion-reduce:[.quality-page_&::before]:[transition:none]"
              key={card.value}
              aria-labelledby={`quality-card-${index}-title`}
            >
              <p className="quality-card-value [font-size:min(30px,18cqw)]! md:[font-size:min(calc(36_*_var(--quality-unit)),18cqw)]! [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:calc(10_*_var(--quality-unit))] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#0d5792]! [.quality-page_&]:[font-size:calc(36_*_var(--quality-unit))]! [.quality-page_&]:[line-height:1]! [.quality-page_&]:[white-space:nowrap] max-md:[.quality-page_&]:[font-size:30px]! max-md:[.quality-page_&]:[margin-bottom:7px]">
                {card.value}
              </p>
              <h2 id={`quality-card-${index}-title`}>{card.title}</h2>
              <p className="quality-card-description [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#9eb7d0]! [.quality-page_&]:[font-size:calc(12_*_var(--quality-unit))]! [.quality-page_&]:[line-height:1.12]! [.quality-page_&]:[transition:color_450ms_cubic-bezier(0.22,_1,_0.36,_1)] [.quality-page_.quality-card[data-highlighted='true']_&]:[color:#f7fbff]! [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_.quality-card:hover_&]:[color:#f7fbff]! max-md:[.quality-page_&]:[font-size:12px]! max-md:[.quality-page_&]:[line-height:1.12]! max-md:[.quality-page_&]:[color:#9eb7d0]! max-md:[.quality-page_.quality-card[data-highlighted='true']_&]:[color:#f7f7f7]! motion-reduce:[.quality-page_&]:[transition:none]">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        className="quality-inspection [.quality-page_&]:[position:relative] [.quality-page_&]:[padding-top:85px] [.quality-page_&]:[padding-right:24px] [.quality-page_&]:[padding-bottom:100px] [.quality-page_&]:[padding-left:24px] [.quality-page_&]:[background:linear-gradient(180deg,_#f7fbff,_transparent_100px),_radial-gradient(ellipse_at_85%_45%,_#c4e2ffb3,_#e1f1ff73_45%,_transparent_80%),_linear-gradient(110deg,_#fff,_#f4faff_45%,_#d7ebff)] [.quality-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.quality-page_&_button:focus-visible]:[outline-offset:4px] max-md:[.quality-page_&]:[padding-top:65px] max-md:[.quality-page_&]:[padding-right:20px] max-md:[.quality-page_&]:[padding-bottom:65px] max-md:[.quality-page_&]:[padding-left:20px] max-md:[.quality-page_&]:[background:transparent]"
        aria-labelledby="quality-inspection-title"
      >
        <div className="quality-inspection-container [.quality-page_&]:[width:100%] [.quality-page_&]:[max-width:1200px] [.quality-page_&]:[margin-left:auto] [.quality-page_&]:[margin-right:auto]">
          <div className="quality-inspection-heading [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:minmax(0,_607px)_minmax(0,_349px)] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:40px] [.quality-page_&]:[margin-bottom:55px] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:0] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[font-size:50px]! [.quality-page_&_h2]:[font-weight:410]! [.quality-page_&_h2]:[line-height:1]! [.quality-page_&_h2]:[color:#0d5792]! [.quality-page_&_h2]:[letter-spacing:-0.04em] max-xl:[.quality-page_&]:[grid-template-columns:1.5fr_1fr] max-xl:[.quality-page_&]:[gap:32px] max-xl:[.quality-page_&_h2]:[font-size:40px]! max-md:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[gap:30px] max-md:[.quality-page_&]:[margin-bottom:32px] max-md:[.quality-page_&_h2]:[font-size:clamp(25px,_6.7vw,_36px)]!">
            <motion.h2
              id="quality-inspection-title"
              {...qualityReveal("left", 0.05, reduced, 0.25)}
            >
              5-Stage Zero-Defect
              <br />
              Quality Inspection &amp;
              <br />
              Verification Journey
            </motion.h2>
            <div className="quality-inspection-intro [.quality-page_&]:[padding-top:6px] [.quality-page_&_>_p]:[margin-top:38px] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#000]! [.quality-page_&_>_p]:[font-size:15px]! [.quality-page_&_>_p]:[line-height:1]! max-md:[.quality-page_&_>_p]:[max-width:349px] max-md:[.quality-page_&_>_p]:[margin-top:24px] max-md:[.quality-page_&_>_p]:[line-height:1.2]! max-md:[.quality-page_&_>_p]:[font-size:13px]!">
              <div
                className="quality-stage-picker [.quality-page_&]:[position:relative] [.quality-page_&]:[z-index:5] [.quality-page_&_>_button]:[width:151px] [.quality-page_&_>_button]:[min-height:24px] [.quality-page_&_>_button]:[padding-top:4px] [.quality-page_&_>_button]:[padding-right:6px] [.quality-page_&_>_button]:[padding-bottom:4px] [.quality-page_&_>_button]:[padding-left:6px] [.quality-page_&_>_button]:[border:0] [.quality-page_&_>_button]:[border-radius:8px] [.quality-page_&_>_button]:[background:#0d5792] [.quality-page_&_>_button]:[color:#fff]! [.quality-page_&_>_button]:[font-style:inherit] [.quality-page_&_>_button]:[font-variant:inherit] [.quality-page_&_>_button]:[font-weight:inherit]! [.quality-page_&_>_button]:[font-stretch:inherit]! [.quality-page_&_>_button]:[font-size:10px]! [.quality-page_&_>_button]:[line-height:inherit]! [.quality-page_&_>_button]:[font-family:inherit]! [.quality-page_&_>_button]:[font-feature-settings:inherit] [.quality-page_&_>_button]:[font-variation-settings:inherit]! [.quality-page_&_>_button]:[cursor:pointer]"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setStagePickerOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-expanded={stagePickerOpen}
                  aria-controls="quality-stage-options"
                  onClick={() => setStagePickerOpen(!stagePickerOpen)}
                >
                  Select a Stage to Explore
                </button>
                {stagePickerOpen && (
                  <div
                    id="quality-stage-options"
                    className="quality-stage-options [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:calc(100%_+_8px)] [.quality-page_&]:[right:0] [.quality-page_&]:[left:0] [.quality-page_&]:[min-width:260px] [.quality-page_&]:[padding-top:8px] [.quality-page_&]:[padding-right:8px] [.quality-page_&]:[padding-bottom:8px] [.quality-page_&]:[padding-left:8px] [.quality-page_&]:[border:1px_solid_#c4def2] [.quality-page_&]:[border-radius:12px] [.quality-page_&]:[background:#f7fbff] [.quality-page_&]:[box-shadow:0_8px_30px_#0d579226] [.quality-page_&_button]:[display:block]! [.quality-page_&_button]:[width:100%] [.quality-page_&_button]:[padding-top:10px] [.quality-page_&_button]:[padding-right:10px] [.quality-page_&_button]:[padding-bottom:10px] [.quality-page_&_button]:[padding-left:10px] [.quality-page_&_button]:[border:0] [.quality-page_&_button]:[border-radius:7px] [.quality-page_&_button]:[text-align:left] [.quality-page_&_button]:[color:#0d5792]! [.quality-page_&_button]:[background:transparent] [.quality-page_&_button]:[font-style:inherit] [.quality-page_&_button]:[font-variant:inherit] [.quality-page_&_button]:[font-weight:inherit]! [.quality-page_&_button]:[font-stretch:inherit]! [.quality-page_&_button]:[font-size:12px]! [.quality-page_&_button]:[line-height:inherit]! [.quality-page_&_button]:[font-family:inherit]! [.quality-page_&_button]:[font-feature-settings:inherit] [.quality-page_&_button]:[font-variation-settings:inherit]! [.quality-page_&_button]:[cursor:pointer] [.quality-page_&_button[aria-pressed='true']]:[background:#d7ebff] [.quality-page_&_button:disabled]:[color:#73879a]! [.quality-page_&_button:disabled]:[cursor:not-allowed]"
                    aria-label="Inspection stages"
                  >
                    {qualityStages.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={!item}
                        aria-pressed={index === stageIndex}
                        onClick={() => selectStage(index)}
                      >
                        {String(index + 1).padStart(2, "0")} —{" "}
                        {item?.title ?? "Not available yet"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <motion.p {...qualityReveal("right", 0.16, reduced, 0.25)}>
                Rigorous tolerances and digital verification from ingot
                spectrometry to dynamic balancing and final test certificates.
              </motion.p>
            </div>
          </div>

          <motion.div
            {...qualityReveal("up", 0.12, reduced, 0.11)}
            className="quality-inspection-slider [.quality-page_&]:[position:relative] [.quality-page_&]:[height:520px] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[border-radius:30px] [.quality-page_&]:[background:#222] max-md:[.quality-page_&]:[height:auto] max-md:[.quality-page_&]:[min-height:760px] max-md:[.quality-page_&]:[border-radius:22px] max-md:[.quality-page_&]:[background:#141a20]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Quality inspection stages"
          >
            <div className="quality-stage-visual [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:0] [.quality-page_&]:[right:0] [.quality-page_&]:[bottom:0] [.quality-page_&]:[left:0] max-md:[.quality-page_&]:[bottom:0] max-md:[.quality-page_&]:[height:auto] max-md:[.quality-page_&]:[top:0] max-md:[.quality-page_&]:[right:0] max-md:[.quality-page_&]:[left:0]">
              <Image
                src={stage.image}
                alt="Quality control technician analysing a sample through a laboratory microscope"
                fill
                unoptimized
                loading="lazy"
                sizes="(max-width: 767px) 100vw, (max-width: 1248px) 95vw, 1200px"
                className="quality-stage-photo [.quality-page_&]:[object-fit:cover] [.quality-page_&]:[object-position:center_25%] max-md:[.quality-page_&]:[object-position:62%_center]"
              />
            </div>
            <div
              className="quality-stage-slide [.quality-page_&]:[position:relative] [.quality-page_&]:[height:100%] [.quality-page_&]:animate-migrated-481f99f5f max-md:[.quality-page_&]:[min-height:760px] max-md:[.quality-page_&]:[padding-top:0] motion-reduce:[.quality-page_&]:[animation:none] max-md:[.quality-page_&]:[padding-bottom:25px]"
              key={stage.id}
              style={{ "--stage-direction": stageDirection } as CSSProperties}
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                className="quality-stage-shade [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:0] [.quality-page_&]:[right:0] [.quality-page_&]:[bottom:0] [.quality-page_&]:[left:0] [.quality-page_&]:[background:linear-gradient(90deg,_#222222fc_0%,_#222222f5_24%,_#222222b8_47%,_#2222222e_75%,_#0a131e1a_100%),_linear-gradient(0deg,_#0a131e80,_transparent_30%)] max-md:[.quality-page_&]:[background:linear-gradient(90deg,_#222222fa,_#222222d9_28%,_#22222288_60%,_#0a131e26),_linear-gradient(0deg,_#0a131ecc,_transparent_30%)]"
                aria-hidden="true"
              />
              <div className="quality-stage-content [.quality-page_&_h3_>_span]:[display:block]! [.quality-page_&]:[position:relative] [.quality-page_&]:[z-index:1] [.quality-page_&]:[width:445px] [.quality-page_&]:[max-width:100%] [.quality-page_&]:[padding-top:30px] [.quality-page_&]:[padding-right:35px] [.quality-page_&]:[padding-bottom:0] [.quality-page_&]:[padding-left:35px] [.quality-page_&_h3]:[max-width:370px] [.quality-page_&_h3]:[margin-top:14px] [.quality-page_&_h3]:[margin-right:0] [.quality-page_&_h3]:[margin-bottom:30px] [.quality-page_&_h3]:[margin-left:0] [.quality-page_&_h3]:[color:#9eb7d0]! [.quality-page_&_h3]:[font-size:25px]! [.quality-page_&_h3]:[font-weight:540]! [.quality-page_&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.quality-page_&_h3]:[line-height:1.12]! [.quality-page_&_h3]:[letter-spacing:0] max-md:[.quality-page_&]:[width:100%] max-md:[.quality-page_&]:[padding-top:26px] max-md:[.quality-page_&]:[padding-right:22px] max-md:[.quality-page_&]:[padding-bottom:0] max-md:[.quality-page_&]:[padding-left:22px] max-md:[.quality-page_&_h3]:[font-size:20px]! max-md:[.quality-page_&_h3]:[margin-bottom:28px] max-md:[.quality-page_&_h3]:[line-height:1.12]! max-md:[.quality-page_&_h3]:[margin-top:22px] max-md:[.quality-page_&_h3]:[margin-right:0] max-md:[.quality-page_&_h3]:[margin-left:0]">
                <span className="quality-stage-number [.quality-page_&]:[color:#9eb7d0]! [.quality-page_&]:[font-size:12px]! [.quality-page_&]:[line-height:1]!">
                  {stage.number}
                </span>
                <h3>
                  {stage.titleLines
                    ? stage.titleLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))
                    : stage.title}
                </h3>
                <p className="quality-stage-description [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#f7f7f7]! [.quality-page_&]:[font-size:15px]! [.quality-page_&]:[line-height:1]! max-md:[.quality-page_&]:[line-height:1.2]! max-md:[.quality-page_&]:[font-size:13px]! max-md:[.quality-page_&]:[max-width:270px]">
                  {stage.description}
                </p>
                <div className="quality-stage-equipment [.quality-page_&]:[margin-top:30px] [.quality-page_&_p]:[margin-top:0] [.quality-page_&_p]:[margin-right:0] [.quality-page_&_p]:[margin-bottom:0] [.quality-page_&_p]:[margin-left:0] [.quality-page_&_p]:[color:#9eb7d0]! [.quality-page_&_p]:[font-size:15px]! [.quality-page_&_p]:[line-height:1.12]! [.quality-page_&_ul]:[display:grid]! [.quality-page_&_ul]:[gap:10px] [.quality-page_&_ul]:[padding-top:0] [.quality-page_&_ul]:[padding-right:0] [.quality-page_&_ul]:[padding-bottom:0] [.quality-page_&_ul]:[padding-left:0] [.quality-page_&_ul]:[margin-top:18px] [.quality-page_&_ul]:[margin-right:0] [.quality-page_&_ul]:[margin-bottom:0] [.quality-page_&_ul]:[margin-left:0] [.quality-page_&_ul]:[list-style:none] [.quality-page_&_li]:[display:flex]! [.quality-page_&_li]:[align-items:center] [.quality-page_&_li]:[gap:10px] [.quality-page_&_li]:[color:#f7f7f7]! [.quality-page_&_li]:[font-size:11px]! [.quality-page_&_li]:[line-height:1.12]! [.quality-page_&_svg]:[flex-shrink:0] [.quality-page_&_svg]:[color:#00ff26]! max-md:[.quality-page_&]:[margin-top:36px] max-md:[.quality-page_&_p]:[font-size:12px]! max-md:[.quality-page_&_li]:[font-size:9px]! max-md:[.quality-page_&_li]:[gap:8px]">
                  <p className="quality-stage-equipment-label [.quality-page_.quality-stage-equipment_&]:[margin-bottom:12px] [.quality-page_.quality-stage-equipment_&]:[color:#00ff26]! [.quality-page_.quality-stage-equipment_&]:[font-size:10px]! max-md:[.quality-page_.quality-stage-equipment_&]:[font-size:8px]!">
                    TESTING METROLOGY &amp; EQUIPMENT
                  </p>
                  <p>{stage.equipment}</p>
                  <ul>
                    {stage.checks.map((check) => (
                      <li key={check}>
                        <LuShieldCheck size={24} aria-hidden="true" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="quality-stage-footer [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:1] [.quality-page_&]:[left:35px] [.quality-page_&]:[right:35px] [.quality-page_&]:[bottom:30px] [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:end] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:30px] max-xl:[.quality-page_&]:[align-items:start] max-md:[.quality-page_&]:[position:relative] max-md:[.quality-page_&]:[top:auto] max-md:[.quality-page_&]:[right:auto] max-md:[.quality-page_&]:[bottom:auto] max-md:[.quality-page_&]:[left:auto] max-md:[.quality-page_&]:[padding-top:120px] max-md:[.quality-page_&]:[padding-right:22px] max-md:[.quality-page_&]:[padding-bottom:35px] max-md:[.quality-page_&]:[padding-left:22px] max-md:[.quality-page_&]:[flex-direction:column] max-md:[.quality-page_&]:[gap:30px]">
                <div className="quality-stage-standards [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[gap:14px] [.quality-page_&]:[min-width:0] [.quality-page_&_>_span]:[color:#9eb7d0]! [.quality-page_&_>_span]:[font-size:9px]! [.quality-page_&_>_span]:[white-space:nowrap] [.quality-page_&_ul]:[display:flex]! [.quality-page_&_ul]:[flex-wrap:wrap] [.quality-page_&_ul]:[gap:10px] [.quality-page_&_ul]:[margin-top:0] [.quality-page_&_ul]:[margin-right:0] [.quality-page_&_ul]:[margin-bottom:0] [.quality-page_&_ul]:[margin-left:0] [.quality-page_&_ul]:[padding-top:0] [.quality-page_&_ul]:[padding-right:0] [.quality-page_&_ul]:[padding-bottom:0] [.quality-page_&_ul]:[padding-left:0] [.quality-page_&_ul]:[list-style:none] [.quality-page_&_li]:[padding-top:7px] [.quality-page_&_li]:[padding-right:12px] [.quality-page_&_li]:[padding-bottom:7px] [.quality-page_&_li]:[padding-left:12px] [.quality-page_&_li]:[border:1px_solid_#9eb7d0] [.quality-page_&_li]:[border-radius:9px] [.quality-page_&_li]:[color:#9eb7d0]! [.quality-page_&_li]:[font-size:10px]! [.quality-page_&_li]:[line-height:1.12]! max-xl:[.quality-page_&]:[flex-direction:column] max-xl:[.quality-page_&]:[align-items:start] max-xl:[.quality-page_&]:[gap:10px] max-md:[.quality-page_&]:[gap:24px] max-md:[.quality-page_&_li]:[font-size:9px]! max-md:[.quality-page_&_li]:[padding-top:7px] max-md:[.quality-page_&_li]:[padding-right:10px] max-md:[.quality-page_&_li]:[padding-bottom:7px] max-md:[.quality-page_&_li]:[padding-left:10px]">
                  <span>APPLIED STANDARTS</span>
                  <ul>
                    {stage.standards.map((standard) => (
                      <li key={standard}>{standard}</li>
                    ))}
                  </ul>
                </div>
                <p className="quality-stage-caption [.quality-page_&]:[flex:0_1_330px] [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#f7f7f7]! [.quality-page_&]:[font-size:11px]! [.quality-page_&]:[line-height:1.12]! max-xl:[.quality-page_&]:[flex-basis:260px] max-md:[.quality-page_&]:[flex-basis:auto] max-md:[.quality-page_&]:[max-width:369px] max-md:[.quality-page_&]:[font-size:10px]! max-md:[.quality-page_&]:[line-height:1.12]!">
                  {stage.caption}
                </p>
              </div>
            </div>
            <div className="quality-stage-arrows [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:2] [.quality-page_&]:[top:30px] [.quality-page_&]:[right:35px] [.quality-page_&]:[display:flex]! [.quality-page_&]:[gap:20px] [.quality-page_&_button]:[display:grid]! [.quality-page_&_button]:[place-items:center] [.quality-page_&_button]:[padding-top:0] [.quality-page_&_button]:[padding-right:0] [.quality-page_&_button]:[padding-bottom:0] [.quality-page_&_button]:[padding-left:0] [.quality-page_&_button]:[width:24px] [.quality-page_&_button]:[height:24px] [.quality-page_&_button]:[border:0] [.quality-page_&_button]:[background:transparent] [.quality-page_&_button]:[color:#9eb7d0]! [.quality-page_&_button]:[cursor:pointer] [.quality-page_&_button]:[transition:color_250ms_ease,_transform_250ms_ease] [.quality-page_&_svg]:[width:24px] [.quality-page_&_svg]:[height:24px] [.quality-page_&_svg]:[stroke-width:3px] [.quality-page_&_button:disabled]:[opacity:0.45] [.quality-page_&_button:disabled]:[cursor:not-allowed] [.quality-page_&_button:not(:disabled):hover]:[color:#fff]! [.quality-page_&_button:not(:disabled):hover]:[transform:scale(1.1)] max-md:[.quality-page_&]:[top:420px] max-md:[.quality-page_&]:[right:auto] max-md:[.quality-page_&]:[left:22px] max-md:[.quality-page_&]:[gap:20px] max-md:[.quality-page_&_button]:[width:34px] max-md:[.quality-page_&_button]:[height:34px] max-md:[.quality-page_&_svg]:[width:30px] max-md:[.quality-page_&_svg]:[height:30px] max-md:[.quality-page_&_svg]:[stroke-width:2px]">
              <button
                type="button"
                aria-label="Previous inspection stage"
                disabled={previousStage < 0}
                onClick={() => selectStage(previousStage)}
              >
                <LuArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next inspection stage"
                disabled={nextStage < 0}
                onClick={() => selectStage(nextStage)}
              >
                <LuArrowRight aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="quality-compliance-surface [.quality-page_&]:[--compliance-unit:clamp(0.833333px,_0.0694444444vw,_1.5px)] [.quality-page_&]:[position:relative] [.quality-page_&]:[isolation:isolate] [.quality-page_&]:[padding-top:0] [.quality-page_&]:[padding-right:24px] [.quality-page_&]:[padding-bottom:calc(100_*_var(--compliance-unit))] [.quality-page_&]:[padding-left:24px] [.quality-page_&]:[background:linear-gradient(110deg,_#fff,_#f4faff_45%,_#d7ebff)] [.quality-page_&::before]:[content:''] [.quality-page_&::before]:[position:absolute] [.quality-page_&::before]:[z-index:0] [.quality-page_&::before]:[top:-100px] [.quality-page_&::before]:[left:0] [.quality-page_&::before]:[right:0] [.quality-page_&::before]:[height:100px] [.quality-page_&::before]:[background:linear-gradient(110deg,_#fff,_#f4faff_45%,_#d7ebff)] [.quality-page_&::before]:[mask-image:linear-gradient(180deg,_transparent,_#000)] [.quality-page_&::before]:[pointer-events:none] [.quality-page_&::after]:[content:''] [.quality-page_&::after]:[position:absolute] [.quality-page_&::after]:[z-index:-1] [.quality-page_&::after]:[top:0] [.quality-page_&::after]:[right:0] [.quality-page_&::after]:[bottom:0] [.quality-page_&::after]:[left:0] [.quality-page_&::after]:[background:radial-gradient(ellipse_at_62%_60%,_#b9dcff80,_transparent_72%),_linear-gradient(180deg,_transparent,_#dceeff80_50%,_#d8ecffcc)] [.quality-page_&::after]:[mask-image:linear-gradient(180deg,_transparent,_#000_160px)] [.quality-page_&::after]:[pointer-events:none] max-xl:[.quality-page_&]:[--compliance-unit:1px] max-md:[.quality-page_&]:[padding-top:0] max-md:[.quality-page_&]:[padding-right:20px] max-md:[.quality-page_&]:[padding-bottom:65px] max-md:[.quality-page_&]:[padding-left:20px] max-md:[.quality-page_&]:[background:transparent] max-md:[.quality-page_&::before]:[display:none]! max-md:[.quality-page_&::after]:[display:none]!">
        <div className="quality-compliance-container [.quality-page_&]:[max-width:calc(1200_*_var(--compliance-unit))] [.quality-page_&]:[width:100%] [.quality-page_&]:[margin-left:auto] [.quality-page_&]:[margin-right:auto]">
          <CertificatesSection />
          <QualityPolicySection />
          <motion.div
            {...qualityReveal("up", 0, reduced, 0.1)}
            className="quality-newsletter [.quality-page_&]:[margin-top:calc(80_*_var(--compliance-unit))] [.quality-page_&_.newsletter-section]:[--mail-unit:var(--compliance-unit)] [.quality-page_&_.newsletter-section]:[margin-top:0]"
          >
            <NewsletterSubscription scaled />
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        /* One continuous surface prevents seams between independently painted sections. */
        .quality-page.quality-page {
          background: linear-gradient(
            110deg,
            #ffffff,
            #f4faff 45%,
            #d7ebff
          ) !important;
        }
        .quality-page .quality-inspection,
        .quality-page .quality-compliance-surface {
          background: transparent !important;
        }
        .quality-page .quality-compliance-surface::before,
        .quality-page .quality-compliance-surface::after {
          background: none !important;
        }
        .quality-page .quality-artwork {
          mask-image: linear-gradient(
            180deg,
            #000 0%,
            #000 48%,
            #000e 60%,
            #0008 76%,
            #0002 90%,
            transparent 100%
          );
        }
        .quality-page .quality-bottom-atmosphere {
          background: radial-gradient(
            ellipse at 35% 24%,
            #4a8dd81a,
            transparent 72%
          ) !important;
        }
      `}</style>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.
