# Medya klasörü düzeni

Her sayfa görsel, video, GIF ve 3D model dosyalarını kendi `public/<sayfa>/` klasöründen kullanır. Aynı medya farklı sayfalarda kullanılıyorsa dosya her sayfanın klasörüne kopyalanır; component kodu ortak kalabilir.

- Ortak header dosyaları: `public/header/`
- Ortak footer dosyaları: `public/footer/`
- Ortak fontlar: `src/assets/fonts/`
- Ana sayfa: `public/home/`
- IM Pump Technology: `public/im-pump/`
- 404 sayfası: `public/404/`
- Media alt sayfaları: `public/media/`

Ortak `JoinSempaGlobal`, `CatalogSolutions`, `SmartPumpAssistant` ve `SempaGlobal` bölümleri medya klasörünü `assetBase` parametresiyle alır. Harita açılır penceresindeki görseller de aynı klasörden yüklenir.

## Kopyalanan dosyalar

Kaynaklar silinmedi. Kopyalar SHA-256 ile karşılaştırıldı.

| Kaynak | Kullanılan yerel kopya |
| --- | --- |
| `/images/sempa-logo.png` | `/about-us/sempa-logo.png` |
| `/images/flags/tr.png` | `/contact/flags/tr.png` |
| `/home/sempa-global/forklift.png` | `/global/forklift.png` |
| `/home/sempa-global/sempa-global.webm` | `/global/sempa-global.webm` |
| `/blog/sempa-icon.png` | `/news/sempa-icon.png` |
| `/blog/sempa-icon.png` | `/news-detail/sempa-icon.png` |
| `/images/im-pump-technology.png` | `/news-detail/im-pump-technology.png` |
| `/3d/ARS-UF.glb` | `/product-detail/ARS-UF.glb` |
| `/products/product.webp` | `/solutions-category/product.webp` |
| `/products/product.webp` | `/solutions-detail/product.webp` |
| `/images/logo.gif` | `/header/logo.gif` |
| `/images/header-menu-bg.jpg` | `/header/header-menu-bg.jpg` |
| `/images/sempa-logo.png` | `/header/sempa-logo.png` |
| `/images/green-sempa.png` | `/header/green-sempa.png` |
| `/images/logo-slogan.png` | `/header/logo-slogan.png` |
| `/home/shared/images/fds.webp` | `/footer/fds.webp` |
| `/home/solution/atik-su.gif` | `/all-products/atik-su.gif` |
| `/home/solution/atik-su.gif` | `/pump-series/atik-su.gif` |
| `/home/solution/02.webp` | `/all-products/02.webp` |
| `/home/solution/02.webp` | `/pump-series/02.webp` |
| `/home/solution/03.png` | `/all-products/03.png` |
| `/home/solution/03.png` | `/pump-series/03.png` |
| `/all-products/1-k.jpg` | `/pump-series/1-k.jpg` |
| `/all-products/dpt-tr-100.jpg` | `/pump-series/dpt-tr-100.jpg` |
| `/all-products/dpt-di.jpg` | `/pump-series/dpt-di.jpg` |
| `/all-products/asl.jpg` | `/pump-series/asl.jpg` |
| `/all-products/tkf-ke.jpg` | `/pump-series/tkf-ke.jpg` |
| `/all-products/tkf-ah.jpg` | `/pump-series/tkf-ah.jpg` |
| `/all-products/tkf-m-80.jpg` | `/pump-series/tkf-m-80.jpg` |
| `/all-products/robot-el.webp` | `/pump-series/robot-el.webp` |
| `/all-products/solutions.webp` | `/pump-series/solutions.webp` |
| `/all-products/sempa-global.webm` | `/pump-series/sempa-global.webm` |
| `/all-products/Water Treatment.mp4` | `/pump-series/Water Treatment.mp4` |
| `/all-products/Agricultural Irrigation & Drainage.mp4` | `/pump-series/Agricultural Irrigation & Drainage.mp4` |
| `/all-products/Building System.mp4` | `/pump-series/Building System.mp4` |
| `/all-products/powerplant.mp4` | `/pump-series/powerplant.mp4` |
| `/all-products/magnific_create-a-video_Cqq3aLIEEy.mp4` | `/pump-series/magnific_create-a-video_Cqq3aLIEEy.mp4` |
| `/all-products/magnific_create-a-video_Cqq3aLIEEy.mp4` | `/product-detail/magnific_create-a-video_Cqq3aLIEEy.mp4` |

## Kontrolde bulunan önceden eksik dosya

Eksik `/foundry/eco-without-bp.webm` referansı, kullanıcının isteğiyle `/foundry/dokumhane.webp` görseliyle değiştirildi.

## Doğrulama

26 rota/alt rota için tarayıcıda medya klasörleri kontrol edildi. All Products ve Pump Series harita pencereleri, dört harita videosu ve robot-el koordinat videosu 393, 820 ve 1440 px genişliklerinde doğrulandı.
