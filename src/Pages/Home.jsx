import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaChevronLeft, FaChevronRight, FaFire, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import './Home.css';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardsRef = useRef(null);

  useEffect(() => {
    async function fetchPopularMovies() {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: '104982ca487a975dd171416b2958f849',
            language: 'en-US',
            page: 1,
          },
        });
        setPopularMovies(response.data.results.slice(0, 8));
        setTrendingMovies(response.data.results.slice(0, 6));
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    }
    fetchPopularMovies();
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    if (trendingMovies.length === 0) return;
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [trendingMovies.length, activeSlide]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev + 1) % trendingMovies.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const currentMovie = trendingMovies[activeSlide];

  const genres = [
    { name: 'Action', icon: '⚡', color: '#FF4D4D' },
    { name: 'Comedy', icon: '😂', color: '#FFD700' },
    { name: 'Romance', icon: '❤️', color: '#FF69B4' },
    { name: 'Sci-Fi', icon: '🚀', color: '#00BFFF' },
    { name: 'Horror', icon: '👻', color: '#8A2BE2' },
    { name: 'Drama', icon: '🎭', color: '#20B2AA' },
  ];

  return (
    <div className="cm-root">

      {/* ── FILMSTRIP TICKER ── */}
      <div className="cm-ticker">
        <div className="cm-ticker__track">
          {['NOW SHOWING', 'NEW RELEASES', 'TOP RATED', 'COMING SOON', 'TRENDING', 'MUST WATCH', 'CRITIC PICKS', 'HIDDEN GEMS'].map((label, i) => (
            <span key={i} className="cm-ticker__item">
              <span className="cm-ticker__dot" />
              {label}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {['NOW SHOWING', 'NEW RELEASES', 'TOP RATED', 'COMING SOON', 'TRENDING', 'MUST WATCH', 'CRITIC PICKS', 'HIDDEN GEMS'].map((label, i) => (
            <span key={`b${i}`} className="cm-ticker__item">
              <span className="cm-ticker__dot" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO CINEMATIC SLIDER ── */}
      <section className="cm-hero">
        {currentMovie && (
          <>
            {/* Background images (crossfade) */}
            {trendingMovies.map((movie, i) => (
              <div
                key={movie.id}
                className={`cm-hero__bg ${i === activeSlide ? 'cm-hero__bg--active' : ''}`}
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}
              />
            ))}

            {/* Gradient overlays */}
            <div className="cm-hero__overlay cm-hero__overlay--bottom" />
            <div className="cm-hero__overlay cm-hero__overlay--left" />

            {/* Content */}
            <div className="cm-hero__content">
              <div className="cm-hero__eyebrow">
                <FaFire className="cm-hero__fire" />
                <span>TRENDING #{activeSlide + 1}</span>
              </div>

              <h1 className="cm-hero__title">{currentMovie.title}</h1>

              <div className="cm-hero__meta">
                <span className="cm-hero__rating">
                  <FaStar className="cm-hero__star" />
                  {currentMovie.vote_average?.toFixed(1)}
                </span>
                <span className="cm-hero__divider" />
                <span className="cm-hero__year">
                  {currentMovie.release_date?.slice(0, 4)}
                </span>
              </div>

              <p className="cm-hero__overview">
                {currentMovie.overview?.slice(0, 160)}...
              </p>

              <div className="cm-hero__actions">
                <Link to={`/movie/${currentMovie.id}`} className="cm-btn cm-btn--primary">
                  <FaPlay className="cm-btn__icon" />
                  View Details
                </Link>
                <button className="cm-btn cm-btn--ghost">
                  <FaBookmark className="cm-btn__icon" />
                  Watchlist
                </button>
              </div>
            </div>

            {/* Slide nav dots */}
            <div className="cm-hero__dots">
              {trendingMovies.map((_, i) => (
                <button
                  key={i}
                  className={`cm-hero__dot ${i === activeSlide ? 'cm-hero__dot--active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                />
              ))}
            </div>

            {/* Arrow controls */}
            <button className="cm-hero__arrow cm-hero__arrow--prev" onClick={goToPrev}>
              <FaChevronLeft />
            </button>
            <button className="cm-hero__arrow cm-hero__arrow--next" onClick={goToNext}>
              <FaChevronRight />
            </button>

            {/* Thumbnail strip */}
            <div className="cm-hero__thumbs">
              {trendingMovies.map((movie, i) => (
                <button
                  key={movie.id}
                  className={`cm-hero__thumb ${i === activeSlide ? 'cm-hero__thumb--active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                    alt={movie.title}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── GENRES ── */}
      <section className="cm-section cm-section--dark">
        <div className="cm-container">
          <div className="cm-section__header">
            <h2 className="cm-section__title">Browse by Genre</h2>
            <Link to="/movies" className="cm-section__link">See all →</Link>
          </div>
          <div className="cm-genres">
            {genres.map((g) => (
              <Link
                key={g.name}
                to={`/movies?genre=${g.name.toLowerCase()}`}
                className="cm-genre-pill"
                style={{ '--genre-color': g.color }}
              >
                <span className="cm-genre-pill__icon">{g.icon}</span>
                <span>{g.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR IN WATCHLISTS ── */}
      <section className="cm-section">
        <div className="cm-container">
          <div className="cm-section__header">
            <h2 className="cm-section__title">
              <span className="cm-section__accent">🔥</span> Popular in Watchlists
            </h2>
            <Link to="/movies" className="cm-section__link">View all →</Link>
          </div>

          <div className="cm-grid" ref={cardsRef}>
            {popularMovies.length > 0 ? (
              popularMovies.map((movie, idx) => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="cm-card">
                  <div className="cm-card__rank">#{idx + 1}</div>
                  <div className="cm-card__img-wrap">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/300x450/0A0E1A/8B9DC3?text=No+Poster'
                      }
                      alt={movie.title}
                      className="cm-card__img"
                    />
                    <div className="cm-card__overlay">
                      <div className="cm-card__play">
                        <FaPlay />
                      </div>
                    </div>
                  </div>
                  <div className="cm-card__body">
                    <h3 className="cm-card__title">{movie.title}</h3>
                    <div className="cm-card__footer">
                      <span className="cm-card__rating">
                        <FaStar className="cm-card__star" />
                        {movie.vote_average?.toFixed(1)}
                      </span>
                      <span className="cm-card__year">{movie.release_date?.slice(0, 4)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="cm-loading">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="cm-skeleton" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cm-cta">
        <div className="cm-cta__bg" />
        <div className="cm-container cm-cta__inner">
          <div className="cm-cta__text">
            <h2 className="cm-cta__title">Your next favorite film is one click away.</h2>
            <p className="cm-cta__sub">
              Build your watchlist, track what you've seen, and get recommendations tailored to your taste.
            </p>
          </div>
          <div className="cm-cta__actions">
            <Link to="/register" className="cm-btn cm-btn--primary cm-btn--lg">
              Create Free Account
            </Link>
            <Link to="/movies" className="cm-btn cm-btn--outline cm-btn--lg">
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;