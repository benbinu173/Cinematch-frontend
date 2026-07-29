import React, { useState, useEffect } from 'react';
import { FaStar, FaBookmark, FaCheck, FaChevronLeft, FaChevronRight, FaTv } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Tvseries.css';

function TVShows() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlistIds(new Set(stored.map((m) => m.id)));
  }, []);

  useEffect(() => {
    fetchTVShows(page);
  }, [page]);

  const fetchTVShows = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
        params: {
          api_key: '104982ca487a975dd171416b2958f849',
          language: 'en-US',
          page: pageNumber,
        },
      });
      setShows(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (show) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlistIds.has(show.id)) {
      watchlist.push(show);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setWatchlistIds((prev) => new Set([...prev, show.id]));
      toast.success('Added to Watchlist!');
    } else {
      toast.info('Already in your Watchlist');
    }
  };

  const goToPage = (next) => {
    const clamped = Math.max(1, Math.min(next, totalPages));
    if (clamped !== page) setPage(clamped);
  };

  const getPageNums = () => {
    const range = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="tv-root">

      {/* ── HERO ── */}
      <section className="tv-hero">
        <div className="tv-hero__bg" />
        <div className="tv-hero__overlay" />
        <div className="tv-hero__content">
          <span className="tv-hero__eyebrow">
            <FaTv className="tv-hero__eyebrow-icon" />
            CineMatch · TV
          </span>
          <h1 className="tv-hero__title">Popular TV Shows</h1>
          <p className="tv-hero__sub">
            From prestige dramas to binge-worthy thrillers — discover what the world is watching and build your perfect watchlist.
          </p>
        </div>
        <div className="tv-hero__fade" />
      </section>

      {/* ── GRID SECTION ── */}
      <section className="tv-section">
        <div className="tv-container">

          {/* Header */}
          <div className="tv-header">
            <h2 className="tv-header__title">
              📺 Trending Shows
              <span className="tv-header__page">Page {page}</span>
            </h2>
            <p className="tv-header__count">{shows.length} titles</p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="tv-grid">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="tv-skeleton" />
              ))}
            </div>
          ) : (
            <div className="tv-grid">
              {shows.map((show, idx) => {
                const inList = watchlistIds.has(show.id);
                return (
                  <div key={show.id} className="tv-card">
                    <div className="tv-card__rank">
                      #{(page - 1) * 20 + idx + 1}
                    </div>

                    <div className="tv-card__img-wrap">
                      <img
                        src={
                          show.poster_path
                            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                            : 'https://via.placeholder.com/300x450/0A0E1A/8B9DC3?text=No+Poster'
                        }
                        alt={show.name}
                        className="tv-card__img"
                        loading="lazy"
                      />
                      <div className="tv-card__hover">
                        <p className="tv-card__overview">
                          {show.overview?.slice(0, 120)}…
                        </p>
                        <Link to={`/tvshows/${show.id}`} className="tv-card__detail-btn">
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="tv-card__body">
                      <h3 className="tv-card__title">{show.name}</h3>
                      <div className="tv-card__meta">
                        <span className="tv-card__rating">
                          <FaStar className="tv-card__star" />
                          {show.vote_average?.toFixed(1)}
                        </span>
                        <span className="tv-card__year">
                          {show.first_air_date?.slice(0, 4)}
                        </span>
                      </div>
                      <button
                        className={`tv-card__wl-btn ${inList ? 'tv-card__wl-btn--active' : ''}`}
                        onClick={() => addToWatchlist(show)}
                      >
                        {inList ? (
                          <><FaCheck className="tv-card__wl-icon" /> In Watchlist</>
                        ) : (
                          <><FaBookmark className="tv-card__wl-icon" /> Add to Watchlist</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PAGINATION ── */}
          <div className="tv-pagination">
            <button
              className="tv-page-btn tv-page-btn--arrow"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
            </button>

            {page > 3 && (
              <>
                <button className="tv-page-btn" onClick={() => goToPage(1)}>1</button>
                {page > 4 && <span className="tv-page-ellipsis">…</span>}
              </>
            )}

            {getPageNums().map((n) => (
              <button
                key={n}
                className={`tv-page-btn ${n === page ? 'tv-page-btn--active' : ''}`}
                onClick={() => goToPage(n)}
              >
                {n}
              </button>
            ))}

            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="tv-page-ellipsis">…</span>}
                <button className="tv-page-btn" onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}

            <button
              className="tv-page-btn tv-page-btn--arrow"
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
        toastClassName="tv-toast"
      />
    </div>
  );
}

export default TVShows;