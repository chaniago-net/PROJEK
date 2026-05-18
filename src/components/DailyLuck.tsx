import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Coins, Star, X, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface DailyLuckProps {
  onReward: (reward: { dinar: number; pahala: number; type: string }) => void;
  onClose: () => void;
}

export const DailyLuck: React.FC<DailyLuckProps> = ({ onReward, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [result, setResult] = useState<any>(null);

  const rewards = [
    { label: 'Zakat Mal', dinar: 500, pahala: 50, color: 'bg-amber-100 text-amber-700' },
    { label: 'Tabarru', dinar: 1000, pahala: 100, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Hibah Besar', dinar: 2500, pahala: 250, color: 'bg-islamic-gold/20 text-islamic-gold' },
    { label: 'Ilmu Laduni', dinar: 200, pahala: 500, color: 'bg-blue-100 text-blue-700' },
    { label: 'Berkah Jumuah', dinar: 1500, pahala: 150, color: 'bg-purple-100 text-purple-700' },
  ];

  const handleSpin = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
      const luckyIndex = Math.floor(Math.random() * rewards.length);
      const reward = rewards[luckyIndex];
      setResult(reward);
      setIsSpinning(false);
      setHasSpun(true);
      onReward({ dinar: reward.dinar, pahala: reward.pahala, type: reward.label });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden p-8 border-8 border-islamic-gold/10 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-islamic-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
            <Sparkles className="w-10 h-10 text-islamic-gold" />
          </div>
          <h2 className="text-3xl font-serif italic text-islamic-green">Keberuntungan Santri</h2>
          <p className="text-gray-500 text-sm italic">"Apa yang ditaqdirkan menjadi milikmu, akan menemuimu."</p>
        </div>

        <div className="relative aspect-square flex items-center justify-center mb-10">
          <motion.div
            animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full h-full rounded-full border-[1.5rem] border-islamic-gold/5 flex items-center justify-center relative overflow-hidden"
          >
            {/* Spinning decorative elements */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-islamic-gold/10 rotate-45" />
                <div className="w-full h-1 bg-islamic-gold/10 -rotate-45" />
                <div className="w-full h-1 bg-islamic-gold/10 rotate-90" />
                <div className="w-full h-1 bg-islamic-gold/10 0" />
             </div>
             
             <AnimatePresence mode="wait">
               {isSpinning ? (
                 <motion.div 
                   key="spinning"
                   initial={{ scale: 0.8 }}
                   animate={{ scale: 1.1 }}
                   exit={{ scale: 0.8 }}
                   className="z-10 bg-white p-6 rounded-full shadow-xl"
                 >
                   <Gift className="w-12 h-12 text-islamic-gold animate-bounce" />
                 </motion.div>
               ) : hasSpun ? (
                 <motion.div 
                   key="result"
                   initial={{ scale: 0.5, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className={cn(
                     "z-10 p-8 rounded-full shadow-2xl text-center flex flex-col items-center gap-2 border-4 border-white",
                     result.color
                   )}
                 >
                    <span className="text-xs font-bold uppercase tracking-widest">Mendapat</span>
                    <span className="text-2xl font-serif italic whitespace-nowrap">{result.label}</span>
                 </motion.div>
               ) : (
                 <div className="z-10 bg-white p-8 rounded-full shadow-xl">
                   <Info className="w-12 h-12 text-islamic-gold" />
                 </div>
               )}
             </AnimatePresence>
          </motion.div>
        </div>

        {!hasSpun ? (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full btn-green py-5 rounded-2xl text-xl font-serif italic flex items-center justify-center gap-3 shadow-lg"
          >
            Buka Keberuntungan <Sparkles className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-500 py-5 rounded-2xl text-xl font-serif italic flex items-center justify-center gap-3"
          >
            Bersyukur & Melanjutkan
          </button>
        )}

        <p className="mt-8 text-[10px] text-center text-gray-400">
           Tersedia sekali setiap 24 jam. <br/>
           Kumpulkan berkah untuk membangun peradaban yang madani.
        </p>
      </motion.div>
    </div>
  );
};
