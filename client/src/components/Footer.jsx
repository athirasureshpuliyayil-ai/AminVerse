import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">🎬 AnimVerse AI</div>
            <p className="footer-brand-desc">The world's most powerful AI-driven prompt-to-animation platform. Transform stories into stunning animated videos in minutes.</p>
            <div className="footer-socials">
              <a href="#" className="social-btn"><i className="fab fa-facebook-f" /></a>
              <a href="#" className="social-btn"><i className="fab fa-twitter" /></a>
              <a href="#" className="social-btn"><i className="fab fa-instagram" /></a>
              <a href="#" className="social-btn"><i className="fab fa-youtube" /></a>
              <a href="#" className="social-btn"><i className="fab fa-linkedin-in" /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#">Generate Animation</a></li>
              <li><a href="#">Story Library</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">API Access</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Genres</h4>
            <ul>
              <li><a href="#">Fairy Tales</a></li>
              <li><a href="#">Adventure</a></li>
              <li><a href="#">Mystery</a></li>
              <li><a href="#">Sci-Fi</a></li>
              <li><a href="#">Romance</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><Link to="/admin-login">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 AnimVerse AI. All rights reserved. Built with ❤️ for storytellers everywhere.</p>
          <p style={{opacity:0.4,fontSize:'0.75rem'}}>MCA Capstone Project — AnimVerse AI Platform</p>
        </div>
      </div>
    </footer>
  )
}
