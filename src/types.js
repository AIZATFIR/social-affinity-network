export const TIER_CONFIG = {
  lovers: {
    key: 'lovers',
    name: 'Lovers / Pasangan',
    color: '#FF2D55',
    recMax: 1,
    icon: 'favorite',
    radius: 120,
    description: 'Ikatan Intim Utama (Kapasitas: 1 | Energi: 30%)',
    energyWeight: 30.0,
    defaultTasks: [
      { id: 't1', text: 'Tanyakan kabar harian & dengarkan tanpa menyela', isDone: false },
      { id: 't2', text: 'Apresiasi usaha kecil & berikan dukungan emosional', isDone: false },
      { id: 't3', text: 'Agendakan quality time setiap akhir pekan', isDone: false }
    ]
  },
  close_friends: {
    key: 'close_friends',
    name: 'Close Friends',
    color: '#FFCC00',
    recMax: 5,
    icon: 'verified',
    radius: 260,
    description: 'Sahabat Kepercayaan Mendalam (Kapasitas: 5 | Energi: 8% per orang)',
    energyWeight: 8.0,
    defaultTasks: [
      { id: 't4', text: 'Saling dukung saat masa sulit & bersikap jujur', isDone: false },
      { id: 't5', text: 'Luangkan waktu nongkrong / mabar berkala', isDone: false },
      { id: 't6', text: 'Saling bantu dalam project pribadi', isDone: false }
    ]
  },
  family: {
    key: 'family',
    name: 'Keluarga',
    color: '#34C759',
    recMax: 10,
    icon: 'home',
    radius: 420,
    description: 'Lingkaran Kekerabatan (Kapasitas: 10 | Energi: 2.5% per orang)',
    energyWeight: 2.5,
    defaultTasks: [
      { id: 't7', text: 'Komunikasi berkala & tunjukkan rasa hormat', isDone: false },
      { id: 't8', text: 'Bantu kebutuhan urusan rumah tangga', isDone: false },
      { id: 't9', text: 'Rencanakan kumpul keluarga di hari besar', isDone: false }
    ]
  },
  friends: {
    key: 'friends',
    name: 'Teman',
    color: '#5856D6',
    recMax: 150,
    icon: 'groups',
    radius: 640,
    description: 'Lingkaran Sosialisasi Aktif (Kapasitas: 150 | Energi: 0.15% per orang)',
    energyWeight: 0.15,
    defaultTasks: [
      { id: 't10', text: 'Menjaga sopan santun & ramah saat bertemu', isDone: false },
      { id: 't11', text: 'Ikut serta dalam kegiatan kelompok / komunitas', isDone: false }
    ]
  },
  acquaintances: {
    key: 'acquaintances',
    name: 'Kenalan',
    color: '#64748B',
    recMax: 1500,
    icon: 'person_outline',
    radius: 960,
    description: 'Jaringan Luar / Professional (Kapasitas: 1500 | Energi: 0.01% per orang)',
    energyWeight: 0.01,
    defaultTasks: [
      { id: 't12', text: 'Menjaga etika profesional & saling sapa', isDone: false },
      { id: 't13', text: 'Bertukar informasi profesional / LinkedIn', isDone: false }
    ]
  }
};

export const AVATAR_PRESETS = [
  { id: 'person', symbol: 'person', label: 'Personal' },
  { id: 'favorite', symbol: 'favorite', label: 'Lover' },
  { id: 'verified', symbol: 'verified', label: 'Verified' },
  { id: 'home', symbol: 'home', label: 'Family' },
  { id: 'work', symbol: 'work', label: 'Work' },
  { id: 'sports_esports', symbol: 'sports_esports', label: 'Gaming' },
  { id: 'code', symbol: 'code', label: 'Tech' },
  { id: 'school', symbol: 'school', label: 'Campus' },
  { id: 'local_cafe', symbol: 'local_cafe', label: 'Social' }
];

export const INITIAL_CONTACTS = [
  {
    id: '1',
    name: 'Sarah Rostova',
    avatar: 'favorite',
    initials: 'SR',
    tier: 'lovers',
    phone: '628123456789',
    instagram: 'sarah.rostova',
    notes: 'Suka es krim matcha. Hari Ulang Tahun: 14 Februari.',
    attitudeTasks: [
      { id: 't1', text: 'Tanyakan kabar harian & dengarkan tanpa menyela', isDone: true },
      { id: 't2', text: 'Apresiasi usaha kecil & berikan dukungan emosional', isDone: false },
      { id: 't3', text: 'Agendakan quality time setiap akhir pekan', isDone: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Budi Santoso',
    avatar: 'sports_esports',
    initials: 'BS',
    tier: 'close_friends',
    phone: '628987654321',
    instagram: 'budi_tech',
    notes: 'Teman diskusi teknologi & investasi. Favorit tempat nongkrong: Co-working Space.',
    attitudeTasks: [
      { id: 't4', text: 'Saling dukung saat masa sulit & bersikap jujur', isDone: true },
      { id: 't5', text: 'Luangkan waktu nongkrong / mabar berkala', isDone: false },
      { id: 't6', text: 'Saling bantu dalam project pribadi', isDone: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ibu',
    avatar: 'home',
    initials: 'IB',
    tier: 'family',
    phone: '628111222333',
    instagram: '',
    notes: 'Hari Ulang Tahun: 10 Agustus. Senang diberi kabar harian singkat.',
    attitudeTasks: [
      { id: 't7', text: 'Komunikasi berkala & tunjukkan rasa hormat', isDone: true },
      { id: 't8', text: 'Bantu kebutuhan urusan rumah tangga', isDone: false },
      { id: 't9', text: 'Rencanakan kumpul keluarga di hari besar', isDone: false }
    ],
    createdAt: new Date().toISOString()
  }
];
