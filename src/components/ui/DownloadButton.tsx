"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties } from "react";

type Appearance = {
  label: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  fontSize?: CSSProperties["fontSize"];
  className?: string;
};
type ButtonProps = Appearance & Omit<ComponentProps<"button">, keyof Appearance | "children"> & { href?: never };
type LinkProps = Appearance & Omit<ComponentProps<typeof Link>, keyof Appearance | "children">;
export type DownloadButtonProps = ButtonProps | LinkProps;

/** Catalog and download action with the shared sliding-circle interaction. */
export default function DownloadButton({ label, width = 196, height = 42, fontSize = 13, className = "", ...props }: DownloadButtonProps) {
  const host = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ width: 196, height: 42 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const disabled = "disabled" in props && props.disabled;
  const active = !disabled && (hovered || focused);
  const orb = size.height * .7;
  const inset = size.height * .22;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 190, damping: 17, mass: .7 };

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const content = <span ref={host} data-download-button data-active={active} className="relative block size-full">
    <motion.span aria-hidden="true" initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: reduced ? 0 : .25 }} className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-[#0d5792] to-[#0044ce] shadow-[0_6px_22px_#005eff45]" />
    <motion.span aria-hidden="true" initial={false} animate={{ x: active ? inset + orb + size.height * .18 : size.height * .33, color: active ? "#ffffff" : "#27272a" }} transition={spring} className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap">{label}</motion.span>
    <motion.span aria-hidden="true" initial={false} animate={{ x: active ? 0 : Math.max(0, size.width - inset * 2 - orb), backgroundColor: active ? "#0d62b5" : "#005eff", boxShadow: active ? "0 0 0 0 #005eff00" : "0 0 22px 4px #005eff4d" }} transition={spring} style={{ left: inset, width: orb, height: orb }} className="pointer-events-none absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full border-[0.5px] border-white/50">
      <motion.span initial={false} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : .8 }} transition={{ duration: reduced ? 0 : .18 }} className="relative block size-[70%]">
        <Image src="/components/buttons/download.png" alt="" fill unoptimized sizes="32px" draggable={false} className="select-none object-contain" />
      </motion.span>
    </motion.span>
    <span className="sr-only">{label}</span>
  </span>;
  const shared = {
    className: `relative inline-block h-[var(--download-height)] w-[var(--download-width)] shrink-0 rounded-full border border-[#9eb7d080] bg-white/60 p-0 align-middle text-[length:var(--download-font)]! leading-none! no-underline shadow-[0_4px_14px_#005eff14] backdrop-blur-xl outline-none focus-visible:ring-2 focus-visible:ring-[#005eff] focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
    style: { "--download-width": typeof width === "number" ? `${width}px` : width, "--download-height": typeof height === "number" ? `${height}px` : height, "--download-font": typeof fontSize === "number" ? `${fontSize}px` : fontSize } as CSSProperties,
  };
  if ("href" in props && props.href !== undefined) {
    const { onPointerEnter, onPointerLeave, onFocus, onBlur, style, ...rest } = props as LinkProps;
    return <Link {...rest} {...shared} style={{ ...shared.style, ...style }} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); onPointerEnter?.(event); }} onPointerLeave={event => { setHovered(false); onPointerLeave?.(event); }} onFocus={event => { setFocused(event.currentTarget.matches(":focus-visible")); onFocus?.(event); }} onBlur={event => { setFocused(false); onBlur?.(event); }}>{content}</Link>;
  }
  const { onPointerEnter, onPointerLeave, onFocus, onBlur, style, type = "button", ...rest } = props as ButtonProps;
  return <button {...rest} {...shared} type={type} style={{ ...shared.style, ...style }} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); onPointerEnter?.(event); }} onPointerLeave={event => { setHovered(false); onPointerLeave?.(event); }} onFocus={event => { setFocused(event.currentTarget.matches(":focus-visible")); onFocus?.(event); }} onBlur={event => { setFocused(false); onBlur?.(event); }}>{content}</button>;
}
