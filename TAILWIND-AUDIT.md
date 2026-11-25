# Sayfa stil envanteri

21 Ekim 2026 tarihinde mevcut kaynak kod üzerinden çıkarıldı.

| Sayfa | Önceki durum | Son durum |
| --- | --- | --- |
| Anasayfa | Tailwind, satır içi stiller, CSS blokları ve CSS Module birlikte | Kullanıcı isteğiyle kendi dosyaları değiştirilmedi |
| About Us | Büyük ölçüde Tailwind; statik satır içi stiller | Tailwind, tek `AboutUsPage.tsx` |
| Blog | Tailwind | Tailwind, tek `blogPage.tsx` |
| Blog Detail | Tailwind, ayrı carousel bileşeni ve Blog sayfasından bağımlılık | Tailwind, tek `blogDetailPage.tsx` |
| Career | Tailwind, ayrı form ve veri dosyaları | Tailwind, tek `careerPage.tsx` |
| Contact | Tailwind ve özel CSS blokları | Tailwind, tek `ContactPage.tsx` |
| E-Mission | Tailwind ve özel CSS blokları | Tailwind, tek `EmissionPage.tsx` |
| E-Service | Tailwind ve özel CSS blokları | Tailwind, tek `e-servicePage.tsx` |
| FAQ | Tailwind ve animasyon için satır içi stiller | Tailwind, tek `FAQPage.tsx` |
| Foundry | Büyük ölçüde Tailwind; statik satır içi stiller | Tailwind, tek `FoundryPage.tsx` |
| Green Pump | Tailwind, sekiz dosyaya ayrılmış sayfa | Tailwind, tek `GreenPumpPage.tsx` |
| I'm Pump Technology | Tailwind ve özel CSS blokları | Tailwind, tek `ImPumpPage.tsx` |
| Media ve alt sekmeleri | Tailwind ve yoğun statik satır içi stiller; ayrı sekme bileşenleri | Tailwind, tek `MediaPage.tsx` |
| News | Tailwind | Tailwind, tek `newsPage.tsx` |
| News Detail | Tailwind ve ayrı albüm bileşeni | Tailwind, tek `newsDetailPage.tsx` |
| Quality | Tailwind ve özel CSS blokları | Tailwind, tek `qualityPage.tsx` |
| Solutions Category | Tailwind ve özel CSS blokları | Tailwind, tek `solutions-categoryPage.tsx` |
| Solutions Detail | Tailwind ve özel CSS blokları | Tailwind, tek `solutions-detailPage.tsx` |
| Sustainability | Tailwind ve ayrı etki kartları bileşeni | Tailwind, tek `SustainabilityPage.tsx` |
| Not Found | Tailwind | Tailwind, tek `NotFoundPage.tsx` |

## Dosya yapısı

Anasayfa dışındaki 19 feature klasörünün her biri bir `.tsx` dosyası içerir. Sayfaya özel bileşenler, veriler ve Tailwind sınıfları bu dosyalarda bulunur. Next.js `app` rota girişleri, ortak Header/Footer, bülten ve ortak yardımcılar paylaşımlı kalır.

Sayfalarda ayrı CSS dosyası veya `style jsx` bloğu kalmadı. Ortak bülten, Header ve UncompromisingPerformance bileşenlerindeki statik stiller de Tailwind'e taşındı. Tailwind animasyon tanımları ortak `globals.css` tema alanındadır.

Kaydırma konumu, sürükleme, grafik değerleri ve animasyon ilerlemesi gibi çalışma anında hesaplanan değerler gerektiği yerde React `style` veya CSS değişkenleriyle aktarılır. Statik tasarım Tailwind sınıflarıyla tanımlanır.

## Doğrulama

- TypeScript: `npx tsc --noEmit` geçti.
- Üretim derlemesi: `npx next build --webpack` geçti.
- Değiştirilen feature ve ortak bileşenlerde ESLint hatası veya uyarısı yok; anasayfadaki mevcut uyarılar kapsam dışında kaldı.
- Sayfalar 390, 768 ve 1440 pikselde dönüşüm öncesi ölçü ve stillerle karşılaştırıldı.
- Fotoğraf galerisinin açılması, ilerlemesi ve Escape ile kapanması; kariyer pozisyon seçimi ve birleştirilen sayfaların açılışları kontrol edildi. İstemci tarafında JavaScript istisnası görülmedi.
- Anasayfanın kendi dosyaları yedekle bayt düzeyinde karşılaştırıldı; değişiklik yok.
