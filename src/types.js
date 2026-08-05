export const TIER_CONFIG = {
  lovers: {
    name: 'Lovers / Pasangan',
    color: '#ff2a6d',
    recMax: 1,
    icon: '❤️',
    description: 'Rekomendasi: 1 Orang (Intimate Bond)',
    template: {
      howToTreat: `🔥 [Tinggi] Tanyakan kabar harian & dengarkan tanpa menyela
⚡ [Sedang] Apresiasi usaha kecil & berikan dukungan emosional
💡 [Opsional] Agendakan quality time tiap akhir pekan`,
      doAndDonts: `✅ DO: Kirim ucapan semangat pagi & perhatian kecil
✅ DO: Jaga komunikasi terbuka saat ada masalah
❌ DONT: Membahas masalah berat saat pasangan sedang lelah
❌ DONT: Mengabaikan pesan tanpa kabar lebih dari 6 jam`,
      notes: `📌 Suka es krim matcha & hero Angela
📌 Hari Ulang Tahun: 14 Februari
📌 Love Language: Quality Time & Words of Affirmation`
    }
  },
  close_friends: {
    name: 'Close Friends',
    color: '#00f0ff',
    recMax: 5,
    icon: '🛡️',
    description: 'Rekomendasi: 5 Orang (Deep Trust Circle)',
    template: {
      howToTreat: `🔥 [Tinggi] Saling dukung saat masa sulit & bersikap jujur
⚡ [Sedang] Luangkan waktu nongkrong / mabar berkala
💡 [Opsional] Saling bantu dalam project pribadi`,
      doAndDonts: `✅ DO: Siap bantu saat sahabat butuh saran jernih
✅ DO: Jaga rahasia & privasi bersama
❌ DONT: Membicarakan keburukan di belakang
❌ DONT: Datang hanya saat butuh sesuatu`,
      notes: `📌 Teman seperjuangan rank Mythic MLBB
📌 Favorit tempat nongkrong: Co-working Space / Cafe
📌 Suka diskusi topik teknologi & investasi`
    }
  },
  family: {
    name: 'Keluarga',
    color: '#10b981',
    recMax: 10,
    icon: '🏠',
    description: 'Rekomendasi: 10 Orang (Kinship Circle)',
    template: {
      howToTreat: `🔥 [Tinggi] Komunikasi berkala & tunjukkan rasa hormat
⚡ [Sedang] Bantu kebutuhan urusan rumah tangga
💡 [Opsional] Rencanakan kumpul keluarga di hari raya`,
      doAndDonts: `✅ DO: Tanya kesehatan & kabar secara rutin
✅ DO: Bantu anggota keluarga yang sedang kesulitan
❌ DONT: Bicara dengan nada tinggi atau membentak
❌ DONT: Menghilang tanpa kabar dalam waktu lama`,
      notes: `📌 Hari Ulang Tahun: 10 Agustus
📌 Makanan favorit: Masakan rumah & es buah
📌 Catatan: Senang diberi kabar harian singkat`
    }
  },
  friends: {
    name: 'Teman',
    color: '#8b5cf6',
    recMax: 30,
    icon: '👥',
    description: 'Rekomendasi: 30 Orang (Social Circle)',
    template: {
      howToTreat: `🔥 [Tinggi] Menjaga sopan santun & ramah saat bertemu
⚡ [Sedang] Ikut serta dalam kegiatan kelompok / komunitas
💡 [Opsional] Saling berbagi info bermanfaat`,
      doAndDonts: `✅ DO: Bersikap ramah & bersosialisasi santai
✅ DO: Menghargai waktu & batas pribadi
❌ DONT: Memaksa hadir jika sedang ada kesibukan
❌ DONT: Membuat lelucon yang menyinggung`,
      notes: `📌 Kenal dari komunitas gaming / kampus
📌 Hobi: Futsal & Fotografi`
    }
  },
  acquaintances: {
    name: 'Kenalan',
    color: '#64748b',
    recMax: 100,
    icon: '👤',
    description: 'Rekomendasi: 100 Orang (Outer Network)',
    template: {
      howToTreat: `🔥 [Tinggi] Menjaga etika profesional & saling sapa
⚡ [Sedang] Simpan kontak & dukung postingan profesional
💡 [Opsional] Bertukar kartu nama / akun LinkedIn`,
      doAndDonts: `✅ DO: Respon sopan saat dihubungi
✅ DO: Senyum & sapa jika berpapasan
❌ DONT: Terlalu mencampuri urusan pribadi
❌ DONT: Meminta bantuan besar tanpa hubungan jelas`,
      notes: `📌 Pertemuan awal: Seminar Tech / Event Networking
📌 Bidang kerja: Digital Marketing`
    }
  }
};

