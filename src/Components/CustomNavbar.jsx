import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaFilm, FaStar, FaTimes, FaUser, FaListUl, FaUserShield } from 'react-icons/fa';
import { MdLiveTv } from 'react-icons/md';
import axios from 'axios';
import './Navbar.css';

function CustomNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const dashRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
      if (dashRef.current && !dashRef.current.contains(e.target)) {
        setDashOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/multi', {
        params: {
          api_key: '104982ca487a975dd171416b2958f849',
          query: searchQuery,
          language: 'en-US',
        },
      });
      setSearchResults(response.data.results.slice(0, 6));
      setSearchOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchDetails = async (item) => {
    setSelectedItem(item);
    setSearchResults([]);
    setSearchQuery('');
    setCast([]);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${item.media_type}/${item.id}/credits`,
        { params: { api_key: '104982ca487a975dd171416b2958f849' } }
      );
      setCast(response.data.cast.slice(0, 6));
    } catch (error) {
      console.error('Error fetching cast:', error);
    }
  };

  const closeDetail = () => setSelectedItem(null);

  return (
    <>
      <nav className="cm-nav">
        <div className="cm-nav-inner">

          {/* Logo */}
          <Link to="/" className="cm-logo" onClick={() => setMenuOpen(false)}>
            <span className="cm-logo-cine">CINE</span>
            <span className="cm-logo-match">MATCH</span>
          </Link>

          {/* Desktop links */}
          <div className="cm-links">
            <Link to="/" className="cm-link"><FaHome className="cm-link-icon" />Home</Link>
            <Link to="/movies" className="cm-link"><FaFilm className="cm-link-icon" />Movies</Link>
            <Link to="/tvshows" className="cm-link cm-link--tv"><MdLiveTv className="cm-link-icon" />TV Shows</Link>
          </div>

          {/* Search */}
          <div className="cm-search-wrap" ref={searchRef}>
            <form className="cm-search-form" onSubmit={handleSearch}>
              <input
                type="text"
                className="cm-search-input"
                placeholder="Search movies, shows…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="cm-search-btn" aria-label="Search">
                <FaSearch />
              </button>
            </form>

            {/* Inline dropdown results */}
            {searchResults.length > 0 && (
              <div className="cm-search-dropdown">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    className="cm-search-result"
                    onClick={() => fetchDetails(item)}
                  >
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                          : 'https://via.placeholder.com/40x60?text=?'
                      }
                      alt={item.title || item.name}
                      className="cm-result-thumb"
                    />
                    <div className="cm-result-info">
                      <span className="cm-result-title">{item.title || item.name}</span>
                      <span className="cm-result-type">
                        {item.media_type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
                      </span>
                    </div>
                    {item.vote_average > 0 && (
                      <span className="cm-result-score">
                        <FaStar className="cm-result-star" />
                        {item.vote_average.toFixed(1)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dashboard dropdown */}
          <div className="cm-dash-wrap" ref={dashRef}>
            <button
              className="cm-dash-btn"
              onClick={() => setDashOpen((p) => !p)}
              aria-expanded={dashOpen}
            >
              <FaUser className="cm-dash-icon" />
              <span>Dashboard</span>
              <span className={`cm-dash-caret ${dashOpen ? 'cm-dash-caret--open' : ''}`}>▾</span>
            </button>
            {dashOpen && (
              <div className="cm-dash-dropdown">
                <Link to="/profile" className="cm-dash-item" onClick={() => setDashOpen(false)}>
                  <FaUser className="cm-dash-item-icon" /> My Profile
                </Link>
                <Link to="/watchlist" className="cm-dash-item" onClick={() => setDashOpen(false)}>
                  <FaListUl className="cm-dash-item-icon" /> Watchlist
                </Link>
                <div className="cm-dash-divider" />
                <Link to="/admin" className="cm-dash-item cm-dash-item--admin" onClick={() => setDashOpen(false)}>
                  <FaUserShield className="cm-dash-item-icon" /> Admin Login
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`cm-burger ${menuOpen ? 'cm-burger--open' : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="cm-mobile-menu">
            <Link to="/" className="cm-mobile-link" onClick={() => setMenuOpen(false)}><FaHome /> Home</Link>
            <Link to="/movies" className="cm-mobile-link" onClick={() => setMenuOpen(false)}><FaFilm /> Movies</Link>
            <Link to="/tvshows" className="cm-mobile-link cm-mobile-link--tv" onClick={() => setMenuOpen(false)}><MdLiveTv /> TV Shows</Link>
            <div className="cm-mobile-divider" />
            <Link to="/profile" className="cm-mobile-link" onClick={() => setMenuOpen(false)}><FaUser /> My Profile</Link>
            <Link to="/watchlist" className="cm-mobile-link" onClick={() => setMenuOpen(false)}><FaListUl /> Watchlist</Link>
            <Link to="/admin" className="cm-mobile-link" onClick={() => setMenuOpen(false)}><FaUserShield /> Admin Login</Link>
            <form className="cm-mobile-search" onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }}>
              <input
                type="text"
                className="cm-search-input"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="cm-search-btn"><FaSearch /></button>
            </form>
          </div>
        )}
      </nav>

      {/* ── Detail panel ── */}
      {selectedItem && (
        <>
          <div className="cm-detail-backdrop" onClick={closeDetail} />
          <div className="cm-detail-panel">
            <div className="cm-detail-hairline" />
            <button className="cm-detail-close" onClick={closeDetail} aria-label="Close">
              <FaTimes />
            </button>
            <div className="cm-detail-body">
              <div className="cm-detail-hero">
                <img
                  src={
                    selectedItem.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${selectedItem.backdrop_path}`
                      : selectedItem.poster_path
                      ? `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`
                      : 'https://via.placeholder.com/780x440?text=No+Image'
                  }
                  alt={selectedItem.title || selectedItem.name}
                  className="cm-detail-backdrop-img"
                />
                <div className="cm-detail-hero-overlay" />
                <div className="cm-detail-hero-content">
                  <img
                    src={
                      selectedItem.poster_path
                        ? `https://image.tmdb.org/t/p/w300${selectedItem.poster_path}`
                        : 'https://via.placeholder.com/90x135?text=?'
                    }
                    alt={selectedItem.title || selectedItem.name}
                    className="cm-detail-poster"
                  />
                  <div>
                    <h2 className="cm-detail-title">{selectedItem.title || selectedItem.name}</h2>
                    <div className="cm-detail-meta">
                      <span>{selectedItem.media_type === 'movie' ? '🎬 Movie' : '📺 TV Show'}</span>
                      {(selectedItem.release_date || selectedItem.first_air_date) && (
                        <>
                          <span className="cm-dot">·</span>
                          <span>{(selectedItem.release_date || selectedItem.first_air_date).slice(0, 4)}</span>
                        </>
                      )}
                      {selectedItem.vote_average > 0 && (
                        <>
                          <span className="cm-dot">·</span>
                          <span className="cm-detail-score">
                            <FaStar className="cm-detail-star" />
                            {selectedItem.vote_average.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="cm-detail-info">
                {selectedItem.overview && (
                  <section className="cm-detail-section">
                    <h3 className="cm-detail-section-label">Overview</h3>
                    <p className="cm-detail-overview">{selectedItem.overview}</p>
                  </section>
                )}

                {cast.length > 0 && (
                  <section className="cm-detail-section">
                    <h3 className="cm-detail-section-label">Cast</h3>
                    <div className="cm-detail-cast">
                      {cast.map((actor) => (
                        <div key={actor.id} className="cm-cast-card">
                          <div className="cm-cast-img-wrap">
                            <img
                              src={
                                actor.profile_path
                                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                  : 'https://via.placeholder.com/70x70?text=?'
                              }
                              alt={actor.name}
                              className="cm-cast-img"
                            />
                          </div>
                          <p className="cm-cast-name">{actor.name}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <button
                  className="cm-detail-view-btn"
                  onClick={() => {
                    navigate(`/${selectedItem.media_type === 'movie' ? 'movies' : 'tvshows'}/${selectedItem.id}`);
                    closeDetail();
                  }}
                >
                  Full Details
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CustomNavbar;