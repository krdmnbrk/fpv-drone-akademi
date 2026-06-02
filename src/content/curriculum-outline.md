# FPV Drone Eğitim Müfredatı — Genel Harita

Bu belge, platformun tüm ders haritasını içerir. İki ana parkur (track) vardır:

- **Donanım Parkuru (hardware):** Bir FPV drone'u oluşturan 11 parçayı tek tek tanıtır. 3B model üzerinde ilgili parça vurgulanarak işlenir.
- **Uçuş Parkuru (flight):** Üç seviyede (beginner / intermediate / advanced) uçuş becerilerini ve teorisini öğretir.

Her ders için aşağıda: başlık, 1 satırlık özet, öğrenme hedefleri, ön koşullar (prerequisite ders id'leri) ve parkur içi önerilen sıra (order) verilmiştir.

> **Pedagoji ilkesi:** Bir seferde tek kavram. Önce somut, sonra soyut. Her teori "uçarken neden önemli?" sorusuna bağlanır. İngilizce FPV terimleri parantez içinde korunur (topluluk İngilizce kullanır).

---

## DONANIM PARKURU (hardware)

11 parça, mantıklı bir montaj/anlama sırasıyla. Bu parçaların tam teknik tanımları `src/content/hardware/parts.json` dosyasındadır; aşağıdaki sıralama hem ders sırası hem de `parts.json` içindeki `order` alanıyla uyumludur.

| order | id | Parça (TR) | 1 satır özet |
|---|---|---|---|
| 1 | `frame` | Gövde / Şasi (frame) | Tüm parçaları taşıyan, çarpmalara dayanan karbon iskelet. |
| 2 | `motors` | Motorlar (motors) | Pervaneleri döndüren fırçasız (brushless) elektrik motorları. |
| 3 | `esc` | ESC (Elektronik Hız Kontrolcüsü) | Bataryadan gelen DC'yi motorların istediği sinyale çevirip hızı ayarlar. |
| 4 | `fc` | Uçuş Kontrolcüsü (flight controller, FC) | Drone'un beyni; sensörlerle dengeyi sağlar, motor komutlarını üretir. |
| 5 | `fpv-camera` | FPV Kamerası (fpv camera) | Pilotun gözü; canlı analog/dijital görüntüyü üretir. |
| 6 | `vtx` | Video Vericisi + Anten (VTX) | Kamera görüntüsünü 5.8 GHz'de gözlüğe kablosuz yollar. |
| 7 | `rx` | Alıcı (receiver, RX) | Kumandadan gelen kontrol komutlarını FC'ye iletir. |
| 8 | `propellers` | Pervaneler (propellers / props) | Dönerek itme üreten kanatçıklar; yön ve hatve (pitch) önemlidir. |
| 9 | `lipo` | LiPo Batarya (LiPo battery) | Yüksek akım veren lityum-polimer enerji kaynağı; dikkatli kullanılmalı. |
| 10 | `goggles` | FPV Gözlüğü (goggles) | Pilotun görüntüyü izlediği başa takılan ekran. |
| 11 | `radio` | Kumanda / Verici (radio / transmitter) | Pilotun drone'u kontrol ettiği el kumandası. |

**Donanım dersi şekli:** Her parça için `<PartHighlight part="..." />` ile 3B modelde parça vurgulanır; ardından "ne işe yarar / nasıl seçilir / nasıl bağlanır / sık yapılan hatalar" akışı işlenir. İçerik kaynağı `parts.json`'dur, böylece tek doğruluk kaynağı (single source of truth) korunur.

**Donanım — önerilen ön koşullar:** Donanım parkuru, uçuş parkurunun Beginner seviyesine paralel ilerleyebilir. Lehimleme ve kendi drone'unu kurma konuları Advanced uçuş dersi `kendi-drone-kurma-lehimleme` ile birlikte ele alınır.

---

## UÇUŞ PARKURU — BEGINNER (flight / beginner)

Hedef: Sıfır bilgiden, simülatörde güvenli ilk hover'a ve Türkiye kurallarını bilmeye kadar.

| order | id | Başlık | Özet | Hedefler (kısaca) | Ön koşullar |
|---|---|---|---|---|---|
| 1 | `fpv-nedir` | FPV nedir? | FPV'nin (First Person View) ne olduğunu ve neden normal drone'dan farklı olduğunu tanıtır. | FPV tanımı; FPV vs normal drone; tipik FPV setinin parçaları | — |
| 2 | `gorus-mesafesi-vs-fpv` | Görüş mesafesi (LOS) vs FPV (+ gözlemci kuralı) | Çıplak gözle (line-of-sight) uçuşla FPV uçuşu karşılaştırır; neden gözlemci (spotter) gerektiğini açıklar. | LOS vs FPV farkı; FPV'nin VLOS sayılmaması; gözlemci/spotter rolü; SHGM bağlantısı | `fpv-nedir` |
| 3 | `ucus-modlari` | Uçuş modları (Angle / Horizon / Acro) | Üç temel uçuş modunu ve hangi seviyede hangisinin kullanılacağını öğretir. | Angle/Horizon/Acro farkı; self-leveling kavramı; öğrenme sırası | `fpv-nedir` |
| 4 | `simulatorde-baslama` | Simülatörde başlama (Liftoff / Velocidrone) | Gerçek drone kırmadan, simülatörle ucuza ve güvenle pratik yapmayı anlatır. | Simülatör neden şart; popüler simülatörler; kumandayı bağlama | `fpv-nedir`, `ucus-modlari` |
| 5 | `arming-disarming` | Arming (motorları aktifleştirme) | Motorların ne zaman ve nasıl güvenle aktifleştirildiğini (arm) ve durdurulduğunu (disarm) öğretir. | Arm/disarm kavramı; arming switch; güvenlik kuralları; failsafe sezgisi | `simulatorde-baslama` |
| 6 | `throttle-kontrolu` | Gaz (throttle) kontrolü | Gaz kolunun itmeyi nasıl belirlediğini ve yumuşak gaz kullanımını öğretir. | Throttle = itme/yükseklik; hover gazı; yumuşak kontrol | `arming-disarming` |
| 7 | `ilk-hover` | İlk hover (havada sabit durma) | Drone'u kontrollü biçimde havada sabit tutmayı (hover) öğretir. | Hover nedir; roll/pitch ile düzeltme; göz seviyesi pratiği | `throttle-kontrolu`, `ucus-modlari` |
| 8 | `guvenlik-ve-shgm` | Güvenlik + Türkiye SHGM kuralları | Temel uçuş güvenliği ve Türkiye'deki yasal yükümlülükleri (SHGM/İHA) özetler. | Güvenlik kontrol listesi; SHGM kayıt; nerede uçulur/uçulmaz; gözlemci kuralı | `gorus-mesafesi-vs-fpv` |

> Beginner çıktısı: Öğrenci simülatörde güvenle hover yapabilir, temel terimleri bilir, Türkiye'de yasal/güvenli uçmanın ne demek olduğunu anlar. Regülasyon detayı `src/content/regulations/shgm.mdx`'te.

---

## UÇUŞ PARKURU — INTERMEDIATE (flight / intermediate)

Hedef: Kontrollü manevralar, Betaflight'a giriş ve drone bakımı/arıza çözme temelleri.

| order | id | Başlık | Özet | Hedefler (kısaca) | Ön koşullar |
|---|---|---|---|---|---|
| 1 | `stabil-hover-yaw` | Stabil hover ve yaw (dönüş) | Sabit hover'ı korurken yaw ile drone'u kendi ekseninde döndürmeyi öğretir. | Yaw ekseni; burnu çevirme; hover + yaw birleştirme | `ilk-hover` |
| 2 | `koordineli-donusler` | Koordineli dönüşler | Roll + yaw + throttle'ı birleştirerek pürüzsüz, kontrollü dönüş çizmeyi öğretir. | Roll vs yaw dönüşü; daire çizme; gaz yönetimi dönüşte | `stabil-hover-yaw` |
| 3 | `betaflight-giris` | Betaflight'a giriş | FPV drone'ların ayar yazılımı Betaflight'ın ne olduğunu ve temel arayüzünü tanıtır. | Betaflight nedir; sekmeler; pervane çıkarıp bağlama güvenliği; receiver/modes sekmesi | `arming-disarming` |
| 4 | `pid-rates-temel` | PID ve rates temel kavramı | PID ve rates'in ne olduğunu, uçuş hissini nasıl etkilediğini sezgisel düzeyde anlatır. | PID ne yapar (sezgisel); rates = dönüş hızı; ne zaman ayar gerekir | `betaflight-giris` |
| 5 | `lipo-bakimi` | LiPo batarya bakımı | LiPo'ları güvenli şarj etme, saklama (storage) ve ömrünü uzatmayı öğretir. | Hücre voltajı; storage voltajı; şarj akımı (C); şişme/atık kuralları | `guvenlik-ve-shgm` |
| 6 | `temel-ariza-cozme` | Temel arıza çözme (troubleshooting) | Arm olmama, motor titremesi, görüntü kaybı gibi sık sorunları sistemli çözmeyi öğretir. | Arming engelleri; motor/pervane kontrolü; video/RF sorunları; sistematik yaklaşım | `betaflight-giris`, `lipo-bakimi` |

> Intermediate çıktısı: Öğrenci kontrollü dönüşler yapabilir, Betaflight'ta temel ayarları görüp anlar, bataryalarını güvenle yönetir ve sık arızaları kendi çözebilir.

---

## UÇUŞ PARKURU — ADVANCED (flight / advanced)

Hedef: Freestyle ve yarış becerileri, kendi drone'unu kurup tune etmek, long-range temelleri.

| order | id | Başlık | Özet | Hedefler (kısaca) | Ön koşullar |
|---|---|---|---|---|---|
| 1 | `freestyle-temelleri` | Freestyle temelleri (power loop, dive, split-S) | Temel freestyle figürlerinin nasıl ve hangi sırayla öğrenildiğini anlatır. | Power loop; dive; split-S; momentum yönetimi; güvenli alan | `koordineli-donusler`, `pid-rates-temel` |
| 2 | `yaris-cizgileri` | Yarış çizgileri (racing lines) | Kapılar arası en hızlı ve pürüzsüz çizgiyi (line) seçmeyi öğretir. | Racing line mantığı; kapı/gate yaklaşımı; throttle yönetimi; tutarlılık | `freestyle-temelleri` |
| 3 | `kendi-drone-kurma-lehimleme` | Kendi drone'unu kurma ve lehimleme | Parçaları seçip güvenle lehimleyerek (soldering) çalışan bir drone kurmayı öğretir. | Parça uyumu; lehimleme güvenliği; sıralı montaj; ilk açılış (smoke check) | `temel-ariza-cozme` |
| 4 | `tuning` | Tuning (PID/filter ince ayar) | Betaflight'ta PID, filtre ve rates ayarlarını uçuş hissine göre optimize etmeyi öğretir. | Blackbox sezgisi; PID etkileri; filtre/gecikme dengesi; adım adım tuning | `pid-rates-temel`, `kendi-drone-kurma-lehimleme` |
| 5 | `long-range-temelleri` | Long-range temelleri | Uzun menzil uçuşunda RF, batarya ve güvenlik farklarını tanıtır. | ELRS/uzun menzil link; verici gücü ve anten; batarya menzil hesabı; failsafe ve risk | `tuning`, `guvenlik-ve-shgm` |

> Advanced çıktısı: Öğrenci freestyle/yarış manevralarını uygulayabilir, kendi aracını kurup tune edebilir ve long-range uçuşun ek risklerini bilir.

---

## Parkurlar arası bağlantı (cross-track)

- **Donanım ↔ Uçuş:** `arming-disarming` ve `throttle-kontrolu` dersleri `esc`, `motors`, `propellers` parça içerikleriyle; `betaflight-giris` `fc` parçasıyla; `long-range-temelleri` `vtx`, `rx`, `radio`, `lipo` parçalarıyla doğrudan ilişkilidir. İlgili dersler `parts.json` içindeki `relatedLessonIds` alanında eşleştirilmiştir.
- **Güvenlik/Regülasyon:** `guvenlik-ve-shgm` dersi `src/content/regulations/shgm.mdx` belgesine yönlendirir; bu belge resmi SHGM kaynaklarından doğrulanmıştır (doğrulama tarihi belgenin içinde).

## Quiz eşlemesi

Yazılmış quiz'ler `src/content/quizzes/` altındadır. Her ders frontmatter'ında `quizId` ile ilgili quiz'e bağlanır. Bu sürümde tamamlanan quiz'ler: `fpv-nedir`, `gorus-mesafesi-vs-fpv`, `ucus-modlari`. Diğer dersler için quiz'ler aynı şablonla sonradan eklenecektir.
