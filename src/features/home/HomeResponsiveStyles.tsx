export default function HomeResponsiveStyles() {
  return <style>{`
    @media(max-width:1023px){
      #home-video{background:#fff!important}
      #home-video>div[aria-hidden="true"]{background:none!important}
      #factory,#stack-cards,#sempa-global,#smart-pump,#home-news,#global-trust{font-variation-settings:"wght" 410,"wdth" 125}
      #factory a,#stack-cards a,#home-news a{font-variation-settings:"wght" 410,"wdth" 125}
      [data-home-hero]{height:max(920px,110svh);min-height:0}
      [data-home-hero-content],[data-home-hero-ui]{position:absolute!important;inset:0!important;height:100%!important;min-height:0!important}
      [data-home-mobile-title]{display:block}
      [data-home-desktop-title],[data-hero-scatter="cue"]{display:none!important}
      [data-home-hero] .hero-info{display:none!important}
      [data-home-hero] .hero-info:has([data-hero-scatter="info-mobile"]){display:block!important;bottom:9%;left:8%;right:8%}
      [data-hero-scatter="info-mobile"]{display:flex;flex-direction:column-reverse;gap:18px;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;backdrop-filter:none!important}
      [data-hero-scatter="info-mobile"]>div:first-child{border:1px solid #ffffff66;border-radius:16px;background:#ffffff25;backdrop-filter:blur(12px);padding:20px}
      [data-hero-scatter="info-mobile"]>div:first-child p{font-size:13px;line-height:1.15}
      [data-hero-scatter="info-mobile"]>div:last-child{border:0;padding:0}
      [data-hero-scatter="info-mobile"]>div:last-child p{font-size:16px;max-width:190px;line-height:1.05}
      [data-home-products]{height:1250px;min-height:1250px}
      [data-home-products] [data-home-product-viewport]{height:100%;overflow:visible}
      [data-home-products] [data-home-product-stage]{transform:none!important;top:0}
      [data-home-products] [data-home-categories]{display:none}
      [data-home-products] [data-home-product-title]{left:7%;top:38px;width:86%;height:auto;font-size:clamp(29px,7.6vw,45px);line-height:1.04;letter-spacing:-.05em}
      [data-home-products] [data-home-product-title] br{display:none}
      [data-home-products] [data-home-product-description]{left:8%;top:133px;width:84%;font-size:14px;line-height:1.16;letter-spacing:-.03em}
      [data-home-products] [data-home-product-description] br{display:none}
      [data-home-products] [data-home-product-card]{left:8%!important;top:495px!important;width:84%!important;height:350px!important;transform:none!important;filter:none!important}
      [data-home-products] [data-home-product-card]>div{border-radius:36px}
      [data-home-products] [data-home-product-card] p:first-of-type{left:10%;top:24%;width:80%;font-size:28px;line-height:1.04}
      [data-home-products] [data-home-product-card] p:nth-of-type(2){left:10%;top:49%;width:75%;font-size:15px;line-height:1.14}
      [data-home-products] [data-home-product-card] span{left:10%;top:77%;font-size:14px}
      [data-home-products] [data-home-product-rotate]{left:8%;top:220px;width:84%;height:300px}
      [data-home-products] [data-home-product-strip]{--product-card-size:clamp(105px,28vw,190px)!important;top:880px;height:280px;overflow:visible}
      [data-home-products] [data-home-product-strip]>div>div{height:auto}
      [data-home-products] [data-home-product-strip] button>div:nth-child(2){height:0;bottom:auto;top:calc(var(--product-card-size) - 8px)}
      [data-home-products] [data-home-product-strip] button:focus-visible>div:nth-child(2){height:180px;opacity:1;transform:none}
      [data-home-products] [data-home-gallery-layer]{bottom:38px;width:86%}
      #solutions{min-height:780px}
      #solutions>div.relative{justify-content:flex-start;padding:110px 24px 60px}
      #solutions>div.relative>h1{font-size:30px!important;line-height:1.05!important}
      #solutions>div.relative>h1 br{display:none}
      #solutions>div.relative>p{font-size:16px!important;line-height:1.16!important}
      #solutions>div.relative>div{margin-top:220px}
      #home-video>div.relative{width:calc(100% - 32px);padding-top:30px;padding-bottom:60px}
      #home-video [data-home-video-frame]{aspect-ratio:auto;height:680px;border-radius:30px}
      #home-video [data-home-video-frame]>h2{left:10%!important;top:24%!important;width:83%!important;font-size:clamp(28px,7.5vw,43px)!important;line-height:1.04!important}
      #home-video [data-home-video-frame]>div:first-of-type{opacity:.3!important}
      #home-video [data-home-video-frame]>div:has(button[aria-pressed]){display:none}
      #home-video [data-home-video-frame]>div:has(img[src*="video-arrow"]){left:10%!important;top:8%!important;width:9%!important}
      #home-video [data-home-video-frame] button[aria-label="Toggle fullscreen"]{width:26px!important;height:26px!important;left:auto!important;right:18px}
      #home-video #newsletter-subscription{margin-top:0}
      #home-video button[aria-label="10 seconds backward"],#home-video button[aria-label="10 seconds forward"]{width:22px!important;height:24px!important;top:86%!important}
      #home-video button[aria-label="10 seconds backward"]{left:28%!important}
      #home-video button[aria-label="10 seconds forward"]{left:66%!important}
      #home-video button[aria-label="Play video"],#home-video button[aria-label="Pause video"]{left:calc(50% - 30px)!important;top:83%!important;width:60px!important;height:60px!important;border-radius:50%;background:linear-gradient(#005eff,#001ea2);box-shadow:0 0 22px #005eff80}
      #social-media .tw-social-description{left:calc(50% - 43vw / var(--reference-scale));width:calc(86vw / var(--reference-scale));text-align:center;font-size:calc(16px / var(--reference-scale))!important;line-height:1.2!important}
      #social-media .tw-social-dribbble{font-size:calc(14px / var(--reference-scale))!important}

    }
    @media(min-width:768px) and (max-width:1023px){
      [data-home-hero]{height:max(980px,110svh)}
      [data-home-mobile-title]{top:145px;width:80%;left:10%}
      [data-home-hero] .hero-info:has([data-hero-scatter="info-mobile"]){left:15%;right:15%;bottom:7%}
      [data-home-products]{height:1420px}
      [data-home-products] [data-home-product-title]{font-size:44px;width:78%;left:11%;text-align:center}
      [data-home-products] [data-home-product-description]{top:148px;width:72%;left:14%;font-size:18px;text-align:center}
      [data-home-products] [data-home-product-card]{top:565px!important;left:18%!important;width:64%!important;height:390px!important}
      [data-home-products] [data-home-product-strip]{top:1005px}
      [data-home-products] [data-home-product-strip] button>div[aria-hidden="false"]{height:200px}
      #home-video [data-home-video-frame]{height:760px}
    }
  `}</style>;
}
