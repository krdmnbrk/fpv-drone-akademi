export interface GlossaryEntry {
  term: string;
  /** English expansion, when the Turkish term differs from the English one. */
  en?: string;
  definition: string;
}

/**
 * Curated FPV jargon glossary (Turkish). Powers the /sozluk page and gives
 * beginners a single place to decode the acronyms used across the lessons.
 */
export const glossary: GlossaryEntry[] = [
  { term: 'FPV', en: 'First Person View', definition: 'Drone’un kamerasından, birinci şahıs bakışıyla uçma.' },
  { term: 'Şasi', en: 'Frame', definition: 'Tüm parçaları üzerinde taşıyan, çarpmalara dayanan karbon iskelet.' },
  { term: 'Motor', en: 'Brushless Motor', definition: 'Pervaneyi döndüren fırçasız elektrik motoru; hızı KV ile ölçülür.' },
  { term: 'KV', definition: 'Motorun 1 volt başına yüksüz dönüş hızı (devir/dakika). Yüksek KV = hızlı dönüş, düşük tork.' },
  { term: 'ESC', en: 'Electronic Speed Controller', definition: 'Bataryadan gelen DC’yi motorun istediği üç fazlı sinyale çevirip hızı ayarlar.' },
  { term: 'FC', en: 'Flight Controller', definition: 'Drone’un beyni; sensörlerle dengeyi sağlar ve motor komutlarını üretir.' },
  { term: 'RX', en: 'Receiver', definition: 'Kumandadan gelen kontrol sinyallerini FC’ye ileten alıcı.' },
  { term: 'VTX', en: 'Video Transmitter', definition: 'Kamera görüntüsünü kablosuz olarak gözlüğe gönderen video vericisi.' },
  { term: 'LiPo', en: 'Lithium Polymer', definition: 'Yüksek akım verebilen lityum-polimer batarya; dikkatli şarj edilip saklanır.' },
  { term: 'Pervane', en: 'Propeller', definition: 'Dönerek itme üreten kanatçık; dönüş yönü (CW/CCW) ve hatve (pitch) önemlidir.' },
  { term: 'Throttle', en: 'Gaz', definition: 'Toplam itmeyi belirleyen kol; drone’un yükseliş ve alçalışını kontrol eder.' },
  { term: 'Yaw', definition: 'Drone’u kendi dikey ekseninde döndürme (burnu sağa/sola çevirme).' },
  { term: 'Roll', definition: 'Drone’u yana (sağa/sola) yatırma.' },
  { term: 'Pitch', definition: 'Drone’un burnunu aşağı/yukarı eğme.' },
  { term: 'Arming', definition: 'Motorları uçuşa hazır hâle getirme (aktifleştirme).' },
  { term: 'Disarming', definition: 'Motorları durdurup drone’u güvenli hâle getirme.' },
  { term: 'Failsafe', definition: 'Sinyal kesildiğinde drone’un otomatik güvenli davranışı (örn. motorları kesme).' },
  { term: 'Angle modu', en: 'Angle Mode', definition: 'Drone’un kendini otomatik dengelediği, en kolay uçuş modu.' },
  { term: 'Horizon modu', en: 'Horizon Mode', definition: 'Angle gibi dengeler, ama tam yatırınca takla atmaya izin verir.' },
  { term: 'Acro modu', en: 'Acro Mode', definition: 'Otomatik denge yoktur; pilot tüm açıları kontrol eder (freestyle ve yarış için).' },
  { term: 'Hover', definition: 'Drone’u havada sabit bir noktada, kontrollü biçimde tutma.' },
  { term: 'VLOS', en: 'Visual Line of Sight', definition: 'Drone’u çıplak gözle görerek uçurma. FPV gözlükle uçuş VLOS sayılmaz.' },
  { term: 'Gözlemci', en: 'Spotter', definition: 'FPV uçuşunda drone’u çıplak gözle takip edip pilotu uyaran kişi.' },
  { term: 'Betaflight', definition: 'FPV drone’ların ayarlandığı en yaygın açık kaynak uçuş yazılımı.' },
  { term: 'PID', definition: 'FC’nin drone’u dengede tutmak için yaptığı sürekli düzeltme algoritması.' },
  { term: 'Rates', definition: 'Stick hareketinin ne kadar dönüş hızına çevrileceğini belirleyen ayar.' },
  { term: 'OSD', en: 'On-Screen Display', definition: 'Görüntü üzerine voltaj, süre ve sinyal gibi bilgileri basan ekran katmanı.' },
  { term: 'ELRS', en: 'ExpressLRS', definition: 'Açık kaynaklı, uzun menzilli ve düşük gecikmeli kontrol-link sistemi.' },
  { term: 'Polarizasyon', en: 'Polarization', definition: 'Antenin dalga yönü (RHCP/LHCP). Verici ve alıcı anten aynı olmalı.' },
  { term: 'Gimbal', definition: 'Kumandadaki yaylı kontrol çubuğu (stick).' },
  { term: 'Simülatör', definition: 'Gerçek drone kırmadan ucuza pratik yapılan uçuş yazılımı (Liftoff, Velocidrone vb.).' },
  { term: 'DShot', definition: 'FC ile ESC arasındaki dijital hız-komutu protokolü.' },
  { term: 'AGL', en: 'Above Ground Level', definition: 'Yerden yükseklik (irtifa). Türkiye’de hobi sınırı 120 m AGL’dir.' },
  { term: 'İHA', definition: 'İnsansız Hava Aracı — drone’un Türkiye’deki resmî adı.' },
  { term: 'SHGM', definition: 'Sivil Havacılık Genel Müdürlüğü — Türkiye’de drone kurallarını belirleyen kurum.' },
];
