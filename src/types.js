export const TIER_CONFIG = {
  lovers: {
    name: 'Lovers / Pasangan',
    color: '#FF2D55',
    recMax: 1,
    icon: 'favorite',
    description: 'Rekomendasi: 1 Orang (Intimate Bond)',
    template: {
      howToTreat: `[Prioritas Tinggi] Tanyakan kabar harian & dengarkan tanpa menyela.
[Prioritas Sedang] Apresiasi usaha kecil & berikan dukungan emosional.
[Opsional] Agendakan quality time setiap akhir pekan.`,
      doAndDonts: `[ANJURAN] Kirim ucapan semangat pagi & perhatian kecil.
[ANJURAN] Jaga komunikasi terbuka saat ada masalah.
[LARANGAN] Membahas masalah berat saat pasangan sedang lelah.
[LARANGAN] Mengabaikan pesan tanpa kabar lebih dari 6 jam.`,
      notes: `Catatan: Suka es krim matcha.
Hari Ulang Tahun: 14 Februari.
Love Language: Quality Time & Words of Affirmation.`
    }
  },
  close_friends: {
    name: 'Close Friends',
    color: '#FFCC00',
    recMax: 5,
    icon: 'verified',
    description: 'Rekomendasi: 5 Orang (Deep Trust Circle)',
    template: {
      howToTreat: `[Prioritas Tinggi] Saling dukung saat masa sulit & bersikap jujur.
[Prioritas Sedang] Luangkan waktu nongkrong / mabar berkala.
[Opsional] Saling bantu dalam project pribadi.`,
      doAndDonts: `[ANJURAN] Siap bantu saat sahabat butuh saran jernih.
[ANJURAN] Jaga rahasia & privasi bersama.
[LARANGAN] Membicarakan keburukan di belakang.
[LARANGAN] Datang hanya saat membutuhkan sesuatu.`,
      notes: `Teman diskusi teknologi & investasi.
Favorit tempat nongkrong: Co-working Space / Cafe.`
    }
  },
  family: {
    name: 'Keluarga',
    color: '#34C759',
    recMax: 10,
    icon: 'home',
    description: 'Rekomendasi: 10 Orang (Kinship Circle)',
    template: {
      howToTreat: `[Prioritas Tinggi] Komunikasi berkala & tunjukkan rasa hormat.
[Prioritas Sedang] Bantu kebutuhan urusan rumah tangga.
[Opsional] Rencanakan kumpul keluarga di hari raya.`,
      doAndDonts: `[ANJURAN] Tanya kesehatan & kabar secara rutin.
[ANJURAN] Bantu anggota keluarga yang sedang kesulitan.
[LARANGAN] Bicara dengan nada tinggi atau membentak.
[LARANGAN] Menghilang tanpa kabar dalam waktu lama.`,
      notes: `Hari Ulang Tahun: 10 Agustus.
Catatan: Senang diberi kabar harian singkat.`
    }
  },
  friends: {
    name: 'Teman',
    color: '#5856D6',
    recMax: 30,
    icon: 'groups',
    description: 'Rekomendasi: 30 Orang (Social Circle)',
    template: {
      howToTreat: `[Prioritas Tinggi] Menjaga sopan santun & ramah saat bertemu.
[Prioritas Sedang] Ikut serta dalam kegiatan kelompok / komunitas.
[Opsional] Saling berbagi info bermanfaat.`,
      doAndDonts: `[ANJURAN] Bersikap ramah & bersosialisasi santai.
[ANJURAN] Menghargai waktu & batas pribadi.
[LARANGAN] Memaksa hadir jika sedang ada kesibukan.
[LARANGAN] Membuat lelucon yang menyinggung.`,
      notes: `Kenal dari komunitas tech / kampus.`
    }
  },
  acquaintances: {
    name: 'Kenalan',
    color: '#64748b',
    recMax: 100,
    icon: 'person_outline',
    description: 'Rekomendasi: 100 Orang (Outer Network)',
    template: {
      howToTreat: `[Prioritas Tinggi] Menjaga etika profesional & saling sapa.
[Prioritas Sedang] Simpan kontak & dukung postingan profesional.
[Opsional] Bertukar kartu nama / akun LinkedIn.`,
      doAndDonts: `[ANJURAN] Respon sopan saat dihubungi.
[ANJURAN] Senyum & sapa jika berpapasan.
[LARANGAN] Terlalu mencampuri urusan pribadi.
[LARANGAN] Meminta bantuan besar tanpa hubungan jelas.`,
      notes: `Pertemuan awal: Seminar Tech / Event Networking.`
    }
  }
};

