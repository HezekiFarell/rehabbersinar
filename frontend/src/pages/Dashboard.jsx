import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import ContentCard from '../components/ContentCard'
import ContentDetailModal from '../components/ContentDetailModal'
import PosttestPromptModal from '../components/PosttestPromptModal'
import {
  getContents,
  getRecommendations,
  getUserProgress,
  getUserAchievements,
  submitPosttest,
  getUserWeeklyActivity,
  updateUserProfile,
  submitFeedback
} from '../services/api'
import questionsData from '../data/questions'
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Activity,
  Trophy,
  ClipboardList,
  Settings as SettingsIcon,
  Target,
  Bot,
  Brain,
  Clock,
  Flame,
  BarChart2,
  CheckCircle,
  Lock,
  Star,
  LogOut,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  ClipboardCheck
} from 'lucide-react'

// ==================== SVG ICON HELPER ====================
const Icon = ({ name }) => {
  const icons = {
    overview: <LayoutDashboard size={20} />,
    recommendations: <Sparkles size={20} />,
    all: <BookOpen size={20} />,
    progress: <Activity size={20} />,
    achievements: <Trophy size={20} />,
    posttest: <ClipboardList size={20} />,
    settings: <SettingsIcon size={20} />
  };
  return icons[name] || null;
};

// ==================== SIDEBAR ====================
const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const isGroupA = user?.group === 'A'
  return (
    <aside className="sidebar">
      <div className="user-profile">
        <div className="avatar" id="dashboardAvatar">
          {user?.nama?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="user-info-text">
          <div className="user-name" id="dashboardName">{user?.nama || 'Andi Wijaya'}</div>
          <div className="user-group" id="dashboardGroup">
            {isGroupA ? 'Grup A - Personal' : 'Grup B - Bebas'}
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li>
          <a href="#" className={activeTab === 'overview' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('overview') }}>
            <span className="sidebar-icon"><Icon name="overview" /></span>
            <span className="sidebar-label">Overview</span>
          </a>
        </li>
        {isGroupA ? (
          <li>
            <a href="#" className={activeTab === 'recommendations' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('recommendations') }}>
              <span className="sidebar-icon"><Icon name="recommendations" /></span>
              <span className="sidebar-label">Rekomendasi</span>
            </a>
          </li>
        ) : (
          <li>
            <a href="#" className={activeTab === 'all' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('all') }}>
              <span className="sidebar-icon"><Icon name="all" /></span>
              <span className="sidebar-label">Materi</span>
            </a>
          </li>
        )}
        <li>
          <a href="#" className={activeTab === 'progress' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('progress') }}>
            <span className="sidebar-icon"><Icon name="progress" /></span>
            <span className="sidebar-label">Progress</span>
          </a>
        </li>
        <li>
          <a href="#" className={activeTab === 'achievements' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('achievements') }}>
            <span className="sidebar-icon"><Icon name="achievements" /></span>
            <span className="sidebar-label">Achievements</span>
          </a>
        </li>
        <li>
          <a href="#" className={activeTab === 'posttest' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('posttest') }}>
            <span className="sidebar-icon"><Icon name="posttest" /></span>
            <span className="sidebar-label">Post-Test</span>
          </a>
        </li>
        <li>
          <a href="#" className={activeTab === 'settings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('settings') }}>
            <span className="sidebar-icon"><Icon name="settings" /></span>
            <span className="sidebar-label">Settings</span>
          </a>
        </li>
      </ul>
    </aside>
  )
}

// ==================== LEVEL BADGE HELPER ====================
const levelColor = (level) => {
  if (level === 'Sangat Dibutuhkan') return '#EF4444'
  if (level === 'Dibutuhkan') return '#F59E0B'
  return '#6B7280'
}

