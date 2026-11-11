import { useState, useEffect } from 'react'
import ContentCard from './ContentCard'
import contentsData from '../data/contents'
import { getContents } from '../services/api'

const FeaturedContent = ({ onCardClick }) => {
  const [contents, setContents] = useState([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getContents()
        setContents(res.data)
      } catch (error) {
        console.error("Gagal memuat materi unggulan dari server, menggunakan data cadangan:", error)
        setContents(contentsData)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <>
      <div className="section-header">
        <h2>Materi Edukasi Unggulan</h2>
        <p>Pilih dari berbagai format pembelajaran yang sesuai dengan gaya belajar Anda</p>
      </div>
      <div className="content-grid" id="featured-content">
        {contents.slice(0,3).map(content => (
          <ContentCard 
            key={content.id} 
            content={content} 
            showConfidence={content.recommended} 
            onClick={() => onCardClick(content)}
          />
        ))}
      </div>
    </>
  )
}

export default FeaturedContent