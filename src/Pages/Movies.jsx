import React, { useState, useEffect } from 'react';
import { FaStar, FaBookmark, FaCheck, FaChevronLeft, FaChevronRight, FaFilm } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Movies.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlistIds(new Set(stored.map((m) => m.id)));
  }, []);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: '104982ca487a975dd171416b2958f849',
          language: 'en-US',
          page: pageNumber,
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (movie) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlistIds.has(movie.id)) {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setWatchlistIds((prev) => new Set([...prev, movie.id]));
      toast.success('Added to Watchlist!');
    } else {
      toast.info('Already in your Watchlist');
    }
  };

  const goToPage = (next) => {
    const clamped = Math.max(1, Math.min(next, totalPages));
    if (clamped !== page) setPage(clamped);
  };

  // Build visible page numbers
  const getPageNums = () => {
    const range = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="mv-root">

      {/* ── HERO ── */}
      <section className="mv-hero">
        <div className="mv-hero__bg" />
        <div className="mv-hero__overlay" />
        <div className="mv-hero__content">
          <span className="mv-hero__eyebrow">
            <FaFilm className="mv-hero__eyebrow-icon" />
            CineMatch Library
          </span>
          <h1 className="mv-hero__title">Popular Movies</h1>
          <p className="mv-hero__sub">
            Browse thousands of films, save your favourites, and never lose track of what to watch next.
          </p>
        </div>
        {/* Bottom fade into page body */}
        <div className="mv-hero__fade" />
      </section>

      {/* ── MOVIE GRID ── */}
      <section className="mv-section">
        <div className="mv-container">

          {/* Section header */}
          <div className="mv-header">
            <h2 className="mv-header__title">
              🎬 Trending Now
              <span className="mv-header__page">Page {page}</span>
            </h2>
            <p className="mv-header__count">{movies.length} titles</p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="mv-grid">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="mv-skeleton" />
              ))}
            </div>
          ) : (
            <div className="mv-grid">
              {movies.map((movie, idx) => {
                const inList = watchlistIds.has(movie.id);
                return (
                  <div key={movie.id} className="mv-card">
                    {/* Rank badge */}
                    <div className="mv-card__rank">
                      #{(page - 1) * 20 + idx + 1}
                    </div>

                    {/* Poster */}
                    <div className="mv-card__img-wrap">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : 'https://via.placeholder.com/300x450/0A0E1A/8B9DC3?text=No+Poster'
                        }
                        alt={movie.title}
                        className="mv-card__img"
                        loading="lazy"
                      />
                      <div className="mv-card__hover">
                        <p className="mv-card__overview">
                          {movie.overview?.slice(0, 120)}…
                        </p>
                        <Link to={`/movie/${movie.id}`} className="mv-card__detail-btn">
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="mv-card__body">
                      <h3 className="mv-card__title">{movie.title}</h3>
                      <div className="mv-card__meta">
                        <span className="mv-card__rating">
                          <FaStar className="mv-card__star" />
                          {movie.vote_average?.toFixed(1)}
                        </span>
                        <span className="mv-card__year">
                          {movie.release_date?.slice(0, 4)}
                        </span>
                      </div>
                      <button
                        className={`mv-card__wl-btn ${inList ? 'mv-card__wl-btn--active' : ''}`}
                        onClick={() => addToWatchlist(movie)}
                      >
                        {inList ? (
                          <><FaCheck className="mv-card__wl-icon" /> In Watchlist</>
                        ) : (
                          <><FaBookmark className="mv-card__wl-icon" /> Add to Watchlist</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PAGINATION ── */}
          <div className="mv-pagination">
            <button
              className="mv-page-btn mv-page-btn--arrow"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
            </button>

            {page > 3 && (
              <>
                <button className="mv-page-btn" onClick={() => goToPage(1)}>1</button>
                {page > 4 && <span className="mv-page-ellipsis">…</span>}
              </>
            )}

            {getPageNums().map((n) => (
              <button
                key={n}
                className={`mv-page-btn ${n === page ? 'mv-page-btn--active' : ''}`}
                onClick={() => goToPage(n)}
              >
                {n}
              </button>
            ))}

            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="mv-page-ellipsis">…</span>}
                <button className="mv-page-btn" onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}

            <button
              className="mv-page-btn mv-page-btn--arrow"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>

        </div>
      </section>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={2000}
        hideProgressBar
        toastClassName="mv-toast"
      />
    </div>
  );
}

export default Movies;