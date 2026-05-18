export interface Buildings {
  [key: string]: number; // buildingId -> level
}

export interface UserStats {
  userId: string;
  displayName: string;
  fullName?: string;
  studentClass?: string;
  email: string;
  dinar: number;
  ilmu: number;
  iman: number;
  pahala: number;
  level: number;
  buildings: Buildings;
  hasCompletedTutorial: boolean;
  dailyMissions?: {
    lastReset: string;
    completed: string[];
    progress: Record<string, number>;
  };
  updatedAt: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  rewardDinar: number;
  rewardPahala: number;
  type: 'quiz' | 'build' | 'battle';
}

export const DAILY_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Santri Cerdas',
    description: 'Jawab 5 kuis dengan benar hari ini.',
    target: 5,
    rewardDinar: 1000,
    rewardPahala: 200,
    type: 'quiz'
  },
  {
    id: 'm2',
    title: 'Arsitek Peradaban',
    description: 'Bangun atau upgrade 2 bangunan.',
    target: 2,
    rewardDinar: 1500,
    rewardPahala: 100,
    type: 'build'
  },
  {
    id: 'm3',
    title: 'Pejuang Iman',
    description: 'Menangkan 3 pertempuran di Battle Mode.',
    target: 3,
    rewardDinar: 2000,
    rewardPahala: 500,
    type: 'battle'
  }
];

