"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import useScrollReveal from "@/components/ui/useScrollReveal";

export type ShowcaseCarouselItem = {
  name: string;
  description?: string;
  image: string;
  alt?: string;
};

export type ShowcaseCarouselProps = {
  title: ReactNode;
  description: ReactNode;
  items: readonly ShowcaseCarouselItem[];
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
};

/** Full-width, draggable showcase with responsive copy and viewport reveal animations. */
export default function ShowcaseCarousel({ title, description, items, className = "", previousLabel = "Previous items", nextLabel = "Next items" }: ShowcaseCarouselProps) {
  const titleId = useId();
  const scope = useScrollReveal("[data-showcase-heading], [data-related-card]");
  const rail = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const previews = Array.from({ length: 3 }, () => items).flat();

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const card = element.querySelector<HTMLElement>("[data-related-card]");
    if (card) element.scrollLeft = (card.offsetWidth + 16) * .8;
    const sync = () => setEdges({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    sync();
    element.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    return () => { element.removeEventListener("scroll", sync); observer.disconnect(); };
  }, [items.length]);

  function move(direction: number) {
    const element = rail.current;
    const card = element?.querySelector<HTMLElement>("[data-related-card]");
    if (element && card) element.scrollBy({ left: direction * (card.offsetWidth + 16) * 2, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function endDrag() {
    gesture.current = null;
    setDragging(false);
  }

  return <section ref={scope} data-showcase-carousel data-related-products aria-labelledby={titleId} className={`pt-[35px] pb-4 font-sans [font-stretch:125%] [font-variation-settings:'wght'_410,'wdth'_125] [--related-size:136px] md:pt-20 md:[--related-size:clamp(112px,9.46vw,160px)] ${className}`}>
    <div data-showcase-heading className="mx-auto flex w-[86%] max-w-[1600px] flex-wrap items-start justify-between gap-6 md:w-[90%] xl:w-5/6">
      <h2 id={titleId} className="max-w-[420px] text-[30px]! leading-none! tracking-[-0.04em] text-[#0d5792] md:text-[clamp(32px,3.47vw,64px)]!">{title}</h2>
      <p className="max-w-[600px] flex-1 basis-full pt-2 text-justify text-[15px]! leading-[1.2]! text-[#1D2049] md:basis-[300px] md:leading-[1.12]!">{description}</p>
      <div className="my-[15px] mb-[22px] flex w-full justify-center gap-2 pt-2 md:my-0 md:w-auto md:justify-start">
        <button type="button" aria-label={previousLabel} disabled={edges.start} onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full text-[#0d5792] transition-colors hover:bg-white/60 disabled:opacity-30"><FiArrowLeft className="size-8 md:size-7" /></button>
        <button type="button" aria-label={nextLabel} disabled={edges.end} onClick={() => move(1)} className="grid size-11 place-items-center rounded-full text-[#0d5792] transition-colors hover:bg-white/60 disabled:opacity-30"><FiArrowRight className="size-8 md:size-7" /></button>
      </div>
    </div>
    <div className="relative isolate mt-4 overflow-x-clip md:mt-7">
      <div ref={rail} data-related-rail data-dragging={dragging}
        className="relative z-0 flex w-full cursor-grab touch-pan-x items-start gap-4 overflow-x-auto overscroll-x-contain pt-5 pb-[calc(var(--related-size)*1.95+48px)] select-none [scrollbar-width:none] data-[dragging=true]:cursor-grabbing [&_*]:select-none [&_img]:[-webkit-user-drag:none] [&::-webkit-scrollbar]:hidden"
        onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (event.pointerType === "touch" || event.button !== 0 || !event.isPrimary) return;
          event.preventDefault();
          suppressClick.current = false;
          gesture.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, moved: false };
          setDragging(true);
        }}
        onPointerMove={event => {
          const start = gesture.current;
          if (!start) return;
          const dx = event.clientX - start.x;
          if (!start.moved && Math.abs(dx) > 5 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
            start.moved = true;
            suppressClick.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setActive(null);
          }
          if (start.moved) event.currentTarget.scrollLeft = start.left - dx;
        }}
        onPointerUp={event => { endDrag(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={endDrag} onLostPointerCapture={endDrag}
        onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
        onMouseLeave={() => { if (!gesture.current) setActive(null); }}>
        {previews.map((product, index) => <article key={`${product.name}-${index}`} data-related-card className="relative h-[var(--related-size)] w-[var(--related-size)] shrink-0"
          onPointerEnter={event => { if (event.pointerType === "mouse" && !gesture.current) setActive(index); }}>
          <button type="button" aria-label={`Show ${product.name} details`} aria-expanded={active === index}
            onClick={() => setActive(active === index ? null : index)} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setActive(index); }}
            className="relative z-10 block aspect-square w-full cursor-inherit rounded-[21px] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff]">
            <Image src={product.image} alt={product.alt ?? product.name} fill sizes="(min-width:1700px) 160px, (min-width:1200px) 136px, 112px" draggable={false} className="pointer-events-none rounded-[21px] object-contain p-3" />
          </button>
          <div data-related-description aria-hidden={active !== index}
            className={`pointer-events-none absolute top-[calc(100%-20px)] left-0 w-full overflow-hidden rounded-b-[21px] bg-white/60 text-[#0031be] transition-[height,opacity] duration-400 ease-out motion-reduce:transition-none ${active === index ? "h-[calc(var(--related-size)*1.95+20px)] opacity-100" : "h-0 opacity-0"}`}>
            <div className="absolute inset-x-0 top-5 bottom-0">
              <p className="absolute top-1/2 left-1/2 w-[calc(var(--related-size)*1.95-36px)] text-left text-[clamp(12px,1vw,16px)] leading-[1.15] [transform:translate(-50%,-50%)_rotate(-90deg)]">{product.name} {product.description}</p>
            </div>
          </div>
        </article>)}
      </div>
      <div data-related-blur aria-hidden="true" className="pointer-events-none absolute -top-12 -right-10 z-20 h-[calc(var(--related-size)+136px)] w-48 backdrop-blur-[14px] [mask-image:radial-gradient(ellipse_at_100%_50%,#000_20%,#000b_48%,transparent_75%)] md:w-[clamp(240px,25vw,420px)]" />
    </div>
  </section>;
}
