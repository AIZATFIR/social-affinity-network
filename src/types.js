export const TIER_CONFIG = {
  lovers: {
    name: 'Lovers / Pasangan',
    color: '#ff2a6d',
    recMax: 1,
    icon: '❤️',
    description: 'Rekomendasi: 1 Orang (Intimate Bond)',
    template: {
      howToTreat: 'Selalu prioritaskan komunikasi jernih, ingat hari penting, & apresiasi usaha kecil.',
      doAndDonts: 'DO: Ucapan selamat pagi & tanya kabar. DONT: Bahas topik sensitif saat lagi capek.',
      notes: 'Suka kejutan kecil, es krim matcha, & perhatian konsisten.'
    }
  },
  close_friends: {
    name: 'Close Friends',
    color: '#00f0ff',
    recMax: 5,
    icon: '🛡️',
    description: 'Rekomendasi: 5 Orang (Deep Trust Circle)',
    template: {
      howToTreat: 'Saling dukung saat masa sulit, tempat berbagi cerita rahasia & diskusi jernih.',
      doAndDonts: 'DO: Siap bantu saat butuh saran. DONT: Bocorkan rahasia atau menghakimi.',
      notes: 'Teman curhat utama & kawan mabar setia.'
    }
  },
  family: {
    name: 'Keluarga',
    color: '#10b981',
    recMax: 10,
    icon: '🏠',
    description: 'Rekomendasi: 10 Orang (Kinship Circle)',
    template: {
      howToTreat: 'Jaga ikatan emosional, komunikasi berkala, dan tunjukkan rasa hormat.',
      doAndDonts: 'DO: Tanya kesehatan & momen penting. DONT: Bicara dengan nada tinggi.',
      notes: 'Keluarga dekat & sanak saudara utama.'
    }
  },
  friends: {
    name: 'Teman',
    color: '#8b5cf6',
    recMax: 30,
    icon: '👥',
    description: 'Rekomendasi: 30 Orang (Social Circle)',
    template: {
      howToTreat: 'Nongkrong & kerja sama santai, saling menghargai batas waktu pribadi.',
      doAndDonts: 'DO: Saling sapa & mabar santai. DONT: Memaksa hadir jika sedang sibuk.',
      notes: 'Teman komunitas, hobi, atau organisasi.'
    }
  },
  acquaintances: {
    name: 'Kenalan',
    color: '#64748b',
    recMax: 100,
    icon: '👤',
    description: 'Rekomendasi: 100 Orang (Outer Network)',
    template: {
      howToTreat: 'Menjaga sopan santun profesional & menyapa saat bertemu.',
      doAndDonts: 'DO: Jaga etika & salam hangat. DONT: Terlalu mencampuri urusan pribadi.',
      notes: 'Kolega kerja, rekan seminar, atau kenalan baru.'
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
      howToTreat: 'Ingat hari penting, apresiasi usaha kecil, dengarkan tanpa menghakimi.',
      doAndDonts: 'DO: Kasih ucapan selamat pagi. DONT: Bahas mabar pas dia lagi capek.',
      notes: 'Suka es krim matcha & hero Angela.'
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
      howToTreat: 'Selalu terbuka, saling bantu saat butuh saran jernih.',
      doAndDonts: 'Jujur dan to the point.',
      notes: 'Teman seperjuangan rank Mythic.'
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
      howToTreat: 'Kabar rutin tiap sore, selalu bersikap santun.',
      doAndDonts: 'DO: Tanya kabar kesehatan. DONT: Bicara dengan nada tinggi.',
      notes: 'Suka masakan rumah & tanaman hias.'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Pak Boss (Kantor)',
    avatar: '💼',
    tier: 'acquaintances',
    whatsappNumber: '628199988877',
    instagramHandle: '',
    attitudeGuide: {
      howToTreat: 'Respon cepat di jam kerja, berikan update progress tepat waktu.',
      doAndDonts: 'DO: Laporan terstruktur. DONT: Melewatkan deadline.',
      notes: 'Manajer Divisi Tech.'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Coach Alex (Gym)',
    avatar: '⚽',
    tier: 'friends',
    whatsappNumber: '628777666555',
    instagramHandle: 'alex_fitness',
    attitudeGuide: {
      howToTreat: 'Disiplin latihan, apresiasi saran workout.',
      doAndDonts: 'DO: Datang tepat waktu. DONT: Skip jadwal tanpa kabar.',
      notes: 'Personal Trainer Gym.'
    },
    createdAt: new Date().toISOString()
  }
];
