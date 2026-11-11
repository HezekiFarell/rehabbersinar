import { MapPin } from 'lucide-react';

const About = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="comparison-section">
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Tentang Penelitian</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          <strong>Judul:</strong> Analisis Sistem Rekomendasi Berbasis Random Forest untuk Edukasi 
          Rehabilitasi Narkoba di Masyarakat Kota Manado
        </p>
        
        <h3 style={{ margin: '2rem 0 1rem' }}>Tujuan Penelitian</h3>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
          <li>Mengembangkan sistem rekomendasi edukasi berbasis Random Forest</li>
          <li>Mengukur efektivitas personalisasi konten terhadap pemahaman masyarakat</li>
          <li>Membandingkan hasil belajar antara kelompok RF dan non-RF</li>
          <li>Menyediakan platform edukasi yang valid untuk BNN Kota Manado</li>
        </ul>

        <h3 style={{ margin: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={22} style={{ color: 'var(--primary)', marginRight: '0.25rem' }} /> Lokasi BNN Kota Manado
        </h3>
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            paddingBottom: '56.25%',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <iframe 
              src="https://maps.google.com/maps?q=BNN%20Kota%20Manado&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi BNN Kota Manado"
            ></iframe>
          </div>
          <div style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--gray)', fontSize: '0.95rem' }}>
            <p style={{ color: 'var(--dark)', fontWeight: 'bold', marginBottom: '0.25rem' }}>Badan Narkotika Nasional Kota Manado</p>
            <p>Jl. 14 Februari, Teling Atas, Kec. Wanea, Kota Manado, Sulawesi Utara</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About