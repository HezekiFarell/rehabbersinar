import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h4>RehabBersinar</h4>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Platform edukasi rehabilitasi narkoba berbasis AI untuk masyarakat Kota Manado.
          </p>
        </div>
        <div className="footer-section">
          <h4>Menu</h4>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/assessment">Assessment</Link></li>
            <li><Link to="/education">Edukasi</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Kontak</h4>
          <ul>
            <li><a href="https://www.facebook.com/p/BNN-Kota-Manado-100086996176670/">BNN Kota Manado</a></li>
            <li><a href="#">Email: bnnkota.manado@gmail.com</a></li>
            <li><a href="#">hubungi: +43 1 8800358</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 RehabBersinar - Skripsi Penelitian. Kolaborasi dengan BNN Kota Manado.</p>
      </div>
    </footer>
  )
}

export default Footer