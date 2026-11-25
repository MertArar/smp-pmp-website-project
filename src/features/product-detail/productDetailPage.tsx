"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiDownload,
  FiChevronDown,
  FiX,
  FiMap,
} from "react-icons/fi";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import SmartPumpAssistant from "@/components/smart-pump/SmartPumpAssistant";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useScrollReveal from "@/components/ui/useScrollReveal";
import DownloadButton from "@/components/ui/DownloadButton";

// Named Tailwind breakpoints preserve the existing mobile composition and tablet sizing.
const productResponsive = [
  "max-sm:[&_.pd-application]:gap-1!",
  "max-sm:[&_.pd-application]:px-1.5!",
  "max-sm:[&_.pd-application_video]:size-[22px]!",
  "md:[&_[data-product-features]::before]:[content:'']!",
  "md:[&_[data-product-features]::before]:[pointer-events:none]!",
  "md:[&_[data-product-features]::before]:[position:absolute]!",
  "md:[&_[data-product-features]::before]:[z-index:0]!",
  "md:[&_[data-product-features]::before]:[inset:22%_-5%_5%]!",
  "md:[&_[data-product-features]::before]:[background:radial-gradient(ellipse_at_65%_50%,_#95bbf680,_#b9d6ff66_48%,_transparent_75%)]!",
  "md:[&_[data-product-features]::before]:[filter:blur(30px)]!",
  "md:max-xl:[&_[data-product-hero]]:[width:90%]!",
  "md:max-xl:[&_[data-product-features]]:[width:90%]!",
  "md:max-xl:[&_[data-pump-design]]:[width:90%]!",
  "md:max-xl:[&_[data-product-applications]]:[width:90%]!",
  "md:max-xl:[&_[data-sectional-drawings]]:[width:90%]!",
  "md:max-xl:[&_[data-product-folders]]:[width:90%]!",
  "md:max-xl:[&_[data-hero-heading-row]]:[gap:28px]!",
  "md:max-xl:[&_[data-hero-controls]]:[flex-wrap:wrap]!",
  "md:max-xl:[&_[data-hero-controls]]:[gap:8px]!",
  "md:max-xl:[&_.pd-hero-stage]:[margin-top:12px]!",
  "md:max-xl:[&_.pd-hero-stage]:[height:390px]!",
  "md:max-xl:[&_.pd-spec-table_th]:[padding-left:12%]!",
  "md:max-xl:[&_.pd-spec-table_th]:[width:48%]!",
  "md:max-xl:[&_[data-product-applications]]:[grid-template-columns:minmax(0,1.4fr)_minmax(0,1fr)]!",
  "md:max-xl:[&_[data-product-applications]]:[gap:18px]!",
  "md:max-xl:[&_[data-application-panel]]:[min-height:810px]!",
  "md:max-xl:[&_[data-application-panel]]:[padding:20px]!",
  "md:max-xl:[&_[data-contact-panel]]:[min-height:810px]!",
  "md:max-xl:[&_[data-contact-panel]]:[padding:20px]!",
  "md:max-xl:[&_[data-application-panel]_>_.grid]:[grid-template-columns:repeat(2,minmax(0,1fr))]!",
  "md:max-xl:[&_[data-application-panel]_>_.grid]:[gap:10px]!",
  "md:max-xl:[&_[data-application-panel]_>_.grid]:[padding-top:260px]!",
  "md:max-xl:[&_.pd-application]:[min-height:70px]!",
  "md:max-xl:[&_.pd-application]:[padding:8px]!",
  "md:max-xl:[&_.pd-application]:[font-size:10px]!",
  "md:max-xl:[&_.pd-application_video]:[width:32px]!",
  "md:max-xl:[&_.pd-application_video]:[height:32px]!",
  "md:max-xl:[&_[data-contact-panel]_h2]:[font-size:32px]!",
  "md:max-xl:[&_[data-contact-art]]:[width:125%]!",
  "md:max-xl:[&_[data-contact-art]]:[margin-left:-12.5%]!",
  "md:max-xl:[&_[data-product-folders]]:[grid-template-columns:minmax(0,1.2fr)_minmax(0,1fr)]!",
  "max-md:[background:linear-gradient(105deg,#e6f4ff_0%,#cce6ff_55%,#edf8ff_100%)]!",
  "max-md:[&_[data-product-hero]]:[display:flex]!",
  "max-md:[&_[data-product-hero]]:[flex-direction:column]!",
  "max-md:[&_[data-product-hero]]:[width:100%]!",
  "max-md:[&_[data-product-hero]]:[padding:30px_32px_42px]!",
  "max-md:[&_[data-hero-heading-row]]:[display:contents]!",
  "max-md:[&_[data-hero-heading-row]_>_div:first-child]:[order:0]!",
  "max-md:[&_#product-heading]:[font-size:clamp(25px,6.5vw,36px)]!",
  "max-md:[&_#product-heading]:[line-height:1.08]!",
  "max-md:[&_#product-heading]:[font-weight:540]!",
  "max-md:[&_#product-heading]:[font-variation-settings:'wght'_540,'wdth'_125]!",
  "max-md:[&_#product-heading_+_div]:[margin-top:28px]!",
  "max-md:[&_#product-heading_+_div]:[font-size:13px]!",
  "max-md:[&_#product-heading_+_div]:[gap:10px]!",
  "max-md:[&_[data-hero-heading-row]_p]:[margin-top:24px]!",
  "max-md:[&_[data-hero-heading-row]_p]:[font-size:13px]!",
  "max-md:[&_[data-hero-heading-row]_p]:[line-height:1.18]!",
  "max-md:[&_[data-hero-heading-row]_p]:[max-width:310px]!",
  "max-md:[&_.pd-hero-stage]:[--hero-pump-scale:1.125]!",
  "max-md:[&_.pd-hero-stage]:[order:1]!",
  "max-md:[&_.pd-hero-stage]:[height:320px]!",
  "max-md:[&_.pd-hero-stage]:[width:calc(100%_+_64px)]!",
  "max-md:[&_.pd-hero-stage]:[margin:40px_-32px_0]!",
  "max-md:[&_[data-hero-pump]]:[width:100%]!",
  "max-md:[&_[data-hero-pump]]:[height:auto]!",
  "max-md:[&_[data-hero-pump]]:[pointer-events:none]!",
  "max-md:[&_.pd-hero-stage_>_button]:[top:12px]!",
  "max-md:[&_.pd-hero-stage_>_button]:[bottom:auto]!",
  "max-md:[&_.pd-hero-stage_>_button]:[left:19%]!",
  "max-md:[&_.pd-hero-stage_>_button]:[width:212px]!",
  "max-md:[&_.pd-hero-stage_>_button]:[white-space:nowrap]!",
  "max-md:[&_.pd-hero-stage_>_button]:[font-size:14px]!",
  "max-md:[&_[data-product-gallery]]:[display:none]!",
  "max-md:[&_[data-hero-controls]]:[position:relative]!",
  "max-md:[&_[data-hero-controls]]:[z-index:20]!",
  "max-md:[&_[data-hero-controls]]:[order:2]!",
  "max-md:[&_[data-hero-controls]]:[display:grid]!",
  "max-md:[&_[data-hero-controls]]:[grid-template-columns:repeat(6,minmax(0,1fr))]!",
  "max-md:[&_[data-hero-controls]]:[width:100%]!",
  "max-md:[&_[data-hero-controls]]:[gap:24px_8px]!",
  "max-md:[&_[data-hero-controls]]:[align-items:center]!",
  "max-md:[&_[data-hero-controls]]:[margin-top:14px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(4)]:[grid-area:1/3/2/4]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(4)]:[justify-self:end]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(5)]:[grid-area:1/4/2/5]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(5)]:[justify-self:start]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(4)_svg]:[width:34px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(4)_svg]:[height:34px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(5)_svg]:[width:34px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(5)_svg]:[height:34px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(1)]:[grid-area:2/6/3/7]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(1)]:[justify-self:end]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(1)]:[z-index:30]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(2)]:[grid-area:2/1/3/4]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(2)]:[text-align:center]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(2)]:[padding:13px_8px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(2)]:[font-size:11px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[background:#c7e0ff]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[color:#0d5792]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[border:1px_solid_white]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[box-shadow:0_3px_18px_#005eff40]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[grid-area:2/4/3/6]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[padding:11px_7px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[gap:6px]!",
  "max-md:[&_[data-hero-controls]_>_:nth-child(3)]:[font-size:11px]!",
  "max-md:[&_[data-product-hero]_>_[role=status]]:[order:3]!",
  "max-md:[&_[data-product-hero]_>_[role=status]]:[margin:0]!",
  "max-md:[&_[data-product-hero]_>_[role=status]]:[min-height:0]!",
  "max-md:[&_[data-product-hero]_>_[role=status]:empty]:[display:none]!",
  "max-md:[&_[data-product-features]]:[width:94%]!",
  "max-md:[&_[data-pump-design]]:[width:94%]!",
  "max-md:[&_[data-product-applications]]:[width:94%]!",
  "max-md:[&_[data-sectional-drawings]]:[width:94%]!",
  "max-md:[&_[data-product-folders]]:[width:94%]!",
  "max-md:[&_[data-product-features]]:[padding:38px_0_68px]!",
  "max-md:[&_[data-product-features]_h2]:[max-width:350px]!",
  "max-md:[&_[data-product-features]_h2]:[font-size:clamp(27px,7.2vw,38px)]!",
  "max-md:[&_[data-product-features]_h2]:[line-height:1.04]!",
  "max-md:[&_[data-product-features]_>_.relative]:[margin-top:80px]!",
  "max-md:[&_[data-product-features]_[role=group]]:[top:-46px]!",
  "max-md:[&_[data-product-features]_[role=group]]:[padding:3px_5px]!",
  "max-md:[&_[data-product-features]_[role=group]]:[left:10px]!",
  "max-md:[&_[data-product-features]_[role=group]_button]:[min-height:30px]!",
  "max-md:[&_[data-product-features]_[role=group]_button]:[min-width:42px]!",
  "max-md:[&_[data-product-features]_[role=group]_button]:[font-size:13px]!",
  "max-md:[&_.pd-spec-table]:[font-size:clamp(11px,3vw,15px)]!",
  "max-md:[&_.pd-spec-table]:[line-height:1.2]!",
  "max-md:[&_.pd-spec-table_th]:[padding-left:16px]!",
  "max-md:[&_.pd-spec-table_th]:[padding-right:8px]!",
  "max-md:[&_.pd-spec-table_th]:[width:52%]!",
  "max-md:[&_.pd-spec-table_th]:[padding-top:14px]!",
  "max-md:[&_.pd-spec-table_th]:[padding-bottom:14px]!",
  "max-md:[&_.pd-spec-table_td]:[padding-top:14px]!",
  "max-md:[&_.pd-spec-table_td]:[padding-bottom:14px]!",
  "max-md:[&_.pd-spec-table_td:last-child]:[padding-right:12px]!",
  "max-md:[&_.pd-spec-table_td:last-child]:[white-space:nowrap]!",
  "max-md:[&_[data-product-features]_>_.mt-14]:[margin-top:28px]!",
  "max-md:[&_[data-product-features]_>_.mt-14_a]:[font-size:14px]!",
  "max-md:[&_[data-pump-design]]:[padding-top:20px]!",
  "max-md:[&_[data-pump-design]]:[padding-bottom:60px]!",
  "max-md:[&_#pump-design-title]:[max-width:250px]!",
  "max-md:[&_#pump-design-title]:[font-size:30px]!",
  "max-md:[&_[data-pump-design]_>_div]:[margin-top:28px]!",
  "max-md:[&_[data-pump-design]_>_div]:[border-radius:30px]!",
  "max-md:[&_[data-pump-design]_>_div]:[padding:46px_20px]!",
  "max-md:[&_[data-pump-design]_ul]:[font-size:15px]!",
  "max-md:[&_[data-pump-design]_ul]:[line-height:1.22]!",
  "max-md:[&_[data-pump-design]_ul]:[text-align:justify]!",
  "max-md:[&_[data-pump-design]_ul]:[padding-left:16px]!",
  "max-md:[&_[data-pump-design]_li_+_li]:[margin-top:18px]!",
  "max-md:[&_[data-product-applications]]:[gap:30px]!",
  "max-md:[&_[data-product-applications]]:[padding-top:10px]!",
  "max-md:[&_[data-product-applications]]:[padding-bottom:58px]!",
  "max-md:[&_[data-application-panel]]:[min-height:920px]!",
  "max-md:[&_[data-application-panel]]:[padding:22px]!",
  "max-md:[&_[data-application-panel]]:[border-radius:32px]!",
  "max-md:[&_[data-application-panel]_>_.grid]:[grid-template-columns:repeat(2,minmax(0,1fr))]!",
  "max-md:[&_[data-application-panel]_>_.grid]:[gap:12px]!",
  "max-md:[&_[data-application-panel]_>_.grid]:[padding-top:380px]!",
  "max-md:[&_.pd-application]:[min-height:72px]!",
  "max-md:[&_.pd-application]:[gap:8px]!",
  "max-md:[&_.pd-application]:[padding:8px]!",
  "max-md:[&_.pd-application]:[border-radius:18px]!",
  "max-md:[&_.pd-application]:[background-color:#ffffff4d]!",
  "max-md:[&_.pd-application]:[font-size:10px]!",
  "max-md:[&_.pd-application_video]:[width:34px]!",
  "max-md:[&_.pd-application_video]:[height:34px]!",
  "max-md:[&_[data-contact-panel]]:[min-height:245px]!",
  "max-md:[&_[data-contact-panel]]:[padding:14px_24px_24px]!",
  "max-md:[&_[data-contact-panel]]:[border-radius:28px]!",
  "max-md:[&_[data-contact-panel]_h2]:[position:relative]!",
  "max-md:[&_[data-contact-panel]_h2]:[z-index:2]!",
  "max-md:[&_[data-contact-panel]_h2]:[font-size:30px]!",
  "max-md:[&_[data-contact-panel]_>_p]:[position:relative]!",
  "max-md:[&_[data-contact-panel]_>_p]:[z-index:2]!",
  "max-md:[&_[data-contact-panel]_>_p]:[width:100px]!",
  "max-md:[&_[data-contact-panel]_>_p]:[margin-top:24px]!",
  "max-md:[&_[data-contact-panel]_>_p]:[font-size:11px]!",
  "max-md:[&_[data-contact-art]]:[position:absolute]!",
  "max-md:[&_[data-contact-art]]:[right:-10%]!",
  "max-md:[&_[data-contact-art]]:[bottom:-12px]!",
  "max-md:[&_[data-contact-art]]:[width:70%]!",
  "max-md:[&_[data-contact-art]]:[height:100%]!",
  "max-md:[&_[data-contact-art]]:[margin:0]!",
  "max-md:[&_[data-contact-art]_img]:[object-fit:cover]!",
  "max-md:[&_[data-contact-art]_img]:[object-position:top_center]!",
  "max-md:[&_[data-contact-art]_img]:[mask-image:linear-gradient(#000_85%,transparent_100%)]!",
  "max-md:[&_[data-contact-art]_.pd-chat-blue]:[display:none]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[right:20%]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[bottom:28%]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[z-index:3]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[max-width:calc(100%_-_20px)]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[padding:7px_9px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[border-radius:12px_12px_12px_3px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[font-size:9px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red]:[white-space:nowrap]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[content:'']!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[left:10px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[right:auto]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[bottom:-9px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[width:14px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[height:10px]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[background:#e30a178c]!",
  "max-md:[&_[data-contact-art]_.pd-chat-red::after]:[clip-path:polygon(0_0,100%_0,0_100%)]!",
  "max-md:[&_[data-contact-panel]_>_a]:[position:absolute]!",
  "max-md:[&_[data-contact-panel]_>_a]:[z-index:3]!",
  "max-md:[&_[data-contact-panel]_>_a]:[bottom:32px]!",
  "max-md:[&_[data-contact-panel]_>_a]:[left:24px]!",
  "max-md:[&_[data-contact-panel]_>_a]:[width:185px]!",
  "max-md:[&_[data-sectional-drawings]]:[padding-top:5px]!",
  "max-md:[&_[data-sectional-drawings]]:[padding-bottom:55px]!",
  "max-md:[&_#sectional-title]:[padding:0_20px]!",
  "max-md:[&_#sectional-title]:[font-size:clamp(44px,12vw,64px)]!",
  "max-md:[&_[data-sectional-drawings]_>_div:first-child_>_p]:[padding:0_22px]!",
  "max-md:[&_[data-sectional-drawings]_>_div:first-child_>_p]:[font-size:15px]!",
  "max-md:[&_[data-sectional-drawings]_>_div:first-child_>_p]:[line-height:1.2]!",
  "max-md:[&_[data-sectional-drawings]_>_div:nth-child(2)]:[margin-top:30px]!",
  "max-md:[&_[data-sectional-drawings]_>_div:nth-child(2)_>_button]:[width:100%]!",
  "max-md:[&_[data-sectional-drawings]_>_div:nth-child(2)_>_button]:[gap:12px]!",
  "max-md:[&_[data-sectional-drawings]_>_div:nth-child(2)_>_button]:[font-size:14px]!",
  "max-md:[&_[data-sectional-drawings]_>_div:nth-child(2)_>_a]:[display:none]!",
  "max-md:[&_[data-sectional-drawings]_>_button]:[height:550px]!",
  "max-md:[&_[data-sectional-drawings]_>_button]:[margin-top:20px]!",
  "max-md:[&_.pd-drawing-crop]:[height:86%]!",
  "max-md:[&_.pd-drawing-crop]:[max-width:86%]!",
  "max-md:[&_[data-product-folders]]:[gap:30px]!",
  "max-md:[&_[data-product-folders]]:[padding-top:5px]!",
  "max-md:[&_[data-product-folders]]:[padding-bottom:55px]!",
  "max-md:[&_[data-product-folders]]:[text-align:center]!",
  "max-md:[&_#folders-title]:[font-size:32px]!",
  "max-md:[&_[data-product-folders]_p]:[font-size:15px]!",
  "max-md:[&_[data-product-folders]_p]:[line-height:1.25]!",
  "max-md:[&_[data-product-folders]_p]:[margin-left:auto]!",
  "max-md:[&_[data-product-folders]_p]:[margin-right:auto]!",
  "max-md:[&_[data-product-folders]_>_div:first-child]:[display:contents]!",
  "max-md:[&_[data-product-folders]_h2]:[order:0]!",
  "max-md:[&_[data-product-folders]_p]:[order:1]!",
  "max-md:[&_[data-product-folders]_p]:[margin-top:-12px]!",
  "max-md:[&_.pd-catalog-art]:[display:none]!",
  "max-md:[&_.pd-folder-desktop-label]:[display:none]!",
  "max-md:[&_.pd-folder-mobile-label]:[display:inline]!",
  "max-md:[&_.pd-folder-mobile-label]:[color:#0d5792]!",
  "max-md:[&_.pd-catalog-language]:[display:block]!",
  "max-md:[&_.pd-catalog-language]:[position:relative]!",
  "max-md:[&_.pd-catalog-language]:[order:2]!",
  "max-md:[&_.pd-catalog-language]:[width:112px]!",
  "max-md:[&_.pd-catalog-language]:[height:44px]!",
  "max-md:[&_.pd-catalog-language]:[margin:10px_auto_6px]!",
  "max-md:[&_.pd-catalog-language]:[border:1px_solid_white]!",
  "max-md:[&_.pd-catalog-language]:[border-radius:19px]!",
  "max-md:[&_.pd-catalog-language]:[background:linear-gradient(110deg,#e3effd99,#ffffff55)]!",
  "max-md:[&_.pd-catalog-language]:[box-shadow:0_5px_25px_#e30a1726,0_0_22px_#ffffff99]!",
  "max-md:[&_.pd-catalog-language::before]:[content:'']!",
  "max-md:[&_.pd-catalog-language::before]:[position:absolute]!",
  "max-md:[&_.pd-catalog-language::before]:[top:-20px]!",
  "max-md:[&_.pd-catalog-language::before]:[width:34px]!",
  "max-md:[&_.pd-catalog-language::before]:[height:1px]!",
  "max-md:[&_.pd-catalog-language::before]:[background:white]!",
  "max-md:[&_.pd-catalog-language::after]:[content:'']!",
  "max-md:[&_.pd-catalog-language::after]:[position:absolute]!",
  "max-md:[&_.pd-catalog-language::after]:[top:-20px]!",
  "max-md:[&_.pd-catalog-language::after]:[width:34px]!",
  "max-md:[&_.pd-catalog-language::after]:[height:1px]!",
  "max-md:[&_.pd-catalog-language::after]:[background:white]!",
  "max-md:[&_.pd-catalog-language::before]:[left:-22px]!",
  "max-md:[&_.pd-catalog-language::after]:[right:-22px]!",
  "max-md:[&_.pd-catalog-language_select]:[appearance:none]!",
  "max-md:[&_.pd-catalog-language_select]:[width:100%]!",
  "max-md:[&_.pd-catalog-language_select]:[height:100%]!",
  "max-md:[&_.pd-catalog-language_select]:[padding:0_48px_0_20px]!",
  "max-md:[&_.pd-catalog-language_select]:[font-size:16px]!",
  "max-md:[&_.pd-catalog-language_select]:[font-weight:650]!",
  "max-md:[&_.pd-catalog-language_select]:[font-variation-settings:'wght'_650,_'wdth'_125]!",
  "max-md:[&_.pd-catalog-language_select]:[color:#27272a]!",
  "max-md:[&_.pd-catalog-language_select]:[background:transparent]!",
  "max-md:[&_.pd-catalog-language_select]:[border-radius:inherit]!",
  "max-md:[&_.pd-catalog-language_select]:[cursor:pointer]!",
  "max-md:[&_.pd-catalog-language_select:focus-visible]:[outline:2px_solid_#005eff]!",
  "max-md:[&_.pd-catalog-language_select:focus-visible]:[outline-offset:4px]!",
  "max-md:[&_.pd-catalog-language_img]:[position:absolute]!",
  "max-md:[&_.pd-catalog-language_img]:[right:13px]!",
  "max-md:[&_.pd-catalog-language_img]:[top:8px]!",
  "max-md:[&_.pd-catalog-language_img]:[width:26px]!",
  "max-md:[&_.pd-catalog-language_img]:[height:26px]!",
  "max-md:[&_.pd-catalog-language_img]:[object-fit:contain]!",
  "max-md:[&_.pd-catalog-language_img]:[pointer-events:none]!",
  "max-md:[&_.pd-catalog-language_img]:[filter:drop-shadow(0_0_10px_#e30a1740)]!",
  "max-md:[&_[data-product-folders]_>_div:first-child_>_div]:[order:3]!",
  "max-md:[&_[data-product-folders]_>_div:first-child_>_div]:[margin-top:0]!",
  "max-md:[&_[data-product-folders]_>_div:first-child_>_div]:[text-align:left]!",
  "max-md:[&_[data-product-folders]_>_div:first-child_>_div]:[gap:10px]!",
  "max-md:[&_[data-product-folders]_a]:[font-size:14px]!",
  "max-md:[&_[data-product-folders]_a]:[min-height:48px]!",
  "max-md:[&_[data-product-folders]_a]:[padding:10px_16px]!",
  "max-md:[&_[data-product-newsletter]]:[width:90%]!",
].join(" ");

