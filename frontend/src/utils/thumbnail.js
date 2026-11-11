export const getYouTubeId = (url) => {
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

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

// URL relatif → absolut kalau perlu (mis. /uploads/... dari backend)
const toAbsolute = (url) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('data:')) return url
    // '/images/...' diasumsikan dari folder public frontend → biarkan
    if (url.startsWith('/images/')) return url
    // '/uploads/...' → prefix backend
    return `${API_BASE}${url}`
}

/**
 * Prioritas thumbnail:
 *  1. m.thumbnail (kalau nanti ada kolomnya)
 *  2. YouTube (dari videoUrl)
 *  3. imageUrl
 *  4. '' → fallback ikon biru di ContentCard
 */
export const getThumbnail = (m) => {
    if (!m) return ''

    if (m.thumbnail && m.thumbnail.trim() !== '') {
        return toAbsolute(m.thumbnail.trim())
    }

    const ytId = getYouTubeId(m.videoUrl)
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`

    if (m.imageUrl && m.imageUrl.trim() !== '') {
        return toAbsolute(m.imageUrl.trim())
    }

    return ''
}