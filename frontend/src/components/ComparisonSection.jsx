const ComparisonSection = () => {
  return (
    <div className="comparison-section">
      <div className="section-header">
        <h2>Sistem Dua Kelompok Penelitian</h2>
        <p>Partisipan dibagi secara acak untuk mengukur efektivitas sistem rekomendasi</p>
      </div>

      <div className="comparison-grid">
        <div className="comparison-card a">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>🤖 Kelompok A</h3>
          <h4 style={{ marginBottom: '0.5rem' }}>Sistem Rekomendasi RF</h4>
          <ul style={{ textAlign: 'left', listStyle: 'none', marginTop: '1rem' }}>
            <li>✅ Personalisasi konten</li>
            <li>✅ Urutan belajar adaptif</li>
            <li>✅ Confidence score</li>
            <li>✅ Explainable AI</li>
          </ul>
        </div>

        <div className="comparison-card feature">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>📊 Variabel Diukur</h3>
          <h4 style={{ marginBottom: '0.5rem' }}>Metrik Evaluasi</h4>
          <ul style={{ textAlign: 'left', listStyle: 'none', marginTop: '1rem' }}>
            <li>📈 Peningkatan pengetahuan</li>
            <li>⏱️ Engagement waktu</li>
            <li>😊 Kepuasan pengguna</li>
          </ul>
        </div>

        <div className="comparison-card b">
          <h3 style={{ color: 'var(--gray)', marginBottom: '1rem' }}>📚 Kelompok B</h3>
          <h4 style={{ marginBottom: '0.5rem' }}>Sistem Konvensional</h4>
          <ul style={{ textAlign: 'left', listStyle: 'none', marginTop: '1rem' }}>
            <li>⚪ Akses bebas</li>
            <li>⚪ Daftar materi statis</li>
            <li>⚪ Tanpa algoritma ML</li>
            <li>⚪ Browse manual</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ComparisonSection