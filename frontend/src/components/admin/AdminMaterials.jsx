import { useState, useEffect } from 'react'
import { getContents, createMateri, updateMateri, deleteMateri } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import {
  Plus, Edit, Trash2, FileText, Play, Image as ImageIcon,
  ChevronDown, ChevronRight
} from 'lucide-react'

/* =========================================================
   KONSTANTA
========================================================= */

const initialForm = {
  title: '',
  type: 'artikel',
  duration: 5,
  icon: '',
  description: '',
  fullDescription: '',
  videoUrl: '',
  imageUrl: '',
  category: '',
  content: '',
  sources: []
}

const TYPE_COLOR = {
  artikel: '#38bdf8',
  video: '#10b981',
  infografis: '#8b5cf6'
}

const CATEGORY_OPTIONS = [
  { value: 'pengetahuan', label: 'Pengetahuan' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'pencegahan', label: 'Pencegahan' },
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'program', label: 'Program' },
  { value: 'pola hidup sehat', label: 'Pola Hidup Sehat' }
]

const ICON_OPTIONS = [
  { value: '', label: '— Tanpa Ikon —' },
  { value: '📄', label: '📄 Dokumen / Artikel' },
  { value: '🎥', label: '🎥 Video' },
  { value: '📊', label: '📊 Infografis / Chart' },
  { value: '📖', label: '📖 Buku' },
  { value: '🧠', label: '🧠 Otak / Pengetahuan' },
  { value: '💊', label: '💊 Obat / Kesehatan' },
  { value: '🏥', label: '🏥 Rumah Sakit' },
  { value: '👨‍👩‍👧', label: '👨‍👩‍👧 Keluarga' },
  { value: '🛡️', label: '🛡️ Perlindungan / Pencegahan' },
  { value: '🌱', label: '🌱 Pemulihan / Hidup Sehat' },
  { value: '💪', label: '💪 Kekuatan / Motivasi' },
  { value: '🎯', label: '🎯 Target / Tujuan' },
  { value: '⭐', label: '⭐ Bintang' }
]

/* =========================================================
   HELPER — TIPE ICON
========================================================= */

const TypeIcon = ({ type, size = 14, color }) => {
  const c = color || TYPE_COLOR[type] || '#fff'
  if (type === 'video') return <Play size={size} color={c} />
  if (type === 'infografis') return <ImageIcon size={size} color={c} />
  return <FileText size={size} color={c} />
}

/* =========================================================
   HELPER — THUMBNAIL OTOMATIS
========================================================= */

const getYouTubeId = (url) => {
  if (!url) return null
  const patterns = [
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtu\.be\/([^?&/]+)/
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

const getThumbnail = (m) => {
  const ytId = getYouTubeId(m.videoUrl)
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  if (m.imageUrl && m.imageUrl.trim() !== '') return m.imageUrl.trim()
  return ''
}

/* =========================================================
   HELPER — SOURCES PARSER PINTAR
========================================================= */

const nameFromUrl = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const sourcesToText = (sources) => {
  if (!Array.isArray(sources) || sources.length === 0) return ''
  return sources
    .map(s => {
      const link = s.link || ''
      const name = s.name || ''
      if (!name || name === link || name === nameFromUrl(link)) return link
      return `${name} | ${link}`
    })
    .join('\n')
}

const parseSources = (text) => {
  const trimmed = (text || '').trim()
  if (!trimmed) return []

  // Mode JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      let parsed = JSON.parse(trimmed)
      if (!Array.isArray(parsed)) parsed = [parsed]
      return parsed
        .map(s => {
          if (typeof s === 'string') return { name: nameFromUrl(s), link: s }
          const link = s.link || ''
          return { name: s.name || nameFromUrl(link), link }
        })
        .filter(s => s.link)
    } catch {
      // JSON invalid → lanjut ke mode plain di bawah
    }
  }

  // Mode plain: satu baris = satu sumber
  return trimmed
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (line.includes('|')) {
        const [namePart, ...rest] = line.split('|')
        const link = rest.join('|').trim()
        return { name: namePart.trim() || nameFromUrl(link), link }
      }
      if (line.includes(' - ')) {
        const [namePart, ...rest] = line.split(' - ')
        const link = rest.join(' - ').trim()
        return { name: namePart.trim() || nameFromUrl(link), link }
      }
      return { name: nameFromUrl(line), link: line }
    })
    .filter(s => s.link && /^https?:\/\//i.test(s.link))
}

