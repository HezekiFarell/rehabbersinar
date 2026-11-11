import React, { useState } from 'react';
import questions from '../data/questions';

const PreTest = ({ onComplete, initialAnswers = {}, onBack, loading = false }) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 3;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const startIdx = currentPage * questionsPerPage;
  const endIdx = startIdx + questionsPerPage;
  const currentQuestions = questions.slice(startIdx, endIdx);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } else {
      // Hitung skor
      let score = 0;
      questions.forEach(q => {
        if (answers[q.id] === 'correct') score++;
      });
      onComplete(answers, score);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } else if (onBack) {
      onBack();
    }
  };

  // Cek apakah semua pertanyaan di halaman ini sudah dijawab
  const isCurrentPageComplete = currentQuestions.every(q => answers[q.id] !== undefined && answers[q.id] !== '');

  // Hitung total terjawab dari 15 soal
  const totalAnswered = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;

  return (
    <div className="form-step active" id="step-pretest">
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: 700 }}>
              D. Pre-Test Pengetahuan (15 Soal)
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Jawab pertanyaan di bawah ini sesuai pemahaman awal Anda sebelum memulai pembelajaran.
            </p>
          </div>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--primary, #2563eb)',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}>
            {totalAnswered} / {questions.length} Terjawab
          </div>
        </div>

        {/* Indikator Halaman & Progress Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
            Halaman {currentPage + 1} dari {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === currentPage ? '24px' : '10px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: idx === currentPage ? 'var(--primary, #2563eb)' : idx < currentPage ? '#93c5fd' : '#e2e8f0',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pertanyaan per halaman */}
      {currentQuestions.map((q, index) => {
        const questionNumber = startIdx + index + 1;
        return (
          <div
            key={q.id}
            style={{
              marginBottom: '1.75rem',
              padding: '1.25rem',
              borderRadius: '12px',
              border: answers[q.id] ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
              background: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{
                background: 'var(--primary, #2563eb)',
                color: '#ffffff',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                flexShrink: 0,
                marginTop: '1px'
              }}>
                {questionNumber}
              </span>
              <label style={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1rem',
                lineHeight: '1.5',
                cursor: 'pointer'
              }}>
                {q.text}
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--primary, #2563eb)' : '1px solid #e2e8f0',
                      background: isSelected ? 'rgba(37, 99, 235, 0.06)' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(q.id, opt.value)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--primary, #2563eb)' }}
                    />
                    <span style={{
                      fontSize: '0.925rem',
                      color: isSelected ? '#1e3a8a' : '#334155',
                      fontWeight: isSelected ? 600 : 400,
                      lineHeight: '1.4'
                    }}>
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Tombol Navigasi */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={handlePrev}
          style={{
            flex: 1,
            padding: '0.85rem 1.5rem',
            borderRadius: '10px',
            fontWeight: 600
          }}
        >
          {currentPage > 0 ? '← Sebelumnya' : '← Kembali ke Preferensi'}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!isCurrentPageComplete || loading}
          style={{
            flex: 1.5,
            padding: '0.85rem 1.5rem',
            borderRadius: '10px',
            fontWeight: 700,
            opacity: isCurrentPageComplete && !loading ? 1 : 0.6,
            cursor: isCurrentPageComplete && !loading ? 'pointer' : 'not-allowed',
            background: 'var(--primary, #2563eb)',
            color: '#ffffff'
          }}
        >
          {loading ? (
            'Menyimpan Data...'
          ) : currentPage === totalPages - 1 ? (
            'Selesai Pre-Test & Simpan Asesmen 🚀'
          ) : (
            'Halaman Selanjutnya →'
          )}
        </button>
      </div>
    </div>
  );
};

export default PreTest;