const COUNT = 7;
const INITIAL = 3;
const heroImage = "/product-detail/pump2.png";
const description =
  "Centrifugal pumps with a horizontal shaft, split body, diffuser, multistage, and closed impeller design";
const pill =
  "inline-flex items-center justify-between gap-3 rounded-[19px] border border-[#9eb7d080] bg-white/60 px-4 py-2 text-[13px]! leading-none! text-[#27272A] shadow-[0_4px_14px_#005eff14] backdrop-blur-xl transition-shadow hover:shadow-[0_4px_20px_#005eff30] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff]";
const quickAction =
  "flex h-14 w-full items-center justify-start gap-4 rounded-[22px] border border-white/90 bg-white/45 px-6 text-[16px]! leading-none! text-[#27272a] backdrop-blur-[14px] transition-colors hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-[#005eff]";

function ProductVideo({
  src,
  className,
  frame = false,
}: {
  src: string;
  className?: string;
  frame?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    const sync = () => {
      if (
        visible &&
        !document.hidden &&
        !preference.matches &&
        video.getAttribute("src")
      ) {
        void video
          .play()
          .then(() => {
            if (disposed || document.hidden || !visible) video.pause();
          })
          .catch(() => {});
      } else video.pause();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) setLoad(true);
        sync();
      },
      { rootMargin: "100px" },
    );
    observer.observe(video);
    video.addEventListener("loadeddata", sync);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      disposed = true;
      video.pause();
      observer.disconnect();
      video.removeEventListener("loadeddata", sync);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, [load]);
  return (
    <video
      ref={ref}
      data-product-video={frame ? "frame" : "icon"}
      src={load ? src : undefined}
      muted
      loop
      playsInline
      preload={load ? "metadata" : "none"}
      disablePictureInPicture
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={`${className ?? ""} ${failed ? "invisible" : ""}`}
    />
  );
}