// ==================== DASHBOARD A - OVERVIEW ====================
const DashboardAOverview = ({ recommended, other, onCardClick }) => {
  const totalRecommended = recommended.length + other.length

  return (
    <div className="dashboard-section">

      {/* ================= HEADER ================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eef6ff 0%, #f8fbff 100%)',
          border: '1px solid #dbeafe',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '999px',
                background: '#ffffff',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                border: '1px solid #dbeafe'
              }}
            >
              <Sparkles size={14} />
              Materi untuk Anda
            </div>

            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                margin: 0,
                fontSize: '1.5rem'
              }}
            >
              <BookOpen size={25} style={{ color: 'var(--primary)' }} />
              Rekomendasi Materi Belajar
            </h2>

            <p
              style={{
                margin: '0.6rem 0 0',
                color: '#64748b',
                lineHeight: 1.6,
                maxWidth: '720px'
              }}
            >
              Berikut adalah materi edukasi yang direkomendasikan
              berdasarkan hasil assessment dan profil belajar Anda.
              Materi diurutkan dari yang paling sesuai untuk dipelajari.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              minWidth: '150px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--primary)'
              }}
            >
              {totalRecommended}
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: '#64748b'
              }}
            >
              Materi direkomendasikan
            </div>
          </div>
        </div>
      </div>


      {/* ================= INFO REKOMENDASI ================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1rem 1.1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            minWidth: '34px',
            borderRadius: '10px',
            background: '#e0edff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}
        >
          <Brain size={18} />
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              marginBottom: '3px',
              color: '#1e293b'
            }}
          >
            Bagaimana materi ini dipilih?
          </strong>

          <span
            style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}
          >
            Sistem menganalisis data assessment Anda untuk menentukan
            materi yang paling sesuai. Anda dapat langsung memilih
            materi di bawah untuk mulai belajar.
          </span>
        </div>
      </div>


      {/* ================= MATERI UTAMA ================= */}
      <div className="dashboard-section-sub">

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.3rem'
              }}
            >
              <Target
                size={20}
                style={{ color: 'var(--primary)' }}
              />

              Materi yang Disarankan untuk Anda
            </h3>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '0.88rem'
              }}
            >
              Mulai dari materi berikut untuk mendapatkan pembelajaran
              yang sesuai dengan hasil assessment Anda.
            </p>
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              color: '#64748b',
              background: '#f1f5f9',
              padding: '7px 12px',
              borderRadius: '999px'
            }}
          >
            {recommended.length} materi utama
          </div>
        </div>


        <div className="content-grid dashboard-grid">
          {recommended.map((content, index) => (
            <div
              key={content.id}
              className="recommendation-item"
              style={{
                position: 'relative'
              }}
            >

              {/* NOMOR URUT */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 2,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                }}
              >
                {index + 1}
              </div>

              <ContentCard
                content={content}
                showConfidence={false}
                onClick={() => onCardClick(content)}
              />

              {/* LABEL */}
              <div
                style={{
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  color: '#64748b'
                }}
              >
                <CheckCircle
                  size={15}
                  style={{ color: '#10B981' }}
                />

                Direkomendasikan untuk Anda
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= MATERI LAINNYA ================= */}
      {other.length > 0 && (
        <div
          className="dashboard-section-sub"
          style={{
            marginTop: '2rem'
          }}
        >

          <div
            style={{
              marginBottom: '1rem'
            }}
          >
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.3rem'
              }}
            >
              <BookOpen
                size={20}
                style={{ color: 'var(--primary)' }}
              />

              Materi Rekomendasi Lainnya
            </h3>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '0.88rem'
              }}
            >
              Materi tambahan yang juga dapat membantu memperluas
              pengetahuan Anda.
            </p>
          </div>


          <div className="content-grid dashboard-grid">
            {other.map((item) => (
              <div
                key={item.id}
                className="recommendation-item"
              >

                <ContentCard
                  content={item}
                  showConfidence={false}
                  onClick={() => onCardClick(item)}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '0.65rem',
                    fontSize: '0.82rem',
                    color: '#64748b'
                  }}
                >
                  <Sparkles
                    size={14}
                    style={{ color: 'var(--primary)' }}
                  />

                  Materi tambahan yang direkomendasikan
                </div>

              </div>
            ))}
          </div>

        </div>
      )}


      {/* ================= FOOTNOTE ================= */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.85rem 1rem',
          borderTop: '1px solid #e5e7eb',
          color: '#94a3b8',
          fontSize: '0.78rem',
          textAlign: 'center'
        }}
      >
        Rekomendasi materi dihasilkan oleh sistem berdasarkan
        data assessment yang Anda berikan.
      </div>

    </div>
  )
}
// ==================== DASHBOARD B - OVERVIEW ====================
const DashboardBOverview = ({ contents, onCardClick }) => {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} style={{ color: 'var(--primary)' }} /> Semua Materi Edukasi
          </h2>
          <p>Akses bebas ke seluruh konten edukasi. Pilih materi sesuai kebutuhanmu.</p>
        </div>
        <div className="dashboard-section-chip">
          <span className="chip-dot" /> Mode Kelompok B • Akses bebas
        </div>
      </div>

      <div className="content-grid dashboard-grid">
        {contents.map(content => (
          <ContentCard
            key={content.id}
            content={content}
            onClick={() => onCardClick(content)}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== REKOMENDASI PAGE ====================
const RecommendationsPage = ({ recommendations, onCardClick }) => {
  return (
    <div className="dashboard-section recommendations-page">
      <div className="dashboard-section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={24} style={{ color: 'var(--primary)' }} /> Semua Rekomendasi (Random Forest)
          </h2>
          <p>
            Daftar lengkap materi yang disarankan untukmu, sudah diurutkan dari yang paling relevan.
            Lihat juga alasan dan confidence score di setiap kartu.
          </p>
        </div>
      </div>

      <div className="content-grid dashboard-grid">
        {recommendations.map(item => (
          <div key={item.materi.id} className="recommendation-item">
            <ContentCard
              content={item.materi}
              showConfidence={true}
              onClick={() => onCardClick(item.materi)}
            />
            <div
              className="recommendation-reason"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '0.5rem' }}
            >
              <Brain size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.85rem' }}>
                <div>
                  <strong>{item.category}</strong>
                  {' • '}
                  <span style={{ color: levelColor(item.level), fontWeight: 600 }}>
                    {item.level}
                  </span>
                  {/* {' • '} */}
                  {((item.confidence || 0) * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 2 }}>
                  {item.reason}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== PROGRESS ====================
const Progress = ({ user, refreshKey }) => {
  const { showToast } = useToast()
  const [progress, setProgress] = useState(null)
  const [weekData, setWeekData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, activityRes] = await Promise.all([
          getUserProgress(),
          getUserWeeklyActivity()
        ])
        setProgress(progressRes.data)
        setWeekData(activityRes.data)
      } catch (error) {
        showToast('Gagal memuat data progress')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showToast, refreshKey])

  if (loading) return <div className="progress-modern"><div className="stats-bar-loading">Memuat progress...</div></div>
  if (!progress) return <div className="progress-modern"><div className="stats-bar-loading">Gagal memuat data.</div></div>

  const { total_materi, completed_count, total_duration, streak, consistency, pretest_score, posttest_score } = progress
  const percentage = total_materi > 0 ? Math.round((completed_count / total_materi) * 100) : 0
  const totalMinutes = Math.round(total_duration / 60)

  const statCards = [
    { icon: Clock, num: totalMinutes, label: 'Menit Belajar', color: '#3B82F6' },
    { icon: Flame, num: streak, label: 'Hari Streak', color: '#EF4444' },
    { icon: BarChart2, num: `${consistency}%`, label: 'Konsistensi', color: '#3B82F6' },
    { icon: Trophy, num: posttest_score || '-', label: 'Skor Akhir', color: '#F59E0B' }
  ];

  return (
    <div className="progress-universal">
      <div className="progress-header-flex">
        <h2 className="progress-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={24} style={{ color: 'var(--primary)' }} /> Log aktivitas
        </h2>
        <div className="user-badge-premium">Grup {user?.group || 'B'}</div>
      </div>

      <div className="progress-top-grid">
        <div className="main-stats-card">
          <div className="circular-container">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle-fill" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="percentage-display">
              <span className="pct-num">{percentage}%</span>
              <span className="pct-label">Progres</span>
            </div>
          </div>
          <div className="stats-info-text">
            <h3>Halo, {user?.nama?.split(' ')[0]}!</h3>
            <p>Modul Selesai: <strong>{completed_count}/{total_materi}</strong></p>
            <div className="test-badge-container">
              <span className="test-pill">Pre: {pretest_score}</span>
              <span className="test-pill">Post: {posttest_score || '-'}</span>
            </div>
          </div>
        </div>

        <div className="stats-cards-scroll-container">
          <div className="stats-cards-track">
            {statCards.map((card, i) => {
              const IconComponent = card.icon;
              return (
                <div key={i} className="interactive-stat-card" style={{ "--card-accent": card.color }}>
                  <div className="stat-card-icon" style={{ color: card.color }}>
                    <IconComponent size={24} />
                  </div>
                  <div className="stat-card-data">
                    <span className="data-val">{card.num}</span>
                    <span className="data-lbl">{card.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="activity-chart-card">
        <div className="activity-header">
          <h3>Aktivitas Minggu Ini</h3>
          <span className="total-time-tag">{totalMinutes} Menit</span>
        </div>
        <div className="chart-bars-flex">
          {weekData.map((item) => {
            const maxVal = Math.max(...weekData.map(d => d.minutes), 1);
            const barHeight = (item.minutes / maxVal) * 100;
            const todayDayName = new Date().toLocaleDateString('id-ID', { weekday: 'short' });
            const isToday = item.day === todayDayName;
            return (
              <div key={item.day} className={`bar-item ${isToday ? 'active-today' : ''}`}>
                <div className="bar-column">
                  <div className="bar-fill-animated" style={{ height: `${barHeight}%` }}>
                    {item.minutes > 0 && <span className="bar-tooltip">{item.minutes}m</span>}
                  </div>
                </div>
                <span className="bar-name">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

// ==================== ACHIEVEMENTS ====================
const Achievements = ({ user }) => {
  const { showToast } = useToast()
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  const renderAchievementIcon = (iconStr) => {
    const styles = { verticalAlign: 'middle', width: '40px', height: '40px' };
    switch (iconStr) {
      case '🏆':
        return <Trophy size={40} style={{ ...styles, color: '#F59E0B' }} />;
      case '🔥':
        return <Flame size={40} style={{ ...styles, color: '#EF4444' }} />;
      case '📚':
        return <BookOpen size={40} style={{ ...styles, color: '#10B981' }} />;
      case '🎯':
        return <Target size={40} style={{ ...styles, color: '#3B82F6' }} />;
      case '🎓':
        return <Award size={40} style={{ ...styles, color: '#8B5CF6' }} />;
      case '⚡':
        return <Zap size={40} style={{ ...styles, color: '#FBBF24' }} />;
      default:
        return <Award size={40} style={{ ...styles, color: 'var(--primary)' }} />;
    }
  };

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await getUserAchievements()
        setAchievements(res.data)
      } catch (error) {
        showToast('Gagal memuat achievements')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [showToast])

  if (loading) {
    return (
      <div className="achievements-modern">
        <div className="stats-bar-loading">Memuat daftar pencapaian kamu...</div>
      </div>
    )
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="achievements-modern">
      <div className="achievements-header-modern">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={28} style={{ color: 'var(--primary)' }} /> Achievements
        </h2>
        <div className="achievement-counter">
          <span className="counter-num">{unlockedCount}</span>/<span>{achievements.length}</span> Terbuka
        </div>
      </div>

      <div className="achievement-grid-modern">
        {achievements.map(ach => (
          <div key={ach.name} className={`achievement-card-modern ${ach.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon-modern">{renderAchievementIcon(ach.icon)}</div>
            <div className="achievement-info">
              <h4>{ach.name}</h4>
              <p>{ach.desc}</p>
              {ach.unlocked ? (
                <span className="unlocked-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> Terbuka
                </span>
              ) : (
                <div className="achievement-progress-modern">
                  <div className="progress-bar-ach">
                    <div style={{ width: `${(ach.progress / ach.total) * 100}%` }}></div>
                  </div>
                  <span>{ach.progress}/{ach.total}</span>
                </div>
              )}
            </div>
            {!ach.unlocked && (
              <div className="lock-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', top: '1rem', right: '1rem', position: 'absolute' }}>
                <Lock size={18} style={{ color: '#cbd5e1' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== POST-TEST ====================
const PostTest = ({ onComplete, user }) => {
  const { showToast } = useToast()
  const [answers, setAnswers] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPosttest = async () => {
      try {
        const res = await getUserProgress()
        if (res.data.posttest_score !== null) {
          setAlreadySubmitted(true)
        }
      } catch (error) {
        console.error('Gagal mengecek post-test', error)
      } finally {
        setLoading(false)
      }
    }
    checkPosttest()
  }, [])

  const questionsPerPage = 5
  const totalPages = Math.ceil(questionsData.length / questionsPerPage)
  const startIdx = currentPage * questionsPerPage
  const endIdx = startIdx + questionsPerPage
  const currentQuestions = questionsData.slice(startIdx, endIdx)

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const isCurrentPageComplete = currentQuestions.every(q => answers[q.id] !== undefined)

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    let score = 0
    questionsData.forEach(q => {
      if (answers[q.id] === 'correct') score++
    })

    try {
      onComplete(score, answers)
      setSubmitted(true)
      showToast(`Post-test selesai! Skor: ${score}/${questionsData.length}`)
    } catch (error) {
      showToast('Gagal menyimpan post-test')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="assessment-container posttest-modern">
        <div className="stats-bar-loading">Memuat status post-test...</div>
      </div>
    )
  }

  if (alreadySubmitted) {
    return (
      <div className="assessment-container posttest-summary">
        <h2><ClipboardList size={22} className="inline-icon" /> Post-Test Sudah Dikerjakan</h2>
        <p>Anda telah menyelesaikan post-test. Terima kasih.</p>
        <p>Skor Anda dapat dilihat di halaman Progress.</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="assessment-container posttest-summary">
        <h2><ClipboardList size={22} className="inline-icon" /> Post-Test Selesai</h2>
        <p>Terima kasih telah mengerjakan post-test.</p>
        <p>Skor Anda: {Object.values(answers).filter(v => v === 'correct').length}/{questionsData.length}</p>
      </div>
    )
  }

  return (
    <div className="assessment-container posttest-modern">
      <h2><ClipboardList size={22} className="inline-icon" /> Post-Test Pengetahuan</h2>
      <p>Jawablah pertanyaan berikut untuk mengukur pemahaman Anda setelah belajar.</p>

      <div className="posttest-header">
        <span>Halaman {currentPage + 1} dari {totalPages}</span>
        <div className="posttest-dots">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`dot ${idx === currentPage ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {currentQuestions.map((q, index) => (
        <div key={q.id} className="form-group posttest-question">
          <label>{startIdx + index + 1}. {q.text}</label>
          <select
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          >
            <option value="">Pilih jawaban...</option>
            {q.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}

      <div className="posttest-actions">
        {currentPage > 0 && (
          <button className="btn btn-outline" onClick={handlePrev} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Sebelumnya
          </button>
        )}
        {currentPage < totalPages - 1 ? (
          <button
            className="btn btn-white"
            onClick={handleNext}
            disabled={!isCurrentPageComplete}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Selanjutnya <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="btn btn-white"
            onClick={handleSubmit}
            disabled={!isCurrentPageComplete}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Selesai & Kirim <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

// ==================== SETTINGS ====================
const Settings = ({ user, onLogout }) => {
  const { showToast } = useToast()
  const [nama, setNama] = useState(user?.nama || '')
  const [usia, setUsia] = useState(user?.usia || '')
  const [gender, setGender] = useState(user?.gender || '')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSaveProfile = async () => {
    if (!nama || !usia || !gender) {
      showToast('Semua field profil harus diisi')
      return
    }
    setLoading(true)
    try {
      await updateUserProfile({ nama, usia: parseInt(usia), gender })
      showToast('Profil berhasil diperbarui')
    } catch (error) {
      showToast('Gagal memperbarui profil')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (rating < 1 || rating > 5) {
      showToast('Rating harus antara 1-5')
      return
    }
    setLoading(true)
    try {
      await submitFeedback({ rating, comment })
      showToast('Terima kasih atas feedback Anda!')
      setComment('')
      setRating(5)
    } catch (error) {
      showToast('Gagal mengirim feedback')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-modern">
      <h2><SettingsIcon size={22} className="inline-icon" /> Pengaturan Akun</h2>

      <div className="settings-section-modern">
        <h3>Feedback & Penilaian</h3>
        <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>
          Bantu kami meningkatkan platform dengan memberikan penilaian dan komentar Anda.
        </p>
        <div className="settings-form">
          <div className="form-group-modern">
            <label>Rating (1-5)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => !loading && setRating(star)}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: star <= rating ? '#F59E0B' : '#cbd5e1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}
                >
                  <Star
                    size={28}
                    fill={star <= rating ? '#F59E0B' : 'none'}
                    stroke={star <= rating ? '#F59E0B' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="form-group-modern">
            <label>Komentar / Saran</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis komentar Anda di sini..."
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #e5e7eb',
                borderRadius: '18px',
                resize: 'vertical'
              }}
            />
          </div>
          <button
            className="btn-save-modern"
            onClick={handleSubmitFeedback}
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Feedback'}
          </button>
        </div>
      </div>

      <div className="settings-section-modern danger">
        <h3>Logout</h3>
        <button
          className="btn-danger-modern"
          onClick={onLogout}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
        >
          <LogOut size={18} /> Keluar dari Akun
        </button>
      </div>
    </div>
  )
}

// ==================== DASHBOARD UTAMA ====================
const Dashboard = () => {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [recommended, setRecommended] = useState([])
  const [otherRecommended, setOtherRecommended] = useState([])   // ← BARU
  const [recommendations, setRecommendations] = useState([])
  const [allContents, setAllContents] = useState([])
  const [selectedContent, setSelectedContent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showPosttestPrompt, setShowPosttestPrompt] = useState(false)

  const [refreshProgressKey, setRefreshProgressKey] = useState(0);

  const refreshProgress = () => {
    setRefreshProgressKey(prev => prev + 1);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/assessment')
      return
    }

    const fetchData = async () => {
      try {
        const [contentsRes, progressRes] = await Promise.all([
          getContents(),
          getUserProgress()
        ])
        setAllContents(contentsRes.data)

        // Hapus sisa key sessionStorage lama jika ada
        sessionStorage.removeItem('dismissedPosttestPrompt')

        const posttestScore = progressRes.data?.posttest_score
        const isPosttestCompleted = posttestScore !== null && posttestScore !== undefined && posttestScore !== ''
        if (!isPosttestCompleted) {
          setShowPosttestPrompt(true)
        }

        if (user.group === 'A') {
          const recRes = await getRecommendations()
          setRecommendations(recRes.data)

          // Helper: enrich item RF supaya ContentCard bisa baca confidence, category, level
          const enrich = (item) => ({
            ...item.materi,
            confidence: item.confidence,
            category: item.category,
            level: item.level,
            reason: item.reason,
            category_rank: item.category_rank,
            recommended: true,
          })

          // Top Pick: 3 materi teratas dari RF
          setRecommended(recRes.data.slice(0, 3).map(enrich))

          // Materi Lainnya: sisa ranking RF (rank 4+), dedup 1 per kategori
          const seen = new Set()
          const other = recRes.data
            .slice(3)
            .filter((item) => {
              if (seen.has(item.category)) return false
              seen.add(item.category)
              return true
            })
            .map(enrich)
          setOtherRecommended(other)
        }
      } catch (error) {
        showToast('Gagal memuat data')
        console.error(error)
      }
    }

    fetchData()
  }, [user, loading, navigate, showToast])

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout()
      navigate('/')
    }
  }

  const handlePostTestComplete = async (score, answers) => {
    try {
      await submitPosttest({ answers, score })
      showToast('Post-test berhasil disimpan!')
      setShowPosttestPrompt(false)
      refreshProgress()
    } catch (error) {
      // 👇 INI KUNCI UNTUK TAHU PENYEBABNYA
      console.error('STATUS:', error.response?.status)
      console.error('DATA:', error.response?.data)     // ← pesan dari FastAPI
      console.error('PAYLOAD DIKIRIM:', { answers, score })
      showToast(error.response?.data?.detail || 'Gagal menyimpan post-test')
    }
  }

  const handleCardClick = (content) => {
    setSelectedContent(content)
    setShowModal(true)
  }

  if (loading) return <div className="progress-modern"><div className="stats-bar-loading">Memuat dashboard...</div></div>
  if (!user) return null

  const isGroupA = user.group === 'A'

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="main-content" id="dashboard-content">
        {activeTab === 'overview' && (
          isGroupA
            ? <DashboardAOverview
              recommended={recommended}
              other={otherRecommended}
              onCardClick={handleCardClick}
            />
            : <DashboardBOverview contents={allContents} onCardClick={handleCardClick} />
        )}
        {isGroupA && activeTab === 'recommendations' && (
          <RecommendationsPage recommendations={recommendations} onCardClick={handleCardClick} />
        )}
        {!isGroupA && activeTab === 'all' && (
          <DashboardBOverview contents={allContents} onCardClick={handleCardClick} />
        )}
        {activeTab === 'progress' && <Progress user={user} refreshKey={refreshProgressKey} />}
        {activeTab === 'achievements' && <Achievements user={user} />}
        {activeTab === 'posttest' && <PostTest onComplete={handlePostTestComplete} user={user} />}
        {activeTab === 'settings' && <Settings user={user} onLogout={handleLogout} />}
      </div>
      {showModal && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setShowModal(false)}
          user={user}
          onInteractionComplete={refreshProgress}
        />
      )}
      {showPosttestPrompt && (
        <PosttestPromptModal
          isOpen={showPosttestPrompt}
          onClose={() => setShowPosttestPrompt(false)}
          onConfirm={() => {
            setShowPosttestPrompt(false)
            setActiveTab('posttest')
          }}
          user={user}
        />
      )}
    </div>
  )
}

export default Dashboard