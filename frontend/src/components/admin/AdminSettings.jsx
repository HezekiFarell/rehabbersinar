import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, 
  User, 
  Shield, 
  Lock, 
  Server, 
  CheckCircle 
} from 'lucide-react'

const AdminSettings = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar dari akun administrator?')) {
      logout()
      navigate('/')
    }
  }

  return (
    <div className="admin-settings-container">
      <h2>Pengaturan Admin</h2>
      <p className="admin-content-subtitle">Kelola informasi kredensial akun administrator dan status keamanan platform.</p>
      
      <div className="settings-grid">
        {/* Kolom Kiri: Kartu Profil Admin */}
        <div className="settings-card profile-card-premium">
          <div className="profile-banner-glow"></div>
          <div className="profile-header-avatar">
            <div className="avatar-wrapper-glow">
              <User size={32} className="avatar-svg-large" />
            </div>
            <div className="verified-shield">
              <Shield size={14} className="shield-check-icon" />
            </div>
          </div>

          <div className="profile-details">
            <h3>{user?.nama}</h3>
            <span className="badge-admin">SUPER ADMIN</span>

            <div className="profile-fields">
              <div className="profile-field">
                <span className="field-label">ID Administrator</span>
                <span className="field-value">{user?.id}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Kelompok Klasifikasi</span>
                <span className="field-value">{user?.group || 'Umum'}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Level Akses</span>
                <span className="field-value">Full Write/Read Access</span>
              </div>
            </div>

            <button className="btn-danger-modern" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Status Sistem & Keamanan */}
        <div className="settings-card system-card-premium">
          <h3>Integritas & Status Platform</h3>
          <p className="system-subtitle">Status operasional modul-modul sistem inti saat ini.</p>

          <div className="system-status-list">
            <div className="system-status-item">
              <div className="status-icon-box success-glow">
                <CheckCircle size={18} />
              </div>
              <div className="status-text-details">
                <span className="status-title">Status Platform</span>
                <span className="status-desc">Operasional & Aktif</span>
              </div>
              <span className="status-badge active-pill">Online</span>
            </div>

            <div className="system-status-item">
              <div className="status-icon-box security-glow">
                <Lock size={18} />
              </div>
              <div className="status-text-details">
                <span className="status-title">Proteksi Sesi</span>
                <span className="status-desc">Enkripsi Token Terproteksi</span>
              </div>
              <span className="status-badge secure-pill">Secure</span>
            </div>

            <div className="system-status-item">
              <div className="status-icon-box server-glow">
                <Server size={18} />
              </div>
              <div className="status-text-details">
                <span className="status-title">Lokasi Server</span>
                <span className="status-desc">Vercel Production Node</span>
              </div>
              <span className="status-badge region-pill">ID-JKT</span>
            </div>
          </div>

          <div className="system-footer-note">
            <Shield size={14} className="note-icon" />
            <span>Sistem dilindungi enkripsi JWT dengan kebijakan sesi administrator.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings