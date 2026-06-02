export interface LessonVideo {
  /** 11-character YouTube video id. */
  youtubeId: string;
  title: string;
  lang: 'tr' | 'en';
  channel?: string;
}

/**
 * lessonId -> recommended YouTube video. Each entry was researched and verified via
 * the YouTube oembed endpoint to exist and be embeddable (see the video-research
 * step). Turkish preferred; English used where no suitable Turkish video exists.
 */
export const lessonVideos: Record<string, LessonVideo> = {
  // Beginner
  'fpv-nedir': {
    youtubeId: '-ziyS9gasx4',
    title: 'FPV Dronları Hakkında Her Şey',
    lang: 'tr',
    channel: 'Ayhan Tarakçı',
  },
  'gorus-mesafesi-vs-fpv': {
    youtubeId: 'RSaPPGa626c',
    title: 'How to fly Line Of Sight: Acro Tutorial Part 1',
    lang: 'en',
    channel: 'The RCAddict',
  },
  'ucus-modlari': {
    youtubeId: 'Gmy1u8AkMeI',
    title: 'I love/hate Betaflight 4.5 Angle & Horizon Mode',
    lang: 'en',
    channel: 'Joshua Bardwell',
  },
  'simulatorde-baslama': {
    youtubeId: '52GGb93d-MU',
    title:
      'Yeni Başlayanlar İçin FPV Drone Yapımı | Simülatörler: Freerider, Velocidrone, LiftOff | 2. Bölüm',
    lang: 'tr',
    channel: 'Yükseklerde',
  },
  'arming-disarming': {
    youtubeId: 'WEgkdeZ82uE',
    title: 'How to set up Arm/Disarm on Betaflight | Creating Switches',
    lang: 'en',
    channel: 'DrainMan FPV',
  },
  'throttle-kontrolu': {
    youtubeId: 'ial7KpKNQi4',
    title: "Throttle Curve Nedir? FPV Drone'larda Gaz Kontrolü Nasıl Geliştirilir?",
    lang: 'tr',
    channel: 'Ömer Çankaya',
  },
  'ilk-hover': {
    youtubeId: 'YIoY72YIfKA',
    title: "Bu Hareketleri Öğrenmeden FPV'e Başlama!",
    lang: 'tr',
    channel: 'Mertcan Şimşir',
  },
  'guvenlik-ve-shgm': {
    youtubeId: '-U-EbRchaP4',
    title: 'SHGM İHA Pilot Kayıt Başvurusu Nasıl Yapılır',
    lang: 'tr',
    channel: 'TRonik Havacılık',
  },
  // Intermediate
  'stabil-hover-yaw': {
    youtubeId: 'weUlr2NtnMc',
    title: 'Master FPV Freestyle YAW CONTROL with THIS DRILL!',
    lang: 'en',
    channel: 'PropabilityFPV',
  },
  'koordineli-donusler': {
    youtubeId: '-qYXVXiHGFA',
    title: 'How to make coordinated turns in rate/acro mode',
    lang: 'en',
    channel: 'Joshua Bardwell',
  },
  'betaflight-giris': {
    youtubeId: '6rEZyqgZwHY',
    title: 'Betaflight 4.5 Kurulum & Flash Rehberi | Bölüm 1',
    lang: 'tr',
    channel: 'Sercan Zeybel',
  },
  'pid-rates-temel': {
    youtubeId: 'I7Wh8H-CQq4',
    title: 'PID Ayarları Nedir / Nasıl Yapılır? (Temel Bilgiler)',
    lang: 'tr',
    channel: 'Drone Hava Sahası',
  },
  'lipo-bakimi': {
    youtubeId: 'P7IDjWndeB0',
    title: 'LiPo Bataryalar ve Şarj İşlemleri - 1',
    lang: 'tr',
    channel: 'Drone Yapımı',
  },
  'temel-ariza-cozme': {
    youtubeId: 'dUV_U5iF6R8',
    title: "Quadcopter Motor Won't Spin — Real World Troubleshoot",
    lang: 'en',
    channel: 'Joshua Bardwell',
  },
  // Advanced
  'freestyle-temelleri': {
    youtubeId: 'YUxOcAOY2eA',
    title: 'How to Powerloop for Freestyle? FPV Beginner Tutorial',
    lang: 'en',
    channel: 'MaiOnHigh',
  },
  'yaris-cizgileri': {
    youtubeId: 'kTJp6lfxm74',
    title: 'How To Fly A Racing Drone — Slow is Smooth and Smooth is Fast',
    lang: 'en',
    channel: 'Joshua Bardwell',
  },
  'kendi-drone-kurma-lehimleme': {
    youtubeId: '7hzyrndCOPQ',
    title: "A Beginner's Guide to Building an FPV Drone from Scratch",
    lang: 'tr',
    channel: 'Teknik Atölye',
  },
  tuning: {
    youtubeId: 'ShnYLKmFTog',
    title: 'Betaflight PID Tuning Tab — Complete Walkthrough',
    lang: 'en',
    channel: 'Joshua Bardwell',
  },
  'long-range-temelleri': {
    youtubeId: 'N0ajKoef3qs',
    title: 'ELRS Complete Beginner Guide',
    lang: 'en',
    channel: 'Joshua Bardwell',
  },
};

export function getLessonVideo(lessonId: string): LessonVideo | undefined {
  return lessonVideos[lessonId];
}
