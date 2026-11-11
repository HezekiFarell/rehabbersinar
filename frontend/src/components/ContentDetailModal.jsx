// ContentDetailModal.jsx
import { useState, useEffect } from 'react';
import { trackOpen, trackClose, trackComplete } from '../services/api';
import { Clock, Play, FileText, Image as ImageIcon } from 'lucide-react';

const renderModalTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return <Play size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
    case 'artikel':
      return <FileText size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
    case 'infografis':
      return <ImageIcon size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
    default:
      return null;
  }
};

const ReadMoreText = ({ text, previewLength = 200 }) => {
  const [showFull, setShowFull] = useState(false);
  const toggleText = () => setShowFull(!showFull);
  const displayText = showFull ? text : `${text.slice(0, previewLength)}...`;
  return (
    <div style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>
      {displayText}
      {text.length > previewLength && (
        <button
          onClick={toggleText}
          style={{
            display: 'block',
            marginTop: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.95rem'
          }}
        >
          {showFull ? "Tampilkan Lebih Sedikit" : "Teks Lengkap"}
        </button>
      )}
    </div>
  );
};

const ContentDetailModal = ({ content, onClose, user, onInteractionComplete }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!content || !user) return;
    // Catat open
    trackOpen({ user_id: user.id, materi_id: content.id }).catch(console.error);
    setStartTime(Date.now());
  }, [content, user]);

  const handleClose = () => {
    if (startTime && user) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      trackClose({ user_id: user.id, materi_id: content.id, duration })
        .then(() => {
          if (onInteractionComplete) onInteractionComplete();
          onClose();
        })
        .catch(console.error);
    } else {
      if (onInteractionComplete) onInteractionComplete();
      onClose();
    }
  };

const handleMarkComplete = () => {
  setCompleted(true);
  if (user) {
    trackComplete({ user_id: user.id, materi_id: content.id })
      .then(() => {
        if (onInteractionComplete) onInteractionComplete();
      })
      .catch(console.error);
  }
  alert('Materi ditandai selesai!');
};

  if (!content) return null;

  const renderContent = () => {
    switch(content.type) {
      case 'video':
        return (
          <div className="modal-video">
            <iframe
              width="100%"
              height="400"
              src={content.videoUrl || 'https://www.youtube.com/embed/placeholder'}
              title={content.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="modal-description">
              <p style={{ whiteSpace: "pre-line" }}>{content.fullDescription}</p>
            </div>
            {!completed && (
              <button className="btn btn-white" onClick={handleMarkComplete} style={{ marginTop: '1rem' }}>
                Tandai Selesai
              </button>
            )}
          </div>
        );
      case 'artikel':
        return (
          <div className="modal-artikel">
            <p>{content.fullDescription || content.description}</p>
            {content.content && <ReadMoreText text={content.content} />}
            {content.sources && content.sources.length > 0 && (
              <div className='sources' style={{ marginTop: '1.5rem' }}>
                <h4>Sumber & Referensi:</h4>
                {content.sources.map((source, index) => (
                  <a key={index} href={source.link} target="_blank" rel="noopener noreferrer">
                    {source.name}
                  </a>
                ))}
              </div>
            )}
            {!completed && (
              <button className="btn btn-white" onClick={handleMarkComplete} style={{ marginTop: '1rem' }}>
                Tandai Selesai
              </button>
            )}
          </div>
        );
      case 'infografis':
        return (
          <div className="modal-infografis">
            <img 
              src={content.imageUrl || 'https://via.placeholder.com/600x400?text=Infografis'} 
              alt={content.title}
              style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => {
                setLightboxImage(content.imageUrl || 'https://via.placeholder.com/600x400?text=Infografis');
                setLightboxOpen(true);
              }}
            />
            <div style={{ marginTop: '1rem' }}>
                <ReadMoreText text={content.fullDescription || content.description} />
            </div>
            {!completed && (
              <button className="btn btn-white" onClick={handleMarkComplete} style={{ marginTop: '1rem' }}>
                Tandai Selesai
              </button>
            )}
         </div>
        );
      default:
        return <p>{content.fullDescription || content.description}</p>;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-detail" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h2>{content.title}</h2>
        <div className="modal-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
            {renderModalTypeIcon(content.type)} {content.type}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={16} /> {content.duration} menit
          </span>
          {content.confidence > 0 && (
            <span className="confidence">Match: {content.confidence}%</span>
          )}
        </div>
        {renderContent()}
      </div>
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt={content.title} />
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetailModal;