import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Medal, User } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { LeaderboardEntry } from '../types/game';
import { cn } from '../lib/utils';

interface LeaderboardModalProps {
  onClose: () => void;
  currentUserId?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, currentUserId }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl flex flex-col max-h-[80vh] z-10"
      >
        <div className="bg-islamic-gold p-6 text-white shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-serif leading-none">Papan Peringkat</h2>
              <p className="text-xs opacity-60 mt-1 uppercase tracking-widest font-bold">Terbaik Minggu Ini</p>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center text-gray-400">Memuat peringkat...</div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, idx) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all",
                    entry.userId === currentUserId ? "bg-islamic-gold/10 border border-islamic-gold/20" : "bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      {idx === 0 ? <Medal className="w-6 h-6 text-yellow-500 mx-auto" /> :
                       idx === 1 ? <Medal className="w-6 h-6 text-gray-400 mx-auto" /> :
                       idx === 2 ? <Medal className="w-6 h-6 text-amber-600 mx-auto" /> :
                       <span className="text-sm font-bold text-gray-400">{idx + 1}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{entry.fullName || entry.username}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                          {entry.studentClass || 'Ksatria Empire'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-islamic-green leading-none">{entry.score.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Pahala</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 shrink-0 text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">
          Diperbarui secara realtime
        </div>
      </motion.div>
    </motion.div>
  );
};
