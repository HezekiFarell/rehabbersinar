import { useState, useEffect } from 'react'
import { getAdminFeedbacks } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { exportToCSV } from '../../utils/exportToCSV'
import { Download, Star } from 'lucide-react'

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await getAdminFeedbacks()
        setFeedbacks(res.data)
      } catch (error) {
        showToast('Gagal memuat feedback')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedbacks()
  }, [showToast])
  
  const handleExport = () => {
  const exportData = feedbacks.map(f => ({
    ID: f.id,
    'User ID': f.user_id,
    Rating: f.rating,
    Komentar: f.comment || '-',
    Tanggal: new Date(f.created_at).toLocaleString('id-ID')
  }))
  exportToCSV(exportData, 'feedback.csv')
}

  if (loading) return <div>Memuat...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2>Feedback Pengguna</h2>
          <p className="admin-content-subtitle">Evaluasi respon, saran, dan kepuasan pengguna terhadap platform.</p>
        </div>
        <button className="export-btn" onClick={handleExport}>
          <Download size={16} />
          <span>Ekspor CSV</span>
        </button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Komentar</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.user_id}</td>
                <td>
                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < f.rating ? '#f59e0b' : 'none'} stroke={i < f.rating ? '#f59e0b' : '#94a3b8'} />
                    ))}
                  </div>
                </td>
                <td>{f.comment || '-'}</td>
                <td>{new Date(f.created_at).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminFeedbacks