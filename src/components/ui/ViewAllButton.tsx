"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties } from "react";

type Appearance = {
  label?: string;
  active?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  fontSize?: CSSProperties["fontSize"];
  className?: string;
};
type ButtonProps = Appearance & Omit<ComponentProps<"button">, keyof Appearance | "children"> & { href?: never };
type LinkProps = Appearance & Omit<ComponentProps<typeof Link>, keyof Appearance | "children">;
export type SlidingCircleButtonProps = ButtonProps | LinkProps;

/** Shared link/button with a glowing orb and a small spring overshoot. */
export default function SlidingCircleButton({
  label = "View All", active: externalActive = false, width = 140, height = 43, fontSize = 15, className = "", ...props
}: SlidingCircleButtonProps) {
  const host = useRef<HTMLSpanElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(typeof width === "number" ? width : 140);
  const [measuredHeight, setMeasuredHeight] = useState(typeof height === "number" ? height : 43);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const disabled = "disabled" in props && props.disabled;
  const active = !disabled && (externalActive || hovered || focused);
  const buttonHeight = typeof height === "number" ? height : measuredHeight;
  const orbSize = buttonHeight * .7;
  const inset = buttonHeight * .35;
  const travel = Math.max(0, measuredWidth - inset * 2 - orbSize);
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 190, damping: 17, mass: .7 };

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const measure = () => {
      setMeasuredWidth(element.clientWidth);
      const rootHeight = parseFloat(getComputedStyle(element.parentElement!).height);
      if (Number.isFinite(rootHeight)) setMeasuredHeight(rootHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const content = <span ref={host} data-sliding-circle-button data-active={active} className="relative block h-full w-full">
    <motion.span aria-hidden="true" initial={false} animate={{ x: active ? inset + orbSize + buttonHeight * .28 : buttonHeight * .36 }} transition={spring}
      className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap">
      {label}
    </motion.span>
    <motion.span aria-hidden="true" initial={false} animate={{ x: active ? 0 : travel, boxShadow: active ? "0 0 25px 6px #005eff66" : "0 0 22px 4px #005eff4d" }} transition={spring}
      className="pointer-events-none absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full border-[0.5px] border-white/40 bg-linear-to-b from-[#005EFF] to-[#00169D]"
      style={{ left: inset, width: orbSize, height: orbSize }}>
      <motion.svg className="text-white" viewBox="0 0 24 24" fill="none" initial={false} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : .8 }} transition={{ duration: reduced ? 0 : .18 }}
        style={{ width: orbSize * .55, height: orbSize * .55 }}>
        <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="round" />
      </motion.svg>
    </motion.span>
    <span className="sr-only">{label}</span>
  </span>;

  const shared = {
    className: `relative inline-block shrink-0 rounded-full border-[0.5px] border-[#9EB7D0] bg-[#ffffff80] align-middle text-[#27272A]! no-underline shadow-[inset_0_0_12px_#ffffff80] backdrop-blur-[8px] outline-none focus-visible:ring-2 focus-visible:ring-[#005eff] focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
    style: { width, height, fontSize, lineHeight: 1, fontFamily: "inherit", padding: 0 } as CSSProperties,
  };

  if ("href" in props && props.href !== undefined) {
    const { onPointerEnter, onPointerLeave, onFocus, onBlur, style, ...rest } = props as LinkProps;
    return <Link {...rest} {...shared} style={{ ...shared.style, ...style }}
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); onPointerEnter?.(event); }}
      onPointerLeave={event => { setHovered(false); onPointerLeave?.(event); }}
      onFocus={event => { setFocused(event.currentTarget.matches(":focus-visible")); onFocus?.(event); }}
      onBlur={event => { setFocused(false); onBlur?.(event); }}>{content}</Link>;
  }
  const { onPointerEnter, onPointerLeave, onFocus, onBlur, style, type = "button", ...rest } = props as ButtonProps;
  return <button {...rest} {...shared} type={type} style={{ ...shared.style, ...style }}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); onPointerEnter?.(event); }}
    onPointerLeave={event => { setHovered(false); onPointerLeave?.(event); }}
    onFocus={event => { setFocused(event.currentTarget.matches(":focus-visible")); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}>{content}</button>;
}
