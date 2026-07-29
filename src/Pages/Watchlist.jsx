import React, { useState, useEffect } from 'react';
import { FaStar, FaFilm } from 'react-icons/fa';
import './Watchlist.css';

function Watchlist() {
  const isLoggedIn = sessionStorage.getItem('token');
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(stored);
  }, []);

  const removeFromWatchlist = (id) => {
    const updated = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  if (!isLoggedIn) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-denied">
          <h3>Access Denied</h3>
          <p>You must be logged in to view your Watchlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      {/* Header */}
      <div className="watchlist-header">
        <h2>Your <span>Watchlist</span></h2>
        <p>{watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved</p>
        <div className="watchlist-divider" />
      </div>

      {/* Grid */}
      <div className="watchlist-grid">
        {watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <div key={movie.id} className="watchlist-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="watchlist-card-img"
                alt={movie.title}
                loading="lazy"
              />

              {/* Hover-reveal remove button */}
              <div className="watchlist-card-overlay">
                <button
                  className="watchlist-remove-btn"
                  onClick={() => removeFromWatchlist(movie.id)}
                >
                  Remove
                </button>
              </div>

              <div className="watchlist-card-body">
                <p className="watchlist-card-title" title={movie.title}>
                  {movie.title}
                </p>
                <p className="watchlist-card-rating">
                  <FaStar size={12} />
                  {movie.vote_average.toFixed(1)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="watchlist-empty">
            <div className="watchlist-empty-icon">
              <FaFilm />
            </div>
            <p>Nothing here yet — start adding titles to your watchlist.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;