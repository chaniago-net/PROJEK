import React from 'react';
import { Castle, BookOpen, Coins, Scroll, HeartPulse, ArrowUp, GraduationCap, Radio, Store, Trees, Shield, X } from 'lucide-react';
import { BUILDINGS_DATA } from '../types/game';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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
};

interface BuildingDetailModalProps {
  id: string;
  level: number;
  canAfford: boolean;
  onUpgrade: () => void;
  onClose: () => void;
}

export const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({ id, level, canAfford, onUpgrade, onClose }) => {
  const data = BUILDINGS_DATA[id];
  const Icon = (ICONS as any)[data.icon] || Castle;
  const nextCost = data.baseCost * (level + 1);
  const isLocked = level === 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border-8 border-white"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="aspect-video relative overflow-hidden bg-gray-200">
          <img 
            src={data.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800'} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{data.category}</span>
            </div>
            <h2 className="text-3xl font-serif italic text-white">{data.name}</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-sand/50 p-4 rounded-2xl border border-islamic-gold/10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Level Saat Ini</p>
              <p className="text-2xl font-bold text-islamic-green">{level}</p>
            </div>
            <div className="bg-sand/50 p-4 rounded-2xl border border-islamic-gold/10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Produksi</p>
              <p className="text-2xl font-bold text-islamic-gold">+{data.production * level} <span className="text-xs uppercase">{data.resource}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed italic">"{data.description}"</p>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm">Produksi Base:</span>
                 <span className="font-bold text-islamic-green">{data.production} {data.resource}/level</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm">Biaya Upgrade:</span>
                 <span className={cn("font-bold", canAfford ? "text-islamic-gold" : "text-red-400")}>
                   {nextCost} Dinar
                 </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onUpgrade();
              onClose();
            }}
            disabled={!canAfford}
            className={cn(
              "w-full mt-8 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg",
              canAfford 
                ? "bg-islamic-green text-islamic-gold hover:brightness-110" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <ArrowUp className="w-5 h-5" />
            {isLocked ? 'Mulai Pembangunan' : 'Tingkatkan Peradaban'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
