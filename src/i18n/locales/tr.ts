/**
 * Turkish locale — the primary, complete locale and the source of the
 * translation key shape (`Translation`). English mirrors this structure.
 */
export const tr = {
  common: {
    appName: 'FPV Drone Akademi',
    skipToContent: 'İçeriğe geç',
    loading: 'Yükleniyor…',
    error: 'Bir şeyler ters gitti.',
    retry: 'Tekrar dene',
    backToHome: 'Ana sayfaya dön',
    minutesShort: 'dk',
    close: 'Kapat',
  },
  nav: {
    home: 'Ana Sayfa',
    hardware: 'Donanım',
    flight: 'Uçuş Eğitimi',
    progress: 'İlerleme',
    openMenu: 'Menüyü aç',
    closeMenu: 'Menüyü kapat',
  },
  home: {
    heroKicker: 'Kalkışa hazır',
    heroTitle: 'FPV Drone Akademi',
    heroSubtitle:
      'Donanımı interaktif 3D ile keşfet, başlangıçtan ileri seviyeye uçmayı adım adım öğren.',
    ctaHardware: 'Donanımı Keşfet',
    ctaFlight: 'Uçmayı Öğren',
    tracksTitle: 'İki yol, tek hedef',
    hardwareCardTitle: 'Donanımı Öğren',
    hardwareCardDesc:
      'Frame’den uçuş kontrolcüsüne kadar her parçayı 3D modelde keşfet; ne işe yaradığını ve nasıl bağlandığını gör.',
    flightCardTitle: 'Uçmayı Öğren',
    flightCardDesc:
      'Beginner’dan Advanced’e kademeli müfredat: teori, görsel simülasyon, alıştırma ve kendini test etme.',
  },
  hardware: {
    title: 'Donanım Keşfi',
    intro:
      'Bir FPV drone’u oluşturan parçaları tanı. Bir parçaya tıkla; ne işe yaradığını, nasıl seçildiğini ve nasıl bağlandığını öğren.',
    partsHeading: 'Parçalar',
    selectPartHint: 'İncelemek için bir parça seç.',
    whatItDoes: 'Ne işe yarar',
    howToChoose: 'Nasıl seçilir',
    howItConnects: 'Nasıl bağlanır',
    commonMistakes: 'Sık yapılan hatalar',
    relatedLessons: 'İlgili dersler',
    rotateHint: 'Döndürmek için sürükle, yakınlaştırmak için kaydır.',
    onCraftNote: 'Drone üzerindeki parçalar 3B modelde vurgulanır.',
    threeDUnavailable: '3B görünüm bu cihazda kullanılamıyor. Parçaları listeden inceleyebilirsin.',
  },
  flight: {
    title: 'Uçuş Eğitimi',
    intro:
      'Seviyeni seç ve ilerle. Her ders kısa teori, görsel anlatım, interaktif demo ve mini quiz içerir.',
    levels: {
      beginner: 'Başlangıç',
      intermediate: 'Orta',
      advanced: 'İleri',
    },
    lessonsCount: '{{count}} ders',
    locked: 'Önce ön koşul dersleri tamamla',
    comingSoon: 'Yakında',
    inProgress: 'Devam ediyor',
  },
  lesson: {
    objectives: 'Bu derste öğrenecekleriniz',
    prerequisites: 'Ön koşullar',
    estimatedTime: 'Tahmini süre',
    startQuiz: 'Quiz’e başla',
    markComplete: 'Tamamlandı olarak işaretle',
    completed: 'Tamamlandı',
    next: 'Sonraki ders',
    previous: 'Önceki ders',
    notFound: 'Ders bulunamadı.',
  },
  quiz: {
    title: 'Mini Quiz',
    question: 'Soru {{current}} / {{total}}',
    submit: 'Cevapla',
    nextQuestion: 'Sonraki soru',
    finish: 'Bitir',
    correct: 'Doğru!',
    incorrect: 'Yanlış.',
    resultTitle: 'Sonuç',
    scoreLine: '{{total}} sorudan {{correct}} doğru',
    retry: 'Tekrar dene',
  },
  progress: {
    title: 'İlerlemen',
    completedLessons: 'Tamamlanan dersler',
    overall: 'Genel ilerleme',
    badges: 'Rozetler',
    noBadges: 'Henüz rozet kazanmadın. İlk dersini tamamlayarak başla!',
    reset: 'İlerlemeyi sıfırla',
    resetConfirm: 'Tüm ilerleme ve rozetler silinecek. Emin misin?',
  },
  badges: {
    locked: 'Kilitli',
    firstFlight: { name: 'İlk Uçuş', desc: 'İlk dersini tamamladın.' },
    beginnerGraduate: { name: 'Başlangıç Mezunu', desc: 'Tüm başlangıç derslerini tamamladın.' },
    intermediateGraduate: {
      name: 'Orta Seviye Mezunu',
      desc: 'Tüm orta seviye derslerini tamamladın.',
    },
    advancedGraduate: { name: 'İleri Seviye Mezunu', desc: 'Tüm ileri seviye derslerini tamamladın.' },
    fullCurriculum: { name: 'Tam Pilot', desc: 'Tüm müfredatı tamamladın!' },
  },
  settings: {
    title: 'Ayarlar',
    language: 'Dil',
    turkish: 'Türkçe',
    english: 'English',
    motion: 'Animasyon',
    motionSystem: 'Sistem ayarı',
    motionOn: 'Açık',
    motionOff: 'Azaltılmış',
    quality: '3D Kalite',
    qualityAuto: 'Otomatik',
    qualityHigh: 'Yüksek',
    qualityLow: 'Düşük',
  },
  notFound: {
    title: 'Sayfa bulunamadı',
    desc: 'Aradığın sayfa pistten ayrılmış olabilir.',
  },
  footer: {
    tagline: 'FPV’ye yeni başlayanlar için interaktif öğrenme platformu.',
    disclaimer:
      'Eğitim amaçlıdır. Uçuştan önce güncel SHGM/İHA mevzuatını resmî kaynaklardan doğrula.',
    regulations: 'SHGM / İHA kuralları',
  },
};

export type Translation = typeof tr;
