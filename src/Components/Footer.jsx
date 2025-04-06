import React from 'react';
import { FaTiktok, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'; // Import icons
import { Link } from 'react-router-dom';
// import './Footer.css'; 
function Footer() {
  const isLoggedIn = sessionStorage.getItem("token");

  return (
    <footer className="bg-dark text-white py-5">
      <section className="container">
        
        {/* Sign In Button */}
        {isLoggedIn ? (
          <h4 className="d-none"></h4> // Optional: Can display something for logged in users
        ) : (
          <div className="text-center mb-4">
            <button className="btn btn-warning rounded-5 mb-4">
              <Link to="/login" className="text-black text-decoration-none">Sign In for more</Link>
            </button>
          </div>
        )}

        {/* Footer Main Content */}
        <div className="row text-center text-md-left align-items-center">
          
          {/* About CineMatch (Left) */}
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="footer-title">About CineMatch</h5>
            <p className="footer-text">
              CineMatch is your ultimate destination for discovering movies, TV shows, and web series. Get personalized recommendations and stay updated with the latest trends in entertainment.
            </p>
          </div>

          {/* Follow Us on Socials (Center) */}
          <div className="col-md-4">
            <h5 className="footer-title">Follow Us on Socials</h5>
            <div className="social-icons d-flex justify-content-center gap-4">
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTiktok size={30} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon text-primary">
                <FaFacebook size={30} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon text-danger">
                <FaInstagram size={30} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon text-info">
                <FaTwitter size={30} />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon text-danger">
                <FaYoutube size={30} />
              </a>
            </div>
          </div>

          {/* Quick Links (Right) */}
          <div className="col-md-3 text-md-end">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none footer-link">Home</Link></li>
              <li><Link to="/movies" className="text-white text-decoration-none footer-link">Movies</Link></li>
              <li><Link to="/tvshows" className="text-white text-decoration-none footer-link">TV Shows</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none footer-link">Contact</Link></li>
            </ul>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-4">
          <p className="footer-text-small">© 2025 CineMatch. All rights reserved.</p>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
