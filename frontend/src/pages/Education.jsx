import { useState, useEffect } from 'react'
import { BookOpen, Search } from 'lucide-react'
import ContentCard from '../components/ContentCard'
import contentsData from '../data/contents'
import ContentDetailModal from '../components/ContentDetailModal'
import { getContents } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Education = () => {
  const [contents, setContents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Semua Format')
  const [filterTopic, setFilterTopic] = useState('Semua Topik')
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await getContents()
        setContents(res.data)
        setFiltered(res.data)
      } catch (error) {
        console.error("Gagal mengambil materi dari server, menggunakan data cadangan:", error)
        setContents(contentsData)
        setFiltered(contentsData)
      }
    }
    fetchContents()
  }, [])

  useEffect(() => {
    let result = contents
    if (search) {
      result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    }
    if (filterType !== 'Semua Format') {
      result = result.filter(c => c.type === filterType.toLowerCase())
    }
    // Topic filter bisa ditambahkan jika data punya properti topik, sementara diabaikan
    setFiltered(result)
  }, [search, filterType, filterTopic, contents])
  const handleCardClick = (content) => {
    setSelectedContent(content);
    setShowModal(true);
  };


  return (
    <>
      <div className="section-header">
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <BookOpen size={28} style={{ color: 'var(--primary)' }} /> Materi Edukasi
        </h2>
        <p>Jelajahi konten rehabilitasi narkoba sesuai kebutuhan Anda</p>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-input-wrapper">
            <div className="search-input-icon">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Cari materi..." 
              style={{ flex: 1, minWidth: '200px', padding: '0.75rem 0.75rem 0.75rem 2.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            style={{ padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
          >
            <option>Semua Topik</option>
            <option>Pengenalan</option>
            <option>Dampak Kesehatan</option>
            <option>Terapi</option>
            <option>Keluarga</option>
          </select>
          
          <select 
            style={{ padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>Semua Format</option>
            <option>Video</option>
            <option>Artikel</option>
            <option>Infografis</option>
          </select>
        </div>
      </div>

      <div className="content-grid" id="education-content">
        {filtered.map(content => (
          <ContentCard 
            key={content.id} 
            content={content} 
            onClick={() => handleCardClick(content)} 
          />
        ))}
      </div>
      {showModal && (
        <ContentDetailModal content={selectedContent} onClose={() => setShowModal(false)} user={user} />
      )}
    </>
  )
}

export default Education