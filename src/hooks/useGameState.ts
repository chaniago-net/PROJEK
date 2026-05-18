import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UserStats, Buildings } from '../types/game';

const INITIAL_STATS: Omit<UserStats, 'userId' | 'displayName' | 'email' | 'updatedAt'> = {
  dinar: 1000,
  ilmu: 100,
  iman: 50,
  pahala: 0,
  level: 1,
  fullName: '',
  studentClass: '',
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
  hasCompletedTutorial: false
};

export function useGameState() {
  const [user, setUser] = useState(auth.currentUser);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) {
        setStats(null);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserStats;
        setStats(data);
        // Migration for existing users
        if (data.hasCompletedTutorial === undefined) {
          updateDoc(userRef, { 
            hasCompletedTutorial: false,
            updatedAt: serverTimestamp() 
          });
        }
      } else {
        // Initialize new user
        const newStats: UserStats = {
          userId: user.uid,
          displayName: user.displayName || 'Musafir',
          email: user.email || '',
          ...INITIAL_STATS,
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, {
          ...newStats,
          updatedAt: serverTimestamp()
        });
        setStats(newStats);
        
        // Also add to leaderboard
        await setDoc(doc(db, 'leaderboard', user.uid), {
          userId: user.uid,
          username: user.displayName || 'Musafir',
          score: 0,
          updatedAt: serverTimestamp()
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateStats = useCallback(async (newStats: Partial<UserStats>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...newStats,
      updatedAt: serverTimestamp()
    });

    // Update leaderboard if pahala changed
    if (newStats.pahala !== undefined) {
      const lbRef = doc(db, 'leaderboard', user.uid);
      await setDoc(lbRef, {
        userId: user.uid,
        score: newStats.pahala,
        username: stats?.displayName || user.displayName || 'Hamba Allah',
        fullName: newStats.fullName || stats?.fullName || '',
        studentClass: newStats.studentClass || stats?.studentClass || '',
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  }, [user, stats]);

  const updateMissionProgress = useCallback(async (type: 'quiz' | 'build' | 'battle', amount: number = 1) => {
    if (!stats || !user) return;

    const missions = stats.dailyMissions || { 
      lastReset: new Date().toISOString(), 
      completed: [], 
      progress: {} 
    };

    const lastResetDate = new Date(missions.lastReset).toDateString();
    const todayDate = new Date().toDateString();
    
    let updatedProgress = { ...missions.progress };
    let updatedCompleted = [...missions.completed];
    let updatedResetDate = missions.lastReset;

    if (lastResetDate !== todayDate) {
      updatedProgress = {};
      updatedCompleted = [];
      updatedResetDate = new Date().toISOString();
    }

    const { DAILY_MISSIONS } = await import('../types/game');
    const relatedMissions = DAILY_MISSIONS.filter(m => m.type === type && !updatedCompleted.includes(m.id));
    
    if (relatedMissions.length === 0) return;

    relatedMissions.forEach(mission => {
      updatedProgress[mission.id] = (updatedProgress[mission.id] || 0) + amount;
    });

    await updateStats({
      dailyMissions: {
        lastReset: updatedResetDate,
        completed: updatedCompleted,
        progress: updatedProgress
      }
    });
  }, [stats, user, updateStats]);

  const claimMission = useCallback(async (missionId: string) => {
    if (!stats || !user) return;
    const { DAILY_MISSIONS } = await import('../types/game');
    const mission = DAILY_MISSIONS.find(m => m.id === missionId);
    if (!mission || !stats.dailyMissions) return;

    if (stats.dailyMissions.completed.includes(missionId)) return;

    await updateStats({
      dinar: stats.dinar + mission.rewardDinar,
      pahala: stats.pahala + mission.rewardPahala,
      dailyMissions: {
        ...stats.dailyMissions,
        completed: [...stats.dailyMissions.completed, missionId]
      }
    });
  }, [stats, user, updateStats]);

  return { user, stats, loading, updateStats, updateMissionProgress, claimMission };
}
