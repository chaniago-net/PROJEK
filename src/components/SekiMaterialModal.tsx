import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, ChevronRight, History, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface Material {
  id: string;
  title: string;
  content: string;
  period: string;
  icon: React.ReactNode;
}

const MATERI_SKI_XI: Material[] = [
  {
    id: 'abbasiyah',
    title: 'Daulah Abbasiyah',
    period: '750 M - 1258 M',
    icon: <History className="w-5 h-5" />,
    content: 'Daulah Abbasiyah merupakan kekalifahan Islam kedua yang berpusat di Baghdad. Masa ini dikenal sebagai "The Golden Age of Islam" di mana ilmu pengetahuan, filsafat, dan budaya berkembang pesat. Tokoh terkenalnya meliputi Harun Ar-Rasyid dan Al-Ma\'mun. Baitul Hikmah menjadi pusat intelektual dunia pada masa itu.'
  },
  {
    id: 'umayyah-andalusia',
    title: 'Umayyah di Andalusia',
    period: '756 M - 1031 M',
    icon: <Sparkles className="w-5 h-5" />,
    content: 'Setelah kejatuhan Umayyah di Damaskus, Abdurrahman Ad-Dakhil mendirikan keamiran di Cordoba, Spanyol. Andalusia menjadi pusat peradaban di Eropa, memperkenalkan sistem irigasi, filsafat, dan arsitektur megah seperti Mezquita de Cordoba (Masjid Agung Cordoba).'
  },
  {
    id: 'usmani',
    title: 'Daulah Usmani (Turki)',
    period: '1299 M - 1924 M',
    icon: <Book className="w-5 h-5" />,
    content: 'Didirikan oleh Usman I, Daulah ini mencapai puncak kejayaannya pada masa Sultan Muhammad Al-Fatih (penakluk Konstantinopel) dan Sultan Sulaiman Al-Qanuni. Usmani dikenal dengan kekuatan militer (Janisari) dan sistem administrasi yang luas meliputi tiga benua.'
  },
  {
    id: 'mughal',
    title: 'Daulah Mughal (India)',
    period: '1526 M - 1857 M',
    icon: <Sparkles className="w-5 h-5" />,
    content: 'Didirikan oleh Babur, Daulah Mughal menyatukan sebagian besar anak benua India. Masa Akbar Khan dikenal dengan toleransi beragamanya, sementara masa Shah Jahan meninggalkan warisan arsitektur abadi seperti Taj Mahal. Mughal menjadi simbol peradaban Islam di Asia Selatan.'
  },
  {
    id: 'syafawi',
    title: 'Daulah Syafawi (Persia)',
    period: '1501 M - 1736 M',
    icon: <History className="w-5 h-5" />,
    content: 'Berpusat di Persia (Iran), Daulah ini didirikan oleh Ismail I. Isfahan menjadi ibukota yang megah dengan slogan "Isfahan Nisf-e-Jahan" (Isfahan setengah dunia). Syafawi dikenal dengan kemajuan seni lukis, karpet, dan filsafat Teosofi.'
  }
];

interface Props {
  onClose: () => void;
}

export const SekiMaterialModal: React.FC<Props> = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMaterial = MATERI_SKI_XI.find(m => m.id === selectedId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    >
      <div className="absolute inset-0 bg-islamic-green/40 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border-4 border-white"
      >
        {/* Header */}
        <div className="bg-islamic-green p-8 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <Book className="w-8 h-8 text-islamic-gold" />
            </div>
            <div>
              <h2 className="text-3xl font-serif italic">Materi SKI XI</h2>
              <p className="text-white/60 text-sm tracking-widest uppercase font-bold">Sejarah Kebudayaan Islam</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar - List */}
          <div className="w-full md:w-80 border-r border-gray-100 overflow-y-auto p-4 bg-gray-50/50">
            <div className="space-y-3">
              {MATERI_SKI_XI.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                    selectedId === m.id 
                      ? "bg-islamic-green text-white shadow-lg" 
                      : "bg-white hover:bg-white/80 text-gray-700 border border-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      selectedId === m.id ? "bg-white/10" : "bg-islamic-green/5 text-islamic-green"
                    )}>
                      {m.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{m.title}</h4>
                      <p className={cn(
                        "text-[10px] opacity-60 font-semibold",
                        selectedId === m.id ? "text-white" : "text-gray-400"
                      )}>{m.period}</p>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    selectedId === m.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
                  )} />
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-islamic-gold/10 rounded-3xl border border-islamic-gold/20">
              <p className="text-[10px] font-black text-islamic-gold uppercase tracking-[0.2em] mb-2 leading-none">Status Belajar</p>
              <h5 className="text-xl font-serif italic text-islamic-green mb-3">Terus Bertumbuh!</h5>
              <p className="text-[11px] text-gray-500 leading-relaxed italic">
                "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan ke surga."
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <AnimatePresence mode="wait">
              {selectedId ? (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-xl"
                >
                  <div className="flex items-center gap-2 text-islamic-gold mb-6">
                    <div className="h-px bg-islamic-gold/30 flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ringkasan Materi</span>
                    <div className="h-px bg-islamic-gold/30 flex-1" />
                  </div>

                  <h3 className="text-4xl font-serif italic text-gray-900 mb-2">{selectedMaterial?.title}</h3>
                  <p className="text-islamic-green font-bold text-xs uppercase tracking-widest mb-8">{selectedMaterial?.period}</p>

                  <div className="prose prose-sm prose-slate">
                    <p className="text-gray-600 text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-islamic-green">
                      {selectedMaterial?.content}
                    </p>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-sand/50 border border-islamic-gold/10">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Point Penting</p>
                      <ul className="text-xs text-islamic-green font-bold space-y-1">
                        <li>• Kejayaan Intelektual</li>
                        <li>• Warisan Arsitektur</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-3xl bg-sand/50 border border-islamic-gold/10">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Target Kuis</p>
                      <p className="text-xs text-islamic-green font-bold leading-tight">Pelajari untuk mendapatkan Pahala +100!</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Book className="w-12 h-12 opacity-20" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-2">Pilih Materi SKI</h3>
                  <p className="text-sm max-w-xs">Silakan pilih salah satu dinasti atau masa peradaban di sebelah kiri untuk mulai membaca.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center shrink-0">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            Kurikulum Nasional XII IPA/IPS • PAI Empire Digital
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
