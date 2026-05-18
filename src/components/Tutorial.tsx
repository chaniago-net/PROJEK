import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Info, Castle, Coins, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // id selector for highlighting
}

const STEPS: Step[] = [
  {
    title: "Ahlan wa Sahlan!",
    description: "Selamat datang di PAI Empire. Di sini kamu akan membangun kota impian yang berlandaskan nilai-nilai Islam.",
    icon: <Castle className="w-12 h-12 text-islamic-gold" />,
  },
  {
    title: "Sumber Daya Utama",
    description: "Kelola Dinar (Ekonomi), Ilmu (Pendidikan), Iman (Spiritual), dan Pahala (Sosial) untuk memajukan kotamu.",
    icon: <div className="flex gap-2">
      <Coins className="w-8 h-8 text-yellow-500" />
      <BookOpen className="w-8 h-8 text-blue-500" />
      <GraduationCap className="w-8 h-8 text-islamic-green" />
    </div>,
  },
  {
    title: "Membangun Kota",
    description: "Bangun berbagai fasiltas seperti Madrasah, Pasar Syariah, hingga Masjid Raya untuk memperluas jangkauan dakwah dan ilmu.",
    icon: <Info className="w-12 h-12 text-islamic-green" />,
  },
  {
    title: "Menambah Resource",
    description: "Kikir akan ilmu? Jangan! Ambil Kuis PAI untuk mendapatkan Pahala dan Ilmu tambahan yang berguna untuk upgrade bangunan.",
    icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
  },
  {
    title: "Kembangkan Imperium",
    description: "Mulai bangun kotamu sekarang dengan meningkatkan Masjid Al-Fatih milikmu!",
    icon: <Check className="w-12 h-12 text-islamic-gold" />,
  }
];

interface TutorialProps {
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        layoutId="tutorial-card"
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border-4 border-islamic-gold/10"
      >
        <div className="bg-islamic-green p-8 text-white relative flex flex-col items-center">
          <div className="absolute top-4 right-4 text-white/40 font-mono text-sm">
            {currentStep + 1} / {STEPS.length}
          </div>
          
          <button 
            onClick={onComplete}
            className="absolute top-4 left-4 text-white/40 hover:text-islamic-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Lewati
          </button>
          
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            {STEPS[currentStep].icon}
          </motion.div>
          
          <h2 className="text-2xl font-serif text-center font-bold text-islamic-gold">
            {STEPS[currentStep].title}
          </h2>
        </div>

        <div className="p-8">
          <motion.p 
            key={currentStep + "-desc"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-gray-600 text-center leading-relaxed"
          >
            {STEPS[currentStep].description}
          </motion.p>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={currentStep === 0}
              className={cn(
                "p-3 rounded-full transition-colors",
                currentStep === 0 ? "text-gray-200" : "text-islamic-green hover:bg-islamic-green/10"
              )}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === currentStep ? "bg-islamic-gold w-6" : "bg-gray-200"
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="bg-islamic-gold text-white p-3 rounded-full hover:bg-amber-500 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              {currentStep === STEPS.length - 1 ? (
                <Check className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
