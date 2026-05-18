import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { QUIZZES } from '../data/quizzes';
import { cn } from '../lib/utils';

interface QuizModalProps {
  onClose: () => void;
  onSuccess: (pahala: number, ilmu: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose, onSuccess }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuiz = QUIZZES[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < QUIZZES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onSuccess(50, 20); // Bonus for finishing quiz
    }
  };

  const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

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
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl z-10"
      >
        <div className="bg-islamic-green p-8 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Sains & Religi</span>
            <span className="text-xs font-mono">{currentIdx + 1} / {QUIZZES.length}</span>
          </div>
          
          <h2 className="text-2xl font-serif leading-tight">
            {currentQuiz.question}
          </h2>
        </div>

        <div className="p-8">
          {isFinished ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-islamic-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-islamic-green" />
              </div>
              <h3 className="text-2xl font-serif mb-2">Masya Allah!</h3>
              <p className="text-gray-500 mb-8">Anda telah menyelesaikan kuis hari ini dan mendapatkan tambahan Pahala dan Ilmu.</p>
              <button onClick={onClose} className="btn-green w-full">Kembali ke Empire</button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-8">
                {currentQuiz.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-2 transition-all flex justify-between items-center group",
                      !isAnswered && "hover:border-islamic-gold hover:bg-islamic-gold/5 border-gray-100",
                      isAnswered && idx === currentQuiz.correctAnswer && "border-green-500 bg-green-50",
                      isAnswered && selectedAnswer === idx && idx !== currentQuiz.correctAnswer && "border-red-500 bg-red-50",
                      isAnswered && idx !== currentQuiz.correctAnswer && selectedAnswer !== idx && "border-gray-100 opacity-50"
                    )}
                  >
                    <span className="font-medium">{option}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                      isAnswered && idx === currentQuiz.correctAnswer ? "bg-green-500 border-green-500" : "border-gray-300"
                    )}>
                      {isAnswered && idx === currentQuiz.correctAnswer && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={cn(
                      "p-4 rounded-2xl mb-8 flex gap-3",
                      isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    )}
                  >
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1">Penjelasan</p>
                      <p className="text-sm opacity-90">{currentQuiz.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="btn-gold w-full flex items-center justify-center gap-2 group disabled:opacity-30"
              >
                Lanjutkan
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
