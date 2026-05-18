import React from 'react';
import { motion } from 'motion/react';
import { Castle, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export const Auth: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-8 gap-12 rotate-12 -translate-y-20">
          {Array(64).fill(0).map((_, i) => (
            <Castle key={i} className="w-24 h-24" />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-islamic-gold/10"
      >
        <div className="bg-islamic-green p-12 text-white text-center relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20"
          >
            <Castle className="w-12 h-12 text-islamic-gold" />
          </motion.div>
          <h1 className="text-4xl font-serif mb-2 italic">PAI Empire</h1>
          <p className="text-white/60 text-sm tracking-widest uppercase font-bold">Membangun Peradaban Adab</p>
          
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex gap-4">
            <FeatureIcon icon={<ShieldCheck className="w-4 h-4" />} label="Edukasi" />
            <FeatureIcon icon={<Trophy className="w-4 h-4" />} label="Kompetisi" />
            <FeatureIcon icon={<Sparkles className="w-4 h-4" />} label="Strategi" />
          </div>
        </div>

        <div className="p-12 pt-16 text-center">
          <h2 className="text-2xl font-serif mb-4 text-gray-800">Siap Menjadi Khalifah?</h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-sm mx-auto">
            Masuklah untuk mulai membangun kota peradabanmu, menjawab kuis PAI, dan bersaing di papan peringkat sekolah.
          </p>

          <button
            onClick={signInWithGoogle}
            className="group relative w-full bg-sand hover:bg-islamic-gold/10 border-2 border-islamic-gold/20 flex items-center justify-center gap-4 py-4 rounded-2xl transition-all active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 relative z-10"
            />
            <span className="font-bold text-gray-700 relative z-10 group-hover:text-islamic-gold transition-colors">
              Masuk dengan Google
            </span>
          </button>

          <p className="mt-8 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            Khusus Siswa PAI Kelas XI • SMAN Digital
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-islamic-gold/20 flex items-center gap-2 text-islamic-green scale-90">
    <div className="p-1 rounded-md bg-islamic-green/5">
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </div>
);
