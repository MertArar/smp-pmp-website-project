"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
  "page": "tw-error-page [body:has(&)_>_header]:hidden! [body:has(&)_>_header]:invisible! [body:has(&)_.site-header]:hidden! [body:has(&)_.site-header]:invisible! [body:has(&)_footer]:hidden! [body:has(&)_footer]:invisible! fixed inset-0 [z-index:100] isolate w-full [height:100dvh] overflow-hidden [color:#f7f7f7]! [background:#020b19] [font-family:var(--font-sf-pro),_sans-serif] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-.04em] [&_.not-found-video]:absolute [&_.not-found-video]:inset-0 [&_.not-found-video]:w-full [&_.not-found-video]:h-full [&_.not-found-video]:object-cover [&_.not-found-video]:[object-position:center_center] [&_.not-found-video]:pointer-events-none [&_.not-found-composition]:[--not-found-unit:min(.0694444444vw,_.092936803dvh)] [&_.not-found-composition]:absolute [&_.not-found-composition]:inset-0 [&_.not-found-composition]:w-full [&_.not-found-composition]:h-full [&_.not-found-bubble]:absolute [&_.not-found-bubble]:[top:28.3%] [&_.not-found-bubble]:[left:20.4%] [&_.not-found-bubble]:[width:22.5%] [&_.not-found-bubble]:[height:calc(84_*_var(--not-found-unit))] [&_.not-found-bubble]:[color:#f7f7f7]! [&_.not-found-bubble]:[font-size:calc(50_*_var(--not-found-unit))]! [&_.not-found-bubble]:[line-height:1]! [&_.not-found-bubble-shape]:absolute [&_.not-found-bubble-shape]:inset-0 [&_.not-found-bubble-shape]:w-full [&_.not-found-bubble-shape]:h-full [&_.not-found-bubble-shape]:overflow-visible [&_.not-found-bubble-shape_path]:[fill:#2182c5a6] [&_.not-found-bubble-shape_path]:[stroke:#079bfa] [&_.not-found-bubble-shape_path]:[stroke-width:1] [&_.not-found-bubble_p]:relative [&_.not-found-bubble_p]:m-0 [&_.not-found-bubble_p]:[padding:calc(8_*_var(--not-found-unit))_0_0_11%] [&_.not-found-message]:absolute [&_.not-found-message]:[top:52.7%] [&_.not-found-message]:[left:54%] [&_.not-found-message]:[width:28%] [&_.not-found-message]:max-w-none [&_.not-found-message_h1]:[margin:0_0_calc(12_*_var(--not-found-unit))] [&_.not-found-message_h1]:[font-size:calc(150_*_var(--not-found-unit))]! [&_.not-found-message_h1]:[font-weight:410] [&_.not-found-message_h1]:[line-height:.9]! [&_.not-found-message_h1]:[background:linear-gradient(180deg,_#005eff,_#001ea2)] [&_.not-found-message_h1]:[background-clip:text]! [&_.not-found-message_h1]:[-webkit-text-fill-color:transparent] [&_.not-found-message_>_p]:m-0 [&_.not-found-message_>_p]:[font-size:clamp(11px,_calc(20_*_var(--not-found-unit)),_20px)]! [&_.not-found-message_>_p]:[line-height:1.12]! [&_.not-found-home]:inline-flex [&_.not-found-home]:items-center [&_.not-found-home]:[gap:calc(8_*_var(--not-found-unit))] [&_.not-found-home]:[margin-top:calc(58_*_var(--not-found-unit))] [&_.not-found-home]:[color:#9eb7d0]! [&_.not-found-home]:[font-size:clamp(11px,_calc(20_*_var(--not-found-unit)),_20px)]! [&_.not-found-home]:[line-height:1]! [&_.not-found-arrow]:grid [&_.not-found-arrow]:place-items-center [&_.not-found-arrow]:[width:clamp(18px,_calc(22_*_var(--not-found-unit)),_26px)] [&_.not-found-arrow]:[height:clamp(18px,_calc(22_*_var(--not-found-unit)),_26px)] [&_.not-found-arrow]:[border-radius:50%] [&_.not-found-arrow]:[color:#f7f7f7]! [&_.not-found-arrow]:[background:linear-gradient(180deg,_#005eff,_#001ea2)] [&_.not-found-arrow]:[box-shadow:0_0_16px_#005eff88,_8px_0_28px_#005eff66] [&_.not-found-arrow]:[transition:transform_350ms_ease,_box-shadow_350ms_ease] [&_.not-found-arrow_svg]:[width:85%] [&_.not-found-arrow_svg]:[height:85%] [&_.not-found-home:hover_.not-found-arrow]:[transform:translate(3px,_-3px)] [&_.not-found-home:hover_.not-found-arrow]:[box-shadow:0_0_24px_#005effaa,_8px_0_32px_#005eff88] [&_.not-found-home:focus-visible]:[outline:2px_solid_#75b8ff] [&_.not-found-home:focus-visible]:[outline-offset:8px] [&_.not-found-home:focus-visible]:[border-radius:8px] [&_.not-found-brands]:relative [&_.not-found-brands]:flex [&_.not-found-brands]:items-center [&_.not-found-brands]:justify-between [&_.not-found-brands]:[gap:calc(15_*_var(--not-found-unit))] [&_.not-found-brands]:[width:min(100%,_calc(300_*_var(--not-found-unit)))] [&_.not-found-brands]:[margin-top:clamp(16px,_4dvh,_48px)] [&_.not-found-brand]:[flex-shrink:1] [&_.not-found-brand]:min-w-0 [&_.not-found-brand]:[max-width:32%] [&_.not-found-brand]:[height:calc(36_*_var(--not-found-unit))] [&_.not-found-brand]:object-contain [@media(width<768px)]:[&_.not-found-composition]:[--mobile-404-unit:min(.2544529262vw,_.117370892dvh)] [@media(width<768px)]:[&_.not-found-video]:inset-0 [@media(width<768px)]:[&_.not-found-video]:w-full [@media(width<768px)]:[&_.not-found-video]:h-full [@media(width<768px)]:[&_.not-found-video]:object-cover [@media(width<768px)]:[&_.not-found-video]:[object-position:center_center] [@media(width<768px)]:[&_.not-found-bubble]:absolute [@media(width<768px)]:[&_.not-found-bubble]:[top:14.7%] [@media(width<768px)]:[&_.not-found-bubble]:[left:35.5%] [@media(width<768px)]:[&_.not-found-bubble]:[width:55.5%] [@media(width<768px)]:[&_.not-found-bubble]:[height:calc(56_*_var(--mobile-404-unit))] [@media(width<768px)]:[&_.not-found-bubble]:[font-size:clamp(26px,_calc(35_*_var(--mobile-404-unit)),_38px)]! [@media(width<768px)]:[&_.not-found-bubble_p]:[padding-top:calc(6_*_var(--mobile-404-unit))] [@media(width<768px)]:[&_.not-found-message]:absolute [@media(width<768px)]:[&_.not-found-message]:[top:61.5%] [@media(width<768px)]:[&_.not-found-message]:[bottom:auto] [@media(width<768px)]:[&_.not-found-message]:[left:32%] [@media(width<768px)]:[&_.not-found-message]:[width:57%] [@media(width<768px)]:[&_.not-found-message]:max-w-none [@media(width<768px)]:[&_.not-found-message]:text-right [@media(width<768px)]:[&_.not-found-message_h1]:[margin:0_0_8px] [@media(width<768px)]:[&_.not-found-message_h1]:[font-size:clamp(72px,_min(25.5vw,_12.21dvh),_114px)]! [@media(width<768px)]:[&_.not-found-message_h1]:text-right [@media(width<768px)]:[&_.not-found-message_h1]:[line-height:.9]! [@media(width<768px)]:[&_.not-found-message_>_p]:w-full [@media(width<768px)]:[&_.not-found-message_>_p]:[font-size:clamp(11px,_calc(13_*_var(--mobile-404-unit)),_15px)]! [@media(width<768px)]:[&_.not-found-message_>_p]:[line-height:1.12]! [@media(width<768px)]:[&_.not-found-home]:[margin-top:calc(22_*_var(--mobile-404-unit))] [@media(width<768px)]:[&_.not-found-home]:[gap:calc(8_*_var(--mobile-404-unit))] [@media(width<768px)]:[&_.not-found-home]:[font-size:clamp(11px,_calc(13_*_var(--mobile-404-unit)),_15px)]! [@media(width<768px)]:[&_.not-found-arrow]:[width:clamp(18px,_calc(22_*_var(--mobile-404-unit)),_26px)] [@media(width<768px)]:[&_.not-found-arrow]:[height:clamp(18px,_calc(22_*_var(--mobile-404-unit)),_26px)] [@media(width<768px)]:[&_.not-found-brands]:[left:-19vw] [@media(width<768px)]:[&_.not-found-brands]:[gap:calc(20_*_var(--mobile-404-unit))] [@media(width<768px)]:[&_.not-found-brands]:[width:75.5vw] [@media(width<768px)]:[&_.not-found-brands]:[margin-top:clamp(16px,_3dvh,_28px)] [@media(width<768px)]:[&_.not-found-brand]:[height:clamp(18px,_4dvh,_34px)] [@media(height<=600px)]:[&_.not-found-message]:[top:42%] [@media(height<=600px)]:[&_.not-found-home]:[margin-top:clamp(12px,_3dvh,_22px)] [@media(height<=600px)]:[&_.not-found-brands]:[margin-top:clamp(12px,_3dvh,_18px)] [@media(height<=600px)]:[&_.not-found-bubble]:[top:20%] [@media(width<768px)_and_(height<=600px)]:[&_.not-found-message]:[top:50%] [@media(width<768px)_and_(height<=600px)]:[&_.not-found-message]:[bottom:auto] [@media(width<768px)_and_(height<=600px)]:[&_.not-found-bubble]:[top:13%] [@media(width<768px)_and_(height<=600px)]:[&_.not-found-message_h1]:[font-size:clamp(54px,_min(24vw,_11dvh),_80px)]! [@media(width<768px)_and_(height<=600px)]:[&_.not-found-brand]:[height:clamp(16px,_3.5dvh,_22px)] [@media(width<768px)_and_(height<=740px)]:[&_.not-found-video]:[object-position:center_top] [@media(prefers-reduced-motion:reduce)]:[&_.not-found-arrow]:[transition:none]",
} as const;


