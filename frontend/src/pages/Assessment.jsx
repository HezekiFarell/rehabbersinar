import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PreTest from '../components/PreTest';
import { register } from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  Rocket,
  CheckCircle,
  User,
  Sliders,
  Sparkles
} from 'lucide-react';

const minatOptions = [
  'Narkotika dan jenis-jenisnya',
  'Dampak penyalahgunaan narkoba bagi kesehatan',
  'Proses dan layanan rehabilitasi',
  'Cara mencegah penyalahgunaan dan kekambuhan',
  'Peran keluarga dalam pemulihan',
  'Cara menerapkan pola hidup sehat',
  'Program rehabilitasi dan layanan pasca rehabilitasi',
  'Saya ingin mempelajari semua topik di atas'
];

const kebutuhanStatements = [
  {
    key: 'p1',
    code: 'P1',
    category: 'Pengetahuan',
    statement: 'Saya membutuhkan informasi tentang narkotika, jenis-jenis narkotika, bahaya penyalahgunaan, dan adiksi.'
  },
  {
    key: 'p2',
    code: 'P2',
    category: 'Kesehatan',
    statement: 'Saya membutuhkan informasi tentang dampak narkoba terhadap kesehatan serta cara mengelola stres dan kondisi psikologis.'
  },
  {
    key: 'p3',
    code: 'P3',
    category: 'Pencegahan',
    statement: 'Saya membutuhkan informasi tentang cara mencegah penyalahgunaan narkoba dan mencegah terjadinya kekambuhan (relaps).'
  },
  {
    key: 'p4',
    code: 'P4',
    category: 'Keluarga',
    statement: 'Saya membutuhkan informasi tentang peran keluarga dalam mendukung pemulihan dan rehabilitasi penyalahgunaan narkoba.'
  },
  {
    key: 'p5',
    code: 'P5',
    category: 'Program/Rehabilitasi',
    statement: 'Saya membutuhkan informasi tentang layanan, tahapan, proses, dan program rehabilitasi narkoba.'
  },
  {
    key: 'p6',
    code: 'P6',
    category: 'Pola Hidup Sehat',
    statement: 'Saya membutuhkan informasi tentang cara menerapkan pola hidup sehat.'
  }
];

const ratingScaleOptions = [
  { value: '1', label: '1 = Tidak membutuhkan' },
  { value: '2', label: '2 = Kurang membutuhkan' },
  { value: '3', label: '3 = Cukup membutuhkan' },
  { value: '4', label: '4 = Membutuhkan' },
  { value: '5', label: '5 = Sangat membutuhkan' }
];

const statusPekerjaanOptions = [
  { value: 'Pelajar', label: 'Pelajar' },
  { value: 'Mahasiswa', label: 'Mahasiswa' },
  { value: 'Pegawai Swasta', label: 'Pegawai Swasta / BUMN' },
  { value: 'PNS / ASN', label: 'Pegawai Negeri Sipil (PNS) / ASN' },
  { value: 'Wiraswasta', label: 'Wiraswasta / Wirausaha' },
  { value: 'Ibu Rumah Tangga', label: 'Ibu Rumah Tangga' },
  { value: 'Belum Bekerja', label: 'Belum / Tidak Bekerja' },
  { value: 'Lainnya', label: 'Lainnya' }
];


const mapMinatToTopik = (minat) => {
  switch (minat) {
    case 'Narkotika dan jenis-jenisnya':
      return 'pengetahuan';
    case 'Dampak penyalahgunaan narkoba bagi kesehatan':
      return 'kesehatan';
    case 'Proses dan layanan rehabilitasi':
      return 'program';
    case 'Cara mencegah penyalahgunaan dan kekambuhan':
      return 'pencegahan';
    case 'Peran keluarga dalam pemulihan':
      return 'keluarga';
    case 'Cara menerapkan pola hidup sehat':
      return 'pola hidup sehat';
    case 'Program rehabilitasi dan layanan pasca rehabilitasi':
      return 'program';
    case 'Saya ingin mempelajari semua topik di atas':
      return 'pengetahuan';
    default:
      return 'pengetahuan';
  }
};

