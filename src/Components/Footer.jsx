import React from 'react';
import { FaTiktok, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const isLoggedIn = sessionStorage.getItem("token");

  return (
    <footer className="footer">
      {/* Gold hairline top */}
      <div className="footer-hairline" />

      <div className="footer-inner">

        {/* ── CTA band — only for guests ── */}
        {!isLoggedIn && (
          <div className="footer-cta">
            <p className="footer-cta-text">Discover your next obsession.</p>
            <Link to="/login" className="footer-cta-btn">Sign In</Link>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-logo">
              <span className="footer-logo-cine">CINE</span>
              <span className="footer-logo-match">MATCH</span>
            </span>
            <p className="footer-about">
              Your ultimate destination for discovering movies, TV shows, and web series.
              Personalized recommendations. Always updated.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Explore</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/movies" className="footer-link">Movies</Link></li>
              <li><Link to="/tvshows" className="footer-link">TV Shows</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Follow Us</h3>
            <div className="footer-socials">
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="TikTok">
                <FaTiktok />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Twitter / X">
                <FaTwitter />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} CineMatch. All rights reserved.</p>
          <p className="footer-copy footer-copy--muted">Made for film lovers, by film lovers.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;