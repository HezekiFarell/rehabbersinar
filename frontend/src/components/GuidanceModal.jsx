import { useState } from 'react';
import { X, ArrowLeft, ArrowRight, UserPlus, Sliders, BookOpen, Trophy, Check } from 'lucide-react';
import './GuidanceModal.css';

const GuidanceModal = ({ isOpen, onClose, onStartAssessment }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenGuidance', 'true');
    }
    onClose();
  };

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenGuidance', 'true');
    }
    onClose();
    if (onStartAssessment) {
      onStartAssessment();
    }
  };

  // Line progress width based on current step
  const getLineFillWidth = () => {
    return `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;
  };

  return (
    <div className="guidance-modal-overlay" onClick={handleClose}>
      <div className="guidance-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="guidance-modal-close"
          onClick={handleClose}
          aria-label="Tutup panduan"
        >
          <X size={20} />
        </button>

        <div className="guidance-modal-header">
          <div className="guidance-modal-badge">
            <span>Panduan Alur 📖</span>
          </div>
          <h2>Panduan Pengisian Kuesioner & Edukasi</h2>
        </div>

        {/* Custom Stepper */}
        <div className="guidance-stepper-container">
          <div className="guidance-stepper-line-bg"></div>
          <div
            className="guidance-stepper-line-fill"
            style={{ width: getLineFillWidth() }}
          ></div>
          <div className="guidance-stepper">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`guidance-step-node ${currentStep === stepNum ? 'active' : ''
                  } ${currentStep > stepNum ? 'completed' : ''}`}
              >
                {currentStep > stepNum ? <Check size={16} strokeWidth={3} /> : stepNum}
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="guidance-content-wrapper">
          {currentStep === 1 && (
            <div className="guidance-step-detail">
              <div className="guidance-step-intro">
                <div className="guidance-icon-wrapper step-1">
                  <UserPlus size={28} />
                </div>
                <div className="guidance-step-text">
                  <h3>Langkah 1: Registrasi & Pre-test Awal</h3>
                  <p>
                    Klik tombol <strong>"Mulai Assessment"</strong> di halaman utama. Anda akan mengisi data diri singkat, menyetujui informed consent, dan langsung mengerjakan <strong>Pre-test</strong> berisi 15 soal untuk mengukur tingkat pemahaman awal Anda sebelum belajar.
                  </p>
                </div>
              </div>
              <div className="guidance-step-visual">
                <div className="mock-registration">
                  <div className="mock-q-row">
                    <span>1. Nama Lengkap: [Masukkan Nama Anda]</span>
                    <span className="mock-q-badge">Data Diri</span>
                  </div>
                  <div className="mock-q-row">
                    <span>2. Apakah dampak penyalahgunaan narkoba?</span>
                    <span className="mock-q-badge">Pre-test (Soal 1/15)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="guidance-step-detail">
              <div className="guidance-step-intro">
                <div className="guidance-icon-wrapper step-2">
                  <Sliders size={28} />
                </div>
                <div className="guidance-step-text">
                  <h3>Langkah 2: Tentukan Preferensi Materi Edukasi</h3>
                  <p>
                    Lengkapi profil, minat edukasi, tingkat kebutuhan materi (P1–P6), dan pre-test. Sistem akan menyusun rekomendasi materi secara personal berdasarkan profil dan kebutuhan belajarmu.
                  </p>
                </div>
              </div>
              <div className="guidance-step-visual">
                <div className="mock-preferences">
                  <div className="mock-preference-pill">🎥 Video</div>
                  <div className="mock-preference-pill selected">📄 Artikel</div>
                  <div className="mock-preference-pill">📊 Infografis</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="guidance-step-detail">
              <div className="guidance-step-intro">
                <div className="guidance-icon-wrapper step-3">
                  <BookOpen size={28} />
                </div>
                <div className="guidance-step-text">
                  <h3>Langkah 3: Pelajari Materi (Edukasi)</h3>
                  <p>
                    Masuk ke halaman <strong>Dashboard</strong> Anda. Pelajari modul edukasi rehabilitasi narkoba yang direkomendasikan secara personal (untuk Grup A) atau modul bebas (untuk Grup B). Klik tombol <strong>"Tandai Selesai"</strong> setelah membaca/menonton materi agar progres belajar Anda tercatat.
                  </p>
                </div>
              </div>
              <div className="guidance-step-visual">
                <div className="mock-materials">
                  <div className="mock-material-item">
                    <span>📖 Dampak Narkoba Bagi Kesehatan</span>
                    <button className="mock-btn-complete" disabled>✓ Selesai</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="guidance-step-detail">
              <div className="guidance-step-intro">
                <div className="guidance-icon-wrapper step-4">
                  <Trophy size={28} />
                </div>
                <div className="guidance-step-text">
                  <h3>Langkah 4: Post-test & Evaluasi (Selesai)</h3>
                  <p>
                    Buka tab <strong>"Post-Test"</strong> di sidebar Dashboard setelah Anda selesai mempelajari materi untuk mengukur peningkatan pemahaman Anda. Terakhir, masuk ke tab <strong>"Settings"</strong> untuk memberikan feedback & rating. Proses kuesioner Anda selesai!
                  </p>
                </div>
              </div>
              <div className="guidance-step-visual">
                <div className="mock-posttest">
                  <div className="mock-badge-success">✓ Post-test Selesai</div>
                  <div className="mock-stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="guidance-modal-footer">
          <label className="guidance-dont-show-checkbox">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Jangan tampilkan lagi</span>
          </label>

          <div className="guidance-controls">
            {currentStep > 1 && (
              <button className="guidance-btn guidance-btn-prev" onClick={handlePrev}>
                <ArrowLeft size={16} /> Sebelumnya
              </button>
            )}

            {currentStep < totalSteps ? (
              <button className="guidance-btn guidance-btn-next" onClick={handleNext}>
                Lanjut <ArrowRight size={16} />
              </button>
            ) : (
              <button className="guidance-btn guidance-btn-finish" onClick={handleFinish}>
                Mulai Sekarang 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidanceModal;