export const AVATAR_PRESETS = [
  // Fruits
  { id: 'apple', emoji: '🍎', label: 'Apel' },
  { id: 'banana', emoji: '🍌', label: 'Pisang' },
  { id: 'grape', emoji: '🍇', label: 'Anggur' },
  { id: 'orange', emoji: '🍊', label: 'Jeruk' },
  { id: 'strawberry', emoji: '🍓', label: 'Stroberi' },
  { id: 'avocado', emoji: '🥑', label: 'Alpukat' },
  { id: 'peach', emoji: '🍑', label: 'Persik' },
  { id: 'watermelon', emoji: '🍉', label: 'Semangka' },
  { id: 'pineapple', emoji: '🍍', label: 'Nanas' },
  { id: 'cherries', emoji: '🍒', label: 'Ceri' },
  
  // Life Categories & Work/School/Sports
  { id: 'work', emoji: '💼', label: 'Work / Kerja' },
  { id: 'laptop', emoji: '💻', label: 'Laptop / Tech' },
  { id: 'family', emoji: '🏠', label: 'Family / Rumah' },
  { id: 'school', emoji: '🎓', label: 'School / Kampus' },
  { id: 'sports', emoji: '⚽', label: 'Olahraga' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming' },
  { id: 'music', emoji: '🎵', label: 'Musik' },
  { id: 'travel', emoji: '✈️', label: 'Travel' },
  { id: 'food', emoji: '🍔', label: 'Kuliner' },
  { id: 'coffee', emoji: '☕', label: 'Kopi' }
];

export const INITIAL_CONTACTS = [
  {
    id: '1',
    name: 'Sarah (Kekasih)',
    avatar: '🍓',
    tier: 'lovers',
    whatsappNumber: '628123456789',
    instagramHandle: 'sarah_mlbb',
    attitudeGuide: {
      howToTreat: `🔥 [Tinggi] Tanyakan kabar harian & dengarkan tanpa menyela
⚡ [Sedang] Apresiasi usaha kecil & berikan dukungan emosional
💡 [Opsional] Agendakan quality time tiap akhir pekan`,
      doAndDonts: `✅ DO: Kirim ucapan semangat pagi & perhatian kecil
✅ DO: Jaga komunikasi terbuka saat ada masalah
❌ DONT: Membahas masalah berat saat pasangan sedang lelah
❌ DONT: Mengabaikan pesan tanpa kabar lebih dari 6 jam`,
      notes: `📌 Suka es krim matcha & hero Angela
📌 Hari Ulang Tahun: 14 Februari
📌 Love Language: Quality Time & Words of Affirmation`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Budi (Gaming Squad)',
    avatar: '🎮',
    tier: 'close_friends',
    whatsappNumber: '628987654321',
    instagramHandle: 'budi_gaming',
    attitudeGuide: {
      howToTreat: `🔥 [Tinggi] Saling dukung saat masa sulit & bersikap jujur
⚡ [Sedang] Luangkan waktu nongkrong / mabar berkala
💡 [Opsional] Saling bantu dalam project pribadi`,
      doAndDonts: `✅ DO: Siap bantu saat sahabat butuh saran jernih
✅ DO: Jaga rahasia & privasi bersama
❌ DONT: Membicarakan keburukan di belakang
❌ DONT: Datang hanya saat butuh sesuatu`,
      notes: `📌 Teman seperjuangan rank Mythic MLBB
📌 Favorit tempat nongkrong: Co-working Space / Cafe
📌 Suka diskusi topik teknologi & investasi`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ibu (Rumah)',
    avatar: '🏠',
    tier: 'family',
    whatsappNumber: '628111222333',
    instagramHandle: '',
    attitudeGuide: {
      howToTreat: `🔥 [Tinggi] Komunikasi berkala & tunjukkan rasa hormat
⚡ [Sedang] Bantu kebutuhan urusan rumah tangga
💡 [Opsional] Rencanakan kumpul keluarga di hari raya`,
      doAndDonts: `✅ DO: Tanya kesehatan & kabar secara rutin
✅ DO: Bantu anggota keluarga yang sedang kesulitan
❌ DONT: Bicara dengan nada tinggi atau membentak
❌ DONT: Menghilang tanpa kabar dalam waktu lama`,
      notes: `📌 Hari Ulang Tahun: 10 Agustus
📌 Makanan favorit: Masakan rumah & es buah
📌 Catatan: Senang diberi kabar harian singkat`
    },
    createdAt: new Date().toISOString()
  }
];