/* =========================================================
   KOMPONEN UTAMA
========================================================= */

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [sourcesText, setSourcesText] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const res = await getContents()
      setMaterials(res.data)
    } catch {
      showToast('Gagal memuat materi')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(initialForm)
    setSourcesText('')
    setEditing(null)
    setShowAdvanced(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsedSources = parseSources(sourcesText)

    const payload = {
      ...form,
      duration: parseInt(form.duration, 10) || 0,
      sources: parsedSources
    }

    try {
      if (editing) {
        await updateMateri(editing.id, payload)
        showToast('Materi berhasil diperbarui')
      } else {
        await createMateri(payload)
        showToast('Materi berhasil ditambahkan')
      }
      setShowForm(false)
      resetForm()
      fetchMaterials()
    } catch (error) {
      const detail = error.response?.data?.detail
      const msg = Array.isArray(detail)
        ? detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        : detail || error.message
      showToast(`Gagal menyimpan materi: ${msg}`)
    }
  }

  const handleEdit = (m) => {
    setEditing(m)
    setForm({
      title: m.title || '',
      type: m.type || 'artikel',
      duration: m.duration ?? 5,
      icon: m.icon || '',
      description: m.description || '',
      fullDescription: m.fullDescription || '',
      videoUrl: m.videoUrl || '',
      imageUrl: m.imageUrl || '',
      category: m.category || '',
      content: m.content || '',
      sources: m.sources || []
    })
    setSourcesText(sourcesToText(m.sources || []))
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus materi ini?')) return
    try {
      await deleteMateri(id)
      showToast('Materi dihapus')
      fetchMaterials()
    } catch {
      showToast('Gagal menghapus materi')
    }
  }

  if (loading) return <div>Memuat...</div>

  /* ---- Shared styles ---- */
  const sectionStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem'
  }
  const sectionHead = {
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--gray, #94a3b8)',
    marginBottom: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const BlueBox = ({ size = 40, type, radius = 6 }) => (
    <div style={{
      width: size,
      height: size,
      borderRadius: radius,
      flexShrink: 0,
      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)'
    }}>
      <TypeIcon type={type} size={Math.round(size * 0.42)} color="#fff" />
    </div>
  )

  const previewThumb = getThumbnail(form)
  const ytDetected = getYouTubeId(form.videoUrl)
  const sourcesPreview = parseSources(sourcesText)

  return (
    <div>
      {/* ============ HEADER ============ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <h2>Manajemen Materi</h2>
          <p className="admin-content-subtitle">
            Unggah, perbarui, atau hapus konten edukasi digital.
          </p>
        </div>
        <button
          className="btn btn-white"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '999px',
            padding: '0.6rem 1.2rem'
          }}
          onClick={() => { resetForm(); setShowForm(true) }}
        >
          <Plus size={16} />
          <span>Tambah Materi</span>
        </button>
      </div>

      {/* ============ FORM ============ */}
      {showForm && (
        <div className="admin-form">
          <h3 style={{ marginBottom: '1rem' }}>
            {editing ? 'Edit Materi' : 'Tambah Materi'}
          </h3>

          <form onSubmit={handleSubmit}>

            {/* ====== INFORMASI UTAMA ====== */}
            <div style={sectionStyle}>
              <div style={sectionHead}>📝 Informasi Utama</div>

              <div className="form-group">
                <label>Judul Materi *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="misal: Pentingnya Rehabilitasi Medis"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipe</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="artikel">Artikel</option>
                    <option value="video">Video</option>
                    <option value="infografis">Infografis</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">— Pilih Kategori —</option>
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Durasi (menit)</label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* ====== MEDIA & THUMBNAIL ====== */}
            <div style={sectionStyle}>
              <div style={sectionHead}>🖼️ Media & Thumbnail</div>

              <div className="form-group">
                <label>
                  URL Video
                  <span style={{ color: 'var(--gray)', fontWeight: 400 }}>
                    {' '}(thumbnail otomatis dari YouTube)
                  </span>
                </label>
                <input
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/embed/qcCe8nfXP3A"
                />
                {ytDetected && (
                  <small style={{
                    color: '#10b981',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem',
                    display: 'block'
                  }}>
                    ✓ Thumbnail YouTube terdeteksi otomatis
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>
                  URL Gambar
                  <span style={{ color: 'var(--gray)', fontWeight: 400 }}>
                    {' '}(untuk infografis / artikel bergambar)
                  </span>
                </label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://i.imgur.com/xxxxx.png"
                />
                <small style={{
                  color: 'var(--gray)',
                  fontSize: '0.78rem',
                  display: 'block',
                  marginTop: '0.35rem'
                }}>
                  💡 Gunakan direct link (berakhiran .png / .jpg / .webp), bukan link album.
                </small>
              </div>

              {/* Preview thumbnail */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10
              }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {previewThumb ? (
                    <img
                      src={previewThumb}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <BlueBox size={72} type={form.type} radius={10} />
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '0.2rem' }}>
                    Preview Kartu
                  </strong>
                  {ytDetected && '→ Thumbnail dari YouTube'}
                  {!ytDetected && form.imageUrl && '→ Thumbnail dari URL Gambar'}
                  {!ytDetected && !form.imageUrl && '→ Tidak ada gambar. Kartu berwarna biru.'}
                </div>
              </div>
            </div>

            {/* ====== DESKRIPSI ====== */}
            <div style={sectionStyle}>
              <div style={sectionHead}>📄 Deskripsi</div>

              <div className="form-group">
                <label>
                  Deskripsi Singkat
                  <span style={{ color: 'var(--gray)', fontWeight: 400 }}>
                    {' '}(untuk kartu)
                  </span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Ringkasan singkat yang muncul di kartu materi..."
                />
              </div>

              <div className="form-group">
                <label>
                  Deskripsi Lengkap
                  <span style={{ color: 'var(--gray)', fontWeight: 400 }}>
                    {' '}(untuk modal detail)
                  </span>
                </label>
                <textarea
                  name="fullDescription"
                  value={form.fullDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Sinopsis / penjelasan lengkap..."
                />
              </div>
            </div>

            {/* ====== KONTEN ARTIKEL ====== */}
            {form.type === 'artikel' && (
              <div style={sectionStyle}>
                <div style={sectionHead}>✍️ Konten Artikel</div>
                <div className="form-group">
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tulis isi artikel di sini..."
                  />
                </div>
              </div>
            )}

            {/* ====== PENGATURAN LANJUTAN ====== */}
            <div style={sectionStyle}>
              <button
                type="button"
                onClick={() => setShowAdvanced(v => !v)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gray, #94a3b8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: 0
                }}
              >
                {showAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                Pengaturan Lanjutan (Ikon & Sumber)
              </button>

              {showAdvanced && (
                <div style={{ marginTop: '1rem' }}>

                  {/* Dropdown Ikon */}
                  <div className="form-group">
                    <label>Label Ikon</label>
                    <select name="icon" value={form.icon} onChange={handleChange}>
                      {ICON_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {form.icon && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.8rem',
                        color: 'var(--gray)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{form.icon}</span>
                        <span>Ikon terpilih</span>
                      </div>
                    )}
                  </div>

                  {/* Sumber / Referensi */}
                  <div className="form-group">
                    <label>
                      Sumber / Referensi
                      <span style={{ color: 'var(--gray)', fontWeight: 400 }}> (opsional)</span>
                    </label>
                    <textarea
                      value={sourcesText}
                      onChange={(e) => setSourcesText(e.target.value)}
                      rows="3"
                      placeholder={
                        'Ketik satu URL per baris. Contoh:\n' +
                        'https://bnn.go.id/pengertian-narkoba\n' +
                        'https://kemkes.go.id/artikel\n\n' +
                        'Atau dengan nama: BNN RI | https://bnn.go.id'
                      }
                    />
                    <small style={{
                      color: 'var(--gray)',
                      fontSize: '0.78rem',
                      display: 'block',
                      marginTop: '0.35rem'
                    }}>
                      💡 Bisa satu URL per baris, "Nama | URL", atau format JSON array.
                    </small>

                    {sourcesPreview.length > 0 && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.6rem 0.8rem',
                        background: 'rgba(59,130,246,0.06)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: 8,
                        fontSize: '0.8rem'
                      }}>
                        <strong style={{
                          display: 'block',
                          marginBottom: '0.3rem',
                          color: '#93c5fd'
                        }}>
                          ✓ Terdeteksi {sourcesPreview.length} sumber:
                        </strong>
                        {sourcesPreview.map((s, i) => (
                          <div key={i} style={{ color: 'var(--gray)', padding: '2px 0' }}>
                            {i + 1}. <span style={{ color: '#fff' }}>{s.name}</span> → {s.link}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* ====== TOMBOL ====== */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-white">Simpan</button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => { setShowForm(false); resetForm() }}
              >
                Batal
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ============ TABEL ============ */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Materi</th>
            <th>Tipe</th>
            <th>Durasi</th>
            <th>Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(m => {
            const thumb = getThumbnail(m)
            return (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={m.title}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 6,
                          flexShrink: 0
                        }}
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement
                          e.currentTarget.remove()
                          const box = document.createElement('div')
                          box.style.cssText =
                            'width:40px;height:40px;border-radius:6px;flex-shrink:0;' +
                            'background:linear-gradient(135deg,#2563eb 0%,#3b82f6 100%);'
                          parent.prepend(box)
                        }}
                      />
                    ) : (
                      <BlueBox size={40} type={m.type} />
                    )}
                    <span>{m.title}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TypeIcon type={m.type} size={14} />
                    <span style={{ textTransform: 'capitalize' }}>{m.type}</span>
                  </div>
                </td>
                <td>{m.duration} menit</td>
                <td style={{ textTransform: 'capitalize' }}>{m.category}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => handleEdit(m)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginRight: '0.75rem',
                      color: '#38bdf8'
                    }}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: '#f43f5e'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Hapus</span>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AdminMaterials