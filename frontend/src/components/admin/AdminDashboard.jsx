import { useState, useEffect } from 'react'
import { getAdminStats } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Award, 
  Layers, 
  Activity, 
  Sparkles 
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats()
        setStats(res.data)
      } catch (error) {
        showToast('Gagal memuat statistik')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [showToast])

  if (loading) return <div className="admin-loading">Memuat statistik...</div>
  if (!stats) return <div className="admin-error">Gagal memuat data</div>

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome-banner">
        <div className="welcome-banner-content">
          <div className="welcome-banner-icon">
            <Sparkles size={24} className="sparkle-glow" />
          </div>
          <div>
            <h3>Selamat Datang Kembali, Administrator!</h3>
            <p>Platform Rehabilitasi Bersinar berjalan optimal. Berikut ringkasan performa dan data terkini hari ini.</p>
          </div>
        </div>
        <div className="welcome-banner-date">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <h2>Dashboard Admin</h2>
      <p className="admin-content-subtitle">Statistik ringkas aktivitas peserta dan hasil penilaian platform.</p>

      <div className="stats-grid">
        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(59, 130, 246, 0.15)', '--card-icon-color': '#3b82f6' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Users size={20} />
            </div>
            <span className="stat-label">Total Pengguna</span>
          </div>
          <span className="stat-value">{stats.total_users}</span>
        </div>

        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(16, 185, 129, 0.15)', '--card-icon-color': '#10b981' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <BookOpen size={20} />
            </div>
            <span className="stat-label">Total Materi</span>
          </div>
          <span className="stat-value">{stats.total_materi}</span>
        </div>

        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(139, 92, 246, 0.15)', '--card-icon-color': '#8b5cf6' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <MessageSquare size={20} />
            </div>
            <span className="stat-label">Total Feedback</span>
          </div>
          <span className="stat-value">{stats.total_feedback}</span>
        </div>

        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(245, 158, 11, 0.15)', '--card-icon-color': '#f59e0b' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <GraduationCap size={20} />
            </div>
            <span className="stat-label">Rata Pretest</span>
          </div>
          <span className="stat-value">{stats.avg_pretest}</span>
        </div>

        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(99, 102, 241, 0.15)', '--card-icon-color': '#6366f1' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Award size={20} />
            </div>
            <span className="stat-label">Rata Posttest</span>
          </div>
          <span className="stat-value">{stats.avg_posttest}</span>
        </div>

        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(244, 63, 94, 0.15)', '--card-icon-color': '#f43f5e' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Layers size={20} />
            </div>
            <span className="stat-label">Kelompok A</span>
          </div>
          <span className="stat-value">{stats.group_a}</span>
        </div>

        <div className="stat-card" style={{ '--card-icon-bg': 'rgba(6, 182, 212, 0.15)', '--card-icon-color': '#06b6d4' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Activity size={20} />
            </div>
            <span className="stat-label">Kelompok B</span>
          </div>
          <span className="stat-value">{stats.group_b}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard