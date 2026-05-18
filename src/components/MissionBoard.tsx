import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Target, Trophy, Coins, Star, X } from 'lucide-react';
import { DAILY_MISSIONS, UserStats } from '../types/game';
import { cn } from '../lib/utils';

interface MissionBoardProps {
  stats: UserStats;
  onClaim: (missionId: string) => void;
  onClose: () => void;
}

export const MissionBoard: React.FC<MissionBoardProps> = ({ stats, onClaim, onClose }) => {
  const missionsState = stats.dailyMissions || { completed: [], progress: {}, lastReset: new Date().toISOString() };
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-islamic-green/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-sand rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border-8 border-white p-6 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-islamic-gold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-serif italic text-islamic-green">Papan Misi Harian</h2>
          <p className="text-gray-500 text-sm">Selesaikan tugas untuk memperkuat peradaban</p>
        </div>

        <div className="space-y-4">
          {DAILY_MISSIONS.map((mission) => {
            const currentProgress = missionsState.progress?.[mission.id] || 0;
            const isCompleted = missionsState.completed?.includes(mission.id);
            const canClaim = currentProgress >= mission.target && !isCompleted;
            const progressPercent = Math.min(100, (currentProgress / mission.target) * 100);

            return (
              <div 
                key={mission.id}
                className={cn(
                  "bg-white rounded-2xl p-5 border-2 transition-all",
                  isCompleted ? "border-green-100 opacity-60" : "border-islamic-gold/10"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      isCompleted ? "bg-green-100" : "bg-islamic-gold/10"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Target className="w-5 h-5 text-islamic-gold" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{mission.title}</h3>
                      <p className="text-xs text-gray-500">{mission.description}</p>
                    </div>
                  </div>
                  {canClaim && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onClaim(mission.id)}
                      className="bg-islamic-gold text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-sm"
                    >
                      KLAIM
                    </motion.button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Progress</span>
                    <span>{currentProgress} / {mission.target}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className={cn(
                        "h-full transition-all",
                        progressPercent === 100 ? "bg-green-500" : "bg-islamic-gold"
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-islamic-gold">
                     <Coins className="w-3 h-3" /> +{mission.rewardDinar}
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-islamic-green">
                     <Star className="w-3 h-3" /> +{mission.rewardPahala} Pahala
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-[10px] text-center text-gray-400">
          Misi akan diperbarui secara otomatis setiap hari. <br/>
          Semangat menuntut ilmu dan membangun ummah!
        </p>
      </motion.div>
    </div>
  );
};
