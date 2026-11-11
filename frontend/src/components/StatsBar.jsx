import { useState, useEffect } from 'react';
import { getStats } from '../services/api';

const StatsBar = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_materi: 0,
    avg_understanding: 0,
    algorithm: 'RF'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data);
      } catch (error) {
        console.error('Gagal memuat statistik:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="stats-bar-loading">Memuat statistik...</div>;

  return (
    <div className="stats-bar">
      <div className="stat-item animate-fade-in-up delay-100">
        <span className="stat-number">{stats.total_users}</span>
        <span className="stat-label">Pengguna Terdaftar</span>
      </div>
      <div className="stat-item animate-fade-in-up delay-200">
        <span className="stat-number">{stats.total_materi}</span>
        <span className="stat-label">Materi Edukasi</span>
      </div>
      <div className="stat-item animate-fade-in-up delay-300">
        <span className="stat-number">{stats.avg_understanding}%</span>
        <span className="stat-label">Tingkat Pemahaman ↑</span>
      </div>
      <div className="stat-item animate-fade-in-up delay-400">
        <span className="stat-number">{stats.algorithm}</span>
        <span className="stat-label">Algoritma Aktif</span>
      </div>
    </div>
  );
};

export default StatsBar;