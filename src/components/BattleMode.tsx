import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Heart, Shield, Zap, Target, Scroll, Trophy, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { QUIZZES } from '../data/quizzes';

interface BattleModeProps {
  onWin: (pahala: number, dinar: number) => void;
  onLose: () => void;
  userStats: {
    level: number;
    pahala: number;
  };
}

export const BattleMode: React.FC<BattleModeProps> = ({ onWin, onLose, userStats }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>(['Persiapkan dirimu, wahai Penuntut Ilmu!']);

  const currentQuiz = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];

  const startBattle = () => {
    setGameState('playing');
    setPlayerHp(100);
    setEnemyHp(100);
    setBattleLog(['Pertarungan dimulai! Lawanlah keraguan dengan ilmu.']);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered || gameState !== 'playing') return;
    
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuiz.correctAnswer;

    setTimeout(() => {
      if (isCorrect) {
        const damage = 40 + userStats.level * 5;
        setEnemyHp(prev => Math.max(0, prev - damage));
        setBattleLog(prev => [`Masya Allah! Jawaban benar. Memberikan ${damage} damage!`, ...prev.slice(0, 3)]);
        
        if (enemyHp - damage <= 0) {
          setGameState('won');
          onWin(500, 250);
        }
      } else {
        const damage = 10;
        setPlayerHp(prev => Math.max(0, prev - damage));
        setBattleLog(prev => [`Astagfirullah! Jawaban salah. Terkena ${damage} damage!`, ...prev.slice(0, 3)]);
        
        if (playerHp - damage <= 0) {
          setGameState('lost');
          onLose();
        }
      }
      
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCurrentQuizIdx(prev => (prev + 1) % QUIZZES.length);
      }, 1500);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {gameState === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[3rem] p-12 text-center shadow-xl border-8 border-white"
          >
            <div className="w-24 h-24 bg-islamic-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Swords className="w-12 h-12 text-islamic-gold" />
            </div>
            <h2 className="text-4xl font-serif italic text-islamic-green mb-4">Ujian Ilmu & Iman</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Hadapi tantangan pengetahuan untuk memperkuat peradabanmu. <br/>
              Kalahkan "Nafsu & Keraguan" dengan menjawab benar.
            </p>
            <button onClick={startBattle} className="btn-green px-12 py-5 rounded-2xl text-xl">
              Mulai Duel
            </button>
          </motion.div>
        ) : gameState === 'playing' ? (
          <motion.div
            key="playing"
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Battle Arena */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Player side */}
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border-4 border-islamic-green/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif italic text-xl text-islamic-green">Pahlawan Ilmu</h3>
                  <span className="text-xs font-bold text-gray-400">LEVEL {userStats.level}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${playerHp}%` }}
                    className="h-full bg-green-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Heart className="w-3 h-3 text-red-500" /> {playerHp} / 100 HP
                </div>
              </div>

              {/* Enemy side */}
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border-4 border-red-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif italic text-xl text-red-700">Nafsu & Keraguan</h3>
                  <span className="text-xs font-bold text-gray-400">BOSS</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${enemyHp}%` }}
                    className="h-full bg-red-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Zap className="w-3 h-3 text-yellow-500" /> {enemyHp} / 100 HP
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-islamic-green/5 rounded-2xl p-4 border border-islamic-green/10 h-24 overflow-hidden">
              {battleLog.map((log, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "text-xs mb-1",
                    i === 0 ? "text-islamic-green font-bold" : "text-gray-400"
                  )}
                >
                  {log}
                </motion.p>
              ))}
            </div>

            {/* Quiz Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border-b-8 border-islamic-gold/20">
              <h2 className="text-xl font-serif text-center mb-8 text-islamic-green">
                {currentQuiz.question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuiz.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      !isAnswered && "hover:border-islamic-gold hover:bg-islamic-gold/5 border-gray-100",
                      isAnswered && idx === currentQuiz.correctAnswer && "border-green-500 bg-green-50 text-green-700",
                      isAnswered && selectedAnswer === idx && idx !== currentQuiz.correctAnswer && "border-red-500 bg-red-50 text-red-700",
                      isAnswered && idx !== currentQuiz.correctAnswer && selectedAnswer !== idx && "border-gray-100 opacity-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : gameState === 'won' ? (
          <motion.div
            key="won"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 text-center shadow-xl border-8 border-islamic-green/20"
          >
            <Trophy className="w-20 h-20 text-islamic-gold mx-auto mb-6" />
            <h2 className="text-4xl font-serif italic text-islamic-green mb-4">Kemenangan Gemilang!</h2>
            <p className="text-gray-500 mb-8">
              Kegelapan berhasil dipadamkan dengan cahaya ilmu. <br/>
              Hadiah: <span className="font-bold text-islamic-gold">+100 Pahala, +50 Dinar</span>
            </p>
            <button onClick={() => setGameState('intro')} className="btn-green px-12 py-5 rounded-2xl">
              Kembali
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="lost"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 text-center shadow-xl border-8 border-red-100"
          >
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-4xl font-serif italic text-red-700 mb-4">Kekalahan...</h2>
            <p className="text-gray-500 mb-8">
              Jangan menyerah! Pelajari kembali buku-buku agamamu dan coba lagi nanti.
            </p>
            <button onClick={() => setGameState('intro')} className="btn-green px-12 py-5 rounded-2xl">
              Coba Lagi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