const technicalRows = [
  { label: "Discharge Flange", eu: "DN 32 – DN 250", us: '1 1/4" – 10"' },
  { label: "Capacity", eu: "Up to 1200 m³/h", us: "Up to 5283 GPM" },
  { label: "Head", eu: "Up to 600 m", us: "Up to 1970 ft" },
  {
    label: "Working Temperature",
    eu: "−25 °C to +140 °C",
    us: "−13 °F to +284 °F",
  },
  {
    label: "Casing Pressure (Pmax)",
    eu: "25 bar (63 bar)*",
    us: "25 bar (63 bar)*",
  },
];
const designFeatures = [
  "Centrifugal pumps with a horizontal shaft, split body, diffuser, multistage, and closed impeller design.",
  "Available in 11 models, with discharge flange diameters ranging from DN 25 to DN 250.",
  "Suction flanges conform to EN 1092-2 / PN 16, and discharge flanges conform to EN 1092-2 / PN 40 (up to PN 63). For pumps made of stainless steel, flanges comply with EN 1092-1 standards for the specified pressure class.",
  "In standard production, the suction flange is on the coupling side (right), and the discharge flange is located at the other end on top (R 4/2). If different flange positions are required, they must be specified at the time of order.",
  "All impellers are dynamically or statically balanced according to ISO 1940 Class 6.3.",
  "Axial force is balanced by an impeller balancing holes system.",
  "The direction of rotation is clockwise when viewed from the motor end.",
  "ARS-type pumps are equipped with grease-lubricated bearings as standard.",
];
const applications = [
  "Power Plants",
  "Agricultural Irrigation & Drainage",
  "Petroleum Industry",
  "Building Systems",
  "Water Treatment and Pressurization",
  "Mining",
  "Chemical Industry",
  "Heating, Ventilation and Air Conditioning",
  "Marine",
  "Fire Extinguishing",
  "Food and Beverage Industry",
  "Iron and Steel Industry",
];
const sectionHeading =
  "relative z-1 mx-auto max-w-[1000px] text-center text-[clamp(28px,3.47vw,64px)]! leading-none! tracking-[-0.04em] text-[#0D5792]";

