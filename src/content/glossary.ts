export interface GlossaryEntry {
  term: string;
  /** English expansion shown in parentheses in Turkish mode. */
  en?: string;
  /** English headword (used as the term in English mode; falls back to en/term). */
  termEn?: string;
  /** Turkish definition (source of truth). */
  definition: string;
  /** English definition (overlay; falls back to the Turkish one when absent). */
  definitionEn?: string;
}

/**
 * Curated FPV jargon glossary (Turkish). Powers the /sozluk page and gives
 * beginners a single place to decode the acronyms used across the lessons.
 */
export const glossary: GlossaryEntry[] = [
  { term: 'FPV', en: 'First Person View', termEn: 'FPV', definition: 'Drone’un kamerasından, birinci şahıs bakışıyla uçma.', definitionEn: 'Flying from the drone’s camera, with a first-person point of view.' },
  { term: 'Şasi', en: 'Frame', termEn: 'Frame', definition: 'Tüm parçaları üzerinde taşıyan, çarpmalara dayanan karbon iskelet.', definitionEn: 'The crash-resistant carbon skeleton that carries all the components.' },
  { term: 'Motor', en: 'Brushless Motor', termEn: 'Brushless Motor', definition: 'Pervaneyi döndüren fırçasız elektrik motoru; hızı KV ile ölçülür.', definitionEn: 'The brushless electric motor that spins the propeller; its speed is rated in KV.' },
  { term: 'KV', termEn: 'KV', definition: 'Motorun 1 volt başına yüksüz dönüş hızı (devir/dakika). Yüksek KV = hızlı dönüş, düşük tork.', definitionEn: 'The motor’s no-load spin speed per volt (RPM). High KV = fast spin, low torque.' },
  { term: 'ESC', en: 'Electronic Speed Controller', termEn: 'ESC', definition: 'Bataryadan gelen DC’yi motorun istediği üç fazlı sinyale çevirip hızı ayarlar.', definitionEn: 'Converts the battery’s DC into the three-phase signal the motor needs and regulates its speed.' },
  { term: 'FC', en: 'Flight Controller', termEn: 'FC', definition: 'Drone’un beyni; sensörlerle dengeyi sağlar ve motor komutlarını üretir.', definitionEn: 'The drone’s brain; uses sensors to keep it balanced and produces the motor commands.' },
  { term: 'RX', en: 'Receiver', termEn: 'RX', definition: 'Kumandadan gelen kontrol sinyallerini FC’ye ileten alıcı.', definitionEn: 'The receiver that passes the control signals from the radio to the FC.' },
  { term: 'VTX', en: 'Video Transmitter', termEn: 'VTX', definition: 'Kamera görüntüsünü kablosuz olarak gözlüğe gönderen video vericisi.', definitionEn: 'The video transmitter that sends the camera image wirelessly to the goggles.' },
  { term: 'LiPo', en: 'Lithium Polymer', termEn: 'LiPo', definition: 'Yüksek akım verebilen lityum-polimer batarya; dikkatli şarj edilip saklanır.', definitionEn: 'A lithium-polymer battery that can deliver high current; charge and store it carefully.' },
  { term: 'Pervane', en: 'Propeller', termEn: 'Propeller', definition: 'Dönerek itme üreten kanatçık; dönüş yönü (CW/CCW) ve hatve (pitch) önemlidir.', definitionEn: 'The blade that spins to produce thrust; its spin direction (CW/CCW) and pitch matter.' },
  { term: 'Throttle', en: 'Gaz', termEn: 'Throttle', definition: 'Toplam itmeyi belirleyen kol; drone’un yükseliş ve alçalışını kontrol eder.', definitionEn: 'The stick that sets total thrust; it controls the drone’s climb and descent.' },
  { term: 'Yaw', termEn: 'Yaw', definition: 'Drone’u kendi dikey ekseninde döndürme (burnu sağa/sola çevirme).', definitionEn: 'Rotating the drone around its own vertical axis (turning the nose left/right).' },
  { term: 'Roll', termEn: 'Roll', definition: 'Drone’u yana (sağa/sola) yatırma.', definitionEn: 'Tilting the drone to the side (left/right).' },
  { term: 'Pitch', termEn: 'Pitch', definition: 'Drone’un burnunu aşağı/yukarı eğme.', definitionEn: 'Tilting the drone’s nose down/up.' },
  { term: 'Arming', termEn: 'Arming', definition: 'Motorları uçuşa hazır hâle getirme (aktifleştirme).', definitionEn: 'Making the motors ready to fly (activating them).' },
  { term: 'Disarming', termEn: 'Disarming', definition: 'Motorları durdurup drone’u güvenli hâle getirme.', definitionEn: 'Stopping the motors and making the drone safe.' },
  { term: 'Failsafe', termEn: 'Failsafe', definition: 'Sinyal kesildiğinde drone’un otomatik güvenli davranışı (örn. motorları kesme).', definitionEn: 'The drone’s automatic safe behavior when the signal is lost (e.g. cutting the motors).' },
  { term: 'Angle modu', en: 'Angle Mode', termEn: 'Angle Mode', definition: 'Drone’un kendini otomatik dengelediği, en kolay uçuş modu.', definitionEn: 'The easiest flight mode, where the drone automatically self-levels.' },
  { term: 'Horizon modu', en: 'Horizon Mode', termEn: 'Horizon Mode', definition: 'Angle gibi dengeler, ama tam yatırınca takla atmaya izin verir.', definitionEn: 'Self-levels like Angle, but lets you flip when you push the stick fully over.' },
  { term: 'Acro modu', en: 'Acro Mode', termEn: 'Acro Mode', definition: 'Otomatik denge yoktur; pilot tüm açıları kontrol eder (freestyle ve yarış için).', definitionEn: 'No auto-leveling; the pilot controls every angle (for freestyle and racing).' },
  { term: 'Hover', termEn: 'Hover', definition: 'Drone’u havada sabit bir noktada, kontrollü biçimde tutma.', definitionEn: 'Holding the drone in the air at a fixed point in a controlled way.' },
  { term: 'VLOS', en: 'Visual Line of Sight', termEn: 'VLOS', definition: 'Drone’u çıplak gözle görerek uçurma. FPV gözlükle uçuş VLOS sayılmaz.', definitionEn: 'Flying while keeping the drone in direct sight with the naked eye. Flying with FPV goggles does not count as VLOS.' },
  { term: 'Gözlemci', en: 'Spotter', termEn: 'Spotter', definition: 'FPV uçuşunda drone’u çıplak gözle takip edip pilotu uyaran kişi.', definitionEn: 'The person who watches the drone with the naked eye during an FPV flight and warns the pilot.' },
  { term: 'Betaflight', termEn: 'Betaflight', definition: 'FPV drone’ların ayarlandığı en yaygın açık kaynak uçuş yazılımı.', definitionEn: 'The most widely used open-source flight firmware for configuring FPV drones.' },
  { term: 'PID', termEn: 'PID', definition: 'FC’nin drone’u dengede tutmak için yaptığı sürekli düzeltme algoritması.', definitionEn: 'The continuous correction algorithm the FC uses to keep the drone stable.' },
  { term: 'Rates', termEn: 'Rates', definition: 'Stick hareketinin ne kadar dönüş hızına çevrileceğini belirleyen ayar.', definitionEn: 'The setting that determines how much rotation rate a given stick movement produces.' },
  { term: 'OSD', en: 'On-Screen Display', termEn: 'OSD', definition: 'Görüntü üzerine voltaj, süre ve sinyal gibi bilgileri basan ekran katmanı.', definitionEn: 'The overlay layer that prints info such as voltage, flight time, and signal onto the video.' },
  { term: 'ELRS', en: 'ExpressLRS', termEn: 'ELRS', definition: 'Açık kaynaklı, uzun menzilli ve düşük gecikmeli kontrol-link sistemi.', definitionEn: 'An open-source, long-range, low-latency control-link system.' },
  { term: 'Polarizasyon', en: 'Polarization', termEn: 'Polarization', definition: 'Antenin dalga yönü (RHCP/LHCP). Verici ve alıcı anten aynı olmalı.', definitionEn: 'The wave orientation of the antenna (RHCP/LHCP). The transmit and receive antennas must match.' },
  { term: 'Gimbal', termEn: 'Gimbal', definition: 'Kumandadaki yaylı kontrol çubuğu (stick).', definitionEn: 'The spring-loaded control stick on the radio.' },
  { term: 'Simülatör', termEn: 'Simulator', definition: 'Gerçek drone kırmadan ucuza pratik yapılan uçuş yazılımı (Liftoff, Velocidrone vb.).', definitionEn: 'Flight software for practicing cheaply without crashing a real drone (Liftoff, Velocidrone, etc.).' },
  { term: 'DShot', termEn: 'DShot', definition: 'FC ile ESC arasındaki dijital hız-komutu protokolü.', definitionEn: 'The digital speed-command protocol between the FC and the ESC.' },
  { term: 'AGL', en: 'Above Ground Level', termEn: 'AGL', definition: 'Yerden yükseklik (irtifa). Türkiye’de hobi sınırı 120 m AGL’dir.', definitionEn: 'Height above the ground (altitude). In Türkiye the hobby limit is 120 m AGL.' },
  { term: 'İHA', termEn: 'UAV', definition: 'İnsansız Hava Aracı — drone’un Türkiye’deki resmî adı.', definitionEn: 'İnsansız Hava Aracı (Unmanned Aerial Vehicle) — the official name for a drone in Türkiye.' },
  { term: 'SHGM', termEn: 'SHGM', definition: 'Sivil Havacılık Genel Müdürlüğü — Türkiye’de drone kurallarını belirleyen kurum.', definitionEn: 'Sivil Havacılık Genel Müdürlüğü (Directorate General of Civil Aviation) — the authority that sets drone rules in Türkiye.' },
];