export const AVATAR_PRESETS = [
  { id: 'person', symbol: 'person', label: 'Personal' },
  { id: 'star', symbol: 'star', label: 'Star / VIP' },
  { id: 'verified', symbol: 'verified', label: 'Verified' },
  { id: 'work', symbol: 'work', label: 'Work / Business' },
  { id: 'code', symbol: 'code', label: 'Tech / Engineering' },
  { id: 'school', symbol: 'school', label: 'Academic / Campus' },
  { id: 'sports', symbol: 'sports_esports', label: 'Gaming / Esports' },
  { id: 'fitness', symbol: 'fitness_center', label: 'Fitness / Sports' },
  { id: 'design', symbol: 'palette', label: 'Design / Art' },
  { id: 'coffee', symbol: 'local_cafe', label: 'Coffee / Social' },
  { id: 'music', symbol: 'music_note', label: 'Music / Audio' },
  { id: 'travel', symbol: 'flight', label: 'Travel' }
];

export const INITIAL_CONTACTS = [
  {
    id: '1',
    name: 'Sarah Rostova',
    avatar: 'favorite',
    initials: 'SR',
    tier: 'lovers',
    whatsappNumber: '628123456789',
    instagramHandle: 'sarah.rostova',
    attitudeGuide: {
      howToTreat: `[Prioritas Tinggi] Tanyakan kabar harian & dengarkan tanpa menyela.
[Prioritas Sedang] Apresiasi usaha kecil & berikan dukungan emosional.
[Opsional] Agendakan quality time tiap akhir pekan.`,
      doAndDonts: `[ANJURAN] Kirim ucapan semangat pagi & perhatian kecil.
[ANJURAN] Jaga komunikasi terbuka saat ada masalah.
[LARANGAN] Membahas masalah berat saat pasangan sedang lelah.
[LARANGAN] Mengabaikan pesan tanpa kabar lebih dari 6 jam.`,
      notes: `Suka es krim matcha.
Hari Ulang Tahun: 14 Februari.
Love Language: Quality Time & Words of Affirmation.`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Budi Santoso',
    avatar: 'sports_esports',
    initials: 'BS',
    tier: 'close_friends',
    whatsappNumber: '628987654321',
    instagramHandle: 'budi_tech',
    attitudeGuide: {
      howToTreat: `[Prioritas Tinggi] Saling dukung saat masa sulit & bersikap jujur.
[Prioritas Sedang] Luangkan waktu nongkrong / mabar berkala.
[Opsional] Saling bantu dalam project pribadi.`,
      doAndDonts: `[ANJURAN] Siap bantu saat sahabat butuh saran jernih.
[ANJURAN] Jaga rahasia & privasi bersama.
[LARANGAN] Membicarakan keburukan di belakang.
[LARANGAN] Datang hanya saat butuh sesuatu.`,
      notes: `Teman diskusi teknologi & investasi.
Favorit tempat nongkrong: Co-working Space / Cafe.`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ibu',
    avatar: 'home',
    initials: 'IB',
    tier: 'family',
    whatsappNumber: '628111222333',
    instagramHandle: '',
    attitudeGuide: {
      howToTreat: `[Prioritas Tinggi] Komunikasi berkala & tunjukkan rasa hormat.
[Prioritas Sedang] Bantu kebutuhan urusan rumah tangga.
[Opsional] Rencanakan kumpul keluarga di hari raya.`,
      doAndDonts: `[ANJURAN] Tanya kesehatan & kabar secara rutin.
[ANJURAN] Bantu anggota keluarga yang sedang kesulitan.
[LARANGAN] Bicara dengan nada tinggi atau membentak.
[LARANGAN] Menghilang tanpa kabar dalam waktu lama.`,
      notes: `Hari Ulang Tahun: 10 Agustus.
Makanan favorit: Masakan rumah & es buah.
Catatan: Senang diberi kabar harian singkat.`
    },
    createdAt: new Date().toISOString()
  }
];
