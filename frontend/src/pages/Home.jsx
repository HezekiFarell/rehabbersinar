import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import MLFeature from '../components/MLFeature';
import FeaturedContent from '../components/FeaturedContent';
import ContentDetailModal from '../components/ContentDetailModal'; // impor modal
import GuidanceModal from '../components/GuidanceModal';

const Home = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenGuidance');
    if (hasSeen !== 'true') {
      setShowGuidanceModal(true);
    }
  }, []);

  const handleCardClick = (content) => {
    setSelectedContent(content);
    setShowModal(true);
  };

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  return (
    <>
      <Hero />
      <StatsBar />
      <MLFeature />
      <FeaturedContent onCardClick={handleCardClick} /> {/* kirim fungsi */}
      {showModal && (
        <ContentDetailModal content={selectedContent} onClose={() => setShowModal(false)} />
      )}
      
      {/* Guidance Pop-up */}
      <GuidanceModal 
        isOpen={showGuidanceModal} 
        onClose={() => setShowGuidanceModal(false)} 
        onStartAssessment={handleStartAssessment}
      />

      {/* Floating help trigger button */}
      <button 
        className="guidance-floating-trigger" 
        onClick={() => setShowGuidanceModal(true)}
        aria-label="Buka panduan alur"
      >
        <span className="guidance-pulse-dot"></span>
        <HelpCircle size={18} />
        <span>Panduan Alur</span>
      </button>
    </>
  );
};

export default Home;