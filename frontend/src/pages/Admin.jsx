import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminUsers from '../components/admin/AdminUsers'
import AdminMaterials from '../components/admin/AdminMaterials'
import AdminFeedbacks from '../components/admin/AdminFeedbacks'
import AdminSettings from '../components/admin/AdminSettings'
import AdminComparison from '../components/admin/AdminComparison'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Settings as SettingsIcon,
  Globe,
  Shield,
  User,
  GitCompareArrows
} from 'lucide-react'
import './Admin.css'

const Admin = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/assessment')
      showToast('Silakan login terlebih dahulu')
    } else if (!user.is_admin) {
      navigate('/dashboard')
      showToast('Anda tidak memiliki akses ke halaman admin')
    }
  }, [user, loading, navigate, showToast])

  if (loading) return <div className="admin-container"><div style={{ padding: '2rem', color: 'white' }}>Memuat admin...</div></div>
  if (!user || !user.is_admin) return null

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <Shield className="logo-svg" size={24} />
            <span>Admin Bersinar</span>
          </div>
        </div>

        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </li>
          <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={18} />
            <span>Pengguna</span>
          </li>
          <li className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>
            <BookOpen size={18} />
            <span>Materi</span>
          </li>
          <li className={activeTab === 'feedbacks' ? 'active' : ''} onClick={() => setActiveTab('feedbacks')}>
            <MessageSquare size={18} />
            <span>Feedback</span>
          </li>
          {/* ============ TAB BARU ============ */}
          <li className={activeTab === 'comparison' ? 'active' : ''} onClick={() => setActiveTab('comparison')}>
            <GitCompareArrows size={18} />
            <span>Perbandingan</span>
          </li>
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <SettingsIcon size={18} />
            <span>Settings</span>
          </li>
          <li className="back-to-home" onClick={() => navigate('/')}>
            <Globe size={18} />
            <span>Lihat Website</span>
          </li>
        </ul>

        <div className="admin-sidebar-footer">
          <div className="admin-profile-card">
            <div className="admin-avatar">
              <User size={18} className="avatar-svg" />
            </div>
            <div className="admin-profile-info">
              <span className="admin-name">{user?.nama}</span>
              <span className="admin-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'materials' && <AdminMaterials />}
        {activeTab === 'feedbacks' && <AdminFeedbacks />}
        {activeTab === 'comparison' && <AdminComparison />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  )
}

export default Admin