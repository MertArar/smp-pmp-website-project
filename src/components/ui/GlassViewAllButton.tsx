"use client";

import Link from "next/link";
import type { ComponentProps, CSSProperties } from "react";
import { FiArrowUpRight } from "react-icons/fi";

type Props = Omit<ComponentProps<typeof Link>, "children"> & {
  scale?: number;
};

/** The glass button shared by the home news and social sections. */
export default function GlassViewAllButton({ scale = 1, className = "", style, ...props }: Props) {
  const px = (value: number) => value * scale;
  const circleSize = px(33);
  const glowSize = px(95);
  const glowOffset = (glowSize - circleSize) / 2;
  const vars = {
    "--circle-start": `${px(102)}px`,
    "--circle-end": `${px(5)}px`,
    "--text-move": `${px(40)}px`,
  } as CSSProperties;

  return (
    <Link
      {...props}
      className={`group relative block overflow-hidden bg-white/10 transition-colors duration-[350ms] hover:bg-[#F7F7F7] focus-visible:bg-[#F7F7F7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] motion-reduce:[&_*]:transition-none ${className}`}
      style={{
        ...vars,
        width: px(140),
        height: px(43),
        borderRadius: px(19),
        border: `${px(0.5)}px solid #9EB7D0`,
        backdropFilter: `blur(${px(15)}px)`,
        WebkitBackdropFilter: `blur(${px(15)}px)`,
        ...style,
      }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.13),rgba(255,255,255,0.01))]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-[1] -translate-y-1/2 left-[var(--circle-start)] group-hover:left-[var(--circle-end)] group-focus-visible:left-[var(--circle-end)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: circleSize, height: circleSize }}
      >
        <span className="absolute rounded-full" style={{
          width: glowSize,
          height: glowSize,
          left: -glowOffset,
          top: -glowOffset,
          background: "radial-gradient(circle,rgba(0,94,255,0.60),rgba(0,94,255,0.12) 54%,transparent 75%)",
          opacity: 0.46,
          filter: `blur(${px(18)}px)`,
        }} />
      </span>
      <span className="pointer-events-none absolute top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap text-[#27272A]" style={{
        fontFamily: "var(--font-sf-pro), sans-serif",
        fontWeight: 410,
        fontStretch: "125%",
        fontVariationSettings: '"wght" 410, "wdth" 125',
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        left: px(18),
        fontSize: px(15),
        lineHeight: 1.07,
        letterSpacing: "-0.04em",
      }}>
        <span className="block transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[var(--text-move)] group-focus-visible:translate-x-[var(--text-move)]">View All</span>
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-[3] flex -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#005EFF_0%,#001EA2_100%)] left-[var(--circle-start)] group-hover:left-[var(--circle-end)] group-focus-visible:left-[var(--circle-end)] transition-[left] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: circleSize, height: circleSize }}
      >
        <FiArrowUpRight size={px(20)} strokeWidth={3.2} className="scale-[0.8] text-white opacity-0 transition-[opacity,transform] duration-[350ms] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100" />
      </span>
    </Link>
  );
}
