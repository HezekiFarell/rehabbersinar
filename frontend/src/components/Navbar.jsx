import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LoginModal from '../components/LoginModal'
import { GiHealing } from 'react-icons/gi'
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled')
      } else {
        navbar.classList.remove('scrolled')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileContainer = document.getElementById('navProfileContainer')
      if (profileContainer && !profileContainer.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLoginSuccess = (userData) => {
    if (userData.is_admin) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  const handleLogoutClick = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        await logout()
        setDropdownOpen(false)
        showToast('Berhasil logout!')
        navigate('/')
      } catch (error) {
        console.error('Logout error:', error)
        showToast('Gagal logout. Silakan coba lagi.')
      }
    }
  }

  return (
    <>
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <div className="logo-icon logo-icon-clean">
              <GiHealing size={24} color="#5f6ac1" />
            </div>
            RehabBersinar
          </Link>
          
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`} id="navLinks">
            <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Beranda</Link></li>
            <li><Link to="/assessment" className={isActive('/assessment') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Assessment</Link></li>
            <li><Link to="/education" className={isActive('/education') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Edukasi</Link></li>
            {(!user || !user.is_admin) && (
              <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            )}
            <li><Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Tentang</Link></li>
            {!user ? (
              <li>
                <button className="btn-nav" onClick={() => { setIsLoginModalOpen(true); setMenuOpen(false); }}>
                  Login
                </button>
              </li>
            ) : (
              <li className="nav-profile-container" id="navProfileContainer">
                <button 
                  className={`btn-nav profile-trigger ${dropdownOpen ? 'active' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Halo, {user.nama}
                  <span className={`chevron-icon ${dropdownOpen ? 'open' : ''}`}>
                    <ChevronDown size={16} />
                  </span>
                </button>
                {dropdownOpen && (
                  <ul className="profile-dropdown">
                    <li>
                      <Link to={user.is_admin ? "/admin" : "/dashboard"} onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}>
                        <LayoutDashboard size={14} className="dropdown-icon" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogoutClick} className="logout-btn">
                        <LogOut size={14} className="dropdown-icon" />
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
          
          <button className="mobile-menu-btn" id="mobileMenuBtn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default Navbar