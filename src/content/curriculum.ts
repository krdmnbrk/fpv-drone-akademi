import type { Level } from './types';

export const flightLevels: Level[] = ['beginner', 'intermediate', 'advanced'];

/**
 * A reference to a curriculum lesson. Authored lessons supply their own metadata
 * via MDX frontmatter; the entries below describe the *planned* lessons that are
 * outlined but not yet written, so the Flight page can show the full curriculum
 * with "coming soon" markers. Source of truth: src/content/curriculum-outline.md.
 */
export interface CurriculumLessonRef {
  id: string;
  level: Level;
  order: number;
  title: string;
  summary: string;
  prerequisites: string[];
}

export const plannedFlightLessons: CurriculumLessonRef[] = [
  // Beginner (orders 1–3 are authored as MDX: fpv-nedir, gorus-mesafesi-vs-fpv, ucus-modlari)
  {
    id: 'simulatorde-baslama',
    level: 'beginner',
    order: 4,
    title: 'Simülatörde başlama (Liftoff / Velocidrone)',
    summary: 'Gerçek drone kırmadan, simülatörle ucuza ve güvenle pratik yapmak.',
    prerequisites: ['fpv-nedir', 'ucus-modlari'],
  },
  {
    id: 'arming-disarming',
    level: 'beginner',
    order: 5,
    title: 'Arming (motorları aktifleştirme)',
    summary: 'Motorları ne zaman ve nasıl güvenle aktifleştirip (arm) durduracağını (disarm) öğren.',
    prerequisites: ['simulatorde-baslama'],
  },
  {
    id: 'throttle-kontrolu',
    level: 'beginner',
    order: 6,
    title: 'Gaz (throttle) kontrolü',
    summary: 'Gaz kolunun itmeyi nasıl belirlediğini ve yumuşak gaz kullanımını öğren.',
    prerequisites: ['arming-disarming'],
  },
  {
    id: 'ilk-hover',
    level: 'beginner',
    order: 7,
    title: 'İlk hover (havada sabit durma)',
    summary: 'Drone’u kontrollü biçimde havada sabit tutmayı öğren.',
    prerequisites: ['throttle-kontrolu', 'ucus-modlari'],
  },
  {
    id: 'guvenlik-ve-shgm',
    level: 'beginner',
    order: 8,
    title: 'Güvenlik + Türkiye SHGM kuralları',
    summary: 'Temel uçuş güvenliği ve Türkiye’deki yasal yükümlülükler (SHGM/İHA).',
    prerequisites: ['gorus-mesafesi-vs-fpv'],
  },
  // Intermediate
  {
    id: 'stabil-hover-yaw',
    level: 'intermediate',
    order: 1,
    title: 'Stabil hover ve yaw (dönüş)',
    summary: 'Sabit hover’ı korurken yaw ile drone’u kendi ekseninde döndürmek.',
    prerequisites: ['ilk-hover'],
  },
  {
    id: 'koordineli-donusler',
    level: 'intermediate',
    order: 2,
    title: 'Koordineli dönüşler',
    summary: 'Roll + yaw + throttle’ı birleştirerek pürüzsüz dönüş çizmek.',
    prerequisites: ['stabil-hover-yaw'],
  },
  {
    id: 'betaflight-giris',
    level: 'intermediate',
    order: 3,
    title: 'Betaflight’a giriş',
    summary: 'FPV drone’ların ayar yazılımı Betaflight’ın temel arayüzü.',
    prerequisites: ['arming-disarming'],
  },
  {
    id: 'pid-rates-temel',
    level: 'intermediate',
    order: 4,
    title: 'PID ve rates temel kavramı',
    summary: 'PID ve rates’in ne olduğunu ve uçuş hissini nasıl etkilediğini sezgisel düzeyde anla.',
    prerequisites: ['betaflight-giris'],
  },
  {
    id: 'lipo-bakimi',
    level: 'intermediate',
    order: 5,
    title: 'LiPo batarya bakımı',
    summary: 'LiPo’ları güvenli şarj etme, saklama (storage) ve ömrünü uzatma.',
    prerequisites: ['guvenlik-ve-shgm'],
  },
  {
    id: 'temel-ariza-cozme',
    level: 'intermediate',
    order: 6,
    title: 'Temel arıza çözme (troubleshooting)',
    summary: 'Arm olmama, motor titremesi, görüntü kaybı gibi sık sorunları sistemli çözme.',
    prerequisites: ['betaflight-giris', 'lipo-bakimi'],
  },
  // Advanced
  {
    id: 'freestyle-temelleri',
    level: 'advanced',
    order: 1,
    title: 'Freestyle temelleri (power loop, dive, split-S)',
    summary: 'Temel freestyle figürlerinin nasıl ve hangi sırayla öğrenildiği.',
    prerequisites: ['koordineli-donusler', 'pid-rates-temel'],
  },
  {
    id: 'yaris-cizgileri',
    level: 'advanced',
    order: 2,
    title: 'Yarış çizgileri (racing lines)',
    summary: 'Kapılar arası en hızlı ve pürüzsüz çizgiyi (line) seçmek.',
    prerequisites: ['freestyle-temelleri'],
  },
  {
    id: 'kendi-drone-kurma-lehimleme',
    level: 'advanced',
    order: 3,
    title: 'Kendi drone’unu kurma ve lehimleme',
    summary: 'Parçaları seçip güvenle lehimleyerek çalışan bir drone kurmak.',
    prerequisites: ['temel-ariza-cozme'],
  },
  {
    id: 'tuning',
    level: 'advanced',
    order: 4,
    title: 'Tuning (PID/filter ince ayar)',
    summary: 'Betaflight’ta PID, filtre ve rates ayarlarını uçuş hissine göre optimize etmek.',
    prerequisites: ['pid-rates-temel', 'kendi-drone-kurma-lehimleme'],
  },
  {
    id: 'long-range-temelleri',
    level: 'advanced',
    order: 5,
    title: 'Long-range temelleri',
    summary: 'Uzun menzil uçuşunda RF, batarya ve güvenlik farkları.',
    prerequisites: ['tuning', 'guvenlik-ve-shgm'],
  },
];
