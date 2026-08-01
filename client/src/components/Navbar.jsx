import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <div style={{width:'44px',height:'44px',background:'linear-gradient(135deg,#E63946,#FF9F1C)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'1.4rem'}}>🎬</div>
            <div className="brand-text">
              <div className="brand-name">AnimVerse AI</div>
              <div className="brand-tagline">Prompt → Animation</div>
            </div>
          </Link>

          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#library">Story Library</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#templates">Templates</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>

          <div className={`hamburger${menuOpen ? ' open' : ''}`} id="hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
        <a href="#features" onClick={() => setMenuOpen(false)}>✨ Features</a>
        <a href="#library" onClick={() => setMenuOpen(false)}>📚 Story Library</a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>⚙️ How It Works</a>
        <a href="#templates" onClick={() => setMenuOpen(false)}>🎨 Templates</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>❓ FAQ</a>
        <div className="mobile-actions">
          <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
        </div>
      </div>
    </>
  )
}
