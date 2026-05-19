import React, { useState, useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { Auth } from './components/Auth';
import { ResourceBar } from './components/ResourceBar';
import { BuildingCard } from './components/BuildingCard';
import { BuildingDetailModal } from './components/BuildingDetailModal';
import { GameWorld } from './components/GameWorld';
import { QuizModal } from './components/QuizModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Tutorial } from './components/Tutorial';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { MissionBoard } from './components/MissionBoard';
import { DailyLuck } from './components/DailyLuck';
import { SekiMaterialModal } from './components/SekiMaterialModal';
import { AiUstaz } from './components/AiUstaz';
import { BattleMode } from './components/BattleMode';
import { BUILDINGS_DATA, UserStats, Buildings } from './types/game';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, GraduationCap, Sword, ShieldCheck, Map as MapIcon, Scroll, Gift, Bell, Book } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { user, stats, loading, updateStats, updateMissionProgress, claimMission } = useGameState();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMissionBoardOpen, setIsMissionBoardOpen] = useState(false);
  const [isDailyLuckOpen, setIsDailyLuckOpen] = useState(false);
  const [isSekiMaterialOpen, setIsSekiMaterialOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'empire' | 'battle'>('empire');
  const [activeCategory, setActiveCategory] = useState<'all' | 'religion' | 'education' | 'economy' | 'social' | 'defense'>('all');
  const [tutorialHiddenOverride, setTutorialHiddenOverride] = useState(false);
  const [news, setNews] = useState('Selamat datang di Peradaban Islam! Bangun kotamu dengan ilmu.');

  const isProfileIncomplete = !stats?.fullName || !stats?.studentClass;

  // Civilization News Ticker
  useEffect(() => {
    const newsItems = [
      "Warga kota rajin menuntut ilmu di Madrasah.",
      "Kabar gembira! Perkembangan Baitul Mal sangat pesat.",
      "Santri baru telah tiba di kota untuk belajar Al-Quran.",
      "Perpustakaan Baitul Hikmah menambah koleksi kitab baru.",
      "Masya Allah! Kota semakin makmur dan damai.",
      "Jangan lupa tunaikan zakat untuk keberkahan dinar.",
      "Ujian ilmu tersedia di Papan Misi harian."
    ];
    const interval = setInterval(() => {
      setNews(newsItems[Math.floor(Math.random() * newsItems.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Resource generation every minute
  useEffect(() => {
    if (!stats || !user) return;

    const interval = setInterval(async () => {
      const perHour = { dinar: 0, ilmu: 0, iman: 0, pahala: 0 };
      Object.entries(stats.buildings).forEach(([id, level]) => {
        const data = (BUILDINGS_DATA as any)[id];
        if (data && data.resource in perHour) {
          const prod = Number(data.production) || 0;
          const lvl = Number(level) || 0;
          (perHour as any)[data.resource] += (prod * lvl);
        }
      });

      // Add to current stats
      // Fix: Math.floor might be too aggressive if income is low.
      const income = {
        dinar: perHour.dinar / 60,
        ilmu: perHour.ilmu / 60,
        iman: perHour.iman / 60,
        pahala: perHour.pahala / 60
      };

      if (income.dinar > 0.001 || income.ilmu > 0.001 || income.iman > 0.001 || income.pahala > 0.001) {
        await updateStats({
          dinar: Number((stats.dinar + income.dinar).toFixed(4)),
          ilmu: Number((stats.ilmu + income.ilmu).toFixed(4)),
          iman: Number((stats.iman + income.iman).toFixed(4)),
          pahala: Number((stats.pahala + income.pahala).toFixed(4))
        });
      }
    }, 10000); // Changed from 60000 to 10000 (every 10s)

    return () => clearInterval(interval);
  }, [stats, user, updateStats]);

  const handleUpgrade = async (id: string) => {
    if (!stats) return;
    try {
      const level = stats.buildings[id] || 0;
      const cost = (BUILDINGS_DATA as any)[id].baseCost * (level + 1);

      // Use a small epsilon to avoid floating point issues
      if (stats.dinar >= (cost - 0.001)) {
        const newBuildings = { ...stats.buildings, [id]: level + 1 };
        await updateStats({
          dinar: Math.max(0, Number((stats.dinar - cost).toFixed(4))),
          buildings: newBuildings,
          level: stats.level + 1
        });
        await updateMissionProgress('build');
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  const handleQuizSuccess = async (pahala: number, ilmu: number) => {
    if (!stats) return;
    try {
      // Significantly increase rewards
      await updateStats({
        pahala: stats.pahala + (pahala * 10),
        ilmu: stats.ilmu + (ilmu * 10),
        dinar: stats.dinar + 200 // Bonus Dinar for every correct quiz
      });
      await updateMissionProgress('quiz');
    } catch (error) {
      console.error("Quiz result update failed:", error);
    }
  };

  const handleTutorialComplete = async () => {
    setTutorialHiddenOverride(true);
    await updateStats({ hasCompletedTutorial: true });
  };

  const handleBattleWin = async (pahala: number, dinar: number) => {
    if (!stats) return;
    await updateStats({
      pahala: stats.pahala + pahala,
      dinar: stats.dinar + dinar
    });
    await updateMissionProgress('battle');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-8 text-center italic">
        <div className="w-12 h-12 border-4 border-islamic-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-serif">Membuka Gerbang Peradaban...</p>
      </div>
    );
  }

  if (!user || !stats) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-sand pb-24">
      <ResourceBar 
        stats={stats} 
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-4 pt-24">
        {/* Navigation Tabs */}
        <div className="flex bg-white/50 backdrop-blur rounded-2xl p-1 mb-8 w-fit mx-auto border border-white">
          <TabButton 
            active={activeTab === 'empire'} 
            onClick={() => setActiveTab('empire')}
            icon={<MapIcon className="w-4 h-4" />}
            label="Empire"
          />
          <TabButton 
            active={activeTab === 'battle'} 
            onClick={() => setActiveTab('battle')}
            icon={<Sword className="w-4 h-4" />}
            label="Battle"
          />
        </div>

        {activeTab === 'empire' ? (
          <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left flex-1">
                <h1 className="text-5xl font-serif mb-2 italic">Kota {stats.fullName || stats.displayName}</h1>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                  <p className="bg-white/60 px-3 py-1 rounded-lg text-gray-500 uppercase tracking-widest font-bold text-[10px] border border-white">
                    Peringkat: Khalifah Muda
                  </p>
                  <p className="bg-islamic-gold/10 px-3 py-1 rounded-lg text-islamic-gold uppercase tracking-widest font-bold text-[10px] border border-islamic-gold/20">
                    Kelas: {stats.studentClass || 'N/A'} (No: {stats.absentNo || '-'})
                  </p>
                  <div className="flex items-center gap-2 bg-islamic-green/5 px-4 py-1.5 rounded-full border border-islamic-green/10 max-w-[200px] md:max-w-xs overflow-hidden">
                    <Bell className="w-3 h-3 text-islamic-green shrink-0 animate-pulse" />
                    <p className="text-[10px] text-islamic-green font-medium truncate mb-0">
                      {news}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* LEARNING HUB - NOW FRONT AND CENTER AS REQUESTED */}
            <section className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-islamic-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl font-serif"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <p className="text-islamic-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4">Pusat Pembelajaran Interaktif</p>
                    <h2 className="text-4xl md:text-5xl font-serif italic text-islamic-green">Ayo Bertumbuh!</h2>
                  </div>
                  <p className="text-gray-400 text-sm max-w-sm">Fokus utama kita adalah pengayaan materi dan evaluasi adab untuk membangun peradaban yang mulia.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pustaka SKI */}
                  <motion.button 
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setIsSekiMaterialOpen(true)}
                    className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-amber-500 text-white shadow-xl shadow-amber-500/20 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-transform">
                      <Book size={120} />
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 border border-white/30">
                      <Book className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Materi Pembelajaran</p>
                      <h3 className="text-2xl md:text-3xl font-serif italic mb-2">Pustaka SKI XI</h3>
                      <p className="text-xs opacity-80 leading-relaxed max-w-[180px]">Pelajari sejarah kejayaan Islam untuk inspirasi kotamu.</p>
                    </div>
                  </motion.button>

                  {/* Kuis PAI */}
                  <motion.button 
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setIsQuizOpen(true)}
                    className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-islamic-green text-white shadow-xl shadow-islamic-green/20 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-transform">
                      <GraduationCap size={120} />
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 border border-white/30">
                      <GraduationCap className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Evaluasi Adab</p>
                      <h3 className="text-2xl md:text-3xl font-serif italic mb-2">Mulai Kuis PAI</h3>
                      <p className="text-xs opacity-80 leading-relaxed max-w-[180px]">Uji pemahamanmu dan dapatkan Dinar & Pahala berlimpah.</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            </section>

            {/* VISUALISASI KOTA - NOW SECONDARY */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-6">
                <div className="h-px bg-islamic-gold/20 flex-1" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Visualisasi Peradaban 3D</h3>
                <div className="h-px bg-islamic-gold/20 flex-1" />
              </div>
              
              <GameWorld 
                buildings={stats.buildings} 
                onSelectBuilding={(id) => setSelectedBuildingId(id)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Column: Building Filter & Cards */}
              <div className="flex-1 w-full space-y-8">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {['all', 'religion', 'education', 'economy', 'social', 'defense'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat as any)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                        activeCategory === cat 
                          ? "bg-islamic-green text-islamic-gold border-islamic-green shadow-lg" 
                          : "bg-white text-gray-400 border-gray-100 hover:border-islamic-green/30"
                      )}
                    >
                      {cat === 'all' ? 'Semua' : cat}
                    </button>
                  ))}
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(BUILDINGS_DATA)
                    .filter(id => activeCategory === 'all' || BUILDINGS_DATA[id].category === activeCategory)
                    .map((id) => (
                    <BuildingCard
                      key={id}
                      id={id}
                      level={stats.buildings[id] || 0}
                      canAfford={stats.dinar >= (BUILDINGS_DATA as any)[id].baseCost * ((stats.buildings[id] || 0) + 1)}
                      onUpgrade={() => handleUpgrade(id)}
                      onClick={() => setSelectedBuildingId(id)}
                    />
                  ))}
                </section>
              </div>

              {/* Right Column: Special Actions */}
              <div className="w-full md:w-80 space-y-6 shrink-0">
                <button 
                  onClick={() => setIsMissionBoardOpen(true)}
                  className="w-full bg-white rounded-3xl p-6 border-2 border-islamic-gold/10 hover:border-islamic-gold transition-all shadow-sm group flex items-center gap-5"
                >
                  <div className="w-14 h-14 bg-islamic-gold rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Scroll className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tersedia</p>
                    <h3 className="text-lg font-serif italic text-islamic-green">Papan Misi</h3>
                  </div>
                </button>

                <button 
                  onClick={() => setIsDailyLuckOpen(true)}
                  className="w-full bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-500 transition-all shadow-sm group flex items-center gap-5"
                >
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harian</p>
                    <h3 className="text-lg font-serif italic text-islamic-green">Hadiah Santri</h3>
                  </div>
                </button>

                <div className="bg-white rounded-3xl p-6 border-2 border-blue-50/50">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Statistik Kota</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Populasi Santri</span>
                        <span className="text-sm font-bold text-islamic-green">{stats.level * 12} Jiwa</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Kemakmuran</span>
                        <span className="text-sm font-bold text-islamic-gold">{(stats.level * 1.5).toFixed(1)}%</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <BattleMode 
            onWin={handleBattleWin}
            onLose={() => {}}
            userStats={{
              level: stats.level,
              pahala: stats.pahala
            }}
          />
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(!stats.hasCompletedTutorial && !tutorialHiddenOverride) && (
          <Tutorial
            key="tutorial-step"
            onComplete={handleTutorialComplete}
          />
        )}
        {isQuizOpen && (
          <QuizModal
            key="quiz-modal"
            onClose={() => setIsQuizOpen(false)}
            onSuccess={handleQuizSuccess}
          />
        )}
        {isLeaderboardOpen && (
          <LeaderboardModal
            key="leaderboard-modal"
            onClose={() => setIsLeaderboardOpen(false)}
            currentUserId={user.uid}
          />
        )}
        {isMissionBoardOpen && (
          <MissionBoard
            key="mission-board"
            stats={stats}
            onClaim={claimMission}
            onClose={() => setIsMissionBoardOpen(false)}
          />
        )}
        {isDailyLuckOpen && (
          <DailyLuck 
            key="daily-luck"
            onReward={(reward) => updateStats({ dinar: stats.dinar + reward.dinar, pahala: stats.pahala + reward.pahala })}
            onClose={() => setIsDailyLuckOpen(false)}
          />
        )}
        {isSekiMaterialOpen && (
          <SekiMaterialModal 
            key="seki-material-modal"
            onClose={() => setIsSekiMaterialOpen(false)}
          />
        )}
        {selectedBuildingId && (
          <BuildingDetailModal
            key="building-detail"
            id={selectedBuildingId}
            level={stats.buildings[selectedBuildingId] || 0}
            canAfford={stats.dinar >= (BUILDINGS_DATA as any)[selectedBuildingId].baseCost * ((stats.buildings[selectedBuildingId] || 0) + 1)}
            onUpgrade={() => handleUpgrade(selectedBuildingId)}
            onClose={() => setSelectedBuildingId(null)}
          />
        )}
      </AnimatePresence>

      <AiUstaz />

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center pointer-events-none">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] bg-sand/80 inline-block px-4 py-1 rounded-full backdrop-blur pointer-events-auto">
          PAI Empire v1.0 • Membangun dengan Adab
        </p>
      </footer>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm tracking-tight",
      active ? "bg-white shadow-sm text-islamic-green" : "text-gray-400 hover:text-gray-600"
    )}
  >
    {icon}
    {label}
  </button>
);
