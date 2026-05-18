import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, ArrowRight } from 'lucide-react';

interface ProfileSetupModalProps {
  onComplete: (fullName: string, studentClass: string) => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && studentClass.trim()) {
      onComplete(fullName.trim(), studentClass.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-islamic-green/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-sand rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border-8 border-white p-8"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-islamic-gold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-serif italic text-islamic-green">Buku Induk Santri</h2>
          <p className="text-gray-500 text-sm">Mohon lengkapi data diri untuk memulai peradaban</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <User className="w-3 h-3" /> Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan namamu..."
              className="w-full bg-white border-2 border-islamic-gold/10 rounded-2xl px-5 py-4 focus:border-islamic-gold outline-none transition-all text-islamic-green font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <GraduationCap className="w-3 h-3" /> Kelas
            </label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Contoh: 11 TKJ 1"
              className="w-full bg-white border-2 border-islamic-gold/10 rounded-2xl px-5 py-4 focus:border-islamic-gold outline-none transition-all text-islamic-green font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!fullName.trim() || !studentClass.trim()}
            className="w-full btn-green flex items-center justify-center gap-2 py-5 rounded-2xl text-lg disabled:opacity-50 disabled:grayscale transition-all"
          >
            Mulai Peradaban <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-[10px] text-center text-gray-400 leading-relaxed">
          Data ini digunakan untuk leaderboard per sekolah dan kelas. <br/>
          Pahala yang kamu kumpulkan akan mengharumkan nama kelasmu.
        </p>
      </motion.div>
    </div>
  );
};