export interface LeaderboardEntry {
  userId: string;
  username: string;
  fullName?: string;
  studentClass?: string;
  score: number;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface BuildingData {
  name: string;
  description: string;
  baseCost: number;
  resource: 'iman' | 'ilmu' | 'dinar' | 'pahala';
  production: number;
  icon: string;
  category: 'religion' | 'education' | 'economy' | 'social' | 'defense';
  imageUrl?: string;
}

export const BUILDINGS_DATA: Record<string, BuildingData> = {
  // RELIGION
  masjid: {
    name: 'Masjid Al-Fatih',
    description: 'Pusat ibadah awal untuk meningkatkan iman warga.',
    baseCost: 20,
    resource: 'iman',
    production: 10,
    icon: 'Castle',
    category: 'religion',
    imageUrl: 'https://images.unsplash.com/photo-1590076212ef5-a74955743a3e?q=80&w=800'
  },
  masjidRaya: {
    name: 'Masjid Raya Nabawi',
    description: 'Pusat peradaban besar dan pemersatu umat.',
    baseCost: 200,
    resource: 'iman',
    production: 50,
    icon: 'Castle',
    category: 'religion',
    imageUrl: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=800'
  },
  menaraAdzan: {
    name: 'Menara Adzan',
    description: 'Memperluas syiar Islam dan jangkauan dakwah.',
    baseCost: 100,
    resource: 'iman',
    production: 25,
    icon: 'Radio',
    category: 'religion',
    imageUrl: 'https://images.unsplash.com/photo-1628153322151-5fe134c4cc31?q=80&w=800'
  },

  // EDUCATION
  madrasah: {
    name: 'Madrasah Ilmu',
    description: 'Tempat menuntut ilmu dasar bagi para santri.',
    baseCost: 30,
    resource: 'ilmu',
    production: 15,
    icon: 'BookOpen',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=800'
  },
  perpustakaan: {
    name: 'Perpustakaan Baitul Hikmah',
    description: 'Pusat riset dan penyimpanan naskah kuno.',
    baseCost: 150,
    resource: 'ilmu',
    production: 40,
    icon: 'Scroll',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800'
  },
  pesantren: {
    name: 'Pesantren Luhur',
    description: 'Pusat pendidikan karakter dan spiritual.',
    baseCost: 250,
    resource: 'ilmu',
    production: 60,
    icon: 'GraduationCap',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=800'
  },

  // ECONOMY
  baitulMal: {
    name: 'Baitul Mal',
    description: 'Lembaga keuangan untuk mengelola zakat dan dinar.',
    baseCost: 50,
    resource: 'dinar',
    production: 30,
    icon: 'Coins',
    category: 'economy',
    imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=800'
  },
  pasarSyariah: {
    name: 'Pasar Syariah',
    description: 'Pusat perdagangan jujur dan berkah.',
    baseCost: 150,
    resource: 'dinar',
    production: 100,
    icon: 'Store',
    category: 'economy',
    imageUrl: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800'
  },

  // SOCIAL
  rumahSakit: {
    name: 'Baitul Syifa (RS)',
    description: 'Pusat kesehatan masyarakat gratis.',
    baseCost: 100,
    resource: 'pahala',
    production: 20,
    icon: 'HeartPulse',
    category: 'social',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800'
  },
  tamanKota: {
    name: 'Taman Andalusia',
    description: 'Area rekreasi dan tadabbur alam bagi warga.',
    baseCost: 80,
    resource: 'pahala',
    production: 15,
    icon: 'Trees',
    category: 'social',
    imageUrl: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800'
  },

  // DEFENSE
  gerbangKota: {
    name: 'Gerbang Salam',
    description: 'Pertahanan utama kota dari gangguan fisik.',
    baseCost: 300,
    resource: 'pahala',
    production: 50,
    icon: 'Shield',
    category: 'defense',
    imageUrl: 'https://images.unsplash.com/photo-1546412414-803b8a79a6d4?q=80&w=800'
  },
  bentengPertahanan: {
    name: 'Benteng Shalahuddin',
    description: 'Sistem pertahanan lapis baja untuk keamanan total peradaban.',
    baseCost: 1500,
    resource: 'pahala',
    production: 120,
    icon: 'ShieldCheck',
    category: 'defense',
    imageUrl: 'https://images.unsplash.com/photo-1599341618210-9154a3962635?q=80&w=800'
  },

  // NEW DIVERSE BUILDINGS
  observatorium: {
    name: 'Observatorium Falak',
    description: 'Pusat pengamatan bintang untuk penentuan waktu ibadah.',
    baseCost: 800,
    resource: 'ilmu',
    production: 150,
    icon: 'Sparkles',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800'
  },
  universitas: {
    name: 'Universitas Al-Azhar',
    description: 'Pusat pendidikan tinggi bergengsi pemersatu intelektual.',
    baseCost: 2000,
    resource: 'ilmu',
    production: 400,
    icon: 'GraduationCap',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1592237004396-8eb556213031?q=80&w=800'
  },
  bazaarBesar: {
    name: 'Bazaar Sutra',
    description: 'Pasar internasional yang sangat ramai dan penuh berkah.',
    baseCost: 1200,
    resource: 'dinar',
    production: 500,
    icon: 'Store',
    category: 'economy',
    imageUrl: 'https://images.unsplash.com/photo-1540808139414-7243c965e90d?q=80&w=800'
  },
  irigasiPertanian: {
    name: 'Irigasi Cordoba',
    description: 'Sistem pengairan modern untuk hasil bumi melimpah.',
    baseCost: 600,
    resource: 'dinar',
    production: 150,
    icon: 'Trees',
    category: 'economy',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800'
  },
  klinikHerbal: {
    name: 'Apotek Al-Farabi',
    description: 'Layanan kesehatan herbal dengan riset kedokteran terkini.',
    baseCost: 500,
    resource: 'pahala',
    production: 80,
    icon: 'HeartPulse',
    category: 'social',
    imageUrl: 'https://images.unsplash.com/photo-1540448051910-09cdaddf0011?q=80&w=800'
  },
  wismaMusafir: {
    name: 'Wisma Travelers',
    description: 'Penginapan gratis bagi para pejuang ilmu dan pedagang.',
    baseCost: 750,
    resource: 'pahala',
    production: 110,
    icon: 'Castle',
    category: 'social',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800'
  },
  pusatSeni: {
    name: 'Galeri Kaligrafi',
    description: 'Pusat pelestarian dan pameran seni kaligrafi Islami dunia.',
    baseCost: 900,
    resource: 'ilmu',
    production: 180,
    icon: 'PenTool',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800'
  },
  lapanganPanahan: {
    name: 'Arena Olahraga Sunnah',
    description: 'Tempat melatih ketangkasan memanah dan berkuda.',
    baseCost: 700,
    resource: 'pahala',
    production: 130,
    icon: 'Target',
    category: 'social',
    imageUrl: 'https://images.unsplash.com/photo-1511225070737-5af5ac9a690d?q=80&w=800'
  }
};
