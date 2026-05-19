import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Castle, ShieldCheck, Trophy, Sparkles, User, GraduationCap, Hash, ArrowRight } from 'lucide-react';
import { loginAnonymously, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Auth: React.FC = () => {
  const [name, setName] = useState('');
  const [absentNo, setAbsentNo] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !absentNo || !className) return;

    setLoading(true);
    setErrorStatus(null);
    try {
      const user = await loginAnonymously();
      
      // Seed initial data immediately
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        displayName: name,
        fullName: name,
        studentClass: className,
        absentNo: absentNo,
        dinar: 1000,
        ilmu: 100,
        iman: 50,
        pahala: 0,
        level: 1,
        buildings: {
          masjid: 1,
          madrasah: 0,
          baitulMal: 0,
          perpustakaan: 0,
          rumahSakit: 0,
          masjidRaya: 0,
          pesantren: 0,
          menaraAdzan: 0,
          pasarSyariah: 0,
          tamanKota: 0,
          gerbangKota: 0,
        },
        hasCompletedTutorial: false,
        updatedAt: serverTimestamp()
      });

      // Add to leaderboard
      await setDoc(doc(db, 'leaderboard', user.uid), {
        userId: user.uid,
        username: name,
        fullName: name,
        studentClass: className,
        absentNo: absentNo,
        score: 0,
        updatedAt: serverTimestamp()
      });

    } catch (err: any) {
      console.error("Login failed", err);
      if (err.code === 'auth/admin-restricted-operation') {
        setErrorStatus("Firebase: Anonymous Sign-in belum diaktifkan. Silakan hubungi Admin atau aktifkan 'Anonymous' di Firebase Console (Authentication > Sign-in method).");
      } else {
        setErrorStatus("Gagal masuk. Silakan cek koneksi internet atau coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
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
        className="w-full max-w-lg bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-islamic-gold/10"
      >
        <div className="bg-islamic-green p-8 md:p-10 text-white text-center relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20"
          >
            <Castle className="w-8 h-8 md:w-10 md:h-10 text-islamic-gold" />
          </motion.div>
          <h1 className="text-3xl font-serif mb-1 italic">PAI Empire</h1>
          <p className="text-white/60 text-[10px] md:text-xs tracking-widest uppercase font-bold">Membangun Peradaban Adab</p>
          
          <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 flex gap-2 w-full justify-center px-4">
            <FeatureIcon icon={<ShieldCheck className="w-3 h-3" />} label="Edukasi" />
            <FeatureIcon icon={<Trophy className="w-3 h-3" />} label="Kompetisi" />
            <FeatureIcon icon={<Sparkles className="w-3 h-3" />} label="Strategi" />
          </div>
        </div>

        <div className="p-8 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-serif italic text-gray-800">Siap Menjadi Khalifah?</h2>
            <p className="text-gray-500 text-xs mt-1">Lengkapi data diri untuk memulai petualanganmu</p>
          </div>

          {errorStatus && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs leading-relaxed animate-pulse">
              <strong>Kesalahan Konfigurasi:</strong> {errorStatus}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User className="w-3 h-3" /> Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Ali"
                className="w-full bg-sand/50 border-2 border-islamic-gold/10 rounded-xl px-4 py-3 focus:border-islamic-gold outline-none transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Hash className="w-3 h-3" /> No Absen
                </label>
                <input
                  type="number"
                  required
                  value={absentNo}
                  onChange={(e) => setAbsentNo(e.target.value)}
                  placeholder="01"
                  className="w-full bg-sand/50 border-2 border-islamic-gold/10 rounded-xl px-4 py-3 focus:border-islamic-gold outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <GraduationCap className="w-3 h-3" /> Kelas
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="XI TKJ 1"
                  className="w-full bg-sand/50 border-2 border-islamic-gold/10 rounded-xl px-4 py-3 focus:border-islamic-gold outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-green flex items-center justify-center gap-2 py-4 rounded-xl text-md shadow-lg shadow-islamic-green/20 active:scale-95 transition-all mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Mulai Peradaban <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-[9px] text-gray-400 uppercase font-black tracking-[0.2em] text-center border-t border-gray-100 pt-6">
            Khusus Siswa PAI Kelas XI • SMAN Digital
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="bg-white px-2.5 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg border border-islamic-gold/20 flex items-center gap-1.5 md:gap-2 text-islamic-green scale-[0.85] md:scale-90 shrink-0">
    <div className="p-0.5 md:p-1 rounded-md bg-islamic-green/5">
      {icon}
    </div>
    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-wider">{label}</span>
  </div>
);
