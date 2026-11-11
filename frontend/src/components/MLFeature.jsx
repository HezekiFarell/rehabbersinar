import { useState, useEffect } from 'react';

const MLFeature = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ml-feature">
      <div 
        className="ml-slider-track" 
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {/* Slide 1 */}
        <div className="ml-slide">
          <div className="ml-slide-content">
            <div className="ml-header">
              <span className="ml-badge">Machine Learning</span>
            </div>
            <h3>🤖 Random Forest Recommendation System</h3>
            <p>Sistem kami menganalisis profil pengguna (usia, pendidikan, preferensi belajar) menggunakan algoritma Random Forest 
            dengan 100 decision trees untuk memberikan rekomendasi materi edukasi yang paling personal dan efektif.</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="ml-slide">
          <div className="ml-slide-content">
            <div className="ml-header">
              <span className="ml-badge">Mitra Edukasi</span>
            </div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="images/BNN.png" 
                alt="Logo BNN" 
                style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
              />
              BNN Kota Manado
            </h3>
            <p>Hadir sebagai pilar utama pencegahan dan pemberdayaan di Ibu Kota Sulawesi Utara, BNN Kota Manado berkomitmen mewujudkan masyarakat 
            yang bersih dari penyalahgunaan narkoba.</p>
          </div>
        </div>
      </div>

      <div className="ml-dots">
        <button 
          className={`ml-dot ${activeSlide === 0 ? 'active' : ''}`}
          onClick={() => setActiveSlide(0)}
          aria-label="Slide 1"
        ></button>
        <button 
          className={`ml-dot ${activeSlide === 1 ? 'active' : ''}`}
          onClick={() => setActiveSlide(1)}
          aria-label="Slide 2"
        ></button>
      </div>
    </div>
  )
}

export default MLFeature