function ProductInformation() {
  const [standard, setStandard] = useState<"eu" | "us">("eu");
  const [application, setApplication] = useState(0);
  return (
    <div className="relative">
      <section
        data-product-features
        aria-labelledby="product-features-title"
        className="relative mx-auto w-5/6 max-w-[1600px] pt-10 pb-20 md:pt-12 md:pb-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-8 right-[-10%] z-0 w-[85%] bg-[url('/product-detail/feature-stars.svg')] bg-size-[24px_24px] opacity-75 [mask-image:linear-gradient(120deg,transparent_8%,#000_68%)] md:bg-size-[28px_28px] xl:bg-size-[32px_32px] 2xl:bg-size-[36px_36px]"
        />
        <h2 id="product-features-title" className={sectionHeading}>
          ARS / ARS-DD Series Multi
          <br className="hidden md:block" /> Stage Pumps Features
        </h2>
        <div className="relative mt-20 md:mt-28">
          <div
            className="absolute -top-9 left-5 z-20 flex rounded-xl border border-white bg-[#f7f7f7] px-2 py-2 shadow-[0_3px_5px_#005eff30] md:left-12"
            role="group"
            aria-label="Measurement standard"
          >
            {(["eu", "us"] as const).map((value, index) => (
              <button
                type="button"
                key={value}
                aria-pressed={standard === value}
                onClick={() => setStandard(value)}
                className={`min-h-9 min-w-12 px-3 text-[clamp(16px,1.4vw,30px)]! md:min-h-[clamp(36px,2.5vw,54px)] md:min-w-[clamp(48px,3.5vw,76px)] leading-none! focus-visible:outline-2 focus-visible:outline-[#005eff] ${index === 0 ? "border-r border-[#9eb7d080]" : ""} ${standard === value ? "text-[#005eff]" : "text-[#27272A]"}`}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
          <div
            data-spec-frame
            data-spec-standard={standard}
            className={`relative rounded-lg border border-white/90 shadow-[0_25px_70px_#005eff0d] ${standard === "us" ? "bg-[linear-gradient(105deg,#ffffffed_0%,#eff7ffe6_45%,#d8ecfee6_100%)]" : "bg-[#cadffb]"}`}
          >
            <div
              className="pd-table-light pointer-events-none absolute -inset-[14px] z-10"
              aria-hidden="true"
            >
              <div className="absolute inset-[14px]">
                {/* Source border center: x=120..1170, y=100..610 in the 1280×720 video. */}
                <ProductVideo
                  frame
                  src="/product-detail/table_frame.mp4"
                  className="pd-table-frame-video absolute max-w-none mix-blend-screen"
                />
              </div>
            </div>
            {/* Keep the screen-blended frame outside the animated opacity group. */}
            <div
              data-spec-content
              className="relative overflow-hidden rounded-[7px]"
            >
              {standard === "eu" && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#e2ecfd_17.5%,#d3e3fa_19.5%,#d3e3fa_36%,#cadcfb_38%,#cadcfb_54.5%,#c7dafb_56.5%,#c7dafb_73%,#d3e3fa_75%)]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,#cce1fb_17.5%,#c0d9fb_19.5%,#c0d9fb_36%,#b7d3fb_38%,#b7d3fb_54.5%,#b5d1fa_56.5%,#b5d1fa_73%,#c0d9fb_75%)] [mask-image:linear-gradient(90deg,transparent,#000)]" />
                </div>
              )}
              <table
                className="pd-spec-table relative w-full border-collapse text-[clamp(13px,1.12vw,24px)]! leading-[1.2]!"
                aria-label={`ARS / ARS-DD specifications in ${standard.toUpperCase()} units`}
              >
                <tbody>
                  {technicalRows.map((row, index) => (
                    <tr
                      key={row.label}
                      tabIndex={0}
                      className="bg-transparent outline-none transition-colors duration-250 hover:bg-[#005eff] hover:text-white! focus-visible:bg-[#005eff] focus-visible:text-white! focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#005eff]/30 motion-reduce:transition-none"
                    >
                      <th
                        scope="row"
                        className="w-[54%] py-4 md:py-[clamp(16px,1.2vw,26px)] pr-4 pl-[30%] text-left font-[540]!"
                      >
                        <span>
                          {index === 4 ? (
                            <>
                              Casing Pressure
                              <br />
                              (Pmax)
                            </>
                          ) : (
                            row.label
                          )}
                        </span>
                      </th>
                      <td
                        aria-hidden="true"
                        className="w-[3%] py-4 md:py-[clamp(16px,1.2vw,26px)] pr-3"
                      >
                        :
                      </td>
                      <td className="py-4 md:py-[clamp(16px,1.2vw,26px)] pr-5">
                        {row[standard]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-14 flex justify-center">
          <DownloadButton
            href="/media/all-catalog"
            label="View Downloadable Content"
            width={278}
            className="max-md:h-11! max-md:w-[284px]! max-md:text-[14px]!"
          />
        </div>
      </section>
      <section
        data-pump-design
        aria-labelledby="pump-design-title"
        className="relative mx-auto w-5/6 max-w-[1600px] py-12 md:pb-28"
      >
        <h2 id="pump-design-title" className={sectionHeading}>
          Pump Design Features
        </h2>
        <div className="mt-12 rounded-[30px] border border-white/60 bg-white/30 px-6 py-9 shadow-[0_65px_90px_#005eff1a] backdrop-blur-xl md:mt-16 md:px-[4.5%] md:py-[5%]">
          <ul className="list-disc space-y-3 pl-4 text-[clamp(13px,1.05vw,19px)]! leading-[1.25]! md:space-y-4">
            {designFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>
      <section
        data-product-applications
        aria-label="Applications and contact"
        className="relative isolate mx-auto grid w-5/6 max-w-[1600px] gap-6 pt-10 pb-28 lg:grid-cols-[1.55fr_1fr] lg:pb-40"
      >
        <div
          data-application-panel
          className="relative isolate flex min-h-[700px] flex-col overflow-hidden rounded-[30px] border border-white/60 p-5 md:min-h-[clamp(810px,60vw,1080px)] md:p-6"
        >
          <Image
            src="/product-detail/applications.png"
            alt="Industrial facilities and pumping applications"
            fill
            sizes="(max-width: 767px) 1400px, (max-width: 1199px) 1000px, 55vw"
            className="-z-2 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-1 bg-[linear-gradient(90deg,#fff_0%,#ffffffb3_12%,#ffffff30_42%,transparent_70%),linear-gradient(180deg,#ffffff40,transparent_50%,#c6e0ff55)]"
          />
          <div className="flex items-center gap-3 p-3 text-[15px]! font-[650]! text-[#0D5792]">
            APPLICATIONS
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center rounded-full bg-linear-to-br from-[#5d9bff] to-[#0042db] text-white shadow-[0_0_18px_#005eff80]"
            >
              <FiArrowRight className="size-5 rotate-45" />
            </span>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-52 sm:grid-cols-3 md:gap-3">
            {applications.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={application === index}
                onClick={() => setApplication(index)}
                className={`pd-application flex min-h-[68px] min-w-0 items-center gap-2 rounded-[15px] border border-white/70 px-3 py-2 text-left text-[clamp(10px,.85vw,14px)]! leading-[1.12]! text-[#0D5792] shadow-[0_8px_25px_#005eff25] backdrop-blur-lg transition-[color,box-shadow] duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-[#005eff] ${application === index ? "bg-white/90 font-[650]!" : "bg-white/60"}`}
              >
                <ProductVideo
                  src={`/product-detail/icon${index + 1}.mp4`}
                  className="size-9 shrink-0 rounded-md object-contain mix-blend-multiply md:size-10"
                />
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div
          data-contact-panel
          className="relative isolate flex min-h-[700px] flex-col overflow-hidden rounded-[30px] bg-white/20 px-7 pt-3 pb-7 md:min-h-[clamp(810px,60vw,1080px)] md:px-8"
        >
          <h2 className="text-[clamp(30px,3.47vw,60px)]! leading-[1.12]! tracking-[-0.04em]">
            Contact Us
          </h2>
          <p className="mt-3 max-w-[220px] text-[12px]! leading-[1.12]! text-[#0D5792]">
            Contact the authorized representative in your region
          </p>
          <div
            data-contact-art
            className="relative my-auto aspect-square w-full"
          >
            <Image
              src="/product-detail/musteri-temsilcisi.webp"
              alt="Sempa customer service representative"
              fill
              unoptimized
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-contain [mask-image:linear-gradient(#000_70%,transparent_100%)]"
            />
            <span className="pd-chat pd-chat-blue absolute bottom-[20%] left-0 rounded-[12px] bg-[#269ffd]/55 px-3 py-2 text-[10px]! text-white shadow-[0_10px_16px_#0d579225]">
              Message goes here.
            </span>
            <span className="pd-chat pd-chat-red absolute right-0 bottom-[10%] rounded-[12px] bg-[#e30a17]/55 px-3 py-2 text-[10px]! text-white shadow-[0_10px_16px_#0d579225]">
              Message goes here.
            </span>
          </div>
          <Link href="/contact" className={`${pill} w-[160px] shrink-0`}>
            Contact Us
            <span
              aria-hidden="true"
              className="size-6 rounded-full bg-linear-to-br from-[#005eff] to-[#001ea2] shadow-[0_0_12px_#005eff70]"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductDocuments() {
  const preview = useRef<HTMLDialogElement>(null);
  const [catalogLanguage, setCatalogLanguage] = useState("TR");
  const folders = [
    { label: "Product catalogs", href: "/media/all-catalog" },
    { label: "Product manuals", href: "/media/user-manuals" },
    { label: "Brochures and product descriptions", href: "/media/all-catalog" },
    {
      label: "Documents and certifications",
      href: "/media/documents-certification",
    },
  ];
  return (
    <>
      <section
        data-sectional-drawings
        aria-labelledby="sectional-title"
        className="mx-auto w-5/6 max-w-[1600px] pt-12 pb-16 md:pt-20 md:pb-24"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-16">
          <h2
            id="sectional-title"
            className="text-[clamp(32px,3.47vw,64px)]! leading-none! tracking-[-0.04em] text-[#005eff]"
          >
            Sectional
            <br />
            Drawings
          </h2>
          <p className="max-w-[465px] pt-2 text-[15px]! leading-[1.12]! text-[#0d5792]">
            Built for high pressure, the multistage ARS Series offers a
            split-casing design and balanced closed impellers for reliable,
            vibration-free operation.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 md:mt-16">
          <button
            type="button"
            onClick={() => preview.current?.showModal()}
            className="flex min-h-12 max-w-full items-center gap-5 rounded-[18px] bg-[#f7f7f7] px-5 py-3 text-left text-[clamp(11px,1.05vw,17px)]! font-[540]! leading-[1.12]! focus-visible:outline-2 focus-visible:outline-[#005eff]"
          >
            General assembly drawing, motor version UE, XE, YE
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full bg-[#27272A] text-white"
            >
              <FiArrowUpRight />
            </span>
          </button>
          <a
            href="/product-detail/sectional-drawing.png"
            download
            className={`${pill} text-[#0d5792]`}
          >
            <FiDownload className="size-5 text-[#00a6ff]" />
            Download
          </a>
        </div>
        <button
          type="button"
          aria-label="Enlarge sectional drawing"
          onClick={() => preview.current?.showModal()}
          className="relative mt-8 block h-[clamp(400px,48.125vw,924px)] w-full overflow-hidden rounded-[30px] border border-white/80 bg-white/40 shadow-[0_20px_70px_#005eff0a] backdrop-blur-lg focus-visible:outline-2 focus-visible:outline-[#005eff]"
        >
          <span className="pd-drawing-crop">
            <Image
              src="/product-detail/sectional-drawing.png"
              alt="Sectional assembly drawing of the pump with numbered components"
              width={488}
              height={595}
              sizes="(max-width: 767px) 600px, 440px"
              className="pd-drawing-image"
            />
          </span>
        </button>
        <dialog
          ref={preview}
          aria-label="Sectional drawing preview"
          onClick={(event) => {
            if (event.target === event.currentTarget) preview.current?.close();
          }}
          className="fixed inset-0 m-auto h-[90dvh] w-[95vw] max-w-[1200px] rounded-2xl bg-[#edf7ff] p-4 backdrop:bg-[#10243bcc]"
        >
          <button
            type="button"
            aria-label="Close drawing preview"
            onClick={() => preview.current?.close()}
            className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-white"
          >
            <FiX className="size-6" />
          </button>
          <div className="relative h-full w-full">
            <Image
              src="/product-detail/sectional-drawing.png"
              alt="Enlarged pump sectional drawing"
              fill
              sizes="95vw"
              className="object-contain p-5"
            />
          </div>
        </dialog>
      </section>
      <section
        data-product-folders
        aria-labelledby="folders-title"
        className="mx-auto grid w-5/6 max-w-[1600px] gap-8 py-12 md:grid-cols-[1.5fr_1fr] md:items-center md:py-20"
      >
        <div>
          <h2
            id="folders-title"
            className="text-[clamp(32px,3.47vw,64px)]! leading-none! tracking-[-0.04em] text-[#005eff]"
          >
            Folders
          </h2>
          <p className="mt-5 max-w-[405px] text-[15px]! leading-[1.12]! text-[#0d5792]">
            Download technical catalogs, product manuals, and brochures here.
          </p>
          <label
            data-catalog-language
            className="pd-catalog-language"
            aria-label="Catalog language"
          >
            <select
              aria-label="Catalog language"
              value={catalogLanguage}
              onChange={(event) => setCatalogLanguage(event.target.value)}
            >
              <option value="TR">TR</option>
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="RU">RU</option>
            </select>
            <Image
              src={`/header/flag-${catalogLanguage.toLowerCase()}.png`}
              alt=""
              width={28}
              height={28}
            />
          </label>
          <div className="mt-12 flex flex-col gap-3 md:mt-20">
            {folders.map((folder) => (
              <Link
                key={folder.label}
                href={{
                  pathname: folder.href,
                  query: { language: catalogLanguage.toLowerCase() },
                }}
                className="flex min-h-[50px] items-center justify-between gap-5 rounded-[13px] bg-[#f7f7f7] px-5 py-3 text-[15px]! leading-[1.12]! text-[#0d5792] transition-shadow hover:shadow-[0_5px_20px_#005eff20] focus-visible:outline-2 focus-visible:outline-[#005eff]"
              >
                <span className="pd-folder-desktop-label">{folder.label}</span>
                <span className="pd-folder-mobile-label">
                  2-page product description (1 file)
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-[#27272A] text-white"
                >
                  <FiArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="pd-catalog-art relative mx-auto aspect-[474/575] w-full max-w-[560px] overflow-hidden">
          <Image
            src="/product-detail/katalog.gif"
            alt="Sempa SVDP series product catalog"
            fill
            unoptimized
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover object-[5%_center]"
          />
        </div>
      </section>
    </>
  );
}

const relatedProducts = [
  { name: "DPT Series", description: "Inline Centrifugal Pumps" },
  { name: "DPT TR Series", description: "Vertical Centrifugal Pumps" },
  { name: "TKF KE Series", description: "Industrial Pump Solutions" },
  { name: "ARS UF Series", description: "Multi Stage Pump Solutions" },
  { name: "ASL Series", description: "Split Case Pumps" },
  { name: "TKF Series", description: "Single Stage End Suction Pumps" },
  { name: "TKF M Series", description: "Industrial Pump Solutions" },
  { name: "TKF AH Series", description: "Booster Pumps" },
  { name: "TKF K Series", description: "End Suction Pumps" },
];

function RelatedProducts() {
  return (
    <ShowcaseCarousel
      title={
        <>
          Related Other
          <br />
          Products
        </>
      }
      description="Discover the most efficient pumping solution in seconds. Simply enter your technical parameters such as flow rate, pressure, and fluid type, and let our advanced configurator select the ideal Sempa pump for your specific industry needs."
      items={relatedProducts.map((product, index) => ({
        ...product,
        image: `/product-detail/related/pump${index + 1}.png`,
        alt: `${product.name} pump`,
      }))}
      previousLabel="Previous related products"
      nextLabel="Next related products"
    />
  );
}

/** The spring updates SVG/CSS directly. React only renders when the selected image changes. */
function ElasticGallery({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const lightLine = useRef<SVGPathElement>(null);
  const ropeGradient = useRef<SVGLinearGradientElement>(null);
  const lightGradient = useRef<SVGLinearGradientElement>(null);
  const ball = useRef<HTMLButtonElement>(null);
  const target = useRef(selected);
  const current = useRef(selected);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const selection = useRef(selected);
  const frame = useRef(0);
  const reduced = useRef(false);
  const animate = useRef<() => void>(() => {});

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduced.current = preference.matches;
    };
    sync();
    preference.addEventListener("change", sync);
    let last = 0;
    const paint = (time: number) => {
      const dt = last ? Math.min((time - last) / 16.667, 2) : 1;
      last = time;
      if (reduced.current) {
        current.current = target.current;
        velocity.current = 0;
      } else {
        velocity.current += (target.current - current.current) * 0.09 * dt;
        velocity.current *= Math.pow(0.66, dt);
        current.current += velocity.current * dt;
      }
      const x = 24 + current.current * 62;
      const pull = Math.min(2, Math.abs(velocity.current) * 10);
      const path = `M 0 26 H ${Math.max(0, x - 72)} C ${x - 38} 26 ${x - 40} ${13 - pull} ${x} ${13 - pull} C ${x + 40} ${13 - pull} ${x + 38} 26 ${Math.min(420, x + 72)} 26 H 420`;
      line.current?.setAttribute("d", path);
      lightLine.current?.setAttribute("d", path);
      ropeGradient.current?.setAttribute("x1", `${x - 190}`);
      ropeGradient.current?.setAttribute("x2", `${x + 190}`);
      lightGradient.current?.setAttribute("x1", `${x - 100}`);
      lightGradient.current?.setAttribute("x2", `${x + 100}`);
      ball.current?.style.setProperty("left", `${(x / 420) * 100}%`);
      ball.current?.style.setProperty(
        "--ball-lean",
        `${Math.max(-9, Math.min(9, velocity.current * 22))}deg`,
      );
      if (
        Math.abs(target.current - current.current) > 0.0005 ||
        Math.abs(velocity.current) > 0.0005
      )
        frame.current = requestAnimationFrame(paint);
      else {
        frame.current = 0;
        last = 0;
      }
    };
    animate.current = () => {
      if (!frame.current) frame.current = requestAnimationFrame(paint);
    };
    animate.current();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      preference.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    selection.current = selected;
    if (!dragging.current) {
      target.current = selected;
      animate.current();
    }
  }, [selected]);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !track.current) return;
    const rect = track.current.getBoundingClientRect();
    const value = Math.max(
      0,
      Math.min(
        COUNT - 1,
        (((event.clientX - rect.left) / rect.width) * 420 - 24) / 62,
      ),
    );
    target.current = value;
    const index = Math.round(value);
    if (index !== selection.current) {
      selection.current = index;
      onSelect(index);
    }
    animate.current();
  }
  function end() {
    dragging.current = false;
    target.current = selection.current;
    animate.current();
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? COUNT - 1
          : event.key === "ArrowRight"
            ? Math.min(COUNT - 1, selected + 1)
            : event.key === "ArrowLeft"
              ? Math.max(0, selected - 1)
              : null;
    if (next !== null) {
      event.preventDefault();
      onSelect(next);
    }
  }

  return (
    <div
      data-product-gallery
      className="relative mx-auto w-full max-w-[480px] px-3"
      aria-label="Product image gallery"
    >
      <div className="flex h-[94px] items-center justify-between gap-1">
        {Array.from({ length: COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show product image ${index + 1}`}
            aria-pressed={selected === index}
            onClick={() => onSelect(index)}
            className="relative aspect-square w-[12%] rounded-[11px] bg-[#e9f6ff] transition-[transform,opacity,filter,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:outline-2 focus-visible:outline-[#005eff] motion-reduce:transition-none"
            style={{
              transform:
                selected === index
                  ? "scale(1.48) translateY(-7px)"
                  : "scale(1)",
              zIndex: selected === index ? 2 : 1,
              opacity: selected === index ? 1 : 0.62,
              filter:
                selected === index
                  ? "none"
                  : `blur(${Math.min(1.2, Math.abs(index - selected) * 0.35)}px)`,
              boxShadow: selected === index ? "0 5px 23px #005eff55" : "none",
            }}
          >
            <Image
              src="/product-detail/pump2.png"
              alt={`ARS pump thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="rounded-[11px] object-contain p-1 mix-blend-multiply"
            />
          </button>
        ))}
      </div>
      <div
        ref={track}
        data-elastic-track
        className="relative mx-auto h-[100px] w-[72%] touch-pan-y select-none"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-[5.7%]"
        >
          {Array.from({ length: COUNT }, (_, i) => (
            <span
              key={i}
              style={{
                transform:
                  i === selected ? "translateY(-18px)" : "translateY(0)",
                height: i === selected ? 18 : 12,
              }}
              className="w-px bg-linear-to-b from-transparent via-[#005eff70] to-transparent transition-[transform,height] duration-500 motion-reduce:transition-none"
            />
          ))}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 420 90"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient
              ref={ropeGradient}
              id="product-rope"
              gradientUnits="userSpaceOnUse"
              x1="20"
              x2="400"
              y1="0"
              y2="0"
            >
              <stop stopColor="#657889" stopOpacity="0" />
              <stop offset=".25" stopColor="#657889" stopOpacity=".25" />
              <stop offset=".5" stopColor="#333b43" />
              <stop offset=".75" stopColor="#657889" stopOpacity=".25" />
              <stop offset="1" stopColor="#657889" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              ref={lightGradient}
              id="product-rope-light"
              gradientUnits="userSpaceOnUse"
              x1="110"
              x2="310"
              y1="0"
              y2="0"
            >
              <stop stopColor="#005eff" stopOpacity="0" />
              <stop offset=".5" stopColor="#005eff" stopOpacity=".4" />
              <stop offset="1" stopColor="#005eff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            ref={lightLine}
            d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420"
            fill="none"
            stroke="url(#product-rope-light)"
            strokeWidth="12"
            className="blur-[5px]"
          />
          <path
            ref={line}
            d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420"
            fill="none"
            stroke="url(#product-rope)"
            strokeWidth="5"
            strokeLinecap="round"
            className="drop-shadow-[0_3px_4px_#27272a35]"
          />
        </svg>
        <button
          ref={ball}
          type="button"
          role="slider"
          aria-label="Product image selector"
          aria-valuemin={1}
          aria-valuemax={COUNT}
          aria-valuenow={selected + 1}
          aria-valuetext={`Product image ${selected + 1} of ${COUNT}`}
          onKeyDown={keyboard}
          style={{
            left: "50%",
            transform: "translateX(-50%) rotate(var(--ball-lean,0deg))",
          }}
          className="absolute top-[35px] grid size-[46px] cursor-grab touch-none place-items-center rounded-full border border-[#9eb7d0] bg-[#dceeff99] shadow-[0_3px_19px_#005eff50,inset_0_1px_2px_#fff] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff]"
        >
          <span className="size-[30px] rounded-full bg-linear-to-br from-[#006dff] to-[#0046df] shadow-[0_0_12px_#005eff70]" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Product image {selected + 1} selected
      </p>
    </div>
  );
}

function ModelViewer() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading 3D model…");
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};
    void (async () => {
      const THREE = await import("three");
      const { GLTFLoader } =
        await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { OrbitControls } =
        await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x5175a1, 3));
      const light = new THREE.DirectionalLight(0xffffff, 4);
      light.position.set(4, 6, 8);
      scene.add(light);
      const resize = () => {
        renderer.setSize(element.clientWidth, element.clientHeight);
        camera.aspect = element.clientWidth / element.clientHeight;
        camera.updateProjectionMatrix();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
      });
      const disposeScene = () =>
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            for (const material of Array.isArray(object.material)
              ? object.material
              : [object.material]) {
              for (const value of Object.values(material))
                if (value instanceof THREE.Texture) value.dispose();
              material.dispose();
            }
          }
        });
      cleanup = () => {
        observer.disconnect();
        renderer.setAnimationLoop(null);
        controls.dispose();
        disposeScene();
        renderer.dispose();
        renderer.domElement.remove();
      };
      new GLTFLoader().load(
        "/product-detail/ARS-UF.glb",
        (gltf) => {
          scene.add(gltf.scene);
          if (disposed) {
            disposeScene();
            return;
          }
          const box = new THREE.Box3().setFromObject(gltf.scene),
            size = box.getSize(new THREE.Vector3()),
            center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);
          const distance = Math.max(size.x, size.y, size.z) * 2;
          camera.position.set(distance * 0.7, distance * 0.4, distance);
          controls.update();
          setStatus("");
        },
        undefined,
        () => {
          if (!disposed)
            setStatus("The model could not be loaded. Please try again.");
        },
      );
    })().catch(() => {
      if (!disposed) setStatus("3D viewing is unavailable in this browser.");
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return (
    <div
      className="relative h-[min(60svh,540px)] min-h-[260px]"
      aria-label="Interactive ARS pump 3D model"
    >
      <div ref={host} className="absolute inset-0 touch-none" />
      {status && (
        <p
          role="status"
          className="absolute inset-x-5 top-1/2 text-center text-[#0d5792]"
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const pageRef = useScrollReveal(
    "[data-hero-heading-row] > div:first-child, .pd-hero-stage, [data-product-gallery], [data-product-features] > h2, [data-spec-content], [data-pump-design] > h2, [data-pump-design] > div, [data-application-panel], [data-contact-panel], [data-sectional-drawings] > div, [data-sectional-drawings] > button, [data-product-folders] > div > h2, [data-product-folders] > div > p, [data-product-folders] a, .pd-catalog-art, [data-selection-copy], [data-assistant-long-card], [data-product-newsletter]",
  );
  const [selected, setSelected] = useState(INITIAL);
  const [actions, setActions] = useState(false);
  const [message, setMessage] = useState("");
  const [panel, setPanel] = useState<"model" | "catalog" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else dialog.current?.close();
  }, [panel]);
  useEffect(() => {
    if (!actions) return;
    const outside = (event: globalThis.PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node))
        setActions(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setActions(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [actions]);
  const step = (direction: number) =>
    setSelected((value) => (value + direction + COUNT) % COUNT);
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({
          title: "ARS / ARS-DD Series | SEMPA",
          url: location.href,
        });
      else {
        await navigator.clipboard.writeText(location.href);
        setMessage("Link copied");
      }
    } catch {
      setMessage("Sharing cancelled");
    }
    setActions(false);
  }
  return (
    <main
      ref={pageRef}
      data-product-detail
      data-header-underlay
      className={`${productResponsive} -mt-[var(--site-header-height,97px)] min-h-screen overflow-x-clip bg-[radial-gradient(ellipse_at_75%_70%,#cde7ff80,transparent_65%),linear-gradient(110deg,#fff_20%,#f4faff_52%,#d9edff)] font-sans text-[#27272A] [font-stretch:125%] [font-variation-settings:'wght'_410,'wdth'_125]`}
    >
      <div aria-hidden="true" className="h-[var(--site-header-height,97px)]" />
      <section
        data-product-hero
        className="relative mx-auto w-5/6 max-w-[1600px] pt-10 pb-12 md:pt-14 lg:pb-16"
        aria-labelledby="product-heading"
      >
        <div
          data-hero-heading-row
          className="relative z-10 flex flex-wrap items-start justify-between gap-6"
        >
          <div>
            <h1
              id="product-heading"
              className="max-w-[430px] text-[clamp(26px,2.08vw,40px)]! leading-[1.12]! font-[650]! [font-variation-settings:'wght'_650,'wdth'_125]"
            >
              ARS / ARS-DD Series
              <br />
              Multi Stage Pumps
            </h1>

            <div className="mt-5 flex items-center gap-2 text-[12px]!">
              <Image
                src="/product-detail/eye.png"
                alt=""
                width={24}
                height={24}
                unoptimized
                className="size-6 shrink-0 object-contain"
              />
              <span>Viewed 331,816 times</span>
            </div>
            <p className="mt-5 max-w-[283px] text-[12px]! leading-[1.12]! text-[#4687B8]">
              {description}
            </p>
          </div>
          <div data-hero-controls className="flex items-center gap-2 sm:gap-3">
            <div ref={actionsRef} className="relative">
              <button
                type="button"
                aria-label="Product actions"
                aria-expanded={actions}
                onClick={() => setActions(!actions)}
                className="grid size-9 place-items-center rounded-full hover:bg-white/70"
              >
                <FiChevronDown
                  className={`size-5 transition-transform ${actions ? "rotate-180" : ""}`}
                />
              </button>
              {actions && (
                <div
                  data-product-actions
                  className="absolute top-12 right-0 z-30 flex w-[234px] max-w-[calc(100vw-32px)] flex-col gap-2"
                >
                  <Link
                    href="/contact"
                    className={`${quickAction} shadow-[0_8px_24px_#ee526b20]`}
                  >
                    <Image
                      src="/product-detail/info.png"
                      alt=""
                      width={36}
                      height={36}
                      unoptimized
                      className="size-9 shrink-0 object-contain"
                    />
                    Bilgi Al
                  </Link>
                  <button
                    type="button"
                    className={`${quickAction} shadow-[0_8px_24px_#005eff18]`}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(location.href);
                        setMessage("Link copied");
                      } catch {
                        setMessage("Could not copy the link");
                      }
                      setActions(false);
                    }}
                  >
                    <Image
                      src="/product-detail/link.png"
                      alt=""
                      width={36}
                      height={36}
                      unoptimized
                      className="size-9 shrink-0 object-contain"
                    />
                    Linki Kopyala
                  </button>
                  <button
                    type="button"
                    className={`${quickAction} shadow-[0_8px_24px_#005eff25]`}
                    onClick={share}
                  >
                    <Image
                      src="/product-detail/share.png"
                      alt=""
                      width={36}
                      height={36}
                      unoptimized
                      className="size-9 shrink-0 object-contain"
                    />
                    Paylaş
                  </button>
                </div>
              )}
            </div>
            <span className="rounded-[20px] border border-white bg-[#aaffbeaa] px-3 py-3 whitespace-nowrap text-[10px]! md:px-5 md:text-[12px]! text-[#008528] shadow-[0_0_22px_#78ff9899]">
              Sipariş İçin Hazır
            </span>
            <button
              type="button"
              onClick={() => setPanel("model")}
              className={`${pill} gap-2! px-3! whitespace-nowrap text-[11px]! md:text-[13px]! border-white bg-[#bad9ff70] text-[#0d5792] shadow-[0_0_20px_#005eff40]`}
            >
              <FiMap className="size-5" />
              3D View
            </button>
            <button
              type="button"
              aria-label="Previous product image"
              onClick={() => step(-1)}
              className="grid size-9 place-items-center text-[#9EB7D0] hover:text-[#005eff]"
            >
              <FiArrowLeft className="size-7" />
            </button>
            <button
              type="button"
              aria-label="Next product image"
              onClick={() => step(1)}
              className="grid size-9 place-items-center text-[#9EB7D0] hover:text-[#005eff]"
            >
              <FiArrowRight className="size-7" />
            </button>
          </div>
        </div>
        <div
          className="pd-hero-stage relative mt-2 h-[300px] md:mt-[-65px] md:h-[420px] lg:h-[min(35vw,560px)]"
          aria-label="Selected product view"
        >
          <div
            data-hero-pump-layer
            className="absolute inset-y-0 left-1/2 flex w-full -translate-x-1/2 items-center justify-center md:left-[51%] md:w-[88%]"
          >
            {/* Keep the mobile framing while enlarging the desktop/tablet product to the reference ratio. */}
            <Image
              key={selected}
              data-hero-pump
              src={heroImage}
              alt={`ARS / ARS-DD multistage pump, image ${selected + 1}`}
              width={1264}
              height={759}
              preload={selected === INITIAL}
              sizes="(min-width: 1440px) 1100px, (min-width: 768px) 85vw, 100vw"
              style={{ scale: "calc(var(--hero-pump-scale,1) * 0.84)" }}
              className="h-full! w-auto! max-w-full object-contain mix-blend-multiply lg:h-auto! lg:w-[74%]! motion-safe:animate-[product-image-in_.55s_ease-out]"
            />
          </div>
          <DownloadButton
            label="Product Catalog"
            onClick={() => setPanel("catalog")}
            className="absolute! bottom-8 left-0 z-10 max-md:w-[212px] max-md:text-[14px]! md:bottom-[24%] md:left-[12.5%]"
          />
        </div>
        <ElasticGallery selected={selected} onSelect={setSelected} />
        <p
          role="status"
          className="mt-3 min-h-4 text-center text-[12px]! text-[#0d5792]"
        >
          {message}
        </p>
      </section>
      <ProductInformation />
      <ProductDocuments />
      <SmartPumpAssistant
        assetBase="/product-detail"
        headingId="product-assistant-title"
      />
      <RelatedProducts />
      <div
        data-product-newsletter
        className="mx-auto w-5/6 max-w-[1600px] pb-32 md:pb-40"
      >
        <NewsletterSubscription />
      </div>
      <dialog
        ref={dialog}
        onCancel={() => setPanel(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
        className="fixed inset-0 m-auto w-[calc(100%-32px)] max-w-[960px] rounded-3xl border border-white bg-[#edf7ff] p-6 text-[#27272A] shadow-2xl backdrop:bg-[#10243b99] backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[20px]! text-[#0d5792]">
            {panel === "model"
              ? "ARS / ARS-DD — 3D View"
              : "ARS / ARS-DD — Product Catalog"}
          </h2>
          <button
            type="button"
            aria-label="Close product dialog"
            onClick={() => setPanel(null)}
            className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-white"
          >
            <FiX className="size-6" />
          </button>
        </div>
        {panel === "model" ? (
          <ModelViewer />
        ) : (
          <div className="py-10">
            <p className="mb-6 max-w-xl text-[16px]! leading-[1.4]!">
              {description}
            </p>
            <Link href="/media/all-catalog" className={pill}>
              View product catalogs
              <FiArrowRight />
            </Link>
          </div>
        )}
      </dialog>
      <style jsx global>{`
        [data-product-detail] [data-hero-pump-layer] {
          mix-blend-mode: multiply;
        }
        [data-product-detail] [data-hero-pump] {
          mix-blend-mode: normal;
        }
        @keyframes product-image-in {
          from {
            opacity: 0.2;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        [data-product-detail] .pd-catalog-language,
        [data-product-detail] .pd-folder-mobile-label {
          display: none;
        }

        [data-product-detail] .pd-cross-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M14 9v10M9 14h10' stroke='white' stroke-width='1' opacity='.8'/%3E%3C/svg%3E");
          mask-image: linear-gradient(90deg, transparent, #000);
        }
        [data-product-detail] .pd-table-light {
          padding: 28px;
          mix-blend-mode: screen;
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }
        [data-product-detail] .pd-table-frame-video {
          width: 121.904762%;
          height: 141.176471%;
          left: -11.428571%;
          top: -19.607843%;
          object-fit: fill;
        }
        [data-product-detail] [data-pump-design]::before,
        [data-product-detail] [data-sectional-drawings]::before,
        [data-product-detail] [data-product-folders]::before {
          content: "";
          position: absolute;
          inset: 0 -10%;
          pointer-events: none;
          z-index: -1;
          background: linear-gradient(
            110deg,
            #f3faff 0%,
            #cbe6ff 48%,
            #edf8ff 100%
          );
          mask-image: linear-gradient(
            transparent,
            #000 12%,
            #000 88%,
            transparent
          );
        }
        [data-product-detail] [data-pump-design],
        [data-product-detail] [data-sectional-drawings],
        [data-product-detail] [data-product-folders] {
          position: relative;
          isolation: isolate;
        }
        [data-product-detail] [data-product-applications]::before {
          content: "";
          position: absolute;
          inset: -40px -10% 0;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(
            ellipse at 60% 45%,
            #c2e1ff 0%,
            #d6ebff 55%,
            #eef8ff 100%
          );
          mask-image: linear-gradient(
            transparent,
            #000 9%,
            #000 86%,
            transparent
          );
        }
        [data-product-detail] .pd-application {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        [data-product-detail] .pd-application::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          background: linear-gradient(
            100deg,
            #fff 0%,
            #d9e9ff 13%,
            #005eff 48%,
            #001ea2 100%
          );
          transition: opacity 300ms ease;
        }
        [data-product-detail] .pd-application > * {
          position: relative;
          z-index: 1;
        }
        [data-product-detail] .pd-application:hover::before,
        [data-product-detail] .pd-application:focus-visible::before {
          opacity: 1;
        }
        [data-product-detail] .pd-application:hover span,
        [data-product-detail] .pd-application:focus-visible span {
          color: white;
        }
        [data-product-detail] .pd-chat::after {
          content: "";
          position: absolute;
          bottom: -6px;
          width: 12px;
          height: 9px;
        }
        [data-product-detail] .pd-chat-blue {
          border-bottom-left-radius: 3px;
        }
        [data-product-detail] .pd-chat-blue::after {
          left: 0;
          background: #269ffd8c;
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }
        [data-product-detail] .pd-chat-red {
          border-bottom-right-radius: 3px;
        }
        [data-product-detail] .pd-chat-red::after {
          right: 0;
          background: #e30a178c;
          clip-path: polygon(0 0, 100% 0, 100% 100%);
        }
        [data-product-detail] .pd-drawing-crop {
          position: absolute;
          height: 86%;
          aspect-ratio: 331/595;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          overflow: hidden;
          max-width: 80%;
        }
        [data-product-detail] .pd-drawing-image {
          position: absolute;
          height: 100%;
          width: 147.432%;
          max-width: none;
          left: -1.813%;
          top: 0;
        }
        [data-product-detail] .pd-related-caption {
          width: 100%;
          transform: translateX(-50%);
        }
        [data-product-detail] .pd-related-caption p {
          position: absolute;
          width: calc(var(--related-size) * 1.95 - 36px);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
          font-size: clamp(12px, 1vw, 16px);
          line-height: 1.15;
          text-align: left;
        }
      `}</style>
    </main>
  );
}