const brands = [
  { src: "/404/sempa-logo.png", alt: "SEMPA", width: 188, height: 58 },
  { src: "/404/im-pump-technology.png", alt: "IM PUMP TECHNOLOGY", width: 178, height: 58 },
  { src: "/404/green-sempa.png", alt: "GREEN PUMP", width: 164, height: 58 },
];

export default function NotFoundPage({ videoSrc, mobileVideoSrc = null }: { videoSrc: string | null; mobileVideoSrc?: string | null }) {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = matchMedia("(max-width: 767px)");
    const updateSource = () => video.current?.load();
    query.addEventListener("change", updateSource);
    return () => query.removeEventListener("change", updateSource);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => router.replace("/"), 10_000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className={`${styles.page} sempa-not-found`} aria-labelledby="not-found-title">
      {(videoSrc || mobileVideoSrc) && <video ref={video} className="not-found-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}>
        {mobileVideoSrc && <source src={mobileVideoSrc} media="(max-width: 767px)" />}
        {videoSrc && <source src={videoSrc} />}
      </video>}
      <div className="not-found-composition">
        <div className="not-found-bubble">
          <svg className="not-found-bubble-shape" viewBox="0 0 330 84" preserveAspectRatio="none" aria-hidden="true"><path d="M34 1H296C314 1 329 16 329 34S314 67 296 67H295C294 74 296 78 299 81C300 84 289 79 281 75L270 67H34C16 67 1 52 1 34S16 1 34 1Z" /></svg>
          <p>Oops!</p>
        </div>
        <div className="not-found-message">
          <h1 id="not-found-title">404</h1>
          <p>Your page is currently under maintenance and will guide you back to the homepage after 10 seconds.</p>
          <Link className="not-found-home" href="/">Back to home<span className="not-found-arrow" aria-hidden="true"><FiArrowUpRight /></span></Link>
          <div className="not-found-brands" aria-label="Sempa brands">
            {brands.map((brand) => <Image key={brand.src} src={brand.src} alt={brand.alt} width={brand.width} height={brand.height} sizes="(max-width: 767px) 27vw, 188px" className="not-found-brand" />)}
          </div>
        </div>
      </div>

    </main>
  );
}
