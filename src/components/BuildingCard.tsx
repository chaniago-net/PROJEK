import React from 'react';
import { Castle, BookOpen, Coins, Scroll, HeartPulse, ArrowUp, GraduationCap, Radio, Store, Trees, Shield, Eye, Target, PenTool, Sparkles, ShieldCheck } from 'lucide-react';
import { BUILDINGS_DATA } from '../types/game';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ICONS = {
  Castle: Castle,
  BookOpen: BookOpen,
  Coins: Coins,
  Scroll: Scroll,
  HeartPulse: HeartPulse,
  GraduationCap: GraduationCap,
  Radio: Radio,
  Store: Store,
  Trees: Trees,
  Shield: Shield,
  Target: Target,
  PenTool: PenTool,
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck,
};

interface BuildingCardProps {
  id: string;
  level: number;
  canAfford: boolean;
  onUpgrade: () => void;
  onClick?: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ id, level, canAfford, onUpgrade, onClick }) => {
  const data = BUILDINGS_DATA[id];
  const Icon = (ICONS as any)[data.icon] || Castle;
  
  const nextCost = data.baseCost * (level + 1);
  const isLocked = level === 0;

  const getTheme = () => {
    switch (data.category) {
      case 'religion': return {
        border: 'border-emerald-200/60',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        glow: 'shadow-emerald-500/5',
        accent: 'bg-emerald-500'
      };
      case 'education': return {
        border: 'border-blue-200/60',
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        glow: 'shadow-blue-500/5',
        accent: 'bg-blue-500'
      };
      case 'economy': return {
        border: 'border-amber-200/60',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        glow: 'shadow-amber-500/5',
        accent: 'bg-amber-500'
      };
      case 'social': return {
        border: 'border-rose-200/60',
        text: 'text-rose-700',
        bg: 'bg-rose-50',
        glow: 'shadow-rose-500/5',
        accent: 'bg-rose-500'
      };
      case 'defense': return {
        border: 'border-slate-300/60',
        text: 'text-slate-700',
        bg: 'bg-slate-100',
        glow: 'shadow-slate-500/5',
        accent: 'bg-slate-600'
      };
      default: return {
        border: 'border-slate-200',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        glow: 'shadow-slate-500/5',
        accent: 'bg-slate-400'
      };
    }
  };

  const theme = getTheme();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "bg-white border p-6 transition-all duration-500 group relative cursor-pointer overflow-hidden rounded-2xl",
        theme.border,
        theme.glow,
        "hover:shadow-2xl hover:shadow-slate-200/50",
        isLocked && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Subtle Inner Glow */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-radial-gradient from-transparent via-transparent to-current/[0.03]", theme.text)}></div>

      {/* Background Icon Watermark */}
      <div className={cn("absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 transform group-hover:scale-110", theme.text)}>
        <Icon size={140} strokeWidth={1} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className={cn(
          "p-3 rounded-xl border transition-all duration-500 group-hover:shadow-lg group-hover:shadow-current/5",
          theme.bg,
          theme.border,
          theme.text
        )}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">
            {data.category}
          </p>
          <div className="flex items-center gap-1.5 justify-end">
            <Eye className="w-3 h-3 text-islamic-gold opacity-0 group-hover:opacity-60 transition-opacity" />
            {isLocked && <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200/50 uppercase font-bold tracking-widest">Locked</span>}
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors tracking-tight mb-2">
        {data.name}
      </h2>
      
      <div className="flex items-center gap-4 mb-6">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest whitespace-nowrap">LVL {level}</p>
        <div className="flex-1 h-[6px] bg-slate-100 rounded-full overflow-hidden p-[1px]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((level / 10) * 100, 100)}%` }}
            className={cn("h-full rounded-full transition-colors", theme.accent)}
          ></motion.div>
        </div>
      </div>

      <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors font-medium mb-8 h-12 line-clamp-3 leading-relaxed">
        {data.description}
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase">
          <span className="text-slate-400">Current Output</span>
          <span className={cn(theme.text, "font-bold")}>{data.production * (level || 1)} {data.resource}</span>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-slate-100 via-slate-200 to-transparent"></div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onUpgrade();
        }}
        disabled={!canAfford}
        className={cn(
          "w-full font-bold px-4 py-3 text-[10px] uppercase tracking-[0.1em] transition-all duration-300 rounded-xl border-2",
          canAfford 
            ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm hover:shadow-md" 
            : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
        )}
      >
        {isLocked ? 'Construct' : 'Upgrade'} — {nextCost}
      </button>
    </motion.div>
  );
};

