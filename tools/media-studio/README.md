# Media Studio

Responsive Studio ile aynı renklerde, bağımsız Python masaüstü dönüştürücü.
Next.js uygulamasının dosyalarını değiştirmez. Medya işlemleri yerelde çalışır.

## Başlatma

Windows'ta `start.bat` dosyasını çift tıklayın. Hazır taşınabilir uygulama:
`dist/Media Studio/Media Studio.exe`. Bu klasörü **içindeki tüm dosyalarla birlikte**
başka bir yere taşıyabilirsiniz. Tek dosyalık sürüm `dist/desktop/Media Studio.exe`
ve masaüstündeki `Media Studio.exe` dosyasıdır. EXE için Python kurulumu gerekmez.

Kaynak kodla çalıştırmak için Python 3.11+ ve `install.bat`, ardından `python main.py`.
FFmpeg / FFprobe hazır pakete dahildir. Kaynak sürüm `bin/`, PATH veya önceki
`D:/Python Tools/media_converter/bin` kurulumunu kullanır.

## Kullanım

1. **Dosya ekle** veya **Klasör ekle** ile kaynakları seçin; birden fazla kaynak eklenebilir.
2. Kaynaktan ayrı bir çıktı konumu seçin.
3. Profili ve klasör düzenini seçerek **Dönüştürmeye başla** düğmesine basın.
4. Tamamlanan bir satıra çift tıklayarak önce/sonra karşılaştırması açın.
5. **Çıktıyı aç** ile dosyaları bulun veya **ZIP oluştur** ile arşivleyin.

Çıktı konumuna **yalnızca medya dosyaları** yazılır. `media_...`, `files`, CSV veya
JSON raporu eklenmez. Örneğin çıktı konumu `D:/optimize` seçildiğinde:

```text
D:/optimize/file/01.webp
D:/optimize/file/other/02.webp
```

**Klasör yapısını koru:** `file/other/02.png → file/other/02.webp`.
**Tek klasörde topla:** `file/other/02.png → 02.webp`.
Dosya kök adları korunur; sıra numarası veya ek eklenmez. Ad çakışmaları bildirilir;
önceden bulunan dosyaların üzerine yazılmaz. Diğer dosyalar yalnızca **Diğer dosyaları
kopyala** seçeneği açılırsa kopyalanır (varsayılan kapalı).

İşlem ayrıntıları ve hatalar **İşlem Geçmişi** sekmesindedir. Paketlenmiş sürümde
log ve ayarlar `%LOCALAPPDATA%/Media Studio` içinde tutulur; çıktı klasörüne yazılmaz.
Kaynak sürüm bu verileri `.state` içinde tutar. ZIP yalnızca son işlemde başarılı
üretilen dosyaları içerir; çıktı klasöründeki ilgisiz dosyaları eklemez.

## Kalite ve kontroller

| Profil | Statik WebP | VP9 video CRF |
| --- | --- | --- |
| Yüksek kalite | Kalite 92 | 24 |
| Dengeli web | Kalite 85 | 32 |
| En küçük dosya | Kalite 75 | 38 |
| Kayıpsız görsel | Kayıpsız WebP | 24 (video kayıplı) |

- PNG, JPEG, BMP, TIFF, WebP ve GIF → WebP.
- MP4, MOV, M4V, MKV, AVI ve WebM → WebM / VP9.
- GIF ve diğer animasyonlarda **GIF / animasyon: kayıpsız** varsayılan olarak açıktır.
  Çıktı `.webp` olur; aynı uzantıda GIF optimizasyonu bu sürümde yoktur.
- Görseller yeniden boyutlandırılmaz. EXIF yönü görüntüye uygulanır; ICC renk profili korunur.
  Diğer EXIF bilgileri taşınmaz. Yüksek bit derinlikli görseller hata ile kaynakta bırakılır.
- Kayıpsız görsellerde tüm karelerin görünür RGBA pikselleri karşılaştırılır.
  Tam saydam piksellerin görünmeyen RGB değerleri normalize edilir. Animasyonun zaman çizelgesi,
  kare süreleri ve tekrar sayısı denetlenir; aynı karelerin birleşmesi hareket kaybı sayılmaz.
- Videoda ölçekleme veya sabit FPS zorlaması yapılmaz. Çözünürlük, süre ve ses akışı kontrol edilir;
  varsayılan olarak çıktı baştan sona çözülerek bozuk veri olup olmadığı doğrulanır.
- Ses varsayılan olarak Opus ile korunur; sessiz hero videoları için **Sesi koru** kapatılabilir.
  Birinci görüntü ve ilk ses akışı dönüştürülür; altyazılar ve ek akışlar taşınmaz.
- Saydam videolar bu sürümde dönüştürülmez; alfa kanalı sessizce atılmaz.
- Video kalite profilleri ve Opus ses **kayıplıdır**. Çözünürlüğün korunması piksel eşdeğerliği
  garantisi değildir. Video karşılaştırma penceresindeki iki düğme dosyaları varsayılan oynatıcıda açar.
- Kayıpsız çıktı bazen daha büyük olur. **Dosya büyüdü** uyarısı ve negatif kazanç görünür;
  uygulama dosyayı gizlemez veya daha düşük kaliteyle sessizce tekrar kodlamaz.
- GIF dönüşümü ve kontrolü kare kare çalışır. Eski 180 milyon toplam piksel sınırı kaldırılmıştır;
  tüm açılmış kareleri aynı anda bellekte tutmaz. GIF kodlama sırasında ilerleme gösterilir.
- Bekletme, etkin kodlama tamamlandıktan sonraki kontrol noktasında uygulanır.
  Durdurma FFmpeg'i sonlandırır; Pillow'nun etkin kaydetme çağrısının bitmesi beklenebilir.
  Tamamlanan çıktılar korunur, yarım geçici çıktılar kaldırılır.

## Merkez uygulamaya bağlama

`engine.py` arayüzden bağımsızdır: `Options`, `scan_inputs`, `Converter`.
İlerleme olayları callback ile gelir: `begin`, `file_progress`, `phase`, `result`, `error`, `done`.
Sonuçlar `result` ve `done` olaylarında sözlük olarak döner; motor çıktı klasörüne log yazmaz.

```powershell
.venv\Scripts\python.exe cli.py "D:\medya\file" --output "D:\optimize" --lossless-images
.venv\Scripts\python.exe cli.py "D:\medya\file" --output "D:\optimize" --flat --mute
```

## Test / yeniden paketleme

```powershell
.venv\Scripts\python.exe -m unittest test_engine -v
.venv\Scripts\python.exe -m unittest test_gui -v
.venv\Scripts\python.exe -m pip install pyinstaller
.venv\Scripts\python.exe build.py
.venv\Scripts\python.exe build.py --onefile
```

Arayüz ve ana motor ayrı tutulur. Testler gerçek GIF süre/döngü/piksel eşitliğini,
PNG alfa kanalı, JPEG yönü, ad çakışmaları, dosya koruma, hata sonrası devam etme,
durdurma ve gerçek MOV → WebM çözümleme/ses/FPS kontrollerini kapsar.

Paket içinde dönüşüm testi: `"Media Studio.exe" --self-test "D:\test-icin-bos-klasor"`.
Belirtilen klasöre küçük örnekler ve `selftest-result.json` oluşturur; başarı çıkış kodu 0'dır.

Teknik kaynaklar: [Pillow WebP](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html#webp),
[FFmpeg](https://ffmpeg.org/ffmpeg-all.html). FFmpeg dağıtımının lisansı `ffmpeg -L` ile görülebilir.