const Assessment = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    password: '',
    usia: '',
    statusPekerjaan: '',
    gender: '',
    kecamatan: '',
    informedConsent: false,
    minat: '',
    kebutuhan: {
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      p5: '',
      p6: ''
    }
  });

  const [pretestAnswers, setPretestAnswers] = useState({});
  const [pretestScore, setPretestScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleKebutuhanChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      kebutuhan: {
        ...prev.kebutuhan,
        [key]: value
      }
    }));
  };

  const validateStep1 = () => {
    const { nama, password, usia, statusPekerjaan, gender, kecamatan, informedConsent } = formData;
    if (!nama.trim()) {
      alert('Harap masukkan nama lengkap Anda.');
      return false;
    }
    if (!password || password.length < 6) {
      alert('Password minimal harus 6 karakter.');
      return false;
    }
    const usiaNum = parseInt(usia);
    if (!usia || isNaN(usiaNum) || usiaNum < 10 || usiaNum > 100) {
      alert('Harap masukkan usia yang valid (10-100 tahun).');
      return false;
    }
    if (!statusPekerjaan) {
      alert('Harap pilih status / pekerjaan Anda.');
      return false;
    }
    if (!gender) {
      alert('Harap pilih jenis kelamin Anda.');
      return false;
    }
    if (!kecamatan) {
      alert('Harap pilih kecamatan domisili di Manado.');
      return false;
    }
    if (!informedConsent) {
      alert('Harap setujui informed consent untuk melanjutkan asesmen.');
      return false;
    }
    return true;
  };

  const isStep1ValidForNavigation = () => {
    const { nama, password, usia, statusPekerjaan, gender, kecamatan, informedConsent } = formData;
    const usiaNum = parseInt(usia);
    return Boolean(
      nama.trim() &&
      password &&
      password.length >= 6 &&
      usia &&
      !isNaN(usiaNum) &&
      statusPekerjaan &&
      gender &&
      kecamatan &&
      informedConsent
    );
  };

  const validateStep2 = () => {
    if (!formData.minat) {
      alert('Harap pilih salah satu topik minat edukasi yang ingin Anda pelajari.');
      return false;
    }

    // Validasi 6 kebutuhan belajar
    for (const item of kebutuhanStatements) {
      if (!formData.kebutuhan[item.key]) {
        alert(`Harap lengkapi kebutuhan belajar pada poin ${item.code} (${item.category}).`);
        return false;
      }
    }
    return true;
  };

  const isStep2ValidForNavigation = () => {
    if (!formData.minat) return false;
    return kebutuhanStatements.every(item => Boolean(formData.kebutuhan[item.key]));
  };

  const handleGoToStep = (targetStep) => {
    if (targetStep === 1) {
      setStep(1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }
    if (targetStep === 2) {
      if (!validateStep1()) return;
      setStep(2);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }
    if (targetStep === 3) {
      if (!validateStep1()) {
        setStep(1);
        return;
      }
      if (!validateStep2()) {
        setStep(2);
        return;
      }
      setStep(3);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleNextFromStep1 = () => {
    if (!validateStep1()) return;
    setStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleNextFromStep2 = () => {
    if (!validateStep2()) return;
    setStep(3);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePretestComplete = async (answers, score) => {
    setPretestAnswers(answers);
    setPretestScore(score);

    setLoading(true);
    try {
      const payload = {
        nama: formData.nama.trim(),
        password: formData.password,
        usia: parseInt(formData.usia),
        gender: formData.gender,
        status: formData.statusPekerjaan,
        // pendidikan: mapStatusToPendidikan(formData.statusPekerjaan),
        kecamatan: formData.kecamatan,
        informed_consent: formData.informedConsent,

        pretest_answers: answers,
        pretest_score: score,

        minat_edukasi: formData.minat,
        p1: parseInt(formData.kebutuhan.p1),
        p2: parseInt(formData.kebutuhan.p2),
        p3: parseInt(formData.kebutuhan.p3),
        p4: parseInt(formData.kebutuhan.p4),
        p5: parseInt(formData.kebutuhan.p5),
        p6: parseInt(formData.kebutuhan.p6),

        // preferensi_format: formData.format || 'campuran',
        // preferensi_waktu: parseInt(formData.waktu) || 30
      };

      // Simpan rincian kuesioner ke localStorage untuk referensi lokal
      localStorage.setItem('user_assessment_details', JSON.stringify({
        statusPekerjaan: formData.statusPekerjaan,
        minat: formData.minat,
        kebutuhan: formData.kebutuhan,
        pretestScore: score
      }));

      // API Register & Auto Login
      await register(payload);
      await login(formData.nama.trim(), formData.password);

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert('Registrasi gagal: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-container" style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Assessment Awal</h2>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>
          Isi profil, preferensi, kebutuhan belajar, dan pre-test untuk personalisasi edukasi rehabilitasi
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="progress-steps" style={{ marginBottom: '2.5rem' }}>
        <button
          type="button"
          className={`step ${step >= 1 ? 'active' : ''} ${step > 1 || isSubmitted ? 'completed' : ''}`}
          id="step-1-indicator"
          disabled={isSubmitted}
          onClick={() => !isSubmitted && handleGoToStep(1)}
        >
          <div className="step-number">1</div>
          <div className="step-label"> Registrasi</div>
        </button>

        <button
          type="button"
          className={`step ${step >= 2 ? 'active' : ''} ${step > 2 || isSubmitted ? 'completed' : ''}`}
          id="step-2-indicator"
          disabled={!isStep1ValidForNavigation() || isSubmitted}
          onClick={() => !isSubmitted && handleGoToStep(2)}
        >
          <div className="step-number">2</div>
          <div className="step-label">Preferensi</div>
        </button>

        <button
          type="button"
          className={`step ${step >= 3 ? 'active' : ''} ${step > 3 || isSubmitted ? 'completed' : ''}`}
          id="step-3-indicator"
          disabled={!isStep1ValidForNavigation() || !isStep2ValidForNavigation() || isSubmitted}
          onClick={() => !isSubmitted && handleGoToStep(3)}
        >
          <div className="step-number">3</div>
          <div className="step-label">Pre-test</div>
        </button>

        <div className={`step ${isSubmitted ? 'active completed' : ''}`} id="step-4-indicator">
          <div className="step-number">4</div>
          <div className="step-label">{isSubmitted ? 'Selesai' : 'Hasil'}</div>
        </div>
      </div>

      {isSubmitted ? (
        /* Step Selesai: Tampilan Sukses & Ringkasan */
        <div className="card text-center" style={{
          padding: '3rem 2rem',
          maxWidth: '680px',
          margin: '1rem auto',
          textAlign: 'center',
          borderRadius: '16px',
          background: '#ffffff',
          boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.12)',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 16px rgba(22, 163, 74, 0.25)'
          }}>
            <CheckCircle size={48} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
            Terima Kasih, Data Berhasil Disimpan!
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
            Asesmen Anda telah dianalisis. Silakan buka Dashboard untuk melihat modul pembelajaran yang direkomendasikan.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#2563eb" /> Ringkasan Asesmen Pengguna:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: '#475569' }}>
              <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Nama</span>
                <strong>{formData.nama}</strong>
              </div>

              <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Usia & Status</span>
                <strong>{formData.usia} Tahun ({formData.statusPekerjaan})</strong>
              </div>

              <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Skor Pre-Test</span>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '1.05rem' }}>{pretestScore} / 15</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#1e40af', textTransform: 'uppercase', fontWeight: 700 }}>Topik Minat Utama</span>
              <span style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '0.925rem' }}>{formData.minat}</span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.95rem 2.75rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
              background: 'var(--primary, #2563eb)',
              color: '#ffffff',
              border: 'none'
            }}
          >
            Buka Dashboard Edukasi <Rocket size={20} />
          </button>
        </div>
      ) : (
        <>
          {/* STEP 1: A. REGISTRASI & PROFIL PENGGUNA */}
          {step === 1 && (
            <div className="form-step active" id="step-1">
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  background: 'var(--primary, #2563eb)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: 700 }}>
                    A. Profil Pengguna & Registrasi
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                    Data diri Anda digunakan untuk keperluan analisis personalisasi materi dan penelitian secara anonim.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nama">Nama Lengkap</label>
                <input
                  type="text"
                  id="nama"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.nama}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6 0-10-8-10-8a21.73 21.73 0 0 1 5.06-7.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 4c6 0 10 8 10 8a21.8 21.8 0 0 1-4.13 5.02" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 1l22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="usia">Usia</label>
                  <input
                    type="number"
                    id="usia"
                    min="10"
                    max="100"
                    placeholder="Contoh: 18"
                    value={formData.usia}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Jenis Kelamin</label>
                  <select id="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Pilih jenis kelamin...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="statusPekerjaan">Status / Pekerjaan</label>
                  <select
                    id="statusPekerjaan"
                    value={formData.statusPekerjaan}
                    onChange={handleChange}
                    style={{ fontWeight: formData.statusPekerjaan ? 600 : 400 }}
                  >
                    <option value="">Pilih status / pekerjaan...</option>
                    {statusPekerjaanOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="kecamatan">Kecamatan (Manado)</label>
                  <select id="kecamatan" value={formData.kecamatan} onChange={handleChange}>
                    <option value="">Pilih kecamatan...</option>
                    <option value="bunaken">Bunaken</option>
                    <option value="malalayang">Malalayang</option>
                    <option value="sario">Sario</option>
                    <option value="tikala">Tikala</option>
                    <option value="wenang">Wenang</option>
                    <option value="singkil">Singkil</option>
                    <option value="tuminting">Tuminting</option>
                    <option value="wanea">Wanea</option>
                    <option value="paal2">Paal II</option>
                    <option value="mapanget">Mapanget</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: formData.informedConsent ? '1px solid #93c5fd' : '1px solid #e2e8f0'
                }}>
                  <input
                    type="checkbox"
                    id="informedConsent"
                    checked={formData.informedConsent}
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--primary, #2563eb)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                    Saya menyetujui untuk berpartisipasi dalam penelitian ini dan data saya akan digunakan secara anonim.
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextFromStep1}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.9rem 1.5rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: 'var(--primary, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Lanjut ke Preferensi Belajar <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: B. PREFERENSI (MINAT & KEBUTUHAN BELAJAR) */}
          {step === 2 && (
            <div className="form-step active" id="step-2">
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  background: 'var(--primary, #2563eb)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: 700 }}>
                    B. Preferensi & C. Kebutuhan Belajar
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                    Tentukan topik minat edukasi dan tingkat kebutuhan informasi Anda.
                  </p>
                </div>
              </div>

              {/* B. MINAT EDUKASI */}
              <div style={{
                marginBottom: '2.5rem',
                padding: '1.5rem',
                borderRadius: '14px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: '#eff6ff',
                    color: 'var(--primary, #2563eb)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    B. MINAT EDUKASI
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Apa yang ingin Anda pelajari lebih lanjut tentang narkotika dan rehabilitasi?
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Pilih salah satu fokus topik yang paling sesuai dengan ketertarikan Anda:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {minatOptions.map((opt) => {
                    const isSelected = formData.minat === opt;
                    return (
                      <label
                        key={opt}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '0.85rem 1.1rem',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary, #2563eb)' : '1px solid #e2e8f0',
                          background: isSelected ? 'rgba(37, 99, 235, 0.05)' : '#f8fafc',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="radio"
                          name="minatEdukasi"
                          value={opt}
                          checked={isSelected}
                          onChange={(e) => setFormData(prev => ({ ...prev, minat: e.target.value }))}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: 'var(--primary, #2563eb)',
                            flexShrink: 0
                          }}
                        />
                        <span style={{
                          fontSize: '0.95rem',
                          color: isSelected ? '#1e40af' : '#334155',
                          fontWeight: isSelected ? 700 : 500,
                          lineHeight: '1.4'
                        }}>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>



              {/* C. KEBUTUHAN BELAJAR */}
              <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                borderRadius: '14px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: '#eff6ff',
                    color: 'var(--primary, #2563eb)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    C. KEBUTUHAN BELAJAR
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Seberapa besar kebutuhan Anda untuk mempelajari topik berikut?
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Pilih tingkat kebutuhan pada dropdown untuk setiap pernyataan di bawah ini:
                </p>

                {/* Petunjuk Skala */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.4rem',
                  padding: '0.85rem',
                  background: '#f1f5f9',
                  borderRadius: '10px',
                  marginBottom: '1.75rem',
                  fontSize: '0.8rem',
                  color: '#475569'
                }}>
                  <div><strong>1</strong> = Tidak membutuhkan</div>
                  <div><strong>2</strong> = Kurang membutuhkan</div>
                  <div><strong>3</strong> = Cukup membutuhkan</div>
                  <div><strong>4</strong> = Membutuhkan</div>
                  <div><strong>5</strong> = Sangat membutuhkan</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {kebutuhanStatements.map((item) => {
                    const currentValue = formData.kebutuhan[item.key] || '';
                    return (
                      <div
                        key={item.key}
                        style={{
                          padding: '1.15rem',
                          borderRadius: '10px',
                          border: currentValue ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                          background: currentValue ? 'rgba(239, 246, 255, 0.4)' : '#ffffff',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <span style={{
                            background: currentValue ? 'var(--primary, #2563eb)' : '#64748b',
                            color: '#ffffff',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {item.code}
                          </span>
                          <div>
                            <span style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: 'var(--primary, #2563eb)',
                              textTransform: 'uppercase',
                              display: 'block',
                              marginBottom: '0.2rem'
                            }}>
                              {item.category}
                            </span>
                            <p style={{
                              margin: 0,
                              fontSize: '0.95rem',
                              color: '#1e293b',
                              fontWeight: 500,
                              lineHeight: '1.5'
                            }}>
                              {item.statement}
                            </p>
                          </div>
                        </div>

                        <div style={{ marginTop: '0.85rem' }}>
                          <select
                            id={`kebutuhan_${item.key}`}
                            value={currentValue}
                            onChange={(e) => handleKebutuhanChange(item.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              border: currentValue ? '2px solid var(--primary, #2563eb)' : '1px solid #cbd5e1',
                              background: '#ffffff',
                              fontSize: '0.925rem',
                              fontWeight: currentValue ? 600 : 400,
                              color: currentValue ? '#1e293b' : '#64748b'
                            }}
                          >
                            <option value="">Pilih tingkat kebutuhan...</option>
                            {ratingScaleOptions.map(scale => (
                              <option key={scale.value} value={scale.value}>
                                {scale.label}
                              </option>
                            ))}
                          </select>

                          {/* Quick 1-5 selection buttons for convenience */}
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginRight: '0.25rem' }}>Atau pilih cepat:</span>
                            {['1', '2', '3', '4', '5'].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => handleKebutuhanChange(item.key, num)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  border: currentValue === num ? '2px solid var(--primary, #2563eb)' : '1px solid #cbd5e1',
                                  background: currentValue === num ? 'var(--primary, #2563eb)' : '#ffffff',
                                  color: currentValue === num ? '#ffffff' : '#475569',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Navigasi Step 2 */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setStep(1);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem',
                    borderRadius: '10px',
                    fontWeight: 600
                  }}
                >
                  <ArrowLeft size={16} /> Kembali ke Profil
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextFromStep2}
                  style={{
                    flex: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    background: 'var(--primary, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Lanjut ke Pre-test (15 Soal) <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: D. PRE-TEST 15 SOAL */}
          {step === 3 && (
            <PreTest
              onComplete={handlePretestComplete}
              initialAnswers={pretestAnswers}
              onBack={() => {
                setStep(2);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Assessment;