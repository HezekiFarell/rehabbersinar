import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-badge animate-fade-in-up">
          <span className="badge-icon">🎓</span>
          <span>Penelitian Skripsi - Kota Manado</span>
        </div>
        <h1 className="animate-fade-in-up delay-100">
          Rehabilitasi untuk <span className="text-gradient">Hidup yang Lebih Baik</span>
        </h1>
        <p className="animate-fade-in-up delay-200">
          Platform edukasi personalisasi berbasis Machine Learning (Random Forest) untuk meningkatkan pemahaman masyarakat tentang rehabilitasi narkoba.
        </p>
        <div className="hero-buttons animate-fade-in-up delay-300">
          <button className="btn btn-primary btn-glow" onClick={() => navigate('/assessment')}>
            <span className="btn-icon">🚀</span>
            Mulai Assessment
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/education')}>
            <span className="btn-icon">📚</span>
            Jelajahi Materi
          </button>
        </div>
      </div>

      <div className="hero-visual animate-fade-in-up delay-200">
        <div className="visual-image-wrapper">
          <img
            src="/images/beranda.png"
            alt="Medical Hero Visual"
            className="hero-main-img"
          />
          <div className="hero-bnn-badge float-anim-main">
            <span className="badge-text-top">Bekerjasama dengan</span>
            <div className="bnn-logo-row">
              <img
                src="/images/BNN.png"
                alt="BNN Logo"
                className="bnn-icon"
              />
              <span className="bnn-title">BNN Kota Manado</span>
            </div>
          </div>

          <div className="floating-stat float-anim-1">
            <div className="stat-icon-wrapper">📊</div>
            <div className="stat-text-col">
              <span className="stat-val">98%</span>
              <span className="stat-lbl">Personalisasi ML</span>
            </div>
          </div>

          <div className="floating-stat float-anim-2">
            <div className="stat-icon-wrapper">🤝</div>
            <div className="stat-text-col">
              <span className="stat-val">10+</span>
              <span className="stat-lbl">Materi Interaktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-background">
        <div className="gradient-blob top-right"></div>
        <div className="gradient-blob bottom-left"></div>
      </div>
    </div>
  )
}

export default Hero;