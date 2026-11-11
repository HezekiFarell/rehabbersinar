import { X, ClipboardCheck, ArrowRight } from 'lucide-react';
import './PosttestPromptModal.css';

const PosttestPromptModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="posttest-prompt-overlay" onClick={handleClose}>
      <div className="posttest-prompt-card" onClick={(e) => e.stopPropagation()}>
        <button 
          className="posttest-prompt-close" 
          onClick={handleClose}
          aria-label="Tutup pengingat"
        >
          <X size={18} />
        </button>

        <div className="posttest-prompt-badge">
          <span>Tugas Akhir 🏆</span>
        </div>

        <div className="posttest-prompt-icon-wrapper">
          <ClipboardCheck size={32} />
        </div>

        <h2>Yuk, Ukur Pemahamanmu!</h2>
        
        <p>
          Halo <strong>{user?.nama || 'Pengguna'}</strong>, Anda terdeteksi belum mengerjakan <strong>Post-Test</strong>. 
          Mari selesaikan Post-test sekarang untuk menguji pemahaman Anda setelah mempelajari materi edukasi dan melengkapi kuesioner Anda.
        </p>

        <div className="posttest-prompt-actions">
          <button 
            className="posttest-prompt-btn-confirm" 
            onClick={handleConfirm}
          >
            Kerjakan Sekarang <ArrowRight size={18} />
          </button>
          
          <button 
            className="posttest-prompt-btn-cancel" 
            onClick={handleClose}
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosttestPromptModal;
