import React from 'react';
import { Coins, BookOpen, Heart, Award, LogOut, Trophy } from 'lucide-react';
import { UserStats } from '../types/game';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ResourceBarProps {
  stats: UserStats;
  onOpenLeaderboard: () => void;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ stats, onOpenLeaderboard }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-islamic-gold/20 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-2">
        <ResourceItem
          icon={<Coins className="w-4 h-4 text-yellow-600" />}
          label="Dinar"
          value={stats.dinar}
          color="text-yellow-700"
        />
        <ResourceItem
          icon={<BookOpen className="w-4 h-4 text-blue-600" />}
          label="Ilmu"
          value={stats.ilmu}
          color="text-blue-700"
        />
        <ResourceItem
          icon={<Heart className="w-4 h-4 text-red-600" />}
          label="Iman"
          value={stats.iman}
          color="text-red-700"
        />
        <ResourceItem
          icon={<Award className="w-4 h-4 text-islamic-green" />}
          label="Pahala"
          value={stats.pahala}
          color="text-islamic-green"
          highlight
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLeaderboard}
          className="p-2 hover:bg-islamic-gold/10 rounded-full transition-colors text-islamic-gold"
          title="Papan Peringkat"
        >
          <Trophy className="w-5 h-5" />
        </button>
        <div className="hidden md:block text-right">
          <p className="text-xs text-gray-500">Selamat Datang,</p>
          <p className="text-sm font-semibold text-islamic-green leading-none">{stats.displayName}</p>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500"
          title="Keluar"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ResourceItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
}> = ({ icon, label, value, color, highlight }) => (
  <motion.div
    key={value}
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-xl border border-transparent transition-all shrink-0",
      highlight && "bg-islamic-green/5 border-islamic-green/20"
    )}
  >
    <div className={cn("p-1.5 rounded-lg bg-gray-50", highlight && "bg-islamic-green/10")}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none mb-1">{label}</p>
      <p className={cn("text-sm font-bold leading-none", color)}>{value.toLocaleString()}</p>
    </div>
  </motion.div>
);
